// TEMPLATE — copy to the project's scripts/ dir. Derives the chunk list from ../tts-chunks.json,
// so it needs no per-video edits. Concatenates chunk mp3s into audio/full-narration.mp3 with a
// 0.35s gap between chunks (sync-safe filter_complex). The 0.35s MUST match build-timeline.js.
// Usage: node scripts/stitch-narration.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GAP = 0.35;
const proj = path.resolve(__dirname, '..');
const dir = path.join(proj, 'audio');
const out = path.join(dir, 'full-narration.mp3');
const order = JSON.parse(fs.readFileSync(path.join(proj, 'tts-chunks.json'), 'utf8')).map((c) => c.file);
for (const f of order) if (!fs.existsSync(path.join(dir, f))) throw new Error('missing ' + f);

const args = [];
for (const f of order) args.push('-i', path.join(dir, f));
const N = order.length;
const parts = [];
for (let i = 0; i < N; i++) parts.push(`[${i}:a]aresample=44100[a${i}]`);
for (let g = 1; g < N; g++) parts.push(`aevalsrc=0:d=${GAP}:s=44100[s${g}]`);
let seq = '';
for (let i = 0; i < N; i++) { seq += `[a${i}]`; if (i < N - 1) seq += `[s${i + 1}]`; }
seq += `concat=n=${2 * N - 1}:v=0:a=1[out]`;
args.push('-filter_complex', parts.join(';') + ';' + seq, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', '-y', out);
execFileSync('ffmpeg', ['-loglevel', 'error', ...args], { stdio: 'inherit' });
console.log('built', out, 'from', N, 'chunks');
