// Checks that the demo uses the renderer only through its API (src/index.ts, docs/API.md): every import in src/demo is
// the index, another demo file, or three. Run by `npm run typecheck`.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..'), demo = join(root, 'src/demo'), index = join(root, 'src/index');
const files = readdirSync(demo, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts')).map((f) => join(demo, f));
const bad: string[] = [];
for (const file of files) {
  for (const [, from] of readFileSync(file, 'utf8').matchAll(/(?:^|\n)\s*(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]/g)) {
    if (from === 'three' || from.startsWith('three/')) continue;
    const to = resolve(dirname(file), from).replace(/\.ts$/, '');
    if (to === index || to.startsWith(demo + '/')) continue;
    bad.push(`${relative(root, file)}: imports '${from}'`);
  }
}
if (bad.length) {
  console.error(`The demo may use the renderer only through src/index.ts (docs/API.md):\n${bad.join('\n')}`);
  process.exit(1);
}
console.log(`ok   the demo's ${files.length} files import only the API`);
