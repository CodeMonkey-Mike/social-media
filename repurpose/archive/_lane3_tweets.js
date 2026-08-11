// Lane 3 — append 6 X tweets (4 multi-line + 2 single-line) to x-tweets.json
// and emit the gen-batch items list for their images. No em dashes; Kaspa not Casper.
const fs = require('fs');
const crypto = require('crypto');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\x-tweets.json';
const id8 = () => crypto.randomBytes(4).toString('hex');

const KASPA_REF = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\kaspa-logo.png';

// each: tweet text, slug, image prompt, optional ref, kaspa(for IG companion)
const items = [
  {
    slug: 'kaspa-no-early-bag',
    tweet: "Who got the early bag in Kaspa?\n\nNobody.\n\nThe same machine that mined the first block mines it today. No founder pressed a button, no VC unlock, no premine.\n\nThat is what fair launch actually means.\n\n#Kaspa #crypto",
    prompt: "Pixar-style 3D animated CGI, film-quality render. A single glowing Kaspa coin showing the backwards-K (mirrored capital K) logo in greenish-cyan teal, rising out of a stylized proof-of-work mining machine, on a deep navy near-black background with dramatic rim lighting. Only one coin, no people, no text or words anywhere. 1:1 square.",
    ref: KASPA_REF, kaspa: true,
  },
  {
    slug: 'jobs-so-good-it-was-bad',
    tweet: "172,000 jobs in May. They expected 85,000.\n\nThe economy ran so hot the market read it as a rate-hike threat and dumped.\n\nBitcoin just tagged its 200-week SMA for the first time this cycle, down 44% from the top.\n\nMacro liquidity, not a magic cycle.\n\n#Bitcoin",
    prompt: "Pixar-style 3D animated CGI, film-quality render. A glossy orange Bitcoin coin with the B symbol sliding down a glowing descending curve toward a thick horizontal support line far below, deep navy near-black background, dramatic rim lighting, a sense of tension and gravity. No text or words anywhere. 1:1 square.",
    ref: null, kaspa: false,
  },
  {
    slug: 'four-year-cycle-not-magic',
    tweet: "The four-year cycle zombies keep telling me they were right.\n\nWe are in a crypto winter, sure. I called that back in August.\n\nBut I never called a 2025 cycle top. There is no magic clock, just macro liquidity.\n\nA winter is not a cycle. Which are you betting on?\n\n#crypto",
    prompt: "Pixar-style 3D animated CGI, film-quality render, slightly comedic. A goofy crypto zombie reaching greedily toward a glowing magician's golden pocket-watch marked with the number 4, and the watch is dissolving into wisps of smoke. Deep navy near-black background, dramatic rim lighting. No text or words anywhere. 1:1 square.",
    ref: null, kaspa: false,
  },
  {
    slug: 'pow-cant-freeze-your-wallet',
    tweet: "There are only four coins I actually believe in: Kaspa, Bitcoin, Monero, Litecoin.\n\nAll proof of work. All fair. None of them can freeze your wallet.\n\nProof-of-stake chains have a foundation that can be pressured to censor you.\n\nDecentralization is who can touch your money.\n\n#Kaspa",
    prompt: "Pixar-style 3D animated CGI, film-quality render. Four glowing coins behind a translucent unbreakable glass shield on a deep navy near-black background with dramatic rim lighting: in front and largest, a hero Kaspa coin with the backwards-K (mirrored capital K) teal logo; behind it a smaller orange Bitcoin coin (B), a smaller orange Monero coin (M), and a smaller silver Litecoin coin. No text or words anywhere. 1:1 square.",
    ref: null, kaspa: true,
  },
  {
    slug: 'saylor-fraction-panic',
    tweet: "Saylor sold 0.0038% of his Bitcoin to cover a dividend, and the four-year cycle crowd acted like the top was in.\n\n#Bitcoin",
    prompt: "Pixar-style 3D animated CGI, film-quality render, comedic scale contrast. A giant mountain of glossy orange Bitcoin coins, with a single tiny coin being lifted off the very top by a pair of tweezers, while small panicked cartoon investors run around the base in a frenzy. Deep navy near-black background, dramatic rim lighting. No text or words anywhere. 1:1 square.",
    ref: null, kaspa: false,
  },
  {
    slug: 'kaspa-11-cents-to-3',
    tweet: "I bought Kaspa at 11 cents dreaming of $3 by 2025. Wrong on the timing, never on the asset.\n\n#Kaspa",
    prompt: "Pixar-style 3D animated CGI, film-quality render. A single glowing teal Kaspa coin with the backwards-K (mirrored capital K) logo at the start of a winding road that climbs upward into the distant horizon, deep navy near-black background, dramatic rim lighting, hopeful long-journey mood. No text or words anywhere. 1:1 square.",
    ref: KASPA_REF, kaspa: true,
  },
];

const data = JSON.parse(fs.readFileSync(P, 'utf8'));
const genItems = [];
const igSource = [];
let added = 0;
for (const it of items) {
  const image_id = id8();
  const image_path = `schedule-tweets/images/x/x-tweets-${image_id}-${it.slug}.png`;
  const hook = it.tweet.split('\n')[0];
  // duplicate-image guard: ensure image_id not already used anywhere
  const entry = {
    tweet: it.tweet, hook, status: 'pending', posted_at: null, url: null,
    views: null, views_captured_at: null, image_id, image_path,
  };
  data.tweets.push(entry);
  added++;
  const gi = { image_id, slug: it.slug, prompt: it.prompt };
  if (it.ref) gi.ref = it.ref;
  genItems.push(gi);
  if (it.kaspa) igSource.push({ image_id, slug: it.slug, prompt: it.prompt, tweet: it.tweet, hook });
}
fs.writeFileSync(P, JSON.stringify(data, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_items_xtweets.json', JSON.stringify(genItems, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_igsource.json', JSON.stringify(igSource, null, 2));
// em-dash audit
const dash = items.some(i => i.tweet.includes('—'));
console.log(`appended ${added} tweets; total now ${data.tweets.length}; em-dash present: ${dash}`);
console.log('gen items:', genItems.map(g => g.slug + (g.ref ? ' (ref)' : '')).join(', '));
console.log('IG-companion (kaspa) sources:', igSource.map(g => g.slug).join(', '));
