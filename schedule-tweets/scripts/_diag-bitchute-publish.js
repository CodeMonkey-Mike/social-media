// _diag-bitchute-publish.js — runs the upload flow up THROUGH the publish click,
// then DUMPS whatever modal/dialog appears (text + screenshot + hidden thumbnail
// value) so we can see what's actually blocking publish. Does not loop/retry.

const { chromium } = require('playwright');
const path = require('path');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';
const BITCHUTE_HOME  = 'https://www.bitchute.com/';
const VIDEO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\shorts\\best-350x\\elizaos-freebie.mp4';
const THUMB = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\shorts\\best-350x\\elizaos-freebie-thumb.jpg';
const SHOT  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\scripts\\_bitchute-publish-modal.png';

const sleep = (p, ms) => p.waitForTimeout(ms);

(async () => {
  const ctx = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  try {
    await page.goto(BITCHUTE_HOME, { waitUntil: 'domcontentloaded' });
    await sleep(page, 2000);
    await page.waitForFunction(() =>
      !![...document.querySelectorAll('button')].find(b => b.innerText?.trim().includes('video_call')),
      { timeout: 600000 });
    console.log('Logged in ✓');
    await page.locator('button:has-text("video_call")').first().evaluate(el => el.click());
    await sleep(page, 800);
    const [up] = await Promise.all([
      ctx.waitForEvent('page', { timeout: 15000 }),
      page.getByText('Upload Video', { exact: true }).first().evaluate(el => el.click()),
    ]);
    await up.waitForLoadState('domcontentloaded');
    console.log('Upload page:', up.url());
    await sleep(up, 2500);

    await up.locator('input[type="file"]').nth(0).setInputFiles(VIDEO);
    console.log('Video attached');
    await up.locator('input[placeholder="Title"]').first().fill('The 24x Rebrand Nobody Is Watching');
    await up.locator('textarea').first().fill('diag');
    await up.locator('input[placeholder="Search Terms"]').first().fill('test');

    // custom thumbnail
    await up.locator('input[type="file"][accept*="image"]').first().setInputFiles(THUMB);
    console.log('Thumbnail file set; waiting for processing...');
    const thumbOk = await up.waitForFunction(() => {
      const hidden = [...document.querySelectorAll('input[name="thumbnailInput"]')].find(el => el.type === 'hidden');
      return hidden && hidden.value && hidden.value !== 'undefined' && hidden.value.trim() !== '';
    }, { timeout: 60000 }).then(() => true).catch(() => false);
    const hiddenVal = await up.evaluate(() => {
      const h = [...document.querySelectorAll('input[name="thumbnailInput"]')].find(el => el.type === 'hidden');
      return h ? h.value : '(no hidden input)';
    });
    console.log('thumb processing-complete:', thumbOk, '| hidden thumbnailInput value =', hiddenVal);

    // wait for Proceed enabled
    const proceed = up.getByRole('button', { name: 'Proceed' }).first();
    await proceed.waitFor({ state: 'visible', timeout: 30000 });
    for (let i = 0; i < 600; i++) {
      const d = await proceed.getAttribute('disabled');
      const a = await proceed.getAttribute('aria-disabled');
      if (d === null && a !== 'true') break;
      await sleep(up, 500);
    }
    console.log('Clicking first Proceed...');
    await proceed.click();
    await sleep(up, 1500);
    // publish checkbox
    try {
      const lbl = up.locator('label:has-text("Publish Right Away")').first();
      await lbl.waitFor({ state: 'visible', timeout: 8000 });
      const cbFor = await lbl.getAttribute('for');
      const cb = cbFor ? up.locator(`input#${cbFor}`) : lbl.locator('input[type="checkbox"]').first();
      if (!await cb.isChecked()) await lbl.click();
      console.log('Publish Right Away ensured checked');
      await sleep(up, 500);
      await up.getByRole('button', { name: 'Proceed' }).first().click();
      console.log('Clicked second Proceed');
    } catch (e) {
      console.log('No publish checkbox:', e.message.split('\n')[0]);
    }

    // Wait and capture whatever appears
    await sleep(up, 6000);
    await up.screenshot({ path: SHOT, fullPage: true }).catch(() => {});
    const dump = await up.evaluate(() => {
      const texts = [];
      const sels = ['.q-dialog', '[role="dialog"]', '.modal', '.swal2-popup', '.q-notification', '.toast', '.alert', '[class*="dialog"]', '[class*="modal"]'];
      const seen = new Set();
      sels.forEach(s => document.querySelectorAll(s).forEach(el => {
        const t = (el.innerText || '').trim();
        if (t && !seen.has(t)) { seen.add(t); texts.push({ sel: s, text: t.slice(0, 300) }); }
      }));
      const url = location.href;
      const bodyHasMissing = /thumbnail/i.test(document.body.innerText || '');
      return { url, texts, bodyHasMissing };
    });
    console.log('\n=== POST-PUBLISH PAGE STATE ===');
    console.log('url:', dump.url);
    console.log('body mentions "thumbnail":', dump.bodyHasMissing);
    console.log('dialogs/modals:');
    dump.texts.forEach(t => console.log('  [' + t.sel + '] ' + JSON.stringify(t.text)));
    console.log('Screenshot:', SHOT);

    console.log('\nClosing (no further action).');
    await up.close();
  } catch (e) {
    console.error('Diag error:', e.message);
  } finally {
    await ctx.close();
  }
})();
