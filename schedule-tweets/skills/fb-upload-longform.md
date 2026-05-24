---
name: fb-upload-longform
description: Upload a single longform video to Facebook — typically a 1-2 hour livestream recording, landscape, posted as a normal video (not a Reel). Mirrors fb-post-vertical but sourced from the longform/ staging folder.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-facebook.js
```

Uploads one video. **No JSON queue** — the script reads a video + `metadata.json` triplet from a staging folder (same pattern as `rumble-upload-longform.md` / `bitchute-upload-longform.md`), NOT from `data/shorts.json`. The Facebook upload flow itself is the same as `fb-post-vertical.md` (`post-fb-short.js`): feed composer → Photo/video → upload → wizard → Post → verify.

## Source folder

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\`

Same staging folder Rumble and BitChute longform read from. Drop files there before running — **filenames don't matter; auto-detected:**

| What | How it's picked |
|---|---|
| Video | The single video file (`.mp4` / `.mov` / `.webm` / `.mkv`). Most-recently-modified wins if several. Must be ≥1MB. |
| `metadata.json` | Fixed name. Title + description become the caption; tags are not used for FB. |

No thumbnail step — Facebook auto-generates the video thumbnail (same as `post-fb-short.js`).

## Caption

Built from `metadata.json` as `title` + blank line + `description`, then **hashtags are stripped** (`#tag` triggers FB's tag-autocomplete, which overlays the dialog and breaks the wizard — same reason as the FB short script).

## Landscape video = normal video post, NOT a Reel

Facebook routes only vertical 9:16 clips to Reels. A landscape longform goes through the same "Photo/video" feed composer and posts as a regular video. The generic wizard loop (click the visible Next, then the final Post/Share/Publish) handles whichever step sequence Facebook shows, so no Reel-specific handling is needed.

## Chrome profile

Uses `fbbot-profile`. Shared with `post-fb-short.js` — don't run two at once. **Chrome must be fully closed on this profile before running** (other profiles are fine).

## Timing constants

Mirror `post-fb-short.js`: `PRE_COMPOSE` 60–180s, `PRE_POST` 60–180s, `ACTION` 4–7s, `CHAR_DELAY` 60–150ms. The upload-to-100% wait is 10 min (longform files are large).

## What the script does

1. Validates a video + `metadata.json` exist in the source folder (video ≥1MB) — aborts before any Chrome work otherwise.
2. Builds the caption (title + description, hashtags stripped).
3. Launches Chrome (`fbbot-profile`), navigates to the Page, checks login, clicks "Switch Now" if the Page-context prompt appears.
4. Pre-composer wait → opens composer → Photo/video → `setInputFiles()` on the `accept*="video"` file input.
5. Waits for upload `100%` + copyright scan to clear.
6. Types caption → pre-post wait.
7. Wizard loop (up to 12 steps): snapshots the top dialog, clicks the visible final button (Post/Share/Publish/Share now/Done) if present, else the visible Next. Off-screen stacked-panel buttons are filtered out; among same-label matches the largest visible one wins.
8. Dismisses the post-publish upsell ("Not now" / "No thanks" / "Maybe later" / "Skip").
9. Waits for the "Posting" spinner to clear.
10. Captures the URL from `/<page>/videos`, then **verifies**: navigates to the URL, confirms HTTP 2xx/3xx + a `<video>` / player / `og:video`. Prints the URL; only reports success if both the spinner cleared AND the URL verified.

No queue writeback — it just uploads and prints the result (re-running uploads whatever video is currently staged again, so swap the staging folder between runs).

## Debug artifacts

Each wizard step saves to `tmp-fb-longform-debug/stepN_state.png`. Inspect on failure (`FAILED_final_state.png`).

## When to use this vs. `fb-post-vertical.md`

| If… | Use |
|---|---|
| Landscape 1-2 hour livestream recording from `longform/` | this script (`upload-longform-facebook.js`) |
| Vertical 9:16 short clip from `data/shorts.json` | `fb-post-vertical.md` (`post-fb-short.js`) |
