// _probe-search.js — find a working "search a name -> click the result" path.
// Tests (A) the new "I'm looking for…" nav input, and (B) a direct people-search
// URL, and for each reports whether the target profile link is present/clickable.
// Single-instance: don't run while scrape-group-members.js is running.

const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '..', '..', 'schedule-tweets', 'node_modules', 'playwright'));
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\li-bot-profile';
const AUTHWALL_RE = /\/(login|uas\/login|checkpoint|authwall|signup)(\/|\?|$)/i;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// A real member from the queue: slug + the name a human would type.
const NAME = 'mangesh deshmukh';
const SLUG = 'mangesh-deshmukh-32a2b2261';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();

  const report = async (label) => {
    const url = page.url();
    const anyIn = await page.locator('a[href*="/in/"]').count().catch(() => -1);
    const exact = await page.locator(`a[href*="/in/${SLUG}"]`).count().catch(() => -1);
    let exactVisible = false;
    try { exactVisible = await page.locator(`a[href*="/in/${SLUG}"]`).first().isVisible(); } catch {}
    console.log(`[${label}] url=${url}`);
    console.log(`         a[href*="/in/"]=${anyIn}  exact(${SLUG})=${exact} visible=${exactVisible}`);
  };

  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 100 && AUTHWALL_RE.test(page.url()); i++) { console.log('waiting for login...'); await sleep(3000); }
    await sleep(4000);

    // ---- (A) the new "I'm looking for…" nav input ----
    console.log('\n=== (A) nav input: "I\'m looking for…" ===');
    try {
      const box = page.locator('input[placeholder*="looking for"]').first();
      console.log('count =', await box.count());
      await box.click({ timeout: 6000 });
      await box.fill('');
      await box.type(NAME, { delay: 90 });
      await sleep(1500);
      await box.press('Enter');
      await sleep(4000);
      await report('A after Enter');
    } catch (e) {
      console.log('A FAILED:', String(e.message).split('\n')[0], '| url now', page.url());
    }

    // ---- (B) direct people-search results URL ----
    console.log('\n=== (B) direct people-search URL ===');
    try {
      const surl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(NAME)}`;
      await page.goto(surl, { waitUntil: 'domcontentloaded' });
      await sleep(4500);
      await report('B people results');
    } catch (e) {
      console.log('B FAILED:', String(e.message).split('\n')[0], '| url now', page.url());
    }

    // Dump the first /in/ hrefs + nearby text so we can see their format.
    console.log('\n=== sample /in/ links on people results ===');
    const samples = await page.$$eval('a[href*="/in/"]', els => els.slice(0, 12).map(a => ({
      href: a.getAttribute('href'),
      text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
    })));
    for (const s of samples) console.log(JSON.stringify(s));

    // ---- (B2) all-results URL (in case people tab needs a click/premium) ----
    console.log('\n=== (B2) direct all-results URL ===');
    try {
      const surl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(NAME)}`;
      await page.goto(surl, { waitUntil: 'domcontentloaded' });
      await sleep(4500);
      await report('B2 all results');
    } catch (e) {
      console.log('B2 FAILED:', String(e.message).split('\n')[0], '| url now', page.url());
    }

    console.log('\nLeaving browser open 15s...');
    await sleep(15000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
