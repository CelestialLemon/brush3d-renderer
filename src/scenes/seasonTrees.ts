import * as THREE from 'three';
import { MeshBuilder, rng, srgb, type Paint } from './builder';
import { C, addDab, growTree, smooth, type Ground, type Tree } from './kit';
import { CRISP_EDGE } from '../renderer/materials';
import type { BrushRenderer } from '../renderer/renderer';
import type { Season } from '../renderer/season';
import { TREE_BEND, type TreeSpec } from '../renderer/trees';

// The trees' seasons (#13). Each season has its own tree models, the developer's choice (2026-11-09), rather than one model
// that recolours and thins: a level's season never changes, so a season's trees are built once, at load, and cost no hitch.
// Spring's and autumn's crowns grow on their own limbs and winter's trees are a whole skeleton of boughs and twigs, none of
// which a summer crown ever showed.
//
// Summer (and no season at all) keeps the scenes' own trees, growTree's. Every other season draws the summer tree's random
// numbers all the same (into a Sink), so a bush's or a tree's place, set by what comes after it in the stream, doesn't
// change with the season.
//
// Each season's model is painted, as trees are (docs/DIRECTION.md): no ink, and the finest twigs are dabs of paint rather
// than lines, which would crawl.

/** The looks on the preview, the developer's to pick (#13). */
export interface TreeLooks {
  /** Winter's limbs. a: boughs with a few dry-brushed twig strokes at their ends. b: finer branches only. c: as b, with a few last leaves. */
  bare: 'a' | 'b' | 'c';
  /** Autumn's palette. a: mellow golds. b: vivid reds. c: a patchwork, branches turning apart. */
  turn: 'a' | 'b' | 'c';
  /** Blossom. a: white with a touch of pink. b: pinker, with more young leaf. */
  blossom: 'a' | 'b';
  /** Fallen leaves and petals. a: a scatter under the crowns. b: drifts. off: none. */
  fallen: 'a' | 'b' | 'off';
}
export const DEFAULT_TREE_LOOKS: TreeLooks = { bare: 'a', turn: 'a', blossom: 'a', fallen: 'a' };

/** How the trees are dressed: a season that isn't summer's, its looks and where leaves may lie. */
export interface Dress { season: Exclude<Season, 'summer'>; looks: TreeLooks; canFall: (x: number, z: number) => boolean }

/** Trees as the season dresses them; no dress (summer, or no season) is the scenes' own. */
export function dressFor(season: Season | null | undefined, looks: TreeLooks, canFall: Dress['canFall']): Dress | null {
  return !season || season === 'summer' ? null : { season, looks, canFall };
}

/** Swallows a summer tree: only its random numbers are wanted. */
class Sink extends MeshBuilder {
  constructor() { super('foliage'); }
  override vertex() { return 0; }
  override quad() {}
  override tri() {}
  override addGeometry() {}
  override markTree() {}
  override heightsSince() { return [] as number[]; }
}
const SINK = new Sink();

type V3 = THREE.Vector3;
interface Seg { a: V3; b: V3; ra: number; rb: number; order: number }
interface Tip { p: V3; dir: V3; order: number }
interface Mass { c: V3; r: number; tone: number }

const UP = new THREE.Vector3(0, 1, 0);
/** A random number in 0..1 fixed to a tree's place, whatever the season. */
const pick = (t: Tree, salt: number) => rng(Math.imul(Math.round(t.x * 97), 0x9e3779b1) ^ Math.imul(Math.round(t.z * 131) + salt, 0x85ebca6b))();
const randomUnit = (r: () => number) => {
  const u = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
  return new THREE.Vector3(s * Math.cos(a), u, s * Math.sin(a));
};
const BARK_PAINT: Paint = [0.4, 2.5, 1.57, 0];
const TWIG_PAINT: Paint = [0.5, 5, 1.57, 0];

/** One limb of a tree: an open tube of `sides`, from one radius to the next. */
function tube(b: MeshBuilder, a: V3, c: V3, ra: number, rb: number, col: THREE.Color, sides: number, paint: Paint) {
  const dir = c.clone().sub(a).normalize();
  const u = Math.abs(dir.y) < 0.9 ? UP.clone().cross(dir).normalize() : new THREE.Vector3(1, 0, 0).cross(dir).normalize();
  const v = dir.clone().cross(u);
  const base = b.vertexCount, n = new THREE.Vector3();
  for (const [p, r] of [[a, ra], [c, rb]] as const) {
    for (let i = 0; i < sides; i++) {
      const th = (i / sides) * Math.PI * 2;
      n.copy(u).multiplyScalar(Math.cos(th)).addScaledVector(v, Math.sin(th));
      b.vertex({ x: p.x + n.x * r, y: p.y + n.y * r, z: p.z + n.z * r }, n, col, paint);
    }
  }
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    b.quad(base + i, base + j, base + sides + j, base + sides + i);
  }
}

/** A tree's limbs: how it's shaped depends on its kind. */
function skeleton(t: Tree, base: V3, s: number, r: () => number, maxOrder: number) {
  const segs: Seg[] = [], tips: Tip[] = [];
  const sq = Math.sqrt(s);
  const vase = t.kind === 'fruit' || t.kind === 'bush', sapling = t.kind === 'round', willow = t.form === 'willow';
  const limb = (p0: V3, d0: V3, length: number, rad: number, order: number, wander: number, lift: number) => {
    const n = order === 0 ? 4 : order === 1 ? 3 : 2, step = length / n;
    const d = d0.clone().normalize();
    let p = p0.clone();
    for (let i = 0; i < n; i++) {
      const ra = rad * (1 - (i / n) * 0.55), rb = rad * (1 - ((i + 1) / n) * 0.55);
      const q = p.clone().addScaledVector(d, step);
      segs.push({ a: p, b: q, ra, rb, order });
      if (order < maxOrder) {
        const sprouts = i === n - 1 ? 2 : r() < 0.45 ? 1 : 0;
        for (let k = 0; k < sprouts; k++) {
          const side = randomUnit(r).cross(d).normalize();
          const a = 0.5 + r() * 0.5;
          const sd = d.clone().multiplyScalar(Math.cos(a)).addScaledVector(side, Math.sin(a)).addScaledVector(UP, lift * 0.6).normalize();
          limb(q, sd, length * (0.5 + r() * 0.25), rb * 0.92, order + 1, wander * 1.15, lift);
        }
      }
      d.addScaledVector(randomUnit(r), wander).addScaledVector(UP, lift).normalize();
      p = q;
    }
    tips.push({ p, dir: d, order });
  };
  // The trunk, a little off plumb.
  const trunkH = (vase ? 0.5 : sapling ? 0.9 : willow ? 1.1 : 1.45) * s, r0 = (vase ? 0.09 : sapling ? 0.07 : 0.2) * sq;
  const lean = randomUnit(r).multiplyScalar(0.06).add(UP).normalize();
  const fork = base.clone().addScaledVector(lean, trunkH);
  segs.push({ a: base, b: fork, ra: r0, rb: r0 * 0.78, order: 0 });
  if (sapling) {
    limb(fork, UP, 1.4 * s, 0.05 * sq, 1, 0.2, 0.15);
    for (let k = 0; k < 4; k++) {
      const a = r() * Math.PI * 2, tilt = 0.5 + r() * 0.5, dir = new THREE.Vector3(Math.sin(tilt) * Math.cos(a), Math.cos(tilt), Math.sin(tilt) * Math.sin(a));
      limb(fork.clone().addScaledVector(UP, (0.2 + r() * 0.7) * s), dir, (0.5 + r() * 0.5) * s, 0.024 * sq, 2, 0.28, 0.1);
    }
  } else {
    const n = vase ? 3 + (r() < 0.5 ? 1 : 0) : 3 + Math.floor(r() * 3), a0 = r() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * Math.PI * 2 + (r() - 0.5) * 0.9;
      const tilt = vase ? 0.7 + r() * 0.35 : willow ? 0.4 + r() * 0.45 : 0.6 + r() * 0.55;
      const dir = new THREE.Vector3(Math.sin(tilt) * Math.cos(a), Math.cos(tilt), Math.sin(tilt) * Math.sin(a));
      const len = (vase ? 0.85 + r() * 0.35 : willow ? 1.5 + r() * 0.7 : 1.5 + r() * 1.2) * s;
      limb(fork, dir, len, (vase ? 0.065 : 0.115) * sq, 0, vase ? 0.4 : 0.26, vase ? 0.1 : 0.14);
    }
    if (!vase && !willow) limb(fork, UP, (1.3 + r() * 0.6) * s, 0.095 * sq, 0, 0.2, 0.12);
  }
  return { segs, tips, fork };
}

/** The wood's own colour, darker and more plum towards the twigs (a bare tree reads as a shape against the land). */
function woodColour(order: number, tone: number) {
  const c = C.bark.clone().lerp(srgb(0x4b3648), Math.min(1, order * 0.34));
  return c.offsetHSL((tone - 0.5) * 0.02, 0, (tone - 0.5) * 0.04);
}

/** The strokes' own shading on a crown, as in growTree: lighter and warmer turning up, darker deep inside. */
function strokeColor(c: THREE.Color, nrm: V3, inner: number, r: () => number) {
  const up = smooth(-0.1, 0.9, nrm.y);
  // Lit strokes go a step towards yellow: down the hue wheel for greens, up it for reds and oranges (which would go pink).
  const hue = c.getHSL({ h: 0, s: 0, l: 0 }).h, warm = hue > 0.17 && hue < 0.55 ? -0.03 : 0.02;
  const col = c.clone().offsetHSL(warm * up, 0.05 * up, 0.09 * up);
  col.multiplyScalar(1 - inner * 0.42);
  return col.offsetHSL((r() - 0.5) * 0.012, (r() - 0.5) * 0.04, (r() - 0.5) * 0.02);
}

/** A crown of leaf dabs over a tree's masses: big dark strokes inside, a skin, a loose edge. */
function crown(leaves: MeshBuilder, masses: Mass[], dabScale: number, tint: (m: Mass, nrm: V3, inner: boolean) => THREE.Color, density: number, r: () => number, fine = 1) {
  const center = masses.reduce((a, k) => a.addScaledVector(k.c, 1 / masses.length), new THREE.Vector3());
  const stretch = new THREE.Vector3(1, 1.2, 1);
  const layers = [
    { count: 12, depth: [0.35, 0.3], size: [0.5, 0.22], inner: 1 },
    { count: 62, depth: [0.68, 0.32], size: [0.28, 0.18], inner: 0 },
    { count: 30, depth: [1.0, 0.13], size: [0.12, 0.08], inner: 0 },
  ];
  for (const k of masses) {
    const rn = k.r / dabScale;
    for (const layer of layers) {
      // Finer strokes, more of them (blossom's), so a crown reads as specks and not as a ball; the inside stays broad.
      const fineness = layer.inner ? 1 : fine;
      for (let i = 0, n = Math.round(layer.count * density * rn * rn / fineness / fineness); i < n; i++) {
        const u = r() * 2 - 1, phi = r() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
        const dir = new THREE.Vector3(s2 * Math.cos(phi) * 1.12, u < 0 ? u * 0.55 : u, s2 * Math.sin(phi) * 1.12);
        const depth = layer.depth[0] + r() * layer.depth[1];
        const p = k.c.clone().addScaledVector(dir, k.r * depth);
        const toCrown = p.clone().sub(center).multiply(stretch).normalize();
        const nrm = toCrown.multiplyScalar(0.55).addScaledVector(dir.clone().normalize(), 0.45).normalize();
        const inner = layer.inner ? 1 : Math.max(0, (0.85 - depth) / 0.25) * 0.5 + (u < -0.25 ? 0.4 : 0);
        const size = (layer.size[0] + r() * layer.size[1]) * dabScale * fineness;
        addDab(leaves, p, nrm, strokeColor(tint(k, nrm, layer.inner === 1), nrm, Math.min(inner, 1), r), size, r(), [0.7 + CRISP_EDGE, 0.45 + r() * 0.35, -1, 0.7]);
      }
    }
  }
}

/** Fruit, as on growTree: bright dabs on the outer, sunward side. */
function apples(leaves: MeshBuilder, masses: Mass[], fruit: THREE.Color, density: number, dabScale: number, r: () => number) {
  const n = Math.round(26 * density * masses.reduce((a, k) => a + k.r * k.r, 0) / 3);
  for (let i = 0; i < n; i++) {
    const k = masses[Math.floor(r() * masses.length)];
    const u = r() * 0.9 - 0.2, phi = r() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
    const dir = new THREE.Vector3(s2 * Math.cos(phi), u, s2 * Math.sin(phi));
    const fc = fruit.clone().offsetHSL((r() - 0.5) * 0.04, 0, (r() - 0.5) * 0.08);
    addDab(leaves, k.c.clone().addScaledVector(dir, k.r), dir, fc, (0.1 + r() * 0.04) * Math.min(1.2, dabScale), r(), [0.2, 1, -1, 0.5]);
  }
}

/** How far a tree has turned in autumn, by the look: 0 still green, 1 red, each tree at its own pace. */
function autumnPace(t: Tree, look: TreeLooks['turn']) {
  const shares = look === 'b' ? [0.1, 0.35, 0.65] : look === 'c' ? [0.3, 0.6, 0.85] : [0.2, 0.68, 0.9];
  const k = pick(t, 2), j = pick(t, 3);
  if (k < shares[0]) return j * 0.15;
  if (k < shares[1]) return 0.45 + j * 0.17;
  if (k < shares[2]) return 0.7 + j * 0.15;
  return 0.88 + j * 0.12;
}

/** Autumn's ramp from the tree's own green: yellow-green, gold, orange, red. */
function turnColour(green: THREE.Color, p: number, look: TreeLooks['turn']) {
  const stops: [number, THREE.Color][] = look === 'b'
    ? [[0, green], [0.28, srgb(0xa4b23a)], [0.5, srgb(0xe2aa22)], [0.75, srgb(0xe06a18)], [1, srgb(0xb72a1c)]]
    : [[0, green], [0.3, srgb(0x9aa83e)], [0.55, srgb(0xd4a32e)], [0.78, srgb(0xc9702a)], [1, srgb(0xa33d2a)]];
  const x = Math.max(0, Math.min(1, p));
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i], [p1, c1] = stops[i + 1];
    if (x <= p1) return c0.clone().lerp(c1, (x - p0) / (p1 - p0));
  }
  return stops[stops.length - 1][1].clone();
}

const BLOSSOM = (look: TreeLooks['blossom']) => look === 'b'
  ? { white: srgb(0xefc8d0), pink: srgb(0xe08fa8), leafShare: 0.4 }
  : { white: srgb(0xf2d6d0), pink: srgb(0xe8a6b0), leafShare: 0.3 };
const FRESH = srgb(0x9acd55);

/** A bush's masses, as summer's: a low row of two or three on a stub of trunk. */
function bushMasses(base: V3, s: number, r: () => number): Mass[] {
  const masses: Mass[] = [];
  const n = 2 + (r() < 0.5 ? 1 : 0), a0 = r() * Math.PI;
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    const off = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(0.25 * s);
    masses.push({ c: base.clone().add(off).add(new THREE.Vector3(0, (0.6 + r() * 0.2) * s, 0)), r: (0.45 + r() * 0.12) * s, tone: r() });
  }
  return masses;
}

/** Is this a tree that stays green in winter? A cypress, and about one woodland broadleaf in five (#13, the developer's). */
const evergreen = (t: Tree) => t.kind === 'cypress' || (t.form === 'wood' && (t.kind === 'broadleaf' || t.kind === 'round') && pick(t, 1) < 0.2);
/** A woody row or clump of bushes (not an orchard's), that keeps its bulk as twigs in winter. */
const twigMass = (t: Tree) => t.kind === 'bush' && t.form !== 'orchard';
const HOLM = srgb(0x1f5a3c);

/**
 * The wood and leaves of a grove of trees for one scene part, as the season dresses them: `grow` each tree, then `addTo` a
 * renderer. With no dress, exactly the scene's own trees.
 */
export class Grove {
  readonly wood = new MeshBuilder('paint');
  readonly leaves = new MeshBuilder('foliage');
  /** Winter's fine twigs and bare hedges, and the leaves still clinging to them: not cover from the rain, no shadow. */
  private readonly twigs = new MeshBuilder('foliage');
  /** Leaves and petals on the ground. */
  private readonly litter = new MeshBuilder('foliage');

  constructor(private readonly dress: Dress | null) {}

  grow(ground: Ground, t: Tree, rand: () => number) {
    const dress = this.dress;
    if (!dress) { growTree(this.wood, this.leaves, ground, t, rand); return; }
    if (evergreen(t)) {
      // The same tree all year (cypresses), or dark and deep through the winter (holm oaks, about a fifth of the woods).
      const leaf = t.kind === 'cypress' ? t.leaf : HOLM.clone().lerp(t.leaf ?? C.deepLeaf, 0.25);
      growTree(this.wood, this.leaves, ground, leaf ? { ...t, leaf } : t, rand);
      return;
    }
    // A summer tree's worth of the stream, so what's placed after this tree stays where it was.
    growTree(SINK, SINK, ground, t, rand);
    const own = rng(Math.imul(Math.round(t.x * 311), 0x2c1b3c6d) ^ Math.imul(Math.round(t.z * 317), 0x85ebca6b));
    if (dress.season === 'winter') this.winter(ground, t, own, dress);
    else this.leafy(ground, t, own, dress);
  }

  /** Winter's tree: its whole limbs, and its twigs (or, for a hedge's bush, a dense bulk of twigs). */
  private winter(ground: Ground, t: Tree, r: () => number, dress: Dress) {
    const s = t.scale ?? 1, y0 = ground.height(t.x, t.z) - 0.05, base = new THREE.Vector3(t.x, y0, t.z);
    const wood0 = this.wood.vertexCount, twigs0 = this.twigs.vertexCount, dabScale = Math.pow(s, 0.45);
    if (twigMass(t)) {
      tube(this.wood, base, base.clone().add(new THREE.Vector3(0, 0.35 * s, 0)), 0.05 * Math.sqrt(s), 0.03, C.bark, 5, BARK_PAINT);
      const masses = bushMasses(base, s, r), plum = srgb(0x4e3f44), brown = srgb(0x7a6050);
      for (const k of masses) {
        const rn = k.r / dabScale;
        for (let i = 0, n = Math.round(150 * rn * rn); i < n; i++) {
          const u = r() * 2 - 1, phi = r() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
          const dir = new THREE.Vector3(s2 * Math.cos(phi) * 1.12, u < 0 ? u * 0.55 : u, s2 * Math.sin(phi) * 1.12);
          const depth = 0.55 + r() * 0.5, p = k.c.clone().addScaledVector(dir, k.r * depth);
          const c = plum.clone().lerp(brown, r() * 0.7).multiplyScalar(1 - (u < 0 ? 0.25 : 0));
          addDab(this.twigs, p, dir.clone().normalize(), c.offsetHSL(0, 0, u * 0.03), (0.07 + r() * 0.08) * dabScale, r(), [0.5, 0.2 + r() * 0.14, Math.PI / 2 + (r() - 0.5) * 1.8, 0.2]);
        }
      }
      this.mark(wood0, twigs0, t, y0, s, 0.4 * s);
      return;
    }
    const look = dress.looks.bare;
    const maxOrder = (t.kind === 'broadleaf' ? 2 : 1) + (look === 'a' ? 0 : 1);
    const { segs, tips, fork } = skeleton(t, base, s, r, maxOrder);
    for (const g of segs) {
      const sides = g.order === 0 ? 5 : g.order === 1 ? 4 : 3;
      tube(this.wood, g.a, g.b, g.ra, g.rb, woodColour(g.order, r()), sides, g.order >= 2 ? TWIG_PAINT : BARK_PAINT);
    }
    // The finest twigs are paint: thin dabs round the ends of the boughs, like a dry brush dragged out at the edges.
    if (look === 'a' || look === 'c') {
      const willow = t.form === 'willow';
      // Close to the limbs' own colour, a little lighter, so they read as a haze of twigs and not as dark leaves.
      const twig = srgb(0x65504e), rust = srgb(0xa86b34);
      const cling = look === 'c' && t.kind === 'broadleaf' && pick(t, 5) < 0.4;
      for (const tip of tips) {
        if (tip.order < Math.max(1, maxOrder - 1)) continue;
        const n = willow ? 4 : tip.order >= maxOrder ? 2 : 1;
        for (let i = 0; i < n; i++) {
          const j = randomUnit(r).multiplyScalar((0.12 + r() * 0.26) * s).add(UP.clone().multiplyScalar(willow ? -0.5 * s * r() : 0.1 * s * r()));
          const p = tip.p.clone().add(j).addScaledVector(tip.dir, 0.15 * s);
          const c = twig.clone().lerp(srgb(0x7e685e), r() * 0.8).offsetHSL((r() - 0.5) * 0.02, 0, (r() - 0.5) * 0.04);
          if (look === 'a' && t.kind === 'broadleaf') addDab(this.twigs, p, tip.dir, c, (0.05 + r() * 0.07) * dabScale, r(), [0.5, 0.2 + r() * 0.12, Math.PI / 2 + (r() - 0.5) * (willow ? 0.4 : 2.2), 0.15]);
          if (cling && r() < 0.5) addDab(this.twigs, p, tip.dir, rust.clone().offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.06), (0.09 + r() * 0.06) * dabScale, r(), [0.5, 0.6, -1, 0.4]);
        }
      }
    }
    this.mark(wood0, twigs0, t, y0, s, Math.max(fork.y - y0, 0.2));
  }

  /** Spring's and autumn's tree: crowns on their own limbs, with gaps the limbs show through. */
  private leafy(ground: Ground, t: Tree, r: () => number, dress: Dress) {
    const s = t.scale ?? 1, y0 = ground.height(t.x, t.z) - 0.05, base = new THREE.Vector3(t.x, y0, t.z);
    const wood0 = this.wood.vertexCount, leaves0 = this.leaves.vertexCount, twigs0 = this.twigs.vertexCount, dabScale = Math.pow(s, 0.45);
    const spring = dress.season === 'spring';
    const green = t.leaf ?? (t.kind === 'fruit' || t.kind === 'bush' ? C.fruitLeaf : C.leaf);
    let masses: Mass[];
    let crownBase: number;
    if (t.kind === 'bush') {
      masses = bushMasses(base, s, r);
      tube(this.wood, base, base.clone().add(new THREE.Vector3(0, 0.3 * s, 0)), 0.05 * Math.sqrt(s), 0.03, C.bark, 5, BARK_PAINT);
      crownBase = 0.25 * s;
    } else {
      const { segs, tips, fork } = skeleton(t, base, s, r, t.kind === 'broadleaf' ? 2 : 1);
      for (const g of segs) tube(this.wood, g.a, g.b, g.ra, g.rb, woodColour(g.order, r()), g.order === 0 ? 5 : g.order === 1 ? 4 : 3, BARK_PAINT);
      masses = tips.filter((k) => k.order >= 1 || t.kind !== 'broadleaf').map((k) => ({
        c: k.p.clone().addScaledVector(k.dir, 0.15 * s).add(new THREE.Vector3(0, 0.15 * s, 0)),
        r: (spring ? 0.42 + r() * 0.22 : 0.55 + r() * 0.3) * s, tone: r(),
      }));
      // A crown's worth of masses, the rest let go: gaps between them are what show the limbs.
      for (let i = masses.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [masses[i], masses[j]] = [masses[j], masses[i]]; }
      masses.length = Math.min(masses.length, spring ? 12 : 9);
      crownBase = Math.max(fork.y - y0, 0.2);
    }
    if (!masses.length) masses = [{ c: base.clone().add(new THREE.Vector3(0, 1.6 * s, 0)), r: 0.7 * s, tone: r() }];
    if (spring) this.dressSpring(t, masses, dabScale, green, r, dress, ground);
    else this.dressAutumn(t, masses, dabScale, green, r, dress, ground);
    this.mark(wood0, twigs0, t, y0, s, crownBase, leaves0);
  }

  private dressSpring(t: Tree, masses: Mass[], dabScale: number, green: THREE.Color, r: () => number, dress: Dress, ground: Ground) {
    const fresh = green.clone().lerp(FRESH, 0.55);
    const orchard = t.kind === 'fruit' || t.form === 'orchard';
    const wild = !orchard && ((t.form === 'hedge' && pick(t, 6) < 0.14) || (t.form === 'wood' && pick(t, 6) < 0.09));
    const blossom = orchard || wild;
    const bl = BLOSSOM(dress.looks.blossom);
    crown(this.leaves, masses, dabScale, (k, nrm, inner) => {
      // The inside stays leafy, so the blossom speckles over a green mass and its shade stays colour, not grey.
      if (blossom && !inner && r() >= (wild ? bl.leafShare + 0.2 : bl.leafShare)) {
        return bl.white.clone().lerp(bl.pink, r() * 0.55 + (nrm.y < 0 ? 0.35 : 0));
      }
      return (blossom && inner ? fresh.clone().lerp(srgb(0xb88a78), 0.45) : fresh.clone()).offsetHSL((k.tone - 0.5) * 0.04, 0, (k.tone - 0.5) * 0.04);
    }, blossom ? 0.92 : 0.85, r, blossom ? 0.78 : 1);
    if (blossom && dress.looks.fallen !== 'off') this.fall(t, masses, r, dress, () => bl.white.clone().lerp(bl.pink, r()), 0.025, ground);
  }

  private dressAutumn(t: Tree, masses: Mass[], dabScale: number, green: THREE.Color, r: () => number, dress: Dress, ground: Ground) {
    const look = dress.looks.turn, pace = autumnPace(t, look), jitter = look === 'c' ? 0.3 : 0.12;
    for (const k of masses) k.tone = pace + (k.tone - 0.5) * 2 * jitter;
    crown(this.leaves, masses, dabScale, (k, nrm) => turnColour(green, k.tone + nrm.y * 0.1, look), 1 - 0.2 * Math.max(0, pace), r);
    const fruit = t.fruit ?? (t.kind === 'fruit' ? C.fruit : null);
    if (fruit) apples(this.leaves, masses, fruit, (t.fruitDensity ?? 1) * 0.7, dabScale, r);
    if (dress.looks.fallen !== 'off' && t.kind !== 'bush') {
      this.fall(t, masses, r, dress, () => turnColour(green, pace + (r() - 0.5) * 0.35, look).multiplyScalar(0.85 + r() * 0.15), 0.06 + 0.12 * Math.max(0, pace), ground);
    }
  }

  /** Leaves or petals fallen under a tree: `density` a dab per square metre, thicker near the trunk. */
  private fall(t: Tree, masses: Mass[], r: () => number, dress: Dress, colour: () => THREE.Color, density: number, ground: Ground) {
    const reach = masses.reduce((a, k) => Math.max(a, Math.hypot(k.c.x - t.x, k.c.z - t.z) + k.r), 0.5) * 1.15;
    const n = Math.round(Math.PI * reach * reach * density * (dress.looks.fallen === 'b' ? 3.2 : 1) * 16);
    for (let i = 0; i < n; i++) {
      const d = reach * Math.sqrt(r()) * (0.25 + 0.75 * r()), a = r() * Math.PI * 2;
      const x = t.x + Math.cos(a) * d, z = t.z + Math.sin(a) * d;
      if (!dress.canFall(x, z)) continue;
      const size = 0.05 + r() * 0.04;
      const y = ground.height(x, z) + 0.03 + size * 0.4;
      addDab(this.litter, new THREE.Vector3(x, y, z), UP, colour(), size, r(), [0.4, 0.55, -1, 0.15]);
    }
  }

  /** Makes what was just added move in the wind, as growTree does. */
  private mark(wood0: number, twigs0: number, t: Tree, y0: number, s: number, crownBase: number, leaves0?: number) {
    const ys = [...this.wood.heightsSince(wood0), ...this.twigs.heightsSince(twigs0), ...(leaves0 === undefined ? [] : this.leaves.heightsSince(leaves0))];
    const height = Math.max(...ys, y0 + s) - y0, bend = TREE_BEND[t.kind], crown = Math.max(crownBase, height * 0.2);
    const share = (y: number) => { const h = Math.max(y - y0, 0); return Math.min(h / crown, 1) ** 2 * (1 - bend) + Math.min(h / height, 1) ** 2 * bend; };
    const spec: TreeSpec = { x: t.x, z: t.z, height, kind: t.kind, scale: s };
    this.wood.markTree(wood0, spec, share);
    if (this.twigs.vertexCount > twigs0) this.twigs.markTree(twigs0, spec, share);
    if (leaves0 !== undefined && this.leaves.vertexCount > leaves0) this.leaves.markTree(leaves0, spec, share);
  }

  /** Adds the grove's meshes to the scene. */
  addTo(r: Pick<BrushRenderer, 'add'>) {
    r.add(this.wood.build(), 'paint');
    if (this.leaves.vertexCount) r.add(this.leaves.build(), 'foliage');
    if (this.twigs.vertexCount) r.add(this.twigs.build(), 'foliage', { cover: 'none', castShadow: false });
    if (this.litter.vertexCount) r.add(this.litter.build(), 'foliage', { cover: 'none', castShadow: false });
  }
}
