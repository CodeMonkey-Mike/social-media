# ov2-system: SYSTEM-DESIGN chart "How Janction Works" (one still)

Video: `media/standard/JCT/` (longform-presentation, format 4 "standard"). The still is composited INSIDE the deck
area of the screen share: **canvas 1464 x 1080** (not 1920). Mike's webcam stays visible to the right. It holds for
**22.2 s** (spine 220.9 to 243.1) while he narrates slide 3 of `../JCT.html` ("A GPU Marketplace From Jasmy", the
"How It Works" column). **Dark mode** (Mike, 2026-11-08: every card and chart in dark mode). Fact source:
`../RESEARCH.md` sections 2.2 (architecture, lines ~81-92) and 3.1 (token utility, lines ~118-123). Every label must
be in RESEARCH.md; keep the deck's wording where the deck has it.

## What it shows: nodes + arrows + labeled flows (never a table)
A two-sided marketplace with a verification loop and the token's three jobs:
1. **GPU owners** (left, supply side): "pool their cards into one network". Their GPUs feed into ...
2. **The Janction network** (center): a GPU POOL (cards split into vGPUs, a scheduler hands them out; label it simply
   "GPU pool + scheduler").
3. **AI and 3D teams** (right, demand side): "rent that compute on demand". Arrow from the pool to them = compute;
   arrow from them back = payment.
4. **Validators** (below or above the pool): "check the work", with the two proofs as small labels:
   "Proof of Resource: the GPU supplied" and "Proof of Task: the job done" (the docs' own names).
5. **JCT** (a token node, bottom or a side rail): three labeled edges, "stake as veJCT: priority in the marketplace"
   (to the GPU-owner side), "pay with it" (to the renters / payment edge), "vote with it" (governance).

Quiet footnote: "As described in Janction's docs (project claims)". Chapter accent: cyan for the network, green for
supply, gold for the token.

## The narration it holds under (LOCAL seconds = spine minus 220.9)
```
0.34 So how it works   1.40 GPU owners pool their cards into one network (3.46)   4.10 AI and 3D teams rent that compute on demand (7.38)
8.10 validators check the work (9.26)   10.16 proof of the GPU supplied and of the job done (13.34)
14.92 JCT   15.96 stake it as veJCT for priority in the marketplace (19.52)   20.38 pay with it and vote with it (21.82)   22.2 END
```

## Deliverable (your fixed layout, but the project is this one)
- `media/standard/JCT/assets/diagrams/how-it-works.html` (standalone, body exactly 1464 x 1080, the locked dark
  stylesheet / fonts, SVG nodes + arrows) and `how-it-works.png` shot at 1464 x 1080. One state.
- QA-open the PNG yourself: every label inside the canvas (the right edge is 1464), nothing clipped, no overlaps,
  readable at 1464 wide. No em dashes on screen. No numbers needed; anything factual only from RESEARCH.md.
