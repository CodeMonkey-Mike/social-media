// READ-ONLY DIAGNOSTIC for the YouTube community QUIZ composer.
// Opens the composer, dumps toolbar buttons, tries to open the Quiz widget, then dumps
// the option inputs + correct-answer control + explanation-field structure.
// NEVER clicks Post — it abandons the composer. Used to discover selectors for post-yt-quiz.js.
//
// Run with the ytbot-profile Chrome CLOSED (or already on CDP 9223):
//   node scripts/_diag-yt-quiz-selectors.js

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const CHANNEL_HANDLE = 'CodeMonkeyMike';
const POSTS_URL      = `https://www.youtube.com/@${CHANNEL_HANDLE}/posts`;

function rb(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

async function startChrome() {
  if (await isCDPReady()) { console.log(`Chrome already on port ${CDP_PORT}`); return null; }
  console.log('Launching Chrome with remote debugging...');
  const proc = spawn(CHROME_EXE, [
    `--user-data-dir=${CHROME_PROFILE}`,
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run', '--disable-blink-features=AutomationControlled', '--disable-sync', 'about:blank',
  ], { detached: false, stdio: 'ignore' });
  for (let i = 0; i < 24; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (await isCDPReady()) { console.log('Chrome ready ✓'); return proc; }
  }
  throw new Error('Chrome did not open CDP port within 12s. Close all Chrome windows on ytbot-profile and re-run.');
}

async function main() {
  const chromeProc = await startChrome();
  const browser    = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx        = browser.contexts()[0];
  const page       = ctx.pages()[0] || await ctx.newPage();
  try {
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(rb(2500, 4000));
    const loggedIn = await page.locator('#avatar-btn, button#avatar-btn, ytd-topbar-menu-button-renderer').count();
    console.log('Logged-in avatar count:', loggedIn);
    if (!loggedIn) throw new Error('Not logged in to ytbot-profile — re-auth needed.');

    // Expand composer + type throwaway text so the poll/quiz toolbar buttons activate.
    await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
    await ta.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await ta.click().catch(() => {});
    await page.keyboard.type('probe');
    await page.waitForTimeout(800);

    console.log('\n=== TOOLBAR / RELEVANT BUTTONS (visible) ===');
    const buttons = await page.evaluate(() => {
      const out = [];
      const seen = new Set();
      for (const el of document.querySelectorAll('[id$="-button"], ytd-button-renderer, button, tp-yt-paper-icon-button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const rec = {
          tag: el.tagName.toLowerCase(), id: el.id || '',
          aria: el.getAttribute('aria-label') || '', title: el.getAttribute('title') || '',
          text: (el.innerText || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height),
        };
        const k = JSON.stringify(rec);
        if (seen.has(k)) continue; seen.add(k);
        if (/quiz|poll|image|video|photo/i.test(rec.id + rec.aria + rec.title + rec.text) || rec.id.endsWith('-button')) out.push(rec);
      }
      return out;
    });
    buttons.forEach(b => console.log(JSON.stringify(b)));

    console.log('\n=== ANY ELEMENT WITH "quiz" IN id/aria/class ===');
    const quizCands = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('*')) {
        const id = el.id || '';
        const aria = (el.getAttribute && el.getAttribute('aria-label')) || '';
        const cls = (el.className || '').toString();
        if (/quiz/i.test(id) || /quiz/i.test(aria) || /quiz/i.test(cls)) {
          const r = el.getBoundingClientRect();
          out.push({ tag: el.tagName.toLowerCase(), id, aria, cls: cls.slice(0, 60), w: Math.round(r.width), h: Math.round(r.height) });
        }
      }
      return out;
    });
    console.log(JSON.stringify(quizCands, null, 2));

    // Attempt to open the quiz widget.
    let clicked = false;
    for (const sel of ['#quiz-button button', '#quiz-button', 'button[aria-label*="Quiz" i]', '[aria-label*="Quiz" i]']) {
      const loc = page.locator(sel).first();
      if (await loc.count()) {
        try { await loc.click({ timeout: 4000 }); clicked = sel; break; }
        catch { try { await loc.dispatchEvent('click'); clicked = sel + ' (dispatch)'; break; } catch {} }
      }
    }
    console.log('\nQuiz open attempt:', clicked || 'NO QUIZ BUTTON FOUND');
    await page.waitForTimeout(2000);

    console.log('\n=== ATTACHMENT ELEMENTS (poll/quiz widget) ===');
    console.log(JSON.stringify(await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('[id*="attachment" i], ytd-poll-attachment, [class*="quiz" i], [class*="attachment" i]')) {
        const r = el.getBoundingClientRect();
        out.push({ tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className || '').toString().slice(0, 70), display: getComputedStyle(el).display, w: Math.round(r.width), h: Math.round(r.height) });
      }
      return out;
    }), null, 2));

    console.log('\n=== VISIBLE INPUT-LIKE FIELDS ===');
    console.log(JSON.stringify(await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('tp-yt-paper-input, textarea, input')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        out.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 70), ph: el.getAttribute('placeholder') || el.getAttribute('aria-label') || '', w: Math.round(r.width), h: Math.round(r.height) });
      }
      return out;
    }), null, 2));

    console.log('\n=== CORRECT-ANSWER CONTROL CANDIDATES (radio/checkbox/icon per option) ===');
    console.log(JSON.stringify(await page.evaluate(() => {
      const out = [];
      const sel = 'tp-yt-paper-radio-button, paper-radio-button, [role="radio"], tp-yt-paper-checkbox, [role="checkbox"], tp-yt-paper-icon-button, yt-icon-button, [aria-label*="correct" i], [aria-label*="answer" i], [aria-label*="mark" i]';
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        out.push({ tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className || '').toString().slice(0, 60), aria: el.getAttribute('aria-label') || '', w: Math.round(r.width), h: Math.round(r.height) });
      }
      return out;
    }), null, 2));

    console.log('\n=== ATTACHMENT OUTER HTML (truncated 6000) ===');
    console.log(await page.evaluate(() => {
      const el = document.querySelector('[id*="attachment" i], ytd-poll-attachment, [class*="quiz" i]');
      return el ? el.outerHTML.slice(0, 6000) : '(no attachment element found)';
    }));

    console.log('\nDONE — composer abandoned (NOT posted).');
  } catch (err) {
    console.error('Probe error:', err.message);
  } finally {
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}

main();
