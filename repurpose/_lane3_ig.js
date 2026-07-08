// Lane 3 — IG 4:5 companions for the Kaspa X-tweets. Same image_id as the tweet (per SKILL),
// separate 4:5 file in images/ig/. Append to ig-single-image.json + emit gen items.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const IGP = ROOT + '\\schedule-tweets\\data\\ig-single-image.json';
const src = JSON.parse(fs.readFileSync(ROOT + '\\repurpose\\_igsource.json', 'utf8'));

const HASHTAGS = ['#kaspa', '#kas', '#crypto', '#cryptocurrency', '#proofofwork', '#bitcoin', '#altcoins', '#blockchain', '#fairlaunch', '#cryptonews', '#ghostdag', '#investing'];

// IG-specific captions (richer than the tweet, no trailing hashtag line; hashtags live in array)
const CAPTIONS = {
  'kaspa-no-early-bag': "Who got the early bag in Kaspa?\n\nNobody.\n\nThe same machine that mined the first block mines it today. No founder pressed a button, no VC unlock, no premine. That is what a fair launch actually means, and it is why I keep stacking it.",
  'pow-cant-freeze-your-wallet': "There are only four coins I actually believe in: Kaspa, Bitcoin, Monero, Litecoin.\n\nAll proof of work. All fair. None of them can freeze your wallet. Proof-of-stake chains have a foundation that can be pressured to censor you. Decentralization is who can touch your money.",
  'kaspa-11-cents-to-3': "I bought Kaspa at 11 cents dreaming of $3 by 2025.\n\nWrong on the timing. Never on the asset. I shed the four-year cycle religion in Q2 2025; a lot of people are only realizing it now.",
};

const data = JSON.parse(fs.readFileSync(IGP, 'utf8'));
const genItems = [];
let added = 0;
for (const s of src) {
  const image_path = `schedule-tweets/images/ig/ig-single-${s.image_id}-${s.slug}.png`;
  const caption = CAPTIONS[s.slug];
  const entry = {
    id: `ig-2026-06-07-${s.slug}`,
    caption,
    hook: caption.split('\n')[0],
    hashtags: HASHTAGS,
    hashtag_placement: 'caption_end',
    image_id: s.image_id,
    image_path,
    aspect_ratio: '4:5',
    source_post: s.hook,
    status: 'pending',
    created_at: '2026-06-07T00:00:00Z',
    posted_at: null,
    post_url: null,
    likes: null,
    comments: null,
    engagement_captured_at: null,
    capture_engagement_after_days: 7,
  };
  data.posts.push(entry);
  added++;
  // 4:5 prompt = same scene, aspect swapped
  const prompt45 = s.prompt.replace('1:1 square.', '4:5 vertical portrait.');
  genItems.push({ image_id: s.image_id, slug: s.slug, prompt: prompt45,
    ref: s.slug.startsWith('kaspa-') ? 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\kaspa-logo.png' : undefined });
}
fs.writeFileSync(IGP, JSON.stringify(data, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_items_ig.json', JSON.stringify(genItems.map(g => { const o = { image_id: g.image_id, slug: g.slug, prompt: g.prompt }; if (g.ref) o.ref = g.ref; return o; }), null, 2));
console.log(`appended ${added} IG entries; total now ${data.posts.length}`);
console.log('em-dash in captions:', Object.values(CAPTIONS).some(c => c.includes('—')));
