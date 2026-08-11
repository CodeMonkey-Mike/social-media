const fs = require('fs');
const uid = () => require('crypto').randomBytes(4).toString('hex');
const xpath = 'schedule-tweets/data/x-tweets.json';
const d = JSON.parse(fs.readFileSync(xpath, 'utf8'));
const REF = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\ElizaOS-ai16z.png';

// the 3 imageless zombie tweets, matched by a unique substring of their hook
const specs = [
  { match: 'Did the birds make the sun rise', slug: 'cycle-superstition-birds', ref: null,
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A dazed gold Bitcoin coin character standing on a dark hilltop at pre-dawn, pointing up in awe at a few small birds chirping on a bare branch while the sun just begins to crest the horizon, as if the birds are summoning the sunrise. A faint crowd of pale zombie coin characters watches in the background. Deep navy near-black dawn sky with a faint warm glow on the horizon. Dramatic cinematic lighting. Ironic, superstitious mood. No text or words anywhere in the image." },
  { match: 'the same project that ran as ai16z', slug: 'elizaos-rebrand-reborn', ref: REF,
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A glowing AI-agent coin character bearing the ElizaOS logo shown in the attached reference image, emerging reborn and confident out of a cracked-open old shell (representing a rebrand), rising upward. Deep navy near-black background with faint circuit and neural-network motifs and a soft purple-teal glow. Dramatic cinematic rim lighting. Hopeful, comeback mood. No text or words anywhere in the image." },
  { match: 'Sold $TON higher in the chop', slug: 'toncoin-buy-the-dip', ref: null,
    prompt: "Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. A cheerful blue Toncoin (TON) coin character with its diamond-shaped TON logo, happily scooping up a pile of discounted glowing blue coins into a basket at the bottom of a dip in a chart-like valley. Deep navy near-black background. Dramatic cinematic blue rim lighting. Opportunistic, buy-the-dip mood. No text or words anywhere in the image." },
];

const existing = new Set(d.tweets.map(t => t.image_id).filter(Boolean));
const list = [];
for (const s of specs) {
  const tw = d.tweets.find(t => t.hook && t.hook.includes(s.match) && !t.image_id);
  if (!tw) { console.log('NOT FOUND (or already has image):', s.match); continue; }
  let id; do { id = uid(); } while (existing.has(id)); existing.add(id);
  tw.image_id = id;
  tw.image_path = 'schedule-tweets/images/x/x-tweets-' + id + '-' + s.slug + '.png';
  const item = { image_id: id, slug: s.slug, prompt: s.prompt };
  if (s.ref) item.ref = s.ref;
  list.push(item);
  console.log('assigned', id, '->', s.slug, '| hook:', tw.hook.slice(0, 50));
}
fs.writeFileSync(xpath, JSON.stringify(d, null, 2) + '\n');
fs.writeFileSync('repurpose/_zombie-genlist-x3.json', JSON.stringify(list, null, 2));
console.log('wrote genlist with', list.length, 'items');
