# AI destroying lives: VERTICAL (1080x1920) card slides

Re-shoot of the 16:9 card slides at 1080x1920 (vertical-repurpose.md section 1). Same design, wording, colours, state variants and cue times as the 16:9: the timing table is `../../slide-sources/_state-cues.md`, unchanged (the spine is identical). Every PNG in `../card-slides/` has the SAME name as its 16:9 twin (39 files, `<id>.png` / `<id>-sN.png` / `C19-n-overlay.png`).

Source + driver: `../../slide-sources/build_slides_vertical.py`. It imports the 16:9 `build_slides.py` (container-canonical.css pasted verbatim, the same LOCAL components) and adds only a PORTRAIT CSS layer, so the layout reflows: headlines wrap, side-by-side tiles and columns stack, the A-vs-B comparison stacks top/bottom. Re-run: `python build_slides_vertical.py [id ...]`. Output html: `containers.html` (this folder).

State swaps are pixel-identical apart from the lit row. The driver gates this: every shared element's box is compared across the states of one id. Resting rows stay muted but readable.

## C19 Elegant Promo cards: NEW portrait geometry (do not reuse the 16:9 PROMOS numbers)

The vertical comp runs the same device motion (iris / circle burst, disc sweep, bar wipe, title tracking) on `C19-n-overlay.png` over its own pushing-in portrait plate (`../img/IMG-n-*.png`). The discs, bar and text moved for portrait, so read the geometry from `ep-geometry.json` (this folder), which has the same keys as the 16:9 comp's PROMOS table: `disc [cx, cy, r]`, `bar` / `title` / `subs` / `src` as `[x0, y0, x1, y1]`, plus `anchor` and `titleDir`. One difference: in this file `title` is the DOM text box (the full bar height), while the 16:9 numbers were alpha-measured ink boxes.

| id | layout | disc [cx, cy, r] | bar [x0, y0, x1, y1] |
|---|---|---|---|
| C19-1 | corner top-left | -420, -260, 1471 | 90, 330, 510, 421 |
| C19-2 | corner bottom-right | 1500, 2180, 1471 | 550, 1160, 970, 1251 |
| C19-3 | top centre | 540, -28, 808 | 330, 330, 750, 421 |

`C19-n.png` = the settled full frame over the PORTRAIT plate (QA reference / fallback still). All three portrait plates were on disk at build time, so no 16:9 plate was used.

## Phone-safe placement
All text sits between y 110 and y 1700, so it stays clear of the phone UI at the top and bottom. The lower-third (plug-cta-s1, end-card-cta-*) sits under its card, never at the frame bottom.
