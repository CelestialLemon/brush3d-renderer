import * as THREE from 'three';
import type { MaterialKind } from '../renderer/materials';

/** How a painted surface is painted: colour drift (0..1+), brush scale (strokes per metre), stroke angle (radians), rim light. */
export type Paint = readonly [variation: number, brush: number, angle: number, rim: number];

export const PLAIN: Paint = [0, 1, 0, 0];

/** Accumulates one mesh's vertices with the attributes its material kind reads. */
export class MeshBuilder {
  private pos: number[] = []; private nrm: number[] = []; private col: number[] = []; private paint: number[] = [];
  private uv: number[] = []; private extra: number[] = []; private index: number[] = [];
  private readonly extraName: string | null;
  private readonly extraSize: number;

  constructor(readonly kind: MaterialKind) {
    this.extraName = kind === 'foliage' ? 'aCard' : kind === 'grass' ? 'aBlade' : null;
    this.extraSize = kind === 'foliage' ? 4 : kind === 'grass' ? 2 : 0;
  }

  get vertexCount() { return this.pos.length / 3; }

  vertex(p: THREE.Vector3Like, n: THREE.Vector3Like, c: THREE.Color, paint: Paint, uv: [number, number] = [0, 0], extra: number[] = []) {
    this.pos.push(p.x, p.y, p.z); this.nrm.push(n.x, n.y, n.z); this.col.push(c.r, c.g, c.b);
    this.paint.push(...paint); this.uv.push(...uv);
    for (let i = 0; i < this.extraSize; i++) this.extra.push(extra[i] ?? 0);
    return this.vertexCount - 1;
  }

  tri(a: number, b: number, c: number) { this.index.push(a, b, c); }
  quad(a: number, b: number, c: number, d: number) { this.index.push(a, b, c, a, c, d); }

  /** Appends a three.js geometry (indexed or not), transformed, in one colour. */
  addGeometry(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, c: THREE.Color, paint: Paint) {
    const g = geo.index ? geo : geo;
    const p = g.getAttribute('position'), n = g.getAttribute('normal'), uv = g.getAttribute('uv');
    const nm = new THREE.Matrix3().getNormalMatrix(matrix);
    const v = new THREE.Vector3(), w = new THREE.Vector3();
    const base = this.vertexCount;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(matrix);
      w.fromBufferAttribute(n, i).applyMatrix3(nm).normalize();
      this.vertex(v, w, c, paint, uv ? [uv.getX(i), uv.getY(i)] : [0, 0]);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) this.index.push(base + g.index.getX(i));
    else for (let i = 0; i < p.count; i++) this.index.push(base + i);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('aPaint', new THREE.Float32BufferAttribute(this.paint, 4));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (this.extraName) g.setAttribute(this.extraName, new THREE.Float32BufferAttribute(this.extra, this.extraSize));
    if (this.vertexCount > 65535) g.setIndex(new THREE.Uint32BufferAttribute(this.index, 1));
    else g.setIndex(this.index);
    return g;
  }
}

/** A seeded random number generator (mulberry32), so scenes are the same every load. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2D simplex noise for building scenes, in [-1, 1].
const GRAD = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
const PERM = (() => {
  const r = rng(1337), p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return [...p, ...p];
})();
export function noise2(x: number, y: number) {
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2, x0 = x - (i - t), y0 = y - (j - t);
  const [i1, j1] = x0 > y0 ? [1, 0] : [0, 1];
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  const ii = i & 255, jj = j & 255;
  const corner = (gx: number, gy: number, h: number) => {
    let t0 = 0.5 - gx * gx - gy * gy;
    if (t0 < 0) return 0;
    const g = GRAD[h % 8];
    t0 *= t0;
    return t0 * t0 * (g[0] * gx + g[1] * gy);
  };
  return 70 * (corner(x0, y0, PERM[ii + PERM[jj]]) + corner(x1, y1, PERM[ii + i1 + PERM[jj + j1]]) + corner(x2, y2, PERM[ii + 1 + PERM[jj + 1]]));
}

export const srgb = (hex: number) => new THREE.Color(hex);
