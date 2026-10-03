# BROLL-PLAN: spon / clip 3 `september-114x-in-eight-days` (FULL, 57.40 s)

Title: "One Call Did 114x in Eight Days"
Spine: `render-assets/september-114x-in-eight-days.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
video 57.400 s, audio 57.404 s). Comp renders at 30 fps.
Composition: `SponSeptember114x` (`remotion/src/SponSeptember114x.tsx`,
`constants-spon-september-114x-in-eight-days.ts`, `captionsSponSeptember114x.ts`).
Scoped build directives for clip 3: NONE (`clip_directives.py --batch spon --clip 3` = 0 of 1), so no
coverage exemption and nothing inherited.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, 11 of 11 frames t=2..52 s).
- Content-zone cuts (frame-diff rows 0..850 @10 fps): **16.6**, ~24.5, **32.2**, **37.3**, **40.2**, **51.3**, **53.5**.
  - 0-16.6: Crypto Rich "Top Performing Assets" table = THE receipt he reads aloud (PERPSPAD 114x, ETHICS 17x,
    PERPS 15x, STONK 13x, OTC 9x, all "Mike"); rows highlight as he reads. Kept visible 4.45-15.30.
  - 16.6-32.2: DexScreener charts (STOCKER/WETH etc.), NOT the Perps Pad receipt. Cover allowed.
  - **32.2-37.3: a burned-in celebration-crowd meme WITH its own audio** (Mike's stream reaction after "holy crap
    dude"). This is the 5.0 s word gap in whisper-words.json (32.4-37.4): real audio, not missing speech. Base, no captions.
  - 37.3-40.2: chart again. 40.2-51.3: the table scrolled, **552x MYX row** at the top (the "550x on MYX" receipt).
  - **51.3-53.5: a burned-in FULL-FRAME dancing meme** (covers both zones) on "Oh my God". Base.
  - 53.5-57.4: "Top Performing Assets" page heading.
- Chat labels at y~720-780 on the left ship as filmed (burned-in screen-share rule).

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.05 + 3.55 + 2.95 + 2.90 + 3.10 + 2.65 = **18.20 s of 57.40 s = 31.7 %** (band 25-35 %). Base 68.3 %. (month-vs-year tIn moved 42.40 -> 42.90 by the SFX sweep)
- **6 b-roll images**, each used exactly once. Full-screens: **2** (hook, climax), inside the firm cap of 3, 50 s apart.
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges on BASE beats.
- The two burned-in memes (32.2-37.3, 51.3-53.5) are already visual beats: never covered.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 42 files, 2026-09-30)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Solana | WELL-KNOWN | not needed | solana-spaceport beat (named in the prompt, real 3-bar mark) |
| Perps Pad | lesser-known, NO reference | none | CODE-DRAWN type only (cover chip, badges); never in art |
| ETHICS, PERPS, STONK, OTC | lesser-known, NO reference | none | CODE-DRAWN badge type only |
| Peanut ($PNUT) | meme mascot, NO reference | none | generic cartoon squirrel + peanut, no coin/logo drawn; name only in a badge |
| MYX | lesser-known, NO reference | none | CODE-DRAWN badge only |
Flag for Mike: no reference exists for Perps Pad / MYX / PNUT; their names ship as type only.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | 8-step green candle staircase, rocket + fireworks on top, empty upper half; CODE title "ONE CALL / DID 114x / IN 8 DAYS" + chip "PERPS PAD ON SOLANA" | `thumb-s114-cover.png` | none |
| 1 | 0.03-1.40 | "Man, we did so many in the," | base | face + receipt table open (Phase 7 rule 5) | none | |
| 2 | 1.40-4.45 | "like in the beginning, the first two weeks of September," | **FULL (hook)** | calendar grid, first two rows bursting with 14 rockets | `broll-s114-hook-september.png` | none |
| 3 | 4.45-15.30 | "it was crazy. We got Perps Pad, 114x, Ethics as another launch pad, 17x, Perps, 15x, and these are all Solana. The STONK, 13x, OTC, 9x," | base | THE receipt table, rows highlight as read. Badges (top 690, over the unread lower table): "114x / PERPS PAD" 6.30-7.55, "17x / ETHICS" 9.20-10.30, "15x / PERPS" 10.75-11.60, "13x / STONK" 13.05-14.10 | none (badges) | |
| 4 | 15.30-18.85 | "that's why these are all a Solana. One of them we did like 100x," | content | Solana-logo spaceport launching meme rockets (hides the 16.6 cut to an off-topic chart) | `broll-s114-solana-spaceport.png` | none (well-known) |
| 5 | 18.85-24.45 | "like 110x man, 114x. It was on Perps Pad. And that happened in like eight days." | base | chart. Badge "8 DAYS / 114x ON PERPS PAD" 22.35-24.30 (top 640, over the transactions list) | none (badge) | |
| 6 | 24.45-27.40 | "Like when I got into Peanut it was pumping and I was like, I took a chance." | content | cartoon squirrel hugging a peanut riding a green candle | `broll-s114-peanut-pump.png` | none (generic) |
| 7 | 27.40-37.30 | "And I still did a 52x man, holy crap dude." + burned-in crowd meme | base | chart, badge "52x / PEANUT" 29.25-30.95 (top 640); then Mike's own crowd-celebration meme 32.2-37.3 | none (badge) | |
| 8 | 37.30-40.20 | "That's the type of things we be doing in my group. Crazy." | content | faceless silhouette crew cheering on a rooftop under green rockets | `broll-s114-group-crew.png` | none |
| 9 | 40.20-42.90 | "Man, this month has been explosive." | base | table + alpha overlay: green/gold firework burst 40.45-42.25, right side (top 110, left 640, w 380) | `ovl-s114-firework.png` (overlay) | |
| 10 | 42.90-46.00 | "When I keep adding these in, it's probably gonna be more than the entire year of 2025." | content | balance scale: one glowing month page outweighs twelve grey pages | `broll-s114-month-vs-year.png` | none |
| 11 | 46.00-54.75 | "Although there were some good ones. There was a 550x on MYX. Oh my God. Oh my God, oh my God. Crazy right," | base | table with the 552x MYX row; badge "550x / MYX" 48.55-50.45 (top 640); Mike's full-frame dancing meme 51.3-53.5; Top Performing Assets heading | none (badge) | |
| 12 | 54.75-57.40 (tOut 57.55 past the comp end so it never fades out on the last frames) | "that's crazy. That's what you get for joining my group." | **FULL (climax)** | faceless crowd riding a giant green candle rocket into a golden sky, fireworks | `broll-s114-climax-join.png` | none |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copies in `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (1.40), whoosh back to the receipt (4.45), dings on the
114x and 8 DAYS badges, whoosh into the Solana cutaway, impact into the Peanut cutaway, cash register on 52x, ding on
550x, the payoff impact on the climax cut (54.75). Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-s114-cover.png`, `broll-s114-hook-september.png`, `broll-s114-solana-spaceport.png`, `broll-s114-peanut-pump.png`,
`broll-s114-group-crew.png`, `broll-s114-month-vs-year.png`, `broll-s114-climax-join.png`, `ovl-s114-firework.png`
(+ its raw source `ovl-s114-firework-raw.png`, kept OUT of render-assets). Prompt list: `broll-list.json`.
All filenames are unique to this clip (never the beer-and-kaspa `bk4` 114x assets, never sibling `gk2` assets).
