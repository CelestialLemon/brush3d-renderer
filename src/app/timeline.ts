import type { Weather } from '../renderer/weather';

// A stand-in for the game's weather (#7): a scripted spell of clear, cloud building, a shower and clearing again, at the
// game's speeds, sent the way the game sends it. The game's day is 240 s at normal speed (Soil-n-Silo's DAY_SECONDS), up to
// 3x faster, so a game hour is 10 s; its conditions glide from one to the next (its spellAt), and it ticks a few times a
// second, so the renderer gets steps it has to hide. Like the game, it calls rain under 0.12 a drizzle in the making and
// sends none (its RAIN_FROM): a shower starts with a step.

/** Seconds of a game hour at normal speed. */
export const GAME_HOUR = 10;
/** How often the game sends the weather, times a second. */
export const TICK = 4;
/** Game speeds the demo offers. */
export const SPEEDS = [1, 3] as const;

const RAIN_FROM = 0.12;
/** The spell, in game hours: the weather at each key, glided between. */
const KEYS: { hour: number; cloud: number; rain: number }[] = [
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
];
const SPAN = KEYS[KEYS.length - 1].hour;
/** How long the spell lasts at normal speed, seconds; it repeats. */
export const TIMELINE_SECONDS = SPAN * GAME_HOUR;
/** The hour into the spell at a time (seconds of real time, at a game speed). */
const hourAt = (seconds: number, speed: number) => ((((seconds * speed) / GAME_HOUR) % SPAN) + SPAN) % SPAN;

const smooth = (t: number) => t * t * (3 - 2 * t);

/** The weather the game would send at a time (seconds of real time, at a game speed), held between its ticks. */
export function timelineAt(seconds: number, speed = 1): Weather {
  const hour = hourAt(Math.floor(seconds * TICK) / TICK, speed);
  let i = 0;
  while (i < KEYS.length - 2 && hour >= KEYS[i + 1].hour) i++;
  const a = KEYS[i], b = KEYS[i + 1], t = smooth((hour - a.hour) / (b.hour - a.hour));
  const rain = a.rain + (b.rain - a.rain) * t;
  return { cloud: a.cloud + (b.cloud - a.cloud) * t, rain: rain >= RAIN_FROM ? rain : 0 };
}

/** What the spell is doing at a time, for the demo's controls. */
export function timelinePhase(seconds: number, speed = 1) {
  const hour = hourAt(seconds, speed);
  return hour < 1.5 ? 'clear' : hour < 4.5 ? 'cloud building' : hour < 8 ? 'a shower' : 'clearing';
}
