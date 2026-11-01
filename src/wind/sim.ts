import { ENGINE_WASM } from './engine.ts';

// The living wind (#36): the game's wind near the ground, simulated over the whole world, a cell a metre.
//
// Plain TypeScript and WebAssembly, no three.js: the game owns it and steps it on its own tick (in a worker: see
// worker.ts), game logic asks it how hard the wind blows anywhere (windAt), and the renderer draws the same snapshots.
// Gusts come from a recipe (the open air's pattern, laid along the wind and travelling with it) and are fed down into
// living air, which goes round walls, is slowed by hedges and crowns, and piles up and spills sideways where gusts
// meet. Behind each obstacle a calm streak trails off downwind. The physics is in sim.c; why it's built this way, and
// its calibration, is in docs/WIND.md.
//
// Deterministic: the same obstacles, goals and ticks give the same wind, bit for bit, and a saved state restores to the
// same future. The engine is bit-identical on every machine; the few sines and cosines here (turning the wind) are
// exact within one JavaScript engine (V8: Chrome, Electron, Node) but not specified to the last bit across engines.

/** What the game asks of the wind. */
export interface WindGoal {
  /** The average wind at ground level, metres per second: gusts go above it, lulls below, averaging out to it. */
  speed: number;
  /** Where it blows towards, radians in the ground plane from +x towards +z. */
  direction: number;
  /** How gusty, 0 (truly steady) to 1. Defaults to 0.5. */
  gustiness?: number;
  /** How the gusts come, 0 (rare and strong) to 1 (frequent and mild); the average stays the same. Defaults to 0.5. */
  rhythm?: number;
}

/** A shape on the ground, in world metres. */
export type Shape =
  | { circle: { x: number; z: number; radius: number } }
  /** A strip from a to b, `width` across (a hedge, a wall, a fence). */
  | { strip: { ax: number; az: number; bx: number; bz: number; width: number } }
  /** A rectangle centred at (x, z), half-sizes hx, hz along its own axes, turned `turn` radians from +x towards +z. */
  | { box: { x: number; z: number; hx: number; hz: number; turn: number } };

/**
 * Something the wind meets. `solid`: the wind goes round it (a building, a wall); `drag`: it blows through, slowed
 * (per second; see DRAG). Height matters for solids: one lower than the ground air's 2 metres is blown over, so it
 * slows the air (SOLID_DRAG for the share of 2 m it fills) rather than walling it.
 */
export type Obstacle = Shape & ({ solid: true; height: number } | { drag: number });

/** How hard things slow the wind that blows through them, per second, for the ground air's 2 metres (Sol's round 6). */
export const DRAG = {
  /** A dense hedge, 2.5 m tall: the developer's default until a mechanic needs a choice (#36). */
  hedge: 8,
  /** Tree crowns, a row or a clump. */
  crown: 4.4,
  /** A rail fence: rails and posts, mostly gaps. */
  railFence: 0.4,
} as const;
/** A solid lower than 2 m slows the air at this rate times the share of the 2 m it fills. */
export const SOLID_DRAG = 24;

/** One game tick, seconds: the wind is stepped at this rate whatever the frame rate. */
export const TICK = 0.1;
/** Substeps a tick, at least: enough for a breeze and its gusts at 1 m cells. The engine takes more when the wind is
 * faster (sim.c's substepsFor). */
const SUBSTEPS = 5;
/** The strongest wind the engine takes, m/s (more is taken as this): beyond it a tick would need more substeps than
 * sim.c's MAXSUB allows. */
export const MAX_SPEED = 60;
/** The largest world side in cells (sim.c's MAXW). */
export const MAX_CELLS = 256;
/** How much of the gap to a new goal the wind closes each tick: 1 - exp(-TICK / 1.5 s), so it doesn't snap. */
const EASE = 0.06449301496838222;
/** A turn further than 25 degrees from the gusts' heading (this is its cosine) starts a new set of gusts laid along
 * the new heading... */
const NEW_HEADING = 0.9063077870366499;
/** ...which fades in over this many seconds while the old set fades out, so nothing swings round. */
const FADE = 6;
/** How deep the lulls go at full gustiness (open question 2: the look PR offers choices). */
const LULL = 0.85;

/**
 * The ground's friction (per second) that keeps the average wind at the game's speed, for the recipe's rhythm and
 * gustiness: Sol's offline calibration of the recipe (round 4), never measured from the running field. A new recipe
 * needs a new calibration.
 */
export function friction(rhythm: number, gustiness: number): number {
  const D = [0.6139550781249998, 0.598369140625, 0.582783203125, 0.5594042968749999, 0.5438183593749999];
  const q = rhythm * 4, i = Math.min(3, Math.floor(q)), f = q - i, d = D[i] + (D[i + 1] - D[i]) * f;
  const correction = rhythm <= 0.5 ? 0.05 + (0.037 - 0.05) * rhythm * 2 : 0.037 + (0.038 - 0.037) * (rhythm - 0.5) * 2;
  return 0.275 + (d + correction - 0.275) * gustiness * gustiness;
}

/**
 * The engine's pace: 1 up to the 6 m/s it's calibrated at, then the wind over 6 m/s. Every rate in it and the speed a
 * pile-up of air spreads at go up by it, so a storm is a breeze sped up: the same shapes, the same average. (Kept at 7 m/s,
 * a 35 m/s wind outran the pile-ups fivefold and the air squashed without bound; with the rates kept, the average drifted
 * 7 to 25% over the goal.) Faster wind takes more substeps a tick (sim.c), so a storm costs more: about 50 ms a tick at
 * 35 m/s on the developer's machine, against 12 in a breeze.
 */
function pace(speed: number) { return f32(Math.max(1, speed / 6)); }

/** A set of gusts laid along a heading (hx, hz), travelled s metres along it; o shifts it across, so sets differ. */
interface Gusts { hx: number; hz: number; s: number; o: number }

/** The wind's own state besides the air: what it's easing towards and where its gusts are. Plain data, for saves. */
export interface WindState {
  tick: number;
  goal: Required<WindGoal>;
  speed: number; dirX: number; dirZ: number; gustiness: number; rhythm: number;
  /** The gusts, and those fading in after a turn (with how far they've faded in, 0..1). */
  gusts: Gusts; next: Gusts | null; fade: number;
  /** How many sets of gusts there have been, so each new one is laid differently. */
  sets: number;
}

/** The world the wind covers: nx by nz cells of `cell` metres, the corner at (x0, z0). */
export interface WindGrid { nx: number; nz: number; cell: number; x0: number; z0: number }

/** The wind at one tick, for queries and drawing. Arrays are cell by cell, x fastest. */
export interface WindSnapshot extends WindGrid {
  tick: number;
  /** The ground air's velocity (m/s, x and z), up to about 2 m. */
  u: Float32Array; v: Float32Array;
  /** The shelter memory: 1 in open air, towards 0 behind obstacles. */
  k: Float32Array;
  /** The free air above, at ground level's scale (the recipe's wind), x and z. */
  fu: Float32Array; fv: Float32Array;
}

/** A save: the wind's state and its air (about 960 KB over 200 m at 1 m). */
export interface WindSave { version: 1; state: WindState; air: Float32Array }

const smooth = (x: number) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const f32 = Math.fround;

let module: WebAssembly.Module | null = null;
function engineModule() {
  if (!module) {
    const bin = atob(ENGINE_WASM), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    module = new WebAssembly.Module(bytes);
  }
  return module;
}

interface Engine {
  memory: WebAssembly.Memory;
  setup(nx: number, ny: number, h: number, x0: number, y0: number, substeps: number): number;
  prepare(): void; reset(u: number, v: number): void; setFriction(s: number): void; setPace(p: number): void; step(dt: number): void; hits(): number; substepsUsed(): number;
  force(speed: number, dx: number, dy: number, g: number, rhythm: number, lull: number,
    hx0: number, hy0: number, s0: number, o0: number, hx1: number, hy1: number, s1: number, o1: number, w: number): void;
  ptrR(): number; ptrM(): number; ptrV(): number; ptrK(): number; ptrFX(): number; ptrFY(): number;
  ptrSolid(): number; ptrDrag(): number;
}

export class WindSim {
  readonly grid: WindGrid;
  state: WindState;
  private readonly x: Engine;
  private readonly N: number;

  /**
   * A wind over the grid, blowing steadily as `goal` asks, with these obstacles. Each instance has its own engine, so a
   * game can run more than one (a test, a preview) side by side.
   */
  constructor(grid: WindGrid, obstacles: Obstacle[], goal: WindGoal) {
    if (grid.nx > MAX_CELLS || grid.nz > MAX_CELLS) throw new Error(`The wind covers at most ${MAX_CELLS} cells a side`);
    this.grid = { ...grid };
    this.N = grid.nx * grid.nz;
    this.x = new WebAssembly.Instance(engineModule(), {}).exports as unknown as Engine;
    if (!this.x.setup(grid.nx, grid.nz, grid.cell, grid.x0, grid.z0, SUBSTEPS)) throw new Error('Bad wind grid');
    rasterise(grid, obstacles, this.view(this.x.ptrSolid()), this.view(this.x.ptrDrag()));
    this.x.prepare();
    const g = fullGoal(goal), dirX = Math.cos(g.direction), dirZ = Math.sin(g.direction);
    this.state = {
      tick: 0, goal: g, speed: g.speed, dirX, dirZ, gustiness: g.gustiness, rhythm: g.rhythm,
      gusts: { hx: dirX, hz: dirZ, s: 0, o: 0 }, next: null, fade: 0, sets: 1,
    };
    this.x.reset(g.speed * dirX, g.speed * dirZ);
  }

  private view(ptr: number) { return new Float32Array(this.x.memory.buffer, ptr, this.N); }

  /** What the game asks for now; the wind eases towards it over the next ticks. */
  setGoal(goal: WindGoal) { this.state.goal = fullGoal(goal); }

  /** Advances one tick (TICK seconds). */
  step() {
    const s = this.state, k = EASE;
    s.speed += (s.goal.speed - s.speed) * k;
    s.gustiness += (s.goal.gustiness - s.gustiness) * k;
    s.rhythm += (s.goal.rhythm - s.rhythm) * k;
    // The direction turns the short way round, a little slower than the speed changes.
    const now = Math.atan2(s.dirZ, s.dirX);
    let turn = (s.goal.direction - now) % (2 * Math.PI);
    if (turn > Math.PI) turn -= 2 * Math.PI; else if (turn <= -Math.PI) turn += 2 * Math.PI;
    const a = now + turn * k * 0.7;
    s.dirX = Math.cos(a); s.dirZ = Math.sin(a);
    this.force();
    this.x.step(TICK);
    // The gusts travel with the wind, each set along its own heading.
    s.gusts.s += s.speed * TICK;
    if (s.next) {
      s.next.s += s.speed * TICK;
      s.fade = Math.min(1, s.fade + TICK / FADE);
      if (s.fade >= 1) { s.gusts = s.next; s.next = null; s.fade = 0; }
    }
    // A turn well away from the gusts' heading lays a new set along where the wind is going.
    if (!s.next && s.gustiness > 0) {
      const gx = Math.cos(s.goal.direction), gz = Math.sin(s.goal.direction);
      if (gx * s.gusts.hx + gz * s.gusts.hz < NEW_HEADING) {
        s.next = { hx: gx, hz: gz, s: 0, o: (s.sets * 13) % 101 }; s.sets++; s.fade = 0;
      }
    }
    s.tick++;
  }

  /** Hands the recipe's wind for this tick to the engine. */
  private force() {
    const s = this.state, g = s.gusts, n = s.next ?? g;
    // The pattern repeats every L metres along its heading, so travel is passed modulo L: it stays exact however far.
    const L = f32(108 - f32(72 * f32(s.rhythm)));
    this.x.setFriction(friction(s.rhythm, s.gustiness));
    this.x.setPace(pace(s.speed));
    this.x.force(s.speed, s.dirX, s.dirZ, s.gustiness, s.rhythm, LULL,
      g.hx, g.hz, g.s % L, g.o, n.hx, n.hz, n.s % L, n.o, s.next ? smooth(s.fade) : 0);
  }

  /** The wind now, copied (safe to keep, or to send from a worker). */
  snapshot(): WindSnapshot {
    const R = this.view(this.x.ptrR()), M = this.view(this.x.ptrM()), V = this.view(this.x.ptrV());
    const u = new Float32Array(this.N), v = new Float32Array(this.N);
    for (let i = 0; i < this.N; i++) { u[i] = M[i] / R[i]; v[i] = V[i] / R[i]; }
    return {
      ...this.grid, tick: this.state.tick, u, v, k: this.view(this.x.ptrK()).slice(),
      fu: this.view(this.x.ptrFX()).slice(), fv: this.view(this.x.ptrFY()).slice(),
    };
  }

  /** The obstacles as the wind sees them: solid (1) or not, and drag per second, cell by cell. */
  obstacles() { return { solid: this.view(this.x.ptrSolid()).slice(), drag: this.view(this.x.ptrDrag()).slice() }; }

  /** How many substeps the last tick took: SUBSTEPS, or more in a strong wind (see sim.c). */
  get substeps() { return this.x.substepsUsed(); }

  /** How often the air has hit the safety bounds (0 unless something is wrong). */
  get safetyHits() { return this.x.hits(); }

  save(): WindSave {
    const air = new Float32Array(this.N * 6);
    this.airArrays().forEach((p, i) => air.set(this.view(p), i * this.N));
    return { version: 1, state: structuredClone(this.state), air };
  }

  /** Restores a save made over the same grid and obstacles. */
  restore(save: WindSave) {
    if (save.air.length !== this.N * 6) throw new Error('The save is for another grid');
    this.state = structuredClone(save.state);
    this.airArrays().forEach((p, i) => this.view(p).set(save.air.subarray(i * this.N, (i + 1) * this.N)));
  }

  /** What a save holds of the engine: the air (density, momentum), the shelter memory, and the free air above as last
   * forced (so a snapshot straight after a restore is the same as one without it). */
  private airArrays() { return [this.x.ptrR(), this.x.ptrM(), this.x.ptrV(), this.x.ptrK(), this.x.ptrFX(), this.x.ptrFY()]; }
}

function fullGoal(g: WindGoal): Required<WindGoal> {
  return {
    speed: Math.min(MAX_SPEED, Math.max(0, g.speed)), direction: g.direction,
    gustiness: Math.min(1, Math.max(0, g.gustiness ?? 0.5)), rhythm: Math.min(1, Math.max(0, g.rhythm ?? 0.5)),
  };
}

/** Whether a point is inside a shape. */
function inside(o: Shape, x: number, z: number): boolean {
  if ('circle' in o) { const c = o.circle, dx = x - c.x, dz = z - c.z; return dx * dx + dz * dz < c.radius * c.radius; }
  if ('strip' in o) {
    const s = o.strip, dx = s.bx - s.ax, dz = s.bz - s.az, ll = dx * dx + dz * dz;
    const t = ll ? Math.min(1, Math.max(0, ((x - s.ax) * dx + (z - s.az) * dz) / ll)) : 0;
    const rx = x - s.ax - t * dx, rz = z - s.az - t * dz;
    return rx * rx + rz * rz < (s.width * s.width) / 4;
  }
  const b = o.box, c = Math.cos(b.turn), sn = Math.sin(b.turn), dx = x - b.x, dz = z - b.z;
  return Math.abs(dx * c + dz * sn) < b.hx && Math.abs(-dx * sn + dz * c) < b.hz;
}

/**
 * The obstacles onto the grid, from 4 x 4 samples a cell (Sol's): a cell is solid if half its samples are in a wall,
 * and its drag is the average over its samples of the strongest drag at each.
 */
function rasterise(grid: WindGrid, obstacles: Obstacle[], solid: Float32Array, drag: Float32Array) {
  const { nx, nz, cell, x0, z0 } = grid;
  const items = obstacles.map((o) => {
    const walls = 'solid' in o && o.height >= 2;
    const d = 'solid' in o ? (walls ? 0 : (SOLID_DRAG * Math.max(0, o.height)) / 2) : o.drag;
    return { o, walls, d, ...bounds(o) };
  });
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const cx = x0 + (i + 0.5) * cell, cz = z0 + (j + 0.5) * cell;
    const near = items.filter((it) => cx + cell > it.minX && cx - cell < it.maxX && cz + cell > it.minZ && cz - cell < it.maxZ);
    if (!near.length) continue;
    let walls = 0, sum = 0;
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
      const x = cx + ((a - 1.5) * cell) / 4, z = cz + ((b - 1.5) * cell) / 4;
      let d = 0, wall = false;
      for (const it of near) if (inside(it.o, x, z)) { if (it.walls) wall = true; else d = Math.max(d, it.d); }
      if (wall) walls++;
      sum += d;
    }
    const k = j * nx + i;
    solid[k] = walls >= 8 ? 1 : 0;
    drag[k] = sum / 16;
  }
}

function bounds(o: Shape) {
  if ('circle' in o) { const c = o.circle; return { minX: c.x - c.radius, maxX: c.x + c.radius, minZ: c.z - c.radius, maxZ: c.z + c.radius }; }
  if ('strip' in o) {
    const s = o.strip, w = s.width / 2;
    return { minX: Math.min(s.ax, s.bx) - w, maxX: Math.max(s.ax, s.bx) + w, minZ: Math.min(s.az, s.bz) - w, maxZ: Math.max(s.az, s.bz) + w };
  }
  const b = o.box, r = Math.hypot(b.hx, b.hz);
  return { minX: b.x - r, maxX: b.x + r, minZ: b.z - r, maxZ: b.z + r };
}

/**
 * The wind at a point and height (metres above the ground), m/s along x and z. Up to 0.75 m it's the ground air;
 * higher, it blends towards the faster free air, 1.5 times the ground's at 8 m and rising a little beyond (a rotor on a
 * tall mast catches more), keeping more of the ground's calm where the shelter memory says the air is sheltered. This
 * is a rule, not a simulated upper layer (Sol's round 6). Worked out at the four nearest cell centres, rounded to
 * float32, then blended, so the game and the renderer agree. Outside the grid, the nearest edge.
 */
export function windAt(snap: WindSnapshot, x: number, z: number, height = 0): [number, number] {
  const gx = (x - snap.x0) / snap.cell - 0.5, gz = (z - snap.z0) / snap.cell - 0.5;
  const i = Math.max(0, Math.min(snap.nx - 2, Math.floor(gx))), j = Math.max(0, Math.min(snap.nz - 2, Math.floor(gz)));
  const tx = Math.max(0, Math.min(1, gx - i)), tz = Math.max(0, Math.min(1, gz - j));
  let ox = 0, oz = 0;
  for (let b = 0; b < 2; b++) for (let a = 0; a < 2; a++) {
    const k = (j + b) * snap.nx + i + a, w = (a ? tx : 1 - tx) * (b ? tz : 1 - tz);
    const [cx, cz] = atHeight(snap, k, height);
    ox += cx * w; oz += cz * w;
  }
  return [ox, oz];
}

/** The wind at a cell centre and height (see windAt). */
export function atHeight(snap: WindSnapshot, k: number, height: number): [number, number] {
  const u = snap.u[k], v = snap.v[k];
  if (height <= 0.75) return [u, v];
  const t = Math.min(1, (height - 0.75) / 7.25), profile = 1 + 0.5 * t + 0.01 * Math.max(0, height - 8);
  const shelter = Math.min(1, Math.max(0, 1 - snap.k[k])), w = (1 - t) * (1 - t + t * shelter);
  const fu = profile * snap.fu[k], fv = profile * snap.fv[k];
  return [f32(fu + w * (u - fu)), f32(fv + w * (v - fv))];
}

/** The wind between two ticks' snapshots, `alpha` of the way from a to b (the game's frame between its ticks). */
export function windBetween(a: WindSnapshot, b: WindSnapshot, alpha: number, x: number, z: number, height = 0): [number, number] {
  const p = windAt(a, x, z, height), q = windAt(b, x, z, height);
  return [p[0] + (q[0] - p[0]) * alpha, p[1] + (q[1] - p[1]) * alpha];
}
