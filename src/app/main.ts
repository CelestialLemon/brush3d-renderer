import { PRESETS, lookAt } from '../renderer/look';
import { BrushRenderer } from '../renderer/renderer';
import { buildMeadow } from '../scenes/meadow';
import { buildFarm } from '../scenes/farm';
import { MAX_ZOOM, MIN_ZOOM } from '../renderer/camera';
import type { MaterialKind } from '../renderer/materials';
import { cloudDriftSpeed } from '../renderer/clouds';
import { WEATHER_PRESETS, type CloudDrift, type Haze, type HazeKind, type Weather, type WeatherName } from '../renderer/weather';
import { HEAT_RECIPES, type HeatLook } from '../renderer/air';
import { WIND_SCALE, windName, type Wind, type WindStrength } from '../renderer/wind';
import { defaultCases, runProfile, table, type ProfileCase, type ProfileRow } from './profile';
import { SPEEDS, SPELLS, TICK, timelineAt, timelinePhase, timelineWind, type SpellName } from './timeline';

// The demo viewer. URL parameters, for screenshots and comparisons:
//   view=0..3  zoom=16..192 (screen px per metre)  hour=0..24  x, z (camera target)  t (seconds: freeze the clock there)
//   scene=farm|meadow  lines=0  shadows=0  still (hide the buttons)  dpr (pixel ratio)
//   wind (m/s, or calm|breeze|gale|storm|hurricane)  windDir (degrees the wind blows towards, from +x towards +z)  gust (0..1)
//   weather (clear|scattered|overcast|soft-rain|storm|fog|dust|heat-wave|snow|blizzard), then each value over it:
//     cloud, rain, snow, heat (0..1)  haze (0..1)  hazeColor (sRGB hex, e.g. cfd6d8)  hazeTop, hazeBase (metres)
//     hazeKind=fog|dust
//   heatLook=glare|gold|dry (the heat wave's light), shimmer=off|faint|more: looks to choose between (#9)
//   timeline (play the scripted weather, standing in for the game; timeline=3 at 3x the game's speed)
//   spell=shower|fog|dust (which scripted weather: a shower, a morning fog lifting, or a dust storm blowing through)
//   cloudSeed (which cloud field: a whole number)
//   falling=0 (leave out the things in the air: the wind's leaves, and rain, snow and dust to come)
//   samples (MSAA, 0 to turn it off)  shadowMap (texels: 4096 on the farm, 2048 on the meadow)
//   prepass=0 (paint without drawing the silhouettes first)  scissor=0 (the water's passes over the whole screen)
//   equal=0 (paint at or nearer the silhouettes' depth, not only at it)
//   ground=live, crop=live, grass=live (that kind's brush worked out in every pixel, as before it was baked at load)
//   shelter (show the shelter map over the frame: what's under a roof, under a crown, the roofs' tops; the map in the corner)
//   shelterSize (its texels across: 1024, or 512 reduced)
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
  shelterSize: num('shelterSize', 1024),
});
// On a high-DPI screen the frame is drawn at 1080p's pixel count and scaled up: the budget's, and to the developer's eye
// on the MacBook no softer than 1440p's (#6, #28). Not with dpr or profile, which set the pixels themselves.
if (!params.has('dpr') && !params.has('profile')) renderer.maxPixels = 1920 * 1080;
const farmScene = farm ? buildFarm(renderer) : null;
const scene = farmScene ?? buildMeadow(renderer);
/** Settles once the scene's models are in. */
const loaded = farmScene?.ready ?? Promise.resolve();
let isLoaded = false;
loaded.then(() => { isLoaded = true; });
renderer.setWaterLevel(scene.waterLevel);
const view = renderer.view;
view.view = num('view', 0); view.zoom = num('zoom', 40);
view.target.set(num('x', farm ? 0 : -1), 0, num('z', 0));
view.update(0, true);
renderer.settings.lines = num('lines', 1) !== 0;
renderer.settings.shadows = num('shadows', 1) !== 0;
renderer.settings.prepass = num('prepass', 1) !== 0;
renderer.settings.waterScissor = num('scissor', 1) !== 0;
renderer.settings.equalDepth = num('equal', 1) !== 0;
renderer.settings.shelterDebug = params.has('shelter') && params.get('shelter') !== '0';
// The ground's brush, baked at load into a 2048² texture: the developer's pick (#6, #23), the same to the eye as live
// and as 4096², at a quarter of 4096's memory. The grass's and crops' brush by place, 1024² at seven angles a scale.
const bakes = { ground: 2048, crop: 1024, grass: 1024 };
for (const kind of ['ground', 'crop', 'grass'] as const) {
  if (params.get(kind) === 'live' || !renderer.setFields(kind, bakes[kind])) bakes[kind] = 0;
}
const bakeName = (kind: keyof typeof bakes) => (bakes[kind] ? `baked ${bakes[kind]}` : 'live');
let hour = num('hour', 12);
const windParam = params.get('wind');
const wind: Wind = {
  speed: windParam === null ? WIND_SCALE.breeze : windParam in WIND_SCALE ? WIND_SCALE[windParam as WindStrength] : Number(windParam),
  direction: (num('windDir', 31) * Math.PI) / 180,
  gust: num('gust', 0.5),
};
renderer.setWind(wind, true);
// The weather: a preset, and any value given over it. Its haze is kept (thinned to nothing) so the controls can thicken it.
const weatherParam = params.get('weather');
let presetName: WeatherName | null = weatherParam !== null && weatherParam in WEATHER_PRESETS ? weatherParam as WeatherName : null;
const preset: Weather = WEATHER_PRESETS[presetName ?? 'clear'];
const presetHaze: Haze = preset.haze ?? { amount: 0, color: 0xcfd6d8, top: 4 };
/** The weather as the demo holds it: the sky's values (the clouds' drift is added as it's sent, see send). */
type Sky = Required<Omit<Weather, 'drift' | 'cloudSeed'>>;
const weather: Sky & { haze: Haze } = {
  cloud: num('cloud', preset.cloud), rain: num('rain', preset.rain ?? 0), snow: num('snow', preset.snow ?? 0), heat: num('heat', preset.heat ?? 0),
  haze: {
    amount: num('haze', presetHaze.amount), color: params.has('hazeColor') ? parseInt(params.get('hazeColor')!, 16) : presetHaze.color,
    top: num('hazeTop', presetHaze.top), base: params.has('hazeBase') ? num('hazeBase', 0) : presetHaze.base,
    kind: params.get('hazeKind') === 'dust' ? 'dust' : params.get('hazeKind') === 'fog' ? 'fog' : presetHaze.kind,
  },
};
if (['cloud', 'rain', 'snow', 'heat', 'haze', 'hazeColor', 'hazeTop', 'hazeBase', 'hazeKind'].some((k) => params.has(k))) presetName = null;
// Looks to choose between (#9), each a button and a URL option: the heat wave's light, and its shimmer (pixels at full heat).
const SHIMMER = { off: 0, faint: 0.6, more: 1.2 } as const;
type Shimmer = keyof typeof SHIMMER;
const heatLook: HeatLook = (params.get('heatLook') ?? '') in HEAT_RECIPES ? params.get('heatLook') as HeatLook : 'glare';
let shimmer: Shimmer = (params.get('shimmer') ?? '') in SHIMMER ? params.get('shimmer') as Shimmer : 'faint';
renderer.settings.heatLook = heatLook; renderer.settings.shimmer = SHIMMER[shimmer];
// The clouds' field (#8).
const cloudSeed = num('cloudSeed', 1);

// The clouds' drift, standing in for the game's: carried along by the demo's wind (standing in for the wind aloft) at the
// drawn speed (cloudDriftSpeed), and sent with its speed whenever the weather is, as the game would.
const drift = { x: 0, z: 0, vx: 0, vz: 0, at: 0 };
function cloudVelocity() {
  const v = cloudDriftSpeed(wind.speed);
  return { vx: Math.cos(wind.direction) * v, vz: Math.sin(wind.direction) * v };
}
/**
 * The drift at a time: carried on from the last at the speed it had, then at the wind's speed now. A time before the last
 * (a tool seeking back) puts it where the wind now would have carried it from none at time 0, so a still frame depends
 * only on its time.
 */
function driftAt(time: number): CloudDrift {
  const v = cloudVelocity();
  if (time >= drift.at) { drift.x += drift.vx * (time - drift.at); drift.z += drift.vz * (time - drift.at); }
  else { drift.x = v.vx * time; drift.z = v.vz * time; }
  Object.assign(drift, v, { at: time });
  return { x: drift.x, z: drift.z, vx: drift.vx, vz: drift.vz };
}
/** The weather last sent, which each tick sends again with the clouds' drift. */
let sent: Weather = weather;
/** Sends the weather as the game does, the clouds' drift and seed with it. */
function send(w: Weather, immediate = false, time = lastTime) {
  sent = { ...w };
  renderer.setWeather({ ...w, drift: driftAt(time), cloudSeed }, immediate);
}
let lastTime = 0;
send(weather, true, 0);
renderer.settings.falling = num('falling', 1) !== 0;
// The scripted timeline, at a game speed: it sends the weather as the game would, a few times a second.
let playing = params.has('timeline'), speed = Number(params.get('timeline')) || 1;
let spell: SpellName = (params.get('spell') ?? '') in SPELLS ? params.get('spell') as SpellName : 'shower';
if (playing) presetName = null;
let timelineStart: number | null = null, timelineSent = '';
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
  // The zoom counts the screen's pixels; the pointer moves in CSS pixels.
  view.pan((e.clientX - drag.x) * renderer.screenRatio, (e.clientY - drag.y) * renderer.screenRatio);
  drag = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (profiling) return;
  view.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
  for (const r of refreshers) r();
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
  refreshers.length = 0;
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
  const shelter = document.createElement('button');
  shelter.textContent = 'Shelter'; shelter.className = renderer.settings.shelterDebug ? 'on' : '';
  shelter.title = 'What\'s under cover: blue under a roof, teal under a crown, yellow the roofs\' tops; the map from above in the corner';
  shelter.onclick = () => { renderer.settings.shelterDebug = !renderer.settings.shelterDebug; hud(); };
  hudEl.append(shelter);
  // The clouds' speed follows the wind's: sent at once, as the game would.
  const windSet = (f: (v: number) => void) => (v: number) => { f(v); renderer.setWind(wind); send(sent); };
  hudEl.append(slider('Wind', 0, 45, 0.5, () => wind.speed, windSet((v) => { wind.speed = v; }), (v) => `${windName(v)} ${v.toFixed(1)} m/s`));
  hudEl.append(slider('towards', 0, 360, 5, () => (wind.direction * 180) / Math.PI, windSet((v) => { wind.direction = (v * Math.PI) / 180; }), (v) => `${v.toFixed(0)}°`));
  // The zoom by its doubling, so each step of the slider zooms as much as the last.
  hudEl.append(slider('Zoom', Math.log2(MIN_ZOOM), Math.log2(MAX_ZOOM), 0.01, () => Math.log2(view.zoom), (v) => { view.zoom = 2 ** v; },
    (v) => `${(2 ** v).toFixed(0)} px/m`, true));
  const info = document.createElement('span');
  info.textContent = 'drag to pan · wheel to zoom · Q/E to turn';
  hudEl.append(info);

  // The weather: a preset, its values, and the timeline standing in for the game. Moving a value stops the timeline.
  hudEl.append(Object.assign(document.createElement('div'), { className: 'break' }));
  const pick = document.createElement('select');
  for (const name of ['custom', ...Object.keys(WEATHER_PRESETS)]) pick.append(new Option(name.replace('-', ' '), name, false, name === (presetName ?? 'custom')));
  pick.onchange = () => {
    if (!(pick.value in WEATHER_PRESETS)) return;
    const p: Weather = WEATHER_PRESETS[pick.value as WeatherName];
    Object.assign(weather, { cloud: p.cloud, rain: p.rain ?? 0, snow: p.snow ?? 0, heat: p.heat ?? 0 });
    weather.haze = p.haze ? { ...p.haze } : { ...weather.haze, amount: 0 };
    presetName = pick.value as WeatherName; playing = false; timelineEl.textContent = '';
    send(weather);
    hud();
  };
  pick.onkeydown = (e) => e.stopPropagation();
  hudEl.append(Object.assign(document.createElement('label'), { textContent: 'Weather' }), pick);
  const weatherSet = (f: (v: number) => void) => (v: number) => {
    f(v); presetName = null; pick.value = 'custom'; playing = false; play.className = ''; timelineEl.textContent = '';
    send(weather);
  };
  const share = (v: number) => v.toFixed(2);
  hudEl.append(slider('Cloud', 0, 1, 0.01, () => weather.cloud, weatherSet((v) => { weather.cloud = v; }), share, true));
  hudEl.append(slider('Rain', 0, 1, 0.01, () => weather.rain, weatherSet((v) => { weather.rain = v; }), share, true));
  hudEl.append(slider('Snow', 0, 1, 0.01, () => weather.snow, weatherSet((v) => { weather.snow = v; }), share, true));
  hudEl.append(slider('Heat', 0, 1, 0.01, () => weather.heat, weatherSet((v) => { weather.heat = v; }), share, true));
  hudEl.append(slider('Haze', 0, 1, 0.01, () => weather.haze.amount, weatherSet((v) => { weather.haze.amount = v; }), share, true));
  hudEl.append(slider('from', -2, 20, 0.25, () => Math.max(-2, weather.haze.base ?? -2), weatherSet((v) => { weather.haze.base = v <= -2 ? undefined : v; }),
    (v) => (v <= -2 ? 'ground' : `${v.toFixed(1)} m`), true));
  hudEl.append(slider('up to', -1, 30, 0.25, () => weather.haze.top, weatherSet((v) => { weather.haze.top = v; }), (v) => `${v.toFixed(1)} m`, true));
  const colour = Object.assign(document.createElement('input'), { type: 'color', value: `#${weather.haze.color.toString(16).padStart(6, '0')}` });
  colour.oninput = () => weatherSet((v) => { weather.haze.color = v; })(parseInt(colour.value.slice(1), 16));
  const kind = Object.assign(document.createElement('button'), { textContent: weather.haze.kind ?? 'fog' });
  kind.title = 'What the haze is: fog lingers and the wind thins it; dust is carried by the wind and turns the light orange';
  kind.onclick = () => {
    const next: HazeKind = (weather.haze.kind ?? 'fog') === 'fog' ? 'dust' : 'fog';
    weatherSet(() => { weather.haze.kind = next; })(0); kind.textContent = next;
  };
  refreshers.push(() => { kind.textContent = weather.haze.kind ?? 'fog'; colour.value = `#${weather.haze.color.toString(16).padStart(6, '0')}`; });
  hudEl.append(colour, kind);
  const play = Object.assign(document.createElement('button'), { textContent: 'Timeline', className: playing ? 'on' : '' });
  play.title = 'The scripted weather, sent as the game sends it';
  const spells = document.createElement('select');
  const spellName = (s: string) => (s === 'fog' ? 'morning fog' : s === 'dust' ? 'dust storm' : s);
  for (const name of Object.keys(SPELLS)) spells.append(new Option(spellName(name), name, false, name === spell));
  spells.title = 'shower: clear, cloud building, a shower, clearing again · morning fog: a fog lifting, then mist gathering in the evening · ' +
    'dust storm: the wind getting up and blowing a dust storm through';
  spells.onchange = () => { spell = spells.value as SpellName; timelineStart = null; timelineSent = ''; };
  spells.onkeydown = (e) => e.stopPropagation();
  play.onclick = () => {
    playing = !playing; timelineStart = null; timelineSent = '';
    if (playing) { presetName = null; pick.value = 'custom'; } else timelineEl.textContent = '';
    play.className = playing ? 'on' : '';
  };
  const pace = Object.assign(document.createElement('button'), { textContent: `${speed}× speed` });
  pace.title = 'The game\'s speed: a day is 4 minutes at 1×';
  pace.onclick = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed as (typeof SPEEDS)[number]) + 1) % SPEEDS.length];
    // Keep the spell where it is: the game time it has run, at the new speed.
    if (playing && timelineStart !== null) timelineStart = lastTime - ((lastTime - timelineStart) * speed) / next;
    speed = next; pace.textContent = `${speed}× speed`;
  };
  hudEl.append(play, spells, pace, timelineEl);

  // The looks to choose between (#9): a button each, cycling through the candidates.
  hudEl.append(Object.assign(document.createElement('div'), { className: 'break' }));
  const cycle = <K extends string>(label: string, all: readonly K[], get: () => K, set: (k: K) => void, title: string) => {
    const b = Object.assign(document.createElement('button'), { textContent: `${label}: ${get()}`, title });
    b.onclick = () => { set(all[(all.indexOf(get()) + 1) % all.length]); b.textContent = `${label}: ${get()}`; };
    hudEl.append(b);
  };
  cycle('Heat wave', Object.keys(HEAT_RECIPES) as HeatLook[], () => renderer.settings.heatLook, (k) => { renderer.settings.heatLook = k; },
    'glare: bleached nearly white · gold: a hot yellow light, fuller colour · dry: a pale, dusty air flattening the distance');
  cycle('Shimmer', Object.keys(SHIMMER) as Shimmer[], () => shimmer, (k) => { shimmer = k; renderer.settings.shimmer = SHIMMER[k]; },
    'the hot air making the land waver: none, faint, or more');
}
const timelineEl = document.createElement('span');
/** The weather controls' values, put back to what they show (the timeline moves them). */
const refreshers: (() => void)[] = [];
function slider(name: string, min: number, max: number, step: number, get: () => number, set: (v: number) => void, show: (v: number) => string, short = false) {
  const label = document.createElement('label');
  const input = Object.assign(document.createElement('input'), { type: 'range', min: String(min), max: String(max), step: String(step), value: String(get()) });
  const out = Object.assign(document.createElement('output'), { className: short ? 'short' : '' });
  out.textContent = show(get());
  input.oninput = () => { const v = Number(input.value); set(v); out.textContent = show(v); };
  input.onkeydown = (e) => e.stopPropagation();
  refreshers.push(() => { input.value = String(get()); out.textContent = show(get()); });
  label.append(name, input, out);
  return label;
}
hud();

/** A weather with everything it leaves out set to none, as the game sends it. */
function whole(w: Weather): Sky {
  return { cloud: w.cloud, rain: w.rain ?? 0, snow: w.snow ?? 0, heat: w.heat ?? 0, haze: w.haze ?? null };
}

/** Plays the timeline at a time (seconds): sends the game's weather when it changes, eased, as the game would. */
function playTimeline(time: number) {
  if (!playing) return;
  timelineStart ??= time;
  const w = timelineAt(time - timelineStart, speed, spell), key = JSON.stringify(w);
  timelineEl.textContent = timelinePhase(time - timelineStart, speed, spell);
  // The wind, when the spell brings its own (the game's setWind).
  const gust = timelineWind(time - timelineStart, speed, spell);
  if (gust !== null && gust !== wind.speed) { wind.speed = gust; renderer.setWind(wind); for (const r of refreshers) r(); }
  if (key === timelineSent) return;
  timelineSent = key;
  // The game sends the whole weather: what the spell leaves out is none (a haze thinned away keeps its colour and height).
  const { haze, ...rest } = whole(w);
  Object.assign(weather, rest, { haze: haze ? { ...haze } : { ...weather.haze, amount: 0 } });
  send(weather, false, time);
  for (const r of refreshers) r();
}

// Shot mode (tools/): no loop; the tools ask for frames. __shot draws one and returns it as a PNG; __draw puts the camera
// somewhere (a fractional view turns part way), leaves some kinds out, and draws, leaving the frame on the canvas.
if (params.has('shot')) {
  // options.wind sets the wind, options.weather the weather (a preset's name, whole, or values over the demo's), and
  // options.timeline the scripted weather (whole) at a time (seconds, at a game speed and in a spell, the demo's by
  // default); all at once, unless ease is
  // set: then they ease as the clock runs. options.hour sets the hour.
  const draw = (cam?: { x: number; z: number; zoom: number; view: number },
    options: {
      hide?: MaterialKind[]; grain?: boolean; time?: number; hour?: number; wind?: Partial<Wind>;
      weather?: Partial<Weather> | WeatherName; timeline?: { time: number; speed?: number; spell?: SpellName }; ease?: boolean;
    } = {}) => {
    if (cam) { view.target.set(cam.x, 0, cam.z); view.zoom = cam.zoom; view.view = cam.view; view.update(0, true); }
    if (options.hour !== undefined) hour = options.hour;
    if (options.wind) { Object.assign(wind, options.wind); renderer.setWind(wind, !options.ease); }
    // The clouds carried on to the frame's time (see driftAt).
    const time = options.time ?? frozen ?? 0;
    if (options.weather) {
      const w = typeof options.weather === 'string' ? whole(WEATHER_PRESETS[options.weather]) : { ...weather, ...options.weather };
      send(w, !options.ease, time);
    }
    if (options.timeline) {
      const t = options.timeline;
      // The spell's wind first, so the clouds' drift is sent at its speed, as the timeline does.
      const s = timelineWind(t.time, t.speed ?? speed, t.spell ?? spell);
      if (s !== null) { wind.speed = s; renderer.setWind(wind, !options.ease); }
      send(whole(timelineAt(t.time, t.speed ?? speed, t.spell ?? spell)), !options.ease, time);
    }
    if (!options.weather && !options.timeline) send(sent, false, time);
    const kinds: MaterialKind[] = ['ground', 'paint', 'crop', 'ink', 'water', 'foliage', 'grass', 'debris'];
    for (const k of kinds) renderer.setVisible(k, !options.hide?.includes(k));
    const grain = renderer.settings.grain;
    if (options.grain === false) renderer.settings.grain = 0;
    renderer.setLook(lookAt(hour));
    for (let i = 0; i < 2; i++) renderer.render(time);
    renderer.settings.grain = grain;
  };
  loaded.then(() => Object.assign(window, {
    __renderer: renderer,
    __draw: draw,
    __profile: (cases?: ProfileCase[]) => profile(cases),
    __profileTable: table,
    __shot: () => { draw(); return canvas.toDataURL('image/png'); },
  }));
} else requestAnimationFrame(frame);

// Profiling (tools/profile.ts, or ?profile on any machine): the demo's own loop waits while the cases run.
async function profile(cases = defaultCases(), progress?: (row: ProfileRow, i: number) => void) {
  await loaded;
  profiling = true;
  try {
    return await runProfile(renderer, (t) => { renderer.setLook(lookAt(hour)); renderer.render(t); },
      () => { renderer.setWind(wind, true); send(weather, true, 0); }, cases, progress);
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
    + `hour ${hour} · x ${view.target.x.toFixed(2)} · z ${view.target.z.toFixed(2)} · zoom ${view.zoom.toFixed(1)} · view ${view.view} · samples ${num('samples', 4)} · shadow map ${num('shadowMap', farm ? 4096 : 2048)} · lines ${renderer.settings.lines ? 'on' : 'off'} · shadows ${renderer.settings.shadows ? 'on' : 'off'} · prepass ${renderer.settings.prepass ? 'on' : 'off'} · water scissor ${renderer.settings.waterScissor ? 'on' : 'off'} · equal depth ${renderer.settings.equalDepth ? 'on' : 'off'} · ground ${bakeName('ground')} · crop ${bakeName('crop')} · grass ${bakeName('grass')} · weather ${presetName ?? JSON.stringify(weather)}\n`
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
let last = start, frames = 0, lastTick = -1;
function frame(now: number) {
  if (profiling) { requestAnimationFrame(frame); return; }
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  view.update(dt);
  const time = frozen ?? (now - start) / 1000;
  lastTime = time;
  playTimeline(time);
  // The game sends the clouds' drift a few times a second (with the weather); the renderer carries them on between.
  if (Math.floor(time * TICK) !== lastTick) { lastTick = Math.floor(time * TICK); send(sent, false, time); }
  renderer.setLook(lookAt(hour));
  renderer.render(time);
  // Ready once a frame is drawn with everything loaded (the farm's shed comes after the first frames).
  if (++frames >= 3 && isLoaded) (window as unknown as { __ready: boolean }).__ready = true;
  requestAnimationFrame(frame);
}
