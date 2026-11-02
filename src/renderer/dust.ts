import * as THREE from 'three';
import type { WindSnapshot } from '../wind/sim';

// Fresh dust (#36): what the gusts lift off bare ground, carried downwind on the game's wind, rising and spreading as it
// goes and fading over a few seconds as it mixes into the air. It's the renderer's own motion, which no game logic reads
// (the 2026-10-31 decision): the game says where dust can lift (setSource, its map of bare, dry ground) and the wind
// (its snapshots); the renderer lifts and carries the dust from them, a step a tick of the game's wind, so it holds still
// while the game is paused and sweeps faster when it's sped up. It lifts only in a dust storm, the game's weather event
// (the haze's dust kind), which can be a minor one in a gale: never on an ordinary dry, windy day (the developer,
// 2026-11-02). In a storm the gusts lift it in puffs over the storm's own haze.
//
// The field lies on the wind's grid. Each cell holds how much fresh dust is over it (an optical depth: 1 hides about
// two thirds of what's behind it, seen straight through) and how high it has risen. The post pass draws it (post.ts's
// freshDust), reading it along each pixel's view up through the layer, so a puff has depth.

/**
 * Where dust can lift, the game's map (#36): a grid of cells, each with how readily the ground there gives up dust (0
 * none: grass, crops, water, wet soil; 1 bare, dry earth) and the ground's height (metres), which the dust rises from.
 */
export interface DustSource { nx: number; nz: number; cell: number; x0: number; z0: number; lift: Float32Array; ground: Float32Array }

/**
 * The ground wind (m/s) above which bare ground gives up dust: at least DUST_THRESHOLD, and over the day's average wind
 * by GUST_LIFT, so it's the gusts that lift it, in puffs, a bigger puff in a stronger wind. (A wind always over the
 * threshold would lift a steady sheet off every track; a dusty day's steady dust is the weather's haze.)
 */
export const DUST_THRESHOLD = 5.5;
const GUST_LIFT = 1.1;
/**
 * The fresh dust's look: how much dust a second fully bare ground gives up at a gust over the threshold (lift, an
 * optical depth: lift * over / (1 + over / 6), over in m/s, levelling off in a strong gust); how long it takes to fade
 * to a third as it mixes into the air (linger, s); how fast it rises and the most it rises (rise, m/s; top, m over the
 * ground); and the rolling head, how much more a gust's front lifts as the wind there picks up, thrown up to most of
 * the top so the front comes as a wall (head, 0 none).
 */
export interface DustLook { lift: number; linger: number; rise: number; top: number; head: number }
/**
 * The developer's pick (#43), billows (C of three: A wisps, B drifts): heavy puffs up to the trees' tops, each gust's
 * front a rolling wall, the most visible. C hung 10 s, so dust stayed behind the shed after a gust had passed; it
 * clears in 5 s (picked over 3 s).
 */
export const DUST_LOOK: DustLook = { lift: 2, linger: 5, rise: 0.8, top: 7, head: 1 };
/** How fast the wind must pick up for the head to lift (m/s each second), and how much it lifts over that, per unit of
 * head (an optical depth for each m/s a second over, each second). */
const HEAD_RATE = 1, HEAD_LIFT = 1;
/** How fast it's carried, as a share of the ground air's speed: slower than the air, so a puff reads on screen. */
const CARRY = 0.6;
/** How high it starts (metres over the ground), and a head's share of the top. */
const START = 0.5, HEAD_UP = 0.7;
/** On a new wind, how long to run it with the wind as it is, so the dust is already up rather than starting clean:
 * WARM steps of WARM_DT seconds (8 s, in long steps so it costs only some 20 to 45 ms of the main thread, once). */
const WARM = 20, WARM_DT = 0.4;

/**
 * The fresh dust over the world: the game's map of where it lifts, the field on the CPU, and its last two ticks as
 * textures (RGBA half floats: the optical depth, the ground's height, the dust's top, unused), which the post pass blends
 * between as the wind map's are.
 */
export class DustField {
  readonly a = DustField.texture();
  readonly b = DustField.texture();
  blend = 0;
  /** Where the field lies: its corner (x, z) and 1 over its size (x, z). */
  readonly grid = new THREE.Vector4(0, 0, 1, 1);
  /** Whether there's any fresh dust at all, so the post pass can skip it. */
  any = false;
  /** How much of a dust storm there is, 0..1 (the renderer sets it from the weather as drawn): none, and nothing lifts. */
  storm = 0;
  /** The look (DUST_LOOK). */
  look: DustLook = DUST_LOOK;

  private source: DustSource | null = null;
  /** The source laid on the wind's grid: lift and ground per cell. */
  private lift = new Float32Array(0);
  private ground = new Float32Array(0);
  /** The ground's height, and where clear the dust's top, as half floats (they only change with the source). */
  private groundHalf = new Uint16Array(0);
  private emptyHalf = new Uint16Array(0);
  /** The textures last sent a clear field. */
  private blank = new Set<THREE.DataTexture>();
  /** The optical depth per cell, and that times the dust's height (so the height is carried with the dust). */
  private d = new Float32Array(0);
  private m = new Float32Array(0);
  private d2 = new Float32Array(0);
  private m2 = new Float32Array(0);
  /** The ground air's speed per cell at the last step, for how fast it's picking up (the head); unset after a restart. */
  private speed = new Float32Array(0);
  private speedSet = false;
  /** The wind tick those speeds were read at, so a pick-up is over the time between the winds read, not a step's. */
  private speedTick = 0;
  private nx = 0; private nz = 0; private cell = 1; private x0 = 0; private z0 = 0;
  /** The last tick stepped, and the snapshots the textures hold (by identity, as the wind map). */
  private tick = -1;
  private snapA: WindSnapshot | null = null;
  private snapB: WindSnapshot | null = null;
  private fresh = true;

  private static texture() {
    const t = new THREE.DataTexture(new Uint16Array(4), 1, 1, THREE.RGBAFormat, THREE.HalfFloatType);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  }

  /** The game's map of where dust lifts (a new one when the ground dries or wets, or the world changes); null, none. The
   * dust already up stays up. */
  setSource(source: DustSource | null) {
    this.source = source;
    if (this.nx) this.layLift();
  }

  /** Lays the dust afresh at the next wind, as if the wind had always blown as it does then (a new wind, at once). */
  restart() { this.fresh = true; }

  /** The game's wind this frame, between its last two ticks: steps the dust a tick for each new tick of the wind. */
  set(prev: WindSnapshot, cur: WindSnapshot, alpha: number) {
    this.blend = prev.tick === cur.tick ? 1 : alpha;
    if (cur === this.snapB && prev === this.snapA && !this.fresh) return;
    if (this.nx !== cur.nx || this.nz !== cur.nz || this.cell !== cur.cell || this.x0 !== cur.x0 || this.z0 !== cur.z0) this.lay(cur);
    if (this.fresh || cur.tick < this.tick || cur.tick > this.tick + 10) {
      // A new wind, a jump back or a long way on: the dust as the wind as it is would have it.
      this.d.fill(0); this.m.fill(0); this.any = false; this.speedSet = false;
      for (let i = 0; i < WARM; i++) this.step(cur, WARM_DT);
      this.fresh = false;
      this.upload(this.a); this.upload(this.b);
    } else {
      // A tick or a few on: the earlier one's dust is the later texture's, if it was the last uploaded. Ticks missed
      // between frames (a stall) are stepped with the nearest wind the renderer has: a gust wholly inside one is lost.
      while (this.tick < prev.tick) this.step(prev);
      if (prev === this.snapB) this.swap(); else this.upload(this.a);
      while (this.tick < cur.tick) this.step(cur);
      this.upload(this.b);
    }
    this.tick = cur.tick;
    this.snapA = prev; this.snapB = cur;
  }

  private swap() {
    const t = this.a; (this as { a: THREE.DataTexture }).a = this.b; (this as { b: THREE.DataTexture }).b = t;
  }

  /** The field on the wind's grid, empty, its source laid on it. */
  private lay(s: WindSnapshot) {
    this.nx = s.nx; this.nz = s.nz; this.cell = s.cell; this.x0 = s.x0; this.z0 = s.z0;
    const n = s.nx * s.nz;
    this.grid.set(s.x0, s.z0, 1 / (s.nx * s.cell), 1 / (s.nz * s.cell));
    this.lift = new Float32Array(n); this.ground = new Float32Array(n);
    this.groundHalf = new Uint16Array(n); this.emptyHalf = new Uint16Array(n);
    this.d = new Float32Array(n); this.m = new Float32Array(n); this.d2 = new Float32Array(n); this.m2 = new Float32Array(n);
    this.speed = new Float32Array(n); this.speedSet = false;
    this.layLift();
    this.fresh = true;
  }

  /** The source laid on the field's grid (nearest cell; outside the source, nothing lifts). */
  private layLift() {
    const { nx, nz, cell, x0, z0 } = this;
    this.lift.fill(0);
    // A wind with no map behind it (steadyWind's few huge cells) lifts none. With no map the ground is left as it was,
    // so the dust already up drifts and fades where it is rather than dropping to 0 m.
    const src = cell <= 4 ? this.source : null;
    if (src) this.ground.fill(0);
    if (src) for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const x = x0 + (i + 0.5) * cell, z = z0 + (j + 0.5) * cell;
      const si = Math.floor((x - src.x0) / src.cell), sj = Math.floor((z - src.z0) / src.cell);
      if (si < 0 || sj < 0 || si >= src.nx || sj >= src.nz) continue;
      this.lift[j * nx + i] = src.lift[sj * src.nx + si];
      this.ground[j * nx + i] = src.ground[sj * src.nx + si];
    }
    for (let k = 0; k < this.ground.length; k++) {
      this.groundHalf[k] = half(this.ground[k]); this.emptyHalf[k] = half(this.ground[k] + START);
    }
    // The textures hold the ground too: a clear one must be sent afresh with it.
    this.blank.clear();
    // Ground that's newly bare has no past wind kept (only lifting ground keeps it): no head until the next step.
    this.speedSet = false;
  }

  /**
   * A tick of the wind on the dust: carried along the ground air (traced back from each cell and read between the four
   * cells there), faded as it mixes into the air, risen, and lifted afresh where the ground air is over the threshold.
   */
  private step(s: WindSnapshot, dt = 0.1) {
    this.tick++;
    // No storm and no dust up: nothing to carry or lift (most of the time, so it costs next to nothing).
    if (this.storm <= 0 && !this.any) { this.speedSet = false; return; }
    const { nx, nz } = this, h = this.cell, L = this.look, fade = Math.exp(-dt / L.linger), k = (CARRY * dt) / h;
    const d = this.d, m = this.m, d2 = this.d2, m2 = this.m2, lift = this.lift, su = s.u, sv = s.v, sp = this.speed;
    const threshold = Math.max(DUST_THRESHOLD, GUST_LIFT * s.speed), lifting = this.storm * L.lift * dt;
    const heading = this.speedSet ? this.storm * L.head * HEAD_LIFT : 0, headUp = HEAD_UP * L.top;
    // Over the time since the speeds were kept: a few ticks if stepping on from an older wind after a stall.
    const span = Math.max(dt, (s.tick - this.speedTick) * 0.1);
    const rise = L.rise * dt, top = L.top, xMax = nx - 1, zMax = nz - 1;
    let any = false;
    for (let j = 0, c = 0; j < nz; j++) for (let i = 0; i < nx; i++, c++) {
      const u = su[c], v = sv[c];
      // Where this cell's air was a tick ago, in cells, and the dust there.
      let x = i - u * k, z = j - v * k;
      x = x < 0 ? 0 : x > xMax ? xMax : x; z = z < 0 ? 0 : z > zMax ? zMax : z;
      let i0 = x | 0, j0 = z | 0;
      if (i0 > nx - 2) i0 = nx - 2;
      if (j0 > nz - 2) j0 = nz - 2;
      const fx = x - i0, fz = z - j0, c0 = j0 * nx + i0, c1 = c0 + nx;
      const a0 = d[c0], a1 = d[c0 + 1], a2 = d[c1], a3 = d[c1 + 1];
      let dd = 0, mm = 0;
      if (a0 + a1 + a2 + a3 > 0) {
        const w00 = (1 - fx) * (1 - fz), w10 = fx * (1 - fz), w01 = (1 - fx) * fz, w11 = fx * fz;
        dd = (a0 * w00 + a1 * w10 + a2 * w01 + a3 * w11) * fade;
        mm = (m[c0] * w00 + m[c0 + 1] * w10 + m[c1] * w01 + m[c1 + 1] * w11) * fade;
        // Risen, up to the top.
        mm = Math.min(mm + dd * rise, dd * top);
      }
      // Lifted where the wind is over the threshold.
      const l0 = lift[c];
      if (l0 > 0 && lifting > 0) {
        const w = Math.sqrt(u * u + v * v), over = w - threshold;
        if (over > 0) { const l = (lifting * l0 * over) / (1 + over / 6); dd += l; mm += l * START; }
        // The head: where a gust's front is arriving (the wind picking up fast, near or over the threshold), more, higher.
        const rate = (w - sp[c]) / span - HEAD_RATE;
        if (heading > 0 && rate > 0 && over > -2) { const l = heading * l0 * Math.min(rate, 10) * dt; dd += l; mm += l * headUp; }
        sp[c] = w;
      }
      if (dd < 1e-4) { dd = 0; mm = 0; } else any = true;
      d2[c] = dd; m2[c] = mm;
    }
    this.d = d2; this.m = m2; this.d2 = d; this.m2 = m;
    this.any = any;
    this.speedSet = lifting > 0; this.speedTick = s.tick;
  }

  private upload(t: THREE.DataTexture) {
    const n = this.nx * this.nz;
    let data = t.image.data as Uint16Array;
    if (t.image.width !== this.nx || t.image.height !== this.nz) {
      data = new Uint16Array(n * 4);
      t.image = { data, width: this.nx, height: this.nz };
      t.dispose();
      this.blank.delete(t);
    }
    // A clear field the texture already holds: nothing to send (and the post pass skips it anyway).
    if (!this.any) { if (this.blank.has(t)) return; this.blank.add(t); } else this.blank.delete(t);
    const d = this.d, m = this.m, ground = this.ground, gh = this.groundHalf, eh = this.emptyHalf;
    for (let k = 0, o = 0; k < n; k++, o += 4) {
      const dk = d[k];
      data[o + 1] = gh[k]; data[o + 3] = 0;
      if (dk > 0) { data[o] = half(dk); data[o + 2] = half(ground[k] + m[k] / dk); } else { data[o] = 0; data[o + 2] = eh[k]; }
    }
    t.needsUpdate = true;
  }
}

const f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
/** A float to a half float, quickly, for the fields' values (finite, within a half's range; tiny ones go to 0). */
export function half(x: number) {
  f32[0] = x;
  const b = u32[0], e = (b >>> 23) & 0xff;
  if (e < 113) return (b >>> 16) & 0x8000;
  return ((b >>> 16) & 0x8000) | ((e - 112) << 10) | ((b >>> 13) & 0x3ff);
}
