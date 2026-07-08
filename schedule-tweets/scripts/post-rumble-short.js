// post-rumble-short.js — uploads one pending Rumble video from data/shorts.json
// Uses rumblebot-profile via launchPersistentContext with real Chrome.
// Adapted from C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\rumble_upload.py.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { stripHashtags, buildCaption } = require('./lib/strip-hashtags');

const SHORTS_JSON       = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\rumblebot-profile';
const WORKSPACE_ROOT    = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const RUMBLE_UPLOAD_URL = 'https://rumble.com/upload.php';
const PLATFORM          = 'rumble';

const DEFAULT_CATEGORY  = 'Finance & Crypto';
const DEFAULT_VISIBILITY = 'public';

// Rumble title cap is 100 chars; description has no hard cap.
const RUMBLE_TITLE_MAX = 100;
const RUMBLE_V_RE = /https:\/\/rumble\.com\/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s"'<>]*\.html/;

// Human-like delays
const CHAR_DELAY_MIN = 40;
const CHAR_DELAY_MAX = 120;
const ACTION_MIN     = 2000;
const ACTION_MAX     = 5000;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function actionPause(page, label = '') {
  const ms = rnd(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s${label ? ' (' + label + ')' : ''}`);
  await page.waitForTimeout(ms);
}

async function typeHuman(page, locator, text) {
  await locator.click();
  await page.waitForTimeout(rnd(300, 700));
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(rnd(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Bail if anything is stuck in 'posting' — those need manual review. Prior
  // behavior auto-reset to 'pending' and caused duplicate uploads.
  const stuck = data.shorts.filter(s => s.platforms[PLATFORM]?.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} short(s) stuck in 'posting' — manual review required:`);
    for (const s of stuck) console.error(`  - ${s.id}: ${s.title}`);
    console.error('Check rumble.com user profile to see if any actually published, then update data/shorts.json before retrying.');
    process.exit(2);
  }

  // Rumble isn't in the default schema — add it if missing on the chosen short
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
  if (!short) { console.log('No pending Rumble shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  // Rumble title max 100 chars
  const title = (short.title || '').slice(0, RUMBLE_TITLE_MAX);
  const description = buildCaption(short.platforms[PLATFORM].caption_override || short.caption, short.tags, PLATFORM);
  const tags = short.tags || [];
  const tagsCsv = tags.map(t => t.trim()).join(', ');

  console.log(`\nShort: "${title}"`);
  console.log(`File:  ${videoPath} (${short.duration_seconds}s)`);
  console.log(`Description: ${description.length} chars`);
  console.log(`Tags: ${tagsCsv}`);

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
    // ── Navigate to upload page ──────────────────────────────────────────────
    console.log(`Navigating to ${RUMBLE_UPLOAD_URL}...`);
    await page.goto(RUMBLE_UPLOAD_URL, { waitUntil: 'load' });
    console.log(`  Landed on: ${page.url()}`);

    // ── Login check ─────────────────────────────────────────────────────────
    if (page.url().includes('login') || page.url().includes('/sign-in') || page.url().includes('auth.rumble.com')) {
      console.log('Not logged in — log in to Rumble in the browser (waiting up to 5 min)...');
      try {
        await page.waitForURL(RUMBLE_UPLOAD_URL, { timeout: 300000 });
        await page.waitForLoadState('load');
        console.log(`  Logged in ✓ — now on: ${page.url()}`);
      } catch {
        throw new Error('Login timed out — sign in to Rumble and retry.');
      }
    } else {
      console.log('Already logged in ✓');
    }

    // ── Diagnose available file inputs ───────────────────────────────────────
    const inputsInfo = await page.evaluate(() =>
      [...document.querySelectorAll('input[type="file"]')].map(i => ({
        id: i.id, cls: i.className, name: i.name, accept: i.accept,
      }))
    );
    console.log(`  File inputs: ${JSON.stringify(inputsInfo)}`);

    // ── Attach the video — Rumble uses #Filedata or .hidden-upload ──────────
    console.log(`Attaching video: ${videoPath}`);
    let fileInput = page.locator('#Filedata, .hidden-upload').first();
    try {
      await fileInput.waitFor({ state: 'attached', timeout: 10000 });
      console.log('  Found Rumble-specific file input ✓');
    } catch {
      console.log('  Rumble-specific input not found — falling back to first file input');
      fileInput = page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached', timeout: 20000 });
    }

    // Try file chooser approach first; fall back to setInputFiles + change event
    try {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 5000 }),
        fileInput.click(),
      ]);
      await fileChooser.setFiles(videoPath);
      console.log('  Video attached via file chooser ✓');
    } catch {
      console.log('  File chooser not triggered — using setInputFiles');
      await fileInput.setInputFiles(videoPath);
      await page.evaluate(() => {
        const inp = document.querySelector('#Filedata, .hidden-upload, input[type="file"]');
        if (inp) {
          inp.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
          inp.dispatchEvent(new Event('input',  { bubbles: true, cancelable: true }));
        }
      });
    }

    // ── Confirm upload started ───────────────────────────────────────────────
    console.log('Waiting for upload progress indicator...');
    try {
      await page.waitForFunction(
        () => /\d+%/.test(document.body.innerText),
        { timeout: 20000 }
      );
      console.log('  Upload in progress ✓');
    } catch {
      console.log('  Warning: no upload % found — continuing anyway');
    }
    await actionPause(page, 'after upload start');

    // ── Fill title (typed char-by-char) ──────────────────────────────────────
    console.log(`Typing title (${title.length} chars)...`);
    const titleInput = page.locator('input[placeholder="Video Title"]');
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(page, titleInput, title);
    console.log('  Title typed ✓');
    await actionPause(page, 'after title');

    // ── Fill description (typed char-by-char) ────────────────────────────────
    console.log(`Typing description (${description.length} chars)...`);
    const descInput = page.locator('textarea[placeholder="Video Description"]');
    await descInput.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(page, descInput, description);
    console.log('  Description typed ✓');
    await actionPause(page, 'after description');

    // ── Primary category (combobox, typed) ───────────────────────────────────
    console.log(`Setting category: ${DEFAULT_CATEGORY}`);
    try {
      const catInput = page.locator('input[name="primary-category"]').first();
      await catInput.waitFor({ state: 'visible', timeout: 10000 });
      await typeHuman(page, catInput, DEFAULT_CATEGORY);
      await page.waitForTimeout(rnd(800, 1500));
      const option = page.getByText(DEFAULT_CATEGORY, { exact: true }).first();
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
      console.log(`  Category set: ${DEFAULT_CATEGORY} ✓`);
    } catch (e) {
      console.log(`  Warning: couldn't set category (${e.message.split('\n')[0]}) — using default`);
    }
    await actionPause(page, 'after category');

    // ── Tags (typed char-by-char) ────────────────────────────────────────────
    try {
      const tagsEl = page.locator('input#tags, input[name="tags"]').first();
      await tagsEl.waitFor({ state: 'visible', timeout: 5000 });
      await typeHuman(page, tagsEl, tagsCsv);
      console.log(`  Tags typed ✓`);
    } catch {
      console.log('  Warning: tags input not found — skipping');
    }
    await actionPause(page, 'after tags');

    // ── Visibility ───────────────────────────────────────────────────────────
    if (DEFAULT_VISIBILITY === 'unlisted') {
      await page.getByLabel('Unlisted').check();
    } else if (DEFAULT_VISIBILITY === 'private') {
      await page.getByLabel('Private').check();
    }
    // Public is the default — no action needed

    // ── Wait for Upload button to be enabled, then click ─────────────────────
    console.log('Waiting for Upload button to be enabled (upload + form complete)...');
    const uploadBtn = page.getByRole('button', { name: 'Upload' }).first();
    try {
      await uploadBtn.waitFor({ state: 'visible', timeout: 30000 });
      // Poll for enabled state
      for (let i = 0; i < 1200; i++) { // 10 min max
        const disabled = await uploadBtn.getAttribute('disabled');
        if (disabled === null || disabled === undefined) break;
        await page.waitForTimeout(500);
      }
      console.log('  Upload button ready');
      await actionPause(page, 'before Upload click');
      await uploadBtn.click();
      console.log('  Clicked Upload ✓');
    } catch (e) {
      throw new Error(`Upload button never became clickable: ${e.message}`);
    }

    console.log('Upload clicked — looking for licensing page or direct URL...');

    // ── Check for licensing page (agreement checkboxes + Submit) ─────────────
    let url = null;
    const checkAgreementBoxes = async () => {
      const labelTextGroups = [
        ['You have not signed an exclusive agreement', 'exclusive agreement'],
        ['Check here if you agree', 'agree to our terms', 'terms of service', 'I agree'],
      ];
      for (const texts of labelTextGroups) {
        for (const text of texts) {
          const loc = page.locator(`label:has-text("${text}")`).first();
          try {
            await loc.waitFor({ state: 'visible', timeout: 5000 });
            const labelFor = await loc.getAttribute('for');
            let cb;
            if (labelFor) cb = page.locator(`input#${labelFor}`);
            else cb = loc.locator('input[type="checkbox"]').first();
            const checked = await cb.isChecked();
            if (!checked) {
              await loc.click();
              await page.waitForTimeout(300);
              console.log(`  Checked: ${text.slice(0, 50)}`);
            }
            break;
          } catch {}
        }
      }
    };

    // Tight polling loop for first 30s
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(500);
      const curUrl = page.url();
      if (RUMBLE_V_RE.test(curUrl)) {
        url = curUrl.match(RUMBLE_V_RE)[0].replace(/\.$/, '');
        console.log(`  Video URL from navigation: ${url}`);
        break;
      }

      // Only trust URL navigation — do not scan page links (sidebar has existing video URLs)

      // Check for licensing page after ~2.5s
      if (i === 4) {
        const pageText = await page.evaluate(() => document.body.innerText);
        const onLicensingPage = pageText.toLowerCase().includes('exclusive agreement') ||
                                pageText.toLowerCase().includes('check here if you agree');
        const hasSubmit = await page.getByRole('button', { name: 'Submit' }).count() > 0;
        if (onLicensingPage || hasSubmit) {
          console.log('Licensing page detected — checking agreement boxes...');
          await checkAgreementBoxes();

          // Wait for Submit to become enabled (upload finishes)
          console.log('Waiting for Submit button to be enabled...');
          const submitBtn = page.getByRole('button', { name: 'Submit' }).first();
          try {
            for (let j = 0; j < 1200; j++) { // 10 min max
              const disabled = await submitBtn.getAttribute('disabled');
              if (disabled === null || disabled === undefined) break;
              await page.waitForTimeout(500);
            }
            console.log('  Submit button enabled ✓');
          } catch {
            console.log('  Warning: Submit never confirmed enabled — clicking anyway');
          }

          // Re-check boxes in case page reset them
          await checkAgreementBoxes();
          await actionPause(page, 'before Submit click');

          await submitBtn.click();
          console.log('  Submit clicked ✓');
          await page.waitForTimeout(3000);
          break;
        }
      }
    }

    // ── Capture the short's REAL URL from /account/content ───────────────────
    // ⛔ ROOT-CAUSE FIX (2026-06-02): Rumble SHORTS live at rumble.com/shorts/v<id>,
    // a SEPARATE namespace that NEVER appears in the channel video grid or as a
    // /v<id>-slug.html link. The old channel-scrape therefore ALWAYS captured an
    // unrelated .html video for a short. The authoritative source is
    // /account/content, where each short's row links to /shorts/v<id>. We match
    // THIS short by title, then liveness-check the public page. We DELIBERATELY
    // ignore any .html `url` the redirect loop may have grabbed — it's wrong for
    // a short. Never write a wrong URL: if we can't confirm, mark posted_unverified.
    const norm = s => (s || '').toLowerCase().replace(/&#0?39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    const titleNeedle = norm(title).slice(0, 40);

    async function captureShortUrlByTitle() {
      for (let attempt = 1; attempt <= 6; attempt++) {
        try {
          await page.goto('https://rumble.com/account/content', { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(4000);
          const href = await page.evaluate((want) => {
            const n = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
            // Anchor the search on each /shorts/v link and find how FEW ancestor
            // levels until its own row text contains the wanted title; pick the
            // anchor with the tightest (smallest-level) match. Climbing the other
            // way (from a title node down to an anchor) can cross into a neighbor
            // row and grab the wrong video's URL — which is exactly the bug that
            // mis-captured kaspa's URL for the wells-fargo short (2026-06-02).
            let best = null, bestLevel = 99;
            for (const a of document.querySelectorAll('a[href*="/shorts/v"]')) {
              let c = a;
              for (let lvl = 0; lvl < 5 && c; lvl++) {
                if (n(c.innerText).includes(want)) { if (lvl < bestLevel) { bestLevel = lvl; best = a; } break; }
                c = c.parentElement;
              }
            }
            return best ? best.getAttribute('href') : null;
          }, titleNeedle);
          if (href) {
            const full = (href.startsWith('http') ? href : 'https://rumble.com' + href).split('?')[0];
            console.log(`  Matched short on /account/content: ${full}`);
            return full;
          }
          console.log(`  Capture ${attempt}/6: short not listed on /account/content yet — waiting...`);
        } catch (e) {
          console.log(`  Capture ${attempt}/6 error: ${e.message.split('\n')[0]}`);
        }
        if (attempt < 6) await page.waitForTimeout(20000);
      }
      return null;
    }

    // Liveness: fetch the public /shorts/ page and confirm its title matches.
    async function verifyLive(u) {
      const want = norm(title).slice(0, 25);
      const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
      for (let i = 1; i <= 5; i++) {
        try {
          const resp = await browser.request.get(u, { timeout: 20000, headers: { 'User-Agent': UA } });
          const html = await resp.text();
          const m = html.match(/<title>([^<]*)<\/title>/i) || html.match(/og:title"\s+content="([^"]*)"/i);
          const got = norm(m ? m[1] : '');
          if (got && want && got.includes(want)) { console.log(`  Liveness ✓ (title="${m[1]}")`); return true; }
          console.log(`  Liveness ${i}/5: not live yet (title="${m ? m[1] : 'none'}")`);
        } catch (e) { console.log(`  Liveness ${i}/5 error: ${e.message.split('\n')[0]}`); }
        if (i < 5) await page.waitForTimeout(20000);
      }
      return false;
    }

    console.log('\nCapturing short URL from /account/content (matching by title)...');
    const shortUrl = await captureShortUrlByTitle();
    const live = shortUrl ? await verifyLive(shortUrl) : false;

    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    if (shortUrl && live) {
      short.platforms[PLATFORM].status = 'posted';
      short.platforms[PLATFORM].url    = shortUrl;
      delete short.platforms[PLATFORM].error;
      console.log(`\nPosted (live, verified): ${shortUrl}`);
    } else if (shortUrl) {
      short.platforms[PLATFORM].status = 'posted_unverified';
      short.platforms[PLATFORM].url    = shortUrl;
      short.platforms[PLATFORM].error  = 'Short URL found on /account/content but public page did not resolve within the retry window — verify manually. Do NOT re-run (would duplicate).';
      console.log(`\n⚠ posted_unverified: ${shortUrl} (URL captured, liveness not confirmed in window)`);
    } else {
      short.platforms[PLATFORM].status = 'posted_unverified';
      short.platforms[PLATFORM].url    = null;
      short.platforms[PLATFORM].error  = 'Upload submitted but short not found on /account/content within retry window — recapture by title later (it lives at /shorts/v<id>, not the channel grid). Do NOT re-run (would duplicate).';
      console.log('\n⚠ posted_unverified: short URL not captured — recapture later from /account/content by title.');
    }
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
