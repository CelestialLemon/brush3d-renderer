import { PRESETS, lookAt } from '../renderer/look';
import { BrushRenderer } from '../renderer/renderer';
import { buildMeadow } from '../scenes/meadow';
import { buildFarm } from '../scenes/farm';
import { MAX_ZOOM, MIN_ZOOM } from '../renderer/camera';
import type { MaterialKind } from '../renderer/materials';
import { WIND_SCALE, windName, type Wind, type WindStrength } from '../renderer/wind';
import { defaultCases, runProfile, table, type ProfileCase, type ProfileRow } from './profile';

// The demo viewer. URL parameters, for screenshots and comparisons:
//   view=0..3  zoom=16..96 (screen px per metre)  hour=0..24  x, z (camera target)  t (seconds: freeze the clock there)
//   scene=farm|meadow  lines=0  shadows=0  still (hide the buttons)  dpr (pixel ratio)
//   wind (m/s, or calm|breeze|gale|storm|hurricane)  windDir (degrees the wind blows towards, from +x towards +z)  gust (0..1)
//   samples (MSAA, 0 to turn it off)  shadowMap (texels: 4096 on the farm, 2048 on the meadow)
//   prepass=0 (paint without drawing the silhouettes first)  scissor=0 (the water's passes over the whole screen)
//   profile: time the frame pass by pass, on whatever machine opens it (see profile.ts)

const params = new URLSearchParams(location.search);
const num = (k: string, d: number) => (params.has(k) ? Number(params.get(k)) : d);
const canvas = document.getElementById('view') as HTMLCanvasElement;
const sceneName = params.get('scene') ?? 'farm';
const farm = sceneName === 'farm';
const renderer = new BrushRenderer(canvas, {
  shadowRadius: farm ? 48 : 34, shadowMapSize: num('shadowMap', farm ? 4096 : 2048),
  pixelRatio: params.has('dpr') ? num('dpr', 1) : params.has('profile') ? 1 : undefined,
  samples: params.has('samples') ? num('samples', 4) : undefined,
});
const scene = farm ? buildFarm(renderer) : buildMeadow(renderer);
renderer.setWaterLevel(scene.waterLevel);
const view = renderer.view;
view.view = num('view', 0); view.zoom = num('zoom', 40);
view.target.set(num('x', farm ? 0 : -1), 0, num('z', 0));
view.update(0, true);
renderer.settings.lines = num('lines', 1) !== 0;
renderer.settings.shadows = num('shadows', 1) !== 0;
renderer.settings.prepass = num('prepass', 1) !== 0;
renderer.settings.waterScissor = num('scissor', 1) !== 0;
let hour = num('hour', 12);
const windParam = params.get('wind');
const wind: Wind = {
  speed: windParam === null ? WIND_SCALE.breeze : windParam in WIND_SCALE ? WIND_SCALE[windParam as WindStrength] : Number(windParam),
  direction: (num('windDir', 31) * Math.PI) / 180,
  gust: num('gust', 0.5),
};
renderer.setWind(wind, true);
const frozen = params.has('t') ? num('t', 0) : null;
if (params.has('still') || params.has('profile')) document.body.classList.add('still');

// While profiling, the cases set the size and the camera: the window and the controls leave them alone.
let profiling = false;
function resize() { if (!profiling) renderer.resize(canvas.clientWidth, canvas.clientHeight); }
addEventListener('resize', resize);
resize();

// Controls: drag to pan, wheel to zoom, Q/E to turn, 1-5 for the hour, L lines, S shadows.
let drag: { x: number; y: number } | null = null;
canvas.addEventListener('pointerdown', (e) => { if (profiling) return; drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  view.pan(e.clientX - drag.x, e.clientY - drag.y);
  drag = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (profiling) return;
  view.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
}, { passive: false });
addEventListener('keydown', (e) => {
  if (profiling) return;
  const k = e.key.toLowerCase();
  if (k === 'q') view.turn(-1);
  else if (k === 'e') view.turn(1);
  else if (k === 'l') renderer.settings.lines = !renderer.settings.lines;
  else if (k === 's') renderer.settings.shadows = !renderer.settings.shadows;
  else if (k >= '1' && k <= '5') hour = Object.values(PRESETS)[Number(k) - 1];
  hud();
});

const hudEl = document.getElementById('hud')!;
function hud() {
  hudEl.innerHTML = '';
  for (const [name, h] of Object.entries(PRESETS)) {
    const b = document.createElement('button');
    b.textContent = name;
    b.className = Math.abs(h - hour) < 0.01 ? 'on' : '';
    b.onclick = () => { hour = h; hud(); };
    hudEl.append(b);
  }
  const lines = document.createElement('button');
  lines.textContent = 'Lines'; lines.className = renderer.settings.lines ? 'on' : '';
  lines.onclick = () => { renderer.settings.lines = !renderer.settings.lines; hud(); };
  hudEl.append(lines);
  hudEl.append(slider('Wind', 0, 45, 0.5, wind.speed, (v) => { wind.speed = v; }, (v) => `${windName(v)} ${v.toFixed(1)} m/s`));
  hudEl.append(slider('towards', 0, 360, 5, (wind.direction * 180) / Math.PI, (v) => { wind.direction = (v * Math.PI) / 180; }, (v) => `${v.toFixed(0)}°`));
  const info = document.createElement('span');
  info.textContent = 'drag to pan · wheel to zoom · Q/E to turn';
  hudEl.append(info);
}
function slider(name: string, min: number, max: number, step: number, value: number, set: (v: number) => void, show: (v: number) => string) {
  const label = document.createElement('label');
  const input = Object.assign(document.createElement('input'), { type: 'range', min, max, step, value });
  const out = document.createElement('output');
  out.textContent = show(value);
  input.oninput = () => { const v = Number(input.value); set(v); out.textContent = show(v); renderer.setWind(wind); };
  input.onkeydown = (e) => e.stopPropagation();
  label.append(name, input, out);
  return label;
}
hud();

// Shot mode (tools/): no loop; the tools ask for frames. __shot draws one and returns it as a PNG; __draw puts the camera
// somewhere (a fractional view turns part way), leaves some kinds out, and draws, leaving the frame on the canvas.
if (params.has('shot')) {
  // options.wind sets the wind (at once, unless ease is set: then it eases as the clock runs).
  const draw = (cam?: { x: number; z: number; zoom: number; view: number },
    options: { hide?: MaterialKind[]; grain?: boolean; time?: number; wind?: Partial<Wind>; ease?: boolean } = {}) => {
    if (cam) { view.target.set(cam.x, 0, cam.z); view.zoom = cam.zoom; view.view = cam.view; view.update(0, true); }
    if (options.wind) renderer.setWind({ ...wind, ...options.wind }, !options.ease);
    const kinds: MaterialKind[] = ['paint', 'crop', 'ink', 'water', 'foliage', 'grass', 'debris'];
    for (const k of kinds) renderer.setVisible(k, !options.hide?.includes(k));
    const grain = renderer.settings.grain;
    if (options.grain === false) renderer.settings.grain = 0;
    renderer.setLook(lookAt(hour));
    for (let i = 0; i < 2; i++) renderer.render(options.time ?? frozen ?? 0);
    renderer.settings.grain = grain;
  };
  Object.assign(window, {
    __draw: draw,
    __profile: (cases?: ProfileCase[]) => profile(cases),
    __profileTable: table,
    __shot: () => { draw(); return canvas.toDataURL('image/png'); },
  });
} else requestAnimationFrame(frame);

// Profiling (tools/profile.ts, or ?profile on any machine): the demo's own loop waits while the cases run.
async function profile(cases = defaultCases(), progress?: (row: ProfileRow, i: number) => void) {
  profiling = true;
  try {
    return await runProfile(renderer, (t) => { renderer.setLook(lookAt(hour)); renderer.render(t); },
      () => renderer.setWind(wind, true), cases, progress);
  } finally { profiling = false; resize(); }
}
if (params.has('profile')) profilePanel();

/** The ?profile page: which GPU and browser, a button to run the cases, and their table with a button to copy it. */
function profilePanel() {
  const panel = document.createElement('div');
  panel.id = 'profile';
  const gl = renderer.gl.getContext() as WebGL2RenderingContext;
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  const timers = gl.getExtension('EXT_disjoint_timer_query_webgl2') !== null;
  // Everything that sets the work, as it is when Run is pressed, so pasted results from different settings can't be
  // mistaken for each other.
  const about = () => `scene ${sceneName} · GPU ${gpu} · ${timers ? 'GPU timers' : 'no GPU timers (only the uncapped frame and the CPU)'}\n`
    + `hour ${hour} · x ${view.target.x.toFixed(2)} · z ${view.target.z.toFixed(2)} · zoom ${view.zoom.toFixed(1)} · view ${view.view} · samples ${num('samples', 4)} · shadow map ${num('shadowMap', farm ? 4096 : 2048)} · lines ${renderer.settings.lines ? 'on' : 'off'} · shadows ${renderer.settings.shadows ? 'on' : 'off'} · prepass ${renderer.settings.prepass ? 'on' : 'off'} · water scissor ${renderer.settings.waterScissor ? 'on' : 'off'}\n`
    + `${location.href}\n${navigator.userAgent}`;
  const out = Object.assign(document.createElement('pre'), { textContent: `${about()}\n\nPlug the laptop in, close other apps, then Run. It takes a minute or two.` });
  const run = Object.assign(document.createElement('button'), { textContent: 'Run' });
  const copy = Object.assign(document.createElement('button'), { textContent: 'Copy', disabled: true });
  const other = Object.assign(document.createElement('a'), { textContent: `profile the ${farm ? 'meadow' : 'farm'}` });
  const next = new URLSearchParams(params); next.set('scene', farm ? 'meadow' : 'farm'); other.href = `?${next}`;
  run.onclick = async () => {
    run.disabled = true; copy.disabled = true;
    const cases = defaultCases(), rows: ProfileRow[] = [], head = about();
    out.textContent = `${head}\n\nRunning…`;
    await profile(cases, (row, i) => { rows.push(row); out.textContent = `${head}\n\n${table(rows)}\n\n${i + 1} of ${cases.length}…`; });
    out.textContent = `${head}\n\n${table(rows)}\n\nms per frame; GPU per pass, CPU for the whole frame; uncapped: frames drawn back to back.`;
    run.disabled = false; copy.disabled = false;
  };
  copy.onclick = () => navigator.clipboard.writeText(out.textContent ?? '');
  panel.append(run, copy, other, out);
  document.body.append(panel);
}

const start = performance.now();
let last = start, frames = 0;
function frame(now: number) {
  if (profiling) { requestAnimationFrame(frame); return; }
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  view.update(dt);
  renderer.setLook(lookAt(hour));
  renderer.render(frozen ?? (now - start) / 1000);
  if (++frames === 3) (window as unknown as { __ready: boolean }).__ready = true;
  requestAnimationFrame(frame);
}
