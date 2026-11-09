# C7: Quant priced in Bitcoin (Type 1 ANIMATED, one chart, two states)

Design states: `C7.html` and `C7-<state>.png`. Geometry and data for the component: `C7-data.json` (`scale_s1`, `scale_s2`, `svg_origin_on_stage`, `series_1y` = CoinGecko daily, `series_long` = CoinMarketCap every 4 to 5 days, `marks`).

Layout: the header is static from the first frame: eyebrow -> headline -> divider (66 x 4 px at x 96, y 200, the same rule as this video's cards). The SVG sits at `svg_origin_on_stage` = (96, 236), 1728 x 710; the footer row is y 952 to 1034. Every number, date and ticker is JetBrains Mono (`<tspan class="mono">` inside mixed labels): copy the label markup from `C7.html` as it stands.

## Timeline
| Cue (s) | Word | What moves | State after |
|---|---|---|---|
| 461.767 | window opens (FB9, deck area) | Axes, fade + scale-in over 12 frames | `C7-s1-start.png` |
| 462.36 to 473.86 | under the two dated sentences | Line + area draw left to right, date-linear, reaching 2026-11-04 on the second "sats." | |
| 467.96 | "sats" (first) | Start ring, leader and the "0.00071745 BTC / 71,745 sats / 5 Nov 2025" block land | `C7-s1-first.png` shows this block on the partial line (the PNG's line is cut at 2026-05-15, the look of the mid-draw, not a cue) |
| as the draw passes 2026-10-01 | | Peak ring + "0.003438 BTC / peak · 343,849 sats · 1 Oct 2026" land | |
| 473.86 | "sats" (second) | End ring + "0.00254198 BTC / 254,198 sats / 4 Nov 2026" land | `C7-s1-end.png` |
| 474.133 | window end | Cut to full frame | `C7-s1-end.png` |
| 475.34 | ".5" of "3.5x" | "3.54x" lands | |
| 479.34 | "23" | "BTC in USD: -23.0%" lands | `C7-s1-payoff.png` |
| 481.08 to 482.60 | "Zoom out though, and the all time high" | THE ZOOM, see below. Every s1 label + the ratio fade out in the first 8 frames | |
| 483.90 | "was in" | ATH ring + leader + "0.01167 BTC" + "16 Oct 2022" (one row) land. End ring + "0.00254 BTC / 254,198 sats / 4 Nov 2026" land with them | |
| 486.52 | "1.17" | "around 1.17 million sats" lands | `C7-s2-zoom.png` |
| 491.14 | "22" | Dotted line draws from the ATH ring across, then down to today's ring (20 frames), "around 22% of the ATH" lands, takeaway rises in the footer | `C7-s2-payoff.png` |

Holds to 494.56.

## The zoom (481.08, about 46 frames, ease-in-out)
Interpolate both domains from `scale_s1` to `scale_s2`: x from 2025-11-05..2026-11-04 to 2018-08-10..2026-11-04, y from 0..0.004 to 0..0.012. The 1-year line compresses into the right edge while the long-run line fades in from opacity 0 over the same frames, and the 1-year line fades out over the last 12. They agree closely at that end, so the handover should not show. Ticks cross-fade.

## Guards
- Both dates are on the card with their values (the ratio-without-dates guard, DATA.md do-not-air).
- Both units are on screen for every labelled point (BTC decimal + sats).
- 3.54x = 0.00254198 / 0.00071745 (spoken "around a 3.5x"). -23.0% = BTC $101,481 to $78,166.
- The ATH ring sits ABOVE the drawn line on purpose. CoinGecko's ATH is 0.01166603 BTC on 2022-10-16, and CoinMarketCap's sampled line peaks at 0.010675 BTC on 2022-10-18. The dotted leader and the source note on the card say so. Do not snap the ring to the line, and do not insert the point into the line.
- Around 22% = 0.00254198 / 0.01166603 = 21.8%.
