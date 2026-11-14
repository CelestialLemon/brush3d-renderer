import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshBuilder, PLAIN, rng, srgb, type Paint } from './builder';
import { addMound } from './kit';
import type { BrushRenderer } from '../renderer/renderer';

// Models made in Blender (tools/blender/, docs/MODELS.md), as glTF: inked things, each face one colour (a custom attribute,
// _COLOR, linear, as the scenes' own colours are), its material's name saying how the ink shader finishes it. No textures:
// the look is the renderer's. What grows on a model is painted, never inked (docs/DIRECTION.md): a planted roof is a
// `moss` surface, drawn with the land's brush, and its plants are named points the scene grows painted clumps at.

/** The ink shader's finish for each material name (see INK_FRAG): plain, timber grain, glass in panes, tin. */
const FINISH: Record<string, Paint> = {
  plain: PLAIN,
  timber: [2, 1, 0, 0],
  // Two panes a metre, both ways (uv in metres): a window's panes, a solar sheet's cells.
  glass: [1, 2, 2, 0],
  // Corrugations, five a metre across the sheet (uv in metres: down the slope, along the ridge).
  tin: [3, 0, 5, 0],
};
/** A planted surface's paint: the land's brush, a little livelier, with a rim of light. */
const MOSS: Paint = [0.75, 2.6, 0.7, 0.25];

const loader = new GLTFLoader();

/** Loads a model's scene. */
export async function loadModel(url: string): Promise<THREE.Object3D> {
  return (await loader.loadAsync(url)).scene;
}

/** The plants a model's `plant_<kind>_<n>` points grow: [leaf, foot, bloom or none, dabs for a half-metre clump]. */
const PLANTS: Record<string, { leaf: number[]; foot: number; bloom?: number[]; dabs: number }> = {
  herb: { leaf: [0x7fb24e, 0x6aa04a, 0x8cba52], foot: 0x4a7e40, dabs: 12 },
  flower: { leaf: [0x74aa4c, 0x6aa04a], foot: 0x4a7e40, bloom: [0xf08bb0, 0xf5cf3e, 0xf7f2e4, 0xa77ad8, 0xe8574a], dabs: 12 },
  shrub: { leaf: [0x4e9a3a, 0x40885a, 0x5aa03e], foot: 0x2f6a42, dabs: 20 },
  vine: { leaf: [0x5aa03e, 0x4e9a3a, 0x6aa84a], foot: 0x3e7a3c, dabs: 9 },
};

/**
 * The meshes a scene's models go into: the inked things, their planted surfaces (painted), and the plants growing on
 * them (painted leaves). Fill it with `add`, then `addTo` the renderer.
 */
export class ModelSet {
  readonly ink = new MeshBuilder('ink');
  readonly paint = new MeshBuilder('paint');
  readonly leaves = new MeshBuilder('foliage');
  private readonly rand: () => number;
  constructor(seed = 7) { this.rand = rng(seed); }

  /**
   * Adds a model, placed by `matrix`. One that `floats` (a boat) gets no waterline (#18): its inside is dry, though it's
   * below the water's surface. Its moving parts (`move_spin_*`) are drawn where they rest: nothing moves yet.
   */
  add(model: THREE.Object3D, matrix: THREE.Matrix4, floats = false) {
    model.updateMatrixWorld(true);
    const p = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color(), s = new THREE.Vector3(), q = new THREE.Quaternion();
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const m = matrix.clone().multiply(o.matrixWorld);
      if (!mesh.isMesh) {
        const kind = /^plant_([a-z]+)_/.exec(o.name)?.[1];
        if (kind && PLANTS[kind]) { m.decompose(p, q, s); this.grow(kind, p, s.x, s.y); }
        return;
      }
      const name = (mesh.material as THREE.Material).name, moss = name === 'moss';
      const nm = new THREE.Matrix3().getNormalMatrix(m), b = moss ? this.paint : this.ink;
      const finish = moss ? MOSS : FINISH[name] ?? PLAIN;
      const g = mesh.geometry, paint: Paint = floats && !moss ? [finish[0], finish[1], finish[2], 1] : finish;
      const pos = g.getAttribute('position'), nrm = g.getAttribute('normal'), col = g.getAttribute('_color'), uv = g.getAttribute('uv');
      const base = b.vertexCount;
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(m);
        n.fromBufferAttribute(nrm, i).applyMatrix3(nm).normalize();
        if (col) c.setRGB(col.getX(i), col.getY(i), col.getZ(i)); else c.setRGB(1, 1, 1);
        b.vertex(p, n, c, paint, uv ? [uv.getX(i), uv.getY(i)] : [0, 0]);
      }
      const index = g.index;
      if (index) for (let i = 0; i < index.count; i += 3) b.tri(base + index.getX(i), base + index.getX(i + 1), base + index.getX(i + 2));
      else for (let i = 0; i < pos.count; i += 3) b.tri(base + i, base + i + 1, base + i + 2);
    });
  }

  /** A painted plant at a model's point: a cushion `radius` across and `tall` high; a vine is a column of them. */
  private grow(kind: string, at: THREE.Vector3, radius: number, tall: number) {
    const spec = PLANTS[kind], rand = this.rand;
    const pick = (list: number[]) => srgb(list[Math.floor(rand() * list.length)]);
    const leaf = pick(spec.leaf), foot = srgb(spec.foot), bloom = spec.bloom ? pick(spec.bloom) : undefined;
    const dabs = Math.round(spec.dabs * Math.max(0.6, radius / 0.5));
    if (kind !== 'vine') { addMound(this.leaves, at.x, at.y, at.z, radius, tall, leaf, foot, dabs, rand, bloom); return; }
    for (let y = 0; y < tall; y += radius * 0.9) {
      const k = 1 - 0.35 * (y / tall);
      addMound(this.leaves, at.x + (rand() - 0.5) * radius * 0.5, at.y + y, at.z + (rand() - 0.5) * radius * 0.5, radius * k, radius * 1.3,
        leaf.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.05), foot, dabs, rand);
    }
  }

  addTo(r: Pick<BrushRenderer, 'add'>) {
    if (this.ink.vertexCount) r.add(this.ink.build(), 'ink');
    // A planted roof is a roof: rain and snow stop at it, as at an inked one (paint is no cover unless told).
    if (this.paint.vertexCount) r.add(this.paint.build(), 'paint', { seasonal: true, cover: 'full' });
    if (this.leaves.vertexCount) r.add(this.leaves.build(), 'foliage', { cover: 'none', seasonal: true });
  }
}
