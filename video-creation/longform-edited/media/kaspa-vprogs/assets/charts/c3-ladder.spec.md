# c3-ladder: animation spec (Type 1 ANIMATED, chart-builder, 2026-09-28)

Design source: `c3-ladder.html` (geometry comment at the top of its CSS). The five PNGs are the SPEC, not
comp inputs: the comp builds a real `useCurrentFrame` component that reproduces them pixel for pixel
(charts.md §3; lint_animated_charts.py fails a static PNG here). Bench only: reveal-a-bitmap of
`c3-ladder-silverscript.png` if the component jitters (charts.md §3, COVER-PLAN bench).

Cover window: CH3 139.84-160.34 (final-spine seconds; shift through `sh()` for the 137.58 card pause).
Every number below is DATA.md Pillar 4 (dates) / §2 Pillar 3 (10 BPS) / §3 (KIP-2). [VERIFY] 2026-09-28:
Silverscript latest tag v1.0.0 (2026-09-09), KIP-2 status Proposed, kaspa.org/build vProgs "In construction".

## Geometry (1920x1080, reuse exactly)
- Rails x=890 and x=1030. Dashed muted (#3a4254, 14/12) from y 70 to 440; solid muted (#2a3142) 440 to 985.
- Rung centers y: CRESCENDO 925 · YELLOW PAPER 795 · TOCCATA 650 · SILVERSCRIPT 500 ·
  NEXT 365 · FULL vPROGS 245 · DAGKNIGHT 125. Rung bar x 890 to 1030, 12px, green to cyan gradient + glow.
- Dates right-aligned to x=850 (JetBrains Mono 600 30px, green). Labels start x=1080.
- Progress rail: green 6px line on BOTH rails from y 985 up to the latest landed rung.

## Choreography (cue = word onset on the final spine)
| t (s) | word | what moves | how |
|---|---|---|---|
| 139.84 | "Look" | cover in: header, legend, rails, 3 dim dashed future rungs + labels (state `empty`) | cross-fade + 0.93 to 1 scale-in, 12f |
| 140.70 | "May" | CRESCENDO rung grows left to right (8f); progress rail draws 985 to 925 (8f); date `2025-05-05` fades up + 20px slide from left (10f) | ease-out |
| 142.74 | "Crescendo" | name CRESCENDO slides in from x+24, opacity 0 to 1 (10f) | |
| 143.64 | "10" | tag `10 BLOCKS / SEC` pops (scale 0.9 to 1, opacity, 8f) -> state `crescendo` | |
| 144.92 | "September" | YELLOW PAPER rung + progress rail to 795 + date `2025-09-11` + name `vPROGS YELLOW PAPER` together | as above |
| 146.96 | "draft" | tag `DRAFT v0.0.1` (gold) pops -> state `yellow-paper` | |
| 147.46 | "June" | TOCCATA rung + progress rail to 650 + date `2026-06-30` | |
| 149.52 | "Toccata" | name TOCCATA slides in | |
| 150.54 | "Zero" | sub `ZK verify + covenants` fades up | |
| 153.02 | "Live" | `LIVE ON MAINNET` solid-green pill pops, one glow pulse (box-shadow 26 to 44 to 26px over 18f) | |
| 154.54 | "Inside" | sub `· inside Kaspa consensus` fades up -> state `toccata` | |
| 156.28 | "September" | SILVERSCRIPT rung + progress rail to 500 + date `2026-09-09` | |
| 158.60 | "Silverscript" | name `SILVERSCRIPT 1.0` slides in; sub `smart contract language` fades up with it -> state `silverscript` (PAYOFF) | |
| 158.6-160.34 | | hold; whole card drifts 1.00 to 1.03 scale toward the rungs (keeps it alive, never a dead still) | linear |
| 160.34 | "The" | cover out to R6 receipt | cross-fade |

- Future rungs never animate here; they are the dim "not yet" context. Their break-up is `diagrams/c3-next-rungs`.
- Draw every label as SVG `<text>` or fixed-position divs measured ONCE (charts.md §6 jitter rule); only
  opacity/transform animate.
- No day-relative words anywhere on the card (the VO's "this year" is carried as `2026-06-30`).
