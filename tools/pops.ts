// Looks for swatch pops in the wind: a dab or blade changing colour all at once between frames, rather than moving.
//   node tools/pops.ts [out-dir] [query ...]      e.g.  node tools/pops.ts out "wind=storm" "scene=meadow&wind=hurricane"
//
// The camera stays still and the clock runs. At many moments it draws two frames a short step apart (1/240 s) and finds
// the pixels whose colour changed a lot. Anything moving smoothly moves under a pixel in that time, so it changes only a thin
// rim of pixels at its edges; a pop (two overlapping dabs swapping which is in front, a dab blinking in or out) changes a
// whole patch however short the step. So it reports the patches: how many there are of 16 pixels or more, and the largest,
// per moment and summed, with each kind of material left out (what drops is that kind's share). STEP sets the step in
// seconds, and the run is repeated at four times the step: smooth motion's numbers grow with the step, pops' don't.
// It writes a picture of the worst moment's patches. A query takes the weather like the demo's ("weather=storm"); add
// falling=0 to leave out the things in the air (rain, snow, the wind's leaves) and measure the land under them.
// See tools/browser.ts for the environment it reads.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gpuName, launch, open } from './browser.ts';

const STEP = Number(process.env.STEP ?? 1 / 240);
const MOMENTS = 40;
const KINDS = ['foliage', 'grass', 'crop', 'water', 'debris'];

const [out = 'out', ...queries] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const { browser, page } = await launch();
try {
  for (const q of queries.length ? queries : ['']) {
    await open(page, q);
    await page.evaluate(installAnalysis);
    const run = async (step: number, hide: string[], picture: string | null) => {
      let patches = 0, largest = 0, worst = -1, worstPic: string | undefined;
      for (let i = 0; i < MOMENTS; i++) {
        const t = 3 + i * 0.25;
        const r = await page.evaluate((t, step, hide, pic) => {
          const w = window as any;
          w.__draw(undefined, { time: t, hide, grain: false }); w.__grab('a');
          w.__draw(undefined, { time: t + step, hide, grain: false }); w.__grab('b');
          return w.__patches('a', 'b', pic);
        }, t, step, hide, picture !== null) as { patches: number; largest: number; picture?: string };
        patches += r.patches; largest = Math.max(largest, r.largest);
        if (r.largest > worst) { worst = r.largest; worstPic = r.picture; }
      }
      if (picture && worstPic) await writeFile(join(out, picture), Buffer.from(worstPic.split(',')[1], 'base64'));
      return { patches, largest };
    };
    console.log(`\n${q || '(default)'}   (${MOMENTS} moments; patches of 16+ pixels that changed by more than 24/255)`);
    const show = (name: string, r: { patches: number; largest: number }) =>
      console.log(`  ${name.padEnd(24)} patches ${String(r.patches).padStart(5)}   largest ${String(r.largest).padStart(6)} px`);
    show(`step ${(STEP * 1000).toFixed(1)} ms`, await run(STEP, [], `${slug(q)}-pops.png`));
    show(`step ${(STEP * 4000).toFixed(1)} ms`, await run(STEP * 4, [], null));
    for (const k of KINDS) show(`without ${k}`, await run(STEP, [k], null));
  }
  console.log('\nrenderer:', await gpuName(page));
} finally {
  await browser.close();
}

function slug(q: string) { return (q || 'default').replace(/[^a-z0-9.=_-]+/gi, '_'); }

/** Runs in the page: keeps copies of frames, and finds the connected patches of pixels that changed a lot between two. */
function installAnalysis() {
  const w = window as any;
  w.__frames = {};
  w.__grab = (name: string) => {
    const src = document.querySelector('canvas')!;
    const c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.drawImage(src, 0, 0);
    w.__frames[name] = g.getImageData(0, 0, c.width, c.height);
  };
  w.__patches = (an: string, bn: string, picture: boolean) => {
    const a: ImageData = w.__frames[an], b: ImageData = w.__frames[bn];
    const W = a.width, H = a.height;
    const hot = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      let d = 0;
      for (let ch = 0; ch < 3; ch++) d = Math.max(d, Math.abs(a.data[i * 4 + ch] - b.data[i * 4 + ch]));
      hot[i] = d > 24 ? 1 : 0;
    }
    // Connected patches (4-neighbours), by flood fill.
    const label = new Int32Array(W * H), stack: number[] = [];
    let patches = 0, largest = 0, next = 1;
    const sizes: number[] = [0];
    for (let i = 0; i < W * H; i++) {
      if (!hot[i] || label[i]) continue;
      let size = 0;
      label[i] = next; stack.push(i);
      while (stack.length) {
        const j = stack.pop()!, x = j % W, y = (j / W) | 0;
        size++;
        for (const k of [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, y > 0 ? j - W : -1, y < H - 1 ? j + W : -1]) {
          if (k >= 0 && hot[k] && !label[k]) { label[k] = next; stack.push(k); }
        }
      }
      sizes.push(size); next++;
      if (size >= 16) patches++;
      largest = Math.max(largest, size);
    }
    let url: string | undefined;
    if (picture) {
      const img = new ImageData(W, H);
      for (let i = 0; i < W * H; i++) {
        const big = label[i] && sizes[label[i]] >= 16;
        const v = b.data[i * 4] * 0.25;
        img.data[i * 4] = big ? 255 : v; img.data[i * 4 + 1] = big ? 60 : v; img.data[i * 4 + 2] = big ? 60 : v; img.data[i * 4 + 3] = 255;
      }
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      c.getContext('2d')!.putImageData(img, 0, 0);
      url = c.toDataURL('image/png');
    }
    return { patches, largest, picture: url };
  };
}
