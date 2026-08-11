# BROLL-PLAN — early-crash / clip 3 `way-off-moon-calls`
### "What $IF to a 10 billion market cap" (Mike's exact 4b title; the $IF spelling is deliberate and is NEVER rewritten to $WHATIF, and the title deliberately does not describe the clip's content)

Spine: `way-off-moon-calls-final.mp4` (**32.24 s**, 1080x1920, native 25 fps, FINAL — raw cut -> Phase 5
tighten -> 5B desilence -> 5C filler pass). The clip-folder spine is never re-encoded; the render loads
the GOP-safe copy `render-assets/way-off-moon-calls.mp4` (keyframes verified at 0.00/1.00/2.00/3.04 s,
i.e. ~1 s GOP).
Comp: `EcWayOffMoonCalls` (shared `LivestreamShort` renderer) · constants
`constants-ec-way-off-moon-calls.ts` · captions `captionsEcMoon.ts`.
Public dir: `video-creation/shorts/early-crash/render-assets/` (SHARED with clips 1/4/5/6 — every file
this clip owns is `*-ec-wom-*` / `thumb-ecwom` prefixed so parallel builders cannot collide).
Measured content/face seam of THIS clip: **row 853** (row-mean gradient scan at t = 1/6/12/18/24/30 s;
all SIX frames return row 853, delta 173-206).

## What the content zone actually is (measured)

A live DEXScreener **AKITA/WETH (Market Cap) 1D** chart left up from the previous topic: candles +
volume in rows 40-430, a static "Transactions" table in rows 470-853, and a token-stats panel + a
Rainbet casino ad down the right side (x 865-1080). It is **off-message for this clip** (which is about
$LAB and Velvet), but per `video-creation/SKILL.md` an off-message screen-share is **NOT** a licence to
blanket. Coverage therefore stays inside the band and the long base stretches are carried by code-drawn
badges and one alpha overlay, not by more images.

## Budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| metric | target | this clip |
|---|---|---|
| generated b-roll coverage | ~30 % (band 25-35 %) | **9.75 s = 30.2 %** |
| base video showing | ~70 % (band 65-75 %) | **22.49 s = 69.8 %** |
| distinct b-roll images | output of the budget | **4** (+1 alpha overlay, +1 frame-0 cover) |
| full-screen moments | 1-3 (FIRM) | **2** — the hook and the payoff |
| beat length | 1-3 s | 2.25-2.60 s |

## Beats

| # | tIn | tOut | mode | spoken line | visual | Reference |
|---|---|---|---|---|---|---|
| 1 | 0.60 | 3.20 | **full** | HOOK "if i give these high price predictions and it might sound like unrealistic" (0.00-3.78) | a colossal gold projection arrow curving up off a dark chart wall into a black sky, tiny faceless silhouettes below looking up | none needed (no project named yet) |
| 2 | 5.30 | 7.90 | content | "i put a 20x price prediction on the $lab token" (4.86-7.94) | the real neon-green LAB flask mark glowing over a dark chart, one MODEST short green arrow to a low dotted target | **$LAB: `schedule-tweets/images/reference/LAB.png` — MANDATORY, generated WITH the reference** |
| 3 | 14.30 | 16.60 | content | "and we did a 350x" (13.46-16.62) | the same LAB flask mark riding the tip of ONE colossal green candle that has blown far past that little dotted target, seen from below | **$LAB: `LAB.png` — MANDATORY, generated WITH the reference** (distinct composition from beat 2) |
| 4 | 26.05 | 28.30 | **full** | PAYOFF "the 58x on the velvet token" (25.86-27.62) | the real violet Velvet V mark blazing above a mountain range of violet candles | **Velvet: `schedule-tweets/images/reference/velvet.png` — MANDATORY, generated WITH the reference** |

Full-screen -> full-screen: beats 1 and 4 are **22.85 s apart**, so the "never flash the base between two
full-screens" rule cannot be violated. No two beats are adjacent (smallest gap 2.10 s, well over the
1.5 s minimum), so `BrollLayer` fades every beat in and out of the base as intended.

### Deliberate BASE-SHOWING beats (mode `base`, no image)

| span | s | why |
|---|---|---|
| 0.03-0.60 | 0.57 | the frame-0 cover hands off to the real talking head (SKILL rule 5) |
| 3.20-5.30 | 2.10 | "but i'm telling you, man" — the turn lands on his face, not on art |
| 7.90-14.30 | 6.40 | "we bought that at the bottom in december" + the SECOND signature line. Carried by **badge 1** and the **alpha overlay**, not by more images: the doubling is the persona beat and it plays on him |
| 16.60-26.05 | 9.45 | "just a couple of months back ... sometimes i get scared to give these moon-boyish price predictions ... and i realized it was like, holy crap man, i was WAY off." The confession + the vindication are a FACE performance. Carried by **badge 2** |
| 28.30-32.24 | 3.94 | "i think i gave it like a 30x. i did a 58x and i still think it has room to grow again." The deliberate HARD-OUT plays on his face with nothing over it, no tail, no CTA |

## Alpha overlay (the SKILL's "pair full-screen b-roll with >= 1 real transparent overlay" rule)

`broll-ec-wom-ov-breakout.png` — generated as a glowing element on PURE BLACK, then converted to a REAL
alpha PNG (alpha = boosted luminance), so it composites with a plain `<Img>` (`blend: 'normal'`).

| tIn | tOut | content | placement | sits inside |
|---|---|---|---|---|
| 12.00 | 14.20 | a neon-green arrow bursting up through a thin ceiling line of light | left 660, top 140, width 290 (over the right-hand stats panel / ad column; NEVER over his face below row 853) | base stretch 7.90-14.30 |

SHIPPED GEOMETRY, **measured on the final render at t 13.10** (an earlier draft of this row read
left 620 / top 300 / width 380; the comp was tightened before the render and this row now records what
actually shipped): the 470x1070 alpha PNG at width 290 renders 290x660, so the arrow occupies
**x 682-915, y 167-805** (spec x 660-950 / y 140-800 plus the component's +-10 px float). Clearance to
the caption glyph+stroke top (row 863) is **58 px**, and it never crosses the 853 seam.

It ends 0.10 s before beat 3 opens and never shares a window with either badge (badge 1 ends 11.00,
badge 2 starts 20.30), so no two graphics can co-occur in time. Space is checked on the render.

## Code-drawn badges (never over an image, never overlapping each other)

| tIn | tOut | line1 / line2 / sub | colour | top | inside base stretch |
|---|---|---|---|---|---|
| 8.70 | 11.00 | BOUGHT THE / BOTTOM / DECEMBER | teal | 560 | 7.90-14.30 |
| 20.30 | 22.80 | CALLED / 20x / IT DID 350x | green | 560 | 16.60-26.05 |

The two windows are **9.30 s apart**, so they can never co-occur; neither starts before the frame-0
cover ends (0.033 s), and `LivestreamShort` suppresses badges while the thumb is up anyway. Badge 2
lands under "moon-boyish price predictions" so the receipt answers the confession on screen.
Geometry: the shared `Badge` is `left: 50%` / `translate(-50%,-50%)` with no width, so its shrink-to-fit
box is capped at 540 px (~436 px of text after padding) and long lines WRAP downwards — every line here
is <= 11 chars at 60 px (line1) / <= 3 chars at 82 px (line2), so both boxes stay 3 lines tall.
Clearance to the caption band is measured on the render, never estimated.

## Register guard (Mike's conviction is VINDICATED, never self-deprecating)

"I was WAY off" in this clip means his published call was **too LOW**: he called 20x on $LAB and it did
350x, he called 30x on Velvet and it did 58x, and he still thinks Velvet has room to grow. Every visual
therefore shows the target being **blown past**, never a failed call: badge 2 is a receipt ("CALLED 20x
/ IT DID 350x"), beat 3 is the candle towering over the little dotted target from beat 2, and beat 4 is
the Velvet mark blazing. Nothing frames a trade as a mistake.

## Reference-image gate (run LIVE on `schedule-tweets/images/reference/`, 2026-08-07)

Live listing: DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, **LAB.png**, bittensor-tao.png,
bobo.png, carousels/, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png,
linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png, **velvet.png**, what-if.jpg.

| entity | named where | reference on disk? | ruling |
|---|---|---|---|
| $LAB | spoken 3x in the clip (7.36, 12.96, 17.06 s) | **YES — LAB.png** | beats 2 AND 3 generated WITH it (the real neon-green flask mark) |
| Velvet | spoken in the clip (27.12 s) | **YES — velvet.png** | beat 4 generated WITH it (the real violet V mark + wordmark) |
| $IF | **title text only**, not spoken anywhere in the clip | yes (what-if.jpg) | **not depicted.** The frame-0 cover carries "$IF" as CODE-DRAWN TITLE TEXT over brand-free art; no project mark is invented and none is faked. Depicting the $IF character would promise a $IF story this clip does not tell (Mike's title deliberately does not match the content), and the sibling clip 1 already uses what-if.jpg for its own $IF beat, which the "no duplicate b-roll across same-topic shorts" rule forbids repeating |
| Akita | on the screen-share only, never spoken | no | not depicted |

## Persona rules applied to every prompt

No real cryptocurrency marks except the two REFERENCED project logos ($LAB flask, Velvet V) — no
Bitcoin B, no Ethereum diamond/octahedron, no Solana bars; every other coin BLANK and featureless; no
real-person faces, crowds are faceless silhouettes; no text / letters / numbers baked into any image
(all on-screen text is code-drawn) except the two real wordmarks that ARE the referenced branding; no em
dashes. Every generated image is visually inspected before render; a violation is REMAPPED to a clean
on-disk asset, never regenerated mid-build.

## SFX (>= 2 required; this build has 9 events / 5 distinct files)

Crest offsets are re-measured on this machine at 0.1 s RMS and every cue is started EARLY by exactly its
own peak offset so the transient lands on the frame it punctuates. Levels are swept OFFLINE against an
encode-matched control before any render (SKILL QA item 7/7a) — see the constants file for the sweep.

| t (start) | file | crest lands on | vol | dur |
|---|---|---|---|---|
| 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.10 — the frame-0 cover cut | 0.24 | 1.00 |
| 0.50 | `sfx/transition_rapid_whoosh.mp3` | 0.60 — the HOOK full-screen cut | 0.26 | 1.00 |
| 5.20 | `sfx/transition_rapid_whoosh.mp3` | 5.30 — cut into the $LAB 20x call | 0.28 | 1.00 |
| 8.60 | `sfx/DING.mp3` | 8.80 — badge 1 (the December bottom) | 0.20 | 1.60 |
| 11.80 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | builds and ENDS exactly on 14.30 | 0.09 | 2.50 |
| 14.20 | `sfx/Impacts/Kick_Impact_01.wav` | 14.30 — IMPACT on the 350x cut | 0.26 | 2.20 |
| 20.10 | `sfx/DING.mp3` | 20.30 — badge 2 (the CALLED 20x / DID 350x receipt) | 0.22 | 1.60 |
| 23.55 | `sfx/risers/Tension_Rise_Logo_Reveal_3.wav` | builds and ENDS exactly on 26.05 | 0.09 | 2.50 |
| 26.05 | `sfx/Boom - Big Reveal-short.wav` | 26.05 — IMPACT on the Velvet payoff full-screen | 0.28 | 1.05 |

The 26.05 cue ships the **TRIMMED** library variant (first 1.05 s of `Boom - Big Reveal.wav` with a
230 ms fade-out). The pre-render masking sweep found the full 2.40 s cue's DECAY TAIL, not its gain,
sitting under "velvet token" at 27.12, and halving the gain changed nothing - so the fix was TIMING and
the payoff hit KEPT its full 0.28. Verified on the FINAL render: the boom's low-frequency energy ends at
**27.10 s**, and in the 26.95-27.75 s span that carries "velvet token" the SFX residual measures
**-40.0 dBFS in the 200-2000 Hz speech band** (-53.5 dBFS at 2-10 kHz), i.e. below the SKILL's
"a real masker is not < -40 dB" line.

**Nothing is placed on the hard-out** ("and i still think it has room to grow again." 30.56-32.24): it
ends clean and abrupt on purpose, with no CTA.

## Frame-0 cover

`thumb-ecwom.png` (generated background art, NO baked text) + **CODE-DRAWN** title
"WHAT $IF TO A / 10 BILLION / MARKET CAP" and chip "CALLED 20x. IT DID 350x." ONE frame only
(`thumbDur` = 1/fps default); the base video plays from frame 1. No em dashes.

## Zero-orphan reconciliation

Every asset below is referenced by `constants-ec-way-off-moon-calls.ts` via a literal `staticFile()` and
exists in the batch public dir; nothing this clip generated is unreferenced.

```
thumb-ecwom.png                      frame-0 cover art
broll-ec-wom-hook.png                beat 1 (full)
broll-ec-wom-lab-call.png            beat 2 (content, ref LAB.png)
broll-ec-wom-lab-350x.png            beat 3 (content, ref LAB.png)
broll-ec-wom-velvet-58x.png          beat 4 (full,    ref velvet.png)
broll-ec-wom-ov-breakout.png         alpha overlay (12.00-14.20)
```
