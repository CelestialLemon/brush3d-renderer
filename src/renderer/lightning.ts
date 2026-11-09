import * as THREE from 'three';
import type { SharedUniforms } from './materials';

// Lightning (#12): the game says where and when (strike, flicker; epic #3), because strikes will have gameplay; the renderer
// draws it. A strike lights the whole picture cold white for a split second, draws a bolt and leaves a glow where it landed.
// A flicker is distant lightning: the scene softly lit with no bolt.
//
// The flash is the very last thing done to the picture: the finished, graded colour mixed towards a cold white by a weight
// (post.ts, lightningOver). So however the hour, the weather or the exposure are set, it can't lift a pixel's brightness by
// more than its weight: a promise the scene's light uniforms couldn't make. Nothing new is drawn in the scene's passes and
// nothing compiles when it starts.
//
// Safe by default (the developer's requirement; numbers from Sol against WCAG 2.2, ITU-R BT.1702-3, Ofcom, #12): a flash that
// counts as one (the whole-picture lift of Full) goes through FlashGovernor, whatever the game asks. A strike held back still
// lands: its bolt and glow draw, only the picture doesn't flash again; nothing is queued or delayed. Gentle's swell and a
// far flicker stay under 0.05 on the finished picture, half of what counts as a flash at all (a 0.10 swing), so they don't
// count against the limit. Times are real seconds: a game at 4x speed can't flash faster.

/** Where a strike lands; the game's to say. `y`: the height it lands at if not the land's (a rod, a roof). */
export interface Strike { x: number; z: number; y?: number; strength?: number; seed?: number }
/** A distant flicker: how strong (0..1), and the bearing it's from (radians, from +x towards +z); left out, one's picked. */
export interface Flicker { strength?: number; bearing?: number }
/** The player's setting: full; gentle (one soft, slow swell); off (the picture doesn't light up, the bolt and glow still show). */
export type FlashSetting = 'full' | 'gentle' | 'off';
export type LookPick = 'a' | 'b' | 'c';

/** A pulse of the flash level: how bright (0..1 of its setting's peak), how it rises, holds and falls (seconds). */
interface PulseShape { peak: number; rise: number; hold: number; fall: number }

/**
 * The flash limits (FlashGovernor; see #12 for the sources). Every whole-picture flash that counts: at most two in any
 * rolling second, 0.6 s apart, and at most two in any rolling ten. Published limits are three in a second over 25% of the
 * screen; two and the gap keep a margin, and the ten-second budget stops an endless storm strobing.
 */
export const FLASH_LIMIT = { perSecond: 2, minGap: 0.6, perTen: 2 };

/** The most the flash may lift a pixel of the finished picture (relative luminance, 0..1). */
export const FULL_PEAK = 0.2, FULL_MOST = 0.25, GENTLE_PEAK = 0.05, FAR_PEAK = 0.03;

/** A flash look (the developer picks one of three, #12): how the weight falls over the picture, and how far colours go cold. */
interface FlashLook { style: number; tint: number; shadows: boolean; base: number; poolRadius: number }
const FLASH_LOOKS: Record<LookPick, FlashLook> = {
  // A: the whole sky lights up: even, cold, the shapes staying in their colours.
  a: { style: 0, tint: 0.3, shadows: false, base: 1, poolRadius: 30 },
  // B: the bolt's own light: sharp shadows thrown from it (under a closed sky, where the sun casts none to give way).
  b: { style: 1, tint: 0.4, shadows: true, base: 1, poolRadius: 30 },
  // C: a pool of light round the bolt, the far land only dimly lifted.
  c: { style: 2, tint: 0.35, shadows: false, base: 0.35, poolRadius: 26 },
};
/** How cold the toned-down flash turns the colours, at its peak. */
const GENTLE_TINT = 0.25;
/** The shadow map turns to the bolt only while the flash is above this share of its peak. */
const AIM_LEVEL = 0.15;
/** How much of the sun's cast shadow a closed sky has taken away (uOvercast.y): under it, what's left is too soft to miss. */
const CLOSED_SKY = 0.35;

/** Full's one flash (no return strokes in the whole picture: each would count as a flash of its own). */
const FULL: PulseShape = { peak: 1, rise: 0, hold: 0.05, fall: 0.25 };
/** Gentle's one swell, and a far flicker's. */
const GENTLE: PulseShape = { peak: 1, rise: 0.4, hold: 0, fall: 0.8 };
const FAR: PulseShape = { peak: 1, rise: 0.3, hold: 0, fall: 0.7 };

/** How the far lightning lights the scene (the developer picks one of three, #12): its pattern. */
const FAR_LOOKS: Record<LookPick, number> = {
  // The whole picture lifts, evenly.
  a: 0,
  // Brighter on the side it's from.
  b: 1,
  // In big soft patches, as if the cloud lit up from inside.
  c: 2,
};

/** How a bolt is drawn (three to pick from). */
const BOLT_STYLE: Record<LookPick, number> = { a: 0, b: 1, c: 2 };
/** How jagged (how far a point is pushed aside, per metre it climbs, and at most, metres), how wide (px at 1080p at the reference zoom) and how many branches. */
const BOLT_SHAPE: Record<LookPick, { jag: number; most: number; width: number; branches: number }> = {
  // A thin, hot wire with a soft blue halo and many small jags.
  a: { jag: 0.62, most: 2.6, width: 21, branches: 3 },
  // Inked: a bold zigzag, a flat pale fill with a dark line round it.
  b: { jag: 1.05, most: 4.2, width: 15, branches: 2 },
  // Painted: a brush stroke with ragged edges and paint dragged off it.
  c: { jag: 0.7, most: 3, width: 18, branches: 3 },
};

/** The glow left where it struck (three to pick from): linear colour, seconds, its radius (m) and its shape. */
interface GlowLook { color: [number, number, number]; time: number; radius: number; ring: number; burn: number; brush: number }
/**
 * The most a glow may lift (and a burn take off) a pixel of the finished picture. Toned down, it's 0.03 here and about 0.06
 * for the bolt (BOLT_CAP), a little more where the jagged bolt crosses itself: tools/flash.ts holds it under 0.15 on all but
 * 0.05% of the screen, once in over half a second. It has to show where the strike landed (the developer's decision, #12).
 */
const GLOW_CAP: Record<FlashSetting, [number, number]> = { full: [FULL_MOST, 0.75], gentle: [0.03, 0.03], off: [0.03, 0.03] };
const GLOW_LOOKS: Record<LookPick, GlowLook> = {
  // Warm embers, broken by the brush.
  a: { color: [1, 0.55, 0.18], time: 2.6, radius: 1.9, ring: 0, burn: 0, brush: 0.55 },
  // A cold ring opening out and gone quickly.
  b: { color: [0.55, 0.72, 1], time: 1, radius: 1.5, ring: 1, burn: 0, brush: 0.3 },
  // A dark burnt patch with an ember rim, slow to fade.
  c: { color: [1, 0.48, 0.14], time: 7, radius: 2.3, ring: 0, burn: 0.75, brush: 0.5 },
};

/** The most bolts in the air and glows on the land at once; a further one takes the oldest's place. */
const MAX_BOLTS = 4, MAX_GLOWS = 4;
/**
 * How soon after one another bolts and glows may start (s), however many strikes are called: under three a second at full.
 * Toned down, longer than a soft bolt lives, so two can never add up on one spot.
 */
const LOCAL_GAP: Record<FlashSetting, number> = { full: 0.35, gentle: 0.6, off: 0.6 };
/** How high a bolt goes (m), far enough to leave the top of any view. */
const BOLT_HEIGHT = 90;
/** Points along the trunk and along each branch (a power of two, plus one). */
const TRUNK = 65, BRANCH = 17, BRANCHES = 3;

/** How much of the finished picture a bolt may cover, by setting (sRGB: about half of it in brightness, 0.12 about 0.06). */
const BOLT_CAP: Record<FlashSetting, number> = { full: 1, gentle: 0.12, off: 0.12 };
/** Full's bolt: it flares, and once again on its own about 90 ms on. It covers a sliver of the screen, not the picture. */
const BOLT_FLARES: { at: number; shape: PulseShape }[] = [
  { at: 0, shape: { peak: 1, rise: 0, hold: 0.06, fall: 0.16 } },
  { at: 0.09, shape: { peak: 0.6, rise: 0, hold: 0.02, fall: 0.14 } },
];
/** Toned down, one soft rise and fall, however it's asked for. */
const BOLT_SOFT: PulseShape = { peak: 1, rise: 0.06, hold: 0.05, fall: 0.45 };
const BOLT_LIFE = 0.3, BOLT_SOFT_LIFE = 0.56;

function mulberry(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Keeps the flashes safe whatever is asked: a new flash is allowed only if fewer than perSecond have started in the last
 * second, the last was at least minGap ago, and fewer than perTen in the last ten seconds. Pure: it's told the time. A
 * request refused is simply not flashed; nothing is queued, so it can't come back later. Its history stays when the setting
 * changes (a player can't get a fresh allowance by switching it).
 */
export class FlashGovernor {
  private rises: number[] = [];
  admit(now: number) {
    // Both ends count: a flash exactly ten seconds after another is in its window.
    this.rises = this.rises.filter((t) => now - t <= 10);
    const inSecond = this.rises.filter((t) => now - t <= 1).length, last = this.rises[this.rises.length - 1];
    if (inSecond >= FLASH_LIMIT.perSecond || this.rises.length >= FLASH_LIMIT.perTen || (last !== undefined && now - last < FLASH_LIMIT.minGap)) return false;
    this.rises.push(now);
    return true;
  }
}

/** A flash of the whole picture (a strike's, or its toned-down swell), or a far flicker's swell. */
interface Pulse { start: number; shape: PulseShape; weight: number; strike: boolean }
interface Bolt { start: number; strength: number; soft: boolean }
interface Glow { x: number; y: number; z: number; start: number; strength: number }

/** A pulse's level `age` seconds after it started: rise, hold, then a fall reaching exactly nothing. */
function pulseLevel(p: PulseShape, age: number) {
  if (age < 0) return 0;
  if (age < p.rise) return (p.peak * age) / p.rise;
  if (age < p.rise + p.hold) return p.peak;
  return p.peak * Math.max(0, 1 - (age - p.rise - p.hold) / p.fall) ** 1.5;
}
const pulseEnd = (p: PulseShape) => p.rise + p.hold + p.fall;

export class Lightning {
  /** The player's setting (settings menu, #12). Takes effect from the next flash; off takes effect at once. */
  setting: FlashSetting = 'full';
  /** The looks in the running (the developer picks, #12). */
  looks: { flash: LookPick; bolt: LookPick; glow: LookPick; far: LookPick } = { flash: 'a', bolt: 'a', glow: 'a', far: 'a' };
  /** The clock, in real seconds. The tools set their own. */
  clock: () => number = () => performance.now() / 1000;

  private governor = new FlashGovernor();
  private flash: Pulse | null = null;
  private farSwell: Pulse | null = null;
  private bolts: (Bolt | null)[] = new Array(MAX_BOLTS).fill(null);
  private nextBolt = 0;
  private glows: (Glow | null)[] = new Array(MAX_GLOWS).fill(null);
  private nextGlow = 0;
  private lastBolt = -Infinity;
  private lastGlow = -Infinity;
  private seed = 1;
  /** How far through its shape the strike's flash is (0..1), as of the last update. */
  level = 0;
  /** The direction of the bolt's light this frame, when the shadow map is aimed at it. */
  readonly boltLight = new THREE.Vector3(0, 1, 0);
  /** Whether the shadow map is aimed at the bolt this frame. */
  aiming = false;
  private farDir = new THREE.Vector2(1, 0);
  private strikePoint = new THREE.Vector3();
  private center = new THREE.Vector3();
  /** Whether anything's lit now, and whether the bolts are to draw. */
  active = false;
  private boltsLive = false;

  /** For the post pass. */
  readonly post = {
    uFlashOn: { value: 0 },
    uFlashW: { value: 0 },         // how far the strike's flash lifts the picture
    uFlashStyle: { value: 0 },     // 0 even, 1 thrown from the bolt, 2 a pool round it
    uFlashAimed: { value: 0 },     // whether the shadow map is the bolt's
    uFlashTint: { value: 0 },      // how far colours go cold
    uFlashPool: { value: new THREE.Vector4() },  // x, z, radius (m), what's left far from it
    uFlashFar: { value: new THREE.Vector4() },   // its bearing, how far it lifts the picture, its pattern
    uFarCenter: { value: new THREE.Vector2() },
    uGlows: { value: Array.from({ length: MAX_GLOWS }, () => new THREE.Vector4()) },
    uGlowAge: { value: new Array(MAX_GLOWS).fill(0) },
    uGlowN: { value: 0 },
    uGlowColor: { value: new THREE.Vector4() },
    uGlowShape: { value: new THREE.Vector4() },
    uGlowCap: { value: new THREE.Vector2() },
  };

  readonly boltScene = new THREE.Scene();
  private boltMesh: THREE.Mesh;
  private boltMaterial: THREE.ShaderMaterial;
  private geo: THREE.BufferGeometry;
  private boltU = {
    tAux: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uBoltGlow: { value: new Array(MAX_BOLTS).fill(0) },
    uBoltCap: { value: 1 },
    uBoltPx: { value: 1 },
    uBoltStyle: { value: 0 },
    uHaze: { value: new THREE.Color() },
    uTick: { value: 0 },
  };

  constructor() {
    this.geo = new THREE.BufferGeometry();
    const perBolt = (TRUNK + BRANCH * BRANCHES) * 2, n = perBolt * MAX_BOLTS;
    for (const [name, size] of [['position', 3], ['aPrev', 3], ['aNext', 3], ['aInfo', 4]] as const) {
      const a = new THREE.BufferAttribute(new Float32Array(n * size), size);
      a.setUsage(THREE.DynamicDrawUsage);
      this.geo.setAttribute(name, a);
    }
    // The strips' triangles, the same whatever the shape: a trunk and its branches for every bolt.
    const index: number[] = [];
    for (let b = 0; b < MAX_BOLTS; b++) {
      let at = b * perBolt;
      const strip = (points: number) => {
        for (let i = 0; i < points - 1; i++) {
          const v = at + i * 2;
          index.push(v, v + 1, v + 2, v + 2, v + 1, v + 3);
        }
        at += points * 2;
      };
      strip(TRUNK);
      for (let j = 0; j < BRANCHES; j++) strip(BRANCH);
    }
    this.geo.setIndex(index);
    this.geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
    this.boltMaterial = new THREE.ShaderMaterial({
      vertexShader: BOLT_VERT, fragmentShader: BOLT_FRAG, uniforms: this.boltU, transparent: true, depthTest: false, depthWrite: false,
      side: THREE.DoubleSide,
      // Premultiplied: the alpha covers (the inked fill), what's added over it glows.
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    });
    this.boltMesh = new THREE.Mesh(this.geo, this.boltMaterial);
    this.boltMesh.frustumCulled = false;
    this.boltScene.add(this.boltMesh);
  }

  /** A strike lands where the game says. `ground` gives the land's height there if `y` isn't given. */
  strike(s: Strike, ground: (x: number, z: number) => number, view: THREE.Vector3, heading: number) {
    const now = this.clock(), strength = THREE.MathUtils.clamp(s.strength ?? 1, 0, 1), y = s.y ?? ground(s.x, s.z);
    const seed = s.seed ?? (this.seed = (this.seed * 48271) % 2147483647);
    // The bolt and the glow, whatever the setting and whether the picture may flash: each is small on the screen, and a
    // strike must show where it landed (it's the game's event).
    if (now - this.lastBolt >= LOCAL_GAP[this.setting]) {
      this.lastBolt = now;
      const slot = this.nextBolt; this.nextBolt = (slot + 1) % MAX_BOLTS;
      this.bolts[slot] = { start: now, strength, soft: this.setting !== 'full' };
      this.buildBolt(slot, s.x, y, s.z, seed, BOLT_SHAPE[this.looks.bolt], heading);
    }
    if (now - this.lastGlow >= LOCAL_GAP[this.setting]) {
      this.lastGlow = now;
      const g = this.nextGlow; this.nextGlow = (g + 1) % MAX_GLOWS;
      this.glows[g] = { x: s.x, y, z: s.z, start: now, strength };
    }
    if (this.setting === 'off') return;
    // A strike far from the view lights the picture less.
    const scale = strength * (1 - 0.6 * THREE.MathUtils.smoothstep(Math.hypot(s.x - view.x, s.z - view.z), 30, 200));
    if (this.setting === 'full') {
      if (this.governor.admit(now)) {
        this.flash = { start: now, shape: FULL, weight: FULL_PEAK * scale, strike: true };
        // Only a flash let through moves the light: one held back mustn't move the one still fading.
        this.strikePoint.set(s.x, y, s.z);
      }
    } else if (!this.flash || now - this.flash.start >= pulseEnd(this.flash.shape)) {
      // One swell at a time: a strike during one neither restarts nor lengthens it.
      this.flash = { start: now, shape: GENTLE, weight: GENTLE_PEAK * scale, strike: false };
    }
  }

  /** A distant flicker: light with no bolt. One swell at a time, as a toned-down strike's. */
  flicker(f: Flicker = {}) {
    if (this.setting === 'off') return;
    const now = this.clock();
    if (this.farSwell && now - this.farSwell.start < pulseEnd(this.farSwell.shape)) return;
    const bearing = f.bearing ?? (this.seed = (this.seed * 48271) % 2147483647) / 2147483647 * Math.PI * 2;
    this.farDir.set(Math.cos(bearing), Math.sin(bearing));
    this.farSwell = { start: now, shape: FAR, weight: FAR_PEAK * THREE.MathUtils.clamp(f.strength ?? 1, 0, 1), strike: false };
  }

  /** The flashes, bolts and glows as of now: called once a frame before the look. */
  update(view: THREE.Vector3, zoom: number, width: number, height: number, aux: THREE.Texture) {
    const now = this.clock(), pu = this.post;
    this.center.copy(view);
    // Turning the flashes off takes effect at once.
    if (this.setting === 'off') this.flash = this.farSwell = null;
    const age = (p: Pulse | null) => (p && now - p.start < pulseEnd(p.shape) ? pulseLevel(p.shape, now - p.start) : 0);
    const level = age(this.flash), far = age(this.farSwell);
    if (level <= 0 && this.flash && now - this.flash.start >= pulseEnd(this.flash.shape)) this.flash = null;
    if (far <= 0 && this.farSwell && now - this.farSwell.start >= pulseEnd(this.farSwell.shape)) this.farSwell = null;
    this.level = this.flash?.strike ? level : 0;
    const look = FLASH_LOOKS[this.looks.flash], strike = this.flash?.strike ?? false;
    pu.uFlashW.value = level * (this.flash?.weight ?? 0);
    pu.uFlashStyle.value = strike ? look.style : 0;
    pu.uFlashTint.value = strike ? look.tint * level : level * GENTLE_TINT;
    pu.uFlashPool.value.set(this.strikePoint.x, this.strikePoint.z, look.poolRadius, look.base);
    pu.uFlashFar.value.set(this.farDir.x, this.farDir.y, far * (this.farSwell?.weight ?? 0), FAR_LOOKS[this.looks.far]);
    pu.uFarCenter.value.set(this.center.x, this.center.z);
    // The bolts.
    const shape = BOLT_SHAPE[this.looks.bolt];
    let live = false;
    this.bolts.forEach((b, i) => {
      const bolt = b === null ? -1 : now - b.start;
      if (b === null || bolt > (b.soft ? BOLT_SOFT_LIFE : BOLT_LIFE)) { this.boltU.uBoltGlow.value[i] = 0; this.bolts[i] = null; return; }
      live = true;
      let v = 0;
      if (b.soft) v = pulseLevel(BOLT_SOFT, bolt);
      else for (const f of BOLT_FLARES) v = Math.max(v, pulseLevel(f.shape, bolt - f.at));
      this.boltU.uBoltGlow.value[i] = v * b.strength;
    });
    this.boltsLive = live;
    this.boltMesh.visible = live;
    if (live) {
      const u = this.boltU;
      u.uRes.value.set(width, height);
      u.tAux.value = aux;
      u.uBoltCap.value = BOLT_CAP[this.setting];
      u.uBoltPx.value = shape.width * Math.sqrt(zoom / 44) * (height / 1080);
      u.uBoltStyle.value = BOLT_STYLE[this.looks.bolt];
      u.uTick.value = now % 100;
    }
    // The glows.
    const gl = GLOW_LOOKS[this.looks.glow];
    let n = 0;
    for (const g of this.glows) {
      if (!g) continue;
      const a = (now - g.start) / gl.time;
      if (a >= 1) continue;
      pu.uGlows.value[n].set(g.x, g.y, g.z, g.strength * Math.pow(1 - a, 2) * Math.min(1, (now - g.start) / 0.12));
      pu.uGlowAge.value[n] = a;
      n++;
    }
    pu.uGlowN.value = n;
    const Y = 0.2126 * gl.color[0] + 0.7152 * gl.color[1] + 0.0722 * gl.color[2];
    pu.uGlowColor.value.set(gl.color[0] / Y, gl.color[1] / Y, gl.color[2] / Y, gl.burn);
    pu.uGlowShape.value.set(gl.radius, gl.ring, gl.brush, 0);
    pu.uGlowCap.value.set(GLOW_CAP[this.setting][0], GLOW_CAP[this.setting][1]);
    this.active = level > 0 || far > 0 || live || n > 0;
    pu.uFlashOn.value = this.active ? 1 : 0;
  }

  /**
   * Aims the shadow map at the bolt for flash look B, when the sun casts no shadow to lose (a closed sky). Called once, in
   * applyLook, before the shadow map's drawn; the picture only gets its shadows from the post pass. Nothing else in the
   * scene's light changes: the flash is laid over the finished picture.
   */
  light(s: SharedUniforms) {
    const look = FLASH_LOOKS[this.looks.flash];
    this.aiming = look.shadows && this.level > AIM_LEVEL && s.uOvercast.value.y >= CLOSED_SKY && s.uCloudOvercast.value.y >= CLOSED_SKY;
    this.post.uFlashAimed.value = this.aiming ? 1 : 0;
    if (!this.aiming) return;
    const dist = Math.hypot(this.strikePoint.x - this.center.x, this.strikePoint.z - this.center.z);
    const away = Math.max(dist, 18), toX = dist > 1 ? (this.strikePoint.x - this.center.x) / dist : 0.7, toZ = dist > 1 ? (this.strikePoint.z - this.center.z) / dist : 0.7;
    this.boltLight.set(toX * away, 34, toZ * away).normalize();
    // What's left of the sun's soft shadow would fall the bolt's way for this split second: none, instead.
    s.uOvercast.value.y = 1;
    s.uCloudOvercast.value.y = 1;
  }

  /** The bolts, drawn over the finished picture. */
  draw(gl: THREE.WebGLRenderer, camera: THREE.Camera, haze: THREE.Color) {
    if (!this.boltsLive) return;
    this.boltU.uHaze.value.copy(haze);
    gl.render(this.boltScene, camera);
  }

  /** Builds a bolt's path into its slot: the same strip of points whatever the bolt, moved here. */
  private buildBolt(slot: number, x: number, y: number, z: number, seed: number, shape: { jag: number; most: number; branches: number }, heading: number) {
    const rng = mulberry(seed);
    const pos = this.geo.getAttribute('position') as THREE.BufferAttribute, prev = this.geo.getAttribute('aPrev') as THREE.BufferAttribute;
    const next = this.geo.getAttribute('aNext') as THREE.BufferAttribute, info = this.geo.getAttribute('aInfo') as THREE.BufferAttribute;
    const perBolt = (TRUNK + BRANCH * BRANCHES) * 2;
    let at = slot * perBolt;
    const write = (points: THREE.Vector3[], width: number, along0: number, along1: number) => {
      points.forEach((p, i) => {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
        for (let side = 0; side < 2; side++) {
          pos.setXYZ(at, p.x, p.y, p.z);
          prev.setXYZ(at, a.x, a.y, a.z);
          next.setXYZ(at, b.x, b.y, b.z);
          // Across (-1, 1), how far along (0 the ground .. 1 the top), which bolt, its width.
          info.setXYZW(at, side === 0 ? -1 : 1, THREE.MathUtils.lerp(along0, along1, i / (points.length - 1)), slot, width);
          at++;
        }
      });
    };
    const top = new THREE.Vector3(x + (rng() - 0.5) * 24, y + BOLT_HEIGHT, z + (rng() - 0.5) * 24);
    const trunk = zigzag(new THREE.Vector3(x, y, z), top, TRUNK, shape.jag, shape.most, heading, rng);
    write(trunk, 1, 0, 1);
    for (let j = 0; j < BRANCHES; j++) {
      if (j >= shape.branches) { write(new Array(BRANCH).fill(trunk[0]), 0, 0, 0); continue; }
      // Forking off low enough to be seen, and short: sideways, and down towards the land.
      const i0 = 6 + Math.floor(rng() * 16);
      const from = trunk[i0], side = rng() < 0.5 ? -1 : 1;
      const reach = (1.5 + rng() * 3.5) * side, a = heading;
      const to = new THREE.Vector3(from.x + Math.cos(a) * reach, Math.max(y + 0.4, from.y - 1 - rng() * 3), from.z - Math.sin(a) * reach);
      write(zigzag(from, to, BRANCH, shape.jag * 0.8, shape.most * 0.4, heading, rng), 0.55, i0 / (TRUNK - 1), (i0 + 18) / (TRUNK - 1));
    }
    for (const a of [pos, prev, next, info]) a.needsUpdate = true;
  }

  /** Puts the bolts' program on the GPU at load, so the first strike can't hitch on it. */
  precompile(gl: THREE.WebGLRenderer, camera: THREE.Camera) { gl.compile(this.boltScene, camera); }
}

/**
 * A jagged line of n points from a to b, denser towards a (where the camera sees it: most of a bolt is off the top of the
 * screen), each pushed aside from the straight line, alternately one way and the other, as far as it climbs times `jag`;
 * sideways on the screen (`heading`: the camera's), so the zigzag shows whichever way the view is turned.
 */
function zigzag(a: THREE.Vector3, b: THREE.Vector3, n: number, jag: number, most: number, heading: number, rng: () => number) {
  const length = a.distanceTo(b), points: THREE.Vector3[] = [a.clone()];
  let last = 0, side = 1, lean = heading + (rng() - 0.5) * 0.6;
  for (let i = 1; i < n; i++) {
    const t = i === n - 1 ? 1 : (i / (n - 1)) ** 1.6;
    const push = Math.min((t - last) * length * jag, most) * (0.5 + rng());
    last = t;
    if (rng() < 0.3) lean = heading + (rng() - 0.5) * 0.9;
    side = -side * (rng() < 0.86 ? 1 : -1);
    const p = a.clone().lerp(b, t);
    if (i < n - 1) { p.x += Math.cos(lean) * push * side; p.z -= Math.sin(lean) * push * side; }
    points.push(p);
  }
  return points;
}

const BOLT_VERT = /* glsl */ `
attribute vec3 aPrev;
attribute vec3 aNext;
attribute vec4 aInfo; // across (-1, 1), along (0 the ground .. 1 the top), the bolt, its width
uniform vec2 uRes;
uniform float uBoltGlow[${MAX_BOLTS}];
uniform float uBoltPx;
varying vec3 vStroke; // across (-1, 1), along, its depth from the camera (m)
varying float vGlow;
void main() {
  vGlow = uBoltGlow[int(aInfo.z + 0.5)];
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 c = pv * vec4(position, 1.0);
  if (vGlow <= 0.0 || aInfo.w <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vStroke = vec3(0.0); return; }
  vec4 a = pv * vec4(aPrev, 1.0), b = pv * vec4(aNext, 1.0);
  vec2 d = (b.xy / b.w - a.xy / a.w) * uRes;
  d = length(d) > 1e-4 ? normalize(d) : vec2(0.0, 1.0);
  vec2 n = vec2(-d.y, d.x);
  // Thinner towards its top, the wide glow fades with it.
  float wide = uBoltPx * aInfo.w * mix(1.0, 0.35, aInfo.y);
  c.xy += n * aInfo.x * wide / uRes * 2.0 * c.w;
  gl_Position = c;
  vStroke = vec3(aInfo.x, aInfo.y, -(viewMatrix * vec4(position, 1.0)).z);
}`;

const BOLT_FRAG = /* glsl */ `
uniform sampler2D tAux;
uniform vec2 uRes;
uniform int uBoltStyle;
uniform vec3 uHaze;
uniform float uTick;
uniform float uBoltCap;
varying vec3 vStroke;
varying float vGlow;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 srgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  // Hidden behind what stands nearer the camera, softly.
  float sd = texture2D(tAux, uv).z;
  float seen = sd <= 0.0 ? 1.0 : smoothstep(vStroke.z - 2.0, vStroke.z - 0.3, sd);
  // Into the haze at the top of the screen, and high up.
  float top = 1.0 - smoothstep(0.62, 1.0, uv.y);
  float high = 1.0 - smoothstep(0.6, 1.0, vStroke.y);
  float fade = top * high;
  float x = abs(vStroke.x), a = 0.0;
  vec3 col = vec3(0.0);
  float g = clamp(vGlow, 0.0, 2.0);
  if (uBoltStyle == 0) {
    // A hot wire: a white core, a soft blue halo.
    float core = 1.0 - smoothstep(0.08, 0.18, x), halo = exp(-x * x * 7.0);
    col = srgb(vec3(0.42, 0.55, 1.0)) * halo * 0.7 + vec3(1.0) * core;
    a = core * 0.9;
  } else if (uBoltStyle == 1) {
    // Inked: a flat pale fill with a dark, rich line round it.
    float fill = 1.0 - smoothstep(0.52, 0.6, x), line = (1.0 - smoothstep(0.82, 0.9, x)) * (1.0 - fill);
    col = srgb(vec3(1.0, 0.98, 0.85)) * fill + vec3(0.09, 0.11, 0.32) * line;
    a = fill + line;
  } else {
    // Painted: brushy, ragged edges and streaks of paint off the stroke.
    float n = hash(floor(gl_FragCoord.xy / 3.0) + uTick);
    float edge = 0.55 + 0.35 * n, core = 1.0 - smoothstep(edge - 0.2, edge, x), drag = exp(-x * x * 3.5) * (0.35 + 0.65 * n);
    col = srgb(vec3(1.0, 0.97, 0.9)) * core + srgb(vec3(0.55, 0.65, 1.0)) * drag * 0.6;
    a = core * 0.92;
  }
  // As it dies away, everywhere.
  float v = min(g, 1.0) * uBoltCap;
  // Toned down, it's only ever a mix towards a colour no brighter than white.
  if (uBoltCap < 1.0) col /= max(1.0, max(col.r, max(col.g, col.b)));
  col *= v; a *= v;
  if (uBoltCap < 1.0) a = max(a, max(col.r, max(col.g, col.b)));
  // Fading into the haze: towards its colour, then gone.
  col = mix(srgb(uHaze) * length(col) * 0.6, col, fade);
  float keep = seen * fade;
  gl_FragColor = vec4(col * keep, a * keep);
}`;

/**
 * The post pass's half: the flash, the far lightning and the glow, laid over the finished picture (sRGB in, sRGB out, so what's
 * drawn is the picture's own brightness: the safety limits are about that). Each adds at most its weight to a pixel, so the
 * limits hold whatever's under it. Dark pixels are lifted less (the ink stays ink, and the colours keep their shapes). Goes
 * after fogNoise.
 */
export const LIGHTNING_GLSL = /* glsl */ `
uniform float uFlashOn;
uniform float uFlashW;
uniform int uFlashStyle;
uniform float uFlashAimed;
uniform float uFlashTint;
uniform vec4 uFlashPool;
uniform vec4 uFlashFar;
uniform vec2 uFarCenter;
uniform vec4 uGlows[${MAX_GLOWS}];   // x, y, z, how strong
uniform float uGlowAge[${MAX_GLOWS}];
uniform int uGlowN;
uniform vec4 uGlowColor;   // its colour (of brightness 1), how burnt
uniform vec4 uGlowShape;   // radius (m), ring, brush
uniform vec2 uGlowCap;     // the most it lifts a pixel, the most it darkens one
uniform sampler2D uShadowMap;
uniform mat4 uShadowMatrix;
float boltSees(vec3 p) {
  vec4 s = uShadowMatrix * vec4(p + vec3(0.0, 0.08, 0.0), 1.0);
  vec3 uvz = s.xyz / s.w;
  if (uvz.x < 0.0 || uvz.x > 1.0 || uvz.y < 0.0 || uvz.y > 1.0 || uvz.z > 1.0) return 1.0;
  vec2 texel = 1.0 / vec2(textureSize(uShadowMap, 0));
  float seen = 0.0;
  for (int i = 0; i < 4; i++) {
    float a = float(i) * 1.5708 + 0.6;
    seen += uvz.z - 0.003 > texture(uShadowMap, uvz.xy + vec2(cos(a), sin(a)) * texel * 1.2).r ? 0.0 : 1.0;
  }
  return seen / 4.0;
}
vec3 lightningFinal(vec3 o, vec3 p, bool sky) {
  const vec3 COLD = vec3(0.8, 0.88, 1.0), LUMA = vec3(0.2126, 0.7152, 0.0722);
  float glows = sky ? 0.0 : float(uGlowN);
  if (uFlashW <= 0.0 && uFlashFar.z <= 0.0 && glows <= 0.0) return o;
  o = clamp(o, 0.0, 1.0);
  // sRGB to light and back, near enough (within a percent or so) at a fraction of the cost: this is every pixel of the screen.
  vec3 c = o * (o * (o * 0.305306011 + 0.682171111) + 0.012522878);
  float w = uFlashW;
  if (w > 0.0 && !sky) {
    if (uFlashStyle == 2) {
      float r = length(p.xz - uFlashPool.xy) / uFlashPool.z;
      w *= mix(uFlashPool.w, 1.0, exp(-r * r));
    } else if (uFlashStyle == 1 && uFlashAimed > 0.5) {
      w *= mix(0.3, 1.0, boltSees(p));
    }
  }
  float far = uFlashFar.z;
  if (far > 0.0 && !sky) {
    if (uFlashFar.w > 1.5) far *= clamp(0.45 + fogNoise(p.xz * 0.025 + uFlashFar.xy * 3.0), 0.0, 1.0);
    else if (uFlashFar.w > 0.5) far *= clamp(0.5 + dot(normalize(p.xz - uFarCenter + vec2(1e-3)), uFlashFar.xy) * 0.7, 0.05, 1.0);
  }
  float lift = max(w, far), touched = lift;
  if (lift > 0.0) {
    float l = dot(c, LUMA);
    // Towards a cold colour of the same brightness, then lifted, the dark less. Mostly by raising what's there, so the
    // colours keep and it reads as light; only some of it a white wash, which on its own looks like fog.
    c = mix(c, vec3(l) * COLD / dot(COLD, LUMA), uFlashTint);
    float raise = lift * mix(0.45, 1.0, sqrt(l));
    c = mix(c * min((l + raise) / max(l, 1e-3), 5.0), c + COLD * raise, 0.3);
  }
  if (uGlowN > 0 && !sky) {
    float glow = 0.0, burn = 0.0;
    for (int i = 0; i < uGlowN; i++) {
      vec4 g = uGlows[i];
      float radius = uGlowShape.x * (1.0 + uGlowShape.y * uGlowAge[i] * 2.0), r = length(p.xz - g.xz) / radius;
      if (r > 3.5) continue;
      float h = max(0.0, p.y - g.y - 0.6), n = fogNoise(p.xz * 1.6 + g.xz);
      float body = exp(-r * r * (1.0 + 0.7 * uGlowShape.z * n));
      float ring = uGlowShape.y > 0.5 ? smoothstep(0.35, 0.9, r) * (1.0 - smoothstep(0.9, 1.4, r)) * 3.0 : body;
      float level = g.w * (1.0 - smoothstep(0.0, 2.2, h));
      // The strongest, not the sum: strikes on one spot can't add up past the limit.
      glow = max(glow, level * ring);
      burn = max(burn, uGlowColor.w * level * smoothstep(1.3, 0.2, r));
    }
    touched += glow + burn;
    c *= 1.0 - min(burn, uGlowCap.y);
    c += uGlowColor.rgb * min(glow, 1.0) * max(uGlowCap.x - lift, 0.0);
  }
  // Left exactly as it was unless something lit it.
  if (touched <= 0.0) return o;
  vec3 a = sqrt(min(c, vec3(1.0))), b = sqrt(a);
  return 0.585122381 * a + 0.783140355 * b - 0.368262736 * sqrt(b);
}
`;
