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

  // item overlay download button reads "Download 162MB"
  const dlButton = page.locator('button:has-text("Download"), a[role="button"]:has-text("Download")').first();
  await dlButton.waitFor({ state: 'visible', timeout: 20000 });
  await dlButton.hover().catch(() => {});
  await page.waitForTimeout(rnd(1800, 3500));

  const downloadPromise = page.waitForEvent('download', { timeout: 240000 });
  await dlButton.click();
  await page.waitForTimeout(rnd(1200, 2200));
  if (DEBUG) await page.screenshot({ path: 'envato-license-debug.png' });

  // if a license/confirm dialog appears, confirm it (older flow / some item types)
  const confirm = page.locator(
    '[role="dialog"] button:has-text("Add & Download"), [role="dialog"] button:has-text("License & download"), [role="dialog"] button:has-text("Download")'
  ).first();
  if (await confirm.isVisible().catch(() => false)) await confirm.click().catch(() => {});

  const download = await downloadPromise;
  const suggested = download.suggestedFilename();
  const ext = path.extname(suggested) || '.mp4';
  const fname = (NAME ? NAME + ext : suggested);
  const target = path.join(DIR, fname);
  console.error('downloading -> ' + target + ' (large files take a while)...');
  await download.saveAs(target);

  const size = fs.statSync(target).size;
  console.log(JSON.stringify({ saved: target, bytes: size, source: itemUrl.split('?')[0] }, null, 2));

  await browser.close();
})().catch(err => { console.error('download failed:', err.message); process.exit(1); });
