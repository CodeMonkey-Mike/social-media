// fetch-result.js — open History, scope to the most-recent lip-sync card for a given MODEL,
// poll until done, and download ITS video by direct URL. Verifies it's a video, not an image.
//
// Usage: node fetch-result.js --out "...\result.mp4" [--model "Creatify Aurora"] [--minutes 8]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\elevenlabs-profile';
function arg(n, d) { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; }
const OUT = arg('out', null);
const MODEL = arg('model', 'Creatify Aurora');
const MINUTES = parseFloat(arg('minutes', '8'));
if (!OUT) { console.error('--out required'); process.exit(1); }
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null, acceptDownloads: true,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  await page.goto('https://elevenlabs.io/app/image-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Switch to History sub-tab (exact name), verify it activates.
  for (const mk of [() => page.getByRole('tab', { name: 'History', exact: true }),
                    () => page.getByRole('link', { name: 'History', exact: true }),
                    () => page.getByText('History', { exact: true })]) {
    const t = mk().first();
    if (await t.isVisible().catch(() => false)) { await t.click().catch(() => {}); await page.waitForTimeout(2500); break; }
  }
  await page.screenshot({ path: 'el-history2.png' });

  // Poll the FIRST card for MODEL: read its % (rendering) or video src (done).
  const deadline = Date.now() + MINUTES * 60 * 1000;
  let src = '';
  while (Date.now() < deadline) {
    const info = await page.evaluate((model) => {
      const re = new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      // candidate cards: blocks naming MODEL that are a render card — i.e. have a video OR are
      // STILL RENDERING (% / "Almost done" / processing). Including the rendering state is critical:
      // the newest render shows "Almost done…" with NO <video> yet; if we don't count it we fall
      // through to an OLDER finished render and download the WRONG clip (the duplicate-render trap).
      const rendering = /\d{1,3}%|almost done|processing|generating|rendering/i;
      let blocks = [...document.querySelectorAll('div,li,article')].filter(b =>
        re.test(b.innerText || '') && (b.querySelector('video') || rendering.test(b.innerText || '')));
      // keep only LEAF cards (drop wrapper containers that contain another candidate)
      blocks = blocks.filter(b => !blocks.some(o => o !== b && b.contains(o)));
      // History is newest-first → the TOPMOST leaf card is OUR render. If it has no video yet it is
      // still rendering, so we WAIT for IT (never grab a lower/older finished card).
      const b = blocks[0];
      if (!b) return { found: false };
      const v = b.querySelector('video');
      const txt = b.innerText || '';
      const pct = (txt.match(/\b(\d{1,3})%/) || [])[1] || (/almost done/i.test(txt) ? '~99' : '');
      return { found: true, pct, src: v ? (v.currentSrc || v.src || '') : '' };
    }, MODEL);
    if (!info.found) { console.log(`  (no ${MODEL} card yet)`); }
    else if (info.src && info.src.startsWith('http')) { src = info.src; console.log('  done. video src:', src.slice(0, 80)); break; }
    else { console.log('  rendering...', info.pct ? info.pct + '%' : ''); }
    await page.waitForTimeout(rnd(8000, 13000));
  }

  if (!src) { console.log('  no finished video found in time.'); await browser.close(); return; }

  // Download the video URL using the page session (handles cookies/signed URLs).
  const buf = await page.evaluate(async (u) => {
    const r = await fetch(u);
    const a = await r.arrayBuffer();
    return Array.from(new Uint8Array(a));
  }, src);
  fs.writeFileSync(OUT, Buffer.from(buf));
  const sz = fs.statSync(OUT).size;
  // sniff: mp4 has 'ftyp' near the start
  const head = fs.readFileSync(OUT).slice(0, 16).toString('latin1');
  console.log(`  saved ${OUT} (${sz} bytes); header has ftyp: ${head.includes('ftyp')}`);
  await browser.close();
})().catch(e => { console.error('fetch-result2 failed:', e.message); process.exit(1); });
