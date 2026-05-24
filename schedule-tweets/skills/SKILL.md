# Schedule-Tweets Skills Index

Each capability has its own file in this folder. This file is the index and home for shared operational notes.

---

## Skill files

| File | What it does |
|---|---|
| `dashboard.md` | Start the local dashboard server (port 8766) |
| `bitchute-post-vertical.md` | Post one pending BitChute vertical video |
| `fb-post-vertical.md` | Post one pending Facebook vertical video (Reel) |
| `ig-post-single.md` | Post one pending Instagram single-image post |
| `ig-post-carousel.md` | Post one pending Instagram carousel |
| `ig-post-vertical.md` | Post one pending Instagram vertical video (Reel) |
| `rumble-post-vertical.md` | Post one pending Rumble vertical video |
| `tiktok-post-vertical.md` | Post one pending TikTok vertical video |
| `x-post-tweet.md` | Post one pending X single tweet |
| `x-post-thread.md` | Post one pending X thread (atomic) |
| `x-post-poll.md` | Post one pending X poll |
| `x-post-vertical.md` | Post one pending X vertical video |
| `yt-post-community.md` | Post one pending YouTube community post (with images) |
| `yt-post-poll.md` | Post one pending YouTube text poll |
| `yt-post-vertical.md` | Post one pending YouTube vertical video (Short) — API-preferred, Playwright fallback |
| `rumble-upload-longform.md` | Upload a full-length video to Rumble |
| `bitchute-upload-longform.md` | Upload a full-length video to BitChute |
| `collect-engagement.md` | Collect views and poll results for mature posted content |
| `pending-social-posts.md` | Count pending items across all queues |
| `cleanup-images.md` | Move posted-content images to Recycle Bin |

---

## Queue files → scripts quick reference

| Queue file | Platform | Script |
|---|---|---|
| `data/x-tweets.json` | X single tweet | `scripts/post-tweet.js` |
| `data/x-threads.json` | X thread | `scripts/post-thread.js` |
| `data/x-polls.json` | X poll | `scripts/post-x-poll.js` |
| `data/yt-posts.json` | YouTube community post | `scripts/post-yt-community.js` |
| `data/yt-text-polls.json` | YouTube text poll | `scripts/post-yt-poll.js` |
| `data/ig-single-image.json` | Instagram single | `scripts/post-ig-single.js` |
| `data/ig-carousel.json` | Instagram carousel | `scripts/post-ig-carousel.js` |
| `data/shorts.json` → `platforms.x` | X video short | `scripts/post-x-short.js` |
| `data/shorts.json` → `platforms.yt_shorts` | YouTube Short | `scripts/post-yt-short-api.js` ⭐ |
| `data/shorts.json` → `platforms.ig_reels` | Instagram Reel | `scripts/post-ig-reel.js` |
| `data/shorts.json` → `platforms.facebook` | Facebook Reel | `scripts/post-fb-short.js` |
| `data/shorts.json` → `platforms.tiktok` | TikTok | `scripts/post-tiktok-short.js` |
| `data/shorts.json` → `platforms.rumble` | Rumble short | `scripts/post-rumble-short.js` |
| `data/shorts.json` → `platforms.bitchute` | BitChute short | `scripts/post-bitchute-short.js` |

---

## Chrome profile map

| Profile | Used by |
|---|---|
| `xbot-profile` | post-tweet, post-thread, post-x-poll, post-x-short |
| `ytbot-profile` (CDP 9223) | post-yt-poll, post-yt-short (legacy) |
| `igbot-profile` | post-ig-single, post-ig-reel |
| `fbbot-profile` | post-fb-short |
| `rumblebot-profile` | post-rumble-short, upload-longform-rumble |
| `bitchutebot-profile` | post-bitchute-short, upload-longform-bitchute |
| `chatgpt-profile` | generate-image.js, generate-image-batch.js |
| Main `User Data\Default` (CDP 9224) | post-tiktok-short |

**Profile conflict rule:** two scripts sharing a profile cannot run concurrently. Sequence them.

---

## Master timing reference

| Script | `CHAR_DELAY` | `ACTION` | `PRE_COMPOSE` | `PRE_POST` | URL verify |
|---|---|---|---|---|---|
| `post-tweet.js` | 60–150ms | 4–7s | 60–180s | 5–180s | toast nav |
| `post-thread.js` | 60–150ms | 4–7s | 60–180s | 60–180s | ✓ HTTP + per-tweet text match |
| `post-x-poll.js` | 60–150ms | 4–7s | 60–180s | 5–180s | toast nav |
| `post-yt-poll.js` | 60–150ms | 4–7s | 60–180s | 60–180s | URL fetch |
| `post-ig-single.js` | 5–40ms | 1–5s | 1–15s | reused | URL fetch |
| `post-fb-short.js` | 60–150ms | 4–7s | 60–180s | 60–180s | ✓ HTTP + video |
| `post-tiktok-short.js` | 60–150ms | 4–7s | 60–180s | 60–180s | ✓ HTTP + video |
| `post-x-short.js` | 60–150ms | 4–7s | 60–180s | reused | toast nav |
| `post-yt-short.js` (legacy) | clipboard | 3–6s | none | none | dialog redirect |
| `post-ig-reel.js` | 40–120ms | 3–6s | 15–45s | reused | profile grid |
| `post-rumble-short.js` | 40–120ms | 2–5s | none | none | confirmation |
| `post-bitchute-short.js` | 40–120ms | 3–6s | 10–25s | none | studio dashboard |
| `upload-longform-rumble.js` | 40–120ms | 2–5s | none | none | confirmation |
| `upload-longform-bitchute.js` | 40–120ms | 3–6s | none | none | studio dashboard |

`reused` = script applies `PRE_COMPOSE` range a second time instead of a separate `PRE_POST` constant.

---

## General mechanics rules

- **Never re-post** content already marked `posted` or `closed`.
- **Validate before posting.** X Premium limit is 25,000 chars (not 280). Polls: options 2–4 entries each ≤25 chars, duration in {5m, 1h, 1d, 7d}.
- **Mark `posting` before opening Chrome** (crash safety). A row stuck at `posting` means the previous run died mid-flight — reset it before re-running.
- **Save after every successful post.** The file should always reflect what's actually live.
- **If Chrome is not available or the platform fails to load,** abort — do NOT mark anything as posted.
- **Preserve newlines exactly** when typing into any composer.
- **Never use em dashes (—) in content you add to any queue file** (titles, hooks, captions in `shorts.json`, `x-tweets.json`, etc.). Mike's voice doesn't use them. Use a comma, period, or colon instead. This applies to every caption/title/hook you write.
- **Never use PowerShell `ConvertFrom-Json`/`ConvertTo-Json` on `x-tweets.json`** — PowerShell 5.1 mangles emoji to mojibake. Use Node.js for all JSON edits.
- **Bash `cd` is not persistent across tool calls.** Always prefix every script invocation with `cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets &&`.

---

## Operational notes — 2026-05-22 session

### Reply-guy throttle pattern
X throttles reply activity after ~24–30 replies in a ~4-hour window. Failures cluster at the start of a third batch. Mitigation: split runs >20 replies into two sessions ~6 hours apart.

### `post-x-poll.js` posts all polls as 7d (intentional)
Regardless of the JSON `duration` field. Mike wants all polls at 7 days. The `duration` field is a placeholder.

### `post_replies.py` `--limit` not honored
`--limit 5` drains the full queue. Treat the flag as advisory; pre-trim the queue file if precise batch sizing matters.

### `post-x-short.js` posts even with caption > 280 chars
Script warns but doesn't block. X likely truncates. Maintain a separate `caption_x` field or auto-truncate to ~250 chars.

### `post-bitchute-short.js` returns dashboard URL, not video URL
Writes `url: "https://www.bitchute.com/content"`. To find the specific video, visit the channel manually.

### Reply-guy queue ↔ dashboard reconciliation
When batching N replies from a larger queue, the dashboard X Replies count drops to N. Keep unstaged entries in side files and merge failed retries before loading next batch.

### HARD RULE — never auto-retry a failed reply-guy entry
`post_replies.py` clears the entire queue at end of every run including failures. The verify step returns false-negatives under X throttle — a "failed" reply has very often already posted. Retrying creates duplicates. See `x-reply-guy/CLAUDE.md` for the full rule.

### TikTok 50MB workflow
Re-encoding a 64MB → 26MB at CRF 26 takes ~28s for a 123s video. `ffmpeg -y -i orig.mp4 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k out.mp4`. After compression, reset `platforms.tiktok.status` to `pending` and re-run.

### TikTok CDP-spawn
Default to the manual PowerShell `Start-Process` workaround (documented in `tiktok-post-vertical.md`) — the script's internal `spawn()` of chrome.exe fails silently to open CDP 9224. Skip straight to the workaround.

---

## Operational notes — 2026-05-24 session (40-step posting run)

### Working directory: prefix EVERY command with an explicit `cd`
Background commands do NOT reliably inherit the foreground working directory, and a `cd` earlier in the session leaks into later commands. Several failures this run came from running a script from the wrong folder (e.g. `node scripts/post-fb-short.js` while cwd was `repurpose/`; `python auto_reply_post.py` while cwd was `schedule-tweets/`). RULE: make `cd <full path>` the FIRST token of every command. The reply-guy scripts (`post_replies.py`, `auto_reply_post.py`) live in `social-media/x-reply-guy/`; everything else in `social-media/schedule-tweets/`. Different folder = easy to get wrong.

### NEVER fire a second attempt of a posting script while one may be running
If a posting script seems stuck or you think it failed, do NOT relaunch it. Posting scripts that share a Chrome profile collide: the second launch attaches to the first's Chrome and then closes/kills it, interrupting the in-flight post (observed: an IG single mid-caption got its Chrome killed by a duplicate launch). The discipline: ONE attempt → wait for the completion notification → read the log to see what actually happened → only then decide. The scripts' built-in duplicate pre-checks (IG single/carousel, YT community) will catch a post that already went live and mark it posted without re-posting, but don't rely on that to cover sloppiness.

### ChatGPT image cap is a ~50-per-3-hour rolling window (not just daily)
A concentrated burst of image generation (~87 images this session across b-roll + tweet + carousel batches) trips the cap well before the ~180/day ceiling. The "try again after <time>" message is the rolling-window estimate. Image batches are resumable (they skip already-generated files via `fs.existsSync`), so when capped: kill the batch, keep posting (Lane B needs no generation), and re-run the batch after the window rolls — it finishes only the missing images.

### Reply-guy throttle is real and escalates
X starts false-negative "failed" verifies as cumulative replies climb in a window (this run: 0 fails in the first 4, then 2 of 5, then more across 17). NEVER retry a "failed" reply (it very likely posted; retry duplicates). For big batches, expect rising failures past ~20-25 replies in a window.
