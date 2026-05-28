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
| **Age-based** | rest of `assets/` (b-roll PNGs, `*-clip.mp4`, overlays), `livestream-repurpose/media` + `transcripts`, and per-clip `preview.mp4` / `whisper*.json` / `captions.ts.draft` under `shorts/` | recycled if older than `--age-days` |
| **Publish-state guard** | `remotion/out/<batch>/<n>-<slug>.mp4` | recycled only when that clip is in `shorts.json` for THIS batch (`source_livestream` starts with `<batch>-`) with EVERY platform `status=posted` |

The publish-state guard matches on slug **and** batch — slugs repeat across batches
(e.g. `pengu-flips-pepe` exists in both `weekend-red` and `meme-coins`), so a slug-only
match would wrongly recycle an unposted render.

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
