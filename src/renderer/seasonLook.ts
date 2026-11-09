import * as THREE from 'three';
import type { Look } from './look';
import type { Character, Season, SeasonSettings } from './season';

// The season's look (#13): its colours on what grows (the ground's green and the grass, reeds among it) and its light, the
// base coat the weather and the hour are laid over (the developer, 2026-11-03: "each season should have a vibe and its
// light should reflect it"). The game sends its colours as a summer's; the renderer turns them.
//
// - The colours are turned once per level, on the vertices (setSeason): no cost in a frame. Only greens turn (a hue window
//   round yellow-green to teal), so the earth of tracks, soil and banks, stones and flowers keep theirs. Crops keep their
//   own (their stage is the game's), and the trees are their own thread's.
// - The light is a tint on the hour's look by day (its sun, sky, rim and haze multiplied, its shade's and lit band's hues
//   leaned), so dawn stays pink and golden hour gold in every season, and the night is the same moonlight.
//
// The developer's picks (#13, 2026-11-07), from two looks and two winter grasses: the look close to Soil-n-Silo's seasonal
// turf with a gentle light (the other was painted, bolder), so the weather has room on top; winter's grass dormant
// straw-olive (the other was bleached pale, which read as frost on a clear day: #14's frost whitens it).

/**
 * How the season turns a green, in OKLab (lightness 0..1, chroma, hue in degrees): its hue shifted by `shift` (towards gold
 * below 0, towards blue-green above), its chroma scaled, its lightness lifted. A shift rather than one hue for all keeps
 * the land's variety (the lime rises, the teal hollows), as the game's seasonal turf keeps it.
 */
export interface Turn { shift: number; chroma: number; light: number }
/** How the season tints the light by day: multipliers on the sun's, the sky's and the haze's colour (linear rgb), the
 * shade's hue leaned towards `shadeHue` by `shadeTurn`, the lit band's warmth scaled, the haze's density and the
 * saturation scaled. */
interface Light {
  sun: [number, number, number]; sky: [number, number, number]; haze: [number, number, number];
  shadeHue: number; shadeTurn: number; shadeDepth: number; litLean: number; hazeDensity: number; saturation: number;
}
const NONE: Turn = { shift: 0, chroma: 1, light: 0 };
const PLAIN: Light = { sun: [1, 1, 1], sky: [1, 1, 1], haze: [1, 1, 1], shadeHue: 215, shadeTurn: 0, shadeDepth: 0, litLean: 1, hazeDensity: 1, saturation: 1 };

/**
 * How each season turns the greens, from summer's (the scenes' own). Close to the game's turf (Soil-n-Silo's ground.ts), as
 * it turns from its summer's: spring's about 10° greener and 15% richer, autumn's 17° to gold, 30% duller and a little
 * darker; winter's dormant straw-olive, 30° to gold, its chroma half.
 */
const TURN: Record<Season, Turn> = {
  spring: { shift: 9, chroma: 1.13, light: 0.015 },
  summer: NONE,
  autumn: { shift: -19, chroma: 0.7, light: -0.03 },
  winter: { shift: -30, chroma: 0.52, light: 0.02 },
};

/** Each season's light, a gentle tint: spring's fresh and clear, summer's warm and hazy, autumn's gold with violet shade,
 * winter's cool and pale. */
const LIGHT: Record<Season, Light> = {
  spring: { ...PLAIN, sun: [0.99, 1, 1.02], haze: [0.97, 1, 1.02], shadeHue: 205, shadeTurn: 0.15, hazeDensity: 0.85, saturation: 1.03 },
  summer: { ...PLAIN, sun: [1.02, 1, 0.97], haze: [1.03, 1, 0.95], litLean: 1.15, hazeDensity: 1.1 },
  autumn: { ...PLAIN, sun: [1.04, 0.99, 0.9], haze: [1.05, 0.99, 0.9], shadeHue: 285, shadeTurn: 0.15, litLean: 1.3, hazeDensity: 1.15 },
  winter: { ...PLAIN, sun: [0.96, 0.99, 1.06], sky: [0.96, 0.99, 1.06], haze: [0.95, 0.99, 1.07], shadeHue: 255, shadeTurn: 0.3, shadeDepth: 0.02, litLean: 0.6, saturation: 0.94 },
};

/**
 * How a character shifts the turn (the game's words): a dry or hot season parches the grass towards gold (a summer's most),
 * a wet one keeps it lusher, a hard one drabber and paler, a mild one partway back to summer's. The rest (gales, storms, a
 * high river) are weather, not the grass's.
 */
function withCharacter(t: Turn, season: Season, c: Character | null | undefined): Turn {
  const parched = (k: number) => ({ shift: t.shift - 22 * k, chroma: t.chroma * (1 - 0.2 * k), light: t.light + 0.04 * k });
  switch (c) {
    case 'dry': return parched(season === 'summer' ? 1 : 0.5);
    case 'hot': return parched(season === 'summer' ? 0.75 : 0.4);
    case 'wet': return { shift: t.shift * 0.6 + 4, chroma: t.chroma * 1.1, light: t.light - 0.015 };
    case 'hard': return { ...t, chroma: t.chroma * 0.8, light: t.light + 0.03 };
    case 'mild': return { shift: t.shift * 0.6, chroma: 1 + (t.chroma - 1) * 0.6, light: t.light * 0.6 };
    default: return t;
  }
}

/** The turn the season gives greens. */
export function seasonTurn(s: SeasonSettings | null): Turn {
  return s ? withCharacter(TURN[s.season], s.season, s.character) : NONE;
}

const smooth = THREE.MathUtils.smoothstep;
const DEG = Math.PI / 180;

/**
 * How much a hue (OKLab degrees) is a green's: yellow-green to teal, fading out towards yellow and blue. The scenes' greens
 * are 118° to 174° (the lime to the teal), their golds 75° to 93° (the wheat, the hay, the sunflowers' petals) and their
 * earths under 85°: those keep theirs.
 */
const greenness = (h: number) => smooth(h, 100, 114) * (1 - smooth(h, 195, 220));

/**
 * Turns `own` (linear rgb triples, the mesh's colours as the game sent them) into `out` by the season. Only greens turn,
 * by how green and how saturated they are (a grey or an earth keeps its colour).
 */
export function turnColours(own: ArrayLike<number>, out: Float32Array | number[], t: Turn) {
  const identity = t.shift === 0 && t.chroma === 1 && t.light === 0;
  // A run of vertices of one colour (a tuft's blades, a dab's corners) is turned once.
  let pr = NaN, pg = NaN, pb = NaN, or = 0, og = 0, ob = 0;
  for (let i = 0; i < own.length; i += 3) {
    const r = own[i], g = own[i + 1], b = own[i + 2];
    if (identity) { out[i] = r; out[i + 1] = g; out[i + 2] = b; continue; }
    if (r === pr && g === pg && b === pb) { out[i] = or; out[i + 1] = og; out[i + 2] = ob; continue; }
    pr = r; pg = g; pb = b;
    // Linear sRGB to OKLab (Björn Ottosson).
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    let L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    let C = Math.hypot(A, B), h = Math.atan2(B, A) / DEG;
    if (h < 0) h += 360;
    const w = greenness(h) * smooth(C, 0.02, 0.06);
    if (w <= 0) { out[i] = or = r; out[i + 1] = og = g; out[i + 2] = ob = b; continue; }
    // A greener shift moves the lime and the meadow green, not the teal (which would go cyan, a pool's colour, not a field's).
    h += t.shift * w * (t.shift > 0 ? 1 - smooth(h, 140, 172) : 1);
    C *= 1 + (t.chroma - 1) * w;
    L += t.light * w;
    const a2 = C * Math.cos(h * DEG), b2 = C * Math.sin(h * DEG);
    const l2 = (L + 0.3963377774 * a2 + 0.2158037573 * b2) ** 3;
    const m2 = (L - 0.1055613458 * a2 - 0.0638541728 * b2) ** 3;
    const s2 = (L - 0.0894841775 * a2 - 1.291485548 * b2) ** 3;
    out[i] = or = Math.max(0, 4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2);
    out[i + 1] = og = Math.max(0, -1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2);
    out[i + 2] = ob = Math.max(0, -0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s2);
  }
}

const tint = (c: THREE.Color, k: [number, number, number], w: number) =>
  c.setRGB(c.r * (1 + (k[0] - 1) * w), c.g * (1 + (k[1] - 1) * w), c.b * (1 + (k[2] - 1) * w));
const leanAngle = (a: number, b: number, t: number) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

/** The hour's look with the season's light laid on it, by day (the night's moonlight is every season's). */
export function seasonLight(look: Look, s: SeasonSettings | null): Look {
  if (!s) return look;
  const k = LIGHT[s.season], w = 1 - look.night;
  if (w <= 0) return look;
  tint(look.sunColor, k.sun, w); tint(look.rimColor, k.sun, w); tint(look.skyColor, k.sky, w); tint(look.hazeColor, k.haze, w);
  tint(look.skyTop, k.sky, w); tint(look.skyBottom, k.haze, w);
  look.shadeHue = leanAngle(look.shadeHue, k.shadeHue, k.shadeTurn * w);
  look.shadeDepth += k.shadeDepth * w;
  look.litLean *= 1 + (k.litLean - 1) * w;
  look.hazeDensity *= 1 + (k.hazeDensity - 1) * w;
  look.saturation *= 1 + (k.saturation - 1) * w;
  return look;
}

/**
 * The leaves in the air (#2) in each season, from the trees' own (#13): spring's young leaves and blossom, autumn's golds
 * and russets, winter's few dry browns. None for summer, whose are the leaves' own.
 */
export const LEAF_STORM: Readonly<Record<Season, readonly number[] | null>> = {
  spring: [0x9acd55, 0x87bf46, 0xc7dc7a, 0xf4e6dc, 0xeec0c8],
  summer: null,
  autumn: [0xd4a32e, 0xc9702a, 0xa33d2a, 0x9aa83e, 0xb88a3a, 0xc08a34],
  winter: [0x8a6b4a, 0x705a42, 0xa08966],
};
