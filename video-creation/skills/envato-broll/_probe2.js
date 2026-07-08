// Dev probe 2: inspect the header/search DOM on the Videos page.
const { chromium } = require('playwright');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  const page = await browser.newPage();
  await page.goto('https://elements.envato.com/videos', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  console.log('URL:', page.url());

  const inputs = await page.evaluate(() => {
    const desc = (el) => ({
      tag: el.tagName, type: el.type || '', placeholder: el.placeholder || '',
      aria: el.getAttribute('aria-label') || '', id: el.id || '',
      cls: (el.className || '').toString().slice(0, 80),
      visible: !!(el.offsetWidth || el.offsetHeight),
    });
    return {
      inputs: Array.from(document.querySelectorAll('input, textarea, [contenteditable="true"]')).map(desc),
      searchish: Array.from(document.querySelectorAll('[class*="search" i], [data-testid*="search" i], [role="search"]'))
        .slice(0, 10).map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 100),
                                  testid: e.getAttribute('data-testid') || '' })),
    };
  });
  console.log(JSON.stringify(inputs, null, 2));
  await page.screenshot({ path: 'envato-probe2.png' });
  await browser.close();
})().catch(e => { console.error('probe2 failed:', e.message); process.exit(1); });
