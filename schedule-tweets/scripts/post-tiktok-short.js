// post-tiktok-short.js — uploads one pending TikTok video from data/shorts.json.
//
// TikTok aggressively detects automation, so we DON'T use launchPersistentContext
// with a Playwright-managed profile. Instead we spawn the user's REAL Chrome
// (the same chrome.exe they use daily) with --remote-debugging-port=9224 and
// --user-data-dir pointed at their main "User Data" directory (where their
// existing TikTok login lives). We then attach Playwright via connectOverCDP —
// TikTok never sees Playwright's launch flags because they don't exist on this
// Chrome instance. Same trick that fixed YouTube polls.
//
// REQUIREMENT: All Chrome windows must be FULLY CLOSED before running. Chrome
// can't open a second instance against the same User Data dir, and it can't
// add --remote-debugging-port to an already-running instance.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');
const { stripHashtags, buildCaption } = require('./lib/strip-hashtags');

const SHORTS_JSON       = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_EXE        = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MAIN_USER_DATA    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\tiktokbot-profile';
const WORKSPACE_ROOT    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const DEBUG_DIR         = path.join(WORKSPACE_ROOT, 'tmp-tiktok-debug');
const CDP_PORT          = 9224;
const TIKTOK_UPLOAD_URL = 'https://www.tiktok.com/tiktokstudio/upload?lang=en';
const PLATFORM          = 'tiktok';

// Timing constants mirrored from post-fb-short.js / post-x-short.js
const CHAR_DELAY_MIN  = 60;
const CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 4000;
const ACTION_MAX      = 7000;
const PRE_COMPOSE_MIN = +(process.env.TT_PRE_COMPOSE_MIN || 60000);
const PRE_COMPOSE_MAX = +(process.env.TT_PRE_COMPOSE_MAX || 180000);
const PRE_POST_MIN    = +(process.env.TT_PRE_POST_MIN    || 60000);
const PRE_POST_MAX    = +(process.env.TT_PRE_POST_MAX    || 180000);

if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function actionPause(page, label = '') {
  const ms = rnd(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s pause${label ? ` (${label})` : ''}`);
  await page.waitForTimeout(ms);
}

async function longWait(page, minMs, maxMs, label = '') {
  const ms = rnd(minMs, maxMs);
  console.log(`  waiting ${Math.round(ms / 1000)}s${label ? ` (${label})` : ''}...`);
  await page.waitForTimeout(ms);
}

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

async function startChrome() {
  if (await isCDPReady()) {
    console.log(`Chrome already on CDP ${CDP_PORT} ✓`);
    return null;
  }
  console.log(`Launching real Chrome with main profile + CDP port ${CDP_PORT}...`);
  console.log(`(if this hangs, you still have a Chrome window open — close it and re-run)`);
  const proc = spawn(CHROME_EXE, [
    `--user-data-dir=${MAIN_USER_DATA}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    '--disable-blink-features=AutomationControlled',
    '--disable-sync',
    '--no-default-browser-check',
    'about:blank',
  ], { detached: false, stdio: 'ignore' });

  for (let i = 0; i < 120; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isCDPReady()) { console.log(`Chrome ready on CDP ${CDP_PORT} ✓`); return proc; }
  }
  throw new Error(
    `Chrome did not open CDP ${CDP_PORT} within 60s.\n` +
    `Likely cause: another Chrome window is already open against ${MAIN_USER_DATA}.\n` +
    `Close ALL Chrome windows (use Task Manager if needed) and re-run.`
  );
}

async function snapshot(page, label) {
  try {
    await page.screenshot({ path: path.join(DEBUG_DIR, `${label}.png`), fullPage: false });
  } catch {}
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll('[role="button"], button')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .map(el => ({
        text: (el.innerText || '').trim().slice(0, 40),
        aria: el.getAttribute('aria-label'),
        disabled: el.getAttribute('aria-disabled') === 'true' || el.disabled,
      }))
      .filter(b => b.text || b.aria)
      .slice(0, 40)
  );
  fs.writeFileSync(path.join(DEBUG_DIR, `${label}.json`), JSON.stringify(buttons, null, 2));
  console.log(`  [${label}] ${buttons.length} clickable elements → ${label}.{png,json}`);
  return buttons;
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Bail if anything is stuck in 'posting' — those need manual review. Prior
  // behavior auto-reset to 'pending' and caused duplicate uploads.
  const stuck = data.shorts.filter(s => s.platforms[PLATFORM]?.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} short(s) stuck in 'posting' — manual review required:`);
    for (const s of stuck) console.error(`  - ${s.id}: ${s.title}`);
    console.error('Check tiktok.com user profile to see if any actually published, then update data/shorts.json before retrying.');
    process.exit(2);
  }

  for (const s of data.shorts) {
    if (!s.platforms[PLATFORM]) {
      s.platforms[PLATFORM] = {
        status: 'pending', posted_at: null, url: null,
        views: null, views_captured_at: null, caption_override: null,
      };
    }
  }

  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');
  if (!short) { console.log('No pending TikTok shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) { console.error('Video not found:', videoPath); process.exit(1); }

  const caption = buildCaption(short.platforms[PLATFORM].caption_override || short.caption, short.tags, PLATFORM);

  console.log(`\nShort: "${short.title}"`);
  console.log(`File:  ${videoPath} (${short.duration_seconds}s)`);
  console.log(`Caption: ${caption.length} chars`);

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  const chromeProc = await startChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  try {
    console.log(`\nNavigating to ${TIKTOK_UPLOAD_URL}...`);
    await page.goto(TIKTOK_UPLOAD_URL, { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    console.log(`  Landed: ${page.url()}`);
    await snapshot(page, '01_landed');

    // ── Login check ─────────────────────────────────────────────────────────
    // If we land on /login, wait up to 10 minutes for the user to sign in
    // manually in the open Chrome window. Real Chrome + real user fingerprint
    // is TikTok's happiest case — login should work here even when their
    // bot-detection blocked the tiktokbot-profile.
    let loggedIn = false;
    try {
      await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 12000 });
      loggedIn = true;
      console.log('Logged in ✓');
    } catch {
      const url = page.url();
      console.log(`Not yet logged in (at: ${url})`);
      console.log('Please sign in to TikTok in the open Chrome window (up to 10 minutes)...');
      try {
        await page.waitForFunction(() => {
          const u = window.location.href;
          return u.includes('tiktok.com') &&
                 !u.includes('/login') && !u.includes('/signup') && !u.includes('/passport');
        }, null, { timeout: 600000 });
        console.log('  Login complete ✓ — navigating back to upload page');
        await page.waitForTimeout(3000);
        await page.goto(TIKTOK_UPLOAD_URL, { waitUntil: 'load' });
        await page.waitForTimeout(4000);
        await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 20000 });
        loggedIn = true;
      } catch (e) {
        throw new Error(`Login wait timed out or failed: ${e.message.split('\n')[0]}`);
      }
    }
    await actionPause(page, 'after login check');

    // ── Pre-composer human pause ────────────────────────────────────────────
    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before attaching video');

    // ── Attach video ────────────────────────────────────────────────────────
    // Use DOM.setFileInputFiles via CDP to bypass Playwright's 50MB connectOverCDP limit
    console.log(`Attaching video: ${videoPath}`);
    const cdp = await ctx.newCDPSession(page);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[type="file"]' });
    await cdp.send('DOM.setFileInputFiles', { files: [videoPath], nodeId });
    await cdp.detach().catch(() => {});
    console.log('  Video attached via CDP ✓');
    await actionPause(page, 'after attach');

    // ── Wait for caption composer ───────────────────────────────────────────
    console.log('Waiting for caption composer (up to 90s)...');
    let captionField = null;
    for (const sel of [
      'div[contenteditable="true"][role="combobox"]',
      'div[data-text="true"]',
      'div[contenteditable="true"]',
    ]) {
      const loc = page.locator(sel).first();
      try {
        await loc.waitFor({ state: 'visible', timeout: 30000 });
        captionField = loc;
        console.log(`  Composer found via: ${sel}`);
        break;
      } catch {}
    }
    if (!captionField) throw new Error('TikTok caption composer never appeared — bot detection blocked the upload.');
    await snapshot(page, '02_composer_ready');
    await actionPause(page, 'after composer ready');

    // ── Dismiss onboarding overlay if present ───────────────────────────────
    try {
      const overlay = page.locator('[data-test-id="overlay"]').first();
      await overlay.waitFor({ state: 'visible', timeout: 3000 });
      console.log('Dismissing onboarding overlay...');
      let clicked = false;
      for (const sel of ['button[data-action="skip"]', 'button[data-action="close"]']) {
        const btn = page.locator(sel).first();
        if (await btn.isVisible()) { await btn.click(); clicked = true; break; }
      }
      if (!clicked) await page.keyboard.press('Escape');
      await overlay.waitFor({ state: 'hidden', timeout: 5000 });
      await page.waitForTimeout(2000);
    } catch {}

    // ── Type caption (clear default first, then type with human delays) ─────
    console.log(`Typing caption (${caption.length} chars) at 60–150ms/char...`);
    await captionField.evaluate(el => el.click());
    await page.waitForTimeout(rnd(500, 1200));
    // Clear any auto-populated text (TikTok pre-fills the filename)
    await page.keyboard.press('Control+A');
    await page.waitForTimeout(300);
    await page.keyboard.press('Delete');
    await page.waitForTimeout(500);
    await typeHuman(page, caption);
    console.log('  Caption typed ✓');
    await actionPause(page, 'after caption');
    await snapshot(page, '03_caption_done');

    // ── Pre-post human pause ────────────────────────────────────────────────
    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post');

    // ── Click Post button ───────────────────────────────────────────────────
    console.log('Looking for Post button...');
    let postBtn = null;
    for (const btnName of ['Post', 'Publish']) {
      const candidate = page.getByRole('button', { name: btnName }).first();
      try {
        await candidate.waitFor({ state: 'visible', timeout: 10000 });
        postBtn = candidate;
        console.log(`  Found submit button: "${btnName}"`);
        break;
      } catch {}
    }
    if (!postBtn) throw new Error('Post button never appeared.');

    await postBtn.click();
    console.log('  Post clicked ✓');
    await page.waitForTimeout(rnd(2500, 4500));
    await snapshot(page, '04_after_post_click');

    // ── Optional confirmation dialog ────────────────────────────────────────
    try {
      const confirmBtn = page.getByRole('button', { name: 'Post' }).first();
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      console.log('  Confirmation dialog — confirming...');
      await confirmBtn.click();
      await page.waitForTimeout(rnd(2000, 4000));
    } catch {}

    // ── Wait for success toast or redirect (up to 5 min) ────────────────────
    console.log('Waiting for confirmation (up to 5 min)...');
    let confirmed = false;
    try {
      await page.waitForSelector(
        'text=/your video is being uploaded|video has been posted|posted successfully/i',
        { timeout: 300000 }
      );
      confirmed = true;
      console.log('  Success toast detected ✓');
    } catch {
      try {
        await page.waitForURL('**/tiktokstudio/content**', { timeout: 60000 });
        confirmed = true;
        console.log('  Redirected to content dashboard ✓');
      } catch {}
    }
    if (!confirmed) throw new Error('No confirmation after posting — check the browser manually.');
    await snapshot(page, '05_confirmed');

    // ── Capture latest video URL from /tiktokstudio/content ─────────────────
    console.log('\nCapturing TikTok URL from content dashboard...');
    let videoUrl = null;
    try {
      await page.goto('https://www.tiktok.com/tiktokstudio/content', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(rnd(5000, 9000));
      videoUrl = await page.evaluate(() => {
        const links = [...document.querySelectorAll('a[href*="/video/"], a[href*="/@"]')]
          .map(a => a.href.split('?')[0])
          .filter(h => /\/video\/\d+/.test(h));
        return links[0] || null;
      });
      console.log(`  URL: ${videoUrl || '(not found)'}`);
    } catch (e) { console.log(`  URL fetch error: ${e.message}`); }

    // ── URL captured — close Chrome immediately, verify via HTTP (no browser needed) ──
    try { await browser.close(); } catch {}
    if (chromeProc) { try { chromeProc.kill(); } catch {} }
    console.log('  Chrome closed ✓');

    // ── Verify the post is live via HTTP fetch (no browser needed) ────────────
    let verified = false;
    if (videoUrl) {
      console.log(`\nVerifying live post: ${videoUrl}`);
      try {
        const https = require('https');
        const status = await new Promise(resolve => {
          const req = https.get(videoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => resolve(r.statusCode));
          req.on('error', () => resolve(0));
          req.setTimeout(10000, () => { req.destroy(); resolve(0); });
        });
        console.log(`  HTTP ${status}`);
        if (status >= 200 && status < 400) { verified = true; console.log('  Verified live ✓'); }
        else console.log('  Not yet live (still processing) — URL captured, marking posted.');
      } catch (e) { console.log(`  Verification error: ${e.message}`); }
    }

    short.platforms[PLATFORM].status    = confirmed ? 'posted' : 'failed';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = videoUrl || 'https://www.tiktok.com/tiktokstudio/content';
    if (!confirmed) short.platforms[PLATFORM].error = 'no confirmation';
    else delete short.platforms[PLATFORM].error;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

    if (confirmed) console.log(`\nDone ✓  URL: ${videoUrl || '(dashboard)'}`);
    else console.log(`\nUncertain — verify manually. URL: ${videoUrl}`);

  } catch (err) {
    short.platforms[PLATFORM].status = 'failed';
    short.platforms[PLATFORM].error  = err.message;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  } finally {
    // Chrome is killed as soon as URL is captured (above). This is a safety net for error paths.
    try { await browser.close(); } catch {}
    if (chromeProc) { try { chromeProc.kill(); } catch {} }
  }
})();
