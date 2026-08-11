// _gen-neutral-freshchat.js — one-off: regenerate the neutral-layers-kas-tao YT
// carousel slides in a FRESH ChatGPT chat (the persistent YT Images chat stopped
// rendering images mid-run on 2026-06-05). Based on _gen-353x-redo.js (fresh-chat
// pattern) but writes into schedule-tweets/images/yt/ with the yt-posts naming.
// Usage: node _gen-neutral-freshchat.js
const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const OUT_DIR     = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\yt';
const MAX_WAIT_MS = 4 * 60 * 1000;
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

// only the neutral-layers slides (the 1992 set is already on disk and will be skipped anyway)
const ALL = JSON.parse(fs.readFileSync(path.join(__dirname, '_genlist-yt.json'), 'utf-8'));
const NEUTRAL_SLUGS = new Set(['01-hook-neutral','02-thesis-control','03-kas-money-layer','04-tao-ai-layer','05-engagement-neutral']);
const IMAGES = ALL.filter(i => NEUTRAL_SLUGS.has(i.slug));

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
  console.log('Launching Chrome (chatgpt-profile)...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  console.log('Opening a FRESH ChatGPT chat...');
  await page.goto('https://chatgpt.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.locator(SEL.composer).first().waitFor({ timeout: 30000 });
  console.log('Chat ready.\n');
  await page.waitForTimeout(2000);

  let done = 0;
  for (const { image_id, slug, prompt } of IMAGES) {
    const outputPath = path.join(OUT_DIR, `yt-posts-${image_id}-${slug}.png`);
    if (fs.existsSync(outputPath)) { console.log(`[SKIP] ${slug}`); done++; continue; }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${slug}`);
    let ok = await generateImage(page, prompt, outputPath);
    if (!ok) { console.log('  retrying once...'); ok = await generateImage(page, prompt, outputPath); }
    if (ok) done++; else console.log(`  FAILED ${slug}`);
  }
  console.log(`\nDone: ${done}/${IMAGES.length} neutral-layers slides.`);
  await browser.close();
}
main().catch(err => { console.error(err); process.exit(1); });
