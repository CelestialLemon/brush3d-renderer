// Measures how steady the picture is as the camera moves: the paint should stay on the world, not crawl or shimmer.
//   node tools/motion.ts [out-dir] [query ...]      e.g.  node tools/motion.ts out "zoom=40" "scene=meadow&zoom=40"
//
// For each query (a demo URL, see src/app/main.ts) it draws a frame, pans the camera by a fraction of a pixel, draws again,
// shifts the first frame by the same amount and compares. An orthographic pan moves everything on screen by exactly that
// amount, so whatever differs is the picture changing under motion. It reports the mean difference (0-255) and the share of
// pixels that differ by more than 8, over the frame and with each kind of material left out (what drops is that kind's share),
// and writes a heat map of the difference for the quarter-pixel pan. The clock is frozen and the screen grain is off.
// Shifting a frame by a fraction of a pixel blurs it a little, which shows as a difference along every sharp edge even when
// nothing crawls; 'soft' compares both frames after a small blur, which leaves out most of that and keeps the crawl (a blade
// that pops in and out changes the blurred value too). Compare runs against each other rather than against zero.
// SS=2 draws at twice the resolution (and zoom) and scales each frame down: a better-sampled reference to compare against.
// It is not a floor: zoom-dependent choices (the grass's minimum width, line width, detail that fades with size, the water's
// half-size passes) come out differently there, and supersampling doesn't remove all aliasing.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gpuName, launch, open } from './browser.ts';

const PITCH = (30 * Math.PI) / 180;
const PANS: { name: string; right: number; up: number }[] = [
  { name: 'right 0.25px', right: 0.25, up: 0 },
  { name: 'right 0.5px', right: 0.5, up: 0 },
  { name: 'right 1px', right: 1, up: 0 },
  { name: 'right 2px', right: 2, up: 0 },
  { name: 'up 0.5px', right: 0, up: 0.5 },
];
const KINDS = ['grass', 'foliage', 'crop', 'ink', 'water', 'debris'];
// Which pan the A/B runs use: AB=2 picks the 1-pixel pan (whatever changes there isn't sub-pixel crawl but something not fixed to the world).
const AB = PANS[Number(process.env.AB ?? 0)];
const SS = Number(process.env.SS ?? 1);

const [out = 'out', ...queries] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const { browser, page } = await launch();
const report: Record<string, unknown> = {};
try {
  for (const q of queries.length ? queries : ['']) {
    await open(page, q, SS);
    const params = new URLSearchParams(q);
    const cam = { x: Number(params.get('x') ?? 0), z: Number(params.get('z') ?? 0), zoom: Number(params.get('zoom') ?? 40) * SS, view: Number(params.get('view') ?? 0) };
    const yaw = ((45 + 90 * cam.view) * Math.PI) / 180;
    // Pans are in final pixels; drawn at SS times the resolution they are SS times as many.
    const moved = (r0: number, u0: number, right = r0 * SS, up = u0 * SS) => ({
      ...cam,
      x: cam.x + (Math.cos(yaw) * right - Math.sin(yaw) * up / Math.sin(PITCH)) / cam.zoom,
      z: cam.z + (-Math.sin(yaw) * right - Math.cos(yaw) * up / Math.sin(PITCH)) / cam.zoom,
    });
    const rows: Record<string, unknown>[] = [];
    const measure = async (pan: (typeof PANS)[number], hide: string[], heat: string | null) => {
      await page.evaluate((c, h) => { (window as any).__draw(c, { hide: h, grain: false }); (window as any).__grab('a'); }, cam, hide);
      await page.evaluate((c, h) => { (window as any).__draw(c, { hide: h, grain: false }); (window as any).__grab('b'); }, moved(pan.right, pan.up), hide);
      return page.evaluate((dx, dy, h) => (window as any).__compare('a', 'b', dx, dy, h), pan.right, -pan.up, heat !== null) as Promise<{ mae: number; over8: number; soft: number; heat?: string }>;
    };
    await page.evaluate(installAnalysis);
    for (const pan of PANS) {
      const r = await measure(pan, [], pan.right === 0.25 ? 'heat' : null);
      if (r.heat) await writeFile(join(out, `${slug(q)}-heat.png`), Buffer.from(r.heat.split(',')[1], 'base64'));
      rows.push({ pan: pan.name, without: '-', mae: r.mae, over8: r.over8, soft: r.soft });
    }
    for (const k of KINDS) {
      const r = await measure(AB, [k], null);
      rows.push({ pan: AB.name, without: k, mae: r.mae, over8: r.over8, soft: r.soft });
    }
    const shot = await page.evaluate(() => { (window as any).__draw(undefined, { grain: false }); return document.querySelector('canvas')!.toDataURL('image/png'); });
    await writeFile(join(out, `${slug(q)}.png`), Buffer.from(shot.split(',')[1], 'base64'));
    console.log(`\n${q || '(default)'}`);
    for (const r of rows) console.log(`  ${String(r.pan).padEnd(13)} without ${String(r.without).padEnd(8)} mean ${(r.mae as number).toFixed(3).padStart(6)}   soft ${(r.soft as number).toFixed(3).padStart(6)}   >8 ${((r.over8 as number) * 100).toFixed(2).padStart(6)}%`);
    report[q] = rows;
  }
  report.gpu = await gpuName(page);
  console.log('\nrenderer:', report.gpu);
  await writeFile(join(out, 'motion.json'), JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

function slug(q: string) { return (q || 'default').replace(/[^a-z0-9.=_-]+/gi, '_'); }

/** Runs in the page: keeps copies of frames and compares them, the second against the first shifted by (dx, dy) pixels. */
function installAnalysis() {
  const w = window as any;
  w.__frames = {};
  w.__grab = (name: string) => {
    const src = document.querySelector('canvas')!;
    const c = document.createElement('canvas');
    const ss = Math.round(src.width / innerWidth);
    c.width = src.width / ss; c.height = src.height / ss;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, 0, 0, c.width, c.height);
    w.__frames[name] = g.getImageData(0, 0, c.width, c.height);
  };
  w.__compare = (an: string, bn: string, dx: number, dy: number, heat: boolean) => {
    const a: ImageData = w.__frames[an], b: ImageData = w.__frames[bn];
    const W = a.width, H = a.height, M = 8;
    const out = heat ? new ImageData(W, H) : null;
    let sum = 0, n = 0, over = 0, soft = 0;
    // A 3x3 binomial blur of the per-channel difference (b minus shifted a).
    const diff = new Float32Array(W * H * 3);
    for (let y = M; y < H - M; y++) for (let x = M; x < W - M; x++) {
      // b's pixel shows what a showed at (x + dx, y + dy): sample a there, bilinearly.
      const sx = x + dx, sy = y + dy, x0 = Math.floor(sx), y0 = Math.floor(sy), tx = sx - x0, ty = sy - y0;
      let worst = 0, total = 0;
      for (let ch = 0; ch < 3; ch++) {
        const p = (yy: number, xx: number) => a.data[(yy * W + xx) * 4 + ch];
        const v = (p(y0, x0) * (1 - tx) + p(y0, x0 + 1) * tx) * (1 - ty) + (p(y0 + 1, x0) * (1 - tx) + p(y0 + 1, x0 + 1) * tx) * ty;
        const sd = b.data[(y * W + x) * 4 + ch] - v, d = Math.abs(sd);
        diff[(y * W + x) * 3 + ch] = sd;
        total += d; worst = Math.max(worst, d);
      }
      sum += total / 3; n++;
      if (worst > 8) over++;
      if (out) { const i = (y * W + x) * 4, v = Math.min(255, worst * 8); out.data[i] = v; out.data[i + 1] = v; out.data[i + 2] = v; out.data[i + 3] = 255; }
    }
    for (let y = M + 1; y < H - M - 1; y++) for (let x = M + 1; x < W - M - 1; x++) {
      let t = 0;
      for (let ch = 0; ch < 3; ch++) {
        const at = (yy: number, xx: number) => diff[(yy * W + xx) * 3 + ch];
        const v = (at(y - 1, x - 1) + at(y - 1, x + 1) + at(y + 1, x - 1) + at(y + 1, x + 1)
          + 2 * (at(y - 1, x) + at(y + 1, x) + at(y, x - 1) + at(y, x + 1)) + 4 * at(y, x)) / 16;
        t += Math.abs(v);
      }
      soft += t / 3;
    }
    soft /= (W - 2 * M - 2) * (H - 2 * M - 2);
    let heatUrl: string | undefined;
    if (out) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      c.getContext('2d')!.putImageData(out, 0, 0);
      heatUrl = c.toDataURL('image/png');
    }
    return { mae: sum / n, over8: over / n, soft, heat: heatUrl };
  };
}
