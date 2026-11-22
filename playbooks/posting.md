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
- Tweets `data/x-tweets.json` → `scripts/post-tweet.js` · threads → `python scripts/post_thread.py` (Python only, JS twin deleted 2026-10-21) · X poll → `post-x-poll.js`
- Shorts `data/shorts.json` (per `platforms.*`) → `post-{yt-short-api, ig-reel, fb-short, tiktok-short, rumble-short, bitchute-short}.js` · X short → `python -u scripts/post_x_short.py` (JS twin retired 2026-11-18)
- YT community `data/yt-posts.json` → `post-yt-community.js` · YT poll `data/yt-text-polls.json` → `post-yt-poll.js`
- AI Engineering Simplified community posts `data/ai-yt-posts.json` → `python scripts/post_yt_community.py --channel ai` (2026-11-17; its own `ai-ytbot-profile`, CDP 9225; run when Mike asks for the AI channel's post, not yet part of a full posting run). The JS `post-yt-community.js` and a bare Python run post the crypto queue as @CodeMonkeyMike
- IG single/carousel → `post-ig-single.js` / `post-ig-carousel.js`
- Longform → `upload-longform-{rumble,bitchute}.js` (folder-based; **update `data/longs.json` status+url manually** after)

## Gotchas (more in SKILL.md operational notes)
- **YT API short:** never pipe through `findstr`/`grep` (EPIPE kills the upload mid-flight). Run plain or in background, then Grep the log file for `Posted ✓`.
- **FB / Rumble** post-upload URL capture can return a STALE (older) video while the fresh one is still processing — verify later, do NOT re-upload on an in-run verify failure.
- **TikTok:** use the manual PowerShell `Start-Process` CDP-9224 workaround (the script's internal spawn fails silently). 50MB limit — re-encode CRF 26 if over, then reset `tiktok.status` to pending.
- **BitChute** longform: PNG/JPG thumbnails only (`.webp` → silent no-op / 15-min loop; the script now hard-fails on it). post-bitchute-short returns a dashboard URL, not the video URL.
- **post-x-poll** posts every poll as 7d intentionally (the `duration` field is a placeholder).
- Count pending across queues: `schedule-tweets/skills/pending-social-posts.md`.
