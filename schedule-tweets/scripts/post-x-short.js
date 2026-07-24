// post-x-short.js — uploads one pending short to X from data/shorts.json
// Same pattern as post-tweet.js: launchPersistentContext with xbot-profile.
// Videos are attached via the hidden fileInput; X processes them before posting.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { stripHashtags, buildCaption } = require('./lib/strip-hashtags');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const PLATFORM       = 'x';

const CHAR_DELAY_MIN  = 60;
const CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 4000;
const ACTION_MAX      = 7000;
const PRE_COMPOSE_MIN = +(process.env.XS_PRE_COMPOSE_MIN || 60000);
const PRE_COMPOSE_MAX = +(process.env.XS_PRE_COMPOSE_MAX || 180000);

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function actionPause(page, label = '') {
  const ms = rnd(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s${label ? ' (' + label + ')' : ''}`);
  await page.waitForTimeout(ms);
}

async function longWait(page, min, max, label = '') {
  const ms = rnd(min, max);
  console.log(`  waiting ${Math.round(ms / 1000)}s${label ? ' (' + label + ')' : ''}...`);
  await page.waitForTimeout(ms);
}

async function mouseClick(page, locator) {
  const bbox = await locator.boundingBox();
  if (bbox && bbox.width > 0) {
    await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
  } else {
    await locator.click();
  }
}

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

(async () => {
  // ── Pick next pending short for X ─────────────────────────────────────────
  const data  = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');

  if (!short) { console.log('No pending X shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  const caption = buildCaption(short.caption, short.tags, PLATFORM);

  // X has a 280 char limit — warn if caption is over
  if (caption.length > 280) {
    console.warn(`Warning: caption is ${caption.length} chars (> 280). X may truncate or reject.`);
  }

  console.log(`\nShort: "${short.title}"`);
  console.log(`File:  ${videoPath} (${short.duration_seconds}s)`);
  console.log(`Caption: ${caption.length} chars (hashtags stripped)`);

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  // ── Launch Chrome ──────────────────────────────────────────────────────────
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

  const page = browser.pages()[0] || await browser.newPage();

  try {
    // ── Load home feed ─────────────────────────────────────────────────────
    await page.goto('https://x.com/home');
    await page.waitForLoadState('load');

    const state = await Promise.race([
      page.waitForSelector('[data-testid="primaryColumn"]',  { timeout: 30000 }).then(() => 'home'),
      page.waitForSelector('input[autocomplete="username"]', { timeout: 30000 }).then(() => 'login'),
    ]).catch(() => 'unknown');

    if (state !== 'home') throw new Error(`X home feed not loaded (state: ${state}). Check xbot-profile.`);
    console.log('Home feed loaded.');

    // ── Pre-compose wait ───────────────────────────────────────────────────
    console.log('Pre-compose wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    // ── Open composer ──────────────────────────────────────────────────────
    const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
    await mouseClick(page, composeBtn);
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
    await actionPause(page, 'composer open');

    // ── Attach video ───────────────────────────────────────────────────────
    console.log('Attaching video...');
    const fileInput = page.locator('input[data-testid="fileInput"]').first();
    if (await fileInput.count() === 0) throw new Error('fileInput not found in composer.');
    await fileInput.setInputFiles(videoPath);
    console.log('  Video set — waiting for processing...');

    // Wait for X to process the video (progress bar appears then disappears)
    // X shows [data-testid="progressBar"] while processing
    try {
      await page.waitForSelector('[data-testid="progressBar"], [role="progressbar"]', { timeout: 15000 });
      console.log('  Processing started...');
      await page.waitForFunction(() => {
        const bar = document.querySelector('[data-testid="progressBar"], [role="progressbar"]');
        return !bar || bar.getAttribute('aria-valuenow') === '100' ||
               getComputedStyle(bar).display === 'none';
      }, { timeout: 5 * 60 * 1000 });
      console.log('  Video processed ✓');
    } catch {
      // Progress bar may not appear for small files — check for thumbnail instead
      try {
        await page.waitForSelector('[data-testid="attachments"] video, [data-testid="attachments"] [role="img"]',
          { timeout: 30000 });
        console.log('  Video attached (thumbnail visible) ✓');
      } catch {
        console.log('  Warning: could not confirm video processing — continuing');
      }
    }
    await actionPause(page, 'after video attach');

    // ── Type caption ───────────────────────────────────────────────────────
    const textarea = page.locator('[data-testid="tweetTextarea_0"]').first();
    await textarea.click();
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(500);

    console.log(`Typing caption (${caption.length} chars)...`);
    await typeHuman(page, caption);
    await page.waitForTimeout(1000);
    console.log('Caption typed ✓');
    await actionPause(page, 'after caption');

    // ── Pre-post wait ──────────────────────────────────────────────────────
    console.log('Pre-post wait...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before Post');

    // ── Post ───────────────────────────────────────────────────────────────
    const clicked = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('[data-testid="tweetButton"]')];
      const btn  = btns.find(b => b.offsetParent !== null &&
                                  b.getBoundingClientRect().width > 0 && !b.disabled);
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!clicked) throw new Error('Post button not found or disabled.');
    console.log('Post clicked. Waiting for confirmation...');

    // ── Grab URL from toast ────────────────────────────────────────────────
    const toast = page.locator('[data-testid="toast"]');
    await toast.waitFor({ timeout: 30000 });

    const url = await toast.evaluate(el => {
      const a = el.querySelector('a[href*="/status/"]');
      return a ? 'https://x.com' + a.getAttribute('href') : null;
    });

    if (url) {
      console.log(`\nPosted: ${url}`);
    } else {
      console.log('\nPosted — URL not captured from toast.');
    }

    // ── Update JSON ────────────────────────────────────────────────────────
    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = url;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.log('shorts.json updated. Done ✓');

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
