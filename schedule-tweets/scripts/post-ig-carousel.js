const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const IG_JSON        = path.join(__dirname, '..', 'data', 'ig-carousel.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\igbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';
const IG_USERNAME    = 'realcodemonkeymike';

const ACTION_MIN      = 1000;
const ACTION_MAX      = 5000;
const CHAR_DELAY_MIN  = 5;
const CHAR_DELAY_MAX  = 40;
const PRE_COMPOSE_MIN = 1000;
const PRE_COMPOSE_MAX = 15000;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function longWait(page, minMs, maxMs, label = '') {
  const ms = randomBetween(minMs, maxMs);
  console.log(`  waiting ${Math.round(ms / 1000)}s${label ? ` (${label})` : ''}...`);
  await page.waitForTimeout(ms);
}

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(randomBetween(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

function resolveImagePath(slide) {
  if (slide.image_path) {
    const rel = slide.image_path.replace(/^schedule-tweets[\\/]/, '');
    const abs = path.join(WORKSPACE_ROOT, rel);
    if (fs.existsSync(abs)) return abs;
    console.log(`  image_path doesn't resolve (${abs}) — falling back to glob`);
  }
  if (slide.image_id) {
    for (const dir of ['images/ig', 'images/x', 'images/yt']) {
      const fullDir = path.join(WORKSPACE_ROOT, dir);
      if (!fs.existsSync(fullDir)) continue;
      const match = fs.readdirSync(fullDir).find(f => f.includes(slide.image_id));
      if (match) return path.join(fullDir, match);
    }
  }
  return null;
}

async function mouseClick(page, locator) {
  const bbox = await locator.boundingBox();
  if (bbox && bbox.width > 0) {
    await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
  } else {
    await locator.click();
  }
}

async function clickNext(page, stepLabel) {
  console.log(`  Clicking Next (${stepLabel})...`);
  let btn = page.getByRole('button', { name: 'Next' });
  if (await btn.count() === 0) btn = page.locator('button:has-text("Next")').first();
  await btn.waitFor({ timeout: 10000 });
  await mouseClick(page, btn);
  await page.waitForTimeout(2000);
}

// Returns the most recent post URLs from the profile grid (up to `count`)
async function getRecentPostUrls(page, count = 5) {
  await page.goto(`https://www.instagram.com/${IG_USERNAME}/`);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  return page.evaluate((n) =>
    [...document.querySelectorAll('a[href*="/p/"]')].slice(0, n).map(a => a.href),
  count);
}

// Fetches caption (via og:description), timestamp, and carousel signals from a post page.
//
// IG carousel detection: the slide-dot buttons (aria-label="Go to slide N") do NOT
// render until the user interacts with the post, so they're useless as a post-check
// signal on a freshly opened URL. The reliable signal is the "Next" arrow button —
// it only exists on multi-image posts and renders immediately on page load.
async function inspectPost(page, url) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  return page.evaluate(() => {
    const og   = document.querySelector('meta[property="og:description"]');
    const t    = document.querySelector('time');
    const dots = document.querySelectorAll('button[aria-label*="Go to slide"]').length
              || document.querySelectorAll('button[aria-label*="Go to"]').length;
    // Carousel arrow: only present on multi-image posts; renders immediately.
    const hasNext = !!document.querySelector('button[aria-label="Next"]');
    return {
      caption:    og ? og.getAttribute('content') : '',
      timestamp:  t  ? t.getAttribute('datetime')  : null,
      slideCount: dots,
      isCarousel: hasNext || dots >= 2,
    };
  });
}

// PRE-CHECK: scan last 5 posts for a matching hook → returns existing url or null
async function checkAlreadyPosted(page, hook) {
  console.log('\nPre-check: scanning recent profile posts for duplicates...');
  const hookSnippet = hook.slice(0, 40);
  const urls = await getRecentPostUrls(page, 5);
  console.log(`  Checking ${urls.length} recent posts against hook: "${hookSnippet}"`);

  for (const url of urls) {
    const info = await inspectPost(page, url);
    if (info.caption && info.caption.includes(hookSnippet)) {
      console.log(`  DUPLICATE FOUND at ${url}`);
      return url;
    }
    console.log(`  Not a match: ${url}`);
  }
  console.log('  No duplicate found. Safe to post.\n');
  return null;
}

// POST-CHECK: find new post URL, verify timestamp freshness, caption, and slide count
async function verifyPosted(page, preUrls, post, expectedSlides) {
  console.log('\nPost-check: verifying post on profile...');

  const newUrls = await getRecentPostUrls(page, 5);
  const newUrl  = newUrls.find(u => !preUrls.includes(u)) || newUrls[0];

  if (!newUrl) return { ok: false, reason: 'No posts found on profile after posting' };

  console.log(`  Inspecting: ${newUrl}`);
  const info = await inspectPost(page, newUrl);

  // Must be less than 15 minutes old
  const ageMs = info.timestamp ? Date.now() - new Date(info.timestamp).getTime() : Infinity;
  if (ageMs > 15 * 60 * 1000) {
    return { ok: false, url: newUrl, reason: `Most recent post is ${Math.round(ageMs / 60000)}m old — likely not ours`, info };
  }

  // Hook must appear in caption (fall back to first line of caption if no hook field)
  const hookSrc = post.hook || (post.caption || '').split('\n')[0];
  const hookSnippet = hookSrc.slice(0, 40);
  if (info.caption && !info.caption.includes(hookSnippet)) {
    return { ok: false, url: newUrl, reason: `Hook "${hookSnippet}" not found in caption`, info };
  }

  // Carousel: must have the "Next" arrow OR ≥2 slide dots. The dots don't render
  // until the user interacts with the post, so isCarousel (via aria-label="Next")
  // is the reliable signal; slideCount is kept as a secondary signal for older
  // IG layouts where dots happen to be in the initial DOM.
  if (expectedSlides > 1 && !info.isCarousel) {
    return { ok: false, url: newUrl, reason: `Expected carousel (${expectedSlides} slides) but no "Next" arrow or slide dots found — possible single-image upload`, info };
  }

  console.log(`  Verified ✓  (age: ${Math.round(ageMs / 1000)}s, caption match: yes, carousel: ${info.isCarousel}, dots: ${info.slideCount})`);
  return { ok: true, url: newUrl, info };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(IG_JSON, 'utf8'));
  const post = data.posts.find(p => p.status === 'pending');

  if (!post) {
    console.log('No pending Instagram carousel posts. Exiting.');
    return;
  }

  // Handle both `slides` and `images` field names — data file uses `images`
  post.slides = post.slides || post.images || [];
  const hook = post.hook || (post.caption || '').split('\n')[0].slice(0, 60);
  console.log(`Post: "${hook}"`);
  console.log(`Slides: ${post.slides.length}`);

  // Resolve all slide image paths up front
  const imagePaths = [];
  for (const slide of post.slides.sort((a, b) => a.seq - b.seq)) {
    const abs = resolveImagePath(slide);
    if (!abs) {
      console.error(`FATAL: image not found for slide seq=${slide.seq} (image_id: ${slide.image_id})`);
      process.exit(1);
    }
    console.log(`  Slide ${slide.seq}: ${path.basename(abs)}`);
    imagePaths.push(abs);
  }

  const hashtags   = (post.hashtags || []).join(' ');
  const fullCaption = post.caption + (hashtags ? '\n\n' + hashtags : '');
  console.log(`Caption: ${fullCaption.length} chars`);

  console.log('Launching Chrome...');
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
    // ── Login check ───────────────────────────────────────────────────────────
    console.log('Navigating to Instagram...');
    await page.goto('https://www.instagram.com/');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (await page.locator('input[name="username"], input[autocomplete="username"]').count() > 0) {
      throw new Error('Instagram login form detected — not logged in.');
    }
    console.log('Instagram home loaded ✓');

    // ── PRE-CHECK ─────────────────────────────────────────────────────────────
    const duplicateUrl = await checkAlreadyPosted(page, hook);
    if (duplicateUrl) {
      console.log(`Post already exists at ${duplicateUrl}. Marking as posted and exiting.`);
      post.status    = 'posted';
      post.posted_at = post.posted_at || new Date().toISOString();
      post.post_url  = duplicateUrl;
      fs.writeFileSync(IG_JSON, JSON.stringify(data, null, 2));
      await browser.close();
      return;
    }

    // Save pre-posting URL list for post-check diff
    const preUrls = await getRecentPostUrls(page, 5);

    // Navigate back to home for the Create flow
    await page.goto('https://www.instagram.com/');
    await page.waitForTimeout(1500);

    // Mark mid-flight
    post.status = 'posting';
    fs.writeFileSync(IG_JSON, JSON.stringify(data, null, 2));

    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    // ── Open Create → Post ────────────────────────────────────────────────────
    console.log('Looking for Create button...');
    let createBtn = null;
    for (const sel of ['a[href="/create/select-type/"]', '[aria-label="New post"]', '[aria-label="Create"]']) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) { createBtn = el; console.log(`  Found via: ${sel}`); break; }
    }
    if (!createBtn) createBtn = page.locator('text="Create"').first();
    await mouseClick(page, createBtn);
    await page.waitForTimeout(2000);

    console.log('  Clicking Post from expanded sidebar...');
    let postLink = page.getByRole('link', { name: /^Post$/ }).or(page.getByRole('button', { name: /^Post$/ })).first();
    if (await postLink.count() === 0) postLink = page.locator('a, button, span, div').filter({ hasText: /^Post$/ }).first();
    if (await postLink.count() > 0) { await mouseClick(page, postLink); console.log('  Clicked Post ✓'); }
    await page.waitForTimeout(1500);

    // ── Upload all slides at once ──────────────────────────────────────────────
    console.log(`Uploading ${imagePaths.length} images...`);
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 10000 });
    await fileInput.setInputFiles(imagePaths);
    console.log('  setInputFiles called — waiting for preview...');
    await page.waitForTimeout(4000);

    // If IG shows "Select multiple" toggle (single-image default), enable it and re-upload
    const multiBtn = page.locator('[aria-label="Select multiple"], button:has-text("Select multiple")').first();
    if (await multiBtn.count() > 0) {
      console.log('  "Select multiple" found — enabling carousel mode...');
      await mouseClick(page, multiBtn);
      await page.waitForTimeout(2000);
      const fileInput2 = page.locator('input[type="file"]').first();
      await fileInput2.waitFor({ state: 'attached', timeout: 10000 });
      await fileInput2.setInputFiles(imagePaths);
      console.log('  Re-uploaded all slides ✓');
      await page.waitForTimeout(4000);
    }

    // ── Next (Crop) → Next (Filter) ───────────────────────────────────────────
    await clickNext(page, 'Crop');
    await page.waitForTimeout(1000);
    await clickNext(page, 'Filter/Edit');
    await page.waitForTimeout(1000);

    // ── Caption ───────────────────────────────────────────────────────────────
    console.log('Typing caption...');
    const captionArea = page.locator(
      '[aria-label="Write a caption..."], textarea[placeholder*="caption"], [contenteditable][placeholder*="caption"]'
    ).first();
    await captionArea.waitFor({ timeout: 10000 });
    await captionArea.click();
    await page.waitForTimeout(300);
    await typeHuman(page, fullCaption);
    console.log('Caption typed ✓');
    await page.waitForTimeout(500);

    const captionContent = await captionArea.evaluate(el => el.value || el.innerText || '');
    if (!captionContent.trim()) throw new Error('Caption field is empty before sharing — aborting.');
    console.log(`Caption verified in composer (${captionContent.length} chars) ✓`);

    // ── Share ─────────────────────────────────────────────────────────────────
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before Share');
    console.log('Clicking Share...');
    const shareBtn = page.getByRole('button', { name: 'Share' }).first();
    await shareBtn.waitFor({ timeout: 10000 });
    await mouseClick(page, shareBtn);

    console.log('Waiting for share confirmation...');
    try {
      await page.waitForSelector('text="Your post has been shared.", text="Post shared"', { timeout: 30000 });
      console.log('Instagram confirmation dialog seen ✓');
    } catch {
      console.log('Confirmation dialog not detected — proceeding to post-check.');
      await page.waitForTimeout(4000);
    }

    // ── POST-CHECK ────────────────────────────────────────────────────────────
    const result = await verifyPosted(page, preUrls, post, post.slides.length);

    if (!result.ok) {
      throw new Error(`Post-check FAILED: ${result.reason}`);
    }

    post.status    = 'posted';
    post.posted_at = new Date().toISOString();
    post.post_url  = result.url;
    delete post.error;
    fs.writeFileSync(IG_JSON, JSON.stringify(data, null, 2));
    console.log(`\nDone ✓  Post URL: ${result.url}`);

  } catch (err) {
    post.status = 'failed';
    post.error  = err.message;
    fs.writeFileSync(IG_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
