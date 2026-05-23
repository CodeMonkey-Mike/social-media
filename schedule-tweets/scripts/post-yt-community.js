const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs  = require('fs');
const path = require('path');

const YT_JSON        = path.join(__dirname, '..', 'data', 'yt-posts.json');
const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const CHANNEL_HANDLE = 'CodeMonkeyMike';
const POSTS_URL      = `https://www.youtube.com/@${CHANNEL_HANDLE}/posts`;

const CHAR_DELAY       = 5;
const ACTION_MIN       = 5000;
const ACTION_MAX       = 8000;
const PRE_COMPOSE_MIN  = 30000;
const PRE_COMPOSE_MAX  = 90000;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function actionPause(page, label = '') {
  const ms = randomBetween(ACTION_MIN, ACTION_MAX);
  console.log(`  ~ ${(ms / 1000).toFixed(1)}s pause${label ? ` (${label})` : ''}`);
  await page.waitForTimeout(ms);
}

async function longWait(page, minMs, maxMs, label = '') {
  const ms = randomBetween(minMs, maxMs);
  console.log(`  waiting ${Math.round(ms / 1000)}s${label ? ` (${label})` : ''}...`);
  await page.waitForTimeout(ms);
}

// Check if Chrome's remote debugging port is already listening
function isCDPReady() {
  return new Promise(resolve => {
    const sock = net.connect(CDP_PORT, '127.0.0.1', () => { sock.destroy(); resolve(true); });
    sock.on('error', () => resolve(false));
    setTimeout(() => { try { sock.destroy(); } catch {} resolve(false); }, 600);
  });
}

// Spawn Chrome with the ytbot-profile and remote debugging port.
// Returns the child process (or null if Chrome was already running on the port).
async function startChrome() {
  if (await isCDPReady()) {
    console.log(`Chrome already listening on CDP port ${CDP_PORT} ✓`);
    return null;
  }

  console.log('Launching Chrome with remote debugging...');
  const proc = spawn(CHROME_EXE, [
    `--user-data-dir=${CHROME_PROFILE}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    '--disable-blink-features=AutomationControlled',
    '--disable-sync',
    'about:blank',
  ], { detached: false, stdio: 'ignore' });

  // Wait up to 12s for the port to open
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isCDPReady()) {
      console.log(`Chrome ready on port ${CDP_PORT} ✓`);
      return proc;
    }
  }

  throw new Error(
    `Chrome did not open remote debugging port ${CDP_PORT} within 12 seconds.\n` +
    `This usually means the ytbot-profile is still locked by another Chrome process.\n` +
    `Close all Chrome windows (including background Chrome) and re-run.`
  );
}

function resolveImagePath(img) {
  if (img.image_path) {
    const rel = img.image_path.replace(/^schedule-tweets[\\/]/, '');
    const abs = path.join(WORKSPACE_ROOT, rel);
    if (fs.existsSync(abs)) return abs;
    console.log(`  image_path doesn't resolve (${abs}) — falling back to glob`);
  }
  if (img.image_id) {
    for (const dir of ['images/yt', 'images/ig', 'images/x']) {
      const fullDir = path.join(WORKSPACE_ROOT, dir);
      if (!fs.existsSync(fullDir)) continue;
      const match = fs.readdirSync(fullDir).find(f => f.includes(img.image_id));
      if (match) return path.join(fullDir, match);
    }
  }
  return null;
}

// Scrape the most recent post URLs from the community posts page
async function getRecentPostUrls(page, count = 5) {
  await page.goto(POSTS_URL);
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  return page.evaluate((n) => {
    const seen = new Set();
    const urls = [];
    for (const a of document.querySelectorAll('a[href*="/post/"]')) {
      const url = a.href.replace(/[?#].*$/, '');
      if (!seen.has(url)) {
        seen.add(url);
        urls.push(url);
        if (urls.length >= n) break;
      }
    }
    return urls;
  }, count);
}

// Visit a post URL and read its body text and image count
async function inspectPost(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  return page.evaluate(() => {
    // Body text — try several selectors YouTube uses
    let bodyText = '';
    for (const sel of [
      '#post-text yt-formatted-string',
      '#post-text',
      'yt-formatted-string#content',
      'ytd-backstage-post-renderer #text',
    ]) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.length > 20) {
        bodyText = el.innerText;
        break;
      }
    }

    // Image count — count rendered image elements in the post
    const imageCount = document.querySelectorAll(
      'ytd-backstage-image-renderer img, #post-multi-image-attachment img, #post-image-attachment img'
    ).length;

    // Timestamp text (relative, e.g. "just now", "2 minutes ago")
    const timeEl = document.querySelector('#published-time-text a, a[class*="published-time"]');
    const timeText = timeEl ? timeEl.innerText.trim() : '';

    return { bodyText, imageCount, timeText };
  });
}

// PRE-CHECK: scan last 5 community posts for matching body → returns url or null
async function checkAlreadyPosted(page, body) {
  console.log('\nPre-check: scanning recent community posts for duplicates...');
  const snippet = body.slice(0, 50);
  const urls = await getRecentPostUrls(page, 5);
  console.log(`  Checking ${urls.length} posts for: "${snippet.slice(0, 40)}..."`);

  for (const url of urls) {
    const info = await inspectPost(page, url);
    if (info.bodyText && info.bodyText.includes(snippet.slice(0, 40))) {
      console.log(`  DUPLICATE FOUND at ${url}`);
      return url;
    }
    console.log(`  Not a match: ${url}`);
  }
  console.log('  No duplicate found. Safe to post.\n');
  return null;
}

// POST-CHECK: find the new post URL (not in preUrls), verify body + images
async function verifyPosted(page, preUrls, post) {
  console.log('\nPost-check: verifying post on community page...');

  // YouTube's feed can take several seconds to reflect a new post.
  // Retry up to 5 times with 5s gaps (25s total window).
  let newUrl = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const newUrls = await getRecentPostUrls(page, 5);
    newUrl = newUrls.find(u => !preUrls.includes(u));
    if (newUrl) break;
    console.log(`  Attempt ${attempt}/5: new post not yet visible — waiting 5s...`);
    await page.waitForTimeout(5000);
  }

  if (!newUrl) {
    return { ok: false, reason: `No new post URL found after 5 attempts — feed may not have updated yet` };
  }

  console.log(`  Inspecting: ${newUrl}`);
  const info = await inspectPost(page, newUrl);
  console.log(`  Time: "${info.timeText}" | body length: ${info.bodyText.length} | images: ${info.imageCount}`);

  // Body must contain the opening snippet
  const snippet = post.body.slice(0, 40);
  if (info.bodyText && !info.bodyText.includes(snippet)) {
    return { ok: false, url: newUrl, reason: `Body snippet not found. Expected: "${snippet}"`, info };
  }

  // Image count check
  const expectedImages = (post.images || []).length;
  if (expectedImages > 0 && info.imageCount === 0) {
    return { ok: false, url: newUrl, reason: `Expected ${expectedImages} image(s) but none visible on post`, info };
  }
  if (expectedImages > 1 && info.imageCount < 2) {
    return { ok: false, url: newUrl, reason: `Expected carousel (${expectedImages} images) but got ${info.imageCount}`, info };
  }

  console.log(`  Verified ✓  (body: match, images: ${info.imageCount}/${expectedImages})`);
  return { ok: true, url: newUrl, info };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const post = data.posts.find(p => p.status === 'pending');

  if (!post) {
    console.log('No pending YouTube community posts. Exiting.');
    return;
  }

  const snippet = post.body.slice(0, 80);
  console.log(`Post: "${snippet}..."`);
  console.log(`Body: ${post.char_count} chars`);

  // Resolve image paths up front
  const imagePaths = [];
  if (post.images && post.images.length > 0) {
    for (const img of post.images.sort((a, b) => a.seq - b.seq)) {
      const abs = resolveImagePath(img);
      if (!abs) {
        console.error(`FATAL: image not found for seq=${img.seq} (image_id: ${img.image_id})`);
        process.exit(1);
      }
      console.log(`  Image ${img.seq}: ${path.basename(abs)}`);
      imagePaths.push(abs);
    }
  } else {
    console.log('  Text-only post (no images)');
  }

  // Launch Chrome as a normal process (avoids Playwright's singleton conflict),
  // then connect to it via CDP.
  const chromeProc = await startChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const context  = browser.contexts()[0];
  const page     = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    // ── Login check ───────────────────────────────────────────────────────────
    console.log('Navigating to YouTube...');
    await page.goto('https://www.youtube.com/');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Check for sign-in prompt — avatar button absence means not logged in
    const avatar = await page.locator('#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer').count();
    if (avatar === 0) {
      throw new Error(
        'Not logged in to YouTube in the ytbot-profile.\n' +
        'Close Chrome, open it manually with --user-data-dir=ytbot-profile, log in, then re-run.'
      );
    }
    console.log('YouTube loaded and logged in ✓');

    // ── PRE-CHECK ─────────────────────────────────────────────────────────────
    const duplicateUrl = await checkAlreadyPosted(page, post.body);
    if (duplicateUrl) {
      console.log(`Already posted. Updating JSON with existing URL.`);
      post.status    = 'posted';
      post.posted_at = post.posted_at || new Date().toISOString();
      post.post_url  = duplicateUrl;
      fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
      await browser.close();
      return;
    }

    // Capture pre-posting URL list for post-check diff
    // (getRecentPostUrls above already navigated to POSTS_URL; grab the list again cleanly)
    const preUrls = await getRecentPostUrls(page, 5);

    // Mark mid-flight before any browser interaction
    post.status = 'posting';
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));

    // ── Navigate to posts page / composer ─────────────────────────────────────
    console.log('Opening community posts composer...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);

    // ── Expand the composer by clicking the placeholder ───────────────────────
    // YouTube community post composer starts collapsed. Must click the
    // placeholder area first before the full text area becomes interactive.
    console.log('Expanding composer...');
    const placeholderSelectors = [
      '#placeholder-area',
      '[id="placeholder-area"]',
      'ytd-backstage-post-renderer-create #placeholder-area',
      '#contenteditable-root',    // sometimes directly clickable in expanded state
    ];
    let expanded = false;
    for (const sel of placeholderSelectors) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        try {
          await el.click({ timeout: 5000 });
          console.log(`  Clicked placeholder via: ${sel}`);
          expanded = true;
          break;
        } catch { /* try next */ }
      }
    }
    if (!expanded) {
      // Last resort: click by coordinates near the top of the page where the composer lives
      console.log('  Placeholder selectors failed — trying JS click on placeholder-area...');
      await page.evaluate(() => {
        const el = document.querySelector('#placeholder-area') || document.querySelector('ytd-backstage-post-renderer-create');
        if (el) el.click();
      });
    }
    await page.waitForTimeout(1500);

    // ── Find the now-visible text area ────────────────────────────────────────
    let textArea = null;
    const taSelectors = [
      '#contenteditable-root[contenteditable="true"]',
      '[aria-label*="mind"][contenteditable="true"]',
      '[aria-label*="audience"][contenteditable="true"]',
      'ytd-backstage-post-renderer-create [contenteditable="true"]',
    ];
    for (const sel of taSelectors) {
      const el = page.locator(sel).first();
      if (await el.count() > 0 && await el.isVisible()) {
        textArea = el;
        console.log(`  Composer text area found via: ${sel}`);
        break;
      }
    }
    if (!textArea) throw new Error('Could not find a visible YouTube composer text area after expanding. Check that the ytbot-profile is logged in and on the posts page.');

    // ── Paste body text ───────────────────────────────────────────────────────
    console.log(`Pasting body (${post.char_count} chars)...`);
    await textArea.click();
    await page.waitForTimeout(300);
    // insertText uses CDP Input.insertText — instant even for 3000+ chars
    await page.keyboard.insertText(post.body);
    console.log('Body pasted ✓');
    await page.waitForTimeout(500);

    // Scroll through to verify text is not truncated
    const pastedLength = await textArea.evaluate(el => el.innerText.length);
    if (pastedLength < post.body.length * 0.9) {
      throw new Error(`Pasted text appears truncated: expected ~${post.body.length} chars, got ${pastedLength}`);
    }
    console.log(`Body length verified in composer: ${pastedLength} chars ✓`);

    // ── Upload images (if any) ────────────────────────────────────────────────
    if (imagePaths.length > 0) {
      console.log(`\nUploading ${imagePaths.length} image(s)...`);

      // Click the Image button in the toolbar (NOT "Image poll")
      let imageBtn = null;
      const imageBtnSelectors = [
        '[aria-label="Image"]',
        '[aria-label="Photo"]',
        'button[aria-label*="mage"]:not([aria-label*="poll"])',
        '#create-image-post-button',
        'ytd-button-renderer:not([class*="poll"]) [aria-label*="mage"]',
      ];
      for (const sel of imageBtnSelectors) {
        const el = page.locator(sel).first();
        if (await el.count() > 0) {
          imageBtn = el;
          console.log(`  Image button found via: ${sel}`);
          break;
        }
      }
      if (!imageBtn) throw new Error('Could not find the Image upload button in the YouTube composer toolbar.');

      // Scroll into view — toolbar may be below the fold after text paste
      await imageBtn.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(500);
      try {
        await imageBtn.click({ timeout: 5000 });
      } catch {
        console.log('  Standard click failed — using JS click...');
        await imageBtn.evaluate(el => el.click());
      }
      console.log('  Clicked Image button ✓');
      await page.waitForTimeout(1500);

      // Use the FIRST file input (the multi-file one). The second one is "add more" and unreliable.
      const fileInputs = page.locator('input[type="file"]');
      await fileInputs.first().waitFor({ state: 'attached', timeout: 10000 });
      await fileInputs.first().setInputFiles(imagePaths);
      const uploadWait = randomBetween(6000, 10000);
      console.log(`  setInputFiles called — waiting ${Math.round(uploadWait / 1000)}s for YouTube thumbnail rendering...`);
      await page.waitForTimeout(uploadWait);

      // Verify thumbnail count — must match before we can post
      const thumbSelectors = [
        'ytd-backstage-multi-image-select-renderer img',
        '#post-image-attachment img',
        '#image-container img',
        '.image-attachment-container img',
      ];
      let thumbCount = 0;
      for (const sel of thumbSelectors) {
        const c = await page.locator(sel).count();
        if (c > 0) { thumbCount = c; console.log(`  Thumbnails via "${sel}": ${thumbCount}`); break; }
      }

      if (thumbCount < imagePaths.length) {
        console.log(`  Only ${thumbCount}/${imagePaths.length} thumbnails after 6s — waiting 4s more...`);
        await page.waitForTimeout(4000);
        for (const sel of thumbSelectors) {
          const c = await page.locator(sel).count();
          if (c > 0) { thumbCount = c; break; }
        }
      }

      if (thumbCount < imagePaths.length) {
        throw new Error(
          `Pre-post thumbnail check FAILED: expected ${imagePaths.length} thumbnails, got ${thumbCount}. ` +
          `Aborting — post would go live with missing images.`
        );
      }
      console.log(`  Thumbnail pre-post check ✓ (${thumbCount}/${imagePaths.length})`);
    }

    // ── Click Post ────────────────────────────────────────────────────────────
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before Post');
    console.log('\nClicking Post...');
    // The Post button is blue, at the bottom right of the composer
    let postBtn = page.getByRole('button', { name: /^Post$/ }).first();
    if (await postBtn.count() === 0) {
      postBtn = page.locator('#submit-button, button[aria-label="Post"], ytd-button-renderer:has-text("Post")').first();
    }
    await postBtn.waitFor({ timeout: 10000 });
    await postBtn.click();
    console.log('Post clicked ✓');

    // Wait for the composer to reset (text area returns to empty "What's on your mind?")
    console.log('Waiting for composer to clear (confirms submission)...');
    try {
      await page.waitForFunction(
        () => {
          const el = document.querySelector('#contenteditable-root, [contenteditable="true"]');
          return el && el.innerText.trim().length === 0;
        },
        { timeout: 15000 }
      );
      console.log('Composer cleared ✓');
    } catch {
      console.log('Composer-cleared signal not detected — proceeding to post-check anyway.');
      await page.waitForTimeout(4000);
    }

    // ── POST-CHECK ────────────────────────────────────────────────────────────
    const result = await verifyPosted(page, preUrls, post);

    if (!result.ok) {
      throw new Error(`Post-check FAILED: ${result.reason}`);
    }

    post.status    = 'posted';
    post.posted_at = new Date().toISOString();
    post.post_url  = result.url;
    delete post.error;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.log(`\nDone ✓  Post URL: ${result.url}`);

  } catch (err) {
    post.status = 'failed';
    post.error  = err.message;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    // Disconnect Playwright from Chrome; then close the Chrome window
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}

main();
