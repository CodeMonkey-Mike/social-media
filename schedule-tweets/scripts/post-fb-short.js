// post-fb-short.js — uploads one pending Facebook video from data/shorts.json
//
// Approach (2026-05-21):
//   • Pre-composer human pause (60–180s before opening the composer)
//   • Open composer ("What's on your mind?")
//   • Click Photo/video, then attach via the file input that accepts video/*
//   • Wait for upload 100% + copyright check to clear
//   • Type caption character-by-character with 60–150ms per-keystroke delay
//     (hashtags stripped — tag autocomplete intercepts the wizard)
//   • Pre-post human pause (60–180s) before iterating the wizard
//   • Iterate up to 6 times: snapshot state, look for final submit button
//     (Post / Share now / Publish / Share). Click it if present; otherwise
//     click Next and continue. Final submit scoped strictly to topmost dialog
//     (Page-level "Photo/video" tabs are NEVER picked up).
//   • When multiple buttons share the same aria-label (off-screen stacked
//     wizard pages do this), pick the largest visible area.
//   • Post-publish verification: navigate to the captured URL and confirm
//     the video page loads (HTTP 200 + video player element present).
//
// Timing constants below mirror scripts/post-x-short.js (60–180s pre-composer,
// 4–7s between UI actions, 60–150ms per keystroke, 60–180s pre-post).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\fbbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const DEBUG_DIR      = path.join(WORKSPACE_ROOT, 'tmp-fb-debug');
const FB_PAGE        = 'realCodeMonkeyMike';
const PAGE_URL       = `https://www.facebook.com/${FB_PAGE}/`;
const PLATFORM       = 'facebook';

// Timing constants — mirrored from scripts/post-x-short.js
const CHAR_DELAY_MIN  = 60;     // ms per caption keystroke
const CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 4000;   // ms between major UI actions
const ACTION_MAX      = 7000;
const PRE_COMPOSE_MIN = 60000;  // ms before opening composer (60–180s)
const PRE_COMPOSE_MAX = 180000;
const PRE_POST_MIN    = 60000;  // ms before entering wizard / clicking final Post
const PRE_POST_MAX    = 180000;
const VIDEOS_TAB_WAIT_MIN = 5000;   // ms between page load and link scrape
const VIDEOS_TAB_WAIT_MAX = 9000;

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

async function mouseClick(page, locator) {
  const bbox = await locator.boundingBox();
  if (bbox && bbox.width > 0) {
    await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
  } else {
    await locator.click();
  }
}

// Dump dialog state + screenshot at a labeled step.
async function snapshot(page, label) {
  const state = await page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')]
      .filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; })
      .map(d => ({ aria: d.getAttribute('aria-label'), w: Math.round(d.getBoundingClientRect().width), h: Math.round(d.getBoundingClientRect().height) }));
    const topDialog = (() => {
      const ds = [...document.querySelectorAll('[role="dialog"]')]
        .filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });
      return ds[ds.length - 1] || document.body;
    })();
    const buttons = [...topDialog.querySelectorAll('[role="button"], button')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .map(el => ({
        text: (el.innerText || '').trim().slice(0, 40),
        aria: el.getAttribute('aria-label'),
        disabled: el.getAttribute('aria-disabled') === 'true' || el.disabled,
        rect: (() => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
      }))
      .filter(b => b.text || b.aria);
    return { dialogs, buttons };
  });
  console.log(`\n[${label}] dialogs: ${JSON.stringify(state.dialogs)}`);
  console.log(`[${label}] buttons in top dialog (${state.buttons.length}):`);
  state.buttons.forEach(b => console.log(`  ${JSON.stringify(b)}`));
  fs.writeFileSync(path.join(DEBUG_DIR, `${label}.json`), JSON.stringify(state.buttons, null, 2));
  try { await page.screenshot({ path: path.join(DEBUG_DIR, `${label}.png`), fullPage: false }); } catch {}
  return state;
}

// Click a button by exact label, scoped to the topmost dialog only.
// When multiple buttons share the label (stacked wizard pages), pick the largest.
async function clickByLabelInDialog(page, label) {
  return page.evaluate((lbl) => {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')]
      .filter(d => { const r = d.getBoundingClientRect(); return r.width > 100 && r.height > 100; });
    const root = dialogs[dialogs.length - 1];
    if (!root) return { ok: false, reason: 'no dialog' };

    const matches = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    for (const el of root.querySelectorAll('[role="button"], button, [role="menuitem"]')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      // Must be inside the viewport — stacked wizard panels slide off-screen but
      // their buttons still report non-zero w/h. Picking an off-screen Next causes
      // the wizard to advance another step without the user-visible change.
      if (r.x + r.width <= 0 || r.x >= vw) continue;
      if (r.y + r.height <= 0 || r.y >= vh) continue;
      const aria = el.getAttribute('aria-label') || '';
      const txt  = (el.innerText || el.textContent || '').trim();
      if (aria === lbl || txt === lbl) {
        const disabled = el.getAttribute('aria-disabled') === 'true' || el.disabled;
        if (!disabled) matches.push({ el, area: r.width * r.height });
      }
    }
    if (matches.length === 0) return { ok: false, reason: 'no match' };
    matches.sort((a, b) => b.area - a.area);
    matches[0].el.click();
    return { ok: true, matches: matches.length };
  }, label);
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Reset any stuck 'posting' rows
  for (const s of data.shorts) {
    if (s.platforms[PLATFORM]?.status === 'posting') s.platforms[PLATFORM].status = 'pending';
  }

  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');
  if (!short) { console.log('No pending Facebook shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) { console.error('Video not found:', videoPath); process.exit(1); }

  const rawCaption = short.platforms[PLATFORM].caption_override || short.caption;
  const caption = rawCaption.replace(/#[\w]+/g, '').replace(/\n{3,}/g, '\n\n').trim();

  console.log(`Short: "${short.title}"`);
  console.log(`File:  ${videoPath} (${short.duration_seconds}s)`);
  console.log(`Caption: ${caption.length} chars (hashtags stripped)`);

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  console.log('\nLaunching Chrome...');
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();

  try {
    // ── Navigate to Page ────────────────────────────────────────────────────
    console.log(`\nNavigating to ${PAGE_URL}...`);
    await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
    await actionPause(page, 'page settled');

    // Login check (uses login form presence, never footer text)
    const isLoggedOut = async () => {
      const url = page.url();
      if (['/login', 'two_step', 'checkpoint', 'verification', 'recover'].some(x => url.includes(x))) return true;
      return (await page.locator('input[name="email"], input[name="pass"]').count()) > 0;
    };
    if (await isLoggedOut()) throw new Error('Not logged in — sign in to fbbot-profile manually');

    // Dismiss notifications & switch to Page
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    try {
      const switchBtn = page.getByRole('button', { name: 'Switch Now' });
      await switchBtn.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Switching into Page context...');
      await switchBtn.click();
      await page.waitForLoadState('domcontentloaded');
      await actionPause(page, 'after Switch Now');
    } catch {}

    // ── Pre-composer human pause ────────────────────────────────────────────
    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    // ── Open composer ───────────────────────────────────────────────────────
    console.log('\nOpening composer...');
    let opened = false;
    for (const sel of [
      '[aria-label*="mind" i]',
      'div[role="button"]:has-text("What")',
    ]) {
      const el = page.locator(sel).first();
      try {
        await el.waitFor({ state: 'visible', timeout: 5000 });
        await mouseClick(page, el);
        opened = true;
        console.log(`  opened via: ${sel}`);
        break;
      } catch {}
    }
    if (!opened) throw new Error('Could not open composer');
    await actionPause(page, 'composer opened');

    // ── Click Photo/video to reveal file inputs ─────────────────────────────
    console.log('Clicking Photo/video...');
    let pvBtn = null;
    for (const sel of [
      '[role="dialog"] [aria-label*="Photo" i]',
      '[role="dialog"] button:has-text("Photo/video")',
      '[aria-label="Photo/video"]',
    ]) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) { pvBtn = el; break; }
    }
    if (!pvBtn) throw new Error('Photo/video button not found');
    await mouseClick(page, pvBtn);
    await actionPause(page, 'Photo/video clicked');

    // ── Attach video via second file input (the one that accepts video) ─────
    console.log(`Attaching video: ${videoPath}`);
    let attached = false;
    for (const sel of [
      'input[type="file"][accept*="video"]',
      'input[type="file"][accept*="mp4"]',
      'input[type="file"]',
    ]) {
      const fi = page.locator(sel).first();
      if (await fi.count() > 0) {
        try {
          await fi.setInputFiles(videoPath);
          console.log(`  attached via: ${sel}`);
          attached = true;
          break;
        } catch (e) { console.log(`  ${sel} failed: ${e.message}`); }
      }
    }
    if (!attached) throw new Error('Could not attach video');

    // ── Wait for upload to reach 100% ───────────────────────────────────────
    console.log('Waiting for upload 100%...');
    try {
      await page.waitForFunction(() => document.body.innerText.includes('100%'), { timeout: 600000 });
      console.log('  100% ✓');
    } catch { console.log('  100% signal not seen — continuing'); }

    // ── Copyright check ─────────────────────────────────────────────────────
    console.log('Waiting for copyright check to clear...');
    for (let i = 0; i < 60; i++) {
      const txt = await page.evaluate(() => document.body.innerText.toLowerCase());
      if (!txt.includes('checking for copyrighted')) break;
      await page.waitForTimeout(2000);
    }
    await actionPause(page, 'after upload');

    // ── Type caption ────────────────────────────────────────────────────────
    console.log(`Typing caption (${caption.length} chars) at 60–150ms/char...`);
    try {
      const body = page.locator('div[contenteditable="true"][role="textbox"]').first();
      await body.waitFor({ state: 'visible', timeout: 10000 });
      await body.evaluate(el => el.click());
      await page.waitForTimeout(rnd(500, 1200));
      await typeHuman(page, caption);
      console.log('  caption typed ✓');
    } catch (e) { console.log(`  caption skipped: ${e.message}`); }
    await actionPause(page, 'after caption');

    // ── Pre-post human pause ────────────────────────────────────────────────
    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before wizard');

    // ── Wizard loop: snapshot, then either click final or click Next ────────
    const FINAL_LABELS = ['Share now', 'Post', 'Publish', 'Share', 'Done'];

    let posted = false;
    for (let step = 1; step <= 12; step++) {
      const state = await snapshot(page, `step${step}_state`);

      // Look for any final-submit button in dialog
      let finalLabel = null;
      for (const lbl of FINAL_LABELS) {
        const found = state.buttons.find(b => !b.disabled && (b.aria === lbl || b.text === lbl));
        if (found) { finalLabel = lbl; break; }
      }

      if (finalLabel) {
        console.log(`\n→ Final button "${finalLabel}" found on step ${step} — clicking`);
        const result = await clickByLabelInDialog(page, finalLabel);
        console.log(`  click result: ${JSON.stringify(result)}`);
        if (result.ok) {
          await actionPause(page, 'after final click');
          posted = true;
          await snapshot(page, `step${step}_after_final`);
          break;
        }
      }

      // No final button — try clicking Next
      const nextEnabled = state.buttons.find(b => !b.disabled && (b.aria === 'Next' || b.text === 'Next'));
      if (!nextEnabled) {
        console.log(`\n→ No Next button and no final button at step ${step}. Stopping.`);
        break;
      }

      console.log(`\n→ Clicking Next (step ${step})`);
      const r = await clickByLabelInDialog(page, 'Next');
      console.log(`  click result: ${JSON.stringify(r)}`);
      await actionPause(page, `after Next ${step}`);
    }

    if (!posted) {
      await snapshot(page, 'FAILED_final_state');
      throw new Error('Wizard did not reach final submit button');
    }

    // ── Dismiss upsell dialogs ──────────────────────────────────────────────
    for (const label of ['Not now', 'No thanks', 'Maybe later', 'Skip']) {
      try {
        const btn = page.getByRole('button', { name: label, exact: true }).first();
        if (await btn.isVisible()) {
          console.log(`Dismissing upsell: ${label}`);
          await btn.click();
          await page.waitForTimeout(rnd(1500, 2500));
          break;
        }
      } catch {}
    }

    // ── Wait for posting to complete ────────────────────────────────────────
    console.log('\nWaiting for "Posting" to clear...');
    let submitted = false;
    for (let i = 0; i < 120; i++) {
      await page.waitForTimeout(1000);
      const txt = (await page.evaluate(() => document.body.innerText)).toLowerCase();
      if (!txt.includes('posting') && !txt.includes('reel settings') && !txt.includes('uploading')) {
        submitted = true;
        console.log('  Submitted ✓');
        break;
      }
    }

    // ── Capture URL from Videos tab ─────────────────────────────────────────
    console.log('\nCapturing video URL from /videos tab...');
    let videoUrl = null;
    try {
      await page.goto(`https://www.facebook.com/${FB_PAGE}/videos`, { waitUntil: 'domcontentloaded' });
      await longWait(page, VIDEOS_TAB_WAIT_MIN, VIDEOS_TAB_WAIT_MAX, 'videos tab settle');
      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map(a => a.href.split('?')[0])
          .filter(h => (h.includes('/videos/') || h.includes('/reel/')) && h.includes('facebook.com')
            && !h.endsWith('/videos') && !h.endsWith('/videos/') && !h.endsWith('/reel/'))
          .filter((h, i, arr) => arr.indexOf(h) === i)
          .slice(0, 3)
      );
      console.log(`  Recent video URLs: ${JSON.stringify(links)}`);
      if (links.length) videoUrl = links[0];
    } catch (e) { console.log(`  URL fetch error: ${e.message}`); }

    // ── Post-publish verification ───────────────────────────────────────────
    // Navigate to the captured URL and confirm the page loads with a video.
    // Without this check, the script can mark "posted" even when Facebook
    // queued the upload and silently dropped it.
    let verified = false;
    if (videoUrl) {
      console.log(`\nVerifying live post: ${videoUrl}`);
      try {
        const resp = await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const status = resp ? resp.status() : 0;
        console.log(`  HTTP ${status}`);
        await page.waitForTimeout(rnd(3500, 5500));

        const hasPlayer = await page.evaluate(() => {
          // Look for any media element or Facebook video player container
          if (document.querySelector('video')) return 'video';
          if (document.querySelector('[data-video-id], [data-pagelet*="video" i]')) return 'player-container';
          // og:video meta tag is also a strong signal
          const og = document.querySelector('meta[property="og:video"], meta[property="og:video:url"]');
          if (og) return 'og:video';
          return null;
        });
        console.log(`  Player signal: ${hasPlayer || 'none'}`);

        if (status >= 200 && status < 400 && hasPlayer) {
          verified = true;
          console.log('  Verified live ✓');
        } else {
          console.log('  Could not verify — post may not be live');
        }
      } catch (e) {
        console.log(`  Verification error: ${e.message}`);
      }
    } else {
      console.log('  Skipping verification — no URL captured');
    }

    short.platforms[PLATFORM].status    = (submitted && verified) ? 'posted' : 'failed';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = videoUrl;
    if (!submitted) short.platforms[PLATFORM].error = 'posting spinner did not clear';
    else if (!verified) short.platforms[PLATFORM].error = `URL captured but verification failed: ${videoUrl}`;
    else delete short.platforms[PLATFORM].error;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

    if (submitted && verified) console.log(`\nDone ✓  URL: ${videoUrl}`);
    else console.log(`\nUncertain — verify manually. URL: ${videoUrl || '(not captured)'}`);

  } catch (err) {
    short.platforms[PLATFORM].status = 'failed';
    short.platforms[PLATFORM].error  = err.message;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
  }
})();
