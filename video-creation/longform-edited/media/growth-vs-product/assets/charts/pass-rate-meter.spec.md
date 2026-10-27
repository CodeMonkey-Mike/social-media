# pass-rate-meter: animated-chart spec (Type 1 ANIMATED, the comp animates it for real)

- **Beat:** CH2@77.52-82.60 (final-spine seconds), chapter accent cyan `#00c2ff` (CH2); role label PRODUCT (green `#22c55e`) + ENGINEER (white).
- **Source:** `pass-rate-meter.html` (frames `pass-rate-meter-start|mid|payoff`). Design states: `pass-rate-meter-start.png`, `pass-rate-meter-mid.png`, `pass-rate-meter-payoff.png`.
- **Data:** illustrative, the needle only, NO figure printed (SCREENPLAY CH2 Beat 3; charts.md section 2). Ticks carry no numbers. The TARGET notch is GovWell's "explicit pass-rate targets" (DATA.md C7), drawn, not quantified. Footer: "Illustrative, no figure printed. Pass-rate targets: GovWell, Our AI Stack. Grounding measures: Citian".
- **In:** cross-fade from `split-test` at 77.52 (the header block sits in the same place, only its words change). **Out:** hard cut to the FACE verdict at 82.60 (COVER-PLAN).

## Static layer (identical in every state; build it once, SVG)
Header: eyebrow `DIFFERENCE 1 · THE SCOREBOARD`, headline "Ship a grounding fix. Watch the **pass rate**." ("pass rate" cyan), divider, role label top-right. Left label "THE PRODUCT ENGINEER SHIPS" (x140, y420). Gauge: centre (1240, 800), radius 340, track stroke 36 `#1e2330` round caps, a semicircle from 180 deg (left) over the top to 0 deg (right). Position f in [0,1] maps to angle pi*(1-f): x = 1240 + r cos, y = 800 - r sin. 11 unlabeled ticks at f = 0, .1 ... 1, from r+30 to r+46 (r+56 on f = 0, .5, 1), `#3a4356`. TARGET notch at f = 0.80 (r+30 to r+72, 6 px) with the word TARGET at r+108. Hub circle r24 fill `#12151c` stroke cyan 5. Labels: "PASS RATE" (DM Sans 700 42px caps, y852) and "on the eval set" (27px, y912), centred on x1240.

## What animates, cued to the words (useCurrentFrame, 30 fps, frame 0 = 77.52)
| t (spine) | word | what moves |
|---|---|---|
| 77.52 | "The product engineer ships" | container in; needle resting LOW at f = 0.22, cyan fill arc 0 to 0.22, a dashed empty slot where the fix card lands = `start` |
| 79.50 | "grounding fix" | the fix card (x140, y470, 560x250, 2px cyan border, glow) drops into the slot: opacity 0 to 1 + y +24 to 0 over 8 f; SHIPPED tag, Playfair "Grounding fix", "answers grounded in real data"; then the cyan arrow (x724 to x864, y595) draws left to right over 6 f |
| 80.24 to 82.14 | "and the number that moves is the" | needle CLIMBS f 0.22 to 0.80, ease-in-out over 57 f; the fill arc grows with it (draw the arc path from 0 to f each frame; one path, no re-raster). Mid-climb (about 80.9) = `mid` (f 0.50) |
| 82.14 | "pass rate" | needle settles on the TARGET notch (2 f overshoot to 0.82 then back to 0.80); notch + TARGET word turn cyan with glow; "PASS RATE" label white to cyan (6 f) = `payoff` |
| 82.14 to 82.60 | | hold payoff, hard cut to FACE |

Needle: line from the hub to r-34, stroke `#e8eaf0` 7 px round, glow. All SVG filters must use `filterUnits="userSpaceOnUse"` over the full frame: an objectBoundingBox filter makes a perfectly vertical needle (f = 0.5) vanish (found and fixed in this build).
