# C5: QNT share of the total crypto market cap (Type 1 ANIMATED)

Design states: `C5.html` and `C5-<state>.png`. Geometry and data for the component: `C5-data.json` (`scale` = plot rect + domains in SVG coordinates, `svg_origin_on_stage` = where that SVG sits on the 1920x1080 stage, `line_path` / `area_path` = the exact drawn paths, `series`, `marks`).

Layout: the header is static from the first frame: eyebrow -> headline -> divider (66 x 4 px at x 96, y 200, the same rule as this video's cards). The SVG sits at `svg_origin_on_stage` = (96, 236), 1728 x 710; the footer row is y 952 to 1034. Every number, date and ticker is JetBrains Mono (`<tspan class="mono">` inside mixed labels): copy the label markup from `C5.html` as it stands.

Every element below lands on `useCurrentFrame()`. A static PNG standing in for this beat is a gate violation (`lint_animated_charts.py`).

## The line draw
Dense series, 689 points. Do not rebuild the path per frame. Render `line_path` + `area_path` once and animate a `<clipPath>` rect from the plot's left edge to its right edge, linear in time. The pixels stay stable, and the result matches `C5-mid.png` when the clip completes.

## Timeline
| Cue (s) | Word | What moves | State after |
|---|---|---|---|
| 400.40 | window opens (FB7, deck area) | Card and axes in place, fade + scale-in over 12 frames | `C5-start.png` |
| 401.58 to 406.20 | "This is Quant's market cap ... going back to 2018." | Line + area clip left to right, ending on "2018." | `C5-mid.png` |
| 406.20 | window end | Cut to full frame, nothing else changes | `C5-mid.png` |
| 406.88 | "peak" | Ring pops at 18 Oct 2022 (scale 0 to 1, 8 frames) | |
| 409.98 | "0.269" | "0.269%" and "18 Oct 2022 · in a bear market", one row above the ring, fade up 6 px over 8 frames | `C5-peak.png` |
| 413.72 | "bled" | Band wipes left to right over 45 frames (ends about 415.2) | |
| 416.40 | "0.03" | "0.03 to 0.04%" fades up, above the 0.05 gridline | `C5-band.png` |
| 423.70 | "0.028" | Ring + "0.028%" + "28 Aug 2026" | |
| 426.24 | "0.09" | Ring + "0.092%" + "4 Nov 2026" | |
| 428.54 | "more than a 3x" | "around 3.3x in 10 weeks" fades up | `C5-run.png` |
| 431.28 | "a third" | Dotted line draws from the peak ring to the right edge, then down to the 0.092% ring (20 frames), "0.269% / 2022 peak" fades in, takeaway rises in the footer | `C5-payoff.png` |

Holds to 433.267.

## Guards
- Vendor is CoinMarketCap on both numerator and denominator, locked by the spoken 0.269 / 0.028 / 0.09. Never CoinGecko's 0.110%, never TradingView's 0.155%.
- Linear y axis, so "a third" reads true by eye.
- The band starts at 2024-06-19, the first date after the peak that the series is at or below 0.04%, and ends at 2026-08-28.
- The VO says "in September" but 0.028% is dated 2026-08-28, so the card prints the real date.
