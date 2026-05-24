---
name: x-reply-auto
description: Fire-on-the-fly auto-reply. Scans the Following feed + Reply Guy list over the last ~1 hour, picks the best reply-worthy tweet (favoring high-visibility accounts where Mike has a sharp on-brand take), and replies immediately in Mike's voice — no review, no staging, no authorization. If nothing good is in the window, it no-ops.
---

## What this is

The **automatic** counterpart to the curated reply-guy flow (`CLAUDE.md`). It scans the last ~1 hour and replies to the **best reply-worthy** tweet it finds — favoring high-visibility accounts (big crypto/news accounts and alert bots, where a sharp reply gets seen by their audience and often retweeted) — on the fly, in Mike's voice, **without presenting it for review or queuing it**. No allow-list and no skip-list are needed: anyone worth replying to is already in the Following feed or the Reply Guy list. From Mike's seat it's automatic — Claude drafts the reply in the loop, but there is no approval step.

Designed to be invoked as **a single task within a task-list run**. Drop the task in multiple times if you want more than one reply per session.

## ⛔ Hard rules

- **No review.** The reply goes out unseen. The guardrails below are the only safety net, so honor them.
- **Look back ~1 hour and pick the BEST, not the newest.** `MAX_AGE_SECONDS = 3600` in `auto_reply_scan.py`. The scanner returns the whole last-hour pool sorted freshest-first; the skill (Claude) picks the most reply-worthy one — not necessarily the freshest. The window is a sanity bound, not a deadline. (Evolved 2026-05-23: 2 min → 10 min → 30 min → 1 hour, after observing the feeds are often quiet; freshest tweet was ~19 min old at test time. Tune `MAX_AGE_SECONDS` for busier/quieter hours.)
- **NEVER retry a "failed" reply.** X's verify step false-negatives under throttle — a reply marked `failed` has very often already posted. `auto_reply_post.py` consumes the pending file on every run, so an accidental re-run is a safe no-op. Never reconstruct a failed pending entry to "try again." (Same rule as the curated flow — see `CLAUDE.md`.)
- **Voice comes from the central persona:** `../persona/persona.json` → `reply_voice` register (lowercase, conversational openers, length tiers, reaction-only ratio). Never restate voice rules here.

## Feed sort — leave Following on Popular

Mike keeps the Following tab's sort on **Popular** (not Recent), and that's intentional: Popular surfaces high-engagement tweets, so picking the most recent of *those* yields a reply that's both reasonably fresh AND high-visibility — which is the point of reply-guy. **The scanner does NOT set or restore the sort.** It reads whatever tweets are at the top, uses their real `time[datetime]` timestamps, and picks the freshest within the window — so it works regardless of sort. **Do not add sort-toggling logic** (the two reply skills share `xbot-profile`; toggling would just fight each other).

## Chrome profile

Uses `xbot-profile` (shared with `post_replies.py`, `scrape_feed.py`, and the schedule-tweets X scripts). **Chrome must be fully closed before running either script.** Don't run concurrently with any other xbot-profile script.

## Pipeline

```
auto_reply_scan.py  →  data/auto_reply_candidates.json
        ↓ (Claude reads, judgment-checks, drafts in voice)
data/auto_reply_pending.json  →  auto_reply_post.py  →  posts + archives to posted_replies.json
```

### Step 1 — Scan for a fresh tweet

```
python auto_reply_scan.py
```

- Loads the **Following feed** and the **Reply Guy list**, top-of-feed only (no scrolling — both are reverse-chron, so a ≤2-min tweet is at the top if it exists).
- Computes age in **seconds**, keeps only tweets **≤3600s** (1 hour) old.
- Applies guardrails (see below).
- Writes qualifying candidates **freshest-first** to `data/auto_reply_candidates.json`.

### Step 2 — Decide and draft

1. Read `data/auto_reply_candidates.json`.
2. **If empty → STOP. Report "nothing reply-worthy in the last hour — skipping" and end.**
3. **Pick the most recent _reply-worthy_ tweet.** Because the Following tab is on **Popular** sort (see "Feed sort" above), the top tweets are already high-engagement — so replying to them maximizes visibility. From the pool, **skip junk first** (genuine spam/scam the blocklist missed; overtly partisan flamebait that doesn't fit a crypto/macro account), then take the **most recent** of what remains so the reply lands while the tweet is still fresh. Big crypto/news accounts and alert bots (Cointelegraph, Watcher.Guru, etc.) are *good* targets, not noise — their audience sees and retweets the reply. Apply persona special-cases (e.g. `$TURBO`: reply in-tribe, no KAS pivot, no #kaspa tag — `../persona/persona.json` → `stacking_lineup`). If nothing in the pool is reply-worthy, no-op.
4. Draft ONE reply in Mike's **reply voice** (`../persona/persona.json` → `reply_voice`): lowercase opener, conversational, short unless the tweet is analytical, typos-stay register, ~5% reaction-only. Apply the persona's terminology + avoid-in-drafts rules.

### Step 3 — Fire it

Write the chosen reply to `data/auto_reply_pending.json`:

```json
{ "tweet_url": "https://x.com/.../status/...", "reply_text": "<draft in voice>", "author": "@handle", "source": "Following feed | Reply Guy list" }
```

Then:

```
python auto_reply_post.py
```

It posts via the validated `post_reply()` (reused from `post_replies.py`), archives the outcome (`posted` / `already_posted` / `failed`) to `data/posted_replies.json`, and deletes the pending file. It does **not** touch `reply_opportunities.json` or `replies_to_post.json`.

## Guardrails (auto-skip — applied in `auto_reply_scan.py`)

1. **Tweets that are themselves replies** — skipped (best-effort: the scanner drops any article showing a "Replying to …" context line). Only top-level tweets qualify.
2. **Scam / ragebait** — skipped via the `BLOCKLIST` in `auto_reply_scan.py` (airdrop, giveaway, send eth, claim now, like + rt, dm me, etc.). Edit the list there as new patterns appear.
3. **Reply-restricted tweets** — can't be detected from the feed; they fail at post time (`post_reply` returns error → archived `failed`). Per the never-retry rule, leave them. If a tweet repeatedly shows "Only some accounts can reply", that author will never be reply-able.
4. **Already replied** — skipped if the tweet URL is already in `posted_replies.json`; also re-checked live by `already_replied()` at post time.

**NOT skipped — big / news / high-traffic accounts are *preferred* targets.** Cointelegraph, Watcher.Guru, alert bots, and large creators are exactly where a reply gets the most visibility (their audience sees it and retweets). **There is no account skip-list, and there should not be one.** Caveat: the scam/ragebait blocklist (#2) may occasionally drop a legit news tweet that happens to contain a word like "airdrop" or "giveaway" — that's an acceptable miss to avoid replying to actual scams; the selection step (Claude's judgment) is the real arbiter.

## Files

| File | Role |
|---|---|
| `auto_reply_scan.py` | Fast top-of-feed scan → candidates JSON |
| `auto_reply_post.py` | Posts one reply, archives, enforces never-retry |
| `data/auto_reply_candidates.json` | Scanner output (freshest-first; `[]` = no-op) |
| `data/auto_reply_pending.json` | Transient: the one reply about to fire (consumed by the poster) |
| `data/posted_replies.json` | Permanent archive (shared with the curated flow; auto entries flagged `auto_reply: true`) |
| `../persona/persona.json` | Voice source of truth |

## Relationship to the curated reply-guy flow

| | Curated (`CLAUDE.md`) | Auto (this skill) |
|---|---|---|
| Selection | scrape → draft → **user reviews** → queue | scan → draft → **fire immediately** |
| Freshness | any high-signal post | best reply-worthy in last ~1h |
| Review | yes (dashboard / picks) | none |
| Queue files | `reply_opportunities.json` → `replies_to_post.json` | none — transient pending file only |
| Volume | a batch | one per invocation |

Both share `posted_replies.json`, `persona.json`, `post_reply()`, and the **never-retry-failed** rule.

## Throttle note

Auto-replies count against the same X reply budget as the curated flow (~24–30 replies / ~4-hour window before throttle). Since this fires one at a time per invocation, normal task-list cadence stays well under that.
