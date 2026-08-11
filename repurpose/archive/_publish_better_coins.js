// Publish the better-coins shorts batch -> schedule-tweets/data/shorts.json (Phase 8).
// Copies remotion/out/better-coins/<n>-<slug>.mp4 -> schedule-tweets/shorts/better-coins/<n>-<slug>.mp4,
// appends 8 entries (open-loop titles, hashtag-free captions, link-split overrides).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const REPO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const OUT = path.join(REPO, 'video-creation', 'remotion', 'out', 'better-coins');
const DEST = path.join(REPO, 'schedule-tweets', 'shorts', 'better-coins');
const SHORTS = path.join(REPO, 'schedule-tweets', 'data', 'shorts.json');
const SRC_LS = 'code monkeys call better coins LOW BPS VERTICAL';
const DISC = '\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/';
const dur = (p) => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${p}"`).toString().trim());

// id, file(<n>-<slug>), source_clip, title, hook, caption, tags
const ITEMS = [
  { id: 'bc-20260629-learn-your-lesson', file: '1-didnt-you-learn-your-lesson', clip: 'didnt-you-learn-your-lesson',
    title: 'The same guys who missed the top are now calling the bottom',
    hook: "Didn't you learn your lesson?",
    caption: 'The four year cycle zombies who promised a blow off top in November are now promising a bottom in October. Same magic chart, zero new evidence. Danger, Will Robinson.',
    tags: ['4yearcycle', 'bitcoin', 'crypto', 'macro', 'kaspa'] },
  { id: 'bc-20260629-cycle-breakage', file: '2-four-year-cycle-breakage-stack', clip: 'four-year-cycle-breakage-stack',
    title: 'Every rule of the 4 year cycle just broke, one by one',
    hook: 'Breakage of the four year cycle.',
    caption: 'New all time high before the halving. A bear market in the post halving year. No cycle top, not even a mid cycle top. The four year cycle is dead, and the zombies still do not see it.',
    tags: ['4yearcycle', 'bitcoin', 'cryptocycle', 'macro', 'kaspa'] },
  { id: 'bc-20260629-gating-ai-tao', file: '3-tao-decentralizing-intelligence', clip: 'tao-decentralizing-intelligence',
    title: 'When governments start switching off AI models, where does the value go?',
    hook: 'Decentralizing intelligence with Bittensor.',
    caption: 'The government pulled Fable offline and locked GPT 5.6 down to a vetted few. The open era of frontier AI is over. That is the whole case for decentralized intelligence and $TAO.',
    tags: ['bittensor', 'tao', 'ai', 'decentralization', 'crypto'] },
  { id: 'bc-20260629-tao-like-200-btc', file: '4-buying-bitcoin-at-200', clip: 'buying-bitcoin-at-200',
    title: 'This could be like buying Bitcoin at 200 dollars',
    hook: "It's literally like buying Bitcoin at 200 dollars.",
    caption: 'If $TAO ever reaches the price Bitcoin hit at its all time high, buying it today is like buying Bitcoin at 200 dollars. $TAO and $KAS, the two biggest winners.',
    tags: ['bittensor', 'tao', 'bitcoin', 'crypto', 'kaspa'] },
  { id: 'bc-20260629-kaspa-whales', file: '5-kaspa-whales-accumulating', clip: 'kaspa-whales-accumulating',
    title: 'Retail is dumping Kaspa. So who is buying it all?',
    hook: "They're selling, but who's buying?",
    caption: 'Retail is exiting Kaspa while 20 to 30 whale wallets quietly grow their bags. They are preparing for something. Patient $KAS holders know exactly what.',
    tags: ['kaspa', 'kas', 'whales', 'crypto', 'accumulation'] },
  { id: 'bc-20260629-kaspa-shitcoin', file: '6-building-the-best-takes-time', clip: 'building-the-best-takes-time',
    title: 'Kaspa is a sh** coin?',
    hook: "They say Kaspa's a sh** coin.",
    caption: 'They call $KAS a sh** coin. That patient holder is going to be the one smiling. Building the best takes time.',
    tags: ['kaspa', 'kas', 'crypto', 'conviction', 'proofofwork'] },
  { id: 'bc-20260629-stop-waiting', file: '7-stop-waiting-buy-kaspa', clip: 'stop-waiting-buy-kaspa',
    title: "Stop waiting for a bottom you'll never see",
    hook: "You're never going to see that bottom.",
    caption: 'The people sitting on cash waiting for the perfect bottom just watch the price climb and miss it. At under three cents, are you really not going to buy $KAS because you want it a fraction cheaper?',
    tags: ['kaspa', 'kas', 'crypto', 'investing', 'dca'] },
  { id: 'bc-20260629-1992-not-2000', file: '8-the-1992-magnificent-crash', clip: 'the-1992-magnificent-crash',
    title: "We're at 1992, not 2000. The real crash is years away",
    hook: "We're at 1992, not 2000.",
    caption: 'The AI driven expansion is like the economy starting to run in 1992. It tops like the year 2000 dot com peak, then a magnificent crash. The expansion has not even started.',
    tags: ['macro', 'bitcoin', 'ai', 'crypto', 'powerlaw'] },
];

fs.mkdirSync(DEST, { recursive: true });
const j = JSON.parse(fs.readFileSync(SHORTS, 'utf8'));
const plat = (override) => ({ status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null, caption_override: override });
let added = 0;
for (const it of ITEMS) {
  const src = path.join(OUT, it.file + '.mp4');
  if (!fs.existsSync(src)) { console.log('MISSING RENDER, skipping:', it.file); continue; }
  for (const f of [it.title, it.hook, it.caption]) if (f.includes('—')) throw new Error('EM DASH in ' + it.id);
  const dest = path.join(DEST, it.file + '.mp4');
  fs.copyFileSync(src, dest);
  const d = dur(dest);
  const longform = it.caption + DISC;
  j.shorts.push({
    id: it.id, batch: 'better-coins', slug: it.clip, source_livestream: SRC_LS, source_clip: it.clip,
    video_path: `shorts/better-coins/${it.file}.mp4`, thumbnail_path: null,
    duration_seconds: Math.round(d * 100) / 100, width: 1080, height: 1920,
    title: it.title, hook: it.hook, related_longform_url: null, caption: it.caption, tags: it.tags,
    platforms: {
      yt_shorts: plat(longform), ig_reels: plat(null), x: plat(null), tiktok: plat(null),
      facebook: plat(null), rumble: plat(longform), bitchute: plat(longform),
    },
  });
  added++;
  console.log(`+ ${it.id}  (${d.toFixed(1)}s)  ${it.title}`);
}
fs.writeFileSync(SHORTS, JSON.stringify(j, null, 2) + '\n');
console.log(`\nshorts.json: +${added} entries -> ${j.shorts.length} total`);
