// _probe-message.js — find the REAL message entry point on a 1st-degree
// connection's profile. The 2026-07 profile UI shows NO plain "Message" button on
// some top cards (only a bell + "More" + an "Introduce myself" anchor), and the
// page also carries several "Message <OTHER person>" anchors in the "More
// profiles for you" module — so this dumps, in order:
//   1. every main-content control whose aria/text mentions Message / Introduce,
//      with hrefs (to tell the owner's control from the module anchors),
//   2. the More menu's items,
// and clicks NOTHING except opening/closing More.
//
//   node linkedin-automation/skills/endorse-and-message/_probe-message.js [profileUrl]

const S = require('../../lib/_li-session');
const URL = process.argv[2] || 'https://www.linkedin.com/in/sindhura-karnati-774349128/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await sleep(5000);
    console.log('URL:', page.url());

    const dump = await page.$$eval('main button, main a', els =>
      els.map(el => ({
        tag: el.tagName.toLowerCase(),
        aria: el.getAttribute('aria-label'),
        href: el.getAttribute('href'),
        text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
      })).filter(x => /message|introduce|msg/i.test(`${x.aria} ${x.text} ${x.href}`))
    ).catch(() => []);
    console.log(`\n--- message-ish controls in main (${dump.length}) ---`);
    for (const d of dump) console.log(JSON.stringify(d));

    // Open the top-card More menu and dump every item.
    const more = page.locator('main button:visible', { hasText: /^More$/ }).first();
    console.log('\nMore button count:', await more.count().catch(() => 0));
    if (await more.count().catch(() => 0)) {
      await more.click({ timeout: 6000 }).catch(e => console.log('More click failed:', e.message.split('\n')[0]));
      await sleep(1800);
      const menu = await page.$$eval('div[role="menu"] a, div[role="menu"] button, div[role="menu"] [role="menuitem"]', els =>
        els.map(el => ({
          tag: el.tagName.toLowerCase(),
          aria: el.getAttribute('aria-label'),
          href: el.getAttribute('href'),
          text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        }))
      ).catch(() => []);
      console.log(`\n--- More menu items (${menu.length}) ---`);
      for (const m of menu) console.log(JSON.stringify(m));
      await page.keyboard.press('Escape').catch(() => {});
    }

    console.log('\nProbe done (nothing clicked but More). Closing in 5s...');
    await sleep(5000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
