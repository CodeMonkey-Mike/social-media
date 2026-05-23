// One-shot script to write images arrays into yt-posts.json for 6 pending posts
// and populate IG-carousel.json with corresponding entries.
const fs = require('fs');

const YT_JSON      = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\yt-posts.json';
const IG_CAR_JSON  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\ig-carousel.json';

const ytUpdates = {
  'yt-post-2026-05-15-warsh-trap-kaspa-hedge': {
    version: 'version1',
    slides: [
      { seq: 1, id: 'f3d9b1c7', slug: '01-warsh-hook',       text: 'Kevin Warsh walked into a trap.' },
      { seq: 2, id: 'a7e2f4b8', slug: '02-ppi-data',         text: 'April PPI: +1.4% MoM, +6.0% YoY. Biggest 12-month jump since 2022.' },
      { seq: 3, id: 'b4c8d3f1', slug: '03-three-options',    text: 'Warsh has 3 options: Cut, Hold, or Hike.' },
      { seq: 4, id: 'c6a1e7f5', slug: '04-pow-doesnt-care',  text: 'Supply schedules don\'t care about Warsh.' },
      { seq: 5, id: 'd2b5c9e3', slug: '05-question',         text: 'Which way does Warsh break? And what does $KAS do?' },
    ],
  },
  'yt-post-2026-05-15-zombies-sbr-kaspa-leg': {
    version: 'version1',
    slides: [
      { seq: 1, id: 'e5f8a2c4', slug: '01-zombie-hook',      text: 'The bear case just lost two more legs.' },
      { seq: 2, id: 'f1b6c3d9', slug: '02-zombie-math',      text: 'Zombie math: sold Oct/Nov bottom. October bottom never prints. They re-enter.' },
      { seq: 3, id: 'a8d4e7b2', slug: '03-sbr-math',         text: 'SBR math: new buying = god candle. Framework only = slow grind. Both bullish.' },
      { seq: 4, id: 'b3c7f2a6', slug: '04-stacked-catalyst', text: 'Stack both catalysts: zombie re-entry + SBR = new ATH in 2026.' },
      { seq: 5, id: 'c9e1b4d5', slug: '05-question',         text: 'Which catalyst lands first: zombie capitulation or SBR god-candle?' },
    ],
  },
  'yt-post-2026-05-15-ai-mania-compressed-kaspa-window': {
    version: 'version2',
    slides: [
      { seq: 1, id: 'd7a3b6c1', slug: '01-timeline-hook',     text: 'We\'re not in 2000. We might not even be in 1995.' },
      { seq: 2, id: 'e2f5c8a4', slug: '02-dotcom-groundwork', text: 'Dot-com: 28 years of groundwork → 4-year mania. 572% Nasdaq.' },
      { seq: 3, id: 'f4b1d7e9', slug: '03-ai-compressed',     text: 'AI: no AT&T to fight. 10-year buildout → 2-3 year mania.' },
      { seq: 4, id: 'a6c3f9b5', slug: '04-kaspa-window',      text: 'The Kaspa window is shorter than people think. 95% mined. Hard fork in schedule.' },
      { seq: 5, id: 'b8e4d2f7', slug: '05-question',          text: 'If the AI mania is compressed, what does $KAS look like by end of 2027?' },
    ],
  },
  'yt-post-2026-05-15-dry-powder-krc20-lottery': {
    version: 'version1',
    slides: [
      { seq: 1, id: 'c4a7f1e8', slug: '01-dry-powder-hook',   text: '98x on Lab. The dry powder is the actual win.' },
      { seq: 2, id: 'd9b2c5f3', slug: '02-lottery-math',      text: '$200 risk across 10 KRC20s. One 1,000x = $20,000 back.' },
      { seq: 3, id: 'e6f3a8d1', slug: '03-kroak-proof',       text: 'KROAK just confirmed it: 6x while CT said KRC20s were dead.' },
      { seq: 4, id: 'f8c1b4a7', slug: '04-rotation-play',     text: 'Stack $KAS for the L1 move. Use dry powder for the KRC20 lottery leg.' },
      { seq: 5, id: 'a2d6e9f5', slug: '05-question',          text: '$1,000 of dry powder: how do you split between $KAS and KRC20 lottery?' },
    ],
  },
  'yt-post-2026-05-15-kaspa-ghost-mascot-debate': {
    version: 'version2',
    slides: [
      { seq: 1, id: 'b5f7c3a9', slug: '01-nacho-hook',        text: 'Hot take: Nacho\'s mascot logic broke when Shai left.' },
      { seq: 2, id: 'c8a2d6e4', slug: '02-ghostdag-case',     text: 'Kaspa is a fully implemented GhostDAG. The mascot should be the ghost.' },
      { seq: 3, id: 'd1b4f8c2', slug: '03-mcap-gap',          text: 'Kasper-the-Ghost: ~300K mcap. Nacho: ~3.6M. One of these makes sense.' },
      { seq: 4, id: 'e3c6a1d7', slug: '04-why-not-repriced',  text: 'Brand inertia keeps Nacho above Kasper. New retail won\'t have that inertia.' },
      { seq: 5, id: 'f5d9b2e6', slug: '05-question',          text: 'One mascot for $KAS this bull cycle: Nacho or Kasper-the-Ghost?' },
    ],
  },
  'yt-post-2026-05-15-winners-from-ruggers-kaspa-survivor': {
    version: 'version2',
    slides: [
      { seq: 1, id: 'a7c4e1f9', slug: '01-bear-sorted-hook',  text: 'The bear market did us a favor. It sorted the builders from the ones who checked out.' },
      { seq: 2, id: 'b1d8f5c3', slug: '02-filter-signal-1',   text: 'Filter signal 1: devs still posting? KROAK: yes. Kasy: no.' },
      { seq: 3, id: 'c4e2b9a6', slug: '03-filter-signal-2',   text: 'Filter signal 2: still on a CEX? Delistings in a bear are the death rattle.' },
      { seq: 4, id: 'd6f3c7b1', slug: '04-filter-signal-3',   text: 'Filter signal 3: survived its worst on-chain day? $KAS passes all three.' },
      { seq: 5, id: 'e9a5d2f8', slug: '05-kas-canonical',     text: 'Of the three filter signals, which one do you weight heaviest?' },
    ],
  },
  'yt-post-2026-05-15-clarity-act-stables-kaspa-non-yield': {
    version: 'version2',
    slides: [
      { seq: 1, id: 'f2b6c9d4', slug: '01-clarity-hook',      text: 'The Clarity Act just killed idle stable yield.' },
      { seq: 2, id: 'a8d1e4f7', slug: '02-old-trade-killed',  text: 'The old carry trade is gone. Activity-gated yield doesn\'t replicate it.' },
      { seq: 3, id: 'b3c5a7e2', slug: '03-capital-needs-home',text: 'That capital needs a new home: DeFi, BTC/ETH spot, or PoW alts.' },
      { seq: 4, id: 'c7f2b8d5', slug: '04-kas-asset-thesis',  text: '$KAS never claimed to pay yield. The asset thesis is the only thesis now.' },
      { seq: 5, id: 'd4a9c3f6', slug: '05-question',          text: 'If idle yield is gated, where does the capital actually go?' },
    ],
  },
};

function buildImagePath(version, id, slug) {
  return `schedule-tweets/images/yt/yt-posts-${id}-${slug}.png`;
}

// --- Update yt-posts.json ---
function updateYTPosts() {
  const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  let updated = 0;
  for (const post of data.posts) {
    const upd = ytUpdates[post.id];
    if (!upd) continue;
    post.images = upd.slides.map(s => ({
      seq:        s.seq,
      image_id:   s.id,
      image_path: buildImagePath(upd.version, s.id, s.slug),
      slide_text: s.text,
    }));
    updated++;
  }
  fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
  console.log(`yt-posts.json: updated ${updated} posts`);
}

// --- Build IG-carousel.json entries ---
// Per skill rule: IG carousels reuse the same yt-posts images by default.
const igCarouselPosts = [
  {
    id: 'ig-carousel-2026-05-15-warsh-trap-kaspa-hedge',
    caption: 'Kevin Warsh walked into a macro trap.\n\nApril PPI printed +1.4% MoM, +6.0% YoY — the biggest 12-month jump since 2022.\n\nThe supposedly dovish chair may have to hike on day one.\n\nHere\'s what it means for $KAS and PoW assets.',
    hook: 'Kevin Warsh walked into a trap.',
    hashtags: ['#fed', '#kevinwarsh', '#macro', '#inflation', '#kaspa', '#kas', '#bitcoin', '#btc', '#crypto', '#cryptocurrency', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-warsh-trap-kaspa-hedge',
    yt_post_key: 'yt-post-2026-05-15-warsh-trap-kaspa-hedge',
  },
  {
    id: 'ig-carousel-2026-05-15-zombies-sbr-kaspa-leg',
    caption: 'The bear case for 2026 just lost two more legs.\n\n1. Four-year cycle zombies re-enter when October bottom doesn\'t print.\n2. SBR announcement — either outcome is bullish.\n\nStack both catalysts. $KAS beta follows Bitcoin\'s leg up.',
    hook: 'The bear case just lost two more legs.',
    hashtags: ['#bitcoin', '#btc', '#crypto', '#sbr', '#strategicbitcoinreserve', '#kaspa', '#kas', '#cryptocyle', '#bullrun', '#macro', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-zombies-sbr-kaspa-leg',
    yt_post_key: 'yt-post-2026-05-15-zombies-sbr-kaspa-leg',
  },
  {
    id: 'ig-carousel-2026-05-15-ai-mania-compressed-kaspa-window',
    caption: 'We\'re not in 2000. We might not even be in 1995.\n\nDot-com needed 28 years of groundwork before the mania.\nAI has no AT&T to fight — the timeline is compressed.\n\nKaspa\'s positioning window is shorter than most people think.',
    hook: 'We\'re not in 2000. We might not even be in 1995.',
    hashtags: ['#ai', '#dotcom', '#macro', '#tech', '#kaspa', '#kas', '#bitcoin', '#btc', '#crypto', '#cryptocurrency', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-ai-mania-compressed-kaspa-window',
    yt_post_key: 'yt-post-2026-05-15-ai-mania-compressed-kaspa-window',
  },
  {
    id: 'ig-carousel-2026-05-15-dry-powder-krc20-lottery',
    caption: '98x on Lab is a great number. The dry powder is the actual win.\n\n$200 across 10 KRC20s. One 1,000x = $20,000 back.\n\nKROAK just ran a quiet 6x while CT said KRC20s were dead.\n\nStack $KAS for the L1 move. Use dry powder for the lottery leg.',
    hook: '98x on Lab. The dry powder is the actual win.',
    hashtags: ['#kaspa', '#kas', '#krc20', '#kroak', '#memecoins', '#crypto', '#cryptocurrency', '#bitcoin', '#btc', '#altcoins', '#cryptotrading', '#cryptoinvesting'],
    source_yt_post: 'yt-post-2026-05-15-dry-powder-krc20-lottery',
    yt_post_key: 'yt-post-2026-05-15-dry-powder-krc20-lottery',
  },
  {
    id: 'ig-carousel-2026-05-15-kaspa-ghost-mascot-debate',
    caption: 'Hot take: Nacho\'s mascot logic broke the day Shai left.\n\nKaspa is a fully implemented GhostDAG.\nThe mascot should be the ghost token.\n\nKasper-the-Ghost: ~300K mcap. Nacho: ~3.6M.\n\nOne of these makes sense for the chain\'s architecture.',
    hook: 'Hot take: Nacho\'s mascot logic broke when Shai left.',
    hashtags: ['#kaspa', '#kas', '#krc20', '#ghostdag', '#nacho', '#kasper', '#memecoins', '#proofofwork', '#crypto', '#cryptocurrency', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-kaspa-ghost-mascot-debate',
    yt_post_key: 'yt-post-2026-05-15-kaspa-ghost-mascot-debate',
  },
  {
    id: 'ig-carousel-2026-05-15-winners-from-ruggers-kaspa-survivor',
    caption: 'The bear market did us a favor.\n\n3-signal filter for which projects survived:\n1. Devs still posting?\n2. Still on a CEX?\n3. Survived their worst on-chain day?\n\n$KAS passes all three. That\'s the canonical survivor.',
    hook: 'The bear market did us a favor.',
    hashtags: ['#kaspa', '#kas', '#krc20', '#kroak', '#proofofwork', '#fairlaunch', '#crypto', '#cryptocurrency', '#bitcoin', '#btc', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-winners-from-ruggers-kaspa-survivor',
    yt_post_key: 'yt-post-2026-05-15-winners-from-ruggers-kaspa-survivor',
  },
  {
    id: 'ig-carousel-2026-05-15-clarity-act-stables-kaspa-non-yield',
    caption: 'The Clarity Act just killed idle stable yield.\n\nYield is now activity-gated only.\nThe carry trade that required idle yield is dead.\n\nThat capital needs a new home.\n\n$KAS never claimed to pay yield. The asset thesis is the only thesis now.',
    hook: 'The Clarity Act just killed idle stable yield.',
    hashtags: ['#clarityact', '#stablecoins', '#defi', '#regulation', '#kaspa', '#kas', '#bitcoin', '#btc', '#crypto', '#cryptocurrency', '#cryptoinvesting', '#altcoins'],
    source_yt_post: 'yt-post-2026-05-15-clarity-act-stables-kaspa-non-yield',
    yt_post_key: 'yt-post-2026-05-15-clarity-act-stables-kaspa-non-yield',
  },
];

function updateIGCarousel() {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(IG_CAR_JSON, 'utf8'));
  } catch {
    data = { posts: [] };
  }

  const ytData = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const ytByID = {};
  for (const p of ytData.posts) ytByID[p.id] = p;

  const now = new Date().toISOString();
  let added = 0;

  for (const tpl of igCarouselPosts) {
    // Skip if already exists
    if (data.posts.find(p => p.id === tpl.id)) continue;

    const ytPost = ytByID[tpl.yt_post_key];
    if (!ytPost || !ytPost.images) { console.warn(`YT post not found or has no images: ${tpl.yt_post_key}`); continue; }

    const slides = ytPost.images.map(img => ({
      seq:        img.seq,
      image_id:   img.image_id,
      image_path: img.image_path,
      slide_text: img.slide_text,
    }));

    data.posts.push({
      id:                  tpl.id,
      caption:             tpl.caption,
      hook:                tpl.hook,
      hashtags:            tpl.hashtags,
      hashtag_placement:   'caption_end',
      slides,
      aspect_ratio:        '1:1',
      source_post:         tpl.source_yt_post,
      status:              'pending',
      created_at:          now,
      posted_at:           null,
      post_url:            null,
      likes:               null,
      comments:            null,
      engagement_captured_at:       null,
      capture_engagement_after_days: 7,
    });
    added++;
  }

  fs.writeFileSync(IG_CAR_JSON, JSON.stringify(data, null, 2));
  console.log(`IG-carousel.json: added ${added} carousel posts`);
}

updateYTPosts();
updateIGCarousel();
