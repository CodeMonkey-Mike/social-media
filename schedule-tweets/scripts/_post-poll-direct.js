// Direct poll poster — correct poll button selector, mouse-click on visible host elements
const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');
const fs           = require('fs');
const path         = require('path');

const YT_JSON    = path.join(__dirname, '..', 'data', 'yt-text-polls.json');
const CHROME_EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const CDP_PORT   = 9223;
const POSTS_URL  = 'https://www.youtube.com/@CodeMonkeyMike/posts';
const HOST_SEL   = 'tp-yt-paper-input.poll-option-input';

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

(async () => {
  const data = JSON.parse(fs.readFileSync(YT_JSON, 'utf8'));
  const poll = data.polls.find(p => p.status === 'pending');
  if (!poll) { console.log('No pending polls'); process.exit(0); }

  console.log('Poll:', poll.hook);
  console.log('Options:', poll.options);

  if (!await isCDPReady()) {
    spawn(CHROME_EXE, [`--user-data-dir=${PROFILE}`, `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run', '--disable-sync', 'about:blank'], { stdio: 'ignore' });
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isCDPReady()) { console.log('Chrome ready ✓'); break; }
    }
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx  = browser.contexts()[0];
  const page = ctx.pages()[0] || await ctx.newPage();

  try {
    poll.status = 'posting';
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));

    // Navigate
    console.log('\nNavigating to posts page...');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(rnd(3000, 5000));

    // Expand composer
    console.log('Expanding composer...');
    await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(rnd(1500, 2500));

    const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
    await ta.waitFor({ state: 'visible', timeout: 10000 });
    await ta.click();
    await page.waitForTimeout(rnd(500, 1000));

    // Paste question text
    console.log('Pasting question text...');
    await page.keyboard.insertText(poll.question_text);
    await page.waitForTimeout(rnd(1000, 2000));

    // ── Click the CORRECT Poll button ─────────────────────────────────────────
    // #poll-button is the span wrapper for the text-poll button in the composer toolbar.
    // WRONG: [aria-label="Poll"] — matches elements in the feed, not the composer.
    // RIGHT: #poll-button button — the button inside the composer's poll-button span.
    console.log('Clicking Poll button...');
    // The text-poll button is in the composer toolbar, which scrolls above viewport.
    // Use dispatchEvent — fires click directly on the element regardless of position.
    const pollBtn = page.locator('#poll-button button').first();
    await pollBtn.waitFor({ state: 'attached', timeout: 8000 });
    await pollBtn.dispatchEvent('click');
    await page.waitForTimeout(rnd(1500, 2500));

    // Verify ytd-poll-attachment is now visible
    const attachVisible = await page.evaluate(() => {
      const el = document.querySelector('ytd-poll-attachment');
      return el ? window.getComputedStyle(el).display : 'not found';
    });
    console.log(`  Poll attachment display: ${attachVisible}`);
    if (attachVisible === 'none') throw new Error('Poll attachment still display:none after clicking #poll-button button');

    // Scroll to top — now that the right button was clicked, inputs should have layout
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => window.scrollY < 50, { timeout: 5000 });
    await page.waitForTimeout(rnd(800, 1200));

    // ── Fill poll options via mouse click at real coordinates ─────────────────
    console.log('Filling poll options...');
    await page.locator(HOST_SEL).first().waitFor({ state: 'attached', timeout: 10000 });

    const ADD_OPT = page.locator('#add-option button').first();

    for (let i = 0; i < poll.options.length; i++) {
      // Add field if needed
      const currentCount = await page.evaluate(
        ({ sel }) => document.querySelectorAll(sel).length, { sel: HOST_SEL }
      );
      if (i >= currentCount) {
        console.log(`  Adding field ${i + 1}...`);
        // Get coordinates of Add option button from inside page context
        const addCoords = await page.evaluate(() => {
          const btn = document.querySelector('#add-option button');
          if (!btn) return null;
          btn.scrollIntoView({ block: 'center' });
          const r = btn.getBoundingClientRect();
          return r.width > 0 ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
        });
        if (addCoords && addCoords.x > 0 && addCoords.y > 0) {
          await page.mouse.click(addCoords.x, addCoords.y);
        } else {
          await ADD_OPT.dispatchEvent('click');
        }
        await page.waitForTimeout(rnd(800, 1200));
      }

      // Get real coordinates of this option's host element
      const rect = await page.evaluate(({ sel, idx }) => {
        const el = document.querySelectorAll(sel)[idx];
        if (!el) return null;
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
      }, { sel: HOST_SEL, idx: i });

      console.log(`  Option ${i + 1} rect: (${rect ? Math.round(rect.x) : 'null'},${rect ? Math.round(rect.y) : 'null'}) ${rect ? Math.round(rect.w) + 'x' + Math.round(rect.h) : ''}`);

      if (!rect || rect.w === 0) {
        throw new Error(`Option ${i + 1} has zero rect — poll attachment may be hidden`);
      }

      // Host is visible (569x54) — use Playwright's native click for proper CDP focus
      const host = page.locator(HOST_SEL).nth(i);
      await host.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await host.click();  // native click → proper focus delegation into shadow input
      await page.waitForTimeout(200);

      // Use insertText (single CDP operation, fires proper `input` event + updates value)
      await page.keyboard.insertText(poll.options[i]);
      await page.waitForTimeout(200);

      // Directly update the Polymer data model on the iron-input wrapper.
      // tp-yt-paper-input listens for bind-value-changed on tp-yt-iron-input.
      await host.evaluate((el, val) => {
        // Set value on host
        el.value = val;
        if (el.notifyPath) el.notifyPath('value', val);

        // Find the iron-input wrapper in shadow DOM and set bindValue
        const sr = el.shadowRoot;
        if (sr) {
          const ironInput = sr.querySelector('tp-yt-iron-input') || sr.querySelector('iron-input');
          if (ironInput) {
            ironInput.bindValue = val;
            if (ironInput.notifyPath) ironInput.notifyPath('bindValue', val);
            ironInput.dispatchEvent(new CustomEvent('bind-value-changed', {
              detail: { value: val },
              bubbles: true,
              composed: true,
            }));
          }
          // Also fire on the inner <input>
          const input = sr.querySelector('input') || (ironInput && ironInput.shadowRoot && ironInput.shadowRoot.querySelector('input'));
          if (input) {
            input.dispatchEvent(new InputEvent('input', {
              data: val, inputType: 'insertText',
              bubbles: true, composed: true,
            }));
          }
        }
      }, poll.options[i]);

      // Read inner input value to confirm
      const innerInput = page.locator(HOST_SEL).nth(i).locator('input');
      const actualVal = await innerInput.evaluate(el => el.value).catch(() => '');

      console.log(`  Option ${i + 1}: "${poll.options[i]}" (in DOM: "${actualVal}") ✓`);
      await page.waitForTimeout(rnd(300, 600));
    }

    // Wait for Polymer to re-validate and enable the Post button
    await page.waitForTimeout(rnd(800, 1200));
    const postEnabled = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Post"]');
      return btn ? !btn.disabled && btn.getAttribute('aria-disabled') !== 'true' : false;
    });
    console.log(`\nPost button enabled: ${postEnabled}`);

    // Wait up to 5s for Post to enable (Polymer may be async)
    console.log('Waiting for Post button to enable...');
    let postNowEnabled = false;
    try {
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Post"]');
          return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
        },
        { timeout: 5000 }
      );
      postNowEnabled = true;
      console.log('  Post button enabled ✓');
    } catch {
      console.log('  Still disabled after 5s — forcing submission');
    }

    // Scroll page to top (where Cancel/Post buttons live in the composer)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(600);

    // Get all buttons named Post and find one with dimensions
    const postInfo = await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button[aria-label="Post"], button[aria-label*="Post"]')];
      return btns.map(btn => {
        btn.removeAttribute('disabled');
        btn.setAttribute('aria-disabled', 'false');
        btn.classList.remove('ytSpecButtonShapeNextDisabled');
        const r = btn.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) };
      });
    });
    console.log('  Post buttons after scroll:', postInfo);

    console.log('Clicking Post...');
    const visiblePost = postInfo.find(p => p.w > 0 && p.y > 0 && p.y < 1000);
    if (visiblePost) {
      await page.mouse.click(visiblePost.x, visiblePost.y);
    } else {
      // All post buttons have zero rect — use JS click as last resort
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button[aria-label="Post"]')];
        for (const btn of btns) {
          btn.removeAttribute('disabled');
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: window }));
        }
      });
    }
    await page.waitForTimeout(rnd(4000, 6000));

    // Get new post URL
    console.log('Getting post URL...');
    await page.goto(POSTS_URL);
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(rnd(3000, 5000));

    const urls = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href*="/post/"]')]
        .map(a => a.href.replace(/[?#].*$/, '')))].slice(0, 3)
    );
    console.log('Recent posts:', urls);

    poll.status    = 'posted';
    poll.posted_at = new Date().toISOString();
    poll.post_url  = urls[0] || null;
    delete poll.error;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.log('\nDone ✓  URL:', poll.post_url);

  } catch (err) {
    poll.status = 'failed';
    poll.error  = err.message;
    fs.writeFileSync(YT_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  } finally {
    try { await browser.close(); } catch {}
  }
})();
