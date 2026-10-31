import * as THREE from 'three';
import { CLOUD_GLSL, CLOUD_SHAPE, cloudShift, cloudThreshold, seedOf, type CloudField, type CloudShape } from './clouds';

// The cloud map (#8): the cloud field's shade (clouds.ts) drawn into a small texture over the land whenever the clouds
// move, so every surface reads its shade with one lookup rather than working the recipe out in every pixel
// (docs/PERFORMANCE.md's budget). Axis-aligned over the ground's square; 512² over the farm's 96 m is 19 cm a texel, far finer than a cloud's
// soft edge. Outside it the edge texels carry on.

/** For any material that reads the map: its uniforms, and cloudMapShade(xz), the field's shade there (0..1). */
export const CLOUD_MAP_GLSL = /* glsl */ `
uniform sampler2D uCloudMap;
uniform vec4 uCloudRect;     // the map's corner (x, z) and 1 / its side
float cloudMapShade(vec2 xz) { return texture(uCloudMap, (xz - uCloudRect.xy) * uCloudRect.zw).r; }
`;

// The points from the map's corner, which goes in the shift (cloudShift's origin): small numbers wherever the land is.
const VERT = /* glsl */ `
precision highp float;
in vec3 position;
uniform vec4 uCloudRect;
out vec2 vXZ;
void main() {
  vXZ = (position.xy * 0.5 + 0.5) / uCloudRect.zw;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
const FRAG = /* glsl */ `
precision highp float;
precision highp int;
${CLOUD_GLSL}
in vec2 vXZ;
out vec4 fragColor;
void main() { fragColor = vec4(cloudShadeAt(vXZ), 0.0, 0.0, 1.0); }
`;

export class CloudMap {
  readonly target: THREE.WebGLRenderTarget;
  private material: THREE.RawShaderMaterial;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  /** What it was last drawn for: the field and the shape are often still (no wind, a screenshot). */
  private drawn = '';

  /**
   * `uniforms` are the materials' (CLOUD_MAP_GLSL's): the map's texture is put in uCloudMap, and its square is
   * uCloudRect's (see setArea).
   */
  constructor(readonly uniforms: { uCloudMap: { value: THREE.Texture | null }; uCloudRect: { value: THREE.Vector4 } }, readonly size = 512) {
    this.target = new THREE.WebGLRenderTarget(size, size, {
      type: THREE.HalfFloatType, format: THREE.RedFormat, depthBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
      wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
    });
    this.uniforms.uCloudMap.value = this.target.texture;
    this.material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false,
      uniforms: {
        uCloudRect: this.uniforms.uCloudRect,
        uCloudShape: { value: new THREE.Vector4() }, uCloudShift: { value: new THREE.Vector2() },
        uCloudThreshold: { value: new THREE.Vector2() }, uCloudSeed: { value: 0 },
      },
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    quad.frustumCulled = false;
    this.scene.add(quad);
  }

  /**
   * The square of land the map covers: its lower corner (x, z) and its side, metres. Keep the land within about a hundred
   * kilometres of the origin: the surfaces find their place on the map in 32-bit floats, as they find it on screen.
   */
  setArea(x: number, z: number, side: number) {
    const r = this.uniforms.uCloudRect.value;
    if (r.x === x && r.y === z && r.z === 1 / side) return;
    r.set(x, z, 1 / side, 1 / side);
    this.drawn = '';
  }

  /** Draws the field as it is now. */
  draw(gl: THREE.WebGLRenderer, field: CloudField, shape: CloudShape = CLOUD_SHAPE) {
    // No cloud or all cloud is the same map wherever the clouds have drifted to.
    const key = JSON.stringify(field.cover > 0 && field.cover < 1 ? [field, shape] : [field.cover]);
    if (key === this.drawn) return;
    this.drawn = key;
    const u = this.material.uniforms;
    (u.uCloudShape.value as THREE.Vector4).set(1 / shape.size, shape.warp, shape.rough, shape.billow);
    const rect = this.uniforms.uCloudRect.value;
    (u.uCloudShift.value as THREE.Vector2).fromArray(cloudShift(field, shape, rect.x, rect.y));
    (u.uCloudThreshold.value as THREE.Vector2).fromArray(cloudThreshold(field.cover, shape));
    u.uCloudSeed.value = seedOf(field.seed);
    gl.setRenderTarget(this.target);
    gl.render(this.scene, this.camera);
  }

  dispose() { this.target.dispose(); this.material.dispose(); }
}
