const fs = require('fs');
const file = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\x-tweets.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const tweets = data.tweets;

const nonPending = tweets.filter(t => t.status !== 'pending');
const pending    = tweets.filter(t => t.status === 'pending');

// Match a pending tweet by image_id + optional substring hint in tweet/hook text.
// `used` prevents double-matching when multiple tweets share an image_id.
const used = new Set();
function find(id, hint) {
  for (let i = 0; i < pending.length; i++) {
    if (used.has(i)) continue;
    const t = pending[i];
    if (t.image_id !== id) continue;
    if (hint && !(t.tweet || '').includes(hint) && !(t.hook || '').includes(hint)) continue;
    used.add(i);
    return t;
  }
  throw new Error(`Not found: image_id=${id} hint=${hint}`);
}

// Desired final pending order:
// Top 6 = user's request (#20, #32, #11, #12, #38, #40 from original numbering)
// Then the rest in their original sequence.
const ordered = [
  find('f3e7cfce', 'under my prior sell price'), // orig #20
  find('94c3df2f'),                               // orig #32
  find('53f0cd31'),                               // orig #11
  find('2ea22761'),                               // orig #12
  find('c929e08f'),                               // orig #38
  find('6fc77eea'),                               // orig #40
  // — rest in original order —
  find('d24ce4fc'),                               // orig #1
  find('5fe6df22'),                               // orig #2
  find('a5e9b3d7'),                               // orig #3
  find('dd4b8aa2'),                               // orig #4
  find('b2f6c1e8'),                               // orig #5
  find('58719c5f'),                               // orig #6
  find('c7d3a5f1'),                               // orig #7
  find('b705daa8'),                               // orig #8
  find('418466e7'),                               // orig #9
  find('60a41e86'),                               // orig #10
  find('87fb4fb9'),                               // orig #13
  find('2d49f9a2', 'right now'),                  // orig #14
  find('e4fb7d78', 'stacking in this bear'),      // orig #15
  find('66299a67', 'not buying new memes'),        // orig #16
  find('2d49f9a2', 'Minnesota just signed'),       // orig #17
  find('e42e6175', 'bigger than the original'),    // orig #18
  find('e4fb7d78', 'Iran caves'),                  // orig #19
  find('66299a67', 'CoinMarketCap is showing'),    // orig #21
  find('cbfefe33', "won't call"),                  // orig #22
  find('afb4f734'),                               // orig #23
  find('a607c477', 'Without fresh retail'),        // orig #24
  find('e42e6175', 'Institutions'),               // orig #25
  find('60063b13', 'economic expansion for 18'),  // orig #26
  find('e40a228f'),                               // orig #27
  find('67d2cc9e'),                               // orig #28
  find('f3e7cfce', 'Two paths'),                  // orig #29
  find('221dbeb4'),                               // orig #30
  find('fb5f1238'),                               // orig #31
  find('cbfefe33', '2-signal filter'),            // orig #33
  find('cdae76ab'),                               // orig #34
  find('4f9d8919'),                               // orig #35
  find('c6513e28'),                               // orig #36
  find('a607c477', 'CoinMarketCap shows'),        // orig #37
  find('44e7aba7'),                               // orig #39
  find('60063b13', 'meme filter'),                // orig #41
  find('a881e0c8'),                               // orig #42
];

if (ordered.length !== pending.length) {
  throw new Error(`Mismatch: ordered=${ordered.length} pending=${pending.length}`);
}

data.tweets = [...nonPending, ...ordered];
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');

console.log('Done. New pending top 6:');
ordered.slice(0, 6).forEach((t, i) =>
  console.log(`  ${i+1}. ${(t.hook || t.tweet || '').slice(0, 72)}`)
);
console.log(`Total: ${nonPending.length} posted + ${ordered.length} pending = ${data.tweets.length}`);
