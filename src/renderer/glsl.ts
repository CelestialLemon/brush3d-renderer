// Shared GLSL: noise, OKLab colour, and the painted light model every surface uses.
//
// The look is built in OKLab/OKLCh rather than RGB, so a shadow can turn teal or violet and a lit band warm gold without
// muddying: lightness, chroma and hue move separately, the way a painter mixes a shade instead of adding black.

/** Hashes and noise. All of it is keyed to world positions, never screen ones, so the paint stays put as the camera moves. */
export const NOISE = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
// 2D simplex noise (Ashima Arts, MIT), in [-1, 1].
vec3 permute3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm2(vec2 p) { return snoise(p) * 0.65 + snoise(p * 2.13 + 17.1) * 0.35; }
// Brush strokes: noise stretched along a direction, so it reads as dabs laid side by side rather than as a cloud.
float strokes(vec2 p, float angle) {
  float c = cos(angle), s = sin(angle);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
  return snoise(q * vec2(0.55, 2.6)) * 0.6 + snoise(q * vec2(1.3, 5.5) + 31.7) * 0.4;
}
// Brush dabs: the plane tiled with overlapping, elongated dabs (Voronoi cells in a stretched, turned frame), each flat in
// value, the way a painter lays strokes side by side. Returns two random values in [-1, 1] for the dab under p, and how far
// p is inside it (0 on its border).
vec3 dabs(vec2 p, float angle, float stretch) {
  float c = cos(angle), s = sin(angle);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
  q.x /= stretch;
  vec2 i = floor(q), f = fract(q);
  float best = 1e9, second = 1e9;
  vec2 id = vec2(0.0);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = hash22(i + g) * 0.9 + 0.05;
    vec2 r = g + o - f;
    r.x *= stretch * 0.5;
    float d = dot(r, r);
    if (d < best) { second = best; best = d; id = i + g; } else if (d < second) second = d;
  }
  vec2 h = hash22(id * 1.37 + 4.1) * 2.0 - 1.0;
  return vec3(h, sqrt(second) - sqrt(best));
}
// Two layers of dabs at different sizes and angles, so no grid shows: a value in about [-1, 1].
float paintDabs(vec2 p, float scale, float angle) {
  vec3 a = dabs(p * scale, angle, 2.6);
  vec3 b = dabs(p * scale * 1.9 + 17.3, angle + 0.5, 2.2);
  return a.x * 0.65 + b.x * 0.35;
}
`;

/** OKLab conversions (Björn Ottosson), on linear sRGB. */
export const OKLAB = /* glsl */ `
vec3 linToOklab(vec3 c) {
  c = max(c, 0.0);
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(l, 1.0 / 3.0); m = pow(m, 1.0 / 3.0); s = pow(s, 1.0 / 3.0);
  return vec3(0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
              1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
              0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return max(vec3(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
                 -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
                 -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s), 0.0);
}
// Rotates a colour's hue by 'turn' radians, scales its chroma and shifts its lightness, in OKLCh.
vec3 lchShift(vec3 lab, float dL, float cMul, float turn) {
  float c = cos(turn), s = sin(turn);
  vec2 ab = vec2(c * lab.y - s * lab.z, s * lab.y + c * lab.z) * cMul;
  return vec3(lab.x + dL, ab);
}
// Pulls a colour's hue part of the way towards a target hue (radians in OKLab's a-b plane), the short way round.
vec3 hueToward(vec3 lab, float target, float amount) {
  float h = atan(lab.z, lab.y);
  float d = mod(target - h + 3.14159265, 6.2831853) - 3.14159265;
  float c = length(lab.yz), nh = h + d * amount;
  return vec3(lab.x, c * cos(nh), c * sin(nh));
}
`;

/** The time-of-day light, set once per frame by the renderer. */
export const LIGHT_UNIFORMS = /* glsl */ `
uniform vec3 uSunDir;        // world, towards the sun
uniform vec3 uSunColor;      // linear, multiplies the lit band
uniform vec3 uSkyColor;      // linear, the light that fills shadows from above
uniform vec3 uRimColor;      // linear, the warm edge light on foliage
uniform float uShadeHue;     // OKLab hue the shade band leans to (radians)
uniform float uShadeLean;    // how far it leans (0..1)
uniform float uShadeDepth;   // lightness taken off in shade
uniform float uLitHue;       // OKLab hue the lit band leans to
uniform float uLitLean;
uniform float uTime;
uniform float uWind;
uniform sampler2D uShadowMap;
uniform mat4 uShadowMatrix;  // world -> shadow-map uv and depth
uniform vec2 uShadowTexel;
`;

/** Sun visibility from the shadow map, softened by a small rotated disc of taps and nudged by the brush, in 0..1. */
export const SHADOW = /* glsl */ `
float sunVisibility(vec3 worldPos, vec3 n, float brush) {
  vec3 p = worldPos + n * 0.04;
  vec4 s = uShadowMatrix * vec4(p, 1.0);
  vec3 uvz = s.xyz / s.w;
  if (uvz.x < 0.0 || uvz.x > 1.0 || uvz.y < 0.0 || uvz.y > 1.0 || uvz.z > 1.0) return 1.0;
  // The brush wobbles where the edge is sampled, so a shadow's border is painted rather than ruled.
  vec2 wob = vec2(brush, snoise(worldPos.xz * 1.7 + 9.0)) * uShadowTexel * 2.5;
  float vis = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 2.39996 + hash12(worldPos.xz * 31.0) * 6.283;
    float r = sqrt((float(i) + 0.5) / 8.0) * 2.2;
    vec2 o = vec2(cos(a), sin(a)) * r * uShadowTexel + wob;
    float d = texture(uShadowMap, uvz.xy + o).r;
    vis += (uvz.z - 0.0015 > d) ? 0.0 : 1.0;
  }
  return vis / 8.0;
}
`;

/**
 * The painted light model. `base` is the surface's own colour (linear); `light` is how lit it is (0 deep shade .. 1 full sun),
 * with the brush already in it. Three bands (shade, half-tone, lit) with soft, brush-broken edges: `soft` is how wide an edge is.
 */
export const PAINT = /* glsl */ `
vec3 paintBands(vec3 base, float light, float soft, float upness) {
  vec3 lab = linToOklab(base);
  // Shade: darker, a touch more saturated, leaning to the look's shade hue (teal at noon, violet at dusk).
  vec3 shade = hueToward(lchShift(lab, -uShadeDepth * lab.x, 1.12, 0.0), uShadeHue, uShadeLean);
  // Half-tone: between, leaning a little less.
  vec3 half_ = hueToward(lchShift(lab, -uShadeDepth * 0.45 * lab.x, 1.08, 0.0), uShadeHue, uShadeLean * 0.45);
  // Lit: the colour itself, warmed.
  vec3 lit = hueToward(lchShift(lab, 0.02, 1.06, 0.0), uLitHue, uLitLean);
  float t1 = smoothstep(0.30 - soft, 0.30 + soft, light);
  float t2 = smoothstep(0.62 - soft, 0.62 + soft, light);
  vec3 col = oklabToLin(mix(mix(shade, half_, t1), lit, t2));
  // The sky fills the shade from above; the sun tints the lit band.
  vec3 sky = uSkyColor * (0.55 + 0.45 * upness);
  return mix(col * sky, col * uSunColor, t2 * 0.85 + t1 * 0.15);
}
`;

/** World-to-view normal and the G-buffer write every scene material ends with. */
export const GBUFFER_OUT = /* glsl */ `
layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gAux;   // view normal xy, view depth, ink (1 inked, 0 painted)
void writeGBuffer(vec3 color, vec3 worldNormal, float viewDepth, float ink, float alpha) {
  vec3 vn = normalize((viewMatrix * vec4(worldNormal, 0.0)).xyz);
  gColor = vec4(color, alpha);
  gAux = vec4(vn.xy, viewDepth, ink);
}
`;
