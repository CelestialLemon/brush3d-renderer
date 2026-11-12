import * as THREE from 'three';
import type { SeasonSettings } from './season';
import { seasonTurn } from './seasonLook';
import { PARTIAL_COVER } from './shelter';

// Wet ground and things (#11): the game says how wet the land is and how muddy (the ground's map, ground.ts); the renderer
// draws it. Painted things (the ground, grass, crops, leaves, stones, wood) go darker and richer, as a stone darkens when
// splashed; inked things (what people build) darken a little and take a sheen, a bright band on their lit side; bare earth
// turns to mud where the game says it's muddy. None under a roof, to its edge, and less under a crown (the shelter map,
// #10), finer than the game's cells. No puddles: #50 tried them, and the developer didn't like them (2026-11-11).
//
// How it's painted: a painted material is lit as it is dry, then darkened and made richer (wetFinish), its lit and its
// shade alike, so the shade is still the hour's teal or violet, deeper; the mud is the ground's own colour before it's lit
// (wetBase). An inked one takes its sheen over the lit colour (wetInked). Before the snow, so snow lying on wet ground is
// still white.

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
  /** Mud on tracks and bare soil. */
  mudLook: {
    a: 'dark: dark, rich brown earth',
    b: 'churned: dark brown, with streaks of wet shine',
  },
} as const;
export type WetLooks = { [K in keyof typeof WET_LOOKS]: keyof (typeof WET_LOOKS)[K] };
export const DEFAULT_WET_LOOKS: WetLooks = { damp: 'a', sheen: 'a', mudLook: 'a' };

/** The earth's hue (OKLab degrees): the tracks' dirt 76°, their ruts 73°. */
const EARTH_HUE = 76;
/**
 * The grass's hue as the season has turned it (OKLab degrees): a summer meadow's 130° or so, a winter's straw-olive
 * 30° nearer the earth's (seasonLook.ts), for the mud to tell the earth from the grass by (mudHere).
 */
export function grassHue(season: SeasonSettings | null) { return 130 + seasonTurn(season).shift; }

/** The looks as the shaders take them: each letter as 0, 1, 2. */
export function wetLookVector(looks: WetLooks, out: THREE.Vector4) {
  const n = (l: string) => l.charCodeAt(0) - 97;
  return out.set(n(looks.damp), n(looks.sheen), n(looks.mudLook), 0);
}

/**
 * Wet things, for every material but the water (FRAG_HEAD, after SNOW_GLSL, whose ground map and hollows it reads). A
 * material calls wetAt(p) once (how wet and how muddy it is there, less what shelters it); a painted one then wetBase on
 * its own colour before it's lit and wetFinish on the lit colour, an inked one wetInked on its lit colour (WET_INK_GLSL).
 */
export const WET_GLSL = /* glsl */ `
uniform vec4 uWetLook;   // the looks being picked (#11): painted, inked, mud; 0 for A, 1 B, 2 C
uniform float uGrassHue; // the grass's hue as the season has turned it (OKLab degrees)
// How wet and how muddy it is here (0..1, the game's, less under shelter), set by wetAt.
float gWet = 0.0, gMud = 0.0;
// The wet and the mud at p, less what shelters it: none under a roof, to its edge; under a crown, less. What stands low on
// the ground (AT_GROUND: the ground, the grass, the crops, stones and wood) reads its shelter at the ground with the
// land's hollows, in one lookup; what stands higher there (a branch over a low roof's edge) whether a roof or a crown is
// over it, as the snow does (snowAt); the rest reads the shelter map where it is. Under the water, none (the bed is the
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
// Wet paint, darker and richer: how much darker and how much richer (look A: a little darker, the colour deeper; B: much
// darker, a little deeper). In plain RGB, not OKLab: it's paid on every pixel of the ground while it's wet.
vec2 wetK() { return uWetLook.x < 0.5 ? vec2(0.42, 0.3) : vec2(0.6, 0.15); }
// Both once it's lit (wetFinish, on paintBands' colour), as a wet stone takes the same light as a dry one and is darker
// and deeper for it: the lit and the shade alike, so the shade keeps its teal or violet in proportion, only deeper. Not
// before: paintBands would see a darker, richer colour, its shade (darker and cooler) would fall past the colours a screen
// can show, and it would pull each back by a search, on nearly half the screen, for 0.15 ms or so (Sol, #11). Here the
// richer colour is clipped where it passes them, as dark, deep paint is at its richest.
vec3 wetFinish(vec3 c) {
  if (gWet <= 0.0) return c;
  float w = wetShow();
  vec2 k = wetK();
  // The mud has its own colour (muddy): richer still would turn it orange.
  float y = dot(c, WET_LUMA), s = 1.0 + k.y * w * (1.0 - gMudShown);
  return max(mix(vec3(y), c, s), 0.0) * (1.0 - k.x * w);
}
#ifdef GROUND
// Mud: only on the earth itself. The game's cells are coarser than a track: mud on the grass beside it would read as a
// brown halo. So mud takes the earth's share of the ground's own colour: the farm's tracks and yard are earth blended
// with grass (the porch's 64 parts in 100, its edges less), by vertex, a metre or so apart. That share is read from the
// hue, the earth's (EARTH_HUE) to the grass's as the season has turned it (uGrassHue): no hard line, which would follow
// the vertices' triangles, so the mud blends out as the earth does.
float mudHere() {
  if (gMud <= 0.0) return 0.0;
  vec3 lab = linToOklab(vColor);
  float share = clamp((uGrassHue - degrees(atan(lab.z, lab.y))) / (uGrassHue - ${EARTH_HUE.toFixed(1)}), 0.0, 1.0);
  float earth = smoothstep(0.15, 0.85, share) * smoothstep(0.015, 0.03, length(lab.yz));
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
// The churned mud's streaks of wet shine (look B), on the ground's lit colour: the sky caught in the ruts.
vec3 churned(vec3 c, vec3 p) {
  float m = gMudShown;
  if (uWetLook.z < 0.5 || m <= 0.0) return c;
  float s = smoothstep(0.45, 0.8, strokes(p.xz * 1.6, 0.6) + fbm2(p.xz * 0.7) * 0.3);
  return mix(c, skyTint() * 0.85, s * m * 0.4);
}
`;

/**
 * Wet inked things (INK_FRAG, after MIRROR_SKY): wetInked(col, n, p, vis) on the lit colour, after wetAt. They darken a
 * little (wet paint and timber) and take a sheen: streaks of shine where the mirrored view meets the light (the sun's or,
 * under cloud, the bright sky's overhead), or a glaze of the sky mirrored, or both. Not exposed (the material does that).
 */
export const WET_INK_GLSL = /* glsl */ `
vec3 wetInked(vec3 c, vec3 n, vec3 p, float vis) {
  float w = wetShow();
  if (w <= 0.0) return c;
  float y = dot(c, WET_LUMA);
  c = max(mix(vec3(y), c, 1.0 + 0.12 * w), 0.0) * (1.0 - 0.27 * w);
  vec3 v = toCamera();
  if (uMirror > 0.5) v.y = -v.y;
  vec3 r = reflect(-v, n);
  float sky = overcastHere().x;
  if (uWetLook.y < 0.5 || uWetLook.y > 1.5) {
    // Streaks: where the mirrored view meets the light. Under cloud the bright sky is broad, and so is its band; in the sun,
    // only where the sun reaches.
    vec3 l = normalize(mix(uSunDir, vec3(0.0, 1.0, 0.0), sky));
    float band = smoothstep(mix(0.7, 0.5, sky), mix(0.88, 0.66, sky), dot(r, l)) * mix(vis, 1.0, sky);
    // In streaks down the surface, as the water runs (a flat roof faces one way: a band alone would light it all).
    vec3 down = normalize(vec3(0.0, -1.0, 0.0) - n * -n.y + vec3(1e-4, 0.0, 0.0));
    vec3 across = cross(n, down);
    band *= smoothstep(0.1, 0.6, strokes(vec2(dot(p, down) * 0.6, dot(p, across) * 1.2), 0.0) * 0.5 + 0.5);
    vec3 shine = mix(mix(uGapSkyBottom, vec3(1.0), 0.6) * skyTint(), vec3(1.0) * sunTint(), 1.0 - sky);
    c = mix(c, shine, band * w * 0.55);
  }
  if (uWetLook.y > 0.5) {
    // Glaze: the sky mirrored, with its clouds, more at a glancing angle.
    float cloud;
    vec3 seen = mirrorSky(skyPoint(p, r), 1.0 - clamp(r.y * 1.5, 0.0, 1.0), cloud);
    float fres = 0.1 + 0.35 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
    c = mix(c, seen, fres * w);
  }
  return c;
}
`;

