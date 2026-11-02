import type { WaterMap } from '../renderer/water';
import type { Stream } from '../scenes/kit';

// A stand-in for the game's water (#18): the demo makes the map the game would send, from the scene's stream and a few
// numbers the timeline or the controls set. The rule is the game's (Soil-n-Silo's flood.ts): the water stands at the
// stream's surface plus the rise, and reaches every cell whose ground is lower than that and which it can get to over
// ground lower than that. So a small rise fills the channel to its banks, a bigger one spills over the floodplain and
// into the hollows next to it, and stops at higher ground. The game owns the rule; the renderer only draws the map.

/** The water as the demo holds it: how far it stands over the usual (m), how fast it runs (times the usual), how muddy. */
export interface WaterState { rise: number; flow: number; mud: number }
export const USUAL_WATER: WaterState = { rise: 0, flow: 1, mud: 0 };
/** The stream's usual speed, m/s. */
export const STREAM_SPEED = 0.35;
/** Water over the land, out of the channel, runs this much slower than the stream (a flood spreading, then draining). */
const SPREAD_FLOW = 0.25;

export class DemoWater {
  private readonly ground: Float32Array;
  private readonly channel: Uint8Array;
  private readonly land: Uint8Array;
  private readonly alongX: Float32Array;
  private readonly alongZ: Float32Array;
  private readonly stream: Stream;

  constructor(stream: Stream, height: (x: number, z: number) => number) {
    this.stream = stream;
    const { nx, nz, cell, x0, z0 } = stream.grid, n = nx * nz;
    this.ground = new Float32Array(n); this.channel = new Uint8Array(n); this.land = new Uint8Array(n);
    this.alongX = new Float32Array(n); this.alongZ = new Float32Array(n);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell;
      this.ground[k] = height(x, z);
      this.land[k] = !stream.land || stream.land(x, z) ? 1 : 0;
      if (!this.land[k] || !stream.channel(x, z)) continue;
      this.channel[k] = 1;
      [this.alongX[k], this.alongZ[k]] = stream.along(x, z);
    }
  }

  /** The map the game would send for a state of the water. */
  map(state: WaterState): WaterMap {
    const { nx, nz } = this.stream.grid, n = nx * nz;
    const level = new Float32Array(n).fill(NaN), flowX = new Float32Array(n), flowZ = new Float32Array(n);
    const mud = new Float32Array(n).fill(state.mud);
    const surface = this.stream.level + state.rise, speed = STREAM_SPEED * state.flow;
    // Breadth first from the channel over lower ground; water out of the channel runs the way its channel does, slower.
    let queue: number[] = [];
    for (let k = 0; k < n; k++) {
      if (!this.channel[k]) continue;
      level[k] = surface; flowX[k] = this.alongX[k] * speed; flowZ[k] = this.alongZ[k] * speed;
      queue.push(k);
    }
    while (queue.length) {
      const next: number[] = [];
      for (const k of queue) {
        const x = k % nx, z = (k - x) / nx;
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const cx = x + dx, cz = z + dz;
          if (cx < 0 || cz < 0 || cx >= nx || cz >= nz) continue;
          const j = cz * nx + cx;
          if (!Number.isNaN(level[j]) || !this.land[j] || this.ground[j] >= surface) continue;
          level[j] = surface;
          const slow = this.channel[k] ? SPREAD_FLOW : 1;
          flowX[j] = flowX[k] * slow; flowZ[j] = flowZ[k] * slow;
          next.push(j);
        }
      }
      queue = next;
    }
    return { ...this.stream.grid, level, flowX, flowZ, mud };
  }
}
