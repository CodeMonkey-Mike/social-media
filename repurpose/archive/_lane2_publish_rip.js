// Phase 8 publish: copy rendered shorts -> schedule-tweets/shorts/this-is-gonna-rip/ + append shorts.json
const fs = require('fs');
const path = require('path');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const OUT = path.join(ROOT, 'video-creation', 'remotion', 'out', 'this-is-gonna-rip');
const DEST = path.join(ROOT, 'schedule-tweets', 'shorts', 'this-is-gonna-rip');
const SHORTS = path.join(ROOT, 'schedule-tweets', 'data', 'shorts.json');
const LIVESTREAM = 'this is gonna rip LOW BPS VERTICAL';
const DISC = '\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/';
fs.mkdirSync(DEST, { recursive: true });

const clips = [
  { render: '1-kaspa-proved-improved.mp4', slug: 'kaspa-proved-improved', dur: 30.60,
    id: 'tigr-20260615-kaspa-proved-improved',
    title: 'Bitcoin proved money is energy. But it is not the most efficient version of it.',
    hook: 'Elon says money is just mass and energy.',
    caption: 'Elon says the future is not dollars, it is mass and energy. Bitcoin proved you cannot fake energy. But proving an idea and perfecting it are two different things. $KAS',
    tags: ['Kaspa', 'KAS', 'bitcoin', 'crypto', 'proofofwork'] },
  { render: '2-self-fulfilling-bear.mp4', slug: 'self-fulfilling-bear', dur: 77.07,
    id: 'tigr-20260615-self-fulfilling-bear',
    title: 'This bear market never had a reason to exist. So who actually caused it?',
    hook: 'Bitcoin whales stopped selling and started accumulating again.',
    caption: 'This bear never had a macro reason. Rates down, QE starting, jobs improving. The four-year cycle crowd dumped because they believed in a bear, and that belief is the only thing that caused it. Now the whales are buying again. $BTC',
    tags: ['bitcoin', 'BTC', 'fouryearcycle', 'crypto', 'macro'] },
  { render: '3-tao-decentralized-ai.mp4', slug: 'tao-decentralized-ai', dur: 17.10,
    id: 'tigr-20260615-tao-decentralized-ai',
    title: 'The government just flipped the off switch on the most powerful AI overnight.',
    hook: 'TAO is ripping. Decentralized AI is about to be a powerhouse.',
    caption: 'A government just ordered the most powerful AI model cut off from every foreign national overnight. Centralized AI has an off switch you do not control. That is the entire case for decentralized AI. $TAO',
    tags: ['bittensor', 'TAO', 'AI', 'crypto', 'decentralizedai'] },
];

function plat(caption, withLink) {
  const co = withLink ? caption + DISC : null;
  return { status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null, caption_override: co };
}

const data = JSON.parse(fs.readFileSync(SHORTS, 'utf8'));
const arr = data.shorts || data;
let added = 0;
for (const c of clips) {
  const src = path.join(OUT, c.render);
  if (!fs.existsSync(src)) { console.error('MISSING RENDER:', src); process.exit(1); }
  fs.copyFileSync(src, path.join(DEST, c.slug + '.mp4'));
  const blob = c.title + c.hook + c.caption;
  if (blob.includes('—')) { console.error('EM DASH in', c.id); process.exit(1); }
  arr.push({
    id: c.id, batch: 'this-is-gonna-rip', slug: 'this-is-gonna-rip',
    source_livestream: LIVESTREAM, source_clip: c.slug,
    video_path: `shorts/this-is-gonna-rip/${c.slug}.mp4`,
    thumbnail_path: null, duration_seconds: c.dur, width: 1080, height: 1920,
    title: c.title, hook: c.hook, caption: c.caption, tags: c.tags,
    platforms: {
      yt_shorts: plat(c.caption, true),
      ig_reels: plat(c.caption, false),
      x: plat(c.caption, false),
      tiktok: plat(c.caption, false),
      facebook: plat(c.caption, false),
      rumble: plat(c.caption, true),
      bitchute: plat(c.caption, true),
    },
  });
  added++;
  console.log('staged + queued:', c.slug);
}
fs.writeFileSync(SHORTS, JSON.stringify(data, null, 2));
console.log(`appended ${added} shorts; total now ${arr.length}`);
