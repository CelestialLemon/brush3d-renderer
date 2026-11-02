// Checks the living wind (src/wind, #36): the game steps it, reads it and saves it, so it must be repeatable, keep the
// game's average, and shelter what it should. Runs the engine in Node, no browser.
//   npm run test:wind
//
// 1. Replay: the same obstacles and goals (with a turn and a change of rhythm) give the same wind, bit for bit.
// 2. Save and restore: a restored wind carries on bit for bit as the one it was saved from.
// 3. Steady: gustiness 0 in open air settles to the goal everywhere, and stays there.
// 4. The average: in open air the ground wind averages to the game's speed (Sol's calibration of the gusts, #36), for the
//    rhythm's ends and middle at 6 m/s, and at a light wind, a strong one and a hurricane.
// 5. Shelter: behind a single dense hedge, 2.5 m tall, across a steady 6 m/s wind, the wind is cut and comes back over
//    about 25 hedge heights (docs/WIND.md has the curve and why).
// 6. The game's side (client.ts), with stand-ins for the worker, a quick one and a slow one: the same calls give the
//    same wind and every tick in order, at any frame rate and however far behind the worker falls; saves, restores and
//    goals queued behind ticks come out as asked.
// 7. Storms: the strongest wind taken, full rare gusts, across the grid's diagonal, stays sane.
// 8. Speed: a tick of the farm at 1 m, in a breeze and in a hurricane, the cost the game pays in its worker (reported,
//    and failed only if far too slow, or if the air hit its safety bounds).
// Exits with 1 if any of them is off by more than its tolerance.
import { DRAG, TICK, WindSim, windAt, type Obstacle, type WindGoal, type WindGrid, type WindSnapshot } from '../src/wind/sim.ts';
import { WindWorker, type WindPort } from '../src/wind/client.ts';
import { windHost, type WindReply } from '../src/wind/host.ts';

let failed = false;
function check(name: string, ok: boolean, detail: string) {
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${detail}`);
}
const GRID: WindGrid = { nx: 200, nz: 200, cell: 1, x0: -100, z0: -100 };
const same = (a: Float32Array, b: Float32Array) => a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
const identical = (a: WindSnapshot, b: WindSnapshot) =>
  a.tick === b.tick && same(a.u, b.u) && same(a.v, b.v) && same(a.k, b.k) && same(a.fu, b.fu) && same(a.fv, b.fv);
const run = (sim: WindSim, seconds: number) => { for (let i = 0; i < Math.round(seconds / TICK); i++) sim.step(); };

// The farm's obstacles, near enough: a shed, a wall, two hedges, an orchard row and some trees.
const FARM: Obstacle[] = [
  { box: { x: 6, z: -4, hx: 2.3, hz: 1.6, turn: 0.4 }, solid: true, height: 3 },
  { strip: { ax: -20, az: 10, bx: 15, bz: 14, width: 0.6 }, solid: true, height: 0.6 },
  { strip: { ax: -30, az: -20, bx: -30, bz: 20, width: 1.8 }, drag: DRAG.hedge },
  { strip: { ax: 20, az: 20, bx: 45, bz: 30, width: 1.8 }, drag: DRAG.hedge },
  { strip: { ax: -10, az: -30, bx: 25, bz: -30, width: 1.3 }, drag: DRAG.crown },
  ...[-40, -15, 35, 50].map((x, i): Obstacle => ({ circle: { x, z: 40 - i * 20, radius: 3 }, drag: DRAG.crown / 2 })),
];
const GUSTY: WindGoal = { speed: 6, direction: 0.55, gustiness: 0.8, rhythm: 0.5 };

// 1. Replay.
console.log('Replay and saves (the farm, gusty, with a turn)');
{
  const script = (sim: WindSim, from: number, to: number) => {
    for (let t = from; t < to; t++) {
      if (t === 100) sim.setGoal({ ...GUSTY, direction: 1.4 });
      if (t === 180) sim.setGoal({ ...GUSTY, direction: 1.4, speed: 11, rhythm: 0.2 });
      sim.step();
    }
  };
  const a = new WindSim(GRID, FARM, GUSTY), b = new WindSim(GRID, FARM, GUSTY);
  script(a, 0, 260); script(b, 0, 260);
  check('the same goals replay the same wind', identical(a.snapshot(), b.snapshot()), `after ${260 * TICK} s, through a turn`);

  // 2. Save at 150 ticks (between the turn and the change), carry on, and restore into a fresh wind.
  const c = new WindSim(GRID, FARM, GUSTY);
  script(c, 0, 150);
  const save = structuredClone(c.save()), atSave = c.snapshot();
  script(c, 150, 260);
  const d = new WindSim(GRID, FARM, { speed: 2, direction: 3 });
  d.restore(save);
  check('a restored wind is the saved one', identical(d.snapshot(), atSave), `${(save.air.byteLength / 1024).toFixed(0)} KB of air`);
  script(d, 150, 260);
  check('a restored wind carries on the same', identical(d.snapshot(), c.snapshot()) && identical(c.snapshot(), a.snapshot()),
    `${110 * TICK} s on, through a change of speed and rhythm`);
}

/**
 * The ground wind's speed in open air, its mean over the middle of a field 120 m along the wind and 40 across, and over
 * time, after a warm-up. Gusts are a random sequence, so a short stretch can be well off the average; five minutes take
 * in a couple of gusty and quiet spells (Sol's calibration ran an hour a setting: docs/WIND.md).
 */
function openMean(goal: WindGoal, warm = 60, seconds = 300) {
  const grid = { nx: 120, nz: 40, cell: 1, x0: -60, z0: -20 };
  const sim = new WindSim(grid, [], { ...goal, direction: 0 });
  run(sim, warm);
  let sum = 0, n = 0, low = Infinity, high = 0;
  for (let t = 0; t < Math.round(seconds / TICK); t++) {
    sim.step();
    const s = sim.snapshot();
    for (let j = 4; j < 36; j += 2) for (let i = 30; i < 90; i += 2) {
      const k = j * grid.nx + i, v = Math.hypot(s.u[k], s.v[k]);
      sum += v; n++; low = Math.min(low, v); high = Math.max(high, v);
    }
  }
  return { mean: sum / n, low, high };
}

// 3. Steady.
console.log('Steady and the average (open air)');
{
  const m = openMean({ speed: 6, direction: 0.55, gustiness: 0 }, 30, 5);
  check('gustiness 0 is steady at the goal', m.high - m.low < 0.02 && Math.abs(m.mean - 6) < 0.05,
    `${m.low.toFixed(3)} to ${m.high.toFixed(3)} m/s, mean ${m.mean.toFixed(3)} (goal 6)`);
}

// 4. The average: within 2% over these five minutes (the calibration holds it within 0.2% over half an hour: docs/WIND.md),
// at the rhythm's ends and middle, and from a light wind to a hurricane.
for (const goal of [
  { speed: 6, direction: 0.55, gustiness: 0.5, rhythm: 0.5 },
  { speed: 6, direction: 0.55, gustiness: 1, rhythm: 0 },
  { speed: 6, direction: 0.55, gustiness: 1, rhythm: 1 },
  { speed: 2, direction: 2, gustiness: 0.5, rhythm: 0.5 },
  { speed: 14, direction: -1, gustiness: 0.5, rhythm: 0.5 },
  { speed: 35, direction: 0.8, gustiness: 1, rhythm: 0.5 },
] as WindGoal[]) {
  const m = openMean(goal), off = m.mean / goal.speed - 1;
  check(`the average at ${goal.speed} m/s, gusts ${goal.gustiness}, rhythm ${goal.rhythm}`, Math.abs(off) <= 0.02,
    `${m.mean.toFixed(3)} m/s (${(100 * off).toFixed(1)}%, at most 2%), from ${m.low.toFixed(1)} to ${m.high.toFixed(1)}`);
}

// 5. Shelter behind a hedge: Sol's single hedge (round 6), the ground wind at hedge heights H downwind, over the goal.
console.log('Shelter (a single dense hedge, 2.5 m, across a steady 6 m/s)');
{
  const H = 2.5, x0 = -36;
  const sim = new WindSim(GRID, [{ strip: { ax: x0, az: -45, bx: x0, bz: 45, width: 1.8 }, drag: DRAG.hedge }], { speed: 6, direction: 0, gustiness: 0 });
  run(sim, 100);
  const s = sim.snapshot(), at = (h: number) => windAt(s, x0 + h * H, 0)[0] / 6;
  const curve = [1, 4, 10, 25].map((h) => [h, at(h)]);
  console.log(`     ${curve.map(([h, r]) => `${h} H ${r.toFixed(2)}`).join(', ')} (round 6: 0.34, 0.41, 0.62, 0.89)`);
  // Each within 0.05 of round 6's, and the wind coming back: rising from 4 H on.
  const want = [0.34, 0.41, 0.62, 0.89];
  check('shelter behind the hedge', curve.every(([, r], i) => Math.abs(r - want[i]) < 0.05) && curve[1][1] < curve[2][1] && curve[2][1] < curve[3][1],
    'each within 0.05 of round 6\'s, coming back downwind');
  check('no safety hits', sim.safetyHits === 0, `${sim.safetyHits}`);
}

// 6. The game's side.
console.log('The game\'s side (a quick worker and a slow one)');
{
  const small: WindGrid = { nx: 60, nz: 60, cell: 1, x0: -30, z0: -30 };
  /** A stand-in worker: the host run on the same thread, each message and reply after `delay` ms (0: at once). */
  const port = (delay: number): WindPort => {
    const later = (f: () => void) => (delay ? setTimeout(f, delay) : queueMicrotask(f));
    const p: WindPort = { onmessage: null, postMessage: (m) => later(() => handle(structuredClone(m))) };
    const handle = windHost((reply) => later(() => p.onmessage!({ data: reply } as MessageEvent<WindReply>)));
    return p;
  };
  const play = async (delay: number, fps: number) => {
    const wind = new WindWorker(port(delay), small, FARM.slice(0, 3), GUSTY), ticks: number[] = [];
    let first: WindSnapshot | null = null, consecutive = true;
    wind.onTick((snap) => { first ??= snap; ticks.push(snap.tick); });
    // Two seconds of frames, a goal set after 0.8 s (on the eighth tick: 48 frames of 1/60 s must count 8 ticks).
    for (let f = 0; f < 2 * fps; f++) {
      if (f === Math.round(0.8 * fps)) wind.setGoal({ ...GUSTY, direction: 2.5, speed: 9 });
      wind.advance(1 / fps);
      if (wind.prev && wind.cur && wind.cur.tick - wind.prev.tick > 1) consecutive = false;
      await new Promise((r) => setTimeout(r, 1));
    }
    while (wind.cur!.tick < 20) await new Promise((r) => setTimeout(r, 5));
    return { snap: wind.cur!, ticks, first: first!, consecutive };
  };
  const quick = await play(0, 10), slow = await play(8, 60), quick60 = await play(0, 60);
  check('the same calls give the same wind, quick or slow, at 10 or 60 frames a second',
    identical(quick.snap, slow.snap) && identical(quick.snap, quick60.snap), `tick ${quick.snap.tick}, a goal set on a tick`);
  const all = (t: number[]) => t.length === 21 && t.every((x, i) => x === i);
  check('every tick reaches the game, in order', all(quick.ticks) && all(slow.ticks) && all(quick60.ticks),
    `the slow worker's: ${slow.ticks.join(' ')}`);
  check('the two snapshots blended are consecutive ticks', slow.consecutive && quick60.consecutive, 'while the slow worker catches up');
  // Saves, restores and goals queued behind ticks the worker hasn't stepped yet.
  const queued = async (delay: number) => {
    const wind = new WindWorker(port(delay), small, FARM.slice(0, 3), GUSTY);
    const start = await wind.save();
    const goal = { ...GUSTY, speed: 9 };
    wind.advance(0.5); wind.setGoal(goal); goal.speed = 20;
    wind.advance(0.5);
    const saved = wind.save();
    wind.restore(start); wind.advance(0.3);
    const at = (await saved).state;
    // Past the save, every tick before it is in: tick 3 now is the restored wind's.
    while (wind.cur!.tick !== 3) await new Promise((r) => setTimeout(r, 5));
    const late = wind.save();
    wind.dispose();
    const rejected = await late.then(() => false, () => true);
    return { tick: at.tick, speed: at.goal.speed, after: wind.cur!, rejected };
  };
  const [q, sl] = [await queued(0), await queued(8)];
  check('a save keeps the ticks before it, through a restore', q.tick === 10 && sl.tick === 10, `ticks ${q.tick} and ${sl.tick} (10 due)`);
  check('a goal is taken as it was set', q.speed === 9 && sl.speed === 9, `${q.speed} and ${sl.speed} m/s (set 9, then changed to 20)`);
  check('a restore carries on from the save', q.after.tick === 3 && identical(q.after, sl.after), `tick ${q.after.tick}`);
  check('disposing rejects a save not yet made', q.rejected && sl.rejected, '');
  const [mx] = windAt(quick.first, 0, 0, 8);
  check('the first snapshot has the free air above', mx !== 0, `${mx.toFixed(2)} m/s at 8 m, before any tick`);
}

// 7. Storms.
console.log('Storms (the strongest wind taken, full rare gusts, diagonal)');
{
  const sim = new WindSim(GRID, FARM, { speed: 60, direction: Math.PI / 4, gustiness: 1, rhythm: 0 });
  let sane = true, peak = 0, substeps = 0;
  for (let t = 0; t < 30 && sane; t++) {
    sim.step();
    substeps = Math.max(substeps, sim.substeps);
    const s = sim.snapshot();
    for (let k = 0; k < s.u.length; k++) { const v = Math.hypot(s.u[k], s.v[k]); if (!(v < 1000)) sane = false; peak = Math.max(peak, v); }
  }
  check('a 60 m/s storm stays sane', sane && sim.safetyHits === 0, `peak ${peak.toFixed(0)} m/s, up to ${substeps} substeps, ${sim.safetyHits} safety hits`);
}

// 8. Speed, in a breeze and in a hurricane (which takes more substeps: see sim.c).
console.log('Speed (the farm-like obstacles, 200 m at 1 m)');
for (const [name, goal, most] of [['a breeze', GUSTY, 40], ['a hurricane, full gusts', { ...GUSTY, speed: 35, gustiness: 1 }, 200]] as const) {
  const sim = new WindSim(GRID, FARM, goal);
  run(sim, 5);
  const t0 = performance.now(), n = 50;
  let substeps = 0;
  for (let i = 0; i < n; i++) { sim.step(); substeps = Math.max(substeps, sim.substeps); }
  const ms = (performance.now() - t0) / n;
  check(`a tick in ${name}`, ms < most && sim.safetyHits === 0,
    `${ms.toFixed(1)} ms, up to ${substeps} substeps (${(ms / TICK / 10).toFixed(0)}% of a core at 10 ticks a second)`);
}

process.exit(failed ? 1 : 0);
