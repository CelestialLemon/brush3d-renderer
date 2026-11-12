import * as THREE from 'three';
import { CLOUD_MAP_GLSL } from './cloudMap';
import { SHELTER_GLSL } from './shelter';

// Frost (#14): the game says how much (the ground's map, its green channel: 0 none .. 1 a hard frost everywhere in the
// open); the renderer paints it as a pale rime on the land and on what faces up: the ground, the tips of the grass and the
// crops, the tops of built things (roofs, fences, crates, the panels), a pale edge on bare branches and the crowns' tops.
// None under a roof, less under a crown, and lying snow covers it.
//
// Where it lies, as the game's frost rises and falls, keeps to the land: as frost builds, the hollows and the grass tips
// whiten first and the open rises last; as it melts, the same in reverse. The sun takes it first where it has shone: the
// renderer remembers how much sun each spot of the ground has had since dawn (SunMemory, a small map it adds to a few
// times a second, forgotten at nightfall), so ground the sun has cleared stays clear when a cloud or a swinging shadow
// passes over it. Frost at 1 is frost everywhere in the open, sun or no sun (a cold snap is the game holding it high);
// the game sets the pace, by lowering it, and the renderer has no weather clock of its own.

/** Clear-sky hours of full sun that clear any frost short of a hard one (1): the memory's scale. */
export const SUN_CLEARS = 2.5;

/**
 * Frost, for every material but the water: needs SNOW_GLSL (the ground's map, the hollows, snowPaint) and the light model.
 * groundAt (snow.ts) sets gFrost; a material then works out how much of its surface the frost whitens (frostCover) and
 * lays the rime over it (frostPaint), before the snow (which covers it).
 */
export const FROST_GLSL = /* glsl */ `
uniform sampler2D tSunHad;   // the sun each spot of the ground has had since dawn (SunMemory), over the hollows map's square
uniform float uSunHadOn;
uniform float uFrostLook;    // the candidates for #14: 0 matte, 1 crisp (a deeper blue shade), 2 glittering
// The sun had at xz, 0 (none since dawn) .. 1 (enough to clear any frost short of a hard one): (x) on the ground, (y) on
// what's highest there (a roof's top, a crown's; the ground's where nothing stands over it).
vec2 sunHadAt(vec2 xz) {
  if (uSunHadOn < 0.5 || uHollowsOn < 0.5) return vec2(0.0);
  vec2 uv = (uHollowsMap * vec3(xz, 1.0)).xy;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec2(0.0);
  return clamp(texture(tSunHad, uv).rg, 0.0, 1.0);
}
// How much of a surface the frost whitens here, 0..1: 'early' is how early this spot frosts (1 a hollow or a grass tip,
// first in and last out; -1 an open rise), 'sun' the sun it's had since dawn (sunHadAt), 'brush' the material's own
// brushwork there (about -1..1), which the edge of what's left wanders along, as a melting frost's does, rather than
// tracing a shadow's line. Each spot frosts once the game's frost passes its own threshold, which the sun raises: frost
// at 1 is past them all. No noise of its own: frost is in every pixel of the land, many times over in the grass.
float frostCover(float early, float sun, float brush) {
  float th = 0.06 + 0.3 * (0.5 - 0.5 * clamp(early, -1.0, 1.0)) + 0.6 * sun + 0.07 * clamp(brush, -1.0, 1.0);
  return smoothstep(th - 0.08, th + 0.08, gFrost);
}
// The rime over 'col': 'amount' how much (frostCover times how far the surface takes it), lit as the snow's paint is
// ('light', 0 deep shade .. 1 full sun), its crystals the material's own brushwork ('brush', about -1..1), broken up
// over metres by the land's pattern (the thin snow's, from the hollows map). The glitter is keyed to the world at p.
vec3 frostPaint(vec3 col, float light, float amount, float brush, vec3 p) {
  if (amount <= 0.0) return col;
  float grain = clamp(brush, -1.0, 1.0);
  // A rime, not a cover: the paint under it shows through, paled toward the snow's paint, and keeps its own hues (the
  // ground's greens and browns read through it). In shade it's the snow's blue, softened toward the paint under it.
  vec3 rime = snowPaint(light, 0.05, 0.0);
  float inShade = 1.0 - smoothstep(0.30, 0.62, light);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 hue = col - lum;
  float mottle = gHollow.z >= 0.0 ? clamp(gHollow.w, -1.0, 1.0) : 0.0;
  vec3 c;
  if (uFrostLook > 0.5 && uFrostLook < 1.5) {
    // Crisp: whiter where it's whole, its crystals sharper, and a deeper blue in the shade.
    rime = mix(rime, mix(uSnowGap[0], uSnowCloud[0], gCloud) * 0.92, inShade * 0.3);
    float a = amount * mix(0.3, 0.78, smoothstep(-0.3, 0.1, grain + 0.3 * mottle + amount - 0.7));
    c = mix(col, rime, a) + hue * a * 0.35;
  } else {
    rime = mix(rime, mix(rime, col * 1.25 + 0.08, 0.45), inShade);
    float a = amount * (0.46 + 0.1 * mottle + 0.12 * grain);
    c = mix(col, rime, a) + hue * a * mix(0.6, 0.2, inShade);
  }
  if (uFrostLook < 1.5) return c;
  {
    // Glittering: here and there a crystal catching the sun, a point of white, fixed to the world (no twinkling as the
    // camera moves), only in the sun's light and only close enough to see.
    vec2 cell = floor(p.xz * 7.0);
    float spark = step(0.965, hash12(cell + 0.37)) * smoothstep(0.55, 0.75, light);
    spark *= 1.0 - smoothstep(0.1, 0.3, length(fwidth(p.xz * 7.0)));
    // A small four-pointed glint, at a spot in its cell.
    vec2 at = abs(fract(p.xz * 7.0) - 0.3 - 0.4 * hash22(cell));
    float glint = max(1.0 - smoothstep(0.06, 0.14, length(at)), (1.0 - smoothstep(0.0, 0.035, min(at.x, at.y))) * (1.0 - smoothstep(0.05, 0.3, max(at.x, at.y))));
    c = mix(c, vec3(2.2, 2.25, 2.4), spark * glint * min(1.0, amount * 1.5));
  }
  return c;
}
`;

/**
 * The sun each spot of the ground has had since dawn, for the frost's melt: a map over the hollows map's square, added to
 * a few times a second (each spot by how much sun it has now: the sun's height, its shadows, the clouds' shade), in
 * clear-sky hours over SUN_CLEARS, and forgotten at nightfall. The renderer has no clock of its own: it adds by the game's
 * clock hour as setHour sets it. When the hour jumps (a still drawn at 10, the hour dragged), the hours skipped are taken
 * as if the sun now had shone through them, from sunrise at the earliest; going back, or the sun setting, starts afresh.
 */
export class SunMemory {
  readonly uniforms = {
    tSunHad: { value: null as THREE.Texture | null },
    uSunHadOn: { value: 0 },
    /** How the rime is painted (frostPaint): the candidates for #14, 0 matte, 1 crisp, 2 glittering. */
    uFrostLook: { value: 0 },
  };
  private targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quadScene = new THREE.Scene();
  private material: THREE.ShaderMaterial;
  /** The hour last added to, counted from sunrise (so a day running past midnight counts on), and the hours since that
   * wait to be added (in steps, so a half float keeps them). */
  private hour: number | null = null;
  private pending = 0;
  private fresh = true;
  /** Whether the map was cleared for the night and nothing has been added since. */
  private blank = false;

  constructor(shared: Record<string, THREE.IUniform>, readonly size = 512) {
    const target = () => new THREE.WebGLRenderTarget(size, size, {
      type: THREE.HalfFloatType, format: THREE.RGFormat, depthBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
    });
    this.targets = [target(), target()];
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: QUAD_VERT, fragmentShader: SUN_HAD_FRAG,
      uniforms: {
        ...shared,
        tPrev: { value: null as THREE.Texture | null }, uAdd: { value: 0 }, uFresh: { value: 1 }, uGuess: { value: 0 },
        uUnmap: { value: new THREE.Matrix3() },
      },
      depthTest: false, depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    quad.frustumCulled = false;
    this.quadScene.add(quad);
  }

  /** Whether frost is drawn at all: none to remember for while there's none. */
  private on = false;

  /**
   * Each frame, after the shadow map is drawn: the game's clock hour (null if it hasn't set one: nothing is added), the
   * day's sunrise and sunset, the light's height (degrees), how much of the light is the whole sky's (0 the sun's .. 1
   * overcast) and whether there's frost to draw (the map is kept, and added to, only then). Night is told by the hour,
   * not the light's height: at night that's the moon's, which melts nothing.
   */
  update(gl: THREE.WebGLRenderer, hour: number | null, sunrise: number, sunset: number, sunEl: number, sky: number,
    frost: boolean, hollowsMap: THREE.Matrix3, hollowsOn: boolean) {
    const u = this.uniforms;
    if (!frost || !hollowsOn) { this.on = false; u.uSunHadOn.value = 0; this.fresh = true; this.blank = false; this.hour = null; return; }
    if (!this.on) { this.on = true; this.fresh = true; this.blank = false; this.hour = null; }
    // The hours since sunrise (a day can run past midnight either side, so they're counted from sunrise round); day is
    // up to sunset.
    const since = hour === null ? null : ((hour - sunrise) % 24 + 24) % 24;
    const day = since !== null && since < sunset - sunrise;
    // The sun's strength now, over the land in the open: none below the horizon, weak while low, less under a grey sky.
    const sun = day ? THREE.MathUtils.smoothstep(sunEl, 0, 25) * (1 - 0.85 * sky) : 0;
    let add = 0, guess = 0;
    if (since === null) {
      if (!this.fresh) return;
    } else if (!day) {
      // Night: forgotten (cleared once, then nothing to do till dawn), to start afresh at dawn.
      this.hour = since; this.pending = 0;
      if (this.blank) return;
      this.fresh = true; this.blank = true;
    } else if (this.hour === null || since < this.hour - 1e-6 || since - this.hour > 0.5) {
      // A jump (or the first frame): as if this sun had shone since sunrise (afresh), or, jumping on, since the hour it
      // jumped from (added to what it had).
      const back = this.hour === null || since < this.hour;
      const from = back ? 0 : this.hour!;
      if (back) this.fresh = true;
      this.pending = 0;
      add = (since - from) * sun;
      guess = 1;
      this.hour = since;
    } else {
      this.pending += since - this.hour;
      this.hour = since;
      // A few times a game hour's hundredth: the steps a half float holds.
      if (this.pending < 0.02 && !this.fresh) return;
      add = this.pending * sun;
      this.pending = 0;
    }
    if (day) this.blank = false;
    const mu = this.material.uniforms;
    mu.uUnmap.value.copy(hollowsMap).invert();
    mu.tPrev.value = this.targets[0].texture;
    mu.uAdd.value = add / SUN_CLEARS;
    mu.uFresh.value = this.fresh ? 1 : 0;
    mu.uGuess.value = guess;
    gl.setRenderTarget(this.targets[1]);
    gl.render(this.quadScene, this.camera);
    gl.setRenderTarget(null);
    this.targets.reverse();
    this.fresh = false;
    u.tSunHad.value = this.targets[0].texture;
    u.uSunHadOn.value = 1;
  }

  dispose() { for (const t of this.targets) t.dispose(); this.material.dispose(); }
}

const QUAD_VERT = /* glsl */ `
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Each texel: the ground's point there (the land's height from the shelter map) and the top of what stands over it (a
// roof, a crown), the sun on each now (in the shadows or not, a few taps; under a cloud's shade or not), added to what
// they had.
const SUN_HAD_FRAG = /* glsl */ `
precision highp float;
${SHELTER_GLSL}
${CLOUD_MAP_GLSL}
uniform float uCloudStrength;
uniform sampler2D uShadowMap;
uniform mat4 uShadowMatrix;
uniform sampler2D tPrev;
uniform float uAdd;
uniform float uFresh;
uniform float uGuess;
uniform mat3 uUnmap;
in vec2 vUv;
out vec4 fragColor;
// The sun at a point, over a patch about 0.6 m across (a shadow's edge moves through the morning, so what it leaves is
// soft). Out of the shadow map's window (the shadows follow the view), what's there is unknown: taken as a third of the
// open's sun, as for the hours skipped by a jump (uGuess), so shade the view left keeps some of its frost.
float sunAt(vec3 p) {
  float seen = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.0472 + 0.3;
    vec4 s = uShadowMatrix * vec4(p + vec3(cos(a), 0.0, sin(a)) * 0.3, 1.0);
    vec3 uvz = s.xyz / s.w;
    bool out_ = any(lessThan(uvz.xy, vec2(0.0))) || any(greaterThan(uvz.xy, vec2(1.0))) || uvz.z > 1.0;
    seen += out_ ? 0.33 : uvz.z - 0.003 <= texture(uShadowMap, uvz.xy).r ? 1.0 : 0.0;
  }
  return seen / 6.0;
}
void main() {
  vec2 had = uFresh > 0.5 ? vec2(0.0) : texture(tPrev, vUv).rg;
  vec2 xz = (uUnmap * vec3(vUv, 1.0)).xy;
  vec3 p = vec3(xz.x, 0.0, xz.y);
  float land = landTop(p);
  float top = max(shelterTop(p), crownTop(p));
  float ground = land > -1e3 ? sunAt(vec3(xz.x, land + 0.08, xz.y)) : 1.0;
  float high = top > land + 0.3 ? sunAt(vec3(xz.x, top + 0.08, xz.y)) : ground;
  float cloud = 1.0 - 0.85 * cloudMapShade(xz) * uCloudStrength;
  // Hours skipped (uGuess 1) are taken from this one shadow, though the shadows swung through them: what's in shade now
  // is taken as having had a third of the open's sun, so a still at noon keeps frost in the long shade, thinned.
  vec2 sun = mix(vec2(ground, high), mix(vec2(ground, high), vec2(1.0), 0.33), uGuess);
  fragColor = vec4(had + uAdd * cloud * sun, 0.0, 1.0);
}
`;
