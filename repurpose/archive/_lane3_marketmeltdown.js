// Lane 3 writer for the market-meltdown livestream.
// Appends tweets / IG / polls / YT posts / threads to schedule-tweets/data/*.json
// and emits 4 image-gen manifests under repurpose/_mm-items/ for gen-images.js.
// Run: node repurpose/_lane3_marketmeltdown.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'schedule-tweets', 'data');
const REF  = (v, f) => path.join(ROOT, 'schedule-tweets', 'images', 'reference', 'carousels', v, f);
const ITEMS_DIR = path.join(__dirname, '_mm-items');
fs.mkdirSync(ITEMS_DIR, { recursive: true });

const now = new Date().toISOString();
const SRC = 'transcripts/market-meltdown LOW BPS VERTICAL/market-meltdown LOW BPS VERTICAL_plain.txt';
const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const save = (f, d) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2));
const cc = (s) => [...s].length;
const warn = [];
const checkTweet = (label, text) => { const n = cc(text); if (n > 280) warn.push(`${label}: ${n}/280 OVER`); return n; };

// ---------- IMAGE IDS ----------
const ID = {
  t1:'2d8c4408', t2:'88389efd', t3:'1386992f', t4:'ce41b536', t5:'20978548', t6:'0fcf9231',
  // yt post 1 carousel (v2)
  p1s1:'6909477a', p1s2:'7a2bc4b7', p1s3:'5c332fe3', p1s4:'0e37d1a9', p1s5:'76383b94',
  // yt post 2 carousel (v1)
  p2s1:'3a72964b', p2s2:'20c28aed', p2s3:'f566205a', p2s4:'7c9a01ee',
};
const xPath  = (id, slug) => `schedule-tweets/images/x/x-tweets-${id}-${slug}.png`;
const igPath = (id, slug) => `schedule-tweets/images/ig/ig-single-${id}-${slug}.png`;
const ytPath = (id, slug) => `schedule-tweets/images/yt/yt-posts-${id}-${slug}.png`;

// ---------- PROMPTS ----------
// Carousel version templates (reference exemplar always attached via `ref`)
function V1(headline, visual) {
  return `Bold crypto news graphic, near-black background, dramatic lighting, bold all-caps white and neon green typography. No human faces. 1:1 square. Headline text reads: "${headline}". Visual: ${visual}. Match the layout, typography, color, and overall styling of the attached reference image.`;
}
function V2(label, title, insight, boxLabel, detail) {
  return `Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Top-left small teal all-caps label: "${label}". Large bold white title: "${title}". Below, a teal accent line: "${insight}". At the bottom a dark rounded box with teal label "${boxLabel}" and white body text: "${detail}". Clean minimal layout, no dramatic effects, no human faces. Match the layout, typography, color, and overall styling of the attached reference image.`;
}
const KAS_COIN = 'a glowing teal Kaspa coin character showing the backwards mirrored-K Kaspa logo, greenish-cyan glow';
const PROMPTS = {
  // X tweet 1:1 (Pixar / cinematic, no text)
  'kaspa-excavator': `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A cheerful man with bright green eyes happily handing over the keys of a yellow excavator in exchange for ${KAS_COIN} that beams in his hands; the excavator sits in the background. Deep navy near-black background. Dramatic cinematic teal rim lighting. Triumphant, playful mood. No text or words anywhere in the image.`,
  'kaspa-refused-to-break': `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. ${KAS_COIN}, standing firm and confident with arms crossed on a cracking stone ledge while dull grey coins tumble off into a dark chasm below. Deep navy near-black background. Dramatic teal rim lighting, faint gold accents on the falling coins. Tense but heroic mood. No text or words anywhere in the image.`,
  'tao-10k-token': `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A confident glowing Bittensor TAO coin character with the tau symbol riding a rising rocket built from interconnected glowing neural-network nodes, climbing toward a distant glowing peak. Deep navy near-black background with subtle circuit patterns. Dramatic cinematic blue and teal rim lighting. Ambitious, futuristic, triumphant mood. No text or words anywhere in the image.`,
  'saylor-cascade': `Cinematic photorealistic 3D render, 1:1 square aspect ratio. A sharp suited corporate titan calmly catching a glowing golden Bitcoin coin at the foot of a steep downward chart-shaped cliff, while panicked smaller coin characters flee upward. He is composed and predatory-calm. Dark atmospheric near-black void with a single dramatic gold spotlight, cool blue shadows, gold accent glow on the Bitcoin. Ominous, clever mood. No text or words anywhere in the image.`,
  'kaspa-quantity-pizza': `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. ${KAS_COIN}, sitting proudly at a table holding two pizza boxes like a modern pizza-day legend, while a small gold Bitcoin coin character looks on enviously. Deep navy near-black background. Warm pizza glow blended with teal rim lighting. Playful, iconic, nostalgic mood. No text or words anywhere in the image.`,
  'pengu-exploded': `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A cute chubby joyful cartoon penguin character (Pudgy Penguins style) blasting off on a small rocket out of a stormy grey bear market, leaving dull falling coins behind. Deep navy near-black background, teal and icy-blue accents. Dramatic rim lighting. Excited, victorious mood. No text or words anywhere in the image.`,
  // IG 4:5 companions (same subject, only ratio changes)
  'ig-kaspa-excavator': `Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. A cheerful man with bright green eyes happily handing over the keys of a yellow excavator in exchange for ${KAS_COIN} that beams in his hands; the excavator sits in the background. Deep navy near-black background. Dramatic cinematic teal rim lighting. Triumphant, playful mood. No text or words anywhere in the image.`,
  'ig-kaspa-refused-to-break': `Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. ${KAS_COIN}, standing firm and confident with arms crossed on a cracking stone ledge while dull grey coins tumble off into a dark chasm below. Deep navy near-black background. Dramatic teal rim lighting, faint gold accents on the falling coins. Tense but heroic mood. No text or words anywhere in the image.`,
  'ig-kaspa-quantity-pizza': `Pixar-style 3D animated CGI illustration, 4:5 aspect ratio, film-quality render. ${KAS_COIN}, sitting proudly at a table holding two pizza boxes like a modern pizza-day legend, while a small gold Bitcoin coin character looks on enviously. Deep navy near-black background. Warm pizza glow blended with teal rim lighting. Playful, iconic, nostalgic mood. No text or words anywhere in the image.`,
};

// ===================== 1) X TWEETS =====================
const T = [
  { id: ID.t1, slug: 'kaspa-excavator', ig: true,
    hook: 'I sold my excavator to buy more $KAS at 11 cents.',
    tweet: 'I sold my excavator to buy more $KAS at 11 cents.\n\nEveryone thought I lost it.\n\nLast week everything bled and $KAS just refused to follow.\n\nI am still buying every dip under 3 cents.\n\n#kaspa' },
  { id: ID.t2, slug: 'kaspa-refused-to-break', ig: true,
    hook: 'Most of my bag tagged its February lows last week.',
    tweet: 'Most of my bag tagged its February lows last week.\n\n$KAS didn\'t even come close.\n\nThe weak names broke to fresh lows. Kaspa barely cracked and never gave me the cheaper entry I wanted.\n\n#kaspa' },
  { id: ID.t3, slug: 'tao-10k-token', ig: false,
    hook: '$TAO at 10k a token is not a meme to me.',
    tweet: '$TAO at 10k a token is not a meme to me.\n\nAt an AI-driven cycle top, who cares if you got in at 207 or 160?\n\nNobody owns the inference layer. The harder everyone races to control AI compute, the more $TAO is worth.\n\n#bittensor' },
  { id: ID.t4, slug: 'saylor-cascade', ig: false,
    hook: 'Everyone panicked when Saylor trimmed last week.',
    tweet: 'Everyone panicked when Saylor trimmed last week.\n\nThe way I read it: he sold a sliver, a fraction of a percent, right as we cracked a 116 day channel.\n\nThe market cascaded on the headline. Then he bought 110 million near the lows.\n\n#bitcoin' },
  { id: ID.t5, slug: 'kaspa-quantity-pizza', ig: true,
    hook: 'One day 100,000 $KAS is going to sound like 10,000 $BTC for two pizzas.',
    tweet: 'One day 100,000 $KAS is going to sound like 10,000 $BTC for two pizzas. 😎\n\n#kaspa' },
  { id: ID.t6, slug: 'pengu-exploded', ig: false,
    hook: '$PENGU launched into the Trump pump and exploded; that is what real VC backing and a cult community look like in a bear.',
    tweet: '$PENGU launched into the Trump pump and exploded; that is what real VC backing and a cult community look like in a bear. 🐧\n\nFollow: @pudgypenguins' },
];

const xt = load('x-tweets.json');
const xItems = [];
for (const t of T) {
  const n = checkTweet('tweet ' + t.slug, t.tweet);
  xt.tweets.push({
    tweet: t.tweet, hook: t.hook, status: 'pending', posted_at: null, url: null,
    views: null, views_captured_at: null,
    image_id: t.id, image_path: xPath(t.id, t.slug), char_count: n,
  });
  xItems.push({ image_id: t.id, slug: t.slug, prompt: PROMPTS[t.slug] });
}
save('x-tweets.json', xt);

// ===================== 2) IG SINGLE (Kaspa-only companions) =====================
const ig = load('ig-single-image.json');
const KTAGS = ['#kaspa','#kas','#krc20','#proofofwork','#fairlaunch','#crypto','#cryptocurrency','#bitcoin','#btc','#altcoins','#blockchain','#cryptoinvesting','#cryptotrading'];
const IGPOSTS = {
  'kaspa-excavator': "I sold my excavator to buy more $KAS at 11 cents.\n\nEveryone thought I lost it.\n\nLast week the whole market bled and Kaspa just refused to follow it down. It is the one coin in my bag that keeps proving why I went all in.\n\nI am still buying every dip under 3 cents.\n\nSave this for the next time someone tells you conviction does not pay.",
  'kaspa-refused-to-break': "Most of my bag tagged its February lows last week.\n\n$KAS didn't even come close.\n\nThe weak names broke down to fresh lows. Kaspa barely cracked and never handed me the cheaper entry I was waiting for. Strength is easy to spot when everything else is red.\n\nTag someone who is still sleeping on Kaspa.",
  'kaspa-quantity-pizza': "One day, 100,000 $KAS is going to sound like 10,000 $BTC for two pizzas.\n\nFair launch, no premine, real scarcity. The people quietly accumulating down here are going to be the pizza-day legends of the next cycle.\n\nSave this. 😎",
};
const igItems = [];
for (const t of T.filter(x => x.ig)) {
  const caption = IGPOSTS[t.slug];
  ig.posts.push({
    id: `ig-2026-06-12-${t.slug}`, caption, hook: t.hook, hashtags: KTAGS,
    hashtag_placement: 'caption_end', image_id: t.id, image_path: igPath(t.id, t.slug),
    aspect_ratio: '4:5', source_post: t.hook, status: 'pending', created_at: now,
    posted_at: null, post_url: null, likes: null, comments: null,
    engagement_captured_at: null, capture_engagement_after_days: 7,
  });
  igItems.push({ image_id: t.id, slug: t.slug, prompt: PROMPTS['ig-' + t.slug] });
}
save('ig-single-image.json', ig);

// ===================== 5) YT POSTS (+carousel images[]) =====================
const ytp = load('yt-posts.json');
const POST1_ID = 'yt-post-2026-06-12-bear-bottoming-without-crash';
const POST2_ID = 'yt-post-2026-06-12-coins-im-stacking';

const post1Body =
`Bitcoin is down more than 50% and the four-year cycle zombies are already calling for 32k.

I think they are about to miss the bottom completely. Here is why.

Go back to the top. Every real cycle top in history went fully parabolic. 2017 did it. 2021 did it. This time? Bitcoin tagged 126k in October and rolled over. It never even cleared the average power law line. It did not look like a blow-off top because it was not one.

Here is the logic nobody wants to sit with: if the top was not a real parabolic top, then the bottom does not get to be a real 80% capitulation either. You do not skip the pain on the way up and then collect all of it on the way down. The market is more symmetrical than that.

And look at what is happening under the hood. These bear markets keep getting shallower. Volatility across every asset is dampening because institutions are in the book now. We are already hitting metrics that historically only print near a bear-market bottom: the share of supply held underwater just passed the share held in profit, which has marked the lows before. Long-term holders are quietly starting to accumulate again.

Could it bleed for a while? Sure. We could chop sideways all summer. A real black swan, an FTX-style blow up, could tag 52k. But 40k? 32k? That needs a catastrophe, not a calendar.

The four-year cycle crowd is so anchored to October that they are going to wait for a bottom that already happened in front of them. I shed my four-year cycle belief in Q2 2025. The driver is macro liquidity now, not a four-year clock.

So I am not buying the doom. I am stacking.

If you had to bet your own money right now, where does Bitcoin go first from here: 52k or 80k? Drop your number in the comments, I read them all.

If this reframed the bottom for you, hit like and subscribe so you are early on the next one.`;

const post2Body =
`Everyone checked out. I am stacking.

While the four-year cycle crowd waits for a bottom that may never come the way they think, here is exactly what I am buying in the red and why.

Kaspa first, always. I sold my excavator to buy more $KAS at 11 cents and people thought I lost my mind. Last week the entire market bled and Kaspa refused to follow it down. It barely cracked and never gave me the cheaper entry I was waiting for. That is the whole tell: the strongest thing in your bag is the thing that will not break when everything else does. Fair launch, no premine, real scarcity. When the market finally runs, that is when the real multipliers on Kaspa show up.

Then Bittensor. $TAO is the same setup, it just refuses to go down. At an AI-driven cycle top I genuinely think $TAO can be 10k a token. So who cares if you got in at 207 or 160? Nobody owns the inference layer. The harder governments and corporations race to control AI compute, the more a neutral layer nobody controls is worth. $TAO is the AI side of the same coin that Kaspa is on the money side.

My approach in a market like this is boring on purpose: DCA. If you can put in 200 a week, just keep buying the names with real conviction and let the long run do the work. Nothing here is financial advice, it is only what I am doing.

What I am NOT doing is chasing a brand new meme that bought five centralized exchange listings in a bear market. That is how you get slow-rugged. Honest builders launch when a rally is starting, not into the worst tape of the year.

Which one are you stacking hardest right now: $KAS or $TAO? Tell me in the comments.

If you want to be early instead of crawling back in at the top, hit like and subscribe.`;

ytp.posts.push({
  id: POST1_ID, topic: 'This bear is bottoming without the 80% crash',
  source_transcript: SRC, variation_label: 'A + CTA1', body_style: 'contrarian macro thesis',
  cta_target: 'follow_x', created_at: now, status: 'pending', posted_at: null, post_url: null,
  body: post1Body,
  engagement_question: 'If you had to bet your own money right now, where does Bitcoin go first from here: 52k or 80k?',
  char_count: cc(post1Body),
  images: [
    { seq:1, image_id:ID.p1s1, image_path:ytPath(ID.p1s1,'01-hook'),            slide_text:'Bitcoin is down 50%. The bottom is closer than the zombies think.' },
    { seq:2, image_id:ID.p1s2, image_path:ytPath(ID.p1s2,'02-no-parabola'),     slide_text:'This top never went parabolic. It tagged 126K and rolled over.' },
    { seq:3, image_id:ID.p1s3, image_path:ytPath(ID.p1s3,'03-symmetry'),        slide_text:'No real top means no real 80% bottom. The cycle is symmetrical.' },
    { seq:4, image_id:ID.p1s4, image_path:ytPath(ID.p1s4,'04-supply-underwater'),slide_text:'Supply underwater just passed supply in profit. That marks lows.' },
    { seq:5, image_id:ID.p1s5, image_path:ytPath(ID.p1s5,'05-question'),         slide_text:'52K or 80K first? Where does Bitcoin go from here?' },
  ],
});
ytp.posts.push({
  id: POST2_ID, topic: 'The coins I am stacking through the pain',
  source_transcript: SRC, variation_label: 'B + CTA2', body_style: 'project conviction',
  cta_target: 'follow_x', created_at: now, status: 'pending', posted_at: null, post_url: null,
  body: post2Body,
  engagement_question: 'Which one are you stacking hardest right now: $KAS or $TAO?',
  char_count: cc(post2Body),
  images: [
    { seq:1, image_id:ID.p2s1, image_path:ytPath(ID.p2s1,'01-hook'),         slide_text:'Everyone checked out. I am stacking the dip.' },
    { seq:2, image_id:ID.p2s2, image_path:ytPath(ID.p2s2,'02-kaspa-refused'),slide_text:'Kaspa refused to break when the whole market bled.' },
    { seq:3, image_id:ID.p2s3, image_path:ytPath(ID.p2s3,'03-tao-10k'),       slide_text:'TAO at 10K a token. Nobody owns the inference layer.' },
    { seq:4, image_id:ID.p2s4, image_path:ytPath(ID.p2s4,'04-question'),      slide_text:'KAS or TAO: which are you stacking hardest?' },
  ],
});
save('yt-posts.json', ytp);

// carousel manifests (with role-matched version references)
const yt1Items = [
  { image_id:ID.p1s1, slug:'01-hook',             ref:REF('version2','yt-posts-9611992a-01-hook.png'),       prompt:V2('1 OF 5','BOTTOM IS CLOSER THAN YOU THINK','Bitcoin is down 50% and the zombies are calling 32k','THE SETUP','This top was not parabolic, so the bottom will not be a full 80% crash') },
  { image_id:ID.p1s2, slug:'02-no-parabola',      ref:REF('version2','yt-posts-4a9a572c-02-btc-failure.png'),prompt:V2('2 OF 5','THIS TOP NEVER WENT PARABOLIC','It tagged 126K in October and rolled over','POWER LAW','It never even cleared the average power law line') },
  { image_id:ID.p1s3, slug:'03-symmetry',         ref:REF('version2','yt-posts-44d02f9a-03-the-problem.png'),prompt:V2('3 OF 5','NO REAL TOP, NO REAL BOTTOM','You do not skip the pain up and collect it all down','SYMMETRY','A muted top means a muted bottom, not a 32k capitulation') },
  { image_id:ID.p1s4, slug:'04-supply-underwater',ref:REF('version2','yt-posts-074be0dc-04-the-solution.png'),prompt:V2('4 OF 5','THE BOTTOM SIGNAL IS HERE','Supply underwater just passed supply in profit','HISTORY','That ratio has marked bear-market lows before') },
  { image_id:ID.p1s5, slug:'05-question',         ref:REF('version2','yt-posts-81abb2d9-06-question.png'),   prompt:V2('5 OF 5','52K OR 80K FIRST?','Where does Bitcoin go from here','YOUR CALL','Drop your number in the comments') },
];
const yt2Items = [
  { image_id:ID.p2s1, slug:'01-hook',          ref:REF('version1','yt-posts-828eee71-01-hook.png'),        prompt:V1("EVERYONE CHECKED OUT. I AM STACKING THE DIP.","glowing teal Kaspa coin with the backwards mirrored-K logo standing firm while dull grey coins fall around it") },
  { image_id:ID.p2s2, slug:'02-kaspa-refused', ref:REF('version1','yt-posts-89869680-02-btc-failure.png'), prompt:V1("KASPA REFUSED TO BREAK WHEN THE MARKET BLED","a strong teal Kaspa coin rooted on a cracking ledge, neon green up-trend accent, dark red broken coins below") },
  { image_id:ID.p2s3, slug:'03-tao-10k',       ref:REF('version1','yt-posts-6f54e3d5-03-the-problem.png'), prompt:V1("TAO 10K A TOKEN. NOBODY OWNS THE INFERENCE LAYER.","a glowing Bittensor TAO coin with the tau symbol rising on a neural-network rocket, neon green data nodes") },
  { image_id:ID.p2s4, slug:'04-question',      ref:REF('version1','yt-posts-9e20b9b1-06-question.png'),    prompt:V1("KAS OR TAO: WHICH ARE YOU STACKING HARDEST?","a teal Kaspa coin and a glowing TAO coin facing off, neon green VS accent between them") },
];
fs.writeFileSync(path.join(ITEMS_DIR, 'x-items.json'),  JSON.stringify(xItems, null, 2));
fs.writeFileSync(path.join(ITEMS_DIR, 'ig-items.json'), JSON.stringify(igItems, null, 2));
fs.writeFileSync(path.join(ITEMS_DIR, 'yt1-items.json'),JSON.stringify(yt1Items, null, 2));
fs.writeFileSync(path.join(ITEMS_DIR, 'yt2-items.json'),JSON.stringify(yt2Items, null, 2));

// ===================== 3) POLLS =====================
// Poll A: Kaspa  -> YT + X.   Poll B: 4-year cycle -> YT only (fails X Kaspa/TON/TAO filter)
const xpolls = load('x-polls.json');
xpolls.polls.push({
  id: 'poll-2026-06-12-kaspa-dca', topic: 'Kaspa DCA vs waiting for sub 2.7c', source_transcript: SRC,
  tweet_text: 'I have been waiting to buy more $KAS under 2.7 cents. It refuses to go there.\n\nDo you DCA Kaspa right here, or hold out for the cheaper entry that might never come?\n\n#kaspa',
  hook: 'I have been waiting to buy more $KAS under 2.7 cents. It refuses to go there.',
  options: ['DCA now, every week', 'Wait for sub 2.7c', 'Already loaded up'],
  duration: '1d', created_at: now, status: 'pending', posted_at: null, poll_url: null,
  results: null, results_captured_at: null,
});
save('x-polls.json', xpolls);

const ytpolls = load('yt-text-polls.json');
ytpolls.polls.push({
  id: 'yt-text-poll-2026-06-12-kaspa-dca', topic: 'Kaspa DCA vs waiting for sub 2.7c',
  source_post: POST2_ID, source_transcript: SRC,
  question_text: 'I keep waiting to add more $KAS under 2.7 cents and it just refuses to go there. Every red week it holds while the weak names break down.\n\nSo what is the actual move on Kaspa right now: keep stacking on a schedule, or hold your dry powder for a deeper flush that might never come?',
  hook: 'I keep waiting to add more $KAS under 2.7 cents and it just refuses to go there.',
  options: ['DCA every week, price be damned', 'Hold out for sub 2.7 cents', 'I am already fully loaded'],
  capture_results_after_days: 7, created_at: now, status: 'pending', posted_at: null, post_url: null,
  results: null, results_captured_at: null,
});
ytpolls.polls.push({
  id: 'yt-text-poll-2026-06-12-four-year-cycle', topic: 'Is the four-year cycle still real?',
  source_post: POST1_ID, source_transcript: SRC,
  question_text: 'Bitcoin is down 50 plus percent and the four-year cycle crowd is dead sure the bottom lands in October like clockwork.\n\nBut this top never went parabolic the way every real cycle top does. So I have to ask:\n\nIs the four-year cycle still real, or is it dead and just running on muscle memory?',
  hook: 'Bitcoin is down 50 plus percent and the four-year cycle crowd is dead sure the bottom lands in October like clockwork.',
  options: ['Still real, respect the cycle', 'Dead, it is macro liquidity now', 'Real but weaker every time'],
  capture_results_after_days: 7, created_at: now, status: 'pending', posted_at: null, post_url: null,
  results: null, results_captured_at: null,
});
save('yt-text-polls.json', ytpolls);

// ===================== 6) THREADS (from the 2 YT posts) =====================
const thr = load('x-threads.json');
function mkThread(id, topic, label, tweets) {
  const out = tweets.map((tx, i) => {
    const isCta = i === tweets.length - 1;
    const n = checkTweet(`${id} t${i+1}`, tx);
    const o = { position: i+1, text: tx, hook: i===0 ? tweets[0].split('\n')[0] : null,
      char_count: n, posted_url: null, views: null, views_captured_at: null };
    if (isCta) o.is_cta = true;
    return o;
  });
  thr.threads.push({ id, topic, source_transcript: SRC, variation_label: label,
    created_at: now, status: 'pending', posted_at: null, thread_root_url: null, tweets: out });
}
mkThread('thread-2026-06-12-bottom-without-crash', 'This bear is bottoming without the 80% crash', 'A', [
  'Bitcoin is down 50% and the four-year cycle zombies are already calling for 32k.\n\nThey are about to miss the bottom completely.\n\nHere is the part nobody wants to sit with.',
  'Every real cycle top went fully parabolic. 2017 did it. 2021 did it.\n\nThis time Bitcoin tagged 126k in October and rolled over. It never even cleared the average power law line.\n\nThat was not a blow-off top.',
  'So here is the logic: if the top was not a real parabolic top, the bottom does not get to be a real 80% capitulation either.\n\nYou do not skip the pain on the way up and then collect all of it on the way down.',
  'Under the hood, these bears keep getting shallower.\n\nVolatility is dampening because institutions are in the book now. The share of supply held underwater just passed the share in profit, which has marked the lows before.',
  'Could we chop all summer? Sure. A real FTX-style black swan could tag 52k.\n\nBut 40k or 32k needs a catastrophe, not a calendar.\n\nI shed my four-year cycle belief in Q2 2025. The driver is macro liquidity now.',
  'The cycle crowd is so anchored to October they will wait for a bottom that already happened in front of them.\n\nI am not buying the doom. I am stacking.',
  'If this reframed the bottom for you,\n\nFollow me for macro x crypto that ignores the four-year cycle echo chamber.\n\n🧠',
]);
mkThread('thread-2026-06-12-coins-im-stacking', 'The coins I am stacking through the pain', 'B', [
  'I sold my excavator to buy more $KAS at 11 cents.\n\nEveryone thought I lost it.\n\nLast week proved exactly why I did it.',
  'The whole market bled and Kaspa refused to follow it down. It barely cracked and never gave me the cheaper entry I wanted.\n\nThe strongest thing in your bag is the one that will not break when everything else does.',
  'Why $KAS: fair launch, no premine, real scarcity.\n\nIt may not move much this year. But when the market finally runs, that is when the real multipliers on this one show up. The cycle top is where it pays.',
  'The other name I keep buying: $TAO.\n\nSame setup, it just refuses to go down. At an AI-driven cycle top I think it can be 10k a token. Nobody owns the inference layer, and everyone is racing to control AI compute.',
  'My approach is boring on purpose: DCA.\n\n200 a week into real conviction beats waiting for a perfect entry that never prints. Not financial advice, just what I do.\n\nWhat I avoid: new memes buying five exchange listings in a bear. That is a slow rug.',
  'Everyone else checked out and will crawl back in at the top.\n\nI am stacking $KAS and $TAO in the red, and I am happy to.',
  'If you want to be early instead of late,\n\nFollow me for the conviction plays I am actually buying.\n\n😎',
]);
save('x-threads.json', thr);

// ---------- PROMPTS (defined after use via hoisting workaround) ----------
console.log('Lane 3 content written.');
console.log('Tweets:', T.length, '| IG:', igItems.length, '| YT posts: 2 | Polls: X1 YT2 | Threads: 2');
if (warn.length) { console.log('\n!!! CHAR WARNINGS:'); warn.forEach(w => console.log('  ', w)); }
else console.log('All tweets/thread tweets within 280.');
console.log('\nManifests written to', ITEMS_DIR);
