# bullish-on-kaspa - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author 2026-11-04 off the graph seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py) +
> `spine/ALL.d.desilenced.medium-words.json` + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md +
> `spine/jumpcuts-final.json` + assets/diagrams/_state-cues.md + assets/slide-sources/_state-cues.md + assets/charts/*.spec.md +
> assets/VISUAL-QA.json + the SCREENPLAY `[SHOW]` device lines (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; the comp is built TO this log).
> Watch file: `spine/ALL.d.desilenced.mp4` (528.37s / 8:48.4, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause and PRE-clip-insert.
> Three baked pauses shift the delivered timeline via `sh()` at comp and in mix_music.py, no chain shift is re-applied here: the Cinco beat pause
> (0.98 s at 65.10), CLIP-1 (10.8 s at 302.18), the text wall card pause (3.5 s at 455.74, baked with `--card-pause 3.5`).
> Transition ids are RESOLVED from TRANSITION-PLAN.json (authored next). Every kinetic-text whip and push is named `hand:kt-whip-cut` / `hand:kt-push-slide`.
> **THE STYLE (Mike):** Energetic, `kinetic-text-2023` full set, ONE track `oh-la-la` carved, LIGHT containers, NO title cards except the wall, chapters flow on `kt-whip-cut`,
> face style `optics` (each cover→face cut-in is a ZOOM Optics library move with its own baked sound, so the screenplay's whip sound on those cuts is NOT also placed; F1 opens the video and has no cut-in).
> Voice +3 dB at the FINAL mix, spine untouched (`settings.voice_db` 3.0).
> **CAPTIONS:** `kt-caption-highlight` IS the caption on all 9 FACE windows, as `[KT-CAPTION]` rows on each phrase's first spoken word, wording as SPOKEN (AS-RECORDED flags; never READY, never Kaspa Dollar). House caption track OFF. Nothing over a cover.
> **SOUND PLACEMENT:** `file start` = the device row's offset when it names one (band swoosh-4 -0.34, push swoosh-4 -0.10, side panel swoosh-1 -0.17 / swoosh-2 -0.07, icon swoosh-1 -0.233 / swoosh-2 -0.267, cash-register -0.17, and `file start ON` for wooden-rattle-whoosh, fast-reverse-5 items, ting, typing, ea-glitch-21 on the cut), else the catalog `attack_sec` lands on the frame. Whips land their peak ON the cut but are trimmed to the last 0.20 s before it, so no whip rides the last word of a line (Mike, lets-get-rich 2026-11-01).
> **RULED (Mike 2026-11-04):** text wall = 3.5 s card pause · stablecoin = 3-state card, C11 not placed · C26 = side panel over the FACE hold · Cinco = 0.98 s beat pause + sting · L2 TVL option A (live crops under the spoken "around $770,000") · Solana on-screen `$1.51` with no month · F1 v9, F2 t1, F3 t1 approved.
> **ZERO ORPHANS:** every file in `assets/` is PLACED with a timecode below or marked BENCH / REJECTED in the reconciliation at the end of this file. No MUSIC-PLAN vibe-cut duck exists (MUSIC-PLAN: "No automation rows"); the wall's silence into the drop does that job.

## CH1 - THE HOOK (0:00.0-0:37.8, one-track carve, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:03.4, no cut-in · [VIDEO-LAYER] assets/face-swap/F1-higgsfield-bg-swap.mp4 (v9, approved) full-frame over the
        window, superhero restyle on the rooftop backdrop, clip 0.0 = spine 0.0, no FACE_REFRAME, SPINE AUDIO KEPT · slow 5 percent push over the line
0:00.0  [CAPTION] ON → 0:03.4 as kt-caption-highlight (FACE window only)
0:00.0  [KT-CAPTION] open_stretch "I AM MORE BULLISH ON KASPA" (BULLISH in the accent), scale-height 300 to 100 + skew 10 to 0 over 0.48 s ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 0.00
0:00.0  [MUSIC] Bed CH1 3_37-7 INTRO GROOVE from master 8.584, subtle, -21 dB under VO → 0:08.0
0:00.0  [MUSIC] hard hit (MUSIC-PLAN 0.00): the groove is present on word one, no fade · [IMPACT] layer: none (the open's swoosh-4 owns frame 0)
0:00.0  SAY:  "I am more bullish on Kaspa now than I've ever been"
0:01.9  [KT-CAPTION] "NOW THAN I'VE EVER BEEN" (EVER in the accent), hard cut, silent
0:03.4  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s)
0:03.4  [VIDEO] BR-1-phone-chart-hands IN (2.6 s → 0:06.0) KAS price chart on a phone, whip-zoom landing ·
        [ACCENT] ea-glitch-21 (kinetic-text/ea-glitch-21.mp3, mood_class neutral, file start ON the cut, its 0.86 s attack lands on the pop) file start 3.37
0:03.4  SAY:  "and it has nothing to do with the price."
0:04.2  [KT-HEADLINE] "NOTHING TO DO / WITH THE PRICE" two lines centred, pop 0.8 s after the cut, holds to 0:06.0 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 4.17
0:06.0  [TRANSITION] hand:kt-whip-cut onto BR-2 · [WHOOSH] fast-reverse-1 (kinetic-text/fast-reverse-1.wav, mood_class neutral) play 0.20-1.32 file start 5.80
0:06.0  [VIDEO] BR-2-asic-shelves-blue IN (3.7 s → 0:09.7) mining farm, ASIC rows, slow dolly
0:06.0  SAY:  "This network launched in November of 2021 with no premine, no pre-sale, no insider allocation."
0:06.6  [KT-STACK] headline "FAIR LAUNCH" ON 'launched', top-frame · [ACCENT] wooden-rattle-whoosh (kinetic-text/wooden-rattle-whoosh.wav, mood_class neutral) file start 6.62
0:08.0  [MUSIC] Bed CH1 3_37-7 subtle -21 dB under VO → 0:15.9
0:09.7  [VIDEO] BR-3-teal-cooling-fans IN (3.7 s → 0:13.4) ASIC fans and cables, the stack carries across the cut → hand:fade (broll-fade, 0.50s)
0:09.7  [KT-STACK] item "NO PREMINE" ON 'premine' · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 9.74
0:10.9  [KT-STACK] item "NO PRE-SALE" ON 'pre-sale' · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 10.86
0:11.9  [KT-STACK] item "NO INSIDER ALLOCATION" ON 'insider' · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 11.94
0:13.4  [TRANSITION] hand:kt-push-slide the stack pushes out RIGHT with its footage · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 13.16
0:13.4  [RECEIPT] C21-kaspa-org-hero IN (3.8 s → 0:17.1) full-frame, settling push to 'No premine. No hidden allocation. Fair launch.' · treatment: highlight
0:13.4  SAY:  "Every single coin in circulation was mined, in the open, from the first day of mainnet onward."
0:14.1  [HIGHLIGHT] C21 wipe on 'Fair launch' ON 'coin'
0:15.6  [KT-ICON] PICKAXE flat SVG in the accent slides in from the left ON 'mined' · [WHOOSH] swoosh-1 (kinetic-text/swoosh-1.mp3, mood_class neutral) play 0-0.767 file start 15.37
0:15.9  [MUSIC] Bed CH1 3_37-7 subtle, rising from 29.633 into the drop, -21 dB under VO → 0:31.6
0:17.1  [IMAGE] IMG-1-pickaxe-coin IN (2.3 s → 0:19.4) greenish-cyan coin (backwards-K) cut from rock by a pickaxe, sparks → lib:invert-short-2 (glitch-still, 0.20s)
0:19.4  [TRANSITION] cover→face cut-in F2 → lib:zoom-optics-in (face-cut, 0.76s) (face pick)
0:19.4  [FACE] F2 IN → 0:26.6 · [VIDEO-LAYER] assets/face-swap/F2-higgsfield-bg-swap.mp4 (t1, approved) full-frame over the window, per its sidecar, SPINE AUDIO KEPT. Join 26.600 sits at the window edge: no punch, no leak
0:19.4  [CAPTION] ON → 0:26.6 as kt-caption-highlight
0:19.6  [KT-CAPTION] "NOBODY WAS JUST HANDED KASPA" (NOBODY in the accent), hard cut, silent
0:19.6  SAY:  "Nobody was just handed Kaspa. You earned it from a machine or you bought it from somebody who did."
0:22.3  [KT-CAPTION] "YOU EARNED IT FROM A MACHINE" (EARNED in the accent), hard cut, silent
0:22.5  [KT-SPARK] burst 1 on EARNED's last letter · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 22.54
0:22.9  [KT-SPARK] burst 2, 0.4 s later · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 22.94
0:23.9  [KT-CAPTION] "OR YOU BOUGHT IT FROM SOMEBODY WHO DID", hard cut, silent
0:26.6  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s)
0:26.6  [VIDEO] BR-4-code-monitor-closeup IN (2.8 s → 0:29.4) code editor, dark IDE, whip-zoom landing ·
        [ACCENT] ea-glitch-21 (kinetic-text/ea-glitch-21.mp3, mood_class neutral, file start ON the cut, its 0.86 s attack lands on the pop) file start 26.63
0:26.6  SAY:  "And for 5 years, through the run up and through the crash, builders never stopped."
0:27.4  [KT-HEADLINE] "5 YEARS OF BUILDING" pop 0.8 s after the cut, persists across BR-4 and BR-5 to 0:31.4 · [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 27.43
0:28.8  [RISER→IMPACT] Edgy_Riser (risers/Edgy_Riser.wav, mood_class hype, soft_taper, measured peak 5.15 s) play 2.40-5.20 MIX GAIN -24 dB 0.3 s fade-in file start 28.85, ENDS on the DROP 1 hit at 31.60, UNDER the VO
0:29.4  [VIDEO] BR-5-programmer-night-office IN (2.0 s → 0:31.4) developers late at night, slow push → hand:fade (broll-fade, 0.50s)
0:31.4  [TRANSITION] cover→face cut-in F3 → lib:zoom-optics-in-impact (face-cut, 0.84s) (face pick)
0:31.4  [FACE] F3 IN → 0:35.7 · [VIDEO-LAYER] assets/face-swap/F3-higgsfield-bg-swap.mp4 (t1, approved) full-frame over the window, per its sidecar, SPINE AUDIO KEPT. Join 35.667 sits at the window edge: no punch, no leak
0:31.4  [CAPTION] ON → 0:35.7 as kt-caption-highlight
0:31.4  [KT-ICON] image_sticker KASPA COIN (greenish cyan, backwards-K, schedule-tweets/images/reference/kaspa-logo.png) hard cut beside the head with the cut-in, no sound of its own → 0:35.7
0:31.6  [MUSIC] Bed CH1 3_37-7 DROP 1, part A, aggressive, -17 dB under VO → 0:37.5
0:31.6  [MUSIC] hard hit (MUSIC-PLAN 31.60): DROP 1, master bar 12, on the cut to F3, in the gap after 'stopped.' ·
        [IMPACT] Kick_Impact_01-short (Impacts/Kick_Impact_01-short.wav, mood_class hype, measured peak 0.18 s, -40 dB tail ends 0.54 s) file start 31.42
0:32.1  [KT-CAPTION] two_colour_pop title "BULLISH ON / KASPA" ON '2026', caps 80 px at 75 to 80 percent height, KASPA in the accent, holds across BR-6 to the chapter whip 0:37.8 ·
        [ACCENT] wooden-rattle-whoosh (kinetic-text/wooden-rattle-whoosh.wav, mood_class neutral) file start 32.10
0:32.1  SAY:  "2026 is the year it came all online."
0:35.7  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s)
0:35.7  [VIDEO] BR-6-night-aerial-city-dusk IN (2.1 s → 0:37.8) aerial rising over a skyline (literal 'from the top'), leading motion
0:35.9  SAY:  "So let's take this from the top."
0:37.5  [MUSIC] Bed CH2 3_37-7 PLATEAU, subtle, -23 dB under VO → 0:49.3
0:37.5  [MUSIC] hard hit (MUSIC-PLAN 37.50): bar-line splice down to the plateau · [IMPACT] layer: none (a fall, the swoosh-8 chapter whip 0.34 s later owns it)
```

## CH2 - WHAT IT IS (0:37.8-1:44.3, one-track carve, card OFF)
```
0:37.8  [TRANSITION] hand:kt-whip-cut chapter whip into CH2 · [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral) play 0.09-2.28 file start 37.64
0:37.8  [IMAGE] IMG-2-coin-hero IN (2.3 s → 0:40.1) Kaspa coin hero, backwards-K, rim light
0:37.8  SAY:  "Now here's what Kaspa actually is."
0:40.1  [TRANSITION] hand:kt-push-slide C1 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 40.02
0:40.1  [DIAGRAM] C1-A-chain IN, push in on 3 blocks in one chain
0:40.1  SAY:  "Bitcoin runs one block at a time and when two miners find a block at the same moment, one of them gets thrown away."
0:43.5  [DIAGRAM] C1-A-fork ON 'find': two blocks land together, FOUND AT THE SAME MOMENT bracket
0:46.2  [DIAGRAM] C1-A ON 'thrown': one greys and falls, the chain runs on
0:46.2  [KT-POP] "THROWN AWAY" over the dropped block, centre (930, 770), holds through the swap to 0:47.3 · [ACCENT] minecraft-damage (kinetic-text/minecraft-damage.wav, mood_class neutral, the ONE negative verdict) file start 45.55
0:46.9  [TRANSITION] C1-A to C1-B → lib:melt-rgb-short-3 (MELT-transform, 0.44s), SFX ducked
0:46.9  [DIAGRAM] C1-B ON 'Kaspa': spotlight swap to the DAG, same time rail
0:47.1  SAY:  "Kaspa keeps every block. They land in parallel, in a graph, and GhostDAG puts them all in order."
0:47.9  [KT-POP] "EVERY BLOCK COUNTS" ON 'every', free band y 950 to 1010, holds 2 s · [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 47.28
0:49.3  [MUSIC] Bed CH2 3_37-7 subtle -23 dB under VO → 1:01.1
0:51.3  [DIAGRAM] C1-B-lit ON 'GhostDAG' (51.36): ordering thread draws, lands on 'order' (52.76), GHOSTDAG: ONE ORDER chip
0:52.9  [DIAGRAM] C1-C-start ON 'Kaspa': headline swaps, ONE SECOND bracket, thread stays lit
0:52.9  SAY:  "Kaspa is a fully implemented GhostDAG, running proof of work at 10 blocks a second, since the Crescendo hard fork on May 5th, 2025."
0:56.4  [DIAGRAM] C1-C-mid ON 'running': blocks under the bracket fill dark one by one
0:57.7  [DIAGRAM] C1-C ON '10': all 10 dark, the digit lands
0:57.7  [KT-POP] chip "10 BLOCKS / SECOND" rises ON '10', free band y 950 to 1010 · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 57.22
0:59.3  [RECEIPT] C27-rusty-kaspa-v1 IN (4.3 s → 1:03.6) rusty-kaspa v1.0.0 Crescendo notes, settling push · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
1:01.1  [MUSIC] Bed CH2 3_37-7 subtle -23 dB under VO → 1:12.9
1:01.3  [HIGHLIGHT] C27 wipe on 'projected to occur on May 5, 2025' ON 'May'
1:03.6  [IMAGE] IMG-3-sombrero-coin IN (1.9 s → 1:05.5) coin in a Mexican sombrero, confetti, maracas (Mike's ask); holds through the pause → lib:invert-max-1 (glitch-still, 0.44s)
1:03.6  SAY:  "El Cinco de Mayo!"
1:04.2  [OVERLAY] assets/overlays/confetti-burst-alpha.webm full-frame ABOVE the cover (OffthreadVideo transparent), muted, 0.15 s before 'Mayo!', source 64.23; runs through the pause, cut at the cover's end
1:05.1  [BRAAM] mexican-sting-a-la-mariachi.wav (stings/mexican-sting-a-la-mariachi.wav, mood_class hype, 1.42 s, Hola Hola 'A La Mariachi', Mike's ask) spine pause 0.98 s at 65.10, play 0-1.12, 0.12 s fade-out so it ends before "The" (the pause baked at 65.40 for 1.00 s, "The" lands 1.14 s after its start), ZOOM to "the sombrero coin" (gentle, under the confetti); the sting runs on 0.44 s past the pause and ends before 'The block reward'
1:05.5  [TRANSITION] hand:kt-push-slide C2 pushes in · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 65.44
1:05.5  [CHART] C2-A-start IN (9.6 s → 1:15.1) push in on the two empty cards; no pop, silent chart
1:05.5  SAY:  "The block reward does not halve every 4 years. It shrinks a little every single month, a smooth halving, toward the hard cap of around 28.7 billion."
1:07.1  [CHART] C2-A grey staircase draws ON 'every 4 years'
1:08.5  [CHART] C2-A-mid stepped reward curve draws, 'shrinks' to 'halving'
1:12.0  [CHART] C2-A total supply line rises ON 'toward the hard cap', cap line draws ON 'cap' (72.64)
1:12.9  [MUSIC] Bed CH2 3_37-7 subtle -23 dB under VO → 1:24.7
1:13.1  [CHART] C2-A-payoff HARD CAP 28.7B KAS fades up ON 'around', settled before 'billion'; KAS, never a dollar sign
1:15.1  [TRANSITION] hand:kt-whip-cut onto BR-7 · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 74.90
1:15.1  [VIDEO] BR-7-old-books-library IN (3.6 s → 1:18.7) old library, tall shelves, slow dolly, calm
1:15.1  SAY:  "And the research behind it is older than most of crypto."
1:18.7  [RECEIPT] C19-eth-whitepaper-ghost IN (8.5 s → 1:27.2) Ethereum whitepaper 'Modified GHOST Implementation', settling push · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
1:18.7  SAY:  "The GHOST protocol, 2013. Yonatan Sompolinsky and Aviv Zohar, credited by name in the Ethereum whitepaper."
1:19.9  [KT-POP] "2013" ON '2013', holds 1.8 s · [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 79.94
1:21.9  [HIGHLIGHT] C19 wipe on 'first introduced by Yonatan Sompolinsky and Aviv Zohar in December 2013' ON 'Yonatan'
1:24.7  [MUSIC] Bed CH2 3_37-7 subtle, rising from 96.518 into the next drop, -23 dB under VO → 1:38.5
1:27.1  [CONTAINER] research-stack-s1 IN (5.1 s → 1:32.3) THE RESEARCH, GHOST 2013 · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 87.18 → hand:xfade-scale (container-xfade, 0.35s)
1:27.1  SAY:  "GhostDAG, the paper, 2018. DAGKnight, 2022."
1:28.9  [CONTAINER] research-stack-s2 ON '2018', + GHOSTDAG 2018 · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 88.94
1:31.1  [CONTAINER] research-stack-s3 ON '2022', + DAGKNIGHT 2022 · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 91.10
1:32.2  [RECEIPT] C16-arxiv-founder IN (5.0 s → 1:37.3) arXiv 2609.12197 title block, push onto the title block and author line so the body text does not compete · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
1:32.2  SAY:  "And the founder is a research associate at Harvard, still publishing in 2026."
1:37.3  [TRANSITION] cover→face cut-in F4 → lib:zoom-optics-in-out-1 (face-cut, 0.76s) (face pick)
1:37.3  [FACE] F4 IN → 1:44.2  Join 104.033 sits within 0.5 s of the window edge: no punch, no leak
1:37.3  [CAPTION] ON → 1:44.2 as kt-caption-highlight
1:37.4  [KT-CAPTION] "THAT'S NEARLY 8 YEARS OF PUBLISHED RESEARCH" (8 YEARS in the accent), hard cut, silent
1:37.4  SAY:  "That's nearly 8 years of published research before the first block on mainnet was ever even mined."
1:38.5  [MUSIC] Bed CH3 3_37-7 DROP 2, part A, aggressive, -19 dB under VO, rising → 1:52.3
1:38.5  [MUSIC] hard hit (MUSIC-PLAN 98.485): RISE bar 43 kick under 'That's', DROP 2 inside '8' · [IMPACT] layer: none (over speech on the face, the arrangement's own drop owns it)
1:39.9  [KT-SPARK] one burst on RESEARCH · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 99.94
1:40.5  [KT-CAPTION] "BEFORE THE FIRST BLOCK ON MAINNET WAS EVER EVEN MINED" (MINED in the accent), hard cut, silent
1:44.2  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s)
1:44.2  [VIDEO] BR-8-cargo-ship-sailing IN (3.7 s → 1:47.9) loaded container ship, slow aerial (literal 'shipped')
```

## CH3 - WHAT JUST LAUNCHED (1:44.3-3:58.1, one-track carve, card OFF)
```
1:44.3  [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral, the chapter whip, peak on 'Now', 80 ms after the F4 cut-out) play 0.09-2.28 file start 104.08
1:44.3  SAY:  "Now we get to what ship. June 30th, 2026. The Toccata hard fork."
1:47.8  [RECEIPT] C6-rusty-kaspa-v2-toccata IN (3.8 s → 1:51.7) 'Mainnet Toccata Release - v2.0.0', settling push to the activation sentence · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
1:48.0  [HIGHLIGHT] C6 wipe on the activation sentence (DAA 474,165,565, June 30, 2026) ON 'Toccata'
1:49.0  SAY:  "The Layer 1 became programmable."
1:50.4  [KT-POP] "LAYER 1 IS PROGRAMMABLE" ON 'programmable', holds to 1:51.7 · [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 109.78
1:51.7  [TRANSITION] hand:kt-push-slide C5 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 111.60
1:51.7  [DIAGRAM] C5-overview IN (11.8 s → 2:03.5) the receipts timeline, shown ONCE, all 12 rungs grey, during the push-in only
1:51.7  [DIAGRAM] C5-toccata ON 'Covenant': JUN 30 2026 TOCCATA lit, COVENANTS chip lit
1:51.7  SAY:  "Covenant, transaction introspection, and zero-knowledge verification. Native, on the base layer."
1:52.3  [MUSIC] Bed CH3 3_37-7 FULL CHORUS 2, aggressive, -17 dB under VO → 2:39.5
1:52.6  [DIAGRAM] C5-intro ON 'transaction': INTROSPECTION lit
1:54.5  [DIAGRAM] C5-zk ON 'zero': ZK VERIFICATION lit
1:58.4  SAY:  "2 days later, July 2nd, the first smart coins went live on mainnet."
1:59.4  [DIAGRAM] C5-jul2 ON 'July': JUL 2 FIRST SMART COINS lit
1:59.4  [KT-POP] chip "JULY 2" ON 'July' · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 118.84
2:03.5  [TRANSITION] C5-jul2 to C8 → lib:spin-3d-center-ease-t-cw (SPIN-newfacet, 0.88s), SFX ducked
2:03.5  [RECEIPT] C8-silverscript-v1 IN (3.5 s → 2:07.0) Silverscript v1.0.0 GitHub release shown as an object · treatment: pan · [MOTION] lib:motion-3d-pan-2-right
2:03.5  SAY:  "September 9th, Silverscript version 1.0."
2:07.0  [CONTAINER] silverscript-60-lines-s1 IN (6.1 s → 2:13.1) THOUSANDS OF LINES, kt-word-by-word, silent phrase → hand:xfade-scale (container-xfade, 0.35s)
2:07.0  SAY:  "A token that took thousands of lines of raw opcodes, now around 60 readable lines."
2:10.6  [CONTAINER] silverscript-60-lines-s2 ON 'now', + NOW, silent
2:11.2  [CONTAINER] silverscript-60-lines-s3 ON '60', payoff AROUND 60 LINES big in the accent, source line Kaspa Commons · [ACCENT] cash-register-2 (kinetic-text/cash-register-2.wav, mood_class neutral) file start 130.86
2:13.0  [VIDEO] BR-9-hammer-dust IN (2.1 s → 2:15.1) sledgehammer strike, dust burst (literal 'Bam') · → hand:fade (broll-fade, 0.25s)
        [IMPACT] Kick_Impact_01-tight (Impacts/Kick_Impact_01-tight.wav, mood_class hype, measured peak 0.18 s, -40 dB tail ends 0.31 s, physical contact) file start 132.90
2:13.0  SAY:  "Bam. Doesn't that make it easy?"
2:15.1  [TRANSITION] hand:kt-whip-cut onto BR-10 · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 134.94
2:15.1  [VIDEO] BR-10-red-server-room IN (3.7 s → 2:18.8) server room, red warning lights, handheld
2:15.1  SAY:  "September 20th, an outside indexer for the old KRC-20 tokens got exploited."
2:16.3  [KT-BAND] "AN OUTSIDE INDEXER WAS EXPLOITED. KASPA'S LAYER 1 WAS NOT." moves ON 'an' (136.38), 4 s hold across BR-10 and BR-11, slides down 2:20.5 to 2:21.4, clear before the diagram; never 'Kaspa was hacked' ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 136.04
2:16.5  [ACCENT] knock-pop ON the band text, 0.13 s after the band (kinetic-text/knock-pop.wav, mood_class neutral) file start 136.51
2:18.8  [VIDEO] BR-11-rusty-padlock-opens IN (2.8 s → 2:21.6) padlock shackle snapping open, macro, under the band → hand:fade (broll-fade, 0.50s)
2:20.5  SAY:  "But here's the thing, Kaspa's Layer 1 was never touched. The flaw was in the bookkeeping outside of the chain."
2:21.6  [TRANSITION] BR-11 to indexer-vs-l1-l1 → lib:spin-3d-center-ease-short-b-ccw (SPIN-newfacet, 0.44s), SFX ducked
2:21.6  [DIAGRAM] indexer-vs-l1-l1 IN (5.3 s → 2:26.9) ON 'Kaspa's': L1 box, shield, UNTOUCHED, indexer quiet in grey dashes
2:24.0  [DIAGRAM] indexer-vs-l1-flaw ON 'flaw': flaw mark lands, indexer border goes to ink
2:26.8  [RECEIPT] C28-kccs-readme IN (7.4 s → 2:34.3) the kaspanet/kccs repo README as an object, the KCC-20 row in frame on 'KCC' · treatment: pan · [MOTION] lib:motion-3d-pan-1-left → hand:xfade-scale (container-xfade, 0.35s)
2:26.8  SAY:  "And the fix was already being built. KCC-20, tokens on the Layer 1 itself. Written in August."
2:34.2  [RECEIPT] C7-kccforum-final-post IN (4.2 s → 2:38.5) @kccforum 'KCC-1, KCC-2 and KCC-20 are now Final', real pixels · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
2:34.2  SAY:  "October 21st, 2026. It was declared final."
2:37.1  [KT-ICON] SHIELD-CHECK flat SVG slides in from the right ON 'declared' · [WHOOSH] swoosh-2 (kinetic-text/swoosh-2.wav, mood_class neutral) play 0-0.767 file start 156.87
2:37.5  [KT-POP] punch "FINAL" in accent red with the glow ON 'final', the ONE red word of the chapter · [ACCENT] punch-1-2023 (kinetic-text/punch-1.mp3, mood_class neutral) file start 157.32
2:38.4  [DIAGRAM] consensus-validates-rules IN (7.8 s → 2:46.3) ON 'Token': ring + TOKEN RULES, nodes and miners unchecked → hand:xfade-scale (container-xfade, 0.35s)
2:38.4  SAY:  "Token rules enforced by Kaspa's own consensus. The rules every node and every miner validates, not an outside indexer."
2:39.5  [MUSIC] Bed CH3 3_37-7 aggressive -17 dB under VO → 3:10.9
2:42.4  [DIAGRAM] consensus-validates-validators ON 'every': checks land on nodes and miners together
2:44.7  [DIAGRAM] consensus-validates-indexer-out ON 'not': OUTSIDE INDEXER crossed out
2:46.2  [TRANSITION] hand:kt-push-slide C9 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 166.18
2:46.2  [RECEIPT] C9-kascov-tokens-scroll IN (8.8 s → 2:55.1) screen recording from 0, slow scroll, gold highlight on the KCC-20 NACHO row, crop the right side at about x 1625 · treatment: push
2:46.2  SAY:  "As of early November, around 460 tokens are live on the Layer 1, with markets and live trades tracked right on the explorer."
2:55.0  [IMAGE] IMG-4-nacho-coin IN (3.6 s → 2:58.6) Nacho the Kat beside a greenish-cyan Kaspa coin, playful → lib:invert-short-3 (glitch-still, 0.20s)
2:55.0  SAY:  "And Nacho, the biggest meme token on Kaspa, opened its one-way migration to KCC-20 on October 30th, closing on January 31st, 2027."
2:58.6  [RECEIPT] C10-nacho-migration IN (7.7 s → 3:06.3) nachothekat.xyz, settling push to the deadline line, no burn implied · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
3:03.9  [HIGHLIGHT] C10 wipe on 'FINAL DAY Jan 31, 2027' ON 'January'
3:06.3  [TRANSITION] hand:kt-whip-cut onto BR-12 · [WHOOSH] fast-reverse-1 (kinetic-text/fast-reverse-1.wav, mood_class neutral) play 0.20-1.32 file start 186.12
3:06.3  [VIDEO] BR-12-datacenter-hallway IN (3.6 s → 3:09.9) datacenter corridor, leading dolly
3:06.3  SAY:  "Then, the L2 stack. Igra opened its public mainnet on March 19th, 2026, after six months of testing the Sigma Prime audit."
3:07.4  [KT-STACK] headline "THE L2 STACK" ON 'stack' · [ACCENT] wooden-rattle-whoosh (kinetic-text/wooden-rattle-whoosh.wav, mood_class neutral) file start 187.48
3:08.0  [KT-STACK] item "IGRA · MAR 19 2026" ON 'Igra' (cue from the audio, the JSON is garbled at 188.06), clears at 3:09.9 · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 188.06
3:09.9  [RECEIPT] C29-igra-cryptopotato IN (4.9 s → 3:14.8) Igra public-mainnet release, settling push; testing and the audit stay TWO things · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
3:10.9  [MUSIC] Bed CH3 3_37-7 aggressive, right-aligned to the chapter's end, -17 dB under VO → 3:58.2
3:12.2  [HIGHLIGHT] C29 wipe on 'Following six months of testing with zero state divergence' ON 'six'
3:13.6  [HIGHLIGHT] C29 wipe on 'A security audit by Sigma Prime completed with no unresolved issues' ON 'Sigma'
3:14.8  [RECEIPT] C20-kaskad-hero IN (7.1 s → 3:21.9) kaskad.app/protocol hero 'Live on Robinhood Chain & Igra', settling push · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
3:14.8  SAY:  "And on Igra there's a lending protocol called Kaskad, live since May, double audited, with staking for governance."
3:18.4  [RECEIPT] C20 stage 2: C20-kaskad-about ON 'live', 'live on Igra (May 2026)' · [HIGHLIGHT] on the date
3:19.5  [RECEIPT] C20 stage 3: C20-kaskad-audits ON 'double', DOUBLE AUDITED BY SHERLOCK badge at side-panel size over the dimmed page (the file is 770x367, never full frame)
3:20.6  [RECEIPT] C20 stage 4: C20-kaskad-staking ON 'staking' · [HIGHLIGHT] on the governance staking line
3:21.8  [TRANSITION] hand:kt-push-slide C23 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 201.78
3:21.8  [RECEIPT] C23-kasplex-docs IN (7.5 s → 3:29.3) Kasplex L2 docs page, settling push, no zk or finality claim on screen · treatment: highlight
3:21.8  SAY:  "The second L2 is Kasplex, a full EVM Layer 2, so Ethereum apps can move over with minimal changes."
3:24.2  [HIGHLIGHT] C23 wipe on 'Full EVM Equivalence' ON 'full'
3:28.0  [HIGHLIGHT] C23 wipe on 'Sequencing and data availability are managed by Kaspa's Layer 1' ON 'minimal', leading the next line
3:29.3  [DIAGRAM] kasplex-based-rollup-base IN (5.4 s → 3:34.8) ON 'Kaspa': L2 above, L1 below, arrows down → hand:xfade-scale (container-xfade, 0.35s)
3:29.3  SAY:  "Kaspa itself orders its transactions, and KAS is the only gas token."
3:32.9  [DIAGRAM] kasplex-based-rollup-gas ON 'gas': KAS = THE ONLY GAS chip lands · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 212.42
3:34.7  [RECEIPT] C24-defillama-kasplex IN (6.0 s → 3:40.7) DefiLlama Kasplex protocols table, settling push · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
3:34.7  SAY:  "ZealousSwap, KrokoSwap, and KaspaCom are all running on it, and since April 2026, Gate lets you move KAS onto it directly from the exchange."
3:34.8  [HIGHLIGHT] C24 ZealousSwap row ON its name
3:35.4  [HIGHLIGHT] C24 KrokoSwap row ON its name
3:36.4  [HIGHLIGHT] C24 KaspaCom row ON its name
3:40.7  [RECEIPT] C30-gate-kasplex-cryptonews IN (3.3 s → 3:44.0) crypto.news 'Gate integrates Kasplex Layer 2', the headline as the object · treatment: pan · [MOTION] lib:motion-3d-pan-2-up → hand:xfade-scale (container-xfade, 0.35s)
3:44.0  [TRANSITION] hand:kt-push-slide C14 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 223.92
3:44.0  [RECEIPT] C14-explorer-stats IN (9.2 s → 3:53.2) explorer.kaspa.org stats header, push framed on the top stats panel (above about y 700 in source pixels) · treatment: push
3:44.0  SAY:  "And the network itself is closing in on 2.5 billion transactions, with more than 565,000 addresses holding at least one KAS."
3:47.1  [KT-POP] "2.4 BILLION TRANSACTIONS" ON 'billion', the capture-day count (over 2,444 M), never 'crossed', holds 1.8 s · [ACCENT] cash-register (kinetic-text/cash-register.wav, mood_class neutral) file start 226.93
3:49.1  [RECEIPT] C14 stage 2: push to the Wallet addresses figure (568,035) ON '565'
3:53.2  [TRANSITION] cover→face cut-in F5 → lib:zoom-optics-out (face-cut, 0.76s) (face pick)
3:53.2  [FACE] F5 IN → 3:57.9  Join 237.600 sits within 0.5 s of the window edge: no punch, no leak
3:53.2  [CAPTION] ON → 3:57.9 as kt-caption-highlight
3:53.4  [KT-CAPTION] "NOBODY OWNS A NETWORK" (OWNS in the accent), hard cut, silent
3:53.4  SAY:  "Nobody owns a network, and nobody asks for permission, yet it all ships."
3:54.9  [KT-CAPTION] "AND NOBODY ASKS FOR PERMISSION", hard cut, silent
3:56.8  [KT-CAPTION] "YET IT ALL SHIPS" (SHIPS in the accent), hard cut, silent
3:56.9  [KT-SPARK] burst 1 on SHIPS · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 236.96
3:57.3  [KT-SPARK] burst 2, 0.4 s later · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 237.36
3:57.9  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.76s)
3:57.9  [VIDEO] BR-13-night-road-horizon IN (2.3 s → 4:00.2) night road at speed, light trails, leading
```

## CH4 - WHAT IS COMING (3:58.1-5:37.3, one-track carve, card OFF)
```
3:58.1  [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral, the chapter whip, peak on 'Now,', 220 ms after the F5 cut-out) play 0.09-2.28 file start 237.92
3:58.1  SAY:  "Now, what's coming?"
3:58.2  [MUSIC] Bed CH4 3_37-7 thinning bar 75, -19 dB under VO → 4:00.1
3:58.2  [MUSIC] hard hit (MUSIC-PLAN 238.157): the chorus's own thinning bar under 'Now, what's coming?', the BREAKDOWN on 'vProgs' · [IMPACT] layer: none (a fall, the chapter whip owns it)
4:00.1  [MUSIC] Bed CH4 3_37-7 BREAKDOWN, dip, -24 dB under VO → 4:08.0
4:00.2  [TRANSITION] hand:kt-push-slide D1 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 240.10
4:00.2  [DIAGRAM] D1-A IN (6.8 s → 4:07.0) ON 'vProgs': L1 box, three apps, wires quiet; no date, no number
4:00.2  SAY:  "vProgs. Apps that live on Kaspa's own Layer 1, and talk to each other directly. No rollup in between."
4:03.5  [DIAGRAM] D1-A-lit ON 'talk': arrows light, TALK TO EACH OTHER
4:05.3  [DIAGRAM] D1-A-norollup ON 'No': NO ROLLUP IN BETWEEN
4:06.9  [RECEIPT] C32-kaspa-build IN (5.0 s → 4:11.9) kaspa.org/build vProgs 'In construction', settling push; no date anywhere on screen · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
4:06.9  SAY:  "It's still under construction, the runtime is still evolving, and there's no public ship date."
4:07.6  [KT-POP] "UNDER CONSTRUCTION" ON 'construction', holds 1.8 s · [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 247.66
4:08.0  [MUSIC] Bed CH4 3_37-7 dip, rising from 261.764 into DROP 3, -24 dB under VO → 4:23.7
4:09.4  [HIGHLIGHT] C32 wipes on 'The shared-state application path is under construction' and 'not yet a stable external developer API' ON 'evolving'
4:11.9  [RECEIPT] C15-kaspa-lore IN (5.0 s → 4:16.9) kaspa.org/lore DAGKnight paragraph, settling push · treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
4:11.9  SAY:  "And then, DAGKnight. The consensus upgrade that follows Toccata."
4:13.9  [HIGHLIGHT] C15 wipe on 'DAGKnight is the consensus protocol upgrade that follows Toccata' ON 'consensus'
4:16.8  [TRANSITION] hand:kt-whip-cut onto BR-14 · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 256.68
4:16.8  [VIDEO] BR-14-data-tunnel-streaks IN (3.6 s → 4:20.5) data light streaks rushing at camera
4:16.8  SAY:  "Block times targeted at 25 to 40 milliseconds."
4:20.5  [CONTAINER] bps-ladder-s1 IN (7.4 s → 4:27.9) 10 NOW, kt-word-by-word, silent phrase → hand:xfade-scale (container-xfade, 0.35s)
4:20.6  SAY:  "That's 25 to 40 blocks a second."
4:21.0  [CONTAINER] bps-ladder-s2 ON '25', + 25 TO 40 TARGETED NEXT, silent
4:23.1  SAY:  "And 100 blocks a second is targeted for a 2027 hard fork."
4:23.3  [CONTAINER] bps-ladder-s3 ON '100', payoff 100 big in the accent, TARGETED FOR A 2027 HARD FORK; 'targeted', never 'will' · [ACCENT] cash-register-2 (kinetic-text/cash-register-2.wav, mood_class neutral) file start 263.02
4:23.7  [MUSIC] Bed CH4 3_37-7 DROP 3, aggressive, -21 dB under VO, the full chorus 3 -17 from 267.666 → 4:51.3
4:23.7  [MUSIC] hard hit (MUSIC-PLAN 263.731): RISE bar 83, DROP 3 inside '100' · [IMPACT] layer: none (the cash-register-2 on '100' is the event's one sound, the drop lands 0.35 s behind it)
4:27.9  [TRANSITION] hand:kt-whip-cut onto BR-15 · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 267.70
4:27.9  [VIDEO] BR-15-dollar-printing-press IN (3.7 s → 4:31.6) dollars on a printing press, slow pan; nothing names Kaspa Dollar
4:27.9  SAY:  "And then, a stablecoin, issued against KAS and settled on the base layer."
4:31.6  [CONTAINER] stablecoin-card-A-s1 IN (8.5 s → 4:40.1) state A, the two chips, project name withheld → hand:xfade-scale (container-xfade, 0.35s)
4:33.6  [CONTAINER] stablecoin-card-A-s2 ON 'Community', + COMMUNITY FUNDED
4:33.6  SAY:  "Community funded, led by a core developer, Alexander Safstrom, the author of the KIP-16."
4:34.6  [CONTAINER] stablecoin-card-A-s3 ON 'led', + LED BY A CORE DEVELOPER, ALEXANDER SAFSTROM
4:37.9  [CONTAINER] stablecoin-card-A-s4 ON 'author', + AUTHOR OF KIP-16
4:40.1  [CONTAINER] stablecoin-card-B-s1 IN (8.8 s → 4:48.9) state B, headline only; no funded bar, no percent → hand:xfade-scale (container-xfade, 0.35s)
4:40.1  SAY:  "The goal is 5 million KAS."
4:41.2  [CONTAINER] stablecoin-card-B-s2 ON '5', + 5M KAS GOAL · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 280.72
4:43.0  SAY:  "A fundraiser closes January 1st, 2027, refunds if it misses."
4:44.2  [CONTAINER] stablecoin-card-B-s3 ON 'January', + FUNDRAISER CLOSES JAN 1 2027
4:47.0  [CONTAINER] stablecoin-card-B-s4 ON 'refunds', + REFUNDS IF IT MISSES
4:48.9  [CONTAINER] stablecoin-card-C-s1 IN (4.2 s → 4:53.1) state C, the roadmap strip, nothing lit → hand:xfade-scale (container-xfade, 0.35s)
4:48.9  SAY:  "And if it hits, the roadmap targets mainnet for that September."
4:51.3  [MUSIC] Bed CH4 3_37-7 the chorus's last bar, -16 dB under VO → 4:53.2
4:52.3  [CONTAINER] stablecoin-card-C-s2 ON 'September' (cue from the AUDIO, the JSON swallowed the word), SEPTEMBER 2027 MAINNET (TARGETED) lit
4:53.1  [TRANSITION] hand:kt-whip-cut onto BR-16 · [WHOOSH] swoosh-3 (kinetic-text/swoosh-3.wav, mood_class neutral, the calm-b-roll headline cut) play 0.20-2.65 file start 292.94
4:53.1  [VIDEO] BR-16-speaker-on-stage IN (3.8 s → 4:56.9) speaker at a lectern, calm
4:53.1  SAY:  "And the founder himself, Yonatan Sompolinsky, stood on a stage at Mid-Chain 2026 on October 26, and described where his research goes next."
4:53.2  [MUSIC] Bed CH4 3_37-7 OUTRO, subtle, -24 dB under VO, the fall reads -8 dB after the seat step → 5:01.1
4:53.2  [MUSIC] hard hit (MUSIC-PLAN 293.239): the arrangement's own fall · [IMPACT] layer: none (a fall into the calm set-up line, no hit fits)
4:53.9  [KT-HEADLINE] "THE FOUNDER, ON STAGE" pop 0.8 s after the cut, holds to 4:56.9 · [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 293.94
4:56.9  [RECEIPT] C33-youtube-midchain-page IN (5.2 s → 5:02.1) Mid-Chain talk watch page, push to the description date; the push excludes the right-rail thumbnails · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
5:01.1  [MUSIC] Bed CH4 0_23-4 quiet groove, subtle, -22 dB under VO, soft entry, breath 0.7 s before, ducked -14 dB under CLIP-1 automatically → 5:20.8
5:01.1  [STILL] CLIP-1 LEAD-IN: the clip's FIRST frame held as a still over C33 under 'research goes next.', from 'research' (301.18) to the splice, slow settle; the clip's frames are never a muted cover
5:02.1  [TRANSITION] cover→face cut-in F6 → lib:zoom-optics-in-out-3 (face-cut, 0.76s) (face pick), lands as the insert-out comes down (first face frame 302.133 sits inside the trough)
5:02.1  [FACE] F6 IN → 5:35.9  one hold, resume + plug
5:02.1  [CAPTION] ON → 5:35.9 as kt-caption-highlight, OFF under the band
5:02.2  [INSERT] CLIP-1 SPLICED CLIP, 10.8 s (assets/clip-inserts/CLIP-1-sompolinsky-if-this-then-that.mp4, YouTube UOOOwTs5woQ 22:26.3-22:37.1): the spine PAUSES after
        "and described where his research goes next." (bake_clip_insert.py snaps into the trough, bottom 302.165) and the clip plays FULL-FRAME with Yonatan Sompolinsky's OWN voice,
        caption burned 'Yonatan Sompolinsky, Kaspa founder · Mid-Chain 2026 research talk, October 26, 2026', bottom; the bed ducks -14 dB automatically ·
        [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert, hand:fade 0.5 s each side)
5:02.2  [STILL] CLIP-1 LEAD-OUT: the clip's LAST frame held under the first frames of the resume line, fading out to F6 (the resume is on the face, so no cover follows)
5:02.3  [KT-CAPTION] "THAT'S RESEARCH, NOT A SHIP FEATURE" (RESEARCH in the accent), hard cut, silent
5:02.3  SAY:  "That's research, not a ship feature."
5:05.0  [KT-CAPTION] "AND THAT'S THE FOUNDER OF THIS NETWORK", hard cut, silent
5:05.0  SAY:  "And that's the founder of this network, 13 years after GHOST, and he's still pushing the frontiers."
5:07.6  [KT-CAPTION] "13 YEARS AFTER GHOST" (13 YEARS in the accent), hard cut, silent
5:09.9  [KT-CAPTION] "AND HE'S STILL PUSHING THE FRONTIERS" (FRONTIERS in the accent), hard cut, silent
5:11.5  [PUNCH-IN] F6 hard ~15-20% step ON the desilencer join 311.567 (frame 9347) → holds to 5:35.9 (join 335.533 is inside the 0.5 s edge margin)
5:11.5  [LIGHTLEAK] F6 library light leak peaking ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) → lib:lightleaks-soft-3 (punch-leak, 1.44s) (punch-leak)
5:12.2  [KT-CAPTION] "AND BEFORE WE TAKE A LOOK AT THOSE NUMBERS", hard cut, silent
5:12.2  SAY:  "And before we take a look at those numbers, I have a very wonderful group of like-minded investors in my Discord."
5:14.2  [KT-CAPTION] "I HAVE A VERY WONDERFUL GROUP", hard cut, silent
5:16.4  [KT-CAPTION] "OF LIKE-MINDED INVESTORS IN MY DISCORD" (DISCORD in the accent), hard cut, silent
5:18.7  [KT-CAPTION] "AND WE HAVE TONS OF SOFTWARE", hard cut, silent
5:18.7  SAY:  "And we have tons of software, and our software and our reach is hooked into everything."
5:20.8  [MUSIC] Bed CH4 0_23-4 subtle -22 dB under VO → 5:36.5
5:20.8  [KT-CAPTION] "AND OUR SOFTWARE AND OUR REACH IS HOOKED INTO EVERYTHING", hard cut, silent
5:23.8  [KT-CAPTION] "LIKE WE JUST DID 114X ON PERPSPAD" (114X in the accent), hard cut, silent
5:23.8  SAY:  "Like we just did 114x on PerpsPad. We get in on all these plays early."
5:24.6  [RECEIPT] C26-cryptorich-showcase IN (4.3 s → 5:28.9) cryptorich.vip/showcase, 2026 Top Performing Assets, PERPSPAD 114x row highlighted, real pixels, spelled PerpsPad · treatment: push
5:24.6  [KT-PANEL] RIGHT, paper texture, carries C26 ON '114x', Mike's ruling: side panel over the FACE hold, his face stays on screen and shifts left; hard out at 5:28.9 ·
        [WHOOSH] swoosh-1 (kinetic-text/swoosh-1.mp3, mood_class neutral) file start 324.43
5:27.1  [KT-CAPTION] "WE GET IN ON ALL THESE PLAYS EARLY", hard cut, silent
5:28.9  [KT-CAPTION] "PLUS, WE HAVE TONS OF INFORMATION", hard cut, silent
5:28.9  SAY:  "Plus, we have tons of information and tons of software, swing trading software, you name it."
5:30.7  [KT-CAPTION] "AND TONS OF SOFTWARE", hard cut, silent
5:31.9  [KT-CAPTION] "SWING TRADING SOFTWARE, YOU NAME IT", hard cut, silent
5:34.4  [KT-CAPTION] "CLICK THE LINK", hard cut, silent; replaced by the band
5:34.4  SAY:  "Click the link in the description below."
5:34.9  [KT-BAND] "LINK IN THE DESCRIPTION" moves ON 'link', carries across the F6 cut-out onto BR-17, slides down 5:36.4 to 5:37.3, clear on the chapter whip; no impact on the plug ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 334.56
5:35.0  [ACCENT] knock-pop ON the band text, 0.13 s after the band (kinetic-text/knock-pop.wav, mood_class neutral) file start 335.03
5:35.9  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s)
5:35.9  [VIDEO] BR-17-trader-monitors-dark IN (3.9 s → 5:39.9) trader at two monitors, calm, slow push
5:36.1  SAY:  "But let's get on with this."
5:36.5  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 5:52.3
```

## CH5 - WHERE IT STANDS (5:37.3-7:35.7, one-track carve, card OFF; devices thin out hard)
```
5:37.3  [TRANSITION] hand:kt-whip-cut chapter whip into CH5: BR-17 itself re-lands on the whip-zoom, same file, same row (no picture cut exists here) · [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral) play 0.09-2.28 file start 337.10
5:37.3  SAY:  "Now look at these numbers as they are."
5:39.8  [RECEIPT] C13-tradingview-kasusd IN (7.4 s → 5:47.3) real KAS/USD all-time chart, real pixels, never restyled, slow push over the line; no pop · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
5:39.8  SAY:  "KAS trades around 3 cents, a market cap of around $860 million, around 85% below its all-time high of July 2024, and around $20 million a day in spot volume."
5:47.2  [RECEIPT] C34-coingecko-kaspa IN (5.4 s → 5:52.7) CoinGecko Kaspa header panel, push to the 24 h volume figure · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
5:52.3  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 6:08.0
5:52.6  [TRANSITION] hand:kt-push-slide C2 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 352.58
5:52.6  [CHART] C2-B-start IN (6.3 s → 5:59.0) neutral ring, silent chart
5:52.6  SAY:  "Around 96.8% of all KAS is already mined, around 912 million left to go."
5:52.9  [CHART] C2-B-mid ring fills clockwise, the figure counts, lands on '%' (354.10)
5:56.2  [CHART] C2-B remainder turns ink, leader draws left ON 'around'
5:56.6  [CHART] C2-B-payoff 912M KAS LEFT lands ON '912'; KAS, never dollars
5:58.9  [CHART] C2-C-start IN (5.6 s → 6:04.5) axis and 2.06 plateau, KAS / BLOCK, silent → hand:xfade-scale (container-xfade, 0.35s)
5:58.9  SAY:  "The November cut took the block reward from 2.06 to 1.94 KAS."
5:59.0  [CHART] C2-C marker NOVEMBER 4, 2026 CUT lands ON 'November cut'
6:01.3  [CHART] C2-C-mid 2.06 pulses once ON '2.06'
6:02.6  [CHART] C2-C-payoff line drops, 1.94 lands ON '1.94' (362.92)
6:04.5  [CHART] C2-D-start IN (8.0 s → 6:12.5) empty track and label, silent → hand:xfade-scale (container-xfade, 0.35s)
6:04.5  SAY:  "That's around 1.68 million KAS a day of new supply, and at these prices, well under 1% of what trades in a day."
6:05.3  [CHART] C2-D label counts to 1.68M, sliver grows to its true 4.3 px
6:08.0  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 6:23.7
6:08.5  [CHART] C2-D-mid $20M bar grows across the frame and dwarfs it ON 'at these prices'
6:10.0  [CHART] C2-D-payoff WELL UNDER 1% chip lands ON 'well'
6:12.5  [RECEIPT] C35-2miners-kas-hashrate IN (3.3 s → 6:15.8) live hash-rate readout, push to the PH/s figure · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
6:12.5  SAY:  "Hash rate around 368 petahash."
6:15.7  [TRANSITION] hand:kt-push-slide C3 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 375.66
6:15.7  [CHART] C3-start IN (11.0 s → 6:26.7) empty axes, silent chart; never the 1,592 PH/s spike
6:15.7  SAY:  "It fell around 70% from May of 2025 to July of 2026, and then it rose 3 months in a row through 3 reward cuts and up 14%."
6:16.0  [CHART] C3 grey line draws May 2025 to July 2026; FELL AROUND 70% fades up ON '70' (376.62)
6:21.7  [CHART] C3-mid accent line draws July to October, zoom card scales in ON 'then it rose'
6:23.7  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 6:39.5
6:24.5  [CHART] C3 AUG CUT, SEP CUT, OCT CUT ticks land ON 'reward cuts'
6:25.6  [CHART] C3-payoff AROUND +14% lands ON 'up', sublabel JULY AVG TO OCTOBER AVG
6:26.7  [TRANSITION] hand:kt-push-slide C4 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 386.64
6:26.7  [CHART] C4-start IN (5.4 s → 6:32.1) empty axes, silent chart
6:26.7  SAY:  "User transactions flat, around 70,000 to 80,000 a day since July."
6:27.1  [CHART] C4-mid line draws across the whole span
6:28.6  [CHART] C4 band fades up, 70K TO 80K A DAY lands ON 'around'
6:31.2  [CHART] C4-payoff SPIKE DAYS note fades up ON 'since'; the Y axis stays at 280K
6:32.1  [TRANSITION] hand:kt-push-slide C17 pushes in from the left · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 392.04
6:32.1  [CHART] C17-start IN (8.4 s → 6:40.5) empty bar tracks, silent chart
6:32.1  SAY:  "And of those 460 tokens, the typical one has two holders, 9 of them have more than 100."
6:32.7  [CHART] C17 459 dots pop in, a fast column sweep, ON '460 tokens'
6:34.3  [CHART] C17-mid 276 dots darken, 276 AT 2 OR FEWER, MEDIAN TOKEN bar grows, the 2 lands ON 'typical'
6:36.2  [CHART] C17 last 9 dots light in the accent, 9 ABOVE 100 lands ON '9'
6:37.9  [CHART] C17-payoff NACHO bar grows, counts to 355 ON 'The new Nacho'; TOP TOKEN grey to 437 after '355'
6:37.9  SAY:  "The new Nacho, 355, and total value locked on the 2 L2s, around $770,000, so under a million."
6:39.5  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 6:55.2
6:40.4  [TRANSITION] hand:kt-push-slide C12 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 400.40
6:40.4  [RECEIPT] C12-a-defillama-igra IN (3.0 s → 6:43.4) DefiLlama Igra headline crop ($555,935), push; no chart, no tooltip · treatment: push
6:43.4  [RECEIPT] C12-b-defillama-kasplex IN (3.7 s → 6:47.1) DefiLlama Kasplex headline crop ($253,276), push; Mike's option A: the proof is UNDER A MILLION · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
6:47.0  [VIDEO] BR-18-dawn-street IN (2.7 s → 6:49.8) empty city street at dawn (literal 'early'), slow move → hand:fade (broll-fade, 0.50s)
6:47.0  SAY:  "Yeah, so are we late or are we early?"
6:49.7  [TRANSITION] hand:kt-push-slide C22 pushes in from the top · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 409.70
6:49.8  [RECEIPT] C22-tradingview-solusdt-hovers IN (26.3 s → 7:16.1) real SOLUSDT monthly recording, log scale, from clip 1.0 s (skips the toolbar in frame 0; the hovers still fit), push framed on the legend, which carries the true figures; the crosshair tag stays out of the push · treatment: push
6:49.8  SAY:  "Look at Solana, July of 2021, $1.51. November of 2021, $259.90, around 172x in 10 months."
6:52.6  [RECEIPT] C22 state A: legend O1.51 ON '$1' ($1.51 with NO month on screen, Mike; no date chip in the capture)
6:55.2  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 7:10.9
6:56.3  [RECEIPT] C22 state A: legend H259.90 ON '$259'
7:02.0  SAY:  "Then it fell around 97% to $8 by December of 2022, and everybody wrote it off."
7:04.5  [RECEIPT] C22 state B: legend L8.00 ON '$8'; silent
7:09.1  SAY:  "And from that low, around 37x to around $295 in January of 2025."
7:10.9  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 7:26.7
7:12.6  [RECEIPT] C22 state C: legend H295.83 ON '$295'; silent
7:16.0  [RECEIPT] C25-coingecko-solana IN (4.2 s → 7:20.3) CoinGecko Solana header, push to the market cap in the left panel only · treatment: push → hand:xfade-scale (container-xfade, 0.35s)
7:16.0  SAY:  "Solana sits around a $55 billion market cap as I'm recording this."
7:20.2  [CONTAINER] parallel-not-prediction-A IN (4.1 s → 7:24.3) A PARALLEL, NOT A PREDICTION; no Kaspa figure, no graphic on the ad-lib → hand:xfade-scale (container-xfade, 0.35s)
7:20.2  SAY:  "I'm not saying that Kaspa does that, at least not anytime soon anyway."
7:24.3  [CONTAINER] parallel-not-prediction-B (3.6 s → 7:27.9) WHAT A WRITTEN-OFF NETWORK CAN DO lights, CAN in the accent
7:24.3  SAY:  "I'm just saying what a written-off network can do."
7:26.7  [MUSIC] Bed CH5 0_23-4 subtle -22 dB under VO → 7:34.6
7:27.9  [TRANSITION] cover→face cut-in F7 → lib:zoom-optics-in-out-2 (face-cut, 0.80s) (face pick)
7:27.9  [FACE] F7 IN → 7:35.7
7:27.9  [CAPTION] ON → 7:35.7 as kt-caption-highlight, from 7:32.4; the two panels carry their own words before it
7:28.0  [KT-PANEL] RIGHT "THE TOOLS CAME FIRST" (TOOLS in the accent), Mike's draft note: his left is the screen right; the picture shifts left; clears as the LEFT panel moves · [WHOOSH] swoosh-1 (kinetic-text/swoosh-1.mp3, mood_class neutral) file start 447.83
7:28.0  SAY:  "The tools came first, the crowd has not arrived yet."
7:29.8  [KT-PANEL] LEFT "THE CROWD HAS NOT ARRIVED YET" (YET in the accent), Mike's draft note; the picture shifts right; hard out at 7:32.4 · [WHOOSH] swoosh-2 (kinetic-text/swoosh-2.wav, mood_class neutral) file start 449.79
7:32.4  [KT-CAPTION] "AND THAT'S EXACTLY THE GAP WHERE I WANT TO BE STANDING" (GAP in the accent), hard cut, silent
7:32.4  SAY:  "And that's exactly the gap where I want to be standing."
7:33.9  [KT-SPARK] one burst on GAP · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 453.92
7:34.6  [MUSIC] Bed CH5 0_23-4 the cut's RESOLVE, its last stroke on 'standing', -20 dB under VO → 7:35.7
7:35.1  [PUNCH-IN] F7 hard ~15-20% step ON the desilencer join 455.100 (frame 13653) → holds to 7:35.7
7:35.1  [LIGHTLEAK] F7 library light leak peaking ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) → lib:lightleaks-soft-short-8 (punch-leak, 0.40s) (punch-leak)
7:35.5  [MUSIC] hard hit (MUSIC-PLAN 455.562): the RESOLVE's last stroke as 'standing' ends; the file stops 80 ms into the silent wall · [IMPACT] layer: none (the cut's own ending, the next hit is the wall's)
7:35.6  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s)
7:35.6  [IMAGE] IMG-5-summit-flag IN (3.5 s → 7:39.2) the slot plays assets/img-motion/IMG-5-summit-flag-motion.mp4 muted, flag rippling, clip 0 on the wall's cut-out, cut at the slot end, no Ken Burns (comp-build 3c); the still is the fallback; the wall covers it through the pause
```

## CH6 - THE CLOSE (7:35.7-8:48.4, one-track carve, card ON "TEXT WALL")
```
7:35.7  [CARD] CH6 title card "TEXT WALL", the only card, 3.5 s pause baked at the trough after 'standing.' (bake with --card-pause 3.5; lint-pause-silence gates it), cuts in SILENT · [IMPACT] card-impact-layered (Impacts/card-impact-layered.wav, mood_class epic, measured peak 0.03 s, -40 dB tail ends 1.10 s, lands on the wall's CUT-OUT with the drop, never on the silent cut-in) file start 455.76
7:35.7  [TRANSITION] card presentation → rmn:cube WAIVED (Mike's draft note: a hard cut in, as the 2023 original)
7:35.7  [KT-WALL] assets/overlays/text-wall-motion.mp4, Mike's After Effects template Scene_23 rendered with TOO LATE?, replacing the two-PNG cross-fade; full-frame black wall in receding rows (all filled +0.07 s, all outlined +1.57 s, filled +3.07 s), slow tilt about the centre; captions OFF
7:35.7  [KT-POP] punch "EARLY." red, text-wall-early-alpha at wall +1.9 s · [ACCENT] cash-register (kinetic-text/cash-register.wav, mood_class neutral, file start ON the pop) play 0-1.30 in-pause +1.9 s at 455.74
7:35.7  [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral, 0.1 s before the cut-out) in-pause +3.4 s at 455.74
7:35.7  [MUSIC] Bed CH6 3_37-7 DROP back to the peak, part A -19 dB under VO, the full chorus -17 from 469.51 → 8:17.1
7:35.7  [MUSIC] hard hit (MUSIC-PLAN 455.74): master bar 44 enters HARD on the wall's cut-out, on 'Here's'; the card row carries the impact
7:35.7  SAY:  "Here's where I stand, sound money, mined by anyone, owned by no one, and a base layer that just learned how to run app."
7:38.5  [KT-HEADLINE] "MINED BY ANYONE / OWNED BY NO ONE" ON 'mined', clears on the card at 7:39.2 · [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 457.90
7:39.1  [CONTAINER] where-i-stand-s1 IN (5.5 s → 7:44.7) HERE'S WHERE I STAND, SOUND MONEY, MINED BY ANYONE · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 459.18 → hand:xfade-scale (container-xfade, 0.35s)
7:40.1  [CONTAINER] where-i-stand-s2 ON 'owned', + OWNED BY NO ONE · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 460.14
7:41.9  [CONTAINER] where-i-stand-s3 ON 'a base layer', + A BASE LAYER THAT JUST LEARNED TO RUN APPS (on screen RUN APPS) · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 461.96
7:44.7  [TRANSITION] hand:kt-whip-cut onto BR-19 · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 464.50
7:44.7  [VIDEO] BR-19-mining-warehouse-rows IN (3.8 s → 7:48.5) Bitcoin mining warehouse, racks, slow move; a different site from BR-2 and BR-3
7:44.7  SAY:  "And my long-term theory is that I think Ethereum eventually takes the number one spot from Bitcoin."
7:48.5  [KT-STATEMENT] my-theory card (4 lines, MY THEORY and PROOF OF WORK HOME in the accent) IN (7.9 s → 7:56.4), MY THEORY up the whole hold, no named Bitcoin figures; hold silent · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) play 0.14-0.89 file start 468.30
7:50.9  SAY:  "And when it does, a lot of Bitcoin maxis are going to be looking for a proof of work home."
7:56.3  [TRANSITION] hand:kt-push-slide onto IMG-6, silent per the screenplay
7:56.3  [IMAGE] IMG-6-coin-waterfall IN (3.8 s → 8:00.2) the slot plays assets/img-motion/IMG-6-coin-waterfall-motion.mp4 muted, water falling, from clip 0, cut at the slot end, no Ken Burns (comp-build 3c); the still is the fallback
7:56.3  SAY:  "I think they find Kaspa, not all at once, sort of like a cascade over time. Some move over, and a year later, some more move over, and so on."
8:00.2  [TRANSITION] IMG-6 to cascade-base → lib:melt-rgb-3 (MELT-transform, 0.76s), SFX ducked
8:00.2  [DIAGRAM] cascade-base IN (6.8 s → 8:07.0) both pools, three arrows quiet, MY THEORY tag baked; nothing named
8:01.0  [KT-POP] "A CASCADE" ON 'cascade', holds to 8:02.3 · [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 480.38
8:02.3  [DIAGRAM] cascade-wave1 ON 'Some': arrow 1 lights, Kaspa pool rises
8:03.7  [DIAGRAM] cascade-wave2 ON 'a year later': arrow 2 lights
8:05.8  [DIAGRAM] cascade-wave3 ON 'and so on': arrow 3 lights
8:06.9  SAY:  "And some of them could already be stacking it quietly. You never know."
8:07.0  [VIDEO] BR-20-hand-stacking-coins IN (4.0 s → 8:11.0) hands stacking coins, low light, macro → hand:fade (broll-fade, 0.50s)
8:10.9  [TRANSITION] cover→face cut-in F8 → lib:zoom-optics-in (face-cut, 0.76s) (face pick)
8:10.9  [FACE] F8 IN → 8:20.0
8:10.9  [CAPTION] ON → 8:20.0 as kt-caption-highlight
8:11.2  [KT-CAPTION] "KASPA DIDN'T NEED A BULL MARKET TO BECOME REAL" (REAL in the accent), hard cut, silent
8:11.2  SAY:  "Kaspa didn't need a bull market to become real. It became real in the bear."
8:14.0  [KT-CAPTION] "IT BECAME REAL IN THE BEAR" (BEAR in the accent, lit from the AUDIO at 495.64, the JSON says 'last year'), hard cut, silent
8:15.4  [PUNCH-IN] F8 hard ~15-20% step IN ON the desilencer join 495.467 (frame 14864)
8:15.4  [LIGHTLEAK] F8 library light leak peaking ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) → lib:lightleaks-6 (punch-leak, 1.12s) (punch-leak)
8:16.4  [KT-CAPTION] "AND WHATEVER COMES NEXT", hard cut, silent
8:16.4  SAY:  "And whatever comes next, this network is waiting for it."
8:17.0  [MUSIC] Bed CH6 0_31-1 full chorus, aggressive, -17 dB under VO, HARD STOP inside 'subscribe' → 8:47.8
8:17.0  [MUSIC] hard hit (MUSIC-PLAN 497.051): chorus-to-chorus bar-line splice under 'next,' · [IMPACT] layer: none (same chorus, no level change, a hit would expose the splice)
8:18.4  [KT-CAPTION] "THIS NETWORK IS WAITING FOR IT" (WAITING in the accent; captions never say READY), hard cut, silent
8:19.2  [KT-SPARK] burst 1 on WAITING · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 499.28
8:19.3  [PUNCH-IN] F8 hard step BACK to the base frame ON the desilencer join 499.367 (frame 14981)
8:19.3  [LIGHTLEAK] F8 library light leak peaking ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) → lib:lightleaks-soft-short-8 (punch-leak, 0.40s) (punch-leak)
8:19.6  [KT-SPARK] burst 2, 0.4 s later · [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) play 0-1.30 file start 499.68
8:20.0  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.76s)
8:20.0  [VIDEO] BR-21-audience-hands-raised IN (3.5 s → 8:23.6) packed meetup, hands up, calm cut
8:20.2  SAY:  "The Kaspa community itself is as dedicated as the XRP army. And I mean that in the highest compliment in this space. Hardcore, patient, and still here."
8:20.8  [KT-STACK] headline "THE KASPA COMMUNITY" ON 'community' · [ACCENT] wooden-rattle-whoosh (kinetic-text/wooden-rattle-whoosh.wav, mood_class neutral) file start 500.82
8:23.5  [CONTAINER] community-stack-s1 IN (7.5 s → 8:31.0) THE KASPA COMMUNITY, AS DEDICATED AS THE XRP ARMY, THE HIGHEST COMPLIMENT → hand:xfade-scale (container-xfade, 0.35s)
8:28.2  [CONTAINER] community-stack-s2 ON 'Hardcore', + HARDCORE · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 508.22
8:29.1  [CONTAINER] community-stack-s3 ON 'patient', + PATIENT · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 509.10
8:30.2  [CONTAINER] community-stack-s4 ON 'still', + STILL HERE · [ACCENT] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) play 0-0.93 file start 510.26
8:31.0  [TRANSITION] cover→face cut-in F9 → lib:zoom-optics-in-impact (face-cut, 0.84s) (face pick)
8:31.0  [FACE] F9 IN → 8:48.4, to the last frame
8:31.0  [CAPTION] ON → 8:45.0 as kt-caption-highlight, OFF under the subscribe bar
8:31.1  [KT-CAPTION] "SO IF YOU WANT TO BE AROUND PEOPLE", hard cut, silent
8:31.1  SAY:  "So if you want to be around people who stack with real conviction, click the link in the description below."
8:32.9  [KT-CAPTION] "WHO STACK WITH REAL CONVICTION" (CONVICTION in the accent), hard cut, silent
8:34.7  [KT-CAPTION] "CLICK THE LINK IN THE DESCRIPTION BELOW" (LINK in the accent), hard cut, silent
8:35.5  [KT-ICON] image_sticker DISCORD LOGO hard cut beside the head ON 'description', no sound of its own → 8:36.8
8:36.8  [KT-CAPTION] "AND NOT ONLY THAT", hard cut, silent
8:36.8  SAY:  "And not only that, drop a comment in the comment section, tell me what you think about Kaspa, give me your price targets for next year, and so on."
8:37.5  [KT-CAPTION] two_colour_pop "DROP A COMMENT / IN THE COMMENT SECTION" ON 'drop' (his words, not COMMENT BELOW) · [ACCENT] typing (kinetic-text/typing.mp3, mood_class neutral, file start ON the pop, 1.13 s used) play 8.30-9.43 file start 517.58
8:39.6  [KT-CAPTION] "TELL ME WHAT YOU THINK ABOUT KASPA", hard cut, silent
8:41.2  [KT-CAPTION] "GIVE ME YOUR PRICE TARGETS FOR NEXT YEAR", hard cut, silent; no target and no date graphic on screen
8:43.1  [KT-CAPTION] "AND SO ON", hard cut, silent
8:43.7  [KT-CAPTION] "MAKE SURE YOU CLICK THAT LIKE BUTTON" (LIKE in the accent), hard cut, silent
8:43.7  SAY:  "Make sure you click that like button."
8:45.0  [KT-CTA] bar: kt-subscribe-close variant bar rises onto the chest ON 'like', the SUBSCRIBE click lands on 'subscribe' (527.32), drops away by 8:47.9; the bar replaces the caption for its hold ·
        [ACCENT] subscribe-bar-clicks (kinetic-text/subscribe-bar-clicks.wav, mood_class neutral, like click 0.64 s, SUBSCRIBE click 2.32 s of the file, the bell click trimmed off) play 0-2.90 file start 525.00
8:45.7  SAY:  "My God, dude."
8:47.1  SAY:  "And subscribe!"
8:47.4  [PUNCH-IN] F9 hard ~15-20% step ON the defumble join 527.467 (frame 15824) → holds to the last frame; 527.733 is skipped (under the 1.5 s gap)
8:47.4  [LIGHTLEAK] F9 library light leak peaking ON the same join (lib:lightleaks-*, the video's set of 3-4; overlays.md) → lib:lightleaks-soft-7 (punch-leak, 1.44s) (punch-leak)
8:47.8  [MUSIC] hard hit (MUSIC-PLAN 527.832): the 0_31-1 HARD STOP inside 'subscribe!', Mike's ruling; the spine's last 0.54 s run silent to the last frame · [IMPACT] layer: none (the stop IS the hit)
8:48.4  [END] last frame on Mike's face, no cut-out, no sign-off, no end card, no held still
```

## Orphan reconciliation (every file in assets/, PLACED by the rows above or marked here)
- **assets/vid (21, PLACED):** BR-1 to BR-21, each once, each 4.0 s or less.
- **assets/img (6, PLACED):** IMG-1 to IMG-4 as stills; IMG-5-summit-flag and IMG-6-coin-waterfall are the fallback stills of their motion slots (BENCH as stills; the motion clips play).
- **assets/img-motion (2, PLACED):** IMG-5-summit-flag-motion 7:35.6 · IMG-6-coin-waterfall-motion 7:56.3.
- **assets/receipts (30 files, PLACED):** C21, C27, C19, C16, C6, C8, C28, C7, C9, C10, C29, C20 (hero, about, audits, staking), C23, C24, C30, C14, C32, C15, C33, C26, C13, C34, C35, C12-a, C12-b, C22, C25. C11 was never captured: not placed (Mike, it names the project).
- **assets/clip-inserts (1, PLACED):** CLIP-1-sompolinsky-if-this-then-that 5:02.2 (lead-in 5:01.1, lead-out 5:02.2). CLIP-2 HELD and CLIP-3 REJECTED were never captured.
- **assets/diagrams, PLACED:** C1-A-chain, C1-A-fork, C1-A, C1-B, C1-B-lit, C1-C-start, C1-C-mid, C1-C · C5-overview, C5-toccata, C5-intro, C5-zk, C5-jul2 · indexer-vs-l1-l1, indexer-vs-l1-flaw · consensus-validates-rules, -validators, -indexer-out · kasplex-based-rollup-base, -gas · D1-A, D1-A-lit, D1-A-norollup · cascade-base, cascade-wave1, cascade-wave2, cascade-wave3. D1-B BENCH (the plan's bench swap for C32, C32 aired).
- **assets/charts (Type 1, the stills are the design target for the code animation), PLACED:** C2-A-start, C2-A-mid, C2-A-payoff · C2-B-start, C2-B-mid, C2-B-payoff · C2-C-start, C2-C-mid, C2-C-payoff · C2-D-start, C2-D-mid, C2-D-payoff · C3-start, C3-mid, C3-payoff · C4-start, C4-mid, C4-payoff · C17-start, C17-mid, C17-payoff.
- **assets/card-slides, PLACED:** research-stack-s1 to s3 · silverscript-60-lines-s1 to s3 · bps-ladder-s1 to s3 · stablecoin-card-A-s1 to s4, stablecoin-card-B-s1 to s4, stablecoin-card-C-s1, s2 · parallel-not-prediction-A, -B · where-i-stand-s1 to s3 · my-theory · community-stack-s1 to s4 · text-wall-filled, text-wall-outlined, text-wall-early-alpha. text-wall BENCH (the composite still, fallback only).
- **assets/overlays (1, PLACED):** confetti-burst-alpha 1:04.2. **assets/music-sting:** Hola_Hola_A_La_Mariachi full track BENCH (source of the sting; its licence code goes in the YouTube description).
- **assets/face-swap, PLACED:** F1, F2, F3 -higgsfield-bg-swap.mp4. BENCH (generation inputs, never airing): F1, F2, F3 -raw-for-higgsfield.mp4, backdrop-reference-rooftop, -v2, -v3, suit-reference-no-face, superhero-suit-reference-2mVAx0edwrY.
</content>
- **Build inputs and sidecars, never airing (BENCH):** the *.html sources in assets/charts and assets/diagrams, assets/slide-sources/*, assets/face-swap/*.json and swap-prompt.txt, assets/face-reframe.json, assets/VISUAL-QA.json.
