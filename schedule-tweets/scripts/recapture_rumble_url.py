# recapture_rumble_url.py — CANONICAL Python port of recapture-rumble-url.js
# (2026-08-11, posting-tail migration; the JS twin is FROZEN rollback). Status:
# PORTED, BLESS-PENDING — invoke the JS twin for production posts until this
# port is live-blessed with one real post.
#
# Fix the Rumble URL for a short by matching its title on /account/content
# (where shorts live as /shorts/v<id>). Use for a short left `posted_unverified`
# by post_rumble_short.py, or one with a stale URL. READ-ONLY on Rumble; only
# writes the URL/status back to shorts.json. Does NOT re-upload.
#
# Usage: python scripts/recapture_rumble_url.py <short-id>
#
# KNOWN CRITICAL QUIRK preserved exactly: the closest-ancestor title-match
# search against every a[href*="/shorts/v"] on /account/content (climbs from
# each candidate link UP to 5 ancestor levels looking for the wanted title in
# that ancestor's own text, keeping the tightest-level match) — the same
# matching logic post_rumble_short.py uses. Climbing the other way (title node
# down to an anchor) can cross into a neighbor row and grab the wrong video's
# URL, which is the exact bug this shape avoids (2026-06-02, wells-fargo short
# mis-captured kaspa's URL). A found URL is only recorded `posted` once its
# public page's <title>/og:title is confirmed to contain the short's title
# within a 5-attempt, 20s-interval retry window; otherwise it is recorded
# `posted_unverified` rather than guessing.
#
# ANOTHER PRESERVED QUIRK: unlike the other 4 posting-tail scripts, the JS twin
# has NO catch-all error handler here — only try/finally (finally just closes
# the browser). Any unexpected mid-script failure (a goto timeout, a JSON
# decode error, etc.) is left to crash the process uncaught rather than being
# caught and written back as a 'failed' status. This port preserves that
# asymmetry deliberately: only the JS's own explicit, named failure points
# (usage error, short-id not found, short not found on /account/content after
# 6 attempts) exit cleanly with a message; anything else propagates as an
# unhandled Python exception (traceback to stderr, exit code 1), matching
# Node's default unhandled-rejection behavior for the same case.
#
# 1:1 port on playwright.sync_api: same rumblebot-profile Chrome (slow_mo=30 —
# NOT 50; this script also does NOT add the navigator.webdriver init script
# that post_rumble_short.py adds, matching the JS twin exactly), same
# closest-ancestor title-match selector logic, same liveness re-check, same
# re-read-immediately-before-write on shorts.json, same exit codes (1 for
# usage/short-not-found, 2 for not-found-on-account-content, implicit 0 on
# success regardless of live/unverified).
# Documented divergences ONLY: (a) final machine line (POST OK/FAIL) for the
# LangGraph wrapper to parse, emitted only at the JS's own explicit exit
# points (never inside a fabricated catch-all); (b) this header/status block.
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
SHORTS_JSON = HERE.parent / "data" / "shorts.json"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\rumblebot-profile"
PLATFORM = "rumble"

short_id = sys.argv[1] if len(sys.argv) > 1 else None
if not short_id:
    print("Usage: python scripts/recapture_rumble_url.py <short-id>", file=sys.stderr)
    print("POST FAIL platform=rumble reason=usage-missing-short-id", flush=True)
    sys.exit(1)


def norm(s):
    s = (s or "").lower()
    s = re.sub(r"&#0?39;|&apos;", "'", s)
    s = re.sub(r"&amp;", "&", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def json_dumps(data):
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def main():
    data = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))
    shorts_list = data.get("shorts") or data
    short = next((s for s in shorts_list if s.get("id") == short_id), None)
    if not short:
        print(f"Short not found: {short_id}", file=sys.stderr)
        print("POST FAIL platform=rumble reason=short-id-not-found", flush=True)
        sys.exit(1)
    title = (short.get("title") or "")[:100]
    needle = norm(title)[:40]
    print(f'Recapturing Rumble URL for "{title}"')

    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            CHROME_PROFILE, channel="chrome", headless=False, slow_mo=30,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        page = browser.pages[0] if browser.pages else browser.new_page()
        try:
            short_url = None
            for attempt in range(1, 7):
                page.goto("https://rumble.com/account/content", wait_until="domcontentloaded", timeout=30000)
                page.wait_for_timeout(4000)
                href = page.evaluate(
                    "(want) => { const n = s => (s || '').toLowerCase().replace(/\\s+/g, ' ').trim();"
                    " let best = null, bestLevel = 99;"
                    " for (const a of document.querySelectorAll('a[href*=\"/shorts/v\"]')) {"
                    " let c = a;"
                    " for (let lvl = 0; lvl < 5 && c; lvl++) {"
                    " if (n(c.innerText).includes(want)) { if (lvl < bestLevel) "
                    "{ bestLevel = lvl; best = a; } break; } c = c.parentElement; } }"
                    " return best ? best.getAttribute('href') : null; }", needle)
                if href:
                    short_url = (href if href.startswith("http") else "https://rumble.com" + href).split("?")[0]
                    print(f"  Matched: {short_url}")
                    break
                print(f"  {attempt}/6: not found yet — waiting...")
                if attempt < 6:
                    page.wait_for_timeout(20000)
            if not short_url:
                print("Could not find the short on /account/content. Leaving shorts.json unchanged.",
                      file=sys.stderr)
                print("POST FAIL platform=rumble reason=not-found-on-account-content", flush=True)
                sys.exit(2)

            # Liveness: confirm the public page title matches.
            want = norm(title)[:25]
            ua = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120 Safari/537.36")
            live = False
            for i in range(1, 6):
                try:
                    resp = browser.request.get(short_url, timeout=20000, headers={"User-Agent": ua})
                    html = resp.text()
                    m = re.search(r"<title>([^<]*)</title>", html, re.I) \
                        or re.search(r'og:title"\s+content="([^"]*)"', html, re.I)
                    got = norm(m.group(1) if m else "")
                    if got and want and want in got:
                        print(f'  Liveness \u2713 (title="{m.group(1)}")')
                        live = True
                        break
                    print(f'  Liveness {i}/5: not live yet (title="{m.group(1) if m else "none"}")')
                except Exception as e:
                    print(f"  Liveness {i}/5 error: {str(e).splitlines()[0]}")
                if i < 5:
                    page.wait_for_timeout(20000)

            data2 = json.loads(SHORTS_JSON.read_text(encoding="utf-8"))
            shorts_list2 = data2.get("shorts") or data2
            short2 = next((s for s in shorts_list2 if s.get("id") == short_id), None)
            short2["platforms"][PLATFORM]["url"] = short_url
            short2["platforms"][PLATFORM]["status"] = "posted" if live else "posted_unverified"
            if live:
                short2["platforms"][PLATFORM].pop("error", None)
            else:
                short2["platforms"][PLATFORM]["error"] = (
                    "URL captured from /account/content but public page not confirmed live "
                    "in window: re-check the URL manually.")
            SHORTS_JSON.write_text(json_dumps(data2), encoding="utf-8")
            status = short2["platforms"][PLATFORM]["status"]
            print(f"Updated shorts.json: {short_id} -> {short_url} ({status})")
            print(f"POST OK platform=rumble url={short_url} status={status}", flush=True)
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
