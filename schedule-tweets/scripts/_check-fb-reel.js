// Read-only: open a specific FB reel URL and dump its caption text to verify identity.
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\fbbot-profile';
const url = process.argv[2];

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const text = await page.evaluate(() => document.body.innerText.slice(0, 600));
  console.log(text);
  await browser.close().catch(() => {});
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
