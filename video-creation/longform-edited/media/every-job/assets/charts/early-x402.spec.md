# early-x402 · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 933.820 to 939.680 s (source spine) · **Look:** house style
- **Spoken over it:** "now I know that sounds tiny, about 24 million dollars a month, but that's really what early looks like"
- **Source:** `assets/charts/early-x402.html` (frames: start, mid, payoff) · **Design states:** `early-x402-start.png` · `early-x402-mid.png` · `early-x402-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Scale contrast. Visa is a HUGE outlined bar across the whole frame (14.2 trillion dollars a year, fiscal 2025). Under it the x402 bar is a 6 px green sliver (about 24 million dollars a month) with the note that at true scale it would be thinner than a pixel (true either per month or per year). Takeaway: 'That's what early looks like.'

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 933.820 | 933.900 | card in; the Visa outline is already drawn with its label (it is the backdrop the viewer measures against) | cover start ('Now I know' 933.82) |
| 934.660 | 935.100 | the Visa outline pulses once (stroke #8892a4 -> #e8eaf0 -> #8892a4): 'tiny' compared to THIS | 'sounds tiny' 934.66 |
| 935.100 | 936.820 | x402 sliver fills bottom-up (0 -> 150 px tall, 6 px wide), dashed leader draws, label block fades in; '24 million' counts 0 -> 24 (integer) | 'about 24 million dollars a month' 935.10 to 936.82 |
| 937.800 | 938.400 | takeaway 'That's what early looks like.' slides up 16 px + fades in | 'really what early' 937.80 to 938.32 |
| 938.400 | 939.680 | hold |  |

## Geometry (px at 1920x1080, read off the HTML)
Visa bar rect x 140 y 330 1640 x 150, rx 14, stroke #8892a4 2.5, fill rgba(255,255,255,.02); label at left 184 top 358 (Mono 58). x402 sliver x 140 y 580 6 x 150 #00e68a; dashed leader 150 -> 214 at y 655; label left 232 top 586. Takeaway bottom 110, DM 700 46.

## Every number on screen
| value | source |
|---|---|
| about 24 million dollars a month | DATA.md Pillar 6b: CoinDesk 2026-07-15 citing x402.org, about USD 24 million over 30 days [VERIFY] |
| 14.2 trillion dollars a year | DATA.md Pillar 6b: same CoinDesk article, Visa fiscal 2025 |
| thinner than a pixel | geometry: 24M / 1.18T a month (or 288M / 14.2T a year) x 1640 px = about 0.03 px |

## Guards
Guard 8: no 165/205 million transaction counts; the rail is stablecoins (not KAS).

## Count format
Math.round(v) + ' million'
