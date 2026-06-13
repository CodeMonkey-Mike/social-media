---
name: fb-upload-longform
description: Upload a single longform video to Facebook — typically a 1-2 hour livestream recording, landscape, posted as a normal video (not a Reel). Mirrors fb-post-vertical but sourced from the longform/ staging folder.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-facebook.js
```

Uploads one video. The Facebook upload flow itself is the same as `fb-post-vertical.md` (`post-fb-short.js`): feed composer → Photo/video → upload → wizard → Post → verify.

## ⛔ HARD RULE — `data/longs.json` is the queue, the dashboard cue is correct

The dashboard's Longs tab shows `data/longs.json`. **That queue drives uploads — full stop, no exceptions, no questioning.** When this skill fires, the next-pending entry for the `facebook` platform (earliest `created_at` among `status === 'pending'`) is what gets uploaded.

Do NOT stop and ask the user "should I stage this?" or "the folder root has a different video, what do I do?" The queue is authoritative; the folder is an implementation artifact (see "Staging" below).

## Staging (none needed — the script reads `longs.json` directly)

`upload-longform-facebook.js` now sources the next-pending `facebook` entry **directly from `longs.json`** via `scripts/lib/longform-queue.js` (`pickNextLongform('facebook')`). It uploads the entry's own `video_path` and builds the caption from the entry's title + description. **Do NOT copy anything into `longform/` root** — the old loose-root staging step is gone (it was what left orphaned duplicates behind).

1. The script picks the next pending `facebook` entry itself (queue order) — you stage nothing.
2. Run the upload script.
3. After a confirmed upload: write back `status: "posted"`, `posted_at`, `url` to that entry in `longs.json`.

Prerequisite: the entry's `video_path` must exist on disk (≥1MB) — the repurpose/longform pipeline writes it into the `longform/<source>/` subfolder. No thumbnail step — Facebook auto-generates the video thumbnail.

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
3. Launches Chrome (`fbbot-profile`), navigates to the Page, checks login.
4. **Baseline capture:** visits `/<page>/videos` and records the existing video/reel IDs (used later to identify the *new* upload — see below).
5. Returns to the Page, clicks "Switch Now" if the Page-context prompt appears.
6. Pre-composer wait → opens composer → Photo/video → `setInputFiles()` on the `accept*="video"` file input.
7. **Waits for the byte upload to genuinely finish** (`waitForUploadComplete`) — see the section below. Then waits for the copyright scan to clear.
8. Types caption → pre-post wait.
9. Wizard loop (up to 12 steps): snapshots the top dialog, clicks the visible final button (Post/Share/Publish/Share now/Done) if present, else the visible Next. Off-screen stacked-panel buttons are filtered out; among same-label matches the largest visible one wins. For a landscape video the path is typically Next ×3 → **Post**.
10. Dismisses the post-publish upsell ("Not now" / "No thanks" / "Maybe later" / "Skip").
11. **Waits for the "Create post" composer dialog to close** (the real submit signal), up to 10 min — the browser stays open through finalization.
12. **Polls `/<page>/videos` for up to 12 min** for an ID *not in the baseline* — that's the newly-uploaded video (a large file keeps processing for minutes after submit, so it isn't listed immediately).
13. **Verifies** the new URL: HTTP 2xx/3xx + a `<video>` / player / `og:video`. Reports success only if a new video was found AND it verified.

No queue writeback — it just uploads and prints the result (re-running uploads whatever video is currently staged again, so swap the staging folder between runs).

## Critical: upload completion + correct URL (why the naive approach fails)

Two things go wrong with large longform files and are handled explicitly:

- **Don't post before the upload finishes.** Facebook doesn't reliably render a literal `100%` string for a large video, so an `innerText.includes('100%')` check falls through immediately, the wizard clicks Post on a partial upload, and closing the browser aborts the byte transfer → the post never lands. `waitForUploadComplete()` instead watches the dialog's `[role="progressbar"]` `aria-valuenow`, any `NN%` text, an `/uploading/i` string, and the `<video>` preview, and only proceeds after a *sustained* "not uploading" state (with a 45s floor and a 20-min ceiling). **Never replace this with a fixed sleep or a literal-string check.**
- **Don't trust "most recent video" as the URL.** Right after submit the new video is still processing and isn't on `/videos` yet, so "most recent" returns a stale, already-published clip (this produced a false-positive "verified" once). The script diffs against the baseline IDs captured in step 4 and polls until a genuinely new ID appears.

## Debug artifacts

Each wizard step saves to `tmp-fb-longform-debug/stepN_state.png`. Inspect on failure (`FAILED_final_state.png`).

## When to use this vs. `fb-post-vertical.md`

| If… | Use |
|---|---|
| Landscape 1-2 hour livestream recording from `longform/` | this script (`upload-longform-facebook.js`) |
| Vertical 9:16 short clip from `data/shorts.json` | `fb-post-vertical.md` (`post-fb-short.js`) |
