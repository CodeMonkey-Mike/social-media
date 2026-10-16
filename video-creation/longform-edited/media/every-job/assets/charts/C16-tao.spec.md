# C16-tao · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 959.660 to 965.700 s (source spine) · **Look:** house style
- **Spoken over it:** "and on the AI side there's Bittensor, TAO, an open AI network with a hard cap of 21 million, the same as Bitcoin"
- **Source:** `assets/charts/C16-tao.html` (frames: start, mid, payoff) · **Design states:** `C16-tao-start.png` · `C16-tao-mid.png` · `C16-tao-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Scarcity panel, TAO state: land, BTC (21,000,000 max, 95.7% issued) and KAS (28.7 billion max, 96.6% issued) sit lit but dimmed to .5; the TAO tile lights with the Bittensor TAO mark (traced from the reference image), 'open AI network', then 'hard cap 21,000,000', its issued bar filling to 54.0%, and the tag 'SAME CAP AS BITCOIN'.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 959.660 | 959.740 | card in; land/BTC/KAS tiles lit at opacity .5; TAO slot dark | cover start ("There's" 959.66) |
| 960.160 | 960.700 | TAO tile lights: solid card, white top accent, TAO mark circle draws, 'BITTENSOR · TAO' | 'Bittensor, TAO' 960.16 to 960.46 |
| 961.100 | 961.760 | 'open AI network' fades in | 'open AI network' 961.10 |
| 962.640 | 963.900 | '21,000,000' counts 0 -> 21,000,000 and its unit switches to 'hard cap'; issued bar fills 0 -> 54.0% with '54.0% already issued' | 'hard cap of 21 million' lands on 'million' 963.90 |
| 964.380 | 964.700 | 'SAME CAP AS BITCOIN' pill pops; the BTC tile flashes back to full opacity for 0.4 s in sympathy | 'The same as Bitcoin' 964.38 |
| 964.700 | 965.700 | hold |  |

## Geometry (px at 1920x1080, read off the HTML)
same tile geometry as C16-gates. TAO mark = core.g_tao at scale 1.75 inside the r 68 circle (stroke #e8eaf0). BTC mark = core.g_btc (drawn B, #f7931a). KAS mark = core.g_kas (mirrored K, #49e0c8).

## Every number on screen
| value | source |
|---|---|
| 21,000,000 (TAO hard cap) | DATA.md Pillar 6a / section 5: CoinGecko, TAO max supply 21,000,000 [VERIFY] |
| 54.0% issued | DATA.md section 5: 11,339,646 / 21,000,000, computed [VERIFY] |
| 21,000,000 · 95.7% (BTC) | DATA.md section 5: BTC max 21,000,000; 20,093,996 exist, 95.7% computed [VERIFY] |
| 28.7 billion · 96.6% (KAS) | DATA.md section 5: KAS max 28,704,026,601 (shown rounded); 96.6% computed [VERIFY] |
| 275,000 · almost 250,000 | as C16-gates |

## Guards
TAO never 'tau'. No fair-launch claim for TAO (none on this card). Teal = Kaspa only.

## Count format
Math.round(v).toLocaleString('en-US')
