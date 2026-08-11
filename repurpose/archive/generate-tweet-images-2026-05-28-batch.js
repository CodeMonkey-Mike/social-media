// Batch: generate X 1:1 images for the 7 pending tweets without images (2026-05-28).
// Cloned from generate-tweet-images-batch.js. Single Chrome session, fresh chat.
// None of these 7 tweets have linked IG single-image entries, so IG step is skipped.

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

const TWEETS_JSON   = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');
const REF_DIR       = path.join(IMAGES_DIR, 'reference');
const REF_HOUSE     = path.join(REF_DIR, 'housecoin.webp');
const REF_ELIZAOS   = path.join(REF_DIR, 'ElizaOS-ai16z.webp');

const IMAGES = [
  { hookSnippet: "$doginme started as a Farcaster founder",
    uuid: 'eede24fe', slug: 'doginme-loyal-base-dog-bear-survivor',
    refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A loyal scruffy dog character with a glowing blue collar standing firm and unmoved on top of a glowing Base-blue rock pillar, while a storm of fragmented meme-coin shapes tumbles and disintegrates around it in the dark. Deep navy near-black background. Cool blue rim lighting. Bear-survivor defiance mood. No text or words anywhere in the image.' },

  { hookSnippet: 'three tokens led the agent narrative',
    uuid: '84cda8d8', slug: 'tao-foundation-elizaos-framework',
    refImage: REF_ELIZAOS,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A glowing neural-network foundation pulsing beneath the ground as the bedrock layer, with a sleek confident agent-framework robot character (matching the logo shown in the attached reference image) standing on top of it, both connected by interwoven streams of light. Deep navy near-black background. Electric blue and warm gold rim lighting. Layered AI architecture mood. No text or words anywhere in the image.' },

  { hookSnippet: "$TOSHI is named after the Coinbase CEO",
    uuid: '7c87586a', slug: 'toshi-calm-cat-throne-base',
    refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A serene calico cat character with bright golden eyes sitting calmly atop a sleek glowing Base-blue throne, a tiny coin medallion on its collar, while a crowd of small investor characters in the foreground look away unaware. Deep navy near-black background. Cool blue and warm gold rim lighting. Underestimated royalty mood. No text or words anywhere in the image.' },

  { hookSnippet: "While CT spent the bear calling $HOUSE dead",
    uuid: 'b2981f8b', slug: 'house-quiet-5x-comeback',
    refImage: REF_HOUSE,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A confident small house-coin character (matching the logo shown in the attached reference image) quietly walking up a glowing green ascending chart line, while a crowd of distant gossiping critic silhouettes in the dark background shake their fists, unaware of the climb. Deep navy near-black background. Green and warm wood-toned rim lighting. Quiet underdog comeback mood. No text or words anywhere in the image.' },

  { hookSnippet: '$PENGU near $600M, $PEPE near $1.5B',
    uuid: 'e71db738', slug: 'pengu-flips-pepe-podium-leap',
    refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A determined chubby blue penguin character mid-leap upward past a complacent green frog character on a glowing podium, brand-document scrolls and IP-blueprint glyphs floating around the penguin like proof. Deep navy near-black background. Teal and contrasting green rim lighting. Inevitable flippening mood. No text or words anywhere in the image.' },

  { hookSnippet: "$PYTHIA isn't really a meme",
    uuid: 'fb11d7e8', slug: 'pythia-neural-rat-desci-lab',
    refImage: null,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. A small white lab rat character with glowing electric-blue neural electrodes connected to a futuristic brain-computer interface, surrounded by floating DNA helices and scientific data orbs in a sleek minimal research lab. Deep navy near-black background. Electric blue and violet rim lighting. Serious sci-fi DeSci mood. No text or words anywhere in the image.' },

  { hookSnippet: '$SPX6900 wants to flip the stock market',
    uuid: 'ff092970', slug: 'spx-vs-house-flip-scale-contrast',
    refImage: REF_HOUSE,
    xPrompt: 'Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. Two scenes side by side: on the left, a large confident coin character flipping a massive Wall Street bull statue on its back; on the right, a much tinier scrappy house-coin character (matching the logo shown in the attached reference image) tries to flip a small model house. Deep navy near-black background. Green and warm rim lighting. Same-joke-different-scale mood. No text or words anywhere in the image.' },
];

function updateTweetJson(hookSnippet, uuid, slug) {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t =>
    t.status === 'pending' && (t.tweet || t.hook || '').includes(hookSnippet)
  );
  if (!tweet) { console.log(`  ⚠ Tweet not found for hook: ${hookSnippet.slice(0, 50)}`); return; }
  tweet.image_id   = uuid;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${uuid}-${slug}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ tweet updated: ${(tweet.hook || '').slice(0, 55)}`);
}

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

  await page.waitForTimeout(2000);
  const baseline     = new Set(seenUrls);
  const promptSentAt = Date.now();

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();

  if (refImage) await uploadReference(page, refImage);

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
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Batch: ${IMAGES.length} pending X tweets without images (2026-05-28)`);
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

  for (let i = 0; i < IMAGES.length; i++) {
    const { hookSnippet, uuid, slug, xPrompt, refImage } = IMAGES[i];

    console.log(`${'─'.repeat(60)}`);
    console.log(`[${i + 1}/${IMAGES.length}] ${uuid} — ${slug}`);

    const xPath = path.join(IMAGES_DIR, 'x', `x-tweets-${uuid}-${slug}.png`);
    if (fs.existsSync(xPath)) {
      console.log(`  [SKIP] ${path.basename(xPath)} already exists`);
      updateTweetJson(hookSnippet, uuid, slug);
      continue;
    }
    try {
      await generateOne(page, { targetPath: xPath, prompt: xPrompt, refImage, label: `X 1:1 — ${slug}` });
      updateTweetJson(hookSnippet, uuid, slug);
      successCount++;
    } catch (err) {
      console.error(`  ✗ FAILED: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`Done. Success: ${successCount}, Failed: ${failCount}`);
  console.log(`${'━'.repeat(60)}\n`);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
