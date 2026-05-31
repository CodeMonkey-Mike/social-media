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

> ⛔ **GIF reactions:** `post_replies.py` ONLY types `reply_text` as text — NEVER put `"[GIF: standing ovation]"` in `reply_text` (it posts that literal string; happened 2026-05-25 → 2 broken replies). For a GIF reaction, set `reaction_only: true` + `gif_search: "<query>"`. Then move the entry to `data/gif_replies_to_post.json` and run the `x-gif-reply` skill (`post_gif_reply.py`). Always dry-run first. `auto_reply_post.py` also handles GIF entries natively: write `gif_search` + `reaction_only: true` to `auto_reply_pending.json` and it routes to the GIF poster automatically.

### 3. User reviews and picks
Present a numbered summary. User picks which replies to queue via the **Reply Opp tab** in the dashboard (http://localhost:8766) — clicking "Queue" on a card moves it to `replies_to_post.json` automatically. Or write picks directly to `replies_to_post.json`.

### 4. Post
```
python post_replies.py              # posts all queued replies
python post_replies.py --limit 5    # posts only the first 5, leaves the rest queued
python post_replies.py --dry-run
```

`post_replies.py` will:
- Post each reply with human typing delays
- **Remove each entry from `replies_to_post.json` immediately after processing** — whether posted, failed, or already_posted. The queue count in the dashboard always reflects what's truly remaining.
- Archive every outcome to `posted_replies.json` (`posted` / `already_posted` / `failed`). `posted_replies.json` is the permanent archive.
- Remove posted entries from `reply_opportunities.json` in real time.

Use `--limit N` to post a subset of a large queue across multiple sessions. All replies stay in `replies_to_post.json` — no manual holdback files needed.

---

## HARD RULE — never auto-retry a failed reply

**If `post_replies.py` marks a reply `failed`, it is NOT automatically requeued. The entry is removed from the queue immediately and archived to `posted_replies.json`.**

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
- `Reply textarea not found` — script never opened the composer. **Almost always means the tweet is reply-restricted.** Verify on X; if you see "Only some accounts can reply" or "Only subscribers can reply," consider removing the author from the Reply Guy list since they'll never be reply-able.

**GIF replies from `post_gif_reply.py` consistently return `uncertain` (`Composer still open after Post — uncertain`).** This is the normal behavior — X does not close the GIF composer immediately after posting, so the composer-closure verify always fails. The queue is cleared regardless. Treat every `uncertain` GIF reply as likely posted. Verify manually on the target tweet if concerned. Do NOT re-run `post_gif_reply.py` without first checking the tweet — duplicates will happen. **Established 2026-05-26 across @SpaceX, @CryptoHayes, and @blknoiz06 (3/3 GIF replies marked `uncertain`, all were live on X).**

---

## File reference

| File | Purpose |
|------|---------|
| `feed.json` | Latest scraped posts from Reply Guy list |
| `following_feed.json` | Scraped posts from Mike's following feed |
| `reply_opportunities.json` | **Pending** reply opportunities only — entries are removed as they are posted or queued via dashboard. Overwritten fresh each session. |
| `replies_to_post.json` | Active queue — entries are removed one at a time as they are processed; use `--limit N` to post a subset across sessions |
| `posted_replies.json` | Permanent archive of all posted replies |
| `../persona/persona.json` | Mike's full voice, style, and terminology rules (project-wide single source of truth — no longer in this folder's `config/`) |

---

## Rate limits
- Replies: no hard daily limit but keep natural cadence; `post_replies.py` adds 2–6 min gaps
