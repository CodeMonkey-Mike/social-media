// post-ig-reel.js — uploads one pending Instagram Reel from data/shorts.json
// Instagram web has no dedicated "Reel" creation link; uploading a video via the
// Post flow automatically creates a Reel (IG converts all video posts to Reels).

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const SHORTS_JSON    = path.join(__dirname, '..', 'data', 'shorts.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\igbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const IG_USERNAME    = 'realcodemonkeymike';
const PLATFORM       = 'ig_reels';

const ACTION_MIN      = 3000;
const ACTION_MAX      = 6000;
const CHAR_DELAY_MIN  = 40;
const CHAR_DELAY_MAX  = 120;
const PRE_COMPOSE_MIN = 15000;
const PRE_COMPOSE_MAX = 45000;

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

// IG pops a "Turn on Notifications" (and sometimes "Save your login info?") modal
// on load that traps focus and blocks the Create flow (the Post sub-link never
// appears and input[type=file] never attaches). Dismiss up to 2 with "Not Now".
async function dismissBlockingDialogs(page) {
  for (let i = 0; i < 2; i++) {
    const btn = page.getByRole('button', { name: /^Not Now$/i }).first();
    if (await btn.count() > 0) {
      await btn.click().catch(() => {});
      console.log('  Dismissed blocking modal (Not Now)');
      await page.waitForTimeout(1200);
    } else break;
  }
}

async function clickNext(page, stepLabel) {
  console.log(`  Clicking Next (${stepLabel})...`);
  let btn = page.getByRole('button', { name: 'Next' });
  if (await btn.count() === 0) btn = page.locator('button:has-text("Next")').first();
  await btn.waitFor({ state: 'visible', timeout: 15000 });
  await mouseClick(page, btn);
  await page.waitForTimeout(2000);
}

async function getRecentReelUrls(page, count = 3) {
  await page.goto(`https://www.instagram.com/${IG_USERNAME}/reels/`);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  return page.evaluate((n) =>
    [...document.querySelectorAll('a[href*="/reel/"]')].slice(0, n).map(a => a.href),
  count);
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Bail if anything is stuck in 'posting' — those need manual review. Prior
  // behavior auto-reset to 'pending' and caused duplicate uploads.
  const stuck = data.shorts.filter(s => s.platforms[PLATFORM]?.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} short(s) stuck in 'posting' — manual review required:`);
    for (const s of stuck) console.error(`  - ${s.id}: ${s.title}`);
    console.error(`Check instagram.com/${IG_USERNAME}/reels/ to see if any actually published, then update data/shorts.json before retrying.`);
    process.exit(2);
  }

  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');
  if (!short) { console.log('No pending Instagram Reels. Exiting.'); process.exit(0); }

  const videoPath = path.join(WORKSPACE_ROOT, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error('Video file not found:', videoPath);
    process.exit(1);
  }

  const caption = short.platforms[PLATFORM].caption_override || short.caption;

  console.log(`\nReel: "${short.title}"`);
  console.log(`File: ${videoPath} (${short.duration_seconds}s)`);
  console.log(`Caption: ${caption.length} chars`);

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
    console.log('Navigating to Instagram...');
    await page.goto('https://www.instagram.com/');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    if (await page.locator('input[name="username"], input[autocomplete="username"]').count() > 0) {
      throw new Error('Instagram login form detected — check igbot-profile.');
    }
    console.log('Instagram home loaded ✓');
    await dismissBlockingDialogs(page);

    // ── Pre-compose wait ─────────────────────────────────────────────────────
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');
    await dismissBlockingDialogs(page);

    // ── Open Create menu → Post ───────────────────────────────────────────────
    // Instagram converts video uploads to Reels automatically via the Post flow.
    console.log('Opening Create → Post...');
    let createBtn = null;
    for (const sel of ['a[href="/create/select-type/"]', '[aria-label="New post"]', '[aria-label="Create"]']) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) { createBtn = el; break; }
    }
    if (!createBtn) createBtn = page.locator('text="Create"').first();
    await mouseClick(page, createBtn);
    await page.waitForTimeout(1500);

    // Click "Post" from the expanded sidebar
    let postLink = page.getByRole('link', { name: /^Post$/ }).or(page.getByRole('button', { name: /^Post$/ })).first();
    if (await postLink.count() === 0) postLink = page.locator('a, button, span, div').filter({ hasText: /^Post$/ }).first();
    if (await postLink.count() > 0) {
      await mouseClick(page, postLink);
      console.log('  Clicked Post ✓');
    }
    await page.waitForTimeout(1500);

    // ── Capture profile Reel URLs BEFORE share, so we can diff after ─────────
    const preShareReelUrls = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href*="/reel/"]')].map(a => a.href.split('?')[0]))]
    );
    console.log(`  Pre-share Reel URLs captured: ${preShareReelUrls.length}`);

    // ── Upload video file ────────────────────────────────────────────────────
    console.log('Uploading video...');
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 15000 });
    await fileInput.setInputFiles(videoPath);
    console.log('  Video set — waiting for preview to render (up to 120s)...');

    // Wait for the video element to appear inside the modal — confirms IG has
    // accepted the file and rendered a preview. A 5s blind wait was too short
    // for ~36s/20MB clips; Next would fire while the button was still disabled.
    let previewReady = false;
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(2000);
      const videoCount = await page.locator('div[role="dialog"] video').count().catch(() => 0);
      if (videoCount > 0) { previewReady = true; break; }
    }
    if (!previewReady) throw new Error('Video preview never rendered after setInputFiles');
    console.log('  Preview rendered ✓');

    // IG may show an "OK" or "Select crop" dialog for videos — dismiss if present
    for (const dismissSel of ['button:has-text("OK")', 'button:has-text("Select")']) {
      const el = page.locator(dismissSel).first();
      if (await el.count() > 0) {
        await mouseClick(page, el);
        await page.waitForTimeout(1000);
      }
    }

    // ── Select 9:16 (portrait) aspect ratio ──────────────────────────────────
    // IG defaults to 1:1 because Mike's image posts are square; for a vertical
    // video that needs to land as a Reel we must explicitly pick 9:16 before
    // clicking Next. Trigger SVG has aria-label="Select crop"; option SVG has
    // aria-label="Crop portrait icon" (captured 2026-05-21). The option's
    // clickable parent isn't necessarily a <button> — could be div/role="button".
    console.log('Selecting 9:16 (portrait) crop...');
    // Trigger is a <button>; crop options are <div role="button"> elements.
    // The crop trigger sits at y≈725 in a dialog that's often taller than
    // the viewport — scroll it into view first.
    const cropTrigger = page.locator('button:has(svg[aria-label="Select crop"])').first();
    if (await cropTrigger.count() > 0) {
      await cropTrigger.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);

      // Hover-to-open strategy. New theory: IG's menu is CSS hover-controlled
      // (or React opens it on mouseenter/pointerover, not click). A click moves
      // cursor on, fires mouseup, then moves away — menu closes immediately.
      // Stay on the trigger via hover, then keep mouse inside the menu region
      // while moving to the option, then click WITHOUT leaving the menu.
      const trigBbox = await cropTrigger.boundingBox();
      const tcx = trigBbox.x + trigBbox.width / 2;
      const tcy = trigBbox.y + trigBbox.height / 2;
      try {
        // Hover the trigger — opens menu if it's hover-driven
        await cropTrigger.hover();
        // Hold the hover (don't move yet) — give menu time to render
        await page.waitForTimeout(600);

        // Find 9:16 coords (single evaluate, no DOM mutation)
        const coords = await page.evaluate(() => {
          const opts = [...document.querySelectorAll('[role="button"]')];
          for (const el of opts) {
            const span = el.querySelector('span');
            if (span && span.textContent.trim() === '9:16') {
              const r = el.getBoundingClientRect();
              if (r.width > 0 && r.height > 0) {
                return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
              }
            }
          }
          return null;
        });

        if (coords) {
          console.log(`  hover→menu found 9:16 at (${Math.round(coords.x)}, ${Math.round(coords.y)})`);
          // Move from trigger to option in small steps to keep menu region "active"
          // (steps argument forces intermediate mousemove events)
          await page.mouse.move(coords.x, coords.y, { steps: 10 });
          await page.waitForTimeout(120);
          await page.mouse.click(coords.x, coords.y);
          console.log('  ✓ Clicked 9:16');
        } else {
          console.log('  WARN: menu did not open on hover; 9:16 not found');
        }
      } catch (e) {
        console.log(`  hover-strategy failed: ${e.message.split('\n')[0]}`);
      }
      await page.waitForTimeout(1500);
    } else {
      console.log('  WARN: crop trigger not found — proceeding with default');
    }

    // ── Next through wizard steps ────────────────────────────────────────────
    await clickNext(page, 'Crop/Trim');
    await actionPause(page, 'after Trim');

    {
      const nb = page.getByRole('button', { name: 'Next' });
      if (await nb.count() > 0) {
        await clickNext(page, 'Filter/Edit');
        await actionPause(page, 'after Edit');
      }
    }

    // ── Caption ──────────────────────────────────────────────────────────────
    console.log(`Typing caption (${caption.length} chars)...`);
    const captionArea = page.locator(
      '[aria-label="Write a caption..."], textarea[placeholder*="caption"], [contenteditable][placeholder*="caption"]'
    ).first();
    await captionArea.waitFor({ state: 'visible', timeout: 15000 });
    await captionArea.click();
    await page.waitForTimeout(500);
    await typeHuman(page, caption);
    await page.waitForTimeout(1000);
    console.log('Caption typed ✓');
    await actionPause(page, 'after caption');

    // ── Pre-share wait ───────────────────────────────────────────────────────
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before Share');

    // ── Share ────────────────────────────────────────────────────────────────
    // Tolerate "Share button already gone" — this happens if a human clicks
    // Share manually before Playwright reaches this step. We treat that as
    // "Share already done, proceed to confirmation/URL capture".
    console.log('Clicking Share...');
    try {
      const shareBtn = page.getByRole('button', { name: 'Share' }).first();
      await shareBtn.waitFor({ state: 'visible', timeout: 10000 });
      await mouseClick(page, shareBtn);
    } catch (e) {
      console.log('  Share button not visible — assuming Share already triggered (manually or programmatically), continuing');
    }

    // ── Wait for upload to actually complete server-side ────────────────────
    // IG shows a "posting" spinner while the upload processes; the modal stays
    // open until upload completes (or an error toast appears). Watching for
    // those signals lets us not close Chrome before the server is done.
    console.log('Waiting up to 9 minutes for upload to finish (modal close or success/error toast)...');
    const startWait = Date.now();
    const SUCCESS_RE = /your reel has been shared|reel shared|your post has been shared|your video has been shared|posted/i;
    const ERROR_RE   = /something went wrong|try again|couldn.?t upload|couldn.?t share|failed to post|action blocked|temporarily restricted/i;
    let result = 'timeout';
    while (Date.now() - startWait < 540000) {
      await page.waitForTimeout(2000);
      const body = await page.evaluate(() => document.body.innerText || '').catch(() => '');
      if (SUCCESS_RE.test(body)) { result = 'success'; break; }
      if (ERROR_RE.test(body))   { result = 'error'; break; }
      // Composer dialog gone (no upload spinner visible) is also a success signal
      const composerOpen = await page.locator('div[role="dialog"]').count().catch(() => 0);
      const posting = /posting|uploading|sharing/i.test(body);
      if (composerOpen === 0 && !posting) { result = 'modal-closed'; break; }
    }
    console.log(`  upload wait result: ${result} (after ${Math.round((Date.now() - startWait)/1000)}s)`);

    if (result === 'error') {
      // Capture the error message visible to help diagnose
      const errBody = await page.evaluate(() => {
        const text = document.body.innerText || '';
        const m = text.match(/(something went wrong|action blocked|couldn'?t (?:upload|share)|temporarily restricted|try again).{0,200}/i);
        return m ? m[0] : '(no specific message)';
      });
      throw new Error(`IG returned an error after Share: ${errBody}`);
    }

    // Extra settle time (5 minutes) so the new post finishes server-side
    // processing and propagates to the profile grid before we scrape it.
    // IG appears to silently drop uploads that are interrupted by browser
    // close — better to over-wait than to lose the post.
    console.log('  Holding 5 minutes for IG to finish server-side processing...');
    await page.waitForTimeout(300000);

    // ── Grab URL ─────────────────────────────────────────────────────────────
    console.log('Capturing reel URL...');
    let reelUrl = null;
    try {
      const urls = await getRecentReelUrls(page, 3);
      if (urls.length > 0) reelUrl = urls[0];
    } catch {}

    if (reelUrl) { console.log(`\nReel posted: ${reelUrl}`); }
    else { console.log('\nReel posted — URL not captured (check Instagram manually).'); }

    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = reelUrl;
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
