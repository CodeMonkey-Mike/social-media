# BROLL-PLAN — batch `tutorial` / clip #1 `tut-94x-euphoria` (variant: full)

**Title:** 94X on $TUT, and It's Pumping Again
**Spine:** `video-creation/shorts/tutorial/render-assets/tut-94x-euphoria.mp4` (78.83 s, 1080x1920 @25 fps, GOP re-encoded)
**Measured geometry:** screen-share/webcam seam = **row 853** (row-gradient scan, 10 frames at
t=1/8/15/22/30/40/50/60/70/78 s, ALL ten return 854 with delta 64-218). Caption band centre `capY 900`.

---

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

Recorded in `shorts/tutorial/tighten-plan.json -> mike_4b.build_directives`. So:

- **ALLOWED:** captions, SFX, code-drawn graphics, and **transparent-background overlay images**.
- **BANNED:** `mode: 'full'` and `mode: 'content'` b-roll. The `BROLL_*` array in the constants file
  is **empty on purpose**; every generated asset is composited through the `overlays` array as an
  alpha PNG sticker. **The test is COVERAGE, not the asset source.**
- Consequence for the finalized-short contract's **coverage budget (item #4, ~30 % zone/full
  b-roll)**: this clip ships **0 % zone/full coverage, 100 % base showing**, by Mike's own written
  instruction. That is a DEVIATION from the checklist item and is reported as such in the build
  report; it is not a silent omission and it is not the builder's choice.

### Why the ban is right on THIS clip (measured, not asserted)
The content zone is a live CoinMarketCap **Tutorial ($TUT)** page and it IS the receipt the whole
short is about: `$66.8M market cap`, `+642.1% (1M)`, `+108.38%`, the `0.080` price tag, the green
1M pump curve, and (from 55 s) the **All / Mkt Cap** view showing the `66.48M` all-time spike off a
flat 2025 base. Mike also points at it with his hand (measured at 60 s). Covering any of it would
delete the evidence for every number he says.

---

## ⛔ HARD GUARD — the Schwarzenegger drop, 66.30-71.40 s (clip time)

Master 353.36-358.62 = "And that's why CodeMonkey Mike has the greatest crypto community on the
planet" is a **soundboard drop, not Mike speaking**, and the tighten pass relocked the segment
out-point to 358.62 to rescue 0.31 s of it.

**MEASURED on the spine:** it is not audio-only. The base video cuts to a **full-frame Arnold
Schwarzenegger clip**. Green-screen fraction in the face zone (rows 1000-1800) at 10 fps across
64.5-73.5 s: `0.159 -> 0.000 at 66.30 -> 0.135 at 71.40`. So the frame is Arnold, edge to edge,
**66.30 to 71.40**.

**Nothing may cover 66.00-71.70 s:** no overlay image, no badge, no logo plate, and **no SFX cue**
(a sting on top of the drop is covering it in the audio domain). Captions only. Enforced in code by
`assertNoGraphicsOverArnold()` in `constants-tut-94x-euphoria.ts`, which throws at bundle time.

---

## Base-video occupancy map (measured, drives every placement)

Content-zone thumbnails at 2 fps, mean luminance of the chart plot box:

| window | content zone |
|---|---|
| 0.00-49.00 | CMC $TUT page, 1M price chart (flat line ~row 320, spike from x~700) |
| **49.00-54.50** | picture-in-picture **crowd-celebration video** covering x 0-935, y 0-550 |
| 54.50-66.30 | CMC $TUT page, **All / Mkt Cap** view (flat base, 66.48M spike at x~750) |
| **66.30-71.40** | **FULL-FRAME ARNOLD** (protected, see above) |
| 71.40-78.83 | CMC $TUT page |

Low-value regions that are free in EVERY non-PiP frame (verified on f1/f8/f15/f22/f30/f40/f60/f78):

- **P-RIGHT** `left 650, top 400, w 340` -> `x 650-990, y 400-740` — the "Wallet Not Connected" /
  "My Positions" white block. The right edge stops at 990 so the platform's 90 px action-button
  rail stays clear.
- **P-LEFT** `left 60, top 430, w 320` -> `x 60-380, y 430-750` — the Boost button, the ad tile and
  the "CMC AI" prompt chips.
- **BADGE BAND** centred, `top 650` (one-line badge, box ~ y 554-746, x ~305-775) — the CMC AI /
  "Tutorial Markets" header strip. `line2` is deliberately unused: a 2-line badge measures ~252 px
  tall and its bottom edge came within ~20 px of a 2-line caption's top edge (810).

Never used: the chart plot area (x 207-830, y 60-480), the left stats column (market cap / volume /
supply, y 140-400) and the Markets exchange table rows — those are the receipt.

---

## Beat table — every asset is a TRANSPARENT alpha PNG sticker or a code-drawn badge

`mode` column: `overlay` = alpha PNG through `overlays[]` (`blend:'normal'`), `badge` = code-drawn.
There is **no `full` and no `content` row anywhere in this table** and none in the comp.

| # | t in - t out | spoken line (clip whisper) | visual | mode | placement | asset | reference |
|---|---|---|---|---|---|---|---|
| O1 | 1.70-4.50 | "we have an old time favorite that is **pumping like crazy**" | glowing green upward arrow punching through amber candles | overlay | P-RIGHT | `broll-tut94x-arrow.png` | none (abstract) |
| O2 | 9.50-12.20 | "this is **$TUT on BNB**" | the **$TUT lightning-T coin**, amber/black, glowing | overlay | P-LEFT | `broll-tut94x-coin.png` | **`schedule-tweets/images/reference/TUT-tutorial.jpg` (MANDATORY, gate)** |
| B1 | 20.90-23.20 | "i made it public **when we did that 94X**" | badge `94X` / `CALLED PUBLICLY` (amber) | badge | band, top 650 | code-drawn | -- |
| O3 | 23.50-25.80 | "**congratulations, people.** man, look at this" | gold confetti + streamer burst | overlay | P-RIGHT | `broll-tut94x-confetti.png` | none |
| B2 | 27.50-29.40 | "it's **638% for the month**" | badge `638%` / `IN ONE MONTH` (green) | badge | band, top 650 | code-drawn | -- |
| O4 | 38.20-41.00 | "like **65x from the bottom**, man" | glowing rocket climbing with a fire trail | overlay | P-LEFT | `broll-tut94x-rocket.png` | none |
| O5 | 46.60-48.90 | "look at, look at this. **look, look.**" (the stutter, chart reveal) | golden firework detonation | overlay | P-RIGHT | `broll-tut94x-firework.png` | none |
| B3 | 61.40-64.60 | "we did the **550X on NYX on BNB** again" | badge `550X` / `ONE WEEK LATER` (yellow) | badge | band, top 650 | code-drawn | -- |
| -- | **66.30-71.40** | **soundboard drop** | **NOTHING** | -- | -- | -- | -- |
| O6 | 72.80-75.40 | "**holy crap.** it feels good to actually see this thing pumping again" | champagne-gold sparkle / star burst | overlay | P-LEFT | `broll-tut94x-sparkle.png` | none |

**Collision proof (time AND space).** Ordered windows:
`O1 1.70-4.50 | O2 9.50-12.20 | B1 20.90-23.20 | O3 23.50-25.80 | B2 27.50-29.40 | O4 38.20-41.00 |
O5 46.60-48.90 | B3 61.40-64.60 | O6 72.80-75.40`. Smallest gap between any two windows = **0.30 s**
(B1 -> O3), so **no two graphics are ever on screen in the same frame** and the spatial question
never arises. Nothing starts before the frame-0 thumb ends (0.033 s), and `LivestreamShort`
suppresses overlays/badges while the thumb is up anyway. Every window also sits outside the PiP
(49.0-54.5) and Arnold (66.3-71.4) spans. All three rules are enforced MECHANICALLY at bundle time
by `assertNoGraphicsOverlap()` / `assertNoGraphicsOverArnold()` / `assertNoZoneBroll()` in
`constants-tut-94x-euphoria.ts`, which throw rather than ship.

**Coverage arithmetic.** Zone/full b-roll = **0.00 s / 78.83 s = 0 %**; base showing = **100 %**.
Some graphic is on screen for 22.4 s (28.4 % of runtime), but the largest sticker is 340x340 px =
5.6 % of the 1080x1920 frame and 43-73 % of every sticker's own pixels are fully transparent, so
mean frame occlusion is ~1 % and the content zone is never filled.

## SFX (12 cues; contract item #5)

Whoosh on the frame-0 cover cut and on the sticker pops, two risers that each BUILD INTO an impact,
impacts on the two community numbers and on the live chart reveal, a money hit on
"congratulations". Cue points are each file's own measured PEAK offset, so the crest lands on the
frame it punctuates; the two long-tailed impacts are truncated by `dur` rather than turned down.
**Nothing is scheduled between 66.00 and 71.42 s** (the drop) and nothing rides the hard-out.

---

## Frame-0 thumbnail (contract item #2, not waivable by the visual directive)

`thumb-tut94x-cover.png` — ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`), base
video from frame 1. Generated art background **with the $TUT reference**; the hook text is
**code-drawn on top**, never baked into the image.

- title: `94X ON $TUT` / `AND IT'S` / `PUMPING AGAIN`
- chip: `YOU SHOULD HAVE KNOWN` (amber `#ffa800`)
- No em dashes anywhere.

---

## Reference-image gate (MANDATORY, run LIVE before generating)

`ls schedule-tweets/images/reference/` executed 2026-08-09 for this build:

```
DogInMe.png  ElizaOS-ai16z-2.png  ElizaOS-ai16z.webp  LAB.png  TUT-tutorial.jpg
bittensor-tao.png  bobo.png  carousels  cooper.jpg  ethereum-eth.png  housecoin.webp
kappy.png  kaspa-logo.png  kasy.png  kroak.png  linea.png  michael-saylor.png  nacho.jpg
slippy.png  tendies.jpg  toshi.png  troll.png  velvet.png  what-if.jpg
```

Named projects/tickers in this clip and their verdict:

| named thing | reference on disk | action |
|---|---|---|
| **Tutorial / $TUT** | **`TUT-tutorial.jpg`** (black lightning-T on amber) | **USED** on O2 and on the thumbnail cover, via `gen-batch-freshchat.js` `ref` upload |
| NYX | none | no logo invented; the 550X lands as a code-drawn badge + caption |
| BNB | none | no logo invented; caption only |
| CodeMonkey Mike | n/a (the soundboard line) | nothing at all, by hard guard |

## Persona-clean rule for the generated art

Every generated image is inspected before render. Generic coins must be **blank/unmarked**; no
Ethereum diamond, no Bitcoin symbol, no other real project mark, no real-person faces, crowds only
as faceless silhouettes. The ONLY real mark permitted in this clip is the **$TUT lightning T**,
because it is the clip's own named project and it comes from the on-disk reference. On a violation:
**remap the beat to a clean on-disk asset, do not regenerate mid-build**, and report the swap.

## Generation

```
node repurpose/gen-batch-freshchat.js --list=<items>.json --prefix=broll --batch=tutorial
python video-creation/_make_tut94x_overlays_alpha.py     # glow-on-black -> TRUE alpha (alpha = boosted luminance)
```
Files land in `video-creation/shorts/tutorial/render-assets/` as `broll-tut94x-*.png`
(the cover is renamed to `thumb-tut94x-cover.png` so the gate's thumbnail check keys on it and it is
never miscounted as a b-roll beat). Every filename carries the `tut94x` clip key because the
render-assets folder is SHARED with the other clips of this batch, which are being built in parallel.

## Zero-orphan reconciliation

Run before the render: every row above has exactly one asset, every asset is referenced in
`constants-tut-94x-euphoria.ts`, and every `staticFile()` in the comp exists on disk. Enforced
mechanically by `finalized_short_gate.py` (both directions).
