import * as THREE from 'three';
import { FOG_NOISE_CELLS } from './fog';
import { CLOUD_LIGHT, LIGHT_UNIFORMS, NOISE, OKLAB, PAINT } from './glsl';
import type { SharedUniforms } from './materials';
import { CELL, COLUMN, COLUMN_TOP, FALLING_GLSL, LAND_ABOVE, LAND_BELOW, landInView, MAX_DROPS, RANK_FADE, REFERENCE_ZOOM } from './rain';
import { PARTIAL_COVER, SHELTER_GLSL } from './shelter';
import { HIDDEN_DIVE } from './water';
import { WIND_GLSL } from './wind';

// Falling snow and the blizzard (#14): soft, slow flakes drifting on the wind, stopped by roofs and (some of the time)
// crowns, as the rain's drops are (rain.ts, whose shelter tracing, columns and ranks this shares). A blizzard is the
// same snow in a strong wind (the developer's call, #14: no value of its own): thick, fast and sideways, whiting out the
// distance (SNOW_VEIL_GLSL, in the post pass) and streaming low over the lying snow in wisps.
//
// Unlike a raindrop, a flake isn't hung on the spot where it lands: in a blizzard it travels far further sideways than it
// falls, and the land round the view it could come from would be huge. Each flake belongs to a parcel of air instead, a
// cell of the air the wind carries along (`air`, metres, kept here), and falls through it: where it is across the land is
// its place in its cell plus how far the air has gone, its height how far it has fallen in its cycle. So the flakes in
// view are those of the cells over the view, wherever the wind has carried them; panning or zooming moves none, and the
// wind moves them all together. On top of that, each sways on its own beat, and the gusts surge them on and hold them
// back as they pass (the wind's map, #36). Where it lands is where its slanted path down meets the land, the water or a
// roof (coverAlong, the rain's), and it fades there: no puff, no rings on the water (the developer's call, #14). What lies
// on the land is the game's map alone (snow.ts).

/** How the falling snow looks: the candidates for the developer to pick between (#14). */
export interface SnowLook {
  /** Flakes a square metre at the heaviest snow, at the reference zoom (REFERENCE_ZOOM). */
  density: number;
  /** A flake: its size across (screen px at the reference zoom), how soft its edge is (0 crisp .. 1), how opaque. */
  flake: [size: number, soft: number, opacity: number];
  /** How long a flake's smear is: the seconds of its motion it's drawn over (a short streak, longer as it goes faster). */
  smear: number;
  /** How far its width flickers as it turns over, edge on and face on: 0 not at all .. 1 to a sliver. */
  tumble: number;
  /** How much of its lower side takes the snow's blue shade, a flake big enough to show its form (close up): 0 none .. 1. */
  rim: number;
  /** How far it sways (m) and how often (a second). */
  sway: [metres: number, hz: number];
  /** How fast it falls (m/s) in the lightest snow and the heaviest, in still air. */
  speed: [light: number, heavy: number];
}

/** The candidates (#14): A soft painted dabs, B small crisp flecks (as the rain's look B), C tumbling flakes with a short smear. */
export const SNOW_LOOKS = {
  a: { density: 1.5, flake: [6.0, 0.7, 0.9], smear: 0.03, tumble: 0, rim: 0.9, sway: [0.4, 0.3], speed: [0.9, 1.3] },
  b: { density: 2.4, flake: [2.8, 0.1, 0.95], smear: 0.02, tumble: 0, rim: 0.6, sway: [0.25, 0.45], speed: [1.0, 1.5] },
  c: { density: 1.8, flake: [4.6, 0.35, 0.9], smear: 0.045, tumble: 0.75, rim: 0.8, sway: [0.35, 0.55], speed: [1.0, 1.4] },
} as const satisfies Record<string, SnowLook>;
export type SnowLookName = keyof typeof SNOW_LOOKS;

/** How far a flake drifts sideways at most (horizontal metres a metre of fall): a blizzard's, near flat. */
const MAX_SLANT = 4;
/** How much faster flakes fall a m/s of wind in a blizzard (driven down), and how much thicker the snow looks in one. */
const WIND_FALL = 0.06, WIND_THICK = 0.75;
/** How much longer a blizzard's smear is: its flakes streak by. */
const WIND_SMEAR = 1.2;
/**
 * The longest a flake's smear is drawn, in screen px: a short streak reads as snow driving past, a long dash (a blizzard's
 * flakes close up) as rain.
 */
const SMEAR_MOST = 20;
/** The share of the wind's speed soft snow drifts at, out of a blizzard: slow, as painted snow is. */
const CARRY = 0.4;
/** The wind (m/s) a heavy snow turns to a blizzard over: from the first number, fully at the second. */
const BLIZZARD: [number, number] = [7, 20];
/** How long a gust's surge carries a flake on (s): how far ahead of the air a gust pushes it, and the most (m). */
const SURGE = 0.35, SURGE_MAX = 2.5;
/**
 * The most reads of each shelter map down a flake's path (coverAlong's `most`): in a blizzard's long slant, about a metre
 * and a half apart across the land for a flake halfway down. The trace was most of a blizzard's cost (docs/PERFORMANCE.md);
 * a flake now and then getting past a panel's edge in a blizzard isn't seen.
 */
const TRACE_MOST = 24;
/** How much brighter than the lying snow's lit band a flake is painted. */
const BRIGHTER = 1.35;
/** The cells repeat every this many, so the air's drift can wrap round unseen. */
const PERIOD = 4096;

/**
 * The blizzard's whiteout (the developer's call, #14): the middle of the view (where the camera looks) never past about
 * 30% white, the distance up to 85%, in sheets that sweep through with the gusts. Its colour in noon's clear light,
 * sRGB as a fog's: a pale blue-white, so the whiteout keeps the snow's cool shade rather than greying.
 */
export const WHITEOUT = { middle: 0.3, far: 0.85, sheets: 0.55 };
const SNOW_VEIL_BASE = new THREE.Color().setRGB(0.88, 0.92, 0.98);

const SNOW_VERT = /* glsl */ `
${LIGHT_UNIFORMS}
${NOISE}
${OKLAB}
${CLOUD_LIGHT}
${PAINT}
${WIND_GLSL}
${SHELTER_GLSL}
${FALLING_GLSL}
attribute vec3 aCorner;   // x across (-1, 1), y along the flake's smear (0 its tail, 1 its head)
uniform vec2 uScreen;
uniform vec4 uSnowCells;  // the air's cells drawn: x, y the first, z how many across, w how many in all
uniform vec4 uSnow;       // x the flakes a cell shown (by rank), y how far the snow has fallen (m), z a flake's cycle (m), w how fast it falls (m/s)
uniform vec4 uSnowAir;    // x, y how far the air has carried the flakes (m, wrapped), z, w how far a flake drifts a metre of fall
uniform vec4 uSnowFlake;  // its size (px), softness, opacity, smear (s)
uniform vec4 uSnowMove;   // its sway (m), how often (a second), its tumble, its rim
uniform vec2 uSnowWind;   // the wind as a whole (m/s): a gust surges a flake on by as much more as it blows there
uniform float uSnowSmearMost; // the longest a smear is drawn (px)
uniform float uSnowGround; // the land's height at the view's target (m): the land in view is within LAND_BELOW and LAND_ABOVE of it
uniform vec3 uSnowGap[4];
uniform vec3 uSnowCloud[4];
varying vec4 vShape;      // px across, px along from the tail, its smear's length (px), 0
varying vec4 vAxes;       // its direction on the screen and across it
varying vec2 vRadii;      // its half width across and along (px)
varying vec4 vColor;      // its colour, and how opaque
varying vec3 vShade;      // its lower side's colour
const float CELL = ${CELL.toFixed(1)};
const float COLUMN = ${COLUMN.toFixed(1)};
const float RANK_FADE = ${RANK_FADE};
const float PERIOD = ${PERIOD.toFixed(1)};
// Starting high over the land, a flake fades in over its first few metres, and out over its last few centimetres.
const float FADE_IN = 2.5, FADE_OUT = 0.35;

void main() {
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  vShape = vec4(0.0); vAxes = vec4(0.0); vRadii = vec2(1.0); vColor = vec4(0.0); vShade = vec3(0.0);
  // Which flake: its cell of the air and its place among the cell's (its rank: the first ones show in the lightest snow),
  // and its own random numbers, all from those (the cell's key repeating every PERIOD cells, as the air's drift does).
  int cells = int(uSnowCells.w), across_ = int(uSnowCells.z);
  int index = gl_InstanceID % cells, slot = gl_InstanceID / cells;
  vec2 cell = uSnowCells.xy + vec2(float(index % across_), float(index / across_));
  vec2 seed = mod(cell, PERIOD) + float(slot) * vec2(61.7, -37.3);
  vec4 rnd = vec4(hash12(seed), hash12(seed + 19.19), hash12(seed + 47.7), hash12(seed + 83.3));
  float show = clamp((uSnow.x - float(slot) - rnd.x * (1.0 - RANK_FADE)) / RANK_FADE, 0.0, 1.0);
  if (show <= 0.0) return;
  // How high it is over where it will land: falling from its column's top each cycle, somewhere new in its cell each time.
  float u = uSnow.y / uSnow.z + rnd.y * 37.0;
  float round_ = mod(floor(u), 4096.0);
  float column = COLUMN * (0.85 + 0.3 * fract(rnd.y * 5.13));
  float h = column - fract(u) * uSnow.z;
  if (h < 0.0) return;
  vec2 xz = (cell + hash22(vec2(rnd.z * 4093.0 + round_ * 1.618, rnd.w * 3967.0 + round_ * 0.7071))) * CELL + uSnowAir.xy;
  // Its sway, on its own beat (a loop, a little slower one way than the other), and the gusts' surge.
  float beat = uSnowMove.y * 6.2832 * (0.7 + 0.6 * fract(rnd.w * 7.7)), phase = rnd.z * 6.2832;
  vec2 swayed = uSnowMove.x * vec2(sin(uTime * beat + phase), sin(uTime * beat * 0.77 + phase * 1.3));
  vec2 swaying = uSnowMove.x * beat * vec2(cos(uTime * beat + phase), 0.77 * cos(uTime * beat * 0.77 + phase * 1.3));
  xz += swayed;
  // Off the screen, before anything is looked up (most of the cells drawn are: the air over the land in view reaches far
  // past the screen's edges). Across, a point's place on the screen doesn't hang on its height; up and down, the land under
  // it is within LAND_BELOW and LAND_ABOVE of the target's. With room for the surge, the smear and the flake.
  vec2 half_ = uScreen * 0.5;
  float pxPerMetre = projectionMatrix[0][0] * half_.x, zc;
  vec2 low = screenOf(vec3(xz.x, uSnowGround - ${LAND_BELOW.toFixed(1)} + h, xz.y), zc);
  vec2 high = screenOf(vec3(xz.x, uSnowGround + ${LAND_ABOVE.toFixed(1)} + h, xz.y), zc);
  vec2 room = 1.0 + ((${SURGE_MAX.toFixed(1)} + 2.0) * pxPerMetre + uSnowFlake.x) / half_;
  if (abs(low.x) > room.x || low.y > room.y || high.y < -room.y) return;
  vec2 surge = uSnowWind * (min(windGustHere(xz), 3.0) - 1.0) * ${SURGE.toFixed(2)};
  surge *= min(1.0, ${SURGE_MAX.toFixed(1)} / max(length(surge), 1e-4));
  xz += surge;
  // Where it lands: down its slanted path, on the land or the water there.
  vec2 slant = uSnowAir.zw;
  vec2 g = xz + slant * h;
  float land = landTop(vec3(g.x, 0.0, g.y));
  if (land < -1e3) return;
  vec3 sheet = waterSheet(g);
  float base = sheet.z > -${(HIDDEN_DIVE * 0.5).toFixed(3)} && sheet.x > land ? sheet.x : land;
  float top = base + column;
  vec3 p = vec3(xz.x, base + h, xz.y);
  // Off the screen: nothing more to do.
  float z;
  vec2 head = screenOf(p, z);
  vec2 sideways = slant * uSnow.w + swaying;
  vec3 vel = vec3(sideways.x, -uSnow.w, sideways.y);
  float reach = uSnowFlake.x + length(vel) * uSnowFlake.w * pxPerMetre * 2.0 + 2.0;
  if (any(greaterThan(abs(head), 1.0 + reach / half_))) return;
  // Stopped on the way: by a roof, or (some of the time) by a crown, lost among its leaves. Only the path it has come down
  // need be traced (and the little under it that it fades over): from the column's top to just under where it is now,
  // about half its whole path on average. At most TRACE_MOST reads of each map.
  float stop = base, below = p.y - FADE_OUT;
  vec2 at = xz + slant * FADE_OUT;
  float roof = coverAlong(uShelterFull, at, slant, below, top, ${TRACE_MOST.toFixed(1)});
  stop = max(stop, roof);
  if (rnd.w < ${PARTIAL_COVER.toFixed(2)}) {
    float crown = coverAlong(uShelterPartial, at, slant, below, top, ${TRACE_MOST.toFixed(1)});
    if (crown > stop) stop = max(crown - fract(rnd.z * 7.31) * 2.0, stop);
  }
  if (p.y <= stop) return;
  float alpha = show * smoothstep(0.0, FADE_OUT, p.y - stop) * smoothstep(column, column - FADE_IN, h);

  // Its smear: from where it was a moment ago to where it is, on the screen.
  float zt;
  vec2 sb = head * half_, sa = screenOf(p - vel * uSnowFlake.w, zt) * half_;
  vec2 d = sb - sa;
  float len = length(d);
  vec2 dir = len > 1e-3 ? d / len : vec2(0.0, -1.0), across = vec2(-dir.y, dir.x);
  // Each a little bigger or smaller than the next; turning over, it narrows to its edge and back.
  float r = 0.5 * uSnowFlake.x * (0.7 + 0.6 * fract(rnd.w * 11.3));
  // A fast flake (a blizzard's, close up) stretches only so far: a long dash reads as rain.
  len = min(len, uSnowSmearMost);
  sa = sb - dir * len;
  float turn = abs(sin(uTime * (1.5 + 2.0 * fract(rnd.z * 3.3)) + phase * 2.0));
  float ra = r * mix(1.0, 0.25 + 0.75 * turn, uSnowMove.z), rb = r;
  float pad = max(ra, rb) + 1.0;
  float t = aCorner.y;
  vec2 sp = mix(sa, sb, t) + dir * (t * 2.0 - 1.0) * pad + across * aCorner.x * pad;
  gl_Position = vec4(sp / half_, z, 1.0);
  vShape = vec4(aCorner.x * pad, t * len + (t * 2.0 - 1.0) * pad, len, 0.0);
  vAxes = vec4(dir, across);
  vRadii = vec2(ra, rb);
  // A longer smear spreads the same flake thinner, part way (a fast blizzard's streaks still read).
  alpha *= mix(1.0, (2.0 * r) / (len + 2.0 * r), 0.5) * uSnowFlake.z * (0.75 + 0.25 * fract(rnd.z * 17.9));
  // Lit as the lying snow is (its paint, snow.ts), in the light where it is, a little brighter than its lit band (a flake
  // in the air catches the light from all round): so it reads as a bright fleck over the white land as well as the dark.
  // A flake big enough to show its form has its lower side in the shade's blue.
  cloudAt(p);
  vec3 lit = mix(uSnowGap[2], uSnowCloud[2], gCloud), half2 = mix(uSnowGap[1], uSnowCloud[1], gCloud);
  vec3 shade = mix(uSnowGap[0], uSnowCloud[0], gCloud);
  vColor = vec4(exposeHere(lit * ${BRIGHTER.toFixed(2)}), alpha);
  vShade = exposeHere(mix(shade, half2, 0.35));
}
`;

const SNOW_FRAG = /* glsl */ `
precision highp float;
uniform vec4 uSnowFlake;
uniform vec4 uSnowMove;
varying vec4 vShape;
varying vec4 vAxes;
varying vec2 vRadii;
varying vec4 vColor;
varying vec3 vShade;
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;
void main() {
  float len = vShape.z, along = clamp(vShape.y, 0.0, len);
  vec2 q = vec2(vShape.x, vShape.y - along);
  // How far out from its middle line it is, as a share of its radius (its across and along radii differ as it turns).
  float ra = max(vRadii.x, 0.5), rb = max(vRadii.y, 0.5);
  float k = length(vec2(q.x / ra, q.y / rb));
  // From a crisp edge (a pixel's blur) to a soft fall-off.
  float rpx = min(ra, rb);
  float crisp = clamp((1.0 - k) * rpx + 0.5, 0.0, 1.0);
  float a = mix(crisp, exp(-k * k * 2.2), uSnowFlake.y);
  // Smaller than a pixel: as big as a pixel, fainter.
  a *= min(1.0, min(vRadii.x, vRadii.y) / 0.6) * vColor.a;
  if (a < 0.004) discard;
  // Its lower side on the screen in the snow's shade.
  vec2 off = vAxes.zw * q.x + vAxes.xy * q.y;
  // Only a flake big enough to show its form, and only its round end, not a streak's length.
  float rim = smoothstep(-0.45, 0.55, -off.y / max(ra, rb)) * uSnowMove.w * smoothstep(2.0, 5.0, max(ra, rb))
    * (2.0 * rb) / (len + 2.0 * rb);
  vec3 c = mix(vColor.rgb, vShade, rim);
  gColor = vec4(c * a, a);
  // The aux as it was: no lines on the snow, and the fog and haze by what's behind it.
  gAux = vec4(0.0);
}
`;

/**
 * The blizzard's whiteout and the snow blowing low over the land (#14), for the post pass: needs the post pass's camera
 * uniforms, fogNoise, WIND_GLSL, GROUND_GLSL and SHELTER_GLSL. snowVeil is how white the air between the eye and a
 * surface is; snowDrifting how much of the lying snow streams over a surface in wisps.
 */
export const SNOW_VEIL_GLSL = /* glsl */ `
uniform vec4 uSnowVeil;      // x how thick the whiteout is (0..1), y how far its sheets have blown (cells), z the middle's most, w the distance's
uniform vec4 uSnowVeilFrame; // x, y the wind's heading; z how strong the wisps over the lying snow, w how far they've blown (cells)
uniform vec3 uSnowVeilColor;
// How far past the camera's target the whiteout is thickest (m), and how far nearer it starts.
const float SNOW_FAR = 45.0, SNOW_NEAR = 12.0;
float snowVeil(vec3 p, float depth) {
  if (uSnowVeil.x <= 0.0) return 0.0;
  float far = smoothstep(-SNOW_NEAR, SNOW_FAR, depth - uTargetDepth);
  // Big soft sheets of blowing snow, carried downwind, thicker in the gusts (the game's, from its wind map): the farm
  // nearly vanishes as a gust's sheet sweeps through, and comes back after.
  vec2 h = uSnowVeilFrame.xy, q = vec2(dot(p.xz, h), dot(p.xz, vec2(-h.y, h.x)));
  float n = fogNoise(vec2(q.x / 30.0 - uSnowVeil.y, q.y / 16.0)) * 0.6 + fogNoise(vec2(q.x / 10.0 - uSnowVeil.y * 2.4, q.y / 7.0) + 7.0) * 0.4;
  float gust = clamp(windGustHere(p.xz), 0.0, 2.5) - 1.0;
  float sheets = clamp(0.75 + ${WHITEOUT.sheets.toFixed(2)} * n + gust * 0.7, 0.15, 1.5);
  float most = mix(uSnowVeil.z, uSnowVeil.w, far);
  return min(uSnowVeil.x * mix(uSnowVeil.z * 0.6, uSnowVeil.w, far) * sheets, most * uSnowVeil.x);
}
// Low wisps of snow lifted off the lying snow and streaming downwind, in a gale: only where snow lies, and only on what's
// low over the land (the ground, the grass, a fence's foot), strongest in the gusts.
float snowDrifting(vec3 p) {
  if (uSnowVeilFrame.z <= 0.0) return 0.0;
  float lying = groundState(p.xz).x;
  if (lying < 0.02) return 0.0;
  float low = 1.0 - smoothstep(0.3, 1.2, p.y - landTop(p));
  if (low <= 0.0) return 0.0;
  // None under a roof (the porch's floor, under the panels), less under a crown, as the lying snow (groundAt): the ground's
  // shelter from the hollows map (one read), or off it the shelter map's.
  float cover = hollowAt(p.xz).z;
  lying *= 1.0 - (cover < 0.0 ? shelter(p) : cover);
  if (lying < 0.02) return 0.0;
  vec2 h = uSnowVeilFrame.xy, q = vec2(dot(p.xz, h), dot(p.xz, vec2(-h.y, h.x)));
  vec2 s = vec2(q.x / 6.0 - uSnowVeilFrame.w, q.y / 0.8);
  float n = fogNoise(s * 0.5 + 3.0) * 0.65 + fogNoise(s * vec2(1.3, 1.9) + 9.0) * 0.35;
  float wisp = smoothstep(0.0, 0.55, n) * clamp(0.3 + 0.7 * windGustHere(p.xz), 0.0, 1.6);
  return uSnowVeilFrame.z * min(lying * 4.0, 1.0) * low * min(wisp, 1.0) * 0.55;
}
`;

/** The flakes: per corner, where on the flake's quad it is. Which flake an instance is the vertex shader works out. */
function flakesGeometry(): THREE.InstancedBufferGeometry {
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('aCorner', new THREE.BufferAttribute(new Float32Array([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0]), 3));
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  g.setIndex([0, 1, 2, 2, 1, 3]);
  g.instanceCount = 0;
  g.boundingBox = new THREE.Box3();
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
  return g;
}

/** How much of a blizzard a snow is: heavy snow in a strong wind (0..1). */
export function blizzardOf(snow: number, wind: number) {
  return Math.min(1, snow * 1.25) * THREE.MathUtils.smoothstep(wind, BLIZZARD[0], BLIZZARD[1]);
}

/** The falling snow as drawn: the flakes' mesh, and the uniforms for the post pass's whiteout and wisps. */
export class Snowfall {
  readonly uniforms = {
    uSnowCells: { value: new THREE.Vector4(0, 0, 1, 1) },
    uSnow: { value: new THREE.Vector4(0, 0, 1, 1) },
    uSnowAir: { value: new THREE.Vector4() },
    uSnowFlake: { value: new THREE.Vector4() },
    uSnowMove: { value: new THREE.Vector4() },
    uSnowWind: { value: new THREE.Vector2() },
    uSnowSmearMost: { value: SMEAR_MOST },
    uSnowGround: { value: 0 },
  };
  /** For the post pass. */
  readonly veil = {
    uSnowVeil: { value: new THREE.Vector4() },
    uSnowVeilFrame: { value: new THREE.Vector4(1, 0, 0, 0) },
    uSnowVeilColor: { value: new THREE.Color() },
  };
  readonly mesh: THREE.Mesh;
  /** The look, of the candidates (#14). */
  look: SnowLook = SNOW_LOOKS.a;
  /** How far the snow has fallen (m), and the air carried it (m, x and z), from which each flake's place is worked out. */
  private fallen = 0;
  private air = new THREE.Vector2();
  /** How far the whiteout's sheets and the wisps have blown, in their noise's cells. */
  private sheets = 0; private wisps = 0;
  private last = NaN;
  private box = new THREE.Box3();

  constructor(shared: SharedUniforms, shelter: Record<string, THREE.IUniform>) {
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: { ...shared, ...shelter, ...this.uniforms },
      vertexShader: SNOW_VERT,
      fragmentShader: SNOW_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      // See-through paint over the painting, premultiplied, as the rain's.
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(flakesGeometry(), material);
    this.mesh.frustumCulled = false;
    this.mesh.userData.kind = 'snow';
    this.mesh.userData.reflect = false;
    this.mesh.userData.under = false;
  }

  /**
   * Each frame, before drawing: `snow` how hard it snows (0..1, eased), `zoom` the camera's (screen px a metre), `px`
   * the pixels drawn a screen pixel, `share` the quality's share of the flakes, `shown` whether things in the air are
   * drawn at all, `lying` whether any snow lies on the land (for the wisps), the wind as a whole (m/s, towards), and the
   * view's camera and the height of the land at its target.
   */
  update(time: number, snow: number, zoom: number, px: number, share: number, shown: boolean, lying: boolean,
    wind: THREE.Vector2, camera: THREE.OrthographicCamera, groundY: number) {
    const L = this.look, s = shown ? THREE.MathUtils.clamp(snow, 0, 1) : 0;
    const windSpeed = wind.length(), blizzard = blizzardOf(s, windSpeed);
    const speed = THREE.MathUtils.lerp(L.speed[0], L.speed[1], s) + WIND_FALL * windSpeed * blizzard;
    // How far a flake drifts a metre of fall: as far as the wind carries it while it falls, at most MAX_SLANT. Soft snow
    // in a breeze drifts at part of the wind's speed (the developer's soft, slow flakes, #14), a blizzard's at all of it.
    const slant = Math.min(MAX_SLANT, (windSpeed * THREE.MathUtils.lerp(CARRY, 1, blizzard)) / speed);
    const sx = windSpeed > 1e-3 ? (wind.x / windSpeed) * slant : 0, sz = windSpeed > 1e-3 ? (wind.y / windSpeed) * slant : 0;
    const dt = time - this.last;
    // On from where it was, a gap of over a second (a paused tab) as a frame's worth. Back in time (a tool going back) or
    // the first frame: from the clock, so a still frame depends only on its time (as the rain's, rain.ts).
    const period = PERIOD * CELL;
    if (!(dt >= 0)) { this.fallen = speed * time; this.air.set(sx * speed * time, sz * speed * time); }
    else {
      const step = dt <= 1 ? dt : 0.1;
      this.fallen += speed * step;
      this.air.x += sx * speed * step; this.air.y += sz * speed * step;
    }
    this.air.set(((this.air.x % period) + period) % period, ((this.air.y % period) + period) % period);
    this.last = time;
    const cycle = COLUMN_TOP + 1;
    // The screen holds about as many flakes at any zoom, more as the snow thickens, and more in a gale.
    const perArea = L.density * s ** 0.7 * (1 + WIND_THICK * blizzard) * Math.min((zoom / REFERENCE_ZOOM) ** 2, 4) * share;
    const perCell = perArea * CELL * CELL;
    // The air's cells over the land in view (and its sway's and surge's reach round it).
    const box = landInView(camera, groundY, this.box), pad = SURGE_MAX + L.sway[0] + 1;
    const x0 = Math.floor((box.min.x - pad - this.air.x) / CELL), z0 = Math.floor((box.min.z - pad - this.air.y) / CELL);
    const across = Math.floor((box.max.x + pad - this.air.x) / CELL) - x0 + 1, deep = Math.floor((box.max.z + pad - this.air.y) / CELL) - z0 + 1;
    const cells = across * deep;
    const slots = Math.min(Math.ceil(perCell), Math.floor(MAX_DROPS / cells));
    const u = this.uniforms;
    u.uSnowCells.value.set(x0, z0, across, cells);
    u.uSnow.value.set(perCell, this.fallen % (cycle * 4096), cycle, speed);
    u.uSnowAir.value.set(this.air.x, this.air.y, sx, sz);
    u.uSnowFlake.value.set(L.flake[0] * Math.sqrt(zoom / REFERENCE_ZOOM) * px, L.flake[1], L.flake[2], L.smear * (1 + WIND_SMEAR * blizzard));
    u.uSnowMove.value.set(L.sway[0], L.sway[1], L.tumble, L.rim);
    u.uSnowWind.value.copy(wind);
    u.uSnowGround.value = groundY;
    u.uSnowSmearMost.value = SMEAR_MOST * px;
    const g = this.mesh.geometry as THREE.InstancedBufferGeometry;
    g.instanceCount = cells * slots;
    this.mesh.visible = slots > 0;
    // The whiteout: a heavy snow veils the distance a little in still air, a blizzard whites it out; its sheets blow
    // downwind at the wind's speed, the wisps at about half again of it (in their noise's cells). Each wraps where every
    // layer it moves wraps too (the sheets' layers move 1 and 2.4 times it, the wisps' 0.5 and 1.3 times), so none jumps.
    const step = dt >= 0 ? (dt <= 1 ? dt : 0.1) : 0;
    this.sheets = (this.sheets + (windSpeed * step) / 30) % (5 * FOG_NOISE_CELLS);
    this.wisps = (this.wisps + (windSpeed * 1.4 * step) / 6) % (20 * FOG_NOISE_CELLS);
    const v = this.veil;
    const thick = Math.max(blizzard, 0.25 * s ** 1.5);
    v.uSnowVeil.value.set(thick, this.sheets, WHITEOUT.middle, WHITEOUT.far);
    const hx = windSpeed > 1e-3 ? wind.x / windSpeed : 1, hz = windSpeed > 1e-3 ? wind.y / windSpeed : 0;
    v.uSnowVeilFrame.value.set(hx, hz, lying && shown ? THREE.MathUtils.smoothstep(windSpeed, 10, 22) : 0, this.wisps);
  }

  /** The whiteout's colour: a pale blue-white as the fog's is lit (see litFog), set with the light. */
  setVeilColor(lit: (out: THREE.Color, base: THREE.Color) => void) {
    lit(this.veil.uSnowVeilColor.value, SNOW_VEIL_BASE);
  }
}
