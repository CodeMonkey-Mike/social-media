// diag-chatgpt.js — diagnose why image capture failed.
// Sends one prompt, logs ALL image-ish response URLs + content-types, screenshots the page.
const { chromium } = require('playwright');
const fs = require('fs');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };
const SHOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_diag-shot.png';

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  const hits = [];
  page.on('response', async (r) => {
    try {
      const ct = (r.headers()['content-type'] || '');
      const u = r.url();
      if (ct.startsWith('image/') || /oaiusercontent|estuary|sandbox|files\.|image|\.png|\.webp|\.jpg/i.test(u)) {
        hits.push(`${ct.padEnd(14)} ${u.slice(0, 160)}`);
      }
    } catch {}
  });
  console.log('goto...');
  await page.goto('https://chatgpt.com/');
  await page.waitForLoadState('domcontentloaded');
  console.log('URL after load:', page.url());
  let composerOk = false;
  try { await page.locator(SEL.composer).first().waitFor({ timeout: 20000 }); composerOk = true; } catch {}
  console.log('composer found:', composerOk);
  if (composerOk) {
    const composer = page.locator(SEL.composer).first();
    await composer.click();
    await page.keyboard.type('Generate an image: a simple glowing teal crypto coin on a dark background, vertical 9:16, cinematic. No text.', { delay: 8 });
    await page.keyboard.press('Enter');
    console.log('prompt sent; waiting 120s...');
    await page.waitForTimeout(120000);
  }
  // dump last assistant text
  let lastMsg = '';
  try {
    lastMsg = await page.evaluate(() => {
      const els = document.querySelectorAll('[data-message-author-role="assistant"]');
      const last = els[els.length - 1];
      return last ? last.innerText.slice(0, 400) : '(no assistant message)';
    });
  } catch (e) { lastMsg = 'eval err: ' + e.message; }
  await page.screenshot({ path: SHOT, fullPage: false });
  console.log('\n=== assistant last message ===\n' + lastMsg);
  console.log('\n=== image-ish response URLs (' + hits.length + ') ===');
  console.log([...new Set(hits)].slice(0, 40).join('\n'));
  console.log('\nscreenshot:', SHOT);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
