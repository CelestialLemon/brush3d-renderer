import * as THREE from 'three';

// The shelter map: what's under cover, seen from straight above, so rain and snow stop at roofs (#10). Two depth maps over
// a square of the land, drawn from above: the highest full cover over each point (roofs: the inked things, solar panels
// among them) and the highest partial cover (tree crowns, drawn as their leaves). A raindrop or snowflake stops at the
// height they give; the ground under a roof stays dry, under a crown drier. Nothing in them moves, so they're drawn only
// when what's under cover changes (a building placed or removed), not every frame; the crowns are drawn at rest, without
// the wind.

/** How a mesh shelters what's under it: as a roof does, as a crown does (some rain gets through), or not at all. */
export type Cover = 'full' | 'partial' | 'none';

/** How much of the rain and snow a crown keeps off (a roof keeps off all of it): the developer's "partly" (#10). */
export const PARTIAL_COVER = 0.6;

/** The square of land the map covers: centred at x, z, `side` metres across, turned `turn` radians about the vertical. */
export interface ShelterArea { x: number; z: number; side: number; turn: number }

/**
 * For any material that reads the map: its uniforms (spread a ShelterMap's `uniforms` into the material's) and
 * `shelter(p)`, how sheltered a point is: 1 under a roof, PARTIAL_COVER under a crown, 0 in the open (and off the map).
 * Edges are soft over a texel, as a shadow map's are, so a dry patch's edge doesn't step. `shelterTop(p)` is the height
 * of the highest roof over p (far below the land where there's none): where a raindrop stops.
 */
export const SHELTER_GLSL = /* glsl */ `
uniform highp sampler2D uShelterFull;
uniform highp sampler2D uShelterPartial;
uniform mat4 uShelterMatrix;
// The map's depth to height: height = x - depth * y.
uniform vec2 uShelterHeight;
uniform float uShelterTexels;
// Whether p is under what the map at its texel holds, by a margin, so a roof doesn't shelter itself. A texel left clear
// (1, the far plane) holds nothing, however low p is.
float shelterUnder(highp sampler2D map, ivec2 t, float depth) {
  t = clamp(t, ivec2(0), ivec2(int(uShelterTexels) - 1));
  float d = texelFetch(map, t, 0).r;
  return d < 1.0 ? step(d, depth) : 0.0;
}
// Bilinear: the four texels round p, each compared, then blended.
float shelterSoft(highp sampler2D map, vec2 uv, float depth) {
  vec2 st = uv * uShelterTexels - 0.5;
  vec2 f = fract(st);
  ivec2 t = ivec2(floor(st));
  float a = shelterUnder(map, t, depth), b = shelterUnder(map, t + ivec2(1, 0), depth);
  float c = shelterUnder(map, t + ivec2(0, 1), depth), d = shelterUnder(map, t + ivec2(1, 1), depth);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float shelter(vec3 p) {
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  if (any(lessThan(s.xy, vec2(0.0))) || any(greaterThan(s.xy, vec2(1.0)))) return 0.0;
  // Ten centimetres: a texel of a roof's slope, and a little more.
  float depth = s.z - 0.1 / uShelterHeight.y;
  return max(shelterSoft(uShelterFull, s.xy, depth), ${PARTIAL_COVER.toFixed(2)} * shelterSoft(uShelterPartial, s.xy, depth));
}
float shelterTop(vec3 p) {
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  if (any(lessThan(s.xy, vec2(0.0))) || any(greaterThan(s.xy, vec2(1.0)))) return -1e4;
  ivec2 t = clamp(ivec2(s.xy * uShelterTexels), ivec2(0), ivec2(int(uShelterTexels) - 1));
  float d = texelFetch(uShelterFull, t, 0).r;
  return d < 1.0 ? uShelterHeight.x - d * uShelterHeight.y : -1e4;
}
`;

/** Every point to (-2, -2): off the map, while there's none. */
const OFF_MAP = new THREE.Matrix4().set(0, 0, 0, -2, 0, 0, 0, -2, 0, 0, 0, 0, 0, 0, 0, 1);

/** A mesh as the map sees it. */
export interface CoverMesh { mesh: THREE.Mesh; cover: Cover; depth: THREE.Material }

export class ShelterMap {
  /** For materials that read it (see SHELTER_GLSL). */
  readonly uniforms = {
    uShelterFull: { value: null as THREE.Texture | null },
    uShelterPartial: { value: null as THREE.Texture | null },
    // Until it's drawn, every point is off the map.
    uShelterMatrix: { value: new THREE.Matrix4().copy(OFF_MAP) },
    uShelterHeight: { value: new THREE.Vector2(0, 1) },
    uShelterTexels: { value: 1 },
  };
  /** Whether the map must be drawn again before it's next read (see changed). */
  dirty = true;
  /** The square it covers; null: the ground's own square (the one its brush is baked over), whatever the scene sets. */
  area: ShelterArea | null = null;
  private full: THREE.WebGLRenderTarget;
  private partial: THREE.WebGLRenderTarget;
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private overlay: THREE.ShaderMaterial;
  private overlayScene = new THREE.Scene();
  private box = new THREE.Box3();

  /** `size`: texels across (docs/PERFORMANCE.md: 1024 full quality, 512 reduced). */
  constructor(readonly size = 1024) {
    const target = () => {
      // Only the depth is read; the colour it must have is the smallest there is, a byte a texel.
      const t = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true, format: THREE.RedFormat });
      t.depthTexture = new THREE.DepthTexture(size, size, THREE.UnsignedIntType);
      return t;
    };
    this.full = target();
    this.partial = target();
    this.uniforms.uShelterFull.value = this.full.depthTexture;
    this.uniforms.uShelterPartial.value = this.partial.depthTexture;
    this.uniforms.uShelterTexels.value = size;
    this.overlay = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: OVERLAY_VERT, fragmentShader: OVERLAY_FRAG,
      uniforms: {
        ...this.uniforms, tAux: { value: null }, uCameraWorld: { value: new THREE.Matrix4() }, uHalf: { value: new THREE.Vector2() },
        uResolution: { value: new THREE.Vector2() },
      },
      transparent: true, depthTest: false, depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.overlay);
    quad.frustumCulled = false;
    this.overlayScene.add(quad);
  }

  /** Something under cover changed (placed, removed, moved, shown or hidden): the map is drawn again before it's next read. */
  changed() { this.dirty = true; }

  /** Sets the square it covers (null: the ground's own). */
  setArea(area: ShelterArea | null) { this.area = area; this.dirty = true; }

  /**
   * Draws the map, if it's dirty: the full cover into one depth map, the partial into the other, each mesh with its depth
   * material (`meshes`), from straight above, everything else hidden. `scene` holds them; `area` is the square to cover
   * when none is set. The wind is stilled while it draws (`still`), so crowns are at rest.
   */
  draw(gl: THREE.WebGLRenderer, scene: THREE.Scene, meshes: CoverMesh[], area: ShelterArea | null, still: () => () => void) {
    if (!this.dirty) return false;
    this.dirty = false;
    const a = this.area ?? area;
    if (!a) {
      this.uniforms.uShelterMatrix.value.copy(OFF_MAP);
      return true;
    }
    // From a metre above the highest cover, down to a metre below everything in the scene.
    const box = this.box.makeEmpty();
    let top = -Infinity;
    for (const o of scene.children) {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.visible) continue;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
      box.union(b);
      if (meshes.some((m) => m.mesh === mesh && m.cover !== 'none')) top = Math.max(top, b.max.y);
    }
    const bottom = (box.isEmpty() ? 0 : box.min.y) - 1;
    top = Math.max(top, bottom) + 1;
    const c = this.camera, h = a.side / 2;
    c.left = -h; c.right = h; c.top = h; c.bottom = -h; c.near = 0; c.far = top - bottom;
    c.position.set(a.x, top, a.z);
    // Turned with the square; for the farm's, the map's up is the default view's (the debug view's corner shows it so).
    c.up.set(-Math.sin(a.turn), 0, -Math.cos(a.turn));
    c.lookAt(a.x, bottom, a.z);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.uniforms.uShelterMatrix.value.copy(bias).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
    this.uniforms.uShelterHeight.value.set(top, top - bottom);

    const hidden: THREE.Object3D[] = [];
    for (const o of scene.children) if (o.visible) { o.visible = false; hidden.push(o); }
    const saved = meshes.map((m) => [m, m.mesh.material, m.mesh.visible] as const);
    const unstill = still();
    for (const cover of ['full', 'partial'] as const) {
      for (const m of meshes) {
        m.mesh.visible = m.cover === cover && hidden.includes(m.mesh);
        m.mesh.material = m.depth;
      }
      gl.setRenderTarget(cover === 'full' ? this.full : this.partial);
      gl.clear(false, true, false);
      gl.render(scene, c);
    }
    unstill();
    for (const [m, material, visible] of saved) { m.mesh.material = material; m.mesh.visible = visible; }
    for (const o of hidden) o.visible = true;
    return true;
  }

  /**
   * The debug view, over the finished frame: the ground under a roof in blue, hatched; under a crown in pale teal; the
   * tops of the roofs (where rain lands, and snow will lie) in warm yellow; and the map itself, from above, in the corner.
   * `aux` is the G-buffer's (view normal, view depth); `camera` the view's.
   */
  drawOverlay(gl: THREE.WebGLRenderer, aux: THREE.Texture, camera: THREE.OrthographicCamera, width: number, height: number) {
    const u = this.overlay.uniforms;
    u.tAux.value = aux;
    u.uCameraWorld.value.copy(camera.matrixWorld);
    u.uHalf.value.set(camera.right, camera.top);
    u.uResolution.value.set(width, height);
    gl.render(this.overlayScene, this.camera);
  }

  dispose() {
    this.full.dispose(); this.partial.dispose(); this.overlay.dispose();
  }
}

const OVERLAY_VERT = /* glsl */ `
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const OVERLAY_FRAG = /* glsl */ `
precision highp float;
${SHELTER_GLSL}
uniform sampler2D tAux;
uniform mat4 uCameraWorld;
uniform vec2 uHalf;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;
void main() {
  // The map itself, from above, in the bottom-left corner: roofs blue (lighter higher up), crowns teal.
  float inset = min(uResolution.x, uResolution.y) * 0.32;
  vec2 px = gl_FragCoord.xy - 12.0;
  if (px.x >= 0.0 && px.y >= 0.0 && px.x < inset && px.y < inset) {
    vec2 uv = px / inset;
    float full = texture(uShelterFull, uv).r, part = texture(uShelterPartial, uv).r;
    vec3 col = vec3(0.93, 0.9, 0.82);
    if (part < 1.0) col = mix(vec3(0.55, 0.85, 0.75), vec3(0.2, 0.55, 0.5), part);
    if (full < 1.0 && full <= part) col = mix(vec3(0.75, 0.85, 1.0), vec3(0.1, 0.25, 0.75), smoothstep(0.0, 1.0, full));
    fragColor = vec4(col, 0.92);
    return;
  }
  vec4 aux = texture(tAux, vUv);
  if (aux.z <= 0.0) discard;
  // Where this pixel is: the view's orthographic camera, back along its view by the depth.
  vec3 p = (uCameraWorld * vec4((vUv * 2.0 - 1.0) * uHalf, -aux.z, 1.0)).xyz;
  float under = shelter(p);
  vec3 s = (uShelterMatrix * vec4(p, 1.0)).xyz;
  bool onMap = all(greaterThanEqual(s.xy, vec2(0.0))) && all(lessThanEqual(s.xy, vec2(1.0)));
  // A roof's own top: at the full map's height there.
  float top = onMap ? 1.0 - smoothstep(0.08, 0.2, abs(shelterTop(p) - p.y)) : 0.0;
  float hatch = step(0.5, fract((gl_FragCoord.x + gl_FragCoord.y) / 10.0));
  float full = clamp((under - ${PARTIAL_COVER.toFixed(2)}) / ${(1 - PARTIAL_COVER).toFixed(2)}, 0.0, 1.0);
  float part = min(under, ${PARTIAL_COVER.toFixed(2)}) / ${PARTIAL_COVER.toFixed(2)} - full;
  vec4 col = vec4(0.0);
  col = mix(col, vec4(0.45, 0.95, 0.85, 0.4), part);
  col = mix(col, vec4(0.15, 0.35, 1.0, 0.45 + 0.25 * hatch), full);
  col = mix(col, vec4(1.0, 0.85, 0.2, 0.55), top * (1.0 - full));
  if (col.a <= 0.0) discard;
  fragColor = col;
}
`;
