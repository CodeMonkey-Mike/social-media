// Dev probe 4: direct stock-video search on app.envato.com; dump item cards.
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
  const url = 'https://app.envato.com/search?itemType=stock-video&term=' + encodeURIComponent(QUERY).replace(/%20/g, '+');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  console.log('URL:', page.url());

  const items = await page.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('a[href*="stock-video"]')) {
      const href = a.getAttribute('href');
      if (!/stock-video\/[0-9a-f-]{30,}/.test(href)) continue;
      const card = a.closest('article, li, [class*="card" i], div');
      const img = (card || a).querySelector('img');
      const video = (card || a).querySelector('video');
      const text = card ? card.innerText.replace(/\n/g, ' | ') : '';
      out.push({
        href,
        title: (img && img.alt) || a.getAttribute('aria-label') || a.title || '',
        cardText: text.slice(0, 160),
        img: img ? (img.currentSrc || img.src).slice(0, 140) : '',
        videoSrc: video ? (video.currentSrc || video.src || '').slice(0, 140) : '',
      });
      if (out.length >= 8) break;
    }
    return out;
  });
  console.log(JSON.stringify(items, null, 2));
  await page.screenshot({ path: 'envato-probe4.png', fullPage: false });
  await browser.close();
})().catch(e => { console.error('probe4 failed:', e.message); process.exit(1); });
