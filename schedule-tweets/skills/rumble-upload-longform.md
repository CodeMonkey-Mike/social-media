---
name: rumble-upload-longform
description: Upload a single longform video to Rumble — typically a 1-2 hour livestream recording, landscape aspect ratio, with custom thumbnail.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-rumble.js
```

Uploads one video.

## ⛔ HARD RULE — `data/longs.json` is the queue, the dashboard cue is correct

The dashboard's Longs tab shows `data/longs.json`. **That queue drives uploads — full stop, no exceptions, no questioning.** When this skill fires, the next-pending entry for the `rumble` platform (earliest `created_at` among `status === 'pending'`) is what gets uploaded.

Do NOT stop and ask the user "should I stage this?" or "the folder root has a different video, what do I do?" The queue is authoritative; the folder is an implementation artifact (see "Staging" below).

## Staging (none needed — the script reads `longs.json` directly)

`upload-longform-rumble.js` now sources the next-pending `rumble` entry **directly from `longs.json`** via `scripts/lib/longform-queue.js` (`pickNextLongform('rumble')`). It uploads the entry's own `video_path` / `thumbnail_path` (usually a `longform/<source>/` subfolder) and builds the post from the entry's title / description / tags / categories / visibility. **Do NOT copy anything into `longform/` root** — the old loose-root staging step is gone (it was what left orphaned duplicates behind).

1. The script picks the next pending `rumble` entry itself (queue order) — you stage nothing.
2. Run the upload script.
3. After a confirmed upload: write back `status: "posted"`, `posted_at`, `url` to that entry in `longs.json`.

Prerequisite: the entry's `video_path` (and optional `thumbnail_path`) must exist on disk — the repurpose/longform pipeline already writes these into the `longform/<source>/` subfolder. Nothing else to do.

## metadata.json shape

```json
{
  "title": "Required, ≤100 chars (truncated if longer)",
  "description": "Required",
  "tags": ["array", "of", "tags"],
  "categories": {
    "rumble": {
      "primary": "Finance & Crypto"
    }
  },
  "visibility": "public"
}
```

- **Title:** truncated to 100 chars by the script.
- **Category:** if `categories.rumble.primary` is set, it's used; otherwise defaults to `"Finance & Crypto"`. ⚠ This is **different** from the Rumble *vertical* script (`rumble-post-vertical.md`), whose default category is `"News"`.
- **Visibility:** `public` is the default.
- **Tags:** joined as a comma-separated list (`tags.join(', ')`) in the tags field.

## Chrome profile

Uses `rumblebot-profile`. Shared with `scripts/post-rumble-short.js` — don't run two at once. **Chrome must be fully closed before running.**

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `CHAR_DELAY_MIN/MAX` | 40–120ms | Per-keystroke delay |
| `ACTION_MIN/MAX` | 2–5s | Pause between UI actions |
| `PRE_COMPOSE` | none | (no extra pacing) |
| `PRE_POST` | none | (no extra pacing) |

Longform timings are lighter than vertical-video scripts because the upload itself (gigabytes over many minutes) is the dominant throttling signal — extra pauses around clicks don't change the per-platform rate budget.

## What the script does

1. Auto-detects the video + thumbnail via `pickFile()`, then validates a video was found and `metadata.json` exists; aborts (`process.exit(1)`) if either is missing. Thumbnail is optional.
2. Reads metadata, truncates title to 100 chars, resolves category and visibility.
3. Launches Chrome with `rumblebot-profile`.
4. Navigates to `https://rumble.com/upload.php`.
5. **Login handling:** if redirected to `login` / `/sign-in` / `auth.rumble.com`, waits up to **5 minutes** for manual sign-in, then continues. If login doesn't complete in 5 min, aborts.
6. Uploads video and (if present) custom thumbnail.
7. Types title, description, tags (CSV), selects category, sets license to **"Rumble Only"** (hardcoded), sets visibility.
8. Submits and captures the resulting URL with the regex `RUMBLE_V_RE = /https:\/\/rumble\.com\/v[a-zA-Z0-9]+-[a-zA-Z0-9][^\s"'<>]*\.html/`.

## Post-publish verification

URL captured by regex match against the confirmation page. **No HTTP-level live verification.**

## When to use this vs. `rumble-post-vertical.md`

| If… | Use |
|---|---|
| Landscape video, 1–2 hour livestream recording | this script (`upload-longform-rumble.js`) |
| Vertical 9:16 short clip from `data/shorts.json` | `rumble-post-vertical.md` (`post-rumble-short.js`) |

The two scripts share the `rumblebot-profile` and so cannot run simultaneously.
