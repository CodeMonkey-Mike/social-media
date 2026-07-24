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
4. Draft ONE reply in Mike's **reply voice** (`../persona/persona.json` → `reply_voice`): lowercase opener, conversational, short unless the tweet is analytical, typos-stay register. Apply the persona's terminology + avoid-in-drafts rules.
   - **Reaction-only check (don't let this silently regress to always-text).** Per `reply_voice.reaction_only`, ~1 in 20 replies is a reaction with no text — a single emoji OR a GIF — reserved for genuinely exciting (🚀) or crazy/unbelievable (😱) tweets. This flow fires one reply at a time, so the quota only lands if you actively apply it: **before defaulting to a text take, ask whether THIS tweet is one of those moments.** If it is, draft it as a reaction (emoji in `reply_text`, or `gif_search` per the GIF shape below) instead of a text reply. If not, write the text reply. Don't force a reaction onto a tweet that warrants a real take.

### Step 3 — Fire it

Write the chosen reply to `data/auto_reply_pending.json` **as a single JSON object — NOT an array.** `auto_reply_post.py` does `pending.get(...)`; a `[ {...} ]` wrapper crashes it with `'list' object has no attribute 'get'` *before* Chrome opens (harmless pre-flight abort, nothing posts — just rewrite as a bare object and re-run). Tripped 2026-06-03.

**Text reply:**
```json
{ "tweet_url": "https://x.com/.../status/...", "reply_text": "<draft in voice>", "author": "@handle", "source": "Following feed | Reply Guy list" }
```

**GIF reaction** (when `reaction_only: true` per persona rules, ~5% of replies):
```json
{ "tweet_url": "https://x.com/.../status/...", "gif_search": "<search query>", "reaction_only": true, "author": "@handle", "source": "Following feed | Reply Guy list" }
```

Never put `"[GIF: ...]"` in `reply_text` — it posts that literal string (happened 2026-05-25). Use the `gif_search` shape above instead; `auto_reply_post.py` detects it and routes to the GIF poster automatically.

Then:

```
python auto_reply_post.py
```

It posts via `post_reply()` (text) or `post_gif_reply()` (GIF), archives the outcome (`posted` / `posted_gif` / `uncertain` / `already_posted` / `failed`) to `data/posted_replies.json`, and deletes the pending file. It does **not** touch `reply_opportunities.json` or `replies_to_post.json`.

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

## ⚠ Read the FULL `tweet_text` before drafting — a truncated preview will get you a MISREAD (2026-06-29)

The scanner stores the full `tweet_text` in `auto_reply_candidates.json`, but it's easy to draft off a **sliced preview** (e.g. a `.slice(0,95)` you printed to pick a candidate) and miss a clause that flips the meaning. This run, Murad's tweet previewed as *"Studying 'Vibe Coding techniques' and 'Agentic Workflows' is cope and a complete waste of time"* — read alone, that looks like he's calling AI agents a fad, and the first draft pushed back on exactly that. The FULL text continued *"...because within 12-24 months that will be fully [automated]"* — i.e. he's **pro**-AI-progress, arguing the manual technique gets automated away. The first reply was a misread of a truncated snippet; caught it by reading `c.tweet_text` in full before firing and rewrote to engage his actual point (the orchestration/verification skill survives even when the technique automates). **RULE: before drafting, print/read the ENTIRE `tweet_text` of the chosen candidate (not a slice); after drafting, re-read the full tweet and confirm your take answers what was actually said.** An unseen auto-fire built on a half-read tweet is the worst failure mode (cf. the 2026-06-11 "skip the cryptic one" note).

## Throttle note

Auto-replies count against the same X reply budget as the curated flow (~24–30 replies / ~4-hour window before throttle). Since this fires one at a time per invocation, normal task-list cadence stays well under that.

## ⚠ Skip a candidate that is a NEWS ACCOUNT COVERING THE TWEET YOU ALREADY REPLIED TO (2026-07-22)

The already-replied guardrail (#4 above) matches on **tweet URL**, so it cannot catch the case where a news account reports on a statement you replied to at the source minutes earlier. Different URL, different author, **same story**.

Seen 2026-07-22: run-1 replied to @SenLummis's own CLARITY Act post; run-2's candidate pool then surfaced Cointelegraph's writeup of that exact statement. Replying to both would have read as Mike repeating himself on one news item inside an hour, to overlapping audiences.

**Rule:** before drafting, check the chosen candidate's *subject* against the recent entries in `posted_replies.json` (not just their URLs). If it is the same underlying story as a reply already fired in this session, pick the next candidate instead. This matters most when a run has just published a batch on that topic, since that is exactly when the on-thesis story is both most tempting and most likely to be duplicated across accounts.

**Related:** also vary the ANGLE when replying to an account you have replied to recently. Same run, @MartyBent drew a Jevons-paradox take specifically because the grid-flexibility take had been used on that same account on 2026-07-21.
