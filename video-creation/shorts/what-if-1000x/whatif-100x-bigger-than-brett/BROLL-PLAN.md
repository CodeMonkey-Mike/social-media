# BROLL-PLAN - whatif-100x-bigger-than-brett (batch `what-if-1000x`, clip n=2, variant: long)

Spine: `whatif-100x-bigger-than-brett-tightened-desilenced.mp4` - 1080x1920, 25 fps source, **73.92 s**
(audio 73.946 s). FINAL: not re-cut, not re-desilenced. Comp runs at 30 fps; `OffthreadVideo` resamples
by TIME, so every cue below is plain seconds off the clip's own Whisper word timings (0-based).

Measured layout (row-mean gradient scan at t = 3 / 15 / 30 / 45 / 60 / 71 s, all six frames agree):
**seam = 853** (screen-share above, webcam below). Caption band centre `capY = 890`
(below the seam, far above his eyes at ~1250-1300).

## What the BASE actually shows (why the budget is mostly base)

Contact sheet every 2 s + luminance change-point scan:

| window | screen-share | on message? |
|---|---|---|
| 0.00 - 18.66 | DexScreener **IF/WETH (Market Cap) on Uniswap**, the $WHATIF chart ripping, right rail says **Robinhood > Uniswap v3** and carries the green **WHAT IF** banner | YES for $WHATIF, NO for the Brett numbers he speaks over it |
| 18.66 - 54.54 | CoinMarketCap **BRETT (Based)** page; at ~28-30 s the chart tooltip literally reads **12/02/2024 - Market Cap $1.976B** | YES, and it is THE RECEIPT for the "Brett did this in December of 2024" beat |
| 54.54 - 73.92 | back to the DexScreener IF/WETH chart (+ the Robinhood chain label) | YES for the 35B math and the Robinhood spot-listing close |

Segment cuts (assembly is `[3,1,2,0]`, deliberately non-chronological): **18.66 s** and **54.54 s** are
hard scene changes; the third (seg1 -> seg2) is audio only at ~40.3 s.
So b-roll earns its place ONLY where the base is off message (Brett's market cap over the $WHATIF
chart, 3-10 s) or where a spoken abstraction has no on-screen referent (chain/exchange scale, retail
exposure, "not the cycle top"). Everything else is a DELIBERATE BASE beat.

## Reference-image gate (`schedule-tweets/images/reference/` listed LIVE this run)

Folder contents checked: `DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, LAB.png,
bittensor-tao.png, bobo.png, carousels/, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png,
kasy.png, kroak.png, linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png,
velvet.png, what-if.jpg`

| named project | reference on disk | decision |
|---|---|---|
| **$WHATIF** | **YES - `schedule-tweets/images/reference/what-if.jpg`** (neon acid-green engraved figure, back turned, on a black cosmic starfield with spiral galaxies) | **MANDATORY**: all four $WHATIF beats (1, 2, 6, 8) + the thumbnail are generated WITH this reference so the short carries the real $WHATIF art identity, not a generic coin |
| **Brett** | none | no invented mascot/logo. Brett's beats are depicted as his **market-cap peak** (a cold blue-cyan summit) in Base-chain blue. Documented per SKILL Phase 7 rule 6 option "skip its logo (generic scene)" |
| **Robinhood** | none | no invented logo. Rendered in the **brand neon-green / yellow** palette (persona rule: Robinhood / RH-chain coins use brand neon-green-yellow) as scale/app imagery |
| **Base** | none | small cold-blue cube/monolith, no logo |
| **Coinbase** | none | small cold-blue exchange monolith, no logo |

## Budget check (SKILL "B-roll coverage budget", HALVED 2026-07-14)

- **covered 23.31 s / 73.92 s = 31.5 % b-roll, 50.61 s = 68.5 % BASE SHOWING** (targets ~30 % / ~70 %,
  bands 25-35 % / 65-75 %) -> ON TARGET.
- **8 distinct images**, zero reuse inside the clip (target 6-8 for a ~74 s short).
- **3 full-screens** (hook / the 54.54 s segment cut / the climax) = the FIRM 1-3 cap. They are 51.2 s
  and 13.4 s apart, so there is no full-screen -> base-flash -> full-screen bug anywhere.
- Longest deliberate base stretches: 36.20-48.90 (12.70 s, the Dec-2024 $1.976B receipt is on screen)
  and 22.90-33.20 (10.30 s) and 9.90-19.90 (10.00 s). Each carries a live chart + a badge + captions
  changing every ~0.5 s; that is the intended default state of the clip, not a static hold.

## Beat table

| # | tIn | tOut | dur | mode | spoken line (Whisper word times) | visual | reference |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 0.55 | 0.55 | **BASE** | frame 0 = designed cover (ONE frame), then straight into Mike + the $WHATIF chart | | |
| 1 | 0.55 | 3.30 | 2.75 | **full** | "i think it could **100x** from here. right." (`hundred` 0.72, `X` 1.06, `here.` 1.40) | HOOK: the acid-green $WHATIF figure standing on a dark ridge, a colossal green 100x-scale light column erupting into a galaxy field | **what-if.jpg** |
| - | 3.30 | 6.90 | 3.60 | **BASE** | "i compared it to brett. brett made it to a 1.97 billion market cap." | + BADGE `BRETT PEAK / $1.97B` (4.20-6.80) | |
| 2 | 6.90 | 9.90 | 3.00 | content | "this thing for many reasons is going to be **bigger than brett**, and brett went to two billion" (`bigger` 8.68) | the green $WHATIF figure cresting a taller ridge beside a lower cold-blue summit; green light overtakes the blue | **what-if.jpg** |
| - | 9.90 | 19.90 | 10.00 | **BASE** | "so you're talking like 100x from here, right? there will be retracements... probably won't do that overnight... i think it'll do that eventually." | the DexScreener $WHATIF chart IS the visual for a chart argument | |
| 3 | 19.90 | 22.90 | 3.00 | content | "now base is smaller than robinhood, right? coinbase is smaller than robinhood." (`robinhood` 21.00 / 22.96) | scale shot: two small cold-blue monoliths dwarfed by one towering neon-green / yellow monolith, faceless crowd at its base | none (palette only) |
| - | 22.90 | 33.20 | 10.30 | **BASE** | "so it stands to reason that there's going to be more attention brought to meme coins on the robinhood chain. if those memes managed to be listed on the robinhood app." | + BADGE `ROBINHOOD > COINBASE` (25.20-27.90) | |
| 4 | 33.20 | 36.20 | 3.00 | content | "so you're going to get exposure from **regular stock retail customers**" (`customers.` 36.48) | a dense wall of faceless silhouettes, every one lit acid-green by the trading app in their hands | none (palette only) |
| - | 36.20 | 48.90 | 12.70 | **BASE** | "a lot more than brett to be honest. and not only that... brett did this in december of 2024..." - the CMC page literally shows `12/02/2024 Market Cap $1.976B`, so covering it would DESTROY the receipt | + BADGE `BRETT ATH / DEC 2024` (43.00-45.80) | |
| 5 | 48.90 | 51.60 | 2.70 | content | "in like a local run up, **that was not the cycle top**" (`cycle` 50.90, `top.` 51.12) | a small green flag planted on a mid-slope ledge while a far higher summit looms above it in the cloud line | none |
| - | 51.60 | 54.54 | 2.94 | **BASE** | "brett did this. so the potential here, the potential is huge." | | |
| 6 | 54.54 | 57.50 | 2.96 | **full** | "because like i tell people, even you get in now" - starts EXACTLY on the seg2 -> seg0 scene cut, so the full-screen masks the change | the green $WHATIF figure tiny at the foot of a colossal cosmic staircase climbing into the galaxy | **what-if.jpg** |
| - | 57.50 | 64.30 | 6.80 | **BASE** | "obviously you're not going to look at a 1000x for now. it would be like a 35 billion dollar one. right. i'll be crazy." | + BADGE `1000X TODAY = $35B` (60.00-62.60) | |
| 7 | 64.30 | 67.20 | 2.90 | content | "but if it gets that **robinhood spot listing**, it's on the app" (`spot` 65.80, `listing,` 66.10) | a neon-green / yellow trading-app tile snapping into a listings grid, a blank green coin slotting home, ticker rails behind | none (palette only) |
| - | 67.20 | 70.90 | 3.70 | **BASE** | "and we get into a cycle top scenario" | | |
| 8 | 70.90 | 73.90 (comp `tOut` parked at 74.20, past the render end, so the closing frames do NOT dissolve back to base) | 3.00 | **full** | CLIMAX: "you could be looking at a **100x**, right? because you'd be like a **three billion**" (`hundred` 71.46, `three` 73.30, `billion.` 73.44) | the green $WHATIF figure on a summit facing a vast galaxy, three colossal green light-pillars rising past it | **what-if.jpg** |

## Badges (code-drawn, content zone y=300) - never over a b-roll beat, never sharing a window

| tIn | tOut | text | colour | sits over |
|---|---|---|---|---|
| 4.20 | 6.80 | `BRETT PEAK` / `$1.97B` / sub `THE BIGGEST MEME ON BASE` | blue `#3aa0ff` | BASE 3.30-6.90 |
| 25.20 | 27.90 | `ROBINHOOD > COINBASE` / sub `BIGGER APP, BIGGER FLOWS` | green `#39ff14` | BASE 22.90-33.20 |
| 43.00 | 45.80 | `BRETT ATH` / `DEC 2024` / sub `MID CYCLE, NOT THE TOP` | yellow `#ffe600` | BASE 36.20-48.90 |
| 60.00 | 62.60 | `1000X TODAY` / `= $35B` / sub `HONEST MATH, NOT YET` | yellow `#ffe600` | BASE 57.50-64.30 |

Separations: 18.40 s / 15.10 s / 14.20 s. All start long after the frame-0 thumb (1/30 s). Badges live
at y300, captions at y890 -> no spatial overlap either.

## Frame-0 cover (ONE frame)

`thumbnail-w1bb.png` = generated background art (WITH the $WHATIF reference), title + chip drawn in
CODE on top by `Thumb` (never baked into the art):
title `WHATIF COULD\n100X\nFROM HERE`, chip `BIGGER THAN BRETT`, chipColor `#39ff14`.
No em dashes.

## Assets (generated straight into `render-assets/`, zero orphans)

`broll-w1bb-hook-100x.png` - `broll-w1bb-bigger-than-brett.png` - `broll-w1bb-robinhood-scale.png` -
`broll-w1bb-retail-exposure.png` - `broll-w1bb-not-the-top.png` - `broll-w1bb-get-in-now.png` -
`broll-w1bb-spot-listing.png` - `broll-w1bb-three-billion.png` - `thumbnail-w1bb.png`

## SFX (from `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)

Whoosh on the frame-0 thumbnail cut and on every b-roll transition that matters, two risers each
BUILDING INTO an impact, impacts reserved for the beats that carry the clip (hook 100x, the "bigger
than Brett" turn, "not the cycle top", the 54.54 s scene cut, the 100x climax and the three-billion
button). Every cue is started EARLY by that file's own measured peak offset so the crest lands on the
frame it punctuates. >= 2 required; this build has 19 cue events drawing on 13 distinct sfx files.
