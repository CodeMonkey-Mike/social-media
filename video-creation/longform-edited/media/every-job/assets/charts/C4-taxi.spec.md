# C4-taxi · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 464.320 to 468.460 s (source spine) · **Look:** house style
- **Spoken over it:** "taxi drivers, 456,000 jobs at risk because Waymo"
- **Source:** `assets/charts/C4-taxi.html` (frames: start, mid, payoff) · **Design states:** `C4-taxi-start.png` · `C4-taxi-mid.png` · `C4-taxi-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #02, TAXI DRIVERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: SAFER LIT), tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 464.320 | 464.400 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('taxi drivers' 464.32) |
| 465.160 | 466.460 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '456,000' lands on ',000' 466.46 |
| 467.560 | 467.860 | the scored lamp FILLS (flicker 3 frames then glow) | SAFER fills on 'risk' 467.56 (Waymo's safety data follows) |
|  | 468.460 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206; BLS-category note DM 24 muted at counter top + 258. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 455,700 jobs | DATA.md Pillar 3 table B: taxi drivers, shuttle drivers, chauffeurs, BLS 2025 |
| 37,960 a year | table B: median pay |
| +9% | table B: BLS outlook |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
