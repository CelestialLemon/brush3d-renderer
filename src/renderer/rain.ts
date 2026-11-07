import * as THREE from 'three';
import { FOG_NOISE_CELLS } from './fog';
import { CLOUD_LIGHT, LIGHT_UNIFORMS, NOISE, OKLAB, PAINT } from './glsl';
import type { SharedUniforms } from './materials';
import { PARTIAL_COVER, SHELTER_GLSL } from './shelter';
import { HIDDEN_DIVE } from './water';
import { WIND_GLSL } from './wind';

// Falling rain (#11): painted strokes, not a field of particles. A few long, soft strokes fall near the camera, a veil
// of rain hangs over the distance (drawn in the post pass, see RAIN_VEIL_GLSL), drops splash where they land, and rings
// spread on the water (RAIN_RINGS_GLSL, in the water's own shader).
//
// The strokes are one mesh of drops, each moved wholly on the GPU. A drop falls down its column from a set height over
// where it lands, slanted by the wind there, and stops at the first thing in its way: a roof, a crown (some of the time,
// as a crown keeps off only part of the rain), the water, or the land, read from the shelter map's three maps from above
// (shelter.ts). It splashes there, then starts again somewhere else. Where it is in its fall comes from how far the
// rain has fallen in all (`fallen`, metres, kept here), so a heavier rain falling faster never makes a drop jump.
// The strokes are drawn into the G-buffer's colour over the painting, as see-through paint: the post pass then grades,
// fogs and hazes them with everything else, and draws no lines on them (the aux, which the lines are read from, is
// left as it was).
// How hard it rains sets how many drops show (by rank, so a drop joins in by fading, never popping), how fast they
// fall and how thick the veil is. Fewer show as the camera draws back, so the screen holds about as many strokes at
// any zoom: a painter doesn't paint more strokes for a wider view. The quality's share (Settings.fallingShare) cuts
// their number further, not their look.
// Snow (#14) can fall the same way: the column, the stops and the ranks are what any falling thing needs.

/** A look for the rain: the candidates the developer picks between (?rainLook). */
export interface RainLook {
  /** Drops a square metre at the heaviest rain, at the reference zoom (REFERENCE_ZOOM). */
  density: number;
  /** A stroke: its length (m), its width (screen px at the reference zoom), how soft its edge is (0 crisp .. 1), how opaque. */
  stroke: [length: number, width: number, soft: number, opacity: number];
  /** How much thinner and fainter its tail is than its head: 0 not at all .. 1 to nothing. */
  taper: number;
  /** How fast it falls (m/s) in the lightest rain and the heaviest. */
  speed: [light: number, heavy: number];
  /** How far the wind slants it: 1 as far as a real drop. */
  slant: number;
  /** The splash: its shape (0 a soft dab, 1 a crown of ticks, 2 a few beads), its size (m), how long it lasts (s). */
  splash: [shape: number, size: number, time: number];
  /** The veil: how thick at the heaviest, its streaks' width (m) and length (m), how crisp they are (0..1), its sheets' size (m). */
  veil: [strength: number, across: number, along: number, crisp: number, sheets: number];
  /** The rings: the widest (m), the line's width (m), how strong at the heaviest, the drop's dot at the centre (0..1). */
  rings: [size: number, width: number, strength: number, dot: number];
}

export const RAIN_LOOKS = {
  // A: long, wide, very soft and few: washes of rain. The veil a haze lifting in broad sheets; the splash a soft dab;
  // the rings soft and wide.
  a: {
    density: 0.12, stroke: [3.0, 6, 1, 0.34], taper: 0.7, speed: [6, 9], slant: 0.6, splash: [0, 0.4, 0.28],
    veil: [0.32, 1.0, 10, 0.15, 22], rings: [0.5, 0.06, 0.4, 0],
  },
  // B: long and fine, crisper and more of them. A fine streaked veil, crowns of ticks where they land, thin crisp rings.
  b: {
    density: 0.18, stroke: [2.0, 1.4, 0.3, 0.42], taper: 0.5, speed: [7, 10], slant: 0.7, splash: [1, 0.28, 0.2],
    veil: [0.26, 0.3, 6, 0.6, 12], rings: [0.32, 0.022, 0.5, 0],
  },
  // C: shorter, tapering dashes, as from a brush. A hatched veil, beads where they land, rings round a dot.
  c: {
    density: 0.16, stroke: [1.1, 3.2, 0.5, 0.55], taper: 0.9, speed: [6, 9], slant: 0.6, splash: [2, 0.32, 0.3],
    veil: [0.3, 0.6, 2.8, 0.45, 14], rings: [0.36, 0.04, 0.45, 1],
  },
} satisfies Record<string, RainLook>;
export type RainLookName = keyof typeof RAIN_LOOKS;

/** The zoom (screen px a metre) the looks' density and width are set at: the demo's usual framing. */
export const REFERENCE_ZOOM = 44;
/** The most drops drawn at once: far more than any view needs (a few thousand), a guard against a huge screen. */
const MAX_DROPS = 65536;
/**
 * The side of a cell of land (m). The drops belong to cells keyed to the world, each cell its own handful, and those on
 * the land the view can see (and a margin round it) are drawn: the same drop falls in the same place whichever cells
 * are drawn, so panning or zooming never moves one.
 */
const CELL = 8;
/** How high over where it stops a drop starts (m): over the tallest crown; and the most, with its jitter. */
const COLUMN = 16;
const COLUMN_TOP = COLUMN * 1.15;
/** A drop fades in over this much of a drop a cell as the rain grows (by its rank in the cell). */
const RANK_FADE = 0.3;
/** How far the wind slants a stroke at most (horizontal metres a metre of fall). */
const MAX_SLANT = 1.2;
/** How far the land in view can lie under and over the camera's target (m), for the cells to draw. */
const LAND_BELOW = 8, LAND_ABOVE = 8;

/** The drops' light: pale, lit by the sky more than the sun, as rain catches the light. Linear. */
const RAIN_BASE = '0.78, 0.82, 0.86';

const RAIN_VERT = /* glsl */ `
${LIGHT_UNIFORMS}
${NOISE}
${OKLAB}
${CLOUD_LIGHT}
${PAINT}
${WIND_GLSL}
${SHELTER_GLSL}
attribute vec3 aCorner;  // x across (-1, 1); y along the stroke (0 its tail, 1 its head) or up the splash (-1, 1); z 0 the stroke, 1 the splash
uniform vec2 uScreen;
uniform vec3 uViewTarget;
uniform vec4 uRainCells;   // the cells drawn: x, y the first (world cell), z how many across, w how many in all
uniform vec4 uRain;        // x the drops a cell shown (by rank), y how far the rain has fallen (m), z a drop's cycle (m), w how fast it falls (m/s)
uniform vec4 uRainStroke;  // its length (m), width (px), softness, opacity
uniform vec4 uRainShape;   // its taper, how far the wind slants it, the splash's shape, the splash's size (m)
uniform float uRainSplash; // how far a drop would fall while it splashes (m)
varying vec4 vShape;       // the stroke: px across, px along from the tail, its length and half its width in px. The splash: its corner, its shape, its age (0..1)
varying vec4 vColor;       // its colour, and how opaque
varying float vPart;       // 0 the stroke, 1 the splash
const float CELL = ${CELL.toFixed(1)};
const float COLUMN = ${COLUMN.toFixed(1)};
const float RANK_FADE = ${RANK_FADE};
// Starting high over the land, a drop fades in over its first few metres, so none appears out of nothing.
const float FADE_IN = 3.0;

vec2 screenOf(vec3 p, out float z) {
  vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.0);
  z = c.z / c.w;
  return c.xy / c.w;
}
// Where a drop falling down its slanted path (at height y it is over g - slant (y - base)) from \`top\` first meets the
// cover a map holds: stepping down the path to the first point under the cover, then halving the step between it and
// the last point over it. The steps are about a metre apart across the land (so a panel's edge isn't stepped over) and
// two up and down; straight down, one look. Far below the land if it meets none. A path that grazes the downwind edge of
// cover between two steps (a strip under a metre, in a wind) gets by, as rain blows in under an eave.
float coverAlong(highp sampler2D map, vec2 g, vec2 slant, float base, float top) {
  if (dot(slant, slant) < 1e-4) return shelterHeightIn(map, vec3(g.x, 0.0, g.y));
  float over = top;
  int steps = int(clamp(ceil((top - base) * max(length(slant), 0.5)), 8.0, 24.0));
  for (int i = 0; i <= steps; i++) {
    float y = mix(top, base, float(i) / float(steps));
    vec2 at = g - slant * (y - base);
    if (shelterHeightIn(map, vec3(at.x, 0.0, at.y)) < y) { over = y; continue; }
    if (i == 0) return top;
    float under = y;
    for (int j = 0; j < 3; j++) {
      float m = 0.5 * (over + under);
      vec2 am = g - slant * (m - base);
      if (shelterHeightIn(map, vec3(am.x, 0.0, am.y)) < m) over = m; else under = m;
    }
    return under;
  }
  return -1e9;
}

void main() {
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  vShape = vec4(0.0); vColor = vec4(0.0); vPart = aCorner.z;
  // Which drop: its cell of the world and its place among the cell's (its rank: the first ones show in the lightest
  // rain), and its own four random numbers, all from those, so a drop is the same whichever cells are drawn.
  int cells = int(uRainCells.w), across_ = int(uRainCells.z);
  int index = gl_InstanceID % cells, slot = gl_InstanceID / cells;
  vec2 cell = uRainCells.xy + vec2(float(index % across_), float(index / across_));
  vec2 seed = cell + float(slot) * vec2(61.7, -37.3);
  vec4 rnd = vec4(hash12(seed), hash12(seed + 19.19), hash12(seed + 47.7), hash12(seed + 83.3));
  float show = clamp((uRain.x - float(slot) - rnd.x * (1.0 - RANK_FADE)) / RANK_FADE, 0.0, 1.0);
  if (show <= 0.0) return;
  // Where it is in its fall, and where it lands this time round: somewhere new in its cell each fall.
  float u = uRain.y / uRain.z + rnd.y * 37.0;
  float round_ = mod(floor(u), 4096.0), fallen = fract(u) * uRain.z;
  vec2 g = (cell + hash22(vec2(rnd.z * 4093.0 + round_ * 1.618, rnd.w * 3967.0 + round_ * 0.7071))) * CELL;
  // Slanted by the wind where it lands: blown along at the wind's speed as it falls.
  vec2 slant = windGround(g) / max(uRain.w, 1.0) * uRainShape.y;
  slant *= min(1.0, ${MAX_SLANT.toFixed(2)} / max(length(slant), 1e-4));
  // Where it would stop in the open: the land, or the water over it.
  float land = landTop(vec3(g.x, 0.0, g.y));
  if (land < -1e3) return;
  vec3 sheet = waterSheet(g);
  bool wet = sheet.z > -${(HIDDEN_DIVE * 0.5).toFixed(3)} && sheet.x > land;
  float base = wet ? sheet.x : land;
  float top = base + COLUMN * (0.85 + 0.3 * fract(rnd.y * 5.13));
  // Off the screen, its whole path (a straight line, so between its ends): nothing more to do.
  float z0, z1;
  vec2 s0 = screenOf(vec3(g.x, base, g.y), z0);
  vec2 top0 = g - slant * (top - base);
  vec2 s1 = screenOf(vec3(top0.x, top, top0.y), z1);
  // Its widest stroke or its splash may reach past the path's ends by up to this much (px).
  float pxPerMetre = projectionMatrix[0][0] * uScreen.x * 0.5;
  vec2 reach = 1.0 + 2.0 * max(0.65 * uRainStroke.y + 1.0, max(uRainShape.w * pxPerMetre, 3.0)) / uScreen;
  if (any(greaterThan(min(s0, s1), reach)) || any(lessThan(max(s0, s1), -reach))) return;

  // Where it stops: there, or a roof, or (some of the time) a crown, along the way.
  float stop = base;
  float roof = coverAlong(uShelterFull, g, slant, base, top);
  if (roof > stop) { stop = roof; wet = false; }
  bool caught = false;
  if (rnd.w < ${PARTIAL_COVER.toFixed(2)}) {
    float crown = coverAlong(uShelterPartial, g, slant, base, top);
    // Lost among the leaves somewhere under the crown's top.
    if (crown > stop) { stop = max(crown - fract(rnd.z * 7.31) * 2.0, stop); caught = true; }
  }
  float drop = top - stop;
  float length_ = uRainStroke.x * (0.8 + 0.4 * fract(rnd.z * 3.7));
  vec2 half_ = uScreen * 0.5;

  // Lit as rain is where it is: by the sky, a little by the sun, as bright as the light there.
  vec3 mid = vec3(g.x, stop + 1.0, g.y);
  cloudAt(mid);
  vec3 col = exposeHere(vec3(${RAIN_BASE}) * mix(skyTint(), sunTint(), 0.3));
  float alpha = show;

  if (aCorner.z < 0.5) {
    // The stroke: its head falling from the top to where it stops, its tail a stroke's length behind, both stopping there.
    float head = max(top - fallen, stop), tail = max(min(top - fallen + length_, top), stop);
    if (tail - head < 1e-3) return;
    vec2 ha = g - slant * (head - base), ta = g - slant * (tail - base);
    float za, zb;
    vec2 sa = screenOf(vec3(ta.x, tail, ta.y), za) * half_, sb = screenOf(vec3(ha.x, head, ha.y), zb) * half_;
    vec2 d = sb - sa;
    float len = length(d);
    vec2 dir = len > 1e-3 ? d / len : vec2(0.0, -1.0), across = vec2(-dir.y, dir.x);
    // Each a little wider or narrower, fainter or stronger than the next, as a brush lays them.
    float hw = 0.5 * uRainStroke.y * (0.7 + 0.6 * fract(rnd.w * 11.3)), pad = hw + 1.0;
    float t = aCorner.y;
    vec2 sp = mix(sa, sb, t) + dir * (t * 2.0 - 1.0) * pad + across * aCorner.x * pad;
    gl_Position = vec4(sp / half_, mix(za, zb, t), 1.0);
    vShape = vec4(aCorner.x * pad, t * len + (t * 2.0 - 1.0) * pad, len, hw);
    // Fading as it shortens into what it hit, so its round end doesn't linger and blink out.
    float left = smoothstep(0.0, 0.4 * length_, tail - head);
    vColor = vec4(col, alpha * uRainStroke.w * (0.65 + 0.35 * fract(rnd.z * 17.9)) * smoothstep(0.0, FADE_IN, fallen) * left);
  } else {
    // The splash, where it landed, for a moment after: not on the water (the water's rings are its splash) nor in a crown.
    float age = (fallen - drop) / uRainSplash;
    if (wet || caught || age < 0.0 || age > 1.0) return;
    vec2 at = g - slant * (stop - base);
    // Brought a little towards the camera, so the land it lies on doesn't hide it.
    vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
    float z;
    vec2 sc = screenOf(vec3(at.x, stop + 0.05, at.y) + toCam * 0.3, z) * half_;
    float size = max(uRainShape.w * pxPerMetre, 3.0);
    gl_Position = vec4((sc + aCorner.xy * size) / half_, z, 1.0);
    vShape = vec4(aCorner.xy, uRainShape.z, age);
    vColor = vec4(col, alpha * min(1.0, uRainStroke.w * 1.6));
  }
}
`;

const RAIN_FRAG = /* glsl */ `
precision highp float;
uniform vec4 uRainStroke;
uniform vec4 uRainShape;
varying vec4 vShape;
varying vec4 vColor;
varying float vPart;
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;
// A soft line's cover at d px from its middle, half w px wide: from a crisp edge (a pixel's blur) to a soft fall-off.
float lineCover(float d, float w, float soft) {
  float crisp = clamp(w + 0.5 - d, 0.0, 1.0);
  float x = d / max(w + 0.5, 0.75);
  return mix(crisp, exp(-x * x * 2.5), soft);
}
void main() {
  float a;
  if (vPart < 0.5) {
    float len = vShape.z, along = clamp(vShape.y, 0.0, len), t = len > 0.0 ? along / len : 1.0;
    // Thinner and fainter towards the tail.
    float taper = mix(1.0 - uRainShape.x, 1.0, t);
    float w = vShape.w * taper;
    // Thinner than a pixel: as wide as a pixel, fainter.
    float thin = min(1.0, w / 0.6);
    a = lineCover(length(vec2(vShape.x, vShape.y - along)), max(w, 0.6), uRainStroke.z) * thin * taper;
  } else {
    vec2 q = vShape.xy;
    float age = vShape.w, shape = vShape.z;
    float grow = smoothstep(0.0, 0.25, age), fade = (1.0 - age) * (1.0 - age);
    if (shape < 0.5) {
      // A soft dab, flat on the ground, widening.
      float r = length(q * vec2(1.0, 2.2)) / mix(0.45, 1.0, grow);
      a = (1.0 - smoothstep(0.4, 1.0, r)) * 0.7;
    } else if (shape < 1.5) {
      // A crown: a few short ticks thrown up and out from where it landed.
      vec2 o = q - vec2(0.0, -0.55);
      float r = length(o), ang = atan(o.x, o.y);
      float k = clamp(floor(ang / 0.5 + 0.5), -2.0, 2.0);
      float off = abs(ang - k * 0.5) * r;
      float reach = mix(0.35, 1.05, grow);
      a = (1.0 - smoothstep(0.05, 0.12, off)) * smoothstep(reach - 0.5, reach - 0.3, r) * (1.0 - smoothstep(reach - 0.1, reach, r));
      a *= step(abs(ang), 1.3);
    } else {
      // Beads: a few drops thrown up, rising and falling.
      a = 0.0;
      for (int i = 0; i < 3; i++) {
        float fi = float(i) - 1.0;
        vec2 c = vec2(fi * 0.55 * grow, -0.5 + (0.8 - abs(fi) * 0.3) * sin(age * 3.1416));
        a = max(a, 1.0 - smoothstep(0.12, 0.24, length((q - c) * vec2(1.0, 1.3))));
      }
    }
    a *= fade * smoothstep(0.0, 0.2, age);
  }
  a *= vColor.a;
  if (a < 0.004) discard;
  gColor = vec4(vColor.rgb * a, a);
  // The aux as it was: no lines on the rain, and the fog and haze by what's behind it.
  gAux = vec4(0.0);
}
`;

/**
 * Rings on the water where the drops land (#11), for the water's shader: in cells keyed to the world, each now and then
 * a ring spreads from somewhere new and fades, and how many cells have one each time is how hard it rains (a ring
 * fades as the rain changes, never pops). Floodwater too. Needs NOISE; the uniforms are Rain's.
 */
export const RAIN_RINGS_GLSL = /* glsl */ `
uniform vec4 uRings;     // x the share of cells with a ring each time, y the widest ring (m), z the line's width (m), w how strong
uniform float uRingsDot; // the drop's dot at the centre, 0..1
float rainRings(vec2 xz) {
  float cell = uRings.y * 2.0;
  vec2 q = xz / cell, i = floor(q);
  // At least about a pixel wide, so the rings don't shimmer as the camera draws back; fainter as they shrink to nothing.
  float px = max(length(fwidth(xz)), 1e-4);
  float w = max(uRings.z, px * 0.8);
  float far = smoothstep(px * 4.0, px * 10.0, uRings.y);
  float sum = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 c = i + vec2(x, y);
    float h = hash12(c * 1.37 + 0.5);
    float beat = uTime * (0.9 + 0.5 * h) + h * 9.0;
    float k = floor(beat), life = fract(beat);
    // Whether this cell rings this time, faded over a band of the share rather than switched, so a ring already spreading
    // as the rain eases off or sets in fades rather than blinks.
    float on = clamp((uRings.x - hash12(c * 3.1 + mod(k, 512.0) * 0.731) * 0.85) / 0.15, 0.0, 1.0);
    if (on <= 0.0) continue;
    vec2 r = hash22(c + mod(k, 512.0) * vec2(7.13, 3.71));
    vec2 centre = (c + 0.2 + 0.6 * r) * cell;
    float d = length(xz - centre), rad = life * uRings.y * (0.6 + 0.4 * r.x);
    float fade = (1.0 - life) * (1.0 - life) * smoothstep(0.0, 0.06, life);
    float ring = exp(-pow((d - rad) / w, 2.0)) * fade;
    float dot_ = exp(-pow(d / (w * 1.6), 2.0)) * (1.0 - smoothstep(0.0, 0.3, life));
    sum += (ring + dot_ * uRingsDot) * on;
  }
  return min(sum, 1.0) * uRings.w * far;
}
`;

/**
 * The veil of rain in the distance (#11), for the post pass: streaks falling over the far part of the view, keyed to the
 * view's plane so they move with the land as the camera pans, slanted by the wind, in broad sheets, thicker the farther
 * past the camera's target. Needs the post pass's camera uniforms and fogNoise.
 */
export const RAIN_VEIL_GLSL = /* glsl */ `
uniform vec4 uRainVeil;       // x how thick, y how far its streaks have fallen (in their noise's cells), z its slant across the screen, w how crisp
uniform vec4 uRainVeilShape;  // x its streaks' width (m), y their length (m), z its sheets' size (m), w how far its sheets have fallen (cells)
uniform vec3 uRainVeilColor;
// How far past the camera's target it's at its thickest (m).
const float VEIL_FAR = 30.0;
float rainVeil(vec2 ndc, float depth) {
  if (uRainVeil.x <= 0.0) return 0.0;
  float far = smoothstep(0.0, VEIL_FAR, depth - uTargetDepth);
  // Where the pixel is in the view's plane (m), moving with the land as the camera pans.
  vec3 r = normalize(uCamRight), u = normalize(uCamUp);
  vec2 s = vec2(dot(uCamPos, r) + ndc.x * length(uCamRight), dot(uCamPos, u) + ndc.y * length(uCamUp));
  s.x += s.y * uRainVeil.z;
  float n = fogNoise(vec2(s.x / uRainVeilShape.x, s.y / uRainVeilShape.y + uRainVeil.y));
  float streak = smoothstep(mix(-0.2, 0.25, uRainVeil.w), mix(0.9, 0.45, uRainVeil.w), n);
  float sheets = fogNoise(s / uRainVeilShape.z + vec2(31.0, uRainVeilShape.w)) * 0.5 + 0.5;
  return uRainVeil.x * far * mix(0.3, 1.0, streak) * mix(0.45, 1.0, sheets);
}
`;

/**
 * The drops: per corner, where on the stroke or the splash it is. Which drop an instance is (its cell, its rank there,
 * its random numbers) the vertex shader works out from the instance's number and the cells drawn.
 */
function dropsGeometry(): THREE.InstancedBufferGeometry {
  const g = new THREE.InstancedBufferGeometry();
  // The stroke's four corners, then the splash's.
  const corners = new Float32Array([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1]);
  g.setAttribute('aCorner', new THREE.BufferAttribute(corners, 3));
  // three wants a position; the corners are all the vertex shader reads.
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24), 3));
  g.setIndex([0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7]);
  g.instanceCount = 0;
  // Nothing to bound: an empty box, so the shelter map's bounds of the scene leave it out.
  g.boundingBox = new THREE.Box3();
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
  return g;
}

/** The rain as drawn: the drops' mesh, and the uniforms for the drops, the water's rings and the post pass's veil. */
export class Rain {
  readonly uniforms = {
    uRainCells: { value: new THREE.Vector4(0, 0, 1, 1) },
    uRain: { value: new THREE.Vector4(0, 0, 1, 8) },
    uRainStroke: { value: new THREE.Vector4() },
    uRainShape: { value: new THREE.Vector4() },
    uRainSplash: { value: 1 },
    uRings: { value: new THREE.Vector4(0, 0.4, 0.04, 0) },
    uRingsDot: { value: 0 },
  };
  /** For the post pass. */
  readonly veil = {
    uRainVeil: { value: new THREE.Vector4() },
    uRainVeilShape: { value: new THREE.Vector4(1, 1, 1, 1) },
    uRainVeilColor: { value: new THREE.Color() },
  };
  readonly mesh: THREE.Mesh;
  look: RainLook = RAIN_LOOKS.a;
  /** How far the rain has fallen (m), from which each drop's place in its fall is worked out. */
  private fallen = 0;
  private last = NaN;
  private box = new THREE.Box3();
  private corner = new THREE.Vector3();
  private forward = new THREE.Vector3();

  constructor(shared: SharedUniforms, shelter: Record<string, THREE.IUniform>) {
    const geometry = dropsGeometry();
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: { ...shared, ...shelter, ...this.uniforms },
      vertexShader: RAIN_VERT,
      fragmentShader: RAIN_FRAG,
      transparent: true,
      depthWrite: false,
      // A stroke's corners turn whichever way it falls on screen.
      side: THREE.DoubleSide,
      // See-through paint over the painting, premultiplied: the aux's alpha of 0 leaves it as it was.
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.userData.kind = 'rain';
    this.mesh.userData.reflect = false;
    this.mesh.userData.under = false;
  }

  /**
   * Each frame, before drawing: `rain` how hard it rains (0..1, eased), `zoom` the camera's (screen px a metre), `px`
   * the pixels drawn a screen pixel, `share` the quality's share of the drops, `shown` whether things in the air are
   * drawn at all, the wind as a whole (m/s, towards), and the view's camera (as it is this frame) and the height of
   * the land at its target.
   */
  update(time: number, rain: number, zoom: number, px: number, share: number, shown: boolean, wind: THREE.Vector2,
    camera: THREE.OrthographicCamera, groundY: number) {
    const L = this.look, r = shown ? THREE.MathUtils.clamp(rain, 0, 1) : 0;
    const speed = THREE.MathUtils.lerp(L.speed[0], L.speed[1], r);
    const dt = time - this.last;
    // On from where it was, a gap of over a second (a paused tab) as a frame's worth. Back in time (a tool going back to
    // draw a moment again) or the first frame: from the clock. So in steady rain the same time draws the same rain,
    // however the tools' frames reached it (while the rain changes, how it got there counts: they draw in a set order).
    if (!(dt >= 0)) this.fallen = speed * time;
    else this.fallen += speed * (dt <= 1 ? dt : 0.1);
    this.last = time;
    const splash = L.splash[2] * (L.speed[0] + L.speed[1]) * 0.5;
    const cycle = COLUMN * 1.15 + Math.max(L.stroke[0] * 1.2, splash) + 1;
    // The screen holds about as many strokes at any zoom: fewer a square metre as the camera draws back. A shower
    // (0.6) shows most of a storm's strokes, so that it reads as rain: the count rises fastest in light rain.
    const perArea = L.density * r ** 0.6 * Math.min((zoom / REFERENCE_ZOOM) ** 2, 4) * share;
    const perCell = perArea * CELL * CELL;
    // The cells to draw: the land the view sees, between the lowest land and the tops of the columns over the highest,
    // and as far round it as the wind can slant a stroke (a drop landing out of sight can fall through the view).
    const u = this.uniforms;
    const slant = Math.min(MAX_SLANT, (wind.length() / Math.max(speed, 1)) * L.slant * 1.5 + 0.1);
    const box = this.box.makeEmpty();
    const fwd = this.forward.set(0, 0, -1).transformDirection(camera.matrixWorld);
    for (const y of [groundY - LAND_BELOW, groundY + LAND_ABOVE + COLUMN_TOP]) {
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const p = this.corner.set(sx, sy, 0).unproject(camera);
        p.addScaledVector(fwd, (y - p.y) / fwd.y);
        box.expandByPoint(p);
      }
    }
    const pad = slant * (COLUMN_TOP + LAND_ABOVE) + 2;
    const x0 = Math.floor((box.min.x - pad) / CELL), z0 = Math.floor((box.min.z - pad) / CELL);
    const across = Math.floor((box.max.x + pad) / CELL) - x0 + 1, deep = Math.floor((box.max.z + pad) / CELL) - z0 + 1;
    const cells = across * deep;
    const slots = Math.min(Math.ceil(perCell), Math.floor(MAX_DROPS / cells));
    u.uRainCells.value.set(x0, z0, across, cells);
    u.uRain.value.set(perCell, this.fallen % (cycle * 4096), cycle, speed);
    u.uRainStroke.value.set(L.stroke[0], L.stroke[1] * Math.sqrt(zoom / REFERENCE_ZOOM) * px, L.stroke[2], L.stroke[3]);
    u.uRainShape.value.set(L.taper, L.slant, L.splash[0], L.splash[1]);
    u.uRainSplash.value = splash;
    const g = this.mesh.geometry as THREE.InstancedBufferGeometry;
    g.instanceCount = cells * slots;
    this.mesh.visible = slots > 0;
    // Rings: more of the cells ring as it rains harder.
    u.uRings.value.set(Math.min(1, r * 1.1), L.rings[0], L.rings[1], L.rings[2] * Math.min(1, 0.4 + r));
    u.uRingsDot.value = L.rings[3];
    // The veil: streaks falling down the screen as fast as the drops, slanted by the wind across it, and its sheets
    // drifting down slower. Offsets in the noise's cells, which repeat every FOG_NOISE_CELLS, so they wrap unseen.
    const v = this.veil;
    const right = this.corner.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    const sideways = wind.x * right.x + wind.y * right.z, down = this.fallen * Math.cos(Math.PI / 6);
    v.uRainVeil.value.set(L.veil[0] * r, (down / L.veil[2]) % FOG_NOISE_CELLS, (sideways * L.slant) / (speed * Math.cos(Math.PI / 6)), L.veil[3]);
    v.uRainVeilShape.value.set(L.veil[1], L.veil[2], L.veil[4], ((down * 0.25) / L.veil[4]) % FOG_NOISE_CELLS);
  }

  /** The veil's colour: the rain's light as the fog's is lit (see litFog), set with the look's light. */
  setVeilColor(lit: (out: THREE.Color, base: THREE.Color) => void) {
    lit(this.veil.uRainVeilColor.value, RAIN_VEIL_BASE);
  }
}

/** The veil's colour in noon's clear light (sRGB as the game gives a fog's): a pale grey rain. */
const RAIN_VEIL_BASE = new THREE.Color().setRGB(0.74, 0.78, 0.82);
