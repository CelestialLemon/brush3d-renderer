import * as THREE from 'three';
import { clockHour, referenceHour, REFERENCE_DAY, type Day } from './season';

// Time of day. A look is everything that changes with the hour: where the sun is, the colour of its light and of the sky
// filling the shadows, which way the shade and lit bands lean in hue, the rim light on foliage and the haze in the distance.
// Hues are OKLab angles in degrees: ~30 red, ~90 yellow, ~140 green, ~200 cyan-teal, ~265 blue, ~300 violet.

export interface Look {
  hour: number;
  /** Sun direction in degrees: azimuth round from +x towards +z, elevation above the horizon. */
  sunAz: number; sunEl: number;
  /** The sun's elevation on the reference day at this point of the day (season.ts), which the hour's colours are keyed to:
   * how near dawn or dusk it is, whatever the season's sun does (a winter noon's sun is as low as a summer evening's). */
  dayEl: number;
  sunColor: THREE.Color; skyColor: THREE.Color; rimColor: THREE.Color; hazeColor: THREE.Color;
  skyTop: THREE.Color; skyBottom: THREE.Color;
  shadeHue: number; shadeLean: number; shadeDepth: number; litHue: number; litLean: number;
  /** Haze: how quickly it thickens with distance (per metre), its strongest share, and the share it has even up close (the
   * hour's air: peach in the evening, lavender at dusk). */
  hazeDensity: number; hazeMax: number; hazeFloor: number;
  exposure: number; saturation: number;
  /** Under full cloud (overcast.ts): the exposure the hour loses besides the recipe's (an overcast evening falls dim
   * early), how far the haze turns to the cloud's light (less in the evening, so the air keeps the hour's colour), and how
   * much it takes the night's response, 0 by day to 1 at night. */
  cloudDim: number; cloudHaze: number; night: number;
  /** A shift of the whole picture towards cool blue at night, 0..1 (the blue night, #7). */
  nightShift: number;
}

interface Key extends Omit<Look, 'dayEl' | 'sunColor' | 'skyColor' | 'rimColor' | 'hazeColor' | 'skyTop' | 'skyBottom'> {
  sunColor: number; skyColor: number; rimColor: number; hazeColor: number; skyTop: number; skyBottom: number;
}

// Colours are sRGB hex here; they're blended in linear.
const KEYS: Key[] = [
  { hour: 5, sunAz: 80, sunEl: -6, sunColor: 0x5d6aa8, skyColor: 0x7c86c8, rimColor: 0x8c7ec8, hazeColor: 0x6d74b0,
    skyTop: 0x2c3570, skyBottom: 0x8a7fb8, shadeHue: 285, shadeLean: 0.55, shadeDepth: 0.42, litHue: 280, litLean: 0.2,
    hazeDensity: 0.03, hazeFloor: 0.14, hazeMax: 0.55, exposure: 0.75, saturation: 0.9, cloudDim: 0.6, cloudHaze: 0.85, night: 0.7, nightShift: 0.7 },
  { hour: 7, sunAz: 95, sunEl: 10, sunColor: 0xffc58f, skyColor: 0xa9b8e6, rimColor: 0xffb070, hazeColor: 0xc8c3dc,
    skyTop: 0x6f95d6, skyBottom: 0xf3c9a6, shadeHue: 270, shadeLean: 0.45, shadeDepth: 0.36, litHue: 70, litLean: 0.18,
    hazeDensity: 0.03, hazeFloor: 0.1, hazeMax: 0.5, exposure: 1.0, saturation: 1.05, cloudDim: 0.8, cloudHaze: 0.85, night: 0, nightShift: 0 },
  { hour: 12, sunAz: 115, sunEl: 58, sunColor: 0xfff4dc, skyColor: 0xb4d4f2, rimColor: 0xffe08a, hazeColor: 0xbfdcef,
    skyTop: 0x4f95e0, skyBottom: 0xcfe6f4, shadeHue: 215, shadeLean: 0.4, shadeDepth: 0.3, litHue: 95, litLean: 0.05,
    hazeDensity: 0.022, hazeFloor: 0.03, hazeMax: 0.45, exposure: 1.0, saturation: 1.0, cloudDim: 1, cloudHaze: 0.85, night: 0, nightShift: 0 },
  { hour: 17.5, sunAz: 215, sunEl: 16, sunColor: 0xffb468, skyColor: 0xa8a8e0, rimColor: 0xffa648, hazeColor: 0xf2c2a2,
    skyTop: 0x6c8fd6, skyBottom: 0xf6caa0, shadeHue: 275, shadeLean: 0.6, shadeDepth: 0.34, litHue: 60, litLean: 0.2,
    hazeDensity: 0.026, hazeFloor: 0.08, hazeMax: 0.5, exposure: 1.0, saturation: 1.0, cloudDim: 0.75, cloudHaze: 0.4, night: 0, nightShift: 0 },
  { hour: 19.5, sunAz: 240, sunEl: 2, sunColor: 0xff8f6a, skyColor: 0x8f86c8, rimColor: 0xff7a5a, hazeColor: 0xd79fa8,
    skyTop: 0x4b5aa8, skyBottom: 0xf5a088, shadeHue: 295, shadeLean: 0.55, shadeDepth: 0.4, litHue: 45, litLean: 0.35,
    hazeDensity: 0.03, hazeFloor: 0.1, hazeMax: 0.55, exposure: 0.9, saturation: 1.1, cloudDim: 0.5, cloudHaze: 0.4, night: 0, nightShift: 0 },
  // The night: moonlight, blue (#7, the developer's pick: "much more like moonlight than just no light"). Cooler light and
  // haze and the whole picture nudged from yellow-green to blue (nightShift); the night before leaned green.
  { hour: 22, sunAz: 260, sunEl: 35, sunColor: 0x929edb, skyColor: 0x6069a8, rimColor: 0x7d9ae0, hazeColor: 0x424878,
    skyTop: 0x141a3c, skyBottom: 0x2f3a72, shadeHue: 275, shadeLean: 0.65, shadeDepth: 0.5, litHue: 255, litLean: 0.5,
    hazeDensity: 0.03, hazeFloor: 0.14, hazeMax: 0.5, exposure: 0.55, saturation: 0.82, cloudDim: 0.5, cloudHaze: 0.85, night: 1, nightShift: 1 },
];

/** The noon key: the sun at its height on the reference day. */
const NOON_KEY = KEYS.find((k) => k.hour === REFERENCE_DAY.noon)!;

/** Named hours on the reference day (season.ts), for the demo's buttons. */
export const PRESETS = { Dawn: 7, Noon: 12, 'Golden hour': 17.5, Sunset: 19.5, Night: 22 } as const;
export type HourName = keyof typeof PRESETS;

/** The named hours on a day's clock: the dawn look just after its sunrise, noon in its middle, and so on. */
export function hoursOf(day: Day): Record<HourName, number> {
  return Object.fromEntries(Object.entries(PRESETS).map(([k, h]) => [k, clockHour(h, day)])) as Record<HourName, number>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => { const d = ((b - a + 540) % 360) - 180; return a + d * t; };
const col = (a: number, b: number, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t);

/**
 * The look at a clock hour of a day (by default the reference day, the looks' own). The day's hour is first mapped onto the
 * reference day (season.ts), so the looks follow its sunrise and sunset; then, by day, the sun is lowered to the day's
 * height at noon and its bearing's swing about noon's narrowed to the day's path. The night's moon is the same in every
 * season.
 */
export function lookAt(hour: number, day: Day = REFERENCE_DAY): Look {
  const clock = ((hour % 24) + 24) % 24;
  const look = keyedLook(day === REFERENCE_DAY ? clock : referenceHour(clock, day));
  look.hour = clock;
  if (day.height !== REFERENCE_DAY.height || day.arc !== REFERENCE_DAY.arc) {
    const byDay = 1 - look.night;
    // Lowered most at noon and hardly near the horizon, rising all morning to the day's noon height: x / √(1 + b x²),
    // which is x low down and the day's height at noon's. The dawn's and golden hour's looks are tuned at their own
    // heights (10° and 16°), and lower than about 12° the flat land turns its back on the sun and falls into shade, all of
    // it at once. So a winter's golden hour still lights the land, a little lower (14° under a 25° noon), and its noon is
    // the season's.
    if (look.sunEl > 0) {
      const b = ((NOON_KEY.sunEl / day.height) ** 2 - 1) / NOON_KEY.sunEl ** 2;
      look.sunEl = lerp(look.sunEl, look.sunEl / Math.sqrt(1 + b * look.sunEl * look.sunEl), byDay);
    }
    look.sunAz = NOON_KEY.sunAz + (((look.sunAz - NOON_KEY.sunAz + 540) % 360) - 180) * lerp(1, day.arc, byDay);
  }
  return look;
}

/** The look at an hour of the reference day, from its keys. */
function keyedLook(hour: number): Look {
  const h = ((hour % 24) + 24) % 24;
  const span = [{ ...KEYS[KEYS.length - 1], hour: KEYS[KEYS.length - 1].hour - 24 }, ...KEYS, { ...KEYS[0], hour: KEYS[0].hour + 24 }];
  let i = 0;
  while (i < span.length - 2 && h >= span[i + 1].hour) i++;
  const a = span[i], b = span[i + 1];
  const t0 = (h - a.hour) / (b.hour - a.hour), t = t0 * t0 * (3 - 2 * t0);
  return {
    hour: h, sunAz: lerpAngle(a.sunAz, b.sunAz, t), sunEl: lerp(a.sunEl, b.sunEl, t), dayEl: lerp(a.sunEl, b.sunEl, t),
    sunColor: col(a.sunColor, b.sunColor, t), skyColor: col(a.skyColor, b.skyColor, t), rimColor: col(a.rimColor, b.rimColor, t),
    hazeColor: col(a.hazeColor, b.hazeColor, t), skyTop: col(a.skyTop, b.skyTop, t), skyBottom: col(a.skyBottom, b.skyBottom, t),
    shadeHue: lerpAngle(a.shadeHue, b.shadeHue, t), shadeLean: lerp(a.shadeLean, b.shadeLean, t),
    shadeDepth: lerp(a.shadeDepth, b.shadeDepth, t), litHue: lerpAngle(a.litHue, b.litHue, t), litLean: lerp(a.litLean, b.litLean, t),
    hazeDensity: lerp(a.hazeDensity, b.hazeDensity, t), hazeMax: lerp(a.hazeMax, b.hazeMax, t),
    hazeFloor: lerp(a.hazeFloor, b.hazeFloor, t),
    exposure: lerp(a.exposure, b.exposure, t), saturation: lerp(a.saturation, b.saturation, t),
    cloudDim: lerp(a.cloudDim, b.cloudDim, t), cloudHaze: lerp(a.cloudHaze, b.cloudHaze, t), night: lerp(a.night, b.night, t), nightShift: lerp(a.nightShift, b.nightShift, t),
  };
}
