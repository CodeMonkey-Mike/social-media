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

### `schedule-tweets` — reference-counted GC + orphan-by-age
Scans `schedule-tweets/images/` (excluding `images/reference/`). An image referenced by a
queue is recycled only if some post queue references it with `status=posted` AND no non-posted
item also references it. An **orphan** image (referenced by no queue) is recycled once it is
**≥ 14 days old** (`ORPHAN_AGE_DAYS` in `targets/schedule-tweets.js`); a newer orphan is kept,
since it may be freshly generated and not yet queued. Because active batches are always recent,
this age threshold protects their art without any batch-id check. Queues scanned:
`x-tweets`, `x-threads`, `x-polls`, `ig-single-image`, `ig-carousel`, `yt-posts`, `yt-text-polls`.

Also recycles **top-level run logs** (`*.log` directly in `schedule-tweets/`, e.g.
`post-step*` / `workflow-step*`) once they're **≥24h old** — the current posting session is
preserved, and the Chrome bot-profile LevelDB logs deeper in the tree are never touched.

### `video-creation` — hybrid
| Tier | Paths | Rule |
|---|---|---|
| **Never touch** | `assets/{sfx,music,fonts,transitions}/`, `assets/logo-*.png`, every `*-progress.json` | protected |
| **Always sweep** | any `_bad-*/` reject folder | recycled regardless of age |
| **Registry-driven** | `assets/projects/<batch>/`, `remotion/out/`, `livestream-repurpose/{media,transcripts}`, and `shorts/` clip artifacts | keep only what belongs to an **active** batch (per `batches.json`); recycle the rest. For `assets/projects/<batch>/` the folder name is matched to a batch id — a folder matching no batch falls back to age-based. |
| **Age-based** | legacy loose assets in the `assets/` root + non-`projects/` subdirs (old b-roll PNGs, `*-clip.mp4`, overlays) | recycled if older than `--age-days` |

The registry-driven tier reads `../batches.json`:
- **`assets/projects/<batch>/`** — the canonical per-batch asset home (b-roll, overlays, generated stills, rendered clips). The folder name is the batch id: an **active** batch's folder is kept, an **archived** batch's folder is recycled, and a folder matching no batch falls back to age-based (so old/unregistered junk still ages out at `--age-days`). Loose files in the `assets/` root and non-`projects/` subdirs remain age-based.
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
