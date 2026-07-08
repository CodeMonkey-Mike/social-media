// Dev probe 5: open a stock-video item page; dump buttons/download UI.
const { chromium } = require('playwright');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';
const ITEM = process.argv[2] ||
  'https://app.envato.com/search/stock-video/1ee78b28-5d39-4f0a-8d76-9d3e4659c246?itemType=stock-video&term=bank+vault+door+closing';

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  const page = await browser.newPage();
  await page.goto(ITEM, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  console.log('URL:', page.url());

  const ui = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a[role="button"]')).map(b => ({
      text: (b.innerText || '').trim().replace(/\n/g, ' / ').slice(0, 60),
      testid: b.getAttribute('data-testid') || '',
      visible: !!(b.offsetWidth || b.offsetHeight),
    })).filter(b => b.text && b.visible);
    const heads = Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText.trim().slice(0, 80));
    return { heads, btns: btns.slice(0, 30) };
  });
  console.log(JSON.stringify(ui, null, 2));
  await page.screenshot({ path: 'envato-probe5.png' });
  await browser.close();
})().catch(e => { console.error('probe5 failed:', e.message); process.exit(1); });
