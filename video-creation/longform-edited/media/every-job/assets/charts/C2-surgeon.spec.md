# C2-surgeon · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 683.000 to 686.260 s (source spine) · **Look:** house style
- **Spoken over it:** "And then it flips, once the machine is safer"
- **Source:** `assets/charts/C2-surgeon.html` (frames: start, mid, payoff) · **Design states:** `C2-surgeon-start.png` · `C2-surgeon-mid.png` · `C2-surgeon-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C2 state for the brain surgeon (house palette): the same four lamps as C2, inside a gold dashed FORECAST frame ('FORECAST · THE ROBOT SURGEON'), light one by one; SAFER is last and lands exactly on 'safer'. Lit = red risk light.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 683.000 | 683.080 | card in; header, the FORECAST frame + tab, four dark lamps, FORECAST badge set | cover start ('and' 683.08) |
| 683.300 | 683.500 | BETTER ignites (3-frame flicker, then glow) | 'then' 683.30 |
| 683.740 | 683.940 | FASTER ignites; rail segment draws red | 'flips' 683.74 |
| 684.060 | 684.260 | CHEAPER ignites | 'Once' 684.06 |
| 685.740 | 685.980 | SAFER ignites last; all four pulse once (scale 1 -> 1.04 -> 1) | 'safer' 685.74 |
| 685.980 | 686.260 | hold |  |

## Geometry (px at 1920x1080, read off the HTML)
lamp centers x = 345, 755, 1165, 1575, y = 566, r = 128 (core.lamp, house: lit = #ffd0d8 -> #ff4060 -> #b0102c). Words DM 700 46. FORECAST frame: left 166 top 372, 1588 x 432, 3 px dashed #ffd700, radius 28; tab at left 206 top 352.

## Every number on screen
| value | source |
|---|---|
| (none) | no numbers |

## Guards
The robot surgeon does not exist: the FORECAST frame + badge stay on every frame. No 'half the cost' figure.

## Count format
n/a
