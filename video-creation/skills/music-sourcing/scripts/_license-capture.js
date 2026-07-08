// _license-capture.js — SUPERVISED one-shot recon.
// Opens the logged-in soundstripe-profile browser. Mike navigates to wherever he
// grabs the YouTube/Content-ID code for a just-downloaded track (Account > Copyright
// Claims / the download section) and triggers it. This script captures the EXACT
// request that produces the code — method, url, request headers (incl. Authorization
// bearer), request body — plus the response, and dumps it to
//   _recon/license-capture.json
// so we can wire a programmatic replay into soundstripe.js download.
//
//   node _license-capture.js
//
// It also records every /songs/sales and /songs/*/download call (the likely
// precursors that carry the sale/song id the license call references).

const fs   = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(__dirname, '..');
const OUT = path.join(MUSIC_DIR, '_recon', 'license-capture.json');
const PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));

const WATCH = /content_id_licenses|\/songs\/sales|\/songs\/\d+\/download|copyright/i;
const cap = { started: new Date().toISOString(), bearer: null, events: [], license: null };

function save() { fs.writeFileSync(OUT, JSON.stringify(cap, null, 2)); }

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 40, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = browser.pages()[0] || await browser.newPage();

  page.on('request', (req) => {
    const u = req.url();
    if (!/api\.soundstripe\.com/.test(u)) return;
    const auth = req.headers()['authorization'];
    if (auth && !cap.bearer) { cap.bearer = auth; save(); }
    if (WATCH.test(u)) {
      let pd = null; try { pd = req.postData(); } catch {}
      const ev = { t: new Date().toISOString(), method: req.method(), url: u, headers: req.headers(), postData: pd, resourceType: req.resourceType() };
      cap.events.push(ev); save();
      console.log(`[REQ] ${req.method()} ${u.replace('https://api.soundstripe.com', '')}  body=${pd || '∅'}`);
    }
  });

  page.on('response', async (resp) => {
    const u = resp.url();
    if (!WATCH.test(u)) return;
    let body = null; try { body = await resp.text(); } catch {}
    const ev = cap.events.find(e => e.url === u && !e._status);
    if (ev) { ev._status = resp.status(); ev._response = body; }
    console.log(`[RESP] ${resp.status()} ${u.replace('https://api.soundstripe.com', '')}  -> ${(body || '').slice(0, 120)}`);
    if (/content_id_licenses/.test(u) && body && /"code"/.test(body)) {
      try { cap.license = { code: JSON.parse(body).code, request: cap.events.find(e => /content_id_licenses/.test(e.url) && e.method === 'POST') }; } catch {}
      cap.captured_at = new Date().toISOString(); save();
      console.log('\n*** LICENSE CODE CAPTURED -> ' + (cap.license && cap.license.code) + ' ***');
      console.log('*** request body: ' + JSON.stringify(cap.license && cap.license.request && cap.license.request.postData) + ' ***');
      console.log('Capture written to ' + OUT + '. You can close the browser now.\n');
    }
  });

  await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' }).catch(() => {});
  console.log('\n================= SUPERVISED CAPTURE READY =================');
  console.log('Browser is open and logged in. Now: go to wherever you normally GET');
  console.log('the YouTube / Content-ID code for a downloaded track');
  console.log('  (Account ▸ Copyright Claims, or the download section for "Theta Rest"),');
  console.log('and click whatever reveals/copies the 16-char code.');
  console.log('I am recording. When you see "LICENSE CODE CAPTURED" you can close the tab.');
  console.log('Capture file: ' + OUT);
  console.log('===========================================================\n');

  // keep alive until the browser is closed by Mike (or 15 min safety cap)
  const cap_ms = 15 * 60 * 1000; const t0 = Date.now();
  await new Promise((resolve) => {
    browser.on('close', resolve);
    const iv = setInterval(() => { if (Date.now() - t0 > cap_ms) { clearInterval(iv); resolve(); } }, 2000);
  });
  cap.ended = new Date().toISOString(); save();
  try { await browser.close(); } catch {}
  console.log('Capture session ended. Wrote ' + OUT);
})();
