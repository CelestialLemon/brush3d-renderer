import * as THREE from 'three';
import { CAMERA_DISTANCE, ViewCamera } from './camera';
import type { Look } from './look';
import {
  createSharedUniforms, depthMaterial, basisBakeMaterial, groundBakeMaterial, prepassMaterial, sceneMaterial, WATER_REACH, type MaterialKind, type SharedUniforms,
} from './materials';
import { POST_FRAG, POST_VERT } from './post';
import { ShelterMap, type Cover } from './shelter';
import type { PassTimer } from './timer';
import { WeatherState, type Weather } from './weather';
import { leafStorm, WindState, type Wind } from './wind';

// The renderer: a sun shadow map; for the water, the bed drawn without it and the scene mirrored in it (both at half size,
// and only round the water on screen); a multisampled G-buffer (colour plus view normal, depth and ink), its silhouettes
// drawn first so the painting runs only where a surface shows; and a post pass that inks the lines, hazes the distance and
// grades. It draws at the screen's own resolution: no art-pixel grid. docs/PERFORMANCE.md has what each pass costs.

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
  /** The shelter map's size in texels (1024; 512 to save memory). */
  shelterSize?: number;
}

export interface Settings {
  lines: boolean; shadows: boolean; grain: number;
  /** Draw the main view's silhouettes before painting it (depth only), so hidden surfaces aren't painted. */
  prepass: boolean;
  /** Draw the water's two passes only round the water on screen. */
  waterScissor: boolean;
  /**
   * With the silhouettes drawn first: paint the leaves in the main view, and everything in the reflection, only where its
   * depth is the silhouette's own (rather than at it or nearer). The same picture; it lets the GPU skip hidden leaf pixels
   * before painting them, where it can. Off for comparing, or for a GPU whose depths don't match exactly.
   */
  equalDepth: boolean;
  /**
   * Draw the things in the air (FALLING): off leaves them out, so the stability tools can measure the land under a storm.
   */
  falling: boolean;
  /** Show the shelter map over the frame: what's under cover, and the map from above in the corner. */
  shelterDebug: boolean;
}

/** The kinds in the air, which settings.falling leaves out: the leaves the wind lifts (rain, snow and dust to come). */
export const FALLING: readonly MaterialKind[] = ['debris'];

/** How a mesh takes part in the passes. */
export interface MeshOptions {
  /** Casts a shadow from the sun. */
  castShadow?: boolean;
  /** Is seen through the water (the ground, the stones in the stream bed). */
  under?: boolean;
  /** Is mirrored in the water. */
  reflect?: boolean;
  /**
   * For the ground: the square its brush fields are baked over (see setFields), centred at x, z, `side` metres across and
   * turned `turn` radians about the vertical. It should cover the ground, and not much more. The grass's and crops' brush
   * is baked over the same square.
   */
  fields?: { x: number; z: number; side: number; turn: number };
  /**
   * How it shelters what's under it from rain and snow (see ShelterMap): by default the inked things are roofs ('full': the
   * things people make, solar panels among them) and leaves are crowns ('partial'); nothing else is cover. Flowers and the
   * like are leaves, but no cover.
   */
  cover?: Cover;
}

export class BrushRenderer {
  readonly gl: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly view = new ViewCamera();
  readonly shared: SharedUniforms = createSharedUniforms();
  readonly settings: Settings = { lines: true, shadows: true, grain: 0.012, prepass: true, waterScissor: true, equalDepth: true, falling: true, shelterDebug: false };
  width = 1; height = 1;
  /** Device pixels per CSS pixel asked for (see RendererOptions): the screen's pixels, which the zoom counts in. */
  readonly screenRatio: number;
  /** Device pixels per CSS pixel drawn: screenRatio, or less where that would draw more than maxPixels. */
  pixelRatio: number;
  /**
   * The most pixels to draw: on a high-DPI screen (the MacBook's) the frame is drawn at fewer pixels than the screen's and
   * scaled up to it, so it costs what the budget was set at. Set it before resize. No limit by default.
   */
  maxPixels = Infinity;
  /** Times each pass when set (tools/profile.ts, the demo's ?profile). */
  timer: PassTimer | null = null;
  /**
   * Where the finished frame goes: the canvas (null), or a target. Profiling draws into a target, as the canvas may make
   * each frame wait for the screen's next refresh (on the MacBook it did).
   */
  output: THREE.WebGLRenderTarget | null = null;
  private gbuffer: THREE.WebGLRenderTarget;
  private shadowTarget: THREE.WebGLRenderTarget;
  private sunCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.5, 400);
  private shadowCenter: THREE.Vector3;
  private shadowRadius: number;
  private post: THREE.ShaderMaterial;
  private postScene = new THREE.Scene();
  private postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private materials = new Map<MaterialKind, {
    main: THREE.ShaderMaterial; depth: THREE.ShaderMaterial; prepass: THREE.ShaderMaterial; mirrorPrepass: THREE.ShaderMaterial;
  }>();
  private casters: THREE.Mesh[] = [];
  /**
   * Each mesh's silhouette twin (the same geometry, depth only), drawn in the main view and the reflection just before
   * the painted meshes, in the same render: three resolves a multisampled target after every render, and a full-size
   * resolve costs a millisecond or so on integrated graphics. Hidden in the other passes.
   */
  private silhouettes = new THREE.Group();
  private twins: [THREE.Mesh, THREE.Mesh][] = [];
  private fields = new Map<MaterialKind, THREE.WebGLRenderTarget>();
  private underTarget: THREE.WebGLRenderTarget;
  private reflectTarget: THREE.WebGLRenderTarget;
  private look: Look | null = null;
  /** The wind as drawn, easing towards what the game last asked for (see setWind). */
  readonly wind = new WindState();
  /** The weather as drawn: the cover as the game sent it, the looks easing towards it (see setWeather). */
  readonly weather = new WeatherState();
  /**
   * What's under cover, seen from above (see ShelterMap), for rain and snow to stop at. Drawn only when cover changes:
   * call shelter.changed() after moving cover; adding a mesh or showing or hiding a kind does it already.
   */
  readonly shelter: ShelterMap;

  constructor(readonly canvas: HTMLCanvasElement, options: RendererOptions = {}) {
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true });
    this.gl.autoClear = false;
    this.screenRatio = options.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);
    this.pixelRatio = this.screenRatio;
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
    this.shelter = new ShelterMap(options.shelterSize ?? 1024);
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
    this.silhouettes.visible = false;
    this.scene.add(this.silhouettes);
    // Leaves in the air, for strong winds: the renderer's own, round wherever the camera is.
    this.add(leafStorm(), 'debris', { castShadow: false });
  }

  /**
   * The wind the game wants: speed in m/s (see WIND_SCALE), the direction it blows towards, and how gusty. The drawn wind
   * eases towards it over a second or two; 'immediate' puts it there at once (a new scene, a screenshot).
   */
  setWind(wind: Wind, immediate = false) { this.wind.set(wind, immediate); }

  /**
   * The weather the game wants (see Weather, and WEATHER_PRESETS for shorthands). The cloud cover is drawn exactly as given;
   * the looks (the light, rain and snow, heat, haze) ease towards it over a second or two, hiding the steps between the
   * game's updates; 'immediate' puts them there at once (a level loading, a screenshot).
   */
  setWeather(weather: Weather, immediate = false) { this.weather.set(weather, immediate); }

  /** The shared material of a kind (one per renderer, so meshes of a kind batch their state). */
  material(kind: MaterialKind) {
    let m = this.materials.get(kind);
    if (!m) {
      m = {
        main: sceneMaterial(kind, this.shared), depth: depthMaterial(kind, this.shared),
        prepass: prepassMaterial(kind, this.shared), mirrorPrepass: prepassMaterial(kind, this.shared, true),
      };
      this.materials.set(kind, m);
    }
    return m.main;
  }

  /** Adds a mesh of a kind. By default it casts a shadow and is mirrored in the water (water itself is neither). */
  add(geometry: THREE.BufferGeometry, kind: MaterialKind, options: MeshOptions = {}) {
    const mesh = new THREE.Mesh(geometry, this.material(kind));
    mesh.frustumCulled = false;
    mesh.userData.kind = kind;
    mesh.userData.under = options.under ?? false;
    mesh.userData.reflect = options.reflect ?? kind !== 'water';
    mesh.userData.fields = options.fields;
    mesh.userData.cover = options.cover ?? (kind === 'ink' ? 'full' : kind === 'foliage' ? 'partial' : 'none');
    if (mesh.userData.cover !== 'none') this.shelter.changed();
    this.scene.add(mesh);
    if (options.castShadow ?? kind !== 'water') this.casters.push(mesh);
    const twin = new THREE.Mesh(geometry, this.materials.get(kind)!.prepass);
    twin.frustumCulled = false;
    twin.renderOrder = -1;
    twin.matrixAutoUpdate = false;
    twin.matrixWorldAutoUpdate = false;
    this.silhouettes.add(twin);
    this.twins.push([mesh, twin]);
    return mesh;
  }

  /**
   * Bakes a kind's brush fields into `size`² textures, so its paint reads them rather than working them out in every pixel
   * every frame (the light and the wind stay live); 0 works them out live again. Call after the scene is built.
   * - 'ground': the ground (added with `fields`) drawn flat over its square: it must be a heightfield (one surface over
   *   each point). Re-bake if its shape or paint changes.
   * - 'grass', 'crop': by place, not by mesh, over the ground's square: the brush on the flat at seven angles, for each
   *   brush scale (up to eight) the kind's meshes use now. So crops can grow, be harvested and be sown anew with no new
   *   bake, unless at a new brush scale. A crop's sides (its edges) stay live.
   * Returns whether it baked.
   */
  setFields(kind: 'ground' | 'crop' | 'grass', size: number): boolean {
    const main = this.materials.get(kind)?.main;
    this.fields.get(kind)?.dispose();
    this.fields.delete(kind);
    if (!main) return false;
    delete main.defines.FIELDS;
    delete main.defines.BASIS;
    main.needsUpdate = true;
    const meshes = this.scene.children.filter((o): o is THREE.Mesh => o.userData.kind === kind);
    const ground = this.scene.children.find((o) => o.userData.kind === 'ground' && o.userData.fields) as THREE.Mesh | undefined;
    const square = ground?.userData.fields as MeshOptions['fields'];
    if (size <= 0 || !ground || !square) return false;
    // x and z to 0..1 across the square: take the centre off, turn back, scale.
    const c = Math.cos(square.turn) / square.side, sn = Math.sin(square.turn) / square.side;
    const map = new THREE.Matrix3().set(c, -sn, 0.5 - c * square.x + sn * square.z, sn, c, 0.5 - sn * square.x - c * square.z, 0, 0, 1);
    const options = {
      type: THREE.UnsignedByteType, format: THREE.RGBAFormat, depthBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
    } as const;
    const scene = new THREE.Scene();
    const bake = (target: THREE.WebGLRenderTarget, layer = 0) => {
      this.gl.setRenderTarget(target, layer);
      this.gl.setClearColor(0x808080, 1);
      this.gl.clear(true, false, false);
      this.gl.render(scene, this.postCamera);
    };
    let target: THREE.WebGLRenderTarget;
    if (kind !== 'ground') {
      const scales = [...new Set(meshes.flatMap((m) => {
        const a = m.geometry.getAttribute('aPaint');
        return Array.from({ length: a.count }, (_, i) => a.getY(i));
      }))];
      if (scales.length === 0 || scales.length > 8) return false;
      target = new THREE.WebGLArrayRenderTarget(size, size, scales.length * 7, options);
      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
      quad.frustumCulled = false;
      scene.add(quad);
      const unmap = map.clone().invert();
      scales.forEach((scale, i) => {
        for (let layer = 0; layer < 7; layer++) {
          const material = basisBakeMaterial(this.shared, unmap, scale, layer);
          quad.material = material;
          bake(target, i * 7 + layer);
          material.dispose();
        }
      });
      quad.geometry.dispose();
      main.uniforms.uBasis = { value: target.texture };
      main.uniforms.uBasisScales = { value: scales };
      main.defines.BASIS = scales.length;
    } else {
      target = new THREE.WebGLRenderTarget(size, size, options);
      const material = groundBakeMaterial(this.shared, map);
      const flat = new THREE.Mesh(ground.geometry, material);
      flat.frustumCulled = false;
      ground.updateMatrixWorld();
      flat.matrixWorld.copy(ground.matrixWorld);
      flat.matrixAutoUpdate = false;
      flat.matrixWorldAutoUpdate = false;
      scene.add(flat);
      bake(target);
      material.dispose();
      main.uniforms.uFields = { value: target.texture };
      main.defines.FIELDS = 1;
    }
    this.gl.setRenderTarget(null);
    this.fields.set(kind, target);
    main.uniforms.uFieldsMap = { value: map };
    return true;
  }

  /**
   * Sets how the painting meets the depth: after the silhouettes it only reads it (they wrote it already, and a pass that
   * doesn't write depth lets the GPU throw hidden pixels away before painting them), at equal depth for the kinds `equal`
   * picks; without them, the usual nearer-or-equal test, writing.
   */
  private paintOver(silhouettes: boolean, equal: (kind: MaterialKind) => boolean) {
    for (const [kind, m] of this.materials) {
      m.main.depthWrite = !silhouettes;
      m.main.depthFunc = silhouettes && equal(kind) ? THREE.EqualDepth : THREE.LessEqualDepth;
    }
  }

  /** Shows or hides every mesh of a kind (for A/B comparisons). */
  setVisible(kind: MaterialKind, visible: boolean) {
    for (const o of this.scene.children) {
      if (o.userData.kind !== kind || o.visible === visible) continue;
      o.visible = visible;
      if (o.userData.cover !== 'none') this.shelter.changed();
    }
  }

  /** The height of the water's surface, the plane it mirrors the scene in. */
  setWaterLevel(y: number) { this.shared.uMirrorY.value = y; }

  resize(cssWidth: number, cssHeight: number) {
    this.pixelRatio = Math.min(this.screenRatio, Math.sqrt(this.maxPixels / Math.max(1, cssWidth * cssHeight)));
    this.gl.setPixelRatio(this.pixelRatio);
    this.gl.setSize(cssWidth, cssHeight, false);
    // The canvas's own size (three rounds a fractional ratio down).
    this.width = this.canvas.width;
    this.height = this.canvas.height;
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

  /** Draws only the meshes `keep` picks into a target, from the view camera; only inside `scissor` (pixels) if given. */
  private drawOnly(target: THREE.WebGLRenderTarget, keep: (m: THREE.Object3D) => boolean, scissor: THREE.Vector4 | null) {
    const hidden: THREE.Object3D[] = [];
    for (const o of this.scene.children) if (o.visible && !keep(o)) { o.visible = false; hidden.push(o); }
    target.scissorTest = scissor !== null;
    if (scissor) target.scissor.copy(scissor);
    this.gl.setRenderTarget(target);
    this.gl.clear(true, true, false);
    this.gl.render(this.scene, this.view.camera);
    for (const o of hidden) o.visible = true;
  }

  private waterBox = new THREE.Box2();
  private corner = new THREE.Vector3();
  /** Where the water is on screen (-1 to 1 across and up), or null where none shows. */
  private waterOnScreen() {
    const box = this.waterBox.makeEmpty(), v = this.corner;
    for (const o of this.scene.children) {
      if (!o.visible || o.userData.kind !== 'water') continue;
      const mesh = o as THREE.Mesh;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const b = mesh.geometry.boundingBox!;
      for (let i = 0; i < 8; i++) {
        v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z);
        v.applyMatrix4(mesh.matrixWorld).project(this.view.camera);
        box.expandByPoint(new THREE.Vector2(v.x, v.y));
      }
    }
    return box.isEmpty() || box.max.x < -1 || box.min.x > 1 || box.max.y < -1 || box.min.y > 1 ? null : box;
  }

  /**
   * The rectangle of a water pass's target (pixels) the water can read: where it is on screen, widened by how far its
   * lookups reach, `reach` in screen uv plus `px` screen pixels (see WATER_REACH), with a texel for filtering and one to
   * spare. Null draws the whole target.
   */
  private waterRect(onScreen: THREE.Box2, target: THREE.WebGLRenderTarget, reach: number, px: number) {
    if (!this.settings.waterScissor) return null;
    const w = target.width, h = target.height;
    const rx = reach + px / this.width, ry = reach + px / this.height;
    const x0 = Math.max(0, Math.floor(((onScreen.min.x + 1) / 2 - rx) * w) - 2);
    const y0 = Math.max(0, Math.floor(((onScreen.min.y + 1) / 2 - ry) * h) - 2);
    const x1 = Math.min(w, Math.ceil(((onScreen.max.x + 1) / 2 + rx) * w) + 2);
    const y1 = Math.min(h, Math.ceil(((onScreen.max.y + 1) / 2 + ry) * h) + 2);
    return new THREE.Vector4(x0, y0, x1 - x0, y1 - y0);
  }

  /** Draws the shelter map: the cover meshes with their sun-shadow materials, from above, the wind stilled. */
  private drawShelter() {
    const cover = this.scene.children.filter((o): o is THREE.Mesh => (o as THREE.Mesh).isMesh && o.userData.cover !== undefined)
      .map((mesh) => ({ mesh, cover: mesh.userData.cover as Cover, depth: this.materials.get(mesh.userData.kind)!.depth }));
    const ground = this.scene.children.find((o) => o.userData.kind === 'ground' && o.userData.fields);
    const s = this.shared;
    this.shelter.draw(this.gl, this.scene, cover, ground?.userData.fields ?? null, () => {
      const speed = s.uWindSpeed.value;
      s.uWindSpeed.value = 0;
      return () => { s.uWindSpeed.value = speed; };
    });
  }

  render(time: number) {
    if (!this.look) throw new Error('setLook before render');
    const t = this.timer;
    t?.mark('setup', false);
    const s = this.shared, w = this.wind;
    s.uTime.value = time;
    w.update(time);
    s.uWindDir.value.set(w.dirX, w.dirZ);
    s.uWindSpeed.value = w.speed;
    s.uWindGustiness.value = w.gust;
    s.uWindDrift.value.set(w.driftX, w.driftZ);
    s.uWindFlutter.value = w.flutter;
    this.weather.update(time);
    const grounded: THREE.Object3D[] = [];
    if (!this.settings.falling) {
      for (const o of this.scene.children) if (o.visible && FALLING.includes(o.userData.kind)) { o.visible = false; grounded.push(o); }
    }
    // Framed by the screen's pixels, not the pixels drawn: drawing fewer (maxPixels) makes the frame softer, not nearer.
    const toScreen = this.screenRatio / this.pixelRatio;
    this.view.apply(this.width * toScreen, this.height * toScreen);
    s.uViewBack.value.copy(this.view.backward());
    s.uViewTarget.value.copy(this.view.target);
    this.scene.updateMatrixWorld();
    for (const [mesh, twin] of this.twins) twin.matrixWorld.copy(mesh.matrixWorld);
    const gl = this.gl;

    // The shelter map, only when cover has changed: nothing to do most frames.
    t?.mark('shelter', this.shelter.dirty);
    if (this.shelter.dirty) this.drawShelter();

    // The sun's shadow map: redrawn every frame, because foliage and grass move in the wind.
    t?.mark('shadow');
    gl.setRenderTarget(this.shadowTarget);
    gl.clear(false, true, false);
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

    // What the water shows: the bed without it, and the scene mirrored in it. Only round the water on screen, and not at
    // all when none shows. The farthest a lookup reaches (snoise peaks a little past 1, hence the tenth more):
    t?.mark('under');
    gl.setClearColor(0x000000, 0);
    const water = this.waterOnScreen();
    const nudge = (WATER_REACH.ripple + WATER_REACH.chop * WATER_REACH.chopMax) * 1.1;
    if (water) this.drawOnly(this.underTarget, (m) => m.userData.under, this.waterRect(water, this.underTarget, nudge, 0));
    t?.mark('reflect');
    const pre = this.settings.prepass;
    if (water) {
      this.shared.uMirror.value = 1;
      // Its silhouettes first too, of what the water mirrors.
      this.silhouettes.visible = pre;
      if (pre) {
        for (const [mesh, twin] of this.twins) {
          twin.visible = mesh.visible && mesh.userData.reflect;
          twin.material = this.materials.get(mesh.userData.kind)!.mirrorPrepass;
        }
      }
      // Nearer-or-equal here, not equal: on the laptop's Intel GPU equal depth made this pass slower, 1.9 → 3.1 ms (#6).
      this.paintOver(pre, () => false);
      // Mirroring flips the winding, so one-sided surfaces show their back faces.
      const flipped = [...this.materials.values()].flatMap((m) => [m.main, m.mirrorPrepass]).filter((m) => m.side === THREE.FrontSide);
      for (const m of flipped) m.side = THREE.BackSide;
      const rect = this.waterRect(water, this.reflectTarget, nudge * WATER_REACH.reflectNudge, WATER_REACH.blurPx);
      this.drawOnly(this.reflectTarget, (m) => m.userData.reflect || m === this.silhouettes, rect);
      for (const m of flipped) m.side = THREE.FrontSide;
      this.shared.uMirror.value = 0;
    }

    // The main view's silhouettes first, depth only: then each pixel is painted once, by the surface that shows there,
    // rather than by every leaf card stacked behind it.
    t?.mark('main');
    gl.setRenderTarget(this.gbuffer);
    gl.clear(true, true, false);
    this.silhouettes.visible = pre;
    if (pre) {
      for (const [mesh, twin] of this.twins) {
        twin.visible = mesh.visible;
        twin.material = this.materials.get(mesh.userData.kind)!.prepass;
      }
    }
    // The leaves gain most from equal depth; for the rest it made no difference worth the risk of a GPU's depths not
    // matching to the last bit (#6).
    this.paintOver(pre, (kind) => this.settings.equalDepth && kind === 'foliage');
    gl.render(this.scene, this.view.camera);
    this.silhouettes.visible = false;
    this.paintOver(false, () => false);

    t?.mark('post');
    gl.setRenderTarget(this.output);
    const u = this.post.uniforms;
    u.uLines.value = this.settings.lines ? 1 : 0;
    u.uGrain.value = this.settings.grain;
    // Lines thin as the camera zooms out, so a busy farm doesn't turn into a comic.
    u.uLineWidth.value = THREE.MathUtils.clamp(0.6 + this.view.zoom / 48, 0.8, 2.2) * this.pixelRatio * 0.75;
    gl.render(this.postScene, this.postCamera);
    if (this.settings.shelterDebug) this.shelter.drawOverlay(gl, this.gbuffer.textures[1], this.view.camera, this.width, this.height);
    for (const o of grounded) o.visible = true;
    t?.endFrame();
  }
}
