// The cloud field (#8): how shaded each point of the ground is by the clouds overhead, from 0 (sun) to 1 (the deepest
// shade). One recipe the game and the renderer share: the game reads it for its solar panels (a panel under a cloud's
// shadow makes less power, CelestialLemon/Soil-n-Silo#198), the renderer draws it, so both see the same clouds.
//
// Plain TypeScript with no three.js, so the game can import it, and twinned in GLSL (CLOUD_GLSL) for drawing; the two
// agree to a few thousandths (tools/clouds.ts checks). What makes them agree:
// - the noise's random part is a whole-number hash, which TypeScript (Math.imul) and GLSL (uint) work out bit for bit;
// - the field repeats every PERIOD cells (a few kilometres), and the drift is taken round that period before the GPU
//   sees it, so however far the clouds have drifted, the numbers stay small enough for its 32-bit floats;
// - no sines, exponentials or powers: only + - * / and floor, which every machine works out alike.
//
// The game owns the clouds (#3): it sets the cover and the drift (where the wind aloft has carried them), and the
// renderer draws them exactly as given, never eased (decided 2026-10-31). The shapes are noise pushed about by a larger
// noise (billows and ragged edges, not round blobs), thresholded: the threshold is calibrated so the shaded share of the
// ground is the cover (30% cover shades about 30% of it), so the game's solar balance holds on average. Clouds are drawn
// much smaller than real ones (tens of metres, not kilometres), so the game's view of about 50 m shows several.

/** A cloud field's shape: the look, fixed for the game (the developer's pick, #8). */
export interface CloudShape {
  /** The size of the largest masses, metres (the noise's coarsest cell). */
  size: number;
  /** How far the masses are pushed about by a larger noise, in cells: uneven shapes rather than round blobs. */
  warp: number;
  /** Each finer layer of noise's share of the one before: more ragged edges as it rises. */
  rough: number;
  /** How far the finer layers are rounded into lobes, 0..1: the cauliflower edge of a cumulus rather than plain noise. */
  billow: number;
  /** How far in from a cloud's edge its shade deepens to full, in the noise's own spread: a soft rim, a deeper middle. */
  soft: number;
}

/** Where the clouds are: the game's. */
export interface CloudField {
  /** How much of the sky is covered, 0..1: the share of the ground in shade. */
  cover: number;
  /** How far the clouds have drifted, metres (x and z): the field is carried along by this much. */
  x: number; z: number;
  /** Picks one field of many (a level's seed): a whole number. */
  seed: number;
}

/**
 * The candidates, for the developer to choose between on the PR's preview (#8). The ones not picked go before it merges.
 */
export const CLOUD_SHAPES = {
  /** Cumulus: middling masses with rounded lobes, a soft rim. */
  a: { size: 30, warp: 0.35, rough: 0.5, billow: 0.7, soft: 0.6 },
  /** Big and soft: fewer, larger masses with broad soft edges. */
  b: { size: 48, warp: 0.4, rough: 0.5, billow: 0.6, soft: 1.0 },
  /** Broken: smaller, more ragged clouds with crisper edges. */
  c: { size: 22, warp: 0.45, rough: 0.55, billow: 0.8, soft: 0.4 },
} as const satisfies Record<string, CloudShape>;
export type CloudShapeName = keyof typeof CLOUD_SHAPES;
export const CLOUD_SHAPE: CloudShape = CLOUD_SHAPES.a;

/**
 * How fast the clouds are drawn moving, metres a second, for a wind aloft (m/s): far slower than real clouds, which
 * would race across the view, as the gusts are (WindState.driftSpeed). The game carries the drift on at this speed
 * and sends it (see CloudField), so its panels see the clouds where they're drawn. Candidates for the developer (#8).
 */
export const CLOUD_PACES = { slow: 0.06, mid: 0.12, fast: 0.2 } as const;
export type CloudPaceName = keyof typeof CLOUD_PACES;
export const cloudDriftSpeed = (windAloft: number, pace: number = CLOUD_PACES.mid) => 0.25 + pace * Math.max(0, windAloft);

/** The field repeats every PERIOD of its coarsest cells (with shape a, 7.7 km). */
export const PERIOD = 256;
const OCTAVES = 5;
const DIAG = 0.70710678;

/** A whole-number hash of a lattice point and a salt: the same 32 bits here as in CLOUD_GLSL's uint arithmetic. */
function hash(x: number, y: number, s: number) {
  let h = Math.imul(x, 0x8da6b343) ^ Math.imul(y, 0xd8163841) ^ Math.imul(s, 0xcb1ab31f);
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15; h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}
/** A layer's salt, from the seed. */
const salt = (seed: number, layer: number) => (Math.imul(seed, 0x9e3779b9) + Math.imul(layer, 0x85ebca6b)) >>> 0;
/** A whole number taken round a period, 0..p-1. */
const wrapCell = (i: number, p: number) => i - p * Math.floor(i / p);
/** A lattice point's gradient (one of eight directions) dotted with the offset to it. */
function grad(h: number, fx: number, fy: number) {
  const g = h & 7;
  if (g < 4) return g < 2 ? (g & 1 ? -fx : fx) : (g & 1 ? -fy : fy);
  return ((g & 1 ? -fx : fx) + (g & 2 ? -fy : fy)) * DIAG;
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
/** Gradient noise, about -0.7..0.7, repeating every `period` cells. */
function noise(qx: number, qy: number, period: number, s: number) {
  const ix = Math.floor(qx), iy = Math.floor(qy), fx = qx - ix, fy = qy - iy;
  const x0 = wrapCell(ix, period), y0 = wrapCell(iy, period);
  const x1 = x0 + 1 === period ? 0 : x0 + 1, y1 = y0 + 1 === period ? 0 : y0 + 1;
  const a = grad(hash(x0, y0, s), fx, fy), b = grad(hash(x1, y0, s), fx - 1, fy);
  const c = grad(hash(x0, y1, s), fx, fy - 1), d = grad(hash(x1, y1, s), fx - 1, fy - 1);
  const u = fade(fx), v = fade(fy);
  const ab = a + (b - a) * u, cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}

/** The coarse layers pushed about by the larger noise; the finer ones aren't, or they'd be dragged into streaks. */
const WARPED = 2;

/** The clouds' density at a point of the field (in cells), before the cover's threshold: about -0.7..0.7. */
function density(qx: number, qy: number, shape: CloudShape, seed: number) {
  // The masses pushed about by a noise twice their size, so they come out uneven rather than round.
  const wx = noise(qx * 0.5, qy * 0.5, PERIOD / 2, salt(seed, 8)), wy = noise(qx * 0.5, qy * 0.5, PERIOD / 2, salt(seed, 9));
  let sum = 0, norm = 0, amp = 1, f = 1, p = PERIOD;
  for (let k = 0; k < OCTAVES; k++) {
    const w = k < WARPED ? shape.warp : 0;
    let n = noise((qx + w * wx) * f, (qy + w * wy) * f, p, salt(seed, k));
    // The finer layers part rounded into lobes (high where the noise crosses zero).
    if (k > 0) n = n * (1 - shape.billow) + (0.35 - Math.abs(n)) * shape.billow;
    sum += amp * n;
    norm += amp; amp *= shape.rough; f *= 2; p *= 2;
  }
  return sum / norm;
}

/** Where a point of the ground is in the field, in cells, the drift taken round the period. */
function cellOf(x: number, z: number, field: CloudField, shape: CloudShape): [number, number] {
  const [sx, sz] = cloudShift(field, shape), k = 1 / shape.size;
  return [x * k - sx, z * k - sz];
}

/** The drift in cells, taken round the period: what the GLSL twin is given (uCloudShift). */
export function cloudShift(field: CloudField, shape: CloudShape = CLOUD_SHAPE): [number, number] {
  const k = 1 / shape.size;
  return [field.x * k - PERIOD * Math.floor((field.x * k) / PERIOD), field.z * k - PERIOD * Math.floor((field.z * k) / PERIOD)];
}

interface Calibration { soft: number; covers: Float64Array }
const calibrations = new Map<CloudShape, Calibration>();
const TABLE = 64;

/**
 * The density's spread and the threshold for each cover (in TABLE steps), so the shaded share of the ground is the cover:
 * worked out once per shape from the field itself (about 40 ms), the same way wherever it runs.
 */
function calibrate(shape: CloudShape): Calibration {
  let c = calibrations.get(shape);
  if (c) return c;
  // Points spread over more than a period, off the lattice (where the noise is always 0).
  const N = 192, values = new Float64Array(N * N);
  let lo = Infinity, hi = -Infinity, sum = 0, sq = 0;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const v = density(i * 1.6180339 + 0.31, j * 1.3247180 + 0.77, shape, 0);
    values[j * N + i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); sum += v; sq += v * v;
  }
  const n = N * N, mean = sum / n, spread = Math.sqrt(Math.max(sq / n - mean * mean, 1e-12));
  const soft = shape.soft * spread;
  // A histogram, so each guess at a threshold is quick to weigh.
  const BINS = 1024, counts = new Float64Array(BINS), width = (hi - lo) / BINS;
  for (const v of values) counts[Math.min(BINS - 1, Math.floor((v - lo) / width))]++;
  const shaded = (t: number) => {
    let s = 0;
    for (let b = 0; b < BINS; b++) s += counts[b] * smooth((lo + (b + 0.5) * width - t) / soft);
    return s / n;
  };
  const covers = new Float64Array(TABLE + 1);
  for (let i = 0; i <= TABLE; i++) {
    const want = i / TABLE;
    let a = lo - soft, b = hi;
    for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (shaded(m) > want) a = m; else b = m; }
    covers[i] = (a + b) / 2;
  }
  c = { soft, covers };
  calibrations.set(shape, c);
  return c;
}
/** 0..1 eased in and out, as GLSL's smoothstep(0, 1, x). */
function smooth(x: number) { const t = x < 0 ? 0 : x > 1 ? 1 : x; return t * t * (3 - 2 * t); }

/** No cloud anywhere, and cloud everywhere: thresholds far past the density's reach. */
const NONE = 1e4, ALL = -1e4;

/**
 * The cover's threshold on the density, and how far in from it the shade deepens to full: what the GLSL twin is given
 * (uCloudThreshold).
 */
export function cloudThreshold(cover: number, shape: CloudShape = CLOUD_SHAPE): [number, number] {
  const c = calibrate(shape);
  if (!(cover > 0)) return [NONE, c.soft];
  if (cover >= 1) return [ALL, c.soft];
  const x = cover * TABLE, i = Math.min(TABLE - 1, Math.floor(x)), f = x - i;
  return [c.covers[i] + (c.covers[i + 1] - c.covers[i]) * f, c.soft];
}

/** How shaded a point of the ground (x, z, metres) is by the clouds: 0 in the sun, 1 in the deepest shade. */
export function cloudShade(x: number, z: number, field: CloudField, shape: CloudShape = CLOUD_SHAPE): number {
  const [t, soft] = cloudThreshold(field.cover, shape);
  if (t === NONE) return 0;
  if (t === ALL) return 1;
  const [qx, qy] = cellOf(x, z, field, shape);
  return smooth((density(qx, qy, shape, seedOf(field.seed)) - t) / soft);
}

/** A seed as the GLSL twin takes it: a whole number, 0 to 2^31 - 1. */
export const seedOf = (seed: number) => (Math.floor(seed) >>> 0) & 0x7fffffff;

/**
 * The twin in GLSL: cloudShadeAt(xz), as cloudShade. Its uniforms: uCloudShape (1 / the shape's size, its warp, rough
 * and billow), uCloudShift (cloudShift), uCloudThreshold (cloudThreshold) and uCloudSeed (seedOf). Needs GLSL ES 3.
 */
export const CLOUD_GLSL = /* glsl */ `
uniform vec4 uCloudShape;
uniform vec2 uCloudShift;
uniform vec2 uCloudThreshold;
uniform int uCloudSeed;
uint cloudHash(uint x, uint y, uint s) {
  uint h = (x * 0x8da6b343u) ^ (y * 0xd8163841u) ^ (s * 0xcb1ab31fu);
  h ^= h >> 16u; h *= 0x7feb352du;
  h ^= h >> 15u; h *= 0x846ca68bu;
  h ^= h >> 16u;
  return h;
}
uint cloudSalt(int layer) { return uint(uCloudSeed) * 0x9e3779b9u + uint(layer) * 0x85ebca6bu; }
float cloudWrap(float i, float p) { return i - p * floor(i / p); }
float cloudGrad(uint h, float fx, float fy) {
  uint g = h & 7u;
  float sx = (g & 1u) != 0u ? -fx : fx;
  if (g < 4u) return g < 2u ? sx : ((g & 1u) != 0u ? -fy : fy);
  return (sx + ((g & 2u) != 0u ? -fy : fy)) * ${DIAG};
}
float cloudFade(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float cloudNoise(vec2 q, float period, uint s) {
  vec2 i = floor(q), f = q - i;
  float x0 = cloudWrap(i.x, period), y0 = cloudWrap(i.y, period);
  float x1 = x0 + 1.0 == period ? 0.0 : x0 + 1.0, y1 = y0 + 1.0 == period ? 0.0 : y0 + 1.0;
  float a = cloudGrad(cloudHash(uint(x0), uint(y0), s), f.x, f.y);
  float b = cloudGrad(cloudHash(uint(x1), uint(y0), s), f.x - 1.0, f.y);
  float c = cloudGrad(cloudHash(uint(x0), uint(y1), s), f.x, f.y - 1.0);
  float d = cloudGrad(cloudHash(uint(x1), uint(y1), s), f.x - 1.0, f.y - 1.0);
  float u = cloudFade(f.x), v = cloudFade(f.y);
  float ab = a + (b - a) * u, cd = c + (d - c) * u;
  return ab + (cd - ab) * v;
}
float cloudDensity(vec2 q) {
  vec2 w = vec2(cloudNoise(q * 0.5, ${PERIOD / 2}.0, cloudSalt(8)), cloudNoise(q * 0.5, ${PERIOD / 2}.0, cloudSalt(9)));
  float sum = 0.0, norm = 0.0, amp = 1.0, f = 1.0, period = ${PERIOD}.0;
  for (int k = 0; k < ${OCTAVES}; k++) {
    float n = cloudNoise((q + (k < ${WARPED} ? uCloudShape.y : 0.0) * w) * f, period, cloudSalt(k));
    if (k > 0) n = n * (1.0 - uCloudShape.w) + (0.35 - abs(n)) * uCloudShape.w;
    sum += amp * n;
    norm += amp; amp *= uCloudShape.z; f *= 2.0; period *= 2.0;
  }
  return sum / norm;
}
float cloudShadeAt(vec2 xz) {
  float s = clamp((cloudDensity(xz * uCloudShape.x - uCloudShift) - uCloudThreshold.x) / uCloudThreshold.y, 0.0, 1.0);
  return s * s * (3.0 - 2.0 * s);
}
`;
