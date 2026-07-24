# li_session.py — shared LinkedIn browser session + helpers (Python port).
#
# Python foundation for the LinkedIn skills, ported from _li-session.js under the
# freeze-and-port policy (root CLAUDE.md / ORCHESTRATOR-PLAN.md §Phase 2 direction).
# It intentionally holds ONLY what the already-ported scripts need — port the other
# helpers (typeHuman, slug/name-query, searchAndOpen) together with the script that
# uses them, so every ported line gets exercised by its script's live verification.
#
# Ported so far (used by seed_by_name.py):
#   - the persistent system-Chrome session on the dedicated li-bot-profile
#   - the login gate (manual sign-in on first run)
#   - restriction-page detection
#   - JSON + pacing helpers
#
# Keeping this in one module means a LinkedIn DOM change is fixed in ONE place for
# every Python script, same as _li-session.js does for the JS side.

import json
import random
import re
import time
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright

# Dedicated, persistent Chrome profile — the same one the JS scripts use. Log in
# manually once on first run; the session is reused after. Single-instance: never
# run two li-bot-profile scripts (JS or Python) at once.
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\li-bot-profile"

# Small-action pacing (ms): brief human pause between scrolls / clicks / typing.
ACTION_MIN = 1500
ACTION_MAX = 3800


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
