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

```bash
node linkedin-automation/skills/check-connections/check-connections.js [--dry-run]
```

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
