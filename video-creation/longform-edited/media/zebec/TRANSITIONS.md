# zebec — TRANSITIONS plan

_Three-bucket policy (canonical: ../../assets/transitions/README.md + longform-edited.md #5). Library ids:
assets/transitions/library.json. Prefixes: `rmn:` out-of-box @remotion/transitions · `lib:` OUR library
engine · `hand:` hand-rolled overlay code._

## 1. Chapter / title cards → ONE pick
`hand:` fade-rise title card (Playfair headline + muted eyebrow + green→cyan divider), 40f, at each chapter
boundary CH2/CH3/CH4/CH5. (Draft: overlay, no baked audio pause — HQ bakes the 1s pause per comp-build §2.)

## 2. Glitchy-fast hits → AI / ChatGPT stills
`hand:` bad-signal GLITCH on ingress (~10f: RGB-split + slice jump), self-contained (no external assets), on
every ChatGPT still (CG1-CG5). Settles to the clean image.

## 3. Face + b-roll + containers → hand-rolled overlays on the spine
- FACE cut in/out → `hand:` film burn (±0.38s) at 45.3 + 52.86; ~15% punch-in mid-face (47.6-52.4).
- Envato VIDEO b-roll → `hand:` fade (opacity ~0.3s).
- Container / chart swap → `hand:` cross-fade + 0.94→1 scale-in.

## 4. LIBRARY transitions (Swiftly→Remotion) — 10 placed here-and-there (Mike, 2026-07-12)
`lib:` from assets/transitions/library.json, applied at image→image cover boundaries (engine swaps from→to
under peak motion blur). Weighted per Mike: OFFSET (most) + a few DEVIATION + a few EXPAND.
| # | boundary @t | id | family |
|--|--|--|--|
| 1 | 32.02 | offset-simple-left | OFFSET |
| 2 | 37.22 | offset-simple-up | OFFSET |
| 3 | 97.26 | offset-simple-right | OFFSET |
| 4 | 140.66 | deviation-optics-2x | DEVIATION |
| 5 | 232.44 | expand-pan-up | EXPAND |
| 6 | 262.32 | offset-simple-left-up | OFFSET |
| 7 | 299.70 | offset-simple-down | OFFSET |
| 8 | 310.06 | offset-long-simple-right | OFFSET |
| 9 | 376.00 | deviation-shift-4x | DEVIATION |
| 10 | 436.26 | expand-pan-left | EXPAND |

6 OFFSET + 2 DEVIATION + 2 EXPAND. Wired in Zebec.tsx `TRANS[]`; SFX disabled for the draft. First look —
adjust the picks/placements per Mike's review.
