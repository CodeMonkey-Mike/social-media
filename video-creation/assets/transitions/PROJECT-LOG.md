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

## GLITCH / Turbulent Displace: all 10 built ✅ (2026-07-05, awaiting Mike's review)

`turbulent-h-1x…5x`, `turbulent-v-1x…5x` (0.28-0.48s) — rendered + in the gallery
(`browse/GLITCH/Turbulent Displace/`). Engine:
`remotion/src/transitions/engines/GlitchTurbulentDisplace.tsx`. **fidelity: approximate**
(the only family so far whose LOOK is a procedural AE effect with no plates at all).

Mechanism (`_extract-turbdisp.js` → `_turbdisp-clips.json` → `_build-turbdisp-rows.js`):
- t2 (full length): AE **Turbulent Displace** — Displacement enum 9=Horizontal / 8=Vertical
  (1-based counting the popup separator, Invert-enum convention), Amount keyframed
  0→110..300→0 peaking AT the cut, Size 10..80, Complexity 5.1, Evolution 0→1080°,
  per-variant Random Seed, Pinning 0.
- t1 pair (split at the cut): the Offset/Monitor-verified HST fringe — Tint black→GREEN +
  Emboss (dir 90 H / 0 V, relief 5..20, contrast 70) + Pin Light. t2 sits ABOVE t1 →
  fringe first, then the turbulence displaces the fringed frame (Offset-family ordering).
- Engine: feTurbulence + feDisplacementMap driven by the real params; Evolution scrolls
  the field (AE morphs it in place — closest analog). CALIBRATION (the honest
  approximations, Wave-Warp standing): ONE smooth octave (feTurbulence's octave falloff
  is harsher than AE's; real Complexity 5 turns to fine marble, previews are laminar
  molten folds), anisotropic baseFrequency 1/(3·Size) along / 1/(1.5·Size) across the
  displaced axis, scale = 2×Amount. QA'd vs previews at peak both axes (S-curve folds,
  wavelength, edge tears match; H-5x and V-3x sheets in `_qa/turb/`).
- ENGINE NOTES: the displacement filter wraps the WHOLE 3×3 WrapLayer tile set (filtering
  inside each tile leaves white holes where sampling exits the tile); filter remounted
  per frame via frame-keyed id (stale-compiled-filter gotcha); axis isolation via
  feColorMatrix pinning B=0.5 and pointing the unused channel selector at B.
- SFX `lib/sfx-turbulent-{h,v}-Nx.mp3` = `Displacement_Turbulent.mp3` cut from each
  variant's REAL audio in-point (0.72/0.64/0.6/0.44/0.08, H and V pairs identical).

---

## GLITCH / Roughly: all 7 built ✅ (2026-07-05, awaiting Mike's review)

`roughly-1x…7x` (0.28-0.64s) — rendered + in the gallery (`browse/GLITCH/Roughly/`).
Engine: `remotion/src/transitions/engines/GlitchRoughly.tsx`. **fidelity: near-1:1** —
every window is the pack's REAL plate as a luma matte + real keyframes; nothing invented.

Mechanism (per-clip extraction `_extract-roughly.js` → `_roughly-clips.json` →
`_build-roughly-rows.js`; 4K project verified identical):
- Every effect window is a SubClip of the shared **"Texture Adjustment" utility sequence**
  (`_extract-texadj.js`) — a rack of the pack's plates at integer-second slots, each
  self-luma-matted (Set Matte2 matte=self / luminance / stretch-to-fit + zero AECrop):
  slot 120+(N-1) = `Different Fragments Nx`, slot 127+(N-2) = `Blocks Nx`. The window's
  in-point picks the slot (and a plate frame offset, e.g. Blocks windows start 0.12 into
  their slot = plate frame 3).
- **Mosaic window** (every variant, whole transition, pair split AT the A→B cut with
  continuous media = the cut point): content → Geometry2 Scale Height 125% → Mosaic
  314×174 (bottom-up order: Geometry2 listed last, applies first), shown through the
  `Different Fragments Nx` mask. 1x = this alone.
- **Offset window(s)** (2x-6x one, 7x stacks TWO — Blocks 7x + Blocks 3x): content
  wrap-shifted by the clip's keyframed Offset "Shift Center To" (dx,dy = raw − 0.5),
  shown through the `Blocks Nx` mask (plates carry GRAYS → partial alpha, baked into
  the mask PNGs `lib/masks/roughly-*`).
- **Semantics verified NUMERICALLY vs previews** (`_verify-roughly-mech.js`): the matted
  regions carry CONTENT chroma (≈50, baseline 48), not plate pixels (H1 would be ~0
  chroma / ~255 luma white) → the plates are mattes over effected content, same mechanism
  as the approved Blocks. And the matte is **SCREEN-FIXED** with effects applied to the
  content BENEATH (adjustment-layer semantics): changed-region IoU vs preview = 0.22
  static vs 0.09 stretched (frag), 0.12 static vs 0.02 travelling (blocks). First build
  had effects-on-matted-output — wrong, fixed before delivery.
- **Mosaic implemented EXACTLY** as cell-center sampling: an SVG `feDisplacementMap`
  driven by a generated sawtooth map (R=dx,G=dy to cell center, scale 16, quantization
  0.06px; `colorInterpolationFilters="sRGB"`, `filterUnits="userSpaceOnUse"`). Verified
  cell pitch ~6.1px in the render. Cells are 6.1px at 1080p by the FullHD project's own
  numbers; the pack previews show ~12.7px cells because they were rendered from the 4K
  project (3996/314) — ours is correct for a 1080p library.
- SFX `lib/sfx-roughly-Nx.mp3` = `Composite_Roughly_Only_Displacement.mp3` cut from each
  variant's REAL per-variant audio in-point (0 / 0.08 / 0.64 / 0.08 / 0.44 / 0.24 / 0.04).
- QA sheets `_qa/roughly/qa_sheet_2x.png`, `qa_sheet_7x.png` (preview vs render at
  matching times). Honest caveat: visibility differs with content — mosaic over flat/dark
  areas is invisible by nature, so intensity reads lower on quiet footage than the neon
  preview; structure/timing/masks match.
- Tooling gotcha: converting plates with a `color=` source needs `-frames:v N` — it is
  INFINITE and alphamerge won't stop it (one runaway produced 108k PNGs).

---

## GLITCH / Offset: all 7 built ✅ (2026-07-05, awaiting Mike's review)

`glitchoffset-1x…7x` (0.4-0.88s) — rendered + in the gallery (`browse/GLITCH/Offset/`).
Engine: `remotion/src/transitions/engines/GlitchOffset.tsx`. **fidelity: near-1:1** —
no plates; the whole transition is keyframed, every value from the project.

Mechanism (per-clip extraction of all 7 sequences, `_extract-offset.js` → `_offset-clips.json`
→ `_build-offset-rows.js`):
- **t2 adjustment pair**: ONE keyframed full-frame wrap Offset (y only — x static 0.5 in
  all 7), 25fps keyframes in media time (in-point 0.88); the two clips stitch a single
  continuous roll curve across the cut (t_seq = clip.start + kf.t − inPoint). Amplitude
  scales with density: 1x = one ±0.2-screen bump, 7x = ±1.8 screens (multiple full wraps).
  The A→B cut hides at the first clip's end (0.12-0.24s), inside the first big jump.
- **t1 "Abberations"/"Deviation" window** (straddles the cut): Offset tiny +y (0.28-0.74%),
  Emboss dir 180 / relief 3-8 / contrast 60, Tint black→GREEN white→BLACK (ff00ff00 /
  ff000000), Pin Light — same HST recipe as Glitch Monitor's t1, bottom-up order
  (tint → emboss → offset → pin light). Reads as green/magenta fringes on edges.
  **Emboss orientation settled empirically**: residual analysis vs the preview (target
  minus rolled clean frame) is G-channel-dominated with green-above/magenta-below pairs
  → VERTICAL kernel, green on TOP edges of bright objects; the literal "180° = horizontal"
  reading and both flipped signs score worse (MSE + residual correlation,
  `_verify-offset-sign.js` — method mirrors the Invert numeric verification).
- **NO SFX — verified 3 ways** (FullHD + 4K sequences both have EMPTY audio groups,
  previews are video-only, no Offset-named file in `(Footage)/Sound`). Rows ship
  `hasSound:false` per Rule 2 (don't invent a mapping); add a hit manually if an edit
  needs one.

ENGINE GOTCHAS (cost one re-render): (a) content must be a Remotion `<Img>`, NOT a CSS
`background-image` — Remotion only waits for `<Img>` loads, so scene B rendered black on
its first engine frames; (b) the filtered layer needs an `overflow:hidden` wrapper per
WrapLayer tile or the 140% filter region smears white bands across neighbor tiles (the
Monitor ghost pipeline already had this wrapper — keep it).

---

## GLITCH / Monitor: all 8 built ✅ (2026-07-04, awaiting Mike's review)

`glitchmonitor-1…8` (0.52-0.64s) — rendered + in the gallery (`browse/GLITCH/Monitor/`).
Engine: `remotion/src/transitions/engines/GlitchMonitor.tsx`. **fidelity: approximate.**

Mechanism (per-clip extraction of all 8 sequences, `_extract-glitchmonitor.js` →
`_glitchmonitor-clips.json` → `_build-glitchmonitor-rows.js`); every variant has the SAME
5-track recipe, cut always at **0.16s**:
- **t4 plate** `Glitch Monitor <n>.mp4` (flat 50% gray + colored signal BANDS with baked
  smear texture, in-point 0) — Pin Light, the family's dominant look. `lib/plates/glitchmonitor-<n>`.
- **t3 offsets**: two constant full-frame wrap Offsets split at the 0.16 cut (dx/dy = raw − 0.5).
- **t2**: Fast Blur 100 + Geometry2 Scale Height 150 — the smear/stretch.
- **t1 "HST Adjustment"** (window straddles the cut, varies per variant): Offset +0.36% x,
  Emboss 90°/7px/70%, Tint black→GREEN white→BLACK, Pin Light → green scan-relief lines.
  Components apply BOTTOM-UP (Tint before Emboss), per the Invert-verified rule.
- SFX `lib/sfx-glitchmonitor-<n>.mp3` from `Glitch_Overlay_1_0<n>.mp3` — the 1:1 n↔n mapping
  verified by walking each sequence's audio track in the XML (Rule 7 lead-in trim applied).

Approximations (documented honestly):
- The FullHD project carries t1-t3 as STATIC params, but the pack previews clearly ramp in and
  settle (same situation as Cinematic Monitor's constant Wave Warp). The engine gates the ghost
  copy (offset+blur+stretch, compounded in source order: offset wraps the CROPPED blurred/stretched
  frame — that's what carves the strip seams) with an envelope rising over [hst.t0 → cut] and
  falling over [cut → hst.t1 + 0.05]; the sharp base stays underneath. Peak blur sigma capped at
  blurriness×0.2 (full 100/3 obliterates; previews stay readable — QA'd).
- The pack's peak has harder row-chop displacement (baked into its plate smears); ours reads as a
  smoother smear + wrap seam. Bands/colors/settle match.

ENGINE GOTCHA (cost 2 re-renders): the emboss MUST be a `feConvolveMatrix` with
`preserveAlpha="true"` (straight-RGB math). An arithmetic `feComposite` (k2=c, k3=−c, k4=0.5)
collapses alpha to 0.5 and Chromium un-premultiplies the whole frame toward WHITE (same alpha
trap as the Invert engine's k-composite). Also: CSS `mix-blend-mode` children inside a
filtered/stretched parent do NOT composite in headless Chromium — the HST Pin Light is done
in-filter (feBlend darken/lighten vs SourceGraphic) for the ghost pipeline.

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
