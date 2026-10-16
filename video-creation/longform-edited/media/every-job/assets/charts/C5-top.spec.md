# C5-top · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 633.520 to 638.960 s (source spine) · **Look:** house style
- **Spoken over it:** "and at the very top of the ladder, the brain surgeon, the average neurosurgeon in America makes about"
- **Source:** `assets/charts/C5-top.html` (frames: start, mid, payoff) · **Design states:** `C5-top-start.png` · `C5-top-mid.png` · `C5-top-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Third and last state of C5, back on the TRUE full scale (829,161 = 1180 px): the 11 lower rungs sit lit and small (the trades bunch up at the bottom), then the NEUROSURGEON bar grows far past every rung, radiologist included, with a counter riding its tip, and lands at 829,161 a year (value set inside the bar end) with the note 'AVERAGE PAY, DOXIMITY 2026' above the bar's right end.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 633.520 | 633.600 | card in; rows 0..10 already lit at full scale with values; the neurosurgeon row = label + empty slot | cover start ('and' 633.52) |
| 634.320 | 634.900 | the top row's label brightens and the eye is drawn up (rows 0..10 dim to .62) | 'the very top of the ladder' 634.32 to 634.90 |
| 635.760 | 638.660 | neurosurgeon bar grows 0 -> 1180 px (easeInOutCubic) with a live counter riding 14 px past its tip (Mono 32, white); it passes the radiologist's 598.9 px at about 637.2 | 'the brain surgeon' 635.76 -> 'neurosurgeon' 636.94 |
| 638.660 | 638.960 | landing: counter hits 829,161, re-seats INSIDE the bar end (dark #06130f, + 'a year'); glow blooms; 'AVERAGE PAY, DOXIMITY 2026' fades in above the bar's right end (top 244) | 'makes about $830' lands on '$830' 638.96 |

## Geometry (px at 1920x1080, read off the HTML)
rung geometry identical to C5-tease. Full-scale widths: cashier 46.8, taxi 54.0, warehouse 54.4, CSR 63.7, roofer 78.9, truck 83.5, carpenter 86.2, electrician 89.9, plumber 90.8, programmer 142.9, radiologist 598.9, neurosurgeon 1180. Lower-rung values Mono 26 at bar end + 14. Landed value Mono 30 right-aligned 18 px inside the bar end.

## Every number on screen
| value | source |
|---|---|
| 829,161 a year | DATA.md Pillar 3 surgeon block: Doximity 2026, neurosurgery AVERAGE (AS-RECORDED flag 638.96: the card shows 829,161) |
| 420,860 | DATA.md Pillar 3 table E: radiologists, BLS median |
| the other 10 values | as C5-climb (BLS May 2025 medians) |

## Guards
Never 900K (guard 4). The neurosurgeon figure is an AVERAGE (Doximity), the rest are BLS MEDIANS: the label note and the source line say so.

## Count format
Math.round(v).toLocaleString('en-US')
