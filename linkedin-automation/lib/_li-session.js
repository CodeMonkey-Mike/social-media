// _li-session.js — shared LinkedIn browser session + navigation helpers.
//
// One source of truth for the bits both scrape-group-members.js (read each
// member's location) and request-connections.js (send connection requests) need:
//   - the persistent system-Chrome session on the dedicated li-bot-profile
//   - the login gate (manual sign-in on first run)
//   - "reach a profile like a human" navigation (search the name, click the result)
//   - small JSON + pacing helpers
//
// Keeping this in one module means a LinkedIn DOM change (e.g. the search box
// redesign of 2026-06-27) is fixed in ONE place for every script.

const path = require('path');
const fs = require('fs');

// Reuse the repo's existing Playwright install (this folder has no node_modules).
// __dirname is linkedin-automation/lib, so the repo root is two levels up.
const { chromium } = require(path.join(__dirname, '..', '..', 'schedule-tweets', 'node_modules', 'playwright'));

// Dedicated, persistent Chrome profile — same one the posting scripts use the
// pattern of. Log in manually once on first run; the session is reused after.
const CHROME_PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\li-bot-profile';

// Small-action pacing (ms): brief human pause between scrolls / clicks / typing.
const ACTION_MIN = 1500;
const ACTION_MAX = 3800;

// Per-keystroke delay (ms) for human-style typing — matches the posting scripts
// (schedule-tweets/scripts/post-ig-single.js typeHuman).
const CHAR_DELAY_MIN = 5;
const CHAR_DELAY_MAX = 40;

// ----------------------------------------------------------------------------
// Tiny helpers
// ----------------------------------------------------------------------------
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function pause(page, min, max, label = '') {
  const ms = randomBetween(min, max);
  if (label) console.log(`  ~ ${(ms / 1000).toFixed(1)}s (${label})`);
  await page.waitForTimeout(ms);
}

// Type into the currently-focused element character-by-character with a randomized
// per-keystroke delay (same pattern the posting scripts use). Focus the target
// field (e.g. click it) BEFORE calling this.
async function typeHuman(page, text) {
  for (const ch of text) {
    await page.keyboard.type(ch);
    await page.waitForTimeout(randomBetween(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
  }
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

// Pull the raw /in/ slug out of a profile URL ("mahesh-mittapally-b13531233").
function slugFromUrl(profileUrl) {
  const m = String(profileUrl).match(/\/in\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

// Derive a human-style search query from a profile slug — what a person would
// actually type, NOT the slug. LinkedIn slugs are "firstname-lastname" optionally
// followed by a disambiguating hash token ("mahesh-mittapally-b13531233"). Real
// name tokens don't contain digits, so we drop any trailing token that has one and
// turn the dashes into spaces -> "mahesh mittapally".
function nameQueryFromUrl(profileUrl) {
  const slug = slugFromUrl(profileUrl);
  if (!slug) return null;
  const tokens = slug.split('-').filter(Boolean);
  while (tokens.length > 1 && /\d/.test(tokens[tokens.length - 1])) tokens.pop();
  const q = tokens.join(' ').trim();
  return q || null;
}

// ----------------------------------------------------------------------------
// Browser session
// ----------------------------------------------------------------------------
async function launchSession() {
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
  return { browser, page };
}

// ----------------------------------------------------------------------------
// Login gate — wait for a human to sign in on the fresh profile
// ----------------------------------------------------------------------------
// LinkedIn redirects logged-out users to an auth wall. So the reliable signal is
// the URL, not a nav selector: if we're NOT on a login/authwall URL, we're logged
// in (a profile/members page only renders when authenticated).
const AUTHWALL_RE = /\/(login|uas\/login|checkpoint|authwall|signup)(\/|\?|$)/i;

async function ensureLoggedIn(page) {
  if (!AUTHWALL_RE.test(page.url())) {
    try { await page.waitForSelector('#global-nav, img.global-nav__me-photo', { timeout: 8000 }); } catch { /* nav slow to hydrate; URL check below still governs */ }
  }
  if (!AUTHWALL_RE.test(page.url())) return; // not bounced to auth wall -> logged in

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

// Detect LinkedIn's "temporarily restricted / unusual activity" page so a caller
// can STOP immediately instead of plowing on against a restricted account.
async function isRestricted(page) {
  const txt = await page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
  return /temporarily restricted|unusual activity|high volume of LinkedIn profile data|access to your account has been/i.test(txt);
}

// ----------------------------------------------------------------------------
// Reach a profile the way a human does — search, then click (not a bare URL load)
// ----------------------------------------------------------------------------
// LinkedIn redesigned the nav search (2026-06-27): the old
// `input.search-global-typeahead__input` is GONE and classes are now hashed. The
// live global search box is the one with placeholder "I'm looking for…" — typing a
// name + Enter navigates to /search/results/all/?keywords=... Old selectors are
// kept as fallbacks in case the layout shifts again (re-check with _probe-search.js).
const SEARCH_BOX = [
  'input[placeholder*="looking for" i]',
  'input.search-global-typeahead__input',
  'input[placeholder*="Search" i]',
  'input[aria-label*="Search" i]',
  '#global-nav-typeahead input',
].join(', ');

// Returns a short mode string: 'clicked' | 'goto-notfound' | 'goto-noquery' | 'goto-error'.
async function searchAndOpen(page, entry) {
  const url = entry.profile_url;
  const slug = slugFromUrl(url);
  const query = nameQueryFromUrl(url);
  if (!query || !slug) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return 'goto-noquery';
  }

  try {
    // Home base: make sure the global nav (and its search box) is present.
    if (!/linkedin\.com\/(feed|search|in|mynetwork)\b/.test(page.url())) {
      await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
      await ensureLoggedIn(page);
      await pause(page, ACTION_MIN, ACTION_MAX, 'land on feed');
    }

    // Type the name into the real search box and press Enter (genuine interaction).
    const box = page.locator(SEARCH_BOX).first();
    await box.click({ timeout: 8000 });
    await pause(page, 600, 1400, 'focus search');
    await box.fill('');
    await box.type(query, { delay: randomBetween(60, 160) });
    await pause(page, 500, 1200, 'typed query');
    await box.press('Enter');
    await page.waitForURL(/\/search\/results\//, { timeout: 12000 });

    // The human "look" at the results before clicking.
    await pause(page, 3000, 15000, 'scan search results');

    // Click the result whose href matches our target slug.
    const link = page.locator(`a[href*="/in/${slug}"]`).first();
    if (await link.count().catch(() => 0)) {
      await link.scrollIntoViewIfNeeded().catch(() => {});
      await pause(page, 400, 1100, 'before click');
      await link.click({ timeout: 8000 });
      await page.waitForURL(/\/in\//, { timeout: 12000 }).catch(() => {});
      if (/\/in\//.test(page.url())) return 'clicked';
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      return 'goto-error';
    }

    // Not on the first results page — fall back to a direct visit for this one.
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return 'goto-notfound';
  } catch (err) {
    await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
    return 'goto-error';
  }
}

module.exports = {
  CHROME_PROFILE, ACTION_MIN, ACTION_MAX, CHAR_DELAY_MIN, CHAR_DELAY_MAX,
  randomBetween, pause, typeHuman, readJson, writeJson,
  canonicalProfileUrl, slugFromUrl, nameQueryFromUrl,
  launchSession, ensureLoggedIn, isRestricted,
  AUTHWALL_RE, SEARCH_BOX, searchAndOpen,
};
