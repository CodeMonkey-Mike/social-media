// download-ss-sfx.js — download a Soundstripe SOUND EFFECT (not a song) from its
// /library/sound-effects/<id> page, capturing its on-page/API metadata.
//
//   node download-ss-sfx.js <sfxId> --dest "<dir>"
//
// Soundstripe SFX have NO Content-ID code (per Mike: only a usage-acknowledgement
// doc, no embeddable code) so we do NOT mint one here. We just grab the file +
// metadata (title, duration, tags, description) sniffed off the /app/sound_effects
// API response, and save a <dest>/_ss-<id>-meta.json sidecar.

const fs = require('fs');
const path = require('path');

const PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));

function arg(flag, def) { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : def; }

(async () => {
  const id = process.argv[2];
  if (!id || id.startsWith('--')) { console.error('Usage: node download-ss-sfx.js <sfxId> --dest <dir>'); process.exit(1); }
  const dest = arg('--dest', path.join(__dirname, '..', 'downloads'));
  fs.mkdirSync(dest, { recursive: true });
  const SHOT = path.join(__dirname, '..', '_recon', 'sfx'); fs.mkdirSync(SHOT, { recursive: true });

  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 60, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = browser.pages()[0] || await browser.newPage();

  let apiMeta = null, savedFile = null;
  page.on('response', async (resp) => {
    const u = resp.url();
    if (/api\.soundstripe\.com\/app\/sound_effects/.test(u) && resp.request().method() === 'GET') {
      try {
        const j = await resp.json();
        // single resource or collection; keep the one matching our id
        const data = Array.isArray(j.data) ? j.data.find(d => String(d.id) === String(id)) : j.data;
        if (data && (!apiMeta || String(data.id) === String(id))) apiMeta = { data, included: j.included || null };
      } catch {}
    }
  });
  page.on('download', async (dl) => {
    const out = path.join(dest, dl.suggestedFilename() || `sfx-${id}.wav`);
    await dl.saveAs(out).catch(() => {});
    savedFile = out; console.log('  downloaded:', path.basename(out));
  });

  try {
    await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.goto(`https://www.soundstripe.com/library/sound-effects/${id}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(SHOT, `${id}-1-page.png`) }).catch(() => {});

    // Click a download control. Try the most specific selectors first.
    const dlSelectors = [
      'button[data-testid="sound-effect-license-btn"]',
      'button[data-testid="sfx-license-btn"]',
      'button[aria-label*="ownload" i]',
      'button[title*="ownload" i]',
      'button:has-text("Download")',
      '[data-testid*="download" i] button',
      'a:has-text("Download")',
    ];
    let clicked = false;
    for (const sel of dlSelectors) {
      const b = page.locator(sel).first();
      if (await b.count() && await b.isVisible().catch(() => false)) {
        console.log('  download control:', sel);
        await b.scrollIntoViewIfNeeded().catch(() => {});
        const bb = await b.boundingBox();
        if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); else await b.click().catch(() => {});
        clicked = true; break;
      }
    }
    if (!clicked) console.log('  (no obvious download button found — see screenshot)');
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(SHOT, `${id}-2-afterclick.png`) }).catch(() => {});

    // format / confirm modal — prefer WAV, else MP3, else generic Download
    for (const sel of ['[role="dialog"] button:has-text("WAV")', 'button:has-text("Download WAV")',
                       '[role="menuitem"]:has-text("WAV")', '[role="dialog"] button:has-text("MP3")',
                       'button:has-text("Download MP3")', '[role="menuitem"]:has-text("MP3")',
                       '[role="dialog"] button:has-text("Download")', 'button:has-text("Download")']) {
      const b = page.locator(sel).first();
      if (await b.count() && await b.isVisible().catch(() => false)) { console.log('  format/confirm:', sel); await b.click().catch(() => {}); await page.waitForTimeout(3500); break; }
    }
    await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(SHOT, `${id}-3-final.png`) }).catch(() => {});
  } catch (e) {
    console.error('  error:', e.message);
  }
  try { await browser.close(); } catch {}

  const meta = { sfx_id: id, source: 'soundstripe', url: `https://www.soundstripe.com/library/sound-effects/${id}`, api: apiMeta, file: savedFile ? path.basename(savedFile) : null, downloaded_at: new Date().toISOString() };
  fs.writeFileSync(path.join(dest, `_ss-${id}-meta.json`), JSON.stringify(meta, null, 2));
  console.log(savedFile ? `\nDONE. file: ${savedFile}` : '\nNo file downloaded — inspect screenshots in _recon/sfx/.');
  console.log('  api metadata captured?', !!apiMeta);
  if (!savedFile) process.exit(2);
})().catch(e => { console.error('fatal:', e.message); process.exit(1); });
