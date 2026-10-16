# C4-truck · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 512.040 to 516.060 s (source spine) · **Look:** house style
- **Spoken over it:** "truck drivers, 2.2 million jobs at risk because driverless trucks"
- **Source:** `assets/charts/C4-truck.html` (frames: start, mid, payoff) · **Design states:** `C4-truck-start.png` · `C4-truck-mid.png` · `C4-truck-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #06, TRUCK DRIVERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: SAFER OUTLINE), tier badge DEPLOYED · SMALL SCALE. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 512.040 | 512.120 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('truck drivers' 512.04) |
| 513.240 | 514.220 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '2.2 million' lands on 'million' 514.22 |
| 515.160 | 515.460 | the scored lamp OUTLINES (red ring draws on, stroke-dashoffset 0.3 s) + 'COMPANY-REPORTED' tag | SAFER OUTLINED (company-reported) on 'at risk' 515.16 |
|  | 516.060 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter '2.22' Mono 186 + ' million' DM Sans 700 86, left 130; 'jobs in the US' DM 38 at counter top + 206; BLS-category note DM 24 muted at counter top + 258. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 2.22 million jobs | DATA.md Pillar 3 table B: heavy and tractor-trailer truck drivers, BLS 2025 (BLS prints 2.22 million) |
| 58,640 a year | table B: median pay |
| +4% | table B: BLS outlook |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
(v).toFixed(2) + ' million'
