const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TWEETS_JSON   = path.join(__dirname, '..', 'data', 'x-tweets.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const WORKSPACE_ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets';

const CHAR_DELAY_MIN   = 60;
const CHAR_DELAY_MAX   = 150;
const ACTION_MIN       = 4000;
const ACTION_MAX       = 7000;
const PRE_COMPOSE_MIN  = +(process.env.XT_PRE_COMPOSE_MIN || 60000);
const PRE_COMPOSE_MAX  = +(process.env.XT_PRE_COMPOSE_MAX || 180000);
const PRE_POST_MIN     = +(process.env.XT_PRE_POST_MIN    || 5000);
const PRE_POST_MAX     = +(process.env.XT_PRE_POST_MAX    || 180000);

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

async function mouseClick(page, locator) {
  const bbox = await locator.boundingBox();
  if (bbox && bbox.width > 0) {
    await page.mouse.click(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
  } else {
    await locator.click();
  }
}

function textsMatch(a, b) {
  const normalize = s => s.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '').trim();
  return normalize(a) === normalize(b);
}

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(randomBetween(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

function resolveImagePath(tweet) {
  if (!tweet.image_id) return null;

  // Try image_path field first
  if (tweet.image_path) {
    // image_path is relative to workspace root, e.g. "schedule-tweets/images/x/..."
    // Strip leading "schedule-tweets/" since WORKSPACE_ROOT already points there
    const rel = tweet.image_path.replace(/^schedule-tweets[\\/]/, '');
    const abs = path.join(WORKSPACE_ROOT, rel);
    if (fs.existsSync(abs)) return abs;
  }

  // Fallback: glob for <image_id>-*.png in images/x/
  const xDir = path.join(WORKSPACE_ROOT, 'images', 'x');
  if (fs.existsSync(xDir)) {
    const files = fs.readdirSync(xDir);
    const match = files.find(f => f.includes(tweet.image_id));
    if (match) return path.join(xDir, match);
  }

  return null;
}

async function attachImage(page, imagePath) {
  console.log(`  Attaching image: ${imagePath}`);

  // X's composer has a hidden file input; Playwright can target it directly
  // Use .first() — the page has two fileInput elements (modal + inline home composer)
  const fileInput = page.locator('input[data-testid="fileInput"]').first();
  const count = await fileInput.count();

  if (count === 0) {
    console.log('  Warning: fileInput not found — posting without image.');
    return false;
  }

  await fileInput.setInputFiles(imagePath);
  // Wait for upload preview to appear
  await page.waitForTimeout(3000);

  // Verify thumbnail rendered
  const preview = page.locator('[data-testid="attachments"]');
  const previewCount = await preview.count();
  if (previewCount > 0) {
    console.log('  Image attached ✓');
    return true;
  }

  console.log('  Warning: image thumbnail did not appear — proceeding without image.');
  return false;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  const tweet = data.tweets.find(t => t.tweet && t.status === 'pending');

  if (!tweet) {
    console.log('No pending tweets. Exiting.');
    return;
  }

  console.log(`Tweet: "${tweet.hook}"`);
  console.log(`Chars: ${tweet.tweet.length}`);

  if (tweet.tweet.length > 25000) {
    tweet.status = 'skipped-too-long';
    fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
    console.log('Skipped — exceeds 25,000 chars.');
    return;
  }

  const imagePath = resolveImagePath(tweet);
  if (tweet.image_id && !imagePath) {
    console.log(`  Warning: image_id ${tweet.image_id} set but file not found — will post without image.`);
  } else if (imagePath) {
    console.log(`  Image: ${imagePath}`);
  }

  tweet.status = 'posting';
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));

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
    await page.goto('https://x.com/home');
    await page.waitForLoadState('load');

    const state = await Promise.race([
      page.waitForSelector('[data-testid="primaryColumn"]',  { timeout: 30000 }).then(() => 'home'),
      page.waitForSelector('input[autocomplete="username"]', { timeout: 30000 }).then(() => 'login'),
    ]).catch(() => 'unknown');

    if (state !== 'home') {
      throw new Error(`X did not load the home feed (state: ${state}). Check that xbot-profile is logged in.`);
    }
    console.log('Home feed loaded.');

    // Open composer
    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
    await mouseClick(page, composeBtn);
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
    await actionPause(page, 'composer open');

    // Type the tweet
    const textarea = page.locator('[data-testid="tweetTextarea_0"]').first();
    await textarea.click();
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(500);

    console.log(`Typing tweet (${tweet.tweet.length} chars)...`);
    await typeHuman(page, tweet.tweet);
    await page.waitForTimeout(1000);

    const typed = await textarea.evaluate(el => el.innerText);
    if (!textsMatch(typed, tweet.tweet)) {
      throw new Error(`Verification failed.\nExpected: ${JSON.stringify(tweet.tweet)}\nGot:      ${JSON.stringify(typed)}`);
    }
    console.log('Tweet text verified ✓');

    // Attach image if present
    if (imagePath) {
      await attachImage(page, imagePath);
    }

    // Post
    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post');

    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="tweetButton"]'));
      const visible = btns.find(b =>
        b.offsetParent !== null &&
        b.getBoundingClientRect().width > 0 &&
        !b.disabled
      );
      if (visible) { visible.click(); return true; }
      return false;
    });

    if (!clicked) throw new Error('Post button not found.');
    console.log('Clicked Post. Waiting for confirmation toast...');

    const toast = page.locator('[data-testid="toast"]');
    await toast.waitFor({ timeout: 15000 });

    const tweetUrl = await toast.evaluate(el => {
      const a = el.querySelector('a[href*="/status/"]');
      return a ? 'https://x.com' + a.getAttribute('href') : null;
    });

    if (tweetUrl) {
      console.log(`Tweet live at: ${tweetUrl}`);
    } else {
      console.log('Tweet live — could not extract URL from toast.');
    }

    tweet.status    = 'posted';
    tweet.posted_at = new Date().toISOString();
    tweet.url       = tweetUrl;
    if (!tweet.hook) {
      tweet.hook = tweet.tweet.split('\n')[0].slice(0, 100);
    }
    fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
    console.log('x-tweets.json updated. Done.');

  } catch (err) {
    tweet.status = 'failed';
    tweet.error  = err.message;
    fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
