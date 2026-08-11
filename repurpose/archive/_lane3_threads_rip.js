// Lane 3 (this-is-gonna-rip) - 2 threads from the 2 YT posts. 5-8 tweets, last is CTA ("Follow me").
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\x-threads.json';
const TRANSCRIPT = 'transcripts/this is gonna rip LOW BPS VERTICAL/this is gonna rip LOW BPS VERTICAL_plain.txt';
const now = new Date().toISOString();

const threads = [
  {
    id: 'thread-2026-06-15-bitcoin-proved-kaspa-improved',
    topic: 'Bitcoin proved energy money, Kaspa improved it',
    variation_label: 'A (hook-and-thesis-first)',
    tweets: [
      "Elon Musk says money in the future will not be dollars. Just mass and energy.\n\nIf energy is the only honest money, then Bitcoin is not the final form of it.\n\nKaspa is.",
      "Bitcoin proved the idea. It turned electricity into security and built a money no central bank can print into nothing.\n\nYou can fake fiat. Every government in history has. You cannot fake energy.\n\nThat was the breakthrough.",
      "But proving an idea and perfecting it are two different things.\n\nBitcoin: a block every ten minutes, about seven transactions a second.\n\nIncredible for 2009. A bottleneck in 2026.",
      "Kaspa takes the exact same proof of work and runs it with GhostDAG.\n\nBlocks every second instead of every ten minutes. Fair launch. No premine. No VC unlock.\n\nSame sound money. None of the speed limit.",
      "A viewer in Bogota said it better than any thread could:\n\nBitcoin proved it. Kaspa improved it.\n\nFour words, and that is the whole thesis.",
      "If this changed how you see energy money,\n\nFollow me for the macro and Kaspa breakdowns the four-year cycle crowd will not give you.\n\n🧠",
    ],
  },
  {
    id: 'thread-2026-06-15-decentralized-ai-tao',
    topic: 'Government control of AI makes decentralized AI (TAO) inevitable',
    variation_label: 'A (stat-stack to conclusion)',
    tweets: [
      "Last Friday the US government switched off the most powerful AI on the market for millions of people with a single order.\n\nAlmost nobody connected it to crypto.\n\nThis is the case for $TAO.",
      "The Commerce Department told Anthropic to cut off Fable 5 and Mythos 5 from every foreign national on earth.\n\nNot foreign governments. Every foreign national, even their own employees.\n\nTo comply, Anthropic disabled the models for everyone.",
      "One letter from one agency, and a frontier AI model went dark overnight.\n\nThe lesson is brutal: the AI everyone is racing to depend on has an off switch, and you are not the one holding it.",
      "A government can flip it. A company can flip it to stay compliant.\n\nYour access to the most important tool of the decade is a permission someone else can revoke without warning.",
      "Now look at what Bittensor is building.\n\n$TAO is an open market for AI that no company owns and no government can switch off.\n\nThe centralized option just proved it can be turned off by decree.",
      "Same principle every time:\n\n$TAO is the AI layer nobody owns. $KAS is the money layer nobody owns.\n\nThe harder they race to control it, the more a neutral layer is worth.",
      "If this connected a dot for you,\n\nFollow me for the macro and crypto takes that see these moves before the crowd does.\n\n😎",
    ],
  },
];

const data = JSON.parse(fs.readFileSync(P, 'utf8'));
let added = 0;
for (const th of threads) {
  const tweetObjs = th.tweets.map((text, i) => {
    if (text.includes('—')) { console.error('EM DASH in', th.id, 'pos', i + 1); process.exit(1); }
    if (text.length > 280) { console.error('OVER 280:', th.id, 'pos', i + 1, text.length); process.exit(1); }
    const o = { position: i + 1, text, hook: i === 0 ? text.split('\n')[0] : null,
      char_count: text.length, posted_url: null, views: null, views_captured_at: null };
    if (i === th.tweets.length - 1) o.is_cta = true;
    return o;
  });
  data.threads.push({
    id: th.id, topic: th.topic, source_transcript: TRANSCRIPT,
    variation_label: th.variation_label, created_at: now, status: 'pending',
    posted_at: null, thread_root_url: null, tweets: tweetObjs,
  });
  added++;
  console.log(`  ${th.id}: ${th.tweets.length} tweets | chars ${th.tweets.map(t=>t.length).join(',')}`);
}
fs.writeFileSync(P, JSON.stringify(data, null, 2));
console.log(`appended ${added} threads; total now ${data.threads.length}`);
