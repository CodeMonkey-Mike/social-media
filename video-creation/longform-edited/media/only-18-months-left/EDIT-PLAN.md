# only-18-months-left - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author (2026-10-27) off the graph's seed `_previews/EDIT-PLAN.seed.md` (every SAY line, cover beat,
> bed, hard hit, FACE window and card already on final-spine seconds) + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json +
> PROJECT-LOG.md (Open flags) + `spine/jumpcuts-final.json` + `spine/ALL.f.restored.medium-words.json` (word onsets for every
> state row). Format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; the comp is built TO this log.
> Watch file: `spine/ALL.f.restored.mp4` (610.13s / 10:10.1, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause: the four
> title-card pauses, the four clip inserts and the one braam spine pause shift the final timeline via `sh()` at comp; no chain
> shift is applied here.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (authored next by the transition-strategist). FACE STYLE = GLITCH
> (Mike 2026-10-16 / PROJECT-LOG): every cover→face cut-in is a random `split-swinging-offset-*`, every punch-in on a desilencer
> join carries a random `glitchoffset-*` / `blocks-*` hit across the same join, NO light leaks anywhere.
> Every FACE window airs as its Mad Max Higgsfield clip (`assets/face-swap/F<n>-higgsfield-bg-swap.mp4`, Mike approved all
> 11, 2026-10-26): video-only, SPINE AUDIO KEPT, each clip's window starts 0.4 s into the file (the head handle).
> SFX: every row names the kit file + its `mood_class`; impacts / risers / braam picked by the MEASURED tail (ffmpeg, 10 ms RMS,
> the point where the envelope falls 40 dB under its peak), file starts computed so the peak lands ON the event frame. SFX are an
> ffmpeg post-mix (comp-build §9), every hit UNDER the VO.
> Captions: ON over FACE holds over 5 s ONLY (F2, F3, F4, F6, F8, F9), never over a cover, OFF under every keyword pop.
> ZERO ORPHANS: every renderable in assets/ (vid, img, receipts, clip-inserts, charts, diagrams, title-slides, card-slides,
> face-swap) is PLACED below with a timecode or marked BENCH / REJECTED in the reconciliation at the end.

## CH1 - THE ROLL CALL (0:00.0-1:10.9, Bed A, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:04.2 (the video opens here, no cut-in) · [VIDEO-LAYER] F1-higgsfield-bg-swap.mp4 over the
        window (Mad Max look; swap t=0.4 = spine 0.0); a slow punch-in over the line; NO [PUNCH-IN] (the only join, 4.133, is the
        window's own edge) · captions OFF (4.2 s hold)
0:00.0  [MUSIC] Bed A `harvester` INTRO section (Wicked_Cinema_Harvester_background_vocals_intro_0_55-1.wav), cold start, no
        fade-in, -25.6 dB (-17 under the CH1 VO), REMIX loop bars 4-14 (6.957-24.348 s) x2, tail trim 3.64 s → 1:10.9
0:00.0  SAY:  "AI came for the first wave of jobs and almost nobody noticed."
0:04.2  [TRANSITION] face→cover F1 out → lib:blocks-max-2 (face-cut, 0.96s) (face-out)
0:04.2  [VIDEO] BR-1-fog-road-night IN → 0:05.8 (1.6 s): slow push through fog over an empty city street at night, red rim light
0:04.2  SAY:  "The next wave has a date on it."
0:05.8  [CONTAINER] h0-next-wave-card IN → 0:07.7: full-frame motion-type THE NEXT WAVE HAS A DATE, red, slams on 'date' → hand:xfade-scale (container-xfade, 0.35s)
        (5.86); captions OFF
0:05.9  [IMPACT] H0 slam on 'date' (MUSIC-PLAN hard hit 5.86): Impact_Hit_01-2-short (Impacts/Impact_Hit_01-2-short.wav,
        mood_class epic; measured peak 0.13 s, -40 dB 0.42 s after it) FILE START 5.73 so the peak lands ON 'date', gone by 6.28,
        before 'Last' (6.66); ~0.4 gain under the VO; Bed A holds flat (no bed move)
0:06.7  SAY:  "Last video, I showed you the robots coming for the cashier, the trucker, the warehouse,"
0:07.7  [TRANSITION] H0 exit = PUMPKIN transition 1 of 3 (`scary-pumpkin-fire` or `scary-6-normal75`) → lib:scary-6 (scene-cut, 1.24s) (its
        baked stinger is the transition's own sound)
0:07.7  [CHART] C1-roll1 ROLL 1 IN → 0:17.5 · [HW-MONTAGE] hw-zoom-slideshow (the reference's picture-into-picture hits, a silent
        device, captions OFF), 12 code-rendered pictogram cards, one per hit, scary-pack hits between cards → lib:scary-6 (scene-cut, 1.24s);
        hit 1 = C1-roll1-01-customer-service-reps 'CUSTOMER SERVICE REPS 2.7M'
0:08.5  [CHART] C1-roll1-02-roofers 'ROOFERS 167K' (on 'the' 8.48)
0:09.2  [CHART] C1-roll1-03-carpenters 'CARPENTERS 890K' (on 'coming' 9.18)
0:10.1  [CHART] C1-roll1-04-cashiers 'CASHIERS 3.1M' ON 'cashier' (10.08)
0:11.2  [CHART] C1-roll1-05-heavy-truck-drivers 'HEAVY TRUCK DRIVERS 2.2M' ON 'trucker' (11.20)
0:12.1  [CHART] C1-roll1-06-hand-laborers-material-movers 'HAND LABORERS AND MATERIAL MOVERS 6.9M' ON 'warehouse' (12.14)
0:13.1  SAY:  "the electrician, the plumber, all the way up to the brain surgeon."
0:13.2  [CHART] C1-roll1-07-electricians 'ELECTRICIANS 821K' ON 'electrician' (13.22)
0:14.5  [CHART] C1-roll1-08-plumbers-pipefitters 'PLUMBERS AND PIPEFITTERS 511K' ON 'plumber' (14.48)
0:15.1  [CHART] C1-roll1-09-taxi-shuttle-chauffeur 'TAXI, SHUTTLE AND CHAUFFEUR DRIVERS 456K' (on 'all' 15.12)
0:15.7  [CHART] C1-roll1-10-computer-programmers 'COMPUTER PROGRAMMERS 111K' (on 'way' 15.68)
0:16.1  [CHART] C1-roll1-11-radiologists 'RADIOLOGISTS 27K' (on 'to' 16.12)
0:16.5  [CHART] C1-roll1-12-neurosurgeons 'NEUROSURGEONS' ON 'brain surgeon' (16.54), holds to the cut
0:17.5  [VIDEO] BR-2-particle-brain IN → 0:19.2 (1.8 s): a brain hologram breaking into particles → hand:fade (broll-fade, 0.50s)
0:17.5  SAY:  "But the brain went first."
0:19.2  [HW-MONTAGE] ROLL 2, hw-zoom-slideshow again, faster: five AI stills (no text), each with its code-rendered BLS label → lib:scary-6-normal75 (glitch-still, 1.24s)
        over it; captions OFF; the ACTORS hit DROPPED ("the actor" was cut at the spine gate, AS-RECORDED flag 19.24)
0:19.2  [IMAGE] IMG-1-writer-desk IN → 0:21.5, label WRITERS AND AUTHORS 140K (on 'writer' 20.74)
0:19.2  SAY:  "It already came for the writer and the designer and now it's coming for the editor,"
0:21.5  [IMAGE] IMG-2-design-studio IN → 0:23.5, label GRAPHIC DESIGNERS 253K (on 'designer' 21.74)
0:23.5  [IMAGE] IMG-3-edit-suite IN → 0:24.4, label FILM AND VIDEO EDITORS 39K (on 'editor' 23.76)
0:24.4  [IMAGE] IMG-4-accounting-office IN → 0:25.6, label ACCOUNTANTS AND AUDITORS 1.6M (on 'accountant' 24.64)
0:24.4  SAY:  "the accountant and the lawyer."
0:25.6  [IMAGE] IMG-5-law-office IN → 0:26.5, label LAWYERS 864K (on 'lawyer' 25.78), holds a beat longer
0:26.1  SAY:  "In February, the CEO of Microsoft AI, Mustafa Suleyman, put a clock on it."
0:26.5  [VIDEO] BR-3-pocket-watch IN → 0:30.1 (3.6 s): a ticking clock face in a dark room → hand:fade (broll-fade, 0.50s)
0:30.1  [RECEIPT] CLIP-1 LEAD-IN → 0:32.3: CLIP-1-suleyman-12-to-18-months.mp4 FIRST frame held as a still, burned strap → hand:xfade-scale (container-xfade, 0.35s)
        'Mustafa Suleyman, CEO of Microsoft AI, FT interview, February 2026' under the set-up line (name on screen while
        'Mustafa Suleyman' is said) · treatment: push (a held frame of a recording, settling push) `[VERIFY]`
0:32.3  [INSERT] CLIP-1 SPLICED CLIP, 15.6 s: the spine PAUSES at the trough after "...put a clock on it." (splice_at 32.26,
        snapper dry-run trough 32.04-32.36, snaps to 32.30; only 80 ms on the words, run lint-pause-silence before the bake) and
        assets/clip-inserts/CLIP-1-suleyman-12-to-18-months.mp4 plays FULL-FRAME with Suleyman's OWN voice (baked into the VO
        track); Bed A ducks -14 dB automatically (mix_music.py, no bed change or hit inside the window) ·
        [TRANSITION] insert-in / insert-out = scary-pack stinger → hand:fade (insert-in, 0.50s) (bucket insert)
0:32.3  [RECEIPT] CLIP-1 LEAD-OUT → 0:34.1: the clip's LAST frame held as a still under the resume line 'That was February' ·
        treatment: push
0:32.3  SAY:  "That was February, so his clock runs out next year."
0:34.1  [DIAGRAM] C2-clock-his-window IN → 0:37.1 (state 1): 'FEB 2026: 12 TO 18 MONTHS' (MICROSOFT AI CEO), the window → hand:xfade-scale (container-xfade, 0.35s)
        'FEB TO AUG 2027' lit red, the 'TODAY: OCT 2026' marker ticking toward it; lands on 'his clock' (34.26)
0:37.1  [TRANSITION] cover→face cut-in F2 → lib:split-swinging-offset-combs-1 (face-cut, 0.88s) (face-in: split-swinging-offset, glitch style)
0:37.1  [FACE] F2 IN → 0:43.2 · [VIDEO-LAYER] F2-higgsfield-bg-swap.mp4 (Mad Max; video-only)
0:37.1  [CAPTION] ON → 0:43.2 (6.1 s hold), OFF under the 18 MONTHS pop (38.9-40.1)
0:37.1  SAY:  "My own call is 18 months and by then most of all desk work will be done by AI."
0:38.9  [HW-POP] hw-word-pop '18 MONTHS' ON '18' (38.88), low in frame, hard-cut at 40.1 (silent device, as in the source)
0:39.7  [PUNCH-IN] F2 hard ~15-20% step ON the desilencer join 39.667 (frame 1190) → holds to the cut 0:43.2 (40.467 is within
        1.5 s, not a punch point)
0:39.7  [GLITCH] F2 random glitch offset / glitch blocks hit ACROSS the same join (lib:glitchoffset-* / lib:blocks-*)
        → lib:glitchoffset-3x (punch-glitch, 0.60s) (punch-glitch)
0:43.2  [TRANSITION] face→cover F2 out → lib:blocks-max-2 (face-cut, 0.96s)
0:43.2  [DIAGRAM] C2-clock-mikes-call IN → 0:46.0 (state 2): the same timeline returns with the second marker 'MIKE'S CALL:
        18 MONTHS' past the red window (one container in two states split by the face, a continuation, not a repeat)
0:43.3  SAY:  "And here's the part that has me on edge."
0:46.0  [TRANSITION] cover→face cut-in F3 → lib:split-swinging-offset-short-layout-2x1-1 (face-cut, 0.48s) (face-in: split-swinging-offset)
0:46.0  [FACE] F3 IN → 0:55.0 · [VIDEO-LAYER] F3-higgsfield-bg-swap.mp4 (F3a + F3b joined FRAME-exact at the 49.267 join)
0:46.0  [CAPTION] ON → 0:55.0 (9.1 s hold)
0:46.1  SAY:  "Imagine a world where prices are so cheap that it's almost impossible to make enough money"
0:49.3  [PUNCH-IN] F3 hard ~15-20% step ON the desilencer join 49.267 (frame 1478) → holds to the cut 0:55.0
0:49.3  [GLITCH] F3 random glitch offset / glitch blocks hit ACROSS the same join → lib:blocks-medium-2 (punch-glitch, 0.96s) (punch-glitch)
0:49.3  [HW-SHAKE] CAMERA SHAKE 1 of 2 (hw-camera-shake = lib:motion-shake-optics-2x-long, silent) rides the punch from the join,
        through 'almost impossible' (49.74-50.72, the re-cue AS-RECORDED asks for), held hard to the cut 0:55.0
0:52.0  SAY:  "and have more left over to put it into investments."
0:55.0  SAY:  "Because the paychecks disappear before the prices do."
0:55.0  [TRANSITION] face→cover F3 out → lib:blocks-max-2 (face-cut, 0.96s)
0:55.0  [CHART] H1 IN → 1:04.6, state H1-paychecks-prices-start (two lines level on the dark grid, text only, no numbers)
0:55.8  [CHART] H1 PAYCHECKS line falls ON 'paychecks' (55.80)
0:56.4  [RISER→IMPACT] creepy-orchestral-rise (risers/Creepy_Orchestral_Rise.wav, mood_class dark; measured peak 14.49 s into
        the file, -40 dB 1.40 s after it, climax_cut) FILE START 56.37 so its peak lands ON the CH2 card frame 1:10.9 (70.86) =
        the card impact; seated low under the VO (~-24 under, tune by ear), Bed A is in its resolve there anyway
0:57.8  [CHART] H1-paychecks-prices-gap: PRICES falls later ON 'prices' (57.80), the gap lit red
0:58.7  SAY:  "And the only people who make it through are the ones who already own assets today."
1:03.1  [CHART] H1-paychecks-prices-assets: the flat OWN THE ASSETS line holds at the top ON 'assets' (63.06)
1:04.6  [CONTAINER] rl-skeleton IN → 1:08.8: the empty RISK LEVEL card skeleton flashes once (DARK, red), the viewer learns → hand:xfade-scale (container-xfade, 0.35s)
        the device
1:04.6  SAY:  "I'm going job by job and I'm putting a risk level on every one."
1:08.8  [VIDEO] BR-4-tall-grass-dusk IN → 1:10.9 (2.1 s): pushing through tall dark grass at night, rides into the SPLIT move → hand:fade (broll-fade, 0.50s)
1:08.8  SAY:  "So let's get into the weeds a bit."
```

## CH2 - ALREADY GONE: COPYWRITERS AND GRAPHIC DESIGNERS (1:10.9-2:41.9, Bed B, card ON)
```
1:10.9  [CARD] CH2 title card "ALREADY GONE" · [IMPACT] card-impact-hit01-3-short (below) → rmn:cube (card, 0.60s)
        (title-CH2.png; edit-time pause >= 1 s at the trough 70.86, zero spine time) ·
        [TRANSITION] chapter SPLIT move (the Glass Blocks family, picked once) → lib:glass-blocks-2-horizontal (scene-cut, 0.84s) ·
        [IMPACT] card-impact-hit01-3-short (Impacts/card-impact-hit01-3-short.wav, mood_class epic; measured peak 0.13 s, -40 dB
        2.11 s after it) FILE START 70.73, peak ON the card frame; the CH1 creepy riser ends ON it
1:10.9  [MUSIC] Bed B `harvester` full cut (Wicked_Cinema_Harvester_background_vocals_3_46.mp3) from file 0, -26.4 dB (-17 under),
        fade-in 0.6 s, breath 0.5 s inside the card pause, section 0-91.5 s → 2:41.9
1:10.9  [IMAGE] IMG-6-abandoned-desk IN → 1:13.2 (scary-pack still ingress → lib:glass-blocks-2-horizontal (scene-cut, 0.84s)); gold accent chapter
1:10.9  SAY:  "Start with the copywriters."
1:12.5  SAY:  "Ads, blogs, product pages, emails."
1:13.2  [VIDEO] BR-5-typewriter-night IN → 1:15.8 (2.7 s): typewriter keys pressing by themselves in candlelight → hand:fade (broll-fade, 0.50s)
1:15.8  [RECEIPT] R1-openai-plus IN → 1:20.8: OpenAI Help Center 'What is ChatGPT Plus?' · [HIGHLIGHT] '$20/month' wipes ON → hand:xfade-scale (container-xfade, 0.35s)
        '$20 a month' (75.82) · treatment: highlight (the line reads the price off it) `[VERIFY]` price at capture
1:15.8  SAY:  "A $20 a month model writes the first draft of all of it in seconds."
1:20.8  [CHART] C4 IN → 1:32.3, state C4-freelance-writing-start: header THE WORK DIDN'T VANISH. IT GOT CHEAP. → hand:xfade-scale (container-xfade, 0.35s)
1:20.8  SAY:  "So the work didn't vanish."
1:22.6  SAY:  "It got cheap."
1:23.4  [CHART] C4-freelance-writing-mid: WRITING AND CODING POSTS vs MANUAL WORK bars draw ON 'Within eight months' (83.38)
1:23.4  SAY:  "Within eight months of ChatGPT, freelance posts for writing and coding work dropped"
1:29.1  [CHART] C4-freelance-writing-payoff: the WRITING AND CODING bar drops to -21% ON '21' (89.08), manual flat; source
        line Demirci, Hannane, Zhu, Management Science 2025
1:29.1  SAY:  "21% compared with hands-on work."
1:32.3  [RECEIPT] C6-bls-writers-outlook IN → 1:35.9: BLS OOH writers and authors, Job Outlook 0% · [HIGHLIGHT] 'Increasing use → hand:xfade-scale (container-xfade, 0.35s)
        of artificial intelligence (AI) for writing is projected to dampen demand' ON 'zero growth' (92.32) · treatment: highlight
1:32.3  SAY:  "And the US government projects zero growth for writers."
1:35.9  [CONTAINER] RL-1-copywriters IN → 1:39.5 (MELT reveal → lib:melt-equidistant-1 (MELT-transform, 0.84s)): ALREADY GONE (MIKE'S CALL), A $20 A MONTH
        MODEL WRITES THE FIRST DRAFT, BLS: 0% GROWTH, AI NAMED; lands on 'artificial intelligence'
1:35.9  SAY:  "And it names a reason, artificial intelligence."
1:39.5  SAY:  "I used to pay $50 for a thumbnail whenever I wanted a higher quality thumbnail"
1:39.5  [TRANSITION] cover→face cut-in F4 → lib:split-swinging-offset-layout-1x2-2 (face-cut, 0.88s) (face-in: split-swinging-offset)
1:39.5  [FACE] F4 IN → 1:52.2 · [VIDEO-LAYER] F4-higgsfield-bg-swap.mp4 (F4a one 11 s clip + F4b, joined FRAME-exact at 109.467)
        ⚠ Seedance drew a gloved hand at the bottom-left edge ~105.2 and 106.3-106.5 (PROJECT-LOG flag, Mike at the draft)
1:39.5  [CAPTION] ON → 1:52.2 (12.7 s hold, the longest face)
1:44.8  SAY:  "better than what I would normally do."
1:47.5  SAY:  "Because I'm not a graphics guy personally."
1:49.3  [PUNCH-IN] F4 hard ~15-20% step ON the desilencer join 109.300 (frame 3279) → holds to the cut 1:52.2
1:49.3  [GLITCH] F4 random glitch offset / glitch blocks hit ACROSS the same join → lib:glitchoffset-5x (punch-glitch, 0.72s) (punch-glitch)
1:49.4  SAY:  "And I tell you this, I don't pay that anymore."
1:52.1  SAY:  "I make them now myself on one small subscription."
1:52.2  [TRANSITION] face→cover F4 out → lib:blocks-max-2 (face-cut, 0.96s)
1:52.2  [CONTAINER] C8-price-card-s1 IN → 1:57.3: '$50 A THUMBNAIL' struck through in red (no brand on the card)
1:55.2  [CONTAINER] C8-price-card-s2: 'ONE SMALL SUBSCRIPTION' lands under it ON 'one small subscription' (115.16)
1:57.3  [RECEIPT] C10-mike-thumbnail-wall IN → 2:01.0: a fast wall of Mike's own thumbnails (the AE-style multi-image reveal), shown → hand:xfade-scale (container-xfade, 0.35s)
        as an OBJECT ('hundreds of graphics') · [MOTION] lib:motion-3d-pan-1-left · treatment: pan `[VERIFY]` which files
1:57.3  SAY:  "And I could make hundreds of graphics a month if I wanted to."
2:01.0  [DIAGRAM] old-workflow-flow-base IN → 2:09.5: THE OLD WORKFLOW system-design flow BRIEF -> WAIT -> REVISIONS -> INVOICE → hand:xfade-scale (container-xfade, 0.35s)
        (the keyword pops ARE the nodes, one layer; captions n/a)
2:01.0  SAY:  "Think about what that replaced."
2:02.8  SAY:  "The brief, the wait, the revisions, the invoice."
2:03.1  [DIAGRAM] old-workflow-flow-brief: BRIEF struck ON 'brief' (123.08)
2:04.0  [DIAGRAM] old-workflow-flow-wait: WAIT struck ON 'wait' (124.00; never 'weight', the Whisper mishear)
2:04.8  [DIAGRAM] old-workflow-flow-revisions: REVISIONS struck ON 'revisions' (124.82)
2:06.0  [DIAGRAM] old-workflow-flow-invoice: INVOICE struck ON 'invoice' (125.96)
2:06.8  SAY:  "All could have taken days for a single thumbnail going back and forth on a freelance site."
2:07.7  [DIAGRAM] old-workflow-flow-days: the DAYS, BACK AND FORTH loop arrow lights ON 'days' (127.66)
2:09.5  [VIDEO] BR-6-tired-freelancer-laptop IN → 2:12.4 (2.9 s) → hand:fade (broll-fade, 0.50s)
2:12.4  [VIDEO] BR-7-ai-image-resolving IN → 2:15.0 (2.6 s): an image resolving out of noise (re-sourced 2026-10-27, no UI → hand:fade (broll-fade, 0.50s)
        text; PARTIAL match, flag for Mike at the draft)
2:12.4  SAY:  "Now it's a prompt, a few seconds."
2:15.0  [RECEIPT] C9-midjourney-plans IN → 2:20.3: 'Comparing Midjourney Plans' table · [HIGHLIGHT] the Basic $10/month row ON → hand:xfade-scale (container-xfade, 0.35s)
        '$10 a month' · treatment: highlight; shown as 'services like', never as Mike's own subscription `[VERIFY]` Basic $10
2:15.0  SAY:  "And you have services like Midjourney starting at $10 a month."
2:18.4  SAY:  "I don't use Midjourney, but I'm just saying."
2:20.3  [RECEIPT] C7-wef-graphic-designers IN → 2:28.8: WEF Future of Jobs Report 2025, the graphic-designers paragraph · settling → hand:xfade-scale (container-xfade, 0.35s)
        push · [HIGHLIGHT] 'a first-time prediction not seen in previous editions' wipes ON 'fastest declining' (147.36) ·
        treatment: highlight
2:20.3  SAY:  "In 2025, the World Economic Forum put graphic designers just outside of its top 10 fastest"
2:27.9  SAY:  "declining jobs for the first time ever."
2:28.8  [DIAGRAM] wef-editions-timeline-first-time IN → 2:34.0: 2025 EDITION: JUST OUTSIDE THE TOP 10 DECLINING (FIRST TIME) → hand:xfade-scale (container-xfade, 0.35s)
        lit, gold, ON 'for the first time' (148.82)
2:30.9  SAY:  "In the edition before, it had them growing."
2:31.2  [DIAGRAM] wef-editions-timeline-growing: 2023 EDITION: GRAPHIC DESIGNERS GROWING lit ON 'edition before' (151.18)
2:34.0  [CHART] C4b IN → 2:37.2, state C4b-freelance-image-start → hand:xfade-scale (container-xfade, 0.35s)
2:34.0  SAY:  "And freelance posts for image work fell 17% once the image generators showed up."
2:35.7  [CHART] C4b-freelance-image-mid: IMAGE POSTS bar starts to fall ON 'fell' (155.70)
2:36.1  [CHART] C4b-freelance-image-payoff: -17% ON '17' (156.12), manual flat (Demirci et al.)
2:37.2  [CONTAINER] RL-2-graphic-designers IN → 2:39.5 (MELT reveal → lib:melt-equidistant-short-3 (MELT-transform, 0.44s)): ALREADY GONE (MIKE'S CALL), A PROMPT
        REPLACED THE BRIEF, THE WAIT AND THE REVISIONS, WEF: FIRST-TIME DECLINE FLAG
2:39.5  SAY:  "In my book, those jobs are already gone."
2:39.5  [TRANSITION] cover→face cut-in F5 → lib:split-swinging-offset-short-combs-4 (face-cut, 0.48s) (face-in: split-swinging-offset)
2:39.5  [FACE] F5 IN → 2:41.8 · [VIDEO-LAYER] F5-higgsfield-bg-swap.mp4 · captions OFF (2.3 s) · NO [PUNCH-IN] (the only join,
        161.633, sits inside the 0.5 s edge margin)
2:39.5  [HW-SHAKE] CAMERA SHAKE 2 of 2 (hw-camera-shake = lib:motion-shake-optics-3x-long, silent), held for the whole verdict,
        hard on and off with the shot, hardest ON 'gone' (161.58)
2:41.6  [DUCK] VIBE CUT (MUSIC-PLAN hard hit 161.58, the one vibe cut of the video): Bed B drops ~18% ON 'gone' and rides
        straight into its 0.4 s card fade (Bed B is in its env-7 plateau, file 88.6-90.9, no drop in the file); the bigger
        hit is the CH3 card impact 0.3 s later (below), so the verdict lands as hit + silence + card
2:41.8  [TRANSITION] face→cover F5 out → lib:glass-blocks-2-horizontal (face-cut, 0.84s) (owned by the chapter SPLIT move)
```

## CH3 - NEXT: VIDEO EDITORS (2:41.9-3:35.3, Bed C, card ON)
```
2:41.9  [CARD] CH3 title card "NEXT ON THE LIST" · [IMPACT] Impact_Hit_01-1 vibe-cut hit (below)
        (title-CH3.png; edit-time pause >= 1 s at the trough 161.88, measured -91 dB) ·
        [TRANSITION] chapter SPLIT move → rmn:cube (card, 0.60s) ·
        [IMPACT] the VIBE-CUT hit: Impact_Hit_01-1 (Impacts/Impact_Hit_01-1.wav, mood_class epic; measured peak 0.19 s, -40 dB
        4.85 s after it) FILE START 161.69, peak ON the card frame 161.88; ~0.55 gain; its long wash rings through the card pause
        under Bed C's quietest intro (env 0-3) into 'Next, video editors'
2:41.9  [MUSIC] Bed C `leatherface` (Wicked_Cinema_Leatherface_instrumental_4_22.mp3) from file 0, -26.0 dB (-17 under), fade-in
        0.6 s, breath 0.5 s inside the card pause; ONE placement through CH6 (no restart at the cardless SPLIT moves), REMIX loop
        bars 16-30 (56.471-105.882 s) x1, the seam under CLIP-3 → 7:18.8
2:41.9  [IMAGE] IMG-7-edit-bay IN → 2:45.7 (scary-pack still ingress → rmn:cube (card, 0.60s)); purple accent
2:42.0  SAY:  "Next, video editors."
2:43.7  SAY:  "And I know this one from the inside."
2:45.4  SAY:  "With AI in my editing process, I get the job done in about a fifth of the amount of time"
2:45.7  [TRANSITION] cover→face cut-in F6 → lib:split-swinging-offset-layout-2x1-1 (face-cut, 0.88s) (face-in: split-swinging-offset)
2:45.7  [FACE] F6 IN → 2:51.8 · [VIDEO-LAYER] F6-higgsfield-bg-swap.mp4 · NO [PUNCH-IN] (the only join, 171.633, is inside the
        edge margin)
2:45.7  [CAPTION] ON → 2:51.8 (6.2 s hold), OFF under the pop (169.8-171.4)
2:49.8  [HW-POP] hw-word-pop 'A FIFTH OF THE TIME' ON 'a fifth' (169.84), hard-cut at 171.4 (silent device)
2:51.2  SAY:  "that I used to."
2:51.8  [TRANSITION] face→cover F6 out → lib:blocks-max-2 (face-cut, 0.96s)
2:51.8  [VIDEO] BR-8-studio-light-on IN → 2:53.9 (2.1 s): a dark soundstage, the lights bang on one by one
2:52.0  SAY:  "And the studios are doing it too."
2:53.9  [RECEIPT] R2-netflix-q2-2025 IN → 2:58.2: the Netflix Q2 2025 earnings interview watch page (title + date) shown as an → hand:xfade-scale (container-xfade, 0.35s)
        OBJECT that names the source · [MOTION] lib:motion-3d-orbit-1-t-right · treatment: pan
2:53.9  SAY:  "Here's Netflix on its July 2025 earnings interview."
2:58.2  [RECEIPT] CLIP-5 LEAD-IN → 3:01.2: CLIP-5-netflix-vfx-10x-faster.mp4 FIRST frame held, strap 'Netflix earnings interview, → hand:xfade-scale (container-xfade, 0.35s)
        July 2025' · treatment: push `[VERIFY]` the speaker on the frame
2:58.2  SAY:  "About a scene in its own series, El Eternauta."
3:01.2  [INSERT] CLIP-5 SPLICED CLIP, 9.2 s: the spine PAUSES at the trough after "...its own series, El Eternauta." (splice_at
        181.24, snapper trough 181.23-181.54, snaps to 181.32) and assets/clip-inserts/CLIP-5-netflix-vfx-10x-faster.mp4 plays
        FULL-FRAME with Netflix's OWN voice (co-CEO per coverage); Bed C ducks -14 dB automatically ·
        [TRANSITION] insert-in / insert-out = scary-pack stinger → hand:fade (insert-in, 0.50s) (bucket insert)
3:01.2  [RECEIPT] CLIP-5 LEAD-OUT → 3:03.4: the clip's LAST frame held under 'That was a visual effects shot' · treatment: push
3:01.7  SAY:  "That was a visual effects shot, not an edit."
3:03.4  [RECEIPT] C13-adobe-premiere-generative-extend IN → 3:10.0: Adobe blog 2025-04-02, Premiere Pro 25.2 'Generative Extend → hand:xfade-scale (container-xfade, 0.35s)
        in 4K' (the article as an OBJECT, the line does not quote it) · [MOTION] lib:motion-3d-offset-2-right-up · treatment: pan
3:04.8  SAY:  "But it's in the same post-production pipeline."
3:07.9  SAY:  "And it's only getting faster."
3:10.0  [RECEIPT] R3-bls-editors IN → 3:15.3: BLS OOH film and video editors, the counterweight · push to the '4%' outlook figure → hand:xfade-scale (container-xfade, 0.35s)
        ON '4%' · treatment: push (a figure read off the panel)
3:10.0  SAY:  "Here's the thing."
3:11.3  SAY:  "The government still projects editor jobs to grow about 4%."
3:15.3  [CONTAINER] RL-3-video-editors IN → 3:21.3 (SPIN reveal → lib:spin-shake-1x-cw (SPIN-newfacet, 1.04s)): 18 MONTHS (MIKE'S CALL), A FIFTH OF THE TIME,
        WITH AI, counterweight strip BLS: 39,400 EDITORS, PLUS 4 PERCENT TO 2035
3:15.3  SAY:  "I think that's wrong."
3:17.0  SAY:  "From what I see in my own editing process, I give this job 18 months."
3:21.3  [VIDEO] BR-9-hand-grading-console-purple IN → 3:25.2 (3.9 s): a hand on an editing jog wheel, purple glow → hand:fade (broll-fade, 0.50s)
3:21.3  SAY:  "I do believe there is going to be a demand for a human touch in the editing process."
3:25.2  [CONTAINER] human-touch-card-s1 IN → 3:33.0: THE HUMAN TOUCH (MIKE'S CALL): THE JOB MIGHT NOT ENTIRELY DISAPPEAR, purple → hand:xfade-scale (container-xfade, 0.35s)
3:27.2  SAY:  "So the job might not entirely disappear."
3:29.8  SAY:  "But new jobs in that field will be just so rare that you might as well just call it dead."
3:32.2  [CONTAINER] human-touch-card-s2: NEW JOBS IN THE FIELD: SO RARE lands ON 'rare' (212.23)
3:33.0  [VIDEO] BR-10-ekg-flatline IN → 3:35.3 (2.3 s): a heart monitor line going flat, horror beat into the SPLIT move → hand:fade (broll-fade, 0.50s)
```

## CH4 - NEXT: ACTORS AND MODELS (3:35.3-4:36.6, Bed C, card OFF)
```
3:35.3  [TRANSITION] chapter SPLIT move, NO card (Bed C continues) → lib:glass-blocks-2-horizontal (scene-cut, 0.84s)
3:35.3  [IMAGE] IMG-8-mannequins IN → 3:39.2 (scary-pack still ingress → lib:glass-blocks-2-horizontal (scene-cut, 0.84s))
3:35.3  [MUSIC] Bed C continues (same placement, sample-continuous, no breath): the mid bed's upper half, env 5-6
3:35.3  SAY:  "Now, actors and models."
3:37.6  SAY:  "This is where it gets creepy."
3:39.2  [RECEIPT] R4-particle6-sketch IN → 3:42.9: Particle6's 'AI Commissioner' watch page (title, Tilly Norwood channel, → hand:xfade-scale (container-xfade, 0.35s)
        2025-07-30) shown as an OBJECT · [MOTION] lib:motion-3d-pan-2-left · treatment: pan `[VERIFY]`
3:39.2  SAY:  "This is a comedy sketch from July of 2025."
3:42.0  SAY:  "Made by an AI studio called Particle6."
3:42.9  [RECEIPT] CLIP-4 LEAD-IN → 3:44.9: CLIP-4-particle6-sketch-tilly.mp4 FIRST frame held, strap 'Particle6 comedy sketch, July → hand:xfade-scale (container-xfade, 0.35s)
        2025: every person on screen is AI-generated' · treatment: push
3:44.9  [INSERT] CLIP-4 SPLICED CLIP, 10.1 s: the spine PAUSES at the trough after "...an AI studio called Particle6." (splice_at
        224.91, snapper trough 224.63-224.98, snaps to 224.905) and assets/clip-inserts/CLIP-4-particle6-sketch-tilly.mp4 plays
        FULL-FRAME with the sketch's OWN voices; Bed C ducks -14 dB automatically ·
        [TRANSITION] insert-in / insert-out = scary-pack stinger → hand:fade (insert-in, 0.50s) (bucket insert)
3:44.9  [RECEIPT] CLIP-4 LEAD-OUT → 3:47.8: the sketch's LAST frame freezes, desaturates and glitches under 'Nobody is real in
        that clip' · treatment: push
3:45.2  SAY:  "Nobody is real in that clip."
3:46.8  SAY:  "Not the faces, not the voices, not the actresses, and not the actress they're talking about."
3:47.8  [VIDEO] BR-11-face-mesh-scan IN → 3:50.3 (2.5 s): a face wireframe scanning and morphing → hand:fade (broll-fade, 0.50s)
3:50.3  [DIAGRAM] C14-tilly-timeline-base IN → 3:57.4: the four rungs dim (JUL 2025 / SEP 2025 / SEP 30 2025 / JUL 2026), purple → hand:xfade-scale (container-xfade, 0.35s)
3:52.6  [DIAGRAM] C14-tilly-timeline-sketch: JUL 2025: THE SKETCH lit ON 'Tilly Norwood' (232.55)
3:52.6  SAY:  "Tilly Norwood."
3:53.6  [DIAGRAM] C14-tilly-timeline-zurich: SEP 2025: ZURICH lit ON 'Two months later' (233.57; 'Zurich Summit' itself falls
        in the CLIP-3 lead-in); the SAG-AFTRA and MISALIGNED rungs stay dim (the receipts carry them)
3:53.6  SAY:  "Two months later, her creator, Eline Van der Velden, presented Tilly at the Zurich Summit."
3:57.4  [RECEIPT] CLIP-3 LEAD-IN → 3:59.1: CLIP-3-van-der-velden-agency.mp4 FIRST frame held, strap 'Eline Van der Velden, → hand:xfade-scale (container-xfade, 0.35s)
        creator of AI actress Tilly Norwood, Zurich Summit, September 2025' · treatment: push
3:59.1  [INSERT] CLIP-3 SPLICED CLIP, 11.9 s: the spine PAUSES at the trough after "...presented Tilly at the Zurich Summit."
        (splice_at 239.11, snapper trough 239.05-239.37, snaps to 239.30) and assets/clip-inserts/CLIP-3-van-der-velden-agency.mp4
        plays FULL-FRAME with her OWN voice; Bed C ducks -14 dB automatically (the Bed C loop seam, paused 105.88, falls inside
        this duck) · [TRANSITION] insert-in / insert-out = scary-pack stinger → hand:fade (insert-in, 0.50s) (bucket insert)
3:59.1  [RECEIPT] CLIP-3 LEAD-OUT → 4:01.7: the clip's LAST frame held under 'The actors union fired back' · treatment: push
3:59.4  SAY:  "The actors union fired back and said she's not an actor."
4:01.7  [RECEIPT] R5-nbc-sag-aftra IN → 4:06.4: the NBC News composite (headline + date/byline band over the SAG-AFTRA paragraph) → hand:xfade-scale (container-xfade, 0.35s)
        · [HIGHLIGHT] 'a character generated by a computer program' ON 'character' (4:03.6) · treatment: highlight `[VERIFY]`
4:03.6  SAY:  "She's a character generated by a computer program."
4:06.4  [RECEIPT] C15-deadline-misaligned IN → 4:12.9: Deadline headline 'AI Actor Tilly Norwood To Star In Feature Film → hand:xfade-scale (container-xfade, 0.35s)
        Misaligned' shown as an OBJECT (the line paraphrases it) · [MOTION] lib:motion-3d-orbit-2-right-down · treatment: pan
4:06.4  SAY:  "And in July, Particle6 announced a feature film with Tilly in the lead."
4:11.2  SAY:  "It's in development."
4:12.9  [TRANSITION] PUMPKIN transition 2 of 3 into the slideshow (`scary-pumpkin-fire` or `scary-6-normal75`) → lib:scary-6 (scene-cut, 1.24s)
4:12.9  [HW-MONTAGE] hw-blood-promo (the reference 1:27 After-Effects slideshow: hw-split-panels carry the REAL images, one
        hw-blood-title per brand on its name) → 4:26.5; silent device; Bed C holds flat under it (MUSIC-PLAN open question 5)
4:12.9  [RECEIPT] C16-1-hm-ai-twins IN → 4:18.8: panel 1, FashionUnited's real H&M AI-twins image + headline, March 2025 ·
        treatment: push (the montage carries the motion)
4:12.9  SAY:  "And the models?"
4:14.1  SAY:  "H&M signed up 30 real models to be cloned into AI twins."
4:18.8  [RECEIPT] C16-2-guess-vogue-ai-models IN → 4:21.9: panel 2, ABC7's real Guess AI-model ad in Vogue, August 2025 ·
        treatment: push
4:18.8  SAY:  "Guess ran AI-generated models in Vogue."
4:21.9  [RECEIPT] C16-3-coke-ad.mp4 IN → 4:26.5: panel 3, Coca-Cola 2025 'Holidays Are Coming' AI ad frames, MUTED (the jingle
        never plays) · treatment: push (a recording that already moves)
4:21.9  SAY:  "And Coca-Cola made its holiday ad with AI two years in a row."
4:26.5  [RECEIPT] R6-marketingweek-coke IN → 4:29.7: Marketing Week on Coca-Cola's AI ad · [HIGHLIGHT] 'a tenth of what it would → hand:xfade-scale (container-xfade, 0.35s)
        have cost' ON 'tenth' (268.25) · treatment: highlight `[VERIFY]`
4:26.5  SAY:  "And says the first one cost a tenth of what it used to."
4:29.7  [RECEIPT] C18-caixin-ai-movie IN → 4:33.8: Caixin 'Bona Film Wins Approval for China's First AI Movie in Theaters' · → hand:xfade-scale (container-xfade, 0.35s)
        [HIGHLIGHT] 'China's First AI Movie in Theaters' ON 'first' (272.07) · treatment: highlight
4:29.7  SAY:  "And in April, China approved its first AI-made feature film for cinemas."
4:33.8  [CONTAINER] RL-4-actors-models IN → 4:36.6 (SPIN reveal → lib:spin-shake-2x-ccw (SPIN-newfacet, 1.00s)): HIGH (MIKE'S CALL), H&M: 30 REAL MODELS
        SIGNED UP TO BE CLONED, AN AI ACTRESS WITH A FILM IN DEVELOPMENT
4:35.0  SAY:  "90 minutes long."
```

## CH5 - UNIVERSITIES (4:36.6-5:32.9, Bed C, card OFF)
```
4:36.6  [TRANSITION] chapter SPLIT move, NO card (Bed C continues) → lib:glass-blocks-2-horizontal (scene-cut, 0.84s)
4:36.6  [VIDEO] BR-12-campus-night-columns IN → 4:40.3 (3.6 s): an empty campus at night, cold moonlight; cyan accent
4:36.6  [MUSIC] Bed C continues (same placement): the end of the env-5 mid bed
4:36.6  SAY:  "Now, universities."
4:38.4  SAY:  "And I see two arguments against them."
4:40.3  [CONTAINER] arg-1-information IN → 4:42.7: '1. THE INFORMATION' as its own full-frame card (the keyword pop IS the → hand:xfade-scale (container-xfade, 0.35s)
        cover, hw-word-pop motion ON 'One' 280.29), cyan
4:40.3  SAY:  "One, the information."
4:42.7  [VIDEO] BR-13-phone-chat-dark IN → 4:46.4 (3.8 s): a chat window answering line by line on a phone (generic UI, no brand) → hand:fade (broll-fade, 0.50s)
4:42.7  SAY:  "Everything a lecture hall teaches, a $20-a-month model will explain."
4:46.4  [VIDEO] BR-14-clock-3am IN → 4:50.0 (3.6 s): an alarm clock flipping to 3:00 AM → hand:fade (broll-fade, 0.50s)
4:46.8  SAY:  "At three in the morning, as many times as you need."
4:50.0  [IMAGE] IMG-9-campus-quad IN → 4:52.4 (scary-pack still ingress → lib:scary-6-normal75 (glitch-still, 1.24s)) · [HW-POP] hw-word-pop '2. THE JOBS'
        ON 'Two' (290.01), silent
4:50.0  SAY:  "Two, what are you even preparing for?"
4:52.4  [RECEIPT] C20-nyfed-recent-grads IN → 4:57.7: NY Fed 'The Labor Market for Recent College Graduates' · push to the 5.6 → hand:xfade-scale (container-xfade, 0.35s)
        unemployment figure ON '5.6%' (295.05) · treatment: push `[VERIFY]` quarterly numbers at render
4:52.4  SAY:  "Recent college grads are already at around 5.6% unemployed."
4:56.2  [MUSIC] MUSIC-PLAN hard hit 296.2: Bed C drops into the Leatherface LOW BUILD [116,138] (env 2-4) for 296-318, the
        quieter stretch under the numbers · [DOWNSHIFTER] downshifter-slow-downlifter-3 (downshifters/downshifter-slow-
        downlifter-3.wav, mood_class tense; measured peak 1.77 s, -40 dB 7.29 s after it) file start 294.43 so the sweep peaks ON
        the drop at 296.2 and drains away by 303.5 (energy draining with the bed); seated far under the VO (~-28 under, tune by
        ear, the numbers must stay clean; MIX GAIN -24 dB, Mike 2026-10-27: added back after the mixer misread the wrapped name)
4:57.7  [CONTAINER] C19-university-card-s1 IN → 5:11.9: one row at a time, cyan; row 1 '42% IN JOBS THAT DON'T NEED A DEGREE' → hand:xfade-scale (container-xfade, 0.35s)
        lights ON '42' (298.09)
4:57.7  SAY:  "And 42% of them are working in jobs that don't need a degree."
5:02.0  SAY:  "Meanwhile, private university runs around $45,000 a year in tuition alone."
5:04.3  [CONTAINER] C19-university-card-s2: 'PRIVATE TUITION: $45K A YEAR' ON '$45,000' (304.33)
5:07.3  SAY:  "That's $180,000 over four years before the dorm."
5:07.9  [CONTAINER] C19-university-card-s3: '4 YEARS: $180K, TUITION ALONE' ON '$180,000' (307.93)
5:11.9  [RECEIPT] R7-nyfed-hhdc IN → 5:16.5: NY Fed Household Debt and Credit 2026:Q2 · push to '$1.65 trillion' ON '1.65' → hand:xfade-scale (container-xfade, 0.35s)
        (313.03) · treatment: push `[VERIFY]` the 2026:Q3 report lands in November
5:11.9  SAY:  "And Americans owe $1.65 trillion in student loans."
5:16.5  [RECEIPT] R8-nsc-enrollment IN → 5:21.9: National Student Clearinghouse fall 2025 · [HIGHLIGHT] computer science 'declined → hand:xfade-scale (container-xfade, 0.35s)
        across all award and institution types' ON 'falling at every level' · treatment: highlight `[VERIFY]`
5:16.5  SAY:  "Now, people are still enrolling."
5:18.6  SAY:  "But computer science enrollment is falling at every level."
5:21.9  [RECEIPT] C21-restofworld-china-universities IN → 5:25.6: Rest of World · [HIGHLIGHT] the survey sentence (cutting language → hand:xfade-scale (container-xfade, 0.35s)
        and translation majors, adding AI) ON 'cutting' · treatment: highlight (no 12,000 figure)
5:21.9  SAY:  "And in China, universities are cutting language and translation programs."
5:25.6  [CONTAINER] RL-5-university-jobs IN → 5:28.4 (SPIN reveal → lib:spin-shake-short-1x-cw (SPIN-newfacet, 0.52s)): 3 TO 5 YEARS (MIKE'S CALL), THE INFORMATION
        IS A 20 DOLLAR MODEL; THE JOBS AT THE END ARE SHRINKING (before FACE 7: no slot after it)
5:26.7  SAY:  "And adding AI majors."
5:28.4  [TRANSITION] cover→face cut-in F7 → lib:split-swinging-offset-short-layout-1x2-2 (face-cut, 0.48s) (face-in: split-swinging-offset)
5:28.4  [FACE] F7 IN → 5:32.7 · [VIDEO-LAYER] F7-higgsfield-bg-swap.mp4 (the window includes the restored 'nothing') · captions
        OFF (4.4 s); no shake (the two shakes are spent)
5:28.4  SAY:  "If there's no job at the end of it, those four years, buy you nothing."
5:32.1  [PUNCH-IN] F7 hard ~15-20% step ON the desilencer join 332.100 → holds to the cut 5:32.7
5:32.1  [GLITCH] F7 random glitch offset / glitch blocks hit ACROSS the same join → lib:blocks-strips-2x (punch-glitch, 0.40s) (punch-glitch)
5:32.7  [TRANSITION] face→cover F7 out = chapter SPLIT move into CH6, NO card (Bed C continues) → lib:glass-blocks-2-horizontal (face-cut, 0.84s)
5:32.7  [CONTAINER] ch6-four-skeletons IN → 5:38.5: four empty risk-level skeletons (BOOKKEEPERS, ACCOUNTANTS, PARALEGALS,
        LAWYERS) on one dark container, the chapter's one overview (OVERVIEW_REFS)
```

## CH6 - ACCOUNTANTS AND LAWYERS: THE RISK LEVELS (5:32.9-7:18.8, Bed C, card OFF)
```
5:32.9  [MUSIC] Bed C continues (same placement): the env-6 mid build under the overview, bookkeepers, accountants and RL-7
5:32.9  SAY:  "Now, the jobs Suleyman named first."
5:35.4  SAY:  "Lawyers and accountants."
5:36.7  SAY:  "One card at a time."
5:38.5  [VIDEO] BR-15-adding-machine-tape IN → 5:42.2 (3.6 s): ledgers and an adding machine under one lamp → hand:fade (broll-fade, 0.50s)
5:38.5  SAY:  "Bookkeepers first."
5:39.8  SAY:  "There are around 1.5 million of them."
5:42.2  [RECEIPT] R9-bls-bookkeepers IN → 5:49.9: BLS OOH bookkeeping clerks, the -6% outlook · [HIGHLIGHT] 'Software innovations → hand:xfade-scale (container-xfade, 0.35s)
        have automated many of the tasks' ON 'software' · treatment: highlight
5:42.7  SAY:  "And the government projects that job to shrink around 6%"
5:46.7  SAY:  "because software already automated a lot of it."
5:49.9  [CONTAINER] RL-6-bookkeepers IN → 5:52.4 (MELT reveal ON 'shrinking now' 350.71 → lib:melt-equidistant-short-1 (MELT-transform, 0.44s)): BOOKKEEPING CLERKS
        1,532,400, -6% TO 2035, SOFTWARE ALREADY AUTOMATED MANY OF THE TASKS, SHRINKING NOW
5:49.9  SAY:  "Risk level shrinking now."
5:52.4  [RECEIPT] R10-goldman-2025 IN → 5:58.9: Goldman Sachs 2025-08-13 'How will AI affect the global workforce' · [HIGHLIGHT] → hand:xfade-scale (container-xfade, 0.35s)
        the higher-risk occupations sentence (accountants and auditors) ON 'higher risk list' · treatment: highlight `[VERIFY]`
5:52.4  SAY:  "Accountants and auditors."
5:54.0  SAY:  "Around 1.6 million."
5:56.1  SAY:  "Goldman Sachs put them on its higher risk list."
5:58.9  [RECEIPT] R11-accountancyage-kpmg IN → 6:06.7: the KPMG UK graduate intake (captured from Business Matters, 2025-06-25; → hand:xfade-scale (container-xfade, 0.35s)
        file name kept) · [HIGHLIGHT] '1,399' then '942' ON '1,399' / '942' · treatment: highlight (no 29 percent)
5:58.9  SAY:  "And KPMG in the UK had its graduate intake from 1,399 down to 942."
6:06.7  [CONTAINER] RL-7-accountants IN → 6:15.0 (MELT reveal → lib:melt-equidistant-2 (MELT-transform, 0.84s)): ACCOUNTANTS AND AUDITORS 1,595,200, GOLDMAN:
        HIGHER-RISK LIST, KPMG UK GRAD INTAKE 1,399 TO 942, ENTRY LEVEL FIRST, 12 TO 18 MONTHS (SULEYMAN) ⚠ open flag: keep
        Suleyman's name or MIKE'S CALL
6:06.7  SAY:  "With AI, one of the reasons."
6:09.1  SAY:  "Risk level, entry level jobs go first."
6:12.1  SAY:  "On Suleyman's 12 to 18 month clock."
6:15.0  [VIDEO] BR-16-desk-lamp-office-night IN → 6:18.9 (3.9 s): stacks of legal files on a paralegal's desk, one lamp → hand:fade (broll-fade, 0.50s)
6:15.0  SAY:  "Paralegals, 404,000."
6:16.2  [DUCK] MUSIC-PLAN hard hit 376.2: Bed C enters the Leatherface HIGH PEAK [196,262] (env 7-8, measured -10.8 LUFS) and
        holds under RL-8, the Goldman bars, Harvey, PAPERWORK and RL-9; automation -3.0 dB relative, 2 s ramp, 376.2 → 438.95, so
        the risk-card narration stays ~17 under; no SFX here (the bed is the move)
6:17.6  SAY:  "Zero growth."
6:18.9  [RECEIPT] R12-bls-paralegals IN → 6:22.9: BLS OOH paralegals, 0% · [HIGHLIGHT] 'demand for these workers is expected to → hand:xfade-scale (container-xfade, 0.35s)
        be limited by advances in technology, including artificial intelligence (AI)' ON 'names AI' · treatment: highlight
6:18.9  SAY:  "Again, the government names AI as what's holding it back."
6:22.9  [CONTAINER] RL-8-paralegals IN → 6:25.6 (MELT reveal ON 'stalled' 384.81 → lib:melt-equidistant-short-4 (MELT-transform, 0.44s)): PARALEGALS AND LEGAL
        ASSISTANTS 404,900 (the BLS figure, never the spoken 404,000), 0% TO 2035, AI NAMED, STALLED
6:23.5  SAY:  "Risk level, stalled."
6:25.6  [CHART] C22 IN → 6:36.0, state C22-goldman-exposure-start: header LAWYERS: 863,700 (BLS) → hand:xfade-scale (container-xfade, 0.35s)
6:25.6  SAY:  "And lawyers, 863,700."
6:29.4  [CHART] C22-goldman-exposure-mid: the four exposure bars draw ON 'Back in 2023' (389.45), OFFICE AND ADMIN 46,
        LEGAL 44, CONSTRUCTION 6, MAINTENANCE 4
6:29.4  SAY:  "Back in 2023, Goldman estimated 44% of legal tasks could be automated by AI."
6:32.3  [CHART] C22-goldman-exposure-payoff: LEGAL 44 lit ON '44' (392.29), the rest dark; source line Goldman Sachs 2023
6:36.0  [RECEIPT] R13-harvey-blog IN → 6:43.6: Harvey's own blog 2026-09-09 · [HIGHLIGHT] the 80 percent of Am Law 100 line ON → hand:xfade-scale (container-xfade, 0.35s)
        '80%' · treatment: highlight (a company claim, said as 'Harvey says') `[VERIFY]`
6:36.0  SAY:  "And Harvey, a legal AI company, says that 80% of the top 100 US law firms already use it."
6:43.6  [VIDEO] BR-17-empty-courtroom IN → 6:47.5 (3.9 s): an empty courtroom at night, moonlight on the benches → hand:fade (broll-fade, 0.50s)
6:43.6  SAY:  "And here's what people tend to miss."
6:45.6  SAY:  "When you picture a lawyer, you picture a courtroom."
6:47.5  [DIAGRAM] legal-work-diagram-courtroom IN → 6:54.5: LEGAL WORK system-design, the small COURTROOM box lit ON 'courtroom' → hand:xfade-scale (container-xfade, 0.35s)
        (407.73), cyan, no number
6:48.5  SAY:  "But a lot of legal work never sees a judge."
6:49.6  [DIAGRAM] legal-work-diagram-never-sees-a-judge: the big NEVER SEES A JUDGE box lights ON 'never' (409.63)
6:51.5  SAY:  "It's a lawyer working for a company drafting contracts,"
6:53.7  [DIAGRAM] legal-work-diagram-contracts: DRAFTING CONTRACTS fills the big box ON 'contracts' (413.65)
6:54.5  [VIDEO] BR-18-fountain-pen-fine-print IN → 6:58.2 (3.7 s): a pen over the fine print under a desk lamp → hand:fade (broll-fade, 0.50s)
6:54.5  SAY:  "reviewing agreements, writing the fine print that nobody reads."
6:58.2  [IMAGE] IMG-10-paper-particles IN → 7:02.1 (scary-pack still ingress → lib:scary-6 (glitch-still, 1.24s)): legal paper dissolving into
        cyan particles
6:58.2  SAY:  "That's paperwork."
6:58.6  [HW-POP] hw-word-pop 'PAPERWORK' ON 'paperwork' (418.63), hard-cut at 419.8 (silent device)
6:59.4  SAY:  "And paperwork is exactly what AI eats."
7:02.1  [RECEIPT] C26-bls-lawyers-outlook IN → 7:07.7: BLS OOH lawyers, the counterweight · push to the '+5%' outlook figure ON → hand:xfade-scale (container-xfade, 0.35s)
        'still growing' (425.45) · treatment: push (the line paraphrases, the figure is read off the panel)
7:02.1  SAY:  "Now, on paper, lawyer jobs are still growing, but the work changes."
7:07.7  [CONTAINER] RL-9-lawyers IN → 7:13.3 (SPIN reveal → lib:spin-shake-1x-ccw (SPIN-newfacet, 1.04s)): LAWYERS 863,700, LEGAL TASKS 44 PERCENT EXPOSED
        (GOLDMAN 2023), HARVEY SAYS 80 PERCENT OF THE TOP 100 FIRMS, THE WORK CHANGES FIRST (430.63), MIKE'S CALL line
7:07.7  SAY:  "And in my book, the headcount follows."
7:10.6  SAY:  "Risk level, the work changes first."
7:13.3  [TRANSITION] cover→face cut-in F8 → lib:split-swinging-offset-combs-3 (face-cut, 0.88s) (face-in: split-swinging-offset)
7:13.3  [FACE] F8 IN → 7:18.7 · [VIDEO-LAYER] F8-higgsfield-bg-swap.mp4 · no shake (the two shakes are spent)
7:13.3  [CAPTION] ON → 7:18.7 (5.5 s hold)
7:13.4  SAY:  "If your job is reading documents and writing documents, then your job is on this list."
7:14.2  [MUSIC] MUSIC-PLAN hard hit 434.2: Leatherface's final strike (file 254.0) lands here, on the F8 verdict; decay under the
        rest of the line, the bed out on the THE FLIP SIDE card (0.4 s fade). No added SFX: the bed's own strike IS the hit
        (its position depends on the baked pause + insert lengths: confirm with mix_music.py --dry-run)
7:18.0  [PUNCH-IN] F8 hard ~15-20% step ON the desilencer join 438.033 → holds to the cut 7:18.7
7:18.0  [GLITCH] F8 random glitch offset / glitch blocks hit ACROSS the same join → lib:glitchoffset-1x (punch-glitch, 0.40s) (punch-glitch)
7:18.7  [TRANSITION] face→cover F8 out → lib:glass-blocks-2-horizontal (face-cut, 0.84s) (owned by the chapter SPLIT move)
```

## CH7 - HEALTHCARE GETS CHEAPER (7:18.8-9:07.4, Bed D, card ON)
```
7:18.8  [CARD] CH7 title card "THE FLIP SIDE" · [IMPACT] card-impact-layered (below)
        (title-CH7.png; edit-time pause >= 1 s at the trough 438.78, zero spine time) ·
        [TRANSITION] chapter SPLIT move → rmn:cube (card, 0.60s) ·
        [IMPACT] card-impact-layered (Impacts/card-impact-layered.wav, mood_class epic; measured peak 0.03 s, -40 dB 1.14 s after
        it) FILE START 438.75, peak ON the card frame; the lightest card hit, it opens the one hopeful chapter
7:18.8  [MUSIC] Bed D `a-most-unusual-discovery` (Wicked_Cinema_A_Most_Unusual_Discovery_instrumental_3_05.mp3) from file 0,
        -28.2 dB (-18 under), fade-in 0.6 s, breath 0.6 s inside the card pause; automation +5.0 dB relative lift 438.95 → 476.0,
        3 s ramp (the file's intro measures -23.4 LUFS) → 9:07.4
7:18.8  [IMAGE] IMG-11-hospital-corridor IN → 7:22.2 (scary-pack still ingress → rmn:cube (card, 0.60s)): green light, hopeful, no gore
7:18.9  SAY:  "Okay, so here's the flip side."
7:21.0  SAY:  "And it's a big one."
7:22.2  [TRANSITION] cover→face cut-in F9 → lib:split-swinging-offset-short-combs-2 (face-cut, 0.48s) (face-in: split-swinging-offset)
7:22.2  [FACE] F9 IN → 7:27.5 · [VIDEO-LAYER] F9-higgsfield-bg-swap.mp4
7:22.2  [CAPTION] ON → 7:27.5 (5.4 s hold)
7:22.3  SAY:  "The real cost of healthcare is people needing it."
7:24.9  SAY:  "But if you don't get sick, you don't need to pay."
7:26.8  [PUNCH-IN] F9 hard ~15-20% step ON the desilencer join 446.767 → holds to the cut 7:27.5
7:26.8  [GLITCH] F9 random glitch offset / glitch blocks hit ACROSS the same join → lib:blocks-strips-4x (punch-glitch, 0.40s) (punch-glitch)
7:27.5  [TRANSITION] face→cover F9 out → lib:blocks-max-2 (face-cut, 0.96s)
7:27.5  [CONTAINER] C27-last-30-days-s1 IN → 7:30.0: THE LAST 30 DAYS dated list card opens empty, date column ready (DARK, green);
        C27 is ONE progressive list, a deliberate build (declared for the CONTAINER SCATTER warn)
7:27.8  SAY:  "Look at just the last 30 days."
7:30.0  [CONTAINER] C27-last-30-days-s2 → 7:32.7: item 1 'OCT 8: FIRST HUMAN DATA, A REJUVENATION THERAPY (3 PATIENTS, EYE)'
        ON 'On October 8th' (449.99)
7:30.0  SAY:  "On October 8th, a rejuvenation therapy reported its first human results."
7:32.7  [RECEIPT] C31-life-bio-er100-release IN → 7:34.7: Life Biosciences ER-100 first-in-human release header, a 2 s flash · → hand:xfade-scale (container-xfade, 0.35s)
        treatment: push
7:34.7  [CONTAINER] C27-last-30-days-s3 → 7:42.6: item 2 'OCT 12: RICE-GRAIN-LENGTH HEART ROBOTS (LAB STAGE)' ON 'On October → hand:xfade-scale (container-xfade, 0.35s)
        12th' (454.67); holds through the antibiotics line (the C29 receipt could not be captured, PROJECT-LOG 2026-10-26)
7:34.7  SAY:  "On October 12th, Johns Hopkins showed robots around the length of a grain of rice."
7:39.4  SAY:  "They carry antibiotics straight to an infected heart."
7:42.6  [CONTAINER] weeks-to-a-day-card-s1 IN → 7:47.4: IF THEY WORK IN PEOPLE (the conditional on top): 4 TO 6 WEEKS OF → hand:xfade-scale (container-xfade, 0.35s)
        TREATMENT, green
7:42.6  SAY:  "If they work in people, four to six weeks of treatment could become a single day."
7:46.5  [CONTAINER] weeks-to-a-day-card-s2: -> A SINGLE DAY lands ON 'single day' (466.53)
7:47.4  [CONTAINER] C27-last-30-days-s4 → 7:50.9: item 3 'OCT 19: FDA, A RECTAL-CANCER IMMUNOTHERAPY (ONE TUMOR TYPE)' ON 'On → hand:xfade-scale (container-xfade, 0.35s)
        October 19th' (467.35); never 'cured'
7:47.4  SAY:  "On October 19th, an immunotherapy where, for one type of rectal cancer,"
7:50.9  [RECEIPT] C28-a-fda-jemperli IN → 7:56.9: the FDA press release 2026-10-19, Jemperli (dostarlimab), shown as an OBJECT → hand:xfade-scale (container-xfade, 0.35s)
        (the line does not quote it; the dMMR / MSI-H line stays legible) · [MOTION] lib:motion-3d-orbit-2-left-up ·
        treatment: pan `[VERIFY]`
7:53.4  SAY:  "most patients skip surgery, chemo, and radiation."
7:56.9  [CONTAINER] C27-last-30-days-s5 → 8:02.4: item 4 'OCT 20: FDA, FIRST-OF-ITS-KIND HEPATITIS B DRUG' ON 'On October 20th' → hand:xfade-scale (container-xfade, 0.35s)
        (476.95); no cure wording
7:56.9  [MUSIC] MUSIC-PLAN hard hit 476.95: Bed D's BUILD [38,44] begins exactly on 'On October 20th', first peak from 482.95;
        the +5 dB intro lift has ramped out; no SFX (the bed is the move)
7:56.9  SAY:  "On October 20th, the first drug of its kind in chronic hepatitis B,"
8:02.4  [RECEIPT] C28-b-fda-hibsago IN → 8:07.9: the FDA press release 2026-10-20, Hibsago (bepirovirsen) · [HIGHLIGHT] the → hand:xfade-scale (container-xfade, 0.35s)
        24-weeks-off-treatment line ON 'stop treatment' (484.41) · treatment: highlight `[VERIFY]`
8:02.4  SAY:  "where around one in five patients could stop treatment and keep the virus under control."
8:07.9  [VIDEO] BR-19-lab-green-dish IN → 8:11.4 (3.5 s): gloved hands moving a magnet under a dish, green light → hand:fade (broll-fade, 0.50s)
8:07.9  SAY:  "And one of my favorites from last year, the University of Waterloo built"
8:11.4  [RECEIPT] C30-waterloo-kidney-stone-robots IN → 8:19.4: the Waterloo release photo + headline with the '2025' tag and → hand:xfade-scale (container-xfade, 0.35s)
        'TESTED IN A 3D-PRINTED MODEL, URIC ACID STONES' on screen · push to the photo + tags · treatment: push (the tags keep 'go
        inside of you' from reading as treating patients)
8:12.5  SAY:  "soft magnetic robots that can go inside of you and dissolve kidney stones."
8:17.4  SAY:  "Tested in a model so far."
8:19.4  [CONTAINER] C27-last-30-days-s6 → 8:26.2: the final state, all four dated items held once with the Waterloo 2025 card → hand:xfade-scale (container-xfade, 0.35s)
        beside them (the one overview of the chapter)
8:19.4  SAY:  "Every one of these is early or narrow, but put them together"
8:23.3  SAY:  "and the bill for staying healthy could start to drop."
8:26.2  [VIDEO] BR-20-earth-sunrise-orbit IN → 8:28.3 (2.0 s): sunrise over the curve of the earth → hand:fade (broll-fade, 0.50s)
8:26.2  SAY:  "And then there's the big one."
8:28.3  [CHART] C35 IN → 8:42.1 (MELT reveal → lib:melt-equidistant-3 (MELT-transform, 0.84s)), state C35-escape-velocity-today: MONTHS GAINED PER YEAR dial,
        needle at 4 labelled TODAY (KURZWEIL), red line at 12 (the label carries the attribution the VO lacks) `[VERIFY]`
8:28.3  SAY:  "Right now, medicine gives you back around four months of every year we age."
8:33.4  SAY:  "Scientists call the next step, longevity escape velocity."
8:33.5  [RISER→IMPACT] tension-logo-reveal-3 (risers/Tension_Rise_Logo_Reveal_3.wav, mood_class tense; measured peak 3.48 s into
        the file, -40 dB 2.23 s after it, swell_taper) FILE START 513.47 so its peak lands ON 516.95, the entry of Bed D's second
        and biggest peak (the hit is the bed, no separate impact file); under the VO, ~-22 under; MIX GAIN -24 dB (Mike 2026-10-27: it covered the VO at 9:28)
8:35.4  [CHART] C35-escape-velocity-escape-velocity: the red line labels itself ESCAPE VELOCITY ON 'escape' (515.41); this label
        IS the screenplay's ESCAPE VELOCITY word pop (one layer, captions n/a)
8:37.0  [MUSIC] MUSIC-PLAN hard hit 516.95: Bed D's dip [72,78] sat under the words, its second and biggest PEAK [78,146]
        (env 8-9) enters right after the pop, the riser ends ON it, and carries to the FACE 10 verdict
8:37.0  SAY:  "It's a point where, for every year you live, medicine gives you back more than a year."
8:40.9  [CHART] C35-escape-velocity-swing: the needle swings toward the red line ON 'more than a year' (520.89)
8:42.1  [CHART] C35-escape-velocity-kurzweil (state 3): timeline TODAY: OCT 2026, KURZWEIL 2029 TO 2035 lit green ON 'Ray
        Kurzweil' (522.09) `[VERIFY]` vs the 2024 Economist piece
8:42.1  SAY:  "Ray Kurzweil puts that somewhere around 2029 and 2035."
8:47.6  [CHART] C35-escape-velocity-de-grey: DE GREY EVEN ODDS BY THE LATE 2030s joins, dimmer, ON 'Aubrey de Grey' (527.59)
8:47.6  SAY:  "Aubrey de Grey gives it even odds by late 2030s."
8:50.7  SAY:  "Either way, it's within our lifetimes."
8:52.9  [BRAAM] braam-horn-stinger-02-c (braams/braam-horn-stinger-02-c.wav, mood_class epic; measured peak 1.64 s, -40 dB at
        5.11 s) spine pause 5.1 s at 532.88 (the measured trough between 'lifetimes.' 532.83 and 'And' 532.93, -90 dB at
        532.87): the stakes line is finished, the figures are on screen, the braam starts on the pause's first frame with Bed D
        playing on (no duck), Mike says nothing until it ends · ZOOM to "KURZWEIL 2029 TO 2035" (eased push over the 153 pause
        frames to ~2.4x, the figure drifting to frame centre, held into the cut); the C35 de-grey state holds through it.
        The pause adds 5.1 s of final time INSIDE Bed D only (a section bed, no loop): the bed plays 5.1 s further into its
        [78,146] peak, FACE 10 still lands at env 8; Beds A, B, C and E are untouched (confirm with mix_music.py --dry-run)
8:52.9  [VIDEO] BR-21-pipette-green IN → 8:56.8 (3.8 s): glowing vials, a pipette moving, green light → hand:fade (broll-fade, 0.50s)
8:52.9  SAY:  "And here's what that does to money."
8:54.5  SAY:  "Biotech goes through the roof, selling the cures and the therapies,"
8:56.8  [DIAGRAM] money-moves-diagram-cures IN → 9:00.4: THE MONEY MOVES, the money arrow flows to BIOTECH: CURES AND THERAPIES → hand:xfade-scale (container-xfade, 0.35s)
        (lit) ON 'cures' (537.63)
8:59.5  SAY:  "and the hospital bed sits empty because of fewer people getting sick enough to need one."
8:59.9  [DIAGRAM] money-moves-diagram-hospital: HOSPITAL BEDS spotlit as it dims ON 'hospital' (539.93)
9:00.4  [VIDEO] BR-22-empty-hospital-ward IN → 9:04.4 (4.0 s): beds made, lights dimming row by row → hand:fade (broll-fade, 0.50s)
9:04.4  [TRANSITION] cover→face cut-in F10 → lib:split-swinging-offset-layout-1x2-1 (face-cut, 0.88s) (face-in: split-swinging-offset)
9:04.4  [FACE] F10 IN → 9:07.3 · [VIDEO-LAYER] F10-higgsfield-bg-swap.mp4 · captions OFF (2.9 s)
9:04.5  SAY:  "The money doesn't vanish from healthcare, it moves."
9:06.4  [PUNCH-IN] F10 hard ~15-20% step ON the desilencer join 546.433 → holds to the cut 9:07.3
9:06.4  [GLITCH] F10 random glitch offset / glitch blocks hit ACROSS the same join → lib:glitchoffset-2x (punch-glitch, 0.48s) (punch-glitch)
9:07.3  [TRANSITION] face→cover F10 out → lib:glass-blocks-2-horizontal (face-cut, 0.84s) (owned by the chapter SPLIT move)
```

## CH8 - OWN ASSETS. CRYPTO. FIND YOUR PEOPLE (9:07.4-10:10.1, Bed E, card ON)
```
9:07.4  [CARD] CH8 title card "OWN THE ASSETS" · [IMPACT] card-impact-hit01-3-short (below)
        (title-CH8.png; edit-time pause >= 1 s at the trough 547.38, zero spine time) ·
        [TRANSITION] chapter SPLIT move → rmn:cube (card, 0.60s) ·
        [IMPACT] card-impact-hit01-3-short (Impacts/card-impact-hit01-3-short.wav, mood_class epic; measured peak 0.13 s, -40 dB
        2.11 s after it) FILE START 547.25, peak ON the card frame (same file as the CH2 card: the scary chapters' card hit returns)
9:07.4  [MUSIC] Bed E `deceptive-cadence` (JCar_Deceptive_Cadence_instrumental_1_48.mp3) from file 40.21, END-PINNED (its last
        accent, file 102.25, on 'ever.' 609.55; hold_until 615.78, trim true), -29.3 dB (-16 under), fade-in 0.8 s (hot entry,
        env 8), breath 0.5 s inside the card pause → 10:10.1
9:07.4  [VIDEO] BR-23-silhouette-red-blinds IN → 9:09.4 (2.0 s): a lone figure, red rim light, fog; red accent returns
9:07.5  SAY:  "So where does this leave you?"
9:09.4  [VIDEO] BR-24-office-windows-night IN → 9:12.2 (2.7 s): an office tower going dark floor by floor → hand:fade (broll-fade, 0.50s)
9:09.4  SAY:  "Your labor is worth a little less every month."
9:12.2  [VIDEO] BR-25-server-racks-red IN → 9:15.8 (3.7 s): server racks, red status lights → hand:fade (broll-fade, 0.50s)
9:12.2  SAY:  "The way through is to own things AI make more valuable, productive assets,"
9:15.8  [VIDEO] BR-26-robot-arms-welding IN → 9:17.4 (1.5 s) · [HW-POP] hw-word-pop 'PRODUCTIVE ASSETS' ON 'productive' → hand:fade (broll-fade, 0.50s)
        (555.83), silent, captions n/a (cover)
9:17.4  [VIDEO] BR-27-phone-hand-night-city IN → 9:20.2 (2.9 s): a phone lighting up, a hand picking it up (no brand on screen) → hand:fade (broll-fade, 0.50s)
9:17.4  SAY:  "and crypto, the one asset you can own from your phone with no gatekeeper."
9:17.5  [HW-POP] hw-word-pop 'CRYPTO: NO GATEKEEPER' ON 'crypto' (557.51), silent
9:20.2  [VIDEO] BR-28-gate-opening-dark IN → 9:21.7 (1.5 s): an iron gate swinging open in fog, nobody guarding it → hand:fade (broll-fade, 0.50s)
9:21.7  [RECEIPT] R14-last-video IN → 9:24.1: Mike's previous video 'Literally Every Job Is at Risk' watch page (title + → hand:xfade-scale (container-xfade, 0.35s)
        thumbnail) shown as an OBJECT · [MOTION] lib:motion-3d-pan-1-right · treatment: pan `[VERIFY]` it named the coins
9:21.7  SAY:  "I showed you some of my favorites in my last video."
9:24.1  [CONTAINER] coin-marks-s1 IN → 9:26.2: logos only, no prices; BITCOIN pops ON 'Bitcoin' (564.09) `[VERIFY]` the Bitcoin mark → hand:xfade-scale (container-xfade, 0.35s)
        is sourced (not in the reference folder)
9:24.1  SAY:  "Bitcoin, Kaspa, and TAO own the assets before the paychecks run out."
9:25.3  [CONTAINER] coin-marks-s2: KASPA pops ON 'Kaspa' (565.25)
9:25.8  [CONTAINER] coin-marks-s3: TAO pops ON 'TAO' (565.83)
9:26.2  [TRANSITION] cover→face cut-in F11 → lib:split-swinging-offset-short-layout-2x1-2 (face-cut, 0.48s) (face-in: split-swinging-offset)
9:26.2  [FACE] F11 IN → 9:28.7 · [VIDEO-LAYER] F11-higgsfield-bg-swap.mp4 · captions OFF (2.6 s)
9:27.7  [PUNCH-IN] F11 hard ~15-20% step ON the desilencer join 567.733 → holds to the cut 9:28.7
9:27.7  [GLITCH] F11 random glitch offset / glitch blocks hit ACROSS the same join → lib:blocks-strips-6x (punch-glitch, 0.40s) (punch-glitch)
9:28.7  [TRANSITION] face→cover F11 out → lib:blocks-max-2 (face-cut, 0.96s)
9:28.7  [VIDEO] BR-29-silhouette-corridor IN → 9:31.2 (2.5 s): a lone silhouette down a dark corridor
9:29.0  SAY:  "And don't go through this alone."
9:31.2  [VIDEO] BR-30-campfire-silhouettes IN → 9:34.6 (3.4 s): silhouettes around a warm fire at night → hand:fade (broll-fade, 0.50s)
9:31.2  SAY:  "Get into a group of like-minded people who can see this coming."
9:34.6  [RECEIPT] R15-cryptorich-home IN → 9:39.7: the cryptorich.vip homepage, treatment: push (slow read-zoom; Mike 2026-10-27: replaces the code-built text card, → hand:xfade-scale (container-xfade, 0.35s)
        stands in for the R15 screens Mike has not supplied; he may swap real screens in at the draft)
9:34.6  SAY:  "A group like CryptoRich, which is my group."
9:37.4  SAY:  "A group of people who are going to stay ahead of the game."
9:39.7  [CONTAINER] risk-ladder-overview-s1 IN → 9:56.4 · [IMPACT] Boom 2 + [MUSIC] Bed E swell (below): THE RISK LADDER, all 9 RL cards on one dark container (the one → hand:xfade-scale (container-xfade, 0.35s)
        all-cards overview of the video, OVERVIEW_REFS), all dark on 'So in a nutshell' ·
        [IMPACT] Boom 2 (Boom 2.wav, mood_class epic; measured peak 0.23 s, -40 dB 2.46 s after it) file start 579.50, peak ON
        the overview landing 579.73, ~0.4 gain under 'So in a nutshell', MIX GAIN -24 dB (Mike 2026-10-27: added back after the mixer misread the name) ·
        [MUSIC] MUSIC-PLAN hard hit 579.73: Bed E's first env-9 swell (file 72-74) lands with it
9:39.7  SAY:  "So in a nutshell, in my book, writers and designers already gone."
9:42.6  [CONTAINER] risk-ladder-overview-s2: WRITERS + DESIGNERS ALREADY GONE (IN MY BOOK label) light ON 'writers' (582.61)
9:45.0  [CONTAINER] risk-ladder-overview-s3: EDITORS + ACTORS NEXT ON 'Editors' (585.03)
9:45.0  SAY:  "Editors and actors next."
9:47.7  [CONTAINER] risk-ladder-overview-s4: UNIVERSITIES, ACCOUNTANTS, LAWYERS ON THE CLOCK ON 'Universities' (587.67)
9:47.7  SAY:  "Universities, accountants, and lawyers on the clock."
9:50.7  [CONTAINER] risk-ladder-overview-s5: HEALTHCARE CHEAPER, OWN ASSETS ON 'Healthcare' (590.73)
9:50.7  SAY:  "Healthcare could get a lot cheaper, and the way through this all is through owning assets."
9:56.4  [CONTAINER] comment-card IN → 10:00.5: WHICH JOB GOES NEXT? with a comment-box pictogram, red → hand:xfade-scale (container-xfade, 0.35s)
9:56.4  SAY:  "Drop a comment below and let me know which job you think goes next."
10:00.5 [VIDEO] BR-31-red-smoke-black IN → 10:04.2 (3.8 s): red smoke in darkness, the base plate for the subscribe button → hand:fade (broll-fade, 0.50s)
10:00.5 SAY:  "And click that like button if you like this content and subscribe if you're not subscribed."
10:03.2 [HW-CTA] hw-subscribe-like-bell ON 'subscribe' (603.23): the coral SUBSCRIBE pill grows on the lower third, the cursor
        clicks, SUBSCRIBED + like + bell burst, spins out · [WHOOSH] woosh9 (halloween-2022/woosh9.mp3, mood_class tense; the
        device's fixed pair) FILE START 603.36 (0.133 s after the button's first frame), 0 dB, its swell on the click
10:04.2 [TRANSITION] PUMPKIN transition 3 of 3 into the end card (`scary-pumpkin-fire` or `scary-6-normal75`) → lib:scary-pumpkin-fire (scene-cut, 10.17s)
10:04.2 [CONTAINER] end-card IN → 10:10.1: the TRANSPARENT overlay (corner CryptoRich logo bug + the GET INVOLVED community
        lower-third band), faded in, layered over a MOVING picture (the pumpkin plate's burning tail), NEVER over the black spine
10:05.6 SAY:  "And once again, click that link in the description to be involved in the greatest community ever."
10:06.5 [CONTAINER] end-card lower-third band lands ON 'click that link' (606.45)
10:09.5 [MUSIC] MUSIC-PLAN hard hit 609.55: Deceptive Cadence's closing accent (file 102.25) lands ON 'ever.' (609.55-609.91);
        the mix is cut at the spine end 610.13 with the 0.2 s fade; no added SFX (the bed's accent IS the last hit)
10:10.1 [END] the video ends ON the last word 'ever.' (no 'catch you guys later' in the take); no held still, no end screen
```

## Orphan reconciliation (zero orphans, checked against assets/ on 2026-10-27)
Every renderable in `assets/` is PLACED above with a timecode, or marked here. Sources (.html / .py / .json / .txt) are exempt.

**PLACED:**
- vid (31): BR-1 to BR-31, each once, every clip 4.0 s or less.
- img (11): IMG-1 to IMG-11, each once.
- clip-inserts (4): CLIP-1 (0:32.3), CLIP-5 (3:01.2), CLIP-4 (3:44.9), CLIP-3 (3:59.1), each with its lead-in and lead-out still.
- receipts (32 files): R1-openai-plus · C6-bls-writers-outlook · C10-mike-thumbnail-wall · C9-midjourney-plans ·
  C7-wef-graphic-designers · R2-netflix-q2-2025 · C13-adobe-premiere-generative-extend · R3-bls-editors · R4-particle6-sketch ·
  R5-nbc-sag-aftra · C15-deadline-misaligned · C16-1-hm-ai-twins · C16-2-guess-vogue-ai-models · C16-3-coke-ad.mp4 ·
  R6-marketingweek-coke · C18-caixin-ai-movie · C20-nyfed-recent-grads · R7-nyfed-hhdc · R8-nsc-enrollment ·
  C21-restofworld-china-universities · R9-bls-bookkeepers · R10-goldman-2025 · R11-accountancyage-kpmg · R12-bls-paralegals ·
  R13-harvey-blog · C26-bls-lawyers-outlook · C31-life-bio-er100-release · C28-a-fda-jemperli · C28-b-fda-hibsago ·
  C30-waterloo-kidney-stone-robots · R14-last-video.
- charts (Type 1 ANIMATED, the PNGs are the chart-builder's design states; the comp animates in code and the rows mark when each
  state is reached): C1-roll1-01 to -12 (the 12 roll-call cards) · H1-paychecks-prices start / gap / assets · C4-freelance-writing
  start / mid / payoff · C4b-freelance-image start / mid / payoff · C22-goldman-exposure start / mid / payoff · C35-escape-velocity
  today / escape-velocity / swing / kurzweil / de-grey.
- diagrams (Type 2 SYSTEM-DESIGN stills): C2-clock his-window / mikes-call · old-workflow-flow base / brief / wait / revisions /
  invoice / days · wef-editions-timeline first-time / growing · C14-tilly-timeline base / sketch / zurich · legal-work-diagram
  courtroom / never-sees-a-judge / contracts · money-moves-diagram cures / hospital.
- card-slides: h0-next-wave-card · rl-skeleton · RL-1-copywriters to RL-9-lawyers (each once) · C8-price-card s1-s2 ·
  human-touch-card s1-s2 · arg-1-information · C19-university-card s1-s3 · ch6-four-skeletons · C27-last-30-days s1-s6 ·
  weeks-to-a-day-card s1-s2 · coin-marks s1-s3 · risk-ladder-overview s1-s5 · comment-card · end-card.
- title-slides: title-CH2 · title-CH3 · title-CH7 · title-CH8 (the four cards, one per bed change).
- face-swap (the Mad Max look, every FACE window): F1, F2, F3 (joined), F4 (joined), F5 to F11 `-higgsfield-bg-swap.mp4`.

**REJECTED / BENCH:**
- `diagrams/legal-work-diagram-full.png` REJECTED: the 'reviewing agreements, writing the fine print' half of the line rides
  BR-18 (6:54.5), so the all-filled state has no slot; the contracts state is the diagram's last.
- `receipts/C16-3-coke-ad.png` BENCH: the still twin of the muted Coca-Cola panel; the comp plays C16-3-coke-ad.mp4 (swap to the
  still only if the clip stutters in the montage).
- `face-swap/F3a-`, `F3b-`, `F4a-`, `F4b-higgsfield-bg-swap.mp4` + every `F*-raw-for-higgsfield.mp4` REJECTED as comp inputs:
  the halves are joined frame-exact into F3 / F4 (the joins air), the raws are Higgsfield inputs; `_prejoin-backup/` is the
  pre-fix record. `face-theme/*.png` are look references (inputs), not comp layers.
- C17 (the video-model timeline) BENCH per COVER-PLAN (no clean slot, its Seedance 2.0 date still `[VERIFY]`); C29 (Johns Hopkins
  release) never captured, dropped (C27 holds its line); R15 = the cryptorich.vip homepage capture (Mike 2026-10-27; the interim cryptorich-card is retired).
- Effects bench: `hw-drop-bounce`, `hw-zoom-punch` not placed (the face joins carry the glitch punches, the two shakes are spent);
  `hw-keyed-presenter` never placed (house rule: never key or matte Mike's face).

**SFX palette considered and left out (mood-matched, fewer bigger hits):** accents (the halloween-2022 pops are silent in the source
and stay silent; a timpani or sci-fi ping would fight the horror bed) · drones (Beds A and C ARE droning horror beds, a sci-fi hum
on top would only mud the VO) · textures (none needed over five continuous beds) · extra whooshes (the scary-pack stingers and the
splits carry their own sounds; woosh9 is the one device pair) · `dark` stingers (`dramatic-shocked`, `dsgn-rise-elevenlabs`): the
CH1 creepy riser is the one dark sound, CH7 is the hopeful chapter and gets none.
