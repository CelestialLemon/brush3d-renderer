import * as THREE from 'three';
import { NOISE } from './glsl';
import { SHELTER_GLSL } from './shelter';

// The ground's state (#11): a map over the land the game sends, as it sends the water's (#18), of how wet the ground is
// and how muddy, sent again whenever it changes. The game owns them: rain wets the land, sun and wind dry it, traffic
// churns its tracks to mud; the renderer only draws what it's given (decided with the developer, 2026-11-03, on #11).
// Snow and frost (#14) are to join it.
//
// What the renderer adds is only how it looks at a finer scale than the game's tiles:
// - the ground under a roof stays dry to the roof's edge (the shelter map, #10), and under a crown partly;
// - puddles: soaked ground fills the land's own dips (its hollows, the sunken tracks), muddy ground first. The dips are
//   found once, from the ground's shape (HollowMap), so the game doesn't place puddles.
//
// The grid is the water's: a corner at (x0, z0), nx by nz cells of `cell` metres, x fastest. Off the grid each point takes
// the nearest edge cell's values, so a map of one cell covers the whole land (the game can start with one value).

/** The ground's state the game sends: a grid over the land (see above). */
export interface GroundMap {
  nx: number; nz: number; cell: number; x0: number; z0: number;
  /** How wet the ground is per cell, 0 dry to 1 soaked. */
  wet: Float32Array;
  /** How muddy per cell, 0 to 1: tracks and bare soil, wet and churned (none if left out). */
  mud?: Float32Array;
}

/** How long a changed map takes to ease in by default, seconds: the water's. */
export const GROUND_EASE = 0.6;

/**
 * The GLSL that reads the ground's map: `groundState(xz)` is (wet, mud, 0, 0) there, as eased; all 0 with no map, or one
 * that's dry everywhere.
 */
export const GROUND_GLSL = /* glsl */ `
uniform sampler2D tGroundA;     // the ground as it was (wet, mud per cell, a byte each)
uniform sampler2D tGroundB;     // the ground as last sent
uniform float uGroundBlend;     // how far it has eased from A to B
uniform vec4 uGroundGrid;       // x0, z0, 1 / the grid's width, 1 / its depth (metres)
uniform float uGroundOn;        // 0 when it's dry everywhere, as it was and as last sent
vec4 groundState(vec2 xz) {
  if (uGroundOn < 0.5) return vec4(0.0);
  vec2 uv = (xz - uGroundGrid.xy) * uGroundGrid.zw;
  return mix(texture(tGroundA, uv), texture(tGroundB, uv), uGroundBlend);
}
`;

/**
 * The ground as drawn: the map last sent, eased in from what was drawn before, as two textures (a byte per value per
 * cell, filtered between cells) the shaders blend. The renderer owns one and shares its uniforms with every material.
 */
export class GroundField {
  readonly uniforms = {
    tGroundA: { value: cellTexture(1, 1) },
    tGroundB: { value: cellTexture(1, 1) },
    uGroundBlend: { value: 1 },
    uGroundGrid: { value: new THREE.Vector4(0, 0, 1, 1) },
    uGroundOn: { value: 0 },
  };
  /** Whether any of the land is wet or muddy, as it was or as last sent. */
  get any() { return this.uniforms.uGroundOn.value > 0.5; }
  private nx = 0; private nz = 0; private cell = 0; private x0 = 0; private z0 = 0;
  private from: Uint8Array | null = null;
  private to: Uint8Array | null = null;
  private wetFrom = false; private wetTo = false;
  private start = 0;
  private ease = 0;

  /** How far it has eased from what was drawn to what was sent, at a time (seconds, the renderer's clock). */
  blend(time: number) {
    if (this.ease <= 0) return 1;
    const t = THREE.MathUtils.clamp((time - this.start) / this.ease, 0, 1);
    return t * t * (3 - 2 * t);
  }

  /** Each frame: the blend at the frame's time. Once the ease is done, what it eased from no longer counts. */
  update(time: number) {
    const b = this.blend(time);
    this.uniforms.uGroundBlend.value = b;
    if (b >= 1 && this.wetFrom !== this.wetTo) { this.wetFrom = this.wetTo; this.uniforms.uGroundOn.value = this.wetTo ? 1 : 0; }
  }

  /**
   * Takes a map from the game, to ease in over `ease` seconds from the ground as drawn at `time` (0: at once). A map on a
   * new grid comes in at once. Null: dry everywhere.
   */
  set(map: GroundMap | null, time: number, ease = GROUND_EASE) {
    const u = this.uniforms;
    if (!map) {
      this.from = this.to = null; this.wetFrom = this.wetTo = false; u.uGroundOn.value = 0;
      return;
    }
    const { nx, nz, cell, x0, z0, wet, mud } = map, n = nx * nz;
    if (wet.length !== n || (mud && mud.length !== n)) throw new Error(`ground map: ${wet.length} values for ${nx} x ${nz} cells`);
    const data = new Uint8Array(n * 4);
    let any = false;
    for (let i = 0; i < n; i++) {
      const w = Math.round(THREE.MathUtils.clamp(wet[i] || 0, 0, 1) * 255), m = Math.round(THREE.MathUtils.clamp(mud?.[i] || 0, 0, 1) * 255);
      data[i * 4] = w; data[i * 4 + 1] = m;
      if (w | m) any = true;
    }
    const same = this.to && nx === this.nx && nz === this.nz && cell === this.cell && x0 === this.x0 && z0 === this.z0;
    if (!same) {
      this.nx = nx; this.nz = nz; this.cell = cell; this.x0 = x0; this.z0 = z0;
      u.tGroundA.value.dispose(); u.tGroundB.value.dispose();
      u.tGroundA.value = cellTexture(nx, nz); u.tGroundB.value = cellTexture(nx, nz);
      u.uGroundGrid.value.set(x0, z0, 1 / (nx * cell), 1 / (nz * cell));
      this.from = data; this.wetFrom = any; ease = 0;
    } else {
      // What's drawn now becomes where it eases from.
      const b = this.blend(time), from = this.from!, to = this.to!;
      if (b >= 1) { this.from = to; this.wetFrom = this.wetTo; } else {
        const now = new Uint8Array(from.length);
        for (let i = 0; i < now.length; i++) now[i] = Math.round(from[i] + (to[i] - from[i]) * b);
        this.from = now; this.wetFrom ||= this.wetTo;
      }
    }
    this.to = data; this.wetTo = any;
    this.start = time; this.ease = ease;
    upload(u.tGroundA.value, this.from);
    upload(u.tGroundB.value, data);
    u.uGroundBlend.value = this.blend(time);
    u.uGroundOn.value = any || (ease > 0 && this.wetFrom) ? 1 : 0;
  }
}

/** A cell texture: RGBA bytes per cell, filtered between cells' centres, clamped to the edge cells beyond. */
function cellTexture(nx: number, nz: number) {
  const t = new THREE.DataTexture(new Uint8Array(nx * nz * 4), nx, nz, THREE.RGBAFormat, THREE.UnsignedByteType);
  t.minFilter = t.magFilter = THREE.LinearFilter;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.needsUpdate = true;
  return t;
}

function upload(t: THREE.DataTexture, data: Uint8Array) {
  t.image.data = data;
  t.needsUpdate = true;
}

// ---------------------------------------------------------------------------------------------------------------------
// The land's dips, for the puddles.

/**
 * The GLSL that reads the land's dips: `hollowAt(xz)` is (x) how far the ground there lies below the ground round it
 * (metres; 0 or less where it doesn't), the deeper of a track's width round it and a hollow's; (y) the ground's own
 * unevenness, about -1..1, keyed to the world: which parts of a dip hold the water, so a sunken track holds a string of
 * puddles rather than one long one; and (z) how sheltered the ground there is (shelter(p) at the ground, 0..1), so
 * what's drawn at the ground reads it here at no cost rather than in the shelter map's eight lookups. (0, 0, -1) off
 * the map or before it's drawn.
 */
export const HOLLOW_GLSL = /* glsl */ `
uniform sampler2D tHollows;
uniform mat3 uHollowsMap;       // x, z to the map's uv
uniform float uHollowsOn;
vec3 hollowAt(vec2 xz) {
  if (uHollowsOn < 0.5) return vec3(0.0, 0.0, -1.0);
  vec2 uv = (uHollowsMap * vec3(xz, 1.0)).xy;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec3(0.0, 0.0, -1.0);
  return texture(tHollows, uv).xyz;
}
`;

/** The square of land the dips are found over: the ground's (its brush's), centred at x, z, `side` across, turned. */
export interface HollowArea { x: number; z: number; side: number; turn: number }

/**
 * How far round a point the ground is averaged to find a dip, metres (a track's width, and a hollow's), and how much a
 * hollow counts against a track's dip.
 */
const NEAR = 1.2, FAR = 4, FAR_WEIGHT = 0.8;

/**
 * The land's dips, found once from the ground's shape: the ground drawn from straight above into a depth map (its height
 * at each texel, exactly), then each texel's height taken from the average round it, near and far. Drawn again only
 * when the ground changes. `size` texels across (1024: 17 cm over the farm's valley).
 */
export class HollowMap {
  readonly uniforms = {
    tHollows: { value: null as THREE.Texture | null },
    uHollowsMap: { value: new THREE.Matrix3() },
    uHollowsOn: { value: 0 },
  };
  /** Whether the ground has changed since it was drawn. */
  dirty = true;
  private heights: THREE.WebGLRenderTarget;
  private dips: THREE.WebGLRenderTarget;
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quadScene = new THREE.Scene();
  private material: THREE.ShaderMaterial;

  constructor(readonly size = 1024) {
    this.heights = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true, format: THREE.RedFormat });
    this.heights.depthTexture = new THREE.DepthTexture(size, size, THREE.UnsignedIntType);
    this.dips = new THREE.WebGLRenderTarget(size, size, {
      type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
    });
    this.uniforms.tHollows.value = this.dips.texture;
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VERT, fragmentShader: DIPS_FRAG,
      uniforms: {
        tHeights: { value: this.heights.depthTexture }, uSide: { value: 1 }, uRange: { value: new THREE.Vector2() },
        uUnmap: { value: new THREE.Matrix3() },
      },
      depthTest: false, depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    quad.frustumCulled = false;
    this.quadScene.add(quad);
  }

  /** The ground has changed (added, removed, reshaped): the dips are found again before they're next read. */
  changed() { this.dirty = true; }

  /**
   * Finds the dips, if the ground has changed: `grounds` drawn with `depth` (a material writing depth only) from straight
   * above over `area`, everything else in `scene` hidden.
   */
  draw(
    gl: THREE.WebGLRenderer, scene: THREE.Scene, grounds: THREE.Mesh[], depth: THREE.Material, area: HollowArea | null,
    shelter: Record<string, THREE.IUniform>,
  ) {
    if (!this.dirty) return;
    this.dirty = false;
    const u = this.uniforms;
    if (!area || grounds.length === 0) { u.uHollowsOn.value = 0; return; }
    const box = new THREE.Box3();
    for (const g of grounds) box.expandByObject(g);
    const bottom = box.min.y - 1, top = box.max.y + 1;
    const c = this.camera, h = area.side / 2;
    c.left = -h; c.right = h; c.top = h; c.bottom = -h; c.near = 0; c.far = top - bottom;
    c.position.set(area.x, top, area.z);
    c.up.set(-Math.sin(area.turn), 0, -Math.cos(area.turn));
    c.lookAt(area.x, bottom, area.z);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    // x, z to the map's uv: the camera's view and projection, on the plane, then -1..1 to 0..1.
    const m = new THREE.Matrix4().multiplyMatrices(c.projectionMatrix, c.matrixWorldInverse).elements;
    u.uHollowsMap.value.set(
      0.5 * m[0], 0.5 * m[8], 0.5 * m[12] + 0.5,
      0.5 * m[1], 0.5 * m[9], 0.5 * m[13] + 0.5,
      0, 0, 1,
    );

    const hidden: THREE.Object3D[] = [];
    for (const o of scene.children) if (o.visible) { o.visible = false; hidden.push(o); }
    const saved = grounds.map((g) => [g, g.material] as const);
    for (const g of grounds) { g.visible = true; g.material = depth; }
    gl.setRenderTarget(this.heights);
    gl.clear(false, true, false);
    gl.render(scene, c);
    for (const [g, material] of saved) { g.material = material; g.visible = false; }
    for (const o of hidden) o.visible = true;

    const mu = this.material.uniforms;
    Object.assign(mu, shelter);
    mu.uSide.value = area.side;
    mu.uRange.value.set(top, top - bottom);
    mu.uUnmap.value.copy(u.uHollowsMap.value).invert();
    gl.setRenderTarget(this.dips);
    gl.render(this.quadScene, this.camera);
    gl.setRenderTarget(null);
    u.uHollowsOn.value = 1;
  }

  dispose() { this.heights.dispose(); this.dips.dispose(); this.material.dispose(); }
}

const QUAD_VERT = /* glsl */ `
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Each texel: the ground's height (from the depth map: height = top - depth * range; a texel with no ground is left
// out), how far it lies below the average of the ground round it within NEAR and within FAR (sampled on a spiral), the
// deeper of the two; the ground's unevenness, keyed to the world; and how sheltered the ground is.
const DIPS_FRAG = /* glsl */ `
precision highp float;
${NOISE}
${SHELTER_GLSL}
uniform highp sampler2D tHeights;
uniform float uSide;
uniform vec2 uRange;
uniform mat3 uUnmap;
in vec2 vUv;
out vec4 fragColor;
float heightAt(vec2 uv, out float ok) {
  float d = texture(tHeights, uv).r;
  ok = d < 1.0 && all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0))) ? 1.0 : 0.0;
  return uRange.x - d * uRange.y;
}
float around(vec2 uv, float radius, float h0) {
  float sum = 0.0, n = 0.0, ok;
  for (int i = 0; i < 48; i++) {
    float r = sqrt((float(i) + 0.5) / 48.0) * radius / uSide, a = float(i) * 2.39996;
    float h = heightAt(uv + vec2(cos(a), sin(a)) * r, ok);
    sum += h * ok; n += ok;
  }
  return n > 0.0 ? sum / n - h0 : 0.0;
}
void main() {
  float ok;
  float h0 = heightAt(vUv, ok);
  if (ok < 0.5) { fragColor = vec4(0.0); return; }
  vec2 xz = (uUnmap * vec3(vUv, 1.0)).xy;
  float uneven = fbm2(xz * 0.6 + 4.0) * 0.9 + snoise(xz * 1.4 + 11.0) * 0.1;
  float dip = max(around(vUv, ${NEAR.toFixed(1)}, h0), around(vUv, ${FAR.toFixed(1)}, h0) * ${FAR_WEIGHT});
  fragColor = vec4(dip, uneven, shelter(vec3(xz.x, h0, xz.y)), 1.0);
}
`;

// ---------------------------------------------------------------------------------------------------------------------
// How wet things look.

/**
 * The looks for wet things, while the developer picks (#11): the demo's buttons and URL options. Each value is its letter
 * (a, b, c); the ones not picked are removed before the pull request merges.
 */
export const WET_LOOKS = {
  /** Painted things (the ground, grass, crops, leaves, stones) when wet. */
  damp: {
    a: 'richer: a little darker, the colour deeper',
    b: 'darker: much darker, the colour a little deeper',
  },
  /** Inked things (what people build) when wet. */
  sheen: {
    a: 'streaks: bright streaks of wet shine where the surface turns to the light (the sun, or the bright sky overhead under cloud)',
    b: 'glaze: the surface mirrors the sky faintly, the clouds drifting over it, more at a glancing angle',
    c: 'both',
  },
  /** Puddles in the land's dips. */
  puddles: {
    a: 'mirror: the sky and the clouds in them, clear, inside a dark wet rim',
    b: 'pale: a flat, pale patch of the sky\'s colour, its edge soft',
  },
  /** Mud on tracks and bare soil. */
  mudLook: {
    a: 'dark: dark, rich brown earth',
    b: 'churned: dark brown, with streaks of wet shine',
  },
} as const;
export type WetLooks = { [K in keyof typeof WET_LOOKS]: keyof (typeof WET_LOOKS)[K] };
export const DEFAULT_WET_LOOKS: WetLooks = { damp: 'a', sheen: 'a', puddles: 'a', mudLook: 'a' };

/** The looks as the shaders take them: each letter as 0, 1, 2. */
export function wetLookVector(looks: WetLooks, out: THREE.Vector4) {
  const n = (l: string) => l.charCodeAt(0) - 97;
  return out.set(n(looks.damp), n(looks.sheen), n(looks.puddles), n(looks.mudLook));
}

/**
 * How wet things look, for every material but the water: `wetLook(color, normal, ink)` at the end of the painting
 * (writeGBuffer), from the ground's state where the surface is (wetAt). Needs the light model (CLOUD_LIGHT, PAINT), the
 * mirrored sky (MIRROR_SKY), the water map and toCamera(); the ground's own (puddles, mud) under GROUND.
 * - Wet ground goes dark before it's soaked (half wet looks soaked), and puddles come only once it's well soaked.
 * - Under a roof it stays dry, to the roof's edge, and under a crown partly (the shelter map): the game's tiles are coarse.
 */
export const WET_GLSL = /* glsl */ `
${SHELTER_GLSL}
${GROUND_GLSL}
${HOLLOW_GLSL}
uniform vec4 uWetLook;   // the looks being picked (#11): painted, inked, puddles, mud; 0 for A, 1 B, 2 C
// The ground's state where the surface is, as drawn: how wet and how muddy, dry under shelter (wetAt).
float gWet = 0.0, gMud = 0.0;
vec3 gHollow = vec3(0.0, 0.0, -1.0);
void wetAt(vec3 p) {
  vec4 g = groundState(p.xz);
  gWet = g.x; gMud = g.y;
  if (gWet + gMud < 0.004) { gWet = 0.0; gMud = 0.0; return; }
  // Not in the water's reflection: blurred and broken by the ripples, a dry patch under a roof wouldn't show.
  if (uMirror > 0.5) return;
#ifdef AT_GROUND
  // Drawn at the ground (the ground, grass, crops): its shelter is the ground's, read with its dips.
  gHollow = hollowAt(p.xz);
  float cover = gHollow.z >= 0.0 ? gHollow.z : shelter(p);
#else
  float cover = shelter(p);
#endif
  gWet *= 1.0 - cover; gMud *= 1.0 - cover;
}
// Towards the camera, as seen in the water's reflection when drawing it.
vec3 wetView() {
  vec3 v = toCamera();
  if (uMirror > 0.5) v.y = -v.y;
  return v;
}
// Painted things go darker and richer. In plain RGB, not OKLab (half the cost, and on the ground it's paid on every
// pixel): the colour pushed away from its own grey, then darkened.
const vec3 WET_LUMA = vec3(0.2126, 0.7152, 0.0722);
vec3 wetPainted(vec3 c, float w) {
  vec2 k = uWetLook.x < 0.5 ? vec2(0.49, 0.3) : vec2(0.69, 0.15);
  float y = dot(c, WET_LUMA);
  return max(mix(vec3(y), c, 1.0 + k.y * w), 0.0) * (1.0 - k.x * w);
}
// Inked things darken a little (wet paint and timber) and take a sheen.
vec3 wetInked(vec3 c, vec3 n, vec3 p, float w) {
  float y = dot(c, WET_LUMA);
  c = max(mix(vec3(y), c, 1.0 + 0.12 * w), 0.0) * (1.0 - 0.27 * w);
  vec3 v = wetView(), r = reflect(-v, n);
  float sky = overcastHere().x;
  if (uWetLook.y < 0.5 || uWetLook.y > 1.5) {
    // Streaks: where the mirrored view meets the light, the sun's or, under cloud, the bright sky's overhead.
    vec3 l = normalize(mix(uSunDir, vec3(0.0, 1.0, 0.0), sky));
    // Under cloud the bright sky is broad, and so is its band.
    float band = smoothstep(mix(0.7, 0.5, sky), mix(0.88, 0.66, sky), dot(r, l));
    // In streaks down the surface, as the water runs (a flat roof faces one way: a band alone would light it all).
    vec3 down = normalize(vec3(0.0, -1.0, 0.0) - n * -n.y + vec3(1e-4, 0.0, 0.0));
    vec3 across = cross(n, down);
    band *= smoothstep(0.1, 0.6, strokes(vec2(dot(p, down) * 0.6, dot(p, across) * 1.2), 0.0) * 0.5 + 0.5);
    vec3 shine = exposeHere(mix(mix(uGapSkyBottom, vec3(1.0), 0.6) * skyTint(), vec3(1.0) * sunTint(), 1.0 - sky));
    c = mix(c, shine, band * w * 0.55);
  }
  if (uWetLook.y > 0.5) {
    // Glaze: the sky mirrored, with its clouds, more at a glancing angle.
    float cloud;
    vec3 seen = exposeHere(mirrorSky(skyPoint(p, r), 1.0 - clamp(r.y * 1.5, 0.0, 1.0), cloud));
    float fres = 0.1 + 0.35 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
    c = mix(c, seen, fres * w);
  }
  return c;
}
#ifdef GROUND
// Mud: the earth darker and browner (in OKLab). Only on the earth itself (the surface's own colour: red over green, not
// grass): the game's tiles are coarser than a track, and mud on the grass beside it would read as a brown halo.
float mudHere(float mud) { return mud * smoothstep(0.9, 1.05, vColor.r / max(vColor.g, 1e-4)); }
vec3 muddy(vec3 c, float m) {
  // A dark brown (sRGB 110, 75, 50 as against its own grey) at a fifth of the earth's brightness.
  vec3 mud = dot(c, WET_LUMA) * 0.22 * vec3(1.82, 0.82, 0.36);
  return mix(c, mud, m * 0.9);
}
// Churned mud: streaks of wet shine, the sky caught in the ruts.
vec3 churned(vec3 c, vec3 p, float m) {
  float s = smoothstep(0.45, 0.8, strokes(p.xz * 1.6, 0.6) + fbm2(p.xz * 0.7) * 0.3);
  return mix(c, exposeHere(mix(uGapSkyTop, uGapSkyBottom, 0.4)), s * m * 0.4);
}
// Puddles: soaked ground fills its low places. How likely a spot is to hold water: muddy, bare ground (a track, a yard)
// does, and grass only in a real hollow (a gentle swell's dip, a few centimetres, doesn't), with the ground's unevenness
// picking which parts of it do, so a track holds a string of separate puddles, a hollow a pool, a lawn none. They grow as the ground
// soaks (none until it's well wet). Not under the water itself.
float puddleAt(vec3 p, float wet, float mud, out float inner) {
  inner = 0.0;
  float fill = smoothstep(0.55, 1.0, wet + 0.3 * mud);
  if (fill <= 0.0 || uMirror > 0.5) return 0.0;
  vec2 d = gHollow.xy;
  float bare = smoothstep(0.15, 0.6, mud) * (0.75 + 0.25 * smoothstep(0.01, 0.05, d.x));
  float low = max(smoothstep(0.05, 0.14, d.x), bare);
  float score = low + 0.6 * d.y, level = mix(1.75, 1.06, fill);
  if (score <= level || p.y < waterTop(p.xz) + 0.02) return 0.0;
  inner = smoothstep(level + 0.03, level + 0.08, score);
  return smoothstep(level, level + 0.02, score);
}
vec3 puddled(vec3 c, vec3 p, float mud) {
  float inner, puddle = puddleAt(p, gWet, mud, inner);
  if (puddle <= 0.0) return c;
  vec3 r = reflect(-wetView(), vec3(0.0, 1.0, 0.0));
  if (uWetLook.z < 0.5) {
    // Mirror: the sky and its clouds, inside a dark wet rim.
    float cloud;
    vec3 sky = exposeHere(mirrorSky(skyPoint(p, r), 0.25, cloud));
    c = mix(c, c * 0.62, puddle);
    return mix(c, mix(c, sky, 0.78), inner);
  }
  // Pale: a flat patch of the sky's colour.
  vec3 sky = exposeHere(mix(uGapSkyTop, uGapSkyBottom, 0.35));
  return mix(c, mix(c, sky, 0.6), smoothstep(0.0, 1.0, puddle * 0.6 + inner * 0.4));
}
#endif
vec3 wetLook(vec3 c, vec3 n, float ink) {
  wetAt(vWorldPos);
  if (gWet + gMud <= 0.0) return c;
  float w = smoothstep(0.0, 0.5, gWet);
  if (ink > 0.5) return w > 0.0 ? wetInked(c, n, vWorldPos, w) : c;
#ifdef GROUND
  float m = mudHere(gMud);
#else
  float m = 0.0;
#endif
  if (w + m <= 0.0) return c;
  c = wetPainted(c, w);
#ifdef GROUND
  if (m > 0.0) c = muddy(c, m);
  if (m > 0.0 && uWetLook.w > 0.5) c = churned(c, vWorldPos, m);
  c = puddled(c, vWorldPos, m);
#endif
  return c;
}
`;
