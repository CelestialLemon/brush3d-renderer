import * as THREE from 'three';
import { cutIntoTiles } from './tiles';
import { CAMERA_DISTANCE, ViewCamera } from './camera';
import { CloudMap, MIRROR } from './cloudMap';
import { CLOUD_SHAPE, type CloudShape } from './clouds';
import { lookAt, type Look } from './look';
import { dayOf, REFERENCE_DAY, type Day, type SeasonSettings } from './season';
import { LEAF_STORM, seasonLight, seasonTurn, turnColours } from './seasonLook';
import { CLOUD_DEPTH, CLOUD_NIGHT, gapCover, OVERCAST, overcastLook, skyShare, UNDER_CLOUD_FADE } from './overcast';
import {
  createSharedUniforms, depthMaterial, basisBakeMaterial, groundBakeMaterial, prepassMaterial, sceneMaterial, WATER_REACH, type MaterialKind, type SharedUniforms,
} from './materials';
import { fogNoiseTexture, litFog } from './fog';
import { POST_FRAG, POST_VERT } from './post';
import { Lightning, type Flicker, type Strike } from './lightning';
import { Rain } from './rain';
import { ShelterMap, type Cover } from './shelter';
import type { PassTimer } from './timer';
import { WeatherState, type Weather } from './weather';
import { airLook, HEAT, heatShare } from './air';
import { GOLDEN, goldenLook, goldenShape, goldenShare } from './golden';
import { STORM, stormGold, stormLook, VIGNETTE } from './storm';
import { colourLeafStorm, leafStorm, WindField, WindState } from './wind';
import { DustField, type DustSource } from './dust';
import { TreeSprings, type TreeSpec } from './trees';
import { WATER_EASE, WaterField, type WaterMap } from './water';
import { GROUND_EASE, GroundField, HollowMap, type GroundMap } from './ground';
import { SnowPaint } from './snow';
import { earthShares } from './wet';
import type { WindSnapshot } from '../wind/sim';

// The renderer: the clouds' shade over the land (#8); a sun shadow map; for the water, the bed drawn without it and the
// scene mirrored in it (both at half size, and only round the water on screen); a multisampled G-buffer (colour plus view
// normal, depth and ink), its silhouettes drawn first so the painting runs only where a surface shows; and a post pass
// that inks the lines, hazes the distance and grades. It draws at the screen's own resolution: no art-pixel grid. docs/PERFORMANCE.md has what each pass costs.

// How much the gusts thicken and thin dust ('strong', the developer's pick of two, #9). A stopgap: the gusts are faint in
// a thick storm, and the wind's gusts are to be rebuilt as fronts sweeping the land, dust with them.
const DUST_GUST = 1.6;
/** Fresh dust's colour (sRGB, as the haze's): the tracks' pale earth, a little lighter in the air. */
const FRESH_DUST = new THREE.Color(0xc8a77a);

export interface RendererOptions {
  /** Shadow-map size in texels. */
  shadowMapSize?: number;
  /** The square of ground (centre and half-size, metres) the sun's shadow covers. */
  shadowCenter?: THREE.Vector3;
  shadowRadius?: number;
  /**
   * The shadow follows the view, for land bigger than one square can cover sharply: it covers just the ground on
   * screen, snapped to its texels so it holds still under a pan (see followView). Off, it stays on shadowCenter's square.
   */
  shadowFollow?: boolean;
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
  /**
   * The share of the falling strokes drawn (rain's, snow's to come): 1 at full quality, about a third reduced. It cuts how
   * many there are, not their look.
   */
  fallingShare: number;
  /** Show the shelter map over the frame: what's under cover, and the map from above in the corner. */
  shelterDebug: boolean;
}

/** What the renderer draws, by kind: the scene's materials, and the rain (rain.ts), which is the renderer's own. */
export type DrawnKind = MaterialKind | 'rain';

/** The kinds in the air, which settings.falling leaves out: the leaves the wind lifts and the rain, with its veil and
 * rings (snow to come). Dust is drawn in the haze (post.ts), keyed to the world like a fog's patches, so it stays. */
export const FALLING: readonly DrawnKind[] = ['debris', 'rain'];

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
  /**
   * Cut into tiles this many metres square, each drawn only when it's in a pass's view (see tiles.ts): for the big meshes
   * of a large map (the ground too: its fields are baked from every tile). Not the water. add() then returns the first
   * tile: remove() takes them all out with it, but moving or hiding it moves or hides only that tile.
   */
  tile?: number;
  /**
   * Turned by the season (seasonLook.ts): its greens take the season's colour. By default the ground and the grass (the
   * reeds among it); flowers' and garden plants' leaves opt in. Crops keep their own colour (their stage is the game's), and
   * so do the trees and what people make.
   */
  seasonal?: boolean;
}

export class BrushRenderer {
  readonly gl: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly view = new ViewCamera();
  readonly shared: SharedUniforms = createSharedUniforms();
  readonly settings: Settings = { lines: true, shadows: true, grain: 0.012, prepass: true, waterScissor: true, equalDepth: true, falling: true, fallingShare: 1, shelterDebug: false };
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
  private shadowFollow: boolean;
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
  private seasonSet: SeasonSettings | null = null;
  /** The leaves in the air (the wind's), which take the season's colours. */
  private debris!: THREE.Mesh;
  private dayNow: Day = REFERENCE_DAY;
  /** The geometries the season turns (MeshOptions.seasonal), and how many meshes in the scene draw each. */
  private seasonal = new Map<THREE.BufferGeometry, number>();
  /** Their colours as the game sent them, by colour attribute (a tile's copy of a geometry has its own), once turned. */
  private ownColours = new WeakMap<THREE.BufferAttribute, Float32Array>();
  /** The game's water as drawn (#18): its map, eased between updates, and the sheet drawn from it. */
  readonly water = new WaterField();
  private waterMesh: THREE.Mesh | null = null;
  /** The wind as drawn: the game's, as last given (see setWind), and its map on the GPU. Still until it's given. */
  readonly wind = new WindState();
  readonly windField = new WindField();
  /** Every tree's spring (the renderer's own motion: no game logic reads it). */
  readonly trees = new TreeSprings();
  private windNow: [WindSnapshot, WindSnapshot, number] | null = null;
  /** Fresh dust, lifted by the gusts where the game's map says (see setDustSource; the renderer's own motion). */
  readonly dust = new DustField();
  /** The weather as drawn: the cover as the game sent it, the looks easing towards it (see setWeather). */
  readonly weather = new WeatherState();
  /**
   * What's under cover, seen from above (see ShelterMap), for rain and snow to stop at. Drawn only when cover changes:
   * call shelter.changed() after moving cover; adding a mesh or showing or hiding a kind does it already.
   */
  readonly shelter: ShelterMap;
  /** The game's ground (#14): how deep the snow lies and where the frost is, its map eased between updates (see setGround). */
  readonly ground = new GroundField();
  /** The land's hollows and rises, found from the ground's shape: once, when there's first snow or frost to draw. */
  readonly hollows = new HollowMap();
  /** The lying snow's paint in the hour's light (#14), worked out once a frame. */
  private readonly snow = new SnowPaint();

  /** The falling rain (#11): its strokes, and the uniforms for its veil and the water's rings. */
  readonly rain: Rain;
  /** Lightning (#12): the game says where and when (strike, flicker); the player's flash setting is lightning.setting. */
  readonly lightning = new Lightning();
  /** Whether the rain is shown (setVisible), apart from whether it's raining. */
  private rainShown = true;
  /** The cloud field's shade over the land, drawn each frame the clouds move (#8). */
  readonly cloudMap: CloudMap;
  /** The cloud field again, coarser and further out: the sky the water and the solar glass mirror (MIRROR). */
  readonly skyMap: CloudMap;
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
    this.shadowFollow = options.shadowFollow ?? false;
    const half = () => new THREE.WebGLRenderTarget(1, 1, {
      count: 2, type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    });
    this.shelter = new ShelterMap(options.shelterSize ?? 1024);
    // Every material reads the shelter map, the ground's map and the land's hollows, for lying snow (#14) and wet ground
    // (#11).
    Object.assign(this.shared, this.shelter.uniforms, this.ground.uniforms, this.hollows.uniforms, this.snow.uniforms);
    this.rain = new Rain(this.shared, this.shelter.uniforms);
    this.scene.add(this.rain.mesh);
    this.cloudMap = new CloudMap(this.shared);
    this.skyMap = new CloudMap({ uCloudMap: this.shared.uSkyMap, uCloudRect: this.shared.uSkyRect }, MIRROR.size);
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
        uExposure: { value: 1 }, uSaturation: { value: 1 }, uNightShift: { value: 0 }, uShadeHue: { value: 0 }, uGrain: { value: 0.012 }, uVignette: { value: VIGNETTE },
        uCamPos: { value: new THREE.Vector3() }, uCamRight: { value: new THREE.Vector3() }, uCamUp: { value: new THREE.Vector3() },
        uCamFwd: { value: new THREE.Vector3() }, uFogColor: { value: new THREE.Color() }, uFog: { value: new THREE.Vector4() },
        tFogNoise: { value: fogNoiseTexture() },
        uDust: { value: new THREE.Vector3() }, uFogFrame: { value: new THREE.Vector4(1, 0, 1, 0) },
        uFogNext: { value: new THREE.Vector4(1, 0, 1, 0) }, uFogFade: { value: 0 }, uFogStreak: { value: new THREE.Vector2() },
        uWindSpeed: this.shared.uWindSpeed, uWindDir: this.shared.uWindDir, tWindA: this.shared.tWindA, tWindB: this.shared.tWindB,
        uWindBlend: this.shared.uWindBlend, uWindGrid: this.shared.uWindGrid, uWindOn: this.shared.uWindOn,
        uShimmer: { value: new THREE.Vector2() },
        tDustA: { value: this.dust.a }, tDustB: { value: this.dust.b }, uDustBlend: { value: 0 },
        uDustGrid: { value: this.dust.grid }, uDustOn: { value: 0 }, uDustColor: { value: new THREE.Color() }, uDustReach: { value: 4.5 },
        ...this.rain.veil,
        ...this.lightning.post, uShadowMap: this.shared.uShadowMap, uShadowMatrix: this.shared.uShadowMatrix,
      },
    });
    this.postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.post));
    this.silhouettes.visible = false;
    this.scene.add(this.silhouettes);
    // Leaves in the air, for strong winds: the renderer's own, round wherever the camera is.
    this.debris = this.add(leafStorm(), 'debris', { castShadow: false });
  }

  /**
   * The game's wind, each frame: its last two ticks' snapshots and how far the frame is between them, 0..1 (the wind
   * client's prev, cur and alpha; see src/wind and docs/WIND.md). Drawn exactly as given. With no game wind,
   * steadyWind gives one: setWind(w, w, 0).
   */
  setWind(prev: WindSnapshot, cur: WindSnapshot, alpha: number) {
    this.wind.set(prev, cur, alpha);
    this.windField.set(prev, cur, alpha);
    // Dust lifts only in a dust storm (a dust haze), a minor one too: half its full strength at a thin haze, none once the
    // haze has thinned away (it keeps its kind as it goes).
    const w = this.weather;
    this.dust.storm = w.dust * THREE.MathUtils.smoothstep(w.haze, 0, 0.1) * Math.min(1, 0.5 + w.haze / 0.5);
    this.dust.set(prev, cur, alpha);
    this.windNow = [prev, cur, alpha];
  }

  /**
   * Where dust can lift (#36): the game's map of bare, dry ground (DustSource), sent again when the ground dries or wets.
   * In a dust storm (the weather's dust haze), a gust lifts dust there, which the wind carries off and which lingers a
   * few seconds. Null: none.
   */
  setDustSource(source: DustSource | null) { this.dust.setSource(source); }

  /**
   * The weather the game wants (see Weather, and WEATHER_PRESETS for shorthands). The cloud cover is drawn exactly as given;
   * the looks (the light, rain and snow, heat, haze) ease towards it over a second or two, hiding the steps between the
   * game's updates; 'immediate' puts them there at once (a level loading, a screenshot).
   */
  setWeather(weather: Weather, immediate = false) { this.weather.set(weather, immediate); }

  /**
   * A lightning strike where the game says, now (#12): a bolt, a flash of the whole picture (within the flash limits,
   * whatever the game asks: see lightning.ts) and a glow where it landed. The land's height unless y is given.
   */
  strike(strike: Strike) {
    const land = (this.land ??= LandHeights.from(this.scene)) ?? LandHeights.FLAT;
    this.lightning.strike(strike, (x, z) => land.at(x, z), this.view.target, this.view.heading);
  }

  /** Distant lightning, now (#12): the scene softly lit, no bolt. The game calls each one. */
  flicker(flicker?: Flicker) { this.lightning.flicker(flicker); }

  /** The shared material of a kind (one per renderer, so meshes of a kind batch their state). */
  material(kind: MaterialKind) {
    let m = this.materials.get(kind);
    if (!m) {
      m = {
        main: sceneMaterial(kind, this.shared), depth: depthMaterial(kind, this.shared),
        prepass: prepassMaterial(kind, this.shared), mirrorPrepass: prepassMaterial(kind, this.shared, true),
      };
      // The rain's rings on the water, fewer under cover.
      if (kind === 'water') Object.assign(m.main.uniforms, this.shelter.uniforms, this.rain.uniforms);
      this.materials.set(kind, m);
    }
    return m.main;
  }

  /** Adds a mesh of a kind. By default it casts a shadow and is mirrored in the water (water itself is neither). */
  add(geometry: THREE.BufferGeometry, kind: MaterialKind, options: MeshOptions = {}): THREE.Mesh {
    if (options.tile && kind !== 'water') {
      // Returns the first tile, standing for them all to remove(). Cut from the game's colours, if the season has turned
      // them (the geometry is drawn already), so each tile keeps its own to turn.
      const colour = geometry.getAttribute('color') as THREE.BufferAttribute | undefined, own = colour && this.ownColours.get(colour);
      const turned = own && Float32Array.from(colour.array as Float32Array);
      if (own) (colour.array as Float32Array).set(own);
      const cut = cutIntoTiles(geometry, options.tile);
      if (turned) (colour!.array as Float32Array).set(turned);
      const tiles = cut.map((g) => this.addOne(g, kind, options, true));
      tiles[0].userData.tiles = tiles;
      return tiles[0];
    }
    return this.addOne(geometry, kind, options, false);
  }

  private addOne(geometry: THREE.BufferGeometry, kind: MaterialKind, options: MeshOptions, cull: boolean) {
    // Its trees join the springs, numbered across every mesh (the same tree's wood and leaves, the same spring).
    const trees = geometry.userData.trees as TreeSpec[] | undefined, ids = geometry.getAttribute('aTreeId');
    if (trees?.length && ids) {
      const map = this.trees.add(trees), a = ids.array as Float32Array;
      for (let i = 0; i < a.length; i++) a[i] = map[a[i]];
      geometry.userData.trees = undefined;
    }
    const seasonal = options.seasonal ?? (kind === 'ground' || kind === 'grass');
    // Where the ground is earth (#11, wet.ts), from the game's colours, before the season turns them.
    const colour = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
    if (kind === 'ground' && colour && !geometry.getAttribute('aEarth')) {
      geometry.setAttribute('aEarth', new THREE.BufferAttribute(earthShares(this.ownColours.get(colour) ?? colour.array), 1));
    }
    if (seasonal) this.seasonal.set(geometry, (this.seasonal.get(geometry) ?? 0) + 1);
    this.turn(geometry);
    const mesh = new THREE.Mesh(geometry, this.material(kind));
    mesh.userData.seasonal = seasonal;
    mesh.frustumCulled = cull;
    mesh.userData.kind = kind;
    mesh.userData.under = options.under ?? false;
    mesh.userData.reflect = options.reflect ?? kind !== 'water';
    mesh.userData.fields = options.fields;
    mesh.userData.cover = options.cover ?? (kind === 'ink' ? 'full' : kind === 'foliage' ? 'partial' : 'none');
    // (The ground too: the shelter's map of the land, where the rain lands.)
    if (mesh.userData.cover !== 'none' || kind === 'ground') this.shelter.changed();
    if (kind === 'ground') this.cloudArea = false;
    this.scene.add(mesh);
    if (kind === 'ground') { this.setHazeGround(); this.land = null; this.hollows.changed(); }
    if (options.castShadow ?? kind !== 'water') this.casters.push(mesh);
    const twin = new THREE.Mesh(geometry, this.materials.get(kind)!.prepass);
    twin.frustumCulled = cull;
    twin.renderOrder = -1;
    twin.matrixAutoUpdate = false;
    twin.matrixWorldAutoUpdate = false;
    this.silhouettes.add(twin);
    this.twins.push([mesh, twin]);
    return mesh;
  }

  /** Takes out a mesh added before (a building removed): from the scene, the sun's shadow, the silhouettes and the shelter. */
  remove(mesh: THREE.Mesh) {
    // A mesh cut into tiles goes whole.
    const tiles = mesh.userData.tiles as THREE.Mesh[] | undefined;
    if (tiles) { for (const t of tiles) { t.userData.tiles = undefined; this.remove(t); } return; }
    this.scene.remove(mesh);
    if (mesh.userData.seasonal) this.unseason(mesh.geometry);
    this.casters = this.casters.filter((m) => m !== mesh);
    const i = this.twins.findIndex(([m]) => m === mesh);
    if (i >= 0) { this.silhouettes.remove(this.twins[i][1]); this.twins.splice(i, 1); }
    if (mesh.userData.cover !== 'none' || mesh.userData.kind === 'ground') this.shelter.changed();
    if (mesh.userData.kind === 'ground') { this.setHazeGround(); this.cloudArea = false; this.land = null; this.hollows.changed(); }
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
      // Every piece of it, if it was cut into tiles.
      for (const piece of meshes.filter((m) => m.userData.fields)) {
        const flat = new THREE.Mesh(piece.geometry, material);
        flat.frustumCulled = false;
        piece.updateMatrixWorld();
        flat.matrixWorld.copy(piece.matrixWorld);
        flat.matrixAutoUpdate = false;
        flat.matrixWorldAutoUpdate = false;
        scene.add(flat);
      }
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
  setVisible(kind: DrawnKind, visible: boolean) {
    if (kind === 'rain') { this.rainShown = visible; return; }
    if (kind === 'water') {
      this.waterShown = visible;
      if (this.waterMesh) this.waterMesh.visible = visible && this.water.any;
      return;
    }
    for (const o of this.scene.children) {
      if (o.userData.kind !== kind || o.visible === visible) continue;
      o.visible = visible;
      if (o.userData.cover !== 'none' || kind === 'ground') this.shelter.changed();
    }
  }

  /**
   * The game's water (#18, see WaterMap): its surface, flow and mud over a grid, sent again whenever it changes. A changed
   * map eases in over `ease` seconds (a moment by default, so a rising flood creeps rather than steps; 0 at once, for a
   * level loading or a screenshot). Null: no water.
   */
  setWater(map: WaterMap | null, ease = WATER_EASE) {
    const before = this.water.geometry;
    this.water.set(map, this.shared.uTime.value, ease);
    const s = this.shared;
    s.tWaterA.value = this.water.a; s.tWaterB.value = this.water.b; s.uWaterGrid.value.copy(this.water.grid);
    if (this.water.geometry !== before || !this.waterMesh) {
      if (this.waterMesh) this.remove(this.waterMesh);
      this.waterMesh = this.water.geometry ? this.add(this.water.geometry, 'water') : null;
    }
    if (this.waterMesh) this.waterMesh.visible = this.water.any && this.waterShown;
    this.setHazeGround();
  }
  /** Whether the water is shown (setVisible), apart from whether there is any. */
  private waterShown = true;

  /**
   * The game's ground (#14, #11, see GroundMap and docs/GROUND.md): how deep the snow lies, where the frost is, how wet
   * the land is and how muddy, over a grid as the water's is, sent again whenever it changes. A changed map eases in over
   * `ease` seconds (0 at once). None settles or wets under a roof, and less under a crown: that, and how a thin cover
   * breaks along the land, are the renderer's.
   * Null: bare everywhere.
   */
  setGround(map: GroundMap | null, ease = GROUND_EASE) { this.ground.set(map, this.shared.uTime.value, ease); }



  /**
   * A haze on the ground starts just under the lowest land: the ground's lowest point (it's laid in world space, its brush
   * baked by place), or the water's bed if lower.
   */
  private setHazeGround() {
    let low = this.water.floor === null ? Infinity : this.water.floor - 1;
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
   * The level's season (#13), set once per level: its sunrise and sunset (the game's, which its solar power follows), and
   * from them the day the hour's looks follow (season.ts). Until it's set (or set to null), the looks keep the reference
   * day's hours.
   */
  setSeason(season: SeasonSettings | null) {
    this.seasonSet = season && { ...season };
    this.dayNow = season ? dayOf(season) : REFERENCE_DAY;
    // Its colours, turned once here (the season holds all level): from each mesh's own, as the game sent them.
    for (const g of this.seasonal.keys()) this.turn(g);
    colourLeafStorm(this.debris.geometry, season ? LEAF_STORM[season.season] : null);
  }
  /** A seasonal geometry's mesh is taken out: with its last, its colours go back to the game's. */
  private unseason(geometry: THREE.BufferGeometry) {
    const users = this.seasonal.get(geometry);
    if (users === undefined) return;
    if (users > 1) { this.seasonal.set(geometry, users - 1); return; }
    this.seasonal.delete(geometry);
    const colour = geometry.getAttribute('color') as THREE.BufferAttribute | undefined, own = colour && this.ownColours.get(colour);
    if (!colour || !own) return;
    // Not while another seasonal geometry draws the same colours.
    for (const g of this.seasonal.keys()) if (g.getAttribute('color') === colour) return;
    (colour.array as Float32Array).set(own);
    colour.needsUpdate = true;
    this.ownColours.delete(colour);
  }
  /** Turns a seasonal geometry's colours by the season, from its own (kept the first time). */
  private turn(geometry: THREE.BufferGeometry) {
    if (!this.seasonal.has(geometry)) return;
    const colour = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
    if (!colour) return;
    const t = seasonTurn(this.seasonSet);
    let own = this.ownColours.get(colour);
    // Untouched while no season has turned it: no copy kept.
    if (!own && t.shift === 0 && t.chroma === 1 && t.light === 0) return;
    if (!own) this.ownColours.set(colour, own = Float32Array.from(colour.array as Float32Array));
    turnColours(own, colour.array as Float32Array, t);
    colour.needsUpdate = true;
  }
  /** The season as set, or null before setSeason. */
  get season(): SeasonSettings | null { return this.seasonSet && { ...this.seasonSet }; }
  /** The day the hour's looks follow: the season's, or the reference day's. */
  get day(): Day { return this.dayNow; }

  /** Sets the look at a clock hour of the season's day (look.ts's lookAt): what the game calls as its clock runs. */
  setHour(hour: number) { this.look = seasonLight(lookAt(hour, this.dayNow), this.seasonSet); }

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
    const w = this.weather, air = (l: Look) => airLook(l, w, HEAT);
    // A storm (storm.ts) darkens the light under a cloud, the gaps' as far as they've turned overcast (the sun in a gap is
    // still the sun), and the grade as far as the sky is covered.
    const st = w.storm, stormy = (l: Look, k: number) => stormLook(l, st * k);
    // Golden hour under a deck (golden.ts): the light under the cloud turned back towards the low sun's, and the gaps' as
    // far as they've turned overcast; the grade only in its haze's colour. Under a storm, at any hour of the day, in gold.
    const g = goldenShare(w.sunUnder, clear, cover, st) * strength, breaking = stormGold(clear, st);
    const gold = (l: Look, k: number) => goldenLook(l, breaking, GOLDEN, g * k);
    const graded = stormy(overcastLook(clear, cover, r), cover), grade = air({ ...graded, hazeColor: gold(graded, cover).hazeColor });
    const look = air(gold(stormy(overcastLook(clear, gap, r), gap), gap)), under = air(gold(stormy(overcastLook(clear, 1, r), 1), 1));
    const s = this.shared, rs = goldenShape(r, GOLDEN, g);
    const shape = skyShare(gap), lift = shape * rs.shadowLift;
    s.uOvercast.value.set(shape * rs.sky, shape * rs.shadowFade, shape * rs.shadowBlur);
    s.uCloudOvercast.value.set(rs.sky, THREE.MathUtils.lerp(THREE.MathUtils.lerp(UNDER_CLOUD_FADE, r.shadowFade, lift), rs.shadowFade, g), rs.shadowBlur);
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
    // A storm's lit tint and shade lean under a cloud, from the gaps': only under a storm, so without one every frame is
    // as it was (the gaps' and a cloud's lit hue can differ a little in golden light under part cover; left as it was).
    if (st > 0) s.uCloudTint.value.set(rad(((under.litHue - look.litHue + 540) % 360) - 180), under.shadeLean - look.shadeLean);
    else s.uCloudTint.value.set(0, 0);
    // The lying snow's paint in that light (#14), in the gaps and under a cloud (its lit hue a storm's tint, as the shaders').
    this.snow.update(
      { shadeHue: look.shadeHue, litHue: look.litHue, sky: s.uOvercast.value.x, sunColor: s.uSunColor.value, skyColor: look.skyColor },
      { shadeHue: look.shadeHue + s.uCloudBands.value.x * 180 / Math.PI, litHue: look.litHue + s.uCloudTint.value.x * 180 / Math.PI, sky: s.uCloudOvercast.value.x, sunColor: s.uCloudSunColor.value, skyColor: look.skyColor },
    );
    const u = this.post.uniforms;
    u.uHazeColor.value.copy(grade.hazeColor); u.uHazeDensity.value = grade.hazeDensity; u.uHazeMax.value = grade.hazeMax; u.uHazeFloor.value = grade.hazeFloor;
    u.uSkyTop.value.copy(grade.skyTop); u.uSkyBottom.value.copy(grade.skyBottom);
    s.uSkyTop.value.copy(grade.skyTop); s.uSkyBottom.value.copy(grade.skyBottom);
    // The sky the water and the solar glass mirror: the gaps', and the clouds in it, lit by the hour (dimly by the moon),
    // thickening into the overcast sky as it closes.
    s.uGapSkyTop.value.copy(look.skyTop); s.uGapSkyBottom.value.copy(look.skyBottom);
    s.uCloudBelly.value.copy(under.skyTop).lerp(under.skyBottom, 0.25);
    // The deck stays as grey in the mirror when the low sun lights the land under it: by the gaps' change of light, which
    // is the light under a cloud's once the sky has closed (under part cover, where the gaps are in the sun, it's none).
    if (g > 0) s.uCloudBelly.value.multiplyScalar(air(stormy(overcastLook(clear, gap, r), gap)).exposure / look.exposure);
    const sun = clear.sunColor, warm = new THREE.Color(1, 1, 1).lerp(sun.clone().multiplyScalar(1 / Math.max(sun.r, sun.g, sun.b, 1e-3)), 0.85);
    s.uCloudLit.value.copy(look.skyBottom).lerp(warm, 0.7 * THREE.MathUtils.lerp(0.15, 1, dim));
    s.uSkyClosed.value = gap;
    u.uVignette.value = THREE.MathUtils.lerp(VIGNETTE, STORM.vignette, st * cover);
    u.uExposure.value = grade.exposure; u.uSaturation.value = grade.saturation; u.uNightShift.value = grade.nightShift; u.uShadeHue.value = rad(grade.shadeHue);
    // Lightning, over the hour and the weather (and before the fog takes its colour from the light).
    this.lightning.light(s);
    if (this.lightning.aiming) this.shadowDir.copy(this.lightning.boltLight);
    this.applyFog();
    u.uShimmer.value.set(heatShare(look, w.heat) * HEAT.shimmer, this.shared.uTime.value);
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
    const floor = Math.max(w.hazeBase, this.water.floor ?? w.hazeTop - 4);
    u.uFog.value.set(w.haze * thin, w.hazeBase, w.hazeTop, Math.max(0.5, 0.7 * (w.hazeTop - floor)));
    // The patches drift downwind and are drawn out along it, dust's faster and further (WindState); dust's streaks blow
    // by faster still, stronger as the wind rises, and the gusts sweep it in in waves.
    const a = wind.haze, b = wind.hazeNext ?? a;
    u.uFogFrame.value.set(a.hx, a.hz, a.stretch, a.drift);
    u.uFogNext.value.set(b.hx, b.hz, b.stretch, b.drift);
    u.uFogFade.value = wind.hazeNext ? wind.hazeFade : 0;
    u.uFogStreak.value.set(a.streak, b.streak);
    u.uDust.value.set(w.dust, 0.25 + 0.5 * Math.min(wind.speed / 25, 1), DUST_GUST);
    // Fresh dust: the earth's colour, or a dusty air's where there is one, lit as the fog is.
    const f = this.dust;
    u.tDustA.value = f.a; u.tDustB.value = f.b; u.uDustBlend.value = f.blend; u.uDustOn.value = f.any ? 1 : 0;
    u.uDustReach.value = f.look.top + 0.5;
    litFog(u.uDustColor.value, FRESH_DUST.clone().lerp(w.hazeColor, w.dust), s.uSunColor.value, s.uSkyColor.value);
    this.rain.setVeilColor((out, base) => litFog(out, base, s.uSunColor.value, s.uSkyColor.value));
  }

  private updateSunCamera() {
    const c = this.sunCamera, sun = this.shared.uSunDir.value;
    // Up in the shadow map is away from the sun's bearing (the same as the world's up for the sun itself), which holds
    // still while the cloud turns the shadows overhead: switching it near overhead would turn the map's texels at once.
    c.up.set(-sun.x, 0, -sun.z);
    if (c.up.lengthSq() < 1e-6) c.up.set(0, 0, 1);
    c.near = 1; c.far = 300;
    if (this.shadowFollow) {
      // Slid along the sun's own line to beside the view: that moves nothing across the map, so the map's texels stay
      // on the same ground wherever the view is, and only the window onto them (followView) moves.
      const t = this.view.target, d = this.shadowDir;
      c.position.copy(d).multiplyScalar(d.dot(t) + 150);
      c.lookAt(c.position.clone().sub(d));
      c.updateMatrixWorld();
      this.followView();
    } else {
      const r = this.shadowRadius;
      c.left = -r; c.right = r; c.top = r; c.bottom = -r;
      c.position.copy(this.shadowCenter).addScaledVector(this.shadowDir, 150);
      c.lookAt(this.shadowCenter);
    }
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.shared.uShadowMatrix.value.copy(bias).multiply(c.projectionMatrix).multiply(c.matrixWorldInverse);
    this.shadowDirty = true;
  }
  private shadowDirty = true;

  /**
   * The shadow's window for the view (see shadowFollow): just the ground the camera sees, as the sun sees it. A grid of
   * points across the screen, each traced down to the land and up again by what stands on it, bounds everything on
   * screen; the sun's view of them holds every shadow that can show, whatever off-screen throws it (a shadow and what
   * throws it fall on the same point of the map). Its size in steps of 4 m, so the texels' size changes only now and
   * then (a zoom, a turn, a hill), and its edges on whole texels, so a pan doesn't make the shadows' edges crawl.
   */
  private followView() {
    const c = this.sunCamera, v = this.view.camera;
    v.updateMatrixWorld();
    const land = (this.land ??= LandHeights.from(this.scene)) ?? LandHeights.FLAT;
    const toSun = c.matrixWorldInverse, fwd = new THREE.Vector3(0, 0, -1).transformDirection(v.matrixWorld);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const p = new THREE.Vector3(), edge = new THREE.Vector3();
    const take = () => {
      p.applyMatrix4(toSun);
      x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
    };
    const N = 8;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      edge.set(THREE.MathUtils.lerp(v.left, v.right, i / N), THREE.MathUtils.lerp(v.bottom, v.top, j / N), 0).applyMatrix4(v.matrixWorld);
      const hit = land.trace(edge, fwd);
      // Where the land is, and what stands on it up to TALL above.
      p.copy(edge).addScaledVector(fwd, hit); take();
      p.copy(edge).addScaledVector(fwd, hit + LandHeights.TALL / fwd.y); take();
    }
    // A little round it for the shadows' soft edges, and for the land between the points. The size grows at once, in
    // steps of 8 m, but shrinks only when well too big: the land under a pan changes what's needed a little, and every
    // change of size moves every texel, so it mustn't flick back and forth.
    const size = (have: number, need: number) => need > have || need < have - 16 ? Math.ceil(need / 8) * 8 : have;
    // A flash aimed at the bolt keeps its own, so the sun's shadow comes back to exactly where it was.
    const aimed = this.lightning.aiming, held = aimed ? this.flashShadowSize : this.shadowSize;
    if (!aimed) this.flashShadowSize = [0, 0];
    const w = (held[0] = size(held[0], x1 - x0 + 6));
    const h = (held[1] = size(held[1], y1 - y0 + 6));
    const tx = w / this.shadowTarget.width, ty = h / this.shadowTarget.height;
    c.left = Math.round(((x0 + x1) / 2 - w / 2) / tx) * tx; c.right = c.left + w;
    c.bottom = Math.round(((y0 + y1) / 2 - h / 2) / ty) * ty; c.top = c.bottom + h;
  }
  /** The land's heights, for followView: from the ground mesh, once it's there. */
  private land: LandHeights | null = null;
  /** The shadow window's size across and up the map (metres), held between frames (followView). */
  private shadowSize: [number, number] = [0, 0];
  private flashShadowSize: [number, number] = [0, 0];
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

  /**
   * The most the reflection is read off its own pixel for water above or below the surface it's drawn about (WATER_VERT's
   * vMirrorShift), in screen uv.
   */
  private mirrorShift() {
    const f = this.water, dh = 2 * Math.max(f.wetHigh - f.mirror, f.mirror - f.shownLow, 0);
    const cam = this.view.camera, m = new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse).elements;
    // The y column: where a step up the world moves on screen.
    return new THREE.Vector2(m[4] * dh * 0.5, m[5] * dh * 0.5);
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
  private waterRect(onScreen: THREE.Box2, target: THREE.WebGLRenderTarget, reach: number, px: number, shift = new THREE.Vector2()) {
    if (!this.settings.waterScissor) return null;
    const w = target.width, h = target.height;
    const rx = reach + Math.abs(shift.x) + px / this.width, ry = reach + Math.abs(shift.y) + px / this.height;
    const x0 = Math.max(0, Math.floor(((onScreen.min.x + 1) / 2 - rx) * w) - 2);
    const y0 = Math.max(0, Math.floor(((onScreen.min.y + 1) / 2 - ry) * h) - 2);
    const x1 = Math.min(w, Math.ceil(((onScreen.max.x + 1) / 2 + rx) * w) + 2);
    const y1 = Math.min(h, Math.ceil(((onScreen.max.y + 1) / 2 + ry) * h) + 2);
    return new THREE.Vector4(x0, y0, x1 - x0, y1 - y0);
  }

  /** Draws the shelter map: the cover meshes with their sun-shadow materials, from above, the wind stilled. */
  private drawShelter() {
    // The roofs and crowns, and the land (the ground) for where the rain lands.
    const cover = this.scene.children.filter((o): o is THREE.Mesh => (o as THREE.Mesh).isMesh && o.userData.cover !== undefined)
      .map((mesh) => ({
        mesh, cover: mesh.userData.kind === 'ground' ? 'land' as const : mesh.userData.cover as Cover,
        depth: this.materials.get(mesh.userData.kind)!.depth,
      }));
    const s = this.shared;
    this.shelter.draw(this.gl, this.scene, cover, this.groundSquare(), () => {
      // Every wind value and the clock set to one rest, whatever the weather, and the flutter kept across the map's own
      // view (straight down), not the camera's: what's left of the sway and the flutter (a little even in a calm) is then
      // the same every draw, so a new building can't nudge a tree's dry patch.
      const saved = [s.uTime.value, s.uWindSpeed.value, s.uWindOn.value, s.uWindFlutter.value,
        s.uWindDir.value.clone(), s.uWindDrift.value.clone(), s.uViewBack.value.clone()] as const;
      s.uTime.value = 0; s.uWindSpeed.value = 0; s.uWindOn.value = 0; s.uWindFlutter.value = 0;
      s.uWindDir.value.set(1, 0); s.uWindDrift.value.set(0, 0); s.uViewBack.value.set(0, 1, 0);
      return () => {
        [s.uTime.value, s.uWindSpeed.value, s.uWindOn.value, s.uWindFlutter.value] = saved;
        s.uWindDir.value.copy(saved[4]); s.uWindDrift.value.copy(saved[5]); s.uViewBack.value.copy(saved[6]);
      };
    });
  }

  /**
   * The ground's square, for the maps over it (the shelter, the hollows): its brush's, or without one a square round all
   * of the ground (from #11's #50). Null with no ground.
   */
  private groundSquare(): NonNullable<MeshOptions['fields']> | null {
    const grounds = this.scene.children.filter((o): o is THREE.Mesh => (o as THREE.Mesh).isMesh && o.userData.kind === 'ground');
    const square = grounds.find((g) => g.userData.fields)?.userData.fields as MeshOptions['fields'] | undefined;
    if (square || !grounds.length) return square ?? null;
    const box = new THREE.Box3();
    for (const g of grounds) box.expandByObject(g);
    const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    return { x: c.x, z: c.z, side: Math.max(size.x, size.z), turn: 0 };
  }

  /** Finds the land's hollows (HollowMap): every piece of the ground, from above, over its square. */
  private drawHollows() {
    const grounds = this.scene.children.filter((o): o is THREE.Mesh => (o as THREE.Mesh).isMesh && o.userData.kind === 'ground' && o.visible);
    const depth = this.materials.get('ground')?.depth;
    if (depth) this.hollows.draw(this.gl, this.scene, grounds, depth, this.groundSquare(), this.shelter.uniforms);
  }

  /**
   * Draws the cloud map and the sky map (when the clouds or their shape have changed), over the ground's square: found again whenever
   * ground is added or taken out, and each frame until there is some.
   */
  private drawClouds() {
    if (!this.cloudArea) {
      const ground = this.scene.children.find((o) => o.userData.kind === 'ground' && o.userData.fields);
      const f = ground?.userData.fields as MeshOptions['fields'] | undefined;
      // The turned square's bounds, and a little more.
      const half = f ? (f.side / 2) * (Math.abs(Math.cos(f.turn)) + Math.abs(Math.sin(f.turn))) + 2 : 64;
      this.cloudMap.setArea((f?.x ?? 0) - half, (f?.z ?? 0) - half, 2 * half);
      this.shared.uLandSquare.value.set(f?.x ?? 0, f?.z ?? 0, f ? f.side / 2 : 0, f?.turn ?? 0);
      const sky = half + MIRROR.height / MIRROR.rise;
      this.skyMap.setArea((f?.x ?? 0) - sky, (f?.z ?? 0) - sky, 2 * sky);
      this.cloudArea = !!f;
    }
    this.cloudMap.draw(this.gl, this.weather.clouds, this.cloudShape);
    this.skyMap.draw(this.gl, this.weather.clouds, this.cloudShape);
  }
  private cloudArea = false;
  private windNowVector = new THREE.Vector2();
  private lightningCompiled = false;

  render(time: number) {
    if (!this.look) throw new Error('setHour (or setLook) before render');
    const t = this.timer;
    t?.mark('setup', false);
    const s = this.shared, w = this.wind;
    s.uTime.value = time;
    w.carried = this.weather.dust;
    w.update(time);
    s.uWindDir.value.set(w.dirX, w.dirZ);
    s.uWindSpeed.value = w.speed;
    s.uWindDrift.value.set(w.driftX, w.driftZ);
    const f = this.windField;
    s.tWindA.value = f.a; s.tWindB.value = f.b; s.tWindUsual.value = f.usual; s.uWindBlend.value = f.blend; s.uWindGrid.value.copy(f.grid);
    this.trees.update(time, this.windNow, w.gust);
    s.tTreePose.value = this.trees.texture;
    s.uWindFlutter.value = w.flutter;
    this.weather.update(time);
    s.uWaterBlend.value = this.water.blend(time);
    if (this.water.settle(time) && this.waterMesh) this.waterMesh.visible = false;
    s.uMirrorY.value = this.water.mirror;
    s.uWaterHigh.value = this.water.any ? this.water.wetHigh : -1e6;
    this.ground.update(time);
    // The land's height, known before a strike is asked for (see strike): worked out on the first frame, not during one.
    this.land ??= LandHeights.from(this.scene);
    if (!this.lightningCompiled) { this.lightning.precompile(this.gl, this.view.camera); this.lightningCompiled = true; }
    // How far the screen reaches from its middle, on the land (m): across, and up it (foreshortened by the 30° pitch).
    const reach = (this.view.camera.right + this.view.camera.top * 2) / 2;
    this.lightning.update(this.view.target, this.view.zoom, reach, this.width, this.height, this.gbuffer.textures[1]);
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
    // The shadow's window, for the view as it is now (the look set it for the last).
    if (this.shadowFollow) this.updateSunCamera();
    // Where each pixel is in the world, for the fog: the camera's frame, scaled to half the view.
    const cam = this.view.camera, pu = this.post.uniforms;
    pu.uCamPos.value.copy(cam.position);
    pu.uCamRight.value.setFromMatrixColumn(cam.matrixWorld, 0).multiplyScalar(cam.right);
    pu.uCamUp.value.setFromMatrixColumn(cam.matrixWorld, 1).multiplyScalar(cam.top);
    pu.uCamFwd.value.setFromMatrixColumn(cam.matrixWorld, 2).negate();
    // The rain, with the weather as drawn and the view as it is now.
    this.rain.update(time, this.weather.rain, this.view.zoom, this.pixelRatio / this.screenRatio, this.settings.fallingShare,
      this.settings.falling && this.rainShown, this.windNowVector.copy(s.uWindDir.value).multiplyScalar(s.uWindSpeed.value),
      cam, this.view.target.y);
    this.scene.updateMatrixWorld();
    for (const [mesh, twin] of this.twins) twin.matrixWorld.copy(mesh.matrixWorld);
    const gl = this.gl;

    // The shelter map, only when cover has changed: nothing to do most frames.
    t?.mark('shelter', this.shelter.dirty);
    // The hollows map holds the ground's shelter too: found again with it.
    if (this.shelter.dirty) { this.drawShelter(); this.hollows.changed(); }
    // The land's hollows (#14): once there's snow or frost, and again only when the ground or its shelter changes.
    const hollows = this.ground.any && this.hollows.dirty;
    t?.mark('hollows', hollows);
    if (hollows) this.drawHollows();

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
    if (water) {
      // The bed under the water takes no snow or frost (#14): 2 tells the materials to leave out what's below the water's
      // top (the banks above it keep theirs, as the ripples' nudge shows them through the water's edge).
      const ground = this.ground.uniforms.uGroundOn, on = ground.value;
      if (on > 0.5) ground.value = 2;
      this.drawOnly(this.underTarget, (m) => m.userData.under, this.waterRect(water, this.underTarget, nudge, 0));
      ground.value = on;
    }
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
      const rect = this.waterRect(water, this.reflectTarget, nudge * WATER_REACH.reflectNudge, WATER_REACH.blurPx, this.mirrorShift());
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
    t?.mark('bolt', this.lightning.active);
    this.lightning.draw(gl, cam, u.uHazeColor.value);
    for (const o of grounded) o.visible = true;
    t?.endFrame();
  }
}

/**
 * The land's highest ground in each cell of a coarse grid, from the ground mesh, to trace the view's rays down to it
 * (followView). Off the grid, and without a ground mesh, the land is flat at 0.
 */
class LandHeights {
  /** How tall what stands on the land can be and still catch a shadow worth drawing (trees, roofs, the windmill's sails). */
  static readonly TALL = 16;
  static readonly CELL = 2;
  static readonly FLAT = new LandHeights(0, 0, 0, 0, new Float32Array(0), 0, 0);
  constructor(readonly x0: number, readonly z0: number, readonly nx: number, readonly nz: number, readonly max: Float32Array,
    readonly lo: number, readonly hi: number) {}

  static from(scene: THREE.Scene): LandHeights | null {
    const box = new THREE.Box3();
    const grounds = scene.children.filter((o): o is THREE.Mesh => o.userData.kind === 'ground' && (o as THREE.Mesh).isMesh);
    for (const o of grounds) box.expandByObject(o);
    if (box.isEmpty()) return null;
    const C = LandHeights.CELL, nx = Math.ceil((box.max.x - box.min.x) / C) + 1, nz = Math.ceil((box.max.z - box.min.z) / C) + 1;
    const max = new Float32Array(nx * nz).fill(box.min.y);
    const p = new THREE.Vector3();
    for (const o of grounds) {
      const pos = o.geometry.getAttribute('position');
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
        const k = Math.floor((p.z - box.min.z) / C) * nx + Math.floor((p.x - box.min.x) / C);
        if (p.y > max[k]) max[k] = p.y;
      }
    }
    return new LandHeights(box.min.x, box.min.z, nx, nz, max, box.min.y, box.max.y);
  }

  /** The ground's highest point in the cell round (x, z), and its neighbours' (a vertex on a cell's edge counts for both). */
  at(x: number, z: number) {
    const C = LandHeights.CELL, i = Math.floor((x - this.x0) / C), j = Math.floor((z - this.z0) / C);
    let m = -Infinity;
    for (let dj = -1; dj <= 0; dj++) for (let di = -1; di <= 0; di++) {
      const a = i + di, b = j + dj;
      if (a >= 0 && b >= 0 && a < this.nx && b < this.nz) m = Math.max(m, this.max[b * this.nx + a]);
    }
    return m === -Infinity ? 0 : m;
  }

  /** How far along the ray (from, dir, pointing down) it reaches the land, to a metre or so. */
  trace(from: THREE.Vector3, dir: THREE.Vector3) {
    if (this.nx === 0) return -from.y / dir.y;
    // From where it comes down past the land's highest to where it passes below its lowest.
    let t = Math.max(0, (this.hi - from.y) / dir.y);
    const end = (this.lo - from.y) / dir.y;
    for (; t < end; t += 1) {
      const x = from.x + dir.x * t, y = from.y + dir.y * t, z = from.z + dir.z * t;
      if (y <= this.at(x, z)) return t;
    }
    return end;
  }
}
