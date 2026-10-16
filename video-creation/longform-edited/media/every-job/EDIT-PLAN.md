# every-job - EDIT-PLAN  (time-ordered event log, pre-build blueprint)

> AUTHORED off the graph's seed (`_previews/EDIT-PLAN.seed.md`, from `gen_editplan.py`) + `spine/ALL.d.desilenced.medium-words.json`
> + `spine/jumpcuts-final.json` (340 joins, 24 punch points) + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md
> (Decisions + Open flags) + the built assets' word-cued states (`assets/diagrams/_state-cues.md`, `assets/charts/*.spec.md`, the
> `assets/card-slides/<id>-sN.png` states defined in `assets/slide-sources/_shot.py`). Format:
> `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; per its §0 ORDER note the Remotion comp is built TO this log, the
> render confirms it. RE-AUTHORED 2026-10-07 for Mike's 21:05 face ruling (PROJECT-LOG): punch-ins and LIBRARY light leaks now land
> ON the desilencer / defumbler joins inside the FACE windows; the mid-hold leak pulses and the off-join re-frames are gone.
> Watch file: `spine/ALL.d.desilenced.mp4` (1121.00 s / 18:41.0, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause.
> The five title-card pauses (CH2 1:02.9 · CH3 3:52.7 · CH4 7:26.0 · CH5 11:44.0 · CH7 14:39.6) are edit-time inserts, the
> graph default 1.5 s each (MUSIC-PLAN canvas), baked at `card_pauses` and routed by `sh()` (+7.5 s by the end). Never
> re-apply a chain shift: every value below is already a `d.desilenced` coordinate (the freeze-fix shift after 17:55.3 is
> already in the word JSON).
> SAY lines: one per transcript segment on the seed's own start (215). Their text is rebuilt from the word JSON with the
> AS-RECORDED mishear list applied word by word (the seed's substring replace had corrupted 32 of them: "sAId", "brAIn",
> "ResTAOrants", "freezeze", "free market" turned into "freeze market"); "percent" (1:38.8) and "stablecoins" (15:19.1) are
> the two words restored from large-v3, and the closing line reads "freeze" (Mike's ruling).
> TRANSITIONS: Transition ids are RESOLVED from TRANSITION-PLAN.json; every cut carries exactly ONE (269 = 245 scene
> changes + the 24 punch-leak joins). The ids an earlier reconcile had resolved were reset on purpose: the face-join ruling re-opens TRANSITIONS.md (the
> transition-strategist re-authors it and picks the video's rotated set of 3-4 `lib:lightleaks-*` ids for the punch-leak
> rows, usage-ledger slot `face_leak`), then `reconcile_docs.py --apply` fans every pick back in. The two plain edges carry
> their id in the text: the video OPENS on F1 (hand:cut, 0:00.2) and ENDS on F17 (hand:cut, 18:41.0). House defaults until
> TRANSITIONS.md says otherwise: Envato = fade, container / chart / receipt swaps = cross-fade + 0.93→1 scale-in, in-container
> state swaps = 6-8 frame cross-fades, ONE card move for all five cards, ONE face look on every face cut in and out.
> SFX: music + SFX are an ffmpeg POST-mix (comp-build.md §9), never in the comp. Every kit file below was picked by its
> MEASURED audible tail and RE-MEASURED by this pass (ffmpeg decode, 22.05 kHz mono, 10 ms RMS windows, tail = the last
> window within 40 dB of the peak; table at the end). "peak" = where the transient sits in the file, so the file starts that
> much BEFORE the hit frame; a riser is trimmed ON its measured peak so it ENDS on the hit. Hard hits the music already
> carries say "SFX: none (file-carried)" on purpose: fewer, bigger hits (WHEN-TO-USE-IMPACTS.md). Every hit sits UNDER the VO.
> FACE (17 windows, AS-RECORDED blackdetect): F1 to F10 air the Higgsfield background-swap clips (Mike, PROJECT-LOG
> 2026-10-07; comp-build §3b), full-frame and PRE-FRAMED, so WITHOUT FACE_REFRAME on top, spine audio kept: F1 BUILT and
> APPROVED, F2 BUILT (look check pending), F3 to F10 generating (raw sources for F3 to F8 staged in `assets/face-swap/`); a
> clip that fails QA airs as recorded. F11 to F17 air as recorded with the measured FACE_REFRAME (`assets/face-reframe.json`:
> scale 1.478, x -798, y -287; FACE_POINT 960,432). PUNCH-IN + LIGHT LEAK (overlays.md §1, longform-edited.md rule 5): a hard
> scale step about FACE_POINT and a LIBRARY leak (LIGHT LEAKS family, flash peaking on the join frame, screen blend, under the
> captions) land ON every punch point of `spine/jumpcuts-final.json`: 24 points in 12 windows (F1 x2 · F7 · F8 · F9 · F10 ·
> F11 x3 · F12 · F13 · F14 · F15 · F16 · F17 x10). Successive points in one window ALTERNATE (in, back to base, in); SUBTLE
> ~6% on the swap windows (the model bakes a slight push), ~15-20% on the recorded ones. F2 to F6 have NO interior join: no
> punch, no leak. No mid-hold pulse, no fixed +2 s punch, the synthetic glow is retired. The one other zoom is the vibe-cut
> crash zoom ON the F16 cut (WHEN-TO-USE-IMPACTS), whose interior join then steps back to base. Captions ON over the 17 FACE
> windows ONLY, never over a cover.
> HONESTY TIERS on screen: charts and diagrams bake the C3 tier badge; b-roll, stills and receipts get the transparent
> `diagrams/C3-badge-deployed|claimed|forecast.png` overlays where marked; every AI still of a robot carries an
> 'ILLUSTRATION' tag and the household robot is always FORECAST (PROJECT-LOG Open flags). CH2 + CH3 carry the Halloween
> look (themed frames and grade only; receipts keep their real pixels). Mike's rulings honoured: no Shapiro anywhere, the
> Huang clip MUTED with its burned-in context caption on every frame, the CH3 card KEPT, Bed B = the Harvester master, the
> hallway as two angles, no receipt pops over the opening face, no image-motion clips in this video (no `assets/img-motion/`,
> none ruled).
> ZERO ORPHANS: every renderable file in assets/vid, img, receipts, charts, diagrams, title-slides, card-slides AND
> face-swap is PLACED below with a timecode or marked BENCH / REJECTED in the reconciliation at the end.


## CH1 - THE SAFE JOB (0:00.0-1:02.9, Bed A `sleeper-cell`, card OFF; house look)
```
0:00.0  [MUSIC] Bed A `sleeper-cell` (Wicked Cinema, Sleeper Cell, instrumental) from file 0.0, COLD, no fade-in, seat
        -22 dB under VO (remotion gain -27.1 dB) → 1:02.9 · HARD HIT 0.0: the sparse build under the three locked
        lines IS the hook bed, nothing hot on word one (Mike's pick by ear); SFX: none (file-carried)
0:00.0  [MUSIC] LIFT +4 dB on Bed A's sparse build (file 0-28.4 measures -19.2 LUFS, 0.1 s ramp) → 0:28.4
0:00.0  [CONTAINER] black-lead (card) IN → 0:00.2: the spine's own 5-frame (0.167 s) black lead, deck-navy, nothing
        else (under blackdetect's 0.3 s floor); a hard cut to F1, no transition (the video opens here)
0:00.0  SAY:  "First they told you learn to code, but then AI learned to code. So then they told you scratch that go
              learn a trade"
0:00.2  [FACE] F1 opens the video ON face after the 5-frame lead → 0:10.4 "First they told you learn to code, but then
        AI learned to code. So then they told you, scratch that, go learn a trade, because a chatbot can't fix a
        toilet" (both LOCKED opening lines, one shot); a plain open, hand:cut, no glitch (the video starts here) ·
        AIRS AS THE HIGGSFIELD BG-SWAP (Mike, PROJECT-LOG 2026-10-07, comp-build §3b): [VIDEO-LAYER] BUILT and
        APPROVED (Mike 2026-10-07, 'the background of the face is good'): assets/face-swap/F1-higgsfield-bg-swap.mp4,
        two re-timed halves (F1a 0.167-3.9, F1b 3.9-10.4) joined ON the desilencer join 3.9, so the generation seam IS
        the second punch point; the window starts at clip 0.4 s (F1-higgsfield-bg-swap.json), SWAP-RETIME ok on both
        halves; full-frame over the window, PRE-FRAMED so NO FACE_REFRAME on top (comp-build §3a), video only, SPINE
        AUDIO KEPT, Seedance 480p; blank white wall with the blue light continuing across it (door, light fixture and
        greeting card erased) · two interior joins = two punch points (1.133, 3.9, below)
0:00.2  [CAPTION] ON → 0:10.4 (F1 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; 'chatbot', 'train')
0:01.1  [PUNCH-IN] F1 punch 1 of 2 ON the desilence-final join 1.133 s (frame 34, spine/jumpcuts-final.json): step IN
        on 'learn to code', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap clip already bakes a slight push
        (comp-build §3b), hand:punch; holds to the next join 0:03.9
0:01.1  [LIGHTLEAK] F1 library light leak 1 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
0:03.9  [PUNCH-IN] F1 punch 2 of 2 ON the desilence-coarse join 3.900 s (frame 117, spine/jumpcuts-final.json): step
        BACK to the base frame on 'So then they told you', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap
        clip already bakes a slight push (comp-build §3b), hand:punch; holds to the face-out 0:10.4
0:03.9  [LIGHTLEAK] F1 library light leak 2 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
0:07.7  SAY:  "Because a chatbot can't fix a toilet"
0:10.4  [TRANSITION] face→cover F1 out → lib:blocks-max-1 (face-cut, 0.96s) (face pick)
0:10.4  [RECEIPT] C20 R(other) assets/receipts/C20-hinton-plumber.mp4 IN → 0:13.8 (Hinton, The Diary of a CEO,
        2025-06-16; caption 'Train to be a plumber.' burned on every frame; head-trimmed so it opens on his close-up;
        muted, from clip 0, 6.16 s for a 3.44 s slot). Still twin C20-hinton-plumber-captioned.png = the face-out
        transition's incoming frame + fallback. `[VERIFY wording]`
0:10.4  SAY:  "The godfather of AI said it train to be a plumber and the CEO of Nvidia said we're going to need
              hundreds of thousands of"
0:13.8  [RECEIPT] C21 + R14 two-card stack IN → 0:20.4 (the same man, both dates on screen): R14 R(article) lands
        FIRST as the back card on 'the CEO of Nvidia' (TechSpot 2024-02-26: Huang at the World Government Summit,
        Dubai, 'It is our job to create computing technology such that nobody has to program') `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
0:15.7  [RECEIPT] C21 R(article) slides in FRONT of R14 on 'we're going to need' (Fortune, Huang via Channel 4 News,
        'we are going to need hundreds of thousands of them': electricians, plumbers, carpenters; the page's own
        dateline kept per visual-qa round 1); push-in onto 'hundreds of thousands' @0:16.3, holds to 0:20.4 `[VERIFY]` → hand:slide-in (container-xfade, 0.30s)
0:17.9  SAY:  "electricians plumbers and carpenters but listen to how the godfather of AI"
0:20.4  [CONTAINER] hinton-quote-full (card) IN → 0:26.3: Hinton's full sentence 'A good bet would be to be a plumber.
        Until the humanoid robots show up.', last clause in amber, source line The Diary of a CEO, 2025-06-16 (a
        second asset, not a C20 reuse) · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
0:22.7  SAY:  "Finished that sentence a good bet would be to be a plumber until the humanoid robots show up and the
              humanoid robots"
0:23.9  [CONTAINER] hinton-quote-full spotlight (comp-level push): 'a good bet would be to be a plumber' lifts on 'a
        good bet'; the amber clause brightens on 'plumber' @0:26.0, just before 'until' cuts to BR-1
0:24.5  [RISER] risers/Tension_Rise_Logo_Reveal_3.wav STARTS (measured peak 3.82 s into the file; trimmed ON the peak
        so the riser ENDS on the hook landing at 0:28.3); builds under 'until the humanoid robots show up' and BR-1,
        UNDER the VO
0:26.3  [VIDEO] BR-1-humanoids-walking-dark IN → 0:28.3 (E1 slot: humanoid robot walking toward camera dark studio) ·
        muted, from the clip head · Envato fade · the hook riser builds under it → hand:fade (broll-fade, 0.50s)
0:28.3  [RISER→IMPACT] HOOK LANDING on the F2 face cut: the riser ends on this frame · [IMPACT]
        Impacts/card-impact-hit01-3-short.wav (Mike's own Impact_Hit_01-3 pick, trimmed; measured: peak 0.13 s into
        the file, audible tail 2.11 s to -40 dB) file starts 0:28.17 so its peak lands ON the cut; mixed UNDER the VO
0:28.3  [TRANSITION] cover→face cut-in F2 → lib:blocks-max-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
0:28.3  [FACE] F2 → 0:31.2 "And the humanoid robots are showing up" · AIRS AS THE BG-SWAP [VIDEO-LAYER] BUILT
        (assets/face-swap/F2-higgsfield-bg-swap.mp4 + .json sidecar, SWAP-RETIME ok), Mike's look check pending (as
        F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded with
        FACE_REFRAME) · NO interior join (jumpcuts-final.json: its only join sits inside the 0.5 s edge margin): NO
        punch-in, NO light leak (overlays.md §1)
0:28.3  [CAPTION] ON → 0:31.2 (F2 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
0:28.4  [MUSIC] HARD HIT 28.36: the full level of Bed A enters at file 28.4 on 'And', 0.1 s after the face cut; the
        drop IS the landing, the +4 dB lift releases on the same frame
0:30.0  SAY:  "Are showing up about 13,000 of them shipped in"
0:31.2  [TRANSITION] face→cover F2 out → lib:blocks-short-1 (face-cut, 0.96s) (face pick)
0:31.2  [CHART] H0 (Type 1 animated, code) IN → 0:35.2: eyebrow, 'about', sub-line and 13 ghost humanoid figures set,
        counter at 0 · cross-fade + 0.93→1 scale-in
0:31.3  [CHART] H0 counter 0 → 13,000 (easeOutCubic), the 13-figure unit strip fills in lockstep, lands just after
        '000' @0:32.2 (Omdia via AgiBot, 'about' on screen) `[VERIFY]`
0:33.0  [CHART] H0 DEPLOYED badge stamps top-right on 'shipped' (scale 1.25 → 1)
0:33.6  [CHART] H0 '2025' in the sub-line flashes cyan on '2025'
0:33.6  SAY:  "2025 and one of them held a job at a"
0:35.2  [VIDEO] BR-2-humanoid-factory-assembly IN → 0:39.2 (E2 slot: humanoid robot working in car factory assembly
        line) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
0:36.8  SAY:  "BMW factory for 11 months and the day that one of those work inside of your house"
0:39.2  [IMAGE] IMG-1-robot-sunlit-entryway-staircase IN → 0:42.5 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-max-1 (glitch-still, 0.96s) (AI still)
0:42.5  [VIDEO] BR-3-plumber-under-sink IN → 0:44.4 (E3 slot: plumber working under kitchen sink close-up) · muted,
        from the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
0:42.5  SAY:  "You don't need to call a plumber. You don't need to call an electrician"
0:44.4  [VIDEO] BR-4-electrician-terminal-screwdriver IN → 0:46.3 (E4 slot: electrician wiring breaker panel close-up)
        · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
0:46.3  [VIDEO] BR-5-roofer-nail-gun-shingles IN → 0:48.0 (E5 slot: roofer nailing shingles on roof) · muted, from the
        clip head · Envato fade → hand:fade (broll-fade, 0.27s)
0:46.3  SAY:  "You don't need to call a roofer and it just doesn't stop with people who work with their hands"
0:48.0  [VIDEO] BR-6-welding-sparks-hands IN → 0:51.0 (E6 slot: worker hands close-up welding sparks workshop) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
0:51.0  [CHART] C5-tease (Type 1 animated) IN → 0:53.8: header + the ladder rail, no bars, no figures → hand:xfade-scale (container-xfade, 0.35s)
0:51.0  SAY:  "It goes all the way up even to brain surgeons now. There's a way to protect yourself from all this"
0:51.1  [CHART] C5-tease rungs 0..11 grow bottom first, 0.15 s apart (widths = 1180 x pay / 829,161) on 'goes all the
        way up' → 0:52.4
0:53.0  [CHART] C5-tease top bar's glow blooms, NEUROSURGEON fades in on its label slot on 'brain surgeons'
0:53.8  [MUSIC] HARD HIT 53.76: no move, the level-7 peak of Bed A holds through the open loop ('There's a way to
        protect yourself...') into the CH2 card: the answer stays withheld, the music does not resolve; SFX: none
0:53.8  [IMAGE] IMG-2-man-kitchen-table-paycheck IN → 0:57.7 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still)
0:56.6  SAY:  "We're going to get to that but first you need to see how deep this goes"
0:57.7  [VIDEO] BR-7-descending-dark-stairwell IN → 1:00.1 (E7 slot: camera descending dark stairwell corridor slow
        dolly) · muted, from the clip head · Envato fade · LEADING motion (pattern interrupt) → hand:fade (broll-fade, 0.50s)
1:00.1  [VIDEO] BR-8-hands-assembling-puzzle IN → 1:02.9 (E8 slot: puzzle pieces assembling on dark table macro) ·
        muted, from the clip head · Envato fade · the CH2 card leads in over its tail → hand:fade (broll-fade, 0.50s)
1:00.1  SAY:  "So let's go through it all piece by piece"
```

## CH2 - THE BRAIN WENT FIRST (1:02.9-3:52.7, Bed B `harvester`, CARD ON; the Halloween look ON)
```
1:02.9  [CARD] CH2 title-CH2 · [IMPACT] DSGNImpt · [TRANSITION] card presentation → rmn:slide (card, 0.40s) · "THE BRAIN WENT
        FIRST": Dripping red slasher type on black: the Halloween look turns ON here. The card scene LEADS IN over the
        tail of BR-8 and holds through the 1.5 s edit-time pause (readable >= 1 s, zero spine time). SFX file:
        Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (measured: peak 0.09 s into the file, audible tail 1.07 s
        to -40 dB): peak on the card-landing frame, rings out inside the pause's 0.6 s breath
1:02.9  [MUSIC] Bed A fades 0.4 s from the card start · 0.6 s breath · Bed B `harvester` (Wicked Cinema, Harvester,
        the background-vocals MASTER, Mike 2026-10-07) source_in 6.86, fades in over the last 0.5 s of the pause on
        its quiet pad, full on 'So before the robot'; seat -23 dB (remotion gain -30.0 dB); bar-aligned loop region
        180.91-208.74 (Remix-style, never a file restart) → 3:52.7 · HARD HIT 62.94 (bed change A to B)
1:02.9  [MUSIC] LIFT +5 dB on Bed B's pad (file 6.86-42 measures -17.0 LUFS; 2 s release over 1:39.0-1:41.0) → 1:41.0
1:02.9  [IMAGE] IMG-3-brain-circuitry-server-room IN → 1:06.1 · card-owned cut
        (the CH2 card lands on it), Halloween grade
1:02.9  SAY:  "So before the robot the brain went first every wave of automation before this one went after muscle"
1:06.1  [VIDEO] BR-9-worker-cranks-machine-wheel IN → 1:09.3 (E9 slot: vintage archive footage factory workers
        assembly line 1930s) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
1:09.3  [CONTAINER] automation-before-now-s1 (card) IN → 1:14.4: AUTOMATION, BEFORE: muscle (the factory, the assembly
        line) lit on 'The factory'; NOW dim · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
1:09.3  SAY:  "The factory the assembly line this one went after knowledge work the office. It's called labor"
1:11.3  [CONTAINER] automation-before-now-s2: BEFORE settles to done, AUTOMATION, NOW: knowledge work (the office)
        lights on 'this one went after knowledge work'
1:14.4  [CONTAINER] labor-substitution (card) IN → 1:19.8: LABOR SUBSTITUTION = the machine REPLACES the worker, HELPS
        struck through, REPLACES in red · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
1:15.5  SAY:  "Substitution the machine doesn't help the worker it replaces the worker and it's already showing up in
              the first nine months of 2026"
1:18.8  [CONTAINER] labor-substitution spotlight (comp-level push): REPLACES lifts on 'it replaces the worker'
1:19.8  [RECEIPT] C35 R(other) assets/receipts/C35-techcrunch-scroll.mp4 IN → 1:23.2 (TechCrunch's running list of
        2026 layoffs where the employer cited AI; fast scroll recording, muted, from clip 0; a recording already
        moves, no extra treatment) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
1:23.2  [RECEIPT] C34 stage 1: C34-top (Challenger, Gray and Christmas: banner, title, Publication Date Oct 01,
        subheadline) IN → 1:24.5, slow push (real pixels) `[VERIFY 120,136]` → hand:xfade-scale (container-xfade, 0.35s)
1:24.5  SAY:  "Companies blamed AI for more than a hundred and twenty thousand"
1:24.5  [RECEIPT] C34 stage 2: C34 (the AI line, 'cited in 120,136 job cut announcements... leading reason
        year-to-date') on 'Companies blamed AI'; comp highlight on 120,136 lands on 'a hundred and twenty thousand'
        @1:26.8 → 1:28.0 (guard 5: 'companies blamed AI', never 'AI killed') → hand:xfade (container-xfade, 0.20s)
1:28.0  [CHART] C11 (Type 1 animated, Halloween palette) IN → 1:33.8: header, baseline, dashed ghost tracks and both
        axis labels set → hand:xfade-scale (container-xfade, 0.35s)
1:28.1  [CHART] C11 2026 bar grows 0 → 520 px, 120,136 counts riding above it, on 'Announced job cuts' → 1:29.7
1:28.9  SAY:  "Announced job cuts that's about seven times the same stretch a year earlier and Stanford looked up real
              payroll data workers aged from"
1:30.5  [CHART] C11 2025 bar grows 0 → 75.2 px, 17,375 counts, on 'that's about seven'
1:31.1  [CHART] C11 orange bracket draws 2025 → 2026 on 'seven'; 'about 7x' fades up on 'times' @1:31.4
1:32.2  [CHART] C11 'Jan to Sep 2025' label brightens on 'same stretch a year earlier' `[VERIFY 17,375]`
1:33.8  [RECEIPT] C10 stage 1: C10-top (Stanford Digital Economy Lab, the Aug 12 2026 update headline) IN on
        'Stanford' → 1:36.2, slow push (real pixels) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
1:36.2  [RECEIPT] C10 stage 2: C10 real-site chart (headcount over time by AI exposure, 22 to 25 year olds, axis
        labels kept, never restyled) on 'workers aged from 22 to 25', slow push → 1:41.0 → hand:xfade (container-xfade, 0.20s)
1:37.4  SAY:  "22 to 25"
1:38.8  SAY:  "And the jobs most exposed to AI are running about 19 percent behind the people the same age in less
              exposed jobs now, but"
1:41.0  [CHART] C10R (Type 1 animated, Halloween) IN → 1:46.5, opens ON the old read: gap 15%, counter '15%', chip
        'July 2025: 15%' lit → hand:xfade-scale (container-xfade, 0.35s)
1:41.7  [CHART] C10R red bar shrinks, hatched gap widens, counter 15 → 19 locked to the bar, chip highlight crosses to
        'June 2026: 19%' on 'running about 19'
1:42.7  [CHART] C10R 'behind' flashes bone → blood → bone on 'behind'
1:45.4  [CHART] C10R row-A label 'less-exposed jobs' brightens on 'less exposed jobs'
1:46.5  [RECEIPT] R19 R(other) (BLS Employment Situation, September 2026) IN → 1:52.3; highlight '4.2 percent' on
        '4.2' @1:48.6 (the honest ceiling, guard 5) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
1:47.4  SAY:  "Unemployment is still 4.2 percent. So this is not mass unemployment"
1:52.3  [VIDEO] BR-10-applicant-walks-through-door IN → 1:56.1 (E10 slot: young professional waiting outside office
        door entry level job interview) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
1:52.3  SAY:  "Not yet, at least it's starting at the door with the entry-level job and every time I say this
              somebody's like relax"
1:56.1  [VIDEO] BR-11-man-shrugs-grey IN → 1:59.2 (E11 slot: man shrugging dismissive gesture talking relaxed) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
1:59.2  [MUSIC] HARD HIT 119.22: chorus 1 of Bed B (entered at 1:52.1, file 56) carries the cliche, the dissection and
        the chain from the file, no automation; SFX: none (file-carried)
1:59.2  [CONTAINER] new-jobs-cliche (card) IN → 2:04.5: TECHNOLOGY ALWAYS CREATES NEW JOBS in slasher-red type on
        grunge · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
1:59.2  SAY:  "Technology always creates new jobs. But what if we try to dissect the meaning of that phrase?"
2:02.5  [CONTAINER] new-jobs-cliche spotlight (comp-level): the scalpel / dissection line draws under the phrase on
        'dissect'
2:04.5  [CONTAINER] new-jobs-dissect (card) IN → 2:09.9: the same phrase pulled apart, a red strike on ALWAYS (he says
        'Technology creates new jobs'), and the line 'it isn't like that at all' → hand:xfade-scale (container-xfade, 0.35s)
2:04.5  SAY:  "Technology creates new jobs. The truth is it isn't like that at all"
2:07.2  [CONTAINER] new-jobs-dissect spotlight (comp-level): 'it isn't like that at all' lifts on 'The truth is'
2:09.9  [DIAGRAM] new-jobs-chain-s1 (Type 2 system-design, Halloween) IN → 2:18.3: TECHNOLOGY lights on 'Technology'
        (THE rich chain, shown ONCE, THE BALANCE) · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
2:09.9  SAY:  "Technology makes things cheaper cheaper frees up money that money builds new markets and the new
              markets need workers"
2:11.2  [DIAGRAM] new-jobs-chain-s2: arrow 1 + LOWER COSTS light on 'cheaper' (6-frame cross-fade swap)
2:12.6  [DIAGRAM] new-jobs-chain-s3: arrow 2 + FREED-UP MONEY on 'frees up money'
2:14.8  [DIAGRAM] new-jobs-chain-s4: arrow 3 + NEW MARKETS on 'new markets'
2:16.9  [DIAGRAM] new-jobs-chain-s5: arrow 4 + NEW JOBS, takeaway 'Every link has to hold for the new jobs to show
        up.' on 'need workers'
2:18.1  SAY:  "But what happens when the machines can do the new jobs too?"
2:18.3  [MUSIC] HARD HIT 138.33: the file's one 8-swell (file 84-86) lands under the question and settles on the
        break: a swell on the face line, not a dip; SFX: none
2:18.3  [TRANSITION] cover→face cut-in F3 → lib:blocks-max-3 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip) · 'But' starts 0.19 s before the picture edge: the comp cuts on the
        PICTURE edge, never the word box
2:18.3  [FACE] F3 → 2:21.7 "but what happens when the machines can do the new jobs too?" · AIRS AS THE BG-SWAP
        [VIDEO-LAYER] assets/face-swap/F3-higgsfield-bg-swap.mp4, generating (raw source staged); built at comp_build
        per comp-build §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that fails QA
        airs as recorded with FACE_REFRAME) · NO interior join (jumpcuts-final.json: its only join sits inside the 0.5
        s edge margin): NO punch-in, NO light leak (overlays.md §1)
2:18.3  [CAPTION] ON → 2:21.7 (F3 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
2:21.7  [TRANSITION] face→cover F3 out → lib:blocks-max-1 (face-cut, 0.96s) (face pick)
2:21.7  [DIAGRAM] new-jobs-chain-broken-s1 IN → 2:24.9: the intact, fully lit chain (pixel-identical to
        new-jobs-chain-s5, so the beat picks up where the chain left before F3)
2:21.9  SAY:  "Then the chain breaks at the very last link and we've seen what that looks like in the early"
2:22.5  [IMPACT] the chain SNAP: Impacts/Kick_Impact_01-short.wav (measured: peak 0.18 s into the file, audible tail
        0.36 s to -40 dB) file starts 2:22.28 so its peak lands ON the s2 swap frame; a tight punch UNDER the VO, no
        boom (the bed's swell already settles here)
2:22.5  [DIAGRAM] new-jobs-chain-broken-s2: the last arrow SNAPS (blood-red crack), NEW JOBS border turns dashed,
        takeaway 'The chain breaks at the very last link.' on 'breaks'; 4-frame comp shake on the swap
2:24.1  [DIAGRAM] new-jobs-chain-broken-s3: NEW JOBS struck through, relabeled DONE BY MACHINES in blood red, its icon
        turns into a robot, on 'last link'
2:24.9  [VIDEO] BR-12-antique-telephone-receiver IN → 2:28.4 (E12 slot: vintage archive telephone switchboard
        operators 1920s) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
2:27.3  SAY:  "1900s the telephone operator was one of the most common jobs for American women then came"
2:28.4  [IMAGE] IMG-4-1920s-telephone-exchange IN → 2:32.1 · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
2:32.1  [VIDEO] BR-13-rotary-phone-dialing IN → 2:35.7 (E13 slot: vintage automatic telephone exchange relay switching
        equipment archive) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
2:33.0  SAY:  "Automatic switching and most of those jobs were gone"
2:35.7  [RECEIPT] R1 R(article) (NBER Working Paper 28061, Feigenbaum and Gross) IN → 2:42.8: title page, then a push
        into the abstract's incumbent-operators sentence on 'but the women already in that job' @2:37.6; real pixels
        inside a torn-paper Halloween frame, never recolored → hand:xfade-scale (container-xfade, 0.35s)
2:35.7  SAY:  "The next generation found other work but the women already in that job often ended up in lower paying
              work or out of work"
2:42.8  [VIDEO] BR-14-horse-carriage-coachman IN → 2:46.2 (E14 slot: vintage archive horse drawn carriages city street
        1910s) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
2:42.8  SAY:  "And then there's the horse around 1915"
2:46.2  [CHART] horses-card (Type 1 animated, sepia / red Halloween) IN → 2:52.1: header + the 1915 block set, 20
        ghost horse outlines → hand:xfade-scale (container-xfade, 0.35s)
2:46.2  SAY:  "America had more than 20 million horses by"
2:47.1  [CHART] horses-card the 20 horses fill solid sepia, '20' counts 0 → 20, on 'more than 20 million horses' →
        2:48.2 (guard 6: more than 20 million) `[VERIFY USDA]`
2:48.9  [CHART] horses-card red arrow draws, '1960' fades in, on 'by 1960'
2:49.7  [CHART] horses-card wind-down: horses 20 → 4 go to ghost outlines (last first, 0.10 s apart), 2 and 3 become
        range outlines, horse 1 stays solid
2:49.7  SAY:  "1960 a few million the car didn't create a new job for the horses now"
2:50.0  [MUSIC] LIFT +4 dB on Bed B's mid section (file 114-165.2 measures -16.1 LUFS; 1 s ramps); it releases at
        3:41.2 so the file's own 1.7 s rest and the chorus-2 slam play unlifted → 3:41.2
2:51.5  [CHART] horses-card 'a few million' slams in (scale 1.12 → 1) + range sub-line + outline legend
2:52.1  [VIDEO] BR-15-vintage-1920s-sedan IN → 2:55.1 (E15 slot: vintage archive early automobiles model t driving
        street) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
2:55.1  [IMAGE] IMG-5-1920s-boomtown-factory-gates IN → 2:58.5 · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still)
2:55.1  SAY:  "Don't get me wrong there back then the new jobs did show up and it boosted the economy tremendously"
2:58.5  [VIDEO] BR-16-market-street-1906-archive IN → 3:02.4 (E16 slot: vintage archive busy city street 1920s crowds
        traffic) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
3:02.4  [VIDEO] BR-17-exchange-wiring-frames IN → 3:05.4 (E17 slot: vintage archive technicians installing telephone
        switchboard wiring frame) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
3:02.4  SAY:  "Somebody had to install those new switchboards"
3:05.4  [VIDEO] BR-18-model-t-old-car-plant IN → 3:09.4 (E18 slot: vintage archive ford assembly line workers 1920s) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
3:05.4  SAY:  "Somebody had to assemble the new cars and build all the parts that went along with those cars"
3:09.4  [VIDEO] BR-19-machinist-vise-metal-part IN → 3:11.2 (E19 slot: vintage archive machine shop workers making car
        parts) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
3:11.2  [VIDEO] BR-20-robot-arms-auto-part IN → 3:15.2 (E20 slot: modern car factory robot arms welding car body no
        people) · muted, from the clip head · Envato fade · a HARD CUT to the present (COVER-PLAN), no fade → hand:cut (hard-cut, 0.00s)
3:11.2  SAY:  "But what if every one of those car parts is built by a machine and nobody needs to hire anybody to make
              them"
3:15.2  [IMAGE] IMG-6-dark-automated-factory-no-people IN → 3:18.8 · 'ILLUSTRATION' tag (comp) · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still)
3:18.8  [CHART] C2 (Type 1 animated, Halloween on grunge) IN → 3:26.7: header question + four dark lamps and their dim
        words; NO credit line (Mike's no-Shapiro ruling) → hand:xfade-scale (container-xfade, 0.35s)
3:18.8  SAY:  "So, how do you know when a job is in trouble? It comes down to four words"
3:22.0  [CHART] C2 bottom line 'It comes down to four words.' fades up on 'four words'
3:24.0  SAY:  "better faster cheaper"
3:24.0  [CHART] C2 BETTER ignites (3-frame flicker, then the glow blooms) on 'better'
3:24.6  [CHART] C2 FASTER ignites + rail segment draws pumpkin on 'faster'
3:25.1  [CHART] C2 CHEAPER ignites + rail segment on 'cheaper'
3:26.2  [CHART] C2 SAFER ignites, last rail segment, all four pulse once on 'safer'; holds to the F4 picture edge
3:26.2  SAY:  "Safer once the machine is all four there is no"
3:26.7  [MUSIC] HARD HIT 206.7: F4 rides Bed B's soft lifted mid section (about 23.6 under), the softest bed of the
        chapter, no dip row; SFX: none
3:26.7  [TRANSITION] cover→face cut-in F4 → lib:blocks-max-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip) · 'safer' runs into the edge 3:26.7: the picture edge wins
3:26.7  [FACE] F4 → 3:32.1 "once the machine is all four. There is no economic reason to keep the human" · AIRS AS THE
        BG-SWAP [VIDEO-LAYER] assets/face-swap/F4-higgsfield-bg-swap.mp4, generating (raw source staged); built at
        comp_build per comp-build §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that
        fails QA airs as recorded with FACE_REFRAME) · NO interior join (jumpcuts-final.json: its only join sits
        inside the 0.5 s edge margin): NO punch-in, NO light leak (overlays.md §1)
3:26.7  [CAPTION] ON → 3:32.1 (F4 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; 'all four')
3:30.2  SAY:  "Economic reason to keep the human and people building this are putting dates on it"
3:32.1  [TRANSITION] face→cover F4 out → lib:blocks-max-3 (face-cut, 0.96s) (face pick)
3:32.1  [RECEIPT] C23 R(article) flash IN → 3:34.6 (Suleyman, Microsoft AI CEO, FT via Yahoo Finance 2026-02-12:
        white-collar tasks fully automated within 12 to 18 months; dated) + C3-badge-claimed.png overlay (the T2
        badge) on 'putting dates on it' `[VERIFY quote]`
3:34.6  [RECEIPT] C22 stage 1: C22-top (Amodei essay header, The Adolescence of Technology, January 2026) IN on 'The
        CEO of Anthropic' → 3:37.0 + C3-badge-claimed.png overlay `[VERIFY quote]` → hand:xfade-scale (container-xfade, 0.35s)
3:34.6  SAY:  "The CEO of Anthropic says the AI could displace half of all entry-level white-collar jobs"
3:37.0  [RECEIPT] C22 stage 2: C22 (the sentence) on 'could displace'; second zoom onto '1-5 years' on 'In the next'
        @3:40.8 → 3:43.7 (guard 1: the only spoken timeline; 'could' kept) → hand:xfade (container-xfade, 0.20s)
3:40.8  SAY:  "In the next one to five years, but all of that AI is stuck inside a screen"
3:43.1  [MUSIC] HARD HIT 223.08: Harvester's own chorus-2 SLAM (file 167.0) on 'years,' after the file's 1.7 s rest
        under 'one to five years' (the composer's breath, kept; the QA floor check will see the dip); SFX: none
        (file-carried, a kit hit on a music slam would smear it)
3:43.7  [VIDEO] BR-21-typing-glowing-laptop-dark IN → 3:46.8 (E21 slot: AI chatbot typing on computer monitor screen
        close-up) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
3:46.8  [IMAGE] IMG-7-brain-inside-crt-monitor IN → 3:49.5 · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
3:46.8  SAY:  "It's a brain with no body and that's exactly why they told you to go pick up a wrench"
3:49.5  [VIDEO] BR-22-hand-takes-wrench IN → 3:52.7 (E22 slot: hand picking up wrench from workbench close-up) ·
        muted, from the clip head · Envato fade · the CH3 card leads in over its tail → hand:fade (broll-fade, 0.50s)
```

## CH3 - THEN IT GOT A BODY (3:52.7-7:26.0, Bed B continues, CARD ON (the mid-bed exception, KEPT); Halloween look)
```
3:52.7  [CARD] CH3 title-CH3 · [IMPACT] DSGNImpt · [TRANSITION] card presentation → rmn:slide (card, 0.40s) · "THEN IT GOT A
        BODY": KEPT by Mike 2026-10-07 as the mid-bed exception on Harvester's step-up. Dripping red slasher type, the
        card LEADS IN over the tail of BR-22 (the wrench) and holds through the 1.5 s pause. SFX file and alignment as
        CH2 (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, peak 0.09 s in, tail 1.07 s)
3:52.7  [MUSIC] Bed B PAUSES for the card: fades 0.4 s from the card start (file 176.58, chorus 2) and resumes
        sample-continuous on the same bar (file 176.08, 0.5 s fade-in), full on 'So where are the robots right now?';
        seat -23 dB (gain -30.0 dB); six bar-aligned passes of 180.91-208.74 (seams 4:24.8 · 4:52.7 · 5:20.5 · 5:48.3
        · 6:16.1 · 6:44.0 · 7:11.8, none on a face line) → 7:25.7 · HARD HIT 232.66
3:52.7  [VIDEO] BR-23-humanoid-prototype-lab IN → 3:55.1 (E23 slot: humanoid robot walking test robotics lab) · muted,
        from the clip head · Envato fade
3:52.7  SAY:  "So where are the robots right now? I'm gonna split it three ways"
3:55.1  [DIAGRAM] C3-s1 (Type 2, Halloween) IN → 4:01.0: the empty honesty ladder, three dim rungs (DEPLOYED bottom,
        CLAIMED middle, FORECAST top) on 'I'm gonna split it three ways' → hand:xfade-scale (container-xfade, 0.35s)
3:56.8  SAY:  "What's already deployed what's being claimed and what's coming deployed a humanoid robot called Figure
              02"
3:57.6  [DIAGRAM] C3-s2: the DEPLOYED rung lights (white badge, white border) on 'deployed'
3:59.1  [DIAGRAM] C3-s3: the CLAIMED rung lights (gray) on 'claimed'
4:00.7  [DIAGRAM] C3-s4: the FORECAST rung lights (amber #ffd700, dashed) on 'coming'; this tier system returns as the
        corner badge on every robot beat (charts bake it; b-roll, stills and receipts get the C3-badge-*.png overlays)
4:01.0  [RECEIPT] C25 R(other) (Figure's own BMW report, 2025-11-19: hero + the numbers block) IN → 4:10.0 on
        'deployed' + C3-badge-deployed.png overlay; push into '11 months' @4:07.6 and the 10-hour shifts line @4:08.5
        (real pixels, themed frame only) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
4:04.4  SAY:  "Worked at a BMW plant in Spartanburg for 11 months 10-hour shifts"
4:10.0  [CHART] figure-bmw-scoreboard (Type 1 animated, Halloween) IN → 4:16.6: '10 hours' already lit, DEPLOYED badge
        set; day pips M, T, W, T, F light 0.2 s apart on 'Monday through Friday' (S, S stay dark) → hand:xfade-scale (container-xfade, 0.35s)
4:10.0  SAY:  "Monday through Friday and loaded more than 90,000 parts and helped build more than 30,000 cars"
4:12.3  [CHART] figure-bmw-scoreboard PARTS counter 0 → 90,000, '+' snaps on landing on ',000' @4:13.3
4:14.5  [CHART] figure-bmw-scoreboard CARS counter 0 → 30,000, '+' snaps on landing on ',000' @4:15.7
4:16.6  [VIDEO] BR-24-robot-arm-stacks-sheet-metal IN → 4:19.8 (E24 slot: industrial robot arm loading sheet metal
        press) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
4:16.6  SAY:  "That's one robot model doing one task"
4:19.8  [IMAGE] IMG-8-robot-end-of-shift-factory IN → 4:22.3 · 'ILLUSTRATION' tag (comp) · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI
        still)
4:19.8  SAY:  "Loading sheet metal but it held a job and you can buy a humanoid body for"
4:22.3  [RECEIPT] R2 R(article) (The Robot Report, 2025-07-29: Unitree R1, 5,900 dollars, dated) IN → 4:25.6 +
        C3-badge-deployed.png overlay (the body exists and sells); push into the price line on '$5,900' @4:24.4
        `[VERIFY price]` · R2-remote.png BENCH (reconciliation below) → hand:xfade-scale (container-xfade, 0.35s)
4:24.4  SAY:  "$5,900 the company says that one is remote control. So the body is cheap worker isn't there yet claimed
              a"
4:25.6  [CONTAINER] body-vs-worker (card) IN → 4:30.8: THE BODY: 5,900 dollars (DEPLOYED, remote-controlled, Unitree)
        · THE WORKER: not yet; the white C3 tier badge baked (visual-qa round 2) → hand:xfade-scale (container-xfade, 0.35s)
4:26.9  [CONTAINER] body-vs-worker spotlight (comp-level): THE BODY lifts on 'remote control'
4:28.7  [CONTAINER] body-vs-worker spotlight: THE WORKER: not yet lifts on 'worker isn't there yet'
4:30.8  [IMAGE] IMG-9-home-humanoid-dim-living-room IN → 4:33.7 · 'ILLUSTRATION' tag (comp) · ingress
        (AI still) · + C3-badge-claimed.png overlay (the NEO beat) → lib:tvsat-short-1 (glitch-still, 0.48s)
4:30.8  SAY:  "Company called 1X put a home humanoid on sale called NEO"
4:33.7  [RECEIPT] C26 stage 1: C26-top (the 1X NEO hero) IN on 'on sale called NEO' → 4:35.7 + C3-badge-claimed.png
        overlay (1X, announced 2025-10-28) `[VERIFY delivery status]` → hand:xfade-scale (container-xfade, 0.35s)
4:35.7  [RECEIPT] C26 stage 2: C26 (the price block) on '$20,000': 20,000 highlighted, then 499 a month on '$499'
        @4:38.3 and 'priority delivery 2026' on 'deliveries promised' @4:39.6 → 4:41.6 (guard 2: promised, never 'in
        people's homes') → hand:xfade (container-xfade, 0.20s)
4:35.7  SAY:  "$20,000 or"
4:38.4  SAY:  "$499 a month with deliveries promised for 2026"
4:41.6  [VIDEO] BR-25-humanoid-robot-home-hand IN → 4:44.8 (E25 slot: robot hand opening door handle close-up) ·
        muted, from the clip head · Envato fade · + C3-badge-claimed.png overlay (able to open doors = 1X's claim) → hand:fade (broll-fade, 0.50s)
4:41.6  SAY:  "the company says it shows up able to open doors fetch things and turn on lights and for anything it
              doesn't know a"
4:44.8  [RECEIPT] C26-expert R(other) (the 1X NEO page, the 1X Expert paragraph: a remote human guides it through
        unknown tasks; 1X's own wording in real pixels, e.g. 'turn off the lights' where the VO says 'turn on lights',
        AS-RECORDED 286.04) IN → 4:51.0 + C3-badge-claimed.png; the paragraph highlight lands on 'Remote human expert'
        @4:49.0 → hand:xfade-scale (container-xfade, 0.35s)
4:49.0  SAY:  "Remote human expert guides it through and it claims that one AI brain runs every behavior"
4:51.0  [RECEIPT] R3 R(article) (Figure's Helix post, 2025-02-20) IN → 4:59.1 + C3-badge-claimed.png; the FIGURE name
        + date burned on screen (the VO says 'it claims' right after the 1X lines, the claim is Figure's, never on the
        1X card); push into the single-set-of-weights sentence on 'one AI brain' @4:52.0 `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
4:54.8  SAY:  "Across its robots and that skill can be picked up just by talking to it"
4:59.1  [VIDEO] BR-26-tradesman-tightens-pipe IN → 5:01.8 (E26 slot: plumber tightening pipe with wrench basement) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
4:59.1  SAY:  "Now there's no robot plumber right now. There's no robot electrician, but they're coming and they're
              coming fast"
5:01.8  [VIDEO] BR-27-ceiling-light-install IN → 5:03.5 (E27 slot: electrician installing ceiling light fixture) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
5:03.5  [DUCK] Bed B -3 dB dip under F5 (0.3 s ramps), the face line sits on chorus 2 → 5:05.8
5:03.5  [TRANSITION] cover→face cut-in F5 → lib:blocks-short-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip) · 'electrician,' runs into the edge: the picture edge wins
5:03.5  [FACE] F5 → 5:05.8 "but they're coming and they're coming fast" · AIRS AS THE BG-SWAP [VIDEO-LAYER]
        assets/face-swap/F5-higgsfield-bg-swap.mp4, generating (raw source staged); built at comp_build per comp-build
        §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded
        with FACE_REFRAME) · NO interior join (jumpcuts-final.json: its only join sits inside the 0.5 s edge margin):
        NO punch-in, NO light leak (overlays.md §1)
5:03.5  [CAPTION] ON → 5:05.8 (F5 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
5:05.8  SAY:  "I think we're only just a few years away"
5:05.8  [TRANSITION] face→cover F5 out → lib:blocks-short-3 (face-cut, 0.96s) (face pick)
5:05.8  [DIAGRAM] C3-forecast-s1 IN → 5:08.9: the ladder with ONLY the FORECAST rung lit (DEPLOYED + CLAIMED dimmed)
        on 'I think'
5:07.6  [DIAGRAM] C3-forecast-s2: the corner FORECAST badge stamps in on 'away'; from here the comp CONTINUES it as
        the C3-badge-forecast.png overlay over IMG-10, IMG-11, IMG-12 and BR-28 (the house argument) → 5:19.3
5:08.0  SAY:  "And here's why the house is built for a humanoid body the doorways the stairs the ladder the
              crawlspace"
5:08.9  [IMAGE] IMG-10-robot-doorway-staircase IN → 5:12.2 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png overlay
        (tier 3: a forecast, never footage) · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still) (the forecast badge continues from
        C3-forecast-s2)
5:12.2  [IMAGE] IMG-11-robot-attic-ladder IN → 5:14.9 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png overlay
        (tier 3: a forecast, never footage) · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
5:14.9  [IMAGE] IMG-12-robot-garage-pegboard IN → 5:17.0 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png overlay
        (tier 3: a forecast, never footage) · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still)
5:14.9  SAY:  "Every tool in your garage so a machine with a human body can use all of it"
5:17.0  [VIDEO] BR-28-technician-tool-pegboard IN → 5:19.3 (E28 slot: hands grabbing tools from pegboard garage
        workshop) · muted, from the clip head · Envato fade · + C3-badge-forecast.png overlay (continues from
        C3-forecast-s2) → hand:fade (broll-fade, 0.50s)
5:19.3  [DIAGRAM] C1-pre-s1 IN → 5:21.9: the status quo, five trades (a person + a van each), five dashed van routes
        into YOUR HOUSE, 'one trade at a time'; no robot, no numbers (geometry pixel-identical to C1) → hand:xfade-scale (container-xfade, 0.35s)
5:19.3  SAY:  "And that means is not just one robot per trade"
5:20.6  [RISER] risers/Tension_Rise_Logo_Reveal_2.wav STARTS (measured peak 4.71 s into the file; trimmed ON the peak
        so it ENDS on the C1 reveal at 5:25.3); builds under 'not just one robot per trade' and the F6 line, UNDER the
        VO
5:21.9  SAY:  "It's one robot for every trade in your house the plumber the electrician the roofer the HVAC tech"
5:21.9  [DUCK] Bed B -3 dB dip under F6 (0.3 s ramps), the set-up line of the C1 centerpiece → 5:25.3
5:21.9  [TRANSITION] cover→face cut-in F6 → lib:blocks-max-1 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
5:21.9  [FACE] F6 → 5:25.3 "it's one robot for every trade in your house" · AIRS AS THE BG-SWAP [VIDEO-LAYER]
        assets/face-swap/F6-higgsfield-bg-swap.mp4, generating (raw source staged); built at comp_build per comp-build
        §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded
        with FACE_REFRAME) · NO interior join (jumpcuts-final.json: its only join sits inside the 0.5 s edge margin):
        NO punch-in, NO light leak (overlays.md §1)
5:21.9  [CAPTION] ON → 5:25.3 (F6 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
5:25.3  [RISER→IMPACT] THE C1 REVEAL: the riser ends on this frame · [IMPACT] Impacts/Impact_3.wav (measured:
        pre-swell from 0.19 s, transient peak 0.73 s into the file, audible tail 2.85 s to -40 dB) file starts 5:24.57
        so its peak lands on the reveal; if TRANSITIONS.md puts a library move on this cut its baked SFX is MUTED (one
        hit per reveal) · HARD HIT 325.3: Bed B HOLDS on chorus 2, the F6 dip releases here, the drone does not swell
5:25.3  [TRANSITION] face→cover F6 out → lib:blocks-max-2 (face-cut, 0.96s) (face pick)
5:25.3  [DIAGRAM] C1-s1 IN → 5:35.4: THE marquee system-design diagram, shown ONCE in full: ONE ROBOT inside YOUR
        HOUSE, five skill modules plugged in, dashed links out to the five trade rows, all unlit; the FORECAST badge
        on the ROBOT side only (the BLS counts are facts) · MARQUEE candidate (MELT: C1-pre → C1, the house fills with
        one robot) (the face-out row carries this cut: TRANSITIONS.md decides face glitch vs MELT)
5:25.6  [DIAGRAM] C1-s2: the Plumbers row lights (border, module, fan curve, link go pumpkin), 510,600 appears, on
        'the plumber'
5:26.4  [DIAGRAM] C1-s3: Electricians lights, 821,000, on 'the electrician'
5:27.3  [DIAGRAM] C1-s4: Roofers lights, 166,900, on 'the roofer'
5:28.4  [DIAGRAM] C1-s5: HVAC techs lights, 440,900, on 'the HVAC tech'
5:29.1  SAY:  "The carpenter that's about 2.8 million jobs in America in just those five trades and imagine like in
              The Matrix"
5:29.7  [DIAGRAM] C1-s6: Carpenters lights, 889,700, on 'the carpenter'
5:31.0  [DIAGRAM] C1-s7: the total line 'about 2.8 million US jobs in just these five trades' on '2.8 million jobs';
        holds to 5:35.4 `[VERIFY 2,829,100 sum]`
5:35.4  [IMAGE] IMG-13-robot-neck-data-cable IN → 5:39.1 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png overlay
        (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-2 (glitch-still, 0.48s) (AI still)
5:37.5  SAY:  "You're jacked in you can upload a program to your brain"
5:39.1  [DIAGRAM] upload-a-s1 IN → 5:43.8: the UPLOAD container 'Uploading skill: Helicopter pilot', an empty
        20-segment bar, the cable to the robot head (visor dark), FORECAST badge baked, on 'upload' (homage only: no
        film footage, no green code, no logo) → hand:xfade-scale (container-xfade, 0.35s)
5:40.9  SAY:  "To learn a whole new skill just like how to be a helicopter pilot or to be a kung fu master or in this
              case"
5:41.0  [DIAGRAM] upload-a-s2: 7 of 20 segments, the visor lights, three packets ride the cable (lead-in to 'learn'
        5:41.6); the comp may step the fill segment by segment between states
5:42.9  [DIAGRAM] upload-a-s3: 14 of 20 on 'just like' (it does NOT finish: the payoff is upload-b)
5:43.8  [VIDEO] BR-29-helicopter-cockpit-pilot IN → 5:45.5 (E29 slot: helicopter pilot cockpit view flying) · muted,
        from the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
5:45.5  [VIDEO] BR-30-kung-fu-practice IN → 5:47.3 (E30 slot: kung fu martial arts training dark dojo) · muted, from
        the clip head · Envato fade → hand:fade (broll-fade, 0.27s)
5:47.3  [DIAGRAM] upload-b-s1 IN → 5:50.1: the same container, 'Expert electrician', 16 of 20, packets riding, on 'in
        this case' → hand:xfade-scale (container-xfade, 0.35s)
5:48.2  SAY:  "How to be an expert electrician and not only that you'd have the combined knowledge of every single
              expert"
5:49.5  [DIAGRAM] upload-b-s2: the bar completes 20 of 20, '100% COMPLETE' slams in (1.15 → 1) on 'electrician'
5:50.1  [VIDEO] BR-31-electrician-tests-panel IN → 5:53.7 (E31 slot: electrician testing circuit with multimeter
        close-up) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
5:53.7  [IMAGE] IMG-14-globe-network-robot-head IN → 5:57.6 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-3 (glitch-still, 0.48s) (AI still)
5:54.6  SAY:  "Electrician on the entire planet instantly basically anything that every expert electrician could have
              ever known that"
5:57.6  [VIDEO] BR-32-network-data-streams IN → 6:01.2 (E32 slot: data streams network globe visualization dark) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:01.2  [CONTAINER] combined-knowledge (card) IN → 6:06.6: EVERY EXPERT ELECTRICIAN ON THE PLANET -> ONE ROBOT,
        INSTANTLY; FORECAST badge baked; Halloween palette → hand:xfade-scale (container-xfade, 0.35s)
6:02.9  SAY:  "Is going to be the power of a robot in your own house a human electrician?"
6:04.1  [CONTAINER] combined-knowledge spotlight (comp-level): ONE ROBOT, INSTANTLY lifts on 'the power of a robot'
6:06.6  [DIAGRAM] C1-download-s1 IN → 6:11.4: the C1 break-up state, ELECTRICIANS isolated (row, module, link lit; the
        other four dimmed with their counts), header 'Years of training, or one download', on 'a human electrician' ·
        MARQUEE candidate (MELT callback of C1) → lib:melt-rgb-1 (MELT-transform, 0.76s)
6:08.2  SAY:  "Needs a four or five year apprenticeship a robot needs a download and it's not just repairs that same
              robot is going to be your"
6:08.7  [DIAGRAM] C1-download-s2: 'Electrician: a 4 or 5 year apprenticeship, per person (BLS)' on 'four or five year
        apprenticeship' (the electrician's length only, AS-RECORDED 565.20)
6:11.1  [DIAGRAM] C1-download-s3: 'Robot: one download, every robot' + a download glyph on the module, on 'download';
        the FORECAST badge pulses once (1 → 1.12 → 1, 10 frames)
6:11.4  [VIDEO] BR-33-appliance-repair-drill IN → 6:13.5 (E33 slot: repairman fixing home appliance close-up) · muted,
        from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:13.5  [VIDEO] BR-34-night-guard-radio IN → 6:15.9 (E34 slot: security guard patrolling with flashlight at night) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:15.2  SAY:  "Security guard it doesn't sleep and it could be standing in your hallway at 3 in the morning"
6:15.9  [IMAGE] IMG-15-robot-hallway-3am-front-door IN → 6:19.9 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-max-2 (glitch-still, 0.96s) (AI still) · the planted hallway still
        (CH7 pays it off with IMG-35, a second angle)
6:19.9  [VIDEO] BR-35-hooded-intruder-night IN → 6:23.6 (E35 slot: burglar breaking into house at night masked
        intruder door) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:19.9  SAY:  "So when somebody tries to break into your house and torture you for your crypto private keys"
6:23.6  [IMAGE] IMG-16-hardware-wallet-seed-card-gloved-hand IN → 6:25.9 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still) · the
        keys, not the violence
6:25.9  [VIDEO] BR-36-dog-barks-behind-fence IN → 6:28.4 (E36 slot: guard dog barking behind fence at night) · muted,
        from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:25.9  SAY:  "It'll function better than a guard dog"
6:28.4  [IMAGE] IMG-17-robot-charging-dock-dog-bowl IN → 6:32.4 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
6:28.4  SAY:  "And you don't even have to feed it you just plug it in and make sure it's charged"
6:32.4  [VIDEO] BR-37-picking-up-dog-waste IN → 6:34.8 (E37 slot: person picking up dog poop with bag in yard) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:32.9  SAY:  "And you don't even have to clean up its poop"
6:34.8  [CHART] C6 (Type 1 animated, Halloween) IN → 6:46.3: header, both row labels, dashed tracks and the CLAIMED
        badge set → hand:xfade-scale (container-xfade, 0.35s)
6:34.8  SAY:  "And then there's the math the median plumber in America makes about"
6:36.7  [CHART] C6 row-1 label 'plumber' brightens on 'plumber'
6:38.0  [CHART] C6 plumber bar grows 0 → 1300 px, the value counts to 63,800 landing on '$64,000' @6:38.8
6:38.3  SAY:  "$64,000 a year that home robot rents for"
6:40.3  [CHART] C6 row-2 label 'home robot' brightens on 'home robot'
6:42.4  [CHART] C6 the robot sliver appears (10.2 px = 499) with '499 a month' on '$499'
6:42.6  SAY:  "$499 a month and that's under $6,000 a year so right now that robot can't do a plumber's job"
6:44.4  [CHART] C6 month → year: the sliver grows to 122 px, its label counts 499 → 5,988, landing on 'under $6,000'
        @6:45.5
6:45.5  [CHART] C6 'or 20,000 to buy outright' fades up, then the blood caption box (cannot do trade work) on 'a
        year'; guard 3: no per-hour figure anywhere on screen
6:46.3  [IMAGE] IMG-18-robot-hands-pipe-under-sink IN → 6:50.1 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-1 (glitch-still, 0.48s) (AI still)
6:49.4  SAY:  "Not yet, but the day a machine at that price can the math is brutal and the machine doesn't need
              weekends"
6:50.1  [CONTAINER] math-is-brutal (card) IN → 6:56.0: THE DAY a machine at that price can: 63,800 vs 5,988 a year ·
        and it doesn't need weekends; FORECAST badge baked → hand:xfade-scale (container-xfade, 0.35s)
6:53.7  [CONTAINER] math-is-brutal spotlight (comp-level): '63,800 vs 5,988' lifts on 'brutal'
6:55.4  [CONTAINER] math-is-brutal spotlight: 'and it doesn't need weekends' lifts on 'weekends'
6:56.0  [VIDEO] BR-38-frustrated-man-phone IN → 7:00.0 (E38 slot: frustrated homeowner on phone looking at wall
        calendar) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
6:56.0  SAY:  "How many times throughout my life I wanted to schedule something with a contractor to do?"
7:00.0  [VIDEO] BR-39-repairman-homeowner-kitchen IN → 7:03.9 (E39 slot: contractor with clipboard at front door
        talking to homeowner) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
7:02.0  SAY:  "Something and they only wanted to do it doing a nine-to-five schedule when it was the most difficult
              time period for me"
7:03.9  [CONTAINER] nine-to-five (card) IN → 7:09.3: CONTRACTOR HOURS: 9 to 5, Monday to Friday · YOUR HOURS: the
        same, so the most difficult time for you (the ad-lib story, AS-RECORDED 416.00) → hand:xfade-scale (container-xfade, 0.35s)
7:04.7  [CONTAINER] nine-to-five spotlight (comp-level): CONTRACTOR HOURS lifts on 'nine-to-five'
7:06.7  [CONTAINER] nine-to-five spotlight: YOUR HOURS lifts on 'most difficult time period'
7:08.2  SAY:  "I remember there's been points in my life when I asked somebody if they could do it on the weekend"
7:09.3  [VIDEO] BR-40-marker-circles-calendar-date IN → 7:12.9 (E40 slot: hand circling weekend date on calendar
        close-up) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
7:12.9  [VIDEO] BR-41-hands-count-dollar-bills IN → 7:16.6 (E41 slot: hands counting cash dollar bills paying) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
7:12.9  SAY:  "And I pay them I'd even pay them extra and I didn't they didn't want to do it"
7:16.6  [VIDEO] BR-42-worker-thumbs-down IN → 7:20.6 (E42 slot: contractor shaking head no refusing job) · muted, from
        the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
7:16.6  SAY:  "So there could be a little bit of a convenience factor there, okay, so that's the house now"
7:20.6  [IMAGE] IMG-19-house-dusk-robot-silhouette-window IN → 7:23.2 · 'ILLUSTRATION' tag (comp) +
        C3-badge-forecast.png overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still)
7:22.7  SAY:  "Let's go job by job and see if yours is on the list"
7:23.2  [VIDEO] BR-43-city-commuters-walking IN → 7:26.0 (E43 slot: crowd of workers walking city street commute) ·
        muted, from the clip head · Envato fade · the CH4 card leads in over its tail → hand:fade (broll-fade, 0.50s)
7:25.7  [MUSIC] HARD HIT 445.72: the final chord of Bed B STOPS on 'list' (file 222.68, pinned by the loop
        arithmetic): the word is said in the clear, then the CH4 card; the 0.4 s card fade only trims the 1 s decay;
        SFX: none
```

## CH4 - THE LIST (7:26.0-11:44.0, Bed C `continuum`, CARD ON; house look returns)
```
7:26.0  [CARD] CH4 title-CH4 · [IMPACT] DSGNImpt · [TRANSITION] card presentation → rmn:slide (card, 0.40s) · "THE LIST": The
        house look returns (the Halloween look turns OFF on this card); the card LEADS IN over the tail of BR-43 and
        holds through the 1.5 s pause. SFX file and alignment as CH2 (DSGNImpt, peak 0.09 s in, tail 1.07 s)
7:26.0  [MUSIC] 0.6 s breath · Bed C `continuum` (Colossus, Continuum, instrumental) source_in 8.39, fades in over the
        last 0.5 s of the pause on its near-silent intro, the file's first pulse lands on 'same pattern' (7:27.8);
        seat -22 dB (remotion gain -30.4 dB); bar-aligned loop region 86.8-138.0 (seams 9:35.6 · 10:26.8 · 11:18.0);
        hard stop on 'leads' → 11:44.0 · HARD HIT 445.96 (bed change B to C)
7:26.0  [MUSIC] LIFT +4 dB on Bed C's intro and build (file 8.39-86.8; 0.3 s ramps, released over 8:44.0-8:44.3 on the
        peak-on hit) → 8:44.3
7:26.0  [CONTAINER] C4-template-s1 (card) IN → 7:32.2: the empty job-card template with its tier badge slot, on 'So
        here's a list' · cross-fade + 0.93→1 scale-in
7:26.0  SAY:  "So here's a list same pattern every time the job"
7:29.2  [CONTAINER] C4-template-s2: THE JOB lights on 'the job'
7:29.6  [CONTAINER] C4-template-s3: HOW MANY PEOPLE DO IT lights on 'How many people'
7:29.6  SAY:  "How many people do it and why it's at risk and for most of these the machine is already there
              cashiers?"
7:31.4  [CONTAINER] C4-template-s4: WHY IT'S AT RISK lights on 'why it's at risk'
7:32.2  [MUSIC] HARD HIT 452.2: F7 sits on the sparse lifted intro of Bed C (about 26 under), the softest bed of the
        chapter, no dip; SFX: none
7:32.2  [TRANSITION] cover→face cut-in F7 → lib:blocks-short-1 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
7:32.2  [FACE] F7 → 7:34.4 "and for most of these the machine is already there" · AIRS AS THE BG-SWAP [VIDEO-LAYER]
        assets/face-swap/F7-higgsfield-bg-swap.mp4, generating (raw source staged); built at comp_build per comp-build
        §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded
        with FACE_REFRAME)
7:32.2  [CAPTION] ON → 7:34.4 (F7 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
7:33.8  [PUNCH-IN] F7 punch 1 of 1 ON the desilence-coarse join 453.800 s (frame 13614, spine/jumpcuts-final.json):
        step IN on 'already there', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap clip already bakes a
        slight push (comp-build §3b), hand:punch; holds to the face-out 7:34.4
7:33.8  [LIGHTLEAK] F7 library light leak 3 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.60 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-5 (punch-leak, 0.40s) (punch-leak)
7:34.4  [TRANSITION] face→cover F7 out → lib:blocks-short-2 (face-cut, 0.96s) (face pick)
7:34.4  [CHART] C4-cashiers (Type 1 animated job card) IN → 7:38.1: name, chips, THE TEST panel (four lamps dark),
        DEPLOYED badge, source set; counter at 0
7:35.4  [CHART] C4-cashiers counter 0 → 3,106,300 landing on '3.1 million' @7:36.4
7:35.8  SAY:  "3.1 million jobs at risk because of self-checkout and online shopping and the government's own"
7:37.2  [CHART] C4-cashiers stamp 'BLS: MINUS 6 PERCENT' slams in (1.35 → 1, -10 → -6 deg) on 'at risk'
7:38.1  [IMAGE] IMG-20-self-checkout-kiosks-empty-store IN → 7:40.4 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still) · no robot
        claim
7:40.4  [RECEIPT] C28-cashiers stage 1: C28-cashiers (BLS OOH Quick Facts: 32,880 / 3,106,300 / -6%) IN on 'the
        government's own' → 7:42.9 → hand:xfade-scale (container-xfade, 0.35s)
7:41.2  SAY:  "Forecast already has this job shrinking at 6% taxi drivers"
7:42.9  [RECEIPT] C28-cashiers stage 2: C28-cashiers-outlook (BLS OOH: -6 percent + the self-service checkout sentence
        highlighted) on 'shrinking at 6%' → 7:44.3 → hand:xfade (container-xfade, 0.20s)
7:44.3  [CHART] C4-taxi IN → 7:48.5 (job card, DEPLOYED) → hand:xfade-scale (container-xfade, 0.35s)
7:45.2  [CHART] C4-taxi counter 0 → 455,700 landing on '456,000' @7:46.5
7:45.2  SAY:  "456,000 jobs at risk because Waymo has driven"
7:47.6  [CHART] C4-taxi the SAFER lamp FILLS (3-frame flicker, glow) on 'risk' (Waymo's own data follows)
7:48.5  [VIDEO] BR-44-autonomous-cars-highway-aerial IN → 7:52.1 (E44 slot: autonomous self-driving car empty driver
        seat lidar sensor roof) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
7:50.4  SAY:  "271 million miles with nobody behind the wheel and by its own numbers"
7:52.1  [RECEIPT] C29 R(other) (Waymo safety impact hub: 271.3 million rider-only miles; 95 percent fewer
        serious-injury-or-worse crashes; source line Waymo's own data) IN → 7:58.8 + C3-badge-deployed.png; highlight
        '95%' on '95%' @7:54.6 (the ONLY safety receipt: no graphic says zero accidents, AS-RECORDED 692.18) `[VERIFY
        271.3 million, 95 percent]` → hand:xfade-scale (container-xfade, 0.35s)
7:54.6  SAY:  "95% fewer serious injury crashes than human drivers warehouse workers"
7:58.8  [CHART] C4-warehouse IN → 8:02.1 (job card, DEPLOYED) → hand:xfade-scale (container-xfade, 0.35s)
7:59.9  [CHART] C4-warehouse counter 0 → 6,917,800 landing on '6.9 million' @8:01.3
8:00.6  SAY:  "6.9 million jobs at risk because Amazon has already deployed a million robots customer service reps"
8:01.6  [CHART] C4-warehouse stamp 'AMAZON: 1,000,000 ROBOTS DEPLOYED' slams in on 'jobs'
8:02.1  [RECEIPT] C36 R(article) (Amazon's own post: the one millionth robot, 300+ facilities) IN → 8:05.8 +
        C3-badge-deployed.png; push into the millionth-robot line on 'deployed a million robots' @8:04.2 (guard 5: the
        NYT 600,000 frame is NOT shown) → hand:xfade-scale (container-xfade, 0.35s)
8:05.8  [CHART] C4-csr IN → 8:09.7 (job card, DEPLOYED) → hand:xfade-scale (container-xfade, 0.35s)
8:07.0  [CHART] C4-csr counter 0 → 2,666,000 landing on '2.7 million' @8:08.3
8:07.3  SAY:  "2.7 million jobs at risk because the CEO of Salesforce said he cut his support team from"
8:09.0  [CHART] C4-csr the CHEAPER lamp FILLS on 'at risk' (the Salesforce receipt follows)
8:09.7  [IMAGE] IMG-21-empty-call-center-night IN → 8:13.4 · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still) · no robot claim
8:13.4  [RECEIPT] R5 R(article) (The Register, 2025-09-02: Benioff, 'I've reduced it from 9,000 heads to about 5,000
        because I need less heads') IN → 8:20.6, push into the quote on '9,000' @8:13.7 `[VERIFY quote]` → hand:xfade-scale (container-xfade, 0.35s)
8:13.7  SAY:  "9,000 people to about 5,000 because in his own words he needs less heads roofers"
8:20.6  [CHART] C4-roofers IN → 8:24.6 (job card, CLAIMED) → hand:xfade-scale (container-xfade, 0.35s)
8:21.8  [CHART] C4-roofers counter 0 → 166,900 landing on '167,000' @8:23.0
8:22.2  SAY:  "167,000 jobs at risk because of a robot called Rufus gets winched across the roof"
8:24.1  [CHART] C4-roofers stamp 'PILOT' slams in on 'at risk'
8:24.6  [VIDEO] BR-45-aerial-roof-repair IN → 8:28.5 (E45 slot: aerial drone shot roofers working on residential roof)
        · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
8:28.5  [RECEIPT] R6 R(article) (Roofing Contractor, 2024-10-18: Renovate Robotics' Rufus, CertainTeed pilot installs)
        IN → 8:32.0 + C3-badge-claimed.png: the headline, then the pilot sentence on 'This one is still a pilot'
        @8:30.3 `[VERIFY pilot status]` → hand:xfade-scale (container-xfade, 0.35s)
8:28.9  SAY:  "Nailing down shingles. This one is still a pilot for now truck drivers"
8:32.0  [CHART] C4-truck IN → 8:36.1 (job card, DEPLOYED small) → hand:xfade-scale (container-xfade, 0.35s)
8:33.2  [CHART] C4-truck counter 0 → 2.22 million landing on '2.2 million' @8:34.2
8:33.2  SAY:  "2.2 million jobs at risk because driverless trucks have already logged nearly"
8:35.2  [CHART] C4-truck the SAFER lamp OUTLINES + 'COMPANY-REPORTED' tag on 'at risk'
8:36.1  [IMAGE] IMG-22-empty-cab-semi-truck-highway IN → 8:39.8 · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still) · no robot claim
8:39.8  [RECEIPT] C30 R(other) (Aurora's Q2 2026 shareholder letter, SEC EX-99.1: nearly 440,000 driverless miles;
        zero Aurora Driver-attributed collisions; source line company-reported) IN → 8:45.5 + C3-badge-deployed.png;
        highlight '440,000' @8:40.2, then the zero-collisions clause on 'zero collisions' @8:42.8 `[VERIFY 440,000]` ·
        C30-top.png BENCH → hand:xfade-scale (container-xfade, 0.35s)
8:40.5  SAY:  "440,000 miles and the company reports zero collisions caused by its driver Carpenters"
8:44.4  [MUSIC] HARD HIT 524.37: the peak-on downbeat of Bed C (file 86.8) lands on 'caused by'; the +4 dB lift
        releases on the same frame, the plateau begins; SFX: none (file-carried)
8:45.5  [CHART] C4-carpenters IN → 8:49.9 (job card, DEPLOYED) → hand:xfade-scale (container-xfade, 0.35s)
8:46.3  [CHART] C4-carpenters counter 0 → 889,700 landing on '890,000' @8:47.2
8:47.1  SAY:  "890,000 jobs at risk because a company in Texas"
8:48.5  [CHART] C4-carpenters the CHEAPER lamp OUTLINES + 'COMPANY-REPORTED' tag on 'because'
8:49.5  [CHART] C4-carpenters stamp 'WALLS ONLY' slams in on 'Texas'
8:49.9  [RECEIPT] R7 R(article) (Engadget, 2024-08-08: ICON's ~100-home community, Georgetown, Texas) IN → 8:58.0 +
        C3-badge-deployed.png; stage 1 = the headline + the hero photo of the 3D-printed walls on '3D-printed the
        walls' (this stage holds the folded BR-46 beat, Mike confirms at the blueprint gate) → hand:xfade-scale (container-xfade, 0.35s)
8:49.9  SAY:  "3D-printed the walls for about a hundred homes and went from five building crews down to one crew and
              one printer"
8:53.2  [RECEIPT] R7 stage 2: push into the five-crews-to-one sentence on 'five building crews' → hand:xfade (container-xfade, 0.20s)
8:58.0  [CHART] C4-electricians IN → 9:03.0 (job card, FORECAST) → hand:xfade-scale (container-xfade, 0.35s)
8:58.0  SAY:  "electricians"
8:58.9  [CHART] C4-electricians counter 0 → 821,000 landing on ',000' @8:59.9
8:59.9  SAY:  "821,000 jobs. There's no robot electrician right now"
9:01.2  [CHART] C4-electricians stamp 'NO ROBOT YET' slams in on 'no robot electrician'
9:03.0  [RECEIPT] C28-electricians stage 1: C28-electricians (BLS OOH Quick Facts: 63,190 / 821,000 / 9%) IN on 'The
        government even has' → 9:05.4 → hand:xfade-scale (container-xfade, 0.35s)
9:03.0  SAY:  "The government even has this job growing 9% and guess why?"
9:05.4  [RECEIPT] C28-electricians stage 2: C28-electricians-outlook (BLS OOH: +9 percent + the data-center driver
        sentence) on '9%'; the data-center sentence highlights on 'guess why?' @9:06.4 → 9:07.2 → hand:xfade (container-xfade, 0.20s)
9:07.2  [VIDEO] BR-47-data-center-fly-through IN → 9:10.8 (E47 slot: data center server hall corridor dolly forward) ·
        muted, from the clip head · Envato fade · LEADING dolly into the F8 face line → hand:fade (broll-fade, 0.50s)
9:07.2  SAY:  "Because somebody has to wire all those AI data center"
9:10.8  [DUCK] Bed C -3 dB dip under F8 (0.3 s ramps), the face line sits on the level-8 plateau → 9:16.5
9:10.8  [TRANSITION] cover→face cut-in F8 → lib:blocks-max-3 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
9:10.8  [FACE] F8 → 9:16.5 "but those data centers are where the robot's brain gets trained. So that one is coming" ·
        AIRS AS THE BG-SWAP [VIDEO-LAYER] assets/face-swap/F8-higgsfield-bg-swap.mp4, generating (raw source staged);
        built at comp_build per comp-build §3b (as F1: full-frame, pre-framed so no FACE_REFRAME, spine audio kept; a
        clip that fails QA airs as recorded with FACE_REFRAME)
9:10.8  [CAPTION] ON → 9:16.5 (F8 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; 'robot's brain')
9:10.9  SAY:  "But those data centers are where the robot's brain gets trained. So that one is coming plumbers"
9:15.8  [PUNCH-IN] F8 punch 1 of 1 ON the desilence-coarse join 555.833 s (frame 16675, spine/jumpcuts-final.json):
        step IN on 'that one is coming', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap clip already bakes a
        slight push (comp-build §3b), hand:punch; holds to the face-out 9:16.5
9:15.8  [LIGHTLEAK] F8 library light leak 4 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.70 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-2 (punch-leak, 0.40s) (punch-leak)
9:16.5  [TRANSITION] face→cover F8 out → lib:blocks-max-1 (face-cut, 0.96s) (face pick)
9:16.5  [CHART] C4-plumbers IN → 9:21.3 (job card, FORECAST)
9:17.3  [CHART] C4-plumbers counter 0 → 510,600 landing on '511,000' @9:18.2
9:18.2  SAY:  "511,000 job the job they told you was safe and right now it is"
9:19.0  [CHART] C4-plumbers the gold italic subtitle 'the job they told you was safe' fades up on 'the job they told
        you was safe'
9:20.8  [CHART] C4-plumbers stamp 'NO ROBOT YET' slams in on 'and' (before 'right now it is, there's no robot
        plumber'); no apprenticeship length on this card (AS-RECORDED 565.20)
9:21.3  [VIDEO] BR-48-torch-solders-copper-pipe IN → 9:25.2 (E48 slot: plumber soldering copper pipe with torch) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
9:23.3  SAY:  "There's no robot plumber"
9:25.2  [IMAGE] IMG-23-robot-hand-red-wrench-copper-pipe IN → 9:28.1 · 'ILLUSTRATION' tag (comp) +
        C3-badge-forecast.png overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-2 (glitch-still, 0.48s) (AI still)
9:25.2  SAY:  "But every pipe in your house was built for human hands and a machine with human hands doesn't need a
              few years of apprenticeship"
9:28.1  [CONTAINER] download-card (card) IN → 9:34.0: APPRENTICESHIP: years, per person · DOWNLOAD: once, every robot
        · I give it a few years; FORECAST badge baked; no apprenticeship length for plumbers → hand:xfade-scale (container-xfade, 0.35s)
9:31.5  [CONTAINER] download-card spotlight (comp-level): DOWNLOAD: once, every robot lifts on 'It needs a download'
9:31.5  SAY:  "It needs a download. I give it just a few years and believe it or not"
9:32.6  [CONTAINER] download-card spotlight: 'I give it a few years' lifts on 'I give it'
9:34.0  [TRANSITION] cover→face cut-in F9 → lib:blocks-max-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
9:34.0  [FACE] F9 → 9:37.4 "And believe it or not it climbs all the way up the pay ladder" · AIRS AS THE BG-SWAP
        [VIDEO-LAYER] assets/face-swap/F9-higgsfield-bg-swap.mp4, generating (window in
        face-swap/windows-F2-F10.json); built at comp_build per comp-build §3b (as F1: full-frame, pre-framed so no
        FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded with FACE_REFRAME)
9:34.0  [CAPTION] ON → 9:37.4 (F9 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
9:35.1  SAY:  "It climbs all the way up the pay ladder computer programmers. Remember learn to code"
9:35.6  [MUSIC] HARD HIT 575.57: the loop restarts on the downbeat (file 86.8) ON 'climbs': the climb is scored, no
        dip on this face line; SFX: none
9:36.6  [PUNCH-IN] F9 punch 1 of 1 ON the desilence-coarse join 576.600 s (frame 17298, spine/jumpcuts-final.json):
        step IN on 'the pay ladder', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap clip already bakes a
        slight push (comp-build §3b), hand:punch; holds to the face-out 9:37.4
9:36.6  [LIGHTLEAK] F9 library light leak 5 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.77 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-5 (punch-leak, 0.40s) (punch-leak)
9:37.4  [TRANSITION] face→cover F9 out → lib:blocks-max-3 (face-cut, 0.96s) (face pick)
9:37.4  [CHART] C5-climb (Type 1 animated) IN → 9:40.8: all 12 labels set (top two as ghosts), dashed tracks, no bars
9:37.4  [CHART] C5-climb rows 0..8 fill bottom to top 0.08 s apart, values pop at the bar ends, on 'computer
        programmers'
9:38.3  [CHART] C5-climb the programmer bar JUMPS 0 → 1030.1 px (easeOutBack), glow, '100,390' pops, the other rungs
        dim to .62 (pays off the CH1 'learn to code' hook)
9:39.0  [CHART] C5-climb 'REMEMBER: LEARN TO CODE' pill drops in with its dashed pointer on 'Remember learn to code'
9:40.8  [CHART] C4-programmers IN → 9:44.5 (job card lands already named, DEPLOYED) → hand:xfade-scale (container-xfade, 0.35s)
9:40.8  [CHART] C4-programmers counter 0 → 110,800, lands just after '111,000'
9:41.0  SAY:  "111,000 jobs at risk because Google says"
9:43.6  [CHART] C4-programmers stamp 'GOOGLE: 75% OF NEW CODE BY AI' slams in on 'says 75'
9:44.5  [RECEIPT] R10 R(article) (The Decoder, 2026-04-23: Pichai, 75 percent of new code at Google is generated by AI
        and then reviewed by human developers; the reviewed clause kept in the crop) IN → 9:49.3, push into the quote
        on '75%' `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
9:44.8  SAY:  "75% of its new code is now generated by AI and the government already projects this job to shrink by
              7%"
9:49.3  [IMAGE] IMG-24-code-scrolling-empty-office IN → 9:52.0 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still)
9:52.0  [DUCK] Bed C -3 dB dip under F10 (0.3 s ramps) → 9:56.8
9:52.0  [TRANSITION] cover→face cut-in F10 → lib:blocks-max-1 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md;
        the face-side still pulls the swap clip)
9:52.0  [FACE] F10 → 9:56.8 "and trust me. I'm a programmer. I know what AI can do" · AIRS AS THE BG-SWAP
        [VIDEO-LAYER] assets/face-swap/F10-higgsfield-bg-swap.mp4, generating (window in
        face-swap/windows-F2-F10.json); built at comp_build per comp-build §3b (as F1: full-frame, pre-framed so no
        FACE_REFRAME, spine audio kept; a clip that fails QA airs as recorded with FACE_REFRAME)
9:52.0  [CAPTION] ON → 9:56.8 (F10 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
9:52.2  SAY:  "And trust me. I'm a programmer. I know what AI can do radiologists"
9:56.0  [PUNCH-IN] F10 punch 1 of 1 ON the desilence-coarse join 595.967 s (frame 17879, spine/jumpcuts-final.json):
        step IN on 'AI can do', a hard scale step about FACE_POINT, SUBTLE ~6%: the swap clip already bakes a slight
        push (comp-build §3b), hand:punch; holds to the face-out 9:56.8
9:56.0  [LIGHTLEAK] F10 library light leak 6 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.80 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-2 (punch-leak, 0.40s) (punch-leak)
9:56.8  [TRANSITION] face→cover F10 out → lib:blocks-max-2 (face-cut, 0.96s) (face pick)
9:56.8  [CHART] C4-radiologists IN → 10:02.3 (job card, DEPLOYED · TOOLS badge; all four lamps dark)
9:57.5  [CHART] C4-radiologists counter 0 → 28,700 landing on '29,000' @9:58.5
9:58.4  SAY:  "29,000 jobs at about four hundred and twenty thousand dollars a year at risk because the FDA"
10:00.3 [CHART] C4-radiologists the MEDIAN PAY chip pulses on 'four hundred and twenty thousand' (the card shows
        420,860, AS-RECORDED 600.32)
10:01.9 [CHART] C4-radiologists stamp 'TOOLS, NOT REPLACEMENT' slams in on 'a year'
10:02.3 [IMAGE] IMG-25-radiology-room-empty-chair IN → 10:04.7 · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
10:04.1 SAY:  "Has already authorized more than 1,600 AI-enabled medical devices and you've probably seen the clip of
              Jensen Huang the CEO of"
10:04.7 [RECEIPT] R11 R(other) (FDA AI-enabled medical devices page) IN → 10:09.0, highlight 'over 1,600' on 'more
        than 1,600' @10:05.7 `[VERIFY count]` → hand:xfade-scale (container-xfade, 0.35s)
10:09.0 [RECEIPT] R17 R(other) assets/receipts/R17-huang-radiology-clip.mp4 LEAD-IN → 10:16.1: the clip's FIRST frame held
        as a still (Huang on the Sequoia stage, burned caption 'Jensen Huang, June 2026, repeating a warning made about 10
        years earlier') under 'you've probably seen the clip of Jensen Huang, the CEO of Nvidia, the first job AI will
        destroy is radiology' → hand:fade (broll-fade, 0.50s)
10:12.2 SAY:  "Nvidia the first job AI will destroy is"
10:15.5 SAY:  "Radiology nobody should go into this field now. It hasn't happened yet"
10:16.1 [INSERT] R17 SPLICED CLIP, 10.0 s: the spine PAUSES at the trough after 'radiology' (source 616.1, snapped
        616.100, gate guard -50.2 dB) and the clip plays FULL-FRAME with Huang's OWN voice (his audio is baked into the
        VO track by scripts/bake_clip_insert.py, spine/ALL.f.paused.json pauses[].clip); the bed ducks -14 dB under him
        (mix_music.py insert duck); transition IN and OUT on the insert edges → hand:fade (insert-in, 0.50s) (insert-in / insert-out).
        Mike 2026-10-08: 'splice this clip into our video and transition in and out', option 1 (after 'radiology').
10:16.1 [RECEIPT] R17 LEAD-OUT → 10:18.0: the clip's LAST frame held as a still under 'nobody should go into this
        field' → hand:fade (broll-fade, 0.50s) into R18
10:18.0 [RECEIPT] R18 R(other) (Sequoia Capital's own post of the conversation: radiology demand went UP, hospitals
        hired more radiologists) IN → 10:20.2, a 2.2 s pop that carries the dropped context sentence on screen ·
        [TRANSITION] clip out → hand:fade (broll-fade, 0.50s) `[VERIFY post]`
10:19.5 SAY:  "But he also says that every radiology platform today is driven by AI"
10:20.2 [CONTAINER] huang-real-line (card) IN → 10:24.2: 'every radiology platform and package today is driven by AI',
        Jensen Huang, 2026 (Lex Fridman Podcast via Fortune, 2026-04-01) `[VERIFY quote]` → hand:xfade-scale (container-xfade, 0.35s)
10:23.3 [CONTAINER] huang-real-line spotlight (comp-level): 'driven by AI' lifts on 'driven by AI'
10:24.2 [VIDEO] BR-49-tablet-spine-xray IN → 10:28.2 (E49 slot: doctor reviewing medical scan on tablet hospital) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
10:24.2 SAY:  "So right now the AI is a tool in the doctor's hands right now"
10:28.2 [CHART] C4-radiologists NOTE state, the SECOND cover of the same card: it returns ON its payoff look (counter
        already 28,700, no re-count) IN → 10:33.5; approved end look charts/C4-radiologists-note.png (the static card
        twin was REJECTED in visual-qa round 2) → hand:xfade-scale (container-xfade, 0.35s)
10:29.0 [CHART] C4-radiologists the gold dashed FORECAST stamp '...YET' slams in under the bone stamp on 'now' (reads
        'Tools, not replacement... yet')
10:29.4 SAY:  "And if I was picking a career right now"
10:30.1 [CHART] C4-radiologists the MY TAKE chip 'Not the career I'd pick right now.' fades up on 'picking a career'
10:31.5 SAY:  "I would not be choosing radiology and at the very top of the ladder the brain surgeon the average"
10:32.1 [CHART] C4-radiologists the MY TAKE chip pulses gold on 'not' (of 'I would not be choosing radiology')
10:33.5 [RISER] risers/Edgy_Riser.wav STARTS with the C5-top card (measured peak 5.15 s into the file, a soft taper;
        trimmed ON the peak so it ENDS on the landing at 10:38.7); rides the bar's growth UNDER the VO
10:33.5 [CHART] C5-top (Type 1 animated) IN → 10:39.0: rows 0..10 already lit at full scale with values; the
        neurosurgeon row = label + empty slot · MARQUEE candidate (MELT: the radiologist job card reforms into the pay
        ladder it sits on, the riser builds under the climb) → lib:melt-rgb-3 (MELT-transform, 0.76s)
10:34.3 [CHART] C5-top the top row's label brightens, rows 0..10 dim to .62, on 'the very top of the ladder'
10:35.8 [CHART] C5-top the neurosurgeon bar grows 0 → 1180 px with a live counter riding past its tip (passes the
        radiologist's 598.9 px at about 10:37.2) on 'the brain surgeon'
10:36.9 SAY:  "neurosurgeon in America makes about"
10:38.7 [RISER→IMPACT] THE SURGEON NUMBER: the riser ends on the landing frame · [IMPACT] Impacts/Impact_Hit_01-1.wav
        (weight 5; measured: peak 0.19 s into the file, audible tail 4.79 s to -40 dB) file starts 10:38.47 so its
        peak lands ON the landing; mixed UNDER the VO, the tail rings under C33
10:38.7 [CHART] C5-top LANDS: the counter hits 829,161 and re-seats inside the bar end, glow, 'AVERAGE PAY, DOXIMITY
        2026' fades in, on '$830,000' (the card shows 829,161, AS-RECORDED 638.96)
10:39.0 [RECEIPT] C33 stage 1: C33-top (Doximity Physician Compensation Report 2026 header) IN on '$830,000' → 10:41.1 → hand:xfade-scale (container-xfade, 0.35s)
10:39.0 SAY:  "$830,000 a year the highest-paid specialty in medicine more than 3 million surgeries were done with a
              da Vinci robot in"
10:41.1 [RECEIPT] C33 stage 2: C33 (the specialty ranking, neurosurgery first, 829,161 highlighted) on 'highest-paid
        specialty' → 10:42.7 → hand:xfade (container-xfade, 0.20s)
10:42.7 [VIDEO] BR-50-robotic-surgery-arms IN → 10:46.5 (E50 slot: surgical robot arms operating room da vinci style)
        · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
10:46.5 [CHART] C8 (Type 1 animated) IN → 10:51.2: header, both panel labels, dashed tracks, year labels, DEPLOYED
        badge; source Intuitive filings → hand:xfade-scale (container-xfade, 0.35s)
10:46.6 [CHART] C8 procedures 2,683,000 (2024) → 3,153,000 (2025) grow and count, landing on '2025' @10:47.3; 'up
        about 18% in a year' fades up `[VERIFY]`
10:47.3 SAY:  "2025 but every one of them had a surgeon at their control. It's a tool"
10:47.4 [CHART] C8 installed base 10,488 → 11,710 grows, 'up 12%' tag, on 'but every one of them' `[VERIFY Q3]`
10:49.4 [CHART] C8 takeaway 'A surgeon at every console.' slides up on 'surgeon' (guard 4: surgeon-controlled)
10:51.2 [RECEIPT] C32 R(article) (The Robot Report, 2025-07-09: Johns Hopkins SRT-H completed the gallbladder-removal
        phase autonomously, 17 sequential tasks, on pig cadaver tissue) IN → 10:58.0, push into the 17-steps sentence
        on 'a robot did the hardest part' @10:55.6 → hand:xfade-scale (container-xfade, 0.35s)
10:51.2 SAY:  "So here's what the robot has done on his own. In"
10:53.5 SAY:  "2025 at Johns Hopkins a robot did the hardest part of a gallbladder removal"
10:58.0 [DIAGRAM] C9-s1 (Type 2) IN → 11:06.7: three rising steps, 2022 'A live pig' (gray), 2025 'Pig cadaver tissue
        · 17 steps in a row, no human hand' (cyan, the current step), the third an empty dashed '?' slot, on '17
        steps' · MARQUEE candidate (SPIN, new facet: the autonomy ladder) → lib:spin-3d-corner-ease-t-cw (SPIN-newfacet, 0.88s)
10:58.0 SAY:  "17 steps in a row"
10:59.9 SAY:  "No human hand on pig tissue this time there may be no robot surgeon for sale right now"
11:02.4 [DIAGRAM] C9-s2: NEXT 'A human patient · not yet' fills in red on 'this time' (carries the dropped 'Never on a
        human', AS-RECORDED Dropped 2)
11:03.8 [DIAGRAM] C9-s3: 'No autonomous robot surgeon is for sale. The day one is...' + the FORECAST corner badge on
        'no robot surgeon' (the graphic states the fact, the VO hedges 'there may be')
11:06.7 [IMAGE] IMG-26-empty-operating-room-robot-arm IN → 11:10.7 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-3 (glitch-still, 0.48s) (AI still)
11:06.7 SAY:  "But the day there is it costs a whole lot less than that surgeon and it never takes a day off"
11:10.7 [CONTAINER] never-card-s1 (card) IN → 11:16.1: 'never takes a day off' lit (spoken @11:11.8), FORECAST badge → hand:xfade-scale (container-xfade, 0.35s)
11:13.1 SAY:  "It never goes home and never sleeps the day that machine exists"
11:13.6 [CONTAINER] never-card-s2: 'never goes home' lights on 'never goes home'
11:15.3 [CONTAINER] never-card-s3: 'never sleeps' lights on 'never sleeps'
11:16.1 [DUCK] Bed C -3 dB dip under F11 (0.3 s ramps): the 9-run enters inside it → 11:23.0
11:16.1 [TRANSITION] cover→face cut-in F11 → lib:blocks-max-3 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
11:16.1 [FACE] F11 → 11:23.0 "the day that machine exists no hospital pays 830,000 dollars a year pay for hands to get
        tired" · as recorded, FACE_REFRAME (assets/face-reframe.json)
11:16.1 [CAPTION] ON → 11:23.0 (F11 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
11:16.7 [PUNCH-IN] F11 punch 1 of 3 ON the desilence-coarse join 676.667 s (frame 20300, spine/jumpcuts-final.json):
        step IN on 'that machine exists', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the next
        join 11:19.7
11:16.7 [LIGHTLEAK] F11 library light leak 7 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.60 s after the face cut-in: take a SHORT look (0.4 s) so the leak
        clears the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-5 (punch-leak, 0.40s) (punch-leak)
11:17.7 SAY:  "No hospital pays eight hundred and thirty thousand dollars a year pay for hands to get tired and then
              it flips"
11:18.0 [MUSIC] HARD HIT 677.97: the loop exits into the 9-run of Bed C (the file's 138.0 hit) on 'No hospital',
        inside the -3 dB face dip; the dip releases at 11:23.0 and the full 9-run carries the four lights, unethical,
        illegal, the crash and the self-driving car; SFX: none (file-carried)
11:19.7 [PUNCH-IN] F11 punch 2 of 3 ON the defumble join 679.700 s (frame 20391, spine/jumpcuts-final.json): step BACK
        to the base frame on 'thirty thousand dollars', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds
        to the next join 11:22.1
11:19.7 [LIGHTLEAK] F11 library light leak 8 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
11:22.1 [PUNCH-IN] F11 punch 3 of 3 ON the desilence-coarse join 682.100 s (frame 20463, spine/jumpcuts-final.json):
        step IN on 'hands to get tired', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        face-out 11:23.0
11:22.1 [LIGHTLEAK] F11 library light leak 9 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 0.90 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-2 (punch-leak, 0.40s) (punch-leak)
11:23.0 [TRANSITION] face→cover F11 out → lib:blocks-max-1 (face-cut, 0.96s) (face pick)
11:23.0 [CHART] C2-surgeon (Type 1 animated) IN → 11:26.3: the FORECAST frame + tab, four dark lamps, FORECAST badge ·
        MARQUEE candidate (MELT callback: the CH2 four-word test returns on the surgeon) (the face-out row carries
        this cut: TRANSITIONS.md decides face glitch vs MELT)
11:23.3 [CHART] C2-surgeon BETTER ignites on 'then'
11:23.7 [CHART] C2-surgeon FASTER ignites + red rail segment on 'flips'
11:24.1 [CHART] C2-surgeon CHEAPER ignites on 'Once'
11:24.1 SAY:  "Once the machine is safer"
11:25.7 [CHART] C2-surgeon SAFER ignites LAST, all four pulse once (1 → 1.04 → 1), on 'safer'
11:26.3 [IMAGE] IMG-27-surgeon-glove-scalpel-light-pool IN → 11:29.7 · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still)
11:26.3 SAY:  "Letting a human hold a knife could start to look unethical"
11:29.7 [VIDEO] BR-51-gavel-strike IN → 11:32.2 (E51 slot: judge gavel courtroom close-up) · muted, from the clip head
        · Envato fade → hand:fade (broll-fade, 0.50s)
11:29.7 SAY:  "Maybe even illegal the same thing with driving if humans cause tens of thousands of accidents per year"
11:32.2 [IMAGE] IMG-28-highway-crash-aftermath-night IN → 11:35.5 · ingress → lib:tvsat-short-1 (glitch-still, 0.48s) (AI still) · atmosphere,
        no number on screen
11:35.5 [VIDEO] BR-52-hands-off-self-driving-car IN → 11:39.4 (E52 slot: self-driving car steering wheel turning by
        itself interior) · muted, from the clip head · Envato fade · no graphic says zero accidents (AS-RECORDED
        692.18) → hand:fade (broll-fade, 0.50s)
11:35.5 SAY:  "But a self-driving car doesn't cause any accidents at all. It's really a no-brainer"
11:39.4 [CONTAINER] where-safer-leads-s1 (card) IN → 11:44.0: 'It's a no-brainer.' lit (spoken @11:39.1) → hand:xfade-scale (container-xfade, 0.35s)
11:40.6 [CONTAINER] where-safer-leads-s2: 'There's no law like that now.' lights on 'There's no law'
11:40.6 SAY:  "There's no law like that now, but look at where safer leads"
11:43.2 [CONTAINER] where-safer-leads-s3: 'But look where safer leads.' + the SAFER lamp alone, lit, on 'safer'
11:43.6 [MUSIC] HARD HIT 703.62: the 9-run of Bed C STOPS DEAD on 'leads' (file 163.65, the file's own section edge):
        the hard stop, then the CH5 card 0.4 s later; SFX: none (the card impact follows)
```

## CH5 - WHAT IT DOES TO THE ECONOMY (11:44.0-13:29.8, Bed D `tesseract`, CARD ON)
```
11:44.0 [CARD] CH5 title-CH5 · [IMPACT] DSGNImpt · [TRANSITION] card presentation → rmn:slide (card, 0.40s) · "WHAT IT DOES TO
        THE ECONOMY": The card LEADS IN over the tail of where-safer-leads-s3 (the SAFER lamp) and holds through the
        1.5 s pause. SFX file and alignment as CH2 (DSGNImpt, peak 0.09 s in, tail 1.07 s); the music stop 0.42 s
        earlier makes this the video's one music-stop + impact card
11:44.0 [MUSIC] 0.6 s breath · Bed D `tesseract` (Cody Martin, Tesseract, instrumental) source_in 5.85, fades in over
        the last 0.5 s of the pause on its quiet intro, full on 'So what does all this do to the economy'; seat -23 dB
        (remotion gain -33.5 dB); no loop (one pass, file_t = spine_t - 698.19), runs straight on into CH6 → 13:29.8 ·
        HARD HIT 704.04 (bed change C to D)
11:44.0 [MUSIC] LIFT +8 dB on Bed D's intro and build (file 7-22 measures -18.7 LUFS; 0.3 s ramps) → 12:01.2
11:44.0 [DIAGRAM] two-forces-s1 (Type 2) IN → 11:48.6: THE ECONOMY node alone under the header, on 'So what does all
        this do' (card-owned cut)
11:44.0 SAY:  "So what does all this do to the economy two things and they pull in opposite directions"
11:46.1 [DIAGRAM] two-forces-s2: two short arrows sprout (cyan 1, red 2), unlabeled, on 'two things'
11:48.1 [DIAGRAM] two-forces-s3: the arrows splay to full length, a dashed arc + 'PULLING APART' opens, the labels
        land (1 PRICES down, 2 PAYCHECKS down) on 'opposite directions'
11:48.6 [CONTAINER] price-collapse (card) IN → 11:53.6: '1. PRICE COLLAPSE: already happened, to the things the
        machine makes' → hand:xfade-scale (container-xfade, 0.35s)
11:48.6 SAY:  "The first one is price collapse and it's already happened to the things the machine makes the cost of
              running AI"
11:51.3 [CONTAINER] price-collapse spotlight (comp-level): 'already happened' lifts on 'already happened'
11:53.6 [RECEIPT] C42 stage 1: C42-top (Stanford AI Index 2025 hero) IN on 'the cost of running AI' → 11:57.1 → hand:xfade-scale (container-xfade, 0.35s)
11:55.1 SAY:  "At the same level of quality has dropped more than 280 times in about two years"
11:57.1 [RECEIPT] C42 stage 2: C42 (section 7, the 280-fold sentence verified) push on 'has dropped more than 280
        times' → 12:00.5 `[VERIFY]` → hand:xfade (container-xfade, 0.20s)
12:00.5 [CHART] C13 (Type 1 animated) IN → 12:06.2: header, axis, gridlines 0/50/100, year ticks, 'START = 100' set,
        no lines → hand:xfade-scale (container-xfade, 0.35s)
12:00.5 SAY:  "But your rent didn't since late 2023 consumer prices have gone up about 9%"
12:00.5 [CHART] C13 the AI line draws Nov 2022 → Oct 2024 (down 280-fold), its end dot pops and its label fades up, on
        'your rent' @12:01.4
12:01.3 [MUSIC] HARD HIT 721.3: the full band of Bed D SLAMS in (file 23.1) on 'rent'; the +8 dB lift releases just
        before it, the C13 lines pull apart under the plateau; SFX: none (file-carried)
12:02.4 [CHART] C13 the CPI line draws Nov 2023 (100) → Aug 2026 (109.1), slow and steady, on 'since late 2023'
12:05.5 [CHART] C13 the CPI end dot pops + 'up 9.1%' on '9%' (guard 6: never 'the cost of living is collapsing')
        `[VERIFY CPI]`
12:06.2 [IMAGE] IMG-29-robot-run-city-street-dawn IN → 12:09.3 · 'ILLUSTRATION' tag (comp) + C3-badge-forecast.png
        overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-short-2 (glitch-still, 0.48s) (AI still)
12:06.2 SAY:  "Now picture a machine doing most of the work the optimists say the cost of living could fall by as much
              as 10 times"
12:09.3 [CONTAINER] optimists-card-s1 (card) IN → 12:14.9: 'THE OPTIMISTS SAY: the cost of living could fall as much
        as 10x' (no name, Mike's ruling) on 'the cost of living' · cross-fade + 0.93→1 scale-in → hand:xfade-scale (container-xfade, 0.35s)
12:12.5 SAY:  "I hope they're right"
12:13.3 [CONTAINER] optimists-card-s2: 'a hope; it hasn't shown up yet' lights on 'But it's a hope' (COVER-PLAN cued
        'hasn't' 12:14.1: moved to the start of the clause so the line reads before the cut)
12:13.3 SAY:  "But it's a hope that hasn't shown up yet"
12:14.9 [CHART] consumption-67 (Type 1 animated) IN → 12:20.5: header, empty ring track, sub-line, chips; 0.0% → hand:xfade-scale (container-xfade, 0.35s)
12:14.9 SAY:  "The second one is a scary one about two-thirds of the entire US economy is regular people spending
              money if nobody has a paycheck"
12:16.6 [CHART] consumption-67 counter 0.0 → 67.5 and the ring sweeps to 67.5% on 'about two-thirds' → 12:17.5
12:17.2 [CHART] consumption-67 'two-thirds' fades up in the ring center on '-thirds'
12:19.2 [CHART] consumption-67 'regular people spending money' brightens to white on 'regular people spending money'
12:20.5 [DUCK] Bed D -3 dB dip under F12 (0.3 s ramps), the face line sits on the level-9 plateau → 12:23.0
12:20.5 [TRANSITION] cover→face cut-in F12 → lib:blocks-short-3 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
12:20.5 [FACE] F12 → 12:23.0 "if nobody has a paycheck who buys anything" · as recorded, FACE_REFRAME
        (assets/face-reframe.json)
12:20.5 [CAPTION] ON → 12:23.0 (F12 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
12:22.0 [PUNCH-IN] F12 punch 1 of 1 ON the desilence-final join 742.033 s (frame 22261, spine/jumpcuts-final.json):
        step IN on 'who buys anything', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the face-out
        12:23.0
12:22.0 [LIGHTLEAK] F12 library light leak 10 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak); it sits 1.00 s before the face-out: take a SHORT look (0.4 s) so the leak clears
        the 0.96 s face-cut glitch window (an overlay never shares a frame with a transition, overlays.md)
        → lib:lightleaks-short-5 (punch-leak, 0.40s) (punch-leak)
12:22.2 SAY:  "Who buys anything a business doesn't make things for people with no money and that's one of the biggest
              risks of all it hasn't"
12:23.0 [TRANSITION] face→cover F12 out → lib:blocks-short-1 (face-cut, 0.96s) (face pick)
12:23.0 [VIDEO] BR-53-closed-storefront-shutters IN → 12:26.0 (E53 slot: empty shopping mall closed stores dark) ·
        muted, from the clip head · Envato fade
12:26.0 [CONTAINER] unemployment-4.2-forecast-s1 (card) IN → 12:33.0: US UNEMPLOYMENT 4.2 percent (September 2026,
        BLS) · 'it hasn't happened yet' (spoken @12:27.6) `[VERIFY 4.2]` → hand:xfade-scale (container-xfade, 0.35s)
12:27.8 SAY:  "Happened yet. Well, this is where I think it's heading so which industries make it. Here's how I see it
              the survivors"
12:29.0 [CONTAINER] unemployment-4.2-forecast-s2: the arrow 'where I think it's heading' + the FORECAST badge on it,
        on 'I think it's heading'
12:30.0 [CONTAINER] unemployment-4.2-forecast-s3: the header WHICH INDUSTRIES MAKE IT? on 'which industries make it'
12:33.0 [CONTAINER] C15-survives-a-s1 (card) IN → 12:38.9: the SURVIVES list (FORECAST label, no name), row 01 'Raw
        materials and energy' lit on 'Raw materials'; rows not yet said are INVISIBLE (visual-qa spoiler fix) → hand:xfade-scale (container-xfade, 0.35s)
12:33.0 SAY:  "Raw materials and energy chips robotics because in a gold rush you sell the pickaxes water farming
              solar and nuclear"
12:34.8 [CONTAINER] C15-survives-a-s2: 02 'Chips' lights on 'chips'
12:35.4 [CONTAINER] C15-survives-a-s3: 03 'Robotics' lights on 'robotics'
12:36.5 [CONTAINER] C15-survives-a-s4: the tag 'in a gold rush you sell the pickaxes' on 'in a gold rush'
12:38.9 [CONTAINER] C15-survives-b-s1 → 12:44.5: the same card continues (01-03 + tag done), 04 'Water' lit on 'water' → hand:xfade-scale (container-xfade, 0.35s)
12:39.4 [CONTAINER] C15-survives-b-s2: 05 'Farming' on 'farming'
12:40.0 [CONTAINER] C15-survives-b-s3: 06 'Solar and nuclear' on 'solar'
12:41.3 [CONTAINER] C15-survives-b-s4: 07 'Experiences (restaurants, travel, vacations)' on 'and experiences'
12:41.3 SAY:  "and experiences"
12:42.5 SAY:  "Restaurants travel vacations and the ones I'd expect to go extinct or change so much that you won't
              recognize them"
12:44.5 [CONTAINER] C15-extinct-a-s1 (card) IN → 12:51.2: GOES EXTINCT, OR UNRECOGNIZABLE (FORECAST label, no name),
        the header alone, on 'the ones I'd expect to go extinct' → hand:xfade-scale (container-xfade, 0.35s)
12:49.0 SAY:  "Probably health care as we know it definitely universities insurance and thin margin finance and of
              course, Hollywood"
12:49.5 [CONTAINER] C15-extinct-a-s2: 'Health care as we know it' on 'health care'
12:51.2 [CONTAINER] C15-extinct-b-s1 → 12:58.5: the same card continues, 'Universities' lit (spoken @12:51.6) → hand:xfade-scale (container-xfade, 0.35s)
12:52.5 [CONTAINER] C15-extinct-b-s2: 'Insurance and thin-margin finance' on 'insurance'
12:56.3 [CONTAINER] C15-extinct-b-s3: 'Hollywood' on 'Hollywood'
12:56.7 [CONTAINER] C15-extinct-b-s4: the tag 'no actors needed' on 'Now they don't even need actors' (text only, no
        AI film as proof, AS-RECORDED 776.72)
12:56.7 SAY:  "Now they don't even need actors, but look at that survivor list again"
12:58.5 [VIDEO] BR-54-molten-metal-pour IN → 13:01.9 (E54 slot: steel mill molten steel pouring foundry) · muted, from
        the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
13:00.2 SAY:  "We're still gonna need steel and food and power"
13:01.9 [CONTAINER] survivors-tiles-s1 (card) IN → 13:05.8: STEEL lit (spoken @13:01.1 under BR-54)
13:02.2 [CONTAINER] survivors-tiles-s2: FOOD lands on 'food' → hand:xfade-scale (container-xfade, 0.35s)
13:03.1 [CONTAINER] survivors-tiles-s3: POWER lands + the subtitle 'even if every bit of it is made by machines' on
        'power'
13:03.5 SAY:  "Even if every bit of it is made by machines the industry survives the job inside of it doesn't so if
              labor gets cheap and"
13:05.8 [DUCK] Bed D -3 dB dip under F13 (0.3 s ramps) → 13:08.6
13:05.8 [TRANSITION] cover→face cut-in F13 → lib:blocks-short-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
13:05.8 [FACE] F13 → 13:08.6 "the industry survives the job inside of it doesn't" · as recorded, FACE_REFRAME
        (assets/face-reframe.json)
13:05.8 [CAPTION] ON → 13:08.6 (F13 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
13:07.5 [PUNCH-IN] F13 punch 1 of 1 ON the desilence-coarse join 787.500 s (frame 23625, spine/jumpcuts-final.json):
        step IN on 'the job inside of it', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        face-out 13:08.6
13:07.5 [LIGHTLEAK] F13 library light leak 11 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
13:08.6 [TRANSITION] face→cover F13 out → lib:blocks-short-3 (face-cut, 0.96s) (face pick)
13:08.6 [CONTAINER] C15-jobs-fade-s1 (card) IN → 13:14.5: the SURVIVES column lit with its JOBS tag (the third state
        of the C15 list, after F13)
13:09.1 [CONTAINER] C15-jobs-fade-s2: the JOBS tag fades out on 'labor gets cheap' (the industry survives, the job
        inside it does not)
13:10.6 SAY:  "Services get cheap what holds its value the things you can't make more of land energy"
13:11.6 [CONTAINER] C15-jobs-fade-s3: WHAT HOLDS ITS VALUE? the things you can't make more of, on 'what holds its
        value'
13:14.5 [CONTAINER] land-energy-compute-s1 (card) IN → 13:17.9: LAND lands on 'land' → hand:xfade-scale (container-xfade, 0.35s)
13:15.1 [CONTAINER] land-energy-compute-s2: ENERGY lands on 'energy'
13:16.2 [CONTAINER] land-energy-compute-s3: COMPUTE lands on 'Computing power'
13:16.2 SAY:  "Computing power and that's one fact"
13:17.9 [VIDEO] BR-55-sunset-farmland-aerial IN → 13:22.5 (E55 slot: aerial drone flyover farmland fields sunset) ·
        muted, from the clip head · Envato fade · LEADING aerial into the Gates fact → hand:fade (broll-fade, 0.50s)
13:17.9 SAY:  "I'm gonna drop right here the largest private owner of farmland in America is a software billionaire
              Bill Gates almost"
13:22.5 [RECEIPT] C40 R(article) (The Land Report: Bill Gates, almost 250,000 acres of farmland, the nation's largest
        private farmland owner, 275,000 acres in total) IN → 13:29.8, push into the largest-owner line on 'Bill Gates'
        @13:23.9; no motive caption (guard 6) `[VERIFY acreage]` → hand:xfade-scale (container-xfade, 0.35s)
13:25.6 SAY:  "250,000 acres of it most of us can't buy land like that now we get to the part that actually worries me
              a society runs on a"
```

## CH6 - WHO HOLDS THE CARDS (13:29.8-14:39.6, Bed D continues +2 dB, card OFF, no FACE by Mike's ruling)
```
13:29.8 [MUSIC] HARD HIT 809.76: CH6 opens CARDLESS on 'Now we get to the part that actually worries me': the merged
        Bed D steps up +2 dB (0.5 s ramp) from the explainer seat to the hype seat (-21 dB, gain -31.5 dB), no card,
        no breath; its last transient (file 181.0) is right-aligned to 'can't' at 14:39.2 → 14:39.6
13:29.8 [DIAGRAM] C14-s1 (Type 2) IN → 13:43.2: the header 'A three-way deal' + the empty table ring on 'Now we get to
        the part' (THE rich diagram, shown ONCE in full, 13.4 s) · MARQUEE candidate (SPIN, new facet: the social
        contract, the turn of the video) → lib:spin-3d-corner-ease-t-cw (SPIN-newfacet, 0.88s)
13:33.4 SAY:  "Three-way deal"
13:34.3 [DIAGRAM] C14-s2: the GOVERNMENT seat lands (purple) on 'Government'
13:34.3 SAY:  "Government business and working people and the reason working people get a seat at the table is"
13:34.9 [DIAGRAM] C14-s3: the BUSINESS seat lands (cyan) on 'business'
13:35.8 [DIAGRAM] C14-s4: the WORKING PEOPLE seat lands (green), the three links draw, on 'working people'
13:39.4 SAY:  "That the other two need our labor that seat is already shrinking in the second quarter of 2026"
13:41.0 [DIAGRAM] C14-s5: the two links into WORKING PEOPLE turn green with LABOR tags on 'labor'
13:41.3 [DIAGRAM] C14-s6: the WORKING PEOPLE seat shrinks (r 118 → 78; the comp may tween 0.3 s) on 'that seat is
        already shrinking'
13:43.2 [RECEIPT] C12 R(other) real-site chart (BLS TED, 2026-09-15: labor share of output, nonfarm business, 1947 to
        Q2 2026; real chart, never restyled) IN → 13:55.9, two-stage push to the right edge onto the 52.8 percent low
        on 'fifty two point eight percent' @13:49.3 `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
13:45.8 SAY:  "The share of the economy's output that goes to the workers hit fifty two point eight percent"
13:50.8 SAY:  "That's the lowest ever recorded in data going back to the year"
13:55.3 SAY:  "1947 labor was your leverage take away the need for labor and"
13:55.9 [MUSIC] HARD HIT 835.88: no move, the plateau holds; the C14-leverage state change carries the beat; SFX: none
13:55.9 [DIAGRAM] C14-leverage-s1 IN → 14:02.9: the LABOR links PULSE (thicker green glow; the comp may breathe .8 → 1
        → .8 once) on 'labor was your leverage' (COVER by Mike's ruling) · MARQUEE candidate (MELT callback of C14) → lib:melt-rgb-3 (MELT-transform, 0.76s)
13:58.0 [DIAGRAM] C14-leverage-s2: the LABOR links are gone (dashed ghosts, red X), WORKING PEOPLE dims to .38, on
        'take away the need for labor'
14:00.1 [DIAGRAM] C14-leverage-s3: GOVERNMENT and BUSINESS each hold a fan of three cards on 'Government and
        businesses' ('holding all the cards' @14:01.7)
14:00.1 SAY:  "Government and businesses are holding all the cards and the fix everybody reaches for is a check"
14:02.9 [RECEIPT] C37 R(other) (Elon Musk's X post, 2026-04-17: Universal HIGH INCOME via checks issued by the Federal
        government; no third-party reply in frame) IN → 14:13.0: wide, then a push into the highlighted checks line on
        'universal high income' @14:09.3 `[VERIFY quote]` → hand:xfade-scale (container-xfade, 0.35s)
14:05.8 SAY:  "Elon Musk the guy building robots posted himself universal high income via checks issued by federal
              government"
14:13.0 [IMAGE] IMG-30-envelope-handoff-suit-sleeve IN → 14:16.7 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still)
14:13.0 SAY:  "Maybe that check comes I call it what it is"
14:15.7 SAY:  "It's an allowance and whoever sends the allowance sets the rules and this isn't just theory under a US
              law"
14:16.7 [DIAGRAM] C14-allowance-s1 IN → 14:19.9: a thin purple ALLOWANCE arrow arcs GOVERNMENT → WORKING PEOPLE on
        'and whoever' (COVER by Mike's ruling; the comp may draw it on over 0.3 s) → hand:xfade-scale (container-xfade, 0.35s)
14:17.5 [DIAGRAM] C14-allowance-s2: the arrow THICKENS (6 → 16 px) on 'sends'
14:18.7 [DIAGRAM] C14-allowance-s3: a red RULES tag (padlock) attaches on 'sets the rules'
14:19.9 [CONTAINER] us-law-july-2025 (card) IN → 14:23.9: NOT THEORY: a US law, signed July 2025 (the GENIUS Act) → hand:xfade-scale (container-xfade, 0.35s)
14:22.7 [CONTAINER] us-law-july-2025 spotlight (comp-level): 'signed July 2025' lifts on 'Signed in July'
14:22.7 SAY:  "Signed in July of 2025 every company that issues a stablecoin"
14:23.9 [IMAGE] IMG-31-digital-dollar-coin-padlock-circuit IN → 14:27.6 · ingress → lib:tvsat-min-2 (glitch-still, 0.32s) (AI still)
14:27.6 [RECEIPT] C38 R(other) (White House GENIUS Act fact sheet: issuers must be able to seize, freeze, or burn
        payment stablecoins when legally required) IN → 14:35.2, push into the seize / freeze / burn line on 'seize
        it' @14:31.3 (guard 7: US law, no CBDC line) → hand:xfade-scale (container-xfade, 0.35s)
14:27.6 SAY:  "That's a private digital dollar has to be able to seize it freeze it or burn it when legally required"
14:35.2 [CONTAINER] frozen-split-s1 (card) IN → 14:39.6: the left half CAN BE FROZEN (by design) lit, the right half
        dark, on 'some digital money can be frozen' → hand:xfade-scale (container-xfade, 0.35s)
14:35.2 SAY:  "So some digital money can be frozen by design and some can't so then how do you protect yourself?"
14:39.1 [MUSIC] HARD HIT 879.08: Bed D's last transient (file 181.0) lands inside 'can't' at 14:39.2, the chord rings
        0.4 s and the CH7 card cuts the decay; SFX: none (the card impact follows)
14:39.1 [CONTAINER] frozen-split-s2: the right half CAN'T lights, left unexplained, on 'can't'
```

## CH7 - HOW TO PROTECT YOURSELF (14:39.6-17:42.5, Bed E `story-of-my-life`, CARD ON)
```
14:39.6 [CARD] CH7 title-CH7 · [IMPACT] DSGNImpt · [TRANSITION] card presentation → rmn:slide (card, 0.40s) · "HOW TO PROTECT
        YOURSELF": The card LEADS IN over the tail of frozen-split-s2 and holds through the 1.5 s pause. SFX file and
        alignment as CH2 (DSGNImpt, peak 0.09 s in, tail 1.07 s)
14:39.6 [MUSIC] 0.6 s breath · Bed E `story-of-my-life` (Bobo Renthlei, Story Of My Life, instrumental), right-aligned
        (align_end; head trim 1.53 s, file 2.03 on the first word), fades in over the last 0.5 s of the pause on its
        build open, full on 'So then how do you protect yourself?'; seat -23 dB (remotion gain -32.7 dB); bar-aligned
        loop region 91.04-111.25 x3 (seams 16:28.8 · 16:49.0 · 17:09.2 · 17:29.4) → 17:42.5 · HARD HIT 879.56 (bed
        change D to E, the turn to hope)
14:39.6 [MUSIC] LIFT +5 dB on Bed E's build open (file 0-10.2 measures -14.8 LUFS; 0.2 s ramps) → 14:47.6
14:39.6 [CONTAINER] protect-yourself-s1 (card) IN → 14:44.0: HOW DO YOU PROTECT YOURSELF? on 'So then how do you
        protect yourself?' (card-owned cut)
14:41.9 [CONTAINER] protect-yourself-s2: 'stop depending on selling your TIME' lights, the clock face dims, on 'You
        stop depending'
14:41.9 SAY:  "You stop depending on selling your time"
14:44.0 [TRANSITION] cover→face cut-in F14 → lib:blocks-max-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
14:44.0 [FACE] F14 → 14:47.0 "you stop being a worker and you start being an owner" · as recorded, FACE_REFRAME
        (assets/face-reframe.json)
14:44.0 [CAPTION] ON → 14:47.0 (F14 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied)
14:44.1 SAY:  "You stop being a worker and you start being an owner own what stays scarce and own what nobody
              controls"
14:45.8 [PUNCH-IN] F14 punch 1 of 1 ON the desilence-coarse join 885.833 s (frame 26575, spine/jumpcuts-final.json):
        step IN on 'you start being an owner', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        face-out 14:47.0
14:45.8 [LIGHTLEAK] F14 library light leak 12 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
14:47.0 [TRANSITION] face→cover F14 out → lib:blocks-max-3 (face-cut, 0.96s) (face pick)
14:47.0 [CONTAINER] own-scarce (card) IN → 14:50.5: OWN what stays SCARCE · OWN what NOBODY CONTROLS
14:47.7 [MUSIC] HARD HIT 887.73: the band of Bed E enters (file 10.2) on 'stays': the full band lands on the answer;
        SFX: none (file-carried)
14:47.8 [CONTAINER] own-scarce spotlight (comp-level): 'OWN what stays SCARCE' lifts on 'stays scarce'
14:49.4 [CONTAINER] own-scarce spotlight: 'OWN what NOBODY CONTROLS' lifts on 'nobody controls'
14:50.5 [CHART] C16-gates (Type 1 animated) IN → 14:55.5: header + four dark dashed slots; the Gates tile lights
        (solid card, green top accent, mark circle, name) on 'Bill Gates' → hand:xfade-scale (container-xfade, 0.35s)
14:50.5 SAY:  "Bill Gates can order a quarter of a million acres of farmland you and I maybe we can't but anybody with
              a phone can own"
14:51.5 [CHART] C16-gates the acre counter 0 → 275,000 + 'acres owned', landing on 'acres' @14:52.9 (ownership, not an
        order: AS-RECORDED 891.48) `[VERIFY]`
14:53.6 [CHART] C16-gates 'almost 250,000 of it farmland' + 'The Land Report' fade in on 'farmland'
14:54.1 [CHART] C16-gates the three dark slots (BTC, KAS, TAO) breathe once on 'you and I maybe we can't'
14:55.5 [VIDEO] BR-56-phone-bitcoin-coin IN → 14:59.5 (E56 slot: hand holding smartphone crypto wallet app dark) ·
        muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
14:57.1 SAY:  "A digital asset that's provably scarce"
14:59.5 [RECEIPT] R22 R(other) (CoinGecko Bitcoin page, the desktop recapture: name header + supply rows in one frame,
        no price block) IN → 15:04.9; highlight the 21 million max on '21 million' @15:00.8, then circulating about
        20.09 million (about 96 percent) on '96%' @15:02.8 `[VERIFY supply]` → hand:xfade-scale (container-xfade, 0.35s)
14:59.6 SAY:  "There will only ever be 21 million Bitcoin and almost 96% of them already exist and here is why I
              think"
15:04.9 [IMAGE] IMG-32-kaspa-and-bitcoin-circuit-landscape IN → 15:08.9 · ingress → lib:tvsat-short-3 (glitch-still, 0.48s) (AI still) · the
        REAL Kaspa mark (backwards K), never an invented logo
15:06.5 SAY:  "Crypto doesn't just survive in an AI world it flourishes first"
15:08.9 [CONTAINER] three-reasons-1-s1 (card) IN → 15:16.2: the header WHY CRYPTO FLOURISHES IN AN AI WORLD, slots
        dark, on 'flourishes' → hand:xfade-scale (container-xfade, 0.35s)
15:11.2 [CONTAINER] three-reasons-1-s2: 1 MACHINES NEED MONEY lights on 'Machines need money'
15:11.2 SAY:  "Machines need money an AI agent can't walk into a bank and open an account the CEO of Coinbase makes
              that case and his product"
15:13.3 [CONTAINER] three-reasons-1-s3: 'an AI agent can't walk into a bank and open an account' on 'AI agent'
15:16.2 [RECEIPT] R12 R(article) (FinTech Weekly, 2026-03-10, on Brian Armstrong's post: AI agents can't pass KYC for
        a bank account, a crypto wallet needs no identity) IN → 15:20.0, push into the argument paragraph; the
        on-screen note 'Coinbase sells agent wallets' on EVERY frame (REQUIRED: the disclosure was not spoken,
        AS-RECORDED 916.16) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
15:19.1 SAY:  "Is already live. There's an open standard called x402 where software pays software in stablecoins"
15:20.0 [DIAGRAM] C17-s1 (Type 2) IN → 15:27.7: AI AGENT and SERVER boxes, dashed lifelines, the x402 pill, DEPLOYED
        badge, on "There's an open standard" · MARQUEE candidate (SPIN, new facet: how a machine pays) → lib:spin-3d-corner-ease-t-cw (SPIN-newfacet, 0.88s)
15:21.6 [DIAGRAM] C17-s2: message 1 (cyan, agent → server) 'asks for the data' on 'x402' (always lowercase x402, never
        'x4o2')
15:22.8 [DIAGRAM] C17-s3: message 2 (gold, server → agent) '402 Payment Required + a price' on 'where'
15:23.8 [DIAGRAM] C17-s4: message 3 (green) 'signs a stablecoin payment, asks again' on 'pays'
15:25.1 [DIAGRAM] C17-s5: message 4 (cyan) 'the data comes back' on 'in [stablecoins]' (the word restored from
        large-v3)
15:25.6 SAY:  "In one 30-day stretch about 75 million payments averaging 32 cents each and Visa and Mastercard have
              joined a foundation behind it"
15:26.4 [DIAGRAM] C17-s6: the stat line 'about 75 million payments in 30 days · average 32 cents' on 'In one 30-day
        stretch' `[VERIFY]`
15:27.7 [RECEIPT] C41 R(article) (CoinDesk, 2026-07-15: about 75 million x402 payments in 30 days, average about 32
        cents; Visa and Mastercard join the x402 Foundation) IN → 15:33.8: the headline, then a push into the 75
        million / 32 cents paragraph on '75 million' @15:28.1 (guard 8) `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
15:33.8 [CHART] early-x402 (Type 1 animated) IN → 15:39.7: the Visa outline (14.2 trillion a year) already drawn as
        the backdrop → hand:xfade-scale (container-xfade, 0.35s)
15:33.8 SAY:  "Now I know that sounds tiny about 24 million dollars a month, but that's really what early looks like
              second"
15:34.7 [CHART] early-x402 the Visa outline pulses once on 'sounds tiny'
15:35.1 [CHART] early-x402 the x402 sliver fills bottom-up, '24 million' counts, on 'about 24 million dollars a month'
15:37.8 [CHART] early-x402 takeaway 'That's what early looks like.' slides up on 'really what early'
15:39.7 [IMAGE] IMG-33-digital-dollar-coin-frozen-in-ice IN → 15:43.5 · ingress → lib:tvsat-min-3 (glitch-still, 0.32s) (AI still)
15:39.7 SAY:  "Those stablecoins are the ones that can be frozen"
15:42.8 SAY:  "So the money I care about is the money with no issuer and no gatekeeper"
15:43.5 [CONTAINER] frozen-split-filled (card) IN → 15:47.5: the CH6 split card returns with the right half filled,
        CAN'T BE FROZEN: no issuer, no gatekeeper (a new state asset, not a reuse) → hand:xfade-scale (container-xfade, 0.35s)
15:45.5 [CONTAINER] frozen-split-filled spotlight (comp-level): 'no issuer' lifts on 'no issuer', 'no gatekeeper' on
        'no gatekeeper' @15:47.0
15:47.5 [IMAGE] IMG-34-bitcoin-kaspa-dark-stone-mining-heat IN → 15:51.0 · ingress → lib:tvsat-min-1 (glitch-still, 0.32s) (AI still) · the
        REAL Kaspa mark
15:47.5 SAY:  "Bitcoin is that and Kaspa is that proof of work fair launched in November of 2021 with no premine"
15:51.0 [RECEIPT] C39 R(other) (kaspa.org lore page: 'No premine, insider allocation, or pre-sales. Every coin in
        circulation has been mined in the open from genesis onward'; Kaspa greenish-cyan frame) IN → 15:59.7, push
        into the no-premine sentence on 'no premine' @15:53.4 (the page says mined; no graphic says minted; guard 8) → hand:xfade-scale (container-xfade, 0.35s)
15:54.2 SAY:  "And no insider allocation every coin minted out in the open and on the AI side"
15:57.1 [TEXT] CORRECTION OVERLAY "mined" (with the quotation marks), house caption style (Montserrat, the caption
        block), centred low over the C39 receipt, ON the word "minted" (source 957.12-957.66) and held 2.0 s -> 15:59.1;
        Mike 2026-10-08: he says "minted", the kaspa.org receipt on screen says "mined", the viewer must see the correction.
15:59.7 [CHART] C16-tao (Type 1 animated) IN → 16:05.7: land, BTC and KAS tiles lit at .5, the TAO slot dark → hand:xfade-scale (container-xfade, 0.35s)
15:59.7 SAY:  "There's Bittensor TAO an open AI network with a hard cap of 21 million"
16:00.2 [CHART] C16-tao the TAO tile lights, 'BITTENSOR · TAO' with the TAO mark per the reference image, on
        'Bittensor, TAO' (never 'tau')
16:01.1 [CHART] C16-tao 'open AI network' fades in on 'open AI network'
16:02.6 [CHART] C16-tao '21,000,000' counts and its unit becomes 'hard cap'; the issued bar fills to 54.0%, on 'hard
        cap of 21 million' → 16:03.9 `[VERIFY]`
16:04.4 [CHART] C16-tao 'SAME CAP AS BITCOIN' pill pops, the BTC tile flashes back to full for 0.4 s, on 'The same as
        Bitcoin' (no fair-launch claim for TAO)
16:04.4 SAY:  "The same as Bitcoin the more governments and corporations race to control compute money and AI"
16:05.7 [CONTAINER] thesis-card-s1 (card) IN → 16:14.9: the three tiles COMPUTE · MONEY · AI locking under governments
        and corporations (the ctrl state) on 'the more governments and corporations' → hand:xfade-scale (container-xfade, 0.35s)
16:08.5 [CONTAINER] thesis-card s1 spotlight (comp-level tile pulses): COMPUTE on 'compute', MONEY on 'money'
        @16:09.1, AI on 'AI' @16:10.6
16:11.0 [CONTAINER] thesis-card-s2 (the open state): the OPEN SOURCE versions get more valuable, signed MY THESIS, on
        'The more valuable the open source versions get'
16:11.0 SAY:  "The more valuable the open source versions get that's my thesis now"
16:14.9 [CONTAINER] catch-card (card) IN → 16:20.2: THE CATCH: if nobody can freeze your money, the only way to take
        it is to come to your house (a house icon, a door) → hand:xfade-scale (container-xfade, 0.35s)
16:14.9 SAY:  "There's a catch if nobody can freeze your money"
16:17.6 SAY:  "The only way to take it is to come to your house and that has been happening in the first six months
              of"
16:19.3 [CONTAINER] catch-card spotlight (comp-level): the house and the door lift on 'come to your house'
16:20.2 [RECEIPT] R16 stage 1: R16-top (CertiK Intel3D H1 2026 Wrench Attacks Report, the 2026-07-23 headline, 52
        verified incidents) IN on 'that has been happening' → 16:24.9 `[VERIFY newer report]` → hand:xfade-scale (container-xfade, 0.35s)
16:24.0 SAY:  "2026 a security firm counted 52 verified attacks on"
16:24.9 [RECEIPT] R16 stage 2: R16 (the executive summary incl. home invasions 1 → 20) on 'a security firm counted 52'
        → 16:28.8 → hand:xfade (container-xfade, 0.20s)
16:28.8 [CHART] home-invasions-1-20 (Type 1 animated) IN → 16:35.0: header, both half-year labels, 20 dark house
        outlines, no numbers → hand:xfade-scale (container-xfade, 0.35s)
16:28.8 SAY:  "Crypto holders kidnappings torture and home invasions went from 1 to 20 in a year. So remember that
              robot"
16:31.7 [CHART] home-invasions-1-20 'Home invasions' flashes red → white → red on 'home invasions' (only home
        invasions went 1 → 20; the card says HOME INVASIONS only, AS-RECORDED 988.80)
16:32.8 [CHART] home-invasions-1-20 '1' slams in with its single red house, the arrow draws, on '1'
16:33.2 [CHART] home-invasions-1-20 '20' counts 1 → 20 as the right field fills red house by house, landing on '20'
        @16:33.7
16:35.0 [IMAGE] IMG-35-robot-hallway-from-behind-close IN → 16:39.0 · 'ILLUSTRATION' tag (comp) +
        C3-badge-forecast.png overlay (tier 3: a forecast, never footage) · ingress → lib:tvsat-max-3 (glitch-still, 0.96s) (AI still) · the
        second angle of the CH3 hallway (Mike's ruling: two angles)
16:36.2 SAY:  "Standing in your hallway at 3 a.m"
16:38.7 SAY:  "That's a security guard that you might want to get third machines make things cheaper and that's
              deflation"
16:39.0 [CONTAINER] guard-then-deflation-s1 (card) IN → 16:44.9: THAT'S A SECURITY GUARD YOU MIGHT WANT (FORECAST) on
        'a security guard that you might want' → hand:xfade-scale (container-xfade, 0.35s)
16:41.2 [CONTAINER] guard-then-deflation-s2: 3 MACHINES MAKE THINGS CHEAPER = DEFLATION on 'third'
16:44.9 [RECEIPT] R24 R(article) (CMC Markets Opto, 2023-11-16: Jeff Booth, author of The Price of Tomorrow, 'The
        natural state of a free market is deflation') IN → 16:50.4, push into the quote on 'the natural state'
        @16:47.9 `[VERIFY quote]` → hand:xfade-scale (container-xfade, 0.35s)
16:44.9 SAY:  "Jeff Booth wrote a book on this and his line is the natural state of a free market is deflation"
16:50.4 [RECEIPT] C18 R(other) real-site chart (FRED M2SL: US M2 money supply at a record, about 23.3 trillion
        dollars, August 2026; never restyled) IN → 16:57.3, push into the right edge on 'about 23.3 trillion' @16:53.7
        (guard 7: the record is the fact, the printing is Mike's expectation) `[VERIFY M2]` → hand:xfade-scale (container-xfade, 0.35s)
16:50.4 SAY:  "But the US money supply is already at an all-time high about"
16:55.1 SAY:  "23.3 trillion dollars and I think when people lose their paychecks the government starts sending out
              those checks"
16:57.3 [CONTAINER] checks-card (card) IN → 17:01.2: paychecks lost -> the government sends out CHECKS (I think);
        FORECAST badge → hand:xfade-scale (container-xfade, 0.35s)
17:00.8 [CONTAINER] checks-card spotlight (comp-level): CHECKS lifts on 'checks'
17:01.2 [VIDEO] BR-57-printing-press-dollar-bills IN → 17:05.2 (E57 slot: money printing press banknotes printing
        close-up) · muted, from the clip head · Envato fade → hand:fade (broll-fade, 0.50s)
17:01.2 SAY:  "Just like Elon said and to pay for them. It prints money. So that number gets a lot higher cheaper
              goods more dollars"
17:05.2 [CHART] money-printer-card (Type 1 animated) IN → 17:09.4: header, empty column frame, the ALL-TIME HIGH line;
        counter 0.0 → hand:xfade-scale (container-xfade, 0.35s)
17:05.4 [CHART] money-printer-card counter 0.0 → 23.3 and the column fills to the record line, landing on 'number'
        @17:05.9
17:06.2 [CHART] money-printer-card the gold dashed arrow grows past the record, 'a lot higher' + FORECAST badge fade
        in, on 'gets a lot higher'
17:07.3 [CHART] money-printer-card 'cheaper goods' pill pops on 'cheaper goods'
17:08.1 [CHART] money-printer-card 'more dollars' pill pops on 'more dollars'
17:09.4 [CONTAINER] conviction-card-s1 (card) IN → 17:18.1: 'scarce assets soak up that difference, over the long run'
        on 'I believe' → hand:xfade-scale (container-xfade, 0.35s)
17:09.4 SAY:  "I believe the scarce assets soak up that difference over the long run. That's my conviction"
17:14.0 [CONTAINER] conviction-card-s2: MY CONVICTION, NOT A PROMISE on "That's my conviction"
17:15.1 SAY:  "It's not a promise and nothing here is financial advice and as I'm recording this Bitcoin"
17:16.2 [CONTAINER] conviction-card-s3: 'nothing here is financial advice' on 'nothing here is financial advice'
17:18.1 [IMAGE] IMG-36-three-coins-btc-kas-tao-low-in-shadow IN → 17:22.1 · ingress → lib:tvsat-short-1 (glitch-still, 0.48s) (AI still) · no
        price chart on screen (C44 unused)
17:20.2 SAY:  "Kaspa and TAO are trading well below their all-time highs which implies a good time to get in do your
              own research"
17:22.1 [CONTAINER] dyor-card (card) IN → 17:27.7: as I'm recording this, BTC, KAS, TAO well below their all-time
        highs · DO YOUR OWN RESEARCH; no price, no target, no multiplier, and NO on-screen echo of 'a good time to get
        in' (AS-RECORDED 1044.14) `[VERIFY distance from highs]` → hand:xfade-scale (container-xfade, 0.35s)
17:26.2 [CONTAINER] dyor-card spotlight (comp-level): DO YOUR OWN RESEARCH lifts on 'do your own research'
17:27.7 [CHART] C7 (Type 1 animated) IN → 17:37.6: the header 'WHY NOW: 1992 of the AI buildout' + the 'I THINK' tag,
        on 'So why now' → hand:xfade-scale (container-xfade, 0.35s)
17:27.7 SAY:  "So why now because I think that we're in a 1992 of the AI build out. It's early"
17:30.1 [CHART] C7 '1992' flashes green → white → green, 'I THINK' pulses, on '1992'
17:32.6 [CHART] C7 'It's early.' slides up on "It's early"
17:33.4 [CHART] C7 the humanoid row: the gold dashed forecast outline draws (Omdia, 2.6 million a year by 2035,
        labeled forecast) on '13,000'
17:33.4 SAY:  "13,000 humanoid robots shipped in a year payment machines measured in cents and you can turn that
              paycheck into ownership"
17:34.4 [CHART] C7 the 2025 sliver pops, '2025: about 13,000 shipped' on 'humanoid robots shipped'
17:35.9 [CHART] C7 the x402 card slides up, '32' counts to 'cents' (x402 machine payments, AS-RECORDED 1055.92) on
        'payment machines measured in cents'
17:37.6 [DUCK] Bed E -3 dB dip under F15 (0.3 s ramps), the face line on the level-8 body → 17:42.3
17:37.6 [TRANSITION] cover→face cut-in F15 → lib:blocks-max-1 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
17:37.6 [FACE] F15 → 17:42.3 "and you can turn that paycheck into ownership while that paycheck still exists." · as
        recorded, FACE_REFRAME (assets/face-reframe.json)
17:37.6 [CAPTION] ON → 17:42.3 (F15 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; 'while that paycheck', never 'Well')
17:40.1 SAY:  "while that paycheck still exists. So that's a whole picture"
17:40.8 [PUNCH-IN] F15 punch 1 of 1 ON the desilence-coarse join 1060.767 s (frame 31823, spine/jumpcuts-final.json):
        step IN on 'while that paycheck still exists', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds
        to the face-out 17:42.3
17:40.8 [LIGHTLEAK] F15 library light leak 13 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
17:42.3 [TRANSITION] face→cover F15 out → lib:blocks-max-2 (face-cut, 0.96s) (face pick)
17:42.3 [IMAGE] IMG-37-brain-circuitry-dark-clean IN → 17:45.3 · face-owned cut
        (F15 out), a new still, not the CH2 brain
```

## CH8 - THE CLOSE (17:42.5-18:41.0, Bed E continues +2 dB, card OFF; ends ON face)
```
17:42.5 [MUSIC] HARD HIT 1062.48: CH8 opens CARDLESS on 'So that's a whole picture': the merged Bed E steps up +2 dB
        (0.5 s ramp) to the hype seat (-21 dB, gain -30.7 dB) on the unbroken final run of the file (no seam after
        17:29.4); align_end pins the file END to the last frame → 18:41.0
17:43.9 SAY:  "The brain went first then it got a body and the list of safe jobs keeps getting shorter"
17:45.3 [CONTAINER] recap-list-s1 (card) IN → 17:49.4: The brain went first / THEN IT GOT A BODY (lit) / The list of
        safe jobs keeps getting shorter, 12 CH4 job names, none struck, on 'then it got a body' → hand:xfade-scale (container-xfade, 0.35s)
17:46.8 [CONTAINER] recap-list-s2: the list and its column light, the first name strikes out, on 'the list of safe
        jobs'
17:47.0 [CONTAINER] recap-list-s3: the second name strikes out
17:47.2 [CONTAINER] recap-list-s4: the third name strikes out
17:47.4 [CONTAINER] recap-list-s5: the fourth name strikes out ('safe')
17:47.6 [CONTAINER] recap-list-s6: the fifth name strikes out ('jobs')
17:47.8 [CONTAINER] recap-list-s7: the sixth name strikes out
17:48.0 [CONTAINER] recap-list-s8: the seventh name strikes out
17:48.2 [CONTAINER] recap-list-s9: the eighth name strikes out ('keeps')
17:48.4 [CONTAINER] recap-list-s10: the ninth name strikes out
17:48.6 [CONTAINER] recap-list-s11: the tenth name strikes out ('getting')
17:48.8 [CONTAINER] recap-list-s12: the eleventh name strikes out
17:49.0 [CONTAINER] recap-list-s13: all 12 struck, landing on 'shorter'; holds to the F16 cut
17:49.4 [IMPACT] THE VIBE CUT, the biggest hit of the video, on the F16 face cut: Impacts/Impact_Hit_01-2.wav (weight
        5, the longest boom in the kit; measured: peak 0.13 s into the file, audible tail 6.20 s to -40 dB) file
        starts 17:49.27 so its peak lands ON the cut; rings under the locked line, UNDER the VO
17:49.4 [DUCK] THE one vibe-cut duck of the video (house rule 7): Bed E -4.2 dB relative to the seat (0.2 s ramps)
        across F16 → 17:55.3, back to the seat on 'and do it while you still have a paycheck' · HARD HIT 1069.56
17:49.4 [TRANSITION] cover→face cut-in F16 → lib:blocks-max-3 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
17:49.4 [FACE] F16 → 17:55.3 "The robots are coming for the paycheck, so own something that nobody can print, nobody
        can freeze" (the LOCKED closing line) · as recorded, FACE_REFRAME (assets/face-reframe.json) · THE VIBE CUT:
        impact + duck + crash zoom on this cut
17:49.4 [CAPTION] ON → 17:55.3 (F16 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; the closing line MUST read 'freeze' @17:55.1, Mike's ruling)
17:49.4 [PUNCH-IN] THE VIBE-CUT CRASH ZOOM ON the F16 face cut (WHEN-TO-USE-IMPACTS: impact + music drop + crash zoom,
        reserved for the one or two biggest conviction beats): ~18% about FACE_POINT, snaps in over ~4 frames,
        hand:punch, and holds to the interior join 17:52.6 where the frame steps BACK to base with the leak; a device
        of the CUT, not a join punch, so it carries NO leak of its own
17:49.6 SAY:  "The robots are coming for the paycheck"
17:51.7 SAY:  "So own something that nobody can print nobody can freeze and do it while you still have a paycheck to
              do it with and with"
17:52.6 [PUNCH-IN] F16 punch 1 of 1 ON the desilence-coarse join 1072.567 s (frame 32177, spine/jumpcuts-final.json):
        step BACK to the base frame (the vibe-cut crash zoom from the cut is the step in) on 'own something', a hard
        scale step about FACE_POINT, ~15-20%, hand:punch; holds to the face-out 17:55.3
17:52.6 [LIGHTLEAK] F16 library light leak 14 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
17:55.3 [TRANSITION] face→cover F16 out → lib:blocks-max-1 (face-cut, 0.96s) (face pick)
17:55.3 [IMAGE] IMG-38-kaspa-and-bitcoin-rising-from-darkness IN → 17:57.6 · face-owned cut (F16 out: the
        face-out row carries the ingress), over the locked COVER line 'and do it while you still have a paycheck to do it
        with'; text-free, no price, no target
17:57.6 [TRANSITION] cover→face cut-in F17 → lib:blocks-max-2 (face-cut, 0.96s) (the video's ONE face pick, picked in TRANSITIONS.md)
        · 'with' (the last word of the locked COVER line) starts 0.08 s after this edge: the face is up for the tail
        of 'to do it with'
17:57.6 [FACE] F17 → 18:41.0 EOF, the off-script community pitch (FACE by Mike's ruling 2026-10-06): "And with that
        said I do have one of the most successful crypto groups out there ... I'll catch you guys later" · as
        recorded, FACE_REFRAME · conversational: no impacts, no music move except the bed's own final chord
17:57.6 [CAPTION] ON → 18:41.0 (F17 only, never over a cover; montserrat house style, captions-builder; AS-RECORDED
        mishear list applied; 'too. Noobs', 'Crypto Rich VIP'; check 'Click' / 'ask' / 'VIP' by ear)
17:58.2 SAY:  "That said I do have one of the most successful"
18:01.6 SAY:  "Crypto groups out there by many many metrics whether you're an advanced trader and you're looking for
              a"
18:02.9 [PUNCH-IN] F17 punch 1 of 10 ON the desilence-coarse join 1082.900 s (frame 32487, spine/jumpcuts-final.json):
        step IN on 'by many many metrics', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the next
        join 18:05.8
18:02.9 [LIGHTLEAK] F17 library light leak 15 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
18:05.8 [PUNCH-IN] F17 punch 2 of 10 ON the desilence-final join 1085.767 s (frame 32573, spine/jumpcuts-final.json):
        step BACK to the base frame on 'trader', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        next join 18:08.3
18:05.8 [LIGHTLEAK] F17 library light leak 16 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
18:07.6 SAY:  "Community with a lot of software to help you a lot of insider alerts and bots and so on stuff that
              normal communities"
18:08.3 [PUNCH-IN] F17 punch 3 of 10 ON the desilence-coarse join 1088.333 s (frame 32650, spine/jumpcuts-final.json):
        step IN on 'a lot of software', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the next
        join 18:11.4
18:08.3 [LIGHTLEAK] F17 library light leak 17 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
18:11.4 [PUNCH-IN] F17 punch 4 of 10 ON the desilence-coarse join 1091.433 s (frame 32743, spine/jumpcuts-final.json):
        step BACK to the base frame on 'alerts and bots', a hard scale step about FACE_POINT, ~15-20%, hand:punch;
        holds to the next join 18:16.6
18:11.4 [LIGHTLEAK] F17 library light leak 18 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
18:14.8 SAY:  "Don't typically have right like I said"
18:16.6 [PUNCH-IN] F17 punch 5 of 10 ON the desilence-coarse join 1096.600 s (frame 32898, spine/jumpcuts-final.json):
        step IN on 'I said, I'm a programmer', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        next join 18:20.7
18:16.6 [LIGHTLEAK] F17 library light leak 19 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
18:17.2 SAY:  "I'm a programmer or if you're a newbie and you want to get into the crypto space"
18:20.7 [PUNCH-IN] F17 punch 6 of 10 ON the desilence-coarse join 1100.667 s (frame 33020, spine/jumpcuts-final.json):
        step BACK to the base frame on 'want to get into the crypto space', a hard scale step about FACE_POINT,
        ~15-20%, hand:punch; holds to the next join 18:22.4
18:20.7 [LIGHTLEAK] F17 library light leak 20 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
18:22.4 SAY:  "my group would be good for you too. Noobs are welcome and we have a lot of courses and"
18:22.4 [PUNCH-IN] F17 punch 7 of 10 ON the desilence-coarse join 1102.367 s (frame 33071, spine/jumpcuts-final.json):
        step IN on 'my group would be good', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the
        next join 18:32.4
18:22.4 [LIGHTLEAK] F17 library light leak 21 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
18:28.3 SAY:  "You can ask the question to a group of like-minded people and myself will be happy to help"
18:29.5 [MUSIC] HARD HIT 1109.46: the final chord of Bed E is struck under 'You can ask the question...' and rings out
        11 s, reaching silence on the last frame: the track resolves as he signs off; SFX: none (the community pitch
        stays conversational, house rule 7)
18:32.4 [PUNCH-IN] F17 punch 8 of 10 ON the desilence-coarse join 1112.433 s (frame 33373, spine/jumpcuts-final.json):
        step BACK to the base frame on 'myself will be happy to help', a hard scale step about FACE_POINT, ~15-20%,
        hand:punch; holds to the next join 18:36.8
18:32.4 [LIGHTLEAK] F17 library light leak 22 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
18:34.2 SAY:  "Click the link in the description below ask for Crypto Rich VIP and hit the like and subscribe button.
              I'll catch you guys later"
18:34.3 [LT] 'LINK IN THE DESCRIPTION' lower-third over F17 (comp-built text; PROJECT-LOG 2026-10-06: the community
        link rides as a lower-third over the face) on 'Click the link in the description below' → 18:41.0; captions
        sit above it; check 'Click', 'ask' and 'VIP' by ear (low-confidence words) and the name 'Crypto Rich VIP'
18:36.8 [PUNCH-IN] F17 punch 9 of 10 ON the desilence-coarse join 1116.833 s (frame 33505, spine/jumpcuts-final.json):
        step IN on 'Crypto Rich VIP', a hard scale step about FACE_POINT, ~15-20%, hand:punch; holds to the next join
        18:38.5
18:36.8 [LIGHTLEAK] F17 library light leak 23 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-2 (punch-leak, 1.12s) (punch-leak)
18:38.5 [PUNCH-IN] F17 punch 10 of 10 ON the desilence-coarse join 1118.467 s (frame 33554,
        spine/jumpcuts-final.json): step BACK to the base frame on 'and hit the like', a hard scale step about
        FACE_POINT, ~15-20%, hand:punch; holds to EOF 18:41.0
18:38.5 [LIGHTLEAK] F17 library light leak 24 of 24, its flash peaking ON the same join frame (screen blend, real
        footage, UNDER the captions; one id of the video's rotated set of 3-4 from the LIGHT LEAKS family,
        usage-ledger slot face_leak) → lib:lightleaks-5 (punch-leak, 1.12s) (punch-leak)
18:41.0 [END] the video ends ON the F17 face on 'later' (every cue clamps at 18:41.0; 'later' runs 1120.97-1121.19
        past the audio end): no end card, no CTA pickup, no face-out transition (the last face cut is the file end
        itself, hand:cut); Bed E's chord decays to silence on the last frame
```

## Orphan reconciliation - PRE-build, against assets/ on disk 2026-10-07 21:40 (VISUAL-QA.json: 390 checked, 390 PASS)
Source and metadata files (.html, .py, .json, .md) are exempt (comp-build §10). Every renderable file:

**PLACED:**
- **vid/ (56/56 PLACED, muted, BR-n = the COVER-PLAN Envato row En):** BR-1 0:26.3 · BR-2 0:35.2 · BR-3 0:42.5 · BR-4 0:44.4 · BR-5 0:46.3 · BR-6 0:48.0 · BR-7 0:57.7 · BR-8 1:00.1 · BR-9 1:06.1 · BR-10 1:52.3 · BR-11 1:56.1 · BR-12 2:24.9 · BR-13 2:32.1 · BR-14 2:42.8 · BR-15 2:52.1 · BR-16 2:58.5 · BR-17 3:02.4 · BR-18 3:05.4 · BR-19 3:09.4 · BR-20 3:11.2 · BR-21 3:43.7 · BR-22 3:49.5 · BR-23 3:52.7 · BR-24 4:16.6 · BR-25 4:41.6 · BR-26 4:59.1 · BR-27 5:01.8 · BR-28 5:17.0 · BR-29 5:43.8 · BR-30 5:45.5 · BR-31 5:50.1 · BR-32 5:57.6 · BR-33 6:11.4 · BR-34 6:13.5 · BR-35 6:19.9 · BR-36 6:25.9 · BR-37 6:32.4 · BR-38 6:56.0 · BR-39 7:00.0 · BR-40 7:09.3 · BR-41 7:12.9 · BR-42 7:16.6 · BR-43 7:23.2 · BR-44 7:48.5 · BR-45 8:24.6 · BR-47 9:07.2 · BR-48 9:21.3 · BR-49 10:24.2 · BR-50 10:42.7 · BR-51 11:29.7 · BR-52 11:35.5 · BR-53 12:23.0 · BR-54 12:58.5 · BR-55 13:17.9 · BR-56 14:55.5 · BR-57 17:01.2. BR-46 was never acquired (no clean match after 7 queries; its beat is folded into R7, PROJECT-LOG 2026-10-07, Mike confirms at this gate).
- **img/ (38/38 PLACED, stills; no motion clips this video):** IMG-1 0:39.2 · IMG-2 0:53.8 · IMG-3 1:02.9 · IMG-4 2:28.4 · IMG-5 2:55.1 · IMG-6 3:15.2 · IMG-7 3:46.8 · IMG-8 4:19.8 · IMG-9 4:30.8 · IMG-10 5:08.9 · IMG-11 5:12.2 · IMG-12 5:14.9 · IMG-13 5:35.4 · IMG-14 5:53.7 · IMG-15 6:15.9 · IMG-16 6:23.6 · IMG-17 6:28.4 · IMG-18 6:46.3 · IMG-19 7:20.6 · IMG-20 7:38.1 · IMG-21 8:09.7 · IMG-22 8:36.1 · IMG-23 9:25.2 · IMG-24 9:49.3 · IMG-25 10:02.3 · IMG-26 11:06.7 · IMG-27 11:26.3 · IMG-28 11:32.2 · IMG-29 12:06.2 · IMG-30 14:13.0 · IMG-31 14:23.9 · IMG-32 15:04.9 · IMG-33 15:39.7 · IMG-34 15:47.5 · IMG-35 16:35.0 · IMG-36 17:18.1 · IMG-37 17:42.3 · IMG-38 17:55.3.
- **receipts/ (51 of 54 files PLACED, every receipt beat filled):** C10 1:36.2 · C10-top 1:33.8 · C12 13:43.2 · C18 16:50.4 · C20-hinton-plumber 0:10.4 · C20-hinton-plumber-captioned 0:10.4 (the still twin: the F1-out transition frame + fallback) · C21 0:15.7 · C22 3:37.0 · C22-top 3:34.6 · C23 3:32.1 · C25 4:01.0 · C26 4:35.7 · C26-expert 4:44.8 · C26-top 4:33.7 · C28-cashiers 7:40.4 · C28-cashiers-outlook 7:42.9 · C28-electricians 9:03.0 · C28-electricians-outlook 9:05.4 · C29 7:52.1 · C30 8:39.8 · C32 10:51.2 · C33 10:41.1 · C33-top 10:39.0 · C34 1:24.5 · C34-top 1:23.2 · C35-techcrunch-scroll 1:19.8 · C36 8:02.1 · C37 14:02.9 · C38 14:27.6 · C39 15:51.0 · C40 13:22.5 · C41 15:27.7 · C42 11:57.1 · C42-top 11:53.6 · R1 2:35.7 · R10 9:44.5 · R11 10:04.7 · R12 15:16.2 · R14 0:13.8 · R16 16:24.9 · R16-top 16:20.2 · R17-huang-radiology-clip 10:09.0 · R18 10:18.0 · R19 1:46.5 · R2 4:22.3 · R22 14:59.5 · R24 16:44.9 · R3 4:51.0 · R5 8:13.4 · R6 8:28.5 · R7 8:49.9.
- **charts/ (31 Type 1 ANIMATED charts, every PNG state placed as the DESIGN SPEC the comp animates TO, comp-build §7: never hold a chart PNG; start = the card-in frame, payoff = the landing, the approved end look pixel for pixel):** C10R-start/-mid/-payoff 1:41.0 → 1:45.4 · C11-start/-mid/-payoff 1:28.0 → 1:32.2 · C13-start/-mid/-payoff 12:00.5 → 12:05.5 · C16-gates-start/-mid/-payoff 14:50.5 → 14:54.1 · C16-tao-start/-mid/-payoff 15:59.7 → 16:04.4 · C2-start/-mid/-payoff 3:18.8 → 3:26.2 · C2-surgeon-start/-mid/-payoff 11:23.0 → 11:25.7 · C4-carpenters-start/-mid/-payoff 8:45.5 → 8:49.5 · C4-cashiers-start/-mid/-payoff 7:34.4 → 7:37.2 · C4-csr-start/-mid/-payoff 8:05.8 → 8:09.0 · C4-electricians-start/-mid/-payoff 8:58.0 → 9:01.2 · C4-plumbers-start/-mid/-payoff 9:16.5 → 9:20.8 · C4-programmers-start/-mid/-payoff 9:40.8 → 9:43.6 · C4-radiologists-start/-mid/-payoff 9:56.8 → 10:01.9 · -yet (mid design state of the note cover) 10:28.2 → 10:29.0 · -note 10:28.2 → 10:32.1 · C4-roofers-start/-mid/-payoff 8:20.6 → 8:24.1 · C4-taxi-start/-mid/-payoff 7:44.3 → 7:47.6 · C4-truck-start/-mid/-payoff 8:32.0 → 8:35.2 · C4-warehouse-start/-mid/-payoff 7:58.8 → 8:01.6 · C5-climb-start/-mid/-payoff 9:37.4 → 9:39.0 · C5-tease-start/-mid/-payoff 0:51.0 → 0:53.0 · C5-top-start/-mid/-payoff 10:33.5 → 10:38.7 · C6-start/-mid/-payoff 6:34.8 → 6:45.5 · C7-start/-mid/-payoff 17:27.7 → 17:35.9 · C8-start/-mid/-payoff 10:46.5 → 10:49.4 · H0-start/-mid/-payoff 0:31.2 → 0:33.6 · consumption-67-start/-mid/-payoff 12:14.9 → 12:19.2 · early-x402-start/-mid/-payoff 15:33.8 → 15:37.8 · figure-bmw-scoreboard-start/-mid/-payoff 4:10.0 → 4:14.5 · home-invasions-1-20-start/-mid/-payoff 16:28.8 → 16:33.2 · horses-card-start/-mid/-payoff 2:46.2 → 2:51.5 · money-printer-card-start/-mid/-payoff 17:05.2 → 17:08.1.
- **diagrams/ (Type 2 SYSTEM-DESIGN stills, every state placed at its _state-cues word):** C1-download-s1 6:06.6 · C1-download-s2 6:08.7 · C1-download-s3 6:11.1 · C1-pre-s1 5:19.3 · C1-s1 5:25.3 · C1-s2 5:25.6 · C1-s3 5:26.4 · C1-s4 5:27.3 · C1-s5 5:28.4 · C1-s6 5:29.7 · C1-s7 5:31.0 · C14-allowance-s1 14:16.7 · C14-allowance-s2 14:17.5 · C14-allowance-s3 14:18.7 · C14-leverage-s1 13:55.9 · C14-leverage-s2 13:58.0 · C14-leverage-s3 14:00.1 · C14-s1 13:29.8 · C14-s2 13:34.3 · C14-s3 13:34.9 · C14-s4 13:35.8 · C14-s5 13:41.0 · C14-s6 13:41.3 · C17-s1 15:20.0 · C17-s2 15:21.6 · C17-s3 15:22.8 · C17-s4 15:23.8 · C17-s5 15:25.1 · C17-s6 15:26.4 · C3-forecast-s1 5:05.8 · C3-forecast-s2 5:07.6 · C3-s1 3:55.1 · C3-s2 3:57.6 · C3-s3 3:59.1 · C3-s4 4:00.7 · C9-s1 10:58.0 · C9-s2 11:02.4 · C9-s3 11:03.8 · new-jobs-chain-broken-s1 2:21.7 · new-jobs-chain-broken-s2 2:22.5 · new-jobs-chain-broken-s3 2:24.1 · new-jobs-chain-s1 2:09.9 · new-jobs-chain-s2 2:11.2 · new-jobs-chain-s3 2:12.6 · new-jobs-chain-s4 2:14.8 · new-jobs-chain-s5 2:16.9 · two-forces-s1 11:44.0 · two-forces-s2 11:46.1 · two-forces-s3 11:48.1 · upload-a-s1 5:39.1 · upload-a-s2 5:41.0 · upload-a-s3 5:42.9 · upload-b-s1 5:47.3 · upload-b-s2 5:49.5.
- **diagrams/ tier-badge overlays:** C3-badge-claimed (transparent overlay, 8 cover slots: 3:32.1 · 3:34.6 · 4:30.8 · 4:33.7 · 4:41.6 · 4:44.8 · 4:51.0 · 8:28.5) · C3-badge-deployed (transparent overlay, 6 cover slots: 4:01.0 · 4:22.3 · 7:52.1 · 8:02.1 · 8:39.8 · 8:49.9) · C3-badge-forecast (transparent overlay, 15 cover slots: 0:39.2 · 5:08.9 · 5:12.2 · 5:14.9 · 5:17.0 · 5:35.4 · 5:53.7 · 6:15.9 · 6:28.4 · 6:46.3 · 7:20.6 · 9:25.2 · 11:06.7 · 12:06.2 · 16:35.0). The C3-badge-forecast overlay also rides continuously over IMG-10, IMG-11, IMG-12 and BR-28 (5:08.9 → 5:19.3, the house argument).
- **card-slides/ (85/85 PLACED, every state on its word):** C15-extinct-a-s1 12:44.5 · C15-extinct-a-s2 12:49.5 · C15-extinct-b-s1 12:51.2 · C15-extinct-b-s2 12:52.5 · C15-extinct-b-s3 12:56.3 · C15-extinct-b-s4 12:56.7 · C15-jobs-fade-s1 13:08.6 · C15-jobs-fade-s2 13:09.1 · C15-jobs-fade-s3 13:11.6 · C15-survives-a-s1 12:33.0 · C15-survives-a-s2 12:34.8 · C15-survives-a-s3 12:35.4 · C15-survives-a-s4 12:36.5 · C15-survives-b-s1 12:38.9 · C15-survives-b-s2 12:39.4 · C15-survives-b-s3 12:40.0 · C15-survives-b-s4 12:41.3 · C4-template-s1 7:26.0 · C4-template-s2 7:29.2 · C4-template-s3 7:29.6 · C4-template-s4 7:31.4 · automation-before-now-s1 1:09.3 · automation-before-now-s2 1:11.3 · black-lead 0:00.0 · body-vs-worker 4:25.6 · catch-card 16:14.9 · checks-card 16:57.3 · combined-knowledge 6:01.2 · conviction-card-s1 17:09.4 · conviction-card-s2 17:14.0 · conviction-card-s3 17:16.2 · download-card 9:28.1 · dyor-card 17:22.1 · frozen-split-filled 15:43.5 · frozen-split-s1 14:35.2 · frozen-split-s2 14:39.1 · guard-then-deflation-s1 16:39.0 · guard-then-deflation-s2 16:41.2 · hinton-quote-full 0:20.4 · huang-real-line 10:20.2 · labor-substitution 1:14.4 · land-energy-compute-s1 13:14.5 · land-energy-compute-s2 13:15.1 · land-energy-compute-s3 13:16.2 · math-is-brutal 6:50.1 · never-card-s1 11:10.7 · never-card-s2 11:13.6 · never-card-s3 11:15.3 · new-jobs-cliche 1:59.2 · new-jobs-dissect 2:04.5 · nine-to-five 7:03.9 · optimists-card-s1 12:09.3 · optimists-card-s2 12:13.3 · own-scarce 14:47.0 · price-collapse 11:48.6 · protect-yourself-s1 14:39.6 · protect-yourself-s2 14:41.9 · recap-list-s1 17:45.3 · recap-list-s10 17:48.4 · recap-list-s11 17:48.6 · recap-list-s12 17:48.8 · recap-list-s13 17:49.0 · recap-list-s2 17:46.8 · recap-list-s3 17:47.0 · recap-list-s4 17:47.2 · recap-list-s5 17:47.4 · recap-list-s6 17:47.6 · recap-list-s7 17:47.8 · recap-list-s8 17:48.0 · recap-list-s9 17:48.2 · survivors-tiles-s1 13:01.9 · survivors-tiles-s2 13:02.2 · survivors-tiles-s3 13:03.1 · thesis-card-s1 16:05.7 · thesis-card-s2 16:11.0 · three-reasons-1-s1 15:08.9 · three-reasons-1-s2 15:11.2 · three-reasons-1-s3 15:13.3 · unemployment-4.2-forecast-s1 12:26.0 · unemployment-4.2-forecast-s2 12:29.0 · unemployment-4.2-forecast-s3 12:30.0 · us-law-july-2025 14:19.9 · where-safer-leads-s1 11:39.4 · where-safer-leads-s2 11:40.6 · where-safer-leads-s3 11:43.2.
- **title-slides/ (5/5 PLACED):** title-CH2 1:02.9 · title-CH3 3:52.7 · title-CH4 7:26.0 · title-CH5 11:44.0 · title-CH7 14:39.6.
- **slide-sources/:** containers.html + _shot.py (the card-slide build sources, not on screen). **transitions/:** empty until the TRANSITIONS.md picks (the card move, the face look, the AI-still family, the
  marquee looks and the 3-4 light-leak clips) are copied in (`lint_transition_assets.py` gates it at comp). **VISUAL-QA.json:** metadata.
- **face-swap/ (Mike's background swap of F1 to F10, comp-build §3b):** `F1-higgsfield-bg-swap.mp4` PLACED 0:00.2 → 0:10.4
  (APPROVED; window starts at clip 0.4 s per `F1-higgsfield-bg-swap.json`) · `F2-higgsfield-bg-swap.mp4` PLACED 0:28.3 →
  0:31.2 (`.json` + `.retime.json` sidecars; Mike's look check pending) · `F1a-` / `F1b-higgsfield-bg-swap.mp4` + their
  `.retime.json` = the two re-timed halves already joined into F1 at the join 3.9 (build intermediates, never on screen) ·
  `F1a`, `F1b`, `F2` to `F8-raw-for-higgsfield.mp4` + `.json` = model inputs, never on screen · `backdrop-reference-wall.png`
  (v1, drew a room corner, kept for the record) + `-v2.png` (the used reference), `look-reference-F1-approved.png`,
  `swap-prompt.txt`, `windows-F2-F10.json` = generation inputs, never on screen · the F3 to F10 swap clips are the build
  target of 2:18.3 · 3:26.7 · 5:03.5 · 5:21.9 · 7:32.2 · 9:10.8 · 9:34.0 · 9:52.0 (generating). `face-reframe.json`:
  metadata, the measured FACE_REFRAME the comp declares verbatim.

**BENCH (renderable, deliberately not placed):** `C10-facts` BENCH: Stanford's six-facts list previews 'about 19%' before he says it, and C10R restates the 15 → 19 read on the word itself · `C30-top` BENCH: the Aurora letter's cover; the C30 beat opens on '440,000' 0.4 s in, so there is no room for a cover stage · `R2-remote` BENCH: its line ('the company says that one is remote control') lands at 4:25.1, 0.6 s before body-vs-worker takes the beat and states 'remote-controlled' itself; a 0.5 s receipt stage is unreadable.

**REJECTED / never on disk:** the static card `C4-radiologists-note` (visual-qa round 2: a divergent duplicate of the animated chart's note state; parked under `_previews/qa-failed-20261007-r2/`, the 10:28.2 beat is the chart's second state) · BR-46 (never acquired, see vid/) · the COVER-PLAN benches not taken, none of them built: R13 (Obama Hour of Code, Mike: no receipt pops over the opening face), C27 Tesla Optimus flash, R15 Knightscope inset, C36's NYT 600,000 frame (guard 5), C31 Intuitive filing (C8 cites it), C44 price charts (never), C43 Shapiro credit card and C19 2023 scorecard (Mike's no-Shapiro ruling).

## SFX kit picks (re-measured 2026-10-07 by this pass: ffmpeg decode, 22.05 kHz mono, 10 ms RMS windows, tail = the last window within 40 dB of the peak)
| file (video-creation/assets/sfx/...) | peak in file | audible after peak | <200 Hz share | used at |
|---|---|---|---|---|
| Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 | 0.09 s | 1.07 s | 99.5% | the five cards 1:02.9 · 3:52.7 · 7:26.0 · 11:44.0 · 14:39.6 |
| risers/Tension_Rise_Logo_Reveal_3.wav | 3.82 s (trimmed ON it) | 0 (cut) | 59.1% | 0:24.5 → 0:28.3 hook riser |
| Impacts/card-impact-hit01-3-short.wav | 0.13 s | 2.11 s | 90.9% | 0:28.3 hook landing (Mike's own Impact_Hit_01-3 pick, trimmed) |
| Impacts/Kick_Impact_01-short.wav | 0.18 s | 0.36 s | 95.5% | 2:22.5 the chain snap |
| risers/Tension_Rise_Logo_Reveal_2.wav | 4.71 s (trimmed ON it) | 0 (cut) | 61.4% | 5:20.6 → 5:25.3 C1 riser |
| Impacts/Impact_3.wav | 0.73 s (pre-swell from 0.19 s) | 2.85 s | 93.6% | 5:25.3 the C1 reveal |
| risers/Edgy_Riser.wav | 5.15 s (trimmed ON it) | 0 (cut) | 28.2% | 10:33.5 → 10:38.7 C5-top riser |
| Impacts/Impact_Hit_01-1.wav | 0.19 s | 4.79 s | 97.2% | 10:38.7 the surgeon number |
| Impacts/Impact_Hit_01-2.wav | 0.13 s | 6.20 s | 90.3% | 17:49.4 THE vibe cut (F16) |
Ten hits + three risers on an 18:41 video: the five cards, the hook landing, the chain snap, the C1 reveal, the surgeon
number and the vibe cut. Nothing on face cuts, b-roll cuts, container swaps, the job-card stamps, the 24 punch-leak joins
or the community pitch; library transitions and leaks carry their own baked SFX (if any), ducked under the VO (comp-build
§6), and a marquee move on the C1 reveal (if TRANSITIONS.md takes one) is muted in favour of the riser + impact. Rejected
for this video by measured tail: Impact_1 / Impact_2 (3.1 / 2.8 s after a pre-swell), Kick_Impact_01 full (3.75 s),
Soundjay_Impact_Main_01 full (1.96 s), Boom - Big Reveal (4.0 s, 99.4% sub), Impact_Hit_01-3 full (5.34 s, its trimmed twin
is used), the Creepy Orchestral Rise (14.5 s to its peak) and DSGNRise (13.2 s, built-in hit) as too long for any beat here.
Spectral note: DSGNImpt is 99.5% below 200 Hz and a sub-only hit can vanish on small speakers: QA the cards on laptop
speakers; the fallback is Impacts/Impact_Hit_01-2-18.wav (peak 0.13 s, 1.64 s tail), which slightly overruns the 1.5 s pause.

## Open decisions that would move a cue
- BR-46 fold (8:49.9): Mike confirms R7 opening 3.7 s earlier in place of the missing 3D-printer clip; if he wants a clip,
  the dark resin-printer miniature the sourcer offered takes 8:49.9-8:53.6 and R7 moves to 8:53.6.
- The F2 look check and the F3 to F10 swap clips (generating): a clip that fails QA or Mike's look check airs as recorded,
  FACE_REFRAME on, and its punch on the join (F7 7:33.8 · F8 9:15.8 · F9 9:36.6 · F10 9:56.0) returns to the full ~15-20%.
  The F1 seam is settled: it sits ON the join 3.9, the second F1 punch point.
- Leaks on tight joins: a join less than ~1.05 s from a face edge (F7 0.60 s before its out, F11's first 0.60 s after its in,
  F8 0.70, F9 0.77, F10 0.80, F11's third 0.90, F12 1.00) needs the SHORT leak look (0.4 s) or a trimmed face glitch so the
  leak and the 0.96 s face-cut glitch never share a frame (overlays.md). F7 and F11's first are the tightest: if the short
  look still touches the glitch, TRANSITIONS.md trims the leak tail; the punch step stays on the join either way.
- The vibe-cut crash zoom ON the F16 cut (17:49.4): kept as the WHEN-TO-USE-IMPACTS device (impact + music drop + crash
  zoom), not a join punch, so its interior join 17:52.6 steps BACK to base with the leak. If Mike reads the 21:05 ruling as
  'no zoom anywhere but a join', the crash zoom drops and 17:52.6 steps IN instead.
- Card pause length: every timecode is pre-pause; the graph default 1.5 s x5 adds 7.5 s. A different pause moves only the
  final timeline (sh()), not this log, but Bed E's loop margin is 1.53 s: any tail after 'later' over 1.5 s flips its pass
  count (MUSIC-PLAN open question), so keep the end clamp at 18:41.0.
- TRANSITIONS.md picks (re-authored next): the card move, the face look, the AI-still family, the 3-4 leak ids, and which
  marquee candidates take MELT / SPIN (C1 5:25.3 and C2-surgeon 11:23.0 share a face-out cut; C1-download 6:06.6, C5-top
  10:33.5, C9 10:58.0, C14 13:29.8, C14-leverage 13:55.9, C17 15:20.0). A library move on the C1 reveal mutes its baked SFX
  (the riser + Impact_3 own it).
- The comment-prompt lower-third ('NAME ONE JOB A ROBOT CAN NEVER DO' + the BLS home-health-aides line) over F17 with no
  spoken ask: OPEN (AS-RECORDED Dropped 4); not placed. If Mike wants it, it rides F17 before the link lower-third (about
  18:05 → 18:30), clear of the punch-leak joins' flashes.
- Card impact audibility: DSGNImpt is sub-heavy; if the laptop-speaker check loses it, swap to Impact_Hit_01-2-18.wav on
  all five cards (same alignment, 1.64 s tail).
- Hard-hit SFX policy: 19 of the 27 MUSIC-PLAN hard hits are file-carried (no kit SFX) by design; Mike may want a kit hit on
  the CH4 'leads' stop (11:43.6) or the 'rent' slam (12:01.3).
- R2-remote, C30-top, C10-facts on the BENCH (reasons above): any of them back in costs a sub-1 s receipt stage.
- Still OPEN in AS-RECORDED, no cue moves either way: 'Never on a human' (C9-s2 carries it on screen), the 'he sells the
  product' disclosure (R12's on-screen note is required), the ad-libs listed as OPEN there.
