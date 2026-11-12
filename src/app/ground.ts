import type { GroundMap } from '../renderer/ground';
import { noise2 } from '../scenes/builder';
import type { Stream } from '../scenes/kit';

// A stand-in for the game's ground (#14, #11): the demo makes the map the game would send, of how deep the snow lies, how
// much frost there is, how wet the land is and how muddy, from a number or two the controls or the timeline set. The game
// owns the rules; the renderer only draws the map. Here, standing in for it, on the water's grid (a metre a cell):
// - the snow lies a little deeper in some places than others (drifts the wind would leave, keyed to the land);
// - not all of the land wets and dries alike: hollows and low ground stay wet longest and rises dry first, a little
//   patchy, so the land dries in patches rather than all at once;
// - tracks and bare soil turn to mud as they wet (the scene's bare ground, as for the dust), and dry back out of it.

/**
 * The ground as the demo holds it: how deep the snow lies over the land (0..1), how much frost (0..1), and how wet the
 * land is overall (0 dry .. 1 soaked: the wettest cells' value; the rest lag behind as they dry).
 */
export interface GroundState { snow: number; frost: number; wet: number }
export const BARE: GroundState = { snow: 0, frost: 0, wet: 0 };

export class DemoGround {
  /** How much deeper or shallower the snow lies in each cell than the land's average, about 0.75..1.25. */
  private readonly drift: Float32Array;
  /** How bare each cell is, 0..1 (the tracks, the yard), where wet earth turns to mud. */
  private readonly bare: Float32Array;
  /** How fast each cell dries, about 0.6 (a hollow) to 1.6 (a rise): its wet is the land's raised to this. */
  private readonly dries: Float32Array;
  private readonly grid: Stream['grid'];

  constructor(stream: Stream, height: (x: number, z: number) => number, bare: (x: number, z: number) => number) {
    const { nx, nz, cell, x0, z0 } = (this.grid = stream.grid), n = nx * nz;
    this.drift = new Float32Array(n); this.bare = new Float32Array(n); this.dries = new Float32Array(n);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell;
      this.drift[k] = 1 + 0.25 * noise2(x * 0.05 + 7, z * 0.05 - 3);
      // A cell with bare ground in it is bare (a track's tile, as the game marks it): its ruts are narrower than a cell.
      let most = 0;
      for (let a = -1; a <= 1; a++) for (let c = -1; c <= 1; c++) most = Math.max(most, bare(x + a * cell / 3, z + c * cell / 3));
      this.bare[k] = most;
      // Above or below the land round it, within 5 m.
      const h = height(x, z);
      let around = 0;
      for (let a = 0; a < 8; a++) around += height(x + 5 * Math.cos(a * 0.785), z + 5 * Math.sin(a * 0.785)) / 8;
      const rise = Math.max(-1, Math.min(1, (h - around) * 3));
      this.dries[k] = Math.max(0.6, Math.min(1.6, 1 + 0.4 * rise + 0.2 * noise2(x * 0.08, z * 0.08)));
    }
  }

  /** The map the game would send for a state of the ground, or null when it's bare and dry. */
  map(state: GroundState): GroundMap | null {
    if (state.snow <= 0 && state.frost <= 0 && state.wet <= 0) return null;
    const n = this.drift.length, snow = new Float32Array(n), frost = new Float32Array(n).fill(state.frost);
    const wet = new Float32Array(n), mud = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      snow[k] = Math.min(1, state.snow * this.drift[k]);
      if (state.wet <= 0) continue;
      // Soaked everywhere at 1; drying, the quicker-drying cells lag further behind.
      const w = state.wet ** this.dries[k];
      wet[k] = w;
      mud[k] = this.bare[k] * smooth(0.25, 0.75, w);
    }
    return { ...this.grid, snow, frost, wet, mud };
  }
}

const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * How fast the land wets and dries, in its overall wet (0..1) a game hour: wetting at `wet` times how hard it rains, and
 * drying at `dry`, two fifths of that under full cloud (none of the sun's).
 */
export const SOAK = { wet: 1.5, dry: 0.33 };

/** How wet the land is after `hours` of game time under this rain and cloud, from `wet`. */
export function soakStep(wet: number, rain: number, cloud: number, hours: number) {
  if (rain > 0) return Math.min(1, wet + SOAK.wet * rain * hours);
  return Math.max(0, wet - SOAK.dry * (0.4 + 0.6 * (1 - cloud)) * hours);
}
