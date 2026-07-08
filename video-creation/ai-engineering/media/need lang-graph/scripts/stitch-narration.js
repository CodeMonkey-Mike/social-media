// Stitch chunk-01..44.mp3 into one review track with 0.35s gaps (sync-safe filter_complex concat).
// Review artifact only; the comp plays per-chunk audio. Usage: node scripts/stitch-narration.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../audio');
const out = path.join(dir, 'full-narration.mp3');
const order = [];
for (let n = 1; n <= 44; n++) order.push('chunk-' + String(n).padStart(2, '0') + '.mp3');
for (const f of order) if (!fs.existsSync(path.join(dir, f))) throw new Error('missing ' + f);

const args = [];
for (const f of order) args.push('-i', path.join(dir, f));
const N = order.length;
const parts = [];
for (let i = 0; i < N; i++) parts.push(`[${i}:a]aresample=44100[a${i}]`);
for (let g = 1; g < N; g++) parts.push(`aevalsrc=0:d=0.35:s=44100[s${g}]`);
let seq = '';
for (let i = 0; i < N; i++) { seq += `[a${i}]`; if (i < N - 1) seq += `[s${i + 1}]`; }
seq += `concat=n=${2 * N - 1}:v=0:a=1[out]`;
const filter = parts.join(';') + ';' + seq;
args.push('-filter_complex', filter, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', '-y', out);
execFileSync('ffmpeg', ['-loglevel', 'error', ...args], { stdio: 'inherit' });
console.log('built', out, 'from', N, 'chunks');
