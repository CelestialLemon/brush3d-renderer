// Renders demo frames headlessly and saves them as PNGs: the eyes for iterating on the look.
//   node tools/shot.ts [out-dir] [query ...]     e.g.  node tools/shot.ts out "hour=12" "hour=17.5&view=2&zoom=24"
// Each query is added to the demo URL (see src/app/main.ts). DEMO_URL picks the dev server, CHROME_PATH the browser,
// GL_BACKEND how it draws: vulkan (the GPU, default on Linux) or swiftshader (CPU, slow).
import puppeteer from 'puppeteer-core';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.DEMO_URL || 'http://127.0.0.1:5190';
const BACKENDS: Record<string, string[]> = {
  swiftshader: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  vulkan: ['--use-angle=vulkan', '--enable-features=Vulkan', '--enable-gpu', '--ignore-gpu-blocklist'],
};
const backend = process.env.GL_BACKEND || 'vulkan';

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(homedir(), '.cache/ms-playwright');
  const dirs = existsSync(cache) ? readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort() : [];
  for (const d of dirs.reverse()) { const p = join(cache, d, 'chrome-linux64/chrome'); if (existsSync(p)) return p; }
  throw new Error('No Chromium found: set CHROME_PATH');
}

const [out = 'out', ...queries] = process.argv.slice(2);
const width = Number(process.env.W || 1280), height = Number(process.env.H || 720);
await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: findChrome(), headless: true,
  args: ['--no-sandbox', ...BACKENDS[backend], '--mute-audio', `--window-size=${width},${height}`],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warn') console.log(`[page ${m.type()}]`, m.text()); });
  page.on('pageerror', (e) => console.log('[page error]', e));
  for (const [i, q] of (queries.length ? queries : ['']).entries()) {
    const url = `${BASE}/?shot&still&dpr=1&${q}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction('window.__shot !== undefined', { timeout: 120000 });
    const t0 = Date.now();
    const data = await page.evaluate('window.__shot()') as string;
    const name = (q || 'default').replace(/[^a-z0-9.=_-]+/gi, '_');
    const file = join(out, `${String(i).padStart(2, '0')}-${name}.png`);
    await writeFile(file, Buffer.from(data.split(',')[1], 'base64'));
    console.log(`${file}  (${Date.now() - t0} ms)`);
  }
  const gl = await page.evaluate(() => {
    const g = document.createElement('canvas').getContext('webgl2');
    const info = g?.getExtension('WEBGL_debug_renderer_info');
    return g ? g.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : g.RENDERER) : 'none';
  });
  console.log('renderer:', gl);
} finally {
  await browser.close();
}
