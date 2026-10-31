// Checks the cloud recipe (src/renderer/clouds.ts, #8): the game reads its TypeScript for its solar panels and the
// renderer draws its GLSL twin, so the two must give the same shade everywhere.
//   npm run test:clouds        (needs the dev server: it runs the GLSL in the browser; see tools/browser.ts)
//
// 1. The TypeScript alone: the shaded share of the ground is the cover; the field repeats every period; no cover is no
//    shade and full cover is all shade.
// 2. The GLSL twin, worked out on the GPU at a grid of points, against the TypeScript at the same points: for every shape,
//    several covers and seeds, and drifts from none to a thousand kilometres.
// 3. The renderer's cloud map (cloudMap.ts: the twin drawn into a half-float texture whenever the clouds move, which the surfaces read),
//    against the TypeScript at its texels, and read between them as the surfaces read it. Between texels the map is a
//    straight blend, which can't follow a crisp edge's turns within a texel, so there it's checked for where the shade
//    falls rather than its exact value: what's read at a point must be a shade the recipe gives within a texel of it
//    (19 cm on the farm), give or take a fiftieth. The shadows are drawn where the game has them, to within that.
// Exits with 1 if any of them is off by more than its tolerance.
import { CLOUD_GLSL, CLOUD_SHAPES, PERIOD, cloudShade, cloudShift, cloudThreshold, seedOf, type CloudField, type CloudShape } from '../src/renderer/clouds.ts';
import { launch, open } from './browser.ts';

let failed = false;
function check(name: string, value: number, tolerance: number, unit = '') {
  const ok = value <= tolerance;
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${value.toPrecision(3)}${unit} (at most ${tolerance}${unit})`);
}

const shapes = Object.entries(CLOUD_SHAPES) as [string, CloudShape][];

// 1. The TypeScript alone.
console.log('The recipe in TypeScript');
for (const [name, shape] of shapes) {
  let worst = 0;
  for (const cover of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    // A square two kilometres across, far from where the calibration looked, another seed, a drift.
    let sum = 0, n = 0;
    for (let j = 0; j < 160; j++) for (let i = 0; i < 160; i++) {
      sum += cloudShade(5000 + i * 12.7, -3000 + j * 13.1, { cover, x: 812.5, z: -97.25, seed: 4242 }, shape); n++;
    }
    worst = Math.max(worst, Math.abs(sum / n - cover));
  }
  check(`shape ${name}: the shaded share against the cover, worst of five`, worst, 0.03);
  let repeat = 0;
  const field: CloudField = { cover: 0.5, x: 3.3, z: -1.7, seed: 9 }, span = PERIOD * shape.size;
  for (let i = 0; i < 400; i++) {
    const x = i * 1.37, z = i * -0.91;
    repeat = Math.max(repeat, Math.abs(cloudShade(x, z, field, shape) - cloudShade(x + span, z - 2 * span, field, shape)));
  }
  check(`shape ${name}: the field a period away`, repeat, 1e-9);
  const none = cloudShade(10, 20, { cover: 0, x: 0, z: 0, seed: 1 }, shape), all = cloudShade(10, 20, { cover: 1, x: 0, z: 0, seed: 1 }, shape);
  check(`shape ${name}: no cover is no shade, full cover all shade`, Math.abs(none) + Math.abs(1 - all), 0);
}

// 2 and 3, in the browser.
interface Case { shape: string; cover: number; seed: number; x: number; z: number }
const cases: Case[] = [];
for (const [name] of shapes) {
  for (const [cover, seed, x, z] of [[0.3, 1, 0, 0], [0.6, 77, 123.4, -56.7], [0.85, 2 ** 31 - 5, 1e6, -3.3e5], [0.45, 12345, -98765.4, 4321]] as const) {
    cases.push({ shape: name, cover, seed, x, z });
  }
}
/** The grid of points a case is checked at: 256² over a square 120 m across, its corner here. */
const GRID = 256, X0 = -61.3, Z0 = -47.9, STEP = 120 / GRID;

const { browser, page } = await launch();
try {
  await open(page, 't=0&scene=meadow');
  console.log('\nThe GLSL twin on the GPU, against the TypeScript');
  // Each case's uniforms, worked out here as the renderer does.
  const uniforms = cases.map((c) => {
    const shape = CLOUD_SHAPES[c.shape as keyof typeof CLOUD_SHAPES], field = { cover: c.cover, x: c.x, z: c.z, seed: c.seed };
    return { shape: [1 / shape.size, shape.warp, shape.rough, shape.billow], shift: cloudShift(field, shape), threshold: cloudThreshold(c.cover, shape), seed: seedOf(c.seed) };
  });
  const results = await page.evaluate(runTwin, CLOUD_GLSL, uniforms, GRID, X0, Z0, STEP);
  for (const [k, c] of cases.entries()) {
    const shape = CLOUD_SHAPES[c.shape as keyof typeof CLOUD_SHAPES], gpu = results[k];
    let worst = 0;
    for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) {
      // The points as the GPU has them: its pixels' centres.
      const ts = cloudShade(X0 + (i + 0.5) * STEP, Z0 + (j + 0.5) * STEP, c, shape);
      worst = Math.max(worst, Math.abs(ts - gpu[j * GRID + i]));
    }
    check(`shape ${c.shape}, cover ${c.cover}, seed ${c.seed}, drift (${c.x}, ${c.z}): the largest difference`, worst, 0.005);
  }

  console.log('\nThe renderer\'s cloud map, against the TypeScript');
  for (const c of cases.filter((_, i) => i % 4 === 2 || i % 4 === 1)) {
    const shape = CLOUD_SHAPES[c.shape as keyof typeof CLOUD_SHAPES];
    const map = await page.evaluate(readMap, c.shape, { cover: c.cover, x: c.x, z: c.z, seed: c.seed });
    let texel = 0, between = 0;
    const size = map.size, side = 1 / map.rect[2];
    for (let j = 0; j < size; j += 3) for (let i = 0; i < size; i += 3) {
      const ts = cloudShade(map.rect[0] + ((i + 0.5) / size) * side, map.rect[1] + ((j + 0.5) / size) * side, c, shape);
      texel = Math.max(texel, Math.abs(ts - map.values[j * size + i]));
    }
    // Between texels, as the surfaces read it (bilinear), at points off the texel grid.
    for (let k = 0; k < 20000; k++) {
      const u = 0.02 + 0.96 * ((k * 0.6180339887) % 1), v = 0.02 + 0.96 * ((k * 0.7548776662) % 1);
      const st = [u * size - 0.5, v * size - 0.5], i0 = Math.floor(st[0]), j0 = Math.floor(st[1]), fx = st[0] - i0, fy = st[1] - j0;
      const at = (i: number, j: number) => map.values[j * size + i];
      const read = (at(i0, j0) * (1 - fx) + at(i0 + 1, j0) * fx) * (1 - fy) + (at(i0, j0 + 1) * (1 - fx) + at(i0 + 1, j0 + 1) * fx) * fy;
      // The shades the recipe gives within a texel of the point: its own and eight round it, a texel off.
      const x = map.rect[0] + u * side, z = map.rect[1] + v * side, h = side / size;
      let lo = Infinity, hi = -Infinity;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const ts = cloudShade(x + di * h, z + dj * h, c, shape);
        lo = Math.min(lo, ts); hi = Math.max(hi, ts);
      }
      between = Math.max(between, read < lo ? lo - read : read > hi ? read - hi : 0);
    }
    const name = `shape ${c.shape}, cover ${c.cover}, drift (${c.x}, ${c.z})`;
    check(`${name}: at its texels (half floats)`, texel, 0.004);
    // A fiftieth of the shade to spare: a bump inside a texel, which a blend can't reach.
    check(`${name}: between them, as the surfaces read it, past the shades within a texel`, between, 0.02);
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);

/** In the page: the GLSL twin at the grid's points, for each case, read back as floats. */
function runTwin(glsl: string, uniforms: { shape: number[]; shift: number[]; threshold: number[]; seed: number }[], grid: number, x0: number, z0: number, step: number) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2')!;
  if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('no float render targets');
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'compile');
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `#version 300 es
precision highp float; precision highp int;
${glsl}
uniform vec3 uGrid;
out vec4 o;
// gl_FragCoord is a pixel's centre: the point x0 + (i + 0.5) * step, as the TypeScript is asked.
void main() { o = vec4(cloudShadeAt(uGrid.xy + gl_FragCoord.xy * uGrid.z), 0.0, 0.0, 1.0); }`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'link');
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, grid, grid, 0, gl.RGBA, gl.FLOAT, null);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, grid, grid);
  const u = (name: string) => gl.getUniformLocation(program, name);
  const out: number[][] = [];
  for (const c of uniforms) {
    gl.uniform4fv(u('uCloudShape'), c.shape);
    gl.uniform2fv(u('uCloudShift'), c.shift);
    gl.uniform2fv(u('uCloudThreshold'), c.threshold);
    gl.uniform1i(u('uCloudSeed'), c.seed);
    gl.uniform3f(u('uGrid'), x0, z0, step);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const px = new Float32Array(grid * grid * 4);
    gl.readPixels(0, 0, grid, grid, gl.RGBA, gl.FLOAT, px);
    out.push(Array.from({ length: grid * grid }, (_, i) => px[i * 4]));
  }
  return out;
}

/** In the page: the renderer's cloud map drawn for a field, read back. */
async function readMap(shape: string, field: CloudField) {
  const { CLOUD_SHAPES: shapes } = await import('/src/renderer/clouds.ts' as string);
  const r = (window as unknown as { __renderer: any; __draw: () => void }).__renderer;
  r.cloudShape = shapes[shape];
  r.cloudMap.draw(r.gl, field, shapes[shape]);
  const t = r.cloudMap.target, size = t.width;
  // Half floats, one a texel (the map is red only), each turned into a number.
  const raw = new Uint16Array(size * size);
  r.gl.readRenderTargetPixels(t, 0, 0, size, size, raw);
  const half = (h: number) => {
    const e = (h >> 10) & 31, m = h & 1023, s = h >> 15 ? -1 : 1;
    return s * (e === 0 ? m / 1024 * 2 ** -14 : e === 31 ? NaN : (1 + m / 1024) * 2 ** (e - 15));
  };
  return { size, rect: r.shared.uCloudRect.value.toArray() as number[], values: Array.from({ length: size * size }, (_, i) => half(raw[i])) };
}
