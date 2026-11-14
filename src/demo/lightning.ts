// The demo's lightning (#12), standing in for the game: a button and a shift-click to strike, random strikes and distant
// flickers and the player's flash setting. The URL options:
//   flashes=full|gentle|off (the player's setting)   strikes (random strikes on)   flicker (random flickers on)
import { type BrushRenderer, type FlashSetting, PITCH } from '../index';

const params = new URLSearchParams(location.search);

/** Sets a URL option without reloading, so the setting can be shared. */
function remember(name: string, value: string) {
  const u = new URL(location.href);
  u.searchParams.set(name, value);
  history.replaceState(null, '', u);
}

let strikes = params.has('strikes'), flickers = params.has('flicker');
let strikeTimer = 0, flickerTimer = 0, stormTimer = 0;
/** A scripted storm's lightning (timeline.ts), strikes and flickers a minute, while the timeline plays one; else null. */
let stormRates: { bolts: number; far: number } | null = null;
/** Sets the scripted storm's lightning (null when none plays): called at random at those rates, as the game might. */
export function stormLightning(rates: { bolts: number; far: number } | null) { stormRates = rates; }

/** Sets up the URL's options and the random strikes and flickers. */
export function setupLightning(renderer: BrushRenderer) {
  const l = renderer.lightning;
  const setting = params.get('flashes');
  if (setting === 'full' || setting === 'gentle' || setting === 'off') l.setting = setting;
  renderer.canvas.addEventListener('pointerdown', (e) => {
    if (!e.shiftKey) return;
    e.stopPropagation();
    const r = renderer.canvas.getBoundingClientRect();
    strikeAt(renderer, e.clientX - r.left - r.width / 2, r.height / 2 - (e.clientY - r.top));
  }, true);
  schedule(renderer);
}

/** A strike at this many CSS pixels from the middle of the view, on the land under it (the zoom counts screen pixels). */
function strikeAt(renderer: BrushRenderer, px: number, py: number) {
  const v = renderer.view, yaw = v.heading, perPixel = renderer.screenRatio / v.zoom;
  const across = px * perPixel, along = py * perPixel / Math.sin(PITCH);
  renderer.strike({
    x: v.target.x + Math.cos(yaw) * across - Math.sin(yaw) * along,
    z: v.target.z - Math.sin(yaw) * across - Math.cos(yaw) * along,
  });
}

const random = (a: number, b: number) => a + Math.random() * (b - a);

/** The random strikes and flickers, standing in for the game. */
function schedule(renderer: BrushRenderer) {
  window.clearTimeout(strikeTimer); window.clearTimeout(flickerTimer);
  if (params.has('shot')) return;
  const strike = () => {
    if (strikes) {
      const r = renderer.canvas.getBoundingClientRect();
      strikeAt(renderer, random(-0.35, 0.35) * r.width, random(-0.3, 0.1) * r.height);
    }
    strikeTimer = window.setTimeout(strike, random(2.5, 8) * 1000);
  };
  const flicker = () => {
    if (flickers) renderer.flicker({ strength: random(0.5, 1) });
    flickerTimer = window.setTimeout(flicker, random(1, 6) * 1000);
  };
  strikeTimer = window.setTimeout(strike, random(0.5, 2) * 1000);
  flickerTimer = window.setTimeout(flicker, random(0.5, 2) * 1000);
  // A scripted storm's: a chance every quarter second, at its rates.
  window.clearInterval(stormTimer);
  stormTimer = window.setInterval(() => {
    if (!stormRates) return;
    if (Math.random() < (stormRates.bolts / 60) * 0.25) {
      const r = renderer.canvas.getBoundingClientRect();
      strikeAt(renderer, random(-0.35, 0.35) * r.width, random(-0.3, 0.1) * r.height);
    }
    if (Math.random() < (stormRates.far / 60) * 0.25) renderer.flicker({ strength: random(0.5, 1) });
  }, 250);
}

/** The buttons, in the demo's controls. */
export function lightningHud(hud: HTMLElement, renderer: BrushRenderer, refresh: () => void) {
  const l = renderer.lightning;
  const button = (label: string, on: boolean, title: string, click: () => void) => {
    const b = document.createElement('button');
    b.textContent = label; b.className = on ? 'on' : ''; b.title = title;
    b.onclick = click;
    hud.append(b);
  };
  hud.append(Object.assign(document.createElement('div'), { className: 'break' }));
  button('Strike', false, 'A strike somewhere in view (or shift-click the land)', () => {
    const r = renderer.canvas.getBoundingClientRect();
    strikeAt(renderer, random(-0.35, 0.35) * r.width, random(-0.3, 0.1) * r.height);
  });
  button('Strikes', strikes, 'Random strikes in view, as the game might call them', () => { strikes = !strikes; refresh(); });
  button('Flickers', flickers, 'Distant lightning: random flickers, as the game might call them', () => { flickers = !flickers; refresh(); });
  hud.append(Object.assign(document.createElement('label'), { textContent: 'Flashes' }));
  for (const s of ['full', 'gentle', 'off'] as FlashSetting[]) {
    button(s, l.setting === s, 'The player\'s setting for flashes', () => { l.setting = s; remember('flashes', s); refresh(); });
  }
}
