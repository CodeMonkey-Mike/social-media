// upload-longform-rumble.js — uploads a single longform video to Rumble.
// Sources the next pending Rumble entry directly from data/longs.json (video_path / thumbnail_path),
// so no loose-root staging copy is needed. Adapted from post-rumble-short.js with thumbnail support.

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');
const { pickNextLongform } = require('./lib/longform-queue');

const CHROME_PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\rumblebot-profile';
const RUMBLE_UPLOAD_URL = 'https://rumble.com/upload.php';

const RUMBLE_TITLE_MAX = 100;
const RUMBLE_V_RE = /https:\/\/rumble\.com\/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s"'<>]*\.html/;

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
  const job = pickNextLongform('rumble');
  if (!job) { console.error('No pending Rumble longform in longs.json (every entry already posted/skipped).'); process.exit(1); }
  const { metadata, videoPath, thumbPath } = job;
  if (!videoPath || !fs.existsSync(videoPath)) { console.error('video_path missing on disk:', videoPath); process.exit(1); }
  const hasThumb = !!thumbPath;
  const title = (metadata.title || '').slice(0, RUMBLE_TITLE_MAX);
  const description = (metadata.description || '').trim();
  const tags = metadata.tags || [];
  const tagsCsv = tags.map(t => t.trim()).join(', ');
  const category = (metadata.categories?.rumble?.primary) || 'Finance & Crypto';
  const visibility = (metadata.visibility || 'public').toLowerCase();

  console.log(`\nLongform: "${title}"`);
  console.log(`File: ${videoPath}`);
  console.log(`Size: ${(fs.statSync(videoPath).size / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Thumbnail: ${hasThumb ? thumbPath : '(none)'}`);
  console.log(`Tags: ${tagsCsv}`);
  console.log(`Category: ${category}`);
  console.log(`Visibility: ${visibility}`);

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
    console.log(`Navigating to ${RUMBLE_UPLOAD_URL}...`);
    await page.goto(RUMBLE_UPLOAD_URL, { waitUntil: 'load' });
    console.log(`  Landed: ${page.url()}`);

    if (page.url().includes('login') || page.url().includes('/sign-in') || page.url().includes('auth.rumble.com')) {
      console.log('Not logged in — sign in (waiting up to 5 min)...');
      try {
        await page.waitForURL(RUMBLE_UPLOAD_URL, { timeout: 300000 });
        await page.waitForLoadState('load');
        console.log('  Logged in ✓');
      } catch {
        throw new Error('Login timed out');
      }
    } else {
      console.log('Already logged in ✓');
    }

    // Diagnose file inputs
    const inputsInfo = await page.evaluate(() =>
      [...document.querySelectorAll('input[type="file"]')].map(i => ({
        id: i.id, name: i.name, accept: i.accept,
      }))
    );
    console.log(`  File inputs: ${JSON.stringify(inputsInfo)}`);

    // Attach video
    console.log(`Attaching video (${(fs.statSync(videoPath).size / 1024 / 1024).toFixed(1)} MB)...`);
    let fileInput = page.locator('#Filedata, .hidden-upload').first();
    try {
      await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    } catch {
      fileInput = page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached', timeout: 20000 });
    }

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

    console.log('Waiting for upload progress...');
    try {
      await page.waitForFunction(() => /\d+%/.test(document.body.innerText), null, { timeout: 30000 });
      console.log('  Upload in progress ✓');
    } catch {
      console.log('  Warning: no upload % found');
    }
    await actionPause(page, 'after upload start');

    // Title
    console.log(`Typing title (${title.length} chars)...`);
    const titleInput = page.locator('input[placeholder="Video Title"]');
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(page, titleInput, title);
    console.log('  Title typed ✓');
    await actionPause(page, 'after title');

    // Description
    console.log(`Typing description (${description.length} chars)...`);
    const descInput = page.locator('textarea[placeholder="Video Description"]');
    await descInput.waitFor({ state: 'visible', timeout: 10000 });
    await typeHuman(page, descInput, description);
    console.log('  Description typed ✓');
    await actionPause(page, 'after description');

    // Primary category
    console.log(`Setting category: ${category}`);
    try {
      const catInput = page.locator('input[name="primary-category"]').first();
      await catInput.waitFor({ state: 'visible', timeout: 10000 });
      await typeHuman(page, catInput, category);
      await page.waitForTimeout(rnd(800, 1500));
      const option = page.getByText(category, { exact: true }).first();
      await option.waitFor({ state: 'visible', timeout: 10000 });
      await option.click();
      console.log(`  Category set ✓`);
    } catch (e) {
      console.log(`  Warning: couldn't set category (${e.message.split('\n')[0]})`);
    }
    await actionPause(page, 'after category');

    // Tags
    try {
      const tagsEl = page.locator('input#tags, input[name="tags"]').first();
      await tagsEl.waitFor({ state: 'visible', timeout: 5000 });
      await typeHuman(page, tagsEl, tagsCsv);
      console.log(`  Tags typed ✓`);
    } catch {
      console.log('  Warning: tags input not found');
    }
    await actionPause(page, 'after tags');

    // Custom thumbnail
    if (hasThumb) {
      console.log(`Attaching thumbnail: ${thumbPath}`);
      try {
        const thumbInput = page.locator(
          'input[type="file"]#customThumb, input[type="file"][name*="thumb" i]'
        ).first();
        await thumbInput.waitFor({ state: 'attached', timeout: 10000 });
        await thumbInput.setInputFiles(thumbPath);
        console.log('  Thumbnail attached ✓');
      } catch {
        console.log('  Warning: thumbnail input not found — using Rumble default');
      }
      await actionPause(page, 'after thumbnail');
    }

    // Visibility
    if (visibility === 'unlisted') {
      await page.getByLabel('Unlisted').check();
    } else if (visibility === 'private') {
      await page.getByLabel('Private').check();
    }

    // Wait for Upload button enabled, then click
    console.log('Waiting for Upload button to be enabled...');
    const uploadBtn = page.getByRole('button', { name: 'Upload' }).first();
    try {
      await uploadBtn.waitFor({ state: 'visible', timeout: 30000 });
      for (let i = 0; i < 1800; i++) { // up to 15 min for 389MB upload
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

    // Licensing page handling
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

    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(500);
      const curUrl = page.url();
      if (RUMBLE_V_RE.test(curUrl)) {
        url = curUrl.match(RUMBLE_V_RE)[0].replace(/\.$/, '');
        console.log(`  Video URL from navigation: ${url}`);
        break;
      }

      const scanned = await page.evaluate((reSrc) => {
        const re = new RegExp(reSrc);
        const hrefs = [...document.querySelectorAll('a[href]')].map(a => a.href);
        for (const h of hrefs) { const m = h.match(re); if (m) return m[0]; }
        const values = [...document.querySelectorAll('input')].map(i => i.value);
        for (const v of values) { const m = (v || '').match(re); if (m) return m[0]; }
        const body = document.body.innerText;
        const m = body.match(re);
        return m ? m[0] : null;
      }, RUMBLE_V_RE.source);

      if (scanned) {
        url = scanned.replace(/\.$/, '');
        console.log(`  Direct link captured: ${url}`);
        break;
      }

      if (i === 4) {
        const pageText = await page.evaluate(() => document.body.innerText);
        const onLicensingPage = pageText.toLowerCase().includes('exclusive agreement') ||
                                pageText.toLowerCase().includes('check here if you agree');
        const hasSubmit = await page.getByRole('button', { name: 'Submit' }).count() > 0;
        if (onLicensingPage || hasSubmit) {
          console.log('Licensing page detected — checking agreement boxes...');
          await checkAgreementBoxes();

          console.log('Waiting for Submit button to be enabled (longform may take a while)...');
          const submitBtn = page.getByRole('button', { name: 'Submit' }).first();
          try {
            for (let j = 0; j < 1800; j++) { // 15 min max for 389MB
              const disabled = await submitBtn.getAttribute('disabled');
              if (disabled === null || disabled === undefined) break;
              await page.waitForTimeout(500);
            }
            console.log('  Submit button enabled ✓');
          } catch {
            console.log('  Warning: Submit never confirmed enabled');
          }

          await checkAgreementBoxes();
          await actionPause(page, 'before Submit click');
          await submitBtn.click();
          console.log('  Submit clicked ✓');
          await page.waitForTimeout(3000);

          // CRITICAL: Submit triggers the actual file upload. For large files
          // this can take many minutes. Wait for the progress text to hit 100%,
          // then wait 30s for Rumble to transition to the "Upload complete" page
          // (URL appears on that page, not before).
          console.log('Waiting for upload progress to reach 100% (up to 30 min for large files)...');
          try {
            await page.waitForFunction(() => {
              const body = document.body.innerText;
              // Look for "100%" OR for the "Upload complete" page marker
              return /(^|\s)100%/.test(body) ||
                     /upload\s*complete/i.test(body) ||
                     /your\s+video\s+is/i.test(body);
            }, null, { timeout: 30 * 60 * 1000 });
            console.log('  Upload reached 100% ✓');
          } catch {
            console.log('  Warning: 100% never confirmed — may have timed out');
          }

          // Wait 30s for the page transition to the "Upload complete" / video URL page
          console.log('Waiting 30s for "Upload complete" page transition...');
          await page.waitForTimeout(30000);
          break;
        }
      }
    }

    if (!url) {
      console.log('Scanning for direct link after Submit (up to 3 min)...');
      for (let i = 0; i < 60; i++) {
        await page.waitForTimeout(3000);
        const curUrl = page.url();
        if (RUMBLE_V_RE.test(curUrl)) {
          url = curUrl.match(RUMBLE_V_RE)[0].replace(/\.$/, '');
          console.log(`  Redirected to: ${url}`);
          break;
        }
        const scanned = await page.evaluate((reSrc) => {
          const re = new RegExp(reSrc);
          const hrefs = [...document.querySelectorAll('a[href]')].map(a => a.href);
          for (const h of hrefs) { const m = h.match(re); if (m) return m[0]; }
          return null;
        }, RUMBLE_V_RE.source);
        if (scanned) {
          url = scanned.replace(/\.$/, '');
          console.log(`  Direct link: ${url}`);
          break;
        }
      }
    }

    if (url) {
      console.log(`\nPosted: ${url}`);
    } else {
      url = 'https://rumble.com/account/videos';
      console.log('\nPosted — URL not captured (check Rumble dashboard).');
    }
    console.log('Done ✓');
    console.log('\nLeaving browser open 5 min for inspection. Ctrl+C to close sooner.');
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));

  } catch (err) {
    console.error('\nFailed:', err.message);
    console.error('\nLeaving browser open 5 min for inspection. Ctrl+C to close sooner.');
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
    process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
  }
})();
