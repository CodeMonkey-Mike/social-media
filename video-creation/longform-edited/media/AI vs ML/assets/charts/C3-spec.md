# C3 · money ladder (Type 1 ANIMATED, code, animate for REAL) · CH3@101.7-117.18

**Build mode:** a `useCurrentFrame()` Remotion component, never a PNG (charts.md section 3: three bars is a sparse
chart, so bars GROW and values COUNT UP for real; `lint_animated_charts.py` fails a static PNG here). The PNGs are
the design spec: the component must land pixel-for-pixel on each one. Geometry, colours, fonts and strings:
`C3-geometry.json` (exported from `C3.html`'s own config). Spine 30 fps. Theme DARK, locked stylesheet,
chapter accent = stylesheet default; role colours AI = gold `#ffd700`, ML = green `#00e68a`.

**Numbers (DATA.md section 2 Pillar 2 + section 5, Levels.fyi US total comp, read 2026-11-09), all in ONE config:**
AI ENGINEER MEDIAN **$155.5K** (330 data points) · ML ENGINEER MEDIAN **$287.5K** · ML ENGINEER TOP 10% **$495K**
(1,012 data points) · gap **$339.5K** = 495,000 - 155,500. **[VERIFY] at render:** re-pull both Levels.fyi US pages;
if a figure moved, change BARS/GAP in that config and re-shoot (heights follow `y = 712 - 0.84 x valueK`). If a page
has drifted beyond a re-shoot, the bench is C4 (Anthropic posted midpoints, 340,000).

## States (design stills)

| PNG | Holds from | What is on screen |
|---|---|---|
| `C3-s0-start.png` | 101.70 | chrome only: eyebrow, headline, $0 to $500K gridlines, axis, the fixed source line |
| `C3-s1-ai-median.png` | 103.24 | bar 1 AI ENGINEER / MEDIAN, gold, $155.5K |
| `C3-s2-ml-median.png` | 106.74 | + bar 2 ML ENGINEER / MEDIAN, green DIM (outline + 16% fill, labels at 62%) |
| `C3-s3-ml-top10.png` | 109.22 | + bar 3 ML ENGINEER / TOP 10%, green, glow, $495K |
| `C3-s4-gap.png` | 112.93 | + gold dashed AI-median line, bar 3 below it shaded (the bright part above it IS the gap), bracket gold -> green, THE GAP $339.5K / TOP 10% ML ENGINEER VS AI ENGINEER MEDIAN |
| `C3-s5-payoff.png` | 116.06 | header + plot + labels step back to 28% (a `#0a0c10` scrim at 72%, right edge feathered x 1296 -> 1345); bracket, gap label and source line stay at 100% |
| `C3-preview-payoff-with-word.png` | REVIEW ONLY | s5 + a mock of the comp's KtWordByWord payoff word. Not an asset: the comp's engine draws TRAIN |

## What animates when (cued to the words)

| Spine s | Word | Animation | Sound |
|---|---|---|---|
| 101.70 | "makes" | `kt-spin-cut` in onto s0 | `whoosh-4` (plan) |
| 102.38 -> 103.24 | "$155" | bar 1 grows from the axis, easeOutCubic, 26 f. Value label rides 22 px above the bar top and counts $0.0K -> $155.5K tied to the height. Labels under the bar fade up (opacity 0 -> 1, y +12 -> 0) over 8 f from 102.38 | (none in plan) |
| 105.94 -> 106.74 | "ML engineers" | bar 2 grows, easeOutCubic, 24 f, counts to $287.5K; labels fade up | none (unspoken) |
| 108.12 -> 109.22 | "$495" | bar 3 grows, easeOutCubic, 33 f, counts $0K -> $495K; on landing its glow pulses 0.30 -> 0.55 -> 0.30 over 12 f | `cash-register-2` ON 108.12 |
| 110.80 | "My God, dude" | reaction shake on the whole chart layer, ~0.35 s, decaying (comp-level) | (plan) |
| 112.48 -> 112.93 | "$340,000" | AI-median dashed line draws left -> right (9 f) and the bar-3 lower shade fades in (8 f); the bracket draws bottom tick -> up -> top tick (14 f); THE GAP label fades in and its number counts $0.0K -> $339.5K in step with the bracket length | `cash-register` so the bell lands at 112.48 (file start 0.17 s early, kt-keyword-pop row) |
| 114.54 | "And it goes to" | comp `KtWordByWord` phrases at y 918 (the chart keeps y 856-984 empty the whole hold): "AND IT GOES TO" 114.54 · "THE PEOPLE WHO" 115.30 | silent (engine row) |
| 116.06 -> 117.18 | "train" | s5 dim in over 5 f; KtWordByWord payoff **TRAIN** at x 960 y 540, **`payoffColor: '#00e68a'`** (the chart's ML green, not the 2023 `#20F91A`), jiggle, held to the 117.18 cut | `cash-register-2` ON 116.06 |

**Count-up rules:** one decimal while counting ($212.3K) for bars 1 and 2 and the gap; integers for bar 3 ($318K);
the final frame shows the exact DATA string. No overshoot or bounce on a bar or a number: the height IS the value.
Every text is SVG `<text>` at fixed coordinates (no per-frame re-measuring = no jitter).

**Choreography call to flag (plan said 104.1-105.9 for bar 2):** I moved bar 2 to land on "ML engineers"
(105.94). Growing a bar labelled ML ENGINEER MEDIAN while the VO says "the top 10 percent" mislabels what the
viewer hears; on "ML engineers" it matches. Still unspoken, still before bar 3. Revert = shift row 3 to 104.10.

**Guards held:** prints 155.5K not 155,000 and 339.5K, never 350K; never TYPICAL ENGINEER alone; the bracket is
labelled TOP 10% vs MEDIAN, never median vs median (W1, W2); the junior-skew caveat rides in the source line for
the whole hold (DATA T6).
