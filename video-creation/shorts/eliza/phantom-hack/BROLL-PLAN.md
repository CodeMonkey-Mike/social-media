# BROLL-PLAN — eliza / clip 2 `phantom-hack` ("I Raced the Hacker Draining My Own Wallet")

Spine: `phantom-hack-tightened-desilenced.mp4` (**85.16 s**, 1080x1920, native 25 fps, FINAL)
Comp: `ElizaPhantomHack` (shared `LivestreamShort` renderer) · constants `constants-eliza-phantom.ts`
Public dir: `video-creation/shorts/eliza/render-assets/` (shared with clip 3; every file here is
`*-eph-*` prefixed so the two builders cannot collide)
Measured content/face seam of THIS clip: **row 853** (row-mean gradient scan at t = 1/8/15/22/30/40/
50/60/70/80/84 s; all ELEVEN frames return row 853, delta 180-202).

## The content zone is a FROZEN, OFF-MESSAGE screen-share (measured)

The upper zone is a **CoinMarketCap Shiba Inu page** (SHIB chart + "Shiba Inu Markets" exchange
table) left over from the previous topic, and it is **static for the entire 85 s**: pixel-diff of the
content zone (rows 0-853) against t=1 s across all 11 sampled frames gives mean abs diff 1.2-2.1 and
**< 1.3 % of pixels changing** (the only motion is the ticking price digit). It is a receipt for
nothing in this clip, which is about a Phantom wallet drain.

Per `video-creation/SKILL.md` ("an off-message / low-value screen-share is NOT a license to
blanket"), the coverage budget is **NOT** raised past the band. It only justifies sitting in the
upper half of it (32.9 %) and spending the two long base stretches on **code-drawn badges** rather
than more images.

## Budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| metric | target | this clip |
|---|---|---|
| generated b-roll coverage | ~30 % (band 25-35 %) | **28.00 s = 32.9 %** |
| base video showing | ~70 % (band 65-75 %) | **57.16 s = 67.1 %** |
| distinct images | output of the budget | **11** (+1 frame-0 cover) |
| full-screen moments | 1-3 (FIRM) | **3** — hook, climax, payoff |
| beat length | 1-3 s | every beat **2.40-2.80 s** |

## Beats

| # | tIn | tOut | mode | spoken line | visual | Reference |
|---|---|---|---|---|---|---|
| 1 | 1.00 | 3.50 | **full** | "i don't use Phantom because i was hacked" (0.00-1.78) | HOOK: a violet-lit vault door hanging open in a black void, blank featureless coins pouring out and dissolving into violet embers | Phantom: **no reference on disk** (generic approved) - violet/purple palette only, NO ghost mark, NO wordmark |
| 2 | 6.90 | 9.40 | content | "just one day i see every single token" (6.62-9.02) | a tall stack of identical dark glass list rows floating in violet light, each holding one blank featureless coin, receding into darkness | none needed |
| 3 | 12.50 | 15.00 | content | "flipping out of the way and the tokens were shifting up" (12.32-14.34) | one row tilting out of that stack and dissolving into violet sparks while the rows above slide down to close the gap | none needed |
| 4 | 18.85 | 21.35 | content | **PEAK** "somebody's sending my tokens away" (18.94-20.68) | a black-gloved FACELESS silhouette hand reaching into violet light and pulling a bright stream of blank coins out of frame into darkness | none needed |
| 5 | 25.35 | 28.05 | **full** | **CLIMAX / the title** "sent them away to try to beat them to it" (25.42-27.06) | two streams of blank glowing coins racing in opposite directions down a dark corridor, a lone faceless silhouette sprinting after one of them, red rim light vs violet | none needed |
| 6 | 44.15 | 46.75 | content | "i had a privacy and VPN company" (44.06-46.52) | a dark server corridor with a glowing teal encrypted tunnel of light and one faceless silhouette at the far end | VPN: generic class, no company named |
| 7 | 55.85 | 58.25 | content | **PEAK 2** "even me, i got hacked. it's crazy." (55.96-57.84) | a lone faceless silhouette inside a SHATTERED protective dome of violet glass, shards frozen mid-air | none needed |
| 8 | 58.25 | 60.75 | content | "vulnerabilities in Chrome" (58.74-60.50) | a generic dark browser window in a void, its glass pane cracking outward with red light bleeding through the fracture, blank grey tabs | Chrome: **no reference on disk** (generic approved) - NO Chrome mark, NO coloured-circle logo, no text in the window |
| 9 | 63.25 | 65.65 | content | "you try to stay away from hot wallets" (63.10-64.42) | a wallet-shaped slab glowing red-hot like forged metal on black, embers rising | none needed |
| 10 | 70.85 | 73.45 | content | "you can use OneKey in association with your hardware wallet" (70.86-74.10) | a matte-black hardware security device with ONE physical button, cool green edge glow, in a faceless silhouette hand | OneKey: **no reference on disk** (generic approved) - cool green accent only, NO wordmark, NO invented logo |
| 11 | 79.75 | 82.55 | **full** | **PAYOFF** "the hacker needs the actual physical device to confirm on it" (79.88-82.80) | a giant black-gloved silhouette hand stopped dead against a wall of green light, a small physical device lit at its centre | none needed |

Beat 7 -> 8 are **exactly butted (tOut === tIn = 58.25)** so `BrollLayer` hard-cuts with zero base
frames between (SKILL production rule 4). Every other pair has >= 2.5 s of deliberate base between
it, and the three FULL-SCREENS are 21.85 s and 51.70 s apart, so no full -> full base flash can exist.

### Deliberate BASE-SHOWING beats (mode `base`, no image)

| span | s | why |
|---|---|---|
| 0.04-1.00 | 0.96 | frame-0 cover hands off to the real talking head (SKILL rule 5) |
| 3.50-6.90 | 3.40 | "i was hacked, man. that was horrible." lands on his face, not on art |
| 9.40-12.50 | 3.10 | "everyone is like a similar individual container" (he is describing, not revealing) |
| 15.00-18.85 | 3.85 | "shipped out. i was like, oh my god, i know what's happening" - the realisation is a FACE beat |
| 21.35-25.35 | 4.00 | "so then i did, i went into my Phantom wallet and i saw this" - the riser runs under this |
| **28.05-44.15** | **16.10** | the paranoia digression: "how does this happen? i'm crazy protective ... travel router ... hotel internet ... VPN". Carried by **badge 1**, not by images |
| 46.75-55.85 | 9.10 | "back from 2010 up until like 2016 ... i really know what goes on". Carried by **badge 2** |
| 60.75-63.25 | 2.50 | "that's why i tell people this. you gotta, for number one," |
| 65.65-70.85 | 5.20 | "and number two ... use, use an app, an app on your computer. don't, don't use a Chrome extension." Carried by **badge 3** |
| 73.45-79.75 | 6.30 | "you have your browser add-on OneKey extension in Chrome. you can do that because" |
| 82.55-85.16 | 2.61 | "so you're okay. but i would just stay away." - the HARD-OUT plays on his face, nothing over it |

## Reference-image gate (run LIVE against `schedule-tweets/images/reference/`, 2026-08-07)

Named entities spoken in this clip: **Phantom** (0.40, 22.40), **OneKey** (71.46, 76.52),
**Chrome** (60.26, 69.46, 78.22), VPN (generic class), travel router / hot wallet / hardware wallet
(generic classes). **No coin or token is named anywhere in the clip** (the "ship" at 15.84 is
"shipped out", not SHIB - see the caption notes below).

Live listing of `schedule-tweets/images/reference/`: DogInMe.png, ElizaOS-ai16z-2.png,
ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png, carousels/, ethereum-eth.png,
housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png, linea.png, michael-saylor.png,
nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png, what-if.jpg.

- **Phantom -> NO reference on disk** -> generic approved: violet/purple palette, abstract wallet /
  vault forms. No ghost mark (that IS Phantom's real logo), no wordmark, and never a blank object in
  its place - beats 1/2/3/4 all carry the violet identity.
- **OneKey -> NO reference on disk** -> generic approved: matte-black hardware device with a cool
  green accent, no wordmark, no invented logo (beat 10).
- **Chrome -> NO reference on disk** -> generic approved: a neutral browser chrome-less window, no
  Chrome mark, no four-colour circle (beat 8).
- ElizaOS / LAB / Kaspa / What If etc. are NOT named in this clip -> not used.

## SFX (from `video-creation/assets/sfx/`)

Envelopes RE-MEASURED on this machine (0.1 s RMS): `transition_rapid_whoosh` peak 0.10 s ·
`Cinematic Whoosh 02` peak 0.80 s · `Boom - Big Reveal` peak 0.00 s · `TING SOUND EFFECT` peak
0.80 s · `DING` peak 0.20 s · `Kick_Impact_01` peak 0.10 s · `Soundjay_Impact_Main_01` peak 0.20 s ·
`Impact_Hit_01-2` peak 0.10 s · `Tension_Rise_Logo_Reveal_3` attack 0.90 s, peak 2.50 s. Every cue
below is STARTED EARLY by exactly its own peak offset so the crest lands on the frame it punctuates.

| t (start) | file | crest lands on | vol | dur |
|---|---|---|---|---|
| 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.10 - the frame-0 cover cut | 0.26 | 1.00 |
| 0.20 | `sfx/Cinematic Whoosh 02.wav` | 1.00 - the HOOK full-screen cut | 0.20 | 2.00 |
| 6.80 | `sfx/transition_rapid_whoosh.mp3` | 6.90 - cut to the token rows | 0.30 | 1.00 |
| 12.40 | `sfx/transition_rapid_whoosh.mp3` | 12.50 - cut to the row vanishing | 0.30 | 1.00 |
| 18.75 | `sfx/Impacts/Kick_Impact_01.wav` | 18.85 - IMPACT on the PEAK cut | 0.26 | 2.20 |
| 22.85 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | builds and ENDS exactly on 25.35 | 0.10 | 2.50 |
| 25.35 | `sfx/Boom - Big Reveal.wav` | 25.35 - IMPACT on the CLIMAX full-screen | 0.30 | 2.60 |
| 44.05 | `sfx/transition_rapid_whoosh.mp3` | 44.15 - cut to the VPN tunnel | 0.28 | 1.00 |
| 46.50 | `sfx/TING SOUND EFFECT.mp3` | 47.30 - badge 2 (the 2010-2016 receipt) | 0.24 | 2.00 |
| 55.65 | `sfx/Impacts/Soundjay_Impact_Main_01-short.wav` | 55.85 - IMPACT on "even me, i got hacked" | 0.26 | **0.70** (trimmed variant from the masking sweep, gain kept) |
| 58.15 | `sfx/transition_rapid_whoosh.mp3` | 58.25 - the beat 7 -> 8 HARD CUT | 0.26 | 1.00 |
| 63.15 | `sfx/transition_rapid_whoosh.mp3` | 63.25 - cut to the red-hot wallet | 0.28 | 1.00 |
| 66.50 | `sfx/DING.mp3` | 66.70 - badge 3 (RULE 2) reveal | 0.22 | 1.60 |
| 70.75 | `sfx/transition_rapid_whoosh.mp3` | 70.85 - cut to the hardware device | 0.28 | 1.00 |
| 77.25 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | builds and ENDS exactly on 79.75 | 0.10 | 2.50 |
| 79.65 | `sfx/Impacts/Impact_Hit_01-2.wav` | 79.75 - IMPACT on the PAYOFF full-screen | 0.30 | 2.40 |

**16 events / 8 distinct files.** No sting is placed on the hard-out: "but i would just stay away."
ends clean and abrupt on purpose. Every level is whisper-verified against the FINAL MIX; a cue that
makes a line transcribe worse than it does off the bare spine is retimed or shortened, not just
turned down (SKILL QA item 7).

## Code-drawn badges (never over an image, never overlapping each other)

| tIn | tOut | line1 / line2 / sub | colour | top | inside base stretch |
|---|---|---|---|---|---|
| 38.90 | 41.60 | TRAVEL ROUTER / OWN VPN / IN EVERY HOTEL | teal | 560 | 28.05-44.15 |
| 47.30 | 50.20 | 2010 TO 2016 / VPN COMPANY / HE RAN ONE | yellow | 560 | 46.75-55.85 |
| 66.70 | 69.40 | RULE 2 / USE AN APP / NOT A BROWSER EXTENSION | green | 560 | 65.65-70.85 |

The three windows are 5.70 s and 16.50 s apart, so no two badges can ever co-occur; none starts
before the thumb frame ends (0.033 s).

**Geometry was MEASURED on the render, not estimated.** The shared `Badge` is `left: 50%` with
`translate(-50%,-50%)` and no width, so the shrink-to-fit box is capped at 540 px (~436 px of text
after padding) and long lines WRAP downwards. The first pass (top 640, badge 1 running to five text
lines) measured a panel bottom of ~859 px against a caption top edge of ~873 px, a 14 px gap. That
is effectively a collision, so badge 1's line2 was shortened to "OWN VPN" and all three were raised
to top 560.

## Frame-0 cover

`thumb-eph.png` (generated background art, no baked text) + **CODE-DRAWN** title
"I RACED / THE HACKER / DRAINING MY / OWN WALLET" and chip "EVEN ME, I GOT HACKED".
ONE frame only (`thumbDur` = 1/fps default); the base video plays from frame 1. No em dashes.

## Caption gates resolved (see the build report for the full evidence)

The 6.4-21.5 s theft scene is captioned **from audio**: every ambiguous span was re-transcribed in
isolation with `large-v3` (and `medium.en` where the two disagreed) off this clip's own final spine.
Outcomes: **"ship" -> SHIB REJECTED** (six passes, including one primed with a SHIB-biased
`initial_prompt`, all return "shipped out"); **"then I was like" REJECTED** (four passes return "and
it was like"); "you got a number for number one" IS a mishear but nobody hears "remember", so it is
captioned "you gotta, for number one"; and the shipped `whisper-words.json` **dropped 1.5 s of
speech** ("i was hacked, man." at 3.46-4.98), which is restored. All three protected persona
doublings survive verbatim.

## Persona guards applied to every prompt

Faceless silhouettes only (no real or invented faces), blank featureless coins (no Bitcoin,
Ethereum or any real mark), no text / letters / numbers baked into any image, no real or invented
brand logo for Phantom, OneKey or Chrome. Every generated image is visually inspected before render;
a violation is REMAPPED to a clean on-disk asset, never regenerated mid-build.
