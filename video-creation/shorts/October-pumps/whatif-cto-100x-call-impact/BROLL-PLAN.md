# BROLL-PLAN — whatif-cto-100x-call-impact (variant: impact)

Batch `October-pumps`, clip #6. Base = `whatif-cto-100x-call-impact-final.mp4`
(1080x1920, 25 fps, **18.16 s video / 18.21 s audio**; FINAL, do NOT re-cut).
Comp runs at 30 fps / **544 frames** (18.133 s, just inside the video stream so there is no black
tail frame).

**Sibling relationship:** this is the IMPACT cut of clip #1 `whatif-cto-100x-call` (comp
`WhatifCto100xCall`, constants `constants-wcto.ts`). It shares source seconds with clip #1 BY DESIGN
and ships as its own short. Per the "no duplicate b-roll across same-topic shorts" HARD RULE every
image here is **newly generated into THIS clip's own `render-assets/`** with its own `-wcti-` filename
and a deliberately different composition/angle/palette from clip #1's `-wcto-` treatment of the same
concept. No `staticFile()` in this comp resolves into clip #1's folder.

**Measured geometry:** the base is ALREADY composited vertical. Row-mean gradient scan at
t = 1 / 5 / 9 / 13 / 17 s puts the hard screen-share/webcam divider on the same row on all five
frames: **y = 853/854** (gradient 186-191 grey levels, next-strongest row only 57). Content-zone
b-roll therefore covers 0..854. Caption centre at **y = 890** (below the seam, above his hairline
~y1050, nowhere near his eyes ~y1430).

## Concat joins (the clip is a 3-segment scatter-gather; both joins land on complete phrases)

Detected with `select='gt(scene,0.10)'`:

| join | t | scene score | what changes |
|---|---|---|---|
| #1 | **4.56** | 0.700 | segment A -> B. Content zone cuts from the off-message Trump-tariff X post to the DexScreener IF/WETH market-cap chart |
| #2 | **7.76** | 0.125 | segment B -> C. Same chart on both sides (cursor/txn rows jump); phrase boundary between "a five x from here." and "oh, forget about 20 million" |

Both joins are **masked by b-roll** in the plan below (beat 1 runs out exactly ON join #1; beat 2
straddles join #2), so neither reads as a glitch.

## Screen-share content map (frame-accurate)

| span | what is on screen | verdict |
|---|---|---|
| **0.00 - 4.56** | **OFF-MESSAGE: an unrelated Trump-tariff X post** (the same opener clip #1 carries) | cover 1.40-4.56 |
| 4.56 - 18.16 | **DexScreener IF/WETH MARKET CAP chart** (4.11-4.16M mcap, the big green ramp) beside the real verified `IF / WETH` panel with the **WHAT IF** banner, "Robinhood > Uniswap", price, liquidity, FDV, txns | this IS the receipt for "20 million / 100 million" - SHOW IT |

He is talking market cap the entire back 13.6 s and the market-cap chart is literally on screen, so
the back half is base by design. B-roll only takes the beats it earns.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **6.11 s / 18.16 s = 33.6 %** | ~30 % (band 25-35 %) OK |
| base showing | **12.05 s = 66.4 %** | ~70 % (band 65-75 %) OK |
| distinct images | **3** (+1 thumbnail background) | output of the budget, ~1 per 6.1 s |
| full-screen beats | **2** (hook / 100x climax) | 1-2 for an 18 s clip, FIRM cap 1-3 OK |
| max base stretch | 4.18 s (13.90 - 18.08) | deliberate, the mcap chart + the NFA badge |
| reuse within clip | none, every beat has its own asset | OK |
| reuse from clip #1 | none, all 4 images newly generated, new filenames, new treatments | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.40 | 1.40 | **BASE** | "so when it comes to what if, what if is now" | open on Mike + the screen-share (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.40 | 4.56 | 3.16 | **full** | "so what if it's a **cto** right now?" ("cto" at 3.22, "now?" at 4.10) | HOOK. A vast derelict night hangar, one abandoned control podium alone under a single cone of light, a tide of faceless silhouettes climbing the stairway up to it from the dark floor below, teal floodlights raking across them, cold blue smoke. Runs out exactly ON concat join #1 so the splice is masked | `broll-wcti-hook-takeover.png` |
| - | 4.56 | 6.75 | 2.19 | **BASE** | "it could go in the short term to 20 million." | the DexScreener IF/WETH **market-cap** chart is exactly what he is naming, plus BADGE `20M / SHORT TERM` 5.10-6.45 | - |
| 2 | 6.75 | 8.05 | 1.30 | content | "we're talking about **a five x** from here." / "oh, forget about" | five colossal vertical beams of green light rising out of a black fog plain in ascending height, a tiny faceless silhouette dwarfed at the base looking up. Straddles concat join #2 (7.76) so the splice is masked | `broll-wcti-5x-beams.png` |
| - | 8.05 | 12.25 | 4.20 | **BASE** | "20 million. it could go to 100 million or make a, we..." | the mcap chart AGAIN carries this: he is calling 100 million while the chart reads ~4.1M. Deliberate base, riser building underneath | - |
| 3 | 12.25 | 13.90 | 1.65 | **full** | "we could even be like **a hundred x** from here." (CLIMAX, "hundred" at 12.72) | an enormous blank glowing coin punching straight up through a ceiling of storm cloud into black space on a corkscrew of green energy, light bending around it, faceless silhouettes tiny on a dark ridge far below | `broll-wcti-100x-breakthrough.png` |
| - | 13.90 | 18.13 | 4.23 | **BASE** | "not financial advice. never financial advice in this video man. are you out of your mind?" | back on Mike + the mcap chart, plus BADGE `NOT FINANCIAL / ADVICE` 14.60-17.20. The loop frame is Mike's face, deliberate | - |

**Full-screen adjacency (SKILL production rule 4):** the 2 full-screens are 7.7 s apart, so no
full-to-full flash exists. Every b-roll-to-base gap is >= 2.19 s, so there is no sub-1.5 s base flash
anywhere. No two b-roll beats are adjacent, so each fades to/from the base over 0.12 s.

## Frame-0 thumbnail

`thumbnail-wcti.png` = generated background (a colossal staircase of green glowing market candles
climbing out of black fog toward a deliberately EMPTY dark upper sky, a small faceless silhouette at
the bottom looking up) with the hook title drawn in CODE on top, never baked into the art:

- title `FORGET / 20 MILLION / WHATIF COULD / 100X`, chip `IT IS A CTO NOW` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest badge `tIn` is 5.10 s.
- No em dashes anywhere on screen. No `@mikeneder` anywhere.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, both at `top: 300` (content zone) while captions live at `y 890`. Each states
something the captions do NOT, and each sits over a BASE stretch, never over a b-roll beat.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 5.10 | 6.45 | teal `#00e5ff` | `20M` / `SHORT TERM` / `FROM 4.1M TODAY` | BASE 4.56-6.75 |
| 14.60 | 17.20 | yellow `#ffe600` | `NOT FINANCIAL` / `ADVICE` / `CONVICTION, NOT A PRICE TARGET` | BASE 13.90-18.13 |

Only 2 badges, 8.15 s apart, so they can never share a frame. Badge 1's render window (tIn-0.1 to
tOut+0.1 = 5.00-6.55) ends 0.20 s before beat 2 starts, and badge 2's (14.50-17.30) starts 0.60 s
after beat 3 ends, so neither ever shares a frame with a b-roll image either. Both start long after
the frame-0 thumb. The sub of badge 1 (`FROM 4.1M TODAY`) is read off the DexScreener panel in the
base video, a fact the captions never state.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own MEASURED peak/attack landing on the beat, not the file start. Envelopes
re-measured for THIS build at 0.2 s RMS on this machine: `transition_rapid_whoosh` peaks 0.20 s in,
`Cinematic Whoosh 02` 0.80 s, `Impact_3` 0.40 s, `Cash Register` attacks/peaks 0.20 s,
`Tension_Rise_Logo_Reveal_2` peaks 4.60 s, `Soundjay_Impact_Main_01` 0.20 s, `Boom - Big Reveal`
0.00 s, `dramatic-shocked-sfxshocked` peaks 1.00 s.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.20 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 1.40 | 0.60 | `sfx/Cinematic Whoosh 02.wav` | 0.52 | sweeps INTO the HOOK full-screen |
| 3.22 | 2.82 | `sfx/Impacts/Impact_3.wav` | 0.42 | lands on the word "cto" |
| 4.56 | 4.36 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | hook full-screen OUT, masks concat join #1 |
| 6.76 | 6.56 | `sfx/Cash Register.mp3` | 0.74 | kaching on "five x" (quiet file at -24.8 dB, vol raised) |
| 12.25 | 7.65 | `sfx/risers/Tension_Rise_Logo_Reveal_2.wav` | 0.24 | RISER builds through "forget about 20 million... 100 million" INTO the 100x |
| 12.25 | 12.05 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.32 | the cut to the CLIMAX full-screen, where the riser crests |
| 12.72 | 12.72 | `sfx/Boom - Big Reveal.wav` | 0.55 | lands ON "hundred" (the 100x): the BIGGEST hit of the short, loudest file in the set (-2.8 dB) |
| 17.24 | 16.24 | `sfx/ding/dramatic-shocked-sfxshocked.mp3` | 0.10 | "are you out of your mind?" |

9 events / 8 distinct files. Whoosh on the thumbnail cut and on both hook-full-screen edges, one
riser building into the climax impact, and the biggest impact ON the 100x, exactly as required.

**VO-masking fix (found by QA on the first HQ render, do not undo):** at the originally planned
`0.44` / `0.38` the last two cues MASKED the voice. Whisper on the shipped render transcribed the
closing punchline as "even you are here, my" while Whisper on the SPINE ALONE transcribed "are you
out of your mind" perfectly, and "we could even be" degraded under the climax impact. Volumes were
then swept against Whisper on spine+SFX mixes: the shock sting only stops masking at **0.10** (0.15
and 0.20 still masked) and the climax impact stops masking at **0.32** (0.24 buys nothing more).
Both were lowered and the short was RE-RENDERED. The Boom on "hundred" was never touched.

## Reference-image gate

Named projects/coins in this clip: **WHATIF ($IF)** only. Live `ls` of
`schedule-tweets/images/reference/` run during THIS build: DogInMe, ElizaOS-ai16z-2, ElizaOS-ai16z,
LAB, bittensor-tao, bobo, carousels, housecoin, kappy, kaspa-logo, kasy, kroak, linea, michael-saylor,
nacho, slippy, toshi, troll, velvet. **No reference exists for WHATIF**, so generic treatment is
correct and NO fake brand mark may be invented (a carousel slide in this same batch had to be
regenerated because a coin's backwards K read as Kaspa). The clip still carries WHATIF's real
branding through the BASE video itself: the verified `IF / WETH` DexScreener panel with the **WHAT
IF** banner and the "Robinhood > Uniswap" route is on screen for 13.6 s of the 18.2 s. Gate result:
CLEAN, generic treatment.

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (no Bitcoin symbol, no Ethereum diamond, no invented WHATIF
mark), every coin BLANK and generic (no letter glyphs of any kind on a coin face), no real-person
faces, crowds are faceless silhouettes, and no lettering / words / numbers anywhere in the art (all
text is code-drawn). Every generated image is visually inspected before the render.
