# BROLL-PLAN: spon / clip 4 `zombies-pushed-btc-back-above-50-week` (FULL, 38.26 s)

Title: "The Zombies Pushed BTC Back Above the 50-Week SMA"
Spine: `render-assets/zombies-pushed-btc-back-above-50-week.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
954 video frames = 38.24 s, audio 38.258 s). Comp renders at 30 fps, 1147 frames.
Composition: `SponZombiesAbove50Week` (`remotion/src/SponZombiesAbove50Week.tsx`,
`constants-spon-zombies-pushed-btc-back-above-50-week.ts`, `captionsSponZombiesAbove50Week.ts`).
Scoped build directives for clip 4 (`clip_directives.py --batch spon --clip 4`): ONE, `cowen-reference`
(any AI image depicting Benjamin Cowen must anchor on `schedule-tweets/images/reference/Benjamin-Cowen.png`).
No coverage exemption, nothing inherited.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient, largest step at the 853/854 boundary on 10 of 10
  frames t=2..37 s). Same as clip 2.
- Content-zone cuts (frame-diff rows 0..600 @10 fps): ONE, at **34.2 s**.
  - 0-34.2: ROBINCAT/USDG DexScreener chart + burned-in chat label "golden is going to melt faces" (y~700-780,
    left). OFF-TOPIC for this clip (Mike is talking Bitcoin / the 50-week SMA; the chart is a meme coin).
  - 34.2-38.26: SPON chart + chat label "without a doubt the next billion dollar meme coin" (also off-topic).
- Webcam: Mike low in frame, hands on head for most of 2-14 s (ships as filmed).
- Chat labels ship as filmed (burned-in screen-share rule). Badges sit in the band centred 380 (~285-475), clear of them.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
The screen-share is off-message for the whole clip, so coverage sits at the UPPER edge of the band, NOT above it
(an off-message screen is not a license to blanket): long base stretches remain, carried by code-drawn badges
and one real alpha overlay.
- b-roll: 2.94 + 2.44 + 2.30 + 2.74 + 2.96 = **13.38 s of 38.23 s = 35.0 %** (band 25-35 %). Base 65.0 %.
- **5 b-roll images**, each used exactly once, no loop. Full-screens: **2** (hook, climax), never adjacent.
- 1 real alpha overlay (glow-on-black -> alpha-from-luminance) + 5 code-drawn badges, all on BASE beats.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-09-30, 44 entries)
| Named in audio | Bucket | Reference | Used on |
|---|---|---|---|
| Bitcoin | WELL-KNOWN brand | none needed (named explicitly in prompts, real orange B mark expected) | cover, hook, 50-week push, November, climax, overlay |
| Benjamin Cowen (Whisper: "Cowan") | real person WITH reference (scoped directive `cowen-reference`) | `schedule-tweets/images/reference/Benjamin-Cowen.png` | the "perplexed" beat, generated WITH the ref (stylized, likeness anchored on it) |
No other project is named. The ROBINCAT / SPON charts are on-screen only, never named.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | zombie horde pushing a giant Bitcoin coin up over a glowing orange line, empty upper half; CODE title "THE ZOMBIES / ARE BUYING / BACK IN" + chip "BTC BACK ABOVE THE 50-WEEK" | `thumb-zb4-cover.png` | none (Bitcoin named) |
| 1 | 0.03-0.46 | "All these" | base | face + screen open (Phase 7 rule 5) | none | |
| 2 | 0.46-3.40 | "four year cycle zombies, right? They're gonna be buying back in." | **FULL (hook)** | long queue of cartoon zombies shuffling up to a glowing Bitcoin buy kiosk, cash in hand | `broll-zb4-hook-zombie-queue.png` | none (Bitcoin named) |
| 3 | 3.40-6.54 | "And I think they already are buying back in. They've been doing it. They already" | base | badge "ALREADY / BUYING BACK IN" 3.80-6.16 | none (badge) | |
| 4 | 6.54-8.98 | "pushed us above the 50 week moving average." | content | zombies shoving a giant Bitcoin coin up and over a thick glowing orange moving-average line | `broll-zb4-push-above-50w.png` | none (Bitcoin named) |
| 5 | 8.98-14.06 | "They pushed us above the Bitcoin's May swing high. And we're staying above it. And" | base | badge "ABOVE / MAY SWING HIGH" 10.34-13.76 | none (badge) | |
| 6 | 14.06-16.36 | "Benjamin Cowen says he's absolutely perplexed" | content | stylized Cowen, puzzled, scratching his head at a Bitcoin chart breaking back above the orange line | `broll-zb4-cowen-perplexed.png` | Benjamin-Cowen.png |
| 7 | 16.36-19.92 | "by it. And I'm just like, is these four year cycle zombies? They pushed us" | base | alpha overlay: glowing zombie hand clutching a Bitcoin coin, bursting up in the empty plot area 17.56-19.60 | `ovl-zb4-zombie-hand.png` (overlay) | |
| 8 | 19.92-22.66 | "below the 50 week moving average last November." | content | snowy night, zombies dragging a Bitcoin coin DOWN under the glowing orange line, red candles | `broll-zb4-below-november.png` | none (Bitcoin named) |
| 9 | 22.66-34.30 | "So now they're pushing us back above it because they checked out for the bear market. Some of them already realized that the bottom is already in. So they're trying to front run the quote unquote bottom in October and get in." | base | badges "50-WEEK / BACK ABOVE IT" 23.46-25.66, "BOTTOM / IS ALREADY IN" 27.42-29.92, "OCTOBER BOTTOM / FRONT-RUN IT" 30.82-34.20 | none (badges) | |
| 10 | 34.30-37.26 | "Hordes and hordes of four year cycle zombies are gonna be going" | **FULL (climax)** | endless horde stampeding over autumn hills toward a colossal Bitcoin rising like a sun | `broll-zb4-climax-hordes.png` | none (Bitcoin named) |
| 11 | 37.26-38.26 | "buying back in." | base | hard out on the face | none | |

## SFX (crest-aligned; library `video-creation/assets/sfx/`)
whoosh on the cover cut (0.00), impact on the hook reveal (0.46), whoosh back to base (3.40), dings on the badges,
impacts into the content cutaways, a record-scratch-style shock on the Cowen "perplexed" beat, ding on the overlay,
the payoff impact on the 34.30 climax cut (tail trimmed to 0.55 s; the planned riser was DELETED after the
whisper sweep showed it masking "Hordes" at every gain/timing). 11 events. Final list + whisper-sweep notes live in the constants file.

## Manifest (zero orphans)
`thumb-zb4-cover.png`, `broll-zb4-hook-zombie-queue.png`, `broll-zb4-push-above-50w.png`,
`broll-zb4-cowen-perplexed.png`, `broll-zb4-below-november.png`, `broll-zb4-climax-hordes.png`,
`ovl-zb4-zombie-hand.png` (+ its raw source `ovl-zb4-zombie-hand-raw.png`, kept OUT of render-assets).
Prompt list: `broll-list.json`.
