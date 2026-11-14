import * as THREE from 'three';
import {
  type BrushRenderer, MeshBuilder, noise2, rng, srgb, type Paint, C, MapLine, addFlowers, addReeds, addStone, addTuft,
  groundOf, smooth, treeWind, type Stream, type Tree, type Season, Grove, dressFor, type Dress,
} from '../../index';
import type { Meadow } from './meadow';

// The water's test patch (#19, ?scene=water): every kind of water the game makes, side by side, to judge a look on. A still
// pond; a slow, wide bend out of it; a fast, narrow run over stones; and a flooded meadow, its grass standing in shallow
// water, on the inside of the bend. Round them grassy banks, reeds, a few trees, and a plank bridge (the one inked thing)
// over the run. All the water stands at one level (0), as the demo's stand-in for the game makes it from one stream.

const SIZE = 64, STEP = 0.5;
const WATER_Y = 0;

/** The watercourse: from the pond's middle, round the bend, then down the run. */
const COURSE = new MapLine([[-15, -13], [-9, -9], [-3, -6.5], [3, -2.5], [5, 3], [3.5, 9], [4.5, 14], [8.5, 20], [12.5, 31]]);
const POND = { x: -15, z: -13, r: 7.5 };
/** Where the bend narrows into the run, and how long it takes to. */
const RUN_FROM = COURSE.near(3.5, 9).along, RUN_EASE = 4;
/** The flooded meadow: an oval of low ground on the inside of the bend. */
const FLOOD = { x: -4, z: 4, rx: 7.5, rz: 5.2 };
const BRIDGE_AT = COURSE.near(5.5, 17).along;

/** How far into the run a point along the course is (0 in the bend, 1 in the run). */
const runShare = (along: number) => smooth(RUN_FROM - RUN_EASE / 2, RUN_FROM + RUN_EASE / 2, along);
/** The course's half width and its depth at the middle. */
const halfWidth = (along: number) => 3.2 + (1.05 - 3.2) * runShare(along);
const depth = (along: number) => 1.0 + (0.32 - 1.0) * runShare(along);
/** How fast it runs, against the demo stream's usual 0.35 m/s: a slow bend (0.2 m/s), a fast run (1.1 m/s). */
const speed = (along: number) => 0.6 + (3.2 - 0.6) * runShare(along);

function rolling(x: number, z: number) {
  return 0.75 + 0.55 * noise2(x * 0.05 + 3, z * 0.05 - 1) + 0.18 * noise2(x * 0.13 - 5, z * 0.13 + 2);
}
/** How much of the flooded meadow's low ground applies (1 inside the oval). */
function floodShare(x: number, z: number) {
  const e = Math.hypot((x - FLOOD.x) / FLOOD.rx, (z - FLOOD.z) / FLOOD.rz) + noise2(x * 0.3, z * 0.3) * 0.08;
  return 1 - smooth(0.85, 1.15, e);
}

export function height(x: number, z: number) {
  const near = COURSE.near(x, z);
  const d = COURSE.distance(x, z);
  // Banks ease down to a floodplain a little above the water near it.
  let h = rolling(x, z);
  h += (WATER_Y + 0.22 - h) * (1 - smooth(3, 10, Math.min(d, Math.hypot(x - POND.x, z - POND.z) - POND.r)));
  // The meadow: low and flat, a hand under the water, with tussocks breaking it here and there.
  const f = floodShare(x, z);
  const meadow = WATER_Y - 0.09 + noise2(x * 0.45 + 7, z * 0.45) * 0.04 + Math.max(0, noise2(x * 0.22 - 3, z * 0.22 + 8) - 0.45) * 0.4;
  h += (meadow - h) * f;
  // The channel: its bed `depth` under the water, the banks meeting the water about its half width from the middle.
  const w = halfWidth(near.along), bed = WATER_Y - depth(near.along);
  h = bed + (h - bed) * smooth(w * 0.25, w + 0.9, d);
  // The pond: a round basin, deepest in the middle.
  const dp = Math.hypot(x - POND.x, z - POND.z) + noise2(x * 0.2, z * 0.2) * 0.8;
  const pondBed = WATER_Y - 1.5;
  return Math.min(h, pondBed + (h - pondBed) * smooth(1.5, POND.r + 0.8, dp));
}

const ground = groundOf(height);

const TREES: Tree[] = [
  { kind: 'broadleaf', x: -20, z: -4, seed: 3 },
  { kind: 'round', x: -9, z: -21, seed: 8 },
  { kind: 'broadleaf', x: -12, z: -22.5, seed: 5, scale: 1.2 },
  { kind: 'fruit', x: -24, z: -11, seed: 17 },
  { kind: 'cypress', x: -23, z: -18, seed: 13 },
  { kind: 'broadleaf', x: 12, z: -8, seed: 21, scale: 1.15 },
  { kind: 'fruit', x: 13, z: 9, seed: 29 },
  { kind: 'bush', x: -1, z: 14, seed: 31 },
  { kind: 'round', x: 0, z: 23, seed: 41 },
  { kind: 'bush', x: 16, z: 17, seed: 43 },
];

/**
 * The water for the map (#18): the pond still, the bend slow, the run fast. Cells a metre, as the game's tiles; the flow's
 * vector is against the demo stream's speed (a unit vector in a stream at its usual pace), so the pond's is none.
 */
const STREAM: Stream = {
  level: WATER_Y,
  grid: { nx: SIZE, nz: SIZE, cell: 1, x0: -SIZE / 2, z0: -SIZE / 2 },
  channel: (x, z) => Math.hypot(x - POND.x, z - POND.z) < POND.r - 0.5 || COURSE.distance(x, z) < halfWidth(COURSE.near(x, z).along),
  along: (x, z) => {
    const near = COURSE.near(x, z);
    // Still in the pond, gathering speed as it leaves it.
    const out = smooth(POND.r - 2, POND.r + 3, Math.hypot(x - POND.x, z - POND.z));
    const s = speed(near.along) * out;
    return [near.dx * s, near.dz * s];
  },
};

let DRESS: Dress | null = null;
let SEASON: Season = 'summer';

export function buildWaterPatch(r: BrushRenderer, season: Season = 'summer'): Meadow {
  SEASON = season;
  DRESS = dressFor(season, (x, z) => COURSE.distance(x, z) > 4 && floodShare(x, z) < 0.1);
  terrain(r);
  const grove = new Grove(DRESS);
  for (const t of TREES) grove.grow(ground, t, rng(t.seed));
  grove.addTo(r);
  grass(r);
  stones(r);
  reeds(r);
  bridge(r);
  return { center: new THREE.Vector3(-3, 0, 2), radius: 34, stream: STREAM, wind: TREES.map(treeWind), height, bare: () => 0 };
}

function terrain(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const n = Math.round(SIZE / STEP) + 1, half = SIZE / 2;
  const c = new THREE.Color();
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = -half + i * STEP, z = -half + j * STEP;
    const y = height(x, z);
    const curve = y - (height(x + 3, z) + height(x - 3, z) + height(x, z + 3) + height(x, z - 3)) / 4;
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.0, 0.18, curve) * 0.6 + smooth(0.6, 0.9, m) * 0.2)
      .lerp(C.emerald, smooth(0.0, 0.2, -curve) * 0.5 + smooth(0.65, 0.95, 1 - m) * 0.25);
    // Banks: moss, wet earth, then the bed, by how far above the water the land is; the flooded meadow stays grass.
    const above = y - WATER_Y, f = floodShare(x, z);
    const bank = (1 - smooth(0.05, 0.45, above)) * (1 - f);
    c.lerp(C.moss, bank * 0.7).lerp(C.mud, (1 - smooth(-0.05, 0.12, above)) * 0.75 * (1 - f)).lerp(C.bed, (1 - smooth(-0.35, -0.1, above)) * (1 - f));
    c.lerp(C.emerald.clone().lerp(C.mud, 0.35), f * (1 - smooth(-0.05, 0.08, above)) * 0.6);
    const detail = Math.min(1, Math.max(0.15, 1 - smooth(0.2, 1.2, Math.abs(above)) + noise2(x * 0.21 + 3, z * 0.21 - 9) * 0.2 + 0.15));
    const paint: Paint = [detail, 2.0, 0.7 + noise2(x * 0.05, z * 0.05) * 0.9, 0];
    b.vertex({ x, y, z }, ground.normal(x, z), c, paint);
  }
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) {
    const a = j * n + i;
    b.quad(a, a + n, a + n + 1, a + 1);
  }
  r.add(b.build(), 'ground', { under: true, fields: { x: 0, z: 0, side: SIZE, turn: 0 } });
}

/** Grass on the banks, and standing in the flooded meadow. */
function grass(r: BrushRenderer) {
  const g = new MeshBuilder('grass');
  const flowers = new MeshBuilder('foliage');
  const rand = rng(17);
  const half = SIZE / 2 - 1;
  const wet = (x: number, z: number) => height(x, z) < WATER_Y + 0.02;
  const nearTree = (x: number, z: number) => TREES.some((t) => Math.hypot(x - t.x, z - t.z) < 0.4);
  const colour = (x: number, z: number) => {
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    return C.meadow.clone().lerp(C.lime, smooth(0.45, 0.85, m) * 0.8).lerp(C.emerald, smooth(0.55, 0.9, 1 - m) * 0.7);
  };
  let placed = 0;
  for (let tries = 0; placed < 5000 && tries < 120000; tries++) {
    const x = (rand() * 2 - 1) * half, z = (rand() * 2 - 1) * half;
    const f = floodShare(x, z);
    // In the flooded meadow the grass stands in the water; elsewhere none in it.
    if ((wet(x, z) && f < 0.5) || nearTree(x, z)) continue;
    const bankNear = 1 - smooth(0.1, 1.2, height(x, z) - WATER_Y);
    const lush = Math.max(bankNear, f * 0.9, smooth(0.55, 0.9, noise2(x * 0.09 + 40, z * 0.09) * 0.5 + 0.5) * 0.6);
    if (rand() > lush * 0.9 + 0.05) continue;
    placed++;
    addTuft(g, ground, x, z, f > 0.5 ? 0.35 + rand() * 0.3 : 0.2 + lush * 0.3, colour(x, z), rand);
  }
  const palette = [srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8), srgb(0xf08bb0)];
  const drifts = { spring: 30, summer: 40, autumn: 12, winter: 0 }[SEASON];
  for (let d = 0; d < drifts; d++) {
    const cx = (rand() * 2 - 1) * half, cz = (rand() * 2 - 1) * half;
    addFlowers(flowers, ground, cx, cz, palette[Math.floor(rand() * palette.length)], 6 + Math.floor(rand() * 10), rand,
      (x, z) => height(x, z) > WATER_Y + 0.25 && !nearTree(x, z) && Math.abs(x) <= half && Math.abs(z) <= half);
  }
  r.add(g.build(), 'grass', { castShadow: false });
  r.add(flowers.build(), 'foliage', { castShadow: false, cover: 'none' });
}

/** The run's stones, breaking its surface; pebbles in the bend's bed; rocks on the banks and the pond's edge. */
function stones(r: BrushRenderer) {
  const b = new MeshBuilder('paint');
  const rand = rng(61);
  const place = (x: number, z: number, size: number, sink: number) => addStone(b, ground, x, z, size, sink, rand, WATER_Y);
  const across = (along: number, off: number) => {
    const p = COURSE.at(along);
    return [p.x - p.dz * off, p.z + p.dx * off] as const;
  };
  // The run: stones over its bed, the bigger ones standing out of the water.
  for (let i = 0; i < 60; i++) {
    const along = RUN_FROM + 1 + rand() * (COURSE.length - RUN_FROM - 3);
    const [x, z] = across(along, (rand() * 2 - 1) * 1.1);
    place(x, z, 0.12 + rand() * 0.22, rand() < 0.4 ? 0.15 : 0.4);
  }
  // The bend: pebbles on its bed, seen through the water.
  for (let i = 0; i < 50; i++) {
    const along = 9 + rand() * (RUN_FROM - 9);
    const [x, z] = across(along, (rand() * 2 - 1) * 2.8);
    place(x, z, 0.06 + rand() * 0.1, 0.4);
  }
  // Rocks along the banks and round the pond.
  for (let i = 0; i < 18; i++) {
    const along = 6 + rand() * (COURSE.length - 8), side = rand() < 0.5 ? -1 : 1;
    const [x, z] = across(along, side * (halfWidth(along) + 0.3 + rand() * 0.6));
    place(x, z, 0.2 + rand() * 0.25, 0.35);
  }
  for (let i = 0; i < 8; i++) {
    const a = rand() * Math.PI * 2, rr = POND.r - 0.3 + rand() * 0.8;
    place(POND.x + Math.cos(a) * rr, POND.z + Math.sin(a) * rr, 0.2 + rand() * 0.3, 0.35);
  }
  r.add(b.build(), 'paint', { under: true });
}

/** Reeds round the pond, along the bend, and in clumps in the flooded meadow. */
function reeds(r: BrushRenderer) {
  const g = new MeshBuilder('grass');
  const rand = rng(53);
  for (let c = 0; c < 22; c++) {
    const a = rand() * Math.PI * 2, rr = POND.r - 0.8 + rand() * 1.0;
    addReeds(g, ground, POND.x + Math.cos(a) * rr, POND.z + Math.sin(a) * rr, rand);
  }
  for (let c = 0; c < 18; c++) {
    const along = 7 + rand() * (RUN_FROM - 7), side = rand() < 0.5 ? -1 : 1, p = COURSE.at(along), off = side * (halfWidth(along) + 0.1 + rand() * 0.5);
    addReeds(g, ground, p.x - p.dz * off, p.z + p.dx * off, rand);
  }
  for (let c = 0; c < 10; c++) {
    const a = rand() * Math.PI * 2, e = Math.sqrt(rand()) * 0.8;
    addReeds(g, ground, FLOOD.x + Math.cos(a) * FLOOD.rx * e, FLOOD.z + Math.sin(a) * FLOOD.rz * e, rand);
  }
  r.add(g.build(), 'grass', { castShadow: false });
}

/** A plank bridge over the run: two beams on posts, planks across. Inked: placed by the player. */
function bridge(r: BrushRenderer) {
  const b = new MeshBuilder('ink');
  const p = COURSE.at(BRIDGE_AT);
  // Across the run (along the bridge) and along it.
  const ax = -p.dz, az = p.dx, turn = Math.atan2(-az, ax);
  const span = 4.6, wide = 1.3, deck = WATER_Y + 0.55;
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), turn);
  const put = (geo: THREE.BufferGeometry, u: number, y: number, v: number, col: THREE.Color, paint: Paint) => {
    const pos = new THREE.Vector3(p.x + ax * u + p.dx * v, y, p.z + az * u + p.dz * v);
    b.addGeometry(geo, new THREE.Matrix4().compose(pos, q, new THREE.Vector3(1, 1, 1)), col, paint);
  };
  for (const v of [-wide / 2, wide / 2]) {
    put(new THREE.BoxGeometry(span, 0.16, 0.14), 0, deck - 0.12, v, C.timber.clone().multiplyScalar(0.7), [0, 1, 0, 0]);
    for (const u of [-span / 2 + 0.2, span / 2 - 0.2]) {
      const foot = height(p.x + ax * u + p.dx * v, p.z + az * u + p.dz * v) - 0.2;
      put(new THREE.BoxGeometry(0.14, deck - foot, 0.14), u, (deck + foot) / 2 - 0.1, v, C.timber.clone().multiplyScalar(0.6), [0, 1, 0, 0]);
    }
  }
  for (let k = 0; k < 16; k++) {
    const u = -span / 2 + 0.15 + k * ((span - 0.3) / 15);
    put(new THREE.BoxGeometry(0.24, 0.06, wide + 0.25), u, deck, 0, C.timber.clone().offsetHSL(0, 0, (noise2(k * 1.7, 3) * 0.06)), [2, 1, 0, 0]);
  }
  r.add(b.build(), 'ink');
}
