# ai-engineering · deck + containers (INHERITS longform-edited)

_Thin skill. This channel builds its CSS containers / slides / charts **exactly like the `longform-edited`
track**. This file does NOT restate those rules — it **inherits them** and records only the small
ai-engineering deltas. Canonical parents win on conflict._

## Inherit these, verbatim (the source of truth)

1. **`../../longform-edited/skills/broll-and-containers/broll-and-containers.md`** — the container rules: ONE self-contained
   full-frame container per beat, LEFT-aligned eyebrow + Playfair headline (accent keyword) + body, title
   INSIDE the container, never crop a multi-card deck, the BALANCE rule (a rich diagram slide once, then
   break it into spotlight containers).
2. **`../../longform-edited/skills/container-reference/`** — THE look. ⛔ **Copy `container-canonical.css`;
   do NOT re-derive the CSS.** Palette (green `#00e68a` = positive/real · cyan `#00c2ff` = neutral/supporting
   · gold `#ffd700` = special/warning · red `#ff4060` = risk/cost · on `#0a0c10`), Playfair Display headlines,
   JetBrains Mono numbers/eyebrows, DM Sans body, gradient divider. Assign each accent a consistent meaning
   per video and don't drift.
3. **`../../longform-edited/skills/charts/charts.md`** — data charts / animated data-graphics: never an AI image as
   the source of a number; a real screenshot beats a redraw for a MARKET figure; our own charts are for
   numbers WE control (tables, comparisons, ladders we author).
4. **`../../longform-edited/skills/presentation/presentation.md`** — the HTML styling system the containers/charts match.

## The ai-engineering deltas (this is all that's channel-specific)

- **Full-frame explainer containers ONLY, no face spine.** These videos are pure MIKE-CLONE VO over
  full-frame containers/diagrams/charts (like the two prior ai-engineering videos). There is no talking-head
  cover layer to interleave, so the FACE/COVER gating and the b-roll ≤4s punctuation budget from the main
  track do not drive this build. (Sparse screen-recording / code b-roll may still be added where it helps.)
- **One `#cNN` container per SCRIPT chunk**, numbered to the chunk. The SHOW line under each chunk in
  `SCRIPT.md` is the spec for that container. Multi-visual chunks may add lettered sub-frames (`#c14b`) but
  keep the render id scheme (`section.frame` with an `id`).
- **Reuse the stylesheet + component library verbatim.** The decks of the two earlier videos are kept whole in
  `deck-and-containers/reference-decks/` (16:9 and 9:16 of each; the project folders they came from were deleted
  2026-11-27). `need-lang-graph.containers.html` carries the full built-out `<style>` (code cards, 2-up compare
  `.cmp`, chips, graph-diagram helpers `.gwrap/.gnode/.arrow`, steps, twin bars, matrix);
  `save-tokens.containers.html` adds the roster table, the pricing table, dials and before/after bars. Copy the
  one closest to the script to the new video's `deck/containers.html`, keep its `<style>`, replace the frames,
  and add only the new components the script needs. Do not restyle from scratch.
- **Render harness:** `deck-and-containers/render_containers.py` (Python + Playwright; ONE shared copy, it replaced
  the `render-containers.js` every project used to carry, 2026-11-27) screenshots every `section.frame#cNN` from
  the video's `deck/containers.html` to `render-assets/container-NN.png` at 1920×1080 @2x (3840×2160):
  `python video-creation/ai-engineering/skills/deck-and-containers/render_containers.py "<media/<video> folder>" [NN ...]`.
  Numbers render just those containers, none renders all, `--vertical` renders `deck/containers-vertical.html` to
  `render-assets/vertical/` (1080×1920 @2x). `--deck <html> --out <folder>` renders any deck anywhere, e.g. a
  reference deck into a scratch folder to look at a component.
- **QA gate:** every rendered PNG is opened by the **`visual-qa`** agent before it's trusted (clipped text at
  the frame edge, wrong font, off-palette drift, blank/failed capture, overflow). Nothing is "done" until it
  clears. (Matches `broll-and-containers.md` "QA every captured asset".)

## Build loop (per video)

1. Read the video's `SCRIPT.md` (the chunk list + each 🎬 SHOW line = the container spec).
2. Build `deck/containers.html`: start from the closest deck in `deck-and-containers/reference-decks/` (its
   stylesheet), then one `section.frame#cNN` per chunk.
3. `python .../deck-and-containers/render_containers.py "<project>"` → `render-assets/container-NN.png`.
4. Run `visual-qa` on the PNGs; fix + re-render the failures (`render_containers.py "<project>" NN`).
5. Log status in the video's `PROJECT-LOG.md`.

The 16:9→9:16 vertical repurpose (if wanted) follows `../../longform-edited/skills/vertical-repurpose/vertical-repurpose.md`
(reflow to `containers-vertical.html` → `render-assets/vertical/`).
