# reset - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author off the graph's seed (`_previews/EDIT-PLAN.seed.md`, gen_editplan.py) + AS-RECORDED.md +
> `spine/ALL.d.desilenced.medium-words.json` + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Open flags) +
> `spine/jumpcuts-final.json` + `assets/slide-sources/_state-cues.md` + assets/VISUAL-QA.json. Format:
> `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; per its ⛔ ORDER note the comp is built TO this log.
> Watch file: `spine/ALL.d.desilenced.mp4` (748.20 s / 12:28.2, 1080p30; the post-Enhance-Speech spine, the pre-enhance copy
> sits at `_previews/ALL.d.desilenced.pre-enhance.mp4`). Timecodes = FINAL-spine seconds, PRE-card-pause: every pause below
> shifts the final timeline via `sh()` at comp; no chain shift is ever re-applied here.
> PAUSES baked by `card_pauses` (6, +55.53 s): CLIP-1 4.0 s @45.82 · CH2 card 1.0 s @100.54 · CLIP-5 13.8 s @333.16 ·
> CLIP-4 17.6 s @402.34 (the EXTENDED window, Mike 2026-10-29) · CLIP-6 13.8 s @459.08 · BRAAM beat 5.33 s @613.94.
> Final runtime around 802.6 s (13:22.6).
> FORMAT (Mike, GATE 1 2026-10-29): NO screen share was recorded; every chapter is the gated-face camera take, every deck
> card is a full-frame card container (light theme, CH1 red #C41E3A, CH2-CH7 gold #8F6500, Kaspa teal on card-10.3 only).
> FACE: 18 windows (blackdetect), 25 punch points ON desilencer joins (each with a library light leak ON the same frame; a
> window with no interior join gets neither). Captions ON over FACE holds over 5 s only (15 windows), never over a cover.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (not authored yet; reconcile_docs.py fans the picks in).
> SFX: every row names its kit file and `mood_class`, picked by MEASURED tail (ffmpeg, 10 ms RMS envelope, the point
> where it falls 40 dB below its peak, measured 2026-10-29); mix_music.py reads the rows (`file start` = source seconds).
> ZERO ORPHANS: every file in assets/ (vid, img, receipts, clip-inserts, charts, diagrams, card-slides, title-slides) is
> PLACED with a timecode below or marked BENCH / REJECTED in the reconciliation at the end.
> ⛔ OPEN (moves cues, see the last section): the two grid-outage receipts Mike ruled at the plan gate were never captured
> (R-GRID-X / R-GRID-NEWS, fallbacks BR-18 / IMG-6 named in their slots) · MUSIC-PLAN still carves CLIP-4 at 12.8 s and has
> no braam pause · the C16 panel reads 7.24% under 'around 7.3' · the card-9.1 sourced 11.7% vs the VO's 11.1% · captions
> scope over the CH2-CH7 camera holds.

## CH1 - THE ADMISSION (0:00.0-1:39.2, Bed A `atmos-rise`, card OFF; gear 3, on camera)
```
0:00.0  [FACE] F1 opens ON face → 0:10.6 (blackdetect 0.000-10.633; the 0:00 burst is already cut, the 'in debt' stare pause and the
        400 ms after 'gets paid off' kept per Mike's spine review); no cut-in, the video opens here; its only join (10.600) sits
        inside the 0.5 s edge margin, so NO punch and NO leak
0:00.0  [CAPTION] ON → 0:10.6 (F1, face hold over 5 s; FACE window only; montserrat house style)
0:00.0  [MUSIC] Bed A `atmos-rise` row 1: master bars 38-43 (the breakdown pad, file 73.8 in) SUBTLE at -21 dB under the VO for the
        first sentence only (Mike's spine-review ruling), 0.08 s fade-out at 0:10.8 · license `ZN6LHN3LUTWO9COR`
0:00.0  SAY:  "So the president of the United States, Trump, of all people, said out loud how 40 trillion dollars in debt gets paid off."
0:10.6  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.50s)
0:10.6  [RECEIPT] C3 IN (receipts/C3-time-trump-inflation.png, the WIDE crop) → 0:22.4: the TIME interview transcript (time.com,
        Oct 1, 2026), wide establish on the cut from 'paid off.'; lower-third 'TIME interview at the White House, Sept 28, 2026'
        (code-drawn) · treatment: highlight
0:10.7  [MUSIC] Bed A row 2: master bars 1-15 (the BUILD) enter on the bar line 0:10.7, -17 dB under, the pad leaves; 0.38 s before
        'His words to TIME magazine' (MUSIC-PLAN hard hit 10.70) · [IMPACT] layer: none (the bed's own entrance is the move)
0:11.1  SAY:  "His words to TIME magazine, certain levels of inflation will also pay off that debt very rapidly."
0:13.7  [RECEIPT] C3 tight crop (receipts/C3-time-trump-inflation-tight.png): push onto the sentence · [HIGHLIGHT] yellow wipe word
        by word 'Certain levels of inflation will also pay off that debt very rapidly.' 13.74 → 17.94, STOPS at 'rapidly.' (the
        closing repeat was not said); WARNING 1 held, 'also' inside the wipe; the tight crop holds under 'in plain English'
0:18.6  SAY:  "And so here's what that means in plain English."
0:22.4  [CHART] C4 debt ticker IN (Type 1, animated in CODE, CH1 red) → 0:27.4: the digits spin from grey placeholders toward
        $40,444,342,709,389, 'Total public debt outstanding, Oct 22, 2026', source 'Treasury Debt to the Penny' `[VERIFY live at build]`
        · quiet swap → hand:xfade-scale (container-xfade, 0.40s)
0:22.4  SAY:  "The debt is a number and that number is written in dollars."
0:26.3  [CHART] C4 LANDS $40,444,342,709,389 on 'dollars.' (25.96-26.30); the '+6.7B a day' pill fades in under it ·
        [ACCENT] timpani clicker a (accents/accent-timpani-clicker-01-a.wav, mood_class neutral; measured peak 0.05 s, -40 dB ring
        1.78 s) file start 26.25: the video's first big number lands, seated under the VO
0:26.3  SAY:  "Inflation makes every one of those dollars worth a little bit less."
0:27.4  [VIDEO] BR-1 dollar handover IN (vid/BR-1-dollar-handover.mp4, first 3.55 s) → 0:30.9: hands passing a stack of dollars, the
        literal noun for 'those dollars' → hand:fade (broll-fade, 0.50s)
0:30.9  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.50s) (face pick)
0:30.9  [FACE] F2 IN → 0:33.6 "So the debt doesn't shrink, your dollars do" (2.6 s; under 5 s, no captions; 'so to speak' falls
        on the cover after it)
0:31.0  SAY:  "So the debt doesn't shrink, your dollars do, so to speak."
0:32.4  [PUNCH-IN] F2 hard ~15-20% step IN ON the desilencer join 32.433 (frame 973, spine/jumpcuts-final.json)
        → holds to the next join or 0:33.6
0:32.4  [LIGHTLEAK] F2 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 973,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
0:33.6  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.50s)
0:33.6  [CONTAINER] H4 IN (card-slides/H4-s1.png, CH1 red) → 0:40.2: eyebrow IN PLAIN ENGLISH, 'Same dollars. Less VALUE.', both
        bars full
0:34.9  SAY:  "At least they shrink in their value, just like the debt will shrink in its value."
0:35.7  [CONTAINER] H4-s2: the 'Your dollars' bar shrinks on 'shrink' (35.66)
0:38.4  [CONTAINER] H4-s3: the 'The debt' bar shrinks on 'the debt will shrink' (38.38); no numbers on the card
0:40.2  [VIDEO] BR-2 press mics IN (vid/BR-2-press-mics.mp4, 2.7 s) → 0:42.9: the press-briefing mic cluster sets the gaggle → hand:fade (broll-fade, 0.50s)
0:40.2  SAY:  "Three days after that interview, Trump talked to reporters about the cost of living and he said this."
0:40.7  [MUSIC] Bed A row 3: PEAK 1 (master bar 16, full drums) on the bar line 0:40.7, -16 dB under, 0.54 s into 'Three days
        after that interview' (MUSIC-PLAN hard hit 40.70); CLIP-1 rides it ducked · [IMPACT] layer: none (the drums are the hit)
0:42.9  [CONTAINER] CLIP-1 LEAD-IN → 0:45.8: the clip's FIRST frame (Trump to reporters, the top caption band 'Donald Trump,
        speaking to reporters, Oct 1, 2026') held as a still under '...and he said this.' (no build; the comp pulls it from
        clip-inserts/CLIP-1-trump-inflation.mp4) → hand:fade (container-xfade, 0.50s)
0:45.8  [INSERT] CLIP-1 SPLICED CLIP, 4.0 s (clip-inserts/CLIP-1-trump-inflation.mp4): the spine PAUSES at the trough after
        'this.' (45.82; the trough to 'The' is 0.42 s, bake_clip_insert.py snaps it) and the clip plays FULL-FRAME with Donald
        Trump's OWN voice ("We have inflation totally in control, and we've done a great job."), caption burned on the top band
        (the Forbes chyron stays clear); Bed A peak 1 ducks -14 dB under it automatically (4.0 s = exactly 2 bars, the grid holds);
        [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert)
0:45.8  [CONTAINER] CLIP-1 LEAD-OUT → 0:48.3: the clip's LAST frame (his 'in control' face) held as a still under 'The official
        number for September came in' → hand:fade (insert-in, 0.50s)
0:46.2  SAY:  "The official number for September came in at 3.7 percent, almost double the Fed's own 2 percent goal."
0:48.3  [RECEIPT] C24 IN (receipts/C24-bls-cpi-sept-2026-tight.png) → 0:53.8: the BLS CPI release for September 2026, its title and
        summary paragraph, a settling push · [HIGHLIGHT] wipe on 'increased 3.7 percent' landing on '3.7' (49.16), held through
        'the Fed's own 2 percent goal' · treatment: highlight `[VERIFY next BLS release]` → hand:xfade-scale (container-xfade, 0.40s)
0:53.8  [DIAGRAM] T1 IN (diagrams/T1-dim.png, CH1 red, Type 2 still) → 1:00.3: 'This has been done before.', both eras dimmed; a
        gentle push across the states (comp-build 7a, never dead still) → hand:xfade-scale (container-xfade, 0.40s)
0:53.8  SAY:  "Now, this has been done before, after World War II and again in 2020."
0:56.4  [DIAGRAM] T1-ww2: '1942 to 1951: long rates capped at 2.5%, inflation 19.7% (March 1947)' lights on 'World War II'
0:58.7  [MUSIC] Bed A row 4: the DIP (master bars 77-79) pulls the floor out for 6 s on the bar line 0:58.7, -20 dB under
        (MUSIC-PLAN hard hit 58.70) · [IMPACT] layer: none (the music's own drop-out is the move)
0:59.1  [DIAGRAM] T1-y2020: '2020 to 2022: rates at zero, inflation 9.1% (June 2022)' lights on '2020'
1:00.3  [CONTAINER] H3 IN (card-slides/H3.png, motion-type, CH1 red) → 1:04.7: the card opens on the plate, the words held back → hand:xfade-scale (container-xfade, 0.40s)
1:00.3  SAY:  "But shrinking debt with inflation on purpose typically makes people angry."
1:02.8  [CONTAINER] H3 SLAM: 'ON PURPOSE?' slams in on 'on purpose' (62.76), comp motion (scale 1.15 → 1.0 in 4 frames) ·
        [IMPACT] Impact Hit 01 var 2 short (Impacts/Impact_Hit_01-2-short.wav, mood_class epic; measured peak 0.13 s, -40 dB ring
        0.42 s) file start 62.63: the slam lands inside Bed A's dip, so the hit stands alone; under the VO
1:04.7  [VIDEO] BR-3 protest megaphone IN (vid/BR-3-protest-megaphone-night.mp4, 3.6 s) → 1:08.3: the night protest, the literal
        noun for 'angry' → hand:fade (broll-fade, 0.50s)
1:04.7  [MUSIC] Bed A row 5: the SWELL (master bar 80) on the bar line 1:04.7 on 'makes people angry' (MUSIC-PLAN hard hit 64.70),
        then the FINAL PEAK · [IMPACT] layer: none
1:06.4  SAY:  "So here's what I think comes next."
1:06.7  [MUSIC] Bed A: the FINAL PEAK (16 bars, -16 dB under) drops on 'here's' of 'So here's what I think comes next'
        (MUSIC-PLAN hard hit 66.70); the reset, 'even richer', the billionaire wave and the thesis ride it · [IMPACT] layer: none
        (the drop is the hit; fewer, bigger)
1:08.3  [IMAGE] IMG-1 printing press IN (img/IMG-1-printing-press.png, photoreal, CH1 red, 3.3 s) → 1:11.6: lands on 'crisis'
        (glitch ingress → lib:turbulent-h-1x (glitch-still, 0.28s))
1:08.3  SAY:  "A crisis where money printing looks like a rescue."
1:11.6  SAY:  "And that's the reset that I've been pondering."
1:11.6  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.50s) (face pick)
1:11.6  [FACE] F3 IN → 1:17.5 "And that's the reset that I've been pondering. I don't believe it's a matter of if, I just believe
        it's a matter of when." (5.8 s; its one join, 77.300, sits inside the edge margin: NO punch, NO leak)
1:11.6  [CAPTION] ON → 1:17.5 (F3, face hold over 5 s)
1:14.0  SAY:  "I don't believe it's a matter of if, I just believe it's a matter of when."
1:17.5  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.50s)
1:17.5  [VIDEO] BR-4 money counter IN (vid/BR-4-money-counter-macro.mp4, 2.6 s) → 1:20.1: a counting machine (not a press, so no
        repeat of BR-22)
1:17.5  SAY:  "And when money gets printed into a crisis, the people who already own scarce assets come out the other side, even richer."
1:20.1  [IMAGE] IMG-2 vault open IN (img/IMG-2-vault-open.png, 3.9 s) → 1:24.0: 'own scarce assets ... even richer' (glitch ingress
        → lib:turbulent-v-2x (glitch-still, 0.32s))
1:24.0  [CHART] H5 count-up IN (Type 1, animated in CODE, CH1 red) → 1:31.0: eyebrow 2020 TO 2021, 'A record wave of brand new
        billionaires.', the flip counter at 000, the 493-dot grid empty → hand:xfade-scale (container-xfade, 0.40s)
1:25.4  SAY:  "We watched this happen in 2020 and 2021, a record wave of brand new billionaires."
1:30.3  [CHART] H5 LANDS 493 on 'billionaires.' (90.26): 'newcomers to the Forbes list' + the A RECORD pill, source 'Forbes, April
        2021' (no SFX: Bed A's final peak carries it); the 2,755 total and 13.1T stay for C17
1:31.0  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.50s) (face pick)
1:31.0  [FACE] F4 IN → 1:36.9 the locked thesis line, first person (5.9 s; its one join, 96.700, sits inside the edge margin: NO
        punch, NO leak)
1:31.0  [CAPTION] ON → 1:36.9 (F4, face hold over 5 s)
1:31.0  SAY:  "And I happen to think that a wave of crypto billionaires will be made next year and the following year."
1:36.9  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.50s)
1:36.9  [CONTAINER] H2 IN (card-slides/H2.png, motion-type, CH1 red) → 1:39.2: 'WILL YOU BE ONE OF THEM?', the thumbnail line as a
        SILENT card over the handoff (its spoken anchor was not recorded; Mike 2026-10-29: KEEP); it spans 'So let's see how this
        will all play out.' and then HOLDS ~1.4 s with NO voice (0.42 s trough + the first 1.0 s of the 2.5 s card pause at 99.15)
        before the CH2 title slides in (Mike draft note 2026-10-30)
1:37.1  SAY:  "So let's see how this will all play out."
1:38.9  [MUSIC] Bed A's ending BANG (file 193.75) lands on 'out.' (98.64-98.73), 0.59 s before the CH2 card; the ring is the breath
        into the card, row 5 fades 0.4 s into the pause (MUSIC-PLAN hard hit 98.85) · [IMPACT] layer: none (the track's own BANG
        is H2's hit)
```

## CH2 - THE DEBT NOBODY CAN PAY (1:39.2-3:18.4, Bed B `deliverance` SUBTLE, CARD ON; gear 2, slow)
```
1:39.2  [CARD] CH2 "THE DEBT NOBODY CAN PAY" (title-slides/title-CH2.png, rendered in title case with the CHAPTER 02 eyebrow), card pause 2.5 s at 99.15 (snapped into the trough 98.73-99.27; = 1.0 s silent H2 hold + 1.5 s for the title, Mike 2026-10-30; `--card-pause 2.5`) · [TRANSITION] card presentation → rmn:slide (card, 0.50s) (slot card: book-flip / swap fresh, cube recent) · [IMPACT] DSGN single impact (Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral; measured peak 0.09 s, -40 dB ring 1.08 s, the shortest tail in the kit) on the card turn
1:39.2  [CONTAINER] the title card HOLDS (same scene, no new asset) past the pause → 1:41.5 under the title read 'The debt nobody
        can pay.' (RESTORED 2026-10-30: 'The debt' spliced back from the raw take at 99.10, +1.10 s, raw audio level-matched)
1:39.2  [MUSIC] Bed B `deliverance` row 6 (master bars 5-33) fades up 0.6 s through the card pause, full on 'The debt nobody can pay' (span starts 99.16, source_in 11.887), SUBTLE
        -18 dB under (the only bed change: the card pause is the inter-bed breath) · license `BAQJMWCXF0A8SOME`
1:39.2  SAY:  "The debt nobody can pay. Let's start with the debt itself."
1:41.5  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.50s) (face pick)
1:41.5  [FACE] F5 IN → 1:44.0 "Let's start with the debt itself. And here's where it stands." (2.5 s, no captions)
1:42.9  [PUNCH-IN] F5 hard ~15-20% step IN ON the desilencer join 102.900 (frame 3054, spine/jumpcuts-final.json)
        → holds to the next join or 1:44.0
1:42.9  [LIGHTLEAK] F5 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 3054,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
1:43.2  SAY:  "And here's where it stands."
1:44.0  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.50s)
1:44.0  [RECEIPT] C5 IN (receipts/C5-debt-to-the-penny.png, the WIDE crop) → 1:50.2: fiscaldata Debt to the Penny, the header row
        in frame, push onto the boxed 10/22/2026 $40,444,342,709,390.25 row on '40.4 trillion' (105.38) · treatment: push
        `[VERIFY live total: a capture after around Oct 23 rounds to 40.5T]`
1:44.4  SAY:  "The United States owes 40.4 trillion dollars in debt."
1:47.9  [RECEIPT] C5 tight crop (receipts/C5-debt-to-the-penny-tight.png): settles on the boxed total on "That's the Treasury's own
        number."
1:47.9  SAY:  "That's the Treasury's own number."
1:50.2  [CONTAINER] card-1.1+1.2 IN (card-slides/card-1.1+1.2-s1.png, gold) → 1:58.3: 'Passed 40T / August 18, 2026' ON → hand:xfade-scale (container-xfade, 0.40s)
1:50.2  SAY:  "It passed 40 trillion for the first time on August 18th, and it's growing by around 6.7 billion dollars a day."
1:54.2  [CONTAINER] card-1.1+1.2-s2: '+6.7B a day' ON, row 1 back to resting `[VERIFY daily growth]`; WARNING 2 held (6.7, never
        7.3)
1:58.3  [CHART] C6 'Where every tax dollar went, FY2026' IN (Type 1, animated in CODE, gold) → 2:11.1: STATE 1, the two bars start
        to GROW; source 'Treasury Final MTS, FY2026' → hand:xfade-scale (container-xfade, 0.40s)
1:58.3  SAY:  "In the 2026 budget year, the government took in 5.4 trillion dollars and it spent 7.4 trillion."
2:01.5  [CHART] C6 'Took in 5.4T' bar lands on '5.4 trillion'
2:04.1  [CHART] C6 'Spent 7.4T' bar grows on '7.4', lands on 'trillion.' (124.98)
2:05.9  [CHART] C6 STATE 2: the 2.0T gap fills red, 'Borrowed 2T = 27 cents of every dollar spent' lands on '27 cents' (128.72)
2:05.9  SAY:  "So it borrowed around 2 trillion."
2:08.0  SAY:  "That's around 27 cents of every dollar it spent."
2:11.1  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.50s) (face pick)
2:11.1  [FACE] F6 IN → 2:17.3 the interest-vs-defense line on camera (6.1 s; no interior join: NO punch, NO leak)
2:11.1  [CAPTION] ON → 2:17.3 (F6, face hold over 5 s)
2:11.1  SAY:  "And the interest alone was more than a trillion dollars, which is more than the US"
2:15.9  SAY:  "spent on national defense."
2:17.3  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.50s)
2:17.3  [CHART] C6 RETURNS (a continuation of the same chart, a chart state, never a repeated slide) → 2:29.8: STATE 3, the slice
        'Net interest 1.05T = 19 cents' lights on '19 cents' (138.62)
2:17.3  SAY:  "Interest takes around 19 cents of every tax dollar."
2:21.0  [CHART] C6 STATE 4: the big-five stack starts on 'And Social Security'
2:21.0  SAY:  "And Social Security, Medicare, Medicaid, and veterans benefits."
2:21.2  [CHART] C6 'Social Security 1.67T' stacks on
2:22.6  [CHART] C6 'Medicare 1.07T' stacks on
2:23.2  [CHART] C6 'Medicaid 0.72T' stacks on
2:24.5  [CHART] C6 'Veterans 0.42T' stacks on
2:26.0  SAY:  "And those five eat around 91 cents of every dollar the government collects."
2:27.3  [CHART] C6 the stack total '4.93T = 91 cents of every dollar collected' lands on '91' (147.32); WARNING 2 held (19 cents,
        91 cents)
2:29.8  [VIDEO] BR-5 trading room IN (vid/BR-5-trading-room-dark.mp4, 2.1 s) → 2:31.9: a breath between the two charts, the setting
        for 'the bond market' → hand:fade (broll-fade, 0.50s)
2:30.2  SAY:  "Now, here's where it gets tight."
2:31.9  [CONTAINER] card-2.1 IN (card-slides/card-2.1-s1.png, gold) → 2:39.9: '10.6T comes due within 12 months' ON → hand:xfade-scale (container-xfade, 0.40s)
2:31.9  SAY:  "Around 10.6 trillion dollars of this debt comes due within a year."
2:36.2  [CONTAINER] card-2.1-s2: '1 of every 3 dollars' ON
2:36.2  SAY:  "That's around one third of everything the government owes in the bond market."
2:39.9  [VIDEO] BR-6 DC columns IN (vid/BR-6-dc-columns-flags.mp4, 3.5 s) → 2:43.4: a neoclassical federal facade with flags (never
        labelled as the Treasury: not identifiable, visual-qa) → hand:fade (broll-fade, 0.50s)
2:39.9  SAY:  "And it gets paid off the usual way with new loans."
2:43.4  [CONTAINER] card-2.2 IN (card-slides/card-2.2-s1.png, gold) → 2:50.5: 'Old debt: 3.5% average' ON `[VERIFY end of October]` → hand:xfade-scale (container-xfade, 0.40s)
2:43.4  SAY:  "The old debt costs around 3.5 percent on average."
2:47.9  [CONTAINER] card-2.2-s2: 'New 10-year: 5.0%' ON `[VERIFY the 10-year at build]`
2:47.9  SAY:  "New 10-year loan costs around 5 percent."
2:50.5  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.50s) (face pick)
2:50.5  [FACE] F7 IN → 2:59.8 (9.3 s, two interior joins)
2:50.5  [CAPTION] ON → 2:59.8 (F7, face hold over 5 s)
2:50.6  SAY:  "So every year, cheap old debt gets swapped for more expensive new debt."
2:54.7  [PUNCH-IN] F7 hard ~15-20% step IN ON the desilencer join 174.700 (frame 5208, spine/jumpcuts-final.json)
        → holds to the next join or 2:59.8
2:54.7  [LIGHTLEAK] F7 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 5208,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
2:55.1  SAY:  "And the interest bill keeps climbing."
2:57.4  [PUNCH-IN] F7 hard ~15-20% step back OUT to the base frame ON the desilencer join 177.367 (frame 5288, spine/jumpcuts-final.json)
        → holds to the next join or 2:59.8
2:57.4  [LIGHTLEAK] F7 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 5288,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
2:57.8  SAY:  "So why not just cancel it, you say?"
2:57.9  [MUSIC] Bed B row 7: a bar-aligned jump back to bar 7 (master bars 7-36) under 'So why not just cancel it, you say?', SUBTLE
        -18 dB (a row change inside ONE track, 0.08 s fade on the outgoing row)
2:59.8  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.50s)
2:59.8  [CHART] C7 'Who owns the debt' IN (Type 1, animated in CODE, gold) → 3:15.2: STATE 1, the bar splits 'Inside the US 77%'
        vs 'Foreign 23%', landing on 'U.S.' (183.34) `[VERIFY next TIC release]`; WARNING 2 held
3:00.1  SAY:  "Because around three quarters of it is owned inside the US"
3:04.0  [CHART] C7 STATE 2: the 77% segment breaks up; 'The Fed 11%' lights on 'the Fed' (184.44)
3:04.0  SAY:  "To the Fed, to the Social Security trust funds, to American banks, pension funds,"
3:05.8  [CHART] C7 'Social Security and other trust funds 19%' lights
3:07.9  [CHART] C7 chip 'US banks' lights
3:09.2  [CHART] C7 chip 'pension funds' lights
3:10.0  [CHART] C7 chip 'insurers' lights
3:10.0  SAY:  "insurance companies, and regular savers."
3:11.4  [CHART] C7 chip 'households' lights on 'regular savers'
3:12.1  [CHART] C7 STATE 3: the foreign segment isolates on 'China, you ask?'
3:12.1  SAY:  "China, you ask?"
3:13.9  [CHART] C7 the 'China 1.5%' sliver lights on 'Around 1.5 percent' `[VERIFY next TIC release]`
3:13.9  SAY:  "Around 1.5 percent."
3:15.2  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.50s) (face pick)
3:15.2  [FACE] F8 IN → 3:22.7 (7.5 s, one interior join)
3:15.2  [CAPTION] ON → 3:22.7 (F8, face hold over 5 s)
3:15.2  SAY:  "Cancel this debt and we'd be canceling it on ourselves."
3:18.0  [PUNCH-IN] F8 hard ~15-20% step IN ON the desilencer join 197.967 (frame 5906, spine/jumpcuts-final.json)
        → holds to the next join or 3:22.7
3:18.0  [LIGHTLEAK] F8 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 5906,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
```

## CH3 - HOW YOU INFLATE A DEBT AWAY (3:18.4-5:19.7, Bed B SUBTLE, card OFF; gear 2, slow)
```
3:18.4  SAY:  "But there's a third way out."
3:20.8  SAY:  "And America has actually used it before."
3:22.7  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.50s) (the face cut is the image ingress, one shared cut)
3:22.7  [IMAGE] IMG-9 1946 street IN → 3:25.8: plays the Seedance i2v clip img/IMG-9-1946-street.mp4 (480p, 5.04 s, no audio,
        upscaled, from clip 0, cut at 3.1 s; Mike approved 2026-10-29); the still img/IMG-9-1946-street.png is the fallback and the
        frame a transition pulls
3:23.1  SAY:  "In 1946, right after World War II, the debt held by the public was 106 percent of the whole economy."
3:25.8  [CHART] C2 'The WWII playbook' IN (Type 1, animated line in CODE, gold) → 3:45.8: STATE 1, the axes draw (debt held by the
        public as % of GDP, 1946 to 1974) → hand:xfade-scale (container-xfade, 0.40s)
3:28.8  [CHART] C2 the 1946 point '106.3%' pops on 'economy.'
3:29.7  SAY:  "Still the record."
3:30.6  [CHART] C2 the label 'still the record' on 'record.'
3:31.6  [CHART] C2 STATE 2: the band 'Long-term rates capped at 2.5% (1942 to 1951)' fills, landing on '2.5 percent' (217.46)
3:31.6  SAY:  "And starting in 1942, the Fed capped the interest rate on long-term government bonds at around 2.5 percent."
3:39.2  SAY:  "Then prices took off."
3:40.4  SAY:  "In March of 1947, inflation hit 19.7 percent."
3:42.9  [CHART] C2 STATE 3: the marker 'Inflation +19.7% (March 1947)' pops on 'inflation hit 19.7', landing 225.00; the line stays at
        the 1946 point
3:45.8  [CONTAINER] card-3.1 IN (card-slides/card-3.1-s1.png, gold) → 3:52.3: 'Bonds paid: 2.5%' ON → hand:xfade-scale (container-xfade, 0.40s)
3:45.8  SAY:  "So if you held those bonds, you earned 2.5 percent a year, while prices went up almost 20 percent."
3:49.8  [CONTAINER] card-3.1-s2: 'Prices rose: 19.7%' ON
3:52.3  [CHART] C2 RETURNS, STATE 4 (a continuation) → 3:59.0: the line DRAWS down from 1946, 234.42 → 238.08, to the 1974 point
        '22.2%' on '22 percent': a LEVEL, never a 22-point drop → hand:xfade-scale (container-xfade, 0.40s)
3:52.4  SAY:  "Growth helped too."
3:54.0  SAY:  "But by 1974, that debt was down around 22 percent of the economy."
3:58.9  SAY:  "And today, that same measure is around 98 percent, which is pretty damn close to the record."
3:59.0  [TRANSITION] cover→face cut-in F9 → hand:film-burn (face-cut, 0.50s) (face pick)
3:59.0  [FACE] F9 IN → 4:05.3 'around 98 percent, which is pretty damn close to the record' (6.3 s; no interior join: NO punch,
        NO leak); never on one axis with the 133 / 116 total-debt figures
3:59.0  [CAPTION] ON → 4:05.3 (F9, face hold over 5 s)
4:05.3  [TRANSITION] face→cover F9 out → hand:film-burn (face-cut, 0.50s)
4:05.3  [VIDEO] BR-8 empty street IN (vid/BR-8-empty-street-2020.mp4, 3.7 s) → 4:09.0: the era cut before the 2020 timeline
4:05.5  SAY:  "So after that, it happened again in 2020."
4:09.0  [DIAGRAM] T2 'THE 2020 RERUN' IN (diagrams/T2-dim.png, gold, Type 2 still) → 4:27.6: four nodes on one line, all dimmed;
        the push travels node to node → hand:xfade-scale (container-xfade, 0.40s)
4:09.0  SAY:  "In March of 2020, the Fed cut rates to zero, and they stayed there for two years."
4:11.9  [DIAGRAM] T2-zero: 'March 2020: rates to zero' lights on 'zero'
4:13.9  [DIAGRAM] T2-hike: 'March 2022: first hike, two years at zero' lights on 'two years'
4:15.1  SAY:  "Then inflation hit 9.1 percent in June of 2022."
4:15.9  [DIAGRAM] T2-cpi: 'June 2022: inflation 9.1%' lights on '9.1'; WARNING 2 held (zero for two years, THEN 9.1)
4:17.9  [MUSIC] Bed B row 8: a jump back to bar 5 (master bars 5-39), a quiet 2-bar re-entry, SUBTLE -18 dB; CLIP-5's 13.8 s plays
        ducked inside this row
4:19.4  SAY:  "And the total debt measured against the economy fell from around 133 percent to around 116 percent by early 2023."
4:22.6  [DIAGRAM] T2-debt-133: 'Total debt 133% of GDP (2020 Q2)' lights on '133'
4:24.2  [DIAGRAM] T2-debt-116: '116% (2023 Q1)' lights on '116'
4:27.6  [IMAGE] IMG-3 shrinking piggy bank IN (img/IMG-3-shrinking-piggy-bank.png, 3.8 s) → 4:31.4: under 'Financial repression.'
        (glitch ingress → lib:turbulent-h-2x (glitch-still, 0.32s))
4:27.6  SAY:  "Economists have a name for this."
4:29.7  SAY:  "Financial repression."
4:31.4  [DIAGRAM] C1 'How a debt gets inflated away' IN (diagrams/C1-dim.png, gold, Type 2 still, the video's centerpiece) → 4:41.4:
        the full diagram lands on 'Here's how it works', every node dimmed · [TRANSITION] MARQUEE SPIN candidate (the new facet: the
        mechanism itself) → lib:spin-3d-side-ease-up (SPIN-newfacet, 0.88s) §4 · [ACCENT] timpani clicker b (accents/accent-timpani-clicker-01-b.wav, mood_class
        neutral; measured peak 0.04 s, -40 dB ring 1.62 s) file start 270.26: the centerpiece lands
4:31.4  SAY:  "Here's how it works."
4:32.6  SAY:  "The interest you get paid stays below inflation."
4:34.1  [DIAGRAM] C1-rates: 'Rates held under inflation (1942: 2.5% cap · 2020: zero)' lights on 'below inflation'
4:35.4  SAY:  "So every year, the debt is worth a little less in real money."
4:37.9  [DIAGRAM] C1-real-value: 'Real value of the debt shrinks' lights on 'a little less in real money'
4:39.6  SAY:  "And so are your savings."
4:40.5  [DIAGRAM] C1-who-pays: 'Who pays: savers · wage earners · bondholders' lights on 'your savings'; 'Who wins' stays dim
4:41.4  [RECEIPT] C25 IN (receipts/C25-bis-wp363-abstract.png, the WIDE crop) → 4:49.4: BIS Working Paper 363, 09 December 2011,
        settles under the two names (Carmen Reinhart, Belen Sbrancia) · treatment: highlight → hand:xfade-scale (container-xfade, 0.40s)
4:41.4  SAY:  "Two economists, Carmen Reinhart and Belen Sbrancia, wrote that it works best with a steady dose of inflation."
4:45.6  [RECEIPT] C25 tight crop (receipts/C25-bis-wp363-abstract-tight.png): push onto the sentence · [HIGHLIGHT] wipe 'financial
        repression is most successful in liquidating debts when accompanied by a steady dose of inflation' landing on 'steady dose
        of inflation' (287.34-288.84)
4:49.4  [DIAGRAM] C1 CALLBACK (diagrams/C1-all-lit.png) → 4:54.4: the full diagram returns with EVERY node lit for the rewatch line
        (a declared DIAGRAM_REFS state; the second and last C1 spot) → lib:melt-rgb-soft-short-1 (MELT-transform, 0.60s)
4:49.4  SAY:  "And if that was a bit complex, feel free to go back a few seconds, because I get it."
4:54.4  [VIDEO] BR-9 couple counting cash IN (vid/BR-9-couple-counting-cash.mp4, 4.0 s) → 4:58.4: the literal for 'the savers' → hand:fade (broll-fade, 0.50s)
4:54.4  SAY:  "So who pays for it?"
4:56.0  SAY:  "The savers."
4:57.3  SAY:  "People living on a paycheck."
4:58.4  [CONTAINER] C1-breakout IN (card-slides/C1-breakout-s1.png, gold, the declared who-pays / who-wins pair) → 5:03.4: 'People on a
        paycheck' ON → hand:xfade-scale (container-xfade, 0.40s)
4:59.1  [CONTAINER] C1-breakout-s2: 'Bondholders' ON
4:59.1  SAY:  "Anyone holding bonds."
5:00.7  SAY:  "And who wins?"
5:00.8  [CONTAINER] C1-breakout-s3: 'Who wins: Asset owners' ON on 'who wins', held through 'owns the asset'
5:02.0  SAY:  "Whoever owns the asset."
5:03.4  [VIDEO] BR-10 NYC ticker IN (vid/BR-10-nyc-market-ticker.mp4, 2.9 s) → 5:06.2: random tickers, atmosphere only (visual-qa) → hand:fade (broll-fade, 0.50s)
5:03.4  SAY:  "In America, in the US, the top 10 percent own around 88 percent of stocks and mutual funds."
5:06.2  [CONTAINER] card-4.5 IN (card-slides/card-4.5-s1.png, gold) → 5:13.6: 'Top 10%: 88% of stocks and funds' ON (never 'all stocks') → hand:xfade-scale (container-xfade, 0.40s)
5:10.3  [CONTAINER] card-4.5-s2: 'Bottom 50%: 0.6%' ON
5:10.3  SAY:  "The bottom half owns only 0.6 percent."
5:13.6  [TRANSITION] cover→face cut-in F10 → hand:film-burn (face-cut, 0.50s) (face pick)
5:13.6  [FACE] F10 IN → 5:33.1 (19.4 s, four interior joins; the CH3 / CH4 seam is on camera)
5:13.6  [CAPTION] ON → 5:33.1 (F10, face hold over 5 s)
5:13.7  SAY:  "Inflation doesn't hit people the same way."
5:16.0  SAY:  "It moves wealth from the people who save to the people who own."
5:19.1  [PUNCH-IN] F10 hard ~15-20% step IN ON the desilencer join 319.100 (frame 9540, spine/jumpcuts-final.json)
        → holds to the next join or 5:33.1
5:19.1  [LIGHTLEAK] F10 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 9540,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
```

## CH4 - THE BOND MARKET SAYS NO (5:19.7-7:07.5, Bed B, PUSH #1 at 5:42.8, card OFF; gear 2 rising)
```
5:19.7  SAY:  "But here's the thing."
5:20.6  SAY:  "The people lending America this money can see all of this too."
5:23.4  [PUNCH-IN] F10 hard ~15-20% step back OUT to the base frame ON the desilencer join 323.433 (frame 9670, spine/jumpcuts-final.json)
        → holds to the next join or 5:33.1
5:23.4  [LIGHTLEAK] F10 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 9670,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
5:24.1  SAY:  "And the price they charge gets set in one place."
5:27.1  SAY:  "The market for US bonds."
5:27.8  [PUNCH-IN] F10 hard ~15-20% step IN ON the desilencer join 327.833 (frame 9802, spine/jumpcuts-final.json)
        → holds to the next join or 5:33.1
5:27.8  [LIGHTLEAK] F10 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 9802,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
5:28.5  SAY:  "Just in September, Fed Chair Kevin Warsh explained why that market matters so much."
5:32.5  [PUNCH-IN] F10 hard ~15-20% step back OUT to the base frame ON the desilencer join 332.533 (frame 9943, spine/jumpcuts-final.json)
        → holds to the next join or 5:33.1
5:32.5  [LIGHTLEAK] F10 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 9943,
        screen blend under the captions → lib:lightleaks-soft-short-7 (punch-leak, 0.40s) (punch-leak)
5:33.1  [TRANSITION] face→cover F10 out → hand:film-burn (face-cut, 0.50s) (it IS the CLIP-5 insert-in: FACE 10 ends 0.09 s before the splice)
5:33.1  [CONTAINER] CLIP-5 LEAD-IN → 5:33.2: the clip's FIRST frame (Warsh at the FOMC podium, caption 'Fed Chair Kevin Warsh,
        Sept 16, 2026') as the insert-in frame itself; the set-up line was on camera, so no held still is needed (no build)
5:33.2  [INSERT] CLIP-5 SPLICED CLIP, 13.8 s (clip-inserts/CLIP-5-warsh-10yr.mp4): the spine PAUSES at the trough after 'much.'
        (333.16; the trough to 'Think' is 0.20 s, the tightest of the four, the snapper decides) and the clip plays FULL-FRAME with
        Kevin Warsh's OWN voice ('...the most important asset anywhere in the world, the 10-year Treasury...'), caption burned on
        the bottom band; Bed B ducks -14 dB under it automatically; [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert)
5:33.2  [CONTAINER] CLIP-5 LEAD-OUT → 5:36.0: the clip's LAST frame held as a still under 'Think of it as the price under every other
        price.' → hand:fade (insert-in, 0.50s)
5:33.4  SAY:  "Think of it as the price under every other price."
5:36.0  [DIAGRAM] C23 'The price under every price' IN (diagrams/C23-hub.png, gold, Type 2 still) → 5:42.8: the hub '10-year
        Treasury' and the Warsh quote strip 'the most important asset anywhere in the world'; no figures → hand:xfade-scale (container-xfade, 0.40s)
5:36.0  SAY:  "When it goes up, mortgages go up."
5:37.4  [DIAGRAM] C23-mortgage: '30-year mortgage' lights on 'mortgages go up'
5:37.4  [MUSIC] Bed B row 9: the 2-bar pre-chorus SWELL (master bars 40-41) on the bar line 5:37.4 (MUSIC-PLAN hard hit 337.43;
        bar-exact in the MIX with CLIP-5's pause counted) · [IMPACT] layer: none (the swell is the build into PUSH #1)
5:38.6  [DIAGRAM] C23-business: 'Business loans' lights
5:38.6  SAY:  "Business loans go up."
5:40.2  SAY:  "And the government's own borrowing costs go up."
5:40.5  [DIAGRAM] C23-gov-debt: 'New government debt' lights; 'Stock prices' stays dashed and dim (never said to go up)
5:42.8  [VIDEO] BR-11 red bear candles IN (vid/BR-11-red-bear-candles.mp4, 3.2 s) → 5:46.0: a HARD fast cut on PUSH #1 → hand:cut (broll-cut, 0.00s)
5:42.8  [MUSIC] PUSH #1: the CHORUS (bar 42, drums) lands on 'So' of 'So what do lenders do?', -15 dB under (MUSIC-PLAN hard hit
        342.76); Mike speeds up here · [IMPACT] Boom Big Reveal short (Boom - Big Reveal-short.wav, mood_class epic; measured peak
        0.04 s, -40 dB ring 1.00 s) file start 341.62: lands with the drop on the cut, under the VO
5:42.8  SAY:  "So what do lenders do?"
5:44.4  SAY:  "They ask for more."
5:46.0  [RECEIPT] C9 IN (receipts/C9-tradingview-us10y-monthly.png) → 5:55.7: TradingView US 10-year, MONTHLY 1998 to 2026, the 2002
        peak and the 2026 spike both on screen; a wide establish under 'The yield is just the interest rate...' · treatment: push
        `[VERIFY]` → hand:xfade-scale (container-xfade, 0.40s)
5:46.0  SAY:  "The yield is just the interest rate the government pays to borrow."
5:49.2  [RECEIPT] C9 daily crop (receipts/C9-tradingview-us10y-daily-oct5.png): push onto the Mon 05 Oct 26 crosshair, legend
        C 5.307%, landing on '5.31' (352.04)
5:49.2  SAY:  "And on October 5th, the 10-year yield closed at 5.31 percent, the highest since 2002."
5:53.6  [RECEIPT] C9 monthly crop again: push onto the 2026 spike against the 2002 peak on 'the highest since 2002' (353.60-355.18)
5:55.7  [CHART] C8 'The lenders say no' IN (Type 1, animated bars in CODE, gold) → 6:05.3: 'US 10-year 5.31% (highest since 2002)'
        already up; source line Treasury par curve · Reuters/LSEG · Japan MOF → hand:xfade-scale (container-xfade, 0.40s)
5:55.7  SAY:  "And it's not just in America."
5:57.7  SAY:  "In Britain, the 30-year went above 6 percent for the first time since 1998."
5:59.1  [CHART] C8 'UK 30-year 6.03% (intraday), first above 6% since 1998' grows on 'above 6 percent'
6:02.0  SAY:  "In Japan, the 30-year hit a record high."
6:04.1  [CHART] C8 'Japan 30-year 4.168% (a record)' grows on 'record high'
6:05.3  [CONTAINER] card-5.1 IN (card-slides/card-5.1-s1.png, gold) → 6:11.9: 'Warsh's 3 reasons', the items resting → hand:xfade-scale (container-xfade, 0.40s)
6:05.3  SAY:  "Kevin Warsh gave his own reasons."
6:07.0  SAY:  "A strong economy."
6:07.2  [CONTAINER] card-5.1-s2: 'Strong economy' ON
6:08.2  [CONTAINER] card-5.1-s3: 'Competition for capital' ON on 'AI companies are competing'
6:08.2  SAY:  "AI companies are competing for the same money."
6:10.8  SAY:  "And geopolitics."
6:11.0  [CONTAINER] card-5.1-s4: 'Geopolitics' ON
6:11.9  [TRANSITION] cover→face cut-in F11 → hand:film-burn (face-cut, 0.50s) (face pick)
6:11.9  [FACE] F11 IN → 6:16.7 "But my read is a little bit simpler. The lenders can do the math on $40 trillion too." (4.8 s;
        under 5 s, no captions; Mike's opinion, said as his)
6:12.0  SAY:  "But my read is a little bit simpler."
6:14.1  SAY:  "The lenders can do the math on $40 trillion too."
6:14.8  [MUSIC] Bed B row 11: the chorus-thinning bar (master bar 67) on '...$40 trillion too.', -17 dB under, the file's own way out
        of the chorus
6:16.0  [PUNCH-IN] F11 hard ~15-20% step IN ON the desilencer join 376.033 (frame 11248, spine/jumpcuts-final.json)
        → holds to the next join or 6:16.7
6:16.0  [LIGHTLEAK] F11 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 11248,
        screen blend under the captions → lib:lightleaks-soft-short-9 (punch-leak, 0.40s) (punch-leak)
6:16.7  [TRANSITION] face→cover F11 out → hand:film-burn (face-cut, 0.50s)
6:16.7  [VIDEO] BR-12 for-sale sign IN (vid/BR-12-for-sale-sign.mp4, 2.2 s) → 6:18.8: the literal for 'your house'
6:17.0  SAY:  "And that lands on your house."
6:17.4  [MUSIC] Bed B row 12: the verse plateau re-enters (master bars 7-33), SUBTLE -18 dB, on 'And that lands on your house';
        CLIP-4 plays ducked inside this row
6:18.8  [RECEIPT] C16 IN (receipts/C16-freddie-mac-pmms.png, the WIDE crop) → 6:24.7: Freddie Mac PMMS, 'U.S. weekly mortgage rate
        averages as of 10/29/2026', the 30-year FRM panel · treatment: push `[VERIFY PMMS Thursday value]` → hand:xfade-scale (container-xfade, 0.40s)
6:18.8  SAY:  "The average 30-year mortgage is around 7.3 percent, near the highest since late 2023."
6:20.7  [RECEIPT] C16 tight crop (receipts/C16-freddie-mac-pmms-tight.png): push onto the rate on '7.3 percent' (380.70), settle
        through 'near the highest since late 2023'; the panel reads 7.24% under the VO's 'around 7.3' (Mike's call: the 10/22
        release, 7.32%, is the exact-match swap)
6:24.7  [TRANSITION] cover→face cut-in F12 → hand:film-burn (face-cut, 0.50s) (face pick)
6:24.7  [FACE] F12 IN → 6:32.5 (7.8 s, two interior joins; the cut to cover falls inside '$6 billion', the audio runs on)
6:24.7  [CAPTION] ON → 6:32.5 (F12, face hold over 5 s)
6:24.7  SAY:  "The Treasury tried to help too."
6:25.9  [PUNCH-IN] F12 hard ~15-20% step IN ON the desilencer join 385.867 (frame 11543, spine/jumpcuts-final.json)
        → holds to the next join or 6:32.5
6:25.9  [LIGHTLEAK] F12 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 11543,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
6:26.6  SAY:  "They stepped up, buying back its long-term bonds from about $2 billion per operation"
6:31.5  SAY:  "to $6 billion in a market of around $32 trillion."
6:31.8  [PUNCH-IN] F12 hard ~15-20% step back OUT to the base frame ON the desilencer join 391.767 (frame 11720, spine/jumpcuts-final.json)
        → holds to the next join or 6:32.5
6:31.8  [LIGHTLEAK] F12 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 11720,
        screen blend under the captions → lib:lightleaks-soft-short-7 (punch-leak, 0.40s) (punch-leak)
6:32.5  [TRANSITION] face→cover F12 out → hand:film-burn (face-cut, 0.50s)
6:32.5  [RECEIPT] C18 IN (receipts/C18-treasury-buybacks-2026-10-01.png, the WIDE crop) → 6:38.5: fiscaldata Buyback Operations,
        the 10/01/2026 10Y to 20Y row boxed (46,391,000,000.00 offered / 6,000,000,000.00 accepted) as '$6 billion' finishes ·
        treatment: push `[VERIFY]`; WARNING 2 held (2 to 6 per operation)
6:33.5  [RECEIPT] C18 tight crop (receipts/C18-treasury-buybacks-2026-10-01-tight.png): push onto '$6,000,000,000.00 accepted', held
        through 'Then Treasury Secretary Scott Bessent went on'
6:35.8  SAY:  "Then Treasury Secretary Scott Bessent went on CNBC in September"
6:38.5  [CONTAINER] CLIP-4 LEAD-IN → 6:42.3: the clip's FIRST frame (Bessent on the Squawk Box set, top caption band 'Scott Bessent
        on CNBC, Sept 21, 2026', the CNBC chyron clear) held as a still under 'CNBC in September and explained why he raised the
        size.' (no build) → hand:fade (container-xfade, 0.50s)
6:39.7  SAY:  "and explained why he raised the size."
6:42.3  [INSERT] CLIP-4 SPLICED CLIP, 17.6 s EXTENDED window (clip-inserts/CLIP-4-bessent-equilibrium.mp4; Mike 2026-10-29 ruling 3):
        the spine PAUSES at the trough after 'size.' (402.34; the trough to 'That's' is 0.40 s) and the clip plays FULL-FRAME with
        Scott Bessent's OWN voice ('...I can't set the equilibrium price, but markets are never in equilibrium. ... I thought that
        they were moving away.'), caption burned on the top band; Bed B ducks -14 dB automatically; WARNING 3 held (his exact
        words); [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert)
6:42.3  [CONTAINER] CLIP-4 LEAD-OUT → 6:47.7: the clip's LAST frame held under the whole resume line; his frozen face carries
        'telling you he can't set the price' → hand:fade (insert-in, 0.50s)
6:42.7  SAY:  "That's the man in charge of America's debt telling you he can't set the price."
6:47.7  [RECEIPT] C13 IN (receipts/C13-fomc-sept-16-statement.png, the WIDE crop) → 6:54.8: the federalreserve.gov FOMC statement,
        September 16, 2026, settling on the decision paragraph under 'Right now, the Fed is going the other way' (end the crop at
        Last Update, visual-qa) · treatment: highlight `[VERIFY the Oct 27-28 FOMC outcome]` → hand:xfade-scale (container-xfade, 0.40s)
6:48.0  SAY:  "Right now, the Fed is going the other way."
6:50.8  [RECEIPT] C13 tight crop (receipts/C13-fomc-sept-16-statement-tight.png): push · [HIGHLIGHT] wipe 'raise the target range for
        the federal funds rate by 1/4 percentage point to 3-3/4 to 4 percent' landing on 'raised rates' (412.06)
6:50.8  SAY:  "In September, it raised rates because inflation is too high."
6:53.2  [RECEIPT] C13 tight · [HIGHLIGHT] the second wipe 'Inflation remains elevated.' on 'inflation is too high'
6:54.8  [CONTAINER] card-6.2 IN (card-slides/card-6.2-s1.png, gold) → 7:01.9: '1942: the Fed holds the 2.5% cap' lights on '1942'
        (415.34) → hand:xfade-scale (container-xfade, 0.40s)
6:54.8  SAY:  "But in 1942, and again in 2020, when a crisis hit,"
6:57.2  [CONTAINER] card-6.2-s2: '2020: the Fed buys at least 500B of Treasuries' ON; both stay lit through 'bought government bonds'
6:59.3  SAY:  "the Fed stepped in and bought government bonds."
7:01.9  [TRANSITION] cover→face cut-in F13 → hand:film-burn (face-cut, 0.50s) (face pick)
7:01.9  [FACE] F13 IN → 7:12.5 (10.6 s, two interior joins; the CH4 / CH5 seam is on camera)
7:01.9  [CAPTION] ON → 7:12.5 (F13, face hold over 5 s)
7:02.0  SAY:  "And to do that again at this size, you really need a reason to do that."
7:06.6  [PUNCH-IN] F13 hard ~15-20% step IN ON the desilencer join 426.567 (frame 12764, spine/jumpcuts-final.json)
        → holds to the next join or 7:12.5
7:06.6  [LIGHTLEAK] F13 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 12764,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
```

## CH5 - THE EXCUSE: A RESET (7:07.5-9:38.1, Bed B, PUSH #2 at 9:16.2, card OFF; gear 2 with gear 3 spikes)
```
7:07.5  SAY:  "Right, so here's the problem with inflating away debt."
7:11.0  SAY:  "People actually notice."
7:11.8  [PUNCH-IN] F13 hard ~15-20% step back OUT to the base frame ON the desilencer join 431.800 (frame 12921, spine/jumpcuts-final.json)
        → holds to the next join or 7:12.5
7:11.8  [LIGHTLEAK] F13 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 12921,
        screen blend under the captions → lib:lightleaks-soft-short-9 (punch-leak, 0.40s) (punch-leak)
7:12.5  [TRANSITION] face→cover F13 out → hand:film-burn (face-cut, 0.50s)
7:12.5  [VIDEO] BR-13 grocery receipt IN (vid/BR-13-grocery-receipt.mp4, 3.4 s, in-point at the clip's HEAD: its first second is
        the frown, visual-qa) → 7:15.9: 'Prices go up. Savers get angry.'
7:12.8  SAY:  "Prices go up."
7:14.2  SAY:  "Savers get angry."
7:15.9  [CONTAINER] card-7.3 IN (card-slides/card-7.3.png, gold) → 7:21.6: 'Inflation on purpose: people get angry' on 'Voters get
        angry' → hand:xfade-scale (container-xfade, 0.40s)
7:15.9  SAY:  "Voters get angry."
7:16.6  [MUSIC] Bed B row 13: a jump back to bar 8 (master bars 8-33), SUBTLE -18 dB; CLIP-6 plays ducked inside this row (see the
        open decision on CLIP-4's extended 17.6 s)
7:17.7  SAY:  "But inflation in the middle of a disaster feels a little bit different."
7:21.6  [IMAGE] IMG-4 rescue helicopter IN (img/IMG-4-rescue-helicopter.png, 2.2 s) → 7:23.9: a hit on 'rescue' (glitch ingress
        → lib:turbulent-v-1x (glitch-still, 0.28s))
7:21.6  SAY:  "It looks like the cost of a rescue."
7:23.9  [CONTAINER] card-7.1 IN (card-slides/card-7.1-s1.png, gold) → 7:28.8: '1940s: the war' ON → hand:xfade-scale (container-xfade, 0.40s)
7:23.9  SAY:  "In the 1940s, it was the war."
7:26.5  [CONTAINER] card-7.1-s2: '2020: the pandemic' ON; WARNING 4 held (never 'the cost of winning the war' on screen)
7:26.5  SAY:  "In 2020, it was the pandemic."
7:28.8  [CONTAINER] card-7.2 IN (card-slides/card-7.2-s1.png, gold) → 7:35.0: 'June 3, 2020' lit → hand:xfade-scale (container-xfade, 0.40s)
7:28.8  SAY:  "And in June of 2020, in the middle of that crisis,"
7:32.8  SAY:  "the founder of the World Economic Forum, Klaus Schwab,"
7:33.6  [CONTAINER] card-7.2-s2: 'The World Economic Forum launches the Great Reset' ON on 'World Economic Forum'
7:35.0  [CONTAINER] CLIP-6 LEAD-IN → 7:39.1: the clip's FIRST frame (Schwab at the launch session, caption 'Klaus Schwab, World
        Economic Forum, June 3, 2020') held as a still under '...launched something he called the Great Reset.' (no build) → hand:fade (container-xfade, 0.50s)
7:36.7  SAY:  "launched something he called the Great Reset."
7:39.1  [INSERT] CLIP-6 SPLICED CLIP, 13.8 s (clip-inserts/CLIP-6-schwab-reset.mp4): the spine PAUSES at the trough after 'Reset.'
        (459.08; the trough to 'He' is 0.28 s) and the clip plays FULL-FRAME with Klaus Schwab's OWN voice ('In short, we need a
        great reset. ... We must not miss this unique window of opportunity.'), caption burned on the bottom band; Bed B ducks
        -14 dB automatically; WARNING 4 held (his own words only); [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert)
7:39.1  [CONTAINER] CLIP-6 LEAD-OUT → 7:41.7: the clip's LAST frame held as a still under 'He was talking about the pandemic.' → hand:fade (insert-in, 0.50s)
7:39.4  SAY:  "He was talking about the pandemic."
7:41.7  [RECEIPT] C10 IN (receipts/C10-schwab-project-syndicate-tight.png) → 7:45.1: Project Syndicate 'Time for a Great Reset',
        Jun 3, 2020, KLAUS SCHWAB, a settling push · [HIGHLIGHT] wipe 'the pandemic represents a rare but narrow window of
        opportunity to reflect, reimagine, and reset our world' landing on 'rare but narrow window' (462.92-464.22) · treatment:
        highlight → hand:xfade-scale (container-xfade, 0.40s)
7:41.7  SAY:  "In writing, he called it the rare but narrow window of opportunity."
7:45.1  [TRANSITION] cover→face cut-in F14 → hand:film-burn (face-cut, 0.50s) (face pick)
7:45.1  [FACE] F14 IN → 7:56.9 (11.8 s, four interior joins)
7:45.1  [CAPTION] ON → 7:56.9 (F14, face hold over 5 s)
7:45.4  SAY:  "Crisis as an opportunity, right?"
7:48.5  SAY:  "So that's the mindset you're going to have to consider here"
7:50.2  [PUNCH-IN] F14 hard ~15-20% step IN ON the desilencer join 470.233 (frame 14074, spine/jumpcuts-final.json)
        → holds to the next join or 7:56.9
7:50.2  [LIGHTLEAK] F14 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 14074,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
7:51.2  SAY:  "that we're probably going to have to worry about a bit."
7:52.6  [PUNCH-IN] F14 hard ~15-20% step back OUT to the base frame ON the desilencer join 472.567 (frame 14144, spine/jumpcuts-final.json)
        → holds to the next join or 7:56.9
7:52.6  [LIGHTLEAK] F14 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 14144,
        screen blend under the captions → lib:lightleaks-soft-short-7 (punch-leak, 0.40s) (punch-leak)
7:53.5  SAY:  "So what could that crisis be?"
7:54.3  [PUNCH-IN] F14 hard ~15-20% step IN ON the desilencer join 474.333 (frame 14197, spine/jumpcuts-final.json)
        → holds to the next join or 7:56.9
7:54.3  [LIGHTLEAK] F14 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 14197,
        screen blend under the captions → lib:lightleaks-soft-short-9 (punch-leak, 0.40s) (punch-leak)
7:55.5  SAY:  "So here's how it could go."
7:56.0  [PUNCH-IN] F14 hard ~15-20% step back OUT to the base frame ON the desilencer join 476.033 (frame 14248, spine/jumpcuts-final.json)
        → holds to the next join or 7:56.9
7:56.0  [LIGHTLEAK] F14 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 14248,
        screen blend under the captions → lib:lightleaks-soft-short-7 (punch-leak, 0.40s) (punch-leak)
7:56.9  [TRANSITION] face→cover F14 out → hand:film-burn (face-cut, 0.50s)
7:56.9  [VIDEO] BR-14 tanker at dusk IN (vid/BR-14-tanker-dusk-aerial.mp4, 2.4 s) → 7:59.3: the cut into 'Number one, energy.'
7:57.1  SAY:  "Number one, energy."
7:59.3  [RECEIPT] C26 IN (receipts/C26-eia-brent-spot-table.png, the WIDE crop; the TradingView chart fell back to the EIA daily
        table) → 8:08.3: 'Europe Brent Spot Price FOB (Dollars per Barrel)', establish under 'The war with Iran started on
        February 28th' (never 'world war'), then push onto the boxed Feb-27 71.32 on '$71' (484.14) · treatment: push `[VERIFY]` → hand:xfade-scale (container-xfade, 0.40s)
7:59.3  SAY:  "The war with Iran started on February 28th."
8:02.3  SAY:  "The global oil price went from around $71 a barrel to as high as $138."
8:06.4  [RECEIPT] C26 tight crop (receipts/C26-eia-brent-spot-table-tight.png): push onto the boxed Apr-7 139.31 on 'as high as $138'
        (486.96)
8:08.3  [VIDEO] BR-15 layoff box IN (vid/BR-15-layoff-box.mp4, 3.4 s) → 8:11.7: 'Number two, AI.' → hand:fade (broll-fade, 0.50s)
8:08.3  SAY:  "Number two, AI."
8:10.3  SAY:  "In 2026, AI is the top reason companies give for layoff."
8:11.7  [RECEIPT] C27 IN (receipts/C27-challenger-sept-2026.png, the portrait page 3) → 8:18.6: the Challenger Report, September
        2026, shown as an OBJECT under 'AI is the top reason companies give for layoff' · treatment: pan · [MOTION]
        lib:motion-3d-pan-1-down (down the portrait page) → hand:xfade-scale (container-xfade, 0.40s)
8:12.2  [MUSIC] Bed B row 14: a jump back to bar 18 (master bars 18-39), SUBTLE -18 dB, the build arriving under the ad-lib block
8:14.8  [RECEIPT] C27 tight crop (receipts/C27-challenger-sept-2026-tight.png): cut to 'WHY ARE COMPANIES CUTTING?', a settling push ·
        [HIGHLIGHT] '120,136 job cut announcements' landing on '120,000' (495.10), then 'it remains the leading reason
        year-to-date' · treatment: highlight; WARNING 4 held (never 'millions')
8:14.8  SAY:  "Around 120,000 announced job cuts through September."
8:18.6  [IMAGE] IMG-5 phone fingerprint IN (img/IMG-5-phone-fingerprint.png, 3.9 s) → 8:22.5: the 'people say' rumour line (glitch
        ingress → lib:turbulent-h-2x (glitch-still, 0.32s))
8:18.6  SAY:  "And you'll hear people say that a reset brings digital money and a digital ID."
8:22.5  [CONTAINER] card-8.3 IN (card-slides/card-8.3-s1.png, gold) → 8:31.4: eyebrow WHAT'S ACTUALLY REAL, the body resting → hand:xfade-scale (container-xfade, 0.40s)
8:23.5  SAY:  "Here's what's actually real."
8:25.0  [CONTAINER] card-8.3-s2: 'EU: a digital ID wallet by the end of 2026' ON on 'Europe'
8:25.0  SAY:  "Europe has to offer a digital wallet by the end of 2026."
8:29.3  SAY:  "Using it is voluntary."
8:30.2  [CONTAINER] card-8.3-s3: 'Voluntary to use' ON; WARNING 4 held (digital ID stated precisely)
8:31.4  [RECEIPT] C21 IN (receipts/C21-un-sdg-16-9-tight.png) → 8:37.7: the sdgs.un.org Target 16.9 card, a settling push ·
        [HIGHLIGHT] 'By 2030, provide legal identity for all, including birth registration' landing on 'legal identity' (513.36),
        held through 'It says nothing about digital money.' · treatment: highlight → hand:xfade-scale (container-xfade, 0.40s)
8:31.4  SAY:  "The UN's 2030 goal is a legal identity for everyone."
8:35.5  SAY:  "It says nothing about digital money."
8:37.7  [RECEIPT] C20 IN (receipts/C20-eo-14178-header.png) → 8:46.9: the whitehouse.gov executive order page, 'STRENGTHENING
        AMERICAN LEADERSHIP IN DIGITAL FINANCIAL TECHNOLOGY', January 23, 2025, the long document shown as an OBJECT under 'a
        January 2025 executive order' · treatment: pan · [MOTION] lib:motion-3d-offset-2-right-up (end above the sliced (i)
        line, visual-qa) → hand:xfade-scale (container-xfade, 0.40s)
8:37.7  SAY:  "And in the US, a January 2025 executive order"
8:42.0  [RECEIPT] C20 Sec. 5 tight crop (receipts/C20-eo-14178-sec5-tight.png): cut to Sec. 5, a settling push · [HIGHLIGHT]
        'agencies are hereby prohibited from undertaking any action to establish, issue, or promote CBDCs' landing on 'central
        bank digital currency' (524.74) · treatment: highlight
8:42.0  SAY:  "bans federal agencies from creating a central bank digital currency."
8:46.9  [VIDEO] BR-16 laptop at night IN (vid/BR-16-laptop-night.mp4, 3.8 s) → 8:50.7: the 526.88-555.78 ad-lib block (KEPT, Mike's
        plan-gate ruling 2) is covered as ATMOSPHERE plus the two 'reported' receipts below; nothing states it as our fact → hand:fade (broll-fade, 0.50s)
8:46.9  SAY:  "And one thing I've noticed,"
8:48.0  SAY:  "as I've been making this video over the last few days,"
8:50.7  [VIDEO] BR-17 convoy (vid/BR-17-convoy-lead.mp4, 4.7 s, lead:true, the one leading-motion exception) → 8:55.4: 'announcements by
        the US military, for example' (visual-qa: reads as CGI and snowy, flagged to Mike) → hand:fade (broll-fade, 0.50s)
8:51.3  SAY:  "there have been announcements by the US military, for example,"
8:55.4  [RECEIPT] R-GRID-X IN ⛔ NOT CAPTURED YET → 8:58.3: the X post Mike pointed to (x.com/BullTheoryio/status/2115770713768345607)
        under 'of preparations for a long-term war and power outages', with an 'AS REPORTED' strip (code-drawn), never our claim
        (Mike's plan-gate ruling 2, 2026-10-29) · treatment: push · FALLBACK while it is uncaptured: BR-18 substation
        (vid/BR-18-substation-dusk.mp4, 2.9 s) plays this exact slot → hand:fade (container-xfade, 0.50s)
8:55.4  SAY:  "of preparations for a long-term war and power outages"
8:58.3  [RECEIPT] R-GRID-NEWS IN ⛔ NOT CAPTURED YET → 9:01.5: one mainstream article (NY Post or Fox News) on the grid / outage
        preparations, its headline as an OBJECT under 'and the electrical grid going down'; 'AS REPORTED' strip · treatment: pan ·
        [MOTION] lib:motion-3d-pan-2-left · FALLBACK while it is uncaptured: IMG-6 skyline blackout (img/IMG-6-skyline-blackout.png,
        3.2 s, glitch ingress) → hand:xfade-scale (container-xfade, 0.40s)
8:59.5  SAY:  "and the electrical grid going down."
9:01.5  [VIDEO] BR-19 EU flags IN (vid/BR-19-eu-flags.mp4, 3.6 s) → 9:05.2: 'The same thing has been going on in Europe' → hand:fade (broll-fade, 0.50s)
9:01.5  SAY:  "The same thing has been going on in Europe and everybody's talking about it."
9:05.2  [VIDEO] BR-20 empty boardroom IN (vid/BR-20-empty-boardroom.mp4, 2.1 s) → 9:07.3: under the WARNING 4 AT RISK line 'So I
        wonder what they have planned.' (OPEN for Mike): an empty room, no text, no claim → hand:fade (broll-fade, 0.50s)
9:05.2  SAY:  "So I wonder what they have planned."
9:07.3  [DIAGRAM] MAP IN (diagrams/MAP-base.png, gold, Type 2 still) → 9:15.8: eyebrow MIKE'S READ over the dot map, three labelled
        nodes dim, no claim text → hand:xfade-scale (container-xfade, 0.40s)
9:07.3  SAY:  "There's currently no extreme hostilities with China or Russia."
9:09.7  [DIAGRAM] MAP-china: 'China' lights
9:10.7  [DIAGRAM] MAP-russia: 'Russia' lights
9:10.8  [MUSIC] Bed B row 15: the 2-bar SWELL (master bars 40-41) on the bar line 9:10.8 (MUSIC-PLAN hard hit 550.83) · [IMPACT]
        layer: none (the swell is the build; the riser at 9:16.2 rides its last second)
9:11.8  SAY:  "And Iran certainly can't do any of that."
9:12.2  [DIAGRAM] MAP-iran: 'Iran' lights; holds through 'So it's really curious.'
9:14.6  SAY:  "So it's really curious."
9:15.8  [DIAGRAM] C19 'HOW IT COULD GO (a scenario)' IN (diagrams/C19-dim.png, gold, Type 2 still, the A SCENARIO pill) → 9:28.1:
        the header and every node land dimmed · [TRANSITION] MARQUEE MELT candidate (the map transforms into the scenario loop)
        → lib:melt-rgb-soft-1 (MELT-transform, 0.84s) §4 · its SFX MIX -9 dB (`sfx_rel_db`, Mike draft note 2026-10-30: too loud)
9:16.2  [MUSIC] PUSH #2: the CHORUS (bar 42) lands on 'So' of 'So here's the scenario that I'm concerned about', -15 dB under
        (MUSIC-PLAN hard hit 556.16) · [RISER→IMPACT] tension rise 3, 1 s cut (risers/Tension_Rise_Logo_Reveal_3-1s.wav,
        mood_class tense) CUT ON its measured peak 0.73 s, file start 555.43, so the build ENDS on the drop · [IMPACT] card impact
        layered (Impacts/card-impact-layered.wav, mood_class epic; measured peak 0.03 s, -40 dB ring 1.14 s) file start 556.13
9:16.2  SAY:  "So here's the scenario that I'm concerned about."
9:18.7  [DIAGRAM] C19-debt: 'Debt too big to pay' lights
9:18.7  SAY:  "The debt gets too big to pay."
9:20.9  [DIAGRAM] C19-crisis: 'A crisis hits (energy · AI jobs)' lights
9:20.9  SAY:  "A crisis hits."
9:22.2  [DIAGRAM] C19-printing: 'Printing to buy the bonds' lights with the precedent tags '1940s' and '2020'
9:22.2  SAY:  "The printers turn on to buy the bonds."
9:25.0  [DIAGRAM] C19-rescue: 'Called a rescue' lights; the outcome node stays dashed and dim (he says it on FACE 15)
9:25.0  SAY:  "And then all of that gets called a rescue."
9:28.1  [TRANSITION] cover→face cut-in F15 → hand:film-burn (face-cut, 0.50s) (face pick)
9:28.1  [FACE] F15 IN → 9:42.2 (14.1 s, two interior joins; the CH5 / CH6 seam is on camera)
9:28.1  [CAPTION] ON → 9:42.2 (F15, face hold over 5 s)
9:28.2  SAY:  "And when all of that is over, the debt is smaller"
9:31.5  SAY:  "and your savings is smaller."
9:34.2  SAY:  "But the people who own assets are a whole lot richer."
9:37.0  [PUNCH-IN] F15 hard ~15-20% step IN ON the desilencer join 577.033 (frame 17278, spine/jumpcuts-final.json)
        → holds to the next join or 9:42.2
9:37.0  [LIGHTLEAK] F15 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 17278,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
9:37.5  [MUSIC] Bed B row 17: the chorus thinning (master bars 67-68) under 'a whole lot richer' and the CH6 opener, -17 dB
```

## CH6 - WHERE BILLIONAIRES GET MADE (9:38.1-11:42.8, Bed B, the BRAAM beat at 10:15.0, PUSH #3 at 11:18.3, card OFF; gear 2 to 3)
```
9:38.1  SAY:  "So now let's take a look at what happened the last time"
9:40.5  SAY:  "money got printed into a crisis."
9:41.2  [PUNCH-IN] F15 hard ~15-20% step back OUT to the base frame ON the desilencer join 581.233 (frame 17404, spine/jumpcuts-final.json)
        → holds to the next join or 9:42.2
9:41.2  [LIGHTLEAK] F15 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 17404,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
9:42.2  [TRANSITION] face→cover F15 out → hand:film-burn (face-cut, 0.50s)
9:42.2  [RECEIPT] C28 IN (receipts/C28-fred-walcl-2019-2022-page.png, the full FRED page) → 9:47.0: WALCL, Total Assets of the
        Federal Reserve, 2019-01-01 to 2022-12-31, the real Fed ledger shown as an OBJECT under 'The Fed's balance sheet,' ·
        treatment: pan · [MOTION] lib:motion-3d-orbit-2-left-up `[VERIFY]`
9:42.5  [MUSIC] Bed B row 18: the verse re-enters (master bars 6-39 in ONE continuous run), SUBTLE -18 dB; the braam beat pause at
        10:15.0 sits inside this row (2 bars long, see the open decisions)
9:42.7  SAY:  "The Fed's balance sheet,"
9:44.1  [RECEIPT] C28 graph crop (receipts/C28-fred-walcl-2019-2022.png): settle on the curve, around 4.1M to 9.0M (FRED's unit is
        millions, so trillions) on 'basically everything it bought with brand new money' · treatment: push
9:44.1  SAY:  "basically everything it bought with brand new money,"
9:47.0  [CHART] C17 'Printing into a crisis' IN (Type 1, animated count-ups in CODE, gold) → 10:00.7: STATE 1, 'Fed balance sheet'
        counts 4.16T up · [TRANSITION] MARQUEE MELT candidate (the real FRED curve melts into our count-up) → lib:melt-rgb-soft-3 (MELT-transform, 0.84s) §4
9:47.0  SAY:  "went from around $4.2 trillion to around $9 trillion,"
9:49.5  [CHART] C17 lands '8.97T' on '$9 trillion'
9:50.9  SAY:  "more than double in two years."
9:51.3  [CHART] C17 the tag 'more than double, Feb 2020 to Apr 2022' on 'double'
9:53.6  [CHART] C17 STATE 2: 'Money supply (M2)' counts 0 up
9:53.6  SAY:  "The money supply, all the dollars sitting in cash and in bank accounts,"
9:58.5  SAY:  "grew by 40%."
9:59.2  [CHART] C17 lands '+40.6%' on '40%'
10:00.7  [RECEIPT] C22 IN (receipts/C22-forbes-2021-billionaires.png) treatment: push (near-static full-frame hold, no 3D pan: Mike draft note 2026-10-30) → 10:07.7: the Forbes 'World's Billionaires List: Facts And
        Figures 2021' article (Kerry A. Dolan, Apr 6, 2021), its title shown as an OBJECT, held FULL FRAME as a plain screenshot (no 3D pan: Mike draft note 2026-10-30, the pan froze mid-move between
        two articles), quiet hand:xfade-scale in (container-xfade, 0.40s)
10:00.7  SAY:  "And in 2021, Forbes counted a record 2,755 billionaires"
10:07.7 [CHART] C17 RETURNS, STATE 3 (a continuation) → 10:15.3: 'Billionaire wealth' counts 8T up to 13.1T (lands 608.36-610.02)
        with the tag '2,755 billionaires, a record (Forbes 2021)' → hand:xfade-scale (container-xfade, 0.40s)
10:07.7 SAY:  "worth $13.1 trillion."
10:11.4 [CHART] C17 the start value '8T (2020 list)' is called out on 'A year earlier'
10:11.4 SAY:  "A year earlier, that list was worth $8 trillion."
10:15.0 [BRAAM] braam horn stinger a (braams/braam-horn-stinger-02-a.wav, mood_class epic; measured peak 0.50 s, -40 dB end 5.36 s)
        BETWEEN sentences, after '...that list was worth $8 trillion.' with the C17 figures on screen: spine pause 5.33 s at
        615.04 (the trough before 'Nearly'; 5.33 s = exactly 2 bars of Bed B), ZOOM to "13.1T" (an eased push over exactly the
        pause frames, the figure to frame centre at about 2.4x, held into the cut); the bed plays on, no duck
10:15.3 [VIDEO] BR-21 private jet IN (vid/BR-21-jet-nose-golden.mp4, 3.5 s) → 10:18.7: punctuation only (the 493 already landed in CH1)
        → hand:fade (broll-fade, 0.50s)
10:15.3 SAY:  "Nearly 500 of them were brand new billionaires."
10:18.7 [CONTAINER] card-9.1 IN (card-slides/card-9.1-s1.png, gold) → 10:29.4: 'Top 0.1%: 11.7% to 13.8% of US wealth', subline '2020
        to 2021', the figure at the SOURCED 11.7% (never the VO's 11.1) → hand:xfade-scale (container-xfade, 0.40s)
10:18.7 SAY:  "And the top 0.1% of Americans"
10:21.4 SAY:  "went from owning 11.1% of all household wealth"
10:25.7 SAY:  "to 13.8% in under two years."
10:26.4 [CONTAINER] card-9.1 count-up: the frames card-9.1-n118 → card-9.1-n137 (11.8% to 13.7%, one per 0.1 step, about 1.7
        frames each) across 626.42-627.54 on 'to 13.8%'
10:27.5 [CONTAINER] card-9.1-s2: 13.8% landed, 'to 13.8%' lit
10:29.4 [TRANSITION] cover→face cut-in F16 → hand:film-burn (face-cut, 0.50s) (face pick)
10:29.4 [FACE] F16 IN → 10:34.6 (5.2 s, one interior join)
10:29.4 [CAPTION] ON → 10:34.6 (F16, face hold over 5 s)
10:29.5 SAY:  "As you can see, printing into a crisis doesn't make everyone rich."
10:33.1 SAY:  "It just makes the owners rich."
10:33.6 [PUNCH-IN] F16 hard ~15-20% step IN ON the desilencer join 633.567 (frame 18974, spine/jumpcuts-final.json)
        → holds to the next join or 10:34.6
10:33.6 [LIGHTLEAK] F16 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 18974,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
10:34.6 [TRANSITION] face→cover F16 out → hand:film-burn (face-cut, 0.50s)
10:34.6 [RECEIPT] C29 IN (receipts/C29-tradingview-btcusd-2020-2021.png) → 10:48.3: TradingView BTCUSD weekly (Coinbase), Jan 2020 to
        Jan 2022, a wide establish on 'And crypto?' · treatment: push `[VERIFY]`
10:35.1 SAY:  "And crypto?"
10:36.4 SAY:  "Bitcoin went from $4,980 in March of 2020"
10:37.5 [RECEIPT] C29 FRED crop (receipts/C29-fred-cbbtcusd-mar2020.png): push onto the DATE/VALUE table, the boxed 2020-03-12
        4980.00 row on '$4,980' (637.50)
10:41.0 SAY:  "to $67,510 in November of 2021, around a 13.6x."
10:41.8 [RECEIPT] C29 FRED crop (receipts/C29-fred-cbbtcusd-nov2021.png): the same page with a different row boxed (a two-step push,
        visual-qa): 2021-11-08 67510.06 on '$67,510' (641.76)
10:46.1 [RECEIPT] C29 weekly crop again: the whole 2020 to 2021 run for 'around a 13.6x' (646.52), settling
10:48.3 [CONTAINER] card-9.3 IN (card-slides/card-9.3-s1.png, gold) → 10:57.2: resting → hand:xfade-scale (container-xfade, 0.40s)
10:48.3 SAY:  "And by 2022, Forbes counted a record 19 crypto billionaires,"
10:51.3 [CONTAINER] card-9.3-s2: 'Crypto billionaires: 19, a record' lights on 'record', subline 'Forbes 2022'; nobody is named
10:53.9 SAY:  "seven more than the previous year."
10:56.0 SAY:  "Here's why."
10:57.2 [VIDEO] BR-22 dollar printing IN (vid/BR-22-dollar-printing.mp4, 4.0 s) → 11:01.2: 'When they print, the dollars multiply.'
        → hand:fade (broll-fade, 0.50s)
10:57.2 SAY:  "When they print, the dollars multiply."
11:00.0 SAY:  "Scarce assets can't."
11:01.2 [RECEIPT] C30 IN (receipts/C30-bitcoin-core-amount-h.png, the WIDE crop) → 11:07.7: the GitHub code view of Bitcoin Core
        src/consensus/amount.h, settling on 'Bitcoin has a hard cap' (661.96) · treatment: highlight `[VERIFY]` → hand:xfade-scale (container-xfade, 0.40s)
11:02.0 SAY:  "Bitcoin has a hard cap of 21 million coins."
11:03.1 [RECEIPT] C30 tight crop (receipts/C30-bitcoin-core-amount-h-tight.png): push · [HIGHLIGHT] line 26 'inline constexpr CAmount
        MAX_MONEY{21 000 000 * COIN};' landing on '21 million' (663.82), held through 'written right into the code' (666.88)
11:05.7 SAY:  "It's written right into the code."
11:07.7 [VIDEO] BR-23 Fed seal macro IN (vid/BR-23-fed-seal-macro.mp4, 2.6 s) → 11:10.2: 'The Fed has no cap at all.' → hand:fade (broll-fade, 0.50s)
11:07.7 SAY:  "The Fed has no cap at all."
11:10.2 [IMAGE] IMG-7 Kaspa coin IN (img/IMG-7-kaspa-coin.png, 3.5 s, the persona's greenish-cyan, the real mirrored-K mark) →
        11:13.7 (glitch ingress → lib:turbulent-h-3x (glitch-still, 0.36s)); framed as his holding by the VO, never a recommendation
11:10.2 SAY:  "And Kaspa has a max supply of 28.7 billion coins."
11:13.2 [MUSIC] Bed B row 19: the 2-bar SWELL (master bars 40-41) runs into PUSH #3 (MUSIC-PLAN hard hit 673.17) · [IMPACT] layer:
        none (the swell is the build)
11:13.7 [CONTAINER] card-10.3 IN (card-slides/card-10.3.png, Kaspa teal #0E7A6C, the one accent exception) → 11:18.3: 'Kaspa: 28.7B
        max supply' / 'Around 97% already mined' `[VERIFY live]` → hand:xfade-scale (container-xfade, 0.40s)
11:14.8 SAY:  "And around 97% of them are already mined."
11:18.3 [TRANSITION] cover→face cut-in F17 → hand:film-burn (face-cut, 0.50s) (face pick)
11:18.3 [FACE] F17 IN → 11:32.6 the thesis, first person and conditional (14.4 s, two interior joins; the four 'very' restored)
11:18.3 [CAPTION] ON → 11:32.6 (F17, face hold over 5 s)
11:18.3 [MUSIC] PUSH #3: the CHORUS (bar 42) lands EXACTLY on 'So' of 'So here's my bet' (678.30, Mike 2026-10-29) and runs 24 bars
        through CH7, -15 dB under (MUSIC-PLAN hard hit 678.30) · NO impact here (REMOVED, Mike draft note 2026-10-30:
        the hit on 'So here's my bet' goes; the chorus drop alone carries the thesis)
11:18.3 SAY:  "So here's my bet."
11:19.4 SAY:  "If everything plays out the way I think it will,"
11:22.3 SAY:  "then the printers are going to turn back on."
11:23.3 [PUNCH-IN] F17 hard ~15-20% step IN ON the desilencer join 683.300 (frame 20466, spine/jumpcuts-final.json)
        → holds to the next join or 11:32.6
11:23.3 [LIGHTLEAK] F17 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 20466,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
11:24.6 SAY:  "And the people who own scarce assets before that happens"
11:28.0 SAY:  "come out the other end very, very, very, very rich."
11:31.5 [PUNCH-IN] F17 hard ~15-20% step back OUT to the base frame ON the desilencer join 691.533 (frame 20713, spine/jumpcuts-final.json)
        → holds to the next join or 11:32.6
11:31.5 [LIGHTLEAK] F17 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 20713,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
11:32.6 [TRANSITION] face→cover F17 out → hand:film-burn (face-cut, 0.50s)
11:32.6 [IMAGE] IMG-8 penthouse dawn IN (img/IMG-8-penthouse-dawn.png, 3.9 s) → 11:36.6: PUSH #3's thesis line (the face cut is the
        ingress)
11:32.7 SAY:  "And that's why I believe there's going to be a huge wave"
11:35.2 SAY:  "of crypto billionaires starting next year."
11:36.6 [CONTAINER] card-10.4 IN (card-slides/card-10.4.png, gold) → 11:42.8: 'My bet: crypto billionaires get made next year' (the
        thesis kept as his opinion on screen) → hand:xfade-scale (container-xfade, 0.40s)
11:38.0 SAY:  "And I think the number of crypto billionaires"
11:40.1 SAY:  "is probably going to multiply dramatically."
```

## CH7 - THE CLOSE (11:42.8-12:28.2, Bed B, PUSH #3 continues to the last word, card OFF; gear 3)
```
11:42.8 [CONTAINER] card-11.1 IN (card-slides/card-11.1-s1.png, gold, the nutshell) → 11:59.0: row 1 '40T+ and growing 6.7B a day'
        lights on 'nutshell' (703.26) `[VERIFY live total]` → hand:xfade-scale (container-xfade, 0.40s)
11:42.8 SAY:  "So in a nutshell, the debt is over $40 trillion"
11:45.1 SAY:  "and growing by about $6.7 billion a day."
11:48.8 SAY:  "The president said inflation will pay it off."
11:48.8 [CONTAINER] card-11.1-s2: the quote line 'Inflation will also pay off that debt', verbatim WITH 'also' (never the VO's
        wording; WARNING 1)
11:52.2 [CONTAINER] card-11.1-s3: 'Done before: the 1940s and 2020'
11:52.2 SAY:  "It's been done before, after World War II, and in 2020."
11:56.9 [CONTAINER] card-11.1-s4: 'Savers paid. Owners won.'
11:56.9 SAY:  "Savers paid, owners won."
11:59.0 [TRANSITION] cover→face cut-in F18 → hand:film-burn (face-cut, 0.50s) (face pick)
11:59.0 [FACE] F18 IN → 12:28.2 EOF (29.2 s, two interior joins; the end gesture between 'well prepared' and 'coming reset' kept)
11:59.0 [CAPTION] ON → 12:28.2 (F18, face hold over 5 s)
11:59.1 SAY:  "Don't be a saver who gets inflated away."
12:01.9 SAY:  "Own the things they can't print."
12:02.7 [PUNCH-IN] F18 hard ~15-20% step IN ON the desilencer join 722.700 (frame 21648, spine/jumpcuts-final.json)
        → holds to the next join or 12:28.2
12:02.7 [LIGHTLEAK] F18 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 21648,
        screen blend under the captions → lib:lightleaks-soft-6 (punch-leak, 1.44s) (punch-leak)
12:04.0 SAY:  "And if you liked this video, I would appreciate it"
12:06.3 SAY:  "if you hit that like button and subscribe button."
12:08.6 SAY:  "Comment below, let me know what you think."
12:10.3 SAY:  "Give me some activity on this video."
12:11.8 SAY:  "The algorithm loves it."
12:13.7 [CTA] LT-LINK lower-third 'LINK IN THE DESCRIPTION' (code-drawn, light theme, gold rule, no asset file) → 12:22.2 over F18
        under the community plug, seated ABOVE the caption line (captions stay the topmost layer); the spoken plug never says the
        link, so this is its only carrier (persona)
12:13.7 SAY:  "Not only that, I do have a wonderful crypto group"
12:16.6 SAY:  "of like-minded people who invest in assets,"
12:20.1 SAY:  "like the ones I'm talking about and more."
12:22.5 [MUSIC] Bed B row 21: the verse cut's 2-bar turnaround (no drums) under 'And we are well prepared for this coming reset.',
        -17 dB: the pull-back before the hit (MUSIC-PLAN hard hit 742.50) · [IMPACT] layer: none (the pull-back is the move)
12:22.7 SAY:  "And we are well prepared for this coming reset."
12:26.3 [PUNCH-IN] F18 hard ~15-20% step back OUT to the base frame ON the desilencer join 746.267 (frame 22355, spine/jumpcuts-final.json)
        → holds to the next join or 12:28.2
12:26.3 [LIGHTLEAK] F18 lib:lightleaks-* (the video's rotated set of 3-4, usage slot face_leak) peaking ON frame 22355,
        screen blend under the captions → lib:lightleaks-soft-8 (punch-leak, 1.44s) (punch-leak)
12:27.7 SAY:  "Catch you guys later."
12:27.8 [MUSIC] the verse cut's BANG lands on 'la-' of 'later.' (747.98), the ring cut by the mixer's 0.2 s end fade (MUSIC-PLAN hard hit
        747.80) · [IMPACT] layer: none (the track's own BANG ends the video)
12:28.2 [END] HARD OUT on 'later.' (748.16), 0.04 s before the spine end: no end card, no held still, no transition out
```

---

## SFX layer (audio post-mix, mix_music.py; NOT in the comp)
Picked from the catalogs (`video-creation/assets/sfx/*/library.json` + the loose root rows), every tail MEASURED with ffmpeg
(10 ms RMS envelope; the catalog's own `tail_sec` is the 30 dB point, so the 40 dB point was measured fresh). Fewer, bigger:
9 sounds in 12:28, every one under the VO except the braam, which owns its own spine pause.
| at | type | file (mood_class) | measured peak / ring to -40 dB | why |
|---|---|---|---|---|
| 0:26.3 | ACCENT | accents/accent-timpani-clicker-01-a.wav (neutral) | 0.05 s / 1.78 s | C4 lands the 40 trillion, the first number |
| 1:02.8 | IMPACT | Impacts/Impact_Hit_01-2-short.wav (epic) | 0.13 s / 0.42 s | 'ON PURPOSE?' slams in inside Bed A's dip |
| 1:39.2 | IMPACT (card) | Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (neutral) | 0.09 s / 1.08 s | the CH2 card, the shortest tail in the kit |
| 4:31.4 | ACCENT | accents/accent-timpani-clicker-01-b.wav (neutral) | 0.04 s / 1.62 s | the C1 centerpiece diagram lands |
| 5:42.8 | IMPACT | Boom - Big Reveal-short.wav (epic) | 0.04 s / 1.00 s | PUSH #1 drop + the BR-11 hard cut |
| 9:16.2 | RISER→IMPACT | risers/Tension_Rise_Logo_Reveal_3-1s.wav (tense), cut on its peak 0.73 s → Impacts/card-impact-layered.wav (epic) | 0.73 s / cut · 0.03 s / 1.14 s | PUSH #2 drop + the C19 scenario loop |
| 10:15.0 | BRAAM | braams/braam-horn-stinger-02-a.wav (epic) | 0.50 s / 5.36 s (spine pause 5.33 s) | the record 2,755 billionaires at 13.1T, between sentences |
| ~~11:18.3~~ | ~~IMPACT~~ | REMOVED (Mike draft note 2026-10-30) | | was PUSH #3 'So here's my bet' |
Every other MUSIC-PLAN hard hit (10.70, 40.70, 58.70, 64.70, 66.70, 98.85, 337.43, 550.83, 673.17, 742.50, 747.80) is the
bed's own bar-line move (entrance, peak, dip, swell, BANG, pull-back) and carries `[IMPACT] layer: none`: the music IS the hit.
No vibe-cut duck: MUSIC-PLAN carries none, and the one conviction drop (PUSH #3) is a music ENTRANCE that a duck would fight.
Types weighed and left out (mood gate: the register is a calm-teacher warning with epic CH1 / pushes, never horror):
- **downshifters** (tense): the 9 to 11 s rings would sit under three or four slow explainer lines; the bed's own thinning
  bars (67-68) already do the comedown after each push.
- **drones** (tense): the only slow-burn setup is the unsourced 526.88-555.78 ad-lib (WARNING 4 AT RISK); a bed of unease
  there would dramatize unsourced claims, and the bed's own build into the swell carries it.
- **whooshes** (loose `Cinematic Whoosh 02/06`, `transition_rapid_whoosh`): every cover change carries its TRANSITIONS.md move,
  and the library transitions bring their own peak-levelled SFX; a whoosh on top would double them.
- **dings** (`ding/`): the one reveal a ding suits is the Kaspa coin, where it would read as a pick (persona: never a
  recommendation); `dramatic-shocked` is dark.
- **dark risers** (`creepy-orchestral-rise`, `dsgn-rise-elevenlabs`): mood_class dark, out of register.
- **sudden-shock** (tense): no one-line twist calls for a jolt; 'China, you ask? Around 1.5 percent.' is a calm beat.
- **cash-register accents** (hype): a money gag would cheapen a serious debt explainer.
- **kinetic-text sounds / devices**: the SCREENPLAY names no `kt-*` device, so none is placed.
- **textures**: the kit has no texture folder yet.
- **halloween-2022**: wrong register.

## Orphan reconciliation (every file in assets/, by id; `.html` / `.py` / `.md` sources are exempt, comp-build.md §10)
**PLACED (timecodes above):**
- vid ×22: BR-1 · BR-2 · BR-3 · BR-4 · BR-5 · BR-6 · BR-8 · BR-9 · BR-10 · BR-11 · BR-12 · BR-13 · BR-14 · BR-15 · BR-16 · BR-17 ·
  BR-19 · BR-20 · BR-21 · BR-22 · BR-23, plus BR-18 as the FALLBACK of R-GRID-X at 8:55.4 (it moves to BENCH the day the X
  post is captured). No BR-7: Envato had no clean 1946 street, IMG-9 took the slot (Mike 2026-10-29).
- img ×10 files: IMG-1 · IMG-2 · IMG-3 · IMG-4 · IMG-5 · IMG-7 · IMG-8 · IMG-9-1946-street.mp4 (the slot plays this motion
  clip) · IMG-9-1946-street.png (the fallback and the transition still), plus IMG-6 as the FALLBACK of R-GRID-NEWS at 8:58.3
  (BENCH once the article is captured).
- clip-inserts ×4: CLIP-1-trump-inflation · CLIP-5-warsh-10yr · CLIP-4-bessent-equilibrium · CLIP-6-schwab-reset.
- receipts: C3-time-trump-inflation + C3-time-trump-inflation-tight · C24-bls-cpi-sept-2026-tight · C5-debt-to-the-penny +
  C5-debt-to-the-penny-tight · C25-bis-wp363-abstract + C25-bis-wp363-abstract-tight · C9-tradingview-us10y-monthly +
  C9-tradingview-us10y-daily-oct5 · C16-freddie-mac-pmms + C16-freddie-mac-pmms-tight · C18-treasury-buybacks-2026-10-01 +
  C18-treasury-buybacks-2026-10-01-tight · C13-fomc-sept-16-statement + C13-fomc-sept-16-statement-tight ·
  C10-schwab-project-syndicate-tight · C26-eia-brent-spot-table + C26-eia-brent-spot-table-tight · C27-challenger-sept-2026 +
  C27-challenger-sept-2026-tight · C21-un-sdg-16-9-tight · C20-eo-14178-header + C20-eo-14178-sec5-tight ·
  C28-fred-walcl-2019-2022-page + C28-fred-walcl-2019-2022 · C22-forbes-2021-billionaires · C29-tradingview-btcusd-2020-2021 +
  C29-fred-cbbtcusd-mar2020 + C29-fred-cbbtcusd-nov2021 · C30-bitcoin-core-amount-h + C30-bitcoin-core-amount-h-tight.
- diagrams (Type 2 stills, one row per state): T1-dim · T1-ww2 · T1-y2020 · T2-dim · T2-zero · T2-hike · T2-cpi · T2-debt-133 ·
  T2-debt-116 · C1-dim · C1-rates · C1-real-value · C1-who-pays · C1-all-lit · C23-hub · C23-mortgage · C23-business ·
  C23-gov-debt · MAP-base · MAP-china · MAP-russia · MAP-iran · C19-dim · C19-debt · C19-crisis · C19-printing · C19-rescue.
- card-slides (one row per state): H4-s1 · H4-s2 · H4-s3 · H3 · H2 · card-1.1+1.2-s1 · card-1.1+1.2-s2 · card-2.1-s1 ·
  card-2.1-s2 · card-2.2-s1 · card-2.2-s2 · card-3.1-s1 · card-3.1-s2 · C1-breakout-s1 · C1-breakout-s2 · C1-breakout-s3 ·
  card-4.5-s1 · card-4.5-s2 · card-5.1-s1 · card-5.1-s2 · card-5.1-s3 · card-5.1-s4 · card-6.2-s1 · card-6.2-s2 · card-7.3 ·
  card-7.1-s1 · card-7.1-s2 · card-7.2-s1 · card-7.2-s2 · card-8.3-s1 · card-8.3-s2 · card-8.3-s3 · card-9.1-s1 · card-9.1-s2 ·
  card-9.3-s1 · card-9.3-s2 · card-10.3 · card-10.4 · card-11.1-s1 · card-11.1-s2 · card-11.1-s3 · card-11.1-s4.
- card-9.1 count-up frames, all 20 placed at 10:26.4 in order: card-9.1-n118 · card-9.1-n119 · card-9.1-n120 · card-9.1-n121 ·
  card-9.1-n122 · card-9.1-n123 · card-9.1-n124 · card-9.1-n125 · card-9.1-n126 · card-9.1-n127 · card-9.1-n128 ·
  card-9.1-n129 · card-9.1-n130 · card-9.1-n131 · card-9.1-n132 · card-9.1-n133 · card-9.1-n134 · card-9.1-n135 ·
  card-9.1-n136 · card-9.1-n137.
- title-slides: title-CH2 (the video's only chapter card).
- charts (Type 1, animated in CODE): C4 · H5 · C6 · C7 · C2 · C8 · C17, placed as code charts.

**BENCH (built, QA-passed, deliberately not on screen; swap-ins if a placed crop fails at the draft):**
- C24-bls-cpi-sept-2026.png BENCH: the wide slices Table A's bottom row; the tight carries the title and the highlighted sentence, and the highlight lands 0.8 s after the cut.
- C10-schwab-project-syndicate.png BENCH: the 3.4 s slot fits one crop; the tight carries headline, date, byline and the sentence.
- C21-un-sdg-16-9.png BENCH: the wide slices the 16.7 / 16.b neighbour cards and shows no UN header; the tight is the whole Target 16.9 card.
- C20-eo-14178-sec5.png BENCH: superseded by the -tight re-crop (the line after Sec. 7 is sliced).
- C29-tradingview-btcusd-daily-nov2021.png BENCH: its crosshair reads 67,555.94 against the VO's 67,510; the FRED row matches exactly.

**REJECTED as held stills (the chart-builder's DESIGN STATES for the code-animated Type 1 charts; comp-build §7 forbids holding a
chart PNG, so the comp animates these in code and the PNGs are the spec):**
- C4-start · C4-mid · C4-payoff · H5-start · H5-mid · H5-payoff REJECTED as stills (spec for C4 / H5).
- C6-start · C6-took-in · C6-spent · C6-borrowed · C6-interest · C6-big-five-mid · C6-big-five REJECTED as stills (spec for C6).
- C7-start · C7-split · C7-fed · C7-trust · C7-rest · C7-china REJECTED as stills (spec for C7).
- C2-axes · C2-1946 · C2-cap · C2-1947 · C2-draw-mid · C2-1974 REJECTED as stills (spec for C2).
- C8-us · C8-uk · C8-japan REJECTED as stills (spec for C8).
- C17-start · C17-fed · C17-m2 · C17-wealth-start · C17-wealth · C17-wealth-8t REJECTED as stills (spec for C17).

**PLANNED, NOT ON DISK (Mike's plan-gate ruling 2, 2026-10-29):** R-GRID-X (the X post x.com/BullTheoryio/status/2115770713768345607)
and R-GRID-NEWS (one NY Post or Fox News article) for the grid-outage ad-lib; receipt-capturer has not captured them.

## Open decisions that move a cue
1. **R-GRID-X / R-GRID-NEWS were never captured.** Mike ruled at the plan gate that the grid-outage ad-lib is covered with the X
   post + one mainstream article, wording 'reported'. Slots planned at 8:55.4-8:58.3 and 8:58.3-9:01.5 (where 'power outages
   and the electrical grid going down' is said); until they exist BR-18 and IMG-6 air there. Capture both (and add their
   CHART-SOURCE INDEX rows) before the build, or Mike waives them.
2. **MUSIC-PLAN vs the pauses.** (a) CLIP-4 is now the 17.6 s extended window, but MUSIC-PLAN still carves the CH4 row
   (377.43-436.71) for 12.8 s: the row plays 4.8 s further into the file, so its splice at 436.63 is no longer bar-exact
   in the mix (pushes stay anchored by their own source_in). (b) The braam beat pause (5.33 s at 615.04) sits inside the
   CH6 row (582.50-673.17): it is exactly 2 bars, so the music planner shifts that row's source_in back 2 bars (bar 6 → bar 4,
   file 10.60) and every landing holds. Both are music-strategist edits, no picture cue moves.
3. **C16 reads 7.24% under 'around 7.3 percent'.** Mike's call: keep (accepted as 'around') or swap to the 10/22 release
   (7.32%) with its date in frame.
4. **card-9.1 shows the sourced 11.7%; the VO says 11.1%** (618.74). The card keeps the sourced figure unless Mike rules
   otherwise.
5. **Captions** over the CH2-CH7 camera holds over 5 s (F6 to F18): planned ON (house default); no ruling recorded.
6. **WARNING 4 AT RISK at 9:05.2** ('So I wonder what they have planned.'): covered by BR-20, no text; Mike may cut it.
7. **BR-17 reads as CGI and snowy** (visual-qa): swap only if Mike wants live action.
8. **LT-LINK** (12:13.7-12:22.2): planned because the spoken plug never says 'the link in the description'; drop if Mike
   does not want a lower-third over F18.
