// Lane 3 repurpose writer for the 'better-coins' batch.
// Appends drafted content to all schedule-tweets/data/*.json files and emits image-gen items.json.
// Topics (Kaspa-weighted, fact-checked 2026-06-29): Kaspa Toccata (June 30 hard fork),
// Kaspa whales accumulating, $TAO + decentralized AI (US AI export controls), 4yr-cycle-dead, 1992-not-2000.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const DATA = path.join(REPO, 'schedule-tweets', 'data');
const REF = path.join(REPO, 'schedule-tweets', 'images', 'reference', 'carousels');
const SCRATCH = 'C:\\Users\\mnede\\AppData\\Local\\Temp\\claude\\C--Users-mnede-Documents-Claude-social-media\\c2d639fa-1a49-4aa5-80e9-1d4c510728b6\\scratchpad';
const NOW = '2026-06-29T15:00:00Z';
const TRANSCRIPT = 'transcripts/code monkeys call better coins LOW BPS VERTICAL/code monkeys call better coins LOW BPS VERTICAL_plain.txt';
const id8 = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8);
const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf-8'));
const save = (f, j) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(j, null, 2) + '\n');

// ---------- image ids ----------
const img = {
  t1: id8(), t2: id8(), t3: id8(), t4: id8(), o1: id8(), o2: id8(),
};
// carousel slide ids (5 per post)
const yp1ids = [id8(), id8(), id8(), id8(), id8()];
const yp2ids = [id8(), id8(), id8(), id8(), id8()];

// ======================================================================
// A) X TWEETS (4 long + 2 one-liner) -> x-tweets.json
// ======================================================================
const tweets = [
  { key: 'kaspa-toccata-programmable', image_id: img.t1,
    hook: 'Tomorrow $KAS stops being just fast money.',
    tweet: `Tomorrow $KAS stops being just fast money.\n\nThe Toccata hard fork goes live June 30: native covenants, tokens, and zero knowledge proofs on a Proof of Work chain.\n\nProgrammable PoW. Nobody else has it.\n\n#kaspa #kas` },
  { key: 'kaspa-whales-accumulating', image_id: img.t2,
    hook: 'Retail is dumping $KAS at 2.8 cents. So who is buying it all?',
    tweet: `Retail is dumping $KAS at 2.8 cents. So who is buying it all?\n\n20 to 30 whale wallets are quietly growing their bags while everyone else panics.\n\nYou do not accumulate like that for nothing...\n\n#kaspa #kas` },
  { key: 'tao-decentralized-ai', image_id: img.t3,
    hook: "The US just restricted public access to Anthropic's Fable 5 and Mythos 5.",
    tweet: `The US just restricted public access to Anthropic's Fable 5 and Mythos 5. OpenAI's GPT 5.6 is locked to a vetted few.\n\nThe open era of frontier AI is over. Governments decide who gets intelligence now.\n\nThat is the entire bull case for $TAO.\n\n#bittensor #tao` },
  { key: 'four-year-cycle-zombies', image_id: img.t4,
    hook: 'The same people who promised a blow off top in November are now promising a bottom in October.',
    tweet: `The same people who promised a blow off top in November are now promising a bottom in October.\n\nSame four year cycle zombies. Same magic chart. Zero new evidence.\n\nI shed that belief in Q2 last year. They will get there...\n\n#bitcoin #crypto` },
  // one-liners (image-first)
  { key: 'kaspa-toccata-under-1b', image_id: img.o1,
    hook: '$KAS turns into a programmable Proof of Work chain tomorrow, and it is still sitting under a 1 billion dollar market cap. 😎',
    tweet: `$KAS turns into a programmable Proof of Work chain tomorrow, and it is still sitting under a 1 billion dollar market cap. 😎` },
  { key: 'tao-like-bitcoin-200', image_id: img.o2,
    hook: "If $TAO ever touches Bitcoin's old all time high price, then buying it today is like buying $BTC at 200 dollars.",
    tweet: `If $TAO ever touches Bitcoin's old all time high price, then buying it today is like buying $BTC at 200 dollars.` },
];
const xt = load('x-tweets.json');
const existingIds = new Set(xt.tweets.map(t => t.image_id).filter(Boolean));
for (const t of tweets) {
  if (existingIds.has(t.image_id)) throw new Error('DUPLICATE image_id ' + t.image_id);
  if (t.tweet.includes('—')) throw new Error('EM DASH in tweet ' + t.key);
  if (t.tweet.length > 280) throw new Error('OVER 280 (' + t.tweet.length + ') ' + t.key);
  xt.tweets.push({
    tweet: t.tweet, hook: t.hook, status: 'pending', posted_at: null, url: null,
    views: null, views_captured_at: null,
    image_id: t.image_id, image_path: `schedule-tweets/images/x/x-tweets-${t.image_id}-${t.key}.png`,
    char_count: t.tweet.length,
  });
  existingIds.add(t.image_id);
}
save('x-tweets.json', xt);
console.log('x-tweets: +' + tweets.length + ' (chars: ' + tweets.map(t => t.tweet.length).join(',') + ')');

// ======================================================================
// B) IG single-image companions (4:5) for the 3 KASPA tweets -> ig-single-image.json
// ======================================================================
const igPosts = [
  { src: tweets[0], slug: 'kaspa-toccata-programmable', image_id: img.t1,
    caption: `Tomorrow, Kaspa stops being just fast money.\n\nThe Toccata hard fork activates June 30 and it changes what $KAS actually is: native covenants, native tokens, and zero knowledge proofs, all on a Proof of Work base layer.\n\nProgrammable Proof of Work. Bitcoiners have argued about covenants for years and still do not have them. Every chain that does have programmability gave up Proof of Work to get it. Kaspa is about to have both at the same time.\n\nStill sitting under a 1 billion dollar market cap while it happens.\n\nSave this for the next time someone tells you Kaspa can only send coins.`,
    hashtags: ['#kaspa', '#kas', '#krc20', '#proofofwork', '#fairlaunch', '#crypto', '#cryptocurrency', '#bitcoin', '#altcoins', '#blockchain', '#cryptoinvesting', '#cryptonews'] },
  { src: tweets[1], slug: 'kaspa-whales-accumulating', image_id: img.t2,
    caption: `Retail is dumping $KAS at 2.8 cents. So who is buying it all?\n\nWhile everyone else panic sells, a small group of 20 to 30 whale wallets just keeps quietly growing their bags. The price is down, the network just crossed 95 percent of its coins mined, and the biggest holders are accumulating into the fear.\n\nYou do not accumulate like that for nothing. Patient Kaspa holders understand exactly what is being built.\n\nBuilding the best takes time.`,
    hashtags: ['#kaspa', '#kas', '#krc20', '#proofofwork', '#fairlaunch', '#crypto', '#cryptocurrency', '#bitcoin', '#altcoins', '#blockchain', '#cryptotrading', '#cryptoinvesting'] },
  { src: tweets[4], slug: 'kaspa-toccata-under-1b', image_id: img.o1,
    caption: `$KAS turns into a programmable Proof of Work chain tomorrow, and it is still sitting under a 1 billion dollar market cap. 😎\n\nThe Toccata hard fork goes live June 30: native covenants, native tokens, and zero knowledge proof verification on the base layer. Fast, fair launched, no premine, and now programmable.\n\nTag someone who still thinks Kaspa is just a payments coin.`,
    hashtags: ['#kaspa', '#kas', '#krc20', '#proofofwork', '#fairlaunch', '#crypto', '#cryptocurrency', '#bitcoin', '#altcoins', '#blockchain', '#cryptoinvesting', '#cryptonews'] },
];
const ig = load('ig-single-image.json');
for (const p of igPosts) {
  if (p.caption.includes('—')) throw new Error('EM DASH in ig ' + p.slug);
  ig.posts.push({
    id: `ig-${p.slug}-${p.image_id}`, caption: p.caption, hook: p.src.hook, hashtags: p.hashtags,
    hashtag_placement: 'caption_end', image_id: p.image_id,
    image_path: `schedule-tweets/images/ig/ig-single-${p.image_id}-${p.slug}.png`,
    aspect_ratio: '4:5', source_post: p.src.hook, status: 'pending', created_at: NOW,
    posted_at: null, post_url: null, likes: null, comments: null,
    engagement_captured_at: null, capture_engagement_after_days: 7,
  });
}
save('ig-single-image.json', ig);
console.log('ig-single: +' + igPosts.length + ' (kaspa companions, 4:5)');

// ======================================================================
// C) POLLS -> yt-text-polls.json (2) + x-polls.json (1, kaspa only)
// ======================================================================
const ytp = load('yt-text-polls.json');
// Poll 1: 4-year cycle (YT only; fails X poll topic filter - not kaspa/tao/ton)
ytp.polls.push({
  id: 'yt-text-poll-2026-06-29-four-year-cycle-dead', topic: 'Is the 4-year cycle dead', source_post: null,
  source_transcript: TRANSCRIPT,
  question_text: `Be honest with yourself for a second.\n\nThe same people who swore a 2017 style blow off top was coming in November are now swearing a bottom is coming in October. Same four year cycle. Same magic chart. Bitcoin printed a new all time high BEFORE the halving, then a bear market in the post halving year, and never even made a real cycle top. Every rule of the four year cycle broke, one by one.\n\nSo I want to know where you actually stand:`,
  hook: 'Be honest with yourself for a second.',
  options: ['Dead. Macro and liquidity run the market now', 'Alive. The October bottom is still coming', 'On the fence, but the cracks are showing'],
  capture_results_after_days: 7, created_at: NOW, status: 'pending', posted_at: null, post_url: null,
  results: null, results_captured_at: null,
});
// Poll 2: Kaspa Toccata (YT + X)
const toccataYtQ = `Kaspa flips a switch tomorrow.\n\nThe Toccata hard fork activates June 30 and turns Kaspa from a pure payments coin into a programmable Proof of Work Layer 1: native covenants, native tokens, and zero knowledge proof verification on the base layer. No other chain has fast, fair launched Proof of Work AND real programmability at the same time.\n\nThe price has not moved much. So is the market sleeping on this, or is it right to shrug?`;
ytp.polls.push({
  id: 'yt-text-poll-2026-06-29-kaspa-toccata', topic: 'Kaspa Toccata hard fork', source_post: 'yt-post-2026-06-29-kaspa-toccata',
  source_transcript: TRANSCRIPT, question_text: toccataYtQ, hook: 'Kaspa flips a switch tomorrow.',
  options: ['Yes, this is the real catalyst', 'No, the price says nobody cares', 'I need to see real apps first'],
  capture_results_after_days: 7, created_at: NOW, status: 'pending', posted_at: null, post_url: null,
  results: null, results_captured_at: null,
});
save('yt-text-polls.json', ytp);
console.log('yt-text-polls: +2 (4yr-cycle [YT only], kaspa-toccata [also X])');

const xp = load('x-polls.json');
xp.polls.push({
  id: 'poll-2026-06-29-kaspa-toccata', topic: 'Kaspa Toccata hard fork', source_transcript: TRANSCRIPT,
  tweet_text: `Kaspa flips a switch tomorrow.\n\nThe Toccata hard fork turns $KAS into a programmable Proof of Work chain: covenants, tokens, and ZK on the base layer. No other chain has fast fair launched PoW and real programmability at once.\n\nPrice has not moved. Is the market sleeping on it?`,
  hook: 'Kaspa flips a switch tomorrow.',
  options: ['Yes, the catalyst', 'No, nobody cares yet', 'Show me real apps'],
  duration: '1d', created_at: NOW, status: 'pending', posted_at: null, poll_url: null,
  results: null, results_captured_at: null,
});
for (const p of xp.polls.slice(-1)) {
  if (p.tweet_text.length > 280) throw new Error('X poll over 280: ' + p.tweet_text.length);
  for (const o of p.options) if (o.length > 25) throw new Error('X poll option >25: ' + o);
}
save('x-polls.json', xp);
console.log('x-polls: +1 (kaspa-toccata; 4yr-cycle skipped - X poll filter allows only KAS/TAO/TON)');

// ======================================================================
// D) YT POSTS (2, ~2100 chars) + carousel image arrays -> yt-posts.json
// ======================================================================
const yp1Body = `Tomorrow, Kaspa stops being just fast money.\n\nFor years the knock on Kaspa was simple: yeah, it is the fastest Proof of Work chain alive, but all you can do is send coins. No smart contracts. No tokens. No programmability. Just clean, fair launched money.\n\nThat ends June 30.\n\nThe Toccata hard fork activates on mainnet, and it changes what Kaspa actually is. Native covenants. Native tokens. Transaction introspection. Zero knowledge proof verification baked into the base layer. In plain English: you can finally put rules on your coins, issue assets, and build real applications directly on a Proof of Work Layer 1. Not on a sidechain tacked on top. On the base chain itself.\n\nThink about why that matters. Bitcoiners have argued about covenants for years and still do not have them. Every smart contract chain that does have programmability gave up Proof of Work to get it. Kaspa is about to have both at the same time: fast, fair launched, no premine, AND programmable.\n\nAnd here is the part that gets me. It is still sitting under an 800 million dollar market cap, ranked in the 90s. While retail panic sells at under three cents, the network just quietly crossed 95 percent of its coins mined and is about to flip into a programmable chain. The upgrade is shipping into fear, not hype. That is usually when the real accumulation happens.\n\nI am not telling you it moons tomorrow. Hard forks are not magic, and the chart does not care about your feelings on day one. But the thing that was always missing from the Kaspa thesis, real programmability, is here. The story changes the moment the use cases start showing up.\n\nSo here is my question for you: once Kaspa can do tokens, covenants, and ZK on Proof of Work, what is the actual argument left for the chains that gave up PoW to get those features? Drop it below, I read every comment.\n\nIf you want to be early on the chains that actually ship, hit like and subscribe. I would rather be a year early than a day late.`;
const yp1Q = 'Once Kaspa can do tokens, covenants, and ZK on Proof of Work, what is the actual argument left for the chains that gave up PoW to get those features?';

const yp2Body = `The government just started deciding who is allowed to use the most powerful AI on earth.\n\nThis month the US restricted public access to Anthropic's Fable 5 and Mythos 5 models. Anthropic disabled them. Then access to Mythos was handed back to about a hundred vetted American organizations, and OpenAI was allowed to preview GPT 5.6 only to a small group of approved partners. Fable 5 is still completely offline.\n\nSit with that for a second. The single most important technology of our lifetime, and the on switch now lives in Washington. The Wild West era of just releasing frontier models to the public is over. From here, the most capable intelligence gets gated, licensed, and handed out to whoever the state trusts.\n\nThis is exactly why decentralized AI stops being a nice idea and becomes a necessity.\n\nBittensor is a network where intelligence is produced by thousands of independent miners competing to provide the best models and inference, with no company and no government holding a kill switch. You cannot send an export control order to a permissionless network. There is no single office to call, no single server to unplug. It is the same principle that makes Bitcoin and Kaspa valuable: a neutral layer that nobody owns becomes more valuable every time someone races to control the centralized version.\n\nHere is the framing that stuck with me. If the total crypto market one day rivals the global stock market, a network like Bittensor could carry a trillion dollar valuation. If $TAO ever reached the price Bitcoin hit at its all time high, buying it at today's price would be like buying Bitcoin at 200 dollars. I am not promising that. I am saying the asymmetry is real, and the news cycle is quietly making the case for it.\n\nSo I will put it to you straight: if governments can switch off the best centralized AI whenever they want, is decentralized AI inevitable, or is it wishful thinking? Tell me below.\n\nIf you want the macro and crypto takes that connect these dots before everyone else does, hit like and subscribe.`;
const yp2Q = 'If governments can switch off the best centralized AI whenever they want, is decentralized AI inevitable, or is it wishful thinking?';

// carousel slide specs: [seq, slug, slide_text, refRole]
const yp1Slides = [
  [1, 'hook', 'KASPA STOPS BEING JUST FAST MONEY TOMORROW', path.join(REF, 'version1', 'yt-posts-828eee71-01-hook.png')],
  [2, 'toccata-live', 'JUNE 30: COVENANTS, TOKENS, AND ZK PROOFS GO LIVE', path.join(REF, 'version1', 'yt-posts-89869680-02-btc-failure.png')],
  [3, 'programmable-pow', 'PROGRAMMABLE PROOF OF WORK. NO OTHER CHAIN HAS IT', path.join(REF, 'version1', 'yt-posts-6f54e3d5-03-the-problem.png')],
  [4, 'still-cheap', 'STILL UNDER AN 800 MILLION DOLLAR MARKET CAP', path.join(REF, 'version1', 'yt-posts-b3c7f2a6-04-stacked-catalyst.png')],
  [5, 'question', 'WHAT IS LEFT FOR CHAINS THAT GAVE UP POW?', path.join(REF, 'version1', 'yt-posts-a2d6e9f5-05-question.png')],
];
const yp2Slides = [
  [1, 'hook', 'THE GOVERNMENT JUST STARTED SWITCHING OFF AI MODELS', path.join(REF, 'version2', 'yt-posts-9611992a-01-hook.png')],
  [2, 'models-gated', 'FABLE 5 OFFLINE. MYTHOS 5 GATED. GPT 5.6 LOCKED DOWN', path.join(REF, 'version2', 'yt-posts-4a9a572c-02-btc-failure.png')],
  [3, 'control-intelligence', 'WHOEVER CONTROLS COMPUTE NOW CONTROLS INTELLIGENCE', path.join(REF, 'version2', 'yt-posts-44d02f9a-03-the-problem.png')],
  [4, 'no-kill-switch', 'BITTENSOR IS THE AI LAYER NOBODY CAN SHUT OFF', path.join(REF, 'version2', 'yt-posts-074be0dc-04-the-solution.png')],
  [5, 'question', 'CAN DECENTRALIZED AI ACTUALLY BE STOPPED?', path.join(REF, 'version2', 'yt-posts-81abb2d9-06-question.png')],
];
function carouselImages(ids, slides) {
  return slides.map(([seq, slug, text], i) => ({
    seq, image_id: ids[i],
    image_path: `schedule-tweets/images/yt/yt-posts-${ids[i]}-${String(seq).padStart(2, '0')}-${slug}.png`,
    slide_text: text,
  }));
}
const yp = load('yt-posts.json');
for (const [body, q] of [[yp1Body, yp1Q], [yp2Body, yp2Q]]) if (body.includes('—')) throw new Error('EM DASH in yt body');
yp.posts.push({
  id: 'yt-post-2026-06-29-kaspa-toccata', topic: 'Kaspa Toccata hard fork', source_transcript: TRANSCRIPT,
  variation_label: 'catalyst body + early-mover cta', body_style: 'catalyst / news-flash', cta_target: 'subscribe_youtube',
  created_at: NOW, status: 'pending', posted_at: null, post_url: null, body: yp1Body,
  engagement_question: yp1Q, char_count: yp1Body.length, images: carouselImages(yp1ids, yp1Slides),
});
yp.posts.push({
  id: 'yt-post-2026-06-29-tao-decentralized-ai', topic: 'TAO and decentralized AI', source_transcript: TRANSCRIPT,
  variation_label: 'thesis body + early-dots cta', body_style: 'analytical / editorial', cta_target: 'subscribe_youtube',
  created_at: NOW, status: 'pending', posted_at: null, post_url: null, body: yp2Body,
  engagement_question: yp2Q, char_count: yp2Body.length, images: carouselImages(yp2ids, yp2Slides),
});
save('yt-posts.json', yp);
console.log('yt-posts: +2 (kaspa-toccata V1 carousel, tao-ai V2 carousel) chars: ' + yp1Body.length + ', ' + yp2Body.length);

// ======================================================================
// E) THREADS (2, from the 2 YT posts) -> x-threads.json
// ======================================================================
function mkThread(id, topic, label, arr) {
  const tweets = arr.map((text, i) => ({
    position: i + 1, text, hook: i === 0 ? text.split('\n')[0] : null,
    ...(i === arr.length - 1 ? { is_cta: true } : {}),
    char_count: text.length, posted_url: null, views: null, views_captured_at: null,
  }));
  for (const t of tweets) { if (t.text.includes('—')) throw new Error('EM DASH in thread ' + id); if (t.text.length > 280) throw new Error('thread tweet >280 (' + t.char_count + ') ' + id + ' pos ' + t.position); }
  return { id, topic, source_transcript: TRANSCRIPT, variation_label: label, created_at: NOW, status: 'pending', posted_at: null, thread_root_url: null, tweets };
}
const th1 = mkThread('thread-2026-06-29-kaspa-toccata', 'Kaspa Toccata hard fork', 'hook-and-thesis-first', [
  `Tomorrow Kaspa stops being just fast money.\n\nThe Toccata hard fork goes live June 30, and it quietly fixes the one thing every critic used against it.`,
  `For years the knock was simple. Fastest Proof of Work chain alive, but all you could do was send coins. No tokens. No contracts. Just clean, fair launched money.`,
  `Toccata changes what Kaspa is. Native covenants. Native tokens. Transaction introspection. Zero knowledge proof verification on the base layer. Real programmability on Proof of Work.`,
  `Bitcoiners have argued about covenants for years and still do not have them. Every chain that does gave up Proof of Work to get it. Kaspa is about to have both at once.`,
  `And it is shipping into fear. Under an 800 million dollar market cap, over 95 percent mined, retail panic selling under three cents. Upgrades that land in fear tend to age well.`,
  `If this changed how you see $KAS, follow me for macro and crypto takes that ignore the four year cycle echo chamber.\n\n🧠 + 😎`,
]);
const th2 = mkThread('thread-2026-06-29-tao-decentralized-ai', 'TAO and decentralized AI', 'stat-stack-and-conclusion', [
  `The US just started deciding who is allowed to use the most powerful AI on earth.\n\nAnd it is the clearest bull case for decentralized AI I have seen.`,
  `This month the government restricted public access to Anthropic's Fable 5 and Mythos 5. Anthropic disabled them. OpenAI could only preview GPT 5.6 to a few vetted partners.`,
  `The takeaway is bigger than any one model. The era of freely releasing frontier AI to the public is over. The best intelligence now gets gated and handed to whoever the state trusts.`,
  `You cannot send an export control order to a permissionless network. No single office to call. No server to unplug. That is what $TAO is: intelligence with no kill switch.`,
  `Same principle as Bitcoin and Kaspa. A neutral layer nobody owns gets more valuable every time someone races to control the centralized version. $TAO is that layer for AI.`,
  `If this connected some dots for you, follow me for the macro and crypto calls before the crowd catches on.\n\n🚀`,
]);
const xth = load('x-threads.json');
xth.threads.push(th1, th2);
save('x-threads.json', xth);
console.log('x-threads: +2 (kaspa-toccata 6 tweets, tao-ai 6 tweets)');

// ======================================================================
// F) image-gen items.json files
// ======================================================================
const xtItems = tweets.map(t => ({ image_id: t.image_id, slug: t.key, prompt: '' }));
// prompts (Pixar 3D, dark bg, dramatic light, no text). Kaspa = teal backwards-K. Mike = bright green eyes.
const P = {
  [img.t1]: `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A heroic teal-glowing Kaspa coin (showing the backwards-K / mirrored-K Kaspa logo) stepping out of a plain money vault into a futuristic glowing control room full of holographic gears, switches and circuit panels that it now commands. The coin has arms and an excited, determined expression. Deep navy near-black background. Dramatic cinematic teal rim lighting. Triumphant. No text or words anywhere in the image.`,
  [img.t2]: `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A few enormous calm whales made of glowing teal Kaspa coins (each showing the backwards-K Kaspa logo) quietly swallowing a stream of small teal coins underwater, while tiny panicked cartoon retail investors paddle away on the surface above. Deep navy near-black ocean background. Dramatic cinematic teal rim lighting, god rays from above. Ominous but powerful mood. No text or words anywhere in the image.`,
  [img.t3]: `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A glowing humanoid AI brain-robot locked inside a heavy government padlock cage, while outside the cage a bright network of many small interconnected glowing nodes (a decentralized Bittensor TAO network) thrives freely and cannot be caged. One confident free node character in the foreground. Deep navy near-black background. Dramatic cinematic blue and gold rim lighting. Tense, defiant. No text or words anywhere in the image.`,
  [img.t4]: `Cinematic photorealistic 3D render, 1:1 square aspect ratio. A horde of glassy-eyed cartoon zombies in business suits shuffling toward a giant glowing wall calendar flipped to October, mindlessly reaching for it, while a confident man with bright green eyes in a dark hoodie stands to the side shaking his head, arms crossed. A dim gold Bitcoin coin half-buried in the ground. Dark atmospheric storm-cloud background. Dramatic moonlight rim lighting with a cool blue accent glow. Ominous, satirical. No text or words anywhere in the image.`,
  [img.o1]: `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A small excited teal-glowing Kaspa coin character (showing the backwards-K / mirrored-K Kaspa logo) flexing one arm like a tiny bodybuilder while standing on a price-tag pedestal, a glowing futuristic city of circuits rising behind it. Deep navy near-black background. Dramatic cinematic teal rim lighting. Playful, confident. No text or words anywhere in the image.`,
  [img.o2]: `Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A glowing blue Bittensor TAO coin character and a small gold Bitcoin coin standing side by side at the bottom of a tall glowing ascending staircase that disappears into the clouds, the TAO coin looking up hopefully at the top. Deep navy near-black background. Dramatic cinematic blue and warm-gold rim lighting. Hopeful, aspirational. No text or words anywhere in the image.`,
};
for (const it of xtItems) it.prompt = P[it.image_id];
fs.writeFileSync(path.join(SCRATCH, 'items_x_tweets.json'), JSON.stringify(xtItems, null, 2));

// IG 4:5 (same prompts, 4:5) for the 3 kaspa ones
const igItems = igPosts.map(p => ({ image_id: p.image_id, slug: p.slug, prompt: P[p.image_id].replace(/1:1 square aspect ratio/g, '4:5 portrait aspect ratio') }));
fs.writeFileSync(path.join(SCRATCH, 'items_ig_single.json'), JSON.stringify(igItems, null, 2));

// YT carousel slides (version templates + reference exemplar)
const V1 = (txt) => `Bold crypto news graphic, near-black background, dramatic lighting, bold all-caps white and neon green typography, glowing crypto coin icons and a small chart/data panel accent. No human faces. 1:1 square. Match the layout, typography, color, and overall styling of the attached reference image. The single headline text on the slide reads exactly: "${txt}". No other text.`;
const V2 = (txt, n) => `Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Clean minimal Tom Bilyeu style layout, premium and analytical. Top-left small teal all-caps label "${n} OF 5". Large bold white all-caps headline reading exactly: "${txt}". A teal accent line and a dark rounded content box at the bottom. No dramatic effects, no human faces. Match the layout, typography, color, and overall styling of the attached reference image.`;
const ytItems = [];
yp1Slides.forEach(([seq, slug, text, ref], i) => ytItems.push({ image_id: yp1ids[i], slug: `${String(seq).padStart(2, '0')}-${slug}`, prompt: V1(text), ref }));
yp2Slides.forEach(([seq, slug, text, ref], i) => ytItems.push({ image_id: yp2ids[i], slug: `${String(seq).padStart(2, '0')}-${slug}`, prompt: V2(text, seq), ref }));
fs.writeFileSync(path.join(SCRATCH, 'items_yt_posts.json'), JSON.stringify(ytItems, null, 2));

console.log('\nitems.json written: items_x_tweets (' + xtItems.length + '), items_ig_single (' + igItems.length + '), items_yt_posts (' + ytItems.length + ')');
console.log('image_ids: tweets/oneliners=' + Object.values(img).join(',') + ' | yp1=' + yp1ids.join(',') + ' | yp2=' + yp2ids.join(','));
// verify refs exist
let missing = 0;
for (const it of ytItems) if (!fs.existsSync(it.ref)) { console.log('MISSING REF: ' + it.ref); missing++; }
console.log(missing ? (missing + ' MISSING REFS') : 'all carousel refs exist');
