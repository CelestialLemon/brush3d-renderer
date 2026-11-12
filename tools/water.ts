// Checks the water map (#18): how the renderer lays out the game's map (src/renderer/water.ts), the demo's stand-in for
// the game's flood rule (src/app/water.ts), and the easing between maps. No browser needed.
//   npm run test:water
// 1. Laying out: wet cells as sent; the sheet runs on flat for one cell past the last wet one, then dives under the land
//    (DIVE a cell, at most MAX_DIVE), carrying the nearest water's flow and mud; with no water it lies far under everything.
// 2. The stand-in's rule: water reaches lower ground it can get to and nothing else (a hollow behind a ridge stays dry
//    until the ridge is overtopped), never off the land.
// 3. Easing: halfway through, the sheet is halfway between the two maps; a map sent mid-ease starts from what's drawn.
// Exits with 1 if anything is off.
import { DIVE, HIDDEN_DIVE, MAX_DIVE, REACH, WaterField, layWater, SHORE_MAX, shoreDistance, type WaterMap } from '../src/renderer/water.ts';
import { DemoWater } from '../src/app/water.ts';
import type { Stream } from '../src/scenes/kit.ts';

let failed = false;
function check(name: string, ok: boolean, detail = '') {
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
}
const near = (a: number, b: number, e = 1e-5) => Math.abs(a - b) <= e;

// 1. A 9 x 5 grid, wet in its middle column at 2 m, flowing along z at 0.5 m/s, a little muddy.
console.log('Laying out the map');
const nx = 9, nz = 5, n = nx * nz;
const map: WaterMap = {
  nx, nz, cell: 1, x0: 0, z0: 0, level: new Float32Array(n).fill(NaN),
  flowX: new Float32Array(n), flowZ: new Float32Array(n), mud: new Float32Array(n),
};
for (let j = 0; j < nz; j++) { const k = j * nx + 4; map.level[k] = 2; map.flowZ![k] = 0.5; map.mud![k] = 0.3; }
const laid = layWater(map);
const at = (i: number, j: number) => laid.data.subarray((j * nx + i) * 4, (j * nx + i) * 4 + 4);
check('wet cells as sent', [0, 1, 2, 3, 4].every((j) => at(4, j)[0] === 2 && near(at(4, j)[2], 0.5)));
check('flat for one cell past the water', near(at(3, 2)[0], 2) && near(at(5, 2)[0], 2), `${at(3, 2)[0]}, ${at(5, 2)[0]}`);
check('then diving', near(at(2, 2)[0], 2 - DIVE) && near(at(6, 2)[0], 2 - DIVE), `${at(2, 2)[0]}`);
check('at most MAX_DIVE under', near(at(0, 2)[0], 2 - Math.min(3 * DIVE, MAX_DIVE)), `${at(0, 2)[0]}`);
check('the nearest water\'s flow and mud carried', near(at(1, 2)[2], 0.5) && near(at(3, 2)[3], 0.3));
check('diving, how far down instead of mud', near(at(1, 2)[3], -2 * DIVE));
check('distances to the water', laid.dist[2 * nx + 4] === 0 && laid.dist[2 * nx + 3] === 1 && laid.dist[2 * nx] === 4);
check('its range', laid.low === 2 && laid.high === 2 && laid.mid === 2);
const dry = layWater({ ...map, level: new Float32Array(n).fill(NaN) });
check('no water: far under everything', dry.data.every((v, i) => i % 4 !== 0 || v <= -1000) && dry.mid === null);
// Two waters at different heights: a dry cell between takes the higher.
const two = { ...map, level: new Float32Array(n).fill(NaN) };
for (let j = 0; j < nz; j++) { two.level[j * nx + 2] = 1; two.level[j * nx + 6] = 3; }
const laid2 = layWater(two);
check('between two waters, the higher', near(laid2.data[(2 * nx + 4) * 4], 3 - DIVE), `${laid2.data[(2 * nx + 4) * 4]}`);
let threw = false;
try { layWater({ ...map, level: new Float32Array(3) }); } catch { threw = true; }
check('a map of the wrong size is refused', threw);

// 2. The stand-in's rule on a valley: a channel along z at x = 10, ground rising away from it, a hollow at x = 3 behind
// a ridge at x = 5.
console.log('The demo\'s flood rule');
const ground = (x: number) => (Math.abs(x - 10) < 1 ? -1 : x > 10 ? (x - 10) * 0.1 : x > 5 ? (10 - x) * 0.1 : x > 4 ? 0.6 : 0.2);
const stream: Stream = {
  level: 0, grid: { nx: 20, nz: 4, cell: 1, x0: 0, z0: 0 },
  channel: (x) => Math.abs(x - 10) < 1, along: () => [0, -1],
  land: (x) => x < 18,
};
const demo = new DemoWater(stream, (x) => ground(x));
const wetAt = (m: WaterMap, x: number) => !Number.isNaN(m.level[1 * 20 + Math.floor(x)]);
const usual = demo.map({ rise: 0, flow: 1, mud: 0, ice: 0 });
check('as usual, only the channel', wetAt(usual, 10) && !wetAt(usual, 12) && !wetAt(usual, 7));
check('flowing along it at the usual speed', near(usual.flowZ![1 * 20 + 10], -0.35));
const risen = demo.map({ rise: 0.45, flow: 2, mud: 0.5, ice: 0 });
check('a rise spreads over lower ground', wetAt(risen, 12) && wetAt(risen, 7) && !wetAt(risen, 15));
check('but not into the hollow behind the ridge', !wetAt(risen, 3));
check('slower out of the channel', near(risen.flowZ![1 * 20 + 12], -0.35 * 2 * 0.25));
const over = demo.map({ rise: 0.7, flow: 2, mud: 0.5, ice: 0 });
check('over the ridge, into the hollow', wetAt(over, 3) && wetAt(over, 4.5));
check('never off the land', !wetAt(demo.map({ rise: 5, flow: 1, mud: 0, ice: 0 }), 18.5));

// 3. Easing between two maps.
console.log('Easing');
const field = new WaterField();
const a = { ...map, level: map.level.map((v) => (Number.isNaN(v) ? v : 1)) };
const b = { ...map, level: map.level.map((v) => (Number.isNaN(v) ? v : 3)) };
field.set(a, 0);
check('a new grid comes in at once', field.blend(0) === 1);
field.set(b, 10, 2);
check('eases from the old', field.blend(10) === 0 && near(field.blend(11), 0.5) && field.blend(12) === 1);
const mid = (field.a.image.data as Float32Array)[(2 * nx + 4) * 4] * 0.5 + (field.b.image.data as Float32Array)[(2 * nx + 4) * 4] * 0.5;
check('halfway, halfway between', near(mid, 2), `${mid}`);
field.set(b, 11, 2);
check('a map sent mid-ease starts from what\'s drawn', near((field.a.image.data as Float32Array)[(2 * nx + 4) * 4], 2));
const idx = field.geometry!.index!, drawn = field.geometry!.drawRange.count;
// Vertex of cell (i, j): inside the ring of edge vertices.
const vertex = (i: number, j: number) => (j + 1) * (nx + 2) + i + 1;
const cells = new Set(Array.from((idx.array as Uint32Array).subarray(0, drawn)));
check(`triangles only round the water (within ${REACH} cell)`, !cells.has(vertex(0, 2)) && cells.has(vertex(3, 2)) && cells.has(vertex(5, 2)));
check('framed round it', field.geometry!.boundingBox!.max.y === 3 && field.wetLow === 1);
field.set(a, 11.5, 2);
check('one index for every map on a grid', field.geometry!.index === idx);
const flooded = { ...map, level: new Float32Array(nx * nz).fill(1) };
field.set(flooded, 12, 0);
const box = field.geometry!.boundingBox!;
check('water reaches the grid\'s edge', box.min.x === map.x0 && box.max.x === map.x0 + nx * map.cell
  && box.min.z === map.z0 && box.max.z === map.z0 + nz * map.cell, `${box.min.x} ${box.max.x}`);
const before = field.a;
field.set({ nx: 3, nz: 2, cell: 1, x0: 0, z0: 0, level: new Float32Array(6).fill(1) }, 13);
check('a new grid, new textures at its size', field.a !== before && field.a.image.width === 3 && field.a.image.height === 2);
// Draining away entirely, and coming back: whatever's drawn on the way (not sunk past the discard) stays in its bounds.
const inBounds = (f: WaterField) => {
  const A = f.a.image.data as Float32Array, B = f.b.image.data as Float32Array;
  let ok = true;
  for (const t of [0, 0.01, 0.02, 0.05, 0.1, 0.3, 0.6, 0.9, 0.97, 1]) {
    for (let i = 0; i < A.length; i += 4) {
      const y = A[i] + (B[i] - A[i]) * t, m = A[i + 3] + (B[i + 3] - A[i + 3]) * t;
      if (m >= -HIDDEN_DIVE && (y < f.shownLow - 1e-4 || y > f.high + 1e-4)) ok = false;
    }
  }
  return ok;
};
const allDry = { ...map, level: new Float32Array(nx * nz).fill(NaN) };
const muddy = { ...b, mud: new Float32Array(nx * nz).fill(1) };
field.set(muddy, 20, 0);
field.set(allDry, 21, 1);
check('drained away, it sinks out of sight within its bounds', inBounds(field) && field.any);
check('still there while it drains', !field.settle(21.5) && field.any);
check('and gone once it has', field.settle(22) && !field.any);
field.set(allDry, 23, 0);
field.set(a, 24, 1);
check('coming back, it rises into sight within its bounds', inBounds(field) && field.any);
field.set(null, 14);
check('taken away', !field.any && field.grid.w === 0 && field.floor === null);

// The ice (#14): what the game sends, carried to the dry cells as the mud is; how far into the water each cell is; and
// whether it's thawing, from which way it last moved.
const iced = layWater({ ...map, ice: new Float32Array(n).fill(0.4).map((v, i) => (i % nx === 4 ? 1.5 : v)) });
check('ice: as sent on the wet, at most 1', near(iced.ice[2 * nx + 4], 1));
check('ice: the dry cells take the nearest water\'s', near(iced.ice[2 * nx + 1], 1) && near(iced.ice[2 * nx + 7], 1));
const wide = { ...map, level: new Float32Array(n).map((_, i) => (i % nx >= 2 && i % nx <= 6 ? 2 : NaN)) };
const shore = shoreDistance(wide);
check('shore: half a cell in at the edge, more towards the middle, none on the land',
  near(shore[2 * nx + 2], 0.5) && near(shore[2 * nx + 3], 1.5) && near(shore[2 * nx + 4], 2.5) && shore[2 * nx + 1] === 0,
  [...shore.subarray(2 * nx, 3 * nx)].map((v) => v.toFixed(2)).join(' '));
check('shore: the grid\'s edge is not a shore', shore[4] > shore[2 * nx + 4] - 1e-6);
const freezing = new WaterField();
const iceAt = (f: WaterField, t: 'iceA' | 'iceB', i: number) => (f[t].image.data as Float32Array).subarray(i * 4, i * 4 + 4);
const withIce = (v: number) => ({ ...wide, ice: new Float32Array(n).fill(v) });
freezing.set(withIce(0.2), 30, 0);
check('ice: none thawing at first', iceAt(freezing, 'iceB', 2 * nx + 4)[1] === 0 && freezing.iced);
freezing.set(withIce(0.8), 31, 0);
check('ice: rising, freezing', iceAt(freezing, 'iceB', 2 * nx + 4)[1] === 0 && near(iceAt(freezing, 'iceB', 2 * nx + 4)[0], 0.8));
freezing.set(withIce(0.5), 32, 0);
check('ice: falling, thawing', iceAt(freezing, 'iceB', 2 * nx + 4)[1] === 1 && iceAt(freezing, 'iceA', 2 * nx + 4)[1] === 1);
freezing.set(withIce(0.5), 33, 0);
check('ice: held, still thawing', iceAt(freezing, 'iceB', 2 * nx + 4)[1] === 1);
check('ice: the shore distance goes with it', near(iceAt(freezing, 'iceB', 2 * nx + 4)[2], 2.5));
freezing.set(withIce(0), 34, 0);
check('ice: all gone (thawed)', !freezing.iced);
freezing.set(wide, 35, 0);
check('ice: none sent, none drawn', !freezing.iced);
// Turning back mid-ease: rising again from a fall that's still being drawn is freezing, by what the game sent.
const turning = new WaterField();
turning.set(withIce(0.8), 40, 0);
turning.set(withIce(0.2), 41, 4);
turning.set(withIce(0.4), 42, 4);
check('ice: turning back mid-ease, freezing again', iceAt(turning, 'iceB', 2 * nx + 4)[1] === 0);
// Sent in steps finer than a float's noise (a game easing the ice each frame), it still turns.
const creeping = new WaterField();
creeping.set(withIce(0.5), 50, 0);
for (let k = 1; k <= 20; k++) creeping.set(withIce(0.5 - k * 5e-5), 50 + k * 0.016, 0);
check('ice: thawing in tiny steps', iceAt(creeping, 'iceB', 2 * nx + 4)[1] === 1);
for (let k = 1; k <= 20; k++) creeping.set(withIce(0.499 + k * 5e-5), 51 + k * 0.016, 0);
check('ice: freezing again in tiny steps', iceAt(creeping, 'iceB', 2 * nx + 4)[1] === 0);
// Thawed away with an ease: painted while it eases out, not after.
const melting = new WaterField();
melting.set(withIce(0.3), 60, 0);
melting.set(withIce(0), 61, 2);
melting.settle(62);
check('ice: still painted while thawing away', melting.iced);
melting.settle(63.5);
check('ice: none painted once thawed away', !melting.iced);
const allWet = (cell: number) => shoreDistance({ nx: 3, nz: 3, cell, x0: 0, z0: 0, level: new Float32Array(9).fill(1) });
check('shore: a map all water has no shore, however coarse', allWet(20).every((v) => v === SHORE_MAX) && allWet(10).every((v) => v === SHORE_MAX));
check('ice: the demo sends it only when there is some', near(demo.map({ rise: 0, flow: 1, mud: 0, ice: 0.4 }).ice?.[0] ?? 0, 0.4)
  && demo.map({ rise: 0, flow: 1, mud: 0, ice: 0 }).ice === undefined);

if (failed) process.exit(1);
