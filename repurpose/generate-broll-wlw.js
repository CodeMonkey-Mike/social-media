// generate-broll-wlw.js  (v2 — DOM-based capture)
// ONE fresh ChatGPT chat, all images in sequence. Correct social-media assets path.
// Capture: after sending a prompt, poll the DOM for a NEW <img> whose src is an
// estuary/content asset (the rendered generated image), then fetch its bytes.
// Skips files that already exist (safe to re-run).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const ASSETS_DIR  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation\\assets';
const MAX_WAIT_MS = 4 * 60 * 1000;
const SEL = { composer: '#prompt-textarea, div[contenteditable="true"][data-id]' };

const LIST_FILE = process.argv[2] || path.join(__dirname, 'broll-wlw-images.json');
const IMAGES = JSON.parse(fs.readFileSync(LIST_FILE, 'utf-8'));

const getGenImgs = (page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('img'))
    .map(i => i.src)
    .filter(s => s.includes('estuary/content') || s.includes('oaiusercontent')));

async function generateImage(page, prompt, outputPath) {
  const baseline = new Set(await getGenImgs(page));
  const composer = page.locator(SEL.composer).first();
  await composer.click();
  await page.keyboard.type(prompt, { delay: 6 });
  await page.keyboard.press('Enter');
  console.log('  Prompt sent. Waiting for image to render...');

  const start = Date.now();
  let src = null;
  while (Date.now() - start < MAX_WAIT_MS) {
    await page.waitForTimeout(2500);
    const cur = await getGenImgs(page);
    const fresh = cur.filter(s => !baseline.has(s));
    if (fresh.length) {
      // wait a beat for the full-res src to settle, then take the newest
      await page.waitForTimeout(4000);
      const cur2 = await getGenImgs(page);
      const fresh2 = cur2.filter(s => !baseline.has(s));
      src = (fresh2.length ? fresh2 : fresh)[fresh.length - 1];
      break;
    }
  }
  if (!src) { console.log('  TIMEOUT — no new image in DOM.'); return false; }

  try {
    const resp = await page.request.get(src);
    if (!resp.ok()) { console.log('  fetch not ok:', resp.status()); return false; }
    const buf = await resp.body();
    if (!buf || buf.length < 1000) { console.log('  buffer too small:', buf && buf.length); return false; }
    fs.writeFileSync(outputPath, buf);
    console.log(`  Saved -> ${path.basename(outputPath)} (${(buf.length/1024).toFixed(0)} KB)`);
    await page.waitForTimeout(2500);
    return true;
  } catch (e) { console.log('  fetch error:', e.message); return false; }
}

async function main() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log('Launching Chrome...');
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await browser.newPage();

  // Chat selection via the shared pool (../chatgpt-image-chats.json), purpose = "broll". Reuse the
  // active b-roll chat while count<cap; rotate to a fresh chat at the cap (the persistent b-roll chat
  // got CONTAMINATED 2026-06-07, forcing icy/Bitcoin motifs onto every prompt — rotation prevents that).
  // Manual override: pass a chat URL as argv[3] to force a specific chat and bypass the pool.
  const pool = require('./chat-pool');
  const PURPOSE = 'broll';
  const OVERRIDE = process.argv[3] || null;
  let navigatedUrl = null, pendingFresh = false;

  async function composerOk(ms = 12000) {
    try { await page.locator(SEL.composer).first().waitFor({ timeout: ms }); return true; } catch { return false; }
  }
  async function openFresh() {
    await page.goto('https://chatgpt.com/');
    await page.waitForLoadState('domcontentloaded');
    await composerOk(30000); await page.waitForTimeout(2500);
    navigatedUrl = null; pendingFresh = true;
    console.log('  opened a FRESH b-roll chat (will register after first image)');
  }
  async function ensureChat() {
    if (OVERRIDE) {
      if (navigatedUrl === OVERRIDE) return;
      await page.goto(OVERRIDE); await page.waitForLoadState('domcontentloaded'); await composerOk(30000);
      navigatedUrl = OVERRIDE; pendingFresh = false; console.log('  using override chat:', OVERRIDE); return;
    }
    const active = pool.getActiveUrl(PURPOSE);
    if (!active) { if (!(navigatedUrl === null && pendingFresh)) await openFresh(); return; }
    if (active === navigatedUrl) return;
    await page.goto(active); await page.waitForLoadState('domcontentloaded');
    const ok = await composerOk(12000); await page.waitForTimeout(2000);
    if (!ok) { console.log('  stored b-roll chat unreachable -> markDead + fresh'); pool.markDead(PURPOSE); await openFresh(); return; }
    navigatedUrl = active; pendingFresh = false;
    console.log(`  reusing pool b-roll chat (${pool.countFor(PURPOSE)}/${pool.cap()})`);
  }

  let done = 0;
  for (const { file, prompt } of IMAGES) {
    const outputPath = path.join(ASSETS_DIR, file);
    if (fs.existsSync(outputPath)) { console.log(`[SKIP] ${file}`); done++; continue; }
    console.log(`\n[${done + 1}/${IMAGES.length}] ${file}`);
    await ensureChat();
    let ok = await generateImage(page, prompt, outputPath);
    if (!ok) { console.log('  retrying once...'); ok = await generateImage(page, prompt, outputPath); }
    if (ok) {
      if (!OVERRIDE && pendingFresh) {
        const u = page.url();
        if (/chatgpt\.com\/c\//.test(u)) { pool.registerNewChat(PURPOSE, u); navigatedUrl = u; pendingFresh = false; }
      }
      if (!OVERRIDE) pool.recordImage(PURPOSE);
      done++;
    } else console.log(`  FAILED ${file}`);
  }
  console.log(`\nDone: ${done}/${IMAGES.length} images.` + (OVERRIDE ? '' : `  broll chat now ${pool.countFor(PURPOSE)}/${pool.cap()}`));
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
