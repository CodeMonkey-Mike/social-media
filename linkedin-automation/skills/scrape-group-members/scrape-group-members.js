// scrape-group-members.js
// Browses a LinkedIn group's member list, visits each member's profile to read
// their location, and saves the ones in Europe / North America / South America /
// the Caribbean to members.json as { profile_url, location }.
//
// The browser session, login gate, and "reach a profile like a human" navigation
// all live in _li-session.js (shared with request-connections.js). This file is
// just the group-specific logic: collect the member list, read + classify each
// profile's location, capture the matches.
//
// FIRST RUN: a fresh Chrome profile (li-bot-profile) opens with no LinkedIn
// session. Log in manually in that window; the script waits for you, then
// continues. The session is reused on later runs (no re-login).
//
// TWO FILES:
//   members-urls.json  the work QUEUE — every collected member as
//                      { profile_url, processed }. processed flips true once we've
//                      visited that profile, so you can run in batches here and there.
//   members.json       the CAPTURED deliverable — only members located in a target
//                      zone, as { profile_url, location }.
//
// BATCHES: pass --max=N to process only the next N unprocessed members this run,
// then stop. Run again (no state to manage) to continue where you left off.
// Load errors stay processed:false so they're retried next run.
//
// Run:  node linkedin-automation/scrape-group-members.js [--max=N] [--collect-only]
//
// NOTE: LinkedIn's DOM changes often. The member-list and profile-location
// selectors below are the fragile parts — if a run collects 0 members or every
// location comes back empty, the selectors (COLLECT step / readLocation) are the
// first thing to re-check against the live page. (Search-box churn lives in
// _li-session.js.)

const path = require('path');
const S = require('../../lib/_li-session');

// Data lives in linkedin-automation/data (two levels up from this skill folder).
const DATA = path.join(__dirname, '..', '..', 'data');

// CLI flags (for supervised test runs):
//   --max=N         visit at most N profiles this run, then stop
//   --collect-only  stop after collecting member URLs (Step 1), don't visit profiles
const ARGV = process.argv.slice(2);
const MAX_PROFILES = (() => {
  const a = ARGV.find(x => x.startsWith('--max='));
  return a ? parseInt(a.split('=')[1], 10) : Infinity;
})();
const COLLECT_ONLY = ARGV.includes('--collect-only');

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
const GROUP_ID      = '9078205';
const MEMBERS_URL   = `https://www.linkedin.com/groups/${GROUP_ID}/members/`;

// Work queue — every collected group member whose location we don't know yet:
//   { profile_url, processed }
// Collection seeds all members with processed:false; each run visits the next N
// unprocessed members and flips processed:true, so you can run it in batches here
// and there. Navigation errors stay processed:false so they're retried next run.
const QUEUE = path.join(DATA, 'members-urls.json');

// Captured deliverable — only members located in a target zone (Europe / Americas /
// Caribbean). One record each: { profile_url, location }.
const OUT_MEMBERS = path.join(DATA, 'members.json');

// Profile-cycle pacing knobs (ms). Small-action pacing (ACTION_MIN/MAX) is shared
// from _li-session.js; these between-profile knobs are scraper-specific.
const PROFILE_MIN       = 60000;  // pause between one profile cycle and the next search (1 min)
const PROFILE_MAX       = 300000; // ...up to 5 min — random, deliberately slow (Mike, 2026-06-30: "it could take all day, that's okay")
const REST_EVERY        = 18;     // every N profiles, take a longer "human break"
const REST_MIN          = 300000; // distinctly longer than the new 1-5 min between-profile gap (5 min)
const REST_MAX          = 480000; // ...up to 8 min

const MAX_SCROLL_ROUNDS   = 400;  // hard ceiling so a stuck scroll can't loop forever
const SCROLL_STALL_LIMIT  = 6;    // stop scrolling after this many rounds with no new members

// ----------------------------------------------------------------------------
// Location classification
// ----------------------------------------------------------------------------
// LinkedIn location strings are free text but almost always end with the
// country (e.g. "Greater London, England, United Kingdom", "Austin, Texas,
// United States", "Sao Paulo, Brazil"). We match country names + regions +
// big metros for the four target zones. A whole-word/phrase match in ANY zone
// means we capture the member into members.json; anything we can't place is just
// marked processed and left out of the deliverable.

const ZONES = {
  europe: [
    'europe', 'european union',
    'albania', 'andorra', 'austria', 'belarus', 'belgium', 'bosnia', 'herzegovina',
    'bulgaria', 'croatia', 'cyprus', 'czech', 'czechia', 'denmark', 'estonia',
    'finland', 'france', 'germany', 'greece', 'hungary', 'iceland', 'ireland',
    'italy', 'kosovo', 'latvia', 'liechtenstein', 'lithuania', 'luxembourg',
    'malta', 'moldova', 'monaco', 'montenegro', 'netherlands', 'north macedonia',
    'macedonia', 'norway', 'poland', 'portugal', 'romania', 'russia', 'san marino',
    'serbia', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'ukraine',
    'united kingdom', 'great britain', 'england', 'scotland', 'wales',
    'northern ireland', 'vatican',
    // common regions / metros that may appear without a country
    'london', 'greater london', 'manchester', 'birmingham', 'edinburgh', 'glasgow',
    'dublin', 'paris', 'madrid', 'barcelona', 'catalonia', 'lisbon', 'porto',
    'berlin', 'munich', 'bavaria', 'hamburg', 'frankfurt', 'cologne', 'amsterdam',
    'rotterdam', 'brussels', 'zurich', 'geneva', 'vienna', 'rome', 'milan',
    'naples', 'turin', 'stockholm', 'oslo', 'copenhagen', 'helsinki', 'warsaw',
    'krakow', 'prague', 'budapest', 'athens', 'bucharest', 'moscow',
    'saint petersburg', 'st petersburg', 'kyiv', 'kiev',
  ],
  north_america: [
    'united states', 'u.s.a', 'usa', 'u.s.', 'america', 'canada', 'mexico',
    'guatemala', 'belize', 'honduras', 'el salvador', 'nicaragua', 'costa rica',
    'panama',
    // US states + DC
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois',
    'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
    'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana',
    'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york',
    'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
    'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah',
    'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
    'district of columbia', 'washington, d.c', 'washington dc',
    // Canadian provinces
    'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 'saskatchewan',
    'nova scotia', 'new brunswick', 'newfoundland', 'prince edward island',
    // big metros that may appear bare
    'new york city', 'san francisco', 'bay area', 'silicon valley', 'los angeles',
    'chicago', 'boston', 'seattle', 'austin', 'denver', 'atlanta', 'miami',
    'dallas', 'houston', 'phoenix', 'philadelphia', 'toronto', 'vancouver',
    'montreal', 'calgary', 'ottawa', 'mexico city', 'guadalajara', 'monterrey',
  ],
  south_america: [
    'south america', 'latin america', 'brazil', 'brasil', 'argentina', 'chile',
    'colombia', 'peru', 'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay',
    'guyana', 'suriname', 'french guiana',
    'sao paulo', 'rio de janeiro', 'brasilia', 'buenos aires', 'santiago',
    'bogota', 'medellin', 'lima', 'caracas', 'quito', 'montevideo', 'la paz',
  ],
  caribbean: [
    'caribbean', 'cuba', 'jamaica', 'haiti', 'dominican republic', 'puerto rico',
    'trinidad', 'tobago', 'bahamas', 'barbados', 'aruba', 'curacao', 'cayman',
    'bermuda', 'antigua', 'barbuda', 'grenada', 'saint lucia', 'st lucia',
    'saint kitts', 'dominica', 'saint vincent', 'turks and caicos',
    'havana', 'kingston', 'santo domingo', 'san juan', 'nassau',
  ],
};

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function phraseMatcher(words) {
  const alt = words.map(escapeRe).sort((a, b) => b.length - a.length).join('|');
  // Anchor on non-letter edges so "wales" matches "..., Wales" but the keyword
  // still has to be a whole word/phrase, not an arbitrary substring.
  return new RegExp(`(?:^|[^a-z])(?:${alt})(?:$|[^a-z])`, 'i');
}

// Build one matcher per zone.
const ZONE_MATCHERS = Object.entries(ZONES).map(([zone, words]) => ({ zone, re: phraseMatcher(words) }));

// Non-target places that contain a target keyword as a substring and would
// otherwise false-match (e.g. "New South Wales" contains "wales"; Melbourne is in
// "Victoria, Australia"). Checked first, so these are always rejected.
const EXCLUDE = [
  'australia', 'new south wales', 'south australia', 'western australia',
  'queensland', 'tasmania', 'new zealand',
];
const EXCLUDE_RE = phraseMatcher(EXCLUDE);

// Returns the matching zone name, or null if we can't place the string.
//
// LinkedIn location strings are a comma hierarchy ending in the country, e.g.
// "Sydney, New South Wales, Australia" or "Austin, Texas, United States". So we
// classify on the COUNTRY (the last comma segment) — that's what disambiguates
// "New South Wales, Australia" (reject) from "Cardiff, Wales" (Europe). Only when
// there is no comma at all (a bare metro like "San Francisco Bay Area") do we scan
// the whole string for a region/metro keyword.
function classify(location) {
  if (!location) return null;
  const lower = location.toLowerCase();
  if (EXCLUDE_RE.test(` ${lower} `)) return null;

  const parts = lower.split(',').map(s => s.trim()).filter(Boolean);
  const tail = parts.length ? parts[parts.length - 1] : lower;
  for (const { zone, re } of ZONE_MATCHERS) {
    if (re.test(` ${tail} `)) return zone;
  }
  // No country/region match. Fall back to a whole-string scan ONLY when there is
  // no comma (so we don't resurrect substring collisions on multi-part strings).
  if (parts.length <= 1) {
    for (const { zone, re } of ZONE_MATCHERS) {
      if (re.test(` ${lower} `)) return zone;
    }
  }
  return null;
}

// ----------------------------------------------------------------------------
// Step 1 — collect every member's profile URL from the group member list
// ----------------------------------------------------------------------------
// Returns the work queue (loaded from members-urls.json, or freshly collected).
// Each element is { profile_url, processed:false }.
async function collectQueue(page) {
  const existing = S.readJson(QUEUE, null);
  if (existing && Array.isArray(existing) && existing.length) {
    // Migrate the legacy string-array format -> objects with a processed flag.
    if (typeof existing[0] === 'string') {
      // Preserve work already done: mark processed for anything captured in
      // members.json or recorded in a legacy visited.json.
      const doneUrls = new Set([
        ...S.readJson(OUT_MEMBERS, []).map(m => m.profile_url),
        ...S.readJson(path.join(DATA, 'visited.json'), []),
      ]);
      const migrated = existing.map(url => ({ profile_url: url, processed: doneUrls.has(url) }));
      S.writeJson(QUEUE, migrated);
      const carried = migrated.filter(m => m.processed).length;
      console.log(`Migrated members-urls.json: ${migrated.length} URLs -> objects (carried over ${carried} already-processed).`);
      return migrated;
    }
    console.log(`Using existing queue: ${existing.length} members (delete members-urls.json to re-collect).`);
    return existing;
  }

  console.log(`\nOpening group members page:\n  ${MEMBERS_URL}`);
  await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
  await S.ensureLoggedIn(page);
  await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
  await S.pause(page, 3000, 5000, 'let member list render');

  const found = new Map(); // canonicalUrl -> true
  let stalls = 0;

  for (let round = 0; round < MAX_SCROLL_ROUNDS && stalls < SCROLL_STALL_LIMIT; round++) {
    // Harvest any /in/ links currently in the DOM.
    const hrefs = await page.$$eval('a[href*="/in/"]', els => els.map(a => a.getAttribute('href')));
    let added = 0;
    for (const h of hrefs) {
      const c = S.canonicalProfileUrl(h);
      if (c && !found.has(c)) { found.set(c, true); added++; }
    }

    if (added === 0) stalls++; else stalls = 0;
    console.log(`  scroll round ${round + 1}: ${found.size} members (+${added})`);

    // Scroll down to trigger lazy-loading.
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'scroll');

    // Click a "Show more results" button if LinkedIn renders one instead of pure infinite scroll.
    const moreBtn = page.locator(
      'button:has-text("Show more results"), button:has-text("Load more"), button[aria-label*="more"]'
    ).first();
    if (await moreBtn.count().catch(() => 0)) {
      try {
        if (await moreBtn.isVisible()) {
          await moreBtn.click({ timeout: 4000 });
          await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'after show-more');
          stalls = 0;
        }
      } catch { /* button detached / not clickable — keep scrolling */ }
    }
  }

  const queue = [...found.keys()].map(url => ({ profile_url: url, processed: false }));
  S.writeJson(QUEUE, queue);
  console.log(`\nCollected ${queue.length} members -> ${path.basename(QUEUE)} (all processed:false)`);
  return queue;
}

// ----------------------------------------------------------------------------
// Step 2 — read a member's location from their profile
// ----------------------------------------------------------------------------
async function readLocation(page) {
  // LinkedIn now ships hashed, build-generated CSS class names (e.g. "_8d59a5a1")
  // and no <h1>, so class/tag selectors are useless and break on every deploy.
  // The <main> element's text, however, is stable and well-ordered:
  //
  //   <Name>
  //   <Headline>
  //   <Location>            <-- what we want
  //   ·
  //   Contact info          <-- (or "<N> followers" / "<N> connections")
  //   ...
  //
  // So we read main's innerText and take the line just above the
  // "Contact info" / followers / connections anchor. No class names involved.

  // Wait until the top card has actually rendered (text present), not just DOM-ready.
  await page.waitForFunction(() => {
    const m = document.querySelector('main');
    return m && m.innerText && m.innerText.trim().length > 80;
  }, { timeout: 15000 }).catch(() => {});

  const main = await page.$eval('main', el => el.innerText).catch(() => '');
  if (!main) return '';

  const lines = main.split('\n').map(s => s.trim()).filter(Boolean);
  if (lines.length < 2) return '';

  const name = lines[0];
  const headline = lines[1];
  const isAnchor = l => /^contact info$/i.test(l) || /\bfollowers?$/i.test(l) || /\bconnections?$/i.test(l);
  const isJunk   = l => l === '·' || isAnchor(l) || /^message$/i.test(l) || /^(follow|connect|more)$/i.test(l);

  let loc = '';
  const anchorIdx = lines.findIndex(isAnchor);
  if (anchorIdx > 1) {
    for (let j = anchorIdx - 1; j >= 1; j--) {
      if (isJunk(lines[j])) continue;
      loc = lines[j];
      break;
    }
  }
  // Fallback: 3rd line (name, headline, location) when there's no anchor.
  if (!loc && lines.length >= 3 && !isJunk(lines[2])) loc = lines[2];

  // Guard: never mistake the name/headline (no location shown) for a location.
  if (!loc || loc === name || loc === headline) return '';
  return loc.replace(/\s*·\s*$/, '').trim();
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
(async () => {
  const { browser, page } = await S.launchSession();

  // Captured deliverable so far (matched members). Resume-friendly.
  const members = S.readJson(OUT_MEMBERS, []);
  const captured = new Set(members.map(m => m.profile_url));

  try {
    const queue = await collectQueue(page);
    const done = queue.filter(m => m.processed).length;
    console.log(`Queue: ${queue.length} members, ${done} processed, ${queue.length - done} remaining. ${members.length} captured so far.`);
    if (COLLECT_ONLY) {
      console.log(`\n--collect-only: stopping after collection. ${queue.length} members seeded.`);
      return;
    }

    let todo = queue.filter(m => !m.processed);
    if (MAX_PROFILES !== Infinity) {
      console.log(`\n--max=${MAX_PROFILES}: limiting this run to ${MAX_PROFILES} profile(s).`);
      todo = todo.slice(0, MAX_PROFILES);
    }
    console.log(`\n${todo.length} profiles to visit this run (of ${queue.length - done} remaining).\n`);

    let i = 0;
    for (const entry of todo) {
      i++;
      const url = entry.profile_url;
      console.log(`[${i}/${todo.length}] ${url}`);
      try {
        const nav = await S.searchAndOpen(page, entry);
        await S.ensureLoggedIn(page);
        console.log(`   reached via ${nav}`);
        // Guard: only proceed if we actually landed on a profile page. Otherwise
        // throw so this member stays processed:false and is retried next run
        // (never mark it done off the wrong page).
        if (!/\/in\//.test(page.url())) throw new Error(`not on a profile page (${page.url()})`);
        await S.pause(page, S.ACTION_MIN, S.ACTION_MAX, 'read profile');

        const location = await readLocation(page);
        const zone = classify(location);

        if (zone && !captured.has(url)) {
          // Tag the capture with the QUEUE ENTRY's own group_id (seed-by-name writes
          // it per member), not the hardcoded collect-phase GROUP_ID — the queue now
          // crosses from 9078205 into 6665791, so the constant would mis-tag captures.
          members.push({ profile_url: url, location, group_id: entry.group_id || GROUP_ID });
          captured.add(url);
          S.writeJson(OUT_MEMBERS, members);
          console.log(`   CAPTURE [${zone}] ${location}`);
        } else if (zone) {
          console.log(`   already captured [${zone}] ${location}`);
        } else {
          console.log(`   skip  (not a target zone) "${location || 'no location found'}"`);
        }

        // Visited successfully -> mark processed so we never re-check it.
        entry.processed = true;
        S.writeJson(QUEUE, queue);
      } catch (err) {
        // Leave processed:false so a genuine load error is retried on the next run.
        console.log(`   error (will retry next run): ${String(err.message).split('\n')[0]}`);
      }

      if (i % REST_EVERY === 0 && i < todo.length) {
        await S.pause(page, REST_MIN, REST_MAX, 'longer human break');
      } else {
        await S.pause(page, PROFILE_MIN, PROFILE_MAX, 'between profiles');
      }
    }

    const remaining = queue.filter(m => !m.processed).length;
    console.log('\n============================================================');
    console.log(` DONE this run. ${members.length} members captured -> ${path.basename(OUT_MEMBERS)}`);
    console.log(` ${remaining} of ${queue.length} still to process (run again to continue).`);
    console.log('============================================================');
  } catch (err) {
    console.error('\nFATAL:', err.message);
  } finally {
    await browser.close();
  }
})();
