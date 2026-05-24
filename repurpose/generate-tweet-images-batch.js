// Batch image generator — launches Chrome ONCE, reuses session for every prompt.
// Handles: reference image uploads, IG 4:5 companions, JSON updates after each save.
//
// Usage: node generate-tweet-images-batch.js
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/';  // FRESH chat per run (fixed 2026-05-24 — history-heavy chats caused stale-image grabs)
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;
const TROLL_REF     = path.join(IMAGES_DIR, 'reference', 'troll.png');

const TWEETS_JSON = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');
const IG_JSON     = path.join(SCHEDULE_DIR, 'data', 'ig-single-image.json');

// ── IG match map: tweet hook snippet → IG post id ────────────────────────────
const IG_HOOK_MAP = {
  '$PNUT to reclaim its 2024 ATH from here is a 32x':       'ig-2026-05-21-b3-pnut-32x-bear-math-1l',
  'Hunter Virus was everywhere a month ago':               'ig-2026-05-21-c1-hunter-virus-narrative-dead-1l',
  'following the same caller through 8 rugs':              'ig-2026-05-21-c5-rugger-influencer-loyalty-1l',
  'institutions are coming':                               'ig-2026-05-21-b1-ton-strategy-treasury-1l',
  'humanity\'s best ideas are sitting in a cemetery':      'ig-2026-05-21-e1-cemetery-of-best-ideas-1l',
  'four-year cycle zombies will tell you the April rally': 'ig-2026-05-21-a2-btc-spot-deep-contraction-1l',
  '$PEPE has no brand, no IP, no revenue':                 'ig-2026-05-21-b2-pengu-flips-pepe-1l',
};

// ── Image plan ────────────────────────────────────────────────────────────────
// Each entry: { hookSnippet, uuid, slug, xPrompt, igPrompt|null, refImage|null }
// hookSnippet is matched against pending tweet hooks to find the right tweet.
// 20 pending tweets — each gets its OWN unique image (NEVER reuse an image_id; see SKILL HARD RULE #1).
const IMAGES = [
  { hookSnippet: '4% on USDC dies the second', uuid: 'sb01vlt0', slug: 'stablecoin-yield-vault-slam', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A heavy bank vault door slamming shut on a glowing golden percent-yield symbol while small everyday-person characters reach for it from outside. Deep navy near-black background. Dramatic gold and grey rim lighting. Tense defiant mood. No text or words anywhere in the image.' },
  { hookSnippet: 'Polymarket has it at 61%', uuid: 'cl02oddw', slug: 'clarity-odds-wheel', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A confident coin character watching a glowing odds wheel land on a bright green winning slice, a cracked golden ceiling opening above to reveal light. Deep navy near-black background. Dramatic green and gold rim lighting. Hopeful anticipation mood. No text or words anywhere in the image.' },
  { hookSnippet: 'One day soon, self-driving will be mandatory', uuid: 'sd03mand', slug: 'self-driving-mandatory', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A sleek glowing driverless car character gliding along a neon futuristic highway at night, an empty driver seat with a faint red prohibition glow where the steering wheel would be. Deep navy near-black background. Cool blue rim lighting. Inevitable futuristic mood. No text or words anywhere in the image.' },
  { hookSnippet: '$PNUT topped near $1.7B mcap', uuid: 'pn04mtn0', slug: 'pnut-32x-mountain', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A determined glowing peanut mascot character climbing a tall dark mountain toward a distant glowing summit flag far above, a tiny base camp far below. Deep navy near-black background. Dramatic gold rim lighting. Aspirational underdog mood. No text or words anywhere in the image.' },
  { hookSnippet: 'Real meme devs time their launches for rallies', uuid: 'rm05surf', slug: 'meme-devs-surf-rally', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A cute chubby blue penguin character surfing confidently atop a massive glowing green rally wave at the perfect moment, while other meme-coin characters tumble and wipe out in the cold water below. Deep navy near-black background. Teal and green rim lighting. Well-timed triumphant mood. No text or words anywhere in the image.' },
  { hookSnippet: "April's BTC rally was perp futures", uuid: 'bt06blon', slug: 'btc-perp-balloon-candle', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A hollow green candlestick shaped like a balloon being inflated by a wheezing perp-futures air pump, already sagging and starting to deflate, nothing solid inside. Deep navy near-black background. Eerie green rim lighting. Skeptical hollow mood. No text or words anywhere in the image.' },
  { hookSnippet: 'delivered my frozen meat to the wrong house', uuid: 'fx07lost', slug: 'fedex-courier-wrong-house', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A careless human courier character tossing a package onto the wrong dark doorstep and sneaking away, while a glowing AI delivery robot nearby watches disapprovingly with arms crossed. Deep navy near-black background. Cool blue versus murky rim lighting. Ironic mood. No text or words anywhere in the image.' },
  { hookSnippet: 'KRC20 meme at $5.1K mcap', uuid: 'mc08gem0', slug: 'microcap-hidden-gem', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A tiny radiant gem-like coin spotlighted on a hidden pedestal behind a drawn velvet curtain, a small inner circle of silhouettes peeking in admiringly. Deep navy near-black background. Teal and gold rim lighting. Secretive insider mood. No text or words anywhere in the image.' },
  { hookSnippet: "Following the same caller through 8 rugs isn't loyalty", uuid: 'rg09trap', slug: 'eight-rugs-trapdoors', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A line of trusting investor characters handing wallets to a grinning influencer character who drops each one through a row of eight trapdoors in the dark floor. Deep navy near-black background. Dramatic red rim lighting. Dark cautionary mood. No text or words anywhere in the image.' },
  { hookSnippet: 'unlocks the highest concentration of unbuilt ideas', uuid: 'ai10rise', slug: 'ai-ideas-rising-build', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. Glowing idea-orbs floating up out of a moonlit graveyard toward a bright construction site where a single small figure builds with the light. Deep navy near-black background. Teal and warm gold rim lighting. Hopeful visionary mood. No text or words anywhere in the image.' },
  { hookSnippet: 'The goalpost is gone', uuid: 'fx11robo', slug: 'delivery-robot-perfect', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A precise glowing AI delivery robot character placing a package perfectly and gently on a doorstep under a clean bright spotlight, flawless and reliable. Deep navy near-black background. Cool blue rim lighting. Competent reassuring mood. No text or words anywhere in the image.' },
  { hookSnippet: 'One day human driving will be illegal', uuid: 'dr12musm', slug: 'steering-wheel-museum', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. An old-fashioned car steering wheel sealed inside a glowing museum glass display case on a pedestal, a relic of the past, a judge gavel resting beside it. Deep navy near-black background. Cool blue rim lighting. Solemn historic mood. No text or words anywhere in the image.' },
  { hookSnippet: 'New all-time highs come back onto the table if it passes', uuid: 'cl13brk0', slug: 'coin-breaks-ath-ceiling', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A determined coin character smashing upward through a glowing cracked ceiling into bright light above, green breakout energy trailing behind it. Deep navy near-black background. Green and gold rim lighting. Breakthrough triumphant mood. No text or words anywhere in the image.' },
  { hookSnippet: 'future engineer manager has no direct reports', uuid: 'en14mgr0', slug: 'manager-only-ai-reports', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A relaxed manager character at a sleek desk directing a neat fleet of glowing AI robot workers as the only team, faint empty human office chairs dissolving in the background. Deep navy near-black background. Cool blue rim lighting. Future-of-work mood. No text or words anywhere in the image.' },
  { hookSnippet: 'Brand and IP beat pure vibes', uuid: 'pp15ldrb', slug: 'pengu-leaps-pepe-leaderboard', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A glowing leaderboard podium where a confident blue penguin coin leaps up past a green frog coin to seize the top spot. Deep navy near-black background. Teal versus green rim lighting. Competitive ascending mood. No text or words anywhere in the image.' },
  { hookSnippet: 'The MicroStrategy of Toncoin is already here', uuid: 'tn16bldg', slug: 'ton-treasury-tower', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A towering corporate treasury skyscraper constructed entirely from stacked glowing blue diamond TON coins, a flag planted triumphantly at its peak. Deep navy near-black background. Cool blue rim lighting. Institutional powerful mood. No text or words anywhere in the image.' },
  { hookSnippet: 'caught Lab at 8 cents', uuid: 'lb17vlt0', slug: 'lab-quiet-accumulation-kas', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A calm investor character quietly slipping a glowing coin into a hidden vault in the shadows while a massive glowing green ascending chart soars upward behind them, one finger raised to lips for silence. Deep navy near-black background. Teal and green rim lighting. Quiet-conviction mood. No text or words anywhere in the image.' },
  { hookSnippet: 'My community has the microcaps before X does', uuid: 'mc18circ', slug: 'community-inner-circle-bags', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. An exclusive inner-circle table of cheering member characters holding glowing money bags, while a crowd of outsiders presses against a glass wall looking in from the dark. Deep navy near-black background. Teal and gold rim lighting. Insider-advantage mood. No text or words anywhere in the image.' },
  { hookSnippet: 'Everyone was talking up Hunter Virus', uuid: 'hv19tmbl', slug: 'hunter-virus-tumbleweed', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A dusty abandoned meme-coin character slumped on a cracked pedestal in a deserted fading spotlight, a tumbleweed rolling past, the hype long gone. Deep navy near-black background. Cold faded rim lighting. Forgotten desolate mood. No text or words anywhere in the image.' },
  { hookSnippet: 'I never announced publicly until we were already up 50x', uuid: 'lb20trph', slug: 'lab-98x-silent-trophy', igPrompt: null, refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. An investor character quietly holding up a glowing golden trophy in the shadows with one finger to the lips signaling silence, an understated private victory. Deep navy near-black background. Gold and teal rim lighting. Quiet-win mood. No text or words anywhere in the image.' },
];

// ── JSON helpers ──────────────────────────────────────────────────────────────
function updateTweetJson(hookSnippet, uuid, slug) {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t =>
    (t.status === 'pending') &&
    (t.tweet || t.hook || '').includes(hookSnippet)
  );
  if (!tweet) { console.log(`  ⚠ Tweet not found for hook: ${hookSnippet.slice(0, 50)}`); return; }
  tweet.image_id   = uuid;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${uuid}-${slug}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ tweet updated: ${(tweet.hook || '').slice(0, 55)}`);
}

function updateIgJson(hookSnippet, uuid, slug) {
  const igId = IG_HOOK_MAP[hookSnippet];
  if (!igId) return;
  const ig   = JSON.parse(fs.readFileSync(IG_JSON, 'utf8'));
  const post = ig.posts.find(p => p.id === igId);
  if (!post) { console.log(`  ⚠ IG post not found: ${igId}`); return; }
  if (post.image_id) { console.log(`  ℹ IG already has image: ${igId}`); return; }
  post.image_id     = uuid;
  post.image_path   = `schedule-tweets/images/ig/ig-single-${uuid}-${slug}.png`;
  post.aspect_ratio = '4:5';
  fs.writeFileSync(IG_JSON, JSON.stringify(ig, null, 2));
  console.log(`  ✓ IG updated: ${igId}`);
}

// ── Upload reference image before typing prompt ───────────────────────────────
async function uploadReference(page, refPath) {
  console.log(`     Uploading reference: ${path.basename(refPath)}`);
  try {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles(refPath);
    await page.waitForTimeout(4000);
    console.log('     Reference uploaded ✓');
  } catch (e) {
    console.warn(`     Reference upload failed (${e.message.split('\n')[0]}) — continuing without it`);
  }
}

// ── Generate one image on the already-open page ───────────────────────────────
async function generateOne(page, { targetPath, prompt, refImage, label }) {
  console.log(`\n  → ${label}`);
  console.log(`     Target: ${path.basename(targetPath)}`);

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

  // Let any in-flight requests settle before baselining
  await page.waitForTimeout(2000);
  const baseline     = new Set(seenUrls);
  const promptSentAt = Date.now();

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();

  // Upload reference image if provided
  if (refImage) await uploadReference(page, refImage);

  // Type prompt character by character — 10–30ms per char
  for (const char of prompt) {
    await page.keyboard.type(char);
    await page.waitForTimeout(Math.floor(Math.random() * 21) + 10);
  }
  await page.keyboard.press('Enter');
  console.log(`     Prompt sent — waiting for image...`);

  // Wait for a new image URL that arrived at least MIN_GEN_MS after the prompt
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

  // Human-like pause before next prompt — 20–30s
  const pauseMs = Math.floor(Math.random() * 11000) + 20000;
  console.log(`     Waiting ${(pauseMs / 1000).toFixed(1)}s before next prompt...`);
  await page.waitForTimeout(pauseMs);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Batch: ${IMAGES.length} images (2 TROLL regen + 8 missing)`);
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

  // Block sidebar images during initial load so baseline is clean
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

  for (let i = 0; i < IMAGES.length; i++) {
    const { hookSnippet, uuid, slug, xPrompt, igPrompt, refImage } = IMAGES[i];

    console.log(`${'─'.repeat(60)}`);
    console.log(`[${i + 1}/${IMAGES.length}] ${uuid} — ${slug}`);

    // X tweet image (1:1) — skip if already generated, so the batch is resumable
    // after being paused for a higher-priority Lane B post.
    const xPath = path.join(IMAGES_DIR, 'x', `x-tweets-${uuid}-${slug}.png`);
    if (fs.existsSync(xPath)) {
      console.log(`  [SKIP] ${path.basename(xPath)} already exists`);
      updateTweetJson(hookSnippet, uuid, slug);
    } else {
      try {
        await generateOne(page, { targetPath: xPath, prompt: xPrompt, refImage, label: `X 1:1 — ${slug}` });
        updateTweetJson(hookSnippet, uuid, slug);
        successCount++;
      } catch (err) {
        console.error(`  ✗ X failed: ${err.message}`);
        failCount++;
      }
    }

    // IG companion (4:5) if applicable
    if (igPrompt) {
      const igPath = path.join(IMAGES_DIR, 'ig', `ig-single-${uuid}-${slug}.png`);
      try {
        await generateOne(page, { targetPath: igPath, prompt: igPrompt, refImage, label: `IG 4:5 — ${slug}` });
        updateIgJson(hookSnippet, uuid, slug);
        successCount++;
      } catch (err) {
        console.error(`  ✗ IG failed: ${err.message}`);
        failCount++;
      }
    }
  }

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Done. ✓ ${successCount} saved  ✗ ${failCount} failed`);
  console.log(`${'━'.repeat(60)}\n`);

  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
