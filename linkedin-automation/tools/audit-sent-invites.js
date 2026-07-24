// audit-sent-invites.js  (READ-ONLY diagnostic, 2026-07-22)
// Opens the Sent invitations page and compares who ACTUALLY has a pending invite
// against members.json entries stamped contact_status:"sent" recently.
//
// Purpose: a suspected wrong-person invite (Ja Claylyn Hamner received our note
// but exists nowhere in our data). If a recently-stamped member is MISSING from
// the Sent list (and not connected), their Connect click likely landed on a
// "More profiles for you" suggestion card instead.
//
// One list page, no profile views, writes nothing, clicks nothing but scroll /
// "Load more". Run: node linkedin-automation/tools/audit-sent-invites.js

const path = require('path');
const S = require('../lib/_li-session');

const MEMBERS = path.join(__dirname, '..', 'data', 'members.json');
const SENT_URL = 'https://www.linkedin.com/mynetwork/invitation-manager/sent/';
const RECENT_DAYS = 30;          // audit window: stamped "sent" within this many days
const MAX_ROUNDS = 40;           // scroll / load-more rounds (enough to exhaust the list)
const STALL_LIMIT = 4;

// Harvest sent-invite cards currently in the DOM: {slug, name, text}.
async function harvestSent(page) {
  return page.$$eval('a[href*="/in/"]', els => {
    const slugOf = el => (((el.getAttribute('href') || '').match(/\/in\/([^/?#]+)/)) || [])[1];
    const out = [];
    for (const a of els) {
      const slug = slugOf(a);
      if (!slug) continue;
      // climb to the single-profile card that carries the "Sent ..." line
      let node = a, card = null;
      for (let i = 0; i < 7 && node.parentElement; i++) {
        node = node.parentElement;
        const slugs = new Set([...node.querySelectorAll('a[href*="/in/"]')].map(slugOf).filter(Boolean));
        if (slugs.size > 1) break;
        if (/sent\s/i.test(node.innerText || '')) card = node;
      }
      const text = ((card && card.innerText) || a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160);
      out.push({ slug, text });
    }
    return out;
  }).catch(() => []);
}

(async () => {
  const members = S.readJson(MEMBERS, []);
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - RECENT_DAYS);
  const recentSent = members.filter(m =>
    m.contact_status === 'sent' && m.contacted_at && new Date(m.contacted_at) >= cutoff);
  console.log(`Auditing ${recentSent.length} member(s) stamped "sent" in the last ${RECENT_DAYS} days`);
  recentSent.forEach(m => console.log(`  ${m.contacted_at}  ${S.slugFromUrl(m.profile_url)}`));

  const { browser, page } = await S.launchSession();
  const pending = new Map(); // slug -> card text
  try {
    await page.goto(SENT_URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    if (await S.isRestricted(page)) { console.log('\n!! Restriction page. STOPPING.'); return; }
    await S.pause(page, 2500, 4500, 'let sent list render');

    let stalls = 0, prev = 0;
    for (let round = 0; round < MAX_ROUNDS && stalls < STALL_LIMIT; round++) {
      for (const c of await harvestSent(page)) if (!pending.has(c.slug)) pending.set(c.slug, c.text);
      console.log(`  round ${round + 1}: ${pending.size} sent invites seen`);
      if (pending.size === prev) stalls++; else stalls = 0;
      prev = pending.size;

      // paginate: try every plausible control, then scroll both window and list
      const more = page.locator(
        'button:visible:has-text("Show more"), button:visible:has-text("Load more"), ' +
        'button[aria-label*="more results" i]:visible, button:visible:has-text("Next")'
      ).first();
      if (await more.count().catch(() => 0)) {
        await more.scrollIntoViewIfNeeded().catch(() => {});
        await more.click({ timeout: 5000 }).catch(() => {});
      } else {
        await page.evaluate(() => {
          window.scrollBy(0, document.body.scrollHeight);
          document.querySelectorAll('main, [class*="scaffold"], [class*="list"]').forEach(el => {
            if (el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
          });
        });
      }
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'paginate sent list');
    }

    console.log('\n---- ALL harvested cards (slug + card text) ----');
    for (const [slug, text] of pending) console.log(`  ${slug}\n    ${text}`);

    console.log('\n================ AUDIT RESULT ================');
    console.log(`Sent-invite cards harvested: ${pending.size}`);
    const missing = [], present = [];
    for (const m of recentSent) {
      const slug = S.slugFromUrl(m.profile_url);
      (pending.has(slug) ? present : missing).push(m);
    }
    console.log(`\nPRESENT in Sent list (invite really pending): ${present.length}`);
    present.forEach(m => console.log(`  OK       ${m.contacted_at}  ${S.slugFromUrl(m.profile_url)}`));
    console.log(`\nMISSING from Sent list (misfire candidates): ${missing.length}`);
    missing.forEach(m => console.log(`  MISSING  ${m.contacted_at}  ${S.slugFromUrl(m.profile_url)}`));
    console.log('\n(An invite the recipient IGNORED also disappears, so older MISSING entries');
    console.log('are ambiguous; TODAY\'s missing entries are the strong misfire signal.)');

    // Bonus: is the accidental recipient visible anywhere in the harvested cards?
    const ja = [...pending.keys()].find(s => /claylyn|hamner|188455233/i.test(s));
    console.log(`\nJa Claylyn Hamner in Sent list: ${ja ? ja + ' (still pending?!)' : 'no (consistent with her having ACCEPTED)'}`);
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
