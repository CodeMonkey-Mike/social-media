// _list-bitchute-content.js — READ-ONLY. Lists the channel's /content (studio)
// videos: title + url + the visible row text (status/date/views). No uploads.

const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';

(async () => {
  const ctx = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  try {
    await page.goto('https://www.bitchute.com/content', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    try {
      await page.waitForFunction(() => document.querySelectorAll('a[href*="/video/"]').length > 0, { timeout: 20000 });
    } catch {}
    const rows = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      document.querySelectorAll('a[href*="/video/"]').forEach(a => {
        const m = (a.getAttribute('href') || '').match(/\/video\/([\w-]+)/);
        if (!m) return;
        const id = m[1];
        if (seen.has(id)) return;
        seen.add(id);
        // climb to a row-ish container and grab its text
        let node = a, rowText = '';
        for (let i = 0; i < 6 && node?.parentElement; i++) {
          node = node.parentElement;
          const t = (node.innerText || '').trim();
          if (t.length > rowText.length) rowText = t;
          if (rowText.length > 40) break;
        }
        out.push({ id, url: `https://www.bitchute.com/video/${id}/`, rowText: rowText.replace(/\s+/g, ' ').slice(0, 120) });
      });
      return out.slice(0, 12);
    });
    console.log('Top /content videos (most recent first):\n');
    rows.forEach((r, i) => console.log(`${i + 1}. ${r.id}  ${r.url}\n     ${r.rowText}`));
  } catch (e) {
    console.error('List error:', e.message);
  } finally {
    await ctx.close();
  }
})();
