# seed_by_name.py — collect group members by NAME search into the work queue.
#
# Python port of seed-by-name.js (freeze-and-port, 2026-07-23); logic, selectors,
# pacing, and output format are 1:1 with the JS original, which stays alongside as
# rollback until this port is blessed on a live run.
#
# For a big group (tens of thousands), enumerating every member is impractical and
# mostly wasted on out-of-zone people. Instead we search a handful of names in the
# group's in-page "Search members" box and capture EVERY member the search returns
# (LinkedIn substring-matches, so "Albert" also pulls "Alberto", "John Albert", ...).
#
# This step ONLY writes data/members-urls.json (the queue) as
#   { profile_url, processed:false, group_id }
# It does NOT visit profiles or read location — that is the separate process phase
# (scrape-group-members.js, run with --max=N at <=50/day).
#
#   python linkedin-automation/skills/scrape-group-members/seed_by_name.py \
#        --group=6665791 --names="Albert,Andrew,Anthony,Ana"
#
# Flags:
#   --group=ID        group to search (default 6665791)
#   --names="A,B,C"   comma-separated names to search (required)
#   --legacy-group=ID group_id to backfill onto existing queue entries that lack one
#                     (default 9078205 — the only group scraped before this field existed)
#
# Single-instance: don't run while another li-bot-profile session is open.

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S

DATA = Path(__file__).resolve().parents[2] / "data"
QUEUE = DATA / "members-urls.json"
GROUPS = DATA / "groups.json"

ARGV = sys.argv[1:]


def flag(name, default):
    for a in ARGV:
        if a.startswith(f"--{name}="):
            return a.split("=", 1)[1]
    return default


GROUP_ID = flag("group", "6665791")
LEGACY_GROUP = flag("legacy-group", "9078205")
NAMES = [s.strip() for s in flag("names", "").split(",") if s.strip()]

MEMBERS_URL = f"https://www.linkedin.com/groups/{GROUP_ID}/members/"
# The visible in-page member filter (placeholder/aria "Search members"). The hidden
# "Search for posts in this group" box has no "member" in its label, so this is unique.
SEARCH_BOX = 'input[placeholder*="member" i], input[aria-label*="member" i]'

MAX_SCROLL_ROUNDS = 60  # safety cap per name
STALL_LIMIT = 4         # stop a name after N rounds with no new members


def harvest(page):
    """Harvest every distinct canonical /in/ URL currently in the DOM."""
    try:
        hrefs = page.eval_on_selector_all(
            'a[href*="/in/"]', "els => els.map(a => a.getAttribute('href'))"
        )
    except Exception:
        hrefs = []
    out = set()
    for h in hrefs:
        c = S.canonical_profile_url(h)
        if c:
            out.add(c)
    return out


def search_name(page, name):
    """Search one name and scroll its filtered result list until it stops growing.
    Returns a set of canonical profile URLs."""
    # Fresh load resets scroll position and clears any prior filter.
    page.goto(MEMBERS_URL, wait_until="domcontentloaded")
    S.ensure_logged_in(page)
    S.pause(page, 3000, 5000, "member list render")

    if S.is_restricted(page):
        raise RuntimeError("RESTRICTED")

    box = page.locator(SEARCH_BOX).first
    box.click(timeout=8000)
    S.pause(page, 600, 1200, "focus search")
    box.fill("")
    box.press_sequentially(name, delay=S.random_between(60, 160))
    S.pause(page, 600, 1200, f'typed "{name}"')
    box.press("Enter")
    S.pause(page, 3500, 6000, "wait for results")

    found = set()
    stalls = 0
    rounds = 0
    while rounds < MAX_SCROLL_ROUNDS and stalls < STALL_LIMIT:
        before = len(found)
        found |= harvest(page)
        added = len(found) - before
        stalls = stalls + 1 if added == 0 else 0
        print(f"    scroll {rounds + 1}: {len(found)} matches (+{added})")

        # Push virtualized lists to load more: scroll the window AND the last row into view.
        page.evaluate("() => window.scrollBy(0, document.body.scrollHeight)")
        try:
            page.evaluate(
                """() => {
                  const links = document.querySelectorAll('a[href*="/in/"]');
                  if (links.length) links[links.length - 1].scrollIntoView({ block: 'end' });
                }"""
            )
        except Exception:
            pass
        S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "scroll")

        # Click "Show more results" if LinkedIn renders a button instead of pure infinite
        # scroll. Match the pagination control by its EXACT visible text ONLY. Do NOT add
        # a broad `button[aria-label*="more" i]` selector: every member ROW has a "More
        # actions" (...) button, so with `.first` that selector grabs a member-row button
        # instead of the bottom pagination control, opening that member's action menu
        # (Message/Remove). That looked like the bot "clicking Message on members /
        # opening a DM" (Mike, 2026-06-29).
        more_btn = page.locator(
            'button:has-text("Show more results"), button:has-text("Load more")'
        ).first
        try:
            n = more_btn.count()
        except Exception:
            n = 0
        if n:
            try:
                if more_btn.is_visible():
                    more_btn.click(timeout=4000)
                    S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "after show-more")
                    stalls = 0
            except Exception:
                pass  # detached/not clickable — keep scrolling
        rounds += 1
    return found


def record_group(searched_now):
    """Register/refresh the group in groups.json and record which names we searched."""
    groups = S.read_json(GROUPS, [])
    g = next((x for x in groups if x.get("group_id") == GROUP_ID), None)
    if g is None:
        g = {
            "group_id": GROUP_ID,
            "name": "",
            "url": f"https://www.linkedin.com/groups/{GROUP_ID}/",
            "members_url": MEMBERS_URL,
            "status": "active",
            "notes": "Seeded by name search (large group, not fully enumerated).",
            "searched_names": [],
        }
        groups.append(g)
    seen = set()
    merged = []
    for n in (g.get("searched_names") or []) + list(searched_now):
        if n not in seen:
            seen.add(n)
            merged.append(n)
    g["searched_names"] = merged
    S.write_json(GROUPS, groups)
    return g["searched_names"]


def main():
    if not NAMES:
        print('No --names provided. e.g. --names="Albert,Andrew,Anthony,Ana"', file=sys.stderr)
        sys.exit(1)

    # Load queue + one-time backfill of group_id onto pre-existing entries.
    queue = S.read_json(QUEUE, [])
    backfilled = 0
    for e in queue:
        if not e.get("group_id"):
            e["group_id"] = LEGACY_GROUP
            backfilled += 1
    if backfilled:
        print(f'Backfilled group_id="{LEGACY_GROUP}" onto {backfilled} existing queue entries.')
    have = {S.canonical_profile_url(e["profile_url"]) or e["profile_url"] for e in queue}
    print(f"Queue starts at {len(queue)} members. Searching group {GROUP_ID} for: {', '.join(NAMES)}\n")

    pw, browser, page = S.launch_session()
    per_name = {}
    try:
        for name in NAMES:
            print(f'[search] "{name}"')
            try:
                matches = search_name(page, name)
            except Exception as err:
                if "RESTRICTED" in str(err):
                    print("\n!!! LinkedIn restriction/unusual-activity page — STOPPING. !!!")
                    break
                print(f'   error on "{name}" (skipping): {str(err).splitlines()[0]}')
                continue

            added = 0
            for url in matches:
                if url in have:
                    continue
                have.add(url)
                queue.append({"profile_url": url, "processed": False, "group_id": GROUP_ID})
                added += 1
            per_name[name] = {"matched": len(matches), "added": added}
            S.write_json(QUEUE, queue)  # persist after every name (partial-safe)
            print(f'   "{name}": {len(matches)} matched, {added} new -> queue now {len(queue)}\n')

            S.pause(page, 15000, 30000, "between names")
    finally:
        browser.close()
        pw.stop()

    searched = record_group(list(per_name.keys()))
    print("\n============================================================")
    print(" SEED DONE.")
    for n, r in per_name.items():
        print(f"   {n}: {r['matched']} matched, {r['added']} new")
    print(f" Queue total now: {len(queue)} members.")
    print(f" Group {GROUP_ID} names searched so far: {', '.join(searched)}")
    print("============================================================")


if __name__ == "__main__":
    main()
