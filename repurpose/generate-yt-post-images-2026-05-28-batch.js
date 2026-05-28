// Batch: generate YT post carousel slides for the 3 pending YT posts (2026-05-28).
// Cloned from generate-yt-post-images-batch.js. Single Chrome session, fresh chat,
// V2 templates (V4 needs topic-relevant reference photos we don't have on hand).
// Auto-creates linked IG carousel entries that reuse the YT slide paths.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/';
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;

const YT_JSON = path.join(SCHEDULE_DIR, 'data', 'yt-posts.json');
const IG_JSON = path.join(SCHEDULE_DIR, 'data', 'ig-carousel.json');

const V2 = ({ n, total, title, insight, boxLabel, detail }) =>
  `Editorial carousel slide, 1:1 square. Very dark near-black background with subtle texture. Top-left small teal all-caps label: '${n} OF ${total}'. Large bold white title: '${title}'. Below, a teal accent line: '${insight}'. At the bottom a dark rounded box with teal label '${boxLabel}' and white body text: '${detail}'. Clean minimal layout, no dramatic effects, no human faces.`;

const POSTS = [
  // ── SPX6900 — Version 2, 5 slides ─────────────────────────────────────────
  {
    id: 'yt-post-2026-05-27-spx6900-flip-stock-market',
    version: 2,
    igCaption: "A meme coin is openly trying to flip the entire US stock market — and it might be the safer play on my whole meme list. $SPX6900 sits around $390M, parodies the S&P 500, and survived the bear that wiped out its peers. Bigger cap, smaller multiplier, much higher chance it's still here next year. So would you take the $390M safer play, or chase a sub-$10M lottery ticket?",
    slides: [
      { uuid: 'f017b4c8', seq: '01', slug: 'hook-meme-flips-stock-market',
        slideText: 'A meme coin is openly trying to flip the US stock market.',
        prompt: V2({ n: 1, total: 5, title: 'A MEME IS TRYING TO FLIP THE STOCK MARKET', insight: 'And it might be the safer play on my list', boxLabel: 'THE SETUP', detail: '$SPX6900 parodies the S&P 500. The whole joke is in the name: 6900 is more than 500.' }) },
      { uuid: 'ece6ebf2', seq: '02', slug: 'crypto-flips-global-stocks',
        slideText: 'Total crypto flips global stocks this decade.',
        prompt: V2({ n: 2, total: 5, title: 'CRYPTO FLIPS GLOBAL STOCKS THIS DECADE', insight: 'A real structural shift, not a meme', boxLabel: 'THE THESIS', detail: 'If you believe crypto flips global equities, a token built to front-run that trade with humor is on the right side of the map.' }) },
      { uuid: 'fd25fba1', seq: '03', slug: 'narrative-is-the-product',
        slideText: 'For a parody coin, the narrative IS the product.',
        prompt: V2({ n: 3, total: 5, title: 'THE NARRATIVE IS THE PRODUCT', insight: 'No premine, renounced mint, transparent burn', boxLabel: 'THE POINT', detail: 'SPX is not pretending to be an L1 or a DeFi protocol. It is a flag people rally around. On crypto Twitter, attention is the only utility a meme ever needed.' }) },
      { uuid: 'f410e389', seq: '04', slug: 'bigger-cap-safer-play',
        slideText: 'Bigger cap can be the safer play.',
        prompt: V2({ n: 4, total: 5, title: 'THE BIGGER CAP CAN BE THE SAFER PLAY', insight: 'Smaller multiples, far higher survival', boxLabel: 'THE MATH', detail: 'A $5M meme can 100x to half a billion. SPX at $390M doing a 100x means flipping a real chunk of the actual stock market — but it already survived the wipeout.' }) },
      { uuid: 'c7957665', seq: '05', slug: 'engagement-question',
        slideText: '$390M safer play, or sub-$10M lottery ticket?',
        prompt: V2({ n: 5, total: 5, title: '$390M SAFER PLAY OR $10M LOTTERY TICKET?', insight: 'Pick which risk you can live with', boxLabel: 'YOUR PICK', detail: 'Drop your pick and your reasoning. The lottery ticket vs the survivor — which one are you actually buying?' }) },
    ],
  },

  // ── Base bear-survivor filter — Version 2, 5 slides ───────────────────────
  {
    id: 'yt-post-2026-05-27-bear-survivor-filter-base-memes',
    version: 2,
    igCaption: "How I decide which meme coins to keep in a bear: it's not vibes, it's two numbers plus one gut check. Number one — CEX listings held through the worst of it. Number two — content cadence still daily. Gut check — are the devs still here? On Base: $doginme, $KEYCAT, $TOSHI, $HOUSE all pass. Run the filter on your own bags. How many of your coins are still listing AND still posting?",
    slides: [
      { uuid: 'd5e511fd', seq: '01', slug: 'hook-two-numbers-one-check',
        slideText: 'Two numbers and a gut check decide what survives a bear.',
        prompt: V2({ n: 1, total: 5, title: 'TWO NUMBERS AND ONE GUT CHECK', insight: 'How I decide what stays in a bear', boxLabel: 'THE FILTER', detail: 'Not vibes. Not art. Two trackable signals plus one honest question — that is the entire framework.' }) },
      { uuid: 'e1f6eb5b', seq: '02', slug: 'signal-cex-listings',
        slideText: 'Signal one: CEX listings held over time.',
        prompt: V2({ n: 2, total: 5, title: 'CEX LISTINGS HELD OVER TIME', insight: 'Exchanges vote with money', boxLabel: 'WHY IT WORKS', detail: 'Listings cost money to keep. A project that keeps most of them through a brutal bear is being kept alive by both sides voting real money.' }) },
      { uuid: 'e5c44b85', seq: '03', slug: 'signal-content-cadence',
        slideText: 'Signal two: still posting every day.',
        prompt: V2({ n: 3, total: 5, title: 'STILL POSTING EVERY SINGLE DAY', insight: 'Dead projects go quiet on Twitter first', boxLabel: 'WHY IT WORKS', detail: 'Living projects keep shipping memes, updates, and noise even when nobody is buying. The Twitter feed goes silent long before the chart does.' }) },
      { uuid: '20f1192b', seq: '04', slug: 'base-survivors',
        slideText: 'On Base: $doginme, $KEYCAT, $TOSHI, $HOUSE all pass.',
        prompt: V2({ n: 4, total: 5, title: 'ON BASE: WHO PASSES THE FILTER', insight: '$doginme, $KEYCAT, $TOSHI, $HOUSE', boxLabel: 'THE SURVIVORS', detail: 'Four Base memes kept their listings, kept their cadence, and quietly grew through the worst of the bear. The ones that went silent are not on this list.' }) },
      { uuid: 'f05b0f42', seq: '05', slug: 'engagement-question',
        slideText: 'Run the filter on your bags. Which one passed?',
        prompt: V2({ n: 5, total: 5, title: 'RUN THE FILTER ON YOUR OWN BAGS', insight: 'Which coin are you most confident survived?', boxLabel: 'YOUR TURN', detail: 'How many of your coins are still listing AND still posting daily? Drop the one you are most confident survived.' }) },
    ],
  },

  // ── ElizaOS (ai16z rebrand) — Version 2, 5 slides ─────────────────────────
  {
    id: 'yt-post-2026-05-27-elizaos-ai-agent-thesis',
    version: 2,
    igCaption: "The third-biggest token of the last AI run just quietly rebranded. ai16z is now ElizaOS — same project, same founder, swapped one-for-one. A rebrand is a non-event mechanically; the dip was emotional, not structural. Thesis: $TAO is the AI layer nobody owns; ElizaOS is the framework riding on top. We are at the 1992 of the AI buildout. Which do you want more of: the layer or the framework?",
    slides: [
      { uuid: 'a46d9d22', seq: '01', slug: 'hook-quiet-rebrand',
        slideText: 'The 3rd-biggest AI token just quietly rebranded.',
        prompt: V2({ n: 1, total: 5, title: 'THE 3RD-BIGGEST AI TOKEN JUST REBRANDED', insight: 'Almost nobody noticed — that is the setup', boxLabel: 'THE QUIET', detail: 'ai16z is now ElizaOS. Same founder, same tech, cleaner name. The kind of quiet that usually precedes the next wave.' }) },
      { uuid: '2066f4c6', seq: '02', slug: 'last-run-top-three',
        slideText: 'Last AI run, three names led: $TAO, Virtuals, ai16z.',
        prompt: V2({ n: 2, total: 5, title: 'LAST AI RUN, THREE NAMES LED', insight: '$TAO, Virtuals, and ai16z', boxLabel: 'THE STACK', detail: '$TAO was the underlying layer. Virtuals was the launchpad. ai16z was the framework everyone was building on. Top tier of the whole narrative.' }) },
      { uuid: '1153b07a', seq: '03', slug: 'rebrand-is-non-event',
        slideText: 'A rebrand is mechanically a non-event.',
        prompt: V2({ n: 3, total: 5, title: 'A REBRAND IS MECHANICALLY A NON-EVENT', insight: 'Same supply, swapped one-for-one', boxLabel: 'THE REALITY', detail: 'Token swap supported across major exchanges. The dip on the announcement was emotional, not structural — exactly where the quiet accumulation tends to happen.' }) },
      { uuid: '68d1acd7', seq: '04', slug: 'layer-and-framework',
        slideText: '$TAO is the layer. ElizaOS is the framework on top.',
        prompt: V2({ n: 4, total: 5, title: 'TWO SIDES OF THE SAME IDEA', insight: '$TAO the layer, ElizaOS the framework', boxLabel: 'THE THESIS', detail: 'AI is becoming a neutral layer nobody owns. $TAO is the inference layer. ElizaOS is the framework the agents themselves run on. We are at the 1992 of the AI buildout.' }) },
      { uuid: '00705203', seq: '05', slug: 'engagement-question',
        slideText: 'Which do you want more of: the layer, or the framework?',
        prompt: V2({ n: 5, total: 5, title: 'LAYER OR FRAMEWORK — WHICH DO YOU WANT MORE OF?', insight: 'When the AI-agent wave comes roaring back', boxLabel: 'YOUR CALL', detail: 'Pick a side: the base layer $TAO, or the framework ElizaOS. Drop your reasoning below.' }) },
    ],
  },
];

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

async function ensurePageOpen(page) {
  try { await page.evaluate(() => document.title); return; } catch {
    console.log('     ⚠ Page closed — reopening chat...');
    await page.goto(CHAT_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
    await page.waitForTimeout(3000);
    console.log('     Chat reopened ✓');
  }
}

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
  await ensurePageOpen(page);

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();
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

  if (!imgUrl) throw new Error(`Timed out waiting for image: ${label}`);
  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error(`Empty buffer: ${label}`);

  fs.writeFileSync(targetPath, buffer);
  console.log(`     Saved: ${(buffer.length / 1024).toFixed(0)} KB`);

  const pauseMs = Math.floor(Math.random() * 11000) + 20000;
  console.log(`     Waiting ${(pauseMs / 1000).toFixed(1)}s before next prompt...`);
  await page.waitForTimeout(pauseMs);
}

async function main() {
  const totalSlides = POSTS.reduce((sum, p) => sum + p.slides.length, 0);
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Batch: ${POSTS.length} pending YT posts, ${totalSlides} slides total (V2)`);
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
  console.log(`Navigating to a fresh chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  if (page.url().includes('/c/')) {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready. Starting batch...\n');

  let successCount = 0;
  let failCount    = 0;

  for (let pi = 0; pi < POSTS.length; pi++) {
    const post = POSTS[pi];
    console.log(`${'─'.repeat(60)}`);
    console.log(`POST [${pi + 1}/${POSTS.length}] ${post.id}`);

    for (let si = 0; si < post.slides.length; si++) {
      const s = post.slides[si];
      console.log(`\n  Slide [${si + 1}/${post.slides.length}] ${s.uuid} — ${s.slug}`);
      const target = path.join(IMAGES_DIR, 'yt', `yt-posts-${s.uuid}-${s.seq}-${s.slug}.png`);
      if (fs.existsSync(target)) {
        console.log(`    [SKIP] ${path.basename(target)} already exists`);
        continue;
      }
      try {
        await generateOne(page, { targetPath: target, prompt: s.prompt, label: `${post.id} / ${s.slug}` });
        successCount++;
      } catch (err) {
        console.error(`    ✗ FAILED: ${err.message}`);
        failCount++;
      }
    }

    // Update JSONs after all slides for this post are done
    updateYtJson(post.id, post.slides);
    addIgCarousel(post);
  }

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Done. Success: ${successCount}, Failed: ${failCount}`);
  console.log(`${'━'.repeat(60)}\n`);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
