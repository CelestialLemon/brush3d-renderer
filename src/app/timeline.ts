import { WEATHER_PRESETS, type Weather } from '../renderer/weather';

// A stand-in for the game's weather (#7): scripted spells, at the game's speeds, sent the way the game sends it. The game's
// day is 240 s at normal speed (Soil-n-Silo's DAY_SECONDS), up to 3x faster, so a game hour is 10 s; its conditions glide
// from one to the next (its spellAt), and it ticks a few times a second, so the renderer gets steps it has to hide. Like the
// game, it calls rain under 0.12 a drizzle in the making and sends none (its RAIN_FROM): a shower starts with a step.
// Two spells: a shower (clear, cloud building, rain, clearing again), and a morning fog that lifts (#9: the game lifts it,
// lowering its amount and top; the renderer only draws it).

/** Seconds of a game hour at normal speed. */
export const GAME_HOUR = 10;
/** How often the game sends the weather, times a second. */
export const TICK = 4;
/** Game speeds the demo offers. */
export const SPEEDS = [1, 3] as const;

const RAIN_FROM = 0.12;
const FOG = WEATHER_PRESETS.fog.haze.color;
interface Key { hour: number; cloud: number; rain: number; haze?: number; top?: number }
interface Spell { keys: Key[]; phase: (hour: number) => string }

/** The spells, in game hours: the weather at each key, glided between. Each repeats. */
export const SPELLS = {
  shower: {
    keys: [
      { hour: 0, cloud: 0, rain: 0 },
      { hour: 1.5, cloud: 0, rain: 0 },
      // Cloud building over a few hours.
      { hour: 3, cloud: 0.45, rain: 0 },
      { hour: 4.5, cloud: 0.85, rain: 0 },
      // A shower: two and a half hours, the game's spell of rain.
      { hour: 5.5, cloud: 1, rain: 0.55 },
      { hour: 7, cloud: 1, rain: 0.6 },
      { hour: 8, cloud: 0.8, rain: 0 },
      // Clearing again.
      { hour: 10, cloud: 0.25, rain: 0 },
      { hour: 11.5, cloud: 0, rain: 0 },
      { hour: 12, cloud: 0, rain: 0 },
    ],
    phase: (h) => (h < 1.5 ? 'clear' : h < 4.5 ? 'cloud building' : h < 8 ? 'a shower' : 'clearing'),
  },
  fog: {
    keys: [
      // A thick morning fog...
      { hour: 0, cloud: 0.5, rain: 0, haze: 0.7, top: 4.5 },
      { hour: 1.5, cloud: 0.5, rain: 0, haze: 0.7, top: 4.5 },
      // ...lifting: thinning and sinking to a mist along the stream and in the hollows...
      { hour: 4, cloud: 0.25, rain: 0, haze: 0.4, top: 1 },
      // ...and gone.
      { hour: 5.5, cloud: 0.1, rain: 0, haze: 0, top: 0 },
      { hour: 8, cloud: 0, rain: 0, haze: 0, top: 0 },
      // The evening's mist gathering in the low ground, and thickening to fog again.
      { hour: 9.5, cloud: 0.1, rain: 0, haze: 0.4, top: 1 },
      { hour: 12, cloud: 0.5, rain: 0, haze: 0.7, top: 4.5 },
    ],
    phase: (h) => (h < 1.5 ? 'fog' : h < 5.5 ? 'the fog lifting' : h < 8 ? 'clear' : 'mist gathering'),
  },
} satisfies Record<string, Spell>;
export type SpellName = keyof typeof SPELLS;

const span = (s: SpellName) => SPELLS[s].keys[SPELLS[s].keys.length - 1].hour;
/** How long a spell lasts at normal speed, seconds. */
export const spellSeconds = (s: SpellName) => span(s) * GAME_HOUR;
/** The hour into a spell at a time (seconds of real time, at a game speed). */
const hourAt = (s: SpellName, seconds: number, speed: number) => ((((seconds * speed) / GAME_HOUR) % span(s)) + span(s)) % span(s);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** The weather the game would send at a time (seconds of real time, at a game speed), held between its ticks. */
export function timelineAt(seconds: number, speed = 1, spell: SpellName = 'shower'): Weather {
  const keys: Key[] = SPELLS[spell].keys;
  const hour = hourAt(spell, Math.floor(seconds * TICK) / TICK, speed);
  let i = 0;
  while (i < keys.length - 2 && hour >= keys[i + 1].hour) i++;
  const a = keys[i], b = keys[i + 1], t = smooth((hour - a.hour) / (b.hour - a.hour));
  const at = (k: (key: Key) => number) => k(a) + (k(b) - k(a)) * t;
  const rain = at((k) => k.rain), haze = at((k) => k.haze ?? 0);
  return {
    cloud: at((k) => k.cloud), rain: rain >= RAIN_FROM ? rain : 0,
    haze: haze > 0 ? { amount: haze, color: FOG, top: at((k) => k.top ?? 0) } : null,
  };
}

/** What the spell is doing at a time, for the demo's controls. */
export function timelinePhase(seconds: number, speed = 1, spell: SpellName = 'shower') {
  return SPELLS[spell].phase(hourAt(spell, seconds, speed));
}
