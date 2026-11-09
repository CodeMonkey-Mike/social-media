# quant: card-slide state cues

Times are on the FINAL spine (`spine/ALL.f.enhanced.mp4`, its medium-words JSON), before any card-pause shift. Each state is a hard swap: shared elements are pixel-identical inside one id, so a swap reads as the row landing. Rows at rest stay muted but readable (the spotlight adds emphasis, it does not toggle visibility). The last state of each id is the full card, held to the end of the row.

| File (assets/card-slides/) | From (s) | Cue word | Shows |
|---|---|---|---|
| K1 | 20.60 | beat start (FB2) | every row at rest |
| K1-s1 | 23.84 | "London" | London lit |
| K1-s2 | 25.56 | "2015" | + 2015 lit |
| K1-s3 | 27.48 | "Gilbert" | + Gilbert Verdian, Founder and CEO lit |
| K1-s4 | 30.22 | "not" | + Not a new blockchain lit, orange (held to 31.77) |
| C4 | 352.53 | beat start (FB6) | every figure at rest |
| C4-s1 | 355.14 | "$199" | price lit |
| C4-s2 | 357.74 | "$2.9 billion" | market cap lit |
| C4-s3 | 360.72 | "34" | rank lit (held to 361.10) |
| K2 | 394.90 | beat start | every row at rest |
| K2-s1 | 398.46 | "the (pros)" | share of the total crypto market lit |
| K2-s2 | 399.10 | no word cue, even spacing inside the plan's 398.46 to 400.26 | against the peers lit |
| K2-s3 | 399.82 | "ratios" | priced in Bitcoin lit (held to 400.40) |
| K3 | 544.17 | beat start | both actions at rest |
| K3-s1 | 546.98 | "like" | Like lit |
| K3-s2 | 547.80 | "subscribe" | Subscribe lit (held to 549.46) |
| K4 | 549.46 | beat start | the band at rest |
| K4-s1 | 561.60 | "click" | Link in the description lit (held to 563.33) |

Title slides T2 to T6 are one PNG each, 1.5 s pauses at the COVER-PLAN times.

## C4 count-up (optional, comp side)

The plan calls for a count-up on the three spoken figures. A PNG cannot count, so `C4-plate.png` is C4 with the three hero figures left out and `slide-sources/C4-count.json` gives each figure's box, final text, font, size, weight and letter spacing in frame pixels. The comp draws the counting numbers over the plate and swaps to C4-s1 / s2 / s3 as each lands. If the comp does not count up, use C4, C4-s1, C4-s2, C4-s3 and ignore the plate. The plate is never shown on its own: the rest of C4 still needs its figures readable.
