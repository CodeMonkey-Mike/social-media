// _probe-endorse.js — dump the DOM we need for the endorse-and-message skill:
//   1. the profile top-card controls (find the Message button form),
//   2. the "Show all skills" link on the profile,
//   3. the Endorse buttons on the /details/skills/ page (tag + aria + text +
//      the skill name each button belongs to),
//   4. the message composer overlay (contenteditable box + Send button),
// so we can pin selectors before writing the skill. Clicks NOTHING that endorses
// or sends — the only clicks are opening the Message overlay, then Escape.
//
//   node linkedin-automation/skills/endorse-and-message/_probe-endorse.js [profileUrl]
//
// Single-instance: don't run while another li-bot-profile session is open.

const S = require('../../lib/_li-session');
const URL = process.argv[2] || 'https://www.linkedin.com/in/sindhura-karnati-774349128/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function dumpControls(page, selector, label, max = 60) {
  const items = await page.$$eval(selector, els =>
    els.map(el => ({
      tag: el.tagName.toLowerCase(),
      aria: el.getAttribute('aria-label'),
      cls: (el.getAttribute('class') || '').slice(0, 60),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    })).filter(x => x.aria || x.text)
  ).catch(() => []);
  console.log(`\n--- ${label} (${items.length}) ---`);
  for (const it of items.slice(0, max)) console.log(JSON.stringify(it));
  return items;
}

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    // ---- 1. profile page: top-card controls + skills-section link ----
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await sleep(4000);
    console.log('URL:', page.url());

    await dumpControls(page, 'main section:first-of-type button, main section:first-of-type a[aria-label]', 'top-card controls');
    await dumpControls(page, 'main a[href*="details/skills"]', 'skills-section "Show all" links');

    // ---- 2. skills details page: Endorse buttons ----
    await page.goto(URL.replace(/\/?$/, '/') + 'details/skills/', { waitUntil: 'domcontentloaded' });
    await sleep(5000);
    console.log('\nSkills page URL:', page.url());

    // Every button on the page, so we see what Endorse looks like vs everything else.
    await dumpControls(page, 'main button, main a[role="button"], main a[aria-label]', 'ALL skills-page controls');

    // Endorse buttons specifically, with the skill name they belong to (nearest li).
    const endorse = await page.$$eval('main button', els =>
      els.filter(el => /endorse/i.test((el.innerText || '') + ' ' + (el.getAttribute('aria-label') || '')))
        .map(el => {
          const li = el.closest('li');
          return {
            tag: el.tagName.toLowerCase(),
            aria: el.getAttribute('aria-label'),
            text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
            skill: li ? (li.innerText || '').split('\n').map(s => s.trim()).filter(Boolean)[0] : null,
            visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
          };
        })
    ).catch(() => []);
    console.log(`\n--- Endorse buttons w/ skill names (${endorse.length}) ---`);
    for (const e of endorse) console.log(JSON.stringify(e));

    // ---- 3. message composer: open it from the profile, dump, close ----
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await sleep(3500);
    const msgBtn = page.locator('main button[aria-label*="Message" i], main a[aria-label*="Message" i]').first();
    console.log('\nMessage button count:', await msgBtn.count().catch(() => 0));
    if (await msgBtn.count().catch(() => 0)) {
      await msgBtn.click({ timeout: 6000 }).catch(e => console.log('Message click failed:', e.message.split('\n')[0]));
      await sleep(3000);

      await dumpControls(page, 'div[contenteditable="true"], [role="textbox"]', 'composer text boxes');
      await dumpControls(page, 'form button, .msg-form button, footer button', 'composer-area buttons');
      // The overlay container itself, for scoping.
      const overlays = await page.$$eval('.msg-overlay-conversation-bubble, .msg-convo-wrapper, aside', els =>
        els.map(el => ({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 80) }))
      ).catch(() => []);
      console.log(`\n--- overlay containers (${overlays.length}) ---`);
      for (const o of overlays) console.log(JSON.stringify(o));

      await page.keyboard.press('Escape').catch(() => {});
      await sleep(800);
    }

    console.log('\nProbe done (nothing endorsed, nothing sent). Closing in 5s...');
    await sleep(5000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
