// Download (license + save) one Envato Elements item into a target directory.
// Works against the app.envato.com item overlay ("Download <size>" button).
//
// Run: node download-envato.js "https://app.envato.com/search/stock-video/<uuid>?..." \
//          --dir "C:\\path\\to\\assets\\video" [--name my-clip] [--debug]
//
// Notes:
//  - Elements downloads are covered by Mike's subscription; clicking Download
//    records the license on the account (that is the normal flow).
//  - If a license/project dialog appears it is handled; current UI (2026-06)
//    downloads directly from the item overlay.
//  - Selector notes live in SKILL.md — update BOTH when Envato changes the DOM.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\envato-profile';

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : dflt;
}
const itemUrl = process.argv[2];
if (!itemUrl || !itemUrl.startsWith('http')) {
  console.error('Usage: node download-envato.js <item-url> --dir <target-dir> [--name x] [--debug]');
  process.exit(1);
}
const DIR = arg('dir', null);
if (!DIR) { console.error('--dir is required'); process.exit(1); }
const NAME = arg('name', null);
const DEBUG = process.argv.includes('--debug');

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

(async () => {
  fs.mkdirSync(DIR, { recursive: true });

  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome',
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
    acceptDownloads: true,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await browser.newPage();

  console.error('open: ' + itemUrl);
  await page.goto(itemUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(rnd(4000, 6000));

  const gotIt = page.locator('button:has-text("Okay, got it")');
  if (await gotIt.isVisible().catch(() => false)) await gotIt.click().catch(() => {});
  if (DEBUG) await page.screenshot({ path: 'envato-item-debug.png' });

  // item overlay download button (data-cy on the new app; text fallback). Default resolution download
  // (usually 4K) is fine — we cap size by transcoding below (SKILL disk rule).
  const dlButton = page.locator('button[data-cy="idp-download-button"], button:has-text("Download"), a[role="button"]:has-text("Download")').first();
  await dlButton.waitFor({ state: 'visible', timeout: 20000 });
  await dlButton.hover().catch(() => {});
  await page.waitForTimeout(rnd(1800, 3500));

  // ⚠ Envato's item page RE-RENDERS on the Download click, which CANCELS the browser download
  // (download.saveAs -> "canceled"). FIX (2026-07-10): capture the signed file URL from the download
  // EVENT, then FETCH it via the authenticated session and STREAM it to disk (never the canceled
  // browser download). Verified: the same signed URL returns HTTP 200 with the full file.
  let dlUrl = null, dlName = null;
  page.on('download', d => { if (!dlUrl) { dlUrl = d.url(); dlName = d.suggestedFilename(); } });
  await dlButton.click();
  await page.waitForTimeout(rnd(1200, 2200));
  if (DEBUG) await page.screenshot({ path: 'envato-license-debug.png' });
  // if a license/confirm dialog appears, confirm it (older flow / some item types)
  const confirm = page.locator(
    '[role="dialog"] button:has-text("Add & Download"), [role="dialog"] button:has-text("License & download"), [role="dialog"] button:has-text("Download")'
  ).first();
  if (await confirm.isVisible().catch(() => false)) await confirm.click().catch(() => {});
  for (let i = 0; i < 60 && !dlUrl; i++) await page.waitForTimeout(500);
  if (!dlUrl) throw new Error('no download URL captured after clicking Download (Envato DOM may have changed — re-probe)');

  const ext = path.extname(dlName) || '.mov';
  const target = path.join(DIR, (NAME ? NAME + ext : dlName));
  console.error('fetching -> ' + target + ' (streaming; 4K originals are large)...');
  const cookies = await browser.cookies();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  const ua = await page.evaluate(() => navigator.userAgent).catch(() => '');
  let streamed = false;
  try {
    const { pipeline } = require('stream/promises');
    const { Readable } = require('stream');
    const res = await fetch(dlUrl, { headers: { cookie: cookieHeader, 'user-agent': ua, referer: 'https://app.envato.com/' } });
    if (res.ok && res.body) { await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(target)); streamed = true; }
    else console.error('node fetch HTTP ' + res.status + ' — falling back to context.request');
  } catch (e) { console.error('node fetch stream failed (' + e.message + ') — falling back to context.request'); }
  if (!streamed) {
    const resp = await browser.request.get(dlUrl, { timeout: 900000 });
    if (!resp.ok()) throw new Error('download fetch HTTP ' + resp.status());
    fs.writeFileSync(target, await resp.body());
  }
  await browser.close();

  // Disk rule (SKILL.md): >800MB original -> transcode to ~100MB 1080p (H.264, audio stripped), keep ONLY that.
  const { execSync } = require('child_process');
  let saved = target;
  if (fs.statSync(target).size > 800000000) {
    const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${target}"`).toString().trim());
    const br = Math.round(100 * 8 * 1000 / dur * 0.92);
    const cap = target.replace(/\.[^.]+$/, '') + '.cap.mp4';
    // ⚠ ORIENTATION-AWARE (fixed 2026-07-25): "1080p" means 1080 on the LONG-EDGE-of-the-frame's
    // counterpart, i.e. 1920x1080 for landscape but 1080x1920 for PORTRAIT. The old hardcoded
    // `scale=-2:1080` capped a vertical 4K source to 608x1080 — only 608px wide for a 1080-wide
    // vertical comp, i.e. a silent downscale. Scale the SHORT edge to 1080 instead.
    const dims = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${target}"`).toString().trim().split(',').map(Number);
    const portrait = dims[1] > dims[0];
    const vf = portrait ? 'scale=1080:-2' : 'scale=-2:1080';
    console.error('transcoding ' + (fs.statSync(target).size / 1e6).toFixed(0) + 'MB -> ~100MB (' + br + 'k, ' + (portrait ? 'portrait' : 'landscape') + ' ' + vf + ')...');
    execSync(`ffmpeg -y -loglevel error -i "${target}" -vf ${vf} -c:v libx264 -b:v ${br}k -maxrate ${br}k -bufsize ${br * 2}k -an "${cap}"`);
    fs.unlinkSync(target); saved = cap;
  }
  console.log(JSON.stringify({ saved, bytes: fs.statSync(saved).size, source: itemUrl.split('?')[0] }, null, 2));
})().catch(err => { console.error('download failed:', err.message); process.exit(1); });
