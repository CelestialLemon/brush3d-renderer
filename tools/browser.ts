// Headless Chromium for the tools: the demo drawn on the GPU, with its console errors passed through.
// DEMO_URL picks the dev server, CHROME_PATH the browser, GL_BACKEND how it draws: vulkan (the GPU, default on Linux) or
// swiftshader (CPU, slow). W and H set the frame size.
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const BASE = process.env.DEMO_URL || 'http://127.0.0.1:5190';
export const WIDTH = Number(process.env.W || 1280), HEIGHT = Number(process.env.H || 720);
const BACKENDS: Record<string, string[]> = {
  swiftshader: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan', '--enable-gpu', '--ignore-gpu-blocklist'],
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(homedir(), '.cache/ms-playwright');
  const dirs = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort() : [];
  for (const d of dirs.reverse()) { const p = join(cache, d, 'chrome-linux64/chrome'); if (existsSync(p)) return p; }
  throw new Error('No Chromium found: set CHROME_PATH');
}

export async function launch(): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({
    executablePath: findChrome(), headless: true,
    args: ['--no-sandbox', ...BACKENDS[process.env.GL_BACKEND || 'vulkan'], '--mute-audio', `--window-size=${WIDTH},${HEIGHT}`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warn') console.log(`[page ${m.type()}]`, m.text()); });
  page.on('pageerror', (e) => console.log('[page error]', e));
  return { browser, page };
}

/** Opens the demo in shot mode with a query and waits for its hooks. */
export async function open(page: Page, query: string, dpr = 1) {
  await page.goto(`${BASE}/?shot&still&dpr=${dpr}&${query}`, { waitUntil: 'load' });
  await page.waitForFunction('window.__shot !== undefined', { timeout: 120000 });
}

export async function gpuName(page: Page) {
  return page.evaluate(() => {
    const g = document.createElement('canvas').getContext('webgl2');
    const info = g?.getExtension('WEBGL_debug_renderer_info');
    return g ? String(g.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : g.RENDERER)) : 'none';
  });
}
