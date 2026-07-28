# li_session.py — shared LinkedIn browser session + helpers (Python port).
#
# Python foundation for the LinkedIn skills, ported from _li-session.js under the
# freeze-and-port policy (root CLAUDE.md / ORCHESTRATOR-PLAN.md §Phase 2 direction).
# It intentionally holds ONLY what the already-ported scripts need — port the other
# helpers together with the script that uses them, so every ported line gets
# exercised by its script's live verification.
#
# Ported so far:
#   - seed_by_name.py (blessed 2026-07-23): session launch, login gate,
#     restriction-page detection, JSON + pacing helpers
#   - scrape_group_members.py (2026-07-28): type_human, slug/name-query helpers,
#     nav SEARCH_BOX, search_and_open (search-then-click navigation)
#
# Keeping this in one module means a LinkedIn DOM change is fixed in ONE place for
# every Python script, same as _li-session.js does for the JS side.

import json
import random
import re
import time
from urllib.parse import unquote, urljoin, urlparse

from playwright.sync_api import sync_playwright

# Dedicated, persistent Chrome profile — the same one the JS scripts use. Log in
# manually once on first run; the session is reused after. Single-instance: never
# run two li-bot-profile scripts (JS or Python) at once.
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\li-bot-profile"

# Small-action pacing (ms): brief human pause between scrolls / clicks / typing.
ACTION_MIN = 1500
ACTION_MAX = 3800

# Per-keystroke delay (ms) for human-style typing — matches the posting scripts.
CHAR_DELAY_MIN = 5
CHAR_DELAY_MAX = 40


# ----------------------------------------------------------------------------
# Tiny helpers
# ----------------------------------------------------------------------------
def random_between(lo, hi):
    return random.randint(lo, hi)


def pause(page, lo, hi, label=""):
    ms = random_between(lo, hi)
    if label:
        print(f"  ~ {ms / 1000:.1f}s ({label})")
    page.wait_for_timeout(ms)


def read_json(file, fallback):
    try:
        with open(file, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return fallback


def write_json(file, data):
    # Match Node's JSON.stringify(data, null, 2) byte-for-byte: 2-space indent,
    # raw unicode (no \uXXXX escapes), LF line endings, no trailing newline —
    # so files stay diff-clean between the JS and Python scripts.
    with open(file, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False))


def type_human(page, text):
    """Type into the currently-focused element character-by-character with a
    randomized per-keystroke delay. Focus the target field BEFORE calling this."""
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(random_between(CHAR_DELAY_MIN, CHAR_DELAY_MAX))


def canonical_profile_url(href):
    """Normalize a profile URL to its canonical /in/<slug>/ form for stable dedup."""
    if not href:
        return None
    try:
        path = urlparse(urljoin("https://www.linkedin.com", href)).path
    except Exception:
        return None
    m = re.search(r"/in/([^/]+)", path)
    return f"https://www.linkedin.com/in/{m.group(1)}/" if m else None


def slug_from_url(profile_url):
    """Pull the raw /in/ slug out of a profile URL ("mahesh-mittapally-b13531233")."""
    m = re.search(r"/in/([^/?#]+)", str(profile_url))
    return unquote(m.group(1)) if m else None


def name_query_from_url(profile_url):
    """Derive a human-style search query from a profile slug — what a person would
    actually type, NOT the slug. LinkedIn slugs are "firstname-lastname" optionally
    followed by a disambiguating hash token ("mahesh-mittapally-b13531233"). Real
    name tokens don't contain digits, so we drop any trailing token that has one
    and turn the dashes into spaces -> "mahesh mittapally"."""
    slug = slug_from_url(profile_url)
    if not slug:
        return None
    tokens = [t for t in slug.split("-") if t]
    while len(tokens) > 1 and re.search(r"\d", tokens[-1]):
        tokens.pop()
    q = " ".join(tokens).strip()
    return q or None


# ----------------------------------------------------------------------------
# Browser session
# ----------------------------------------------------------------------------
def launch_session():
    """Returns (pw, browser, page). Caller must browser.close() then pw.stop()."""
    print("Launching Chrome (li-bot-profile)...")
    pw = sync_playwright().start()
    browser = pw.chromium.launch_persistent_context(
        CHROME_PROFILE,
        channel="chrome",
        headless=False,
        slow_mo=50,
        ignore_default_args=["--enable-automation"],
        args=["--disable-blink-features=AutomationControlled"],
        no_viewport=True,
    )
    browser.add_init_script(
        "Object.defineProperty(navigator, 'webdriver', { get: () => undefined })"
    )
    page = browser.pages[0] if browser.pages else browser.new_page()
    return pw, browser, page


# ----------------------------------------------------------------------------
# Login gate — wait for a human to sign in on the fresh profile
# ----------------------------------------------------------------------------
# LinkedIn redirects logged-out users to an auth wall. So the reliable signal is
# the URL, not a nav selector: if we're NOT on a login/authwall URL, we're logged
# in (a profile/members page only renders when authenticated).
AUTHWALL_RE = re.compile(r"/(login|uas/login|checkpoint|authwall|signup)(/|\?|$)", re.I)


def ensure_logged_in(page):
    if not AUTHWALL_RE.search(page.url):
        try:
            page.wait_for_selector("#global-nav, img.global-nav__me-photo", timeout=8000)
        except Exception:
            pass  # nav slow to hydrate; URL check below still governs
    if not AUTHWALL_RE.search(page.url):
        return  # not bounced to auth wall -> logged in

    print("\n============================================================")
    print(" NOT LOGGED IN. Sign in to LinkedIn in the Chrome window now.")
    print(" Waiting up to 5 minutes for you to finish...")
    print("============================================================\n")
    deadline = time.monotonic() + 5 * 60
    while time.monotonic() < deadline:
        if not AUTHWALL_RE.search(page.url):
            print("Detected login. Continuing.\n")
            return
        page.wait_for_timeout(3000)
    raise RuntimeError("Timed out waiting for manual login.")


def is_restricted(page):
    """Detect LinkedIn's "temporarily restricted / unusual activity" page so a
    caller can STOP immediately instead of plowing on against a restricted account."""
    try:
        txt = page.evaluate("() => (document.body && document.body.innerText) || ''")
    except Exception:
        txt = ""
    return bool(
        re.search(
            r"temporarily restricted|unusual activity|high volume of LinkedIn profile data|access to your account has been",
            txt,
            re.I,
        )
    )


# ----------------------------------------------------------------------------
# Reach a profile the way a human does — search, then click (not a bare URL load)
# ----------------------------------------------------------------------------
# HARD anti-detection rule: bare back-to-back goto(profileUrl) loads are a flagged
# signature. LinkedIn redesigned the nav search (2026-06-27): the old
# `input.search-global-typeahead__input` is GONE and classes are now hashed. The
# live global search box is the one with placeholder "I'm looking for..." — typing
# a name + Enter navigates to /search/results/all/?keywords=... Old selectors are
# kept as fallbacks in case the layout shifts again (re-check with _probe-search.js).
SEARCH_BOX = ", ".join(
    [
        'input[placeholder*="looking for" i]',
        "input.search-global-typeahead__input",
        'input[placeholder*="Search" i]',
        'input[aria-label*="Search" i]',
        "#global-nav-typeahead input",
    ]
)

# Finds the FIRST result link whose decoded slug EQUALS the target (case-folded).
_EXACT_HREF_JS = r"""(els, want) => {
  for (const a of els) {
    const h = a.getAttribute('href') || '';
    const m = h.match(/\/in\/([^/?#]+)/);
    if (!m) continue;
    let s = m[1];
    try { s = decodeURIComponent(s); } catch {}
    if (s.toLowerCase() === want) return h;
  }
  return null;
}"""


def search_and_open(page, entry):
    """Returns a short mode string: 'clicked' | 'goto-notfound' | 'goto-noquery'
    | 'goto-error'. Clicks ONLY a result whose URL slug EQUALS our target — never
    a substring match: `href*="/in/ben-olson"` also matches a DIFFERENT person at
    /in/ben-olson-02b90545, and that mismatch sent ~50 invites to strangers
    (Sent-invitations audit, 2026-07-22)."""
    url = entry["profile_url"]
    slug = slug_from_url(url)
    query = name_query_from_url(url)
    if not query or not slug:
        page.goto(url, wait_until="domcontentloaded")
        return "goto-noquery"

    try:
        # Home base: make sure the global nav (and its search box) is present.
        if not re.search(r"linkedin\.com/(feed|search|in|mynetwork)\b", page.url):
            page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded")
            ensure_logged_in(page)
            pause(page, ACTION_MIN, ACTION_MAX, "land on feed")

        # Type the name into the real search box and press Enter (genuine interaction).
        box = page.locator(SEARCH_BOX).first
        box.click(timeout=8000)
        pause(page, 600, 1400, "focus search")
        box.fill("")
        box.press_sequentially(query, delay=random_between(60, 160))
        pause(page, 500, 1200, "typed query")
        box.press("Enter")
        page.wait_for_url(re.compile(r"/search/results/"), timeout=12000)

        # The human "look" at the results before clicking.
        pause(page, 3000, 15000, "scan search results")

        want = slug.lower()
        try:
            exact_href = page.eval_on_selector_all('a[href*="/in/"]', _EXACT_HREF_JS, want)
        except Exception:
            exact_href = None
        if exact_href:
            link = page.locator(f'a[href="{exact_href}"]').first
            try:
                link.scroll_into_view_if_needed()
            except Exception:
                pass
            pause(page, 400, 1100, "before click")
            link.click(timeout=8000)
            try:
                page.wait_for_url(re.compile(r"/in/"), timeout=12000)
            except Exception:
                pass
            # Confirm we landed on the profile we meant to open.
            if (slug_from_url(page.url) or "").lower() == want:
                return "clicked"
            page.goto(url, wait_until="domcontentloaded")
            return "goto-error"

        # Not on the first results page — fall back to a direct visit for this one.
        page.goto(url, wait_until="domcontentloaded")
        return "goto-notfound"
    except Exception:
        try:
            page.goto(url, wait_until="domcontentloaded")
        except Exception:
            pass
        return "goto-error"
