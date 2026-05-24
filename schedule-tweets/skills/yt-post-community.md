---
name: yt-post-community
description: Post the next pending YouTube community post from data/yt-posts.json via Playwright script (CDP-attach to ytbot-profile Chrome).
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-community.js
```

Picks up the first post with `status === "pending"` from `data/yt-posts.json`, posts it (text + optional images), and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

For engagement collection on already-posted community posts (likes), see `collect-engagement.md`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-posts.json`

Each post may have:
- `body` — required text (can be 2000–3000+ chars)
- `char_count` — character count used in logging and truncation safety check
- `images[]` — optional, each with `seq`, `image_id`, `image_path`
- Standard status fields

## Chrome profile + CDP

Uses `ytbot-profile` via **CDP attach** on port **9223** — not `launchPersistentContext`. The script auto-spawns Chrome with `--remote-debugging-port=9223` if the port isn't already open, then connects Playwright via `connectOverCDP`.

Shared with `scripts/post-yt-poll.js` — don't run two at once.

**Chrome must be fully closed (or already running on port 9223) before launch.** If Chrome is already running on the `ytbot-profile` *without* the debug port, the script can't take over — it will fail after 12 seconds with `Chrome did not open remote debugging port 9223`. Close all Chrome windows on this profile first.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `CHAR_DELAY` | 5 ms | Per-keystroke delay (unused — script uses `keyboard.insertText` which is instant) |
| `ACTION_MIN/MAX` | 5–8 s | Pause between UI actions |
| `PRE_COMPOSE_MIN/MAX` | 30–90 s | Wait before opening composer; reused before clicking Post |

## What the script does

1. Reads queue, finds first `pending` post, resolves all `images[]` paths up front. Fatal if any image is missing (no Chrome work happens in that case).
2. **Spawns Chrome** with `ytbot-profile` and `--remote-debugging-port=9223` (or detects existing CDP). Connects Playwright via `connectOverCDP`.
3. Navigates to `https://www.youtube.com/`, verifies login by checking for the avatar button. Throws if not logged in (with a hint to manually open Chrome on `ytbot-profile` and re-log in).
4. **Pre-check (duplicate detection):** scans the last 5 community posts on `@CodeMonkeyMike/posts`. If any post's body text contains the first 40 chars of the new post's body, the script marks the row as `posted` with the existing URL and exits — does NOT re-post. Safe to re-run after a crash.
5. Snapshots pre-posting URL list for the post-check diff.
6. Marks `status: "posting"` and saves.
7. **Pre-compose wait: 30–90 s.**
8. Navigates to the posts page, **clicks `#placeholder-area`** to expand the collapsed composer.
9. Finds the visible text area (`#contenteditable-root[contenteditable="true"]` or aria-label variants), clicks it.
10. Pastes the body via `page.keyboard.insertText(post.body)` — CDP's `Input.insertText` is instant even for 3000+ char bodies. Verifies the pasted length is ≥90% of expected; throws if truncated.
11. **If images present:** clicks the **Image** button (NOT "Image poll"). Uses the **first** `input[type="file"]` (the multi-file one — the second is "add more" and unreliable). Calls `setInputFiles()` with all image paths at once.
12. Waits 6–10 s for thumbnails to render. **Pre-post thumbnail check:** counts rendered `<img>` elements; if `< imagePaths.length`, waits another 4 s and re-counts; if still short, throws. Post would otherwise go live with missing images.
13. **Pre-post wait: 30–90 s.**
14. Clicks the Post button. Waits up to 15 s for the composer to clear (`contenteditable` text becomes empty) — the clear is the submission signal. Falls back to a 4-s wait if the signal doesn't fire.
15. **Post-check:** captures fresh URL list, diffs against `preUrls` to find the new post URL. Retries up to 5× with 5-s gaps (25 s total window) because YouTube's feed can lag. Verifies body snippet match AND image count match.
16. Writes `status: "posted"`, `posted_at`, `post_url` back to JSON. Disconnects Playwright; kills the spawned Chrome process.

## CRITICAL — composer expansion

YouTube's community-post composer starts **collapsed**. You can see "What's on your mind?" but the editable area isn't actually interactive until you click the placeholder. The script tries these selectors in order:

```
#placeholder-area
[id="placeholder-area"]
ytd-backstage-post-renderer-create #placeholder-area
#contenteditable-root        ← sometimes directly clickable in expanded state
```

If none can be clicked, it falls back to a JS `el.click()` on the placeholder element directly. Without this expansion step, the text-area selectors fail and the script throws `Could not find a visible YouTube composer text area after expanding`.

## CRITICAL — long bodies via insertText, not type

YouTube community post bodies are often 2000–3000 chars. **Never use `keyboard.type()` for them** — CDP's `Input.dispatchKeyEvent` times out after ~30 s on long strings, leaving partial text pasted and the Post click never happens.

The script uses `page.keyboard.insertText(post.body)` — this uses CDP's `Input.insertText` method which writes the entire string in a single round-trip and completes instantly. Don't refactor this to `type()`.

## CRITICAL — image input is the FIRST file input

After clicking the Image button, YouTube renders multiple `input[type="file"]` elements. The script uses `.first()`:

```js
const fileInputs = page.locator('input[type="file"]');
await fileInputs.first().setInputFiles(imagePaths);
```

The second input is for "Add more images" and is unreliable — it can replace the first image instead of adding, and cannot be reliably targeted. Always upload all images in one call to the first input.

## CRITICAL — never click the "+" in the thumbnail strip

Observed to duplicate images rather than add new ones. Always upload all images at once in step 11; never click `+` to add additional images.

## CRITICAL — thumbnail count must match before clicking Post

YouTube's Polymer component (`ytd-backstage-multi-image-select-renderer`) renders thumbnails with a ~5–6 s delay even after the files are uploaded. The script waits 6–10 s, counts thumbnails, retries with +4 s if short, and **throws if the count is still short** — better to abort than post with missing images. Past failure: post went live as text-only with the images silently dropped.

## Observed behavior — Image button standard click consistently fails

Every observed run hits `Standard click failed — using JS click...` on the Image toolbar button, then succeeds via `imageBtn.evaluate(el => el.click())`. This is the **normal path**, not a failure recovery — the toolbar button has something (overlay, pointer-events, custom Polymer handler) that defeats Playwright's `.click({ timeout: 5000 })`. Don't try to "fix" it by tightening the timeout or removing the fallback; the fallback is what makes the script work.

## Observed behavior — post-check `body length: 0` is a known false signal

The post-check's `inspectPost` reports `body length: 0` even on posts where the body is clearly present on the live page. The body-text selectors

```
#post-text yt-formatted-string
#post-text
yt-formatted-string#content
ytd-backstage-post-renderer #text
```

are not matching YouTube's current DOM. As a result, the body-snippet check is effectively disabled:

```js
if (info.bodyText && !info.bodyText.includes(snippet)) { ... }
```

`info.bodyText` is `""` (falsy), so the `!info.bodyText.includes(snippet)` branch is short-circuited and the body check always passes. **The image-count check is what actually verifies the post.** If a post goes live with the wrong body text but correct images, the script will mark it `posted` without catching it. Acceptable for now — image-count is the more common failure mode — but if you ever need stronger body verification, update the selectors in `inspectPost`.

## Observed behavior — thumbnail count over-reports (count is not authoritative)

The selector `ytd-backstage-multi-image-select-renderer img` matches more `<img>` elements than there are images. Observed: 4 elements for 1 image; 8 elements for 5 images (roughly a 1.6× multiplier — likely due to thumbnail variants for different display sizes within the same Polymer component). The pre-post check uses `count >= imagePaths.length`, which always passes once any thumbnails render. **Treat the count as a "did any thumbnails render at all" signal, not as an exact count.**

## CRITICAL — never navigate away with the composer open

Any navigation (link click, URL change) silently discards composer state — text and images both. No confirmation dialog. The script avoids this by doing all composer work inline; if you debug, do not refresh or navigate until after Post is clicked.

## Pre-check duplicate behavior

If the pre-check finds an existing post whose body contains the first 40 chars of the new post:
1. Logs `Already posted. Updating JSON with existing URL.`
2. Updates the row: `status: "posted"`, `posted_at` (preserves existing if set, else now), `post_url`
3. Closes Chrome cleanly (exit code 0)

Safe to re-run after a crash where the post went live but the JSON wasn't updated.

## Post-check failure modes

If `verifyPosted` returns `ok: false`, the script throws and marks `status: "failed"` with the reason in `error`. Failure reasons:
- `No new post URL found after 5 attempts — feed may not have updated yet` — diff returned nothing across 25 s. Feed lag or post never went live.
- `Body snippet not found. Expected: "..."` — newest post's body doesn't contain our first 40 chars.
- `Expected N image(s) but none visible on post` — post is text-only when it shouldn't be.
- `Expected carousel (N images) but got M` — partial image upload.

## Resetting a stuck post

```
node -e "
const fs=require('fs');
const path='data/yt-posts.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const p=d.posts.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync(path,JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

## Re-logging in

If the YouTube session expires:

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile", "--no-first-run", "https://www.youtube.com/"
```

Log into @CodeMonkeyMike, then close Chrome with the X button (graceful close — not Task Manager — so cookies save).
