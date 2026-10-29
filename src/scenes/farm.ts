import * as THREE from 'three';
import type { BrushRenderer } from '../renderer/renderer';
import { MeshBuilder, noise2, rng, srgb, type Paint } from './builder';
import {
  C, MapLine, addFlowers, addReeds, addStone, addTuft, addWaterRibbon, groundOf, growTree, smooth, type Tree,
} from './kit';

// A working farm, after the aerial shot in Dear Alice (0:37): a wheat field with a solar array at the back, a track along it
// behind a rail fence, curved orchard rows in the middle with crates of apples, a dark clump of big trees with a picnic table
// in its shade, a stream with a plank bridge on the left, a fork in the track, and a nursery of young trees in rows.
//
// The layout is drawn on a map whose axes are the default view's screen: u to the right, v away up the screen. One unit is
// one metre, as in the game.

const HALF = 34, STEP = 0.5;
const SQ = Math.SQRT1_2;
/** Map (u right, v up the screen in the default view) to world x, z. */
const W = (u: number, v: number): [number, number] => [(u - v) * SQ, (-u - v) * SQ];
/** World to map. */
const M = (x: number, z: number): [number, number] => [(x - z) * SQ, (-x - z) * SQ];
const line = (pts: [number, number][]) => new MapLine(pts.map(([u, v]) => W(u, v)));

const STREAM = line([[-38, -1], [-29, -4], [-23, -9], [-19.5, -15], [-17, -21], [-14, -27], [-12, -38]]);
const TRACK = line([[-38, 7], [-24, 5.5], [-10, 4], [4, 4.5], [16, 6], [26, 8], [38, 8.5]]);
const LANE = line([[-38, -25], [-27, -20.5], [-18, -18.5], [-6, -16.5], [6, -14.5], [16, -11.5]]);
const FORK_UP = line([[16, -11.5], [20, -5], [22.5, 1.5], [24.5, 7.5]]);
const FORK_DOWN = line([[16, -11.5], [25, -14.5], [38, -17.5]]);
const PATHS = [TRACK, LANE, FORK_UP, FORK_DOWN];
const PATH_HALF = 1.05;

/** Where the wheat starts: its lower edge follows the track a few metres above it (v for a u), and its left edge. */
const TRACK_V = (() => {
  const pts = TRACK.points.map((p) => M(p.x, p.y));
  return (u: number) => {
    for (let i = 0; i < pts.length - 1; i++) if (pts[i + 1][0] >= u) {
      const t = (u - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * Math.min(1, Math.max(0, t));
    }
    return pts[pts.length - 1][1];
  };
})();
const wheatEdge = (u: number) => TRACK_V(u) + 2.6 + 0.35 * Math.sin(u * 0.3 + 1);
const WHEAT_LEFT = -13;
/** How far inside the wheat a map point is (negative outside). */
const wheatInside = (u: number, v: number) => Math.min(v - wheatEdge(u), u - WHEAT_LEFT + 0.6 * Math.sin(v * 0.4));

/** The orchard's rows: gentle arcs, a bush every metre and a half, worn alleys between. */
const ROWS = Array.from({ length: 4 }, (_, k) => line([[-9.5 + k * 0.6, -11.5 + k * 3.3], [-1, -10.4 + k * 3.3], [8.5 - k * 0.5, -12 + k * 3.4]]));
const ORCHARD_LEAF = C.fruitLeaf.clone().lerp(C.deepLeaf, 0.55);
/** The nursery: straight rows of young trees running down to the right. */
const NURSERY = Array.from({ length: 6 }, (_, k) => line([[12 + k * 0.4, -21 - k * 2.4], [36, -26 - k * 2.4]]));

const PANELS: [number, number][] = [
  [-2, 14], [3, 14.3], [8, 14.6], [13, 14.9], [18, 15.2],
  [0.5, 19.5], [5.5, 19.8], [10.5, 20.1], [15.5, 20.4], [20.5, 20.7],
];

const TREES: Tree[] = [
  // Cypresses, top left, and two by the orchard.
  ...([[-27, 13, 1.3], [-22.5, 17, 1.5], [-18, 11.5, 1.2], [-13.5, 9.5, 1.45], [-31, 19.5, 1.1], [-16, 1, 1.65], [-12, -1.5, 1.25],
    [-25, 22, 1.3]] as const).map(([u, v, s], i) => tree('cypress', u, v, s, 100 + i)),
  // The big clump right of the orchard, its leaves deep.
  ...([[13, -1, 2.1], [17.5, 2.5, 1.85], [18.5, -3.5, 1.7], [14.5, -5.5, 1.45], [10.5, 2, 1.3]] as const)
    .map(([u, v, s], i) => ({ ...tree('broadleaf', u, v, s, 200 + i), leaf: C.deepLeaf })),
  // Round trees along the stream and the lane.
  ...([[-22, -3.5, 1.1], [-13, -13, 0.95], [-26, -13, 1.0], [-11, -22, 1.15], [-30, 1, 0.9], [4, -20, 1.2], [27, -6, 1.1],
    [29, 2, 0.95]] as const).map(([u, v, s], i) => tree('broadleaf', u, v, s, 300 + i)),
  // A fruit tree by the crates.
  tree('fruit', -12.5, -8, 1.05, 400),
];

const CRATES: [number, number, number][] = [[-9.2, -13.6, 0.3], [-7.6, -14.1, -0.2], [-8.4, -12.6, 0.9]];
const TABLE: [number, number] = [11, -7.5];
const SHRUBS: [number, number][] = [[-4, -21], [8, -19], [-30, -10], [-33, -20], [-24, -30], [30, -3], [2, -27], [-31, 3]];
const WALL = line([[19.5, -13.5], [24, -12], [28.5, -11]]);

function tree(kind: Tree['kind'], u: number, v: number, scale: number, seed: number): Tree {
  const [x, z] = W(u, v);
  return { kind, x, z, scale, seed };
}

/** The land: a slope rising gently away up the screen, with long low swells. */
function rolling(u: number, v: number) {
  return 0.6 * noise2(u * 0.04, v * 0.04) + 0.25 * noise2(u * 0.1 + 5, v * 0.1 - 3) + 0.03 * v;
}

const WATER_Y = (() => {
  let sum = 0;
  for (const p of STREAM.points) sum += rolling(...M(p.x, p.y));
  return sum / STREAM.points.length - 0.3;
})();

const pathDistance = (x: number, z: number) => Math.min(...PATHS.map((p) => p.distance(x, z)));

function height(x: number, z: number) {
  const [u, v] = M(x, z);
  const ds = STREAM.distance(x, z);
  let h = rolling(u, v);
  // A floodplain eases down to a little above the water.
  h += (WATER_Y + 0.28 - h) * (1 - smooth(2.2, 10, ds));
  // Tracks are worn a little into the land.
  h -= 0.07 * (1 - smooth(PATH_HALF - 0.2, PATH_HALF + 0.5, pathDistance(x, z)));
  const bed = WATER_Y - 0.8;
  return bed + (h - bed) * smooth(0.3, 2.3, ds);
}
const ground = groundOf(height);

export interface Farm { center: THREE.Vector3; radius: number; waterLevel: number; }

export function buildFarm(r: BrushRenderer): Farm {
  terrain(r);
  water(r);
  wheat(r);
  panels(r);
  fences(r);
  bridge(r);
  orchard(r);
  trees(r);
  nursery(r);
  goods(r);
  stones(r);
  grass(r);
  return { center: new THREE.Vector3(0, 0, 0), radius: HALF * Math.SQRT2, waterLevel: WATER_Y };
}

/** How near a point is to the rows of the orchard and the nursery: 1 on a row, falling off over the alley. */
const rowNear = (rows: MapLine[], x: number, z: number, reach: number) => Math.max(0, ...rows.map((l) => 1 - smooth(0.2, reach, l.near(x, z).distance)));
const inOrchard = (u: number, v: number) => u > -11 && u < 10 && v > -13.5 && v < 0.5;
const inNursery = (u: number, v: number) => u > 10 && v < -18 - (u - 10) * 0.2 && v > -38;

function terrain(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const n = Math.round((2 * HALF) / STEP) + 1;
  const c = new THREE.Color();
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const u = -HALF + i * STEP, v = -HALF + j * STEP;
    const [x, z] = W(u, v);
    const y = height(x, z);
    const ds = STREAM.distance(x, z), dp = pathDistance(x, z);
    // Colour follows the land's form: rises catch the light yellow-green, hollows sink to emerald and teal.
    const ring = (k: number) => (height(x + k, z) + height(x - k, z) + height(x, z + k) + height(x, z - k)) / 4;
    const curve = 0.4 * (y - ring(2.5)) + 0.6 * (y - ring(6));
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5, k = noise2(x * 0.19 - 7, z * 0.19 + 2) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.0, 0.18, curve) * 0.6 + smooth(0.6, 0.9, m) * 0.2)
      .lerp(C.emerald, smooth(0.0, 0.2, -curve) * 0.55 + smooth(0.65, 0.95, 1 - m) * 0.25)
      .lerp(C.teal, smooth(0.15, 0.35, -curve) * 0.35 + smooth(0.75, 1, k) * 0.15);
    // Under the wheat, gold stubble; round the orchard, alleys worn pale between the rows; the nursery in strips.
    const inside = wheatInside(u, v);
    c.lerp(C.wheatDeep, smooth(-0.6, 0.2, inside) * 0.8);
    if (inOrchard(u, v)) c.lerp(C.lime, (1 - rowNear(ROWS, x, z, 1.1)) * 0.35).lerp(C.dirt, (1 - rowNear(ROWS, x, z, 1.2)) * 0.12);
    if (inNursery(u, v)) {
      const row = rowNear(NURSERY, x, z, 0.9);
      c.lerp(C.emerald, row * 0.4).lerp(C.lime, (1 - row) * 0.25);
    }
    // Shade under the big clump stays deep.
    for (const t of TREES) if (t.scale && t.scale > 1.4 && t.kind === 'broadleaf') c.lerp(C.teal, (1 - smooth(1.5, 5, Math.hypot(x - t.x, z - t.z))) * 0.25);
    // Tracks: pale earth in the wheel ruts, a strip of grass up the middle, the edges broken by the grass growing in.
    const edgeNoise = noise2(x * 0.6, z * 0.6) * 0.25 + noise2(x * 1.7 + 3, z * 1.7) * 0.1;
    const onPath = 1 - smooth(PATH_HALF - 0.25, PATH_HALF + 0.15, dp + edgeNoise);
    const rut = Math.exp(-(((dp - 0.5) / 0.2) ** 2));
    const mid = 1 - smooth(0.12, 0.3, dp + edgeNoise * 0.4);
    c.lerp(C.dirt.clone().lerp(C.rut, rut * 0.5).lerp(C.meadow, mid * 0.55), onPath * 0.92);
    // Banks: moss, then wet earth, then the stream bed.
    c.lerp(C.moss, 1 - smooth(1.8, 3.4, ds)).lerp(C.mud, (1 - smooth(1.45, 1.9, ds)) * 0.8).lerp(C.bed, 1 - smooth(1.1, 1.5, ds));
    // Brushwork where the land does something: banks, track edges, the wheat's edge, slopes, tree feet. Quiet on open lawn.
    const detail = Math.min(1, Math.max(0.12,
      Math.max(1 - smooth(1.4, 4.2, ds), Math.exp(-(((dp - PATH_HALF) / 0.6) ** 2)) * 0.9, Math.exp(-((inside / 0.8) ** 2)) * 0.8,
        smooth(0.06, 0.2, Math.abs(curve)) * 0.7)
      + noise2(x * 0.21 + 3, z * 0.21 - 9) * 0.22 + 0.1));
    const angle = 0.7 + noise2(x * 0.05, z * 0.05) * 0.9;
    b.vertex({ x, y, z }, ground.normal(x, z), c, [detail, 2.0, angle, 0]);
  }
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = j * n + i;
    // Map rows run up the screen; in the world that turns the grid, so wind its quads to face up.
    b.quad(a, a + 1, a + n + 1, a + n);
  }
  r.add(fixWinding(b.build()), 'paint', { under: true });
}

/** Turns a mesh's triangles to face up where they face down (for a grid laid in map coordinates). */
function fixWinding(g: THREE.BufferGeometry) {
  const idx = g.getIndex()!, p = g.getAttribute('position');
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < idx.count; i += 3) {
    a.fromBufferAttribute(p, idx.getX(i)); b.fromBufferAttribute(p, idx.getX(i + 1)); c.fromBufferAttribute(p, idx.getX(i + 2));
    const ny = (b.z - a.z) * (c.x - a.x) - (b.x - a.x) * (c.z - a.z);
    if (ny < 0) { const t = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, t); }
  }
  return g;
}

function water(r: BrushRenderer) {
  const b = new MeshBuilder('water');
  addWaterRibbon(b, STREAM, 2.0, WATER_Y);
  r.add(b.build(), 'water');
}

/**
 * The wheat: a painted golden mass a little under a metre deep laid over the field, rounded down into the ground at its
 * edges, banded in the long rows of a harvest-ready field. Stalks with ears stand out of it only along its edges.
 */
function wheat(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const u0 = WHEAT_LEFT - 1, v0 = 4, nu = Math.round((HALF - u0) / STEP) + 1, nv = Math.round((HALF - v0) / STEP) + 1;
  const tall = (u: number, v: number) => 0.8 * smooth(0, 1.1, wheatInside(u, v)) + 0.04 * noise2(u * 0.5, v * 0.5) - 0.06;
  const top = (u: number, v: number) => { const [x, z] = W(u, v); return height(x, z) + tall(u, v); };
  const keep: boolean[] = [];
  const c = new THREE.Color();
  // The rows run along the field (screen right, a little curved): world angle of the map's u axis.
  const rowAngle = Math.atan2(-1, 1);
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const u = u0 + i * STEP, v = v0 + j * STEP;
    const [x, z] = W(u, v);
    const e = 0.3;
    const nrm = new THREE.Vector3(top(u - e, v) - top(u + e, v), 2 * e, top(u, v - e) - top(u, v + e));
    // That gradient is in map axes; turn it into the world's.
    const wn = new THREE.Vector3((nrm.x - nrm.z) * SQ, nrm.y, (-nrm.x - nrm.z) * SQ).normalize();
    const row = v - 0.9 * Math.sin(u * 0.07);
    const band = smooth(-0.35, 0.35, Math.sin(row * 1.7) + 0.3 * noise2(u * 0.08, v * 0.3));
    c.copy(C.wheat).lerp(C.wheatDeep, band * 0.7).lerp(C.wheatTip, smooth(0.5, 0.9, noise2(u * 0.06 + 9, v * 0.09)) * 0.3)
      .lerp(C.wheatRoot, (1 - smooth(0.2, 1.2, wheatInside(u, v))) * 0.35);
    b.vertex({ x, y: top(u, v), z }, wn, c, [0.5, 1.3, rowAngle, 0]);
    keep.push(wheatInside(u, v) > -0.5);
  }
  for (let j = 0; j < nv - 1; j++) for (let i = 0; i < nu - 1; i++) {
    const a = j * nu + i;
    if (keep[a] || keep[a + 1] || keep[a + nu] || keep[a + nu + 1]) b.quad(a, a + 1, a + nu + 1, a + nu);
  }
  r.add(fixWinding(b.build()), 'paint');

  // Stalks along the edge, to break it.
  const g = new MeshBuilder('grass');
  const rand = rng(5);
  const up = new THREE.Vector3(0, 1, 0);
  for (let k = 0, placed = 0; placed < 2600 && k < 40000; k++) {
    const u = WHEAT_LEFT - 1 + rand() * (HALF + 1 - WHEAT_LEFT), v = 4 + rand() * (HALF - 4);
    const inside = wheatInside(u, v);
    if (inside < 0.05 || inside > 1.3 || Math.abs(u) > HALF || Math.abs(v) > HALF) continue;
    placed++;
    const [x, z] = W(u, v);
    const y = height(x, z), h = 0.45 + smooth(0, 1.1, inside) * 0.45 + rand() * 0.15;
    const lean = (rand() - 0.5) * 0.12, dir = rand() * Math.PI, seed = rand();
    const ox = Math.cos(dir) * 0.026, oz = Math.sin(dir) * 0.026;
    const paint: Paint = [0.5, 1.4, 0.4, 0.8];
    const tip = new THREE.Vector3(x + lean, y + h, z + lean * 0.5);
    const root = C.wheatRoot.clone(), gold = C.wheatTip.clone().lerp(C.wheatDeep, rand() * 0.6);
    const a = g.vertex({ x: x - ox, y, z: z - oz }, up, root, paint, [0, 0], [0, seed]);
    const bb = g.vertex({ x: x + ox, y, z: z + oz }, up, root, paint, [0, 0], [0, seed]);
    const c2 = g.vertex({ x: tip.x + ox * 0.6, y: tip.y - 0.16, z: tip.z + oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed]);
    const d2 = g.vertex({ x: tip.x - ox * 0.6, y: tip.y - 0.16, z: tip.z - oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed]);
    g.quad(a, bb, c2, d2);
    const e1 = g.vertex({ x: tip.x - ox * 2.2, y: tip.y - 0.06, z: tip.z - oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed]);
    const e2 = g.vertex({ x: tip.x + ox * 2.2, y: tip.y - 0.06, z: tip.z + oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed]);
    const e3 = g.vertex({ x: tip.x + lean * 0.3, y: tip.y + 0.12, z: tip.z }, up, gold, paint, [0, 0], [1, seed]);
    g.tri(d2, c2, e2); g.tri(d2, e2, e3); g.tri(d2, e3, e1);
  }
  r.add(g.build(), 'grass', { castShadow: false });
}

/** The solar array: panels on single posts standing out of the wheat, turned to the noon sun. Inked. */
function panels(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  const tilt = THREE.MathUtils.degToRad(32);
  // Noon sun's azimuth is 115° from +x towards +z; the panels face it.
  const az = THREE.MathUtils.degToRad(115);
  const face = Math.atan2(Math.cos(az), Math.sin(az));
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, face, 0, 'YXZ'));
  const paint: Paint = [1, 6, 3, 0];
  for (const [u, v] of PANELS) {
    const [x, z] = W(u, v);
    const y0 = height(x, z);
    const center = new THREE.Vector3(x, y0 + 1.75, z);
    const frame = new THREE.Matrix4().compose(center, q, new THREE.Vector3(1, 1, 1));
    b.addGeometry(new THREE.BoxGeometry(3.2, 0.09, 1.9), frame, C.ceramic, [0, 1, 0, 0]);
    const Wd = 1.53, Dd = 0.88, nUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const corner = (cu: number, cv: number) => new THREE.Vector3(cu * Wd, 0.05, cv * Dd).applyMatrix4(frame);
    const g0 = b.vertex(corner(-1, -1), nUp, C.glass, paint, [0, 0]);
    const g1 = b.vertex(corner(1, -1), nUp, C.glass, paint, [1.5, 0]);
    const g2 = b.vertex(corner(1, 1), nUp, C.glass, paint, [1.5, 1]);
    const g3 = b.vertex(corner(-1, 1), nUp, C.glass, paint, [0, 1]);
    b.quad(g0, g3, g2, g1);
    // A brass post and a short cross-arm under the frame.
    b.addGeometry(new THREE.CylinderGeometry(0.07, 0.09, 1.75, 8), new THREE.Matrix4().makeTranslation(x, y0 + 0.85, z), C.brass, [0, 1, 0, 0]);
    b.addGeometry(new THREE.BoxGeometry(1.6, 0.08, 0.12), new THREE.Matrix4().compose(center.clone().add(new THREE.Vector3(0, -0.12, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, face, 0)), new THREE.Vector3(1, 1, 1)), C.brass, [0, 1, 0, 0]);
  }
  r.add(b.build(), 'ink');
}

/** Split-rail fences: posts every couple of metres, two rails, each a little askew. Inked weathered timber. */
function fences(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  const rand = rng(17);
  const run = (path: MapLine, from: number, to: number, offset: number) => {
    const posts: THREE.Vector3[] = [];
    for (let s = from; s <= to; s += 2.3 + (rand() - 0.5) * 0.3) {
      const p = path.at(s);
      const x = p.x - p.dz * offset, z = p.z + p.dx * offset;
      posts.push(new THREE.Vector3(x, height(x, z), z));
    }
    for (const p of posts) {
      const h = 1.0 + (rand() - 0.5) * 0.1;
      const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 0.08, rand() * Math.PI, (rand() - 0.5) * 0.08));
      b.addGeometry(new THREE.BoxGeometry(0.11, h, 0.11), new THREE.Matrix4().compose(p.clone().add(new THREE.Vector3(0, h / 2 - 0.1, 0)), lean,
        new THREE.Vector3(1, 1, 1)), C.fence.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06), [0, 1, 0, 0]);
    }
    for (let i = 0; i < posts.length - 1; i++) {
      const a = posts[i], c = posts[i + 1];
      for (const yr of [0.42, 0.78]) {
        const pa = a.clone().add(new THREE.Vector3(0, yr + (rand() - 0.5) * 0.06, 0)), pc = c.clone().add(new THREE.Vector3(0, yr + (rand() - 0.5) * 0.06, 0));
        const d = pc.clone().sub(pa), len = d.length() + 0.25;
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.normalize());
        b.addGeometry(new THREE.BoxGeometry(len, 0.075, 0.055), new THREE.Matrix4().compose(pa.clone().lerp(pc, 0.5), q, new THREE.Vector3(1, 1, 1)),
          C.fence.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.08), [0, 1, 0, 0]);
      }
    }
  };
  const along = (path: MapLine, u: number, v: number) => path.near(...W(u, v)).along;
  // Between the track and the wheat, and along the track's left reach on the meadow side; down the far side of the lower fork.
  run(TRACK, along(TRACK, -11, 4), along(TRACK, 27, 8), -1.55);
  run(TRACK, along(TRACK, -36, 7), along(TRACK, -17, 5), 1.55);
  run(FORK_DOWN, along(FORK_DOWN, 19, -12.5), along(FORK_DOWN, 36, -17), 1.55);
  r.add(b.build(), 'ink');
}

/** A plank bridge where the lane crosses the stream. Inked timber. */
function bridge(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  // Where the lane meets the stream.
  let best = { d: Infinity, s: 0 };
  for (let s = 0; s < LANE.length; s += 0.25) { const p = LANE.at(s), d = STREAM.distance(p.x, p.z); if (d < best.d) best = { d, s }; }
  const p = LANE.at(best.s);
  const yaw = Math.atan2(-p.dz, p.dx);
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
  const deck = WATER_Y + 0.5, span = 6.4, width = 2.0;
  const at = (along: number, across: number, y: number) =>
    new THREE.Vector3(p.x + p.dx * along - p.dz * across, y, p.z + p.dz * along + p.dx * across);
  const rand = rng(29);
  for (let a = -span / 2; a < span / 2; a += 0.3) {
    const c = C.timber.clone().lerp(C.fence, 0.4).offsetHSL(0, 0, (rand() - 0.5) * 0.08);
    // Planks across the lane's direction.
    const plank = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 0.03, yaw, 0));
    b.addGeometry(new THREE.BoxGeometry(0.26, 0.07, width + (rand() - 0.5) * 0.12), new THREE.Matrix4().compose(at(a + 0.13, 0, deck), plank,
      new THREE.Vector3(1, 1, 1)), c, [0, 1, 0, 0]);
  }
  for (const side of [-1, 1]) {
    b.addGeometry(new THREE.BoxGeometry(span + 0.4, 0.2, 0.16), new THREE.Matrix4().compose(at(0, side * (width / 2 - 0.15), deck - 0.13), q,
      new THREE.Vector3(1, 1, 1)), C.bark.clone().lerp(C.fence, 0.3), [0, 1, 0, 0]);
    // A low kerb along each side.
    b.addGeometry(new THREE.BoxGeometry(span, 0.1, 0.1), new THREE.Matrix4().compose(at(0, side * (width / 2 - 0.05), deck + 0.08), q,
      new THREE.Vector3(1, 1, 1)), C.fence, [0, 1, 0, 0]);
  }
  r.add(b.build(), 'ink');
}

function orchard(r: BrushRenderer) {
  const wood = new MeshBuilder('paint'), leaves = new MeshBuilder('foliage'), stakes = new MeshBuilder('ink');
  const rand = rng(61);
  for (const row of ROWS) {
    for (let s = 0.6; s < row.length - 0.4; s += 1.5 + (rand() - 0.5) * 0.3) {
      const p = row.at(s);
      growTree(wood, leaves, ground, { kind: 'bush', x: p.x, z: p.z, seed: 0, scale: 0.8 + rand() * 0.2, leaf: ORCHARD_LEAF, fruit: C.apple, fruitDensity: 3 }, rand);
      // A stake by every other bush.
      if (rand() < 0.5) {
        const x = p.x + p.dz * 0.45, z = p.z - p.dx * 0.45, y = height(x, z);
        stakes.addGeometry(new THREE.BoxGeometry(0.06, 1.1, 0.06), new THREE.Matrix4().makeTranslation(x, y + 0.45, z), C.fence, [0, 1, 0, 0]);
      }
    }
  }
  r.add(wood.build(), 'paint');
  r.add(leaves.build(), 'foliage');
  r.add(stakes.build(), 'ink');
}

function trees(r: BrushRenderer) {
  const wood = new MeshBuilder('paint'), leaves = new MeshBuilder('foliage');
  for (const t of TREES) growTree(wood, leaves, ground, t, rng(t.seed));
  // Hedges of round bushes along the upper fork and the lane's far end.
  const rand = rng(71);
  for (const [path, from, to, side] of [[FORK_UP, 2, 17, -1], [LANE, 2, 14, 1]] as const) {
    for (let s = from; s < to; s += 1.1 + rand() * 0.6) {
      const p = path.at(s), off = side * (PATH_HALF + 0.9 + rand() * 0.3);
      growTree(wood, leaves, ground, { kind: 'bush', x: p.x - p.dz * off, z: p.z + p.dx * off, seed: 0, scale: 1.1 + rand() * 0.4, leaf: C.emerald }, rand);
    }
  }
  // Thickets along the stream, with gaps where the banks open to the water.
  for (let s = 1; s < STREAM.length - 1; s += 1.6 + rand() * 1.4) {
    if (noise2(s * 0.12, 3) < -0.15) continue;
    const p = STREAM.at(s), off = (rand() < 0.5 ? -1 : 1) * (2.5 + rand() * 1.2);
    const x = p.x - p.dz * off, z = p.z + p.dx * off;
    if (pathDistance(x, z) < PATH_HALF + 1 || clear(x, z)) continue;
    growTree(wood, leaves, ground, { kind: rand() < 0.25 ? 'round' : 'bush', x, z, seed: 0, scale: 1.1 + rand() * 0.6,
      leaf: C.leaf.clone().lerp(C.deepLeaf, rand() * 0.7) }, rand);
  }
  // Clumps of shrubs out on the meadow.
  for (const [u, v] of SHRUBS) {
    for (let k = 0, n = 2 + Math.floor(rand() * 3); k < n; k++) {
      const [x, z] = W(u + (rand() - 0.5) * 2.6, v + (rand() - 0.5) * 1.8);
      if (STREAM.distance(x, z) < 2.4 || pathDistance(x, z) < PATH_HALF + 0.6 || wheatInside(u, v) > -1.5 || clear(x, z)) continue;
      growTree(wood, leaves, ground, { kind: 'bush', x, z, seed: 0, scale: 1.0 + rand() * 0.5, leaf: C.leaf.clone().lerp(C.emerald, rand()) }, rand);
    }
  }
  r.add(wood.build(), 'paint');
  r.add(leaves.build(), 'foliage');
}

/** Places kept open: the bridge's ends, the crates, the table. */
function clear(x: number, z: number) {
  const [u, v] = M(x, z);
  return [...CRATES.map(([cu, cv]) => [cu, cv]), TABLE].some(([cu, cv]) => Math.hypot(u - cu, v - cv) < 2.2);
}

function nursery(r: BrushRenderer) {
  const wood = new MeshBuilder('paint'), leaves = new MeshBuilder('foliage');
  const rand = rng(83);
  for (const row of NURSERY) {
    for (let s = 0.8; s < row.length; s += 1.9) {
      const p = row.at(s);
      const [u, v] = M(p.x, p.z);
      if (Math.abs(u) > HALF - 0.5 || Math.abs(v) > HALF - 0.5) continue;
      growTree(wood, leaves, ground, { kind: 'round', x: p.x, z: p.z, seed: 0, scale: 0.7 + rand() * 0.15,
        leaf: C.leaf.clone().lerp(C.emerald, rand() * 0.5) }, rand);
    }
  }
  r.add(wood.build(), 'paint');
  r.add(leaves.build(), 'foliage');
}

/** Crates of apples by the orchard and a picnic table under the big trees. Inked. */
function goods(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  const rand = rng(97);
  const box = (sx: number, sy: number, sz: number, at: THREE.Vector3, yaw: number, c: THREE.Color) =>
    b.addGeometry(new THREE.BoxGeometry(sx, sy, sz), new THREE.Matrix4().compose(at, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)),
      new THREE.Vector3(1, 1, 1)), c, [0, 1, 0, 0]);
  for (const [u, v, yaw] of CRATES) {
    const [x, z] = W(u, v);
    const y = height(x, z);
    const local = (lx: number, ly: number, lz: number) =>
      new THREE.Vector3(x + lx * Math.cos(yaw) + lz * Math.sin(yaw), y + ly, z - lx * Math.sin(yaw) + lz * Math.cos(yaw));
    const wood = C.crate.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06);
    // Slatted sides and a floor; apples heaped inside.
    box(1.0, 0.06, 0.7, local(0, 0.05, 0), yaw, wood);
    for (const [lx, lz, sx, sz] of [[0, -0.33, 1.0, 0.05], [0, 0.33, 1.0, 0.05], [-0.48, 0, 0.05, 0.7], [0.48, 0, 0.05, 0.7]] as const) {
      for (const ly of [0.14, 0.32]) box(sx, 0.13, sz, local(lx, ly, lz), yaw, wood);
    }
    box(0.92, 0.3, 0.62, local(0, 0.2, 0), yaw, C.apple.clone().multiplyScalar(0.75));
    for (let i = 0; i < 16; i++) {
      const lx = (rand() - 0.5) * 0.8, lz = (rand() - 0.5) * 0.5;
      b.addGeometry(new THREE.IcosahedronGeometry(0.075, 1), new THREE.Matrix4().makeTranslation(...local(lx, 0.38 + rand() * 0.05, lz).toArray()),
        C.apple.clone().offsetHSL((rand() - 0.5) * 0.05, 0, (rand() - 0.5) * 0.1), [0, 1, 0, 0]);
    }
  }
  // The picnic table: a trestle with two benches, a cloth and a few baskets on it.
  const [tx, tz] = W(...TABLE);
  const ty = height(tx, tz), yaw = 0.5;
  const at = (lx: number, ly: number, lz: number) =>
    new THREE.Vector3(tx + lx * Math.cos(yaw) + lz * Math.sin(yaw), ty + ly, tz - lx * Math.sin(yaw) + lz * Math.cos(yaw));
  box(2.0, 0.08, 0.9, at(0, 0.76, 0), yaw, C.timber);
  box(1.7, 0.02, 0.75, at(0, 0.81, 0), yaw, srgb(0xe8e0cc));
  for (const lx of [-0.8, 0.8]) box(0.1, 0.74, 0.7, at(lx, 0.37, 0), yaw, C.timber.clone().multiplyScalar(0.85));
  for (const lz of [-0.75, 0.75]) {
    box(1.9, 0.07, 0.3, at(0, 0.45, lz), yaw, C.timber);
    for (const lx of [-0.75, 0.75]) box(0.08, 0.42, 0.25, at(lx, 0.21, lz), yaw, C.timber.clone().multiplyScalar(0.85));
  }
  const produce = [C.apple, srgb(0xf2a83a), srgb(0x8cc44a), srgb(0x9a4ab0)];
  for (let i = 0; i < 5; i++) {
    const lx = -0.7 + i * 0.35;
    box(0.26, 0.12, 0.24, at(lx, 0.88, (rand() - 0.5) * 0.3), yaw, C.crate);
    box(0.22, 0.05, 0.2, at(lx, 0.95, 0), yaw, produce[i % produce.length]);
  }
  r.add(b.build(), 'ink');
}

/** Stones: on the stream bed, on its banks, in a field corner, a dry-stone wall by the fork, stepping stones on the meadow. */
function stones(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const rand = rng(91);
  const bank = (count: number, from: number, to: number, size: number, spread: number) => {
    for (let i = 0; i < count; i++) {
      const p = STREAM.at(rand() * STREAM.length), off = from + rand() * (to - from);
      const side = rand() < 0.5 ? -1 : 1;
      addStone(b, ground, p.x - p.dz * off * side, p.z + p.dx * off * side, size + rand() * spread, 0.4, rand, WATER_Y);
    }
  };
  bank(110, 0, 1.5, 0.07, 0.13);
  bank(26, 1.35, 2.3, 0.18, 0.28);
  // Rocks among the cypresses.
  for (const [u, v] of [[-33, 10], [-29, 6.8], [-20, 8], [-34, 15]] as const) {
    for (let k = 0; k < 3; k++) {
      const [x, z] = W(u + (rand() - 0.5) * 2, v + (rand() - 0.5) * 1.5);
      addStone(b, ground, x, z, 0.3 + rand() * 0.35, 0.35, rand);
    }
  }
  // The wall: two courses of flat stones, a capstone here and there.
  for (let s = 0; s < WALL.length; s += 0.42) {
    const p = WALL.at(s);
    const y = height(p.x, p.z);
    for (let course = 0; course < 2; course++) {
      const j = (rand() - 0.5) * 0.08;
      addStone(b, ground, p.x - p.dz * j, p.z + p.dx * j, 0.26 + rand() * 0.06, 0, rand, -Infinity, y + course * 0.3 - 0.05);
    }
    if (rand() < 0.4) addStone(b, ground, p.x, p.z, 0.22, 0, rand, -Infinity, y + 0.55);
  }
  // Stepping stones across the far meadow.
  for (let k = 0; k < 9; k++) {
    const [x, z] = W(-33 + k * 1.6 + (rand() - 0.5) * 0.4, -30 + k * 0.9 + (rand() - 0.5) * 0.4);
    addStone(b, ground, x, z, 0.28 + rand() * 0.06, 0.45, rand);
  }
  r.add(b.build(), 'paint', { under: true });
  const reeds = new MeshBuilder('grass');
  for (let c = 0; c < 60; c++) {
    const p = STREAM.at(rand() * STREAM.length), off = (rand() < 0.5 ? -1 : 1) * (1.45 + rand() * 0.5);
    addReeds(reeds, ground, p.x - p.dz * off, p.z + p.dx * off, rand);
  }
  r.add(reeds.build(), 'grass', { castShadow: false });
}

/** Long grass in tufts where a scythe wouldn't reach, and wildflowers in drifts on the open meadow. */
function grass(r: BrushRenderer) {
  const g = new MeshBuilder('grass'), flowers = new MeshBuilder('foliage');
  const rand = rng(77);
  const blocked = (x: number, z: number) => {
    const [u, v] = M(x, z);
    if (Math.abs(u) > HALF - 0.5 || Math.abs(v) > HALF - 0.5) return true;
    return wheatInside(u, v) > -0.2 || pathDistance(x, z) < PATH_HALF - 0.1 || STREAM.distance(x, z) < 1.6 ||
      TREES.some((t) => Math.hypot(x - t.x, z - t.z) < 0.4 * (t.scale ?? 1));
  };
  const tuftColor = (x: number, z: number) => {
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    return C.meadow.clone().lerp(C.lime, smooth(0.45, 0.85, m) * 0.8).lerp(C.emerald, smooth(0.55, 0.9, 1 - m) * 0.7);
  };
  let placed = 0;
  for (let tries = 0; placed < 11000 && tries < 200000; tries++) {
    const [x, z] = W((rand() * 2 - 1) * HALF, (rand() * 2 - 1) * HALF);
    if (blocked(x, z)) continue;
    const [u, v] = M(x, z);
    const near = Math.max(
      1 - smooth(1.6, 3.4, STREAM.distance(x, z)),
      1 - smooth(PATH_HALF, PATH_HALF + 1.2, pathDistance(x, z)),
      1 - smooth(0.2, 1.6, -wheatInside(u, v)),
      ...TREES.map((t) => 1 - smooth(0.4, 2.2 * (t.scale ?? 1), Math.hypot(x - t.x, z - t.z))));
    const lush = Math.min(1, Math.max(near, smooth(0.55, 0.9, noise2(x * 0.09 + 40, z * 0.09) * 0.5 + 0.5) * 0.7));
    if (rand() > lush * 0.95 + 0.04) continue;
    placed++;
    addTuft(g, ground, x, z, 0.18 + lush * 0.32, tuftColor(x, z), rand);
  }
  const palette = [srgb(0xf08bb0), srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8), srgb(0xe8574a)];
  for (let d = 0; d < 90; d++) {
    const [cx, cz] = W((rand() * 2 - 1) * HALF, (rand() * 2 - 1) * HALF);
    addFlowers(flowers, ground, cx, cz, palette[Math.floor(rand() * palette.length)], 6 + Math.floor(rand() * 14), rand,
      (x, z) => !blocked(x, z));
  }
  r.add(g.build(), 'grass', { castShadow: false });
  r.add(flowers.build(), 'foliage', { castShadow: false });
}
