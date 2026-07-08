// READ-ONLY probe that REPLICATES the real 4-option quiz flow, then tests multiple strategies to
// focus + fill the explanation textarea (native focus() failed in the live 4-option run even though it
// worked with 2 options). Reports which strategy actually registers text. NEVER posts.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CHROME_EXE     = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT       = 9223;
const POSTS_URL      = 'https://www.youtube.com/@CodeMonkeyMike/posts';

const QUIZ_ROOT     = 'ytd-backstage-quiz-editor-renderer';
const OPT_TEXTAREA  = `${QUIZ_ROOT} .quiz-option-input-input textarea`;
const ADD_ANSWER    = 'button[aria-label="Add answer"]';
const CORRECT_BTN   = `${QUIZ_ROOT} .option-selector-button`;
const EXPL_TEXTAREA = `${QUIZ_ROOT} .quiz-explanation-input-input textarea`;

function rb(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
async function isCDPReady() { return new Promise(r => { const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); }); s.on('error', () => r(false)); setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600); }); }
async function startChrome() { if (await isCDPReady()) return null; const p = spawn(CHROME_EXE, [`--user-data-dir=${CHROME_PROFILE}`, `--remote-debugging-port=${CDP_PORT}`, '--no-first-run', '--disable-blink-features=AutomationControlled', '--disable-sync', 'about:blank'], { detached: false, stdio: 'ignore' }); for (let i = 0; i < 24; i++) { await new Promise(r => setTimeout(r, 500)); if (await isCDPReady()) return p; } throw new Error('Chrome did not open CDP port'); }

async function activeInfo(page) {
  return page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return '(none)';
    return `${a.tagName.toLowerCase()}.${(a.className || '').toString().split(' ').slice(0, 2).join('.')}`;
  });
}

async function clearAndType(page, explLoc, text) {
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  for (const ch of text) { await page.keyboard.type(ch); await page.waitForTimeout(rb(15, 35)); }
  return explLoc.inputValue().catch(() => '(err)');
}

async function main() {
  const chromeProc = await startChrome();
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();
  try {
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(rb(2500, 4000));

    await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await page.locator('#contenteditable-root[contenteditable="true"]').first().click();
    await page.keyboard.type('probe 4-option explanation flow');
    await page.waitForTimeout(500);

    await page.locator('#quiz-button button').first().dispatchEvent('click');
    await page.waitForTimeout(1500);

    // Replicate 4 options (add 2), like the real quiz.
    const labels = ['Option A', 'Option B', 'Option C', 'Option D'];
    for (let i = 0; i < 4; i++) {
      let cnt = await page.locator(OPT_TEXTAREA).count();
      while (cnt <= i) { await page.locator(ADD_ANSWER).first().click().catch(async () => { await page.locator(ADD_ANSWER).first().evaluate(el => el.click()); }); await page.waitForTimeout(700); cnt = await page.locator(OPT_TEXTAREA).count(); }
      const inp = page.locator(OPT_TEXTAREA).nth(i);
      await inp.click();
      await page.keyboard.type(labels[i]);
      await page.waitForTimeout(300);
    }
    // Mark option index 1 correct (as the real quiz does).
    await page.locator(CORRECT_BTN).nth(1).click().catch(async () => { await page.locator(CORRECT_BTN).nth(1).evaluate(el => el.click()); });
    await page.waitForTimeout(1200);

    // ---- Enumerate ALL explanation textareas with their option context + visibility ----
    console.log('\n=== EXPLANATION TEXTAREA ENUMERATION (4 options, correct=idx1) ===');
    console.log(JSON.stringify(await page.evaluate(({ root }) => {
      const editor = document.querySelector(root);
      const tas = [...editor.querySelectorAll('.quiz-explanation-input-input textarea')];
      const optRows = [...editor.querySelectorAll('.quiz-option')];
      return {
        counts: {
          quizExplanation: editor.querySelectorAll('.quiz-explanation').length,
          explInputInput: editor.querySelectorAll('.quiz-explanation-input-input').length,
          explTextareas: tas.length,
          optionRows: optRows.length,
        },
        textareas: tas.map(ta => {
          const r = ta.getBoundingClientRect();
          const wrap = ta.closest('.quiz-explanation');
          const wr = wrap ? wrap.getBoundingClientRect() : null;
          const optRow = ta.closest('.quiz-option');
          const optIdx = optRow ? optRows.indexOf(optRow) : -1;
          // first hidden ancestor
          let hidden = null;
          for (let el = ta; el && el !== document.body; el = el.parentElement) {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') { hidden = `${el.tagName.toLowerCase()}.${(el.className||'').toString().split(' ')[0]} (${cs.display}/${cs.visibility})`; break; }
          }
          return {
            underOptionIndex: optIdx,
            ph: ta.getAttribute('placeholder') || '',
            taW: Math.round(r.width), taH: Math.round(r.height),
            wrapDisplay: wrap ? getComputedStyle(wrap).display : '(no wrap)',
            wrapW: wr ? Math.round(wr.width) : null, wrapH: wr ? Math.round(wr.height) : null,
            offsetParentNull: ta.offsetParent === null,
            firstHiddenAncestor: hidden,
          };
        }),
      };
    }, { root: QUIZ_ROOT }), null, 2));

    // ---- CONFIRM the fix: target the CORRECT option's explanation (nth(1) here) ----
    console.log('\n=== CONFIRM FILL on .nth(correctIndex=1) ===');
    const correctExpl = page.locator(EXPL_TEXTAREA).nth(1);
    await correctExpl.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400);
    await correctExpl.evaluate(el => el.focus());
    console.log('focused:', await correctExpl.evaluate(el => document.activeElement === el), '| activeElement =', await activeInfo(page));
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await correctExpl.pressSequentially('PROVEN FIX 123', { delay: 25 });
    const val = await correctExpl.inputValue().catch(() => '(err)');
    console.log('value after type =', JSON.stringify(val), val === 'PROVEN FIX 123' ? '✓ WORKS' : '✗ still broken');

    console.log('\nDONE — NOT posted.');
  } catch (err) {
    console.error('Probe error:', err.message);
  } finally {
    try { await browser.close(); } catch {}
    try { if (chromeProc) chromeProc.kill(); } catch {}
  }
}
main();
