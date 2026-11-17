# BROLL-PLAN: peach / clip 2 `calls-still-up-after-the-dump` (FULL, 39.33 s)

Title (clip-plan): "Everything Is Low Right Now. These Calls Are Still Up"
Spine: `calls-still-up-after-the-dump-final.mp4` (staged as `render-assets/calls-still-up-after-the-dump.mp4`,
1080x1920 @25, video 39.36 s / audio 39.41 s; comp 30 fps, 1180 frames = 39.333 s).
Base: 0-19.3 s the dexscreener charts (YOLO/WETH crashed at 0-1 s, then the ORBIO/NVDA chart on Uniswap, Robinhood chain),
a moment of chart loading at ~19-20 s, then 20-39 s the CoinMarketCap Pieverse page (price chart + markets). A burned-in
viewer chat line ("I still have my Cooper lol", y ~720-760) sits in the 0-19 s screen share; harmless, left as filmed.
Content zone 0..854 (seam MEASURED at the 853/854 boundary on 6 of 6 frames, t = 2/9/16/24/30/37 s) over Mike's webcam.
Directives for clip 2 (`clip_directives.py --batch peach --clip 2`): none. No coverage exemption.
Comp prefix `pch2`. Composition id `PeachCallsStillUp`.

Ticker check: the clip-plan's "OREO" is wrong. The chart on screen reads **ORBIO/NVDA (Market Cap) on Uniswap**, and the
prompted medium.en pass hears "ORBIO, how's ORBIO? ORBIO was one of my excellent plays". Captions + badges say ORBIO.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-11-16, 49 files)
| Named in clip | Bucket | Action |
|---|---|---|
| Pieverse | reference ON DISK: `pieverse.jpg` (fluffy white cat mascot with headset, blue/purple futuristic city) | every Pieverse beat (full-screen transition, hanging-in-there, unaffected) generated WITH the reference |
| ORBIO | LESSER-KNOWN, NO reference | NO generated logo. Code-drawn badges carry the ticker as type; the ORBIO b-roll beat is a generic unbranded green coin. FLAG: Mike may add a reference |
No real-person face anywhere; figures faceless.

## Budget
Images: 6 b-roll beats (3 full-screen = hook + Pieverse transition + climax, firm cap 3) + 1 alpha overlay + frame-0 cover.
B-roll time = 2.20 + 2.10 + 1.98 + 1.40 + 2.06 + 2.17 = 11.91 s of 39.33 s = **30.3 % b-roll / 69.7 % base** (band 25-35 %).
Full-screens: 0.80, 19.32, 37.16 s (18 s apart, no full->full flash). Base-showing beats are deliberate: the ORBIO chart while
he names and reads it (3.0-11.5 s, 13.6-19.3 s) and the Pieverse weekly chart he points at (26.0-27.84, 29.9-37.16 s).

## Beats (seconds on the spine; word times from whisper-words-verified.json)
| # | t in-out | Spoken line | Mode | Visual | Asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar glowing green coin rocketing up out of a crater of smashed red candles; code title "EVERYTHING DUMPED. THESE ARE STILL UP" chip "MY CALLS" | `thumb-pch2-cover.png` | - |
| 1 | 0.03-0.80 | "Yeah, I never" | base | Mike + crashed YOLO chart cold open | - | - |
| 2 | 0.80-3.00 | "imagined ... these things would be so low right now" | **FULL (hook)** | Pixar crypto city after a crash: giant red candlesticks toppled and smashed into the street, coins scattered in rubble, stormy red sky | `broll-pch2-hook-crash.png` | - |
| 3 | 3.00-11.50 | "ORBIO, how's ORBIO? ORBIO was one of my excellent plays, right? Still up from my call. Look at that" | base + badge | the ORBIO/NVDA chart (the receipt) | - | - |
| 3a | 4.00-6.00 | (ORBIO named) | badge | YELLOW "ORBIO" / sub "ONE OF MY CALLS" | code | none (no logo) |
| 4 | 11.50-13.60 | "Holy crap. Yeah" | content | Pixar single glowing green unbranded coin standing tall and unbroken while red candles crash all around it | `broll-pch2-holy-crap-green.png` | - |
| 5 | 13.60-19.32 | "Look at that. Still up from my call. ORBIO. Unbelievable." | base + badge | ORBIO chart | - | - |
| 5a | 16.06-18.40 | "Still up from my call" | badge | GREEN "STILL UP" / sub "FROM MY CALL" | code | - |
| 6 | 19.32-21.30 | "I did my Pieverse video" | **FULL (transition)** | Pixar Pieverse cat mascot in a futuristic studio recording a video, holo screens | `broll-pch2-pieverse-studio.png` | pieverse.jpg |
| 7 | 21.30-24.60 | "Pieverse doing pretty good right now, $1.91. Yeah, it's good" | base + badge | CMC Pieverse page | - | - |
| 7a | 22.84-24.50 | "$1.91" | badge | YELLOW "$1.91" / sub "PIEVERSE RIGHT NOW" | code | - |
| 8 | 24.60-26.00 | "Yeah, it's hanging in there." | content | Pixar Pieverse cat hanging on with one paw to a glowing ledge above a red storm, determined | `broll-pch2-hanging-in-there.png` | pieverse.jpg |
| 9 | 26.00-27.84 | "Look at this weekly. It's almost unaffected" | base | Pieverse weekly chart (he points at it) | - | - |
| 10 | 27.84-29.90 | "like almost unaffected from the dumps yesterday" | content | Pixar Pieverse cat calmly sipping tea in a glowing shield bubble while red candles rain down outside | `broll-pch2-unaffected-shield.png` | pieverse.jpg |
| 11 | 29.90-37.16 | "Pieverse. Look at that. Ooh. Yeah, when you see a coin like this man, that's awesome. This is one of my plays" | base + overlay | Pieverse chart | - | - |
| 11a | 33.30-35.40 | "a coin like this man, that's awesome" | overlay (alpha) | glowing green up-arrow, right side of the content zone | `ovl-pch2-green-arrow.png` | - |
| 12 | 37.16-end | "if you were in my group you'd be up 10x on this right now" | **FULL (climax)** | Pixar mountain of gold coins with a glowing green rocket blasting off its peak, fireworks | `broll-pch2-climax-10x.png` | - |
| 12a | 38.06-end | "10x" | badge (over the climax image, which has no text) | GOLD "10X" / sub "IN MY GROUP" | code | - |

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - crest/attack)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh.mp3` | whoosh on the thumbnail cut |
| hook full-screen 0.80 | `Impacts/card-impact-layered.wav` | hook hit |
| ORBIO badge 4.00 | `DING-093.wav` | ticker pop |
| holy-crap cutaway 11.50 | `transition_rapid_whoosh-tight.wav` | b-roll ingress |
| STILL UP badge 16.06 | ~~`ding/sudden-shock-tight.wav`~~ DELETED | masked "it's" at every gain/timing (post-render QA) |
| Pieverse full-screen 19.32 | `transition_rapid_whoosh.mp3` | major transition |
| $1.91 badge 22.84 | `Cash Register-ching.wav` | price reveal |
| hanging 24.60 / unaffected 27.84 | `transition_rapid_whoosh-tight.wav` (27.84 dur 0.25) | b-roll ingress |
| arrow overlay 33.30 | ~~`DING-093.wav`~~ DELETED | masked "coin" (read "corn") even at dur 0.25 (post-render QA) |
| riser into the climax | `Riser Sound Effect-2s.wav` | crest on 37.16 |
| climax full 37.16 | `Boom - Big Reveal-short.wav` | payoff hit |
| 10X badge 38.06 | `Cash Register-ching.wav` | money payoff |
All levels whisper-checked on the final mix against an encode-matched control (SKILL row 7a).
