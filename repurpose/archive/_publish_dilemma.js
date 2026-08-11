// Append the 3 dilemma shorts to shorts.json per PUBLISH-SHORTS.md schema.
const fs = require('fs');
const P = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\shorts.json';
const SRC = '4-year cycle dilemma LOW BPS VERTICAL';
const LINK = 'Disclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/';

const items = [
  { id: 'dil-20260607-jobs-broke-btc', clip: 'so-good-it-was-bad-punch', dur: 22.72,
    title: 'The Jobs Report That Broke Bitcoin',
    hook: '172,000 jobs when they expected 85,000',
    caption: 'The economy ran so hot the market read it as a rate-hike threat and dumped. Bitcoin just tagged its 200-week SMA for the first time this cycle.',
    tags: ['Bitcoin', 'macro', 'jobsreport', 'BTC', 'crypto'] },
  { id: 'dil-20260607-cycle-not-magic', clip: 'four-year-cycle-not-magic', dur: 29.55,
    title: 'The Four-Year Cycle Zombies Think They Were Right',
    hook: 'people keep telling me the four-year cycle zombies were right',
    caption: 'We are in a crypto winter, sure. I called that back in August. But there is no magic clock, just macro liquidity.',
    tags: ['fouryearcycle', 'Bitcoin', 'cryptowinter', 'macro', 'crypto'] },
  { id: 'dil-20260607-kaspa-3-wrong', clip: 'kaspa-to-3-boy-was-i-wrong', dur: 94.02,
    title: 'I Thought Kaspa Would Hit $3. Boy Was I Wrong.',
    hook: 'I bought Kaspa at 11 cents thinking it would hit $3 by 2025',
    caption: 'Bought Kaspa at 11 cents dreaming of $3 by 2025. Wrong on the timing, never on the asset. I called a red November while everyone else called a parabolic top.',
    tags: ['Kaspa', 'KAS', 'fouryearcycle', 'altcoins', 'crypto'] },
];

const plat = (override) => ({ status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null, caption_override: override });
function entry(it) {
  const ov = `${it.caption}\n\n${LINK}`;
  return {
    id: it.id, slug: 'dilemma', source_livestream: SRC, source_clip: it.clip,
    video_path: `shorts/dilemma/${it.clip}.mp4`, thumbnail_path: null,
    duration_seconds: it.dur, width: 1080, height: 1920,
    title: it.title, hook: it.hook, caption: it.caption, tags: it.tags,
    platforms: {
      yt_shorts: plat(ov), ig_reels: plat(null), x: plat(null), tiktok: plat(null),
      facebook: plat(null), rumble: plat(ov), bitchute: plat(ov),
    },
  };
}

const d = JSON.parse(fs.readFileSync(P, 'utf8'));
let added = 0;
for (const it of items) {
  if (d.shorts.some(s => s.id === it.id)) { console.log('exists, skip', it.id); continue; }
  d.shorts.push(entry(it)); added++;
}
fs.writeFileSync(P, JSON.stringify(d, null, 2));
const dash = items.some(i => (i.title + i.caption + i.hook).includes('—'));
console.log(`appended ${added}; shorts now ${d.shorts.length}; em-dash: ${dash}`);
items.forEach(i => console.log(` - ${i.id}  "${i.title}"`));
