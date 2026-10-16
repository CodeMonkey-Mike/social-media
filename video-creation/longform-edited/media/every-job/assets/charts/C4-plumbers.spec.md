# C4-plumbers · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 556.533 to 561.280 s (source spine) · **Look:** house style
- **Spoken over it:** "plumbers, 511,000 job, the job they told you was safe and"
- **Source:** `assets/charts/C4-plumbers.html` (frames: start, mid, payoff) · **Design states:** `C4-plumbers-start.png` · `C4-plumbers-mid.png` · `C4-plumbers-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #09, PLUMBERS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: all four DARK), stamp 'NO ROBOT YET', tier badge FORECAST. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 556.533 | 556.613 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('plumbers' 556.66) |
| 557.300 | 558.220 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '511,000' lands on ',000' 558.22 |
| 559.020 | 559.420 | the gold italic subtitle fades up 12 px (only the payoff still shows it; the counter keeps its lower top 350 in every state) | 'the job they told you was safe' 559.02 to 560.46 |
| 560.800 | 561.020 | stamp 'NO ROBOT YET' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'and' 560.80 (just before 'right now it is, there's no robot plumber') |
|  | 561.280 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; subtitle DM italic 40 gold top 282; counter top 350; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206; BLS-category note DM 24 muted at counter top + 258. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 510,600 jobs | DATA.md Pillar 3 table A: plumbers, pipefitters, steamfitters, BLS 2025 |
| 63,800 a year | table A: median pay |
| +7% | table A: BLS outlook |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). No robot does this job yet: FORECAST tier, NO ROBOT YET stamp, no apprenticeship length on this card. 

## Count format
Math.round(v).toLocaleString('en-US')
