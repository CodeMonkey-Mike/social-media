---
name: ig-post-carousel
description: Post the next pending Instagram carousel (multi-image post) from data/ig-carousel.json via Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-ig-carousel.js
```

Picks up the first post with `status === "pending"` from `data/ig-carousel.json`, posts it as a carousel, and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-carousel.json`

Each post has either a `slides` or `images` array (the script accepts both). Each entry has `seq`, `image_id`, `image_path`. Slides are sorted by `seq` before upload.

## Chrome profile

Uses `igbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile`). **Chrome must be fully closed before running.**

```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
```

Shared with `post-ig-single.js` and `post-ig-reel.js` — never run two IG scripts at once.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 1–15s | Wait before opening composer; reused before clicking Share |
| `ACTION_MIN/MAX` | 1–5s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 5–40ms | Per-keystroke delay for caption typing |

Lighter than X timings — IG's bot-detection is less aggressive on the IG composer than X's React composer.

## Image path resolution

For each slide the script tries, in order:
1. `slide.image_path` field directly (workspace-relative, e.g. `images/ig/foo.png`).
2. If that file doesn't exist, glob `images/ig/`, `images/x/`, `images/yt/` for any filename containing `slide.image_id`.
3. If still not found: `FATAL: image not found for slide seq=N` and `process.exit(1)` — the entire run aborts before any Chrome work.

All images must resolve before Chrome launches. There is no partial-carousel behavior.

## What the script does

1. Reads queue, finds first `pending` post, resolves all slide images (fatal if any missing)
2. Builds full caption: `post.caption` + (`\n\n` + hashtags joined by spaces) if `hashtags` array present
3. Launches Chrome with `igbot-profile`
4. Navigates to `https://www.instagram.com/`, checks for login form — aborts if present
5. **Pre-check (duplicate detection):** scans the last 5 posts on `/realcodemonkeymike/`; if any caption's `og:description` contains the first 40 chars of `post.hook` (or first line of caption), marks the post as `posted` with the existing URL and exits — does NOT re-post.
6. Snapshots the pre-posting profile URLs for the post-check diff
7. Marks `posting` and saves
8. Pre-compose wait: 1–15s
9. Clicks Create button (tries `a[href="/create/select-type/"]`, `[aria-label="New post"]`, `[aria-label="Create"]`, then text="Create")
10. Clicks "Post" sub-link from expanded sidebar
11. `setInputFiles()` on `input[type="file"]` with **the full array of all slide paths in one call**
12. **If "Select multiple" toggle appears**, clicks it and re-uploads (see CRITICAL note below)
13. Clicks Next (Crop step), Next (Filter/Edit step) — **no crop selection** (carousels stay at IG's default)
14. Clicks caption textarea, types full caption char-by-char at 5–40ms
15. Verifies caption is non-empty in the composer, then waits PRE_COMPOSE (1–15s) before Share
16. Clicks Share, waits up to 30s for "Your post has been shared." / "Post shared" confirmation
17. **Post-check:** captures new URLs from profile grid, picks the one not in `preUrls`, verifies it's <15 min old, hook appears in caption, AND the "Next" arrow renders (carousel signal). Only marks `posted` if all checks pass.

**"Confirmation dialog not detected" is normal — don't treat it as an error.** The `waitForSelector('text="Your post has been shared."')` no longer fires in any observed carousel run. IG either changed the confirmation text or removed the dialog. The script falls through to the post-check, which is now the authoritative success signal.

## CRITICAL — "Select multiple" toggle

When IG's Create dialog opens, it defaults to single-image mode. After `setInputFiles()` injects multiple paths, IG may show a **"Select multiple"** button (only the first image will have been accepted). The script detects this:

```js
const multiBtn = page.locator('[aria-label="Select multiple"], button:has-text("Select multiple")').first();
if (await multiBtn.count() > 0) {
  await mouseClick(page, multiBtn);
  await page.waitForTimeout(2000);
  // re-upload ALL slides on the now-multi input
  await page.locator('input[type="file"]').first().setInputFiles(imagePaths);
}
```

If the toggle isn't present, IG already accepted the multi-upload and the script proceeds without re-uploading.

## CRITICAL — carousel detection uses "Next" arrow, not slide dots

IG does NOT render slide-dot buttons (`button[aria-label*="Go to slide"]`) until the user interacts with the carousel. Freshly posted carousels return `slideCount: 0` from the post-check, which would falsely fail.

The reliable signal: the **"Next" arrow** (`button[aria-label="Next"]`) renders immediately on multi-image posts and never on single-image posts. The script checks `isCarousel = hasNext || slideCount >= 2`.

## CRITICAL — no crop selection (different from single + reel)

Carousels post at IG's default aspect ratio (1:1). The script does NOT open the crop menu. This is intentional — Mike's carousels target 1:1.

For comparison:
- **Single image:** must click-open the crop menu and pick 4:5 (see `ig-post-single.md`)
- **Reel:** must hover-open the crop menu and pick 9:16 (see `ig-post-vertical.md`)
- **Carousel:** no crop interaction needed ✓

## CRITICAL — hashtags inside the caption, NEVER as a first comment

Hashtags are appended to the caption with a blank line separator (`'\n\n' + hashtags.join(' ')`) BEFORE clicking Share. Do not modify the script to post hashtags as a first comment — that's a different flow and Mike's spec is in-caption.

## Pre-check duplicate behavior

If the pre-check finds an existing post with the same hook on the profile, the script:
1. Logs `Post already exists at <url>. Marking as posted and exiting.`
2. Updates the JSON row: `status: "posted"`, `posted_at` (preserves existing if set, else current), `post_url`
3. Closes Chrome and exits cleanly (exit code 0)

This makes the script safe to re-run after a crash where the post went live but the JSON wasn't updated.

## Post-check failure modes

If `verifyPosted` returns `ok: false`, the script throws and marks `status: "failed"` with the reason in `error`. Failure reasons:
- `No posts found on profile after posting` — profile grid scrape returned nothing.
- `Most recent post is Nm old — likely not ours` — the newest post is >15 min old, meaning our post didn't appear.
- `Hook "..." not found in caption` — newest post's `og:description` doesn't contain our hook.
- `Expected carousel (N slides) but no "Next" arrow or slide dots found — possible single-image upload` — IG accepted only one image; the carousel failed.

The carousel-signal failure is the most common indicator that "Select multiple" handling broke.

## Resetting a stuck post

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/ig-carousel.json','utf8'));
const p=d.posts.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync('data/ig-carousel.json',JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

## Re-logging in

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile", "--no-first-run", "https://www.instagram.com/"
```
Log into @realcodemonkeymike, then close Chrome with the X button (graceful close — not Task Manager — so cookies save).
