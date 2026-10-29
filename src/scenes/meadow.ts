import * as THREE from 'three';
import type { BrushRenderer } from '../renderer/renderer';
import { MeshBuilder, noise2, rng, srgb, type Paint } from './builder';

// The first slice: a corner of a farm in a meadow. A stream, a field of wheat, three trees (two broadleaf, one with fruit,
// and a blue-green cypress), long grass and wildflowers, and one solar panel, the only inked thing.
// One tile is one metre, as in the game.

const SIZE = 64, STEP = 0.5;

/** Where the stream runs: its centre line's x for a z, and the flow's slope dx/dz. */
const streamX = (z: number) => 6 + 2.2 * Math.sin(z * 0.13 + 0.5) + 0.8 * Math.sin(z * 0.31);
const streamSlope = (z: number) => 2.2 * 0.13 * Math.cos(z * 0.13 + 0.5) + 0.8 * 0.31 * Math.cos(z * 0.31);
const streamDistance = (x: number, z: number) => Math.abs(x - streamX(z)) / Math.sqrt(1 + streamSlope(z) ** 2);

const FIELD = { x0: -3.5, x1: -0.5, z0: -1.5, z1: 1.5 };
const PANEL = { x: 1.5, z: -4.5 };
const TREES = [
  { kind: 'fruit' as const, x: -6.0, z: -3.5, seed: 11 },
  { kind: 'broadleaf' as const, x: -3.0, z: 5.5, seed: 23 },
  { kind: 'cypress' as const, x: 10.5, z: 2.0, seed: 37 },
];

const smooth = (a: number, b: number, x: number) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };

/** The land before the stream is cut and the pads levelled. */
function rolling(x: number, z: number) {
  return 0.9 * noise2(x * 0.045, z * 0.045) + 0.35 * noise2(x * 0.11 + 5, z * 0.11 - 3) + 0.012 * x;
}
const waterLevel = (z: number) => rolling(streamX(z), z) - 0.34;

/** Levelled pads under the field and the panel: how much of the pad applies, and its height. */
function pad(x: number, z: number): [number, number] {
  const fx = Math.max(FIELD.x0 - x, 0, x - FIELD.x1), fz = Math.max(FIELD.z0 - z, 0, z - FIELD.z1);
  const fw = 1 - smooth(0, 1.5, Math.hypot(fx, fz));
  const px = Math.max(Math.abs(x - PANEL.x) - 1.2, 0), pz = Math.max(Math.abs(z - PANEL.z) - 0.8, 0);
  const pw = 1 - smooth(0, 1.2, Math.hypot(px, pz));
  if (fw >= pw) return [fw, rolling((FIELD.x0 + FIELD.x1) / 2, (FIELD.z0 + FIELD.z1) / 2)];
  return [pw, rolling(PANEL.x, PANEL.z)];
}

export function height(x: number, z: number) {
  let h = rolling(x, z);
  const [w, ph] = pad(x, z);
  h += (ph - h) * w;
  const d = streamDistance(x, z);
  const bed = waterLevel(z) - 0.32;
  return bed + (h - bed) * smooth(0.7, 2.6, d);
}

function normalAt(x: number, z: number) {
  const e = 0.25;
  return new THREE.Vector3(height(x - e, z) - height(x + e, z), 2 * e, height(x, z - e) - height(x, z + e)).normalize();
}

// Palette (sRGB). Greens span yellow-green to teal, as the reference's meadows do.
const C = {
  lime: srgb(0xa6c45a), meadow: srgb(0x6aa04a), emerald: srgb(0x40885a), teal: srgb(0x3b806e),
  moss: srgb(0x4f8040), mud: srgb(0x7a6244), bed: srgb(0x3e5a52), water: srgb(0x1e5862),
  soil: srgb(0x8a5634), timber: srgb(0xc58f55), ceramic: srgb(0xeee6d2), brass: srgb(0xc08a48), glass: srgb(0x1d4fa0),
  bark: srgb(0x6e4a3e), leaf: srgb(0x4e9a3a), leafLight: srgb(0x8cc44a), fruitLeaf: srgb(0x5aa03e), cypress: srgb(0x2e6e57),
  fruit: srgb(0xf06a2c), wheatRoot: srgb(0x8a9a3a), wheatTip: srgb(0xf0c45a),
};

export interface Meadow { center: THREE.Vector3; radius: number; }

export function buildMeadow(r: BrushRenderer): Meadow {
  terrain(r);
  water(r);
  field(r);
  trees(r);
  grass(r);
  solarPanel(r);
  return { center: new THREE.Vector3(0, 0, 0), radius: 34 };
}

function terrain(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const n = Math.round(SIZE / STEP) + 1, half = SIZE / 2;
  const c = new THREE.Color();
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = -half + i * STEP, z = -half + j * STEP;
    const y = height(x, z);
    const d = streamDistance(x, z);
    // Colour follows the land's form, as a painter would: rises catch the light yellow-green, hollows sink to emerald and
    // teal. Broad patches drift on top.
    const curve = y - (height(x + 2.5, z) + height(x - 2.5, z) + height(x, z + 2.5) + height(x, z - 2.5)) / 4;
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5, k = noise2(x * 0.19 - 7, z * 0.19 + 2) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.0, 0.18, curve) * 0.75 + smooth(0.6, 0.9, m) * 0.25)
      .lerp(C.emerald, smooth(0.0, 0.2, -curve) * 0.7 + smooth(0.65, 0.95, 1 - m) * 0.3)
      .lerp(C.teal, smooth(0.15, 0.35, -curve) * 0.4 + smooth(0.75, 1, k) * 0.2);
    // Banks: moss, then wet earth, then the stream bed.
    c.lerp(C.moss, 1 - smooth(1.6, 3.2, d)).lerp(C.mud, (1 - smooth(1.0, 1.7, d)) * 0.8).lerp(C.bed, 1 - smooth(0.6, 1.2, d));
    const angle = 0.7 + noise2(x * 0.05, z * 0.05) * 0.9;
    const paint: Paint = [1.0, 2.0, angle, 0];
    b.vertex({ x, y, z }, normalAt(x, z), c, paint);
  }
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = j * n + i;
    b.quad(a, a + n, a + n + 1, a + 1);
  }
  r.add(b.build(), 'paint');
}

function water(r: BrushRenderer) {
  const b = new MeshBuilder('water');
  const half = SIZE / 2, rows = Math.round(SIZE / STEP) + 1, width = 1.45;
  const up = new THREE.Vector3(0, 1, 0);
  for (let j = 0; j < rows; j++) {
    const z = -half + j * STEP, x = streamX(z), s = streamSlope(z);
    // Flowing towards -z: the direction in xz is (-s, -1).
    const flow = Math.atan2(-1, -s);
    const nx = 1 / Math.sqrt(1 + s * s);
    const y = waterLevel(z);
    b.vertex({ x: x - width * nx, y, z: z + width * s * nx }, up, C.water, [0, 1, flow, 0], [z * 0.1, 0]);
    b.vertex({ x: x + width * nx, y, z: z - width * s * nx }, up, C.water, [0, 1, flow, 0], [z * 0.1, 1]);
  }
  for (let j = 0; j < rows - 1; j++) { const a = j * 2; b.quad(a, a + 2, a + 3, a + 1); }
  r.add(b.build(), 'water', false);
}

/** The field: an inked raised bed of soil in a timber frame; the wheat in it is painted. */
function field(r: BrushRenderer) {
  const ink = new MeshBuilder('ink');
  const { x0, x1, z0, z1 } = FIELD;
  const y0 = pad((x0 + x1) / 2, (z0 + z1) / 2)[1];
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const m = new THREE.Matrix4();
  // Soil, a little proud of the ground.
  ink.addGeometry(new THREE.BoxGeometry(w - 0.1, 0.22, d - 0.1), m.makeTranslation(cx, y0 + 0.05, cz), C.soil, [0, 1, 0, 0]);
  // Timber frame: four boards.
  const board = (bx: number, bz: number, sx: number, sz: number) =>
    ink.addGeometry(new THREE.BoxGeometry(sx, 0.26, sz), new THREE.Matrix4().makeTranslation(bx, y0 + 0.08, bz), C.timber, [2, 1, 0, 0]);
  board(cx, z0, w + 0.12, 0.12); board(cx, z1, w + 0.12, 0.12); board(x0, cz, 0.12, d); board(x1, cz, 0.12, d);
  r.add(ink.build(), 'ink');

  // Wheat: nine tiles of stalks with heavy golden ears.
  const g = new MeshBuilder('grass');
  const rand = rng(5);
  const up = new THREE.Vector3(0, 1, 0);
  const soilTop = y0 + 0.16;
  for (let tx = 0; tx < 3; tx++) for (let tz = 0; tz < 3; tz++) {
    for (let k = 0; k < 64; k++) {
      const x = x0 + 0.12 + tx + rand() * 0.86, z = z0 + 0.12 + tz + rand() * 0.86;
      const h = 0.55 + rand() * 0.18, lean = (rand() - 0.5) * 0.1, seed = rand();
      const dir = rand() * Math.PI;
      const ox = Math.cos(dir) * 0.018, oz = Math.sin(dir) * 0.018;
      const paint: Paint = [0.5, 1.4, 0.4, 0.8];
      const tip = new THREE.Vector3(x + lean, soilTop + h, z + lean * 0.5);
      const root = C.wheatRoot.clone(), gold = C.wheatTip.clone().offsetHSL((rand() - 0.5) * 0.03, 0, (rand() - 0.5) * 0.06);
      // Stalk.
      const a = g.vertex({ x: x - ox, y: soilTop, z: z - oz }, up, root, paint, [0, 0], [0, seed]);
      const b = g.vertex({ x: x + ox, y: soilTop, z: z + oz }, up, root, paint, [0, 0], [0, seed]);
      const c2 = g.vertex({ x: tip.x + ox * 0.6, y: tip.y - 0.16, z: tip.z + oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed]);
      const d2 = g.vertex({ x: tip.x - ox * 0.6, y: tip.y - 0.16, z: tip.z - oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed]);
      g.quad(a, b, c2, d2);
      // Ear: a fat diamond.
      const e1 = g.vertex({ x: tip.x - ox * 3.4, y: tip.y - 0.08, z: tip.z - oz * 3.4 }, up, gold, paint, [0, 0], [0.9, seed]);
      const e2 = g.vertex({ x: tip.x + ox * 3.4, y: tip.y - 0.08, z: tip.z + oz * 3.4 }, up, gold, paint, [0, 0], [0.9, seed]);
      const e3 = g.vertex({ x: tip.x, y: tip.y + 0.09, z: tip.z }, up, gold, paint, [0, 0], [1, seed]);
      g.tri(d2, c2, e2); g.tri(d2, e2, e3); g.tri(d2, e3, e1);
    }
  }
  r.add(g.build(), 'grass', false);
}

/** Trees: a trunk with a few boughs, and a crown of clumps covered in leafy dabs whose normals are the crown's. */
function trees(r: BrushRenderer) {
  const wood = new MeshBuilder('paint');
  const leaves = new MeshBuilder('foliage');
  for (const t of TREES) {
    const rand = rng(t.seed);
    const y0 = height(t.x, t.z) - 0.05;
    const base = new THREE.Vector3(t.x, y0, t.z);
    const cypress = t.kind === 'cypress';
    const trunkH = cypress ? 1.2 : 1.9, crownY = cypress ? 3.1 : 3.0, crownR = cypress ? 1.25 : 1.85;
    const crown = base.clone().add(new THREE.Vector3(0, crownY, 0));
    // Trunk.
    const trunk = new THREE.CylinderGeometry(cypress ? 0.1 : 0.12, cypress ? 0.16 : 0.2, trunkH + 0.4, 9, 1);
    wood.addGeometry(trunk, new THREE.Matrix4().makeTranslation(t.x, y0 + (trunkH + 0.4) / 2, t.z), C.bark, [0.4, 2.5, 1.57, 0]);
    // Clumps.
    const clumps: { c: THREE.Vector3; r: number }[] = [];
    if (cypress) {
      for (let i = 0; i < 7; i++) {
        const f = i / 6, y = 1.3 + f * 4.6;
        const rr = (1 - f * 0.75) * 0.95 * Math.sin(Math.min(1, 0.35 + f * 2.2) * Math.PI / 2);
        clumps.push({ c: base.clone().add(new THREE.Vector3((rand() - 0.5) * 0.2, y, (rand() - 0.5) * 0.2)), r: Math.max(rr, 0.3) });
      }
    } else {
      clumps.push({ c: crown.clone().add(new THREE.Vector3(0, 0.55, 0)), r: 1.05 });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rand() * 0.6, rr = 0.75 + rand() * 0.35;
        const off = new THREE.Vector3(Math.cos(a) * crownR * 0.62, (rand() - 0.6) * 0.7, Math.sin(a) * crownR * 0.62);
        clumps.push({ c: crown.clone().add(off), r: rr });
      }
      // Boughs from the trunk top to the lower clumps.
      for (const k of clumps.slice(1, 5)) {
        const from = base.clone().add(new THREE.Vector3(0, trunkH, 0)), to = k.c.clone().lerp(crown, 0.35);
        const len = from.distanceTo(to);
        const g = new THREE.CylinderGeometry(0.05, 0.09, len, 6, 1);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
        const mat = new THREE.Matrix4().compose(from.clone().lerp(to, 0.5), q, new THREE.Vector3(1, 1, 1));
        wood.addGeometry(g, mat, C.bark, [0.4, 2.5, 1.57, 0]);
      }
    }
    const crownCenter = cypress ? base.clone().add(new THREE.Vector3(0, 3.4, 0)) : crown;
    const stretch = cypress ? new THREE.Vector3(1, 0.35, 1) : new THREE.Vector3(1, 1.15, 1);
    for (const k of clumps) {
      const count = Math.round(70 * k.r * k.r * (cypress ? 1.4 : 1));
      for (let i = 0; i < count; i++) {
        // A point on (or just inside) the clump's surface, biased to its outside.
        const u = rand() * 2 - 1, phi = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        const dir = new THREE.Vector3(s * Math.cos(phi), u, s * Math.sin(phi));
        const p = k.c.clone().addScaledVector(dir, k.r * (0.62 + rand() * 0.38));
        // Sphere-pushed normal: mostly the crown's shape, some of the clump's, so the bands fall in soft blobs.
        const toCrown = p.clone().sub(crownCenter).multiply(stretch).normalize();
        const nrm = toCrown.multiplyScalar(0.62).addScaledVector(dir, 0.38).normalize();
        let col = (cypress ? C.cypress : t.kind === 'fruit' ? C.fruitLeaf : C.leaf).clone();
        // Top dabs a little yellower, lower ones bluer.
        col = col.lerp(cypress ? C.teal : C.leafLight, Math.max(0, nrm.y) * 0.35 * rand());
        col.offsetHSL((rand() - 0.5) * 0.03, (rand() - 0.5) * 0.1, (rand() - 0.5) * 0.05);
        const size = (cypress ? 0.36 : 0.42) + rand() * 0.22;
        addDab(leaves, p, nrm, col, size, rand(), [0.7, 1.2, rand() * 3, 0.9]);
      }
    }
    // Fruit: bright dabs on the outer, sunward side.
    if (t.kind === 'fruit') {
      for (let i = 0; i < 26; i++) {
        const k = clumps[1 + Math.floor(rand() * (clumps.length - 1))];
        const u = rand() * 0.9 - 0.2, phi = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        const dir = new THREE.Vector3(s * Math.cos(phi), u, s * Math.sin(phi));
        const p = k.c.clone().addScaledVector(dir, k.r * 1.0);
        const fc = C.fruit.clone().offsetHSL((rand() - 0.5) * 0.04, 0, (rand() - 0.5) * 0.08);
        addDab(leaves, p, dir, fc, 0.1 + rand() * 0.04, rand(), [0.2, 1, 0, 0.5]);
      }
    }
  }
  r.add(wood.build(), 'paint');
  r.add(leaves.build(), 'foliage');
}

function addDab(b: MeshBuilder, p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, size: number, seed: number, paint: Paint) {
  const i0 = b.vertex(p, n, c, paint, [0, 0], [-1, -1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [1, -1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [1, 1, size, seed]);
  b.vertex(p, n, c, paint, [0, 0], [-1, 1, size, seed]);
  b.quad(i0, i0 + 1, i0 + 2, i0 + 3);
}

/** Long grass in tufts, thick where the meadow is lush and by the water, with wildflowers in drifts. */
function grass(r: BrushRenderer) {
  const g = new MeshBuilder('grass');
  const flowers = new MeshBuilder('foliage');
  const rand = rng(77);
  const half = SIZE / 2 - 1;
  const blocked = (x: number, z: number) =>
    (x > FIELD.x0 - 0.35 && x < FIELD.x1 + 0.35 && z > FIELD.z0 - 0.35 && z < FIELD.z1 + 0.35) ||
    (Math.abs(x - PANEL.x) < 1.25 && Math.abs(z - PANEL.z) < 0.85) || streamDistance(x, z) < 1.45 ||
    TREES.some((t) => Math.hypot(x - t.x, z - t.z) < 0.35);
  const tuftColor = (x: number, z: number) => {
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    return C.meadow.clone().lerp(C.lime, smooth(0.45, 0.85, m) * 0.8).lerp(C.emerald, smooth(0.55, 0.9, 1 - m) * 0.7);
  };
  let placed = 0;
  for (let tries = 0; placed < 6000 && tries < 120000; tries++) {
    const x = (rand() * 2 - 1) * half, z = (rand() * 2 - 1) * half;
    if (blocked(x, z)) continue;
    // Grass gathers where a scythe wouldn't reach: banks, field edges, tree feet, the panel's legs. The open meadow is
    // mostly paint, with the odd tuft.
    const near = Math.max(
      1 - smooth(1.6, 3.4, streamDistance(x, z)),
      1 - smooth(0.2, 1.4, Math.hypot(Math.max(FIELD.x0 - x, 0, x - FIELD.x1), Math.max(FIELD.z0 - z, 0, z - FIELD.z1))),
      ...TREES.map((t) => 1 - smooth(0.4, 2.2, Math.hypot(x - t.x, z - t.z))),
      1 - smooth(0.3, 1.4, Math.hypot(Math.max(Math.abs(x - PANEL.x) - 1.1, 0), Math.max(Math.abs(z - PANEL.z) - 0.7, 0))));
    const lush = Math.max(near, smooth(0.55, 0.9, noise2(x * 0.09 + 40, z * 0.09) * 0.5 + 0.5) * 0.7);
    if (rand() > lush * 0.95 + 0.04) continue;
    placed++;
    const y = height(x, z), n = normalAt(x, z);
    const base = tuftColor(x, z);
    const root = base.clone().lerp(C.teal, 0.5).multiplyScalar(0.75);
    const tip = base.clone().lerp(C.lime, 0.2);
    const blades = 4 + Math.floor(rand() * 4), tall = 0.18 + lush * 0.32;
    for (let k = 0; k < blades; k++) {
      const a = rand() * Math.PI * 2, h = tall * (0.6 + rand() * 0.6), w = 0.035 + rand() * 0.02;
      const lean = 0.25 + rand() * 0.45, seed = rand();
      const dx = Math.cos(a), dz = Math.sin(a), px = -dz * w, pz = dx * w;
      const bx = x + dx * 0.04, bz = z + dz * 0.04;
      const paint: Paint = [0.8, 0.85, 0.8, 0.6];
      const v0 = g.vertex({ x: bx - px, y: y - 0.02, z: bz - pz }, n, root, paint, [0, 0], [0, seed]);
      const v1 = g.vertex({ x: bx + px, y: y - 0.02, z: bz + pz }, n, root, paint, [0, 0], [0, seed]);
      const mx = bx + dx * lean * h * 0.4, mz = bz + dz * lean * h * 0.4, my = y + h * 0.55;
      const mid = root.clone().lerp(tip, 0.55);
      const v2 = g.vertex({ x: mx + px * 0.7, y: my, z: mz + pz * 0.7 }, n, mid, paint, [0, 0], [0.55, seed]);
      const v3 = g.vertex({ x: mx - px * 0.7, y: my, z: mz - pz * 0.7 }, n, mid, paint, [0, 0], [0.55, seed]);
      const v4 = g.vertex({ x: bx + dx * lean * h, y: y + h, z: bz + dz * lean * h }, n, tip, paint, [0, 0], [1, seed]);
      g.quad(v0, v1, v2, v3);
      g.tri(v3, v2, v4);
    }
  }
  // Wildflowers: drifts of one colour each, a few strays.
  const palette = [srgb(0xf08bb0), srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8), srgb(0xe8574a)];
  for (let d = 0; d < 70; d++) {
    const cx = (rand() * 2 - 1) * half, cz = (rand() * 2 - 1) * half;
    const col = palette[Math.floor(rand() * palette.length)];
    const count = 6 + Math.floor(rand() * 14);
    for (let k = 0; k < count; k++) {
      const x = cx + (rand() - 0.5) * 2.4, z = cz + (rand() - 0.5) * 2.4;
      if (blocked(x, z) || Math.abs(x) > half || Math.abs(z) > half) continue;
      const y = height(x, z) + 0.18 + rand() * 0.22;
      addDab(flowers, new THREE.Vector3(x, y, z), new THREE.Vector3(0, 1, 0), col.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.08),
        0.055 + rand() * 0.035, rand(), [0.2, 1, 0, 0.3]);
    }
  }
  r.add(g.build(), 'grass', false);
  r.add(flowers.build(), 'foliage', false);
}

/** One solar panel on brass legs: white ceramic frame, blue cells. Inked. */
function solarPanel(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  const y0 = pad(PANEL.x, PANEL.z)[1];
  const tilt = THREE.MathUtils.degToRad(28), face = THREE.MathUtils.degToRad(15);
  const center = new THREE.Vector3(PANEL.x, y0 + 1.0, PANEL.z);
  // The panel faces +z (towards the noon sun), turned a little.
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, face, 0, 'YXZ'));
  const frame = new THREE.Matrix4().compose(center, q, new THREE.Vector3(1, 1, 1));
  b.addGeometry(new THREE.BoxGeometry(2.2, 0.08, 1.3), frame, C.ceramic, [0, 1, 0, 0]);
  // Glass on top of the frame, with uv over the panel for the cells.
  const W = 1.04, D = 0.6, up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  const corner = (u: number, v: number) => new THREE.Vector3(u * W, 0.045, v * D).applyMatrix4(frame);
  const paint: Paint = [1, 6, 3, 0];
  const g0 = b.vertex(corner(-1, -1), up, C.glass, paint, [0, 0]);
  const g1 = b.vertex(corner(1, -1), up, C.glass, paint, [1, 0]);
  const g2 = b.vertex(corner(1, 1), up, C.glass, paint, [1, 1]);
  const g3 = b.vertex(corner(-1, 1), up, C.glass, paint, [0, 1]);
  b.quad(g0, g3, g2, g1);
  // Legs: two brass posts under the back edge and two shorter under the front.
  for (const [u, v] of [[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]]) {
    const top = new THREE.Vector3(u, -0.04, v).applyMatrix4(frame);
    const len = top.y - y0 + 0.05;
    b.addGeometry(new THREE.CylinderGeometry(0.045, 0.06, len, 8), new THREE.Matrix4().makeTranslation(top.x, y0 + len / 2 - 0.05, top.z), C.brass, [0, 1, 0, 0]);
  }
  // A ceramic footing.
  b.addGeometry(new THREE.BoxGeometry(2.0, 0.12, 1.1), new THREE.Matrix4().makeTranslation(PANEL.x, y0 + 0.02, PANEL.z), C.ceramic, [0, 1, 0, 0]);
  r.add(b.build(), 'ink');
}
