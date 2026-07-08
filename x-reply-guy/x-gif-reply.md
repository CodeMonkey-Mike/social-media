---
name: x-gif-reply
description: How GIF reactions get posted to X. GIFs are part of the single reply queue (data/replies_to_post.json) and are posted by post_replies.py — there is NO separate GIF queue or runner. This doc explains the GIF-picker mechanics (the post_gif_reply.py helper) and how to dry-run.
---

## What this is

GIF reactions to X tweets, posted through X's native GIF picker (Playwright). The text path can only type `reply_text`; a GIF must go through the picker instead.

**One queue, one poster.** GIF, emoji, and text replies all live in `data/replies_to_post.json` and are posted by `post_replies.py`. A GIF entry is just a reply object with a `gif_search` field — `post_replies.py` detects it and calls the `post_gif_reply()` helper in `post_gif_reply.py` (which opens the composer, clicks the GIF button, searches, picks the first tile, and posts). `post_gif_reply.py` is a **helper library, not a standalone runner**.

## Queue file

`x-reply-guy/data/replies_to_post.json` — a GIF entry looks like:

```json
[
  {
    "author": "@handle",
    "tweet_url": "https://x.com/<author>/status/<id>",
    "gif_search": "<search query for X GIF picker>",
    "reaction_only": true
  }
]
```

## Chrome profile

Uses `xbot-profile` — same as `post_replies.py`, `scrape_feed.py`, and the schedule-tweets X scripts. **All Chrome windows must be fully closed before running.**

## How to run

### Step 1 — dry-run (always do this first)

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\x-reply-guy
python post_replies.py --dry-run
```

For GIF entries this launches the browser, attaches each GIF, and screenshots the composer to `tmp-gif-debug/` **without posting**. Review the screenshots to confirm a GIF actually appeared. If a screenshot shows the picker opened but no GIF attached, the selectors need fixing before a real run. (Text/emoji-only queues need no browser — dry-run just previews them.)

### Step 2 — post for real

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\x-reply-guy
python post_replies.py
```

## What happens for a GIF entry

`post_replies.py` calls `post_gif_reply()` (this module) for each entry with a `gif_search` field. That helper:

1. Navigates to the tweet URL.
2. Clicks `[data-testid="reply"]` to open the reply composer.
3. Waits for the tweet textarea to appear.
4. Clicks the GIF button (`[data-testid="gifSearchButton"]` or `button[aria-label="GIF"]`).
5. Types `gif_search` into the picker's search input and waits for results.
6. Clicks the first result tile.
7. Verifies a media attachment appears in the composer (screenshot saved to `tmp-gif-debug/`).
8. If dry-run: stops here. Otherwise clicks Post (`tweetButtonInline` / `tweetButton` via JS).
9. Waits for the composer to close as the submission signal.

`post_replies.py` then archives the outcome to `data/posted_replies.json` (`"result": "posted_gif"` / `"uncertain_gif"`), removes the entry from `data/replies_to_post.json`, and removes it from `data/reply_opportunities.json` — exactly the same lifecycle as text/emoji replies.

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

1. Queue it into `data/replies_to_post.json` (the dashboard "Queue" button does this, carrying `gif_search` through) — the same queue as text/emoji replies.
2. Post with `python post_replies.py` (dry-run first).

## Adding GIF entries from the auto-reply flow

`auto_reply_post.py` detects `gif_search` + `reaction_only: true` in `auto_reply_pending.json` and routes to the GIF poster automatically — no manual queue step needed. See `x-reply-auto.md` for the full auto-reply flow.
