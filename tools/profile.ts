// What a frame costs, pass by pass: the GPU's time for each (the sun's shadow, under the water, the reflection, the main
// view, the post pass), the CPU's for the whole frame, and the frame drawn uncapped, at 720p, 1080p, 1440p and 4K, calm and
// in a storm, and at 1080p in a storm with each kind of mesh left out (what it saves is that kind's share).
//   node tools/profile.ts [out-dir] [query ...]      e.g.  node tools/profile.ts out "scene=farm" "scene=farm&samples=2"
// Queries are demo URLs (see src/app/main.ts); by default both scenes. Writes <out-dir>/profile.json.
// CPU=2 slows the page's own CPU work by that factor (Chrome's throttling, in this browser only: nothing outside it
// changes), a stand-in for a laptop's slower, hotter processor. It doesn't slow the GPU.
// From the four sizes it fits each pass's time as fixed + per-megapixel, which is what scales a measurement here to another
// resolution or, roughly, another GPU (docs/PERFORMANCE.md). The same cases run on any machine at the demo's ?profile.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gpuName, launch, open } from './browser.ts';

/** As src/app/profile.ts reports a case: median ms per pass ('frame' for them all), GPU null without timers. */
interface ProfileRow { label: string; width: number; height: number; gpu: Record<string, number> | null; cpu: Record<string, number>; uncapped: number }

const CPU = Number(process.env.CPU ?? 1);
const [out = 'out', ...args] = process.argv.slice(2);
const queries = args.length ? args : ['scene=farm', 'scene=meadow'];
await mkdir(out, { recursive: true });
const { browser, page } = await launch();
const report: Record<string, unknown> = { cpuThrottle: CPU };
try {
  const cdp = await page.createCDPSession();
  for (const q of queries) {
    await open(page, q);
    // After loading: a navigation drops the throttling.
    if (CPU !== 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
    const rows = (await page.evaluate(() => (window as any).__profile())) as ProfileRow[];
    const text = await page.evaluate((r) => (window as any).__profileTable(r), rows);
    console.log(`\n${q}${CPU !== 1 ? ` (CPU ${CPU}x slower)` : ''}\n${text}`);
    const fits = fit(rows.filter((r) => r.label.endsWith(' storm')));
    if (fits) {
      console.log('  storm, fitted: ms = fixed + per megapixel');
      for (const [p, f] of Object.entries(fits)) console.log(`    ${p.padEnd(8)} ${f.fixed.toFixed(2).padStart(6)} + ${f.perMpx.toFixed(2).padStart(5)}/Mpx`);
    }
    report[q] = { rows, fits };
  }
  report.gpu = await gpuName(page);
  console.log('\nrenderer:', report.gpu);
  await writeFile(join(out, 'profile.json'), JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

/** Least squares of each pass's GPU time against the frame's megapixels. */
function fit(rows: ProfileRow[]) {
  if (rows.length < 2 || rows.some((r) => !r.gpu)) return null;
  const x = rows.map((r) => (r.width * r.height) / 1e6);
  const mx = x.reduce((a, b) => a + b) / x.length;
  const out: Record<string, { fixed: number; perMpx: number }> = {};
  for (const p of Object.keys(rows[0].gpu!).filter((k) => k !== 'setup')) {
    const y = rows.map((r) => r.gpu![p]);
    const my = y.reduce((a, b) => a + b) / y.length;
    const perMpx = x.reduce((a, xi, i) => a + (xi - mx) * (y[i] - my), 0) / x.reduce((a, xi) => a + (xi - mx) ** 2, 0);
    out[p] = { fixed: my - perMpx * mx, perMpx };
  }
  return out;
}
