import { hoursOf, type HourName } from '../renderer/look';
import { CHARACTERS, clockHour, SEASONS, type Character, type Season } from '../renderer/season';
import { BrushRenderer, type DrawnKind } from '../renderer/renderer';
import { lightningHud, setupLightning, stormLightning } from './lightning';
import { buildMeadow } from '../scenes/meadow';
import { buildFarm } from '../scenes/farm';
import { MAX_ZOOM, MIN_ZOOM } from '../renderer/camera';
import { cloudDriftSpeed } from '../renderer/clouds';
import { WEATHER_PRESETS, type CloudDrift, type Haze, type HazeKind, type Weather, type WeatherName } from '../renderer/weather';
import { steadyWind, WIND_SCALE, windName, type WindStrength } from '../renderer/wind';
import { defaultCases, runProfile, table, type ProfileCase, type ProfileRow } from './profile';
import { SPEEDS, SPELLS, TICK, timelineAt, timelineClock, timelineFrost, timelineLightning, timelineLying, timelinePhase, timelineWater, timelineWet, timelineWind, type SpellName } from './timeline';
import { DemoWater, USUAL_WATER, type WaterState } from './water';
import { DemoGround, type GroundState } from './ground';
import { WindWorker } from '../wind/client';
import { TICK as WIND_TICK, type WindGoal, type WindSave } from '../wind/sim';
import { WindView } from './windView';

// The demo viewer. URL parameters, for screenshots and comparisons:
//   view=0..3  zoom=16..192 (screen px per metre)  x, z (camera target)  t (seconds: freeze the clock there)
//   focus=mill (farm only: start at the wheat mill; explicit camera parameters still take precedence)
//   hour=0..24 (the game's clock), or dawn|noon|golden|sunset|night (that look in the season's day)
//   season=spring|summer|autumn|winter (#13; none by default: the looks' own day, sun up 6 to 20)  character (the
//     game's: mild|wet|dry|hot|gales|stormy|hard|highRiver)  sunrise, sunset (the game's clock hours; the season's by default)
//   The scene is built in the season (summer's with none): its crops, flowers and hay stand in for the game's.
//   scene=farm|meadow  lines=0  shadows=0  still (hide the buttons)  dpr (pixel ratio)
//   wind (m/s, or calm|breeze|gale|storm|hurricane)  windDir (degrees the wind blows towards, from +x towards +z)  gust (0..1)
//   rhythm (how the gusts come: 0 rare and strong, 1 frequent and mild)  windMap (the living wind from above, #36)
//   windSeed (which gusts: a whole number)
//   weather (clear|scattered|overcast|soft-rain|storm|fog|dust|heat-wave|snow|blizzard), then each value over it:
//     cloud, storm, rain, snow, heat (0..1)  haze (0..1)  hazeColor (sRGB hex, e.g. cfd6d8)  hazeTop, hazeBase (metres)
//     hazeKind=fog|dust
//   sunUnder (0..1: how much of a low sun gets in under the cloud at dawn and dusk, and at any hour of the day under a
//     storm; the game's, now and then; 0 by default)
//   timeline (play the scripted weather, standing in for the game; timeline=3 at 3x the game's speed)
//   spell=shower|fog|dust|flood|thunderstorm|gale|hurricane|snowfall|blizzard (which scripted weather: a shower, a morning
//     fog lifting, a dust storm blowing through, a storm flooding the stream over the land, a thunderstorm, a gale or a
//     hurricane, #12; a snowfall settling, or a blizzard rolling in on a gale, #14: best in winter)
//   water=usual|spate|flood (the water, #18), then each value over it: rise (m over the usual), flow (times the usual
//     speed), mud (0..1)
//   lying (how deep the snow lies over the land, 0..1, the game's: 0.2 a dusting, 0.5 the grass covered, 1 deep; #14;
//     0.4 by default where it snows)
//   frost (how much frost, 0..1, the game's: 1 a hard frost everywhere in the open; where it lies and how the morning's
//     sun has taken it is the renderer's; #14)
//   wet (how wet the land is, 0 dry .. 1 soaked, #11; soaked where it rains, by default)
//   cloudSeed (which cloud field: a whole number)
//   falling=0 (leave out the things in the air: the wind's leaves, the rain, the snow and its whiteout; dust is in the haze)
//   fallingShare (the share of the rain's strokes and the snow's flakes drawn: 1 full quality, 0.33 reduced)
//   The blizzard preset comes with a gale (a blizzard is heavy snow in a strong wind, #14), unless wind is given.
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
  shadowRadius: 34, shadowFollow: farm, shadowMapSize: num('shadowMap', farm ? 4096 : 2048),
  pixelRatio: params.has('dpr') ? num('dpr', 1) : params.has('profile') ? 1 : undefined,
  samples: params.has('samples') ? num('samples', 4) : undefined,
  shelterSize: num('shelterSize', 1024),
});
// On a high-DPI screen the frame is drawn at 1080p's pixel count and scaled up: the budget's, and to the developer's eye
// on the MacBook no softer than 1440p's (#6, #28). Not with dpr or profile, which set the pixels themselves.
if (!params.has('dpr') && !params.has('profile')) renderer.maxPixels = 1920 * 1080;
// The season (#13): the game sets it once per level, and the scene's contents are the game's for it (the demo's stand in).
const seasonParam = params.get('season'), characterParam = params.get('character');
const season: Season | null = SEASONS.includes(seasonParam as Season) ? seasonParam as Season : null;
const character: Character | null = CHARACTERS.includes(characterParam as Character) ? characterParam as Character : null;
if (season) {
  renderer.setSeason({
    season, character,
    sunrise: params.has('sunrise') ? num('sunrise', 6) : undefined, sunset: params.has('sunset') ? num('sunset', 20) : undefined,
  });
}
const farmScene = farm ? buildFarm(renderer, season ?? 'summer') : null;
const scene = farmScene ?? buildMeadow(renderer, season ?? 'summer');
/** Settles once the scene's models are in. */
const loaded = farmScene?.ready ?? Promise.resolve();
let isLoaded = false;
loaded.then(() => { isLoaded = true; });
// The water (#18), standing in for the game's: a map made from the scene's stream and the water's state (a preset, the
// controls or the timeline), sent whenever it changes.
const WATER_PRESETS: Record<string, WaterState> = {
  usual: USUAL_WATER,
  // In spate after a storm: up to its banks, fast and brown.
  spate: { rise: 0.15, flow: 3.5, mud: 0.75 },
  // Over its banks and spreading over the floodplain.
  flood: { rise: 0.4, flow: 2.5, mud: 0.9 },
};
const demoWater = new DemoWater(scene.stream, scene.height);
const waterPreset = WATER_PRESETS[params.get('water') ?? 'usual'] ?? USUAL_WATER;
const water: WaterState = { rise: num('rise', waterPreset.rise), flow: num('flow', waterPreset.flow), mud: num('mud', waterPreset.mud) };
let waterSent = '';
/** Sends the water as the game does, when it has changed: eased in, or at once. */
function sendWater(w: WaterState, immediate = false) {
  const key = JSON.stringify(w);
  if (key === waterSent) return;
  waterSent = key;
  renderer.setWater(demoWater.map(w), immediate ? 0 : undefined);
}
sendWater(water, true);
// The ground (#14, #11), standing in for the game's: how deep the snow lies, how much frost, and how wet the land is,
// sent as a map whenever it changes. (Its wet is set below, with the weather: soaked where it rains.)
const demoGround = new DemoGround(scene.stream, scene.height, scene.bare);
/** How deep the demo lays the snow when a snowy weather is picked (#14): the grass covered, the crops' tops showing. */
const LYING_SNOWY = 0.4;
const ground: GroundState = { snow: 0, frost: 0, wet: 0 };
let groundSent = '';
function sendGround(g: GroundState, immediate = false) {
  // The wet in steps of 1/400: the timeline dries it a little every frame, the game a few times a second.
  const key = JSON.stringify({ ...g, wet: Math.round(g.wet * 400) / 400 });
  if (key === groundSent) return;
  groundSent = key;
  renderer.setGround(demoGround.map(g), immediate ? 0 : undefined);
}
const view = renderer.view;
const millView = { x: -80.5, z: -14.5, zoom: 38, view: 0.3 };
// Zoom uses device pixels per metre. Fit the whole silhouette on small windows
// and retain the same composition on Retina displays, independent of render resolution.
const millZoom = () => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM,
  millView.zoom * renderer.screenRatio * Math.min(canvas.clientHeight / 720, canvas.clientWidth / 800)));
const focusMill = farm && params.get('focus') === 'mill';
view.view = num('view', focusMill ? millView.view : 0); view.zoom = num('zoom', focusMill ? millZoom() : 40);
view.target.set(num('x', focusMill ? millView.x : farm ? 0 : -1), 0, num('z', focusMill ? millView.z : 0));
view.update(0, true);
renderer.settings.lines = num('lines', 1) !== 0;
renderer.settings.shadows = num('shadows', 1) !== 0;
renderer.settings.prepass = num('prepass', 1) !== 0;
renderer.settings.waterScissor = num('scissor', 1) !== 0;
renderer.settings.equalDepth = num('equal', 1) !== 0;
renderer.settings.shelterDebug = params.has('shelter') && params.get('shelter') !== '0';
setupLightning(renderer);
// The ground's brush, baked at load into a 2048² texture: the developer's pick (#6, #23), the same to the eye as live
// and as 4096², at a quarter of 4096's memory. The grass's and crops' brush by place, 1024² at seven angles a scale.
const bakes = { ground: 2048, crop: 1024, grass: 1024 };
for (const kind of ['ground', 'crop', 'grass'] as const) {
  if (params.get(kind) === 'live' || !renderer.setFields(kind, bakes[kind])) bakes[kind] = 0;
}
const bakeName = (kind: keyof typeof bakes) => (bakes[kind] ? `baked ${bakes[kind]}` : 'live');
const HOUR_NAMES: Record<string, HourName> = { dawn: 'Dawn', noon: 'Noon', golden: 'Golden hour', sunset: 'Sunset', night: 'Night' };
const hourParam = params.get('hour') ?? 'noon';
let hour = hourParam in HOUR_NAMES ? hoursOf(renderer.day)[HOUR_NAMES[hourParam]] : Number(hourParam);
/** The named hour the clock is on, if it's on one. */
const namedHour = () => (Object.entries(hoursOf(renderer.day)) as [HourName, number][]).find(([, h]) => Math.abs(h - hour) < 0.01)?.[0];
/**
 * The URL as things stand: the camera, the hour (by its name if it's on one), and the weather, wind, water and timeline
 * as the controls have them, so a season's scene is built again under the same sky.
 */
function here() {
  const next = new URLSearchParams(params), was = namedHour();
  for (const k of ['weather', 'cloud', 'storm', 'rain', 'snow', 'heat', 'haze', 'hazeColor', 'hazeTop', 'hazeBase', 'hazeKind', 'timeline']) next.delete(k);
  if (playing) next.set('timeline', String(speed));
  else if (presetName) next.set('weather', presetName);
  else {
    for (const k of ['cloud', 'storm', 'rain', 'snow', 'heat'] as const) next.set(k, String(weather[k]));
    const h = weather.haze;
    next.set('haze', String(h.amount)); next.set('hazeColor', h.color.toString(16).padStart(6, '0')); next.set('hazeTop', String(h.top));
    if (h.base !== undefined) next.set('hazeBase', String(h.base));
    if (h.kind) next.set('hazeKind', h.kind);
  }
  next.set('sunUnder', String(sunUnder));
  next.set('wind', wind.speed.toFixed(2)); next.set('windDir', ((wind.direction * 180) / Math.PI).toFixed(1));
  next.set('gust', String(wind.gust ?? 0.5)); next.set('rhythm', String(rhythm));
  next.set('rise', String(water.rise)); next.set('flow', String(water.flow)); next.set('mud', String(water.mud));
  next.set('lying', String(ground.snow)); next.set('frost', String(ground.frost)); next.set('wet', String(ground.wet));
  next.set('view', String(view.view)); next.set('zoom', view.zoom.toFixed(1));
  next.set('x', view.target.x.toFixed(2)); next.set('z', view.target.z.toFixed(2));
  next.set('hour', was ? Object.keys(HOUR_NAMES).find((k) => HOUR_NAMES[k] === was)! : hour.toFixed(2));
  return next;
}
const windParam = params.get('wind');
/** The wind the demo asks for (the game's goal, with the rhythm below): m/s, radians it blows towards, gustiness 0..1. */
const wind = {
  speed: windParam === null ? (params.get('weather') === 'blizzard' ? WIND_SCALE.gale : WIND_SCALE.breeze) : windParam in WIND_SCALE ? WIND_SCALE[windParam as WindStrength] : Number(windParam),
  direction: (num('windDir', 31) * Math.PI) / 180,
  gust: num('gust', 0.5),
};
// The living wind (#36), standing in for the game's: simulated over 200 m around the middle, a cell a metre, in a worker,
// on the game's clock (none while the clock is frozen). The demo's wind and gust controls set its goal, as the game would,
// and the renderer draws it. It's run on WARM seconds before it's shown, so the gusts have filled the world and the calm
// behind each hedge has formed; until then the renderer is given the goal, steady.
let rhythm = num('rhythm', 0.5);
const windGoal = (): WindGoal => ({ speed: wind.speed, direction: wind.direction, gustiness: wind.gust, rhythm });
const WARM = 10;
const windSeed = num('windSeed', 1);
function newWind() {
  const w = new WindWorker(new Worker(new URL('../wind/worker.ts', import.meta.url), { type: 'module' }),
    { nx: 200, nz: 200, cell: 1, x0: -100, z0: -100 }, scene.wind, windGoal(), { seed: windSeed });
  // Shot mode stops a tick short and steps it on to each frame's time from there (see windTo); the demo's still frame
  // (?t=) is run on to its time.
  w.advance(params.has('shot') ? WARM - WIND_TICK : WARM + (frozen ?? 0));
  return w;
}
const frozen = params.has('t') ? num('t', 0) : null;
let living = newWind();
const warm = () => !!living.cur && living.cur.tick >= Math.round(WARM / WIND_TICK);
/** Gives the renderer the wind for this frame. */
function drawWind() {
  if (warm()) renderer.setWind(living.prev!, living.cur!, living.alpha);
  else { const s = steadyWind(wind.speed, wind.direction); renderer.setWind(s, s, 0); }
}
const windView = new WindView(() => living);
let windMap = params.has('windMap') && params.get('windMap') !== '0';
if (windMap) document.body.append(windView.el);
// The weather: a preset, and any value given over it. Its haze is kept (thinned to nothing) so the controls can thicken it.
const weatherParam = params.get('weather');
let presetName: WeatherName | null = weatherParam !== null && weatherParam in WEATHER_PRESETS ? weatherParam as WeatherName : null;
const preset: Weather = WEATHER_PRESETS[presetName ?? 'clear'];
const presetHaze: Haze = preset.haze ?? { amount: 0, color: 0xcfd6d8, top: 4 };
/** The weather as the demo holds it: the sky's values (the clouds' drift is added as it's sent, see send). */
type Sky = Required<Omit<Weather, 'drift' | 'cloudSeed' | 'sunUnder'>>;
const weather: Sky & { haze: Haze } = {
  cloud: num('cloud', preset.cloud), storm: num('storm', preset.storm ?? 0), rain: num('rain', preset.rain ?? 0), snow: num('snow', preset.snow ?? 0), heat: num('heat', preset.heat ?? 0),
  haze: {
    amount: num('haze', presetHaze.amount), color: params.has('hazeColor') ? parseInt(params.get('hazeColor')!, 16) : presetHaze.color,
    top: num('hazeTop', presetHaze.top), base: params.has('hazeBase') ? num('hazeBase', 0) : presetHaze.base,
    kind: params.get('hazeKind') === 'dust' ? 'dust' : params.get('hazeKind') === 'fog' ? 'fog' : presetHaze.kind,
  },
};
if (['cloud', 'storm', 'rain', 'snow', 'heat', 'haze', 'hazeColor', 'hazeTop', 'hazeBase', 'hazeKind'].some((k) => params.has(k))) presetName = null;
// The land soaked where it's raining, unless asked (#11); snow lying where it snows (#14).
ground.wet = num('wet', weather.rain > 0 ? 1 : 0);
ground.snow = num('lying', weather.snow > 0 ? LYING_SNOWY : 0);
ground.frost = num('frost', 0);
sendGround(ground, true);
// The clouds' field (#8).
const cloudSeed = num('cloudSeed', 1);
// How much of a low sun gets in under the cloud at dawn and dusk (#8): the game's, sent with the weather, and only now and
// then (a rare sight, not every overcast evening); none unless asked for.
let sunUnder = num('sunUnder', 0);
/** A storm spell's own low sun (#12), over the demo's while the timeline plays one; null otherwise. */
let spellSun: number | null = null;
/** Leaving a storm spell: its lightning stops and the demo's own low sun comes back, on the controls too. */
function endSpellStorm() {
  stormLightning(null);
  spellSun = null;
  for (const r of refreshers) r();
}

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
/**
 * Where dust can lift (#36): the game's map, which the demo makes from the scene's bare ground (the tracks, the porch),
 * none where it's wet. Sent again when the rain or snow changes.
 */
const DUST_GRID = { nx: 200, nz: 200, cell: 1, x0: -100, z0: -100 };
const bare = new Float32Array(DUST_GRID.nx * DUST_GRID.nz), groundY = new Float32Array(bare.length);
for (let j = 0; j < DUST_GRID.nz; j++) for (let i = 0; i < DUST_GRID.nx; i++) {
  const x = DUST_GRID.x0 + i + 0.5, z = DUST_GRID.z0 + j + 0.5;
  bare[j * DUST_GRID.nx + i] = scene.bare(x, z); groundY[j * DUST_GRID.nx + i] = scene.height(x, z);
}
let dustWet = -1;
function dustSource(wet: number) {
  if (Math.abs(wet - dustWet) < 0.02) return;
  dustWet = wet;
  const dry = Math.max(0, 1 - 2 * wet);
  renderer.setDustSource({ ...DUST_GRID, lift: bare.map((b) => b * dry), ground: groundY });
}
/** The weather last sent, which each tick sends again with the clouds' drift. */
let sent: Weather = weather;
/** Sends the weather as the game does, the clouds' drift and seed with it. */
function send(w: Weather, immediate = false, time = lastTime) {
  sent = { ...w };
  dustSource(Math.max(w.rain ?? 0, w.snow ?? 0, ground.wet));
  renderer.setWeather({ sunUnder: spellSun ?? sunUnder, ...w, drift: driftAt(time), cloudSeed }, immediate);
}
let lastTime = 0;
send(weather, true, 0);
renderer.settings.falling = num('falling', 1) !== 0;
renderer.settings.fallingShare = num('fallingShare', 1);
// The scripted timeline, at a game speed: it sends the weather as the game would, a few times a second.
let playing = params.has('timeline'), speed = Number(params.get('timeline')) || 1;
let spell: SpellName = (params.get('spell') ?? '') in SPELLS ? params.get('spell') as SpellName : 'shower';
if (playing) presetName = null;
let timelineStart: number | null = null, timelineSent = '';
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
  else if (k >= '1' && k <= '5') hour = Object.values(hoursOf(renderer.day))[Number(k) - 1];
  hud();
});

const hudEl = document.getElementById('hud')!;
function hud() {
  hudEl.innerHTML = '';
  refreshers.length = 0;
  // The hour's buttons follow the season's day: noon is the middle of the game's day, and so on.
  for (const [name, h] of Object.entries(hoursOf(renderer.day))) {
    const b = document.createElement('button');
    b.textContent = name;
    b.title = clock(h);
    b.className = Math.abs(h - hour) < 0.01 ? 'on' : '';
    b.onclick = () => { hour = h; hud(); };
    hudEl.append(b);
  }
  // The season (#13), as a new level would set it: the scene is built again in it (its crops and flowers are the season's),
  // keeping the camera, and the hour on its named look (noon stays noon) or its clock.
  const seasons = document.createElement('select');
  for (const name of ['none', ...SEASONS]) seasons.append(new Option(name, name, false, name === (season ?? 'none')));
  seasons.title = 'The level\'s season (none: the looks\' own day, the sun up 6 to 20); the scene is built again in it';
  seasons.onchange = () => {
    const next = here();
    if (seasons.value === 'none') next.delete('season'); else next.set('season', seasons.value);
    location.search = `?${next}`;
  };
  seasons.onkeydown = (e) => e.stopPropagation();
  hudEl.append(Object.assign(document.createElement('label'), { textContent: 'Season' }), seasons);
  const at = Object.assign(document.createElement('span'), { textContent: `${clock(hour)} · sun ${clock(renderer.day.sunrise)}–${clock(renderer.day.sunset)}` });
  hudEl.append(at);
  const lines = document.createElement('button');
  lines.textContent = 'Lines'; lines.className = renderer.settings.lines ? 'on' : '';
  lines.onclick = () => { renderer.settings.lines = !renderer.settings.lines; hud(); };
  hudEl.append(lines);
  const shelter = document.createElement('button');
  shelter.textContent = 'Shelter'; shelter.className = renderer.settings.shelterDebug ? 'on' : '';
  shelter.title = 'What\'s under cover: blue under a roof, teal under a crown, yellow the roofs\' tops; the map from above in the corner';
  shelter.onclick = () => { renderer.settings.shelterDebug = !renderer.settings.shelterDebug; hud(); };
  hudEl.append(shelter);
  const map = document.createElement('button');
  map.textContent = 'Wind map'; map.className = windMap ? 'on' : '';
  map.title = 'The living wind from above, turned as the camera is: how hard it blows (or the shelter), which way, and the obstacles';
  map.onclick = () => { windMap = !windMap; if (windMap) document.body.append(windView.el); else windView.el.remove(); hud(); };
  hudEl.append(map);
  if (farm) {
    const mill = document.createElement('button');
    mill.textContent = 'Wheat mill';
    mill.title = 'Visit the wheat mill on the northern knoll';
    mill.onclick = () => {
      view.target.set(millView.x, 0, millView.z); view.zoom = millZoom(); view.view = millView.view;
      view.update(0, true);
      for (const refresh of refreshers) refresh();
    };
    hudEl.append(mill);
  }
  // The clouds' speed follows the wind's: sent at once, as the game would.
  const windSet = (f: (v: number) => void) => (v: number) => { f(v); living.setGoal(windGoal()); send(sent); };
  hudEl.append(slider('Wind', 0, 45, 0.5, () => wind.speed, windSet((v) => { wind.speed = v; }), (v) => `${windName(v)} ${v.toFixed(1)} m/s`));
  hudEl.append(slider('towards', 0, 360, 5, () => (wind.direction * 180) / Math.PI, windSet((v) => { wind.direction = (v * Math.PI) / 180; }), (v) => `${v.toFixed(0)}°`));
  hudEl.append(slider('gusts', 0, 1, 0.05, () => wind.gust ?? 0.5, windSet((v) => { wind.gust = v; }), (v) => v.toFixed(2), true));
  hudEl.append(slider('rhythm', 0, 1, 0.05, () => rhythm, windSet((v) => { rhythm = v; }),
    (v) => `${v < 0.35 ? 'rare, strong' : v > 0.65 ? 'frequent, mild' : 'between'} ${v.toFixed(2)}`));
  // The zoom by its doubling, so each step of the slider zooms as much as the last.
  hudEl.append(slider('Zoom', Math.log2(MIN_ZOOM), Math.log2(MAX_ZOOM), 0.01, () => Math.log2(view.zoom), (v) => { view.zoom = 2 ** v; },
    (v) => `${(2 ** v).toFixed(0)} px/m`, true));
  const info = document.createElement('span');
  info.textContent = 'drag to pan · wheel to zoom · Q/E to turn';
  hudEl.append(info);
  lightningHud(hudEl, renderer, hud);

  // The weather: a preset, its values, and the timeline standing in for the game. Moving a value stops the timeline.
  hudEl.append(Object.assign(document.createElement('div'), { className: 'break' }));
  const pick = document.createElement('select');
  for (const name of ['custom', ...Object.keys(WEATHER_PRESETS)]) pick.append(new Option(name.replace('-', ' '), name, false, name === (presetName ?? 'custom')));
  pick.onchange = () => {
    if (!(pick.value in WEATHER_PRESETS)) return;
    const p: Weather = WEATHER_PRESETS[pick.value as WeatherName];
    Object.assign(weather, { cloud: p.cloud, storm: p.storm ?? 0, rain: p.rain ?? 0, snow: p.snow ?? 0, heat: p.heat ?? 0 });
    weather.haze = p.haze ? { ...p.haze } : { ...weather.haze, amount: 0 };
    presetName = pick.value as WeatherName; playing = false; timelineEl.textContent = ''; endSpellStorm();
    // A blizzard is heavy snow in a strong wind (#14): it comes with a gale.
    if (presetName === 'blizzard' && wind.speed < WIND_SCALE.gale) { wind.speed = WIND_SCALE.gale; living.setGoal(windGoal()); }
    // A rainy weather picked: the land as it would be after a while of it, soaked.
    if (weather.rain > 0) { ground.wet = 1; sendGround({ ...ground }); }
    // A snowy one: snow lying, as after a while of it.
    if (weather.snow > 0 && ground.snow < LYING_SNOWY) { ground.snow = LYING_SNOWY; sendGround({ ...ground }); }
    send(weather);
    hud();
  };
  pick.onkeydown = (e) => e.stopPropagation();
  hudEl.append(Object.assign(document.createElement('label'), { textContent: 'Weather' }), pick);
  const weatherSet = (f: (v: number) => void) => (v: number) => {
    f(v); presetName = null; pick.value = 'custom'; playing = false; play.className = ''; timelineEl.textContent = ''; endSpellStorm();
    send(weather);
  };
  const share = (v: number) => v.toFixed(2);
  hudEl.append(slider('Cloud', 0, 1, 0.01, () => weather.cloud, weatherSet((v) => { weather.cloud = v; }), share, true));
  hudEl.append(slider('low sun', 0, 1, 0.01, () => spellSun ?? sunUnder, (v) => { sunUnder = v; spellSun = null; send(sent); }, share, true));
  hudEl.append(slider('Storm', 0, 1, 0.01, () => weather.storm, weatherSet((v) => { weather.storm = v; }), share, true));
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
    'dust storm: the wind getting up and blowing a dust storm through · flood: a storm swelling the stream, which floods the land and drains · ' +
    'thunderstorm: a storm rolling in, lightning, and clearing · gale: squalls on a strong wind under a broken sky · hurricane: the strongest wind and driving rain · ' +
    'snowfall: snow coming in, settling and clearing · blizzard: a blizzard rolling in on a gale and blowing itself out (best in winter) · ' +
    'late-frost: a spring night\'s frost forming and the morning sun taking it (best in spring) · cold-snap: a winter day of hard frost, the sun clearing only what it shines on (best in winter); both run the clock';
  spells.onchange = () => { spell = spells.value as SpellName; timelineStart = null; timelineSent = ''; };
  spells.onkeydown = (e) => e.stopPropagation();
  play.onclick = () => {
    playing = !playing; timelineStart = null; timelineSent = '';
    if (playing) { presetName = null; pick.value = 'custom'; } else { timelineEl.textContent = ''; endSpellStorm(); }
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

  // The water (#18): what the game would send. The timeline's flood moves it too.
  hudEl.append(Object.assign(document.createElement('div'), { className: 'break' }));
  const waterSet = (f: (v: number) => void) => (v: number) => { f(v); sendWater({ ...water }); };
  hudEl.append(slider('Water', -0.3, 1.2, 0.01, () => water.rise, waterSet((v) => { water.rise = v; }),
    (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)} m`, true));
  hudEl.append(slider('flow', 0, 5, 0.05, () => water.flow, waterSet((v) => { water.flow = v; }), (v) => `${v.toFixed(2)}×`, true));
  hudEl.append(slider('mud', 0, 1, 0.01, () => water.mud, waterSet((v) => { water.mud = v; }), share, true));

  // The ground (#14): the snow lying, what the game would send.
  hudEl.append(slider('Lying', 0, 1, 0.01, () => ground.snow, (v) => { ground.snow = v; sendGround({ ...ground }); }, share, true));
  // The frost (#14), what the game would send (the frosty spells move it too), and its look's candidates.
  hudEl.append(slider('Frost', 0, 1, 0.01, () => ground.frost, (v) => { ground.frost = v; sendGround({ ...ground }); }, share, true));
  // How wet the land is (#11), what the game would send (the timeline wets and dries it too).
  hudEl.append(slider('Wet', 0, 1, 0.01, () => ground.wet, (v) => { ground.wet = v; sendGround({ ...ground }); send(sent); },
    (v) => (v <= 0 ? 'dry' : v < 0.4 ? `drying ${v.toFixed(2)}` : v < 0.85 ? `wet ${v.toFixed(2)}` : `soaked ${v.toFixed(2)}`)));
}
const timelineEl = document.createElement('span');
/** A clock hour as 14:45. */
function clock(h: number) {
  const m = Math.round((((h % 24) + 24) % 24) * 60);
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
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
  return { cloud: w.cloud, storm: w.storm ?? 0, rain: w.rain ?? 0, snow: w.snow ?? 0, heat: w.heat ?? 0, haze: w.haze ?? null };
}

/** Plays the timeline at a time (seconds): sends the game's weather when it changes, eased, as the game would. */
function playTimeline(time: number) {
  if (!playing) return;
  timelineStart ??= time;
  const w = timelineAt(time - timelineStart, speed, spell), key = JSON.stringify(w);
  timelineEl.textContent = timelinePhase(time - timelineStart, speed, spell);
  // The wind, when the spell brings its own (the game's setWind).
  const gust = timelineWind(time - timelineStart, speed, spell);
  if (gust !== null && gust !== wind.speed) { wind.speed = gust; living.setGoal(windGoal()); for (const r of refreshers) r(); }
  // The water, when the spell moves it (the game's setWater), a few times a second as the weather is.
  const ws = timelineWater(time - timelineStart, speed, spell);
  if (ws) { Object.assign(water, ws); sendWater({ ...water }); for (const r of refreshers) r(); }
  // The ground, as the game's rain and sun have wetted and dried it (#11).
  const wet = timelineWet(time - timelineStart, speed, spell);
  if (Math.abs(wet - ground.wet) > 1e-4) { ground.wet = wet; sendGround({ ...ground }); for (const r of refreshers) r(); }
  // And the snow lying, as the game's snowfall has laid it (#14).
  const lying = timelineLying(time - timelineStart, speed, spell);
  if (lying !== null && Math.abs(lying - ground.snow) > 1e-4) { ground.snow = lying; sendGround({ ...ground }); for (const r of refreshers) r(); }
  // The frost, as the game's night and sun have laid and taken it, and the game's clock, which the frost spells keep (#14).
  const frost = timelineFrost(time - timelineStart, speed, spell);
  if (frost !== null && Math.abs(frost - ground.frost) > 1e-4) { ground.frost = frost; sendGround({ ...ground }); for (const r of refreshers) r(); }
  const at = timelineClock(time - timelineStart, speed, spell);
  if (at !== null) {
    timelineEl.textContent += ` · ${clock(at)}`;
    if (at !== hour) { hour = at; for (const r of refreshers) r(); }
  }
  // A storm's lightning, which the demo calls at the spell's rates, as the game would (#12).
  stormLightning(timelineLightning(time - timelineStart, speed, spell));
  if (key === timelineSent) return;
  timelineSent = key;
  // The low sun under the deck, when the spell sends it (#12): over the demo's own, which comes back after it.
  spellSun = w.sunUnder ?? null;
  // The game sends the whole weather: what the spell leaves out is none (a haze thinned away keeps its colour and height).
  const { haze, ...rest } = whole(w);
  Object.assign(weather, rest, { haze: haze ? { ...haze } : { ...weather.haze, amount: 0 } });
  send(weather, false, time);
  for (const r of refreshers) r();
}

// Shot mode (tools/): no loop; the tools ask for frames. __shot draws one and returns it as a PNG; __draw puts the camera
// somewhere (a fractional view turns part way), leaves some kinds out, and draws, leaving the frame on the canvas.
if (params.has('shot')) {
  // The living wind is stepped to each frame's time (seconds after its warm-up). A time before the last starts it again
  // from its save a tick before time 0 (so time 0 blends the same two ticks again) and steps it on under the wind asked
  // for now. A wind asked for at once (not eased) starts a
  // new wind, already blowing as asked and warmed up, since the game's wind eases to a new goal over a few seconds.
  let windAt = -WIND_TICK, windStart: Promise<WindSave> | null = null, windKey = JSON.stringify(windGoal());
  const windTo = async (time: number, goal: WindGoal, ease: boolean) => {
    const key = JSON.stringify(goal);
    if (key !== windKey && !ease) { living.dispose(); living = newWind(); windStart = null; windAt = -WIND_TICK; renderer.wind.restart(); renderer.trees.restart(); renderer.dust.restart(); }
    windKey = key;
    windStart ??= living.save();
    const start = await windStart;
    if (time < windAt - 1e-9) { living.restore(start); windAt = -WIND_TICK; }
    living.setGoal(goal);
    living.advance(time - windAt);
    windAt = time;
    await living.idle();
  };
  // options.wind sets the wind, options.weather the weather (a preset's name, whole, or values over the demo's), and
  // options.timeline the scripted weather (whole) at a time (seconds, at a game speed and in a spell, the demo's by
  // default); all at once, unless ease is
  // set: then they ease as the clock runs. options.hour sets the hour (the game's clock); options.dayHour draws an hour of
  // the reference day in the season's (17.5, golden hour, at the season's golden hour), leaving the clock. Resolves once
  // the frame is drawn.
  const draw = async (cam?: { x: number; z: number; zoom: number; view: number },
    options: {
      hide?: DrawnKind[]; grain?: boolean; time?: number; hour?: number; dayHour?: number; wind?: Partial<typeof wind>;
      weather?: Partial<Weather> | WeatherName; timeline?: { time: number; speed?: number; spell?: SpellName }; ease?: boolean;
      water?: Partial<WaterState>; ground?: Partial<GroundState>;
    } = {}) => {
    if (cam) { view.target.set(cam.x, 0, cam.z); view.zoom = cam.zoom; view.view = cam.view; view.update(0, true); }
    if (options.hour !== undefined) hour = options.hour;
    if (options.wind) Object.assign(wind, options.wind);
    // The clouds carried on to the frame's time (see driftAt).
    const time = options.time ?? frozen ?? 0;
    if (options.weather) {
      const w = typeof options.weather === 'string' ? whole(WEATHER_PRESETS[options.weather]) : { ...weather, ...options.weather };
      spellSun = null;
      send(w, !options.ease, time);
    }
    if (options.timeline) {
      const t = options.timeline;
      // The spell's wind first, so the clouds' drift is sent at its speed, as the timeline does.
      const s = timelineWind(t.time, t.speed ?? speed, t.spell ?? spell);
      if (s !== null) wind.speed = s;
      const w = timelineAt(t.time, t.speed ?? speed, t.spell ?? spell);
      spellSun = w.sunUnder ?? null;
      send(whole(w), !options.ease, time);
      const ws = timelineWater(t.time, t.speed ?? speed, t.spell ?? spell);
      if (ws) Object.assign(water, ws);
      ground.wet = timelineWet(t.time, t.speed ?? speed, t.spell ?? spell);
      ground.snow = timelineLying(t.time, t.speed ?? speed, t.spell ?? spell) ?? ground.snow;
      ground.frost = timelineFrost(t.time, t.speed ?? speed, t.spell ?? spell) ?? ground.frost;
      hour = timelineClock(t.time, t.speed ?? speed, t.spell ?? spell) ?? hour;
    }
    if (options.water) Object.assign(water, options.water);
    // The water's clock is the renderer's: put it at the frame's time first, so an ease starts from there.
    renderer.shared.uTime.value = time;
    sendWater({ ...water }, !options.ease);
    if (options.ground) Object.assign(ground, options.ground);
    sendGround({ ...ground }, !options.ease);
    if (!options.weather && !options.timeline) send(sent, false, time);
    await windTo(time, windGoal(), !!options.ease);
    drawWind();
    if (windMap) windView.draw(view.target.x, view.target.z, view.heading);
    const kinds: DrawnKind[] = ['ground', 'paint', 'crop', 'ink', 'water', 'foliage', 'grass', 'debris', 'rain', 'snow'];
    for (const k of kinds) renderer.setVisible(k, !options.hide?.includes(k));
    const grain = renderer.settings.grain;
    if (options.grain === false) renderer.settings.grain = 0;
    renderer.setHour(options.dayHour !== undefined ? clockHour(options.dayHour, renderer.day) : hour);
    for (let i = 0; i < 2; i++) renderer.render(time);
    renderer.settings.grain = grain;
  };
  loaded.then(() => Object.assign(window, {
    __renderer: renderer,
    __draw: draw,
    __profile: (cases?: ProfileCase[]) => profile(cases),
    __profileTable: table,
    __shot: async () => { await draw(); return canvas.toDataURL('image/png'); },
    // A scripted storm's lightning at a time, strikes and flickers a minute (tools/video.ts calls them, as the game would).
    __timelineLightning: (time: number, speed?: number, spell?: SpellName) => timelineLightning(time, speed, spell),
  }));
} else requestAnimationFrame(frame);

// Profiling (tools/profile.ts, or ?profile on any machine): the demo's own loop waits while the cases run.
async function profile(cases = defaultCases(), progress?: (row: ProfileRow, i: number) => void) {
  await loaded;
  profiling = true;
  try {
    return await runProfile(renderer, (t) => { renderer.setHour(hour); renderer.render(t); },
      () => { send(weather, true, 0); groundSent = ''; sendGround(ground, true); }, cases, progress);
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
  if (frozen === null) living.advance(dt);
  drawWind();
  if (windMap) windView.draw(view.target.x, view.target.z, view.heading);
  // The game sends the clouds' drift a few times a second (with the weather); the renderer carries them on between.
  if (Math.floor(time * TICK) !== lastTick) { lastTick = Math.floor(time * TICK); send(sent, false, time); }
  renderer.setHour(hour);
  renderer.render(time);
  // Ready once a frame is drawn with everything loaded (the farm's shed comes after the first frames).
  if (++frames >= 3 && isLoaded && warm()) (window as unknown as { __ready: boolean }).__ready = true;
  requestAnimationFrame(frame);
}
