// retry-bitchute-url.js — re-scrape BitChute /content to find the real URL for
// a short whose JSON entry currently has the /content placeholder. Useful when
// the post-upload scrape ran before the new video had propagated to the dashboard.
//
// Usage:
//   node scripts/retry-bitchute-url.js <short-id> [--wait-seconds N]
//
// Defaults to --wait-seconds 600 if not provided.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';
const PLATFORM       = 'bitchute';
const BITCHUTE_HOME  = 'https://www.bitchute.com/';
const PLACEHOLDER    = 'https://www.bitchute.com/content';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/retry-bitchute-url.js <short-id> [--wait-seconds N]');
  process.exit(1);
}
const shortId = args[0];
const waitIdx = args.indexOf('--wait-seconds');
const waitSec = waitIdx >= 0 ? parseInt(args[waitIdx + 1], 10) : 600;

async function scrapeContentPage(page) {
  await page.goto(`${BITCHUTE_HOME.replace(/\/$/, '')}/content`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  try {
    await page.waitForFunction(() => {
      return document.querySelectorAll('a[href*="/video/"]').length > 0
        || /no videos|nothing here/i.test(document.body.innerText || '');
    }, { timeout: 20000 });
  } catch {}
  return await page.evaluate(() => {
    const items = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="/video/"]').forEach(a => {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/video\/([\w-]+)/);
      if (!m) return;
      const videoId = m[1];
      if (seen.has(videoId)) return;
      let title = (a.innerText || '').trim();
      let node = a;
      for (let i = 0; i < 8 && !title && node?.parentElement; i++) {
        node = node.parentElement;
        const h = node.querySelector && node.querySelector('h1, h2, h3, h4, h5, .title, [class*="title"]');
        if (h && h.innerText) { title = h.innerText.trim(); break; }
      }
      if (!title) title = (a.getAttribute('title') || a.getAttribute('aria-label') || '').trim();
      if (!title) return;
      const url = href.startsWith('http') ? href : `https://www.bitchute.com${href}`;
      items.push({ videoId, title, url });
      seen.add(videoId);
    });
    return items;
  });
}

function findByTitle(items, target) {
  const norm = s => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const t = norm(target);
  return items.find(it => norm(it.title) === t);
}

(async () => {
  const data  = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
  const short = data.shorts.find(s => s.id === shortId);
  if (!short) {
    console.error(`Short not found: ${shortId}`);
    process.exit(1);
  }
  const current = short.platforms[PLATFORM];
  if (!current) {
    console.error(`Short ${shortId} has no BitChute platform entry.`);
    process.exit(1);
  }
  if (current.url && current.url !== PLACEHOLDER) {
    console.log(`Short already has a real URL (${current.url}); nothing to do.`);
    process.exit(0);
  }
  const title = (short.title || '').trim();
  console.log(`Will retry BitChute URL scrape for "${title}" in ${waitSec}s...`);
  await new Promise(r => setTimeout(r, waitSec * 1000));
  console.log(`Wait done. Launching Chrome to scrape /content...`);

  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  try {
    const items = await scrapeContentPage(page);
    console.log(`  Scraped ${items.length} item(s).`);
    const match = findByTitle(items, title);
    if (!match) {
      console.log(`  No match for "${title}". The video may still be processing or the title differs.`);
      console.log(`  Recent titles on /content:`);
      for (const it of items.slice(0, 10)) console.log(`    - "${it.title}" -> ${it.url}`);
      process.exit(2);
    }
    console.log(`  Found: ${match.url}`);
    // Re-read JSON in case it changed during the wait
    const data2 = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
    const s2 = data2.shorts.find(s => s.id === shortId);
    if (!s2) { console.error(`Short ${shortId} disappeared from JSON!`); process.exit(1); }
    if (s2.platforms[PLATFORM].url && s2.platforms[PLATFORM].url !== PLACEHOLDER) {
      console.log(`  URL was filled by another process (${s2.platforms[PLATFORM].url}); leaving alone.`);
      process.exit(0);
    }
    s2.platforms[PLATFORM].url = match.url;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data2, null, 2));
    console.log('  shorts.json updated with real URL ✓');
  } finally {
    try { await context.close(); } catch {}
  }
})();
