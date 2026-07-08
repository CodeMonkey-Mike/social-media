// _probe-send.js — pin the composer SEND button, which only renders once the box
// has content (an empty-composer dump can't see it — that's how the first live
// run failed with no_send_button). Opens the target's composer, reports any
// LEFTOVER DRAFT, types one throwaway char if empty, dumps every button in the
// overlay/messaging area, then CLEARS the box (select-all + delete) and closes.
// Sends NOTHING; ends with an empty, draft-free composer.
//
//   node linkedin-automation/skills/endorse-and-message/_probe-send.js [profileUrl]

const S = require('../../lib/_li-session');
const URL = process.argv[2] || 'https://www.linkedin.com/in/sindhura-karnati-774349128/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await sleep(5000);

    // The owner's Message anchor: no aria-label, exact text "Message", compose href.
    let msgBtn = null;
    for (const h of await page.$$('main a[href*="/messaging/compose"], main button')) {
      const ok = await h.evaluate(el =>
        (el.innerText || '').trim() === 'Message' &&
        !el.getAttribute('aria-label') &&
        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      ).catch(() => false);
      if (ok) { msgBtn = h; break; }
    }
    console.log('owner Message control found:', !!msgBtn);
    if (!msgBtn) return;

    await msgBtn.click();
    await sleep(3500);

    const box = page.locator(
      'div.msg-form__contenteditable[contenteditable="true"], div[contenteditable="true"][aria-label*="message" i], [role="textbox"][contenteditable="true"]'
    ).first();
    console.log('composer box found:', !!(await box.count().catch(() => 0)));
    if (!(await box.count().catch(() => 0))) return;

    const draft = ((await box.innerText().catch(() => '')) || '').trim();
    console.log(`\nLEFTOVER DRAFT (${draft.length} chars):`);
    if (draft) console.log(draft.slice(0, 300) + (draft.length > 300 ? ' ...[truncated]' : ''));

    await box.click().catch(() => {});
    await sleep(800);
    if (!draft) {
      await page.keyboard.type('x');
      await sleep(1200);
    }

    // NOW the Send control should exist. Dump every button anywhere near messaging.
    const btns = await page.$$eval(
      'aside button, .msg-overlay-container button, .msg-convo-wrapper button, form button, footer button, div[class*="msg"] button',
      els => [...new Set(els)].map(el => ({
        tag: el.tagName.toLowerCase(),
        aria: el.getAttribute('aria-label'),
        cls: (el.getAttribute('class') || '').slice(0, 70),
        type: el.getAttribute('type'),
        disabled: el.disabled,
        text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
      })).filter(x => x.visible && (x.aria || x.text))
    ).catch(() => []);
    console.log(`\n--- visible buttons in messaging area, box NON-empty (${btns.length}) ---`);
    for (const b of btns) console.log(JSON.stringify(b));

    // Clear the box completely (removes our 'x' AND any leftover draft).
    await box.click().catch(() => {});
    await page.keyboard.press('Control+a');
    await sleep(300);
    await page.keyboard.press('Delete');
    await sleep(800);
    const after = ((await box.innerText().catch(() => '')) || '').trim();
    console.log(`\nbox after clear (${after.length} chars): "${after.slice(0, 80)}"`);

    await page.keyboard.press('Escape').catch(() => {});
    console.log('\nProbe done (nothing sent, composer cleared). Closing in 5s...');
    await sleep(5000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
