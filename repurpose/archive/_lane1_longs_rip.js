// Lane 1 (this-is-gonna-rip) - append the desilenced long-form to longs.json.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\longs.json';

const description = "The market is green and this one might actually rip. In this Monday market update I break down the new Iran ceasefire and what the Friday signing ceremony means for crypto, why Bitcoin held up far better than anyone expected in the face of war, and the most bullish signal on the board: Bitcoin whales have stopped selling and started accumulating again.\n\nI also get into why this bear never had a real macro reason to exist (rates coming down, QE starting, employment improving), why decentralized AI like Bittensor (TAO) becomes inevitable after the government switched off a frontier AI model, and the phrase a viewer gave me that sums up my whole thesis: Bitcoin proved it, Kaspa improved it.\n\n#bitcoin #kaspa #bittensor #crypto\n\nDisclaimer: Nothing I say is financial advice.\n\nFollow my trades in my Discord community with various tools to find the best cryptos that helped me become crypto-rich:\nhttps://whop.com/cryptorich/\n\nFind out more about my team and my community: https://www.cryptorich.vip/";

const entry = {
  id: 'lf-20260615-this-is-gonna-rip',
  batch: 'this-is-gonna-rip',
  slug: 'this-is-gonna-rip',
  source: 'this is gonna rip livestream (desilenced LOW BPS)',
  video_path: 'longform/this-is-gonna-rip/this-is-gonna-rip.mp4',
  thumbnail_path: 'longform/this-is-gonna-rip/this-is-gonna-rip.png',
  duration_seconds: 1088.3,
  width: 1920,
  height: 1080,
  title: 'This Is Gonna Rip - Iran Ceasefire, Bitcoin Whales Return, and Why Kaspa Improved Bitcoin',
  description,
  tags: ['bitcoin', 'kaspa', 'bittensor', 'tao', 'crypto', 'iran ceasefire', 'market update'],
  categories: { rumble: { primary: 'Finance & Crypto' } },
  visibility: 'public',
  platforms: {
    rumble:   { status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null },
    bitchute: { status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null },
    facebook: { status: 'pending', posted_at: null, url: null, views: null, views_captured_at: null },
  },
  created_at: '2026-06-15',
};

if (JSON.stringify(entry).includes('—')) { console.error('EM DASH in longs entry'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(P, 'utf8'));
if (data.longs.some(l => l.id === entry.id)) { console.error('duplicate id'); process.exit(1); }
data.longs.push(entry);
fs.writeFileSync(P, JSON.stringify(data, null, 2));
console.log(`appended long-form; total now ${data.longs.length}; id=${entry.id}; dur=${entry.duration_seconds}s`);
