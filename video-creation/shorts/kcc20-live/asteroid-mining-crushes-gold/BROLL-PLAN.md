# BROLL-PLAN: kcc20-live / clip 4 `asteroid-mining-crushes-gold` (FULL, 29.20 s)

Title (clip-plan): "Spaceships Mining Asteroids Will Plummet the Value of Gold"
Spine: `asteroid-mining-crushes-gold-final.mp4` (staged as `render-assets/asteroid-mining-crushes-gold.mp4`, 25 fps, 1080x1920, no B-frames, video 29.200 s / audio 29.187 s)
Base: TradingView BTC/USD daily chart + watchlist (content zone 0..854, seam MEASURED 853/854 on 6 frames) over Mike's webcam.
A burned-in viewer chat banner ("@basicforge" + "inflation is debasement... gold and silver") sits on the base for the WHOLE clip: the handle pill (x 0-117, y 692-721, measured on 4 frames) is redacted with a narrow plate; the on-topic comment text stays.
Directives for clip 4 (`clip_directives.py --batch kcc20-live --clip 4`): none. No coverage exemption.
Comp prefix `kl4` (kcc20-live clip 4). Composition id `Kcc20LiveAsteroidGold`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-22)
| Named in clip | Bucket | Action |
|---|---|---|
| China | country (flag, not a brand) | Named explicitly in the prompt (red flag of China with yellow stars) |
| United States / US dollar | country / currency | Generic green dollar bill with NO portrait (no real-person face), only a $ sign |
| stablecoins | generic category, no project named | Generic glowing coins marked only with a $ sign (no USDT/USDC mark invented) |
| gold, oil | commodities | generic |
No crypto project / lesser-known brand is spoken, so no reference file applies. No real-person face anywhere (all figures faceless).

## Budget
Images: 5 b-roll beats (2 full-screen = hook + climax, firm cap 3) + 1 alpha overlay + frame-0 cover.
B-roll time = 2.74 + 2.08 + 1.76 + 1.82 + 1.56 = 9.96 s of 29.20 s = **34.1 % b-roll / 65.9 % base** (band 25-35 %).
Base-showing beats are deliberate: the BTC chart + the viewer's "money = gold and silver" comment are the macro/market visual itself.
No two full-screens are within 1.5 s of each other (hook ends 4.14, climax starts 27.64). No butted beats.
Each image is unique in the batch (clip 2 already used a vault-door / SpaceX Starship; this clip's ship is a mining craft on an asteroid, its vault is China's treasury).

## Beats (seconds on the spine; word edges from whisper-words-verified.json cross-checked against medium.en)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar asteroid split open on a solid-gold core, mining ship beaming gold aboard, gold bar cracking; code title "SPACESHIPS WILL CRASH GOLD" + chip "WHO GETS WRECKED?" | `thumb-kl4-cover.png` |
| 1 | 0.03-1.40 | "We're not far off from" | base | Mike + BTC chart (cold open on the base) | - |
| 2 | 1.40-4.14 | "spaceships going to asteroids and mining gold." | **FULL (hook)** | Pixar mining spaceship clamped onto an asteroid, drill arms tearing out glowing gold, Earth behind | `broll-kl4-hook-asteroid-ship.png` |
| 3 | 4.14-4.84 | "In other words, like," | base | - | - |
| 4 | 4.84-6.20 | "plummet the value of gold." | badge | RED "GOLD VALUE / PLUMMETS" | code |
| 5 | 6.20-7.40 | "China has been recently" | base | BTC chart | - |
| 6 | 7.40-9.48 | "buying a whole bunch of gold." | content | Pixar Chinese treasury vault: walls of gold bars, red lanterns, flag of China, robot forklifts hauling more | `broll-kl4-china-gold.png` |
| 7 | 9.48-12.44 | "And it seems like the United States is trying to" | base | BTC chart | - |
| 8 | 12.44-15.38 | "shift the backing of the US dollar from" | badge | YELLOW "US DOLLAR / NEW BACKING" | code |
| 9 | 15.44-17.20 | "oil to stable coins." | content | Pixar crane lifting a giant (portrait-free) dollar bill off grimy oil barrels onto a glowing platform of $ coins | `broll-kl4-oil-to-stablecoin.png` |
| 10 | 17.24-19.36 | "Because the stable coins are going to be like the" | overlay (alpha) | glowing neon green/cyan $ coin floating over the BTC chart (real alpha PNG) | `ovl-kl4-stablecoin.png` |
| 11 | 19.40-21.84 | "way to transfer money in the foreseeable future." | badge | GREEN "STABLECOINS / MOVE MONEY" | code |
| 12 | 21.84-23.04 | "And then if suddenly" | base | BTC chart | - |
| 13 | 23.04-24.86 | "gold gets devalued dramatically," | content | Pixar gold bar cracking into grey dust under a smashing red down-arrow | `broll-kl4-gold-devalued.png` |
| 14 | 24.86-25.76 | "countries that are like" | base | - | - |
| 15 | 25.76-27.60 | "trying to hoard gold right now," | badge | YELLOW "HOARDING / GOLD NOW" | code |
| 16 | 27.64-end | "are the ones that are going to be like, out of luck." | **FULL (climax)** | Pixar faceless crowned hoarder slumped on a fading gold mountain while mining ships pour endless asteroid gold through the skylight, rain cloud overhead | `broll-kl4-climax-hoard.png` |

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut |
| hook full 1.40 | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` | short hit, no ring under "spaceships" |
| PLUMMETS badge 4.84 | `ding/sudden-shock-tight.wav` | twist jolt |
| China gold 7.40 | `transition_rapid_whoosh-tight.wav` | b-roll ingress |
| US DOLLAR badge 12.44 | `accents/accent-timpani-clicker-01-b.wav` | punctuation |
| oil->stablecoin 15.44 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| stablecoin overlay 17.24 | `Cash Register-ching.wav` | money keyword pop |
| STABLECOINS badge 19.40 | `kinetic-text/swoosh-2.wav` | keyword pop |
| gold devalued 23.04 | `Boom - Big Reveal-short.wav` (dur 0.40) | reveal |
| HOARDING badge 25.76 | `kinetic-text/knock-pop.wav` | keyword pop |
| climax full 27.64 | `Impacts/Impact_Hit_01-2-short.wav` | climax hit |
All levels whisper-verified on the final mix against an encode-matched control (SKILL row 7a).
