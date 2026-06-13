---
name: bitchute-upload-longform
description: Upload a single longform video to BitChute — typically a 1-2 hour livestream recording with custom thumbnail.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-bitchute.js
```

Uploads one video.

## ⛔ HARD RULE — `data/longs.json` is the queue, the dashboard cue is correct

The dashboard's Longs tab shows `data/longs.json`. **That queue drives uploads — full stop, no exceptions, no questioning.** When this skill fires, the next-pending entry for the `bitchute` platform (earliest `created_at` among `status === 'pending'`) is what gets uploaded.

Do NOT stop and ask the user "should I stage this?" or "the folder root has a different video, what do I do?" The queue is authoritative; the folder is an implementation artifact (see "Staging" below). If the script and the queue disagree, **fix the script**, don't fix the user's expectations.

## Staging (none needed — the script reads `longs.json` directly)

`upload-longform-bitchute.js` now sources the next-pending `bitchute` entry **directly from `longs.json`** via `scripts/lib/longform-queue.js` (`pickNextLongform('bitchute')`). It uploads the entry's own `video_path` / `thumbnail_path` (usually a `longform/<source>/` subfolder) and builds the post from the entry's title / description / tags. **Do NOT copy anything into `longform/` root** — the old loose-root staging step is gone (it was what left orphaned duplicates behind).

1. The script picks the next pending `bitchute` entry itself (queue order) — you stage nothing.
2. Run the upload script.
3. After a confirmed upload: write back `status: "posted"`, `posted_at`, `url` to that entry in `longs.json`.

Prerequisite: the entry's `video_path` (and optional `thumbnail_path`) must exist on disk — the repurpose/longform pipeline writes these into the `longform/<source>/` subfolder. **Thumbnails must be PNG/JPG, never `.webp`** (BitChute silently rejects `.webp` → the script aborts with a clear error).

**Tip — use a lower-bitrate export here:** BitChute's processing is slower than Rumble's, so a "LOW RES" export uploads more reliably. Reserve the full-quality file for Rumble. (Both scripts read from the same `schedule-tweets/longform/` folder and just grab whatever video is present, so you can stage the low-res file, run BitChute, then swap in the full-quality file and run Rumble.)

## metadata.json shape

```json
{
  "title": "Required, used as-is (not truncated by script)",
  "description": "Required",
  "tags": ["array", "of", "tags"]
}
```

- **Title:** **NOT truncated** by the script (unlike Rumble's 100-char cap, and unlike `bitchute-post-vertical.md` which truncates to 100). BitChute Studio's UI enforces the limit if there is one.
- **Tags:** first 3 only. Each tag's internal spaces are replaced with underscores, then joined with spaces to form BitChute's "search terms" field (`tags.slice(0,3).map(t => t.replace(/\s+/g, '_')).join(' ')`).

## Validation (pre-Chrome)

- A video must be auto-detected in the folder (`pickFile`); none found → `process.exit(1)`.
- `metadata.json` must exist; missing → `process.exit(1)`.
- Video file must be **≥1MB** (`MIN_FILE_SIZE = 1_000_000`); smaller → `"Video below 1MB minimum"` and abort.

## Chrome profile

Uses `bitchutebot-profile`. Shared with `scripts/post-bitchute-short.js` — don't run two at once. **Chrome must be fully closed before running.**

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `CHAR_DELAY_MIN/MAX` | 40–120ms | Per-keystroke delay |
| `ACTION_MIN/MAX` | 3–6s | Pause between UI actions |
| `PRE_COMPOSE` | none | (no extra pacing) |
| `PRE_POST` | none | (no extra pacing) |

Longform timings are lighter than vertical-video scripts because the upload itself (gigabytes over many minutes) is the dominant throttling signal — extra pauses around clicks don't change the per-platform rate budget.

## What the script does

1. Validates file size and metadata existence.
2. Reads metadata, builds search-terms string (first 3 tags, spaces → underscores, joined by spaces).
3. Launches Chrome with `bitchutebot-profile`.
4. Navigates to BitChute Studio.
5. Uploads video. Attaches custom thumbnail if present; otherwise falls back to BitChute's auto "Grab Thumbnail".
6. Types title, description, search terms.
7. Closes any quasar drawer overlay (`.q-drawer__backdrop`) that might intercept clicks — script presses Escape, then clicks the backdrop directly as a fallback.
8. Submits and captures the resulting URL from the Studio dashboard.

## Post-publish verification

URL written from the Studio dashboard — **NOT the specific video URL**. To find the actual video URL after posting, visit the channel page manually. Same caveat applies as in `bitchute-post-vertical.md`.

## Custom thumbnail vs. Grab Thumbnail

| Script | Thumbnail source |
|---|---|
| `upload-longform-bitchute.js` (this skill) | Custom PNG file if present; falls back to Grab Thumbnail |
| `post-bitchute-short.js` (`bitchute-post-vertical.md`) | Always Grab Thumbnail (auto-picks a frame) |

To skip the custom thumbnail for a longform run, delete or rename the PNG before running.

## When to use this vs. `bitchute-post-vertical.md`

| If… | Use |
|---|---|
| Landscape video, 1–2 hour livestream recording | this script (`upload-longform-bitchute.js`) |
| Vertical 9:16 short clip from `data/shorts.json` | `bitchute-post-vertical.md` (`post-bitchute-short.js`) |

The two scripts share `bitchutebot-profile` and so cannot run simultaneously.
