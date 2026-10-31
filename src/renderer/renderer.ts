import * as THREE from 'three';
import { CAMERA_DISTANCE, ViewCamera } from './camera';
import { CloudMap } from './cloudMap';
import { CLOUD_SHAPE, type CloudShape } from './clouds';
import type { Look } from './look';
import { CLOUD_DEPTH, CLOUD_NIGHT, gapCover, OVERCAST, overcastLook, skyShare, UNDER_CLOUD_FADE } from './overcast';
import {
  createSharedUniforms, depthMaterial, basisBakeMaterial, groundBakeMaterial, prepassMaterial, sceneMaterial, WATER_REACH, type MaterialKind, type SharedUniforms,
} from './materials';
import { fogNoiseTexture, litFog } from './fog';
import { POST_FRAG, POST_VERT } from './post';
import { ShelterMap, type Cover } from './shelter';
import type { PassTimer } from './timer';
import { WeatherState, type Weather } from './weather';
import { airLook, HEAT_RECIPES, heatShare, type HeatLook } from './air';
import { leafStorm, WindState, type Wind } from './wind';

// The renderer: the clouds' shade over the land (#8); a sun shadow map; for the water, the bed drawn without it and the
// scene mirrored in it (both at half size, and only round the water on screen); a multisampled G-buffer (colour plus view
// normal, depth and ink), its silhouettes drawn first so the painting runs only where a surface shows; and a post pass
// that inks the lines, hazes the distance and grades. It draws at the screen's own resolution: no art-pixel grid. docs/PERFORMANCE.md has what each pass costs.

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
  /** The heat wave's look (air.ts), and its shimmer at full heat in pixels (0 none): to choose between (#9). */
  heatLook: HeatLook;
  shimmer: number;
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
  readonly settings: Settings = { lines: true, shadows: true, grain: 0.012, prepass: true, waterScissor: true, equalDepth: true, falling: true, shelterDebug: false,
    heatLook: 'glare', shimmer: 0.6,
  };
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
  /** The water's level, if the scene has water: the fog measures how deep it lies from it. */
  private waterLevel: number | null = null;
  /** The wind as drawn, easing towards what the game last asked for (see setWind). */
  readonly wind = new WindState();
  /** The weather as drawn: the cover as the game sent it, the looks easing towards it (see setWeather). */
  readonly weather = new WeatherState();
  /**
   * What's under cover, seen from above (see ShelterMap), for rain and snow to stop at. Drawn only when cover changes:
   * call shelter.changed() after moving cover; adding a mesh or showing or hiding a kind does it already.
   */
  readonly shelter: ShelterMap;
  /** The cloud field's shade over the land, drawn each frame the clouds move (#8). */
  readonly cloudMap: CloudMap;
  /** The clouds' shape (clouds.ts): the game's, the same one it reads its solar panels by. */
  cloudShape: CloudShape = CLOUD_SHAPE;

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
    this.cloudMap = new CloudMap(this.shared);
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
        uExposure: { value: 1 }, uSaturation: { value: 1 }, uNightShift: { value: 0 }, uShadeHue: { value: 0 }, uGrain: { value: 0.012 },
        uCamPos: { value: new THREE.Vector3() }, uCamRight: { value: new THREE.Vector3() }, uCamUp: { value: new THREE.Vector3() },
        uCamFwd: { value: new THREE.Vector3() }, uFogColor: { value: new THREE.Color() }, uFog: { value: new THREE.Vector4() },
        uFogDrift: { value: new THREE.Vector2() }, tFogNoise: { value: fogNoiseTexture() }, uFogWind: { value: new THREE.Vector3(1, 0, 1) },
        uDust: { value: new THREE.Vector2() }, uShimmer: { value: new THREE.Vector2() },
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
    if (kind === 'ground') this.cloudArea = false;
    this.scene.add(mesh);
    if (kind === 'ground') this.setHazeGround();
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

  /** Takes out a mesh added before (a building removed): from the scene, the sun's shadow, the silhouettes and the shelter. */
  remove(mesh: THREE.Mesh) {
    this.scene.remove(mesh);
    this.casters = this.casters.filter((m) => m !== mesh);
    const i = this.twins.findIndex(([m]) => m === mesh);
    if (i >= 0) { this.silhouettes.remove(this.twins[i][1]); this.twins.splice(i, 1); }
    if (mesh.userData.cover !== 'none') this.shelter.changed();
    if (mesh.userData.kind === 'ground') { this.setHazeGround(); this.cloudArea = false; }
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
  setWaterLevel(y: number) {
    this.shared.uMirrorY.value = y; this.waterLevel = y;
    this.setHazeGround();
  }

  /**
   * A haze on the ground starts just under the lowest land: the ground's lowest point (it's laid in world space, its brush
   * baked by place), or the water's bed if lower.
   */
  private setHazeGround() {
    let low = this.waterLevel === null ? Infinity : this.waterLevel - 1;
    for (const o of this.scene.children) {
      if (o.userData.kind !== 'ground') continue;
      const g = (o as THREE.Mesh).geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      low = Math.min(low, g.boundingBox!.min.y);
    }
    if (Number.isFinite(low)) this.weather.setGround(low - 0.5);
  }

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

  /** The hour's look; the weather is laid over it as each frame is drawn. */
  setLook(look: Look) { this.look = look; }

  /**
   * Sets the light's uniforms from the hour's look under the weather as drawn. Three looks: the grade's (the post pass's
   * haze, sky and exposure) under the cover as eased; the light in the gaps between the clouds; and the light under a
   * cloud, the overcast look's, which each pixel mixes in by the cloud's shade there (CLOUD_LIGHT). With no cloud the
   * three are the clear look; under full cover all three are the overcast one, as before the clouds (#7).
   */
  private applyLook(clear: Look) {
    const cover = this.weather.overcast, r = OVERCAST;
    // The cloud shadows are as strong as the sun is direct: none before dawn, faint by the moon. Where they're weak the
    // cover lies over the whole picture, as it did before the clouds; where they're strong the gaps are in the sun.
    const dim = THREE.MathUtils.smoothstep(clear.sunEl, -8, 6);
    const strength = dim * THREE.MathUtils.lerp(1, CLOUD_NIGHT, clear.night);
    const gap = THREE.MathUtils.lerp(cover, gapCover(cover), strength);
    // What dust and the heat do to the light (air.ts), laid over each.
    const w = this.weather, air = (l: Look) => airLook(l, w, HEAT_RECIPES[this.settings.heatLook]);
    const grade = air(overcastLook(clear, cover, r)), look = air(overcastLook(clear, gap, r)), under = air(overcastLook(clear, 1, r));
    const s = this.shared;
    const shape = skyShare(gap), lift = shape * r.shadowLift;
    s.uOvercast.value.set(shape * r.sky, shape * r.shadowFade, shape * r.shadowBlur);
    s.uCloudOvercast.value.set(r.sky, THREE.MathUtils.lerp(UNDER_CLOUD_FADE, r.shadowFade, lift), r.shadowBlur);
    s.uCloudStrength.value = strength;
    const az = THREE.MathUtils.degToRad(look.sunAz), el = THREE.MathUtils.degToRad(Math.max(look.sunEl, 4));
    s.uSunDir.value.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)).normalize();
    // The shadows that are left fall from the sky's brightest part, overhead, the thicker the cloud.
    this.shadowDir.copy(s.uSunDir.value);
    if (lift > 0) this.shadowDir.lerp(new THREE.Vector3(0, 1, 0), lift).normalize();
    // Below the horizon the sun still lights the scene from low down, dimmed: dusk and dawn stay readable.
    s.uSunColor.value.copy(look.sunColor).lerp(look.skyColor, 1 - dim);
    s.uCloudSunColor.value.copy(under.sunColor).lerp(under.skyColor, 1 - dim);
    s.uSkyColor.value.copy(look.skyColor);
    s.uRimColor.value.copy(look.rimColor).multiplyScalar(dim);
    s.uCloudRimColor.value.copy(under.rimColor).multiplyScalar(dim);
    const rad = THREE.MathUtils.degToRad;
    s.uShadeHue.value = rad(look.shadeHue); s.uShadeLean.value = look.shadeLean; s.uShadeDepth.value = look.shadeDepth;
    s.uLitHue.value = rad(look.litHue); s.uLitLean.value = look.litLean;
    // The exposures over the grade's, which the post pass lays over everything.
    s.uLightExposure.value = look.exposure / grade.exposure;
    const deeper = THREE.MathUtils.lerp(CLOUD_DEPTH, 1, gap);
    s.uCloudBands.value.set(rad(((under.shadeHue - look.shadeHue + 540) % 360) - 180), under.shadeDepth, under.litLean, (under.exposure * deeper) / grade.exposure);
    const u = this.post.uniforms;
    u.uHazeColor.value.copy(grade.hazeColor); u.uHazeDensity.value = grade.hazeDensity; u.uHazeMax.value = grade.hazeMax; u.uHazeFloor.value = grade.hazeFloor;
    u.uSkyTop.value.copy(grade.skyTop); u.uSkyBottom.value.copy(grade.skyBottom);
    s.uSkyTop.value.copy(grade.skyTop); s.uSkyBottom.value.copy(grade.skyBottom);
    u.uExposure.value = grade.exposure; u.uSaturation.value = grade.saturation; u.uNightShift.value = grade.nightShift; u.uShadeHue.value = rad(grade.shadeHue);
    this.applyFog();
    u.uShimmer.value.set(heatShare(look, w.heat) * this.settings.shimmer, this.shared.uTime.value);
    this.updateSunCamera();
  }

  /**
   * The fog's uniforms from the weather as drawn and the light just set. Its colour is the game's in noon's clear light,
   * lit by the hour's sun and sky as they are now (pink-gold at dawn, moonlight blue at night, the grey day's light under
   * cloud); the exposure dims it with everything else. Wind thins it and drags it out downwind.
   */
  private applyFog() {
    const w = this.weather, wind = this.wind, u = this.post.uniforms, s = this.shared;
    litFog(u.uFogColor.value, w.hazeColor, s.uSunColor.value, s.uSkyColor.value);
    // A fog thins in the wind; dust is what the wind lifts.
    const thin = THREE.MathUtils.lerp(1 / (1 + Math.max(0, wind.speed - 5) / 20), 1, w.dust);
    // It thins over most of its depth, measured from its base or else the water (the valley's floor).
    const floor = Math.max(w.hazeBase, this.waterLevel ?? w.hazeTop - 4);
    u.uFog.value.set(w.haze * thin, w.hazeBase, w.hazeTop, Math.max(0.5, 0.7 * (w.hazeTop - floor)));
    // The patches drift downwind and are drawn out along it, dust's faster and further (WindState); dust's streaks blow
    // by faster still, stronger as the wind rises.
    u.uFogDrift.value.set(wind.hazeDrift, wind.streakDrift);
    u.uFogWind.value.set(wind.dirX, wind.dirZ, WindState.hazeStretch(wind.speed, wind.carried));
    u.uDust.value.set(w.dust, 0.25 + 0.5 * Math.min(wind.speed / 25, 1));
  }

  private updateSunCamera() {
    const r = this.shadowRadius, c = this.sunCamera;
    c.left = -r; c.right = r; c.top = r; c.bottom = -r; c.near = 1; c.far = 300;
    c.position.copy(this.shadowCenter).addScaledVector(this.shadowDir, 150);
    // Up in the shadow map is away from the sun's bearing (the same as the world's up for the sun itself), which holds
    // still while the cloud turns the shadows overhead: switching it near overhead would turn the map's texels at once.
    const sun = this.shared.uSunDir.value;
    c.up.set(-sun.x, 0, -sun.z);
    if (c.up.lengthSq() < 1e-6) c.up.set(0, 0, 1);
    c.lookAt(this.shadowCenter);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.shared.uShadowMatrix.value.copy(bias).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
    this.shadowDirty = true;
  }
  private shadowDirty = true;
  /** Where the shadows fall from: the sun, turned towards overhead under cloud. */
  private shadowDir = new THREE.Vector3(0, 1, 0);

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
      // Every wind value and the clock set to one rest, whatever the weather, and the flutter kept across the map's own
      // view (straight down), not the camera's: what's left of the sway and the flutter (a little even in a calm) is then
      // the same every draw, so a new building can't nudge a tree's dry patch.
      const saved = [s.uTime.value, s.uWindSpeed.value, s.uWindGustiness.value, s.uWindFlutter.value,
        s.uWindDir.value.clone(), s.uWindDrift.value.clone(), s.uViewBack.value.clone()] as const;
      s.uTime.value = 0; s.uWindSpeed.value = 0; s.uWindGustiness.value = 0; s.uWindFlutter.value = 0;
      s.uWindDir.value.set(1, 0); s.uWindDrift.value.set(0, 0); s.uViewBack.value.set(0, 1, 0);
      return () => {
        [s.uTime.value, s.uWindSpeed.value, s.uWindGustiness.value, s.uWindFlutter.value] = saved;
        s.uWindDir.value.copy(saved[4]); s.uWindDrift.value.copy(saved[5]); s.uViewBack.value.copy(saved[6]);
      };
    });
  }

  /**
   * Draws the cloud map (when the clouds or their shape have changed), over the ground's square: found again whenever
   * ground is added or taken out, and each frame until there is some.
   */
  private drawClouds() {
    if (!this.cloudArea) {
      const ground = this.scene.children.find((o) => o.userData.kind === 'ground' && o.userData.fields);
      const f = ground?.userData.fields as MeshOptions['fields'] | undefined;
      // The turned square's bounds, and a little more.
      const half = f ? (f.side / 2) * (Math.abs(Math.cos(f.turn)) + Math.abs(Math.sin(f.turn))) + 2 : 64;
      this.cloudMap.setArea((f?.x ?? 0) - half, (f?.z ?? 0) - half, 2 * half);
      this.cloudArea = !!f;
    }
    this.cloudMap.draw(this.gl, this.weather.clouds, this.cloudShape);
  }
  private cloudArea = false;

  render(time: number) {
    if (!this.look) throw new Error('setLook before render');
    const t = this.timer;
    t?.mark('setup', false);
    const s = this.shared, w = this.wind;
    s.uTime.value = time;
    w.carried = this.weather.dust;
    w.update(time);
    s.uWindDir.value.set(w.dirX, w.dirZ);
    s.uWindSpeed.value = w.speed;
    s.uWindGustiness.value = w.gust;
    s.uWindDrift.value.set(w.driftX, w.driftZ);
    s.uWindFlutter.value = w.flutter;
    this.weather.update(time);
    this.applyLook(this.look);
    const grounded: THREE.Object3D[] = [];
    if (!this.settings.falling) {
      for (const o of this.scene.children) if (o.visible && FALLING.includes(o.userData.kind)) { o.visible = false; grounded.push(o); }
    }
    // Framed by the screen's pixels, not the pixels drawn: drawing fewer (maxPixels) makes the frame softer, not nearer.
    const toScreen = this.screenRatio / this.pixelRatio;
    this.view.apply(this.width * toScreen, this.height * toScreen);
    s.uViewBack.value.copy(this.view.backward());
    s.uViewTarget.value.copy(this.view.target);
    // Where each pixel is in the world, for the fog: the camera's frame, scaled to half the view.
    const cam = this.view.camera, pu = this.post.uniforms;
    pu.uCamPos.value.copy(cam.position);
    pu.uCamRight.value.setFromMatrixColumn(cam.matrixWorld, 0).multiplyScalar(cam.right);
    pu.uCamUp.value.setFromMatrixColumn(cam.matrixWorld, 1).multiplyScalar(cam.top);
    pu.uCamFwd.value.setFromMatrixColumn(cam.matrixWorld, 2).negate();
    this.scene.updateMatrixWorld();
    for (const [mesh, twin] of this.twins) twin.matrixWorld.copy(mesh.matrixWorld);
    const gl = this.gl;

    // The shelter map, only when cover has changed: nothing to do most frames.
    t?.mark('shelter', this.shelter.dirty);
    if (this.shelter.dirty) this.drawShelter();

    // The clouds' shade over the land, as the game has them now.
    t?.mark('clouds');
    this.drawClouds();

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
