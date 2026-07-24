// check-rumble-longform.js — READ-ONLY. Lists the most recent videos on
// /account/content so we can identify a longform that was uploaded but whose
// URL-capture step got interrupted (e.g. the run was killed after "Clicked
// Upload" but before the script finished scanning for the direct link).
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\rumblebot-profile';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    console.log('=== /account/content ===');
    await page.goto('https://rumble.com/account/content', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const vids = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      for (const a of document.querySelectorAll('a[href*="/v"], a[href*="/shorts/v"]')) {
        const href = a.href.split('?')[0];
        if (!/rumble\.com\/v[a-zA-Z0-9]/.test(href)) continue;
        if (seen.has(href)) continue; seen.add(href);
        let el = a, label = '';
        for (let i = 0; i < 5 && el; i++) { const t = el.getAttribute && el.getAttribute('title'); if (t) { label = t; break; } el = el.parentElement; }
        const near = (a.closest('div') || a).innerText || '';
        out.push({ href, label: label.slice(0, 100), text: near.replace(/\s+/g, ' ').trim().slice(0, 140) });
      }
      return out.slice(0, 10);
    });
    vids.forEach((v, i) => console.log(`  [${i}] ${v.href}\n        label="${v.label}"\n        text="${v.text}"`));
  } catch (e) {
    console.error('check error:', e.message);
  } finally {
    await browser.close();
  }
})();
