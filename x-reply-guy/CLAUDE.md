# x-reply-guy — Claude Workflow

## Project
Reply-guy automation for @mikeneder. Curated X list of 191 high-signal crypto accounts.
Full context in `reply_guy_project_handoff.md`. Voice/style rules: see the project-wide single source of truth at `../persona/persona.json` (moved out of `config/` so reply-guy and repurpose share one persona).

---

## Workflow (per session)

### 1. Scrape feed
```
python scrape_feed.py
```
Writes top posts to `feed.json` and `following_feed.json` (scored by recency + engagement, 1 post per author).

### 2. Draft reply opportunities
Read `feed.json` and `following_feed.json`. For each post, evaluate against Mike's engages_with list in `persona.json`.
Draft replies using his voice rules. **Overwrite `reply_opportunities.json` with only the new session's entries** — do not append to old content, do not carry over previous entries.

Write a JSON array to `reply_opportunities.json`:
```json
[
  {
    "author": "@handle",
    "tweet_url": "https://x.com/...",
    "tweet_text": "[original tweet text]",
    "source": "For You feed | Following feed | Reply Guy list",
    "why_reply": "[1-2 sentences on relevance]",
    "reply_text": "[draft in Mike's voice]",
    "reaction_only": false
  }
]
```

For reaction-only entries set `"reaction_only": true` and put the emoji/text in `reply_text`.

### 3. User reviews and picks
Present a numbered summary. User picks which replies to queue via the **Reply Opp tab** in the dashboard (http://localhost:8766) — clicking "Queue" on a card moves it to `replies_to_post.json` automatically. Or write picks directly to `replies_to_post.json`.

### 4. Post
```
python post_replies.py          # posts all queued replies
python post_replies.py --dry-run
```

`post_replies.py` will:
- Post each reply with human typing delays
- Archive results to `posted_replies.json` (every outcome: `posted` / `already_posted` / `failed`)
- **Remove each successfully posted entry from `reply_opportunities.json` in real time** — the entry is deleted as soon as it is confirmed posted. `posted_replies.json` is the permanent archive.
- **Clear the ENTIRE queue at end of run — successes AND failures.** See the "HARD RULE — never auto-retry failed replies" section below.

---

## HARD RULE — never auto-retry a failed reply

**If `post_replies.py` marks a reply `failed`, it is NOT automatically requeued. The queue is cleared at end of run regardless of outcome.**

**Why:** the X verify step (loading the tweet page and substring-matching the reply text) returns false-negatives under throttle. A reply marked `failed` has very often actually posted — X is just hiding it from the verify step's view. Treating "failed" as "didn't post" and retrying creates duplicate replies that have to be manually deleted from X.

**Established 2026-05-22 after we double-posted to @TurboToadToken and posted to three other "failed" accounts (@blknoiz06, @natbrunell, @CryptoKaleo) whose replies were already live before retry.**

**How to apply:**
- The script archives every outcome to `posted_replies.json` — review the `result` field there to see what failed.
- For each `failed` entry, **manually open the tweet on X** and check whether the reply already exists.
  - If yes → leave it alone (the post succeeded; only the verify step lied).
  - If no → re-add to `replies_to_post.json` manually with informed judgment. Common genuine-fail causes: reply-restricted tweet ("Only some accounts can reply" / "Only subscribers can reply"), tweet got deleted, network glitch.
- **Never run `post_replies.py` to "retry the queue"** unless you've manually re-curated the entries first.

Two failure patterns that are *always* false-negatives and should never be retried even after manual check:
- `Clicked Post → Reply NOT found on tweet page` — post fired, verify couldn't see it under shadow-filter.
- `Reply textarea not found` — script never opened the composer. **Almost always means the tweet is reply-restricted.** Verify on X; if you see "Only some accounts can reply" or "Only subscribers can reply," remove the author from `add_members.py`'s research list since they'll never be reply-able.

---

## File reference

| File | Purpose |
|------|---------|
| `feed.json` | Latest scraped posts from Reply Guy list |
| `following_feed.json` | Scraped posts from Mike's following feed |
| `reply_opportunities.json` | **Pending** reply opportunities only — entries are removed as they are posted or queued via dashboard. Overwritten fresh each session. |
| `replies_to_post.json` | Active queue — loaded here, cleared after posting |
| `posted_replies.json` | Permanent archive of all posted replies |
| `state.json` | Tracks which accounts have been added to the X list |
| `../persona/persona.json` | Mike's full voice, style, and terminology rules (project-wide single source of truth — no longer in this folder's `config/`) |

---

## Rate limits
- X list member adds: max 10–15/day, 30–60 min between adds (`add_members.py` handles this)
- Replies: no hard daily limit but keep natural cadence; `post_replies.py` adds 2–6 min gaps
