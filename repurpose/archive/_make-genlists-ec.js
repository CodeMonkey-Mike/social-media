'use strict';
// Builds the 18 single-item genlist files for batch early-crash + the sequential runner.
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const REF = 'C:/Users/mnede/Documents/Claude/social-media/schedule-tweets/images/reference';
const CAR = REF + '/carousels';

const pixar = (scene, mood, ratio) =>
  `Pixar-style 3D animated CGI illustration, ${ratio} aspect ratio, film-quality render. ${scene} ` +
  `Deep navy near-black background. Dramatic cinematic rim lighting. ${mood} mood. ` +
  `No text or words anywhere in the image.`;

const v1 = (counter, headline, extra) =>
  `Bold crypto news graphic, 1:1 square. Match the layout, typography, color, and overall styling ` +
  `of the attached reference image. Near-black background, dramatic lighting, bold all-caps white ` +
  `and neon green typography; the neon green is RGB 58,244,66, never yellow-green or chartreuse. ` +
  `Small white all-caps counter label top-left: '${counter}', exactly once, and no other counter ` +
  `badge anywhere. Headline text: ${headline}. ${extra} No em dashes anywhere; use colons. No human faces.`;

const v2 = (counter, title, accent, boxLabel, boxBody, extra) =>
  `Editorial carousel slide, 1:1 square. Match the layout, typography, color, and overall styling ` +
  `of the attached reference image. Very dark near-black background with subtle texture. Top-left ` +
  `small teal all-caps label: '${counter}'. Large bold white title: '${title}'. Below, a teal ` +
  `accent line: '${accent}'. At the bottom a dark rounded box with teal label '${boxLabel}' and ` +
  `white body text: '${boxBody}'. Clean minimal layout, no dramatic effects, no human faces. ` +
  `No em dashes anywhere; use colons.${extra ? ' ' + extra : ''}`;

const items = [
  // ── X tweets (1:1) ──
  { prefix: 'x-tweets', image_id: 'cab451e8', slug: 'jobs-negative-print',
    prompt: pixar(
      "A shuffling crowd of cartoon zombie characters in tattered gray suits crossing a dark misty market square, all fixated on a large glowing blank calendar page floating ahead of them, while behind them one small confident anthropomorphized golden Bitcoin coin character with little arms and legs quietly walks the opposite direction with a knowing smile.",
      'Ominous but playful', '1:1 square') },
  { prefix: 'x-tweets', image_id: '10387a07', slug: 'akita-inu-3b-precedent',
    prompt: pixar(
      "A triumphant anthropomorphized Shiba-Inu-style dog coin character with tiny arms planting a flag on the summit of a giant glowing mountain of golden coins, tiny cartoon traders celebrating far below at the base, and in the night sky above, the faint colossal glowing outline of an even taller mountain looming as a promise. Warm gold glow on the mountain, bright neon lime-green accent glow on the horizon.",
      'Epic triumphant', '1:1 square') },
  { prefix: 'x-tweets', image_id: '8dd08cf4', slug: 'calls-miss-downside',
    ref: REF + '/LAB.png',
    prompt: pixar(
      "A proud anthropomorphized coin character bearing the logo shown in the attached reference image, standing tall on a winners' podium, watching a bright rocket trail arc far beyond a small measuring stick target planted on a lower step, while a second smaller cheerful companion coin character applauds beside the podium. Teal and warm gold rim light.",
      'Triumphant, vindicated', '1:1 square') },
  { prefix: 'x-tweets', image_id: '8bac49e6', slug: 'tendies-funny-stupid',
    prompt: pixar(
      "A goofy, joyfully laughing cartoon meme coin character wearing a tiny party hat standing center stage in a bright neon lime-green spotlight with confetti falling around it, while a lineup of dull identical gray serious-faced coin characters stands in shadow behind it. The lime-green spotlight glow is vivid, approx RGB 204,255,0.",
      'Playful, absurd, celebratory', '1:1 square') },
  { prefix: 'x-tweets', image_id: '118377a2', slug: 'endure-the-pain',
    prompt: pixar(
      "A small determined anthropomorphized coin character with weary but resolute eyes climbing out of dark storm rubble toward a horizon where warm golden sunrise light breaks through parting storm clouds, the character slightly battered but smiling, one fist raised. Storm blues transitioning to warm gold at the horizon.",
      'Hopeful, triumphant after hardship', '1:1 square') },
  { prefix: 'x-tweets', image_id: '27d73129', slug: 'october-turns-green',
    prompt: pixar(
      "A long line of sleeping cartoon bears in nightcaps camped with little tents and folding chairs in front of a giant closed bank vault door beneath an autumn tree dropping orange leaves, while far behind them in the night sky, unnoticed, a small rocket quietly lifts off leaving a vivid green glowing trail. Cool moonlight blues with the vivid green rocket glow.",
      'Wry, sneaky', '1:1 square') },
  // ── IG 4:5 companions ──
  { prefix: 'ig-single', image_id: '118377a2', slug: 'endure-the-pain',
    prompt: pixar(
      "A small determined anthropomorphized coin character with weary but resolute eyes climbing out of dark storm rubble toward a horizon where warm golden sunrise light breaks through parting storm clouds, the character slightly battered but smiling, one fist raised. Storm blues transitioning to warm gold at the horizon.",
      'Hopeful, triumphant after hardship', '4:5 portrait') },
  { prefix: 'ig-single', image_id: '10387a07', slug: 'akita-inu-3b-precedent',
    prompt: pixar(
      "A triumphant anthropomorphized Shiba-Inu-style dog coin character with tiny arms planting a flag on the summit of a giant glowing mountain of golden coins, tiny cartoon traders celebrating far below at the base, and in the night sky above, the faint colossal glowing outline of an even taller mountain looming as a promise. Warm gold glow on the mountain, bright neon lime-green accent glow on the horizon.",
      'Epic triumphant', '4:5 portrait') },
  // ── Carousel A: V1, ALL pinned to the one clean exemplar ──
  { prefix: 'yt-posts', image_id: '88a84f3d', slug: '01-hook', ref: CAR + '/version1/yt-posts-828eee71-01-hook.png',
    prompt: v1('1 OF 5', "large 'PAYROLLS JUST WENT NEGATIVE' with a smaller subline 'MINUS 23K VS PLUS 83K EXPECTED'",
      "Visual: a glowing red-tinted jobs data panel cracking down the middle.") },
  { prefix: 'yt-posts', image_id: 'f9dd85ce', slug: '02-paradox', ref: CAR + '/version1/yt-posts-828eee71-01-hook.png',
    prompt: v1('2 OF 5', "large 'LEAST LAYOFFS IN 2 YEARS AND NEGATIVE JOB GROWTH.' with a smaller subline 'BOTH ARE TRUE.'",
      "Visual: two opposing glowing data panels, one calm green, one alarmed red.") },
  { prefix: 'yt-posts', image_id: 'f1bca675', slug: '03-fed-cover', ref: CAR + '/version1/yt-posts-828eee71-01-hook.png',
    prompt: v1('3 OF 5', "large 'THE FED ISN'T HOLDING BECAUSE THINGS ARE GOOD'",
      "Visual: a dark marble central-bank building silhouette with dramatic under-lighting.") },
  { prefix: 'yt-posts', image_id: '8ef9dcc8', slug: '04-crowded-trade', ref: CAR + '/version1/yt-posts-828eee71-01-hook.png',
    prompt: v1('4 OF 5', "large 'EVERYONE EXPECTS AN OCTOBER BOTTOM.' with a smaller subline 'THAT'S WHY IT NEVER LANDS THERE.'",
      "Visual: a glowing calendar page with a crowd of identical arrows all pointing at it.") },
  { prefix: 'yt-posts', image_id: '827b80c9', slug: '05-question', ref: CAR + '/version1/yt-posts-828eee71-01-hook.png',
    prompt: v1('5 OF 5', "large 'WHEN DOES THE REAL BOTTOM PRINT?' with a smaller subline 'DROP YOUR CALL IN THE COMMENTS'",
      "Visual: a glowing neon green question mark over a dark price chart trough.") },
  // ── Carousel B: V2, role-matched exemplars ──
  { prefix: 'yt-posts', image_id: 'fd2a4a56', slug: '01-hook', ref: CAR + '/version2/yt-posts-9611992a-01-hook.png',
    prompt: v2('1 OF 5', 'A $3 billion Inu', 'ZERO EXCHANGE LISTINGS', 'MAY 2021',
      'Akita Inu peaks near $3B on pure retail mania') },
  { prefix: 'yt-posts', image_id: '4b11a3cf', slug: '02-no-listings', ref: CAR + '/version2/yt-posts-4a9a572c-02-btc-failure.png',
    prompt: v2('2 OF 5', 'No Binance. No Coinbase. No app.', 'THE WORST DISTRIBUTION IMAGINABLE', 'THE RECEIPT',
      'Retail fought through a DEX to buy it... and it still did nearly $3B') },
  { prefix: 'yt-posts', image_id: 'd2aeea29', slug: '03-robinhood-chain', ref: CAR + '/version2/yt-posts-44d02f9a-03-the-problem.png',
    prompt: v2('3 OF 5', '2026 changes the math', 'ROBINHOOD RUNS ITS OWN CHAIN', 'THE CATALYST',
      'Vlad lists memes directly in the app, one tap from millions') },
  { prefix: 'yt-posts', image_id: 'b788116d', slug: '04-opposite-access', ref: CAR + '/version2/yt-posts-074be0dc-04-the-solution.png',
    prompt: v2('4 OF 5', 'Same mania, opposite access', 'ONE-TAP NORMIE DISTRIBUTION', 'THE MATH',
      'Akita math with the handbrake off: 10 to 20 billion is possible') },
  { prefix: 'yt-posts', image_id: 'ba36d83a', slug: '05-question', ref: CAR + '/version2/yt-posts-81abb2d9-06-question.png',
    prompt: v2('5 OF 5', 'Does a Robinhood-chain meme crack $10B?', "OR IS AKITA'S $3B THE CEILING?", 'YOUR CALL',
      'Drop your answer in the comments') },
];

const files = [];
items.forEach((it, i) => {
  const f = path.join(HERE, `_genlist-ec-${String(i + 1).padStart(2, '0')}-${it.prefix}-${it.image_id}.json`);
  const entry = { image_id: it.image_id, slug: it.slug, prompt: it.prompt };
  if (it.ref) entry.ref = it.ref;
  fs.writeFileSync(f, JSON.stringify([entry], null, 2));
  files.push({ file: f, prefix: it.prefix });
});
fs.writeFileSync(path.join(HERE, '_run-genlist-ec.js'), `'use strict';
// Sequential runner for the early-crash Lane 3 image batch (18 single-item invocations).
const { spawnSync } = require('child_process');
const jobs = ${JSON.stringify(files, null, 1)};
let ok = 0, fail = 0;
for (const j of jobs) {
  console.log('[' + new Date().toISOString() + '] START ' + j.prefix + ' ' + j.file);
  const r = spawnSync('node', ['gen-images.js', '--list=' + j.file, '--prefix=' + j.prefix],
                      { cwd: __dirname, stdio: 'inherit', shell: false });
  if (r.status === 0) { ok++; console.log('[' + new Date().toISOString() + '] OK ' + j.file); }
  else { fail++; console.log('[' + new Date().toISOString() + '] FAIL(' + r.status + ') ' + j.file); }
}
console.log('BATCH DONE ok=' + ok + ' fail=' + fail);
`);
console.log('wrote ' + files.length + ' genlist files + runner _run-genlist-ec.js');
