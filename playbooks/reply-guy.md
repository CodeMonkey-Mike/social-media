# Playbook: X reply-guy

**Canonical detail:** `x-reply-guy/CLAUDE.md` (full per-session workflow + the failure-handling rules).
Scripts live in **`x-reply-guy/`** (NOT `schedule-tweets`) — prefix `cd C:\Users\mnede\Documents\Claude\social-media\x-reply-guy &&`.

## Loop
1. **Scrape:** `python scrape_feed.py` → `feed.json` + `following_feed.json`.
2. **Draft:** read the feeds, evaluate vs `persona.json` `engages_with`, write `reply_opportunities.json`
   (overwrite fresh each session — don't append old entries).
3. **Mike picks:** via the dashboard Reply Opp tab (Queue button → `replies_to_post.json`), or write picks directly.
4. **Post:** `python post_replies.py [--limit N] [--dry-run]` — archives every outcome to `posted_replies.json`.

## Hard rules
- **NEVER auto-retry a "failed" reply** — the verify step false-negatives under throttle; the reply has very
  often already posted. Manually open the tweet on X first; retrying creates duplicates.
- **GIF replies return `uncertain`** as normal behavior (composer stays open after Post) — treat as posted; do
  NOT re-run `post_gif_reply.py` without checking the tweet.
- **GIF entries** = `reaction_only: true` + `gif_search: "<query>"`. NEVER put `[GIF: ...]` in `reply_text`
  (it posts the literal string).
- `--limit` is **advisory** (drains the queue) — pre-trim the queue file if precise batch sizing matters.
- Throttle escalates past ~20–25 replies in a ~4h window — split big runs ~6h apart.
