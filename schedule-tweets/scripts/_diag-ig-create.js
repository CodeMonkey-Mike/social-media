// _diag-ig-create.js — READ-ONLY diagnostic. Walks IG Create -> Post and dumps
// DOM state at each step so we can see why input[type="file"] never attaches.
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\igbot-profile';

async function dump(page, label) {
  const info = await page.evaluate(() => {
    const fileInputs = [...document.querySelectorAll('input[type="file"]')].map(i => ({
      accept: i.accept, multiple: i.multiple, name: i.name,
      hidden: i.offsetParent === null, cls: (i.className || '').slice(0, 40),
    }));
    const dialogs = [...document.querySelectorAll('[role="dialog"]')].map(d => ({
      aria: d.getAttribute('aria-label'),
      text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200),
    }));
    // clickable text inside any dialog (buttons / role=button / links)
    const clickable = [];
    const scope = document.querySelector('[role="dialog"]') || document.body;
    for (const el of scope.querySelectorAll('button,[role="button"],a,div[tabindex]')) {
      const t = (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (t && t.length < 40) clickable.push(t);
    }
    return { fileInputs, dialogs, clickable: [...new Set(clickable)].slice(0, 30) };
  });
  console.log(`\n===== ${label} =====`);
  console.log('input[type=file] count:', info.fileInputs.length, JSON.stringify(info.fileInputs));
  console.log('dialogs:', JSON.stringify(info.dialogs, null, 2));
  console.log('clickable texts:', JSON.stringify(info.clickable));
  await page.screenshot({ path: `tmp-ig-diag/${label}.png` }).catch(e => console.log('screenshot fail', e.message));
}

(async () => {
  const fs = require('fs');
  if (!fs.existsSync('tmp-ig-diag')) fs.mkdirSync('tmp-ig-diag');
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    await page.goto('https://www.instagram.com/');
    await page.waitForTimeout(3000);
    if (await page.locator('input[name="username"]').count() > 0) { console.log('NOT LOGGED IN'); await browser.close(); return; }
    console.log('logged in ✓');
    await dump(page, '0_home');

    // Click Create
    let createBtn = null;
    for (const sel of ['a[href="/create/select-type/"]', '[aria-label="New post"]', '[aria-label="Create"]']) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) { createBtn = el; console.log(`Create via: ${sel}`); break; }
    }
    if (!createBtn) createBtn = page.locator('text="Create"').first();
    const bb = await createBtn.boundingBox();
    if (bb) await page.mouse.click(bb.x + bb.width/2, bb.y + bb.height/2); else await createBtn.click();
    await page.waitForTimeout(2500);
    await dump(page, '1_after_create');

    // Click Post sub-link
    let postLink = page.getByRole('link', { name: /^Post$/ }).or(page.getByRole('button', { name: /^Post$/ })).first();
    if (await postLink.count() === 0) postLink = page.locator('a, button, span, div').filter({ hasText: /^Post$/ }).first();
    console.log('Post sub-link count:', await postLink.count());
    if (await postLink.count() > 0) {
      const pb = await postLink.boundingBox();
      if (pb) await page.mouse.click(pb.x + pb.width/2, pb.y + pb.height/2); else await postLink.click();
      console.log('clicked Post sub-link');
    }
    await page.waitForTimeout(2500);
    await dump(page, '2_after_post');

    // Look for a "Select from computer" button and click it, then re-dump
    const sel = page.locator('button:has-text("Select from"), [role="button"]:has-text("Select from")').first();
    console.log('Select-from-computer button count:', await sel.count());
    if (await sel.count() > 0) {
      console.log('NOTE: a Select-from-computer button exists — the file input likely appears only AFTER clicking it (or is already behind it).');
    }
    await dump(page, '3_final');
    console.log('\nLeaving browser open 90s for manual inspection...');
    await page.waitForTimeout(90000);
  } catch (e) {
    console.error('diag error:', e.message);
  } finally {
    await browser.close();
  }
})();
