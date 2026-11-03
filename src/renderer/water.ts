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
vec4 waterCell(ivec2 c) {
  ivec2 n = textureSize(tWaterA, 0);
  c = clamp(c, ivec2(0), n - 1);
  return mix(texelFetch(tWaterA, c, 0), texelFetch(tWaterB, c, 0), uWaterBlend);
}
// The sheet over a point, on its own triangles (split from the +x cell to the +z one, as WaterField.index lays them):
// per cell, the surface (x) and the surface it continues, before its dive (y; the same where it's wet). Far below
// everything off the grid or with no map.
vec2 waterSheet(vec2 xz) {
  if (uWaterGrid.w < 0.5) return vec2(-1.0e6);
  vec2 g = (xz - uWaterGrid.xy) * uWaterGrid.z - 0.5;
  ivec2 n = textureSize(tWaterA, 0);
  // Off the sheet (which reaches the grid's edge, half a cell past the edge cells' centres).
  if (g.x < -0.5 || g.y < -0.5 || g.x > float(n.x) - 0.5 || g.y > float(n.y) - 0.5) return vec2(-1.0e6);
  vec2 i = floor(g), f = g - i;
  ivec2 c = ivec2(i);
  vec4 a = waterCell(c), b = waterCell(c + ivec2(1, 0)), d = waterCell(c + ivec2(0, 1)), e = waterCell(c + ivec2(1, 1));
  // Where it dives, its mud is how far down, negative (layWater).
  vec2 va = vec2(a.x, a.x - min(a.w, 0.0)), vb = vec2(b.x, b.x - min(b.w, 0.0));
  vec2 vd = vec2(d.x, d.x - min(d.w, 0.0)), ve = vec2(e.x, e.x - min(e.w, 0.0));
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
  /** Cells (Chebyshev) to the nearest wet cell, capped at 255. */
  dist: Uint8Array;
  /** The lowest and highest wet surface, and the middle one (the median), or null with no water. */
  low: number; high: number; mid: number | null;
}

/** Lays a map out for the GPU: the wet cells as sent, the dry ones continuing the nearest water's surface (see above). */
export function layWater(map: WaterMap): Laid {
  const { nx, nz, level } = map, n = nx * nz;
  if (level.length !== n) throw new Error(`water map: ${level.length} levels for ${nx} x ${nz} cells`);
  const data = new Float32Array(n * 4), dist = new Uint8Array(n).fill(255);
  // Breadth first from the wet cells (to all eight neighbours, so diagonal shores are as near as straight ones): each dry
  // cell takes its surface, flow and mud from the highest of the cells it's reached from.
  let queue: number[] = [];
  const wet: number[] = [];
  for (let i = 0; i < n; i++) {
    if (Number.isNaN(level[i])) continue;
    data[i * 4] = level[i];
    data[i * 4 + 1] = map.flowX?.[i] ?? 0; data[i * 4 + 2] = map.flowZ?.[i] ?? 0; data[i * 4 + 3] = THREE.MathUtils.clamp(map.mud?.[i] ?? 0, 0, 1);
    dist[i] = 0; queue.push(i); wet.push(level[i]);
  }
  /** The surface each cell continues, before its dive. */
  const source = new Float32Array(n).fill(-Infinity);
  for (const i of queue) source[i] = level[i];
  for (let d = 1; queue.length && d < 255; d++) {
    const next: number[] = [];
    for (const i of queue) {
      const x = i % nx, z = (i - x) / nx;
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        const cx = x + dx, cz = z + dz;
        if ((dx === 0 && dz === 0) || cx < 0 || cz < 0 || cx >= nx || cz >= nz) continue;
        const j = cz * nx + cx;
        if (dist[j] < d) continue;
        if (dist[j] === 255) { dist[j] = d; next.push(j); }
        if (source[i] > source[j]) {
          source[j] = source[i];
          data[j * 4 + 1] = data[i * 4 + 1]; data[j * 4 + 2] = data[i * 4 + 2]; data[j * 4 + 3] = data[i * 4 + 3];
        }
      }
    }
    queue = next;
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
  return { data, dist, low: wet[0] ?? 0, high: wet[wet.length - 1] ?? 0, mid: wet.length ? wet[wet.length >> 1] : null };
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

  /** Retires water that has drained away entirely once its ease is done; true if it has just gone. */
  settle(time: number) {
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
      this.any = false; this.from = this.to = null; this.grid.w = 0; this.floor = null;
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
      const wet = (b < 1 ? [from, to] : [to]).filter((l) => l.mid !== null);
      this.from = {
        data, dist, low: Math.min(...wet.map((l) => l.low)), high: Math.max(...wet.map((l) => l.high)),
        mid: wet.length ? (to.mid ?? from.mid) : null,
      };
    }
    // Water drained away, or coming where there was none, eases to (or from) itself sunk under the land, as a drying
    // shore does: never to the depths a map with no water at all lies at.
    if (ease > 0 && laid.mid === null && this.from.mid !== null) this.to = { ...laid, data: sunk(this.from.data) };
    else {
      if (ease > 0 && laid.mid !== null && this.from.mid === null) this.from = { ...this.from, data: sunk(laid.data) };
      this.to = laid;
    }
    this.start = time; this.ease = ease;
    this.upload(this.a, this.from.data);
    this.upload(this.b, this.to.data);
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
    this.a.dispose(); this.b.dispose();
    const { nx, nz, cell, x0, z0 } = this, vx = nx + 2, vz = nz + 2;
    this.a = cellTexture(nx, nz); this.b = cellTexture(nx, nz);
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
    const g = this.geometry!, { nx, nz } = this, from = this.from!.dist, to = this.to!.dist, vx = nx + 2;
    // Whether vertex (i, j)'s cell is near water.
    const near = (i: number, j: number) => {
      const k = Math.min(Math.max(j - 1, 0), nz - 1) * nx + Math.min(Math.max(i - 1, 0), nx - 1);
      return Math.min(from[k], to[k]) <= REACH;
    };
    const index = g.index!, idx = index.array as Uint32Array;
    let count = 0, x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let j = 0; j < nz + 1; j++) for (let i = 0; i < nx + 1; i++) {
      if (!(near(i, j) || near(i + 1, j) || near(i, j + 1) || near(i + 1, j + 1))) continue;
      const a = j * vx + i, b = a + 1, c = a + vx, d = c + 1;
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

/** The water laid out, sunk as far as the sheet ever dives, where it isn't drawn. */
function sunk(data: Float32Array) {
  const out = data.slice();
  for (let i = 0; i < out.length; i += 4) { out[i] -= MAX_DIVE; out[i + 3] = -MAX_DIVE; }
  return out;
}
