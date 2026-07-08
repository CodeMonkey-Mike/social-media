// Lane 3 (this-is-gonna-rip) - 3 Kaspa IG single-image companions (4:5), reuse each X tweet's image_id.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\ig-single-image.json';
const src = JSON.parse(fs.readFileSync(ROOT + '\\repurpose\\_rip_igsource.json', 'utf8'));
const TAGS = ["#kaspa","#kas","#krc20","#proofofwork","#fairlaunch","#crypto","#cryptocurrency","#bitcoin","#btc","#altcoins","#blockchain","#cryptoinvesting","#cryptotrading"];
const now = new Date().toISOString();

const captions = {
  'kaspa-energy-money': "Elon says money is just mass and energy.\n\nBitcoin is the closest thing we have ever had to energy backed money. It proved the one thing you cannot fake is energy.\n\nBut proving it and perfecting it are two different things. Kaspa is the same proof of work, just far more efficient: faster blocks, fair launch, no premine.\n\nSave this for the next time someone tells you Bitcoin is the final form. 😎",
  'kaspa-most-efficient': "What is the most efficient energy backed money ever built?\n\nNot Bitcoin. Ten minute blocks, seven transactions a second.\n\nKaspa. Blocks every second, GhostDAG, fair launch, no premine. Same proof of work, none of the bottleneck.\n\nSame sound money principles, built without the speed limit. Which one are you holding for the long game?",
  'bitcoin-proved-kaspa-improved': "Bitcoin proved it. Kaspa improved it.\n\nBitcoin proved money can be backed by energy and nothing else. Kaspa took that exact idea, the proof of work, the fair launch, the no premine, and made it faster and more efficient.\n\nA phrase the whole community can post. Tag a Kaspa holder who needs to see it.",
};

const data = JSON.parse(fs.readFileSync(P, 'utf8'));
const igGen = [];
let added = 0;
for (const s of src) {
  const caption = captions[s.slug];
  if (caption.includes('—')) { console.error('EM DASH in', s.slug); process.exit(1); }
  const ig_path = `schedule-tweets/images/ig/ig-single-${s.image_id}-${s.slug}.png`;
  data.posts.push({
    id: `ig-2026-06-15-${s.slug}`,
    caption,
    hook: s.hook,
    hashtags: TAGS,
    hashtag_placement: 'caption_end',
    image_id: s.image_id,
    image_path: ig_path,
    aspect_ratio: '4:5',
    source_post: s.hook,
    status: 'pending',
    created_at: now,
    posted_at: null,
    post_url: null,
    likes: null,
    comments: null,
    engagement_captured_at: null,
    capture_engagement_after_days: 7,
  });
  added++;
  igGen.push({ image_id: s.image_id, slug: s.slug, prompt: s.prompt + ' 4:5 portrait aspect ratio.', ref: ROOT + '\\schedule-tweets\\images\\reference\\kaspa-logo.png' });
}
fs.writeFileSync(P, JSON.stringify(data, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_rip_items_ig.json', JSON.stringify(igGen, null, 2));
console.log(`appended ${added} IG single-image posts; total now ${data.posts.length}`);
igGen.forEach(g => console.log('  ig 4:5 ->', g.slug, g.image_id));
