# C5-climb · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 577.367 to 580.780 s (source spine) · **Look:** house style
- **Spoken over it:** "computer programmers. Remember learn to code"
- **Source:** `assets/charts/C5-climb.html` (frames: start, mid, payoff) · **Design states:** `C5-climb-start.png` · `C5-climb-mid.png` · `C5-climb-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Second state of C5, on a ZOOMED scale (115,000 = 1180 px) so the climb reads: the nine trade rungs (cashier 32,880 up to plumber 63,800) light fast bottom to top with their values, then the computer-programmer bar JUMPS out to 100,390 and gets the highlight, with a cyan 'REMEMBER: LEARN TO CODE' callback pill above it. Radiologist and neurosurgeon wait as ghost labels (no track): the top of the ladder is C5-top's job.

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 577.367 | 577.420 | card in; all 12 labels set (top two as ghosts), dashed tracks for rows 0..9, no bars | cover start ('computer' 577.42) |
| 577.420 | 578.300 | rows 0..8 fill bottom to top, 0.08 s apart, 0.25 s each (easeOutCubic); each value pops at its bar end as the bar lands | 'computer programmers' 577.42 to 577.90 |
| 578.300 | 578.900 | programmer bar JUMPS 0 -> 1030.1 px (easeOutBack, slight overshoot), glow blooms, label goes white 700, value '100,390' pops at 32 px; the other rungs dim to .62 | after 'programmers.' 577.90 |
| 579.000 | 579.400 | 'REMEMBER: LEARN TO CODE' pill drops in above (y -12 -> 0, opacity 0 -> 1) with its dashed pointer | 'Remember learn to code' 579.00 |
| 579.400 | 580.780 | hold (C4-programmers cuts in on '111' at 580.78) |  |

## Geometry (px at 1920x1080, read off the HTML)
same rung geometry as C5-tease (rows y = 916 - 58 i, h 38, x 548) but width = 1180 x pay / 115,000: cashier 337.4, taxi 389.5, warehouse 392.2, CSR 459.4, roofer 568.9, truck 601.7, carpenter 621.6, electrician 648.4, plumber 654.7, programmer 1030.1. Values Mono 26 at bar end + 14 (highlight: Mono 32, white). Pill left 1236 top 266.

## Every number on screen
| value | source |
|---|---|
| 32,880 · 37,960 · 38,220 · 44,770 · 55,440 · 58,640 · 60,580 · 63,190 · 63,800 | DATA.md Pillar 3 tables A-D, F: BLS May 2025 median pay (cashier, taxi, warehouse = hand laborers and material movers, CSR, roofer, heavy truck, carpenter, electrician, plumber) |
| 100,390 | DATA.md Pillar 3 table F: computer programmers, BLS median pay |

## Guards
The zoomed scale is stated in the source line ('Scale zoomed to 115,000 a year for the climb').

## Count format
values pop (no count) at Math.round(v).toLocaleString('en-US')
