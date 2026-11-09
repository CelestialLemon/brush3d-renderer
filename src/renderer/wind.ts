import * as THREE from 'three';
import { half } from './dust';
import type { WindSnapshot } from '../wind/sim';

// Wind: the game owns it (src/wind, #36) and hands the renderer each tick's snapshot of the living wind over the world; the
// renderer draws exactly that, never easing or altering it. Every material reads the same map: grass and wheat the ground
// air, trees the air at their crowns, the water's chop and dust's surges how hard it blows over them.
//
// The renderer only adds motion no game logic reads: leaves fluttering and trees rocking about their lean, the leaves in
// the air, the water's wavelets and the haze's patches drifting downwind.

/** Named strengths, in metres per second (about Beaufort 0, 3, 8, 10 and 12). */
export const WIND_SCALE = { calm: 0, breeze: 5, gale: 17, storm: 25, hurricane: 35 } as const;
export type WindStrength = keyof typeof WIND_SCALE;

/** The name of the nearest strength at or below a speed. */
export function windName(speed: number): WindStrength {
  let name: WindStrength = 'calm';
  for (const [k, v] of Object.entries(WIND_SCALE) as [WindStrength, number][]) if (speed >= v - 0.5) name = k;
  return name;
}

/** How far dust's streaks are drawn out along the wind (post.ts's fogDust). */
export const STREAK_STRETCH = 6;

/**
 * The height the trees' crowns read the wind at, metres. Up there the gusts are the free air's and a hedge's shelter has
 * faded (see the wind's windAt); the crowns take it in the ground's terms, divided by how much stronger the wind is at
 * that height in the open, so their calibrated lean stays as it was. How much harder the wind pushes up there is the
 * look's to choose (#36).
 */
export const CROWN_HEIGHT = 6;
/** How much stronger the open wind is at CROWN_HEIGHT than at the ground (the wind's height rule, sim.ts's atHeight). */
export const CROWN_PROFILE = 1 + 0.5 * Math.min(1, (CROWN_HEIGHT - 0.75) / 7.25) + 0.01 * Math.max(0, CROWN_HEIGHT - 8);

/**
 * A wind with no simulation behind it: the same everywhere, `speed` m/s towards `direction` (radians from +x towards +z),
 * no gusts. For a scene with no game wind (the profile's cases, a model viewer): renderer.setWind(w, w, 0).
 */
export function steadyWind(speed: number, direction: number): WindSnapshot {
  const dirX = Math.cos(direction), dirZ = Math.sin(direction), n = 4, fill = (v: number) => new Float32Array(n).fill(v);
  return {
    nx: 2, nz: 2, cell: 1e4, x0: -1e4, z0: -1e4, tick: 0, speed, dirX, dirZ, gustiness: 0,
    u: fill(speed * dirX), v: fill(speed * dirZ), k: fill(1), fu: fill(speed * dirX), fv: fill(speed * dirZ),
  };
}

/**
 * The wind's map on the GPU: the last two ticks' snapshots as two textures, each texel a cell's ground air (x, z), which
 * the shaders blend between as the frame falls between the ticks. A new tick is uploaded
 * once (into the older texture), so a frame costs nothing unless the wind has moved on.
 */
export class WindField {
  /** The earlier tick and the later, and the frame's share of the way between them. */
  readonly a = WindField.texture();
  readonly b = WindField.texture();
  blend = 0;
  /** Where the map lies: its corner (x, z) and 1 over its size in metres (x, z). */
  readonly grid = new THREE.Vector4(0, 0, 1, 1);
  /**
   * How hard the ground air usually blows in each cell (m/s), as a texture: its average over the last USUAL seconds, so a
   * gust reads against what's usual just there, behind a hedge or on open ground (cat's paws, #36).
   */
  readonly usual = WindField.texture(THREE.RedFormat);
  /** The snapshots the textures hold (by identity: another wind's snapshot may share a tick number). */
  private snapA: WindSnapshot | null = null;
  private snapB: WindSnapshot | null = null;
  private mean = new Float32Array(0);
  private meanTick = -1;
  private meanGrid = '';
  private meanSnap: WindSnapshot | null = null;
  /** Over how many seconds the usual wind has been taken so far (up to USUAL). */
  private meanSpan = 0;

  private static texture(format: THREE.PixelFormat = THREE.RGFormat) {
    const t = new THREE.DataTexture(new Uint16Array(format === THREE.RGFormat ? 2 : 1), 1, 1, format, THREE.HalfFloatType);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  }

  set(prev: WindSnapshot, cur: WindSnapshot, alpha: number) {
    this.grid.set(cur.x0, cur.z0, 1 / (cur.nx * cur.cell), 1 / (cur.nz * cur.cell));
    if (cur !== this.snapB || prev !== this.snapA) {
      // The later texture becomes the earlier when the wind has moved on a tick: only the new tick is uploaded.
      if (prev === this.snapB) {
        const t = this.a; (this as { a: THREE.DataTexture }).a = this.b; (this as { b: THREE.DataTexture }).b = t;
      } else WindField.upload(this.a, prev);
      this.snapA = prev;
      WindField.upload(this.b, cur); this.snapB = cur;
      this.updateUsual(cur);
    }
    this.blend = prev.tick === cur.tick ? 1 : alpha;
  }

  private static upload(t: THREE.DataTexture, s: WindSnapshot) {
    const n = s.nx * s.nz;
    let data = t.image.data as Uint16Array;
    if (t.image.width !== s.nx || t.image.height !== s.nz) {
      data = new Uint16Array(n * 2);
      t.image = { data, width: s.nx, height: s.nz };
      t.dispose();
    }
    for (let k = 0; k < n; k++) {
      data[k * 2] = half(s.u[k]); data[k * 2 + 1] = half(s.v[k]);
    }
    t.needsUpdate = true;
  }

  /**
   * The usual wind carried on to a new snapshot; laid afresh on another map, a jump back or a long way on, or a new wind
   * at the same tick (a new wind, or steadyWind's, which are all tick 0).
   */
  private updateUsual(s: WindSnapshot) {
    if (s === this.meanSnap) return;
    this.meanSnap = s;
    const n = s.nx * s.nz, t = this.usual, grid = `${s.nx} ${s.nz} ${s.cell} ${s.x0} ${s.z0}`;
    let mean = this.mean;
    if (grid !== this.meanGrid || s.tick <= this.meanTick || s.tick > this.meanTick + 50) {
      this.meanGrid = grid;
      // Laid as the air is now; then a plain mean of what has come since, until it spans USUAL seconds, so it settles in
      // a few seconds rather than reading the whole map as gusty (or calm) for the first half minute.
      mean = this.mean = new Float32Array(n);
      for (let c = 0; c < n; c++) mean[c] = Math.hypot(s.u[c], s.v[c]);
      this.meanSpan = 0.1;
    } else {
      const dt = (s.tick - this.meanTick) * 0.1;
      this.meanSpan = Math.min(USUAL, this.meanSpan + dt);
      const a = Math.max(dt / this.meanSpan, 1 - Math.exp(-dt / USUAL));
      for (let c = 0; c < n; c++) { const u = s.u[c], v = s.v[c]; mean[c] += (Math.sqrt(u * u + v * v) - mean[c]) * a; }
    }
    this.meanTick = s.tick;
    let data = t.image.data as Uint16Array;
    if (t.image.width !== s.nx || t.image.height !== s.nz) {
      data = new Uint16Array(n);
      t.image = { data, width: s.nx, height: s.nz };
      t.dispose();
    }
    for (let c = 0; c < n; c++) data[c] = half(mean[c]);
    t.needsUpdate = true;
  }
}

/** Over how long the usual wind is taken, seconds: several gusts and lulls. */
const USUAL = 20;

/** One frame the haze's patches lie in (see WindState.haze). */
export interface HazeFrame {
  /** The heading they were laid along (a unit vector, x and z), and how far they're drawn out along it. */
  hx: number; hz: number; stretch: number;
  /** How far the patches and dust's streaks have drifted along it, in the frame (metres over the stretch). */
  drift: number; streak: number;
}

/** A turn further than this from the patches' heading (its cosine), or a change of stretch beyond STRETCH_CHANGE, lays
 * new patches along the wind as it is, fading in over HAZE_FADE seconds, as the wind's gusts do. */
const HAZE_TURN = Math.cos((25 * Math.PI) / 180);
const STRETCH_CHANGE = 1.3;
const HAZE_FADE = 6;

/**
 * The wind as drawn, from the game's snapshots: its strength, heading and gustiness as a whole (the game's, eased by the
 * game), and the renderer's own motion integrated over time, so a change of speed changes how fast things move rather than
 * jumping them to where a faster wind would have taken them all along.
 */
export class WindState {
  speed = 0;
  dirX = 1; dirZ = 0;
  gust = 0;
  /** How far the leaves in the air have been carried downwind (metres, x and z), and the leaves' flutter phase (radians). */
  driftX = 0; driftZ = 0; flutter = 0;
  /**
   * The haze's patches (#9): drawn out along the wind and drifting along it, slowly (a fog creeps rather than flies; dust
   * is carried, and a fog turning to dust speeds up). Each frame of patches keeps its heading and stretch while it lasts;
   * when the wind turns well away or strengthens a lot, new patches are laid along the wind as it is and fade in while the
   * old fade out (fade, 0..1), so a turn never swings the patches round the map (#36).
   */
  haze: HazeFrame = { hx: 1, hz: 0, stretch: 1, drift: 0, streak: 0 };
  hazeNext: HazeFrame | null = null;
  hazeFade = 0;
  /** How far the haze is dust, 0..1: the renderer sets it from the weather as drawn. */
  carried = 0;
  private time: number | null = null;

  /** The game's wind this frame, between its last two ticks. */
  set(prev: WindSnapshot, cur: WindSnapshot, alpha: number) {
    const t = prev.tick === cur.tick ? 1 : alpha, mix = (a: number, b: number) => a + (b - a) * t;
    this.speed = mix(prev.speed, cur.speed); this.gust = mix(prev.gustiness, cur.gustiness);
    const x = mix(prev.dirX, cur.dirX), z = mix(prev.dirZ, cur.dirZ), l = Math.hypot(x, z) || 1;
    this.dirX = x / l; this.dirZ = z / l;
  }

  /** How fast the leaves in the air are carried downwind, m/s: slower than the air, so they read at the game's zooms. */
  static driftSpeed(speed: number) { return 0.8 + 0.4 * speed; }
  /** How fast a haze's patches drift, m/s: a still mist still creeps, a gale drags it along. */
  static hazeSpeed(speed: number) { return 0.12 + 0.1 * speed; }
  /** How fast dust's clouds are carried, m/s: much faster than a fog, but slower than the air, so they read on screen. */
  static dustSpeed(speed: number) { return 0.3 + 0.3 * speed; }
  /** How far a haze's patches are drawn out along the wind (1 not at all): dust further. */
  static hazeStretch(speed: number, carried: number) { return 1 + (speed / 10) * (1 + carried); }
  /** How fast the haze's patches drift now, m/s: a fog's speed or dust's, by how far it's dust. */
  private hazeRate() { return THREE.MathUtils.lerp(WindState.hazeSpeed(this.speed), WindState.dustSpeed(this.speed), this.carried); }
  /** How fast dust's streaks blow, m/s: twice dust's speed. */
  private streakRate() { return 2 * WindState.dustSpeed(this.speed); }
  /** The leaves' flutter rate, radians a second: quicker as the wind rises, but levelling off (Sol's fit, 1.4 Hz in a
   * breeze, 2.4 in a hurricane; slower than real leaves, which would only blur as painted cards). */
  static flutterRate(speed: number) { return 2 * Math.PI * (0.7 + (2.3 * speed) / (speed + 12)); }

  /** New patches laid along the wind as it is now. */
  private hazeFrame(drift = 0, streak = 0): HazeFrame {
    return { hx: this.dirX, hz: this.dirZ, stretch: WindState.hazeStretch(this.speed, this.carried), drift, streak };
  }

  /** Lays the motion afresh at the next update, as if the wind had always blown as it does then (a new wind, at once). */
  restart() { this.time = null; }

  /**
   * Advances to a time in seconds. The first time, and a jump back (a tool seeking), re-anchor the motion to that time. A
   * long frame (a stall, a tab in the background) is taken in steps, so the motion carries on from where it was.
   */
  update(time: number) {
    const dt = this.time === null ? -1 : time - this.time;
    this.time = time;
    if (dt < 0) {
      const d = WindState.driftSpeed(this.speed) * time;
      this.driftX = this.dirX * d; this.driftZ = this.dirZ * d;
      this.haze = this.hazeFrame();
      this.haze.drift = (this.hazeRate() * time) / this.haze.stretch;
      this.haze.streak = (this.streakRate() * time) / STREAK_STRETCH;
      this.hazeNext = null; this.hazeFade = 0;
      this.flutter = WindState.flutterRate(this.speed) * time;
      return;
    }
    const n = Math.ceil(Math.min(dt, 30) / 0.1);
    for (let i = 0; i < n; i++) this.step(dt / n);
  }

  private step(dt: number) {
    const d = WindState.driftSpeed(this.speed) * dt;
    this.driftX += this.dirX * d; this.driftZ += this.dirZ * d;
    this.flutter += WindState.flutterRate(this.speed) * dt;
    for (const f of this.hazeNext ? [this.haze, this.hazeNext] : [this.haze]) {
      f.drift += (this.hazeRate() * dt) / f.stretch;
      f.streak += (this.streakRate() * dt) / STREAK_STRETCH;
    }
    if (this.hazeNext) {
      this.hazeFade = Math.min(1, this.hazeFade + dt / HAZE_FADE);
      if (this.hazeFade >= 1) { this.haze = this.hazeNext; this.hazeNext = null; this.hazeFade = 0; }
    } else {
      const h = this.haze, ratio = WindState.hazeStretch(this.speed, this.carried) / h.stretch;
      if (this.dirX * h.hx + this.dirZ * h.hz < HAZE_TURN || ratio > STRETCH_CHANGE || ratio < 1 / STRETCH_CHANGE) {
        // Started part way along, so the new patches aren't the old ones' noise laid at another angle.
        this.hazeNext = this.hazeFrame(h.drift + 37.1, h.streak + 53.3); this.hazeFade = 0;
      }
    }
  }
}

/** The wind's map, as GLSL uniforms (WIND_GLSL has them). */
const WIND_UNIFORMS = /* glsl */ `
uniform sampler2D tWindA;    // the game's wind map at its earlier tick and its later (see WindField)
uniform sampler2D tWindB;
uniform sampler2D tWindUsual; // how hard the ground air usually blows there (m/s, see WindField.usual)
uniform float uWindBlend;    // the frame's share of the way between them
uniform vec4 uWindGrid;      // the map's corner (x, z) and 1 over its size (x, z)
uniform float uWindOn;       // 1, or 0 to read a still wind (the shelter map's pass)
`;

/**
 * The wind in GLSL, with the map's uniforms. Needs uWindSpeed and uWindDir (LIGHT_UNIFORMS has them). Strengths are in metres per second.
 *   windGround(xz): the ground air's velocity (x, z) at a point, from the game's map, between its last two ticks.
 *   windGust(xz):   0..1, how hard it blows at a point against the wind's average: 0.5 at the average, 1 at twice it.
 *   windGustHere(xz): how hard it blows at a point against how hard it usually blows just there: 1 as usual.
 */
export const WIND_GLSL = /* glsl */ `
${WIND_UNIFORMS}
float windForce() { return clamp(uWindSpeed / 35.0, 0.0, 1.5); }
vec3 windDir3() { return vec3(uWindDir.x, 0.0, uWindDir.y); }
vec2 windGround(vec2 xz) {
  vec2 uv = (xz - uWindGrid.xy) * uWindGrid.zw;
  return mix(texture2D(tWindA, uv).xy, texture2D(tWindB, uv).xy, uWindBlend) * uWindOn;
}
// A wind's direction as a vector in the ground plane, or the wind's as a whole where it's still.
vec3 windDirOf(vec2 w) { float l = length(w); return l > 0.01 ? vec3(w.x, 0.0, w.y) / l : windDir3(); }
// How hard it blows at a point against how hard it usually blows there: 1 as usual, more in a gust.
float windGustHere(vec2 xz) {
  vec2 uv = (xz - uWindGrid.xy) * uWindGrid.zw;
  return length(windGround(xz)) / max(texture2D(tWindUsual, uv).x, 0.3);
}
float windGust(vec2 xz) { return clamp(0.5 * length(windGround(xz)) / max(uWindSpeed, 0.5), 0.0, 1.0); }
`;


/**
 * The leaves the wind can lift: cards for the 'debris' kind (see DEBRIS_VERT), each with three random numbers for where it is
 * and a seed, in autumn-to-summer leaf colours. How many fly depends on the wind; these are all there could be.
 */
export function leafStorm(count = 5000): THREE.BufferGeometry {
  let a = 0x9e3779b9;
  const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const colours = [0x5a9a3a, 0x7fae3e, 0xa8b04a, 0xc8a040, 0xb07a3a, 0x8a6a3a].map((c) => new THREE.Color(c));
  const pos: number[] = [], nrm: number[] = [], col: number[] = [], paint: number[] = [], card: number[] = [], uv: number[] = [], index: number[] = [];
  for (let i = 0; i < count; i++) {
    const p = [rand(), rand(), rand()], seed = rand(), size = 0.06 + rand() * 0.06;
    const c = colours[Math.floor(rand() * colours.length)].clone().offsetHSL((rand() - 0.5) * 0.03, 0, (rand() - 0.5) * 0.08);
    for (const [cx, cy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      pos.push(...p); nrm.push(0, 1, 0); col.push(c.r, c.g, c.b); paint.push(0.3, 0.5, -1, 0.4); card.push(cx, cy, size, seed); uv.push(0, 0);
    }
    const v = i * 4;
    index.push(v, v + 1, v + 2, v, v + 2, v + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aPaint', new THREE.Float32BufferAttribute(paint, 4));
  g.setAttribute('aCard', new THREE.Float32BufferAttribute(card, 4));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(new THREE.Uint32BufferAttribute(index, 1));
  g.userData.colours = col.slice();
  return g;
}

/**
 * Turns the leaves in the air to a season's colours (#13, once per level; no season: back to the ones they were built with).
 * Each leaf keeps its own place in the colours (a share through them chosen once), so a level's leaves don't jump between
 * looks; the palette's colours are sRGB.
 */
export function colourLeafStorm(g: THREE.BufferGeometry, palette: readonly number[] | null) {
  const attr = g.getAttribute('color') as THREE.BufferAttribute;
  const out = attr.array as Float32Array;
  if (!palette) { out.set(g.userData.colours as number[]); attr.needsUpdate = true; return; }
  let a = 0x51ed2701;
  const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const colours = palette.map((c) => new THREE.Color(c));
  for (let i = 0; i < out.length; i += 12) {
    const c = colours[Math.floor(rand() * colours.length)].clone().offsetHSL((rand() - 0.5) * 0.03, 0, (rand() - 0.5) * 0.08);
    for (let k = 0; k < 4; k++) { out[i + k * 3] = c.r; out[i + k * 3 + 1] = c.g; out[i + k * 3 + 2] = c.b; }
  }
  attr.needsUpdate = true;
}
