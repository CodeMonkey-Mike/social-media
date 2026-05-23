---
name: pending-social-posts
description: Show a count of pending (unposted) content across all social platforms. Trigger whenever the user writes `/pending-social-posts`, asks "what's in the queue", "how many posts are pending", or wants a cross-platform pending content summary.
---

## What this skill does

Read all social media queue files and output a tidy count of pending posts per platform and type, with a comparison to the last snapshot.

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
import json

base = r'C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\\'

with open(base + 'x-tweets.json') as f:
    tweets = sum(1 for p in json.load(f).get('tweets', []) if p.get('status') == 'pending')

with open(base + 'x-polls.json') as f:
    x_polls = sum(1 for p in json.load(f).get('polls', []) if p.get('status') == 'pending')

with open(base + 'yt-posts.json') as f:
    yt_posts = sum(1 for p in json.load(f).get('posts', []) if p.get('status') == 'pending')

with open(base + 'yt-text-polls.json') as f:
    yt_polls = sum(1 for p in json.load(f).get('polls', []) if p.get('status') == 'pending')

with open(base + 'ig-single-image.json') as f:
    ig_single = sum(1 for p in json.load(f).get('posts', []) if p.get('status') == 'pending')

with open(base + 'ig-carousel.json') as f:
    ig_carousel = sum(1 for p in json.load(f).get('posts', []) if p.get('status') == 'pending')

with open(base + 'x-threads.json') as f:
    threads = sum(1 for p in json.load(f).get('threads', []) if p.get('status') == 'pending')

total = tweets + x_polls + yt_posts + yt_polls + ig_single + ig_carousel + threads

print(json.dumps({
    "x_tweets": tweets, "x_polls": x_polls,
    "yt_posts": yt_posts, "yt_polls": yt_polls,
    "ig_single": ig_single, "ig_carousel": ig_carousel,
    "threads": threads, "total": total
}))
```

## Output format

Use this exact structure — bold headers, bullet points, italic comparison line:

---

**X / Twitter**
- N pending tweets
- N pending polls

**YouTube**
- N pending community posts
- N pending text polls

**Threads**
- N pending threads

**Instagram**
- N pending single-image posts
- N pending carousels

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
  "x_polls": N,
  "yt_posts": N,
  "yt_polls": N,
  "ig_single": N,
  "ig_carousel": N,
  "threads": N,
  "total": N
}
```
