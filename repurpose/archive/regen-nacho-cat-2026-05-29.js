// Regen the Kasper-vs-Nacho image (image_id gh09rep0) used by BOTH the X tweet
// (tweet-2026-05-25-k2-kasper-mascot-not-nacho) and the YT post
// (yt-post-2026-05-28-kasper-mascot-not-nacho) — same file.
//
// Bug being fixed: the current image shows a brown DOG walking away on the right.
// Nacho is a black CAT (see images/reference/nacho.jpg). It must be a black cat
// walking away, not a dog.
//
// Two references attached:
//   1. the current scene image (preserve Kasper ghost + Kaspa coin + night scene)
//   2. nacho.jpg (defines the black-cat likeness)
//
// FRESH chat (https://chatgpt.com/) — one-off regen, avoids history-contamination
// of the persistent X Tweets chat (see image-gen-history-contamination memory).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { generateOne, COMPOSER_SEL, IMAGE_PATTERN } = require('./_lib-regen.js');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const CHAT_URL    = 'https://chatgpt.com/';  // FRESH chat — see header
const UUID        = 'gh09rep0';
const SLUG        = 'kasper-ghost-vs-nacho';

const SCENE_REF = path.join(IMAGES_DIR, 'x', `x-tweets-${UUID}-${SLUG}.png`);
const NACHO_REF = path.join(IMAGES_DIR, 'reference', 'nacho.jpg');

const PROMPT = "Pixar-style 3D animated CGI illustration, 1:1 square, film-quality render. Recreate the scene in the FIRST attached reference image exactly: a cute smiling translucent glowing green ghost character (Kasper) floating on the left, and in the center a glowing green Kaspa coin bearing a white 'K' arrow logo standing upright on a weathered stone pedestal, set in a dark moody nighttime graveyard with faint gravestones and a soft green ambient glow. Keep the same composition, color palette, and lighting. The ONE change: replace the brown dog on the right with a sleek BLACK CAT walking AWAY from the viewer into the background. The cat is Nacho, matching the glossy black fur and green eyes of the cat in the SECOND attached reference image. Show the cat from behind, mid-stride, tail raised, leaving the scene. No text or words anywhere in the image.";

(async () => {
  console.log('Nacho-cat regen — fresh chat, image_id ' + UUID);
  for (const r of [SCENE_REF, NACHO_REF]) {
    if (!fs.existsSync(r)) { console.error('Reference not found: ' + r); process.exit(1); }
  }
  const targetPath = SCENE_REF; // overwrite the same file both posts point to

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
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
  }
  await page.locator(COMPOSER_SEL).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.unroute(imgPattern);
  await page.waitForTimeout(2000);
  console.log('Chat ready (fresh). Generating...\n');

  try {
    await generateOne(page, { targetPath, prompt: PROMPT, refImage: [SCENE_REF, NACHO_REF] });
  } catch (err) {
    console.error('FAILED:', err.message);
    await browser.close();
    process.exit(1);
  }
  await browser.close();
  console.log('Nacho-cat regen done ✓  (both X tweet + YT post use this file)');
})();
