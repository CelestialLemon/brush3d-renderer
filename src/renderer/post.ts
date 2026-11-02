import { FOG_NOISE_CELLS } from './fog';
import { NOISE, OKLAB } from './glsl';
import { STREAK_STRETCH, WIND_GLSL } from './wind';

// The post pass: the heat's shimmer, lines on inked things, the fog or dust lying on the land, the distance's haze, the sky,
// a grade, and out to sRGB.

export const POST_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const POST_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tColor;
uniform sampler2D tAux;
uniform vec2 uResolution;
uniform float uLineWidth;
uniform float uLines;
uniform float uTargetDepth;
uniform vec3 uHazeColor;
uniform float uHazeDensity;
uniform float uHazeMax;
uniform float uHazeFloor;
uniform vec3 uSkyTop;
uniform vec3 uSkyBottom;
uniform float uExposure;
uniform float uSaturation;
uniform float uNightShift;
uniform float uShadeHue;
uniform float uGrain;
// Where a pixel is in the world: the camera's position, its right and up scaled to half the view, and its forward (the
// camera is orthographic, so every pixel looks the same way and its depth is a distance along it).
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
// The fog (#9): its colour as lit; x how thick, y its base, z its top, w how far under its top it thins (metres). Its
// patches lie in a frame laid along the wind (WindState.haze): x, y its heading, z how far they're drawn out along it, w
// how far they've drifted; and a second frame fading in after the wind turns (uFogNext, uFogFade: how far it's in), so a
// turn never swings them. uFogStreak: how far dust's streaks have blown along each.
uniform sampler2D tFogNoise;
uniform vec3 uFogColor;
uniform vec4 uFog;
uniform vec4 uFogFrame;
uniform vec4 uFogNext;
uniform float uFogFade;
uniform vec2 uFogStreak;
// Dust (#9): x how far the haze is dust, y how strong its streaks are, z how much the gusts thicken and thin it.
uniform vec3 uDust;
// The wind as a whole (the gusts are in its map: see WIND_GLSL).
uniform float uWindSpeed;
uniform vec2 uWindDir;
// The heat's shimmer (#9): x how far it shifts the picture (pixels), y the time (seconds).
uniform vec2 uShimmer;
varying vec2 vUv;
${NOISE}
${OKLAB}
${WIND_GLSL}

const float FAR = 1e4;
float depthOf(vec4 a) { return a.z <= 0.0 ? FAR : a.z; }

// The fog gathers over FOG_SOFT_BASE metres above its base, if it has one, and thins to nothing at its top over uFog.w
// metres: most of its depth, so a shallow mist lies thickest along the water and in the hollows, and a deep fog veils all
// the land while roofs and crowns rise out of it. Its thickness is per depth of the layer, so a shallow mist and a deep fog
// of the same amount hide the bottom of the layer alike.
const float FOG_SOFT_BASE = 1.0;
const float FOG_NOISE_CELLS = ${FOG_NOISE_CELLS.toFixed(1)};
const float FOG_DENSITY = 2.5;
// The most it hides: the farm still shows through the thickest.
const float FOG_MAX = 0.85;

// The baked noise (fog.ts) at a point in noise cells: about -1..1.
float fogNoise(vec2 p) { return texture2D(tFogNoise, p / FOG_NOISE_CELLS).r * 2.0 - 1.0; }

// How thick the fog is at a height, 0..1.
float fogProfile(float y) {
  return clamp((uFog.z - y) / uFog.w, 0.0, 1.0) * clamp((y - uFog.y) / FOG_SOFT_BASE, 0.0, 1.0);
}

// Patches, keyed to the world and drifting with the wind, stretched along it: a thick fog covers everything, a thin one
// breaks up, and the low parts of the layer keep it longest. Two sizes, drifting at different speeds, so the patches
// change shape as they go rather than sliding as one sheet.
float fogPatchIn(vec4 f, vec2 xz) {
  vec2 q = vec2(dot(xz, f.xy) / f.z - f.w, dot(xz, vec2(-f.y, f.x)));
  return fogNoise(q * 0.055) * 0.65 + fogNoise(q * 0.14 + vec2(f.w * 0.035, 0.0) + 11.0) * 0.35;
}
float fogPatch(vec2 xz, float y) {
  float n = fogPatchIn(uFogFrame, xz);
  if (uFogFade > 0.0) n = mix(n, fogPatchIn(uFogNext, xz), smoothstep(0.0, 1.0, uFogFade));
  float bias = (uFog.x - 0.35) * 2.5 + fogProfile(y) * 0.5 - 0.25;
  return smoothstep(-0.5, 0.5, n + bias);
}

// Dust, how much thicker (or thinner, below 1) it is at a point: the gusts sweep it in in waves, thinning between them, and fine streaks blow along the wind through it, quicker than its clouds,
// strongest in a gust. It thickens the dust rather than moving where its patches start, so it shows in a storm's thick
// dust too. Read once, at the surface: the few metres the view crosses in the layer wouldn't show, and reading it at every
// step cost most of what dust adds.
// The gusts are the game's (windGust, from its map): the same that bow the grass, crest for crest.
float fogStreakIn(vec4 f, float drift, vec2 xz) {
  vec2 s = vec2(dot(xz, f.xy) / ${STREAK_STRETCH.toFixed(1)} - drift, dot(xz, vec2(-f.y, f.x)));
  return fogNoise(s * 0.6 + 5.0);
}
float fogDust(vec2 xz) {
  if (uDust.x <= 0.0) return 1.0;
  float gust = windGust(xz);
  float n = fogStreakIn(uFogFrame, uFogStreak.x, xz);
  if (uFogFade > 0.0) n = mix(n, fogStreakIn(uFogNext, uFogStreak.y, xz), smoothstep(0.0, 1.0, uFogFade));
  float streak = n * uDust.y * (0.3 + 1.4 * gust);
  return max(1.0 + uDust.x * (streak + (gust - 0.5) * uDust.z), 0.1);
}

// The share of a surface the fog hides: summed along the view's path up out of the layer from the surface, in a few
// steps, so a patch veils what's under it and things rising out of the fog clear it.
float fogAt(vec3 p) {
  float ya = max(p.y, uFog.y), yb = uFog.z;
  if (yb <= ya) return 0.0;
  vec3 back = -uCamFwd;
  float dy = (yb - ya) / 4.0, sum = 0.0;
  for (int i = 0; i < 4; i++) {
    float y = ya + (float(i) + 0.5) * dy;
    vec3 q = p + back * ((y - p.y) / back.y);
    sum += fogProfile(y) * fogPatch(q.xz, y);
  }
  return FOG_MAX * (1.0 - exp(-sum * dy / uFog.w * uFog.x * FOG_DENSITY * fogDust(p.xz)));
}

// Laid over a colour: a veil of its colour, with a trace of the paint's own colour given back over it at the veil's
// lightness. The developer's pick (#9, 'tint'): the fog drains colour, as fog does, but the land under it isn't flat
// grey. A plain veil drained it all; giving back more (0.3, 0.6) read less like fog.
const float FOG_KEEP = 0.15;
vec3 fogOver(vec3 c, float f) {
  if (f <= 0.0) return c;
  vec3 v = mix(c, uFogColor, f);
  vec3 lab = linToOklab(v);
  lab.yz += linToOklab(c).yz * FOG_KEEP * f;
  return oklabToLinFit(lab);
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

// Where a pixel is in the world, from its place on the screen and its depth.
vec3 worldAt(vec2 uv, float d) {
  vec2 ndc = uv * 2.0 - 1.0;
  return uCamPos + uCamRight * ndc.x + uCamUp * ndc.y + uCamFwd * d;
}

void main() {
  vec2 uv = vUv;
  vec4 aux = texture2D(tAux, uv);
  // Heat shimmer: the picture wavers sideways a fraction of a pixel, in thin bands keyed to the world that rise and drift
  // (the hot air over the land), so it stays with the land as the camera moves.
  if (uShimmer.x > 0.0 && aux.z > 0.0) {
    vec3 p = worldAt(uv, aux.z);
    vec2 q = vec2(dot(p.xz, normalize(uCamRight.xz)) * 0.8, p.y * 4.0 + dot(p.xz, normalize(uCamUp.xz)) * 2.0 - uShimmer.y * 1.6);
    uv.x += fogNoise(q + uShimmer.y * vec2(0.15, 0.0)) * uShimmer.x / uResolution.x;
    aux = texture2D(tAux, uv);
  }
  vec3 c = texture2D(tColor, uv).rgb;
  float d = depthOf(aux);
  bool sky = d >= FAR;

  if (sky) {
    c = mix(uSkyBottom, uSkyTop, smoothstep(0.2, 1.0, vUv.y));
  }

  // Ink: a line on an inked surface where it ends against something farther (its silhouette) or folds sharply (a crease).
  // Lines are drawn only on the inked side, in a darker, richer shade of the surface's own colour, never black.
  float edge = 0.0;
  if (uLines > 0.5 && aux.w > 0.02) {
    vec2 px = uLineWidth / uResolution;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.785398;
      vec2 o = vec2(cos(a), sin(a)) * px;
      vec4 b = texture2D(tAux, uv + o);
      float dd = depthOf(b) - d;
      float sil = smoothstep(0.06, 0.16, dd);
      float crease = b.w * smoothstep(0.3, 0.55, length(aux.xy - b.xy));
      edge = max(edge, max(sil, crease * 0.85));
    }
    edge *= aux.w;
  }

  // Fog or dust: lying on the land, over the surface and under the distance's haze.
  float fog = 0.0;
  if (!sky && uFog.x > 0.0) {
    fog = fogAt(worldAt(uv, d));
    c = fogOver(c, fog);
  }

  // Haze: the hour's air over everything, thickening with distance past the camera's target.
  if (!sky) {
    float far = max(d - uTargetDepth, 0.0);
    float haze = max((1.0 - exp(-far * uHazeDensity)) * uHazeMax, uHazeFloor);
    c = mix(c, uHazeColor, haze);
  }

  // In fog, lines fade halfway with what they draw. The developer's pick (#9, 'soft'): fading all the way looked more like
  // a painting, but the things the player can use got lost in the fog.
  edge *= 1.0 - fog / FOG_MAX * 0.5;
  if (edge > 0.0) {
    vec3 lab = linToOklab(c);
    vec3 ink = hueToward(lchShift(lab, -0.45 * lab.x, 1.25, 0.0), uShadeHue, 0.25);
    c = mix(c, oklabToLinFit(ink), edge * 0.9);
  }

  // Grade: exposure, a soft shoulder instead of a hard clip, richer chroma.
  c *= uExposure;
  c = c / (1.0 + max(c - 0.8, 0.0) * 0.9);
  vec3 lab = linToOklab(c);
  lab.yz *= uSaturation;
  // At night, from yellow-green towards blue (the 'blue' night).
  lab.yz += vec2(0.005, -0.035) * uNightShift;
  c = oklabToLinFit(lab);

  vec3 o = toSrgb(c);
  // A faint canvas tooth, and a gentle vignette.
  o += (hash12(gl_FragCoord.xy) - 0.5) * uGrain;
  vec2 v = vUv - 0.5;
  o *= 1.0 - dot(v, v) * 0.35;
  gl_FragColor = vec4(o, 1.0);
}
`;
