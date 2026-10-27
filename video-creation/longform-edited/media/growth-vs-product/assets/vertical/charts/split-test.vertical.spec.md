# split-test: VERTICAL (1080x1920) spec for the comp's useCurrentFrame component

Source of truth for the look: `split-test.html` (this folder, generator `../diagrams/_build_vertical.py`) and its design
states `split-test-start.png`, `split-test-mid.png`, `split-test-payoff.png`. The 16:9 component is `SplitTestChart` in
`remotion/src/GrowthVsProductCharts.tsx` (16:9 spec: `assets/charts/split-test.spec.md`). The vertical keeps the 16:9
clock exactly (same `ST` cue table, same source-spine seconds, same easings and frame counts). It changes only the geometry
below. Build it as a sibling portrait component (e.g. `SplitTestChartV`) on a `1080x1920` `.gvp.frame`. Do not scale or
letterbox the 16:9 one.

- **Beat:** CH2@72.00-77.52, chapter accent cyan `#00c2ff` (CH2); role label GROWTH (gold `#ffd700`) + ENGINEER (white).
- **Data:** illustrative, NO figure printed anywhere (charts.md section 2). Bar lengths are geometry only. Footer wording is unchanged from the 16:9 (DATA.md Pillar 2), hand-broken onto two lines.

## Re-layout: the two side-by-side cards STACK; each bar stays directly under its own card
| element | 16:9 (1920x1080) | vertical (px, frame 1080x1920) |
|---|---|---|
| frame padding | `96px 140px 0` | `130px 80px 0` (content width 920) |
| eyebrow `DIFFERENCE 1 · THE SCOREBOARD` | x140 y96 | x80 y130, 27 px (unchanged token) |
| headline | Playfair 900 68 px, one line | Playfair 900 **78 px**, two lines, hand-broken: `Ship the AI page<br>as a <ck>split test</ck>.`; box x80 y187 920x167 |
| divider + role label | divider under h1; role label absolute top-right (right 140, top 92) | ONE row (`.drow`, flex, space-between, margin-top 30, h40) at x80 y384 w920: divider (66x4) left, role label right-aligned (34 px italic, box x663 y387) |
| card A (Standard page) | x140 y318 780x430 | **x80 y490 920x400**, radius 18, padding 26/28 |
| card B (AI-personalized page) | x1000 y318 780x430 | **x80 y1020 920x400** |
| card header row | h46; letter tile 46x46 (26 px mono); name 23 px | h50; letter tile **50x50** (28 px mono); name **25 px**; stamp pill 21 px |
| browser wireframe `.br` | h310, margin-top 22 | **h278**, margin-top 20 (box x109 y587 / y1117, 862x278) |
| hero block | left/right 24, top 58, h132 | left/right 24, top 58, **h124** (box x134 y646 / y1176, 812x124) |
| hero inner bars (AI) | circle 58 at (22,26); bars 300x22, 220x16; CTA 150x20 | circle **60** at (24,24); bars **380x22** at (106,28), **280x16** at (106,64); CTA **170x18** at (24,94); spark right 24 top 18 |
| hero inner bars (standard) | 360x22, 260x16, CTA 150x20 | **440x22** at (24,26), **320x16** at (24,62), CTA **170x18** at (24,94) |
| tile row | 3 tiles 206x80 at left 24 + i*228, top 210 | 3 tiles **258x62** at left **24 + i*280**, top **198** |
| bar track A | x140 y774 780x26, radius 13 | **x80 y912 920x30**, radius 15 (card top + 422) |
| bar track B | x1000 y774 | **x80 y1442 920x30** (card top + 422) |
| fill width | `pct%` of the 780 track | `pct%` of the **920** track (same pct values: start 0/0, mid 30/46, payoff 34/82) |
| label `THE NUMBER` | y808, 19 px | card top + 464 (**y954 / y1484**), **22 px** |
| takeaway bar | x140..x1780 y864 h100; KILL IT / OR / SCALE IT 48 / 34 / 48 px | **x80..x1000 y1560 h120**; **54 / 38 / 54 px** |
| source line | one line, x140 bottom 38, 17 px | x80, w920, **bottom 160** (box y1706, 2 lines), **18 px**, line-height 1.5, hand-broken after "no real figures." |
| orbs | 760 cyan right -300 top -360; 520 navy left -260 bottom -320 | 760 cyan **right -340 top -320**; **620** navy **left -300 bottom -300** (opacity .35) |

## What animates, cued to the words (unchanged from 16:9; useCurrentFrame, 30 fps, frame 0 = 72.00)
| t (spine) | word | what moves (vertical geometry) |
|---|---|---|
| 72.00 | "landing page" | container in (cross-fade + scale 0.97 to 1 over 12 f); both bars empty = `start` |
| 74.34 to 75.14 | "The number moves" | BOTH bars grow from 0, ease-out (cubic) over 24 f: A to 30%, B to 46% of the 920 track = `mid` |
| 75.14 to 76.22 | "or it doesn't" | A creeps 30% to 34% and stalls; B keeps growing 46% to 82% (ease-out, 30 f) |
| 76.22 | "kill it" | takeaway bar (x80..x1000, y1560, h120) fades up + rises 16 px over 8 f |
| 77.04 | "scale it" | WINNER lights over 8 f: card B border 1 to 2 px cyan (padding drops 1 px so nothing inside moves) + outer glow `0 0 70px rgba(0,194,255,.28)`, the B tile fills cyan, B bar turns full cyan with glow, SCALE IT pill pops (scale 0.8 to 1, 6 f). LOSER dims: A wireframe, tile and name to .38, A bar to `#3a4356`, KILL IT pill pops = `payoff` |
| 77.04 to 77.52 | | hold payoff, then cross-fade to `pass-rate-meter` |

Reading order on a phone is top to bottom: card A, A's bar, card B, B's bar, takeaway. The race between the two bars is
read across a 530 px vertical gap, so both bars start at the same x (80) and share one 920 px scale: a viewer compares the
two fill ends directly.

**Hand-off to `pass-rate-meter`:** both portrait charts use the same 2-line header block (eyebrow y130, headline y187
h167, divider/role row y384), so the 77.52 cross-fade still reads as one container changing its words.
