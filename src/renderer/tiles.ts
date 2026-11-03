import * as THREE from 'three';

// A big scene's meshes cut into tiles of the land, so each pass draws only the tiles in its view (the main view, the
// sun's shadow, the reflection, the silhouettes) and skips the rest. Each mesh used to be drawn whole in every pass, so
// on a large map the vertices off screen cost more than the pixels on it.

/** How far a tile's things may move from where they were built, metres: a tree leaning in a hurricane, its leaves flying. */
export const TILE_REACH = 5;

/**
 * Cuts an indexed geometry into tiles `size` metres square on the ground (x, z), each triangle going to the tile its
 * middle is in, with the vertices it uses (a vertex shared across a border is copied into both). Every attribute and the
 * userData (a mesh's trees) go with each. Each tile's bounding sphere is grown by TILE_REACH, so it isn't skipped while
 * what it holds has moved into view.
 */
export function cutIntoTiles(g: THREE.BufferGeometry, size: number): THREE.BufferGeometry[] {
  const index = g.getIndex();
  const pos = g.getAttribute('position');
  if (!index) return [g];
  const tris = new Map<string, number[]>();
  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i), b = index.getX(i + 1), c = index.getX(i + 2);
    const x = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3, z = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
    const key = `${Math.floor(x / size)},${Math.floor(z / size)}`;
    let list = tris.get(key);
    if (!list) tris.set(key, list = []);
    list.push(a, b, c);
  }
  if (tris.size <= 1) return [grow(g)];
  const names = Object.keys(g.attributes);
  const out: THREE.BufferGeometry[] = [];
  for (const list of tris.values()) {
    const remap = new Map<number, number>();
    const order: number[] = [];
    const idx = list.map((v) => {
      let n = remap.get(v);
      if (n === undefined) { n = order.length; remap.set(v, n); order.push(v); }
      return n;
    });
    const t = new THREE.BufferGeometry();
    for (const name of names) {
      const src = g.getAttribute(name) as THREE.BufferAttribute, k = src.itemSize;
      const data = new (src.array.constructor as Float32ArrayConstructor)(order.length * k);
      order.forEach((v, i) => { for (let j = 0; j < k; j++) data[i * k + j] = src.array[v * k + j]; });
      t.setAttribute(name, new THREE.BufferAttribute(data, k, src.normalized));
    }
    t.setIndex(order.length > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
    t.userData = { ...g.userData };
    out.push(grow(t));
  }
  g.dispose();
  return out;
}

function grow(g: THREE.BufferGeometry) {
  g.computeBoundingSphere();
  g.boundingSphere!.radius += TILE_REACH;
  return g;
}
