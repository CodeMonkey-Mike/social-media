// upload-longform-bitchute.js — uploads a single longform video to BitChute.
// Reads metadata.json + video + thumbnail from C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\
// Adapted from post-bitchute-short.js with custom thumbnail file (vs Grab Thumbnail).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SOURCE_DIR     = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\longform';
const METADATA_FILE  = 'metadata.json';
// Video + thumbnail are auto-detected from SOURCE_DIR — drop any-named files in schedule-tweets/longform.
const VIDEO_EXTS     = ['.mp4', '.mov', '.webm', '.mkv'];
const THUMBNAIL_EXTS = ['.png', '.jpg', '.jpeg', '.webp'];

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\bitchutebot-profile';
const BITCHUTE_HOME  = 'https://www.bitchute.com/';
const MIN_FILE_SIZE  = 1_000_000;

const CHAR_DELAY_MIN  = 40;
const CHAR_DELAY_MAX  = 120;
const ACTION_MIN      = 3000;
const ACTION_MAX      = 6000;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Auto-detect the single video / thumbnail in SOURCE_DIR (most-recently-modified wins if several).
function pickFile(dir, exts, label) {
  const matches = fs.readdirSync(dir)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => ({ p: path.join(dir, f), name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (matches.length === 0) return null;
  if (matches.length > 1) console.log(`  Multiple ${label} files — using most recent: ${matches[0].name}`);
  else console.log(`  ${label}: ${matches[0].name}`);
  return matches[0].p;
}

async function actionPause(page, label = '') {
  const ms = rnd(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s${label ? ' (' + label + ')' : ''}`);
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
  const metaPath  = path.join(SOURCE_DIR, METADATA_FILE);
  const videoPath = pickFile(SOURCE_DIR, VIDEO_EXTS, 'video');
  const thumbPath = pickFile(SOURCE_DIR, THUMBNAIL_EXTS, 'thumbnail');

  if (!videoPath)               { console.error('No video file found in', SOURCE_DIR); process.exit(1); }
  if (!fs.existsSync(metaPath)) { console.error('Metadata not found:', metaPath); process.exit(1); }

  const fileSize = fs.statSync(videoPath).size;
  if (fileSize < MIN_FILE_SIZE) {
    console.error(`Video below 1MB minimum (${fileSize} bytes)`);
    process.exit(1);
  }
  const hasThumb = !!thumbPath;

  const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const title = (metadata.title || '').trim();
  const description = (metadata.description || '').trim();
  const tags = metadata.tags || [];
  // BitChute: max 3 search terms, space-separated, no #
  const searchTerms = tags.slice(0, 3).map(t => t.replace(/\s+/g, '_')).join(' ');

  console.log(`\nLongform: "${title}"`);
  console.log(`File:  ${videoPath}`);
  console.log(`Size:  ${(fileSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Thumb: ${hasThumb ? thumbPath : '(none)'}`);
  console.log(`Description: ${description.length} chars`);
  console.log(`Search terms: ${searchTerms}`);

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
    console.log(`Navigating to ${BITCHUTE_HOME}...`);
    await page.goto(BITCHUTE_HOME, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log(`  Landed: ${page.url()}`);

    await closeDrawer(page);

    console.log('Waiting for upload icon (video_call) to confirm logged-in state...');
    try {
      await page.waitForFunction(() => {
        return !![...document.querySelectorAll('button')].find(
          b => b.innerText?.trim().includes('video_call')
        );
      }, null, { timeout: 600000 });
      console.log('  Logged in ✓');
      await page.waitForTimeout(1500);
      await closeDrawer(page);
    } catch {
      throw new Error('Timed out waiting for upload icon — sign in to BitChute and retry.');
    }

    await closeDrawer(page);
    await page.waitForTimeout(500);

    console.log('Clicking upload button (video_call icon)...');
    const uploadIcon = page.locator('button:has-text("video_call")').first();
    await uploadIcon.waitFor({ state: 'attached', timeout: 10000 });
    await uploadIcon.evaluate(el => el.click());
    console.log('  Upload icon clicked ✓');
    await page.waitForTimeout(800);

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

    console.log(`Attaching video (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);
    const videoInput = uploadPage.locator('input[type="file"]').nth(0);
    await videoInput.waitFor({ state: 'attached', timeout: 20000 });
    await videoInput.setInputFiles(videoPath);
    console.log('  Video attached ✓');
    await uploadPage.waitForTimeout(2000);

    // Title
    console.log(`Typing title (${title.length} chars)...`);
    const titleEl = uploadPage.locator('input[placeholder="Title"]').first();
    await titleEl.waitFor({ state: 'visible', timeout: 15000 });
    await typeHuman(uploadPage, titleEl, title);
    console.log('  Title typed ✓');
    await actionPause(uploadPage, 'after title');

    // Description
    console.log(`Typing description (${description.length} chars)...`);
    const descEl = uploadPage.locator('textarea').first();
    await descEl.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(uploadPage, descEl, description);
    console.log('  Description typed ✓');
    await actionPause(uploadPage, 'after description');

    // Search terms
    console.log(`Typing search terms: ${searchTerms}`);
    const tagsEl = uploadPage.locator('input[placeholder="Search Terms"]').first();
    await tagsEl.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(uploadPage, tagsEl, searchTerms);
    console.log('  Search terms typed ✓');
    await actionPause(uploadPage, 'after tags');

    // Custom thumbnail (second file input on the page)
    if (hasThumb) {
      console.log(`Attaching custom thumbnail: ${thumbPath}`);
      try {
        const thumbInput = uploadPage.locator('input[type="file"]').nth(1);
        await thumbInput.waitFor({ state: 'attached', timeout: 10000 });
        await thumbInput.setInputFiles(thumbPath);
        console.log('  Thumbnail attached ✓');
      } catch (e) {
        console.log(`  Warning: thumbnail attach failed (${e.message.split('\n')[0]}) — falling back to Grab Thumbnail`);
        try {
          const videoEl = uploadPage.locator('video').first();
          await videoEl.evaluate(el => { el.currentTime = 1; });
          await uploadPage.waitForTimeout(500);
          await uploadPage.getByRole('button', { name: 'Grab Thumbnail' }).click({ timeout: 5000 });
        } catch {}
      }
      await actionPause(uploadPage, 'after thumbnail');
    }

    // Wait for upload + Proceed enabled (longform 389MB may take a while)
    console.log('Waiting for upload to finish (Proceed enabled)...');
    const proceedBtn = uploadPage.getByRole('button', { name: 'Proceed' }).first();
    await proceedBtn.waitFor({ state: 'visible', timeout: 30000 });

    for (let i = 0; i < 1800; i++) { // up to 15 min for the 389MB upload
      const disabled = await proceedBtn.getAttribute('disabled');
      const ariaDisabled = await proceedBtn.getAttribute('aria-disabled');
      if (disabled === null && ariaDisabled !== 'true') break;
      await uploadPage.waitForTimeout(500);
    }
    console.log('  Proceed button enabled ✓');

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

    // Longform BitChute uses a SINGLE-page form with one Proceed button (not
    // the two-step wizard from shorts). Ensure "Publish right away" is checked,
    // then click Proceed via JS .click() to actually trigger form submit
    // (Playwright's pointer click sometimes doesn't fire BitChute's handler).

    // Verify Publish checkbox is checked (it usually is by default)
    try {
      const publishCb = uploadPage.locator('input#publish').first();
      await publishCb.waitFor({ state: 'attached', timeout: 5000 });
      const checked = await publishCb.isChecked();
      if (!checked) {
        await uploadPage.locator('label[for="publish"]').click();
        console.log('  Publish right away — toggled ON ✓');
      } else {
        console.log('  Publish right away — already checked ✓');
      }
    } catch {
      console.log('  Warning: publish checkbox not found via #publish — proceeding');
    }
    await uploadPage.waitForTimeout(800);

    // Capture URL before Proceed so we can detect navigation
    const urlBefore = uploadPage.url();
    console.log(`  URL before Proceed: ${urlBefore}`);

    // CRITICAL: must use Playwright's CDP-level click (real browser event), NOT
    // form.submit() and NOT el.click() via evaluate. Native form submit bypasses
    // BitChute's JavaScript upload handler and submits empty form data → 500.
    // The shorts script's .click() works because it fires a true mouse event.
    let urlAfter = urlBefore;

    // Strategy 1: Playwright .click() — same as the (working) shorts script
    console.log('  Trying Playwright .click()...');
    try {
      const proceedBtn = uploadPage.locator('button.btn.btn-primary[type="submit"]').first();
      await proceedBtn.waitFor({ state: 'visible', timeout: 5000 });
      await proceedBtn.click({ timeout: 10000 });
      console.log('  Playwright .click() ✓');
    } catch (e) {
      console.log(`  Playwright .click() failed: ${e.message.split('\n')[0]}`);
    }
    await uploadPage.waitForTimeout(3000);
    urlAfter = uploadPage.url();
    console.log(`  URL after Playwright click: ${urlAfter !== urlBefore ? '(changed)' : '(unchanged)'}`);

    // Strategy 2: Playwright .click({ force: true }) — bypasses actionability checks
    if (urlAfter === urlBefore) {
      console.log('  Trying Playwright .click({ force: true })...');
      try {
        await uploadPage.locator('button.btn.btn-primary[type="submit"]').first().click({ force: true, timeout: 5000 });
        console.log('  Force-click ✓');
      } catch (e) {
        console.log(`  Force-click failed: ${e.message.split('\n')[0]}`);
      }
      await uploadPage.waitForTimeout(3000);
      urlAfter = uploadPage.url();
      console.log(`  URL after force-click: ${urlAfter !== urlBefore ? '(changed)' : '(unchanged)'}`);
    }

    // Strategy 3: mouse.click() at the button's coordinates — most "real" event
    if (urlAfter === urlBefore) {
      console.log('  Trying mouse.click() at button coords...');
      try {
        const btn = uploadPage.locator('button.btn.btn-primary[type="submit"]').first();
        const box = await btn.boundingBox();
        if (box) {
          await uploadPage.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          console.log(`  mouse.click() at (${box.x + box.width/2}, ${box.y + box.height/2}) ✓`);
        } else {
          console.log('  No bounding box — cannot mouse-click');
        }
      } catch (e) {
        console.log(`  mouse.click() failed: ${e.message.split('\n')[0]}`);
      }
      await uploadPage.waitForTimeout(3000);
      urlAfter = uploadPage.url();
      console.log(`  URL after mouse.click(): ${urlAfter !== urlBefore ? '(changed)' : '(unchanged)'}`);
    }

    if (urlAfter === urlBefore) {
      console.log('  WARNING: URL did not change on first attempt — entering retry-click loop.');
      console.log('  (Proceed button is enabled but BitChute ignores clicks until the file upload finishes.)');
      console.log('  Will re-click every 30s until URL changes or 15-min timeout.');
    }

    // RETRY LOOP: re-click Proceed every 30s until URL changes.
    // BitChute's Proceed button becomes "enabled" (no disabled attr) as soon
    // as form fields are filled, but the click is a silent no-op until the
    // actual file upload finishes. We poll-and-click until it lands.
    const retryStart = Date.now();
    const retryMaxMs = 15 * 60 * 1000;
    while (urlAfter === urlBefore && Date.now() - retryStart < retryMaxMs) {
      await uploadPage.waitForTimeout(30000);
      try {
        await uploadPage.locator('button.btn.btn-primary[type="submit"]').first().click({ timeout: 5000 });
        console.log(`  [retry] Proceed re-clicked at +${Math.round((Date.now()-retryStart)/1000)}s`);
      } catch (e) {
        console.log(`  [retry] Click failed: ${e.message.split('\n')[0]}`);
      }
      await uploadPage.waitForTimeout(2000);
      urlAfter = uploadPage.url();
      if (urlAfter !== urlBefore) {
        console.log(`  [retry] URL CHANGED → ${urlAfter}`);
        break;
      }
    }

    // CRITICAL: for large files, the redirect to /content can take 10+ minutes
    // (BitChute does post-Proceed encoding/processing). Wait up to 15 min, then
    // add a 30s buffer for any final page transition before closing.
    console.log('Waiting for /content redirect (up to 15 min for large files)...');
    try {
      await uploadPage.waitForURL('**/content**', { timeout: 15 * 60 * 1000 });
      console.log('  Redirected to /content ✓');
    } catch {
      console.log('  Warning: no /content redirect — submission may still have gone through');
    }
    console.log('Waiting 30s for any final page transition...');
    await uploadPage.waitForTimeout(30000);

    console.log(`\nPosted (processing): https://www.bitchute.com/content`);
    console.log('Done ✓');
    console.log('\nLeaving browser open 5 min for inspection. Ctrl+C to close sooner.');
    await uploadPage.waitForTimeout(5 * 60 * 1000);

  } catch (err) {
    console.error('\nFailed:', err.message);
    console.error('\nLeaving browser open 5 min for inspection. Ctrl+C to close sooner.');
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    process.exit(1);
  } finally {
    try { await context.close(); } catch {}
  }
})();
