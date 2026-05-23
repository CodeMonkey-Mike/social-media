// post-bitchute-short.js — uploads one pending BitChute video from data/shorts.json
// Uses bitchutebot-profile via launchPersistentContext with real Chrome.
// Adapted from C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\bitchute_upload.py.
//
// NOTE: Python reference uses Camoufox (fingerprint-patched Firefox) to bypass
// BitChute's bot-detection CAPTCHA. We try regular Chrome first. If we hit
// a CAPTCHA challenge, we may need to switch runtimes.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const BITCHUTE_HOME  = 'https://www.bitchute.com/';
const PLATFORM       = 'bitchute';
const MIN_FILE_SIZE  = 1_000_000; // 1 MB — BitChute hard minimum

// Human-like delays matching X/IG/Rumble pattern
const CHAR_DELAY_MIN  = 40;
const CHAR_DELAY_MAX  = 120;
const ACTION_MIN      = 3000;
const ACTION_MAX      = 6000;
const PRE_COMPOSE_MIN = 10000;
const PRE_COMPOSE_MAX = 25000;

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

async function typeHuman(page, locator, text) {
  await locator.click();
  await page.waitForTimeout(rnd(200, 500));
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

async function closeDrawer(page) {
  // Close BitChute's side drawer if open. Don't toggle if already closed —
  // clicking the menu would re-open it.
  try {
    const backdrop = page.locator('.q-drawer__backdrop').first();
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      if (await backdrop.isVisible()) {
        await backdrop.click();
        await page.waitForTimeout(600);
      }
    }
  } catch {}
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  for (const s of data.shorts) {
    if (s.platforms[PLATFORM]?.status === 'posting') {
      s.platforms[PLATFORM].status = 'pending';
    }
  }

  // BitChute isn't in the default schema — add it if missing
  for (const s of data.shorts) {
    if (!s.platforms[PLATFORM]) {
      s.platforms[PLATFORM] = {
        status: 'pending',
        posted_at: null,
        url: null,
        views: null,
        views_captured_at: null,
        caption_override: null,
      };
    }
  }

  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');
  if (!short) { console.log('No pending BitChute shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  const fileSize = fs.statSync(videoPath).size;
  if (fileSize < MIN_FILE_SIZE) {
    console.error(`Video below BitChute 1MB minimum (${fileSize} bytes). Skipping.`);
    short.platforms[PLATFORM].status = 'skip';
    short.platforms[PLATFORM].error = `Below 1MB minimum (${fileSize} bytes)`;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const title = (short.title || '').trim();
  const description = (short.platforms[PLATFORM].caption_override || short.caption).trim();
  // BitChute: max 3 search terms, space-separated, no #
  const searchTerms = (short.tags || []).slice(0, 3).map(t => t.replace(/\s+/g, '_')).join(' ');

  console.log(`\nShort: "${title}"`);
  console.log(`File:  ${videoPath} (${(fileSize / 1024 / 1024).toFixed(1)} MB, ${short.duration_seconds}s)`);
  console.log(`Description: ${description.length} chars`);
  console.log(`Search terms: ${searchTerms}`);

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  console.log('\nLaunching Chrome...');
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    // ── Navigate to BitChute ─────────────────────────────────────────────────
    console.log(`Navigating to ${BITCHUTE_HOME}...`);
    await page.goto(BITCHUTE_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log(`  Landed: ${page.url()}`);

    await closeDrawer(page);

    // ── Login check ─────────────────────────────────────────────────────────
    // The ONLY reliable "logged in" signal is the video_call upload icon.
    // We wait up to 10 minutes for it to appear, giving plenty of time
    // for manual sign-in if needed.
    console.log('Waiting for upload icon (video_call) to confirm logged-in state...');
    console.log('If not signed in, sign in to BitChute in the Chrome window.');
    try {
      await page.waitForFunction(() => {
        return !![...document.querySelectorAll('button')].find(
          b => b.innerText?.trim().includes('video_call')
        );
      }, { timeout: 600000 }); // 10 min
      console.log('  Logged in ✓ (upload icon visible)');
      await page.waitForTimeout(1500);
      await closeDrawer(page);
    } catch {
      throw new Error('Timed out waiting for upload icon — sign in to BitChute and retry.');
    }

    // ── Click the +Video icon ────────────────────────────────────────────────
    await closeDrawer(page);
    await page.waitForTimeout(500);

    console.log('Clicking upload button (video_call icon)...');
    const uploadIcon = page.locator('button:has-text("video_call")').first();
    await uploadIcon.waitFor({ state: 'attached', timeout: 10000 });
    await uploadIcon.evaluate(el => el.click());
    console.log('  Upload icon clicked ✓');
    await page.waitForTimeout(800);

    // ── Click "Upload Video" in dropdown — opens a new tab ───────────────────
    console.log('Clicking "Upload Video" dropdown item...');
    const uploadVideoEl = page.getByText('Upload Video', { exact: true }).first();
    try {
      await uploadVideoEl.waitFor({ state: 'visible', timeout: 10000 });
    } catch {}

    const [uploadPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      uploadVideoEl.evaluate(el => el.click()),
    ]);
    await uploadPage.waitForLoadState('domcontentloaded');
    console.log(`  Upload page: ${uploadPage.url()}`);
    await actionPause(uploadPage, 'upload page loaded');

    // ── Attach the video ────────────────────────────────────────────────────
    console.log(`Attaching video...`);
    const videoInput = uploadPage.locator('input[type="file"]').nth(0);
    await videoInput.waitFor({ state: 'attached', timeout: 20000 });
    await videoInput.setInputFiles(videoPath);
    console.log('  Video attached ✓');
    await uploadPage.waitForTimeout(2000);

    // ── Fill title ──────────────────────────────────────────────────────────
    console.log(`Typing title (${title.length} chars)...`);
    const titleEl = uploadPage.locator('input[placeholder="Title"]').first();
    await titleEl.waitFor({ state: 'visible', timeout: 15000 });
    await typeHuman(uploadPage, titleEl, title);
    console.log('  Title typed ✓');
    await actionPause(uploadPage, 'after title');

    // ── Fill description ────────────────────────────────────────────────────
    console.log(`Typing description (${description.length} chars)...`);
    const descEl = uploadPage.locator('textarea').first();
    await descEl.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(uploadPage, descEl, description);
    console.log('  Description typed ✓');
    await actionPause(uploadPage, 'after description');

    // ── Fill search terms ───────────────────────────────────────────────────
    console.log(`Typing search terms: ${searchTerms}`);
    const tagsEl = uploadPage.locator('input[placeholder="Search Terms"]').first();
    await tagsEl.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(uploadPage, tagsEl, searchTerms);
    console.log('  Search terms typed ✓');
    await actionPause(uploadPage, 'after tags');

    // ── Thumbnail: try Grab Thumbnail at 0:01 ────────────────────────────────
    console.log('Grabbing thumbnail at 0:01...');
    try {
      const videoEl = uploadPage.locator('video').first();
      await videoEl.evaluate(el => { el.currentTime = 1; });
      await uploadPage.waitForTimeout(500);
      await uploadPage.getByRole('button', { name: 'Grab Thumbnail' }).click({ timeout: 5000 });
      console.log('  Thumbnail grabbed ✓');
    } catch {
      console.log('  Warning: could not grab thumbnail — continuing');
    }
    await actionPause(uploadPage, 'after thumbnail');

    // ── Wait for upload to finish (Proceed enabled), then click Proceed ─────
    console.log('Waiting for upload to finish (Proceed button enabled)...');
    const proceedBtn = uploadPage.getByRole('button', { name: 'Proceed' }).first();
    await proceedBtn.waitFor({ state: 'visible', timeout: 30000 });

    // Poll for enabled state (up to 15 min)
    for (let i = 0; i < 1800; i++) {
      const disabled = await proceedBtn.getAttribute('disabled');
      const ariaDisabled = await proceedBtn.getAttribute('aria-disabled');
      if (disabled === null && ariaDisabled !== 'true') break;
      await uploadPage.waitForTimeout(500);
    }
    console.log('  Proceed button enabled ✓');

    // Retry once if BitChute reports an upload error
    try {
      const errMsg = uploadPage.locator('text=/Error during upload/i').first();
      if (await errMsg.isVisible()) {
        console.log('  Upload error detected — clicking retry...');
        const retryBtn = uploadPage.locator('[title*="retry" i], [aria-label*="retry" i]').first();
        await retryBtn.click();
        await uploadPage.waitForTimeout(5000);
        await proceedBtn.waitFor({ state: 'visible', timeout: 900000 });
      }
    } catch {}

    await proceedBtn.click();
    console.log('  First Proceed clicked ✓');
    await uploadPage.waitForTimeout(1500);

    // ── Check "Publish Right Away" then click second Proceed ─────────────────
    try {
      const publishLabel = uploadPage.locator('label:has-text("Publish Right Away")').first();
      await publishLabel.waitFor({ state: 'visible', timeout: 8000 });
      const cbFor = await publishLabel.getAttribute('for');
      let cb;
      if (cbFor) cb = uploadPage.locator(`input#${cbFor}`);
      else cb = publishLabel.locator('input[type="checkbox"]').first();
      if (!await cb.isChecked()) {
        await publishLabel.click();
        console.log('  Publish Right Away checked ✓');
      } else {
        console.log('  Publish Right Away already checked ✓');
      }
      await uploadPage.waitForTimeout(500);

      const proceedBtn2 = uploadPage.getByRole('button', { name: 'Proceed' }).first();
      await proceedBtn2.click();
      console.log('  Second Proceed clicked ✓');
    } catch (e) {
      console.log(`  No publish checkbox found (${e.message.split('\n')[0]}) — assuming single Proceed flow`);
    }

    // ── Wait for /content redirect ──────────────────────────────────────────
    console.log('Waiting for /content redirect...');
    try {
      await uploadPage.waitForURL('**/content**', { timeout: 120000 });
      console.log('  Redirected to /content ✓');
    } catch {
      console.log('  Warning: no /content redirect — submission may still have gone through');
    }

    // BitChute encoding is async — submission is "processing" state
    const url = 'https://www.bitchute.com/content';
    console.log(`\nPosted (processing): ${url}`);

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
    try { await context.close(); } catch {}
  }
})();
