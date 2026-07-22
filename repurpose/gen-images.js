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

// ---- RELOAD-based capture (ported from generate-broll-reload.js, 2026-07-11) ----
// The live streaming DOM in an automation-detected browser sometimes NEVER surfaces the finished
// image (it just spins), but a PAGE RELOAD reveals it. So per image we SEND ONCE, poll the live DOM
// up to 80s, and if still nothing, RELOAD to capture. We NEVER re-send (a re-send = duplicate gen).
// Capture keys on the STABLE estuary file_id (id=file_...), which survives reloads, so we always grab
// the NEW image (the file_id not present before we sent) regardless of DOM order / lazy-load.
const getGenImgs = (page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('img')).map(i => i.src)
    .filter(s => s.includes('estuary/content') || s.includes('oaiusercontent')));
const fileId = (src) => { const m = src.match(/id=(file_[A-Za-z0-9]+)/); return m ? m[1] : src; };

async function gotoChat(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await composerLoaded(page, 30000);
  await page.waitForTimeout(3000);
  try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); } catch {}
  await page.waitForTimeout(500);
}
// ChatGPT occasionally throws a full-screen modal ("Compare responses" A/B eval) that overlays the
// composer and hangs the next prompt. Dismiss it: Escape, then a Skip/close button, then reload.
async function dismissDialog(page) {
  try {
    const open = async () => (await page.locator('div[role="dialog"][data-state="open"], div[role="dialog"]').count()) > 0;
    if (!(await open())) return false;
    console.log('   modal dialog present -> dismissing');
    for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(700); if (!(await open())) return true; }
    for (const re of [/skip/i, /no thanks/i, /close/i, /dismiss/i, /done/i, /prefer/i]) {
      const b = page.locator('div[role="dialog"] button', { hasText: re }).first();
      if (await b.count()) { await b.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(700); if (!(await open())) return true; }
    }
    const b0 = page.locator('div[role="dialog"] button').first();
    if (await b0.count()) { await b0.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(700); }
    if (await open()) { await page.reload().catch(() => {}); await page.waitForLoadState('domcontentloaded').catch(() => {}); await page.waitForTimeout(3000); }
    return !(await open());
  } catch { return false; }
}

async function genOne(page, item) {
  const outPath = path.join(OUTDIR, `${PREFIX}-${item.image_id}-${item.slug}.png`);
  if (fs.existsSync(outPath)) { console.log(`SKIP (exists) ${item.slug}`); return 'skip'; }
  await dismissDialog(page);
  const composer = page.locator(SEL.composer).first();
  await composer.click(); await page.waitForTimeout(600);
  // Upload the --reference FIRST, THEN snapshot. ORDER IS LOAD-BEARING (fixed 2026-07-14): the
  // uploaded ref must be part of the `before` baseline, or it looks like a brand-new file_id and
  // pickNew captures OUR OWN UPLOAD as the result. That bug shipped a byte-identical copy of
  // kaspa-logo.png as a finished tweet image, and cascaded (each later item then grabbed the
  // previous item's late render, shifting filenames by one). The old estuary-preference guard
  // below is NOT sufficient on its own: it assumed an uploaded ref is served from oaiusercontent,
  // but ChatGPT serves uploads from estuary/content too, so the ref slipped straight through it.
  if (item.ref) await uploadRef(page, item.ref);
  // snapshot the file_ids already in the chat (incl. any just-uploaded ref) so the new image is the unseen file_id
  const before = new Set((await getGenImgs(page)).map(fileId));
  await composer.click();
  for (const ch of item.prompt) { await page.keyboard.type(ch); await page.waitForTimeout(Math.floor(Math.random() * 25) + 45); }
  await page.waitForTimeout(Math.floor(Math.random() * 4000) + 6000);
  await page.keyboard.press('Enter');
  // A fresh chat navigates chatgpt.com/ -> /c/<id> shortly AFTER the first send; capture that url so a
  // reload targets the generating chat (reloading chatgpt.com/ would abandon it).
  let convUrl = page.url();
  for (let i = 0; i < 20 && !/\/c\//.test(convUrl); i++) { await page.waitForTimeout(1000); convUrl = page.url(); }

  // POST-SEND RE-BASELINE (fixed 2026-07-14). THE root fix for capturing our own uploaded --reference.
  // Uploading the ref before the first snapshot is NOT enough: the attachment is not in the DOM as an
  // estuary <img> until the message is actually POSTED, so it re-appears as an "unseen" file_id right
  // after send and pickNew grabs it. It is a RACE (whoever lands first), which is why it looked
  // intermittent: 2 of 3 slides rendered fine and the 3rd came back as the exemplar.
  // A generation NEVER completes in ~3s, so anything on the page 3s after send is by definition NOT
  // our result: fold it all into `before` and it can never be picked again.
  // NOTE: a byte/md5 comparison against the ref file does NOT catch this - the CDN re-encodes the PNG,
  // so bytes/md5 differ while the pixels are identical. That false-negative is exactly why the
  // 2026-07-11 session wrongly concluded "ChatGPT reproduces the exemplar verbatim" and logged it as an
  // unresolved model quirk; it was this capture bug all along.
  await page.waitForTimeout(3000);
  for (const s of await getGenImgs(page)) before.add(fileId(s));

  const pickNew = async () => {
    const imgs = await getGenImgs(page);
    const news = imgs.filter(s => !before.has(fileId(s)));
    // Prefer estuary/content (the GENERATED image). oaiusercontent ALSO matches an UPLOADED
    // --reference image, so without this preference pickNew can grab the uploaded exemplar/logo
    // instead of the result (it did: carousel slides captured the ref exemplars verbatim). Only
    // fall back to a non-estuary url when there is no estuary image at all.
    const est = news.filter(s => s.includes('estuary/content'));
    const cand = est.length ? est : news;
    return cand.length ? cand[cand.length - 1] : null;   // newest unseen generated image
  };
  const finish = async (src) => {
    let buf = null;
    try { const r = await page.request.get(src); if (r.ok()) buf = await r.body(); } catch {}
    if (!buf || buf.length < 5000) return false;
    // MECHANICAL GATE: never accept our own uploaded --reference as the generated output. An image
    // model cannot reproduce an input byte-for-byte, so identical bytes prove a mis-capture, not a
    // render. Rejecting here makes pickNew keep polling for the real image instead of shipping the ref.
    if (item.ref && fs.existsSync(item.ref)) {
      const rb = fs.readFileSync(item.ref);
      if (rb.length === buf.length && rb.equals(buf)) {
        console.log(`   REJECT: captured the uploaded reference, not a render (${item.slug}) - still waiting`);
        return false;
      }
    }
    for (const sib of fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png'))) {
      const sb = fs.readFileSync(path.join(OUTDIR, sib));
      if (sb.length === buf.length && sb.equals(buf)) { console.log(`FAIL (dup of ${sib}) ${item.slug}`); return false; }
    }
    fs.writeFileSync(outPath, buf);
    console.log(`OK ${item.slug} (${(buf.length / 1024).toFixed(0)} KB)`);
    return true;
  };

  // PHASE 1: poll the LIVE DOM up to 80s (fast path — image usually appears naturally).
  const t0 = Date.now();
  while (Date.now() - t0 < 80000) {
    await page.waitForTimeout(5000);
    let src = await pickNew();
    if (src) { await page.waitForTimeout(3000); src = (await pickNew()) || src; if (await finish(src)) { await page.waitForTimeout(2000); return true; } }
  }
  // PHASE 2: hung past 80s -> RELOAD to surface the (server-side-finished) image.
  console.log(`   >80s no new image in live DOM (hung) -> reloading to capture ${item.slug}`);
  const reloadUrl = /\/c\//.test(convUrl) ? convUrl : page.url();
  const MAX = 4 * 60 * 1000, t1 = Date.now();
  while (Date.now() - t1 < MAX) {
    await gotoChat(page, reloadUrl);
    await dismissDialog(page);
    const src = await pickNew();
    if (src && await finish(src)) { await page.waitForTimeout(2000); return true; }
    await page.waitForTimeout(15000);
  }
  console.log(`FAIL (timeout) ${item.slug}`);
  return false;
}

(async () => {
  fs.mkdirSync(OUTDIR, { recursive: true });
  console.log(`gen-images: ${LIST.length} images | purpose="${PURPOSE}" | cap=${pool.cap()} | current count=${pool.countFor(PURPOSE)}`);
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();

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
    let r = await genOne(page, item);
    if (r === false) { console.log('   retry once...'); r = await genOne(page, item); }
    if (r === true) {
      if (pendingFresh) {
        // API-confirmed registration + gated rename ("b-roll:"/"social:" title) — never trust
        // page.url() alone, its id can diverge from the real conversation id (2026-07-22).
        const reg = await pool.confirmAndRegister(page, PURPOSE);
        if (reg) { navigatedUrl = reg.url; pendingFresh = false; }
      }
      pool.recordImage(PURPOSE);
      ok++;
    }
  }
  console.log(`\nDone: ${ok}/${LIST.length} | ${PURPOSE} chat now ${pool.countFor(PURPOSE)}/${pool.cap()}`);
  // Delete rotated-out/dead chats while the browser is still open (registry `retired` list).
  // A sweep failure never blocks the run — the chat stays queued for the next sweep.
  try { await require('./chat-delete').sweepRetired(page); }
  catch (e) { console.log('  [chat-delete] sweep error: ' + e.message.split('\n')[0]); }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
