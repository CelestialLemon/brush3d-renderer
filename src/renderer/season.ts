// Seasons (#13). A level is in one season (spring, summer, autumn or winter) that never changes during it, set once by
// renderer.setSeason. Its look is the base coat the weather and the hour are laid over (docs/DIRECTION.md).
//
// The game owns the season's day: when the sun rises and sets matters to its solar power, so it sends both, and they
// default to Soil-n-Silo's own table (its src/game/seasons.ts, 2026-10-28). Its character ("a wet spring", "a hard winter")
// uses the game's words; the renderer turns them into looks. How high the sun climbs is only a look, so it's the renderer's
// (the developer, 2026-11-03, #13).
//
// The hour's looks (look.ts) are keyed to one reference day: the sun up at 6, at its height at 12 and down at 20. A
// season's day is mapped onto it piece by piece, so the keys follow the game's sun: sunrise to sunrise, the middle of the
// game's day (where its sun is strongest) to noon, sunset to sunset. The twilights keep their length in hours (an hour of
// first light before sunrise, two of dusk after sunset; shorter only when the night is), and the morning, the afternoon and
// the night stretch or shrink to fit. So a winter day of 8 to 16 has its dawn look at 8:40, noon at 12, golden hour at
// 14:45, the sunset at 15:45, and dusk until 18.

export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof SEASONS)[number];

/** The game's characters (Soil-n-Silo's seasons.ts): a season's twist. */
export const CHARACTERS = ['mild', 'wet', 'dry', 'hot', 'gales', 'stormy', 'hard', 'highRiver'] as const;
export type Character = (typeof CHARACTERS)[number];

/** What the game sends once per level (renderer.setSeason). */
export interface SeasonSettings {
  season: Season;
  /** The season's twist, in the game's words; none for an ordinary season. */
  character?: Character | null;
  /** When the sun rises and sets, in the game's clock hours (0-24; a sunset before the sunrise is the next day's). Left
   * out, the season's in the game's table. */
  sunrise?: number;
  sunset?: number;
}

/** The game's sunrise and sunset in each season (Soil-n-Silo's seasons.ts). */
export const SEASON_SUN: Record<Season, { sunrise: number; sunset: number }> = {
  spring: { sunrise: 6, sunset: 19 },
  summer: { sunrise: 5, sunset: 21 },
  autumn: { sunrise: 7, sunset: 18 },
  winter: { sunrise: 8, sunset: 16 },
};

/**
 * How high the sun climbs at noon, degrees. Summer's is the hour's looks' own (look.ts); spring and autumn are a
 * temperate equinox's. Winter's is a choice between candidates (WINTER_SUN), set by the demo until the developer picks.
 */
export const SUN_HEIGHT: Record<Season, number> = { spring: 45, summer: 58, autumn: 45, winter: 25 };

/**
 * The winter sun's height at noon, candidates for the developer (#13): "low" is a real northern winter's (about 50°N),
 * shadows two to three times as long as things are tall all day; "mid" between; "gentle" keeps a little of the day's
 * height, shadows under twice as long.
 */
export const WINTER_SUN = { low: 18, mid: 25, gentle: 32 } as const;
export type WinterSun = keyof typeof WINTER_SUN;

/**
 * How far the sun's bearing swings from noon's over the day, of summer's: a winter sun rises and sets nearer the south,
 * so its path is shorter.
 */
export const SUN_ARC: Record<Season, number> = { spring: 0.85, summer: 1, autumn: 0.85, winter: 0.7 };

/** A day as the hour's looks follow it: its sunrise, noon and sunset (clock hours), the sun's height at noon (degrees) and
 * its path's swing (of summer's). */
export interface Day {
  readonly sunrise: number; readonly noon: number; readonly sunset: number;
  readonly height: number; readonly arc: number;
}

/** The day the looks are keyed to (look.ts). With no season set, the looks are as they were before seasons. */
export const REFERENCE_DAY: Day = Object.freeze({ sunrise: 6, noon: 12, sunset: 20, height: 58, arc: 1 });

/** The first light's hours before sunrise, and the dusk's after sunset, on the reference day and in every season with
 * a night long enough for them. */
const FIRST_LIGHT = 1, DUSK = 2;
/** The night (hours) under which the twilights shrink with it, so some full night is left. */
const NIGHT_ROOM = 4;
/** The shortest and the longest day the mapping takes, hours: only a day beyond either (no game sends one) is clamped,
 * round its middle. */
const SHORTEST = 0.5, LONGEST = 23.5;

/** The day the looks follow in a season. Equal sunrise and sunset take the season's day length about them. Frozen: its
 * anchors are worked out once (anchors). */
export function dayOf(s: SeasonSettings): Day {
  const sun = SEASON_SUN[s.season];
  const sunrise = s.sunrise ?? sun.sunrise;
  let sunset = s.sunset ?? sun.sunset;
  if (sunset === sunrise) sunset = sunrise + sun.sunset - sun.sunrise;
  // A sunset before the sunrise is the next day's.
  let span = sunset - sunrise;
  if (!(span > 0 && span <= 24)) span = ((span % 24) + 24) % 24;
  const length = Math.min(LONGEST, Math.max(SHORTEST, span)), mid = sunrise + span / 2;
  return Object.freeze({ sunrise: mid - length / 2, noon: mid, sunset: mid + length / 2, height: SUN_HEIGHT[s.season], arc: SUN_ARC[s.season] });
}

/** Each day's anchors (see anchors), worked out once a day. */
const cache = new WeakMap<Day, [number, number][]>();

/** A day's anchors: each the same moment on the reference day and on this one, over one turn from first light. */
function anchors(day: Day): [number, number][] {
  let a = cache.get(day);
  if (a) return a;
  const r = REFERENCE_DAY, room = Math.min(1, (24 - (day.sunset - day.sunrise)) / NIGHT_ROOM);
  const first = FIRST_LIGHT * room, dusk = DUSK * room;
  a = [
    [r.sunrise - FIRST_LIGHT, day.sunrise - first], [r.sunrise, day.sunrise], [r.noon, day.noon], [r.sunset, day.sunset],
    [r.sunset + DUSK, day.sunset + dusk], [r.sunrise - FIRST_LIGHT + 24, day.sunrise - first + 24],
  ];
  cache.set(day, a);
  return a;
}

const wrap = (h: number, from: number) => from + ((((h - from) % 24) + 24) % 24);

/** Maps an hour from one side of the anchors to the other (0 the reference day's, 1 the day's). */
function remap(hour: number, day: Day, from: 0 | 1): number {
  const a = anchors(day), to = 1 - from, h = wrap(hour, a[0][from]);
  let i = 0;
  while (i < a.length - 2 && h >= a[i + 1][from]) i++;
  const t = (h - a[i][from]) / (a[i + 1][from] - a[i][from]);
  return ((a[i][to] + (a[i + 1][to] - a[i][to]) * t) % 24 + 24) % 24;
}

/** The hour on the reference day that a clock hour of this day looks like. */
export const referenceHour = (hour: number, day: Day) => remap(hour, day, 1);
/** The clock hour of this day that looks like an hour of the reference day. */
export const clockHour = (reference: number, day: Day) => remap(reference, day, 0);
