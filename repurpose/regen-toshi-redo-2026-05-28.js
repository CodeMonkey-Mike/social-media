// Redo Toshi regen using a FRESH chat (not the persistent X Tweets chat) to
// avoid history-contamination: the persistent chat now contains a generated
// Pixar DogInMe image, and ChatGPT's re-fetch of that image during Toshi
// generation got captured by the prior script. Fresh chat = isolated history.
//
// Trade-off vs the image-gen-chat-reuse memory rule: one orphan chat in the
// sidebar for this one-off regen. Acceptable when correctness > tidiness.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { generateOne, COMPOSER_SEL, IMAGE_PATTERN } = require('./_lib-regen.js');

const PROFILE_DIR  = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR   = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const CHAT_URL     = 'https://chatgpt.com/';  // FRESH chat — see header comment
const TOSHI_REF    = path.join(IMAGES_DIR, 'reference', 'toshi.png');
const UUID         = '70a76911';
const SLUG         = 'toshi-base-mascot-throne';

const PROMPT = "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. The Toshi character — a chibi blue fox-like Base mascot with cyan accents wearing an orange hoodie (matching exactly the character shown in the attached reference image) — sitting calmly atop a sleek glowing Base-blue throne, doing a confident peace sign with one hand, a tiny coin medallion on its collar, while a crowd of small investor characters in the foreground look away unaware. Deep navy near-black background. Cool blue and warm orange rim lighting. Underestimated royalty mood. No text or words anywhere in the image.";

(async () => {
  console.log('Toshi REDO — fresh chat (isolated from contaminated persistent chat), image_id ' + UUID);
  if (!fs.existsSync(TOSHI_REF)) {
    console.error('Reference not found at ' + TOSHI_REF);
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
  console.log('Navigating to fresh chat...');
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  if (page.url().includes('/c/')) {
    // Got redirected to an existing chat — force fresh
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready (fresh, no history). Generating...\n');

  try {
    await generateOne(page, { targetPath, prompt: PROMPT, refImage: TOSHI_REF });
  } catch (err) {
    console.error('FAILED:', err.message);
    await browser.close();
    process.exit(1);
  }
  await browser.close();
  console.log('Toshi REDO done ✓');
})();
