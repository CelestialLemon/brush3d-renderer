import { WindSim, type WindGoal, type WindGrid, type Obstacle, type WindOptions, type WindSave, type WindSnapshot } from './sim.ts';

// What the wind's worker does with each message (#36), apart from the worker itself so it can be run without one (the
// checks in tools/wind.ts do). Messages are taken in order: the same messages give the same wind.

export type WindRequest =
  | { type: 'init'; grid: WindGrid; obstacles: Obstacle[]; goal: WindGoal; options?: WindOptions }
  | { type: 'goal'; goal: WindGoal }
  | { type: 'step'; ticks: number }
  | { type: 'save' }
  | { type: 'restore'; save: WindSave };

export type WindReply =
  | { type: 'obstacles'; solid: Float32Array; drag: Float32Array }
  /** One per tick stepped (and one after init and restore, `restored` after a restore). `ms`: how long it took. */
  | { type: 'snapshot'; snap: WindSnapshot; ms: number; safetyHits: number; restored?: boolean }
  | { type: 'save'; save: WindSave };

/** A handler for the requests, replying through `post` (with the arrays to hand over rather than copy). */
export function windHost(post: (reply: WindReply, transfer: Transferable[]) => void) {
  let sim: WindSim | null = null;
  const send = (ms: number, restored = false) => {
    const snap = sim!.snapshot();
    post({ type: 'snapshot', snap, ms, safetyHits: sim!.safetyHits, ...(restored ? { restored } : {}) },
      [snap.u.buffer, snap.v.buffer, snap.k.buffer, snap.fu.buffer, snap.fv.buffer]);
  };
  return (m: WindRequest) => {
    if (m.type === 'init') {
      sim = new WindSim(m.grid, m.obstacles, m.goal, m.options);
      const o = sim.obstacles();
      post({ type: 'obstacles', ...o }, [o.solid.buffer, o.drag.buffer]);
      send(0);
      return;
    }
    if (!sim) return;
    if (m.type === 'goal') sim.setGoal(m.goal);
    else if (m.type === 'step') {
      for (let i = 0; i < m.ticks; i++) {
        const t0 = performance.now();
        sim.step();
        send(performance.now() - t0);
      }
    } else if (m.type === 'save') post({ type: 'save', save: sim.save() }, []);
    else if (m.type === 'restore') { sim.restore(m.save); send(0, true); }
  };
}
