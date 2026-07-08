// _soundstripe-grab.js  (PHASE A3 — capture auth token + POST body shapes)
// Drives ONE real download via the UI so we capture: the Authorization token the
// app sends to api.soundstripe.com, the POST body for /app/songs/<id>/download,
// and the POST body + response for /app/content_id_licenses (the YouTube code).
// Output -> music/_recon/grab.json (+ screenshots, modal DOM, the mp3).

const path = require('path');
const fs   = require('fs');
const REPO = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const { chromium } = require(path.join(REPO, 'schedule-tweets', 'node_modules', 'playwright'));

const PROFILE   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
const RECON_DIR = path.join(REPO, 'video-creation', 'music', '_recon');
const SHOT_DIR  = path.join(RECON_DIR, 'shots');
fs.mkdirSync(SHOT_DIR, { recursive: true });
const QUERY = process.argv[2] || 'calm ambient';

const cap = { authorization: null, requests: [], downloads: [], contentIdCode: null };

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 60, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = browser.pages()[0] || await browser.newPage();

  page.on('request', (req) => {
    const u = req.url();
    if (/api\.soundstripe\.com/.test(u)) {
      const auth = req.headers()['authorization'];
      if (auth && !cap.authorization) cap.authorization = auth;
      if (req.method() === 'POST' && /\/download|content_id_licenses/.test(u)) {
        let pd = null; try { pd = req.postData(); } catch {}
        cap.requests.push({ method: req.method(), url: u, postData: pd, authorization: auth || null });
        console.log('  [POST]', u.replace('https://api.soundstripe.com', ''), '| body:', pd);
      }
    }
  });
  page.on('response', async (resp) => {
    if (/content_id_licenses/.test(resp.url())) {
      try { const j = await resp.json(); cap.contentIdCode = j; console.log('  [CODE]', JSON.stringify(j)); } catch {}
    }
  });
  page.on('download', async (dl) => {
    const out = path.join(RECON_DIR, 'downloads', dl.suggestedFilename() || `dl_${Date.now()}.mp3`);
    cap.downloads.push({ url: dl.url(), suggestedFilename: dl.suggestedFilename(), savedTo: out });
    console.log('  [DOWNLOAD]', dl.suggestedFilename());
    await dl.saveAs(out).catch(() => {});
  });

  try {
    await page.goto(`https://www.soundstripe.com/library/royalty-free-music?filter[q]=${encodeURIComponent(QUERY)}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(7000);
    await page.screenshot({ path: path.join(SHOT_DIR, 'g1-results.png') });

    const btn = page.locator('button[data-testid="song-license-btn"]').first();
    await btn.waitFor({ timeout: 15000 });
    console.log('  clicking first song-license-btn...');
    await btn.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(SHOT_DIR, 'g2-after-license-click.png') });

    // dump any visible modal/dialog DOM (to see where the code shows + the Download button)
    const modal = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], [class*="modal" i], [class*="Modal" i]');
      return d ? d.outerHTML : '';
    }).catch(() => '');
    fs.writeFileSync(path.join(RECON_DIR, 'dom', 'license-modal.html'), (modal || '').slice(0, 300 * 1024));

    // if there is an explicit Download button in the modal, click it
    for (const sel of ['[data-testid="download-button"] button', 'button[data-testid="download-button"]',
                       'button:has-text("Download")', '[role="dialog"] button:has-text("Download")']) {
      const b = page.locator(sel).first();
      if (await b.count() && await b.isVisible().catch(() => false)) {
        console.log('  clicking download via:', sel);
        await b.click().catch(() => {});
        await page.waitForTimeout(4000);
        break;
      }
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SHOT_DIR, 'g3-final.png') });
  } catch (e) {
    console.log('  ERROR:', e.message);
    await page.screenshot({ path: path.join(SHOT_DIR, 'gz-error.png') }).catch(() => {});
  }

  fs.writeFileSync(path.join(RECON_DIR, 'grab.json'), JSON.stringify(cap, null, 2));
  console.log('\nSaved grab.json. auth?', !!cap.authorization, '| POSTs:', cap.requests.length, '| code:', JSON.stringify(cap.contentIdCode));
  try { await browser.close(); } catch {}
  process.exit(0);
})();
