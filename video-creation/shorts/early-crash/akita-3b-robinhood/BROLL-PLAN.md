# BROLL-PLAN — early-crash / clip 1 `akita-3b-robinhood`
### "Here's why Robinhood chain tokens will pass 6 billion." (Mike's 4b title)

Spine: `akita-3b-robinhood-final.mp4` (**128.14 s**, 1080x1920, native 25 fps, FINAL — raw cut ->
Phase 5 tighten -> 5B desilence -> 5C filler pass). Never re-encoded in the clip folder; the render
loads the GOP-safe copy `render-assets/akita-3b-robinhood.mp4` (`-g 25 -bf 0`, keyframes verified
every ~1.0 s).
Comp: `EcAkita3bRobinhood` (shared `LivestreamShort` renderer) · constants
`constants-ec-akita-3b-robinhood.ts` · captions `captionsEcAkita.ts`.
Public dir: `video-creation/shorts/early-crash/render-assets/` (shared with clips 3/4/5/6 — every
file this clip owns is `*-ec-aka-*` / `thumb-eca` prefixed so parallel builders cannot collide).
Measured content/face seam of THIS clip: **row 853** (row-mean gradient scan at
t = 1/8/15/22/30/40/50/60/70/85/100/115/127 s; all THIRTEEN frames return row 854, delta 181-205).

---

## ⛔ MIKE'S CLIP-SPECIFIC B-ROLL DIRECTIVE (2nd review, 2026-08-07) — overrides the coverage band

> He is **guiding the viewer through the Akita chart on screen and it must NOT be covered.**
> EXTREME MINIMUM b-roll: the frame-0 thumbnail cover, then b-roll ONLY in the **first ~5 s** and the
> **last ~15 s (~113-128 s)**. The ENTIRE MIDDLE stays barren: no full-screen images, no content-zone
> images. Mid-clip, ONLY **transparent-background overlay elements** (alpha PNGs / code-drawn badges
> that leave the chart visible) are permissible, and sparingly.

This is a **deliberate, recorded deviation from the ~25-35 % coverage band** in
`video-creation/SKILL.md` ("B-roll coverage budget"), not an oversight. It is the same principle the
budget rule itself states, taken to its limit: *"leave DELIBERATE gaps with NO b-roll image so the
content zone shows, especially when Mike is pointing at something on screen."* Here he points at the
chart for ~108 consecutive seconds. The build reports the shortfall explicitly; nobody should
"restore" coverage from this file.

**What the content zone actually is (verified on 7 sampled frames):** a live DEXScreener
`AKITA/WETH (Market Cap) 1D` chart. Candles + volume occupy **rows 40-430** and he is dragging,
zooming and hovering candles on them for the whole clip (chart state differs on every sampled
frame: Feb-Jun 21 range at t=20, zoomed to the May 21 spike at t=90, hovering the 11 May 21 candle
at t=127). Rows **470-853** are a STATIC "Transactions" table (identical rows on every sampled
frame), and rows 0-853 x 865-1080 is the token stats panel + a Rainbet casino ad. So:
**every mid-clip overlay is confined to rows ~470-850, which leaves the candles he is guiding
through 100 % visible.**

**TWO EXCEPTIONS FOUND IN THE BASE FOOTAGE (measured 2026-08-08 at 10 fps on the staged spine, mean
luminance of the chart crop x140-860 / y40-430: chart ~33, meme ~137-169).** For **62.80-67.80 s
(5.00 s)** and **73.30-75.00 s (1.70 s)** the chart panel is fully replaced by one of Mike's own
livestream REACTION-MEME video clips (a cheering crowd, then a shocked Ric Flair), which he fires on
the two biggest chart payoffs. So the "content zone" in those 6.70 s is not the chart at all.
- These are BASE footage, not a comp defect, and they are on-brand hype punctuation, so the build
  leaves them alone. The persona no-real-faces rule governs GENERATED b-roll, not Mike's own stream.
- It also corrects the old note that 62.72-67.84 is a "silent chart-zoom gap": the gap is the meme
  clip, and `_patch_words.py` proves there IS speech in it (the restored "look at that." at 65.62).
- ⚠ JUDGMENT ITEM FOR MIKE, not decided here: the b-roll budget says an off-message screen-share is
  "not a license to blanket... leave base gaps or drop in a brief full-screen." A full-screen over
  62.80-67.80 would not cover any chart. It is NOT built, because his directive for THIS clip says
  the middle stays barren and that outranks the band. Say the word and it becomes one full-screen.

## Budget

| metric | canonical target | this clip (AS BUILT, re-measured 2026-08-08) | note |
|---|---|---|---|
| generated b-roll coverage | ~30 % (band 25-35 %) | **14.50 s = 11.3 %** | ⚠ BELOW BAND **by Mike's directive above** |
| base video showing | ~70 % (band 65-75 %) | **113.61 s = 88.7 %** | the chart is the visual |
| distinct b-roll images | output of the budget | **5** (+1 frame-0 cover, +1 alpha overlay) | |
| full-screen moments | 1-3 (FIRM) | **3** — hook, climax, projection | B3/B4 are exactly butted (hard cut) |
| beat length | 1-3 s | 1.80-3.90 s | B1 (the hook) is the only >3 s beat |
| mid-clip (4.8-113.3 s) images | n/a | **ZERO** — barren by directive | only 1 alpha PNG + 3 code badges, all in rows 470-850 |

## Beats

| # | tIn | tOut | mode | spoken line | visual | Reference |
|---|---|---|---|---|---|---|
| 1 | 0.90 | 4.80 | **full** | HOOK "so these are like some of the 2021 meme coins that went like to a billion or more, like exploded" (0.00-5.68) | 2021 meme-coin era: a wall of BLANK featureless coins erupting off a dark green candle chart into a gold shockwave | Akita Inu: **no reference on disk** (checked live) -> generic blank coins, NO invented logo, NO dog breed mark |
| — | 4.80 | 113.30 | **base** | the whole Akita chart walk-through | ⛔ BARREN BY DIRECTIVE — the DEXScreener chart plays untouched. Carried by 1 alpha overlay + 3 code badges in rows 470-850 (below) | |
| 2 | 113.30 | 116.30 | content | "gets listed in the Robinhood app in a bull run, in a parabolic bull run" (113.44-116.32) | a phone slab floating in black, its screen a blank neon-green/yellow trading app with an unlabeled green line ripping up and off the top edge | Robinhood: **no reference on disk** (checked live) -> brand-accurate neon green/yellow palette only, NO feather, NO wordmark, NO fake logo |
| 3 | 119.30 | 121.10 | **full** | CLIMAX "this went to 3 billion" (119.44-120.18) | one colossal green candle towering out of a flat dead chart into a black sky, tiny faceless silhouettes below | none needed |
| 4 | 121.10 | 123.85 | **full** | PROJECTION "could we see like a 10 or 20 billion token?" (121.06-123.38) | the same candle continuing past the atmosphere into orbit, Earth's curve below, gold + neon-green glow | none needed — EXACTLY butted to #3 (tOut === tIn) so `BrollLayer` HARD-CUTS, zero base flash |
| 5 | 123.85 | 126.90 | content | "could Cash Cat and $IF, could it go to 10 or 20 billion?" (123.86-126.84) | the $IF green figure standing on a ridge looking at a galaxy whose spiral arms are made of glowing green candles | **$IF: `schedule-tweets/images/reference/what-if.jpg` — MANDATORY, generated WITH the reference** (Cash Cat: no reference on disk, carried by the caption only) |
| — | 126.90 | 128.14 | **base** | the deliberate HARD-OUT "it's very possible." (127.22-128.16) | nothing over it, no tail, no CTA | |

Full-screen -> full-screen adjacency: only B3->B4, exactly butted. B2 ends 116.30 and B3 starts
119.30 (a 3.00 s deliberate base gap, > the 1.5 s minimum); B4 ends 123.85 and B5 starts 123.85
(butted). No sub-1 s base flash exists anywhere.

## Mid-clip transparent elements (the ONLY thing allowed in 4.8-113.3 s)

All four sit in **rows 470-850** — over the STATIC transactions table, never over the candles
(rows 40-430) and never over his face (below row 854). **They are SEQUENTIAL and never co-occur**
(gaps of 0.30 s / 56.90 s / 19.40 s), and none starts before the frame-0 cover ends (0.033 s).

| kind | tIn | tOut | content | placement |
|---|---|---|---|---|
| alpha PNG `broll-ec-aka-ov-sprout.png` | 19.60 | 21.20 | a tiny glowing green sprout/seed of light on black -> real alpha (luminance); sits on "it was DOWN, DOWN, DOWN, DOWN" | left 96, top 476, width 340 |
| code badge | 21.50 | 24.20 | "STARTED AT" / **$120K** / "MARKET CAP" | top 660 (centre), box <= 540 px wide |
| code badge | 81.10 | 83.90 | "AKITA HIT" / **$3B** / "ZERO EXCHANGES" | top 660 (centre) |
| code badge | 103.30 | 105.90 | "RIGHT NOW" / **IS EARLY** / "ROBINHOOD CHAIN" | top 660 (centre) |

**AS-BUILT DEVIATION (recorded 2026-08-08, this file was authored BEFORE the comp).** The plan
originally paired the sprout overlay with badge 1 in one shared 21.40-24.10 window and closed with a
second alpha PNG, `broll-ec-aka-ov-dawn.png`. The comp took the plan's own escape hatch ("if the
measured clearance is not positive, the sprout moves to a different beat"): the sprout was moved
EARLIER to 19.60-21.20, which ends 0.30 s before badge 1 opens, so overlay and badge can no longer
share a frame at all and the clearance question is moot. The closing `ov-dawn` overlay was replaced
by a third code badge ("RIGHT NOW / IS EARLY / ROBINHOOD CHAIN", 103.30-105.90) on the same beat, so
`broll-ec-aka-ov-dawn.png` was NEVER GENERATED and is not referenced anywhere — it is removed from
the manifest below rather than left as a phantom asset. Net mid-clip elements: 1 alpha PNG + 3 code
badges, still all inside rows 470-850, still zero overlap.

## Reference-image gate (run LIVE on `schedule-tweets/images/reference/`, 2026-08-07)

Named entities in this clip: **Akita / Akita Inu**, **Robinhood** (chain + app), **Cash Cat**,
**What If ($IF)**.

| entity | reference on disk? | ruling |
|---|---|---|
| What If / $IF | **YES — `what-if.jpg`** | beat 5 MUST be generated with it (done) |
| Akita Inu | no | generic blank coins, brand-free; no invented dog logo |
| Robinhood | no | neon-green/yellow palette only (`feedback_robinhood_coin_color`); no feather, no wordmark |
| Cash Cat | no | not depicted; carried by the caption |

## Persona rules applied to every prompt

No real cryptocurrency marks (no Bitcoin B, no Ethereum diamond/octahedron, no Solana bars), all
coins BLANK and featureless, no real-person faces, crowds are faceless silhouettes, no text/letters/
numbers baked into any image (all on-screen text is code-drawn), no em dashes.

## SFX (>= 2 required; this build has 14 events / 7 distinct files) — see the constants file for measured crests + the masking sweep

Whoosh on the frame-0 cover cut and on every b-roll cut; a DING on each badge reveal; a riser across
the 62.72-67.84 s reaction-meme beat that ENDS exactly on the "look at that / holy crap" payoff cut;
a Boom on the 119.30 climax; and **nothing at all on the hard-out**.

⚠ Two corrections to earlier drafts of this section, both from the 2026-08-08 final-mix verify:
1. That 62.72-67.84 s stretch is **not silent**. `_patch_words.py` restores a "look at that." at
   65.62-66.62 inside it (the shipped word pass dropped the whole run). The 65.29 riser therefore
   does sit over speech, and an encode-matched A/B returns "Look at that!" IDENTICALLY off the
   render and off the bare control at every tight staggered window, so at vol 0.12 it masks nothing.
2. **The CLOSING riser did mask a word and was RETIMED** (116.75 -> 117.55, dur 2.55 -> 1.75, gain
   unchanged at 0.10). "just imagine how far, how far MIGHT go" lost "might" in 3 of 4 tight windows
   off the render while the control kept it. HALVING THE GAIN DID NOT FIX IT (still 0/4); retiming
   restored the control's exact 2/4. Full rationale + the sweep table live in the constants file.

## Zero-orphan reconciliation

Every asset below is referenced by `constants-ec-akita-3b-robinhood.ts` via a literal `staticFile()`
and exists in the batch public dir; nothing this clip generated is unreferenced.

```
thumb-eca.png                     frame-0 cover art
broll-ec-aka-hook.png             beat 1  (full)
broll-ec-aka-rh-app.png           beat 2  (content)
broll-ec-aka-candle-tower.png     beat 3  (full)
broll-ec-aka-orbit.png            beat 4  (full)
broll-ec-aka-if-galaxy.png        beat 5  (content, ref what-if.jpg)
broll-ec-aka-ov-sprout.png        alpha overlay (the only one)
```

Reconciled on disk 2026-08-08: all 7 files above exist in the batch public dir, all 7 are referenced
by a literal `staticFile()` in `constants-ec-akita-3b-robinhood.ts`, and no `*-ec-aka-*` / `thumb-eca`
file in that dir is unreferenced. (The dir is SHARED with clips 3/4/5/6, so the gate's orphan WARN
lists their `broll-ec-tfs-*` / `broll-ec-wom-*` / `thumb-ec-*` assets; those belong to the sibling
builds and are not this clip's orphans.)
