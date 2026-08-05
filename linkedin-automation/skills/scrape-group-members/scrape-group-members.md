# scrape-group-members — group member scraper skill

Scrapes the members of a LinkedIn **group**, reads each member's location, and
captures the ones located in **Europe / North America / South America / the
Caribbean** into `members.json` as `{ profile_url, location, group_id }` for later
outreach.

This is one of three skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the **shared session / login
/ search-and-click navigation / base pacing** foundation (`lib/_li-session.js`) that
this skill is built on, the shared data model, and **LinkedIn's volume limits** (the
binding constraint on how much you can run per day). This file documents the **scraper**
specifically.

Sibling skills: [`request-connections`](../request-connections/request-connections.md)
(send invites) · [`check-connections`](../check-connections/check-connections.md)
(record acceptances).

---

## Running it

```bash
# from repo root — canonical (the Lane 2 graph: wraps scrape_group_members.py, verifies
# from disk, kill-switch on consecutive errors, regions report built into the output)
python linkedin-automation/graph/run.py --lane 2 --max N

# direct script (same scraper, no graph supervision)
python linkedin-automation/skills/scrape-group-members/scrape_group_members.py [--max=N] [--collect-only]
```

**Port status (2026-07-28): BLESSED.** `scrape_group_members.py` is a 1:1 port of
`scrape-group-members.js` on `lib/li_session.py` (which gained `search_and_open`,
`type_human`, and the slug/name-query helpers). Parity-tested (54 checks incl. the full
`classify()` battery, bug-for-bug — the known Porto-Alegre/Georgia mislabels reproduce
identically), then blessed live the same evening: 5 profiles through the graph — 2
captured (correct zones + `group_id`), 2 correctly skipped out-of-zone, 1 chronic-404
error handled correctly (stayed unprocessed; retired after the run), search-and-click
landed exact slugs, all data verification green. ONE deliberate divergence from the JS:
the collect-phase "Show more" selector uses exact visible text only (the JS still
carries the broad `aria-label*="more"` clause — the member-row-menu bug fixed in the
seeder on 2026-06-29). **`scrape-group-members.js` is now frozen history, kept only as
rollback** (`SCRAPE_SCRIPT_JS` in `graph/lane_graph.py` is the one-line swap), like
`seed-by-name.js`.

- `--max=N` — process only the next **N** unprocessed members this run, then stop.
  Run again any time to continue; there is **no state to manage** (the `processed`
  flag in the queue is the resume point). This is the normal way to run it — in
  batches, here and there. **Keep N ≤ 75/day** (raised from 50, Mike, 2026-07-30; see
  [`../SKILL.md`](../SKILL.md) "LinkedIn limits").
- `--collect-only` — just (re)collect the member list into the queue, don't visit
  any profiles.
- No flags — process **all** remaining members in one (long) run.

**Two phases per run** (this one script does both — they are phases, not separate
skills):
1. **Collect** (only when the queue is empty, or forced with `--collect-only`) —
   open the group's `/members/` page, scroll + click "Show more results" until the
   list stops growing, seed every member into `members-urls.json` as `processed:false`.
2. **Process** — visit the next N unprocessed profiles, read location, classify,
   capture matches into `members.json`, flip `processed:true`.

Errors are safe: a profile that fails to load stays `processed:false` and is retried
on the next run (it is **not** silently dropped).

---

## How location is read (important)

LinkedIn ships **hashed, build-generated CSS class names** (e.g. `_8d59a5a1`) and
renders **no `<h1>`**, so class/tag selectors are useless and break on every deploy.
Instead, `readLocation()` reads the **`<main>` element's innerText**, which is
stable and well-ordered:

```
<Name>
<Headline>
<Location>          <-- taken from here
·
Contact info        <-- (or "<N> followers" / "<N> connections")  = the anchor
```

The location is the line just above the "Contact info" / followers / connections
anchor. No class names involved. If LinkedIn ever reorders this, re-run
`_probe-location.js` and adjust the anchor logic.

## How location is classified

LinkedIn location strings are a comma hierarchy ending in the **country**
("Sydney, New South Wales, Australia", "Austin, Texas, United States"). So
`classify()` matches on the **last comma segment (the country)** against keyword
lists for four zones: `europe`, `north_america`, `south_america`, `caribbean`.
Classifying on the country tail is what disambiguates "New South **Wales**,
Australia" (reject) from "Cardiff, **Wales**" (Europe) — a naive whole-string scan
false-matched the substring "wales" and wrongly captured Sydney once. An `EXCLUDE`
list (Australia, New Zealand, AU states) is checked first for the no-country case.
Only a **comma-less** string (a bare metro like "San Francisco Bay Area") triggers a
whole-string region/metro scan. The raw location is stored as-is. To widen coverage,
add keywords to `ZONES`; to fix a false positive, add to `EXCLUDE`.

---

## Companion: seeding a large group by name (`seed_by_name.py`)

For a huge group (tens of thousands) where enumerating every member is impractical,
`seed_by_name.py` searches a handful of **names** in the group's in-page "Search members"
box and captures every match into the queue (LinkedIn substring-matches, so "David" also
pulls "Davidson"). It only writes `members-urls.json` — it does **not** visit profiles.
We walk the alphabet, 3 common male + 1 common female name per letter (group `6665791`,
A→D as of 2026-06-29).

```bash
python linkedin-automation/skills/scrape-group-members/seed_by_name.py --group=<id> --names="David,Daniel,Donald,Deborah"
```

**Port status (2026-07-23): BLESSED.** `seed_by_name.py` is the repo's FIRST freeze-and-port
Python port (root `CLAUDE.md` Python-first rule) — a 1:1 translation of `seed-by-name.js` on
the new `lib/li_session.py` foundation (helpers byte-parity-tested against `_li-session.js`,
incl. the JSON writer). Its blessing run (letter W, 2026-07-23: 6 names, 148 new members,
zero errors, clean data verification — see PROJECT-LOG) passed, so the Python version is
canonical; `seed-by-name.js` is frozen history, kept only as rollback.

It records the searched names onto `data/groups.json` (`searched_names`). Searching the
member list is cheap (no profile views) — the captured URLs are processed later by the
main scraper at ≤75/day.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Collects **0 members** | The member-list link harvest (`a[href*="/in/"]`) or the "Show more" button selector changed. Re-check against the live `/members/` page. |
| During seeding the browser **clicks member rows / opens per-member menus** (looks like it's "messaging" people) | A too-broad "Show more results" selector. LinkedIn puts a "More actions" (...) button on **every member row**, so a `button[aria-label*="more" i]` clause with `.first()` grabs a row button instead of the bottom pagination control (fixed 2026-06-29 — match the pagination button by **exact visible text** only: `Show more results` / `Load more`). **General rule: never select an action control by a broad `aria-label*=` substring on a page full of per-row buttons** — scope to the specific control. Audit every `.click()` for member-row collisions. |
| Every location is **empty** | The `<main>` text layout changed. Run `node linkedin-automation/skills/scrape-group-members/_probe-location.js [profileUrl] [needle]` to see where the location text now lives, then fix `readLocation()`. |
| **"NOT LOGGED IN"** on every profile | Auth-wall detection misfired, or the session expired. Log in again in the Chrome window. Detection is URL-based (`AUTHWALL_RE`); only a real `/login`/`/authwall` redirect should trigger it. (Login gate lives in `lib/_li-session.js` — see [`../SKILL.md`](../SKILL.md).) |
| A real Europe/Americas member was skipped | Their city wasn't in the `ZONES` keyword map. Add it. |
| Search-and-click broke (`goto-*` on everything) | LinkedIn moved the nav search box. Run `_probe-search.js` (this folder); fix `SEARCH_BOX` in `lib/_li-session.js`. See [`../SKILL.md`](../SKILL.md) "Shared foundation". |
