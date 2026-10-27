# c4-token-count: VERTICAL (1080x1920) spec for the comp's useCurrentFrame component

Source of truth for the look: `c4-token-count.html` (this folder) and its design states
`c4-token-count-{start,s1-mid,s1-payoff,s2-payoff}.png`. The 16:9 component is `ChartC4` in
`remotion/src/Kcc20Charts.tsx`. The vertical keeps its clock exactly (same `ts`, same easing, same source-spine
seconds) and only changes the geometry, as listed below. Numbers come only from DATA.md: KRC-20 2,164 (Kasplex
`tokenTotal`, 2026-10-18) and KCC-20 146 (KasStacker, third-party). Both are `[VERIFY]` on render day.

## Re-layout: horizontal bars become COLUMNS growing UP from one baseline
| element | 16:9 | vertical (px, frame 1080x1920) |
|---|---|---|
| header | x 120, top 66 | x 80, top 150, width 920; h1 80 px Playfair 900 (wraps if needed) |
| scale | `MAXW 900` horizontal | `MAXH = 800` vertical, same linear scale for both lanes |
| baseline / axis | vertical axis x 637 | horizontal axis x 110..970, y **1360**, 3 px, `.axis` |
| KRC-20 track | x 640 y 370 900x120 | x 150..450, y 560..1360 (300x800), `.track amber` |
| KRC-20 bar | width `wa = round(900*a)` | height `ha = round(800*a)`, box `(150, 1360-ha, 300, ha)`, gradient bottom-to-top (`linear-gradient(0deg, c .55, c)`) |
| KRC-20 value | right of the bar end | `fmt(2164*a)`, JetBrains Mono 800 76 px amber, centred on x 300 (box x 80 w 440), top `1360 - ha - 100` (rides the bar top) |
| KRC-20 lane label | x 120 y 372 | centred under the column: box x 80 w 440, top 1390 (`KRC-20` 58 px + `Kasplex · since 2024` 26 px) |
| KCC-20 track | x 640 y 600 | x 630..930, y 560..1360 |
| KCC-20 bar | `wb = round(900*146/2164*b)` | `hb = round(800*146/2164*b)` (= 54 px at b=1), box `(630, 1360-hb, 300, hb)` |
| KCC-20 value | right of the bar | `fmt(146*b)` teal, centred on x 780 (box x 560 w 440), top `1360 - hb - 100` |
| THIRD-PARTY COUNT chip | right of the value | centred on x 780 (`translateX(-50%)`), top `1360 - hb - 168` |
| KCC-20 lane label | x 120 y 602 | box x 560 w 440, top 1390; opacity `0.18 + 0.82*kccFade` (ghost until lit) |
| caption ("KCC-20 is very early ...") | x 640 y 770 | x 80 y 1530, width 920, DM Sans 27 px |
| source line | one line at y 1022 | x 80 y 1640, hand-broken: L1 `KRC-20: Kasplex indexer API (api.kasplex.org/v1/info, tokenTotal)` · (s2 only) L2 `KCC-20: KasStacker (kasstacker.org), third-party count` · last line `read 2026-10-18` |
| orbs | (1400,-260,640) amber · (-260,640,640) lit | (-280,380,680) amber .10 · (540,1100,700) lit .14 |

## What animates when (unchanged from 16:9, source-spine seconds)
- **s1** (cover 125.46 to 129.74, hand:xfade-scale in): `a = ramp(t, 125.46, 127.02, inOut(cubic))`. The amber column grows
  UP and the value counts with it (passes ~1,082 at the mid design state, around '2,160' at 125.82) and lands on
  **2,164** on 'tokens' 127.02. KCC-20 stays a ghost (empty track, lane label at .18).
- **s2** (cover 164.44 to 169.54, MELT `melt-equidistant-short-2` IN): KRC-20 full from frame 1. KCC-20 lane lights on
  'KCC-20', `kccFade = ramp(t, 165.05, 165.35)`. The teal column grows `b = ramp(t, 167.58, 169.0, inOut(cubic))` from
  'Roughly' and lands **146** by 'tokens' 169.00 (the count is still rising on '150' 168.30; the VO and captions never say
  146). Chip and caption fade in, `noteOp = ramp(t, 167.9, 168.3)`.
- **MELT input:** the 16:9 fx uses `charts/c4-token-count-s1-payoff.png` as the `toSrc` still. The vertical comp must
  point at the PORTRAIT twin, `charts/c4-token-count-s1-payoff.png` in the vertical public dir (same name), never the
  16:9 PNG.
