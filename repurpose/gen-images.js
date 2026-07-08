// gen-images.js — CANONICAL pool-managed ChatGPT image generator. Supersedes gen-batch.js (hardcoded
// persistent chat) and gen-batch-freshchat.js (always fresh). Consults ../chatgpt-image-chats.json via
// chat-pool.js: reuse the active chat for the purpose while count<cap, else open a fresh chatgpt.com/
// chat and register it; rotate automatically at the cap; never share a chat across purposes.
//
// Usage: node gen-images.js --list=<items.json> --prefix=x-tweets|yt-posts|ig-single|ig-carousel
//   items.json: [{ "image_id":"ab12cd34", "slug":"my-slug", "prompt":"...", "ref":"C:\\...png"(optional) }]
//   out: schedule-tweets/images/<x|yt|ig>/<prefix>-<image_id>-<slug>.png   (skips existing)
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
const PURPOSE = PREFIX; // purpose == prefix (x-tweets, yt-posts, ig-single, ig-carousel)
const SUBDIR = PREFIX === 'x-tweets' ? 'x' : PREFIX === 'yt-posts' ? 'yt' : (PREFIX === 'ig-carousel' || PREFIX === 'ig-single') ? 'ig' : 'x';
const OUTDIR = path.join(IMG_BASE, SUBDIR);

async function composerLoaded(page, ms = 12000) {
  try { await page.locator(SEL.composer).first().waitFor({ timeout: ms }); return true; }
  catch { return false; }
}
async function uploadRef(page, ref) {
  try {
    const fi = page.locator('input[type="file"]').first();
    await fi.waitFor({ state: 'attached', timeout: 8000 });
    await fi.setInputFiles(ref, { timeout: 8000 });
    await page.waitForTimeout(4000); return true;
  } catch (e) { console.log('   ref upload failed:', e.message.split('\n')[0]); return false; }
}

async function genOne(page, allSeen, urlTs, bufs, item) {
  const outPath = path.join(OUTDIR, `${PREFIX}-${item.image_id}-${item.slug}.png`);
  if (fs.existsSync(outPath)) { console.log(`SKIP (exists) ${item.slug}`); return 'skip'; }
  const composer = page.locator(SEL.composer).first();
  await composer.click(); await page.waitForTimeout(800);
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
  console.log(`gen-images: ${LIST.length} images | purpose="${PURPOSE}" | cap=${pool.cap()} | current count=${pool.countFor(PURPOSE)}`);
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();
  const allSeen = new Set(), urlTs = new Map(), bufs = new Map();
  page.on('response', (resp) => {
    const u = resp.url(); if (!u.includes(IMAGE_URL_PATTERN)) return;
    allSeen.add(u); if (!urlTs.has(u)) urlTs.set(u, Date.now());
    if (!bufs.has(u)) bufs.set(u, resp.body().catch(() => null));
  });

  let navigatedUrl = null;   // the /c/ chat we're currently on (null = sitting on a fresh chatgpt.com/)
  let pendingFresh = false;  // opened a fresh chat; register its /c/ url after the first successful gen
  const route = `**/*${IMAGE_URL_PATTERN}*`;

  async function openFresh() {
    await page.route(route, r => r.abort());
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
    await composerLoaded(page, 30000);
    await page.waitForTimeout(2500);
    await page.unroute(route);
    navigatedUrl = null; pendingFresh = true;
    console.log('  opened a FRESH chat (will register its URL after first image)');
  }
  async function ensureChat() {
    const active = pool.getActiveUrl(PURPOSE);
    if (!active) { if (!(navigatedUrl === null && pendingFresh)) await openFresh(); return; }
    if (active === navigatedUrl) return;            // already on it, has room
    // navigate to the active pool chat (block its history images during load)
    await page.route(route, r => r.abort());
    await page.goto(active);
    await page.waitForLoadState('domcontentloaded');
    const ok = await composerLoaded(page, 12000);
    await page.waitForTimeout(2500);
    await page.unroute(route);
    if (!ok) { console.log('  stored chat unreachable/deleted -> markDead + fresh'); pool.markDead(PURPOSE); await openFresh(); return; }
    navigatedUrl = active; pendingFresh = false;
    console.log(`  reusing pool chat (${pool.countFor(PURPOSE)}/${pool.cap()}): ${active}`);
  }

  let ok = 0;
  for (const item of LIST) {
    const outPath = path.join(OUTDIR, `${PREFIX}-${item.image_id}-${item.slug}.png`);
    if (fs.existsSync(outPath)) { console.log(`SKIP (exists) ${item.slug}`); ok++; continue; }
    await ensureChat();
    let r = await genOne(page, allSeen, urlTs, bufs, item);
    if (r === false) { console.log('   retry once...'); r = await genOne(page, allSeen, urlTs, bufs, item); }
    if (r === true) {
      if (pendingFresh) {
        const u = page.url();
        if (/chatgpt\.com\/c\//.test(u)) { pool.registerNewChat(PURPOSE, u); navigatedUrl = u; pendingFresh = false; }
      }
      pool.recordImage(PURPOSE);
      ok++;
    }
  }
  console.log(`\nDone: ${ok}/${LIST.length} | ${PURPOSE} chat now ${pool.countFor(PURPOSE)}/${pool.cap()}`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
