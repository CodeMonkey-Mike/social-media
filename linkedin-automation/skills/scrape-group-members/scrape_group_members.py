# scrape_group_members.py — visit queued members, read + classify their location,
# capture target-zone members into members.json.
#
# Python port of scrape-group-members.js (freeze-and-port, 2026-07-28); logic,
# selectors, pacing, classification, and OUTPUT FORMAT are 1:1 with the JS
# original, which stays alongside as rollback until this port is blessed on a
# live run. The output lines must stay byte-identical: the Lane 2 graph wrapper
# (graph/lane_graph.py) parses them (CAPTURE / skip / error / [i/N] / DONE).
#
# One DELIBERATE divergence from the JS: the collect-phase "Show more" selector
# drops the broad `button[aria-label*="more"]` clause. Every member ROW has a
# "More actions" (...) button, so that clause + .first grabs a row button and
# opens that member's action menu — the exact bug fixed in the seeder on
# 2026-06-29 ("never select an action control by a broad aria-label*= substring
# on a page full of per-row buttons"). The JS collect phase still carries the
# bad clause; this port applies the documented fix instead of re-importing the bug.
#
# TWO FILES:
#   members-urls.json  the work QUEUE — { profile_url, processed, group_id }.
#                      processed flips true once visited; run in batches any time.
#   members.json       the CAPTURED deliverable — target-zone members only, as
#                      { profile_url, location, group_id }.
#
# Run:  python linkedin-automation/skills/scrape-group-members/scrape_group_members.py [--max=N] [--collect-only]
#
# Single-instance: don't run while another li-bot-profile session is open.

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S

DATA = Path(__file__).resolve().parents[2] / "data"
QUEUE = DATA / "members-urls.json"
OUT_MEMBERS = DATA / "members.json"

ARGV = sys.argv[1:]


def flag(name):
    for a in ARGV:
        if a.startswith(f"--{name}="):
            return a.split("=", 1)[1]
    return None


MAX_PROFILES = int(flag("max")) if flag("max") else None
COLLECT_ONLY = "--collect-only" in ARGV

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
GROUP_ID = "9078205"
MEMBERS_URL = f"https://www.linkedin.com/groups/{GROUP_ID}/members/"

# Profile-cycle pacing knobs (ms). Small-action pacing (ACTION_MIN/MAX) is shared
# from li_session; these between-profile knobs are scraper-specific.
PROFILE_MIN = 60000   # pause between one profile cycle and the next search (1 min)
PROFILE_MAX = 300000  # ...up to 5 min — random, deliberately slow (Mike, 2026-06-30)
REST_EVERY = 18       # every N profiles, take a longer "human break"
REST_MIN = 300000     # distinctly longer than the between-profile gap (5 min)
REST_MAX = 480000     # ...up to 8 min

MAX_SCROLL_ROUNDS = 400   # hard ceiling so a stuck scroll can't loop forever
SCROLL_STALL_LIMIT = 6    # stop scrolling after this many rounds with no new members

# ----------------------------------------------------------------------------
# Location classification
# ----------------------------------------------------------------------------
# LinkedIn location strings are free text but almost always end with the country.
# We match country names + regions + big metros for the four target zones. A
# whole-word/phrase match means capture; anything we can't place is just marked
# processed and left out of the deliverable.

ZONES = {
    "europe": [
        "europe", "european union",
        "albania", "andorra", "austria", "belarus", "belgium", "bosnia", "herzegovina",
        "bulgaria", "croatia", "cyprus", "czech", "czechia", "denmark", "estonia",
        "finland", "france", "germany", "greece", "hungary", "iceland", "ireland",
        "italy", "kosovo", "latvia", "liechtenstein", "lithuania", "luxembourg",
        "malta", "moldova", "monaco", "montenegro", "netherlands", "north macedonia",
        "macedonia", "norway", "poland", "portugal", "romania", "russia", "san marino",
        "serbia", "slovakia", "slovenia", "spain", "sweden", "switzerland", "ukraine",
        "united kingdom", "great britain", "england", "scotland", "wales",
        "northern ireland", "vatican",
        # common regions / metros that may appear without a country
        "london", "greater london", "manchester", "birmingham", "edinburgh", "glasgow",
        "dublin", "paris", "madrid", "barcelona", "catalonia", "lisbon", "porto",
        "berlin", "munich", "bavaria", "hamburg", "frankfurt", "cologne", "amsterdam",
        "rotterdam", "brussels", "zurich", "geneva", "vienna", "rome", "milan",
        "naples", "turin", "stockholm", "oslo", "copenhagen", "helsinki", "warsaw",
        "krakow", "prague", "budapest", "athens", "bucharest", "moscow",
        "saint petersburg", "st petersburg", "kyiv", "kiev",
    ],
    "north_america": [
        "united states", "u.s.a", "usa", "u.s.", "america", "canada", "mexico",
        "guatemala", "belize", "honduras", "el salvador", "nicaragua", "costa rica",
        "panama",
        # US states + DC
        "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
        "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho", "illinois",
        "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
        "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana",
        "nebraska", "nevada", "new hampshire", "new jersey", "new mexico", "new york",
        "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania",
        "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah",
        "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming",
        "district of columbia", "washington, d.c", "washington dc",
        # Canadian provinces
        "ontario", "quebec", "british columbia", "alberta", "manitoba", "saskatchewan",
        "nova scotia", "new brunswick", "newfoundland", "prince edward island",
        # big metros that may appear bare
        "new york city", "san francisco", "bay area", "silicon valley", "los angeles",
        "chicago", "boston", "seattle", "austin", "denver", "atlanta", "miami",
        "dallas", "houston", "phoenix", "philadelphia", "toronto", "vancouver",
        "montreal", "calgary", "ottawa", "mexico city", "guadalajara", "monterrey",
    ],
    "south_america": [
        "south america", "latin america", "brazil", "brasil", "argentina", "chile",
        "colombia", "peru", "venezuela", "ecuador", "bolivia", "paraguay", "uruguay",
        "guyana", "suriname", "french guiana",
        "sao paulo", "rio de janeiro", "brasilia", "buenos aires", "santiago",
        "bogota", "medellin", "lima", "caracas", "quito", "montevideo", "la paz",
    ],
    "caribbean": [
        "caribbean", "cuba", "jamaica", "haiti", "dominican republic", "puerto rico",
        "trinidad", "tobago", "bahamas", "barbados", "aruba", "curacao", "cayman",
        "bermuda", "antigua", "barbuda", "grenada", "saint lucia", "st lucia",
        "saint kitts", "dominica", "saint vincent", "turks and caicos",
        "havana", "kingston", "santo domingo", "san juan", "nassau",
    ],
}


def phrase_matcher(words):
    # Anchor on non-letter edges so "wales" matches "..., Wales" but the keyword
    # still has to be a whole word/phrase, not an arbitrary substring.
    alt = "|".join(re.escape(w) for w in sorted(words, key=len, reverse=True))
    return re.compile(f"(?:^|[^a-z])(?:{alt})(?:$|[^a-z])", re.I)


ZONE_MATCHERS = [(zone, phrase_matcher(words)) for zone, words in ZONES.items()]

# Non-target places that contain a target keyword as a substring and would
# otherwise false-match (e.g. "New South Wales" contains "wales"). Checked first,
# so these are always rejected.
EXCLUDE = [
    "australia", "new south wales", "south australia", "western australia",
    "queensland", "tasmania", "new zealand",
]
EXCLUDE_RE = phrase_matcher(EXCLUDE)


def classify(location):
    """Returns the matching zone name, or None if we can't place the string.

    Location strings are a comma hierarchy ending in the country, so we classify
    on the COUNTRY (the last comma segment) — that's what disambiguates
    "New South Wales, Australia" (reject) from "Cardiff, Wales" (Europe). Only
    when there is no comma at all (a bare metro like "San Francisco Bay Area")
    do we scan the whole string for a region/metro keyword."""
    if not location:
        return None
    lower = location.lower()
    if EXCLUDE_RE.search(f" {lower} "):
        return None

    parts = [s.strip() for s in lower.split(",") if s.strip()]
    tail = parts[-1] if parts else lower
    for zone, matcher in ZONE_MATCHERS:
        if matcher.search(f" {tail} "):
            return zone
    # No country/region match. Fall back to a whole-string scan ONLY when there
    # is no comma (so we don't resurrect substring collisions on multi-part strings).
    if len(parts) <= 1:
        for zone, matcher in ZONE_MATCHERS:
            if matcher.search(f" {lower} "):
                return zone
    return None


# ----------------------------------------------------------------------------
# Step 1 — collect every member's profile URL from the group member list
# ----------------------------------------------------------------------------
def collect_queue(page):
    """Returns the work queue (loaded from members-urls.json, or freshly collected)."""
    existing = S.read_json(QUEUE, None)
    if existing and isinstance(existing, list) and len(existing):
        # Migrate the legacy string-array format -> objects with a processed flag.
        if isinstance(existing[0], str):
            done_urls = set(
                [m["profile_url"] for m in S.read_json(OUT_MEMBERS, [])]
                + S.read_json(DATA / "visited.json", [])
            )
            migrated = [{"profile_url": url, "processed": url in done_urls} for url in existing]
            S.write_json(QUEUE, migrated)
            carried = sum(1 for m in migrated if m["processed"])
            print(f"Migrated members-urls.json: {len(migrated)} URLs -> objects (carried over {carried} already-processed).")
            return migrated
        print(f"Using existing queue: {len(existing)} members (delete members-urls.json to re-collect).")
        return existing

    print(f"\nOpening group members page:\n  {MEMBERS_URL}")
    page.goto(MEMBERS_URL, wait_until="domcontentloaded")
    S.ensure_logged_in(page)
    page.goto(MEMBERS_URL, wait_until="domcontentloaded")
    S.pause(page, 3000, 5000, "let member list render")

    found = {}
    stalls = 0
    rounds = 0
    while rounds < MAX_SCROLL_ROUNDS and stalls < SCROLL_STALL_LIMIT:
        hrefs = page.eval_on_selector_all(
            'a[href*="/in/"]', "els => els.map(a => a.getAttribute('href'))"
        )
        added = 0
        for h in hrefs:
            c = S.canonical_profile_url(h)
            if c and c not in found:
                found[c] = True
                added += 1

        stalls = stalls + 1 if added == 0 else 0
        print(f"  scroll round {rounds + 1}: {len(found)} members (+{added})")

        page.evaluate("() => window.scrollBy(0, document.body.scrollHeight)")
        S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "scroll")

        # Pagination control by EXACT visible text ONLY (see divergence note in the
        # header: the JS original's aria-label*="more" clause grabs member-row buttons).
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
                pass  # button detached / not clickable — keep scrolling
        rounds += 1

    queue = [{"profile_url": url, "processed": False} for url in found]
    S.write_json(QUEUE, queue)
    print(f"\nCollected {len(queue)} members -> {QUEUE.name} (all processed:false)")
    return queue


# ----------------------------------------------------------------------------
# Step 2 — read a member's location from their profile
# ----------------------------------------------------------------------------
def read_location(page):
    """Read the location line from the profile top card via <main>'s innerText.
    LinkedIn ships hashed CSS class names and no <h1>, so class/tag selectors are
    useless. main's text is stable and well-ordered:
        <Name> / <Headline> / <Location> / · / Contact info|followers|connections
    The location is the line just above the anchor. No class names involved."""
    try:
        page.wait_for_function(
            "() => { const m = document.querySelector('main');"
            " return m && m.innerText && m.innerText.trim().length > 80; }",
            timeout=15000,
        )
    except Exception:
        pass

    try:
        main = page.eval_on_selector("main", "el => el.innerText")
    except Exception:
        main = ""
    if not main:
        return ""

    lines = [s.strip() for s in main.split("\n") if s.strip()]
    if len(lines) < 2:
        return ""

    name = lines[0]
    headline = lines[1]

    def is_anchor(l):
        return bool(
            re.match(r"^contact info$", l, re.I)
            or re.search(r"\bfollowers?$", l, re.I)
            or re.search(r"\bconnections?$", l, re.I)
        )

    def is_junk(l):
        return (
            l == "·"
            or is_anchor(l)
            or bool(re.match(r"^message$", l, re.I))
            or bool(re.match(r"^(follow|connect|more)$", l, re.I))
        )

    loc = ""
    anchor_idx = next((i for i, l in enumerate(lines) if is_anchor(l)), -1)
    if anchor_idx > 1:
        for j in range(anchor_idx - 1, 0, -1):
            if is_junk(lines[j]):
                continue
            loc = lines[j]
            break
    # Fallback: 3rd line (name, headline, location) when there's no anchor.
    if not loc and len(lines) >= 3 and not is_junk(lines[2]):
        loc = lines[2]

    # Guard: never mistake the name/headline (no location shown) for a location.
    if not loc or loc == name or loc == headline:
        return ""
    return re.sub(r"\s*·\s*$", "", loc).strip()


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def main():
    pw, browser, page = S.launch_session()

    # Captured deliverable so far (matched members). Resume-friendly.
    members = S.read_json(OUT_MEMBERS, [])
    captured = {m["profile_url"] for m in members}

    try:
        queue = collect_queue(page)
        done = sum(1 for m in queue if m.get("processed"))
        print(f"Queue: {len(queue)} members, {done} processed, {len(queue) - done} remaining. {len(members)} captured so far.")
        if COLLECT_ONLY:
            print(f"\n--collect-only: stopping after collection. {len(queue)} members seeded.")
            return

        todo = [m for m in queue if not m.get("processed")]
        if MAX_PROFILES is not None:
            print(f"\n--max={MAX_PROFILES}: limiting this run to {MAX_PROFILES} profile(s).")
            todo = todo[:MAX_PROFILES]
        print(f"\n{len(todo)} profiles to visit this run (of {len(queue) - done} remaining).\n")

        i = 0
        for entry in todo:
            i += 1
            url = entry["profile_url"]
            print(f"[{i}/{len(todo)}] {url}")
            try:
                nav = S.search_and_open(page, entry)
                S.ensure_logged_in(page)
                print(f"   reached via {nav}")
                # Guard: only proceed if we actually landed on a profile page.
                # Otherwise raise so this member stays processed:false and is
                # retried next run (never mark it done off the wrong page).
                if not re.search(r"/in/", page.url):
                    raise RuntimeError(f"not on a profile page ({page.url})")
                S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "read profile")

                location = read_location(page)
                zone = classify(location)

                if zone and url not in captured:
                    # Tag the capture with the QUEUE ENTRY's own group_id (seeding
                    # writes it per member), not the hardcoded collect-phase
                    # GROUP_ID — the queue crosses groups.
                    members.append({
                        "profile_url": url,
                        "location": location,
                        "group_id": entry.get("group_id") or GROUP_ID,
                    })
                    captured.add(url)
                    S.write_json(OUT_MEMBERS, members)
                    print(f"   CAPTURE [{zone}] {location}")
                elif zone:
                    print(f"   already captured [{zone}] {location}")
                else:
                    print(f'   skip  (not a target zone) "{location or "no location found"}"')

                # Visited successfully -> mark processed so we never re-check it.
                entry["processed"] = True
                S.write_json(QUEUE, queue)
            except Exception as err:
                # Leave processed:false so a genuine load error is retried next run.
                print(f"   error (will retry next run): {str(err).splitlines()[0]}")

            if i % REST_EVERY == 0 and i < len(todo):
                S.pause(page, REST_MIN, REST_MAX, "longer human break")
            else:
                S.pause(page, PROFILE_MIN, PROFILE_MAX, "between profiles")

        remaining = sum(1 for m in queue if not m.get("processed"))
        print("\n============================================================")
        print(f" DONE this run. {len(members)} members captured -> {OUT_MEMBERS.name}")
        print(f" {remaining} of {len(queue)} still to process (run again to continue).")
        print("============================================================")
    except Exception as err:
        print(f"\nFATAL: {err}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
