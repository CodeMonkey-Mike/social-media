// _soundstripe-autodrive.js  (PHASE A2 — self-driven discovery, no human needed)
// Uses the already-logged-in soundstripe-profile to: load the library, run a
// keyword search by typing in the search box, and screenshot + dump the DOM so
// we learn the search endpoint and the result-card/download selectors. Captures
// all api.soundstripe JSON (with request postData) to music/_recon/.

const path = require('path');
const fs   = require('fs');
const REPO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const { chromium } = require(path.join(REPO, 'schedule-tweets', 'node_modules', 'playwright'));

const PROFILE   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
const RECON_DIR = path.join(REPO, 'video-creation', 'music', '_recon');
const NET_DIR   = path.join(RECON_DIR, 'net2');
const SHOT_DIR  = path.join(RECON_DIR, 'shots');
const DOM_DIR   = path.join(RECON_DIR, 'dom');
for (const d of [NET_DIR, SHOT_DIR, DOM_DIR]) fs.mkdirSync(d, { recursive: true });
const indexPath = path.join(RECON_DIR, 'autodrive-index.jsonl');
fs.writeFileSync(indexPath, '');

const QUERY = process.argv[2] || 'calm ambient';
let n = 0;
const sanitize = u => u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 120);

function wirePage(page) {
  page.on('response', async (resp) => {
    try {
      const url = resp.url();
      // skip known analytics/noise; capture every other JSON host so we find the search backend
      if (/metrics\.soundstripe|ab\.soundstripe|hsappstatic|hubspot|google|doubleclick|segment|sentry|datadog/.test(url)) return;
      const ctype = (resp.headers()['content-type'] || '').toLowerCase();
      if (!/json/.test(ctype)) return;
      let body = ''; try { body = await resp.text(); } catch { return; }
      const file = path.join(NET_DIR, `${String(++n).padStart(3, '0')}_${sanitize(url)}.json`);
      fs.writeFileSync(file, body.slice(0, 300 * 1024));
      let postData = null; try { postData = resp.request().postData(); } catch {}
      // quick flag: does this response contain song objects?
      let hasSongs = false; try { hasSongs = /"type"\s*:\s*"songs"/.test(body); } catch {}
      fs.appendFileSync(indexPath, JSON.stringify({
        n, status: resp.status(), method: resp.request().method(), url,
        bytes: body.length, hasSongs, postData: postData ? String(postData).slice(0, 2000) : null,
        file: path.basename(file),
      }) + '\n');
      if (hasSongs) console.log(`  [SONGS] ${resp.request().method()} ${url.slice(0, 140)}`);
    } catch {}
  });
}

const shot = async (page, name) => { try { await page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: false }); console.log('  shot:', name); } catch (e) { console.log('  shot failed', name, e.message); } };
const dump = (name, html) => { try { fs.writeFileSync(path.join(DOM_DIR, name), html || ''); console.log('  dom:', name, (html || '').length, 'bytes'); } catch {} };

(async () => {
  console.log(`Auto-drive discovery, query="${QUERY}"`);
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 40, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  browser.on('page', wirePage);
  for (const p of browser.pages()) wirePage(p);
  const page = browser.pages()[0] || await browser.newPage();

  try {
    await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await shot(page, '01-library.png');
    console.log('  url:', page.url());

    // find a search input
    const sels = ['input[type="search"]', 'input[placeholder*="Search" i]', '[role="searchbox"]',
                  'input[name*="search" i]', 'input[aria-label*="search" i]', 'input[type="text"]'];
    let typed = false;
    for (const s of sels) {
      const el = page.locator(s).first();
      if (await el.count() && await el.isVisible().catch(() => false)) {
        console.log('  search input via:', s);
        await el.click();
        await el.fill(QUERY);
        await page.keyboard.press('Enter');
        typed = true;
        break;
      }
    }
    if (!typed) console.log('  !! no search input found');
    await page.waitForTimeout(7000);
    await shot(page, '02-results.png');
    console.log('  url after search:', page.url());

    // dump main content + first "card-ish" elements
    const mainHtml = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      return main ? main.outerHTML : '';
    }).catch(() => '');
    dump('results-main.html', (mainHtml || '').slice(0, 600 * 1024));

    // try to enumerate row/card candidates by common patterns
    const probe = await page.evaluate(() => {
      const out = [];
      const sels = ['[data-testid]', '[class*="song" i]', '[class*="track" i]', '[class*="row" i]', 'li', 'article'];
      for (const s of sels) {
        const els = Array.from(document.querySelectorAll(s)).slice(0, 4);
        for (const e of els) {
          const t = (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
          if (t) out.push({ sel: s, testid: e.getAttribute('data-testid'), cls: e.className?.toString().slice(0, 80), text: t });
        }
      }
      return out.slice(0, 40);
    }).catch(() => []);
    dump('probe-cards.json', JSON.stringify(probe, null, 1));
  } catch (e) {
    console.log('  ERROR:', e.message);
    await shot(page, 'zz-error.png');
  }

  await page.waitForTimeout(1500);
  console.log(`Captured ${n} api JSON responses. Closing.`);
  try { await browser.close(); } catch {}
  process.exit(0);
})();
