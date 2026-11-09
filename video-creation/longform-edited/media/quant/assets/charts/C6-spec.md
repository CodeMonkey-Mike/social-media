# C6: Quant against the peers, indexed to 100 (Type 1 ANIMATED)

Design states: `C6.html` and `C6-<state>.png`. Geometry and data for the component: `C6-data.json` (`scale_A` = y 0 to 160, `scale_B` = y 0 to 400, same plot rect and x domain; `svg_origin_on_stage`; `series` per ticker, daily; `colors`; `legend_x`; `end_labels` with their de-collided label positions).

Layout: the header is static from the first frame: eyebrow -> headline -> divider (66 x 4 px at x 96, y 200, the same rule as this video's cards). The SVG sits at `svg_origin_on_stage` = (96, 236), 1728 x 710; the footer row is y 952 to 1034. Every number, date and ticker is JetBrains Mono (`<tspan class="mono">` inside mixed labels): copy the label markup from `C6.html` as it stands.

Sparse enough to animate for real (7 lines, 361 to 365 points): compute the paths per frame from the two scales. All text stays SVG `<text>` so it does not jitter.

## The one big move: the y axis rescales
The first ten months read on scale A, where 82 against 76 is legible. On "leaves the group" Quant runs off the top of that scale and the axis rescales to B, so the peers visibly collapse into a band under one line. Interpolate `y1` from 160 to 400 with an ease-in-out, and animate the ticks with it: 150 and 50 fade out, 200 / 300 / 400 fade in, 100 and 0 ride the scale. The baseline label moves with it from its scale-A spot to its scale-B spot (`C6-82.png` to `C6-break.png`), because Quant's vertical would otherwise run through it.

## Timeline
| Cue (s) | Word | What moves | State after |
|---|---|---|---|
| 433.267 | window opens (FB8, deck area) | Axes + Quant legend chip, fade + scale-in over 12 frames | `C6-start.png` |
| 434.68 / 435.22 / 435.94 / 436.48 / 436.86 | Chainlink / Hedera / XRP / Stellar / Canton | Each legend chip lands on its word (spoken "Styler" is Stellar). All lines draw together by a date-linear x cut from 434.68 | |
| 438.10 | "indexed" | Dashed baseline + "indexed to 100 · 2025-11-05" fade in | `C6-legend.png` (draw about 2026-03-31) |
| 441.46 | "Bitcoin" | Bitcoin chip lands, its dashed grey line appears drawn up to the current cut | |
| 442.30 | window end | Draw reaches 2026-08-31 exactly at the cut to full frame | `C6-mid.png` |
| 445.92 | "140" | Ring + "140" with "1 Dec 2025" stacked under it, right of the ring (a same-row date would hit Canton's spike) | `C6-140.png` |
| 449.42 | "82" | Ring + "82" + "31 Aug 2026" | `C6-82.png` |
| 453.06 | "peers" | Peer lines hold still. Nothing prints here | |
| 455.84 to 456.52 | "line leaves the group" | 140 and 82 markers fade. Draw runs 2026-08-31 to 2026-10-01 while the y axis rescales A to B, both ending on "group." | `C6-break.png` |
| 456.66 to 458.38 | "A year later, Quant sits at 273." | Draw runs on to 2026-11-04. Ring + big "273" land on "273." | `C6-273.png` |
| 461.06 | "below 100" | Endpoint labels + leaders stagger in, top to bottom, 3 frames apart. Takeaway rises in the footer | `C6-payoff.png` |

Holds to 461.767.

## Guards
- NEVER print "fell from 40 to 60" (AS-RECORDED flag 451.72). The lines carry that sentence.
- The 140 marker is CONFIRMED on the daily series: 140.04 on 2025-12-01, a CoinGecko point from DATA.md's C6 endpoint (the month-end table only shows 131 / 97).
- 82 is 2026-08-31 as spoken. The August daily low is 77 on 2026-08-19; the card does not print it.
- Canton's first day is 2025-11-10, so its line starts five days late, and the note is on the card from the first frame.
- No price targets, no market-cap comparison on this card.
