// YouTube community QUIZ poster.
// A quiz is a poll where exactly ONE option is marked correct, plus an optional
// explanation shown after the viewer answers. Composer widget = ytd-backstage-quiz-editor-renderer.
//
// Discovered composer DOM (probe scripts/_diag-yt-quiz-selectors.js, 2026-07-07):
//   • Open widget:   #quiz-button button (dispatch click)  → #quiz-attachment becomes display:flex
//   • Option fields: ytd-backstage-quiz-editor-renderer .quiz-option-input-input textarea
//                    (real <textarea> in tp-yt-iron-autogrow-textarea; starts with 2, placeholders "Answer N")
//   • Add option:    button[aria-label="Add answer"]
//   • Mark correct:  yt-icon-button.option-selector-button[aria-label="Mark as correct answer"] (one per row)
//   • Explanation:   ytd-backstage-quiz-editor-renderer .quiz-explanation-input-input textarea (optional)
//   • Post:          shared toolbar #submit-button → button[aria-label="Post"] (visible, non-zero rect)
//
// Mirrors scripts/post-yt-poll.js exactly for: real CDP keystrokes (Polymer two-way binding +
// YouTube submission state), robustClick (Playwright click → JS-click fallback), the two-button
// Post trap (hidden 0x0 placeholder + real visible button), and human timing. The ONE quiz-specific
// gate: the correct answer MUST be marked or the Post button never enables.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');

const YT_JSON        = path.join(__dirname, '..', 'data', 'yt-quizzes.json');
const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const CHANNEL_HANDLE = 'CodeMonkeyMike';
const POSTS_URL      = `https://www.youtube.com/@${CHANNEL_HANDLE}/posts`;

const QUIZ_ROOT     = 'ytd-backstage-quiz-editor-renderer';
const QUIZ_ATTACH   = `${QUIZ_ROOT}#quiz-attachment`;
const OPT_TEXTAREA  = `${QUIZ_ROOT} .quiz-option-input-input textarea`;
const ADD_ANSWER    = 'button[aria-label="Add answer"]';
const CORRECT_BTN   = `${QUIZ_ROOT} .option-selector-button`;
const EXPL_TEXTAREA = `${QUIZ_ROOT} .quiz-explanation-input-input textarea`;

// Timing constants — mirrored from scripts/post-yt-poll.js
const CHAR_DELAY_MIN  = 60;
const CHAR_DELAY_MAX  = 150;
const ACTION_MIN      = 2000;
const ACTION_MAX      = 3500;
const PRE_COMPOSE_MIN = +(process.env.YTQ_PRE_COMPOSE_MIN || 30000);
const PRE_COMPOSE_MAX = +(process.env.YTQ_PRE_COMPOSE_MAX || 90000);
const PRE_POST_MIN    = +(process.env.YTQ_PRE_POST_MIN    || 30000);
const PRE_POST_MAX    = +(process.env.YTQ_PRE_POST_MAX    || 90000);

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

// Click that survives composer overlays / custom Polymer handlers.
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
  const quiz = data.quizzes.find(q => q.status === 'pending');
  if (!quiz) { console.log('No pending YouTube quizzes. Exiting.'); return; }

  console.log(`Quiz: "${(quiz.hook || quiz.topic || quiz.id).slice(0, 80)}..."`);
  console.log(`Question: ${quiz.question_text.length} chars`);
  console.log(`Options (${quiz.options.length}): ${JSON.stringify(quiz.options)}`);
  console.log(`Correct index: ${quiz.correct_option_index} -> "${quiz.options[quiz.correct_option_index]}"`);

  // Validation gates (fail BEFORE opening a browser)
  if (quiz.options.length < 2 || quiz.options.length > 4) {
    console.error(`FATAL: quiz must have 2-4 options (has ${quiz.options.length})`); process.exit(1);
  }
  for (const opt of quiz.options) {
    if (opt.length > 65) { console.error(`FATAL: option too long: "${opt}"`); process.exit(1); }
  }
  if (typeof quiz.correct_option_index !== 'number' ||
      quiz.correct_option_index < 0 ||
      quiz.correct_option_index >= quiz.options.length) {
    console.error(`FATAL: correct_option_index ${quiz.correct_option_index} out of range`); process.exit(1);
  }

  const chromeProc = await startChrome();
  const browser    = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx        = browser.contexts()[0];
  const page       = ctx.pages()[0] || await ctx.newPage();

  try {
    console.log('\nNavigating to YouTube...');
    await page.goto('https://www.youtube.com/');
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await actionPause(page, 'after YouTube load');
    const avatar = await page.locator('#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer').count();
    if (avatar === 0) throw new Error('Not logged in to YouTube in ytbot-profile.');
    console.log('Logged in ✓');

    const preUrls = await getRecentPostUrls(page, 5);

    quiz.status = 'posting';
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));

    console.log('Pre-composer wait (30–90s)...');
    await longWait(page, PRE_COMPOSE_MIN, PRE_COMPOSE_MAX, 'before composer');

    console.log('\nOpening composer...');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await actionPause(page, 'posts page settled');

    console.log('Expanding composer...');
    await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
    await actionPause(page, 'composer expanded');

    const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
    await ta.waitFor({ state: 'visible', timeout: 10000 });
    await ta.click();
    await page.waitForTimeout(randomBetween(400, 800));

    console.log(`Typing question (${quiz.question_text.length} chars)...`);
    await typeHuman(page, quiz.question_text);
    await actionPause(page, 'after question');

    // Open the quiz widget — dispatch click on #quiz-button button (probe confirmed dispatch works).
    console.log('Clicking #quiz-button button...');
    const quizBtn = page.locator('#quiz-button button').first();
    await quizBtn.waitFor({ state: 'attached', timeout: 8000 });
    await quizBtn.dispatchEvent('click');
    await actionPause(page, 'after quiz button');

    const attachDisplay = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? window.getComputedStyle(el).display : 'not found';
    }, QUIZ_ATTACH);
    console.log(`Quiz attachment display: ${attachDisplay}`);
    if (attachDisplay === 'none' || attachDisplay === 'not found') {
      throw new Error(`Quiz editor did not open (display=${attachDisplay})`);
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(randomBetween(700, 1100));

    // Fill option textareas — add rows via "Add answer" as needed (starts with 2).
    console.log(`Filling ${quiz.options.length} quiz options...`);
    await page.locator(OPT_TEXTAREA).first().waitFor({ state: 'attached', timeout: 10000 });

    for (let i = 0; i < quiz.options.length; i++) {
      let currentInputs = await page.locator(OPT_TEXTAREA).count();
      while (currentInputs <= i) {
        console.log(`  Adding answer field (have ${currentInputs}, need ${i + 1})...`);
        const addBtn = page.locator(ADD_ANSWER).first();
        await addBtn.scrollIntoViewIfNeeded().catch(() => {});
        await robustClick(addBtn, 'Add answer');
        await page.waitForFunction(
          ({ sel, n }) => document.querySelectorAll(sel).length > n,
          { sel: OPT_TEXTAREA, n: currentInputs },
          { timeout: 8000 }
        );
        currentInputs = await page.locator(OPT_TEXTAREA).count();
        await actionPause(page, `field ${i + 1} added`);
      }

      const input = page.locator(OPT_TEXTAREA).nth(i);
      await input.scrollIntoViewIfNeeded().catch(() => {});

      console.log(`  Typing option ${i + 1}: "${quiz.options[i]}"`);
      await robustClick(input, `option ${i + 1} textarea`);
      await page.waitForTimeout(randomBetween(300, 600));
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await typeHuman(page, quiz.options[i]);

      const actual = await input.inputValue().catch(() => null);
      console.log(`  Option ${i + 1}: value="${actual}" ${actual === quiz.options[i] ? '✓' : '⚠'}`);
      if (actual !== quiz.options[i]) {
        await input.fill(quiz.options[i]);
        const retry = await input.inputValue().catch(() => null);
        console.log(`  Option ${i + 1} (fill retry): value="${retry}" ${retry === quiz.options[i] ? '✓' : '⚠'}`);
        if (retry !== quiz.options[i]) throw new Error(`Option ${i + 1} text did not register ("${retry}")`);
      }
      await actionPause(page, `after option ${i + 1}`);
    }

    // Mark the correct answer (quiz-specific — Post won't enable without it).
    const ci = quiz.correct_option_index;
    console.log(`Marking option ${ci + 1} correct ("${quiz.options[ci]}")...`);
    const correctBtns = page.locator(CORRECT_BTN);
    const btnCount = await correctBtns.count();
    if (btnCount <= ci) throw new Error(`Only ${btnCount} correct-answer buttons for index ${ci}`);
    const correctBtn = correctBtns.nth(ci);
    await correctBtn.scrollIntoViewIfNeeded().catch(() => {});
    await robustClick(correctBtn, `mark correct #${ci + 1}`);
    await actionPause(page, 'after mark correct');
    const pressed = await correctBtn.getAttribute('aria-pressed').catch(() => null);
    console.log(`  Correct-answer button aria-pressed=${pressed}`);

    // Optional explanation (shown to the viewer AFTER they answer, alongside the correct answer).
    // KEY (probe scripts/_diag-yt-quiz-explanation.js): EVERY option has its own explanation field
    // ("Explain why this is correct"), but ONLY the correct option's field is visible/editable — the
    // rest are 0x0 hidden. So target the correct_option_index-th field, NOT .first(). The first two
    // Kaspa quizzes posted with an EMPTY explanation because .first() grabbed option 0's hidden field
    // (option 0 was not the correct answer). The field is revealed once the correct answer is marked
    // (done above); native el.focus() + real keystrokes registers it. If an explanation is SET but
    // will not register, ABORT before Post so we never publish a quiz missing its intended explanation.
    if (quiz.explanation && quiz.explanation.trim()) {
      const explLoc = page.locator(EXPL_TEXTAREA).nth(ci);   // ci = correct_option_index (set above)
      await explLoc.waitFor({ state: 'attached', timeout: 8000 });
      console.log(`Typing explanation (${quiz.explanation.length} chars) into option ${ci + 1}'s field...`);
      await explLoc.evaluate(el => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(randomBetween(400, 700));
      await explLoc.evaluate(el => el.focus());
      const focused = await explLoc.evaluate(el => document.activeElement === el);
      console.log(`  Explanation focused: ${focused}`);
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await typeHuman(page, quiz.explanation);
      let av = await explLoc.inputValue().catch(() => null);
      if (av !== quiz.explanation) {
        await explLoc.fill(quiz.explanation).catch(() => {});   // native value+input fallback
        av = await explLoc.inputValue().catch(() => null);
      }
      if (av !== quiz.explanation) {
        throw new Error(`Explanation did not register (got "${(av || '').slice(0, 40)}"). Aborting BEFORE Post so the quiz is not published without its explanation.`);
      }
      console.log('  Explanation ✓');
      await actionPause(page, 'after explanation');
    }

    // Wait for the VISIBLE Post button to enable (two-button trap: hidden 0x0 placeholder + real one).
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
          return { w: Math.round(r.width), h: Math.round(r.height), ad: b.getAttribute('aria-disabled'), d: b.disabled };
        });
      });
      console.log('  Post button candidates:', JSON.stringify(info));
      throw new Error('No enabled visible Post button found within 10s (is the correct answer marked?)');
    }
    console.log(`  Visible Post button at (${Math.round(postCoords.x)},${Math.round(postCoords.y)}) ${Math.round(postCoords.w)}x${Math.round(postCoords.h)} ✓`);

    console.log('Pre-post wait (30–90s)...');
    await longWait(page, PRE_POST_MIN, PRE_POST_MAX, 'before Post');

    // Click the VISIBLE Post button as an ELEMENT via robustClick (NOT raw coordinates).
    console.log('Clicking Post...');
    const postBtn = page.locator('button[aria-label="Post"]:visible').first();
    await postBtn.waitFor({ state: 'visible', timeout: 10000 });
    await robustClick(postBtn, 'Post button');
    console.log('Post clicked ✓');

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

    quiz.status    = 'posted';
    quiz.posted_at = new Date().toISOString();
    quiz.post_url  = newUrl;
    delete quiz.error;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.log(`\nDone ✓  URL: ${newUrl}`);
  } catch (err) {
    quiz.status = 'failed';
    quiz.error  = err.message;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.error('\nPosting failed:', err.message);
    process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}

main();
