import * as THREE from 'three';
import type { BrushRenderer } from '../renderer/renderer';
import { MeshBuilder, noise2, rng, srgb, type Paint } from './builder';
import { C, addFlowers, addReeds, addStone, addTuft, groundOf, growTree, smooth, type Tree } from './kit';

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
const TREES: Tree[] = [
  { kind: 'fruit', x: -6.0, z: -3.5, seed: 11 },
  { kind: 'broadleaf', x: -3.0, z: 5.5, seed: 23 },
  { kind: 'cypress', x: 10.5, z: 2.0, seed: 37 },
];

/** The land before the stream is cut and the pads levelled. */
function rolling(x: number, z: number) {
  return 0.9 * noise2(x * 0.045, z * 0.045) + 0.2 * noise2(x * 0.11 + 5, z * 0.11 - 3) + 0.012 * x;
}
/**
 * The stream lies at one level, as a brook does over a short reach, in a shallow valley: near it the land eases down to a
 * floodplain a little above the water. One level also makes its reflection exact (one mirror plane).
 */
export const WATER_Y = (() => {
  let sum = 0;
  for (let z = -32; z <= 32; z++) sum += rolling(streamX(z), z);
  return sum / 65 - 0.3;
})();
/** The land with the valley eased in, before the pads are levelled and the stream cut. */
function land(x: number, z: number) {
  const h = rolling(x, z);
  return h + (WATER_Y + 0.28 - h) * (1 - smooth(2.2, 9, streamDistance(x, z)));
}

/** Levelled pads under the field and the panel: how much of the pad applies, and its height. */
function pad(x: number, z: number): [number, number] {
  const fx = Math.max(FIELD.x0 - x, 0, x - FIELD.x1), fz = Math.max(FIELD.z0 - z, 0, z - FIELD.z1);
  const fw = 1 - smooth(0, 1.5, Math.hypot(fx, fz));
  const px = Math.max(Math.abs(x - PANEL.x) - 1.2, 0), pz = Math.max(Math.abs(z - PANEL.z) - 0.8, 0);
  const pw = 1 - smooth(0, 1.2, Math.hypot(px, pz));
  if (fw >= pw) return [fw, land((FIELD.x0 + FIELD.x1) / 2, (FIELD.z0 + FIELD.z1) / 2)];
  return [pw, land(PANEL.x, PANEL.z)];
}

export function height(x: number, z: number) {
  let h = land(x, z);
  const [w, ph] = pad(x, z);
  h += (ph - h) * w;
  // The stream's channel: a bed 0.8 m under the water, its banks meeting the water about 1.5 m from the middle.
  const bed = WATER_Y - 0.8;
  return bed + (h - bed) * smooth(0.3, 2.3, streamDistance(x, z));
}

const ground = groundOf(height);
const normalAt = ground.normal;

export interface Meadow { center: THREE.Vector3; radius: number; waterLevel: number; }

export function buildMeadow(r: BrushRenderer): Meadow {
  terrain(r);
  water(r);
  field(r);
  trees(r);
  grass(r);
  solarPanel(r);
  stones(r);
  reeds(r);
  return { center: new THREE.Vector3(0, 0, 0), radius: 34, waterLevel: WATER_Y };
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
    const curve = 0.4 * (y - (height(x + 2.5, z) + height(x - 2.5, z) + height(x, z + 2.5) + height(x, z - 2.5)) / 4)
      + 0.6 * (y - (height(x + 6, z) + height(x - 6, z) + height(x, z + 6) + height(x, z - 6)) / 4);
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5, k = noise2(x * 0.19 - 7, z * 0.19 + 2) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.0, 0.18, curve) * 0.6 + smooth(0.6, 0.9, m) * 0.2)
      .lerp(C.emerald, smooth(0.0, 0.2, -curve) * 0.55 + smooth(0.65, 0.95, 1 - m) * 0.25)
      .lerp(C.teal, smooth(0.15, 0.35, -curve) * 0.35 + smooth(0.75, 1, k) * 0.15);
    // Banks: moss, then wet earth, then the stream bed.
    c.lerp(C.moss, 1 - smooth(1.8, 3.4, d)).lerp(C.mud, (1 - smooth(1.45, 1.9, d)) * 0.8).lerp(C.bed, 1 - smooth(1.1, 1.5, d));
    // Brushwork shows where the land does something (banks, the edges of the field and the panel's pad, the turns of the
    // slopes, round the trees) and fades to quiet colour on the open lawn, its border broken by noise.
    const [pw] = pad(x, z);
    const detail = Math.min(1, Math.max(0.12,
      Math.max(1 - smooth(1.4, 4.2, d), 4 * pw * (1 - pw) * 0.9, smooth(0.06, 0.2, Math.abs(curve)) * 0.7,
        ...TREES.map((t) => (1 - smooth(1.5, 3.8, Math.hypot(x - t.x, z - t.z))) * 0.8))
      + noise2(x * 0.21 + 3, z * 0.21 - 9) * 0.22 + 0.1));
    const angle = 0.7 + noise2(x * 0.05, z * 0.05) * 0.9;
    const paint: Paint = [detail, 2.0, angle, 0];
    b.vertex({ x, y, z }, normalAt(x, z), c, paint);
  }
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = j * n + i;
    b.quad(a, a + n, a + n + 1, a + 1);
  }
  r.add(b.build(), 'ground', { under: true, fields: { x: 0, z: 0, side: SIZE, turn: 0 } });
}

function water(r: BrushRenderer) {
  const b = new MeshBuilder('water');
  const half = SIZE / 2, rows = Math.round(SIZE / STEP) + 1, width = 2.0;
  const up = new THREE.Vector3(0, 1, 0);
  for (let j = 0; j < rows; j++) {
    const z = -half + j * STEP, x = streamX(z), s = streamSlope(z);
    // Flowing towards -z: the direction in xz is (-s, -1).
    const flow = Math.atan2(-1, -s);
    const nx = 1 / Math.sqrt(1 + s * s);
    const y = WATER_Y;
    b.vertex({ x: x - width * nx, y, z: z + width * s * nx }, up, C.water, [0, 1, flow, 0], [z * 0.1, 0]);
    b.vertex({ x: x + width * nx, y, z: z - width * s * nx }, up, C.water, [0, 1, flow, 0], [z * 0.1, 1]);
  }
  for (let j = 0; j < rows - 1; j++) { const a = j * 2; b.quad(a, a + 2, a + 3, a + 1); }
  // Wide enough that its edges tuck under the banks: where the water meets the land is where it thins to nothing.
  r.add(b.build(), 'water');
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

  // Wheat: a painted golden mass filling the bed, and stalks with heavy ears standing out of it and round its edge. The mass
  // carries the field's colour; the stalks only break its top and sides, so little of the field is thin, crawling geometry.
  const mass = new MeshBuilder('crop');
  mass.addGeometry(new THREE.BoxGeometry(w - 0.5, 0.36, d - 0.5), new THREE.Matrix4().makeTranslation(cx, y0 + 0.16 + 0.3, cz),
    C.wheatTip.clone().lerp(C.wheatRoot, 0.35), [1, 3.0, 0.4, 0]);
  r.add(mass.build(), 'crop');
  const g = new MeshBuilder('grass');
  const rand = rng(5);
  const up = new THREE.Vector3(0, 1, 0);
  const soilTop = y0 + 0.16;
  for (let tx = 0; tx < 3; tx++) for (let tz = 0; tz < 3; tz++) {
    for (let k = 0; k < 60; k++) {
      const x = x0 + 0.12 + tx + rand() * 0.86, z = z0 + 0.12 + tz + rand() * 0.86;
      const h = 0.55 + rand() * 0.18, lean = (rand() - 0.5) * 0.1, seed = rand();
      const dir = rand() * Math.PI;
      const ox = Math.cos(dir) * 0.026, oz = Math.sin(dir) * 0.026;
      const paint: Paint = [0.5, 1.4, 0.4, 0.8];
      const tip = new THREE.Vector3(x + lean, soilTop + h, z + lean * 0.5);
      const root = C.wheatRoot.clone(), gold = C.wheatTip.clone().lerp(C.wheatRoot, rand() * rand() * 0.6).offsetHSL((rand() - 0.5) * 0.03, 0, (rand() - 0.5) * 0.06);
      // Stalk.
      const a = g.vertex({ x: x - ox, y: soilTop, z: z - oz }, up, root, paint, [0, 0], [0, seed, -0.026, dir]);
      const b = g.vertex({ x: x + ox, y: soilTop, z: z + oz }, up, root, paint, [0, 0], [0, seed, 0.026, dir]);
      const c2 = g.vertex({ x: tip.x + ox * 0.6, y: tip.y - 0.16, z: tip.z + oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed, 0.026 * 0.6, dir]);
      const d2 = g.vertex({ x: tip.x - ox * 0.6, y: tip.y - 0.16, z: tip.z - oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed, -0.026 * 0.6, dir]);
      g.quad(a, b, c2, d2);
      // Ear: a fat diamond.
      const e1 = g.vertex({ x: tip.x - ox * 2.2, y: tip.y - 0.06, z: tip.z - oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed, -0.026 * 2.2, dir]);
      const e2 = g.vertex({ x: tip.x + ox * 2.2, y: tip.y - 0.06, z: tip.z + oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed, 0.026 * 2.2, dir]);
      const e3 = g.vertex({ x: tip.x + lean * 0.3, y: tip.y + 0.12, z: tip.z }, up, gold, paint, [0, 0], [1, seed]);
      g.tri(d2, c2, e2); g.tri(d2, e2, e3); g.tri(d2, e3, e1);
    }
  }
  r.add(g.build(), 'grass', { castShadow: false });
}

function trees(r: BrushRenderer) {
  const wood = new MeshBuilder('paint');
  const leaves = new MeshBuilder('foliage');
  for (const t of TREES) growTree(wood, leaves, ground, t, rng(t.seed));
  r.add(wood.build(), 'paint');
  r.add(leaves.build(), 'foliage');
}

/** Long grass in tufts, thick where the meadow is lush and by the water, with wildflowers in drifts. */
function grass(r: BrushRenderer) {
  const g = new MeshBuilder('grass');
  const flowers = new MeshBuilder('foliage');
  const rand = rng(77);
  const half = SIZE / 2 - 1;
  const blocked = (x: number, z: number) =>
    (x > FIELD.x0 - 0.35 && x < FIELD.x1 + 0.35 && z > FIELD.z0 - 0.35 && z < FIELD.z1 + 0.35) ||
    (Math.abs(x - PANEL.x) < 1.25 && Math.abs(z - PANEL.z) < 0.85) || streamDistance(x, z) < 1.6 ||
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
    addTuft(g, ground, x, z, 0.18 + lush * 0.32, tuftColor(x, z), rand);
  }
  // Wildflowers: drifts of one colour each, a few strays.
  const palette = [srgb(0xf08bb0), srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8), srgb(0xe8574a)];
  for (let d = 0; d < 70; d++) {
    const cx = (rand() * 2 - 1) * half, cz = (rand() * 2 - 1) * half;
    const col = palette[Math.floor(rand() * palette.length)];
    addFlowers(flowers, ground, cx, cz, col, 6 + Math.floor(rand() * 14), rand, (x, z) => !blocked(x, z) && Math.abs(x) <= half && Math.abs(z) <= half);
  }
  r.add(g.build(), 'grass', { castShadow: false });
  r.add(flowers.build(), 'foliage', { castShadow: false, cover: 'none' });
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

/** Stones: pebbles over the stream bed, seen through the water, and a few rocks on the banks, mossy on top. */
function stones(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const rand = rng(91);
  const place = (x: number, z: number, size: number, sink: number) => addStone(b, ground, x, z, size, sink, rand, WATER_Y);
  const along = () => {
    const z = (rand() * 2 - 1) * (SIZE / 2 - 2);
    return { z, x: streamX(z), s: streamSlope(z) };
  };
  for (let i = 0; i < 70; i++) {
    const { x, z, s } = along(), off = (rand() * 2 - 1) * 1.5, nx = 1 / Math.sqrt(1 + s * s);
    place(x + off * nx, z - off * s * nx, 0.07 + rand() * 0.13, 0.4);
  }
  for (let c = 0; c < 9; c++) {
    const { x, z, s } = along(), side = rand() < 0.5 ? -1 : 1, nx = 1 / Math.sqrt(1 + s * s);
    for (let k = 0, n = 1 + Math.floor(rand() * 3); k < n; k++) {
      const off = side * (1.35 + rand() * 0.8), dz = (rand() - 0.5) * 1.2;
      place(x + off * nx, z + dz - off * s * nx, 0.18 + rand() * 0.28, 0.35);
    }
  }
  r.add(b.build(), 'paint', { under: true });
}

/** Reeds in clumps along the water's edge. */
function reeds(r: BrushRenderer) {
  const g = new MeshBuilder('grass');
  const rand = rng(53);
  for (let c = 0; c < 34; c++) {
    const z0 = (rand() * 2 - 1) * (SIZE / 2 - 2), s = streamSlope(z0), nx = 1 / Math.sqrt(1 + s * s);
    const off = (rand() < 0.5 ? -1 : 1) * (1.45 + rand() * 0.5);
    const cx = streamX(z0) + off * nx, cz = z0 - off * s * nx;
    if (TREES.some((t) => Math.hypot(cx - t.x, cz - t.z) < 1)) continue;
    addReeds(g, ground, cx, cz, rand);
  }
  r.add(g.build(), 'grass', { castShadow: false });
}
