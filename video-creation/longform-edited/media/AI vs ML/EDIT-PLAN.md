# AI vs ML - EDIT-PLAN (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED off the graph's seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py: AS-RECORDED.md + `spine/ALL.e.enhanced.medium-words.json`
> + COVER-PLAN.json + MUSIC-PLAN.json) and refined against PROJECT-LOG.md, SCREENPLAY.md (every `[SHOW]` device), the built assets
> (`assets/diagrams/C1-spec.md`, `assets/charts/C3-spec.md`, `assets/slide-sources/_state-cues.md`, `assets/VISUAL-QA.json`), the effects
> library (`video-creation/assets/effects/library.json`, theme `kinetic-text-2023`) and the SFX catalogs. Format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` section 1;
> the comp is built TO this log (section 0 ORDER).
> Watch file: `spine/ALL.e.enhanced.mp4` (145.20 s / 2:25.2, 30 fps). Timecodes = FINAL-spine seconds, pre-card-pause. This video has NO
> card pause, NO braam pause and NO clip insert, so no `sh()` shift applies: the final timeline = the spine + the 2.0 s END HOLD on the
> end screen (runs to 147.00 s / 2:27.0). Exact seconds ride in parentheses where the M:SS.s display rounds.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (authored next by the transition-strategist): this log names the device
> the approved SCREENPLAY gives each cut (kinetic-text-2023: kt-snap-zoom, kt-push-slide, kt-whip-cut, kt-spin-cut, kt-shake-cut) as the
> proposal, and the strategist confirms or swaps it against house rule #5.
> ZERO ORPHANS: every renderable file in `assets/` (vid, img, receipts, charts, diagrams, card-slides, kt-renders) is PLACED below with a
> timecode or marked REJECTED in the reconciliation at the foot; `title-slides/`, `clip-inserts/`, `transitions/`, `whiteboard/` are empty.
> SFX placement rule (one rule for every row): each sound sits where its device row in the effects library puts it (the 2023 offsets);
> where a file's audible onset is late (measured with ffmpeg, -30 dB onset: ting 0.78 s, punch-sound-effect 0.90 s, pop-1 0.40 s,
> cash-register 0.16 s, cash-register-2 bell 0.34 s, cartoon-accent 0.48 s, mouse-click 1.04 s) the `file start` is moved back by that
> lead so the hit lands on the event frame. `play A-B` trims, `MIX GAIN` is the library's own -10 dB where the row states it. Impacts
> were picked by MEASURED tail (ffmpeg, 10 ms RMS: Impact_Hit_01-2-short peaks at 0.13 s and is gone by 0.55 s, so 0.42 s of body).
> Captions: the running `kt-caption-highlight` line IS the caption on the face beats (house caption track OFF for its spans), never
> over a cover; OFF under a keyword pop, the boxed-words card and the versus stack (overlays.md section 2).
> Not placed (never acquired, named only as benches in COVER-PLAN / SCREENPLAY): C4, C10, C11, C14 receipts, CLIP-2 (Mike: out).

## CH1 - THE TWO ROLES AND THE MONEY HOOK (0:00.0-0:14.1, Bed A `concrete-mazes`, card OFF)
```
0:00.0  [MUSIC] Bed row 1: concrete-mazes (PALA, Soundstripe 13616, license 5IQX9DCHAVKOGQXX) master 3:02 instrumental,
        source_in 16.635 = BUILD bars 9-11, seat remotion_gain_db -26.0 (21 dB under the raised VO), no fade-in → 0:05.9 ·
        HARD HIT 1: the build's stroke (master 16.64) lands ON frame 0, groove already running ·
        [IMPACT] layer: none (the track's own stroke IS the frame-0 hit; the open's swoosh-4 and the AI ENGINEER label punch land
        with it; a third hit would sit on the first word "AI")
0:00.0  [FACE] F1 opens ON face → 0:02.6 (0.000-2.567) "AI engineer versus ML engineer." · slow ~5 percent push over the line
        (signature open) · no interior join (jumpcuts-final.json): no punch, no leak
0:00.0  [TRANSITION] the signature open's whip-in = kt-grid-zoom-in (the first shot grows out of the 3x3 mirror grid, 33.4 → 100 → hand:kt-grid-zoom-in (face-cut, 0.48s; TRANSITION-PLAN 0.000)
        percent + skew 10 → 0 over 0.483 s) → hand:kt-grid-zoom-in (face-cut, 0.48s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 0.00 play 0.07-1.20
0:00.0  [CAPTION] OFF over F1: the two role labels ARE the line's words (overlays.md section 2: captions OFF under a keyword pop)
0:00.0  SAY:  "AI engineer versus ML engineer."
0:00.5  [KT-POP] signature-open label A 'AI ENGINEER' (yellow), lower-left, kt-keyword-pop (110 percent + jiggle) the frame the grid
        lands (0.483), inside "AI engineer" (0.00-1.06); holds to the F1 cut 2.567 ·
        [ACCENT] punch-1-2023 (kinetic-text/punch-1.mp3, mood_class neutral) file start 0.34
0:01.6  [KT-POP] signature-open label B 'ML ENGINEER' (green), lower-right, ON "ML" (1.60); holds to 2.567 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 1.60
0:02.6  [TRANSITION] face→cover F1 out (2.567): kt-whip-cut (the signature open's whip-out) → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral) file start 2.57
0:02.6  [VIDEO] BR-1 two engineers side by side IN (2.567 → 5.25, 2.68 s, first 2.68 s of the 4.70 s clip), lands on the whip
0:02.9  SAY:  "They sound like the same job, they are not."
0:05.2  [TRANSITION] BR-1 → IMG-1 (5.25, in the 5.20-5.30 gap): the kt-headline-over-broll whip-zoom landing (scale 200 → 100 + → hand:kt-whip-cut (glitch-still, 0.37s; TRANSITION-PLAN 5.250: the headline landing IS the whip, no library glitch)
        curvature, 0.37 s), or the AI-still ingress → hand:kt-whip-cut (glitch-still, 0.37s) ·
        [WHOOSH] swoosh-3 (kinetic-text/swoosh-3.wav, mood_class neutral) file start 5.25
0:05.2  [IMAGE] IMG-1 cash stacks IN (5.25 → 8.267, 3.02 s still), slow push + kt-camera-wobble; unlabelled stacks (W1: no role, no
        direction before 112.02)
0:05.3  SAY:  "At the top, the pay gap between them is huge."
0:05.9  [MUSIC] Bed row 2 (5.865): RISE bars 12-15 (source_in 22.5) then CHORUS 1 bars 16-31 from 13.365, seat -31.0 (19 under),
        sample-continuous, the seat ramps 0.5 s at 5.865 → 0:43.4
0:07.7  [KT-HEADLINE] 'AT THE TOP: A $340K GAP' over IMG-1 (top clean band), kt-keyword-pop motion, ON "huge" (7.68), held to 8.267;
        the framing line under it, same asset, small caps: TOP 10% VS TYPICAL · LEVELS.FYI · US · TOTAL COMP · 2026 (GATE plan
        ruling; W1 + W2 held: 340K never 350K, role-free framing) `[VERIFY]` recompute 339.5K at render ·
        [ACCENT] cash-register (kinetic-text/cash-register.wav, mood_class neutral) file start 7.51
0:08.3  [TRANSITION] cover→face cut-in F2 (8.267): kt-snap-zoom (screenplay) → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 8.23 play 0-0.5 MIX GAIN -10 dB
0:08.3  [FACE] F2 IN → 0:12.4 (8.267-12.367); its one join (12.333) sits on the window edge: no punch, no leak
0:08.3  [CAPTION] ON → 0:12.4 kt-caption-highlight (F2; it IS the caption, house caption track OFF)
0:08.4  [KT-CAPTION] 'ONE OF THESE ROLES' ON "One" (8.38)
0:08.4  SAY:  "One of these roles gets the big checks,"
0:09.3  [KT-CAPTION] 'GETS THE BIG CHECKS', BIG CHECKS yellow, ON "gets" (9.26)
0:10.7  [KT-CAPTION] 'THE OTHER ONE' ON "the" (10.68)
0:10.7  SAY:  "the other one gets the door open."
0:11.3  [KT-CAPTION] 'GETS THE DOOR OPEN', DOOR OPEN yellow (the take's order, never OPEN DOOR) ON "gets" (11.30)
0:11.7  [KT-SPARK] kt-keyword-sparkle burst on DOOR's last letter ON "door" (11.74) ·
        [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) file start 11.20 (onset 11.98 on "open", as the burst fades, inside F2)
0:12.4  [TRANSITION] face→cover F2 out (12.367): kt-push-slide, the card pushes in → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 12.27
0:12.4  [CONTAINER] roles-split IN (12.367 → 13.97): AI ENGINEER (yellow) VS ML ENGINEER (green) on turquoise suede, full frame,
        kt-camera-wobble; sets the role colours for every later graphic
0:12.4  SAY:  "So let's break it all down."
0:13.4  [MUSIC] HARD HIT 2 (13.365): chorus 1 drop on "all down", the rise's snare roll under the open loop ·
        [IMPACT] layer: none (measured: the voice runs 12.42-13.88, so the drop lands inside "all down", the line's last words; the
        track's own drop is the hit and no SFX goes over the end of a line)
```

## CH2 - WHAT THEY ACTUALLY DO (0:14.1-1:04.4, Bed A carved, card OFF)
```
0:14.0  [VIDEO] BR-2 app UI on laptop IN (13.97 → 17.33, 3.36 s), framed LEFT (the picture shifts into the free 55 percent) ·
        [TRANSITION] roles-split → BR-2 kt-push-slide, silent (the panel's swoosh-1 carries the move) → hand:kt-push-slide (broll-fade, 0.10s)
0:14.1  [KT-PANEL] RIGHT dark-teal suede panel (862 px, 0.50 s ease-out slide), 'AI ENGINEER' (yellow) over 'SHIPS PRODUCTS' (white);
        text rises 0.23 s after the panel, hovers (±18 / ±13 px, ±0.5 degree rock); cut with BR-2 at 17.33 ·
        [WHOOSH] swoosh-1 (kinetic-text/swoosh-1.mp3, mood_class neutral) file start 13.89
0:14.1  SAY:  "The AI engineer is commonly associated"
0:16.2  SAY:  "with shipping products."
0:16.5  [KT-ICON] rocket icon pop ON "shipping" (16.46), slides in from the LEFT edge over the b-roll (0.50 s, motion-blurred), held
        to 17.33 · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 16.44 play 0.467-0.70
0:17.3  [TRANSITION] BR-2 → ai-identity (17.33): kt-push-slide, card pushing in → hand:kt-push-slide (container-xfade, 0.10s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 17.23
0:17.3  [CONTAINER] ai-identity IN (17.33): eyebrow AI ENGINEER, SHIPS PRODUCTS ON A MODEL SOMEONE ELSE ALREADY TRAINED, all white,
        kt-camera-wobble
0:17.4  SAY:  "On a model, someone else has already trained."
0:18.2  [CONTAINER] ai-identity-s1 SOMEONE ELSE turns yellow ON "someone" (18.22), hard swap, held to 19.70
0:19.7  [VIDEO] BR-3 neural network model IN (19.70 → 23.60, 3.90 s), framed RIGHT (visual-qa: abstract network, fits "the model
        itself"; no readable number) · [TRANSITION] ai-identity → BR-3 kt-push-slide, silent (the panel's swoosh-2 carries) → hand:kt-push-slide (broll-fade, 0.10s)
0:19.8  [KT-PANEL] LEFT panel (alternates), 'ML ENGINEER' (green), slides in ON "The" (19.80) ·
        [WHOOSH] swoosh-2 (kinetic-text/swoosh-2.wav, mood_class neutral) file start 19.73
0:19.8  SAY:  "The ML engineer is commonly associated"
0:22.0  SAY:  "with the model itself, building it,"
0:22.5  [KT-PANEL] line 2 'THE MODEL ITSELF' rises ON "model" (22.50), silent (one sound per device)
0:23.6  [CONTAINER] build-train-deploy IN (23.60): eyebrow ML ENGINEER only, 0.30 s, kt-scatter-words card on turquoise suede ·
        [TRANSITION] BR-3 → card kt-push-slide, silent (word 1's pop carries) → hand:kt-push-slide (container-xfade, 0.10s)
0:23.9  [CONTAINER] build-train-deploy-s1 + BUILD ON "building" (23.90; Whisper "billing", captions fix) ·
        [ACCENT] pop-1 (kinetic-text/pop-1.mp3, mood_class neutral) file start 23.57
0:24.7  [CONTAINER] build-train-deploy-s2 + TRAIN ON "training" (24.70) · listen at the mix: possible -41 dB click 24.48-24.70 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 24.70
0:24.7  SAY:  "training it and deploying it."
0:25.5  [CONTAINER] build-train-deploy-s3 + DEPLOY ON "deploying" (25.50), held to 26.24 (no FROM SCRATCH on screen, W3) ·
        [ACCENT] pop-1 (kinetic-text/pop-1.mp3, mood_class neutral) file start 25.07
0:26.2  [TRANSITION] card → C1 (26.24): kt-push-slide in onto s0 (C1 spec) → lib:melt-equidistant-short-3 (MELT-transform, 0.44s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 26.14
0:26.2  [DIAGRAM] C1-s0-base IN (26.24 → 33.333): system-design split, both lanes, nothing lit, ML lane dim; shown ONCE, the one rich
        overview (`// DIAGRAM_REFS: C1`); kt-camera-wobble at house amplitude so the labels do not swim
0:26.3  SAY:  "Day to day, that means wiring a model"
0:28.2  [DIAGRAM] C1-s1-model MODEL SOMEONE ELSE TRAINED lights ON "model" (28.18): 4-frame cross-fade, node 1.00 → 1.03 → 1.00
0:28.4  SAY:  "like Claude into your data and your product"
0:28.7  [DIAGRAM] C1-s2-api arrow 1 + API ON "Claude" (28.70)
0:29.6  [DIAGRAM] C1-s3-data arrow 2 + YOUR DATA ON "data" (29.64)
0:30.5  [DIAGRAM] C1-s4-product arrow 3 + PRODUCT ON "product" (30.46)
0:30.9  SAY:  "and then testing whether the answers are any good."
0:31.4  [DIAGRAM] C1-s5-evals arrow 4 + EVALS ON "testing" (31.40): the whole AI lane traced, held to the F3 cut 33.333
0:32.8  [KT-POP] 'EVALS' at x 960 y 915 (spec override, clear of the ML lane), jiggle, ON "any good" (32.76), removed by the 33.333 cut ·
        [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 32.76
0:33.3  [TRANSITION] cover→face cut-in F3 (33.333; tight join, no breath after "good"): kt-snap-zoom → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 33.30 play 0-0.5 MIX GAIN -10 dB
0:33.3  [FACE] F3 IN → 0:40.0 (33.333-39.967); its one join (39.933) sits on the edge: no punch, no leak
0:33.3  [CAPTION] ON → 0:40.0 kt-caption-highlight (F3)
0:33.3  [KT-CAPTION] 'THAT'S MY SIDE' ON "That's" (33.30)
0:33.3  SAY:  "That's my side."
0:34.6  [KT-CAPTION] 'I'VE RUN CLAUDE AGENTS' ON "I've" (34.62)
0:34.6  SAY:  "I've run Claude agents across whole pipelines"
0:35.7  [KT-CAPTION] 'ACROSS WHOLE PIPELINES' ON "across" (35.68)
0:37.4  [KT-CAPTION] 'AND I NEVER ACTUALLY', NEVER yellow, ON "and" (37.38)
0:37.4  SAY:  "and I never actually trained a model."
0:38.8  [KT-CAPTION] 'TRAINED A MODEL', yellow (the take: NEVER ... TRAINED A MODEL, never a contiguous scripted run) ON "trained" (38.84)
0:40.0  [TRANSITION] face→cover F3 out (39.967): kt-whip-cut, or the AI-still ingress → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 39.97
0:40.0  [IMAGE] IMG-2 dev vs machine IN (39.967 → 42.57, 2.6 s still), slow push + kt-camera-wobble
0:40.0  SAY:  "So why does an AI engineer even exist?"
0:42.6  [TRANSITION] IMG-2 → BR-4 (42.57): kt-push-slide, footage pushing in → hand:kt-push-slide (broll-fade, 0.10s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 42.47
0:42.6  [VIDEO] BR-4 leaning back, hands behind head IN (42.57 → 45.633, 3.06 s): the kt-meme-inset reaction clip, here full frame
        (no face on screen to inset beside); licensed Envato stock (W4: no TV / cartoon clip); visual-qa advisory: grade it down
        slightly, the brightest clip of the set
0:42.6  SAY:  "Because the hard part, the training,"
0:43.4  [MUSIC] Bed row 3 (43.365): VERSE bars 32-39 (source_in 60.0), sample-continuous out of chorus 1 (it ends by itself), seat
        -26.0, fade-out 0.08 → 0:58.4
0:44.4  SAY:  "is already done for you."
0:44.9  [KT-EMOJI] clapping-hands emoji (~130 px, centre 960, 695) planted ON "done for you" (44.92), its own pop / wiggle, hard cut NO After Effects app, ever (Mike 2026-11-10, effects-library.md §3 item 5): headless aerender once at most; any problem = DROP the emoji, never block.
        out at 45.633; silent (the device is silent) · BUILD: an After Effects template device (Emoticon.aep alpha render), OPTIONAL:
        never open the AE app; no render exists in assets/ today, so with no headless render at comp time the row is dropped and
        nothing else moves
0:45.6  [TRANSITION] cover→face cut-in F4 (45.633): kt-push-slide landing on the face → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 45.63
0:45.6  [FACE] F4 IN → 0:58.1 (45.633-58.100), 12.47 s; its one join (58.067) sits on the edge: no punch, no leak (overlays.md
        section 1: no interior join = neither, whatever the hold); the boxed-words card breaks the hold
0:45.6  [CAPTION] ON → 0:58.1 kt-caption-highlight (F4), OFF under the boxed-words card 48.68-50.78
0:45.7  [KT-CAPTION] 'BUT AS SOON AS' ON "But" (45.68)
0:45.7  SAY:  "But as soon as that API bill gets too big,"
0:46.6  [KT-CAPTION] 'THAT API BILL GETS TOO BIG', TOO BIG yellow, ON "that" (46.58)
0:48.7  [KT-BOXED] kt-boxed-words → hand:kt-boxed-words (container-xfade, 0.00s) card cuts in full frame ON "you" (48.68 → 50.78, 2.1 s; the face audio runs on under it): flat NO After Effects app, ever (Mike 2026-11-10, effects-library.md §3 item 5): build the CAN / SHOULD boxes in Remotion code; fallback the caption phrase YOU CAN AND SHOULD.
        light-grey card, soft vignette, cut in SILENT (the bed carries) · BUILD: an After Effects template device (Scene_11), OPTIONAL:
        no render exists, so the comp-builder code-builds it in Remotion to the library row (two rough black boxes, yellow caps,
        word 1 at 960, 414 rot X -11 / Y 9 / Z 1, word 2 at 899, 682 rot X -8 / Y 6 / Z -1, streak-blur whip-in) and never opens
        After Effects; fallback = the caption phrase 'YOU CAN AND SHOULD' (CAN / SHOULD yellow) on the face, same timecodes
0:48.7  SAY:  "you can and should host and tune your own model,"
0:49.0  [KT-BOXED] word 1 CAN whips in from the upper left ON "can" (49.04) ·
        [WHOOSH] fast-swoosh (kinetic-text/fast-swoosh.wav, mood_class neutral) file start 48.79
0:50.1  [KT-BOXED] word 2 SHOULD follows ON "should" (50.06), both settle, silent
0:50.8  [TRANSITION] kt-shake-cut back to the F4 face ON "host" (50.78; Whisper "post"), the face lands shaking and settles in 0.25 s → hand:kt-shake-cut (face-cut, 0.25s; TRANSITION-PLAN 50.780)
        → hand:kt-shake-cut (face-cut, 0.25s) · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 50.78 play 0-0.5 MIX GAIN -10 dB
0:50.8  [KT-CAPTION] 'HOST AND TUNE', yellow (captions fix: HOST, never POST), ON "host" (50.78)
0:51.8  [KT-CAPTION] 'YOUR OWN MODEL', OWN MODEL yellow, ON "your" (51.76)
0:53.1  [KT-CAPTION] 'WHICH IS SOMETHING' ON "which" (53.08)
0:53.1  SAY:  "which is something that I've been thinking about lately."
0:54.0  [KT-CAPTION] 'I'VE BEEN THINKING ABOUT LATELY' ON "I've" (54.04)
0:56.0  [KT-CAPTION] 'HMM,' ON "Hmm" (55.98)
0:56.0  SAY:  "Hmm, how to cut those costs."
0:56.8  [KT-CAPTION] 'HOW TO CUT THOSE COSTS', CUT THOSE COSTS yellow, ON "how" (56.80), to the F4 cut 58.100
0:58.1  [TRANSITION] face→cover F4 out (58.100; "To" starts 58.06 on the face's last frame): the paper card PUSHES IN from the right → hand:kt-push-slide (face-cut, 0.07s; TRANSITION-PLAN 58.100)
        in 2 frames (kt-statement-over-broll paper) → hand:kt-push-slide (face-cut, 0.07s) ·
        [WHOOSH] fast-swoosh (kinetic-text/fast-swoosh.wav, mood_class neutral) file start 58.03 play 0-0.23
0:58.1  [CONTAINER] paper-sum-up IN (58.10 → 64.39): the ONE paper statement ([KT-STATEMENT] paper variant), lines 1-2 AI ENGINEERING
        IS LESS / ABOUT DEVELOPING MODELS + the credit CHIP HUYEN, AI ENGINEERING, kt-camera-wobble (105 percent, ±0.5 degree rock)
0:58.1  SAY:  "To sum it up, AI engineering is less about developing models"
0:58.4  [MUSIC] Bed row 4 (58.365): BREAKDOWN bars 66-69 pad (source_in 123.75), the dip under the paper card, seat -24.0, splice on
        bar line (verse bar 39 out, even bar 66 in), fade-out 0.08 → 1:05.9
1:02.0  [CONTAINER] paper-sum-up-s1 + lines 3-4 AND MORE ABOUT ADAPTING / AND EVALUATING THEM (black) ON "and" (62.00)
1:02.0  SAY:  "and more about adapting and evaluating them."
1:02.8  [CONTAINER] paper-sum-up-s2 ADAPTING turns red ON "adapting" (62.78), silent swap
1:03.5  [CONTAINER] paper-sum-up-s3 EVALUATING turns red ON "evaluating" (63.50), held to 64.39
```

## CH3 - HOW TO CHOOSE (1:04.4-2:04.0, Bed A carved, card OFF)
```
1:04.4  [TRANSITION] paper card pushes OUT to the left (0.100 s) into BR-5 (64.39) → hand:kt-push-slide (broll-fade, 0.10s) ·
        [WHOOSH] fast-swoosh (kinetic-text/fast-swoosh.wav, mood_class neutral) file start 64.39 play 0-0.23
1:04.4  [VIDEO] BR-5 chalk math equations IN (64.39 → 67.86, 3.47 s)
1:04.4  [KT-BAND] kt-lower-third-band verdict_pop: the dark-teal animated-texture band slides up (0.267 s, top edge at ~66 percent)
        with the push-out, sharing its fast-swoosh (005's pairing); question IF YOU HAVE THE / RESEARCH BACKGROUND slides in from the
        left, hovers; the band persists across the BR-5 → IMG-3 cut (W3: the band never says PhD)
1:04.4  SAY:  "If you have the research background,"
1:05.9  [MUSIC] Bed row 5 (65.865): VERSE bars 34-39 (source_in 63.75) into BUILD bars 40-43 at 77.115, seat -26.0, fade-out 0.08 → 1:24.7
1:06.3  SAY:  "the stats, the math, the graduate degree, go for ML."
1:07.9  [IMAGE] IMG-3 grad cap on textbooks IN (67.86 → 70.20, 2.34 s still), hard cut UNDER the band (silent), slow push → hand:cut (glitch-still, 0.00s)
1:09.8  [KT-BAND] verdict 'ML ENGINEER' (green, the role colour) pops under the question ON "ML." (69.82) ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 69.82
1:10.2  [VIDEO] BR-6 developer coding over the shoulder IN (70.20 → 73.05, 2.85 s), hard cut under the band · the question → hand:cut (broll-fade, 0.00s)
        IF YOU'RE A / SOFTWARE DEVELOPER slides in again ON "If" (70.30), silent text swap, the old verdict cleared
1:10.3  SAY:  "If you're a software developer, choose AI."
1:12.4  [KT-BAND] verdict 'AI ENGINEER' (yellow) pops ON "AI." (72.44) ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 72.44
1:13.0  [TRANSITION] BR-6 → wave wall (73.05): kt-spin-cut (a full turn in 5-8 frames, mirror-tiled, heavy blur) → hand:kt-spin-cut (container-xfade, 0.23s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 72.95 play 0-0.5 MIX GAIN -10 dB
1:13.0  [KT-WALL] wave-wall IN (73.05 → 75.37): `assets/kt-renders/wave-wall.mp4` (2.367 s, 71 frames, already offset), played from its
        frame 0 with no startFrom; TRAIN reads whole in both green rows from clip frame 15 (73.55); the library's blur-out at +1.90 s;
        the band is OFF (the one full-frame interlude). Fallback if the clip cannot be used: the bench card TRAIN MODELS → ML ENGINEER
1:13.1  SAY:  "If you wanna train models, ML."
1:15.4  [TRANSITION] wave wall out → BR-7 (75.37) → hand:kt-whip-cut (broll-fade, 0.17s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 75.37 play 0-0.63 MIX GAIN -10 dB
1:15.4  [VIDEO] BR-7 team celebrating launch IN (75.37 → 77.633, 2.26 s) (visual-qa advisory: a soft candlestick chart on a foreground
        monitor, acceptable for 2.3 s) · [KT-BAND] the band rides back up under the wall's out whoosh (one sound): line 1 TRAIN MODELS →
        ML ENGINEER (green, already lit), line 2 SHIP PRODUCTS → (verdict waiting)
1:15.4  SAY:  "If you wanna ship products, AI."
1:17.1  [KT-BAND] verdict 'AI ENGINEER' (yellow) pops on line 2 ON "AI." (77.14) ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 77.14
1:17.6  [TRANSITION] cover→face cut-in F5 (77.633): kt-snap-zoom to 130 percent (2 frames, y 0.50 → 0.585), the versus stack's face → hand:kt-whip-cut (face-cut, 0.37s; TRANSITION-PLAN 77.633 SWAPPED from kt-snap-zoom to the video's face pick, the whip LANDS at the 130 percent versus-stack framing, y 0.585)
        → hand:kt-whip-cut (face-cut, 0.37s) (face pick) · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 77.60 play 0-0.5 MIX GAIN -10 dB
1:17.6  [FACE] F5 IN → 1:22.4 (77.633-82.400); its one join (82.367) sits on the edge: no punch, no leak
1:17.6  [CAPTION] OFF over F5: the versus stack carries the line's words (never a caption stacked under it)
1:17.7  SAY:  "Think of shipping a support chatbot on Claude"
1:17.8  [KT-VERSUS] the ONE kt-versus-stack: dark-teal matte (79 percent, darken-type) slides DOWN in (0.262 s) at 77.77, 0.333 s
        before contender A, silent (under the cut's whoosh)
1:18.1  [KT-VERSUS] contender A 'SHIP A SUPPORT CHATBOT ON CLAUDE' (yellow; captions fix chat + bot = CHATBOT) slides down ON "shipping"
        (78.10), y ~31 percent, hovers with kt-camera-wobble ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 78.10 play 0-0.5 MIX GAIN -10 dB
1:20.4  [KT-VERSUS] 'VS' (white) drops ON "versus" (80.44), y ~39 percent ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 80.44 play 0-0.5 MIX GAIN -10 dB
1:20.4  SAY:  "versus training a fraud model."
1:21.0  [KT-VERSUS] contender B 'TRAIN A FRAUD MODEL' (green) drops ON "training" (81.04), y ~56 percent; all lines hold to the cut
        (no FROM SCRATCH) · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 81.04 play 0-0.5 MIX GAIN -10 dB
1:22.4  [TRANSITION] face→cover F5 out (82.400): kt-push-slide into C12 (the screenplay's C12 cut; its kt-shake-cut is the device for → hand:kt-whip-cut (face-cut, 0.37s; TRANSITION-PLAN 82.400 SWAPPED from kt-push-slide to the video's face pick, swoosh-4 ON the cut, off the face line's last word)
        a cut BACK to a face, so it is not used on this face→receipt cut) → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 82.40 (ON the cut, kept off "model.")
1:22.4  [RECEIPT] C12-headline IN (82.40 → 86.78, 4.38 s) R(article): the real LinkedIn Jobs on the Rise 2026 article, its title block
        "LinkedIn Jobs on the Rise 2026: The 25 fastest-growing roles in the U.S." shown as an OBJECT (the list is real), framed above
        the band (title kept above 66 percent of the frame height), never restyled `[VERIFY]` page still live ·
        treatment: pan [MOTION] lib:motion-3d-pan-1-right
1:22.5  SAY:  "And right now, LinkedIn's fastest-growing job"
1:22.8  [KT-BAND] band slides up with the question WHAT'S HIRING NOW ON "right now" (82.76) ·
        [WHOOSH] fast-swoosh (kinetic-text/fast-swoosh.wav, mood_class neutral) file start 82.76 play 0-0.23
1:24.6  [MUSIC] Bed row 6 (84.615): BUILD bars 40-43 again (source_in 75.0), the one 4-bar jump back, seat -26.0, fade-out 0.25 → 1:32.1
1:25.1  SAY:  "in the US for 2026 is AI engineer."
1:26.8  [RECEIPT] C12-entry IN (86.78 → 88.60, 1.82 s), hard cut ON "is" (silent re-frame of the same article): the number 1 entry → hand:cut (container-xfade, 0.00s)
        box 'AI engineers' framed above the band; the real line "Can also be known as Machine learning engineers" may stay in
        frame (W3: no head-to-head wording on the band) · treatment: highlight (settling push, then the wipe below)
1:27.5  [HIGHLIGHT] C12-entry yellow highlighter wipe (multiply) on 'AI engineers' landing ON "AI" (87.54) · [KT-BAND] verdict
        'AI ENGINEER' (yellow) pops under WHAT'S HIRING NOW, same frame ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 87.54
1:28.6  [VIDEO] BR-8 code scrolling, dark screen IN (88.60 → 92.02, 3.42 s), framed LEFT, a different clip from BR-6 (rule #12) ·
        [TRANSITION] C12 → BR-8 kt-push-slide, silent (the panel's swoosh-1 carries) → hand:kt-push-slide (broll-fade, 0.10s)
1:28.7  [KT-PANEL] RIGHT dark panel (alternates after 19.80 LEFT), slides in ON "If" (88.70) ·
        [WHOOSH] swoosh-1 (kinetic-text/swoosh-1.mp3, mood_class neutral) file start 88.53
1:28.7  SAY:  "If you have the code but not the math, AI is your way in."
1:29.3  [KT-PANEL] 'CODE' + green tick ON "code" (89.34), silent
1:30.1  [KT-PANEL] 'MATH' + red cross ON "math" (90.12), silent
1:30.5  [KT-POP] 'AI ENGINEER' (yellow) pops in the panel ON "AI" (90.54), held to 92.02 ·
        [ACCENT] twinkle (kinetic-text/twinkle.wav, mood_class neutral) file start 90.54
1:32.0  [TRANSITION] BR-8 → math-not-code (92.02): kt-push-slide → hand:kt-push-slide (container-xfade, 0.10s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 92.02 (ON the push, kept off "in.")
1:32.0  [CONTAINER] math-not-code IN (92.02 → 94.58): the screenplay's kt-side-panel paper variant, moved full frame by the coverage
        plan; IF YOU HAVE, both rows at rest, kt-camera-wobble
1:32.1  [MUSIC] Bed row 7 (92.115): RISE bars 44-47 (source_in 82.5) with its drum roll under "Now the money", then CHORUS 2 bars
        48-55 from 99.615, seat -31.0 (0.5 s ramp at 92.115), fade-out 0.08 → 1:54.7
1:32.1  SAY:  "If you have the math but not the production code,"
1:32.8  [CONTAINER] math-not-code-s1 MATH black + green tick ON "math" (92.76), silent
1:33.6  [CONTAINER] math-not-code-s2 + PRODUCTION CODE black + red cross ON "production" (93.58), held to 94.58, silent
1:34.6  [TRANSITION] math-not-code → C9 (94.58, in the 94.36-94.80 pause): kt-push-slide → hand:kt-push-slide (container-xfade, 0.10s) ·
        [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral) file start 94.48
1:34.6  [RECEIPT] C9-stripe-radar-header IN (94.58 → 96.06, 1.48 s) R(other): the real Stripe careers page, title 'Machine Learning
        Engineer, Radar', a flash under 2 s `[VERIFY]` posting still open (bench: the quote card with the read date) ·
        treatment: push (a short settling push on the title)
1:34.8  SAY:  "here's the thing, ML teams want shipping experience too."
1:36.1  [RECEIPT] C9-stripe-radar-requirements IN (96.06 → 98.05, 1.99 s), hard cut ON "ML" (silent): the Minimum requirements block, → hand:cut (container-xfade, 0.00s)
        bullet 1 "5+ years of experience developing, evaluating, and deploying machine learning models in a production environment."
        in frame · treatment: highlight (settling push that stops, then the wipe below)
1:36.8  [HIGHLIGHT] C9 bullet 1 wipe across "...in a production environment." landing ON "shipping" (96.82)
1:38.0  [RECEIPT] C6-levelsfyi-ai-engineer-us IN (98.05 → 101.70, 3.65 s), hard cut, silent (the rise's drum roll carries it) R(other): → hand:cut (container-xfade, 0.00s)
        the real Levels.fyi page, title 'AI Engineer in United States' + the '$155,500 MEDIAN TOTAL COMP' panel, so the page names AI
        and the US before the number is spoken (the take dropped both) `[VERIFY]` live median still 155.5K ·
        treatment: push (plain push toward the median panel, ends on title + median; the push crops the 'Other ML / AI Titles' strip,
        which reads Machine Learning Engineer $286,958 against the chart's US-location 287.5K)
1:38.1  SAY:  "Now the money, in total pay, the typical engineer in the US"
1:39.6  [MUSIC] HARD HIT 3 (99.615): chorus 2 drop on "in total pay", the drum roll under "Now the money" ·
        [IMPACT] layer: none (measured: the voice runs 99.16-100.06, the drop lands inside "in total pay"; the track's roll + drop is
        the hit, no SFX over the words)
1:41.7  [TRANSITION] C6 → C3 (101.70): kt-spin-cut (screenplay; the marquee SPIN candidate) → lib:spin-center-ease-short-cw (SPIN-newfacet, 0.44s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 101.60 play 0-0.5 MIX GAIN -10 dB
1:41.7  [CHART] C3 money ladder IN on C3-s0-start (101.70 → 117.18, 15.48 s): code-built (useCurrentFrame, the PNGs are the design
        spec), chrome only; the fixed source line LEVELS.FYI · UNITED STATES · TOTAL COMP · READ 2026-11-09 · THE AI ENGINEER TITLE
        SKEWS JUNIOR stays on screen the whole hold; y 856-984 kept empty for the word-by-word `[VERIFY]` re-pull both pages at render
1:41.7  SAY:  "makes around $155,000 a year."
1:42.4  [CHART] C3 bar 1 AI ENGINEER, MEDIAN (gold) grows ON "$155" (102.38 → 103.24, 26 f, easeOutCubic), counts $0.0K → $155.5K
        (never 155,000, never TYPICAL ENGINEER alone), labels fade up; lands on C3-s1-ai-median; silent (the drop just hit)
1:44.1  SAY:  "And the top 10% of ML engineers start at around $495,000"
1:45.9  [CHART] C3 bar 2 ML ENGINEER, MEDIAN (green, DIM) grows ON "ML engineers" (105.94 → 106.74), unspoken, counts to $287.5K;
        C3-s2-ml-median (the chart-builder's choreography call: the plan said 104.1-105.9)
1:48.1  [CHART] C3 bar 3 ML ENGINEER, TOP 10% (green, glow) grows ON "$495" (108.12 → 109.22, 33 f), counts $0K → $495K, glow pulse
        on landing; C3-s3-ml-top10 · [ACCENT] cash-register-2 (kinetic-text/cash-register-2.wav, mood_class neutral) file start 107.78
1:50.0  SAY:  "a year."
1:50.8  [CHART] C3 reaction shake on "My God, dude" (110.80), ~0.35 s decaying, comp-level, silent (his voice is the reaction)
1:50.8  SAY:  "My God, dude, that's a $340,000 gap."
1:52.5  [CHART] C3 bracket ON "$340,000" (112.48 → 112.93): AI-median dashed line draws (9 f), bar-3 lower shade (8 f), bracket
        draws bottom tick → top tick (14 f), THE GAP counts to $339.5K, TOP 10% ML ENGINEER VS AI ENGINEER MEDIAN (never 350K, never
        median vs median); C3-s4-gap · [ACCENT] cash-register (kinetic-text/cash-register.wav, mood_class neutral) file start 112.31
1:54.5  [KT-WORD] kt-word-by-word phrase 'AND IT GOES TO' (white, y 918) ON "And" (114.54), silent
1:54.5  SAY:  "And it goes to the people who train the models."
1:54.6  [DUCK] THE VIBE CUT (the ONE, the $340K gap): the bed's own HARD STOP to the pad on bar line 114.615 (chorus 2 bar 55 out,
        breakdown bar 66 in; a carve, no gain automation), measured in the voice trough 114.50-114.63 between "gap." and "And" ·
        crash zoom: the C3 layer punches 100 → 104 percent in 3 frames at 114.615, eased back by 115.30 (check the source line stays
        in frame, C3-geometry.json) · [MUSIC] HARD HIT 4 ·
        [IMPACT] impact-hit-01-2-short (Impacts/Impact_Hit_01-2-short.wav, mood_class epic, weight 5, measured peak 0.13 s, body gone by
        0.55 s) file start 114.49
1:54.6  [MUSIC] Bed row 8 (114.615): BREAKDOWN bars 66-71 pad (source_in 123.75), the hush the payoff line lands in, right-aligned
        so its riser bar runs into the final drop, seat -24.0, fade-out 0.25 → 2:05.3
1:55.3  [KT-WORD] phrase 'THE PEOPLE WHO' ON "the" (115.30), silent
1:56.1  [KT-WORD] payoff 'TRAIN' goes big at x 960 y 540, payoffColor #00e68a (the chart's ML green), jiggle, held to 117.18; C3-s5-payoff
        dims the plot (5 f) · [ACCENT] cash-register-2 (kinetic-text/cash-register-2.wav, mood_class neutral) file start 115.72
1:57.2  [IMAGE] IMG-4 three empty chairs IN (117.18 → 119.75, 2.57 s still), slow push; cut silent in the hush → hand:fade (glitch-still, 0.33s)
1:57.3  SAY:  "But those seats are few and you're competing with PhDs"
1:59.8  [VIDEO] BR-9 research scientists lab IN (119.75 → 123.70, 3.95 s) with the kt-headline-over-broll whip-zoom landing
        → hand:kt-whip-cut (broll-fade, 0.37s) (visual-qa advisory: a wet lab, reads as scientists) ·
        [WHOOSH] swoosh-3 (kinetic-text/swoosh-3.wav, mood_class neutral) file start 119.75
2:00.3  [KT-HEADLINE] 'COMPETING WITH PhDs' (W3: COMPETING WITH, never NEED A) pops mid-frame ON "competing" (120.32), held to 123.70;
        silent text (the cut's swoosh-3 is its sound)
2:01.9  SAY:  "for them, something to ponder."
2:03.7  [TRANSITION] cover→face cut-in F6 (123.700): kt-push-slide landing on the face → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 123.70
2:03.7  [FACE] F6 IN → 2:07.5 (123.700-127.533); its one join (127.4) sits on the edge: no punch, no leak
2:03.7  [CAPTION] ON → 2:05.9 kt-caption-highlight (F6), OFF under the AI ENGINEERING pop 125.865-127.533
```

## CH4 - THE VERDICT AND SUBSCRIBE (2:04.0-2:25.2 + the 2.0 s END HOLD, Bed A carved, card OFF)
```
2:04.0  [KT-CAPTION] 'THEREFORE, FOR MOST DEVELOPERS' ON "Therefore" (123.98)
2:04.0  SAY:  "Therefore, for most developers, AI engineering is the key."
2:05.3  [MUSIC] Bed row 9 (125.265): the last 0.6 s of bar 71 (the seat steps to -31.0 with a 0.5 s ramp BEFORE the drop, never on
        it), then FINAL CHORUS bars 72-79 (source_in 134.4) from 125.865, fade-out 0.08 → 2:20.9
2:05.9  [MUSIC] HARD HIT 5 (125.865): the final chorus drop ·
        [RISER→IMPACT] layer: none for the riser: it is the track's own pad riser (bars 70-71) under "Therefore, for most developers";
        an SFX riser on top would sit on the words. Measured: "developers," ends 125.58, trough 125.58-125.74, "AI" starts 125.76
        (Whisper says 126.04), so the drop lands inside "AI". The hit is the verdict pop's punch, layered ON the drop:
        [KT-POP] 'AI ENGINEERING' (yellow), kt-keyword-pop at ~79 percent height, ON the drop inside "AI engineering" (125.865),
        held 1.67 s to the F6 cut 127.533 (the 1.2-2.2 s spec; the screenplay's cue "the key" 127.10 left a 0.43 s hold) ·
        [ACCENT] punch-sound-effect (kinetic-text/punch-sound-effect.mp3, mood_class neutral, measured onset 0.90 / peak 0.99) file start 124.88
2:07.1  [KT-SPARK] kt-keyword-sparkle burst on AI ENGINEERING's last letter ON "the key" (127.10) ·
        [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) file start 126.56 (onset 127.34 on "key", inside F6)
2:07.5  [TRANSITION] face→cover F6 out (127.533): the kt-headline-over-broll whip-zoom landing on BR-10 → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-3 (kinetic-text/swoosh-3.wav, mood_class neutral) file start 127.53
2:07.5  [VIDEO] BR-10 door opening, light pouring through IN (127.533 → 130.40, 2.87 s, leading motion)
2:07.7  SAY:  "The door is open, you already have the skills."
2:07.8  [KT-HEADLINE] 'THE DOOR IS OPEN' pops mid-frame ON "door" (127.80), held to 130.40; silent text (the cut's swoosh-3 is its
        sound); pays off the CH1 "door open" line, no job or salary promise
2:10.4  [TRANSITION] cover→face cut-in F7 (130.400): kt-push-slide landing on the face → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 130.40
2:10.4  [FACE] F7 IN → 2:19.5 (130.400-139.533), 9.13 s; ONE interior punch point (134.767), see below
2:10.4  [CAPTION] ON → 2:19.5 kt-caption-highlight (F7); while the subscribe bar is up (130.76-133.69) the line rides ABOVE the bar
        (y ~72 percent, the two-colour pop height), then returns to its base
2:10.5  [KT-CAPTION] 'SO SUBSCRIBE' ON "So" (130.48)
2:10.5  SAY:  "So subscribe for more steady content"
2:10.8  [KT-CLOSE] kt-subscribe-close BAR rises onto the chest ON "subscribe" (130.76): plate graphics/subscribe-bar-fill + -key,
        rises 538 px over 0.262 s, bar 699 x 134 at (960, 881); the cursor clicks LIKE, then SUBSCRIBE (→ SUBSCRIBED) ·
        [ACCENT] subscribe-bar-clicks (kinetic-text/subscribe-bar-clicks.wav, mood_class neutral, measured clicks at 0.64 / 2.32 / 3.82)
        file start 130.76 play 0-3.30
2:11.5  [KT-CAPTION] 'FOR MORE STEADY CONTENT' ON "for" (131.46)
2:12.8  [KT-CAPTION] 'ON HOW TO BECOME AN AI ENGINEER', HOW TO BECOME AN AI ENGINEER yellow, ON "on" (132.78)
2:12.8  SAY:  "on how to become an AI engineer."
2:13.1  [KT-CLOSE] the SUBSCRIBE press (133.08, the plate's second click) turns SUBSCRIBED ·
        [ACCENT] subscribe-button (kinetic-text/subscribe-button.wav, mood_class neutral, measured click 5.82 / main hit 6.00) file start 133.06 play 5.80-6.77
2:13.7  [KT-CLOSE] the bar drops below the frame over 0.200 s (133.69), silent; the caption line returns to its base height
2:14.8  [PUNCH-IN] F7 hard ~20 percent step (kt-snap-zoom: 2 frames, motion blur) ON the desilencer join 134.767 (frame 4043,
        spine/jumpcuts-final.json), in the measured trough 134.76-134.92; holds to the window end 139.533 (the next join, 139.4, is
        on the edge) · [LIGHTLEAK] F7 library light leak peaking ON the same frame, screen blend, UNDER the caption (lib:lightleaks-*,
        the video's set of 3-4, ledger slot face_leak: soft-2 / soft-short-8 blocked) → lib:lightleaks-6 (punch-leak, 1.12s) (punch-leak) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 134.73 play 0-0.5 MIX GAIN -10 dB
2:15.1  [KT-CAPTION] 'ALL MY CONTENT' ON "All" (135.08)
2:15.1  SAY:  "All my content on this channel is geared to help you"
2:15.8  [KT-CAPTION] 'ON THIS CHANNEL' ON "on" (135.82)
2:16.5  [KT-CAPTION] 'IS GEARED TO HELP YOU' ON "is" (136.50)
2:17.8  [KT-CAPTION] 'ON YOUR AI ENGINEERING JOURNEY', AI ENGINEERING yellow, ON "on" (137.82)
2:17.8  SAY:  "on your AI engineering journey."
2:19.5  [TRANSITION] face→cover F7 out (139.533): kt-push-slide, the end card pushes in → hand:kt-whip-cut (face-cut, 0.37s) ·
        [ACCENT] mouse-click (kinetic-text/mouse-click.mp3, mood_class neutral, the viewer's click on the end screen) file start 139.51 play 1.00-1.40
2:19.5  [CONTAINER] end-screen IN (139.533): WATCH NEXT + four empty 16:9 slots on turquoise suede, no arrow; NO camera wobble (the
        slots must sit still under the YouTube end-screen elements: slot 1 at 364, 236 · slot 2 996, 236 · slot 3 364, 607 · slot 4
        996, 607, each 560 x 315); the inference video fills one slot
2:19.6  SAY:  "And watch this next video right here,"
2:20.9  [CONTAINER] end-screen-s1 the playlist arrow of kt-subscribe-close pops on slot 1 ON "right" (140.86), 111 percent overshoot ·
        [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 140.84 play 0.467-0.70
2:20.9  [MUSIC] Bed row 10 (140.865): the 0:36 instrumental cut (PALA_Concrete_Mazes_instrumental_0_36-5), source_in 27.188, chorus
        bars 30-31, chorus STOP on bar line 144.615, the STAB at 145.084, echoes 145.78 / 146.04 / 146.26 / 146.96; align_end;
        seat -31.0; the mixer runs it on through the END HOLD to 147.00 and its closing fade takes the last echo
2:21.6  SAY:  "or maybe even this one, or this one,"
2:22.3  [CONTAINER] end-screen-s2 arrow to slot 2 ON "this" (142.32) ·
        [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 142.30 play 0.467-0.70
2:23.1  [CONTAINER] end-screen-s3 arrow to slot 3 ON "this" (143.14) ·
        [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 143.12 play 0.467-0.70
2:23.7  SAY:  "or even this one."
2:24.4  [CONTAINER] end-screen-s4 arrow to slot 4 ON "this" (144.44), held through the last word (145.00) and the 2.0 s END HOLD to
        147.00; SILENT on purpose: no boing over the chorus stop (144.615) so the last "one." is said clean in the ring (MUSIC-PLAN)
2:25.1  [MUSIC] HARD HIT 6 (145.084): the stab of the cut, measured 0.02 s after "one." falls away (voice -41 dB at 145.06) ·
        [IMPACT] layer: none (the stab IS the ending hit; its echoes ring through the end hold and a layered boom would blur them)
2:25.2  [END] the spine ends (145.20). The comp holds end-screen-s4 + the bed 2.0 s past the last word to 147.00 (END HOLD, Mike,
        spoken in the recording and repeated at spine_review); no cut to black first. Final runtime 2:27.0.
```

## Orphan reconciliation (against `assets/` on disk, 2026-11-10)
Every renderable file is PLACED (timecode above) or REJECTED below. Source files (`.html`, `.json`, `.py`, `.md`, `.jsx`, `.aep`,
`slide-sources/`) are exempt (comp-build.md section 10).

**PLACED**
- Video b-roll x10: BR-1 2.567 · BR-2 13.97 · BR-3 19.70 · BR-4 42.57 · BR-5 64.39 · BR-6 70.20 · BR-7 75.37 · BR-8 88.60 · BR-9 119.75 ·
  BR-10 127.533 (Envato 10/10, each once, each 4 s or less).
- Images x4: IMG-1 5.25 · IMG-2 39.967 · IMG-3 67.86 · IMG-4 117.18 (ChatGPT 4/5, one slot unused).
- Receipts x5 files / 3 receipts: C12-headline 82.40 (pan) · C12-entry 86.78 (highlight) · C9-stripe-radar-header 94.58 (push) ·
  C9-stripe-radar-requirements 96.06 (highlight) · C6-levelsfyi-ai-engineer-us 98.05 (push).
- Diagram C1 x6 states (Type 2 stills, comp swaps them): C1-s0-base 26.24 · C1-s1-model 28.18 · C1-s2-api 28.70 · C1-s3-data 29.64 ·
  C1-s4-product 30.46 · C1-s5-evals 31.40.
- Chart C3 (Type 1, ANIMATED in code): C3-s0-start 101.70 · C3-s1-ai-median 103.24 · C3-s2-ml-median 106.74 · C3-s3-ml-top10 109.22 ·
  C3-s4-gap 112.93 · C3-s5-payoff 116.06. The six PNGs are the design spec the component lands on pixel for pixel (charts.md section 3:
  never hold a chart PNG); they are not comp inputs.
- Card slides: roles-split 12.367 · ai-identity 17.33 + ai-identity-s1 18.22 · build-train-deploy 23.60 + -s1 23.90 + -s2 24.70 + -s3 25.50 ·
  paper-sum-up 58.10 + -s1 62.00 + -s2 62.78 + -s3 63.50 · math-not-code 92.02 + -s1 92.76 + -s2 93.58 · end-screen 139.533 + -s1 140.86 +
  -s2 142.32 + -s3 143.14 + -s4 144.44.
- kt-renders: `wave-wall.mp4` 73.05 (the rendered Scene_22 template, already offset; never re-rendered, never After Effects again).

**REJECTED (renderable, deliberately not a comp input)**
- `card-slides/wave-wall.png` REJECTED as a comp input: the visual-qa poster (clip frame 28); the comp plays `kt-renders/wave-wall.mp4`
  (kt-wave-wall: render the template, never stills).
- `charts/C3-preview-payoff-with-word.png` REJECTED as a comp input: REVIEW ONLY mock of the TRAIN payoff word; the comp's KtWordByWord
  engine draws TRAIN.

**BENCH:** none on disk. Benches named in COVER-PLAN that were never acquired: C10 (Karpathy X post), C11 (Huyen excerpt, the paper
card's wording source), C4 (Anthropic posted midpoints, the C3 swap-in if a Levels.fyi page drifts), C14 (optional VS Code flash),
the C12 / C9 code-built text cards (only if a capture fails at render).

## SFX palette: types weighed for this video (Mike 2026-10-16, longform-edited.md section 7)
Register: gear 2.5-3, energetic head-to-head; bed `concrete-mazes` (Fun / Happy, aggression 94). Mood gate: `neutral` / `hype` /
`epic` only; nothing `dark`, nothing `tense` placed.
- USED: kinetic-text pairs (mood neutral, every device's own 2023 sound) · impacts: ONE, impact-hit-01-2-short (epic) on the vibe cut.
- Left out, each on purpose: risers (the track's own risers carry 13.365 / 99.615 / 125.865; every catalog riser is tense or dark
  except edgy-riser, whose 5.15 s build would ride the VO) · booms (the one impact already marks the biggest beat; a second boom breaks
  "fewer, bigger") · braams (a braam needs a spine pause of ~3.3 s, which takes the video from 2:27.0 past the 2:29 cap; the $340K gap
  line runs straight into the payoff with no sentence gap) · tension builders (tense, no suspense beat in this register) ·
  downshifters (tense; weighed for the "But those seats are few" deflation, but the bed's hard stop + the vibe-cut impact already drop
  the energy 2.7 s earlier) · drones (no slow-burn setup in a 2:27 hype explainer) · accents (every graphic pop already carries its own
  kinetic-text sound: one sound per event) · cinematic whooshes (the kinetic-text whooshes cover every cut) · textures (no catalog
  folder exists) · stingers / reaction sounds (weighed for "My God, dude": his own voice is the reaction, a stinger would cover it).
