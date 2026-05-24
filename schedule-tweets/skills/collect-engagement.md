---
name: collect-engagement
description: Collect views for mature tweets/threads, vote results for closed polls, and likes for mature YouTube community posts. Covers all queues.
---

## Overview

Collect engagement data for posted content from all queues, after each item is mature enough to be worth measuring:

- **Views** for X tweets and thread members (48h maturity)
- **Vote results** for X polls (after voting closes)
- **Snapshots** for YouTube text polls (after `capture_results_after_days`)
- **Likes** for YouTube community posts (48h maturity)

## Step 1 — Find eligible items

**From `data/x-tweets.json`:** rows where `status === "posted"`, `posted_at` > 48h ago, `views` is null.

**From `data/x-threads.json`:** individual tweets inside posted threads where the thread's `posted_at` > 48h ago, the tweet's `views` is null, and `posted_url` is set.

**From `data/x-polls.json`:** polls where `status === "posted"`, voting has closed (`posted_at` + `duration` is in the past), `results` is null.

Duration mapping: `5m` → +5 min, `1h` → +1h, `1d` → +24h, `7d` → +168h.

**From `data/yt-text-polls.json`:** polls where `status === "posted"`, `posted_at` + `capture_results_after_days` is in the past, `results` is null.

**From `data/yt-posts.json`:** community posts where `status === "posted"`, `posted_at` > 48h ago, `likes` is null.

If nothing is eligible across all five lists, done.

## Step 2 — Collect via Chrome

**For X tweets and thread members:**
1. If already on x.com, navigate within the SPA (`window.location.assign('URL')` or click the link) — do NOT use the `navigate` tool while on x.com.
2. If not on x.com at all, `navigate` once to the tweet URL directly.
3. Find the view/impression count at the bottom of the tweet and record it (e.g. `14200`).

**For X polls:**
1. Navigate to the poll URL (same SPA rule: click-based within x.com, or `navigate` for first load).
2. The closed poll shows each option with vote count and percentage.
3. Record as a JSON object: `{"Option text": 234, "Option 2 text": 567, ...}` — use exact option strings from the `options` array.

**For YouTube text polls:**
1. Navigate to the poll's `post_url` (YouTube is a separate site — `navigate` is fine).
2. Read the live vote counts from the poll widget.
3. Record as a JSON object using the same exact-string-key approach.

**For YouTube community post likes:**
1. Navigate to the post's `post_url` (YouTube is a separate site — `navigate` is fine).
2. Wait for the page to fully load.
3. Read the like count from the thumbs-up button on the post — it appears as a number next to the thumbs-up icon (e.g. `42`).
4. If the count shows as `0` or is not yet visible, record `0`.
5. Record as an integer (no commas — e.g. `1200`, not `"1,200"`).

## Step 3 — Update the files

- **Single tweets:** write `views` and `views_captured_at` to the matching tweet in `data/x-tweets.json`.
- **Thread tweets:** write `views` and `views_captured_at` to the matching tweet object inside the thread.
- **X polls:** write `results` (vote-count object) and `results_captured_at`; flip `status` to `"closed"`.
- **YT text polls:** write `results` and `results_captured_at`; flip `status` to `"captured"` (the poll itself stays live — this is a snapshot).
- **YT community posts:** write `likes` (integer) and `likes_captured_at` to the matching post in `data/yt-posts.json`. **Keep `status` as `"posted"`** — community-post likes can update over time and may be re-collected; there is no terminal "captured" state.

Save each file only if something actually changed.
