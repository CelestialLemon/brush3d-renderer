import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBuilder, noise2, srgb, type Paint } from './builder';

// The pieces scenes are built from: the palette, trees, stones, grass, reeds, and lines on the map (streams, paths, fences).
// Every piece stands on a Ground, so any scene's land can carry them.

/** Palette (sRGB). Greens span yellow-green to teal, as the reference's meadows do. */
export const C = {
  lime: srgb(0xa6c45a), meadow: srgb(0x6aa04a), emerald: srgb(0x40885a), teal: srgb(0x3b806e),
  moss: srgb(0x4f8040), mud: srgb(0x6a5238), bed: srgb(0x9a8660), water: srgb(0x2c6e74),
  stone: srgb(0x9a9184), reed: srgb(0x6f8a3a),
  soil: srgb(0x8a5634), timber: srgb(0xc58f55), ceramic: srgb(0xeee6d2), brass: srgb(0xc08a48), glass: srgb(0x1d4fa0),
  bark: srgb(0x6e4a3e), leaf: srgb(0x4e9a3a), leafLight: srgb(0x8cc44a), fruitLeaf: srgb(0x5aa03e), cypress: srgb(0x2f6a42),
  fruit: srgb(0xf06a2c), wheatRoot: srgb(0x8a9a3a), wheatTip: srgb(0xf0c45a),
  dirt: srgb(0xc7a77a), rut: srgb(0xa48660), wheat: srgb(0xf4cf4e), wheatDeep: srgb(0xdc9c34),
  fence: srgb(0xb8a48a), crate: srgb(0xb07a4a), apple: srgb(0xd8402c), deepLeaf: srgb(0x2f7044),
};

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export interface Ground {
  height(x: number, z: number): number;
  normal(x: number, z: number): THREE.Vector3;
}

export function groundOf(height: (x: number, z: number) => number): Ground {
  const e = 0.25;
  return {
    height,
    normal: (x, z) => new THREE.Vector3(height(x - e, z) - height(x + e, z), 2 * e, height(x, z - e) - height(x, z + e)).normalize(),
  };
}

/** One leafy dab: a camera-facing card the foliage material shapes into a brush mark. */
export function addDab(b: MeshBuilder, p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, size: number, seed: number, paint: Paint) {
  const i0 = b.vertex(p, n, c, paint, [0, 0], [-1, -1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [1, -1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [1, 1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [-1, 1, size, seed]);
  b.quad(i0, i0 + 1, i0 + 2, i0 + 3);
}

export type TreeKind = 'broadleaf' | 'fruit' | 'cypress' | 'round' | 'bush';

export interface Tree {
  kind: TreeKind; x: number; z: number; seed: number;
  /** Size against the meadow's trees (about 5 m tall). */
  scale?: number;
  leaf?: THREE.Color;
  /** Fruit dabs, for fruit trees and orchard bushes, and how thickly they hang (1 by default). */
  fruit?: THREE.Color;
  fruitDensity?: number;
}

/**
 * A tree, built the way a painter blocks one in: a few unequal branch masses, each lit as its own lump on the crown's form,
 * then covered in leafy strokes, smaller and looser at the edges. Normals are a blend of the crown's and the mass's, so the
 * light falls in a few soft patches rather than over each stroke.
 */
export function growTree(wood: MeshBuilder, leaves: MeshBuilder, ground: Ground, t: Tree, rand: () => number) {
  const s = t.scale ?? 1;
  const y0 = ground.height(t.x, t.z) - 0.05;
  const base = new THREE.Vector3(t.x, y0, t.z);
  const wood0 = wood.vertexCount, leaves0 = leaves.vertexCount;
  const cypress = t.kind === 'cypress', bush = t.kind === 'bush', round = t.kind === 'round';
  const barkPaint: Paint = [0.4, 2.5, 1.57, 0];
  const trunkH = (cypress ? 1.2 : bush ? 0.25 : round ? 0.9 : 1.45) * s;
  const r0 = (cypress ? 0.16 : bush ? 0.06 : round ? 0.1 : 0.2) * Math.sqrt(s);
  // In rings up the trunk, so it can curve as it bends in the wind.
  const trunk = new THREE.CylinderGeometry(r0 * 0.65, r0, trunkH + 0.4 * s, 9, 5);
  wood.addGeometry(trunk, new THREE.Matrix4().makeTranslation(t.x, y0 + (trunkH + 0.4 * s) / 2, t.z), C.bark, barkPaint);
  const limb = (from: THREE.Vector3, to: THREE.Vector3, a: number, b: number) => {
    const g = new THREE.CylinderGeometry(b * Math.sqrt(s), a * Math.sqrt(s), from.distanceTo(to), 6, 3);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    wood.addGeometry(g, new THREE.Matrix4().compose(from.clone().lerp(to, 0.5), q, new THREE.Vector3(1, 1, 1)), C.bark, barkPaint);
  };
  const masses: { c: THREE.Vector3; r: number; tone: number }[] = [];
  const up = (y: number) => new THREE.Vector3(0, y, 0);
  // A cypress has no masses: its crown is one body, grown below.
  if (bush) {
    // An orchard bush: a low row of two or three masses on a stub of trunk.
    const n = 2 + (rand() < 0.5 ? 1 : 0), a0 = rand() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * Math.PI * 2;
      const off = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(0.25 * s);
      masses.push({ c: base.clone().add(off).add(up((0.6 + rand() * 0.2) * s)), r: (0.45 + rand() * 0.12) * s, tone: rand() });
    }
  } else if (round) {
    // A young tree: one crown, perhaps a second lump on it.
    masses.push({ c: base.clone().add(up(trunkH + 0.55 * s)), r: (0.62 + rand() * 0.12) * s, tone: rand() });
    if (rand() < 0.6) {
      const a = rand() * Math.PI * 2;
      masses.push({ c: base.clone().add(new THREE.Vector3(Math.cos(a) * 0.3 * s, trunkH + 0.75 * s, Math.sin(a) * 0.3 * s)), r: 0.42 * s, tone: rand() });
    }
  } else if (!cypress) {
    // A broadleaf forks into a few boughs leaning out at different angles and lengths; each carries a mass at its end (and
    // sometimes a smaller one partway), so the crown is organised by its limbs, with gaps between them.
    const fork = base.clone().add(up(trunkH * 0.85));
    const nb = 3 + (rand() < 0.6 ? 1 : 0), a0 = rand() * Math.PI * 2;
    for (let i = 0; i < nb; i++) {
      const a = a0 + (i / nb) * Math.PI * 2 + (rand() - 0.5) * 1.0;
      const tilt = 0.6 + rand() * 0.45, len = (1.2 + rand() * 1.0) * s;
      const dir = new THREE.Vector3(Math.sin(tilt) * Math.cos(a), Math.cos(tilt), Math.sin(tilt) * Math.sin(a));
      const end = fork.clone().addScaledVector(dir, len);
      limb(fork, end, 0.1, 0.05);
      masses.push({ c: end.clone().addScaledVector(dir, 0.25 * s).add(up(0.3 * s)), r: (0.75 + rand() * 0.45) * s, tone: rand() });
      if (rand() < 0.55) {
        const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar((rand() < 0.5 ? 0.5 : -0.5) * s);
        masses.push({ c: fork.clone().addScaledVector(dir, len * 0.5).add(side).add(up(0.15 * s)), r: (0.45 + rand() * 0.2) * s, tone: rand() });
      }
    }
    // A leader up the middle, its mass a little smaller, so the top isn't a dome.
    const top = fork.clone().add(new THREE.Vector3((rand() - 0.5) * 0.4 * s, (1.5 + rand() * 0.4) * s, (rand() - 0.5) * 0.4 * s));
    limb(fork, top, 0.09, 0.04);
    masses.push({ c: top.clone().add(up(0.35 * s)), r: (0.7 + rand() * 0.25) * s, tone: rand() });
  }
  const crownCenter = masses.reduce((acc, k) => acc.addScaledVector(k.c, 1 / masses.length), new THREE.Vector3());
  const stretch = new THREE.Vector3(1, 1.2, 1);
  const leafColor = t.leaf ?? (cypress ? C.cypress : t.kind === 'fruit' || bush ? C.fruitLeaf : C.leaf);
  // Strokes grow with the tree, but less than it does: a big tree is more strokes, not only bigger ones.
  const dabScale = Math.pow(s, 0.45);
  // A stroke's colour comes from where it sits on the crown, not from chance: lighter and warmer where the crown turns up,
  // darker deep inside. Neighbouring strokes then differ only a little, and the crown reads as a few big masses of light and
  // shade, broken at their borders by the strokes, rather than as a heap of separate dabs.
  const strokeColor = (c: THREE.Color, nrm: THREE.Vector3, inner: number) => {
    // Lit: the tree's own green, lighter and a step towards yellow (so a dark tree stays a dark tree, only lit).
    const up = smooth(-0.1, 0.9, nrm.y);
    const col = c.clone().offsetHSL(-0.03 * up, 0.05 * up, 0.09 * up);
    col.multiplyScalar(1 - inner * 0.42);
    return col.offsetHSL((rand() - 0.5) * 0.012, (rand() - 0.5) * 0.04, (rand() - 0.5) * 0.02);
  };
  if (cypress) {
    // A flame: one continuous body, widest a third of the way up and drawn to a point, its skin in long upright strokes,
    // bulging into a few vertical tufts so the silhouette is ragged, not a smooth cone.
    const height = 5.4 * s, tufts = 5 + Math.floor(rand() * 3), turn = rand() * Math.PI * 2;
    const radius = (f: number) => (0.3 + 0.75 * Math.sin(Math.min(1, 0.22 + f * 2.6) * Math.PI / 2) * (1 - f * 0.86)) * s;
    const count = Math.round(420 * s * s / dabScale);
    for (let i = 0; i < count; i++) {
      const f = Math.pow(rand(), 0.85), phi = rand() * Math.PI * 2;
      const tuft = 0.86 + 0.2 * Math.max(0, Math.cos((phi - turn) * tufts * 0.5)) ** 2 + (rand() - 0.5) * 0.1;
      const inner = rand() < 0.2 ? 0.5 + rand() * 0.4 : 0;
      const r = radius(f) * tuft * (1 - inner * 0.6);
      const p = base.clone().add(new THREE.Vector3(Math.cos(phi) * r, 1.0 * s + f * height, Math.sin(phi) * r));
      const nrm = new THREE.Vector3(Math.cos(phi), 0.25 + f * 0.9, Math.sin(phi)).normalize();
      const size = (inner ? 0.4 + rand() * 0.2 : 0.17 + rand() * 0.13) * dabScale;
      addDab(leaves, p, nrm, strokeColor(leafColor, nrm, inner), size, rand(), [0.7, 0.32 + rand() * 0.14, Math.PI / 2, 0.35]);
    }
  }
  for (const k of masses) {
    // Each mass a slightly different shade of the tree's green, so the masses tell apart where they overlap.
    const massColor = leafColor.clone().offsetHSL((k.tone - 0.5) * 0.03, 0, (k.tone - 0.5) * 0.04);
    const rn = k.r / dabScale;
    // Three layers: big dark strokes inside, so no gap shows through to the ground; the skin, in mid-sized strokes; and
    // small loose ones just outside it that break the silhouette.
    const layers = [
      { count: 14, depth: [0.35, 0.3], size: [0.5, 0.25], inner: 1 },
      { count: 78, depth: [0.68, 0.32], size: [0.32, 0.22], inner: 0 },
      { count: 34, depth: [1.0, 0.13], size: [0.13, 0.09], inner: 0 },
    ];
    for (const layer of layers) {
      for (let i = 0, n = Math.round(layer.count * rn * rn); i < n; i++) {
        const u = rand() * 2 - 1, phi = rand() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
        // A mass is a cloud with a flattened underside: the shelf of shade a painter puts under each one.
        const dir = new THREE.Vector3(s2 * Math.cos(phi) * 1.12, u < 0 ? u * 0.55 : u, s2 * Math.sin(phi) * 1.12);
        const depth = layer.depth[0] + rand() * layer.depth[1];
        const p = k.c.clone().addScaledVector(dir, k.r * depth);
        const toCrown = p.clone().sub(crownCenter).multiply(stretch).normalize();
        const nrm = toCrown.multiplyScalar(0.55).addScaledVector(dir.clone().normalize(), 0.45).normalize();
        // Strokes deeper in the mass sit in its shade, and so does its underside.
        const inner = layer.inner ? 1 : Math.max(0, (0.85 - depth) / 0.25) * 0.5 + (u < -0.25 ? 0.4 : 0);
        const size = (layer.size[0] + rand() * layer.size[1]) * dabScale;
        addDab(leaves, p, nrm, strokeColor(massColor, nrm, Math.min(inner, 1)), size, rand(), [0.7, 0.45 + rand() * 0.35, -1, 0.7]);
      }
    }
  }
  // Fruit: bright dabs on the outer, sunward side.
  const fruit = t.fruit ?? (t.kind === 'fruit' ? C.fruit : null);
  if (fruit) {
    const n = Math.round(26 * (t.fruitDensity ?? 1) * masses.reduce((a, k) => a + k.r * k.r, 0) / 3);
    for (let i = 0; i < n; i++) {
      const k = masses[Math.floor(rand() * masses.length)];
      const u = rand() * 0.9 - 0.2, phi = rand() * Math.PI * 2, s2 = Math.sqrt(1 - u * u);
      const dir = new THREE.Vector3(s2 * Math.cos(phi), u, s2 * Math.sin(phi));
      const p = k.c.clone().addScaledVector(dir, k.r * 1.0);
      const fc = fruit.clone().offsetHSL((rand() - 0.5) * 0.04, 0, (rand() - 0.5) * 0.08);
      addDab(leaves, p, dir, fc, (0.1 + rand() * 0.04) * Math.min(1.2, dabScale), rand(), [0.2, 1, -1, 0.5]);
    }
  }
  // In the wind the crown moves as one piece (see treeWind), and the wood bends into it from the foot: by the square of the
  // height up to where the crown starts (most of its strokes above), and the limbs in the crown moving with it.
  const ys = leaves.heightsSince(leaves0).sort((a, b) => a - b);
  const height = Math.max(ys[ys.length - 1], ...wood.heightsSince(wood0)) - y0;
  const crown = Math.max(ys[Math.floor(ys.length * 0.1)] - y0, height * 0.2);
  wood.markTree(wood0, t.x, t.z, height, (y) => Math.min(Math.max(y - y0, 0) / crown, 1) ** 2);
  leaves.markTree(leaves0, t.x, t.z, height);
}

/** A stone: a lumpy, flattened ball, sunk partway into the ground, mossy on top when it's dry. */
export function addStone(b: MeshBuilder, ground: Ground, x: number, z: number, size: number, sink: number, rand: () => number,
  waterY = -Infinity, y?: number) {
  const g = mergeVertices(new THREE.IcosahedronGeometry(1, 2).deleteAttribute('normal').deleteAttribute('uv'));
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  const seed = rand() * 100, flat = 0.5 + rand() * 0.25, turn = rand() * Math.PI;
  const v = new THREE.Vector3(), yAxis = new THREE.Vector3(0, 1, 0), squash = new THREE.Vector3(1.15, flat, 0.9);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 1 + noise2(v.x * 1.3 + seed, v.z * 1.3 + v.y) * 0.18;
    v.multiplyScalar(k).multiply(squash).applyAxisAngle(yAxis, turn);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const cy = (y ?? ground.height(x, z)) + size * flat * (1 - 2 * sink);
  const m = new THREE.Matrix4().compose(new THREE.Vector3(x, cy, z), new THREE.Quaternion(), new THREE.Vector3(size, size, size));
  const n = g.getAttribute('normal'), w = new THREE.Vector3(), q = new THREE.Vector3();
  const base = C.stone.clone().offsetHSL((rand() - 0.5) * 0.04, (rand() - 0.5) * 0.1, (rand() - 0.5) * 0.12);
  const i0 = b.vertexCount;
  for (let i = 0; i < p.count; i++) {
    w.fromBufferAttribute(p, i).applyMatrix4(m);
    q.fromBufferAttribute(n, i);
    const moss = cy > waterY + 0.05 ? Math.max(0, q.y - 0.35) * 1.2 : 0;
    b.vertex(w, q, base.clone().lerp(C.moss, Math.min(moss, 0.8)), [0.6, 3, 0.8, 0]);
  }
  const idx = g.getIndex()!;
  for (let i = 0; i < idx.count; i += 3) b.tri(i0 + idx.getX(i), i0 + idx.getX(i + 1), i0 + idx.getX(i + 2));
}

/** A tuft of long grass, in the ground's own colour, a little deeper at the root: the grass is part of the meadow's paint. */
export function addTuft(g: MeshBuilder, ground: Ground, x: number, z: number, tall: number, base: THREE.Color, rand: () => number) {
  const y = ground.height(x, z), n = ground.normal(x, z);
  const root = base.clone().lerp(C.teal, 0.35).multiplyScalar(0.82);
  const tip = base.clone().lerp(C.lime, 0.1);
  const mid = root.clone().lerp(tip, 0.55);
  const blades = 4 + Math.floor(rand() * 4);
  const paint: Paint = [0.8, 0.85, 0.8, 0.6];
  for (let k = 0; k < blades; k++) {
    const a = rand() * Math.PI * 2, h = tall * (0.6 + rand() * 0.6), w = 0.035 + rand() * 0.02;
    const lean = 0.25 + rand() * 0.45, seed = rand();
    const dx = Math.cos(a), dz = Math.sin(a), px = -dz * w, pz = dx * w, across = Math.atan2(dx, -dz);
    const bx = x + dx * 0.04, bz = z + dz * 0.04;
    const v0 = g.vertex({ x: bx - px, y: y - 0.02, z: bz - pz }, n, root, paint, [0, 0], [0, seed, -w, across]);
    const v1 = g.vertex({ x: bx + px, y: y - 0.02, z: bz + pz }, n, root, paint, [0, 0], [0, seed, w, across]);
    const mx = bx + dx * lean * h * 0.4, mz = bz + dz * lean * h * 0.4, my = y + h * 0.55;
    const v2 = g.vertex({ x: mx + px * 0.7, y: my, z: mz + pz * 0.7 }, n, mid, paint, [0, 0], [0.55, seed, w * 0.7, across]);
    const v3 = g.vertex({ x: mx - px * 0.7, y: my, z: mz - pz * 0.7 }, n, mid, paint, [0, 0], [0.55, seed, -w * 0.7, across]);
    const v4 = g.vertex({ x: bx + dx * lean * h, y: y + h, z: bz + dz * lean * h }, n, tip, paint, [0, 0], [1, seed]);
    g.quad(v0, v1, v2, v3);
    g.tri(v3, v2, v4);
  }
}

/** A clump of reeds. */
export function addReeds(g: MeshBuilder, ground: Ground, cx: number, cz: number, rand: () => number) {
  const blades = 8 + Math.floor(rand() * 10), tall = 0.5 + rand() * 0.45;
  const paint: Paint = [0.6, 0.85, 1.4, 0.5];
  for (let k = 0; k < blades; k++) {
    const x = cx + (rand() - 0.5) * 0.45, z = cz + (rand() - 0.5) * 0.45, y = ground.height(x, z) - 0.03;
    const nrm = ground.normal(x, z), a = rand() * Math.PI, w = 0.018 + rand() * 0.012, h = tall * (0.6 + rand() * 0.5);
    const px = Math.cos(a) * w, pz = Math.sin(a) * w, lean = (rand() - 0.5) * 0.25, seed = rand();
    const root = C.reed.clone().lerp(C.teal, 0.4).multiplyScalar(0.75), tip = C.reed.clone().lerp(C.lime, 0.25 * rand());
    const v0 = g.vertex({ x: x - px, y, z: z - pz }, nrm, root, paint, [0, 0], [0, seed, -w, a]);
    const v1 = g.vertex({ x: x + px, y, z: z + pz }, nrm, root, paint, [0, 0], [0, seed, w, a]);
    const v2 = g.vertex({ x: x + lean * h, y: y + h, z: z + lean * h * 0.5 }, nrm, tip, paint, [0, 0], [1, seed]);
    g.tri(v0, v1, v2);
  }
}

/** A drift of wildflowers of one colour. */
export function addFlowers(b: MeshBuilder, ground: Ground, cx: number, cz: number, col: THREE.Color, count: number,
  rand: () => number, ok: (x: number, z: number) => boolean) {
  for (let k = 0; k < count; k++) {
    const x = cx + (rand() - 0.5) * 2.4, z = cz + (rand() - 0.5) * 2.4;
    if (!ok(x, z)) continue;
    const y = ground.height(x, z) + 0.18 + rand() * 0.22;
    addDab(b, new THREE.Vector3(x, y, z), new THREE.Vector3(0, 1, 0), col.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.08),
      0.055 + rand() * 0.035, rand(), [0.2, 1, -1, 0.3]);
  }
}

export interface Near { distance: number; /** Arc length along the line. */ along: number; /** Unit direction there. */ dx: number; dz: number; /** Which side, +1 left of the direction, -1 right. */ side: number; }

/**
 * A line on the map (a stream, a path, a fence) through control points, smoothed as a Catmull-Rom spline and sampled every
 * half metre. Distances to it are looked up in a grid, since terrain asks for them many times per vertex.
 */
export class MapLine {
  readonly points: THREE.Vector2[] = [];
  readonly length: number;
  private grid: Float32Array | null = null;
  private gridMin = 0; private gridCell = 0.35; private gridN = 0;

  constructor(control: [number, number][], step = 0.5) {
    const curve = new THREE.SplineCurve(control.map(([x, z]) => new THREE.Vector2(x, z)));
    const total = curve.getLength();
    const n = Math.max(2, Math.ceil(total / step));
    for (const p of curve.getSpacedPoints(n)) this.points.push(p);
    this.length = total;
  }

  /** The nearest point on the line, exactly. */
  near(x: number, z: number): Near {
    let best = Infinity, along = 0, dx = 1, dz = 0, side = 1, acc = 0;
    const pts = this.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const ex = b.x - a.x, ez = b.y - a.y, len2 = ex * ex + ez * ez, len = Math.sqrt(len2);
      const t = Math.min(1, Math.max(0, ((x - a.x) * ex + (z - a.y) * ez) / len2));
      const px = a.x + ex * t - x, pz = a.y + ez * t - z, d = px * px + pz * pz;
      if (d < best) {
        best = d; along = acc + t * len; dx = ex / len; dz = ez / len;
        side = ex * (z - a.y) - ez * (x - a.x) < 0 ? 1 : -1;
      }
      acc += len;
    }
    return { distance: Math.sqrt(best), along, dx, dz, side };
  }

  /** Distance to the line, from the grid (built on first use over a square of the given half-size). */
  distance(x: number, z: number, half = 48): number {
    if (!this.grid) {
      this.gridMin = -half; this.gridN = Math.ceil((2 * half) / this.gridCell) + 1;
      const n = this.gridN, g = new Float32Array(n * n);
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) g[j * n + i] = this.near(this.gridMin + i * this.gridCell, this.gridMin + j * this.gridCell).distance;
      this.grid = g;
    }
    const n = this.gridN, fx = (x - this.gridMin) / this.gridCell, fz = (z - this.gridMin) / this.gridCell;
    if (fx < 0 || fz < 0 || fx >= n - 1 || fz >= n - 1) return this.near(x, z).distance;
    const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j, g = this.grid;
    const a = g[j * n + i], b = g[j * n + i + 1], c = g[(j + 1) * n + i], d = g[(j + 1) * n + i + 1];
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  }

  /** The point and direction at an arc length. */
  at(along: number): { x: number; z: number; dx: number; dz: number } {
    const pts = this.points;
    let acc = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], len = a.distanceTo(b);
      if (acc + len >= along || i === pts.length - 2) {
        const t = Math.min(1, Math.max(0, (along - acc) / len));
        return { x: a.x + (b.x - a.x) * t, z: a.y + (b.y - a.y) * t, dx: (b.x - a.x) / len, dz: (b.y - a.y) / len };
      }
      acc += len;
    }
    return { x: pts[0].x, z: pts[0].y, dx: 1, dz: 0 };
  }
}

/** Water along a line, at one level, wide enough that its edges tuck under the banks. Flows towards the line's start. */
export function addWaterRibbon(b: MeshBuilder, line: MapLine, half: number, y: number) {
  const up = new THREE.Vector3(0, 1, 0);
  const pts = line.points;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], c = pts[Math.min(pts.length - 1, i + 1)];
    const dx = c.x - a.x, dz = c.y - a.y, len = Math.hypot(dx, dz);
    const nx = -dz / len, nz = dx / len, flow = Math.atan2(-dz, -dx);
    const p = pts[i];
    b.vertex({ x: p.x - nx * half, y, z: p.y - nz * half }, up, C.water, [0, 1, flow, 0], [0, 0]);
    b.vertex({ x: p.x + nx * half, y, z: p.y + nz * half }, up, C.water, [0, 1, flow, 0], [0, 1]);
  }
  const i0 = b.vertexCount - pts.length * 2;
  for (let i = 0; i < pts.length - 1; i++) { const a = i0 + i * 2; b.quad(a, a + 1, a + 3, a + 2); }
}
