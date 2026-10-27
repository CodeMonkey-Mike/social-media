# split-test: animated-chart spec (Type 1 ANIMATED, the comp animates it for real)

- **Beat:** CH2@72.00-77.52 (final-spine seconds), chapter accent cyan `#00c2ff` (CH2); role label GROWTH (gold `#ffd700`) + ENGINEER (white).
- **Source:** `split-test.html` (frames `split-test-start|mid|payoff`). Design states: `split-test-start.png`, `split-test-mid.png`, `split-test-payoff.png`.
- **Data:** illustrative. NO figure is printed anywhere (charts.md section 2). Bar lengths are geometry only. Footer: "Illustrative split test, no real figures. Control vs variation: Inside Atlassian, 2020-05-21" (DATA.md Pillar 2).
- **In:** cross-fade + scale-in from BR-2 at 72.00 (containers and charts, never TransitionSeries). **Out:** cross-fade to `pass-rate-meter` at 77.52 (same header anatomy, so the swap reads as one container changing).

## Static layer (identical in every state; build it once)
Header: eyebrow `DIFFERENCE 1 · THE SCOREBOARD` (x140, y96), Playfair 900 68px headline "Ship the AI page as a **split test**." ("split test" cyan), gradient divider, role label top-right (right 140, top 92). Card A at x140, card B at x1000, both y318, 780x430, radius 18. Bar tracks at y774 (780x26, radius 13, `#1e2330`), the label "THE NUMBER" at y808. Footer mono 17px at bottom 38.

## What animates, cued to the words (useCurrentFrame, 30 fps, frame 0 = 72.00)
| t (spine) | word | what moves |
|---|---|---|
| 72.00 | "landing page" | container in (cross-fade + scale 0.97 to 1 over 12 f); both bars empty = `start` |
| 74.34 to 75.14 | "The number moves" | BOTH bars grow from 0, ease-out (cubic) over 24 f: A to 30%, B to 46% of the track = `mid` |
| 75.14 to 76.22 | "or it doesn't" | A creeps 30% to 34% and stalls; B keeps growing 46% to 82% (ease-out, 30 f) |
| 76.22 | "kill it" | takeaway bar (x140 to x1780, y864, h100) fades up + rises 16 px over 8 f: KILL IT (red `#ff4060`) OR (muted) SCALE IT (cyan) |
| 77.04 | "scale it" | WINNER lights over 8 f: card B border 1px to 2px cyan + outer glow (0 0 70px rgba(0,194,255,.28)), the B letter tile fills cyan, B bar turns full cyan with glow, SCALE IT pill pops in (scale 0.8 to 1, 6 f). LOSER dims: A wireframe + label to opacity .38, A bar to `#3a4356`, KILL IT pill pops in. = `payoff` |
| 77.04 to 77.52 | | hold payoff, then cross-fade out |

Fill colours while growing (both bars): linear-gradient(90deg, #2b5f7a, #3f8fb5). Payoff winner: linear-gradient(90deg, #0a86b8, #00c2ff).
