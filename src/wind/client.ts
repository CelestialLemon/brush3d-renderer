import { TICK, windBetween, type Obstacle, type WindGoal, type WindGrid, type WindSnapshot } from './sim.ts';
import type { WindRequest } from './worker.ts';

// The game's side of the wind worker (#36): it keeps the game's clock for the wind, asks the worker for a tick every
// TICK seconds of game time (none while paused), and keeps the last two ticks' snapshots, so anything between ticks
// (a frame, a query) blends them by how far the clock is past the earlier one.

export class WindWorker {
  /** The last two ticks' wind, earlier first (the same until the second arrives). */
  prev: WindSnapshot | null = null;
  cur: WindSnapshot | null = null;
  /** How long the worker took to step a tick, milliseconds (the latest). */
  stepMs = 0;
  safetyHits = 0;
  /** The obstacles as the wind sees them, cell by cell: solid (1 or 0) and drag per second (for drawing). */
  obstacles: { solid: Float32Array; drag: Float32Array } | null = null;
  private owed = 0;
  private busy = true;
  private clock = 0;
  private readonly listeners: ((snap: WindSnapshot) => void)[] = [];

  /** `worker` runs worker.ts (made by the caller, as its bundler wants). */
  constructor(private readonly worker: Worker, grid: WindGrid, obstacles: Obstacle[], goal: WindGoal) {
    worker.onmessage = (e) => {
      if (e.data.type === 'obstacles') this.obstacles = { solid: e.data.solid, drag: e.data.drag };
      if (e.data.type !== 'snapshot') return;
      this.prev = this.cur ?? e.data.snap; this.cur = e.data.snap;
      if (e.data.ms) this.stepMs = e.data.ms;
      this.safetyHits = e.data.safetyHits;
      this.busy = false;
      for (const f of this.listeners) f(this.cur!);
      this.pump();
    };
    this.post({ type: 'init', grid, obstacles, goal });
  }

  private post(m: WindRequest) { this.worker.postMessage(m); }

  /** What the game asks of the wind; it applies from the next tick. */
  setGoal(goal: WindGoal) { this.post({ type: 'goal', goal }); }

  /** Runs the wind's clock on by `seconds` of game time. */
  advance(seconds: number) {
    this.clock += seconds;
    while (this.clock >= TICK) { this.clock -= TICK; this.owed++; }
    this.pump();
  }

  /** How far the clock is past the latest tick, 0..1, while the worker keeps up. */
  get alpha() { return this.owed > 0 || this.busy ? 1 : Math.min(1, this.clock / TICK); }

  /** Called with each new tick's snapshot. */
  onTick(f: (snap: WindSnapshot) => void) { this.listeners.push(f); }

  /** The wind at a point and height, between the last two ticks (see windAt). */
  at(x: number, z: number, height = 0): [number, number] {
    if (!this.prev || !this.cur) return [0, 0];
    return windBetween(this.prev, this.cur, this.alpha, x, z, height);
  }

  /** Asks for the ticks owed, a few at a time, so a slow machine catches up without a long stall. */
  private pump() {
    if (this.busy || this.owed === 0) return;
    const n = Math.min(this.owed, 4);
    this.owed -= n; this.busy = true;
    this.post({ type: 'step', ticks: n });
  }

  dispose() { this.worker.terminate(); }
}
