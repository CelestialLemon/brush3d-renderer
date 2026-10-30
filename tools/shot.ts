// Renders demo frames headlessly and saves them as PNGs: the eyes for iterating on the look.
//   node tools/shot.ts [out-dir] [query ...]     e.g.  node tools/shot.ts out "hour=12" "hour=17.5&view=2&zoom=24"
// Each query is added to the demo URL (see src/app/main.ts), the weather too ("weather=overcast&hour=17.5", "cloud=0.6").
// See tools/browser.ts for the environment it reads.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gpuName, launch, open } from './browser.ts';

const [out = 'out', ...queries] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const { browser, page } = await launch();
try {
  for (const [i, q] of (queries.length ? queries : ['']).entries()) {
    await open(page, q);
    const t0 = Date.now();
    const data = await page.evaluate('window.__shot()') as string;
    const name = (q || 'default').replace(/[^a-z0-9.=_-]+/gi, '_');
    const file = join(out, `${String(i).padStart(2, '0')}-${name}.png`);
    await writeFile(file, Buffer.from(data.split(',')[1], 'base64'));
    console.log(`${file}  (${Date.now() - t0} ms)`);
  }
  console.log('renderer:', await gpuName(page));
} finally {
  await browser.close();
}
