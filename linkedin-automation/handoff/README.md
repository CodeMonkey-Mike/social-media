# handoff/ — package the LinkedIn automation for a friend (Mike's side)

This folder is **for Mike**, not for the recipient. It holds everything needed to hand
the LinkedIn toolkit to someone else running their own Claude Code on their own machine:

- `SETUP-GUIDE.md` — the instruction document she receives (written for her + her Claude, Mac).
- `starter/` — files that go into her bundle **as-is** (her `CLAUDE.md`, a fresh
  `PROJECT-LOG.md`, a pre-seeded `data/groups.json` for group 1954246, a trimmed
  dashboard server).

## What she must NOT receive

Never ship your own data. It is your network's private state and her graph runs would
be corrupted by it:

- `data/members.json`, `data/members-urls.json` (+ `.bak*`), `data/endorsements.json`
- `data/lane_runs.json`, `data/lane_progress.json`, `data/graph_checkpoints.sqlite`
- `PROJECT-LOG.md` (your history), `CLAUDE.md` (your repo's), headshots/banners

Her `data/` starts with exactly one file: the starter `groups.json`.

## Assembling the bundle

From a bash shell at the repo root:

```bash
SRC="$(pwd)"
OUT="$HOME/Desktop/linkedin-handoff"
mkdir -p "$OUT/dashboard"

# Code: the four code folders, minus caches
cp -r "$SRC/linkedin-automation/graph" "$SRC/linkedin-automation/lib" \
      "$SRC/linkedin-automation/skills" "$SRC/linkedin-automation/tools" "$OUT/"
find "$OUT" -type d -name __pycache__ -exec rm -rf {} +

# Dashboard page (server comes from starter/)
cp "$SRC/schedule-tweets/langgraph.html" "$OUT/dashboard/"

# Her guide + starter files (CLAUDE.md, PROJECT-LOG.md, data/groups.json,
# dashboard/serve_dashboard.py) overlaid at the bundle root
cp "$SRC/linkedin-automation/handoff/SETUP-GUIDE.md" "$OUT/"
cp -r "$SRC/linkedin-automation/handoff/starter/." "$OUT/"

# Sanity: no private data slipped in
ls "$OUT/data"          # must show ONLY groups.json
```

Then zip `linkedin-handoff/` and send it with a pointer to `SETUP-GUIDE.md` as the
first thing she opens.

**Mention when you hand it over:** the Lane 5 follow-up DM (sent two weeks after an
accept) is the one thing she must **write herself, in her own words** — the shipped
template is your personal story and her Claude is gated (in her `CLAUDE.md`) to refuse
Lane 5 until she's typed out her own version. The invite note, by contrast, ships
ready-made in the guide (§3c) — her Claude just applies it.

## Resulting bundle layout (what she unzips)

```
linkedin-handoff/
  SETUP-GUIDE.md          <- she starts here
  CLAUDE.md               <- auto-loaded by her Claude Code
  PROJECT-LOG.md          <- fresh template, she appends after every run
  graph/                  run.py + lane_graph.py (the 5 LangGraph lanes)
  lib/                    li_session.py (Python) + _li-session.js (JS, for skill 5)
  skills/                 the 5 skill folders + SKILL.md index + probes
  tools/                  one-off utilities (group-name grabber, invite audit/withdraw)
  data/
    groups.json           group 1954246 pre-seeded with the 128 proven search names
  dashboard/
    serve_dashboard.py    trimmed server (LangGraph page only, port 8766)
    langgraph.html        the LangGraph page (needs 2 tiny edits, see the guide)
```

Notes:
- The `.js` files inside `skills/` (other than `check-endorsements/`) are the frozen
  rollback copies of ported lanes — they ride along but are never run; the guide says so.
- The per-skill `.md` docs and code comments reference Mike's account history (restriction
  dates, decisions). That is intentional — the hard-won limits transfer as inherited
  defaults; the guide tells her that her own `PROJECT-LOG.md` is authoritative for HER
  account going forward.
