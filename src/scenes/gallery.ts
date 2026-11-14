import * as THREE from 'three';
import type { BrushRenderer } from '../renderer/renderer';
import { MeshBuilder, noise2, rng, srgb, type Paint } from './builder';
import { C, addFlowers, addTuft, groundOf, smooth, type Stream } from './kit';
import { ModelSet, loadModel } from './model';
import { GROUPS, MODELS, TILE, blocksWind, wheelRace, type Stand } from './catalog';
import type { Obstacle } from '../wind/sim';

// The gallery (docs/MODELS.md): every model on its own plot of a level meadow, a row for each group, for looking at each
// one up close from all four sides, in any hour and weather. A pale pad under each shows its footprint in game tiles.

const SIZE = 144, STEP = 0.5, PITCH = 19;

/** Where each model stands: rows by group, each row centred. */
const STANDS: Stand[] = GROUPS.flatMap((group, row) => {
  const list = Object.values(MODELS).filter((m) => m.group === group);
  return list.map((model, i) => ({ model, x: (i - (list.length - 1) / 2) * PITCH, y: 0, z: (row - (GROUPS.length - 1) / 2) * PITCH, yaw: Math.PI / 4 }));
});

/** How far inside a stand's footprint a point is, metres (negative outside), and the nearest. */
function pad(x: number, z: number) {
  let best = -Infinity;
  for (const s of STANDS) {
    const dx = x - s.x, dz = z - s.z, c = Math.cos(s.yaw), sn = Math.sin(s.yaw);
    const lx = dx * c - dz * sn, lz = dx * sn + dz * c;
    best = Math.max(best, Math.min(s.model.tiles[0] * TILE / 2 - Math.abs(lx), s.model.tiles[1] * TILE / 2 - Math.abs(lz)));
  }
  return best;
}

/** The water wheel's race (1 in it): a dry pit here, so the whole wheel shows, the arc that turns in the river too. */
function pit(x: number, z: number, margin = 0.5) {
  let most = 0;
  for (const s of STANDS) {
    if (s.model.name !== 'water_wheel') continue;
    const dx = x - s.x, dz = z - s.z, c = Math.cos(s.yaw), sn = Math.sin(s.yaw);
    most = Math.max(most, wheelRace(dx * c - dz * sn, dx * sn + dz * c, margin));
  }
  return most;
}

const height = (x: number, z: number) => 0.25 * noise2(x * 0.03, z * 0.03) * smooth(-1, -6, pad(x, z)) - 1.1 * pit(x, z);
const ground = groundOf(height);
const STREAM: Stream = { level: -3, grid: { nx: 8, nz: 8, cell: SIZE / 8, x0: -SIZE / 2, z0: -SIZE / 2 }, channel: () => false, along: () => [0, 0] };

export interface Gallery {
  center: THREE.Vector3; radius: number; stream: Stream; wind: Obstacle[]; ready: Promise<void>; stands: Stand[];
  height: (x: number, z: number) => number; bare: (x: number, z: number) => number;
}

export function buildGallery(r: BrushRenderer): Gallery {
  const b = new MeshBuilder('paint');
  const n = Math.round(SIZE / STEP) + 1, half = SIZE / 2, c = new THREE.Color();
  const earth = C.dirt.clone().lerp(C.meadow, 0.3);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = -half + i * STEP, z = -half + j * STEP, inside = pad(x, z);
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.55, 0.9, m) * 0.5).lerp(C.emerald, smooth(0.6, 0.95, 1 - m) * 0.5);
    c.lerp(earth, smooth(-0.25, 0.15, inside + noise2(x * 0.9, z * 0.9) * 0.12) * 0.55);
    const paint: Paint = [Math.min(1, 0.15 + Math.exp(-((inside / 0.7) ** 2)) * 0.7), 2.0, 0.7 + noise2(x * 0.05, z * 0.05) * 0.9, 0];
    b.vertex({ x, y: height(x, z), z }, ground.normal(x, z), c, paint);
  }
  for (let j = 0; j < n - 1; j++) for (let i = 0; i < n - 1; i++) { const a = j * n + i; b.quad(a, a + n, a + n + 1, a + 1); }
  r.add(b.build(), 'ground', { under: true, fields: { x: 0, z: 0, side: SIZE, turn: 0 } });

  const g = new MeshBuilder('grass'), flowers = new MeshBuilder('foliage'), rand = rng(5);
  for (let k = 0; k < 9000; k++) {
    const x = (rand() * 2 - 1) * half, z = (rand() * 2 - 1) * half;
    if (pad(x, z) > -0.4 || pit(x, z, 1) > 0 || rand() > 0.25 + 0.75 * smooth(0.4, 0.8, noise2(x * 0.09 + 40, z * 0.09) * 0.5 + 0.5)) continue;
    addTuft(g, ground, x, z, 0.2 + rand() * 0.25, C.meadow.clone().lerp(C.lime, rand() * 0.5), rand);
  }
  const palette = [srgb(0xf08bb0), srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8)];
  for (let d = 0; d < 90; d++) {
    addFlowers(flowers, ground, (rand() * 2 - 1) * half, (rand() * 2 - 1) * half, palette[Math.floor(rand() * palette.length)], 8 + Math.floor(rand() * 10),
      rand, (x, z) => pad(x, z) < -0.5 && pit(x, z, 1) === 0);
  }
  r.add(g.build(), 'grass', { castShadow: false });
  r.add(flowers.build(), 'foliage', { castShadow: false, cover: 'none' });

  const ready = (async () => {
    const set = new ModelSet();
    const loaded = await Promise.all(STANDS.map((s) => loadModel(s.model.url)));
    STANDS.forEach((s, i) => set.add(loaded[i], new THREE.Matrix4().compose(new THREE.Vector3(s.x, height(s.x, s.z), s.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, s.yaw, 0)), new THREE.Vector3(1, 1, 1))));
    set.addTo(r);
  })();
  const wind: Obstacle[] = STANDS.filter((s) => blocksWind(s.model)).map((s) => ({
    box: { x: s.x, z: s.z, hx: s.model.tiles[0] * TILE * 0.45, hz: s.model.tiles[1] * TILE * 0.45, turn: -s.yaw }, solid: true, height: s.model.hi[1],
  }));
  return { center: new THREE.Vector3(0, 0, 0), radius: half * Math.SQRT2, stream: STREAM, wind, ready, stands: STANDS, height, bare: () => 0 };
}
