'use strict';
// QA fix: regen x-tweets-118377a2-endure-the-pain (LAB glyph baked into the coin face).
// Queues behind the builders on the chatgpt stage lock; retires the contaminated
// x-tweets pool chat first so the regen opens a fresh chat.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/mnede/Documents/Claude/social-media';
const LOCK = path.join(ROOT, 'video-creation', 'shorts', '_tooling', 'stage_lock.py');
const BAD = path.join(ROOT, 'schedule-tweets', 'images', 'x', 'x-tweets-118377a2-endure-the-pain.png');

function run(cmd, args, opts) {
  console.log('[' + new Date().toISOString() + '] RUN', cmd, args.join(' '));
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: __dirname, ...opts });
  return r.status;
}

const glist = path.join(__dirname, '_genlist-ec-fix-118377a2.json');
fs.writeFileSync(glist, JSON.stringify([{
  image_id: '118377a2', slug: 'endure-the-pain',
  prompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. ' +
    'A small determined anthropomorphized coin character with weary but resolute eyes climbing out of ' +
    'dark storm rubble toward a horizon where warm golden sunrise light breaks through parting storm ' +
    'clouds, the character slightly battered but smiling, one fist raised. The coin face is completely ' +
    'plain and unmarked: no symbol, no logo, no glyph, no lettering or marking of any kind anywhere on ' +
    'the coin. Storm blues transitioning to warm gold at the horizon. Deep navy near-black background. ' +
    'Dramatic cinematic rim lighting. Hopeful, triumphant after hardship mood. ' +
    'No text or words anywhere in the image.',
}], null, 2));

if (run('python', [LOCK, 'acquire', 'chatgpt', '--owner', 'lane3-fix', '--timeout-min', '90']) !== 0) {
  console.log('LOCK ACQUIRE FAILED'); process.exit(1);
}
try {
  const retire = run('node', ['delete-chats.js', '--retire', 'x-tweets']);
  console.log('retire exit', retire, '(a failed delete stays queued; never blocks generation)');
  if (fs.existsSync(BAD)) { fs.unlinkSync(BAD); console.log('deleted bad file'); }
  const gen = run('node', ['gen-images.js', '--list=' + glist, '--prefix=x-tweets']);
  console.log(gen === 0 && fs.existsSync(BAD) ? 'REGEN OK' : 'REGEN FAILED(' + gen + ')');
} finally {
  run('python', [LOCK, 'release', 'chatgpt', '--owner', 'lane3-fix']);
}
console.log('FIX RUN DONE');
