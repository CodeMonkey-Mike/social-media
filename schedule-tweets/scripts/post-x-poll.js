// post-x-poll.js — Posts one pending X poll from data/x-polls.json
// Same human-timing pattern as post-tweet.js (char delays, action pauses, pre-compose wait)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const POLLS_JSON     = path.join(__dirname, '..', 'data', 'x-polls.json');
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const PROFILE_URL    = 'https://x.com/mikeneder';

const CHAR_DELAY_MIN   = 60;
const CHAR_DELAY_MAX   = 150;
const ACTION_MIN       = 4000;
const ACTION_MAX       = 7000;
const PRE_COMPOSE_MIN  = 60000;
const PRE_COMPOSE_MAX  = 180000;
const PRE_POST_MIN     = 5000;
const PRE_POST_MAX     = 180000;

// [days, hours, minutes]
const DURATION_MAP = {
  '5m': [0, 0, 5],
  '1h': [0, 1, 0],
  '1d': [1, 0, 0],
  '7d': [7, 0, 0],
};

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

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(randomBetween(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

function textsMatch(a, b) {
  const normalize = s => s.replace(/\n{3,}/g, '\n\n').replace(/\n+$/, '').trim();
  return normalize(a) === normalize(b);
}

async function checkAlreadyPosted(page, poll) {
  console.log('Pre-check: scanning profile for duplicate...');
  try {
    await page.goto(PROFILE_URL);
    await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(randomBetween(3000, 5000));

    // Scroll down to trigger lazy-loading of posts below the fold
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(2000);

    const recentTexts = await page.evaluate(() => {
      const els = document.querySelectorAll('[data-testid="tweetText"]');
      return [...els].slice(0, 30).map(el => el.innerText.trim().toLowerCase());
    });

    const hook = (poll.hook || poll.tweet_text.split('\n')[0]).trim().toLowerCase().slice(0, 60);

    for (const text of recentTexts) {
      if (text.includes(hook)) {
        console.log(`  Duplicate found: "${text.slice(0, 80)}"`);
        return true;
      }
    }
    console.log(`  Not found in ${recentTexts.length} recent posts ✓`);
    return false;
  } catch (err) {
    console.log(`  Pre-check error (ignoring): ${err.message}`);
    return false;
  }
}

async function setPollDuration(page, duration) {
  const [days, hours, minutes] = DURATION_MAP[duration] || DURATION_MAP['1d'];
  console.log(`  Setting duration: ${duration} → ${days}d ${hours}h ${minutes}m`);

  // Confirmed data-testid values from live DOM inspection (2026-05-20)
  const dSel = '[data-testid="selectPollDays"]';
  const hSel = '[data-testid="selectPollHours"]';
  const mSel = '[data-testid="selectPollMinutes"]';

  const dEl = page.locator(dSel).first();
  if (await dEl.count() > 0) {
    await dEl.selectOption({ value: String(days) });
    await page.waitForTimeout(randomBetween(700, 1200));

    // When days = 7, X disables Hours and Minutes (max duration is 7d 0h 0m).
    // Skip setting them when disabled.
    const hLoc = page.locator(hSel).first();
    const hDisabled = await hLoc.evaluate(el => el.disabled).catch(() => true);
    if (!hDisabled) {
      await hLoc.selectOption({ value: String(hours) });
      await page.waitForTimeout(randomBetween(700, 1200));
    } else {
      console.log('  Hours select disabled (max duration reached) — skipping');
    }

    const mLoc = page.locator(mSel).first();
    const mDisabled = await mLoc.evaluate(el => el.disabled).catch(() => true);
    if (!mDisabled) {
      await mLoc.selectOption({ value: String(minutes) });
    } else {
      console.log('  Minutes select disabled — skipping');
    }
    console.log('  Duration set ✓');
    return;
  }

  console.log('  Warning: duration selects not found — using default (1d)');
}

async function main() {
  const data = JSON.parse(fs.readFileSync(POLLS_JSON, 'utf8'));

  // Reset any stuck "posting" entry so it gets retried
  for (const p of data.polls) {
    if (p.status === 'posting') {
      console.log(`Resetting stuck poll → pending: ${p.id}`);
      p.status = 'pending';
    }
  }

  const poll = data.polls.find(p => p.status === 'pending');
  if (!poll) {
    console.log('No pending polls. Exiting.');
    return;
  }

  // Validate option lengths (X cap: 25 chars)
  for (const [i, opt] of poll.options.entries()) {
    if (opt.length > 25) {
      console.warn(`  Warning: option ${i + 1} is ${opt.length} chars (> 25): "${opt}"`);
    }
  }

  console.log(`\nPoll: "${poll.hook}"`);
  console.log(`Text: ${poll.tweet_text.length} chars`);
  console.log(`Options (${poll.options.length}): [${poll.options.join(' | ')}]`);
  console.log(`Duration: ${poll.duration}`);

  poll.status = 'posting';
  fs.writeFileSync(POLLS_JSON, JSON.stringify(data, null, 2));

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
    // Confirm logged in
    await page.goto('https://x.com/home');
    await page.waitForLoadState('load');

    const state = await Promise.race([
      page.waitForSelector('[data-testid="primaryColumn"]',  { timeout: 30000 }).then(() => 'home'),
      page.waitForSelector('input[autocomplete="username"]', { timeout: 30000 }).then(() => 'login'),
    ]).catch(() => 'unknown');

    if (state !== 'home') {
      throw new Error(`X home feed not loaded (state: ${state}). Check xbot-profile is logged in.`);
    }
    console.log('Home feed loaded.');

    // Pre-check on profile page
    const duplicate = await checkAlreadyPosted(page, poll);
    if (duplicate) {
      poll.status    = 'posted';
      poll.posted_at = new Date().toISOString();
      poll.note      = 'Already posted — detected in pre-check';
      fs.writeFileSync(POLLS_JSON, JSON.stringify(data, null, 2));
      console.log('Marked as posted (duplicate). Done.');
      return;
    }

    // Back to home before composing
    await page.goto('https://x.com/home');
    await page.waitForLoadState('load');
    await page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 15000 });

    // Pre-compose wait
    console.log('\nPre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    // Open composer
    const composeBtn = page.locator('[data-testid="SideNav_NewTweet_Button"]');
    await mouseClick(page, composeBtn);
    await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
    await actionPause(page, 'composer open');

    // Type tweet text
    const textarea = page.locator('[data-testid="tweetTextarea_0"]').first();
    await textarea.click();
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(500);

    console.log(`Typing tweet text (${poll.tweet_text.length} chars)...`);
    await typeHuman(page, poll.tweet_text);
    await page.waitForTimeout(1000);

    const typed = await textarea.evaluate(el => el.innerText);
    if (!textsMatch(typed, poll.tweet_text)) {
      throw new Error(`Text verification failed.\nExpected: ${JSON.stringify(poll.tweet_text)}\nGot:      ${JSON.stringify(typed)}`);
    }
    console.log('Tweet text verified ✓');
    await actionPause(page, 'after typing');

    // Click the poll button in the composer toolbar
    // Confirmed data-testid from live DOM inspection (2026-05-20): "createPollButton"
    console.log('Opening poll widget...');
    const pollBtn = page.locator('[data-testid="createPollButton"]').first();
    if (await pollBtn.count() === 0) throw new Error('Poll button (createPollButton) not found in composer.');
    await mouseClick(page, pollBtn);

    // Wait for poll duration select — confirms widget is fully open
    await page.waitForSelector('[data-testid="selectPollDays"]', { timeout: 10000 });
    await actionPause(page, 'poll widget open');

    // Choice inputs have NO placeholder and NO data-testid (confirmed from DOM inspection).
    // They're the only text inputs matching this pattern in the composer.
    const CHOICE_SEL = 'input[type="text"]:not([data-testid]):not([placeholder])';

    // Fill each option
    console.log('Filling poll options...');
    for (let i = 0; i < poll.options.length; i++) {
      // Options 3 and 4 need "Add a choice" clicked first
      // Confirmed data-testid from live DOM inspection (2026-05-20): "addPollChoice"
      if (i >= 2) {
        const addBtn = page.locator('[data-testid="addPollChoice"]').first();
        if (await addBtn.count() === 0) throw new Error(`"Add a choice" button not found for option ${i + 1}`);
        await mouseClick(page, addBtn);
        await page.waitForTimeout(randomBetween(1000, 2000));
        await page.waitForFunction(
          ({ sel, count }) => document.querySelectorAll(sel).length >= count,
          { sel: CHOICE_SEL, count: i + 1 },
          { timeout: 6000 }
        );
        console.log(`  Added choice ${i + 1}`);
      }

      const input = page.locator(CHOICE_SEL).nth(i);
      await input.click();
      await page.waitForTimeout(randomBetween(500, 1000));

      console.log(`  Typing option ${i + 1}: "${poll.options[i]}"`);
      await typeHuman(page, poll.options[i]);

      const val = await input.evaluate(el => el.value);
      console.log(`  Option ${i + 1} confirmed: "${val}" ✓`);
      await page.waitForTimeout(randomBetween(600, 1200));
    }

    // Always post with 7-day duration regardless of what's in the JSON
    await setPollDuration(page, '7d');
    await actionPause(page, 'after poll config');

    // Pre-post wait
    console.log('\nPre-post wait...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post');

    // Click Post
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

    if (!clicked) throw new Error('Post button not found or still disabled.');
    console.log('Clicked Post. Waiting for toast...');

    // Grab URL from confirmation toast
    const toast = page.locator('[data-testid="toast"]');
    await toast.waitFor({ timeout: 15000 });

    const pollUrl = await toast.evaluate(el => {
      const a = el.querySelector('a[href*="/status/"]');
      return a ? 'https://x.com' + a.getAttribute('href') : null;
    });

    if (pollUrl) {
      console.log(`\nPoll live at: ${pollUrl}`);
    } else {
      console.log('\nPoll live — could not extract URL from toast.');
    }

    poll.status    = 'posted';
    poll.posted_at = new Date().toISOString();
    poll.poll_url  = pollUrl;
    delete poll.error;
    fs.writeFileSync(POLLS_JSON, JSON.stringify(data, null, 2));
    console.log('x-polls.json updated. Done ✓');

  } catch (err) {
    poll.status = 'failed';
    poll.error  = err.message;
    fs.writeFileSync(POLLS_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
