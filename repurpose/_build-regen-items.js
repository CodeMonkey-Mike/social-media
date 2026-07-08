// One-off: build the items list + mapping for regenerating the 3 off-reference carousels.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const id = () => crypto.randomBytes(4).toString('hex');
const REFBASE = path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\carousels\\version1');
const ref = (f) => path.join(REFBASE, f);

const tmpl = (text, emphasis, refFile, extraVisual) =>
  'Match the layout, typography, color palette, and overall visual styling of the attached reference image exactly. ' +
  'Bold crypto news graphic, near-black background, dramatic cinematic lighting, bold ALL-CAPS white and neon green typography, ' +
  (extraVisual || 'glowing Kaspa coin accent') + ', no human faces, 1:1 square. ' +
  'The slide main headline text reads exactly, spelled correctly: "' + text + '". ' +
  'Emphasize "' + emphasis + '" in neon green; the rest in white. Clean, high-energy, professional crypto-news look.';

const mk = (post, seq, slug, text, emphasis, refFile, extraVisual) => ({
  post, seq, image_id: id(), slug: post.toLowerCase() + '-' + seq + '-' + slug,
  slide_text: text, ref: ref(refFile), prompt: tmpl(text, emphasis, refFile, extraVisual),
});

const items = [
  // four-year-cycle-dilemma (FY)
  mk('FY', 1, 'hook', 'THE FOUR-YEAR CYCLE ZOMBIES WERE NOT RIGHT', 'NOT RIGHT', 'yt-posts-e5f8a2c4-01-zombie-hook.png', 'zombie hands and a broken chart motif'),
  mk('FY', 2, 'jobs', '172,000 JOBS. THEY EXPECTED 85,000.', '172,000', 'yt-posts-a7e2f4b8-02-ppi-data.png', 'a data panel with rising bars'),
  mk('FY', 3, 'good-is-bad', 'SO GOOD THE MARKET SOLD IT AS BAD NEWS', 'BAD NEWS', 'yt-posts-89869680-02-btc-failure.png', 'a red downward chart accent'),
  mk('FY', 4, 'saylor', 'SAYLOR SOLD 0.0038%. THE CHANNEL BROKE.', '0.0038%', 'yt-posts-a8d4e7b2-03-sbr-math.png', 'a Bitcoin coin over a cracked price channel'),
  mk('FY', 5, 'question', 'FOUR-YEAR CYCLE, OR LIQUIDITY? WHICH ARE YOU POSITIONING AROUND?', 'LIQUIDITY', 'yt-posts-a2d6e9f5-05-question.png', 'a glowing question mark and liquidity flow lines'),
  // kaspa-fair-launch-thesis (FL)
  mk('FL', 1, 'hook', 'WHO GOT THE EARLY BAG IN KASPA? NOBODY.', 'NOBODY', 'yt-posts-828eee71-01-hook.png', 'a glowing Kaspa coin hero'),
  mk('FL', 2, 'no-premine', 'NO PREMINE. NO VC UNLOCK. NO FOUNDER BUTTON.', 'NO FOUNDER BUTTON', 'yt-posts-f1b6c3d9-02-zombie-math.png', 'a clean glowing Kaspa coin'),
  mk('FL', 3, 'four-coins', 'FOUR COINS I TRUST: KASPA, BITCOIN, MONERO, LITECOIN', 'KASPA', 'yt-posts-b4c8d3f1-03-three-options.png', 'four proof-of-work coin icons in a row, Kaspa largest'),
  mk('FL', 4, 'tps', '5,700 TPS VS BITCOIN 7', '5,700 TPS', 'yt-posts-d9b2c5f3-02-lottery-math.png', 'a speed and throughput data panel'),
  mk('FL', 5, 'question', 'YOUR HIGHEST-CONVICTION COIN: COULD IT SURVIVE ITS FOUNDATION UNDER PRESSURE?', 'CONVICTION', 'yt-posts-c9e1b4d5-05-question.png', 'a glowing question mark'),
  // kaspa-green-on-red (GR)
  mk('GR', 1, 'hook', 'EVERY COIN RED. $KAS CLOSED GREEN. AGAIN.', 'GREEN', 'yt-posts-c4a7f1e8-01-dry-powder-hook.png', 'a sea of red coins with one glowing green Kaspa coin'),
  mk('GR', 2, 'no-premine', 'NO PREMINE. NO VC UNLOCK. NO INSIDER BAGS TO DUMP.', 'NO INSIDER BAGS', 'yt-posts-6f54e3d5-03-the-problem.png', 'a clean glowing Kaspa coin'),
  mk('GR', 3, 'coinbase', 'NOT ON COINBASE. THE EXCLUSION IS THE FAIR-LAUNCH RECEIPT.', 'THE RECEIPT', 'yt-posts-cbf76e06-04-the-solution.png', 'a Kaspa coin with a receipt motif'),
  mk('GR', 4, 'two-plays', 'MY TWO CYCLE PLAYS: $KAS POW MONEY, $TAO AI COMPUTE', '$KAS  $TAO', 'yt-posts-b3c7f2a6-04-stacked-catalyst.png', 'two glowing neutral-layer icons'),
  mk('GR', 5, 'question', 'ACCUMULATING NOW, OR WAITING FOR THE OCTOBER BOTTOM EVERYONE ELSE IS?', 'ACCUMULATING NOW', 'yt-posts-d2b5c9e3-05-question.png', 'a glowing question mark'),
];

const genList = items.map(it => ({ image_id: it.image_id, slug: it.slug, prompt: it.prompt, ref: it.ref }));
fs.writeFileSync(path.join(__dirname, '_regen-carousels-items.json'), JSON.stringify(genList, null, 2));
fs.writeFileSync(path.join(__dirname, '_regen-carousels-map.json'), JSON.stringify(items, null, 2));

let missing = 0;
items.forEach(it => { if (!fs.existsSync(it.ref)) { console.log('MISSING REF:', it.ref); missing++; } });
console.log('Wrote', genList.length, 'items.', missing === 0 ? 'All reference exemplars exist OK' : (missing + ' missing refs'));
console.log('Sample slug:', genList[0].slug, '| ref exists:', fs.existsSync(items[0].ref));
