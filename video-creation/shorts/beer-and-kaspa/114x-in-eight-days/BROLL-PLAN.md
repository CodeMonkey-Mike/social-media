# BROLL-PLAN: beer-and-kaspa / clip 4 `114x-in-eight-days` (FULL, 63.89 s)

Title: "We Just Did a 114x in Eight Days"
Spine: `render-assets/114x-in-eight-days.mp4` (1080x1920 @25, 63.886 s, last video packet 63.840). Comp renders at 30 fps, 1916 frames.
Composition: `BeerKaspa114xEightDays` (`remotion/src/BeerKaspa114xEightDays.tsx`,
`constants-beer-and-kaspa-114x-in-eight-days.ts`, `captionsBeerKaspa114xEightDays.ts`).
Scoped build directives for clip 4: NONE (`clip_directives.py --batch beer-and-kaspa --clip 4` = 0 of 0).

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, 10 of 13 frames; the other 3 hit the burned-in chat label at ~778).
- Content-zone cuts (frame-diff, rows 0..853 @10 fps): **~3.6 s, ~22.4 s, ~30.5 s, ~35.7 s**.
  - 0-3.6 s: unrelated X feed (covered by the full-screen hook).
  - 3.6-22.4 s: Crypto Rich **"Top Performing Assets" table** = THE receipt: PERPSPAD +11309% **114x**, ETHICS +1600% **17x**, STONK +1235.7% **13x**, all "Called by: Mike".
  - 22.4-30.5 s: DexScreener **PERPSPAD/SOL market-cap chart** (peak 10.26M) = THE receipt for "90K on the 5th, nearly 11 million on the 13th".
  - 30.5-35.7 s: unrelated X feed. 35.7 s-end: unrelated CoinMarketCap QNT page (burned-in chat label "got some longs going for tao & Quant", ships as filmed).
- STT token check: the garbled "Ethics" (clip-plan flagged UNKNOWN) is **ETHICS**, confirmed on the table row "…HICS +1600.0% 17x Mike". "Perp's pad" = **PERPSPAD** (table + DexScreener).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.10 + 1.40 + 3.36 + 2.92 + 2.50 + 3.50 + 3.10 = **19.88 s of 63.87 s = 31.1 %** (target ~30 %, band 25-35 %). Base 68.9 %.
- **7 b-roll images**, each used once (a ~64 s short; the ~75 s guide is 6-8). Full-screens: **2** (hook + climax), inside the firm 1-3 cap.
- Plus 1 alpha overlay (glow-on-black -> alpha-from-luminance) and 8 code-drawn badges, all on BASE beats.
- Both receipts (table, chart) show in real stretches: table 3.60-8.36, 9.76-14.04, 17.40-22.4; chart 22.4-30.48 uncovered.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-27, 39 files)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Solana | WELL-KNOWN brand | none needed | named explicitly in the launch-pad prompt (real Solana logo on the tower) |
| PERPSPAD (Perps Pad) | lesser-known, NO reference | none on disk | CODE-DRAWN type only: cover chip + 114x badge. Never in generated art. FLAG: Mike can add a reference |
| ETHICS | lesser-known, NO reference | none on disk | CODE-DRAWN badge "17x / ETHICS" only. FLAG |
| STONK | lesser-known, NO reference | none on disk | CODE-DRAWN badge "13x / STONK" only. FLAG |
No Kaspa branding in this cut (nothing Kaspa is said), so no kaspa-logo use.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | purple-to-teal rocket blasting out of a coin pile, green candle wall, empty upper half; CODE-drawn title "WE DID / 114x IN / 8 DAYS" + chip "PERPSPAD ON SOLANA" | `thumb-bk4-cover.png` | |
| 1 | 0.03-0.50 | "We need, well" | base | face + screen open (Phase 7 rule 5) | none | |
| 2 | 0.50-3.60 | "we just got a nice runner. We got there like 110x" | **FULL (hook)** | a racing rocket crossing a finish line on a green-candle track, confetti; hides the unrelated X feed | `broll-bk4-hook-runner.png` | |
| 3 | 3.60-8.36 | "and holy crap. We had a lot of good plays in like the last three weeks." | base | the receipts TABLE | none | |
| 4 | 8.36-9.76 | "Holy guacamole dude." | content | shocked cartoon avocado jumping back from a laptop with a giant green candle | `broll-bk4-holy-guacamole.png` | |
| 5 | 9.76-14.04 | "The biggest one was, I guess it's 114x. Perps Pad on Solana." | base | TABLE (114x PERPSPAD row). Badge "114x / PERPSPAD" 11.32-13.90 (top 150, over the page heading) | none (badge) | |
| 6 | 14.04-17.40 | "I feel like a launch pad pairing memes with perps." | content | Solana launch pad (real Solana logo on the tower), meme-mascot rockets, leverage dial maxed | `broll-bk4-perps-launchpad.png` | Solana (well-known, named) |
| 7 | 17.40-22.40 | "17x on ETHICS and then there was STONK, 13x. Crazy dude." | base | TABLE (ETHICS 17x, STONK 13x rows). Badges "17x / ETHICS" 18.00-19.50, "13x / STONK" 19.80-21.90 | none (badges) | |
| 8 | 22.40-30.48 | "It was like 90K, it was on the fifth. It was on the 13th, nearly 11 million. Unbelievable. So that's eight days. My goodness." | base | PERPSPAD DexScreener CHART. Badges "$11M / FROM $90K" 27.06-28.70, "8 DAYS / 5TH TO 13TH" 28.96-30.30 (top 690, over the transactions list) | none (badges) | |
| 9 | 30.48-33.40 | "Multiple scores of plays in our community. Yeah, like over" | content | a night stadium of faceless silhouettes launching 100+ rockets | `broll-bk4-community-plays.png` | |
| 10 | 33.40-45.84 | "100 or whatever it is. That's a lot... This run up, that's supposed to be happening right now. I just can't wait for it, man. Oh my God, dude. You know, one thing after another is gonna pump." | base | X feed then CMC page. Badges "100+ / COMMUNITY PLAYS" 33.54-35.50, "RUN-UP / IS HAPPENING" 36.60-39.40. Alpha overlay: glowing rocket 43.80-45.70 | `ovl-bk4-rocket.png` (overlay) | |
| 11 | 45.84-48.34 | "I'm gonna sell, take profits, rotate it out." | content | rotating rocket-carousel launcher, one launching as the next loads, coins unloading | `broll-bk4-rotation-carousel.png` | |
| 12 | 48.34-49.40 | "Then that's gonna pump." | base | CMC page | none | |
| 13 | 49.40-52.90 | "It's gonna be so fun, man. So goddamn fun." | **FULL (climax)** (peak beat) | green-candle roller coaster ridden by happy gold coins, fireworks | `broll-bk4-climax-so-fun.png` | |
| 14 | 52.90-55.90 | "It's not like you're sitting on just like five different plays." | base | CMC page | none | |
| 15 | 55.90-59.00 | "If you're sitting in like dozens or scores of plays," | content | cartoon octopus trader juggling dozens of blank coins and tiny rockets | `broll-bk4-juggling-plays.png` | |
| 16 | 59.00-63.87 | "and keep rotating like, oh my God, dude. I don't know, it's gonna be so exciting. I just can't wait." | base | CMC page to the hard out. Badge "KEEP / ROTATING / PUMP. SELL. ROTATE." 59.20-61.50 | none (badge) | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copied into render-assets/sfx/) - FINAL, 14 events, whisper-swept
whoosh on the frame-1 cover cut (0.033, vol 0.12), impact on the hook reveal (0.50), whoosh back to the
table (3.60, vol 0.12: at 0.20 it turned "110x" into "110 accent"), comic shock sting on "holy guacamole"
(8.36), dings on the 114x / 17x (vol 0.08) / $11M badges, impact on "eight days" (28.96), ding on 100+
(33.54), whoosh with the rocket overlay (43.80), impacts into the rotation (45.84) and juggling (55.90)
cutaways, payoff impact on the climax cut (49.40, full gain), ding on KEEP ROTATING (59.20).
DELETED after the offline sweep: the impact into the launch-pad cutaway (masked "I feel like" at every
gain/timing tried) and the ding on the 13x STONK badge (masked "STONK, 13x"). Detail in the constants file.

## Manifest (zero orphans)
`thumb-bk4-cover.png`, `broll-bk4-hook-runner.png`, `broll-bk4-holy-guacamole.png`,
`broll-bk4-perps-launchpad.png`, `broll-bk4-community-plays.png`, `broll-bk4-rotation-carousel.png`,
`broll-bk4-climax-so-fun.png`, `broll-bk4-juggling-plays.png`, `ovl-bk4-rocket.png` (+ its raw
`ovl-bk4-rocket-raw.png` source, kept OUT of render-assets in the clip folder).
