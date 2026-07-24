# ai-engineering · deck + containers (INHERITS longform-edited)

_Thin skill. This channel builds its CSS containers / slides / charts **exactly like the `longform-edited`
track**. This file does NOT restate those rules — it **inherits them** and records only the small
ai-engineering deltas. Canonical parents win on conflict._

## Inherit these, verbatim (the source of truth)

1. **`../../longform-edited/skills/broll-and-containers.md`** — the container rules: ONE self-contained
   full-frame container per beat, LEFT-aligned eyebrow + Playfair headline (accent keyword) + body, title
   INSIDE the container, never crop a multi-card deck, the BALANCE rule (a rich diagram slide once, then
   break it into spotlight containers).
2. **`../../longform-edited/skills/container-reference/`** — THE look. ⛔ **Copy `container-canonical.css`;
   do NOT re-derive the CSS.** Palette (green `#00e68a` = positive/real · cyan `#00c2ff` = neutral/supporting
   · gold `#ffd700` = special/warning · red `#ff4060` = risk/cost · on `#0a0c10`), Playfair Display headlines,
   JetBrains Mono numbers/eyebrows, DM Sans body, gradient divider. Assign each accent a consistent meaning
   per video and don't drift.
3. **`../../longform-edited/skills/charts.md`** — data charts / animated data-graphics: never an AI image as
   the source of a number; a real screenshot beats a redraw for a MARKET figure; our own charts are for
   numbers WE control (tables, comparisons, ladders we author).
4. **`../../longform-edited/skills/presentation.md`** — the HTML styling system the containers/charts match.

## The ai-engineering deltas (this is all that's channel-specific)

- **Full-frame explainer containers ONLY, no face spine.** These videos are pure MIKE-CLONE VO over
  full-frame containers/diagrams/charts (like the two prior ai-engineering videos). There is no talking-head
  cover layer to interleave, so the FACE/COVER gating and the b-roll ≤4s punctuation budget from the main
  track do not drive this build. (Sparse screen-recording / code b-roll may still be added where it helps.)
- **One `#cNN` container per SCRIPT chunk**, numbered to the chunk. The SHOW line under each chunk in
  `SCRIPT.md` is the spec for that container. Multi-visual chunks may add lettered sub-frames (`#c14b`) but
  keep the render id scheme (`section.frame` with an `id`).
- **Reuse the prior video's stylesheet + component library verbatim.** `need lang-graph/deck/containers.html`
  carries the full built-out `<style>` (code cards, 2-up compare `.cmp`, chips, graph-diagram helpers
  `.gwrap/.gnode/.arrow`, steps, twin bars, matrix). Start from it, add only the new components a script
  needs (e.g. a roster table, a pricing table, dials, before/after bars). Do not restyle from scratch.
- **Render harness:** the project's `scripts/render-containers.js` (Playwright, reuses the
  `schedule-tweets/node_modules` install) screenshots every `section.frame#cNN` from `deck/containers.html`
  to `render-assets/container-NN.png` at 1920×1080 @2x (3840×2160). `node scripts/render-containers.js [NN]`
  renders one; no arg renders all.
- **QA gate:** every rendered PNG is opened by the **`visual-qa`** agent before it's trusted (clipped text at
  the frame edge, wrong font, off-palette drift, blank/failed capture, overflow). Nothing is "done" until it
  clears. (Matches `broll-and-containers.md` "QA every captured asset".)

## Build loop (per video)

1. Read the video's `SCRIPT.md` (the chunk list + each 🎬 SHOW line = the container spec).
2. Build `deck/containers.html`: paste the canonical/reused stylesheet, then one `section.frame#cNN` per chunk.
3. `node scripts/render-containers.js` → `render-assets/container-NN.png`.
4. Run `visual-qa` on the PNGs; fix + re-render the failures (`node scripts/render-containers.js NN`).
5. Log status in the video's `PROJECT-LOG.md`.

The 16:9→9:16 vertical repurpose (if wanted) follows `../../longform-edited/skills/vertical-repurpose.md`
(reflow to `containers-vertical.html` → `render-assets/vertical/`).
