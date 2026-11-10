// The demo's lightning (#12), standing in for the game: a button and a shift-click to strike, random strikes and distant
// flickers, the player's flash setting, and, until the developer has picked, the looks. The URL options:
//   flashes=full|gentle|off (the player's setting)   strikes (random strikes on)   flicker (random flickers on)
//   farLook=a|b|c (the far lightning's looks in the running; the rest are picked: flash B, bolt A, glow C)
import type { BrushRenderer } from '../renderer/renderer';
import type { FlashSetting, LookPick } from '../renderer/lightning';
import { PITCH } from '../renderer/camera';

const params = new URLSearchParams(location.search);
const PICKS: LookPick[] = ['a', 'b', 'c'];
const pick = (name: string): LookPick => (PICKS as string[]).includes(params.get(name) ?? '') ? params.get(name) as LookPick : 'a';

/** Sets a URL option without reloading, so the picks can be shared. */
function remember(name: string, value: string) {
  const u = new URL(location.href);
  u.searchParams.set(name, value);
  history.replaceState(null, '', u);
}

let strikes = params.has('strikes'), flickers = params.has('flicker');
let strikeTimer = 0, flickerTimer = 0;

/** Sets up the URL's options and the random strikes and flickers. */
export function setupLightning(renderer: BrushRenderer) {
  const l = renderer.lightning;
  const setting = params.get('flashes');
  if (setting === 'full' || setting === 'gentle' || setting === 'off') l.setting = setting;
  l.looks = { far: pick('farLook') };
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
  // The far lightning's three, still to pick (#12): A from the horizon, B cloud gaps, C a stutter.
  hud.append(Object.assign(document.createElement('label'), { textContent: 'Far' }));
  const named = { a: 'from the horizon', b: 'cloud gaps', c: 'a stutter' };
  for (const p of PICKS) button(p.toUpperCase(), l.looks.far === p, `Far lightning ${p.toUpperCase()}: ${named[p]}`, () => { l.looks.far = p; remember('farLook', p); refresh(); });
}
