// Read-only check: does the IG reels grid show a fresh upload? Never uploads anything.
const { chromium } = require('playwright');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\igbot-profile';
const IG_USERNAME = 'realcodemonkeymike';
const TARGET_URL = process.argv[2] || null;

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    viewport: null,
  });
  const page = browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();

  if (TARGET_URL) {
    await page.goto(TARGET_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const info = await page.evaluate(() => {
      const t = document.querySelector('time');
      return {
        title: document.title,
        datetime: t?.getAttribute('datetime') || null,
        text: t?.innerText || null,
        bodySnippet: document.body.innerText.slice(0, 400),
      };
    });
    console.log(JSON.stringify(info, null, 2));
  } else {
    await page.goto(`https://www.instagram.com/${IG_USERNAME}/reels/`);
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const urls = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="/reel/"]')].slice(0, 5).map(a => a.href));
    console.log(JSON.stringify(urls, null, 2));
  }
  await browser.close().catch(() => {});
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
