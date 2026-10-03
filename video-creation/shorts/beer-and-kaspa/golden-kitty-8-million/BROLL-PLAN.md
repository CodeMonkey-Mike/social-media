# BROLL-PLAN: beer-and-kaspa / clip 2 `golden-kitty-8-million` (FULL, 21.66 s)

Title: "Golden Kitty at 5.3 Million Is Going to 8 Million"
Spine: `render-assets/golden-kitty-8-million.mp4` (1080x1920 @25, 21.655 s). Comp renders at 30 fps.
Composition: `BeerKaspaGoldenKitty8M` (`remotion/src/BeerKaspaGoldenKitty8M.tsx`,
`constants-beer-and-kaspa-golden-kitty-8-million.ts`, `captionsBeerKaspaGoldenKitty8M.ts`).
Scoped build directives for clip 2: NONE (`clip_directives.py --batch beer-and-kaspa --clip 2` = 0 of 0).

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, 11 of 11 frames t=1..21 s).
- Content-zone cuts (frame-diff, rows 0..853 @10 fps): ONE cut at **~2.1 s**. 0-2.1 s shows an
  unrelated BIKETYSON chart (the tail of the previous stream topic); 2.1 s to the end is the
  DexScreener **GOLDEN** chart, i.e. THE receipt for everything Mike says. It stays visible most of the clip.
- Burned-in stream label "golden kitty 5.3 million now" sits at y~750 on the left, ships as filmed.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 1.72 + 2.32 + 2.94 = **6.98 s of 21.66 s = 32.2 %** (target ~30 %, band 25-35 %). Base 67.8 %.
- **3 b-roll images**, each used once. Full-screens: **2** (hook + climax), within the firm 1-3 cap.
- Plus 1 alpha overlay (glow-on-black -> alpha-from-luminance) and 2 code-drawn badges, all on BASE beats.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-27)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Golden Kitty ($GOLDEN) | lesser-known WITH reference | `schedule-tweets/images/reference/golden-kitty.png` (the gold cat trophy statue) | cover, hook, oracle, climax (every Golden Kitty image is generated WITH it) |
No other project is named in this cut (the Kaspa/Quant/TON/TAO lead-in was dropped at 2nd review).

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Golden Kitty statue on a coin stack, green candles behind, empty upper half; CODE-drawn title "THIS CAT / IS GOING / TO $8M" + chip "GOLDEN KITTY AT $5.3M" | `thumb-bk2-cover.png` | golden-kitty.png |
| 1 | 0.03-0.40 | "Golden Kitty" | base | face + screen open (Phase 7 rule 5) | none | |
| 2 | 0.40-2.12 | "...at 5.3 million." | **FULL (hook)** | the statue on a pedestal inside a vast gold vault, spotlight, coin mountains; also hides the off-topic BIKETYSON chart | `broll-bk2-hook-kitty-vault.png` | golden-kitty.png |
| 3 | 2.12-4.54 | "This thing is like rocking, man." | base | the real GOLDEN chart (receipt). Alpha overlay: glowing gold up-arrow 2.40-3.95, right side of the chart | `ovl-bk2-up-arrow.png` (overlay) | |
| 4 | 4.54-6.86 | "I was saying a few days ago that I was thinking that" | content | the statue as an oracle beside a crystal ball showing a rising green line, blank calendar pages floating | `broll-bk2-kitty-oracle.png` | golden-kitty.png |
| 5 | 6.86-13.52 | "Golden Kitty is going to be like 8 million in like just like a couple of weeks or I mean it could be" | base | GOLDEN chart. Badge "$8M / THE TARGET" 9.06-11.10 | none (badge) | |
| 6 | 13.52-16.46 | "realistically it could be at 8 million this, this coming week" | **FULL (climax)** | the statue giant on the summit of a gold-coin mountain, a green chart line rocketing past it into the stars, gold fireworks | `broll-bk2-kitty-summit.png` | golden-kitty.png |
| 7 | 16.46-21.66 | "or a few days or something. I think it's a good play just because so many people are getting behind it." | base | GOLDEN chart to the hard out. Badge "GOOD PLAY / CROWD BEHIND IT" 18.64-21.00 | none (badge) | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`) - FINAL, 9 events, whisper-swept
whoosh on the cover cut (0.00), impact on the hook reveal (0.37 -> 0.40), whoosh back to the chart
(t 2.08, crest 2.26: moved off the clipped "mi(llion)" by the offline sweep), ding on the arrow overlay
(2.40), impact into the oracle cutaway (4.54), whoosh out (6.86), ding on the $8M badge (9.06), payoff
impact on the climax cut (13.52, full gain), ding on the GOOD PLAY badge (18.64).
DELETED after the offline sweep: the riser into the climax (masked "or I mean it could be") and the
whoosh out of the climax (masked "or a few" at every gain/timing tried). Detail in the constants file.

## Manifest (zero orphans)
`thumb-bk2-cover.png`, `broll-bk2-hook-kitty-vault.png`, `broll-bk2-kitty-oracle.png`,
`broll-bk2-kitty-summit.png`, `ovl-bk2-up-arrow.png` (+ its raw `ovl-bk2-up-arrow-raw.png` source,
kept OUT of render-assets).
