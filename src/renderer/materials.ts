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
    uViewBack: { value: new THREE.Vector3(0, 0, 1) },
    uShadowMap: { value: null as THREE.Texture | null },
    uShadowMatrix: { value: new THREE.Matrix4() },
    uShadowTexel: { value: new THREE.Vector2(1 / 2048, 1 / 2048) },
    uMirror: { value: 0 },
    uMirrorY: { value: 0 },
    // For the water: the bed drawn without it (colour, and the G-buffer's aux for its depth), the scene mirrored in it, the
    // screen size in pixels, and the sky it reflects where nothing else is.
    uUnder: { value: null as THREE.Texture | null },
    uUnderAux: { value: null as THREE.Texture | null },
    uReflect: { value: null as THREE.Texture | null },
    uScreen: { value: new THREE.Vector2(1, 1) },
    uSkyTop: { value: new THREE.Color() },
    uSkyBottom: { value: new THREE.Color() },
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
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vUv = uv;
  place(wp.xyz);
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
uniform vec2 uScreen;
varying vec4 vCard;
varying vec3 vDabNormal;
varying float vCardPx;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  float a = aPaint.z >= 0.0 ? aPaint.z + (aCard.w - 0.5) * 0.7 : aCard.w * 6.2831853;
  vec2 c = mat2(cos(a), sin(a), -sin(a), cos(a)) * aCard.xy;
  vec4 wc = modelMatrix * vec4(position, 1.0);
  // Wind: the whole crown leans gently, each dab flutters a little on its own.
  float sway = sin(uTime * 1.3 + wc.x * 0.4 + wc.z * 0.3) * 0.04 + sin(uTime * 3.7 + aCard.w * 40.0) * 0.015;
  wc.xyz += acrossView(vec3(sway, 0.0, sway * 0.6) * uWind * max(wc.y, 0.0) * 0.4);
  vec3 world = wc.xyz + (right * c.x + up * c.y) * aCard.z;
  vWorldPos = world;
  vNormal = normalize(mat3(modelMatrix) * normal);
  // Each dab bulges towards the viewer a little; kept faint, so turning the camera doesn't relight the crown.
  vDabNormal = normalize(right * c.x * 0.55 + up * c.y * 0.55 + toCam * 0.45);
  vColor = color;
  vPaint = aPaint;
  vCard = aCard;
  // Screen pixels per unit of the card, for its edge's antialiasing (orthographic: the same everywhere on screen).
  vCardPx = aCard.z * projectionMatrix[0][0] * uScreen.x * 0.5;
  place(world);
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
  float h = aBlade.x * aBlade.x;
  float gust = snoise(wp.xz * 0.12 - vec2(uTime * 0.35, uTime * 0.2)) * 0.5 + 0.5;
  float sway = (sin(uTime * 2.1 + aBlade.y * 6.283 + wp.x * 0.7) * 0.35 + gust * 0.9) * uWind;
  wp.xyz += acrossView(vec3(0.09, 0.0, 0.05) * sway * h);
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = color;
  vPaint = aPaint;
  vBlade = aBlade.xy;
  place(wp.xyz);
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
  vec3 w = planeWeights(n);
  float angle = contourAngle(n, vPaint.z);
  // aPaint.x is how much brushwork shows here: a painter works the banks, edges and turns of the land and leaves the
  // open lawn as quiet colour.
  float detail = vPaint.x;
  float dab = dabsOn(p, w, vPaint.y, angle, vPaint.z) * detail;
  float br = strokesOn(p * vPaint.y * 0.6, w, angle, vPaint.z);
  vec3 base = driftColor(vColor, p, 1.0, dab);
  float vis = sunVisibility(p, n, br);
  // Cast shadows on the ground fall to half-tone rather than deep shade: the land stays light and calm.
  float floor_ = mix(0.18, 0.3, smoothstep(0.5, 0.7, abs(n.y)));
  float light = sunLight(n, 0.3) * mix(floor_, 1.0, vis) + dab * 0.07 + br * 0.04 * detail;
  // A fine, faint layer of strokes everywhere, so close up even the quiet lawn is paint, not airbrush. It fades out (its
  // contrast, not its place) as the camera pulls back and the strokes get too small to read.
  vec3 fp = p * vPaint.y * 1.3;
  float fine = strokesOn(fp, w, angle, vPaint.z) * (1.0 - smoothstep(0.12, 0.4, length(fwidth(fp))));
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
varying float vCardPx;
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
  // A crown's shade goes deeper than the ground's, and cooler: the dark under a tree is what makes it a mass.
  vec3 lab = linToOklab(col);
  float shade = 1.0 - smoothstep(0.25, 0.6, light);
  lab.x *= 1.0 - 0.22 * shade;
  col = oklabToLinFit(hueToward(lab, uShadeHue, 0.08 * shade));
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
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vUv;
void main() {
  vec3 n = normalize(vNormal);
  // Mirroring flips which side faces the camera.
  if (gl_FrontFacing == (uMirror > 0.5)) n = -n;
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
    // Solar glass: deep blue cells under the sky's reflection. Light drifts across the whole array (one sky over all of
    // it, the way the water's is), brightest where the glass turns towards the horizon, with a sheen where the sun is.
    vec2 cells = vUv * vPaint.yz;
    // Lines a pixel's worth antialiased, and fading out as the cells shrink to a few pixels, so they don't crawl.
    vec2 fw = max(fwidth(cells), 1e-4);
    vec2 line = clamp((0.03 - (0.5 - abs(fract(cells) - 0.5))) / fw + 0.5, 0.0, 1.0);
    float grid = max(line.x, line.y) * (1.0 - smoothstep(0.12, 0.3, max(fw.x, fw.y)));
    vec3 v = toCamera();
    vec3 r = reflect(-v, n);
    float fres = 0.2 + 0.5 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
    // Mostly the deep upper sky, with pale cloud-light drifting through and long glints across the rows.
    float drift = smoothstep(0.1, 0.8, fbm2(p.xz * 0.06 + 11.0));
    float glint = smoothstep(0.75, 1.0, sin(dot(p.xz, vec2(0.55, 0.35)) + fbm2(p.xz * 0.1) * 1.5));
    vec3 sky = mix(uSkyTop, mix(uSkyBottom, vec3(1.0), 0.5), clamp(drift * 0.75 + glint * 0.6, 0.0, 1.0));
    vec3 glass = mix(col, sky * sunTint(), clamp(fres + drift * 0.3 + glint * 0.4, 0.0, 1.0));
    float sun = pow(max(dot(r, uSunDir), 0.0), 6.0);
    glass = mix(glass, vec3(1.0) * sunTint(), sun * 0.6 * vis);
    col = mix(glass, glass * 1.3 + 0.04, grid * 0.35);
  }
  writeGBuffer(col, n, vViewDepth, 1.0, 1.0);
}
`;

/**
 * Water: what's under it, tinted by how much water the eye looks through, and what's around it, mirrored.
 *   The bed: the ground and stones drawn without the water (uUnder), nudged by the ripples. The light that reaches it is
 *   absorbed along the path through the water, red first, so the shallows show the bed in clear green-gold and the middle
 *   deepens to blue-green, the water's own colour scattered back.
 *   The reflection: the scene mirrored in the water (uReflect), the sky where there's nothing, more of it where the water
 *   is deep and dark, broken along the flow by ripples.
 * Ripples drift with the flow; the reflection and the bed stay put. aPaint.z is the flow's direction.
 */
const WATER_FRAG = /* glsl */ `
${FRAG_HEAD}
uniform sampler2D uUnder;
uniform sampler2D uUnderAux;
uniform sampler2D uReflect;
uniform vec2 uScreen;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
varying vec2 vUv;
void main() {
  vec3 n = vec3(0.0, 1.0, 0.0);
  vec3 p = vWorldPos;
  float flowA = vPaint.z;
  vec2 dir = vec2(cos(flowA), sin(flowA));
  vec2 q = p.xz - dir * uTime * 0.35;
  vec2 uv = gl_FragCoord.xy / uScreen;
  // Ripples: long, soft swells along the flow, and their screen-space nudge.
  float r1 = strokes(q * 1.3, flowA), r2 = strokes(q * 2.9 + 7.0, flowA + 0.3);
  float ripple = r1 * 0.65 + r2 * 0.35;
  vec2 nudge = vec2(snoise(q * 1.7), snoise(q * 1.7 + 19.0)) * 0.0035;

  // Under the water.
  vec2 uvBed = uv + nudge;
  vec3 bed = texture(uUnder, uvBed).rgb;
  float bedDepth = texture(uUnderAux, uvBed).z;
  float path = bedDepth > 0.0 ? max(bedDepth - vViewDepth, 0.0) : 3.0;
  vec3 waterLab = linToOklab(vColor);
  vec3 scatter = oklabToLin(lchShift(waterLab, 0.06, 1.35, 0.0));
  vec3 absorb = vec3(1.9, 0.75, 0.6);
  vec3 through = exp(-absorb * path);
  float vis = sunVisibility(p, n, ripple);
  // The body of the water is lit from above by the sky; the sun shows in its sparks.
  scatter *= skyTint() * mix(0.75, 1.0, vis);
  vec3 under = bed * through + scatter * (1.0 - through);

  // The reflection, and the sky where nothing is reflected: looking down at 30 degrees, the water mirrors the sky 30 degrees up.
  // Taken through a small blur: the reflection is drawn at half size, and its thin bright things (grass blades above all)
  // would flicker as the camera moves.
  vec2 rt = 3.0 / uScreen;
  vec2 ruv = uv + nudge * 1.6;
  vec4 refl = (texture(uReflect, ruv) * 2.0 + texture(uReflect, ruv + vec2(rt.x, 0.0)) + texture(uReflect, ruv - vec2(rt.x, 0.0))
    + texture(uReflect, ruv + vec2(0.0, rt.y)) + texture(uReflect, ruv - vec2(0.0, rt.y))) / 6.0;
  // The upper sky, and on the ripples' crests, which tilt towards the horizon, the glow low in it: a mean of the two would be grey.
  vec3 sky = mix(uSkyTop, uSkyBottom, 0.25);
  vec3 mirrored = sky * (1.0 - refl.a) + refl.rgb;
  // Mostly see-through: the bed shows in the shallows, and the reflection grows only where the water is deep and dark.
  float depthy = 1.0 - (through.g * 0.5 + through.b * 0.5);
  float fres = clamp(0.08 + depthy * 0.22 + ripple * 0.1, 0.0, 0.5);
  vec3 col = mix(under, mirrored, fres);
  col = mix(col, mix(uSkyBottom, vec3(1.0), 0.25), smoothstep(0.5, 0.9, ripple) * 0.25 * depthy);
  // Sparkle: glints of sun on the ripples' crests, little dashes lying across the flow, carried along by it, each winking
  // in and out on its own beat. Sparse and soft, so they sit on the clear water rather than whiting it out.
  vec2 fq = vec2(dot(q, dir), dot(q, vec2(-dir.y, dir.x))) * vec2(3.5, 1.6);
  vec2 cell = floor(fq), f = fract(fq) - 0.5 - (hash22(cell) - 0.5) * 0.5;
  float h = hash12(cell + 7.3);
  float wink = max(0.0, sin(uTime * (2.0 + h * 3.0) + h * 40.0));
  float crest = smoothstep(-0.15, 0.35, ripple);
  float spark = (1.0 - smoothstep(0.5, 1.0, length(f / vec2(0.15, 0.3)))) * step(0.5, h) * wink * crest;
  col = mix(col, mix(vec3(1.0), sunTint(), 0.5), spark * vis * (0.2 + depthy * 0.4));
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
    defines: { SHADOW_PASS: 1 },
    vertexColors: true,
    side: THREE.DoubleSide,
  });
}
