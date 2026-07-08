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
const { execFileSync } = require('child_process');
const { stripHashtags, buildCaption } = require('./lib/strip-hashtags');

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

// Scrape the logged-in /content (Studio) dashboard for {title, url, videoId}
// per video card. Used for both pre-upload duplicate check and post-upload
// URL capture. Defensive: walks the DOM trying multiple ways to associate a
// /video/<id>/ link with a visible title.
async function scrapeContentPage(page) {
  await page.goto(`${BITCHUTE_HOME.replace(/\/$/, '')}/content`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  try {
    await page.waitForFunction(() => {
      return document.querySelectorAll('a[href*="/video/"]').length > 0
        || /no videos|nothing here/i.test(document.body.innerText || '');
    }, { timeout: 20000 });
  } catch {}
  return await page.evaluate(() => {
    const items = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="/video/"]').forEach(a => {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/video\/([\w-]+)/);
      if (!m) return;
      const videoId = m[1];
      if (seen.has(videoId)) return;
      let title = (a.innerText || '').trim();
      let node = a;
      for (let i = 0; i < 8 && !title && node?.parentElement; i++) {
        node = node.parentElement;
        const h = node.querySelector && node.querySelector('h1, h2, h3, h4, h5, .title, [class*="title"]');
        if (h && h.innerText) { title = h.innerText.trim(); break; }
      }
      if (!title) title = (a.getAttribute('title') || a.getAttribute('aria-label') || '').trim();
      if (!title) return;
      const url = href.startsWith('http') ? href : `https://www.bitchute.com${href}`;
      items.push({ videoId, title, url });
      seen.add(videoId);
    });
    return items;
  });
}

function findByTitle(items, target) {
  const norm = s => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const t = norm(target);
  return items.find(it => norm(it.title) === t);
}

// Resolve a thumbnail IMAGE file to upload to BitChute's custom-thumbnail input.
// BitChute's in-browser "Grab Thumbnail" frame-capture is unreliable for some
// clips (it silently fails to register → missing-thumbnail modal → failed
// publish). Uploading a real JPG to input[name="thumbnailInput"] is the robust
// path. Prefer short.thumbnail_path; otherwise extract frame 0 (the designed
// cover used on the other platforms) with ffmpeg, next to the video as
// <basename>-thumb.jpg. Returns an absolute path, or null if we can't make one.
function ensureThumbFile(short, videoPath) {
  try {
    if (short.thumbnail_path) {
      const p = path.join(WORKSPACE_ROOT, short.thumbnail_path);
      if (fs.existsSync(p)) return p;
    }
    const dir  = path.dirname(videoPath);
    const base = path.basename(videoPath, path.extname(videoPath));
    const out  = path.join(dir, `${base}-thumb.jpg`);
    if (!fs.existsSync(out)) {
      execFileSync('ffmpeg', ['-y', '-i', videoPath, '-frames:v', '1', '-q:v', '2', out], { stdio: 'ignore' });
    }
    return fs.existsSync(out) ? out : null;
  } catch (e) {
    console.log(`  ⚠ Could not prepare a custom thumbnail (${e.message.split('\n')[0]}) — will fall back to Grab Thumbnail.`);
    return null;
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

  // Bail if anything is stuck in 'posting' — those need manual review. The
  // previous auto-reset behavior caused duplicate uploads when a prior run
  // succeeded on BitChute but died before flipping the JSON to 'posted'.
  const stuck = data.shorts.filter(s => s.platforms[PLATFORM]?.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} short(s) stuck in 'posting' — manual review required:`);
    for (const s of stuck) console.error(`  - ${s.id}: ${s.title}`);
    console.error(`Check BitChute /content to see if any actually published, then update data/shorts.json before retrying.`);
    process.exit(2);
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
  const description = buildCaption(short.platforms[PLATFORM].caption_override || short.caption, short.tags, PLATFORM);
  // BitChute: max 3 search terms, space-separated, no #.
  // BitChute's Search Terms field rejects anything but letters A-Z ("Only use letters A to Z"),
  // and that validation popup is misread by our publish flow as the "missing-thumbnail modal"
  // (it blocks the second Proceed). So DROP any tag that isn't pure letters (e.g. "ai16z") and
  // fall through to the next valid tag, rather than slicing the raw list. (Root-caused 2026-06-19:
  // the elizaos short failed both passes solely because of the "ai16z" tag's digits.)
  const searchTerms = (short.tags || [])
    .filter(t => /^[A-Za-z]+$/.test(t))
    .slice(0, 3)
    .join(' ');

  // Prepare a custom thumbnail image up front (ffmpeg frame-0 still, or thumbnail_path).
  const thumbPath = ensureThumbFile(short, videoPath);

  console.log(`\nShort: "${title}"`);
  console.log(`File:  ${videoPath} (${(fileSize / 1024 / 1024).toFixed(1)} MB, ${short.duration_seconds}s)`);
  console.log(`Description: ${description.length} chars`);
  console.log(`Search terms: ${searchTerms}`);
  console.log(`Thumbnail:   ${thumbPath || '(none — Grab Thumbnail fallback)'}`);

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

    // ── Pre-upload duplicate check ──────────────────────────────────────────
    // Scrape /content and look for a video already on the channel with the
    // same title. If found, mark posted with the real URL and skip upload.
    console.log('Checking /content for an existing copy of this title...');
    let preItems = [];
    try {
      preItems = await scrapeContentPage(page);
    } catch (e) {
      throw new Error(`Could not scrape /content for duplicate check: ${e.message}`);
    }
    console.log(`  Scraped ${preItems.length} item(s) from /content`);
    const preMatch = findByTitle(preItems, title);
    if (preMatch) {
      console.log(`Already on BitChute: ${preMatch.url}`);
      console.log(`  Matched title: "${preMatch.title}"`);
      short.platforms[PLATFORM].status    = 'posted';
      short.platforms[PLATFORM].posted_at = new Date().toISOString();
      short.platforms[PLATFORM].url       = preMatch.url;
      fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
      console.log('Marked as posted with real URL. Skipping upload.');
      await context.close();
      process.exit(0);
    }
    console.log('  No matching title — proceeding with upload.');
    await closeDrawer(page);

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
    const uploadPageUrl = uploadPage.url();
    console.log(`  Upload page: ${uploadPageUrl}`);
    // Capture the video id from the upload page's `upload_code` query param.
    // The published URL is deterministically https://www.bitchute.com/video/<upload_code>/
    // — much more reliable than scraping /content after publish.
    const uploadCodeMatch = uploadPageUrl.match(/[?&]upload_code=([\w-]+)/);
    const uploadCode = uploadCodeMatch ? uploadCodeMatch[1] : null;
    if (uploadCode) console.log(`  Captured upload_code: ${uploadCode}`);
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

    // ── Thumbnail: upload a custom image (reliable), Grab-Thumbnail fallback ──
    // PRIMARY: upload a real JPG to BitChute's dedicated thumbnail file input
    // (input[name="thumbnailInput"], a FilePond uploader accepting jpeg/png).
    // This avoids the flaky in-browser "Grab Thumbnail" frame-capture that
    // silently fails to register for some clips → missing-thumbnail modal →
    // failed publish (hit repeatedly on 2026-06-11). FALLBACK: the old
    // Grab-Thumbnail click, in case the custom input isn't present.
    async function uploadCustomThumbnail() {
      if (!thumbPath) return false;
      // Target the FilePond image file input specifically (the video input
      // accepts video/*; this one accepts image/*). After Proceed the visible
      // file input is replaced by a hidden input[name=thumbnailInput], so a
      // bare name selector is ambiguous — key on the file type + image accept.
      const fileInput = uploadPage.locator('input[type="file"][accept*="image"]').first();
      try {
        await fileInput.waitFor({ state: 'attached', timeout: 8000 });
        await fileInput.setInputFiles(thumbPath);
      } catch (e) {
        console.log(`    custom-thumbnail input not settable (${e.message.split('\n')[0]})`);
        return false;
      }
      // CRITICAL: wait for FilePond to finish UPLOADING the thumbnail to the
      // server, not just adding the file. The hidden input[name=thumbnailInput]
      // value is "undefined" until processing completes, then it holds the file
      // id — that flip is the real "thumbnail registered" signal. Clicking
      // Proceed before this is what triggers the missing-thumbnail modal.
      const ok = await uploadPage.waitForFunction(() => {
        const hidden = [...document.querySelectorAll('input[name="thumbnailInput"]')]
          .find(el => el.type === 'hidden');
        const v = hidden && hidden.value;
        if (v && v !== 'undefined' && v.trim() !== '') return true;
        // Fallback signal: FilePond item reached a completed processing state.
        const root = document.querySelector('input[type="file"][accept*="image"]')?.closest('.filepond--root');
        return !!(root && root.querySelector('.filepond--item[data-filepond-item-state*="complete"]'));
      }, { timeout: 60000 }).then(() => true).catch(() => false);
      await uploadPage.waitForTimeout(1000);
      if (!ok) console.log('    ⚠ thumbnail upload did not confirm processing-complete within 60s');
      return ok;
    }
    async function grabThumbnail() {
      try {
        const videoEl = uploadPage.locator('video').first();
        await videoEl.evaluate(el => { el.currentTime = 1; });
        await uploadPage.waitForTimeout(500);
        await uploadPage.getByRole('button', { name: 'Grab Thumbnail' }).click({ timeout: 5000 });
        await uploadPage.waitForTimeout(1200);
        return true;
      } catch {
        return false;
      }
    }
    // Set the thumbnail the reliable way first; fall back to Grab Thumbnail.
    async function ensureThumbnailRegistered() {
      if (await uploadCustomThumbnail()) return 'custom-upload';
      if (await grabThumbnail())        return 'grab-fallback';
      return 'none';
    }
    console.log('Setting thumbnail (custom image upload, Grab-Thumbnail fallback)...');
    console.log(`  Thumbnail set via: ${await ensureThumbnailRegistered()}`);
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

    // ── Proceed + publish, with missing-thumbnail self-recovery ──────────────
    // BitChute sometimes accepts the Grab Thumbnail click without registering a
    // thumbnail, then blocks publish with a "missing thumbnail" modal. The grab
    // log is NOT proof. Click through; if the modal appears, dismiss + re-grab +
    // retry (up to 3x). And NEVER mark posted without positive confirmation — a
    // bare no-redirect timeout used to silently false-mark posted, leaving the
    // video as an unpublished draft that nobody noticed. (Added 2026-06-02.)
    async function proceedAndPublish() {
      await proceedBtn.click();
      console.log('  First Proceed clicked ✓');
      await uploadPage.waitForTimeout(1500);
      try {
        const publishLabel = uploadPage.locator('label:has-text("Publish Right Away")').first();
        await publishLabel.waitFor({ state: 'visible', timeout: 8000 });
        const cbFor = await publishLabel.getAttribute('for');
        const cb = cbFor ? uploadPage.locator(`input#${cbFor}`) : publishLabel.locator('input[type="checkbox"]').first();
        if (!await cb.isChecked()) { await publishLabel.click(); console.log('  Publish Right Away checked ✓'); }
        else console.log('  Publish Right Away already checked ✓');
        await uploadPage.waitForTimeout(500);
        await uploadPage.getByRole('button', { name: 'Proceed' }).first().click();
        console.log('  Second Proceed clicked ✓');
      } catch (e) {
        console.log(`  No publish checkbox found (${e.message.split('\n')[0]}) — assuming single Proceed flow`);
      }
    }

    let published = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await proceedAndPublish();

      // Success = redirect to /content. Give it 45s per attempt.
      const redirected = await uploadPage.waitForURL('**/content**', { timeout: 45000 })
        .then(() => true).catch(() => false);
      if (redirected) { published = true; console.log('  Redirected to /content ✓'); break; }

      // No redirect: detect the missing-thumbnail modal and self-recover.
      const thumbErr = await uploadPage
        .locator('text=/missing thumbnail|thumbnail.*(required|missing)|try again/i')
        .first().isVisible({ timeout: 1500 }).catch(() => false);
      if (thumbErr) {
        console.log(`  ⚠ Missing-thumbnail modal (attempt ${attempt}/3) — dismissing + re-grabbing thumbnail...`);
        await uploadPage.keyboard.press('Escape').catch(() => {});
        await uploadPage.waitForTimeout(500);
        for (const sel of ['button:has-text("Try Again")', 'button:has-text("OK")', 'button:has-text("Close")', '.q-dialog button']) {
          const b = uploadPage.locator(sel).first();
          if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
        }
        await uploadPage.waitForTimeout(800);
        console.log(`    re-setting thumbnail via: ${await ensureThumbnailRegistered()}`);
        await uploadPage.waitForTimeout(1000);
        continue;
      }
      console.log('  No /content redirect and no thumbnail modal — will verify via /content scrape.');
      break;
    }

    // ── Success gate: confirm publish before marking posted ──────────────────
    // If we didn't see the redirect, scrape /content and require the title to be
    // actually present. Never optimistically mark posted on a bare timeout.
    if (!published) {
      console.log('Verifying publish via /content (title must be present)...');
      try {
        const items = await scrapeContentPage(uploadPage);
        if (findByTitle(items, title)) { published = true; console.log('  Found published video on /content ✓'); }
        else console.log('  Title NOT found on /content ✗');
      } catch (e) {
        console.log(`  /content verify failed: ${e.message}`);
      }
    }

    if (!published) {
      throw new Error('Publish not confirmed (missing-thumbnail modal or no /content redirect). The video uploaded as a DRAFT — publish it manually from BitChute Studio. Do NOT re-run this script (it would re-upload and duplicate).');
    }

    // ── Compose real video URL from upload_code ─────────────────────────────
    // BitChute video URLs are deterministically built from the upload_code
    // captured off the upload page URL. No scraping needed.
    let postedUrl;
    if (uploadCode) {
      postedUrl = `https://www.bitchute.com/video/${uploadCode}/`;
      console.log(`  Real URL from upload_code: ${postedUrl}`);
    } else {
      postedUrl = 'https://www.bitchute.com/content';
      console.log('  Warning: no upload_code captured — using /content placeholder');
    }

    console.log(`\nPosted (processing): ${postedUrl}`);

    // ── Liveness check: confirm the public video page actually resolves ───────
    // The /content confirm above proves BitChute accepted the publish, but a
    // belt-and-suspenders check fetches the public video URL and confirms its
    // og:title is the real title (a non-live / phantom URL returns the generic
    // "Bitchute"). The page is server-rendered, so a plain HTTP GET works (no
    // browser render needed). We wait + retry because the video is still
    // processing right after upload. If it never resolves we DON'T fail (the
    // publish was already confirmed) — we mark `posted_unverified` so it's
    // flagged for a manual look instead of silently trusted. (Added 2026-06-02
    // after a thumbnail glitch produced a phantom "posted" with a dead URL.)
    async function verifyLive(url, expectedTitle) {
      if (!uploadCode) { console.log('  Liveness: skipped (no upload_code URL).'); return false; }
      const norm = s => (s || '').toLowerCase()
        .replace(/&#0?39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ').trim();
      const want = norm(expectedTitle).slice(0, 25);
      const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
      const FIRST_WAIT_MS = 45000, TRIES = 6, RETRY_MS = 25000;
      console.log(`  Liveness: waiting ${FIRST_WAIT_MS / 1000}s for processing, then verifying public URL...`);
      await uploadPage.waitForTimeout(FIRST_WAIT_MS);
      for (let i = 1; i <= TRIES; i++) {
        try {
          const resp = await context.request.get(url, { timeout: 20000, headers: { 'User-Agent': UA } });
          const html = await resp.text();
          const m = html.match(/og:title"\s+content="([^"]*)"/i);
          const got = norm(m ? m[1] : '');
          if (got && got !== 'bitchute' && want && got.includes(want)) {
            console.log(`  Liveness ✓ (og:title = "${m[1]}")`);
            return true;
          }
          console.log(`  Liveness ${i}/${TRIES}: not live yet (og:title="${m ? m[1] : 'none'}")`);
        } catch (e) {
          console.log(`  Liveness ${i}/${TRIES} fetch error: ${e.message.split('\n')[0]}`);
        }
        if (i < TRIES) await uploadPage.waitForTimeout(RETRY_MS);
      }
      return false;
    }

    const live = await verifyLive(postedUrl, title);

    short.platforms[PLATFORM].status    = live ? 'posted' : 'posted_unverified';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = postedUrl;
    if (live) delete short.platforms[PLATFORM].error;
    else short.platforms[PLATFORM].error = 'Publish confirmed via /content but public URL did not resolve within retry window — verify on the channel manually.';
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.log(live
      ? 'shorts.json updated (posted, liveness confirmed). Done ✓'
      : '⚠ shorts.json updated as posted_unverified — publish was confirmed but the public URL did not resolve in time. Check the channel; do NOT re-run (would duplicate).');

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
