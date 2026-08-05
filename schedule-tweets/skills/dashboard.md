---
name: dashboard
description: Start the local dashboard server that shows pending/posted content across all queues.
---

## What it is

A browser-based dashboard at `http://localhost:8766`. A **left nav** splits it into two
pages:

| Nav item | Page | What it shows |
|---|---|---|
| **Social** | `index.html` (home) | All pending/posted content across every queue (X tweets, threads, polls, IG, YT, shorts, reply-guy). This is the original "Pending Posts" page, renamed. |
| **LangGraph** | `langgraph.html` | Live state of the LinkedIn LangGraph lanes — which node is running right now, the lane diagram, today's profile-view total against the restriction threshold, and the run history. |

## How to start

```powershell
Start-Process python -ArgumentList "C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\scripts\serve_dashboard.py" -WindowStyle Hidden
Start-Process "http://localhost:8766"
```

Or run in the foreground (shows request logs):

```powershell
python C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\scripts\serve_dashboard.py
```

**Port:** 8766
**Server file:** `schedule-tweets/scripts/serve_dashboard.py`
**Dashboard HTML:** `schedule-tweets/index.html`

## What the server does

- Serves `index.html`, `langgraph.html` and all static files from `schedule-tweets/` at `/`
- Routes `/x-reply-guy/...` GET requests to `../x-reply-guy/` on disk
- Routes `/linkedin/<file>` to `../linkedin-automation/data/<file>` — an **allowlist**
  (`lane_runs.json`, `lane_progress.json`) rather than a directory mount, because that
  folder also holds `members.json`, the project log and the restriction history. Served
  `Cache-Control: no-store`; the page polls them while a run is writing them.
- Handles POST `/x-reply-guy/queue` — appends an entry to `replies_to_post.json` and removes it from `reply_opportunities.json`
- CORS headers on all responses

## The LangGraph page

**One tab per automation.** LinkedIn is the first of what will be several, so nothing on
the page is LinkedIn-specific any more — every section renders from the active entry in
the `AUTOMATIONS` registry at the top of `langgraph.html`.

**Tabs carry live status**, because the page's main job is catching a graph that needs a
human, and that fails the moment the interesting automation is the one you are *not*
looking at. Every automation is polled, not just the visible one:

| Tab shows | Meaning |
|---|---|
| pulsing blue dot | running now |
| red **needs you** + ⏸ | `awaiting_input` — a graph is BLOCKED until you answer |
| amber **stale** | running, but the heartbeat stopped (probably reaped) |
| red **halted** / **failed** | last run ended unresolved |
| grey dot + count | idle; the number is today's runs |

The active tab is remembered across reloads and is addressable as `langgraph.html#linkedin`.

### Adding an automation

Two places, both one entry:

1. **`langgraph.html`** — push onto `AUTOMATIONS`: `id`, `label`, `sub`, `feed`
   (progress + runs URLs), `lanes` (each `{n, name, work, verify, retired?, views?}`),
   an optional `budget` (omit it and the meter section hides itself), and a `headline(run)`
   that turns a run's `summary` into one line.
2. **`scripts/serve_dashboard.py`** — one entry in `GRAPH_FEED_DIRS` mapping the `id` to
   its `data/` folder. The filename allowlist (`GRAPH_FEED_ALLOWED`) is shared. **Keep it
   an allowlist** — these folders hold private state, so a new automation gets a folder
   entry, never a wildcard.

The automation must write the same two files (`lane_runs.json`, `lane_progress.json`) in
the shape `linkedin-automation/graph/lane_graph.py` writes them.

Polls every 3 s. Sections, top to bottom:

1. **Now running** — the live heartbeat: lane, node, member *i* of *N*, elapsed, ok/error
   counts, pid, and the last meaningful output line. Idle shows the last real run instead.
2. **Lanes** — five cards, one per lane graph, each drawing its real inner pipeline
   (`work → verify`) with the running node lit. Lane 1 is greyed (out of daily rotation).
   Below them, the focused lane's full graph: `START → work → verify → END` plus the halt edge.

   **Only ONE lane is ever present-tense.** The running lane gets colour, a lit node and
   live counters; every other lane dims to 55 % with a neutral pill and `last run 22m ago`.
   Recency is not currency — a run that finished ten minutes ago is as much history as one
   from last week, so "same calendar day" is not the axis. **Exception: an unresolved
   outcome (failed / halted / killed) keeps its warning colour** until that lane is run
   again; greying out a restriction halt would bury the most important thing on the page.
3. **Profile views today** — a meter against the ~120/24 h level that restricted the
   account twice, with a per-lane breakdown and a warning past two thirds.
4. **Run history** — every recorded run; structural (`--stub`) runs are hidden behind a
   checkbox.

**Staleness matters here.** A run killed mid-flight (the background-task reaper has done
this repeatedly) leaves a `running` heartbeat that stops updating. Anything with no update
for 90 s is flagged **stale** with an explicit warning — do not relaunch without checking
whether the process is still alive, since a second run collides on the shared
`li-bot-profile` Chrome.

**Where the data comes from — and what it deliberately is not.** Both files are written by
`linkedin-automation/graph/lane_graph.py`, NOT read from the LangGraph checkpoint SQLite.
That DB is gitignored, documented as disposable, keyed by LangGraph's internal
serialization, and mostly full of stub-test threads — a UI on it would break the first time
someone deleted it. `lane_runs.json` is committed history; `lane_progress.json` is
transient and gitignored.

Human-in-the-loop is **display-only for now**: the page has a `needs you` status, but no
graph in the repo currently calls `interrupt()` (the LinkedIn lanes deliberately have none).
Resuming an interrupted graph means executing it, which a static file server cannot do.

## Tabs in the dashboard

| Tab | Source file |
|---|---|
| Tweets | `data/x-tweets.json` |
| Threads | `data/x-threads.json` |
| X Polls | `data/x-polls.json` |
| YT Posts | `data/yt-posts.json` |
| YT Polls | `data/yt-text-polls.json` |
| IG Single | `data/ig-single-image.json` |
| IG Carousel | `data/ig-carousel.json` |
| X Replies | `x-reply-guy/data/replies_to_post.json` |
| Reply Opps | `x-reply-guy/data/reply_opportunities.json` |
| Shorts | `data/shorts.json` |

## Stopping the server

```powershell
Stop-Process -Name python -ErrorAction SilentlyContinue
```
