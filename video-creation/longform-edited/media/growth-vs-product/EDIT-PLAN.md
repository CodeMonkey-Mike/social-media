# growth-vs-product - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author 2026-10-23 off the graph seed (`_previews/EDIT-PLAN.seed.md`, refined, never re-derived)
> + `spine/ALL.d.desilenced.medium-words.json` + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Open
> flags) + `spine/jumpcuts-final.json` + SCREENPLAY.md (the `[SHOW]` device lines) + the built assets in `assets/` (state cues:
> `assets/diagrams/_state-cues.md`, `assets/charts/*.spec.md`, `assets/slide-sources/states.json`). Format:
> `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` section 1; the comp is built TO this log.
> Watch file: `spine/ALL.d.desilenced.mp4` (219.66 s / 3:39.7, 30 fps). Every timecode = a FINAL-spine second, PRE-card-pause:
> the two title-card pauses (CH2 at 50.35, CH5 at the waived cut 173.085 / 173.10) shift the final timeline via `sh()` at comp.
> Never re-apply a shift here. No clip insert (CLIP-1 stays OUT, COVER-PLAN `clip_inserts` empty), no braam pause.
> `TRANSITIONS.md` = the pick is the transition-strategist's (TRANSITIONS.md, authored next); `reconcile_docs.py` fans it in.
> SFX rows name the kit file in backticks + its `mood_class`; every house impact / whoosh was picked by MEASURED envelope
> (ffmpeg decode, 10 ms RMS, the point 40 dB under the peak, measured 2026-10-23); `file start` = where the FILE starts so its
> measured peak lands on the named frame. Kinetic-text sounds use the `attack_sec` / device offsets of
> `assets/sfx/kinetic-text/library.json`. Music + SFX are the ffmpeg post-mix (`mix_music.py`), never in the comp (comp-build 9).
> ZERO ORPHANS: every renderable in `assets/` (by id) is PLACED below with a timecode or marked BENCH / REJECTED in the
> reconciliation section at the end.
> FACE joins: `spine/jumpcuts-final.json` has ZERO punch points (every interior join of all 7 FACE windows sits inside the 0.5 s
> edge margin), so this video carries NO `[PUNCH-IN]` and NO `[LIGHTLEAK]` (overlays.md section 1: no join, no punch, no leak).
> The F1 slow push is part of `kt-signature-open`, not a join punch.
> Captions: scope = ALL FACE windows + the Envato b-roll (PROJECT-LOG open flag 2026-10-22, the AI Engineering channel's evals
> precedent), never over receipts / containers / AI stills; montserrat house style; the AS-RECORDED mishear list applies
> ("onboarded", "builds out", "for the customer", "Builds it", "AI-personalized", "doesn't, kill it", "A/B", "guardrails",
> "plain software", "leans" on the F5 line). The signature-open labels sit on the right third and the side panels beside the face,
> outside the caption zone, so captions stay ON under them.
> Kinetic text (overlays.md section 2): `kt-signature-open` on the hook (its parts below), `kt-side-panel` pairs on the three
> "this or that" FACE lines (F3 / F4 / F5), and the role-label pops with their two signature sounds wherever the labels return.
> No other 2023 device. No face background-swap clips and no image motion clips exist for this video (no `assets/face-swap/`,
> no `assets/img-motion/`): faces air as recorded, the 5 AI stills take a comp-level slow camera move.

## CH1 - TWO TITLES, ONE WORD (0:00.0-0:50.4, Bed A `proton-streams`, card OFF)
```
0:00.0  [MUSIC] Bed A `proton-streams` (Empyreal Glow) COLD OPEN at file 0.0, no fade-in, the cold_hot first window under
        word one; seat -17 under VO (gain -24.3 dB) → 0:50.4. Hard hit 0.00: the music IS the hit, no SFX impact on word one
        (MUSIC-PLAN hard_hits[0])
0:00.0  [TRANSITION] kt-whip-cut IN onto the face → hand:kt-whip-cut (face-cut, 0.73s) (face pick): the signature open's 0.73 s whip
        + 25 to 0 degree roll (part of `kt-signature-open`) · [WHOOSH] `swoosh-4.mp3` (kinetic-text swoosh-4, mood_class
        neutral; attack 0.23 s) file start 0.00, its peak lands inside the whip
0:00.0  [FACE] F1 opens ON face → 0:04.7 (blackdetect 0.000-4.733), the locked hook; slow push ~5 percent over the line → hand:kt-whip-cut (face-cut, 0.73s)
        (kt-signature-open part); no interior join, so no punch-in and no light leak
0:00.0  [CAPTION] ON → 0:04.7 (F1)
0:00.0  SAY:  "So what are the differences between an AI growth engineer and an AI product"
0:01.6  [DUCK] Bed A -5 dB (relative, 0.15 s ramps) 1.55 → 0:04.4 so the two label sounds read (MUSIC-PLAN automation row 1,
        hard hit 1.83)
0:02.0  [KT-POP] kt-signature-open ROLE LABEL A 'AI GROWTH / ENGINEER' ('AI GROWTH' gold #ffd700, 'ENGINEER' white, house display
        font, drop shadow) pops on the RIGHT THIRD with the kt-keyword-pop motion ON 'AI growth engineer' 2.00, holds to the
        0:04.7 whip-out · [ACCENT] `cash-register.wav` (kinetic-text cash-register, mood_class neutral; attack 0.24 s) file start
        1.83, 0.17 s early so the bell lands on the label
0:03.5  [MUSIC] Bed A still inside the -5 dB dip under LABEL B (MUSIC-PLAN hard hit 3.47); the dip releases at 4.40
0:03.6  [KT-POP] kt-signature-open ROLE LABEL B 'AI PRODUCT / ENGINEER' ('AI PRODUCT' green #22c55e, 'ENGINEER' white) pops
        stacked BELOW label A ON 'AI product engineer' 3.64, holds to the whip-out · [ACCENT] `wooden-rattle-whoosh.wav`
        (kinetic-text wooden-rattle-whoosh, mood_class neutral; attack 0.27 s) file start 3.47
0:04.3  SAY:  "engineer? Let's first take the AI off both titles for a second."
0:04.7  [TRANSITION] F1 face→cover out → hand:kt-whip-cut (face-cut, 0.17s) (face pick): kt-whip-cut OUT (blur-in variant, 0.17 s)
        into the C2 card, the labels leave with the cut · [WHOOSH] `whoosh-4.mp3` (kinetic-text whoosh-4, mood_class neutral; attack 0.34 s)
        file start 4.39 so its peak lands ON the 4.73 cut
0:04.7  [CONTAINER] C2-s1-s1 IN → 0:14.8: the side-by-side role card 'The two base roles', both labels WITHOUT 'AI', unlit,
        empty lines (cross-fade + scale-in → hand:kt-whip-cut (face-cut, 0.17s))
0:08.2  [CONTAINER] C2-s1-s2 GROWTH / ENGINEER (gold) label lights ON 'growth engineer' 8.24 (role-label pop motion) ·
        [ACCENT] `cash-register.wav` (kinetic-text, mood_class neutral) file start 8.07
0:08.2  SAY:  "A growth engineer pushes the product out to customers, gets them onboarded,"
0:12.0  SAY:  "or gets them to stay and grow the actual business."
0:13.3  [CONTAINER] C2-s1-s3 LABEL A base line 'pushes the product out: onboard, retain, grow the business' lands ON 'grow' 13.32
0:14.8  [RECEIPT] C12 IN → 0:18.9 (4.14 s), two files: `C12-title-date` (Pragmatic Engineer masthead, 'What is Growth
        Engineering?', Mar 20, 2025) settles 14.78-16.40, then `C12-pragmatic-engineer-paragraph` 16.40-18.92 (cross-fade
        → hand:xfade-scale (container-xfade, 0.35s)). treatment: highlight
        (settling push, then the wipe) [HIGHLIGHT] on 'Product Engineers focus on creating a Product worth paying for', onset
        'features' 16.66; the line paraphrases it, so the highlight carries the source sentence
0:14.8  SAY:  "A product engineer builds out the features of the actual product for the customer."
0:18.0  [MUSIC] Bed A drops from the env-6 build to the env-8 peak at file 18.0 by arrangement (about +4 dB), no SFX; the AI
        pops ride the fresh peak (MUSIC-PLAN hard hit 18.0)
0:18.9  [CONTAINER] C2-s1b-s1 IN → 0:20.7: the card returns with PRODUCT / ENGINEER (green) popping ON its entry 18.92 → hand:xfade-scale (container-xfade, 0.35s)
        (role-label pop motion; the label sound fires WITH the visible pop, not under the receipt at 15.0) · [ACCENT]
        `wooden-rattle-whoosh.wav` (kinetic-text, mood_class neutral) file start 18.75
0:18.9  SAY:  "Builds it, does not market it. Now put AI in front of both of those titles."
0:19.6  [CONTAINER] C2-s1b-s2 LABEL B base line 'builds the product's features for the customer, not the marketing' ON 'does' 19.60
0:20.7  [CONTAINER] C2-s2-s1 IN → 0:40.3: eyebrow 'Now put AI in front', both labels lit, both base lines done (quiet swap) → hand:xfade (container-xfade, 0.20s)
0:21.4  [CONTAINER] C2-s2-s2 'AI' pops onto LABEL A ON 'AI' 21.40 (role-label pop motion) · [ACCENT] `cash-register.wav`
        (kinetic-text, mood_class neutral) file start 21.23
0:21.9  [CONTAINER] C2-s2-s3 'AI' pops onto LABEL B ON 'in' 21.94 · [ACCENT] `wooden-rattle-whoosh.wav` (kinetic-text,
        mood_class neutral) file start 21.77
0:23.4  SAY:  "The AI growth engineer moves that same number with AI as well as landing pages,"
0:28.3  SAY:  "onboarding and retention personalized for every user and the experiments to prove"
0:32.8  [CONTAINER] C2-s2-s4 LABEL A AI line 'paid to move that number with AI: personalized pages, onboarding, retention,
        experiments' lands ON 'prove' 32.82 (keeps the scripted sourced meaning, AS-RECORDED flag 23.44)
0:33.0  SAY:  "it. The AI product engineer builds the AI inside of the feature."
0:37.1  SAY:  "So the job is the model's answers grounded in real data. In my experience,"
0:39.6  [CONTAINER] C2-s2-s5 LABEL B AI line 'paid for the feature's quality: evals, grounding, latency, cost' lands ON 'real'
        39.58 (latency, cost unspoken but sourced, Citian; open decision)
0:40.3  [RECEIPT] C4a IN → 0:42.7 (2.38 s): CrowdStrike 'Sr. AI Growth Engineer (Remote)' LinkedIn title block, no counters
        (hand-off → hand:xfade-scale (container-xfade, 0.35s)). treatment: pan
        [MOTION] lib:motion-3d-pan-2-right (a real posting with this title shown as an OBJECT: it exists)
0:41.2  SAY:  "these two get used interchangeably even by people who are hiring for them."
0:42.7  [RECEIPT] C5a IN → 0:45.1 (2.43 s): Citian 'Senior AI Product Engineer' LinkedIn title block, no '72 applicants'
        (→ hand:xfade-scale (container-xfade, 0.35s)). treatment: pan
        [MOTION] lib:motion-3d-orbit-1-t-left (the second posting as an OBJECT; a different move from C4a, never the same twice
        in a row)
0:45.0  [DUCK] Bed A -2 dB (relative, 0.15 s ramps) 45.0 → 0:45.9, the ONE vibe-cut duck (MUSIC-PLAN automation row 2)
0:45.1  [TRANSITION] F2 cover→face cut-in (MUSIC-PLAN reads a film-burn cut) → hand:film-burn (face-cut, 0.76s) (face pick) · [IMPACT]
        `Impact_Hit_01-2-18.wav` (impact-hit-01-2-18, mood_class epic; measured peak 0.13 s, -40 dB at 1.78 s = 1.65 s tail)
        file start 45.00 so the sub hit lands ON the 45.133 cut, the video's one conviction hit (MUSIC-PLAN hard hit 45.133)
0:45.1  [FACE] F2 IN → 0:48.8 (blackdetect 45.133-48.800), the locked thesis; its one join 48.733 sits inside the 0.5 s edge
        margin: no punch-in, no light leak
0:45.1  [CAPTION] ON → 0:48.8 (F2)
0:45.2  SAY:  "They're not the same job, same tools, different scoreboard."
0:48.8  [TRANSITION] F2 face→cover out → hand:film-burn (face-cut, 0.76s) (face pick)
0:48.8  [CONTAINER] C2-s2-s6 RESUMES → 0:50.4: both halves lit, held under the whip into the CH2 title card (the same scene's
        second spot, not a repeat)
0:48.9  SAY:  "So let's dissect this a bit."
```

## CH2 - THE SCOREBOARD (0:50.4-1:27.0, Bed B `innovation`, CARD ON)
```
0:50.4  [CARD] CH2 title-card-CH2 'THE SCOREBOARD' · [IMPACT] `card-impact-layered.wav` (card-impact-layered, mood_class epic; measured peak 0.03 s, -40 dB at 0.81 s = 0.78 s tail, rings out inside the pause) file start 50.32
        · [TRANSITION] card presentation → rmn:flip (card, 0.50s) (ONE card pick for both cards); edit-time pause >= 1.0 s at 50.35
        inside the measured trough 50.31-50.37 ('bit.' | 'Difference'), zero spine time (MUSIC-PLAN hard hit 50.35)
0:50.4  [MUSIC] bed change A → B: Bed A fades 0.4 s from the card's first frame, 0.6 s breath, Bed B `innovation` (JCar)
        fades in 0.5 s from file 0.0, full at file 0.5 on 'Difference' 50.50; seat -18 under (gain -27.3 dB), REMIX loop
        22.857-53.333 (16 bars), one merged placement CH2 + CH3 + CH4 → 2:53.1
0:50.4  [VIDEO] BR-1 IN → 0:52.7 (2.33 s): a live analytics dashboard, a conversion funnel filling (dissolve → hand:fade (broll-fade, 0.50s))
0:50.4  [CAPTION] ON → 0:52.7 (BR-1, Envato caption scope)
0:50.5  SAY:  "Difference number one, the scoreboard,"
0:52.7  [CONTAINER] scoreboard-growth-s1 IN → 0:58.0: eyebrow 'Difference 1 / The scoreboard', gold GROWTH ENGINEER label,
        headline 'A business number' (the folded motion-type card), four chips unlit (cross-fade + scale-in → hand:xfade-scale (container-xfade, 0.35s))
0:52.7  SAY:  "the growth engineer is scored on the business number, the signups,"
0:55.6  [CONTAINER] scoreboard-growth-s2 SIGNUPS chip lights ON 'signups' 55.62
0:56.0  [CONTAINER] scoreboard-growth-s3 CONVERSION chip lights ON 'conversion' 56.02
0:56.0  SAY:  "conversion, retention, and revenue. The product engineer is scored on the feature itself."
0:56.7  [CONTAINER] scoreboard-growth-s4 RETENTION chip lights ON 'retention' 56.70
0:57.5  [CONTAINER] scoreboard-growth-s5 REVENUE chip lights ON 'revenue' 57.50
0:58.0  [IMAGE] IMG-1 IN → 1:00.7 (2.72 s): clean 3D render, a glowing feature module under a precision gauge; AI-still
        ingress → lib:glitchmonitor-2 (glitch-still, 0.52s), comp-level slow push (no motion clip exists)
1:00.7  [RECEIPT] C5b IN → 1:04.8 (4.12 s): Citian duty bullets 'Design and maintain evaluations for AI features ... regression
        detection' (→ hand:xfade-scale (container-xfade, 0.35s)). treatment: highlight
        (settling push, then the wipe) [HIGHLIGHT] on 'evaluations', onset 'evals' 62.70 (he defines the word on screen)
1:00.7  SAY:  "The word for that scoreboard is called evals, short for evaluation."
1:04.8  [RECEIPT] C7a IN → 1:10.0 (5.16 s): GovWell 'AI Product Engineer', the 'Our AI Stack' block (→ hand:xfade-scale (container-xfade, 0.35s)). The slot
        start 64.84 is the CLIP-1 splice point if Mike reverses the default. treatment: highlight
        (settling push) [HIGHLIGHT] on 'tracked against explicit pass-rate targets', onset 'pass' 65.64
1:05.1  SAY:  "Their feature's pass rate on a test set is the product engineer's conversion"
1:09.5  SAY:  "rate. The growth engineer ships an AI-personalized landing page as a split test."
1:10.0  [VIDEO] BR-2 IN → 1:12.0 (2.00 s): over-the-shoulder, a person browsing a landing page on a laptop (→ hand:fade (broll-fade, 0.50s))
1:10.0  [CAPTION] ON → 1:12.0 (BR-2; caption text 'AI-personalized')
1:12.0  [CHART] split-test IN → 1:17.5 (Type 1 ANIMATED in code, `split-test.spec.md`), cross-fade + scale 0.97 to 1 from BR-2
        (→ hand:xfade-scale (container-xfade, 0.35s)): pages A / B, both bars empty (= split-test-start), NO figure printed anywhere
1:14.3  [CHART] split-test BOTH bars grow, ease-out 24 f, ON 'The number moves' 74.34 (= split-test-mid)
1:14.3  SAY:  "The number moves or it doesn't, kill it or scale it."
1:15.1  [CHART] split-test A creeps and stalls, B keeps growing, ON 'or' 75.14
1:16.2  [CHART] split-test takeaway bar 'KILL IT OR SCALE IT' fades up ON 'kill' 76.22 (the folded motion-type card)
1:16.2  [MUSIC] Bed B on its env-8 plateau (arrived 72.86), no music move: the chart carries the beat (MUSIC-PLAN hard hit 76.22)
1:17.0  [CHART] split-test WINNER lights ON 'scale' 77.04: B cyan + glow, SCALE IT pill, A dims, KILL IT pill (= split-test-payoff) → hand:xfade (container-xfade, 0.20s)
1:17.5  [CHART] pass-rate-meter IN → 1:22.6 (Type 1 ANIMATED in code, `pass-rate-meter.spec.md`), cross-fade from split-test
        (same header anatomy): needle resting low at f 0.22 (= pass-rate-meter-start), no figure printed
1:17.5  SAY:  "The product engineer ships a grounding fix and the number that moves is the pass"
1:19.5  [CHART] pass-rate-meter 'Grounding fix' card drops into its slot ON 'grounding' 79.50, the arrow draws
1:20.2  [CHART] pass-rate-meter needle CLIMBS f 0.22 to 0.80 over 57 f from 'and' 80.24 (mid-climb about 80.9 = pass-rate-meter-mid)
1:22.1  [CHART] pass-rate-meter needle settles ON the TARGET notch, 'PASS RATE' turns cyan, ON 'pass' 82.14 (= pass-rate-meter-payoff)
1:22.4  SAY:  "rate. One scoreboard counts what the business did and the other one counts what the model did."
1:22.6  [TRANSITION] F3 cover→face cut-in (hard cut from the meter) → hand:film-burn (face-cut, 0.76s) (face pick)
1:22.6  [FACE] F3 IN → 1:27.0 (blackdetect 82.600-87.000); its one join 86.867 sits inside the 0.5 s edge margin: no punch-in,
        no light leak
1:22.6  [CAPTION] ON → 1:27.0 (F3; the side panels sit below the captions, SCREENPLAY open question 17d)
1:22.7  [KT-PANEL] kt-side-panel RIGHT 'GROWTH ENGINEER / THE BUSINESS / NUMBER MOVED' (role name gold, verdict white, dark
        textured panel in the cyan teaching block) slides in ON 'One' 82.70: Mike shifts left (-80 px, scale 120 percent,
        0.47 s), panel 0.50 s ease-out, text rises 0.23 s later, then hovers · [WHOOSH] `swoosh-1.mp3` (kinetic-text swoosh-1,
        mood_class neutral) file start 82.53, 0.17 s before the panel moves
1:25.3  [TRANSITION] kt-whip-cut on the same take ON 'the' 85.32 ('the other one'), removes the right panel → hand:kt-whip-cut (kt-whip-cut, 0.37s)
        (bucket 3, face) · [WHOOSH] `whoosh-4.mp3` (kinetic-text whoosh-4, mood_class neutral; attack 0.34 s) file start 84.98
        so its peak lands ON the cut
1:25.3  [KT-PANEL] kt-side-panel LEFT 'PRODUCT ENGINEER / THE EVAL / SCORE MOVED' (role name green) slides in ON 'the' 85.32,
        Mike shifts right, holds to the 1:27.0 cut · [WHOOSH] `swoosh-2.wav` (kinetic-text swoosh-2, mood_class neutral) file
        start 85.25, 0.07 s before the panel moves
```

## CH3 - THE CLOCK (1:27.0-2:06.1, Bed B continues, card OFF)
```
1:27.0  [TRANSITION] F3 face→cover out → hand:film-burn (face-cut, 0.76s) (face pick): the cardless CH3 entry (the screenplay's
        'house whip' resolved as the face pick), removes the left panel
1:27.0  [VIDEO] BR-3 IN → 1:29.0 (2.04 s): a stopwatch face ticking, macro (dark re-source, visual-qa PASS) (→ hand:fade (broll-fade, 0.50s))
1:27.0  [CAPTION] ON → 1:29.0 (BR-3)
1:27.2  [MUSIC] Bed B runs on (same merged placement, file 37.18 on the plateau, no step, no breath)
1:27.2  SAY:  "Difference number two, the clock."
1:29.0  [CONTAINER] ship-to-learn-s1 IN → 1:35.2: eyebrow 'Difference 2 / The clock', gold GROWTH ENGINEER label, both rows
        resting (cross-fade + scale-in → hand:xfade-scale (container-xfade, 0.35s))
1:29.0  SAY:  "The growth engineer runs many cheap experiments and a failed one still counts because"
1:30.2  [CONTAINER] ship-to-learn-s2 'many cheap experiments' lights ON 'many' 90.20
1:32.0  [CONTAINER] ship-to-learn-s3 'a failed one still counts' lights ON 'a' 92.02
1:33.9  SAY:  "the output is leaning. The product engineer builds a slow loop,"
1:34.7  [CONTAINER] ship-to-learn-s4 takeaway 'Ship to learn.' lands ON 'leaning.' 94.72 (prints LEARN, AS-RECORDED flag 94.72)
1:35.2  [DIAGRAM] loop-s1-base IN → 1:40.5 (Type 2 still): 'THE SLOW LOOP', all four nodes dim (cross-fade + scale-in
        → hand:xfade-scale (container-xfade, 0.35s))
1:37.3  SAY:  "a test set known with good answers and a regression gate on every change."
1:37.5  [DIAGRAM] loop-s1-test-set TEST SET lights ON 'test' 97.50
1:39.8  [DIAGRAM] loop-s1-gate REGRESSION GATE + the TEST SET → GATE arrow light ON 'regression' 99.82, holds to 100.54
1:40.5  [RECEIPT] C10 IN → 1:43.2 (2.68 s): hamel.dev 'Your AI Product Needs Evals' (March 29, 2024) title + the root-cause
        paragraph, a silent flash (→ hand:xfade-scale (container-xfade, 0.35s)). treatment: highlight
        (settling push) [HIGHLIGHT] on 'unsuccessful products almost always share a common root cause: a failure to create
        robust evaluation systems', onset 'vibe' 102.70
1:41.8  SAY:  "Nothing ships on a vibe check. Give both of them three weeks."
1:43.2  [IMAGE] IMG-2 IN → 1:45.3 (2.06 s): three translucent calendar sheets beside an hourglass, no digits; AI-still ingress
        → lib:glitchmonitor-4 (glitch-still, 0.56s), comp-level slow push
1:43.2  [MUSIC] the 16-bar REMIX SEAM lands at 103.333 (unrolled 53.333 back to file 22.857): the plateau's fresh entry is the
        step under the same-3-weeks scenario, no SFX (MUSIC-PLAN hard hit 103.22)
1:45.3  [VIDEO] BR-4 IN → 1:48.4 (3.16 s): hands completing a sign-up flow on a phone (→ hand:fade (broll-fade, 0.50s))
1:45.3  [CAPTION] ON → 1:48.4 (BR-4)
1:45.3  SAY:  "The growth engineer adds an AI step to onboarding that sets up the product differently"
1:48.4  [DIAGRAM] aarrr-funnel-base IN → 1:53.9 (Type 2 still): Acquisition / Activation / Retention / Referral / Revenue, no
        year anywhere, all stages neutral (cross-fade + scale-in → hand:xfade-scale (container-xfade, 0.35s))
1:49.9  SAY:  "for every new signup. And within days, you know whether more of them activate."
1:51.2  [DIAGRAM] aarrr-funnel-within-days takeaway 'WITHIN DAYS / you know whether more of them activate' fades up ON 'within'
        111.18 (the folded motion-type card)
1:53.2  [DIAGRAM] aarrr-funnel-activation ACTIVATION lights (+ AI STEP chip), the other four stages dim, ON 'activate.' 113.18
1:53.9  [DIAGRAM] loop-s2-base IN → 2:02.1: the slow loop RETURNS where s1 left off (TEST SET + GATE lit), hub '3 weeks'
        (digits) (cross-fade + scale-in → lib:melt-rgb-short-4 (MELT-transform, 0.44s); marquee candidate: the loop returns, see TRANSITIONS)
1:53.9  SAY:  "The product engineer spends those three weeks on an eval set and a retrieval fix."
1:56.4  [DIAGRAM] loop-s2-eval-pulse TEST SET pulse rings (the eval set) ON 'eval' 116.44, ~0.6 s, back to base
1:57.7  [DIAGRAM] loop-s2-retrieval RETRIEVAL FIX + the GATE → FIX arrow light ON 'retrieval' 117.68
1:58.5  [DIAGRAM] loop-s2-day3 dimmed dashed chip 'nothing to show on day 3' ON 'Nothing' 118.50
1:58.5  SAY:  "Nothing to show on day three. And that eval set outlives this model."
2:01.0  [DIAGRAM] loop-s2-upgrade MODEL UPGRADE + the RETURN arrow light, takeaway 'That eval set outlives this model.' ON
        'outlives' 121.04, holds to 122.10
2:02.1  [TRANSITION] F4 cover→face cut-in → hand:film-burn (face-cut, 0.76s) (face pick)
2:02.1  [FACE] F4 IN → 2:06.1 (blackdetect 122.100-126.100); its one join 125.9 sits inside the 0.5 s edge margin: no punch-in,
        no light leak
2:02.1  [CAPTION] ON → 2:06.1 (F4)
2:02.3  [KT-PANEL] kt-side-panel RIGHT 'GROWTH ENGINEER / RAPID RESULTS / THIS WEEK' slides in ON 'Rapid' 122.32 (Mike
        shifts left) · [WHOOSH] `swoosh-1.mp3` (kinetic-text swoosh-1, mood_class neutral) file start 122.15
2:02.3  SAY:  "Rapid results on one side and compounding quality on the other side."
2:04.5  [TRANSITION] kt-whip-cut on the same take ON 'compounding' 124.48, removes the right panel → hand:kt-whip-cut (kt-whip-cut, 0.37s) (bucket 3,
        face) · [WHOOSH] `whoosh-4.mp3` (kinetic-text whoosh-4, mood_class neutral) file start 124.14
2:04.5  [KT-PANEL] kt-side-panel LEFT 'PRODUCT ENGINEER / COMPOUNDING QUALITY / THE EVAL SET / OUTLIVES THE MODEL' slides in ON
        'compounding' 124.48 (Mike shifts right), holds to the 2:06.1 cut · [WHOOSH] `swoosh-2.wav` (kinetic-text swoosh-2,
        mood_class neutral) file start 124.41
```

## CH4 - THE BIAS (2:06.1-2:53.1, Bed B continues, card OFF)
```
2:06.1  [TRANSITION] F4 face→cover out → hand:film-burn (face-cut, 0.76s) (face pick): the cardless CH4 entry (the screenplay's
        'house whip' resolved as the face pick), removes the left panel
2:06.1  [VIDEO] BR-5 IN → 2:09.6 (3.54 s): a hand reaching for a tool on a workbench (→ hand:fade (broll-fade, 0.50s))
2:06.1  [CAPTION] ON → 2:09.6 (BR-5)
2:06.3  [MUSIC] Bed B runs on (same merged placement, real file 45.86 in the repeat pass, no step)
2:06.3  SAY:  "Difference number three, the bias. What each one reaches first."
2:09.6  [IMAGE] IMG-3 IN → 2:12.1 (2.50 s): a glass funnel with glowing user particles; AI-still ingress → lib:glitchmonitor-1 (glitch-still, 0.64s),
        comp-level slow push
2:09.6  SAY:  "The growth engineer lives in the funnel. AI or not. Landing pages, analytics,"
2:11.3  [WHOOSH] `Cinematic Whoosh 02.wav` (cinematic-whoosh-02, mood_class neutral; measured peak 0.87 s, -40 dB at 1.35 s =
        0.48 s tail) file start 131.27 so the whoosh peaks ON the C1 reveal 132.14: the build into the marquee hit
2:12.1  [DIAGRAM] C1-s1-base IN → 2:19.5, the video's marquee reveal · [IMPACT] `DSGNImpt-single_impact_sound_-Elevenlabs.mp3`
        on the reveal: THE two-stack system-design diagram, GROWTH header bright, growth nodes neutral, PRODUCT and SHARED
        dimmed .30 (→ lib:spin-twirl-cw (SPIN-newfacet, 0.72s), MARQUEE candidate); impact = dsgn-impact-elevenlabs, mood_class neutral; measured peak 0.09 s,
        -40 dB at 0.94 s = 0.85 s tail, file start 132.05 so the hit lands ON the reveal (MUSIC-PLAN hard hit 132.14; Bed B
        enters its next section at 133.81, no seam under the walk)
2:12.9  [DIAGRAM] C1-s1-web 'Web + ad platforms' lights ON 'landing' 132.94
2:14.1  [DIAGRAM] C1-s1-analytics 'Analytics + attribution' lights ON 'analytics' 134.14
2:15.1  [DIAGRAM] C1-s1-crm 'CRM / marketing automation' lights ON 'market' 135.06 (label keeps the postings' 'marketing')
2:15.1  SAY:  "market automation, the A/B testing framework, and now AI on top."
2:15.8  [DIAGRAM] C1-s1-cdp 'CDP' lights in sequence, unspoken, 135.84
2:16.5  [DIAGRAM] C1-s1-experiment 'Experiment framework' lights ON 'the A/B' 136.48
2:17.7  [DIAGRAM] C1-s1-outbound 'Outbound + content pipelines' lights in sequence, unspoken, 137.72
2:18.8  [DIAGRAM] C1-s1-agents 'Agent workflows into GTM' lights ON 'AI' 138.78, holds to 139.48
2:19.5  [IMAGE] IMG-4 IN → 2:22.3 (2.84 s): a glowing neural core inside a translucent product chip; AI-still ingress
        → lib:glitchmonitor-3 (glitch-still, 0.60s), comp-level slow push
2:19.5  SAY:  "The product engineer lives in the feature and now the model inside of it,"
2:22.3  [DIAGRAM] C1-s2-base IN → 2:31.2: PRODUCT header bright, product nodes neutral, GROWTH and SHARED dimmed (state change,
        quiet swap → hand:xfade (container-xfade, 0.25s))
2:22.3  [MUSIC] the file's own 62-66 settle lands at 142.5-146.5: the bed breathes at the state change, no written dip
        (MUSIC-PLAN hard hit 142.32)
2:23.9  [DIAGRAM] C1-s2-prompting 'Prompting + tool use' lights ON 'prompting' 143.92
2:23.9  SAY:  "prompting and retrieval, the eval harness,"
2:24.3  [DIAGRAM] C1-s2-retrieval 'Retrieval (RAG, vector DB)' lights ON 'retrieval' 144.32
2:24.8  [DIAGRAM] C1-s2-routing 'Model routing' lights in sequence, unspoken, 144.80
2:25.3  [DIAGRAM] C1-s2-evalharness 'Eval harness' lights ON 'the eval harness' 145.28
2:26.2  [DIAGRAM] C1-s2-latency 'Latency + cost monitoring' lights in sequence, unspoken, 146.18
2:26.5  [DIAGRAM] C1-s2-guardrails 'Guardrails' lights ON 'guardrails' 146.52
2:26.5  SAY:  "guardrails for when the model should abstain and an interface built for when a"
2:28.7  [DIAGRAM] C1-s2-featureui 'The feature UI' lights ON 'an interface' 148.68, holds to 151.22
2:30.1  SAY:  "model is wrong sometimes. And the middle is shared. Model APIs, agents,"
2:31.2  [DIAGRAM] C1-s3-base IN → 2:37.3: SHARED header bright, both stacks half-lit .62 (quiet swap → hand:xfade (container-xfade, 0.20s))
2:32.8  [DIAGRAM] C1-s3-llm 'LLM APIs' + both connector wires light ON 'Model' 152.84
2:34.3  [DIAGRAM] C1-s3-agentsorch 'Agents + orchestration' lights ON 'agents' 154.34
2:35.2  [DIAGRAM] C1-s3-evals 'Evals' lights ON 'evals' 155.16
2:35.2  SAY:  "evals, Python plus TypeScript. The growth engineer takes a business problem,"
2:35.9  [DIAGRAM] C1-s3-pyts 'Python + TypeScript' lights ON 'Python' 155.90, holds to 157.32
2:37.3  [RECEIPT] C4c IN → 2:41.9 (4.62 s): CrowdStrike 'What You'll Do' bullet (view c, distinct crop) (→ hand:xfade-scale (container-xfade, 0.35s)).
        treatment: highlight
        (settling push) [HIGHLIGHT] on 'Translate marketing business problems into technical designs and working applications',
        onset 'business' 158.72
2:39.7  SAY:  "a low conversion rate and ships the fix."
2:41.9  [RECEIPT] C5c IN → 2:48.6 (6.63 s): Citian 'product-minded software engineer' paragraph + the 'Choose the right technique'
        bullet (view c) (→ hand:xfade-scale (container-xfade, 0.35s)). treatment: highlight
        (settling push) [HIGHLIGHT] wipe 1 on 'the difference between a convincing demo and a dependable product', onset
        'convincing' 163.88; wipe 2 on 'or no AI at all', onset 'when' 166.42 ('when plain software beats AI')
2:41.9  SAY:  "The product engineer knows a convincing demo from a dependable product and when"
2:46.7  SAY:  "plain software beats AI,"
2:48.6  [TRANSITION] F5 cover→face cut-in ON 'beats AI,' → hand:film-burn (face-cut, 0.76s) (face pick)
2:48.6  [FACE] F5 IN → 2:53.1 (blackdetect 168.567-173.067); its one join 172.767 sits inside the 0.5 s edge margin: no
        punch-in, no light leak
2:48.6  [CAPTION] ON → 2:53.1 (F5; the as-heard 'the other lean' is captioned 'leans')
2:48.6  [MUSIC] Bed B's lower env-7 run (file 88-98) arrives at 168.5: a settle under the verdict into the card, no SFX
        (MUSIC-PLAN hard hit 168.567)
2:48.7  [KT-PANEL] kt-side-panel RIGHT 'GROWTH ENGINEER / DISTRIBUTION / DATA / THE FUNNEL' slides in ON 'one' 168.70 (Mike
        shifts left) · [WHOOSH] `swoosh-1.mp3` (kinetic-text swoosh-1, mood_class neutral) file start 168.53
2:48.7  SAY:  "one leans towards distribution and the other lean towards the model and the"
2:50.6  [TRANSITION] kt-whip-cut on the same take ON 'the' 170.62 ('the other'), removes the right panel → hand:kt-whip-cut (kt-whip-cut, 0.37s)
        (bucket 3, face) · [WHOOSH] `whoosh-4.mp3` (kinetic-text whoosh-4, mood_class neutral) file start 170.28
2:50.6  [KT-PANEL] kt-side-panel LEFT 'PRODUCT ENGINEER / THE MODEL / AND THE USER' slides in ON 'the' 170.62 (Mike shifts
        right), holds to the card · [WHOOSH] `swoosh-2.wav` (kinetic-text swoosh-2, mood_class neutral) file start 170.55
2:52.4  SAY:  "person using it."
2:53.1  [TRANSITION] F5 face→cover out into the CH5 title card, removes the left panel → hand:film-burn (face-cut, 0.76s) (face pick);
        the burn peaks on the face's last frame 173.067, the card's flip takes over at the waived cut 173.085
```

## CH5 - WHICH ONE (2:53.1-3:26.1, Bed C `up-in-the-atmos`, CARD ON)
```
2:53.1  [CARD] CH5 title-card-CH5 'WHICH ONE?' · [IMPACT] `card-impact-layered.wav` (card-impact-layered, mood_class epic; measured peak 0.03 s, -40 dB at 0.81 s = 0.78 s tail) file start 173.07
        · [TRANSITION] card presentation → rmn:flip (card, 0.50s) (the same card pick); edit-time pause >= 1.0 s at the WAIVED cut
        173.085 (the -54.9 dB bin between 'it.' and 'So', `card_cut_waivers` in GRAPH-PROGRESS.json; no word clipped), zero
        spine time (MUSIC-PLAN hard hit 173.085)
2:53.1  [MUSIC] bed change B → C: Bed B fades 0.4 s from the card's first frame (file 92.65, never into its 98-103 silence),
        0.6 s breath, Bed C `up-in-the-atmos` (Bellodrone) fades in 0.5 s from file 136.54, full at file 137.04 on 'So' 173.14;
        seat -18 under (gain -29.5 dB), END-PINNED so its closing hit (file 183.30) lands on 'channel.' → 3:39.7
2:53.1  [VIDEO] BR-6 IN → 2:55.2 (2.06 s): a job-interview handshake (dark re-source, visual-qa PASS) (→ hand:fade (broll-fade, 0.50s))
2:53.1  [CAPTION] ON → 2:55.2 (BR-6)
2:53.1  SAY:  "So which one do you hire first?"
2:55.2  [RECEIPT] C7b IN → 3:00.8 (5.64 s), two files: `C7b-govwell-title-block` (GovWell masthead, 'AI Product Engineer',
        the Location / Employment Type sidebar) settles 175.16-177.00, then `C7b-govwell-closing-gap-bullet` (the 'What you'll
        do' first bullet, tight crop) 177.00-180.80 (cross-fade → hand:xfade-scale (container-xfade, 0.35s)). treatment: highlight
        (settling push) [HIGHLIGHT] on 'Closing the gap between "good today" and "reviewers trust it completely" is real,
        immediate work.', onset 'wrong' 178.04
2:55.2  SAY:  "If users already touch your AI feature and it is wrong too often,"
2:59.5  SAY:  "the product engineer first."
3:00.8  [RECEIPT] C6 IN → 3:05.0 (4.22 s): Fictiv / MISUMI Americas 'Senior AI Growth Engineer' Greenhouse title block +
        'builds the systems that power customer acquisition', no compensation line (→ hand:xfade-scale (container-xfade, 0.35s)). treatment: pan
        [MOTION] lib:motion-3d-pan-1-left (a second real growth posting shown as an OBJECT; not the move C4a or C5a took)
3:00.8  SAY:  "If the product works and you have a funnel to feed the growth engineer,"
3:05.0  [VIDEO] BR-7 IN → 3:07.8 (2.76 s): a developer at a desk at night, dual monitors (→ hand:fade (broll-fade, 0.50s))
3:05.0  [CAPTION] ON → 3:07.8 (BR-7; caption breaks the sentence 'growth engineer. Which one')
3:05.0  [MUSIC] Bed C on its final env-8 plateau (file 148.9), seat -18 under, no move (MUSIC-PLAN hard hit 185.02)
3:05.0  SAY:  "Which one should you become?"
3:06.4  SAY:  "If the business number moving lights you up and you're fine throwing away a"
3:07.8  [CONTAINER] become-compare-s1 IN → 3:16.9: the DECLARED A-vs-B card 'Which one should you become', left row 1 'the
        business number moving lights you up' ON 'lights' 187.78 (cross-fade + scale-in → lib:spin-twirl-ccw (SPIN-newfacet, 0.72s); COMPARISON_REFS)
3:09.1  [CONTAINER] become-compare-s2 left row 2 'you're fine throwing away a week's work when the test lost' ON 'you're' 189.06
3:10.3  SAY:  "week's work when the test said it lost, growth engineer."
3:12.9  [CONTAINER] become-compare-s3 gold GROWTH ENGINEER label lights ON 'growth' 192.86 (role-label pop motion) · [ACCENT]
        `cash-register.wav` (kinetic-text, mood_class neutral) file start 192.69
3:13.6  [CONTAINER] become-compare-s4 right row 'a pass rate climbing lights you up' ON 'If' 193.62
3:13.6  SAY:  "If a pass rate climbing lights you up, product engineer."
3:16.1  [CONTAINER] become-compare-s5 green PRODUCT ENGINEER label lights ON 'product' 196.14 · [ACCENT]
        `wooden-rattle-whoosh.wav` (kinetic-text, mood_class neutral) file start 195.97
3:16.9  [IMAGE] IMG-5 IN → 3:20.8 (3.87 s): photoreal, a lone founder at a desk late at night, warm rim light; AI-still ingress
        → lib:glitchmonitor-5 (glitch-still, 0.64s), comp-level slow push
3:16.9  SAY:  "And in my experience, a founding AI engineer ends up being both."
3:19.7  [KT-POP] role LABEL A 'GROWTH / ENGINEER' pops lower right over IMG-5 ON 'ends' 199.68 (kt-keyword-pop motion) ·
        [ACCENT] `cash-register.wav` (kinetic-text, mood_class neutral) file start 199.51
3:20.3  [KT-POP] role LABEL B 'PRODUCT / ENGINEER' pops stacked beside it ON 'being' 200.26 (0.58 s later, the 2023 spacing),
        both lit ON 'both.' 200.42, removed by the F6 cut-in 200.77 · [ACCENT] `wooden-rattle-whoosh.wav` (kinetic-text,
        mood_class neutral) file start 200.09
3:20.8  [TRANSITION] F6 cover→face cut-in → hand:film-burn (face-cut, 0.76s) (face pick)
3:20.8  [FACE] F6 IN → 3:26.1 (blackdetect 200.767-206.100); its one join 205.733 sits inside the 0.5 s edge margin: no
        punch-in, no light leak
3:20.8  [CAPTION] ON → 3:26.1 (F6)
3:20.8  SAY:  "Either way you're an AI engineer."
3:23.3  SAY:  "The title just tells you which number you're accountable for."
3:26.1  [TRANSITION] F6 face→cover out (no card, Bed C runs on) → hand:film-burn (face-cut, 0.76s) (face pick)
```

## CH6 - THE CLOSE (3:26.1-3:39.7, Bed C continues, card OFF)
```
3:26.1  [CONTAINER] C2-s4-s1 IN → 3:31.7: the recap card 'Three differences', both role labels (cross-fade + scale-in
        → hand:xfade-scale (container-xfade, 0.35s)) · [KT-POP] LABEL A 'GROWTH / ENGINEER' pops ON the card's entry 206.10 · [ACCENT] `cash-register.wav`
        (kinetic-text, mood_class neutral) file start 205.93
3:26.2  [MUSIC] Bed C steps +2 dB (CH6 seat -16 under, gain -27.5 dB, 0.5 s ramp from sh(206.22)): the lift into the close
        (MUSIC-PLAN hard hit 206.22)
3:26.2  SAY:  "Three differences,"
3:26.7  [KT-POP] LABEL B 'PRODUCT / ENGINEER' pops beside it 206.70 (0.6 s after A) · [ACCENT] `wooden-rattle-whoosh.wav`
        (kinetic-text, mood_class neutral) file start 206.53
3:27.3  SAY:  "the scoreboard, the clock and the bias. Same tools, different scoreboard."
3:27.5  [CONTAINER] C2-s4-s2 chip '01 The scoreboard' lights ON 'scoreboard' 207.50
3:28.4  [CONTAINER] C2-s4-s3 chip '02 The clock' lights ON 'clock' 208.38
3:29.2  [CONTAINER] C2-s4-s4 chip '03 The bias' lights ON 'bias' 209.16
3:29.8  [CONTAINER] C2-s4-s5 bookend 'Same tools, different scoreboard.' lands ON 'Same' 209.84, holds to 211.70
3:31.7  [TRANSITION] F7 cover→face cut-in → hand:film-burn (face-cut, 0.76s) (face pick)
3:31.7  [FACE] F7 IN → 3:39.7 EOF (blackdetect 211.700-219.663), the CTA hold to the last frame; its one join 219.267 sits inside
        the 0.5 s edge margin: no punch-in, no light leak
3:31.7  [CAPTION] ON → 3:39.7 (F7)
3:31.8  SAY:  "And if that cleared it up, hit that like button and subscribe."
3:35.1  SAY:  "If you're not subscribed already,"
3:36.6  SAY:  "there's a lot more AI engineering content to come on this channel."
3:39.4  [MUSIC] Bed C's closing hit (file 183.30, bar 84) lands ON 'channel.' 219.40 after its one-beat break under 'on this';
        the music IS the close, no SFX layered on it (MUSIC-PLAN hard hit 219.40)
3:39.7  [TRANSITION] F7 face-out = EOF → hand:cut (face-cut, 0.00s): the picture ends ON 'channel.' at the spine's last frame, no
        transition, no held still (TRANSITION-PLAN 219.663)
3:39.7  [END] the video ends ON 'channel.' at the spine's last frame 219.66: mix cut with the 0.2 s trim fade (end_card_hold
        positions Bed C only), no held still, no rendered end card, no subscribe-button pop; YouTube end-screen elements are set
        at upload over the F7 CTA hold
```

## Orphan reconciliation (zero orphans, against `assets/` on 2026-10-23)
Every RENDERABLE file in `assets/` is PLACED above or marked here; source files (.html / .py / .json / .md) are exempt
(comp-build section 10).

**PLACED:**
- Video x7: BR-1-data-dashboard · BR-2-laptop-browsing · BR-3-stopwatch · BR-4-phone-signup · BR-5-reach-for-tool ·
  BR-6-interview-handshake · BR-7-developer-night-desk.
- Images x5 (stills, comp-level camera move): IMG-1-feature-module-gauge · IMG-2-calendar-sheets-hourglass ·
  IMG-3-glass-funnel-particles · IMG-4-neural-core-chip · IMG-5-founder-late-night-desk.
- Receipts x10 ids / 12 files: C12 (C12-title-date + C12-pragmatic-engineer-paragraph) · C4a-crowdstrike-title-block ·
  C5a-citian-title-block · C5b-citian-evals-duty · C7a-govwell-ai-stack · C10-hamel-evals-root-cause ·
  C4c-crowdstrike-translate-bullet · C5c-citian-demo-vs-dependable · C7b (C7b-govwell-title-block +
  C7b-govwell-closing-gap-bullet) · C6-fictiv-misumi-title-block. Treatments: 3 pan (C4a, C5a, C6) · 7 highlight · 0 push.
- Title slides x2: title-card-CH2 · title-card-CH5.
- Card slides x32 states: C2-s1-s1..s3 · C2-s1b-s1..s2 · C2-s2-s1..s6 · scoreboard-growth-s1..s5 · ship-to-learn-s1..s4 ·
  become-compare-s1..s5 · C2-s4-s1..s5 (each at its states.json cue).
- Diagrams x34 states (Type 2 stills): loop-s1-base / -test-set / -gate · aarrr-funnel-base / -within-days / -activation ·
  loop-s2-base / -eval-pulse / -retrieval / -day3 / -upgrade · C1-s1-base / -web / -analytics / -crm / -cdp / -experiment /
  -outbound / -agents · C1-s2-base / -prompting / -retrieval / -routing / -evalharness / -latency / -guardrails / -featureui ·
  C1-s3-base / -llm / -agentsorch / -evals / -pyts.
- Charts x2, ANIMATED IN CODE (Type 1): split-test · pass-rate-meter.
- SFX (post-mix): card-impact-layered x2 · Impact_Hit_01-2-18 x1 · DSGNImpt-single_impact_sound_-Elevenlabs x1 ·
  Cinematic Whoosh 02 x1 · kinetic-text swoosh-4 x1 · whoosh-4 x4 · swoosh-1 x3 · swoosh-2 x3 · cash-register x6 ·
  wooden-rattle-whoosh x6.

**REJECTED as comp inputs (spec only):**
- `charts/split-test-start.png`, `charts/split-test-mid.png`, `charts/split-test-payoff.png`,
  `charts/pass-rate-meter-start.png`, `charts/pass-rate-meter-mid.png`, `charts/pass-rate-meter-payoff.png`: the chart-builder
  DESIGN states for the two Type 1 animated charts. The comp animates both in code (comp-build section 7 forbids holding a chart
  PNG); the rows above name where each design state is reached.

**BENCH:** none on disk. The COVER-PLAN bench alternatives (C4b 'Success in this role is measured', C4 view d, C5 view d, the
EVALS gloss card, become-growth / become-product split cards, the static split-test card) were never acquired; nothing to place.
