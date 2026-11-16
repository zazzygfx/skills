// Writes out/<film>/cues.json from the film spec, so the mix places every sound on the motion that caused it.
//   npm run cues <film>        (then: python3 scripts/mix.py out/<film>/cues.json out/<film>/mix.wav ...)
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const id = process.argv[2];
if (!id) { console.error('usage: npm run cues <film>'); process.exit(1); }
const root = process.cwd();
const {film} = await import(pathToFileURL(path.join(root, 'src', id, 'film.ts')).href);
const {cues} = await import(pathToFileURL(path.join(root, 'src', 'kit', 'film-core.ts')).href);
const layers = JSON.parse(fs.readFileSync(path.join(root, 'src', id, 'layers.json'), 'utf8'));
const out = cues(film, s => layers.filter(l => l.f === s));
fs.mkdirSync(path.join(root, 'out', id), {recursive: true});
fs.writeFileSync(path.join(root, 'out', id, 'cues.json'), JSON.stringify(out, null, 1));
const n = {}; out.cues.forEach(c => n[c.type] = (n[c.type] ?? 0) + 1);
console.log(`wrote out/${id}/cues.json  ${out.dur.toFixed(2)} s  ${out.cues.length} cues`, n);
