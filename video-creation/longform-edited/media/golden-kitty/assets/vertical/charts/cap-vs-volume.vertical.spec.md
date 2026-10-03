# cap-vs-volume: VERTICAL (9:16) animation spec (Type 1 ANIMATED, chart-builder, 2026-10-02)

Portrait twin of `assets/charts/cap-vs-volume-spec.md`. **Content is byte-identical to the 16:9 spec:** same copy, same
numbers ($4.2M, $90B+), same state ids, same cue times, same easing. Only the GEOMETRY changes; no new number is on
screen. Design source: `cap-vs-volume.html` in this folder. The PNGs (`cap-vs-volume-{start,mid,payoff}.png`,
1080x1920, device scale 1) are the SPEC; the vertical comp's `useCurrentFrame` component reproduces them. Labels are
fixed-position divs measured once; only opacity / transform / the growing height animate.

## Shared portrait frame (all golden-kitty vertical charts)
- Canvas 1080x1920, bg `#0a0c10`; orb 1 `left 560, top -280, 760x760`; orb 2 `left -340, top 1300, 700x700` (blur 120, opacity .26).
- Header `left 90, top 170, width 900`: eyebrow DM Sans 600 28px .18em; h1 Playfair 900 92px, line-height 1.04
  (wraps to 2 lines); divider 66x4 (green to cyan) 26px under the h1.
- Source line `left 90, right 90, bottom 210`, JetBrains Mono 400 22px, line-height 1.55 (wraps). The bottom ~210px stays clear for platform UI.

## Geometry
- The two horizontal race lanes become **two COLUMNS rising from one baseline (y 1290)**. Column tracks 300x760,
  top 530, radius 12, `#141823` + 1px border: GOLDEN at x 165, VOLUME at x 615.
- Fills grow UP from the bottom of the track. GOLDEN gold fill 0 to **6px** (a MINIMUM VISIBLE height, not to scale,
  same as 16:9). VOLUME lime fill (gradient 0deg, .35 alpha to solid lime, 34px glow) 0 to **760px** (the full column).
- Values under the baseline, centred in 450-wide cells (x 90 / x 540), top 1322, JetBrains Mono 600 112px.
- Labels under the values, top 1462, DM Sans 700 28px .12em uppercase, centred, 2 lines.

## Choreography (cues identical to 16:9)
| t (s) | word | what moves |
|---|---|---|
| 162.48 | enter | cross-fade + scale 0.96 to 1.0 (10f) on `start` |
| 162.48-163.40 | | GOLDEN value $0 to $4.2M (ease-out, 1 decimal, M suffix); gold fill 0 to 6px = `mid` |
| 165.12 | "90 billion" | volume $0 to $90B+ (integer B, '+' on the final frame) while the lime column RACES UP 0 to 760px (ease-in-out, 1.1s) = `payoff`; hold to 167.43 |

Portrait note: the race now reads as a 760px climb beside a 6px sliver, so the gap lands harder on a phone.
Numbers: DATA section 5 (4,234,949) and Pillar 4 (92.14B daily-chart sum). Never 98.97B or 99.02B.
