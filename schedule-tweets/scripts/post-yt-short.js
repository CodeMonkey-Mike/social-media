// post-yt-short.js — uploads one pending YouTube Short from data/shorts.json
// Uses ytbot-profile via connectOverCDP (same pattern as post-yt-community.js).
// YouTube Studio is used for upload; Shorts are auto-detected from 9:16 vertical video.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');
const { stripHashtags } = require('./lib/strip-hashtags');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const UPLOAD_URL     = 'https://studio.youtube.com/';
const PLATFORM       = 'yt_shorts';

const ACTION_MIN = 3000;
const ACTION_MAX = 6000;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function pause(page, label = '') {
  const ms = rnd(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s${label ? ' (' + label + ')' : ''}`);
  await page.waitForTimeout(ms);
}

function isCDPReady() {
  return new Promise(resolve => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); resolve(true); });
    s.on('error', () => resolve(false));
    setTimeout(() => { try { s.destroy(); } catch {} resolve(false); }, 600);
  });
}

async function startChrome() {
  if (await isCDPReady()) { console.log('Chrome already on CDP port ✓'); return null; }
  console.log('Launching Chrome...');
  const proc = spawn(CHROME_EXE, [
    `--user-data-dir=${CHROME_PROFILE}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run', '--disable-blink-features=AutomationControlled', '--disable-sync',
    'about:blank',
  ], { detached: false, stdio: 'ignore' });
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isCDPReady()) { console.log('Chrome ready ✓'); return proc; }
  }
  throw new Error('Chrome did not open CDP port in time.');
}

// Type text character by character with human-like delays
async function typeHuman(page, text, min = 40, max = 90) {
  for (const ch of text) {
    await page.keyboard.type(ch);
    await page.waitForTimeout(rnd(min, max));
  }
}

// Click a button/element by selector, trying multiple selectors in order
async function clickFirst(page, selectors, timeout = 8000) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      await el.waitFor({ state: 'visible', timeout });
      await el.click();
      return sel;
    } catch {}
  }
  throw new Error(`None of these selectors found: ${selectors.join(', ')}`);
}

(async () => {
  // ── Load and pick next pending short ───────────────────────────────────────
  const data  = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));
  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');

  if (!short) { console.log('No pending YouTube Shorts. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  console.log(`\nShort: "${short.title}"`);
  console.log(`File:  ${videoPath}`);
  console.log(`Duration: ${short.duration_seconds}s`);

  // Mark as posting
  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  // ── Launch Chrome ───────────────────────────────────────────────────────────
  await startChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx  = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  try {
    // ── Navigate to YouTube Studio ────────────────────────────────────────────
    console.log('\nNavigating to YouTube Studio...');
    await page.goto(UPLOAD_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(rnd(3000, 5000));

    // ── Open upload dialog ────────────────────────────────────────────────────
    console.log('Opening upload dialog...');
    const createSel = await clickFirst(page, [
      'ytcp-button#create-icon',
      'button[aria-label*="Create"]',
      '#create-icon',
      'ytcp-icon-button[id="create-icon"]',
    ]);
    console.log(`  Clicked create via: ${createSel}`);
    await pause(page, 'create menu');

    // Click "Upload videos" in the dropdown
    const uploadSel = await clickFirst(page, [
      'tp-yt-paper-item:has-text("Upload videos")',
      '[role="menuitem"]:has-text("Upload")',
      'ytcp-text-menu-item:has-text("Upload")',
    ]);
    console.log(`  Clicked upload via: ${uploadSel}`);
    await page.waitForTimeout(rnd(2000, 3000));

    // ── Attach the video file ─────────────────────────────────────────────────
    console.log('Attaching video file...');
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 15000 });
    await fileInput.setInputFiles(videoPath);
    console.log('  File set — waiting for upload dialog to open...');

    // Wait for the title field to appear (signals the details dialog is open)
    await page.waitForSelector('#title-textarea, ytcp-social-suggestions-textbox #textbox', { timeout: 30000 });
    await pause(page, 'upload dialog open');

    // ── Fill title ────────────────────────────────────────────────────────────
    console.log('Filling title...');
    const titleBox = page.locator('#title-textarea #textbox, ytcp-social-suggestions-textbox #textbox').first();
    await titleBox.click();
    // Select all and clear existing text
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(300);
    await page.keyboard.press('Delete');
    await page.waitForTimeout(300);
    await typeHuman(page, short.title);
    console.log(`  Title: "${short.title}"`);
    await pause(page, 'after title');

    // ── Fill description ──────────────────────────────────────────────────────
    console.log('Filling description...');
    const descBox = page.locator('#description-textarea #textbox, #description-container #textbox').first();
    await descBox.click();
    await page.waitForTimeout(500);
    const ytDescription = stripHashtags(short.platforms.yt_shorts.caption_override || short.caption);
    await typeHuman(page, ytDescription);
    console.log(`  Description: ${ytDescription.length} chars (hashtags stripped)`);
    await pause(page, 'after description');

    // ── Not made for kids ─────────────────────────────────────────────────────
    console.log('Setting: Not made for kids...');
    try {
      const notForKids = page.locator(
        'tp-yt-paper-radio-button[name="NOT_MADE_FOR_KIDS"], ' +
        '#radioContainer:has(> #on-text:has-text("No")), ' +
        '[name="VIDEO_MADE_FOR_KIDS_MFK_RADIO_BUTTON_NOT_MFK"]'
      ).first();
      await notForKids.click({ timeout: 8000 });
      console.log('  Not for kids ✓');
    } catch {
      console.log('  Warning: could not find "Not made for kids" radio — skipping');
    }
    await pause(page, 'kids setting');

    // ── Click through wizard steps (Next → Next → Next → Visibility) ──────────
    console.log('Advancing through wizard...');
    for (let step = 1; step <= 3; step++) {
      try {
        const nextBtn = page.locator('#next-button, ytcp-button#next-button').first();
        await nextBtn.waitFor({ state: 'visible', timeout: 10000 });
        await nextBtn.click();
        console.log(`  Next (step ${step}) ✓`);
        await pause(page, `step ${step}`);
      } catch {
        console.log(`  Warning: Next button not found at step ${step}`);
      }
    }

    // ── Set visibility to Public ──────────────────────────────────────────────
    console.log('Setting visibility to Public...');
    try {
      const publicRadio = page.locator(
        'tp-yt-paper-radio-button[name="PUBLIC"], ' +
        '#radioContainer:has(#on-text:has-text("Public")), ' +
        '[name="PRIVACY_PUBLIC"]'
      ).first();
      await publicRadio.click({ timeout: 10000 });
      console.log('  Public ✓');
    } catch {
      console.log('  Warning: could not find Public radio — defaulting to whatever is selected');
    }
    await pause(page, 'visibility');

    // ── Wait for upload to complete (or at least reach "processing") ───────────
    console.log('Waiting for upload to finish...');
    try {
      // YouTube shows a progress bar; wait for it to disappear or reach 100%
      await page.waitForFunction(() => {
        const progress = document.querySelector('ytcp-video-upload-progress');
        if (!progress) return true; // dialog changed, likely done
        const text = progress.innerText || '';
        return text.includes('Upload complete') || text.includes('Processing') || text.includes('Generating');
      }, { timeout: 10 * 60 * 1000 }); // up to 10 min for large files
      console.log('  Upload complete / processing ✓');
    } catch {
      console.log('  Warning: upload progress check timed out — attempting to publish anyway');
    }
    await pause(page, 'before publish');

    // ── Publish ───────────────────────────────────────────────────────────────
    console.log('Publishing...');
    const doneBtn = await clickFirst(page, [
      '#done-button',
      'ytcp-button#done-button',
      'button[aria-label*="Publish"]',
      'button[aria-label*="Save"]',
    ]);
    console.log(`  Publish clicked via: ${doneBtn}`);
    await page.waitForTimeout(rnd(5000, 8000));

    // ── Capture the video URL ─────────────────────────────────────────────────
    console.log('Capturing video URL...');
    let videoUrl = null;
    try {
      // After publishing, YouTube shows a success dialog with a link
      await page.waitForSelector('a[href*="youtu.be"], a[href*="youtube.com/shorts"], ytcp-video-info a', { timeout: 15000 });
      videoUrl = await page.evaluate(() => {
        const links = [...document.querySelectorAll('a[href*="youtu.be"], a[href*="youtube.com/shorts"], ytcp-video-info a')];
        return links.map(a => a.href).find(h => h.includes('youtu') || h.includes('youtube')) || null;
      });
    } catch {
      // Fallback: grab from the current page URL or the studio video list
      try {
        await page.goto('https://studio.youtube.com/videos/short');
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(rnd(3000, 5000));
        videoUrl = await page.evaluate(() => {
          const link = document.querySelector('a[href*="/shorts/"]');
          return link ? link.href : null;
        });
      } catch {}
    }

    if (videoUrl) {
      console.log(`\nShort live at: ${videoUrl}`);
    } else {
      console.log('\nShort published — URL not captured (check Studio manually).');
    }

    // ── Update JSON ───────────────────────────────────────────────────────────
    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = videoUrl;
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
