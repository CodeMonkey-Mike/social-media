# growth-vs-product - WATCH-ALONG CUE SHEET  (reconciled to the spine)
> Watch file: `spine/ALL.d.desilenced.mp4` (M:SS.s, 3:39.7, 30 fps). Timecodes from the spine word-transcript
> (`spine/ALL.d.desilenced.medium-words.json`) + blackdetect FACE/COVER spans (AS-RECORDED.md). Sibling of EDIT-PLAN.md
> (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md section 2.
> FACE/COVER edges EXACT (blackdetect); every other cue is a word onset (frame-locks at comp). FINAL-spine seconds,
> PRE-card-pause: the CH2 card pause (50.35) and the CH5 card pause (waived cut 173.085 / 173.10) shift the final timeline via
> `sh()` at comp. No clip insert (CLIP-1 OUT), no braam pause.
> Ids: C2-* / scoreboard-growth / ship-to-learn / become-compare = card slides · loop-* / aarrr-funnel / C1-* = diagrams ·
> split-test / pass-rate-meter = animated charts · C4a..C12 = receipts · BR-* b-roll · IMG-* AI stills.
> CH1 is first, nothing before it (no cold open: the signature open IS the hook).

## FACE spans (baked spine shows the face, face appears ONLY here)   7 spans
- 0:00.0 → 0:04.7   F1 CH1 hook, "So what are the differences between an AI growth engineer and an AI product engineer?" (opens ON face, signature open)
- 0:45.1 → 0:48.8   F2 CH1 thesis, "They're not the same job, same tools, different scoreboard."
- 1:22.6 → 1:27.0   F3 CH2 verdict, "One scoreboard counts what the business did ..." (side panels)
- 2:02.1 → 2:06.1   F4 CH3 verdict, "Rapid results on one side and compounding quality ..." (side panels)
- 2:48.6 → 2:53.1   F5 CH4 verdict, "one leans towards distribution ..." (side panels)
- 3:20.8 → 3:26.1   F6 CH5, "Either way you're an AI engineer ..."
- 3:31.7 → 3:39.7   F7 CH6 CTA hold to EOF, "And if that cleared it up, hit that like button and subscribe ..."

## TRANSITIONS (chapters + face + b-roll, MANDATORY; full per-cut list = TRANSITIONS.md, authored next)
Every row below is a placement; the PICK is the transition-strategist's in `TRANSITIONS.md` (the EDIT-PLAN.md placeholders,
fanned in by `reconcile_docs.py`; every [TRANSITION] row now carries its plan id).
CHAPTER cards (ONE card pick for both; ON only at a bed change):   2
- 0:50.4  CH2 'THE SCOREBOARD' (+ Bed A → B change + >= 1 s card pause)
- 2:53.1  CH5 'WHICH ONE?' (+ Bed B → C change + >= 1 s card pause at the waived cut 173.085)
FACE cuts (the video's one picked face transition, in AND out; MUSIC-PLAN reads a film burn at F2):   6 in · 6 out
- in: 0:45.1 · 1:22.6 · 2:02.1 · 2:48.6 · 3:20.8 · 3:31.7   (0:00.0 = opens ON face on the signature whip-in, not a cut)
- out: 0:04.7 (kt-whip-cut OUT, signature open, whoosh-4) · 0:48.8 · 1:27.0 (CH3 entry, house whip) · 2:06.1 (CH4 entry, house
  whip) · 2:53.1 (into the CH5 card) · 3:26.1
- signature open: 0:00.0 kt-whip-cut IN (0.73 s whip + 25 degree roll, swoosh-4) · 0:04.7 kt-whip-cut OUT (blur-in variant)
- in-take kt-whip-cut (bucket 3, same take, removes the right side panel):   3   1:25.3 · 2:04.5 · 2:50.6 (whoosh-4 each)
Intra-FACE punch-ins (ON a desilencer join only):   0
- none: `spine/jumpcuts-final.json` has 0 punch points (all 6 interior joins 48.733 / 86.867 / 125.9 / 172.767 / 205.733 /
  219.267 sit inside the 0.5 s edge margin). The F1 ~5 percent slow push is the signature open's own move, not a punch.
VIDEO b-roll transitions (Envato, fade / dissolve):   7
- 0:50.4 BR-1 · 1:10.0 BR-2 · 1:27.0 BR-3 · 1:45.3 BR-4 · 2:06.1 BR-5 · 2:53.1 BR-6 · 3:05.0 BR-7
AI still ingresses (image bucket):   5
- 0:58.0 IMG-1 · 1:43.2 IMG-2 · 2:09.6 IMG-3 · 2:19.5 IMG-4 · 3:16.9 IMG-5
RECEIPT hand-offs (cross-fade + scale-in; two-file receipts cross-fade inside the slot):   10
- 0:14.8 C12 (file 2 at 0:16.4) · 0:40.3 C4a · 0:42.7 C5a · 1:00.7 C5b · 1:04.8 C7a · 1:40.5 C10 · 2:37.3 C4c · 2:41.9 C5c ·
  2:55.2 C7b (file 2 at 2:57.0) · 3:00.8 C6
CONTAINER / CHART scene changes = cross-fade + 0.93→1 scale-in; state swaps inside a container are quiet 6 f cross-fades.
MARQUEE candidates (the strategist reserves MELT / SPIN for these; text containers stay quiet):
- 2:12.1  IMG-3 → C1-s1, THE two-stack diagram reveal (paired with the whoosh + impact)   ← the marquee
- 1:53.9  aarrr-funnel → loop-s2, the slow loop returns (a new facet of the same diagram)
- 1:12.0  BR-2 → split-test (the first animated chart)
- 3:07.8  BR-7 → become-compare (the declared A-vs-B card)

## CHAPTER cards begin  (ON only at a bed change)   2 ON · 4 OFF
- 0:00.0  CH1 'TWO TITLES, ONE WORD', NO card (first chapter) ; 0:50.4 CH2 'THE SCOREBOARD' (title-card-CH2) ;
  1:27.2 CH3 'THE CLOCK', NO card (Bed B continues, house whip) ; 2:06.3 CH4 'THE BIAS', NO card (Bed B continues, house
  whip) ; 2:53.1 CH5 'WHICH ONE?' (title-card-CH5, waived cut 173.085) ; 3:26.2 CH6 'THE CLOSE', NO card (Bed C continues)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   17 containers · 70 state rows
> SLIDE(card) = rounded card with the top accent line · SLIDE(title) = no box · DIAGRAM = Type 2 system-design still, comp-level
> movement only · CHART(anim) = Type 1, animated in code. State cues = `assets/slide-sources/states.json` + `_state-cues.md` +
> the chart specs.
- 0:04.7  SLIDE(card) C2-s1 role card, 'The two base roles': s1 base 0:04.7 · s2 GROWTH label 0:08.2 (cash-register) ·
  s3 base line A 0:13.3
- 0:18.9  SLIDE(card) C2-s1b: s1 PRODUCT label pops on entry 0:18.9 (wooden-rattle-whoosh) · s2 base line B 0:19.6
- 0:20.7  SLIDE(card) C2-s2 'Now put AI in front': s1 0:20.7 · s2 AI onto A 0:21.4 (cash-register) · s3 AI onto B 0:21.9
  (wooden-rattle-whoosh) · s4 AI line A 0:32.8 · s5 AI line B 0:39.6 · s6 RESUMES both lit 0:48.8 → 0:50.4
- 0:50.4  SLIDE(title) title-card-CH2 'The scoreboard'
- 0:52.7  SLIDE(card) scoreboard-growth 'A business number': s1 0:52.7 · SIGNUPS 0:55.6 · CONVERSION 0:56.0 · RETENTION 0:56.7 ·
  REVENUE 0:57.5
- 1:12.0  CHART(anim) split-test: start 1:12.0 · bars grow 1:14.3 · A stalls 1:15.1 · KILL IT OR SCALE IT 1:16.2 · winner
  1:17.0 (no figure printed)
- 1:17.5  CHART(anim) pass-rate-meter: start 1:17.5 · grounding fix card 1:19.5 · needle climbs 1:20.2 · TARGET 1:22.1 (needle only)
- 1:29.0  SLIDE(card) ship-to-learn: s1 1:29.0 · 'many cheap experiments' 1:30.2 · 'a failed one still counts' 1:32.0 ·
  'Ship to learn.' 1:34.7
- 1:35.2  DIAGRAM loop-s1: base 1:35.2 · TEST SET 1:37.5 · REGRESSION GATE 1:39.8
- 1:48.4  DIAGRAM aarrr-funnel: base 1:48.4 · WITHIN DAYS 1:51.2 · ACTIVATION 1:53.2 (no year)
- 1:53.9  DIAGRAM loop-s2: base 1:53.9 · eval pulse 1:56.4 · RETRIEVAL FIX 1:57.7 · 'day 3' 1:58.5 · MODEL UPGRADE + return 2:01.0
- 2:12.1  DIAGRAM C1-s1 GROWTH stack (marquee): base 2:12.1 · web 2:12.9 · analytics 2:14.1 · CRM / marketing automation 2:15.1 ·
  CDP 2:15.8 · experiment 2:16.5 · outbound 2:17.7 · agents 2:18.8
- 2:22.3  DIAGRAM C1-s2 PRODUCT stack: base 2:22.3 · prompting 2:23.9 · retrieval 2:24.3 · routing 2:24.8 · eval harness 2:25.3 ·
  latency + cost 2:26.2 · guardrails 2:26.5 · feature UI 2:28.7
- 2:31.2  DIAGRAM C1-s3 SHARED middle: base 2:31.2 · LLM APIs 2:32.8 · agents + orchestration 2:34.3 · evals 2:35.2 ·
  Python + TypeScript 2:35.9
- 2:53.1  SLIDE(title) title-card-CH5 'Which one?'
- 3:07.8  SLIDE(card) become-compare (declared COMPARISON_REFS): row l1 3:07.8 · row l2 3:09.1 · GROWTH label 3:12.9
  (cash-register) · row r1 3:13.6 · PRODUCT label 3:16.1 (wooden-rattle-whoosh)
- 3:26.1  SLIDE(card) C2-s4 recap: s1 labels pop 3:26.1 / 3:26.7 · THE SCOREBOARD 3:27.5 · THE CLOCK 3:28.4 · THE BIAS 3:29.2 ·
  'Same tools, different scoreboard.' 3:29.8

## RECEIPTS / inserts begin   10  (3 pan · 7 highlight · 0 push)
- 0:14.8  C12 R(article) Pragmatic Engineer 'What is Growth Engineering?' Mar 20, 2025, two files, treatment: highlight
  ('Product Engineers focus on creating a Product worth paying for' at 0:16.7)
- 0:40.3  C4a R(other) CrowdStrike 'Sr. AI Growth Engineer (Remote)' title block, treatment: pan, lib:motion-3d-pan-2-right
  `[VERIFY live; visual-qa note: no posting date visible]`
- 0:42.7  C5a R(other) Citian 'Senior AI Product Engineer' title block, treatment: pan, lib:motion-3d-orbit-1-t-left `[VERIFY]`
- 1:00.7  C5b R(other) Citian evaluations duty bullet, treatment: highlight ('evaluations' on 'evals' 1:02.7) `[VERIFY]`
- 1:04.8  C7a R(other) GovWell 'Our AI Stack', treatment: highlight ('tracked against explicit pass-rate targets' 1:05.6) `[VERIFY]`
- 1:40.5  C10 R(article) hamel.dev 'Your AI Product Needs Evals' March 29, 2024, silent flash, treatment: highlight (root-cause
  sentence on 'vibe' 1:42.7)
- 2:37.3  C4c R(other) CrowdStrike 'Translate marketing business problems ...' bullet, treatment: highlight (2:38.7) `[VERIFY]`
- 2:41.9  C5c R(other) Citian demo-vs-dependable + 'or no AI at all', treatment: highlight, two wipes 2:43.9 / 2:46.4 `[VERIFY]`
- 2:55.2  C7b R(other) GovWell title block, then the closing-gap bullet (2:57.0), treatment: highlight (2:58.0) `[VERIFY]`
- 3:00.8  C6 R(other) Fictiv / MISUMI 'Senior AI Growth Engineer' title block, treatment: pan, lib:motion-3d-pan-1-left `[VERIFY]`
- Clip inserts: none this video (CLIP-1 Hamel Husain 8.8 s HELD OUT per the approved screenplay; splice would be 64.84).

## VIDEO b-roll begins  (Envato)   7 of 11
- 0:50.4 BR-1 data dashboard · 1:10.0 BR-2 laptop browsing · 1:27.0 BR-3 stopwatch (dark re-source) · 1:45.3 BR-4 phone signup ·
  2:06.1 BR-5 reach for tool · 2:53.1 BR-6 interview handshake (dark re-source) · 3:05.0 BR-7 developer night desk

## IMAGE b-roll begins  (ChatGPT stills, comp-level slow move)   5 placed · 0 BENCH
- 0:58.0 IMG-1 feature module gauge · 1:43.2 IMG-2 calendar sheets + hourglass · 2:09.6 IMG-3 glass funnel ·
  2:19.5 IMG-4 neural core chip · 3:16.9 IMG-5 founder late-night desk (the both-labels pop rides over it 3:19.7 / 3:20.3)

## LIGHT LEAKS (library leak ON each FACE punch-in join; overlays.md section 1)   0
- none: no FACE window has an interior join outside the 0.5 s edge margin, so no punch-in and no leak (never a mid-hold pulse).

## KINETIC TEXT (2023 motion + sound pairs; overlays.md section 2)   3 panel pairs + 12 role-label pops
- signature open (kt-signature-open): 0:00.0 kt-whip-cut IN (swoosh-4, file 0.00) · 0:02.0 'AI GROWTH / ENGINEER' right third
  (cash-register, file 1.83) · 0:03.6 'AI PRODUCT / ENGINEER' stacked below (wooden-rattle-whoosh, file 3.47) · 0:04.7
  kt-whip-cut OUT (whoosh-4, file 4.39)
- side panels (kt-side-panel, RIGHT = growth verdict, kt-whip-cut on 'the other', LEFT = product verdict):
  - F3 1:22.7 RIGHT 'GROWTH ENGINEER / THE BUSINESS / NUMBER MOVED' (swoosh-1, 82.53) · 1:25.3 whip (whoosh-4, 84.98) · LEFT
    'PRODUCT ENGINEER / THE EVAL / SCORE MOVED' (swoosh-2, 85.25)
  - F4 2:02.3 RIGHT 'GROWTH ENGINEER / RAPID RESULTS / THIS WEEK' (swoosh-1, 122.15) · 2:04.5 whip (whoosh-4, 124.14) · LEFT
    'PRODUCT ENGINEER / COMPOUNDING QUALITY / THE EVAL SET / OUTLIVES THE MODEL' (swoosh-2, 124.41)
  - F5 2:48.7 RIGHT 'GROWTH ENGINEER / DISTRIBUTION / DATA / THE FUNNEL' (swoosh-1, 168.53) · 2:50.6 whip (whoosh-4, 170.28) ·
    LEFT 'PRODUCT ENGINEER / THE MODEL / AND THE USER' (swoosh-2, 170.55)
- role-label pops (the two role signatures return with their sounds; never inside a side panel): 0:08.2 GROWTH (cash-register
  8.07) · 0:18.9 PRODUCT (wooden-rattle-whoosh 18.75) · 0:21.4 AI onto A (cash-register 21.23) · 0:21.9 AI onto B
  (wooden-rattle-whoosh 21.77) · 3:12.9 GROWTH (cash-register 192.69) · 3:16.1 PRODUCT (wooden-rattle-whoosh 195.97) ·
  3:19.7 GROWTH lower right over IMG-5 (cash-register 199.51) · 3:20.3 PRODUCT (wooden-rattle-whoosh 200.09) · 3:26.1 GROWTH
  on C2-s4 (cash-register 205.93) · 3:26.7 PRODUCT (wooden-rattle-whoosh 206.53)   (+ the 2 signature-open labels = 12)

## IMPACTS + RISERS (audio, mixed on with ffmpeg, NOT in comp; picked by MEASURED -40 dB tail)
- 0:45.1  `Impact_Hit_01-2-18.wav` (epic; peak 0.13 s, 1.65 s tail) file start 45.00, the vibe-cut into the F2 thesis, with the
  -2 dB bed duck 45.0-45.9 (the ONE vibe cut)
- 0:50.4  `card-impact-layered.wav` (epic; peak 0.03 s, 0.78 s tail) file start 50.32, CH2 card
- 2:11.3 → 2:12.1  `Cinematic Whoosh 02.wav` (neutral; peak 0.87 s, 0.48 s tail) file start 131.27 → `DSGNImpt-single_impact_
  sound_-Elevenlabs.mp3` (neutral; peak 0.09 s, 0.85 s tail) file start 132.05, the C1 marquee reveal
- 2:53.1  `card-impact-layered.wav` file start 173.07, CH5 card
- Music-owned hits (no SFX layered): 0:00.0 Bed A cold open · 0:18.0 Bed A drop · 3:39.4 Bed C closing hit on 'channel.'
- Risers: none (no reveal follows a breath long enough to build into; the C1 build is the whoosh). Every SFX sits UNDER the VO.

## MUSIC beds (bed · chapters · level · fades; license codes → YT description ONLY)   3 beds
- 0:00.0 → 0:50.4   Bed A `proton-streams` (Empyreal Glow), CH1, COLD OPEN file 0.0, no fade-in, -17 under (gain -24.3 dB);
  -5 dB dip 1.55-4.40 under the label pops, -2 dB vibe-cut dip 45.0-45.9 · `B6VC93OXHYMOZO19`
- 0:50.4 → 2:53.1   Bed B `innovation` (JCar), CH2 + CH3 + CH4 one placement, -18 under (gain -27.3 dB), REMIX loop
  22.857-53.333 (seam at 1:43.3 on 'Give both of them three weeks'), tail trimmed before its 98-103 silence · `IWXI56FM4OBCTONF`
- 2:53.1 → 3:39.7   Bed C `up-in-the-atmos` (Bellodrone), CH5 + CH6, -18 under (gain -29.5 dB) stepping to -16 (gain -27.5 dB)
  at 3:26.2, END-PINNED (hold_until 228.168, trim true) so the closing hit lands on 'channel.' 3:39.4 · `0SBCHEOEACMB6K8R`
- Breaths on the two cards (0.4 s fade out, 0.6 s breath, 0.5 s fade in); none at CH3 / CH4 / CH6. Levels per MUSIC-PLAN
  (VO -19.4 LUFS); no bed move on the C1 reveal (the SFX owns it).

## CAPTIONS  (scope: ALL FACE windows + the Envato b-roll, PROJECT-LOG open flag 2026-10-22; never over receipts / containers / AI stills)
- FACE: the 7 spans above (F5 'lean' captioned 'leans').
- Envato: 0:50.4-0:52.7 BR-1 · 1:10.0-1:12.0 BR-2 ('AI-personalized') · 1:27.0-1:29.0 BR-3 · 1:45.3-1:48.4 BR-4 ·
  2:06.1-2:09.6 BR-5 · 2:53.1-2:55.2 BR-6 · 3:05.0-3:07.8 BR-7 ('engineer. Which one').
- The signature labels (right third) and the side panels sit outside the caption zone; captions stay ON under them.
  Reverse = `--caption-scope default --redo captions,comp_build`.

## Open decisions that move these cues
- CLIP-1 (Hamel Husain, 8.8 s) OUT by default: if Mike takes it, the spine pauses at 64.84 (trough 64.92-64.98) and every cue
  after 1:04.8 shifts +8.8 s via `sh()`; C7a starts after the clip; Bed B loop_out moves to 68.571.
- CH5 card at the waived cut 173.085: if Mike drops it, no pause there (everything after 2:53.1 moves 1 s earlier in final
  time) and Bed C crossfades in on the whip instead of a breath.
- IMG-3 (2:09.6): drop it and C1-s1 opens at 2:09.6 (9.8 s state 1); the whoosh + impact move with the reveal to 129.64.
- PRODUCT label sound moved from 15.0 (COVER-PLAN, under the C12 receipt) to the visible pop on the C2-s1b entry 18.92.
- IMG-5 both-labels pop holds are short (A 1.1 s, B 0.5 s before the F6 cut); alternative: carry both labels over the cut into
  F6 to ~3:21.9 (captions off for that hold).
- Bed C end-pin vs waveform build (MUSIC-PLAN q1) and the chord ring (q2): no picture cue moves; the closing hit position does.
- LABEL B AI line 'latency, cost' (unspoken, sourced) and the four folded motion-type cards: text only, no time change.
