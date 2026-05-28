---
name: cleanup
description: Move no-longer-needed assets to the Windows Recycle Bin across the social-media monorepo. Multi-target — schedule-tweets (posted images) and video-creation (renders, b-roll, source media, transcripts). Never hard-deletes; always dry-run first.
---

## What this skill does

A single cleaner with per-target policies. It only ever moves files to the **Recycle Bin**
(reversible), never hard-deletes. Lives at the repo root because it serves multiple folders.

```
node cleanup/cleanup.js --target <schedule-tweets|video-creation|all> [--dry-run] [--age-days N]
```

- `--target` (required): which folder's policy to run, or `all`.
- `--dry-run`: print what would be recycled, move nothing. **Always run this first.**
- `--age-days N`: age threshold for the video-creation target (default 30).
- `--only <path-substring>`: restrict the run to paths matching a substring (forward-slash, case-insensitive), e.g. `--only video-creation/remotion/out` to clean just that folder. Great for going folder-by-folder.

## Targets & policies

### `schedule-tweets` — reference-counted GC (unchanged behavior)
Scans `schedule-tweets/images/` (excluding `images/reference/`). An image is recycled
only if some post queue references it with `status=posted` AND no non-posted item also
references it. Images not found in any queue are left untouched. Queues scanned:
`x-tweets`, `x-threads`, `x-polls`, `ig-single-image`, `ig-carousel`, `yt-posts`, `yt-text-polls`.

### `video-creation` — hybrid
| Tier | Paths | Rule |
|---|---|---|
| **Never touch** | `assets/{sfx,music,fonts,transitions}/`, `assets/logo-*.png`, every `*-progress.json` | protected |
| **Always sweep** | any `_bad-*/` reject folder | recycled regardless of age |
| **Age-based** | rest of `assets/` (b-roll PNGs, `*-clip.mp4`, overlays) | recycled if older than `--age-days` |
| **Registry-driven** | `remotion/out/`, `livestream-repurpose/{media,transcripts}`, and `shorts/` clip artifacts | keep only what belongs to an **active** batch (per `batches.json`); recycle the rest |

The registry-driven tier reads `../batches.json`:
- **`remotion/out/`** — keep the render `directories` of `status: "active"` batches; recycle every other batch folder and all loose files. (Disposable scratch: posted shorts live in the `schedule-tweets/` queue and every comp is in git.)
- **`livestream-repurpose/`** — `media/` files (flat) and `transcripts/<livestream>/` folders (one per livestream) are matched to a batch by `livestream_title`; active batch → keep, archived → recycle, no match → left alone. (Source recordings are on YouTube; transcripts are regenerable.)
- **`shorts/`** — only the **gitignored** per-clip artifacts (`preview.mp4`, `whisper-words.json`, `captions.ts.draft`): kept inside the active batch's clip `directories`, recycled everywhere else. Tracked source in the clip dirs (`index.html`, `preview.json`, `gen_captions.py`, `whisper.json`, …) is never touched.

## How to run

```
# Preview everything (safe):
node cleanup/cleanup.js --target all --dry-run

# Just the video-creation side, see candidates older than 14 days:
node cleanup/cleanup.js --target video-creation --age-days 14 --dry-run

# Live run for one target (moves to Recycle Bin):
node cleanup/cleanup.js --target schedule-tweets
```

## When to invoke

After a posting/render session, to reclaim disk. Always `--dry-run` first; the
video-creation target can recycle whole rendered batches and source livestreams, so the
preview matters more here than for the image cleaner.

## Note on the old entrypoint

`schedule-tweets/scripts/cleanup-images.js` still works but is now a thin shim that
delegates to `node cleanup/cleanup.js --target schedule-tweets`. The policy lives here.
