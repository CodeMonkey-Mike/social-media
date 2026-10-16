# C4-radiologists · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 596.767 to 602.320 s (source spine) · **Look:** house style
- **Spoken over it:** "radiologists, 29,000 jobs at about 420,000 dollars a year"
- **Source:** `assets/charts/C4-radiologists.html` (frames: start, mid, payoff, yet, note) · **Design states:** `C4-radiologists-start.png` · `C4-radiologists-mid.png` · `C4-radiologists-payoff.png` · `C4-radiologists-yet.png` · `C4-radiologists-note.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
C4 job card #11, RADIOLOGISTS: US-jobs count-up, median pay chip (no BLS outlook figure for this job, so the second-chip slot is empty), the four-lights panel (scored: all four DARK), stamp 'TOOLS, NOT REPLACEMENT', tier badge DEPLOYED · TOOLS. Same template as every C4 card.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 596.767 | 596.847 | card in: cross-fade + 0.93 to 1 scale (house container swap); name, chips, THE TEST panel (all four lamps dark), tier badge and source already set; counter at 0 | cover start ('radiologists' 596.94) |
| 597.500 | 598.520 | US-jobs counter 0 -> target (easeOutCubic), LEFT-anchored at x=130, mono so no jitter | '29,000' lands on ',000' 598.52 |
| 600.320 | 601.160 | MEDIAN PAY chip: border + value brighten, scale 1 -> 1.04 -> 1 | MEDIAN PAY chip pulses on 'four hundred and twenty thousand' 600.32 to 601.16 |
| 601.860 | 602.080 | stamp 'TOOLS, NOT REPLACEMENT' SLAMS in (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle) | 'a year' 601.86 |
|  | 602.320 | hold to the cut |  |

## SECOND COVER: state 'note' (628.240 to 633.520 s, source spine)
_Spoken over it:_ "(the tail of 'a tool in the doctor's hands,) right now. And if I was picking a career right now I would not be choosing radiology"

The NOTE still is the approved look this second cover lands on, pixel for pixel. Its start state IS the PAYOFF still (identical pixels, the card simply returns); the `yet` still is its mid design state (dashed tag, never rendered).

The SAME job card, second state (CH4 B41, after the Huang beats): every element of the payoff still is pixel-identical; two elements are ADDED and nothing moves or recolors: (1) a gold dashed FORECAST stamp '...YET' right-aligned under the bone stamp, so the two read as one line, 'Tools, not replacement... yet' (gold = the FORECAST tier color, as on the NO ROBOT YET stamps); (2) a MY TAKE chip in the empty second-chip slot: 'Not the career I'd pick right now.' (Mike's opinion, said as his). The tier badge stays the white C3 DEPLOYED · TOOLS badge: the deployed fact is unchanged, the forecast is carried by the gold stamp.

| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 628.240 | 628.320 | SECOND COVER, the same card returns: it lands on the PAYOFF state exactly (counter already 28,700, no re-count; stamp, lamps, badge, chips as the payoff still), same house container swap (cross-fade + 0.93 to 1 scale) | cover start, lands on the last 'right' 628.26 |
| 628.980 | 629.200 | gold dashed FORECAST stamp '...YET' SLAMS in under the end of the bone stamp, right-aligned to it (scale 1.35 -> 1, rotate -10 -> -6 deg, opacity 0 -> 1, 4-frame settle: the same slam as every C4 stamp); the bone stamp does not move | 'now' 628.98 (the last 'right now' of 'a tool in the doctor's hands, right now') |
| 630.060 | 630.460 | MY TAKE chip fades up 12 px into the empty second-chip slot (x 640, the BLS OUTLOOK slot of the other cards), gold top accent draws left to right over the same 0.40 s | 'picking a career' 630.06 |
| 632.100 | 632.700 | MY TAKE chip pulse: gold border alpha .30 -> .75 -> .30 and scale 1 -> 1.03 -> 1 (the MEDIAN PAY pulse, gold) | 'not' 632.10 of 'I would not be choosing radiology' (to 632.30) |
|  | 633.520 | hold the NOTE state to the cut |  |

Note-state geometry: '...YET' stamp: class stamp gold (DM Sans 700 34, 5 px dashed border, rotate -6 deg), right 140 top 942. MY TAKE chip: 470 x 150 at left 640 top 700, border rgba(255,215,0,.30), gold top accent 3 px; label 'MY TAKE' DM 600 19 muted at 30 / 26; text DM Sans 700 34, line-height 1.16, primary, two lines at 30 / 56 (break after "I'd").

## Geometry (px at 1920x1080, read off the HTML)
eyebrow left 140 top 108; job name Playfair 900 116px left 136 top 150; counter top 330; counter Mono 186, left 130; 'jobs in the US' DM 38 at counter top + 206. Chip 470 x 150 at top 700, x 140 (MEDIAN PAY); the x 640 slot stays empty until the note state's MY TAKE chip fills it. THE TEST panel 490 x 514 at left 1290 top 236: lamps r=38 at x=1352, y = 352 / 470 / 588 / 706 (BETTER, FASTER, CHEAPER, SAFER), words DM 700 34 at x=1412. Stamp right 140 top 872, rotate -6 deg, 5 px border. Badge top 58 right 80.

## Every number on screen
| value | source |
|---|---|
| 28,700 jobs | DATA.md Pillar 3 table E: radiologists, BLS 2025 |
| 420,860 a year | table E: BLS median (AS-RECORDED flag 600.32: the card shows 420,860) |
| tools, not replacement | table E: FDA 1,600+ AI-enabled devices; radiologists still employed (T1 tools) |
| ...yet (note state) | Mike's forecast, SCREENPLAY CH4 Beat 12 ('it hasn't happened yet', AS-RECORDED 618.00); no number |
| MY TAKE: Not the career I'd pick right now (note state) | Mike's own opinion, said as his: AS-RECORDED 629.40 'if I was picking a career right now I would not be choosing radiology'; no number |

## Guards
Lights per SCREENPLAY VISUAL-PLAN: FILLED only on a data receipt, OUTLINED on a company-reported claim, DARK otherwise (proposed scoring, Mike to rule). 

## Count format
Math.round(v).toLocaleString('en-US')
