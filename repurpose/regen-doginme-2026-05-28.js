// One-off regen for the $doginme tweet image, using the proper DogInMe.png reference
// (buff blue pitbull character). Uses the persistent X Tweets chat URL per the
// image-gen-chat-reuse memory rule. Safe to run in parallel with non-chatgpt-profile
// scripts (e.g. fbbot-profile uploads) because they use different Chrome profiles.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const SCHEDULE_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
// Persistent X Tweets chat — never spawn fresh chats (see image-gen-chat-reuse memory rule)
const CHAT_URL      = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const IMAGE_PATTERN = 'estuary/content';
const COMPOSER_SEL  = '#prompt-textarea, div[contenteditable="true"][data-id]';
const MIN_GEN_MS    = 10000;
const MAX_WAIT_MS   = 5 * 60 * 1000;

const TWEETS_JSON  = path.join(SCHEDULE_DIR, 'data', 'x-tweets.json');
const DOGINME_REF  = path.join(IMAGES_DIR, 'reference', 'DogInMe.png');
const NEW_UUID     = '8e135977';
const SLUG         = 'doginme-base-bear-survivor';

const PROMPT = "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. The DogInMe character — a muscular bright blue pitbull-style dog character (matching exactly the character shown in the attached reference image) — standing firm and unmoved on top of a glowing Base-blue rock pillar, while a storm of fragmented meme-coin shapes tumbles and disintegrates around it in the dark. Deep navy near-black background. Cool blue rim lighting. Bear-survivor defiance mood. No text or words anywhere in the image.";

async function uploadReference(page, refPath) {
  console.log(`  Uploading reference: ${path.basename(refPath)}`);
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 10000 });
  await fileInput.setInputFiles(refPath);
  await page.waitForTimeout(4000);
  console.log('  Reference uploaded ✓');
}

async function generateOne(page, { targetPath, prompt, refImage }) {
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
  console.log('  Prompt sent — waiting for image...');

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
  if (!imgUrl) throw new Error('Timed out waiting for image');
  const buffer = await buffers.get(imgUrl);
  if (!buffer || buffer.length === 0) throw new Error('Empty buffer');
  fs.writeFileSync(targetPath, buffer);
  console.log(`  Saved: ${(buffer.length / 1024).toFixed(0)} KB → ${path.basename(targetPath)}`);
}

(async () => {
  console.log('DogInMe regen — using DogInMe.png reference, fresh image_id ' + NEW_UUID);
  if (!fs.existsSync(DOGINME_REF)) {
    console.error('Reference not found at ' + DOGINME_REF);
    process.exit(1);
  }
  const newPath = path.join(IMAGES_DIR, 'x', `x-tweets-${NEW_UUID}-${SLUG}.png`);

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
  console.log('Navigating to persistent X Tweets chat...');
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready. Generating...\n');

  try {
    await generateOne(page, { targetPath: newPath, prompt: PROMPT, refImage: DOGINME_REF });
  } catch (err) {
    console.error('FAILED:', err.message);
    await browser.close();
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t => /^\$doginme started as a Farcaster founder/.test(t.tweet || ''));
  if (!tweet) {
    console.error('Could not find doginme tweet in x-tweets.json');
    await browser.close();
    process.exit(1);
  }
  const oldPath = tweet.image_path;
  const oldId   = tweet.image_id;
  tweet.image_id   = NEW_UUID;
  tweet.image_path = `schedule-tweets/images/x/x-tweets-${NEW_UUID}-${SLUG}.png`;
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`\nx-tweets.json updated:`);
  console.log(`  old: ${oldId} -> ${oldPath}`);
  console.log(`  new: ${NEW_UUID} -> ${tweet.image_path}`);

  if (oldPath) {
    const cleanOldPath = path.join(SCHEDULE_DIR, oldPath.replace(/^schedule-tweets\//, ''));
    if (fs.existsSync(cleanOldPath)) {
      fs.unlinkSync(cleanOldPath);
      console.log(`Deleted orphan: ${path.basename(cleanOldPath)}`);
    }
  }

  await browser.close();
  console.log('DogInMe regen done ✓');
})();
