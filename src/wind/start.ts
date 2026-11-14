import { WindWorker } from './client';
import type { Obstacle, WindGoal, WindGrid, WindOptions } from './sim';

/**
 * The living wind in a worker of its own (WindWorker, docs/WIND.md), made here so its user never names the worker's file:
 * the bundler (Vite) finds it from this call.
 */
export function startWind(grid: WindGrid, obstacles: Obstacle[], goal: WindGoal, options: WindOptions = {}): WindWorker {
  return new WindWorker(new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }), grid, obstacles, goal, options);
}
