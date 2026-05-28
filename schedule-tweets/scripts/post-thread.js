const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const THREADS_JSON = path.join(__dirname, '..', 'data', 'x-threads.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';

// Timing constants — mirrored from reply-guy post_replies.py
const CHAR_DELAY_MIN   = 60;    // ms per keystroke
const CHAR_DELAY_MAX   = 150;
const ACTION_MIN       = 4000;  // ms between UI actions
const ACTION_MAX       = 7000;
const PRE_COMPOSE_MIN  = 60000; // ms before opening composer (60–180s)
const PRE_COMPOSE_MAX  = 180000;
const PRE_POST_MIN     = 60000; // ms before clicking Post all
const PRE_POST_MAX     = 180000;

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

async function clickPostButton(page) {
  return page.evaluate(() => {
    const testids = ['tweetButton'];
    for (const tid of testids) {
      const btns = Array.from(document.querySelectorAll(`[data-testid="${tid}"]`));
      const visible = btns.find(b =>
        b.offsetParent !== null &&
        b.getBoundingClientRect().width > 0 &&
        !b.disabled
      );
      if (visible) { visible.click(); return tid; }
    }
    return null;
  });
}

async function main() {
  const data = JSON.parse(fs.readFileSync(THREADS_JSON, 'utf8'));

  // Bail if anything is stuck in 'posting' — those need manual review. The
  // prior behavior auto-picked up 'posting' threads, which would re-post any
  // thread whose prior run died after submission but before status flipped.
  const stuck = data.threads.filter(t => t.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} thread(s) stuck in 'posting' — manual review required:`);
    for (const t of stuck) console.error(`  - ${t.id}: "${(t.tweets?.[0]?.text || '').slice(0, 60)}"`);
    console.error('Check x.com to see if any actually published, then update data/x-threads.json before retrying.');
    process.exit(2);
  }

  const thread = data.threads.find(t => t.status === 'pending');

  if (!thread) {
    console.log('No eligible threads. Exiting.');
    return;
  }

  console.log(`Processing: ${thread.id} (status: ${thread.status})`);
  const tweets = thread.tweets;

  for (const t of tweets) {
    if (t.char_count > 25000) {
      thread.status = 'failed';
      thread.validation_error = `Tweet ${t.position} exceeds 25,000 chars`;
      fs.writeFileSync(THREADS_JSON, JSON.stringify(data, null, 2));
      console.error(thread.validation_error);
      process.exit(1);
    }
  }

  thread.status = 'posting';
  fs.writeFileSync(THREADS_JSON, JSON.stringify(data, null, 2));

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

    // Duplicate check — scan visible tweet texts for the first ~40 chars of tweet 1
    const hook = tweets[0].text.slice(0, 40);
    const tweetTexts = await page.locator('[data-testid="tweetText"]').allTextContents();
    if (tweetTexts.some(t => t.startsWith(hook))) {
      console.log('Duplicate detected — thread already live. Marking posted, exiting.');
      thread.status = 'posted';
      fs.writeFileSync(THREADS_JSON, JSON.stringify(data, null, 2));
      return;
    }

    // Open composer
    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
    await mouseClick(page, composeBtn);
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
    await actionPause(page, 'composer open');

    // Tweet 1 — .first() because the home feed has an inline tweetTextarea_0 too
    console.log(`Typing tweet 1/${tweets.length} (${tweets[0].char_count} chars)...`);
    const first = page.locator('[data-testid="tweetTextarea_0"]').first();
    await first.click();
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(500);
    await typeHuman(page, tweets[0].text);
    await page.waitForTimeout(1000);

    const got0 = await first.evaluate(el => el.innerText);
    if (!textsMatch(got0, tweets[0].text)) {
      throw new Error(`Tweet 1 verification failed.\nExpected: ${JSON.stringify(tweets[0].text)}\nGot:      ${JSON.stringify(got0)}`);
    }
    console.log('Tweet 1 verified ✓');

    // Tweets 2–N
    for (let i = 1; i < tweets.length; i++) {
      await actionPause(page, 'before addButton');

      // Target only the <BUTTON> with addButton testid — the nav link is an <A>, so
      // the `button` tag selector naturally excludes it without needing ancestor scoping.
      const addBtn = page.locator('button[data-testid="addButton"]');
      await mouseClick(page, addBtn);

      await page.waitForSelector(`[data-testid="tweetTextarea_${i}"]`, { timeout: 10000 });
      await actionPause(page, `textarea ${i} ready`);

      const ta = page.locator(`[data-testid="tweetTextarea_${i}"]`);
      await ta.click();
      await page.keyboard.press('Control+Home');
      await page.waitForTimeout(500);
      console.log(`Typing tweet ${i + 1}/${tweets.length} (${tweets[i].char_count} chars)...`);
      await typeHuman(page, tweets[i].text);
      await page.waitForTimeout(1000);

      const got = await ta.evaluate(el => el.innerText);
      if (!textsMatch(got, tweets[i].text)) {
        throw new Error(`Tweet ${i + 1} verification failed.\nExpected: ${JSON.stringify(tweets[i].text)}\nGot:      ${JSON.stringify(got)}`);
      }
      console.log(`Tweet ${i + 1} verified ✓`);
    }

    // Post
    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post all');

    const clicked = await clickPostButton(page);
    if (!clicked) throw new Error('Post button not found via JS evaluate');
    console.log(`Clicked Post button (${clicked}). Waiting for confirmation toast...`);

    const toast = page.locator('[data-testid="toast"]');
    await toast.waitFor({ timeout: 15000 });

    // Extract the tweet URL from the "View" anchor inside the toast before clicking anything.
    // Clicking the toast itself navigates to /home on some X versions — the href is more reliable.
    const rootUrl = await toast.evaluate(el => {
      const a = el.querySelector('a[href*="/status/"]');
      return a ? 'https://x.com' + a.getAttribute('href') : null;
    });

    if (rootUrl) {
      console.log(`Thread live at: ${rootUrl}`);
    } else {
      console.log('Thread live — could not extract URL from toast.');
    }

    // ── Post-publish verification: walk the thread root page ──────────────────
    // Confirms every tweet in the thread actually rendered live AND captures
    // individual posted_url for each. Without this, a partial-thread silent
    // failure (first tweet posted, replies dropped) still produces a valid root
    // URL and marks all N tweets as posted. End-of-flow goto is acceptable
    // here — the post is already submitted and the browser closes after.
    let verified = false;
    const perTweetUrls = new Array(tweets.length).fill(null);

    if (rootUrl) {
      console.log(`\nVerifying thread on root page: ${rootUrl}`);
      try {
        const resp = await page.goto(rootUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const httpStatus = resp ? resp.status() : 0;
        console.log(`  HTTP ${httpStatus}`);
        await page.waitForTimeout(randomBetween(3500, 5500));

        // Snapshot articles + their text + their status URL
        const onPage = await page.evaluate(() => {
          const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
          return articles.map(a => {
            const textEl = a.querySelector('[data-testid="tweetText"]');
            const linkEl = a.querySelector('a[href*="/status/"][role="link"]');
            return {
              text: textEl ? textEl.innerText : '',
              href: linkEl ? linkEl.getAttribute('href') : null,
            };
          });
        });
        console.log(`  Found ${onPage.length} tweet articles on page (expected ${tweets.length})`);

        const norm = s => s.replace(/\s+/g, ' ').trim();
        let matched = 0;
        for (let i = 0; i < tweets.length; i++) {
          const expected = norm(tweets[i].text.slice(0, 40));
          const hit = onPage.find(o => norm(o.text).includes(expected));
          if (hit && hit.href) {
            perTweetUrls[i] = 'https://x.com' + hit.href;
            matched++;
          }
        }
        console.log(`  Matched ${matched}/${tweets.length} tweets by text snippet`);

        if (httpStatus >= 200 && httpStatus < 400 && matched === tweets.length) {
          verified = true;
          console.log('  Verified ✓ — every thread tweet is live');
        } else {
          console.log(`  Verification failed — ${tweets.length - matched} tweet(s) missing on the page`);
        }
      } catch (e) {
        console.log(`  Verification error: ${e.message}`);
      }
    } else {
      console.log('  Skipping verification — no root URL captured');
    }

    // Gate status on verification
    thread.thread_root_url = rootUrl;
    thread.posted_at = new Date().toISOString();
    for (let i = 0; i < tweets.length; i++) {
      if (perTweetUrls[i]) tweets[i].posted_url = perTweetUrls[i];
    }
    if (rootUrl && verified) {
      thread.status = 'posted';
      delete thread.error;
      console.log('threads.json updated (verified posted). Done.');
    } else {
      thread.status = 'failed';
      thread.error = rootUrl
        ? `Root captured but verification failed — possible partial thread: ${rootUrl}`
        : 'No root URL captured';
      console.log(`threads.json marked failed: ${thread.error}`);
    }
    fs.writeFileSync(THREADS_JSON, JSON.stringify(data, null, 2));

  } catch (err) {
    thread.status = 'failed';
    thread.error = err.message;
    fs.writeFileSync(THREADS_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
