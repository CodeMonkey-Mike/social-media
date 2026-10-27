# BROLL-PLAN: kcc20-live / clip 2 `last-chance-to-own-assets` (FULL, 31.52 s)

Title (clip-plan): "This Could Be Your Last Chance to Get In on Assets"
Spine: `last-chance-to-own-assets-final.mp4` (staged as `render-assets/last-chance-to-own-assets.mp4`, 25 fps, 1080x1920, no B-frames)
Base: TradingView BTC/USD daily chart + watchlist (content zone 0..854, seam MEASURED 853/854 on 6 frames) over Mike's webcam.
Directives for clip 2 (`clip_directives.py --batch kcc20-live --clip 2`): none. No coverage exemption.
Comp prefix `kl2` (kcc20-live clip 2). Composition id `Kcc20LiveLastChance`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-22)
| Named in clip | Bucket | Action |
|---|---|---|
| SpaceX | WELL-KNOWN brand, no file on disk | Named explicitly in the prompt (real Starship) |
| Tesla | NOT spoken in the final spine (tighten removed "or Tesla"; medium.en re-decode) | not depicted |
| Bitcoin (on the base chart; hook vault coin) | WELL-KNOWN | Named explicitly (orange, the B symbol) |
No lesser-known project is spoken. No real-person face anywhere (Elon Musk must NOT appear; all figures faceless).

## Budget
Images: 5 b-roll beats (2 full-screen = hook + climax, firm cap 3) + 1 alpha overlay + frame-0 cover.
B-roll time = 1.70 + 2.06 + 2.12 + 1.78 + 2.62 = 10.28 s of 31.52 s = **32.6 % b-roll / 67.4 % base** (band 25-35 %).
Base-showing beats are deliberate: the BTC chart IS the "insane bull run / general markets" visual.
No two full-screens are within 1.5 s of each other (hook ends 2.56, climax starts 28.90).

## Beats (seconds on the spine; word times from whisper-words-verified.json: STT garbles patched, medium.en re-decode)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar hourglass of glowing gold coins almost run out, lone faceless figure; code title "YOUR LAST CHANCE TO OWN ASSETS" | `thumb-kl2-cover.png` |
| 1 | 0.04-0.86 | "this could be your" | base | Mike + BTC chart (cold open on the base) | - |
| 2 | 0.86-2.56 | "last chance to get in on all these assets." | **FULL (hook)** | Pixar colossal vault door swinging shut, gold bars / Bitcoin coin / tiny house / green chart inside, faceless runner | `broll-kl2-hook-vault.png` |
| 3 | 2.56-3.22 | "We might have this" | base | BTC chart | - |
| 4 | 3.22-5.02 | "insane bull run right now," | overlay (alpha) | neon-green glowing bull charging over the BTC chart (real alpha PNG) | `ovl-kl2-bull.png` |
| 5 | 5.06-7.00 | "bigger than anything the world has ever experienced." | badge | YELLOW "BIGGER THAN / ANYTHING EVER" over the chart | code |
| 6 | 7.00-10.12 | "Not just crypto, but in general markets, you know, because it might be" | base | BTC chart (the market itself) | - |
| 7 | 10.12-11.86 | "insanely difficult going forward." | badge | RED "INSANELY / DIFFICULT" sub "GOING FORWARD" | code |
| 8 | 11.86-14.46 | "We could return, like for the most part," | base | BTC chart | - |
| 9 | 14.46-16.52 | "in a similar fashion to how feudalism" | content | Pixar medieval castle lit on a hill, faceless peasant silhouettes in the dark fields below | `broll-kl2-feudal-castle.png` |
| 10 | 16.52-19.00 | "like will be so insanely difficult to get" | base | BTC chart | - |
| 11 | 19.00-21.62 | "ahead and then grow a large business. You don't have assets." | badge | RED "NO ASSETS" / "NO WAY UP" | code |
| 12 | 21.62-22.38 | "If everything," | base | - | - |
| 13 | 22.38-24.50 | "everything is so goddamn cheap, everything you possibly" | content | Pixar automated robot factory pouring an avalanche of products, blank price tags | `broll-kl2-cheap-everything.png` |
| 14 | 24.50-27.12 | "need is so cheap. How does the average person invest in something that can" | base | BTC chart | - |
| 15 | 27.12-28.90 | "grow into something like SpaceX?" | content | SpaceX Starship lifting off, faceless ordinary person locked behind a chain-link fence | `broll-kl2-spacex-fence.png` |
| 16 | 28.90-end | "There's almost like some sort of futuristic feudalism. Could be the last chance." | **FULL (climax)** | Pixar floating glass-and-gold citadel behind an energy wall, faceless crowds in a dim neon slum below | `broll-kl2-climax-future-feudal.png` |

Content 15 -> full 16 butt at 28.90 (hard cut, BrollLayer adjacency).

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut |
| hook full-screen 0.86 | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` | short, no long ring under "last chance" |
| bull overlay 3.22 | `kinetic-text/swoosh-2.wav` | icon pop |
| BIGGER badge 5.06 | `Impacts/Kick_Impact_01-tight.wav` | stat hit (swept: -short tail garbled "the world has ever experienced"; -tight = control) |
| DIFFICULT badge 10.12 | `ding/sudden-shock-tight.wav` | twist jolt |
| feudal castle 14.46 | `Boom - Big Reveal-short.wav` (dur 0.40) | reveal (swept: 0.70 tail read "similar regard"; 0.40 = control 6/6) |
| NO ASSETS badge 19.00 | `accents/accent-timpani-clicker-01-b.wav` | punctuation |
| cheap factory 22.38 | `transition_rapid_whoosh-tight.wav` | b-roll ingress |
| SpaceX 27.12 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| climax full 28.90 | `Impacts/Impact_Hit_01-2-short.wav` | climax hit |
All levels to be whisper-swept against an encode-matched control (SKILL row 7a).
