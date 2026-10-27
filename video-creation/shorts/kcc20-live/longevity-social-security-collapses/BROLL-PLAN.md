# BROLL-PLAN: kcc20-live / clip 5 `longevity-social-security-collapses` (FULL, 35.56 s)

Title (clip-plan): "Longevity Escape Velocity in 5 Years, Then Social Security Collapses"
Spine: `longevity-social-security-collapses-final.mp4` (staged as `render-assets/longevity-social-security-collapses.mp4`, 25 fps, 1080x1920, no B-frames, video 35.560 s / audio 35.563 s)
Base: TradingView BTC/USD daily chart + watchlist (content zone 0..854, seam MEASURED 853/854 on 8 frames) over Mike's webcam. No viewer chat banner on this clip, so no redaction.
Directives for clip 5 (`clip_directives.py --batch kcc20-live --clip 5`): none. No coverage exemption.
Comp prefix `kl5` (kcc20-live clip 5). Composition id `Kcc20LiveLongevity`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-22, 46 files)
| Named in clip | Bucket | Action |
|---|---|---|
| Trump accounts | US policy name (real person's name) | CODE badge text only. No image of Trump, no real-person face anywhere |
| Social Security | US government programme | Name carved on a generic neoclassical building (no seal, no logo) |
| longevity escape velocity, retirement fund, stocks | concepts | generic |
No crypto project / lesser-known brand is spoken, so no reference file applies. All characters are cartoon (Pixar) or faceless silhouettes.

## Word stream (captions skill row 3)
`whisper-words.json` OMITTED speech: "assets." (33.96-34.10, the JSON jumped "of" -> "interesting") and "sort of" in "or other sort of investment". Patched into `whisper-words-verified.json` from medium.en + large-v3 windows + the full-stream transcript. STT fixes: docs -> stocks (stream: "kids getting uh stocks", tightened to "kids stocks"), foreseen -> foreseeing, account -> accounts, collapse -> collapses.

## Budget
Images: 5 b-roll beats (3 full-screen = hook + the "collapses" transition + climax, firm cap 3) + 1 alpha overlay + frame-0 cover.
B-roll time = 3.00 + 2.20 + 1.60 + 2.86 + 1.44 = 11.10 s of 35.56 s = **31.2 % b-roll / 68.8 % base** (band 25-35 %).
Base-showing beats are deliberate: Mike on cam over the BTC chart carries the reasoning lines ("So as you age a year", "which makes sense right now", "so that any kids that are alive now").
No two full-screens within 1.5 s of each other (gaps 9.3 s and 19.4 s). No butted beats.
Each image is unique in the batch (no sibling clip covers longevity / pensions).

## Beats (seconds on the spine; word edges from whisper-words-verified.json cross-checked against medium.en)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar spry grandpa sprinting past a crumbling pillar, hourglass sand flowing up; code title "SOCIAL SECURITY WON'T SURVIVE" + chip "AGING IS ABOUT TO REVERSE" | `thumb-kl5-cover.png` |
| 1 | 0.03-0.78 | "Longevity" | base | Mike + BTC chart (cold open on the base) | - |
| 2 | 0.78-3.78 | "escape velocity is probably going to be reached within the next five years." | **FULL (hook)** | Pixar DNA-helix rocket blasting up through a shattering hourglass whose sand flows upward | `broll-kl5-hook-escape-velocity.png` |
| 3 | 3.78-5.40 | "So as you age a year," | base | - | - |
| 4 | 5.40-6.90 | "you're gaining back more than a year." | badge | GREEN "AGE 1 YEAR / GET 1+ BACK" | code |
| 5 | 6.90-9.28 | "If a 90 year old" | base | BTC chart | - |
| 6 | 9.28-11.48 | "person has the health of a 50 year old," | content | Pixar grandpa in a tracksuit lifting a barbell overhead, cane forgotten on the floor, a birthday cake full of candles | `broll-kl5-ninety-year-old.png` |
| 7 | 11.48-13.10 | "then people are living longer and then" | base | - | - |
| 8 | 13.10-14.70 | "social security completely collapses," | **FULL (transition)** | Pixar neoclassical "SOCIAL SECURITY" building crumbling, benefit checks blowing away under a red storm | `broll-kl5-social-security-collapse.png` |
| 9 | 14.70-17.08 | "which makes sense right now. You have these things like" | base | BTC chart | - |
| 10 | 17.08-19.86 | "Trump accounts and kids stocks and stuff like that." | badge | YELLOW "FOR KIDS: / TRUMP ACCOUNTS" | code |
| 11 | 19.96-22.16 | "Maybe the powers that be are foreseeing." | overlay (alpha) | glowing crystal ball with an hourglass inside, floating over the chart (real alpha PNG) | `ovl-kl5-crystal-ball.png` |
| 12 | 22.16-23.52 | "People are going to be living longer and" | base | - | - |
| 13 | 23.52-24.86 | "social security is going to collapse." | badge | RED "GOING BUST / SOCIAL SECURITY" | code |
| 14 | 24.86-25.66 | "And it needs to be" | base | - | - |
| 15 | 25.66-28.52 | "replaced by something like some sort of retirement fund" | content | Pixar rusty pension pillar crumbling vs a golden nest egg in a nest of rising stock lines, a child planting a money tree | `broll-kl5-retirement-fund.png` |
| 16 | 28.52-32.40 | "or other sort of investment so that any kids that are alive now, when they start" | base | BTC chart | - |
| 17 | 32.40-34.08 | "getting older, they have like a lot of assets." | badge | GREEN "KIDS WILL / OWN ASSETS" | code |
| 18 | 34.12-end | "Interesting world, but scary." | **FULL (climax)** | Pixar faceless silhouettes (elders standing young, kids) on a hill facing a giant upward-flowing hourglass over a city, half golden sunset, half storm | `broll-kl5-climax-scary-world.png` |

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut |
| hook full 0.78 | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` | short hit |
| AGE badge 5.40 | `kinetic-text/knock-pop.wav` | keyword pop |
| 90-year-old 9.28 | `transition_rapid_whoosh-tight.wav` | b-roll ingress |
| SS collapse full 13.10 | `Boom - Big Reveal-short.wav` | reveal |
| TRUMP ACCOUNTS badge 17.08 | `accents/accent-timpani-clicker-01-b.wav` (t 16.88, ends before "Trump") | punctuation; moved off the T onset after the render read "pump" |
| crystal ball 19.96 | `DING-093.wav` | reveal ding |
| SS COLLAPSES badge 23.52 | `Impacts/Kick_Impact_01-tight.wav` | warning hit |
| retirement fund 25.66 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| KIDS badge 32.40 | `kinetic-text/knock-pop.wav` | keyword pop |
| climax full 34.12 | `Impacts/Impact_Hit_01-2-tight.wav` (t 34.10, crest on "interesting") | climax hit; moved off "assets." after an offline sweep (crest 34.12 masked it) |
Levels whisper-verified on the final mix against an encode-matched control (SKILL row 7a).
