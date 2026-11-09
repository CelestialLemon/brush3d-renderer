// Measures the lightning against the flash limits (#12): what's on the screen, not what the code means to do.
//   W=960 H=540 node tools/flash.ts [out.json]        (about 10 minutes; ONLY=gentle: just the runs with that in the name)
//
// It runs lightning through the demo on a made-up clock, strikes and flickers as a game might and as a game never should
// (every frame), at each flash setting, by day and at night. Every frame is drawn twice, with the lightning and without, and
// read back finished: grade, grain, bolt and all. Colours are turned back from sRGB to light before anything's added up.
// It reports what the published tests look at (WCAG 2.2 2.3.1; see #12): a flash is a rise and a fall of 0.10 of the screen's
// full brightness or more, with the darker side under 0.80; slow climbs count and small wobbles don't reset them.
//   flashes/s   the most flashes in any second, over the whole picture and over any quarter of it (limit: 3; asked of the
//               renderer: 2, none toned down)
//   area>3/s    the most of any field of view (10 degrees; limit: 25%) flashing more than 3 times in one second, found place by
//               place so flashes out of step can't hide from each other (a bolt's sliver counts here, and passes for its size)
//   lift        how much brighter the picture is than without the lightning: the worst pixel, and the share of them over
//               the setting's limit. A bolt is meant to be over it, on a sliver: that's the share.
//   rises       the flashes the governor let through: at most 2 in a second, 0.6 s apart, 2 in ten seconds.
// A pass here is not a pass of the Harding test or any certified one; those need the certified tools and the final game.
import { writeFile } from 'node:fs/promises';
import { launch, open } from './browser.ts';

// `most`: the limit of the lift on the picture as a whole (a bolt's sliver may be over it); `sliver`: of the bolt and glow
// toned down, on all but 0.05% of the screen (where the jagged bolt crosses itself).
const LIMIT = { full: { most: 0.25, sliver: 1.01, flashes: 2 }, gentle: { most: 0.055, sliver: 0.15, flashes: 0 }, off: { most: 0.095, sliver: 0.15, flashes: 0 } } as const;
type Setting = keyof typeof LIMIT;

/** One run: when strikes and flickers are asked for, the frame times, and what changes while it runs. */
interface Run {
  name: string; query: string; hour: number; setting: Setting; seconds: number; fps: number;
  /** Frames' lengths vary (a game stuttering) if given. */
  jitter?: number;
  /** Strikes and flickers asked for at frame n, time t; `spam`: every frame. */
  plan: 'natural' | 'spam' | 'swap' | 'stall';
  look?: 'a' | 'b' | 'c'; view?: number;
  /** The zoom at 1080p (screen px per metre); 44 if not given. */
  zoom?: number;
}

const scenes = ['scene=farm&weather=storm&windSpeed=0', 'scene=meadow&weather=storm&windSpeed=0'];
const runs: Run[] = [];
const label = (query: string) => (query.includes('farm') ? 'farm' : 'meadow');
for (const query of scenes) for (const hour of [12, 22]) for (const setting of ['full', 'gentle', 'off'] as Setting[]) {
  runs.push({ name: `${label(query)} ${hour}h ${setting}`, query, hour, setting, seconds: 8, fps: 30, plan: 'natural' });
}
const [farm, meadow] = scenes;
// A strike and a flicker every frame: long enough at full to see the ten-second limit come round again.
for (const [query, hour] of [[farm, 22], [meadow, 12]] as const) for (const setting of ['full', 'gentle', 'off'] as Setting[]) {
  runs.push({ name: `${label(query)} ${hour}h ${setting}, every frame`, query, hour, setting, seconds: setting === 'full' ? 11 : 5, fps: 30, plan: 'spam' });
}
for (const look of ['a', 'b', 'c'] as const) for (const hour of [17.5, 22]) runs.push({ name: `farm ${hour}h full, looks ${look}`, query: farm, hour, setting: 'full', seconds: 5, fps: 30, plan: 'natural', look });
for (const look of ['b', 'c'] as const) for (const setting of ['gentle', 'off'] as const) runs.push({ name: `farm 22h ${setting}, looks ${look}`, query: farm, hour: 22, setting, seconds: 5, fps: 30, plan: 'natural', look });
for (const zoom of [16, 192]) for (const setting of ['full', 'gentle', 'off'] as const) for (const look of ['a', 'b', 'c'] as const) runs.push({ name: `farm 22h ${setting}, looks ${look}, zoom ${zoom}`, query: farm, hour: 22, setting, seconds: 5, fps: 30, plan: 'natural', look, zoom });
for (const view of [1, 2, 3]) runs.push({ name: `farm 22h full, view ${view}`, query: farm, hour: 22, setting: 'full', seconds: 5, fps: 30, plan: 'natural', look: 'b', view });
for (const fps of [45, 60]) runs.push({ name: `farm 22h full, every frame at ${fps} fps`, query: farm, hour: 22, setting: 'full', seconds: 4, fps, plan: 'spam' });
runs.push({ name: 'farm 22h full, every frame, uneven', query: farm, hour: 22, setting: 'full', seconds: 5, fps: 30, plan: 'spam', jitter: 0.03 });
runs.push({ name: 'farm 22h, settings changed mid-flash', query: farm, hour: 22, setting: 'full', seconds: 12, fps: 30, plan: 'swap' });
runs.push({ name: 'farm 22h, tab away and back', query: farm, hour: 22, setting: 'full', seconds: 9, fps: 30, plan: 'stall' });

selfTest();
const [out = 'flash.json'] = process.argv.slice(2);
const { browser, page } = await launch();
const results: Record<string, unknown>[] = [];
let failed = 0, opened = '';
try {
  for (const r of runs.filter((run) => !process.env.ONLY || new RegExp(process.env.ONLY).test(run.name))) {
    if (r.query !== opened) { await open(page, r.query); opened = r.query; await page.evaluate(install); await page.evaluate(`window.__analyse = ${analyse.toString()}`); }
    const limit = LIMIT[r.setting];
    const m = await page.evaluate(measure, { ...r, limit: limit.most, sliver: limit.sliver } as never) as Record<string, number | number[]>;
    const problems: string[] = [];
    if (Number(m.areaOver3) > 0.25) problems.push(`${pct(m.areaOver3)} of a field of view flashing over 3 times a second`);
    if (Number(m.perSecond) > limit.flashes) problems.push(`${m.perSecond} flashes/s`);
    if (Number(m.quarterPerSecond) > limit.flashes) problems.push(`${m.quarterPerSecond} flashes/s in a quarter`);
    if (Number(m.sliverShare) > 0.0005) problems.push(`${(Number(m.sliverShare) * 100).toFixed(3)}% of pixels over ${limit.sliver}`);
    if (Number(m.overShare) > 0.03) problems.push(`${(Number(m.overShare) * 100).toFixed(1)}% over the lift`);
    // Off lights nothing but its bolt and glow, and those fill more of the screen close in.
    if (r.setting === 'off' && Number(m.meanLift) > ((r.zoom ?? 44) > 64 ? 0.01 : 0.003)) problems.push(`picture lifted ${Number(m.meanLift).toFixed(4)}`);
    if (Number(m.govPerSecond) > 2 || Number(m.govPerTen) > 2 || Number(m.govGap) < 0.6) problems.push('the governor let too many through');
    failed += problems.length ? 1 : 0;
    results.push({ ...r, ...m, problems });
    console.log(`${problems.length ? 'FAIL' : 'pass'}  ${r.name.padEnd(38)} flashes/s ${m.perSecond} quarter ${m.quarterPerSecond} per10s ${m.perTen}  area>3/s ${pct(m.areaOver3)}  lift ${fix(m.worstPixel)} mean ${fix(m.meanLift)} over ${pct(m.overShare)}  rises ${m.rises}${problems.length ? '  ' + problems.join('; ') : ''}`);
  }
} finally { await browser.close(); }
await writeFile(out, JSON.stringify(results, null, 1));
console.log(failed ? `${failed} failed` : 'all passed', `(${results.length} runs)`);
process.exitCode = failed ? 1 : 0;

function pct(v: unknown) { return `${(Number(v) * 100).toFixed(2)}%`; }
function fix(v: unknown) { return Number(v).toFixed(3); }

/**
 * What the published tests look at, from the brightness of each small cell of the picture at each frame. Flashes are found in
 * each cell on its own, and only then added up: averaging first would hide patches flashing out of step with each other.
 * areaOver3 is the most of any field of view (a third of the screen each way: about 10 degrees, as WCAG's 341x256 at
 * 1024x768) that flashes more than three times within one second, the same second for all of it. Also here are the counts
 * for the whole picture and any quarter, to tell how it reads.
 */
function analyse(cells: Float32Array[], times: number[], CW: number, CH: number) {
  const C = CW * CH;
  // Rises and falls of 0.10 or more (the darker side under 0.80), timed from where the change began, paired without reuse.
  const flashes = (v: Float64Array) => {
    const moves: number[] = [];
    let lo = v[0], hi = v[0], loAt = 0, hiAt = 0, dir = 0;
    for (let j = 1; j < v.length; j++) {
      const c = v[j];
      // Equal counts: after a flat stretch a change begins at its end, not at its start.
      if (c <= lo) { lo = c; loAt = j; }
      if (c >= hi) { hi = c; hiAt = j; }
      if (dir <= 0 && c - lo >= 0.1 && lo < 0.8) { moves.push(times[loAt]); dir = 1; hi = lo = c; hiAt = loAt = j; }
      else if (dir >= 0 && hi - c >= 0.1 && c < 0.8) { moves.push(times[hiAt]); dir = -1; lo = hi = c; hiAt = loAt = j; }
    }
    const out: number[] = [];
    for (let j = 0; j + 1 < moves.length; j += 2) out.push(moves[j]);
    return out;
  };
  const inWindow = (at: number[], s: number) => { let most = 0; for (let a = 0; a < at.length; a++) { let n = 0; for (let b = a; b < at.length && at[b] - at[a] <= s; b++) n++; most = Math.max(most, n); } return most; };
  const series = (pick: (c: Float32Array) => number) => { const v = new Float64Array(cells.length); cells.forEach((c, j) => { v[j] = pick(c); }); return v; };
  const mean = (c: Float32Array, x0: number, y0: number, x1: number, y1: number) => { let s = 0, n = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { s += c[y * CW + x]; n++; } return s / n; };

  const whole = flashes(series((c) => mean(c, 0, 0, CW, CH)));
  let quarterPerSecond = 0;
  const qw = Math.ceil(CW / 2), qh = Math.ceil(CH / 2);
  for (let y = 0; y + qh <= CH; y += Math.max(1, Math.floor(qh / 2))) for (let x = 0; x + qw <= CW; x += Math.max(1, Math.floor(qw / 2))) {
    quarterPerSecond = Math.max(quarterPerSecond, inWindow(flashes(series((c) => mean(c, x, y, x + qw, y + qh))), 1));
  }
  // Each cell's flashes; then, one second at a time, how much of any field of view is over three.
  const local: number[][] = [];
  let localPerSecond = 0;
  for (let c = 0; c < C; c++) { const at = flashes(series((f) => f[c])); local.push(at); localPerSecond = Math.max(localPerSecond, inWindow(at, 1)); }
  const fw = Math.max(1, Math.round(CW / 3)), fh = Math.max(1, Math.round(CH / 3));
  let areaOver3 = 0;
  for (const start of local.flat().sort((a, b) => a - b).filter((t, j, all) => t !== all[j - 1])) {
    const sum = new Int32Array((CW + 1) * (CH + 1));
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
      const over = local[y * CW + x].filter((t) => t >= start && t <= start + 1).length > 3 ? 1 : 0;
      sum[(y + 1) * (CW + 1) + x + 1] = over + sum[y * (CW + 1) + x + 1] + sum[(y + 1) * (CW + 1) + x] - sum[y * (CW + 1) + x];
    }
    for (let y = 0; y + fh <= CH; y++) for (let x = 0; x + fw <= CW; x++) {
      const n = sum[(y + fh) * (CW + 1) + x + fw] - sum[y * (CW + 1) + x + fw] - sum[(y + fh) * (CW + 1) + x] + sum[y * (CW + 1) + x];
      areaOver3 = Math.max(areaOver3, n / (fw * fh));
    }
  }
  return { perSecond: inWindow(whole, 1), perFive: inWindow(whole, 5), perTen: inWindow(whole, 10), quarterPerSecond, localPerSecond, areaOver3 };
}

/** The test has to be able to fail: patches out of step flashing 5 times a second, a burst after a quiet start, and a thin sliver that must pass. */
function selfTest() {
  const CW = 30, CH = 30, frames = 90, times = Array.from({ length: frames }, (_, i) => i / 30);
  const make = (patch: (x: number, y: number) => boolean) => Array.from({ length: frames }, (_, f) => {
    const c = new Float32Array(CW * CH).fill(0.2);
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
      // Half the patches on, half off, swapped every 3 frames: the average never moves.
      if (patch(x, y)) c[y * CW + x] = ((Math.floor(f / 3) + x + y) % 2) ? 0.4 : 0.2;
    }
    return c;
  });
  const scattered = analyse(make((x, y) => (x + y) % 5 < 2), times, CW, CH), sliver = analyse(make((x) => x === 3), times, CW, CH);
  // Scattered patches, still until 1.5 s, then four flashes in 0.6 s: each has to be dated when it happens.
  const burst = analyse(Array.from({ length: frames }, (_, f) => {
    const c = new Float32Array(CW * CH).fill(0.2), on = [1.5, 1.7, 1.9, 2.1].some((s) => f / 30 >= s - 1e-6 && f / 30 < s + 0.07);
    for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (on && (x + y) % 5 < 2) c[y * CW + x] = 0.4;
    return c;
  }), times, CW, CH);
  if (scattered.perSecond !== 0 || scattered.areaOver3 <= 0.25 || sliver.areaOver3 > 0.25 || burst.localPerSecond !== 4 || burst.areaOver3 <= 0.25) throw new Error(`flash.ts's self-test failed: ${JSON.stringify({ scattered, sliver, burst })}`);
}

/** In the page: a switch to draw a frame with no lightning, and a log of what the governor admits. */
function install() {
  const w = window as any, l = w.__renderer.lightning;
  w.__admitted = [];
  const admit = l.governor.admit.bind(l.governor);
  l.governor.admit = (now: number) => { const ok = admit(now); if (ok) w.__admitted.push(now); return ok; };
  const update = l.update.bind(l);
  l.update = (...a: unknown[]) => {
    update(...a);
    if (w.__dark) { l.post.uFlashOn.value = 0; l.level = 0; l.boltMesh.visible = false; l.boltsLive = false; }
  };
}

/** In the page: one run. */
async function measure(run: Run & { limit: number; sliver: number }) {
  const w = window as any, r = w.__renderer, l = r.lightning;
  const canvas = document.querySelector('canvas') as HTMLCanvasElement, gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
  const W = canvas.width, H = canvas.height, N = W * H;
  const LIN = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const s = i / 255; LIN[i] = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }
  const bytes = new Uint8Array(N * 4);
  const read = (into: Float32Array) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    for (let i = 0, p = 0; i < N; i++, p += 4) into[i] = 0.2126 * LIN[bytes[p]] + 0.7152 * LIN[bytes[p + 1]] + 0.0722 * LIN[bytes[p + 2]];
  };

  // A fresh start: the clock jumps well past what came before, so nothing lingers.
  const base = (w.__base = (w.__base ?? 1000) + 100);
  w.__clock = base;
  l.clock = () => w.__clock;
  l.setting = run.setting;
  l.looks = { flash: run.look ?? 'a', bolt: run.look ?? 'a', glow: run.look ?? 'a', far: run.look ?? 'a' };
  w.__admitted.length = 0;
  // The same piece of the world as at 1080p, so what share of the picture a bolt takes is the game's.
  r.view.zoom = (run.zoom ?? 44) * H / 1080;
  r.view.view = run.view ?? 0; r.view.update(0, true);

  const cellPx = Math.max(4, Math.round(H / 45)), CW = Math.floor(W / cellPx), CH = Math.floor(H / cellPx), C = CW * CH;
  const on = new Float32Array(N), off = new Float32Array(N), times: number[] = [], cells: Float32Array[] = [];
  const limit = run.limit;
  let worstPixel = 0, meanLift = 0, overShare = 0, sliverShare = 0;

  // The asked-for events, by frame.
  const events = (i: number, t: number, step: number) => {
    const at = (s: number) => t <= s && s < t + step;
    const strike = () => r.strike({ x: r.view.target.x + 4 * Math.sin(i * 1.7), z: r.view.target.z - 3 + 3 * Math.cos(i * 2.3), seed: 7 + i });
    if (run.plan === 'spam') { strike(); r.flicker({ bearing: i }); return; }
    if (run.plan === 'stall') { if (at(1)) strike(); if (at(1.1)) strike(); if (at(6)) strike(); return; }
    if (run.plan === 'swap') {
      for (const [s, setting] of [[1, 'full'], [3.5, 'gentle'], [6, 'off'], [8.5, 'full'], [10.5, 'off']] as const) {
        if (at(s)) { l.setting = setting; strike(); }
        // And changed again in the middle of each flash: as it rises, at its height, as it falls.
        if (at(s + 0.1)) l.setting = setting === 'off' ? 'full' : 'off';
        if (at(s + 0.25)) l.setting = setting;
      }
      return;
    }
    for (const s of [1.5, 4, 7, 9.5]) if (at(s)) strike();
    for (const s of [3, 6, 8]) if (at(s)) r.flicker({ bearing: s });
  };

  let t = 0, i = 0;
  while (t < run.seconds) {
    const step = 1 / run.fps + (run.jitter ? run.jitter * (Math.sin(i * 12.9898) * 43758.5453 % 1) ** 2 : 0);
    // A tab away and back: the clock jumps, no frames between.
    if (run.plan === 'stall' && t < 3 && t + step >= 3) t += 2.5;
    w.__clock = base + t;
    events(i, t, step);
    const look = { time: 5 + t, hour: run.hour };
    w.__dark = true; await w.__draw(undefined, look); read(off);
    w.__dark = false; await w.__draw(undefined, look); read(on);
    let sum = 0, over = 0, sliver = 0;
    const cell = new Float32Array(C);
    for (let y = 0, k = 0; y < H; y++) for (let x = 0; x < W; x++, k++) {
      const v = on[k], lift = v - off[k];
      sum += lift;
      if (lift > worstPixel) worstPixel = lift;
      if (lift > limit) over++;
      if (lift > run.sliver) sliver++;
      const cx = Math.floor(x / cellPx), cy = Math.floor(y / cellPx);
      if (cx < CW && cy < CH) cell[cy * CW + cx] += v;
    }
    const area = cellPx * cellPx;
    for (let c = 0; c < C; c++) cell[c] /= area;
    cells.push(cell);
    times.push(t);
    meanLift = Math.max(meanLift, sum / N);
    overShare = Math.max(overShare, over / N);
    sliverShare = Math.max(sliverShare, sliver / N);
    t += step; i++;
  }

  const flashing = (w.__analyse as typeof analyse)(cells, times, CW, CH);

  const adm = (w.__admitted as number[]).map((a) => a - base);
  const countIn = (at: number[], s: number) => { let most = 0; for (let a = 0; a < at.length; a++) { let n = 0; for (let b = a; b < at.length && at[b] - at[a] <= s; b++) n++; most = Math.max(most, n); } return most; };
  let govGap = Infinity;
  for (let j = 1; j < adm.length; j++) govGap = Math.min(govGap, adm[j] - adm[j - 1]);
  return {
    ...flashing, worstPixel, meanLift, overShare, sliverShare, rises: adm.length, govPerSecond: countIn(adm, 1), govPerTen: countIn(adm, 10),
    govGap: adm.length > 1 ? govGap : 1,
  };
}
