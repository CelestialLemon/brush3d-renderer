import * as THREE from 'three';
import { NOISE } from './glsl';
import { SHELTER_GLSL } from './shelter';

// The ground's state (#14, designed for wet ground in #11): a map over the land the game sends, as it sends the water's
// (#18), sent again whenever it changes. The game owns it: snow falls and lies and melts, frost forms in the night and
// goes in the sun, by the game's rules; the renderer only draws what it's given (decided with the developer, 2026-11-10,
// on #14). Each value is one per cell of the grid:
// - snow: how deep it lies, 0 none, about 0.2 a dusting the grass pokes through, about 0.5 the grass covered, 1 deep
//   (crops buried to their tops). Roofs and solar panels take the snow of the cells they stand over: to clear a panel,
//   the game zeroes its cells (the ground under it is sheltered, and shows none anyway);
// - frost: how much, 0..1 (#14, drawn in a later step);
// - wet: how wet the ground is, 0 dry to 1 soaked (#11): rain wets it, sun and wind dry it, by the game's rules;
// - mud: how muddy, 0..1 (#11): the game knows where its tracks and bare soil are, and mud may matter to its play.
// Wet ground was first tried on this map in #50, closed unmerged for its puddles; #11's second try is drawn without them.
//
// What the renderer adds is only how it looks at a finer scale than the game's cells: none under a roof, to the roof's
// edge, and less under a crown (the shelter map, #10); the land's own hollows and rises (HollowMap), found once from the
// ground's shape.
//
// The grid is the water's: a corner at (x0, z0), nx by nz cells of `cell` metres, x fastest. Off the grid each point takes
// the nearest edge cell's values, so a map of one cell covers the whole land (the game can start with one value).

/** The ground's state the game sends: a grid over the land (see above). Values left out are none. */
export interface GroundMap {
  nx: number; nz: number; cell: number; x0: number; z0: number;
  /** How deep the snow lies per cell, 0 none to 1 deep (see above). */
  snow?: Float32Array;
  /** How much frost per cell, 0..1. */
  frost?: Float32Array;
  /** How wet the ground is per cell, 0 dry to 1 soaked (#11). */
  wet?: Float32Array;
  /** How muddy per cell, 0..1: tracks and bare soil, wet and churned (#11). */
  mud?: Float32Array;
}

/** How long a changed map takes to ease in by default, seconds: the water's. */
export const GROUND_EASE = 0.6;

/** The values in the map's texture, in its channels' order. */
const CHANNELS = ['snow', 'frost', 'wet', 'mud'] as const;

/**
 * The GLSL that reads the ground's map: `groundState(xz)` is (snow, frost, wet, mud) there, as eased; all 0 with no map,
 * or one that's bare everywhere.
 */
export const GROUND_GLSL = /* glsl */ `
uniform sampler2D tGroundA;     // the ground as it was (snow, frost, wet, mud per cell, a byte each)
uniform sampler2D tGroundB;     // the ground as last sent
uniform float uGroundBlend;     // how far it has eased from A to B
uniform vec4 uGroundGrid;       // x0, z0, 1 / the grid's width, 1 / its depth (metres)
uniform float uGroundOn;        // 0 when it's bare everywhere, as it was and as last sent; 2 drawing the bed under the water
// The last read, kept: a material's wet and its snow read the same point, and the second takes the first's (#11).
vec2 gGroundAt = vec2(-1e30);
vec4 gGroundHere = vec4(0.0);
vec4 groundState(vec2 xz) {
  if (uGroundOn < 0.5) return vec4(0.0);
  if (xz == gGroundAt) return gGroundHere;
  vec2 uv = (xz - uGroundGrid.xy) * uGroundGrid.zw;
  // Once it has eased in (nearly always), only the map last sent.
  vec4 b = texture(tGroundB, uv);
  gGroundAt = xz;
  gGroundHere = uGroundBlend >= 1.0 ? b : mix(texture(tGroundA, uv), b, uGroundBlend);
  return gGroundHere;
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
  /** Whether any of the land has snow, frost, wet or mud, as it was or as last sent. */
  get any() { return this.uniforms.uGroundOn.value > 0.5; }
  private nx = 0; private nz = 0; private cell = 0; private x0 = 0; private z0 = 0;
  private from: Uint8Array | null = null;
  private to: Uint8Array | null = null;
  private anyFrom = false; private anyTo = false;
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
    if (b >= 1 && this.anyFrom !== this.anyTo) { this.anyFrom = this.anyTo; this.uniforms.uGroundOn.value = this.anyTo ? 1 : 0; }
  }

  /**
   * Takes a map from the game, to ease in over `ease` seconds from the ground as drawn at `time` (0: at once). A map on a
   * new grid comes in at once. Null: bare everywhere (eased as any map is).
   */
  set(map: GroundMap | null, time: number, ease = GROUND_EASE) {
    const u = this.uniforms;
    if (!map) {
      // Easing: to a bare map on the same grid (it turns off once the ease is done).
      const { nx, nz, cell, x0, z0 } = this;
      if (this.to && ease > 0) { this.set({ nx, nz, cell, x0, z0 }, time, ease); return; }
      this.from = this.to = null; this.anyFrom = this.anyTo = false; u.uGroundOn.value = 0;
      return;
    }
    const { nx, nz, cell, x0, z0 } = map, n = nx * nz;
    for (const k of CHANNELS) {
      const v = map[k];
      if (v && v.length !== n) throw new Error(`ground map: ${v.length} ${k} values for ${nx} x ${nz} cells`);
    }
    const data = new Uint8Array(n * 4);
    let any = false;
    CHANNELS.forEach((k, c) => {
      const v = k === 'mud' && map.mud ? spread(map.mud, nx, nz) : map[k];
      if (!v) return;
      for (let i = 0; i < n; i++) {
        const b = Math.round(THREE.MathUtils.clamp(v[i] || 0, 0, 1) * 255);
        data[i * 4 + c] = b;
        if (b) any = true;
      }
    });
    const same = this.to && nx === this.nx && nz === this.nz && cell === this.cell && x0 === this.x0 && z0 === this.z0;
    if (!same) {
      this.nx = nx; this.nz = nz; this.cell = cell; this.x0 = x0; this.z0 = z0;
      u.tGroundA.value.dispose(); u.tGroundB.value.dispose();
      u.tGroundA.value = cellTexture(nx, nz); u.tGroundB.value = cellTexture(nx, nz);
      u.uGroundGrid.value.set(x0, z0, 1 / (nx * cell), 1 / (nz * cell));
      this.from = data; this.anyFrom = any; ease = 0;
    } else {
      // What's drawn now becomes where it eases from.
      const b = this.blend(time), from = this.from!, to = this.to!;
      if (b >= 1) { this.from = to; this.anyFrom = this.anyTo; } else {
        const now = new Uint8Array(from.length);
        for (let i = 0; i < now.length; i++) now[i] = Math.round(from[i] + (to[i] - from[i]) * b);
        this.from = now; this.anyFrom ||= this.anyTo;
      }
    }
    this.to = data; this.anyTo = any;
    this.start = time; this.ease = ease;
    upload(u.tGroundA.value, this.from);
    upload(u.tGroundB.value, data);
    u.uGroundBlend.value = this.blend(time);
    u.uGroundOn.value = any || (ease > 0 && this.anyFrom) ? 1 : 0;
  }
}

/**
 * The mud spread a cell further (each cell the muddiest of it and its neighbours'), for the shaders to find the earth in
 * (wet.ts): a track is narrower than the game's cells and wanders through them, so the earth beside a muddy cell, in the
 * next one, is mud too; the earth's own colour, not the cells, then draws the mud's edge.
 */
function spread(mud: Float32Array, nx: number, nz: number) {
  const out = new Float32Array(mud.length);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    let m = 0;
    for (let b = Math.max(0, j - 1); b <= Math.min(nz - 1, j + 1); b++)
      for (let a = Math.max(0, i - 1); a <= Math.min(nx - 1, i + 1); a++) m = Math.max(m, mud[b * nx + a] || 0);
    out[j * nx + i] = m;
  }
  return out;
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
// The land's hollows and rises (from #50, where they held the puddles).

/**
 * The GLSL that reads the land's hollows: `hollowAt(xz)` is (x) how far the ground there lies below the ground round it
 * (metres; negative on a rise), the deeper of a track's width round it and a hollow's; (y) how far the ground there
 * faces up, 0 on a steep bank .. 1 on the flat, as its snow takes it; (z) how sheltered the ground there is (shelter(p) at the ground,
 * 0..1), so what's drawn at the ground reads it here in one lookup rather than in the shelter map's eight; and (w) the
 * pattern a thin snow breaks along (snow.ts's snowPattern), from the dip, the ground's own unevenness (keyed to the
 * world, so it breaks into patches of the land's shape rather than the brush's) and a finer drift, worked out once here.
 * (0, 0, -1, 0) off the map or before it's drawn.
 */
export const HOLLOW_GLSL = /* glsl */ `
uniform sampler2D tHollows;
uniform mat3 uHollowsMap;       // x, z to the map's uv
uniform float uHollowsOn;
vec4 hollowAt(vec2 xz) {
  if (uHollowsOn < 0.5) return vec4(0.0, 0.0, -1.0, 0.0);
  vec2 uv = (uHollowsMap * vec3(xz, 1.0)).xy;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec4(0.0, 0.0, -1.0, 0.0);
  return texture(tHollows, uv);
}
`;

/** The square of land the hollows are found over: the ground's (its brush's), centred at x, z, `side` across, turned. */
export interface HollowArea { x: number; z: number; side: number; turn: number }

/**
 * How far round a point the ground is averaged to find a hollow, metres (a track's width, and a hollow's), and how much a
 * hollow counts against a track's dip.
 */
const NEAR = 1.2, FAR = 4, FAR_WEIGHT = 0.8;

/**
 * The land's hollows, found once from the ground's shape: the ground drawn from straight above into a depth map (its
 * height at each texel, exactly), then each texel's height taken from the average round it, near and far. Drawn again
 * only when the ground or what shelters it changes. `size` texels across (1024: 17 cm over the farm's valley).
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

  /** The ground or its shelter has changed (added, removed, reshaped): found again before they're next read. */
  changed() { this.dirty = true; }

  /**
   * Finds the hollows, if the ground has changed: `grounds` drawn with `depth` (a material writing depth only) from
   * straight above over `area`, everything else in `scene` hidden.
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
// The ground's rise per metre along 'dir' (uv; 'metres' long): across both neighbours, or one-sided where the other is off
// the ground or the map.
float slopeAlong(vec2 dir, float h0, float metres) {
  float okP, okM;
  float hp = heightAt(vUv + dir, okP), hm = heightAt(vUv - dir, okM);
  if (okP > 0.5 && okM > 0.5) return (hp - hm) / (2.0 * metres);
  if (okP > 0.5) return (hp - h0) / metres;
  if (okM > 0.5) return (h0 - hm) / metres;
  return 0.0;
}
void main() {
  float ok;
  float h0 = heightAt(vUv, ok);
  if (ok < 0.5) { fragColor = vec4(0.0, 0.0, -1.0, 0.0); return; }
  vec2 xz = (uUnmap * vec3(vUv, 1.0)).xy;
  // How far the ground faces up, as the ground's snow takes it (materials.ts: smoothstep(0.55, 0.9, n.y)), from its
  // slope over two texels each way.
  vec2 step_ = 2.0 / vec2(textureSize(tHeights, 0));
  float metres = step_.x * uSide;
  vec3 n = normalize(vec3(-slopeAlong(vec2(step_.x, 0.0), h0, metres), 1.0, -slopeAlong(vec2(0.0, step_.y), h0, metres)));
  float up = smoothstep(0.55, 0.9, n.y);
  float uneven = fbm2(xz * 0.6 + 4.0) * 0.9 + snoise(xz * 1.4 + 11.0) * 0.1;
  float near = around(vUv, ${NEAR.toFixed(1)}, h0), far = around(vUv, ${FAR.toFixed(1)}, h0) * ${FAR_WEIGHT};
  // The deeper of the two in a hollow; on a rise, the higher.
  float dip = max(near, far) > 0.0 ? max(near, far) : min(near, far);
  // The pattern a thin snow breaks along (snow.ts), worked out here once rather than in every pixel that reads it: the
  // hollows fill first and the rises go bare, broken up by the unevenness and a finer drift.
  float drift = snoise(xz * 1.9 + 23.0) * 0.75 + snoise(xz * 4.3 + 5.0) * 0.25;
  float pattern = clamp(-dip * 6.0, -1.0, 1.0) * 0.45 + uneven * 0.4 + drift * 0.35;
  fragColor = vec4(dip, up, shelter(vec3(xz.x, h0, xz.y)), pattern);
}
`;
