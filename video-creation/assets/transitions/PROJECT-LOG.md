# Transition Library — Project Log

_Re-creating the **Swiftly Studio 850 Seamless Transitions** Premiere pack as a browsable
Remotion transition library. Last updated: 2026-06-20._

> **Read `CLAUDE.md` in this folder first** (hard rules: never invent a transition's look; use the
> project's real values + the pack's own asset files; never overwrite an approved result blindly).

---

## Goal
Rebuild the Swiftly 850 transitions as reusable Remotion components driven by the project's REAL
values, with a per-folder gallery to browse them.

## Architecture
| Layer | Location | Role |
|---|---|---|
| Catalog (data) | `library.json` | one row per transition; real extracted params. |
| Engine (code) | `remotion/src/transitions/engines/GlitchBlocks.tsx` | renders Blocks from the real mask + offsets. |
| Registry | `remotion/src/transitions/registry.ts` | binds row.engine → component. |
| Demo | `remotion/src/TransitionDemo.tsx` | renders one row between two stills (passes image srcs). |
| Browser | `browse/<CAT>/<VARIANT>/gallery.html` | per-folder video galleries. |

---

## CURRENT STATE — GLITCH / Blocks: all 15 built ✅ (approved 2026-06-20)
`blocks-max-1/2/3`, `blocks-medium-1/2/3`, `blocks-short-1/2/3`, `blocks-strips-1x…6x` — rendered +
in the gallery. The engine shows the footage through the real moving block mask, wrap-shifted by
each real Offset, faded by the Opacity flash (0→100→0 peak 0.333, cut at peak), 150% vertical stretch.

Block PATTERN source by family, and fidelity:
- **Max / Medium** → pack's real `Gth - Disp Blocks Max.mp4` → `lib/masks/blocks-max` — **near-1:1**.
- **Short** → pack's real `Gth - Disp Blocks Small.mp4` → `lib/masks/blocks-small` — **near-1:1**.
  (real B/W mask videos converted to alpha-PNG sequences, white→opaque; just a format change.)
- **Strips 1x–6x** → **reverse-engineered from each density's PREVIEW** (no source mask file exists):
  diff the glitch frames vs the clean settled frame → collapse to a per-row profile → full-width
  strip bands → `lib/masks/blocks-strips-Nx` (12 frames each). **fidelity = approximate** (derived
  from the preview render + the real 2 offsets, not a source mask). Approved by Mike.

Displacement is the real per-clip Offset "Shift Center To" vectors (Max 6 / Medium 4 / Short+Strips 2).

---

## How we got here (so the mistakes aren't repeated)
1. First pass eyeballed the preview → wrong. Then a **global by-type extraction** mixed effects from
   different transitions (`ADBE Offset` has 2002 instances) → a "no Turbulent Displace / 85 Set Matte"
   reading that was an artifact of a **leaky closure**.
2. That led to an **invented square-grid** rebuild that overwrote an approved result. Reverted +
   restored from conversation history (files weren't committed → **commit this work**).
3. Mike's insight: the **FullHD project is demo-only**; the real transitions live in the 4K project
   (same data though). And: the block pattern is a **real B/W mask video**, not keyframe geometry.
4. Correct method = **per-clip** extraction (`_extract-blocks-clips.js`: Sequence → tracks → clips →
   each clip's own chain) + use the **real mask file**. That's what the 9 are built on.

## Pipeline (how to rebuild / extend)
```
node _extract-blocks-clips.js     # per-clip real offsets/masks/scaleH for all variants -> _blocks-clips.json
# convert a real mask video -> alpha PNG sequence (white->opaque):
ffmpeg -i "(Footage)/.../Gth - Disp Blocks Max.mp4" -filter_complex \
  "[0:v]scale=1920:1080,format=gray[g];color=c=white:s=1920x1080:r=25,format=rgb24[b];[b][g]alphamerge,fps=30[o]" \
  -map "[o]" -frames:v 30 lib/masks/blocks-max/m_%03d.png
node _build-lib.js                # _blocks-clips.json -> library.json (9 rows)
cd ../../remotion && npx remotion render src/index.ts TransitionDemo <out>.mp4 --props='{"id":"blocks-max-1"}'
node _gen-galleries.js            # rebuild gallery.html
```
_(extractors read the decompressed project XML from `%TEMP%/sw.xml` if present, else gunzip the .prproj.)_

## Key files
```
assets/transitions/
├─ CLAUDE.md  PROJECT-LOG.md
├─ library.json                 # 9 Blocks rows (real values)
├─ _extract-blocks-clips.js     # per-clip extractor (the correct path)
├─ _build-lib.js                # builds library.json from _blocks-clips.json
├─ _blocks-clips.json           # extracted per-clip data (all 15, incl. strips findings)
├─ _extract-prproj.js           # OLD global by-type extractor (leaky for per-transition; reference only)
├─ _gen-galleries.js
├─ lib/masks/blocks-max  blocks-small   # alpha-PNG sequences from the real Gth-Disp masks
├─ lib/demo/  lib/sfx-blocks-*.mp3
└─ browse/GLITCH/Blocks/        # 9 rendered demos + gallery.html

remotion/src/transitions/engines/GlitchBlocks.tsx   # real-mask + real-offset engine
remotion/src/TransitionDemo.tsx
```

## Next steps
1. Mike reviews the 9. Decide Strips (find real source vs accept preview vs skip).
2. Within-family note: Max-2≈Max-3 and Medium-1/2/3 share offsets at the level we can read, so those
   may look similar; the true per-variant difference may live in nested timing not yet extracted.
3. Next category by ROI: **geometric** (ZOOM/SPIN/SPLIT) — pure keyframes, reproduce near-1:1.

## Browse
`assets/transitions/browse/gallery.html` → GLITCH → Blocks.
