// post-rumble-short.js — uploads one pending Rumble video from data/shorts.json
// Uses rumblebot-profile via launchPersistentContext with real Chrome.
// Adapted from C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\rumble_upload.py.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

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
  const description = short.platforms[PLATFORM].caption_override || short.caption;
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

    // ── If still no URL, poll for redirect (up to 3 min) ──────────────────────
    if (!url) {
      console.log('Scanning for direct link after Submit...');
      for (let i = 0; i < 60; i++) {
        await page.waitForTimeout(3000);
        const curUrl = page.url();
        if (RUMBLE_V_RE.test(curUrl)) {
          url = curUrl.match(RUMBLE_V_RE)[0].replace(/\.$/, '');
          console.log(`  Redirected to: ${url}`);
          break;
        }
        // Only trust URL navigation — page links may contain sidebar/existing video URLs
      }
    }

    // ── Verify by navigating to channel and grabbing most recent video URL ──────
    if (!url) {
      console.log('\nNavigating to channel to capture video URL...');
      try {
        await page.goto('https://rumble.com/user/CodeMonkeyMike', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(5000);
        const channelUrl = await page.evaluate((reSrc) => {
          const re = new RegExp(reSrc);
          const links = [...document.querySelectorAll('a[href]')].map(a => a.href);
          return links.find(h => re.test(h)) || null;
        }, RUMBLE_V_RE.source);
        if (channelUrl) {
          url = channelUrl.match(RUMBLE_V_RE)[0].replace(/\.$/, '');
          console.log(`  Most recent channel video: ${url}`);
        }
      } catch (e) {
        console.log(`  Channel verify error: ${e.message}`);
      }
    }

    if (url) {
      console.log(`\nPosted: ${url}`);
    } else {
      url = 'https://rumble.com/account/videos';
      console.log('\nPosted — URL not captured (check Rumble dashboard).');
    }

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
