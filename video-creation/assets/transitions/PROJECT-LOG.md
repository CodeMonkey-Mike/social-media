# Transition Library — Project Log

_Re-creating the **Swiftly Studio 850 Seamless Transitions** Premiere pack as a browsable
Remotion transition library. Last updated: 2026-07-13._

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

## SHAKE: ALL 34 built ✅ (2026-07-13, awaiting Mike's review) — CATEGORY COMPLETE

`shake-{hit-1..6x, horizontal-1..7x, long-1..7x, short-1..7x, skew-1..7x}` — NEW engine
`remotion/src/transitions/engines/ShakeJolt.tsx`, browse `browse/SHAKE/<Sub>/`. Durations:
Hit 0.4 · Horizontal/Skew 0.36-0.72 · Long 0.96 · Short 0.56. **fidelity: approximate**
(geometry near-1:1 — real curves; the Deviation fringe mechanism is swapped, look preserved).

**Mechanism** (`_extract-shake.js` → `_shake-clips.json` → `_build-shake-rows.js`): ONE
full-window rig2 adjustment (Offset 0:0 quadrant swap + Replicate 2 + 4 Mirrors + STATIC
Scale 200 = mirror-padded IDENTITY, center anchor) carrying a continuous 25fps-keyed
camera shake — Position jolts (±3-6%) + **Rotation** (Hit/Long/Short) or **Skew**
(Skew subgroup: Axis 0 = skewX, verticals lean; Horizontal: **Axis 90 = skewY**, horizontals
tilt — a builder assert caught the axis difference). All curves are real bezier handles and
every shake ENDS AT REST (asserted). **The A→B cut hides MID-SHAKE at the split between two
media-continuous "Deviation" clips** — same Tint black→RED white→BLUE + Emboss + Pin Light
R/B fringe as PERSPECTIVE Hit, bracketing the cut; Emboss dir 45 (Hit/Long/Short, diagonal
shift) / 90 (Horizontal/Skew, horizontal shift — the GlitchOffset θ→(sin,cos) rule), relief
scales with the variant's intensity (3-10 → shift 2-7px). Engine: ONE continuous pose (no
per-side clamping — the same adjustment rides A and B), 3×3 mirror tiles, 16-sample shutter
accumulation (rotation/skew blur included per sample), window-gated to identity outside the
rig clip. ~20-45s/demo (blur active most of the window).

**NO SFX — verified 3 ways** (FullHD audio groups empty in all 34, previews VIDEO-ONLY, no
Shake file in Sound/) → `hasSound:false`, add a hit manually when editing. NOTE: the pack's
own previews demo SHAKE over ONE continuous scene (their choice; the Deviation split is a
real editorial cut) — our demos render A→B to show the transition use; flip to same-scene
demos via demoSameScene if preferred. Previews are NATIVE 25fps (like MOTION).

QA: 34 frame-aligned 12.5fps sweep sheets (`_qa-shake-sweep.js` → `_qa/shake/`) + full-res
compares (Hit 6x + Skew 7x probes, Horizontal 5x fringe frames at t=0.32/0.40): jolt
amplitude/decay, shear direction per axis, fringe hue + orientation (horizontal split on
dir-90 subgroups) and settle timing all track the previews.

---

## PERSPECTIVE: ALL 72 built ✅ (2026-07-13, awaiting Mike's review) — CATEGORY COMPLETE

`perspective-{ease-in,ease-out,hit-in,hit-out}[-short]-{8 dirs}` (64) +
`perspective-pan-3d[-short]-{down,left,right,up}` (8) — ONE engine
`remotion/src/transitions/engines/PerspectiveEase.tsx`, browse `browse/PERSPECTIVE/<Sub>/`.
Durations: Ease 0.84/0.44 · Hit In 0.76/0.4 · Hit Out 0.8/0.4 · Pan 3D 1.0/0.52.
**fidelity: near-1:1 (Ease + Pan 3D), approximate (Hit — the Deviation fringe mechanism is
swapped, look preserved; OFFSET Hit precedent).**

**Pan 3D subgroup (the "3D" one, added last):** (In) = rig2 on A, CENTER-anchored, with the
Geometry2 **Position KEYFRAMED (a PAN)** to the direction point (~±0.37 screen, hand-placed
values) while scale eases 200→150 — A shrinks to 75% gliding off over mirror padding. (Out) =
plain Geometry2 on B, scale 200→100 with Position sliding in from the OPPOSITE edge to center
(continuous camera motion through the cut), UNDER a separate **"Corner" adjustment clip: a
keyframed AE Corner Pin** — the entering edge starts stretched to 3× frame height/width
(corners at −1 and +2) and flattens to identity = the 3D keystone swing. Engine additions:
per-phase optional `pan` 2D curve (bezier handles, path-length-normalized velocities — the
OffsetSlide sampleCurve2D convention) + `cornerPin` block rendered as an EXACT homography
(the MotionShake closed-form 4-point matrix3d solve), sampled per FRAME around the blurred
accumulation (the Corner clip carries no shutter of its own — AE blurs t1 first, then pins).
Sequence names carry a trailing "Ease" ("Perspective Pan 3D Ease - Right") that the ids drop.
SFX `Camera_01.wav` (exactly 1.0s) @0 from 0 → `sfx-perspective-pan3d-{100,52}.mp3`. QA: 8
sweep sheets + full-res keystone compares (Down at t=0.40/0.52) — the entry fan-out geometry,
pan pacing and settle match; residual = content density (their glass facade vs our spiky towers).

**Mechanism** (`_extract-perspective.js` → `_perspective-clips.json` → `_build-perspective-rows.js`):
every phase = a uniform zoom of the current scene about a PINNED point; direction lives ONLY in
the Geometry2 anchor/position. Three phase kinds:
- **plain** (norm 100): raw Geometry2, anchor == position == the direction point, scale always ≥1.
- **rig2** (norm 200): **`Offset 0:0` is NOT a no-op — it's a HALF-FRAME wrap shift (raw − 0.5)**
  that quadrant-swaps the frame so Replicate(2)'s 2×2 grid recomposes ONE coherent half-size copy
  at grid center; the 4 Mirrors (ExpandPan padding-rig constants) build TRUE mirror padding.
  Identity at scale 200; anchor = 0.25 + p/2 (quarter map).
- **rig3** (norm 300, Hit In's slam): Replicate(3) + Mirrors at the 1/3 lines, **NO Offset (an odd
  grid centers itself)**; anchor = 1/3 + p/3, hand-placed with tiny jitter on some rows (REAL
  values shipped, not snapped).
Family shapes (all 8 dirs share ONE curve pair per family): **Ease In** = plain 100→300 whip-zoom
into the direction point (1401 %/s into the cut) | rig2 135→200 pinned ease-up. **Ease Out** =
rig2 200→135 (A RECEDES pinned, slow start ov=0/oi≈1) | plain 300→100 (B launches at −3341 %/s out
of a deep zoom, long settle). **Hit In** = plain 100→300 | rig3 150→300 SLAM (0.12s) + Shake +
Deviation. **Hit Out** = rig2 recede | plain 300→100 SLAM (0.12s) + Shake + Deviation.
- **Shake** (Hit): a rig2-IDENTITY window right after the slam + the real keyframed Position
  jitter (±3%, 6 kfs, ends at rest) — mirror padding covers the jolts; sampled linearly (dense
  25fps bake), jitter blurred by the same shutter accumulation.
- **Deviation** (Hit): **Tint black→RED white→BLUE (ARGB16 ff00ff0000000000 / ff0000000000ff00 —
  the white end is NOT black; first read pattern-matched it to OFFSET-Hit "green" and the preview
  proved that WRONG: fringes are ORANGE/BLUE)** + Emboss 45/10/70 + Pin Light = an R/B split along
  the 45° diagonal. Implemented fast as R shifted (+7,+7) / B shifted (−7,−7) / G in place
  (feConvolveMatrix is the known Chromium perf cliff). NOTE for Mike: OFFSET Hit's deviation
  carries the SAME two tint values — its green-shift fringe may deserve this same R/B correction
  (not touched: Rule 3, that family is already built awaiting review).
- **Hit Short slam clips TRUNCATE their curves** (the OFFSET Long-Hit window-gating lesson): the
  (Out) window is ONE 25fps frame (0.04s) while its kf curve spans 0.12s — the zoom hard-SNAPS
  mid-flight into the shake. That snap IS the pack's hit; the engine gates every phase by window.
- Pack data quirks: subclip names are COPY-PASTED across directions and Hit In's "(In" is missing
  its close paren → the builder classifies phases by SHAPE + ORDER, never by name; "Perspective
  Hit Out" sequence names carry a DOUBLE SPACE.
- Engine: per-phase {win, kfs, norm, cx/cy content anchor, fx/fy frame pin, mirror}; piecewise
  bezier sampling (OFFSET pattern); mirror tiles only on exposable sides; **shutter blur =
  16-sample accumulation across the centered 0.5-frame exposure** (AE's own default), k-th layer
  at opacity 1/k, collapsed to 1 sample when still. ~8-21s/demo. Schema refactor regression-checked:
  old vs new Ease In render diff = isolated edge-AA pixels only (YAVG ≈ 0 every frame).
- Builder hard-fails on any deviation: phase templates per family, rig constants, quarter/third
  anchor maps, tint pair, emboss 45/10/70, Pin Light, shake ends at rest, rate-1 clips, audio.

SFX by MEASURED (media, start, in-point, window), asserted: Ease In = `Spin_01` @0 from 0 →
`sfx-perspective-ease-{84,44}`; Ease Out = `Spin_01` @0.04 from ip 0.048 (lead baked) →
`sfx-perspective-easeout-{84,44}`; Hit long = `Optics_02` @0.04 from 0 (lead baked) →
`sfx-perspective-hit-{76,80}`; Hit Short = `Optics_02` @0 → `sfx-perspective-hit-40`.

QA: 64 frame-aligned 12.5fps sweep sheets (`_qa-perspective-sweep.js` → `_qa/perspective/`) +
full-res compares (Ease In Right ×4 timestamps; Hit In Right slam + deviation-window frame rows
`probe/dev_cmp2.png`): whip/recede smear directions, cut-frame geometry (mirror seam at exactly
0.325 = 135/200), padding sides (the preview's own watermark appears MIRRORED/flipped in the
padding — instant visual proof of pin side), slam pacing, fringe hue/orientation, and settle
cadence all match frame-for-frame. Honest caveats: previews are 25→29.97 pulldown-blended
(±half-frame slop), our 16-sample blur reads marginally crisper on busy content, and the shake
jitter is sampled linearly between its baked keys.

---

## MOTION: ALL 55 built ✅ (2026-07-12, awaiting Mike's review) — CATEGORY COMPLETE; SINGLE-SCENE MOVES

`motion-3d-offset-*` 16 + `motion-3d-orbit-*` 16 + `motion-3d-pan-*` 8 (engine **Motion3D**, 5s)
+ `motion-shake-3d-*` 5 + `motion-shake-optics-*` 6 + `motion-shake-simple-*` 4 (engine
**MotionShake**, 2s). Browse `browse/MOTION/<Sub>/`. **These are NOT A→B transitions** — Mike's
single-image showcase moves (receipts/articles): every row ships `demoSameScene: true`, demos
render over ONE image, `sfx: null` + `hasSound: false` (verified 3 ways: empty audio groups,
silent previews — MOTION previews are also NATIVE 25fps, no pulldown — and no Sound files).

**Motion3D** (fidelity approximate): three adjustment layers — t1 keyframed Geometry2 Position
drift, t2 AE Basic 3D pose (Swivel/Tilt/Distance; static for Offset, keyframed orbit/pan for
Orbit/Pan) + static Geometry2 offset/rotation, t3 accents = Lens −1..−? + MASKED Mettle glitch
(faint chromatic fringe) + MASKED Gaussian blur (accent values vary per variant, 15-20).
The masks are an INVERTED rounded diamond with 276-484px feather = a soft DEPTH-OF-FIELD EDGE
VIGNETTE (center sharp) → radial-gradient-masked blurred+fringed overlay. Direction variants
carry the SAME H/V flip on ALL THREE layers and previews show UPRIGHT content → flips mirror
the MOTION only, resolved analytically in the builder (mirror drift/geoPos, negate
swivel/tilt/geoRot per axis — the GLASS pattern). CSS perspective implementation
(PERSP_PX=1600, DIST_PX_PER_UNIT=12 preview-calibrated; 3×3 overscan covers exposed edges).

**MotionShake**: each variant slices the first ~2s of its own 60s BAKED wiggle master
(1500 kfs @25fps — builder TRIMS to the window, ~53 kfs/param, keeping library.json sane).
Shake 3D/Optics = AE Corner Pin per-frame corners → EXACT per-frame homography via CSS
matrix3d (closed-form 4-point solve) — near-1:1; Optics adds static Lens Distortion (−7..−25,
scales with intensity) via the proven chained-displacement lens pipeline (approximate; ~2.5
min/demo render). Shake Simple = baked Position+Rotation + ScaleH 104 overscan — near-1:1.

Gotchas: accent values and lens curvatures VARY per variant (first asserts were too strict);
render cost — 5s Motion3D demos ≈ 90-100s each (accent filter per frame), full batch ≈ 80 min.
QA `_qa-motion-sweep.js` (10fps both sides) → `_qa/motion/`.

---

## MELT: ALL 30 built ✅ (2026-07-12, awaiting Mike's review) — CATEGORY COMPLETE

`melt-equidistant-{1..4}` (+`-short-`, 0.84/0.44s) — engine **MeltEquidistant**;
`melt-rgb-{1..7}`, `melt-rgb-soft-{1..4}` (+`-short-` twins; 0.76/0.84/0.44/0.6s) — engine
**MeltRGB**. Browse `browse/MELT/{Equidistant,Equidistant Short,RGB,RGB Short}/` (Soft lives
inside RGB / RGB Short, mirroring the pack tree). **fidelity: approximate** both.

**Equidistant** = `AE.ADBE VR Projection` (proj enum 1), ONE keyframed rotation per variant:
Tilt ±90 (1/2) or Roll ±90 (3/4) — A melts into the equirect POLE-SINGULARITY vortices at the
cut, B unwinds back (real eased tails). Implemented as the library's FIRST CANVAS ENGINE:
per-pixel inverse equirect→rotate→equirect reprojection (longitude wraps, latitude clamps) —
SVG filters cannot express a wrapping full-frame warp. QA: the double-vortex collapse matches
the preview structurally (differences = content density + a slightly faster preview mid-decay).
**Canvas is IMAGE-content only for now** — the TransitionClip video path needs a video→canvas
frame feed (documented TODO; pick another family for video cuts until then).

**RGB** (Mike flagged the coloring — handled with care): `AE.Mettle SkyBox Chromatic
Aberrations` (third-party, closed), keyframed per-channel amounts (7 recipes: 50/−50/−50,
−71/+69/+10, …; Soft +72/−28/−81 @ Falloff 50) + a keyframed 2D Point of Interest DRIFTING
OFF-FRAME (RGB-3 vs 4 differ ONLY in POI path). KEY MODEL: radial CA of amount s = uniform
SCALE r'=r(1+s) about the POI → THREE channel-isolated copies CSS-scaled about the drifting
center, recombined with plus-lighter (blend outer / channel filter inner). NO maps, no 8-bit
wall. **Falloff Invert (Soft 2-4 + Soft Short 2-4, caught by a builder assert):** the split is
strongest NEAR the POI → scaled copy revealed through a radial-gradient mask over the unscaled
base (preview-matched: locally split, coherent far away). Calibration: SCALE_PER_AB=0.006
(ab 50 @ falloff 100 ≈ 30% scale; the first 12% guess was far too subtle — peak QA'd), falloff
normalizes 100/falloff. Honest caveats: the plugin's smears curve slightly (spherical-aware
even in mono layout) where ours stay affine-straight; peak energy/palette/drift match.

SFX: Equidistant → `Optics_02.wav`, RGB → `Lens_01.wav`, all in-point 0, window-truncated per
duration → 6 lib files (`sfx-melt-eq-{84,44}`, `sfx-melt-rgb-{76,84,44,60}`). Soft-4 uses
lowercase "(in)" (the Long Simple gotcha again — match case-insensitively). QA sweep
`_qa-melt-sweep.js` → `_qa/melt/` (30 sheets + peak/grid compares).

---

## LIGHT LEAKS: ALL 34 built ✅ (2026-07-12, awaiting Mike's review) — CATEGORY COMPLETE

`lightleaks-{1..8}` (1.12s, cut 0.32) + `lightleaks-short-{1..8}` (0.4s, cut 0.16) +
`lightleaks-soft-{1..9}` (1.44s, cut 0.32) + `lightleaks-soft-short-{1..9}` (0.4s, cut 0.16) —
ONE engine `remotion/src/transitions/engines/LightLeaks.tsx`, browse `browse/LIGHT LEAKS/<Sub>/`.
**fidelity: approximate** (real plates/maps/curves/colors; blend + recolor + blur/procamp
transfer are the calibrated pieces, all documented).

**v2 — THE BLUR IS MAP-MATTED (found via the Soft subgroup, retrofitted to Light Leaks the same
day):** the Blur clips are **Texture Adjustment rack windows** (the Roughly rack semantics!) —
slots 0-14 hold `Blur Map 1..8`, slots 16-32 hold `Blur Map VH 1..9`: self-luma-matted ANIMATED
GRADIENT videos, so the blur/flash envelope SWEEPS across the frame instead of hitting it
full-frame (v1's whole-frame envelope was wrong — the sweep even explains v1's "ours blurrier at
t=0.6" QA residual). Maps ship as 960x540 alpha-PNG sequences (`lib/leaks/maps/bm*/bmvh*`,
fps=30) applied as per-frame CSS masks over an effected content copy (mask on the outer div,
filter on the inner). Short reads its slot from a PER-VARIANT offset 0.12-0.2 in (envelope
timing shifts slightly per variant — real data).

**Subgroup mechanics:**
- **Light Leaks / Short**: nested "Pre Light Leaks N" plate stacks (recolors via ARGB16
  Change To Color), screen-composited crisp above; Short = same stacks windowed 0.36s.
  Deviation rack slot 151 / 151.2 (flat Color Matte) — visually nil, unrendered.
- **Soft / Soft Short**: NO Deviation, NO nested stack — TWO `_Simple Light Leaks` files
  (4 exist; each variant pairs two different ones), split at the cut, over the VH map matte.
  **TIME REMAPPING (new decode — the extractor now captures `TimeRemapping`):** the (In) clip
  plays its file BACKWARD (media 1.16→0 over 0.36s, uniform across all 18) so the leak
  CRESCENDOS into the cut; the (Out) remap CANCELS its 0.04 in-point (media starts at 0 at the
  window start, rate 1.16/1.12). Implemented as PRE-REVERSED assets (`lightleaks-soft-N-rev`)
  played forward at the remap rate — exact for the linear remap; OffthreadVideo cannot reverse.
  Without the remap the (In) leak read nuclear-at-start instead of dark (probe QA caught it —
  ALWAYS check clips whose file-strip brightness contradicts the preview for time remaps).
- **CONSTANT CLIP RATES stack on top of remaps** (the second speed trap, caught when Short-3 ran
  ~0.15s late in the sweep): a clip whose MEDIA SPAN (OutPoint−InPoint) ≠ its timeline window
  plays at rate = span/window even with NO TimeRemapping — Short plays its Pre stack at 2.7x,
  and Soft Short SQUEEZES its remapped leaks a further 2x/5.6x (net 6.44x reversed / 5.8x).
  Extract OutPoint for EVERY clip and multiply remap slope by the clip rate.

SFX: `Simple_SFX.mp3` from 0 in all 34, window-truncated per subgroup → `sfx-lightleaks.mp3`
(1.12s), `sfx-lightleaks-40.mp3` (0.4s, Short + Soft Short), `sfx-lightleaks-soft.mp3` (1.36s).

**Mechanism** (`_extract-lightleaks.js` + nested `_extract-lightleaks-nested.js` →
`_build-lightleaks-rows.js`): content under a SHARED envelope — Gaussian Blur 0→35→0 peaking at
the cut + ProcAmp flash (Brightness 0→25→0, Contrast 100→200→100, 0.16..0.68) — with the pack's
REAL leak plates (1-3 per variant) screen-composited ABOVE the blurred content (real track
order: leaks stay crisp). Variant layers live in nested **"Pre Light Leaks N"** sequences (the
"(Open it to change colors)" SubClip aliases them — resolve SubClip→MasterClip to find the real
sequence name); "Change color here" layers carry Change To Color → **ARGB16-packed targets**
(#0024FF blue / #F600FF magenta / #FF9C00 orange / #FF00A2 pink). All 8 variants share ONE
envelope (each variant's Blur clips read 2s slots of one rack timeline — kfs are slot-relative).
SFX `Simple_SFX.mp3` from 0, full 1.12s window → `lib/sfx-lightleaks.mp3`. Plates (audio
stripped) → `lib/leaks/lightleaks-*.mp4` (20 files, exactly 1.0s @25fps each = the leak window).

**Decode + engine notes (each cost a probe render or a decode detour):**
- The **"Deviation" clip = Texture Adjustment rack slot 151** (the Roughly/TVSat shared rack) —
  a flat Color Matte + Emboss + green Tint, **verified VISUALLY NIL** (preview window-edge A/B:
  YMAX diff 13). Ships documented but unrendered.
- The leak stack's **Blend Mode param pair (22,0)/(22,10) fits no verified enum reading** (the
  pair carries TWO different enums: ParameterID 2 bounds 0..26 = Premiere UI list, ParameterID 3
  bounds 0..31 = the AE 32-mode list — decoded from raw param bounds). The previews PROVE all
  layers composite additively with recolors active (plate-1 rainbow AND recolored 1a bokeh
  visible simultaneously at clean timestamps) → implemented as SCREEN, preview-matched.
- **Headless-Chromium compositing rule #2 (new): filter and mix-blend-mode must NOT sit on the
  SAME element** — the recolored layers rendered INVISIBLE until the blend moved to an outer
  wrapper with the colorize filter on an inner child. (Rule #1, from Monitor: blend layers must
  be siblings of a filtered div, never children.)
- ChangeToColor ≈ **HSL(H_target, S_target, L_source)** per-channel lookup tables
  (feComponentTransfer) — preserves source lightness so recolored bokeh stays BRIGHT with white
  cores (the first model, To·L+(1−To)·L³, dimmed the mids; caught on the probe grid).
- AE Gaussian Blur Blurriness → σ ≈ **b/4** (b/2 read far too soft), and **compare at the
  preview's NATIVE 480×270** — upscaling the preview while downscaling ours systematically
  exaggerates our blur (bit the first probe QA).
- Truncation gotcha: 16-digit color values printed via a `.slice(0,16)` dump DECODE AS GARBAGE —
  always BigInt the FULL param value (the ARGB16 layout is clean: 4×16-bit, 8-bit<<8 channels).

QA: native-res 4-timestamp grids (LL 1+6 v1, LL 1 v2, Short 1, Soft 1 pre/post-remap) + 34
frame-aligned sweep sheets (`_qa-lightleaks-sweep.js`, all 4 subgroups → `_qa/lightleaks/`):
leak structures, palette, flash timing, the map sweep and settle all track the previews.
Honest caveats: recolored-layer hue balance reads slightly more magenta than the preview on
LL-1 (recolor approximation), and the peak blowout breadth differs marginally (ProcAmp model).

---

## GLASS: ALL 40 built ✅ (Beveled 12 approved 2026-07-12; Beveled Short 12 + Blocks 4 + Blocks Corner 12 added same day, awaiting review) — GLASS CATEGORY COMPLETE

`glass-beveled-*` (12, Mike-approved) + `glass-beveled-short-*` (12, 0.8s) +
`glass-blocks-{1-left,1-right,2-horizontal,3-horizontal}` (4, 0.84s) +
`glass-blocks-corner-{1,2,3}-{left,right}-{up,down}` (12, 0.92s fam-1 / 0.8s fam-2/3) —
ONE engine `remotion/src/transitions/engines/GlassBeveled.tsx`, browse `browse/GLASS/<Sub>/`.
**fidelity: near-1:1 all 40** — geometry, masks, easings, stagger and compositing order are all
real project data; no plates, no procedural effects.

**Subgroup differences found in extraction (`_extract-glassrest.js` → `_glassrest-clips.json` →
`_build-glassrest-rows.js`), all on the same masked-wrap-Offset architecture:**
- **Beveled Short** = Beveled's exact masks + (In) curves at cut 0.32, but the **(Out) curves are
  SHIFTED EARLIER — the motion JUMPS AHEAD 0.44s at the cut** (the OFFSET-Short pattern; Beveled
  proper is continuous). The engine's piecewise curveIn/curveOut sampling covers it.
- **Blocks** = 7 axis-aligned RECTANGLE panes (row + column bands, variable per-pane durations
  0.76-1.0s) behind a **DOUBLE flip sandwich (H+V = 180° rotation)**; 2/3-Horizontal add the
  unmasked base push. Audio plays Skew_Simple_01 **from in-point 0.12** (unlike every other
  subgroup at 0) — sfx files are chosen by MEASURED (in, window), asserted in the builder.
- **Blocks Corner** = 8 panes: 4 row-bands pushing y + 4 column-bands pushing x — the corner
  diagonal is the COMPOSITION of single-axis stages (no diagonal offsets exist; end vectors are
  only ever 0.5:1.5 / 1.5:0.5). Engine change: wrap axis derived PER STAGE (rows are 'xy').
- **Corner 3 stacks the SAME panes in a DIFFERENT ORDER after the cut** ((Out) component list
  permuted vs (In) — matters where panes overlap). Caught by the hash-pairing assert; builder
  pairs stages BY MASK HASH and ships the (Out) apply order as `outOrder`; the engine reorders
  the chain after the cut. Corner renders are the slow ones (~90s/demo, 8-stage chains).

**Mechanism** (`_extract-glassbeveled.js` → `_glassbeveled-clips.json` → `_analyze-glassbeveled.js`
→ `_build-glassbeveled-rows.js`): the (In) [0.04..0.4] / (Out) [0.4..end] HST Adjustment pair,
each stacking **FIVE AEMask-gated wrap-Offsets**: every Offset shifts exactly ONE full frame
(0.5→1.5 = identity at both ends, real temporal-bezier handles) and is clipped to a straight-edged
quadrilateral **SHARD mask**; phases are TIME-STAGGERED (timeline starts 0.04/0.12/0.20/0.24/0.28,
0.76s each). Where shards overlap, the masked offsets COMPOUND bottom-up = the faceted
beveled-glass refraction; every phase ends at identity so the frame settles seamlessly. The
(In)/(Out) curves are exact continuations (verified: same handles, same phase at the cut — unlike
OFFSET Short's deliberate skip); the A→B swap at 0.4 lands at peak faceting. Four shard-mask sets
(A/B/C/D, shared across variants); direction = **flip sandwiches** (PR H/V Flip pairs around
subsets of the stack), resolved ANALYTICALLY in the builder (mirror mask + negate shift).
Beveled 3/4 flip only SOME shards (opposing-direction facets) + add a SIXTH unmasked full-frame
base push (0.96s H / 1.0s V). Builder hard-fails on curved mask vertices / non-default
feather/opacity/expansion / inverted or keyframed masks / mixed axes / unclosed sandwiches.

**KEY EXTRACTION FINDS (new — cost a day on OFFSET-family assumptions):**
- **Effect MASKS live in SubComponents** (`AE.ADBE AEMask` under each VideoFilterComponent),
  NOT in the Params list — a "5 uniform offsets, can't be the look" reading means CHECK
  SubComponents. Mask Path is an `ArbVideoComponentParam` with a **'2cin' binary blob**:
  header (magic, ver, flag, nVerts) then per vertex [separators + 6 f32 = anchor,inTan,outTan]
  in normalized frame coords (may extend past [0,1]; tangents==anchors ⇒ straight edges).
- **Premiere DEDUPS blobs by BinaryHash**: most StartKeyframeValue tags are SELF-CLOSED refs;
  exactly one occurrence in the file carries the inline base64 — build a hash→payload table first.
- The FullHD project IS authoritative here (masks byte-identical in 4K; the "demo assembly"
  suspicion was wrong for GLASS — the adjustment stacks are live).
- Engine: ONE SVG filter chain in real apply order; per stage the torus wrap = **two feOffset
  copies merged** (no feTile — untested primitive avoided), shard clip = feImage white-polygon
  data-URI + feComposite in/over, frame-cropped subregions, frame-keyed filter id, sRGB. No
  displacement maps ⇒ no 8-bit-wall risk. ~13-16s per demo render.

SFX: every GLASS variant plays `Skew_Simple_01.mp3`, but the CUT differs per subgroup → FOUR
lib files, each = source cut at the real in-point, truncated to the real audio-clip window
(OFFSET A/B rule), 0.04s lead delay baked, 30ms tail guard: `sfx-glassbeveled.mp3` (1.04s),
`sfx-glassbeveled-short.mp3` (0.8s — also Corner 2/3), `sfx-glassblocks.mp3` (0.84s, source
from 0.12!), `sfx-glassblockscorner-92.mp3` (0.92s, Corner 1).
QA (`_qa-glassbeveled-sweep.js`, now covering all 4 subgroups → `_qa/glassbeveled/`): 40
frame-aligned sweep sheets + full-res compares (Beveled 1-Left ×4 timestamps, 1-Up, 3-H, 4-V;
Short 1-Left ×2, Blocks 1-Left ×2, Corner 1-Left-Up ×2) — facet lean, stagger cadence, cascade
structure, rectangular pane grids, bidirectional splits and settle all match; the pack's own
preview also ends with the same sub-1% residual at its last frame. Honest caveats: residual
displacement at matching late timestamps reads slightly stronger than the preview on some
frames (the bezier-value interpretation is the only fitted piece), and previews are 25→29.97
pulldown-blended (~1-frame alignment slop).

---

## EXPAND / In · Out · Out In (+ Short): all 12 built ✅ (approved by Mike 2026-07-11) — EXPAND CATEGORY COMPLETE (20)

`expand-{in,out,out-in}[-short]-{horizontal,vertical}` (0.96s / 0.84s Out-V / 0.64s Short) —
engine `remotion/src/transitions/engines/ExpandZoom.tsx`, browse `browse/EXPAND/<Family>/`.
**fidelity: approximate** (shutter-blur grading + Mettle dispersion are calibrated; curves/values real).

**Mechanism** (`_extract-expandrest.js` → `_expandrest-clips.json` → `_build-expandzoom-rows.js`;
5 clips per sequence): two phases + two shared adjustment layers.
- **rig phases** = Replicate-3 + 4 Mirrors + Geometry2 Scale rig (Shutter 360), animated axis
  Scale 300→50 ⇒ **S = Scale/300: a COMPRESSION to 1/6 with mirrored-tile padding** filling the
  sides (identity at 300). ⚠️ First decode read this backwards as a 300/v stretch — the raw kf
  dump settles it, and the preview's squeeze reads as "smear" only because of the shutter blur.
- **crop phases** = AECrop BOTH sides keyframed 0→45→0 symmetrically ⇒ kept center sliver
  stretched to the frame, **S = 1/(1−2·crop/100), peak 10×**. Expand In's crop phase has NO
  Motion Blur effect (the 10× stretch IS the look); Out/Out In crop phases carry a real
  Blur Length 0→180→0 curve (uniform directional gaussian, sigma = len·0.55).
- Families: In = A squeeze | B stretch-relax; Out = A stretch | B decompress; Out In = crop both.
- Shared **"Glow"** adjustment = Motion Blur 300 static along the axis + opacity 0→100→0 peaking
  at the cut, blend pair (14,12) ⇒ Overlay. Shared **"Deviation"** = Mettle Master Amplitude
  0→100→0 chromatic pulse (reuses the DEVIATION linear map, DEV_EDGE_PX=18 — preview-matched at
  full res) + axis Scale pulse 100→110→100 multiplying the stretch.
- **Blur lessons (each cost a re-render):** (1) motion blur is SCREEN-SPACE — a gaussian INSIDE
  the scaleX(10) transform gets multiplied 10×; wrap the filter OUTSIDE the stretch. (2) rig
  Shutter-360 blur on a center-anchored squeeze is spatially graded (zero at center → huge at
  edges): ONE uniform gaussian reads as total wash, ONE gently-masked layer reads as "sharp+haze";
  the working approximation is TWO masked tiers (mid sigma·0.25 ramping in right off center,
  full sigma past ±25%), sigma = (ΔS/frame / S)·(dim/2)·0.7 capped 140, derivative window-clamped.
- Frame-aligned full-res QA vs previews (`_qa/offsetgeo/full-expand-in-h/cmp*.png`): In-H rig +
  crop phases, Out-H both phases, In-V vertical axis — motion character, fringing, settle match;
  residual = content density (their farm sliver → clean bands, our city center → soft gold masses).
SFX `Whoosh_02.wav` @ 0, truncated per family audio window → `lib/sfx-expandzoom-{96,84,60}.mp3`.

---

## EXPAND / Pan: all 8 built ✅ (2026-07-11, Mike's favorite — requested by name)

`expand-pan-{up,down,left,right}` (1.24s) + `expand-pan-short-*` (0.64s) — engine
`remotion/src/transitions/engines/ExpandPan.tsx`, browse `browse/EXPAND/Pan*/`.
**fidelity: near-1:1** — everything keyframed, pure CSS transforms, no filters.

**Mechanism** (`_extract-expandpan.js` → `_expandpan-clips.json` → `_build-expandpan-rows.js`;
5 clips per sequence): the T1 "Offset" rig = Offset(0,0) + Replicate(2) + 4 Mirrors + uniform
Scale 200% — decoded via pixel-simulation as "**frame with MIRRORED edge padding**" (nets to
identity at Position 0.5), panned by keyframed Geometry2 Position. The T2 (In)/(Out) windows
carry keyframed AECrop curves whose visible result (preview-verified: rows/cols collapse into
streak bands) is the **EXPAND edge-stretch**: the kept sliver stretches to fill the frame —
A smears out to one edge (crop → 99.5% in ~0.12s), then B starts as the opposite edge's sliver
(crop 99%) and expands back to identity over ~0.6s while the pan decelerates to rest. All
affine ⇒ sample x = anchor·crop + u·(1−crop) + pan over a 5-copy mirror-tiled strip = ONE CSS
translate+scale per frame. Anchor rule: 1 when the cropped side is the LOW-coordinate side
(Left/Top), else 0. **PAN SIGN GOTCHA (cost one re-render): Geometry2 Position +x = camera
pans right = content slides LEFT (−pan in the sampling); with the sign flipped the sampling
window crossed the mirror-copy boundary at heavy stretch → kaleidoscope "butterfly" artifacts
the preview doesn't have.** Frame-aligned QA vs previews: Right + Up sheets
(`_qa/offsetgeo/sbs_expand-pan-*.png`), band character/timing/settle match; residual = content
density (their sky obliterates at 14× stretch, our towers stay readable as smears). SFX
`Simple_SFX.mp3` @ real in-point 0.08, truncated to the family window (1.24s / 0.64s) →
`lib/sfx-expandpan{,-short}.mp3`.

---

## DEVIATION: Optics 1x-4x + Shift 4x built ✅ (2026-07-11, Mike's selection)

`deviation-optics-{1x..4x}` (0.2-0.48s) + `deviation-shift-4x` (0.32s) — Mike asked for ALL
Optics and ONLY Shift 4x. Engine `remotion/src/transitions/engines/DeviationGlitch.tsx`,
browse `browse/DEVIATION/`. **fidelity: approximate** — the whole family is built on the
THIRD-PARTY `AE.Mettle SkyBox Digital Glitch` plugin (closed algorithm), used with everything
OFF except a keyframed **Color Distortion 0→100→0 peaking AT the cut** (static field:
Rate/Evolution 0, seed 0, Complexity 1, GeomX/Y 100/83). Optics adds the Warp lens bulge
(Curvature 0→−30→0). Same (In)/(Out) piecewise architecture as OFFSET (media ip 0.88, bezier
handles, swap at the cut). Extraction `_extract-deviation.js` → `_deviation-clips.json` →
`_build-deviation-rows.js` (4K cross-checked byte-identical — note the extractor must honor
env SWXML or the "4K check" silently re-reads FullHD; fixed in `_extract-deviation4k.js`).

Look — **corrected after Mike's single-image check (the turbulence model was WRONG):** the
Mettle Color Distortion is **RADIAL SPECTRAL DISPERSION + a CONSTANT lateral split** — a prism
zoom: R scaled outward, B inward, G a whisper, fringes ~10px even at frame center growing to
~20-25px at edges, quiet-ish middle, subtle zoom pulse at peak. The first model (mean-zero
feTurbulence field) matched thumbnails on bright content but was nearly INVISIBLE on a dark
scene and put quiet zones in random places; testing on ONE continuous image (like the pack's
own previews do — `sameScene` prop added to TransitionDemo for exactly this) exposed it.
Implemented as per-channel displacement over a LINEAR radial map with a baked-in bias
(`_gen-lens-map.js` → `LINEAR_MAP`: dx = A2·(nx+0.55), dy = A2·0.83·ny, A2=45). **Calibration
went through TWO Mike-driven corrections:** (1) EDGE_PX=16 with G a whisper read as "hardly
anything" on the gallery demo; (2) final = EDGE_PX=30 with channel coefficients R 1.8 / G 1.0 /
B 0.2 — the common-mode ≈1.0 gives the actual "SHIFT" (a visible lateral jump via the map bias
+ zoom pulse at peak), and the R−B spread of 1.6 gives the aggressive spectra (every light on a
dark scene splits into full RGB). Gallery note: the Shift row carries `demoSameScene: true` —
its demo plays over ONE continuous image (TransitionDemo reads the flag; Mike's use case is
punch-ins/jump cuts of the same scene). Galleries now cache-bust (`?v=<mtime>`) because demo
filenames never change across re-renders and stale browser cache bit twice. Displacement
≤ ~70px → still NO 8-bit-wall issue (chained passes only needed for the lens, which reuses it).
**NO SFX — the pack ships this category silent** (FullHD + 4K audio groups empty, previews
video-only; `Optics_01/02.wav` in Sound/ is referenced by NO sequence — not inventing a
mapping, per Rule 7). QA: frame-aligned sheets vs previews (`_qa/offsetgeo/sbs_deviation-*`),
envelope ramp/peak/decay + swap frame align; full-size peak compare calibrated the field.
Remaining Deviation rows (Shift 1x-3x) intentionally NOT built (Mike's call).

---

## OFFSET: all 152 built ✅ (2026-07-11, awaiting Mike's review) — NEW CATEGORY COMPLETE

The first NON-glitch category: the pack's big **OFFSET** motion group = 19 sub-families × 8
directions = **152** sequences, ALL built. **112 pure-push** (near-1:1): Simple/Simple Short/Long
Simple; Ease/Ease Short/Ease Out/Ease Out Short/Long Ease/Long Ease Out; Bounce/Bounce Short;
Swinging/Swinging Short/Long Swinging. **40 hybrids** (approximate): **Warp** (16 — multi-wrap ease
+ keyframed Lens Distortion bulge) and **Hit** (24 — fast low-blur slam + green-emboss "Deviation"
glitch-fringe flash). ONE engine drives all 152 (optional `lens`/`deviation` param blocks for the
hybrids). id `offset-<variant>-<dir>`, engine `OffsetSlide`, browse `browse/OFFSET/<Variant>/`.

ONE engine covers all 152 (`remotion/src/transitions/engines/OffsetSlide.tsx`); variants are the
same mechanism, different keyframe curve + duration + direction. Extraction + decode:
`_extract-offsetgeo.js` → `_offsetgeo-clips.json` → `_analyze-offsetgeo.js` (family comparison) →
`_build-offsetgeo-rows.js` → 112 rows; `_render-offsetgeo.js` (bundle-once batch, marker-resume).

**Mechanism (per-clip extracted from the FullHD project, verified vs the pack previews):**
- Two "HST Adjustment" layers `(In)` [0..cut] and `(Out)` [cut..end] each carry a wrap-**Offset**
  "Shift Center To" curve. **They are NOT one continuous curve — sample PIECEWISE (2026-07-11 QA
  fix):** the (Out) curve is the same motion RE-KEYED and, in the Short variants, SHIFTED EARLIER —
  the transition **jumps ahead in the motion at the cut** (Ease Out Short: (In) reaches 0.9436 at
  seq 0.2, (Out) at 0.12 = a 0.08s skip, hidden under the blur; even non-Short Ease skips 0.04s).
  The first build merged both clips' keyframes into one union curve, which smoothed over the jump
  and distorted segment shapes. Engine params are now `curveIn`/`curveOut`, sampled by clip window,
  exactly as Premiere composites them. We **swap from→to AT the cut** (the (Out) start), which lands
  under peak motion blur. Naming gotcha: one sequence uses lowercase "(in)" (Long Simple - Right) —
  match case-insensitively.
- A top "Motion Blur" adjustment applies a **DIRECTIONAL** blur (one AE Direction + keyframed Blur
  Length 0→peak→0, peaking at the cut). This is the DOMINANT visual — at peak the frame is a near-
  pure smear along the push axis (preview-confirmed: a coffee cup smears to horizontal bands), which
  is what hides the swap. Alpha Adjust Opacity is a constant 100 across the whole family (no crossfade).
- Direction is encoded in the Offset END vector: Right `1.5:0.5`, Right Up `1.5:-0.5`, Right Down
  `1.5:1.5` (dx,dy ∈ {−1,0,+1}, AE y-down). "Long" variants shift **4 full widths** (0.5→4.5) = a
  fast multi-wrap streak; base/Short shift one width.

**Sub-family character (all just the offset curve + blur-length shape — no new effects):**
Simple = near-linear whip · Ease = ease-in-out w/ long low-blur settle · Ease Out = starts
mid-motion (fast) and decelerates · Bounce = overshoot to target then bounce back and settle ·
Swinging = overshoot PAST target then pendulum-swing back · Short/Long = compressed / multi-wrap.

**Engine notes (OffsetSlide.tsx):**
- **True directional motion blur** via a rotate sandwich: rotate the 3×3 wrap-tiled content so the
  push axis is horizontal → horizontal `feGaussianBlur "sigma 0"` → rotate back. Faithful diagonals
  (streak along the real ~29°/61° angle), not an axis-elliptical fake. `BLUR_K=0.55` (sigma per unit
  AE Blur Length ≈ variance-matched to a 2·length box). Angle computed from the net offset vector in
  px (`atan2(dy·H, dx·W)`), which equals the pack's own AE `Direction` (90−D).
- The offset slide is applied to the WHOLE rotated/blurred group in screen space (so it slides along
  the true direction); tiling makes the wrap seamless past the edges — no black gaps, QA-confirmed.
- **THE KEYFRAME EASING IS REAL AND EXTRACTABLE — 2026-07-11 QA failure + fix (Mike caught it).**
  First build interpolated keyframes with monotone-cubic (claiming AE handles "aren't recoverable")
  — WRONG twice: with only 2 keyframes monotone-cubic degenerates to LINEAR, and the handles ARE in
  the prproj. Raw keyframe row = `time, value, interpFlags(5,2), inVel, inInf, outVel, outInf,
  [spatial extras]` (velocity in value-units/sec, influence 0..1 of the segment). These carry the
  whole character: Hit's offset kf0 outInf=0.58 = sit still half the window then WHIP; Hit's blur
  BULGES to ~100 mid-segment via inVel −7.1e6 @ inf 1e-4 despite endpoint value 8 (that's the
  preview's huge smear — the bulge lives in the handles, not the endpoints). Engine evaluates the
  true cubic bezier in (time, progress) per segment (time-cubic solved by bisection; velocity
  normalized by the segment's path length for 2D / signed delta for scalars; progress MAY leave
  [0,1] inside a segment — that's the real value bulge, don't clamp). Verified frame-by-frame vs
  previews after the fix: Hit/Simple/Ease/Warp pacing signatures align. FullHD handles = 4K handles
  (byte-identical, cross-checked).
- Content via Remotion `<Img>` (not CSS background-image — Remotion only awaits `<Img>` loads).

**SFX — corrected TWICE 2026-07-11 (both times Mike heard the difference):**
- First trims (`silenceremove` + 0.9s cap + fade from 0.5s) chopped attacks arbitrarily and
  amputated ring-outs → rebuilt from the REAL project in-points, full length.
- Still "different": **the pack TRUNCATES each sound at the transition's end** (the audio clip
  window == the sequence window). Simple plays a tight 0.24s "tk", NOT the file's 0.86s whip;
  Mike's A/B vs Premiere flagged exactly the families whose windows are much shorter than the
  file (Simple 0.24/0.86, Warp Short 0.36/1.0) and passed the one where they match (Warp 1.0/1.0).
  FINAL build: cut at the real in-point AND truncate to the family's audio-clip window, 30ms tail
  guard → ONE file per family `lib/sfx-offset-<variant-slug>.mp3` (19 files; windows differ between
  families sharing a source). The wrapper ring-out policy (Rule 7, adopted for GLITCH) does NOT
  apply to this pack's OFFSET category — faithfulness = hard truncation, per Mike's A/B.

**QA — full systematic sweep 2026-07-11 (after Mike caught the first build's failures):**
`_qa-offsetgeo-sweep.js` builds preview-vs-render side-by-side sheets, frame-aligned from the
transition start → `_qa/offsetgeo/sweep/sbs_<fam>_<dir>.png`. ALL 19 sub-families reviewed on
Right + spot-checks on Up and Left Down (57 sheets): pacing signatures align frame-for-frame
(Hit's sit-still-then-whip + crisp jittering slam, Simple's instant smear plateau, Ease's long
settle, Ease Out's mid-motion launch, Bounce wobble, Swinging pendulum, Long Hit's 400-blur crash
to a crisp tail, Warp's smooth flowing bulge). Additional fixes found DURING the sweep: the Hit
impact "Shake" = the real Geometry2 Position jitter (±3-4% decaying jolts, now a `shake` param;
the Replicate/Mirror rig is edge-padding, served by our wrap tiles), and the Motion Blur clip
WINDOW (see mechanism notes). Known cosmetic notes: the wrap seam is the real AE Offset tiling
(more visible on high-contrast content than the pack's flat white demo footage), and residual
smear-structure differences are content-dependent (Gaussian vs AE box-ish directional blur).

**Hybrids (Warp + Hit) — added as OPTIONAL engine params, so the pure-push rows are untouched:**
- **Warp** = the multi-wrap ease push + a keyframed radial **Lens Distortion** (Curvature 0→−59→
  −11→0, negative = barrel bulge). Implemented as CHAINED `feDisplacementMap` passes over an
  inlined radial map (`_gen-lens-map.js` → `engines/lensMap.ts`). **The full story (three bugs,
  all caught by Mike's full-size QA 2026-07-11 — thumbnail QA hid every one of them):**
  (a) hand-picked `LENS_K=1.4` = ~11px max shift, TWO ORDERS too subtle (the Premiere model
  `src_r = r·(1+(k/100)·r²)` at k=−59 displaces edge content by hundreds of px). Scale now derived:
  `LENS_SCALE_PER_K = 540·255/(100·A)`. (b) the map generator had a spurious `/2` halving both
  axes → r² field a QUARTER strength — the "matching" thumbnail compare never caught it. (c) THE
  8-BIT WALL: Chromium filter buffers are 8-bit, so no matter how smoothly the map is generated or
  blurred, it is RE-QUANTIZED before `feDisplacementMap` reads it — every 1-level step then jumps
  `scale/255` ≈ 11px at peak = HERRINGBONE RIPPLES with exactly that period. Map blur (10→22→40),
  source pre-soften, and filter-region size all changed NOTHING (diagnosed by rendering the map
  itself in-filter: perfectly smooth, ripples persist). Premiere renders float; SVG filters don't.
  FIX = N=4 chained feDisplacementMap passes at scale/4 each → per-step jump scale/(4·255) ≈ 2-3px,
  passes decorrelate; slight warp compounding vs a single pass (approximate). Filter region −25%..
  +150% (must cover each pass's ~290px max sample pull or edges hard-clip mid-warp); map drawn 8%
  overscanned. Honest caveats: r² map profile vs the model's r³; micro-stairsteps on the sharpest
  streak edges at 100% zoom; the bulge is mostly buried under the multi-wrap blur mid-transition
  (as in the pack preview). fidelity: approximate. **LESSON: QA scale matters — compare at FULL
  RESOLUTION; 200px thumbnails hide magnitude and texture defects.**
- **Hit** = a fast push with LOW motion blur (Blur Length ~8, so it SLAMS crisp instead of smearing)
  + a **"Deviation"** glitch-fringe flash at the impact. The source recipe is Tint black→GREEN
  (decode `ff00ff00`) + Emboss (dir 45) + Pin Light, whose VISIBLE result is a green/magenta
  chromatic edge fringe. The faithful `feConvolveMatrix` emboss is PATHOLOGICALLY SLOW in Chromium
  (~5 min/demo — a known perf cliff; a full 45° R×R kernel times out outright, and even a 1×R
  vertical kernel crawled), so we reproduce the same fringe FAST by shifting ONLY the GREEN channel
  diagonally and adding R+B back (alpha stays ≥1 → arithmetic-add clamps to opaque, dodging the
  un-premultiply-to-white gotcha). Green/magenta fringes on 21% of the impact-frame edges (vs 1.3%
  for the too-thin convolve). Honest caveats: mechanism swapped (channel-shift, not emboss) though
  the look is preserved; and the Mirror/Replicate kaleidoscope "Shake" clip does NOT visibly read in
  the source preview (no 2×2 replication/mirroring visible) so it is NOT reproduced. fidelity: approximate.

**Render infra gotcha (cost real time):** `bundle()` with `publicDir=../assets` COPIES the whole
multi-GB assets tree (the Swiftly pack .prproj files!) into %TEMP% every run → filled the disk
(ENOSPC) twice and stale bundles ate 19 GB. Fix: `_render-offsetgeo.js` takes `OFFSET_PUBDIR` and
renders against a 1.1 MB minimal pub (just the 2 demo stills + the sfx-offset-*.mp3). Also: a long
background render was reclaimed at 109/112 when the session went idle — the `.ok` marker-resume made
it a 3-demo finish, not a restart. SFX for the hybrids: Warp→Camera_01, Hit/Hit Short→Hit_01, Long
Hit→Perspective_Spin_Hit_01 (Rule-7 trimmed).

---

## GLITCH / VHS: all 9 built ✅ (2026-07-05, awaiting Mike's review) — GLITCH CATEGORY COMPLETE

`vhs-{max,min,short}-{1,2,3}` (Max ~1.1s / Short 0.64s / Min 0.52s) — rendered + in the
gallery (`browse/GLITCH/VHS/`). Engine: `remotion/src/transitions/engines/GlitchVHS.tsx`.
**fidelity: approximate.** With this the ENTIRE GLITCH category is built: 89 rows
(Blocks 15, Bad Signal 6, Cinematic Monitor 9, Invert 9, Monitor 8, Offset 7, Roughly 7,
Turbulent Displace 10, TV Satellite 9, VHS 9).

Mechanism (`_extract-vhs.js` → `_vhs-clips.json` → `_build-vhs-rows.js`) — 4 adjustment
layers + 1 plate, the pack's most stacked recipe:
- **t1 (full window)**, bottom-up Tint → Unsharp → Turbulent Displace → Solid Composite:
  wash Tint black→RGB(31,31,31)/white→WHITE whose amount STROBES per-frame (100→0→100…,
  the VHS color-dropout flicker — a single still can mislead QA; compare against the
  flicker phase). Unsharp keyframed 0→500→0 r4 (0.4× gain calibration — AE's 0.12
  threshold tempers the literal 500%, which otherwise blows bright content to white).
  Turbulent Displace keyframed 0→50→0, Size 100, field scrolled by the REAL keyframed
  "Offset (Turbulence)" curve (first family to confirm the scroll mechanism from data).
  Solid Composite black backing approximated by wrap padding.
- **t2 window**: green/black HST tint → Emboss 90/15/70 → Fast Blur 30 (σ = px·0.2,
  Monitor calibration), with the blend pair KEYFRAMED (18,0)→(8,17): NORMAL full takeover
  first, PIN LIGHT after. **The switch keyframe t=0.36 is TIMELINE-absolute** (preview-
  verified: content returns by ~0.4; the media-time reading put it at 0.48 and QA caught
  it). Min variants' window ends AT 0.36 → Normal takeover the whole window.
- **t3**: keyframed 25fps wrap Offset roll around content+t1+t2.
- **t4**: REAL `Gth - TV VHS` plate PIN-LIGHTED on top, window from 0.04, media
  continuous across the editorial split at the cut (Max 0.4 / Min 0.16 / Short 0.2).
- SFX `lib/sfx-vhs-*.mp3` with the project's real timing baked in (Max +0.08s delay,
  Min in 0.24 +0.04s delay, Short in 0.16).

---

## GLITCH / TV Satellite: all 9 built ✅ (2026-07-05, awaiting Mike's review)

`tvsat-{max,min,short}-{1,2,3}` (Max 0.96s / Short 0.48s / Min 0.32s) — rendered + in the
gallery (`browse/GLITCH/TV Satellite/`). Engine:
`remotion/src/transitions/engines/GlitchTVSatellite.tsx`. **fidelity: approximate** (the
shred is procedural; everything else is real plates + real keyframes).

Mechanism (`_extract-tvsat.js` → `_tvsat-clips.json` → `_build-tvsat-rows.js`) — a
composite of THREE previously-verified mechanisms:
- **t1 (full length)**: Texture Adjustment rack window at the variant's `Tint Mask <V> <n>`
  slot (1s slots at 133/135/…/149) — per the Roughly verification, a SCREEN-FIXED luma
  matte over EFFECTED content: Tint decodes to black→black/white→WHITE = GRAYSCALE
  (Invert convention, applied FIRST bottom-up), then Turbulent Displace Amount 635 /
  Size 11.9 / Complexity 2 / Horizontal / Evolution 0→360 / seed 0 = the satellite-static
  shred (feTurbulence, same calibration as the Turbulent Displace engine). All 9 variants
  share IDENTICAL window effects — only the mask slot differs. (Short-2's in-point sits
  0.08s BEFORE its slot in the empty rack gap → no matte for those frames; engine clamps.)
- **t2 (full length)**: HST "Offset" adjustment — keyframed 25fps full-frame wrap roll
  (x AND y), carries content + shred window together (it sits above both).
- **t3**: the REAL `TV Satellite <V> <n>.mp4` plate PIN-LIGHTED on top (Blend 8+17,
  Monitor-verified darken/lighten pair), split at the cut (Max 0.32 / Min+Short 0.16)
  with a MEDIA JUMP: segment 2 plays plate media from 0.32s in every variant.
  Plates + masks converted native-25fps → `lib/plates/tvsat-*`, `lib/masks/tvsat-*`.
- SFX `lib/sfx-tvsat-{max,min,short}.mp3` from `TV_Satellite_*.mp3`, real in-points
  (Max 0, Min/Short 0.16).
- QA vs preview: clean at ramp-in, full grayscale static shred + scanline fringe rows at
  peak (`_qa/cmp_tvsat.png`, `_qa/cmp_tvsat_early.png`).

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
