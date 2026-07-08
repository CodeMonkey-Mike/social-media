// Lane 3 (this-is-gonna-rip) - append 6 X tweets (4 multi-line + 2 single-line) to x-tweets.json
// Kaspa-weighted (KAS x3, TAO x2, macro x1). No em dashes. Casper->Kaspa. Fact-checked.
// Emits gen-items (images) + ig-source (kaspa companions). Duplicate-image_id guard included.
const fs = require('fs');
const crypto = require('crypto');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\x-tweets.json';
const KASPA_REF = ROOT + '\\schedule-tweets\\images\\reference\\kaspa-logo.png';
const id8 = () => crypto.randomBytes(4).toString('hex');

// order = production order requested: 4 multi-line first, then 2 single-line. Topics interleaved (shuffled).
const items = [
  { // multi 1 - Kaspa energy money (hero)
    slug: 'kaspa-energy-money', kaspa: true, ref: KASPA_REF,
    tweet: "Elon says money is just mass and energy.\n\nBitcoin is the closest thing we have ever had to energy backed money. It proved you cannot fake energy.\n\nBut proving it and perfecting it are two different things. Kaspa is the same proof of work, just far more efficient.\n\n#kaspa",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A glowing teal Kaspa coin showing the backwards-K (mirrored capital K) logo standing confidently next to a slightly larger but duller orange Bitcoin coin, both plugged into glowing energy cables drawing power from a stylized power grid, the Kaspa cable burning noticeably brighter and cleaner. Deep navy near-black background, dramatic cinematic rim lighting, teal glow on the Kaspa coin. Triumphant mood. No text or words anywhere in the image.",
  },
  { // multi 2 - TAO decentralized AI (Fable 5 shutoff)
    slug: 'tao-fable-shutoff', kaspa: false, ref: null,
    tweet: "The US government just ordered Anthropic to cut off its most powerful AI model from every foreign national on earth.\n\nOne letter. Millions of people locked out overnight.\n\nThis is the entire case for $TAO: decentralized AI nobody can switch off.\n\n#bittensor",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A giant cold government hand flipping a power switch to OFF on a huge glowing centralized AI brain-server, leaving a small crowd of cartoon people in the dark, while off to one side a small network of glowing interconnected decentralized nodes stays lit and humming. Deep navy near-black background, dramatic rim lighting, cool electric-blue accent glow. Ominous but hopeful mood. No text or words anywhere in the image.",
  },
  { // multi 3 - Kaspa efficiency / question hook
    slug: 'kaspa-most-efficient', kaspa: true, ref: KASPA_REF,
    tweet: "What is the most efficient energy backed money ever built?\n\nNot Bitcoin. Ten minute blocks, seven transactions a second.\n\nKaspa. Blocks every second, GhostDAG, fair launch, no premine. Same proof of work, none of the bottleneck.\n\n#kaspa",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A speedy glowing teal Kaspa coin with the backwards-K (mirrored capital K) logo zipping along a wide multi-lane light track leaving bright teal light trails, while a heavy slow orange Bitcoin coin lumbers along a single narrow lane far behind it. Deep navy near-black background, dramatic rim lighting, teal speed glow. Energetic, playful mood. No text or words anywhere in the image.",
  },
  { // multi 4 - macro/tribal self-fulfilling bear + whales
    slug: 'self-fulfilling-bear', kaspa: false, ref: null,
    tweet: "This bear never had a macro reason to exist.\n\nRates down, QE starting, jobs improving. Every past bear had tightening behind it. This one had nothing.\n\nThe four-year cycle zombies dumped because they believed in a bear. They made it real.\n\nWhales are buying again.\n\n#bitcoin",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render, slightly comedic. A crowd of goofy green crypto zombies stampeding to dump glowing coins off a cliff, and their own panic is literally forming the dark storm cloud above them. In the calm background, a few friendly whale-shaped investors quietly scoop the falling coins back up. Deep navy near-black background, dramatic rim lighting. Tense, ironic mood. No text or words anywhere in the image.",
  },
  { // single 1 - Kaspa tribal phrase one-liner
    slug: 'bitcoin-proved-kaspa-improved', kaspa: true, ref: KASPA_REF, single: true,
    tweet: "Bitcoin proved it. Kaspa improved it.\n\n#kaspa",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A glowing teal Kaspa coin with the backwards-K (mirrored capital K) logo standing proudly on top of a sturdy orange Bitcoin coin like a champion on a podium, the Kaspa coin radiating a clean teal glow upward. Deep navy near-black background, dramatic cinematic rim lighting. Heroic, triumphant mood. No text or words anywhere in the image.",
  },
  { // single 2 - TAO one-liner
    slug: 'tao-restrict-obvious', kaspa: false, ref: null, single: true,
    tweet: "The harder they restrict centralized AI, the more obvious $TAO becomes. 🧠\n\n#bittensor",
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A single glowing decentralized AI network orb made of many interconnected luminous nodes, floating safely out of reach above a shrinking locked centralized server cage below it. Deep navy near-black background, dramatic cinematic rim lighting, electric-blue and teal accent glow. Resilient, futuristic mood. No text or words anywhere in the image.",
  },
];

const data = JSON.parse(fs.readFileSync(P, 'utf8'));
const existingIds = new Set(data.tweets.map(t => t.image_id).filter(Boolean));
const genItems = [];
const igSource = [];
let added = 0;
for (const it of items) {
  let image_id = id8();
  while (existingIds.has(image_id)) image_id = id8(); // duplicate guard
  existingIds.add(image_id);
  const image_path = `schedule-tweets/images/x/x-tweets-${image_id}-${it.slug}.png`;
  const hook = it.tweet.split('\n')[0];
  const char_count = it.tweet.length;
  if (it.tweet.includes('—')) { console.error('EM DASH in', it.slug); process.exit(1); }
  if (char_count > 280) { console.error('OVER 280:', it.slug, char_count); process.exit(1); }
  data.tweets.push({
    tweet: it.tweet, hook, status: 'pending', posted_at: null, url: null,
    views: null, views_captured_at: null, image_id, image_path, char_count,
  });
  added++;
  const gi = { image_id, slug: it.slug, prompt: it.prompt };
  if (it.ref) gi.ref = it.ref;
  genItems.push(gi);
  if (it.kaspa) igSource.push({ image_id, slug: it.slug, prompt: it.prompt, tweet: it.tweet, hook });
}
fs.writeFileSync(P, JSON.stringify(data, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_rip_items_xtweets.json', JSON.stringify(genItems, null, 2));
fs.writeFileSync(ROOT + '\\repurpose\\_rip_igsource.json', JSON.stringify(igSource, null, 2));
console.log(`appended ${added} tweets; total now ${data.tweets.length}`);
for (const it of items) console.log(`  ${it.single ? 'single' : 'multi '} | ${it.tweet.length}c | ${it.slug}`);
console.log('IG-companion (kaspa) sources:', igSource.map(g => g.slug).join(', '));
