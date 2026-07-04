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

## GLITCH / Invert: all 9 built ✅ (2026-07-04, awaiting Mike's review)

`invert-max-1/2/3` (0.44s), `invert-min-1/2/3` (0.12s), `invert-short-1/2/3` (0.16-0.2s) —
rendered + in the gallery. Engine: `remotion/src/transitions/engines/GlitchInvert.tsx`.
**fidelity: near-1:1** — no plates, no displacement; the whole transition is a keyframed
color-op strobe, every value from the project.

Mechanism (per-clip extraction of all 9 sequences, `_extract-invert.js` → `_invert-clips.json`
→ `_build-invert-rows.js`): two back-to-back "HST Adjustment" clips stack 3-6 `AE.ADBE Invert`
effects (one Channel each) + one `AE.ADBE Tint`; "Blend With Original" keyframes flick each op
on/off per 25fps frame. Channel enum decoded + **verified numerically against the previews**
(reconstructed every preview frame; single-op frames match at MSE 17-450):
- `inv0` RGB negate · `inv2` Green negate · `inv6` Hue invert · `inv7` Lightness invert ·
  `inv12` In-Phase (YIQ) chroma negate · `tint` = black→black/white→WHITE @100% = Rec601 b/w.
- Component stacks apply **BOTTOM-UP** — Tint (listed last) grays the frame FIRST, then the
  inverts hit it. (Max-2's green flash = `green_neg(gray(A))`.)
- Both adjustment clips play media from in-point 0.88; A→B cut at the clip boundary
  (Max 0.2/0.44 → swapAt .4545, Min .3333, Short-1 .25, Short-2/3 .4).
- Engine = SVG filter chains, ALL SIX OPS EXACT in sRGB: RGB/Green/I-neg/tint are plain
  feColorMatrix; hue invert uses the exact identity `hueInvert(x) = (max+min) − x` (and
  lightness = RGB-negate ∘ hueInvert), built from channel-spread matrices + lighten/darken
  feBlends + one arithmetic feComposite (verified vs exact HLS to 1e-15). Do NOT swap in CSS
  hueRotate(180) — it's a lossy linear approximation that wrecks saturated colors.
  TWO ENGINE GOTCHAS: (a) arithmetic feComposite applies its k-formula to ALPHA — folding the
  lightness negate into the k's (k2=−2,k3=1,k4=1) zeroes alpha → whole frame renders black;
  keep the alpha-safe hue composite (k2=2,k3=−1) and negate with a trailing feColorMatrix.
  (b) one static `<filter>` per distinct op-combo, mounted for the whole transition, per-frame
  only the style.filter url switches — mutating filter primitives between frames can leave
  Chromium's compiled filter stale.
- SFX `lib/sfx-invert-{max,min,short}.mp3` from `Simple_Invert_*.mp3`, lead-in trimmed (Rule 7).
  Pack also ships `Simple_Invert_Med/Only_One` — no Invert preview/sequence uses them here.
- QA note: preview mp4s are 25→29.97 conversions with FRAME BLENDING; their flat-gray frames
  are pulldown artifacts (clean + negated neighbor ≈ 50% gray), not content.

---

## GLITCH / Cinematic Monitor: all 9 built ✅ (2026-07-04, awaiting Mike's review)

`monitor-max-1/2/3` (0.8s), `monitor-min-1/2/3` (0.28s), `monitor-short-1/2/3` (0.4-0.44s) —
rendered + in the gallery. Engine: `remotion/src/transitions/engines/GlitchCinematicMonitor.tsx`.

Mechanism (per-clip extraction of all 9 sequences, `_extract-monitor.js` → `_monitor-clips.json`):
- **t1 "Texture Adjustment" windows** — full-frame wrap Offset jolts, real per-window vectors.
- **t2 Wave Warp** (type 7, height 120, width 41.4, speed 2) — row-strip tearing. Reproduced as
  procedurally-seeded quantized band displacement from those params (**fidelity: approximate** —
  the source is a procedural AE effect; the exact noise phase can't be extracted).
- **t3 "HST Adjustment"** — keyframed vertical jitter roll (real curves). Its decay envelope +
  the jolt windows also gate the tear intensity (the source's own settle signals; a constant-param
  Wave Warp alone never settles, the preview does).
- **t4 overlay plate** `Cinematic Monitor <V> <n>.mp4` — real per-variant plates
  (`lib/plates/monitor-*`), **Pin Light** blend (Premiere mode 17) implemented EXACTLY as a
  darken(2s) + lighten(2s−1) CSS layer pair with SVG component-transfer filters. Plates play from
  their real IN-POINTS (Max 0.08s / Short 0.16-0.2s / Min 0.24s — NOT from 0).
- SFX `lib/sfx-monitor-{max,min,short}.mp3`, lead-in silence trimmed (Rule 7).
- The family folder's `Strips Displacement` / `Blocks Big` plates are bin imports only — no Monitor
  sequence references them (verified: zero mask/matte components on any clip).

QA: frame-by-frame vs pack previews at glitch peak + 2 points, all 3 families — bar rows, static
rows, green signal lines, smear band all align. Honest gap: preview torn rows carry horizontal
motion-smear, ours are sharper.

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
