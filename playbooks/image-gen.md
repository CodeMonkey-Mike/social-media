# Playbook: image generation

**Canonical detail:** `repurpose/SKILL.md` (image-generation section). **Chrome profile:** `chatgpt-profile`.
Run from repo root, prefixing `cd C:\Users\mnede\Documents\Claude\social-media &&`.

## Scripts
All Python since 2026-11-27 (the JS generators in `repurpose/` were deleted or archived), all on one capture stack.
- **Batch (the default, 2+ images):** `python repurpose/gen_images.py --list <items.json> --prefix x-tweets|yt-posts|ig-single|ig-carousel` — resumable (skips existing files).
- **Single image:** `python repurpose/generate_image.py --image-id <8hex> --slug <slug> --prompt "..."` — `--reference-image <path>` may be repeated.
- **B-roll / one-off project batch:** `python repurpose/gen_batch.py --list <items.json> --prefix broll --batch <id>` (or `--outdir <project folder>`, `--fresh` for a brand-new chat).
- **One image to any path:** `python repurpose/generate_asset.py --output <path.png> --prompt "..."`.
- **Favorites lineup:** an item with an ARRAY `ref` (one logo per coin) through `gen_images.py`.

## Hard rules
- **EVERY IMAGE IS UNIQUE** — never reuse an `image_id` or image file across two posts. Most-repeated mistake on this account.
- **Pending only** — never (re)generate images for already-posted entries; default to `status === 'pending'`. Never auto-create a companion entry on another platform.
- **Chat reuse is automatic:** the chat pool (`repurpose/chat_pool.py`) reuses one chat per purpose up to its cap, then rotates to a fresh one and deletes the spent one. Nobody records a chat URL by hand any more.
- **Reference images** for lesser-known coins live in `schedule-tweets/images/reference/`; pass via `--reference-image` (repeatable) or the item's `ref` (one path or an array), so a multi-coin lineup uploads every logo.
- **Rate cap** ≈ 50 images / rolling 3h (trips before the ~180/day ceiling). Batches are resumable — when capped, stop, keep posting, re-run after the window.
- **X image → IG 4:5 companion:** also make a 4:5 version (same id, prefix `ig-single-`) for the IG single entry.
