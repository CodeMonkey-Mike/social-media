# BROLL-PLAN — `whatif-100x-impact` (batch `what-if-1000x`, clip n=7, variant `short`)

Spine: `whatif-100x-impact-tightened-desilenced.mp4` (1080x1920, 25 fps source, **12.567 s**)
Comp: `WhatIf7Impact` (shared `LivestreamShort`), 30 fps, `durationInFrames = 377` (last frame 12.533 s)
Measured screen-share/webcam seam of THIS clip: **y = 854** (row-gradient scan on frames 0.5 / 6.0 / 12.0 s)
Public dir: `video-creation/shorts/what-if-1000x/whatif-100x-impact/render-assets` (the per-CLIP
folder every sibling in this batch uses; an earlier run mis-landed the assets at the BATCH root and
that was reconciled 2026-08-03 — nothing is left at the batch root, which `publish-shorts.py` and
`cleanup` both walk).

No scene cuts exist in this spine (ffmpeg scene scan at 0.25 finds none) — it is one continuous
segment, so no b-roll beat has to mask an edit.

## Budget check (canonical: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| | |
|---|---|
| Target | ~30 % generated b-roll (band 25-35 %), ~70 % base-video showing (65-75 %) |
| **This clip** | **4.253 s b-roll / 12.567 s = 33.8 %** b-roll, **66.2 % base showing** — IN BAND |
| Distinct images | **3** (a ~12.5 s single-punch short; image count is an OUTPUT of the budget) |
| Full-screen beats | **2** (transition + climax) — inside the FIRM 1-3 cap, 7.43 s apart so no base-flash |
| Longest base stretch | 4.33 s (3.62 -> 7.95), carrying the live chart + a badge to 5.30 + the alpha overlay from 5.55 |

The content zone here is the **live IF/WETH DexScreener chart ripping upward** (with the green WHAT IF
banner on the right rail) while Mike makes the 100x claim. That is the single best possible support
for this clip's argument, so base-showing is the deliberate default state and b-roll only earns the
three beats below.

## Reference-image gate (`schedule-tweets/images/reference/` listed LIVE this run, 2026-08-03)

`DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png,
carousels/, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png,
linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png, what-if.jpg`

| named project | reference on disk | decision |
|---|---|---|
| **$WHATIF** | **YES — `schedule-tweets/images/reference/what-if.jpg`** (neon acid-green engraved figure, back turned, black cosmic starfield) | **MANDATORY**: both $WHATIF beats (4, 6) AND the frame-0 cover are generated WITH this reference; the real art is also composited as the corner watermark plate (`logo-wi7-whatif.jpg`) |
| **Brett** | none | no invented mascot/logo (SKILL Phase 7 rule 6, "skip its logo / generic scene"): the precedent is drawn as a cold blue-cyan summit and the FIGURE is carried by the code-drawn `$1.97 BILLION` badge |

## Beat table

| # | t in | t out | Mode | Spoken line (as captioned) | Visual | Asset | Reference |
|---|---|---|---|---|---|---|---|
| 1 | 0.00 | 1.85 | **base** | "i think it could 100x from here." | Frame 0 = the designed cover (ONE frame), then straight onto Mike + the live $WHATIF chart ripping up the content zone (SKILL Phase 7 rule 5: base-first from frame 1). | — | — |
| 2 | 1.85 | 3.62 | **full** | "brett made it to a 1.97 ..." | Colossal cold blue-cyan glass/ice summit rising out of a dark cloud ocean, one white beacon burning at the peak. The "somebody already climbed this" precedent. `tIn` sits in the silence after "here." (1.68) so the image is fully up as "brett" lands (1.90). | `broll-wi7-brett-peak.png` | none (generic, approved) |
| 3 | 3.62 | 7.95 | **base** | "1.97 billion market cap. and then this thing is for many reasons that i just explained" | Base showing. Badge 1 holds the number to 5.30; the alpha overlay pops 5.55-7.60 so the beat is never a static hold. | — | — |
| 4 | 7.95 | 8.95 | **content** | "is going to be bigger than brett." | Wide landscape: a short squat cluster of cold-blue candlestick bars dwarfed by a colossal wall of neon-green $WHATIF candles climbing out of frame, the real green engraved figure small at their base. Deliberately NOT clip 2's green-vs-blue mountains. | `broll-wi7-bigger.png` | **`what-if.jpg`** |
| 5 | 8.95 | 11.05 | **base** | "and brett went to 2 billion. so you're talking" | Base showing: Mike lands the setup on camera with the chart behind. | — | — |
| 6 | 11.05 | 12.75* | **full** | "like 100x from here." | The real green engraved figure tiny at bottom-left on a dark ridge; a diagonal surge of neon-green candles blasts bottom-left -> top-right into a burning green galaxy. The payoff. | `broll-wi7-climax.png` | **`what-if.jpg`** |

\* `tOut 12.75` is past the last rendered frame (12.533 s) on purpose, so the climax never fades out
before the hard-out (the exact bug clip 2's builder hit: a fade-out at the composition end ghosts the
artwork back onto Mike's face). The abrupt ending is DELIBERATE: no CTA, no outro card, no tail beat.

## Frame-0 thumbnail (ONE frame)

- Asset: `thumb-wi7-cover.png` (generated WITH `what-if.jpg` as reference), title + chip code-drawn on top.
- Title: `BRETT DID` / `$1.97` / `BILLION` (titleSize 140, each line <= 9 chars so it fits 968 px)
- Chip: `$WHATIF IS NEXT`, chip colour `#39ff14`
- Number-first hook, deliberately different from clip 2's cover (`WHATIF COULD / 100X / FROM HERE`,
  chip `BIGGER THAN BRETT`) since both shorts come off the same segment and can appear back to back.
- `thumb.durS` NOT set -> component default = 1/fps = ONE frame. Never a held card.

## Graphics overlays (never collide in time AND space)

| Overlay | tIn | tOut | Band (y) | Notes |
|---|---|---|---|---|
| $WHATIF watermark plate | always | — | 26-190 (x 26-182) | the ONLY graphic allowed over the frame-0 cover |
| Badge 1 `BRETT PEAKED AT` / `$1.97 BILLION` / `MARKET CAP` (blue `#3aa0ff`) | 2.85 | 5.30 | 219-481 | reveals ON the spoken number (1.97 runs 2.78-3.96), clear of the watermark |
| Alpha overlay `overlay-wi7-green-surge.png` (true alpha PNG) | 5.55 | 7.60 | 435-715 (x 330-750) | starts after badge 1 is fully gone (5.40); sits over the low-value transactions table, never over the chart, the burned-in chat bar (MEASURED y 728-780) or the captions |
| Badge 2 `100X` / `FROM HERE` (green `#39ff14`) | 11.25 | 12.75 | 234-426 | climax payoff; tOut past the last frame so it never fades out |
| Captions | 0.00 | end | capY **900** (~845-955) | below the seam, clear of the burned-in chat bar, far above his eyes (~1180) |

Badge 1 and Badge 2 never share a window (5.30 < 11.25). Badge 1 and the alpha overlay never share a
window (badge renders nothing after 5.40; overlay starts 5.55) and their bands are 36 px apart anyway.
Nothing starts under the frame-0 thumb (0.033 s).

## SFX (from `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)

Each cue is STARTED EARLY by that file's own measured peak offset so the crest lands on the frame it
punctuates (measured: rapid whoosh 0.175 s, Cinematic Whoosh 02 0.867 s, Impact_Hit_01-2 0.146 s,
Cinematic Whoosh 06 0.601 s, Boom - Big Reveal 0.041 s).

| # | start t | crest t | File | vol | Why |
|---|---|---|---|---|---|
| 1 | 0.000 | 0.18 | `sfx/transition_rapid_whoosh.mp3` | 0.32 | frame-0 cover cut into the video |
| 2 | 0.983 | 1.85 | `sfx/Cinematic Whoosh 02.wav` | 0.26 | cut to the full-screen precedent |
| 3 | 2.704 | 2.85 | `sfx/Impacts/Impact_Hit_01-2.wav` | 0.24 | `$1.97 BILLION` badge reveal |
| 4 | 5.375 | 5.55 | `sfx/transition_rapid_whoosh.mp3` | 0.15 | alpha-overlay pop |
| 5 | 7.349 | 7.95 | `sfx/Cinematic Whoosh 06.wav` | 0.22 | content-zone cutaway on "bigger than brett" |
| 6 | 11.009 | 11.05 | `sfx/Boom - Big Reveal.wav` | 0.24 | climax full-screen / the 100x payoff |

6 events / 4 distinct files (>= 2 required). VO runs wall-to-wall on this clip, so every cue is mixed
low and the FINAL MIX is whisper-verified; any cue that degrades its line gets swept DOWN (SKILL QA
row 7), never the payoff hit raised.

## Persona / caption fixes applied (each VERIFIED against this clip's own whisper-words.json first)

- spoken "hundred x" already transcribes as **100x** (words at 0.70 and 11.44) — nothing to fix
- the Brett figure renders as **1.97 billion** in the captions, **$1.97 BILLION** on the badge and
  **$1.97 / BILLION** on the cover — one consistent form everywhere on screen
- `tau -> TAO` and `Casper/Kasper -> Kaspa` are NOT APPLICABLE: neither token exists in this clip's
  transcript (checked, not assumed)
- no em dashes anywhere on screen
- hard-out preserved: nothing is added after the final spoken word at 12.30 s

## Assets (generated straight into the clip's `render-assets/`, zero orphans)

`broll-wi7-brett-peak.png` · `broll-wi7-bigger.png` · `broll-wi7-climax.png` ·
`thumb-wi7-cover.png` · `overlay-wi7-green-surge.png` (alpha) · `logo-wi7-whatif.jpg` ·
`whatif-100x-impact.mp4` · `sfx/`

Every image is UNIQUE to this clip: clip 2 (`whatif-100x-bigger-than-brett`) is cut from the same
segment and its assets (green light column, green-vs-blue mountains, cosmic staircase, galaxy-spiral
cover) are deliberately not repeated here.

## Persona-inspect gate (run before rendering)

Every generated image is visually inspected for a real crypto logo (BTC/ETH/any real mark) or a real
human face. Coins must be blank, figures faceless. On a violation: REMAP the beat to a clean on-disk
asset, do not regenerate mid-build, and note the swap in the report.
