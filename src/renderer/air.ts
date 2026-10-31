import * as THREE from 'three';
import type { Look } from './look';

// What the air does to the hour's light (#9), laid over it after the cloud (overcast.ts). Dust: the sun's light through it
// takes its colour, deepened, and dims (the orange light of a dust storm); the sky's light and the distance's air turn
// the dust's colour, and the far land is lost in it sooner. The heat wave: a hot yellow light, stronger, the colour washed
// out a little, and a warm cream haze in the air; by day only, as the sun is what makes it.

export interface HeatRecipe {
  /** The sun's light: the hue it turns to (sRGB hex), how far, and how much stronger it gets. */
  sun: number; sunTurn: number; sunGain: number;
  /** How far the sky's light turns to the sun's hue (a pale, hot sky). */
  skyTurn: number;
  /** The air's colour (sRGB hex) the distance's haze turns to, its density scaled, and the share laid over everything. */
  haze: number; hazeDensity: number; hazeFloor: number;
  /** The shade's depth kept (glare lifts it), and the grade's exposure and saturation scaled (bleached). */
  contrast: number; exposure: number; saturation: number;
  /** How far the lit band leans warm. */
  litLean: number;
  /** The shimmer at full heat, in pixels: it grows with the game's heat, from none (heatShare). */
  shimmer: number;
}

/**
 * The heat wave (#9, the developer's pick of three, glare, gold and dry): gold, a hot yellow light with the colour kept
 * fuller and a warm cream air. Glare bleached it nearly white; dry laid a pale, dusty air over the land.
 */
export const HEAT: HeatRecipe = {
  sun: 0xffd48e, sunTurn: 0.7, sunGain: 1.1, skyTurn: 0.35, haze: 0xf5d8a0, hazeDensity: 1.6, hazeFloor: 0.1,
  contrast: 0.92, exposure: 1.05, saturation: 0.95, litLean: 0.25,
  // 'clear', the developer's pick of 2, 3.5 and 5 pixels: about a pixel by a third of the heat. 0.6 and 1.2 were too faint.
  shimmer: 3.5,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const luminance = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
const peak = (c: THREE.Color) => Math.max(c.r, c.g, c.b, 1e-3);
/** A colour's hue at full strength: divided by its largest channel. */
const hueOf = (c: THREE.Color) => c.clone().multiplyScalar(1 / peak(c));
/** A colour at another's luminance. */
const atLuminance = (c: THREE.Color, of: THREE.Color) => c.clone().multiplyScalar(luminance(of) / Math.max(luminance(c), 1e-4));

/** How much of the heat shows at an hour: by day only, fading as the sun sets. */
export const heatShare = (look: Look, heat: number) => heat * (1 - look.night) * THREE.MathUtils.smoothstep(look.sunEl, -4, 12);

/** The air as it is: the heat, and the dust (how far the haze is dust, how thick, its colour, linear). */
export interface Air { heat: number; dust: number; haze: number; hazeColor: THREE.Color }

/** The hour's look (under its cloud) in the air: through dust, and in a heat wave by a recipe. */
export function airLook(look: Look, air: Air, r: HeatRecipe): Look {
  // Dust's light is all but full by a storm's thickness.
  const d = air.dust * Math.min(1, air.haze * 1.4), h = heatShare(look, air.heat);
  if (d <= 0 && h <= 0) return look;
  const out = { ...look };
  if (d > 0) {
    // The light through dust: its hue deepened (the blue scattered out first), so tan dust gives an orange sun.
    const c = air.hazeColor, deep = hueOf(new THREE.Color(c.r ** 1.6, c.g ** 1.6, c.b ** 1.6));
    out.sunColor = look.sunColor.clone().lerp(deep.multiplyScalar(peak(look.sunColor)), 0.9 * d).multiplyScalar(1 - 0.3 * d);
    out.skyColor = look.skyColor.clone().lerp(hueOf(c).multiplyScalar(peak(look.skyColor)), 0.6 * d);
    out.rimColor = look.rimColor.clone().multiplyScalar(1 - 0.5 * d);
    out.hazeColor = look.hazeColor.clone().lerp(atLuminance(c, look.hazeColor), d);
    out.hazeDensity = look.hazeDensity * (1 + 2 * d);
    out.hazeFloor = look.hazeFloor + 0.15 * d;
    out.exposure = look.exposure * (1 - 0.15 * d);
  }
  if (h > 0) {
    const sun = new THREE.Color(r.sun), haze = new THREE.Color(r.haze);
    out.sunColor = out.sunColor.clone().lerp(hueOf(sun).multiplyScalar(peak(out.sunColor)), r.sunTurn * h).multiplyScalar(lerp(1, r.sunGain, h));
    out.skyColor = out.skyColor.clone().lerp(atLuminance(hueOf(sun), out.skyColor), r.skyTurn * h);
    out.hazeColor = out.hazeColor.clone().lerp(atLuminance(haze, out.hazeColor).lerp(haze, 0.5), h);
    out.hazeDensity *= lerp(1, r.hazeDensity, h);
    out.hazeFloor = lerp(out.hazeFloor, Math.max(out.hazeFloor, r.hazeFloor), h);
    out.shadeDepth = look.shadeDepth * lerp(1, r.contrast, h);
    out.litLean = lerp(look.litLean, Math.max(look.litLean, r.litLean), h);
    out.exposure *= lerp(1, r.exposure, h);
    out.saturation = look.saturation * lerp(1, r.saturation, h);
  }
  return out;
}
