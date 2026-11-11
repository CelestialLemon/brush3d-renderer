import * as THREE from 'three';
import type { BrushRenderer } from '../renderer/renderer';
import { MeshBuilder, noise2, rng, srgb, type Paint } from './builder';
import { addModel, loadModel } from './model';
import shedModel from './models/shed.glb?url';
import farmhouseModel from './models/farmhouse.glb?url';
import barnModel from './models/barn.glb?url';
import coopModel from './models/coop.glb?url';
import wellModel from './models/well.glb?url';
import glasshouseModel from './models/glasshouse.glb?url';
import wheatmillModel from './models/wheatmill.glb?url';
import haywagonModel from './models/haywagon.glb?url';
import rowboatModel from './models/rowboat.glb?url';
import scarecrowModel from './models/scarecrow.glb?url';
import {
  C, MapLine, addFlowers, addMound, addReeds, addStone, addTuft, groundOf, smooth, treeWind, type Stream, type Tree,
} from './kit';
import { DRAG, type Obstacle } from '../wind/sim';
import type { Season } from '../renderer/season';
import { Grove, dressFor, type Dress } from './seasonTrees';

// A pastoral valley, about 176 m across, for trying the renderer's features on a big, full and varied scene. In its
// middle, the working farm after the aerial shot in Dear Alice (0:37): a wheat field with a solar array, a track along it
// behind a rail fence, curved orchard rows with crates of apples, a dark clump of big trees over a picnic table, a stream
// with a plank bridge, a fork in the track by a dry-stone wall, a nursery in rows and a barn-red shed.
//
// Round it (decided with the developer, 2026-11-03: pastoral, no machines):
// - right, the farmstead: a farmhouse and a hay barn round a yard with a well and a hay wagon, a hen house, and a kitchen
//   garden of raised beds behind a paling fence with a glasshouse; an old orchard of fruit trees below it;
// - up the back slope, a patchwork of fields between hedgerows: sunflowers, a ploughed field, green barley, and a hay
//   meadow being cut, with woods along the ridge;
// - top left, a windmill on a knoll, a rocky outcrop, and the stream coming down out of the hills;
// - left, pastures behind dry-stone walls with old trees standing alone in them;
// - below, the stream opens into a pond with a jetty and a rowing boat, willows and reeds; a field of lavender with
//   beehives; a cabbage field with a scarecrow; and woods along the near edge.
//
// The layout is drawn on a map whose axes are the default view's screen: u to the right, v away up the screen. One unit is
// one metre, as in the game.

/** The land's half-size (the ground mesh), metres; things are placed a little inside it. */
const LAND = 88, STEP = 0.5;
/** The old farm's half-size: the core, kept as it was. */
const CORE = 34;
const SQ = Math.SQRT1_2;
/** Map (u right, v up the screen in the default view) to world x, z. */
const W = (u: number, v: number): [number, number] => [(u - v) * SQ, (-u - v) * SQ];
/** World to map. */
const M = (x: number, z: number): [number, number] => [(x - z) * SQ, (-x - z) * SQ];
const line = (pts: [number, number][]) => new MapLine(pts.map(([u, v]) => W(u, v)));
const onLand = (u: number, v: number, margin = 0.5) => Math.abs(u) < LAND - margin && Math.abs(v) < LAND - margin;

// The stream comes down out of the hills at the top left, runs through the old farm as before, and opens into a pond
// below it; a brook leaves the pond for the near edge. Each line flows towards its start.
const STREAM_CORE: [number, number][] = [[-38, -1], [-29, -4], [-23, -9], [-19.5, -15], [-17, -21], [-14, -27], [-12, -38]];
const STREAM = line([[-8, -50], [-10.5, -44], ...[...STREAM_CORE].reverse(), [-48, -2], [-61, 6], [-73, 17], [-81, 26], [-85, 28.5], [-88, 28.5]]);
const OUTFLOW = line([[7, -88], [7, -83], [5.5, -78], [1, -70], [-3, -62]]);
// Each leaves the land square to its edge (its last stretch straight across it), so its water ends with the land.
const STREAMS = [STREAM, OUTFLOW];
// How much wider the stream is than the kit's brook: distances from it are measured in brook-widths, so its bed, banks and
// floodplain all widen together.
const WIDE = 1.6;

/** The pond: an egg of water with a wobbling shore, centre and radii in map metres. */
const POND = { u: -6, v: -57, a: 16, b: 10.5 };
/** How far a map point is outside the pond's shore, metres (negative in the water). */
function pondShore(u: number, v: number) {
  const du = (u - POND.u) / POND.a, dv = (v - POND.v) / POND.b, d = Math.hypot(du, dv);
  const a = Math.atan2(dv, du), wob = 1 + 0.1 * noise2(Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4) + 0.05 * noise2(Math.cos(a) * 3.1, Math.sin(a) * 3.1 + 7);
  return (d - wob) * (POND.a + POND.b) * 0.5;
}
/**
 * Distance from the water in brook-widths, for the banks: the streams' lines, and the pond's shore as if it were a
 * stream's (its shore at about where a stream's water meets its bank).
 */
function waterDistance(x: number, z: number) {
  const [u, v] = M(x, z);
  return Math.min(STREAM.distance(x, z) / WIDE, OUTFLOW.distance(x, z) / WIDE, Math.max(0, 1.4 + pondShore(u, v) / WIDE));
}

const TRACK = line([[-92, 13], [-74, 11.5], [-56, 9], [-38, 7], [-24, 5.5], [-10, 4], [4, 4.5], [16, 6], [26, 8], [38, 8.5], [47, 9.5],
  [56, 10], [68, 9.5], [80, 7.5], [92, 6]]);
const LANE = line([[-92, -38], [-70, -32], [-50, -27], [-38, -25], [-27, -20.5], [-18, -18.5], [-6, -16.5], [6, -14.5], [16, -11.5]]);
const FORK_UP = line([[16, -11.5], [20, -5], [22.5, 1.5], [24.5, 7.5]]);
const FORK_DOWN = line([[16, -11.5], [25, -14.5], [38, -17.5], [54, -20], [70, -21], [92, -23]]);
/** Along the foot of the back fields, from the windmill's door to the far edge. */
const BACK_TRACK = line([[-40, 49], [-35, 43], [-26, 38], [-10, 37], [10, 37.5], [30, 37], [54, 36.5], [80, 37], [92, 38]]);
/** Up from the yard, between the barn and the house, to the back track. */
const FARM_LANE = line([[56, 10], [55.5, 22], [54, 36.5]]);
/** A footpath from the shed's porch down to the pond's jetty. */
const FOOTPATH = line([[-2, -25], [1.5, -35], [7, -45], [12.5, -53]]);
const PATHS = [TRACK, LANE, FORK_UP, FORK_DOWN, BACK_TRACK, FARM_LANE, FOOTPATH];
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
/** How far inside the wheat a map point is (negative outside): up to the back track's hedge and the farmstead's. */
const wheatInside = (u: number, v: number) =>
  Math.min(v - wheatEdge(u), u - WHEAT_LEFT + 0.6 * Math.sin(v * 0.4), 33.5 - v + 0.4 * Math.sin(u * 0.27), 33.5 - u + 0.5 * Math.sin(v * 0.31));

/** A field on the map: a rectangle with softly wobbling edges. How far inside it a point is, metres (negative outside). */
interface Plot { u0: number; u1: number; v0: number; v1: number }
const plotInside = (p: Plot, u: number, v: number) =>
  Math.min(u - p.u0, p.u1 - u, v - p.v0, p.v1 - v) + 0.35 * noise2(u * 0.21 + p.u0, v * 0.21 + p.v0);
const SUNFLOWERS: Plot = { u0: -16, u1: 7.5, v0: 41.5, v1: 58.5 };
const PLOUGHED: Plot = { u0: 11.5, u1: 33.5, v0: 41.5, v1: 59 };
const BARLEY: Plot = { u0: 37.5, u1: 72, v0: 41.5, v1: 58 };
const HAY: Plot = { u0: -16, u1: 72, v0: 62.5, v1: 70.5 };
const LAVENDER: Plot = { u0: 18, u1: 40, v0: -62, v1: -47 };
const CABBAGES: Plot = { u0: -52, u1: -31, v0: -64, v1: -45 };
/** The farmyard: earth worn bare between the barn, the house and the hen house. */
const YARD: Plot = { u0: 42, u1: 70, v0: 3.5, v1: 15.5 };
/** The kitchen garden, behind its paling fence. */
const GARDEN: Plot = { u0: 56, u1: 80, v0: -16, v1: -1 };
const PLOTS = [SUNFLOWERS, PLOUGHED, BARLEY, HAY, LAVENDER, CABBAGES, YARD, GARDEN];
const inPlot = (u: number, v: number, margin = 0) => PLOTS.some((p) => plotInside(p, u, v) > -margin);

/** The orchard's rows: gentle arcs, a bush every metre and a half, worn alleys between. */
const ROWS = Array.from({ length: 4 }, (_, k) => line([[-9.5 + k * 0.6, -11.5 + k * 3.3], [-1, -10.4 + k * 3.3], [8.5 - k * 0.5, -12 + k * 3.4]]));
const ORCHARD_LEAF = C.fruitLeaf.clone().lerp(C.deepLeaf, 0.55);
/** The nursery: straight rows of young trees running down to the right. */
const NURSERY = Array.from({ length: 6 }, (_, k) => line([[12 + k * 0.4, -21 - k * 2.4], [36, -26 - k * 2.4]]));
/** The old orchard below the garden: standard fruit trees in a loose grid. */
const OLD_ORCHARD: Plot = { u0: 43, u1: 76, v0: -56, v1: -27 };

const PANELS: [number, number][] = [
  [-2, 14], [3, 14.3], [8, 14.6], [13, 14.9], [18, 15.2],
  [0.5, 19.5], [5.5, 19.8], [10.5, 20.1], [15.5, 20.4], [20.5, 20.7],
];

function tree(kind: Tree['kind'], u: number, v: number, scale: number, seed: number, leaf?: THREE.Color): Tree {
  const [x, z] = W(u, v);
  return { kind, x, z, scale, seed, ...(leaf ? { leaf } : {}) };
}

/**
 * The buildings, modelled in Blender (tools/blender/): where each stands on the map, which way its front faces (radians
 * from facing down the screen, towards the default view, turning towards +u), the half-size of the ground levelled under
 * it (along its front and its depth), and how tall it is (for the wind). The shed is the test shed (#10).
 */
interface Building { url: string; u: number; v: number; facing: number; hx: number; hz: number; height: number; pad?: boolean; y?: number }
const SHED: Building = { url: shedModel, u: -2.5, v: -20.5, facing: 0, hx: 2.3, hz: 2.6, height: 3 };
const BUILDINGS: Building[] = [
  SHED,
  { url: farmhouseModel, u: 64, v: 21, facing: 0, hx: 6.8, hz: 4.6, height: 8, pad: true },
  { url: barnModel, u: 42.5, v: 26, facing: 0, hx: 6.6, hz: 4.6, height: 8, pad: true },
  { url: coopModel, u: 73.5, v: 8, facing: -Math.PI / 2, hx: 1.6, hz: 1.4, height: 1.9, pad: true },
  { url: wellModel, u: 61, v: 7.5, facing: 0.3, hx: 0.9, hz: 0.9, height: 2.3, pad: true },
  { url: glasshouseModel, u: 71, v: -4.5, facing: 0, hx: 3.9, hz: 2.2, height: 3.3, pad: true },
  // Includes the milling house, loading deck and sack hoist; sails overhang this ground footprint.
  { url: wheatmillModel, u: -40, v: 54, facing: 0, hx: 6.1, hz: 3.6, height: 14.4, pad: true },
  { url: haywagonModel, u: 49, v: 16.5, facing: Math.PI / 2 + 0.25, hx: 2.2, hz: 1.2, height: 2.4 },
  { url: scarecrowModel, u: -41, v: -54, facing: 0.4, hx: 0.4, hz: 0.4, height: 2 },
];
/** The rowing boat, moored by the jetty, floating at the water's level. */
const BOAT: Building = { url: rowboatModel, u: 3, v: -58.3, facing: Math.PI / 2 + 0.12, hx: 1.9, hz: 0.8, height: 0.6 };
/** The jetty: from the pond's right shore out into it, its deck's two ends on the map. */
const JETTY = { from: [14, -55] as [number, number], to: [3.5, -55.8] as [number, number], width: 1.6 };

/** A map point in a building's own frame: x along its front, z out through its front. */
function local(b: Building, u: number, v: number): [number, number] {
  const du = u - b.u, dv = v - b.v, c = Math.cos(b.facing), s = Math.sin(b.facing);
  return [du * c + dv * s, du * s - dv * c];
}
/** How far outside a building's footprint a map point is, metres (0 inside). */
function footprint(b: Building, u: number, v: number) {
  const [lx, lz] = local(b, u, v);
  return Math.hypot(Math.max(0, Math.abs(lx) - b.hx), Math.max(0, Math.abs(lz) - b.hz));
}
const nearBuilding = (u: number, v: number, margin: number) => [...BUILDINGS, BOAT].some((b) => footprint(b, u, v) < margin);
/** The shed's own frame, in world coordinates (as before). */
function shedLocal(x: number, z: number): [number, number] {
  const [u, v] = M(x, z), [lx, lz] = local(SHED, u, v);
  return [lx, lz];
}
/** Under the shed's roof (its walls, its porch), with a margin. */
const underShed = (x: number, z: number, margin = 0) => {
  const [lx, lz] = shedLocal(x, z);
  return Math.abs(lx) < 2.3 + margin && lz > -1.7 - margin && lz < 3.6 + margin;
};

// Trees placed by hand.
const TREES: Tree[] = [
  // Cypresses, top left, and two by the orchard.
  ...([[-27, 13, 1.3], [-22.5, 17, 1.5], [-18, 11.5, 1.2], [-13.5, 9.5, 1.45], [-31, 19.5, 1.1], [-16, 1, 1.65], [-12, -1.5, 1.25],
    [-25, 22, 1.3]] as const).map(([u, v, s], i) => tree('cypress', u, v, s, 100 + i)),
  // The big clump right of the orchard, its leaves deep.
  ...([[13, -1, 2.1], [17.5, 2.5, 1.85], [18.5, -3.5, 1.7], [14.5, -5.5, 1.45], [10.5, 2, 1.3]] as const)
    .map(([u, v, s], i) => tree('broadleaf', u, v, s, 200 + i, C.deepLeaf)),
  // Round trees along the stream and the lane.
  ...([[-22, -3.5, 1.1], [-13, -13, 0.95], [-26, -13, 1.0], [-11, -22, 1.15], [-30, 1, 0.9], [4, -20, 1.2], [27, -6, 1.1],
    [29, 2, 0.95]] as const).map(([u, v, s], i) => tree('broadleaf', u, v, s, 300 + i)),
  // A fruit tree by the crates.
  tree('fruit', -12.5, -8, 1.05, 400),
  // Old trees round the farmhouse: one shading its back, one by the barn, one over the hen house.
  tree('broadleaf', 75, 27, 2.2, 500, C.deepLeaf), tree('broadleaf', 33.5, 28, 1.6, 501), tree('broadleaf', 79, 10, 1.5, 502),
  tree('broadleaf', 48, 33, 1.3, 503),
  // Old trees standing alone in the pastures, and one by the windmill.
  ...([[-70, -16, 2.1], [-64, 9, 1.8], [-80, 20, 1.9], [-62, -36, 1.7], [-78, -50, 2.0], [-30, 47, 1.4]] as const)
    .map(([u, v, s], i) => tree('broadleaf', u, v, s, 600 + i, C.leaf.clone().lerp(C.deepLeaf, 0.3 + 0.1 * i))),
  // Willows (round, pale) round the pond, and cypresses by the lavender.
  ...([[-24, -50, 1.5], [-21, -66, 1.3], [-9, -72.5, 1.6], [6, -67, 1.2], [-17, -44, 1.1]] as const)
    .map(([u, v, s], i) => ({ ...tree('broadleaf', u, v, s, 700 + i, C.leafLight.clone().lerp(C.teal, 0.35)), form: 'willow' as const })),
  ...([[16, -45, 1.3], [16.5, -50, 1.1], [42, -46, 1.4], [42.5, -51, 1.2]] as const).map(([u, v, s], i) => tree('cypress', u, v, s, 800 + i)),
];
// The old orchard: standard fruit trees in rows, every other one shifted.
for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) {
  const u = OLD_ORCHARD.u0 + 3 + i * 5.6 + (j % 2) * 2.8, v = OLD_ORCHARD.v0 + 3 + j * 5.8;
  if (u > OLD_ORCHARD.u1 - 2) continue;
  TREES.push(tree('fruit', u + noise2(i, j) * 0.6, v + noise2(j, i) * 0.6, 1.0 + 0.2 * noise2(i * 3, j * 3), 900 + i * 10 + j));
}

// Crates of apples by the orchard ([u, v, turn]), and empty ones stacked two high.
const CRATES: [number, number, number][] = [[-9.4, -13.8, 0.3], [-7.4, -14.4, -0.2], [-8.6, -12.2, 0.9]];
const EMPTY_CRATES: [number, number, number][] = [[-11.2, -12.4, 0.1], [-11.0, -13.6, -0.15]];
const BASKETS: [number, number][] = [[-6.4, -12.6], [-5.8, -13.4], [-10.2, -10.9]];
const BARROW: [number, number, number] = [-4.6, -10.8, 1.1];
const HIVES: [number, number][] = [[20.5, -7.6], [22, -7.9], [23.5, -8.2], [25, -8.5], [24, -44.5], [26, -44.3], [28, -44.1], [30, -44.2], [32, -44.4]];
/** Round bales: three on the old meadow, and a scatter on the hay meadow being cut. */
const BALES: [number, number, number][] = [[-24, 9.6, 0.3], [-22.2, 10.8, 1.2], [-26, 11, 2.2],
  [-6, 66, 0.2], [-3.5, 67.4, 1.4], [14, 64.5, 0.6], [22, 68, 2.4], [24, 65.5, 0.1], [40, 67, 1.0], [52, 64, 2.0], [55, 66.5, 0.4]];
/** The hay meadow's being cut only in summer (#13); the old meadow's three bales stand all year. */
const balesNow = () => (SEASON === 'summer' ? BALES : BALES.slice(0, 3));
const BARRELS: [number, number][] = [[12.9, -6.2], [13.5, -6.9], [51, 5.5], [51.8, 4.8]];
const TABLE: [number, number] = [11, -7.5];
// The first clump moved aside for the shed (#10), to a place where every bush still grows, so the rest are unchanged.
const SHRUBS: [number, number][] = [[-7.8, -23.6], [8, -19], [-30, -10], [-33, -20], [-24, -30], [30, -3], [2, -27], [-31, 3],
  [-46, -14], [-58, 30], [-36, 30], [-48, 66], [-28, 62], [30, -32], [-26, -76], [44, -66], [84, -40], [-84, -12]];
/** Dry-stone walls: by the fork, and round the pastures on the left. */
const WALLS = [
  line([[19.5, -13.5], [24, -12], [28.5, -11]]),
  line([[-50, -42], [-51, -30]]), line([[-51.5, -23], [-53, -6], [-55, 4]]),
  line([[-88, -8], [-70, -7], [-54.5, -6]]),
  line([[-88, -44], [-66, -42], [-50, -42]]),
  line([[-88, 28], [-76, 30], [-66, 31.5], [-58, 34]]),
];
/** Hedgerows between the fields on the back slope and round the farmstead: rows of bushes, a tree in them here and there. */
const HEDGES = [
  line([[-18, 40], [10, 40.2], [35, 40], [74, 39.8]]),
  line([[-18, 60.5], [10, 60.5], [35, 60.3], [74, 60]]),
  line([[9.5, 41], [9.5, 59.5]]), line([[35.5, 41], [35.5, 59.5]]),
  line([[-18.5, 41], [-18.5, 70]]), line([[74.5, 41], [74.5, 70]]),
  line([[35, 13], [35.5, 34]]),
  line([[-50, -64], [-30, -66]]),
];

/** The land: a valley. A gentle slope rising away up the screen, long low swells, hills closing it in at the edges. */
function natural(u: number, v: number) {
  // The old farm's slope, levelling out below it, so the pond's hollow and the near hills sit above the water.
  const tilt = v > -25 ? 0.03 * v : -0.75 + 0.012 * (-25 - v);
  const swell = 0.6 * noise2(u * 0.04, v * 0.04) + 0.25 * noise2(u * 0.1 + 5, v * 0.1 - 3);
  const hills = 4.2 * smooth(38, 86, v) * (0.8 + 0.35 * noise2(u * 0.03 + 2, 1)) + 2.8 * smooth(-44, -88, u) * (0.8 + 0.3 * noise2(v * 0.035, 4))
    + 1.4 * smooth(62, 88, u) + 1.6 * smooth(-70, -90, v) + 1.0 * noise2(u * 0.025 - 9, v * 0.025 + 6) * smooth(40, 80, Math.max(Math.abs(u), Math.abs(v)));
  // The windmill's knoll.
  const knoll = 1.6 * Math.exp(-(((u + 40) / 13) ** 2 + ((v - 54) / 11) ** 2));
  return tilt + swell + hills + knoll;
}

/** The water's level: the old stream's (its mean over the old farm, a little below the land). */
const WATER_Y = (() => {
  let sum = 0;
  const core = line(STREAM_CORE);
  for (const p of core.points) sum += natural(...M(p.x, p.y));
  return sum / core.points.length - 0.3;
})();

const pathDistance = (x: number, z: number) => Math.min(...PATHS.map((p) => p.distance(x, z)));

/**
 * How bare the ground is at a point, 0..1: the tracks' wheel ruts (not the grass strip up the middle), the earth worn
 * bare under the shed's porch, the farmyard and the ploughed field. The demo's stand-in for the game's map of where dust
 * lifts (#36).
 */
function bare(x: number, z: number) {
  const dp = pathDistance(x, z);
  const track = (1 - smooth(PATH_HALF - 0.25, PATH_HALF + 0.15, dp)) * smooth(0.12, 0.3, dp);
  const [lx, lz] = shedLocal(x, z);
  const porch = (1 - smooth(1.7, 2.5, Math.abs(lx))) * smooth(1.2, 1.6, lz) * (1 - smooth(3.4, 4.6, lz));
  const [u, v] = M(x, z);
  return Math.max(track, 0.8 * porch, 0.7 * smooth(-0.5, 1, plotInside(YARD, u, v)), 0.9 * smooth(-0.5, 1, plotInside(PLOUGHED, u, v)));
}

function height(x: number, z: number) {
  const [u, v] = M(x, z);
  const ds = waterDistance(x, z);
  let h = natural(u, v);
  // Under each building the ground is levelled, easing back into the land round it.
  for (const b of BUILDINGS) {
    if (!b.pad) continue;
    const d = footprint(b, u, v);
    if (d < 3) h += (natural(b.u, b.v) - h) * (1 - smooth(0.4, 3, d));
  }
  // Never below the water away from it: no dry hollows under the water's level.
  const floor = WATER_Y + 0.35;
  if (h < floor + 0.4) h = floor + 0.4 * Math.exp((h - floor - 0.4) / 0.4);
  // A floodplain eases down to a little above the water.
  h += (WATER_Y + 0.28 - h) * (1 - smooth(2.2, 10, ds));
  // Tracks are worn a little into the land.
  h -= 0.07 * (1 - smooth(PATH_HALF - 0.2, PATH_HALF + 0.5, pathDistance(x, z)));
  // The pond deepens towards its middle.
  const bed = WATER_Y - 0.8 - 0.7 * smooth(0, 7, -pondShore(u, v));
  return bed + (h - bed) * smooth(0.3, 2.3, ds);
}
const ground = groundOf(height);

export interface Farm {
  center: THREE.Vector3; radius: number;
  /** The stream (#18): the demo makes the game's water map from it. */
  stream: Stream;
  /** What the wind meets (#36). */
  wind: Obstacle[];
  /** Settles once the models are loaded and in the scene. */
  ready: Promise<void>;
  /** The land's height at a point, and how bare it is (0..1): where a gust can lift dust (#36). */
  height: (x: number, z: number) => number;
  bare: (x: number, z: number) => number;
}

/** Where the farm's pieces go: the renderer, its big meshes cut into tiles of the land (TILE metres). */
type Adder = Pick<BrushRenderer, 'add'>;
/**
 * Tiles of 24 m: on screen at the default zoom are a few dozen; far fewer and a pass draws much it doesn't show, far more
 * and the draw calls add up on the CPU.
 */
const TILE = 24;

/**
 * The season the farm is built in (#13). What's planted and how far it has grown is the game's; the demo stands in for it,
 * so the preview reads as that season's farm: the wheat young and green in spring, ripe in summer (the scene as it was
 * made), stubble in autumn and ploughed in winter; the barley and the sunflowers likewise; the hay cut only in summer;
 * the wildflowers thinning out to none; the lavender in flower only in summer. The colours are the renderer's (setSeason).
 */
let SEASON: Season = 'summer';
/** How the trees are dressed for the season (seasonTrees.ts); none in summer, or with no season set. */
let DRESS: Dress | null = null;
/** How far a crop has come: growing, ready (the scene's own), cut to stubble, or the field ploughed and bare. */
type Stage = 'young' | 'ripe' | 'stubble' | 'bare';
const STAGE: Record<Season, Stage> = { spring: 'young', summer: 'ripe', autumn: 'stubble', winter: 'bare' };

export function buildFarm(renderer: BrushRenderer, season: Season = 'summer'): Farm {
  SEASON = season;
  DRESS = dressFor(season, canFall);
  const r: Adder = { add: (g, kind, o = {}) => renderer.add(g, kind, { ...o, tile: TILE }) };
  terrain(r);
  crops(r);
  panels(r);
  fences(r);
  bridges(r);
  orchard(r);
  trees(r);
  nursery(r);
  beds(r);
  goods(r);
  stones(r);
  grass(r);
  return { center: new THREE.Vector3(0, 0, 0), radius: LAND * Math.SQRT2, stream: WATER, wind: windObstacles(), ready: models(r), height, bare };
}

/** Strips of an obstacle along a line, every 2 m: a hedge or a row, `offset` to its left. */
function strips(path: MapLine, from: number, to: number, offset: number, width: number, drag: number): Obstacle[] {
  const out: Obstacle[] = [];
  for (let s = from; s < to; s += 2) {
    const a = path.at(s), b = path.at(Math.min(to, s + 2));
    const ax = a.x - a.dz * offset, az = a.z + a.dx * offset, bx = b.x - b.dz * offset, bz = b.z + b.dx * offset;
    out.push({ strip: { ax, az, bx, bz, width }, drag });
  }
  return out;
}

/**
 * What the wind meets (#36), from the layout rather than the meshes: the trees' crowns, the orchard's and the nursery's
 * rows, the hedges, the buildings and the dry-stone walls. The fences (rails, mostly gaps), the panels (up on posts) and
 * the stream's thickets and the meadow's shrubs (placed at random as they're grown) are left out for now.
 */
function windObstacles(): Obstacle[] {
  const walls: Obstacle[] = [];
  for (const wall of WALLS) for (let d = 0; d < wall.length; d += 1) {
    const a = wall.at(d), b = wall.at(Math.min(wall.length, d + 1));
    walls.push({ strip: { ax: a.x, az: a.z, bx: b.x, bz: b.z, width: 0.6 }, solid: true, height: 0.6 });
  }
  const buildings: Obstacle[] = BUILDINGS.filter((b) => b.height > 1.5 && b.hx > 1).map((b) => {
    const [x, z] = W(b.u, b.v);
    return { box: { x, z, hx: b.hx * 0.9, hz: b.hz * 0.9, turn: -(Math.PI / 4 + b.facing) }, solid: true, height: b.height };
  });
  return [
    ...TREES.map(treeWind), ...TREES_GROWN.map(treeWind),
    // The orchard's bushes, a metre and a half apart in their rows; the nursery's young trees, further apart and thin.
    ...ROWS.flatMap((row) => strips(row, 0, row.length, 0, 1.3, DRAG.crown)),
    ...NURSERY.flatMap((row) => strips(row, 0, row.length, 0, 1.2, DRAG.crown / 3)),
    ...strips(FORK_UP, 2, 17, -(PATH_HALF + 1.05), 1.8, DRAG.hedge), ...strips(LANE, 2, 14, PATH_HALF + 1.05, 1.8, DRAG.hedge),
    ...HEDGES.flatMap((h) => strips(h, 0, h.length, 0, 1.8, DRAG.hedge)),
    ...buildings, ...walls,
  ];
}

/** The buildings, once their models have loaded. Each one's floor sits at the ground's mean height round it. */
async function models(r: Adder) {
  const b = new MeshBuilder('ink');
  const loaded = await Promise.all([...BUILDINGS, BOAT].map((m) => loadModel(m.url)));
  [...BUILDINGS, BOAT].forEach((m, i) => {
    const yaw = Math.PI / 4 + m.facing;
    const [x, z] = W(m.u, m.v);
    let y = 0, n = 0;
    for (const lx of [-1, 0, 1]) for (const lz of [-1, 0, 1]) {
      const c = Math.cos(yaw), s = Math.sin(yaw), px = lx * m.hx * 0.8, pz = lz * m.hz * 0.8;
      y += height(x + px * c + pz * s, z - px * s + pz * c); n++;
    }
    const place = new THREE.Matrix4().compose(new THREE.Vector3(x, m === BOAT ? WATER_Y : y / n, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)), new THREE.Vector3(1, 1, 1));
    addModel(b, loaded[i], place, m === BOAT);
  });
  r.add(b.build(), 'ink');
}

/** How near a point is to the rows of the orchard and the nursery: 1 on a row, falling off over the alley. */
const rowNear = (rows: MapLine[], x: number, z: number, reach: number) => Math.max(0, ...rows.map((l) => 1 - smooth(0.2, reach, l.near(x, z).distance)));
const inOrchard = (u: number, v: number) => u > -11 && u < 10 && v > -13.5 && v < 0.5;
const inNursery = (u: number, v: number) => u > 10 && u < 38 && v < -18 - (u - 10) * 0.2 && v > -39;

function terrain(r: Adder) {
  const b = new MeshBuilder('paint');
  const n = Math.round((2 * LAND) / STEP) + 1;
  const c = new THREE.Color();
  const soil = C.soil.clone().lerp(C.dirt, 0.35), soilDark = C.soil.clone().multiplyScalar(0.78);
  const mown = C.lime.clone().lerp(C.wheatTip, 0.25), hay = srgb(0xd8c070);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const u = -LAND + i * STEP, v = -LAND + j * STEP;
    const [x, z] = W(u, v);
    const y = height(x, z);
    const ds = waterDistance(x, z), dp = pathDistance(x, z);
    // Colour follows the land's form: rises catch the light yellow-green, hollows sink to emerald and teal.
    const ring = (k: number) => (height(x + k, z) + height(x - k, z) + height(x, z + k) + height(x, z - k)) / 4;
    const curve = 0.4 * (y - ring(2.5)) + 0.6 * (y - ring(6));
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5, k = noise2(x * 0.19 - 7, z * 0.19 + 2) * 0.5 + 0.5;
    c.copy(C.meadow).lerp(C.lime, smooth(0.0, 0.18, curve) * 0.6 + smooth(0.6, 0.9, m) * 0.2)
      .lerp(C.emerald, smooth(0.0, 0.2, -curve) * 0.55 + smooth(0.65, 0.95, 1 - m) * 0.25)
      .lerp(C.teal, smooth(0.15, 0.35, -curve) * 0.35 + smooth(0.75, 1, k) * 0.15);
    // The far hills a little cooler and deeper, the woods' floor darker.
    const far = smooth(62, 84, Math.max(Math.abs(u), Math.abs(v)));
    c.lerp(C.emerald.clone().lerp(C.teal, 0.4), far * 0.35);
    // Under the wheat, gold stubble; round the orchard, alleys worn pale between the rows; the nursery in strips.
    const inside = wheatInside(u, v), stage = STAGE[SEASON];
    const ploughed = soil.clone().lerp(soilDark, (0.5 + 0.5 * Math.sin((v + 0.6 * Math.sin(u * 0.05)) * (2 * Math.PI / 0.9))) * 0.7);
    c.lerp(stage === 'young' ? C.emerald.clone().lerp(C.moss, 0.5) : stage === 'bare' ? ploughed : C.wheatDeep, smooth(-0.6, 0.2, inside) * 0.8);
    if (inOrchard(u, v)) c.lerp(C.lime, (1 - rowNear(ROWS, x, z, 1.1)) * 0.35).lerp(C.dirt, (1 - rowNear(ROWS, x, z, 1.2)) * 0.12);
    if (inNursery(u, v)) {
      const row = rowNear(NURSERY, x, z, 0.9);
      c.lerp(C.emerald, row * 0.4).lerp(C.lime, (1 - row) * 0.25);
    }
    // The fields: the sunflowers' and barley's ground deep green under them; the ploughed field in furrows (along u, a
    // ridge every 0.9 m); the hay meadow mown in pale and darker stripes, with windrows of cut hay; the lavender's and
    // the cabbages' rows on bare earth; the yard's packed earth; the garden's paths.
    const edge = (p: Plot) => smooth(-0.4, 0.6, plotInside(p, u, v));
    // Out of summer (#13): the sunflowers sown on bare earth in spring and ploughed in after them in winter; the barley
    // cut to stubble in autumn and ploughed in winter; the ploughed field drilled and green in spring.
    if (stage === 'ripe') c.lerp(C.emerald.clone().lerp(C.moss, 0.5), Math.max(edge(SUNFLOWERS), edge(BARLEY) * 0.6) * 0.7);
    else {
      c.lerp(stage === 'stubble' ? C.emerald.clone().lerp(C.moss, 0.5) : ploughed, edge(SUNFLOWERS) * 0.9);
      c.lerp(stage === 'young' ? C.emerald.clone().lerp(C.moss, 0.5) : stage === 'stubble' ? C.wheatDeep : ploughed, edge(BARLEY) * 0.85);
    }
    c.lerp(ploughed, edge(PLOUGHED) * 0.95);
    if (stage === 'young') c.lerp(C.meadow.clone().lerp(C.moss, 0.4), edge(PLOUGHED) * (0.5 + 0.3 * Math.sin(u * (2 * Math.PI / 0.9))));
    const stripe = Math.sin((u + 1.5 * Math.sin(v * 0.08)) * (2 * Math.PI / 7)) > 0 ? 1 : 0;
    const windrow = Math.exp(-(((((u + 1.5 * Math.sin(v * 0.08)) % 7 + 7) % 7 - 3.5) / 0.45) ** 2));
    if (SEASON === 'summer') c.lerp(mown.clone().lerp(C.meadow, stripe * 0.5), edge(HAY) * 0.6).lerp(hay, edge(HAY) * windrow * 0.75);
    const rows = 0.5 + 0.5 * Math.cos(v * (2 * Math.PI / 1.7));
    c.lerp(soil.clone().lerp(C.moss, 0.25 + rows * 0.3), edge(LAVENDER) * 0.75);
    c.lerp(soil.clone().lerp(C.emerald, rows * 0.35), edge(CABBAGES) * 0.8);
    const edgeNoise = noise2(x * 0.6, z * 0.6) * 0.25 + noise2(x * 1.7 + 3, z * 1.7) * 0.1;
    c.lerp(C.dirt.clone().lerp(C.rut, 0.3 + 0.3 * k), smooth(-0.6, 0.8, plotInside(YARD, u, v) + edgeNoise * 2) * 0.85);
    c.lerp(C.dirt.clone().lerp(C.meadow, 0.35), edge(GARDEN) * 0.7);
    // Shade under the big trees stays deep.
    for (const t of TREES) if (t.scale && t.scale > 1.4 && t.kind === 'broadleaf' && Math.abs(x - t.x) < 6 && Math.abs(z - t.z) < 6) {
      c.lerp(C.teal, (1 - smooth(1.5, 5, Math.hypot(x - t.x, z - t.z))) * 0.25);
    }
    // Tracks: pale earth in the wheel ruts, a strip of grass up the middle, the edges broken by the grass growing in.
    const onPath = 1 - smooth(PATH_HALF - 0.25, PATH_HALF + 0.15, dp + edgeNoise);
    const rut = Math.exp(-(((dp - 0.5) / 0.2) ** 2));
    const mid = 1 - smooth(0.12, 0.3, dp + edgeNoise * 0.4);
    c.lerp(C.dirt.clone().lerp(C.rut, rut * 0.5).lerp(C.meadow, mid * 0.55), onPath * 0.92);
    // The shed's porch: earth worn bare under it, fading out in front, the edges broken by the grass.
    const [lx, lz] = shedLocal(x, z);
    const worn = (1 - smooth(1.7, 2.5, Math.abs(lx) + edgeNoise)) * smooth(1.2, 1.6, lz) * (1 - smooth(3.4, 4.6, lz + edgeNoise * 1.5));
    c.lerp(C.dirt.clone().lerp(C.meadow, 0.2), worn * 0.8);
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
  // The map's square: u runs along (x - z), so it's the world turned an eighth of a turn.
  r.add(fixWinding(b.build()), 'ground', { under: true, fields: { x: 0, z: 0, side: 2 * LAND, turn: Math.PI / 4 } });
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

/**
 * The water for the water map (#18): a cell a metre over the land (the map's square turned to the world's axes), as the
 * game's tiles are. Its channel is where the bed lies under the water: the streams' and the pond's. Each stream flows
 * towards its line's start (the stream into the pond, the brook out of it to the near edge); the pond barely drifts,
 * except where the stream runs into it.
 */
const POND_DRIFT: [number, number] = [Math.cos(0.6) * 0.12, Math.sin(0.6) * 0.12];
const WATER: Stream = {
  level: WATER_Y,
  grid: { nx: 250, nz: 250, cell: 1, x0: -125, z0: -125 },
  channel: (x, z) => waterDistance(x, z) < 1.6,
  along: (x, z) => {
    let best = STREAMS[0], d = Infinity;
    for (const s of STREAMS) { const ds = s.distance(x, z); if (ds < d) { d = ds; best = s; } }
    const n = best.near(x, z);
    // Into the pond, the stream's run fades over a few metres into its drift.
    const run = 1 - smooth(0, 6, -pondShore(...M(x, z)));
    return [-n.dx * run + POND_DRIFT[0] * (1 - run), -n.dz * run + POND_DRIFT[1] * (1 - run)];
  },
  land: (x, z) => { const [u, v] = M(x, z); return Math.abs(u) <= LAND && Math.abs(v) <= LAND; },
};

/**
 * A field of a crop: a painted mass laid over the field, rounded down into the ground at its edges, banded along its rows.
 * Stalks stand out of it only along its edges, if it has any.
 */
interface CropSpec {
  u0: number; u1: number; v0: number; v1: number;
  inside: (u: number, v: number) => number;
  tall: number;
  base: THREE.Color; deep: THREE.Color; tip: THREE.Color; root: THREE.Color;
  /** Rows a metre across the field, and how far the rows' bands go to the deep colour. */
  rows: number; banding: number;
  stalks: number; stalkTip?: THREE.Color; seed: number;
}
function cropField(r: Adder, s: CropSpec) {
  const b = new MeshBuilder('crop');
  const nu = Math.round((s.u1 - s.u0) / STEP) + 1, nv = Math.round((s.v1 - s.v0) / STEP) + 1;
  const tall = (u: number, v: number) => s.tall * smooth(0, 1.1, s.inside(u, v)) + 0.05 * s.tall * noise2(u * 0.5, v * 0.5) - 0.06;
  const top = (u: number, v: number) => { const [x, z] = W(u, v); return height(x, z) + tall(u, v); };
  const keep: boolean[] = [];
  const c = new THREE.Color();
  // The rows run along the field (screen right, a little curved): world angle of the map's u axis.
  const rowAngle = Math.atan2(-1, 1);
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const u = s.u0 + i * STEP, v = s.v0 + j * STEP;
    const [x, z] = W(u, v);
    const e = 0.3;
    const nrm = new THREE.Vector3(top(u - e, v) - top(u + e, v), 2 * e, top(u, v - e) - top(u, v + e));
    // That gradient is in map axes; turn it into the world's.
    const wn = new THREE.Vector3((nrm.x - nrm.z) * SQ, nrm.y, (-nrm.x - nrm.z) * SQ).normalize();
    const row = v - 0.9 * Math.sin(u * 0.07);
    const band = smooth(-0.35, 0.35, Math.sin(row * s.rows) + 0.3 * noise2(u * 0.08, v * 0.3));
    c.copy(s.base).lerp(s.deep, band * s.banding).lerp(s.tip, smooth(0.5, 0.9, noise2(u * 0.06 + 9, v * 0.09)) * 0.3)
      .lerp(s.root, (1 - smooth(0.2, 1.2, s.inside(u, v))) * 0.35);
    b.vertex({ x, y: top(u, v), z }, wn, c, [0.5, 1.3, rowAngle, 0]);
    keep.push(s.inside(u, v) > -0.5);
  }
  for (let j = 0; j < nv - 1; j++) for (let i = 0; i < nu - 1; i++) {
    const a = j * nu + i;
    if (keep[a] || keep[a + 1] || keep[a + nu] || keep[a + nu + 1]) b.quad(a, a + 1, a + nu + 1, a + nu);
  }
  r.add(fixWinding(b.build()), 'crop');
  if (!s.stalks) return;

  // Stalks along the edge, to break it.
  const g = new MeshBuilder('grass');
  const rand = rng(s.seed);
  const up = new THREE.Vector3(0, 1, 0);
  for (let k = 0, placed = 0; placed < s.stalks && k < s.stalks * 16; k++) {
    const u = s.u0 + rand() * (s.u1 - s.u0), v = s.v0 + rand() * (s.v1 - s.v0);
    const inside = s.inside(u, v);
    if (inside < 0.05 || inside > 1.3 || !onLand(u, v)) continue;
    placed++;
    const [x, z] = W(u, v);
    const y = height(x, z), h = (0.45 + smooth(0, 1.1, inside) * 0.45 + rand() * 0.15) * s.tall / 0.8;
    const lean = (rand() - 0.5) * 0.12, dir = rand() * Math.PI, seed = rand();
    const ox = Math.cos(dir) * 0.026, oz = Math.sin(dir) * 0.026;
    const paint: Paint = [0.5, 1.4, 0.4, 0.8];
    const tip = new THREE.Vector3(x + lean, y + h, z + lean * 0.5);
    const root = s.root.clone(), gold = (s.stalkTip ?? s.tip).clone().lerp(s.deep, rand() * 0.6);
    const a = g.vertex({ x: x - ox, y, z: z - oz }, up, root, paint, [0, 0], [0, seed, -0.026, dir]);
    const bb = g.vertex({ x: x + ox, y, z: z + oz }, up, root, paint, [0, 0], [0, seed, 0.026, dir]);
    const c2 = g.vertex({ x: tip.x + ox * 0.6, y: tip.y - 0.16, z: tip.z + oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed, 0.026 * 0.6, dir]);
    const d2 = g.vertex({ x: tip.x - ox * 0.6, y: tip.y - 0.16, z: tip.z - oz * 0.6 }, up, root.clone().lerp(gold, 0.7), paint, [0, 0], [0.8, seed, -0.026 * 0.6, dir]);
    g.quad(a, bb, c2, d2);
    const e1 = g.vertex({ x: tip.x - ox * 2.2, y: tip.y - 0.06, z: tip.z - oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed, -0.026 * 2.2, dir]);
    const e2 = g.vertex({ x: tip.x + ox * 2.2, y: tip.y - 0.06, z: tip.z + oz * 2.2 }, up, gold, paint, [0, 0], [0.9, seed, 0.026 * 2.2, dir]);
    const e3 = g.vertex({ x: tip.x + lean * 0.3, y: tip.y + 0.12, z: tip.z }, up, gold, paint, [0, 0], [1, seed]);
    g.tri(d2, c2, e2); g.tri(d2, e2, e3); g.tri(d2, e3, e1);
  }
  r.add(g.build(), 'grass', { castShadow: false, seasonal: false });
}

/**
 * The crops: the old farm's wheat (harvest-ready, gold, in long bands), green barley on the back slope, and sunflowers: a
 * deep green mass of leaves with their heads standing on it in rows, turned to the morning. The lavender and the cabbages
 * are clumps in rows (see beds).
 */
function crops(r: Adder) {
  const stage = STAGE[SEASON];
  // Out of summer (#13): young green blades in spring, a short stubble of straw in autumn, nothing in winter (ploughed).
  const young = { base: srgb(0x7cb04a), deep: srgb(0x5a9442), tip: srgb(0xa8c860), root: srgb(0x4e7e38), stalkTip: srgb(0x9cc45a) };
  const stubble = { base: srgb(0xe0c47a), deep: srgb(0xb89048), tip: srgb(0xeedc9c), root: srgb(0xa08a4a), stalks: 0, banding: 0.9 };
  if (stage !== 'bare') cropField(r, {
    u0: WHEAT_LEFT - 1, u1: CORE, v0: 4, v1: CORE, inside: wheatInside, tall: 0.8,
    base: C.wheat, deep: C.wheatDeep, tip: C.wheatTip, root: C.wheatRoot, rows: 1.7, banding: 0.7, stalks: 2600, seed: 5,
    ...(stage === 'young' ? { ...young, tall: 0.4, stalks: 1400 } : stage === 'stubble' ? { ...stubble, tall: 0.14 } : {}),
  });
  if (stage !== 'bare') cropField(r, {
    ...BARLEY, u0: BARLEY.u0 - 1, u1: BARLEY.u1 + 1, v0: BARLEY.v0 - 1, v1: BARLEY.v1 + 1, inside: (u, v) => plotInside(BARLEY, u, v), tall: 0.7,
    base: srgb(0x9cbc4a), deep: srgb(0x6e9a3e), tip: srgb(0xd2d070), root: srgb(0x5e8a3a), rows: 2.2, banding: 0.5, stalks: 1800,
    stalkTip: srgb(0xc8cc6a), seed: 6,
    ...(stage === 'young' ? { ...young, tall: 0.35, stalks: 1000 } : stage === 'stubble' ? { ...stubble, tall: 0.12 } : {}),
  });
  // The sunflowers: in flower in summer, gone over in autumn (the petals dropped, the heads dark and hung), not yet sown in
  // spring and ploughed in by winter.
  if (stage === 'young' || stage === 'bare') return;
  const over = stage === 'stubble';
  const SUN = SUNFLOWERS;
  const inside = (u: number, v: number) => plotInside(SUN, u, v);
  cropField(r, {
    u0: SUN.u0 - 1, u1: SUN.u1 + 1, v0: SUN.v0 - 1, v1: SUN.v1 + 1, inside, tall: 1.35,
    base: srgb(0x4e8a3a), deep: srgb(0x2f6a3a), tip: srgb(0x7aa83e), root: srgb(0x3e6e36), rows: 3.6, banding: 0.6, stalks: 0, seed: 7,
    ...(over ? { base: srgb(0x7a7040), deep: srgb(0x4e4a2c), tip: srgb(0x9a8a50), root: srgb(0x50502e) } : {}),
  });
  // The heads: a ring of yellow petals round a dark brown disc, each a dab, in rows 0.75 m apart, a head every 0.55 m.
  const heads = new MeshBuilder('foliage');
  const rand = rng(171);
  const petal = srgb(0xf6c234), disc = srgb(over ? 0x4a3020 : 0x6a4026), leaf = srgb(over ? 0x8a7a44 : 0x5a9a3c);
  for (let v = SUN.v0 + 0.6; v < SUN.v1; v += 0.75) for (let u = SUN.u0 + 0.4 + (rand() - 0.5) * 0.3; u < SUN.u1; u += 0.55 + (rand() - 0.5) * 0.12) {
    const uu = u + (rand() - 0.5) * 0.15, vv = v + (rand() - 0.5) * 0.12, d = inside(uu, vv);
    if (d < 0.3) continue;
    const [x, z] = W(uu, vv), h = height(x, z) + 1.35 * smooth(0, 1.1, d) + 0.15 + rand() * 0.25;
    // Turned to the morning: a little towards -u and up.
    const [nx, nz] = W(-0.4, -0.5), nrm = new THREE.Vector3(nx, over ? -0.1 : 0.8, nz).normalize();
    const p = new THREE.Vector3(x, h, z);
    if (rand() < 0.3) addDabAt(heads, p.clone().add(new THREE.Vector3(0, -0.2, 0)), nrm, leaf.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.08), 0.2, rand());
    const petalColour = petal.clone().offsetHSL((rand() - 0.5) * 0.02, 0, (rand() - 0.5) * 0.08), size = 0.17 + rand() * 0.04, seed = rand();
    if (!over) addDabAt(heads, p, nrm, petalColour, size, seed);
    addDabAt(heads, p.clone().add(new THREE.Vector3(0, 0.02, 0)), nrm, disc.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06), (0.075 + rand() * 0.02) * (over ? 1.4 : 1), rand());
  }
  r.add(heads.build(), 'foliage', { castShadow: true, cover: 'none' });
}

function addDabAt(b: MeshBuilder, p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, size: number, seed: number) {
  const i0 = b.vertex(p, n, c, [0.2, 1, -1, 0.5], [0, 0], [-1, -1, size, seed]);
  b.vertex(p, n, c, [0.2, 1, -1, 0.5], [0, 0], [1, -1, size, seed]);
  b.vertex(p, n, c, [0.2, 1, -1, 0.5], [0, 0], [1, 1, size, seed]);
  b.vertex(p, n, c, [0.2, 1, -1, 0.5], [0, 0], [-1, 1, size, seed]);
  b.quad(i0, i0 + 1, i0 + 2, i0 + 3);
}

/** The solar array: panels on single posts standing out of the wheat, turned to the noon sun. Inked. */
function panels(r: Adder) {
  const b = new MeshBuilder('ink');
  // Tilted less than the camera looks down (30°), the glass shows from every view; facing along the map's axis (towards +z,
  // the noon sun's side), no view is ever straight behind a panel: from the worst one it is still a quarter of its face.
  const tilt = THREE.MathUtils.degToRad(22);
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, 0, 0, 'YXZ'));
  const paint: Paint = [1, 8, 4, 0];
  const Wp = 4.0, Dp = 2.3;
  for (const [u, v] of PANELS) {
    const [x, z] = W(u, v);
    const y0 = height(x, z);
    const center = new THREE.Vector3(x, y0 + 1.6, z);
    const frame = new THREE.Matrix4().compose(center, q, new THREE.Vector3(1, 1, 1));
    b.addGeometry(new THREE.BoxGeometry(Wp, 0.1, Dp), frame, C.ceramic, [0, 1, 0, 0]);
    const nUp = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    const corner = (cu: number, cv: number) => new THREE.Vector3(cu * (Wp / 2 - 0.07), 0.055, cv * (Dp / 2 - 0.07)).applyMatrix4(frame);
    const g0 = b.vertex(corner(-1, -1), nUp, C.glass, paint, [0, 0]);
    const g1 = b.vertex(corner(1, -1), nUp, C.glass, paint, [1, 0]);
    const g2 = b.vertex(corner(1, 1), nUp, C.glass, paint, [1, 1]);
    const g3 = b.vertex(corner(-1, 1), nUp, C.glass, paint, [0, 1]);
    b.quad(g0, g3, g2, g1);
    // Two brass posts and a cross-beam under the frame.
    for (const side of [-1, 1]) {
      const px = x + side * Wp * 0.3;
      b.addGeometry(new THREE.CylinderGeometry(0.07, 0.09, 1.6, 8), new THREE.Matrix4().makeTranslation(px, y0 + 0.78, z), C.brass, [0, 1, 0, 0]);
    }
    b.addGeometry(new THREE.BoxGeometry(Wp * 0.75, 0.09, 0.12), new THREE.Matrix4().makeTranslation(x, y0 + 1.48, z), C.brass, [0, 1, 0, 0]);
  }
  r.add(b.build(), 'ink');
}

/**
 * Fences, inked: split-rail fences of posts every couple of metres and two rails, each a little askew, along the tracks;
 * the kitchen garden's white paling fence; the hens' run.
 */
function fences(r: Adder) {
  const b = new MeshBuilder('ink');
  const rand = rng(17);
  const railFence = (posts: THREE.Vector3[], color: THREE.Color, rails: number[], postH = 1.0) => {
    for (const p of posts) {
      const h = postH + (rand() - 0.5) * 0.1;
      const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 0.08, rand() * Math.PI, (rand() - 0.5) * 0.08));
      b.addGeometry(new THREE.BoxGeometry(0.11, h, 0.11), new THREE.Matrix4().compose(p.clone().add(new THREE.Vector3(0, h / 2 - 0.1, 0)), lean,
        new THREE.Vector3(1, 1, 1)), color.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06), [0, 1, 0, 0]);
    }
    for (let i = 0; i < posts.length - 1; i++) {
      const a = posts[i], c = posts[i + 1];
      for (const yr of rails) {
        const pa = a.clone().add(new THREE.Vector3(0, yr + (rand() - 0.5) * 0.06, 0)), pc = c.clone().add(new THREE.Vector3(0, yr + (rand() - 0.5) * 0.06, 0));
        const d = pc.clone().sub(pa), len = d.length() + 0.25;
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.normalize());
        b.addGeometry(new THREE.BoxGeometry(len, 0.075, 0.055), new THREE.Matrix4().compose(pa.clone().lerp(pc, 0.5), q, new THREE.Vector3(1, 1, 1)),
          color.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.08), [0, 1, 0, 0]);
      }
    }
  };
  const run = (path: MapLine, from: number, to: number, offset: number) => {
    const posts: THREE.Vector3[] = [];
    for (let s = from; s <= to; s += 2.3 + (rand() - 0.5) * 0.3) {
      const p = path.at(s);
      const x = p.x - p.dz * offset, z = p.z + p.dx * offset;
      const [u, v] = M(x, z);
      if (!onLand(u, v, 1)) continue;
      posts.push(new THREE.Vector3(x, height(x, z), z));
    }
    railFence(posts, C.fence, [0.42, 0.78]);
  };
  const along = (path: MapLine, u: number, v: number) => path.near(...W(u, v)).along;
  // Between the track and the wheat, and along the track's left reach on the meadow side; down the far side of the lower
  // fork; along the track out to the left, and on to the right past the farmstead.
  run(TRACK, along(TRACK, -11, 4), along(TRACK, 27, 8), -1.55);
  run(TRACK, along(TRACK, -36, 7), along(TRACK, -17, 5), 1.55);
  run(FORK_DOWN, along(FORK_DOWN, 19, -12.5), along(FORK_DOWN, 36, -17), 1.55);
  run(TRACK, along(TRACK, -88, 12.8), along(TRACK, -70, 11), -1.55);
  run(TRACK, along(TRACK, 72, 9), along(TRACK, 88, 6.3), -1.55);
  run(FORK_DOWN, along(FORK_DOWN, 42, -18.3), along(FORK_DOWN, 88, -22.6), -1.55);
  run(BACK_TRACK, along(BACK_TRACK, -24, 37.8), along(BACK_TRACK, 33, 37), -1.55);

  // The kitchen garden's paling fence: white posts, two rails, a paling every 15 cm, a gap for a gate facing the yard.
  const white = srgb(0xeee6d2);
  const corners: [number, number][] = [[GARDEN.u0, GARDEN.v0], [GARDEN.u1, GARDEN.v0], [GARDEN.u1, GARDEN.v1], [GARDEN.u0, GARDEN.v1]];
  for (let side = 0; side < 4; side++) {
    const [ua, va] = corners[side], [ub, vb] = corners[(side + 1) % 4], len = Math.hypot(ub - ua, vb - va);
    const posts: THREE.Vector3[] = [];
    for (let s = 0; s <= len + 0.01; s += 2) {
      const t = s / len, u = ua + (ub - ua) * t, v = va + (vb - va) * t;
      // The gate: in the top side (towards the yard), over the farm lane's line.
      if (side === 2 && Math.abs(u - 60.5) < 1.1) continue;
      const [x, z] = W(u, v);
      posts.push(new THREE.Vector3(x, height(x, z), z));
    }
    const yaw = Math.atan2(-((W(ub, vb)[1]) - W(ua, va)[1]), W(ub, vb)[0] - W(ua, va)[0]);
    for (let i = 0; i < posts.length - 1; i++) {
      const a = posts[i], c = posts[i + 1];
      if (a.distanceTo(c) > 2.5) continue;
      railFence([a, c], white, [0.25, 0.7], 1.05);
      for (let t = 0.07; t < 1; t += 0.15 / a.distanceTo(c)) {
        const p = a.clone().lerp(c, t);
        b.addGeometry(new THREE.BoxGeometry(0.08, 0.85, 0.035), new THREE.Matrix4().compose(p.add(new THREE.Vector3(0, 0.42, 0)),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)), new THREE.Vector3(1, 1, 1)), white.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.04), [0, 1, 0, 0]);
      }
    }
  }
  // The hens' run: a ring of posts with two rails round the hen house, on the yard's side.
  {
    const posts: THREE.Vector3[] = [];
    const cu = 72.5, cv = 8, ru = 3.4, rv = 3.2;
    for (let k = 0; k <= 10; k++) {
      const a = (k / 10) * Math.PI * 2;
      const [x, z] = W(cu + Math.cos(a) * ru, cv + Math.sin(a) * rv);
      posts.push(new THREE.Vector3(x, height(x, z), z));
    }
    railFence(posts, C.fence.clone().lerp(C.timber, 0.3), [0.25, 0.55, 0.85], 0.95);
  }
  r.add(b.build(), 'ink');
}

/** Plank bridges where the lane and the left track cross the stream, and the pond's jetty. Inked timber. */
function bridges(r: Adder) {
  const b = new MeshBuilder('ink');
  const rand = rng(29);
  const deckAt = (p: { x: number; z: number; dx: number; dz: number }, span: number, width: number, deck: number, posts: boolean) => {
    const yaw = Math.atan2(-p.dz, p.dx);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
    const at = (along: number, across: number, y: number) =>
      new THREE.Vector3(p.x + p.dx * along - p.dz * across, y, p.z + p.dz * along + p.dx * across);
    for (let a = -span / 2; a < span / 2; a += 0.3) {
      const c = C.timber.clone().lerp(C.fence, 0.4).offsetHSL(0, 0, (rand() - 0.5) * 0.08);
      // Planks across the deck's direction.
      const plank = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 0.03, yaw, 0));
      b.addGeometry(new THREE.BoxGeometry(0.26, 0.07, width + (rand() - 0.5) * 0.12), new THREE.Matrix4().compose(at(a + 0.13, 0, deck), plank,
        new THREE.Vector3(1, 1, 1)), c, [0, 1, 0, 0]);
    }
    for (const side of [-1, 1]) {
      b.addGeometry(new THREE.BoxGeometry(span + 0.4, 0.2, 0.16), new THREE.Matrix4().compose(at(0, side * (width / 2 - 0.15), deck - 0.13), q,
        new THREE.Vector3(1, 1, 1)), C.bark.clone().lerp(C.fence, 0.3), [0, 1, 0, 0]);
      if (!posts) {
        // A low kerb along each side.
        b.addGeometry(new THREE.BoxGeometry(span, 0.1, 0.1), new THREE.Matrix4().compose(at(0, side * (width / 2 - 0.05), deck + 0.08), q,
          new THREE.Vector3(1, 1, 1)), C.fence, [0, 1, 0, 0]);
        continue;
      }
      // A jetty stands on posts down into the pond's bed, a little proud of the deck.
      for (let a = -span / 2 + 0.3; a <= span / 2; a += 2) {
        b.addGeometry(new THREE.BoxGeometry(0.16, 1.9, 0.16), new THREE.Matrix4().makeTranslation(...at(a, side * (width / 2 + 0.02), deck - 0.75).toArray()),
          C.bark.clone().lerp(C.fence, 0.2), [0, 1, 0, 0]);
      }
    }
  };
  // Where a path meets the stream.
  for (const path of [LANE, TRACK]) {
    let best = { d: Infinity, s: 0 };
    for (let s = 0; s < path.length; s += 0.25) { const p = path.at(s), d = STREAM.distance(p.x, p.z); if (d < best.d) best = { d, s }; }
    deckAt(path.at(best.s), 6.4 * WIDE, 2.0, WATER_Y + 0.5, false);
  }
  // The jetty.
  const [ax, az] = W(...JETTY.from), [bx, bz] = W(...JETTY.to), len = Math.hypot(bx - ax, bz - az);
  deckAt({ x: (ax + bx) / 2, z: (az + bz) / 2, dx: (bx - ax) / len, dz: (bz - az) / len }, len, JETTY.width, WATER_Y + 0.45, true);
  r.add(b.build(), 'ink');
}

function orchard(r: Adder) {
  const grove = new Grove(DRESS), stakes = new MeshBuilder('ink');
  const rand = rng(61);
  for (const row of ROWS) {
    for (let s = 0.6; s < row.length - 0.4; s += 1.5 + (rand() - 0.5) * 0.3) {
      const p = row.at(s);
      grove.grow(ground, { kind: 'bush', x: p.x, z: p.z, seed: 0, scale: 0.8 + rand() * 0.2, leaf: ORCHARD_LEAF, fruit: C.apple, fruitDensity: 3, form: 'orchard' }, rand);
      // A stake by every other bush.
      if (rand() < 0.5) {
        const x = p.x + p.dz * 0.45, z = p.z - p.dx * 0.45, y = height(x, z);
        stakes.addGeometry(new THREE.BoxGeometry(0.06, 1.1, 0.06), new THREE.Matrix4().makeTranslation(x, y + 0.45, z), C.fence, [0, 1, 0, 0]);
      }
    }
  }
  grove.addTo(r);
  r.add(stakes.build(), 'ink');
}

/** Where leaves and petals may lie: not on the water, the fields or the buildings. */
function canFall(x: number, z: number) {
  const [u, v] = M(x, z);
  return onLand(u, v, 1) && waterDistance(x, z) > 1.4 && !inPlot(u, v, 0) && wheatInside(u, v) < 0 && !nearBuilding(u, v, 1);
}

/** Places a tree may not grow: the water, the paths, the fields, the buildings, the props. */
function blockedForTrees(x: number, z: number, margin = 1) {
  const [u, v] = M(x, z);
  return !onLand(u, v, 1) || waterDistance(x, z) < 2.6 || pathDistance(x, z) < PATH_HALF + margin || inPlot(u, v, margin) ||
    wheatInside(u, v) > -1.5 || nearBuilding(u, v, 2 + margin) || clear(x, z) || inNursery(u, v) || plotInside(OLD_ORCHARD, u, v) > -1;
}

function trees(r: Adder) {
  const grove = new Grove(DRESS);
  for (const t of TREES) grove.grow(ground, t, rng(t.seed));
  // Hedges of round bushes along the upper fork and the lane's far end.
  const rand = rng(71);
  for (const [path, from, to, side] of [[FORK_UP, 2, 17, -1], [LANE, 2, 14, 1]] as const) {
    for (let s = from; s < to; s += 1.1 + rand() * 0.6) {
      const p = path.at(s), off = side * (PATH_HALF + 0.9 + rand() * 0.3);
      grove.grow(ground, { kind: 'bush', x: p.x - p.dz * off, z: p.z + p.dx * off, seed: 0, scale: 1.1 + rand() * 0.4, leaf: C.emerald, form: 'hedge' }, rand);
    }
  }
  // Thickets along the stream, with gaps where the banks open to the water.
  for (const stream of STREAMS) for (let s = 1; s < stream.length - 1; s += 1.6 + rand() * 1.4) {
    if (noise2(s * 0.12, 3) < -0.15) continue;
    const p = stream.at(s), off = (rand() < 0.5 ? -1 : 1) * (2.5 + rand() * 1.2) * WIDE;
    const x = p.x - p.dz * off, z = p.z + p.dx * off;
    const [u, v] = M(x, z);
    if (!onLand(u, v, 1) || pathDistance(x, z) < PATH_HALF + 1 || clear(x, z) || nearBuilding(u, v, 2) || waterDistance(x, z) < 2.2) continue;
    grove.grow(ground, { kind: rand() < 0.25 ? 'round' : 'bush', x, z, seed: 0, scale: 1.1 + rand() * 0.6,
      leaf: C.leaf.clone().lerp(C.deepLeaf, rand() * 0.7), form: 'thicket' }, rand);
  }
  // Clumps of shrubs out on the meadow.
  for (const [u, v] of SHRUBS) {
    for (let k = 0, n = 2 + Math.floor(rand() * 3); k < n; k++) {
      const [x, z] = W(u + (rand() - 0.5) * 2.6, v + (rand() - 0.5) * 1.8);
      if (blockedForTrees(x, z, 0.6)) continue;
      grove.grow(ground, { kind: 'bush', x, z, seed: 0, scale: 1.0 + rand() * 0.5, leaf: C.leaf.clone().lerp(C.emerald, rand()), form: 'shrub' }, rand);
    }
  }
  // Hedgerows round the fields: bushes shoulder to shoulder, a hedgerow tree every so often.
  for (const h of HEDGES) {
    for (let s = 0.5; s < h.length; s += 1.15 + rand() * 0.5) {
      const p = h.at(s), j = (rand() - 0.5) * 0.5, x = p.x - p.dz * j, z = p.z + p.dx * j;
      const [u, v] = M(x, z);
      if (!onLand(u, v, 1) || pathDistance(x, z) < PATH_HALF + 0.5 || nearBuilding(u, v, 1)) continue;
      if (rand() < 0.06) {
        grove.grow(ground, { kind: 'broadleaf', x, z, seed: 0, scale: 1.1 + rand() * 0.5, leaf: C.leaf.clone().lerp(C.deepLeaf, 0.2 + rand() * 0.5), form: 'hedge' }, rand);
      } else {
        grove.grow(ground, { kind: 'bush', x, z, seed: 0, scale: 1.15 + rand() * 0.45,
          leaf: C.emerald.clone().lerp(C.deepLeaf, rand() * 0.6).lerp(C.leaf, rand() * 0.3), form: 'hedge' }, rand);
      }
    }
  }
  // Woods along the edges of the valley: the ridge at the back, thinner down the sides and along the near edge, in clumps
  // with glades between; mostly broadleaves of several greens, some cypresses and round trees.
  const woodLeaves = [C.leaf, C.deepLeaf, C.emerald.clone().lerp(C.deepLeaf, 0.4), C.leaf.clone().lerp(C.teal, 0.3), C.leafLight.clone().lerp(C.deepLeaf, 0.5)];
  for (let v = -LAND + 2; v < LAND - 1; v += 4.2) for (let u = -LAND + 2; u < LAND - 1; u += 4.2) {
    const uu = u + (rand() - 0.5) * 3.5, vv = v + (rand() - 0.5) * 3.5;
    // How much a place is woodland: the back ridge, the corners, the far sides, the near edge.
    const wood01 = Math.max(smooth(70, 76, vv), smooth(-80, -86, vv) * 0.7, smooth(79, 85, uu) * 0.85, smooth(-80, -86, uu) * 0.8,
      smooth(36, 46, vv) * smooth(-58, -68, uu));
    const clump = noise2(uu * 0.06 + 17, vv * 0.06 - 5) * 0.5 + 0.5;
    if (rand() > wood01 * (0.35 + 0.75 * clump)) continue;
    const [x, z] = W(uu, vv);
    if (blockedForTrees(x, z, 1)) continue;
    const pick = rand();
    const kind: Tree['kind'] = pick < 0.14 ? 'cypress' : pick < 0.3 ? 'round' : 'broadleaf';
    const scale = kind === 'cypress' ? 1.2 + rand() * 0.5 : kind === 'round' ? 1.1 + rand() * 0.4 : 1.3 + rand() * 0.8;
    const t: Tree = { kind, x, z, seed: 0, scale, leaf: kind === 'cypress' ? C.cypress : woodLeaves[Math.floor(rand() * woodLeaves.length)], form: 'wood' };
    TREES_GROWN.push(t);
    grove.grow(ground, t, rand);
  }
  grove.addTo(r);
}
/** Trees grown by chance (the woods), for the wind. */
const TREES_GROWN: Tree[] = [];

/** Places kept open: the crates, the table, the bales, the hives. */
function clear(x: number, z: number) {
  const [u, v] = M(x, z);
  return [...[...CRATES, ...EMPTY_CRATES, BARROW, ...balesNow()].map(([cu, cv]) => [cu, cv]), ...BASKETS, ...HIVES, ...BARRELS, TABLE]
    .some(([cu, cv]) => Math.hypot(u - cu, v - cv) < 2.2);
}

function nursery(r: Adder) {
  const grove = new Grove(DRESS);
  const rand = rng(83);
  for (const row of NURSERY) {
    for (let s = 0.8; s < row.length; s += 1.9) {
      const p = row.at(s);
      grove.grow(ground, { kind: 'round', x: p.x, z: p.z, seed: 0, scale: 0.7 + rand() * 0.15,
        leaf: C.leaf.clone().lerp(C.emerald, rand() * 0.5), form: 'sapling' }, rand);
    }
  }
  grove.addTo(r);
}

/**
 * Plants in rows that are clumps rather than a mass: the lavender (round purple cushions), the cabbages (blue-green
 * heads), and the kitchen garden's raised beds (inked timber frames) of greens, cabbages and staked tomatoes.
 */
function beds(r: Adder) {
  const leaves = new MeshBuilder('foliage'), frames = new MeshBuilder('ink');
  const rand = rng(131);
  const at = (u: number, v: number) => { const [x, z] = W(u, v); return { x, z, y: height(x, z) }; };
  // Lavender: rows 1.7 m apart along u, a cushion every 0.9 m, purple going blue in the hollows, grey-green at the foot.
  const lav = srgb(0x9a78c8), lavDeep = srgb(0x6a58a8), lavFoot = srgb(0x7a9070);
  // In flower only in summer (#13): out of it, grey-green cushions, budding in spring, the spent spikes a faded grey-mauve
  // in autumn.
  if (SEASON !== 'summer') {
    const leaf = srgb(0x8a9c86), faded = SEASON === 'spring' ? lav : SEASON === 'autumn' ? srgb(0x9a8e9c) : leaf;
    const k = SEASON === 'spring' ? 0.15 : SEASON === 'autumn' ? 0.45 : 0;
    lav.copy(leaf).lerp(faded, k); lavDeep.copy(srgb(0x667a6c)).lerp(faded, k * 0.5);
  }
  for (let v = LAVENDER.v0 + 1; v < LAVENDER.v1; v += 1.7) for (let u = LAVENDER.u0 + 0.6; u < LAVENDER.u1; u += 0.9 + (rand() - 0.5) * 0.1) {
    if (plotInside(LAVENDER, u, v) < 0.3) continue;
    const p = at(u + (rand() - 0.5) * 0.1, v);
    addMound(leaves, p.x, p.y, p.z, 0.5 + rand() * 0.08, 0.5 + rand() * 0.08, lav.clone().lerp(lavDeep, rand() * 0.5), lavFoot, 26, rand);
  }
  // Cabbages: rows 0.9 m apart, a head every 0.6 m.
  const cab = srgb(0x7aa890), cabDeep = srgb(0x4a7a6a);
  for (let v = CABBAGES.v0 + 0.6; v < CABBAGES.v1; v += 0.9) for (let u = CABBAGES.u0 + 0.5; u < CABBAGES.u1; u += 0.6 + (rand() - 0.5) * 0.06) {
    if (plotInside(CABBAGES, u, v) < 0.3) continue;
    const p = at(u + (rand() - 0.5) * 0.08, v + (rand() - 0.5) * 0.08);
    addMound(leaves, p.x, p.y, p.z, 0.3 + rand() * 0.05, 0.28, cab.clone().lerp(cabDeep, rand() * 0.4), cabDeep, 10, rand);
  }
  // The kitchen garden: two rows of raised beds, 1.2 m wide and 5 long, behind the glasshouse and below it.
  const timber = C.timber.clone().lerp(C.fence, 0.5);
  const greens = [srgb(0x6aa84a), srgb(0x4a8a5a), srgb(0x8ab84a), srgb(0x5a9a7a)];
  const bedsAt: [number, number][] = [];
  for (let k = 0; k < 4; k++) { bedsAt.push([58.5 + k * 5.4, -13.5]); bedsAt.push([58.5 + k * 5.4, -10.3]); }
  bedsAt.push([59, -5.5], [59, -2.7]);
  bedsAt.forEach(([u, v], i) => {
    const p = at(u, v), yaw = Math.PI / 4 + Math.PI / 2 * 0;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
    // The frame: four boards on edge, the soil inside.
    for (const [lx, lz, sx, sz] of [[0, -0.6, 5, 0.08], [0, 0.6, 5, 0.08], [-2.5, 0, 0.08, 1.28], [2.5, 0, 0.08, 1.28]] as const) {
      const o = new THREE.Vector3(lx, 0, lz).applyQuaternion(q);
      frames.addGeometry(new THREE.BoxGeometry(sx, 0.32, sz), new THREE.Matrix4().compose(new THREE.Vector3(p.x + o.x, p.y + 0.12, p.z + o.z), q,
        new THREE.Vector3(1, 1, 1)), timber.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06), [2, 1, 0, 0]);
    }
    frames.addGeometry(new THREE.BoxGeometry(4.92, 0.05, 1.12), new THREE.Matrix4().compose(new THREE.Vector3(p.x, p.y + 0.24, p.z), q,
      new THREE.Vector3(1, 1, 1)), C.soil.clone().multiplyScalar(0.8), [0, 1, 0, 0]);
    const kind = i % 4;
    for (let a = -2.2; a <= 2.2; a += kind === 1 ? 0.55 : 0.4) for (const b of kind === 3 ? [0] : [-0.28, 0.28]) {
      const o = new THREE.Vector3(a, 0, b).applyQuaternion(q), x = p.x + o.x, z = p.z + o.z;
      if (kind === 3) {
        // Tomatoes on canes: a cane, the plant a tall clump on it, red fruit.
        frames.addGeometry(new THREE.BoxGeometry(0.035, 1.3, 0.035), new THREE.Matrix4().makeTranslation(x, p.y + 0.85, z), C.fence, [0, 1, 0, 0]);
        // The tomatoes are summer's and autumn's; the canes stand bare the rest of the year (#13).
        if (SEASON === 'summer' || SEASON === 'autumn') addMound(leaves, x, p.y + 0.3, z, 0.25, 0.95, srgb(0x4e8a3a), srgb(0x3e6e36), 16, rand, C.apple);
      } else {
        const g = greens[(kind + Math.floor(rand() * 2)) % greens.length];
        addMound(leaves, x, p.y + 0.24, z, kind === 1 ? 0.27 : 0.2, kind === 1 ? 0.26 : 0.22, g.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06), g.clone().multiplyScalar(0.75), 9, rand);
      }
    }
  });
  // Their leaves take the season's colour (#13), as the grass does.
  r.add(leaves.build(), 'foliage', { cover: 'none', seasonal: true });
  r.add(frames.build(), 'ink');
}

/** Crates of apples by the orchard, a picnic table under the big trees, beehives, bales and barrels. Inked. */
function goods(r: Adder) {
  const b = new MeshBuilder('ink');
  const rand = rng(97);
  const box = (sx: number, sy: number, sz: number, at: THREE.Vector3, yaw: number, c: THREE.Color) =>
    b.addGeometry(new THREE.BoxGeometry(sx, sy, sz), new THREE.Matrix4().compose(at, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)),
      new THREE.Vector3(1, 1, 1)), c, [0, 1, 0, 0]);
  /** A point in a prop's own frame (x along it, z across, y up), placed at map (u, v) and turned by yaw. */
  const frameAt = (u: number, v: number, yaw: number) => {
    const [x, z] = W(u, v), y = height(x, z);
    return (lx: number, ly: number, lz: number) =>
      new THREE.Vector3(x + lx * Math.cos(yaw) + lz * Math.sin(yaw), y + ly, z - lx * Math.sin(yaw) + lz * Math.cos(yaw));
  };
  const ball = (r: number, p: THREE.Vector3, c: THREE.Color) =>
    b.addGeometry(new THREE.IcosahedronGeometry(r, 1), new THREE.Matrix4().makeTranslation(p.x, p.y, p.z), c, [0, 1, 0, 0]);
  const apple = () => C.apple.clone().offsetHSL((rand() - 0.5) * 0.05, 0, (rand() - 0.5) * 0.1);
  // A big orchard bin: slatted sides and a floor, apples heaped inside (or empty), at a height to stack.
  const crate = (u: number, v: number, yaw: number, full: boolean, y0 = 0) => {
    const local = frameAt(u, v, yaw), wood = C.crate.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06);
    const L = 1.4, D = 0.95, H = 0.62;
    box(L, 0.07, D, local(0, y0 + 0.05, 0), yaw, wood);
    for (const [lx, lz, sx, sz] of [[0, -D / 2, L, 0.06], [0, D / 2, L, 0.06], [-L / 2, 0, 0.06, D], [L / 2, 0, 0.06, D]] as const) {
      for (let ly = 0.14; ly < H; ly += 0.2) box(sx, 0.15, sz, local(lx, y0 + ly, lz), yaw, wood);
    }
    for (const lx of [-L / 2, L / 2]) for (const lz of [-D / 2, D / 2]) box(0.1, H, 0.1, local(lx, y0 + H / 2, lz), yaw, wood.clone().multiplyScalar(0.85));
    if (!full) return;
    box(L - 0.1, H - 0.2, D - 0.1, local(0, y0 + (H - 0.1) / 2, 0), yaw, C.apple.clone().multiplyScalar(0.7));
    for (let i = 0; i < 34; i++) ball(0.085, local((rand() - 0.5) * (L - 0.2), y0 + H - 0.05 + rand() * 0.08, (rand() - 0.5) * (D - 0.2)), apple());
  };
  for (const [u, v, yaw] of CRATES) crate(u, v, yaw, true);
  for (const [u, v, yaw] of EMPTY_CRATES) { crate(u, v, yaw, false); crate(u, v, yaw + 0.08, false, 0.66); }
  // Wicker baskets of apples: an eight-sided tub, a rim, a heap.
  for (const [u, v] of BASKETS) {
    const local = frameAt(u, v, rand() * 3);
    const [x, , z] = local(0, 0, 0).toArray(), y = height(x, z);
    b.addGeometry(new THREE.CylinderGeometry(0.34, 0.26, 0.32, 8, 1, true), new THREE.Matrix4().makeTranslation(x, y + 0.16, z), C.timber, [2, 1, 0, 0]);
    b.addGeometry(new THREE.TorusGeometry(0.34, 0.035, 4, 12), new THREE.Matrix4().makeRotationX(Math.PI / 2).setPosition(x, y + 0.32, z), C.timber.clone().multiplyScalar(0.8), [0, 1, 0, 0]);
    b.addGeometry(new THREE.CylinderGeometry(0.3, 0.28, 0.06, 8), new THREE.Matrix4().makeTranslation(x, y + 0.27, z), C.apple.clone().multiplyScalar(0.7), [0, 1, 0, 0]);
    for (let i = 0; i < 9; i++) { const a = rand() * 6.28, d = rand() * 0.22; ball(0.075, new THREE.Vector3(x + Math.cos(a) * d, y + 0.33 + rand() * 0.06, z + Math.sin(a) * d), apple()); }
  }
  // A wheelbarrow, its tray half full of apples, resting on its legs.
  {
    const [u, v, yaw] = BARROW, local = frameAt(u, v, yaw), green = srgb(0x4f8a6a);
    box(1.1, 0.08, 0.7, local(0, 0.42, 0), yaw, green);
    for (const lz of [-0.35, 0.35]) box(1.1, 0.26, 0.05, local(0, 0.55, lz), yaw, green);
    for (const lx of [-0.55, 0.55]) box(0.05, 0.26, 0.7, local(lx, 0.55, 0), yaw, green);
    for (const lz of [-0.22, 0.22]) {
      box(1.9, 0.06, 0.06, local(-0.25, 0.38, lz), yaw, C.timber);
      box(0.06, 0.38, 0.06, local(-0.5, 0.19, lz), yaw, C.timber);
    }
    b.addGeometry(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12).rotateX(Math.PI / 2).rotateY(yaw), new THREE.Matrix4().makeTranslation(...local(0.75, 0.24, 0).toArray()), C.bark, [0, 1, 0, 0]);
    for (let i = 0; i < 10; i++) ball(0.08, local((rand() - 0.5) * 0.8, 0.56 + rand() * 0.05, (rand() - 0.5) * 0.45), apple());
  }
  // Beehives in rows by the flowers and the lavender: stacked boxes in faded pastels under a pitched lid, on a low stand.
  const hiveColors = [srgb(0xf2e2b8), srgb(0x9cc8d8), srgb(0xf0b8a0), srgb(0xc8d89a)];
  HIVES.forEach(([u, v], i) => {
    const local = frameAt(u, v, 0.8 + (rand() - 0.5) * 0.2), yaw = 0.8, c = hiveColors[i % hiveColors.length];
    box(0.62, 0.2, 0.62, local(0, 0.1, 0), yaw, C.timber.clone().multiplyScalar(0.8));
    for (let k = 0; k < 2 + (i % 2); k++) box(0.55, 0.26, 0.55, local(0, 0.33 + k * 0.27, 0), yaw, c.clone().offsetHSL(0, 0, (k % 2) * 0.04));
    const top = 0.33 + (2 + (i % 2)) * 0.27 - 0.08;
    b.addGeometry(new THREE.ConeGeometry(0.48, 0.18, 4, 1).rotateY(Math.PI / 4 + yaw), new THREE.Matrix4().makeTranslation(...local(0, top + 0.09, 0).toArray()), C.ceramic, [0, 1, 0, 0]);
  });
  // Round hay bales, lying on their sides on the cut meadow.
  for (const [u, v, yaw] of balesNow()) {
    const local = frameAt(u, v, yaw), r = 0.62, hay = srgb(0xe2bf6a).offsetHSL((rand() - 0.5) * 0.02, 0, (rand() - 0.5) * 0.06);
    b.addGeometry(new THREE.CylinderGeometry(r, r, 1.15, 18).rotateX(Math.PI / 2).rotateY(yaw), new THREE.Matrix4().makeTranslation(...local(0, r - 0.05, 0).toArray()), hay, [2, 1, 0, 0]);
  }
  // Water barrels by the table and in the yard.
  for (const [u, v] of BARRELS) {
    const local = frameAt(u, v, 0), p = local(0, 0, 0);
    b.addGeometry(new THREE.CylinderGeometry(0.3, 0.3, 0.85, 12), new THREE.Matrix4().makeTranslation(p.x, p.y + 0.42, p.z), C.crate.clone().multiplyScalar(0.9), [2, 1, 0, 0]);
    for (const h of [0.15, 0.7]) b.addGeometry(new THREE.CylinderGeometry(0.315, 0.315, 0.05, 12), new THREE.Matrix4().makeTranslation(p.x, p.y + h, p.z), C.brass.clone().multiplyScalar(0.7), [0, 1, 0, 0]);
  }
  // A stack of firewood against the farmhouse's side, and a bench at the pond.
  {
    const local = frameAt(56, 18, Math.PI / 4 + Math.PI / 2);
    for (let k = 0; k < 4; k++) for (let i = 0; i < 9 - k; i++) {
      b.addGeometry(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 7).rotateX(Math.PI / 2).rotateY(Math.PI / 4 + Math.PI / 2),
        new THREE.Matrix4().makeTranslation(...local(-0.9 + i * 0.2 + k * 0.1, 0.1 + k * 0.18, 0).toArray()), C.bark.clone().lerp(C.timber, 0.3 + rand() * 0.3), [2, 1, 0, 0]);
    }
    const bench = frameAt(-10, -44.5, Math.PI / 4 + 0.2), yaw = Math.PI / 4 + 0.2;
    box(1.6, 0.06, 0.4, bench(0, 0.45, 0), yaw, C.timber);
    for (const lx of [-0.65, 0.65]) box(0.08, 0.45, 0.36, bench(lx, 0.22, 0), yaw, C.timber.clone().multiplyScalar(0.85));
    box(1.6, 0.3, 0.05, bench(0, 0.72, -0.2), yaw, C.timber);
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

/**
 * Stones: on the stream's and the pond's beds and banks, among the cypresses, an outcrop of boulders in the hills, the
 * dry-stone walls, stepping stones on the meadow.
 */
function stones(r: Adder) {
  const b = new MeshBuilder('paint');
  const rand = rng(91);
  const bank = (count: number, from: number, to: number, size: number, spread: number) => {
    for (const stream of STREAMS) for (let i = 0; i < count * stream.length / 70; i++) {
      const p = stream.at(rand() * stream.length), off = (from + rand() * (to - from)) * WIDE;
      const side = rand() < 0.5 ? -1 : 1;
      const x = p.x - p.dz * off * side, z = p.z + p.dx * off * side, [u, v] = M(x, z);
      if (!onLand(u, v, 1) || pondShore(u, v) < 0) continue;
      addStone(b, ground, x, z, size + rand() * spread, 0.4, rand, WATER_Y);
    }
  };
  bank(170, 0, 1.5, 0.07, 0.13);
  bank(40, 1.35, 2.3, 0.18, 0.28);
  // Round the pond's shore.
  for (let i = 0; i < 120; i++) {
    const a = rand() * Math.PI * 2, k = 0.92 + rand() * 0.2;
    const u = POND.u + Math.cos(a) * POND.a * k, v = POND.v + Math.sin(a) * POND.b * k;
    const [x, z] = W(u, v);
    if (pathDistance(x, z) < PATH_HALF + 0.3) continue;
    addStone(b, ground, x, z, 0.08 + rand() * 0.2, 0.4, rand, WATER_Y);
  }
  // Rocks among the cypresses, and the outcrop in the hills: big boulders, half sunk, smaller ones round them.
  for (const [u, v, n, s] of [[-33, 10, 3, 0.3], [-29, 6.8, 3, 0.3], [-20, 8, 3, 0.3], [-34, 15, 3, 0.3], [-58, 41, 9, 0.7], [-54, 46, 6, 0.6],
    [-47, 60, 4, 0.45], [20, 74, 5, 0.6], [-70, -26, 4, 0.5]] as const) {
    for (let k = 0; k < n; k++) {
      const [x, z] = W(u + (rand() - 0.5) * (2 + n * 0.5), v + (rand() - 0.5) * (1.5 + n * 0.4));
      addStone(b, ground, x, z, s + rand() * s * 1.1, 0.35, rand);
    }
  }
  // The walls: two courses of flat stones, a capstone here and there.
  for (const wall of WALLS) for (let s = 0; s < wall.length; s += 0.42) {
    const p = wall.at(s);
    const [u, v] = M(p.x, p.z);
    if (!onLand(u, v, 0.8) || pathDistance(p.x, p.z) < PATH_HALF + 0.4 || waterDistance(p.x, p.z) < 2.2) continue;
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
  for (const stream of STREAMS) for (let c = 0; c < 90 * stream.length / 70; c++) {
    const p = stream.at(rand() * stream.length), off = (rand() < 0.5 ? -1 : 1) * (1.45 + rand() * 0.5) * WIDE;
    const x = p.x - p.dz * off, z = p.z + p.dx * off, [u, v] = M(x, z);
    if (!onLand(u, v, 1) || pondShore(u, v) < 0.5) continue;
    addReeds(reeds, ground, x, z, rand);
  }
  // Reed beds round the pond, thickest on its far side, where the stream comes in.
  for (let c = 0; c < 200; c++) {
    const a = rand() * Math.PI * 2;
    if (rand() > 0.35 + 0.65 * Math.max(0, Math.sin(a))) continue;
    const k = 0.93 + rand() * 0.12, [x, z] = W(POND.u + Math.cos(a) * POND.a * k, POND.v + Math.sin(a) * POND.b * k);
    if (pathDistance(x, z) < PATH_HALF + 0.6 || waterDistance(x, z) < 1.2) continue;
    addReeds(reeds, ground, x, z, rand);
  }
  r.add(reeds.build(), 'grass', { castShadow: false });
}

/** Long grass in tufts where a scythe wouldn't reach, and wildflowers in drifts on the open meadow. */
function grass(r: Adder) {
  const g = new MeshBuilder('grass'), flowers = new MeshBuilder('foliage');
  const dropped = new MeshBuilder('grass'), droppedFlowers = new MeshBuilder('foliage');
  const rand = rng(77);
  const blocked = (x: number, z: number) => {
    const [u, v] = M(x, z);
    if (!onLand(u, v)) return true;
    return wheatInside(u, v) > -0.2 || pathDistance(x, z) < PATH_HALF - 0.1 || waterDistance(x, z) < 1.6 || inPlot(u, v, 0.2) ||
      nearBuilding(u, v, 0.3) || TREES.some((t) => Math.abs(x - t.x) < 1 && Math.abs(z - t.z) < 1 && Math.hypot(x - t.x, z - t.z) < 0.4 * (t.scale ?? 1));
  };
  const tuftColor = (x: number, z: number) => {
    const m = noise2(x * 0.07 + 11, z * 0.07 - 4) * 0.5 + 0.5;
    return C.meadow.clone().lerp(C.lime, smooth(0.45, 0.85, m) * 0.8).lerp(C.emerald, smooth(0.55, 0.9, 1 - m) * 0.7);
  };
  /** The big trees, for the grass's lushness near them, looked up by place. */
  const big = TREES.filter((t) => (t.scale ?? 1) > 0.5);
  let placed = 0;
  for (let tries = 0; placed < 46000 && tries < 900000; tries++) {
    const [x, z] = W((rand() * 2 - 1) * LAND, (rand() * 2 - 1) * LAND);
    if (blocked(x, z)) continue;
    const [u, v] = M(x, z);
    let nearTree = 0;
    for (const t of big) {
      const dx = x - t.x, dz = z - t.z, reach = 2.2 * (t.scale ?? 1);
      if (Math.abs(dx) < reach && Math.abs(dz) < reach) nearTree = Math.max(nearTree, 1 - smooth(0.4, reach, Math.hypot(dx, dz)));
    }
    const near = Math.max(
      1 - smooth(1.6, 3.4, waterDistance(x, z)),
      1 - smooth(PATH_HALF, PATH_HALF + 1.2, pathDistance(x, z)),
      1 - smooth(0.2, 1.6, -wheatInside(u, v)),
      nearTree);
    const lush = Math.min(1, Math.max(near, smooth(0.55, 0.9, noise2(x * 0.09 + 40, z * 0.09) * 0.5 + 0.5) * 0.7));
    if (rand() > lush * 0.95 + 0.04) continue;
    placed++;
    // Under the shed, into a builder that's thrown away.
    addTuft(underShed(x, z) ? dropped : g, ground, x, z, 0.18 + lush * 0.32, tuftColor(x, z), rand);
  }
  const palette = [srgb(0xf08bb0), srgb(0xf7f2e4), srgb(0xf5cf3e), srgb(0xa77ad8), srgb(0xe8574a)];
  // Thinning out from summer's to none in winter (#13).
  const drifts = { spring: 300, summer: 380, autumn: 120, winter: 0 }[SEASON];
  for (let d = 0; d < drifts; d++) {
    // Thicker round the windmill and in the pastures.
    let [cu, cv] = [(rand() * 2 - 1) * LAND, (rand() * 2 - 1) * LAND];
    if (d % 4 === 0) { cu = -40 + (rand() - 0.5) * 30; cv = 50 + (rand() - 0.5) * 24; }
    const [cx, cz] = W(cu, cv);
    addFlowers(underShed(cx, cz, 1.4) ? droppedFlowers : flowers, ground, cx, cz, palette[Math.floor(rand() * palette.length)], 6 + Math.floor(rand() * 14), rand,
      (x, z) => !blocked(x, z));
  }
  r.add(g.build(), 'grass', { castShadow: false });
  r.add(flowers.build(), 'foliage', { castShadow: false, cover: 'none' });
}

