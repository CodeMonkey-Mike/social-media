// Capture a clean "receipt" screenshot of a news article (headline + top of page).
// Dismisses common cookie/consent overlays. Usage: node _capture_receipt.js <url> <outpath> [--full]
const { chromium } = require('C:/Users/mnede/Documents/Claude/social-media/repurpose/node_modules/playwright');
const url = process.argv[2], out = process.argv[3], full = process.argv.includes('--full');
const CONSENT = [
  'Accept all', 'Accept All', 'I Accept', 'I agree', 'Agree', 'Accept', 'Got it', 'Okay, got it',
  'Allow all', 'Continue', 'Yes, I agree', 'AGREE', 'Accept Cookies', 'Reject all',
];
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1366, height: 1366 }, deviceScaleFactor: 2 });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    for (const label of CONSENT) {
      try {
        const b = page.getByRole('button', { name: label, exact: false }).first();
        if (await b.isVisible({ timeout: 600 })) { await b.click({ timeout: 1500 }); await page.waitForTimeout(800); break; }
      } catch (e) {}
    }
    // also nuke common fixed consent/paywall containers that linger
    await page.evaluate(() => {
      for (const sel of ['#onetrust-banner-sdk', '.fc-consent-root', '[id*="sp_message_container"]', '[class*="cookie"]', '[class*="consent"]']) {
        document.querySelectorAll(sel).forEach(e => { try { e.remove(); } catch (x) {} });
      }
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: out, fullPage: full });
    console.log('OK', out);
  } catch (e) {
    console.log('FAIL', url, e.message.split('\n')[0]);
  }
  await browser.close();
})();
