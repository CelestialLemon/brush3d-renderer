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
 * so the sun's shadow map sees the same clumps the eye does. `normal` is the canopy's, so a whole crown shades as one form.
 * aCard: the corner (-1..1), the dab size in metres, and a seed.
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
  float a = aCard.w * 6.2831853;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * aCard.xy;
  vec4 wc = modelMatrix * vec4(position, 1.0);
  // Wind: the whole crown leans gently, each dab flutters a little on its own.
  float sway = sin(uTime * 1.3 + wc.x * 0.4 + wc.z * 0.3) * 0.04 + sin(uTime * 3.7 + aCard.w * 40.0) * 0.015;
  wc.xz += vec2(sway, sway * 0.6) * uWind * max(wc.y, 0.0) * 0.4;
  vec3 world = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  vWorldPos = world;
  vNormal = normalize(mat3(modelMatrix) * normal);
  // Each dab bulges towards the viewer a little, so a clump reads as many leafy pads, not one smooth ball.
  vDabNormal = normalize(right * c.x * 0.55 + up * c.y * 0.55 + toCam * 0.45);
  vColor = color;
  vPaint = aPaint;
  vCard = vec4(aCard.xy, aCard.z, aCard.w);
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

// The surface's own colour, drifting in hue and value across the world: one meadow runs yellow-green to emerald to teal.
vec3 driftColor(vec3 base, vec3 p, float amount, float dab) {
  float v1 = fbm2(p.xz * 0.06 + 3.1);
  vec3 lab = linToOklab(base);
  lab = lchShift(lab, (v1 * 0.02 + dab * 0.05) * amount, 1.0 + (v1 * 0.05 + dab * 0.08) * amount,
                 (v1 * 0.12 + dab * 0.13) * amount);
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
  float dab = paintDabs(bp, vPaint.y, vPaint.z);
  float br = strokes(bp * vPaint.y * 0.6, vPaint.z);
  vec3 base = driftColor(vColor, p, vPaint.x, dab);
  float ndl = dot(n, uSunDir);
  float vis = sunVisibility(p, n, br);
  float light = clamp((ndl + 0.3) / 1.3, 0.0, 1.0) * mix(0.18, 1.0, vis) + dab * 0.07 + br * 0.04;
  vec3 col = paintBands(base, light, 0.05, n.y * 0.5 + 0.5);
  col += uRimColor * rimLight(n, vPaint.w);
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
}
`;

const FOLIAGE_FRAG = /* glsl */ `
${FRAG_HEAD}
varying vec4 vCard;
varying vec3 vDabNormal;
void main() {
  vec2 c = vCard.xy;
  // A dab: a rough round pad with a leafy, broken edge.
  float seed = vCard.w * 91.0;
  float ang = atan(c.y, c.x);
  float lobes = sin(ang * 5.0 + seed) * 0.08 + sin(ang * 9.0 + seed * 1.7) * 0.05;
  float edge = 1.0 - length(c) + lobes + snoise(c * 2.4 + seed) * 0.12;
  float alpha = clamp(edge / max(fwidth(edge), 1e-4) + 0.5, 0.0, 1.0);
  if (alpha < 0.02) discard;
  vec3 n = normalize(normalize(vNormal) * 1.0 + vDabNormal * 0.55);
  vec3 p = vWorldPos;
  // Strokes follow the dab, so each pad carries a couple of brush marks.
  float br = strokes(c * 1.6 + seed, seed);
  vec3 base = driftColor(vColor, p, vPaint.x, br * 0.5);
  float ndl = dot(n, uSunDir);
  float vis = sunVisibility(p, normalize(vNormal), br);
  float light = clamp((ndl + 0.25) / 1.25, 0.0, 1.0) * mix(0.15, 1.0, vis) + br * 0.09;
  // Inner pads sit in the crown's own shade: darker towards the dab's lower side.
  light -= (1.0 - smoothstep(-1.0, 0.6, c.y)) * 0.08;
  vec3 col = paintBands(base, light, 0.06, 0.6);
  col += uRimColor * rimLight(normalize(vNormal), vPaint.w) * vis * 0.45;
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
  float dab = paintDabs(p.xz, vPaint.y, vPaint.z);
  float br = strokes(p.xz * vPaint.y * 0.6, vPaint.z);
  vec3 base = driftColor(vColor, p, vPaint.x, dab);
  float ndl = dot(n, uSunDir);
  float vis = sunVisibility(p, n, br);
  float light = clamp((ndl + 0.3) / 1.3, 0.0, 1.0) * mix(0.18, 1.0, vis) + dab * 0.07 + br * 0.04;
  // Tips catch a little more light than roots.
  light += (vBlade.x - 0.5) * 0.18;
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
  float ndl = dot(n, uSunDir);
  float vis = sunVisibility(p, n, 0.0);
  float light = clamp((ndl + 0.2) / 1.2, 0.0, 1.0) * mix(0.2, 1.0, vis);
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
    vec3 glass = mix(col, skyReflect(r) * uSunColor, fres * 0.7);
    glass = mix(glass, vec3(0.75, 0.92, 1.0) * uSunColor, sheen * 0.45 * vis);
    col = mix(glass, glass * 1.6 + 0.05, grid * 0.6);
  }
  writeGBuffer(col, n, vViewDepth, 1.0, 1.0);
}
`;

/** Painted water: a teal-blue body, sky in the shallows of the glance, flowing strokes, foam along the banks, glints. vUv.y: across (0..1). */
/**
 * Painted water: a deep teal body, sky caught in long strokes that drift with the flow, broken foam where it meets the
 * bank, and sparks of sun. vUv.y runs across the stream (0..1); aPaint.z is the flow's direction.
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
  vec3 lab = linToOklab(vColor);
  vec3 deep = oklabToLin(lchShift(lab, -0.05, 1.1, 0.0));
  vec3 shallow = oklabToLin(lchShift(lab, 0.06, 0.95, 0.4));
  float st = strokes(q * 0.9, flowA);
  vec3 col = mix(deep, shallow, smoothstep(0.45, 1.0, across) * 0.7 + st * 0.08);
  // Sky caught in the water: long pale strokes along the flow.
  float refl = smoothstep(0.25, 0.65, strokes(q * vec2(0.7, 0.7) + 3.0, flowA) * 0.5 + 0.5 - across * 0.25);
  col = mix(col, uSkyColor * vec3(0.78, 0.92, 1.05), refl * 0.45);
  float vis = sunVisibility(p, n, st);
  col *= mix(0.7, 1.0, vis) * mix(uSkyColor, uSunColor, 0.65);
  // Foam: broken white where the water meets the bank.
  float foam = smoothstep(0.8, 0.97, across + snoise(q * vec2(3.0, 1.2)) * 0.12);
  col = mix(col, vec3(0.9, 0.96, 1.0) * uSunColor, foam * 0.75);
  // Sparks of sun.
  float g = snoise(p.xz * 5.0 + vec2(uTime * 0.7, -uTime * 0.5)) * snoise(p.xz * 3.7 - uTime * 0.4);
  col += uSunColor * smoothstep(0.5, 0.7, g) * vis * 0.9;
  writeGBuffer(col, n, vViewDepth, 0.0, 1.0);
}
`;

const DEPTH_FRAG = /* glsl */ `
void main() { gl_FragColor = vec4(1.0); }
`;

const FOLIAGE_DEPTH_FRAG = /* glsl */ `
${NOISE}
varying vec4 vCard;
void main() {
  vec2 c = vCard.xy;
  float seed = vCard.w * 91.0;
  float ang = atan(c.y, c.x);
  float lobes = sin(ang * 5.0 + seed) * 0.08 + sin(ang * 9.0 + seed * 1.7) * 0.05;
  if (1.0 - length(c) + lobes + snoise(c * 2.4 + seed) * 0.12 < 0.0) discard;
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
