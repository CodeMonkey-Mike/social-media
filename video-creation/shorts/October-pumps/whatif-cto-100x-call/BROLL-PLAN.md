# BROLL-PLAN — whatif-cto-100x-call (variant: full)

Batch `October-pumps`, clip #1. Base = `whatif-cto-100x-call-final.mp4`
(1080x1920, 25 fps, **95.76 s**, output of raw cut -> tighten -> desilence -> filler removal; FINAL, not re-cut).
Comp runs at 30 fps / **2872 frames** (95.733 s, just inside the clip so there is no black tail frame).

**Measured geometry:** the base is ALREADY composited vertical. Row-mean gradient scan at
t = 2 / 20 / 45 / 70 / 92 s puts the hard screen-share/webcam divider at the same row on all five
frames: **y = 853/854**. Content-zone b-roll therefore covers 0..854. Caption centre at **y = 890**
(below the seam, above Mike's hairline ~y1050, nowhere near his eyes ~y1430).

## Screen-share content map (frame-accurate, decoded at 25 fps)

The content zone is mostly the receipt of the clip (the verified WHATIF X profile and its DexScreener
market-cap chart), so most of the runtime deliberately shows it. The exceptions are mapped and covered:

| span | what is on screen |
|---|---|
| **0.00 - 9.92** | **OFF-MESSAGE: an unrelated Trump-tariff X post** (caught in chunk QA, not in the 1 fps pre-scan). The only on-message element is the live chat line "What IF is a cto now and has updated x profile and telegram group. very bullish". Covered 1.30-9.20 by the hook full-screen + the launcher cutaway + the CTO badge |
| 9.92 - 10.12 | blank white (page load) |
| 10.12 - 15.16 | DexScreener IF/WETH market-cap chart |
| **15.16 - 17.32** | **DEAD: blank white then a black X loading screen (2.16 s of nothing)** |
| 17.32 - 23.80 | the `@WhatIFonHOOD` X profile (verified, "What $IF on Robinhood Chain") |
| 23.80 - 27.56 | DexScreener IF/WETH chart |
| 27.56 - 33.04 | the `@WhatIFonHOOD` X profile again |
| **33.04 - 34.48** | **DEAD: blank white then black (1.44 s of nothing)** |
| 34.48 - 80.16 | DexScreener IF/WETH chart, the big green ramp to ~4.1M mcap |
| 80.32 - 95.76 | DexScreener **CASHCAT**/WETH chart (exactly the coin he names at 88.5 s) |

Both DEAD windows and the OFF-MESSAGE opener are covered below; the valuable windows are left showing.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **29.60 s / 95.76 s = 30.9 %** | ~30 % (band 25-35 %) OK |
| base showing | **66.16 s = 69.1 %** | ~70 % (band 65-75 %) OK |
| distinct images | **11** (+1 thumbnail background) | output of the budget, ~1 per 8.7 s, avg 2.69 s per beat |
| full-screen beats | **3** (hook / "it's a go" turn / 100x climax) | 1-3 FIRM, OK |
| max base gap | 20.06 s (75.70 - 95.76, carried by 2 badges + the on-message CashCat chart) | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.30 | 1.30 | **BASE** | "so when it comes to what if, what if is now" | open on Mike + the screen-share (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.30 | 4.30 | 3.00 | **full** | "so what if it's a **cto** right now?" (HOOK, "cto" at 3.24, "now?" at 4.12) | abandoned night trading command centre, one empty chair spun away from dead monitors, a faceless crowd flooding in and taking the controls, green light rising | `broll-wcto-hook.png` |
| 2 | 4.30 | 6.30 | 2.00 | content | "so the **original person** that launched the actual tokens" | a lone hooded faceless figure walking away into fog down a dark corridor, leaving an abandoned launch console and a blank glowing coin behind (hard-cut from the hook, adjacent) | `broll-wcto-launcher-left.png` |
| - | 6.30 | 15.20 | 8.90 | **BASE** | "was just somebody who just launched it and they didn't want to do anything with it. because my grief with what if was that it was just linked to a twitter community." | BADGE `CTO / TAKEOVER` 6.55-9.20 covers the rest of the off-topic post; the IF chart from 10.12 is on-message | - |
| 3 | 15.20 | 18.20 | 3.00 | content | "it would constantly, like **every 12 hours**, switch to a new twitter community" | blank glowing profile cards spinning on a carousel in a rain-slick alley, each dissolving into the next, ghost clock face behind (covers the 15.16-17.32 DEAD window) | `broll-wcto-rotating-links.png` |
| 4 | 18.20 | 20.90 | 2.70 | content | "i was like, this is **crazy shady**" ("shady" at 20.02) | film-noir alley, hooded faceless figure swapping two identical blank masks, red warning glow, rain (hard-cut from beat 3, adjacent) | `broll-wcto-shady.png` |
| - | 20.90 | 27.00 | 6.10 | **BASE** | "and that's the only thing that prevented me from buying it. other than that the concept behind it is pretty good. what if?" | X profile / IF chart | - |
| 5 | 27.00 | 29.60 | 2.60 | content | "it has some good potential just because of **the meme itself**" | an enormous orb of idea-light igniting in a black void, faceless silhouettes below looking up | `broll-wcto-meme-idea.png` |
| - | 29.60 | 33.10 | 3.50 | **BASE** | "surprise, nobody ever thought of it before. but yeah, it makes sense if it's a cto." | X profile | - |
| 6 | 33.10 | 36.30 | 3.20 | **full** | "then they got a good website. **so now it's a go on this, it's a go.**" (MAJOR TRANSITION, the turn from shady past to bullish present) | mission control: a wall of red status lights flipping to blazing green, faceless operators rising at their consoles (covers the 33.04-34.48 DEAD window) | `broll-wcto-its-a-go.png` |
| - | 36.30 | 40.00 | 3.70 | **BASE** | "i think where the community is being drawn around it, right? everybody, all the crypto influencers," | IF chart | - |
| 7 | 40.00 | 42.60 | 2.60 | content | "everybody's **rallying the communities** around it" | night aerial, thousands of torch lights streaming in from every direction and converging on one teal-green point | `broll-wcto-rally.png` |
| - | 42.60 | 48.10 | 5.50 | **BASE** | "i think just because of that it's got some good strength. it could go in the short term to 20 million or something like that." | IF chart (he is talking market cap, the chart IS the visual) | - |
| 8 | 48.10 | 50.60 | 2.50 | content | "we're talking about a **5x** from here" ("5x" at 48.62) | five colossal glowing green glass steps ascending out of black fog, a tiny silhouette at the bottom | `broll-wcto-5x.png` |
| - | 50.60 | 60.20 | 9.60 | **BASE** | "a scenario where we really do get a new bottom in the few weeks in august and then the bulls start to run in the beginning of september" | IF chart + BADGE `THE SETUP` 53.40-56.20 | - |
| 9 | 60.20 | 62.80 | 2.60 | content | "everything is like **flying in october**, the opposite of what the four year cycle **zombies** are expecting" | skyline of colossal green candle towers erupting upward, a fog-bound horde of faceless silhouettes below facing the wrong way | `broll-wcto-october-flying.png` |
| - | 62.80 | 70.30 | 7.50 | **BASE** | "that's just a couple of months away, right? this thing is going to be around. and what happens with this?" | IF chart | - |
| 10 | 70.30 | 72.90 | 2.60 | content | "forget about 20 million, it could go to **100 million**" | vault chamber, a small dull blank coin dwarfed by an enormous blank glowing coin monolith | `broll-wcto-100-million.png` |
| 11 | 72.90 | 75.70 | 2.80 | **full** | "or maybe it could even be like **100x from here**" (CLIMAX, "100x" at 74.24) | a colossal blank coin blasting vertically off a shattered planet surface on a pillar of white-green fire, shockwave rings (hard-cut from beat 10, adjacent) | `broll-wcto-100x-climax.png` |
| - | 75.70 | 95.76 | 20.06 | **BASE** | "not financial advice. never financial advice in this video man. are you out of your mind? ... if there's anything secondary to cashcat to be enlisted on robinhood, i think whatif will make it. we're talking an extraordinarily high market cap." | the CASHCAT DexScreener chart is on screen from 80.32 and is EXACTLY what he is talking about, so this closes on base by design + BADGES `NOT FINANCIAL ADVICE` 78.60-81.20 and `ROBINHOOD` 88.60-91.40. The loop frame is Mike's face, deliberate | - |

**Full-screen adjacency (SKILL production rule 4):** the 3 full-screens are 29 s and 37 s apart, so no
full-to-full flash exists. Beats 1 -> 2, 3 -> 4 and 10 -> 11 are butt-joined (gap 0.00 s) so `BrollLayer`
hard-cuts instead of fading through the base. Every other b-roll-to-base gap is >= 3.50 s, so there is no
sub-1 s base flash anywhere.

## Frame-0 thumbnail

`thumbnail-wcto.png` = generated background (green candle tower erupting out of a cracked black
landscape with a faceless crowd at its base; upper half deliberately empty dark sky) with the hook
title drawn in CODE on top, never baked into the art:

- title `WHATIF COULD BE / A 100X / FROM HERE`, chip `IT IS A CTO NOW` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest badge `tIn` is 6.40 s.
- No em dashes anywhere on screen.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, all at `top: 300` (content zone) while captions live at `y 890`. Each states
something the captions do NOT, and each sits over a BASE stretch, never over a b-roll beat.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 6.55 | 9.20 | teal | `CTO` / `TAKEOVER` / `THE LAUNCHER WALKED AWAY` | BASE 6.30-15.20 |
| 53.40 | 56.20 | green | `THE SETUP` / `AUG BOTTOM, SEP BULLS, OCT FLYING` | BASE 50.60-60.20 |
| 78.60 | 81.20 | yellow | `NOT FINANCIAL` / `ADVICE` / `JUST A GUY WITH CONVICTION` | BASE 75.70-95.76 |
| 88.60 | 91.40 | green | `ROBINHOOD` / `THE LISTING KICKER` | BASE 75.70-95.76 |

Time gaps between consecutive badges: 44.2 s, 22.4 s, 7.4 s. The first badge starts 0.25 s after beat 2
ends, so it never shares a frame with a b-roll image either. No two are ever on screen together, and
none overlaps a b-roll beat.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own measured PEAK/ATTACK landing on the beat, not the file start. Envelopes measured
here at 0.2 s RMS on this machine: `transition_rapid_whoosh` peaks 0.20 s in, `Cinematic Whoosh 02`
0.80 s, `Cinematic Whoosh 06` 0.60 s, `Edgy_Riser` 5.00 s, `Tension_Rise_Logo_Reveal_2` 4.60 s,
`TING` 0.80 s, `Cash Register` attacks 0.20 s, `sudden-shock` 0.20 s, `dramatic-shocked` 1.00 s,
`Impact_3` 0.40 s, `Boom - Big Reveal` and `Impact_Hit_01-2` 0.00 s, `Soundjay_Impact_Main_01` 0.20 s.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.20 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 1.30 | 0.50 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | sweeps INTO the HOOK full-screen |
| 3.30 | 2.90 | `sfx/Impacts/Impact_3.wav` | 0.42 | lands on the word "cto" |
| 4.30 | 4.10 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | the hard cut from the hook into the launcher cutaway |
| 15.20 | 15.00 | `sfx/transition_rapid_whoosh.mp3` | 0.40 | into the rotating-communities cutaway |
| 18.20 | 17.60 | `sfx/Cinematic Whoosh 06.wav` | 0.78 | the hard cut to the "shady" beat (quiet file, vol raised) |
| 20.02 | 19.82 | `sfx/ding/sudden-shock.mp3` | 0.40 | lands on the word "shady" |
| 28.10-33.10 | 28.10 | `sfx/risers/Edgy_Riser.wav` | 0.28 | riser BUILDS INTO the "it's a go" turn |
| 33.10 | 33.10 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.46 | hard cut to the "it's a go" full-screen |
| 36.54 | 35.74 | `sfx/TING SOUND EFFECT.mp3` | 0.50 | bell on the second "it's a go" |
| 48.62 | 48.42 | `sfx/Cash Register.mp3` | 0.72 | kaching on "5x" |
| 60.20 | 60.00 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the October-flying cutaway |
| 68.30-72.90 | 68.30 | `sfx/risers/Tension_Rise_Logo_Reveal_2.wav` | 0.26 | riser BUILDS INTO the 100x climax |
| 72.90 | 72.70 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.44 | hard cut to the CLIMAX full-screen |
| 74.24 | 74.24 | `sfx/Boom - Big Reveal.wav` | 0.50 | lands on "100x", the biggest hit of the short |
| 78.64 | 77.84 | `sfx/ding/dramatic-shocked-sfxshocked.mp3` | 0.38 | lands on "are you out of your mind?" |
| 88.60 | 87.80 | `sfx/TING SOUND EFFECT.mp3` | 0.48 | the Robinhood/CashCat close |

17 events / 13 distinct files. Whoosh on the thumbnail cut and on every b-roll transition that matters,
2 risers each building into an impact, impacts reserved for the 3 beats that carry the clip.

**Verified on the FINAL render** by aligned subtraction of the source audio (lag +42.7 ms, gain 0.994):
every one of the 17 cues measures **16.0 to 31.3 dB above the codec residual floor (-38.2 dB)**, i.e. all
17 are actually audible under the VO. Integrated loudness **-16.93 LUFS**, true peak **-2.74 dBFS**,
max sample level 0.729, **zero clipped samples**, blackdetect finds **no black segment >= 0.1 s**.

## Reference-image gate

Named projects/coins in this clip: **WHATIF ($IF)** and **CashCat**; Robinhood is named as a listing
venue. Live `ls` of `schedule-tweets/images/reference/` run during THIS build: DogInMe, ElizaOS-ai16z-2,
ElizaOS-ai16z, LAB, bittensor-tao, bobo, carousels, housecoin, kappy, kaspa-logo, kasy, kroak, linea,
michael-saylor, nacho, slippy, toshi, troll, velvet. **No reference exists for WHATIF or for CashCat**,
so generic treatment is correct and NO fake brand mark may be invented (a regenerated carousel slide in
this same batch had to be redone because a coin rendered a backwards K that read as Kaspa). The clip
still carries WHATIF's real branding through the BASE video itself: the verified `@WhatIFonHOOD` X
profile is on screen for ~22 s and the IF/WETH DexScreener chart for ~50 s. Gate result: CLEAN.

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (no Bitcoin symbol, no Ethereum diamond, no invented WHATIF
mark), every coin is BLANK and generic, no real-person faces, crowds are faceless silhouettes, and no
lettering / words / numbers anywhere in the art (all text is code-drawn). Every generated image is
visually inspected before the render.

## Final-render QA (all run on `remotion/out/October-pumps/1-whatif-cto-100x-call.mp4`)

- **Structure/collision check (code):** 11 b-roll beats, 30.9 % coverage, 3 full-screens, 4 badges,
  17 SFX. No badge/badge time overlap, no badge over a b-roll beat, nothing starts before the frame-0
  thumb, no b-roll overlap, and no sub-1.5 s base flash between two b-roll beats. PASS.
- **Frame-0 thumbnail is ONE frame:** mean |f1 - f0| = 109.4 grey levels while |f2 - f1| = 0.9 and
  |f3 - f2| = 1.4, i.e. the cover is replaced immediately at frame 1 and the base plays from there.
- **Overlay frame checks:** frames pulled at every b-roll tIn/tOut and every badge tIn/tOut and visually
  inspected. No two graphics ever share a region; badges sit at y185-460, captions at y838-942.
- **Whisper-verify (second independent pass on the shipped render):** 0.956 word similarity vs the
  caption text. Remaining diffs are Whisper run-to-run variance (token/tokens, five x/5x, 100 x/100x,
  yeah/man) plus the three intentional STT fixes (robinhood, whatif, market cap). Caption onset drift
  over 125 anchored rows: median -0.04 s, p05 -0.06 s, p95 +0.00 s, max +0.12 s, and **0 captions
  appear more than 0.35 s after their word**.
- **Asset reconciliation:** 26 comp `staticFile()` refs, 0 missing on disk, 12 pngs on disk, **0
  orphans** in either direction. `md5sum` over all 12 images: **0 duplicates** (one mis-capture during
  generation produced a duplicate of `broll-wcto-100-million.png`; it was deleted, the broll chat was
  retired, and the beat was regenerated in a FRESH chat with a clean seen-set).
- **Persona inspection:** all 12 images inspected. No real cryptocurrency logo or mark, every coin
  blank, every crowd/figure faceless, no real-person face, no readable lettering. No remap was needed.
- **On-screen text:** zero em/en dashes in any title/chip/badge/caption string; no `@mikeneder`.
