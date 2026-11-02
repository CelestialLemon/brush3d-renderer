import { ENGINE_WASM } from './engine.ts';

// The living wind (#36): the game's wind near the ground, simulated over the whole world, a cell a metre.
//
// Plain TypeScript and WebAssembly, no three.js: the game owns it and steps it on its own tick (in a worker: see
// worker.ts), game logic asks it how hard the wind blows anywhere (windAt), and the renderer draws the same snapshots.
// Gusts come from a recipe (the open air's pattern: a seeded sequence of gusts, each its own, laid along the wind and
// travelling with it, swelling and easing over gusty and quiet minutes) and are fed down into living air, which goes round walls, is slowed by hedges and crowns, and piles up and spills sideways where gusts
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
/** A new set of gusts is laid when the wind is asked to go this much faster or slower than the gusts were laid for
 * (their fronts' pace and spacing are fixed per set, so they never stretch)... */
const NEW_PACE = Math.log(1.2);
/** ...or this much more or less frequent. */
const NEW_RHYTHM = 0.1;

/**
 * The looks on offer for the gusts (#36, for the developer to pick; the others go before the PR merges):
 * a, gentler lulls and slower fronts; b, deeper lulls; c, quicker fronts and more slaps. `floor`: how far the wind drops
 * in a lull at full gustiness (at rhythm 0; frequent gusts lull less), `fronts`: how fast the gusts travel against the
 * wind, `slaps`: the share of gusts that hit in 0.3 s rather than building over 1 to 2.
 */
export type GustLook = 'a' | 'b' | 'c';
export const GUST_LOOKS: Record<GustLook, { floor: number; fronts: number; slaps: number; friction: number[][] }> = {
  a: { floor: 0.38, fronts: 0.75, slaps: 0.04, friction: [
    [0.2826543522560237, 0.29292140852973053, 0.3077221489458789],
    [0.28134208165687724, 0.2895692213917927, 0.30110288457881],
    [0.2795879895069732, 0.2856796467204057, 0.2944705510537602]] },
  b: { floor: 0.16, fronts: 1, slaps: 0.04, friction: [
    [0.28511881965722197, 0.2986468109498092, 0.3201132928331316],
    [0.2827068245140076, 0.2934450279373085, 0.3087300101904354],
    [0.2812791708806471, 0.28971804292557857, 0.30151682574198096]] },
  c: { floor: 0.28, fronts: 1.2, slaps: 0.1, friction: [
    [0.28328771438822403, 0.29406219286981167, 0.3106088653837158],
    [0.2815461694376518, 0.29047650838132205, 0.3029591142750228],
    [0.2798680085700209, 0.2864315522671254, 0.2954319522803181]] },
};

/**
 * The ground's friction (per second) that keeps the average wind at the game's speed, for the recipe's rhythm and
 * gustiness: Sol's offline calibration of the recipe, never measured from the running field. A new recipe needs a new
 * calibration. Provisional: fitted at 6 m/s only (within 0.5% there, at the knots and between them; up to 6% off at
 * 2 m/s and 3.5% at 35), for comparing the looks. The look picked gets a table over speed too.
 */
export function friction(rhythm: number, gustiness: number, look: GustLook = 'a'): number {
  const T = GUST_LOOKS[look].friction, G = [0, 0.5, 0.75, 1];
  const at = (row: number[]) => {
    const i = gustiness <= 0.5 ? 0 : gustiness <= 0.75 ? 1 : 2, v = [0.275, ...row];
    return v[i] + (v[i + 1] - v[i]) * (gustiness - G[i]) / (G[i + 1] - G[i]);
  };
  const q = Math.min(1, Math.max(0, rhythm)) * 2, i = Math.min(1, Math.floor(q));
  return at(T[i]) + (at(T[i + 1]) - at(T[i])) * (q - i);
}

/** A seeded random number in [0, 1) for k, one stream per salt (the same hash as sim.c's). */
function rnd(k: number, seed: number, salt: number) {
  let a = (((k ^ seed) >>> 0) + Math.imul(salt, 0x9e3779b9)) >>> 0;
  a ^= a >>> 16; a = Math.imul(a, 0x7feb352d); a ^= a >>> 15; a = Math.imul(a, 0x846ca68b); a ^= a >>> 16;
  return (a >>> 8) / 16777216;
}

/**
 * The spell at a moment of the game's clock (seconds): -1 quiet to 1 gusty. Sol's balanced spells: blocks of 120 to
 * 240 s (seeded), each a gusty half and a quiet half (or quiet first), smoothly, so every whole block averages out.
 */
export function spellAt(seconds: number, seed: number) {
  const start = (j: number) => 180 * j + 30 * (2 * rnd(j, seed, 133) - 1);
  let j = Math.floor(seconds / 180);
  if (seconds < start(j)) j--; else if (seconds >= start(j + 1)) j++;
  const a0 = start(j), v = (4 * (seconds - a0)) / (start(j + 1) - a0), i = Math.min(3, Math.floor(v));
  const a = (0.5 + 0.5 * rnd(j, seed, 149)) * (rnd(j, seed, 151) < 0.5 ? -1 : 1), nodes = [0, a, 0, -a, 0];
  return nodes[i] + (nodes[i + 1] - nodes[i]) * smooth(v - i);
}

/**
 * The engine's pace: 1 up to the 6 m/s it's calibrated at, then the wind over 6 m/s. Every rate in it and the speed a
 * pile-up of air spreads at go up by it, so a storm is a breeze sped up: the same shapes, the same average. (Kept at 7 m/s,
 * a 35 m/s wind outran the pile-ups fivefold and the air squashed without bound; with the rates kept, the average drifted
 * 7 to 25% over the goal.) Faster wind takes more substeps a tick (sim.c), so a storm costs more: about 50 ms a tick at
 * 35 m/s on the developer's machine, against 12 in a breeze.
 */
function pace(speed: number) { return f32(Math.max(1, speed / 6)); }

/**
 * A set of gusts laid along a heading (hx, hz), for a wind of `speed` (m/s, at least 2) and a rhythm, which fix how far
 * apart its fronts are and how fast they come; o shifts it across, so sets differ. Interval k + p of the seeded
 * sequence is at the world's centre now (k whole, p in 0..1, so it stays exact however long the game runs).
 */
interface Gusts { hx: number; hz: number; o: number; speed: number; rhythm: number; k: number; p: number }

/** The wind's own state besides the air: what it's easing towards and where its gusts are. Plain data, for saves. */
export interface WindState {
  tick: number;
  /** The gusts' seed, and their look (#36, while the developer picks). */
  seed: number; look: GustLook;
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
  /** The wind as a whole this tick, eased towards the game's goal: the average speed (m/s), where it blows towards (a
   * unit vector in x and z) and how gusty. What the renderer draws as the wind's strength and heading. */
  speed: number; dirX: number; dirZ: number; gustiness: number;
  /** The ground air's velocity (m/s, x and z), up to about 2 m. */
  u: Float32Array; v: Float32Array;
  /** The shelter memory: 1 in open air, towards 0 behind obstacles. */
  k: Float32Array;
  /** The free air above, at ground level's scale (the recipe's wind), x and z. */
  fu: Float32Array; fv: Float32Array;
}

/** A save: the wind's state and its air (about 960 KB over 200 m at 1 m). */
export interface WindSave { version: 2; state: WindState; air: Float32Array }

/** How the wind is set up besides its goal: the seed its gusts come from (the same seed, the same gusts), and (while
 * the developer picks, #36) their look. */
export interface WindOptions { seed?: number; look?: GustLook }

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
  setSeed(seed: number): void;
  setGusts(slot: number, hx: number, hy: number, o: number, L: number, T: number, B: number, H: number, slap: number, k: number, p: number): void;
  force(speed: number, dx: number, dy: number, g: number, swell: number, spell: number, w: number): void;
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
  constructor(grid: WindGrid, obstacles: Obstacle[], goal: WindGoal, options: WindOptions = {}) {
    if (grid.nx > MAX_CELLS || grid.nz > MAX_CELLS) throw new Error(`The wind covers at most ${MAX_CELLS} cells a side`);
    this.grid = { ...grid };
    this.N = grid.nx * grid.nz;
    this.x = new WebAssembly.Instance(engineModule(), {}).exports as unknown as Engine;
    if (!this.x.setup(grid.nx, grid.nz, grid.cell, grid.x0, grid.z0, SUBSTEPS)) throw new Error('Bad wind grid');
    rasterise(grid, obstacles, this.view(this.x.ptrSolid()), this.view(this.x.ptrDrag()));
    this.x.prepare();
    const g = fullGoal(goal), dirX = Math.cos(g.direction), dirZ = Math.sin(g.direction);
    this.state = {
      tick: 0, seed: (options.seed ?? 1) >>> 0, look: options.look ?? 'a',
      goal: g, speed: g.speed, dirX, dirZ, gustiness: g.gustiness, rhythm: g.rhythm,
      gusts: { hx: dirX, hz: dirZ, o: 0, speed: Math.max(2, g.speed), rhythm: g.rhythm, k: 0, p: 0 }, next: null, fade: 0, sets: 1,
    };
    this.x.reset(g.speed * dirX, g.speed * dirZ);
    // The free air above for tick 0, so the first snapshot has it (the first step forces the same again).
    this.force();
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
    // The gusts travel with the wind, each set along its own heading at its own pace.
    this.travel(s.gusts);
    if (s.next) {
      this.travel(s.next);
      s.fade = Math.min(1, s.fade + TICK / FADE);
      if (s.fade >= 1) { s.gusts = s.next; s.next = null; s.fade = 0; }
    }
    // A turn well away from the gusts' heading, or a wind asked to blow much faster or slower or its gusts to come much
    // more or less often, lays a new set for the wind asked for, fading in. It carries on the same seeded sequence from
    // where the old set is at the world's centre, so the centre sees no jump; the rest of the world fades across.
    if (!s.next && s.gustiness > 0) {
      const gx = Math.cos(s.goal.direction), gz = Math.sin(s.goal.direction), speed = Math.max(2, s.goal.speed);
      if (gx * s.gusts.hx + gz * s.gusts.hz < NEW_HEADING || Math.abs(Math.log(speed / s.gusts.speed)) > NEW_PACE
        || Math.abs(s.goal.rhythm - s.gusts.rhythm) > NEW_RHYTHM) {
        s.next = { hx: gx, hz: gz, o: (s.sets * 13) % 101, speed, rhythm: s.goal.rhythm, k: s.gusts.k, p: s.gusts.p };
        s.sets++; s.fade = 0;
      }
    }
    s.tick++;
  }

  /** A set's usual interval between gusts in seconds (T) and metres (L), its lull floor and peak ceiling. */
  private shape(g: Gusts) {
    const look = GUST_LOOKS[this.state.look], T = (108 - 48 * g.rhythm) / (6 * look.fronts);
    return { T, L: look.fronts * g.speed * T, B: look.floor + 0.15 * g.rhythm, H: 1.95 - 0.4 * g.rhythm };
  }

  /** Moves a set's gusts on by a tick: TICK / T intervals past the centre, the whole intervals kept apart. */
  private travel(g: Gusts) {
    g.p += TICK / this.shape(g).T;
    const whole = Math.floor(g.p);
    g.k += whole; g.p -= whole;
  }

  /** Hands the recipe's wind for this tick to the engine. */
  private force() {
    const s = this.state, swell = spellAt(s.tick * TICK, s.seed);
    [s.gusts, s.next ?? s.gusts].forEach((g, slot) => {
      const { T, L, B, H } = this.shape(g);
      this.x.setGusts(slot, g.hx, g.hz, g.o, L, T, B, H, GUST_LOOKS[s.look].slaps, g.k, g.p);
    });
    this.x.setSeed(s.seed);
    this.x.setFriction(friction(s.rhythm, s.gustiness, s.look));
    this.x.setPace(pace(s.speed));
    this.x.force(s.speed, s.dirX, s.dirZ, s.gustiness, swell, 0.7 + 0.3 * swell, s.next ? smooth(s.fade) : 0);
  }

  /** The wind now, copied (safe to keep, or to send from a worker). */
  snapshot(): WindSnapshot {
    const R = this.view(this.x.ptrR()), M = this.view(this.x.ptrM()), V = this.view(this.x.ptrV());
    const u = new Float32Array(this.N), v = new Float32Array(this.N);
    for (let i = 0; i < this.N; i++) { u[i] = M[i] / R[i]; v[i] = V[i] / R[i]; }
    return {
      ...this.grid, tick: this.state.tick, speed: this.state.speed, dirX: this.state.dirX, dirZ: this.state.dirZ,
      gustiness: this.state.gustiness, u, v, k: this.view(this.x.ptrK()).slice(),
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
    return { version: 2, state: structuredClone(this.state), air };
  }

  /** Restores a save made over the same grid and obstacles. */
  restore(save: WindSave) {
    if (save.version !== 2) throw new Error('The save is from an older wind');
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
