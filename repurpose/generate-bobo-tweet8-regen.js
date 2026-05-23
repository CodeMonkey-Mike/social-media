// Regenerate image for x-tweet #8 (BOBO / CoinMarketCap inflated mcap)
// Uses bobo.png reference so the actual BOBO bear appears in the image.
//
// Usage: node generate-bobo-tweet8-regen.js
// Run from: C:\Users\mnede\Documents\Claude\social-media\repurpose\

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHAT_URL      = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;

const TWEETS_JSON = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');
const BOBO_REF    = path.join(IMAGES_DIR, 'reference', 'bobo.png');

const NEW_UUID = 'b3a7f2c4';
const NEW_SLUG = 'bobo-cmc-inflated-mcap-shocked';
const HOOK_SNIPPET = 'CoinMarketCap is showing $BOBO at a $2.7B market cap';

const PROMPT = 'Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. ' +
  'The chubby lazy-eyed brown bear character from the attached reference image stands center frame, ' +
  'jaw dropped in total disbelief. It points at two side-by-side glowing price displays on a cracked ' +
  'dashboard screen. The left display blazes an enormous inflated $2.7B number in neon green. The ' +
  'right display shows a tiny, barely-visible $200K number in dim red. Colorful duct tape and tangled ' +
  'wires hold the whole screen together. Deep navy near-black background. Dramatic cinematic orange ' +
  'and teal rim lighting. Shocked incredulous mood. No text or words anywhere in the image.';

// ── JSON update ───────────────────────────────────────────────────────────────
function updateTweetJson(uuid, slug) {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t =>
    t.status === 'pending' && (t.tweet || t.hook || '').includes(HOOK_SNIPPET)
  );
  if (!tweet) { console.log(`  ⚠ Tweet not found for hook snippet`); return; }
  tweet.image_id   = uuid;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${uuid}-${slug}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`  ✓ tweets.json updated → image_id: ${uuid}`);
}

// ── Upload reference image ────────────────────────────────────────────────────
async function uploadReference(page, refPath) {
  console.log(`  Uploading reference: ${path.basename(refPath)}`);
  try {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles(refPath);
    await page.waitForTimeout(4000);
    console.log('  Reference uploaded ✓');
  } catch (e) {
    console.warn(`  Reference upload failed (${e.message.split('\n')[0]}) — continuing without it`);
  }
}

// ── Generate one image ────────────────────────────────────────────────────────
async function generateOne(page, targetPath, prompt, refImage) {
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
  const baseline = new Set(seenUrls);

  const composer = page.locator(COMPOSER_SEL).first();
  await composer.click();

  if (refImage) await uploadReference(page, refImage);

  // Reset baseline AFTER upload so reference image URLs are excluded
  const uploadedUrls = new Set(seenUrls);

  for (const char of prompt) {
    await page.keyboard.type(char);
    await page.waitForTimeout(Math.floor(Math.random() * 21) + 10);
  }
  await page.keyboard.press('Enter');
  const promptSentAt = Date.now();
  console.log('  Prompt sent — waiting for image...');

  let imgUrl = null;
  const start = Date.now();
  let lastCount = 0;
  let stableSince = null;

  while (Date.now() - start < MAX_WAIT_MS) {
    const candidates = [...seenUrls]
      .filter(u => !uploadedUrls.has(u))
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

  if (!imgUrl) throw new Error('Timed out waiting for image');

  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error('Empty buffer received');

  fs.writeFileSync(targetPath, buffer);
  console.log(`  Saved: ${(buffer.length / 1024).toFixed(0)} KB → ${path.basename(targetPath)}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n' + '━'.repeat(60));
  console.log('Regen: BOBO tweet #8 — using bobo.png reference');
  console.log('━'.repeat(60) + '\n');

  console.log('Launching Chrome...');
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
  console.log(`Navigating to chat...`);
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready.\n');

  const xPath = path.join(IMAGES_DIR, 'x', `x-tweets-${NEW_UUID}-${NEW_SLUG}.png`);

  try {
    await generateOne(page, xPath, PROMPT, BOBO_REF);
    updateTweetJson(NEW_UUID, NEW_SLUG);
    console.log('\n✓ Done.');
  } catch (err) {
    console.error(`\n✗ Failed: ${err.message}`);
  }

  await browser.close();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
