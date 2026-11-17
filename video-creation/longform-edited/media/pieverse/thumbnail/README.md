# pieverse thumbnail (2026-11-14)

The canton template (published reference: `refs/canton-ref.jpg`, youtu.be/hQN19dTqggU): Mike's REAL frame on the right,
no AI on his face, the brand mark and two lines of words on a dark page on the left. The canton project folder was
deleted after publish, so both scripts were rebuilt here from the template notes.

1. `python build/score_stills.py` : finds the full-camera stretches of the raw master (the screen-share layout has a
   black deck area), pulls frames at 3 fps, scores them with the MediaPipe face landmarker (blink, eye-look, jaw,
   smile, sharpness) and writes `stills-sheet-*.jpg` + `stills-picked.json`. `fine/` holds the 30 fps neighbours of
   the three finalists (`fine-scores.json`): the sharpest frame with the same expression is the one used.
2. `python build/compose_thumb.py <frame.png> <out.png> --line1 "..." --line2 "..."` : the frame is only scaled and
   placed (hair top 55 px from the top, hair 30 px from the right edge), pixel filters at the natural level, the room
   darkened by a vignette and faded into the page by a left ramp (never a matte). Left: the real Pieverse mark
   (`refs/pieverse-logo-coingecko.png`, untouched, on a white coin), the real daily price line
   (`research/coingecko-market-chart-daily-merged-2026-11-14.json`), Montserrat Black Italic words.

Takes (`takes/`, each a 1920x1080 PNG + a JPG under YouTube's 2 MB cap), sheet `takes/takes-sheet.jpg`:

| take | frame (raw seconds) | words |
|---|---|---|
| A | `fine/f1618.8-13.png` (about 1619.0 s, calm, straight to camera) | I DID THE / HOMEWORK |
| B | the same frame | 0.12 TO / 2.23 (all-time low to all-time high, CoinGecko) |
| C | `fine/f67.3-10.png` (about 67.4 s, a slight smile) | I DID THE / HOMEWORK |

**Mike rejected A, B and C ("i dont like the thumbnail", 2026-11-14)**; they are kept in `takes/old-real-frame/`. What he
asked for instead: his image from an earlier published thumbnail (only-18-months-left, youtu.be/Ccriu5vuxf8,
`refs/src-Ccriu5vuxf8.jpg`), "just change my clothing to something more normal", and bullish words, "STILL Insanely
Early".

| take | plate (Higgsfield `nano_banana_pro`, the old thumbnail as the only `--image`, 16:9, 2k) | words |
|---|---|---|
| D | `takes/gen/gen-1.png`: a plain black crew-neck t-shirt | STILL INSANELY / EARLY |
| **E (LOCKED)** | `takes/gen/gen-2.png`: a dark navy bomber jacket open over a charcoal grey t-shirt | STILL INSANELY / EARLY |

The edit prompt (in `takes/gen/gen-N.json`) keeps the man exactly and changes ONLY the clothing, and removes the old
text and badge. The face was checked side by side against the source (`takes/gen/_face-compare.jpg`, 27.5 to 27.9 dB,
zero shift). Composed with `python build/compose_thumb.py - takes/take-E.png --plate takes/gen/gen-2.png --line1 "STILL
INSANELY" --line2 "EARLY" --max-w 800`.

**The winner is `thumbnail/pieverse-thumb.png` (take E) + `pieverse-thumb-1920.jpg` for the YouTube upload.** It is the
ONLY `*thumb*.png` at this level (`stage_longform` stages the last one alphabetically). `stills/` is working data from
the rejected real-frame route and can be recycled.
