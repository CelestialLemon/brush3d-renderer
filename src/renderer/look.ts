import * as THREE from 'three';

// Time of day. A look is everything that changes with the hour: where the sun is, the colour of its light and of the sky
// filling the shadows, which way the shade and lit bands lean in hue, the rim light on foliage and the haze in the distance.
// Hues are OKLab angles in degrees: ~30 red, ~90 yellow, ~140 green, ~200 cyan-teal, ~265 blue, ~300 violet.

export interface Look {
  hour: number;
  /** Sun direction in degrees: azimuth round from +x towards +z, elevation above the horizon. */
  sunAz: number; sunEl: number;
  sunColor: THREE.Color; skyColor: THREE.Color; rimColor: THREE.Color; hazeColor: THREE.Color;
  skyTop: THREE.Color; skyBottom: THREE.Color;
  shadeHue: number; shadeLean: number; shadeDepth: number; litHue: number; litLean: number;
  /** Haze: how quickly it thickens with distance (per metre) and its strongest share. */
  hazeDensity: number; hazeMax: number;
  exposure: number; saturation: number;
}

interface Key extends Omit<Look, 'sunColor' | 'skyColor' | 'rimColor' | 'hazeColor' | 'skyTop' | 'skyBottom'> {
  sunColor: number; skyColor: number; rimColor: number; hazeColor: number; skyTop: number; skyBottom: number;
}

// Colours are sRGB hex here; they're blended in linear.
const KEYS: Key[] = [
  { hour: 5, sunAz: 80, sunEl: -6, sunColor: 0x5d6aa8, skyColor: 0x7c86c8, rimColor: 0x8c7ec8, hazeColor: 0x6d74b0,
    skyTop: 0x2c3570, skyBottom: 0x8a7fb8, shadeHue: 285, shadeLean: 0.55, shadeDepth: 0.42, litHue: 280, litLean: 0.2,
    hazeDensity: 0.03, hazeMax: 0.55, exposure: 0.75, saturation: 0.9 },
  { hour: 7, sunAz: 95, sunEl: 10, sunColor: 0xffc58f, skyColor: 0xa9b8e6, rimColor: 0xffb070, hazeColor: 0xc8c3dc,
    skyTop: 0x6f95d6, skyBottom: 0xf3c9a6, shadeHue: 270, shadeLean: 0.45, shadeDepth: 0.36, litHue: 70, litLean: 0.18,
    hazeDensity: 0.03, hazeMax: 0.5, exposure: 1.0, saturation: 1.05 },
  { hour: 12, sunAz: 115, sunEl: 58, sunColor: 0xfff4dc, skyColor: 0xb4d4f2, rimColor: 0xffe08a, hazeColor: 0xbfdcef,
    skyTop: 0x4f95e0, skyBottom: 0xcfe6f4, shadeHue: 215, shadeLean: 0.4, shadeDepth: 0.3, litHue: 95, litLean: 0.05,
    hazeDensity: 0.022, hazeMax: 0.45, exposure: 1.0, saturation: 1.0 },
  { hour: 17.5, sunAz: 215, sunEl: 16, sunColor: 0xffc77a, skyColor: 0x9fb2e4, rimColor: 0xffa648, hazeColor: 0xe9cdb0,
    skyTop: 0x6c8fd6, skyBottom: 0xf6caa0, shadeHue: 270, shadeLean: 0.45, shadeDepth: 0.34, litHue: 60, litLean: 0.12,
    hazeDensity: 0.026, hazeMax: 0.5, exposure: 1.0, saturation: 1.0 },
  { hour: 19.5, sunAz: 240, sunEl: 2, sunColor: 0xff8f6a, skyColor: 0x8f86c8, rimColor: 0xff7a5a, hazeColor: 0xd79fa8,
    skyTop: 0x4b5aa8, skyBottom: 0xf5a088, shadeHue: 295, shadeLean: 0.55, shadeDepth: 0.4, litHue: 45, litLean: 0.35,
    hazeDensity: 0.03, hazeMax: 0.55, exposure: 0.9, saturation: 1.1 },
  { hour: 22, sunAz: 260, sunEl: 35, sunColor: 0x6f84c8, skyColor: 0x4d5a9a, rimColor: 0x7d9ae0, hazeColor: 0x3a4478,
    skyTop: 0x141a3c, skyBottom: 0x2f3a72, shadeHue: 275, shadeLean: 0.6, shadeDepth: 0.45, litHue: 255, litLean: 0.35,
    hazeDensity: 0.03, hazeMax: 0.5, exposure: 0.62, saturation: 0.85 },
];

/** Named hours for the demo's buttons. */
export const PRESETS = { Dawn: 7, Noon: 12, 'Golden hour': 17.5, Sunset: 19.5, Night: 22 } as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => { const d = ((b - a + 540) % 360) - 180; return a + d * t; };
const col = (a: number, b: number, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), t);

export function lookAt(hour: number): Look {
  const h = ((hour % 24) + 24) % 24;
  const span = [{ ...KEYS[KEYS.length - 1], hour: KEYS[KEYS.length - 1].hour - 24 }, ...KEYS, { ...KEYS[0], hour: KEYS[0].hour + 24 }];
  let i = 0;
  while (i < span.length - 2 && h >= span[i + 1].hour) i++;
  const a = span[i], b = span[i + 1];
  const t0 = (h - a.hour) / (b.hour - a.hour), t = t0 * t0 * (3 - 2 * t0);
  return {
    hour: h, sunAz: lerpAngle(a.sunAz, b.sunAz, t), sunEl: lerp(a.sunEl, b.sunEl, t),
    sunColor: col(a.sunColor, b.sunColor, t), skyColor: col(a.skyColor, b.skyColor, t), rimColor: col(a.rimColor, b.rimColor, t),
    hazeColor: col(a.hazeColor, b.hazeColor, t), skyTop: col(a.skyTop, b.skyTop, t), skyBottom: col(a.skyBottom, b.skyBottom, t),
    shadeHue: lerpAngle(a.shadeHue, b.shadeHue, t), shadeLean: lerp(a.shadeLean, b.shadeLean, t),
    shadeDepth: lerp(a.shadeDepth, b.shadeDepth, t), litHue: lerpAngle(a.litHue, b.litHue, t), litLean: lerp(a.litLean, b.litLean, t),
    hazeDensity: lerp(a.hazeDensity, b.hazeDensity, t), hazeMax: lerp(a.hazeMax, b.hazeMax, t),
    exposure: lerp(a.exposure, b.exposure, t), saturation: lerp(a.saturation, b.saturation, t),
  };
}
