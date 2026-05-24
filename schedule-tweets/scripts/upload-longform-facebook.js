// upload-longform-facebook.js — uploads a single longform video to Facebook.
// Reads metadata.json + video from C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\
// Adapted from post-fb-short.js: SAME Facebook upload flow (feed composer -> Photo/video ->
// wizard -> Post -> verify), but sourced from the longform/ staging folder (no shorts.json queue),
// same pattern as upload-longform-rumble.js / upload-longform-bitchute.js. The video is landscape,
// so Facebook posts it as a normal video (not a Reel); the generic wizard loop handles both.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SOURCE_DIR     = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\longform';
const METADATA_FILE  = 'metadata.json';
const VIDEO_EXTS     = ['.mp4', '.mov', '.webm', '.mkv'];
const MIN_FILE_SIZE  = 1_000_000; // 1MB
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\fbbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const DEBUG_DIR      = path.join(WORKSPACE_ROOT, 'tmp-fb-longform-debug');
const FB_PAGE        = 'realCodeMonkeyMike';
const PAGE_URL       = `https://www.facebook.com/${FB_PAGE}/`;

// Timing — mirrors post-fb-short.js
const CHAR_DELAY_MIN  = 60, CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 4000, ACTION_MAX      = 7000;
const PRE_COMPOSE_MIN = 60000, PRE_COMPOSE_MAX = 180000;
const PRE_POST_MIN    = 60000, PRE_POST_MAX    = 180000;
const VIDEOS_TAB_WAIT_MIN = 5000, VIDEOS_TAB_WAIT_MAX = 9000;

if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
async function actionPause(page, label = '') { const ms = rnd(ACTION_MIN, ACTION_MAX); console.log(`  ~ ${(ms/1000).toFixed(1)}s pause${label?` (${label})`:''}`); await page.waitForTimeout(ms); }
async function longWait(page, a, b, label = '') { const ms = rnd(a, b); console.log(`  waiting ${Math.round(ms/1000)}s${label?` (${label})`:''}...`); await page.waitForTimeout(ms); }
async function typeHuman(page, text) { for (const c of text) { await page.keyboard.type(c); await page.waitForTimeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX)); } }
async function mouseClick(page, locator) { const b = await locator.boundingBox(); if (b && b.width > 0) await page.mouse.click(b.x + b.width/2, b.y + b.height/2); else await locator.click(); }

// Auto-detect the single video in SOURCE_DIR (most-recently-modified wins if several).
function pickFile(dir, exts, label) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m);
  if (!files.length) return null;
  if (files.length > 1) console.log(`  (multiple ${label} files; using most recent: ${files[0].f})`);
  return path.join(dir, files[0].f);
}

async function snapshot(page, label) {
  const state = await page.evaluate(() => {
    const big = [...document.querySelectorAll('[role="dialog"]')].filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });
    const top = big[big.length - 1] || document.body;
    const buttons = [...top.querySelectorAll('[role="button"], button')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .map(el => ({ text: (el.innerText||'').trim().slice(0,40), aria: el.getAttribute('aria-label'), disabled: el.getAttribute('aria-disabled')==='true'||el.disabled }))
      .filter(b => b.text || b.aria);
    return { dialogs: big.map(d => ({ aria: d.getAttribute('aria-label') })), buttons };
  });
  console.log(`\n[${label}] dialogs: ${JSON.stringify(state.dialogs)}`);
  state.buttons.forEach(b => console.log(`  ${JSON.stringify(b)}`));
  try { await page.screenshot({ path: path.join(DEBUG_DIR, `${label}.png`) }); } catch {}
  return state;
}

async function clickByLabelInDialog(page, label) {
  return page.evaluate((lbl) => {
    const ds = [...document.querySelectorAll('[role="dialog"]')].filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });
    const root = ds[ds.length - 1]; if (!root) return { ok: false, reason: 'no dialog' };
    const vw = window.innerWidth, vh = window.innerHeight, matches = [];
    for (const el of root.querySelectorAll('[role="button"], button, [role="menuitem"]')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      if (r.x + r.width <= 0 || r.x >= vw || r.y + r.height <= 0 || r.y >= vh) continue;
      const aria = el.getAttribute('aria-label') || '', txt = (el.innerText || el.textContent || '').trim();
      if (aria === lbl || txt === lbl) { const dis = el.getAttribute('aria-disabled')==='true'||el.disabled; if (!dis) matches.push({ el, area: r.width*r.height }); }
    }
    if (!matches.length) return { ok: false, reason: 'no match' };
    matches.sort((a, b) => b.area - a.area); matches[0].el.click();
    return { ok: true, matches: matches.length };
  }, label);
}

(async () => {
  // ── Validate source (before any Chrome work) ──────────────────────────────
  const metaPath  = path.join(SOURCE_DIR, METADATA_FILE);
  const videoPath = pickFile(SOURCE_DIR, VIDEO_EXTS, 'video');
  if (!videoPath)            { console.error('No video file found in', SOURCE_DIR); process.exit(1); }
  if (!fs.existsSync(metaPath)) { console.error('metadata.json not found in', SOURCE_DIR); process.exit(1); }
  if (fs.statSync(videoPath).size < MIN_FILE_SIZE) { console.error('Video below 1MB minimum'); process.exit(1); }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const titleLine = (meta.title || '').trim();
  const descr     = (meta.description || '').trim();
  let caption = [titleLine, descr].filter(Boolean).join('\n\n');
  caption = caption.replace(/#[\w]+/g, '').replace(/\n{3,}/g, '\n\n').trim(); // strip hashtags (break FB wizard)

  console.log(`Video:   ${videoPath} (${(fs.statSync(videoPath).size/1048576).toFixed(0)} MB)`);
  console.log(`Title:   ${titleLine}`);
  console.log(`Caption: ${caption.length} chars (hashtags stripped)`);

  console.log('\nLaunching Chrome...');
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
  const page = browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();

  try {
    console.log(`\nNavigating to ${PAGE_URL}...`);
    await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
    await actionPause(page, 'page settled');

    const isLoggedOut = async () => {
      const url = page.url();
      if (['/login', 'two_step', 'checkpoint', 'verification', 'recover'].some(x => url.includes(x))) return true;
      return (await page.locator('input[name="email"], input[name="pass"]').count()) > 0;
    };
    if (await isLoggedOut()) throw new Error('Not logged in — sign in to fbbot-profile manually');

    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1000);
    try {
      const sw = page.getByRole('button', { name: 'Switch Now' });
      await sw.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Switching into Page context...'); await sw.click();
      await page.waitForLoadState('domcontentloaded'); await actionPause(page, 'after Switch Now');
    } catch {}

    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    console.log('\nOpening composer...');
    let opened = false;
    for (const sel of ['[aria-label*="mind" i]', 'div[role="button"]:has-text("What")']) {
      const el = page.locator(sel).first();
      try { await el.waitFor({ state: 'visible', timeout: 5000 }); await mouseClick(page, el); opened = true; console.log(`  opened via: ${sel}`); break; } catch {}
    }
    if (!opened) throw new Error('Could not open composer');
    await actionPause(page, 'composer opened');

    console.log('Clicking Photo/video...');
    let pvBtn = null;
    for (const sel of ['[role="dialog"] [aria-label*="Photo" i]', '[role="dialog"] button:has-text("Photo/video")', '[aria-label="Photo/video"]']) {
      const el = page.locator(sel).first(); if (await el.count() > 0) { pvBtn = el; break; }
    }
    if (!pvBtn) throw new Error('Photo/video button not found');
    await mouseClick(page, pvBtn); await actionPause(page, 'Photo/video clicked');

    console.log(`Attaching video: ${videoPath}`);
    let attached = false;
    for (const sel of ['input[type="file"][accept*="video"]', 'input[type="file"][accept*="mp4"]', 'input[type="file"]']) {
      const fi = page.locator(sel).first();
      if (await fi.count() > 0) { try { await fi.setInputFiles(videoPath); console.log(`  attached via: ${sel}`); attached = true; break; } catch (e) { console.log(`  ${sel} failed: ${e.message}`); } }
    }
    if (!attached) throw new Error('Could not attach video');

    console.log('Waiting for upload 100% (longform — up to 10 min)...');
    try { await page.waitForFunction(() => document.body.innerText.includes('100%'), { timeout: 600000 }); console.log('  100% ✓'); }
    catch { console.log('  100% signal not seen — continuing'); }

    console.log('Waiting for copyright check to clear...');
    for (let i = 0; i < 60; i++) { const txt = await page.evaluate(() => document.body.innerText.toLowerCase()); if (!txt.includes('checking for copyrighted')) break; await page.waitForTimeout(2000); }
    await actionPause(page, 'after upload');

    console.log(`Typing caption (${caption.length} chars)...`);
    try {
      const body = page.locator('div[contenteditable="true"][role="textbox"]').first();
      await body.waitFor({ state: 'visible', timeout: 10000 });
      await body.evaluate(el => el.click()); await page.waitForTimeout(rnd(500, 1200));
      await typeHuman(page, caption); console.log('  caption typed ✓');
    } catch (e) { console.log(`  caption skipped: ${e.message}`); }
    await actionPause(page, 'after caption');

    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before wizard');

    const FINAL_LABELS = ['Share now', 'Post', 'Publish', 'Share', 'Done'];
    let posted = false;
    for (let step = 1; step <= 12; step++) {
      const state = await snapshot(page, `step${step}_state`);
      let finalLabel = null;
      for (const lbl of FINAL_LABELS) { const f = state.buttons.find(b => !b.disabled && (b.aria === lbl || b.text === lbl)); if (f) { finalLabel = lbl; break; } }
      if (finalLabel) {
        console.log(`\n→ Final button "${finalLabel}" found on step ${step} — clicking`);
        const r = await clickByLabelInDialog(page, finalLabel); console.log(`  click result: ${JSON.stringify(r)}`);
        if (r.ok) { await actionPause(page, 'after final click'); posted = true; await snapshot(page, `step${step}_after_final`); break; }
      }
      const nextEnabled = state.buttons.find(b => !b.disabled && (b.aria === 'Next' || b.text === 'Next'));
      if (!nextEnabled) { console.log(`\n→ No Next and no final button at step ${step}. Stopping.`); break; }
      console.log(`\n→ Clicking Next (step ${step})`);
      const r = await clickByLabelInDialog(page, 'Next'); console.log(`  click result: ${JSON.stringify(r)}`);
      await actionPause(page, `after Next ${step}`);
    }
    if (!posted) { await snapshot(page, 'FAILED_final_state'); throw new Error('Wizard did not reach final submit button'); }

    for (const label of ['Not now', 'No thanks', 'Maybe later', 'Skip']) {
      try { const btn = page.getByRole('button', { name: label, exact: true }).first(); if (await btn.isVisible()) { console.log(`Dismissing upsell: ${label}`); await btn.click(); await page.waitForTimeout(rnd(1500, 2500)); break; } } catch {}
    }

    console.log('\nWaiting for "Posting" to clear...');
    let submitted = false;
    for (let i = 0; i < 180; i++) { await page.waitForTimeout(1000); const txt = (await page.evaluate(() => document.body.innerText)).toLowerCase(); if (!txt.includes('posting') && !txt.includes('uploading')) { submitted = true; console.log('  Submitted ✓'); break; } }

    console.log('\nCapturing video URL from /videos tab...');
    let videoUrl = null;
    try {
      await page.goto(`https://www.facebook.com/${FB_PAGE}/videos`, { waitUntil: 'domcontentloaded' });
      await longWait(page, VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX, 'videos tab settle');
      const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href.split('?')[0])
        .filter(h => (h.includes('/videos/') || h.includes('/reel/')) && h.includes('facebook.com') && !h.endsWith('/videos') && !h.endsWith('/videos/') && !h.endsWith('/reel/'))
        .filter((h, i, arr) => arr.indexOf(h) === i).slice(0, 3));
      console.log(`  Recent video URLs: ${JSON.stringify(links)}`);
      if (links.length) videoUrl = links[0];
    } catch (e) { console.log(`  URL fetch error: ${e.message}`); }

    let verified = false;
    if (videoUrl) {
      console.log(`\nVerifying live post: ${videoUrl}`);
      try {
        const resp = await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const status = resp ? resp.status() : 0; console.log(`  HTTP ${status}`);
        await page.waitForTimeout(rnd(3500, 5500));
        const hasPlayer = await page.evaluate(() => {
          if (document.querySelector('video')) return 'video';
          if (document.querySelector('[data-video-id], [data-pagelet*="video" i]')) return 'player-container';
          const og = document.querySelector('meta[property="og:video"], meta[property="og:video:url"]'); if (og) return 'og:video';
          return null;
        });
        console.log(`  Player signal: ${hasPlayer || 'none'}`);
        if (status >= 200 && status < 400 && hasPlayer) { verified = true; console.log('  Verified live ✓'); }
        else console.log('  Could not verify — post may not be live');
      } catch (e) { console.log(`  Verification error: ${e.message}`); }
    } else console.log('  Skipping verification — no URL captured');

    if (submitted && verified) console.log(`\nDone ✓  URL: ${videoUrl}`);
    else console.log(`\nUncertain — verify manually. URL: ${videoUrl || '(not captured)'}`);

  } catch (err) {
    console.error('\nFailed:', err.message); process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
  }
})();
