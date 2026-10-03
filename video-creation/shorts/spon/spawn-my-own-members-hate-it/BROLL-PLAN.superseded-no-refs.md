# BROLL-PLAN: spon / clip 1 `spawn-my-own-members-hate-it` (FULL, 82.17 s)

Title: "My Own Members Hate This Token, I See a 100x"
Spine: `render-assets/spawn-my-own-members-hate-it.mp4` (1080x1920 @25, has_b_frames 0, 2047 frames,
last video packet 82.160 s, audio 82.226 s). Comp renders at 30 fps, **2465 frames** (last frame 2464 = 82.133 s).
Composition: `SponMembersHateIt` (`remotion/src/SponMembersHateIt.tsx`,
`constants-spon-spawn-my-own-members-hate-it.ts`, `captionsSponMembersHateIt.ts`).
Scoped build directives for clip 1: NONE (`clip_directives.py --batch spon --clip 1` = 0 of 0).
No coverage exemption; nothing inherited from siblings.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 7 of 7 frames at t=3..78 s).
- Content-zone cuts (frame-diff rows 0..853 @10 fps): **~10.8, ~12.1, ~14.0, ~17.8, ~25.5, ~59.3 s**.
  - 0-10.8: DexScreener SPON/ETH chart (Robinhood > Uniswap, "SPONGE"). Hook full-screen covers the start.
  - 10.8-12.1: VINCCIROM thesis post on X (brief).
  - 12.1-14.0: a launchpad "Recently Updated Token Info" grid (burned-in chat label "golden is going to melt faces" ships as filmed).
  - 14.0-17.8: token search "spon" results (SPON/ETH SPONGE top row) = receipt of the ticker.
  - 17.8-25.5: a movie fight clip on the screen share (plays under "punch these guys in the balls... Jesus Christ"): kept as BASE, it IS the joke.
  - 25.5-59.3: VINCCIROM "My thesis on $SPON" post, highlighted line by line as Mike reads it = THE receipt for every mechanic and the KNOTS/STONK/PONS math.
  - 59.3-end: DexScreener SPON/ETH market-cap chart (~$52K) = receipt for "I got in at 50K".
- STT (medium.en windows, `_qa/res1.json`): "Pond/Ponds/puns" = **PONS** (on-screen $PONS), "Spawn" = **SPON** (on-screen $SPON, Mike reads the post aloud),
  "stong/dong" = **STONK**, "nots" = **KNOTS** (STONK flipped), "2 .5 %" = **2.5%**, "is 100." = **100x** (clip-plan + stt_caption_fixes).
  Gap scan: 2.26-4.28 is ONE stretched "hating" (medium.en agrees, no omitted words); 18.84-20.72 is voiced by the fight clip / laughter, no words (medium.en agrees);
  50.36-52.22 "660" holds Mike's "666... 660" self-correction (caption keeps the corrected 660).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.10 + 3.10 + 2.50 + 3.50 + 3.60 + 3.60 + 2.90 + 2.37 = **24.67 s of 82.17 s = 30.0 %** (band 25-35 %). Base **70.0 %**.
- **8 b-roll images**, each used once (82 s short; the ~75 s guide is 6-8). Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap.
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges, all on BASE beats.
- Receipts visible in real stretches: search 14.0-17.8 (overlay only), fight clip 17.8-23.9, thesis post 26.4-28.3, 31.8-35.9, 39.5-53.9, 57.5-59.3, chart 59.3-74.5 and 77.4-79.8.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-30, 39 files)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| SPON (Spawn / "SPONGE" on DexScreener) | lesser-known, NO reference | none on disk | generic BLANK neon-lime coin in art; name only in CODE-DRAWN type (cover chip, badges). FLAG: Mike can add a reference |
| PONS (Robinhood Chain launchpad token) | lesser-known, NO reference | none on disk | CODE-DRAWN badges only. FLAG |
| KNOTS | lesser-known, NO reference | none on disk | CODE-DRAWN badge only. FLAG |
| STONK | lesser-known, NO reference | none on disk | CODE-DRAWN badge only. FLAG |
| Robinhood (chain) | WELL-KNOWN brand, not a beat subject | n/a | not drawn; its brand lime (#CCFF00, persona `robinhood_coin`) is the clip accent + coin colour, never Kaspa teal |

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | blank lime coin as a boxing champ in a spotlit ring, booing faceless crowd, green candle wall; empty top for CODE-drawn title "MY OWN / MEMBERS / HATE IT" + chip "I SEE A 100x" | `thumb-spon1-cover.png` | none (blank coin) |
| 1 | 0.03-0.50 | "Some of my" | base | face + chart open (Phase 7 rule 5) | none | |
| 2 | 0.50-3.60 | "own members are actually hating on it" | **FULL (hook)** | angry torch-and-pitchfork mob of faceless silhouettes around a calm lime coin | `broll-spon1-hook-mob.png` | none |
| 3 | 3.60-7.60 | "And they're fighting this project, man. I like it. And it is the first" | base | DexScreener SPON chart | none | |
| 4 | 7.60-10.70 | "token to give dividends of PONS launched on PONS" | content | dividend fountain pouring lime coins into chests | `broll-spon1-dividends.png` | none |
| 5 | 10.70-16.90 | "that people are hating on. In my own community, of all things, I'm going to" | base + badge | thesis post / token grid / "spon" search; badge "$SPON / BUILT ON PONS" 11.10-13.70 | none | |
| 6 | 16.90-18.70 | "punch these guys in the balls" | base + OVERLAY | red boxing glove alpha overlay punches in over the search -> fight-clip cut | `ovl-spon1-glove.png` | |
| 7 | 18.70-23.90 | "man. Jesus Christ. This one would do pretty good." | base | the fight clip (the joke) | none | |
| 8 | 23.90-26.40 | "This will become a nice runner. The first" | content | lime coin in sneakers sprinting up a green-candle track (hides the 25.5 cut) | `broll-spon1-nice-runner.png` | none |
| 9 | 26.40-28.30 | "and only PONS native token that" | base | thesis post, highlight on the line he reads | none | |
| 10 | 28.30-31.80 | "turns trading fees into automatic PONS rewards" | content | fee machine: plain coins in, lime reward coins out, side furnace | `broll-spon1-fee-machine.png` | none |
| 11 | 31.80-35.90 | "and recurring PONS buybacks and burns. Pays PONS every two hours and buys" | base + badge | thesis post; badge "2 HRS / PONS PAID OUT" 33.80-35.60 | none | |
| 12 | 35.90-39.50 | "SPON on the market and burns it every 30 minutes." | content | spinning clock + lime-flame furnace eating a lime coin | `broll-spon1-burn-clock.png` | none |
| 13 | 39.50-53.90 | "Nobody else on chain does this. 2.5% ... KNOTS ... 12 million on a 254 million STONK. PONS is 660 million. By that logic," | base + badges | thesis post (the math is on screen); badges "2.5% / SUPPLY BURNED", "STONK / KNOTS", "$12M / KNOTS vs $254M", "$660M / PONS" | none | |
| 14 | 53.90-57.50 | "PONS native one should be the same size or bigger," | content | colossal gold coin tower vs a tiny lime coin, green arrow up | `broll-spon1-scale-gap.png` | none |
| 15 | 57.50-74.50 | "not 75x smaller. You put in 20 bucks ... damn, I got in at 50K ... absolutely amazing." | base + badges | thesis post -> DexScreener chart (59.3); badges "75x / TOO SMALL", "$50K / YOUR ENTRY" | none | |
| 16 | 74.50-77.40 | "Just a 5 million market cap is 100x." | **FULL (climax)** | lime coin on a giant rocket flame, green candles exploding | `broll-spon1-climax-100x.png` | none |
| 17 | 77.40-79.80 | "You'll be like, yeah, I got in at 50K. So" | base + badge | chart; badge "100x / AT A $5M CAP" | none | |
| 18 | 79.80-82.17 | "never financial advice. Holy crap." | content | shocked cartoon hamster at a laptop with a giant green candle (hard out) | `broll-spon1-holy-crap.png` | none |

## Manifest (zero orphans; reconciled before render)
thumb-spon1-cover.png, broll-spon1-hook-mob.png, broll-spon1-dividends.png, broll-spon1-nice-runner.png,
broll-spon1-fee-machine.png, broll-spon1-burn-clock.png, broll-spon1-scale-gap.png, broll-spon1-climax-100x.png,
broll-spon1-holy-crap.png, ovl-spon1-glove.png (from `ovl-spon1-glove-raw.png` in the clip folder).
Prompts: `broll-list.json` (house style: Pixar 3D CGI, deep navy, rim light; no text/logos; SPON/PONS coins deliberately BLANK lime).
