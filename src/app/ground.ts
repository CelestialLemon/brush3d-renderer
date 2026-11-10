import type { GroundMap } from '../renderer/ground';
import { noise2 } from '../scenes/builder';
import type { Stream } from '../scenes/kit';

// A stand-in for the game's ground (#14): the demo makes the map the game would send, of how deep the snow lies and how
// much frost there is, from a number or two the controls or the timeline set. The game owns the rule; the renderer only
// draws the map. Here, standing in for it, the snow lies a little deeper in some places than others (drifts the wind
// would leave, keyed to the land), on the water's grid (a metre a cell over the land).

/** The ground as the demo holds it: how deep the snow lies over the land (0..1), and how much frost (0..1). */
export interface GroundState { snow: number; frost: number }
export const BARE: GroundState = { snow: 0, frost: 0 };

export class DemoGround {
  /** How much deeper or shallower the snow lies in each cell than the land's average, about 0.75..1.25. */
  private readonly drift: Float32Array;
  private readonly grid: Stream['grid'];

  constructor(stream: Stream) {
    const { nx, nz, cell, x0, z0 } = (this.grid = stream.grid);
    this.drift = new Float32Array(nx * nz);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell;
      this.drift[j * nx + i] = 1 + 0.25 * noise2(x * 0.05 + 7, z * 0.05 - 3);
    }
  }

  /** The map the game would send for a state of the ground, or null when it's bare. */
  map(state: GroundState): GroundMap | null {
    if (state.snow <= 0 && state.frost <= 0) return null;
    const n = this.drift.length, snow = new Float32Array(n), frost = new Float32Array(n).fill(state.frost);
    for (let k = 0; k < n; k++) snow[k] = Math.min(1, state.snow * this.drift[k]);
    return { ...this.grid, snow, frost };
  }
}
