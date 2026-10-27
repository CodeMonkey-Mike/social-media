# c15-daily-transactions: VERTICAL (1080x1920) spec for the comp's useCurrentFrame component

Source of truth for the look: `c15-daily-transactions.html` (this folder) and its design states
`c15-daily-transactions-{start,mid,payoff}.png`. The 16:9 component is `ChartC15` in `remotion/src/Kcc20Charts.tsx`.
The vertical keeps its clock exactly and uses the SAME 50-day `SER` array (Kaspalytics Standard series, Sep 1 to
Oct 20 2026, pulled 2026-10-21, `[VERIFY]` on render day). Only the geometry changes.

## Re-layout: time stays on x, the plot goes TALL
| element | 16:9 | vertical |
|---|---|---|
| plot box | `X0 230, X1 1800, Y0 905, YT 300` | **`X0 150, X1 1000, Y0 1400, YT 440`**, `YMAX 270000` (960 px for 270K) |
| scale | `yy(v) = Y0 - (Y0-YT)*v/YMAX` | same formula, new constants |
| bar pitch / width | `dw = (X1-X0)/50`, `bw = round(dw*.66)` | `dw = 17`, `bw = 11`, `xc(i) = 150 + 17i + 8.5` |
| gridlines + y labels | 0..250K | same set, label box x 54 w 80 right-aligned, top `yy(v)-13` |
| x labels | SEP 1, SEP 15, OCT 1, OCT 12, OCT 20 | same, at `Y0 + 14` (= 1414), centred on `xc` |
| Sep average line | `(X0, yy(108952)-1, dw*30, 3)` | same rule: x 150, y 1012, full width 510 |
| Sep average label | centred on `xc(Sep 20)`, top `yy-74` | same rule: centred x 481, top 939 |
| W1 bracket (Oct 5 to 8, idx 34-37) | `yy(72000)-26` | same rule: x 727 y 1118, 70x18 |
| W2 bracket (Oct 12 to 15, idx 41-44) | `yy(95000)-26` | same rule: x 846 y 1036, 70x18 |
| **week callouts** | floated just above each bracket | the two labels are only ~120 px apart in portrait, so they STACK in the clear air above the October bars (nothing there tops 111K), each with a 2 px leader to its bracket: |
| W1 label `Oct 5 to 8 avg / 67,323` | `wl`, top `yy(72000)-120` | `wl`, centred on c1 = 762, top `l1 - 84` with `l1 = round(yy(160000)) = 831` (box 690,747 144x78) |
| W1 leader | none | `.lead` 2 px, x 761, from y 837 down to the bracket (h 277), `rgba(136,146,164,.55)` |
| W2 label `Oct 12 to 15 avg / 81,767` | `wl hot`, top `yy(95000)-200` | `wl hot`, x c2 = 881, `translateX(-62%)`, top `l2 - 98`, `l2 = l1 - 140 = 691` (box 774,593 173x88) |
| W2 leader | none | `.lead.hot` 2 px lit + glow, x 880, from y 697 to the bracket (h 335) |
| `+21.5%` chip | `c2 - 80`, top `yy(95000)-268` | x `c2 + 8`, `translateX(-62%)`, top `l2 - 158` (box 802,533 140x52) |
| header | one-line eyebrow | eyebrow broken after `standard (non-coinbase)`; h1 80 px |
| source line | one line y 1022 | x 80 y 1520, three lines: `Kaspalytics API, accepted transactions` / `Standard series only (coinbase excluded)` / `Sep 1 to Oct 20, 2026 · pulled 2026-10-21` |
| orbs | (1300,-320,760) · (-300,700,620) | (480,-320,760) .14 · (-320,1200,680) .10 |

## What animates when (unchanged from 16:9, source-spine seconds)
- Cover 225.48 to 233.28, hand:xfade-scale in. Bars DRAW left to right: `T0 225.7, SPAN 1.55, GROW 0.28`, bar i grows
  over `[T0 + SPAN*i/50, +GROW]`, height `max(2, round(full*g))` from the baseline.
- Sep average line draws left to right as September completes, `avg = ramp(t, 226.75, 227.05)` (width `510*avg`, label
  opacity `avg`). The **mid** design still = bars through Sep 30 + the average line.
- On '82' 227.42: `w2 = ramp(t, 227.42, 227.7)`. W2 bars turn `hot`, the W2 bracket, leader and **81,767** callout land
  (callout scale `.85 -> 1`). In portrait the leader draws DOWN from the callout to the bracket over the same ramp
  (height `335*w2`).
- On 'Up' 230.84: `w1 = ramp(t, 230.84, 231.1)`, prior-week bars `prev`, the W1 bracket, leader and **67,323** callout.
- On '22' 231.40: `up = ramp(t, 231.4, 231.62)`, the **+21.5%** chip pops (scale `.6 -> 1.12 -> 1`). Payoff design still =
  this end state.
