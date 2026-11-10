import * as THREE from 'three';
import type { Look } from './look';
import type { OvercastRecipe } from './overcast';
import { stormEdge } from './storm';

// Golden hour under a cloud deck (#8): at dawn and dusk the low sun can shine in under a heavy cover, through a clear strip
// of sky at the horizon, and light the land gold beneath a grey sky. Whether the horizon is clear is the game's
// (Weather.sunUnder, the developer's call, 2026-11-03), so it's a treat rather than every overcast evening; how it looks is
// the renderer's. A look only: the cloud field, and the shade the game reads for its solar panels, are as the game sends
// them (decided 2026-11-03). It shows only under heavy cover (from about 60% to full): under part cover the gaps already
// have the evening's sun, and the cloud shadows keep their picked shade so they read as shadows.
//
// The light under a cloud (overcast.ts's look at full cover) is turned back towards the hour's clear light by a recipe
// (GOLDEN), as far as goldenShare says.

export interface GoldenRecipe {
  /** How far the sun's colour (hue and strength) goes back to the clear hour's: the low sun's gold. */
  sun: number;
  /** How far the exposure goes back to the clear hour's (0 the grey day's). */
  exposure: number;
  /** The light's shape: the share from the whole sky (1 the grey day's: no side of things lit more than another). */
  sky: number;
  /** The share of the sun's cast shadows taken away, and how far they fall from the sun again rather than overhead. */
  shadowFade: number; shadowSun: number;
  /** How much wider the shadows' soft edge is (overcast.ts's shadowBlur). */
  shadowBlur: number;
  /** The rim light on crowns' sunward edges, of the clear hour's. */
  rim: number;
  /** The lit band's lean to the hour's gold, of the clear hour's (more than 1 leans further). */
  warmth: number;
  /** The shade's depth, of the clear hour's: under a grey sky little light fills it, so it can go deeper than a clear
   * evening's. Its hue stays the deck's, a cool slate. */
  depth: number;
  /** How far the distance's haze and the grade's colour go back to the clear hour's (the far land stays slate below 1). */
  air: number;
}

/**
 * The golden light under a deck, the developer's pick (#8, 2026-11-03), "rake": the sun gets in low and at about half
 * strength, with long soft shadows; sunward sides and crowns' edges catch the gold, and the land stays dimmer than a clear
 * evening. Left out: a "glow" (the deck's own light warmed, no sun or shadows) and a "blaze" (the land as bright as a
 * clear golden hour, crisp shadows, deeper shade). It's a rare sight, not every overcast evening: the game sends sunUnder
 * only now and then (the developer, 2026-11-03).
 */
export const GOLDEN: GoldenRecipe = {
  sun: 1, exposure: 0.6, sky: 0.45, shadowFade: 0.35, shadowSun: 0.85, shadowBlur: 1.5, rim: 1.2, warmth: 1.4, depth: 0.95, air: 0.3,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => a + ((((b - a + 540) % 360) - 180) * t);
const smooth = THREE.MathUtils.smoothstep;

/**
 * How much the golden light shows: the game's sunUnder, as low as the sun is (from its rising to about 25° up, gone as it
 * sets), by day only, and as heavy as the cover (from 60% to full). After sunset the look's sun climbs again as it turns
 * into the moon (look.ts), so the light is gone as soon as the night starts: by about 20:00, and in by 6:45 at dawn (on
 * the reference day; a season's follow its sunrise and sunset). The sun's height is the reference day's (Look.dayEl), so
 * it's dawn's and dusk's in every season, not all day under a low winter sun. Under a storm, at any hour of the day,
 * from a light storm up (#12, stormEdge).
 */
export function goldenShare(sunUnder: number, look: Look, cover: number, storm = 0) {
  const day = 1 - smooth(look.night, 0, 0.15), up = smooth(look.dayEl, -2, 3), low = 1 - smooth(look.dayEl, 14, 26);
  // Under a storm the sun breaks under the deck at any hour of the day (#12, the developer, 2026-11-10; storm.ts).
  return sunUnder * day * up * (storm > 0 ? lerp(low, 1, stormEdge(storm)) : low) * smooth(cover, 0.6, 1);
}

/** The overcast recipe's shape (sky light and shadows) turned towards a golden recipe's, by g. */
export function goldenShape(r: OvercastRecipe, gr: GoldenRecipe, g: number): OvercastRecipe {
  if (g <= 0) return r;
  return {
    ...r,
    sky: lerp(r.sky, gr.sky, g), shadowFade: lerp(r.shadowFade, gr.shadowFade, g),
    shadowLift: r.shadowLift * (1 - gr.shadowSun * g), shadowBlur: lerp(r.shadowBlur, gr.shadowBlur, g),
  };
}

/** A look under cloud (`under`) turned back towards the clear hour's light (`clear`) by a recipe, by g. */
export function goldenLook(under: Look, clear: Look, gr: GoldenRecipe, g: number): Look {
  if (g <= 0) return under;
  // The sky's light (what fills the shade) stays the grey deck's, and the shade's hue.
  const a = gr.air * g;
  return {
    ...under,
    // The sun's height is the clear hour's, but for a sun breaking under a storm (storm.ts), which comes in lower.
    sunEl: lerp(under.sunEl, clear.sunEl, g),
    sunColor: under.sunColor.clone().lerp(clear.sunColor, gr.sun * g),
    rimColor: under.rimColor.clone().lerp(clear.rimColor.clone().multiplyScalar(gr.rim), g),
    shadeDepth: lerp(under.shadeDepth, clear.shadeDepth * gr.depth, g),
    litHue: lerpAngle(under.litHue, clear.litHue, g), litLean: lerp(under.litLean, clear.litLean * gr.warmth, g),
    hazeColor: under.hazeColor.clone().lerp(clear.hazeColor, a),
    exposure: lerp(under.exposure, clear.exposure, gr.exposure * g),
    saturation: lerp(under.saturation, clear.saturation, a),
  };
}
