# transitions — HARD RULES (read before touching anything here)

This folder re-creates the **Swiftly Studio 850** Premiere transition pack as a Remotion library.
Overview + status: `PROJECT-LOG.md`. The pack itself: `./Swiftly Studio 850 .../`.

## BUILD CHECKLIST — run EVERY step for EVERY transition (no skipping)

There are hundreds of these; follow the same sequence each time so we stop re-making the same
mistakes. Do not deliver until every box is genuinely done.

1. **Enumerate ALL video tracks/clips** of the transition's `<Sequence>` (per-clip, not a global
   closure). Do not stop at the first track.
2. **Classify each clip** by resolving SubClip → MasterClip name/kind:
   - *Adjustment layer* (MasterClip "… Adjustment") → its effects COMPOUND on everything below
     (chain them; they are NOT soft overlays).
   - *Overlay plate footage* (a `(Footage)/…` `.mp4`, e.g. `Cinematic Bad Signal Max 1.mp4`,
     `Gth - Disp Blocks Max.mp4`) → usually the effect's real visual character; composite the REAL
     plate with its **blend mode**.
   - *Content* clip → the footage the effect acts on.
3. **List ALL effects on every clip** (incl. zero-param ones) AND the **Opacity blend-mode** value,
   AND each clip's **time window**. Pull every keyframe.
4. **Find ALL source plates** for the family in `(Footage)/Footages/…/<Family>/…` (there are often
   several: overlay + masks like "Tile Mask"/"Pixelate Mask"). Use the real files; never hand-draw.
5. **Find the SFX** in `(Footage)/Sound/` (e.g. `Cinematic_Bad_Signal_Max.mp3`; the `…_Only_*` stems
   tell you the sub-effects). Wire it; never ship silent.
6. **Build** from the real values/plates (Rules 1–5). No invented patterns/easings/tessellations.
7. **QA against the preview** `Preview Transitions/…/<name>.mp4` (Rule 6): extract frames from both
   at the glitch peak + 2 other points, view side by side, confirm it genuinely matches.
8. Only then render to the gallery and tell Mike — with the QA comparison and any honest caveats.

## RULE 1 — NEVER invent a transition's visual style. (non-negotiable)

When reproducing a transition that exists in the Adobe project, you may **only** use what the
project and pack actually contain. You must NOT fabricate, approximate, or "design" a look:

- **No invented tessellations, patterns, grids, particles, easings, or motions.** If you catch
  yourself generating a shape/pattern the source doesn't specify (e.g. tiling the frame into a grid
  of squares), STOP — that is the banned failure mode that wrecked the Blocks transition (2026-06-20).
- Everything you need is in the project: **effect keyframes** (extract them), and the pack's own
  **asset files** — `(Footage)/Footages/...` matte/displacement plates, `Sound/...` SFX, and the
  `Preview Transitions/...` clips (for *reference only*, never for tuning — see Rule 4).
- A transition's pixel-level look (block shapes, glitch mattes, light leaks) often lives in a
  **pre-rendered matte/footage file**, NOT in numbers. When that's the case, **use the actual asset
  file** (composite/displace/luma-mask with it). Do NOT substitute a hand-made pattern for it.

## RULE 2 — If you can't fully read a piece of the source, STOP and say so.

Incomplete data is NOT a license to fill the gap with something plausible. If the keyframes give you
the numbers but the shape is in a matte you haven't resolved, say exactly that and ask — don't
invent the missing part. Partial truth + fabrication reads as "done" when it isn't.

## RULE 3 — NEVER overwrite an approved/working transition with a speculative rebuild.

If a transition already looks correct and Mike approved it, leave it. A new tool, a new extraction,
or a "cleaner" idea is NOT a reason to replace a working result. If you want to try a different
approach, do it on a copy / new id and get approval BEFORE replacing the good one. When new data
contradicts a result that already looks right, assume the new data (or your reading of it) is wrong
— the working output wins until proven otherwise.

## EXTRACTION GOTCHAS (learned on Cinematic Monitor, 2026-07-04 — cost a full re-render each)

- **Sequences carry TWO TrackGroups and the AUDIO one can come first.** Grabbing the first
  `<Second ObjectRef>` (as `_recipe-seq.js` does) can walk a 65-track audio group — slow AND wrong.
  Resolve each ref and pick the one whose tag is `VideoTrackGroup` (see `_extract-monitor.js`).
- **Clips have media IN-POINTS.** TrackItem Start/End is the timeline window only; the SubClip's
  inner `<Clip>` carries `InPoint`/`OutPoint` — the media does NOT start at 0 (Monitor plates play
  from 0.08s/0.16-0.2s/0.24s in). Assuming in-point 0 made Min/Short plates render as empty gray.
  ALWAYS extract in-points for plate/footage clips.
- **Effect component stacks apply BOTTOM-UP** (learned on Glitch Invert, 2026-07-04): the
  LAST-listed component applies FIRST. Invert's Tint is listed last in every stack but grays the
  frame BEFORE the invert channels hit it (verified numerically vs preview: Max-2's green flash is
  `green_neg(gray(A))`, not `gray(green_neg(A))`). Reverse the component list to get render order.
- **Pack previews are 25→29.97fps conversions with FRAME BLENDING.** Flat-gray / ghosted frames in
  a preview are pulldown blend artifacts (e.g. clean frame + RGB-negated neighbor ≈ flat 50% gray),
  NOT content. QA against the 25fps (0.04s) keyframe grid and ignore blend frames — do not try to
  reproduce them.
- **AE Invert "Channel" enum is 0-based COUNTING popup separators**: 0=RGB, 2=Green, 6=Hue,
  7=Lightness, 12=In Phase Chrominance (each verified numerically vs preview frames on Invert).

## RULE 4 — Extract per-SEQUENCE, and never tune from the example videos.

- Pull values from the project file, not by eyeballing the rendered preview/example `.mp4`s.
  (Looking at a preview to *sanity-check* is fine; deriving numbers or shapes from it is not.)
- Use a **per-sequence** extraction (walk the named transition's own `<Sequence>` closure), not a
  global by-type dump — `ADBE Offset` alone has 2002 instances across the pack, so a global grab
  mixes transitions. Also verify the extraction actually isolates ONE transition (if every variant
  returns identical counts, the closure is leaking shared objects — do not trust it).

## RULE 5 — Capture the WHOLE layer stack, not the top effect of each layer. (non-negotiable)

A transition is a multi-track composite. Before building, enumerate EVERY video track/clip AND
classify each, because they play different roles:
- **Adjustment layers** (e.g. clips named "Offset"/"Tint"/"Pixelate" whose MasterClip is an
  "… Adjustment") apply their effects to everything BELOW them — effects COMPOUND on the footage,
  they are not separate soft overlays. Reproduce them as a chained pipeline, not faded copies.
- **Overlay PLATE footage** (e.g. `Cinematic Bad Signal Max 1.mp4`, `Gth - Disp Blocks Max.mp4`)
  is usually the transition's actual visual character (RGB split, scanlines, noise, block matte).
  It is composited with a **blend mode** (read the Opacity component's blend-mode value) — find it,
  use the real plate, and match the blend. Missing the plate = a smooth, wrong, lifeless result.
- **The SOUND is part of the transition.** Every family has its own SFX in `(Footage)/Sound/`
  (e.g. `Cinematic_Bad_Signal_Max.mp3`, plus `…_Only_RGB`/`…_Only_Overlay` stems that tell you what
  the effect is made of). Wire it; do not ship silent.

Process: for each clip resolve SubClip → MasterClip (name + whether it's an Adjustment Layer or a
media plate), list ALL its effects (incl. blend modes), and note its time window. Only then build.
If you've only read one effect per layer, you are NOT done. (Bad Signal POC 2026-06-20: shipped
roll+tint+mosaic as soft overlays, MISSED the `Cinematic Bad Signal Max 1.mp4` overlay plate, the
blend modes, and the SFX → came out smooth and wrong. Don't repeat.)

## RULE 7 — SFX rings out from the WRAPPER; trim its lead-in; skip empty-plate variants.

- **Emit SFX from the wrapper (`TransitionDemo` / `TransitionClip`), NOT the engine.** A short window
  (e.g. Min = 0.2s) clips audio placed inside the engine's window → the sound is cut off. The wrapper
  plays it from the transition start spanning to the end so it rings out. (Engines no longer emit Audio.)
- **Trim leading silence from the pack SFX** (`ffmpeg ... silenceremove=start_periods=1:start_threshold=-50dB`)
  so the hit lands at the cut, not 0.2s late. The pack's `Cinematic_Bad_Signal_Min.mp3` had 0.2s of
  lead-in silence = silent for the whole Min window.
- **Check the source plates aren't EMPTY before building a variant.** Bad Signal **Min** has an
  all-black Tile Mask AND a flat-gray overlay plate (no content) — its glitch is negligible and not
  worth faking. We ABANDONED Min (Mike's call 2026-06-20) and shipped Cinematic Bad Signal as **6**
  (Max 1/2/3 + Short 1/2/3). If a variant's plates are empty and the effect won't read, say so and
  drop it rather than inventing.

## RULE 6 — QA against the preview BEFORE delivering. (non-negotiable)

The pack's `Preview Transitions/.../<name>.mp4` is the ground-truth render of the effect. Before you
show Mike anything, **compare your render to that preview** at matching moments (extract frames from
both at the glitch peak + a couple other points, view them side by side) and ask honestly "does this
match?". If it doesn't, it's not done — keep fixing. This is a VISUAL QA check against the preview,
which is allowed and required; it is NOT the same as Rule 4's ban on *deriving numbers/shapes* from
the preview. Deliver only once the comparison genuinely matches (or, if a part provably can't match,
say exactly what and why). Never hand over an unchecked render.

---

## THE PROPER METHOD (verified 2026-06-20) — how Blocks is actually built

Two important corrections to earlier guesses:
1. The FullHD `.prproj` is a **demo assembly** — it drops in the rendered preview `.mp4`s + the
   block plates to *show* each effect; the live transitions render in the 4K project. But the
   per-sequence/per-clip DATA (offsets, opacity, sources) is the same in both.
2. For footage-glitch transitions like Blocks, the block pattern is **NOT keyframe geometry** and
   the footage files ARE part of the mechanism (the "self-contained, no footage" idea holds only for
   purely geometric transitions like zoom/spin).

How Blocks really works (read per-clip, NOT via a global closure):
- Walk the transition's **Sequence → VideoTrackGroup → Tracks → TrackItems → each clip's own
  ComponentOwner.Components chain**. (`_extract-blocks-clips.js` does this.) The earlier "85 Set
  Matte / 86 identity Crop" reading was a **leaky global closure** pulling shared objects — ignore it.
- The block SHAPES + their animation are a **pre-rendered black/white mask video** in the pack:
  `(Footage)/Footages/Glitch/Blocks/Gth - Disp Blocks Max|Mid|Small.mp4` (white = show footage,
  black = hide). Max/Medium use the **Max** mask, Short uses the **Small** mask.
- The displacement amounts are the real **Offset "Shift Center To"** vectors on the clips (count =
  intensity: Max 6 / Medium 4 / Short 2). Plus **Geometry2** vertical stretch (150%) and the
  **Opacity** flash (0→100→0, peak 0.333, 0.96s), cut at the peak.

To reproduce (the engine does this): convert the real mask `.mp4` to an alpha-PNG sequence
(`lib/masks/blocks-*`, white→opaque) — a format change of the real file, not a redraw — then show
the footage through that real moving mask, wrap-shifted by each real Offset. **Use the real mask
file. Never hand-draw a block/strip pattern.**

**STRIPS (1x–6x):** no source strip mask file exists (clips carry only Offsets + reference the
preview). With Mike's explicit OK to use the preview for this one case, the strip mask is
**reverse-engineered from each density's PREVIEW render**: diff the glitch frames against the clean
settled frame → collapse to a per-row profile → full-width strip bands → alpha PNG sequence
(`lib/masks/blocks-strips-Nx`). This is derived from REAL data (the preview), NOT an invented
pattern — fidelity is "approximate". Combined with the real 2 offsets. (This is the only sanctioned
use of an example/preview video; for everything else, Rule 4 still stands.)

---

## ARCHITECTURE — data + engines + registry + the reusable wrapper

- **Catalog (data):** `library.json` — one object per transition. PURE DATA, no code imports. Each
  object's `engine` is a STRING name (e.g. `"GlitchBlocks"`), NOT a file path — that's correct.
- **Engines (code):** `remotion/src/transitions/engines/<Engine>.tsx` — one parametric component per
  effect family. Many transitions = many JSON rows + few engines (variants = same engine, diff params).
- **Registry (bridge):** `remotion/src/transitions/registry.ts` — `ENGINES` map binds the `engine`
  string → the component. To add an engine: write the `.tsx`, add it to `ENGINES`. (The `meta.engineFile`
  field just records the path for humans/scanning; the registry is the real link.)
- **Demo:** `TransitionDemo.tsx` renders one row between two stills (the gallery previews).
- **THE WRAPPER (build once, reuse forever): `transitions/TransitionClip.tsx`.** Places any library
  transition at a cut between two clips and hides the cut. You do NOT rebuild it per video — every
  longform imports it. Usage:
  ```tsx
  <TransitionClip id="badsignal-max-1" cutFrame={120}
    outgoing={() => <OffthreadVideo src={staticFile('a.mp4')} />}
    incoming={() => <OffthreadVideo src={staticFile('b.mp4')} />} />
  ```
  Per video you only *use* it (pick an `id`, give it the two clips) — that's config, not construction.
- **Image vs VIDEO:** engines have two paths. The demo passes `fromSrc`/`toSrc` (image paths →
  fast background-image displacement). The wrapper passes `outClip`/`inClip` (render-fns returning
  live `<OffthreadVideo>` → displaced via `transitions/WrapLayer.tsx`, which wrap-tiles any node 3×3
  so it can be offset past the edges). Adding video support to a new engine = branch on `outClip`
  and render through `WrapLayer` (see GlitchBadSignal). Validated end-to-end via the `TransitionTest`
  composition over two real video clips (2026-06-20).

## LIBRARY SCHEMA + picking a transition (for editing)

Every object carries a **`meta`** block so you can scan `library.json` and choose a fitting
transition for a cut WITHOUT opening the engines:
- `aspectRatios` — which aspect it's authored for (currently `["16:9"]` = 1920×1080). **A vertical
  (`9:16`) version is a SEPARATE row** built from the pack's Vertical project; add `"9:16"` to its
  `aspectRatios`. Match the project's aspect when picking.
- `resolution`, `family`, `engineFile`, `durationSeconds`, `hasSound`, `fidelity`.
- `description` (plain language look), `energy` (low|medium|high), `tags[]`, `useWhen` (guidance).

When helping Mike edit: read `meta` across rows, filter by the comp's aspect ratio + the mood/energy
he wants, propose 2–3 by `id`, then drop them in via `TransitionClip`. Keep `meta` updated when you
add transitions — `node _enrich-meta.js` refreshes it (safe, preserves rows). NOTE: `_build-lib.js`
REGENERATES the Blocks rows only and would clobber hand-added rows (Strips/BadSignal) + meta — do
NOT run it blindly; `library.json` is now the maintained source of truth.

---

_Why this file exists: on 2026-06-20 a correct, approved set of Blocks transitions was overwritten
with an invented square-grid look, built on a leaky extraction and biased by peeking at the preview
videos. The originals had to be restored from conversation history because the files weren't yet
committed. These rules exist so that never happens again._
