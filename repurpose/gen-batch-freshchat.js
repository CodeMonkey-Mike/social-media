// ⚠ For queue-prefix batches prefer gen-images.js (full pool management: reuses the active pool
// chat until cap then rotates). THIS script always opens a brand-new chat; use it for ONE-OFF
// batches (e.g. a longform project's b-roll images with --outdir). Since 2026-06-11 it DOES
// register that fresh chat in the root chatgpt-image-chats.json via chat-pool.js (--purpose,
// default = --prefix) and records each successful save, so one-off chats are tracked too.
//
// gen-batch-freshchat.js — same robust capture + reference-upload as gen-batch.js, but opens
// a FRESH ChatGPT chat (chatgpt.com/) instead of a persistent /c/ chat.
// Usage: node gen-batch-freshchat.js --list=<items.json> --prefix=broll
//          [--batch=<id> | --outdir=<abs dir>] [--purpose=longform-broll]
//   items.json: [{ "image_id":"ab12cd34", "slug":"my-slug", "prompt":"...", "ref":"C:\\...png"(optional) }]
//   --batch=<id>  : SHORTS b-roll — writes to video-creation/shorts/<id>/render-assets/ (the
//                   batch's OWN self-contained public dir; NEVER video-creation/assets/ or
//                   assets/projects/; see SKILL.md "Asset folder organization"). Overridden by
//                   --outdir (LONGFORM/PERSONA: point at the project's own render-assets/).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pool = require('./chat-pool');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMG_BASE = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const IMAGE_URL_PATTERN = 'estuary/content';
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

function args() { const a = {}; for (const x of process.argv.slice(2)) { const m = x.match(/^--([^=]+)=(.*)$/); if (m) a[m[1]] = m[2]; } return a; }
const A = args();
const LIST = JSON.parse(fs.readFileSync(A.list, 'utf-8'));
const PREFIX = A.prefix || 'x-tweets';
const SUBDIR = PREFIX === 'x-tweets' ? 'x' : PREFIX === 'yt-posts' ? 'yt' : (PREFIX === 'ig-carousel' || PREFIX === 'ig-single') ? 'ig' : 'x';
// --outdir=<abs path> overrides everything — point it at the PROJECT'S OWN render-assets/ folder
// (e.g. video-creation/longform-edited/media/<project>/render-assets/).
// --batch=<id> writes to video-creation/shorts/<batch>/render-assets/ — the batch's OWN public dir.
// Project assets NEVER live under video-creation/assets/ or assets/projects/ (retired convention —
// see SKILL.md "Asset folder organization").
// TRACK-AWARE routing (Mike, 2026-06-18; shorts moved off assets/projects 2026-06-25):
//   --outdir  → explicit (LONGFORM/PERSONA: point at the project's OWN folder, e.g. media/<project>/render-assets/).
//   --batch   → SHORTS: video-creation/shorts/<batch>/render-assets/ — the batch's self-contained public dir.
//               The shorts comp renders with `--public-dir shorts/<batch>/render-assets`; shared sfx/logos are
//               COPIED in by scripts/setup-batch-render-assets.js (NEVER junctioned — cleanup would follow it).
//               cleanup recycles the whole shorts/<batch>/ folder once the batch publishes, so it's transient.
const VIDEO_CREATION = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation';
const VIDEO_ASSETS = path.join(VIDEO_CREATION, 'assets');
const OUTDIR = A.outdir ? A.outdir
  : A.batch ? path.join(VIDEO_CREATION, 'shorts', A.batch, 'render-assets')
  : path.join(IMG_BASE, SUBDIR);

// Guard: refuse the shared assets tree entirely for b-roll (loose b-roll in the root OR under
// assets/projects/ is the regression we're preventing). Shorts use --batch (→ shorts/<batch>/render-assets/),
// longform/persona use --outdir at the project folder. Neither resolves under video-creation/assets/.
const norm = (p) => path.resolve(p).replace(/[\\/]+$/, '').toLowerCase();
if (/^broll/i.test(PREFIX)) {
  if (!A.batch && !A.outdir) {
    console.error('ERROR: --prefix=broll requires --batch=<id> (SHORTS → shorts/<id>/render-assets/) or --outdir (LONGFORM/PERSONA → the project folder). Refusing to mis-route b-roll.');
    process.exit(2);
  }
  const out = norm(OUTDIR), root = norm(VIDEO_ASSETS);
  if (out === root || out.startsWith(root + path.sep)) {
    console.error(`ERROR: refusing to write b-roll anywhere under the shared assets tree (${OUTDIR}). Use --batch=<id> (shorts → shorts/<id>/render-assets/) or --outdir at the project folder (longform/persona).`);
    process.exit(2);
  }
}

async function uploadRef(page, ref) {
  try {
    const fi = page.locator('input[type="file"]').first();
    await fi.waitFor({ state: 'attached', timeout: 8000 });
    await fi.setInputFiles(ref, { timeout: 8000 });
    await page.waitForTimeout(4000);
    return true;
  } catch (e) { console.log('   ref upload failed:', e.message.split('\n')[0]); return false; }
}

async function genOne(page, allSeen, urlTs, bufs, item) {
  const outPath = path.join(OUTDIR, `${PREFIX}-${item.image_id}-${item.slug}.png`);
  if (fs.existsSync(outPath)) { console.log(`SKIP (exists) ${item.slug}`); return true; }
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.waitForTimeout(800);
  const baseline = new Set(allSeen);
  if (item.ref) await uploadRef(page, item.ref);
  await composer.click();
  for (const ch of item.prompt) { await page.keyboard.type(ch); await page.waitForTimeout(Math.floor(Math.random() * 25) + 45); }
  await page.waitForTimeout(Math.floor(Math.random() * 6000) + 8000);
  await page.keyboard.press('Enter');
  const sentAt = Date.now();
  const MIN_DELAY = 10000, MAXW = 5 * 60 * 1000, t0 = Date.now();
  let last = 0, stable = null, imgUrl = null;
  while (Date.now() - t0 < MAXW) {
    const fresh = [...allSeen].filter(u => !baseline.has(u)).filter(u => (urlTs.get(u) - sentAt) >= MIN_DELAY);
    if (fresh.length > last) { last = fresh.length; stable = Date.now(); }
    else if (fresh.length > 0 && stable && Date.now() - stable >= 3000) { imgUrl = fresh[fresh.length - 1]; break; }
    await page.waitForTimeout(1500);
  }
  if (!imgUrl) { console.log(`FAIL (timeout) ${item.slug}`); return false; }
  const buf = await bufs.get(imgUrl);
  if (!buf || buf.length === 0) { console.log(`FAIL (empty) ${item.slug}`); return false; }
  for (const sib of fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png'))) {
    const sb = fs.readFileSync(path.join(OUTDIR, sib));
    if (sb.length === buf.length && sb.equals(buf)) { console.log(`FAIL (dup of ${sib}) ${item.slug}`); return false; }
  }
  fs.writeFileSync(outPath, buf);
  console.log(`OK ${item.slug} (${(buf.length / 1024).toFixed(0)} KB)`);
  await page.waitForTimeout(2500);
  return true;
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  console.log(`FRESH-CHAT batch: ${LIST.length} images -> new chatgpt.com chat -> ${OUTDIR}`);
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  await page.goto('https://chatgpt.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.locator(SEL.composer).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(3000);
  const allSeen = new Set(), urlTs = new Map(), bufs = new Map();
  page.on('response', (resp) => {
    const u = resp.url(); if (!u.includes(IMAGE_URL_PATTERN)) return;
    allSeen.add(u); if (!urlTs.has(u)) urlTs.set(u, Date.now());
    if (!bufs.has(u)) bufs.set(u, resp.body().catch(() => null));
  });
  await page.waitForTimeout(3000);
  console.log('Fresh chat ready.\n');
  const PURPOSE = A.purpose || PREFIX;
  let ok = 0, registered = false;
  for (const item of LIST) {
    let r = await genOne(page, allSeen, urlTs, bufs, item);
    if (!r) { console.log('   retry once...'); r = await genOne(page, allSeen, urlTs, bufs, item); }
    if (r) {
      ok++;
      // after the first successful gen the fresh chat has its /c/<id> URL: register it
      if (!registered && /chatgpt\.com\/c\//.test(page.url())) {
        pool.registerNewChat(PURPOSE, page.url().split('?')[0]);
        registered = true;
      }
      pool.recordImage(PURPOSE);
    }
  }
  console.log(`\nDone: ${ok}/${LIST.length}` + (registered ? ` (chat registered under "${PURPOSE}")` : ''));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
