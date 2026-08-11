# BROLL-PLAN: tutorial / clip 2 `robinhood-meme-rankings` (variant: FULL, 79.46 s)

Title (Mike's frozen 4b): **"My Robinhood Chain Meme Rankings: $IF, Cooper, Tendies, Yolo"**
Hook type: **ranked-opinion**. The appeal is that the viewer gets a side to pick and something to
argue with, so the visual system is a **ranked list**: every rank is stated on screen at the moment
he states it, and the top three picks each get their REAL project art.

Spine (build from THIS, never re-encode it):
`video-creation/shorts/tutorial/render-assets/robinhood-meme-rankings.mp4`
1080x1920, 25 fps, **79.44 s video / 79.463 s audio**, GOP re-encoded seek-friendly. The comp runs at
30 fps; `OffthreadVideo` resamples by TIME, so every cue below is plain clip-relative seconds.

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS WHOLE BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphics, image overlays **with real background transparency**.
BANNED: full-screen b-roll and content-zone b-roll, i.e. **any asset that covers the frame or fills
the content zone**. The test is COVERAGE, not the asset's source.

**Consequence, stated plainly instead of hidden:** there are **ZERO** `BrollEv` beats. Generated
b-roll coverage is **0 %**, base-showing **100 %**, and there is **no full-screen image at the hook**.
That is a DELIBERATE DEVIATION from finalized-short checklist item #4 (~25-35 % zone/full-screen
coverage + 1-3 full-screens) on Mike's own batch-level instruction, and it is reported as a flagged
deviation in the build report rather than papered over. Do not restore b-roll coverage from this file.

Everything visual below is either a **true-alpha RGBA PNG** composited over the base or a
**code-drawn badge**. Each occupies 12-21 % of the content zone; none fills it.

## Base layout (MEASURED on this clip)

Row-mean gradient scan at t = 0.5 / 5 / 12 / 20 / 28 / 36 / 45 / 52 / 60 / 68 / 75 / 79 s: the
screen-share/webcam seam is on row **854** in all TWELVE frames (delta 150-195).
Caption band centre **906** (52 px under the seam, on his hair). Content zone = rows 0-854.

**Full-frame luma scan, all 1975 frames (`signalstats` YAVG):** minimum **55.68** at t 32.760, tail
frame t 79.400 at **113.8**. **ZERO baked-black frames** anywhere, at the tail or at any of the five
internal scatter-gather joins. (Checked because clips 1 and 6 of this batch both shipped with the
picture dying before the audio; this clip does not have that defect.)

### What the CONTENT ZONE actually shows (this is what the overlays must not bury)

Measured with an 8 fps mean|delta| scan of the DEXScreener art-panel crop (`crop=220:170:860:30`);
the whole-zone scan is useless here because these pages are structurally near-identical (median
delta 0.018). Page changes, in order:

| t (measured) | delta | content zone becomes |
|---|---|---|
| 0.00 | - | **CoinMarketCap $TUT page.** A live-chat banner is burned into the base at rows ~730-780: *"In your opinion, what is the best meme coin on the Robinhood chain"* - literally the question this clip answers. **Overlays here stay ABOVE row 700.** |
| 9.125 | 24.4 | **X / COOPER profile** ("Meet Cooper: Robinhood's loyal office dog"), with photos of the real black dog |
| 24.250 | 85.5 | **DEXScreener COOPER/WETH** (Market Cap, Uniswap). The right rail already carries the REAL Cooper art. |
| 31.875 | 254.7 | **BLACK** - a page loading. Dead screen for 2.50 s. |
| 34.375 | 255.0 | back to a near-WHITE X page |
| 41.250 | 85.8 | **DEXScreener COOPER/WETH** again |
| 45.375 | 37.4 | **DEXScreener TENDIES/WETH** - the page flips to Tendies 0.9 s before he names it |
| 63.750 | 35.6 | **DEXScreener YOLO/WETH** ("IT'S TIME TO GO ALL-IN" banner), 0.2 s before he says "Yolo" |

Two consequences drive the plan:
1. **31.875-34.375 is a dead black screen.** That is the single best slot in the clip for a glowing
   alpha overlay, and it is exactly where the #2 verdict lands ("and that is why it's my second
   favorite meme"). The Cooper overlay goes there.
2. **64-75 s he is POINTING AT THE YOLO CHART** ("look what it's doing right here", "it pumped hard
   over here", "maintaining this level right down here"). Per the SKILL, when Mike points at the
   screen the screen IS the visual, so that stretch is a DELIBERATE base-only beat with exactly one
   small badge, placed LOW (rows 573-827, over the transactions table) so it never covers the candles
   he is pointing at.

## Beat table

Assembly is a 6-segment scatter-gather (`clip-plan` order [0,2,1,3,4,5]) with two segments pulled
from ~20 minutes later, so the section map is: hook + #1 pick (0.42-9.07) / why $IF is #1
(9.60-24.20) / Cooper #2 (24.68-33.58) / bridge (33.72-36.43) / Toshi + Robinhood HQ (36.80-45.35) /
Tendies #3 (46.28-62.80) / Yolo #4 (63.96-77.47) / Swappy #5 hard-out (77.70-79.16).

| # | t (s) | spoken line | element | kind | zone / placement | asset | Reference |
|---|---|---|---|---|---|---|---|
| T | 0.000-0.033 | (frame 0 only) | designed hook cover: generated podium art + CODE-drawn title "MY ROBINHOOD / MEME RANKINGS / NUMBER 1 IS / NOT EVEN CLOSE" + chip "WITHOUT A DOUBT" | thumbnail | full frame, ONE frame; base video from frame 1 | `thumb-tutrhm.png` | none (generated art carries NO logo, NO face, NO text) |
| 1 | 4.10-7.20 | "without a doubt, unequivocally, I go for What If" | the REAL $IF art: green figure seen from behind gazing at a spiral galaxy | **true-alpha PNG** | content zone, LEFT, top 130 / left 100 / w 430 (rows 130-560, clear of the burned-in chat banner at 730-780) | `broll-tut-rhm-ov-if.png` | **`schedule-tweets/images/reference/what-if.jpg`** - used DIRECTLY (alpha-from-luminance), not imitated |
| 2 | 10.30-12.30 | "What If is a concept. It's a beautiful phrase." | badge: NUMBER 1 / $IF / A CONCEPT | code-drawn | centred, top 430 (rows ~303-557) | none | ticker rendered `$IF` per the persona hard rule (never $WHATIF) |
| 3 | 13.20-15.60 | "I can't believe that nobody ever thought of it before in a meme coin." | badge: NOBODY / THOUGHT / OF IT BEFORE | code-drawn | centred, top 680 (rows ~553-807) | none | - |
| 4 | 19.95-21.95 | "What if such and such happens?" | badge: WHAT IF / THIS? / WHAT IF THAT? | code-drawn | centred, top 430 | none | - |
| 5 | 25.60-27.80 | "Cooper is a real dog. It is the office dog" | badge: NUMBER 2 / COOPER / A REAL DOG | code-drawn | centred, top 430 | none | - |
| 6 | 31.90-34.30 | "And that is why it's my second favorite meme." | the REAL Cooper mark: **BLACK LAB** in a lime bandana carrying the Robinhood mark | **true-alpha PNG** | content zone, centred, top 170 / left 320 / w 440 - lands ON the dead black screen | `broll-tut-rhm-ov-cooper.png` | **`reference/cooper.jpg`** - used DIRECTLY. ⛔ Cooper is a BLACK LAB; a previous batch rendered a golden retriever and Mike caught it. Nothing is generated here, so the breed cannot drift. |
| 7 | 37.40-39.90 | "it gives me that Toshi vibe, being the cat of Brian Armstrong" | the REAL Toshi mark (Brian Armstrong's cat), background keyed out | **true-alpha PNG** | content zone, RIGHT, top 150 / left 620 / w 370 | `broll-tut-rhm-ov-toshi.png` | **`reference/toshi.png`** - used DIRECTLY |
| 8 | 41.70-43.90 | "here we have the office dog in the Robinhood headquarters" | badge: THE OFFICE / DOG / AT ROBINHOOD HQ | code-drawn | centred, top 680 | none | - |
| 9 | 47.95-50.70 | "it's a very funny and stupid concept" | the REAL Tendies art: hooded Pepe-style frog holding the platter of chicken tenders | **true-alpha PNG** | content zone, LEFT, top 150 / left 110 / w 420 | `broll-tut-rhm-ov-tendies.png` | **`reference/tendies.jpg`**, CROPPED to the frog+platter only. DO-NOT-COPY from that busy banner: the "TENDIES" wordmark lettering, the blond suit figure, the candlestick chart, the rocket. The crop excludes all four mechanically, so none of them can leak. |
| 10 | 55.50-57.50 | "I think that it'll get it a potential Robinhood app listing" | badge: POTENTIAL / LISTING / ON ROBINHOOD | code-drawn | centred, top 680 | none | wording is his own claim ("potential"), nothing asserted as fact |
| 11 | 60.75-62.80 | "And that'll be number three." | badge: NUMBER 3 / TENDIES / FUNNY AND STUPID | code-drawn | centred, top 430 | none | "funny and stupid" is his PITCH for Tendies (positive valence, per the clip-plan) |
| 12 | 68.95-70.10 | "it pumped, it pumped hard over here" | badge: IT PUMPED / HARD (no sub) | code-drawn | centred, **top 700** (rows ~596-804) so it never covers the candles he is pointing at | none | - |
| 13 | 75.60-77.60 | "But I think this would be my number four." | badge: NUMBER 4 / YOLO / HELD ITS LEVEL | code-drawn | centred, top 430 | none | - |
| 14 | 77.90-**80.20** | "Maybe Swappy would be like my number five." (HARD OUT) | badge: NUMBER 5 / SWAPPY / MAYBE | code-drawn | centred, **top 700** (a DIFFERENT band from #13, which ends 0.30 s earlier) | none | no reference exists for Swappy, so the beat is TYPOGRAPHIC only - no mascot is invented |

**AS-BUILT CHANGE, beat 14's tOut: 79.40 -> 80.20**, i.e. deliberately PAST the comp end (last frame
t 79.400 s) so the 0.18 s fade-out never starts and the clip HARD-OUTS on the closing rank at full
opacity. Caught on a frame-2382 still during chunk-QA: at tOut 79.40 the #5 card faded to zero across
the last five frames, so the list-completing punchline vanished exactly as the video ended. Verified
fixed on the final mp4 at t 79.400.

**No mascot is invented for Yolo or Swappy** (no reference exists on disk); both are typographic
beats. Yolo's real branding is already on screen in the base from 63.750 onward.

## Collision matrix (time AND space, Phase 7 rule #3)

Windows in order: `0.000-0.033` (thumb) / 4.10-7.20 / 10.30-12.30 / 13.20-15.60 / 19.95-21.95 /
25.60-27.80 / 31.90-34.30 / 37.40-39.90 / 41.70-43.90 / 47.95-50.70 / 55.50-57.50 / 60.75-62.80 /
68.95-70.10 / 75.60-77.60 / 77.90-79.40.

**No two windows overlap.** Smallest gap **0.30 s** (#13 -> #14), and those two also sit in different
vertical bands (rows ~303-557 vs ~596-804), so even the `Badges` component's +/-0.1 s draw tolerance
cannot collide them. Every other gap is >= 0.80 s. Nothing starts before the thumb frame ends, and
`LivestreamShort` suppresses badges and overlays while the thumb is up anyway. No watermark and no
logo-reveal plate are used, so the thumb frame carries no other graphic at all.

Max badge `top` is **700**: a line1+line2+sub badge is ~254 px tall, so top 700 ends at row 827,
clear of the seam (854) and of the caption band (rows ~855-955).

## ⛔ PROTECTED PERFORMANCE BEATS - measured, and graphic/SFX-free

Mike desilenced this batch at **min-sil 0.95** expressly to KEEP these. Re-measured on THIS staged
spine at 5 ms hop / 10 ms window RMS:

| span | what it is | how the plan respects it |
|---|---|---|
| **27.845-28.485** (0.640 s) | **the drawled "of" inside the Cooper triple.** "office dog" releases at 27.845, floor -50..-62 dB, then "of Robinhood" re-onsets at 28.485. The shipped word JSON glues the pause INSIDE the token (`of` 27.98-28.84), which would have captioned the word 0.50 s early, on the beat. | badge #5 ends **27.80** (fade complete 45 ms before the pause). No SFX anywhere between 25.12 and 45.35. **Zero added energy.** |
| **30.175-31.035** (0.860 s) | the beat after the THIRD limb, "It's a real dog. [beat] And that is why..." | graphic-free gap 27.80-31.90; no SFX |
| **22.115-23.285** (1.170 s) | the beat after the anaphora chain, before "So that's beautiful." | badge #4 ends 21.95; no SFX |
| **66.795-67.740** (0.945 s) | "look what it's doing right here. [beat] It went up and pumped" | graphic-free; no SFX |
| **70.180-71.060** (0.880 s) | "it pumped hard over here. [beat] And then it's really maintaining" | badge #12 ends **70.10**; no SFX |
| 50.800-51.325 / 54.655-54.930 / 57.660-58.315 | the hesitation beats inside the Tendies peak | every graphic edge and every SFX crest is outside them |

The three **protected peaks** the tighten pass verified (no cuts inside): clip **0.42-9.07** (the
"without a doubt, unequivocally" hook), **24.53-30.39** (the Cooper triple), **48.50-59.955**
("funny and stupid" -> app listing -> fartcoin).

**KEPT VERBATIM, never deduped in captions** (all four verified on screen after the build): the
Cooper triple in all three limbs, "without a doubt, unequivocally", the "my, my favorite" doubling
(protected in `build_captions.py` via `PROTECTED_DOUBLES ("is","my","my","favorite")` - the stutter
collapse HAD eaten it before that rule was added), and the "what if / what if this happens / what if
such and such happens" anaphora.

## Reference-image gate (run LIVE 2026-08-10 against `schedule-tweets/images/reference/`)

Named projects/people in this clip: **What If ($IF)**, **Cooper**, **Tendies**, **Yolo**,
**Swappy**, **Toshi**, **Brian Armstrong**, **Robinhood**, **Fartcoin**.

- **What If -> `what-if.jpg` EXISTS** -> beat 1 carries the real art.
- **Cooper -> `cooper.jpg` EXISTS** -> beat 6 carries the real mark (BLACK lab, lime bandana).
- **Tendies -> `tendies.jpg` EXISTS** -> beat 9 carries the real frog+platter.
- **Toshi -> `toshi.png` EXISTS** -> beat 7 carries the real mark.
- **Yolo, Swappy, Robinhood, Fartcoin, Brian Armstrong -> no reference on disk** -> no logo, mascot or
  face is invented for any of them. They are text-only beats, and Yolo's real art is in the base.

**Method: the four references are used DIRECTLY, not imitated.** Each is converted to a true RGBA
PNG by `_make_alpha_overlays.py` in this folder (alpha-from-luminance for the two on-black arts,
edge-flood colour keying for the two flat-background marks). That is the strongest possible form of
the reference gate: the branding is pixel-exact, the breed/species/palette cannot drift, and no
image model is asked to reproduce a real mark. Only the frame-0 cover background is generated.

## Generation

**One image only:** `thumb-tutrhm.png`, the frame-0 cover background, via the canonical pooled
pipeline `repurpose/generate-broll-reload.js` (ChatGPT pool purpose `broll`) inside the `chatgpt`
stage lock, straight into the batch's shared public dir
`video-creation/shorts/tutorial/render-assets/`. Prompt is a dark neon-green tiered podium with five
**blank featureless** coin discs, **no text, no lettering, no logos, no faces** (the title and chip
are CODE-drawn on top, never baked in).

The four overlay PNGs need **no generation at all** - see the method note above.

Namespace, because the public dir is SHARED with 7 sibling clips: everything this clip owns is
`broll-tut-rhm-*` / `thumb-tutrhm.png`. This clip never reads or writes `broll-tut94x-*`,
`thumb-tut94x-*`, `broll-tut-bkc-ov-*`, `thumb-tutbkc.png`, `broll-tut6-*`, `tail-tut6-hold.png`,
`thumb-tut6.png`.

## SFX AS BUILT (>= 2 required; **9 events, 3 distinct files**, all from `video-creation/assets/sfx/`)

⛔ **The riser in the table below was DELETED, not retimed and not turned down.** Offline whisper A/B
against an encode-matched control, zero renders: at t 59.43 (crest on the impact) it scored **0/3**
windows and destroyed the payoff token ("just like far far coin that" -> "just like fart- fart
boring." / EMPTY); moved to t 58.00 so it ends BEFORE "fart coin" onsets at 59.02 it still scored
3/6 and still lost the token; and dropping its gain 0.09 -> 0.06 produced an IDENTICAL failure, i.e.
**volume is not the knob** (the fourth confirmation in this pipeline). It could not be saved by timing
and it is decoration rather than the payoff hit, so per the contract it is deleted. Do not re-add it.
With the riser gone the impact keeps its full 0.26 gain and scores **5/6** windows control-identical.

Cue points are each file's own MEASURED CREST, not its file start. Envelopes re-measured on this
machine at 0.1 s RMS / 0.01 s hop (16 kHz mono):
`transition_rapid_whoosh.mp3` crest 0.15 (dur 0.97, body ends 0.60) - `DING-093.wav` crest 0.17
(dur 0.93, 0.12 s fade-out, body ends 0.79) - `Impacts/Impact_Hit_01-2-short.wav` crest 0.09
(dur 0.55, body ends 0.44) - `risers/Tension_Rise_Logo_Reveal_3-1s.wav` crest 0.67 (dur 1.00).

**Every `dur` here is the file's own full length, so nothing is truncated.** (Batch finding: a `dur`
window TRUNCATES, it does not fade - clip 6 measured a truncation click at -2.3 dB, louder than the
speech 0.25 s later. The faded/short library variants are used instead, at unchanged gain.)

| t (cue) | crest | cue | file | vol |
|---|---|---|---|---|
| 0.00 | 0.15 | frame-0 cover cut into the video, inside the 0.000-0.405 TRUE digital silence | `transition_rapid_whoosh.mp3` | 0.22 |
| 9.10 | 9.25 | MEASURED picture cut CMC $TUT -> X/Cooper, inside the 0.535 s window 9.065-9.600 | `transition_rapid_whoosh.mp3` | 0.20 |
| 10.13 | 10.30 | NUMBER 1 / $IF badge pop | `DING-093.wav` | 0.18 |
| 24.10 | 24.25 | MEASURED picture cut X -> DEXScreener COOPER, inside the silence 24.195-24.480 | `transition_rapid_whoosh.mp3` | 0.20 |
| 45.35 | 45.50 | MEASURED picture cut COOPER -> TENDIES, inside the silence 45.350-45.805 | `transition_rapid_whoosh.mp3` | 0.20 |
| 47.78 | 47.95 | Tendies overlay pop, inside the 0.855 s window 47.630-48.485 | `DING-093.wav` | 0.18 |
| ~~59.43~~ | ~~60.10~~ | **DELETED** - riser under "just like fartcoin" (see the note above) | ~~`risers/Tension_Rise_Logo_Reveal_3-1s.wav`~~ | - |
| 60.16 | 60.25 | **PAYOFF IMPACT** after "fartcoin", inside the 0.615 s window 60.015-60.630; natural decay ends 60.60, 30 ms before "That'll" | `Impacts/Impact_Hit_01-2-short.wav` | 0.26 |
| 63.65 | 63.80 | MEASURED picture cut TENDIES -> YOLO, inside the silence 63.745-63.960 | `transition_rapid_whoosh.mp3` | 0.20 |
| 75.15 | 75.30 | the last scatter-gather join (seg4 -> seg5), inside the silence 75.155-75.455 | `transition_rapid_whoosh.mp3` | 0.18 |

**Deliberately DRY:** the 31.875 cut to black and the 34.375 cut back (both mid-speech - a whoosh
there would sit on "it's my second favorite meme"); the 41.250 cut (it lands ON the word "dog"); the
**hard-out** (nothing on "number five" - the abrupt no-CTA ending is the watch-time strategy, and a
stinger crested in the closing 0.220 s silence would be truncated by the comp end and click).

Every cue is A/B'd OFFLINE against an ENCODE-MATCHED control (the bare spine pushed through the same
48 kHz/AAC chain as the render) on short staggered windows, before any render - that costs zero
renders and only the winner is rendered. **Volume is not the knob**: a masking cue is retimed, its
tail trimmed, or it is deleted.

## Reconciliation (re-checked before the render)

Every beat above has an asset; every asset is referenced in
`remotion/src/constants-tut-robinhood-meme-rankings.ts`; every comp ref exists in `render-assets/`.
Zero orphans, both directions - the finalized-short gate enforces it. The gate's "unreferenced
assets" line will list the SEVEN SIBLING CLIPS' assets because the public dir is shared; that is a
benign WARN, not a failure.
