// Diagnostic: click IG Create and dump all links/buttons that appear in the expanded sidebar
const { chromium } = require('playwright');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\igbot-profile';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  const page = browser.pages()[0] || await browser.newPage();

  await page.goto('https://www.instagram.com/');
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Snapshot hrefs before clicking Create
  const beforeLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
  );

  // Click Create
  const createBtn = page.locator('[aria-label="New post"]').first();
  await createBtn.click();
  await page.waitForTimeout(2500);

  // Snapshot after
  const afterLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), text: a.innerText?.trim().slice(0, 60) }))
  );

  // Show new links
  const newLinks = afterLinks.filter(l => !beforeLinks.includes(l.href));
  console.log('\n=== New <a> links after Create click ===');
  console.log(JSON.stringify(newLinks, null, 2));

  // Also dump all visible buttons
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll('button, [role="button"]')].filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 150;
    }).map(b => ({
      tag: b.tagName,
      text: (b.innerText || b.textContent || '').trim().slice(0, 60),
      aria: b.getAttribute('aria-label'),
      href: b.getAttribute('href'),
    }))
  );
  console.log('\n=== Visible buttons/roles after Create ===');
  console.log(JSON.stringify(buttons.filter(b => b.text || b.aria), null, 2));

  // Show all <a> with href after click
  console.log('\n=== ALL <a> hrefs after Create click ===');
  for (const l of afterLinks) {
    if (l.href && (l.href.includes('reel') || l.href.includes('create') || l.href.includes('story'))) {
      console.log(JSON.stringify(l));
    }
  }

  await page.waitForTimeout(15000);
  await browser.close();
})().catch(err => { console.error(err.message); process.exit(1); });
