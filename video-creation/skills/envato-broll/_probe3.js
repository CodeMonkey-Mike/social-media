// Dev probe 3: app.envato.com — scope to Videos, search, dump result anchors.
const { chromium } = require('playwright');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';
const QUERY = process.argv[2] || 'bank vault door closing';

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  const page = await browser.newPage();
  await page.goto('https://app.envato.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const gotIt = page.locator('button:has-text("Okay, got it")');
  if (await gotIt.isVisible().catch(() => false)) await gotIt.click();

  // sidebar: Stock > Videos
  const videosNav = page.locator('nav >> text="Videos"').first();
  if (await videosNav.isVisible().catch(() => false)) {
    await videosNav.click();
    await page.waitForTimeout(3000);
  }
  console.log('after Videos click:', page.url());

  const search = page.locator('input[placeholder*="Search" i], input[placeholder*="Summon" i]').first();
  await search.click();
  await search.fill(QUERY);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);
  console.log('after search:', page.url());

  const hrefs = await page.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.getAttribute('href');
      if (h && !out.includes(h)) out.push(h);
    }
    return out.slice(0, 60);
  });
  console.log('hrefs:\n' + hrefs.join('\n'));
  await page.screenshot({ path: 'envato-probe3.png' });
  await browser.close();
})().catch(e => { console.error('probe3 failed:', e.message); process.exit(1); });
