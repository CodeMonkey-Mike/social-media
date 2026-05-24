// check-fb-longform.js — READ-ONLY. Finds the most-recent video post on the FB
// page so we can identify the longform we just uploaded (it may have been still
// processing when the uploader captured a stale URL).
const { chromium } = require('playwright');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\fbbot-profile';
const FB_PAGE = 'realCodeMonkeyMike';

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    // 1) Videos tab — list each video link with whatever nearby title/aria text we can grab.
    console.log('=== /videos tab ===');
    await page.goto(`https://www.facebook.com/${FB_PAGE}/videos`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const vids = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      for (const a of document.querySelectorAll('a[href*="/videos/"], a[href*="/reel/"]')) {
        const href = a.href.split('?')[0];
        if (!/\/videos\/\d|\/reel\/\d/.test(href)) continue;
        if (seen.has(href)) continue; seen.add(href);
        // climb to a container that has visible text (title/caption)
        let el = a, label = '';
        for (let i = 0; i < 5 && el; i++) { const t = (el.getAttribute && el.getAttribute('aria-label')) || ''; if (t) { label = t; break; } el = el.parentElement; }
        const near = (a.closest('[role="article"], div') || a).innerText || '';
        out.push({ href, label: label.slice(0, 80), text: near.replace(/\s+/g, ' ').trim().slice(0, 100) });
      }
      return out.slice(0, 8);
    });
    vids.forEach((v, i) => console.log(`  [${i}] ${v.href}\n        label="${v.label}" text="${v.text}"`));

    // 2) Page feed — topmost post (a fresh video post lands here before the /videos tab updates).
    console.log('\n=== page feed (top posts) ===');
    await page.goto(`https://www.facebook.com/${FB_PAGE}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const feed = await page.evaluate(() => {
      const arts = [...document.querySelectorAll('[role="article"]')].slice(0, 4);
      return arts.map(a => {
        const links = [...a.querySelectorAll('a[href]')].map(x => x.href.split('?')[0])
          .filter(h => /\/videos\/\d|\/reel\/\d|\/posts\/|story_fbid|\/permalink\//.test(h));
        const hasVideo = !!a.querySelector('video');
        return { text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120), hasVideo, links: [...new Set(links)].slice(0, 4) };
      });
    });
    feed.forEach((f, i) => console.log(`  [${i}] hasVideo=${f.hasVideo}\n        text="${f.text}"\n        links=${JSON.stringify(f.links)}`));
  } catch (e) {
    console.error('check error:', e.message);
  } finally {
    await browser.close();
  }
})();
