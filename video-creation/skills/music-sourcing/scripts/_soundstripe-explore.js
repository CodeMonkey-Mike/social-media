// _soundstripe-explore.js  (PHASE A RECON — throwaway)
// Opens Soundstripe in a real Chrome with a dedicated persistent profile and
// passively captures the network (JSON API responses, audio/stream URLs, and
// download events) while YOU drive: log in once, run a search, preview a track,
// hit download. Everything useful is dumped to music/_recon/ so we can build the
// real scraper around the actual endpoints instead of guessing DOM selectors.
//
// Run (from repo root):
//   node video-creation/skills/music-sourcing/scripts/_soundstripe-explore.js
// Then in the Chrome window: log in -> search "serene ambient" -> play a track
//   -> click Download on one track. Close the window when done (or it auto-ends).

const path = require('path');
const fs   = require('fs');

const REPO     = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const { chromium } = require(path.join(REPO, 'schedule-tweets', 'node_modules', 'playwright'));

const PROFILE   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
const RECON_DIR = path.join(REPO, 'video-creation', 'music', '_recon');
const NET_DIR   = path.join(RECON_DIR, 'net');
const DL_DIR    = path.join(RECON_DIR, 'downloads');
const MAX_MS    = 20 * 60 * 1000; // auto-close after 20 min

for (const d of [RECON_DIR, NET_DIR, DL_DIR]) fs.mkdirSync(d, { recursive: true });

const indexPath = path.join(RECON_DIR, 'network-index.jsonl');
const audioPath = path.join(RECON_DIR, 'audio-urls.txt');
const dlPath    = path.join(RECON_DIR, 'downloads.jsonl');
let n = 0;

function sanitize(u) {
  return u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 120);
}

function wirePage(page) {
  page.on('response', async (resp) => {
    let url = '';
    try {
      url = resp.url();
      const ctype = (resp.headers()['content-type'] || '').toLowerCase();
      const host  = new URL(url).host;
      const isSS  = /soundstripe/i.test(host);

      // audio / stream URLs (preview + full)
      if (/audio\//.test(ctype) || /\.(mp3|m4a|wav|aac)(\?|$)/i.test(url)) {
        fs.appendFileSync(audioPath, `${resp.status()} ${ctype} ${url}\n`);
      }

      // JSON API responses from soundstripe domains
      if (isSS && /json/.test(ctype)) {
        let body = '';
        try { body = await resp.text(); } catch { return; }
        const file = path.join(NET_DIR, `${String(++n).padStart(3, '0')}_${sanitize(url)}.json`);
        fs.writeFileSync(file, body.slice(0, 300 * 1024)); // cap 300KB
        const req = resp.request();
        let postData = null;
        try { postData = req.postData(); } catch { /* none */ }
        fs.appendFileSync(indexPath, JSON.stringify({
          n, status: resp.status(), method: req.method(),
          url, ctype, bytes: body.length, file: path.basename(file),
          postData: postData ? String(postData).slice(0, 2000) : null,
        }) + '\n');
        console.log(`  [json] ${req.method()} ${resp.status()} ${url.slice(0, 110)}`);
      }
    } catch { /* ignore per-response errors */ }
  });

  page.on('download', async (dl) => {
    try {
      const sf = dl.suggestedFilename();
      const url = dl.url();
      const out = path.join(DL_DIR, sf || `download_${Date.now()}`);
      fs.appendFileSync(dlPath, JSON.stringify({ url, suggestedFilename: sf, savedTo: out }) + '\n');
      console.log(`  [DOWNLOAD] ${sf}  <-  ${url.slice(0, 110)}`);
      await dl.saveAs(out).catch(() => {});
    } catch { /* ignore */ }
  });
}

(async () => {
  console.log('Launching Chrome (soundstripe-profile)...');
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 30,
    acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  browser.on('page', wirePage);
  for (const p of browser.pages()) wirePage(p);
  const page = browser.pages()[0] || await browser.newPage();

  await page.goto('https://www.soundstripe.com/', { waitUntil: 'domcontentloaded' }).catch(() => {});

  console.log('\n==================================================================');
  console.log(' RECON MODE — drive the browser yourself:');
  console.log('   1) Log in (first time only; the profile remembers you after).');
  console.log('   2) Search e.g. "serene ambient" / "calm meditation".');
  console.log('   3) Play a preview, open a track page.');
  console.log('   4) Click DOWNLOAD on ONE track so we capture the download flow.');
  console.log(' Capturing network -> video-creation/skills/music-sourcing/_recon/  (close window when done)');
  console.log('==================================================================\n');

  let closed = false;
  browser.on('close', () => { closed = true; });
  const start = Date.now();
  while (!closed && Date.now() - start < MAX_MS) {
    await page.waitForTimeout(3000).catch(() => { closed = true; });
  }

  console.log(`\nDone. Captured ${n} JSON responses. See video-creation/skills/music-sourcing/_recon/.`);
  try { await browser.close(); } catch {}
  process.exit(0);
})();
