# BROLL-PLAN: best-time / clip 3 `last-chance-to-get-ahead-buy-assets-now` (FULL, 42.21 s)

Title (clip-plan): "One of the Last Chances Any of Us Have to Get Ahead"
Spine: `last-chance-to-get-ahead-buy-assets-now-final.mp4` (staged as `render-assets/last-chance-to-get-ahead-buy-assets-now.mp4`,
25 fps source, comp 30 fps, 1080x1920, 42.21 s = 1266 frames).
Base: X / Twitter screen share. 0-27 s the Cointelegraph post ("Tom Lee says 99% of finance still runs on old rails...
Banks without a crypto plan could get left behind"), 27-42 s a post reading "Time is running out fast.. Either build
your smart assets today, or become part of the old economy". Content zone 0..853 (seam MEASURED 853/854 on 6 frames,
t = 2/10/20/28/35/41 s) over Mike's webcam (only the top of his head is in frame, as filmed).
Directives for clip 3 (`clip_directives.py --batch best-time --clip 3`): none. No coverage exemption.
Comp prefix `bt3` (best-time clip 3). Composition id `BestTimeLastChanceAssets`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-27)
No crypto project, coin or ticker is spoken in this clip ("AI", "jobs", "assets", "October 2026" only). Nothing to
attach; every image is a generic scene. Coins, if any appear, are specced BLANK gold (no project marks); houses and
gold bars stand for "assets". No real-person face anywhere: all figures faceless silhouettes / Pixar robots.
(The base shows Tom Lee's photo in the Cointelegraph post; that is Mike's screen share, untouched.)

## Budget
Images: 6 b-roll beats (3 full-screen = hook, the "buy those assets right now" turn, and the closing open loop; firm cap 3)
+ frame-0 cover image.
B-roll time = 2.60 + 2.42 + 1.78 + 2.38 + 2.42 + 2.01 = 13.61 s of 42.21 s = **32.2 % b-roll / 67.8 % base** (band 25-35 %).
Base beats are deliberate: the Cointelegraph "banks could get left behind" post backs the thesis, and the second post's
"build your smart assets today" line is literally his point while he says "the things I'm talking about now". Three
code badges punctuate base stretches instead of covering them ("SO GODDAMN CHEAP", "BUY ASSETS", "OCTOBER 2026").
Full-screens: 1.82, 24.10, 40.20 (none adjacent; >= 13 s apart).

## Beats (seconds on the spine; word times from whisper-words.json)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar lone faceless figure sprinting toward a closing glowing golden door; code title "THE LAST CHANCE TO GET AHEAD" chip "BUY ASSETS NOW" | `thumb-bt3-cover.png` |
| 1 | 0.00-1.82 | "But I do think this is going to be one of the" | base | Mike + Cointelegraph post | - |
| 2 | 1.82-4.42 | "last opportunities that any of us have to actually get ahead" | **FULL (hook)** | Pixar last golden train pulling out of a station at dusk, a faceless figure leaping for the final open door | `broll-bt3-hook-last-train.png` |
| 3 | 4.42-8.28 | "because the amount of advancement because of" | base | Cointelegraph post | - |
| 4 | 8.28-10.70 | "AI is just exploding at an exponential" | content | Pixar glowing AI chip core bursting, a neon exponential curve rocketing off the chart | `broll-bt3-ai-exponential.png` |
| 5 | 10.70-13.74 | "level. And there's going to be so" | base | Cointelegraph post | - |
| 6 | 13.74-15.52 | "many jobs are going to be taken away" | content | Pixar friendly robots carrying empty office chairs and desks out of a glass office tower | `broll-bt3-jobs-taken.png` |
| 7 | 15.52-17.40 | "and everything is going to become so" | base | Cointelegraph post | - |
| 8 | 17.40-19.20 | "goddamn cheap." | badge | RED "SO. DAMN. CHEAP." | code |
| 9 | 19.20-22.06 | "And it's going to be difficult for anybody to make a decent amount of money," | base | Cointelegraph post | - |
| 10 | 22.06-23.80 | "buy assets. So like you gotta, you gotta" | badge | YELLOW "BUY ASSETS" | code |
| 11 | 24.10-26.48 | "buy into those assets right now before all this happens" | **FULL (turn)** | Pixar hand sweeping a house, gold bars and blank gold coins into a glowing vault as a giant hourglass runs out | `broll-bt3-assets-vault.png` |
| 12 | 26.48-31.00 | "right? The things that I'm talking about now that are currently happening in" | base | second post ("build your smart assets today") | - |
| 13 | 31.00-32.96 | "October, 2026, one year ago," | badge | GREEN "OCTOBER 2026" / sub "IT'S HAPPENING NOW" | code |
| 14 | 32.96-35.00 | "it wasn't like this. This was like, Oh," | base | second post | - |
| 15 | 35.00-37.42 | "maybe that'll happen a year or two or three" | content | Pixar calendar pages flying off a wall in a storm, a tiny telescope pointed at a far-off hazy horizon | `broll-bt3-years-away.png` |
| 16 | 37.42-40.20 | "years from now. This wasn't like this. And now it's changed." | base | second post | - |
| 17 | 40.20-end | "Imagine what it's going to be like one year from now." | **FULL (close)** | Pixar dawn over a glowing futuristic AI city, a lone faceless silhouette on a cliff looking at it | `broll-bt3-close-future-city.png` |

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` | whoosh on the thumbnail cut |
| hook full-screen 1.82 | `Boom - Big Reveal-short.wav` | hook hit (full-screen reveal) |
| AI exponential 8.28 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| jobs 13.74 | `kinetic-text/swoosh-2.wav` | b-roll ingress |
| CHEAP badge 17.58 | `Impacts/Kick_Impact_01-tight.wav` | punchline hit on "goddamn" |
| BUY ASSETS badge 22.06 | `Cash Register-ching.wav` | money keyword |
| riser into the turn | `Riser Sound Effect-2s.wav` | builds into the assets full-screen |
| assets full 24.10 | `Impacts/Impact_Hit_01-2-short.wav` | turn hit |
| OCTOBER 2026 badge 31.00 | `DING-093.wav` | stat pop |
| years-away 35.00 | `Cinematic Whoosh 06.wav` | gentle ingress under speech |
| close full 40.20 | `Boom - Big Reveal-short.wav` (vol 0.20, 0.6 s) | open-loop hit; `ding/sudden-shock-tight.wav` was tried first and read as a phantom "so" before "imagine" 3/3, swapped by offline sweep |
All levels whisper-checked on the final mix against an encode-matched control (SKILL row 7a).
