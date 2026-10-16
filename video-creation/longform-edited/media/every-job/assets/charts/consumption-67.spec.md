# consumption-67 · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 734.940 to 740.533 s (source spine) · **Look:** house style
- **Spoken over it:** "The second one is a scary one, about two-thirds of the entire US economy is regular people spending money"
- **Source:** `assets/charts/consumption-67.html` (frames: start, mid, payoff) · **Design states:** `consumption-67-start.png` · `consumption-67-mid.png` · `consumption-67-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Stat card: the hero 67.5% counts up from 0 while a donut fills clockwise from 12 o'clock to 67.5% (cyan -> green); 'two-thirds' lands in the donut's center. Line under the number: 'of the US economy is regular people spending money'.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 734.940 | 735.000 | card in; header, empty ring track, sub-line, chips set; counter 0.0% | cover start ('The second one' 734.94) |
| 736.580 | 737.460 | counter 0.0 -> 67.5 (one decimal) and the ring sweeps 0 -> 67.5% of its circumference together (easeOutCubic) | 'about two-thirds' 736.58 -> lands on 'of' 737.46 |
| 737.200 | 737.500 | 'two-thirds' fades up in the ring center | '-thirds' 737.20 |
| 739.220 | 740.220 | 'regular people spending money' brightens to white (it is bold already) | 'regular people spending money' 739.22 |
| 740.220 | 740.533 | hold to F12 |  |

## Geometry (px at 1920x1080, read off the HTML)
donut center (1420, 600), radius 250, stroke 110 (track #1e2330), arc = 2 pi 250 x pct/100 via stroke-dasharray, rotated -90. Counter Mono 230 left 128 top 300 (one decimal). Sub-line DM 500 44 left 142 top 550, width 820.

## Every number on screen
| value | source |
|---|---|
| 67.5% | DATA.md Pillar 4: FRED DPCERE1Q156NBEA, personal consumption 67.5 percent of GDP, Q2 2026 |
| two-thirds | spoken rounding of 67.5% |

## Guards
The collapse of demand is a forecast; this card shows only the share as it is.

## Count format
v.toFixed(1) + '%'
