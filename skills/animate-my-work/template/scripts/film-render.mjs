// The whole render, done by Remotion: picture, then cues -> mix -> mux. Claude never screenshots frames.
//   npm run render <film> [-- --music public/music/x.mp3 --bpm 127.99 --phase 0.03 --bars "5,6,7,8-22x3" --tail 31]
// Writes out/<film>/video.mp4 (silent master), cues.json, mix.wav and <film>.mp4 (the deliverable).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {ensureBrowser, renderMedia, selectComposition} from '@remotion/renderer';
const [id, ...rest] = process.argv.slice(2);
if (!id) { console.error('usage: npm run render <film> [-- mix.py flags]'); process.exit(1); }
const root = process.cwd(), out = path.join(root, 'out', id); fs.mkdirSync(out, {recursive: true});
await ensureBrowser();
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const composition = await selectComposition({serveUrl, id});
const t0 = Date.now(); let last = -1;
const silent = path.join(out, 'video.mp4');
await renderMedia({serveUrl, composition, codec: 'h264', outputLocation: silent, crf: 16, pixelFormat: 'yuv420p', colorSpace: 'bt709', muted: true,
  onProgress: ({progress}) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`picture ${p * 10}%`); } }});
console.log(`picture done in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
execFileSync('node', ['--experimental-strip-types', 'scripts/cues.mjs', id], {stdio: 'inherit'});
execFileSync('python3', ['scripts/mix.py', path.join(out, 'cues.json'), path.join(out, 'mix.wav'), ...rest], {stdio: 'inherit'});
const final = path.join(out, `${id}.mp4`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', silent, '-i', path.join(out, 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', final], {stdio: 'inherit'});
console.log(`wrote ${path.relative(root, final)}`);
