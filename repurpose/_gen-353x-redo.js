// _gen-353x-redo.js  — TEMP one-off generator for the 353x shorts #2/#3 redo.
// Copy of generate-broll-wlw.js, but opens a FRESH chat instead of the persistent
// B-roll chat. Reason: this is a REGEN of a topic that already has images in the
// persistent chat; reusing it risks re-capturing old history images as "new"
// (see memory: image-gen-history-contamination). One fresh chat for the whole run.
// Usage: node _gen-353x-redo.js <list.json>

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const ASSETS_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation\\assets';
const MAX_WAIT_MS = 4 * 60 * 1000;
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

const LIST_FILE = process.argv[2];
if (!LIST_FILE) { console.error('Pass a prompt-list JSON path.'); process.exit(1); }
const IMAGES = JSON.parse(fs.readFileSync(LIST_FILE, 'utf-8'));

const getGenImgs = (page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('img'))
    .map(i => i.src)
    .filter(s => s.includes('estuary/content') || s.includes('oaiusercontent')));

async function generateImage(page, prompt, outputPath) {
  const baseline = new Set(await getGenImgs(page));
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.keyboard.type(prompt, { delay: 6 });
  await page.keyboard.press('Enter');
  console.log('  Prompt sent. Waiting for image to render...');

  const start = Date.now();
  let src = null;
  while (Date.now() - start < MAX_WAIT_MS) {
    await page.waitForTimeout(2500);
    const cur = await getGenImgs(page);
    const fresh = cur.filter(s => !baseline.has(s));
    if (fresh.length) {
      await page.waitForTimeout(4000);
      const cur2 = await getGenImgs(page);
      const fresh2 = cur2.filter(s => !baseline.has(s));
      src = (fresh2.length ? fresh2 : fresh)[fresh.length - 1];
      break;
    }
  }
  if (!src) { console.log('  TIMEOUT — no new image in DOM.'); return false; }

  try {
    const resp = await page.request.get(src);
    if (!resp.ok()) { console.log('  fetch not ok:', resp.status()); return false; }
    const buf = await resp.body();
    if (!buf || buf.length < 1000) { console.log('  buffer too small:', buf && buf.length); return false; }
    fs.writeFileSync(outputPath, buf);
    console.log(`  Saved -> ${path.basename(outputPath)} (${(buf.length/1024).toFixed(0)} KB)`);
    await page.waitForTimeout(2500);
    return true;
  } catch (e) { console.log('  fetch error:', e.message); return false; }
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log('Launching Chrome...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  // FRESH chat (not the persistent B-roll chat) — regen-contamination avoidance.
  console.log('Opening a fresh ChatGPT chat...');
  await page.goto('https://chatgpt.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.locator(SEL.composer).first().waitFor({ timeout: 30000 });
  console.log('Chat ready.\n');
  await page.waitForTimeout(2000);

  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const outputPath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(outputPath)) { console.log(`[SKIP] ${file}`); done++; continue; }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${file}`);
    let ok = await generateImage(page, prompt, outputPath);
    if (!ok) { console.log('  retrying once...'); ok = await generateImage(page, prompt, outputPath); }
    if (ok) done++; else console.log(`  FAILED ${file}`);
  }
  console.log(`\nDone: ${done}/${IMAGES.length} images.`);
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
