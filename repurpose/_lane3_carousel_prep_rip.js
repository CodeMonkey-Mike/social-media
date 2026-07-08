// Lane 3 (this-is-gonna-rip) - carousel prep. Two YT posts -> slide plans + gen-items + images[] arrays.
// Kaspa post -> Version 1 (news-flash, high-energy tribal punch). TAO post -> Version 2 (editorial/analytical).
const fs = require('fs');
const crypto = require('crypto');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const YP = ROOT + '\\schedule-tweets\\data\\yt-posts.json';
const REFDIR = ROOT + '\\schedule-tweets\\images\\reference\\carousels';
const id8 = () => crypto.randomBytes(4).toString('hex');

const V1 = (text) => `Bold crypto news graphic, near-black background, dramatic lighting, bold all-caps white and neon green typography, glowing crypto coin icons. No human faces. 1:1 square. Match the layout, typography, color, and overall styling of the attached reference image. ${text}`;
const V2 = (title, insight, boxLabel, detail, n, total) => `Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Top-left small teal all-caps label: '${n} OF ${total}'. Large bold white title: '${title}'. Below, a teal accent line: '${insight}'. At the bottom a dark rounded box with teal label '${boxLabel}' and white body text: '${detail}'. Clean minimal layout, no dramatic effects, no human faces. Match the layout, typography, color, and overall styling of the attached reference image.`;

// ---- Carousel 1: Kaspa post, Version 1 ----
const c1ref = (f) => REFDIR + '\\version1\\' + f;
const c1 = {
  post_id: 'yt-post-2026-06-15-bitcoin-proved-kaspa-improved',
  prefix: 'yt-posts', version: 1,
  slides: [
    { short: 'hook', text: "BITCOIN PROVED IT. KASPA IMPROVED IT.",
      ref: c1ref('yt-posts-828eee71-01-hook.png'),
      prompt: V1("Headline in bold all-caps: 'BITCOIN PROVED IT' in white, 'KASPA IMPROVED IT' in neon green, stacked on two lines. A glowing teal Kaspa coin showing a backwards-K (mirrored capital K) next to a smaller dull orange Bitcoin coin. No other text.") },
    { short: 'elon-energy', text: "ELON: MONEY WILL BE MASS AND ENERGY",
      ref: c1ref('yt-posts-89869680-02-btc-failure.png'),
      prompt: V1("Headline in bold all-caps white with 'MASS AND ENERGY' emphasized in neon green: 'ELON SAYS MONEY WILL BE MASS AND ENERGY'. Subtext smaller: 'YOU CANNOT FAKE ENERGY'. A glowing energy/lightning motif. No other text.") },
    { short: 'btc-bottleneck', text: "BITCOIN: 10 MINUTE BLOCKS, 7 TX/SEC",
      ref: c1ref('yt-posts-6f54e3d5-03-the-problem.png'),
      prompt: V1("Headline bold all-caps white: 'BITCOIN PROVED THE IDEA'. Big neon green stat line: '10 MIN BLOCKS, 7 TX/SEC'. Small white subtext: 'INCREDIBLE FOR 2009, A BOTTLENECK NOW'. A dull orange Bitcoin coin. No other text.") },
    { short: 'kaspa-improved', text: "KASPA: A BLOCK EVERY SECOND. FAIR LAUNCH. NO PREMINE.",
      ref: c1ref('yt-posts-b3c7f2a6-04-stacked-catalyst.png'),
      prompt: V1("Headline bold all-caps white: 'KASPA IMPROVED IT'. Neon green stacked stats: 'A BLOCK EVERY SECOND', 'GHOSTDAG', 'FAIR LAUNCH, NO PREMINE'. A glowing teal Kaspa coin with a backwards-K (mirrored capital K). No other text.") },
    { short: 'question', text: "WHICH IS THE REAL ENERGY MONEY?",
      ref: c1ref('yt-posts-9e20b9b1-06-question.png'),
      prompt: V1("Large centered all-caps question in white with 'ENERGY MONEY' in neon green: 'WHICH IS THE REAL ENERGY MONEY?'. A glowing teal Kaspa coin and an orange Bitcoin coin facing off. No other text.") },
  ],
};

// ---- Carousel 2: TAO post, Version 2 ----
const c2ref = (f) => REFDIR + '\\version2\\' + f;
const c2 = {
  post_id: 'yt-post-2026-06-15-decentralized-ai-tao',
  prefix: 'yt-posts', version: 2,
  slides: [
    { short: 'hook', text: "THE GOVERNMENT JUST SWITCHED OFF THE MOST POWERFUL AI",
      ref: c2ref('yt-posts-9611992a-01-hook.png'),
      prompt: V2("The government just switched off the most powerful AI", "One order pulled a frontier model offline overnight", "WHAT HAPPENED", "The US ordered Anthropic to cut off Fable 5 and Mythos 5", 1, 5) },
    { short: 'locked-out', text: "ONE ORDER. EVERY FOREIGN NATIONAL LOCKED OUT.",
      ref: c2ref('yt-posts-4a9a572c-02-btc-failure.png'),
      prompt: V2("Every foreign national, locked out", "Not bad actors, not foreign governments, everyone", "THE SCOPE", "Inside or outside the US, including their own employees", 2, 5) },
    { short: 'off-switch', text: "CENTRALIZED AI HAS AN OFF SWITCH YOU DO NOT CONTROL",
      ref: c2ref('yt-posts-44d02f9a-03-the-problem.png'),
      prompt: V2("Centralized AI has an off switch", "And you are not the one holding it", "THE PROBLEM", "A government or a company can revoke your access without warning", 3, 5) },
    { short: 'tao-solution', text: "TAO: AN AI LAYER NOBODY OWNS, NOBODY CAN SWITCH OFF",
      ref: c2ref('yt-posts-074be0dc-04-the-solution.png'),
      prompt: V2("TAO: an AI layer nobody owns", "An open market for AI no single party controls", "THE SOLUTION", "Bittensor is the neutral inference layer that cannot be shut off", 4, 5) },
    { short: 'question', text: "DOES DECENTRALIZED AI BECOME INEVITABLE?",
      ref: c2ref('yt-posts-81abb2d9-06-question.png'),
      prompt: V2("Does decentralized AI become inevitable?", "When governments can flip the switch on centralized AI", "YOUR CALL", "Inevitable, or still a niche bet? Tell me in the comments", 5, 5) },
  ],
};

const data = JSON.parse(fs.readFileSync(YP, 'utf8'));
const genItems = [];
for (const car of [c1, c2]) {
  const post = data.posts.find(p => p.id === car.post_id);
  if (!post) { console.error('post not found:', car.post_id); process.exit(1); }
  if (post.images) { console.error('post already has images[]:', car.post_id); process.exit(1); }
  const images = [];
  car.slides.forEach((s, i) => {
    if (!fs.existsSync(s.ref)) { console.error('MISSING REF:', s.ref); process.exit(1); }
    const image_id = id8();
    const seq = String(i + 1).padStart(2, '0');
    const slug = `${seq}-${s.short}`;
    const image_path = `schedule-tweets/images/yt/yt-posts-${image_id}-${slug}.png`;
    images.push({ seq: i + 1, image_id, image_path, slide_text: s.text });
    genItems.push({ image_id, slug, prompt: s.prompt, ref: s.ref, _post: car.post_id, _version: car.version });
  });
  post.images = images;
}
fs.writeFileSync(YP, JSON.stringify(data, null, 2));
// split gen-items by version (each version uses a different exemplar style; run as one yt-posts batch is fine)
fs.writeFileSync(ROOT + '\\repurpose\\_rip_items_carousel.json', JSON.stringify(genItems.map(({_post,_version,...g})=>g), null, 2));
console.log(`carousel images planned: ${genItems.length} (c1 V1 Kaspa x${c1.slides.length}, c2 V2 TAO x${c2.slides.length})`);
console.log('images[] written onto both YT posts. gen-items -> _rip_items_carousel.json');
