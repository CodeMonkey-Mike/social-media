# CSS container reference — THE look Mike wants (build to these screenshots)

Mike, 2026-06-30: "the irony is that as we progress over more videos, it becomes more and more difficult for
you to display the CSS containers. In the first few videos it was very easy with no issue." The screenshots in
this folder are frames from two of those early videos. **When you build explainer containers for a
longform-edited video, they must look like these.** This is the canonical visual target; match it.

## ⛔ START HERE: copy the locked stylesheet, do NOT re-derive the CSS (Mike, 2026-07-12)
The recurring drift (wrong accent teal, Inter instead of Playfair/DM-Sans, colored eyebrows, missing
divider) happens because each build re-invents the CSS. **`container-canonical.css` in this folder is the
locked stylesheet — paste it into the project's `assets/containers/containers.html`, then build one
full-frame `<div class="frame" id="<slug>">` per beat and screenshot each.** Palette + fonts match
`presentation.md` and the reference frames below. `container-canonical.css` + the reference frames in THIS
folder are the worked example — never a sibling project's build (those folders get deleted after publish).
Never swap the tokens.

## The reference frames — the THREE official type names (Mike, 2026-07-24)
This folder carries exemplars of the three container types. Use these NAMES everywhere (BROLL-PLAN's
CHARTS/SLIDES worklist sections, cue sheets, comps) — they were previously the unnamed "variants" and
kept getting re-described:
1. **CARD SLIDE** (formerly the "card" variant) — `banks-card-fiat-112s.jpg`, `banks-card-fractional-125s.jpg`
   (*banks-own-chain*, YouTube N8LNdp2lfBg): one rounded card, top-accent line, with the eyebrow + title +
   date + body INSIDE it.
2. **TITLE SLIDE** (formerly the "text" variant) — `bittensor-text-dualcitizens-70s.jpg`,
   `bittensor-text-fixed-130s.jpg`, `bittensor-text-economic-220s.jpg` (*bittensor-for-the-future*): same
   anatomy, NO card box — just the eyebrow + serif headline + body on dark bg (sometimes over b-roll).
3. **SYSTEM-DESIGN CHART** — the `diagram-*` files (next section): full-screen overview diagrams
   (topology / flow / timeline). In the BROLL-PLAN chart taxonomy these are CHART(sysdesign): static
   code-rendered stills, movement only from comp spotlights/transitions (the ANIMATED charts, CHART(anim),
   are data charts and have no exemplar here).

## Rich DIAGRAM slides — the OVERVIEW-slide archetype (Mike, 2026-07-10)
- `diagram-timeline-dollar-won-twice.png` — a **timeline** (1944 → 1971 → 1974 → TODAY, nodes on a rail with a
  label + blurb each, headline on top, takeaway bar on the bottom).
- `diagram-flow-stablecoin-treasury.png` — a **flow** (three linked cards, `phone → stablecoin → US Treasuries`,
  arrows between, headline + takeaway).
- `diagram-bittensor-*.png` (subnets-network, miners-validators, yuma-consensus, dtao, tao-token) — **system-design
  topology** diagrams from bittensor-for-the-future: nodes + edges laying out how a system's parts connect. Same
  role as a timeline/flow — a full-screen overview a viewer traces once, held while explained.

These are the **info-dense full-screen slides** — GOOD visuals, not the enemy. They are the **section overview**:
show one ONCE, full-screen, **held ~10s** so the viewer can digest the whole chain, then **break it up** into the
smaller spotlight containers above (one per sub-point, ~5s each) as the narration walks through each piece. The
overview slide and its break-up containers **coexist** — never repeat the full slide per sub-point, never delete
it. This is THE balance rule; full text in `../broll-and-containers.md` ("⛔ THE BALANCE"). Declare these in the
comp as `// DIAGRAM_REFS:` so they're exempt from the whole-slide lint (they earn it by appearing once, as the
overview).

## The anatomy (every container has these, as ONE self-contained unit)
1. **LEFT-aligned**, vertically centered, occupying the left ~55-62% of the frame. Large and generous.
2. A small **uppercase eyebrow** label (muted, wide letter-spacing): `THE FINE PRINT`, `LAYER 02`, `THE PATH`.
3. A large **serif headline** (Playfair Display), 1-2 lines, with the **key word(s) colored** by accent.
4. **Body / structure** below: a sentence, a facts list, a timeline, a flow, a 2-up comparison, chips.
5. Dark bg (`#0a0c10`) with one subtle blurred accent orb. Optional card box (banks) or no box (bittensor).

## THE RULES (this is what kept breaking)
- **ONE self-contained container per beat.** The title lives INSIDE the container. There is **never a separate
  floating slide-headline above separate cards**, and **never two unrelated cards on screen at once** (a
  deliberate A-vs-B comparison is the one exception — both columns are one rhetorical unit).
- **BUILD each container as its own full-frame HTML element, then screenshot it** (1920x1080). See
  `media/<project>/assets/deck/containers.html` for the Kaspa build. **Do NOT crop a shared multi-card
  presentation deck** — that drags in the slide headline, the card's off-center slide position, and forces
  repeats. Cropping a deck is the exact regression that made this "hard." A purpose-built container has none of
  those problems and is how the early videos were easy.
- One container per talking point; show them **contiguously per section**, do not scatter the same one across
  the whole video (the `lint-deck-containers.py` + `lint-covers.js` gates watch for this).
- System-design DIAGRAMS (topology/flow SVGs) may keep their headline and hold while explained.
