import * as THREE from 'three';
import { GROUND_GLSL, HOLLOW_GLSL } from './ground';
import { PARTIAL_COVER } from './shelter';

// Lying snow (#14): the game says how deep it lies over the land (the ground's map, ground.ts); the renderer paints it on
// what faces up, as it settles: the ground, roofs, the tops of walls and fences, crowns and branches, the solar panels.
// None settles under a roof, and less under a crown (the shelter map, #10). Thin snow lies in patches, keeping to the
// land's hollows first and leaving its rises bare, and the grass and crops poke through it; deep snow buries them. Its
// shade is blue and violet, never grey.
//
// How it's painted: each material works out its own colour as before, then how much of it the snow covers there
// (snowCover and the rest below), and lays the snow's own paint (snowPaint) over that much of it, lit by the same light
// (its shade band, its half-tone, its lit band), so the snow takes the sun's shadows, the clouds' and the hour's light.

/** How deep the deepest snow (1) buries things standing on the ground, metres: the grass and the crops, to their tops. */
export const SNOW_METRES = 0.9;
/**
 * How deep the snow must be to cover open, flat ground whole (0..1, the game's): thinner, it lies in patches. A dusting
 * (0.2) covers most of the ground, with the grass poking through.
 */
export const SNOW_WHOLE = 0.3;

/**
 * Lying snow, for every material but the water (FRAG_HEAD): needs the light model (PAINT, CLOUD_LIGHT), OKLab and the
 * shelter map. A material calls snowAt(p) once (the snow lying there, as deep as the game says less what shelters it),
 * then works out how much of its surface the snow covers, and mixes in snowPaint.
 */
export const SNOW_GLSL = /* glsl */ `
${GROUND_GLSL}
${HOLLOW_GLSL}
uniform vec3 uSnowGap[4];    // the snow's paint in the gaps' light: its shade, half-tone, lit band and a stroke in it
uniform vec3 uSnowCloud[4];  // and under a cloud
uniform float uSnowTarp;     // how a roof's snow in shade is painted, the candidates for #14: 0 as it was, 1 quieter, 2 brushed
const float SNOW_METRES = ${SNOW_METRES.toFixed(2)};
// The snow lying here (0..1, the game's depth, less under shelter), and the land's hollow here (hollowAt), read by snowAt.
float gSnow = 0.0;
vec4 gHollow = vec4(0.0, 0.0, -1.0, 0.0);
// The snow lying at p: none under a roof, to its edge; under a crown, less. What stands low on the ground (the ground, the
// grass, the crops, stones, wood, the foot of a trunk) reads the shelter at the ground with the land's hollows, in one
// lookup (AT_GROUND), rather than the shelter map's eight at p; what stands higher (a branch, a tall stone over a low
// roof's edge) reads it where it is. While the bed under the water is drawn (uGroundOn 2), none below the water's top.
float gAbove = 0.0;   // how high p is over the land under it (AT_GROUND)
float snowAt(vec3 p) {
  gSnow = groundState(p.xz).x;
  if (gSnow < 0.004) { gSnow = 0.0; return 0.0; }
  if (uGroundOn > 1.5 && p.y < waterTop(p.xz)) { gSnow = 0.0; return 0.0; }
#ifdef AT_GROUND
  gHollow = hollowAt(p.xz);
#ifndef GROUND
  gAbove = p.y - landTop(p);
#endif
  // Cover is only ever over things: where the ground is open, so is everything standing on it. Where it's sheltered, a
  // thing standing up out of it may be over the cover (a branch over a low roof's edge): whether a roof or a crown is
  // over it, at its texel (two lookups; thin things don't need the soft edge).
  float cover = gHollow.z < 0.0 ? shelter(p) : gHollow.z <= 0.0 || gAbove < 0.3 ? gHollow.z
    : max(step(p.y, shelterTop(p) - 0.1), ${PARTIAL_COVER.toFixed(2)} * step(p.y, crownTop(p) - 0.1));
#else
  float cover = shelter(p);
#endif
  gSnow *= 1.0 - cover;
  return gSnow;
}
// A pattern over the land a thin cover breaks along (about -1..1; low first covered), the same for everything at a
// place, so the grass is white where the ground under it is: the land's hollows fill first and its rises go bare, broken
// up by its unevenness and a finer drift (worked out once, in the hollows map). Call after snowAt.
float snowPattern(vec2 xz) {
  if (gHollow.z >= 0.0) return gHollow.w;
  return snoise(xz * 0.6 + 4.0) * 0.6 + snoise(xz * 1.9 + 23.0) * 0.4;
}
// How much of a surface the snow covers, 0..1: from how deep it lies (d, 0..1) on a surface facing up as much as 'up' says
// (0..1), whole from SNOW_WHOLE up, in patches below, breaking along 'pattern'. 'edge' is how soft a patch's edge is.
float snowCover(float d, float up, float pattern, float edge) {
  float t = d * up / ${SNOW_WHOLE.toFixed(2)};
  float th = 0.5 + 0.42 * clamp(pattern, -1.0, 1.0);
  return smoothstep(th - edge, th + edge, t);
}
// How far up a thing standing on the ground the snow buries it, 0..1 (things at the ground: grass, crops, stones; call
// after snowAt, under AT_GROUND), with a soft line: the height of the snow's surface, at its depth, over the land. Only
// as far as the ground round it is white (a thin snow's patches, less on a slope), so it comes in with the ground's.
float snowBuries(vec3 p, float d) {
  float under = 1.0 - smoothstep(-0.02, 0.03, gAbove - d * SNOW_METRES);
  return under * snowCover(d, gHollow.z >= 0.0 ? gHollow.y : 1.0, snowPattern(p.xz), 0.06);
}
// The snow's own paint, lit by 'light' as paintBands lights a surface (0 deep shade .. 1 full sun), its bands' edges 'soft'
// wide, 'brush' the material's brush there (about -1..1), so a wide snowfield is still paint: the strokes show faintly in
// its lit band, a little darker and cooler. Its colours are worked out in the hour's light once a frame
// (SnowPaint below), in the gaps and under a cloud, mixed here by the cloud's shade. Not exposed (the material does that,
// as for its own).
vec3 snowPaint(float light, float soft, float brush) {
  vec3 shade = mix(uSnowGap[0], uSnowCloud[0], gCloud), half_ = mix(uSnowGap[1], uSnowCloud[1], gCloud);
  vec3 lit = mix(uSnowGap[2], uSnowCloud[2], gCloud), stroked = mix(uSnowGap[3], uSnowCloud[3], gCloud);
  float stroke = clamp(brush, -1.0, 1.0);
  lit = mix(lit, stroked, max(stroke, 0.0) * 0.6) * (1.0 - min(stroke, 0.0) * 0.015);
  float t1 = smoothstep(0.30 - soft, 0.30 + soft, light);
  float t2 = smoothstep(0.62 - soft, 0.62 + soft, light);
  return mix(mix(shade, half_, t1), lit, t2);
}
// The snow on a built thing's top, painted as snowPaint, but for its shade on a big flat face (a roof's back at noon),
// which as one even blue reads as a tarp (#58's follow-up, #14): the candidates, for the developer to pick between.
// Quieter (1): the shade lighter and softer, towards the half-tone. Brushed (2): broken by the brush, lighter strokes and
// a soft mottle through it, so it reads as paint. 'uneven' is the snow's unevenness there (about -1..1), 'p' the point.
vec3 snowPaintTop(float light, float soft, float uneven, vec3 p) {
  vec3 c = snowPaint(light, soft, uneven * 0.3);
  if (uSnowTarp < 0.5) return c;
  float inShade = 1.0 - smoothstep(0.30, 0.62, light);
  vec3 half_ = mix(uSnowGap[1], uSnowCloud[1], gCloud);
  if (uSnowTarp < 1.5) return mix(c, half_, inShade * 0.45);
  float strokes = snoise(vec2(dot(p.xz, vec2(0.8, 0.6)) * 0.9, dot(p.xz, vec2(-0.6, 0.8)) * 4.5));
  float mottle = clamp(0.5 + 0.35 * uneven + 0.45 * strokes, 0.0, 1.0);
  return mix(c, half_, inShade * mottle * 0.6);
}
`;


/**
 * The snow's paint (the developer's pick, #14, of three looks): white in the sun, a clear blue shade that follows the
 * hour's shade (violet at dusk, lavender at night), its half-tone the shade's hue, soft bands as the material's. Each band's
 * lightness and chroma in OKLab.
 */
const LIT = { l: 0.95, c: 0.008 }, HALF = { l: 0.87, c: 0.035 }, SHADE = { l: 0.74, c: 0.075 };
/** The hour's shade hue (degrees), kept between blue and violet, so a noon's teal shade doesn't turn the snow green-grey. */
const shadeHueOf = (h: number) => Math.min(295, Math.max(250, ((h % 360) + 360) % 360));

/** The light the snow is painted in, at one end (the gaps', or under a cloud), as the materials have it. */
export interface SnowLight {
  /** The shade's hue and the lit band's (degrees, OKLab). */
  shadeHue: number; litHue: number;
  /** The share of the light from the whole sky (0 the sun's .. 1 overcast: uOvercast.x). */
  sky: number;
  sunColor: THREE.Color; skyColor: THREE.Color;
}

const cube = (x: number) => x * x * x;
/** OKLab to linear sRGB, unclipped. */
function oklabRaw(L: number, a: number, b: number): [number, number, number] {
  const l = cube(L + 0.3963377774 * a + 0.2158037573 * b);
  const m = cube(L - 0.1055613458 * a - 0.0638541728 * b);
  const s = cube(L - 0.0894841775 * a - 1.2914855480 * b);
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
/** OKLCh to linear sRGB, giving up chroma to stay in gamut (as glsl.ts's oklabToLinFit). Hue in degrees. */
function lch(out: THREE.Color, L: number, C: number, hue: number) {
  const h = THREE.MathUtils.degToRad(hue), a = Math.cos(h), b = Math.sin(h);
  let lo = 0, hi = 1;
  if (Math.min(...oklabRaw(L, a * C, b * C)) < 0) {
    for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (Math.min(...oklabRaw(L, a * C * m, b * C * m)) >= 0) lo = m; else hi = m; }
  } else lo = 1;
  const [r, g, bl] = oklabRaw(L, a * C * lo, b * C * lo);
  return out.setRGB(Math.max(r, 0), Math.max(g, 0), Math.max(bl, 0));
}
/** A light's colour as a tint: its hue, at a strength, its brightness left out (as glsl.ts's tintOf). */
function tint(out: THREE.Color, c: THREE.Color, amount: number) {
  const m = Math.max(c.r, c.g, c.b, 1e-3), k = 1 - amount;
  return out.setRGB(k + (amount * c.r) / m, k + (amount * c.g) / m, k + (amount * c.b) / m);
}
const sun = new THREE.Color(), fill = new THREE.Color(), mid = new THREE.Color();

/**
 * The snow's paint as the shaders take it: its colours in the hour's light worked out here, once a frame, rather than in
 * every pixel (it was the most of lying snow's cost). The renderer shares its uniforms with every material and updates it
 * when it sets the light.
 */
export class SnowPaint {
  readonly uniforms = {
    uSnowGap: { value: [0, 1, 2, 3].map(() => new THREE.Color()) },
    uSnowCloud: { value: [0, 1, 2, 3].map(() => new THREE.Color()) },
    /** How a roof's snow in shade is painted (snowPaintTop): the candidates for #14, 0 as it was, 1 quieter, 2 brushed. */
    uSnowTarp: { value: 0 },
  };

  /** Sets the snow's colours for the light in the gaps and under a cloud. */
  update(gap: SnowLight, cloud: SnowLight) {
    this.paint(this.uniforms.uSnowGap.value, gap);
    this.paint(this.uniforms.uSnowCloud.value, cloud);
  }

  private paint(out: THREE.Color[], light: SnowLight) {
    const shadeHue = shadeHueOf(light.shadeHue), halfHue = shadeHue, sky = light.sky;
    tint(sun, light.sunColor, 0.4); tint(fill, light.skyColor, 0.45);
    // Under cloud there's no sun to warm the lit band: it takes a pale cool tint from the shade's side, and keeps a little
    // of the brightness the grey day takes away, so the snow stays the brightest thing on the land, never a grey.
    const lift = 1 + 0.18 * sky;
    lch(out[0], SHADE.l, SHADE.c, shadeHue).multiply(fill);
    lch(out[1], HALF.l, HALF.c, halfHue).multiply(mid.copy(fill).lerp(sun, 0.15));
    // The lit band: the hour's light leaning it, turned to the cool tint as the sky closes (mixed in OKLab's a, b).
    const h1 = THREE.MathUtils.degToRad(light.litHue), h2 = THREE.MathUtils.degToRad(halfHue);
    const a = LIT.c * Math.cos(h1) * (1 - sky) + 0.03 * Math.cos(h2) * sky, b = LIT.c * Math.sin(h1) * (1 - sky) + 0.03 * Math.sin(h2) * sky;
    lch(out[2], LIT.l, Math.hypot(a, b), THREE.MathUtils.radToDeg(Math.atan2(b, a))).multiply(sun);
    // A stroke in it: a little darker and cooler.
    lch(out[3], LIT.l - 0.04, 0.035, halfHue).multiply(sun);
    for (const c of out) c.multiplyScalar(lift);
  }
}
