// Records the camera moving as a video, to judge motion by eye: crawl, shimmer and popping show only in moving pictures.
//   node tools/video.ts [out-dir] [move ...]      moves: pan, pan-wide, pan-up, turn, zoom, wind (default: all but the
//   wind strengths), wind-calm, wind-breeze, wind-gale, wind-storm, wind-hurricane, wind-ramp (calm to hurricane and back),
//   gusts (twenty seconds held still and wider, to see the gusts come and go; QUERY="wind=gale"),
//   weather-ramp (clear to overcast and back, sent in steps as the game sends it), weather-snap (the same, the cover
//   jumping clear, overcast, clear: what the ease has to hide), clouds (the clouds drifting, the camera still),
//   clouds-views (the same in each view in turn), clouds-ramp (the cover rising, zoomed out), mirror-stream and
//   mirror-panels (the clouds drifting in the farm's stream and its solar glass, close), mirror-pan (along the stream), timeline (the demo's
//   scripted shower at 3x the game's speed), shower (its rain, framed on the stream and the shed; #11), wet-shower (the
//   shower wetting the shed's ground and the ground drying after, at 3x; #11), fog-lift (the scripted morning fog lifting to a mist and clearing, at 3x;
//   QUERY="hour=7" for a dawn), dust-storm (the wind getting up and blowing a dust storm through, at 3x), heat (held
//   still, then panning; QUERY="weather=heat-wave"), flood (the scripted storm swelling the farm's stream, flooding the
//   land and draining, at 3x; #18), flood-meadow (the same over the meadow; QUERY="scene=meadow"), stream-spate and
//   stream-usual (the farm's stream close, in spate and as usual: the flow carrying the ripples), sunset and sunrise (the
//   hour running from 16:00 past sunset, or from before dawn to 9:00, the camera still: QUERY="cloud=1&sunUnder=1" for the low sun
//   under a cloud deck, #8; in a season, QUERY="season=winter", the same stretch of its day, #13), day (first light to
//   dusk, the camera still and wide: QUERY="season=winter" for the season's day, #13), lightning (strikes then distant
//   flickers: QUERY="weather=storm&flashes=gentle", #12), thunderstorm, gale and hurricane (the demo's scripted storms rolling
//   in and clearing, at 3x, the camera still and wide, lightning at the spell's rates from a fixed seed, so every look gets
//   the same strikes: QUERY="hour=night", #12), snow-settle (snow settling on the shed, bare to deep; #14) and
//   snow-pan (the camera panning over lying snow; QUERY="season=winter"), snowfall and blizzard (the demo's scripted
//   snowfall and blizzard at 3x; QUERY="season=winter"), snow-close (snow falling, still and close on the shed) and
//   snow-fall-pan (panning through falling snow; QUERY="season=winter&weather=snow"), frost-dawn and cold-snap (the
//   frosty spells at 3x; #14), river-freeze (the stream freezing over and thawing at 3x; QUERY="season=winter", #14),
//   patch and patch-glide (the water's test patch: each of its waters held still in turn, then gliding from the pond down
//   to the run; QUERY="scene=water", #19)
// Each move is drawn frame by frame at 30 fps with the clock running (so the wind moves too) and encoded with ffmpeg to
// <out-dir>/<move>.mp4. QUERY adds demo URL parameters (e.g. QUERY="hour=17.5", or "weather=storm&falling=0"). See
// tools/browser.ts for the rest.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Page } from 'puppeteer-core';
import { launch, open } from './browser.ts';

const FPS = 30;
const PITCH = (30 * Math.PI) / 180;
interface Cam { x: number; z: number; zoom: number; view: number }
const STRENGTHS = { calm: 0, breeze: 5, gale: 17, storm: 25, hurricane: 35 };
/**
 * A move: how long it lasts, where the camera is at time t (seconds), and the wind (m/s), the cloud cover or the timeline's
 * time if not the demo's (eased if 'ease').
 */
interface Move {
  seconds: number; at: (t: number) => Cam; wind?: (t: number) => number; cloud?: (t: number) => number;
  timeline?: (t: number) => number; spell?: 'shower' | 'fog' | 'dust' | 'flood' | 'thunderstorm' | 'gale' | 'hurricane' | 'snowfall' | 'blizzard' | 'late-frost' | 'cold-snap' | 'freeze-thaw';
  ease?: boolean; extra?: boolean;
  /** The water (#18): how far it stands over the usual (m), how fast it runs (times the usual), how muddy (0..1). */
  water?: (t: number) => { rise?: number; flow?: number; mud?: number };
  /** The hour, if it moves: on the reference day (16 to 20.5 for a sunset), drawn at that point of the season's day. */
  hour?: (t: number) => number;
  /** The ground (#14): how deep the snow lies (0..1), sent in the game's steps and eased. */
  ground?: (t: number) => { snow?: number; frost?: number };
  /** Lightning, standing in for the game (#12): strikes as [time, x, z] and distant flickers' times. */
  lightning?: { strikes?: [number, number, number][]; flickers?: number[] };
}
/** The game's updates: a few a second (src/demo/timeline.ts), so the weather comes in steps the renderer eases over. */
const tick = (t: number) => Math.floor(t * 4) / 4;
const STILL = { x: -1, z: 4, zoom: 48, view: 0 };
const CLOUDS = { x: -1, z: 4, zoom: 24, view: 0 };
const STORM_CAM = { x: -6, z: 4, zoom: 28, view: 0 };
/** A number in 0..1 from a frame and a channel, the same every run. */
const hash = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
/**
 * A scripted storm's lightning at frame i (#12): its strikes and flickers a minute at that time, the demo's (timeline.ts),
 * drawn at those rates from a fixed seed; strikes land on the land in view.
 */
async function stormLightning(page: Page, move: Move, i: number, t: number) {
  if (!move.timeline || !move.spell) return { bolts: [] as { x: number; z: number }[], flickers: 0 };
  const rates = await page.evaluate((time, spell) => (window as any).__timelineLightning(time, 3, spell), move.timeline(t), move.spell) as
    { bolts: number; far: number } | null;
  if (!rates) return { bolts: [], flickers: 0 };
  const cam = move.at(t), yaw = ((45 + 90 * cam.view) * Math.PI) / 180;
  const across = (hash(i, 2) - 0.5) * 0.7 * (1280 / cam.zoom), along = (hash(i, 3) - 0.6) * 0.5 * (720 / cam.zoom) / Math.sin(PITCH);
  const bolts = hash(i, 1) < rates.bolts / 60 / FPS
    ? [{ x: cam.x + Math.cos(yaw) * across - Math.sin(yaw) * along, z: cam.z - Math.sin(yaw) * across - Math.cos(yaw) * along }] : [];
  return { bolts, flickers: hash(i, 4) < rates.far / 60 / FPS ? 1 : 0 };
}
const MOVES: Record<string, Move> = {
  // A slow drag to the right and a little up, at an everyday zoom: 60 px a second.
  pan: { seconds: 5, at: (t) => pan({ x: 0, z: 0, zoom: 40, view: 0 }, 60 * t, 15 * t) },
  // Zoomed out, faster.
  'pan-wide': { seconds: 5, at: (t) => pan({ x: 0, z: 0, zoom: 24, view: 0 }, 110 * t, 0) },
  // Straight up the screen: things travel from near to far, through the haze.
  'pan-up': { seconds: 5, at: (t) => pan({ x: 0, z: 0, zoom: 32, view: 0 }, 0, 70 * t) },
  // A quarter turn, eased as the demo eases it, then held.
  turn: { seconds: 3, at: (t) => ({ x: 0, z: 0, zoom: 32, view: 1 - Math.exp(-Math.max(0, t - 0.3) * 9) }) },
  // Zoom from wide to close and back, smoothly.
  zoom: { seconds: 6, at: (t) => ({ x: -1, z: 4, zoom: 24 * Math.pow(64 / 24, 0.5 - 0.5 * Math.cos((t / 6) * 2 * Math.PI)), view: 0 }) },
  // The camera still, the wind moving.
  wind: { seconds: 5, at: () => STILL },
  // The camera still, at each strength of wind; and the wind rising from calm to a hurricane and dying down again.
  ...Object.fromEntries(Object.entries(STRENGTHS).map(([k, v]) => [`wind-${k}`, { seconds: 5, at: () => STILL, wind: () => v, extra: true }])),
  // Twenty seconds of the gusts going by, held still and wider: long enough to see them come and go (#36).
  gusts: { seconds: 20, at: () => ({ x: -4, z: 4, zoom: 26, view: 0 }), extra: true },
  'wind-ramp': { seconds: 16, at: () => STILL, wind: (t) => 35 * Math.sin(Math.min(1, t / 14) * Math.PI), ease: true, extra: true },
  // The cover rising from clear to overcast over 6 s, held, and clearing again, at the game's ticks.
  'weather-ramp': { seconds: 16, at: () => STILL, cloud: (t) => Math.sin(Math.min(1, tick(t) / 14) * Math.PI) ** 0.5, ease: true, extra: true },
  'weather-snap': { seconds: 12, at: () => STILL, cloud: (t) => (t >= 2 && t < 7 ? 1 : 0), ease: true, extra: true },
  // The clouds drifting over the land as the clock runs, the camera still and zoomed out; and the same in each of the four
  // views in turn (QUERY sets the cover, e.g. "cloud=0.45", and the hour).
  clouds: { seconds: 8, at: () => CLOUDS, extra: true },
  'clouds-views': { seconds: 16, at: (t) => ({ ...CLOUDS, view: Math.min(3, Math.floor(t / 4)) }), extra: true },
  // The cover rising from clear to overcast over 16 s at the game's ticks, the clouds drifting, zoomed out to see their shapes.
  // The clouds drifting in the mirror (#8): the farm's stream, and its solar array, the camera still and close.
  'mirror-stream': { seconds: 12, at: () => ({ x: -14, z: 20, zoom: 64, view: 0 }), extra: true },
  'mirror-panels': { seconds: 12, at: () => ({ x: -6.4, z: -22, zoom: 64, view: 0 }), extra: true },
  // Panning slowly along the stream, close: does the mirror shimmer as the camera moves?
  'mirror-pan': { seconds: 6, at: (t) => pan({ x: -14, z: 20, zoom: 64, view: 0 }, 20 * t, 0), extra: true },
  'clouds-ramp': { seconds: 20, at: () => ({ ...CLOUDS, zoom: 16 }), cloud: (t) => Math.min(1, tick(t) / 16), ease: true, extra: true },
  timeline: { seconds: 40, at: () => STILL, timeline: (t) => t, ease: true, extra: true },
  // The scripted shower's rain coming and going (#11), at 3x, framed on the stream, the bridge and the shed: the strokes
  // stopping at the roof and the trees, splashing on the ground and ringing on the water (QUERY="hour=dusk").
  shower: { seconds: 18, at: () => ({ x: 2, z: 15, zoom: 32, view: 0 }), timeline: (t) => 12 + t, ease: true, extra: true },
  // The ground wetting and drying (#11): the scripted shower over the shed, from the cloud building (its hour 4) to the
  // ground drying after (its hour 12), at 3x: the land darkening, the track turning to mud, the roof's glaze, the porch
  // staying dry; then drying in patches, rises first (QUERY="hour=sunset", "hour=night").
  'wet-shower': { seconds: 80 / 3, at: () => ({ x: 11, z: 15, zoom: 48, view: 0 }), timeline: (t) => 40 / 3 + t, ease: true, extra: true },
  'fog-lift': { seconds: 22, at: () => ({ x: -6, z: 4, zoom: 28, view: 0 }), timeline: (t) => t, spell: 'fog', ease: true, extra: true },
  'dust-storm': { seconds: 34, at: () => ({ x: -6, z: 4, zoom: 28, view: 0 }), timeline: (t) => t, spell: 'dust', ease: true, extra: true },
  // Held still, then panning: the heat's shimmer should stay with the land, not swim over it.
  heat: { seconds: 8, at: (t) => pan({ x: -8, z: 6, zoom: 40, view: 0 }, 40 * Math.max(0, t - 4), 10 * Math.max(0, t - 4)), extra: true },
  // The water (#18): a storm's flood, the camera still and wide, at 3x; and the stream close, the flow carrying the ripples.
  flood: { seconds: 57, at: () => ({ x: -6, z: 17, zoom: 24, view: 0 }), timeline: (t) => t, spell: 'flood', ease: true, extra: true },
  'flood-meadow': { seconds: 57, at: () => ({ x: 0, z: 0, zoom: 26, view: 0 }), timeline: (t) => t, spell: 'flood', ease: true, extra: true },
  'stream-spate': { seconds: 8, at: () => ({ x: -14, z: 20, zoom: 64, view: 0 }), water: () => ({ rise: 0.15, flow: 3.5, mud: 0.75 }), extra: true },
  // The sun sinking (or rising) under the sky as QUERY has it (#8: cloud=1&sunUnder=1 for golden hour under a deck), the camera still.
  sunset: { seconds: 16, at: () => ({ x: -1, z: 4, zoom: 32, view: 0 }), hour: (t) => 16 + (4.5 * t) / 16, extra: true },
  sunrise: { seconds: 16, at: () => ({ x: -1, z: 4, zoom: 32, view: 0 }), hour: (t) => 5.5 + (3.5 * t) / 16, extra: true },
  // A whole day, first light to dusk, the camera still and wide: in a season (QUERY="season=winter", #13) the sun's path
  // and its height as the hour's looks follow the game's sunrise and sunset.
  day: { seconds: 24, at: () => ({ x: -1, z: 4, zoom: 20, view: 0 }), hour: (t) => 5.2 + (16.3 * t) / 24, extra: true },
  // Lightning (#12): a few strikes over the farm, then distant flickers; the setting by QUERY's flashes, the storm by
  // QUERY="weather=storm".
  lightning: {
    seconds: 9, at: () => ({ x: -1, z: 4, zoom: 32, view: 0 }), extra: true,
    lightning: { strikes: [[0.8, 5, 2], [2.6, -8, -4], [3.1, 2, 9], [4.8, -3, 1]], flickers: [6.1, 7.4, 8.1] },
  },
  // Snow settling (#14): from bare ground to deep over twelve seconds, sent in the game's steps, the camera still on the
  // shed (its roof takes the snow, its porch doesn't); then held.
  'snow-settle': { seconds: 15, at: () => ({ x: 10, z: 12, zoom: 48, view: 0 }), ground: (t) => ({ snow: Math.min(0.8, tick(t) / 15) }), ease: true, extra: true },
  // The snow lying, the camera panning over the farm: what the snow does in motion.
  'snow-pan': { seconds: 8, at: (t) => pan({ x: 4, z: 6, zoom: 48, view: 0 }, -t * 40, 0), ground: () => ({ snow: 0.5 }), extra: true },
  // The scripted storms (#12), at 3x, the camera still and wide: the spell's lightning drawn at its rates (stormLightning).
  thunderstorm: { seconds: 40, at: () => STORM_CAM, timeline: (t) => t, spell: 'thunderstorm', ease: true, extra: true },
  gale: { seconds: 33, at: () => STORM_CAM, timeline: (t) => t, spell: 'gale', ease: true, extra: true },
  hurricane: { seconds: 47, at: () => STORM_CAM, timeline: (t) => t, spell: 'hurricane', ease: true, extra: true },
  // Falling snow (#14), at 3x: the demo's snowfall coming in over the shed and the bridge, settling and clearing; and a
  // blizzard rolling in on a gale, whiting out the distance and blowing itself out, wider (QUERY="season=winter").
  snowfall: { seconds: 30, at: () => ({ x: 4, z: 14, zoom: 40, view: 0 }), timeline: (t) => 5 + t, spell: 'snowfall', ease: true, extra: true },
  blizzard: { seconds: 34, at: () => STORM_CAM, timeline: (t) => t, spell: 'blizzard', ease: true, extra: true },
  // A late frost melting in the morning sun (#14), at 3x from just before dawn, close on the shed and the orchard
  // (QUERY="season=spring"); and a cold snap's day, wider (QUERY="season=winter").
  'frost-dawn': { seconds: 22, at: () => ({ x: 10, z: 12, zoom: 52, view: 0 }), timeline: (t) => 10 + t, spell: 'late-frost', ease: true, extra: true },
  'cold-snap': { seconds: 40, at: () => ({ x: 4, z: 10, zoom: 36, view: 0 }), timeline: (t) => t, spell: 'cold-snap', ease: true, extra: true },
  // The farm's stream freezing over and thawing (#14), the demo's scripted freeze-thaw at 3x, close on its bend
  // (QUERY="season=winter").
  'river-freeze': { seconds: 80 / 3, at: () => ({ x: -14, z: 20, zoom: 56, view: 0 }), timeline: (t) => t, spell: 'freeze-thaw', ease: true, extra: true },
  // Snow falling steadily, the camera still and close on the shed: the flakes' look (QUERY="season=winter&weather=snow").
  'snow-close': { seconds: 8, at: () => ({ x: 10, z: 12, zoom: 64, view: 0 }), extra: true },
  // The camera panning through falling snow: the flakes stay in the world, none jumps.
  'snow-fall-pan': { seconds: 6, at: (t) => pan({ x: 4, z: 6, zoom: 44, view: 0 }, -t * 50, 0), extra: true },
  'stream-usual': { seconds: 8, at: () => ({ x: -14, z: 20, zoom: 64, view: 0 }), water: () => ({ rise: 0, flow: 1, mud: 0 }), extra: true },
  // The water's test patch (#19, QUERY="scene=water"): held still on each of its waters in turn (the pond, the slow bend,
  // the flooded meadow, the fast run, 4 s each), then gliding from the pond down to the run.
  patch: {
    seconds: 16, extra: true,
    at: (t) => [{ x: -15, z: -13 }, { x: 2, z: -1 }, { x: -4, z: 4 }, { x: 6, z: 17 }].map((c) => ({ ...c, zoom: 56, view: 0 }))[Math.min(3, Math.floor(t / 4))],
  },
  'patch-glide': { seconds: 12, extra: true, at: (t) => { const k = t / 12; return { x: -15 + 21 * k, z: -13 + 30 * k, zoom: 48, view: 0 }; } },
};

/** The camera moved by screen pixels (right, up), as dragging does. */
function pan(c: Cam, right: number, up: number): Cam {
  const yaw = ((45 + 90 * c.view) * Math.PI) / 180;
  return {
    ...c,
    x: c.x + (Math.cos(yaw) * right - (Math.sin(yaw) * up) / Math.sin(PITCH)) / c.zoom,
    z: c.z + (-Math.sin(yaw) * right - (Math.cos(yaw) * up) / Math.sin(PITCH)) / c.zoom,
  };
}

const [out = 'out', ...names] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const { browser, page } = await launch();
try {
  await open(page, process.env.QUERY ?? '');
  for (const name of names.length ? names : Object.keys(MOVES).filter((k) => !MOVES[k].extra)) {
    const move = MOVES[name];
    if (!move) throw new Error(`No move ${name}: ${Object.keys(MOVES).join(', ')}`);
    const dir = await mkdtemp(join(tmpdir(), `brush3d-${name}-`));
    const frames = Math.round(move.seconds * FPS);
    for (let i = 0; i < frames; i++) {
      const t = i / FPS;
      // Each move starts from its own wind (the demo's, if it sets none), not where the last one left it; then eases if asked.
      const wind = move.wind ? { speed: move.wind(t) } : i === 0 ? {} : undefined;
      const weather = move.cloud ? { cloud: move.cloud(t) } : i === 0 && !move.timeline ? {} : undefined;
      const water = move.water?.(t);
      const ground = move.ground?.(t);
      // Lightning runs on real seconds: here the frame's, so the video's flashes are at the right moments.
      const storm = await stormLightning(page, move, i, t);
      const bolts = [...(move.lightning?.strikes?.filter(([at]) => at >= t && at < t + 1 / FPS).map(([, x, z]) => ({ x, z })) ?? []), ...storm.bolts];
      const flickers = (move.lightning?.flickers?.filter((at) => at >= t && at < t + 1 / FPS).length ?? 0) + storm.flickers;
      await page.evaluate((now, bolts, flickers) => {
        const r = (window as any).__renderer;
        r.lightning.clock = () => now;
        for (const b of bolts) r.strike(b);
        for (let n = 0; n < flickers; n++) r.flicker();
      }, 1000 + t, bolts, flickers);
      const png = await page.evaluate(async (cam, time, wind, weather, timeline, ease, water, hour, ground) => {
        await (window as any).__draw(cam, { time, wind, weather, timeline, ease, water, dayHour: hour, ground });
        return document.querySelector('canvas')!.toDataURL('image/png');
      }, move.at(t), 3 + t, wind, weather, move.timeline ? { time: move.timeline(t), speed: 3, spell: move.spell ?? 'shower' } : undefined,
      !!move.ease && i > 0, water, move.hour?.(t), ground);
      await writeFile(join(dir, `${String(i).padStart(4, '0')}.png`), Buffer.from(png.split(',')[1], 'base64'));
    }
    const file = join(out, `${name}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(dir, '%04d.png'),
      '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', file]);
    await rm(dir, { recursive: true });
    console.log(`${file}  (${frames} frames)`);
  }
} finally {
  await browser.close();
}
