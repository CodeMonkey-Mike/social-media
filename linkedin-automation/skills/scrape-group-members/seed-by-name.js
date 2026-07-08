// seed-by-name.js — collect group members by NAME search into the work queue.
//
// For a big group (tens of thousands), enumerating every member is impractical and
// mostly wasted on out-of-zone people. Instead we search a handful of names in the
// group's in-page "Search members" box and capture EVERY member the search returns
// (LinkedIn substring-matches, so "Albert" also pulls "Alberto", "John Albert", ...).
//
// This step ONLY writes data/members-urls.json (the queue) as
//   { profile_url, processed:false, group_id }
// It does NOT visit profiles or read location — that is the separate process phase
// (scrape-group-members.js, run with --max=N at <=50/day).
//
//   node linkedin-automation/skills/scrape-group-members/seed-by-name.js \
//        --group=6665791 --names="Albert,Andrew,Anthony,Ana"
//
// Flags:
//   --group=ID        group to search (default 6665791)
//   --names="A,B,C"   comma-separated names to search (required)
//   --legacy-group=ID group_id to backfill onto existing queue entries that lack one
//                     (default 9078205 — the only group scraped before this field existed)
//
// Single-instance: don't run while another li-bot-profile session is open.

const path = require('path');
const S = require('../../lib/_li-session');

const DATA = path.join(__dirname, '..', '..', 'data');
const QUEUE = path.join(DATA, 'members-urls.json');
const GROUPS = path.join(DATA, 'groups.json');

const ARGV = process.argv.slice(2);
function flag(name, def) {
  const a = ARGV.find(x => x.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : def;
}
const GROUP_ID = flag('group', '6665791');
const LEGACY_GROUP = flag('legacy-group', '9078205');
const NAMES = flag('names', '').split(',').map(s => s.trim()).filter(Boolean);

const MEMBERS_URL = `https://www.linkedin.com/groups/${GROUP_ID}/members/`;
// The visible in-page member filter (placeholder/aria "Search members"). The hidden
// "Search for posts in this group" box has no "member" in its label, so this is unique.
const SEARCH_BOX = 'input[placeholder*="member" i], input[aria-label*="member" i]';

const MAX_SCROLL_ROUNDS = 60;   // safety cap per name
const STALL_LIMIT = 4;          // stop a name after N rounds with no new members

// Harvest every distinct canonical /in/ URL currently in the DOM.
async function harvest(page) {
  const hrefs = await page.$$eval('a[href*="/in/"]', els => els.map(a => a.getAttribute('href'))).catch(() => []);
  const out = new Set();
  for (const h of hrefs) {
    const c = S.canonicalProfileUrl(h);
    if (c) out.add(c);
  }
  return out;
}

// Search one name and scroll its filtered result list until it stops growing.
// Returns a Set of canonical profile URLs.
async function searchName(page, name) {
  // Fresh load resets scroll position and clears any prior filter.
  await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
  await S.ensureLoggedIn(page);
  await S.pause(page, 3000, 5000, 'member list render');

  if (await S.isRestricted(page)) throw new Error('RESTRICTED');

  const box = page.locator(SEARCH_BOX).first();
  await box.click({ timeout: 8000 });
  await S.pause(page, 600, 1200, 'focus search');
  await box.fill('');
  await box.type(name, { delay: S.randomBetween(60, 160) });
  await S.pause(page, 600, 1200, `typed "${name}"`);
  await box.press('Enter');
  await S.pause(page, 3500, 6000, 'wait for results');

  const found = new Set();
  let stalls = 0;
  for (let round = 0; round < MAX_SCROLL_ROUNDS && stalls < STALL_LIMIT; round++) {
    const before = found.size;
    for (const u of await harvest(page)) found.add(u);
    const added = found.size - before;
    if (added === 0) stalls++; else stalls = 0;
    console.log(`    scroll ${round + 1}: ${found.size} matches (+${added})`);

    // Push virtualized lists to load more: scroll the window AND the last row into view.
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/in/"]');
      if (links.length) links[links.length - 1].scrollIntoView({ block: 'end' });
    }).catch(() => {});
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll');

    // Click "Show more results" if LinkedIn renders a button instead of pure infinite scroll.
    // Match the pagination control by its EXACT visible text ONLY. Do NOT add a broad
    // `button[aria-label*="more" i]` selector: every member ROW has a "More actions" (...)
    // button, so with `.first()` that selector grabs a member-row button instead of the
    // bottom pagination control, opening that member's action menu (Message/Remove). That
    // looked like the bot "clicking Message on members / opening a DM" (Mike, 2026-06-29).
    const moreBtn = page.locator(
      'button:has-text("Show more results"), button:has-text("Load more")'
    ).first();
    if (await moreBtn.count().catch(() => 0)) {
      try { if (await moreBtn.isVisible()) { await moreBtn.click({ timeout: 4000 }); await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'after show-more'); stalls = 0; } }
      catch { /* detached/not clickable — keep scrolling */ }
    }
  }
  return found;
}

// Register/refresh the group in groups.json and record which names we searched.
function recordGroup(searchedNow) {
  const groups = S.readJson(GROUPS, []);
  let g = groups.find(x => x.group_id === GROUP_ID);
  if (!g) {
    g = {
      group_id: GROUP_ID,
      name: '',
      url: `https://www.linkedin.com/groups/${GROUP_ID}/`,
      members_url: MEMBERS_URL,
      status: 'active',
      notes: 'Seeded by name search (large group, not fully enumerated).',
      searched_names: [],
    };
    groups.push(g);
  }
  g.searched_names = [...new Set([...(g.searched_names || []), ...searchedNow])];
  S.writeJson(GROUPS, groups);
  return g.searched_names;
}

(async () => {
  if (!NAMES.length) { console.error('No --names provided. e.g. --names="Albert,Andrew,Anthony,Ana"'); process.exit(1); }

  // Load queue + one-time backfill of group_id onto pre-existing entries.
  const queue = S.readJson(QUEUE, []);
  let backfilled = 0;
  for (const e of queue) { if (!e.group_id) { e.group_id = LEGACY_GROUP; backfilled++; } }
  if (backfilled) console.log(`Backfilled group_id="${LEGACY_GROUP}" onto ${backfilled} existing queue entries.`);
  const have = new Set(queue.map(e => S.canonicalProfileUrl(e.profile_url) || e.profile_url));
  console.log(`Queue starts at ${queue.length} members. Searching group ${GROUP_ID} for: ${NAMES.join(', ')}\n`);

  const { browser, page } = await S.launchSession();
  const perName = {};
  try {
    for (const name of NAMES) {
      console.log(`[search] "${name}"`);
      let matches;
      try {
        matches = await searchName(page, name);
      } catch (err) {
        if (String(err.message).includes('RESTRICTED')) {
          console.log('\n!!! LinkedIn restriction/unusual-activity page — STOPPING. !!!');
          break;
        }
        console.log(`   error on "${name}" (skipping): ${String(err.message).split('\n')[0]}`);
        continue;
      }

      let added = 0;
      for (const url of matches) {
        if (have.has(url)) continue;
        have.add(url);
        queue.push({ profile_url: url, processed: false, group_id: GROUP_ID });
        added++;
      }
      perName[name] = { matched: matches.size, added };
      S.writeJson(QUEUE, queue);            // persist after every name (partial-safe)
      console.log(`   "${name}": ${matches.size} matched, ${added} new -> queue now ${queue.length}\n`);

      await S.pause(page, 15000, 30000, 'between names');
    }
  } finally {
    await browser.close();
  }

  const searched = recordGroup(Object.keys(perName));
  console.log('\n============================================================');
  console.log(' SEED DONE.');
  for (const [n, r] of Object.entries(perName)) console.log(`   ${n}: ${r.matched} matched, ${r.added} new`);
  console.log(` Queue total now: ${queue.length} members.`);
  console.log(` Group ${GROUP_ID} names searched so far: ${searched.join(', ')}`);
  console.log('============================================================');
})();
