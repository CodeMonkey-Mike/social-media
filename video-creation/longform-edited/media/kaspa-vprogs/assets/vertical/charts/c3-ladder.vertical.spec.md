# c3-ladder: VERTICAL (9:16) animation spec (Type 1 ANIMATED, chart-builder, 2026-09-29)

Portrait twin of `assets/charts/c3-ladder.spec.md`. Design source: `c3-ladder.html` in this folder (geometry
comment at the top of its CSS). The five PNGs (`c3-ladder-{empty,crescendo,yellow-paper,toccata,silverscript}.png`,
2160x3840 = 1080x1920 @2x) are the SPEC, not comp inputs. The vertical comp's `useCurrentFrame` component
reproduces them pixel for pixel (charts.md §3; lint_animated_charts.py fails a static PNG here). Bench only: a
reveal-a-bitmap of `c3-ladder-silverscript.png` if the component jitters.

**Content is byte-identical to the 16:9 spec:** same copy, same dates, same tags, same state ids, same cue
times, same easing. Only the GEOMETRY below changes. Every number is DATA.md Pillar 4 (dates) / §2 Pillar 3
(10 BPS) / §3 (KIP-2), unchanged from the 16:9 (no new numbers on screen).

Cover window: CH3 139.84-160.34 (final-spine seconds; shift through `sh()` for the 137.58 card pause).

## Geometry (1080x1920, reuse exactly)
- Frame: header `left 72, top 130` (eyebrow 28px, h1 Playfair 900 108px "The ladder", divider 76x5).
  Legend (SHIPPED / NOT YET) moves up beside the headline: `left 660, top 196`, rows 20px apart.
- Rails x=110 and x=250 (same 140 width as 16:9). Dashed muted (#3a4254, 5px, 14/12) y 420 to 860;
  solid muted (#2a3142, 6px) y 860 to 1580.
- Rung centres y: DAGKNIGHT 480 · FULL vPROGS 610 · NEXT 740 (future, dashed, always visible) ·
  SILVERSCRIPT 900 · TOCCATA 1100 · YELLOW PAPER 1300 · CRESCENDO 1490 (shipped).
  Rung bar x 110 to 250, 12px, green to cyan gradient + glow (future: 14px dashed #3d4557 outline).
- **Labels column x=300, width 708.** Name line (DM Sans 700 38px, .05em, 56px tall) is centred on its
  rung: `top = rung - 28`. Tag pill sits inline right of the name (22px). Sub line (27px) 8px under the name.
- **Dates moved: from right-aligned-left-of-rail (16:9) to a line ABOVE the name**, x=300,
  `top = rung - 82` (JetBrains Mono 600 32px, line-height 40, green).
- Progress rail: green 6px line on BOTH rails from y 1580 up to the latest landed rung (1490 / 1300 / 1100 / 900).
- Source line: `left 72, right 72, bottom 196`, JetBrains Mono 21px, wraps to 2 lines.

## Choreography (cue = word onset on the final spine; identical to 16:9)
| t (s) | word | what moves | how |
|---|---|---|---|
| 139.84 | "Look" | cover in: header, legend, rails, 3 dim dashed future rungs + labels (state `empty`) | the SPIN (lib:spin-3d-side-ease-up) is the entry, per TRANSITIONS.md; no separate scale-in |
| 140.70 | "May" | CRESCENDO rung grows left to right (8f); progress rail draws 1580 to 1490 (8f); date `2025-05-05` fades up + 20px slide from left (10f) | ease-out |
| 142.74 | "Crescendo" | name CRESCENDO slides in from x+24, opacity 0 to 1 (10f) | |
| 143.64 | "10" | tag `10 BLOCKS / SEC` pops (scale 0.9 to 1, opacity, 8f) -> state `crescendo` | |
| 144.92 | "September" | YELLOW PAPER rung + progress rail to 1300 + date `2025-09-11` + name `vPROGS YELLOW PAPER` together | as above |
| 146.96 | "draft" | tag `DRAFT v0.0.1` (gold) pops -> state `yellow-paper` | |
| 147.46 | "June" | TOCCATA rung + progress rail to 1100 + date `2026-06-30` | |
| 149.52 | "Toccata" | name TOCCATA slides in | |
| 150.54 | "Zero" | sub `ZK verify + covenants` fades up | |
| 153.02 | "Live" | `LIVE ON MAINNET` solid-green pill pops, one glow pulse (box-shadow 26 to 44 to 26px over 18f) | |
| 154.54 | "Inside" | sub `· inside Kaspa consensus` fades up -> state `toccata` | |
| 156.28 | "September" | SILVERSCRIPT rung + progress rail to 900 + date `2026-09-09` | |
| 158.60 | "Silverscript" | name `SILVERSCRIPT 1.0` slides in; sub `smart contract language` fades up with it -> state `silverscript` (PAYOFF) | |
| 158.6-160.34 | | hold; whole card drifts 1.00 to 1.03 scale, transform-origin (180px, 1100px) = the ladder, so it pushes toward the rungs and never crops the labels column | linear |
| 160.34 | "The" | cover out to R6 receipt | cross-fade |

- Portrait note on the progress rail: it climbs 670px (1580 to 900) vs 485px in 16:9, so the UP swing of the
  spin entry and the rail climb read even stronger on the phone. Keep the per-rung 8f draw; do not stretch it.
- Future rungs never animate here; their break-up is `diagrams/c3-next-rungs` (vertical twin in `../diagrams/`).
- Draw every label as SVG `<text>` or fixed-position divs measured ONCE (charts.md §6 jitter rule); only
  opacity/transform animate.
- No day-relative words anywhere on the card (the VO's "this year" is carried as `2026-06-30`).
