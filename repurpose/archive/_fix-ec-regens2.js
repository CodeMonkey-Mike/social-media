'use strict';
// QA round-2 fixes: regen the two coin images whose glyph surgery failed
// (8dd08cf4 companion-coin damage, 8bac49e6 seam + eyebrow damage).
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/mnede/Documents/Claude/social-media';
const LOCK = path.join(ROOT, 'video-creation', 'shorts', '_tooling', 'stage_lock.py');
const IMG = path.join(ROOT, 'schedule-tweets', 'images', 'x');

function run(cmd, args) {
  console.log('[' + new Date().toISOString() + '] RUN', cmd, args.join(' '));
  return spawnSync(cmd, args, { stdio: 'inherit', cwd: __dirname }).status;
}

const jobs = [
  {
    file: path.join(IMG, 'x-tweets-8dd08cf4-calls-miss-downside.png'),
    list: path.join(__dirname, '_genlist-ec-fix2-8dd08cf4.json'),
    item: {
      image_id: '8dd08cf4', slug: 'calls-miss-downside',
      ref: ROOT + '/schedule-tweets/images/reference/LAB.png',
      prompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality ' +
        'render. A proud anthropomorphized coin character bearing the logo shown in the attached ' +
        'reference image, standing tall on a winners podium, watching a bright rocket trail arc far ' +
        'beyond a small measuring stick target planted on a lower step, while a second smaller ' +
        'cheerful companion coin character applauds beside the podium. Only the large hero coin ' +
        'carries the reference logo. The smaller companion coin is COMPLETELY PLAIN: an unmarked ' +
        'coin face with only cartoon eyes, eyebrows and a cheering open-mouthed smile, and no ' +
        'symbol, logo, glyph or marking of any kind anywhere on it. Deep navy near-black ' +
        'background. Teal and warm gold rim light. Triumphant, vindicated mood. No text or words ' +
        'anywhere in the image.',
    },
  },
  {
    file: path.join(IMG, 'x-tweets-8bac49e6-tendies-funny-stupid.png'),
    list: path.join(__dirname, '_genlist-ec-fix2-8bac49e6.json'),
    item: {
      image_id: '8bac49e6', slug: 'tendies-funny-stupid',
      prompt: 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality ' +
        'render. A goofy, joyfully laughing cartoon meme coin character wearing a tiny party hat ' +
        'standing center stage in a bright neon lime-green spotlight with confetti falling around ' +
        'it, while a lineup of dull identical gray serious-faced coin characters stands in shadow ' +
        'behind it. The lime-green spotlight glow is vivid, approx RGB 204,255,0. The laughing ' +
        'coin\'s face is completely plain apart from its cartoon eyes, eyebrows and huge laughing ' +
        'mouth: no symbol, no logo, no glyph, no lettering or marking of any kind anywhere on the ' +
        'coin. Deep navy near-black background. Dramatic cinematic rim lighting. Playful, absurd, ' +
        'celebratory mood. No text or words anywhere in the image.',
    },
  },
];

if (run('python', [LOCK, 'acquire', 'chatgpt', '--owner', 'lane3-fix2', '--timeout-min', '120']) !== 0) {
  console.log('LOCK ACQUIRE FAILED'); process.exit(1);
}
let ok = 0;
try {
  for (const j of jobs) {
    fs.writeFileSync(j.list, JSON.stringify([j.item], null, 2));
    if (fs.existsSync(j.file)) { fs.unlinkSync(j.file); console.log('deleted', path.basename(j.file)); }
    const rc = run('node', ['gen-images.js', '--list=' + j.list, '--prefix=x-tweets']);
    const landed = fs.existsSync(j.file);
    console.log((rc === 0 && landed ? 'REGEN OK ' : 'REGEN FAILED ') + path.basename(j.file));
    if (rc === 0 && landed) ok++;
  }
} finally {
  run('python', [LOCK, 'release', 'chatgpt', '--owner', 'lane3-fix2']);
}
console.log('FIX2 RUN DONE ok=' + ok + '/2');
