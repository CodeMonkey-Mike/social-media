// scrape-group-members.js
// Browses a LinkedIn group's member list, visits each member's profile to read
// their location, and saves the ones in Europe / North America / South America /
// the Caribbean to members.json as { profile_url, location }.
//
// Mirrors the human-timing + persistent-Chrome-profile pattern used by the
// posting scripts (schedule-tweets/scripts/post-x-poll.js): system Chrome via
// channel:'chrome', randomized delays between every action, webdriver hidden.
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
// first thing to re-check against the live page.

const path = require('path');
const fs = require('fs');

// CLI flags (for supervised test runs):
//   --max=N         visit at most N profiles this run, then stop
//   --collect-only  stop after collecting member URLs (Step 1), don't visit profiles
const ARGV = process.argv.slice(2);
const MAX_PROFILES = (() => {
  const a = ARGV.find(x => x.startsWith('--max='));
  return a ? parseInt(a.split('=')[1], 10) : Infinity;
})();
const COLLECT_ONLY = ARGV.includes('--collect-only');

// Reuse the repo's existing Playwright install (this folder has no node_modules).
const { chromium } = require(path.join(__dirname, '..', 'schedule-tweets', 'node_modules', 'playwright'));

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
const GROUP_ID      = '9078205';
const MEMBERS_URL   = `https://www.linkedin.com/groups/${GROUP_ID}/members/`;
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\li-bot-profile';

// Work queue — every collected group member whose location we don't know yet:
//   { profile_url, processed }
// Collection seeds all members with processed:false; each run visits the next N
// unprocessed members and flips processed:true, so you can run it in batches here
// and there. Navigation errors stay processed:false so they're retried next run.
const QUEUE = path.join(__dirname, 'members-urls.json');

// Captured deliverable — only members located in a target zone (Europe / Americas /
// Caribbean). One record each: { profile_url, location }.
const OUT_MEMBERS = path.join(__dirname, 'members.json');

// Human-timing knobs (ms). Same spirit as post-x-poll.js.
const ACTION_MIN        = 1500;   // small pause between scrolls / clicks
const ACTION_MAX        = 3800;
const PROFILE_MIN       = 15000;  // pause between visiting one profile and the next
const PROFILE_MAX       = 30000;
const REST_EVERY        = 18;     // every N profiles, take a longer "human break"
const REST_MIN          = 30000;
const REST_MAX          = 90000;

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
// Small helpers
// ----------------------------------------------------------------------------
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function pause(page, min, max, label = '') {
  const ms = randomBetween(min, max);
  if (label) console.log(`  ~ ${(ms / 1000).toFixed(1)}s (${label})`);
  await page.waitForTimeout(ms);
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Normalize a profile URL to its canonical /in/<slug>/ form for stable dedup.
function canonicalProfileUrl(href) {
  try {
    const u = new URL(href, 'https://www.linkedin.com');
    const m = u.pathname.match(/\/in\/([^/]+)/);
    return m ? `https://www.linkedin.com/in/${m[1]}/` : null;
  } catch { return null; }
}

// ----------------------------------------------------------------------------
// Step 1 — collect every member's profile URL from the group member list
// ----------------------------------------------------------------------------
// Returns the work queue (loaded from members-urls.json, or freshly collected).
// Each element is { profile_url, processed:false }.
async function collectQueue(page) {
  const existing = readJson(QUEUE, null);
  if (existing && Array.isArray(existing) && existing.length) {
    // Migrate the legacy string-array format -> objects with a processed flag.
    if (typeof existing[0] === 'string') {
      // Preserve work already done: mark processed for anything captured in
      // members.json or recorded in a legacy visited.json.
      const doneUrls = new Set([
        ...readJson(OUT_MEMBERS, []).map(m => m.profile_url),
        ...readJson(path.join(__dirname, 'visited.json'), []),
      ]);
      const migrated = existing.map(url => ({ profile_url: url, processed: doneUrls.has(url) }));
      writeJson(QUEUE, migrated);
      const carried = migrated.filter(m => m.processed).length;
      console.log(`Migrated members-urls.json: ${migrated.length} URLs -> objects (carried over ${carried} already-processed).`);
      return migrated;
    }
    console.log(`Using existing queue: ${existing.length} members (delete members-urls.json to re-collect).`);
    return existing;
  }

  console.log(`\nOpening group members page:\n  ${MEMBERS_URL}`);
  await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
  await ensureLoggedIn(page);
  await page.goto(MEMBERS_URL, { waitUntil: 'domcontentloaded' });
  await pause(page, 3000, 5000, 'let member list render');

  const found = new Map(); // canonicalUrl -> true
  let stalls = 0;

  for (let round = 0; round < MAX_SCROLL_ROUNDS && stalls < SCROLL_STALL_LIMIT; round++) {
    // Harvest any /in/ links currently in the DOM.
    const hrefs = await page.$$eval('a[href*="/in/"]', els => els.map(a => a.getAttribute('href')));
    let added = 0;
    for (const h of hrefs) {
      const c = canonicalProfileUrl(h);
      if (c && !found.has(c)) { found.set(c, true); added++; }
    }

    if (added === 0) stalls++; else stalls = 0;
    console.log(`  scroll round ${round + 1}: ${found.size} members (+${added})`);

    // Scroll down to trigger lazy-loading.
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await pause(page, ACTION_MIN, ACTION_MAX, 'scroll');

    // Click a "Show more results" button if LinkedIn renders one instead of pure infinite scroll.
    const moreBtn = page.locator(
      'button:has-text("Show more results"), button:has-text("Load more"), button[aria-label*="more"]'
    ).first();
    if (await moreBtn.count().catch(() => 0)) {
      try {
        if (await moreBtn.isVisible()) {
          await moreBtn.click({ timeout: 4000 });
          await pause(page, ACTION_MIN, ACTION_MAX, 'after show-more');
          stalls = 0;
        }
      } catch { /* button detached / not clickable — keep scrolling */ }
    }
  }

  const queue = [...found.keys()].map(url => ({ profile_url: url, processed: false }));
  writeJson(QUEUE, queue);
  console.log(`\nCollected ${queue.length} members -> ${path.basename(QUEUE)} (all processed:false)`);
  return queue;
}

// ----------------------------------------------------------------------------
// Login gate — wait for a human to sign in on the fresh profile
// ----------------------------------------------------------------------------
// LinkedIn redirects logged-out users to an auth wall. So the reliable signal is
// the URL, not a nav selector: if we're NOT on a login/authwall URL, we're logged
// in (a profile/members page only renders when authenticated). We only block for a
// manual login when LinkedIn has actually bounced us to the auth wall.
const AUTHWALL_RE = /\/(login|uas\/login|checkpoint|authwall|signup)(\/|\?|$)/i;

async function ensureLoggedIn(page) {
  // Give the SPA a moment to perform any auth redirect after domcontentloaded.
  if (!AUTHWALL_RE.test(page.url())) {
    try { await page.waitForSelector('#global-nav, img.global-nav__me-photo', { timeout: 8000 }); } catch { /* nav slow to hydrate; URL check below still governs */ }
  }
  if (!AUTHWALL_RE.test(page.url())) return; // not bounced to auth wall → logged in

  console.log('\n============================================================');
  console.log(' NOT LOGGED IN. Sign in to LinkedIn in the Chrome window now.');
  console.log(' Waiting up to 5 minutes for you to finish...');
  console.log('============================================================\n');
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    if (!AUTHWALL_RE.test(page.url())) { console.log('Detected login. Continuing.\n'); return; }
    await page.waitForTimeout(3000);
  }
  throw new Error('Timed out waiting for manual login.');
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
  console.log('Launching Chrome (li-bot-profile)...');
  const browser = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: 'chrome',
    headless: false,
    slowMo: 50,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: null,
  });
  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = browser.pages().length > 0 ? browser.pages()[0] : await browser.newPage();

  // Captured deliverable so far (matched members). Resume-friendly.
  const members = readJson(OUT_MEMBERS, []);
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
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await ensureLoggedIn(page);
        await pause(page, ACTION_MIN, ACTION_MAX, 'read profile');

        const location = await readLocation(page);
        const zone = classify(location);

        if (zone && !captured.has(url)) {
          members.push({ profile_url: url, location, group_id: GROUP_ID });
          captured.add(url);
          writeJson(OUT_MEMBERS, members);
          console.log(`   CAPTURE [${zone}] ${location}`);
        } else if (zone) {
          console.log(`   already captured [${zone}] ${location}`);
        } else {
          console.log(`   skip  (not a target zone) "${location || 'no location found'}"`);
        }

        // Visited successfully -> mark processed so we never re-check it.
        entry.processed = true;
        writeJson(QUEUE, queue);
      } catch (err) {
        // Leave processed:false so a genuine load error is retried on the next run.
        console.log(`   error (will retry next run): ${String(err.message).split('\n')[0]}`);
      }

      if (i % REST_EVERY === 0 && i < todo.length) {
        await pause(page, REST_MIN, REST_MAX, 'longer human break');
      } else {
        await pause(page, PROFILE_MIN, PROFILE_MAX, 'between profiles');
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
