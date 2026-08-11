'use strict';
// QA round-3 fix: full regen of V1 slide 4 (8ef9dcc8) — the calendar weekday strip keeps
// hallucinating pseudo-text; regen with an explicitly BLANK ruled header strip.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/mnede/Documents/Claude/social-media';
const LOCK = path.join(ROOT, 'video-creation', 'shorts', '_tooling', 'stage_lock.py');
const FILE = path.join(ROOT, 'schedule-tweets', 'images', 'yt', 'yt-posts-8ef9dcc8-04-crowded-trade.png');

function run(cmd, args) {
  console.log('[' + new Date().toISOString() + '] RUN', cmd, args.join(' '));
  return spawnSync(cmd, args, { stdio: 'inherit', cwd: __dirname }).status;
}

const glist = path.join(__dirname, '_genlist-ec-fix3-8ef9dcc8.json');
fs.writeFileSync(glist, JSON.stringify([{
  image_id: '8ef9dcc8', slug: '04-crowded-trade',
  ref: ROOT + '/schedule-tweets/images/reference/carousels/version1/yt-posts-828eee71-01-hook.png',
  prompt: "Bold crypto news graphic, 1:1 square. Match the layout, typography, color, and overall " +
    "styling of the attached reference image. Near-black background, dramatic lighting, bold " +
    "all-caps white and neon green typography; the neon green is RGB 58,244,66, never yellow-green " +
    "or chartreuse. Small white all-caps counter label top-left: '4 OF 5', exactly once, and no " +
    "other counter badge anywhere. Headline text: large 'EVERYONE EXPECTS AN OCTOBER BOTTOM.' with " +
    "a smaller subline 'THAT'S WHY IT NEVER LANDS THERE.'. Visual: a glowing desk calendar with " +
    "the word 'OCTOBER' on its black header, surrounded by a crowd of identical glowing green " +
    "arrows all pointing at it. The calendar page below the header is a plain empty ruled grid of " +
    "blank cells with one date circled in green: the weekday header strip is completely BLANK " +
    "ruled paper with absolutely no letters, no day abbreviations and no numbers anywhere on the " +
    "grid. The only text in the entire image is the counter, the two headline lines, and the word " +
    "'OCTOBER' on the calendar header. No em dashes anywhere; use colons. No human faces.",
}], null, 2));

if (run('python', [LOCK, 'acquire', 'chatgpt', '--owner', 'lane3-fix3', '--timeout-min', '120']) !== 0) {
  console.log('LOCK ACQUIRE FAILED'); process.exit(1);
}
try {
  if (fs.existsSync(FILE)) { fs.unlinkSync(FILE); console.log('deleted bad slide'); }
  const rc = run('node', ['gen-images.js', '--list=' + glist, '--prefix=yt-posts']);
  console.log(rc === 0 && fs.existsSync(FILE) ? 'REGEN OK' : 'REGEN FAILED(' + rc + ')');
} finally {
  run('python', [LOCK, 'release', 'chatgpt', '--owner', 'lane3-fix3']);
}
console.log('FIX3 RUN DONE');
