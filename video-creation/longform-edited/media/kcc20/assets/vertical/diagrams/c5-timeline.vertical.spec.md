# c5-timeline + c5-final-square (the C5 board): VERTICAL (1080x1920) geometry for `ChartC5`

The 16:9 comp animates the C5 board IN CODE (`ChartC5` in `remotion/src/Kcc20Charts.tsx`, modes `p1 / p2 / final`), so
the vertical comp needs the portrait board as well as the stills. The look is defined by `c5-timeline.html` /
`c5-final-square.html` (this folder) and the PNG states `c5-timeline-01..07` and `c5-final-square-01..04`. The
`BOARD_PLAN` hop times, `C5_CHIP_T`, `C5_STAMP_T`, the KCC-1 / KCC-2 word timing, `landPop`, `labelOp`, `popMotion` and
`squash` all stay exactly as they are in 16:9. Only the geometry below changes.

## Board: the 16:9 serpentine becomes a U
The path runs DOWN the left column (JUN 30, JUL 15, AUG 20, SEP 21), makes a U-turn under the board, and climbs UP the
right column (SEP 22, OCT 1, OCT 7, FINAL at the top right).
| | 16:9 | vertical |
|---|---|---|
| square size | `SQ 170` (SEP 21 120) | **`SQ 160`** (SEP 21 stays 120) |
| `BOARD[i]` x,y | rows y 430 / 790 | 0 JUN30 (405,590) · 1 JUL15 (405,850) · 2 AUG20 (405,1110) · 3 SEP21 small (405,1370) · 4 SEP22 (675,1370) · 5 OCT1 (675,1110) · 6 OCT7 gold (675,850) · 7 FINAL (675,590) |
| pips | horizontal between same-ROW squares | vertical between same-COLUMN squares (`a.x === b.x`): 3 pips from `a.y ± (half(a)+18)` to `b.y ∓ (half(b)+18)`, where `half = small ? 60 : 80` |
| U-turn pips | right-hand arc `1560 + cos*230, 610 + sin*180` | under the board: `th = pi - pi*j/6`, j=1..5, at `(540 + cos(th)*135, 1400 + sin(th)*150)`; on when SEP 22 has landed (or final) |
| event labels | centred under the square, w 380 | on the OUTER side, vertically centred on the square (`translateY(-50%)`), w 232: left column right-aligned with right edge `x - half - 22`; right column left-aligned from `x + half + 22`. The draft chips (`chipd` 20 px) wrap to two rows inside the label, aligned to the same side. |
| `pieceAt(i)` | `(x+94, y-114)`, piece 112 | top INNER corner: **`(x + (x<540 ? 70 : -70), y - 95)`**, piece **100** |
| hop path | `a->b` eased + lift `-sin(pi*u)*85` (`70` to FINAL) | across columns (SEP 21 to SEP 22): the same lift. Within a column (every other hop): no lift, the piece BOWS INWARD instead, `x - 40*sin(pi*u)` on the right column / `+40` on the left, with y eased. The `02-hop` still is u=.5 of OCT 7 -> FINAL: apex (565, 631). |
| FINAL landed | halo `(x-200, y-190, 400)`, label + chips below | halo `(x-200, y-200, 400, 400)`, `go Final` + the three chips on the outer (right) side |
| stamp | `cx 1150, cy 612, w 900, h 360`, push origin `1150px 612px` | **`cx 540, cy 1010, w 900, h 380`**, push origin `540px 1010px`, glow `(cx-540, cy-390, 1080, 780)`; `.sb` 90 px |
| sparks | (975,372,60) (1712,562,40) (1392,856,56) (618,690,34) | (190,770,60) (975,880,40) (880,1260,56) (130,1150,34), same delays |
| header | one line | h1 broken `Square by square, / toward Final`; x 80 y 150 |
| source line | one line | x 80 y 1640, broken after `#33`, and on `final` a third line `PRs #39, #40, #41 merged 2026-10-21` |
| orbs | (1450,-280,640) · (-280,640,620) | (560,-300,640) .12 · (-320,1180,620) .08 |

`c5-timeline-07-oct7.png` and `c5-final-square-01-oct7.png` match pixel for pixel above the source line, just as they do in 16:9.
