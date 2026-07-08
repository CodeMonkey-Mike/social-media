// ⚠ SUPERSEDED 2026-06-07 by gen-images.js (pool-managed via chatgpt-image-chats.json + chat-pool.js).
// gen-images.js handles chat selection/rotation/per-purpose isolation automatically; prefer it.
// Kept for reference only — the hardcoded persistent chat URLs below are overloaded/contaminated.
//
// gen-batch.js — BATCH image generator: opens ONE ChatGPT chat and generates the
// WHOLE list inside that single chat (no new chat per image). Lifts the robust
// baseline/capture/reference-upload logic from generate-image.js.
//
// Usage: node gen-batch.js --list=<items.json> --chat-url=<url> --prefix=x-tweets
//   items.json: [{ "image_id":"ab12cd34", "slug":"my-slug", "prompt":"...", "ref":"C:\\...png"(optional) }, ...]
//   out file:   schedule-tweets/images/<x|yt|ig>/<prefix>-<image_id>-<slug>.png
//
// This is the canonical batched tool. Do NOT loop generate-image.js once per image.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const IMG_BASE = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images';
const IMAGE_URL_PATTERN = 'estuary/content';
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

function args() {
  const a = {};
  for (const x of process.argv.slice(2)) { const m = x.match(/^--([^=]+)=(.*)$/); if (m) a[m[1]] = m[2]; }
  return a;
}
const A = args();
const LIST = JSON.parse(fs.readFileSync(A.list, 'utf-8'));
const PREFIX = A.prefix || 'x-tweets';
// Designated PERSISTENT chats per content type. Reusing these is a HARD RULE — a fresh chat
// per run clutters the user's ChatGPT sidebar (they hand-delete each orphan). So --chat-url
// DEFAULTS to the right persistent chat, and we REFUSE to ever open a fresh chatgpt.com/ chat.
const PERSISTENT_CHATS = {
  // ⚠ OVERLOADED 2026-06-07 (>~30 images; began choking like the YT chat did). Until a better
  // system is in place, generate new X-tweet images via gen-batch-freshchat.js (fresh chat per run).
  'x-tweets':    'https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24',
  // ⚠ RETIRED 2026-06-05 (overloaded — stopped rendering images). On the NEXT YT gen, launch a NEW
  // chat, record its /c/<id> URL here (and in generate-image.js + repurpose/SKILL.md), reuse it after.
  // Until re-recorded, gen YT carousels via the fresh-chat tool (_gen-353x-redo.js / _gen-neutral-freshchat.js).
  'yt-posts':    'https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa',
  'ig-carousel': 'https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa',
};
const CHAT_URL = A['chat-url'] || PERSISTENT_CHATS[PREFIX];
if (!CHAT_URL || /chatgpt\.com\/?$/.test(CHAT_URL)) {
  console.error(`Refusing to run: no persistent chat for prefix "${PREFIX}". Pass --chat-url=<persistent chat>; never a fresh chat.`);
  process.exit(1);
}
const SUBDIR = PREFIX === 'x-tweets' ? 'x' : PREFIX === 'yt-posts' ? 'yt' : (PREFIX === 'ig-carousel' || PREFIX === 'ig-single') ? 'ig' : 'x';
const OUTDIR = path.join(IMG_BASE, SUBDIR);

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
  const baseline = new Set(allSeen);                 // snapshot before THIS prompt
  if (item.ref) await uploadRef(page, item.ref);
  await composer.click();
  for (const ch of item.prompt) { await page.keyboard.type(ch); await page.waitForTimeout(Math.floor(Math.random()*25)+45); }
  await page.waitForTimeout(Math.floor(Math.random()*6000)+8000);   // 8-14s human pause
  await page.keyboard.press('Enter');
  const sentAt = Date.now();
  const MIN_DELAY = 10000, MAXW = 5*60*1000, t0 = Date.now();
  let last = 0, stable = null, imgUrl = null;
  while (Date.now() - t0 < MAXW) {
    const fresh = [...allSeen].filter(u => !baseline.has(u)).filter(u => (urlTs.get(u) - sentAt) >= MIN_DELAY);
    if (fresh.length > last) { last = fresh.length; stable = Date.now(); }
    else if (fresh.length > 0 && stable && Date.now() - stable >= 3000) { imgUrl = fresh[fresh.length-1]; break; }
    await page.waitForTimeout(1500);
  }
  if (!imgUrl) { console.log(`FAIL (timeout) ${item.slug}`); return false; }
  const buf = await bufs.get(imgUrl);
  if (!buf || buf.length === 0) { console.log(`FAIL (empty) ${item.slug}`); return false; }
  // duplicate guard
  for (const sib of fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png'))) {
    const sb = fs.readFileSync(path.join(OUTDIR, sib));
    if (sb.length === buf.length && sb.equals(buf)) { console.log(`FAIL (dup of ${sib}) ${item.slug}`); return false; }
  }
  fs.writeFileSync(outPath, buf);
  console.log(`OK ${item.slug} (${(buf.length/1024).toFixed(0)} KB)`);
  await page.waitForTimeout(2500);
  return true;
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  console.log(`Batch: ${LIST.length} images into ONE chat -> ${CHAT_URL}`);
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  const route = `**/*${IMAGE_URL_PATTERN}*`;
  await page.route(route, r => r.abort());            // block history images during load
  await page.goto(CHAT_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.locator(SEL.composer).first().waitFor({ timeout: 30000 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);
  await page.unroute(route);                          // unblock; now capture
  const allSeen = new Set(), urlTs = new Map(), bufs = new Map();
  page.on('response', (resp) => {
    const u = resp.url(); if (!u.includes(IMAGE_URL_PATTERN)) return;
    allSeen.add(u); if (!urlTs.has(u)) urlTs.set(u, Date.now());
    if (!bufs.has(u)) bufs.set(u, resp.body().catch(() => null));
  });
  await page.waitForTimeout(5000);                    // let sidebar retries settle
  console.log('Chat ready.\n');
  let ok = 0;
  for (const item of LIST) {
    let r = await genOne(page, allSeen, urlTs, bufs, item);
    if (!r) { console.log('   retry once...'); r = await genOne(page, allSeen, urlTs, bufs, item); }
    if (r) ok++;
  }
  console.log(`\nDone: ${ok}/${LIST.length}`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
