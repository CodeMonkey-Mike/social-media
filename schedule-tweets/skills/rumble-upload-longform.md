---
name: rumble-upload-longform
description: Upload a single longform video to Rumble — typically a 1-2 hour livestream recording, landscape aspect ratio, with custom thumbnail.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-rumble.js
```

Uploads one video. **No JSON queue** — the script reads a hardcoded video, thumbnail, and metadata triplet from a staging folder. Different from `rumble-post-vertical.md`, which reads `data/shorts.json`.

## Source folder

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\longform\`

Drop your files into that folder before running — **filenames don't matter; they're auto-detected:**

| What | How it's picked |
|---|---|
| Video | The single video file in the folder (`.mp4` / `.mov` / `.webm` / `.mkv`). If several, the most-recently-modified wins. |
| Thumbnail | The single image file (`.png` / `.jpg` / `.jpeg` / `.webp`). Optional — script continues without if absent. |
| `metadata.json` | Fixed name. Title, description, tags, category, visibility. |

No renaming and no script edits needed — drop a video + (optional) thumbnail + `metadata.json` and run. The script uses `pickFile()` to grab whatever video/image is in the folder.

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
