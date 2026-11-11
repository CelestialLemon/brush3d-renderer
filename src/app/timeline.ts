import { WEATHER_PRESETS, type HazeKind, type Weather } from '../renderer/weather';
import type { WaterState } from './water';
import { soakStep } from './ground';

// A stand-in for the game's weather (#7): scripted spells, at the game's speeds, sent the way the game sends it. The game's
// day is 240 s at normal speed (Soil-n-Silo's DAY_SECONDS), up to 3x faster, so a game hour is 10 s; its conditions glide
// from one to the next (its spellAt), and it ticks a few times a second, so the renderer gets steps it has to hide. Like the
// game, it calls rain under 0.12 a drizzle in the making and sends none (its RAIN_FROM): a shower starts with a step.
// Four spells: a shower (clear, cloud building, rain, clearing again), a morning fog that lifts (#9: the game lifts it,
// lowering its amount and top; the renderer only draws it), a dust storm the wind brings in and takes away again, and a
// flood (#18): a storm swells the stream, which runs fast and muddy, spills over the land and drains away again.
// A spell may set the wind too, as the game does with setWind, and the water, as it does with setWater.
// Three storms (#12): a thunderstorm rolling in and clearing, a gale (squalls on a strong wind under a broken sky) and a
// hurricane. They send how stormy the sky looks (storm), the gold breaking under the deck as the storm comes and goes
// (sunUnder), and how often lightning strikes and flickers in the distance, which the demo calls as the game would
// (renderer.strike and renderer.flicker, #12).
// Every spell wets the land as it rains and dries it after, faster in sun (#11): the game's rule, which the demo's
// timelineWet stands in for. A thunderstorm and a hurricane leave the stream muddy, clearing slowly after (#11, the
// water's mud, #18).

/** Seconds of a game hour at normal speed. */
export const GAME_HOUR = 10;
/** How often the game sends the weather, times a second. */
export const TICK = 4;
/** Game speeds the demo offers. */
export const SPEEDS = [1, 3] as const;

const RAIN_FROM = 0.12;
const FOG = WEATHER_PRESETS.fog.haze.color, DUST = WEATHER_PRESETS.dust.haze.color;
/**
 * The weather at a key: the haze's amount and top, the heat, the wind's speed (m/s) if the spell sets it, and the water
 * if it does: how far it stands over the usual (m), how fast it runs (times the usual) and how muddy it is.
 */
interface Key {
  hour: number; cloud: number; rain: number; haze?: number; top?: number; heat?: number; wind?: number;
  rise?: number; flow?: number; mud?: number;
  /** How stormy the sky looks, the low sun under the deck (sunUnder), and strikes and distant flickers a minute. */
  storm?: number; sun?: number; bolts?: number; far?: number;
}
/** A spell's keys, its haze's colour and kind, and what it's doing at an hour. */
interface Spell { keys: Key[]; haze?: { color: number; kind: HazeKind }; phase: (hour: number) => string }

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
    phase: (h) => (h < 1.5 ? 'clear' : h < 4.5 ? 'cloud building' : h < 8 ? 'a shower' : h < 10 ? 'clearing' : 'the ground drying'),
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
  dust: {
    keys: [
      // A hot, still afternoon...
      { hour: 0, cloud: 0, rain: 0, heat: 0.4, wind: 3 },
      // ...the wind getting up...
      { hour: 1, cloud: 0, rain: 0, heat: 0.4, wind: 9 },
      // ...lifting the dust off the land and bringing a wall of it in...
      { hour: 2.5, cloud: 0.2, rain: 0, heat: 0.4, wind: 17, haze: 0.4, top: 3 },
      { hour: 3.5, cloud: 0.4, rain: 0, heat: 0.5, wind: 24, haze: 0.8, top: 7 },
      // ...blowing for a few hours...
      { hour: 6, cloud: 0.4, rain: 0, heat: 0.5, wind: 22, haze: 0.75, top: 7 },
      // ...and dropping as the wind does.
      { hour: 7.5, cloud: 0.2, rain: 0, heat: 0.4, wind: 11, haze: 0.35, top: 3 },
      { hour: 9, cloud: 0, rain: 0, heat: 0.3, wind: 5, haze: 0, top: 1 },
      { hour: 10, cloud: 0, rain: 0, heat: 0.4, wind: 3 },
    ],
    haze: { color: DUST, kind: 'dust' },
    phase: (h) => (h < 1 ? 'still' : h < 3.5 ? 'the dust coming in' : h < 6 ? 'a dust storm' : h < 9 ? 'dropping' : 'still'),
  },
  flood: {
    keys: [
      // A fair day, the stream as usual...
      { hour: 0, cloud: 0.1, rain: 0, wind: 4, rise: 0, flow: 1, mud: 0 },
      { hour: 1, cloud: 0.3, rain: 0, wind: 5, rise: 0, flow: 1, mud: 0 },
      // ...a storm coming in, its rain swelling the stream: faster, browner, rising up its banks...
      { hour: 2.5, cloud: 1, rain: 0.7, wind: 12, rise: 0.05, flow: 1.6, mud: 0.3 },
      { hour: 4, cloud: 1, rain: 1, wind: 16, rise: 0.18, flow: 3.5, mud: 0.75 },
      // ...over them, spreading over the floodplain after the rain's peak (the water from upstream comes later)...
      { hour: 6, cloud: 0.9, rain: 0.5, wind: 10, rise: 0.38, flow: 3, mud: 0.9 },
      { hour: 7.5, cloud: 0.6, rain: 0, wind: 6, rise: 0.42, flow: 2.5, mud: 0.9 },
      // ...and draining away under clearing skies, the water clearing slowly after it.
      { hour: 10, cloud: 0.3, rain: 0, wind: 5, rise: 0.2, flow: 2, mud: 0.7 },
      { hour: 13, cloud: 0.1, rain: 0, wind: 4, rise: 0.08, flow: 1.3, mud: 0.4 },
      { hour: 16, cloud: 0.1, rain: 0, wind: 4, rise: 0, flow: 1, mud: 0.1 },
      { hour: 17, cloud: 0.1, rain: 0, wind: 4, rise: 0, flow: 1, mud: 0 },
    ],
    phase: (h) => (h < 1 ? 'fair' : h < 4 ? 'the stream swelling' : h < 7.5 ? 'a flood' : h < 16 ? 'draining' : 'fair'),
  },
  thunderstorm: {
    keys: [
      // A close afternoon, cloud gathering...
      { hour: 0, cloud: 0.25, rain: 0, wind: 4, storm: 0, sun: 0, bolts: 0, far: 0, rise: 0, flow: 1, mud: 0 },
      { hour: 1.5, cloud: 0.5, rain: 0, wind: 5, storm: 0.1, sun: 0, bolts: 0, far: 0, rise: 0, flow: 1, mud: 0 },
      // ...the storm's deck coming over, darkening before the rain, the sun breaking in under its edge, thunder far off...
      { hour: 3, cloud: 0.9, rain: 0, wind: 9, storm: 0.55, sun: 0.9, bolts: 0, far: 5, rise: 0, flow: 1, mud: 0 },
      { hour: 4, cloud: 1, rain: 0.3, wind: 14, storm: 0.9, sun: 0.2, bolts: 4, far: 6, rise: 0, flow: 1.1, mud: 0.05 },
      // ...the storm: heavy rain, strikes close by, the stream rising a little, faster and browner...
      { hour: 5, cloud: 1, rain: 0.9, wind: 16, storm: 1, sun: 0, bolts: 9, far: 5, rise: 0.02, flow: 1.4, mud: 0.25 },
      { hour: 7, cloud: 1, rain: 1, wind: 15, storm: 1, sun: 0, bolts: 9, far: 5, rise: 0.06, flow: 2, mud: 0.6 },
      // ...passing: the rain easing, the strikes moving off, the sun breaking in under the back of the deck...
      { hour: 8.5, cloud: 1, rain: 0.45, wind: 11, storm: 0.7, sun: 0.3, bolts: 3, far: 6, rise: 0.07, flow: 2, mud: 0.7 },
      { hour: 9.5, cloud: 0.9, rain: 0.1, wind: 8, storm: 0.4, sun: 1, bolts: 0, far: 5, rise: 0.05, flow: 1.7, mud: 0.65 },
      // ...and clearing, the thunder going away, the stream still muddy.
      { hour: 11, cloud: 0.45, rain: 0, wind: 5, storm: 0.05, sun: 0.3, bolts: 0, far: 2, rise: 0.03, flow: 1.4, mud: 0.5 },
      { hour: 12, cloud: 0.25, rain: 0, wind: 4, storm: 0, sun: 0, bolts: 0, far: 0, rise: 0.02, flow: 1.2, mud: 0.4 },
    ],
    phase: (h) => (h < 1.5 ? 'close' : h < 4 ? 'the storm coming in' : h < 8.5 ? 'a thunderstorm' : h < 11 ? 'passing' : 'clearing'),
  },
  gale: {
    keys: [
      // A fresh day, the wind rising...
      { hour: 0, cloud: 0.3, rain: 0, wind: 8, storm: 0, sun: 0 },
      { hour: 2, cloud: 0.6, rain: 0, wind: 17, storm: 0.3, sun: 0 },
      // ...a gale, squalls blowing through under a broken sky...
      { hour: 3.5, cloud: 0.85, rain: 0.35, wind: 23, storm: 0.55, sun: 0 },
      { hour: 5, cloud: 0.65, rain: 0, wind: 25, storm: 0.4, sun: 0.6 },
      { hour: 6.5, cloud: 0.9, rain: 0.45, wind: 22, storm: 0.6, sun: 0 },
      // ...and blowing itself out.
      { hour: 8, cloud: 0.5, rain: 0, wind: 15, storm: 0.2, sun: 0.4 },
      { hour: 10, cloud: 0.3, rain: 0, wind: 8, storm: 0, sun: 0 },
    ],
    phase: (h) => (h < 2 ? 'the wind rising' : h < 8 ? 'a gale' : 'blowing out'),
  },
  hurricane: {
    keys: [
      // The swell before it, the wind getting up...
      { hour: 0, cloud: 0.4, rain: 0, wind: 10, storm: 0, sun: 0, bolts: 0, far: 0, rise: 0, flow: 1, mud: 0 },
      { hour: 2, cloud: 0.9, rain: 0.3, wind: 22, storm: 0.6, sun: 0, bolts: 0, far: 3, rise: 0, flow: 1.1, mud: 0.05 },
      // ...the hurricane: the strongest wind, driving rain, a dark sky, lightning now and then, the stream in spate...
      { hour: 3.5, cloud: 1, rain: 0.9, wind: 32, storm: 1, sun: 0, bolts: 2, far: 5, rise: 0.04, flow: 1.8, mud: 0.4 },
      { hour: 6, cloud: 1, rain: 1, wind: 38, storm: 1, sun: 0, bolts: 3, far: 5, rise: 0.12, flow: 3, mud: 0.75 },
      { hour: 9, cloud: 1, rain: 0.8, wind: 30, storm: 0.9, sun: 0, bolts: 2, far: 4, rise: 0.15, flow: 3.2, mud: 0.85 },
      // ...passing, the sun breaking under its back edge...
      { hour: 11, cloud: 0.85, rain: 0.15, wind: 20, storm: 0.5, sun: 0.8, bolts: 0, far: 2, rise: 0.12, flow: 2.6, mud: 0.8 },
      // ...and gone, the stream still high and brown.
      { hour: 13, cloud: 0.5, rain: 0, wind: 12, storm: 0.1, sun: 0.2, bolts: 0, far: 0, rise: 0.07, flow: 2, mud: 0.65 },
      { hour: 14, cloud: 0.4, rain: 0, wind: 10, storm: 0, sun: 0, bolts: 0, far: 0, rise: 0.05, flow: 1.7, mud: 0.55 },
    ],
    phase: (h) => (h < 2 ? 'the wind getting up' : h < 3.5 ? 'the hurricane coming in' : h < 11 ? 'a hurricane' : 'passing'),
  },
} satisfies Record<string, Spell>;
export type SpellName = keyof typeof SPELLS;

const span = (s: SpellName) => SPELLS[s].keys[SPELLS[s].keys.length - 1].hour;
/** How long a spell lasts at normal speed, seconds. */
export const spellSeconds = (s: SpellName) => span(s) * GAME_HOUR;
/** The hour into a spell at a time (seconds of real time, at a game speed). */
const hourAt = (s: SpellName, seconds: number, speed: number) => ((((seconds * speed) / GAME_HOUR) % span(s)) + span(s)) % span(s);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** A value of the spell at a time (seconds of real time, at a game speed), glided between its keys, held between ticks. */
function valueAt(spell: SpellName, seconds: number, speed: number, value: (key: Key) => number) {
  return valueAtHour(spell, hourAt(spell, Math.floor(seconds * TICK) / TICK, speed), value);
}

/** A value of the spell at an hour into it, glided between its keys. */
function valueAtHour(spell: SpellName, hour: number, value: (key: Key) => number) {
  const keys: Key[] = SPELLS[spell].keys;
  let i = 0;
  while (i < keys.length - 2 && hour >= keys[i + 1].hour) i++;
  const a = keys[i], b = keys[i + 1], t = smooth((hour - a.hour) / (b.hour - a.hour));
  return value(a) + (value(b) - value(a)) * t;
}

/** The weather the game would send at a time (seconds of real time, at a game speed), held between its ticks. */
export function timelineAt(seconds: number, speed = 1, spell: SpellName = 'shower'): Weather {
  const at = (k: (key: Key) => number) => valueAt(spell, seconds, speed, k);
  const rain = at((k) => k.rain), haze = at((k) => k.haze ?? 0), kind: Spell['haze'] = (SPELLS[spell] as Spell).haze;
  const first: Key = SPELLS[spell].keys[0];
  return {
    cloud: at((k) => k.cloud), rain: rain >= RAIN_FROM ? rain : 0, heat: at((k) => k.heat ?? 0), storm: at((k) => k.storm ?? 0),
    // The low sun under the deck, if the spell sends it: else it's the demo's.
    ...(first.sun !== undefined ? { sunUnder: at((k) => k.sun ?? 0) } : {}),
    haze: haze > 0 ? { amount: haze, color: kind?.color ?? FOG, top: at((k) => k.top ?? 0), kind: kind?.kind ?? 'fog' } : null,
  };
}

/** The wind's speed the game would send at a time (m/s), or null if the spell leaves the wind alone. */
export function timelineWind(seconds: number, speed = 1, spell: SpellName = 'shower'): number | null {
  if ((SPELLS[spell].keys as Key[])[0].wind === undefined) return null;
  return Math.round(valueAt(spell, seconds, speed, (k) => k.wind ?? 0) * 2) / 2;
}

/** The water the game would send at a time (see Key), or null if the spell leaves the water alone. */
export function timelineWater(seconds: number, speed = 1, spell: SpellName = 'shower'): WaterState | null {
  if ((SPELLS[spell].keys as Key[])[0].rise === undefined) return null;
  const at = (k: (key: Key) => number) => valueAt(spell, seconds, speed, k);
  return { rise: at((k) => k.rise ?? 0), flow: at((k) => k.flow ?? 1), mud: at((k) => k.mud ?? 0) };
}

/**
 * How wet the land is at a time (#11, 0 dry .. 1 soaked; see DemoGround): the game's rain and sun over the spell so far,
 * from how wet it left the land last time round, as the spell repeats (none the first: then at its end), so it doesn't
 * jump dry as it starts again. Held between ticks, as the weather is.
 */
export function timelineWet(seconds: number, speed = 1, spell: SpellName = 'shower') {
  const start = (WET_LEFT[spell] ??= soak(spell, 0, span(spell)));
  return soak(spell, start, hourAt(spell, Math.floor(seconds * TICK) / TICK, speed));
}
/** How wet each spell leaves the land, from dry (a spell whose rain soaks it leaves it the same from any start). */
const WET_LEFT: Partial<Record<SpellName, number>> = {};
/** How wet the land is `end` hours into a spell, from `wet` at its start. */
function soak(spell: SpellName, wet: number, end: number) {
  const STEP = 0.05;
  for (let h = 0; h < end; h += STEP) {
    const mid = Math.min(h + STEP / 2, end), rain = valueAtHour(spell, mid, (k) => k.rain);
    wet = soakStep(wet, rain >= RAIN_FROM ? rain : 0, valueAtHour(spell, mid, (k) => k.cloud), Math.min(STEP, end - h));
  }
  return wet;
}

/** How often lightning strikes and flickers in the distance at a time (a minute, of real time), or null if never. */
export function timelineLightning(seconds: number, speed = 1, spell: SpellName = 'shower'): { bolts: number; far: number } | null {
  if ((SPELLS[spell].keys as Key[])[0].bolts === undefined) return null;
  return { bolts: valueAt(spell, seconds, speed, (k) => k.bolts ?? 0), far: valueAt(spell, seconds, speed, (k) => k.far ?? 0) };
}

/** What the spell is doing at a time, for the demo's controls. */
export function timelinePhase(seconds: number, speed = 1, spell: SpellName = 'shower') {
  return SPELLS[spell].phase(hourAt(spell, seconds, speed));
}
