# plan-to-make-millions thumbnail (2026-11-23)

Mike's ask: the layout of a finance thumbnail he linked (`refs/layout-ref.jpg`: the person on one side of a dark grid, a
green line climbing to the top right, a big white "+$" number at the top, the year at the bottom), with
**+$11,512,788** and **2028**, his portrait from his published Pieverse thumbnail (youtu.be/7x2CVZQG6WQ,
`refs/pieverse-thumb-published.jpg`), and the golden light on him turned into a GREEN glow "because of the green chart".

Everything is composed in CODE, no image model:

1. `python build/cut_mike.py` : cuts him out of the clean portrait plate (`refs/mike-portrait-plate.png`, 2752x1536, the
   plate behind the Pieverse thumbnail, copied here because the pieverse folder is deleted after publish). rembg
   isnet-general-use -> trimap -> pymatting closed-form alpha + foreground estimation -> `work/mike-cut.png`. About 30 s.
2. `python build/compose_thumb.py [A B C D]` : the grid background with green light pools, the chart line (drawn from a
   point list, a made-up climbing line, not a price series), his portrait relit, the words in Arial Black.
   The relight is pixel filters only, no feature is moved or redrawn: the orange cast is pulled back to plain skin
   (`gold_keep`), the teal edge light on his cheek becomes the chart's green, a green wash + rim is added on the side
   facing the chart (`wash`, `rim`), and a green glow sits behind him where the plate had a golden outline.
   In the takes with him on the LEFT the plate's cut shoulder is continued in code (`extend_shoulder`).

Takes (`takes/take-<X>.png` 1920x1080 + `take-<X>-1920.jpg` for the upload, sheet `takes/takes-sheet.jpg`):

| take | Mike | green on him |
|---|---|---|
| A | left, the reference's arrangement | lighter |
| C | left | stronger |
| B | right, where he stands in his own thumbnail; the line ends on a dot beside him | lighter |
| D | right | stronger |

**The winner is take D (Mike, 2026-11-23: "I like thumbnail D best"): him on the right, the stronger green.** It is
`thumbnail/plan-to-make-millions-thumb.png` + `plan-to-make-millions-thumb-1920.jpg` (the upload file, about 416 KB),
the ONLY `*thumb*.png` at this level (`stage_longform` stages the last one alphabetically). My own pick was C (him on
the left, the reference's arrangement); he chose his usual side.
