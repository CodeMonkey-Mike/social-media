# BROLL-PLAN: best-time / clip 2 `ton-billion-users-at-1-26` (FULL, 37.40 s)

Title (clip-plan): "A Billion Users and $TON Is at $1.26?"
Spine: `ton-billion-users-at-1-26-final.mp4` (staged as `render-assets/ton-billion-users-at-1-26.mp4`, 25 fps source, comp 30 fps, 1080x1920)
Base: Mike's deck ("gems list" GRAM row 0-3 s, "From Telegram to the community" 3-6 s, the "Distribution" slide 6-22 s with the
spoken line highlighted as he reads it), then the CoinMarketCap Gram (prev. Toncoin) chart 24-37 s. Content zone 0..854
(seam MEASURED 853/854 on 6 frames, t = 2/8/15/22/27/33 s) over Mike's webcam.
Directives for clip 2 (`clip_directives.py --batch best-time --clip 2`): none. No coverage exemption.
Comp prefix `bt2` (best-time clip 2). Composition id `BestTimeTonBillionUsers`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-27)
| Named in clip | Bucket | Action |
|---|---|---|
| TON / Gram / Toncoin | reference ON DISK: `toncoin-ton.png` | every TON beat (hook, mini apps, distribution, climax, cover) generated WITH the reference attached |
| Telegram | WELL-KNOWN brand | named explicitly in the prompt (blue paper-plane logo), no reference needed |
No other project is spoken. No real-person face anywhere (Pavel Durov must NOT appear; all figures faceless).

## Budget
Images: 5 b-roll beats (2 full-screen = hook + climax, firm cap 3) + frame-0 cover image.
B-roll time = 2.28 + 2.50 + 2.86 + 2.36 + 2.36 = 12.36 s of 37.40 s = **33.0 % b-roll / 67.0 % base** (band 25-35 %).
Base-showing beats are deliberate: the Distribution slide highlights each line AS Mike reads it (the wallet line 16.8-20.0
stays visible), and the CMC chart 22.4-33.8 is exactly what he is pointing at ($1.26 now, "up here" the $7.88 ATH):
two code badges punctuate that stretch instead of covering it. Full-screens are 30 s apart.

## Beats (seconds on the spine; word times from whisper-words-verified.json)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar giant TON coin (reference) towering over a sea of glowing phones; code title "A BILLION USERS. $TON AT $1.26?" chip "GRAM / TON" | `thumb-bt2-cover.png` |
| 1 | 0.03-0.84 | "very, very" | base | Mike + gems list (GRAM row) cold open | - |
| 2 | 0.84-3.12 | "bullish on Gram, on TON" | **FULL (hook)** | Pixar giant glowing TON coin (reference) blasting upward like a rocket out of a Telegram-blue cityscape | `broll-bt2-hook-ton-launch.png` |
| 3 | 3.12-6.92 | "for a number of reasons, especially the distribution it has, right?" | base | timeline + Distribution slide | - |
| 4 | 6.92-9.42 | "over a billion monthly users on Telegram" | content | Pixar planet Earth wrapped in a billion tiny glowing phones, each showing the blue Telegram paper-plane | `broll-bt2-billion-users.png` |
| 5 | 9.42-13.92 | "is the one that started The Open Network, TON, and that's Telegram's blockchain" | base | Distribution slide | - |
| 6 | 13.92-16.78 | "every crypto mini app in Telegram has to run on TON" | content | Pixar giant smartphone, dozens of tiny mini-app tiles all plugged by glowing cables into one TON coin (reference) | `broll-bt2-mini-apps.png` |
| 7 | 16.78-20.00 | "the built-in Gram wallet is rolled out to the user base." | base | slide highlights the wallet line as he reads it | - |
| 8 | 20.00-22.36 | "So they have the distribution, right?" | content | Pixar fleet of blue paper planes carrying TON coins (reference) to tiny houses across a night globe | `broll-bt2-distribution.png` |
| 9 | 22.36-24.30 | "I think it's a really good play. So yeah," | base | slide -> CMC chart | - |
| 10 | 24.40-26.10 | "it's $1.26 right now" | badge | YELLOW "$1.26" / sub "RIGHT NOW" | code |
| 11 | 26.10-29.66 | "and you know like up here, all-time high, we're talking about" | base | CMC chart (he points at the ATH) | - |
| 12 | 29.66-31.80 | "$7.88" | badge | GREEN "ALL-TIME HIGH" / "$7.88" | code |
| 13 | 31.80-33.84 | "Wow. Well, you know, it's one of those things, it's" | base | CMC chart + reaction | - |
| 14 | 33.84-36.20 | "probably gonna beat its all-time high." | **FULL (climax)** | Pixar TON coin rocket (reference) smashing up through a glass ceiling, shards flying, chart line exploding upward | `broll-bt2-climax-ath-smash.png` |
| 15 | 36.20-end | "I don't know if you can get better than this." | base | close on Mike + chart | - |

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut |
| hook full-screen 0.84 | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` (dur trimmed) | hook hit |
| billion users 6.92 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| mini apps 13.92 | `kinetic-text/swoosh-2.wav` (dur trimmed) | b-roll ingress |
| distribution 20.00 | `transition_rapid_whoosh-tight.wav` | b-roll ingress |
| $1.26 badge 24.40 | `Cash Register-ching.wav` | price reveal |
| riser into the ATH | `Riser Sound Effect-2s.wav` | builds into the $7.88 badge |
| ATH badge 29.66 | `Impacts/Kick_Impact_01-tight.wav` | stat hit |
| climax full 33.84 | `Impacts/Impact_Hit_01-2-short.wav` | climax hit |
All levels whisper-checked on the final mix against an encode-matched control (SKILL row 7a).
