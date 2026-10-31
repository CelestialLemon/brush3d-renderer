import * as THREE from 'three';

// Wind: the game says how hard and which way it blows; the renderer eases towards that and draws what follows from it.
//
// The game owns the wind and anything it causes (a snapped branch, a flattened field); the renderer only shows it: trees
// leaning and rocking, leaves fluttering, gusts rolling over the grass and through the wheat, chop on the water, and in a
// storm pale leaf undersides and leaves in the air. Weather (#3) will drive this the same way it drives the water.

/** The wind the game asks for. */
export interface Wind {
  /** Metres per second, 0 (calm) to about 35 (hurricane) and beyond. */
  speed: number;
  /** Where it blows towards, radians in the ground plane from +x towards +z. */
  direction: number;
  /** How gusty, 0 (steady) to 1 (squally). Defaults to 0.5. */
  gust?: number;
}

/** Named strengths, in metres per second (about Beaufort 0, 3, 8, 10 and 12). */
export const WIND_SCALE = { calm: 0, breeze: 5, gale: 17, storm: 25, hurricane: 35 } as const;
export type WindStrength = keyof typeof WIND_SCALE;

/** The name of the nearest strength at or below a speed. */
export function windName(speed: number): WindStrength {
  let name: WindStrength = 'calm';
  for (const [k, v] of Object.entries(WIND_SCALE) as [WindStrength, number][]) if (speed >= v - 0.5) name = k;
  return name;
}

/** Seconds the drawn wind takes to close most of the gap to the asked one: trees don't snap to a new wind. */
const EASE = 1.5;

/**
 * The wind as drawn: eased towards the game's, with the phases that move with it integrated over time, so a change of speed
 * changes how fast the patterns move rather than jumping them to where a faster wind would have taken them all along.
 */
export class WindState {
  readonly goal: Required<Wind> = { speed: WIND_SCALE.breeze, direction: Math.atan2(0.6, 1), gust: 0.5 };
  speed = this.goal.speed;
  dirX = Math.cos(this.goal.direction); dirZ = Math.sin(this.goal.direction);
  gust = this.goal.gust;
  /** How far the gusts have rolled downwind (metres, x and z), and the leaves' flutter phase (radians). */
  driftX = 0; driftZ = 0; flutter = 0;
  /** How far a haze's patches have drifted downwind (metres, x and z): slowly, a fog creeps rather than flies (#9). */
  hazeX = 0; hazeZ = 0;
  /** How far dust has been carried downwind (metres, x and z): it flies with the wind (#9). */
  dustX = 0; dustZ = 0;
  private time: number | null = null;

  set(w: Wind, immediate = false) {
    this.goal.speed = Math.max(0, w.speed); this.goal.direction = w.direction; this.goal.gust = w.gust ?? 0.5;
    if (immediate) this.snap();
  }

  /** Puts the drawn wind at the goal, its patterns where a steady wind would have them at the current time. */
  snap() {
    this.speed = this.goal.speed; this.gust = this.goal.gust;
    this.dirX = Math.cos(this.goal.direction); this.dirZ = Math.sin(this.goal.direction);
    this.time = null;
  }

  /** How fast the gust pattern rolls downwind, m/s: slower than the air, so it reads at the game's zooms. */
  static driftSpeed(speed: number) { return 0.8 + 0.4 * speed; }
  /** How fast a haze's patches drift, m/s: a still mist still creeps, a gale drags it along. */
  static hazeSpeed(speed: number) { return 0.12 + 0.1 * speed; }
  /** How fast dust's clouds are carried, m/s: much faster than a fog, but slower than the air, so they read on screen. */
  static dustSpeed(speed: number) { return 0.3 + 0.3 * speed; }
  /** The leaves' flutter rate, radians a second: quicker as the wind rises, but levelling off (Sol's fit, 1.4 Hz in a
   * breeze, 2.4 in a hurricane; slower than real leaves, which would only blur as painted cards). */
  static flutterRate(speed: number) { return 2 * Math.PI * (0.7 + (2.3 * speed) / (speed + 12)); }

  /**
   * Advances to a time in seconds. The first time, and a jump back (a tool seeking), re-anchor the phases to that time. A long
   * frame (a stall, a tab in the background) is taken in steps, so the wind still eases and its patterns carry on from where
   * they were.
   */
  update(time: number) {
    const dt = this.time === null ? -1 : time - this.time;
    this.time = time;
    if (dt < 0) {
      const d = WindState.driftSpeed(this.speed) * time;
      this.driftX = this.dirX * d; this.driftZ = this.dirZ * d;
      const h = WindState.hazeSpeed(this.speed) * time;
      this.hazeX = this.dirX * h; this.hazeZ = this.dirZ * h;
      const s = WindState.dustSpeed(this.speed) * time;
      this.dustX = this.dirX * s; this.dustZ = this.dirZ * s;
      this.flutter = WindState.flutterRate(this.speed) * time;
      return;
    }
    // Fine steps while the wind may still be easing (it has settled after half a minute), then the rest in one.
    const fine = Math.min(dt, 30), n = Math.ceil(fine / 0.1);
    for (let i = 0; i < n; i++) this.step(fine / n);
    if (dt > fine) this.step(dt - fine);
  }

  private step(dt: number) {
    const k = 1 - Math.exp(-dt / EASE);
    this.speed += (this.goal.speed - this.speed) * k;
    this.gust += (this.goal.gust - this.gust) * k;
    // The direction turns the short way round (easing the angle; a wind turned right about turns anticlockwise), and a
    // little slower than the speed changes.
    const now = Math.atan2(this.dirZ, this.dirX);
    let turn = (this.goal.direction - now) % (2 * Math.PI);
    if (turn > Math.PI) turn -= 2 * Math.PI; else if (turn <= -Math.PI) turn += 2 * Math.PI;
    const a = now + turn * k * 0.7;
    this.dirX = Math.cos(a); this.dirZ = Math.sin(a);
    const d = WindState.driftSpeed(this.speed) * dt;
    this.driftX += this.dirX * d; this.driftZ += this.dirZ * d;
    const h = WindState.hazeSpeed(this.speed) * dt;
    this.hazeX += this.dirX * h; this.hazeZ += this.dirZ * h;
    const s = WindState.dustSpeed(this.speed) * dt;
    this.dustX += this.dirX * s; this.dustZ += this.dirZ * s;
    this.flutter += WindState.flutterRate(this.speed) * dt;
  }
}

/**
 * The wind in GLSL. Needs NOISE and the wind uniforms (LIGHT_UNIFORMS). Strengths are in metres per second.
 *   windGust(xz): 0..1, the gusts at a point on the ground, rolling downwind.
 *   windLean(s):  a tree's crown pushed over by the steady wind, as a share of its height: with the square of the speed at
 *                 first, levelling off towards a third (Sol's calibration: 1.3% in a breeze, 12% in a gale, 30% in a hurricane).
 *   windSway(s):  its rocking about that lean, the same measure (most of it by a gale).
 */
export const WIND_GLSL = /* glsl */ `
float windForce() { return clamp(uWindSpeed / 35.0, 0.0, 1.5); }
vec3 windDir3() { return vec3(uWindDir.x, 0.0, uWindDir.y); }
float windGust(vec2 xz) {
  // Two sizes of gust rolling at different speeds, so the pattern changes as it travels rather than sliding as one sheet.
  vec2 q = xz - uWindDrift;
  float g = snoise(q * 0.03) * 0.65 + snoise((xz - uWindDrift * 1.35) * 0.08 + 13.7) * 0.35;
  return clamp(0.5 + g * 0.75 * (0.4 + uWindGustiness * 1.2), 0.0, 1.0);
}
float windLean(float s) { return 0.36 * (1.0 - exp(-(s * s) / 676.0)); }
float windSway(float s) { return 0.003 + 0.045 * (1.0 - exp(-(s * s) / 196.0)); }
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
  return g;
}
