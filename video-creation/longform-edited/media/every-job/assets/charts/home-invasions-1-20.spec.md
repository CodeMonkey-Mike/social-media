# home-invasions-1-20 · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 988.800 to 995.020 s (source spine) · **Look:** house style
- **Spoken over it:** "crypto holders, kidnappings, torture and home invasions went from 1 to 20 in a year."
- **Source:** `assets/charts/home-invasions-1-20.html` (frames: start, mid, payoff) · **Design states:** `home-invasions-1-20-start.png` · `home-invasions-1-20-mid.png` · `home-invasions-1-20-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Two-number card, HOME INVASIONS only: first half of 2025 = 1 (one red house) -> first half of 2026 = 20 (a field of 20 house outlines that fill red one by one as the counter climbs 1 -> 20).

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 988.800 | 988.880 | card in; header + both half-year labels + 20 dark house outlines set; no numbers | cover start ('Crypto holders' 988.80) |
| 991.660 | 992.000 | headline words 'Home invasions' flash red -> white -> red | 'home invasions' 991.66 |
| 992.840 | 993.100 | '1' slams in (scale 1.2 -> 1) with its single red house; the arrow draws | '1' 992.84 |
| 993.240 | 993.740 | '20' counts 1 -> 20 while the right field fills red house by house (0.025 s apart) | 'to 20' 993.24 -> lands on '20' 993.74 |
| 993.740 | 995.020 | hold | 'in a year' 994.20 |

## Geometry (px at 1920x1080, read off the HTML)
numbers Mono 300: '1' left 128 top 318 (#e8eaf0), '20' left 808 top 318 (#ff4060). House glyph core.g_house scale .58 (58 x 56), stroke 6, lit fill rgba(255,64,96,.22); right field 2 rows x 10 from x 820, pitch 72, rows y 690 and 766; left house at x 140 y 690. Arrow x 560 -> 722 at y 480.

## Every number on screen
| value | source |
|---|---|
| 1 (H1 2025) -> 20 (H1 2026) home invasions | DATA.md Pillar 3 security block: CertiK Intel3D H1 2026, 'home invasions 20 against 1' [VERIFY newer report] |

## Guards
AS-RECORDED flag 988.80: ONLY home invasions went 1 -> 20 (kidnappings 12 -> 16, torture flat at 4): the card names HOME INVASIONS only.

## Count format
integer
