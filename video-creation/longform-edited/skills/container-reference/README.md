# CSS container reference — THE look Mike wants (build to these screenshots)

Mike, 2026-06-30: "the irony is that as we progress over more videos, it becomes more and more difficult for
you to display the CSS containers. In the first few videos it was very easy with no issue." The screenshots in
this folder are frames from two of those early videos. **When you build explainer containers for a
longform-edited video, they must look like these.** This is the canonical visual target; match it.

## The reference frames
- `banks-card-fiat-112s.jpg`, `banks-card-fractional-125s.jpg` — *banks-own-chain* (YouTube N8LNdp2lfBg). The
  **card** variant: one rounded card, top-accent line, with the eyebrow + title + date + body INSIDE it.
- `bittensor-text-dualcitizens-70s.jpg`, `bittensor-text-fixed-130s.jpg`, `bittensor-text-economic-220s.jpg` —
  *bittensor-for-the-future* (`renders/bittensor-FULL-v8-sfx.mp4`). The **text** variant: same anatomy, no card
  box — just the eyebrow + serif headline + body on dark bg (sometimes over b-roll).

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
