// generate-broll-reload.js — robust RELOAD-based ChatGPT b-roll generator.
//
// Two problems it solves, both from driving ChatGPT in an automation-detected browser:
//  1) CAPTURE HANG: after a prompt is sent the live streaming DOM sometimes never surfaces the
//     finished image (it just spins), but a PAGE RELOAD reveals it (confirmed by Mike viewing the
//     same chat in a clean Edge browser). So per beat we SEND ONCE, poll the live DOM up to 80s, and
//     if still nothing, RELOAD to capture. It NEVER re-sends (re-sending = a duplicate generation).
//  2) WRONG-IMAGE grabs: "take the last <img> in the DOM" mis-grabs a PRE-EXISTING image when the
//     page lazy-loads / under-counts. Fix: key on the STABLE estuary file_id (id=file_...), survives
//     reloads, and track which file_ids we've already downloaded — the new image is the one whose
//     file_id we have not seen. Robust regardless of DOM order or lazy-load.
//
// Typing uses the canonical human-like per-char delay (~45-70ms), matching gen-images.js.
// Skips existing files (safe to re-run). Pool purpose "broll". BEST used against a FRESH chat
// (retire the active broll chat first) so the seen-set starts clean.
//
// Usage (run from repurpose/):  node generate-broll-reload.js <list.json> [chatUrlOverride]
//   list.json: [{ "file": "..\\shorts\\...\\render-assets\\broll-x.png", "prompt": "..." }]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pool = require('./chat-pool');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const ASSETS_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation\\assets';
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };
const PURPOSE = 'broll';

const LIST_FILE = process.argv[2];
const CHAT_OVERRIDE = process.argv[3] || null;
const IMAGES = JSON.parse(fs.readFileSync(LIST_FILE, 'utf-8'));

const getGenImgs = (page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('img'))
    .map(i => i.src)
    .filter(s => s.includes('estuary/content') || s.includes('oaiusercontent')));
// Stable per-image id from the estuary URL (id=file_...); tokens/ts change across reloads, id does not.
const fileId = (src) => { const m = src.match(/id=(file_[A-Za-z0-9]+)/); return m ? m[1] : src; };

async function composerOk(page, ms = 30000) {
  try { await page.locator(SEL.composer).first().waitFor({ timeout: ms }); return true; } catch { return false; }
}
async function gotoChat(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await composerOk(page);
  await page.waitForTimeout(3000);
  try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); } catch {}
  await page.waitForTimeout(500);
}
// ChatGPT occasionally throws up a full-screen modal (e.g. role="dialog" aria-label="Compare
// responses" — an A/B "which do you prefer?" eval) that overlays + intercepts the composer, hanging
// the next prompt. Detect any open dialog and dismiss it: Escape first, then a Skip/close/prefer/done
// button, then any button as last resort.
async function dismissDialog(page) {
  try {
    const open = async () => (await page.locator('div[role="dialog"][data-state="open"], div[role="dialog"]').count()) > 0;
    if (!(await open())) return false;
    console.log('  modal dialog present (e.g. "Compare responses") -> dismissing');
    for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(700); if (!(await open())) return true; }
    for (const re of [/skip/i, /no thanks/i, /close/i, /dismiss/i, /done/i, /prefer/i]) {
      const b = page.locator('div[role="dialog"] button', { hasText: re }).first();
      if (await b.count()) { await b.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(700); if (!(await open())) return true; }
    }
    const b0 = page.locator('div[role="dialog"] button').first();
    if (await b0.count()) { await b0.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(700); }
    // Last resort: a full-screen overlay (inset-0 z-120) can survive Escape/clicks — a page reload
    // drops it while keeping the conversation.
    if (await open()) { await page.reload().catch(() => {}); await page.waitForLoadState('domcontentloaded').catch(() => {}); await page.waitForTimeout(3000); }
    return !(await open());
  } catch { return false; }
}

async function tryDownload(page, src, outPath) {
  try {
    const resp = await page.request.get(src);
    if (!resp.ok()) return false;
    const buf = await resp.body();
    if (!buf || buf.length < 5000) return false;
    fs.writeFileSync(outPath, buf);
    console.log(`  saved ${path.basename(outPath)} (${(buf.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (e) { console.log('  fetch retry:', e.message.split('\n')[0]); return false; }
}

// Send ONE prompt, then find the image whose file_id is not in `seen`, download it, mark it seen.
async function generateOne(page, prompt, outPath, seen) {
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  for (const ch of prompt) { await page.keyboard.type(ch); await page.waitForTimeout(Math.floor(Math.random() * 25) + 45); }
  await page.waitForTimeout(600);
  await page.keyboard.press('Enter');
  // Capture the conversation URL robustly: a FRESH chat navigates chatgpt.com/ -> /c/<id> a moment
  // AFTER the first message is sent. If Phase 2 reloads chatgpt.com/ it abandons the generating chat
  // and the first image never captures (times out). So poll up to ~20s until the URL is a /c/ chat.
  let convUrl = page.url();
  for (let i = 0; i < 20 && !/\/c\//.test(convUrl); i++) { await page.waitForTimeout(1000); convUrl = page.url(); }

  const pickNew = async () => {
    const imgs = await getGenImgs(page);
    const news = imgs.filter(s => !seen.has(fileId(s)));
    return news.length ? news[news.length - 1] : null;   // newest unseen file_id
  };

  // PHASE 1 (Mike): generation is fast, poll the LIVE DOM up to 80s and grab the image the moment it
  // appears naturally. Only if still absent past 80s do we treat the live DOM as hung and reload.
  // (80s not 60s: at 60s the reload can land as the image is still finishing and catch a partial.)
  const t0 = Date.now();
  while (Date.now() - t0 < 80000) {
    await page.waitForTimeout(5000);
    let src = await pickNew();
    if (src) {
      await page.waitForTimeout(3000);                   // let full-res settle
      src = (await pickNew()) || src;
      if (await tryDownload(page, src, outPath)) { seen.add(fileId(src)); return page.url(); }
    }
  }
  // PHASE 2: hung past 80s -> RELOAD (defeats the detection hang; image is done server-side by now).
  console.log('  >80s with no new image in the live DOM (hung) -> reloading to capture');
  const reloadUrl = /\/c\//.test(convUrl) ? convUrl : page.url();
  const MAX = 4 * 60 * 1000, t1 = Date.now();
  while (Date.now() - t1 < MAX) {
    await gotoChat(page, reloadUrl);
    const src = await pickNew();
    if (src && await tryDownload(page, src, outPath)) { seen.add(fileId(src)); return page.url(); }
    await page.waitForTimeout(15000);
  }
  console.log('  TIMEOUT');
  return null;
}

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();

  let chatUrl = CHAT_OVERRIDE || pool.getActiveUrl(PURPOSE);
  let pendingFresh = false;
  if (!chatUrl) {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
    await composerOk(page); await page.waitForTimeout(2500);
    pendingFresh = true;
    console.log('opened FRESH broll chat');
  } else {
    await gotoChat(page, chatUrl);
    console.log('using broll chat', chatUrl);
  }

  // Seed `seen` with whatever images already exist in the chat (empty for a fresh chat) so we never
  // mistake a pre-existing image for the new one.
  const seen = new Set((await getGenImgs(page)).map(fileId));

  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const outPath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(outPath)) { console.log(`[SKIP] ${path.basename(outPath)}`); done++; continue; }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    console.log(`\n[${done + 1}/${IMAGES.length}] ${path.basename(outPath)}`);
    const url = await generateOne(page, prompt, outPath, seen);
    if (url) {
      if (pendingFresh) {
        // API-confirmed registration + gated rename ("b-roll:"/"social:" title) — never trust
        // page.url() alone, its id can diverge from the real conversation id (2026-07-22).
        const reg = await pool.confirmAndRegister(page, PURPOSE);
        if (reg) pendingFresh = false;
      }
      pool.recordImage(PURPOSE);
      done++;
    } else console.log(`  FAILED ${path.basename(outPath)}`);
  }
  console.log(`\nDone ${done}/${IMAGES.length}. broll chat now ${pool.countFor(PURPOSE)}/${pool.cap()}`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
