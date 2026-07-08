// YouTube text-poll poster.
// Working approach (2026-05-21):
//   • Use #poll-button button (NOT [aria-label="Poll"] — that matches feed elements).
//   • After clicking, the poll attachment becomes visible and host inputs have real dimensions.
//   • Mouse-click on host coordinates focuses the inner input.
//   • page.keyboard.type() sends real CDP keystrokes — Polymer's two-way binding picks them up
//     AND YouTube's submission state is updated (insertText doesn't update submission state).
//   • The DOM has two button[aria-label="Post"]: a hidden placeholder (0x0, disabled) and the
//     real visible Post button (61x36, lower-right of composer). Pick the one with non-zero rect.
//
// Timing mirrors scripts/post-thread.js — character-by-character typing for question AND options,
// 60–180s pre-composer / pre-post pauses, 4–7s between UI actions.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');

const YT_JSON        = path.join(__dirname, '..', 'data', 'yt-text-polls.json');
const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const CHANNEL_HANDLE = 'CodeMonkeyMike';
const POSTS_URL      = `https://www.youtube.com/@${CHANNEL_HANDLE}/posts`;
const HOST_SEL       = 'tp-yt-paper-input.poll-option-input';

// Timing constants — mirrored from scripts/post-thread.js
const CHAR_DELAY_MIN  = 60;     // ms per keystroke
const CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 2000;   // ms between UI actions (halved 2026-06-14)
const ACTION_MAX      = 3500;
const PRE_COMPOSE_MIN = 30000;  // ms before opening composer (30–90s, halved 2026-06-14)
const PRE_COMPOSE_MAX = 90000;
const PRE_POST_MIN    = 30000;  // ms before clicking Post (30–90s, halved 2026-06-14)
const PRE_POST_MAX    = 90000;

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

async function typeHuman(page, text) {
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(randomBetween(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
}

// Click that survives composer overlays / custom Polymer handlers: try Playwright's
// actionability-checked click, fall back to a native JS click dispatched on the element.
async function robustClick(locator, label = '') {
  try {
    await locator.click({ timeout: 5000 });
  } catch {
    console.log(`  ${label}: normal click blocked — using JS click`);
    await locator.evaluate(el => el.click());
  }
}

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

async function startChrome() {
  if (await isCDPReady()) {
    console.log(`Chrome already on port ${CDP_PORT} ✓`);
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

  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isCDPReady()) { console.log(`Chrome ready on port ${CDP_PORT} ✓`); return proc; }
  }
  throw new Error(`Chrome did not open port ${CDP_PORT} within 12s. Close all Chrome windows and re-run.`);
}

async function getRecentPostUrls(page, count = 5) {
  await page.goto(POSTS_URL);
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(randomBetween(2500, 4000));
  return page.evaluate((n) => {
    const seen = new Set();
    const urls = [];
    for (const a of document.querySelectorAll('a[href*="/post/"]')) {
      const url = a.href.replace(/[?#].*$/, '');
      if (!seen.has(url)) { seen.add(url); urls.push(url); if (urls.length >= n) break; }
    }
    return urls;
  }, count);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const poll = data.polls.find(p => p.status === 'pending');
  if (!poll) { console.log('No pending YouTube polls. Exiting.'); return; }

  console.log(`Poll: "${poll.hook.slice(0, 80)}..."`);
  console.log(`Question: ${poll.question_text.length} chars`);
  console.log(`Options (${poll.options.length}): ${JSON.stringify(poll.options)}`);

  for (const opt of poll.options) {
    if (opt.length > 65) { console.error(`FATAL: option too long: "${opt}"`); process.exit(1); }
  }

  const chromeProc = await startChrome();
  const browser    = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx        = browser.contexts()[0];
  const page       = ctx.pages()[0] || await ctx.newPage();

  try {
    // Login check
    console.log('\nNavigating to YouTube...');
    await page.goto('https://www.youtube.com/');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await actionPause(page, 'after YouTube load');
    const avatar = await page.locator('#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer').count();
    if (avatar === 0) throw new Error('Not logged in to YouTube in ytbot-profile.');
    console.log('Logged in ✓');

    // Capture pre-state for post-check
    const preUrls = await getRecentPostUrls(page, 5);

    // Mark mid-flight
    poll.status = 'posting';
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));

    // Pre-composer human pause (60–180s)
    console.log('Pre-composer wait (60–180s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    // Navigate to composer
    console.log('\nOpening composer...');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await actionPause(page, 'posts page settled');

    // Expand composer
    console.log('Expanding composer...');
    await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
    await actionPause(page, 'composer expanded');

    const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
    await ta.waitFor({ state: 'visible', timeout: 10000 });
    await ta.click();
    await page.waitForTimeout(randomBetween(400, 800));

    // Type question character-by-character with human delays
    console.log(`Typing question (${poll.question_text.length} chars)...`);
    await typeHuman(page, poll.question_text);
    await actionPause(page, 'after question');

    // Click the correct poll button
    console.log('Clicking #poll-button button...');
    const pollBtn = page.locator('#poll-button button').first();
    await pollBtn.waitFor({ state: 'attached', timeout: 8000 });
    await pollBtn.dispatchEvent('click');
    await actionPause(page, 'after poll button');

    const attachVisible = await page.evaluate(() => {
      const el = document.querySelector('ytd-poll-attachment');
      return el ? window.getComputedStyle(el).display : 'not found';
    });
    console.log(`Poll attachment display: ${attachVisible}`);
    if (attachVisible === 'none') throw new Error('Poll attachment hidden after clicking #poll-button button');

    // Scroll to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(randomBetween(700, 1100));

    // Fill option fields — target the INNER <input> directly (NOT raw host coords).
    // The old approach computed the host's bounding-box center and did page.mouse.click(x,y)
    // to focus — that coordinate click missed the input (each row is [remove-X][input]),
    // so text never entered (host.value=null) and the widget degraded, which then made the
    // coordinate-based add-option click miss too (30s hang). Fix (2026-06-10): click the
    // actual <input> element (Playwright actionability-checked) + robustClick for add-option.
    const OPT_INPUT_SEL = `${HOST_SEL} input`;   // tp-yt-paper-input.poll-option-input input
    console.log(`Filling ${poll.options.length} poll options...`);
    await page.locator(OPT_INPUT_SEL).first().waitFor({ state: 'attached', timeout: 10000 });

    for (let i = 0; i < poll.options.length; i++) {
      // Ensure enough option fields exist (composer starts with 2)
      let currentInputs = await page.locator(OPT_INPUT_SEL).count();
      while (currentInputs <= i) {
        console.log(`  Adding option field (have ${currentInputs}, need ${i + 1})...`);
        const addBtn = page.locator('#add-option button').first();
        await addBtn.scrollIntoViewIfNeeded().catch(() => {});
        await robustClick(addBtn, '#add-option');
        await page.waitForFunction(
          ({ sel, n }) => document.querySelectorAll(sel).length > n,
          { sel: OPT_INPUT_SEL, n: currentInputs },
          { timeout: 8000 }
        );
        currentInputs = await page.locator(OPT_INPUT_SEL).count();
        await actionPause(page, `field ${i + 1} added`);
      }

      const input = page.locator(OPT_INPUT_SEL).nth(i);
      await input.scrollIntoViewIfNeeded().catch(() => {});

      // Focus the real input element (actionability-checked), then type real keystrokes —
      // real CDP keystrokes update Polymer's two-way binding AND YouTube's submission state.
      console.log(`  Typing option ${i + 1}: "${poll.options[i]}"`);
      await robustClick(input, `option ${i + 1} input`);
      await page.waitForTimeout(randomBetween(300, 600));
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await typeHuman(page, poll.options[i]);

      const actual = await input.inputValue().catch(() => null);
      console.log(`  Option ${i + 1}: value="${actual}" ${actual === poll.options[i] ? '✓' : '⚠'}`);
      if (actual !== poll.options[i]) {
        // Last-resort: native value set + input event (Polymer listens to bubbling 'input')
        await input.fill(poll.options[i]);
        const retry = await input.inputValue().catch(() => null);
        console.log(`  Option ${i + 1} (fill retry): value="${retry}" ${retry === poll.options[i] ? '✓' : '⚠'}`);
        if (retry !== poll.options[i]) throw new Error(`Option ${i + 1} text did not register ("${retry}")`);
      }

      await actionPause(page, `after option ${i + 1}`);
    }

    // Wait for the VISIBLE Post button to enable.
    // DOM contains a hidden placeholder button[aria-label="Post"] (0x0) and the real one.
    console.log('\nWaiting for visible Post button to enable...');
    let postCoords = null;
    try {
      postCoords = await page.waitForFunction(() => {
        const btns = [...document.querySelectorAll('button[aria-label="Post"]')];
        for (const btn of btns) {
          const r = btn.getBoundingClientRect();
          const enabled = !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
          if (r.width > 0 && r.height > 0 && enabled) {
            return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
          }
        }
        return false;
      }, { timeout: 10000 }).then(h => h.jsonValue());
    } catch {
      const info = await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button[aria-label="Post"]')];
        return btns.map(b => {
          const r = b.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width), h: Math.round(r.height), ad: b.getAttribute('aria-disabled'), d: b.disabled };
        });
      });
      console.log('  Post button candidates:', JSON.stringify(info));
      throw new Error('No enabled visible Post button found within 10s');
    }
    console.log(`  Visible Post button at (${Math.round(postCoords.x)},${Math.round(postCoords.y)}) ${Math.round(postCoords.w)}x${Math.round(postCoords.h)} ✓`);

    // Pre-post human pause (60–180s)
    console.log('Pre-post wait (60–180s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post');

    // Click the VISIBLE Post button as an ELEMENT via robustClick (trusted Playwright
    // click, then JS-click fallback) — NOT page.mouse.click(x,y). A coordinate click
    // misses YouTube's Polymer Post button and never fires its submit handler, so the
    // poll types in fully but never posts: composer never clears, no new post URL, the
    // poll is not live. This was the LAST click still on raw coordinates after the
    // 2026-06-10 option-field fix switched everything else to robustClick. (Reproduced
    // twice on 2026-06-14 — fix: target the element, not a point.)
    console.log('Clicking Post...');
    const postBtn = page.locator('button[aria-label="Post"]:visible').first();
    await postBtn.waitFor({ state: 'visible', timeout: 10000 });
    await robustClick(postBtn, 'Post button');
    console.log('Post clicked ✓');

    // Wait for composer to clear
    console.log('Waiting for composer to clear...');
    try {
      await page.waitForFunction(
        () => {
          const el = document.querySelector('#contenteditable-root');
          return !el || el.innerText.trim().length === 0;
        },
        { timeout: 20000 }
      );
      console.log('Composer cleared ✓');
    } catch {
      console.log('Composer-cleared signal not detected; proceeding to post-check.');
    }
    await actionPause(page, 'composer settled');

    // Find new post URL
    console.log('\nFinding new post URL...');
    let newUrl = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      const newUrls = await getRecentPostUrls(page, 5);
      newUrl = newUrls.find(u => !preUrls.includes(u));
      if (newUrl) break;
      console.log(`  Attempt ${attempt}/5: new post URL not yet visible...`);
      await page.waitForTimeout(5000);
    }
    if (!newUrl) throw new Error('Could not find new post URL after posting');
    console.log(`New post URL: ${newUrl}`);

    poll.status    = 'posted';
    poll.posted_at = new Date().toISOString();
    poll.post_url  = newUrl;
    delete poll.error;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.log(`\nDone ✓  URL: ${newUrl}`);
  } catch (err) {
    poll.status = 'failed';
    poll.error  = err.message;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}

main();
