// _probe-endorsements.js — dump the live DOM of MY OWN skills details page
// (https://www.linkedin.com/in/michael-luis/details/skills/) so the selectors in
// check-endorsements.js are built from evidence, not guesses (selector-discipline
// rule, skills/SKILL.md).
//
// Dumps:
//   1. every control on the page whose aria-label or visible text mentions
//      "endorsement" (tag, aria-label, text, href) + the first line of its skill
//      row container — these are the per-skill "N endorsements" openers;
//   2. after clicking the FIRST opener: the dialog's structure — every /in/ link
//      (slug + text) and every button (tag, aria-label, text), so we can see the
//      endorser rows and any "Show more" pagination control;
//   3. the dialog's raw innerText (first 2500 chars) for layout reference.
//
// Read-only except that one click; closes the dialog with Escape. This is our
// OWN profile — it does not touch the member profile-view budget.
//
// Run:  node linkedin-automation/skills/check-endorsements/_probe-endorsements.js

const S = require('../../lib/_li-session');

const MY_SKILLS_URL = 'https://www.linkedin.com/in/michael-luis/details/skills/';

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'land on feed');

    await page.goto(MY_SKILLS_URL, { waitUntil: 'domcontentloaded' });
    await S.pause(page, 3000, 6000, 'skills page render');
    if (await S.isRestricted(page)) { console.log('!! restriction page — stopping.'); return; }

    // Let the lazy list grow a bit so we see a representative set of rows.
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, 1200)).catch(() => {});
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll skills list');
    }

    // ---- 1. every "endorsement"-ish control on the page --------------------
    const openers = await page.$$eval('main a, main button, main span[role="button"]', els =>
      els
        .map(el => ({
          tag: el.tagName.toLowerCase(),
          aria: el.getAttribute('aria-label') || '',
          text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
          href: el.getAttribute('href') || '',
          // climb to the skill row: nearest <li>, else 4 ancestors up
          row: (() => {
            const li = el.closest('li');
            const t = ((li || el.parentElement?.parentElement?.parentElement?.parentElement || el).innerText || '');
            return t.replace(/\s+/g, ' ').trim().slice(0, 140);
          })(),
        }))
        .filter(x => /endorsement/i.test(x.aria) || /endorsement/i.test(x.text) || /endorsement/i.test(x.href))
    );
    console.log(`\n==== ${openers.length} endorsement-ish control(s) on the page ====`);
    for (const o of openers) {
      console.log(`- <${o.tag}> aria="${o.aria}" text="${o.text}" href="${o.href}"`);
      console.log(`    row: ${o.row}`);
    }

    // ---- 2. click the FIRST opener, dump the dialog ------------------------
    if (!openers.length) { console.log('\nNo openers found — nothing to click.'); return; }

    // Re-find the first matching element as a live handle.
    let handle = null;
    for (const h of await page.$$('main a, main button, main span[role="button"]')) {
      const hit = await h.evaluate(el => {
        const aria = el.getAttribute('aria-label') || '';
        const text = (el.innerText || '').trim();
        const href = el.getAttribute('href') || '';
        return /endorsement/i.test(aria) || /endorsement/i.test(text) || /endorsement/i.test(href);
      }).catch(() => false);
      if (hit) { handle = h; break; }
    }
    if (!handle) { console.log('\nCould not re-acquire an opener handle.'); return; }

    await handle.scrollIntoViewIfNeeded().catch(() => {});
    await S.pause(page, 1000, 2500, 'before opener click');
    await handle.click({ timeout: 6000 });
    await S.pause(page, 2500, 5000, 'dialog render');

    const dlg = page.locator('div[role="dialog"]').first();
    if (!(await dlg.count().catch(() => 0))) {
      console.log('\n!! No div[role="dialog"] appeared. Current URL: ' + page.url());
      // Maybe it navigated instead of opening a modal — dump main instead.
      const mainTxt = await page.$eval('main', el => el.innerText.slice(0, 2500)).catch(() => '');
      console.log('---- <main> innerText (first 2500 chars) ----\n' + mainTxt);
      return;
    }

    const links = await dlg.evaluate(el =>
      [...el.querySelectorAll('a[href*="/in/"]')].map(a => ({
        href: a.getAttribute('href'),
        text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      }))
    );
    console.log(`\n==== dialog: ${links.length} /in/ link(s) ====`);
    for (const l of links) console.log(`- ${l.href}  |  "${l.text}"`);

    const buttons = await dlg.evaluate(el =>
      [...el.querySelectorAll('button, a[role="button"]')].map(b => ({
        tag: b.tagName.toLowerCase(),
        aria: b.getAttribute('aria-label') || '',
        text: (b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      }))
    );
    console.log(`\n==== dialog: ${buttons.length} button(s) ====`);
    for (const b of buttons) console.log(`- <${b.tag}> aria="${b.aria}" text="${b.text}"`);

    const txt = await dlg.evaluate(el => (el.innerText || '').slice(0, 2500));
    console.log('\n---- dialog innerText (first 2500 chars) ----\n' + txt);

    await page.keyboard.press('Escape').catch(() => {});
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
