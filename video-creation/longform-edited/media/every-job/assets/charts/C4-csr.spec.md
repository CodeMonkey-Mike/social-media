# C4-csr · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 485.840 to 489.720 s (source spine) · **Look:** house style
- **Spoken over it:** "customer service reps, 2.7 million jobs at risk because"
- **Source:** `assets/charts/C4-csr.html` (frames: start, mid, payoff) · **Design states:** `C4-csr-start.png` · `C4-csr-mid.png` · `C4-csr-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #04, CUSTOMER SERVICE REPS: US-jobs count-up, median pay and BLS outlook chips, the four-lights panel (scored: CHEAPER LIT), tier badge DEPLOYED. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 485.840 | 485.920 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('customer service reps' 485.84) |
| 487.000 | 488.280 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '2.7 million' lands on 'million' 488.28 |
| 488.980 | 489.280 | the scored lamp FILLS (flicker 3 frames then glow) | CHEAPER fills on 'at risk' 488.98 (the Salesforce 9,000 to about 5,000 receipt follows) |
|  | 489.720 | hold to the cut |  |

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 87px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206; BLS-category note DM 24 muted at counter top + 258. Chips 470 x 150 at top 700, x 140 (MEDIAN PAY) and 640 (BLS OUTLOOK). THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 2,666,000 jobs | DATA.md Pillar 3 table F: customer service representatives, BLS 2025 |
| 44,770 a year | table F: median pay |
| -5% (minus 141,800) | table F: BLS outlook |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
