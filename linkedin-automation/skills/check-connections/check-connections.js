// check-connections.js
// Opens the My Network connections page, finds which of our contacted members have
// ACCEPTED the connection, and records the date as `connected_on` in members.json.
//
// Built on _li-session.js (same persistent Chrome session + login gate). This is a
// single list page, not a profile sweep, so it barely touches the profile-view
// volume limit.
//
// members.json gains one field per newly-accepted member:
//   connected_on   the date they connected (YYYY-MM-DD)
//
// Run:  node linkedin-automation/check-connections.js [--dry-run]
//   --dry-run   scan + report matches, but DON'T write members.json.
//
// We only look for members that are contacted:true and don't yet have connected_on.
// Default sort on the connections page is "recently added", so we scroll only until
// every outstanding member is found (or the list/stall cap is hit).

const path = require('path');
const S = require('../../lib/_li-session');

const MEMBERS = path.join(__dirname, '..', '..', 'data', 'members.json');
const CONNECTIONS_URL = 'https://www.linkedin.com/mynetwork/invite-connect/connections/';

const DRY_RUN = process.argv.slice(2).includes('--dry-run');

// The connections list is sorted "recently added", so newly-accepted invites are
// near the TOP — a modest scroll covers them. We don't crawl the whole network
// every run (pending members are never found, so the loop otherwise runs to the cap).
const MAX_SCROLL_ROUNDS  = 10;
const SCROLL_STALL_LIMIT = 5;   // stop after this many rounds with no new cards

function today() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function toYMD(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Parse a connection card's text into a YYYY-MM-DD date.
// Handles: "Connected on June 20, 2026" (exact) and relative forms
// ("Connected today/yesterday", "Connected 3 days/weeks/months ago").
// Returns { date, exact } — exact:false means we fell back to a computed/observed date.
function parseConnectedDate(text) {
  if (!text) return { date: today(), exact: false };
  const t = text.replace(/\s+/g, ' ');

  const exact = t.match(/connected on ([A-Za-z]+ \d{1,2},? \d{4})/i);
  if (exact) {
    const d = new Date(exact[1]);
    if (!isNaN(d)) return { date: toYMD(d), exact: true };
  }
  if (/connected today/i.test(t)) return { date: today(), exact: true };
  if (/connected yesterday/i.test(t)) {
    const d = new Date(); d.setDate(d.getDate() - 1); return { date: toYMD(d), exact: true };
  }
  const rel = t.match(/connected (\d+)\s*(day|week|month|year)s?\s*ago/i);
  if (rel) {
    const n = parseInt(rel[1], 10);
    const d = new Date();
    const unit = rel[2].toLowerCase();
    if (unit === 'day') d.setDate(d.getDate() - n);
    else if (unit === 'week') d.setDate(d.getDate() - n * 7);
    else if (unit === 'month') d.setMonth(d.getMonth() - n);
    else if (unit === 'year') d.setFullYear(d.getFullYear() - n);
    return { date: toYMD(d), exact: true };
  }
  // Couldn't read a date — record today as the observed date, flagged inexact.
  return { date: today(), exact: false };
}

// Harvest connection cards currently in the DOM: { slug, text } per /in/ link.
// Each card's correct container is the HIGHEST ancestor that still references
// exactly ONE distinct profile slug AND holds a "Connected ..." line — one level
// further up merges into the whole ConnectionsList (every card would then share the
// first date in the list). So we climb while distinctSlugs === 1 and keep the last
// ancestor that contains "Connected".
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
        if (slugs.size > 1) break;                                  // overshot into the list
        if (/connected/i.test(node.innerText || '')) card = node;   // best single-card so far
      }
      if (card) out.push({ slug, text: (card.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) });
    }
    return out;
  }).catch(() => []);
}

(async () => {
  const members = S.readJson(MEMBERS, []);
  // Outstanding = we invited them and don't yet know they connected.
  const outstanding = new Map(); // slug -> member
  for (const m of members) {
    if (m.contacted === true && !m.connected_on) {
      const slug = S.slugFromUrl(m.profile_url);
      if (slug) outstanding.set(slug, m);
    }
  }
  console.log(`members.json: ${members.length} total, ${outstanding.size} contacted & awaiting acceptance.`);
  if (DRY_RUN) console.log('** DRY RUN ** — will report matches but NOT write members.json.\n');
  if (!outstanding.size) { console.log('Nothing to check.'); return; }

  const { browser, page } = await S.launchSession();
  const found = new Map(); // slug -> {date, exact}
  let updated = 0;

  try {
    await page.goto(CONNECTIONS_URL, { waitUntil: 'domcontentloaded' });
    await S.ensureLoggedIn(page);
    if (await S.isRestricted(page)) { console.log('\n!! LinkedIn restriction page detected. STOPPING.'); return; }
    await S.pause(page, 2500, 4500, 'let connections render');

    let stalls = 0;
    let prevSeen = 0;
    const seenSlugs = new Set();

    for (let round = 0; round < MAX_SCROLL_ROUNDS && stalls < SCROLL_STALL_LIMIT; round++) {
      const cards = await harvestCards(page);
      for (const c of cards) {
        if (!seenSlugs.has(c.slug)) seenSlugs.add(c.slug);
        if (outstanding.has(c.slug) && !found.has(c.slug)) {
          found.set(c.slug, parseConnectedDate(c.text));
        }
      }
      console.log(`  scroll round ${round + 1}: ${seenSlugs.size} connection cards seen, ${found.size}/${outstanding.size} of ours matched`);

      if (found.size >= outstanding.size) break; // got them all
      if (seenSlugs.size === prevSeen) stalls++; else stalls = 0;
      prevSeen = seenSlugs.size;

      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
      await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll connections');
    }

    // Apply matches.
    for (const [slug, info] of found) {
      const m = outstanding.get(slug);
      m.connected_on = info.date;
      if (m.contact_status !== 'connected') m.contact_status = 'connected';
      updated++;
      console.log(`   CONNECTED ${slug} -> ${info.date}${info.exact ? '' : ' (date not shown; recorded as observed today)'}`);
    }
    if (updated && !DRY_RUN) S.writeJson(MEMBERS, members);

    const stillOut = outstanding.size - found.size;
    console.log('\n============================================================');
    console.log(` DONE. ${updated} member(s) marked connected${DRY_RUN ? ' (dry-run, NOT written)' : ''}.`);
    console.log(` ${stillOut} contacted member(s) still not in your connections (pending or declined).`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
