// _grab-group-name.js — open a LinkedIn group page and print its name.
//   node linkedin-automation/tools/_grab-group-name.js [groupId]
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '..', 'schedule-tweets', 'node_modules', 'playwright'));
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\li-bot-profile';
const GROUP_ID = process.argv[2] || '9078205';
const URL = `https://www.linkedin.com/groups/${GROUP_ID}/`;

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages()[0] || await browser.newPage();
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const mainHead = await page.evaluate(() => {
      const m = document.querySelector('main');
      return m ? m.innerText.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 4) : [];
    });
    console.log('URL  :', page.url());
    console.log('TITLE:', JSON.stringify(title));
    console.log('H1   :', JSON.stringify(h1 && h1.trim()));
    console.log('MAIN :', JSON.stringify(mainHead));
    await page.waitForTimeout(2000);
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
