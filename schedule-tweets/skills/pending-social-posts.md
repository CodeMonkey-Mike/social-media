---
name: pending-social-posts
description: Show a count of pending (unposted) content across all social platforms — text, images, vertical videos, and reply-guy queue. Trigger whenever the user writes `/pending-social-posts`, asks "what's in the queue", "how many posts are pending", or wants a cross-platform pending content summary.
---

## What this skill does

Read all social media queue files and output a tidy count of pending posts per platform and content type, with a comparison to the last snapshot.

Covers everything: X (tweets, threads, polls, vertical videos, replies), YouTube (community posts, text polls, Shorts), Instagram (single-image, carousels, Reels), and the video-only platforms (Facebook, TikTok, Rumble, BitChute).

## Workspace location

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\`

Snapshot file (tracks previous totals): `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\pending-snapshot.json`

## Steps

1. Run the counting script below.
2. Read `data/pending-snapshot.json` if it exists — extract `total` and `timestamp`.
3. Compute delta: previous total minus current total = posts published since last check.
4. Display the formatted summary (see Output Format).
5. Overwrite `data/pending-snapshot.json` with current counts and timestamp.

## Counting script

```python
import json, os

base = r'C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data'
reply_base = r'C:\Users\mnede\Documents\Claude\social-media\x-reply-guy\data'

def count_pending(path, array_key):
    """Count items where status === 'pending' inside a wrapper object."""
    if not os.path.exists(path):
        return 0
    with open(path, encoding='utf-8') as f:
        items = json.load(f).get(array_key, [])
    return sum(1 for p in items if p.get('status') == 'pending')

def count_array_len(path):
    """Reply-guy queue: top-level array, every entry is implicitly pending."""
    if not os.path.exists(path):
        return 0
    with open(path, encoding='utf-8') as f:
        return len(json.load(f))

# X (tweets / threads / polls)
x_tweets    = count_pending(os.path.join(base, 'x-tweets.json'),  'tweets')
x_threads   = count_pending(os.path.join(base, 'x-threads.json'), 'threads')
x_polls     = count_pending(os.path.join(base, 'x-polls.json'),   'polls')

# YouTube (community post / text poll)
yt_posts    = count_pending(os.path.join(base, 'yt-posts.json'),       'posts')
yt_polls    = count_pending(os.path.join(base, 'yt-text-polls.json'),  'polls')

# Instagram (single-image / carousel)
ig_single   = count_pending(os.path.join(base, 'ig-single-image.json'), 'posts')
ig_carousel = count_pending(os.path.join(base, 'ig-carousel.json'),     'posts')

# Vertical videos — shorts.json is one record per video with per-platform status
with open(os.path.join(base, 'shorts.json'), encoding='utf-8') as f:
    shorts = json.load(f).get('shorts', [])

def vertical(platform_key):
    return sum(1 for s in shorts
               if s.get('platforms', {}).get(platform_key, {}).get('status') == 'pending')

x_vertical        = vertical('x')
yt_vertical       = vertical('yt_shorts')
ig_vertical       = vertical('ig_reels')
fb_vertical       = vertical('facebook')
tiktok_vertical   = vertical('tiktok')
rumble_vertical   = vertical('rumble')
bitchute_vertical = vertical('bitchute')

# Reply-guy queue (everything in the array is pending)
x_replies = count_array_len(os.path.join(reply_base, 'replies_to_post.json'))

total = (
    x_tweets + x_threads + x_polls + x_vertical + x_replies
    + yt_posts + yt_polls + yt_vertical
    + ig_single + ig_carousel + ig_vertical
    + fb_vertical + tiktok_vertical + rumble_vertical + bitchute_vertical
)

print(json.dumps({
    "x_tweets": x_tweets, "x_threads": x_threads, "x_polls": x_polls,
    "x_vertical": x_vertical, "x_replies": x_replies,
    "yt_posts": yt_posts, "yt_polls": yt_polls, "yt_vertical": yt_vertical,
    "ig_single": ig_single, "ig_carousel": ig_carousel, "ig_vertical": ig_vertical,
    "fb_vertical": fb_vertical,
    "tiktok_vertical": tiktok_vertical,
    "rumble_vertical": rumble_vertical,
    "bitchute_vertical": bitchute_vertical,
    "total": total,
}))
```

## Output format

Use this exact structure — bold headers, bullet points, italic comparison line. Omit any bullet whose count is `0` for a cleaner read; omit an entire platform section if all its counts are `0`.

---

**X / Twitter**
- N pending tweets
- N pending threads
- N pending polls
- N pending vertical videos
- N pending replies (reply-guy)

**YouTube**
- N pending community posts
- N pending text polls
- N pending vertical videos

**Instagram**
- N pending single-image posts
- N pending carousels
- N pending vertical videos

**Facebook**
- N pending vertical videos

**TikTok**
- N pending vertical videos

**Rumble**
- N pending vertical videos

**BitChute**
- N pending vertical videos

**Total: N pending posts across all platforms.**

*(Down from N last time — we've published N since then.)*

---

Comparison line rules:
- If `data/pending-snapshot.json` existed and total decreased: "Down from N last time — we've published N since then."
- If total increased: "Up from N last time — N new posts added."
- If total unchanged, or no snapshot existed: omit the line.

## Snapshot file format

After displaying, write/overwrite `data/pending-snapshot.json`:

```json
{
  "timestamp": "<ISO 8601 UTC>",
  "x_tweets": N,
  "x_threads": N,
  "x_polls": N,
  "x_vertical": N,
  "x_replies": N,
  "yt_posts": N,
  "yt_polls": N,
  "yt_vertical": N,
  "ig_single": N,
  "ig_carousel": N,
  "ig_vertical": N,
  "fb_vertical": N,
  "tiktok_vertical": N,
  "rumble_vertical": N,
  "bitchute_vertical": N,
  "total": N
}
```

**Backward compatibility:** older snapshots only had `x_tweets`, `x_polls`, `yt_posts`, `yt_polls`, `ig_single`, `ig_carousel`, `threads`, `total`. The delta comparison uses `total` only, so older snapshots still produce a valid "Down from N" line. Overwrite with the new shape on first run.

## Files this skill reads

| File | What it contributes |
|---|---|
| `data/x-tweets.json` | `x_tweets` |
| `data/x-threads.json` | `x_threads` |
| `data/x-polls.json` | `x_polls` |
| `data/yt-posts.json` | `yt_posts` |
| `data/yt-text-polls.json` | `yt_polls` |
| `data/ig-single-image.json` | `ig_single` |
| `data/ig-carousel.json` | `ig_carousel` |
| `data/shorts.json` → `platforms.x` | `x_vertical` |
| `data/shorts.json` → `platforms.yt_shorts` | `yt_vertical` |
| `data/shorts.json` → `platforms.ig_reels` | `ig_vertical` |
| `data/shorts.json` → `platforms.facebook` | `fb_vertical` |
| `data/shorts.json` → `platforms.tiktok` | `tiktok_vertical` |
| `data/shorts.json` → `platforms.rumble` | `rumble_vertical` |
| `data/shorts.json` → `platforms.bitchute` | `bitchute_vertical` |
| `x-reply-guy/data/replies_to_post.json` | `x_replies` (every array entry counts) |

Missing files are treated as zero, not errors — the skill still produces a summary if e.g. the reply-guy folder isn't present.
