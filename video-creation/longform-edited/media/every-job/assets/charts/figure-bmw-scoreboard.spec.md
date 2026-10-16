# figure-bmw-scoreboard · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 249.980 to 256.560 s (source spine) · **Look:** HALLOWEEN (CH2 + CH3 look: black / blood red / pumpkin / bone on grunge)
- **Spoken over it:** "Monday through Friday and loaded more than 90,000 parts and helped build more than 30,000 cars"
- **Source:** `assets/charts/figure-bmw-scoreboard.html` (frames: start, mid, payoff) · **Design states:** `figure-bmw-scoreboard-start.png` · `figure-bmw-scoreboard-mid.png` · `figure-bmw-scoreboard-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Scoreboard of three pumpkin LED tiles: SHIFTS (10 hours, M T W T F S S day pips: Monday to Friday light, the weekend stays dark), PARTS LOADED counting to 90,000+, BMW X3s IT HELPED BUILD counting to 30,000+. DEPLOYED badge; the source line names it as Figure's own report.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 249.980 | 250.050 | card in; '10 hours' already lit (said at 249.42); pips dark; counters at 0; badge set | cover start ('Monday' 249.98) |
| 249.980 | 250.960 | day pips M, T, W, T, F light one by one (0.2 s apart); S, S stay dark | 'Monday through Friday' 249.98 to 250.96 |
| 252.280 | 253.320 | PARTS counter 0 -> 90,000 (easeOutCubic); '+' snaps on at landing | 'loaded more than 90,000' lands on ',000' 253.32 |
| 254.520 | 255.700 | CARS counter 0 -> 30,000; '+' snaps on | 'helped build more than 30,000' lands on ',000' 255.70 |
| 255.700 | 256.560 | hold | 'cars' 256.06 |

## Geometry (px at 1920x1080, read off the HTML)
tiles 520 x 500 at x = 140, 700, 1260, top 310 (#120c0b, border #3a2620, pumpkin top accent). Tile labels at 36/34. LED numbers JetBrains Mono 100px pumpkin, 22 px glow, left 36 top 150 inside each tile (LEFT-anchored, mono, no jitter). Pips 52 px, gap 10, left 36 top 330.

## Every number on screen
| value | source |
|---|---|
| 10 hours, Monday to Friday | DATA.md Pillar 2: Figure, 'Ran 10-hour shift Monday-Friday' |
| 90,000+ | DATA.md Pillar 2: Figure, '90,000+ parts loaded' |
| 30,000+ | DATA.md Pillar 2: Figure, 'Contributed to the production of 30,000+ X3 vehicles' |
| 11 months | DATA.md T2: Figure 02 at BMW for 11 months |

## Guards
'helped build' / 'contributed to', never 'built 30,000 cars'. One task (sheet-metal loading).

## Count format
Math.round(v).toLocaleString('en-US') + (landed ? '+' : '')
