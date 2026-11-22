# Playbook: posting (publish queued content)

**Canonical detail** (full queue→script table, Chrome profile map, timing reference, operational notes):
`schedule-tweets/skills/SKILL.md`. **Per-platform steps:** the matching `schedule-tweets/skills/<platform>-*.md`.

## Always
- Make `cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets &&` the **FIRST token** of every command (cwd doesn't persist; wrong-folder runs are a top failure cause).
- **Sequential only** — one script at a time, in the given order. Never parallel, for any reason.
- **One attempt** — if a script looks stuck, READ THE LOG; never relaunch (a second launch on the same Chrome profile attaches to and kills the first, interrupting the in-flight post).
- Mark the row `posting` before opening Chrome (crash marker). A row stuck at `posting` = a prior run died — reset before re-running.
- Never re-post `posted`/`closed`. Save the queue file after every successful post.

## Queue → script (full table in SKILL.md)
- **Every script is Python: `python -u scripts/<name>.py`.** All JavaScript in `schedule-tweets/scripts/` was deleted 2026-11-22, so there is no `node` command and no JS fallback. Which posters have posted live and which are on their first run: the live-proof ledger in `SKILL.md`.
- Tweets `data/x-tweets.json` → `post_tweet.py` · threads → `post_thread.py` · X poll → `post_x_poll.py`
- Shorts `data/shorts.json` (per `platforms.*`) → `post_yt_short_api.py` (API only), `post_ig_reel.py`, `post_fb_short.py`, `post_tiktok_short.py`, `post_rumble_short.py`, `post_bitchute_short.py`, `post_x_short.py`
- YT community `data/yt-posts.json` → `post_yt_community.py` · YT poll `data/yt-text-polls.json` → `post_yt_poll.py` · YT quiz `data/yt-quizzes.json` → `post_yt_quiz.py`
- AI Engineering Simplified community posts `data/ai-yt-posts.json` → `python -u scripts/post_yt_community.py --channel ai` (2026-11-17; its own `ai-ytbot-profile`, CDP 9225; run when Mike asks for the AI channel's post, not yet part of a full posting run). A bare run, with no `--channel`, posts the crypto queue as @CodeMonkeyMike
- IG single/carousel → `post_ig_single.py` / `post_ig_carousel.py`
- Longform → `upload_longform_{rumble,bitchute,facebook}.py` (folder-based; **update `data/longs.json` status+url manually** after)

## Gotchas (more in SKILL.md operational notes)
- **YT API short:** never pipe through `findstr`/`grep` (EPIPE kills the upload mid-flight). Run plain or in background, then Grep the log file for `Posted ✓`.
- **FB / Rumble** post-upload URL capture can return a STALE (older) video while the fresh one is still processing — verify later, do NOT re-upload on an in-run verify failure.
- **TikTok:** use the manual PowerShell `Start-Process` CDP-9224 workaround (the script's internal spawn fails silently). 50MB limit — re-encode CRF 26 if over, then reset `tiktok.status` to pending.
- **BitChute** longform: PNG/JPG thumbnails only (`.webp` → silent no-op / 15-min loop; the script now hard-fails on it). post_bitchute_short.py returns a dashboard URL, not the video URL.
- **post_x_poll.py** posts every poll as 7d intentionally (the `duration` field is a placeholder).
- Count pending across queues: `schedule-tweets/skills/pending-social-posts.md`.
