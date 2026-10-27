# pass-rate-meter: VERTICAL (1080x1920) spec for the comp's useCurrentFrame component

Source of truth for the look: `pass-rate-meter.html` (this folder, generator `../diagrams/_build_vertical.py`) and its
design states `pass-rate-meter-start.png`, `pass-rate-meter-mid.png`, `pass-rate-meter-payoff.png`. The 16:9 component is
`PassRateMeterChart` in `remotion/src/GrowthVsProductCharts.tsx` (16:9 spec: `assets/charts/pass-rate-meter.spec.md`). The
vertical keeps the 16:9 clock exactly (same `PM` cue table, source-spine seconds, easings, overshoot). It changes only the
geometry below. Build it as a sibling portrait component (e.g. `PassRateMeterChartV`) on a `1080x1920` `.gvp.frame`.

- **Beat:** CH2@77.52-82.60, chapter accent cyan `#00c2ff` (CH2); role label PRODUCT (green `#22c55e`) + ENGINEER (white).
- **Data:** illustrative, the needle only, NO figure printed; ticks carry no numbers; the TARGET notch is drawn, not quantified (DATA.md C7). Footer wording unchanged, hand-broken onto two lines.

## Re-layout: card LEFT + gauge RIGHT becomes card ON TOP, arrow pointing DOWN, gauge BELOW
| element | 16:9 (1920x1080) | vertical (px, frame 1080x1920) |
|---|---|---|
| frame padding | `96px 140px 0` | `130px 80px 0` |
| header | eyebrow, 68 px one-line headline, divider; role label top-right | eyebrow x80 y130; Playfair 900 **78 px** two lines, hand-broken `Ship a grounding fix.<br>Watch the <ck>pass rate</ck>.` (x80 y187 920x167); divider + role label share ONE row at y384 (divider left, role right, box x654 y387) |
| lead `THE PRODUCT ENGINEER SHIPS` | x140 y420, 23 px | **x80 y500, 25 px** |
| dashed slot / fix card | x140 y470 560x250 | **x80 y552 920x246**, radius 18, 2 px (slot: dashed `#2a3142`; card: cyan + glow `0 0 60px rgba(0,194,255,.22)`), padding 34/40 |
| fix card contents | tag 18 px; "Grounding fix" Playfair 56 px; sub 26 px | tag **20 px** (box x122 y588); "Grounding fix" Playfair **62 px** (x122 y646); "answers grounded in real data" **28 px** (x122 y723) |
| fix-to-gauge arrow | horizontal, M 724 595 L 860 595, head M 846 583 L 864 595 L 846 607 | **vertical, M 540 806 L 540 940**, head **M 528 926 L 540 944 L 552 926** (4 px cyan, round) |
| gauge centre / radius / stroke | (1240, 800), R 340, stroke 36 | **(540, 1420), R 350, stroke 38** |
| angle mapping | f in [0,1] to angle pi*(1-f) | unchanged: x = 540 + r cos, y = 1420 - r sin |
| ticks | 11 at f = 0, .1 .. 1, from r+30 to r+46 (r+56 on f = 0, .5, 1) | from **r+32** to **r+48** (**r+58** on f = 0, .5, 1), `#3a4356`, 3 px (4 px majors) |
| TARGET notch + word | notch r+30 to r+72, 6 px; word at r+108, 22 px | notch **r+32 to r+74**, 6 px; word at **r+110, 24 px**, letter-spacing 3.5 |
| needle | hub to r-34, 7 px `#e8eaf0`, glow | hub to **r-36**, 7 px, glow |
| hub | r24, fill `#12151c`, stroke cyan 5 | **r26** |
| labels | "PASS RATE" 42 px caps y852, "on the eval set" 27 px y912, centred on x1240 | "PASS RATE" **48 px** caps **y1478**, "on the eval set" **30 px** **y1546**, centred on x540 (box x80 w920) |
| source line | one line, x140 bottom 38, 17 px | x80 w920 **bottom 160** (box y1706, 2 lines), **18 px**, hand-broken after "Pass-rate targets:" |
| SVG | 1920x1080 | **1080x1920**; every filter `filterUnits="userSpaceOnUse"` over x0 y0 w1080 h1920 (a vertical needle at f = 0.5 vanishes under an objectBoundingBox filter, and it IS vertical at the mid state) |
| orbs | as 16:9 | 760 cyan right -340 top -320; 620 navy left -300 bottom -300 (opacity .35) |

## What animates, cued to the words (unchanged from 16:9; useCurrentFrame, 30 fps, frame 0 = 77.52)
| t (spine) | word | what moves (vertical geometry) |
|---|---|---|
| 77.52 | "The product engineer ships" | container in; needle resting LOW at f = 0.22, cyan fill arc 0 to 0.22, dashed empty slot = `start` |
| 79.50 | "grounding fix" | the fix card drops into the slot: opacity 0 to 1 + y +24 to 0 over 8 f; then the arrow DRAWS DOWNWARD from y806 to y940 over 6 f (strokeDasharray 134, dashoffset 134 to 0), the head appears when the line completes |
| 80.24 to 82.14 | "and the number that moves is the" | needle CLIMBS f 0.22 to 0.80, ease-in-out over 57 f; the fill arc grows with it (one path, redrawn 0 to f each frame). Mid-climb (about 80.9) = `mid` (f 0.50, needle exactly vertical) |
| 82.14 | "pass rate" | needle settles on the TARGET notch (2 f overshoot to 0.82, back to 0.80); notch + TARGET turn cyan with glow; "PASS RATE" white to cyan over 6 f = `payoff` |
| 82.14 to 82.60 | | hold payoff, hard cut to FACE |

The cause-and-effect now reads top to bottom (ship the fix, then the needle moves) instead of left to right. The arrow
direction is the only choreography change, and it follows the new reading direction.
