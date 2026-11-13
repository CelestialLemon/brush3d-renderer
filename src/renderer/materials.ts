import * as THREE from 'three';
import { CLOUD_LIGHT, GBUFFER_OUT, LIGHT_UNIFORMS, MIRROR_SKY, NOISE, OKLAB, PAINT, SHADOW } from './glsl';
import { WIND_GLSL } from './wind';
import { HIDDEN_DIVE, WATER_MAP_GLSL } from './water';
import { RAIN_RINGS_GLSL } from './rain';
import { SHELTER_GLSL } from './shelter';
import { SNOW_GLSL } from './snow';
import { WET_GLSL, WET_INK_GLSL } from './wet';

// The scene's materials. Each has a main variant (writes colour and the G-buffer) and a depth variant for the sun's
// shadow map, built from the same vertex code so wind and billboarding cast the shadows they should.
//
// Two families, the split the look is built on:
//   painted: ground, grass, foliage, water, crops. No lines; soft brush-broken bands, colour drifting across a surface.
//   inked:   what the player builds or moves. Crisp cel bands; the post pass draws its lines.

/** Uniforms every scene material shares by reference: setting one value updates them all. */
export function createSharedUniforms() {
  return {
    uSunDir: { value: new THREE.Vector3(0.3, 0.8, 0.5).normalize() },
    uSunColor: { value: new THREE.Color(1, 1, 1) },
    uSkyColor: { value: new THREE.Color(1, 1, 1) },
    uRimColor: { value: new THREE.Color(1, 0.8, 0.4) },
    uShadeHue: { value: -1.6 },
    uShadeLean: { value: 0.3 },
    uShadeDepth: { value: 0.3 },
    uLitHue: { value: 1.3 },
    uLitLean: { value: 0.1 },
    uOvercast: { value: new THREE.Vector3() },
    uTime: { value: 0 },
    uWindDir: { value: new THREE.Vector2(1, 0) },
    uWindSpeed: { value: 0 },
    uWindDrift: { value: new THREE.Vector2() },
    uWindFlutter: { value: 0 },
    // The game's wind map (WindField): its last two ticks, the frame's share between them, where it lies, and 0 to read a
    // still wind.
    tWindA: { value: null as THREE.Texture | null },
    tWindB: { value: null as THREE.Texture | null },
    tWindUsual: { value: null as THREE.Texture | null },
    uWindBlend: { value: 0 },
    uWindGrid: { value: new THREE.Vector4(0, 0, 1, 1) },
    uWindOn: { value: 1 },
    // Every tree's top, pushed over by the wind on its spring (TreeSprings): x and z in metres, one texel a tree.
    tTreePose: { value: null as THREE.Texture | null },
    uViewBack: { value: new THREE.Vector3(0, 0, 1) },
    uViewTarget: { value: new THREE.Vector3() },
    uShadowMap: { value: null as THREE.Texture | null },
    uShadowMatrix: { value: new THREE.Matrix4() },
    uShadowTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },
    uMirror: { value: 0 },
    uMirrorY: { value: 0 },
    // The game's water map (WaterField, #18): as it was and as last sent, how far it has eased between, and where it lies.
    tWaterA: { value: null as THREE.Texture | null },
    tWaterB: { value: null as THREE.Texture | null },
    uWaterBlend: { value: 1 },
    uWaterGrid: { value: new THREE.Vector4(0, 0, 1, 0) },
    uWaterHigh: { value: -1e6 },
    // The water's ice (#14, WaterField.iceA/iceB): per cell how frozen and whether thawing, as it was and as last sent;
    // whether any is frozen; how it's painted (the candidates: 0 black, 1 milky, 2 both).
    tIceA: { value: null as THREE.Texture | null },
    tIceB: { value: null as THREE.Texture | null },
    uIceOn: { value: 0 },
    // The land's square (the ground's, see MeshOptions.fields): its centre's x and z, half its side, its turn. The water
    // stops at its edge (half 0: no edge).
    uLandSquare: { value: new THREE.Vector4(0, 0, 0, 0) },
    // For the water: the bed drawn without it (colour, and the G-buffer's aux for its depth), the scene mirrored in it, the
    // screen size in pixels, and the sky it reflects where nothing else is.
    uUnder: { value: null as THREE.Texture | null },
    uUnderAux: { value: null as THREE.Texture | null },
    uReflect: { value: null as THREE.Texture | null },
    uScreen: { value: new THREE.Vector2(1, 1) },
    uSkyTop: { value: new THREE.Color() },
    uSkyBottom: { value: new THREE.Color() },
    // The clouds (#8): the cloud map (cloudMap.ts) and the light under a cloud (CLOUD_LIGHT), set by the renderer.
    uCloudMap: { value: null as THREE.Texture | null },
    uCloudRect: { value: new THREE.Vector4(-64, -64, 1 / 128, 1 / 128) },
    uCloudStrength: { value: 0 },
    uCloudOvercast: { value: new THREE.Vector3() },
    uCloudSunColor: { value: new THREE.Color(1, 1, 1) },
    uCloudRimColor: { value: new THREE.Color(1, 0.8, 0.4) },
    uCloudBands: { value: new THREE.Vector4(0, 0.3, 0.1, 1) },
    uCloudTint: { value: new THREE.Vector2(0, 0) },
    uLightExposure: { value: 1 },
    // The sky the water and the solar glass mirror (MIRROR_SKY): the sky map, the gaps' sky and the clouds' colours.
    uSkyMap: { value: null as THREE.Texture | null },
    uSkyRect: { value: new THREE.Vector4(-128, -128, 1 / 256, 1 / 256) },
    uGapSkyTop: { value: new THREE.Color() },
    uGapSkyBottom: { value: new THREE.Color() },
    uCloudLit: { value: new THREE.Color() },
    uCloudBelly: { value: new THREE.Color() },
    uSkyClosed: { value: 0 },
  };
}
export type SharedUniforms = ReturnType<typeof createSharedUniforms>;

/**
 * paint: stones and trees' wood (which bends in the wind with its tree); ground: the land, painted as paint is, its brush
 * read from fields baked at load (see groundBakeMaterial); crop: a field's painted mass, which shows the gusts; debris:
 * leaves blown through the air in a storm, drawn by the renderer itself.
 */
export type MaterialKind = 'paint' | 'ground' | 'crop' | 'foliage' | 'grass' | 'ink' | 'water' | 'debris';

// ---------------------------------------------------------------------------------------------------------------------
// Vertex shaders

/** Common head: shared uniforms, noise, and the painted attribute (variation, brush scale, stroke angle, rim). */
const HEAD = /* glsl */ `
// The silhouettes drawn first (see prepassMaterial) must land at exactly the depth the painting does, on every GPU.
invariant gl_Position;
${LIGHT_UNIFORMS}
${NOISE}
${WIND_GLSL}
attribute vec4 aPaint;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
// Where the point is with no wind: the brush is keyed to it, so the paint moves with what moves, not through it.
varying vec3 vRestPos;
// Puts a world position on screen, mirrored in the water when drawing its reflection. The surface is still lit where it
// really is (vWorldPos and the normal stay unmirrored), so a tree in the water shows its shaded underside.
// A movement with its part along the main camera's view taken out: on screen it looks the same, but nothing comes nearer or
// goes farther, so things that overlap never swap which is in front. (Wind moving leaves to and fro in depth would swap
// overlapping dabs of different colours, and the swatches would pop.) Mirrored in the reflection. The sun's shadow pass uses
// the main camera's direction too, so the shadows move with what casts them.
vec3 acrossView(vec3 d) {
  vec3 b = uMirror > 0.5 ? uViewBack * vec3(1.0, -1.0, 1.0) : uViewBack;
  return d - b * dot(d, b);
}
// How a point of a tree moves in the wind (tree: its foot's x and z, its height, and how much of its top's movement this
// point takes; a height of 0 is no tree; id: the tree's texel in tTreePose). The top is where the tree's spring has it
// (TreeSprings); the rest bends with it from the foot, by the share built into each point (growTree). The movement is drawn
// across the view only (drawnShift), so a bending crown's strokes never swap which is in front.
uniform sampler2D tTreePose;
vec3 treeWind(vec4 tree, float id) {
  if (tree.z <= 0.0) return vec3(0.0);
  int i = int(id + 0.5);
  vec2 top = texelFetch(tTreePose, ivec2(i % 256, i / 256), 0).xy * uWindOn;
  vec3 d = vec3(top.x, 0.0, top.y);
  // The top dips a little as the tree leans over.
  d.y -= dot(d, d) / (1.4 * tree.z);
  return d * tree.w;
}
// A tree's movement as drawn. It's real 3D where it's lit (vWorldPos) and in the sun's shadow pass, so it shades and casts
// its shadow where it really is; for the eye only its part across the view is drawn (see acrossView), which puts it on the
// same pixels without changing its depth, so neighbouring trees rocking out of step never swap their overlapping edges.
vec3 drawnShift(vec3 d) {
#ifdef SHADOW_PASS
  return d;
#else
  return acrossView(d);
#endif
}
void place(vec3 world) {
  if (uMirror > 0.5) world.y = 2.0 * uMirrorY - world.y;
  vec4 vp = viewMatrix * vec4(world, 1.0);
  vViewDepth = -vp.z;
  gl_Position = projectionMatrix * vp;
}
`;

const STATIC_VERT = /* glsl */ `
${HEAD}
varying vec2 vUv;
#ifdef GROUND
// How much of the ground is earth, from its own colours (wet.ts's earthShares): where mud can lie (#11).
attribute float aEarth;
varying float vEarth;
#endif
#ifdef TREES
attribute vec4 aTree;
attribute float aTreeId;
#endif
#ifdef CROP
varying float vGust;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vRestPos = wp.xyz;
#ifdef CROP
  // The field gives a little under each gust: its top sinks and drifts downwind.
  vGust = windGust(wp.xz);
  float give = vGust * windForce();
  wp.xyz += (windDir3() * 0.1 - vec3(0.0, 0.14, 0.0)) * give;
#endif
  vWorldPos = wp.xyz;
#ifdef TREES
  vec3 tree = treeWind(aTree, aTreeId);
  vWorldPos += tree;
  wp.xyz += drawnShift(tree);
#endif
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vUv = uv;
#ifdef GROUND
  vEarth = aEarth;
#endif
  place(wp.xyz);
}
`;

/**
 * The water's sheet (WaterField): a vertex per cell of the game's water map, raised to the cell's surface as eased; its
 * flow and mud for the painting. The reflection is drawn about one surface (uMirrorY); water at another height mirrors
 * the same picture moved up or down the screen by twice the difference (the camera is orthographic, so it's an exact
 * shift), vMirrorShift in screen uv.
 */
const WATER_VERT = /* glsl */ `
${HEAD}
varying vec2 vFlow;
varying float vMud;
varying vec2 vMirrorShift;
uniform sampler2D tIceA;
uniform sampler2D tIceB;
uniform float uIceOn;
varying vec3 vIce;
void main() {
  vec4 w = waterCell(ivec2(uv + 0.5));
  // The ice (#14): how frozen, and whether it's thawing (1) or freezing.
  vIce = vec3(0.0);
  if (uIceOn > 0.5) {
    ivec2 c = clamp(ivec2(uv + 0.5), ivec2(0), textureSize(tIceA, 0) - 1);
    vIce = mix(texelFetch(tIceA, c, 0).xyz, texelFetch(tIceB, c, 0).xyz, uWaterBlend);
  }
  vec4 wp = modelMatrix * vec4(position.x, w.x, position.z, 1.0);
  vRestPos = wp.xyz;
  vWorldPos = wp.xyz;
  vNormal = vec3(0.0, 1.0, 0.0);
  vColor = WATER_COLOR;
  vPaint = vec4(0.0);
  vFlow = w.yz;
  vMud = w.w;
  vMirrorShift = (projectionMatrix * viewMatrix * vec4(0.0, 2.0 * (w.x - uMirrorY), 0.0, 0.0)).xy * 0.5;
  place(wp.xyz);
}
`;

/** Added to a foliage dab's aPaint.x (its colour drift, under 2 otherwise) to give it crisper edges: see FOLIAGE_VERT. */
export const CRISP_EDGE = 2;
/** Added to a foliage dab's aPaint.x to mark it as stiff (#13's winter twigs, and fallen leaves): it moves only with its
 * tree, if any, never fluttering or turning over on its own. Adds to CRISP_EDGE. */
export const STIFF_STROKE = 4;

/**
 * Foliage dabs: each card is a quad centred on `position`, turned to face whichever camera draws it (the view or the sun),
 * so the sun's shadow map sees the same clumps the eye does. `normal` is the canopy's (the crown's form and the branch
 * mass's), so a whole crown shades as a few lumps rather than as many pads.
 * aCard: the corner (-1..1), the dab size in metres, and a seed. aPaint.y: the dab's width over its length (1 round, less
 * a leafy stroke); aPaint.z: the stroke's turn on screen in radians (below zero: any way).
 */
const FOLIAGE_VERT = /* glsl */ `
${HEAD}
attribute vec4 aCard;
attribute vec4 aTree;
attribute float aTreeId;
uniform vec2 uScreen;
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float a = aPaint.z >= 0.0 ? aPaint.z + (aCard.w - 0.5) * 0.7 : aCard.w * 6.2831853;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * aCard.xy;
  vec4 wc = modelMatrix * vec4(position, 1.0);
  vec3 rest = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  // Wind: the crown moves with its tree (see treeWind and drawnShift); each dab flutters on its own, faster and wider as the
  // wind rises (though leaves turn edge-on and stop flapping, so not much), never more than a little of its size, and only
  // across the view (see acrossView).
  float s = uWindSpeed, seed = aCard.w;
  float g = windGust(aTree.z > 0.0 ? aTree.xy : wc.xz);
  float leafy = aPaint.x >= ${STIFF_STROKE.toFixed(1)} ? 0.0 : 1.0;  // wood neither flutters nor turns over
  float amp = leafy * min(0.004 + 0.045 * s / (s + 12.0), 0.15 * aCard.z) * (0.7 + 0.6 * g);
  float ph = uWindFlutter * (0.8 + 0.4 * fract(seed * 7.13)) + seed * 40.0;
  vec3 flutter = (windDir3() * sin(ph) + vec3(-uWindDir.y, 0.0, uWindDir.x) * 0.5 * sin(ph * 1.31 + seed * 9.0)
    + vec3(0.0, 0.5 * cos(ph * 0.87 + seed * 21.0), 0.0)) * amp;
  vec3 tree = treeWind(aTree, aTreeId);
  wc.xyz += acrossView(flutter);
  // In a gale and up, leaves on the windward side turn over in the gusts and show their pale undersides. Slowly, a few at a
  // time, in waves that travel with the gusts, so no dab blinks.
  float windward = smoothstep(-0.3, 0.6, -dot(normalize(mat3(modelMatrix) * normal), windDir3()));
  float turn = g + 0.35 * sin(uWindFlutter * 0.13 * (0.8 + 0.4 * fract(seed * 3.7)) + seed * 51.0);
  vFlash = leafy * smoothstep(0.35, 0.8, windForce()) * smoothstep(0.55, 0.95, turn) * (0.35 + 0.65 * windward);
  vec3 world = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  vWorldPos = world + tree;
  vRestPos = rest;
  vNormal = normalize(mat3(modelMatrix) * normal);
  // Each dab bulges towards the viewer a little; kept faint, so turning the camera doesn't relight the crown.
  vDabNormal = normalize(right * c.x * 0.55 + up * c.y * 0.55 + toCam * 0.45);
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  // Screen pixels per unit of the card, for its edge's antialiasing (orthographic: the same everywhere on screen).
  vCardPx = aCard.z * projectionMatrix[0][0] * uScreen.x * 0.5;
  // Spring's and autumn's strokes (#13, aPaint.x raised by CRISP_EDGE) have crisper edges: their brighter colours make the
  // part-covered pixels along an edge, which change as the camera moves a pixel, shimmer more than green leaves'.
  // The flags add up (a fallen leaf is both): wood's comes off first, then the crisp edge's.
  float paintX = aPaint.x >= ${STIFF_STROKE.toFixed(1)} ? aPaint.x - ${STIFF_STROKE.toFixed(1)} : aPaint.x;
  if (paintX >= ${CRISP_EDGE.toFixed(1)}) { paintX -= ${CRISP_EDGE.toFixed(1)}; vCardPx *= 1.8; }
  vPaint.x = paintX;
  place(world + drawnShift(tree));
}
`;

/**
 * Grass and crops: blades that bend in the wind more towards the tip. aBlade: height along the blade (0..1), a seed, the
 * vertex's signed distance across the blade from its middle (zero on the centre line), and the direction across the blade
 * (an angle in the xz plane, from +x towards +z; the same for every vertex of a blade).
 */
const GRASS_VERT = /* glsl */ `
${HEAD}
attribute vec4 aBlade;
uniform vec2 uScreen;
varying vec2 vBlade;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  // Blades are flat, and a flat blade seen edge-on is a sliver under a pixel wide that crawls as the camera moves. Turn each
  // most of the way to face the camera, and keep it at least a pixel and a bit across. The turn works on the blade's axis as
  // an unoriented line (angles doubled), so it never jumps as the camera turns past a blade edge-on. Every vertex of a blade
  // carries the same angle, so all of them turn the axis identically, then take their own signed distance along it: rows
  // stay in step and mirrored vertices stay on opposite sides. Not in the sun's shadow pass: no camera there.
#ifndef SHADOW_PASS
  vec3 across = mat3(modelMatrix) * vec3(cos(aBlade.w), 0.0, sin(aBlade.w));
  float stretch = length(across.xz);
  if (aBlade.z != 0.0 && stretch > 1e-6) {
    vec2 dir = across.xz / stretch;
    float a = atan(dir.y, dir.x), b = atan(viewMatrix[2][0], viewMatrix[0][0]);
    vec2 m = mix(vec2(cos(2.0 * a), sin(2.0 * a)), vec2(cos(2.0 * b), sin(2.0 * b)), 0.75);
    float c = 0.5 * atan(m.y, m.x);
    vec2 axis = vec2(cos(c), sin(c));
    axis *= dot(axis, dir) < 0.0 ? -1.0 : 1.0;
    float halfWidth = abs(aBlade.z) * stretch;
    float pxPerMetre = projectionMatrix[0][0] * uScreen.x * 0.5;
    wp.xz += axis * sign(aBlade.z) * max(halfWidth, 0.6 / pxPerMetre) - dir * aBlade.z * stretch;
  }
#endif
  // Wind: each blade bends with the wind where it stands (the game's map: further in a gust, less in a hedge's lee), more
  // towards the tip and with the square of the speed, and rocks about that; the tip dips as it bends. Across the view only,
  // so blades never swap which is in front.
  vRestPos = wp.xyz;
  vec2 here = windGround(wp.xz);
  float h = aBlade.x * aBlade.x, s = length(here);
  vec3 dir = windDirOf(here);
  float bend = 0.02 + 0.0035 * s + 2.4e-4 * s * s;
  float rock = sin(uWindFlutter * 0.8 * (0.85 + 0.3 * aBlade.y) + aBlade.y * 6.283 + wp.x * 0.7) * (0.012 + 0.0025 * s);
  float d = min(bend + rock, 0.6) * h;
  wp.xyz += acrossView(dir * d - vec3(0.0, d * d * 1.2, 0.0));
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vBlade = aBlade.xy;
  place(wp.xyz);
}
`;

/**
 * Leaves in the air, drawn as foliage dabs. Each card is one leaf; 'position' holds three random numbers (the same at its four
 * corners) for where it is in a box round the camera's target and how high. The leaves ride the gusts downwind, wrap round
 * the box (fading out near its edges, out of sight), bob and tumble. Only a share of them fly, growing from a gale to a
 * hurricane; a leaf joining in grows from nothing rather than popping in. aCard as for foliage.
 */
const DEBRIS_VERT = /* glsl */ `
${HEAD}
attribute vec4 aCard;
uniform vec2 uScreen;
uniform vec3 uViewTarget;
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
const float BOX = 128.0;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float seed = aCard.w, k = fract(seed * 13.71);
  float share = smoothstep(14.0, 40.0, uWindSpeed);
  float show = smoothstep(k, k + 0.08, share * 1.08);
  // Carried by the gusts, some leaves faster than others, wandering a little across the wind.
  vec2 side = vec2(-uWindDir.y, uWindDir.x);
  float ph = uWindFlutter * (0.2 + 0.15 * fract(seed * 5.3)) + seed * 30.0;
  vec2 xz = position.xy * BOX + uWindDrift * (1.0 + 0.6 * fract(seed * 3.1)) + side * sin(ph * 0.7) * 1.5;
  vec2 rel = mod(xz - uViewTarget.xz + BOX * 0.5, BOX) - BOX * 0.5;
  float fade = 1.0 - smoothstep(0.4 * BOX, 0.48 * BOX, max(abs(rel.x), abs(rel.y)));
  float size = aCard.z * show * fade;
  vec3 c0 = vec3(uViewTarget.x + rel.x, uViewTarget.y + 1.0 + position.z * 6.0 + sin(ph) * 0.8, uViewTarget.z + rel.y);
  // Tumbling: the leaf turns on the screen, and narrows and widens as it flips over.
  float a = seed * 6.2831853 + ph * 1.7;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * (aCard.xy * vec2(1.0, max(abs(cos(ph * 2.3)), 0.2)));
  vec3 world = c0 + (right * c.x + up * c.y) * size;
  vWorldPos = world;
  // Its paint is the leaf's own, wherever it flies.
  vRestPos = position * BOX;
  vNormal = normalize(vec3(sin(ph * 2.3), 1.0, cos(ph * 1.9)));
  vDabNormal = toCam;
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  vCardPx = max(size, 1e-4) * projectionMatrix[0][0] * uScreen.x * 0.5;
  vFlash = 0.0;
  place(world);
}
`;

// ---------------------------------------------------------------------------------------------------------------------
// Fragment shaders

const FRAG_HEAD = /* glsl */ `
${LIGHT_UNIFORMS}
${NOISE}
${OKLAB}
${CLOUD_LIGHT}
${SHADOW}
${PAINT}
${WIND_GLSL}
varying vec3 vWorldPos;
varying vec3 vRestPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
${GBUFFER_OUT}
vec3 toCamera() { return normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])); }
${SHELTER_GLSL}
${SNOW_GLSL}
${WET_GLSL}

#ifdef BASIS
// The brush by place, baked at load (basisBakeMaterial): for each of the BASIS brush scales, seven layers over the ground's
// square, the brush on the flat at 0°, 30°, ... 180°. paintDabs and paintStrokes only ever blend two of those angles, so
// the two either side of 'angle', blended as they blend them, give the brush there: dabs, strokes, fine strokes, drift.
uniform highp sampler2DArray uBasis;
uniform mat3 uFieldsMap;
uniform float uBasisScales[BASIS];
vec4 basisFields(vec2 xz, float scale, float angle) {
  float k = angle / 0.5235988, k0 = floor(k), w = smoothstep(0.3, 0.7, k - k0);
  // The nearest scale baked.
  float layers = 0.0, nearest = abs(scale - uBasisScales[0]);
  for (int i = 1; i < BASIS; i++) {
    float d = abs(scale - uBasisScales[i]);
    if (d < nearest) { nearest = d; layers = float(i * 7); }
  }
  k0 += layers;
  vec2 uv = (uFieldsMap * vec3(xz, 1.0)).xy;
  return (mix(texture(uBasis, vec3(uv, k0)), texture(uBasis, vec3(uv, k0 + 1.0)), w) - 0.5) / 0.45;
}
#endif

// Where the brush runs on a surface: across the ground on flat faces, up the sides on steep ones, blended between the three
// world planes by the normal, so curved surfaces (stones, trunks, the wheat's rounded edge) carry no seam. The top plane's
// strokes follow the contours, the sides' run at the surface's set angle.
vec3 planeWeights(vec3 n) {
  vec3 w = pow(abs(n), vec3(4.0));
  // Planes under 1% are skipped; take that much off each so the skip doesn't leave a step.
  w = max(w / (w.x + w.y + w.z) - 0.01, 0.0);
  return w / (w.x + w.y + w.z);
}
float dabsOn(vec3 p, vec3 w, float scale, float top, float side) {
  float s = 0.0;
  if (w.y > 0.0) s += w.y * paintDabs(p.xz, scale, top);
  if (w.x > 0.0) s += w.x * paintDabs(p.zy, scale, side);
  if (w.z > 0.0) s += w.z * paintDabs(p.xy, scale, side);
  return s;
}
float strokesOn(vec3 p, vec3 w, float top, float side) {
  float s = 0.0;
  if (w.y > 0.0) s += w.y * paintStrokes(p.xz, top);
  if (w.x > 0.0) s += w.x * paintStrokes(p.zy, side);
  if (w.z > 0.0) s += w.z * paintStrokes(p.xy, side);
  return s;
}

// The surface's own colour, drifting in hue and value across the world (one meadow runs yellow-green to emerald to teal),
// by 'amount'; 'dab' is the brush mark's own shift, already as strong as the surface wants it.
// 'drift' is driftField's value there.
float driftField(vec3 p) { return fbm2(p.xz * 0.06 + 3.1); }
vec3 driftColorOf(vec3 base, float drift, float amount, float dab) {
  vec3 lab = linToOklab(base);
  lab = lchShift(lab, drift * 0.02 * amount + dab * 0.05, 1.0 + drift * 0.05 * amount + dab * 0.08, drift * 0.12 * amount + dab * 0.13);
  return oklabToLin(lab);
}
vec3 driftColor(vec3 base, vec3 p, float amount, float dab) { return driftColorOf(base, driftField(p), amount, dab); }

float rimLight(vec3 n, float amount) {
  float f = pow(1.0 - clamp(dot(n, toCamera()), 0.0, 1.0), 2.5);
  return amount * f * smoothstep(-0.1, 0.5, dot(n, uSunDir));
}
`;

// The brush where the paint is: its dabs, its strokes, its fine strokes (scaled 0.6 and 1.3 by the brush scale) and the
// colour's drift. Worked out in the pixel, or, for the ground, read from the fields baked at load (BRUSH_BAKE_FRAG).
const BRUSH_FIELDS = /* glsl */ `
vec4 brushFields(vec3 p, vec3 n) {
  vec3 w = planeWeights(n);
  float angle = contourAngle(n, vPaint.z);
  return vec4(dabsOn(p, w, vPaint.y, angle, vPaint.z), strokesOn(p * vPaint.y * 0.6, w, angle, vPaint.z),
    strokesOn(p * vPaint.y * 1.3, w, angle, vPaint.z), driftField(p));
}
`;

const PAINT_FRAG = /* glsl */ `
${FRAG_HEAD}
${BRUSH_FIELDS}
varying vec2 vUv;
#ifdef CROP
varying float vGust;
#endif
#ifdef FIELDS
// The ground's brush fields, over the square uFieldsMap takes the ground's x and z to; stored as 0.5 + value / 2.
uniform sampler2D uFields;
uniform mat3 uFieldsMap;
#endif
void main() {
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  vec3 p = vRestPos;
#ifdef FIELDS
  vec4 fields = texture(uFields, (uFieldsMap * vec3(p.xz, 1.0)).xy) * 2.0 - 1.0;
#elif defined(BASIS)
  // A crop's brush: on top, read by place; down its sides (a field's edges, whatever its height), worked out live. As
  // brushFields, term by term.
  vec3 w = planeWeights(n);
  vec4 top = basisFields(p.xz, vPaint.y, contourAngle(n, vPaint.z));
  vec4 fields = vec4(w.y * top.xyz, top.w);
  float s = vPaint.y, side = vPaint.z;
  if (w.x > 0.0) fields.xyz += w.x * vec3(paintDabs(p.zy, s, side), paintStrokes(p.zy * s * 0.6, side), paintStrokes(p.zy * s * 1.3, side));
  if (w.z > 0.0) fields.xyz += w.z * vec3(paintDabs(p.xy, s, side), paintStrokes(p.xy * s * 0.6, side), paintStrokes(p.xy * s * 1.3, side));
#else
  vec4 fields = brushFields(p, n);
#endif
  // aPaint.x is how much brushwork shows here: a painter works the banks, edges and turns of the land and leaves the
  // open lawn as quiet colour.
  float detail = vPaint.x;
  float dab = fields.x * detail;
  float br = fields.y;
  vec3 base = driftColorOf(vColor, fields.w, 1.0, dab);
  float vis = sunVisibility(vWorldPos, n, br);
  // Cast shadows on the ground fall to half-tone rather than deep shade: the land stays light and calm.
  float floor_ = mix(0.18, 0.3, smoothstep(0.5, 0.7, abs(n.y)));
  float light = sunLight(n, 0.3) * mix(floor_, 1.0, vis) + dab * 0.07 + br * 0.04 * detail;
  // A fine, faint layer of strokes everywhere, so close up even the quiet lawn is paint, not airbrush. It fades out (its
  // contrast, not its place) as the camera pulls back and the strokes get too small to read.
  vec3 fp = p * vPaint.y * 1.3;
  float fine = fields.z * (1.0 - smoothstep(0.12, 0.4, length(fwidth(fp))));
  light += fine * 0.04;
#ifdef CROP
  // Wind in a field, the way a painter shows it: the gusts roll through as long bands of light (the stalks bent over,
  // showing their paler sides to the sky), with a little shade in the troughs between, stronger as the wind rises.
  float force = smoothstep(0.0, 0.6, windForce());
  float sheen = smoothstep(0.45, 0.85, vGust) - (1.0 - smoothstep(0.1, 0.4, vGust)) * 0.5;
  light += sheen * force * 0.16;
  base = mix(base, oklabToLin(lchShift(linToOklab(base), 0.05, 0.8, 0.0)), max(sheen, 0.0) * force * 0.6);
#endif
  // Wet (#11, wet.ts): the earth muddy, then the paint darker and richer once lit (wetFinish).
  if (uGroundOn > 0.5 && wetAt(p) > 0.0) base = wetBase(base);
  vec3 col = paintBands(base, light, 0.05, n.y * 0.5 + 0.5);
  col = wetFinish(col);
  col += rimColorHere() * rimLight(n, vPaint.w);
  // Frost (#14, frost.ts), and lying snow over it (snow.ts).
  if (uGroundOn > 0.5 && groundAt(p) > 0.0) {
    if (gFrost > 0.0) {
#ifdef GROUND
      // The ground, where it faces up: the hollows first in and last out (the thin snow's pattern: the land's hollows, its
      // unevenness and a finer drift), the sun it's had since dawn clearing it.
      float early = gHollow.z >= 0.0 ? -gHollow.w : 0.0, takes = smoothstep(0.3, 0.8, n.y);
      const bool high = false;
#elif defined(CROP)
      // A crop's tips: early, as the grass's.
      float early = 0.4 + (gHollow.z >= 0.0 ? -gHollow.w * 0.5 : 0.0), takes = smoothstep(0.1, 0.7, n.y);
      const bool high = false;
#else
      // Stones and wood, trunks and bare branches: their tops, a pale edge along a branch, in the sun it's had up there.
      float early = 0.0, takes = smoothstep(0.35, 0.85, n.y) * 0.8;
      const bool high = true;
#endif
      float brush = dab + br * 0.5;
      if (takes > 0.0) {
        vec2 sun = sunHadAt(p.xz);
        col = frostPaint(col, light, frostCover(early, high ? sun.y : sun.x, brush) * takes, brush);
      }
    }
    if (gSnow > 0.0) {
#ifdef GROUND
    // The ground: whole from SNOW_WHOLE up on the flat, less on steep banks; thinner, in patches along the land's own
    // hollows, a patch's edge broken by the brush.
    float cover = snowCover(gSnow, smoothstep(0.55, 0.9, n.y), snowPattern(p.xz) + dab * 0.15, 0.06);
#elif defined(CROP)
    // A crop: its top as the ground's, and its sides buried as deep as the snow lies.
    float cover = max(snowCover(gSnow, smoothstep(0.6, 0.9, n.y), snowPattern(p.xz), 0.06), snowBuries(p, gSnow));
#else
    // Stones and wood: their tops, in patches, and buried at their foot.
    float cover = max(snowCover(gSnow, smoothstep(0.5, 0.85, n.y), snowPattern(p.xz) * 0.6 + br * 0.4, 0.05), snowBuries(p, gSnow));
#endif
    col = mix(col, snowPaint(light, 0.05, fields.x * 1.2 + fine * 0.8), cover);
    }
  }
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, 1.0);
}
`;

/** A dab's shape in its card (c in -1..1): an ellipse 'aspect' wide, pointed at the ends like a leaf, its edge broken. Above zero inside. */
const DAB_SHAPE = /* glsl */ `
float dabShape(vec2 c, float seed, float aspect) {
  vec2 q = vec2(c.x, c.y / max(aspect, 0.2));
  float ang = atan(q.y, q.x);
  float lobes = sin(ang * 5.0 + seed) * 0.07 + sin(ang * 9.0 + seed * 1.7) * 0.04;
  // Pointed ends along the stroke: the sides pull in as |x| grows.
  float taper = (1.0 - aspect) * 0.35 * c.x * c.x;
  return 1.0 - length(q) - taper + lobes * aspect + snoise(c * 2.4 + seed) * 0.12;
}
`;

const FOLIAGE_FRAG = /* glsl */ `
// Thin things (blades, leaves): no foam line along them, only the wet band (waterline).
#define THIN 1
${FRAG_HEAD}
${DAB_SHAPE}
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
varying float vFlash;
void main() {
  vec2 c = vCard.xy;
  float seed = vCard.w * 91.0;
  float edge = dabShape(c, seed, vPaint.y);
  // The edge softened over one pixel. Its slope comes from the ellipse, not from fwidth: screen derivatives are taken per
  // 2x2 block of pixels, so they change as the picture moves by one pixel and the edges would shimmer. The reflection is drawn
  // at half size and mirrored (the card no longer faces the camera squarely), so there the derivatives are the right measure.
  vec2 q = vec2(c.x, c.y / max(vPaint.y, 0.2));
  float slope = length(vec2(q.x, q.y / max(vPaint.y, 0.2))) / max(length(q), 1e-3);
  float px = uMirror > 0.5 ? 1.0 / max(fwidth(edge), 1e-4) : vCardPx / (slope * 1.2);
  float alpha = clamp(edge * px + 0.5, 0.0, 1.0);
  if (alpha < 0.02) discard;
#ifdef PREPASS
  // Only the dab's shape and coverage: the painting comes after, where the dab shows.
#ifdef MIRROR_CLIP
  if (vWorldPos.y < waterNear(vWorldPos.xz) - 0.01) discard;
#endif
  gColor = vec4(0.0, 0.0, 0.0, alpha);
  gAux = vec4(0.0);
  return;
#endif
  cloudAt(vWorldPos);
  vec3 nCanopy = normalize(vNormal);
  vec3 n = normalize(nCanopy + vDabNormal * 0.2);
  vec3 p = vRestPos;
  // Strokes follow the dab, so each one carries a couple of brush marks.
  float br = strokes(c * 1.6 + seed, seed);
  vec3 base = driftColor(vColor, p, vPaint.x, br * 0.35 * vPaint.x);
  // A leaf turned over by the wind shows its underside: paler, greyer and cooler, a silvery green.
  vec3 under = linToOklab(base);
  under = hueToward(lchShift(under, 0.13, 0.5, 0.0), shadeHueHere(), 0.25);
  base = mix(base, oklabToLinFit(under), vFlash * 0.75);
  float vis = sunVisibility(vWorldPos, nCanopy, br);
  // In the crown's own shadow the lumps still read: the shadow lowers the light rather than flattening it.
  float lit = sunLight(n, 0.35);
  // Out of the sun, a mass is still lit by the sky from above: tops lighter than undersides, so the shade keeps its form.
  float light = lit * mix(0.32, 1.0, vis) + br * 0.08 + nCanopy.y * 0.12 * (1.0 - vis * lit);
  // A dab is a touch darker at its lower edge, where it tucks under the next.
  light -= (1.0 - smoothstep(-1.0, 0.6, c.y)) * 0.06;
  // Wet (#11, wet.ts): darker and richer once lit (wetFinish).
  if (uGroundOn > 0.5 && wetAt(p) > 0.0) base = wetBase(base);
  vec3 col = paintBands(base, light, 0.07, nCanopy.y * 0.5 + 0.5);
  col = wetFinish(col);
  // A crown's shade goes deeper than the ground's, and cooler: the dark under a tree is what makes it a mass.
  vec3 lab = linToOklab(col);
  float shade = 1.0 - smoothstep(0.25, 0.6, light);
  lab.x *= 1.0 - 0.22 * shade;
  col = oklabToLinFit(hueToward(lab, shadeHueHere(), 0.08 * shade));
  col += rimColorHere() * rimLight(nCanopy, vPaint.w) * vis * 0.15;
  // Against the sun the crown's edges glow, light coming through the leaves.
  float behind = smoothstep(0.0, 0.7, dot(-toCamera(), uSunDir));
  // Light through a leaf takes the leaf's colour: a warm yellow-green, not the sun's orange.
  float side = pow(1.0 - abs(dot(nCanopy, toCamera())), 3.0);
  col += rimColorHere() * tintOf(base, 0.75) * behind * side * vPaint.w * 0.7 * mix(0.4, 1.0, vis);
#ifndef NO_SNOW
  // Frost (#14): a pale rime on the dabs facing up, the crown's top most, as the sun up there has left it. Lying snow over
  // it: the dabs facing up take it, whole dabs at a time (each its own threshold), the crown's top most (under its own
  // leaves, less: the shelter map's crowns).
  if (uGroundOn > 0.5 && groundAt(p) > 0.0) {
    if (gFrost > 0.0 && nCanopy.y > 0.2) col = frostPaint(col, light, frostCover(0.0, sunHadAt(p.xz).y, br) * smoothstep(0.2, 0.8, nCanopy.y) * 0.55, br);
    float cover = snowCover(gSnow, smoothstep(0.05, 0.7, nCanopy.y), hash12(vec2(vCard.w * 37.0, 3.1)) * 2.0 - 1.0, 0.04);
    if (gSnow > 0.0) col = mix(col, snowPaint(light, 0.07, 0.0), cover);
  }
#endif
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, alpha);
}
`;

const GRASS_FRAG = /* glsl */ `
// Thin things (blades, leaves): no foam line along them, only the wet band (waterline).
#define THIN 1
${FRAG_HEAD}
varying vec2 vBlade;
void main() {
  // Grass is lit like the ground it grows from (its normal is the ground's), so a meadow reads as one painted surface.
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  vec3 p = vRestPos;
  float angle = contourAngle(n, vPaint.z);
#ifdef BASIS
  vec4 fields = basisFields(p.xz, vPaint.y, angle);
  float dab = fields.x * 0.6;
  float br = fields.y;
  vec3 base = driftColorOf(vColor, fields.w, vPaint.x, dab);
#else
  float dab = paintDabs(p.xz, vPaint.y, angle) * 0.6;
  float br = paintStrokes(p.xz * vPaint.y * 0.6, angle);
  vec3 base = driftColor(vColor, p, vPaint.x, dab);
#endif
  float vis = sunVisibility(vWorldPos, n, br);
  float light = sunLight(n, 0.3) * mix(0.18, 1.0, vis) + dab * 0.07 + br * 0.04;
  // Tips catch a little more light than roots.
  light += (vBlade.x - 0.5) * 0.1;
  // Wet (#11, wet.ts): darker and richer once lit (wetFinish).
  if (uGroundOn > 0.5 && wetAt(p) > 0.0) base = wetBase(base);
  vec3 col = paintBands(base, light, 0.06, 0.8);
  col = wetFinish(col);
  col += rimColorHere() * vPaint.w * vBlade.x * vBlade.x * vis * 0.25;
  // Frost (#14): the blades' tips first, before the ground round them (winter's straw whitening most), the sun the ground
  // has had clearing it. Lying snow over it: where the ground under it is white, a blade is buried as deep as the snow
  // lies, its tip poking through; painted as the ground's snow is, so the buried part is lost in it.
  if (uGroundOn > 0.5 && groundAt(p) > 0.0) {
    if (gFrost > 0.0 && vBlade.x > 0.2) {
      float early = 0.5 + (gHollow.z >= 0.0 ? -gHollow.w * 0.5 : 0.0);
      col = frostPaint(col, light, frostCover(early, sunHadAt(p.xz).x, br) * smoothstep(0.2, 0.85, vBlade.x), br);
    }
    float cover = gSnow > 0.0 ? snowBuries(p, gSnow) : 0.0;
    if (cover > 0.0) col = mix(col, snowPaint(light, 0.06, 0.0), cover);
  }
  writeGBuffer(exposeHere(col), n, vViewDepth, 0.0, 1.0);
}
`;

/**
 * Inked: crisp cel bands, the colour barely drifting. aPaint.x picks a finish: 0 plain, 1 solar glass (uv over the panel,
 * aPaint.yz cells along u and v), 2 timber (grain along u), 3 tin (corrugations, aPaint.z of them a uv unit along v).
 * aPaint.w: 1 if it floats (a boat: no waterline on it).
 */
const INK_FRAG = /* glsl */ `
${FRAG_HEAD}
${MIRROR_SKY}
${WET_INK_GLSL}
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vUv;
void main() {
  cloudAt(vWorldPos);
  vec3 n = normalize(vNormal);
  // Mirroring flips which side faces the camera.
  if (gl_FrontFacing == (uMirror > 0.5)) n = -n;
  vec3 p = vWorldPos;
  float finish = vPaint.x;
  // It floats (no waterline on it, #18).
  gFloats = vPaint.w;
  vec3 base = vColor;
  float vis = sunVisibility(p, n, 0.0);
  float light = sunLight(n, 0.2) * mix(0.2, 1.0, vis);
  if (finish > 1.5 && finish < 2.5) {
    // Timber: a few long grain streaks.
    float g = snoise(vec2(vUv.x * 1.5, vUv.y * 24.0)) * 0.5 + 0.5;
    base = oklabToLin(lchShift(linToOklab(base), (g - 0.5) * 0.05, 1.0, 0.0));
  }
  vec3 col = paintBands(base, light, 0.02, n.y * 0.5 + 0.5);
  if (finish > 2.5) {
    // Tin (uv in metres: down the slope, along the ridge): its corrugations, as tone only, never lines; fading out
    // before they're a few pixels apart, so they don't crawl.
    float q = vUv.y * vPaint.z;
    float fade = 1.0 - smoothstep(0.12, 0.3, max(fwidth(q), 1e-4));
    col *= 1.0 - 0.09 * fade * (0.5 + 0.5 * cos(q * 6.2831853));
  }
  if (finish > 0.5 && finish < 1.5) {
    // Solar glass: deep blue cells under the sky's reflection: the clouds drift across the whole array (one sky over all
    // of it, the water's too), brightest where the glass turns towards the horizon, with a sheen where the sun is.
    vec2 cells = vUv * vPaint.yz;
    // Lines a pixel's worth antialiased, and fading out as the cells shrink to a few pixels, so they don't crawl.
    vec2 fw = max(fwidth(cells), 1e-4);
    vec2 line = clamp((0.03 - (0.5 - abs(fract(cells) - 0.5))) / fw + 0.5, 0.0, 1.0);
    float grid = max(line.x, line.y) * (1.0 - smoothstep(0.12, 0.3, max(fw.x, fw.y)));
    vec3 v = toCamera();
    // In the water's reflection the glass is seen from the camera's mirror image, below the water.
    if (uMirror > 0.5) v.y = -v.y;
    vec3 r = reflect(-v, n);
    float fres = 0.2 + 0.5 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
    // The sky it faces, the clouds drifting through it (#8), and long glints across the rows.
    float cloud;
    vec3 seen = mirrorSky(skyPoint(p, r), 1.0 - clamp(r.y * 1.5, 0.0, 1.0), cloud);
    float glint = smoothstep(0.75, 1.0, sin(dot(p.xz, vec2(0.55, 0.35)) + fbm2(p.xz * 0.1) * 1.5));
    // Dark glass mirrors weakly: a cloud shows as a paler patch in its blue, not white.
    seen = mix(mix(uGapSkyTop, uGapSkyBottom, 1.0 - clamp(r.y * 1.5, 0.0, 1.0)), seen, 0.5);
    vec3 sky = mix(seen, mix(uSkyBottom, vec3(1.0), 0.5), glint * 0.6);
    vec3 glass = mix(col, sky * sunTint(), clamp(fres + cloud * 0.15 + glint * 0.4, 0.0, 1.0));
    float sun = pow(max(dot(r, uSunDir), 0.0), 6.0);
    // No sun to shine in it under a cloud.
    glass = mix(glass, vec3(1.0) * sunTint(), sun * 0.6 * vis * (1.0 - gCloud));
    col = mix(glass, glass * 1.3 + 0.04, grid * 0.35);
  }
  // Wet (#11, wet.ts): darker, with the sky glazed over it (not the solar glass, which is glass wet or dry).
  if (uGroundOn > 0.5 && (finish < 0.5 || finish > 1.5) && wetAt(p) > 0.0) col = wetInked(col, n, p);
  // Frost (#14): a pale rime on the tops of built things (roofs, fences, crates, a solar panel's glass), as the sun up
  // there has left it. Lying snow over it: on their tops and their roofs' slopes. A thin cover is a veil the roof shows
  // through, thickening to white (patches on a roof read as camouflage), a little uneven.
  if (uGroundOn > 0.5 && groundAt(p) > 0.0) {
    if (gFrost > 0.0 && n.y > 0.35) col = frostPaint(col, light, frostCover(-0.2, sunHadAt(p.xz).y, 0.0) * smoothstep(0.35, 0.7, n.y) * 0.85, 0.0);
    if (gSnow > 0.0) {
      float uneven = snoise(p.xz * 1.3) * 0.7 + snoise(p.xz * 5.0) * 0.3;
      float cover = snowCover(gSnow, smoothstep(0.4, 0.65, n.y), uneven * 0.25, 0.45);
      col = mix(col, snowPaint(light, 0.02, uneven * 0.3), cover);
    }
  }
  writeGBuffer(exposeHere(col), n, vViewDepth, 1.0, 1.0);
}
`;

/**
 * How far from its own pixel the water reads its two textures: the ripples' nudge (screen uv, at most ripple + chop times
 * chopAmt, which is at most 1.5), the reflection's larger nudge, and its blur (pixels). The renderer draws those passes
 * only round the water on screen, padded by this much (see BrushRenderer.waterRect).
 */
/** How far the ripples shake the clouds in the water (MIRROR_SKY), metres for a unit of their screen nudge: a metre or two. */
const MIRROR_WOBBLE = 400;
export const WATER_REACH = { ripple: 0.0035, chop: 0.006, chopMax: 1.5, reflectNudge: 1.6, blurPx: 3 };
const f = (x: number) => (Number.isInteger(x) ? x.toFixed(1) : String(x));

/**
 * Water: what's under it, tinted by how much water the eye looks through, and what's around it, mirrored.
 *   The bed: the ground and stones drawn without the water (uUnder), nudged by the ripples. The light that reaches it is
 *   absorbed along the path through the water, red first, so the shallows show the bed in clear green-gold and the middle
 *   deepens to blue-green, the water's own colour scattered back.
 *   The reflection: the scene mirrored in the water (uReflect), the sky where there's nothing, more of it where the water
 *   is deep and dark, broken along the flow by ripples.
 * Ripples drift with the flow (the game's water map, #18); the reflection and the bed stay put.
 */
/**
 * Where the water's sheet isn't drawn: where it dives under the land (its mud is how far down, negative there: see
 * layWater), and off the edge of the land, where nothing would hide it reaching past the last wet cell. The painted water
 * and its silhouette (PREPASS_FRAG) both test it, so the silhouette never covers what the painting leaves out.
 */
const WATER_SHEET_GLSL = /* glsl */ `
uniform vec4 uLandSquare;
bool sheetHidden(vec3 p, float mud) {
  if (mud < -${HIDDEN_DIVE}) return true;
  if (uLandSquare.z <= 0.0) return false;
  vec2 d = p.xz - uLandSquare.xy;
  float c = cos(uLandSquare.w), s = sin(uLandSquare.w);
  return max(abs(c * d.x - s * d.y), abs(s * d.x + c * d.y)) > uLandSquare.z;
}
`;

const WATER_FRAG = /* glsl */ `
${FRAG_HEAD}
${MIRROR_SKY}
uniform sampler2D uUnder;
uniform sampler2D uUnderAux;
uniform sampler2D uReflect;
uniform vec2 uScreen;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vFlow;
varying float vMud;
varying vec2 vMirrorShift;
${WATER_SHEET_GLSL}
${RAIN_RINGS_GLSL}
// The ice (#14): how frozen the water is here and whether it's thawing (the game's map, per cell, see WaterField), and
// how it's painted: milky along the banks, dark over the deep channel (the developer's pick of three candidates on #14;
// the others were black all over, and milky all over).
varying vec3 vIce;
uniform float uIceOn;
// A cracked sheet's cells (and the floes it breaks into): how far inside its cell a point is (the gap to the next
// cell's centre, 0 on an edge), and the cell's id.
vec3 iceCells(vec2 q) {
  vec2 i = floor(q), f = fract(q), id = vec2(0.0);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = g + hash22(i + g) * 0.8 + 0.1 - f;
    float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; id = i + g; } else if (d < d2) d2 = d;
  }
  return vec3(sqrt(d2) - sqrt(d1), id);
}
// The flow carries the ripples and the glints along (a flow map: two copies, each carried for a while and then put back,
// crossfaded so neither's jump shows, each place on its own beat so no pulse runs over the whole river). However the flow
// turns and changes speed across the water, the pattern is never dragged out of shape.
const float FLOW_CYCLE = 4.0;
float crest(float ripple) { return smoothstep(-0.15, 0.35, ripple); }
// Glints of sun on the ripples' crests: soft points drawn out a little along the current (the developer, #19: dashes
// across it read as horizontal ticks), carried along by it, each winking in and out on its own beat. Sparse and soft, so
// they sit on the clear water rather than whiting it out.
float sparkle(vec2 q, vec2 dir) {
  vec2 fq = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x))) * vec2(2.2, 3.0);
  vec2 cell = floor(fq), f = fract(fq) - 0.5 - (hash22(cell) - 0.5) * 0.5;
  float h = hash12(cell + 7.3);
  float wink = max(0.0, sin(uTime * (2.0 + h * 3.0) + h * 40.0));
  return (1.0 - smoothstep(0.5, 1.0, length(f / vec2(0.3, 0.17)))) * step(0.5, h) * wink;
}
// Fast water's streaks (#18): long bands of light along the flow, in the flow's own frame, carried as the ripples are.
float streaks(vec2 q, vec2 dir) {
  vec2 r = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x)));
  return snoise(r * vec2(0.2, 3.0)) * 0.65 + snoise(r * vec2(0.45, 6.5) + 5.0) * 0.35;
}
// Patterns laid along the flow are laid at fixed 30° turns and the two nearest blended, as the ground's brush is
// (paintStrokes): turning a pattern by the flow's own angle, which changes round a bend, shears it the more the further it
// is from the world's origin, into the marbled swirls across the current the developer found (#19).
vec3 flowTurns(float a) {
  const float STEP = 0.5235988;
  float k = a / STEP, k0 = floor(k);
  return vec3(k0 * STEP, (k0 + 1.0) * STEP, smoothstep(0.3, 0.7, k - k0));
}
vec2 turnDir(float a) { return vec2(cos(a), sin(a)); }
float sparkleT(vec2 q, vec3 t) { return mix(sparkle(q, turnDir(t.x)), sparkle(q, turnDir(t.y)), t.z); }
float streaksT(vec2 q, vec3 t) { return mix(streaks(q, turnDir(t.x)), streaks(q, turnDir(t.y)), t.z); }

// Light through the ripples, gathered into a moving web on the bed (the clear stream).
float caustic(vec2 q) {
  vec2 a = q * 1.5;
  float c1 = 1.0 - abs(snoise(a + vec2(uTime * 0.22, 0.0)));
  float c2 = 1.0 - abs(snoise(a * 1.37 + 5.0 - vec2(0.0, uTime * 0.18)));
  return pow(c1 * c2, 5.0);
}
void main() {
  if (sheetHidden(vWorldPos, vMud)) discard;
  // How much the silt shows: a little soon browns water (and halfway between teal and brown is grey).
  float mud = 1.0 - pow(1.0 - clamp(vMud, 0.0, 1.0), 3.0);
  cloudAt(vWorldPos);
  vec3 n = vec3(0.0, 1.0, 0.0);
  vec3 p = vWorldPos;
  vec2 flow = vFlow;
  float speed = length(flow);
  // The ripples lie along the flow; still water lies along the map's x.
  float flowA = speed > 1e-4 ? atan(flow.y, flow.x) : 0.0;
  vec2 dir = vec2(cos(flowA), sin(flowA));
  vec2 uv = gl_FragCoord.xy / uScreen;
  float beat = uTime / FLOW_CYCLE + snoise(p.xz * 0.11 + 3.0) * 0.5;
  float f1 = fract(beat), f2 = fract(beat + 0.5);
  float w1 = 1.0 - abs(2.0 * f1 - 1.0), w2 = 1.0 - w1;
  // The two copies' weights, keeping the pattern's strength through the crossfade (two unlike patterns averaged are fainter).
  float norm = inversesqrt(w1 * w1 + w2 * w2);
  vec2 q1 = p.xz - flow * f1 * FLOW_CYCLE, q2 = p.xz - flow * f2 * FLOW_CYCLE + vec2(17.3, 9.1);
  // Ripples: long, soft swells along the flow, and their screen-space nudge.
  float ripple1 = paintStrokes(q1 * 1.3, flowA) * 0.65 + paintStrokes(q1 * 2.9 + 7.0, flowA + 0.3) * 0.35;
  float ripple2 = paintStrokes(q2 * 1.3, flowA) * 0.65 + paintStrokes(q2 * 2.9 + 7.0, flowA + 0.3) * 0.35;
  float ripple = (ripple1 * w1 + ripple2 * w2) * norm;
  vec2 nudge = (vec2(snoise(q1 * 1.7), snoise(q1 * 1.7 + 19.0)) * w1 + vec2(snoise(q2 * 1.7), snoise(q2 * 1.7 + 19.0)) * w2) * norm
    * ${f(WATER_REACH.ripple)};
  // Chop: the wind raises short wavelets across its direction that run downwind, rougher in the gusts. They break up the
  // reflection, and in a storm their crests whiten. They travel as short waves do, about a metre a second in a storm, far
  // slower than the gusts: any faster and they flicker, and the glints and whitecaps keyed to them blink.
  float windA = atan(uWindDir.y, uWindDir.x);
  float chopAmt = smoothstep(0.03, 0.7, windForce()) * (0.5 + windGust(p.xz));
  vec2 cq = p.xz - uWindDrift * 0.1;
  float chop = strokes(cq * 3.2, windA + 1.5707963) * 0.6 + strokes(cq * 6.5 + 3.0, windA + 1.3) * 0.4;
  ripple = mix(ripple, chop, clamp(chopAmt * 0.8, 0.0, 0.8)) + chop * chopAmt * 0.25;
  nudge += vec2(snoise(cq * 4.0), snoise(cq * 4.0 + 7.0)) * ${f(WATER_REACH.chop)} * chopAmt;
  // Cat's paws (#36): where a gust passes over the water in a light wind, a patch of it roughens: fine ripples that
  // break up the reflection a little, darken it a little and glint. The look is the developer's pick, "glitter": the
  // glints carry it, and the mild darkening lets the patch read as one. The patch travels with the gust; the ripples stay
  // nearly put, as they do on a pond. Gone in a dead calm, and from about 8 m/s, when the whole surface is chop. (Their nudge, with the chop's
  // in a light wind, stays well inside WATER_REACH.)
  // Water lies low among banks and trees, sheltered more in some places than others, so a gust is read against how hard
  // the wind usually blows just there: a paw where it's blowing a quarter harder than usual.
  // The wind's cells are a metre or more and a gust spans many, so its edge is broken up by a ragged noise carried with
  // the air: scalloped patches a few metres across, and small ones running ahead, not the whole stream dimming at once.
  // Only round a gust: in the usual wind the noise alone would make paws.
  vec2 bq = (p.xz - uWindDrift * 0.8) * 0.4;
  float ragged = snoise(bq) * 0.6 + snoise(bq * 2.3 + 5.0) * 0.4;
  float gustHere = windGustHere(p.xz);
  float paw = smoothstep(1.15, 1.3, gustHere + ragged * 0.35 * smoothstep(1.0, 1.15, gustHere))
    * smoothstep(0.5, 2.0, uWindSpeed) * (1.0 - smoothstep(6.0, 10.0, uWindSpeed));
  vec2 pq = p.xz * 7.0 - uWindDir * uTime * 0.15;
  nudge += vec2(snoise(pq), snoise(pq + 11.0)) * 0.002 * paw;

  // Under the water.
  vec2 uvBed = uv + nudge;
  vec3 bed = texture(uUnder, uvBed).rgb;
  float bedDepth = texture(uUnderAux, uvBed).z;
  float path = bedDepth > 0.0 ? max(bedDepth - vViewDepth, 0.0) : 3.0;
  vec3 turns = flowTurns(flowA);
  // How low and warm the sun is: 1 from a little above the horizon to the golden hour, none at noon or night (#19: the
  // evening water was slate-blue, mirroring the upper sky, when it should glow warm).
  float warmth = smoothstep(-0.03, 0.06, uSunDir.y) * (1.0 - smoothstep(0.3, 0.55, uSunDir.y));
  vec3 waterLab = linToOklab(vColor);
  // Clear (#19, the developer's pick): little tint in the shallows, where the bed shows, a deep, saturated teal in the deep.
  vec3 scatter = oklabToLin(lchShift(waterLab, -0.02, 1.7, -0.1));
  vec3 absorb = vec3(1.3, 0.45, 0.36);
  // The bed honey-coloured in the evening light, and the light through the ripples on it.
  bed *= mix(vec3(1.0), vec3(1.3, 1.08, 0.72), warmth * 0.6);
  float caust = (caustic(q1) * w1 + caustic(q2) * w2) * norm;
  bed += bed * caust * sunTint() * 1.8 * sunVisibility(p, n, 0.0) * (1.0 - gCloud) * exp(-path * 1.1);
  // Muddy water (#18, the developer's pick "brown"): silt makes it ochre brown and opaque, the bed lost a hand's depth down.
  scatter = mix(scatter, vec3(0.28, 0.15, 0.045), mud);
  absorb = mix(absorb, vec3(4.0, 4.4, 5.0), mud);
  vec3 through = exp(-absorb * path);
  float vis = sunVisibility(p, n, ripple);
  // The body of the water is lit from above by the sky; the sun shows in its sparks.
  // The bed and the reflection are lit where they are already; the water's own light is exposed here (exposeHere).
  // (Silt is lit as the land is, by the sun as much as the sky.)
  scatter = exposeHere(scatter * mix(skyTint(), mix(skyTint(), sunTint(), 0.6), mud) * mix(0.75, 1.0, vis));
  vec3 under = bed * through + scatter * (1.0 - through);

  // The reflection, and the sky where nothing is reflected: looking down at 30 degrees, the water mirrors the sky 30 degrees up.
  // Taken through a small blur: the reflection is drawn at half size, and its thin bright things (grass blades above all)
  // would flicker as the camera moves.
  vec2 rt = ${f(WATER_REACH.blurPx)} / uScreen;
  vec2 ruv = uv + nudge * ${f(WATER_REACH.reflectNudge)} - vMirrorShift;
  vec4 refl = (texture(uReflect, ruv) * 2.0 + texture(uReflect, ruv + vec2(rt.x, 0.0)) + texture(uReflect, ruv - vec2(rt.x, 0.0))
    + texture(uReflect, ruv + vec2(0.0, rt.y)) + texture(uReflect, ruv - vec2(0.0, rt.y))) / 6.0;
  // The upper sky, and on the ripples' crests, which tilt towards the horizon, the glow low in it: a mean of the two would be grey.
  // The clouds in it (#8) along the mirrored ray, shaken by the ripples.
  // In the evening the whole surface mirrors the glow low in the sky, evenly and softly, so the evening water reads warm
  // rather than slate (#19, the developer's pick "evening B", a third softer: fuller, it went pale. Not in streaks on the
  // swells: those smears, round one, the developer found ugly).
  float evenCrest = warmth * 0.3;
  float low = 0.25 + 0.6 * evenCrest;
  vec3 glowLow = oklabToLin(lchShift(linToOklab(mix(uGapSkyBottom, sunColorHere() / max(max(sunColorHere().r, sunColorHere().g), 1e-3), 0.45)), 0.04, 1.3, 0.0));
  vec3 sky = exposeHere(mix(mix(uGapSkyTop, uGapSkyBottom, 0.25), glowLow, evenCrest));
  vec3 mirrored = sky * (1.0 - refl.a) + refl.rgb;
  // Mostly see-through: the bed shows in the shallows, and the reflection grows only where the water is deep and dark.
  float depthy = 1.0 - (through.g * 0.5 + through.b * 0.5);
  // (Muddy water is opaque, but its silt is what shows, not a deep pool's mirror.)
  float fres = clamp(0.04 + depthy * 0.18 * (1.0 - 0.6 * mud) + ripple * 0.06, 0.0, 0.4);
  fres = mix(fres, 0.4, evenCrest * 0.4 * (1.0 - 0.6 * mud));
  vec3 col = mix(under, mirrored, fres);
  // The clouds in it (#8), along the mirrored ray and shaken by the ripples: their light over the sky's, alike over the
  // shallows and the deep (the depth is read at half size, and its grain would show against a bright cloud and shimmer as
  // the camera moves), and over the faint things mirrored in front of them (thin blades), not the solid ones. How strongly
  // they show: the developer's pick, "clear" (#8).
  float cloud;
  vec3 clouded = exposeHere(mirrorSky(skyPoint(p, reflect(-toCamera(), n)) + nudge * ${f(MIRROR_WOBBLE)}, low, cloud));
  vec2 wide = rt * 2.5;
  float cover = (refl.a * 2.0 + texture(uReflect, ruv + wide).a + texture(uReflect, ruv - wide).a
    + texture(uReflect, ruv + vec2(wide.x, -wide.y)).a + texture(uReflect, ruv - vec2(wide.x, -wide.y)).a) / 6.0;
  float solid = smoothstep(0.35, 0.9, cover);
  // Fading out at the very edge, where only a film of water lies over the bank.
  float film = smoothstep(0.0, 0.5, path);
  col += (clouded - sky) * (1.0 - solid) * film * 0.365 * (0.85 + 0.3 * ripple);
  col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.25)), smoothstep(0.5, 0.9, ripple) * 0.25 * depthy * (1.0 - 0.6 * mud));
  // Sparkle: glints of sun on the ripples' crests (sparkle), carried by the flow as the ripples are.
  float spark = (sparkleT(q1, turns) * w1 + sparkleT(q2, turns) * w2) * crest(ripple);
  // No glints under a cloud.
  // (The river's own glints dim a little in a paw, as it darkens.)
  // (In the evening the glints take the low sun's gold, #19: the developer's idea.)
  vec3 sunGlow = exposeHere(oklabToLin(lchShift(linToOklab(sunColorHere()), 0.0, 1.5, 0.0)));
  vec3 glintC = mix(exposeHere(mix(vec3(1.0), sunTint(), 0.5)), sunGlow * 1.2, warmth);
  col = mix(col, glintC,
    spark * vis * (1.0 - gCloud) * (0.2 + depthy * 0.4) * (1.0 - paw * 0.28));
  // The paws: a little darker and cooler, as a roughened patch mirrors less of the bright sky, and glinting in fine points
  // that wink quickly, as many more tiny facets catch the sun. Only as bright as the sun is direct (uCloudStrength): none
  // under full cover or before dawn, faint by the moon. (gCloud is the cloud's shade already scaled by uCloudStrength, so
  // this is the direct light times the cloud's gap.)
  col = mix(col, col * vec3(0.5, 0.58, 0.68), paw * 0.35);
  vec2 gq = p.xz * 6.0 - uWindDir * uTime * 0.15;
  vec2 gc = floor(gq), gf = fract(gq) - 0.5 - (hash22(gc) - 0.5) * 0.6;
  float gh = hash12(gc + 3.1);
  float glit = (1.0 - smoothstep(0.1, 0.2, length(gf))) * step(0.4, gh) * max(0.0, sin(uTime * (5.0 + gh * 6.0) + gh * 50.0));
  col = mix(col, glintC, glit * paw * vis * max(uCloudStrength - gCloud, 0.0));
  // Fast water (#18, the developer's pick "streaks"), from about a metre a second: the stream in spate.
  float fast = smoothstep(0.45, 1.1, speed);
  if (fast > 0.0) {
    // Streaks: the surface torn into long bands along the flow, their faces catching the sky's glow, darker between.
    float st = (streaksT(q1, turns) * w1 + streaksT(q2, turns) * w2) * norm;
    col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.35) * skyTint()), smoothstep(0.2, 0.7, st) * fast * 0.32);
    col *= 1.0 - (1.0 - smoothstep(-0.7, -0.2, st)) * fast * 0.14;
  }
  // Whitecaps on the chop's crests in a storm.
  float caps = smoothstep(0.55, 0.9, chop) * smoothstep(0.45, 1.0, windForce()) * smoothstep(0.4, 0.9, windGust(p.xz) + 0.2);
  col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.6) * skyTint()), caps * 0.45);
  // Rain's rings (#11): pale lines of the sky's light where the drops land, fewer under a crown, none under a roof.
  if (uRings.x > 0.0) {
    float rings = rainRings(p.xz) * (1.0 - shelter(p));
    col = mix(col, exposeHere(mix(uSkyBottom, vec3(1.0), 0.45) * skyTint()), rings);
  }
  // Ice (#14). In a cell partly frozen, the water by the banks and the slow water freeze first and the fast middle last
  // (how far from the shore: the map's, per cell, smoothed between them). New ice is a clear dark skin; it pales
  // (in the milky looks) as it ages. Thawing, it darkens wet, dark leads open along the flow, and the middle breaks into
  // floes that drift down with the flow and shrink, the ice along the banks going last.
  // (Its rank and its derivatives taken wherever there's ice anywhere: the same for every pixel, so they're defined at
  // the edge of the frozen cells too.)
  if (uIceOn > 0.5) {
    float iceAmt = vIce.x;
    bool thawing = vIce.y > 0.5;
    float shore = vIce.z;
    float breakup = snoise(p.xz * 0.5 + 41.0) * 0.6 + snoise(p.xz * 1.6 + 3.0) * 0.4;
    // (Never below a little over nothing: no ice at all where the map has none, and no seam where a frozen cell meets an
    // open one.)
    float order = max(0.55 * smoothstep(0.0, 3.5, shore) + 0.3 * smoothstep(0.1, 0.7, speed) + 0.12 * breakup + 0.02, 0.04);
    float reach = iceAmt * 1.1;
    float fixedIce = smoothstep(order - 0.03, order + 0.03, reach);
    // How long it's been frozen here, 0 a new skin .. 1 old ice.
    float age = smoothstep(0.0, 0.3, reach - order);
    // Along the flow and across it (still water: the map's x).
    vec2 cr = vec2(dot(p.xz, dir), dot(p.xz, vec2(-dir.y, dir.x)));
    // The ice's edge against open water: a pale line, a pixel or two wide, as its rim catches the light.
    float edgeAt = reach - order - 0.012;
    // (No wider than a band of the rank, however steeply the ice changes between cells, and fading out as the ice does,
    // so nothing's left to cut off where there's next to none.)
    float rim = (1.0 - smoothstep(0.0, clamp(fwidth(edgeAt) * 1.5, 0.006, 0.04), abs(edgeAt))) * smoothstep(0.002, 0.03, iceAmt);
    // How fine a detail can be before it's under a pixel (taken here, before the branches).
    float fine = 1.0 - smoothstep(0.1, 0.3, length(fwidth(cr * 9.0)));
    float cw = length(fwidth(p.xz * 0.6));
    if (iceAmt > 0.002) {
      float iceCover = fixedIce, floes = 0.0;
      if (thawing) {
        // Leads: dark lanes along the flow, opening as the ice goes.
        float lane = abs(snoise(cr * vec2(0.12, 0.9) + 13.0));
        float lead = smoothstep(0.0, 0.03, lane - (1.0 - iceAmt) * 0.22);
        iceCover *= lead; rim *= lead;
        // Floes, carried by the flow as the ripples are (two copies, each carried a while and put back): each copy's floes
        // shrink away as it fades and grow as it comes back, fewer as the ice goes. (Only in the open water.)
        if (fixedIce < 0.999) {
          float fb = uTime / 14.0 + snoise(p.xz * 0.07 + 5.0) * 0.5;
          float g1 = fract(fb), g2 = fract(fb + 0.5), v1 = 1.0 - abs(2.0 * g1 - 1.0), v2 = 1.0 - v1;
          vec3 c1 = iceCells((p.xz - flow * g1 * 14.0) * 0.8), c2 = iceCells((p.xz - flow * g2 * 14.0) * 0.8 + vec2(31.0, 17.0));
          float left = smoothstep(0.02, 0.5, iceAmt);
          // (Each floe shrinks away by its own share of what's left, so they go one by one, none at once.)
          float s1 = 0.06 + (1.0 - left) * 0.3 + (1.0 - smoothstep(0.0, 0.3, v1)) * 0.6 + clamp((hash12(c1.yz) - left) * 3.0, 0.0, 1.0) * 0.5;
          float s2 = 0.06 + (1.0 - left) * 0.3 + (1.0 - smoothstep(0.0, 0.3, v2)) * 0.6 + clamp((hash12(c2.yz + 9.0) - left) * 3.0, 0.0, 1.0) * 0.5;
          float f1 = smoothstep(0.0, 0.04, c1.x - s1), f2 = smoothstep(0.0, 0.04, c2.x - s2);
          floes = max(f1, f2) * (1.0 - fixedIce);
          iceCover = max(iceCover, floes);
        }
      }
      if (iceCover + rim > 0.001) {
        float lightI = sunLight(n, 0.3) * mix(0.3, 1.0, vis);
        // Black ice: dark, the bed faint through it, and glossy: the sky and the banks mirrored whole, not broken by ripples.
        vec2 ruv0 = uv - vMirrorShift;
        // (Blurred a little wider than the open water's: with no ripples to break it up, its half-size texels would shimmer.)
        vec2 rt0 = rt * 1.6;
        vec4 r0 = (texture(uReflect, ruv0) * 2.0 + texture(uReflect, ruv0 + vec2(rt0.x, 0.0)) + texture(uReflect, ruv0 - vec2(rt0.x, 0.0))
          + texture(uReflect, ruv0 + vec2(0.0, rt0.y)) + texture(uReflect, ruv0 - vec2(0.0, rt0.y))) / 6.0;
        vec3 mirror0 = sky * (1.0 - r0.a) + r0.rgb;
        vec3 black = bed * through * 0.35 + scatter * (1.0 - through) * 0.5;
        black = mix(black, mirror0, 0.32) + (clouded - sky) * (1.0 - solid) * 0.25;
        // Milky ice by the banks: pale blue-white, lit as the snow is, streaked along the flow by how it froze.
        float m = 1.0 - smoothstep(0.8, 2.2, shore + breakup * 0.5);
        // A floe's broken ice is paler.
        m = max(m * age, floes * 0.55);
        vec3 iceCol = black;
        if (m > 0.0) {
          float streak = snoise(cr * vec2(0.35, 4.0) + 7.0) * 0.65 + snoise(cr * vec2(0.9, 9.0)) * 0.35 * fine;
          vec3 milky = snowPaint(lightI, 0.08, streak * 0.5) * vec3(0.74, 0.84, 0.96);
          iceCol = mix(black, mix(milky, black, 0.28 + 0.1 * streak), m);
        }
        // Cracks: fine pale lines keyed to the world, fading as the cells shrink towards a pixel.
        if (age > 0.0 && cw < 0.1) {
          vec3 ck = iceCells(p.xz * 0.6 + 9.0);
          float crack = (1.0 - smoothstep(0.0, 0.03 + cw, ck.x)) * (1.0 - smoothstep(0.03, 0.1, cw)) * age
            * smoothstep(-0.2, 0.3, snoise(p.xz * 0.25 + 77.0));
          iceCol = mix(iceCol, snowPaint(lightI, 0.05, 0.0), crack * mix(0.3, 0.45, m));
        }
        // Thawing: wet, darker and glossier as it goes.
        if (thawing) iceCol = mix(iceCol * 0.82, mirror0, 0.12 * (1.0 - iceAmt));
        // Lying snow (the ground's map) on it: a thin dusting streaked by the wind, at most, so the river still reads.
        float lying = groundState(p.xz).x;
        if (lying > 0.004) {
          vec2 wr = vec2(dot(p.xz, uWindDir), dot(p.xz, vec2(-uWindDir.y, uWindDir.x)));
          float drift = snoise(wr * vec2(0.25, 0.6) + 2.0) * 0.7 + snoise(wr * vec2(0.7, 1.6)) * 0.3 * fine;
          iceCol = mix(iceCol, snowPaint(lightI, 0.06, drift * 0.3), smoothstep(-0.1, 0.6, drift + lying - 0.5) * min(lying * 1.4, 0.5) * age);
        }
        col = mix(col, iceCol, iceCover);
        col = mix(col, snowPaint(lightI, 0.05, 0.0), rim * 0.5);
      }
    }
  }
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
}
`;

/** The silhouette pass's surfaces that aren't dabs: depth only, every pixel covered. */
const PREPASS_FRAG = /* glsl */ `
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;
#if defined(MIRROR_CLIP) || defined(WATER_SHEET)
varying vec3 vWorldPos;
#endif
#ifdef MIRROR_CLIP
${WATER_MAP_GLSL}
#endif
#ifdef WATER_SHEET
${WATER_SHEET_GLSL}
varying float vMud;
#endif
void main() {
#ifdef WATER_SHEET
  if (sheetHidden(vWorldPos, vMud)) discard;
#endif
#ifdef MIRROR_CLIP
  // As writeGBuffer does in the reflection: what's under the water isn't reflected.
  if (vWorldPos.y < waterNear(vWorldPos.xz) - 0.01) discard;
#endif
  gColor = vec4(0.0); gAux = vec4(0.0);
}
`;

const DEPTH_FRAG = /* glsl */ `
void main() { gl_FragColor = vec4(1.0); }
`;

const FOLIAGE_DEPTH_FRAG = /* glsl */ `
${NOISE}
${DAB_SHAPE}
varying vec4 vCard;
varying vec4 vPaint;
void main() {
  if (dabShape(vCard.xy, vCard.w * 91.0, vPaint.y) < 0.0) discard;
  gl_FragColor = vec4(1.0);
}
`;

const VERT: Record<MaterialKind, string> = {
  paint: STATIC_VERT, ground: STATIC_VERT, crop: STATIC_VERT, ink: STATIC_VERT, water: WATER_VERT, foliage: FOLIAGE_VERT, grass: GRASS_VERT,
  debris: DEBRIS_VERT,
};
const FRAG: Record<MaterialKind, string> = {
  paint: PAINT_FRAG, ground: PAINT_FRAG, crop: PAINT_FRAG, ink: INK_FRAG, water: WATER_FRAG, foliage: FOLIAGE_FRAG, grass: GRASS_FRAG,
  debris: FOLIAGE_FRAG,
};
/** Painted wood bends with its tree; a crop shows the gusts. (The ground has no trees, but keeps paint's shader exactly.) */
/** The water's own colour (C.water before #18, when the scenes built it), linear. */
const WATER_LINEAR = new THREE.Color(0x2c6e74);
const DEFINES: Partial<Record<MaterialKind, Record<string, number | string>>> = {
  // The ground and what stands on it read their shelter with the land's hollows (AT_GROUND, snow.ts): one lookup, for
  // the shelter at their foot. The roofs (ink) and the crowns (foliage) read the shelter map where they are; the leaves in
  // the air take no snow.
  paint: { TREES: 1, AT_GROUND: 1 }, ground: { TREES: 1, GROUND: 1, AT_GROUND: 1 }, crop: { CROP: 1, AT_GROUND: 1 }, grass: { AT_GROUND: 1 },
  debris: { NO_SNOW: 1 },
  water: { WATER_SHEET: 1, WATER_COLOR: `vec3(${WATER_LINEAR.r.toFixed(6)}, ${WATER_LINEAR.g.toFixed(6)}, ${WATER_LINEAR.b.toFixed(6)})` },
};
const DABS = (kind: MaterialKind) => kind === 'foliage' || kind === 'debris';
const sideOf = (kind: MaterialKind) => (kind === 'grass' || DABS(kind) || kind === 'ink' ? THREE.DoubleSide : THREE.FrontSide);

/** The main material of a kind. */
export function sceneMaterial(kind: MaterialKind, shared: SharedUniforms): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...shared },
    vertexShader: VERT[kind],
    fragmentShader: FRAG[kind],
    defines: { ...DEFINES[kind] },
    vertexColors: true,
    side: sideOf(kind),
  });
  if (DABS(kind)) m.alphaToCoverage = true;
  return m;
}

/**
 * The silhouette variant of a kind, drawn into the main view (and, `mirror` set, the reflection) before the painting:
 * depth only, no colour. The painting after it then runs only where a surface shows, not under the leaves in front of it.
 * Same vertex shader, side and coverage as the main material, so the depths match exactly (HEAD declares gl_Position
 * invariant). In the reflection it leaves out what's under the water, as the painting does.
 */
export function prepassMaterial(kind: MaterialKind, shared: SharedUniforms, mirror = false): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...shared },
    vertexShader: VERT[kind],
    fragmentShader: DABS(kind) ? FRAG[kind] : PREPASS_FRAG,
    defines: { ...DEFINES[kind], PREPASS: 1, ...(mirror ? { MIRROR_CLIP: 1 } : {}) },
    vertexColors: true,
    side: sideOf(kind),
    colorWrite: false,
  });
  if (DABS(kind)) m.alphaToCoverage = true;
  return m;
}

/** The sun's shadow-map variant of a kind. */
export function depthMaterial(kind: MaterialKind, shared: SharedUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...shared },
    vertexShader: VERT[kind],
    fragmentShader: DABS(kind) ? FOLIAGE_DEPTH_FRAG : DEPTH_FRAG,
    defines: { ...DEFINES[kind], SHADOW_PASS: 1 },
    vertexColors: true,
    side: THREE.DoubleSide,
    // Only the depth is read.
    colorWrite: false,
  });
}

// The ground's brush fields, baked: the ground drawn flat into a square texture, each texel holding brushFields where the
// ground is there. A heightfield has one surface over each point, so each point of it has its own texel; the same triangles
// give the same normal, brush scale and angle there as on screen.
const BRUSH_BAKE_VERT = /* glsl */ `
attribute vec4 aPaint;
uniform mat3 uFieldsMap;
varying vec3 vRestPos;
varying vec3 vNormal;
varying vec4 vPaint;
// The rest of the painting's inputs, unused here.
varying vec3 vWorldPos;
varying vec3 vColor;
varying float vViewDepth;
void main() {
  vRestPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vPaint = aPaint;
  vWorldPos = vRestPos; vColor = vec3(0.0); vViewDepth = 0.0;
  gl_Position = vec4((uFieldsMap * vec3(vRestPos.xz, 1.0)).xy * 2.0 - 1.0, 0.0, 1.0);
}
`;
const BRUSH_BAKE_FRAG = /* glsl */ `
${FRAG_HEAD}
${BRUSH_FIELDS}
void main() {
  gColor = brushFields(vRestPos, normalize(vNormal)) * 0.5 + 0.5;
  gAux = vec4(0.0);
}
`;

/** Bakes the ground's brush fields (see BRUSH_BAKE_VERT), over the square `map` takes its x and z to (0 to 1). */
export function groundBakeMaterial(shared: SharedUniforms, map: THREE.Matrix3): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...shared, uFieldsMap: { value: map } },
    vertexShader: BRUSH_BAKE_VERT,
    fragmentShader: BRUSH_BAKE_FRAG,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
  });
}

// The brush by place, baked: on the flat (the grass, the tops of crops) the brush depends only on where it is (x and z), its
// scale and its angle, and paintDabs and paintStrokes only ever blend two of seven fixed angles. So each scale gets seven
// layers over the ground's square, one per angle, read by basisFields. Kept by place, not by mesh: a crop growing, harvested
// or newly sown needs no new bake. Drawn as one quad over the square; 'position' is the quad's corner, -1 to 1.
const BASIS_BAKE_VERT = /* glsl */ `
uniform mat3 uFieldsUnmap;
varying vec3 vRestPos;
// The rest of the painting's inputs, unused here.
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
void main() {
  vec2 xz = (uFieldsUnmap * vec3(position.xy * 0.5 + 0.5, 1.0)).xy;
  vRestPos = vec3(xz.x, 0.0, xz.y);
  vWorldPos = vRestPos; vNormal = vec3(0.0, 1.0, 0.0); vColor = vec3(0.0); vPaint = vec4(0.0); vViewDepth = 0.0;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;
const BASIS_BAKE_FRAG = /* glsl */ `
${FRAG_HEAD}
uniform float uBakeScale;
uniform float uBakeLayer;
void main() {
  // As paintDabs and paintStrokes work them out at the layer's angle. Stored as 0.5 + 0.45 value: dabs reach a little
  // past 1.
  float angle = uBakeLayer * 0.5235988;
  vec2 p = vRestPos.xz;
  float s = uBakeScale;
  gColor = vec4(dabLayer(p, s, angle), strokes(p * s * 0.6, angle), strokes(p * s * 1.3, angle), driftField(vRestPos)) * 0.45 + 0.5;
  gAux = vec4(0.0);
}
`;

/** Bakes one layer of the brush by place (see BASIS_BAKE_VERT); `unmap` takes 0 to 1 across the square back to x, z. */
export function basisBakeMaterial(shared: SharedUniforms, unmap: THREE.Matrix3, scale: number, layer: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...shared, uFieldsUnmap: { value: unmap }, uBakeScale: { value: scale }, uBakeLayer: { value: layer } },
    vertexShader: BASIS_BAKE_VERT,
    fragmentShader: BASIS_BAKE_FRAG,
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
  });
}
