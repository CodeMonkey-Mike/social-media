---
name: x-gif-reply
description: Post GIF reactions to X tweets using the X native GIF picker (Playwright). Reads from data/gif_replies_to_post.json. Always dry-run first to confirm GIF attachment before posting for real.
---

## What this is

The GIF-reply poster for X. Text reply scripts (`post_replies.py`, `auto_reply_post.py`) can only type text — they cannot attach animated GIFs. This script uses the X native GIF picker: opens the reply composer, clicks the GIF button, searches for the query, clicks the first result tile, then posts.

## Queue file

`x-reply-guy/data/gif_replies_to_post.json` — array of:

```json
[
  {
    "tweet_url": "https://x.com/<author>/status/<id>",
    "gif_search": "<search query for X GIF picker>",
    "author": "@handle"
  }
]
```

## Chrome profile

Uses `xbot-profile` — same as `post_replies.py`, `scrape_feed.py`, and the schedule-tweets X scripts. **All Chrome windows must be fully closed before running.**

## How to run

### Step 1 — dry-run (always do this first)

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\x-reply-guy
python post_gif_reply.py --dry-run
```

Attaches the GIF and screenshots the composer to `tmp-gif-debug/` **without posting**. Review the screenshots to confirm a GIF actually appeared. If the screenshots show the picker opened but no GIF attached, the selectors need fixing before a real run.

### Step 2 — post for real

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\x-reply-guy
python post_gif_reply.py
```

## What the script does

1. Reads `data/gif_replies_to_post.json`.
2. For each entry, navigates to the tweet URL.
3. Clicks `[data-testid="reply"]` to open the reply composer.
4. Waits for the tweet textarea to appear.
5. Clicks the GIF button (`[data-testid="gifSearchButton"]` or `button[aria-label="GIF"]`).
6. Types `gif_search` into the picker's search input and waits for results.
7. Clicks the first result tile.
8. Verifies a media attachment appears in the composer (screenshot saved to `tmp-gif-debug/`).
9. If dry-run: stops here. Otherwise clicks Post (`tweetButtonInline` / `tweetButton` via JS).
10. Waits for the composer to close as the submission signal.
11. Archives the outcome to `data/posted_replies.json` (field: `"result": "posted_gif"`).
12. Removes posted entries from `data/gif_replies_to_post.json` (failures stay for manual retry).
13. Also removes posted entries from `data/reply_opportunities.json` (if present).

## Outcome handling

| Result | Meaning |
|---|---|
| `posted` | Composer closed → GIF reply likely live |
| `uncertain` | Post clicked but composer didn't close within timeout — check tweet on X manually |
| `dry_run` | Dry-run mode — GIF attached, not posted |
| `error` | Script failed before posting (screenshot in `tmp-gif-debug/`) |

`uncertain` is the same X-throttle false-negative pattern as text replies — the reply has very likely already posted. **Never re-run on an `uncertain` entry without manually checking the tweet first.**

## Adding GIF entries from the curated reply session

When reviewing `reply_opportunities.json` or the dashboard and an entry has `reaction_only: true` + `gif_search: "..."`:

1. Add to `data/gif_replies_to_post.json` (keep `tweet_url`, `gif_search`, `author`).
2. Run this skill (dry-run first).

## Adding GIF entries from the auto-reply flow

`auto_reply_post.py` detects `gif_search` + `reaction_only: true` in `auto_reply_pending.json` and routes to the GIF poster automatically — no manual queue step needed. See `x-reply-auto.md` for the full auto-reply flow.

## Pending GIF replies (as of 2026-05-25)

Two broken text replies (literal `[GIF: ...]` strings, now deleted from X) need to be re-posted as real GIFs. Both are already in `data/gif_replies_to_post.json`:

- `@blknoiz06` — `https://x.com/blknoiz06/status/2058360798968225853` — query: `"standing ovation crowd cheering"`
- `@inversebrah` — `https://x.com/inversebrah/status/2058516770265440346` — query: `"confused blank stare"`

Dry-run first to verify selectors before posting.
