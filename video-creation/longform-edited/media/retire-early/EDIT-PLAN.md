# retire-early - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED 2026-10-11 by the edit-plan author off the graph's seed (`_previews/EDIT-PLAN.seed.md`, from `gen_editplan.py`)
> + `spine/ALL.e.desilenced.medium-words.json` + AS-RECORDED.md + COVER-PLAN.json (with its GATE 3 `rulings`) + MUSIC-PLAN.json
> + PROJECT-LOG.md + `spine/jumpcuts-final.json` + the built assets' word-cued states (`assets/diagrams/_state-cues.md`,
> `assets/charts/*.spec.md`, the `assets/card-slides/<id>-sN.png` states from `assets/slide-sources/_shot.py`). Format:
> `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; per its §0 ORDER note the comp is built TO this event log.
> Watch file: `spine/ALL.e.desilenced.mp4` (648.31 s / 10:48.3, 30 fps CFR). Timecodes = FINAL-spine seconds, PRE-card-pause
> and PRE-insert. The four title-card pauses (1.5 s each, MUSIC-PLAN canvas: ARBITRUM 104.99 · KASPA 268.27 · TAO 371.80 ·
> TON 494.93) and the two clip-insert pauses (CLIP-2 12.25 s at 94.66 · CLIP-3 7.55 s at 184.12) shift the final timeline via
> `sh()` at comp: +25.80 s by the end, final runtime about 11:14.1. Never re-apply a chain shift: every value below is already
> an `e` coordinate.
> TRANSITIONS: ids marked `TRANSITIONS.md` resolve in that file (transition-strategist, next node; `reconcile_docs.py --apply`
> fans the picks back here). Ledger limits for it (usage_ledger report 2026-10-11, previous video every-job): card move NOT
> slide · MELT look NOT MELT/RGB · SPIN look NOT SPIN/3D Corner Ease · face_leak set NOT lightleaks-2 / -5 / -short-2 / -short-5.
> SFX (comp-build §9, an ffmpeg POST-mix, never in the comp). Mike's music rules for THIS video (PROJECT-LOG hard constraints):
> no risers, no big impacts, no epic hit, "a soft impact on a title card is the loudest sound design allowed". So the SFX layer
> is FOUR card impacts, one kit file picked by its MEASURED audible tail (ffmpeg decode, 48 kHz mono, 10 ms RMS windows, tail =
> the last window within 40 dB of the peak, measured 2026-10-11): `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3`, peak
> 0.09 s into the file, -40 dB at 1.17 s, so 1.08 s audible after the peak: it rings out INSIDE the 1.5 s pause. Every MUSIC-PLAN
> hard hit is an ARRANGEMENT move the bed file carries, and each such row says "SFX: none (file-carried)" on purpose. No vibe
> cut on this video (MUSIC-PLAN carries no vibe-cut duck, and its impact would be a big one). Library transitions and light
> leaks: their baked SFX MUTED (picture only).
> FACE: 11 windows (AS-RECORDED, blackdetect), every one AS RECORDED: no Higgsfield background swap on this video (no
> `assets/face-swap/`, no `assets/img-motion/`, PROJECT-LOG Open flags: none). The measured FACE_REFRAME (comp_build,
> `assets/face-reframe.json`) runs on F1 to F10 and on the face part of F11. F11's SCREEN SHARE (588.267-648.267) ships AS
> FILMED (Mike 2026-10-10): no reframe, no punch, no leak, no cover, no captions. Punch-in + LIBRARY light leak ONLY on the
> desilencer joins of `spine/jumpcuts-final.json` (overlays.md §1, Mike 2026-10-07): 22 punch points, alternating in / back;
> F3, F4 and F6 have no interior join (no punch, no leak); the 9 screen-share candidates are dropped by the as-filmed ruling.
> CAPTIONS ON over FACE windows ONLY (never over a cover), montserrat house style via captions-builder, the AS-RECORDED mishear
> list applied (77.02 reads "Unemployment", RULED); OFF over the screen share 588.267-648.267 (RULED at GATE 3).
> ZERO ORPHANS: every renderable file in assets/vid, img, receipts, clip-inserts, charts, diagrams, title-slides and card-slides
> (161 files) is PLACED below with a timecode or marked BENCH / REJECTED in the reconciliation at the end (159 placed, 2 BENCH).

## CH1 - WHY YOU NEED TO OWN ASSETS (0:00.0-1:45.0, Bed A `mission-accomplished`, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:35.1: the four locked opening lines held on the face (Mike's GATE 1 HOLD), AS RECORDED,
        FACE_REFRAME on; no cut-in (CH1 is first, nothing before it)
0:00.0  [CAPTION] ON → 0:35.1 (F1; montserrat house style, captions-builder)
0:00.0  [MUSIC] Bed A `mission-accomplished` (Moments, Mission Accomplished) from file 64.0, no fade-in, seat -22 dB under VO
        (remotion gain -31.3 dB) → 1:45.0, one pass, no loop (it also carries CLIP-2: 117.65 s really play)
0:00.0  [DUCK] Bed A LIFT +3 dB (relative, 0.5 s ramp) on the mid build (file 64-84, -14.9 LUFS) → 0:20.0: 24 under, so the
        hold opens on an audible, driving bed
0:00.0  SAY:  "I want to talk about some of the altcoins that you can hold and stack so you can potentially"
0:04.3  SAY:  "retire early."
0:05.1  [PUNCH-IN] F1 punch 1 of 6 ON the desilence-coarse join 5.100 s (frame 153, jumpcuts-final.json): step IN ~15-20%
        (hand:punch), holds to the next join
0:05.1  [LIGHTLEAK] F1 library light leak 1 of 22, its flash peaking ON the same join frame (screen blend, real footage, UNDER
        the captions, baked SFX muted) → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
0:05.3  SAY:  "If you watched my previous video then you'll know that there is an enormous amount of jobs"
0:09.6  SAY:  "that will very very soon become obsolete."
0:12.6  [PUNCH-IN] F1 punch 2 of 6 ON the desilence-coarse join 12.633 s (frame 379): step BACK to base
0:12.6  [LIGHTLEAK] F1 library light leak 2 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
0:12.7  SAY:  "It'll be very difficult for anyone to get a paycheck regardless of skill level."
0:16.0  [PUNCH-IN] F1 punch 3 of 6 ON the desilence-final join 15.967 s (frame 479): step IN (the 17.233 join is inside the
        1.5 s minimum gap, so it gets no punch)
0:16.0  [LIGHTLEAK] F1 library light leak 3 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
0:17.4  SAY:  "But with that said, I do believe that we are about to have an enormous economic explosion"
0:20.0  [MUSIC] HARD HIT 20.0: Bed A's full band (file 84, -9.9 LUFS) arrives 0.5 s before "enormous" (20.52-22.70), from the
        arrangement itself; the +3 dB lift releases on it. SFX: none (file-carried; Mike: no riser, no impact)
0:22.7  SAY:  "and likewise a crypto run up that we have never experienced throughout all of history."
0:27.4  [PUNCH-IN] F1 punch 4 of 6 ON the desilence-coarse join 27.433 s (frame 823): step BACK to base
0:27.4  [LIGHTLEAK] F1 library light leak 4 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
0:27.5  SAY:  "But you see where I'm going here."
0:29.0  [PUNCH-IN] F1 punch 5 of 6 ON the desilence-coarse join 28.967 s (frame 869): step IN
0:29.0  [LIGHTLEAK] F1 library light leak 5 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
0:29.0  SAY:  "This could be our last chance to make it rich because it could be very very difficult in"
0:31.8  [PUNCH-IN] F1 punch 6 of 6 ON the desilence-final join 31.767 s (frame 953): step BACK to base, holds to 0:35.1
0:31.8  [LIGHTLEAK] F1 library light leak 6 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
0:34.4  SAY:  "the coming years."
0:35.1  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s) (face pick)
0:35.1  [CONTAINER] H0-s1 IN → 0:41.3 (CARD SLIDE, gold #ffd700, motion type over its own code-rendered drifting-orb
        atmosphere, never a card over a stock clip): WAGES lit · quiet scale-in ingress
0:35.4  SAY:  "Wages are what the AI takeover takes away."
0:37.9  [CONTAINER] H0-s2: WAGES dims, OWNERSHIP lights on "Ownership" (37.94) and stays lit through "what to own"
0:37.9  SAY:  "Ownership is what's left standing."
0:39.7  SAY:  "So this video is about what to own."
0:41.3  [VIDEO] BR-1-box-carried-out (E1, office worker carrying a box of belongings out of the building) IN → 0:42.9 → hand:fade (broll-fade, 0.50s)
        (Envato, muted, fade; 1.6 s of the 3.6 s clip)
0:41.4  [DUCK] Bed A STEP -3 dB (1.5 s ramp) → 0:58.0 · HARD HIT 41.4: the receipts begin ("Companies blame AI", 41.56), the
        full band settles to 25 under for the numbers. SFX: none (file-carried)
0:41.6  SAY:  "Companies blame AI for 120,000 announced job cuts in the first 9 months of 2026, which"
0:42.9  [RECEIPT] C34-challenger-ai-cuts R(article) IN → 0:49.6: Challenger, Gray and Christmas September 2026 report, slow → hand:xfade-scale (container-xfade, 0.35s)
        push-in to the AI year-to-date line (120,136, "the leading reason year to date"); employer-cited cuts, never "AI
        killed" (flag 41.56) `[VERIFY monthly re-pull]`
0:47.9  SAY:  "was the number one stated reason."
0:49.6  [IMAGE] IMG-1-job-seekers-lobby (G1, photoreal cinematic, amber rim) IN → 0:52.3 · AI-still ingress (COVER-PLAN → lib:glitchoffset-2x (glitch-still, 0.48s)
        asked cross-warp)
0:49.7  SAY:  "For 22 to 25 year olds and the jobs most exposed to AI, employment is about 19% below where"
0:52.3  [RECEIPT] C36-stanford-19-percent R(article) IN → 0:56.9: Stanford Digital Economy Lab (2026-08-12), push to "about → hand:xfade-scale (container-xfade, 0.35s)
        19% below" (22 to 25 year olds, most AI-exposed occupations), the number on screen as he says it (55.50)
0:56.9  [IMAGE] IMG-2-glass-door-closing (G2, a graduate watching a glass office door swing shut) IN → 1:00.4 → lib:glitchoffset-1x (glitch-still, 0.40s)
0:57.0  SAY:  "it should be. The entry level door is closing first."  (restored words 57.02-57.78: the JSON word "The"
        swallows "it should be.")
0:58.0  [DUCK] Bed A LIFT +4 dB (0.5 s ramp) on the file's mid section (122-140, -17.5 LUFS) → 1:16.0: the labor-share and
        Amodei receipts on a 25.6-under bed instead of 29.6
1:00.4  [VIDEO] BR-2-factory-worker-walks (E2, workers walking out at shift change) IN → 1:03.6 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
1:00.5  SAY:  "And the share of what this economy produces that goes to workers as wages is 52.8%, the"
1:03.6  [RECEIPT] C35-bls-labor-share REAL CHART IN → 1:10.2: the BLS's own chart, labor share of output, nonfarm business, → hand:xfade-scale (container-xfade, 0.35s)
        1947 to Q2 2026, ending at the record low 52.8%, slow push toward the endpoint `[VERIFY quarterly re-pull]`
1:07.5  SAY:  "lowest ever recorded, going back to 1947."
1:10.2  [IMAGE] IMG-3-researchers-server-wall (G3, researchers silhouetted against a glowing wall of racks) IN → 1:12.4 → lib:glitchoffset-1x (glitch-still, 0.40s)
1:10.3  SAY:  "The people building the models put half of all entry level white collar jobs 1 to 5 years"
1:12.4  [RECEIPT] C37-amodei-entry-level R(article) IN → 1:16.8: Amodei's January 2026 essay, crop to "half of all → hand:xfade-scale (container-xfade, 0.35s)
        entry-level white collar jobs in the next 1 to 5 years" + the source line; never the 10 to 20 percent interview line
        (guard 2); ends exactly on F2
1:16.0  [DUCK] Bed A LIFT +7 dB on the file's own breakdown (140-154, -22.2 LUFS) → 1:30.0 · HARD HIT 76.0: the softest bed
        of CH1 under the window line (27.3 under, not a drop-out). SFX: none (file-carried)
1:16.6  SAY:  "out."
1:16.8  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick)
1:16.8  [FACE] F2 → 1:25.0, AS RECORDED, FACE_REFRAME on: the window line (CH1's second gear-3 line)
1:16.8  [CAPTION] ON → 1:25.0 (F2): the caption reads "Unemployment is / still 4.2% / so ..." (RULED at GATE 3: the VO says
        "Employment", the BLS figure is the unemployment rate; the AS-RECORDED grouping fix keeps 4.2% whole)
1:17.0  SAY:  "Employment is still 4.2% so paychecks still exist right now."
1:21.3  [PUNCH-IN] F2 punch 1 of 1 ON the desilence-coarse join 81.333 s (frame 2440): step IN just before "exactly the
        window" (82.02), holds to 1:25.0 (84.833 sits inside the edge margin)
1:21.3  [LIGHTLEAK] F2 library light leak 7 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
1:21.5  SAY:  "So that's exactly the window you need to turn a paycheck into ownership."
1:24.9  SAY:  "And it's not just a crypto guy saying this."
1:25.0  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s) (face pick)
1:25.0  [IMAGE] IMG-4-hoodie-monitors-dark-room (G4, the "crypto guy" from behind, blurred light, no readable charts) IN →
        1:27.5 (the F2 out move carries this ingress: one move on the cut)
1:27.5  [RECEIPT] CLIP-2-in LEAD-IN → 1:34.7: the clip's FIRST frame held as a still (Vlad Tenev on the CNBC set, eyes open, → hand:xfade-scale (container-xfade, 0.35s)
        CNBC's own lower-third intact, the burned caption band at the TOP 'Vlad Tenev, Robinhood CEO, CNBC, August 2026'),
        slow push under the whole set-up line; budget-exempt (clip-inserts.md, comp-build §3d)
1:27.5  SAY:  "Robinhood CEO Vlad Tenev said on CNBC in August when he was asked why regular people are shut"
1:30.0  [DUCK] Bed A LIFT +3 dB on the band's return (file 154, -14.8 LUFS) → 1:45.0: 23.9 under under the set-up, CLIP-2 and
        the handoff; the insert's own -14 dB duck multiplies on top inside the pause
1:33.5  SAY:  "out of the AI company."
1:34.7  [INSERT] CLIP-2 SPLICED CLIP, 12.25 s: the spine PAUSES at the trough after "company." (94.66; dry-run snap 94.675,
        trough 94.660-94.690, gate guard -49.5 dB; "That's" starts 94.70) and assets/clip-inserts/CLIP-2-tenev-ownership.mp4
        plays FULL-FRAME with Vlad Tenev's OWN voice: "And I think that's a big problem. I think that broad ownership,
        particularly of these innovative companies, is essential to maintaining a free, stable, and prosperous society."
        (window 6:34.3-6:46.55, trimmed to end on "society."; baked into the VO track by scripts/bake_clip_insert.py,
        spine/ALL.f.paused.json pauses[].clip); Bed A ducks -14 dB automatically (mix_music.py, bed-duck-expr.py; it rides
        file 158.66-170.91, the mid section); insert edges in and out → hand:fade (insert-in, 0.50s) (insert-in / insert-out)
1:34.7  [RECEIPT] CLIP-2-out LEAD-OUT → 1:37.7: the clip's LAST frame held as a still (eyes open, top caption band, CNBC
        lower-third intact) under the resume line, then N2 takes over
1:34.7  SAY:  "That's a brokerage CEO's opinion and it's mine too."
1:37.7  [CONTAINER] N2-s1 IN → 1:43.7 (CARD SLIDE, gold): eyebrow 'FOUR CRYPTOS / ONE QUESTION', headline 'Why does owning → hand:xfade-scale (container-xfade, 0.35s)
        this help when the jobs go away?', slot 01 Arbitrum mark landed (the real marks, Mike's order) · quiet scale-in ingress
1:37.8  SAY:  "So four cryptos and for each one the same question, why does owning this help you when the jobs"
1:38.7  [CONTAINER] N2-s2: slot 02 Kaspa lands on "and" (98.74)
1:39.4  [CONTAINER] N2-s3: slot 03 TAO lands on "each one" (99.40)
1:40.0  [CONTAINER] N2-s4: slot 04 TON lands on "question" (99.96); the list is whole under the headline question
        (100.58-103.34); no prices, no numbers
1:43.1  SAY:  "go away?"
1:43.7  [VIDEO] BR-3-dark-corridor-dolly (E3, LEADING motion toward light) IN → 1:45.0 (Envato, muted, fade): the handoff → hand:fade (broll-fade, 0.50s)
        into the first card
1:43.7  SAY:  "So let's get into all of this."
```

## CH2 - ARBITRUM (1:45.0-4:28.0, Bed B `mighty-hand`, card ON)
```
1:45.0  [CARD] CH2 title-CH2 "ARBITRUM" (TITLE SLIDE, Arbitrum sky blue #12aaff) · [IMPACT] Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 · [TRANSITION] card presentation → rmn:flip (card, 0.40s)
        The pause bakes in the trough before "Arbitrum" (104.99; trough 104.890-105.010, -84 dB): 1.5 s, zero spine time;
        readable = 1.5 - turn about 0.4 = 1.1 s (>= 1 s; BR-3's 1.35 s slot is too short to lead the card in further).
        SFX: the file starts 0.09 s BEFORE the card-landing frame so its peak lands ON it; 1.08 s audible after the peak,
        rings out inside the pause; mixed to sit 3 to 6 dB under the surrounding speech. HARD HIT 104.99 (MUSIC-PLAN): this
        soft card impact IS that hit, the loudest sound design in the video
1:45.0  [MUSIC] Bed A fades 0.4 s from the card start · 0.6 s breath · Bed B `mighty-hand` (Third Age, Mighty Hand)
        pre-rolls file 0.0-0.5 inside the pause (fade-in 0.5 s), full on "Arbitrum." (105.08), seat -23 dB under VO (gain
        -31.8 dB) → 4:28.0, one pass, no loop (it also carries CLIP-3)
1:45.0  [IMAGE] IMG-5-arbitrum-coin-hero (G5, the REAL Arbitrum mark from the reference, glass-and-chrome 3D) IN → 1:48.6:
        names the token on its first word, after the card pause
1:45.1  [DUCK] Bed B LIFT +6 dB (0.5 s ramp) on the soft opening (file 0.5-22, -19.9 LUFS) → 2:06.6: 25.9 under instead of
        31.9 under "start from zero" and the basics
1:45.1  SAY:  "Arbitrum. First on this channel, so let's start from"
1:48.0  SAY:  "zero."
1:48.6  [DIAGRAM] C1-s1-ethereum IN → 1:54.6 (Type 2 system-design still, the C1 Arbitrum model, accent #12aaff): Ethereum → hand:xfade-scale (container-xfade, 0.35s)
        lit (layer 1, settlement, "slow and expensive when busy"), the rest a ghosted map; lands on "Ethereum" (108.74);
        slow drift down toward the Ethereum band · quiet scale-in ingress
1:48.7  SAY:  "Ethereum is the big smart contract blockchain, slow and expensive when it's busy."
1:53.5  SAY:  "Arbitrum is the second layer on top of it and it runs the transactions on its own chain,"
1:54.6  [DIAGRAM] C1-s1-arbitrum-one: state swap (6 to 8 frames, same layout) on "second layer" (114.56): Arbitrum One lit +
        "posts compressed batches" into Ethereum → 1:58.9
1:58.9  [VIDEO] BR-4-box-wrapping-machine (E4, parcels bundled and shrink-wrapped on a fast belt) IN → 2:02.9 (Envato, muted, → hand:fade (broll-fade, 0.50s)
        fade): "bundles them", breaking the diagram hold
1:59.0  SAY:  "bundles them and posts a compressed result back to Ethereum which settles it."
2:02.9  [RECEIPT] R2-techcrunch-offchain R(article) stage 1 IN → 2:05.3: TechCrunch 2021-08-31, the headline 'Offchain Labs → hand:xfade-scale (container-xfade, 0.35s)
        raises 120 million to hide Ethereum's shortcomings with Arbitrum scaling product' + the Aug 31 2021 dateline, push-in
        on "Offchain Labs" `[VERIFY]`
2:03.5  SAY:  "Built by Offchain Labs, a team out of Princeton, live since August of 2021."
2:05.3  [RECEIPT] R2-princeton stage 2 → 2:09.1: the Princeton founders lines, on "a team out of Princeton" (125.28); the → hand:xfade-scale (container-xfade, 0.20s)
        August 2021 date was already in frame in stage 1
2:06.6  [DUCK] Bed B LIFT +4 dB (1.0 s ramp) on file 22-50 (-16.5 LUFS) → 2:34.6: 24.5 under through Offchain Labs, the vote,
        "Now why does this help" and the rails thread; from 2:34.6 the file's first lift (50-66) plays at its seat
2:09.1  [IMAGE] IMG-6-arbitrum-platform-chains (G6, one Arbitrum base platform with glass chains branching off, the real → lib:glitchoffset-1x (glitch-still, 0.40s)
        mark) IN → 2:12.6
2:09.1  SAY:  "Anybody can take Arbitrum's technology and launch their own chain with it."
2:12.6  [DIAGRAM] C1-s2-treasury IN → 2:16.1: the dedicated-chains group + the ArbitrumDAO treasury, "ARB = a vote", lit on → hand:xfade-scale (container-xfade, 0.35s)
        "the token ARB is a vote" (133.32); guard 4: a treasury the holders govern, nothing distributed · quiet scale-in
        ingress (same C1 model, a new id)
2:12.7  SAY:  "And the token ARB is a vote."
2:14.5  SAY:  "The holders govern a treasury that collects what the ecosystem earns."
2:16.1  [DIAGRAM] C1-s2-inflow: the inflow (Arbitrum One fees + the dedicated-chains feed merging into the treasury) on
        "collects what the ecosystem earns" (136.08) → 2:17.9
2:17.9  [IMAGE] IMG-7-empty-desk-lights-dim (G7, the job gone: an empty desk, chair pushed back) IN → 2:20.2 → lib:glitchoffset-2x (glitch-still, 0.48s)
2:18.0  SAY:  "Now why does this help when jobs go away?"  ("Now" restored 137.96-138.30: the JSON word "Why" swallows it)
2:20.2  [IMAGE] IMG-8-certificates-to-glass-tokens (G8, paper certificates dissolving into glass tokens on a chrome rail) → lib:glitchoffset-1x (glitch-still, 0.40s) · MOTION: plays assets/img-motion/IMG-8-certificates-to-glass-tokens-motion.mp4 from 0, cut at the slot end, no Ken Burns on top (Mike 2026-10-11, comp-build 3c)
        IN → 2:23.4
2:20.2  SAY:  "When stocks get tokenized, they have to trade and settle somewhere and whoever owns the"
2:23.4  [VIDEO] BR-5-rail-yard-aerial (E5, freight rail aerial) IN → 2:26.6 (Envato, muted, fade) · [LINE-CAPTION] 'WHOEVER → hand:fade (broll-fade, 0.50s)
        OWNS THE RAILS CHARGES RENT' burned on the clip (device 3, 1 of 3, kept by ruling)
2:25.4  SAY:  "rails charges rent."
2:26.6  [DIAGRAM] C1-s3-robinhood-chain IN → 2:31.1: the Robinhood Chain tile (a dedicated Arbitrum chain, ETH gas) + → hand:xfade-scale (container-xfade, 0.35s)
        "settles to Ethereum", on "Robinhood built its own blockchain" (146.80); guard 4: "on Arbitrum's technology", never
        "settles on Arbitrum" · quiet scale-in ingress
2:26.8  SAY:  "Robinhood built its own blockchain, Robinhood Chain on Arbitrum's technology."
2:31.1  [RECEIPT] C8a-dateline R(article) stage 1 IN → 2:33.5: Robinhood Newsroom, the 'Jul 1, 2026' dateline + the full → hand:xfade-scale (container-xfade, 0.35s)
        'Robinhood Chain Public Mainnet' headline, on "Live since July 1st, 2026"
2:31.1  SAY:  "Live since July 1st, 2026 with tokenized US stocks trading 24-7 in more than 120 countries."
2:33.5  [RECEIPT] C8a-robinhood-120-countries stage 2 → 2:40.2: the 'Stock Tokens ... in more than 120 countries ... 24/7 → hand:xfade-scale (container-xfade, 0.20s)
        trading' paragraph, on "with tokenized US stocks" (153.50); push to "although availability varies by jurisdiction"
        under "Not in the US yet" (158.66). The 'US and US persons' exclusion line is NOT in this crop (open decision)
2:38.7  SAY:  "Not in the US yet."
2:40.2  [RECEIPT] C9-arbitrum-factsheet R(other) IN → 2:43.9: the ArbitrumDAO factsheet (forum, 2026-07-06), the 10 / 8 / 2 → hand:xfade-scale (container-xfade, 0.35s)
        percent paragraph highlighted
2:40.2  SAY:  "That chain pays 10% of its net revenue to Arbitrum's ecosystem."
2:43.9  [DIAGRAM] C1-overview-8 IN → 2:47.1 (THE BALANCE overview: every node lit, shown ONCE): net revenue, "10% to the · [TRANSITION] → lib:melt-equidistant-1 (MELT-transform, 0.84s)
        Arbitrum ecosystem", the 8% into the treasury lit on "8 points" (164.38); centred push · MELT candidate (the
        factsheet's 10 / 8 / 2 reform into the split arrows)
2:44.4  SAY:  "8 points into the treasury ARB holders vote on."
2:47.1  [DIAGRAM] C1-overview-2: + the 2% into the Developer Guild on "2 to the Developer Guild" (167.12)
2:47.1  SAY:  "2 to the Developer Guild."
2:48.4  [DIAGRAM] C1-overview-90: + the 90% to Robinhood on "Robinhood keeps" (168.40), the split whole, holds 1.47 s to F3
2:48.4  SAY:  "Robinhood keeps the other 90."
2:49.9  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.76s) (face pick)
2:49.9  [FACE] F3 → 2:56.4, AS RECORDED, FACE_REFRAME on; its one join (176.133) sits inside the 0.5 s edge margin: no punch,
        no leak
2:49.9  [CAPTION] ON → 2:56.4 (F3)
2:49.9  SAY:  "So that's Arbitrum in one sentence."
2:50.6  [DUCK] Bed B LIFT +7 dB (0.5 s ramp) on the file's low stretch (66-90, -22.9 LUFS) → 3:05.2 · HARD HIT 170.58: B
        drops into its low stretch after the first lift under the revenue split; CLIP-3 rides it with the automatic -14 dB
        duck. SFX: none (file-carried)
2:52.3  SAY:  "Rails that other people build on and a treasury that collects rent from them."
2:56.4  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s) (face pick)
2:56.4  [RECEIPT] C6-sec-press-release R(article) IN → 3:01.4: SEC press release 2026-90, the header with the 2026-09-17 date
        and Atkins' first quote; guard 4: "opened a door", never "legalized"
2:56.5  SAY:  "Then on September 17th, 2026, the SEC opened a door in the US and the chairman Paul Atkins"
3:01.4  [RECEIPT] CLIP-3-in LEAD-IN → 3:04.1: the clip's FIRST frame held as a still (Paul Atkins on CNBC, eyes open, CNBC's → hand:xfade-scale (container-xfade, 0.35s)
        lower-third intact, the burned caption band at the TOP 'Paul Atkins, SEC Chairman, CNBC, September 2026'); the VO says
        "NBC", the caption stays CNBC (flag 183.70); budget-exempt
3:02.8  SAY:  "explained it on NBC."
3:04.1  [INSERT] CLIP-3 SPLICED CLIP, 7.55 s: the spine PAUSES at the trough after "NBC." (184.12; dry-run snap 184.13,
        trough 184.110-184.150, gate guard -49.7 dB) and assets/clip-inserts/CLIP-3-atkins-sandbox.mp4 plays FULL-FRAME
        with Paul Atkins' OWN voice: "we've come out with an innovation exemption, we're calling it. So think of a sandbox
        with a controlled type of environment" (window 6:12.4-6:19.95, trimmed so it ends on "environment."); baked into the
        VO track by scripts/bake_clip_insert.py; Bed B ducks -14 dB automatically (it rides the low stretch); insert edges in
        and out → hand:fade (insert-in, 0.50s) (insert-in / insert-out)
3:04.1  [RECEIPT] CLIP-3-out LEAD-OUT → 3:06.2: the clip's LAST frame held as a still (Atkins turned toward the host, eyes
        open, top caption band) under the start of the resume line, then C5 takes over
3:04.4  SAY:  "A sandbox for 5 years."
3:05.2  [MUSIC] HARD HIT 185.18 (MUSIC-PLAN): Bed B's full wall (file 90) returns and holds as the steady floor for the
        caveats, the one number and the verdict; the +7 dB low-stretch lift releases. SFX: none (file-carried). Planned against
        the 9.4 s CLIP-3: with the clip trimmed to 7.55 s the file reaches 90.0 at 3:07.0 instead (row below, open decision)
3:06.2  [CONTAINER] C5-s1 IN → 3:15.2 (CARD SLIDE, Arbitrum blue): eyebrow 'SEC / Innovation Exemption', headline 'A → hand:xfade-scale (container-xfade, 0.35s)
        five-year sandbox, with conditions', '2026-09-17 to 2031-09-17'; row 01 'Tokenized US stocks on a public,
        permissionless ledger' lit on "Tokenized" (186.32) · quiet scale-in ingress
3:06.3  SAY:  "Tokenized US stocks can trade on a public blockchain."
3:07.0  [MUSIC] AS TRIMMED: Bed B's file 90.0 (the full wall) lands here (187.03) under "can trade on a public blockchain",
        1.85 s later than planned; between 3:05.2 and 3:07.0 the low stretch plays unlifted (about 35 under). Fix in
        MUSIC-PLAN before the mix: end the +7 dB row at 187.03 (or source_in +1.85 s). SFX: none
3:09.3  [CONTAINER] C5-s2: row 02 'The token must carry the real share's dividend, voting and liquidation rights' on "If
        the token carries" (189.30)
3:09.3  SAY:  "If the token carries a real share's rights, participants are permissioned and the volume"
3:12.7  [CONTAINER] C5-s3: row 03 'Participants permissioned' on "participants" (192.68)
3:14.1  [CONTAINER] C5-s4: row 04 'Volume capped' + the Tier 1 / Tier 2 small print on "and the volume" (194.08); guard 4: a
        capped, permissioned sandbox
3:14.7  SAY:  "is capped."
3:15.2  [VIDEO] BR-6-neon-caution-sign (E6, a caution sign, the re-sourced darker clip) IN → 3:16.6 (Envato, muted, fade), → hand:fade (broll-fade, 0.50s)
        straight into F4
3:15.2  SAY:  "But a few caveats."
3:16.6  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.40s) (face pick)
3:16.6  [FACE] F4 → 3:18.3 (1.63 s), AS RECORDED, FACE_REFRAME on; its one join (198.0) sits inside the edge margin: no punch,
        no leak
3:16.6  [CAPTION] ON → 3:18.3 (F4)
3:16.6  [DUCK] Bed B DIP -3 dB (0.3 s ramp) → 3:18.3: the face punctuation reads clean on the full wall (26 under)
3:16.8  SAY:  "The exemption has paid nobody yet."
3:18.3  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.40s) (face pick)
3:18.3  [RECEIPT] C8b-robinhood-debt-securities R(article) IN → 3:23.8: Robinhood Newsroom, the Stock Tokens legal paragraph
        ('tokenized debt securities', 'no legal or beneficial rights in the underlying securities'); "their own wording" IS
        this paragraph; the VO says "debt security" (flag 200.38)
3:18.3  SAY:  "Robinhood's current stock tokens are debt security."
3:21.5  SAY:  "Their own wording."
3:22.9  SAY:  "Not a real share."
3:23.8  [RECEIPT] R3-coindesk-exclude R(article) IN → 3:27.0: CoinDesk 2026-09-17, crop to 'synthetic security tokens, such → hand:xfade-scale (container-xfade, 0.35s)
        as derivatives that don't confer ownership, are excluded' and 'may exclude ... such as from Robinhood' (the
        reporter's characterization, shown as such); "no US date" is an absence, carried by the VO `[VERIFY]`
3:23.9  SAY:  "So as they stand, they don't qualify."
3:25.8  SAY:  "And there's no US date."
3:27.0  [RECEIPT] C14-defillama-fees REAL CHART IN → 3:31.7: the real DefiLlama Robinhood Chain fees page, daily view, the → hand:xfade-scale (container-xfade, 0.35s)
        2026-09-04 peak (6.04M) visible, push toward the peak bar `[VERIFY at render, read date visible]`
3:27.0  SAY:  "Robinhood Chain's fees peaked September 4th at about 6 million dollars a day."
3:31.7  [CHART] C2 IN → 3:35.7 (Type 1 ANIMATED, built in code with useCurrentFrame off C2.html + C2-data.json, NEVER a held → hand:xfade-scale (container-xfade, 0.35s)
        PNG; design states C2-start / C2-mid / C2-payoff): C2-start, the line already drawn to the 2026-09-04 peak, readout
        block A · MELT candidate (C14's real page reforms into our own line)
3:31.8  SAY:  "And as I'm recording this, they're about 99% below that."
3:31.9  [CHART] C2: the fall draws from the peak toward 2026-09-29 on "And as I'm recording this," (211.90 to 212.67)
3:32.7  [CHART] C2-mid: the 'free gas ends 2026-09-29' marker grows (212.67), the line finishes to 2026-10-08, readout block
        B rises and the counter starts rolling
3:33.8  [CHART] C2-payoff: the counter LANDS on "about 99%" on "99" (213.80) with the read date (guard 3: never 97); hold +
        push 1.00 to 1.03 to 3:35.7 `[VERIFY: must still round to 99]`
3:35.7  [IMAGE] IMG-9-meme-coins-toppling (G9, generic silly animal faces, no real token mascots) IN → 3:37.4 → lib:glitchoffset-1x (glitch-still, 0.40s) · MOTION: plays assets/img-motion/IMG-9-meme-coins-toppling-motion.mp4 from 0, cut at the slot end, no Ken Burns on top (Mike 2026-10-11, comp-build 3c)
3:35.8  SAY:  "And the peak was mostly meme coins."
3:37.4  [RECEIPT] R4-cmc-token-unlocks-schedule REAL CHART stage 1 IN → 3:38.9: CoinMarketCap's ARB 'Unlock Schedule' chart → hand:xfade-scale (container-xfade, 0.35s)
        (the monthly team / investor steps running past the 'Today' marker into early 2027), chart only, no dollar figures,
        on "ARB is still unlocking" `[VERIFY]`
3:37.5  SAY:  "ARB is still unlocking."
3:38.6  SAY:  "About 92 million tokens a month into early 2027."
3:38.9  [RECEIPT] R4-tokenomist-next-unlock stage 2 → 3:42.0: Tokenomist's summary, push to 'The next scheduled cliff unlock → hand:xfade-scale (container-xfade, 0.20s)
        is 92.6M ARB ... October 16, 2026' + 'A 92.6M token cliff unlock occurred on September 16, 2026', on "92" (218.90);
        guard 3: "about 92 million a month into early 2027", no hard last date. Its bracketed dollar values are an open
        decision (no price on screen in this video) `[VERIFY]`
3:42.0  [RECEIPT] C11-arbitrum-foundation-funding R(other) IN → 3:44.6: 'Continued Funding for the Arbitrum Foundation' with → hand:xfade-scale (container-xfade, 0.35s)
        the on-chain tallies (206.4M For / 8.7M Against), executed June 2026; guard 3: never "asked for 230 million"
3:42.0  SAY:  "The foundation spends more than the DAO earned."
3:44.6  [VIDEO] BR-7-ballot-clear-box (E7, a ballot into a clear box, the re-sourced darker clip) IN → 3:47.4 (Envato, muted, → hand:fade (broll-fade, 0.50s)
        fade)
3:44.6  SAY:  "And ARB pays you nothing directly."
3:46.3  SAY:  "It's a vote on the treasury."
3:47.4  [RECEIPT] R5-coingecko-market-cap R(other) IN → 3:52.4: the real CoinGecko ARB Market Cap row + circulating supply, → hand:xfade-scale (container-xfade, 0.35s)
        the PRICE HEADER CROPPED OUT, re-captured natively at 16:9 and pinned to the 2026-10-09 22:00 UTC point (1.224B; the
        VO says "about 1.2 billion") `[VERIFY]`
3:47.4  SAY:  "So the one number."
3:49.0  SAY:  "Market cap."
3:49.9  SAY:  "As I'm recording this, about 1.2 billion dollars against the DAO's own income."
3:52.4  [RECEIPT] C10-theblock-dao-income R(article) IN → 3:55.2: The Block 2026-09-02, 'Arbitrum DAO reports 6.2 million → hand:xfade-scale (container-xfade, 0.35s)
        first-half income' (H1 6.19M, the denominator of the one number)
3:54.5  SAY:  "Annualized."
3:55.2  [CHART] C4 IN → 4:02.3 (Type 1 ANIMATED in code off C4.html; design states C4-start / C4-hero / C4-range; COMPUTED, · [TRANSITION] → lib:spin-corner-ease-lt (SPIN-newfacet, 0.76s)
        the card says so): C4-start, the fraction 1.225B over 12.38M, "=", the faint axis · SPIN candidate (the two inputs
        turn into the one number)
3:55.3  SAY:  "That's about 99 times."
3:55.7  [CHART] C4-hero: the hero counter LANDS on "99x" on "99" (235.70) with a 6-frame pop, the 99x pin drops, "computed
        from their own numbers" fades up; guard 3: never the reference's 100x
3:56.5  [CHART] C4: the axis brightens on "Counted otherwise" (236.54)
3:56.5  SAY:  "Counted otherwise, it's 65 to 150 times what the chain and its licenses earn a year."
3:58.0  [CHART] C4: the 65x pin + its definition on "65" (237.96)
3:58.8  [CHART] C4-range: the 150x pin on "150" (238.78), the 65-to-150 bracket draws, its label at f120; hold + push to
        4:02.3 `[VERIFY: recompute all three at render, each must round to the spoken figure]`
4:02.3  [VIDEO] BR-8-calculator-hands-dark (E8, hands on a calculator, the re-sourced clip with no legible statements) IN → → hand:fade (broll-fade, 0.50s)
        4:04.5 (Envato, muted, fade)
4:03.1  SAY:  "Computed from their own numbers."
4:04.5  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.76s) (face pick)
4:04.5  [FACE] F5 → 4:28.0, AS RECORDED, FACE_REFRAME on: the CH2 verdict + the ARB disclosure ad-lib (its picture restored
        at spine review), Mike's longest face hold
4:04.5  [CAPTION] ON → 4:28.0 (F5)
4:04.5  [DUCK] Bed B DIP -3 dB (0.5 s ramp) → 4:28.0: the verdict and the disclosure on the full wall, 26 under, to the
        KASPA card
4:04.7  SAY:  "My verdict."
4:05.7  SAY:  "My opinion."
4:06.8  SAY:  "If tokenized stocks actually get these rails in the next couple of years and the rent actually"
4:11.7  SAY:  "lands in the treasury, then these prices are going to look cheap in hindsight."
4:15.3  [PUNCH-IN] F5 punch 1 of 4 ON the desilence-coarse join 255.333 s (frame 7660): step IN
4:15.3  [LIGHTLEAK] F5 library light leak 8 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
4:15.7  SAY:  "And if they don't, then you're holding a vote and 92 million new unlocks per month."
4:20.1  [PUNCH-IN] F5 punch 2 of 4 ON the desilence-coarse join 260.100 s (frame 7803): step BACK to base as the disclosure
        starts ("But I can say" 260.80); the 260.233 join is inside the 1.5 s minimum gap
4:20.1  [LIGHTLEAK] F5 library light leak 9 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
4:20.8  SAY:  "But I can say that I just bought some ARB for the first time."
4:24.3  [PUNCH-IN] F5 punch 3 of 4 ON the desilence-final join 264.300 s (frame 7929): step IN
4:24.3  [LIGHTLEAK] F5 library light leak 10 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
4:24.4  SAY:  "So you know where I stand."
4:25.7  SAY:  "Never financial advice."
4:26.7  [PUNCH-IN] F5 punch 4 of 4 ON the desilence-coarse join 266.700 s (frame 8001): step BACK to base, 1.33 s before the
        F5 out (267.533 sits inside the edge margin)
4:26.7  [LIGHTLEAK] F5 library light leak 11 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
4:27.2  SAY:  "Do your own research."
```

## CH3 - KASPA (4:28.0-6:11.7, Bed C `lightheart`, card ON)
```
4:28.0  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.40s) (face pick, unless the card move owns this cut: TRANSITIONS.md decides)
4:28.0  [CARD] CH3 title-CH3 "KASPA" (TITLE SLIDE, Kaspa teal #49e0c8) · [IMPACT] Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 · [TRANSITION] card presentation → rmn:flip (card, 0.40s)
        The card scene starts ON the F5 out (268.033: the cover track starts on the black) and holds through the 1.5 s pause
        baked at the trough 268.27 (268.220-268.290); readable = 0.24 lead + 1.5 - turn 0.4 = 1.34 s. SFX alignment as CH2
        (peak 0.09 s into the file, ON the card-landing frame, 1.08 s tail inside the pause)
4:28.3  [MUSIC] Bed B fades 0.4 s from the card start · 0.6 s breath · Bed C `lightheart` (Cody Martin, Lightheart, the
        instrumental full cut) pre-rolls file 43.5-44.0 in the pause, full on "Kaspa." (268.26), seat -23 dB (gain -33.8 dB)
        → 6:12.1, one pass, no loop
4:28.3  [DUCK] Bed C LIFT +4 dB (0.5 s ramp) on the mid section (file 44-108, -13.7 LUFS) → 5:32.3: 23.8 under, level with
        the full section that follows (a steady chapter bed)
4:28.3  [IMAGE] IMG-10-kaspa-coin-hero (G10, the REAL backwards-K Kaspa mark from the reference, house Pixar 3D, teal rim)
        IN → 4:32.0, after the card pause
4:28.3  SAY:  "Kaspa."
4:28.8  SAY:  "My primary asset."
4:30.0  SAY:  "And you know that if you've been here for a while."
4:32.0  [CONTAINER] kas-question IN → 4:37.0 (CARD SLIDE, teal): eyebrow 'KASPA / ONE QUESTION', headline 'Why does it fit a → hand:xfade-scale (container-xfade, 0.35s)
        world where AI takes the jobs?' (teal on 'AI takes the jobs'); one point, 5.0 s · quiet scale-in ingress
4:32.4  SAY:  "So I'm only answering one question."
4:34.2  SAY:  "Why does it fit in the world where AI takes the job?"
4:37.0  [VIDEO] BR-9-asic-miner-rows (E9, rows of mining machines, slow pan) IN → 4:41.0 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
4:37.0  SAY:  "Kaspa is a proof of work money."
4:39.0  SAY:  "Like Bitcoin."
4:40.4  SAY:  "Mine into existence."  (as heard; probably "Mined")
4:41.0  [RECEIPT] C15-kaspa-lore-fair-launch R(other) IN → 4:44.6: kaspa.org/lore, 'No premine, insider allocation, or → hand:xfade-scale (container-xfade, 0.35s)
        pre-sales.', verbatim under the three "No" lines
4:41.8  SAY:  "No pre-mine."
4:42.5  SAY:  "No insider allocation."
4:43.8  SAY:  "No pre-sale."
4:44.6  [DIAGRAM] C16-s1-fair-launch IN → 4:49.4 (Type 2 ladder, teal): the bottom rung '2021-11 fair launch, no premine' + → hand:xfade-scale (container-xfade, 0.35s)
        'DAGLabs, the research company, dissolved around the launch'; later rungs ghosted; on "launched in November of 2021"
        (285.32); drift toward the lit rung · quiet scale-in ingress
4:44.6  SAY:  "It was launched in November of 2021 and the research company behind it dissolved around"
4:49.4  [IMAGE] IMG-11-empty-office-dissolving (G11, an empty research office drifting into teal particles) IN → 4:52.1 → lib:glitchoffset-1x (glitch-still, 0.40s) · MOTION: plays assets/img-motion/IMG-11-empty-office-dissolving-motion.mp4 from 0, cut at the slot end, no Ken Burns on top (Mike 2026-10-11, comp-build 3c)
4:49.7  SAY:  "the token launch."
4:50.4  SAY:  "There is no company behind this coin."
4:52.1  [DIAGRAM] gatekeepers-ai IN → 4:57.2 (Type 2, teal, the gates in the stylesheet's risk red, the hand fixed at QA; → hand:xfade-scale (container-xfade, 0.35s)
        headline 'Every one of them has a gatekeeper' on screen from the first frame): row 1 You -> 'The AI company, can be
        told what to do' -> AI models lit from the first frame (cue "the companies that run the models" 294.74) · quiet
        scale-in ingress
4:52.1  SAY:  "Here's why it matters now."
4:53.4  SAY:  "In an AI world, the companies that run the models can be told what to do."
4:57.2  [DIAGRAM] gatekeepers-bank: row 2 'The bank' -> your money on "So can the bank" (297.22)
4:57.2  SAY:  "So can the bank."
4:58.0  [DIAGRAM] gatekeepers-foundation: row 3 'The foundation' -> the coin on "So can any coin that a foundation controls"
        (298.04) → 5:00.3; architecture, never holder distribution (persona)
4:58.0  SAY:  "So can any coin that a foundation controls."
5:00.3  [VIDEO] BR-10-turnstile-denied (E10, a turnstile refusing entry, graded down at QA) IN → 5:02.6 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
5:00.7  SAY:  "Every one of them has a gatekeeper."
5:02.6  [DIAGRAM] N3-s1-supply IN → 5:07.8 (Type 2, teal, the A-vs-B answer to gatekeepers): miners -> blocks ("supply comes → hand:xfade-scale (container-xfade, 0.35s)
        only from mining") + the emission formula ("published since 2022"); full nodes ghosted; NO gatekeeper slot at all;
        on "Kaspa doesn't." (302.64) · quiet scale-in ingress
5:02.6  SAY:  "Kaspa doesn't."
5:03.3  SAY:  "The supply comes only from mining on a formula that's been published since 2022."
5:07.8  [RECEIPT] C20-umbrel-rusty-kaspad R(other) IN → 5:11.1: Umbrel app store 'Rusty Kaspad', 'A Rust implementation of a → hand:xfade-scale (container-xfade, 0.35s)
        Kaspa full node', version at capture; a SILENT receipt for "runs on a home server" (the Umbrel clause was not
        spoken); guard 5: no node spec on screen `[VERIFY version]`
5:07.9  SAY:  "The code is open and the full node runs on a home server."
5:11.1  [IMAGE] IMG-12-home-server-bookshelf (G12, a home server on a bookshelf, teal status light) IN → 5:15.0, ends exactly → lib:glitchoffset-1x (glitch-still, 0.40s)
        on F6
5:11.2  SAY:  "Anybody can run it."
5:12.6  SAY:  "Anybody can mine it."
5:13.5  SAY:  "And there's nobody to call."
5:15.0  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.76s) (face pick)
5:15.0  [FACE] F6 → 5:19.3 (4.27 s, the CH3 gear-3 landing line, the take kept it on the face), AS RECORDED, FACE_REFRAME on;
        its one join (318.8) sits inside the edge margin: no punch, no leak
5:15.0  [CAPTION] ON → 5:19.3 (F6)
5:15.3  [MUSIC] HARD HIT 315.3: NO move, the steady mid section under the landing line (screenplay CH3: no lift on it).
        SFX: none
5:15.3  SAY:  "Nobody can print it."
5:16.6  SAY:  "Nobody can freeze it."
5:17.9  SAY:  "And nobody can change the schedule."
5:19.3  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s) (face pick)
5:19.3  [DIAGRAM] N3-s2-whole IN → 5:21.2: the whole graph on, the empty dashed gatekeeper slot shown (its connector cut),
        headline 'Who can run it, who can't stop it'; on "That's the architecture argument" (319.32)
5:19.3  SAY:  "That's the architecture argument."
5:21.2  [DIAGRAM] N3-s2-run: full nodes on home servers ("open code, anyone can run it") on "Who can run it" (321.16)
5:21.2  SAY:  "Who can run it and who can't stop it."
5:22.0  [DIAGRAM] N3-s2-noone: the empty slot 'where a gatekeeper would be: no one to call' on "and who can't stop it"
        (322.04) → 5:25.8
5:22.9  SAY:  "And it's really the only decentralization argument I care about."
5:25.8  [VIDEO] BR-11-train-light-streak (E11, a fast train streaking past) IN → 5:27.9 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
5:25.8  SAY:  "Then the speed."
5:26.9  SAY:  "Since May 5th, 2025, Kaspa runs 10 blocks a second."
5:27.9  [RECEIPT] C18-kip-14-crescendo R(other) IN → 5:32.9: KIP-14 'The Crescendo Hardfork', status Active, 'Increasing BPS → hand:xfade-scale (container-xfade, 0.35s)
        from 1 to 10' (target_time_per_block 1000 ms to 100 ms); guard 5: the block rate only, no TPS
5:31.1  SAY:  "A block every 100 milliseconds."
5:32.3  [MUSIC] HARD HIT 332.26: Bed C's full section (file 108, env 8) arrives just before "That's settlement at machine
        speed" (333.00) and carries Toccata, vProgs and the verdict; the +4 dB mid lift releases on it. SFX: none
        (file-carried)
5:32.9  [IMAGE] IMG-13-robots-tossing-kaspa-coins (G13, two small robots tossing teal mirrored-K coins at blur speed) IN → → lib:glitchoffset-2x (glitch-still, 0.48s)
        5:36.9
5:33.0  SAY:  "That's settlement at machine speed, which is what you want when the things that start"
5:36.9  [VIDEO] BR-12-data-stream-teal (E12, data packets streaming as light trails) IN → 5:38.9 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
5:37.4  SAY:  "paying each other are software."
5:38.8  SAY:  "And since June 30th, 2026, the programmability layer,"
5:38.9  [RECEIPT] C19-kaspa-docs-toccata R(other) IN → 5:44.9: docs.kaspa.org/toccata, 'active on mainnet as of June 30, 2026' → hand:xfade-scale (container-xfade, 0.35s)
5:43.0  SAY:  "Toccata, is live on mainnet."
5:44.9  [CONTAINER] toccata-zk IN → 5:49.4 (CARD SLIDE, teal): eyebrow 'TOCCATA / LIVE ON MAINNET', headline 'The chain can → hand:xfade-scale (container-xfade, 0.35s)
        verify zero-knowledge proofs and carry application state', the gloss on the card, not in the VO · quiet scale-in
        ingress
5:45.1  SAY:  "So the chain can verify zero-knowledge proofs and carry application state."
5:49.4  [VIDEO] BR-13-cranes-at-night (E13, construction cranes at night) IN → 5:52.4 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
5:49.4  SAY:  "The app layer on top of it, vProgs, is under construction."
5:52.4  [DIAGRAM] C16-overview-full IN → 5:57.3 (THE BALANCE overview, the whole Kaspa ladder ONCE): four solid rungs · [TRANSITION] → lib:spin-corner-ease-lt (SPIN-newfacet, 0.76s)
        (2021-11 fair launch / 2022-05-07 emission formula / 2025-05-05 Crescendo, 10 blocks a second / 2026-06-30 Toccata
        live) + three dashed rungs, on "I've covered that in depth" (352.48); slow upward drift · SPIN candidate (the whole
        ladder, once)
5:52.5  SAY:  "I've covered that in depth already, so one sentence is all it gets here."
5:56.0  SAY:  "But here's the thing."
5:57.3  [DIAGRAM] C16-overview-apps: the two app rungs (based ZK apps next, full vProgs under construction) spotlit on "The
        apps aren't live yet." (357.28), held through "The tooling is early." (358.60); the ad-libbed caveats are carried
        factually by the dashed rungs, no caveat card (Mike ruled the caveats beat FUD)
5:57.3  SAY:  "The apps aren't live yet."
5:58.6  SAY:  "The tooling is early."
6:00.2  [DIAGRAM] C16-overview-dagknight: 'DAGKnight, KIP-2, proposed, no date set' on "DAGKnight" (360.20) → 6:01.7; guard 5
6:00.2  SAY:  "DAGKnight is still a proposed protocol."
6:01.7  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (face pick)
6:01.7  [FACE] F7 → 6:11.7, AS RECORDED, FACE_REFRAME on: the CH3 verdict
6:01.7  [CAPTION] ON → 6:11.7 (F7; "Kaspa's" corrected from Whisper's "Casper's")
6:01.7  [DUCK] Bed C DIP -3 dB (0.5 s ramp) → 6:12.1: the verdict on the full section, 26 under, to the TAO card
6:01.9  SAY:  "My verdict?"
6:02.7  [PUNCH-IN] F7 punch 1 of 4 ON the desilence-coarse join 362.733 s (frame 10882): step IN, 1.03 s after the F7 cut-in
6:02.7  [LIGHTLEAK] F7 library light leak 12 of 22 ON the same join frame, SHORT look (0.4 s) so the flash never shares a
        frame with the cut-in move → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
6:02.7  SAY:  "My opinion?"
6:03.4  SAY:  "If the world ends up needing more money that no company or no model can touch, Kaspa's"
6:06.5  [PUNCH-IN] F7 punch 2 of 4 ON the desilence-coarse join 366.467 s (frame 10994): step BACK to base
6:06.5  [LIGHTLEAK] F7 library light leak 13 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
6:07.7  SAY:  "the cleanest version of that I know of."
6:08.5  [PUNCH-IN] F7 punch 3 of 4 ON the desilence-coarse join 368.500 s (frame 11055): step IN
6:08.5  [LIGHTLEAK] F7 library light leak 14 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
6:09.4  SAY:  "And that is why it's my primary asset."
6:11.2  [PUNCH-IN] F7 punch 4 of 4 ON the desilence-coarse join 371.200 s (frame 11136): step BACK to base, 0.53 s before
        the F7 out
6:11.2  [LIGHTLEAK] F7 library light leak 15 of 22 ON the same join frame, SHORT look (0.4 s), clear of the card move
        → lib:lightleaks-short-3 (punch-leak, 0.40s) (punch-leak)
```

## CH4 - TAO (6:11.7-8:14.9, Bed D `tome-of-fate`, card ON)
```
6:11.7  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.40s) (face pick, unless the card move owns this cut: TRANSITIONS.md decides)
6:11.7  [CARD] CH4 title-CH4 "TAO" (TITLE SLIDE, purple #a855f7) · [IMPACT] Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 · [TRANSITION] card presentation → rmn:flip (card, 0.40s)
        The card scene starts ON the F7 out (371.733) and holds through the 1.5 s pause baked at 371.80, the one silent
        instant before the spoken "TAO" (RULED at GATE 3: the 50 ms breath 371.765-371.815 was silenced on the final spine,
        gate -73.3 dB, sidecar spine/ALL.e.desilenced.mp4.tao-card-gap.json; T onset 371.84); readable = 0.07 + 1.5 - 0.4 =
        1.17 s. SFX alignment as CH2
6:11.8  [IMAGE] IMG-14-tao-coin-neural-network (G14, the REAL Bittensor mark from the reference at the centre of a violet · MOTION: plays assets/img-motion/IMG-14-tao-coin-neural-network-motion.mp4 from 0, cut at the slot end, no Ken Burns on top (Mike 2026-10-11, comp-build 3c)
        neural net, neon neural style) IN → 6:15.8, after the card pause
6:12.1  [MUSIC] Bed C fades 0.4 s from the card start · 0.6 s breath · Bed D `tome-of-fate` (Cody Martin, Tome Of Fate, the
        instrumental full cut) pre-rolls file 43.5-44.0, file 44.0 at 372.06 (about 55% faded in on the spoken "TAO",
        fine), seat -23 dB (gain -34.5 dB) → 8:15.0, one pass, no loop
6:12.1  SAY:  "TAO on Bittensor."
6:13.4  SAY:  "The last one was money nobody controls."
6:15.8  [VIDEO] BR-14-robot-arms-assembly (E14, robotic arms on an automated line) IN → 6:19.8 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
6:15.8  SAY:  "This one is owning the piece of the AI production itself instead of being replaced by it."
6:19.8  [DIAGRAM] C21-s1-network IN → 6:23.7 (Type 2, the Bittensor model, purple): the subtensor chain (a block every 12 s, → hand:xfade-scale (container-xfade, 0.35s)
        pays in TAO) -> the 128 subnet slots ("each one a market"), on "an open network of markets" (380.60) and "subnets"
        (382.72) · quiet scale-in ingress
6:19.9  SAY:  "Bittensor is an open network of markets."
6:20.1  [DUCK] Bed D LIFT +5 dB (0.5 s ramp) on the mid section (file 52-94, -14.3 LUFS) → 7:02.1: 24.5 under through the
        subnet roles, Steeves, "the way I'd put it" and the F8 line
6:21.9  SAY:  "They call themselves subnets."
6:23.7  [DIAGRAM] C21-s1-compute: one slot opens into ONE SUBNET, commodity chip "compute", on "And each subnet produces one
        digital commodity" (383.70)
6:23.7  SAY:  "And each subnet produces one digital commodity."
6:24.4  [DIAGRAM] C21-s1-inference: chip "inference" (the label cycle runs BEFORE the spoken list, about 0.73 s a label)
6:25.2  [DIAGRAM] C21-s1-storage: chip "storage"
6:25.9  [DIAGRAM] C21-s1-prediction: chip "prediction" → 6:26.6
6:26.6  [IMAGE] IMG-15-night-market-four-stalls (G15, four glowing stalls: GPU, brain, drives, crystal ball) IN → 6:29.4, → lib:glitchoffset-1x (glitch-still, 0.40s)
        the four commodities in one picture under the spoken list (386.64-388.76)
6:26.6  SAY:  "Compute, inference, storage, prediction."
6:29.4  [DIAGRAM] C21-s2-miners IN → 6:30.7: inside one subnet, Miners lit on "Miners produce the thing" (389.44) · quiet → hand:xfade-scale (container-xfade, 0.35s)
        scale-in ingress (same C21 model, a new id)
6:29.4  SAY:  "Miners produce the thing, validators score the miners, stakers back the validators, and"
6:30.7  [DIAGRAM] C21-s2-validators: + the miners -> validators arrow on "validators score the miners" (390.68)
6:32.4  [DIAGRAM] C21-s2-stakers: Stakers + their arrow into the validators on "stakers back the validators" (392.42)
6:33.9  [DIAGRAM] C21-s2-owner: Subnet owner + "rules" on "the subnet owner designs the rules" (393.94)
6:33.9  SAY:  "the subnet owner designs the rules."
6:36.1  [DIAGRAM] C21-s2-paid: the TAO arrow into the subnet + the per-tempo split pills (41% miners · 41% validators and their
        stakers · 18% owner), hidden until "paid" (396.12) → 6:37.6
6:36.1  SAY:  "Everybody gets paid in TAO."
6:37.5  SAY:  "The founder, Jacob Steeves, calls the goal a market for intelligence."
6:37.6  [CONTAINER] steeves-quote IN → 6:41.4 (CARD SLIDE, purple): "Bittensor's ultimate goal is building the market for → hand:xfade-scale (container-xfade, 0.35s)
        intelligence." Jacob Steeves, Bittensor co-founder, VirtualBacon interview, 2026-03-26; carries his words while CLIP-5
        is HELD · quiet scale-in ingress `[VERIFY the words by ear: YouTube auto-captions]`
6:41.4  [IMAGE] IMG-16-mining-rig-to-neural-net (G16, a mining rig whose output streams bend into a violet neural net, no → lib:glitchoffset-2x (glitch-still, 0.48s)
        Bitcoin mark) IN → 6:45.4
6:41.5  SAY:  "The way I'd put it, Bitcoin's incentive model pointed at AI work instead of hashing."
6:45.4  [VIDEO] BR-15-pay-envelope (E15, a pay envelope handed over at a payroll window) IN → 6:49.4 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
6:46.0  SAY:  "So why did this help when jobs go away?"
6:48.0  SAY:  "The labor that AI replaces was paid in wages."
6:49.4  [DIAGRAM] ai-production-wages IN → 6:50.5 (Type 2, purple, deliberately NEUTRAL on ownership, RULED at GATE 3): Wages → hand:xfade-scale (container-xfade, 0.35s)
        lit, "the labor AI replaces was paid in wages", on "was paid in wages" (409.96) · quiet scale-in ingress
6:50.5  [DIAGRAM] ai-production-production: Wages dims, "replaced by" -> AI production lit on "The AI itself" (410.54)
6:50.5  SAY:  "The AI itself produced by compute, models, and data that nobody owns and gets paid for."  (as said; the script
        had "somebody owns"; the visual never echoes it, flag 410.54)
6:52.1  [DIAGRAM] ai-production-inputs: the three inputs compute / models / data, no ownership label on any, on "compute"
        (412.08)
6:54.4  [DIAGRAM] ai-production-paid: the output arrow -> "Gets paid for" on "and gets paid for" (414.42) → 6:55.4
6:55.4  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.76s) (face pick)
6:55.4  [FACE] F8 → 7:00.5, AS RECORDED, FACE_REFRAME on
6:55.4  [CAPTION] ON → 7:00.5 (F8; "TAO" corrected from Whisper's "Tau")
6:55.7  SAY:  "Owning TAO, or staking into a subnet, is a claim on that production, not a wage from"
6:59.9  [PUNCH-IN] F8 punch 1 of 1 ON the desilence-coarse join 419.900 s (frame 12597): step IN, 0.63 s before the F8 out
6:59.9  [LIGHTLEAK] F8 library light leak 16 of 22 ON the same join frame, SHORT look (0.4 s), clear of the out move
        → lib:lightleaks-short-8 (punch-leak, 0.40s) (punch-leak)
7:00.5  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.76s) (face pick)
7:00.5  [VIDEO] BR-16-hourglass-gold-sand (E16, an hourglass running out: a fixed, finite supply) IN → 7:04.3 (Envato, muted,
        fade)
7:00.6  SAY:  "it."
7:00.7  SAY:  "And the supply is Bitcoin's, a 21 million cap, mined from day one."
7:02.1  [MUSIC] HARD HIT 422.06: Bed D's second full section (file 94, -7.8 LUFS, the hottest region of the plan, hence the
        deepest seat gain) carries the supply, halving, 128-subnet and revenue numbers; the +5 dB mid lift releases on it.
        SFX: none (file-carried)
7:04.3  [RECEIPT] C25-opentensor-overview-fair-launch R(other) IN → 7:08.0: the Opentensor Foundation overview deck (Aug 2023), → hand:xfade-scale (container-xfade, 0.35s)
        'Fair Launch: January 2021 TAO fair launch'; guard 6: attributed to the foundation, its own document
7:05.3  SAY:  "The foundation calls it a fair launch and the first halving has already happened in"
7:08.0  [RECEIPT] C23-bittensor-emissions R(other) stage 1 IN → 7:11.2: Bittensor docs emissions page, push to 'The first → hand:xfade-scale (container-xfade, 0.35s)
        halving occurred in December 2025.' under "December of 2025"; guard 6: no day
7:09.7  SAY:  "December of 2025."
7:11.2  [RECEIPT] C23-bittensor-emissions stage 2 (the same capture, second push) → 7:13.4: 'current emission is 0.5 TAO per
        block, roughly 3,600 TAO per day' on "It's 0.5 TAO a block" (431.16)
7:11.2  SAY:  "It's 0.5 TAO a block now, about 3,600 a day, and about 54% of the cap is out."  (3,600 is TAO, never dollars,
        flag 433.76)
7:13.4  [CHART] C22 IN → 7:17.4 (Type 1 ANIMATED in code off C22.html; design states C22-start / C22-mid / C22-payoff; · [TRANSITION] → lib:melt-equidistant-2 (MELT-transform, 0.84s)
        labels in TAO, NEVER dollars): C22-start, the step line with the 3,600 segment lit, the empty supply tank · MELT
        candidate (the docs line reforms into the chart)
7:13.8  [CHART] C22: the 3,600 segment re-draws and its label "3,600 TAO a day" lands on "3,600" (433.76)
7:15.5  [CHART] C22-mid: the tank fill (rolling from 434.70) crosses the 10.5M 'first halving' tick, which flashes (about
        435.45)
7:15.7  [CHART] C22-payoff: the counter LANDS on "about 54%" on "54" (435.68), "of the 21M cap issued" + the read line; hold +
        push to 7:17.4 `[VERIFY: re-read circulating TAO, must still round to 54]`
7:17.4  [IMAGE] IMG-17-builders-subnet-towers (G17, tiny glowing builders assembling violet subnet towers) IN → 7:19.2 → lib:glitchoffset-1x (glitch-still, 0.40s)
7:17.4  SAY:  "Who's actually building there?"
7:18.8  SAY:  "There's a hard cap of 128 subnets."
7:19.2  [RECEIPT] C24-bittensor-subnet-limit R(other) IN → 7:24.6: Bittensor docs 'Running a subnet', crop to 'The subnet limit → hand:xfade-scale (container-xfade, 0.35s)
        is 128.' + the pruning sentence; guard 6: 128 is the cap, never the live count
7:21.4  SAY:  "And when it's full, a new one pushes out the weakest."
7:24.6  [VIDEO] BR-17-keynote-stage (E17, a keynote stage with audience silhouettes) IN → 7:27.5 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
7:24.7  SAY:  "As reported from Steeves' keynote at the end of September, about two dozen subnets are"
7:27.5  [RECEIPT] R6-cryptobriefing-24-subnets R(article) IN → 7:34.1: Crypto Briefing 2026-09-29 on the Exploit Summit → hand:xfade-scale (container-xfade, 0.35s)
        keynote, crop to '24 subnets are estimated to generate between 28 million and 35 million in annualized external
        revenue'; the screen keeps the source's true 28M to 35M while the VO says "20" (RULED, flag 451.62; never "20 to 35"
        on screen); guard 6: as reported `[VERIFY]`
7:29.1  SAY:  "pulling in real outside revenue, roughly 20 to 35 million dollars a year between them."
7:34.1  [VIDEO] BR-18-gpu-server-racks (E18, GPU server racks, close tracking) IN → 7:36.6 (Envato, muted, fade) → hand:fade (broll-fade, 0.50s)
7:34.1  SAY:  "GPU rental and inference at the top."
7:36.6  [CONTAINER] N4-s1 IN → 7:41.2 (CARD SLIDE, purple, eyebrow 'Bittensor / As reported', headline 'Customers and → hand:xfade-scale (container-xfade, 0.35s)
        control'): row 01 'A couple reportedly earn more from customers than from emissions' (Lium SN51, Chutes SN64) lit,
        'Customers' keyed, the attribution burned in ('As reported, Crypto Briefing on the Exploit Summit keynote,
        2026-09-29') · quiet scale-in ingress `[VERIFY]`
7:36.9  SAY:  "And a couple of them reportedly earn more from customers than they get in emissions."
7:41.2  [CHART] tao-rev-vs-emissions IN → 7:51.1 (Type 1 ANIMATED in code off tao-rev-vs-emissions.html; design states · [TRANSITION] → lib:spin-corner-ease-lt (SPIN-newfacet, 0.76s)
        tao-rev-vs-emissions-start / -mid / -payoff; our COMPUTED chart): the dollars-a-year axis, both empty tracks · SPIN
        candidate (a new axis: customer money against new coins)
7:41.3  [CHART] tao-rev-vs-emissions: row 1 bar grows 0 to 28M on "28" (461.28)
7:41.3  SAY:  "28 to 35 million of customer money against about 1.3 million new TAO a year, which is"
7:42.5  [CHART] tao-rev-vs-emissions-start: the hatched 28M to 35M extension + "28M to 35M" on "35 million" (462.46)
7:44.8  [CHART] tao-rev-vs-emissions: row 2 label 'about 1.3M TAO a year, 3,600 a day x 365' on "about 1.3 million new TAO"
        (464.82); row 1 settles
7:45.2  [CHART] tao-rev-vs-emissions-mid: the new-TAO bar grows far past the customer bar (465.15 to 468.28)
7:47.7  SAY:  "about 360 million dollars at the price that I'm recording this."
7:48.3  [CHART] tao-rev-vs-emissions: "about 360M" lands inside the bar end on "360" (468.28) + the read-date line (the TAO
        price itself is never on screen)
7:48.9  [CHART] tao-rev-vs-emissions-payoff: the COMPUTED footnote (468.92); hold + push to 7:51.1 `[VERIFY: recompute the
        360M from the live TAO price, must still round to 360]`
7:51.1  [VIDEO] BR-19-new-coins-pile (E19 fallback: no clean minting-press clip on Envato; CG blank gold coins tumbling onto a → hand:fade (broll-fade, 0.50s)
        pile, the top 55% black for the caption) IN → 7:53.4 (Envato, muted, fade) · [LINE-CAPTION] 'THE NETWORK STILL
        PAYS OUT MOSTLY NEW COINS' (device 3, 2 of 3)
7:51.1  SAY:  "So the network still pays out mostly new coins."
7:52.1  [DUCK] Bed D LIFT +4 dB (0.5 s ramp) on the closing mid section (file 144-167, -14.3 LUFS) → 8:15.0: 25.5 under for
        subnet quality, the control line, "room to grow" and the F9 verdict
7:53.4  [IMAGE] IMG-18-uneven-towers-wired (G18, towers of uneven height and brightness, wired together) IN → 7:55.9 → lib:glitchoffset-1x (glitch-still, 0.40s)
7:53.7  SAY:  "Subnet quality is uneven by design."
7:55.9  [CONTAINER] N4-s2 IN → 8:02.2 (the N4 card returns, its second and last spot): row 02 'Control: still with a few → hand:xfade-scale (container-xfade, 0.35s)
        people, the founder included' lit, 'control' keyed, on "Control" (475.88) · quiet scale-in ingress
7:55.9  SAY:  "Control still sits with a few people, the founder included."
7:59.1  SAY:  "But his handover is targeted at December of 2027."
7:59.6  [CONTAINER] N4-s2-handover: + row 03 'Decentralization handover target: December 2027 (Steeves, as reported)' on
        "handover" (479.58) `[VERIFY]`
8:02.2  [VIDEO] BR-20-seedlings-timelapse (E20, young sapling timelapse: room to grow) IN → 8:05.4 (Envato, muted, fade), → hand:fade (broll-fade, 0.50s)
        ends exactly on F9
8:02.3  SAY:  "So there is still some room to grow."
8:04.0  SAY:  "And some things to mature."
8:05.4  [TRANSITION] cover→face cut-in F9 → hand:film-burn (face-cut, 0.76s) (face pick)
8:05.4  [FACE] F9 → 8:14.9, AS RECORDED, FACE_REFRAME on: the CH4 verdict
8:05.4  [CAPTION] ON → 8:14.9 (F9; "TAO" corrected)
8:05.9  SAY:  "But my verdict, my opinion?"
8:06.6  [PUNCH-IN] F9 punch 1 of 3 ON the desilence-coarse join 486.633 s (frame 14599): step IN
8:06.6  [LIGHTLEAK] F9 library light leak 17 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
8:07.7  SAY:  "If open networks end up producing a share of the world's AI, then TAO is the most direct"
8:10.2  [PUNCH-IN] F9 punch 2 of 3 ON the desilence-coarse join 490.167 s (frame 14705): step BACK to base
8:10.2  [LIGHTLEAK] F9 library light leak 18 of 22 ON the same join frame → lib:lightleaks-3 (punch-leak, 1.12s) (punch-leak)
8:12.7  SAY:  "way I know to own a share of that production."
8:14.2  [PUNCH-IN] F9 punch 3 of 3 ON the desilence-coarse join 494.233 s (frame 14827): step IN, 0.67 s before the F9 out
8:14.2  [LIGHTLEAK] F9 library light leak 19 of 22 ON the same join frame, SHORT look (0.4 s), clear of the card move
        → lib:lightleaks-short-8 (punch-leak, 0.40s) (punch-leak)
```

## CH5 - TON (8:14.9-9:31.8, Bed E `a-pirates-life`, card ON)
```
8:14.9  [TRANSITION] face→cover F9 out → hand:film-burn (face-cut, 0.40s) (face pick, unless the card move owns this cut: TRANSITIONS.md decides)
8:14.9  [CARD] CH5 title-CH5 "TON" (TITLE SLIDE, TON azure #0098ea; RULED: TON, never 'TON (GRAM)') · [IMPACT] Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 · [TRANSITION] card presentation → rmn:flip (card, 0.40s)
        The card scene starts ON the F9 out (494.900) and holds through the 1.5 s pause baked at 494.93 (trough
        494.900-494.980); readable about 1.13 s. SFX alignment as CH2
8:14.9  [RECEIPT] C31-durov-gram-521 R(other) IN → 8:19.6: t.me/durov/521 (2026-06-01), 'TON's native currency is becoming
        Gram.' highlighted, opens CH5 after the card pause; guard 7 (the Gram correction in the same breath)
8:15.2  [MUSIC] Bed D fades 0.4 s from the card start · 0.6 s breath · Bed E `a-pirates-life` (Wicked Cinema, A Pirate's
        Life) pre-rolls file 0.0-0.5, full on "Toncoin," (495.18), seat -22 dB (Mike's energetic seat, gain -27.2 dB), ONE
        pass across CH5 + CH6 (the CH6 row merges, sample-continuous) → 10:48.3; the epic hit is never reached
8:15.2  [DUCK] Bed E LIFT +3 dB (0.5 s ramp) on the opening build (file 6-36, -19.1 LUFS) → 8:50.7: 24.1 under through the TON
        history and "Distribution."; the first 5.5 s are the file's own near-silent intro (the card impact is the loudest
        sound there)
8:15.2  SAY:  "Toncoin, which in June of 2026 is officially called Gram."
8:19.6  [IMAGE] IMG-19-ton-coin-paper-clouds (G19, the REAL TON diamond mark from the reference, flat vector paper-cut) IN → → lib:glitchoffset-1x (glitch-still, 0.40s)
        8:22.5
8:19.6  SAY:  "The chain is still The Open Network, T-O-N, TON, and it's the blockchain that Telegram's"
8:22.5  [VIDEO] BR-21-phone-messaging-dark (E21, a generic messaging app, chat bubbles popping in, no brand) IN → 8:25.6 → hand:fade (broll-fade, 0.50s)
        (Envato, muted, fade)
8:24.8  SAY:  "crypto runs on."
8:25.6  [DIAGRAM] ton-history-2018 IN → 8:28.7 (Type 2 timeline, azure): '2018: Telegram designs TON' (a whitepaper and a → hand:xfade-scale (container-xfade, 0.35s)
        1.7B private sale of Gram) lit on "Telegram designed it in 2018" (506.56 to 507.86) · quiet scale-in ingress
8:25.7  SAY:  "Quick history."
8:26.6  SAY:  "Telegram designed it in 2018."
8:28.7  [DIAGRAM] ton-history-2020: '2020: the SEC shuts the sale down' (Telegram returns 1.2B, an 18.5M penalty) on "The SEC
        shut down the sale in 2020" (508.72)
8:28.7  SAY:  "The SEC shut down the sale in 2020."
8:31.0  [DIAGRAM] ton-history-2021: '2021: the community relaunches it' (The Open Network, the coin renamed Toncoin) on "The
        community rebuilt it" (510.98) → 8:33.5
8:31.0  SAY:  "The community rebuilt it as Toncoin."
8:33.5  [RECEIPT] C30-durov-telegram-driver-501 R(other) IN → 8:37.5: t.me/durov/501 (2026-05-04), 'Telegram replaces the TON → hand:xfade-scale (container-xfade, 0.35s)
        Foundation as the driving force behind TON' + 'becomes its largest validator'
8:33.5  SAY:  "And since May of 2026, Telegram itself is back as a driving force and the biggest validator"
8:37.5  [IMAGE] IMG-20-validator-tower-globe (G20, one large blue validator tower among many smaller ones on a paper-cut → lib:glitchoffset-1x (glitch-still, 0.40s)
        globe, no Telegram mark) IN → 8:41.0
8:40.4  SAY:  "on the network."
8:41.0  [VIDEO] BR-22-crowd-crossing-aerial (E22, an aerial timelapse of a huge crowd crossing) IN → 8:43.5 (Envato, muted, → hand:fade (broll-fade, 0.50s)
        fade) · [LINE-CAPTION] 'WHY DOES IT HELP? DISTRIBUTION.' (device 3, 3 of 3)
8:41.0  SAY:  "Why does it help jobs go away?"
8:42.9  SAY:  "Distribution."
8:43.5  [RECEIPT] C28-durov-billion-users-404 R(other) IN → 8:49.5: t.me/durov/404 (2025-03-19), 'Telegram now has → hand:xfade-scale (container-xfade, 0.35s)
        significantly over 1 billion monthly active users' highlighted; guard 7 (the dated count)
8:43.5  SAY:  "Telegram has, by Durov's count in March of 2025, significantly over a billion monthly"
8:48.9  SAY:  "users."
8:49.5  [DIAGRAM] C26-s1-miniapps IN → 8:54.6 (Type 2, the TON model, azure): Telegram on (over 1B monthly users, Durov's → hand:xfade-scale (container-xfade, 0.35s)
        count, March 2025), Mini Apps lit 'must run on TON since January 2025', wired into the ghosted chain, on "Every crypto
        mini app inside Telegram" (530.00); guard 7: January 2025, never September 2024 · quiet scale-in ingress
8:50.0  SAY:  "Every crypto mini app inside Telegram has to run on TON since January of 2025."
8:54.6  [DIAGRAM] C26-s1-wallet: Gram Wallet 'rolling out since 2026-08-31', 'holds Gram on TON', on "A built-in Gram
        wallet" (534.64) → 8:58.8
8:54.6  SAY:  "A built-in Gram wallet has been rolling out to the user base since the end of August."
8:58.8  [RECEIPT] R7-defillama-ton-stablecoins REAL CHART IN → 9:02.8: DefiLlama, the TOTAL stablecoin float on TON (about → hand:xfade-scale (container-xfade, 0.35s)
        720M; 718.93M read 2026-10-10, timestamp in the house-type provenance band), the per-coin rows out of frame. DEFAULT
        ruling (Mike can overrule at GATE 4): the VO's "USDT ... about 750 million" matches the total float, not USDT
        alone (550M) `[VERIFY]`
8:58.8  SAY:  "And USDT settles on it, about 750 million dollars of it."
9:02.8  [RECEIPT] C29-durov-cocoon-462 R(other) IN → 9:08.4: t.me/durov/462 (2025-11-30), 'Our decentralized confidential → hand:xfade-scale (container-xfade, 0.35s)
        compute network, Cocoon, is live.' + 'GPU owners are already earning TON.'
9:02.8  SAY:  "Then Telegram's own AI compute network, Cocoon, live since November of 2025, pays GPU owners"
9:08.4  [RECEIPT] C32-cocoon-org R(other) IN → 9:12.6: cocoon.org, 'mine TON by powering the network' / 'Powered by TON'; guard → hand:xfade-scale (container-xfade, 0.35s)
        7: no scale figure anywhere on screen (CLIP-4 HELD: if added it splices at 551.36 and this becomes its lead-in)
9:09.5  SAY:  "in TON for running AI requests."
9:11.6  SAY:  "Scale not disclosed."
9:12.6  [IMAGE] IMG-21-chatbots-handing-coins (G21, chat bots in bubbles handing small blue coins to people) IN → 9:15.6 → lib:glitchoffset-2x (glitch-still, 0.48s)
9:12.6  SAY:  "If AI agents and bots become the way people transact, the chain wired into a platform"
9:15.6  [DIAGRAM] C26-overview-full IN → 9:17.6 (THE BALANCE overview, the whole TON graph ONCE): + The Open Network (coin · [TRANSITION] → lib:spin-corner-ease-lt (SPIN-newfacet, 0.76s)
        Gram, about 400 validators, Telegram the largest), 'Stablecoins on TON / about 720M, mostly USDT', Cocoon (GPU owners
        paid in TON, live since November 2025, scale not disclosed), on "the chain wired into a platform" (555.92); labels
        count Telegram USERS, never Gram holders (flag 562.24) · SPIN candidate (the whole graph, once) `[VERIFY 400
        validators, 720M]`
9:17.4  SAY:  "with over a billion users has a distribution advantage nothing else on this list has."
9:17.6  [DIAGRAM] C26-overview-billion: the platform box + its wires into the chain spotlit on "with over a billion users"
        (557.64) → 9:22.0
9:18.7  [DUCK] Bed E DIP -5 dB (0.5 s ramp) on the file's first full section (64-82, -10.4 LUFS) → 9:36.7 · HARD HIT 558.68:
        the full section arrives on "a distribution advantage nothing else on this list has" and carries the F10 verdict
        and "So that's the list", held 23.4 under so the verdict reads clean. SFX: none (file-carried)
9:22.0  [TRANSITION] cover→face cut-in F10 → hand:film-burn (face-cut, 0.76s) (face pick)
9:22.0  [FACE] F10 → 9:31.8, AS RECORDED, FACE_REFRAME on: the CH5 verdict
9:22.0  [CAPTION] ON → 9:31.8 (F10)
9:22.2  SAY:  "My verdict?"
9:23.1  SAY:  "My opinion?"
9:23.5  [PUNCH-IN] F10 punch 1 of 2 ON the desilence-final join 563.500 s (frame 16905): step IN
9:23.5  [LIGHTLEAK] F10 library light leak 20 of 22 ON the same join frame → lib:lightleaks-8 (punch-leak, 1.12s) (punch-leak)
9:23.6  SAY:  "Well, if over a billion users end up holding and paying with Gram, it's the obvious distribution"
9:31.1  [PUNCH-IN] F10 punch 2 of 2 ON the desilence-coarse join 571.067 s (frame 17132): step BACK to base, 0.70 s before the
        F10 out (571.233 and the burst-removal join 571.7 sit inside the gap and the edge margin)
9:31.1  [LIGHTLEAK] F10 library light leak 21 of 22 ON the same join frame, SHORT look (0.4 s), clear of the out move
        → lib:lightleaks-short-3 (punch-leak, 0.40s) (punch-leak)
9:31.1  SAY:  "play of this list."
```

## CH6 - THE CLOSE (9:31.8-10:48.3, Bed E continues, card OFF)
```
9:31.8  [TRANSITION] face→cover F10 out → hand:film-burn (face-cut, 0.76s) (face pick)
9:31.8  [CONTAINER] C38 IN → 9:33.5 (CARD SLIDE, gold, eyebrow 'Four cryptos / The list', headline 'Four different bets on the
        same idea'): all four rows resting under "So that's the list" · quiet scale-in ingress
9:32.0  [MUSIC] Bed E continues cardless into CH6 (same file, sample-continuous: file 77.3 at 571.98; the mixer merges the CH5
        and CH6 rows into one placement, same gain, no step) → 10:48.3
9:32.0  SAY:  "So that's the list."
9:33.5  [CONTAINER] C38-s1: ARB 'Rails that charge rent' lit in its chapter blue on "Rails" (573.54)
9:33.5  SAY:  "Rails that charge rent, money nobody controls, a piece of the AI production and distribution"
9:35.2  [CONTAINER] C38-s2: + KAS 'Money nobody controls' lit teal on "money" (575.24)
9:36.7  [DUCK] Bed E LIFT +4 dB (0.5 s ramp) on the file's own breakdown (82-92, -25.4 LUFS) → 9:46.7 · HARD HIT 576.68: the
        breakdown lands under the recap tail and the rule line, a musical rest (29.4 under), the band returns at 9:46.7.
        SFX: none (file-carried)
9:36.9  [CONTAINER] C38-s3: + TAO 'A piece of the AI production' lit purple on "a piece" (576.86)
9:38.6  [CONTAINER] C38-s4: + TON 'Distribution to a billion people' lit azure on "and distribution" (578.56) → 9:40.7; the
        four spoken framings with the real marks, no prices, no number cells, no drawdown row (RULED)
9:39.7  SAY:  "to a billion people."
9:40.7  [IMAGE] IMG-22-four-coins-amber-row (G22, four plain coins of four metals on dark wood, no marks: the four-logo take → lib:glitchoffset-1x (glitch-still, 0.40s)
        was dropped by Mike) IN → 9:42.9, ends exactly on F11
9:41.3  SAY:  "Four different bets on the same idea."
9:42.9  [TRANSITION] cover→face cut-in F11 → hand:film-burn (face-cut, 0.76s) (face pick)
9:42.9  [FACE] F11 → 10:48.3 EOF: the face part 9:42.9-9:48.3 (the rule, FACE_REFRAME on, captions ON), then the SCREEN
        SHARE AS FILMED 9:48.3-10:48.3 (the community / CTA pitch, Mike 2026-10-10: a FACE window for the cover track only,
        no cover, no reframe, no punch, no leak, no captions)
9:42.9  [CAPTION] ON → 9:48.3 (the face part of F11 only; OFF from 9:48.3 to the end over the screen share, RULED at GATE 3)
9:43.2  SAY:  "Own things that keep producing when your job doesn't and do it now while you still have"
9:46.7  [DUCK] Bed E LIFT +2 dB (0.5 s ramp) on the band's return (file 92-106, -18.5 LUFS) → 10:00.7: 24.5 under as the
        screen share starts; from 10:00.7 the driving body (file 106-140) carries the pitch at the seat, no row
9:47.5  [PUNCH-IN] F11 punch 1 of 1 ON the desilence-coarse join 587.467 s (frame 17624): step IN on the rule line's last
        words; the as-filmed cut at 9:48.3 returns to the screen share's own full frame (no zoom carried over)
9:47.5  [LIGHTLEAK] F11 library light leak 22 of 22 ON the same join frame, SHORT look (0.4 s): 0.8 s before the as-filmed
        cut, the flash must not touch the screen share → lib:lightleaks-short-8 (punch-leak, 0.40s) (punch-leak)
9:47.8  SAY:  "that paycheck."
9:48.3  [CUT] AS FILMED: Mike's own cut from his face to the screen share (588.267, scene detection); not a comp transition,
        nothing added. jumpcuts-final.json lists 9 punch candidates inside the share (614.467 · 616.5 · 622.3 · 628.367 ·
        630.233 · 632.567 · 640.333 · 642.633 · 647.4): ALL DROPPED, the share ships as filmed (PROJECT-LOG 2026-10-11 00:05)
9:48.4  SAY:  "And if you want to learn more about these tokens and others, join a community of like-minded"
9:53.4  SAY:  "people."
9:54.0  SAY:  "We get in on a lot of these awesome plays, not only the big caps and some of the more"
9:59.1  SAY:  "well-known ones, but we do find a lot of them very, very early."
10:03.2 SAY:  "Like imagine joining the group and you put 1,000 dollars on a token like Lab, like in December"  (RULED: ships as
        filmed; nothing on screen, in a title or in the description repeats the figure, flag 603.16)
10:09.5 SAY:  "of last year, you wait six months and you turn it to 350,000 dollars."
10:14.6 SAY:  "These are some of the things we got going on in my group."
10:17.5 SAY:  "It's good for good plays."
10:18.8 SAY:  "It's good for learning more."
10:20.2 SAY:  "It's good for communicating with like-minded people."
10:22.5 SAY:  "And taking a few courses, using some software, using some swing training software."  (probably "trading")
10:27.6 SAY:  "So we got it going on pretty good in this group."
10:29.4 SAY:  "So click the link in the description below."
10:31.4 SAY:  "If you want to be a part of the greatest community ever, not only that, click that like button"
10:35.2 SAY:  "and click that subscribe button."
10:36.7 [DUCK] Bed E DIP -2 dB (0.5 s ramp) on the final build (file 142-154, -11.8 LUFS) → 10:48.3: it enters on "Comment
        below" (636.86) after the file's one-window rest, 21.8 under
10:36.9 SAY:  "Comment below if you have any thoughts about any of the tokens that I've just described"
10:40.6 SAY:  "in this video, and I'm going to catch you guys later."
10:43.6 [MUSIC] HARD HIT 643.56: Bed E fades over 4.75 s from the end of "later." to the last frame, under the sign-off, NO
        hit (file 153.63 on the last frame; the epic hit at about 170-172 is never reached). SFX: none (Mike: no epic hit)
10:43.8 SAY:  "Code Monkey, Code Monkey, Code Monkey Mike."
10:48.3 [END] the video ends on the screen share's last frame (picture 648.267, audio 648.31) right after the sign-off; no end · [TRANSITION] → hand:cut (face-cut, 0.00s)
        card (the bed's 4.75 s fade assumes it: an end card would need fade_out_sec = video end minus sh(643.56))
```

## SFX kit picks (measured 2026-10-11: ffmpeg decode, 48 kHz mono, 10 ms RMS windows, tail = the last window within 40 dB of the peak)
| file (video-creation/assets/sfx/...) | peak in file | -40 dB point | audible after peak | used at |
|---|---|---|---|---|
| Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 | 0.09 s | 1.17 s | 1.08 s | the four cards 1:45.0 · 4:28.0 · 6:11.7 · 8:14.9 |

Four hits on an 11:14 video, all soft title-card impacts (Mike: the loudest sound design allowed). Nothing on face cuts, b-roll
cuts, container swaps, chart landings, the 22 punch-leak joins, the clip inserts or the screen share; the 12 MUSIC-PLAN hard hits
are arrangement moves the bed files carry (SFX: none). Library transitions and leaks: baked SFX MUTED. Rejected for this video
by measured tail or by Mike's rules: Impact_1 (peak 1.05 s, -40 dB at 4.71 s), Impact_2 (1.55 / 3.85 s), Impact_3 (0.81 / 3.58
s), the Impact_Hit_01 trio full (-40 dB at 5.04 / 6.33 / 5.45 s), Kick_Impact_01 full (3.92 s), Soundjay_Impact_Main_01 full
(2.29 s), card-impact-hit01-3-short (2.24 s), every riser (Mike: no risers). card-impact-layered.wav (peak 0.03 s, -40 dB at
1.17 s) is NOT the fallback: Mike heard its mid layer as "a punch sfx, out of place" on kaspa 30bps. Fallback if the laptop-
speaker check loses the sub-heavy DSGNImpt: Impacts/Impact_Hit_01-2-18.wav (peak 0.13 s, -40 dB at 1.78 s, 1.65 s after the
peak, slightly over the 1.5 s pause).

## Orphan reconciliation (zero orphans: 161 renderable files, 159 PLACED, 2 BENCH, 0 unplaced)
Source files are exempt (comp-build §10): the `*.html` diagram / chart / slide sources, `charts/C2-data.json`, `*.spec.md`,
`diagrams/_state-cues.md`, `slide-sources/` (`containers.html`, `_shot.py`, `mark-tao.png`) and `VISUAL-QA.json`.
`assets/transitions/` is empty until the transitions node copies the picked library plates.

**PLACED**
- title-slides (4): title-CH2 1:45.0 · title-CH3 4:28.0 · title-CH4 6:11.7 · title-CH5 8:14.9.
- card-slides (21): H0-s1 0:35.1 · H0-s2 0:37.9 · N2-s1 1:37.7 · N2-s2 1:38.7 · N2-s3 1:39.4 · N2-s4 1:40.0 · C5-s1 3:06.2 ·
  C5-s2 3:09.3 · C5-s3 3:12.7 · C5-s4 3:14.1 · kas-question 4:32.0 · toccata-zk 5:44.9 · steeves-quote 6:37.6 · N4-s1 7:36.6 ·
  N4-s2 7:55.9 · N4-s2-handover 7:59.6 · C38 9:31.8 · C38-s1 9:33.5 · C38-s2 9:35.2 · C38-s3 9:36.9 · C38-s4 9:38.6.
- diagrams (40 Type 2 state stills): C1-s1-ethereum 1:48.6 · C1-s1-arbitrum-one 1:54.6 · C1-s2-treasury 2:12.6 · C1-s2-inflow
  2:16.1 · C1-s3-robinhood-chain 2:26.6 · C1-overview-8 2:43.9 · C1-overview-2 2:47.1 · C1-overview-90 2:48.4 ·
  C16-s1-fair-launch 4:44.6 · gatekeepers-ai 4:52.1 · gatekeepers-bank 4:57.2 · gatekeepers-foundation 4:58.0 · N3-s1-supply
  5:02.6 · N3-s2-whole 5:19.3 · N3-s2-run 5:21.2 · N3-s2-noone 5:22.0 · C16-overview-full 5:52.4 · C16-overview-apps 5:57.3 ·
  C16-overview-dagknight 6:00.2 · C21-s1-network 6:19.8 · C21-s1-compute 6:23.7 · C21-s1-inference 6:24.4 · C21-s1-storage
  6:25.2 · C21-s1-prediction 6:25.9 · C21-s2-miners 6:29.4 · C21-s2-validators 6:30.7 · C21-s2-stakers 6:32.4 · C21-s2-owner
  6:33.9 · C21-s2-paid 6:36.1 · ai-production-wages 6:49.4 · ai-production-production 6:50.5 · ai-production-inputs 6:52.1 ·
  ai-production-paid 6:54.4 · ton-history-2018 8:25.6 · ton-history-2020 8:28.7 · ton-history-2021 8:31.0 · C26-s1-miniapps
  8:49.5 · C26-s1-wallet 8:54.6 · C26-overview-full 9:15.6 · C26-overview-billion 9:17.6.
- charts (4 Type 1 ANIMATED ids, built in CODE; their 12 PNGs are the design-state SPEC the comp's frames must match, never a
  held bitmap, comp-build §7): C2-start / C2-mid / C2-payoff 3:31.7-3:35.7 · C4-start / C4-hero / C4-range 3:55.2-4:02.3 ·
  C22-start / C22-mid / C22-payoff 7:13.4-7:17.4 · tao-rev-vs-emissions-start / tao-rev-vs-emissions-mid /
  tao-rev-vs-emissions-payoff 7:41.2-7:51.1.
- receipts (36 of 38): C34-challenger-ai-cuts 0:42.9 · C36-stanford-19-percent 0:52.3 · C35-bls-labor-share 1:03.6 ·
  C37-amodei-entry-level 1:12.4 · CLIP-2-in 1:27.5 · CLIP-2-out 1:34.7 · R2-techcrunch-offchain 2:02.9 · R2-princeton 2:05.3 ·
  C8a-dateline 2:31.1 · C8a-robinhood-120-countries 2:33.5 · C9-arbitrum-factsheet 2:40.2 · C6-sec-press-release 2:56.4 ·
  CLIP-3-in 3:01.4 · CLIP-3-out 3:04.1 · C8b-robinhood-debt-securities 3:18.3 · R3-coindesk-exclude 3:23.8 ·
  C14-defillama-fees 3:27.0 · R4-cmc-token-unlocks-schedule 3:37.4 · R4-tokenomist-next-unlock 3:38.9 ·
  C11-arbitrum-foundation-funding 3:42.0 · R5-coingecko-market-cap 3:47.4 · C10-theblock-dao-income 3:52.4 ·
  C15-kaspa-lore-fair-launch 4:41.0 · C20-umbrel-rusty-kaspad 5:07.8 · C18-kip-14-crescendo 5:27.9 · C19-kaspa-docs-toccata
  5:38.9 · C25-opentensor-overview-fair-launch 7:04.3 · C23-bittensor-emissions 7:08.0 · C24-bittensor-subnet-limit 7:19.2 ·
  R6-cryptobriefing-24-subnets 7:27.5 · C31-durov-gram-521 8:14.9 · C30-durov-telegram-driver-501 8:33.5 ·
  C28-durov-billion-users-404 8:43.5 · R7-defillama-ton-stablecoins 8:58.8 · C29-durov-cocoon-462 9:02.8 · C32-cocoon-org 9:08.4.
- clip-inserts (2): CLIP-2-tenev-ownership.mp4 1:34.7 (12.25 s, own voice) · CLIP-3-atkins-sandbox.mp4 3:04.1 (7.55 s, own
  voice).
- vid (22 Envato, all muted, every clip at least as long as its slot): BR-1-box-carried-out 0:41.3 · BR-2-factory-worker-walks
  1:00.4 · BR-3-dark-corridor-dolly 1:43.7 · BR-4-box-wrapping-machine 1:58.9 · BR-5-rail-yard-aerial 2:23.4 ·
  BR-6-neon-caution-sign 3:15.2 · BR-7-ballot-clear-box 3:44.6 · BR-8-calculator-hands-dark 4:02.3 · BR-9-asic-miner-rows
  4:37.0 · BR-10-turnstile-denied 5:00.3 · BR-11-train-light-streak 5:25.8 · BR-12-data-stream-teal 5:36.9 ·
  BR-13-cranes-at-night 5:49.4 · BR-14-robot-arms-assembly 6:15.8 · BR-15-pay-envelope 6:45.4 · BR-16-hourglass-gold-sand
  7:00.5 · BR-17-keynote-stage 7:24.6 · BR-18-gpu-server-racks 7:34.1 · BR-19-new-coins-pile 7:51.1 ·
  BR-20-seedlings-timelapse 8:02.2 · BR-21-phone-messaging-dark 8:22.5 · BR-22-crowd-crossing-aerial 8:41.0.
- img (22 ChatGPT stills, chapter styles as ruled): IMG-1-job-seekers-lobby 0:49.6 · IMG-2-glass-door-closing 0:56.9 ·
  IMG-3-researchers-server-wall 1:10.2 · IMG-4-hoodie-monitors-dark-room 1:25.0 · IMG-5-arbitrum-coin-hero 1:45.0 ·
  IMG-6-arbitrum-platform-chains 2:09.1 · IMG-7-empty-desk-lights-dim 2:17.9 · IMG-8-certificates-to-glass-tokens 2:20.2 ·
  IMG-9-meme-coins-toppling 3:35.7 · IMG-10-kaspa-coin-hero 4:28.3 · IMG-11-empty-office-dissolving 4:49.4 ·
  IMG-12-home-server-bookshelf 5:11.1 · IMG-13-robots-tossing-kaspa-coins 5:32.9 · IMG-14-tao-coin-neural-network 6:11.8 ·
  IMG-15-night-market-four-stalls 6:26.6 · IMG-16-mining-rig-to-neural-net 6:41.4 · IMG-17-builders-subnet-towers 7:17.4 ·
  IMG-18-uneven-towers-wired 7:53.4 · IMG-19-ton-coin-paper-clouds 8:19.6 · IMG-20-validator-tower-globe 8:37.5 ·
  IMG-21-chatbots-handing-coins 9:12.6 · IMG-22-four-coins-amber-row 9:40.7.

**BENCH (2, both alternates for the R4 beat at 3:37.4):**
- receipts/R4-cmc-token-unlocks.png BENCH: the tall CMC capture (allocation, unlock progress, the schedule and the Oct 16
  93.14M row, reached only by a vertical pan); it prints 'Unlocked Market Cap $1.78B' and a dollar value on every unlock row.
- receipts/R4-tokenomist-arb-unlocks.png BENCH: Tokenomist's release-schedule chart, the alternate for R4 stage 1 (CMC's
  schedule chart is cleaner and carries no watermark).

**REJECTED:** none on disk. The visual-qa failures of 2026-10-10 (74 files) and the superseded clip cuts live under
`_previews/superseded-*`, outside assets/.

**Planned but never built (COVER-PLAN bench, nothing on disk):** C3 (code unlock ladder, bench for R4) · C7 (Atkins statement,
bench for R3) · C12 (allocation table) · C13 (Tenev's X post: no spoken line in the take) · C27 (TON ladder) · C17 / C33 (removed
at GATE 1) · C39 / C40 (not used) · R1 (the every-job thumbnail flash, NOT added, open) · CLIP-1 REJECTED · CLIP-4 / CLIP-5 HELD.

## Open decisions that would move a cue
- **Bed B after the CLIP-3 trim (3:05.2 → 3:07.0):** MUSIC-PLAN was carved on the 9.4 s CLIP-3; the clip is 7.55 s, so the file's
  full-wall return (90.0) lands at 187.03 under "can trade on a public blockchain", not on "A sandbox for 5 years", and the
  +7 dB low-stretch row (ending 185.18) leaves 1.85 s of the low stretch unlifted (about 35 under). Fix before the mix: end
  the row at 187.03, or shift Bed B's source_in +1.85 s so the wall lands on the sandbox line again. (CLIP-2's 0.15 s trim
  moves Bed A's post-insert file times by 0.15 s: inaudible, no change.)
- **R4 stage 2 dollar values (3:38.9):** R4-tokenomist-next-unlock prints bracketed unlock values ($18.0M, $14.1M, $4.2M).
  They are unlock valuations, not ARB's price, but the video's rule is no price on screen: keep, crop to the two 92.6M
  lines, or hold R4-cmc-token-unlocks-schedule for the whole 4.6 s (then "92 million" is VO-only).
- **C8a "Not in the US yet" (2:38.7):** stage 2 shows "availability varies by jurisdiction"; the 'US and US persons'
  exclusion line the plan wanted is not in either C8a crop. A re-crop would add a third stage at 2:38.7.
- **R7 / C26 figure (8:58.8, 9:15.6):** DEFAULT applied (total stablecoins on TON, about 720M, against the VO's "USDT ...
  750 million"); Mike can overrule at GATE 4.
- **R1 every-job thumbnail flash:** NOT added (RULED default); if Mike wants it, a 2 s overlay at about 0:05.9-0:07.9 on
  "my previous video" (5.94-6.54), over F1, just after the 0:05.1 punch-leak (captions stay on top).
- **CLIP-4 (Durov, after 551.36) / CLIP-5 (Steeves, after 401.32) HELD:** adding either inserts its own pause (everything
  after shifts by its length) and turns C32 / steeves-quote into its lead-in, with a lead-out still after it.
- **Tight leaks:** the SHORT look (0.4 s) on 6:02.7 · 6:11.2 · 6:59.9 · 8:14.2 · 9:31.1 · 9:47.5 (or TRANSITIONS.md trims the
  leak tail); the punch stays on its join either way. The 9:47.5 step-in holds only 0.8 s before the as-filmed cut.
- **Screen-share framing:** FACE_REFRAME must exclude 588.267-648.267 (the share is not a face; reframing would crop his
  screen). Confirm in comp_build / lint_face_reframe.
- **Card impact audibility:** DSGNImpt is sub-heavy; QA the four cards on laptop speakers, fallback Impact_Hit_01-2-18.wav.
- **Card pause length:** 1.5 s each (MUSIC-PLAN canvas); a different pause moves only the final timeline (sh()), not this log.
- **C1-s1 spotlight swap:** 1:54.6 on "second layer" (state-cue primary) or 1:53.5 on the name "Arbitrum" (its alternate).
- **TRANSITIONS.md picks (next node):** the card move, the one face look (film burn or Blocks·Max), the AI-still family, the
  3-4 leak ids, and which MELT / SPIN candidates are taken (MELT 2:43.9 · 3:31.7 · 7:13.4; SPIN 3:55.2 · 5:52.4 · 7:41.2 · 9:15.6).
- **[VERIFY] at render (live figures, re-pull and confirm each still rounds to the spoken one):** C34, C35 · C14 / C2 (99%)
  · R4 (92M) · R5 / C4 (1.2B; 99x / 65x / 150x) · C22 (54%) · tao-rev-vs-emissions (360M) · R7 / C26 (720M, 400 validators) ·
  C20 (Umbrel version) · steeves-quote words by ear.
