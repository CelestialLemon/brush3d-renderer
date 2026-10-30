import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PLAIN, type MeshBuilder, type Paint } from './builder';

// Models made in Blender (tools/blender/), as glTF: inked things, each face one colour (a custom attribute, _COLOR, linear,
// as the scenes' own colours are), its material's name saying how the ink shader finishes it. No textures: the look is the renderer's.

/** The ink shader's finish for each material name (see INK_FRAG): plain, timber grain, glass in panes, tin. */
const FINISH: Record<string, Paint> = {
  plain: PLAIN,
  timber: [2, 1, 0, 0],
  // Two panes by two.
  glass: [1, 2, 2, 0],
  // Corrugations, five a metre across the sheet (uv in metres: down the slope, along the ridge).
  tin: [3, 0, 5, 0],
};

const loader = new GLTFLoader();

/** Loads a model's scene. */
export async function loadModel(url: string): Promise<THREE.Object3D> {
  return (await loader.loadAsync(url)).scene;
}

/** Adds a model's meshes to a builder, placed by `matrix`. */
export function addModel(b: MeshBuilder, model: THREE.Object3D, matrix: THREE.Matrix4) {
  model.updateMatrixWorld(true);
  const p = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color();
  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const m = matrix.clone().multiply(mesh.matrixWorld), nm = new THREE.Matrix3().getNormalMatrix(m);
    const g = mesh.geometry, paint = FINISH[(mesh.material as THREE.Material).name] ?? PLAIN;
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
