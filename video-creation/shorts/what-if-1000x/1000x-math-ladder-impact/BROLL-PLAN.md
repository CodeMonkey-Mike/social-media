# BROLL-PLAN — `1000x-math-ladder-impact` (batch `what-if-1000x`, clip #6, variant: short/impact)

Authored BEFORE any image generation, per
`video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` §"B-roll — what it is and
where it comes from" step 1. This file is the manifest: every beat below has exactly one asset, every
asset below is referenced by the composition, zero orphans in either direction.

## The clip

Spine: `1000x-math-ladder-impact-tightened-desilenced.mp4` — 1080x1920, 25 fps, **24.20 s**, FINAL
(do not re-cut, do not re-desilence). One contiguous source segment (2751.38-2785.32 of the
livestream) minus two tighten removals, so there are **no concat joins to mask**.

Content: the IMPACT cut of the 1000x ladder. $1,000 into ten researched coins; five lose; coin six
does a 2x, then a 5x, a 10x, a 50x, and the real winner does a 900x or a 1000x. It is short, dense
and number-driven, so **the ladder numbers themselves are the visual spine** (a code-drawn escalating
rung stack), and the generated b-roll count stays LOW (4 images, not 6-8).

## Measured layout

- **Seam = 854** (row-mean gradient scan at t = 1/5/9/13/17/21 s; every frame puts the hard
  screen-share/webcam divider on row 854, gradient 130-163 grey levels vs ~32 for the next-strongest
  row). Content zone = 0..854, webcam plays below.
- **capY = 900** — below the seam, above his hairline (~870-890) and far above his eyes (~1240-1300).
- **Screen-share = an elizaOS CoinMarketCap page** that barely changes for the whole 24 s and is
  **off-message** for this clip (he is talking generic portfolio math, not elizaOS). Per the SKILL
  that is *not* a licence to blanket it: base still shows in real stretches, and the dead zone is used
  by the CODE-DRAWN ladder graphic (a graphics overlay, which does not count against the b-roll
  budget) rather than by more generated images.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| | |
|---|---|
| b-roll covered | **8.12 s / 24.20 s = 33.6 %** (target ~30 %, band 25-35 %) -> IN BAND |
| base showing | **16.08 s = 66.4 %** (target ~70 %, band 65-75 %) -> IN BAND |
| distinct images | **4** (a ~24 s short lands at 2-4, not 6-8) |
| full-screen beats | **2** (hook + climax), 17.5 s apart -> FIRM 1-3 cap held, and no full->full base flash is possible |
| reuse | zero inside the clip; zero from sibling clip #1 `1000x-math-ten-coins` (same ladder segment, built in parallel) - every filename here is `-mli-` and lands only in THIS clip's `render-assets/` |

**Visual change never stalls**: where there is no b-roll image (11.30-21.45) the code-drawn ladder
adds a new rung on-screen at 11.70 / 13.76 / 15.76 / 17.76 and the climax number at 21.68 / 22.80, so
something changes every 1.1-2.1 s while the base video and its screen-share stay visible.

## Beat table

| # | window (s) | mode | spoken line | visual | asset | reference |
|---|---|---|---|---|---|---|
| - | 0.00-1.30 | **base** | "if you put a thousand dollars" | open on Mike + the screen-share (frame 0 is the ONE-frame designed cover) | - | - |
| 1 | 1.30-3.95 | **full** | "into 10 different good coins that you think are good" | HOOK: a thick brick of banknotes bursting apart into ten identical BLANK metal coins arranged in an arc, deep navy, teal rim light | `broll-mli-hook-ten-coins.png` | none (no named project) |
| - | 3.95-6.30 | base | "you've researched them. let's say you lose money" | back to Mike (2.35 s) | - | - |
| 2 | 6.30-8.30 | **content** | "lose money on five of those" | FIVE of the ten coins dead: cracked, ash-grey, sinking, red fracture light; five faint empty slots behind | `broll-mli-five-dead.png` | none |
| - | 8.30-9.70 | base | "all right. coin number six" | back to Mike (1.40 s) | - | - |
| 3 | 9.70-11.30 | **content** | "maybe it's going to like underperform" | ONE blank coin barely lifting off the first step of a dark staircase, weak teal glow, the climb has started | `broll-mli-first-step.png` | none |
| - | 11.30-21.45 | base + **ladder graphic** | the whole 2x / 5x / 10x / 50x ladder | screen-share + webcam stay visible; the code-drawn rung stack builds in the RIGHT column of the content zone (x 600-1040), one rung per spoken multiplier | code, not an image | - |
| 4 | 21.45-23.32 | **full** | "your real winner is going to do like a 900x or a 1000x" | CLIMAX: one blank coin erupting as a vertical column of green-teal light out of a field of dim grey coins, cinematic, dark upper third kept clear for the number | `broll-mli-1000x-eruption.png` | none |
| - | 23.32-24.20 | base | "so you're going to make that money" | hard-out on Mike's face, deliberate loop frame | - | - |

## Reference-image gate (MANDATORY — ran LIVE for this build)

`ls schedule-tweets/images/reference/` executed live on 2026-08-03:
`DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png,
carousels, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png,
linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png, what-if.jpg`

**This clip names ZERO projects or tickers.** The transcript is entirely generic portfolio math
("10 different good coins", "coin number six", "your real winner"). No reference image is required,
and none may be used: every generated coin must be **blank/generic** (no ticker, no letterform, no
real crypto mark), and the elizaOS page that happens to be on the screen-share is never pointed at.
Every prompt below states the no-symbol constraint explicitly, and each image is persona-inspected
before render for a sneaked-in real logo (ETH diamond, BTC symbol) or a real face.

## SFX plan (from `video-creation/assets/sfx/`, >= 2 required)

11 events. Whoosh on the frame-0 thumbnail cut and on both edges of the hook full-screen; a dull
impact on the loss beat; an escalating four-step ding motif, one per rung (2x, 5x, 10x, 50x, rising
volume) which is the audio half of the escalating-number treatment; a riser that crests exactly on
the cut to the climax; **the payoff hit (Boom - Big Reveal) lands ON "900" at 21.70**, and a cash
register tops it on the hard-out. Every cue is started early by its own measured peak offset so the
crest lands on the frame it punctuates. Volumes are intelligibility-first and whisper-verified on the
final mix.

## Frame-0 thumbnail

`thumbnail-mli.png` (generated background art) + the hook title drawn in CODE on top (never baked
into the image): **"FIVE LOSE / ONE DOES / 1000X"** with the chip **"$1,000 INTO 10 COINS"**. ONE
frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`); the base video plays from frame 1.
No em dashes, no @handle.

## Overlay collision map (no two graphics share time AND space)

| graphic | window | band |
|---|---|---|
| frame-0 thumbnail | 0.000-0.033 (1 frame) | full frame; nothing else may start before 0.033 (component suppresses overlays while the thumb is up) |
| ladder rung stack | 11.55-21.44 (fade out 21.20-21.44) | content zone, RIGHT column x 600-1040, y 420-800 |
| climax number (900X -> 1000X) | 21.62-23.32 | centred, y ~520 |
| captions | whole clip | y 900 band |

The ladder stack and the climax number are separated in TIME (0.18 s clear gap) as well as space; the
captions live in their own band 100+ px below the ladder's lowest rung; no b-roll beat overlaps the
ladder window except the climax full-screen, which starts only after the stack has fully faded.
