# quant - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author 2026-11-05 off the graph seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py) + `spine/ALL.f.enhanced.medium-words.json` + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md + `spine/jumpcuts-final.json` + assets/diagrams/C1-spec.md + assets/slide-sources/_state-cues.md + assets/charts/C5-spec.md, C6-spec.md, C7-spec.md + assets/whiteboard/*.cues.md + assets/VISUAL-QA.json (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; the comp is built TO this log).
> Watch file: `spine/ALL.f.enhanced.mp4` (563.33s / 9:23.3, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause and PRE-clip-insert; no chain shift is re-applied here. Six baked pauses shift the delivered timeline via `sh()` at comp and in mix_music.py: five title cards at 1.5 s each (trough snaps dry-run on the FINAL spine: T2 53.955, T3 207.315, T4 333.300, T5 394.840, T6 494.340) and CLIP-1 10.8 s (235.870). Delivered runtime around 581.6 s / 9:41.6.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (authored next).
> **FACE MODE = SCREEN SHARE (house rule #1b, comp-build section 4c):** every FACE window is Mike's OBS screen share played verbatim, webcam + CTA box as recorded, the deck area (x 0 to 1464) painted with COVER-PLAN `face_body[]`. Each FACE row names its BODY. The joins in `spine/jumpcuts-final.json` get no zoom step and no leak: a screen share is never zoomed, so this log carries none of those rows. No SFX on a body change.
> **CAPTIONS: OFF (Mike, 2026-11-04).** No caption rows anywhere. **Kinetic text: none,** SCREENPLAY.md names no device id.
> **VOICE:** `settings.voice_db` 3.0 at the draft and final mix (spine untouched). **MUSIC:** ONE drone, `solstice`, frame 0 to the last frame, one seat. MUSIC-PLAN carries no automation rows and no vibe-cut duck; its four hard hits are all "no hit", written below as `[MUSIC]` rows with `[IMPACT] layer: none`. CLIP-1's -14 dB duck is automatic.
> **SOUND:** every SFX row names its file and `mood_class` (all neutral, the only class that fits this calm register; `file start` = the frame minus the file's measured peak). Fewer, smaller sounds: one card impact file for all five cards (the video's punctuation), the padlock click as a story motif, one ding, two whooshes on the two chart axis moves, three clicks on the CTA. Nothing over the last word of a line.
> **SHIPS AS AUTHORED (GATE plan, Mike 2026-11-04, no per-item rulings):** WB12, WB13, WB14 stay · title cards CH2 to CH6 ON · CTA close K3 + K4, no hard-out · Seedance motion on C9 + C10 only · C5 on CoinMarketCap · 'picked bank' left as recorded · '114x on PerpsPad' / 'like a month ago' never on screen.
> **ZERO ORPHANS:** every renderable file in `assets/` is PLACED with a timecode below or marked BENCH / REJECTED in the reconciliation at the end of this file.

## CH1 - THE OPEN (0:00.0-0:54.0, Bed A solstice, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:31.8, no cut-in (the video opens here). SCREEN SHARE verbatim, no reframe, no zoom, no captions. "So what is Quant? ... And what they sell is not a new blockchain." BODY FB1: receipt C9 (C9-quant-home, C9-quant-home-scroll, C9-quant-home-b), state hero then scroll then page, 0.00-20.60. BODY FB2: card K1, state items 1 to 4 landing (K1, K1-s1 to K1-s4), 20.60-31.77
0:00.0  [RECEIPT] C9-quant-home IN → 0:04.7 BODY FB1, the real quant.network hero 'The Infrastructure of Programmable Money' + the orange DvP diagram, top-aligned in the deck area, slow settling push. IMG-MOTION 1 slot: assets/img-motion/C9-motion.mp4 is NOT on disk, so this is the still the plan names as its fallback · treatment: push
0:00.0  [MUSIC] Bed CH1 solstice (DeHartmann_Solstice_instrumental_4_17.mp3) file in 0.00, unspliced: the file's own build-in from frame 0 (-69 to -24 dBFS over bar 0), full tone by 3.6 s, then the plateau, seat -24.3 dB = -17 dB under the raised VO → 0:54.0
0:00.0  [MUSIC] hard hit (MUSIC-PLAN 0.00, the locked opening line): no hit, the build-in rises from silence under 'So what is Quant?' · [IMPACT] layer: none (MUSIC-PLAN ruling: no hit, no stinger; the file's own rise owns frame 0)
0:00.0  SAY:  "So what is Quant?"
0:01.8  SAY:  "This is something I've been recommended"
0:03.2  SAY:  "for quite some time, right?"
0:04.7  [RECEIPT] C9-quant-home-scroll IN → 0:09.3 ON 'People' (4.74) BODY FB1, the real page scrolling (4.57 s clip, muted, no audio stream), fit to width or offset the crop (a centred 1464 crop cuts the logo mark); never hold or cut on clip frames 59-76 or 85-106; its last frame is clean and holds to 'And' (9.94) · treatment: push
0:04.7  SAY:  "People from my community, people in my live streams,"
0:07.9  SAY:  "dropping comments saying I should buy some Quant."
0:09.9  [RECEIPT] C9-quant-home-b IN → 0:20.6 ON 'And' (9.94) BODY FB1, a slow comp-level vertical pan down the rest of the real page from 'Introducing Quant Flow' (10.7 s), stops a few rows above the file's bottom edge (the last 6 device rows are white) · treatment: push
0:09.9  SAY:  "And I always say, you know, it looks pretty good"
0:12.5  SAY:  "and so on, but there's so many tokens,"
0:14.0  SAY:  "I can't buy everything, but I wanna get into this"
0:16.4  SAY:  "and do a deep dive into this and just break it all down."
0:20.6  [CONTAINER] K1 IN → 0:31.8 BODY FB2, deck card 'Quant, in one line', every row at rest, the FACE_BODY entrance (comp-build section 4c), silent, ON 'Right,' (20.60)
0:20.6  SAY:  "Right, so here's the short version."
0:23.1  SAY:  "Quant is a London company founded in 2015"
0:23.8  [CONTAINER] K1-s1 ON 'London' (23.84): London lit
0:25.6  [CONTAINER] K1-s2 ON '2015' (25.56): + 2015 lit
0:26.4  SAY:  "by a guy named Gilbert Verdian."
0:27.5  [CONTAINER] K1-s3 ON 'Gilbert' (27.48): + Gilbert Verdian, Founder and CEO lit (Whisper's 'Veridian' is a mishear; the card prints Verdian)
0:28.5  SAY:  "And what they sell is not a new blockchain."
0:30.2  [CONTAINER] K1-s4 ON 'not' (30.22): + Not a new blockchain lit, orange, holds to 0:31.8
0:31.8  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s)
0:31.8  [WHITEBOARD] WB12 IN (22.3 s → 0:54.0) assets/whiteboard/WB12.mp4 (from: 0.00) 'the layer on top': an orange band labelled Quant, a bank under it (vault door, ledger, rail), the band settles ON TOP; threads to chain blocks and a coin-network node; three customer labels; three question tags (who, token, where); a dotted path off right. No numbers, no islands · draw-on cues assets/whiteboard/WB12.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move)
0:31.8  SAY:  "It's a software layer that sits on top of the systems"
0:34.5  SAY:  "that bank already runs."
0:35.9  SAY:  "And it connects them to the blockchains"
0:38.3  SAY:  "and the digital money networks that are out there."
0:40.7  SAY:  "Their customers are banks, financial institutions,"
0:43.7  SAY:  "and capital markets."
0:44.9  SAY:  "And by the end of this,"
0:46.5  SAY:  "you're gonna know who exactly is using it,"
0:48.6  SAY:  "what the token does, and where it sits"
0:51.0  SAY:  "for the rest of the world."
0:52.2  SAY:  "So let's walk through all of this."
```

## CH2 - ISLANDS OF MONEY (0:54.0-3:27.4, Bed A solstice, card ON)
```
0:54.0  [CARD] CH2 title card T2 "Islands of Money" (Islands in orange), 1.5 s edit-time pause, zero spine time, the trough snap dry-runs to 53.955; the bed runs through under the one-bed waiver · [TRANSITION] card presentation → rmn:cube (card, 0.60s) · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, measured peak 0.09 s, -40 dB tail ends 1.17 s) MIX GAIN -12 dB
0:54.0  [WHITEBOARD] WB1 IN (17.3 s → 1:11.3) assets/whiteboard/WB1.mp4 (from: 0.00) 'every bank is an island': coastline + four islands, a bank on each, vault door + ledger; a coin with legs stopped at the water; the coin on a boat, a dotted path, 'one leg at a time' in orange; a ticking clock, payoff 'days'. tOut moved 70.52 to 71.30 (Mike, option A, 2026-11-05) so 'days' holds its 1 s · draw-on cues assets/whiteboard/WB1.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move)
0:54.0  [MUSIC] Bed CH2 solstice file in 54.02, the file's run continued from CH1 with no splice, plateau bars 16-62, seat -24.3 dB = -17 dB under the raised VO, 0.4 s out from the card start, 1.0 s swell back, full on 'Now,', breath 0.5 s → 3:27.4
0:54.0  SAY:  "Now, to understand why Quant exists,"
0:56.3  SAY:  "think of every bank as an island."
0:58.1  SAY:  "Each island has its own vault and its own ledger."
1:01.5  SAY:  "And the money on one island just can't walk over"
1:03.9  SAY:  "to the next one."
1:04.9  SAY:  "It goes on a boat, one payment, one leg at a time,"
1:08.6  SAY:  "and that boat can take days."
1:10.5  SAY:  "Now the banks are turning those deposits digital."
1:11.3  [WHITEBOARD] WB2 IN (24.3 s → 1:35.6) assets/whiteboard/WB2.mp4 (from: 0.00) 'digital deposits, new fences': a deposit slip becomes a token on the island's ledger, a shield, a regulator stamp, an orange rules tag types 'move when...' and 'release when...', a looping arrow inside the bank, 'walled garden' in orange (never the spoken mishear 'rolled'), fences close around all four · draw-on cues assets/whiteboard/WB2.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
1:13.2  SAY:  "A tokenized deposit is still your deposit at your bank,"
1:16.8  SAY:  "same protections, same regulator,"
1:19.0  SAY:  "it's just recorded differently."
1:20.5  SAY:  "And it can carry rules, like move when this happens,"
1:23.9  SAY:  "release when that happens."
1:25.5  SAY:  "But here's the thing though,"
1:26.4  SAY:  "right now most of them only move inside the bank"
1:28.8  SAY:  "that issued them."
1:30.0  SAY:  "Quant's own words for it, walled gardens."
1:33.1  SAY:  "Same islands, brand new fences."
1:35.6  [WHITEBOARD] WB3 IN (23.5 s → 1:59.1) assets/whiteboard/WB3.mp4 (from: 0.00) 'not another island': a fifth island with chain blocks, arrows pull the banks toward it, an orange strike on 'did not do'; the Quant band over all four; checks on the banks, rails and vaults; threads to each vault with plug glyphs (APIs); a coin in the band crossed out, 'never holds funds' · draw-on cues assets/whiteboard/WB3.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
1:35.6  SAY:  "So the obvious move would be to build one more island,"
1:38.5  SAY:  "one big chain, tell every bank, come and settle over here."
1:42.2  SAY:  "And that is exactly what Quant did not do."
1:46.0  SAY:  "Quant is a layer that sits above the islands."
1:48.5  SAY:  "The bank keeps its core systems, keeps its payment rails,"
1:51.7  SAY:  "keeps custody of the money."
1:53.2  SAY:  "Quant connects all of that through a set of APIs"
1:55.7  SAY:  "and orchestrates the movement."
1:57.5  SAY:  "And it never holds the funds."
1:59.1  [RECEIPT] C10-quant-flow IN (2.7 s → 2:01.8) the real Quant Flow page, the Connected column with 'No new network to join. No need to replace your existing infrastructure.', crop starts below device y9436 (a blank band sits above), settling push. IMG-MOTION 3 slot: assets/img-motion/C10-motion.mp4 is NOT on disk, the still is the plan's fallback · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
1:59.4  SAY:  "Now what does that look like for one payment?"
1:59.8  [HIGHLIGHT] C10 wipe on 'No new network to join. No need to replace your existing infrastructure.' ON 'does' (119.78); the line is the bridge into WB4, the sentence was just paraphrased by WB3
2:01.8  [WHITEBOARD] WB4 IN (30.0 s → 2:31.8) assets/whiteboard/WB4.mp4 (from: 0.00) 'lock, credit, settle': London and Singapore islands; 'lock' types, a padlock on a coin stack; 'credit' types, an orange arrow across the water, a cheque at the supplier, a dotted tie back to the lock; 'settle' types, a clock + a two-way arrow, the padlock opens; a struck new coin, a dotted boundary, shields. Exactly the 30 s cap · draw-on cues assets/whiteboard/WB4.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
2:01.8  SAY:  "Quant's own example, a manufacturer in London"
2:04.6  SAY:  "paying a supplier in Singapore."
2:07.0  SAY:  "Step one, lock."
2:08.7  SAY:  "The London bank locks the manufacturer's money"
2:10.7  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 130.61, WB4 the shackle clicks shut ON 'money' (130.68), the padlock motif's first hit, UNDER the VO
2:10.9  SAY:  "the moment it accepts the instruction."
2:12.8  SAY:  "Step two, credit."
2:14.2  SAY:  "The Singapore bank credits the supplier right away"
2:16.9  SAY:  "against that lock."
2:18.7  SAY:  "Step three, settle."
2:20.6  SAY:  "The two banks settle with each other in the next window"
2:23.3  SAY:  "and the lock is released."
2:24.7  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 144.64, WB4 the shackle has lifted open (lift 144.36-144.71), after the word 'released.', never over it
2:24.8  SAY:  "No new asset and the money never left the banking system."
2:28.6  SAY:  "It was a deposit at a regulated bank the whole way."
2:31.8  [WHITEBOARD] WB5 IN (25.8 s → 2:57.6) assets/whiteboard/WB5.mp4 (from: 0.00) 'all legs or none': three islands in a triangle; the first leg lands with a check, the second hangs mid-water, 'limbo'; padlocks on all three vaults; all three legs land together, three checks, 'all or none'. Nothing new draws under 'I feel you bro' and the rewatch line · draw-on cues assets/whiteboard/WB5.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
2:32.2  SAY:  "And the second trick is a synchronized settlement."
2:34.5  SAY:  "The old way settles each leg of the deal on its own."
2:37.2  SAY:  "So one leg clears, the other one hasn't yet."
2:40.4  SAY:  "And for a moment, the whole deal sits in limbo."
2:42.6  SAY:  "With this layer, every bank involved"
2:44.7  SAY:  "reserves its funds first."
2:45.1  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 165.05, WB5 the first gold padlock is shut (draws 164.72-165.12 ON 'reserves'), one click for the three locks
2:46.2  SAY:  "And then every leg commits together or none of them do."
2:47.9  [ACCENT] DING-093 (DING-093.wav, mood_class neutral, measured peak 0.21 s, -40 dB ends 0.92 s) MIX GAIN -14 dB file start 167.72, WB5 the three check badges pop at once (167.93) between 'together' and 'or none'
2:49.4  SAY:  "And if that was a bit complex, I feel you bro."
2:52.3  SAY:  "Feel free to double tap the left side of this video"
2:54.8  SAY:  "if you're on your phone to go back"
2:56.1  SAY:  "and watch it all over again."
2:57.6  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick)
2:57.6  [FACE] F2 IN → 2:59.8 "Now here's the thing with the real names." SCREEN SHARE verbatim. BODY FB3: diagram C1, asset C1-whole, state whole, no spotlight (the rich diagram shown ONCE)
2:57.6  [DIAGRAM] C1-whole BODY FB3 in the deck area, the FACE_BODY entrance over the first 12 frames, silent
2:57.6  SAY:  "Now here's the thing with the real names."
2:59.8  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s)
2:59.8  [DIAGRAM] C1-whole IN full frame (the C1 run 17.8 s → 3:17.6), then one node lit per talking point. Type 2 still, comp = a 6-frame swap between states, nothing moves but the ink; declare `// DIAGRAM_REFS: C1-*`; the third C1 spot is the plan's cleared CONTAINER SCATTER callback
2:59.9  SAY:  "On the left, what a bank already runs."
3:00.2  [DIAGRAM] C1-left-column ON 'left,' (180.16)
3:02.0  [DIAGRAM] C1-left-core ON 'core banking' (182.02)
3:02.0  SAY:  "core banking, treasury, the payment rails."
3:02.9  [DIAGRAM] C1-left-treasury ON 'treasury' (182.92)
3:03.7  [DIAGRAM] C1-left ON 'payment rails' (183.66)
3:04.6  [DIAGRAM] C1-quant ON 'In the middle, Quant.' (184.62; the word 'Quant' lands 185.48)
3:04.6  SAY:  "In the middle, Quant."
3:06.1  [DIAGRAM] C1-overledger ON 'Overledger' (186.06)
3:06.1  SAY:  "Overledger is the API connector."
3:08.0  [DIAGRAM] C1-flow ON 'Quant Flow' (188.04)
3:08.0  SAY:  "Quant Flow is where the bank writes the rules"
3:10.0  SAY:  "in their own payment language, PayScript."
3:11.7  [DIAGRAM] C1-payscript ON 'PayScript' (191.72)
3:12.4  [DIAGRAM] C1-quantnet ON 'QuantNet' (192.38)
3:12.4  SAY:  "QuantNet is the orchestration layer"
3:14.1  SAY:  "coordinating the islands."
3:15.6  [DIAGRAM] C1-fusion ON 'Quant Fusion' (195.62), holds to 3:17.6, where C22 takes its time
3:15.6  SAY:  "Quant Fusion is their rollup."
3:17.6  [RECEIPT] C22-fusion IN (6.2 s → 3:23.8) R(article), the Fusion mainnet post: stage 1 headline 'A new category of infrastructure: the Fusion Rollup is live on mainnet' + the date. Date to the 74 sentence is 1095 CSS px, just over one frame, so scale or pan slightly across the slot · treatment: highlight → lib:spin-3d-center-ease-short-t-cw (SPIN-newfacet, 0.44s)
3:17.6  SAY:  "Live on mainnet since June 2nd, 2026."
3:18.7  [HIGHLIGHT] C22 wipe on '2 June 2026' ON 'June' (198.74)
3:21.6  [RECEIPT] C22-fusion stage 2 ON 'Connected' (201.64): settling push to 'It launches connected to 74 networks'
3:21.6  SAY:  "Connected to 74 networks."
3:22.3  [HIGHLIGHT] C22 wipe on '74 networks' ON '74' (202.30)
3:23.8  [DIAGRAM] C1-right IN (1.5 s) ON 'And on the right' (203.78), the public and permissioned ledgers + the tokenised-deposit platforms lit, the diagram's own closing state → lib:melt-rgb-soft-1 (MELT-transform, 0.84s)
3:23.8  SAY:  "And on the right, the ledgers"
3:25.2  [DIAGRAM] C1-right-labels ON 'and the tokenized deposit platforms' (205.24): the three labels 'No new network to join', 'never holds funds', 'lock, credit, settle', holds to 3:27.3. Cue per C1-spec.md (about 2 s to read); COVER-PLAN's 207.16 would flash them for about 0.1 s
3:25.2  SAY:  "and the tokenized deposit platforms."
3:27.3  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.76s) (face pick). T3's pause dry-runs to 207.315, 0.05 s inside this window, so T3's exit is what reveals the screen share; C1-right-labels holds into the pause and F3 never flashes before the card
3:27.3  [FACE] F3 IN → 3:30.1 "So who's actually using this? Let's start with the founder," SCREEN SHARE verbatim. BODY FB4: receipt C20 (C20-verdian), state headshot + name + title 'Founder and CEO' crop
3:27.3  [RECEIPT] C20-verdian IN BODY FB4, real pixels, crop ends above device y2160 (the bio's ISO sentence sits below it, do-not-air) · treatment: highlight
```

## CH3 - WHO USES IT (3:27.4-5:33.5, Bed A solstice, card ON)
```
3:27.4  [CARD] CH3 title card T3 "Who Uses It" (Uses in orange), 1.5 s edit-time pause, zero spine time, the trough snap dry-runs to 207.315, plays over the frozen frame and the screen share resumes after it · [TRANSITION] card presentation → rmn:cube (card, 0.60s) · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, measured peak 0.09 s, -40 dB tail ends 1.17 s) MIX GAIN -12 dB
3:27.4  [MUSIC] Bed CH3 solstice file in 10.00 (jump back to bar 3 across the card pause), plateau bars 3-40, seat -24.3 dB = -17 dB under the raised VO, ducked -14 dB automatically under CLIP-1, 1.0 s swell back, breath 0.5 s → 5:33.5
3:27.4  SAY:  "So who's actually using this?"
3:29.0  SAY:  "Let's start with the founder, Gilbert Verdian."
3:30.1  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s)
3:30.1  [RECEIPT] C20-verdian IN full frame (4.4 s → 3:34.5) the bio paragraph, a CUT from the headshot crop, never a scroll: crop starts at device y2650 or stays left of x2000, because the do-not-air ISO sentence sits right of it. Settling push · treatment: highlight
3:31.6  SAY:  "He's a cybersecurity guy with more than 20 years of it."
3:33.6  [HIGHLIGHT] C20 wipe on 'more than 20 years of cybersecurity experience' ON '20' (213.60)
3:34.5  [WHITEBOARD] WB14 IN (15.2 s → 3:49.7) assets/whiteboard/WB14.mp4 (from: 0.00) 'the founder's road': a figure with a shield badge; signposts Downing Street (a door marked 10), Treasury, Mastercard, HSBC (plain words, no logos); a calendar flag '2016', a round table 'ISO', a 'standards' document, a speech bubble 'Quant says'; the road ends at an orange 'Quant' flag · draw-on cues assets/whiteboard/WB14.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
3:34.5  SAY:  "And he's been a security chief at that level."
3:36.7  SAY:  "He's worked inside the UK government"
3:38.5  SAY:  "at Downing Street and the Treasury"
3:40.3  SAY:  "and inside big financial names like Mastercard and HSBC."
3:44.3  SAY:  "Back in 2016, Quant says he helped set up"
3:47.2  SAY:  "the ISO committee that writes the blockchain standards."
3:49.7  [CONTAINER] CLIP-1-leadin IN (6.2 s → 3:55.9) CLIP-1 LEAD-IN: the clip's FIRST frame (Verdian on the Innovate Finance panel stage, its burned caption in frame) held as a still under the set-up line, pulled from assets/clip-inserts/CLIP-1-verdian.mp4, no build. The caption carries the attribution because the VO says 'we describe' → hand:xfade-scale (container-xfade, 0.35s)
3:49.7  SAY:  "In October of 2026, he sat on a panel in London"
3:53.5  SAY:  "and this is how we describe what Quant does."
3:55.9  [INSERT] CLIP-1 SPLICED CLIP, 10.8 s (assets/clip-inserts/CLIP-1-verdian.mp4, YouTube fHy9aL1Do3s 14:21.2-14:32.0, never past 14:32.0): the spine PAUSES after "and this is how we describe what Quant does." (bake_clip_insert.py snaps into the trough, dry-run 235.870, gate guard -85.3 dB) and the clip plays FULL-FRAME with Gilbert Verdian's OWN voice, baked into the VO track; caption burned 'Gilbert Verdian, Founder and CEO of Quant · Innovate Finance panel, London, October 2026', bottom; the bed ducks -14 dB automatically · [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert, default hand:fade 0.5 s each side)
3:55.9  [CONTAINER] CLIP-1-leadout IN (4.5 s → 4:00.5) CLIP-1 LEAD-OUT: the clip's LAST frame held as a still under the resume line 'GBTD, that's the Great British Tokenised Deposit platform.', no build, into C14
3:56.5  SAY:  "GBTD, that's the Great British Tokenised Deposit platform."
4:00.5  [RECEIPT] C14-gbtd-a-title IN (C14 run 13.7 s → 4:14.1) ON 'Run by UK Finance' (240.46), the UK Finance page header strip (4.9:1, about 1464x300 at deck width, placed deliberately, not stretched): proves the page and its owner · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
4:00.5  SAY:  "Run by UK Finance and Quant built the infrastructure for it."
4:02.3  [RECEIPT] C14-gbtd-c-quant stage 2 ON 'Quant' (242.30), the sentence 'developed by Quant as a shared UK industry infrastructure for tokenised commercial bank money' (3.5:1, off-centre margins)
4:02.3  [HIGHLIGHT] C14 wipe on 'developed by Quant as a shared UK industry infrastructure' ON 'Quant' (242.30); unmarked grey body text on the page, the wipe is what points the eye
4:04.3  [RECEIPT] C14-gbtd-b-body stage 3 ON 'Seven' (244.32), the seven-bank list, framed with the zoom stages (at full width the last line runs past the frame; off-centre margins)
4:04.3  SAY:  "Seven banks are on it."
4:06.1  [HIGHLIGHT] C14 wipe on 'Barclays' ON 'Barclays' (246.06)
4:06.1  SAY:  "Barclays, HSBC, Lloyds, Monzo, Nationwide,"
4:06.8  [HIGHLIGHT] C14 wipe on 'HSBC UK' ON 'HSBC' (246.82)
4:07.9  [HIGHLIGHT] C14 wipe on 'Lloyds Banking Group' ON 'Lloyds' (247.94)
4:08.6  [HIGHLIGHT] C14 wipe on 'Monzo' ON 'Monzo' (248.64)
4:09.4  [HIGHLIGHT] C14 wipe on 'Nationwide' ON 'Nationwide' (249.36)
4:10.4  [HIGHLIGHT] C14 wipe on 'NatWest' ON 'NatWest' (250.40)
4:10.4  SAY:  "NatWest and Santander."
4:11.3  [HIGHLIGHT] C14 wipe on 'Santander' ON 'Santander' (251.26)
4:12.2  [RECEIPT] C14-gbtd-b-body stage 4 ON 'And in September of 2026' (252.16): settling push to the first-live-transactions lines
4:12.2  SAY:  "And in September of 2026,"
4:12.4  [HIGHLIGHT] C14 wipe on 'In September 2026' + 'first live customer transactions' ON 'September' (252.40)
4:14.1  [WHITEBOARD] WB6 IN (19.4 s → 4:33.6) assets/whiteboard/WB6.mp4 (from: 0.00) 'the remortgage': a calendar 'Sept 2026' with a LIVE tag, a house, a coin stack with a padlock, a pen signs; orange interest coins drop into the locked stack; the calendar flips, the padlock opens, the stack rides an orange arrow to the lender, a check; a ghost of the WB4 lock, 'same padlock'; a large island rises, 'The Clearing House' · draw-on cues assets/whiteboard/WB6.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
4:14.1  SAY:  "it did its first live customer transactions."
4:16.9  SAY:  "Two of them were remortgages."
4:18.5  SAY:  "Picture it."
4:19.0  SAY:  "Your deposit gets locked the day you sign,"
4:21.7  SAY:  "keeps earning interest the whole time"
4:23.9  SAY:  "and on completion day,"
4:25.4  SAY:  "it releases itself to the other side."
4:26.0  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 265.92, WB6 the shackle has lifted open (lift 265.64-265.99 ON 'releases'), the padlock motif on real money
4:27.4  SAY:  "That's the padlock from the whiteboard on real money."
4:30.5  [MUSIC] hard hit (MUSIC-PLAN 270.46, the big one, The Clearing House): no hit, the bed's fullest plateau bars 22-28 (file 73.3-96.7, +1 dB RMS) under 270.7-294.0, perceptually the same drone · [IMPACT] layer: none (MUSIC-PLAN ruling: no hit, no stinger; WB6's rising island owns the beat)
4:30.5  SAY:  "And then the big one, The Clearing House."
4:33.6  [RECEIPT] R-TCH-JUN-tch IN (9.2 s → 4:42.8) R(article), The Clearing House release of 2026-06-05: crop 1 the headline, June 05, 2026, the '25' sentence and the RTP and CHIPS bullet, settling push. '25' and '$2 trillion' are about 2380 CSS px apart, so two crops with a cut · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
4:33.6  SAY:  "The US payments company owned by 25"
4:35.3  [HIGHLIGHT] R-TCH-JUN wipe on 'owned by 25 of the nation's largest financial institutions' ON '25' (275.34)
4:35.9  SAY:  "of the largest US banks."
4:38.0  SAY:  "It runs RTP and CHIPS"
4:38.6  [HIGHLIGHT] R-TCH-JUN wipe on the RTP and CHIPS bullet ON 'RTP' (278.56)
4:40.1  [RECEIPT] R-TCH-JUN-tch crop 2, a CUT ON 'and clears' (280.12), the About The Clearing House paragraph; the $2 trillion runs on TCH's EXISTING rails, the text on screen says so
4:40.1  SAY:  "and clears more than $2 trillion a day."
4:41.1  [HIGHLIGHT] R-TCH-JUN wipe on 'more than $2 trillion each day' ON '$2' (281.12)
4:42.8  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.76s) (face pick)
4:42.8  [FACE] F4 IN → 4:54.9 "On September 24th, 2026, after a competitive process, they picked bank to build over the new tokenized network. Look right here. The interoperability, orchestration and transaction management layer." SCREEN SHARE verbatim. BODY FB5: receipt C12 (C12-tch-quant), state paragraph, highlight on 289.74. The VO says 'picked bank'; TCH's printed text naming Quant is on screen for the whole sentence (left as recorded, PROJECT-LOG)
4:42.8  [RECEIPT] C12-tch-quant IN BODY FB5 → 4:54.9, R(article), the 2026-09-24 release, headline through the Quant paragraph in one frame, settling push, silent · treatment: highlight
4:42.9  SAY:  "On September 24th, 2026, after a competitive process,"
4:46.7  SAY:  "they picked bank to build over the new tokenized network."
4:49.7  [HIGHLIGHT] C12 wipe on 'Quant's technology will enable the network's interoperability, orchestration, and transaction-management layer' ON 'Look' (289.74), silent
4:49.7  SAY:  "Look right here."
4:51.1  SAY:  "The interoperability, orchestration"
4:53.3  SAY:  "and transaction management layer."
4:54.9  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s)
4:54.9  [WHITEBOARD] WB7 IN (15.0 s → 5:09.9) assets/whiteboard/WB7.mp4 (from: 0.00) 'the archipelago': a harbour gate, a flag 'H1 2027'; exactly 25 small islands sweep in, token glyphs on several; the orange band over the group, 'one network'; two roads 'RTP' and 'CHIPS' feed into it; a dotted trail of paper slips off right. Never '$2 trillion' here · draw-on cues assets/whiteboard/WB7.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move)
4:55.2  SAY:  "Expected to open to banks in the first half of 2027."
4:58.5  SAY:  "Pictures of 25 islands,"
5:00.1  SAY:  "each with its own digital deposits"
5:02.0  SAY:  "and one shared network between them,"
5:04.4  SAY:  "connected to the rails that banks already use."
5:06.8  SAY:  "And around those two a trail of receipts."
5:09.7  SAY:  "Technology vendor on a Project Rosalind"
5:09.9  [RECEIPT] R-ROSALIND-bis IN (4.8 s → 5:14.7) R(other), the BIS Project Rosalind page as an OBJECT, Status Concluded, Partners Bank of England, 'June 2023: Final report'. No Rosalind figures. QA flag: nothing visible names Quant, so this frame does not itself prove 'Technology vendor' · treatment: pan · [MOTION] lib:motion-3d-pan-1-down → lib:motion-3d-pan-1-down (receipt-motion, 4.80s)
5:11.7  SAY:  "with the Bank of England and the BIS in 2023."
5:14.7  [RECEIPT] C13-boe-lab IN (7.9 s → 5:22.6) R(other), the Bank of England Synchronisation Lab page, stage 1 the operators table (18 counted on the frame, Quant's row among them). End every crop above device y5400 (a dark consent box sits below); Chainlink is on the table and is not pointed at · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
5:14.7  SAY:  "One of 18 operators in the Bank of England"
5:15.7  [HIGHLIGHT] C13 wipe on the Quant row ON 'operators' (315.72)
5:17.3  SAY:  "Synchronisation Lab in 2026."
5:19.6  [RECEIPT] C13-boe-lab stage 2 ON 'And that one' (319.64): settling push to the not-a-sandbox sentence, same page
5:19.6  SAY:  "And that one is a test, no real money moves there."
5:20.6  [HIGHLIGHT] C13 wipe on 'not a regulatory sandbox and will not support real-money payments' ON 'test' (320.56)
5:22.6  [RECEIPT] C15-ecb-annex IN (4.7 s → 5:27.3) R(other), the ECB digital euro innovation partners annex. Row and legend are about 1570 CSS px apart, so push from the row to the legend inside the slot. QA flag: a plain list, no ECB mark and no 2025 on the crop, provenance rests on the VO · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
5:22.6  SAY:  "A pioneer on a European Central Bank's"
5:22.8  [HIGHLIGHT] C15 wipe on 'Quant Network Europe Limited (P)' ON 'pioneer' (322.76)
5:24.7  [RECEIPT] C15-ecb-annex stage 2 ON 'digital' (324.66): push to the legend '(P) = pioneer'
5:24.7  SAY:  "digital euro platform in 2025."
5:27.3  [RECEIPT] C16-murex IN (2.3 s → 5:29.7) R(article), the Murex release headline + MAR 25 date + Quant mark, a push on the headline block only (a blank band and a dark footer sit below) · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
5:27.3  SAY:  "Murex in March of 2026."
5:29.7  [RECEIPT] R-DENTSU-dentsu IN (3.8 s → 5:33.5) R(article), the headline 'Quant and Dentsu Soken partner to support Japan's adoption of tokenised deposits' + 14 January 2026 + the lockup, shown as an OBJECT, nothing read off it · treatment: pan · [MOTION] lib:motion-3d-pan-2-right → lib:motion-3d-pan-2-right (receipt-motion, 3.80s)
5:29.7  SAY:  "Dentsu Soken in Japan in January of 2026."
```

## CH4 - THE TOKEN (5:33.5-6:34.9, Bed A solstice, card ON)
```
5:33.5  [CARD] CH4 title card T4 "The Token" (Token in orange), 1.5 s edit-time pause, zero spine time, the trough snap dry-runs to 333.300 · [TRANSITION] card presentation → rmn:cube (card, 0.60s) · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, measured peak 0.09 s, -40 dB tail ends 1.17 s) MIX GAIN -12 dB
5:33.5  [WHITEBOARD] WB13 IN (19.1 s → 5:52.5) assets/whiteboard/WB13.mp4 (from: 0.00) 'the jar': an orange QNT coin on an Ethereum plinth; a glass jar around a coin pile, the lid seals; '14.6M' with an explicit decimal dot; a ring of coins outside, 'almost all circulating'; a padlock on the lid, a struck '+'; a calendar '2018', a small crowd; a peak with a flag '$427', 'Sept 2021'. On screen the token is QNT · draw-on cues assets/whiteboard/WB13.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move)
5:33.5  [MUSIC] Bed CH4 solstice file in 120.00 (jump back to bar 36), plateau bars 36-54, the thinnest low end under the tokenomics, seat -24.3 dB = -17 dB under the raised VO, 1.0 s swell back, breath 0.5 s → 6:34.9
5:33.5  SAY:  "Now the token."
5:34.9  SAY:  "Quant lives on Ethereum and then supply is fixed."
5:37.8  SAY:  "Around 14.6 million tokens,"
5:40.5  SAY:  "almost all of it already circulating."
5:42.5  SAY:  "That's all there will ever be."
5:43.5  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 343.46, WB13 the padlock is on the lid (draws 343.08-343.53 ON 'all'), inside 'That's all there will ever be.'
5:45.0  SAY:  "It sold to the public in 2018."
5:47.5  SAY:  "And the all time high was around $427 in September of 2021."
5:52.5  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.76s) (face pick)
5:52.5  [FACE] F5 IN → 6:01.1 "And at the time of this recording it's trading at $199 for a market cap of $2.9 billion, which puts it at rank 34." SCREEN SHARE verbatim. BODY FB6: card C4, state count-up on the three spoken figures (C4, C4-plate, C4-s1 to C4-s3)
5:52.5  [CONTAINER] C4 IN → 6:01.1 BODY FB6, the market-cap card: FDV, 24 h volume, 1-year change and 'CoinGecko, 2026-11-04 12:08 UTC' small; the comp counts the three hero figures over C4-plate (slide-sources/C4-count.json) and swaps to each state as it lands, silent. Never CMC's $2.396B or #37
5:52.6  SAY:  "And at the time of this recording it's trading at $199"
5:55.1  [CONTAINER] C4-s1 ON '$199' (355.14): price lit
5:56.2  SAY:  "for a market cap of $2.9 billion,"
5:57.7  [CONTAINER] C4-s2 ON '$2.9 billion' (357.74): market cap lit
5:59.5  SAY:  "which puts it at rank 34."
6:00.7  [CONTAINER] C4-s3 ON '34' (360.72): rank lit, holds to 6:01.1
6:01.1  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.76s)
6:01.1  [RECEIPT] C21-overledger IN (4.4 s → 6:05.5) R(article), the Overledger 2.1.5 release, 15 December 2021, cropped to the licence-fee paragraph, crop ends above device y3192 (a blank band sits below), settling push. The £100 is the page's own text, not spoken · treatment: highlight
6:01.3  SAY:  "So what does the token actually do?"
6:03.6  SAY:  "The documented use is simple."
6:03.9  [HIGHLIGHT] C21 wipe on 'This can now be paid in QNT' ON 'documented' (363.92), about 1.6 s to read; COVER-PLAN's 'simple' (364.94) leaves 0.56 s before WB8
6:05.5  [WHITEBOARD] WB8 IN (29.4 s → 6:34.9) assets/whiteboard/WB8.mp4 (from: 0.00) 'two pipes': lane 1, a developer, 'Overledger', a 'licence' slip tagged 'Dec 2021' becomes an orange QNT coin, 'treasury contract', up into the Quant band, a struck ballot box, 'utility'; lane 2, a bank with flags 'TCH' and 'GBTD', a 'software + service' contract into the band, an orange '?' 'QNT share: not disclosed'; on 'second pipe' a DASHED pipe to a faint coin · draw-on cues assets/whiteboard/WB8.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
6:05.5  SAY:  "If you wanna use Overledger on mainnet,"
6:08.2  SAY:  "you pay a license fee."
6:09.6  SAY:  "And since December of 2021,"
6:11.2  SAY:  "that fee is payable in QNT."
6:13.3  SAY:  "The payment goes through a treasury contract to Quant."
6:16.5  SAY:  "No governance rights, a utility token, pure and simple."
6:19.7  SAY:  "And here's the thing, the bank deals,"
6:21.8  SAY:  "The Clearing House, the GBTD,"
6:23.8  SAY:  "those are software and service contracts."
6:26.3  SAY:  "And nothing published says how much of that,"
6:28.6  SAY:  "if any flows through QNT."
6:30.9  SAY:  "So the open question for the token"
6:32.5  SAY:  "is whether the second pipe ever gets built."
```

## CH5 - QUANT VS THE MARKET (6:34.9-8:14.6, Bed A solstice, card ON)
```
6:34.9  [CARD] CH5 title card T5 "Quant vs The Market" (Market in orange), 1.5 s edit-time pause, zero spine time, the trough snap dry-runs to 394.840 · [TRANSITION] card presentation → rmn:cube (card, 0.60s) · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, measured peak 0.09 s, -40 dB tail ends 1.17 s) MIX GAIN -12 dB
6:34.9  [CONTAINER] K2 IN (5.5 s → 6:40.4) deck card 'Three ratios' (ratios in orange), every row at rest, no numbers
6:34.9  [MUSIC] Bed CH5 solstice file in 103.33 (jump back to bar 31), plateau bars 31-60, pinned on the peers chart, seat -24.3 dB = -17 dB under the raised VO, 1.0 s swell back, breath 0.5 s → 8:14.6
6:34.9  SAY:  "Now the price alone tells you very little."
6:37.0  SAY:  "So I wanna look at Quant the way the pros do, as ratios."
6:38.5  [CONTAINER] K2-s1 ON 'the (pros)' (398.46): share of the total crypto market lit
6:39.1  [CONTAINER] K2-s2 at 399.10, no word cue, even spacing: against the peers lit
6:39.8  [CONTAINER] K2-s3 ON 'ratios' (399.82): priced in Bitcoin lit, holds to 6:40.4
6:40.3  SAY:  "All right, so now look at this."
6:40.4  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.76s) (face pick)
6:40.4  [FACE] F6 IN → 6:46.2 "All right, so now look at this. This is Quant's market cap as a share of the total crypto market cap going back to 2018." SCREEN SHARE verbatim. BODY FB7: animated-chart C5, state line draw-on, no markers (C5-start to C5-mid)
6:40.4  [CHART] C5-start BODY FB7, card and axes in place, the FACE_BODY entrance over 12 frames, 'Source: CoinMarketCap' small, silent. Animated for real on useCurrentFrame, never a held PNG
6:41.6  [CHART] C5 line + area clip left to right, 401.58 to 406.20, ending on '2018.' = C5-mid
6:41.6  SAY:  "This is Quant's market cap"
6:43.0  SAY:  "as a share of the total crypto market cap going back to 2018."
6:46.2  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s)
6:46.2  [CHART] C5-mid IN full frame (27.1 s → 7:13.3), the same line, nothing else changes on the cut. Vendor locked to CoinMarketCap; never CoinGecko's 0.110%, never TradingView's 0.155%
6:46.3  SAY:  "The all time peak of that share was October of 2022"
6:46.9  [CHART] C5 ring pops at 18 Oct 2022 ON 'peak' (406.88)
6:49.3  SAY:  "at 0.269% right in the middle of a bear market."
6:50.0  [CHART] C5-peak ON '0.269' (409.98): '0.269%' and '18 Oct 2022 · in a bear market'
6:53.3  SAY:  "Then it bled for about three years"
6:53.7  [CHART] C5 band wipes left to right over 45 frames ON 'bled' (413.72), from 2024-06-19 to 2026-08-28
6:55.1  SAY:  "down to a band around 0.03 to 0.04%."
6:56.4  [CHART] C5-band ON '0.03' (416.40): '0.03 to 0.04%'
6:59.1  SAY:  "And then in September of 2026, The Clearing House news,"
7:02.4  SAY:  "and the share goes from 0.028 to around 0.09% in 10 weeks,"
7:03.7  [CHART] C5 ring + '0.028%' + '28 Aug 2026' ON '0.028' (423.70); the VO opens 'in September', the card prints the real date
7:06.2  [CHART] C5 ring + '0.092%' + '4 Nov 2026' ON '0.09' (426.24)
7:08.5  [CHART] C5-run ON 'more than a 3x' (428.54): 'around 3.3x in 10 weeks'
7:08.5  SAY:  "more than a 3x."
7:10.3  SAY:  "And that's still only a third of where it was in 2022."
7:11.3  [CHART] C5-payoff ON 'a third' (431.28): dotted line from the peak ring to the right edge then down to the 0.092% ring (20 frames), '0.269% / 2022 peak', takeaway rises in the footer, holds to 7:13.3
7:13.3  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (face pick)
7:13.3  [FACE] F7 IN → 7:22.3 "All right, so now the peers. So Chainlink, Hedera, XRP, Stellar, Canton, everything indexed to 100 on November 5th, 2025. You got Bitcoin in grey." SCREEN SHARE verbatim. BODY FB8: animated-chart C6, state legend + lines through 2026-08 (C6-start, C6-legend, C6-mid)
7:13.3  [CHART] C6-start BODY FB8, axes + the Quant chip, the FACE_BODY entrance over 12 frames, the Canton note on the card from the first frame, silent
7:13.5  SAY:  "All right, so now the peers."
7:14.5  SAY:  "So Chainlink, Hedera, XRP, Stellar, Canton,"
7:14.7  [CHART] C6 chip 'Chainlink' ON 'Chainlink' (434.68); all lines draw together by a date-linear x cut from here
7:15.2  [CHART] C6 chip 'Hedera' ON 'Hedera' (435.22)
7:15.9  [CHART] C6 chip 'XRP' ON 'XRP' (435.94)
7:16.5  [CHART] C6 chip 'Stellar' ON 'Stellar' (436.48)
7:16.9  [CHART] C6 chip 'Canton' ON 'Canton' (436.86)
7:17.8  SAY:  "everything indexed to 100 on November 5th, 2025."
7:18.1  [CHART] C6-legend ON 'indexed' (438.10): dashed baseline + 'indexed to 100 · 2025-11-05'
7:21.0  SAY:  "You got Bitcoin in grey."
7:21.5  [CHART] C6 chip 'Bitcoin' + its dashed grey line ON 'Bitcoin' (441.46)
7:22.3  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s)
7:22.3  [CHART] C6-mid IN full frame (19.5 s → 7:41.8), the draw reaches 2026-08-31 exactly on this cut. NEVER prints 'fell from 40 to 60'; the lines carry that sentence
7:22.4  SAY:  "For 10 months, Quant didn't do anything special."
7:25.1  SAY:  "A brief pop in 140 in December of 2025,"
7:25.9  [CHART] C6-140 ON '140' (445.92): ring + '140' + '1 Dec 2025' (confirmed on the daily series, 140.04)
7:28.1  SAY:  "then a slow drift down to 82 by the end of August, 2026."
7:29.4  [CHART] C6-82 ON '82' (449.42): ring + '82' + '31 Aug 2026'
7:31.7  SAY:  "And this is all the while its peers fell from 40 to 60%."
7:33.1  [CHART] C6 peer lines hold still ON 'peers' (453.06), nothing prints
7:35.1  [MUSIC] hard hit (MUSIC-PLAN 455.12, C6 breakaway): no hit, the file's step down lands 451.67, its rise under 'one line leaves the group', bar 50's peak 458.2-461.6 · [IMPACT] layer: none (MUSIC-PLAN ruling: no hit, no stinger; the picture and the whoosh below carry the reveal)
7:35.1  SAY:  "And then one line leaves the group."
7:35.4  [WHOOSH] Cinematic Whoosh 06 (Cinematic Whoosh 06.wav, mood_class neutral, measured peak 0.59 s, audible 0.30-1.01 s, -40 dB ends 1.35 s) MIX GAIN -14 dB file start 455.36, peak on 'line', gone before 'group.', under the y-axis rescale below
7:35.8  [CHART] C6-break, 455.84 to 456.52 ON 'line leaves the group': the 140 and 82 markers go, the draw runs 2026-08-31 to 2026-10-01 while the y axis rescales 160 to 400, both ending on 'group.'
7:36.7  [CHART] C6 draw runs on to 2026-11-04, 456.66 to 458.38 ON 'A year later, Quant sits at'
7:36.7  SAY:  "A year later, Quant sits at 273."
7:38.4  [CHART] C6-273 ON '273' (458.38): ring + big '273'. No sound: it is the last word of the line
7:39.7  SAY:  "And every other line in this chart is below 100."
7:41.1  [CHART] C6-payoff ON 'below' (461.06): endpoint labels + leaders stagger top to bottom, 3 frames apart, takeaway in the footer, holds to 7:41.8. Endpoints `[VERIFY]`
7:41.8  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.76s) (face pick)
7:41.8  [FACE] F8 IN → 7:54.1 "And then in Bitcoin terms, on November 5th, 2025, one Quant bought you around 72,000 sats. And on November 4th, 2026, around 254,000 sats." SCREEN SHARE verbatim. BODY FB9: animated-chart C7, state s1 draw-on with the two dated labels (C7-s1-start, C7-s1-first, C7-s1-end)
7:41.8  [CHART] C7-s1-start BODY FB9, axes in BTC, the FACE_BODY entrance over 12 frames, 'Source: CoinGecko / CoinMarketCap' small, silent; on screen the token is $QNT
7:41.9  SAY:  "And then in Bitcoin terms, on November 5th, 2025,"
7:42.4  [CHART] C7 line + area draw left to right, date-linear, 462.36 to 473.86
7:45.9  SAY:  "one Quant bought you around 72,000 sats."
7:48.0  [CHART] C7-s1-first ON 'sats' (467.96): start ring, leader, '0.00071745 BTC / 71,745 sats / 5 Nov 2025'
7:49.0  SAY:  "And on November 4th, 2026, around 254,000 sats."
7:52.8  [CHART] C7 peak ring + '0.003438 BTC / peak · 343,849 sats · 1 Oct 2026' as the draw passes 2026-10-01 (date-linear, about 472.8)
7:53.9  [CHART] C7-s1-end ON 'sats' (473.86): end ring + '0.00254198 BTC / 254,198 sats / 4 Nov 2026'
7:54.1  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.76s)
7:54.1  [CHART] C7-s1-end IN full frame (C7 run 20.4 s → 8:14.6), the same chart continuing
7:54.3  SAY:  "That's around a 3.5x against Bitcoin in a year,"
7:55.3  [CHART] C7 '3.54x' lands ON '.5' (475.34)
7:58.0  SAY:  "while Bitcoin itself is down 23% in dollars."
7:59.3  [CHART] C7-s1-payoff ON '23' (479.34): 'BTC in USD: -23.0%'
8:00.8  [WHOOSH] Cinematic Whoosh 06 (Cinematic Whoosh 06.wav, mood_class neutral, measured peak 0.59 s, audible 0.30-1.01 s, -40 dB ends 1.35 s) MIX GAIN -14 dB file start 480.75, audible from 481.05, after 'dollars.' ends (480.86), peak ON 'Zoom out', under THE ZOOM below
8:01.1  [CHART] C7 THE ZOOM, 481.08 to 482.60 ON 'Zoom out though, and the all time high' (about 46 frames, ease-in-out): both domains interpolate to the long-run pane, every s1 label + the ratio go in the first 8 frames, the long-run line comes in over the same frames
8:01.1  SAY:  "Zoom out though, and the all time high in Bitcoin terms"
8:03.9  [CHART] C7 ATH ring + leader + '0.01167 BTC' + '16 Oct 2022' + the end ring ON 'was' (483.90); the ring sits ABOVE the drawn line on purpose
8:03.9  SAY:  "was in October of 2022."
8:06.1  SAY:  "At around 1.17 million sats."
8:06.5  [CHART] C7-s2-zoom ON '1.17' (486.52): 'around 1.17 million sats'
8:08.7  SAY:  "So even after this run, Quant sits at around 22%"
8:11.1  [CHART] C7-s2-payoff ON '22' (491.14): dotted line from the ATH ring across then down to today's ring (20 frames), 'around 22% of the ATH', takeaway in the footer, holds to 8:14.6. Endpoints `[VERIFY]`
8:12.0  SAY:  "of its best level against Bitcoin."
```

## CH6 - WHAT'S NEXT (8:14.6-8:38.4, Bed A solstice, card ON)
```
8:14.6  [CARD] CH6 title card T6 "What's Next" (Next in orange), 1.5 s edit-time pause, zero spine time, the trough snap dry-runs to 494.340 · [TRANSITION] card presentation → rmn:cube (card, 0.60s) · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, measured peak 0.09 s, -40 dB tail ends 1.17 s) MIX GAIN -12 dB
8:14.6  [WHITEBOARD] WB10 IN (23.9 s → 8:38.4) assets/whiteboard/WB10.mp4 (from: 0.00) 'flags on the horizon': two empty flag poles + two empty speech bubbles; UK: three boats 'pilots', a bond certificate with coupon stubs, orange coins into a vault, 'coupons in tokenised deposits'; US: the WB7 gate half open with scaffolding, a speaker at a lectern, 'early 2027' INSIDE his bubble, 'forecast'. No Sibos scene · draw-on cues assets/whiteboard/WB10.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move)
8:14.6  [MUSIC] Bed CH6 solstice file in 188.23 (bar 56.5, opens the final movement, counted back from the last frame), plateau, seat -24.3 dB = -17 dB under the raised VO, 1.0 s swell back, breath 0.5 s, sample-continuous into CH7 with no splice → 8:38.4
8:14.6  SAY:  "Now, what's next?"
8:15.8  SAY:  "And I'll use each source's own words for where it stands."
8:18.7  SAY:  "In the UK, UK Finance says more pilots are coming,"
8:22.1  SAY:  "and the banks plan to issue digital debt instruments,"
8:24.7  SAY:  "basically bonds, with the coupons paid"
8:27.0  SAY:  "in tokenized deposits."
8:28.4  SAY:  "In the US, The Clearing House is building a network now,"
8:31.8  SAY:  "and Gilbert Verdian said on that same panel,"
8:34.0  SAY:  "it goes live in early 2027."
8:36.2  SAY:  "His words, his forecast."
```

## CH7 - THE CLOSE (8:38.4-9:23.3, Bed A solstice, card OFF)
```
8:38.4  [WHITEBOARD] WB11 IN (19.5 s → 8:58.0) assets/whiteboard/WB11.mp4 (from: 0.00) 'the islands, connected', part 1 full frame: the four islands from WB1 redraw; a fifth island with a coin is struck in orange; the Quant band; a bank door opens on each island; flag 'UK' with a check, flag 'US' with 'H1 2027'; NOTHING new draws under the two conditional sentences · draw-on cues assets/whiteboard/WB11.cues.md · ingress: the paper sheet comes in over 11 frames, out over 0.3 s (bucket 3 container move) → hand:paper-sheet (container-xfade, 0.37s)
8:38.4  [MUSIC] Bed CH7 solstice file in 212.09, sample-continuous with CH6, seat -24.3 dB = -17 dB under the raised VO: plateau, then the dip bar 68 on 8:53.0-8:56.3 (-18.8 under), the last bars 69-72 on 8:56.3-9:09.7, the fade from 9:09.7, silent at 9:22.8; the file's last sample on the last frame → 9:23.3
8:38.4  SAY:  "So here's my read on Quant after all of that."
8:41.2  SAY:  "Quant is not a coin trying to become"
8:42.8  SAY:  "the banks' new blockchain."
8:44.4  SAY:  "It's a layer the banks are actually letting into the building,"
8:47.6  SAY:  "live in the UK, with a date in the US."
8:50.5  SAY:  "Can the token re-rate again if the US network opens on time?"
8:55.4  SAY:  "It can, but you know, nobody can promise you that."
8:58.0  [TRANSITION] cover→face cut-in F9 → hand:film-burn (face-cut, 0.76s) (face pick)
8:58.0  [FACE] F9 IN → 9:04.2 "But every one of those banks is an island, and right now, Quant is the one holding the contracts that connects them." SCREEN SHARE verbatim. BODY FB10: whiteboard WB11, from 19.547, state payoff: contracts + threads
8:58.0  [WHITEBOARD] WB11 part 2, BODY FB10 in the deck area (the same clip scaled by 1464/1920, from: 19.547): the outlines re-ink on 'island' (540.32), 'TCH' and 'GBTD' contract documents on 'contracts' (542.84), threads to every vault on 'connects them' (543.68), the drawing holds to the window's end, silent
8:58.1  [MUSIC] hard hit (MUSIC-PLAN 538.12, the gear-3 landing line): no hit, the dip under the hedge then the arrangement's last full bars under this line · [IMPACT] layer: none (MUSIC-PLAN ruling: no hit, no stinger; the line lands alone)
8:58.1  SAY:  "But every one of those banks is an island,"
9:00.6  SAY:  "and right now, Quant is the one holding the contracts"
9:03.3  SAY:  "that connects them."
9:04.2  [TRANSITION] face→cover F9 out → hand:film-burn (face-cut, 0.76s)
9:04.2  [CONTAINER] K3 IN (5.3 s → 9:09.5) end card A, 'Quant' in orange, both actions at rest; 'them.' ends 544.28 under its first frames
9:04.3  SAY:  "And if you enjoyed this rundown,"
9:05.9  SAY:  "give this video a like, and hit that subscribe button"
9:07.0  [CONTAINER] K3-s1 ON 'like' (546.98): Like lit
9:07.0  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 546.91, the like glyph lands, then 'like,' runs on under it
9:07.8  [CONTAINER] K3-s2 ON 'subscribe' (547.80): Subscribe lit, holds to 9:09.5
9:07.8  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 547.73, the subscribe glyph lands
9:08.6  SAY:  "if you're new here."
9:09.5  [CONTAINER] K4 IN (13.9 s → 9:23.3) end card B, 'the community' headline, the band at rest. NO figure on the card: the 114x PerpsPad call and 'like a month ago' stay spoken only → hand:xfade-scale (container-xfade, 0.35s)
9:09.5  SAY:  "And like I said, like I mentioned earlier on,"
9:11.5  SAY:  "I do have a community, it's a rock star community."
9:14.4  SAY:  "We get in on like a lot of these awesome gains,"
9:16.7  SAY:  "like really, really early."
9:17.6  SAY:  "We just did like 114x on PerpsPad like a month ago."
9:21.4  SAY:  "So click the link in the description below."
9:21.6  [CONTAINER] K4-s1 ON 'click' (561.60): 'Link in the description' lit, holds to the last frame
9:21.6  [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, one press-release click, measured peak 1.07 s, -40 dB ends 1.20 s) play 1.00-1.25 MIX GAIN -10 dB file start 561.53, ON 'click the link', not on the last word
9:23.3  [END] the take's last word 'below.' ends 563.16, the spine ends 0.17 s later, no held still; the bed's fade has died under it. CTA close with K3 + K4 (GATE plan, no hard-out)
```

## Orphan reconciliation (every renderable file in assets/, PLACED by the rows above or marked here)
- **assets/title-slides (5, PLACED):** T2 0:54.0 · T3 3:27.4 · T4 5:33.5 · T5 6:34.9 · T6 8:14.6.
- **assets/card-slides, PLACED:** K1, K1-s1 to K1-s4 (FB2) · C4, C4-s1 to C4-s3 (FB6) · C4-plate (FB6, the count-up plate, never shown alone; BENCH if the comp does not count up) · K2, K2-s1 to K2-s3 · K3, K3-s1, K3-s2 · K4, K4-s1.
- **assets/diagrams, PLACED (13 states, Type 2 stills):** C1-whole (FB3, then 2:59.8) · C1-left-column · C1-left-core · C1-left-treasury · C1-left · C1-quant · C1-overledger · C1-flow · C1-payscript · C1-quantnet · C1-fusion · C1-right · C1-right-labels.
- **assets/charts, PLACED as DESIGN STATES of the animated charts (the comp animates to them on useCurrentFrame, comp-build section 7; a PNG standing in for a beat is a gate violation):** C5-start, C5-mid, C5-peak, C5-band, C5-run, C5-payoff · C6-start, C6-legend, C6-mid, C6-140, C6-82, C6-break, C6-273, C6-payoff · C7-s1-start, C7-s1-first, C7-s1-end, C7-s1-payoff, C7-s2-zoom, C7-s2-payoff.
- **assets/receipts, PLACED (13 receipts, 17 files):** C9-quant-home, C9-quant-home-scroll, C9-quant-home-b (FB1) · C10-quant-flow · C22-fusion · C20-verdian (FB4, then 3:30.1) · C14-gbtd-a-title, C14-gbtd-c-quant, C14-gbtd-b-body · R-TCH-JUN-tch · C12-tch-quant (FB5) · R-ROSALIND-bis · C13-boe-lab · C15-ecb-annex · C16-murex · R-DENTSU-dentsu · C21-overledger.
- **assets/whiteboard (13, PLACED):** WB12, WB1, WB2, WB3, WB4, WB5, WB14, WB6, WB7, WB13, WB8, WB10, WB11 (WB11 twice: 8:38.4 from 0.00, FB10 from 19.547).
- **assets/clip-inserts (1, PLACED):** CLIP-1-verdian 3:55.9, lead-in 3:49.7, lead-out 3:55.9. CLIP-2 REJECTED and CLIP-3 HELD at the screenplay: never captured, nothing lands.
- **assets/vid, assets/img, assets/transitions:** empty today (Envato 0, ChatGPT 0; the library transitions land with TRANSITIONS.md).
- **Build inputs and sidecars, never airing (BENCH):** assets/slide-sources/*, the *.html sources and *-data.json + *-spec.md in assets/charts and assets/diagrams, assets/whiteboard/*.brief.md and *.cues.md, assets/VISUAL-QA.json.
- **NOT on disk (the plan's fallback airs):** assets/img-motion/C9-motion.mp4 (IMG-MOTION 1) and C10-motion.mp4 (IMG-MOTION 3). Their slots play the stills; see Open decisions in CUE-SHEET.md.
- **Never placed by the plan (retired there, no file):** C3, C11, C17, C18, C23, C24, R-ISO, WB9.

## Layer tallies
- ACCENT: 9
- CARD: 5
- CHART: 39
- CONTAINER: 20
- DIAGRAM: 14
- END: 1
- FACE: 9
- HIGHLIGHT: 21
- INSERT: 1
- MUSIC: 11
- RECEIPT: 23
- SAY: 228
- TRANSITION: 17
- WHITEBOARD: 14
- WHOOSH: 2
