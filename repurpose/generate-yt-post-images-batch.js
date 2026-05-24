// Batch: generate YT post carousel slides + create IG carousel entries
// Uses YouTube Images persistent chat. Single browser session throughout.
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/';  // FRESH chat per run — a history-heavy persistent chat caused stale-image grabs (fixed 2026-05-24)
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

  // ── a3 Clarity Act stablecoin yield — Version 2, 5 slides ──────────────────
  {
    id: 'yt-post-2026-05-21-a3-clarity-act-yield-is-the-whole-point',
    version: 2,
    igCaption: "The Clarity Act is at the Senate floor, and the banking lobby is fighting to gut the one part that matters to retail: stablecoin yield. The text allows yield from bona-fide protocol activity, so USDC and USDT can keep paying. Banks want it narrowed until nothing qualifies. Where do you stand on stablecoin yield?",
    slides: [
      { uuid: 'a3010001', seq: '01', slug: 'hook-gut-yield',
        slideText: 'The banking lobby is fighting to gut stablecoin yield.',
        prompt: V2({ n: 1, total: 5, title: 'THE BANKING LOBBY WANTS TO KILL STABLECOIN YIELD', insight: 'The one part of the bill retail cares about', boxLabel: 'THE FIGHT', detail: 'The Clarity Act is at the Senate floor, and banks are lobbying to strip the yield provision.' }) },
      { uuid: 'a3020002', seq: '02', slug: 'bona-fide-yield',
        slideText: 'The bill still allows yield from real protocol activity.',
        prompt: V2({ n: 2, total: 5, title: 'YIELD FROM REAL ACTIVITY STAYS LEGAL', insight: 'Bona-fide protocol yield is allowed', boxLabel: 'THE TEXT', detail: 'Tillis and Alsobrooks banned bank-deposit-equivalent yield but kept bona-fide activity. USDC and USDT can still pay.' }) },
      { uuid: 'a3030003', seq: '03', slug: 'narrow-it-down',
        slideText: 'Banks want the language narrowed until nothing qualifies.',
        prompt: V2({ n: 3, total: 5, title: 'BANKS WANT IT NARROWED TO ZERO', insight: 'Refine the language is lobby code', boxLabel: 'THE PLAYBOOK', detail: 'The American Bankers Association is writing letters to narrow the wording until no stablecoin qualifies.' }) },
      { uuid: 'a3040004', seq: '04', slug: 'yield-whole-point',
        slideText: 'Yield is the whole point for the little guy.',
        prompt: V2({ n: 4, total: 5, title: 'YIELD IS THE WHOLE POINT', insight: 'Kill it and 4% on USDC dies day one', boxLabel: 'WHY IT MATTERS', detail: 'Strip the yield and the retail upside of this entire bill disappears the moment it passes.' }) },
      { uuid: 'a3050005', seq: '05', slug: 'engagement-question',
        slideText: 'Where do you stand on stablecoin yield?',
        prompt: V2({ n: 5, total: 5, title: 'WHERE DO YOU STAND ON STABLECOIN YIELD?', insight: 'And how much of your bag is parked there?', boxLabel: 'YOUR TAKE', detail: 'Is stablecoin yield the killer feature of this bill, or a footnote? Where is your cash sitting?' }) },
    ],
  },

  // ── c4 Real meme devs time launches — Version 2, 5 slides ──────────────────
  {
    id: 'yt-post-2026-05-21-c4-real-meme-devs-time-their-launches',
    version: 2,
    igCaption: "Want to know if a meme launch is serious? Look at the calendar. $PENGU launched into the Trump pump of 2024, not a bear, because a funded team could wait for the rally. The gap between bidless tape and a pump is the gap between a $50M and a $1.7B mcap. When does the next serious meme launch?",
    slides: [
      { uuid: 'c4010001', seq: '01', slug: 'hook-calendar',
        slideText: 'Want to know if a meme is serious? Look at the calendar.',
        prompt: V2({ n: 1, total: 5, title: 'A SERIOUS MEME LAUNCH SHOWS UP ON THE CALENDAR', insight: 'Timing reveals the team', boxLabel: 'THE TELL', detail: 'Serious teams launch when retail is pouring in, never into dead bidless tape.' }) },
      { uuid: 'c4020002', seq: '02', slug: 'pengu-trump-pump',
        slideText: '$PENGU launched into the Trump pump, not a bear.',
        prompt: V2({ n: 2, total: 5, title: '$PENGU LAUNCHED INTO THE TRUMP PUMP', insight: 'Not a bear, by design', boxLabel: 'THE EXAMPLE', detail: 'Pudgy Penguins had VCs, brand deals, and a real launch operation. They waited for the rally because they could.' }) },
      { uuid: 'c4030003', seq: '03', slug: 'funded-teams-wait',
        slideText: 'Funded teams can afford to wait a year.',
        prompt: V2({ n: 3, total: 5, title: 'FUNDED TEAMS CAN AFFORD TO WAIT', insight: 'A year on the sidelines if needed', boxLabel: 'THE EDGE', detail: 'Teams with real money time their launch for maximum bang. Fair-launch projects never get that luxury.' }) },
      { uuid: 'c4040004', seq: '04', slug: 'mcap-gap',
        slideText: 'Bidless tape vs Trump pump: $50M or $1.7B.',
        prompt: V2({ n: 4, total: 5, title: 'THE TIMING IS WORTH BILLIONS', insight: '$50M mcap or $1.7B mcap', boxLabel: 'THE MATH', detail: 'Same coin, different week. Launch timing is the difference between a flop and a top-tier token.' }) },
      { uuid: 'c4050005', seq: '05', slug: 'engagement-question',
        slideText: 'When does the next serious meme launch?',
        prompt: V2({ n: 5, total: 5, title: 'WHEN DOES THE NEXT SERIOUS MEME LAUNCH?', insight: 'And how will you spot it first?', boxLabel: 'YOUR CALL', detail: 'How do you plan to spot the next funded launch before the chart confirms it?' }) },
    ],
  },

  // ── c5 Influencer integrity — Version 2, 5 slides ──────────────────────────
  {
    id: 'yt-post-2026-05-21-c5-influencer-integrity-and-the-community-test',
    version: 2,
    igCaption: "There is a pattern nobody names: the same crowd follows the same caller through 8 rugs. Different ticker, same wallet bleed. That is not loyalty, it is a paid subscription to losses. A real caller holds what they shill, on chain, before the call goes out. What is your filter for a crypto caller?",
    slides: [
      { uuid: 'c5010001', seq: '01', slug: 'hook-8-rugs',
        slideText: 'The same crowd follows the same caller through 8 rugs.',
        prompt: V2({ n: 1, total: 5, title: 'THE SAME CROWD, THE SAME CALLER, 8 RUGS', insight: 'Different ticker, same wallet bleed', boxLabel: 'THE PATTERN', detail: 'The caller never apologizes. The bag gets smaller. The next call goes out anyway.' }) },
      { uuid: 'c5020002', seq: '02', slug: 'not-loyalty',
        slideText: 'That is not loyalty. It is a subscription to losses.',
        prompt: V2({ n: 2, total: 5, title: 'THAT IS NOT LOYALTY', insight: 'It is a paid subscription to losses', boxLabel: 'THE REFRAME', detail: 'Staying loyal to a caller who cannot stop calling rugs costs you every single cycle.' }) },
      { uuid: 'c5030003', seq: '03', slug: 'real-caller-holds',
        slideText: 'A real caller holds what they shill, on chain.',
        prompt: V2({ n: 3, total: 5, title: 'A REAL CALLER HOLDS WHAT THEY SHILL', insight: 'On chain, before the call, in real size', boxLabel: 'THE TEST', detail: 'If they would not risk their own rent on it, they should not be telling you to buy.' }) },
      { uuid: 'c5040004', seq: '04', slug: 'community-test',
        slideText: 'Run every caller through that filter.',
        prompt: V2({ n: 4, total: 5, title: 'RUN EVERY CALLER THROUGH THE FILTER', insight: 'Receipts, skin in the game, accountability', boxLabel: 'THE FILTER', detail: 'A real caller has the receipts on chain before the call and owns the outcome when it goes wrong.' }) },
      { uuid: 'c5050005', seq: '05', slug: 'engagement-question',
        slideText: 'What is your filter for a crypto caller?',
        prompt: V2({ n: 5, total: 5, title: 'WHAT IS YOUR FILTER FOR A CALLER?', insight: 'And which one actually passes it?', boxLabel: 'YOUR TAKE', detail: 'Name the filter you use, and the one caller who actually passes it.' }) },
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
  console.log(`Navigating to a fresh chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  // If redirected to an existing conversation, force a new chat (no history to mis-grab).
  if (page.url().includes('/c/')) {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }
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
