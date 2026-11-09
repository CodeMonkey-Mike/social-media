# bullish-on-kaspa: PORTRAIT diagram state cues (chart-builder, 2026-11-05)

Type 2 SYSTEM-DESIGN stills, 1080x1920, re-laid tall, never letterboxed. **Every state name, word, number and beat time is the 16:9's** (`assets/diagrams/_state-cues.md` owns the timing tables, unchanged). This file only lists what the portrait layout moves. Source for each: `<id>.html` here, one `.frame` per state. Generator: `research/chart-data/build_charts_vertical.py`.

Accent: Kaspa #49EACB on fills, #0E7A6C on text and lit wires. No red anywhere in these files, with ONE exception: the X on `consensus-validates-indexer-out` is accent red #C41E3A (visual-qa fix, 2026-11-05).

## Comp overlays: where they go in portrait
The 16:9 comp's overlay coordinates are for a 1920x1080 frame and land on top of content here. Use these free boxes (x, y ranges in portrait px):

| Overlay | Over state | Free box | Note |
|---|---|---|---|
| `LightPop` THROWN AWAY (46.26) | `C1-A` | x 430 to 1040, y 1220 to 1500, centre (735, 1360) | Under the dropped block. Two lines (THROWN / AWAY) fit at the 16:9's 92 px; one line needs about 70 px (estimated; check the frame at comp build) |
| `LightPop` EVERY BLOCK COUNTS (47.9) | `C1-B` | x 130 to 1040, y 1680 to 1790, centre (585, 1735) | Under the last row. Clear of TIME if it starts at x 170 |
| `KtChip` 10 BLOCKS / SECOND (57.78) | `C1-C` | x 130 to 610, y 1690 to 1790, centre (370, 1735) | GHOSTDAG: ONE ORDER holds the right half of this band |
| `KtChip` JULY 2 (119.4) | `C5-jul2` | x 670 to 1000, y 850 to 945, centre (835, 898) | On the JUL 2 row, right of FIRST SMART COINS |
| `LightPop` A CASCADE (481.0) | `cascade-base` | x 70 to 1010, y 1745 to 1890, centre (540, 1815) | Under the Kaspa pool. There is no source line on this id |

No other overlay in the 16:9 comp sits on these ids. The `kt-keyword-pop` and chip wording stays exactly as it is.

## What changed per id
- **C1:** time runs DOWN the frame. Rail x 70, y 430 to 1700, TIME below it. Each 16:9 block column is a portrait row: rows y 520, 700, 880, 1060, 1240, 1420, 1600. Block 108. A row's blocks sit at x 230 / 480 / 730 (three), 355 / 605 (two), 480 (one). The chain states use x 355, and the fork block x 605 on the same row, because same row = same moment.
  - **Fill order for the counter (dark #0E7A6C), same order as the 16:9:** row y 880 (x 230, 480, 730), row y 1060 (355, 605), row y 1240 (230, 480, 730), row y 1420 (355, 605).
  - The ordering thread and its chip exit lower right. Thread start on "GhostDAG", land on "order": the 16:9's timing trap still applies.
  - Bracket ONE SECOND sits right of the rows, x 804 to 826, y 814 to 1486. The digit 10 lands at (934, 1196).
- **C5:** the rail runs down at x 310: date left of it, label right of it, 12 rows every 96 px from y 610. Chips across the top at y 430, wired to the TOCCATA row around the right edge. Multi-line labels are now one line, same words.
- **indexer-vs-l1:** L1 on top, the chain boundary is now a horizontal dashed line at y 1185, the indexer below it. The flaw mark lands inside the indexer box, x 676 to 890.
- **consensus-validates:** ring on top at (540, 880), r 262, satellites at R 392. Boundary horizontal at y 1385, indexer below it. `-indexer-out` lands one continuous 14 px red X corner to corner across the box, painted under the label with no halo so the letters stay whole on the strike (the 16:9's masked grey stubs are gone in portrait). The comp plays the PNG, it draws nothing.
- **kasplex-based-rollup:** L2 on top, both arrows down, L1 below with SEQUENCING and DATA AVAILABILITY stacked. The gas chip is a full-width bar under L1, y 1584 to 1694.
- **D1:** same triangle drawn tall: top app (540, 660), lower apps (260, 1250) and (820, 1250). TALK TO EACH OTHER wraps to two lines inside the triangle. UNDER CONSTRUCTION (`D1-B`, bench only) moves bottom right.
- **cascade:** Bitcoin pool top left, Kaspa pool bottom right, stairs run down and right between them. The third arrow drops INTO the Kaspa pool from above. Pool levels are still a shape, not a measurement. MY THEORY stays baked in, top right.

## Pixel identity
Every state is rendered alone at the page origin, same as the 16:9, so a state swap reads as a transform. Marquee moves carry over: `TRANSITION-PLAN.json` refs keep their names, and each state already opens in its post-transform layout.
