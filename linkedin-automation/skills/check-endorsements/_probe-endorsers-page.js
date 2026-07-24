// _probe-endorsers-page.js — second probe for check-endorsements.js.
//
// _probe-endorsements.js established that each endorsed skill row on
// /in/michael-luis/details/skills/ carries an <a> "N endorsements" whose href is
// a stable URN URL ending in /endorsers/, and that clicking it NAVIGATES (SPA)
// rather than opening a div[role=dialog] — the endorser list hadn't rendered
// after ~4s, so this probe visits the /endorsers/ pages directly with a longer
// settle wait and dumps what actually renders:
//   1. the skill-name climb: for each opener anchor, walk ancestors until the
//      container text holds more than the "N endorsements" line — verifying how
//      to map anchor -> skill name;
//   2. on a small endorsers page (2 endorsers) AND the largest one (Python, 50):
//      every /in/ link in the DOCUMENT (not just main) with its text, every
//      button matching /show more|load|next/i, and the page innerText head —
//      to see the endorser rows, their name text, and the pagination control.
//
// Own profile — no member profile views.
//
// Run:  node linkedin-automation/skills/check-endorsements/_probe-endorsers-page.js

const S = require('../../lib/_li-session');

const MY_SKILLS_URL = 'https://www.linkedin.com/in/michael-luis/details/skills/';

async function dumpEndorsersPage(page, url, label) {
  console.log(`\n######## ${label}: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Wait for real content: profile links beyond the global nav.
  await page.waitForFunction(() => {
    const links = [...document.querySelectorAll('a[href*="/in/"]')];
    return links.length > 0 && /endorse/i.test(document.body.innerText);
  }, { timeout: 20000 }).catch(() => console.log('  (content wait timed out — dumping anyway)'));
  await S.pause(page, 4000, 7000, 'endorsers page settle');

  // Scroll to trigger any lazy loading.
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 1500)).catch(() => {});
    await S.pause(page, 1500, 2800, 'scroll endorsers');
  }

  const links = await page.$$eval('a[href*="/in/"]', els =>
    els.map(a => ({
      href: (a.getAttribute('href') || '').slice(0, 110),
      text: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 110),
      inMain: !!a.closest('main'),
      inDialog: !!a.closest('[role="dialog"], [data-test-modal], .artdeco-modal'),
    }))
  );
  console.log(`==== ${links.length} /in/ link(s) in document ====`);
  for (const l of links) console.log(`- [main:${l.inMain ? 'y' : 'n'} dlg:${l.inDialog ? 'y' : 'n'}] ${l.href}  |  "${l.text}"`);

  const pagers = await page.$$eval('button, a', els =>
    els
      .map(b => ({
        tag: b.tagName.toLowerCase(),
        aria: b.getAttribute('aria-label') || '',
        text: (b.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      }))
      .filter(x => /show more|load more|see more|next/i.test(x.text) || /show more|load more|next/i.test(x.aria))
  );
  console.log(`==== ${pagers.length} pagination-ish control(s) ====`);
  for (const p of pagers) console.log(`- <${p.tag}> aria="${p.aria}" text="${p.text}"`);

  const txt = await page.$eval('main', el => (el.innerText || '').slice(0, 1800)).catch(() => '');
  console.log('---- main innerText (first 1800 chars) ----\n' + txt);
}

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'land on feed');

    await page.goto(MY_SKILLS_URL, { waitUntil: 'domcontentloaded' });
    await S.pause(page, 3000, 6000, 'skills page render');
    if (await S.isRestricted(page)) { console.log('!! restriction page — stopping.'); return; }
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, 1200)).catch(() => {});
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll skills list');
    }

    // ---- 1. verify the anchor -> skill-name climb --------------------------
    const rows = await page.$$eval('main a[href*="/endorsers/"]', els =>
      els.map(a => {
        let node = a, name = null;
        for (let i = 0; i < 8 && node.parentElement; i++) {
          node = node.parentElement;
          const lines = (node.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
          const cand = lines.find(l => !/endorsement/i.test(l) && !/^endorsed by/i.test(l));
          if (cand) { name = cand; break; }
        }
        return { href: a.getAttribute('href'), text: (a.innerText || '').trim(), name };
      })
    );
    console.log(`==== ${rows.length} endorser-page anchor(s) with climbed skill names ====`);
    for (const r of rows) console.log(`- "${r.name}"  (${r.text})  ${r.href.slice(0, 100)}`);

    // ---- 2. dump a small endorsers page and the largest one ----------------
    if (rows.length) {
      await dumpEndorsersPage(page, rows[0].href, 'SMALL (first skill)');
      const counts = rows.map(r => parseInt(r.text, 10) || 0);
      const biggest = rows[counts.indexOf(Math.max(...counts))];
      if (biggest && biggest.href !== rows[0].href) {
        await dumpEndorsersPage(page, biggest.href, `LARGEST (${biggest.text})`);
      }
    }
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
