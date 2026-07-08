// _diag-bitchute-thumb.js — READ-ONLY diagnostic.
// Opens the BitChute upload page, attaches a video, and dumps every file input
// + thumbnail-area control so we can find the custom-thumbnail upload selector.
// Does NOT proceed/publish — closes the upload tab without submitting.

const { chromium } = require('playwright');
const path = require('path');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';
const BITCHUTE_HOME  = 'https://www.bitchute.com/';
const VIDEO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\shorts\\best-350x\\elizaos-freebie.mp4';

(async () => {
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = context.pages()[0] || await context.newPage();
  try {
    await page.goto(BITCHUTE_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log('Waiting for upload icon (login)...');
    await page.waitForFunction(() =>
      !![...document.querySelectorAll('button')].find(b => b.innerText?.trim().includes('video_call')),
      { timeout: 600000 });
    console.log('Logged in ✓');
    await page.waitForTimeout(1000);

    const uploadIcon = page.locator('button:has-text("video_call")').first();
    await uploadIcon.evaluate(el => el.click());
    await page.waitForTimeout(800);
    const uploadVideoEl = page.getByText('Upload Video', { exact: true }).first();
    const [up] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      uploadVideoEl.evaluate(el => el.click()),
    ]);
    await up.waitForLoadState('domcontentloaded');
    console.log('Upload page:', up.url());
    await up.waitForTimeout(2500);

    // Attach video so the thumbnail UI renders
    const vin = up.locator('input[type="file"]').nth(0);
    await vin.waitFor({ state: 'attached', timeout: 20000 });
    await vin.setInputFiles(VIDEO);
    console.log('Video attached. Waiting for thumbnail UI...');
    await up.waitForTimeout(6000);

    const dump = await up.evaluate(() => {
      const out = { fileInputs: [], buttons: [], thumbMentions: [] };
      document.querySelectorAll('input[type="file"]').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        out.fileInputs.push({
          i, accept: el.accept || '', name: el.name || '', id: el.id || '',
          cls: el.className || '', hidden: el.offsetParent === null,
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        });
      });
      [...document.querySelectorAll('button')].forEach(b => {
        const t = (b.innerText || '').trim();
        if (t) out.buttons.push({ text: t.slice(0, 40), id: b.id || '', cls: (b.className || '').slice(0, 60) });
      });
      // Any element mentioning thumbnail / cover / image upload
      [...document.querySelectorAll('*')].forEach(el => {
        const t = (el.childNodes.length === 1 && el.textContent || '').trim();
        if (/thumbnail|cover image|upload.*image|custom.*thumb/i.test(t) && t.length < 60) {
          out.thumbMentions.push({ tag: el.tagName, text: t, cls: (el.className || '').toString().slice(0, 50) });
        }
      });
      return out;
    });
    console.log('\n=== FILE INPUTS ===');
    dump.fileInputs.forEach(f => console.log(JSON.stringify(f)));
    console.log('\n=== BUTTONS ===');
    dump.buttons.forEach(b => console.log(JSON.stringify(b)));
    console.log('\n=== THUMBNAIL MENTIONS ===');
    dump.thumbMentions.forEach(m => console.log(JSON.stringify(m)));

    console.log('\nClosing upload tab WITHOUT proceeding (no draft).');
    await up.close();
  } catch (e) {
    console.error('Diag error:', e.message);
  } finally {
    await context.close();
  }
})();
