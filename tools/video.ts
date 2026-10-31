// Records the camera moving as a video, to judge motion by eye: crawl, shimmer and popping show only in moving pictures.
//   node tools/video.ts [out-dir] [move ...]      moves: pan, pan-wide, pan-up, turn, zoom, wind (default: all but the
//   wind strengths), wind-calm, wind-breeze, wind-gale, wind-storm, wind-hurricane, wind-ramp (calm to hurricane and back),
//   weather-ramp (clear to overcast and back, sent in steps as the game sends it), weather-snap (the same, the cover
//   jumping clear, overcast, clear: what the ease has to hide), clouds (the clouds drifting, the camera still),
//   clouds-views (the same in each view in turn), clouds-ramp (the cover rising, zoomed out), timeline (the demo's
//   scripted shower at 3x the game's speed), fog-lift (the scripted morning fog lifting to a mist and clearing, at 3x;
//   QUERY="hour=7" for a dawn), dust-storm (the wind getting up and blowing a dust storm through, at 3x), heat (held
//   still, then panning; QUERY="weather=heat-wave")
// Each move is drawn frame by frame at 30 fps with the clock running (so the wind moves too) and encoded with ffmpeg to
// <out-dir>/<move>.mp4. QUERY adds demo URL parameters (e.g. QUERY="hour=17.5", or "weather=storm&falling=0"). See
// tools/browser.ts for the rest.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
  timeline?: (t: number) => number; spell?: 'shower' | 'fog' | 'dust'; ease?: boolean; extra?: boolean;
}
/** The game's updates: a few a second (src/app/timeline.ts), so the weather comes in steps the renderer eases over. */
const tick = (t: number) => Math.floor(t * 4) / 4;
const STILL = { x: -1, z: 4, zoom: 48, view: 0 };
const CLOUDS = { x: -1, z: 4, zoom: 24, view: 0 };
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
  'wind-ramp': { seconds: 16, at: () => STILL, wind: (t) => 35 * Math.sin(Math.min(1, t / 14) * Math.PI), ease: true, extra: true },
  // The cover rising from clear to overcast over 6 s, held, and clearing again, at the game's ticks.
  'weather-ramp': { seconds: 16, at: () => STILL, cloud: (t) => Math.sin(Math.min(1, tick(t) / 14) * Math.PI) ** 0.5, ease: true, extra: true },
  'weather-snap': { seconds: 12, at: () => STILL, cloud: (t) => (t >= 2 && t < 7 ? 1 : 0), ease: true, extra: true },
  // The clouds drifting over the land as the clock runs, the camera still and zoomed out; and the same in each of the four
  // views in turn (QUERY sets the cover, e.g. "cloud=0.45", and the hour).
  clouds: { seconds: 8, at: () => CLOUDS, extra: true },
  'clouds-views': { seconds: 16, at: (t) => ({ ...CLOUDS, view: Math.min(3, Math.floor(t / 4)) }), extra: true },
  // The cover rising from clear to overcast over 16 s at the game's ticks, the clouds drifting, zoomed out to see their shapes.
  'clouds-ramp': { seconds: 20, at: () => ({ ...CLOUDS, zoom: 16 }), cloud: (t) => Math.min(1, tick(t) / 16), ease: true, extra: true },
  timeline: { seconds: 40, at: () => STILL, timeline: (t) => t, ease: true, extra: true },
  'fog-lift': { seconds: 22, at: () => ({ x: -6, z: 4, zoom: 28, view: 0 }), timeline: (t) => t, spell: 'fog', ease: true, extra: true },
  'dust-storm': { seconds: 34, at: () => ({ x: -6, z: 4, zoom: 28, view: 0 }), timeline: (t) => t, spell: 'dust', ease: true, extra: true },
  // Held still, then panning: the heat's shimmer should stay with the land, not swim over it.
  heat: { seconds: 8, at: (t) => pan({ x: -8, z: 6, zoom: 40, view: 0 }, 40 * Math.max(0, t - 4), 10 * Math.max(0, t - 4)), extra: true },
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
      const png = await page.evaluate((cam, time, wind, weather, timeline, ease) => {
        (window as any).__draw(cam, { time, wind, weather, timeline, ease });
        return document.querySelector('canvas')!.toDataURL('image/png');
      }, move.at(t), 3 + t, wind, weather, move.timeline ? { time: move.timeline(t), speed: 3, spell: move.spell ?? 'shower' } : undefined,
      !!move.ease && i > 0);
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
