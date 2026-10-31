import * as THREE from 'three';

// Weather: the game says what the sky is doing; the renderer draws it (#3, #7). The game owns the weather's state, its
// logic and its pace (a shower building is the game changing its values over time); the renderer only eases the looks
// over a second and a half, to hide the steps between the game's updates (it ticks a few times a second, the screen
// redraws 60), as setWind does. Anything gameplay reads is drawn exactly as given, never eased: the cloud cover, which
// drives the cloud field and its shadows (#8: a shadow on a solar panel cuts its power). The light that follows from the
// cover (the grey-day look) is a look, and eases (decided 2026-10-31, #7). The vocabulary follows the game's `weatherAt`
// (Soil-n-Silo's src/game/sim/weather.ts); wind keeps its own call, setWind.

/**
 * A haze lying on the land (a mist, a fog, a dust storm), or a layer of it higher up (low cloud). It's thickest low down and
 * thins to nothing at its top, so the ground is veiled and roofs, crowns and poles rise out of it; thin, it breaks into
 * drifting patches, and the low ground and the water keep it longest. The game lifts a mist by lowering its amount and top
 * over time (#9).
 */
export interface Haze {
  /** How thick, 0..1: about 0.3 a thin mist, 0.6 a fog, 1 a thick one. */
  amount: number;
  /** Its own colour in plain daylight, sRGB hex; the renderer lights it with the hour and the cloud. */
  color: number;
  /** How high it reaches, metres (world heights). */
  top: number;
  /** Where it starts, metres: clear air under it (low cloud). Left out, it lies on the ground. */
  base?: number;
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
  mist: { cloud: 0.2, haze: { amount: 0.4, color: FOG, top: 0.6 } },
  fog: { cloud: 0.6, haze: { amount: 0.6, color: FOG, top: 4 } },
  'low-cloud': { cloud: 1, haze: { amount: 0.7, color: FOG, top: 9, base: 4.5 } },
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
  readonly goal = { cloud: 0, rain: 0, snow: 0, heat: 0, haze: 0, hazeColor: new THREE.Color(FOG), hazeTop: 4,
    /** The haze's base, or null lying on the ground. */
    hazeBase: null as number | null,
  };
  /** The cover, exactly the game's: for what gameplay reads (the cloud field, #8). */
  cloud = 0;
  /** The cover as the light shows it (the grey-day look), eased. */
  overcast = 0;
  rain = 0; snow = 0; heat = 0;
  /**
   * The haze: how thick, its colour (linear), how high and where it starts, eased. With none asked for it thins away,
   * keeping its colour.
   */
  haze = 0; hazeColor = new THREE.Color(FOG); hazeTop = 4; hazeBase = -50;
  /**
   * Where a haze lying on the ground starts: just under the lowest land (the renderer sets it from the ground and the
   * water). A real height, so a fog rising into low cloud eases its base up from the land, not from far underground.
   */
  ground = -50;
  private time: number | null = null;

  /**
   * Sets the ground's height. A drawn base under it rises to it at once: under the land it can't be seen, and easing it up
   * from there would hold the haze on the land.
   */
  setGround(y: number) {
    this.ground = y;
    this.hazeBase = Math.max(this.hazeBase, Math.min(y, this.goal.hazeTop));
  }

  /** The base asked for, a haze on the ground's at the ground, never above its top. */
  private baseGoal() { return Math.min(this.goal.hazeBase ?? this.ground, this.goal.hazeTop); }

  set(w: Weather, immediate = false) {
    const g = this.goal, clamp = (v = 0) => THREE.MathUtils.clamp(v, 0, 1);
    g.cloud = clamp(w.cloud); g.rain = clamp(w.rain); g.snow = clamp(w.snow); g.heat = clamp(w.heat);
    g.haze = clamp(w.haze?.amount);
    if (w.haze) {
      g.hazeColor.setHex(w.haze.color); g.hazeTop = w.haze.top; g.hazeBase = w.haze.base ?? null;
      // A haze rising from none starts in its own colour and height, not the last one's.
      if (this.haze < 0.01) { this.hazeColor.copy(g.hazeColor); this.hazeTop = g.hazeTop; this.hazeBase = this.baseGoal(); }
    }
    // The cover is never eased.
    this.cloud = g.cloud;
    if (immediate) this.snap();
  }

  /** Puts the drawn weather at the goal (a level loading, a screenshot). */
  snap() {
    const g = this.goal;
    this.cloud = this.overcast = g.cloud; this.rain = g.rain; this.snow = g.snow; this.heat = g.heat;
    this.haze = g.haze; this.hazeColor.copy(g.hazeColor); this.hazeTop = g.hazeTop; this.hazeBase = this.baseGoal();
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
    this.hazeBase += (this.baseGoal() - this.hazeBase) * k;
  }
}
