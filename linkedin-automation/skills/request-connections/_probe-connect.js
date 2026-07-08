// _probe-connect.js — dump the profile top-card buttons + the "More" menu items,
// so we can pin the Connect / Add-a-note / Send selectors. Single-instance.
//   node linkedin-automation/skills/request-connections/_probe-connect.js [profileUrl]

const S = require('../../lib/_li-session');
const URL = process.argv[2] || 'https://www.linkedin.com/in/yanina-silva-76781a255/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function dumpControls(page, label) {
  // Include `main a[aria-label]`: LinkedIn renders the primary Connect as a plain
  // <a> anchor (no role="button"), which the old selector missed entirely.
  const items = await page.$$eval('main button, main a[role="button"], main a[aria-label], div[role="menu"] [role="menuitem"], div[role="menu"] button, div[role="menu"] a', els =>
    els.map(el => ({
      tag: el.tagName.toLowerCase(),
      aria: el.getAttribute('aria-label'),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
    })).filter(x => x.aria || x.text)
  ).catch(() => []);
  console.log(`\n--- ${label} (${items.length}) ---`);
  for (const it of items) console.log(JSON.stringify(it));
}

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await sleep(4000);
    console.log('URL:', page.url());

    await dumpControls(page, 'top-card controls (before opening More)');

    // Find + click a "More" button in the top card.
    const more = page.locator('main button[aria-label*="More actions" i], main button[aria-label="More"], main button:has-text("More")').first();
    console.log('\nMore button count:', await more.count().catch(() => 0));
    if (await more.count().catch(() => 0)) {
      await more.click({ timeout: 6000 }).catch(e => console.log('More click failed:', e.message.split('\n')[0]));
      await sleep(1500);
      await dumpControls(page, 'after opening More menu');

      // Click the Connect <a> in the menu and dump the modal — but DO NOT send.
      const connect = page.locator('div[role="menu"] a:has-text("Connect"), div[role="menu"] [role="menuitem"]:has-text("Connect"), div[role="menu"] button:has-text("Connect")').first();
      console.log('\nmenu Connect count:', await connect.count().catch(() => 0));
      if (await connect.count().catch(() => 0)) {
        await connect.click({ timeout: 6000 }).catch(e => console.log('Connect click failed:', e.message.split('\n')[0]));
        await sleep(2500);
        // Dump dialog buttons + any textarea.
        const dlg = await page.$$eval('div[role="dialog"] button, div[role="dialog"] textarea', els =>
          els.map(el => ({
            tag: el.tagName.toLowerCase(),
            aria: el.getAttribute('aria-label'),
            name: el.getAttribute('name'),
            id: el.id,
            text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          }))
        ).catch(() => []);
        console.log(`\n--- connect modal controls, initial (${dlg.length}) ---`);
        for (const d of dlg) console.log(JSON.stringify(d));

        // Click "Add a note" and dump the textarea + Send button state. Still NO send.
        const addNote = page.locator('div[role="dialog"] button[aria-label="Add a note"], div[role="dialog"] button:has-text("Add a note")').first();
        if (await addNote.count().catch(() => 0)) {
          await addNote.click({ timeout: 5000 }).catch(e => console.log('Add-note click failed:', e.message.split('\n')[0]));
          await sleep(1800);
          const dlg2 = await page.$$eval('div[role="dialog"] button, div[role="dialog"] textarea', els =>
            els.map(el => ({
              tag: el.tagName.toLowerCase(),
              aria: el.getAttribute('aria-label'),
              name: el.getAttribute('name'),
              id: el.id,
              maxlength: el.getAttribute('maxlength'),
              text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
            }))
          ).catch(() => []);
          console.log(`\n--- connect modal controls, AFTER Add-a-note (${dlg2.length}) ---`);
          for (const d of dlg2) console.log(JSON.stringify(d));
        }

        // Dismiss WITHOUT sending.
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(800);
        await page.keyboard.press('Escape').catch(() => {});
      }
    }

    console.log('\nLeaving browser open 15s (NOT sent)...');
    await sleep(15000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
