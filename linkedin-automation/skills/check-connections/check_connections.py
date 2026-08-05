# check_connections.py — open the My Network connections page, find which of our
# contacted members have ACCEPTED the connection, and record the date as
# `connected_on` in members.json.
#
# Python port of check-connections.js (freeze-and-port, 2026-07-30); logic,
# selectors, card isolation, date parsing, scroll/stall caps, and OUTPUT FORMAT
# are 1:1 with the JS original, which stays alongside as rollback until this port
# is blessed on a live run. The output lines must stay byte-identical: the Lane 4
# graph wrapper (graph/lane_graph.py) parses them (scroll round / CONNECTED / DONE).
#
# TWO DELIBERATE DIVERGENCES from the JS (both fix live defects; documented so a
# rollback to the JS is an informed choice, not a surprise):
#
#   1. SLUG MATCHING IS DECODED + CASEFOLDED. The JS keys `outstanding` with
#      slugFromUrl() (which decodeURIComponent's) but harvests card slugs RAW off
#      the href, so a percent-encoded profile can NEVER match: outstanding holds
#      "alberto-ruiz-perez..." (decoded) while the card yields
#      "alberto-ruiz-p%C3%A9rez...". members.json has 16 such members (8 already
#      contacted); ZERO of them have ever been matched, vs ~27% of ASCII-slug
#      members — i.e. their acceptances are silently missed forever. This port
#      decodes BOTH sides (and lowercases, matching the identity-guard precedent
#      in request_connections.py) before comparing.
#   2. RELATIVE MONTH/YEAR MATH CLAMPS instead of overflowing. JS's setMonth /
#      setFullYear roll forward off a short month ("3 months ago" on May 31 ->
#      Mar 3; "1 year ago" on Feb 29 -> Mar 1). This port clamps to the last valid
#      day of the target month (Feb 28). Edge case only: LinkedIn shows the exact
#      "Connected on <Month D, YYYY>" form in practice.
#
# members.json gains one field per newly-accepted member:
#   connected_on   the date they connected (YYYY-MM-DD)
#
# Run:  python linkedin-automation/skills/check-connections/check_connections.py [--dry-run]
#   --dry-run   scan + report matches, but DON'T write members.json.
#
# We only look for members that are contacted:true and don't yet have connected_on.
# Default sort on the connections page is "recently added", so we scroll only until
# every outstanding member is found (or the list/stall cap is hit).
#
# One list page, not a profile sweep — barely touches the profile-view volume limit.
# Single-instance still applies: don't run while another li-bot-profile session is open.

import calendar
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.parse import unquote

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S

MEMBERS = Path(__file__).resolve().parents[2] / "data" / "members.json"
CONNECTIONS_URL = "https://www.linkedin.com/mynetwork/invite-connect/connections/"

DRY_RUN = "--dry-run" in sys.argv[1:]

# The connections list is sorted "recently added", so newly-accepted invites are
# near the TOP — a modest scroll covers them. We don't crawl the whole network
# every run (pending members are never found, so the loop otherwise runs to the cap).
MAX_SCROLL_ROUNDS = 10
SCROLL_STALL_LIMIT = 5   # stop after this many rounds with no new cards


def today():
    return date.today().strftime("%Y-%m-%d")


def to_ymd(d):
    return d.strftime("%Y-%m-%d")


def match_key(slug):
    """The ONE way a slug is compared on both sides — decoded + lowercased.
    See divergence 1 in the header: the JS compares a decoded key against a raw
    href slug, so accented profiles never match."""
    if not slug:
        return None
    return unquote(str(slug)).lower()


def _minus_months(d, n):
    total = d.year * 12 + (d.month - 1) - n
    year, month = divmod(total, 12)
    month += 1
    return d.replace(year=year, month=month,
                     day=min(d.day, calendar.monthrange(year, month)[1]))


def _minus_years(d, n):
    year = d.year - n
    return d.replace(year=year, day=min(d.day, calendar.monthrange(year, d.month)[1]))


# Date formats new Date() accepts for the "Connected on ..." capture: full or
# abbreviated month name, comma optional.
_DATE_FORMATS = ("%B %d, %Y", "%B %d %Y", "%b %d, %Y", "%b %d %Y")


def parse_connected_date(text):
    """Parse a connection card's text into (YYYY-MM-DD, exact).
    Handles "Connected on June 20, 2026" (exact) and relative forms
    ("Connected today/yesterday", "Connected 3 days/weeks/months ago").
    exact=False means we fell back to a computed/observed date."""
    if not text:
        return today(), False
    t = re.sub(r"\s+", " ", text)

    exact = re.search(r"connected on ([A-Za-z]+ \d{1,2},? \d{4})", t, re.I)
    if exact:
        for fmt in _DATE_FORMATS:
            try:
                return to_ymd(datetime.strptime(exact.group(1), fmt).date()), True
            except ValueError:
                continue
    if re.search(r"connected today", t, re.I):
        return today(), True
    if re.search(r"connected yesterday", t, re.I):
        return to_ymd(date.today() - timedelta(days=1)), True
    rel = re.search(r"connected (\d+)\s*(day|week|month|year)s?\s*ago", t, re.I)
    if rel:
        n = int(rel.group(1))
        unit = rel.group(2).lower()
        d = date.today()
        if unit == "day":
            d = d - timedelta(days=n)
        elif unit == "week":
            d = d - timedelta(days=n * 7)
        elif unit == "month":
            d = _minus_months(d, n)
        elif unit == "year":
            d = _minus_years(d, n)
        return to_ymd(d), True
    # Couldn't read a date — record today as the observed date, flagged inexact.
    return today(), False


# Harvest connection cards currently in the DOM: { slug, text } per /in/ link.
# Each card's correct container is the HIGHEST ancestor that still references
# exactly ONE distinct profile slug AND holds a "Connected ..." line — one level
# further up merges into the whole ConnectionsList (every card would then share the
# first date in the list). So we climb while distinctSlugs === 1 and keep the last
# ancestor that contains "Connected".
_HARVEST_JS = r"""els => {
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
}"""


def harvest_cards(page):
    try:
        return page.eval_on_selector_all('a[href*="/in/"]', _HARVEST_JS)
    except Exception:
        return []


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def main():
    members = S.read_json(MEMBERS, [])
    # Outstanding = we invited them and don't yet know they connected.
    outstanding = {}   # match_key(slug) -> member
    for m in members:
        if m.get("contacted") is True and not m.get("connected_on"):
            key = match_key(S.slug_from_url(m.get("profile_url")))
            if key:
                outstanding[key] = m
    print(f"members.json: {len(members)} total, {len(outstanding)} contacted & awaiting acceptance.")
    if DRY_RUN:
        print("** DRY RUN ** — will report matches but NOT write members.json.\n")
    if not outstanding:
        print("Nothing to check.")
        return

    pw, browser, page = S.launch_session()
    found = {}   # match_key -> (date, exact)
    updated = 0

    try:
        page.goto(CONNECTIONS_URL, wait_until="domcontentloaded")
        S.ensure_logged_in(page)
        if S.is_restricted(page):
            print("\n!! LinkedIn restriction page detected. STOPPING.")
            return
        S.pause(page, 2500, 4500, "let connections render")

        stalls = 0
        prev_seen = 0
        seen_slugs = set()

        round_i = 0
        while round_i < MAX_SCROLL_ROUNDS and stalls < SCROLL_STALL_LIMIT:
            cards = harvest_cards(page)
            for c in cards:
                key = match_key(c.get("slug"))
                if not key:
                    continue
                seen_slugs.add(key)
                if key in outstanding and key not in found:
                    found[key] = parse_connected_date(c.get("text"))
            print(f"  scroll round {round_i + 1}: {len(seen_slugs)} connection cards seen, "
                  f"{len(found)}/{len(outstanding)} of ours matched")

            if len(found) >= len(outstanding):
                break   # got them all
            stalls = stalls + 1 if len(seen_slugs) == prev_seen else 0
            prev_seen = len(seen_slugs)

            page.evaluate("() => window.scrollBy(0, document.body.scrollHeight)")
            S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "scroll connections")
            round_i += 1

        # Apply matches.
        for key, (found_date, exact) in found.items():
            m = outstanding[key]
            m["connected_on"] = found_date
            if m.get("contact_status") != "connected":
                m["contact_status"] = "connected"
            updated += 1
            suffix = "" if exact else " (date not shown; recorded as observed today)"
            print(f"   CONNECTED {key} -> {found_date}{suffix}")
        if updated and not DRY_RUN:
            S.write_json(MEMBERS, members)

        still_out = len(outstanding) - len(found)
        print("\n============================================================")
        print(f" DONE. {updated} member(s) marked connected"
              f"{' (dry-run, NOT written)' if DRY_RUN else ''}.")
        print(f" {still_out} contacted member(s) still not in your connections (pending or declined).")
        print("============================================================")
    except Exception as err:
        print(f"\nFATAL: {err}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
