# Schedule-Tweets Skills Index

Each capability has its own file in this folder. This file is the index and home for shared operational notes.

---

## HARD RULE: Sequential execution only

**Always run posting scripts one at a time, in the order given. Never run two scripts in parallel for any reason** — not because of Chrome profiles, not for throughput, not for any technical justification. If the user provides a task list, execute each step sequentially and wait for it to complete before starting the next one. This rule has no exceptions.

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

### `post-bitchute-short.js` now captures the REAL video URL (updated 2026-06-03)
~~Writes `url: "https://www.bitchute.com/content"` (dashboard, not the video).~~ The short script now derives the real URL from the `upload_code` in the upload page query string → `https://www.bitchute.com/video/<upload_code>/`, then **confirms liveness** by fetching that URL and matching `og:title`. Both pass-1 and pass-2 shorts this run wrote a real `…/video/<id>/` URL with `liveness confirmed`. **Note the gap:** `upload-longform-bitchute.js` still writes the bare `…/content` dashboard URL — for longform, derive the real URL the same way (grab the `upload_code` from the upload-page URL the script logs, build `…/video/<code>/`) and write that back to `longs.json` manually. (Did exactly this for the 2026-06-03 longform.)

### Reply-guy queue ↔ dashboard reconciliation
When batching N replies from a larger queue, the dashboard X Replies count drops to N. Keep unstaged entries in side files and merge failed retries before loading next batch.

### HARD RULE — never auto-retry a failed reply-guy entry
`post_replies.py` clears the entire queue at end of every run including failures. The verify step returns false-negatives under X throttle — a "failed" reply has very often already posted. Retrying creates duplicates. See `x-reply-guy/CLAUDE.md` for the full rule.

### TikTok 50MB workflow
Re-encoding a 64MB → 26MB at CRF 26 takes ~28s for a 123s video. `ffmpeg -y -i orig.mp4 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k out.mp4`. After compression, reset `platforms.tiktok.status` to `pending` and re-run.

### TikTok CDP-spawn
~~Default to the manual PowerShell `Start-Process` workaround — the script's internal `spawn()` fails silently to open CDP 9224.~~ **SUPERSEDED 2026-06-03:** the script's own CDP spawn now works reliably (`Chrome ready on CDP 9224 ✓` first try, twice in one run). Just **kill all Chrome first** (`Stop-Process -Name chrome -Force; Start-Sleep 3`) then run `node scripts/post-tiktok-short.js` — no manual `Start-Process` needed. Per `tiktok-post-vertical.md` (canonical). Only fall back to the manual launch if the script logs a CDP-connect hang.

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

---

## Operational notes — 2026-05-25 session (37-step run)

### ⛔ Closing a Chrome profile: use Get-CimInstance, NOT Get-Process
In Windows PowerShell 5.1, `Get-Process chrome` objects do NOT populate `.CommandLine` (it's always `$null`), so `Get-Process chrome | Where-Object { $_.CommandLine -like "*xbot-profile*" }` matches NOTHING — a silent no-op. This bit us: a per-profile "kill" appeared to succeed every time but actually killed nothing; lingering xbot Chrome from a prior step then blocked `post-x-short.js` with `launchPersistentContext: ... browser has been closed` / `Opening in existing browser session`. CORRECT per-profile close:
```powershell
Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" | Where-Object { $_.CommandLine -like "*xbot-profile*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```
Then re-query the same way to VERIFY zero remain. (Most scripts self-close on success, which is why the no-op went unnoticed for many steps.)

### IG create-flow "regression" — RESOLVED 2026-05-25 (was a blocking modal, not selectors)
Symptom: all three IG image/video scripts (`post-ig-single.js`, `post-ig-reel.js`, `post-ig-carousel.js`) timed out waiting for `input[type="file"]` after Create → "Post". ROOT CAUSE (found via `scripts/_diag-ig-create.js`, which dumps dialogs/clickables at each step): IG pops a **"Turn on Notifications" modal** on load that traps focus and blocks the Create flow — the Post sub-link never appears and the file input is never injected. It was NOT a selector change. FIX: added `dismissBlockingDialogs(page)` (clicks **"Not Now"**, up to 2x) right after home-load AND before the Create click, in all three scripts. Verified: 3 singles + 1 carousel + 2 reels all posted clean afterward. **Lesson:** when an IG script dies at the file-input step, FIRST suspect a new blocking modal (notifications / "save login info" / cookie / consent) and dump the DOM with `_diag-ig-create.js` BEFORE assuming a selector broke. Keep that diagnostic around.

### Longform scripts do NOT write back to longs.json
`upload-longform-{rumble,bitchute,facebook}.js` now source the next-pending entry **directly from `longs.json`** (via `scripts/lib/longform-queue.js` → `pickNextLongform('<plat>')`); no more copying files into `longform/` root. They still never WRITE status back — after each confirmed upload, manually set `longs.json` → `platforms.<plat>.status = posted` + url. Re-running before that flip re-picks the SAME pending entry, so update status promptly to avoid a duplicate upload.

### FB & Rumble post-upload URL capture returns a STALE video right after upload
`post-fb-short.js`, `upload-longform-facebook.js`, `post-rumble-short.js` capture "most recent channel video" immediately after submit — but a fresh upload is still processing and not yet listed, so the scrape returns an OLDER video (FB short #2 verify "failed" and Rumble short URL pointed at the just-uploaded longform). The post is usually LIVE; the in-run verify is a false negative. Confirm later with `scripts/check-fb-longform.js` (read-only; match by DURATION — e.g. 0:50 ≈ a 49s short, 1:10:04 = the 4204s longform) and only then record the real URL. Do NOT re-upload on an in-run verify failure (duplicate risk).

### YT API short: never pipe through findstr/grep
`node scripts/post-yt-short-api.js | findstr ...` breaks: findstr exits, node gets EPIPE on its first "uploaded X MB" progress write and dies mid-upload, leaving the row stuck `posting` with nothing on YouTube. Run it plain (or `run_in_background`) and `Grep` the output FILE afterward for the `Posted ✓` line. Reset the stuck `posting` row before re-running.

### GIF replies need `gif_search`, never `[GIF: ...]` in reply_text
`post_replies.py` ONLY types `reply_text` as text. NEVER put `"[GIF: standing ovation]"` in `reply_text` — it posts that literal string (happened twice 2026-05-25 → 2 broken replies). The correct shape is `reaction_only: true` + `gif_search: "<query>"`. Post via `x-reply-guy/post_gif_reply.py` (the `x-gif-reply` skill) — dry-run first. `auto_reply_post.py` also routes GIF entries natively when `gif_search` + `reaction_only: true` are set in `auto_reply_pending.json`.

---

## Operational notes — 2026-06-06 session (31-step run)

### FB short URL race writes a PINNED video URL for EVERY short (not just stale-by-seconds)
This run, two FB shorts posted in different passes both captured the **identical** URL `…/videos/2953505814991391`, and a scan of `shorts.json` shows that same id (plus `…/967567666181256`) written across MANY FB shorts from prior runs. Root cause refinement: the `/videos` tab's first entry is a **pinned/fixed video** that always lists first, so `post-fb-short.js`'s "most recent video" capture grabs it for every upload while the real new reel is still processing. The genuine reel shows up lower in the list as `…/reel/<id>` (this run: pass-1 Saylor ≈ `reel/1529854128491149`, pass-2 Wiseman ≈ `reel/1639985307558720`). **The post IS live; the recorded URL is wrong.** Verify/fix later with `scripts/inspect-fb-video.js` / `check-fb-longform.js` (match by DURATION) and write the real `…/reel/<id>` back. Never re-upload on this (duplicate risk).

### A backlog of `posted_unverified` Rumble URLs accumulates — sweep periodically
Rumble shorts almost always finish the run as `posted_unverified` because liveness can't confirm within the in-run window (the just-uploaded short is still processing and `/account/content` shows the previous short's title against the captured `/shorts/v<id>`). Over many runs this leaves a pile of unverified rows. They're live; the URL just isn't confirmed. Fix with the purpose-built **`scripts/recapture-rumble-url.js <short-id>`** (read-only on Rumble, only rewrites the URL/status in `shorts.json`, never re-uploads). Worth a periodic batch sweep over all `rumble.status == posted_unverified` rows rather than per-run.

### "353x" content note — all 7 vertical platforms cycle the SAME video per pass
This run's pass-1 posted the "Saylor sold a fraction of a percent" short to all 7 platforms; pass-2 posted "Kaspa Wiseman #1: fair launch" to all 7. The shorts queue advances one video per platform per invocation, so a two-pass run = the next two pending videos fanned across every platform. Expected behavior, noted so the repetition in a run log isn't mistaken for a stuck queue.

---

## Operational notes — 2026-06-07 session (31-step run)

### ⚠ `post-x-poll.js` FAILED at the poll widget — `selectPollDays` selector timeout (likely an X UI change)
The script typed the tweet text fine, then `Opening poll widget...` timed out after 10s waiting for `[data-testid="selectPollDays"]` — so it **never clicked Post; nothing went live** (no duplicate risk). It marked the poll `failed`; I reset it to `pending`. The "add poll" button or the poll-days dropdown selector has likely changed in X's composer. **Before the next poll run, open `post-x-poll.js` and re-verify the poll-button + `selectPollDays`/duration selectors against the live composer** (the tweet/text path still works; only the poll-widget step broke). Single clean pre-post failure, so a one-shot retry after fixing the selector is safe.

### Per-platform short pointers DIVERGE — the "same video per pass" assumption is not always true
Contrary to the 2026-06-06 note above: this run, pass-1 Rumble posted "Kaspa Wiseman #1" while BitChute/YT/etc. posted "The Jobs Report That Broke Bitcoin" (a short I had just manually reordered to pending #1). Each platform's "post next" independently picks the **array-first short with THAT platform still `pending`**, so after a manual reorder (or whenever platforms are at different positions from past partial runs) the platforms can post **different** videos in the same pass. This is correct behavior — do NOT treat the mismatch as a bug or a stuck queue. (The reordered #1 short does reach every platform, just spread across passes.)

### BitChute longform real URL IS derivable in-run (confirms the open gap is closeable)
`upload-longform-bitchute.js` logs `Upload page: https://up111.bitchute.com/videos/upload/?upload_code=<CODE>&...` then writes the bare `…/content` URL. The real URL = `https://www.bitchute.com/video/<CODE>/` (the `upload_code` == the video id). This run: grabbed `mzQaEqgHECvP` from the log line and wrote `…/video/mzQaEqgHECvP/` back to `longs.json` manually. Worth folding into the script later. (Rumble longform this run captured the REAL direct link on its own — `…/v7aydpi-…the-four-year-cycle-dilemma….html` — no stale-URL issue that time.)

### Longform staging recap — OBSOLETE (superseded by the longs.json-direct refactor)
The upload scripts now read `longs.json` directly (`scripts/lib/longform-queue.js`) and upload each entry's own `video_path`/`thumbnail_path` straight from its `longform/<source>/` subfolder. The old procedure (`cp` the #1-pending long's mp4+png into `longform/` root, `touch` them so they're most-recent, write a fresh root `metadata.json`) is GONE — **do not stage anything to root.** Just ensure the entry is `pending` for the platform and its files exist in the subfolder, run the script, then set each `longs.json` platform `status=posted`+url manually.

---

## Operational notes — 2026-06-08 session (31-step run)

### ✅ `post-x-poll.js` `selectPollDays` timeout — ROOT-CAUSED + FIXED 2026-06-08 (it was NEVER a selector problem)
Symptom (2026-06-07 and 2026-06-08): typed the tweet text fine, then `Opening poll widget...` → 10s timeout on `[data-testid="selectPollDays"]`; nothing posted (clean pre-post fail). **Recapture diagnostic (`scripts/_diag-x-poll-selectors.js`) proved every poll selector is UNCHANGED** — `selectPollDays/Hours/Minutes` are still `<select>` elements, `addPollChoice`/`removePollButton` still exist, choice inputs are `input[name="Choice1/2"]` (still matched by `input[type="text"]:not([data-testid]):not([placeholder])`). The widget simply never opened because **the click on `createPollButton` never landed on the button.** Playwright's actionability log showed the real culprit: a transparent full-cover **dropzone overlay** — `div[class*="r-1xcajam"]` (`position:absolute; inset:0`, X's drag-drop file target) — sits on top of the composer and **intercepts all pointer events**. So the old raw `mouseClick()` (`page.mouse.click()` at the button's center) hit the overlay, not the poll button. (A quick diagnostic click sometimes works because the overlay settles in a beat later — don't be fooled.)

**Fix applied (selectors untouched):**
- Added `robustClick(locator)` helper: try `locator.click({timeout:5000})`, on failure fall back to `locator.evaluate(el => el.click())` (native JS click dispatches straight to the element; React's delegated `onClick` still fires; bypasses the overlay). Used for the **poll button** and **add-choice button** (both target a `:visible` instance — a hidden duplicate `createPollButton` exists in the DOM).
- Choice inputs: use `input.fill(text)` + `inputValue()` verify, NOT click()+`typeHuman`. `fill()` focuses and sets the value without a pointer hit-test (overlay-proof). Click-to-focus was unreliable under the overlay and left option 2 empty once → invalid poll → Post button stayed disabled.
- Post button + `setPollDuration` (selectOption) were already overlay-safe (native JS click / DOM API) — left as-is.

Validated end-to-end 2026-06-08: posted `poll-2026-06-07-kaspa-top-10-2027` live (x.com/mikeneder/status/2063990805560168593). Log shows "poll button: normal click blocked ... using JS click" then all options fill + Post fires. **X polls work again — no need to skip them.** NOTE: any OTHER toolbar action that uses raw-coordinate clicking (in this or sibling scripts) is vulnerable to the same overlay — prefer `robustClick`/`fill`/native JS click in the composer.

### ✅ `upload-longform-facebook.js` now captures the REAL URL (baseline-diff) — longform FB stale-URL gap is CLOSED
The FB **longform** script now snapshots existing video/reel IDs *before* upload ("baseline: N existing IDs"), then polls post-submit for the NEW id and verifies it (HTTP 200 + player). This run it returned a genuine `…/reel/1048715867542293/`, verified live — NO stale/pinned URL. So the longform FB URL no longer needs manual correction. **The FB SHORT script (`post-fb-short.js`) does NOT have this fix yet** — see next note. (Worth porting the baseline-diff capture from the longform script into the short script.)

### `post-fb-short.js` STILL writes the pinned `…/videos/2953505814991391` for every short (confirmed both passes)
Both pass-1 and pass-2 FB shorts captured the identical pinned URL `…/videos/2953505814991391` even though each reel posted live (HTTP 200). The real reels were lower in the list as `…/reel/<id>` (pass-1: `1016124894215201`, pass-2: `1140023045860649`). Same root cause as 2026-06-06: the `/videos` tab's first entry is a pinned video. **The post IS live; the saved URL is wrong.** Fix later via the FB URL sweep (`inspect-fb-video.js` / `check-fb-longform.js`, match by DURATION), never re-upload. Real fix = port the longform baseline-diff capture into `post-fb-short.js`.

### `post-thread.js` snippet-verify can false-negative even when ALL articles are present
A 7-tweet thread posted live (root URL captured, page showed **7 tweet articles, expected 7**), but the script's text-snippet matcher only matched 6/7 and marked the thread `failed`. The thread was fully live — one snippet just didn't substring-match (emoji/wrapping/truncation). **Reconcile, don't re-post** (re-posting duplicates the whole thread): if `Found N articles == expected N`, set `status=posted` + keep `thread_root_url` and clear the error. Only treat as a real partial if the article COUNT is short.

### BitChute longform real-URL derivation confirmed again (procedure is reliable)
`upload-longform-bitchute.js` logged `upload_code=Mndf20Js8bMZ` → wrote `https://www.bitchute.com/video/Mndf20Js8bMZ/` back to `longs.json` manually; liveness fine. Same procedure as 2026-06-07. Still worth folding into the script.

### Run hygiene that worked cleanly all 31 steps
Background-launch each posting script, wait for the completion notification, read the log, reconcile, then start the next (strict sequential). `Stop-Process -Name chrome -Force` before every profile switch (TikTok CDP spawn, x-reply-auto, and after each longform upload since those leave Chrome open 5 min). `serve_dashboard.py` is a plain static server (only writes the reply-guy queue on a browser POST) — it does NOT clobber `shorts.json`/`longs.json`/`x-*.json`, so it's safe to leave running during a posting run.

---

## Operational notes — 2026-06-09 session

### ✅ Parallel "lane": image generation CAN run concurrently with the posting run — use PER-PROFILE Chrome kills, never kill-all
`gen-images.js` (carousel/image regen) runs on its own **`chatgpt-profile`** Chrome, which is distinct from every posting profile (xbot/ytbot/igbot/fbbot/rumblebot/bitchutebot/main-Default). So a regen lane and the posting lane can run **at the same time** — Chrome supports multiple concurrent `--user-data-dir`s. The ONE thing that breaks it: the default `Stop-Process -Name chrome -Force` (kill-all) nukes the gen lane mid-generation. **While a background gen lane is running, switch the posting steps to per-profile kills** (the `Get-CimInstance Win32_Process … CommandLine -like "*<profile>-profile*"` form from the 2026-05-25 note), so you only kill the step's own profile. For the TikTok step (needs main-Default + CDP 9224, normally wants kill-all), kill all chrome **except** chatgpt-profile: `Get-CimInstance … | Where-Object { $_.CommandLine -notlike "*chatgpt-profile*" } | Stop-Process`. Validated this run: 15-slide `gen-images.js` regen ran start-to-finish in the background across ~8 posting steps (X tweet → thread → 7-platform short fan-out incl. TikTok CDP spawn) with zero collisions. `gen-images.js` closes its own Chrome on completion, lifting the constraint for the rest of the run.

### YT shorts fell one behind after posting a previously-missed short out of order
A YT short that was supposed to post the night before had never run (no error/stuck-status — the step simply wasn't reached). Posting it first this session put YouTube's per-platform pointer **one behind** the other 6 platforms (each platform independently posts the array-first short still `pending` for THAT platform — see 2026-06-07 note). Fix is trivial and safe: the next-pending YT short IS the catch-up video, so just run `post-yt-short-api.js` one extra time to resync. No special targeting needed; confirm by checking which video is array-first-`yt_shorts:pending` in `shorts.json` before running.

### `post-fb-short.js` STILL writes the pinned `…/videos/1296481415588836` (unchanged — port the longform baseline-diff fix)
Confirmed again: pass-2 FB short captured the pinned `…/videos/1296481415588836` (real reel is live but lower in the list). The longform FB script's baseline-diff capture works correctly (both longforms this run got real `…/reel/<id>` URLs verified live); the SHORT script still needs that fix ported. Live post, wrong saved URL — fix via the FB URL sweep, never re-upload.

---

## Operational notes — 2026-06-10 session (31-step run, 21 active)

### ✅ `post-yt-poll.js` failed mid-run then was ROOT-CAUSED + FIXED same day (NOT a DOM change)
Symptom: typed the question, clicked `#poll-button button` (attachment opened inline), filled option 1 → `host.value="null" ⚠`, then 30s timeout on `#add-option button` adding field 2. Nothing posted (clean pre-post fail); reset row to `pending`. A read-only diagnostic (`scripts/_diag-yt-poll-selectors.js`) proved **all selectors are unchanged** — the bug was the option-fill METHOD: a raw coordinate `page.mouse.click(host-center)` missed the input (each row is `[remove-X][input]`), so text never landed and the widget degraded, cascading into the add-option hang. **Fix:** target the inner `<input>` (`tp-yt-paper-input.poll-option-input input`), focus via `robustClick` (Playwright click → native JS click fallback), type real keystrokes, verify per-option `inputValue()`, add fields via `robustClick` on `#add-option button`. Validated live (kaspa-$3 poll, 3 options, all ✓). Full writeup in `yt-post-poll.md` top banner.

### FB short pinned-URL bug confirmed AGAIN (both passes) — heuristic still reliable
Pass-1 (ai-dwarfs) and pass-2 (saylor-fraction-panic) FB shorts both captured the same pinned `…/videos/1296481415588836`; real reels were the topmost `/reel/` each time (pass-1 `2543966769409341`, pass-2 `1325621129542003`, with pass-1's reel demoting to position 3 on pass-2 — the documented pattern). Manually corrected both to the topmost `/reel/`. Still needs the longform baseline-diff capture ported into `post-fb-short.js`.

### Per-platform pointer divergence is real this run — Rumble/BitChute/X/IG/YT/TikTok advanced to `pippin-85x` on pass 2, but FB advanced to `saylor-fraction-panic`
FB was one behind from prior partial runs, so its pass-2 "next pending" was a different video than the other six. Expected per the 2026-06-07 note (each platform independently posts its own array-first `pending`). Not a bug; don't try to "resync" by hand.

### Rumble shorts both ended `posted_unverified` (normal) — sweep later
Pass-1 `v7b1ack`, pass-2 `v7b2u04`. Liveness showed the *previous* short's title during the in-run check (still processing). They're live; recapture with `scripts/recapture-rumble-url.js <id>` in a periodic sweep.

### Clean all-platform run otherwise
Strict sequential, one attempt each, `Stop-Process -Name chrome -Force` before every profile switch. BitChute both passes: liveness-confirmed in-window. TikTok CDP 9224 spawn worked first try both passes. YT community (both, with the edited winter-accumulation body 1st), X thread (6/6 verified), X short, IG reel + single, YT shorts via API — all clean. x-reply-auto: #1 no-op (nothing < 1h old), #2 posted a $TAO take to @taostats (confirmed live). Empty queues skipped: X tweets, X polls, all 3 longform uploads, IG carousel, reply-guy `replies_to_post.json`.

---

## Operational notes — 2026-06-11 session (30-step run)

### ⚠ `post-bitchute-short.js` publish flow is NON-DETERMINISTIC — same channel, back-to-back uploads took DIFFERENT paths
This run the BitChute short script behaved differently on its two passes **with no code/selector change between them** (same session, same `bitchutebot-profile`, ~30 min apart):
- **Pass-1 (FAILED → draft):** after the first Proceed it found the **"Publish Right Away" checkbox** (the two-Proceed flow), clicked the second Proceed, then hit the **missing-thumbnail modal 3×** (the documented failure mode), couldn't confirm, and correctly marked the row `failed` with the draft-needs-manual-publish error. The video uploaded as a DRAFT (`upload_code` in the log, e.g. `Ea57YzvgEXYm`) and must be published by hand from BitChute Studio.
- **Pass-2 (SUCCEEDED):** after the first Proceed there was **No publish checkbox found** (`locator.waitFor: Timeout 8000ms`), the script fell through to its "single Proceed flow" branch, got the `/content` redirect, derived the real URL from `upload_code`, and **liveness-confirmed** via og:title.

**Takeaways:** (1) A BitChute short `failed` is NOT necessarily a code regression — the two-Proceed/missing-thumbnail path is a real server-side variant that the same script will sometimes dodge. (2) The script's `failed`-status write is correct and self-protecting: it keeps the row out of `pending` so the next pass advances to the *next* short (no duplicate) — BitChute just falls one behind, and the drafted short must be published manually. (3) **Never re-run on a BitChute `failed`** — the draft already exists; re-running re-uploads. (4) The "single-Proceed branch" is the happy path; the missing-thumbnail loop only bites the two-Proceed-checkbox variant. Worth hardening pass-1's path: re-grab the thumbnail with a longer settle BEFORE the second Proceed, or detect the checkbox-variant earlier.

### ✅ ROOT-CAUSE UPDATE (later same day) — the THUMBNAIL is NOT the blocker; the publish-flow VARIANT is. Plus: failed attempts leave NO draft.
Tried to "fix" the missing-thumbnail failure by uploading a custom thumbnail image to BitChute's dedicated input (`input[type="file"][accept*="image"]`, name `thumbnailInput`, a FilePond uploader — added `ensureThumbFile()` via ffmpeg frame-0 still + `uploadCustomThumbnail()` to `post-bitchute-short.js`). **It did not fix it**, and a publish-flow diagnostic (`scripts/_diag-bitchute-publish.js`) explained why:
- A run that took the **single-Proceed variant published successfully to `/content` with NO registered thumbnail at all** (`hidden input[name=thumbnailInput].value` stayed `"undefined"`, processing never completed) **and no modal**. So a thumbnail is **not required** to publish — the two-Proceed/"Publish Right Away" variant just *behaves* as if it is (the modal it throws matches our loose `/try again/i` detector).
- The custom-thumbnail upload **never reaches BitChute's server** via Playwright `setInputFiles` — the FilePond *item* renders locally (so `.filepond--item` exists → my "custom-upload ✓" was a FALSE POSITIVE) but the async server upload doesn't fire, so `thumbnailInput`'s hidden value never populates. Don't trust the filepond-item signal; the only true "thumbnail registered" signal is the hidden `thumbnailInput` value flipping off `"undefined"`.
- **The real lever is which publish variant appears (single-Proceed = publishes; two-Proceed-checkbox = blocks), which we don't control.** Future fix should focus on the *variant*, e.g. capture the actual modal text (the diag's text-dump came back empty because by then the page had already redirected to `/content`) and/or, when the two-Proceed modal blocks, abandon and retry the whole upload rather than re-grabbing a thumbnail.

**Also corrected — failed attempts do NOT leave a draft.** After ~5 failed/abandoned uploads of the same clip, `/content` showed exactly ONE copy (no drafts, no dupes). So the script's "uploaded as a DRAFT" wording is misleading — an abandoned/blocked publish leaves **nothing** on the channel. (Matches Mike's observation that he saw no draft.) This makes a clean re-run safe-ish from a duplication standpoint **as long as no copy actually published** — but verify `/content` first (read-only `scripts/_list-bitchute-content.js`).

**One gotcha this caused:** the `_diag-bitchute-publish.js` run itself hit the single-Proceed variant and **published the video live with PLACEHOLDER metadata** (`description="diag"`, search `"test"`) at `bitchute.com/video/nCntQI1jCm9T/`. Lesson: a BitChute publish diagnostic that clicks Proceed CAN go live — use throwaway-but-acceptable metadata, or stop before the final Proceed. The 24x-rebrand short is therefore live-but-needs-a-metadata-edit (or delete + clean republish).

### FB short pinned-URL bug — SAME pinned id as the 2026-06-10 run (`…/videos/1296481415588836`), both passes
Both passes again captured the identical pinned `…/videos/1296481415588836` — the **same** id as the entire 2026-06-10 run, confirming it's a long-stable pinned channel video, not a per-run artifact. Real reels were the topmost `/reel/`: pass-1 `36371951362420368`, pass-2 `1444875914349476`, with pass-1's reel demoting to position 3 on pass-2 (the documented pattern holds exactly). Manually corrected both. Fix is still the same un-done task: port the longform baseline-diff capture into `post-fb-short.js`.

### Rumble shorts both `posted_unverified` (normal) — sweep later
Pass-1 `v7b2w2s` (elizaos 24x-rebrand), pass-2 `v7b4lu4` (four-year-cycle). In-run liveness showed the previous short's title (still processing). Live; recapture with `scripts/recapture-rumble-url.js <id>`.

### x-reply-auto: 2/2 posted + confirmed (no throttle false-negatives at low volume)
Run-1 picked STON.fi (TON DeFi swap-volume milestone → real-usage-over-TVL take); run-2 picked CoinTab News (fake-Jupiter-drainer warning → self-custody/verify-the-front-end take). Both CONFIRMED visible on the tweet page. At 2 replies in the window there was zero throttle (expected). Selection note that worked: when the freshest candidate is cryptic/insider (this run a Kaspa-Silver "negative hashrate, 34% now" tweet I couldn't confidently parse), SKIP it in favor of a clear tweet where the on-brand take is unambiguous — an unseen auto-fire into the core KAS community on a misread is the worst failure mode.

### Everything else clean
YT community (edited fair-launch body, "There was no premine…" 1st), YT poll (3 options incl. the add-option-3 step that was fixed 2026-06-10), X thread (6/6 verified), TikTok CDP both passes first-try, X/IG/YT shorts all clean. Empty queues skipped: X tweets (×3 re-checks, stayed 0), X polls, IG single, all 3 longform uploads, IG carousel, reply-guy `replies_to_post.json`.

---

## Operational notes — 2026-06-13 session (31-step run, 27 active)

### ✅ TikTok: per-profile kill REPLACES kill-all — main Chrome no longer needs closing
The canonical `tiktok-post-vertical.md` historically said `Stop-Process -Name chrome -Force` (kill-all) before the CDP spawn, which **violates the never-kill-main-Chrome rule** (memory `feedback_never_kill_main_chrome`). Root cause of the old advice: it predates TikTok moving to a **dedicated `tiktokbot-profile`** (the script's `MAIN_USER_DATA` constant is misnamed — it points at `tiktokbot-profile`, not main `User Data`). This run proved a **per-profile kill is enough**: kill only processes whose CommandLine matches `*tiktokbot-profile*` or `*9224*`, verify port 9224 is free, then run. `Chrome ready on CDP 9224 ✓` **first-try on BOTH passes**, main browser untouched. Updated `tiktok-post-vertical.md` to the per-profile form (kill-all advice marked superseded). **Apply the same per-profile-only discipline to every step this run** — no kill-all was used anywhere across all 27 active steps, zero profile-collision failures.

### Whole-run discipline that worked (zero failures, 27/27 active steps)
Strict sequential, ONE attempt per script, background-launch → wait for completion notification → read the log → reconcile → per-profile kill the next step's profile (`Get-CimInstance … CommandLine -like "*<profile>-profile*"`) → launch. Profiles cycled: xbot / ytbot(9223) / igbot / fbbot / rumblebot / bitchutebot / tiktokbot(9224). No kill-all, ever. Dashboard left running throughout (safe static server).

### FB short pinned-URL id ROTATED to `1730184431514071` (was `1296481415588836` through 2026-06-11)
Both FB shorts this run captured the identical `…/videos/1730184431514071` — the current pinned channel video (the long-stable `1296481415588836` has been replaced). Posts ARE live; saved URL is the pinned one. Real `/reel/<id>`s are disambiguated by DURATION in the sweep (this run: pass-1 best-month ≈ 37s, pass-2 selling-into-the-crash ≈ 12.8s; the longform market-meltdown reel `2085162548728033` ≈ 26min was correctly captured by the longform script's baseline-diff and verified live). Still un-done: port the longform baseline-diff capture into `post-fb-short.js`.

### Both BitChute shorts + the BitChute longform took the single-Proceed happy path (liveness confirmed)
No two-Proceed/missing-thumbnail variant this run. Longform real URL derived from `upload_code=g7p8d9H5B8HR` → `…/video/g7p8d9H5B8HR/` (the documented manual step; longform script still writes bare `…/content`). Rumble longform captured its real direct link on its own; FB longform baseline-diff returned a real verified `/reel/`. All 3 longform `longs.json` rows set to `posted`+url manually (scripts don't write back).

### Rumble shorts both `posted_unverified` (normal) — recapture pending
Pass-1 `v7b6wlo` (best-month), pass-2 `v7b862q` (selling-into-the-crash). In-run liveness showed the prior short's title (still processing). Live; recapture with `scripts/recapture-rumble-url.js <id>` in a periodic sweep.

### x-reply-auto: run-1 no-op (feeds stale, freshest 241m), run-2 fired to @lopp (CONFIRMED)
Run-2 had 4 qualifying; picked Jameson Lopp's anti-KYC/cypherpunk tweet over a non-crypto meme (The Figen), an off-lane AI-model hype tweet (Miles Deutscher), and a generic BSC-memecoin dump (CoinTab) — the sovereignty/"coins nobody can freeze" angle was the sharp on-brand take on a high-visibility account. Confirmed live.
