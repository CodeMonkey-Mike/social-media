# C4-carpenters · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 525.480 to 529.940 s (source spine) · **Look:** house style
- **Spoken over it:** "Carpenters, 890,000 jobs at risk because a company in Texas"
- **Source:** `assets/charts/C4-carpenters.html` (frames: start, mid, payoff) · **Design states:** `C4-carpenters-start.png` · `C4-carpenters-mid.png` · `C4-carpenters-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #07, CARPENTERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: CHEAPER OUTLINE), stamp 'WALLS ONLY', tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 525.480 | 525.560 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('Carpenters' 525.48) |
| 526.300 | 527.220 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '890,000' lands on ',000' 527.22 |
| 528.480 | 528.780 | the scored lamp OUTLINES (red ring draws on, stroke-dashoffset 0.3 s) + 'COMPANY-REPORTED' tag | CHEAPER OUTLINED (builder-reported) on 'because' 528.48 |
| 529.480 | 529.700 | stamp 'WALLS ONLY' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'Texas' 529.48 |
|  | 529.940 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 889,700 jobs | DATA.md Pillar 3 table A: carpenters, BLS 2025 |
| 60,580 a year | table A: median pay |
| +4% | table A: BLS outlook |
| walls only | table A: ICON 3D-printed walls (T1, walls only) |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
