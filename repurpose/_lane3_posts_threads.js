// Lane 3 — 2 YT long posts (+carousel image entries) and 2 threads derived from them.
const fs = require('fs');
const crypto = require('crypto');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const YTPOSTS = ROOT + '\\schedule-tweets\\data\\yt-posts.json';
const XTHREADS = ROOT + '\\schedule-tweets\\data\\x-threads.json';
const TRANSCRIPT = 'video-creation/livestream-repurpose/transcripts/4-year cycle dilemma LOW BPS VERTICAL/4-year cycle dilemma LOW BPS VERTICAL_plain.txt';
const id8 = () => crypto.randomBytes(4).toString('hex');

// ---------------- YT POSTS ----------------
const y1body = `Everyone keeps telling me the four-year cycle zombies were right. They are not. Let me walk you through exactly what happened this week, because none of it was magic.

Start with the economy. Every jobs read this week was strong. ISM manufacturing employment came in better than prior. JOLTS job openings blew past expectations at 7.6 million. ADP private payrolls beat. Then the big one: nonfarm payrolls printed 172,000 when the market expected 85,000.

So why did everything sell off? Because the economy ran so hot the market decided it was bad news. A jobs number that strong, stacked on the inflation from these tariff moves, got read as a reason the Fed keeps rates higher for longer. Good news became the excuse to sell.

Then Michael Saylor sold 32 Bitcoin, about 0.0038% of his stack, to cover a preferred dividend. A rounding error. But it was enough to spook people out of a channel Bitcoin had held for 116 days. The chart crowd saw the break, called for lower, and pushed it lower. Bitcoin tagged its 200-week SMA for the first time this cycle, down 44% from the October top.

That is a crypto winter. I am not arguing otherwise. I called a crypto winter back in August. What I did not call was a 2025 cycle top, because I stopped believing in the magic clock in Q2 of last year. The four-year cycle is a story. Macro liquidity is the actual driver: M2, the Treasury account, a government shutdown pulling cash out of the system, Powell taking a December cut off the table.

Every move this week has an explanation that has nothing to do with a calendar. That is the whole point.

So here is my question for you: are you still positioning around the four-year cycle, or around liquidity? Tell me in the comments, and tell me why.

Subscribe if you want the macro read the cycle crowd refuses to give you.`;

const y2body = `Who got the early bag in Kaspa? Nobody. And once you understand why, you understand why I keep stacking it through a crypto winter.

There was no premine. No VC allocation. No founder who pressed a button and minted himself a war chest. The same kind of machine that mined the very first block is mining it today, and every coin came out of proof of work. That is what a fair launch actually means, and almost nothing else in this space can say it.

That matters more than people think, because it ties into the other thing I care about: who can touch your money. There are really only four coins I believe in. Kaspa, Bitcoin, Monero, Litecoin. All proof of work. All fair. None of them have a foundation that can be sued, pressured, or told to freeze your wallet.

Proof-of-stake chains do. There is an entity at the center. Years ago I got burned by a centralized predecessor to Bitcoin called e-gold, shut down because there was an organization to go after. The whole promise of decentralization is that there is no one to go after, and no one who can censor you. A chain with a foundation has not actually escaped that.

Then there is the tech. Kaspa does around 5,700 transactions per second on fair-launched proof of work. Bitcoin does about 7. When the payment layer finally has to be replaced, the question stops being which coin is loudest and becomes which one actually works.

Here is the long arc I am betting on: ETH flips BTC around 2030, the Bitcoin maxis refuse to sit at number two, they go looking for a proof-of-work fair-launched alternative, and they find Kaspa.

I bought mine at 11 cents dreaming of 3 dollars by 2025. Wrong on the timing. Never on the asset.

So tell me: what is the one coin you have the most conviction in, and could it survive its foundation being pressured? Drop it below.

Subscribe for the proof-of-work thesis nobody else will lay out.`;

const carousels = {
  'four-year-cycle-not-magic': ['The four-year cycle zombies were not right.', '172,000 jobs. They expected 85,000.', 'So good the market sold it as bad news.', 'Saylor sold 0.0038%. The channel broke.', 'It is macro liquidity, not a magic clock.'],
  'kaspa-fair-launch-thesis': ['Who got the early bag in Kaspa? Nobody.', 'No premine. No VC unlock. No founder button.', 'Four coins I trust: Kaspa, Bitcoin, Monero, Litecoin.', "5,700 TPS vs Bitcoin's 7.", 'Wrong on the timing. Never on the asset.'],
};

function carouselImages(slug) {
  return carousels[slug].map((slide_text, i) => {
    const image_id = id8();
    return {
      seq: i + 1, image_id,
      image_path: `schedule-tweets/images/yt/yt-posts-${image_id}-${i + 1}-${slug}.png`,
      slide_text,
    };
  });
}

const yt = JSON.parse(fs.readFileSync(YTPOSTS, 'utf8'));
const ytNew = [
  {
    id: 'yt-post-2026-06-07-four-year-cycle-dilemma',
    topic: 'The four-year cycle is not magic; this week was all explainable',
    source_transcript: TRANSCRIPT,
    variation_label: 'macro walk-through (jobs, Saylor, 200-week SMA)',
    body_style: 'contrarian macro explainer',
    cta_target: 'subscribe_youtube',
    created_at: '2026-06-07T00:00:00Z',
    status: 'pending', posted_at: null, post_url: null,
    body: y1body,
    engagement_question: 'Are you still positioning around the four-year cycle, or around liquidity?',
    char_count: y1body.length,
    images: carouselImages('four-year-cycle-not-magic'),
  },
  {
    id: 'yt-post-2026-06-07-kaspa-fair-launch-thesis',
    topic: 'Who got the early bag in Kaspa? Nobody. Fair launch + PoW conviction',
    source_transcript: TRANSCRIPT,
    variation_label: 'Kaspa fair-launch + proof-of-work thesis',
    body_style: 'conviction thesis pitch',
    cta_target: 'subscribe_youtube',
    created_at: '2026-06-07T00:00:00Z',
    status: 'pending', posted_at: null, post_url: null,
    body: y2body,
    engagement_question: 'What is the one coin you have the most conviction in, and could it survive its foundation being pressured?',
    char_count: y2body.length,
    images: carouselImages('kaspa-fair-launch-thesis'),
  },
];
ytNew.forEach(p => yt.posts.push(p));
fs.writeFileSync(YTPOSTS, JSON.stringify(yt, null, 2));

// carousel gen items (for follow-up; YT chat retired). slide design prompts.
const carouselItems = [];
for (const p of ytNew) {
  for (const im of p.images) {
    carouselItems.push({
      image_id: im.image_id,
      slug: `${im.image_path.split('/').pop().replace('.png', '')}`,
      prompt: `Bold vertical social carousel slide, 4:5, deep navy near-black background with dramatic rim lighting, Kaspa greenish-cyan teal accents. Large bold high-contrast white and teal sans-serif text, centered, reading exactly: "${im.slide_text}". Clean, premium, no watermark, no extra words beyond the quoted text.`,
    });
  }
}
fs.writeFileSync(ROOT + '\\repurpose\\_items_ytcarousel.json', JSON.stringify(carouselItems, null, 2));

// ---------------- THREADS ----------------
function thread(id, topic, label, tweetsArr) {
  const tweets = tweetsArr.map((text, i) => ({
    position: i + 1, text,
    hook: i === 0 ? text.split('\n')[0] : null,
    ...(i === tweetsArr.length - 1 ? { is_cta: true } : {}),
    char_count: text.length, posted_url: null, views: null, views_captured_at: null,
  }));
  return { id, topic, source_transcript: TRANSCRIPT, variation_label: label,
    created_at: '2026-06-07T00:00:00Z', status: 'pending', posted_at: null, thread_root_url: null, tweets };
}

const th1 = thread('thread-2026-06-07-four-year-cycle-dilemma',
  'The four-year cycle is not magic; this week was explainable', 'macro walk-through', [
  "Everyone keeps telling me the four-year cycle zombies were right.\n\nThey are not.\n\nHere is exactly what happened this week, and why none of it was magic.",
  "Every jobs read this week was strong.\n\nJOLTS openings at 7.6M. ADP beat. Then nonfarm payrolls printed 172,000 when the market expected 85,000.\n\nThe economy is not rolling over.",
  "So why did everything dump?\n\nBecause the economy ran so hot the market decided it was bad. A print that strong got read as rates higher for longer.\n\nGood news became the excuse to sell.",
  "Then Saylor sold 32 Bitcoin, about 0.0038% of his stack, to cover a dividend.\n\nA rounding error. But it was enough to break a channel Bitcoin had held for 116 days.",
  "Bitcoin then tagged its 200-week SMA for the first time this cycle, down 44% from the top.\n\nThat is a crypto winter. I called it in August. I just never called a 2025 cycle top, because the clock is not the driver. Liquidity is.",
  "If this reframed how you read the cycle, follow me for the macro x crypto take the four-year cycle crowd refuses to give you.\n\n🧠 + 😎",
]);

const th2 = thread('thread-2026-06-07-kaspa-fair-launch-thesis',
  'Who got the early bag in Kaspa? Nobody. Fair launch + PoW', 'Kaspa fair-launch thesis', [
  "Who got the early bag in Kaspa?\n\nNobody.\n\nAnd once you understand why, you understand why I keep stacking it through a crypto winter.",
  "No premine. No VC allocation. No founder who pressed a button and minted himself a war chest.\n\nThe same kind of machine that mined block one mines it today. Every coin came out of proof of work.",
  "That ties into what I actually care about: who can touch your money.\n\nThe four coins I believe in are Kaspa, Bitcoin, Monero, Litecoin. All proof of work. All fair. No foundation that can freeze your wallet.",
  "Proof-of-stake chains have an entity at the center that can be sued, pressured, or told to censor you.\n\nI learned that the hard way with e-gold years ago. Decentralization means there is no one to go after.",
  "Kaspa does around 5,700 transactions per second. Bitcoin does about 7.\n\nWhen the payment layer has to be replaced, the question stops being which coin is loudest and becomes which one works.",
  "If this gave you a new lens on fair-launch proof of work, follow me for the thesis nobody else will lay out.\n\n🔥 + 💪",
]);

const xt = JSON.parse(fs.readFileSync(XTHREADS, 'utf8'));
const threadsArr = xt.threads || xt;
threadsArr.push(th1); threadsArr.push(th2);
fs.writeFileSync(XTHREADS, JSON.stringify(xt, null, 2));

// ---------------- audits ----------------
const allText = [y1body, y2body, ...[th1, th2].flatMap(t => t.tweets.map(x => x.text))];
console.log('YT posts now:', yt.posts.length, '| char_counts:', ytNew.map(p => p.char_count).join(', '));
console.log('Threads now:', threadsArr.length);
for (const t of [th1, th2]) {
  const over = t.tweets.filter(x => x.char_count > 280);
  console.log(`  ${t.id}: ${t.tweets.length} tweets, max ${Math.max(...t.tweets.map(x => x.char_count))}/280` + (over.length ? `  OVER: ${over.map(o => o.position).join(',')}` : ''));
}
console.log('carousel items for follow-up:', carouselItems.length);
console.log('em-dash present anywhere:', allText.some(s => s.includes('—')));
console.log('@mikeneder in any thread:', [th1, th2].some(t => JSON.stringify(t).includes('@mikeneder')));
