// One-off script to generate the favorites-coin-lineup image with 3 reference uploads.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_DIR  = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMAGES_DIR   = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\x';
const CHAT_URL     = 'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24';
const IMAGE_URL_PATTERN = 'estuary/content';

const IMAGE_ID     = 'a2f8c3e1';
const SLUG         = 'favorites-coin-lineup';
const TARGET_PATH  = path.join(IMAGES_DIR, `x-tweets-${IMAGE_ID}-${SLUG}.png`);
const REFERENCES   = [
  'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\linea.png',
  'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\ElizaOS-ai16z.webp',
  'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference\\housecoin.webp',
];
const PROMPT = fs.readFileSync('prompts/p-favorites-coin-lineup-multi.txt', 'utf8').trim();

async function main() {
  const preDelay = Math.floor(Math.random() * 11000) + 5000;
  console.log(`Pre-launch delay: ${(preDelay / 1000).toFixed(1)}s...`);
  await new Promise(r => setTimeout(r, preDelay));

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
  const imageRoutePattern = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(imageRoutePattern, route => route.abort());

  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');

  const composer = page.locator('#prompt-textarea, div[contenteditable="true"][data-id]').first();
  await composer.waitFor({ timeout: 30000 });
  console.log('Chat ready.');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(imageRoutePattern);

  const allSeenUrls = new Set();
  const urlTimestamps = new Map();
  const capturedBuffers = new Map();
  page.on('response', (response) => {
    const url = response.url();
    if (!url.includes(IMAGE_URL_PATTERN)) return;
    allSeenUrls.add(url);
    if (!urlTimestamps.has(url)) urlTimestamps.set(url, Date.now());
    if (!capturedBuffers.has(url)) {
      capturedBuffers.set(url, response.body().catch(() => null));
    }
  });

  await page.waitForTimeout(5000);
  const baselineUrls = new Set(allSeenUrls);
  console.log(`Baseline image URLs: ${baselineUrls.size}`);

  await composer.click();

  // Upload all three reference images sequentially via direct file input
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.waitFor({ state: 'attached', timeout: 10000 });

  for (const ref of REFERENCES) {
    console.log(`Uploading: ${path.basename(ref)}`);
    await fileInput.setInputFiles(ref, { timeout: 10000 });
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(3000);
  console.log('All 3 reference images uploaded.');

  await composer.click();
  console.log('Typing prompt...');
  await page.keyboard.type(PROMPT, { delay: 15 });
  await page.keyboard.press('Enter');
  const promptSentAt = Date.now();
  console.log('Prompt sent. Waiting for image (up to 5 min)...');

  const MIN_GEN_DELAY_MS = 10000;
  const maxWaitMs = 5 * 60 * 1000;
  const startTime = Date.now();
  let lastNewCount = 0;
  let stableSince = null;
  let imgUrl = null;

  while (Date.now() - startTime < maxWaitMs) {
    const newUrls = [...allSeenUrls]
      .filter(u => !baselineUrls.has(u))
      .filter(u => (urlTimestamps.get(u) - promptSentAt) >= MIN_GEN_DELAY_MS);
    if (newUrls.length > lastNewCount) {
      lastNewCount = newUrls.length;
      stableSince = Date.now();
    } else if (newUrls.length > 0 && stableSince && Date.now() - stableSince >= 3000) {
      imgUrl = newUrls[newUrls.length - 1];
      break;
    }
    await page.waitForTimeout(1500);
  }

  if (!imgUrl) throw new Error('Timed out waiting for image.');

  const buf = await capturedBuffers.get(imgUrl);
  if (!buf) throw new Error('Could not capture image buffer.');
  fs.writeFileSync(TARGET_PATH, buf);
  console.log(`Done. Image saved: ${TARGET_PATH} (${(buf.length / 1024).toFixed(1)} KB)`);

  await browser.close();
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });
