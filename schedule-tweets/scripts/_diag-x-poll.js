// Diagnostic: find the "Add a choice" button in X's poll widget
const { chromium } = require('playwright');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });

  const page = browser.pages()[0] || await browser.newPage();
  await page.goto('https://x.com/home');
  await page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 20000 });
  await page.waitForTimeout(2000);

  // Open composer
  await page.locator('[data-testid="SideNav_NewTweet_Button"]').click();
  await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Type something first (modal intercepts clicks on a clean empty textarea)
  await page.locator('[data-testid="tweetTextarea_0"]').first().click();
  await page.keyboard.type('test');
  await page.waitForTimeout(500);

  // Click poll button via JS to bypass any overlay
  await page.evaluate(() => {
    const btns = document.querySelectorAll('[data-testid="createPollButton"]');
    (btns[btns.length - 1] || btns[0]).dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
  });
  await page.waitForSelector('[data-testid="selectPollDays"]', { timeout: 10000 });
  await page.waitForTimeout(2000);

  console.log('\n=== Buttons AFTER poll widget opens ===');
  const btns = await page.evaluate(() =>
    [...document.querySelectorAll('button')].map(b => ({
      testid: b.getAttribute('data-testid'),
      label: b.getAttribute('aria-label'),
      text: b.innerText.trim().slice(0, 60),
    })).filter(b => b.label || b.testid || b.text)
  );
  console.log(JSON.stringify(btns, null, 2));

  // Look for anything that might be "add choice"
  const addLike = btns.filter(b =>
    (b.text || '').toLowerCase().includes('add') ||
    (b.label || '').toLowerCase().includes('add') ||
    (b.testid || '').toLowerCase().includes('add') ||
    (b.testid || '').toLowerCase().includes('choice') ||
    (b.testid || '').toLowerCase().includes('option')
  );
  console.log('\n=== Add-like buttons ===');
  console.log(JSON.stringify(addLike, null, 2));

  await page.waitForTimeout(3000);
  await browser.close();
})().catch(err => { console.error('Diagnostic failed:', err.message); process.exit(1); });
