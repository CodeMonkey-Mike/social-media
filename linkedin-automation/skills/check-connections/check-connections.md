# check-connections — acceptance tracking skill

Finds which contacted members have **accepted** the connection request and stamps the
date onto `members.json`.

This is one of three skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the **shared session / login**
foundation (`lib/_li-session.js`) this skill is built on, and the shared data model.
This file documents the **acceptance scanner** specifically.

Sibling skills: [`scrape-group-members`](../scrape-group-members/scrape-group-members.md)
(find + classify members) ·
[`request-connections`](../request-connections/request-connections.md) (send invites).

---

## Running it

**Via the Lane 4 LangGraph graph (canonical since 2026-07-30 — port + graph blessed on
a live run: 7 newly connected, including one the JS could never have matched):**

```bash
python linkedin-automation/graph/run.py --lane 4 [--dry-run]
```

Takes **no `--max`** (it reads one list page, so there is nothing to budget). The graph
launches the Python port **`check_connections.py`**, verifies the `connected_on` delta
from disk, halts on a restriction page, and reports each newly-connected member with
their date. Because this lane is cheap and gets run repeatedly, its default checkpoint
thread carries the time (`check-YYYYMMDD-HHMM`). Rollback = swap `CHECK_SCRIPT` to
`CHECK_SCRIPT_JS` in `graph/lane_graph.py` — but read the port's two documented fixes
below first, because rolling back loses them. The frozen JS original still runs directly:

```bash
node linkedin-automation/skills/check-connections/check-connections.js [--dry-run]
```

### Two fixes the Python port carries and the JS does NOT (2026-07-30)

1. **Percent-encoded slugs can now match.** The JS keys its outstanding map with
   `slugFromUrl()` (which `decodeURIComponent`s) but harvests card slugs **raw** off the
   `href`, so an accented profile never matches: the map holds
   `alberto-ruiz-pérez-1bb0b860` while the card yields `alberto-ruiz-p%C3%A9rez-1bb0b860`.
   `members.json` has **16 such members (8 already contacted)** and **zero** have ever
   been matched, versus ~27% of ASCII-slug members — their acceptances were silently
   missed forever. The port decodes and lowercases both sides before comparing.
2. **Relative month/year math clamps instead of overflowing.** JS `setMonth`/`setFullYear`
   roll forward off a short month ("1 month ago" on May 31 → May 1; "1 year ago" on
   Feb 29 → Mar 1). The port clamps to the last valid day (Apr 30 / Feb 28). Edge case
   only, since LinkedIn shows the exact "Connected on &lt;Month D, YYYY&gt;" form in practice.

Opens `linkedin.com/mynetwork/invite-connect/connections/` (sorted recently-added),
scrolls until every outstanding member (`contacted:true` without a `connected_on`) is
matched or the list is exhausted, matches connection cards by `/in/<slug>`, and reads
each card's "Connected on …" text. On a match it sets `connected_on` (YYYY-MM-DD) and
`contact_status: connected`. `--dry-run` reports without writing.

This is **one list page**, not a profile sweep, so it's gentle on the volume limit —
safe to run more freely than the scraper or the invite sender.

## Date parsing

Handles the live format **"Connected on June 20, 2026"** (verified 2026-06-27) plus
relative forms ("today", "yesterday", "N days/weeks/months ago"). If LinkedIn shows
no readable date, it records **today** as the observed date and logs that it's inexact.

## Card isolation

Each connection card is the highest ancestor of its profile link that still references
exactly ONE `/in/` slug (one level up merges into the whole `ConnectionsList`, where
every card would share the first date). If LinkedIn restructures the list, re-run
`_probe-connections.js` (this folder) to re-pin this.

## Coverage

The page loads ~20 cards and `window.scrollBy` doesn't reliably page further, so each
run effectively reads the **top of the recently-added list**. That's fine because a
freshly-accepted invite appears at the top — just run this **regularly** (every day or
two) so each acceptance is caught while still near the top. (Source is the connections
list, NOT `/mynetwork/grow/`: grow only surfaces a transient "X accepted" notification
with no reliable connect date.)
