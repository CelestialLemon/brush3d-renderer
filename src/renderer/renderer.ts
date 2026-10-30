import * as THREE from 'three';
import { CAMERA_DISTANCE, ViewCamera } from './camera';
import type { Look } from './look';
import { createSharedUniforms, depthMaterial, sceneMaterial, type MaterialKind, type SharedUniforms } from './materials';
import { POST_FRAG, POST_VERT } from './post';
import { leafStorm, WindState, type Wind } from './wind';

// The renderer: a sun shadow map; for the water, the bed drawn without it and the scene mirrored in it (both at half size);
// a multisampled G-buffer (colour plus view normal, depth and ink); and a post pass that inks the lines, hazes the distance
// and grades. It draws at the screen's own resolution: no art-pixel grid.

export interface RendererOptions {
  /** Shadow-map size in texels. */
  shadowMapSize?: number;
  /** The square of ground (centre and half-size, metres) the sun's shadow covers. */
  shadowCenter?: THREE.Vector3;
  shadowRadius?: number;
  /** MSAA samples for the G-buffer (0 to turn it off). */
  samples?: number;
  /** Device pixels per CSS pixel to draw at; defaults to the screen's, capped at 2. */
  pixelRatio?: number;
}

export interface Settings { lines: boolean; shadows: boolean; grain: number; }

/** How a mesh takes part in the passes. */
export interface MeshOptions {
  /** Casts a shadow from the sun. */
  castShadow?: boolean;
  /** Is seen through the water (the ground, the stones in the stream bed). */
  under?: boolean;
  /** Is mirrored in the water. */
  reflect?: boolean;
}

export class BrushRenderer {
  readonly gl: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly view = new ViewCamera();
  readonly shared: SharedUniforms = createSharedUniforms();
  readonly settings: Settings = { lines: true, shadows: true, grain: 0.012 };
  width = 1; height = 1;
  private pixelRatio: number;
  private gbuffer: THREE.WebGLRenderTarget;
  private shadowTarget: THREE.WebGLRenderTarget;
  private sunCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.5, 400);
  private shadowCenter: THREE.Vector3;
  private shadowRadius: number;
  private post: THREE.ShaderMaterial;
  private postScene = new THREE.Scene();
  private postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private materials = new Map<MaterialKind, { main: THREE.ShaderMaterial; depth: THREE.ShaderMaterial }>();
  private casters: THREE.Mesh[] = [];
  private underTarget: THREE.WebGLRenderTarget;
  private reflectTarget: THREE.WebGLRenderTarget;
  private look: Look | null = null;
  /** The wind as drawn, easing towards what the game last asked for (see setWind). */
  readonly wind = new WindState();

  constructor(readonly canvas: HTMLCanvasElement, options: RendererOptions = {}) {
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true });
    this.gl.autoClear = false;
    this.pixelRatio = options.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);
    const samples = options.samples ?? 4;
    this.gbuffer = new THREE.WebGLRenderTarget(1, 1, {
      count: 2, samples, type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });
    const size = options.shadowMapSize ?? 2048;
    this.shadowTarget = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true });
    this.shadowTarget.depthTexture = new THREE.DepthTexture(size, size, THREE.UnsignedIntType);
    this.shared.uShadowMap.value = this.shadowTarget.depthTexture;
    this.shared.uShadowTexel.value.set(1 / size, 1 / size);
    this.shadowCenter = options.shadowCenter?.clone() ?? new THREE.Vector3();
    this.shadowRadius = options.shadowRadius ?? 30;
    const half = () => new THREE.WebGLRenderTarget(1, 1, {
      count: 2, type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });
    this.underTarget = half();
    this.reflectTarget = half();
    this.shared.uUnder.value = this.underTarget.textures[0];
    this.shared.uUnderAux.value = this.underTarget.textures[1];
    this.shared.uReflect.value = this.reflectTarget.textures[0];

    this.post = new THREE.ShaderMaterial({
      vertexShader: POST_VERT, fragmentShader: POST_FRAG, depthTest: false, depthWrite: false,
      uniforms: {
        tColor: { value: this.gbuffer.textures[0] }, tAux: { value: this.gbuffer.textures[1] },
        uResolution: { value: new THREE.Vector2(1, 1) }, uLineWidth: { value: 1.5 }, uLines: { value: 1 },
        uTargetDepth: { value: CAMERA_DISTANCE }, uHazeColor: { value: new THREE.Color() }, uHazeDensity: { value: 0.02 },
        uHazeMax: { value: 0.4 }, uHazeFloor: { value: 0 }, uSkyTop: { value: new THREE.Color() }, uSkyBottom: { value: new THREE.Color() },
        uExposure: { value: 1 }, uSaturation: { value: 1 }, uShadeHue: { value: 0 }, uGrain: { value: 0.012 },
      },
    });
    this.postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.post));
    // Leaves in the air, for strong winds: the renderer's own, round wherever the camera is.
    this.add(leafStorm(), 'debris', { castShadow: false });
  }

  /**
   * The wind the game wants: speed in m/s (see WIND_SCALE), the direction it blows towards, and how gusty. The drawn wind
   * eases towards it over a second or two; 'immediate' puts it there at once (a new scene, a screenshot).
   */
  setWind(wind: Wind, immediate = false) { this.wind.set(wind, immediate); }

  /** The shared material of a kind (one per renderer, so meshes of a kind batch their state). */
  material(kind: MaterialKind) {
    let m = this.materials.get(kind);
    if (!m) { m = { main: sceneMaterial(kind, this.shared), depth: depthMaterial(kind, this.shared) }; this.materials.set(kind, m); }
    return m.main;
  }

  /** Adds a mesh of a kind. By default it casts a shadow and is mirrored in the water (water itself is neither). */
  add(geometry: THREE.BufferGeometry, kind: MaterialKind, options: MeshOptions = {}) {
    const mesh = new THREE.Mesh(geometry, this.material(kind));
    mesh.frustumCulled = false;
    mesh.userData.kind = kind;
    mesh.userData.under = options.under ?? false;
    mesh.userData.reflect = options.reflect ?? kind !== 'water';
    this.scene.add(mesh);
    if (options.castShadow ?? kind !== 'water') this.casters.push(mesh);
    return mesh;
  }

  /** Shows or hides every mesh of a kind (for A/B comparisons). */
  setVisible(kind: MaterialKind, visible: boolean) {
    for (const o of this.scene.children) if (o.userData.kind === kind) o.visible = visible;
  }

  /** The height of the water's surface, the plane it mirrors the scene in. */
  setWaterLevel(y: number) { this.shared.uMirrorY.value = y; }

  resize(cssWidth: number, cssHeight: number) {
    this.gl.setPixelRatio(this.pixelRatio);
    this.gl.setSize(cssWidth, cssHeight, false);
    this.width = Math.round(cssWidth * this.pixelRatio);
    this.height = Math.round(cssHeight * this.pixelRatio);
    this.gbuffer.setSize(this.width, this.height);
    const hw = Math.max(1, Math.round(this.width / 2)), hh = Math.max(1, Math.round(this.height / 2));
    this.underTarget.setSize(hw, hh);
    this.reflectTarget.setSize(hw, hh);
    this.shared.uScreen.value.set(this.width, this.height);
    (this.post.uniforms.uResolution.value as THREE.Vector2).set(this.width, this.height);
  }

  setLook(look: Look) {
    this.look = look;
    const s = this.shared;
    const az = THREE.MathUtils.degToRad(look.sunAz), el = THREE.MathUtils.degToRad(Math.max(look.sunEl, 4));
    s.uSunDir.value.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)).normalize();
    // Below the horizon the sun still lights the scene from low down, dimmed: dusk and dawn stay readable.
    const dim = THREE.MathUtils.smoothstep(look.sunEl, -8, 6);
    s.uSunColor.value.copy(look.sunColor).lerp(look.skyColor, 1 - dim);
    s.uSkyColor.value.copy(look.skyColor);
    s.uRimColor.value.copy(look.rimColor).multiplyScalar(dim);
    const rad = THREE.MathUtils.degToRad;
    s.uShadeHue.value = rad(look.shadeHue); s.uShadeLean.value = look.shadeLean; s.uShadeDepth.value = look.shadeDepth;
    s.uLitHue.value = rad(look.litHue); s.uLitLean.value = look.litLean;
    const u = this.post.uniforms;
    u.uHazeColor.value.copy(look.hazeColor); u.uHazeDensity.value = look.hazeDensity; u.uHazeMax.value = look.hazeMax; u.uHazeFloor.value = look.hazeFloor;
    u.uSkyTop.value.copy(look.skyTop); u.uSkyBottom.value.copy(look.skyBottom);
    s.uSkyTop.value.copy(look.skyTop); s.uSkyBottom.value.copy(look.skyBottom);
    u.uExposure.value = look.exposure; u.uSaturation.value = look.saturation; u.uShadeHue.value = rad(look.shadeHue);
    this.updateSunCamera();
  }

  private updateSunCamera() {
    const r = this.shadowRadius, c = this.sunCamera;
    c.left = -r; c.right = r; c.top = r; c.bottom = -r; c.near = 1; c.far = 300;
    c.position.copy(this.shadowCenter).addScaledVector(this.shared.uSunDir.value, 150);
    c.up.set(0, 1, 0);
    if (Math.abs(this.shared.uSunDir.value.y) > 0.999) c.up.set(0, 0, 1);
    c.lookAt(this.shadowCenter);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.shared.uShadowMatrix.value.copy(bias).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
    this.shadowDirty = true;
  }
  private shadowDirty = true;

  /** Draws only the meshes `keep` picks into a target, from the view camera. */
  private drawOnly(target: THREE.WebGLRenderTarget, keep: (m: THREE.Object3D) => boolean) {
    const hidden: THREE.Object3D[] = [];
    for (const o of this.scene.children) if (o.visible && !keep(o)) { o.visible = false; hidden.push(o); }
    this.gl.setRenderTarget(target);
    this.gl.clear(true, true, false);
    this.gl.render(this.scene, this.view.camera);
    for (const o of hidden) o.visible = true;
  }

  render(time: number) {
    if (!this.look) throw new Error('setLook before render');
    const s = this.shared, w = this.wind;
    s.uTime.value = time;
    w.update(time);
    s.uWindDir.value.set(w.dirX, w.dirZ);
    s.uWindSpeed.value = w.speed;
    s.uWindGustiness.value = w.gust;
    s.uWindDrift.value.set(w.driftX, w.driftZ);
    s.uWindFlutter.value = w.flutter;
    this.view.apply(this.width, this.height);
    s.uViewBack.value.copy(this.view.backward());
    s.uViewTarget.value.copy(this.view.target);
    const gl = this.gl;

    // The sun's shadow map: redrawn every frame, because foliage and grass move in the wind.
    gl.setRenderTarget(this.shadowTarget);
    gl.setClearColor(0xffffff, 1);
    gl.clear(true, true, false);
    if (this.settings.shadows) {
      const saved = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
      const hidden: THREE.Object3D[] = [];
      for (const o of this.scene.children) if (!this.casters.includes(o as THREE.Mesh) && o.visible) { o.visible = false; hidden.push(o); }
      for (const m of this.casters) { saved.set(m, m.material); m.material = this.materials.get(m.userData.kind)!.depth; }
      gl.render(this.scene, this.sunCamera);
      for (const [m, mat] of saved) m.material = mat;
      for (const o of hidden) o.visible = true;
    }
    this.shadowDirty = false;

    // What the water shows: the bed without it, and the scene mirrored in it.
    gl.setClearColor(0x000000, 0);
    this.drawOnly(this.underTarget, (m) => m.userData.under);
    this.shared.uMirror.value = 1;
    // Mirroring flips the winding, so one-sided surfaces show their back faces.
    const flipped = [...this.materials.values()].map((m) => m.main).filter((m) => m.side === THREE.FrontSide);
    for (const m of flipped) m.side = THREE.BackSide;
    this.drawOnly(this.reflectTarget, (m) => m.userData.reflect);
    for (const m of flipped) m.side = THREE.FrontSide;
    this.shared.uMirror.value = 0;

    gl.setRenderTarget(this.gbuffer);
    gl.clear(true, true, false);
    gl.render(this.scene, this.view.camera);

    gl.setRenderTarget(null);
    const u = this.post.uniforms;
    u.uLines.value = this.settings.lines ? 1 : 0;
    u.uGrain.value = this.settings.grain;
    // Lines thin as the camera zooms out, so a busy farm doesn't turn into a comic.
    u.uLineWidth.value = THREE.MathUtils.clamp(0.6 + this.view.zoom / 48, 0.8, 2.2) * this.pixelRatio * 0.75;
    gl.render(this.postScene, this.postCamera);
  }
}
