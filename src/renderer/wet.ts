import * as THREE from 'three';
import { PARTIAL_COVER } from './shelter';

// Wet ground and things (#11): the game says how wet the land is and how muddy (the ground's map, ground.ts); the renderer
// draws it. Painted things (the ground, grass, crops, leaves, stones, wood) go darker and richer, as a stone darkens when
// splashed; inked things (what people build) darken a little and take a glaze, the sky mirrored faintly in them; bare
// earth turns to mud where the game says it's muddy. None under a roof, to its edge, and less under a crown (the shelter
// map, #10), finer than the game's cells. No puddles: #50 tried them, and the developer didn't like them (2026-11-11).
//
// The developer's picks (2026-11-12), from candidates on #60's preview: painted things "richer" (a little darker, the
// colour deeper; not "darker", much darker and a little deeper); what people build a "glaze" (not "streaks" of shine
// where the surface turns to the light, which came and went with the light's angle and lit a roof's slope brightly on a
// clear night, nor both); mud "dark" (not "churned", streaked with the sky's shine, which read as white specks).
//
// How it's painted: a painted material is lit as it is dry, then darkened and made richer (wetFinish), its lit and its
// shade alike, so the shade is still the hour's teal or violet, deeper; the mud is the ground's own colour before it's lit
// (wetBase). An inked one takes its glaze over the lit colour (wetInked). Before the snow, so snow lying on wet ground is
// still white.

/** The earth's hue (OKLab degrees): the tracks' dirt 76°, their ruts 73°. */
const EARTH_HUE = 76;
/** The grass's (OKLab degrees): a meadow's 130° or so, the lime 123°. */
const GRASS_HUE = 130;

/**
 * How much of the ground is earth at each vertex, 0..1, from its own colours (linear rgb triples, as the game sent them):
 * where mud can lie (mudHere). The farm's tracks and yard are earth blended with grass (the porch's 64 parts in 100, its
 * edges less), and that share is read from the hue, the earth's (EARTH_HUE) to the grass's (GRASS_HUE); a grey is none.
 * From the colours before a season turns them (seasonLook.ts): a dry winter turns a yellow-green to a straw the dirt's
 * own colour, so the colour drawn can't tell them apart. Once, as the ground is added.
 */
export function earthShares(rgb: ArrayLike<number>): Float32Array {
  const out = new Float32Array(rgb.length / 3);
  const smooth = THREE.MathUtils.smoothstep;
  for (let i = 0; i < out.length; i++) {
    const r = rgb[3 * i], g = rgb[3 * i + 1], b = rgb[3 * i + 2];
    // Linear sRGB to OKLab (Björn Ottosson): only a and b, for the hue and chroma.
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const hue = (Math.atan2(B, A) * 180) / Math.PI;
    const share = THREE.MathUtils.clamp((GRASS_HUE - hue) / (GRASS_HUE - EARTH_HUE), 0, 1);
    out[i] = share * smooth(Math.hypot(A, B), 0.015, 0.03);
  }
  return out;
}

/**
 * Wet things, for every material but the water (FRAG_HEAD, after SNOW_GLSL, whose ground map and hollows it reads). A
 * material calls wetAt(p) once (how wet and how muddy it is there, less what shelters it); a painted one then wetBase on
 * its own colour before it's lit and wetFinish on the lit colour, an inked one wetInked on its lit colour (WET_INK_GLSL).
 */
export const WET_GLSL = /* glsl */ `
// How wet and how muddy it is here (0..1, the game's, less under shelter), set by wetAt.
float gWet = 0.0, gMud = 0.0;
// The wet and the mud at p, less what shelters it: none under a roof, to its edge; under a crown, less. What stands low on
// the ground (AT_GROUND: the ground, the grass, the crops, stones and wood) reads its shelter at the ground with the
// land's hollows, in one lookup; what stands higher there (a branch over a low roof's edge) whether a roof or a crown is
// over it, as the snow does (groundAt); the rest reads the shelter map where it is. Under the water, none (the bed is the
// water's).
float wetAt(vec3 p) {
  vec2 g = groundState(p.xz).zw;
  gWet = g.x; gMud = g.y;
  if (gWet + gMud < 0.004 || (uGroundOn > 1.5 && p.y < waterTop(p.xz))) { gWet = 0.0; gMud = 0.0; return 0.0; }
#ifdef AT_GROUND
  // Read a little off the point, by a wobble keyed to the world, so a dry patch's edge is painted, not ruled along the
  // roof's (a fifth of a metre either way).
  vec2 q = p.xz * 2.1;
  float h = hollowAt(p.xz + vec2(sin(q.y + 1.7 * sin(q.x * 0.71)), sin(q.x * 1.13 + 1.7 * sin(q.y * 0.83))) * 0.15).z;
#ifdef GROUND
  float above = 0.0;
#else
  float above = h > 0.0 ? p.y - landTop(p) : 0.0;
#endif
  float cover = h < 0.0 ? shelter(p) : above < 0.3 ? h
    : max(step(p.y, shelterTop(p) - 0.1), ${PARTIAL_COVER.toFixed(2)} * step(p.y, crownTop(p) - 0.1));
#else
  float cover = shelter(p);
#endif
  gWet *= 1.0 - cover; gMud *= 1.0 - cover;
  return gWet + gMud;
}
// How wet it looks, 0..1: it darkens fast, nearly all of it by 0.6.
float wetShow() { return smoothstep(0.0, 0.6, gWet); }
const vec3 WET_LUMA = vec3(0.2126, 0.7152, 0.0722);
// How much of the ground's earth is mud here (set by wetBase).
float gMudShown = 0.0;
// Wet paint, darker and richer: 42% darker at its wettest, its colour 30% deeper. In plain RGB, not OKLab: it's paid on
// every pixel of the ground while it's wet. Both once it's lit (wetFinish, on paintBands' colour), as a wet stone takes the same light as a dry one and is darker
// and deeper for it: the lit and the shade alike, so the shade keeps its teal or violet in proportion, only deeper. Not
// before: paintBands would see a darker, richer colour, its shade (darker and cooler) would fall past the colours a screen
// can show, and it would pull each back by a search, on nearly half the screen, for 0.15 ms or so (Sol, #11). Here the
// richer colour is clipped where it passes them, as dark, deep paint is at its richest.
vec3 wetFinish(vec3 c) {
  if (gWet <= 0.0) return c;
  float w = wetShow();
  // The mud has its own colour (muddy): richer still would turn it orange.
  float y = dot(c, WET_LUMA), s = 1.0 + 0.3 * w * (1.0 - gMudShown);
  return max(mix(vec3(y), c, s), 0.0) * (1.0 - 0.42 * w);
}
#ifdef GROUND
// How much of the ground here is earth (earthShares, by vertex).
varying float vEarth;
// Mud: only on the earth itself. The game's cells are coarser than a track: mud on the grass beside it would read as a
// brown halo. So mud takes the earth's share of the ground (vEarth, a metre or so between vertices): no hard line, which
// would follow the vertices' triangles, so the mud blends out as the earth does.
float mudHere() {
  if (gMud <= 0.0) return 0.0;
  float earth = smoothstep(0.15, 0.85, vEarth);
  // A muddy cell's earth is all mud (the map's mud is spread a cell, ground.ts): a steep rise, so it doesn't fade between
  // one cell's middle and the next's; where the game's mud ends, a ragged edge, keyed to the world.
  return smoothstep(0.15, 0.45, gMud + snoise(vRestPos.xz * 0.9 + 3.0) * 0.12) * earth;
}
// Muddy earth: a dark, rich brown (sRGB 110, 75, 50 as against its own grey) at a fifth of the earth's brightness, before
// it's lit (and darker again once lit, as all wet paint is: wetFinish).
vec3 muddy(vec3 c, float m) {
  vec3 mud = dot(c, WET_LUMA) * 0.22 * vec3(1.82, 0.82, 0.36);
  return mix(c, mud, m * 0.9);
}
#endif
// A painted surface's own colour, wet (call after wetAt), before it's lit: the ground's earth muddy where the game says.
// (Darker and richer once lit: wetFinish.)
vec3 wetBase(vec3 c) {
#ifdef GROUND
  gMudShown = mudHere();
  if (gMudShown > 0.0) c = muddy(c, gMudShown);
#endif
  return c;
}
`;

/**
 * Wet inked things (INK_FRAG, after MIRROR_SKY): wetInked(col, n, p) on the lit colour, after wetAt. They darken a little
 * (wet paint and timber) and take a glaze: the sky mirrored faintly, its clouds drifting over, more at a glancing angle.
 * Not exposed (the material does that).
 */
export const WET_INK_GLSL = /* glsl */ `
vec3 wetInked(vec3 c, vec3 n, vec3 p) {
  float w = wetShow();
  if (w <= 0.0) return c;
  float y = dot(c, WET_LUMA);
  c = max(mix(vec3(y), c, 1.0 + 0.12 * w), 0.0) * (1.0 - 0.27 * w);
  vec3 v = toCamera();
  if (uMirror > 0.5) v.y = -v.y;
  vec3 r = reflect(-v, n);
  float cloud;
  vec3 seen = mirrorSky(skyPoint(p, r), 1.0 - clamp(r.y * 1.5, 0.0, 1.0), cloud);
  float fres = 0.1 + 0.35 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
  return mix(c, seen, fres * w);
}
`;

