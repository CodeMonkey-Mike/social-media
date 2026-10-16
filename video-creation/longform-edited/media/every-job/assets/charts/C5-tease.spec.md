# C5-tease · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 51.020 to 53.760 s (source spine) · **Look:** house style
- **Spoken over it:** "It goes all the way up even to brain surgeons"
- **Source:** `assets/charts/C5-tease.html` (frames: start, mid, payoff) · **Design states:** `C5-tease-start.png` · `C5-tease-mid.png` · `C5-tease-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
First state of C5. The 12 pay rungs (bottom = cashier, top = neurosurgeon) GROW one after another from the bottom, fast, all on the TRUE full scale (829,161 = 1180 px), so the nine trade rungs stay tiny and the top two shoot out. No job names, no figures: only the top rung is labeled NEUROSURGEON as it lands.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 51.020 | 51.100 | card in; header + the ladder rail; no bars | cover start ('It goes' 51.02) |
| 51.120 | 52.980 | rungs 0..11 grow left to right one after another, bottom first: each starts 0.15 s after the previous and takes 0.35 s (easeOutCubic); widths = 1180 x pay / 829,161 | 'goes all the way up' 51.12 to 52.44 |
| 52.980 | 53.300 | the top bar's glow blooms and NEUROSURGEON fades in on its label slot | 'brain surgeons' 52.98 to 53.22 |
| 53.300 | 53.760 | hold | 'now' 53.76 |

## Geometry (px at 1920x1080, read off the HTML)
rows i = 0 (cashier) .. 11 (neurosurgeon); bar top y = 916 - 58 i, height 38, x = 548, width = 1180 x pay / 829,161 (cashier 46.8, plumber 90.8, programmer 142.9, radiologist 598.9, neurosurgeon 1180). Bar fill = linear-gradient(90deg, #00e68a, #00c2ff); highlighted rung adds a blurred #00e68a glow (stdDev 9). Rail x=547, y 266 to 966. Labels right-aligned to x=528, DM Sans 600 27px.

## Every number on screen
| value | source |
|---|---|
| bar lengths | proportional to the 12 C5 values (BLS May 2025 medians; Doximity 2026 average for neurosurgeon); no figure is shown |

## Guards
No figures on this tease (they land in CH4). Bars must be TO SCALE.

## Count format
n/a
