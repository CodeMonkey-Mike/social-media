// gen-pvt-assets.js — assets for the "Price vs Technology" short (video 2).
// Reuses the proven generate-broll-batch.js logic; only IMAGES + ASSETS_DIR changed.
// 2 full-screen + 2 content-zone (opaque 9:16) + 3 transparent-background overlays.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR       = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT_URL          = 'https://chatgpt.com/c/6a0deddf-1bac-83ea-8107-0e419a2c44ac';
const IMAGE_URL_PATTERN = 'estuary/content';
const MIN_GEN_DELAY_MS  = 10000;
const MAX_WAIT_MS       = 5 * 60 * 1000;
const ASSETS_DIR        = 'C:\\Users\\mnede\\Documents\\Claude\\video-creation\\assets\\price-vs-tech';

const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

// Overlays generated GLOWING ON PURE BLACK — composited in Remotion with mix-blend-mode:screen
// (the black drops out, only the glow floats over the video). ChatGPT's "transparent background"
// prompt produces a baked checkerboard, NOT real alpha — black + screen blend is the reliable way.
const ON_BLACK = ' Centered, brightly glowing and fully opaque, on a PURE SOLID BLACK (#000000) background and NOTHING else — no checkerboard, no gradient, no other objects, no text. Fills most of the frame.';

const IMAGES = [
  // ── Transparent-style overlays: glowing subject on pure black (screen-blend) ──
  { file: 'ov-kaspa-coin.png',
    prompt: 'A glowing teal/cyan Kaspa cryptocurrency coin with an embossed "K" logo, glossy 3D, strong teal glow and rim light.' + ON_BLACK },
  { file: 'ov-arrow-up.png',
    prompt: 'A bold bright neon-green upward-pointing arrow, glossy 3D, strong green glow.' + ON_BLACK },
  { file: 'ov-diamond.png',
    prompt: 'A bright glowing teal crystal diamond gem (a hidden-value gem), faceted, glossy, strong teal glow.' + ON_BLACK },
];

async function generateImage(page, prompt, outputPath) {
  const allSeenUrls = new Set();
  const urlTimestamps = new Map();
  const capturedBuffers = new Map();
  const handler = response => {
    const url = response.url();
    if (!url.includes(IMAGE_URL_PATTERN)) return;
    allSeenUrls.add(url);
    if (!urlTimestamps.has(url)) urlTimestamps.set(url, Date.now());
    if (!capturedBuffers.has(url)) capturedBuffers.set(url, response.body().catch(() => null));
  };
  page.on('response', handler);
  await page.waitForTimeout(2000);
  const baselineUrls = new Set(allSeenUrls);
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.keyboard.type(prompt, { delay: 10 });
  await page.keyboard.press('Enter');
  const promptSentAt = Date.now();
  console.log('  Prompt sent. Waiting for image...');
  const startTime = Date.now();
  let imgUrl = null;
  while (Date.now() - startTime < MAX_WAIT_MS) {
    const newUrls = [...allSeenUrls].filter(u => !baselineUrls.has(u))
      .filter(u => (urlTimestamps.get(u) - promptSentAt) >= MIN_GEN_DELAY_MS);
    if (newUrls.length > 0) { newUrls.sort((a, b) => urlTimestamps.get(b) - urlTimestamps.get(a)); imgUrl = newUrls[0]; break; }
    await page.waitForTimeout(1500);
  }
  page.removeListener('response', handler);
  if (!imgUrl) { console.log('  TIMEOUT — no image.'); return false; }
  const buf = await capturedBuffers.get(imgUrl);
  if (!buf) { console.log('  ERROR — buffer empty.'); return false; }
  fs.writeFileSync(outputPath, buf);
  console.log(`  Saved -> ${path.basename(outputPath)}`);
  await page.waitForTimeout(3000);
  return true;
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log('Launching Chrome...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
  const page = await browser.newPage();
  const imgRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(imgRoutePattern, route => route.abort());
  console.log('Navigating to B-roll chat...');
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  const composer = page.locator(SEL.composer).first();
  await composer.waitFor({ timeout: 30000 });
  console.log('Chat ready.\n');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(4000);
  await page.unroute(imgRoutePattern);
  await page.waitForTimeout(2000);
  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const outputPath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(outputPath)) { console.log(`[SKIP] ${file}`); done++; continue; }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${file}`);
    const ok = await generateImage(page, prompt, outputPath);
    if (ok) done++; else console.log(`  Failed — retry ${file} manually.`);
  }
  console.log(`\nDone: ${done}/${IMAGES.length} images.`);
  await browser.close();
}
main().catch(err => { console.error(err); process.exit(1); });
