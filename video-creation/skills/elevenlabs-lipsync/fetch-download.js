// fetch-download.js — download the REAL export (WITH AUDIO) from a History render card by clicking its
// "Download" button. The History inline <video> is a MUTED, video-only preview (what fetch-result.js
// scrapes); the Download button gives the full muxed mp4. Use this when you need the audio.
//
//   node fetch-download.js --out "...\result.mp4" [--model "Sync 3"]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
function arg(n, d) { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; }
const MODEL = arg('model', 'Creatify Aurora');
const OUT = arg('out', null);
const MINUTES = parseFloat(arg('minutes', '6'));
if (!OUT) { console.error('--out required'); process.exit(1); }
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// finds the TOPMOST leaf card naming MODEL — INCLUDING a still-rendering one (no video yet), so we never
// fall through to an OLDER finished render (the duplicate-render trap). Returns hasVideo + Download center.
function findDl(page) {
  return page.evaluate((model) => {
    const re = new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const rendering = /\d{1,3}%|almost done|processing|generating|rendering/i;
    let blocks = [...document.querySelectorAll('div,li,article')].filter(b => re.test(b.innerText || '') && (b.querySelector('video') || rendering.test(b.innerText || '')));
    blocks = blocks.filter(b => !blocks.some(o => o !== b && b.contains(o)));
    const card = blocks[0];
    if (!card) return null;
    const cr = card.getBoundingClientRect();
    const hasVideo = !!card.querySelector('video');
    let dl = card.querySelector('button[aria-label="Download" i]') || (card.parentElement && card.parentElement.querySelector('button[aria-label="Download" i]'));
    return { hasVideo, card: { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 },
             dl: dl ? (() => { const r = dl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })() : null };
  }, MODEL);
}

(async () => {
  const b = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null, acceptDownloads: true,
  });
  await b.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await b.newPage();
  await page.goto('https://elevenlabs.io/app/image-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  // History sub-tab (same as fetch-result.js — getByRole, exact)
  for (const mk of [() => page.getByRole('tab', { name: 'History', exact: true }),
                    () => page.getByRole('link', { name: 'History', exact: true }),
                    () => page.getByText('History', { exact: true })]) {
    const t = mk().first();
    if (await t.isVisible().catch(() => false)) { await t.click().catch(() => {}); await page.waitForTimeout(2500); break; }
  }

  // poll until the TOPMOST MODEL card has finished (has a video), then grab its Download button
  let pos = null;
  const deadline = Date.now() + MINUTES * 60 * 1000;
  while (Date.now() < deadline && !pos) {
    const info = await findDl(page);
    if (!info) { console.log(`  (no ${MODEL} card yet)`); await page.waitForTimeout(rnd(7000, 11000)); continue; }
    if (!info.hasVideo) { console.log('  top render still cooking...'); await page.waitForTimeout(rnd(8000, 12000)); continue; }
    await page.mouse.move(info.card.x, info.card.y); await page.waitForTimeout(1200); // hover reveals controls
    const info2 = await findDl(page);
    if (info2 && info2.dl) { pos = info2.dl; break; }
    await page.waitForTimeout(1500);
  }
  if (!pos) { console.error('no finished Download button for', MODEL, 'in time'); await page.screenshot({ path: 'el-dl-fail.png' }); await b.close(); process.exit(2); }

  await page.mouse.move(pos.x, pos.y); await page.waitForTimeout(rnd(400, 900));
  let download = null;
  try { [download] = await Promise.all([page.waitForEvent('download', { timeout: 9000 }), page.mouse.click(pos.x, pos.y)]); }
  catch {
    const opt = page.locator('[role="menuitem"]:has-text("Download"), [role="menuitem"]:has-text("Video"), button:has-text("Download video"), text=/\\.mp4|MP4/i').first();
    if (await opt.isVisible().catch(() => false)) await opt.click().catch(() => {});
    download = await page.waitForEvent('download', { timeout: 30000 });
  }
  await download.saveAs(OUT);
  console.log('saved', OUT);
  await page.waitForTimeout(1500);
  await b.close();
})().catch(e => { console.error('fetch-download failed:', e.message); process.exit(1); });
