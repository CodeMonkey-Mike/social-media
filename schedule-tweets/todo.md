# Folder Restructure TODO

## Decisions made

### Delete these files
- [x] `bash-write-test.txt` — temp test file
- [x] `debug.png` — temp debug
- [x] `tweets.csv.bak` — old backup

### Move
- [x] `pending-snapshot.json` → `data/pending-snapshot.json`

### Reorganize images
- [x] `images/version1/` through `images/version5/` → `images/reference/carousels/version1/` etc.
  - These are carousel reference images, not drafts

## Still to do (not yet applied)

### 1. Create `data/` folder and move all JSON content files there
- [x] `tweets.json` → `data/x-tweets.json`
- [x] `threads.json` → `data/x-threads.json`
- [x] `x-polls.json` → `data/x-polls.json`
- [x] `IG-carousel.json` → `data/ig-carousel.json`
- [x] `IG-single-image.json` → `data/ig-single-image.json`
- [x] `yt-posts.json` → `data/yt-posts.json`
- [x] `yt-text-polls.json` → `data/yt-text-polls.json`

### 2. Create `config/` folder
- [x] `x-auth.json` → `config/x-auth.json`
- [ ] `package.json` and `package-lock.json` — left at root (moving them breaks npm)

### 3. Create `scripts/` folder
- [x] `post-thread.js` → `scripts/post-thread.js`
- [x] `setup.js` → `scripts/setup.js`
- [x] `serve_images.py` → `scripts/serve_images.py`
- [x] `remove-time-guards.ps1` → `scripts/remove-time-guards.ps1`

### 4. Create `skills/` folder
- [x] `SKILL.md` → `skills/SKILL.md`
- [x] `pending-social-posts.skill` → `skills/pending-social-posts.skill`
- [x] `pending-social-posts-SKILL.md` → `skills/pending-social-posts-SKILL.md`
- [x] `post-yt-community-SKILL.md` → `skills/post-yt-community-SKILL.md`
- [x] `PLAYWRIGHT_HANDOFF.md` → `skills/PLAYWRIGHT_HANDOFF.md`

### 5. Reorganize images/ into platform subfolders
- [x] `images/ig-carousel-*.png` → `images/ig/`
- [x] `images/x-tweets-*.png` → `images/x/`
- [x] `images/yt-posts-*.png` → `images/yt/`
- `images/reference/` stays as-is (logos + carousels)

### 6. After moving files — update hardcoded paths in scripts and skill docs
- [x] `scripts/post-thread.js` — THREADS_JSON → `data/x-threads.json`
- [x] `scripts/setup.js` — AUTH_FILE → `config/x-auth.json`
- [x] `skills/SKILL.md` — all file locations and image paths
- [x] `skills/PLAYWRIGHT_HANDOFF.md` — file locations
- [x] `skills/post-yt-community-SKILL.md` — yt-posts.json path and image path
- [x] `skills/pending-social-posts-SKILL.md` — all JSON paths, rewrote counting script (CSV → JSON)
- [x] `repurpose/SKILL.md` — all JSON file paths and image paths
- [x] `repurpose/PLAYWRIGHT_HANDOFF.md` — image paths
- [x] `repurpose/generate-image.js` — auto-derive platform subfolder from prefix
- [x] `repurpose/generate-favorites.js` — IMAGES_DIR → `images\x\`
- [x] `repurpose/update-image-ids.js` — JSON paths and image_path prefix
- [x] `repurpose/update-yt-posts.js` — JSON paths and buildImagePath

## Notes
- `package.json` and `package-lock.json` intentionally left at root — moving them breaks `npm install`
- Misc images (carousel.png, cartoonish.png, sample.png) left at `images/` root — no clear platform target
