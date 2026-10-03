# BROLL-PLAN: uptober / clip 5 `golden-kitty-50-million` (FULL, 31.04 s)

Title: "Golden Kitty Should Totally Go Up, Here Is Why"
Spine: `render-assets/golden-kitty-50-million.mp4` (1080x1920 @25, has_b_frames 0, video 31.040 s, audio 31.066 s).
Comp renders at 30 fps, **931 frames** (last frame 930 = 31.000 s, inside both tracks).
Composition: `UptoberGoldenKitty50M` (`remotion/src/UptoberGoldenKitty50M.tsx`,
`constants-uptober-golden-kitty-50-million.ts`, `captionsUptoberGoldenKitty50M.ts`).
Scoped build directives for clip 5 (`clip_directives.py --batch uptober --clip 5`): **none (0 of 0)**. No coverage exemption.
Prior Golden Kitty shorts (beer-and-kaspa, golden-kitty-dominance x3, spon) used a golden train with zombies, statue + hype
crowd, listing boards, rocket, meteors, needle spike, mini statues on a globe: none of those concepts or files are reused.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 9 of 9 frames t=1..30.5 s; `_qa/measure.py`).
- Content zone = ONE screen the whole clip: DexScreener **GOLDEN/GLD (Market Cap) on Uniswap**, Robinhood chain, chart at
  y ~45-440 reading **4.61M** (the receipt), transactions table y ~470-850, Golden Kitty statue art in the side panel.
- Frame-diff (rows 0..840 @10 fps): events at 1.8, 7.6, 17.8 s = the three segment joins (clip assembled from 4 stream segments)
  where burned-in viewer chat banners appear/disappear at y ~700-775: "chart looking like nice ladder up" 1.8-7.6,
  "Golden kitty can be pretty good meme with organic growth" 17.8-end. They ship as filmed; badges ride above them (top 470).
  The 1.8, 7.6 and 17.8 joins are each covered by a b-roll window (hook / phones / climax).
- STT (medium.en staggered windows, CPU, `_qa/res_stt.json`): "going to" -> "gonna"; the stretched 1.38 s "is" (10.98-12.36)
  hides a "we're probably gonna," false start (not captioned); "cycles, homages" -> "cycle zombies"; "run up" -> "run-up";
  "a big, big pump" doubling kept (PROTECTED_DOUBLES). Patched into `whisper-words-verified.json`. No unexplained gaps.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 2.08 + 2.26 + 1.94 + 2.86 = **9.14 s of 31.03 s = 29.5 %** (band 25-35 %). Base **70.5 %**.
- **4 b-roll images**, each used once (31 s short). Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap.
- Plus 1 real alpha overlay (glow-on-black -> alpha) and 5 code-drawn badges, all on BASE beats.
- Receipt chart visible in real stretches: 0.03-0.88, 2.96-5.44 ("go up just because of the amount of action it"),
  7.70-15.90 ("bulls start running ... 50 million"), 17.84-22.28 ("organic growth", matching the on-screen chat banner),
  25.14-31.03 ("things start pumping ... 10x from here").

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-01: golden-kitty.png present)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Golden Kitty ($GOLDEN) | lesser-known WITH reference | `golden-kitty.png` (polished solid-gold sitting cat statuette; prompt ignores the tweet card) | thumb, hook, phones, climax, zombies: all generated WITH `golden-kitty.png` |
| Robinhood (chain) | WELL-KNOWN, not a beat subject | n/a | not drawn |

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | gold statuette on a gold platform rocketing up a shaft of lime candles; empty top for CODE title "GOLDEN / KITTY / TO $50M?" + chip "$GOLDEN: HERE IS WHY" | `thumb-gk5-cover.png` | golden-kitty.png |
| 1 | 0.03-0.88 | "Golden is gonna" | base | face + GOLDEN chart (Phase 7 rule 5) | none | |
| 2 | 0.88-2.96 | "be pretty damn good. It should totally" | **FULL (hook)** | statuette in front of a blazing treasure hoard in a cave | `broll-gk5-hook-treasure.png` | golden-kitty.png |
| 3 | 2.96-5.44 | "go up just because of the amount of action it" | base + badge | chart; badge "$GOLDEN / SHOULD TOTALLY GO UP" 3.05-4.55 top 470 | none | |
| 4 | 5.44-7.70 | "has going on with influencers and KOLs." | content | ring of phones on ring-light tripods all filming the statuette, hearts/notifications | `broll-gk5-influencer-phones.png` | golden-kitty.png |
| 5 | 7.80-9.50 | "The bulls start running in a couple weeks." | base + OVERLAY | glowing gold bull charging over the transactions table (left), chart clear | `ovl-gk5-bull.png` | |
| 6 | 9.50-14.80 | "I mean, something like Golden Kitty is probably gonna go up to like, you know," | base + badge | chart; badge "$4.6M / MARKET CAP ON THE CHART" 10.40-12.20 | none | |
| 7 | 14.80-15.90 | "like 50 million or something." | base + badge | badge "$50M / THE TARGET" 14.80-15.85 | none | |
| 8 | 15.90-17.84 | "That is gonna be like a big, big pump." | **FULL (climax)** | statuette pumping a colossal green candle balloon into the starry sky | `broll-gk5-climax-pump.png` | golden-kitty.png |
| 9 | 17.84-22.28 | "Golden Kitty could be a pretty good meme with organic growth. Man, I wish we get a run-up" | base + badge | chart + the burned-in "organic growth" chat banner; badge "ORGANIC / GROWTH" 19.46-20.60 top 470 | none | |
| 10 | 22.28-25.14 | "caused by these four-year cycle zombies buying back in" | content | cartoon zombies queueing at a golden ticket booth holding out coins, statuette on the roof | `broll-gk5-zombies-queue.png` | golden-kitty.png |
| 11 | 25.14-31.03 | "and things start pumping. Like something like Golden Kitty and a lot of them, man, are gonna be flying. It's gonna be maybe like 10x from here." | base + badge | chart; badge "10x / FROM HERE" 29.92-31.03 top 470; hard out | none | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (0.88; moved off "is" at 0.54 after the first render read "Golden are gonna"), tight whooshes into each content cutaway (5.44, 22.28; the 5.44 crest moved off "it" after an offline whisper sweep),
a short kick on the bull pop (7.80), dings on the $GOLDEN / $4.6M / $50M / ORGANIC / 10x badges, the payoff impact on the
climax cut (15.90). 11 events. Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-gk5-cover.png`, `broll-gk5-hook-treasure.png`, `broll-gk5-influencer-phones.png`, `broll-gk5-climax-pump.png`,
`broll-gk5-zombies-queue.png`, `ovl-gk5-bull.png` (from `ovl-gk5-bull-raw.png`, kept in the clip folder, OUT of render-assets).
Prompt list: `broll-list.json` (house style: Pixar 3D CGI, deep navy, rim light; golden-kitty.png-anchored statuette; no text).
