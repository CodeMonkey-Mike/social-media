# BROLL-PLAN: spon / clip 5 `spawn-my-own-members-hate-it-impact` (IMPACT, 30.96 s)

Title: "I Got In at 50K. A 5M Cap Is 100x"
Spine: `render-assets/spawn-my-own-members-hate-it-impact.mp4` (1080x1920 @25, has_b_frames 0, 772 frames,
video 30.960 s, audio 30.944 s). Comp renders at 30 fps, **928 frames** (last frame 927 = 30.900 s, inside both tracks).
Composition: `SponMembersHateImpact` (`remotion/src/SponMembersHateImpact.tsx`,
`constants-spon-spawn-my-own-members-hate-it-impact.ts`, `captionsSponMembersHateImpact.ts`).
Scoped build directives for clip 5 (`clip_directives.py --batch spon --clip 5` = 1 of 2):
`spon-pons-stonk-knots-references` [Mike, 2026-09-30] -> every AI image depicting SPON anchors on
`schedule-tweets/images/reference/spon.png`. No coverage exemption.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, rows 600-1300, 6 of 6 frames t=0..25 s).
- Assembly (clip-plan order 0,2,1) = two splices, visible in BOTH zones: **~4.4 s** and **~16.9 s**.
- Content-zone cuts (frame-diff rows 0..850 @10 fps): **4.4, 5.4, 9.1, 16.9**.
  - 0-4.4: DexScreener SPON/ETH chart (Robinhood > Uniswap, sponge art in the side panel).
  - 4.4-5.4: launchpad "Recently Updated Token Info" grid.
  - 5.4-9.1: token search "spon": top row **SPON/ETH SPONGE, Mkt Cap $54K** = the ticker receipt (y ~100-150).
    Burned-in chat label "golden is going to melt faces" (y ~720-770, left) ships as filmed.
  - 9.1-16.9: a movie fight clip on the screen share, under "punch these guys in the balls, man... Jesus Christ".
    Kept as BASE: it IS the joke. Its own audio fills the 10.08-12.00 word gap (no speech on any decode).
  - 16.9-end: DexScreener SPON/ETH **market-cap** chart (~$52K) = the receipt for "I got in at 50K".
- STT (`_qa/res1.json`, `res2.json`, medium.en + large-v3): "funding" = **fighting** (3/4), "No," = **Now**,
  "is 100" = **100x**; no "I'm gonna" before "Punch". Patched into `whisper-words-verified.json` (+ punctuation, stutter).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.08 (hook) + 3.38 (runner) + 2.94 (climax) = **9.40 s of 30.96 s = 30.4 %** (band 25-35 %). Base **69.6 %**.
- **3 b-roll images** (a 31 s impact cut), each used once. Full-screens: **2** (hook + climax), inside the FIRM 1-3 cap, 22 s apart.
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and 3 code-drawn badges, all on BASE beats.
- Receipts visible in real stretches: chart 0.03-0.74 + 3.82-4.4, search 5.4-9.1 (badge over the unread lower rows),
  fight clip 9.1-13.52, market-cap chart 16.9-23.10 and 26.04-30.96.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-30, 45 entries)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| SPON ("this project" / on-screen $SPON, never said by name here) | lesser-known WITH reference | `spon.png` (lime sponge mascot, holes, bead eyes, smile) | thumb, hook, runner, climax: ALL generated WITH `spon.png` attached; name carried by code-drawn type (cover chip, badge) |
| PONS / STONK / KNOTS | not named in this clip | (refs exist) | not depicted |
| Robinhood (chain) | WELL-KNOWN, not a beat subject | n/a | not drawn; its lime (#CCFF00) is the clip accent (never Kaspa teal) |

## Distinct from clip 1 (same topic, HARD RULE "no duplicate b-roll across same-topic shorts")
Clip 1 (`SponMembersHateIt`, `spon1` assets) owns: pitchfork mob hook, boxing-ring cover, boxing-glove overlay,
sneaker runner, dividend fountain, fee machine, burn clock, scale gap, rocket climax. Clip 5 uses none of those
concepts: thumbs-down hailstorm hook, sunglasses-on-a-coin-throne cover, candle-surfboard runner, coin-absorbing
climax, green-arrow overlay. All filenames `*-smi5-*`.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | SPON sponge in sunglasses, arms crossed, lounging on a heap of gold coins, tiny thumbs-down icons bouncing off it, green candles behind; empty top for CODE title "I GOT IN / AT 50K" + chip "$SPON: 5M CAP = 100x" | `thumb-smi5-cover.png` | spon.png |
| 1 | 0.03-0.74 | "And my own" | base | face + SPON chart open (Phase 7 rule 5) | none | |
| 2 | 0.74-3.82 | "members are actually hating on it and they're fighting this project, man." | **FULL (hook)** | SPON sponge smiling under a tiny umbrella while grumpy storm clouds hail red thumbs-down icons on it | `broll-smi5-hook-hail.png` | spon.png |
| 3 | 3.82-13.52 | "I like it. People are hating on in my own community, of all things. Punch these guys in the balls, man. [fight] Jesus Christ." | base + badge | chart -> grid -> "spon" search (badge "$SPON / THE ONE THEY HATE" 5.60-7.50, top 470, over the unread lower rows; SPON row + chat label clear) -> fight clip (the joke) | none (badge) | |
| 4 | 13.52-16.90 | "This one would do pretty good. This will become a nice runner." | content | SPON sponge surfing a giant green-candlestick surfboard up a rising wave of green candles (hides the fight clip's tail + the 16.9 splice) | `broll-smi5-candle-surf.png` | spon.png |
| 5 | 16.90-23.10 | "And you're gonna be like, damn, I got in at 50K. Now I got in at 50K and that's gonna be like absolutely amazing." | base + badge + OVERLAY | market-cap chart (the ~$52K receipt). Badge "$50K / MY ENTRY" 19.30-20.90 (top 640, over the transactions list); alpha overlay neon green up-arrow 21.40-22.95 (top 150, left 380, w 300) over the flat right of the chart | `ovl-smi5-arrow.png` (overlay) | |
| 6 | 23.10-26.04 | "Just a five million market cap is 100x, and" | **FULL (climax)** | SPON sponge soaking up a golden waterfall of coins, swelling huge and glowing, green arrows bursting up | `broll-smi5-climax-soak.png` | spon.png |
| 7 | 26.04-30.96 | "you'll be like, yeah, I got in at 50K. So never financial advice. Holy crap." | base + badge | chart; badge "100x / 5M CAP FROM 50K" 26.30-28.10 (top 640); "holy crap" on Mike's face, hard out | none (badge) | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (0.74), whoosh back to base (3.82), ding on the $SPON badge,
whoosh into the runner cutaway (13.52), ding on $50K, whoosh with the arrow overlay, the payoff impact on the climax
cut (23.10), ding on 100x. Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-smi5-cover.png`, `broll-smi5-hook-hail.png`, `broll-smi5-candle-surf.png`, `broll-smi5-climax-soak.png`,
`ovl-smi5-arrow.png` (+ its raw source `ovl-smi5-arrow-raw.png`, kept OUT of render-assets). Prompt list: `broll-list.json`.
