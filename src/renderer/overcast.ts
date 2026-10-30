import * as THREE from 'three';
import type { Look } from './look';

// The overcast look (#7): what cloud cover does to the hour's light. The renderer paints in three tones (shade, half-tone,
// lit) and keeps flat ground in the lit tone, so taking the sun away would drop everything into shade and turn the world
// one teal. A grey day needs its own recipe instead: light from the whole sky (tops lighter, sides and undersides darker),
// no sharp cast shadows but a soft darkening under things, the tones closer together with the colour kept (never grey,
// docs/DIRECTION.md), a cooler grade, a softer rim. The cover, eased (WeatherState.overcast), blends the hour's look
// towards it. A recipe is the numbers for that blend at full cover; the candidates are built for the developer to choose.
//
// Calibrated with Sol (#7), measuring each frame's lightness, colour and contrast against the clear one: the haze laid
// over the whole picture is what turned a grey day milky, so the haze here stays modest; the hour's warmth goes by
// turning the light's colour (not only the lit band's lean); the evening keeps its air's colour and falls dim early; and
// the night has its own response, so a cloudy night comes out no brighter than a clear one where measured. The light's
// shape (sky light, shadows) changes late, as the square of the cover: under scattered cloud the sun still shines through
// the gaps with crisp shadows (and #8's cloud shadows show the patches), and only a closing sky lights the land from all
// round; changing it with the cover itself lifted a half-covered sky above both clear and overcast.

export interface OvercastRecipe {
  /** The share of the light that comes from the whole sky rather than the sun (tops lit, sides half, undersides shade). */
  sky: number;
  /**
   * The share of the sun's cast shadows taken away. Above about 0.62 a shadow on flat ground would stay in the lit tone,
   * and vanish.
   */
  shadowFade: number;
  /** How far the shadows that are left turn to fall from overhead (0 the sun's, 1 straight down: a darkening under things). */
  shadowLift: number;
  /** How much wider the shadows' soft edge gets (1: twice as wide). */
  shadowBlur: number;
  /** The shade's depth kept (the tones pulled together), and the lit band's lean to the hour's warmth kept. */
  contrast: number; litLean: number;
  /** How much of the sky's colour the light keeps (1 all, 0 grey). */
  skyChroma: number;
  /** The shade's hue, OKLab degrees, and how far it turns there (0 the hour's). */
  shadeHue: number; shadeTurn: number;
  /** The rim light kept. */
  rim: number;
  /** The haze's density and floor scaled (the floor lies over the whole picture: a little goes a long way). */
  hazeDensity: number; hazeFloor: number;
  /** The grade: exposure and saturation scaled. */
  exposure: number; saturation: number;
}

/** The candidates, for the developer to choose (#7). */
export const OVERCAST: Record<string, OvercastRecipe> = {
  // Pearl: a cool, coloured, calm grey day, the forms softer than in sun.
  pearl: {
    sky: 1, shadowFade: 0.48, shadowLift: 1, shadowBlur: 4, contrast: 0.62, litLean: 0.1, skyChroma: 0.55,
    shadeHue: 245, shadeTurn: 0.6, rim: 0.08, hazeDensity: 0.65, hazeFloor: 0.6, exposure: 0.85, saturation: 1.04,
  },
  // Slate: thicker cloud. Darker, richer colour, more weight under the trees, violet in the shade.
  slate: {
    sky: 1, shadowFade: 0.4, shadowLift: 1, shadowBlur: 4, contrast: 0.78, litLean: 0.04, skyChroma: 0.8,
    shadeHue: 270, shadeTurn: 0.8, rim: 0.04, hazeDensity: 0.5, hazeFloor: 0.5, exposure: 0.7, saturation: 1.14,
  },
  // Silver: a bright, soft grey day, the tones closest together.
  silver: {
    sky: 0.88, shadowFade: 0.55, shadowLift: 1, shadowBlur: 4, contrast: 0.48, litLean: 0.14, skyChroma: 0.4,
    shadeHue: 225, shadeTurn: 0.55, rim: 0.12, hazeDensity: 0.85, hazeFloor: 0.7, exposure: 0.95, saturation: 1,
  },
};

/** At night the cloud takes the moonlight's direction and some of its brightness, whatever the recipe (Sol's, #7). */
const NIGHT = { contrast: 0.88, saturation: 1.03, hazeDensity: 0.7, hazeFloor: 0.6, exposure: 0.43 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => a + ((((b - a + 540) % 360) - 180) * t);
const luminance = (c: THREE.Color) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
/** A colour's hue at full strength: divided by its largest channel. */
const hueOf = (c: THREE.Color) => c.clone().multiplyScalar(1 / Math.max(c.r, c.g, c.b, 1e-3));
/** A colour with some of its chroma taken out (towards the grey of the same luminance). */
function muted(c: THREE.Color, keep: number) {
  const y = luminance(c);
  return new THREE.Color(lerp(y, c.r, keep), lerp(y, c.g, keep), lerp(y, c.b, keep));
}

/** How far the light's shape (sky light, shadows) has turned under a cover: late, as the sky closes. */
export const skyShare = (cover: number) => cover * cover;

/** The hour's look under a cover (0 clear .. 1 overcast), by a recipe. */
export function overcastLook(look: Look, cover: number, r: OvercastRecipe): Look {
  if (cover <= 0) return look;
  const t = cover, n = look.night;
  // The light from the whole sky: the sky's colour, part muted. Blended as hues, so a bright orange sun can't outweigh a
  // dimmer blue sky; a trace of the hour's own light stays.
  const sky = muted(hueOf(look.skyColor), r.skyChroma);
  // The haze turns to that light at the haze's own brightness, keeping some of the hour's air (more in the evening).
  const haze = sky.clone().multiplyScalar(luminance(look.hazeColor) / Math.max(luminance(sky), 1e-3));
  // The light dims early as the cloud gathers, before the sky light lifts the shade (skyShare).
  const exposure = Math.pow(lerp(r.exposure * look.cloudDim, NIGHT.exposure, n), t * (1.5 - 0.5 * t));
  return {
    ...look,
    sunColor: hueOf(look.sunColor).lerp(sky, t * 0.98),
    rimColor: look.rimColor.clone().multiplyScalar(lerp(1, r.rim, t)),
    hazeColor: look.hazeColor.clone().lerp(haze, t * look.cloudHaze),
    skyTop: look.skyTop.clone().lerp(muted(look.skyTop, 0.4), t), skyBottom: look.skyBottom.clone().lerp(muted(look.skyBottom, 0.4), t),
    shadeHue: lerpAngle(look.shadeHue, r.shadeHue, t * r.shadeTurn),
    shadeDepth: look.shadeDepth * lerp(1, lerp(r.contrast, NIGHT.contrast, n), t),
    litLean: look.litLean * lerp(1, r.litLean, t),
    hazeDensity: look.hazeDensity * lerp(1, lerp(r.hazeDensity, NIGHT.hazeDensity, n), t),
    hazeFloor: look.hazeFloor * lerp(1, lerp(r.hazeFloor, NIGHT.hazeFloor, n), t),
    exposure: look.exposure * exposure,
    saturation: look.saturation * lerp(1, lerp(r.saturation, NIGHT.saturation, n), t),
  };
}
