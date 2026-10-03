# BROLL-PLAN: spon / clip 2 `golden-kitty-too-dispersed-to-rug` (FULL, 64.50 s)

Title: "Golden Kitty Is Too Dispersed to Rug Now"
Spine: `render-assets/golden-kitty-too-dispersed-to-rug.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
last video packet 64.48 s, audio 64.50 s). Comp renders at 30 fps, 1935 frames.
Composition: `SponGoldenKittyTooDispersed` (`remotion/src/SponGoldenKittyTooDispersed.tsx`,
`constants-spon-golden-kitty-too-dispersed-to-rug.ts`, `captionsSponGoldenKittyTooDispersed.ts`).
Scoped build directives for clip 2: NONE (`clip_directives.py --batch spon --clip 2` = 0 of 0), so no
coverage exemption and nothing inherited.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, 13 of 13 frames t=2..62 s).
- Content-zone cuts (frame-diff rows 0..~600 @10 fps): **16.8 s**, **34.5 s**, **56.6 s** (+ a scroll at 58.6).
  - 0-16.8: DEEPDIVE/SPCX DexScreener chart = OFF-TOPIC (previous stream topic). Chat label "good team look it up there bettr".
  - 16.8-34.5: **GOLDEN/GLD DexScreener chart = THE receipt** ("one of the best charts out there"). Kept visible in long stretches.
  - 34.5-56.6: IF/WETH "WHAT IF" chart (a dumped meme chart, reads as "every meme dumps") + the burned-in chat
    label **"Golden kitty going dump hard bet u"** at y~750 = the challenge Mike reads aloud at 34.8. Kept visible while he reads it.
  - 56.6-64.5: SPON/ETH chart + chat label "without a doubt the next billion dollar meme coin" (ships as filmed; fits the close).
- Chat labels at y~720-780 on the left ship as filmed (burned-in screen share rule).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.16 + 2.60 + 3.44 + 3.14 + 2.30 + 3.36 + 3.62 = **21.62 s of 64.50 s = 33.5 %** (band 25-35 %). Base 66.5 %.
- **7 b-roll images**, each used exactly once, no loop. Full-screens: **3** (hook, the "every meme dumps" transition,
  the billion-dollar climax) = the firm cap, never adjacent (no base flash between full-screens).
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges, all on BASE beats.
- The off-topic DEEPDIVE chart (0-16.8) carries the heaviest cover (hook + 2 cutaways); the GOLDEN receipt is mostly base.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-30)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Golden Kitty ($GOLDEN) | lesser-known WITH reference | `schedule-tweets/images/reference/golden-kitty.png` (gold cat trophy statue) | cover + every Golden Kitty beat (all generated WITH the ref) |
No other project is named in the audio. The WHAT IF / SPON / DEEPDIVE charts are on-screen only, never named;
the meme-meteor beat uses deliberately BLANK generic coins.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | statue unshaken on a rug being yanked, empty upper half; CODE title "TOO / DISPERSED / TO RUG" + chip "GOLDEN KITTY AT $4M" | `thumb-gk2-cover.png` | golden-kitty.png |
| 1 | 0.03-0.42 | "You know," | base | face + screen open (Phase 7 rule 5) | none | |
| 2 | 0.42-3.58 | "I'm even open to Golden Kitty like rugged tomorrow," | **FULL (hook)** | shadow hands yank a red rug, the statue does not move | `broll-gk2-hook-rug-yank.png` | golden-kitty.png |
| 3 | 3.58-8.62 | "like if you tell me why, but I don't think it's going to happen, like like Golden Kitty. I don't think," | base | badge "RUG? / NOT HAPPENING" 5.16-7.66 | none (badge) | |
| 4 | 8.62-11.22 | "I think it's just too dispersed for that to happen at this point" | content | thousands of mini kitty statues spread over a holographic globe | `broll-gk2-dispersed-map.png` | golden-kitty.png |
| 5 | 11.22-13.36 | "and it's going to pump. And if we do get a nice" | base | | none | |
| 6 | 13.36-16.80 | "run up and I'm sure it's going to pump, it'll pump really hard." | content | statue riding a green candle rocket | `broll-gk2-candle-rocket.png` | golden-kitty.png |
| 7 | 16.80-23.00 | "I do believe this is probably one of the best plays out there because there's so many" | base | THE GOLDEN chart. Badge "BEST PLAYS / OUT THERE" 19.38-21.68 | none (badge) | |
| 8 | 23.00-26.14 | "influencers that are pushing it. So there's a lot, a lot," | content | faceless silhouette crowd with phones/megaphones hyping the statue on stage | `broll-gk2-influencer-crowd.png` | golden-kitty.png |
| 9 | 26.14-34.50 | "a lot of influencers pushing Golden Kitty and it has like one of the best charts out there because everything else, man, just looks like crap." | base | GOLDEN chart. Alpha overlay: gold crown 31.08-33.46 over the empty plot area | `ovl-gk2-crown.png` (overlay) | |
| 10 | 34.50-39.68 | "Golden Kitty going to dump hard, bet you. I mean, it's possible. I mean," | base | WHAT IF chart + the burned-in chat label he is reading (captions quote-marked as reported speech) | none | |
| 11 | 39.68-41.98 | "what if it goes to a hundred million and then dumps hard?" | content | statue atop a needle-thin green spike with a red cliff drop | `broll-gk2-hundred-million-cliff.png` | golden-kitty.png |
| 12 | 41.98-46.58 | "You know, you get in now at four million and you take profits along the way." | base | badge "GET IN AT $4M / TAKE PROFITS ALONG THE WAY" 43.22-46.22 | none (badge) | |
| 13 | 46.58-49.94 | "Everything is, every meme is going to dump hard. Every meme that we talked about" | **FULL (transition)** | blank meme coins falling as flaming meteors, red crash line | `broll-gk2-memes-dump-meteors.png` | none (generic, blank coins) |
| 14 | 49.94-58.74 | "today eventually is going to dump hard. It's just a matter of when. But the point is, you got to get in, make some money and take some profits. It's a four million market cap right now." | base | WHAT IF (dumped) chart, then SPON chart at 56.6. Badges "MATTER OF WHEN" 50.64-52.70, "TAKE PROFITS / MAKE SOME MONEY" 54.38-56.56 | none (badges) | |
| 15 | 58.74-62.36 | "If this is a billion dollar token, there's a lot of gains" | **FULL (climax)** | colossal statue over a city at dawn, green beams, gold coins | `broll-gk2-billion-colossus.png` | golden-kitty.png |
| 16 | 62.36-64.50 | "that we can make over the course of this bull run." | base | hard out on the face + SPON chart ("next billion dollar meme coin" chat label) | none | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`)
whoosh on the cover cut (0.00), impact on the hook reveal (0.42), ding on the RUG badge, impact into each content
cutaway, whooshes out of the full-screens, ding on the crown overlay, riser-free payoff impact on the climax cut
(58.74). Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-gk2-cover.png`, `broll-gk2-hook-rug-yank.png`, `broll-gk2-dispersed-map.png`, `broll-gk2-candle-rocket.png`,
`broll-gk2-influencer-crowd.png`, `broll-gk2-hundred-million-cliff.png`, `broll-gk2-memes-dump-meteors.png`,
`broll-gk2-billion-colossus.png`, `ovl-gk2-crown.png` (+ its raw source `ovl-gk2-crown-raw.png`, kept OUT of
render-assets). Prompt list: `broll-list.json`.
