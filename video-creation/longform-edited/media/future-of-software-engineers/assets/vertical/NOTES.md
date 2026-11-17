# Notes for the vertical lane (read by the comp-builder; Mike 2026-11-14)

1. **Charts (C3, C4 in the 16:9 comp) are live SVG-text components. Do NOT put a `transform: scale()` on the wrapper that fades
   them in.** In the 16:9 final that scale-in (0.97 -> 1) made each Remotion render session lock the chart's SVG text at the wrong
   layout: the axis numbers sat 2 to 15 px off their gridlines and bounced between four states (Mike saw it at 0:36 and had it
   re-rendered and spliced). The vertical chart entry must be an OPACITY-ONLY fade (the 16:9 comp now does this for C3:
   `Placement`, `s0 = 1`). Apply it to BOTH vertical charts.
2. After the vertical render, verify the charts the way the 16:9 was verified: pull 16 consecutive frames at 4 to 5 times inside
   each chart's cover and confirm a given axis label's ink position is IDENTICAL on every frame (a one-pixel spread is fine, 5 px
   is the bug). If a window is dirty, re-render only that window and splice it (never a full re-render).
3. No title cards, no clip inserts, no captions, no Envato / ChatGPT images, no whiteboards, no kinetic text, no SFX (the 16:9
   rulings carry over). Nine FACE windows (F1 to F9; FACE 4's picture is blacked out and covered by deck card D18).
