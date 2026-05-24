---
name: cleanup-images
description: Move posted-content images to the Recycle Bin. Only touches images that are (a) linked to a post with status=posted in any JSON queue file, and (b) not also linked to a non-posted item. Never touches images/reference/. Never deletes images not found in any queue file.
---

## What this skill does

Scans `images/` (excluding `images/reference/`) and moves images to the Windows Recycle Bin — but only if every JSON queue that references that image has that item in `posted` status.

**Hard rules:**
- `images/reference/` is completely excluded — never touched.
- Images not found in any JSON queue are left alone (not deleted, not recycled).
- If an image is referenced by BOTH a posted item AND a non-posted item (e.g. posted tweet + pending IG post), it is skipped — the pending post still needs it.
- Files are sent to the Recycle Bin, never hard-deleted.

## Workspace location

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\`

## Queue files scanned

| File | Item array | Image fields |
|---|---|---|
| `data/x-tweets.json` | `tweets[]` | `image_path` |
| `data/x-threads.json` | `threads[].tweets[]` | `image_path` |
| `data/x-polls.json` | `polls[]` | `image_path` |
| `data/ig-single-image.json` | `posts[]` | `image_path` |
| `data/ig-carousel.json` | `posts[].slides[]` | `image_path` |
| `data/yt-posts.json` | `posts[].images[]` | `image_path` |
| `data/yt-text-polls.json` | `polls[]` | `image_path` |

## How to run

### Dry run (shows what would be recycled, no changes)
```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/cleanup-images.js --dry-run
```

### Live run (moves files to Recycle Bin)
```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/cleanup-images.js
```

## Expected output

```
Scanned 47 image(s) in images/ (reference/ excluded)
  Ready to recycle (posted, no active link): 12
  Skipped — still needed (non-posted association): 5
  Skipped — not found in any JSON queue: 30

Unknown images (left untouched):
  ? some-untracked-file.png

Moving files to Recycle Bin...

Done. Moved 12 image(s) to Recycle Bin:
  Recycled: x-tweets-221dbeb4-minnesota-banks-rolling-adoption.png
  ...
```

## When to invoke

Run this skill after a posting session when you want to clean up disk space. Safe to run anytime — the dry-run mode lets you preview first. The script is idempotent: already-recycled files won't appear on the next run since they're no longer in the images/ directory.
