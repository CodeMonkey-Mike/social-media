---
name: dashboard
description: Start the local dashboard server that shows pending/posted content across all queues.
---

## What it is

A browser-based dashboard at `http://localhost:8766` that shows all pending and posted content across every queue (X tweets, threads, polls, IG, YT, shorts, reply-guy).

## How to start

```powershell
Start-Process python -ArgumentList "C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\scripts\serve_dashboard.py" -WindowStyle Hidden
Start-Process "http://localhost:8766"
```

Or run in the foreground (shows request logs):

```powershell
python C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\scripts\serve_dashboard.py
```

**Port:** 8766
**Server file:** `schedule-tweets/scripts/serve_dashboard.py`
**Dashboard HTML:** `schedule-tweets/index.html`

## What the server does

- Serves `index.html` and all static files from `schedule-tweets/` at `/`
- Routes `/x-reply-guy/...` GET requests to `../x-reply-guy/` on disk
- Handles POST `/x-reply-guy/queue` — appends an entry to `replies_to_post.json` and removes it from `reply_opportunities.json`
- CORS headers on all responses

## Tabs in the dashboard

| Tab | Source file |
|---|---|
| Tweets | `data/x-tweets.json` |
| Threads | `data/x-threads.json` |
| X Polls | `data/x-polls.json` |
| YT Posts | `data/yt-posts.json` |
| YT Polls | `data/yt-text-polls.json` |
| IG Single | `data/ig-single-image.json` |
| IG Carousel | `data/ig-carousel.json` |
| X Replies | `x-reply-guy/data/replies_to_post.json` |
| Reply Opps | `x-reply-guy/data/reply_opportunities.json` |
| Shorts | `data/shorts.json` |

## Stopping the server

```powershell
Stop-Process -Name python -ErrorAction SilentlyContinue
```
