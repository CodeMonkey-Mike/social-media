// Batch: generate YT post carousel slides + create IG carousel entries
// Uses YouTube Images persistent chat. Single browser session throughout.
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa';
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;

const YT_JSON  = path.join(SCHEDULE_DIR, 'data', 'yt-posts.json');
const IG_JSON  = path.join(SCHEDULE_DIR, 'data', 'ig-carousel.json');

// ── Version prompt templates ──────────────────────────────────────────────────
const V1 = (text) =>
  `Bold crypto news graphic, near-black background, dramatic lighting, bold all-caps white and neon green typography. No human faces. 1:1 square. ${text}`;

const V2 = ({ n, total, title, insight, boxLabel, detail }) =>
  `Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Top-left small teal all-caps label: '${n} OF ${total}'. Large bold white title: '${title}'. Below, a teal accent line: '${insight}'. At the bottom a dark rounded box with teal label '${boxLabel}' and white body text: '${detail}'. Clean minimal layout, no dramatic effects, no human faces.`;

// ── Post plans ────────────────────────────────────────────────────────────────
// Each post: { id, version, igCaption, slides: [{ uuid, seq, slug, slideText, prompt }] }
const POSTS = [

  // ── Post 1: Iran/bottom — Version 1, 5 slides ─────────────────────────────
  {
    id: 'yt-post-2026-05-20-bottom-behind-us-kaspa-beta',
    version: 1,
    igCaption: 'Hot take: if Iran caves, Bitcoin may never dip below 70K again. The macro is setting up faster than retail realizes. $KAS is the beta play. Is the cycle bottom already behind us — or one more dip?',
    slides: [
      { uuid: 'a9a4a79d', seq: '01', slug: 'hook-bears-mad',
        slideText: 'Hot take that\'ll make the bears mad.',
        prompt: V1('Dramatic hook slide. Center text area: large bold all-caps white text. Teal glowing accent border. Neon green highlight on key phrase. Dark near-black background with subtle light rays. No coins, no faces. Pure typography impact. Slide text: HOT TAKE THAT\'LL MAKE THE BEARS MAD') },
      { uuid: '313239db', seq: '02', slug: 'iran-bitcoin-70k',
        slideText: 'If Iran caves, Bitcoin may never dip under 70K again.',
        prompt: V1('News-flash slide. Bold all-caps white headline. Neon green accent on the price figure. Background: dramatic dark sky with faint geopolitical tension atmosphere. No faces. Slide concept: IF IRAN CAVES / BITCOIN NEVER BELOW 70K') },
      { uuid: '78bc49fa', seq: '03', slug: 'gulf-states-mediation',
        slideText: 'Qatar, Saudi, UAE stepped in. Mediation is working.',
        prompt: V1('News-flash slide. Three bold region labels stacked vertically in white all-caps. Neon green checkmarks next to each. Dark background. Bold typography. No faces. Concept: QATAR / SAUDI ARABIA / UAE / MEDIATION IS WORKING') },
      { uuid: '4d4bf7bb', seq: '04', slug: 'kas-beta-positioning',
        slideText: 'Cycle bottom may already be behind us. $KAS is the beta.',
        prompt: V1('Dramatic news-flash slide. Large teal glowing $KAS label prominent. Bold white all-caps text. Neon green accent on BETA. Dark near-black background with upward light rays. No faces. Concept: CYCLE BOTTOM BEHIND US / $KAS IS THE BETA') },
      { uuid: 'dbd28e64', seq: '05', slug: 'engagement-question',
        slideText: 'Bottom already behind us — or one more dip?',
        prompt: V1('Engagement question slide. Split design: left side neon green UP arrow, right side red DOWN arrow. Bold white all-caps question between them. Dark background. High contrast. No faces. Concept: BOTTOM ALREADY IN — OR ONE MORE DIP?') },
    ],
  },

  // ── Post 2: PMI expansion/KAS runway — Version 2, 5 slides ───────────────
  {
    id: 'yt-post-2026-05-20-pmi-expansion-kaspa-runway',
    version: 2,
    igCaption: 'CT is calling a recession. PMI says 52.7 — 18 straight months of expansion. Manufacturing is back. Retail is missing the window. $KAS runway is closing fast. How much accumulation time is actually left?',
    slides: [
      { uuid: '0960b4b8', seq: '01', slug: 'hook-ct-recession',
        slideText: 'CT is still calling this a recession.',
        prompt: V2({ n:1, total:5, title: 'CT IS STILL CALLING THIS A RECESSION', insight: 'The data says otherwise', boxLabel: 'THE SETUP', detail: 'PMI 52.7. 18 months of expansion. Manufacturing month 4 above 50.' }) },
      { uuid: '1f991d4b', seq: '02', slug: 'pmi-data',
        slideText: 'April PMI: 52.7. Anything above 50 means expansion.',
        prompt: V2({ n:2, total:5, title: 'APRIL PMI: 52.7', insight: 'Above 50 = expansion. Below 50 = contraction', boxLabel: 'THE NUMBER', detail: '18 straight months of expansion. Manufacturing: 4th month in a row above 50.' }) },
      { uuid: '31dcb431', seq: '03', slug: 'retail-missing-window',
        slideText: 'Retail isn\'t connecting the dots. The window is closing.',
        prompt: V2({ n:3, total:5, title: 'RETAIL IS MISSING THE CONNECTION', insight: 'Expansion + rate environment = asset rotation incoming', boxLabel: 'THE PROBLEM', detail: 'Most retail is looking at headlines, not PMI. The accumulation window is closing.' }) },
      { uuid: '317cb2e8', seq: '04', slug: 'kas-runway-closing',
        slideText: '$KAS has a runway most people don\'t see closing.',
        prompt: V2({ n:4, total:5, title: '$KAS RUNWAY IS CLOSING', insight: 'Low entry + macro tailwind = asymmetric setup', boxLabel: 'THE OPPORTUNITY', detail: 'When PMI-driven expansion hits crypto awareness, the entry closes. $KAS is still early.' }) },
      { uuid: 'cc713205', seq: '05', slug: 'engagement-question',
        slideText: 'How much accumulation runway is actually left?',
        prompt: V2({ n:5, total:5, title: 'HOW MUCH RUNWAY IS LEFT?', insight: 'You tell me', boxLabel: 'YOUR TAKE', detail: 'If we\'re 18 months into expansion already — how much time is actually left to accumulate?' }) },
    ],
  },

  // ── Post 3: Minnesota HF 3709 — Version 2, 4 slides ──────────────────────
  {
    id: 'yt-post-2026-05-20-minnesota-custody-kaspa-institutional',
    version: 2,
    igCaption: 'Minnesota just signed HF 3709. Every bank can custody Bitcoin starting Aug 1. State-by-state adoption is how institutions get in. $KAS checks every box on their checklist. Which box do most chains fail first?',
    slides: [
      { uuid: 'f9fe2d98', seq: '01', slug: 'hook-minnesota-signed',
        slideText: 'Minnesota just signed HF 3709 into law.',
        prompt: V2({ n:1, total:4, title: 'MINNESOTA JUST SIGNED HF 3709', insight: 'Every bank can custody Bitcoin starting Aug 1', boxLabel: 'THE VOTE', detail: '130-4 in the House. 51-16 in the Senate. Gov Walz signed Friday.' }) },
      { uuid: 'c9ab42e1', seq: '02', slug: 'state-by-state-rolling',
        slideText: 'State-by-state adoption is rolling. This is how it happens.',
        prompt: V2({ n:2, total:4, title: 'STATE BY STATE ADOPTION IS ROLLING', insight: 'One state signs → others follow', boxLabel: 'THE MECHANISM', detail: 'Banks can now custody Bitcoin as an asset class. This is the on-ramp for institutional capital at the state level.' }) },
      { uuid: '1bd4ef3c', seq: '03', slug: 'kas-four-box-checklist',
        slideText: '$KAS checks every institutional box. Most chains don\'t.',
        prompt: V2({ n:3, total:4, title: '$KAS CHECKS ALL FOUR BOXES', insight: 'Security. Settlement. Decentralization. Stress stability.', boxLabel: 'THE FILTER', detail: 'Institutional allocators use a four-box screen. $KAS is the only PoW alt that clears all four.' }) },
      { uuid: '174aaf69', seq: '04', slug: 'engagement-question',
        slideText: 'Which box do most chains fail on first?',
        prompt: V2({ n:4, total:4, title: 'WHICH BOX DO MOST CHAINS FAIL FIRST?', insight: 'Security / Settlement / Decentralization / Stress stability', boxLabel: 'YOUR TAKE', detail: 'Of the four institutional boxes — which one eliminates the most competitors first?' }) },
    ],
  },

  // ── Post 4: Hard fork priced in — Version 1, 5 slides ────────────────────
  {
    id: 'yt-post-2026-05-20-hard-fork-23-days-pricing-in',
    version: 1,
    igCaption: "Hot take: don't expect the $KAS pump in 23 days. Everyone knows the date — that means it's already priced in. The real move lands when the crowd stops watching. Do you think $KAS pumps before, on, or after the fork?",
    slides: [
      { uuid: '4f83d205', seq: '01', slug: 'hook-community-mad',
        slideText: 'Hot take that\'ll make the Kaspa community mad.',
        prompt: V1('Dramatic hook slide. Bold all-caps white text. Teal $KAS logo glow accent. Neon red warning accent. Dark near-black background. High contrast typography. No faces. Slide text: HOT TAKE THAT\'LL MAKE THE KASPA COMMUNITY MAD') },
      { uuid: '9b639801', seq: '02', slug: 'fork-23-days-no-pump',
        slideText: 'Hard fork is 23 days out. Don\'t expect the pump.',
        prompt: V1('News-flash slide. Large countdown visual: "23 DAYS" in bold neon green. Crossed-out rocket icon (no pump). White all-caps text. Dark background. No faces. Concept: HARD FORK 23 DAYS OUT / NO PUMP EXPECTED') },
      { uuid: '2e48acb6', seq: '03', slug: 'priced-in-everyone-knows',
        slideText: 'When everyone knows the catalyst, it\'s already priced in.',
        prompt: V1('Bold educational slide. Large bold white all-caps headline. Neon green accent on PRICED IN. Crowd of small identical figures below the text to suggest "everyone knows." Dark background. No faces. Concept: WHEN EVERYONE KNOWS / IT\'S ALREADY PRICED IN') },
      { uuid: '45a965bc', seq: '04', slug: 'real-pump-after-crowd',
        slideText: 'The real move lands when the crowd stops watching.',
        prompt: V1('Dramatic news-flash slide. Bold white all-caps text. Neon green accent on REAL MOVE. Dark background with faint upward light ray. Suspenseful mood. No faces. Concept: THE REAL MOVE LANDS / WHEN THE CROWD STOPS WATCHING') },
      { uuid: 'ec8141d7', seq: '05', slug: 'engagement-question',
        slideText: 'Does $KAS pump before, on, or weeks after the fork?',
        prompt: V1('Poll-style engagement slide. Three bold options stacked: BEFORE / ON THE DAY / WEEKS AFTER — each on its own line in white all-caps. Teal $KAS accent. Dark background. No faces. Concept: WHEN DOES $KAS PUMP?') },
    ],
  },

  // ── Post 5: Institutional checklist — Version 2, 5 slides ────────────────
  {
    id: 'yt-post-2026-05-20-institutions-infrastructure-kaspa-checklist',
    version: 2,
    igCaption: 'Institutions use a 4-box filter: security, instant settlement, decentralization, stability under stress. $KAS is the only PoW alt that checks all four. Which box trips most competitors first?',
    slides: [
      { uuid: '21eb4251', seq: '01', slug: 'hook-no-memes',
        slideText: 'Institutions don\'t look for memes. They have a checklist.',
        prompt: V2({ n:1, total:5, title: 'INSTITUTIONS DON\'T BUY MEMES', insight: 'They have allocators, risk committees, and a checklist', boxLabel: 'THE REALITY', detail: 'The screening process for institutional crypto is brutal. 99% of CT gets ignored.' }) },
      { uuid: '1b7d1287', seq: '02', slug: 'box-1-security',
        slideText: 'Box 1: Security. Proven PoW. No exploit history.',
        prompt: V2({ n:2, total:5, title: 'BOX 1: SECURITY', insight: 'Proven PoW with no exploit history', boxLabel: 'THE STANDARD', detail: '$KAS: GhostDAG PoW, fair launch, no pre-mine. No exploit on record. Institutions want battle-tested.' }) },
      { uuid: '7a7b7b9a', seq: '03', slug: 'box-2-instant-settlement',
        slideText: 'Box 2: Instant settlement. BlockDAG processes in real time.',
        prompt: V2({ n:3, total:5, title: 'BOX 2: INSTANT SETTLEMENT', insight: 'BlockDAG architecture processes transactions in real time', boxLabel: 'THE EDGE', detail: 'No waiting for confirmations. $KAS settles instantly at scale — what institutions need for real deployment.' }) },
      { uuid: 'b1c1a8db', seq: '04', slug: 'box-3-4-decentralized-stress',
        slideText: 'Box 3: Decentralized. Box 4: Stable under stress.',
        prompt: V2({ n:4, total:5, title: 'BOX 3 + BOX 4', insight: 'Decentralized + stable under market stress', boxLabel: 'THE FULL PASS', detail: '$KAS is the only PoW alt that checks all four institutional boxes. Most chains fail at box 1 or 2.' }) },
      { uuid: '01b045a8', seq: '05', slug: 'engagement-question',
        slideText: 'Which box trips up most $KAS competitors first?',
        prompt: V2({ n:5, total:5, title: 'WHICH BOX TRIPS COMPETITORS FIRST?', insight: 'Security / Settlement / Decentralization / Stress stability', boxLabel: 'YOUR TAKE', detail: 'Of the four institutional boxes — which one eliminates the most competing chains first?' }) },
    ],
  },

  // ── Post 6: Influencer integrity — Version 1, 4 slides ───────────────────
  {
    id: 'yt-post-2026-05-20-influencer-integrity-only-already-owned',
    version: 1,
    igCaption: "I won't call low-mcap coins. The standard influencer play: shill at 100K mcap, dump on your audience. I only talk about coins I already own and made money on. What's the biggest red flag that lost your trust in a crypto influencer?",
    slides: [
      { uuid: 'c0acf492', seq: '01', slug: 'hook-wont-call-low-mcap',
        slideText: 'I won\'t call new low-mcap coins. Here\'s why.',
        prompt: V1('Bold principled statement slide. Large bold all-caps white text. Teal accent line below headline. Dark background. Clean, trustworthy design. No faces. Concept: I WON\'T CALL NEW LOW-MCAP COINS / HERE\'S WHY') },
      { uuid: '2c0835e6', seq: '02', slug: 'influencer-playbook-exposed',
        slideText: 'The play: shill at 100K mcap, dump on your audience.',
        prompt: V1('Exposé-style slide. Bold red neon accent on THE PLAY. White all-caps text. Dark background with warning atmosphere. Dramatic lighting. No faces. Concept: THE PLAY: SHILL 100K MCAP / DUMP ON YOUR AUDIENCE') },
      { uuid: '18cd1e3a', seq: '03', slug: 'my-rule-own-it-first',
        slideText: 'My rule: only coins I already own and made money on.',
        prompt: V1('Integrity statement slide. Large bold white all-caps headline. Teal checkmark accent. Clean dark background with teal glow. Trustworthy, confident tone. No faces. Concept: MY RULE: ONLY COINS I OWN / AND ALREADY MADE MONEY ON') },
      { uuid: '1d3e8d61', seq: '04', slug: 'engagement-question',
        slideText: 'Biggest red flag that made you stop trusting an influencer?',
        prompt: V1('Engagement question slide. Bold white all-caps question. Neon green question mark accent. Dark background. High-contrast minimal design. No faces. Concept: BIGGEST RED FLAG / THAT LOST YOUR TRUST?') },
    ],
  },

  // ── Post 7: AI wages/retail — Version 1, 5 slides ────────────────────────
  {
    id: 'yt-post-2026-05-20-ai-tug-of-war-tipping-kaspa-retail',
    version: 1,
    igCaption: "The biggest thing blocking parabolic crypto isn't the Fed — it's wages. AI is eating jobs but the tug-of-war is tipping. When retail gets employed again, it flows back into crypto. When does AI tip to net hiring: Q2, Q3, Q4?",
    slides: [
      { uuid: '3b47b002', seq: '01', slug: 'hook-not-the-fed',
        slideText: 'The biggest thing blocking parabolic crypto isn\'t the Fed.',
        prompt: V1('Bold hook slide. Large all-caps white text with FED crossed out in red neon. Dark background with dramatic lighting. No faces. Concept: THE BIGGEST BLOCKER ISN\'T THE FED') },
      { uuid: '34c57330', seq: '02', slug: 'its-wages-ai-eating-jobs',
        slideText: 'It\'s wages. AI is eating jobs at the big-headcount end.',
        prompt: V1('News-flash slide. Bold white all-caps: IT\'S WAGES. Below, neon green: AI IS EATING JOBS. Dark near-black background. Robotic arm visual suggestion in background. No faces. Concept: IT\'S WAGES / AI EATING BIG-HEADCOUNT JOBS') },
      { uuid: '3fbe9e4d', seq: '03', slug: 'adp-up-tug-tipping',
        slideText: 'ADP weekly is up. The tug-of-war is tipping to hiring.',
        prompt: V1('News-flash data slide. Bold white ADP weekly stat. Neon green UP arrow prominent. Tug-of-war visual with the hiring side winning. Dark background. No faces. Concept: ADP UP / TUG-OF-WAR TIPPING TO HIRING') },
      { uuid: '3f6c059c', seq: '04', slug: 'retail-flows-back-crypto',
        slideText: 'When retail gets employed again, it flows into crypto.',
        prompt: V1('Flow diagram slide. Bold white all-caps text: EMPLOYED RETAIL → CRYPTO. Neon green arrow showing the flow. Dark background with golden glow at the destination. No faces. Concept: EMPLOYMENT → CRYPTO FLOWS') },
      { uuid: 'ed5b9124', seq: '05', slug: 'engagement-question',
        slideText: 'When does AI tip to net hiring: Q2, Q3, Q4, or later?',
        prompt: V1('Poll-style slide. Four bold options stacked: Q2 / Q3 / Q4 / LATER — each in white all-caps with teal accent lines between them. Dark background. No faces. Concept: WHEN DOES AI TIP TO NET HIRING?') },
    ],
  },
];

// ── JSON helpers ──────────────────────────────────────────────────────────────
function updateYtJson(postId, slides) {
  const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const post = data.posts.find(p => p.id === postId);
  if (!post) { console.log(`  ⚠ YT post not found: ${postId}`); return; }
  post.images = slides.map(s => ({
    seq: parseInt(s.seq),
    image_id:   s.uuid,
    image_path: `schedule-tweets/images/yt/yt-posts-${s.uuid}-${s.seq}-${s.slug}.png`,
    slide_text: s.slideText,
  }));
  fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ yt-posts.json updated: ${postId}`);
}

function addIgCarousel(post) {
  const ig = JSON.parse(fs.readFileSync(IG_JSON, 'utf8'));

  // Check if already exists
  if (ig.posts.find(p => p.source_post === post.id)) {
    console.log(`  ℹ IG carousel already exists for: ${post.id}`);
    return;
  }

  const ytData = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const ytPost = ytData.posts.find(p => p.id === post.id);
  if (!ytPost || !ytPost.images || ytPost.images.length === 0) {
    console.log(`  ⚠ No images on YT post yet: ${post.id}`);
    return;
  }

  const slug = post.id.replace('yt-post-', '');
  const entry = {
    id:          `ig-carousel-${slug}`,
    source_post: post.id,
    caption:     post.igCaption,
    hashtags:    ['#crypto', '#cryptocurrency', '#bitcoin', '#btc', '#kaspa', '#kas', '#krc20', '#proofofwork', '#fairlaunch', '#macro', '#investing', '#cryptoinvesting', '#cryptonews'],
    hashtag_placement: 'caption_end',
    images:      ytPost.images.map(img => ({
      seq:        img.seq,
      image_id:   img.image_id,
      image_path: img.image_path,
    })),
    aspect_ratio: '1:1',
    status:      'pending',
    created_at:  new Date().toISOString(),
    posted_at:   null,
    post_url:    null,
  };

  ig.posts.push(entry);
  fs.writeFileSync(IG_JSON, JSON.stringify(ig, null, 2));
  console.log(`  ✓ IG carousel added: ${entry.id}`);
}

// ── Reconnect if the page/tab was closed by ChatGPT ─────────────────────────
async function ensurePageOpen(page) {
  try {
    await page.evaluate(() => document.title);  // lightweight liveness check
    return;
  } catch {
    console.log('     ⚠ Page closed — reopening chat...');
    try {
      await page.goto(CHAT_URL);
      await page.waitForLoadState('domcontentloaded');
      await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
      await page.waitForTimeout(3000);
      console.log('     Chat reopened ✓');
    } catch (err) {
      throw new Error(`Could not reopen chat: ${err.message}`);
    }
  }
}

// ── Core: generate one image on an already-open page ─────────────────────────
async function generateOne(page, { targetPath, prompt, label }) {
  console.log(`\n  → ${label}`);
  console.log(`     ${path.basename(targetPath)}`);

  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const seenUrls   = new Set();
  const timestamps = new Map();
  const buffers    = new Map();

  const onResponse = (response) => {
    const url = response.url();
    if (!url.includes(IMAGE_PATTERN)) return;
    seenUrls.add(url);
    if (!timestamps.has(url)) timestamps.set(url, Date.now());
    if (!buffers.has(url)) buffers.set(url, response.body().catch(() => null));
  };
  page.on('response', onResponse);

  await page.waitForTimeout(2000);
  const baseline     = new Set(seenUrls);
  const promptSentAt = Date.now();

  // Ensure the page is still alive before typing
  await ensurePageOpen(page);

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();

  // Character-by-character typing — 10–30ms per char
  for (const char of prompt) {
    await page.keyboard.type(char);
    await page.waitForTimeout(Math.floor(Math.random() * 21) + 10);
  }
  await page.keyboard.press('Enter');
  console.log(`     Prompt sent — waiting for image...`);

  let imgUrl = null;
  const start = Date.now();
  let lastCount = 0;
  let stableSince = null;

  while (Date.now() - start < MAX_WAIT_MS) {
    const candidates = [...seenUrls]
      .filter(u => !baseline.has(u))
      .filter(u => (timestamps.get(u) - promptSentAt) >= MIN_GEN_MS);

    if (candidates.length > lastCount) {
      lastCount   = candidates.length;
      stableSince = Date.now();
    } else if (candidates.length > 0 && stableSince && Date.now() - stableSince >= 3000) {
      imgUrl = candidates[candidates.length - 1];
      break;
    }
    await page.waitForTimeout(1500);
  }

  page.off('response', onResponse);

  if (!imgUrl) throw new Error(`Timed out: ${label}`);

  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error(`Empty buffer: ${label}`);

  fs.writeFileSync(targetPath, buffer);
  console.log(`     Saved: ${(buffer.length / 1024).toFixed(0)} KB`);

  // 20–30s human-like pause before next prompt
  const pauseMs = Math.floor(Math.random() * 11000) + 20000;
  console.log(`     Waiting ${(pauseMs / 1000).toFixed(1)}s...`);
  await page.waitForTimeout(pauseMs);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const totalSlides = POSTS.reduce((n, p) => n + p.slides.length, 0);
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`YT post images: ${POSTS.length} posts, ${totalSlides} slides total`);
  console.log(`Chat: ${CHAT_URL}`);
  console.log(`${'━'.repeat(60)}\n`);

  console.log('Launching Chrome (once)...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await browser.newPage();

  const imgPattern = `**/*${IMAGE_PATTERN}*`;
  await page.route(imgPattern, route => route.abort());
  console.log(`Navigating to YT Images chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready.\n');

  let successCount = 0;
  let failCount    = 0;

  for (let pi = 0; pi < POSTS.length; pi++) {
    const post = POSTS[pi];
    console.log(`${'═'.repeat(60)}`);
    console.log(`Post [${pi + 1}/${POSTS.length}]: ${post.id}`);
    console.log(`Version ${post.version}, ${post.slides.length} slides`);
    console.log(`${'═'.repeat(60)}`);

    const generatedSlides = [];

    for (let si = 0; si < post.slides.length; si++) {
      const slide = post.slides[si];
      const fname = `yt-posts-${slide.uuid}-${slide.seq}-${slide.slug}.png`;
      const fpath = path.join(IMAGES_DIR, 'yt', fname);

      // Skip if file already exists and is a real image (> 500 KB)
      if (fs.existsSync(fpath)) {
        const size = fs.statSync(fpath).size;
        if (size > 500 * 1024) {
          console.log(`  ↷ Skipping (already saved ${(size/1024).toFixed(0)} KB): ${fname}`);
          generatedSlides.push(slide);
          continue;
        } else {
          console.log(`  ⚠ File too small (${(size/1024).toFixed(0)} KB) — regenerating: ${fname}`);
        }
      }

      try {
        await generateOne(page, { targetPath: fpath, prompt: slide.prompt, label: `${slide.seq}/${post.slides.length} — ${slide.slideText.slice(0, 50)}` });
        generatedSlides.push(slide);
        successCount++;
      } catch (err) {
        console.error(`  ✗ Slide failed: ${err.message}`);
        failCount++;
      }
    }

    // Update yt-posts.json after all slides for this post
    if (generatedSlides.length > 0) {
      updateYtJson(post.id, generatedSlides);
    }

    // Add IG carousel entry (reuses same images)
    addIgCarousel(post);
  }

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Done. ✓ ${successCount} slides saved  ✗ ${failCount} failed`);
  console.log(`${'━'.repeat(60)}\n`);

  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
