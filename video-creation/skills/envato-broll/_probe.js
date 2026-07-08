// Dev probe: drive the new Envato UI search and dump URL + anchor patterns.
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
  await page.goto('https://elements.envato.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // dismiss tips popup if present
  const gotIt = page.locator('button:has-text("Okay, got it")');
  if (await gotIt.isVisible().catch(() => false)) await gotIt.click();

  // scope to Videos via the sidebar
  const videosNav = page.locator('a:has-text("Videos"), button:has-text("Videos")').first();
  if (await videosNav.isVisible().catch(() => false)) { await videosNav.click(); await page.waitForTimeout(2500); }

  // search box
  const search = page.locator('input[type="search"], input[placeholder*="Summon" i], input[placeholder*="search" i]').first();
  await search.click();
  await search.fill(QUERY);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  console.log('URL after search:', page.url());

  const hrefs = await page.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.getAttribute('href');
      if (h && (h.includes('/video') || /-[A-Z0-9]{6,9}([/?#]|$)/.test(h)) && !out.includes(h)) out.push(h);
      if (out.length >= 40) break;
    }
    return out;
  });
  console.log('candidate hrefs:\n' + hrefs.join('\n'));
  await page.screenshot({ path: 'envato-probe.png' });
  await browser.close();
})().catch(e => { console.error('probe failed:', e.message); process.exit(1); });
