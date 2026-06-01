# Playbook: image generation

**Canonical detail:** `repurpose/SKILL.md` (image-generation section). **Chrome profile:** `chatgpt-profile`.
Run from repo root, prefixing `cd C:\Users\mnede\Documents\Claude\social-media &&`.

## Scripts
- **Single image:** `node repurpose/generate-image.js ...` — accepts one `--reference-image=<path>`.
- **Batch:** `node repurpose/generate-image-batch.js` — resumable (skips existing files via `fs.existsSync`).
- **B-roll:** `node repurpose/generate-broll-wlw.js` — the good one. (`generate-broll-batch.js` has a stale path + broken capture — avoid.)
- **Favorites lineup:** `node repurpose/generate-favorites.js`.

## Hard rules
- **EVERY IMAGE IS UNIQUE** — never reuse an `image_id` or image file across two posts. Most-repeated mistake on this account.
- **Pending only** — never (re)generate images for already-posted entries; default to `status === 'pending'`. Never auto-create a companion entry on another platform.
- **Chat reuse:** use the designated persistent ChatGPT chats (X tweets / YT) within a session. For one-off **regens** use a FRESH chat — history images get re-captured as "new" generations.
- **Reference images** for lesser-known coins live in `schedule-tweets/images/reference/`; pass via `--reference-image`. `generate-image.js` accepts only one — multi-coin lineups fall back to manual ChatGPT upload.
- **Rate cap** ≈ 50 images / rolling 3h (trips before the ~180/day ceiling). Batches are resumable — when capped, stop, keep posting, re-run after the window.
- **X image → IG 4:5 companion:** also make a 4:5 version (same id, prefix `ig-single-`) for the IG single entry.
