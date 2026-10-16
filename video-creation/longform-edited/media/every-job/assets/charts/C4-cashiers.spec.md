# C4-cashiers · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 454.400 to 458.100 s (source spine) · **Look:** house style
- **Spoken over it:** "Cashiers. 3.1 million jobs at risk because of"
- **Source:** `assets/charts/C4-cashiers.html` (frames: start, mid, payoff) · **Design states:** `C4-cashiers-start.png` · `C4-cashiers-mid.png` · `C4-cashiers-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #01, CASHIERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: all four DARK), stamp 'BLS: MINUS 6 PERCENT', tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 454.400 | 454.480 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('cashiers?' 454.50) |
| 455.400 | 456.420 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '3.1 million' lands on 'million' 456.42 |
| 457.160 | 457.380 | stamp 'BLS: MINUS 6 PERCENT' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'at risk' 457.16 |
|  | 458.100 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 3,106,300 jobs | DATA.md Pillar 3 table D: cashiers, BLS 2025 |
| 32,880 a year | table D: median pay |
| -6% (minus 200,600) | table D: BLS outlook 2025 to 2035 |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
