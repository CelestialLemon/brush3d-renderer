import { WindSim, type WindGoal, type WindGrid, type Obstacle, type WindSave } from './sim.ts';

// Runs the living wind off the main thread (#36): a worker the game (or the demo, standing in for it) talks to through
// WindWorker (client.ts). Messages are taken in order, so a goal sent before a step applies from that step: the same
// messages give the same wind.

export type WindRequest =
  | { type: 'init'; grid: WindGrid; obstacles: Obstacle[]; goal: WindGoal }
  | { type: 'goal'; goal: WindGoal }
  | { type: 'step'; ticks: number }
  | { type: 'save' }
  | { type: 'restore'; save: WindSave };

let sim: WindSim | null = null;
self.onmessage = (e: MessageEvent<WindRequest>) => {
  const m = e.data;
  if (m.type === 'init') {
    sim = new WindSim(m.grid, m.obstacles, m.goal);
    self.postMessage({ type: 'obstacles', ...sim.obstacles() });
    send(0);
    return;
  }
  if (!sim) return;
  if (m.type === 'goal') sim.setGoal(m.goal);
  else if (m.type === 'step') {
    const t0 = performance.now();
    for (let i = 0; i < m.ticks; i++) sim.step();
    send((performance.now() - t0) / m.ticks);
  } else if (m.type === 'save') self.postMessage({ type: 'save', save: sim.save() });
  else if (m.type === 'restore') { sim.restore(m.save); send(0); }
};

/** The wind now, its arrays handed over rather than copied. `ms`: how long a tick took to step. */
function send(ms: number) {
  const snap = sim!.snapshot();
  self.postMessage({ type: 'snapshot', snap, ms, safetyHits: sim!.safetyHits },
    { transfer: [snap.u.buffer, snap.v.buffer, snap.k.buffer, snap.fu.buffer, snap.fv.buffer] });
}
