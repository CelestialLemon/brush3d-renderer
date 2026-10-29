import { PRESETS, lookAt } from '../renderer/look';
import { BrushRenderer } from '../renderer/renderer';
import { buildMeadow } from '../scenes/meadow';
import { buildFarm } from '../scenes/farm';
import { MAX_ZOOM, MIN_ZOOM } from '../renderer/camera';
import type { MaterialKind } from '../renderer/materials';

// The demo viewer. URL parameters, for screenshots and comparisons:
//   view=0..3  zoom=16..96 (screen px per metre)  hour=0..24  x, z (camera target)  t (seconds: freeze the clock there)
//   scene=farm|meadow  lines=0  shadows=0  still (hide the buttons)  dpr (pixel ratio)

const params = new URLSearchParams(location.search);
const num = (k: string, d: number) => (params.has(k) ? Number(params.get(k)) : d);
const canvas = document.getElementById('view') as HTMLCanvasElement;
const sceneName = params.get('scene') ?? 'farm';
const farm = sceneName === 'farm';
const renderer = new BrushRenderer(canvas, {
  shadowRadius: farm ? 48 : 34, shadowMapSize: farm ? 4096 : 2048, pixelRatio: params.has('dpr') ? num('dpr', 1) : undefined,
});
const scene = farm ? buildFarm(renderer) : buildMeadow(renderer);
renderer.setWaterLevel(scene.waterLevel);
const view = renderer.view;
view.view = num('view', 0); view.zoom = num('zoom', 40);
view.target.set(num('x', farm ? 0 : -1), 0, num('z', 0));
view.update(0, true);
renderer.settings.lines = num('lines', 1) !== 0;
renderer.settings.shadows = num('shadows', 1) !== 0;
let hour = num('hour', 12);
const frozen = params.has('t') ? num('t', 0) : null;
if (params.has('still')) document.body.classList.add('still');

function resize() { renderer.resize(canvas.clientWidth, canvas.clientHeight); }
addEventListener('resize', resize);
resize();

// Controls: drag to pan, wheel to zoom, Q/E to turn, 1-5 for the hour, L lines, S shadows.
let drag: { x: number; y: number } | null = null;
canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  view.pan(e.clientX - drag.x, e.clientY - drag.y);
  drag = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  view.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
}, { passive: false });
addEventListener('keydown', (e) => {
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
  const info = document.createElement('span');
  info.textContent = 'drag to pan · wheel to zoom · Q/E to turn';
  hudEl.append(info);
}
hud();

// Shot mode (tools/): no loop; the tools ask for frames. __shot draws one and returns it as a PNG; __draw puts the camera
// somewhere (a fractional view turns part way), leaves some kinds out, and draws, leaving the frame on the canvas.
if (params.has('shot')) {
  const draw = (cam?: { x: number; z: number; zoom: number; view: number }, options: { hide?: MaterialKind[]; grain?: boolean; time?: number } = {}) => {
    if (cam) { view.target.set(cam.x, 0, cam.z); view.zoom = cam.zoom; view.view = cam.view; view.update(0, true); }
    const kinds: MaterialKind[] = ['paint', 'ink', 'water', 'foliage', 'grass'];
    for (const k of kinds) renderer.setVisible(k, !options.hide?.includes(k));
    const grain = renderer.settings.grain;
    if (options.grain === false) renderer.settings.grain = 0;
    renderer.setLook(lookAt(hour));
    for (let i = 0; i < 2; i++) renderer.render(options.time ?? frozen ?? 0);
    renderer.settings.grain = grain;
  };
  Object.assign(window, {
    __draw: draw,
    __shot: () => { draw(); return canvas.toDataURL('image/png'); },
  });
} else requestAnimationFrame(frame);

const start = performance.now();
let last = start, frames = 0;
function frame(now: number) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  view.update(dt);
  renderer.setLook(lookAt(hour));
  renderer.render(frozen ?? (now - start) / 1000);
  if (++frames === 3) (window as unknown as { __ready: boolean }).__ready = true;
  requestAnimationFrame(frame);
}
