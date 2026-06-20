# transitions — HARD RULES (read before touching anything here)

This folder re-creates the **Swiftly Studio 850** Premiere transition pack as a Remotion library.
Overview + status: `PROJECT-LOG.md`. The pack itself: `./Swiftly Studio 850 .../`.

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

## RULE 4 — Extract per-SEQUENCE, and never tune from the example videos.

- Pull values from the project file, not by eyeballing the rendered preview/example `.mp4`s.
  (Looking at a preview to *sanity-check* is fine; deriving numbers or shapes from it is not.)
- Use a **per-sequence** extraction (walk the named transition's own `<Sequence>` closure), not a
  global by-type dump — `ADBE Offset` alone has 2002 instances across the pack, so a global grab
  mixes transitions. Also verify the extraction actually isolates ONE transition (if every variant
  returns identical counts, the closure is leaking shared objects — do not trust it).

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

_Why this file exists: on 2026-06-20 a correct, approved set of Blocks transitions was overwritten
with an invented square-grid look, built on a leaky extraction and biased by peeking at the preview
videos. The originals had to be restored from conversation history because the files weren't yet
committed. These rules exist so that never happens again._
