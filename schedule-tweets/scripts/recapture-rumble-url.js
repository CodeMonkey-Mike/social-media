// recapture-rumble-url.js — fix the Rumble URL for a short by matching its title
// on /account/content (where shorts live as /shorts/v<id>). Use for a short left
// `posted_unverified` by post-rumble-short.js, or one with a stale URL. READ-ONLY
// on Rumble; only writes the URL/status back to shorts.json. Does NOT re-upload.
//
// Usage: node scripts/recapture-rumble-url.js <short-id>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SHORTS_JSON = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\rumblebot-profile';
const PLATFORM = 'rumble';

const shortId = process.argv[2];
if (!shortId) { console.error('Usage: node scripts/recapture-rumble-url.js <short-id>'); process.exit(1); }

const norm = s => (s || '').toLowerCase().replace(/&#0?39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
  const short = (data.shorts || data).find(s => s.id === shortId);
  if (!short) { console.error(`Short not found: ${shortId}`); process.exit(1); }
  const title = (short.title || '').slice(0, 100);
  const needle = norm(title).slice(0, 40);
  console.log(`Recapturing Rumble URL for "${title}"`);

  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 30,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages().length ? browser.pages()[0] : await browser.newPage();
  try {
    let shortUrl = null;
    for (let attempt = 1; attempt <= 6 && !shortUrl; attempt++) {
      await page.goto('https://rumble.com/account/content', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000);
      const href = await page.evaluate((want) => {
        const n = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
        let best = null, bestLevel = 99;
        for (const a of document.querySelectorAll('a[href*="/shorts/v"]')) {
          let c = a;
          for (let lvl = 0; lvl < 5 && c; lvl++) {
            if (n(c.innerText).includes(want)) { if (lvl < bestLevel) { bestLevel = lvl; best = a; } break; }
            c = c.parentElement;
          }
        }
        return best ? best.getAttribute('href') : null;
      }, needle);
      if (href) { shortUrl = (href.startsWith('http') ? href : 'https://rumble.com' + href).split('?')[0]; console.log(`  Matched: ${shortUrl}`); }
      else { console.log(`  ${attempt}/6: not found yet — waiting...`); if (attempt < 6) await page.waitForTimeout(20000); }
    }
    if (!shortUrl) { console.error('Could not find the short on /account/content. Leaving shorts.json unchanged.'); process.exit(2); }

    // Liveness: confirm the public page title matches.
    const want = norm(title).slice(0, 25);
    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
    let live = false;
    for (let i = 1; i <= 5 && !live; i++) {
      try {
        const resp = await browser.request.get(shortUrl, { timeout: 20000, headers: { 'User-Agent': UA } });
        const html = await resp.text();
        const m = html.match(/<title>([^<]*)<\/title>/i) || html.match(/og:title"\s+content="([^"]*)"/i);
        const got = norm(m ? m[1] : '');
        if (got && want && got.includes(want)) { console.log(`  Liveness ✓ (title="${m[1]}")`); live = true; break; }
        console.log(`  Liveness ${i}/5: not live yet (title="${m ? m[1] : 'none'}")`);
      } catch (e) { console.log(`  Liveness ${i}/5 error: ${e.message.split('\n')[0]}`); }
      if (i < 5) await page.waitForTimeout(20000);
    }

    const data2 = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
    const s2 = (data2.shorts || data2).find(s => s.id === shortId);
    s2.platforms[PLATFORM].url = shortUrl;
    s2.platforms[PLATFORM].status = live ? 'posted' : 'posted_unverified';
    if (live) delete s2.platforms[PLATFORM].error;
    else s2.platforms[PLATFORM].error = 'URL captured from /account/content but public page not confirmed live in window — re-check the URL manually.';
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data2, null, 2));
    console.log(`Updated shorts.json: ${shortId} -> ${shortUrl} (${s2.platforms[PLATFORM].status})`);
  } finally {
    try { await browser.close(); } catch {}
  }
})();
