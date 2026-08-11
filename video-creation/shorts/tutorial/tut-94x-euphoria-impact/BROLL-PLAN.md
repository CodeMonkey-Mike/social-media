# BROLL-PLAN — `tut-94x-euphoria-impact` (batch `tutorial`, clip #6, variant impact)

**Title:** "Look, Look, Holy Crap: The 94X, Then a 550X One Week Later"
**Spine:** `video-creation/shorts/tutorial/render-assets/tut-94x-euphoria-impact.mp4` (28.22 s, 1080x1920, 25 fps source, 1 s GOP verified)
**Comp:** `TutEuphoriaImpact` @ 30 fps, **846 frames** (see the duration measurement below). **Seam measured 854** on 8 sampled frames (delta 63-221, identical row every time).

---

## ⛔ THE COVERAGE RULE FOR THIS BATCH (Mike, 2026-08-09, recorded in `tighten-plan.json` -> `mike_4b.build_directives`)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."
> Clarified in the same directive: "The test is COVERAGE, not the asset's source: a
> transparent-background PNG laid over the base is fine, a full-frame or content-zone image is not."

So this plan has **ZERO `mode:'full'` and ZERO `mode:'content'` beats.** Every visual beat below is
either **BASE** (the spine showing, untouched) or a **small transparent-alpha overlay / code-drawn
badge** that sits ON the base and covers a few percent of the frame.

**This is a KNOWN, DECLARED DEVIATION from the finalized-short contract item 4** (`~30 % generated
b-roll`, `full-screen at hook/transitions/climax 1-3x`). It is NOT an orchestrator delegation
overriding the standard — it is Mike's own Phase 7 directive for this batch, recorded in the batch
plan before the build, with its gate consequence spelled out by him ("every clip must therefore carry
at least one transparent overlay asset ... If a clip genuinely warrants none, STOP and flag it rather
than bypassing the gate"). It is flagged verbatim in the build report; the builder did not waive it
on its own authority.

**Why the ban costs this clip nothing:** the content zone here IS the receipt. 0-5.5 s and 10-22.9 s
it is the live CoinMarketCap **$TUT** page with the chart zooming into the vertical spike Mike is
pointing at; 6-10 s it is his own crowd-celebration meme insert; 22.9-28.2 s it is the Schwarzenegger
soundboard clip that plays full-frame. Covering any of it would be covering the story.

## ⛔ HARD GUARD — the payoff is a SOUNDBOARD DROP, nothing may cover it

Master **353.36-358.62** = **clip 22.94-28.20**: "And that's why CodeMonkey Mike has the greatest
crypto community on the planet." That audio is a **Schwarzenegger soundboard sample, not Mike**, and
the picture is the Arnold clip playing full-frame (verified: at t=23-27 the whole frame is the Arnold
video, the webcam zone goes blank lavender). It also ENDS the clip.

- No b-roll (already banned batch-wide) and **NO overlay graphic and NO badge** at t >= 22.30.
- **No SFX at all after 20.10.** A sting on top of a soundboard sample is the same defect as a sting
  masking the VO, and this one is the payoff.
- Captions only. The last overlay (O3) is out at 22.30, i.e. **0.44 s before the 0.20 s lead-in
  silence (22.74) and 0.64 s before the sample's own onset (22.94)**.
- The tighten relock pushed the out-point to 358.62 to rescue 0.31 s of the sample. Nothing here
  trims it back: `TUT6_DURATION` = **846 frames @30 = 28.200 s** (this plan first wrote 847; 846 is the
  measured value and is what shipped). Re-measured 2026-08-10 at 20 ms RMS on the spine's own audio:
  the sample is audible to **28.18** (-32.6 dB at 28.16-28.18), then -67.3 dB at 28.18-28.20 and
  -93.3 dB at 28.20-28.22, i.e. the last 0.04 s of the audio stream is digital silence. 846 frames
  clears the audible tail by 0.02 s; the video stream is only 28.160 s (704 frames @25), so 846 already
  puts one comp frame past it holding the last picture, and 847 would add a second such frame for
  nothing but -93 dB of silence. Verified on the render (ffprobe + tail-frame check), not assumed.

---

## Beat table (clip-relative seconds; every second of the clip is accounted for)

| # | window | mode | spoken line | visual | asset | reference |
|---|---|---|---|---|---|---|
| — | 0.000-0.033 | **frame-0 cover** | (frame 0 only) | designed hook cover: captured spine frame @16.2 s (Mike mid-exclamation + the zoomed $TUT chart spike) + CODE-drawn title "LOOK, LOOK, HOLY CRAP" and teal chip "94X. THEN A 550X." | `thumb-tut6.png` | n/a (captured from this clip's own spine, SKILL Phase 7 rule 5) |
| 1 | 0.033-1.10 | BASE | "Now look at this man." | the CMC $TUT page + Mike. The video opens on the base, per rule 5. | — | — |
| 2 | **1.10-3.50** | **OVERLAY** | "look at, look at this." | neon-green chart arrow breaking upward out of a candle stack, transparent alpha, floats in the DARK right-hand slot of the face zone | `broll-tut6-breakout-arrow.png` | none needed (generic candles, no logos) |
| 3 | 3.50-6.20 | BASE | "Look, look. Holy crap." | his reaction + the chart. Nothing over the payoff of the cold open. | — | — |
| 4 | **6.20-8.40** | **OVERLAY** | "Ohhh man," (the 2.36 s HELD VOWEL) | golden confetti + starburst sparkle, transparent alpha, same right-hand slot | `broll-tut6-euphoria-burst.png` | none needed |
| 5 | 8.40-10.90 | BASE | "I hope these days come back because that's" | face beat, no reveal in it | — | — |
| 6 | **10.90-12.90** | **BADGE** (code) | "September and October were absolutely insane" | teal plate: SEPT + OCT / INSANE / "THE GOOD DAYS" (shipped; the earlier comp draft's SEPTEMBER / OCTOBER / ABSOLUTELY INSANE just re-typed the caption and put the emphasis on the wrong word. The plan's own "THOSE WERE THE DAYS" WRAPPED on the render, see the measured sub cap below) | code-drawn | — |
| 7 | 12.90-14.95 | BASE | "And then one week after we did" | the zoomed chart is the receipt; let it play | — | — |
| 8 | **14.95-16.70** | **BADGE** (code) | "this 94X" (+ the 0.86 s drum-roll after it) | yellow plate: **94X** / "THE CALL WE MADE" | code-drawn | — |
| 9 | 16.70-17.60 | BASE | (breath into the second number) | riser runs under it | — | — |
| 10 | **17.60-19.60** | **BADGE** (code) | "we did the 550X" | green plate: **550X** / "ONE WEEK LATER" | code-drawn | — |
| 11 | 19.60-20.20 | BASE | "on" (stretched) | — | — | — |
| 12 | **20.20-22.30** | **OVERLAY** | "on NYX on BNB again." | two neon rockets, the second higher and bigger with a longer trail ("again, but bigger"), transparent alpha, right-hand slot. `tIn` moved 20.00 -> 20.20 so its whoosh crests inside the measured 20.16-20.38 silence instead of on the stretched "on". | `broll-tut6-second-rocket.png` | none exists for NYX (see reference gate below) |
| 13 | **22.30-28.22** | **BASE, PROTECTED** | "And that's why CodeMonkey Mike has the greatest crypto community on the planet." | the Schwarzenegger soundboard drop, full-frame, **captions only** | — | — |

### Overlay placement slot (MEASURED, one fixed slot so nothing can ever collide)

`left 760, top 1040, width 300` -> **x 760-1060, y 1040-1379** (the three keyed PNGs are 1080x1220,
1170x1137 and 1083x1159, so at width 300 the tallest renders 339 px), i.e. the dark shadowed band to
the right of Mike's head (green screen where it shows, his own dark hair where it does not), in the
FACE zone.

- Re-measured 2026-08-10 over each overlay's own window (4 sampled frames each, mean luma / std of the
  exact 300x339 slot): O1 **16.4-18.0 / 18.8-19.9**, O2 **17.5-37.5 / 17.6-32.8**, O3 **8.8-21.4 /
  10.2-31.4**. Max pixel in the slot is 59-189 / 255. A luminance-keyed neon graphic reads at maximum
  contrast there and hides nothing.
- **Not the content zone at all** (content zone ends at 854), so it cannot be read as content-zone b-roll.
- **Clear of the caption band**: captions are centred at `capY 890`; even a 2-line caption bottoms out
  around y 970, so the slot's top edge (1040) is >= 70 px clear.
- **Clear of the 240 px platform safe zone** (slot bottom 1379 vs 1680).
- Same slot every time = a deliberate "sticker slot" and a structural guarantee of zero overlap.

### Badge placement (MEASURED)

`top 560` (the shared `Badge` is centre-anchored) -> panel **y 437-683** worst case (the 3-row
SEPT+OCT plate: 60 px + 82 px + 32 px of text, 28 px padding top/bottom, 18 px of margins), which
lands on the CoinMarketCap **"CMC AI" question-chip row**. Re-measured 2026-08-10 over that exact
540x246 box on 6 frames spanning all three badge windows: **luma 244.5, std 26.1-27.0** — flat white
UI, not data. The chart plot (the vertical $TUT spike, the receipt) ends at y ~410 and the market
rows with the real prices start at y ~690, so the badge covers only the chip row, the range selector
and the "Tutorial Markets" heading: no chart pixel and no price is hidden. Badge text stays inside the
component's text box: longest big lines are "SEPT + OCT" (10 ch @60 px) and "550X" (4 ch @82 px).

**The `sub` line's real cap is ~16 characters, measured on the render, not estimated.** At 32 px with
`letter-spacing: 0.12em` the box takes "THE CALL WE MADE" (16) and "ONE WEEK LATER" (14) on one line
but WRAPS "THE GOOD OLD DAYS" (17) and this plan's original "THOSE WERE THE DAYS" (19). A wrapped sub
adds a 4th row, pushes the plate bottom from ~673 to ~705 and covers the top market row (Binance
TUT/USDT $0.07957) for the badge's whole 2.0 s. So B1's sub shipped as **"THE GOOD DAYS"** (13) — same
nostalgic echo of "I hope these days come back", 3 rows like the other two plates, and market row 1
stays visible. Verified on rendered stills at frames 340 / 455 / 555.

### Collision matrix (contract item 7 / SKILL production rule 3)

Windows in time order: cover 0-0.033 | O1 1.10-3.50 | O2 6.20-8.40 | B1 10.90-12.90 |
B2 14.95-16.70 | B3 17.60-19.60 | O3 **20.20**-22.30. **No two windows touch** (smallest gap = 0.90 s,
B2 -> B3) and nothing starts before the cover frame ends, so no two graphics can ever share a frame.
The overlays and the badges are also in different bands (y 1040-1379 vs y 437-683) even in principle.
(O3 is 20.20 everywhere, per the retime in beat 12; the 20.00 that used to appear on this line was a
stale copy of the pre-retime value.)

### Coverage arithmetic

Recomputed 2026-08-10 against the shipped windows and the real PNG aspect ratios (at `width: 300` the
three keyed stickers render 300x339, 300x292 and 300x321).

| | seconds | % of 28.20 s | frame area covered | frame-seconds covered |
|---|---|---|---|---|
| full-screen b-roll | 0.00 | 0 % | — | 0 % |
| content-zone b-roll | 0.00 | 0 % | — | 0 % |
| transparent overlays (3) | 6.70 | 23.8 % | 4.2-4.9 % of frame (box); ~34-40 % of the box is actually opaque, so ~1.7-2.0 % of frame in ink | 1.09 % (box) |
| code-drawn badges (3) | 5.75 | 20.4 % | 540x246 = 6.4 % | 1.31 % |
| **base fully unobstructed** | **15.72** | **55.7 %** | 100 % | — |

**Content zone visible and unobstructed: 100 % of the clip except the 5.75 s of badge chip-row** (and
even then, the chart spike and the price rows are never covered). Total graphic ink over the whole
runtime = **2.4 % of frame-seconds**.

## Reference-image gate (MANDATORY, run LIVE against `schedule-tweets/images/reference/`)

`ls` run 2026-08-09, 24 entries: `DogInMe.png ElizaOS-ai16z-2.png ElizaOS-ai16z.webp LAB.png
TUT-tutorial.jpg bittensor-tao.png bobo.png carousels cooper.jpg ethereum-eth.png housecoin.webp
kappy.png kaspa-logo.png kasy.png kroak.png linea.png michael-saylor.png nacho.jpg slippy.png
tendies.jpg toshi.png troll.png velvet.png what-if.jpg`

- **NYX** (the 550x call token, on BNB) — **no reference exists.** Per the gate, its beat therefore
  carries NO invented logo: O3 is generic rockets. Flagged in the report so Mike can drop a reference
  in if he wants one for a future NYX clip.
- **BNB** — no reference; not depicted.
- **$TUT / Tutorial** — a reference EXISTS (`TUT-tutorial.jpg`) but **the token is never named in this
  clip** (the tighten plan says so in terms: "no token is named in this clip so no $TUT styling is
  needed inside it"). Its branding is already on screen for real, in Mike's own screen-share (the CMC
  page header reads "TUT Tutorial"). Introducing a $TUT logo overlay would assert a token the clip
  does not name. Deliberately not used.
- **CodeMonkey Mike** — Mike's own community brand, no reference asset, and the beat that names it is
  the PROTECTED soundboard drop, which nothing may cover.

## Persona inspect (run on every generated image BEFORE the render)

Every overlay must be free of: any real cryptocurrency mark (Bitcoin B, Ethereum diamond/octahedron,
BNB diamond, any real project logo), any real-person face, and any legible invented ticker text.
Coins, if any appear, are blank/generic. Violation -> REMAP the beat to another clean on-disk asset,
never regenerate mid-build.

## SFX (contract item 5) — 8 events, all ending before the soundboard drop

Cue `t` = the target frame MINUS that file's own measured crest offset (0.05 s-window RMS envelope,
re-measured on this machine 2026-08-10): `transition_rapid_whoosh` crests 0.15 s in (audible to 0.95,
file 0.97) · `Soundjay_Impact_Main_01-short` 0.25 (to 0.65) · `TING` 0.80 (to 1.50) · `DING` 0.20
(to 1.30, and already -53 dBFS by 1.00) · `Impact_Hit_01-2` 0.10 (to 6.30, so `dur` truncates it) ·
`Tension_Rise_Logo_Reveal_3` 2.55 (to 5.65).

| t | dur / vol | file | crest lands on | why |
|---|---|---|---|---|
| 0.00 | 1.00 / 0.24 | `sfx/transition_rapid_whoosh.mp3` | 0.15 | the frame-0 cover cut; the crest sits in the measured 0.00-0.17 silence, before "now look" |
| 0.95 | 0.95 / 0.18 | `sfx/transition_rapid_whoosh.mp3` | 1.10 | sweeps into the O1 arrow |
| 4.40 | 0.70 / 0.24 | `sfx/Impacts/Soundjay_Impact_Main_01-short.wav` | 4.65 | IMPACT on "HOLY"; attack sits in the 4.29-4.41 gap and the SHORT variant's tail is gone by 5.08, before "crap" (5.28) |
| 5.39 | 1.60 / 0.16 | `sfx/TING SOUND EFFECT.mp3` | 6.19 | the euphoria burst O2, over the held vowel |
| 14.76 | **0.93** / 0.20 | `sfx/DING.mp3` | 14.96 | the 94X plate; `dur` gates the decay at **15.700**, just before the naked beat (see below) |
| **16.60** | **1.00** / 0.10 | `sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav` | (build) | riser UNDER "we did the", ENDS exactly on the 550X hit (17.60). **RETIMED off the 0.86 s beat** (see below) |
| 17.47 | 1.80 / 0.26 | `sfx/Impacts/Impact_Hit_01-2.wav` | 17.57 | the CLIMAX: the 550X plate; truncated so the tail is gone before "on nyx" (19.52) |
| 20.05 | 0.95 / 0.20 | `sfx/transition_rapid_whoosh.mp3` | 20.20 | into the O3 rockets, crest inside the measured 20.18-20.40 silence |

**Nothing fires at or after 20.10**, and the SFX bed is **BIT-EXACT SILENT (max |sample| = 0.0) from
22.30 to the end**, i.e. across the whole Schwarzenegger drop, verified sample-wise on the offline mix.

### ⛔ The 0.86 s beat at 15.73-16.59 is DIGITAL SILENCE and stays naked (retime, 2026-08-10)

The plan originally ran the riser 15.10-17.60 straight through that beat. Measurement killed it: at
10 ms RMS the beat is not room tone, it is **absolute silence** (-79 dB at 15.75 falling to the -240 dB
floor by 15.95 and holding it to 16.59; speech resumes 16.60). A riser at vol 0.10 sits at **-49 to
-40 dBFS** in that window, i.e. it would be the ONLY sound in the frame — the definition of papering
over a deliberate rhetorical pause in a clip whose 5B pass removed literally nothing. So:

- the riser moved **15.10 -> 16.60**, still ending exactly on the 550X hit, so the contract's "a riser
  builds INTO an impact" survives without touching the beat. 1.00 s of the file's soft head would be
  inaudible, so it plays a **trimmed library variant** `Tension_Rise_Logo_Reveal_3-1s.wav` (the 1.00 s
  ending on the parent file's own RMS crest, 60 ms fade-in, hard cut on the impact) = a 10 dB build in
  1.00 s. Same trimmed-variant pattern as the `-short` impacts already in the library.
- the DING's `dur` **1.20 -> 0.93** (28 frames), gating its decay at 15.700. Cut level -51 dBFS under a
  -48 dB word tail, so the gate is inaudible.
- **Result: the SFX bed is BIT-EXACT SILENT across 15.730-16.590.** The badge on that beat (B2, the 94X
  plate) is kept: a static plate cannot fill an audio pause, and holding the number he just said is
  what the viewer wants to read during it.

### ⛔ `dur` TRUNCATES, IT DOES NOT FADE — every cue edge audited as a CLICK (2026-08-10)

Measured the last sample each cue actually plays against the spine's true peak in the same 30 ms:

| cue | step at the cut | spine there | margin | verdict |
|---|---|---|---|---|
| whoosh @0.95 | -56.9 dBFS | -23.1 | +33.9 | fine |
| TING @5.39 | digital zero | -17.7 | +222 | fine |
| whoosh @20.05 | -56.0 | -30.6 | +25.4 | fine |
| **DING @14.76** | **-47.3** | **-47.7** | **-0.4** | **click at parity with the audio** |
| **Impact_Hit_01-2 @17.47** | **-26.9** | **-29.2** | **-2.3** | **click LOUDER than the audio, 0.25 s before "on nyx"** |

Fixed the documented way — **trim + fade as a library variant at UNCHANGED gain**, never by lowering the
payoff hit: `sfx/Impacts/Impact_Hit_01-2-18.wav` (1.80 s, 0.30 s fade-out) and `sfx/DING-093.wav`
(0.93 s, 0.12 s fade-out), plus a 40 ms fade-out added to the riser variant. Clip #1's
`Impact_Hit_01-2-short.wav` was deliberately NOT reused: at 0.55 s it cannot ring under a 1.7 s reveal.
After the fix every truncation edge reaches digital zero or sits >= 25 dB under the audio.

Every cue is whisper-verified against an ENCODE-MATCHED control (the bare spine through the same
48 kHz AAC chain) with short staggered windows, mixed OFFLINE so the sweep costs zero renders
(contract item 7a). Every scratch artifact scored was ffprobed at 28.235-28.245 s and its transcript
checked to be the $TUT 94X/550X material, so none of it was a sibling builder's audio.

## ⛔ TAIL PICTURE REPAIR — the spine's picture dies 0.54 s before its audio (found 2026-08-10)

A per-frame luma scan of all 704 spine video frames finds exactly ONE black run in the whole clip, at
the very end: **frames 691-699 = t 27.640-28.000 are PURE BLACK (luma 0.00)**, then frames 700-703
(28.000-28.160) **snap back to the BASE layout** (CMC page + webcam) while the soundboard drop is still
talking to 28.18. The payoff line would have landed on 0.36 s of black plus a desynced cut back to the
screen-share. This is what the tighten relock was fighting when it pushed the out-point to 358.62.

**Fix, entirely inside the comp:** hold the LAST GOOD ARNOLD FRAME (spine t 27.60, him smiling) from
frame 829 to the end via `tail-tut6-hold.png` at `zIndex 100` — above the base video, BELOW the
captions, so "planet." still burns in over it. The spine is not re-cut, not re-encoded, and the audio
is untouched. It is a full-frame image but it is **not b-roll**: it is this clip's own frame, it covers
nothing (it replaces black), and it makes the drop MORE visible, not less. Flagged in the build report
as a judgment call. Verified on the render: blackdetect finds no black frames anywhere, and the last
frame (845) is Arnold with the closing caption. **Result: zero word-level regressions.** The retime is what fixed the one real
finding — window 14.00-17.00 lost the trailing "we did" with the old riser and matches the control
exactly with the new one. Of 24 windows, the only remaining diffs are punctuation-only or one-fragment
window-boundary artifacts, each contradicted by its own staggered neighbours; the 94X->550X span was
re-run over 7 offsets and agrees **6/7**, with the single outlier (a window ENDING on the impact onset)
reproduced by control variants that do not contain the change.

**The SEPT+OCT badge is deliberately SILENT.** This clip has NO silence at all between
5.32 s and 14.00 s (8.68 s unbroken speech), so a cue there would necessarily sit on consonants; an
extra ding on a supporting plate is decoration, not punctuation (WHEN-TO-USE-IMPACTS.md: "avoid
overuse ... reserve them for the beats that actually matter"). The two cues that do sit inside that
window (4.40, 5.39) both land on sustained vowels and are the two quietest in the list.

## Reconciliation (contract item 4, zero orphans)

3 overlay beats -> 3 PNGs -> 3 `staticFile()` refs in `constants-tut-euphoria-impact.ts`, plus
`thumb-tut6.png`. Every `broll-tut6-*` / `thumb-tut6*` file in `render-assets/` is referenced, and
every ref exists on disk. Verified by `finalized_short_gate.py` (both directions) before the report.
