# C4-warehouse · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 478.800 to 482.100 s (source spine) · **Look:** house style
- **Spoken over it:** "warehouse workers, 6.9 million jobs at risk because"
- **Source:** `assets/charts/C4-warehouse.html` (frames: start, mid, payoff) · **Design states:** `C4-warehouse-start.png` · `C4-warehouse-mid.png` · `C4-warehouse-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #03, WAREHOUSE WORKERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: all four DARK), stamp 'AMAZON: 1,000,000 ROBOTS DEPLOYED', tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 478.800 | 478.880 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('warehouse workers' 478.80) |
| 479.900 | 481.300 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '6.9 million' lands on 'million' 481.30 |
| 481.600 | 481.820 | stamp 'AMAZON: 1,000,000 ROBOTS DEPLOYED' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'jobs' 481.60 |
|  | 482.100 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 107px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206; BLS-category note DM 24 muted at counter top + 258. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 6,917,800 jobs | DATA.md Pillar 3 table C: hand laborers and material movers (warehouse), BLS 2025 |
| 38,220 a year | table C: median pay |
| +4% | table C: BLS outlook (overall) |
| 1,000,000 robots | DATA.md Pillar 2: Amazon's one millionth robot (aboutamazon.com) |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
