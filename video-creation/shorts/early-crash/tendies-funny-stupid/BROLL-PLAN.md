# BROLL-PLAN — early-crash / clip 4 `tendies-funny-stupid`

**"Robinhood Alert: Tendies Is Exactly What Vlad Wants to List"** (Mike's 4b title)

Spine: `tendies-funny-stupid-final.mp4` (**34.509 s**, 1080x1920, native 25 fps, FINAL — verified on
disk, do NOT re-cut). Render copy: `../render-assets/tendies-funny-stupid.mp4` (GOP-safe re-encode).
Comp: `EcTendiesFunnyStupid` (shared `LivestreamShort` renderer) · constants
`constants-ec-tendies-funny-stupid.ts` · captions `captionsEcTendies.ts`.
Public dir: `video-creation/shorts/early-crash/render-assets/` (SHARED with clips 1/3/5/6 — every
file this build writes is `*-ec-*` prefixed so the five builders cannot collide).
Measured content/face seam of THIS clip: **row 853** (row-mean gradient scan at t = 0.5/4.8/9/16/22/
27.5/33.8 s; all SEVEN frames return row 853, delta 105-201).

## What the content zone actually shows (rows 0-853; CORRECTED against rendered frames)

| span | state |
|---|---|
| 0.00-0.30 | DexScreener **PEPE/WETH** pair (PEPEWIFHOOD), the previous topic |
| 0.30-5.30 | **BLANK WHITE "Loading pair..." page** (mean luma 190-230, 62-92 % near-white) — dead screen |
| 5.30-34.51 | ⭐ the real **TENDIES/WETH DexScreener page**: the actual TENDIES logo + wordmark, $0.01681, LIQUIDITY $826K, **MKT CAP $16.1M**, Robinhood > Uniswap v3, the live trade table |

> ⚠ CORRECTION, and the reason it is written down. A first pass called the 5.30-34.51 stretch a
> "frozen PEPE page" off a LUMA-ONLY 2 fps scan (mean 149.3 / 53.4 % near-white, frame delta 0.0-2.2).
> Both DexScreener pair pages have the SAME layout, so their luma statistics are nearly identical and
> the scan could not tell them apart. Rendered frames at 10.20 / 19.40 / 34.40 s show the TENDIES
> page. **A statistic is not a look; the frames are the truth.** Nothing about the beat layout
> changed, but the justification did, and it matters:

1. The blank-white loading stretch is the only part of the zone worth hiding, and it is exactly where
   the hook full-screen sits (1.35-4.32).
2. **The content zone is an ON-MESSAGE, live RECEIPT for the whole clip** (the token's real page and
   the exact $16.1M cap he quotes). That is the strongest possible argument for the halved b-roll
   budget here: coverage stays at 29.6 %, the number-ladder stretch (18.75-28.80) is left BASE with
   badges over it so the receipt reads under the "$16M" badge, and the hard-out plays over the page.
   It is also why nothing in this build has to fake a Tendies logo: the real one is already on screen.

## Budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| metric | target | this clip |
|---|---|---|
| generated b-roll coverage | ~30 % (band 25-35 %) | **10.22 s = 29.6 %** |
| base video showing | ~70 % (band 65-75 %) | **24.29 s = 70.4 %** |
| distinct images | output of the budget | **4** (+1 frame-0 cover) |
| full-screen moments | 1-3 (FIRM) | **2** — hook, climax |
| beat length | 1-3 s | 2.30-2.97 s |

## Beats

| # | tIn | tOut | mode | spoken line (clip time) | visual | Reference |
|---|---|---|---|---|---|---|
| 1 | 1.35 | 4.32 | **full** | HOOK "float my boat is obviously **What If**, it's Cooper, and then there's..." (1.22-4.70) | the green comic-etched cosmic figure from the What If reference art on a dark ledge, back to camera, facing a galaxy, three BLANK featureless coins (gold + lime) floating beside him | **What If -> `schedule-tweets/images/reference/what-if.jpg` USED (reference gate)** |
| 2 | 4.32 | 6.62 | content | "there's **Tendies**, even though i haven't gotten any, but this is the only one" (4.38-7.04) | a heaping pile of golden crispy chicken tenders on dark slate, neon lime rim light, one BLANK featureless gold coin leaning on it | **Tendies -> NO reference on disk** (ls'd live) -> literal-name treatment, NO invented logo |
| 3 | 16.10 | 18.75 | content | THE TITLE BEAT "the type of **meme** that **Vlad** will want to list on the **Robinhood** app" (14.56-19.02) | a faceless dark-suited silhouette hand dropping a blank glowing coin into a giant phone whose screen is a neon lime-green trading app with abstract candles | **Robinhood -> NO reference on disk** -> lime-green (#CCFF00) / neon-green palette ONLY, no wordmark, no invented mark. **Vlad = a real person -> NEVER a face** |
| 4 | 28.80 | 31.10 | **full** | **CLIMAX** "imagine this goes to like **10 billion**. just imagine." (27.66-30.38) | a colossal neon lime-green candlestick chart erupting through storm clouds into starfield, golden tenders and blank coins raining upward, god rays | none needed |

Beats 1 -> 2 are **exactly butted (tOut === tIn = 4.32)** so `BrollLayer` hard-cuts with zero base
frames between (SKILL production rule 4) — the full-screen collapses to the content zone on the
exact word "Tendies" and reveals Mike's face for the punchline. The two FULL-SCREENS are **24.48 s
apart**, so no full -> full base flash can exist.

### Deliberate BASE-SHOWING beats (mode `base`, no image)

| span | s | why |
|---|---|---|
| 0.04-1.35 | 1.31 | frame-0 cover hands off to the real talking head (SKILL rule 5) |
| **6.62-16.10** | **9.48** | the PITCH and the gag: "it's funny and stupid... this reminds me of the fartcoin concept... oh that's stupid... but it's kind of funny if people will buy into it". Pure FACE comedy - carried by **badge 1**, not images |
| **18.75-28.80** | **10.05** | the number ladder: "from 16 million right now... if it goes on the Robinhood app in a bull run, over a billion... we'll see how far it goes. it could be insane." Carried by **badges 2 and 3** + the riser |
| 31.10-34.51 | 3.41 | "nothing's financial advice here, right? nothing's financial advice. **are you out of your mind?**" - the disclaimer + the HARD-OUT play on his face over the **real TENDIES page**. Nothing over it, no tail, no CTA |

## Reference-image gate (run LIVE against `schedule-tweets/images/reference/`, 2026-08-07)

Named entities spoken in this clip: **What If** (3.10), **Cooper** (3.70), **Tendies** (4.70),
**Fartcoin** (10.22), **Vlad** (Tenev, 16.62), **Robinhood** (18.46, 21.92).

Live listing of `schedule-tweets/images/reference/`: DogInMe.png, ElizaOS-ai16z-2.png,
ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png, carousels/, ethereum-eth.png,
housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png, linea.png, michael-saylor.png,
nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png, **what-if.jpg**.

- **What If -> `what-if.jpg` EXISTS -> beat 1 is generated WITH it** (green comic-etched cosmic
  figure + galaxy). The clip's hook names it, so the short carries its real art, not a generic coin.
- **Tendies -> NO reference** -> approved generic: the literal chicken-tender reading of the name
  plus BLANK coins. **No invented Tendies logo anywhere** (the real mark only ever appears where the
  livestream itself shows it, 33.40-34.51). Never a blank object in its place either - beat 2 carries
  a concrete identity.
- **Cooper -> NO reference** -> not given a beat (mentioned in passing inside beat 1).
- **Fartcoin -> NO reference** -> not given an image; it is named in a code-drawn TEXT badge, which
  cannot invent a logo.
- **Robinhood -> NO reference** -> approved generic: **neon lime-green #CCFF00 / neon green** UI
  only. ⛔ NEVER teal (teal is Kaspa's colour and misreads as a Kaspa short).
- **Vlad Tenev -> a real person** -> faceless silhouette only, never a generated face.

## SFX (from `video-creation/assets/sfx/`)

Envelopes RE-MEASURED on this machine (see the constants file for the table). Every cue is STARTED
EARLY by exactly its own peak offset so the crest lands on the frame it punctuates.

| t (start) | file | crest lands on | vol | dur |
|---|---|---|---|---|
| 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.10 - the frame-0 cover cut | 0.26 | 1.00 |
| 0.55 | `sfx/Cinematic Whoosh 02.wav` | 1.35 - the HOOK full-screen cut | 0.20 | 2.00 |
| 4.22 | `sfx/Impacts/Kick_Impact_01.wav` | 4.32 - IMPACT on the "Tendies" hard cut | 0.24 | 1.60 |
| 16.00 | `sfx/transition_rapid_whoosh.mp3` | 16.10 - cut to the listing beat | 0.28 | 1.00 |
| 19.10 | `sfx/DING.mp3` | 19.30 - badge 2, the $16M receipt | 0.22 | 1.60 |
| 26.30 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | builds and ENDS exactly on 28.80 | 0.10 | 2.50 |
| 28.80 | `sfx/Boom - Big Reveal.wav` | 28.80 - IMPACT on the CLIMAX full-screen | 0.28 | 2.30 |

**7 events / 6 distinct files** (contract floor is 2). **Nothing is placed on the hard-out**: "are
you out of your mind?" ends clean and abrupt on purpose. Levels are whisper-verified against the
FINAL MIX; a cue that makes a line transcribe worse than it does off the bare spine is retimed or
shortened first, not merely turned down (SKILL QA item 7).

## Code-drawn badges (never over an image, never overlapping each other)

| tIn | tOut | line1 / line2 / sub | colour | top | inside base stretch |
|---|---|---|---|---|---|
| 10.10 | 12.40 | REMEMBER / FARTCOIN / SAME STUPID FUNNY ENERGY | lime #CCFF00 | 560 | 6.62-16.10 |
| 19.30 | 21.50 | MARKET CAP / $16M / RIGHT NOW | yellow | 560 | 18.75-28.80 |
| 23.40 | 25.60 | OVER A / BILLION / IF ROBINHOOD LISTS IT | lime #CCFF00 | 560 | 18.75-28.80 |

Windows are 6.90 s and 1.90 s apart, so no two badges can ever co-occur; none starts before the thumb
frame ends (0.033 s) and none overlaps a b-roll window. `line2` is kept <= 8 characters so the
shrink-to-fit box cannot wrap downwards into the caption band (measured on the render).

## Frame-0 cover

`thumb-ec-tendies.png` (generated background art, **no baked text**) + CODE-DRAWN title
"VLAD WANTS / TO LIST THIS / ON ROBINHOOD" and chip "FUNNY AND STUPID" (lime). ONE frame only
(`thumbDur` = 1/fps default); the base video plays from frame 1. No em dashes.

## Caption gates resolved (evidence in the build report)

Whisper's `whisper-words.json` for this clip has TWO defects, both fixed before captioning:
- The token name renders as **"10 days"**. Ear-verified: an isolated medium.en pass on 4.10-5.50 s
  returns "and then there's **tendies**", and large-v3 whole-clip returns "and then there's Tendies".
  Only ONE instance survives the tighten (the plan's gate confirmed).
- The word pass **DROPS the entire tail phrase** (it ends at 33.44 s on "advice." while the clip runs
  to 34.51 s). Restored into `whisper-words-verified.json` via `_patch_words.py`.
- ⚠ **The tail is "ARE you out of your mind?", not "now you're out of your mind"** as the batch
  tighten-plan gate predicted off the MASTER transcript. FIVE independent 1x passes on this clip's
  own audio (large-v3 whole-clip; medium.en on 32.60-34.55, on 31.70-34.51, on 33.00-34.51; and a
  prompted medium.en pass) ALL return "are you out of your mind?". Never ship words no 1x pass
  produced.
- "far coin" -> **fartcoin** (large-v3 "Farcoin", medium.en primed "Fartcoin", master-transcript
  gate "fart coins"). "robin hood" -> **robinhood** (existing canonical rule). "type of me" ->
  "type of **meme**". "10 billion **is** imagine" -> "10 billion. **just** imagine." (two passes
  agree on "just"; there is no hallucinated `is`).
- Protected doublings survive verbatim (no adjacent-duplicate collapse can reach them): "we'll see,
  we'll see", both "nothing's financial advice" lines, and "it could like, it could".
- No cut fragment appears: no "want want", no doubled "robinhood", no "you know from", no "yeah i
  mean". "funny and stupid" is captioned as Mike's PITCH (positive valence, echoed by the cover chip).

## Persona guards applied to every prompt

Faceless silhouettes only (Vlad is a real person), BLANK featureless coins (no Bitcoin ₿, no Ethereum
diamond, no real mark), no text / letters / numbers baked into any image, no real or invented logo for
Tendies or Robinhood, Robinhood identity carried by **lime-green only, never teal**. Every generated
image is visually inspected before render; a violation is REMAPPED to a clean on-disk asset, never
regenerated mid-build.
