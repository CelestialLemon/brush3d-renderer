import * as THREE from 'three';

// The water (#18): a state the game drives. The game owns the water (its rivers, its floods and their rules) and hands the
// renderer a map of it over the land, sent again whenever it changes; the renderer draws whatever it's given.
//
// The map is a grid of cells, the same shape as the wind's and the dust's (a corner at x0, z0; nx by nz cells of `cell`
// metres; x fastest). Each cell gives the height of the water's surface there (NaN where it's dry), and may give its flow
// and how muddy it is. A river, a pond and a flood are all the same map: a flood is the river's cells spreading over the
// land, at whatever heights the game's rules give them.
//
// How it's drawn, in plain words. The water is one sheet over the grid, each cell's corner at that cell's surface. Where
// the land rises above the sheet the land hides it, so the shore is wherever the water meets the ground, smooth however
// coarse the grid. For that the sheet has to reach a little past the last wet cell before it ends: it runs on flat for one
// cell (so the shore between two cells lies where the land really meets the water) and then dives steeply under the
// land. A changed map eases in over a moment, so a rising flood creeps over the land rather than jumping a cell at a time.

/** The water the game sends: a grid over the land (see above). */
export interface WaterMap {
  nx: number; nz: number; cell: number; x0: number; z0: number;
  /** The water's surface per cell, metres; NaN where the cell is dry. */
  level: Float32Array;
  /** Its flow per cell, m/s along x and z (none if left out: still water). */
  flowX?: Float32Array; flowZ?: Float32Array;
  /** How muddy it is per cell, 0 clear to 1 brown with silt (clear if left out). */
  mud?: Float32Array;
  /**
   * How frozen it is per cell (#14), 0 open, about 0.3 a skin and shore ice, 1 frozen over (open if left out). Inside a
   * cell the renderer freezes the banks and the slow water first; whether a cell is freezing or thawing it tells by
   * whether this rose or fell when last it changed.
   */
  ice?: Float32Array;
}

/** How far the sheet dives under the land past the flat cell beyond the last wet one, metres a cell, and at most. */
export const DIVE = 1.5, MAX_DIVE = 4;
/** The sheet is drawn over cells this many cells (Chebyshev) or fewer from water. */
export const REACH = 1;
/** The sheet isn't drawn where it has dived further than this under the water it continues (its mud below minus this). */
export const HIDDEN_DIVE = 0.15;
/**
 * The furthest under the wet surface the sheet is still drawn (with some margin): its height and mud fall together
 * between a vertex at the surface and one dived, or as water drains away, and the muddiest water (1) stays drawn the
 * deepest, at worst about a metre down (0.98 m, found by sweeping the mud, the dives and the ease).
 */
export const SHOWN_SINK = 1.25;
/** How long a changed map takes to ease in by default, seconds. */
export const WATER_EASE = 0.6;

/** The GLSL that reads the water map: its surface anywhere, and the nearest water's, for the reflection's clip. */
export const WATER_MAP_GLSL = /* glsl */ `
uniform sampler2D tWaterA;     // the water as it was (level, flow x, flow z, mud per cell)
uniform sampler2D tWaterB;     // the water as last sent
uniform float uWaterBlend;     // how far it has eased from A to B
uniform vec4 uWaterGrid;       // x0, z0, 1 / cell, 0 with no map
uniform float uWaterHigh;      // the highest the wet surface is, as it was and as last sent
vec4 waterCell(ivec2 c) {
  ivec2 n = textureSize(tWaterA, 0);
  c = clamp(c, ivec2(0), n - 1);
  return mix(texelFetch(tWaterA, c, 0), texelFetch(tWaterB, c, 0), uWaterBlend);
}
// The sheet over a point, on its own triangles (split from the +x cell to the +z one, as WaterField.index lays them):
// per cell, the surface (x), the surface it continues, before its dive (y; the same where it's wet), and its mud (z;
// how far down, negative, where it dives: the water isn't drawn below -HIDDEN_DIVE). Far below everything off the grid
// or with no map.
vec3 waterSheet(vec2 xz) {
  if (uWaterGrid.w < 0.5) return vec3(-1.0e6, -1.0e6, -1.0e6);
  vec2 g = (xz - uWaterGrid.xy) * uWaterGrid.z - 0.5;
  ivec2 n = textureSize(tWaterA, 0);
  // Off the sheet (which reaches the grid's edge, half a cell past the edge cells' centres).
  if (g.x < -0.5 || g.y < -0.5 || g.x > float(n.x) - 0.5 || g.y > float(n.y) - 0.5) return vec3(-1.0e6, -1.0e6, -1.0e6);
  vec2 i = floor(g), f = g - i;
  ivec2 c = ivec2(i);
  vec4 a = waterCell(c), b = waterCell(c + ivec2(1, 0)), d = waterCell(c + ivec2(0, 1)), e = waterCell(c + ivec2(1, 1));
  // Where it dives, its mud is how far down, negative (layWater).
  vec3 va = vec3(a.x, a.x - min(a.w, 0.0), a.w), vb = vec3(b.x, b.x - min(b.w, 0.0), b.w);
  vec3 vd = vec3(d.x, d.x - min(d.w, 0.0), d.w), ve = vec3(e.x, e.x - min(e.w, 0.0), e.w);
  return f.x + f.y < 1.0 ? va + (vb - va) * f.x + (vd - va) * f.y : ve + (vd - ve) * (1.0 - f.x) + (vb - ve) * (1.0 - f.y);
}
// The water's surface over a point, metres, as drawn.
float waterTop(vec2 xz) { return waterSheet(xz).x; }
// The surface of the water nearest a point: as drawn where it's wet, and on dry land the water it's nearest (the surface
// the sheet dives from). What the reflection leaves out is what's under it: a fence standing in a flood isn't mirrored
// below the flood, and nor is a dry hollow lower than the river beside it (mirrored, it would show in the river).
float waterNear(vec2 xz) { return waterSheet(xz).y; }
`;

/**
 * The cells laid out for the GPU: per cell its surface (wet, flat beyond, or diving), flow and mud (or, diving, how far
 * down it is, negative); and how far from water.
 */
interface Laid {
  /** RGBA per cell: level, flow x, flow z, mud. */
  data: Float32Array;
  /** Per cell: how frozen (#14); a dry cell takes the water's it continues. */
  ice: Float32Array;
  /** Per cell: how far into the water it is from the nearest dry cell, metres (0 dry), for where ice forms first (#14). */
  shore: Float32Array;
  /** Cells (Chebyshev) to the nearest wet cell, capped at 255. */
  dist: Uint8Array;
  /** The lowest and highest wet surface, and the middle one (the median), or null with no water. */
  low: number; high: number; mid: number | null;
}

/** Lays a map out for the GPU: the wet cells as sent, the dry ones continuing the nearest water's surface (see above). */
export function layWater(map: WaterMap): Laid {
  const { nx, nz, level } = map, n = nx * nz;
  if (level.length !== n) throw new Error(`water map: ${level.length} levels for ${nx} x ${nz} cells`);
  const data = new Float32Array(n * 4), dist = new Uint8Array(n).fill(255), ice = new Float32Array(n);
  /** The surface each cell continues, before its dive. */
  const source = new Float32Array(n).fill(-Infinity);
  // Breadth first from the wet cells (to all eight neighbours, so diagonal shores are as near as straight ones): each dry
  // cell takes its surface, flow and mud from the highest of the cells it's reached from. It reaches every cell (the
  // reflection's clip reads the nearest water's surface anywhere on dry land), so it's kept lean: a large map is laid out
  // each time the game sends it.
  let queue = new Int32Array(n), next = new Int32Array(n), count = 0;
  for (let i = 0; i < n; i++) {
    if (Number.isNaN(level[i])) continue;
    data[i * 4] = level[i];
    data[i * 4 + 1] = map.flowX?.[i] ?? 0; data[i * 4 + 2] = map.flowZ?.[i] ?? 0; data[i * 4 + 3] = THREE.MathUtils.clamp(map.mud?.[i] ?? 0, 0, 1);
    ice[i] = THREE.MathUtils.clamp(map.ice?.[i] ?? 0, 0, 1);
    dist[i] = 0; source[i] = level[i]; queue[count++] = i;
  }
  const wet = new Float32Array(count);
  for (let k = 0; k < count; k++) wet[k] = level[queue[k]];
  for (let d = 1; count && d < 255; d++) {
    let found = 0;
    for (let q = 0; q < count; q++) {
      const i = queue[q], x = i % nx, z = (i - x) / nx, si = source[i];
      const xa = x > 0 ? -1 : 0, xb = x < nx - 1 ? 1 : 0, za = z > 0 ? -1 : 0, zb = z < nz - 1 ? 1 : 0;
      for (let dz = za; dz <= zb; dz++) for (let dx = xa; dx <= xb; dx++) {
        const j = i + dz * nx + dx, dj = dist[j];
        if (dj < d) continue;
        if (dj === 255) { dist[j] = d; next[found++] = j; }
        if (si > source[j]) {
          source[j] = si;
          data[j * 4 + 1] = data[i * 4 + 1]; data[j * 4 + 2] = data[i * 4 + 2]; data[j * 4 + 3] = data[i * 4 + 3];
          ice[j] = ice[i];
        }
      }
    }
    [queue, next] = [next, queue]; count = found;
  }
  for (let i = 0; i < n; i++) {
    if (dist[i] === 0) continue;
    // With no water at all, the sheet lies far under everything (and isn't drawn).
    const dive = Number.isFinite(source[i]) ? Math.min(DIVE * Math.max(0, dist[i] - 1), MAX_DIVE) : MAX_DIVE;
    data[i * 4] = Number.isFinite(source[i]) ? source[i] - dive : -1000;
    // Where it dives, its mud is how far down, negative: the sheet isn't drawn once it's more than a little under the
    // water it continues (it's under the land there; at the land's edge it would show beneath it).
    if (dive > 0) data[i * 4 + 3] = -dive;
  }
  wet.sort((a, b) => a - b);
  return { data, ice, shore: shoreDistance(map), dist, low: wet[0] ?? 0, high: wet[wet.length - 1] ?? 0, mid: wet.length ? wet[wet.length >> 1] : null };
}

/**
 * The water as drawn: the map last sent, eased in from what was drawn before; its sheet (a mesh over the grid, its
 * triangles only round the water) and the textures the shaders read. The renderer owns one.
 */
export class WaterField {
  /**
   * The sheet: a vertex per cell, at the cell's centre, and a ring round them on the grid's edge (repeating the edge
   * cells), so water reaches the edge; its height comes from the textures. Null until a map is sent.
   */
  geometry: THREE.BufferGeometry | null = null;
  /** The water as it was, and as last sent (RGBA float per cell), for the shaders. */
  a = cellTexture(1, 1);
  b = cellTexture(1, 1);
  /** The ice (#14), as it was and as last sent: per cell how frozen, and whether it's thawing (1) or freezing (0). */
  iceA = cellTexture(1, 1);
  iceB = cellTexture(1, 1);
  /** Whether any of the water is frozen, as it was or as last sent. */
  iced = false;
  /** Per cell, whether the ice was falling (1: thawing) or rising (0) when last it changed. */
  private thaw = new Float32Array(1);
  /** Per cell, the furthest the game's ice has gone the way it's going (the least while thawing, the most while
   * freezing): it turns when the ice comes back from there, however small the steps it's sent in. */
  private iceTurn = new Float32Array(1);
  /** Whether any of the water as last sent is frozen (what's drawn is, too, once the ease is done). */
  private toIced = false;
  /** x0, z0, 1 / cell, 1 with a map (0 without). */
  readonly grid = new THREE.Vector4(0, 0, 1, 0);
  /** The surface the reflection is drawn about: the middle of the water as last sent. */
  mirror = 0;
  /** The lowest and highest the surface is anywhere it's drawn (diving under the banks too), as it was and as last sent. */
  low = 0; high = 0;
  /** The lowest and highest wet surface, as it was and as last sent. */
  wetLow = 0; wetHigh = 0;
  /** Whether there's any water to draw. */
  any = false;
  /** The lowest the sheet is drawn anywhere (sinking below a shore, or draining away), as it was and as last sent. */
  get shownLow() { return this.wetLow - SHOWN_SINK; }
  /** The lowest wet surface as last sent (the valley's floor, for the haze), or null with none. */
  floor: number | null = null;
  private nx = 0; private nz = 0; private cell = 1; private x0 = 0; private z0 = 0;
  private from: Laid | null = null;
  private to: Laid | null = null;
  private start = 0;
  private ease = 0;

  /** How far the water has eased from what was drawn to what was sent, at a time (seconds, the renderer's clock). */
  blend(time: number) {
    if (this.ease <= 0) return 1;
    const t = THREE.MathUtils.clamp((time - this.start) / this.ease, 0, 1);
    return t * t * (3 - 2 * t);
  }

  /** Once the ease is done: stops painting ice that has thawed away, and retires water that has drained away entirely
   * (true if it has just gone). */
  settle(time: number) {
    if (this.iced && !this.toIced && this.blend(time) >= 1) this.iced = false;
    if (!this.any || !this.to || this.to.mid !== null || this.blend(time) < 1) return false;
    this.any = false;
    return true;
  }

  /**
   * Takes a map from the game, to ease in over `ease` seconds from the water as drawn at `time` (0: at once). A map on a
   * new grid comes in at once. Null takes the water away.
   */
  set(map: WaterMap | null, time: number, ease = WATER_EASE) {
    if (!map) {
      this.any = false; this.iced = this.toIced = false; this.from = this.to = null; this.grid.w = 0; this.floor = null;
      return;
    }
    const laid = layWater(map);
    const same = this.geometry && this.to && map.nx === this.nx && map.nz === this.nz && map.cell === this.cell
      && map.x0 === this.x0 && map.z0 === this.z0;
    if (!same) {
      this.nx = map.nx; this.nz = map.nz; this.cell = map.cell; this.x0 = map.x0; this.z0 = map.z0;
      this.build();
      this.from = laid; ease = 0;
    } else {
      // What's drawn now becomes where it eases from.
      const b = this.blend(time), from = this.from!, to = this.to!, data = new Float32Array(from.data.length);
      for (let i = 0; i < data.length; i++) data[i] = from.data[i] + (to.data[i] - from.data[i]) * b;
      const dist = new Uint8Array(from.dist.length);
      for (let i = 0; i < dist.length; i++) dist[i] = b < 1 ? Math.min(from.dist[i], to.dist[i]) : to.dist[i];
      const ice = new Float32Array(from.ice.length), shore = new Float32Array(from.shore.length);
      for (let i = 0; i < ice.length; i++) ice[i] = from.ice[i] + (to.ice[i] - from.ice[i]) * b;
      for (let i = 0; i < shore.length; i++) shore[i] = from.shore[i] + (to.shore[i] - from.shore[i]) * b;
      const wet = (b < 1 ? [from, to] : [to]).filter((l) => l.mid !== null);
      this.from = {
        data, ice, shore, dist, low: Math.min(...wet.map((l) => l.low)), high: Math.max(...wet.map((l) => l.high)),
        mid: wet.length ? (to.mid ?? from.mid) : null,
      };
    }
    // Water drained away, or coming where there was none, eases to (or from) itself sunk under the land, as a drying
    // shore does: never to the depths a map with no water at all lies at.
    if (ease > 0 && laid.mid === null && this.from.mid !== null) this.to = { ...laid, data: sunk(this.from.data), shore: this.from.shore };
    else {
      if (ease > 0 && laid.mid !== null && this.from.mid === null) this.from = { ...this.from, data: sunk(laid.data) };
      this.to = laid;
    }
    this.start = time; this.ease = ease;
    this.upload(this.a, this.from.data);
    this.upload(this.b, this.to.data);
    // The ice, and which way it's going in each cell: which way the game's value has moved (not what's drawn, which may
    // still be easing the other way), turning when it comes back from the furthest it went; as before, if it hasn't
    // moved. A new grid starts freezing.
    const thaw = this.thaw, turn = this.iceTurn, fromIce = this.from.ice, toIce = this.to.ice;
    if (!same) turn.set(toIce);
    let toIced = false, fromIced = false;
    for (let i = 0; i < thaw.length; i++) {
      const v = toIce[i];
      if (thaw[i] > 0.5) { if (v > turn[i] + 1e-4) { thaw[i] = 0; turn[i] = v; } else turn[i] = Math.min(turn[i], v); }
      else if (v < turn[i] - 1e-4) { thaw[i] = 1; turn[i] = v; } else turn[i] = Math.max(turn[i], v);
      if (v > 0) toIced = true;
      if (fromIce[i] > 0) fromIced = true;
    }
    this.toIced = toIced;
    this.iced = toIced || (ease > 0 && fromIced);
    this.upload(this.iceA, iceData(fromIce, thaw, this.from.shore));
    this.upload(this.iceB, iceData(toIce, thaw, this.to.shore));
    this.grid.set(this.x0, this.z0, 1 / this.cell, 1);
    this.mirror = laid.mid ?? this.from.mid ?? 0;
    this.floor = laid.mid === null ? null : laid.low;
    this.any = laid.mid !== null || (ease > 0 && this.from.mid !== null);
    this.index();
  }

  private upload(t: THREE.DataTexture, data: Float32Array) {
    t.image.data = data;
    t.needsUpdate = true;
  }

  /**
   * The sheet's vertices: one per cell, at its centre, and the ring on the grid's edge, each carrying the cell it reads.
   * Its index has room for every square; each map fills what it needs. The textures are remade at the grid's size (the
   * GPU's storage for a texture can't change size).
   */
  private build() {
    this.geometry?.dispose();
    this.a.dispose(); this.b.dispose(); this.iceA.dispose(); this.iceB.dispose();
    const { nx, nz, cell, x0, z0 } = this, vx = nx + 2, vz = nz + 2;
    this.a = cellTexture(nx, nz); this.b = cellTexture(nx, nz);
    this.iceA = cellTexture(nx, nz); this.iceB = cellTexture(nx, nz);
    this.thaw = new Float32Array(nx * nz); this.iceTurn = new Float32Array(nx * nz);
    // Vertex i: the edge at 0 and nx + 1, else the centre of cell i - 1.
    const at = (i: number, n: number) => (i === 0 ? 0 : i === n + 1 ? n : i - 0.5);
    const pos = new Float32Array(vx * vz * 3), uv = new Float32Array(vx * vz * 2);
    for (let j = 0; j < vz; j++) for (let i = 0; i < vx; i++) {
      const k = j * vx + i;
      pos[k * 3] = x0 + at(i, nx) * cell; pos[k * 3 + 2] = z0 + at(j, nz) * cell;
      uv[k * 2] = Math.min(Math.max(i - 1, 0), nx - 1); uv[k * 2 + 1] = Math.min(Math.max(j - 1, 0), nz - 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(new THREE.BufferAttribute(new Uint32Array((vx - 1) * (vz - 1) * 6), 1).setUsage(THREE.DynamicDrawUsage));
    g.boundingBox = new THREE.Box3();
    this.geometry = g;
  }

  /** The sheet's triangles: the squares between four cells where one of them is within REACH of water, then or now. */
  private index() {
    const g = this.geometry!, { nx, nz } = this, from = this.from!.dist, to = this.to!.dist, vx = nx + 2, vz = nz + 2;
    // Whether each vertex's cell is near water.
    const near = new Uint8Array(vx * vz);
    for (let j = 0; j < vz; j++) {
      const row = Math.min(Math.max(j - 1, 0), nz - 1) * nx;
      for (let i = 0; i < vx; i++) {
        const k = row + Math.min(Math.max(i - 1, 0), nx - 1);
        near[j * vx + i] = from[k] <= REACH || to[k] <= REACH ? 1 : 0;
      }
    }
    const index = g.index!, idx = index.array as Uint32Array;
    let count = 0, x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let j = 0; j < nz + 1; j++) for (let i = 0; i < nx + 1; i++) {
      const a = j * vx + i;
      if (!(near[a] | near[a + 1] | near[a + vx] | near[a + vx + 1])) continue;
      const b = a + 1, c = a + vx, d = c + 1;
      idx[count++] = a; idx[count++] = c; idx[count++] = b; idx[count++] = b; idx[count++] = c; idx[count++] = d;
      x0 = Math.min(x0, i); x1 = Math.max(x1, i + 1); z0 = Math.min(z0, j); z1 = Math.max(z1, j + 1);
    }
    index.clearUpdateRanges();
    index.addUpdateRange(0, count);
    index.needsUpdate = true;
    g.setDrawRange(0, count);
    // Where it can be: what the renderer frames the water's passes by.
    const wet = [this.from!, this.to!].filter((l) => l.mid !== null);
    this.wetLow = Math.min(...wet.map((l) => l.low), Infinity);
    this.wetHigh = Math.max(...wet.map((l) => l.high), -Infinity);
    if (!wet.length) this.wetLow = this.wetHigh = 0;
    this.low = this.wetLow - MAX_DIVE;
    this.high = this.wetHigh;
    const box = g.boundingBox!, pos = g.attributes.position.array;
    if (count) {
      box.min.set(pos[(z0 * vx + x0) * 3], this.low, pos[(z0 * vx + x0) * 3 + 2]);
      box.max.set(pos[(z1 * vx + x1) * 3], this.high, pos[(z1 * vx + x1) * 3 + 2]);
    } else {
      box.makeEmpty();
      this.any = false;
    }
    g.boundingSphere = null;
  }
}

/** A float texture of the water's cells (RGBA per cell), read texel by texel. */
function cellTexture(nx: number, nz: number) {
  return new THREE.DataTexture(new Float32Array(nx * nz * 4), nx, nz, THREE.RGBAFormat, THREE.FloatType);
}

/** The ice's texels (RGBA per cell, for one format with the water's): how frozen, and whether it's thawing. */
/** The ice's texture (#14): per cell how frozen, whether it's thawing, and how far from the shore. */
function iceData(ice: Float32Array, thaw: Float32Array, shore: Float32Array) {
  const out = new Float32Array(ice.length * 4);
  for (let i = 0; i < ice.length; i++) { out[i * 4] = ice[i]; out[i * 4 + 1] = thaw[i]; out[i * 4 + 2] = shore[i]; }
  return out;
}

/** How far each wet cell is from the nearest dry one, metres, up to SHORE_MAX (a chamfer distance in two sweeps). */
export function shoreDistance(map: WaterMap) {
  const { nx, nz, level, cell } = map, d = new Float32Array(nx * nz), D = Math.SQRT2, FAR = 1e9;
  for (let i = 0; i < d.length; i++) d[i] = Number.isNaN(level[i]) ? 0 : FAR;
  const at = (x: number, z: number) => (x < 0 || z < 0 || x >= nx || z >= nz ? FAR : d[z * nx + x]);
  for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
    const i = z * nx + x;
    if (d[i] > 0) d[i] = Math.min(d[i], at(x - 1, z) + cell, at(x, z - 1) + cell, at(x - 1, z - 1) + D * cell, at(x + 1, z - 1) + D * cell);
  }
  for (let z = nz - 1; z >= 0; z--) for (let x = nx - 1; x >= 0; x--) {
    const i = z * nx + x;
    if (d[i] > 0) d[i] = Math.min(d[i], at(x + 1, z) + cell, at(x, z + 1) + cell, at(x + 1, z + 1) + D * cell, at(x - 1, z + 1) + D * cell);
  }
  // The shore itself lies about half a cell from the last wet cell's centre (where the land meets the sheet); capped after.
  for (let i = 0; i < d.length; i++) if (d[i] > 0) d[i] = Math.min(d[i] - cell / 2, SHORE_MAX);
  return d;
}
/** As far from the shore as the ice cares about, metres: past it, all water is the middle. */
export const SHORE_MAX = 8;

/** The water laid out, sunk as far as the sheet ever dives, where it isn't drawn. */
function sunk(data: Float32Array) {
  const out = data.slice();
  for (let i = 0; i < out.length; i += 4) { out[i] -= MAX_DIVE; out[i + 3] = -MAX_DIVE; }
  return out;
}
