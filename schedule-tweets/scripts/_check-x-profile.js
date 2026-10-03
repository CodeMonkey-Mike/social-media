// _check-x-profile.js — READ-ONLY. Lists the most recent tweets on Mike's profile
// so we can check whether a specific short already posted before retrying.
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    await page.goto('https://x.com/mikeneder', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    const tweets = await page.evaluate(() => {
      const arts = [...document.querySelectorAll('article')].slice(0, 8);
      return arts.map(a => {
        const text = (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160);
        const timeEl = a.querySelector('time');
        const time = timeEl ? timeEl.getAttribute('datetime') : null;
        const linkEl = a.querySelector('a[href*="/status/"]');
        const href = linkEl ? linkEl.href : null;
        const hasVideo = !!a.querySelector('video');
        return { time, href, hasVideo, text };
      });
    });
    console.log(JSON.stringify(tweets, null, 2));
  } catch (e) {
    console.error('check error:', e.message);
  } finally {
    await browser.close();
  }
})();
