# C8-shift VERTICAL · total freelance demand went up (Type 1 ANIMATED) · 1080x1920 · CH2@132.40-139.56 (cover)

Portrait twin of `assets/charts/C8-shift.html` (1920x1080). **Same build mode:** a `useCurrentFrame()` Remotion component (the 16:9 one is the `C8-shift` template in `remotion/src/AIDestroyingLivesCharts.tsx`), never a PNG with a wipe: `lint_animated_charts.py` still applies. Same data, strings, colours, state ids, cue times and choreography; **only the geometry and type sizes change** (plus the layout moves in section 2). Source: `C8-shift.html` (this folder; every state is one `.frame` from ONE function in `../_charts_portrait.py`, the stylesheet is the 16:9 one VERBATIM plus a layout-only portrait block). Machine-readable geometry: `C8-shift-geometry.json` (the generator's constants + the measured box of every `data-g` element, per state). The PNGs are the design spec: the component lands pixel-for-pixel on each.

**Porting note for the comp:** the 16:9 template is this chart's HTML with `.aidl` scoping; the vertical template is the markup of `C8-shift.html` the same way, with the portrait CSS block (bottom of its `<style>`) appended to the scoped sheet. Every moving value below is the 16:9's motion with the portrait number swapped in.

## 1. States (design stills, 1080x1920)

| PNG | Holds from | What is on screen |
|---|---|---|
| `C8-shift-start.png` | 132.40 | FELL group (three red bars at their C8 values, 55% opacity) + empty GREW side |
| `C8-shift-mid.png` | 133.98 | + TOTAL FREELANCE DEMAND badge with ▲ UP, green glow |
| `C8-shift-payoff.png` | 137.54 | + machine-learning bar up 216 px, '+24%'; badge glow eased off |

## 2. Portrait geometry (px on the 1080x1920 canvas)

| Element | 16:9 | **Portrait** |
|---|---|---|
| Header | h1 one line | h1 82 px **2 lines** 'Total freelance' / 'demand went **up**' |
| Split | FELL left of a vertical dashed rule x850, GREW right | **same split, narrower: rule x588 (y430-1590); FELL x72-572, GREW x628-1008** |
| Zero line | y572, x160-1780, shared | **y1040, x72-1008, still ONE shared line** (one scale for fell and grew) |
| Scale | 6.4 px / point | **9 px / point**: FELL 270 / 180 / 450, ML +216 |
| FELL bars | centres 300/500/700 w150 | **centres 150 / 322 / 494, w120**; labels 26 px 2 lines above the line, values 44 px under each bar |
| Badge | x900 y372 400x168 | **x628 y500 380x190**; cat 19 px, ▲ 62x54, UP 84 px |
| ML bar | x1410 w220 up 153.6 | **x708 w220 up 216 (top 824)**; '+24%' 80 px at top 724; label 30 px under the line (y1062) |
| Source | one line | **three lines** |

**Layout move (design call):** The fell/grew split keeps its left/right logic and its single shared zero line; the line drops to y1040 so the GREW side stacks badge over bar in the tall right column, and the FELL bars hang below the line on the left.

## 3. What animates when (cued to the words, IDENTICAL times to the 16:9)

| Spine s | Word | Animation (portrait px) |
|---|---|---|
| 132.40 | (cover in) | state start: FELL group (three red bars at their C8 values, 55% opacity) + empty GREW side |
| 133.98 | Total | the TOTAL FREELANCE DEMAND badge fades + rises 16px (12f) |
| 135.72 | up | triangle + 'UP' pop (scale .8 to 1, 10f), badge gets the green glow |
| 137.54 | It just moves away | machine-learning bar rises 0 to 216 px over 20f; '+24%' rides 20 px above the bar top and counts 0 to 24 landing ~138.2; label brightens; badge glow eases off; FELL bars stay down |
| 139.56 | (cover out) | FACE-3 |

**Guards held (unchanged wording):** total demand is a direction badge, never a bar: DATA.md has no figure for it. No em dashes on screen.

**Edge safety:** every text element sits at least 44 px inside the frame (gate in `../_shot_portrait.py`): the comp's 105% camera wobble crops 27 px a side and 48 px top and bottom. Main content stays above y ~1700; only the small source line sits lower (bottom 110). No visible text overlaps another (also gated).
