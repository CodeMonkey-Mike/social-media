# c17-supply-ring: VERTICAL (1080x1920) spec for the comp's useCurrentFrame component

Source of truth for the look: `c17-supply-ring.html` (this folder) and its design states
`c17-supply-ring-{start,mid,payoff}.png`. The 16:9 component is `ChartC17` in `remotion/src/Kcc20Charts.tsx`. The
vertical keeps its clock exactly. The numbers come only from DATA.md (api.kaspa.org/info/coinsupply, 2026-10-18): circulating
27,763,090,854.57, max 28,704,035,605, mined 96.72%. All three are `[VERIFY]` on render day.

## Re-layout: the ring is centred on top and the KAS figure stacks under it
| element | 16:9 | vertical |
|---|---|---|
| ring | `cx 600, cy 640, r 270, sw 46` | **`cx 540, cy 860, r 300, sw 50`**, `C = 2*pi*300`, box `(cx-350, cy-350, 700, 700)`, same two stroked circles + glow filter, start at 12 o'clock (`rotate(-90)`) |
| centre % | `.big` 112 px, box `(cx-260, cy-78, 520)` | `.big` **118 px**, box `(260, 778, 560)`, centred |
| `MINED` | `(cx-260, cy+52, 520)` | box `(260, 916, 560)` |
| KAS figure | x 1060 y 440, left-aligned | `27.76B` (`.kas` 96 px) + `of 28.70B KAS max supply` (34 px), centred, box x 80 w 920, top **1250** |
| chips | x 1060 y 680 | `PROOF OF WORK · NO PREMINE · FAIR LAUNCH`, centred row, box x 80 w 920, top **1440** |
| quote | x 1060 y 780 | centred, box x 80 w 920, top 1522 |
| source line | one line y 1022 | x 80 y 1600: `api.kaspa.org/info/coinsupply: circulating 27,763,090,854.57` / `of max 28,704,035,605 KAS · read 2026-10-18` |
| orbs | (260,260,760) lit `.16+.08a` · (1500,-300,560) | (160,480,760) lit `.16+.08a` · (620,-320,560) .10 |

## What animates when (unchanged from 16:9, source-spine seconds)
- Cover 236.78 to 241.06, hand:xfade-scale in on 'Around'. `a = ramp(t, 236.9, 240.16, inOut(cubic))`. The ring arc =
  `C * 0.9672 * a`, the centre counts `(96.72*a).toFixed(2)%` (counting up from '96' 237.06), the KAS figure counts
  `(27763090854.57*a/1e9).toFixed(2)B`, the left orb brightens `.16 -> .24`. It lands **96.72% / 27.76B** on 'mined.'
  240.16. The chips are on screen from frame 1.
- **BRAAM push (the cover's `bz` move, not the chart):** 16:9 `bzx 600, bzy 622, bzs 2.4`. Vertical: **`bzx 540, bzy 837,
  bzs 2.4`** (the centre of the `96.72%` figure) and the translate recentres on the PORTRAIT frame centre
  `(540 - bzx)*p, (960 - bzy)*p`, never 960/540. Check: the figure is ~425 px wide, so at 2.4x it is ~1020 px and still
  fits inside 1080 px.
