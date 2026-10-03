# BROLL-PLAN: spon / clip 1 `spawn-my-own-members-hate-it` (FULL, 82.20 s)

Title: "My Own Members Hate This Token, I See a 100x"
Spine: `render-assets/spawn-my-own-members-hate-it.mp4` (1080x1920 @25, has_b_frames 0, 2047 frames,
video 82.200 s, audio 82.226 s). Comp renders at 30 fps, **2466 frames** (last frame 2465 = 82.167 s, inside both tracks).
Composition: `SponMembersHateIt` (`remotion/src/SponMembersHateIt.tsx`,
`constants-spon-spawn-my-own-members-hate-it.ts`, `captionsSponMembersHateIt.ts`).
Scoped build directives for clip 1 (`clip_directives.py --batch spon --clip 1` = 1 of 2):
`spon-pons-stonk-knots-references` [Mike, 2026-09-30] -> every AI image depicting SPON / PONS / STONK / KNOTS
anchors on its OWN reference file. No coverage exemption. Nothing inherited from siblings.
(Supersedes `BROLL-PLAN.superseded-no-refs.md`, written before the directive existed, which planned blank coins.)

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 7 of 7 frames t=3..78 s; `_qa/measure.py`).
- Content-zone cuts (frame-diff rows 0..840 @10 fps, re-measured this run): **10.8, 12.1, 14.0, 17.8, 25.5, 59.3 s**
  (17.8-23.5 is the fight clip's own motion).
  - 0-10.8: DexScreener SPON/ETH chart (Robinhood > Uniswap, sponge art in the side panel).
  - 10.8-12.1: VINCCIROM "My thesis on $SPON" post (top).
  - 12.1-14.0: launchpad "Recently Updated Token Info" grid (burned-in chat label "golden is going to melt faces" ships as filmed).
  - 14.0-17.8: token search "spon": top row SPON/ETH SPONGE = the ticker receipt.
  - 17.8-25.5: a movie fight clip on the screen share (under "punch these guys in the balls... Jesus Christ"): BASE, it IS the joke.
  - 25.5-59.3: the thesis post, highlighted line by line as Mike reads it (highlight at y ~250-370) = THE receipt for every mechanic and the KNOTS/STONK/PONS math.
  - 59.3-end: DexScreener SPON/ETH market-cap chart (~$52K) = the receipt for "I got in at 50K".
- STT (medium.en windows, `_qa/res1.json`): Pond/Ponds/puns = **PONS**, Spawn = **SPON**, stong/dong = **STONK**, nots = **KNOTS**,
  "2 .5 %" = **2.5%**, "is 100." = **100x**, "No," = **Now**, "trade to" = **trades at**, and the base pass's "I'm going to" before
  "punch" is a hallucination (both medium.en windows over 15-23 s omit it). Patched into `whisper-words-verified.json`.
  Gap scan: 2.26-4.28 is ONE stretched "hating"; 18.84-20.72 is the fight clip's audio, no words (caption band blanked at 19.25).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.00 + 3.15 + 2.40 + 3.40 + 3.08 + 3.34 + 3.20 + 2.78 = **24.35 s of 82.20 s = 29.6 %** (band 25-35 %). Base **70.4 %**.
- **8 b-roll images**, each used once (82 s short; ~75 s guide = 6-8). Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap.
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and 9 code-drawn badges, all on BASE beats.
- Receipts visible in real stretches: chart 0.03-1.28 + 4.28-7.60, thesis/grid/search 10.75-23.90 (fight clip included),
  thesis post 26.30-35.90, 39.30-44.02, 47.10-53.86, 57.20-59.3, market-cap chart 59.3-63.40, 66.60-74.50, 77.28-82.2.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-30: spon.png, pons.png, stonk.png, knots.png present)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| SPON (Whisper "Spawn") | lesser-known WITH reference | `spon.png` (lime sponge mascot, holes, bead eyes, smile) | thumb, hook, dividends, runner, burn, scale-gap, takeoff, climax: generated WITH `spon.png` |
| PONS (Whisper "Pond/Ponds") | lesser-known WITH reference | `pons.png` (sage-green glass/chrome rounded "P") | dividends coins, scale-gap monolith, takeoff pedestal: generated WITH `pons.png` |
| STONK (Whisper "stong") | lesser-known WITH reference | `stonk.png` (light-blue socks, top one pointing RIGHT) | sock-mirror (the logo in front of the mirror): generated WITH `stonk.png` |
| KNOTS (Whisper "nots") | lesser-known WITH reference | `knots.png` (icy-blue socks, top one pointing LEFT) | sock-mirror (the reflection): generated WITH `knots.png` (own file, never swapped) |
| Robinhood (chain) | WELL-KNOWN, not a beat subject | n/a | not drawn; its lime (#CCFF00) is the clip accent (never Kaspa teal) |

## Distinct from clip 5 (same topic, HARD RULE "no duplicate b-roll across same-topic shorts")
Clip 5 (`SponMembersHateImpact`, `smi5` assets) owns: sunglasses-on-a-coin-heap cover, thumbs-down hailstorm hook,
candle-surfboard runner, coin-waterfall soak climax, green-arrow overlay. Clip 1 uses none of those: boxing-ring cover,
pitchfork-mob hook, sneaker racetrack runner, candle-mountain summit climax, boxing-glove overlay. All filenames `*-spon1-*`.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | SPON sponge as a boxing champ (red gloves, gold belt) in a spotlit ring, booing faceless silhouette crowd, green candle wall; empty top for CODE title "MY OWN / MEMBERS / HATE IT" + chip "$SPON: I SEE A 100x" | `thumb-spon1-cover.png` | spon.png |
| 1 | 0.03-1.28 | "Some of my own" | base | face + SPON chart open (Phase 7 rule 5) | none | |
| 2 | 1.28-4.28 | "members are actually hating" | **FULL (hook)** | torch-and-pitchfork shadow mob around a calm smiling SPON sponge | `broll-spon1-hook-mob.png` | spon.png |
| 3 | 4.28-7.60 | "on it. And they're fighting this project, man. I like it. And it is the" | base | SPON chart | none | |
| 4 | 7.60-10.75 | "first token to give dividends of PONS" | content | SPON sponge squeezing itself, PONS-P glass coins gushing into treasure chests | `broll-spon1-dividends.png` | spon.png + pons.png |
| 5 | 10.75-16.95 | "launched on PONS that people are hating on. In my own community, of all things," | base + badge | thesis post -> grid -> "spon" search; badge "$SPON / LAUNCHED ON PONS" 11.00-12.90 (top 580) | none | |
| 6 | 16.95-18.40 | "punch these guys in the balls" | base + OVERLAY | red boxing glove alpha overlay punches in over the search results, across the 17.8 cut | `ovl-spon1-glove.png` | |
| 7 | 18.40-23.90 | "man. Jesus Christ. This one would do pretty good." | base | the fight clip (the joke) | none | |
| 8 | 23.90-26.30 | "This will become a nice runner. The first" | content | SPON sponge in sneakers sprinting up a candle racetrack past grey blank coins (hides the 25.5 cut) | `broll-spon1-nice-runner.png` | spon.png |
| 9 | 26.30-35.90 | "and only PONS native token that turns trading fees into automatic PONS rewards and recurring PONS buybacks and burns. Pays PONS every two hours and buys" | base + badge | thesis post read line by line; badge "$PONS / PAID EVERY 2 HOURS" 33.70-35.50 | none | |
| 10 | 35.90-39.30 | "SPON on the market and burns it every 30 minutes." | content | SPON sponge stoking a lime-flame furnace with sponge cubes under a giant stopwatch | `broll-spon1-burn-furnace.png` | spon.png |
| 11 | 39.30-44.02 | "Nobody else on chain does this. 2.5% of supply already gone." | base + badge | thesis post; badge "2.5% / OF SUPPLY BURNED" 41.80-43.60 | none | |
| 12 | 44.02-47.10 | "So you flip around STONK and you get the word KNOTS" | content | STONK sock logo before a magic mirror whose reflection is the KNOTS sock logo | `broll-spon1-sock-mirror.png` | stonk.png + knots.png |
| 13 | 47.10-53.86 | "and trades at 12 million on a 254 million STONK. PONS is 660 million. By that logic," | base + badges | thesis post (the math, highlighted); badges "$12M / KNOTS ON A $254M STONK" 47.40-49.40, "$660M / PONS MARKET CAP" 50.10-52.30 | none | |
| 14 | 53.86-57.20 | "PONS native one should be the same size or bigger," | content | skyscraper PONS glass P towering over a tiny SPON sponge, green arrow up | `broll-spon1-scale-gap.png` | pons.png + spon.png |
| 15 | 57.20-63.40 | "not 75x smaller. You put in 20 bucks and you might lose it. But if you got in" | base + badges | thesis post -> market-cap chart (59.3); badges "75x / TOO SMALL" 57.60-59.25, "$20 / ALL YOU RISK" 59.70-61.60 | none | |
| 16 | 63.40-66.60 | "now and this does take off and it becomes like the KNOTS" | content | SPON sponge blasting off on a jetpack from a PONS-P launch pedestal | `broll-spon1-takeoff.png` | spon.png + pons.png |
| 17 | 66.60-74.50 | "equivalent on PONS, then you're gonna be like, damn, I got in at 50K. Now I got in at 50K. And that's gonna be like absolutely amazing." | base + badge | market-cap chart (~$52K receipt); badge "$50K / YOUR ENTRY" 70.70-72.50 | none | |
| 18 | 74.50-77.28 | "Just a 5 million market cap is 100x." | **FULL (climax)** | SPON sponge planting a flag on a mountain of green candles, green fireworks, gold coin rain | `broll-spon1-climax-summit.png` | spon.png |
| 19 | 77.28-82.20 | "You'll be like, yeah, I got in at 50K. So never financial advice. Holy crap." | base + badge | chart; badge "100x / 5M CAP FROM 50K" 77.60-79.40; "holy crap" on Mike's face, hard out | none | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (1.28), whooshes into/out of each cutaway, dings on the
$SPON / $PONS / 2.5% / 75x / 100x badges, a kick impact on the glove "punch", cash register on $50K, the payoff
impact on the climax cut (74.50). 17 events (the $660M ding was deleted after the masking sweep). Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-spon1-cover.png`, `broll-spon1-hook-mob.png`, `broll-spon1-dividends.png`, `broll-spon1-nice-runner.png`,
`broll-spon1-burn-furnace.png`, `broll-spon1-sock-mirror.png`, `broll-spon1-scale-gap.png`, `broll-spon1-takeoff.png`,
`broll-spon1-climax-summit.png`, `ovl-spon1-glove.png` (from `ovl-spon1-glove-raw.png`, kept OUT of render-assets; made with the sanctioned
Higgsfield `gpt_image_2` fallback because ChatGPT answered HTTP 429 (image cap) on 3 tries after the 9 b-roll images).
Prompt list: `broll-list.json` (house style: Pixar 3D CGI, deep navy, rim light; reference-anchored marks; no text).
