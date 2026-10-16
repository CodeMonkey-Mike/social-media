# C16-gates · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 890.520 to 895.500 s (source spine) · **Look:** house style
- **Spoken over it:** "Bill Gates can order a quarter of a million acres of farmland, you and I maybe we can't"
- **Source:** `assets/charts/C16-gates.html` (frames: start, mid, payoff) · **Design states:** `C16-gates-start.png` · `C16-gates-mid.png` · `C16-gates-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Scarcity panel, first state: four tiles in a row. The LAND tile (Bill Gates) lights: farmland mark, 275,000 acres OWNED counting up, 'almost 250,000 of it farmland', The Land Report. The three crypto tiles (BTC, KAS, TAO) wait as dark dashed slots showing only their tickers; they light in later states (C16-tao).

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 890.520 | 890.600 | card in; header + four dark dashed slots | cover start ('Bill Gates' 890.52) |
| 890.520 | 890.900 | Gates tile lights: dashed border -> solid card with green top accent, mark circle draws, name fades in | 'Bill Gates' 890.52 to 890.94 |
| 891.480 | 892.860 | acre counter 0 -> 275,000 (easeOutCubic) + 'acres owned' | 'order a quarter of a million acres' lands on 'acres' 892.86 |
| 893.620 | 893.900 | 'almost 250,000 of it farmland' + 'The Land Report' fade in | 'farmland' 893.62 |
| 894.100 | 895.500 | hold; the three dark slots breathe once (border opacity .6 -> 1 -> .6) | 'you and I maybe we can't' |

## Geometry (px at 1920x1080, read off the HTML)
tiles 374 x 590 at x = 140, 562, 984, 1406, top 290. Inside: mark circle r 68 centered at y 166; name DM 700 22 caps top 262; count Mono 50 top 304; unit DM 26 top 372; sub DM 23 top 414; issued bar top 478 (h 14, inset 36); foot Mono 18 top 548. Accents: land #00e68a, BTC #f7931a, KAS #49e0c8 (Kaspa only), TAO #e8eaf0.

## Every number on screen
| value | source |
|---|---|
| 275,000 acres owned | DATA.md Pillar 4: The Land Report 2026, total holdings 275,000 acres [VERIFY] |
| almost 250,000 farmland | DATA.md Pillar 4: 'almost 250,000 acres of highly productive farm ground' |

## Guards
AS-RECORDED flag 891.48: the card says OWNED (acres), never 'order'. No motive (never 'because of AI').

## Count format
Math.round(v).toLocaleString('en-US')
