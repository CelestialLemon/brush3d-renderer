import * as THREE from 'three';
import type { Look } from './look';

// The storm look (#12): how far a storm darkens and changes the picture, laid over the overcast look (overcast.ts). How
// stormy the sky is is the game's (Weather.storm, the developer's call, 2026-11-10): a storm darkens before its rain
// arrives and lifts before it stops, and a long steady rain isn't a storm, so it's apart from the cover and the rain.
// It's a look only, eased like the others; the cloud field and what the game reads from it don't change.
//
// What it does: the light dims and turns towards a cold slate, the shade goes deeper and leans further to its hue, the
// colour is held up as the light falls (shade is never grey, #3), the distance sinks into a darker air, the sky the water
// and the solar glass mirror darkens (the deck), and the corners close in. The gold breaking under a storm is the game's
// sunUnder (golden.ts), which under a storm works at any hour of the day, not only at dawn and dusk (the developer,
// 2026-11-10): see stormGold.

export interface StormRecipe {
  /** The exposure kept at full storm, by day and by night. */
  exposure: number; nightExposure: number;
  /** The hue the light from the sky (and the sun's, what's left of it) turns to (sRGB hex; only its hue counts), and how far. */
  light: number; lightTurn: number;
  /**
   * The shade's hue (OKLab degrees), how far it turns there, how much further it leans to it (added), and its depth
   * scaled (more than 1: deeper).
   */
  shadeHue: number; shadeTurn: number; lean: number; depth: number;
  /** The lit band's hue (OKLab degrees) and how far it leans there: the storm light's cast on what's lit. */
  litHue: number; litLean: number;
  /** The grade's saturation scaled: the colour held up as the light falls. */
  saturation: number;
  /**
   * The distance's air: its hue (sRGB hex), how far the hour's air turns to it, its lightness of the hour's air's (below
   * 1, the far land sinks into the dark), its density scaled and the share added over everything.
   */
  air: number; airTurn: number; airLight: number; airDensity: number; airFloor: number;
  /** The sky the water and the solar glass mirror, its brightness kept (the storm's deck). */
  deck: number;
  /** How dark the corners go (0.35 on any other day). */
  vignette: number;
  /** The rim light on crowns' edges kept. */
  rim: number;
}

/** The vignette of any other day (post.ts). */
export const VIGNETTE = 0.35;

/**
 * The storm look, the developer's pick (#12, PR #57, 2026-11-11) of three, "slate": a heavy blue-slate light, the greens
 * cooled towards teal, deep shade, the distance going dark, the water a dark mirror; the colour held up, so it's still
 * the painting, and things stay readable at night. (Not picked: "moody", the grey day only a step darker and cooler,
 * which read as a gloomy rain rather than a storm; "dramatic", darker still with a dark indigo air and heavy corners,
 * which turned the night into one dark wash.)
 */
export const STORM: StormRecipe = {
  exposure: 0.64, nightExposure: 0.76, light: 0x7c96c4, lightTurn: 0.6, shadeHue: 250, shadeTurn: 0.6, lean: 0.18, depth: 1.3,
  litHue: 215, litLean: 0.22, saturation: 1.16, air: 0x4f6390, airTurn: 0.7, airLight: 0.65, airDensity: 1.7, airFloor: 0.03, deck: 0.45,
  vignette: 0.62, rim: 0.3,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => a + ((((b - a + 540) % 360) - 180) * t);
const luminance = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
const peak = (c: THREE.Color) => Math.max(c.r, c.g, c.b, 1e-3);
/** A colour's hue at full strength: divided by its largest channel. */
const hueOf = (c: THREE.Color) => c.clone().multiplyScalar(1 / peak(c));
/** A colour turned towards a hue, keeping its own brightness (its largest channel). */
const turned = (c: THREE.Color, hue: THREE.Color, t: number) => c.clone().lerp(hueOf(hue).multiplyScalar(peak(c)), t);

/** A look under a storm (0 none .. 1 a full storm), by a recipe (the picked look by default). */
export function stormLook(look: Look, storm: number, r: StormRecipe = STORM): Look {
  if (storm <= 0) return look;
  const t = storm, n = look.night, light = new THREE.Color(r.light), air = new THREE.Color(r.air);
  const haze = hueOf(air).multiplyScalar((luminance(look.hazeColor) * r.airLight) / Math.max(luminance(hueOf(air)), 1e-4));
  const deck = (c: THREE.Color) => turned(c, light, r.lightTurn * t).multiplyScalar(lerp(1, r.deck, t));
  return {
    ...look,
    sunColor: turned(look.sunColor, light, r.lightTurn * t),
    skyColor: turned(look.skyColor, light, r.lightTurn * t),
    rimColor: look.rimColor.clone().multiplyScalar(lerp(1, r.rim, t)),
    hazeColor: look.hazeColor.clone().lerp(haze, r.airTurn * t),
    skyTop: deck(look.skyTop), skyBottom: deck(look.skyBottom),
    shadeHue: lerpAngle(look.shadeHue, r.shadeHue, r.shadeTurn * t),
    shadeLean: look.shadeLean + r.lean * t,
    shadeDepth: look.shadeDepth * lerp(1, r.depth, t),
    litHue: r.litLean > 0 ? lerpAngle(look.litHue, r.litHue, t) : look.litHue,
    litLean: look.litLean + r.litLean * t,
    hazeDensity: look.hazeDensity * lerp(1, r.airDensity, t),
    hazeFloor: look.hazeFloor + r.airFloor * t,
    exposure: look.exposure * lerp(1, lerp(r.exposure, r.nightExposure, n), t),
    saturation: look.saturation * lerp(1, r.saturation, t),
  };
}

/**
 * How far a storm opens the day to the sun breaking under it: fully from a light storm up, since the sun breaks under the
 * edge of a storm, as it comes and goes, when the sky is only part stormy.
 */
export const stormEdge = (storm: number) => THREE.MathUtils.smoothstep(storm, 0, 0.3);

/** The gold the sun takes breaking under a storm (sRGB hex): a low sun's, whatever the hour. */
const GOLD = new THREE.Color(0xffb460);
/** How high the sun breaking under a storm comes in, degrees at most: low and raking, its shadows long. */
const UNDER_DECK = 18;
/** The exposure the sun breaking under a storm keeps of the clear hour's: the deck still overhead. */
const UNDER_DECK_LIGHT = 0.7;

/**
 * The clear hour's light as the sun breaking under a storm sees it (golden.ts turns the light under the deck back towards
 * it): a low sun's gold, coming in low and raking, a little dimmer than a clear day's, with the storm's deep shade and
 * dark air kept, so it reads as light under a dark sky rather than a sunny day. By day, where the hour's own sun is high
 * and white, the gold and the low angle are the storm's; at dawn and dusk the hour's own are kept. A look only: the sun's
 * angle here moves the light and its shadows, not the game's sun.
 */
export function stormGold(clear: Look, storm: number, r: StormRecipe = STORM): Look {
  if (storm <= 0) return clear;
  const k = stormEdge(storm) * THREE.MathUtils.smoothstep(clear.dayEl, 14, 30), dark = stormLook(clear, storm, r);
  return {
    ...clear,
    sunEl: lerp(clear.sunEl, Math.min(clear.sunEl, UNDER_DECK), k),
    sunColor: turned(clear.sunColor, GOLD, 0.85 * k),
    rimColor: turned(clear.rimColor, GOLD, k),
    litHue: lerpAngle(clear.litHue, 62, k),
    litLean: lerp(clear.litLean, Math.max(clear.litLean, 0.22), k),
    shadeHue: dark.shadeHue, shadeLean: dark.shadeLean, shadeDepth: dark.shadeDepth,
    hazeColor: dark.hazeColor, hazeDensity: dark.hazeDensity, hazeFloor: dark.hazeFloor,
    exposure: clear.exposure * lerp(1, UNDER_DECK_LIGHT, storm),
    saturation: dark.saturation,
  };
}
