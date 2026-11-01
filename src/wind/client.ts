import { TICK, windBetween, type Obstacle, type WindGoal, type WindGrid, type WindSave, type WindSnapshot } from './sim.ts';
import type { WindReply, WindRequest } from './host.ts';

// The game's side of the wind worker (#36): it keeps the game's clock for the wind, asks the worker for a tick every
// TICK seconds of game time (none while paused), and keeps the last two ticks' snapshots, so anything between ticks
// (a frame, a query) blends them by how far the clock is past the later one's start.
//
// Everything the game asks is queued in its order against the ticks: a goal set after the clock reached tick n applies
// from tick n + 1 however fast the worker is, so a replay of the same calls gives the same wind. The worker is sent a
// few ticks at a time, so a slow machine catches up without a long stall, and replies with every tick.

/** Anything the worker can take: postMessage and onmessage (a Worker, or a stand-in for one). */
export interface WindPort {
  postMessage(m: WindRequest): void;
  onmessage: ((e: MessageEvent<WindReply>) => void) | null;
  terminate?(): void;
}

interface Pending { resolve(s: WindSave): void; reject(e: Error): void }
type Queued = { ticks: number } | { goal: WindGoal } | { save: Pending } | { restore: WindSave };

/** How near a whole tick the clock may fall short and still count it (so 60 frames of 1/60 s are 10 ticks). */
const ROUNDING = 1e-6;

export class WindWorker {
  /** The last two ticks' wind, earlier first (the same until the second arrives). */
  prev: WindSnapshot | null = null;
  cur: WindSnapshot | null = null;
  /** How long the worker took to step a tick, milliseconds (the latest). */
  stepMs = 0;
  safetyHits = 0;
  /** The obstacles as the wind sees them, cell by cell: solid (1 or 0) and drag per second (for drawing). */
  obstacles: { solid: Float32Array; drag: Float32Array } | null = null;
  private readonly queue: Queued[] = [];
  /** Snapshots asked for and not yet in (the first comes from init). */
  private inFlight = 1;
  /** Game time past the last tick due, in ticks. */
  private clock = 0;
  private readonly saves: Pending[] = [];
  private disposed = false;
  private readonly listeners: ((snap: WindSnapshot) => void)[] = [];

  private readonly worker: WindPort;

  /** `worker` runs worker.ts (made by the caller, as its bundler wants). */
  constructor(worker: WindPort, grid: WindGrid, obstacles: Obstacle[], goal: WindGoal) {
    this.worker = worker;
    worker.onmessage = (e) => this.receive(e.data);
    worker.postMessage({ type: 'init', grid, obstacles, goal });
  }

  private receive(m: WindReply) {
    if (m.type === 'obstacles') { this.obstacles = { solid: m.solid, drag: m.drag }; return; }
    if (m.type === 'save') { this.saves.shift()?.resolve(m.save); return; }
    this.prev = m.restored ? m.snap : this.cur ?? m.snap; this.cur = m.snap;
    if (m.ms) this.stepMs = m.ms;
    this.safetyHits = m.safetyHits;
    this.inFlight--;
    for (const f of this.listeners) f(m.snap);
    this.pump();
  }

  /** What the game asks of the wind; it applies from the next tick due. */
  setGoal(goal: WindGoal) { this.queue.push({ goal: structuredClone(goal) }); this.pump(); }

  /** Runs the wind's clock on by `seconds` of game time. */
  advance(seconds: number) {
    this.clock += seconds / TICK;
    const whole = Math.floor(this.clock + ROUNDING);
    if (whole > 0) {
      this.clock = Math.max(0, this.clock - whole);
      const last = this.queue[this.queue.length - 1];
      if (last && 'ticks' in last) last.ticks += whole; else this.queue.push({ ticks: whole });
    }
    this.pump();
  }

  /** The wind's state, as of every tick due so far (resolved once the worker has stepped them). */
  save(): Promise<WindSave> {
    if (this.disposed) return Promise.reject(new Error('The wind is disposed'));
    return new Promise((resolve, reject) => { this.queue.push({ save: { resolve, reject } }); this.pump(); });
  }

  /**
   * Puts the wind back to a save (copied as it is now); the clock starts again from it. Ticks not yet stepped are dropped,
   * except those a save asked for earlier needs.
   */
  restore(save: WindSave) {
    for (let i = this.queue.length - 1; i >= 0 && !('save' in this.queue[i]); i--) if ('ticks' in this.queue[i]) this.queue.splice(i, 1);
    this.clock = 0;
    this.queue.push({ restore: structuredClone(save) });
    this.pump();
  }

  /** How far the clock is past the latest tick, 0..1, while the worker keeps up (1 while it's behind). */
  get alpha() { return this.inFlight > 0 || this.queue.some((q) => 'ticks' in q) ? 1 : Math.min(1, this.clock); }

  /** Called with every tick's snapshot, in order (and after a restore). */
  onTick(f: (snap: WindSnapshot) => void) { this.listeners.push(f); }

  /** The wind at a point and height, between the last two ticks (see windAt). */
  at(x: number, z: number, height = 0): [number, number] {
    if (!this.prev || !this.cur) return [0, 0];
    return windBetween(this.prev, this.cur, this.alpha, x, z, height);
  }

  /** Sends what's queued, in order, until it's waiting on ticks: at most 4 at a time. */
  private pump() {
    while (!this.disposed && this.inFlight === 0 && this.queue.length) {
      const q = this.queue[0];
      if ('goal' in q) { this.queue.shift(); this.worker.postMessage({ type: 'goal', goal: q.goal }); }
      else if ('save' in q) { this.queue.shift(); this.saves.push(q.save); this.worker.postMessage({ type: 'save' }); }
      else if ('restore' in q) { this.queue.shift(); this.inFlight = 1; this.worker.postMessage({ type: 'restore', save: q.restore }); }
      else {
        const n = Math.min(q.ticks, 4);
        q.ticks -= n;
        if (!q.ticks) this.queue.shift();
        this.inFlight = n;
        this.worker.postMessage({ type: 'step', ticks: n });
      }
    }
  }

  /** Stops the worker; saves not yet made are rejected. */
  dispose() {
    this.disposed = true;
    this.worker.terminate?.();
    const error = new Error('The wind is disposed');
    for (const q of this.queue) if ('save' in q) q.save.reject(error);
    for (const p of this.saves) p.reject(error);
    this.queue.length = 0; this.saves.length = 0;
  }
}
