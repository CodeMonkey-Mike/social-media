# money-printer-card · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 1025.200 to 1029.440 s (source spine) · **Look:** house style
- **Spoken over it:** "So that number gets a lot higher, cheaper goods, more dollars"
- **Source:** `assets/charts/money-printer-card.html` (frames: start, mid, payoff) · **Design states:** `money-printer-card-start.png` · `money-printer-card-mid.png` · `money-printer-card-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Stat card: '23.3 trillion dollars' counts UP to the record while a column fills to a dashed ALL-TIME HIGH line; then a gold dashed arrow pushes up PAST the record, labeled 'a lot higher' + FORECAST badge, with NO number on it; the two tags 'cheaper goods' (green, down) and 'more dollars' (gold, up) land on their words.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 1025.200 | 1025.280 | card in; header, empty column frame, ALL-TIME HIGH line set; counter 0.0 | cover start ('So' 1025.36) |
| 1025.360 | 1025.880 | counter 0.0 -> 23.3 (one decimal) and the column fills 0 -> 410 px to the record line (easeOutCubic) | 'that number' lands on 'number' 1025.88 |
| 1026.220 | 1026.940 | gold dashed arrow grows up from the record line 0 -> 218 px (arrowhead last); 'a lot higher' + FORECAST badge fade in | 'gets a lot higher' 1026.22 to 1026.94 |
| 1027.260 | 1027.560 | 'cheaper goods' pill pops (scale .9 -> 1) | 'cheaper goods' 1027.26 |
| 1028.140 | 1028.440 | 'more dollars' pill pops | 'more dollars' 1028.14 |
| 1028.440 | 1029.440 | hold |  |

## Geometry (px at 1920x1080, read off the HTML)
column x 1340 w 180, base y 880, record line y 470 (x 1300 to 1780, dashed white): fill height 410 px = 23.3. Forecast arrow x 1430 from y 462 up to y 252 (dashed #ffd700, 7 px). Counter Mono 220 left 128 top 290; 'trillion dollars' DM 700 54 top 520; context DM 32 top 596; pills top 716.

## Every number on screen
| value | source |
|---|---|
| 23.3 trillion dollars (August 2026, record) | DATA.md Pillar 6d: FRED M2SL 23,342.8 billion, the highest in the series [VERIFY] |
| 'a lot higher' | Mike's forecast (spoken), no number |

## Guards
Never 'the Fed is printing money' as a present fact (the Fed raised rates in September 2026): the column is the record, the arrow is labeled FORECAST and has no figure.

## Count format
v.toFixed(1)
