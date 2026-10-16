# C4-programmers · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 580.780 to 584.460 s (source spine) · **Look:** house style
- **Spoken over it:** "111,000 jobs at risk because Google says"
- **Source:** `assets/charts/C4-programmers.html` (frames: start, mid, payoff) · **Design states:** `C4-programmers-start.png` · `C4-programmers-mid.png` · `C4-programmers-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #10, COMPUTER PROGRAMMERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: all four DARK), stamp 'GOOGLE: 75% OF NEW CODE BY AI', tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 580.780 | 580.860 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start (card lands already named (the climb said 'computer programmers' at 577.42)) |
| 580.800 | 581.300 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '111,000' 580.78 to 581.12, lands just after |
| 583.600 | 583.820 | stamp 'GOOGLE: 75% OF NEW CODE BY AI' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'says 75' 583.60 |
|  | 584.460 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 91px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 110,800 jobs | DATA.md Pillar 3 table F: computer programmers, BLS 2025 |
| 100,390 a year | table F: median pay |
| -7% | table F: BLS outlook |
| 75% of new code | DATA.md Pillar 1: Google (2026-04-23), 75 percent of new code AI-generated then reviewed by humans |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
