import type { GroundMap } from '../renderer/ground';
import { noise2 } from '../scenes/builder';
import type { Stream } from '../scenes/kit';

// A stand-in for the game's ground (#11): the demo makes the map the game would send, of how wet the land is and how
// muddy, from one number, how soaked the land is overall (-1 bone dry, 1 soaked; the timeline or the controls set it).
// The game owns the rule; the renderer only draws the map. Here, standing in for it:
// - not all of the land wets and dries alike: hollows and low ground soak first and dry last, rises and slopes the other
//   way round, a little patchy, so the land dries in patches rather than all at once;
// - tracks and bare soil turn to mud as they wet (the scene's bare ground, as for the dust).

/** The ground's grid: the water's (a metre a cell over the land). */
export class DemoGround {
  private readonly bare: Float32Array;
  /** How fast each cell dries, about 0.6 (a hollow) to 1.4 (a rise). */
  private readonly dries: Float32Array;
  private readonly grid: Stream['grid'];

  constructor(stream: Stream, height: (x: number, z: number) => number, bare: (x: number, z: number) => number) {
    const { nx, nz, cell, x0, z0 } = (this.grid = stream.grid), n = nx * nz;
    this.bare = new Float32Array(n); this.dries = new Float32Array(n);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell;
      this.bare[k] = bare(x, z);
      // Above or below the land round it, within 5 m.
      const h = height(x, z);
      let around = 0;
      for (let a = 0; a < 8; a++) around += height(x + 5 * Math.cos(a * 0.785), z + 5 * Math.sin(a * 0.785)) / 8;
      const rise = Math.max(-1, Math.min(1, (h - around) * 3));
      this.dries[k] = Math.max(0.6, Math.min(1.4, 1 + 0.3 * rise + 0.15 * noise2(x * 0.08, z * 0.08)));
    }
  }

  /** The map the game would send with the land this soaked overall (-1 bone dry .. 1 soaked). */
  map(soak: number): GroundMap {
    const n = this.bare.length, wet = new Float32Array(n), mud = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      // The surface wets at once and stays wet while the ground under it holds water: wet through by two fifths soaked
      // (the puddles come a little before), so they linger well after the rain and go in the last of the drying. The
      // quicker-drying ground needs more to look wet, so it dries first.
      const w = Math.max(0, Math.min(1, ((soak + 1) / 2) * 2.5 / this.dries[k]));
      wet[k] = w;
      mud[k] = this.bare[k] * smooth(0.35, 0.85, w);
    }
    return { ...this.grid, wet, mud };
  }
}

const smooth = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * How fast the land soaks and dries, in the units of `soak` a game hour: soaking at `wet` times how hard it rains, and
 * drying at `dry`, two fifths of that under full cloud (none of the sun's).
 */
export const SOAK = { wet: 3, dry: 0.65 };

/** How soaked the land is after `hours` of game time under this rain and cloud, from `soak`. */
export function soakStep(soak: number, rain: number, cloud: number, hours: number) {
  if (rain > 0) return Math.min(1, soak + SOAK.wet * rain * hours);
  return Math.max(-1, soak - SOAK.dry * (0.4 + 0.6 * (1 - cloud)) * hours);
}
