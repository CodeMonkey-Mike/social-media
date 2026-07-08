// Search Envato Elements (app.envato.com) stock video and dump result candidates
// as JSON so Claude can evaluate and pick clips. Read-only: no downloads/licensing.
//
// Run: node search-envato.js "bank vault door closing" [--max 12] [--type stock-video]
//        [--out results.json] [--debug]
//
// Output: JSON array of { title, author, duration, url, previewImage, previewVideo }
//   previewVideo is a directly-downloadable h264 preview — fetch it to WATCH the
//   clip (extract frames) before licensing anything.
// Selector notes live in SKILL.md — update BOTH when Envato changes their DOM.

const { chromium } = require('playwright');
const fs = require('fs');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : dflt;
}
const query = process.argv[2];
if (!query || query.startsWith('--')) {
  console.error('Usage: node search-envato.js "<query>" [--max 12] [--type stock-video] [--out file.json] [--debug]');
  process.exit(1);
}
const MAX = parseInt(arg('max', '12'), 10);
const TYPE = arg('type', 'stock-video');
const OUT = arg('out', null);
const DEBUG = process.argv.includes('--debug');
const PORTRAIT = process.argv.includes('--portrait');

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await browser.newPage();

  const url = 'https://app.envato.com/search?itemType=' + TYPE + '&term='
            + encodeURIComponent(query).replace(/%20/g, '+');
  console.error('search: ' + url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(rnd(4000, 6000));

  const gotIt = page.locator('button:has-text("Okay, got it")');
  if (await gotIt.isVisible().catch(() => false)) await gotIt.click().catch(() => {});

  // Orientation filter -> Portrait/Vertical (UI-only; no URL param)
  if (PORTRAIT) {
    const ori = page.locator('button:has-text("Orientation"), [aria-label*="Orientation" i]').first();
    if (await ori.isVisible().catch(() => false)) {
      await ori.click().catch(() => {});
      await page.waitForTimeout(rnd(1000, 1600));
      let picked = false;
      for (const lbl of ['Portrait', 'Vertical', '9:16']) {
        const opt = page.locator(`text="${lbl}"`).first();
        if (await opt.isVisible().catch(() => false)) { await opt.click().catch(() => {}); picked = true; break; }
      }
      console.error('Orientation->Portrait ' + (picked ? 'applied' : 'OPTION NOT FOUND'));
      await page.waitForTimeout(rnd(2500, 3500)); // grid refresh
    } else {
      console.error('Orientation filter button NOT FOUND');
    }
  }

  // lazy grid: scroll a couple of times so enough cards mount
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(rnd(800, 1500));
  }
  if (DEBUG) await page.screenshot({ path: 'envato-search-debug.png' });

  const items = await page.evaluate(({ max, type }) => {
    const out = [];
    const seen = new Set();
    const re = new RegExp('/search/' + type + '/([0-9a-f-]{30,})');
    for (const a of document.querySelectorAll('a[href*="' + type + '"]')) {
      const href = a.getAttribute('href') || '';
      const m = href.match(re);
      if (!m || seen.has(m[1])) continue;
      const card = a.closest('article, li, div');
      const img = (card || a).querySelector('img');
      const video = (card || a).querySelector('video');
      // cardText shape: "0:07 • Bank Vault Opening and Shutting | Author"
      const text = card ? card.innerText.replace(/\n/g, ' ').trim() : '';
      const tm = text.match(/^(\d{1,2}:\d{2})\s*•\s*(.+?)(?:\s*\|\s*(\S.*))?$/);
      seen.add(m[1]);
      out.push({
        title: tm ? tm[2].trim() : text.slice(0, 80),
        author: tm && tm[3] ? tm[3].trim() : '',
        duration: tm ? tm[1] : '',
        url: 'https://app.envato.com' + href.split('&page')[0],
        previewImage: img ? (img.currentSrc || img.src) : '',
        previewVideo: video ? (video.currentSrc || video.src || '') : '',
      });
      if (out.length >= max) break;
    }
    return out;
  }, { max: MAX, type: TYPE });

  const json = JSON.stringify(items, null, 2);
  console.log(json);
  if (OUT) fs.writeFileSync(OUT, json);
  console.error(`\n${items.length} result(s)`);

  await browser.close();
})().catch(err => { console.error('search failed:', err.message); process.exit(1); });
