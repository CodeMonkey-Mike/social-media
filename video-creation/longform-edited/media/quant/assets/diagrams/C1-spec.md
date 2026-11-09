# C1: THE system-design diagram (Type 2, static states, movement = state swaps only)

Source: `C1.html`, one `<div class="frame" id="C1-<state>">` per state. Every state is 1920x1080 and shares one layout: nothing moves between states, only ink and lit colour change, so a swap reads as a spotlight and never as a redraw. Comp: a 6-frame cross-fade between states, no slide or scale.

Header anatomy, identical in every state: eyebrow -> headline -> divider (66 x 4 px at x 96, y 200, the same rule as this video's cards) -> the diagram, whose block starts at y 236. The three labels in `C1-right-labels.png` end at y 1026, inside the frame.

Declare it in the comp: `// DIAGRAM_REFS: C1-*`. Three spots on purpose (FB3 whole, the spotlights, the right column), cleared by the cover-plan note on the CONTAINER SCATTER warn. Face beats follow comp-build section 4c: the stage scales by 1464/1920 into the deck area, no native deck canvas.

| tIn (s) | State PNG | Spoken cue | Where |
|---|---|---|---|
| 177.60 | `C1-whole.png` | "Now here's the thing with the real names." The window opens on it, fade + scale-in over the first 12 frames | FB3, deck area |
| 179.767 | `C1-whole.png` | the cut to full frame at the window end | full frame |
| 180.16 | `C1-left-column.png` | "left," | full frame |
| 182.02 | `C1-left-core.png` | "core banking" | full frame |
| 182.92 | `C1-left-treasury.png` | "treasury" | full frame |
| 183.66 | `C1-left.png` | "payment rails" | full frame |
| 184.62 | `C1-quant.png` | "In the middle, Quant." (the word "Quant" lands at 185.48) | full frame |
| 186.06 | `C1-overledger.png` | "Overledger" | full frame |
| 188.04 | `C1-flow.png` | "Quant Flow" | full frame |
| 191.72 | `C1-payscript.png` | "PayScript" | full frame |
| 192.38 | `C1-quantnet.png` | "QuantNet" | full frame |
| 195.62 | `C1-fusion.png` | "Quant Fusion", holds to 197.56, where C22 takes over | full frame |
| 203.78 | `C1-right.png` | "And on the right" | full frame |
| 205.24 | `C1-right-labels.png` | "and the tokenized deposit platforms", holds to 207.267 | full frame |

## Cue that differs from the cover plan
COVER-PLAN lands the three labels after "platforms" at 207.16, and the row ends at 207.267. That leaves them on screen for about 0.1 s, too short to read. This spec lands them at 205.24, which gives about 2 s. If Mike wants them strictly last, drop the labels rather than flash them.

## Traceability (no numbers on this diagram)
Every label comes from DATA.md Pillars 1 and 2 and the CHART-SOURCE INDEX C1 row. "the API connector", "the orchestration layer" and "the rollup" are the spoken descriptions, and "where the bank writes the rules" is the spoken Quant Flow line. Rails are TYPES only (RTGS, Faster Payments, RTP, CHIPS), never the QuantNet post's venue list. "never holds funds" shortens QuantNet's "without ever holding funds". "No new network to join" is Quant Flow's own wording, and "lock, credit, settle" is the cross-border piece's.
