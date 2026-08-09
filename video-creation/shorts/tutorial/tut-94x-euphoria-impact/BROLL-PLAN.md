# BROLL-PLAN — `tut-94x-euphoria-impact` (batch `tutorial`, clip #6, variant impact)

**Title:** "Look, Look, Holy Crap: The 94X, Then a 550X One Week Later"
**Spine:** `video-creation/shorts/tutorial/render-assets/tut-94x-euphoria-impact.mp4` (28.22 s, 1080x1920, 25 fps source, 1 s GOP verified)
**Comp:** `TutEuphoriaImpact` @ 30 fps, 847 frames. **Seam measured 854** on 8 sampled frames (delta 63-221, identical row every time).

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
  trims it back: `TUT6_DURATION` = 847 frames @30 = 28.233 s, i.e. the full staged spine.

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
| 6 | **10.90-12.90** | **BADGE** (code) | "September and October were absolutely insane" | teal plate: SEPT + OCT / INSANE / "THOSE WERE THE DAYS" | code-drawn | — |
| 7 | 12.90-14.95 | BASE | "And then one week after we did" | the zoomed chart is the receipt; let it play | — | — |
| 8 | **14.95-16.70** | **BADGE** (code) | "this 94X" (+ the 0.86 s drum-roll after it) | yellow plate: **94X** / "THE CALL WE MADE" | code-drawn | — |
| 9 | 16.70-17.60 | BASE | (breath into the second number) | riser runs under it | — | — |
| 10 | **17.60-19.60** | **BADGE** (code) | "we did the 550X" | green plate: **550X** / "ONE WEEK LATER" | code-drawn | — |
| 11 | 19.60-20.20 | BASE | "on" (stretched) | — | — | — |
| 12 | **20.20-22.30** | **OVERLAY** | "on NYX on BNB again." | two neon rockets, the second higher and bigger with a longer trail ("again, but bigger"), transparent alpha, right-hand slot. `tIn` moved 20.00 -> 20.20 so its whoosh crests inside the measured 20.16-20.38 silence instead of on the stretched "on". | `broll-tut6-second-rocket.png` | none exists for NYX (see reference gate below) |
| 13 | **22.30-28.22** | **BASE, PROTECTED** | "And that's why CodeMonkey Mike has the greatest crypto community on the planet." | the Schwarzenegger soundboard drop, full-frame, **captions only** | — | — |

### Overlay placement slot (MEASURED, one fixed slot so nothing can ever collide)

`left 760, top 1040, width 300` -> **x 760-1060, y 1040-1340**, i.e. the dark shadowed
green-screen band to the right of Mike's head, in the FACE zone.

- Measured over each overlay's own window (4 sampled frames each): luma **11-22 / 255**, std **12-18**.
  A luminance-keyed neon graphic reads at maximum contrast there and hides nothing.
- **Not the content zone at all** (content zone ends at 854), so it cannot be read as content-zone b-roll.
- **Clear of the caption band**: captions are centred at `capY 890`; even a 2-line caption bottoms out
  around y 970, so the slot's top edge (1040) is >= 70 px clear.
- **Clear of the 240 px platform safe zone** (slot bottom 1340 vs 1680).
- Same slot every time = a deliberate "sticker slot" and a structural guarantee of zero overlap.

### Badge placement (MEASURED)

`top 560` (the shared `Badge` is centre-anchored) -> panel roughly **y 455-665**, which lands on the
CoinMarketCap **"CMC AI" question-chip row**. Measured std 25-26 / luma 244 there: it is flat white
UI, not data. The chart plot ends at y ~410 and the "Tutorial Markets" table starts at y ~600 with
its heading at 620; the badge's own box tops out above the plot and its bottom sits over the chip row.
Badge text stays inside the component's ~436 px text box (eliza's measured cap): longest lines are
"SEPT + OCT" (10 ch @60 px) and "550X" (4 ch @82 px), so nothing wraps.

### Collision matrix (contract item 7 / SKILL production rule 3)

Windows in time order: cover 0-0.033 | O1 1.10-3.50 | O2 6.20-8.40 | B1 10.90-12.90 |
B2 14.95-16.70 | B3 17.60-19.60 | O3 20.00-22.30. **No two windows touch** (smallest gap = 0.90 s,
B2 -> B3) and nothing starts before the cover frame ends, so no two graphics can ever share a frame.
The overlays and the badges are also in different bands (y 1040-1340 vs y 455-665) even in principle.

### Coverage arithmetic

| | seconds | % of 28.22 s | frame area covered | frame-seconds covered |
|---|---|---|---|---|
| full-screen b-roll | 0.00 | 0 % | — | 0 % |
| content-zone b-roll | 0.00 | 0 % | — | 0 % |
| transparent overlays (3) | 6.90 | 24.5 % | 300x300 = 4.3 % | 1.05 % |
| code-drawn badges (3) | 5.75 | 20.4 % | ~540x210 = 5.5 % | 1.11 % |
| **base fully unobstructed** | **15.57** | **55.2 %** | 100 % | — |

**Content zone visible and unobstructed: 100 % of the clip except the 5.75 s of badge chip-row.**

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
measured on this machine): `transition_rapid_whoosh` crests 0.15 s in (audible to 0.89) ·
`Soundjay_Impact_Main_01-short` 0.32 (to 0.62) · `TING` 0.81 (to 1.50) · `DING` 0.19 (to 1.16) ·
`Impact_Hit_01-2` 0.13 (to 6.11, so `dur` truncates it) · `Tension_Rise_Logo_Reveal_3` 3.77 (to 5.68).

| t | dur / vol | file | crest lands on | why |
|---|---|---|---|---|
| 0.00 | 1.00 / 0.24 | `sfx/transition_rapid_whoosh.mp3` | 0.15 | the frame-0 cover cut |
| 0.95 | 0.95 / 0.18 | `sfx/transition_rapid_whoosh.mp3` | 1.10 | sweeps into the O1 arrow |
| 4.40 | 0.70 / 0.24 | `sfx/Impacts/Soundjay_Impact_Main_01-short.wav` | 4.72 | IMPACT on "HOLY"; attack sits in the 4.46-4.72 gap and the SHORT variant's tail is gone by 5.02, before "crap" (5.28) |
| 5.39 | 1.60 / 0.16 | `sfx/TING SOUND EFFECT.mp3` | 6.20 | the euphoria burst O2, over the held vowel |
| 14.76 | 1.20 / 0.20 | `sfx/DING.mp3` | 14.95 | the 94X plate |
| 15.10 | 2.50 / 0.10 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | (build) | runs through the 0.86 s drum-roll and ENDS exactly on the 550X hit (17.60) |
| 17.47 | 1.80 / 0.26 | `sfx/Impacts/Impact_Hit_01-2.wav` | 17.60 | the CLIMAX: the 550X plate; truncated so the tail is gone before "on nyx" (19.52) |
| 20.05 | 0.95 / 0.20 | `sfx/transition_rapid_whoosh.mp3` | 20.20 | into the O3 rockets, crest inside the measured 20.16-20.38 silence |

**Nothing fires at or after 20.10.** Every cue is whisper-verified against an ENCODE-MATCHED control
(the bare spine through the same 48 kHz AAC chain) with short staggered windows, mixed OFFLINE so the
sweep costs zero renders (contract item 7a).

**The SEPTEMBER/OCTOBER badge is deliberately SILENT.** This clip has NO silence at all between
5.32 s and 14.00 s (8.68 s unbroken speech), so a cue there would necessarily sit on consonants; an
extra ding on a supporting plate is decoration, not punctuation (WHEN-TO-USE-IMPACTS.md: "avoid
overuse ... reserve them for the beats that actually matter"). The two cues that do sit inside that
window (4.40, 5.39) both land on sustained vowels and are the two quietest in the list.

## Reconciliation (contract item 4, zero orphans)

3 overlay beats -> 3 PNGs -> 3 `staticFile()` refs in `constants-tut-euphoria-impact.ts`, plus
`thumb-tut6.png`. Every `broll-tut6-*` / `thumb-tut6*` file in `render-assets/` is referenced, and
every ref exists on disk. Verified by `finalized_short_gate.py` (both directions) before the report.
