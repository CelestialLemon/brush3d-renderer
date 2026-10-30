import * as THREE from 'three';

// Weather: the game says what the sky is doing; the renderer draws it (#3, #7). The game owns the weather's state, its
// logic and its pace (a shower building is the game changing its values over time); the renderer only eases the looks
// over a second and a half, to hide the steps between the game's updates (it ticks a few times a second, the screen
// redraws 60), as setWind does. Anything gameplay reads is drawn exactly as given, never eased: the cloud cover, which
// drives the cloud field and its shadows (#8: a shadow on a solar panel cuts its power). The light that follows from the
// cover (the grey-day look) is a look, and eases (decided 2026-10-31, #7). The vocabulary follows the game's `weatherAt`
// (Soil-n-Silo's src/game/sim/weather.ts); wind keeps its own call, setWind.

/** A haze on the ground (a fog, a dust storm). */
export interface Haze {
  /** How thick, 0..1: about 0.3 a thin mist, 0.6 a fog. */
  amount: number;
  /** Its colour, sRGB hex. */
  color: number;
  /** How high it reaches, metres. */
  top: number;
}

/** The weather the game asks for. Values left out are 0 (no haze). */
export interface Weather {
  /** How much of the sky is covered, 0..1. Drawn exactly as given: gameplay reads it. */
  cloud: number;
  /** How hard it rains, 0..1. */
  rain?: number;
  /** How hard it snows, 0..1. Rain and snow are apart, so sleet is both and one can ease into the other. */
  snow?: number;
  /** How warm the light is, 0..1 (a heat wave). */
  heat?: number;
  /** The haze on the ground, or none. */
  haze?: Haze | null;
}

const FOG = 0xcfd6d8, DUST = 0xc49a62;

/**
 * Named weathers for the demo and the tools, as WIND_SCALE is for the wind: shorthands that fill in the values, after the
 * game's events (soft rain, thunderstorm, fog, dust storm, heat wave, blizzard). The game sends the values themselves.
 */
export const WEATHER_PRESETS = {
  clear: { cloud: 0 },
  scattered: { cloud: 0.3 },
  overcast: { cloud: 1 },
  'soft-rain': { cloud: 0.7, rain: 0.35 },
  storm: { cloud: 1, rain: 0.9 },
  fog: { cloud: 0.6, haze: { amount: 0.6, color: FOG, top: 4 } },
  dust: { cloud: 0.4, heat: 0.5, haze: { amount: 0.7, color: DUST, top: 6 } },
  'heat-wave': { cloud: 0, heat: 1 },
  snow: { cloud: 0.9, snow: 0.5 },
  blizzard: { cloud: 1, snow: 1 },
} as const satisfies Record<string, Weather>;
export type WeatherName = keyof typeof WEATHER_PRESETS;

/** Seconds a look takes to close most of the gap to the asked one, as the wind's. */
const EASE = 1.5;

/** The weather as drawn: the cloud cover exactly as asked, the looks eased towards it. */
export class WeatherState {
  readonly goal = { cloud: 0, rain: 0, snow: 0, heat: 0, haze: 0, hazeColor: new THREE.Color(FOG), hazeTop: 4 };
  /** The cover, exactly the game's: for what gameplay reads (the cloud field, #8). */
  cloud = 0;
  /** The cover as the light shows it (the grey-day look), eased. */
  overcast = 0;
  rain = 0; snow = 0; heat = 0;
  /** The haze: how thick, its colour (linear) and how high, eased. With none asked for it thins away, keeping its colour. */
  haze = 0; hazeColor = new THREE.Color(FOG); hazeTop = 4;
  private time: number | null = null;

  set(w: Weather, immediate = false) {
    const g = this.goal, clamp = (v = 0) => THREE.MathUtils.clamp(v, 0, 1);
    g.cloud = clamp(w.cloud); g.rain = clamp(w.rain); g.snow = clamp(w.snow); g.heat = clamp(w.heat);
    g.haze = clamp(w.haze?.amount);
    if (w.haze) {
      g.hazeColor.setHex(w.haze.color); g.hazeTop = Math.max(0, w.haze.top);
      // A haze rising from none starts in its own colour and height, not the last one's.
      if (this.haze < 0.01) { this.hazeColor.copy(g.hazeColor); this.hazeTop = g.hazeTop; }
    }
    // The cover is never eased.
    this.cloud = g.cloud;
    if (immediate) this.snap();
  }

  /** Puts the drawn weather at the goal (a level loading, a screenshot). */
  snap() {
    const g = this.goal;
    this.cloud = this.overcast = g.cloud; this.rain = g.rain; this.snow = g.snow; this.heat = g.heat;
    this.haze = g.haze; this.hazeColor.copy(g.hazeColor); this.hazeTop = g.hazeTop;
  }

  /** Advances to a time in seconds. The first time, and a jump back (a tool seeking), only take the time. */
  update(time: number) {
    const dt = this.time === null ? 0 : time - this.time;
    this.time = time;
    if (dt <= 0) return;
    // The goal holds between the game's updates, so one step of any length eases exactly.
    const g = this.goal, k = 1 - Math.exp(-dt / EASE);
    this.overcast += (g.cloud - this.overcast) * k;
    this.rain += (g.rain - this.rain) * k;
    this.snow += (g.snow - this.snow) * k;
    this.heat += (g.heat - this.heat) * k;
    this.haze += (g.haze - this.haze) * k;
    this.hazeColor.lerp(g.hazeColor, k);
    this.hazeTop += (g.hazeTop - this.hazeTop) * k;
  }
}
