import * as THREE from 'three';
import { windBetween, type WindSnapshot } from '../wind/sim';
import { CROWN_HEIGHT, CROWN_PROFILE } from './wind';

// Trees with weight (#36): each tree is a mass on a spring, pushed by the wind at its crown. It leans into a gust with a
// lag, overshoots a little and rocks to a stop after the gust passes, each kind at its own pace, a bigger tree of a kind
// slower. This is the renderer's own motion (no game logic reads a tree's pose), stepped on the renderer's clock. The
// game's wind is a 1 m, 0.1 s map, too coarse for the small quick swirls that buffet a single tree, so the renderer adds
// them as small shoves into each spring, as strong as the game's gustiness: none at gustiness 0, where a tree leans and
// holds still (the developer, 2026-11-02, on #36).

export type TreeKind = 'broadleaf' | 'fruit' | 'cypress' | 'round' | 'bush';

/** A tree as the wind moves it: its foot (x, z), its height in metres, its kind, and its size against the kind's usual. */
export interface TreeSpec { x: number; z: number; height: number; kind: TreeKind; scale: number }

/**
 * A kind's spring: how often it rocks (Hz, at the kind's usual size; a tree `scale` times the size rocks 1/√scale as
 * often), and how quickly its rocking dies away (the share of critical damping: the wood's own, and the leaves' drag
 * through the air, which grows with the wind, per m/s).
 */
export interface TreeFeel { hz: number; damping: number; drag: number }

/**
 * How far a kind's crown bends with its trunk: 0, the crown moves as one piece above a bending trunk; 1, the whole tree bends
 * as one whip, its top furthest. Built into the meshes (see growTree). The tree's movement is drawn only across the view
 * (acrossView), so a bending crown never changes depth and its strokes never swap over.
 */
export const TREE_BEND: Record<TreeKind, number> = { cypress: 1, broadleaf: 0.55, fruit: 0.5, round: 0.5, bush: 0.35 };

/** The candidates for the developer to pick from (`?trees=`): loose rocks longer and slower, stiff settles quickly. */
export const TREE_FEELS = {
  loose: {
    cypress: { hz: 0.42, damping: 0.05, drag: 0.004 },
    broadleaf: { hz: 0.32, damping: 0.08, drag: 0.006 },
    fruit: { hz: 0.5, damping: 0.08, drag: 0.006 },
    round: { hz: 0.6, damping: 0.07, drag: 0.006 },
    bush: { hz: 1.1, damping: 0.12, drag: 0.008 },
  },
  stiff: {
    cypress: { hz: 0.6, damping: 0.12, drag: 0.008 },
    broadleaf: { hz: 0.45, damping: 0.18, drag: 0.012 },
    fruit: { hz: 0.7, damping: 0.18, drag: 0.012 },
    round: { hz: 0.8, damping: 0.16, drag: 0.012 },
    bush: { hz: 1.5, damping: 0.25, drag: 0.015 },
  },
} satisfies Record<string, Record<TreeKind, TreeFeel>>;
export type TreeFeelName = keyof typeof TREE_FEELS;

/**
 * How far the wind pushes a tree's top over, as a share of its height, for the wind at its crown (m/s, in the ground's
 * terms): with the square of the speed at first, levelling off towards a third (Sol's calibration from #2: 1.3% in a
 * breeze, 12% in a gale, 30% in a hurricane).
 */
export function treeLean(speed: number) { return 0.36 * (1 - Math.exp(-(speed * speed) / 676)); }

/** How strongly the swirls shove, against the wind's speed, at full gustiness. */
const SWIRL = 0.3;
/** The swirls' pace: a new shove about every this many seconds (two layers, the second slower and weaker). */
const SWIRL_PACE = 0.7;
/** The longest step the springs take at once (s); a longer frame is taken in steps, and a stall longer than a second
 * lays the trees afresh. A quick spring (a small bush) takes shorter steps, at most a quarter radian of its rocking each,
 * so it stays stable however small. */
const STEP = 1 / 60;
const STEP_TURN = 0.25;
/** Trees a row in the pose texture. */
const ROW = 256;

/** A smooth wobble in -1..1 through a random value every second (seeded), for the swirls. */
function wobble(t: number, seed: number) {
  const i = Math.floor(t), f = t - i, s = f * f * (3 - 2 * f);
  const at = (n: number) => { let h = Math.imul(n ^ seed, 0x2c1b3c6d) ^ 0x297a2d39; h = Math.imul(h ^ (h >>> 15), 0x85ebca6b); h ^= h >>> 13; return ((h >>> 0) / 4294967296) * 2 - 1; };
  return at(i) + (at(i + 1) - at(i)) * s;
}

/** Every tree's spring, and a texture of their tops' displacement (x, z, metres) for the shaders, one texel a tree. */
export class TreeSprings {
  feel: TreeFeelName = 'loose';
  texture = TreeSprings.makeTexture(1);
  private trees: TreeSpec[] = [];
  private readonly ids = new Map<string, number>();
  /** Per tree: the top's displacement (x, z) and its velocity (x, z). */
  private state = new Float32Array(0);
  private seeds = new Int32Array(0);
  private time: number | null = null;
  /** Trees before this are moving; those from it on are new, and are laid where the wind holds them at the next update. */
  private placed = 0;

  private static makeTexture(rows: number) {
    const t = new THREE.DataTexture(new Float32Array(ROW * rows * 4), ROW, rows, THREE.RGBAFormat, THREE.FloatType);
    t.needsUpdate = true;
    return t;
  }

  /** Takes in a mesh's trees; returns each one's index into the texture (the same tree in two meshes, the same index). */
  add(trees: TreeSpec[]): number[] {
    const out = trees.map((t) => {
      const key = `${t.x} ${t.z} ${t.kind}`;
      let id = this.ids.get(key);
      if (id === undefined) { id = this.trees.length; this.ids.set(key, id); this.trees.push(t); }
      return id;
    });
    const n = this.trees.length;
    if (n > this.seeds.length) {
      const state = new Float32Array(n * 4); state.set(this.state); this.state = state;
      this.seeds = Int32Array.from(this.trees, (t) => Math.imul(Math.round(t.x * 97), 0x9e3779b1) ^ Math.round(t.z * 131));
      const rows = Math.ceil(n / ROW);
      if (rows !== this.texture.image.height) {
        const old = this.texture.image.data as Float32Array;
        this.texture.dispose(); this.texture = TreeSprings.makeTexture(rows);
        (this.texture.image.data as Float32Array).set(old);
      }
    }
    return out;
  }

  /** Where a tree's top would be pushed now: its lean in the wind at its crown, shoved by the swirls (x, z, metres). */
  private target(i: number, time: number, wind: [WindSnapshot, WindSnapshot, number], gust: number, out: number[]) {
    const t = this.trees[i], seed = this.seeds[i];
    const [cx, cz] = windBetween(wind[0], wind[1], wind[2], t.x, t.z, CROWN_HEIGHT);
    const ux = cx / CROWN_PROFILE, uz = cz / CROWN_PROFILE, u = Math.hypot(ux, uz);
    if (u < 1e-4) { out[0] = out[1] = 0; return u; }
    const dx = ux / u, dz = uz / u, swirl = SWIRL * gust;
    // Two layers of swirl: quick shoves, and slower surges under them.
    const n = (k: number) => 0.75 * wobble(time / SWIRL_PACE, seed + k) + 0.5 * wobble(time / (2.7 * SWIRL_PACE), seed + k + 7);
    const along = treeLean(u * Math.max(0, 1 + swirl * n(0))) * t.height;
    const across = treeLean(u) * t.height * swirl * 0.6 * n(3);
    out[0] = dx * along - dz * across; out[1] = dz * along + dx * across;
    return u;
  }

  /** Lays every tree afresh at the next update, where the wind then holds it (a new wind, at once). */
  restart() { this.time = null; }

  /**
   * Steps every tree on to `time` (seconds, the renderer's clock) in the wind as drawn (the game's last two ticks and the
   * frame's place between them) and the game's gustiness. The first time, after a stall, and on a jump back (a tool
   * seeking), each tree is laid where the wind holds it, still.
   */
  update(time: number, wind: [WindSnapshot, WindSnapshot, number] | null, gust: number) {
    const n = this.trees.length;
    if (!n || !wind) return;
    const dt = this.time === null ? -1 : time - this.time;
    this.time = time;
    const s = this.state, goal = [0, 0], feels = TREE_FEELS[this.feel];
    const lay = (i: number) => { this.target(i, time, wind, gust, goal); s.set([goal[0], goal[1], 0, 0], i * 4); };
    if (dt < 0 || dt > 1) for (let i = 0; i < n; i++) lay(i);
    else {
      for (let i = this.placed; i < n; i++) lay(i);
      for (let i = 0; i < this.placed && dt > 0; i++) {
        const t = this.trees[i], f = feels[t.kind];
        const w = 2 * Math.PI * f.hz / Math.sqrt(t.scale);
        const steps = Math.ceil(dt / Math.min(STEP, STEP_TURN / w)), h = dt / steps;
        for (let k = 1; k <= steps; k++) {
          const u = this.target(i, time - dt + k * h, wind, gust, goal);
          const c = 2 * Math.min(1, f.damping + f.drag * u) * w;
          // Semi-implicit Euler: the velocity first, then the position from it (stable at a quarter radian a step, damped or not).
          let vx = s[i * 4 + 2], vz = s[i * 4 + 3];
          vx += (w * w * (goal[0] - s[i * 4]) - c * vx) * h;
          vz += (w * w * (goal[1] - s[i * 4 + 1]) - c * vz) * h;
          s[i * 4] += vx * h; s[i * 4 + 1] += vz * h; s[i * 4 + 2] = vx; s[i * 4 + 3] = vz;
        }
      }
      if (dt === 0 && this.placed === n) return;
    }
    this.placed = n;
    const data = this.texture.image.data as Float32Array;
    for (let i = 0; i < n; i++) { data[i * 4] = s[i * 4]; data[i * 4 + 1] = s[i * 4 + 1]; }
    this.texture.needsUpdate = true;
  }

}
