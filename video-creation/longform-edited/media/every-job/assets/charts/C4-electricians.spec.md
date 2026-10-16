# C4-electricians · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 538.000 to 542.980 s (source spine) · **Look:** house style
- **Spoken over it:** "electricians, 821,000 jobs. There's no robot electrician right now"
- **Source:** `assets/charts/C4-electricians.html` (frames: start, mid, payoff) · **Design states:** `C4-electricians-start.png` · `C4-electricians-mid.png` · `C4-electricians-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #08, ELECTRICIANS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: all four DARK), stamp 'NO ROBOT YET', tier badge FORECAST. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 538.000 | 538.080 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('electricians' 538.00) |
| 538.900 | 539.940 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '821,000' lands on ',000' 539.94 |
| 541.180 | 541.400 | stamp 'NO ROBOT YET' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'no robot electrician' 541.18 |
|  | 542.980 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 821,000 jobs | DATA.md Pillar 3 table A: electricians, BLS 2025 |
| 63,190 a year | table A: median pay |
| +9% | table A: BLS outlook (data centers named as a driver) |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). No robot does this job yet: FORECAST tier, NO ROBOT YET stamp, no apprenticeship length on this card. 

## Count format
Math.round(v).toLocaleString('en-US')
