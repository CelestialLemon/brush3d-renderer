// The frame's cost, pass by pass: run by tools/profile.ts (headless, on the development machine) and by the demo's ?profile
// page (any machine, from the Pages preview). Each case draws the frame at a set size (whatever the window's), showing the
// same piece of the world as the demo's view at 1080p (the zoom scales with the height, as on a high-DPI screen: only the
// pixel count changes), in a set wind, with some kinds of mesh left out if asked, the clock running so the wind moves. It reports each pass's median GPU
// and CPU time (see src/renderer/timer.ts), and the uncapped frame: frames drawn back to back, the time each takes when
// neither vsync nor the display waits on it (the larger of the CPU's and the GPU's share, roughly).
import type { BrushRenderer } from '../renderer/renderer';
import type { MaterialKind } from '../renderer/materials';
import { PassTimer } from '../renderer/timer';
import { WIND_SCALE } from '../renderer/wind';

export interface ProfileCase { label: string; width: number; height: number; wind: number; hide?: MaterialKind[] }
export interface ProfileRow {
  label: string; width: number; height: number;
  /** Median ms per pass and in all ('frame'); null where the browser has no GPU timer. */
  gpu: Record<string, number> | null;
  /** Median ms per pass, and 'frame': the median of whole frames, the look and the renderer's waiting included. */
  cpu: Record<string, number>;
  /** Mean ms a frame, drawn back to back. */
  uncapped: number;
}

export const PASSES = ['setup', 'shadow', 'under', 'reflect', 'main', 'post'];
const KINDS: MaterialKind[] = ['ground', 'paint', 'grass', 'foliage', 'crop', 'ink', 'water', 'debris'];
const STORM = WIND_SCALE.storm;

/** The usual set: a calm and a stormy frame at 720p, 1080p, 1440p and 4K, then the stormy 1080p frame without each kind. */
export function defaultCases(): ProfileCase[] {
  const sizes: [string, number, number][] = [['720p', 1280, 720], ['1080p', 1920, 1080], ['1440p', 2560, 1440], ['4K', 3840, 2160]];
  const cases: ProfileCase[] = [];
  for (const [name, width, height] of sizes) {
    cases.push({ label: `${name} calm`, width, height, wind: 0 });
    cases.push({ label: `${name} storm`, width, height, wind: STORM });
  }
  for (const k of KINDS) cases.push({ label: `1080p storm, no ${k}`, width: 1920, height: 1080, wind: STORM, hide: [k] });
  return cases;
}

/**
 * Runs the cases. `draw(time)` draws one frame as the demo does (the look, then the renderer); `restore` puts the demo's
 * size and wind back. `progress` hears each row as it's done.
 */
export async function runProfile(
  renderer: BrushRenderer, draw: (time: number) => void, restore: () => void, cases: ProfileCase[],
  progress: (row: ProfileRow, i: number) => void = () => {}, frames = 90,
) {
  const gl = renderer.gl.getContext() as WebGL2RenderingContext;
  const timer = new PassTimer(gl);
  const pixel = new Uint8Array(4);
  const sync = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
  const rows: ProfileRow[] = [];
  let time = 20;
  const view = renderer.view, zoom = view.zoom;
  try {
    for (const [i, c] of cases.entries()) {
      renderer.resize(c.width / renderer.pixelRatio, c.height / renderer.pixelRatio);
      view.zoom = (zoom * c.height) / 1080;
      view.update(0, true);
      renderer.setWind({ speed: c.wind, direction: (31 * Math.PI) / 180, gust: 0.5 }, true);
      for (const k of KINDS) renderer.setVisible(k, !c.hide?.includes(k));
      // Warm up: shaders, the new targets' memory, the GPU's clocks.
      for (let f = 0; f < 20; f++) { draw((time += 1 / 60)); if (f % 5 === 4) { sync(); await nextFrame(); } }
      sync();
      renderer.timer = timer;
      timer.reset();
      // In bursts, so the GPU never waits on the page between passes (a query would count the wait).
      const whole: number[] = [];
      for (let f = 0; f < frames; f++) {
        const t0 = performance.now();
        draw((time += 1 / 60));
        whole.push(performance.now() - t0);
        if (f % 6 === 5) await nextFrame();
      }
      renderer.timer = null;
      await timer.settle();
      const timed = timer.frames.filter((t) => t.gpu);
      const gpu = timer.gpu && timed.length ? medians(timed.map((t) => t.gpu!)) : null;
      const cpu = { ...medians(timer.frames.map((t) => t.cpu)), frame: median(whole) };
      // Uncapped: back to back, then wait for the GPU to finish.
      sync();
      const n = 30, start = performance.now();
      for (let f = 0; f < n; f++) draw((time += 1 / 60));
      sync();
      const row: ProfileRow = { label: c.label, width: c.width, height: c.height, gpu, cpu, uncapped: (performance.now() - start) / n };
      rows.push(row);
      progress(row, i);
    }
  } finally {
    renderer.timer = null;
    for (const k of KINDS) renderer.setVisible(k, true);
    view.zoom = zoom;
    view.update(0, true);
    restore();
  }
  return rows;
}

/**
 * Each pass's median over the frames, and their sum as 'frame'. Not the median of the frames' totals: now and then one pass
 * of a frame is timed long, the GPU having waited partway through it for the page's next commands, and a median per pass
 * leaves that out.
 */
function medians(frames: Record<string, number>[]) {
  const out: Record<string, number> = {};
  for (const p of PASSES) out[p] = median(frames.map((f) => f[p] ?? 0));
  out.frame = PASSES.reduce((a, p) => a + out[p], 0);
  return out;
}
function median(v: number[]) {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0;
}

/** The rows as a plain-text table: GPU ms per pass, the CPU's ms for the whole frame, the uncapped frame and its fps. */
export function table(rows: ProfileRow[]) {
  const head = ['case', ...PASSES.slice(1).map((p) => `${p}`), 'GPU', 'CPU', 'uncapped', 'fps'];
  const lines = rows.map((r) => [
    r.label,
    ...PASSES.slice(1).map((p) => (r.gpu ? r.gpu[p].toFixed(2) : '-')),
    r.gpu ? r.gpu.frame.toFixed(2) : '-',
    r.cpu.frame.toFixed(2),
    r.uncapped.toFixed(2),
    (1000 / r.uncapped).toFixed(0),
  ]);
  const all = [head, ...lines];
  const widths = head.map((_, i) => Math.max(...all.map((l) => l[i].length)));
  return all.map((l) => l.map((x, i) => (i ? x.padStart(widths[i]) : x.padEnd(widths[i]))).join('  ')).join('\n');
}
