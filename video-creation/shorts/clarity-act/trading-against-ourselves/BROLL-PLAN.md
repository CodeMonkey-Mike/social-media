# BROLL-PLAN — trading-against-ourselves (variant: full)

Batch `clarity-act`, clip #2. Base = `trading-against-ourselves-tightened-desilenced.mp4`
(1080x1920, 25 fps, **82.60 s**). Comp runs at 30 fps / 2477 frames (82.567 s, just inside the clip).

**Measured geometry (re-measured on THIS clip, not inherited):** row-mean gradient scan at
t = 2 / 12 / 22 / 35 / 50 / 65 / 80 s. All seven frames put the hard screen-share/webcam divider at the
same place (peak |d(rowmean)| between row 853 and 854, magnitude 99-189, next-strongest edge 17-33).
So **seam = 854**, identical to clip #1 of this batch (same livestream master), now confirmed
independently. Content-zone b-roll covers 0..854. Caption centre at **y = 890** (below the seam, above
Mike's hairline ~y1100, nowhere near his eyes ~y1400).

## What the screen-share actually shows (measured, 2 fps content-zone scene-change scan)

| span | screen-share | on-message? |
|---|---|---|
| 0.00-21.00 | STATIC CoinDesk article, "Trump's crypto riches loom over Clarity Act talks" | **No** — this clip is about Robinhood-chain meme structure, not the Clarity Act |
| 21.00-58.50 | **CASHCAT/WETH DexScreener chart** (1h, market cap; the pump to ~$217M, the round trip to ~$73M) + the live transactions table, Mike's cursor moving over it | **YES, strongly** — he is pointing at the exact top and bottom he is describing |
| 58.50-70.50 | X/Twitter feed being scrolled (a Wojak meme post) | Marginal, and visually noisy |
| 70.50-82.60 | back to the DexScreener chart | Yes |

This drives the whole plan: **b-roll earns its place in 0-21 and 58.5-70.5; the chart carries
21-58.5 and 70.5-82.6 as BASE.** Per the delegation and the SKILL, the chart-pointing beats are the
visual, so they are deliberately left uncovered.

## Coverage budget (canonical rule: SKILL "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **23.50 s / 82.60 s = 28.4 %** | ~30 % (band 25-35 %) OK |
| base showing | **59.10 s = 71.6 %** | ~70 % (band 65-75 %) OK |
| distinct images | **9** (+1 thumbnail bg) | output of the budget, ~2.6 s per beat |
| full-screen beats | **3** (hook / burn climax / thesis climax) | 1-3 FIRM OK |
| longest full-screen | 2.80 s | under the ~3 s face-visible rule OK |
| max base gap | 14.00 s (16.20-30.20: 3.1 s of static article carried by a badge, then the on-message chart) | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.30 | 1.30 | **BASE** | "i'm over here with a lot..." | open on Mike + the screen-share (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.30 | 4.10 | 2.80 | **full** | "...a lot of **skepticism** with these robinhood memes right now" (HOOK) | lone faceless silhouette, arms crossed, facing a towering wall of screens and blank tokens lit acid-lime | `broll-tao-skepticism.png` |
| - | 4.10 | 6.30 | 2.20 | **BASE** | "good, i keep saying it's only us" | base | - |
| 2 | 6.30 | 8.90 | 2.60 | content | "**trading against ourselves** with these robinhood memes" | two identical faceless silhouettes passing ONE blank coin back and forth inside a closed lime loop, empty room around them | `broll-tao-against-ourselves.png` |
| - | 8.90 | 13.60 | 4.70 | **BASE** | "right, with any new memes, it doesn't have to be robinhood, right? and because majority" | base | - |
| 3 | 13.60 | 16.20 | 2.60 | content | "of us have all **checked out**" (14.32-14.58) | colossal arena of empty seats in the dark, one lone lit screen at the centre of the floor | `broll-tao-checked-out.png` |
| - | 16.20 | 30.20 | 14.00 | **BASE** | "i don't know what that percentage is, 90%, 70%, but well over 50%." + BADGE 19.30-21.00 / "the first meme to really really make a pump is cash cat. and all these people up here, right? like all these people who were buying up here" | 16.2-21.0 static article carried by the badge; **21.0 the screen cuts to the CASHCAT chart and he points at the top he is describing** - that IS the visual, no b-roll | - |
| 4 | 30.20 | 32.60 | 2.40 | content | "they've already been **burned**. like, oh, i'm gonna get in on it" | faceless crowd stranded on the crumbling peak of a lime candle mountain, the summit falling away into embers | `broll-tao-bought-the-top.png` |
| - | 32.60 | 39.50 | 6.90 | **BASE** | "i'm gonna get in on it. and they're buying up here. well, everybody down here who bought down here is selling up here" (PEAK 2 setup) | pure chart-pointing: he traces "down here" and "up here" on the real chart. Covering this would hide the argument | - |
| 5 | 39.50 | 42.30 | 2.80 | **full** | "...and they get em **burned**. so there's a whole ton of people getting **burned** at this point" (PEAK 2 / CLIMAX) | cascade of faceless silhouettes tumbling down the collapsing right side of a candle chart in a wave of fire, while a group at the bottom-left walks away with blank coins | `broll-tao-burn-cascade.png` |
| - | 42.30 | 55.20 | 12.90 | **BASE** | "and they're down. they've probably checked out... i'm done with robinhood memes... this is one up to 220 million... not gonna rotate. they've just got burned." + BADGE 49.20-51.20 | the chart on screen literally reads 217.34M at the peak and 73.71M now, i.e. the $220M he cites is ON SCREEN. Base earns it | - |
| 6 | 55.20 | 57.90 | 2.70 | content | "there's **less people** that are absorbing the **hype** about robinhood memes" | a lime pulse radiating out, only a thin inner ring of silhouettes left to absorb it, the outer rings faded to grey ghosts | `broll-tao-less-absorbing.png` |
| - | 57.90 | 62.20 | 4.30 | **BASE** | "the problem here is like again, it's like, we're just trading against ourselves here?" | base (the X feed) | - |
| 7 | 62.20 | 64.90 | 2.70 | **full** | "**there's no new retail.**" (PEAK 1 / CLIMAX) | a huge shut gate/turnstile into a glowing arena, the approach road behind it totally empty into fog; inside, a small ring still trading under lime light | `broll-tao-no-new-retail.png` |
| 8 | 64.90 | 67.10 | 2.20 | content | "more than half of everybody in crypto is **checked out** until **october**" | HARD CUT off beat 7 (adjacent). Dormant frozen machinery and dead screens under a blank autumn-orange horizon, a still line of silhouettes facing that distant light | `broll-tao-until-october.png` |
| - | 67.10 | 78.60 | 11.50 | **BASE** | "we just don't know... we're just buying blind right now. wait six months and see what happens. which could work out, spend $100 on 10 different memes and you lose money on nine of them" + BADGE 73.40-75.40 | 70.5 the screen cuts back to the chart | - |
| 9 | 78.60 | 81.30 | 2.70 | content | "but all it takes is **one** of them to do like a **thousand x**" | ten blank coins, nine cracked and grey, ONE blazing lime and launching up a vertical beam of light | `broll-tao-one-in-ten.png` |
| - | 81.30 | 82.57 | 1.27 | **BASE** | "or something or even a hundred x." | close on Mike (his face is the loop frame, deliberate) | - |

**Full-screen adjacency check:** the 3 full-screens are 1.30-4.10, 39.50-42.30, 62.20-64.90. Nearest
neighbouring b-roll edges are 4.10 -> 6.30 (2.20 s base), 42.30 -> 55.20 (12.90 s), 57.90 -> 62.20
(4.30 s), and 64.90 which is EXACTLY adjacent to beat 8 so `BrollLayer` hard-cuts (gap 0 <= 0.18 s).
No sub-1 s base flash anywhere; every deliberate base gap is >= 1.5 s.

**Duplicate-b-roll check vs clip #1 (`october-not-allowed-red`) of the same batch:** the only shared
concept is "checked out", and it gets a genuinely different visual treatment here (a vast arena of
empty seats, cold blue-grey, no people at all) versus clip #1's abandoned trading floor with
silhouettes walking out. Palette also differs on purpose: this clip is acid-lime / Robinhood yellow,
clip #1 was green/red October. No file is shared between the two clips.

## Content-zone reframe (asset prep, no regeneration)

The generator returns 941x1672 portrait art, but a `content`-mode beat renders into a 1080x854 box
with `objectFit: cover`, which shows only the middle 44.6 % of the source (rows 463-1208). Simulated
every content-mode crop before rendering; four of the six framed their subject inside that band, two
did not:

| asset | problem | fix |
|---|---|---|
| `broll-tao-bought-the-top.png` | the crowd stranded on the crumbling peak sits at rows 134-300, above the visible band | cropped to `(0, 40, 941, 784)` = 941x744, exactly the content-zone aspect (1.2646) |
| `broll-tao-one-in-ten.png` | the launching coin is at rows 167-351 and the nine cracked coins at 1103-1471; the band showed only bare beam | cropped to `(0, 760, 941, 1504)` = 941x744, keeping all nine cracked coins plus the light column rocketing up out of frame |

This is a mechanical reframe of an already-approved image, NOT a regeneration and NOT a remap:
filenames and beat mapping are unchanged, so the plan/comp/disk manifest still reconciles exactly.
Untouched originals are archived outside the render tree.

## Frame-0 thumbnail

`thumbnail-tao.png` = generated background (a closed ring of faceless silhouettes passing one blank
coin around, inside a vast empty stadium of dark unoccupied seats, acid-lime rim light, upper third
deliberately empty and dark) with the hook title drawn in CODE on top, never baked into the art:

- title `WE'RE ONLY / TRADING AGAINST / OURSELVES`, chip `NO NEW RETAIL LEFT` (red).
- ONE frame only (frame 0). Base video from frame 1. No badge/overlay may start under it (first badge
  tIn = 19.30). No em dashes.

## Overlays / badges (never collide in time OR space)

| tIn | tOut | band | content | sits over |
|---|---|---|---|---|
| 19.30 | 21.00 | y300 (upper content zone) | `HALF THE MARKET` / `IS NOT EVEN LOOKING` | BASE, the static CoinDesk article (nothing worth seeing behind it) |
| 49.20 | 51.20 | y680 (lower content zone) | `ROUND TRIP` / `220M DOWN TO 73M` | BASE, the CASHCAT chart. y680 puts it over the transactions table, NOT over the candles he is pointing at |
| 73.40 | 75.40 | y300 (upper content zone) | `TEN LOTTERY TICKETS` / `THE ONLY PLAY LEFT` | BASE, the chart again, but he is on the verdict and not pointing, so the upper band is free |

Each badge states something the captions do NOT (the implication, the round-trip numbers read off the
chart, the framing of the verdict). No two badges share a time window (28.2 s and 22.2 s apart), none
overlaps a b-roll beat, and the first starts 19.30 s after the frame-0 thumb.

**Measured (not assumed) on the render.** The badge plate is positioned `left:50%` +
`translateX(-50%)`, so its text column is only ~436 px wide and `line1` soft-wraps, making the box far
taller than the nominal 196 px. A border-run scan of the first full render gave badge 1 = rows
100-499, badge 2 = 540-819, badge 3 = 500-859, against caption ink at rows 865-914. Badge 3 cleared
the captions by just **6 px**, a near-collision, so it was moved from y680 to y300 (rows 120-480,
385 px of clearance) and the clip was re-rendered. Badge 2 stays low by design, 46 px clear, because
its whole point is to leave the $220M chart peak visible above it.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own PEAK/ATTACK landing on the beat, not the file start (envelopes measured at 0.2 s
RMS on the actual files used).

| lands on | fires at | file | vol | why |
|---|---|---|---|---|
| 0.10 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 1.30 | 0.50 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | sweeps INTO the HOOK full-screen |
| 6.30 | 6.20 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the "trading against ourselves" cutaway |
| 14.32 | 13.60 | `sfx/TING SOUND EFFECT.mp3` | 0.50 | attacks on the word "checked out" |
| 35.00 | 35.00 | `sfx/risers/Edgy_Riser.wav` | 0.30 | riser BUILDS through the burn cascade into the impact |
| 39.50 | 39.50 | `sfx/Impacts/Impact_3.wav` | 0.46 | hard cut to the burn-cascade full-screen (PEAK 2) |
| 40.90 | 40.90 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.50 | "a whole ton of people getting burned" |
| 55.20 | 55.10 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the "less people" cutaway |
| 62.20 | 61.60 | `sfx/Cinematic Whoosh 06.wav` | 0.78 | sweeps INTO the thesis climax (this file is ~8 dB quieter than Whoosh 02) |
| 62.52 | 62.52 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.42 | lands on "no new retail" (PEAK 1) |
| 64.90 | 64.90 | `sfx/ding/sudden-shock.mp3` | 0.40 | the hard cut into "checked out until october" |
| 78.86 | 78.50 | `sfx/Cash Register.mp3` | 0.70 | kaching on "all it takes is ONE" |

13 events (a second rapid whoosh was added at 78.42 into the lottery-ticket close), 9 distinct files.

**Verified on the SHIPPED render** by aligned subtraction of the source audio (2048-sample lag
correction, per-100 ms gain fit). Codec residual floor -58.1 dB; every one of the 13 cues measures
between **+24.3 and +38.0 dB above that floor**, i.e. all 13 are genuinely audible under the VO, and
none is loud enough to clip (integrated -17.1 LUFS, true peak -2.5 dBFS, flat factor 0).

## Verification on the shipped render

| check | result |
|---|---|
| finalized-short gate | PASS (thumbnail + 9 b-roll + 11 sfx refs, zero missing) |
| manifest reconcile | plan 10 = comp 10 = disk 10, zero orphans in either direction |
| MEASURED b-roll coverage (4 fps render-vs-source diff, content zone 0-854 and face zone 1000-1850) | **23.00 s real b-roll = 27.9 %**, base showing 72.1 % (two extra 0.25-0.50 s blips the detector flagged at 19.5 and 60.8 are the badge plate and a fast X-feed scroll, not b-roll) |
| beat boundaries | all 9 beats land within one sample of plan; the 62.20-64.90 full -> 64.90-67.10 content pair hard-cuts with ZERO base frames between |
| full-screen count / length | 3 (2.50 s, 2.75 s, 2.75 s) - the FIRM 1-3 cap, all under the ~3 s face-visible limit |
| frame-0 cover | frame 0 = the designed cover (mean abs diff 25.9 vs the art), frame 1 = base video (128.5). ONE frame, no held card |
| badge vs caption collision | badge rows 100-499 / 540-819 / 120-479 vs caption ink 865-914 -> clearances 366 / 59 / 386 px; edge frames at every tIn-0.05 and tOut+0.05 show no badge |
| blackdetect (d=0.15, pix_th=0.10) | no black frames |
| audio | integrated -17.1 LUFS, true peak -2.5 dBFS, LRA 3.6 LU, zero clipped samples |
| whisper-verify vs shipped render | word similarity **0.889**; onset drift median -0.06 s, p05 -0.14, p95 +0.30, max late +0.46 s |
| em dashes on screen | none in any of the 108 on-screen strings |

## Reference-image gate

Named projects/coins in this clip: **Robinhood / the Robinhood chain**, and **Cash Cat**.
LIVE `ls schedule-tweets/images/reference/` run this build (2026-07-20): `DogInMe.png`,
`ElizaOS-ai16z-2.png`, `ElizaOS-ai16z.webp`, `LAB.png`, `bittensor-tao.png`, `bobo.png`, `carousels/`,
`housecoin.webp`, `kappy.png`, `kaspa-logo.png`, `kasy.png`, `kroak.png`, `linea.png`,
`michael-saylor.png`, `nacho.jpg`, `slippy.png`, `toshi.png`, `troll.png`, `velvet.png`.

**No Cash Cat reference and no Robinhood reference exist on disk.** Per the SKILL, neither mark may be
invented, so:
- **Cash Cat is never depicted in generated art.** Its beat (21.0-30.2) is carried by the BASE video,
  which is the REAL CASHCAT DexScreener page including the real token avatar and the real chart. That
  is the correct branding and it costs nothing.
- **Robinhood is never depicted as a logo.** The Robinhood-chain association is carried only by
  colour: neon lime (approx `#CCFF00`) and acid yellow. **Never teal/cyan** - that is Kaspa's
  signature and would misread as Kaspa (persona rule "Robinhood coin color").

Gate result: CLEAN (both named projects handled without an invented mark).

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (no Bitcoin symbol, no Ethereum diamond/octahedron, no exchange
or brand logo), any coin is BLANK and generic, no real-person faces, every crowd/figure is a faceless
silhouette, no lettering/words/numbers anywhere in the art (all text is code-drawn in Remotion).
Palette is acid-lime/yellow/ember, never Kaspa teal. Editorially the imagery attacks MARKET STRUCTURE
(a closed loop with no new entrants), never "this specific coin is a scam" - no rug, no scam, no
crime imagery. Every image is visually inspected before render.
