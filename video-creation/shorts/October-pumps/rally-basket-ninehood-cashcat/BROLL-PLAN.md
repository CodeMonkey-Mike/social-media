# BROLL-PLAN — rally-basket-ninehood-cashcat (variant: full)

Batch `October-pumps`, clip #4. Base = `rally-basket-ninehood-cashcat-final.mp4`
(1080x1920, 25 fps, **64.622 s**, output of raw cut -> tighten -> desilence -> filler removal; FINAL, not re-cut).
Comp runs at 30 fps / **1938 frames** (64.600 s, just inside the clip so there is no black tail frame).

Title: "Some Of These Things Could Run".

**Measured geometry:** the base is ALREADY composited vertical. Row-mean gradient scan at
t = 2 / 12 / 25 / 38 / 50 / 62 s puts the hard screen-share/webcam divider on the same row on all six
frames: **y = 853/854** (gradient 204 to 216 grey levels there, next-strongest edge 16). Content-zone
b-roll therefore covers 0..854. Caption centre at **y = 890** (below the seam, above Mike's hairline,
nowhere near his eyes).

## Screen-share content map (frame-accurate; ffmpeg scene detection on the cropped content zone)

The content zone is the receipt of this clip: it is a live DexScreener market-cap chart of the exact
coin Mike is naming, for almost the whole runtime. That is why base-showing is the default here.

| span | what is on screen |
|---|---|
| 0.00 - 12.88 | **HOODRAT / WETH** market-cap chart on DexScreener (the "rat" he opens with) |
| 12.88 - 47.48 | **NINEHOOD / WETH** market-cap chart (the range he describes, 240K-360K, is literally drawn on it) |
| 47.48 - 48.04 | the Crypto Rich community page flash: the CoinMarketCap community-gains strip (552x, 198x, 148x, 128x, 127x, 94x). A real receipt, left showing on purpose |
| 48.04 - 64.62 | **CASHCAT / WETH** market-cap chart (the consolidation range he points at, and the Robinhood close) |

The only genuinely OFF-MESSAGE window is **35.8 - 47.5**, where the NineHood chart is still up while he
talks about rallies, his community's 100x's and the LAB 350x. That window carries 3 of the 8 b-roll
beats (rally, LAB climax) and nothing else needs covering.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **20.00 s / 64.62 s = 30.9 %** | ~30 % (band 25-35 %) OK |
| base showing | **44.62 s = 69.1 %** | ~70 % (band 65-75 %) OK |
| distinct images | **8** (+1 thumbnail background) | output of the budget, ~1 per 8.1 s, avg 2.50 s per beat |
| full-screen beats | **3** (hook / the "could run" turn / the LAB 350x climax) | 1-3 FIRM, OK |
| max base gap | 16.30 s (14.10 - 30.40, the NineHood range section, carried by 2 badges + the on-message chart) | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 1.30 | 1.30 | **BASE** | "just throw something into some of" | open on Mike + the HOODRAT chart (the frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 1.30 | 3.90 | 2.60 | **full** | "these because if **they start running**" (HOOK, "they start running" at 2.08) | faceless silhouetted hands tossing blank glowing coins into a wide open basket, green light trails, embers | `broll-rb-hook.png` |
| - | 3.90 | 11.70 | 7.80 | **BASE** | "good rat is a pretty good play, they got good content, it's a math theory play, it's down to one million right now, just hit a million, so it's probably going to go under a million like any minute" | the HOODRAT chart IS the visual: he is describing the market cap that is drawn on screen | - |
| 2 | 11.70 | 14.10 | 2.40 | **full** | "right, so **some of these things could run**" (MAJOR TRANSITION, the title line, and the screen-share swaps HOODRAT -> NINEHOOD at 12.88 underneath it) | a row of blank glowing coins bursting out of a starting gate down a dark track on green light streaks, faceless silhouetted spectators | `broll-rb-could-run.png` |
| - | 14.10 | 30.40 | 16.30 | **BASE** | "ninehood is one of the ones i like, it's bouncing around in this range between 240 to 360, right, i think it's pretty good. what if we get a new bottom like i said and things start running in a few months, and then what does this do, is this just going to stay under a million market cap" | the NINEHOOD chart IS the visual: the range he is pointing at is drawn on it. Carried by BADGE `RANGE BOUND` 16.60-19.40 and BADGE `IF THE RALLY COMES` 25.20-28.00 | - |
| 3 | 30.40 | 32.70 | 2.30 | content | "no, it's probably going to **go to 20 million**" ("go to 20" at 31.28) | a colossal staircase of emerald green light climbing out of dark fog, one small blank coin at the bottom step | `broll-rb-twenty-million.png` |
| 4 | 32.70 | 35.10 | 2.40 | content | "**same team** has BOMO on base, which **ran 10 million**" ("ran 10 million" at 34.96) | a dark forge, faceless silhouetted builders hammering a second blank coin while an identical first coin already blazes on a distant summit (hard-cut from beat 3, adjacent) | `broll-rb-same-team.png` |
| - | 35.10 | 37.40 | 2.30 | **BASE** | "so let's get a" | deliberate base beat between two cutaways (>= 1.5 s, no sub-1 s flash) | - |
| 5 | 37.40 | 39.80 | 2.40 | content | "**rally**, the good things happen in **a rally**" | a night valley erupting with hundreds of vertical green light beams, a faceless silhouette crowd below raising their arms | `broll-rb-rally.png` |
| - | 39.80 | 43.20 | 3.40 | **BASE** | "in my community we do some hundred x's in a rally or more, right, even do" | Mike on cam delivering the receipt setup | - |
| 6 | 43.20 | 46.50 | 3.30 | **full** | "a **350x** in a bear **market with lab** just a couple" (CLIMAX / the receipt) | the REAL $LAB logo (flask + wordmark, generated WITH `schedule-tweets/images/reference/LAB.png`) blazing on a monolith rising out of a frozen dead valley, an emerald candlestick chart rocketing behind it | `broll-rb-lab-350x.png` |
| - | 46.50 | 52.80 | 6.30 | **BASE** | "months ago, crazy right. definitely cash cat, yeah it's really consolidated right here in this range" | the community-gains strip flashes at 47.48-48.04 (real receipt) then the CASHCAT chart takes over at 48.04, showing exactly the consolidation he is describing + BADGE `CASH CAT` 48.60-51.20 | - |
| 7 | 52.80 | 55.00 | 2.20 | content | "i think it's just **waiting for a rally** just like all the others" | a blank glowing coin pressed on a fully compressed steel spring, green energy cracking between the coils | `broll-rb-coiled.png` |
| - | 55.00 | 59.40 | 4.40 | **BASE** | "right now, when it comes to robinhood, yeah i think if they are going to" | the CASHCAT chart, the coin the close is about | - |
| 8 | 59.40 | 61.80 | 2.40 | content | "**list any memes** in their robinhood app" | a colossal glowing doorway shaped like a phone screen opening in the dark, a queue of faceless silhouettes and blank coins waiting, neon green/yellow palette (never Kaspa teal, per the Robinhood-chain colour rule) | `broll-rb-app-listing.png` |
| - | 61.80 | 64.62 | 2.82 | **BASE** | "this is probably going to be the primary candidate" | closes on the CASHCAT chart, exactly the coin he names + BADGE `FIRST IN LINE` 62.30-64.40 | - |

**Full-screen adjacency (SKILL production rule 4):** the 3 full-screens are 7.8 s and 29.1 s apart, so no
full-to-full flash exists. Beats 3 -> 4 are butt-joined (gap 0.00 s) so `BrollLayer` hard-cuts instead of
fading through the base. Every other b-roll-to-base gap is >= 2.30 s, so there is no sub-1 s base flash
anywhere.

## Frame-0 thumbnail

`thumbnail-rb.png` = generated background (blank glowing coins exploding off a starting line under an
empty black storm sky, green candle wall behind) with the hook title drawn in CODE on top, never baked
into the art:

- title `SOME OF THESE / THINGS / COULD RUN`, chip `THE RALLY BASKET` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest b-roll `tIn` is 1.30 s, the earliest badge `tIn` is 16.60 s.
- No em dashes anywhere on screen.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, all at `top: 300` (content zone) while captions live at `y 890`. Each states
something the captions do NOT, and each sits over a BASE stretch, never over a b-roll beat. Robinhood-chain
coins use neon green / yellow, never Kaspa teal.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 16.60 | 19.40 | green | `RANGE BOUND` / `BOUNCING, NOT BLEEDING OUT` | BASE 14.10-30.40 |
| 25.20 | 28.00 | yellow | `IF THE RALLY` / `COMES` / `THE WHOLE BASKET RUNS` | BASE 14.10-30.40 |
| 48.60 | 51.20 | green | `CASH CAT` / `COILED IN THE RANGE` | BASE 46.50-52.80 |
| 62.30 | 64.40 | yellow | `FIRST IN LINE` / `IF THE APP LISTS MEMES` | BASE 61.80-64.62 |

Time gaps between consecutive badges: 5.80 s, 20.60 s, 11.10 s. No two are ever on screen together, none
overlaps a b-roll beat, and all start long after the frame-0 thumb.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own MEASURED peak/attack landing on the beat, not the file start. Envelopes measured on
this machine for THIS build (0.2 s RMS window, mono 8 kHz): `transition_rapid_whoosh` peaks 0.11 s in,
`Cinematic Whoosh 02` 0.74 s, `Cinematic Whoosh 06` 0.50 s (quiet file, rms 0.110), `Impact_3` attacks
0.11 s, `Impact_Hit_01-2` 0.13 s, `Soundjay_Impact_Main_01` 0.18 s (loud, rms 0.678), `Boom - Big Reveal`
0.02 s (loud, rms 0.761), `TING` 0.70 s, `Cash Register Kaching HD` attacks 0.39 s (very quiet, rms 0.058),
`Edgy_Riser` peaks 4.95 s, `ding/sudden-shock` 0.15 s.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.11 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 1.30 | 0.56 | `sfx/Cinematic Whoosh 02.wav` | 0.52 | sweeps INTO the HOOK full-screen |
| 2.08 | 1.97 | `sfx/Impacts/Impact_3.wav` | 0.40 | lands on "they start running" |
| 11.70 | 11.20 | `sfx/Cinematic Whoosh 06.wav` | 0.80 | the cut to the "could run" full-screen (quiet file, vol raised) |
| 12.28 | 12.26 | `sfx/Boom - Big Reveal.wav` | 0.42 | lands on "things could run", the title line |
| 30.40 | 30.29 | `sfx/transition_rapid_whoosh.mp3` | 0.40 | into the 20-million cutaway |
| 31.60 | 30.90 | `sfx/TING SOUND EFFECT.mp3` | 0.48 | bell on "go to 20" |
| 32.70 | 32.59 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | the hard cut into the same-team cutaway |
| 34.96 | 34.83 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.42 | lands on "ran 10 million" |
| 37.40 | 36.66 | `sfx/Cinematic Whoosh 02.wav` | 0.48 | into the rally cutaway |
| 38.25-43.20 | 38.25 | `sfx/risers/Edgy_Riser.wav` | 0.26 | riser BUILDS INTO the LAB climax (crest 43.20) |
| 43.20 | 43.02 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.34 | the cut to the LAB 350x full-screen (loud file, vol lowered) |
| 43.54 | 43.15 | `sfx/Cash Register Kaching  Sound Effect HD.mp3` | 0.95 | KACHING on the 350x LAB receipt (very quiet file, vol raised) |
| 47.30 | 47.15 | `sfx/ding/sudden-shock.mp3` | 0.36 | lands on "crazy right" |
| 52.80 | 52.69 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | into the coiled-spring cutaway |
| 59.40 | 58.90 | `sfx/Cinematic Whoosh 06.wav` | 0.76 | into the app-listing cutaway |
| 63.48 | 62.78 | `sfx/TING SOUND EFFECT.mp3` | 0.48 | the "primary candidate" close |

17 events / 11 distinct files. Whoosh on the thumbnail cut and on every b-roll transition that matters,
one riser building into the climax impact, and the kaching reserved for the 350x receipt.

## Reference-image gate

Named projects/coins in this clip: **RAT / HOODRAT**, **NineHood**, **BOMO**, **LAB**, **Cash Cat**;
Robinhood is named as a listing venue. Live `ls` of `schedule-tweets/images/reference/` run during THIS
build: DogInMe, ElizaOS-ai16z-2, ElizaOS-ai16z, LAB, bittensor-tao, bobo, carousels, housecoin, kappy,
kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy, toshi, troll, velvet.

- **LAB HAS a reference (`LAB.png`)** -> beat 6, the 350x receipt and the climax of the short, is generated
  **WITH that reference uploaded** (`gen-images.js --prefix=broll`, which uploads `ref`, re-baselines after
  send and byte-rejects capturing the upload itself). Non-negotiable.
- **No reference exists for RAT/HOODRAT, NineHood, BOMO, Cash Cat or Robinhood**, so generic treatment is
  correct for those and NO brand mark, logo or letter glyph may be invented for them (a carousel slide in
  this same batch had to be regenerated because a coin's backwards K read as Kaspa). Those coins still
  carry their real identity through the BASE video: their live DexScreener pages are on screen for
  ~63 of the 64.6 s.

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (the LAB logo, via its reference, is the single exception), every
generated coin is BLANK and generic with no symbols or letters, no real-person faces, crowds and figures
are faceless silhouettes, and no lettering / words / numbers anywhere in the art (all text is code-drawn).
Robinhood-chain beats use neon green / yellow, never Kaspa teal. Every generated image is visually
inspected before the render.

## Final-render QA (all run on `remotion/out/October-pumps/4-rally-basket-ninehood-cashcat.mp4`)

- **Finalized-short gate:** PASS (21 distinct staticFile refs, thumbnail present, 8 b-roll assets,
  11 sfx refs, zero missing on disk, zero orphans).
- **Structure/collision check (code):** 8 b-roll beats, 30.9 % coverage, 3 full-screens, 4 badges,
  17 SFX. No badge/badge time overlap, no badge over a b-roll beat, nothing starts before the frame-0
  thumb, no b-roll overlap, no sub-1.5 s base flash between two b-roll beats. PASS.
- **Frame-0 thumbnail is ONE frame:** mean |f1 - f0| = 67.3 grey levels while |f2 - f1| = 3.1 and
  |f3 - f2| = 0.0, i.e. the cover is replaced immediately at frame 1 and the base plays from there.
- **Overlay frame checks:** frames pulled at every b-roll tIn/tOut, every badge tIn/tOut and the
  thumb handoff (24 frames on the final render, plus 36 on the 0.3 Mbps draft) and visually inspected.
  No two graphics ever share a region: badges sit in the content zone at y~185-460, captions at y~890,
  and the b-roll fades are clean at every boundary.
- **SFX audibility (aligned subtraction of the source audio, lag +42.7 ms, gain 0.998):** all 17 cues
  measure **13.5 to 48.0 dB above the codec residual floor (-58.4 dB)**; the 13.5 dB value is the riser
  measured at its quiet onset, by design. 17/17 audible under the VO.
- **Audio:** integrated loudness **-16.6 LUFS**, LRA 2.8 LU, true peak **-2.3 dBFS**, peak sample level
  -2.28 dBFS, zero clipping. `blackdetect` finds **no black segment >= 0.1 s**.
- **Whisper-verify (second independent pass on the shipped render):** 0.881 word similarity vs the
  caption text over 245/243 words. Every diff is Whisper run-to-run variance (gonna/going to x5,
  nine hood/ninehood, robber hood/robinhood, my fury/theory, to 40/240, any means/memes, easy/crazy)
  or the two intentional STT fixes (boom/bomo, cap/cat); the "a rally or more right even do a 350x"
  span is garbled by Whisper because the riser + kaching play over it, and the caption text there was
  confirmed correct by eye on the rendered frames. Caption onset drift over 68 anchored rows: median
  -0.04 s, p05 -0.11 s, p95 +0.01 s, max +0.42 s, and **1 caption** appears more than 0.35 s after its
  word (t=55.92 "now", 0.42 s, pure Whisper timing variance; the canonical caption timings were NOT
  re-timed).
- **Asset reconciliation:** 21 comp `staticFile()` refs, 0 missing on disk, 9 pngs on disk, **0
  orphans** in either direction. `md5sum` over all 9 images: **0 duplicates**.
- **Persona inspection:** all 9 images inspected. The ONLY brand mark anywhere is the real $LAB logo on
  the referenced climax beat; every other coin is a blank generic disc, every crowd/figure is a faceless
  silhouette, there is no real-person face, and no readable lettering or numbers in any art. No remap
  was needed.
- **LAB reference actually used:** `broll-rb-lab-350x.png` (1669 KB) reproduces the reference's lime-green
  flask icon and LAB wordmark on an entirely new scene; its md5 (8f5a9d0f...) differs from LAB.png
  (5746883...), and gen-images.js byte-rejects capturing an uploaded reference, so this is a real render.
- **On-screen text:** zero em/en dashes in any title/chip/badge/caption string; no `@mikeneder`.
