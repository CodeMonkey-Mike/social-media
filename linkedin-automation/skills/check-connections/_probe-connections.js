// _probe-connections.js — verify the FIXED per-card harvest: each connection card
// should yield its OWN slug + "Connected on ..." date (not the whole-list blob).
//   node linkedin-automation/skills/check-connections/_probe-connections.js

const S = require('../../lib/_li-session');
const CONNECTIONS_URL = 'https://www.linkedin.com/mynetwork/invite-connect/connections/';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Same harvest logic as check-connections.js.
async function harvestCards(page) {
  return page.$$eval('a[href*="/in/"]', els => {
    const slugOf = el => (((el.getAttribute('href') || '').match(/\/in\/([^/?#]+)/)) || [])[1];
    const out = [];
    for (const a of els) {
      const slug = slugOf(a);
      if (!slug) continue;
      let node = a, card = null;
      for (let i = 0; i < 6 && node.parentElement; i++) {
        node = node.parentElement;
        const slugs = new Set([...node.querySelectorAll('a[href*="/in/"]')].map(slugOf).filter(Boolean));
        if (slugs.size > 1) break;
        if (/connected/i.test(node.innerText || '')) card = node;
      }
      if (card) out.push({ slug, text: (card.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) });
    }
    return out;
  }).catch(() => []);
}

// Same parser as check-connections.js (compact).
function parseConnectedDate(text) {
  const t = (text || '').replace(/\s+/g, ' ');
  const m = t.match(/connected on ([A-Za-z]+ \d{1,2},? \d{4})/i);
  if (m) { const d = new Date(m[1]); if (!isNaN(d)) return d.toISOString().slice(0, 10); }
  if (/connected today/i.test(t)) return 'TODAY';
  if (/connected yesterday/i.test(t)) return 'YESTERDAY';
  const r = t.match(/connected (\d+)\s*(day|week|month|year)s?\s*ago/i);
  if (r) return `${r[1]} ${r[2]}(s) ago`;
  return 'NO-DATE';
}

(async () => {
  const { browser, page } = await S.launchSession();
  try {
    await page.goto(CONNECTIONS_URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    console.log('URL:', page.url(), ' restricted?', await S.isRestricted(page));
    await sleep(4000);
    for (let i = 0; i < 2; i++) { await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight)); await sleep(2200); }

    const cards = await harvestCards(page);
    // Dedup by slug (avatar + name anchors both yield the same card).
    const bySlug = new Map();
    for (const c of cards) if (!bySlug.has(c.slug)) bySlug.set(c.slug, c);

    console.log(`\n${bySlug.size} unique connection cards. First 10 (slug -> parsed date | snippet):`);
    let i = 0;
    for (const c of bySlug.values()) {
      if (i++ >= 10) break;
      console.log(`  ${c.slug}  ->  ${parseConnectedDate(c.text)}   | ${c.text.slice(0, 70)}`);
    }
    const distinctDates = new Set([...bySlug.values()].map(c => parseConnectedDate(c.text)));
    console.log(`\nDistinct parsed dates across cards: ${distinctDates.size} (should be >1 if cards are isolated correctly)`);

    console.log('\nLeaving browser open 12s...');
    await sleep(12000);
  } catch (e) {
    console.error('PROBE ERROR:', e.message);
  } finally {
    await browser.close();
  }
})();
