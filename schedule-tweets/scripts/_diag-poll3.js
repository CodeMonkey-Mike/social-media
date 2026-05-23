// Diagnostic v3: mouse-click host + REAL keystrokes via Input.dispatchKeyEvent
// Goal: confirm Post button enables and option text reaches Polymer's data model
// when we use page.mouse.click(x,y) + page.keyboard.type() instead of insertText.

const { chromium } = require('playwright');
const { spawn }    = require('child_process');
const net          = require('net');

const CDP_PORT   = 9223;
const CHROME_EXE = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE    = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\ytbot-profile';
const POSTS_URL  = 'https://www.youtube.com/@CodeMonkeyMike/posts';
const HOST_SEL   = 'tp-yt-paper-input.poll-option-input';

const TEST_QUESTION = 'Diagnostic — please ignore. This will be deleted in a few seconds.';
const TEST_OPTIONS  = ['DiagA', 'DiagB'];   // start with 2 short options

async function isCDPReady() {
  return new Promise(r => {
    const s = net.connect(CDP_PORT, '127.0.0.1', () => { s.destroy(); r(true); });
    s.on('error', () => r(false));
    setTimeout(() => { try { s.destroy(); } catch {} r(false); }, 600);
  });
}

function snapshot(page, label) {
  return page.evaluate((label) => {
    const ae = document.activeElement;
    const postBtns = [...document.querySelectorAll('button[aria-label="Post"]')];
    const hosts = [...document.querySelectorAll('tp-yt-paper-input.poll-option-input')];
    const hostInfo = hosts.map(h => ({
      hostValue: h.value,
      bindValue: h.bindValue,
      innerValue: h.querySelector('input')?.value,
      innerInShadow: h.shadowRoot?.querySelector('input')?.value,
      hostRect: (() => { const r = h.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
    }));
    return {
      label,
      activeTag: ae?.tagName,
      activeId: ae?.id,
      activePlaceholder: ae?.placeholder,
      activeAriaLabel: ae?.getAttribute?.('aria-label'),
      hosts: hostInfo,
      postBtns: postBtns.map(b => ({
        ariaDisabled: b.getAttribute('aria-disabled'),
        disabled: b.disabled,
        cls: b.className?.slice(0, 50),
        rect: (() => { const r = b.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; })(),
      })),
    };
  }, label);
}

function dumpSnapshot(s) {
  console.log(`\n— ${s.label} —`);
  console.log(`  active: <${s.activeTag}> id=${s.activeId} placeholder=${s.activePlaceholder} aria=${s.activeAriaLabel}`);
  s.hosts.forEach((h, i) => {
    console.log(`  host[${i}]: hostValue="${h.hostValue}" bindValue="${h.bindValue}" innerValue="${h.innerValue}" rect=${JSON.stringify(h.hostRect)}`);
  });
  s.postBtns.forEach((b, i) => {
    console.log(`  postBtn[${i}]: aria-disabled=${b.ariaDisabled} disabled=${b.disabled} rect=${JSON.stringify(b.rect)} cls="${b.cls}"`);
  });
}

(async () => {
  if (!await isCDPReady()) {
    console.log('Launching Chrome on port 9223...');
    spawn(CHROME_EXE, [`--user-data-dir=${PROFILE}`, `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run', '--disable-sync', '--disable-blink-features=AutomationControlled', 'about:blank'], { stdio: 'ignore' });
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isCDPReady()) { console.log('Chrome ready ✓'); break; }
    }
  } else {
    console.log('Chrome already on CDP 9223 ✓');
  }

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const ctx     = browser.contexts()[0];
  const page    = ctx.pages()[0] || await ctx.newPage();

  console.log('\nNavigating to posts page...');
  await page.goto(POSTS_URL);
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3500);

  console.log('Expanding composer...');
  await page.locator('#placeholder-area').first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1500);

  const ta = page.locator('#contenteditable-root[contenteditable="true"]').first();
  await ta.waitFor({ state: 'visible', timeout: 10000 });
  await ta.click();
  await page.waitForTimeout(400);

  console.log('Typing question...');
  await page.keyboard.insertText(TEST_QUESTION);
  await page.waitForTimeout(800);

  console.log('Clicking #poll-button button...');
  const pollBtn = page.locator('#poll-button button').first();
  await pollBtn.waitFor({ state: 'attached', timeout: 8000 });
  await pollBtn.dispatchEvent('click');
  await page.waitForTimeout(2000);

  const attachVisible = await page.evaluate(() => {
    const el = document.querySelector('ytd-poll-attachment');
    return el ? window.getComputedStyle(el).display : 'not found';
  });
  console.log(`Poll attachment display: ${attachVisible}`);
  if (attachVisible === 'none') throw new Error('Poll attachment hidden after clicking #poll-button button');

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  // Initial snapshot
  dumpSnapshot(await snapshot(page, 'After poll button click'));

  // Fill option 1 — mouse click + keyboard type
  for (let i = 0; i < TEST_OPTIONS.length; i++) {
    const rect = await page.evaluate(({ sel, idx }) => {
      const el = document.querySelectorAll(sel)[idx];
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    }, { sel: HOST_SEL, idx: i });

    console.log(`\nOption ${i + 1} host rect: ${JSON.stringify(rect)}`);
    if (!rect || rect.w === 0) throw new Error(`Option ${i + 1} has zero rect`);

    console.log(`  Mouse-clicking at (${Math.round(rect.x)}, ${Math.round(rect.y)})`);
    await page.mouse.click(rect.x, rect.y);
    await page.waitForTimeout(400);

    dumpSnapshot(await snapshot(page, `After mouse-click on option ${i + 1} host`));

    console.log(`  Typing "${TEST_OPTIONS[i]}" via keyboard.type (real keystrokes)`);
    await page.keyboard.type(TEST_OPTIONS[i], { delay: 50 });
    await page.waitForTimeout(800);

    dumpSnapshot(await snapshot(page, `After typing into option ${i + 1}`));
  }

  // Now check if Post is enabled
  console.log('\nWaiting up to 5s for Post button to enable...');
  let postEnabled = false;
  try {
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('button[aria-label="Post"]');
        return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
      },
      { timeout: 5000 }
    );
    postEnabled = true;
  } catch {}
  console.log(`Post button enabled: ${postEnabled}`);

  dumpSnapshot(await snapshot(page, 'FINAL STATE'));

  console.log('\n*** Closing without posting — this was diagnostic only ***');
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
