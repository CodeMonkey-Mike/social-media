// Diagnostic v2: recapture X poll-widget selectors after the selectPollDays break (2026-06-08).
// v1 showed clicking createPollButton (synthetic event) opened NO poll UI. v2 does a REAL
// Playwright click + real mouse click, screenshots, and dumps the dialog innerText + nodes
// so we can see whether the widget opens, moves, or shows an upsell.
const { chromium } = require('playwright');
const path = require('path');

const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\xbot-profile';
const SHOT = p => path.join(__dirname, '..', p);

async function dumpPoll(page, label) {
  const dump = await page.evaluate(() => {
    const scope = document.querySelector('[role="dialog"]') ||
      document.querySelector('[data-testid="primaryColumn"]') || document.body;
    const desc = el => ({
      tag: el.tagName.toLowerCase(), testid: el.getAttribute('data-testid'),
      role: el.getAttribute('role'), label: el.getAttribute('aria-label'),
      placeholder: el.getAttribute('placeholder'), name: el.getAttribute('name'),
      type: el.getAttribute('type'), text: (el.innerText || '').trim().slice(0, 40),
    });
    const testids = {};
    scope.querySelectorAll('[data-testid]').forEach(el => {
      const t = el.getAttribute('data-testid'); testids[t] = (testids[t] || 0) + 1;
    });
    return {
      selectPollDaysExists: !!scope.querySelector('[data-testid="selectPollDays"]'),
      pollish: Object.keys(testids).filter(t => /poll|choice|option|select|duration|day|hour|minute/i.test(t)),
      selects: [...scope.querySelectorAll('select')].map(s => ({ ...desc(s), options: [...s.options].map(o => ({ value: o.value, text: o.text })) })),
      inputs: [...scope.querySelectorAll('input')].map(desc),
      roleNodes: [...scope.querySelectorAll('[role="listbox"],[role="combobox"],[role="menu"],[role="spinbutton"],[role="radiogroup"]')].map(desc),
    };
  });
  console.log(`\n=== [${label}] selectPollDays? ${dump.selectPollDaysExists} | poll-ish: ${JSON.stringify(dump.pollish)} ===`);
  console.log(`  selects: ${JSON.stringify(dump.selects)}`);
  console.log(`  inputs: ${JSON.stringify(dump.inputs)}`);
  console.log(`  roleNodes: ${JSON.stringify(dump.roleNodes)}`);
}

(async () => {
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome', headless: false, slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  const page = browser.pages()[0] || await browser.newPage();
  await page.goto('https://x.com/home');
  await page.waitForSelector('[data-testid="primaryColumn"]', { timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.locator('[data-testid="SideNav_NewTweet_Button"]').click();
  await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.locator('[data-testid="tweetTextarea_0"]').first().click();
  await page.keyboard.type('selector recapture test');
  await page.waitForTimeout(800);

  await dumpPoll(page, 'before click');
  await page.screenshot({ path: SHOT('diag-poll-1-before.png') });

  // REAL Playwright click on the Add poll button.
  const pollBtn = page.locator('[data-testid="createPollButton"]').first();
  const box = await pollBtn.boundingBox();
  console.log('\ncreatePollButton boundingBox:', JSON.stringify(box));
  try {
    await pollBtn.click({ timeout: 5000 });
    console.log('Playwright .click() done');
  } catch (e) {
    console.log('Playwright .click() error:', e.message);
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SHOT('diag-poll-2-after-click.png') });
  await dumpPoll(page, 'after Playwright click');

  // Try a real mouse click at coordinates too (in case .click was intercepted).
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    console.log('\nReal mouse click at center done');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: SHOT('diag-poll-3-after-mouseclick.png') });
    await dumpPoll(page, 'after real mouse click');
  }

  // Full dialog innerText (catch any upsell / "not available" message).
  const dialogText = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText.slice(0, 1500) : '(no dialog)';
  });
  console.log('\n=== DIALOG innerText ===\n' + dialogText);

  console.log('\nLeaving browser open 60s for manual inspection...');
  await page.waitForTimeout(60000);
  await browser.close();
})().catch(err => { console.error('Diagnostic failed:', err.message); process.exit(1); });
