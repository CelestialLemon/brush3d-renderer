import * as THREE from 'three';
import { GBUFFER_OUT, LIGHT_UNIFORMS, NOISE, OKLAB, PAINT, SHADOW } from './glsl';

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
    uTime: { value: 0 },
    uWind: { value: 1 },
    uShadowMap: { value: null as THREE.Texture | null },
    uShadowMatrix: { value: new THREE.Matrix4() },
    uShadowTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },
  };
}
export type SharedUniforms = ReturnType<typeof createSharedUniforms>;

export type MaterialKind = 'paint' | 'foliage' | 'grass' | 'ink' | 'water';

// ---------------------------------------------------------------------------------------------------------------------
// Vertex shaders

/** Common head: shared uniforms, noise, and the painted attribute (variation, brush scale, stroke angle, rim). */
const HEAD = /* glsl */ `
${LIGHT_UNIFORMS}
${NOISE}
attribute vec4 aPaint;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
`;

const STATIC_VERT = /* glsl */ `
${HEAD}
varying vec2 vUv;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vUv = uv;
  vec4 vp = viewMatrix * wp;
  vViewDepth = -vp.z;
  gl_Position = projectionMatrix * vp;
}
`;

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
varying vec4 vCard;
varying vec3 vDabNormal;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float a = aPaint.z >= 0.0 ? aPaint.z + (aCard.w - 0.5) * 0.7 : aCard.w * 6.2831853;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * aCard.xy;
  vec4 wc = modelMatrix * vec4(position, 1.0);
  // Wind: the whole crown leans gently, each dab flutters a little on its own.
  float sway = sin(uTime * 1.3 + wc.x * 0.4 + wc.z * 0.3) * 0.04 + sin(uTime * 3.7 + aCard.w * 40.0) * 0.015;
  wc.xz += vec2(sway, sway * 0.6) * uWind * max(wc.y, 0.0) * 0.4;
  vec3 world = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  vWorldPos = world;
  vNormal = normalize(mat3(modelMatrix) * normal);
  // Each dab bulges towards the viewer a little; kept faint, so turning the camera doesn't relight the crown.
  vDabNormal = normalize(right * c.x * 0.55 + up * c.y * 0.55 + toCam * 0.45);
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  vec4 vp = viewMatrix * vec4(world, 1.0);
  vViewDepth = -vp.z;
  gl_Position = projectionMatrix * vp;
}
`;

/** Grass and crops: blades that bend in the wind more towards the tip. aBlade: height along the blade (0..1), a seed. */
const GRASS_VERT = /* glsl */ `
${HEAD}
attribute vec2 aBlade;
varying vec2 vBlade;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  float h = aBlade.x * aBlade.x;
  float gust = snoise(wp.xz * 0.12 - vec2(uTime * 0.35, uTime * 0.2)) * 0.5 + 0.5;
  float sway = (sin(uTime * 2.1 + aBlade.y * 6.283 + wp.x * 0.7) * 0.35 + gust * 0.9) * uWind;
  wp.xz += vec2(0.09, 0.05) * sway * h;
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vBlade = aBlade;
  vec4 vp = viewMatrix * wp;
  vViewDepth = -vp.z;
  gl_Position = projectionMatrix * vp;
}
`;

// ---------------------------------------------------------------------------------------------------------------------
// Fragment shaders

const FRAG_HEAD = /* glsl */ `
${LIGHT_UNIFORMS}
${NOISE}
${OKLAB}
${SHADOW}
${PAINT}
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vColor;
varying vec4 vPaint;
varying float vViewDepth;
${GBUFFER_OUT}
vec3 toCamera() { return normalize(vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2])); }

// Where the brush runs on a surface: across the ground on flat faces, around and up on steep ones.
vec2 brushPlane(vec3 p, vec3 n) {
  if (abs(n.y) > 0.6) return p.xz;
  vec2 t = normalize(vec2(-n.z, n.x) + 1e-5);
  return vec2(dot(p.xz, t), p.y);
}

// The surface's own colour, drifting in hue and value across the world (one meadow runs yellow-green to emerald to teal),
// by 'amount'; 'dab' is the brush mark's own shift, already as strong as the surface wants it.
vec3 driftColor(vec3 base, vec3 p, float amount, float dab) {
  float v1 = fbm2(p.xz * 0.06 + 3.1);
  vec3 lab = linToOklab(base);
  lab = lchShift(lab, v1 * 0.02 * amount + dab * 0.05, 1.0 + v1 * 0.05 * amount + dab * 0.08, v1 * 0.12 * amount + dab * 0.13);
  return oklabToLin(lab);
}

float rimLight(vec3 n, float amount) {
  float f = pow(1.0 - clamp(dot(n, toCamera()), 0.0, 1.0), 2.5);
  return amount * f * smoothstep(-0.1, 0.5, dot(n, uSunDir));
}
`;

const PAINT_FRAG = /* glsl */ `
${FRAG_HEAD}
varying vec2 vUv;
void main() {
  vec3 n = normalize(vNormal);
  vec3 p = vWorldPos;
  vec2 bp = brushPlane(p, n);
  float angle = abs(n.y) > 0.6 ? contourAngle(n, vPaint.z) : vPaint.z;
  // aPaint.x is how much brushwork shows here: a painter works the banks, edges and turns of the land and leaves the
  // open lawn as quiet colour.
  float detail = vPaint.x;
  float dab = paintDabs(bp, vPaint.y, angle) * detail;
  float br = paintStrokes(bp * vPaint.y * 0.6, angle);
  vec3 base = driftColor(vColor, p, 1.0, dab);
  float vis = sunVisibility(p, n, br);
  // Cast shadows on the ground fall to half-tone rather than deep shade: the land stays light and calm.
  float light = sunLight(n, 0.3) * mix(abs(n.y) > 0.6 ? 0.3 : 0.18, 1.0, vis) + dab * 0.07 + br * 0.04 * detail;
  // A fine, faint layer of strokes everywhere, so close up even the quiet lawn is paint, not airbrush. It fades out (its
  // contrast, not its place) as the camera pulls back and the strokes get too small to read.
  vec2 fp = bp * vPaint.y * 1.3;
  float fine = paintStrokes(fp, angle) * (1.0 - smoothstep(0.12, 0.4, length(fwidth(fp))));
  light += fine * 0.04;
  vec3 col = paintBands(base, light, 0.05, n.y * 0.5 + 0.5);
  col += uRimColor * rimLight(n, vPaint.w);
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
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
${FRAG_HEAD}
${DAB_SHAPE}
varying vec4 vCard;
varying vec3 vDabNormal;
void main() {
  vec2 c = vCard.xy;
  float seed = vCard.w * 91.0;
  float edge = dabShape(c, seed, vPaint.y);
  float alpha = clamp(edge / max(fwidth(edge), 1e-4) + 0.5, 0.0, 1.0);
  if (alpha < 0.02) discard;
  vec3 nCanopy = normalize(vNormal);
  vec3 n = normalize(nCanopy + vDabNormal * 0.2);
  vec3 p = vWorldPos;
  // Strokes follow the dab, so each one carries a couple of brush marks.
  float br = strokes(c * 1.6 + seed, seed);
  vec3 base = driftColor(vColor, p, vPaint.x, br * 0.35 * vPaint.x);
  float vis = sunVisibility(p, nCanopy, br);
  // In the crown's own shadow the lumps still read: the shadow lowers the light rather than flattening it.
  float lit = sunLight(n, 0.35);
  // Out of the sun, a mass is still lit by the sky from above: tops lighter than undersides, so the shade keeps its form.
  float light = lit * mix(0.32, 1.0, vis) + br * 0.08 + nCanopy.y * 0.12 * (1.0 - vis * lit);
  // A dab is a touch darker at its lower edge, where it tucks under the next.
  light -= (1.0 - smoothstep(-1.0, 0.6, c.y)) * 0.06;
  vec3 col = paintBands(base, light, 0.07, nCanopy.y * 0.5 + 0.5);
  col += uRimColor * rimLight(nCanopy, vPaint.w) * vis * 0.15;
  // Against the sun the crown's edges glow, light coming through the leaves.
  float behind = smoothstep(0.0, 0.7, dot(-toCamera(), uSunDir));
  // Light through a leaf takes the leaf's colour: a warm yellow-green, not the sun's orange.
  float side = pow(1.0 - abs(dot(nCanopy, toCamera())), 3.0);
  col += uRimColor * tintOf(base, 0.75) * behind * side * vPaint.w * 0.7 * mix(0.4, 1.0, vis);
  writeGBuffer(col, n, vViewDepth, 0.0, alpha);
}
`;

const GRASS_FRAG = /* glsl */ `
${FRAG_HEAD}
varying vec2 vBlade;
void main() {
  // Grass is lit like the ground it grows from (its normal is the ground's), so a meadow reads as one painted surface.
  vec3 n = normalize(vNormal);
  vec3 p = vWorldPos;
  float angle = contourAngle(n, vPaint.z);
  float dab = paintDabs(p.xz, vPaint.y, angle) * 0.6;
  float br = paintStrokes(p.xz * vPaint.y * 0.6, angle);
  vec3 base = driftColor(vColor, p, vPaint.x, dab);
  float vis = sunVisibility(p, n, br);
  float light = sunLight(n, 0.3) * mix(0.18, 1.0, vis) + dab * 0.07 + br * 0.04;
  // Tips catch a little more light than roots.
  light += (vBlade.x - 0.5) * 0.1;
  vec3 col = paintBands(base, light, 0.06, 0.8);
  col += uRimColor * vPaint.w * vBlade.x * vBlade.x * vis * 0.25;
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
}
`;

/**
 * Inked: crisp cel bands, the colour barely drifting. aPaint.x picks a finish: 0 plain, 1 solar glass (uv over the panel,
 * aPaint.yz cells along u and v), 2 timber (grain along u).
 */
const INK_FRAG = /* glsl */ `
${FRAG_HEAD}
varying vec2 vUv;
vec3 skyReflect(vec3 r) {
  float t = clamp(r.y * 0.5 + 0.5, 0.0, 1.0);
  return mix(vec3(0.05, 0.12, 0.35), vec3(0.55, 0.78, 1.0), smoothstep(0.35, 0.95, t));
}
void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 p = vWorldPos;
  float finish = vPaint.x;
  vec3 base = vColor;
  float vis = sunVisibility(p, n, 0.0);
  float light = sunLight(n, 0.2) * mix(0.2, 1.0, vis);
  if (finish > 1.5) {
    // Timber: a few long grain streaks.
    float g = snoise(vec2(vUv.x * 1.5, vUv.y * 24.0)) * 0.5 + 0.5;
    base = oklabToLin(lchShift(linToOklab(base), (g - 0.5) * 0.05, 1.0, 0.0));
  }
  vec3 col = paintBands(base, light, 0.02, n.y * 0.5 + 0.5);
  if (finish > 0.5 && finish < 1.5) {
    // Solar glass: deep blue cells under a sky reflection, bright diagonal sheen, thin pale gridlines.
    vec2 cells = vUv * vPaint.yz;
    vec2 f = abs(fract(cells) - 0.5);
    float grid = smoothstep(0.43, 0.47, max(f.x, f.y));
    vec3 v = toCamera();
    vec3 r = reflect(-v, n);
    float fres = 0.25 + 0.75 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
    float sheen = smoothstep(0.1, 0.0, abs(fract(vUv.x * 0.8 + vUv.y * 0.9 - uTime * 0.0) - 0.55) - 0.12);
    vec3 glass = mix(col, skyReflect(r) * sunTint(), fres * 0.7);
    glass = mix(glass, vec3(0.75, 0.92, 1.0) * sunTint(), sheen * 0.45 * vis);
    col = mix(glass, glass * 1.6 + 0.05, grid * 0.6);
  }
  writeGBuffer(col, n, vViewDepth, 1.0, 1.0);
}
`;

/**
 * Painted water, built from value masses the way a painter lays it: mostly the sky, pale; broad cloud shapes caught in it;
 * the banks and their greenery reflected dark along either edge; a quiet blue-green body showing through mid-stream; thin
 * ripples drifting with the flow and a few sparks of sun. Reflections stay where they are (they belong to the world), only
 * the ripples move. vUv.y runs across the stream (0..1); aPaint.z is the flow's direction.
 */
const WATER_FRAG = /* glsl */ `
${FRAG_HEAD}
varying vec2 vUv;
void main() {
  vec3 n = vec3(0.0, 1.0, 0.0);
  vec3 p = vWorldPos;
  float flowA = vPaint.z;
  vec2 dir = vec2(cos(flowA), sin(flowA));
  vec2 q = p.xz - dir * uTime * 0.35;
  float across = abs(vUv.y - 0.5) * 2.0;
  float st = paintStrokes(p.xz * 0.9, flowA);
  // The body: the stream's own blue-green, a little deeper mid-stream.
  vec3 body = oklabToLin(lchShift(linToOklab(vColor), 0.06 - (1.0 - across) * 0.05, 1.0, 0.0));
  // The sky, lifted towards white: it's what most of the water shows from above.
  vec3 skyLab = linToOklab(uSkyColor);
  vec3 sky = oklabToLin(vec3(skyLab.x - 0.06, skyLab.yz * 1.7));
  vec3 col = mix(body, sky, 0.5 + st * 0.06);
  // Clouds in the water: a few pale shapes, their edges dragged along the flow by the brush.
  float cloud = fbm2(p.xz * 0.13 + vec2(uTime * 0.004, 0.0)) + st * 0.2;
  col = mix(col, mix(sky, vec3(1.0), 0.6), smoothstep(0.3, 0.45, cloud) * 0.8);
  // The banks reflected: a dark band of their greenery along each edge, ragged and wider in places.
  float reach = 0.42 + snoise(p.xz * 0.35 + 4.0) * 0.2 + st * 0.1;
  float bank = smoothstep(reach, reach + 0.2, across);
  vec3 green = oklabToLin(vec3(0.34, -0.07, 0.03));
  col = mix(col, green, bank * 0.85);
  // Ripples: thin lighter strokes moving with the flow, low contrast.
  float rip = strokes(q * vec2(1.6), flowA);
  col = mix(col, mix(sky, vec3(1.0), 0.4), smoothstep(0.55, 0.85, rip) * 0.22 * (1.0 - bank));
  float vis = sunVisibility(p, n, st);
  col *= mix(0.72, 1.0, vis) * mix(skyTint(), sunTint(), 0.5);
  // Where the water meets the bank: a dark wet edge, broken.
  float wet = smoothstep(0.88, 0.97, across + snoise(p.xz * 2.5) * 0.04);
  col *= 1.0 - wet * 0.35;
  // A few sparks of sun, mostly in the open water.
  float g = snoise(p.xz * 5.0 + vec2(uTime * 0.7, -uTime * 0.5)) * snoise(p.xz * 3.7 - uTime * 0.4);
  col += sunTint() * smoothstep(0.66, 0.8, g) * vis * (1.0 - bank) * 0.9;
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
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
  paint: STATIC_VERT, ink: STATIC_VERT, water: STATIC_VERT, foliage: FOLIAGE_VERT, grass: GRASS_VERT,
};
const FRAG: Record<MaterialKind, string> = {
  paint: PAINT_FRAG, ink: INK_FRAG, water: WATER_FRAG, foliage: FOLIAGE_FRAG, grass: GRASS_FRAG,
};

/** The main material of a kind. */
export function sceneMaterial(kind: MaterialKind, shared: SharedUniforms): THREE.ShaderMaterial {
  const m = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...shared },
    vertexShader: VERT[kind],
    fragmentShader: FRAG[kind],
    vertexColors: true,
    side: kind === 'grass' || kind === 'foliage' || kind === 'ink' ? THREE.DoubleSide : THREE.FrontSide,
  });
  if (kind === 'foliage') m.alphaToCoverage = true;
  return m;
}

/** The sun's shadow-map variant of a kind. */
export function depthMaterial(kind: MaterialKind, shared: SharedUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { ...shared },
    vertexShader: VERT[kind],
    fragmentShader: kind === 'foliage' ? FOLIAGE_DEPTH_FRAG : DEPTH_FRAG,
    vertexColors: true,
    side: THREE.DoubleSide,
  });
}
