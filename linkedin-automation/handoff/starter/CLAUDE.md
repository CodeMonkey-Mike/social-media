# LinkedIn connection-builder — operating instructions (auto-loaded)

This folder grows a targeted LinkedIn connection list from ONE LinkedIn group
(**Engineering & Management, group id 1954246**) via five sequential "lanes", each a
small LangGraph graph driving the user's own logged-in Chrome session with Playwright.
Setup and background: `SETUP-GUIDE.md`. Toolkit reference: `skills/SKILL.md`. Running
history and current counts: `PROJECT-LOG.md` — **read it at the start of a session,
append a dated entry after every run.**

All commands run from this folder, inside the venv (`source .venv/bin/activate`).

## The morning contract

The user says which lanes to run and the numbers (e.g. "lane 1 next letter, lane 2
forty, lane 3 ten, lane 4"). The number in the ask IS the human decision — don't
second-guess it, don't interrupt to renegotiate. Run lanes strictly one at a time, in
order, and report each lane's summary (Lane 2 always ends with the REGIONS breakdown).

| Lane | Command | Notes |
|---|---|---|
| 1 seed | `python3 graph/run.py --lane 1 --names "<names>"` | Letter-rotation rule below picks the names |
| 2 scrape | `python3 graph/run.py --lane 2 --max N` | ≤75/day, shared budget |
| 3 invite | `python3 graph/run.py --lane 3 --max N` | N is the user's call each run |
| 4 check | `python3 graph/run.py --lane 4` | No number, free, run daily |
| 5 endorse | `python3 graph/run.py --lane 5` | No number — the 14/7-day rule is gated in code; it refuses rather than guess |
| endorse-backs | `node skills/check-endorsements/check-endorsements.js` | Own profile only, free, every run day |

Exit codes: 0 done · 2 halted on a restriction page (STOP for the day) · 1 failed
(read the log, diagnose, one attempt only).

## Lane 1 letter rotation (how "next letter" is computed)

`data/groups.json` (the 1954246 entry) carries:
- `names_to_search` — the fixed 128-name plan, alphabet-covering, 4-6 names per letter.
- `searched_names` — appended AUTOMATICALLY by the seeder as each name is searched.

Rule: **next letter = the first letter, A→Z, that has at least one `names_to_search`
entry not yet in `searched_names`. Seed all of that letter's remaining names in one
run** (`--names "Nick,Nate,Neil,Norman,Nancy,Nina"` style). When every planned name is
in `searched_names`, Lane 1 is permanently done — say so and skip it. Seeding costs ~0
profile views (search result pages, not profile visits), so it never competes with the
scrape budget. Substring matching is intended: "Albert" also captures Alberto etc.

## Personalization gates (BLOCKING — check before Lanes 3 and 5)

The code shipped with the previous owner's message texts still in place. Two gates:

- **Lane 3 (invite note):** before the first-ever Lane 3 run, `MESSAGE` in
  `skills/request-connections/request_connections.py` must be replaced with the user's
  note (ready-made text in `SETUP-GUIDE.md` §3c). Gate check: if `MESSAGE` still
  contains "AI automation", do not run Lane 3 — apply the replacement first.
- **Lane 5 (favor-request DM): NEVER run Lane 5 — not even `--dry-run` — until the
  user has personally typed out her own DM text and you have installed it** into
  `MESSAGE_INTRO` + `MESSAGE_BODY_LINES` in
  `skills/endorse-and-message/endorse_and_message.py`. The shipped template is the
  previous owner's true personal story, name, and skills URL; sending it would be a
  false message from this account. Do NOT ghostwrite the story for her — ask her to
  provide it in her own words (SETUP-GUIDE.md §3d explains what to include), then do
  the mechanical install. Gate check: if the constants still contain "michael-luis" or
  "Miguel", Lane 5 stays blocked; say why and point her to §3d.

## Hard rules (the account-safety layer — never bend)

- **Volume budget:** scrape + invite + endorse each cost 1 profile view per member.
  Keep the day's TOTAL well under ~100 (known restriction level: ~120/24h). Scrape hard
  ceiling: 75/day, one run/day.
- **Any restriction / "unusual activity" page = stop ALL lanes for the day.** The
  scripts detect it and halt; never override or re-run.
- **One Chrome instance** on the bot profile, lanes strictly sequential, never two
  scripts at once.
- **One attempt per run** — if it looks stuck, read the output and diagnose; never
  relaunch blind (it collides with the open profile).
- **Never `goto` a profile URL directly** — search-and-click navigation is built into
  `lib/li_session.py`; do not remove or "optimize" it. Never tighten the pacing.
- **One sanctioned DM only** (Lane 5's fixed template). No other messages, ever.
- **Selector broke?** Run that skill's `_probe-*` script to dump the live DOM before
  changing any selector — never guess. See "Selector discipline" in `skills/SKILL.md`.
- Edit `data/*.json` with Python or Node only.
- The `.js` scripts beside ported Python (seed-by-name.js, scrape-group-members.js,
  request-connections.js, check-connections.js, endorse-and-message.js) are frozen
  rollbacks — never run them.

## Dashboard

`python3 dashboard/serve_dashboard.py` → http://localhost:8766 — live lane state,
node-by-node progress, run history, today's profile-view budget. Read-only.

## Data files (`data/`)

- `groups.json` — group registry + seeding plan/progress (see letter rotation).
- `members-urls.json` — work queue `{profile_url, processed, group_id}`.
- `members.json` — captured members + all outreach state (contacted → connected →
  endorsed → endorsed_back).
- `endorsements.json` — who endorsed us, append-only, `first_seen` = observed date.
- `lane_runs.json` — run history, written by `graph/run.py` at end; feeds the dashboard.
- `lane_progress.json` — transient live heartbeat during a run.
- `graph_checkpoints.sqlite` — LangGraph internals; disposable, never build on it.
