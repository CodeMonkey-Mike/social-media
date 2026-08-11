// Redo DogInMe regen using the fixed _lib-regen.js (reference upload BEFORE baseline,
// plus size-equality paranoia check). Overwrites the bad file at the same path —
// x-tweets.json already points at image_id 8e135977, no JSON update needed.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { generateOne, COMPOSER_SEL, IMAGE_PATTERN } = require('./_lib-regen.js');

const PROFILE_DIR  = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR   = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const CHAT_URL     = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const DOGINME_REF  = path.join(IMAGES_DIR, 'reference', 'DogInMe.png');
const UUID         = '8e135977';
const SLUG         = 'doginme-base-bear-survivor';

const PROMPT = "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. The DogInMe character — a muscular bright blue pitbull-style dog character (matching exactly the character shown in the attached reference image) — standing firm and unmoved on top of a glowing Base-blue rock pillar, while a storm of fragmented meme-coin shapes tumbles and disintegrates around it in the dark. Deep navy near-black background. Cool blue rim lighting. Bear-survivor defiance mood. No text or words anywhere in the image.";

(async () => {
  console.log('DogInMe REDO — fixed library, image_id ' + UUID);
  if (!fs.existsSync(DOGINME_REF)) {
    console.error('Reference not found at ' + DOGINME_REF);
    process.exit(1);
  }
  const targetPath = path.join(IMAGES_DIR, 'x', `x-tweets-${UUID}-${SLUG}.png`);

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
    await generateOne(page, { targetPath, prompt: PROMPT, refImage: DOGINME_REF });
  } catch (err) {
    console.error('FAILED:', err.message);
    await browser.close();
    process.exit(1);
  }
  await browser.close();
  console.log('DogInMe REDO done ✓');
})();
