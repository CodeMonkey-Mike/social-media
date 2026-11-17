# C11-count VERTICAL · 129 to 211 robots (Type 1 ANIMATED) · 1080x1920 · CH3@168.90-173.95 (cover)

Portrait twin of `assets/charts/C11-count.html` (1920x1080). **Same build mode:** a `useCurrentFrame()` Remotion component (the 16:9 one is the `C11-count` template in `remotion/src/AIDestroyingLivesCharts.tsx`), never a PNG with a wipe: `lint_animated_charts.py` still applies. Same data, strings, colours, state ids, cue times and choreography; **only the geometry and type sizes change** (plus the layout moves in section 2). Source: `C11-count.html` (this folder; every state is one `.frame` from ONE function in `../_charts_portrait.py`, the stylesheet is the 16:9 one VERBATIM plus a layout-only portrait block). Machine-readable geometry: `C11-count-geometry.json` (the generator's constants + the measured box of every `data-g` element, per state). The PNGs are the design spec: the component lands pixel-for-pixel on each.

**Porting note for the comp:** the 16:9 template is this chart's HTML with `.aidl` scoping; the vertical template is the markup of `C11-count.html` the same way, with the portrait CSS block (bottom of its `<style>`) appended to the scoped sheet. Every moving value below is the 16:9's motion with the portrait number swapped in.

## 1. States (design stills, 1080x1920)

| PNG | Holds from | What is on screen |
|---|---|---|
| `C11-count-start.png` | 168.90 | '129 robots' + 129 grey squares; arrow, '211' and the caption held back |
| `C11-count-mid.png` | 170.28 | + the right-pointing arrow + 82 dashed cyan slots |
| `C11-count-payoff.png` | 171.08 | slots filled cyan with glow, '211 robots', caption 'mostly for cutting and welding steel' |

## 2. Portrait geometry (px on the 1080x1920 canvas)

| Element | 16:9 | **Portrait** |
|---|---|---|
| Header | eyebrow 1 line, h1 one line | eyebrow **2 lines**, h1 82 px **2 lines** 'The robot count' / 'is **climbing**' |
| Counters | 129 over 211 in a left column, DOWN arrow between | **129 -> 211 side by side in one row (y452)**, a RIGHT arrow (124x44 at x376 y500) between; 150 px numbers, 'robots' 32 px under each |
| Grid | 25 columns x 9 rows, square 31, pitch 43, origin x690 y350 | **16 columns x 14 rows, square 46 (rx 9), pitch 56, origin x97 y702** (886 x 774) |
| Grey / cyan split | rows 0-4 + 4 | **rows 0-7 + 1 grey (129), cyan from row 8 col 1 through row 13 col 2 (82)** |
| Slot | 28x28 inset 1.5 | **43x43 inset 1.5, rx 8**, dash 5 4, cyan .55 |
| Caption | 40 px? (38) right of grid x690 y763 | **40 px under the grid, x97 y1512** |
| Legend | right-aligned on the caption line | **under the caption, x97 y1584, 26 px** |
| Source | one line | **two lines** |

**Layout move (design call):** The waffle goes from a wide 25 x 9 block to a tall 16 x 14 block; the two counters move from a stacked column to a row above it (so the down arrow becomes a right arrow).

## 3. What animates when (cued to the words, IDENTICAL times to the 16:9)

| Spine s | Word | Animation (portrait px) |
|---|---|---|
| 168.90 | (cover in) | 129 grey squares pop in row by row over 14f (8 full rows + 1; lands by 169.34 '129'); '129' shown |
| 170.28 | these robots to | 82 dashed cyan slots outline in (10f) + the right arrow draws left to right |
| 171.08 | 211 | slots fill cyan in reading order over 24f; counter '211' (integers 129 to 211) lands ~171.88 |
| 172.02 | mostly | 'mostly for cutting and welding steel' fades in |
| 173.95 | (cover out) | next cover BR-14 |

**Guards held (unchanged wording):** no period on screen (DATA.md states none); no 'in a year'; arms and cobots, not humanoids. No em dashes on screen.

**Edge safety:** every text element sits at least 44 px inside the frame (gate in `../_shot_portrait.py`): the comp's 105% camera wobble crops 27 px a side and 48 px top and bottom. Main content stays above y ~1700; only the small source line sits lower (bottom 110). No visible text overlaps another (also gated).
