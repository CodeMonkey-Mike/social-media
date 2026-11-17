# AI destroying lives - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)
_Format owner: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1 (shape: `skills/doc-reference/EDIT-PLAN.reference.md`). Code gate: `lint_edit_plan.py`. Per the §0 ORDER note the comp is built TO this log; the render confirms it, it never discovers what is missing._

> AUTHORED 2026-11-11 by edit-plan-author, refining the graph's seed (`_previews/EDIT-PLAN.seed.md`, gen_editplan.py) with
> AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Decisions + Open flags) + the word-cued states in
> `assets/slide-sources/_state-cues.md` and the ANIMATION SPEC blocks of `assets/charts/*.html` + `assets/diagrams/*.html` +
> `spine/jumpcuts-final.json` (face joins, frame-exact).
> Watch file: `spine/ALL.e.cut.enhanced.mp4` (475.30 s / 7:55.3, 30 fps). Word cues: `spine/ALL.e.cut.enhanced.medium-words.json`.
> Timecodes = FINAL-spine seconds, PRE-PAUSE (no chain shift re-applied). No title cards (one bed, every chapter card OFF), so the
> only pauses are the clip inserts, which the comp's sh() adds: the montage 67.9 s at 0.10, CLIP-21 7.6 s at 128.68, CLIP-61 5.7 s
> (measured on the captured file; COVER-PLAN estimated 6.0) at 369.59, the CLIP-42 / 40 / 51 run 23.8 s at 403.41, CLIP-44 23.6 s at
> 416.91 (128.6 s in all). Delivered = about 10:04, plus the 3.0 s end-card hold past the last word (MUSIC-PLAN end_card_hold, to
> spine 478.27) = about 10:07.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (reconciled 2026-11-11).
> SAY lines = the as-recorded words, one sentence per line at its first word's onset, with every AS-RECORDED mishear fix applied
> (24.32-30.78 is a Whisper hallucination: the transcriber's re-listened words and onsets are used there).
> ZERO ORPHANS: every renderable in `assets/` is PLACED on a timecoded row below or marked BENCH (reconciliation at the end).
> RULINGS honored (PROJECT-LOG): ONE song (`leatherface`), and NO impact, riser, boom or braam anywhere (Mike's brief: slow,
> sparse SFX, nothing epic; MUSIC-PLAN asks for none), so every MUSIC-PLAN hard hit is a `[MUSIC]` move the file makes by itself;
> the SFX layer is ONE accent (7:08.1). Captions ON over FACE holds over 5 s only (F1, F4, F5), never over a cover. The mid-roll
> plug is COVER only, no SFX, no bed change. Face transitions = the video's face pick in TRANSITIONS.md (soft, per the brief).
> Every receipt row carries `treatment:` (29 rows: 5 pan, 10 highlight, 14 push). No kinetic-text (`kt-`) device is named in SCREENPLAY.md; the one effects
> theme is `elegant-promo-2022` on the C19 run, SILENT as in its source.

## CH1 - THE PEOPLE (0:00.0-0:20.7; Bed A `leatherface` intro cut, card OFF; the 67.9 s montage IS the chapter's opening)
```
0:00.0  [MUSIC] Bed A row 1 `leatherface` (Wicked_Cinema_Leatherface_instrumental_intro_1_24-2.wav, source_in 10.767, remix-loop
        on bars 4-7 = file 14.223-28.340, 3 extra passes), remotion_gain -25.5 dB (23.7 dB under the VO), subtle, from frame 0
        → 0:37.9; mid bed A (bar 8) arrives at delivered 59.9 s (1.03 s into CLIP-6), section B (bar 16) at spine 20.26 in the
        pause after "So let's unpack all of this", out on the bar 21 line (file 74.222). License `APWZNQ3HC2L0MB6P` (YouTube
        description only)
0:00.0  [MUSIC] montage automation on row 1: +16 dB relative (0.4 s ramp) over spine -1.0 to 0.1 = delivered 0 to 68.0 s, net
        +2 dB against the automatic -14 dB clip duck, so the low intro sits about 28 dB under the clip voices (not silence);
        the window and the duck end together on Mike's first word
0:00.0  [INSERT] CLIP-29 LEAD-IN: spine 0.00 to the snapped splice (about 0.16, 5 frames, silent) shows CLIP-29's FIRST frame,
        so the video opens ON the montage, never on FACE-1 (COVER-PLAN open question 1, resolved here; no set-up line by
        Mike's montage ruling)
0:00.0  [FACE] F1 opens ON face 0.000 → 0:06.5 (6.489; heard and seen AFTER the montage). Joins 0.133 / 6.467 sit within 0.5 s
        of the window edges: no punch, no leak (overlays.md section 1)
0:00.0  [CAPTION] ON → 0:06.5 (F1, face hold over 5 s; FACE window only; house style; caption fix "word" → "work")
0:00.0  SAY:  "So some of those people say that AI took their work and all of them have been searching for months."
0:00.1  [MUSIC] HARD HIT (MUSIC-PLAN 0.1, the cut from the montage to Mike, the locked promise line): no hit; mid bed A has been
        in since 60.4 s of the montage and the un-duck on his first word reveals it. No SFX (the brief bars impacts)
0:00.1  [INSERT] CLIP-29 SPLICED CLIP, 5.3 s (montage slot 1 of 11, montage clock 0.0-5.3): the spine PAUSES at 0.10 (snaps
        into the 0.00-0.21 trough, about 0.16) and assets/clip-inserts/CLIP-29-creative-director.mp4 plays FULL-FRAME with his
        OWN voice ("I'm 55 years old and I can't find a job. That's a really strange sentence for me to say."), burned caption
        'Creative director, 55, can't find a job, YouTube, Sep 2026'; the bed ducks automatically · [TRANSITION] insert-in
        → hand:fade (insert-in, 0.50s) (bucket insert; the video's first frame)
0:00.1  [INSERT] CLIP-3 SPLICED CLIP, 6.5 s (slot 2, clock 5.3-11.8), own voice, caption 'Laid-off tech worker, unemployed
        for over a year, YouTube, Sep 2026' · [TRANSITION] hand:cut (the montage flip, Mike's ruling: hard cuts clip to clip)
0:00.1  [INSERT] CLIP-12 SPLICED CLIP, 4.0 s (slot 3, clock 11.8-15.8), own voice (the young man in the car, lip-checked),
        caption band at the TOP 'Young job seeker, still no full-time job, NBC News, Aug 2026' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-20 SPLICED CLIP, 8.7 s (slot 4, clock 15.8-24.5), own voice, caption 'Translator, 15 years in the job,
        YouTube, Feb 2026' (one of the two clips "AI took their work" stands on) · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-2 SPLICED CLIP, 6.6 s (slot 5, clock 24.5-31.1), own voice, caption 'Tech worker, 15 years in tech,
        still applying, YouTube, Sep 2026' ("8,000" lives only in her voice) · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-27 SPLICED CLIP, 5.1 s (slot 6, clock 31.1-36.2), own voice, caption 'Tech worker, 5 months searching,
        YouTube, Jun 2025' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-9 SPLICED CLIP, 4.4 s (slot 7, clock 36.2-40.6), own voice, caption band at the TOP 'Digital marketing
        lead, 41, almost 2 years searching, YouTube, Oct 2025' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-24 SPLICED CLIP, 8.4 s (slot 8, clock 40.6-49.0, the fixed window 0:17.5-0:25.9), own voice, caption
        band at the TOP 'Freelance writer, lost almost 90 percent of his income, YouTube, Feb 2025' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-30 SPLICED CLIP, 9.8 s (slot 9, clock 49.0-58.8), own voice, caption 'Customer success, 57, 3 months
        since the layoff, YouTube, Jul 2026' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-6 SPLICED CLIP, 5.9 s (slot 10, clock 58.8-64.7), two speakers' own voices, caption 'Laid-off tech
        workers, YouTube, Sep 2026' · [TRANSITION] hand:cut
0:00.1  [INSERT] CLIP-16 SPLICED CLIP, 3.2 s (slot 11, clock 64.7-67.9, the last clip), own voice, caption band at the TOP
        'Executive recruiter, 53, almost a year searching, YouTube, Oct 2026' · LEAD-OUT: her LAST frame dissolves onto
        Mike's face (COVER-PLAN: soft dissolve; no still is held, the spine resumes on FACE-1) · [TRANSITION] insert-out onto
        FACE-1 → hand:film-burn (face-cut, 0.76s) (bucket insert; this cut IS F1's cut-in, so the face pick and the insert-out are ONE move)
0:06.5  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s)
0:06.5  [CHART] C10 IN (6.489 → 0:13.5), state start (C10-start.png spec): house container entry (cross-fade + scale-in), slow
        push-in 1.00 to 1.03 across the beat; '2.0 MILLION' fades in with an 8 px blur on "This" (6.54), NO count-up (Mike:
        quiet, no flourish); never says AI `[VERIFY BLS Oct 2026, re-pull before render]`
0:06.5  SAY:  "This is not a warning about the future."
0:08.4  [CHART] C10 state mid (C10-mid.png) on "future." (8.38): 'out of work 27 weeks or more, October 2026' rises, the divider
        draws, the bar track fades in
0:09.0  SAY:  "It's already happening in jobs that felt safe just two years ago."
0:09.4  [CHART] C10 state payoff (C10-payoff.png) on "already" (9.42): the red fill grows over 60 f, lands about 11.42 on "safe",
        its share label fades in on landing; holds to 0:13.5
0:13.5  [VIDEO] BR-1 IN (13.45 → 17.08, 3.6 s): assets/vid/BR-1-welder-arc-sparks.mp4, a welder's arc in a dark workshop, slow, → hand:fade (broll-fade, 0.50s)
        no robot (dissolve)
0:13.5  SAY:  "And the next jobs in line are the ones you were told a machine could never do."
0:17.1  [VIDEO] BR-2 IN (17.08 → 20.63, 3.6 s): assets/vid/BR-2-tradesman-picks-tools.mp4, hands picking tools from a worn bag → hand:fade (broll-fade, 0.50s)
        (dissolve)
0:18.8  SAY:  "So let's unpack all of this."
0:20.6  [CONTAINER] prior-videos-pair IN (20.63 → 0:26.5, card-slides/prior-videos-pair.png): the two earlier thumbnails → hand:xfade-scale (container-xfade, 0.35s)
        (R-THUMB1, R-THUMB2) side by side with their real titles and dates (2026-10-08, 2026-10-27), held, then out. Declared
        A-and-B comparison; section B of the bed steps in under it at 20.26
```

## CH2 - ALREADY LEAVING (0:20.7-2:19.7; Bed A section B, plateau C, the breakdown; card OFF)
```
0:20.7  SAY:  "I covered the first wave in my last two videos."
0:23.4  SAY:  "So I'm not going to go back over those jobs in particular."   (re-listened; the JSON 24.32-30.78 is a hallucination)
0:26.5  [CONTAINER] C19-1 IN (26.45 → 0:34.7), effects theme `elegant-promo-2022`, device `ep-elegant-promo`, SILENT as in its
        source: `ep-iris-open → hand:ep-iris-open (container-effect, 1.00s)` opens IMG-1 (assets/img/IMG-1-empty-office-floor.png, the plate) out of the navy field, slow
        push-in all slot; the comp lays card-slides/C19-1-overlay.png (discs + bar + title + sub-line, transparent) over the
        pushing plate while it runs the device motion (library.json curves)
0:26.5  SAY:  "This year through October, employers named AI as a reason for 121,401 job cuts."
0:31.3  [CONTAINER] C19-1 headline lands on "121,401" (31.34, the re-listened onset): `ep-disc-sweep` (magenta, corner_tl) about
        1.1 s ahead, then `ep-label-title`: the teal-to-blue bar wipes, '121,401' tracks in, sub-line 'JOB CUTS BLAMED ON AI /
        2026 THROUGH OCTOBER'. Never 'since 2023' beside 121,401 `[VERIFY Challenger]`
0:34.7  [CONTAINER] C19-2 IN (34.68 → 0:40.1): `ep-circle-burst → hand:ep-circle-burst (container-effect, 0.90s)` carries IMG-2 (assets/img/IMG-2-desk-belongings-box.png) in over
        card 1 (six staggered circles, done about 0.9 s), slow push; card-slides/C19-2-overlay.png over the plate
0:34.8  SAY:  "Since 2023, 193,226."
0:36.8  [CONTAINER] C19-2 headline lands on "193,000" (36.78, where the number really starts; never the JSON's 38.70):
        `ep-disc-sweep` (corner_br) + `ep-label-title` '193,226' / 'SINCE 2023' `[VERIFY Challenger]`
0:37.9  [MUSIC] Bed A row 2 (Wicked_Cinema_Leatherface_instrumental_4_22.wav, source_in 74.223, master bars 21-31: the last 3
        bars of section B, then plateau C arriving at 48.50 between "the loud part" and "The quiet part"), -25.5 dB (19.4 under
        the VO), subtle → 1:16.7. Same audio as the intro cut at the bar 21 line, heard as no splice
0:40.1  [CONTAINER] C19-3 IN (40.08 → 0:46.1): `ep-circle-burst → hand:ep-circle-burst (container-effect, 0.90s)` to IMG-3 (assets/img/IMG-3-revolving-door-dusk.png), slow push;
        card-slides/C19-3-overlay.png over the plate
0:40.1  SAY:  "Here's the thing."
0:41.3  SAY:  "October was the lowest month of the year, only 1,265."
0:44.0  [CONTAINER] C19-3 headline lands on "only" (44.04): `ep-disc-sweep` + `ep-label-title` '1,265' / 'OCTOBER 2026, THE
        LOWEST MONTH OF THE YEAR' (top_centre), held to 46.10 (guard 2: the October low is shown) `[VERIFY Challenger]`
0:46.1  [RECEIPT] C2 IN (46.10 → 48.65, 2.55 s): receipts/C2-challenger-october.png, the Challenger October 2026 report's AI → hand:xfade-scale (container-xfade, 0.35s)
        paragraph ('AI was cited for 1,265 cuts in October ... 121,401 ... Since 2023 ... 193,226'), the source of the three
        cards just shown; treatment: push (a figure panel read off the screen: push to the AI paragraph, settle, no highlight,
        the line does not read it) `[VERIFY]`
0:46.2  SAY:  "But a layoff announcement is the loud part."
0:48.7  [VIDEO] BR-3 IN (48.65 → 52.30, 3.65 s): assets/vid/BR-3-laptop-scroll-dark.mp4, a job board scrolling in a dark room, → hand:fade (broll-fade, 0.50s)
        no readable brand (dissolve)
0:48.8  SAY:  "The quiet part is the job that never gets posted."
0:52.3  [CHART] C7 IN (52.30 → 1:04.5), state start (C7-start.png spec): zero line + both category labels, no bars; source → hand:xfade-scale (container-xfade, 0.35s)
        Indeed Hiring Lab, 'May 2026, year over year' `[VERIFY]`
0:52.5  SAY:  "Entry level job postings are down 7.5% in a year while senior postings are up 14.7%."
0:54.1  [CHART] C7 state mid (C7-mid.png) on "down" (54.14): the entry-level bar grows DOWN, '−7.5%' counts, lands 55.04
0:58.6  [CHART] C7 state both (C7-both.png) on "up" (58.58): the senior bar grows UP, '+14.7%' lands 59.46
1:00.7  [CHART] C7 state hiring (C7-hiring.png) on "Companies" (60.74): the takeaway bar rises, 'still hiring' green, senior
        keeps its glow, entry dims
1:00.7  SAY:  "Companies are still hiring."
1:02.7  SAY:  "They're not hiring the beginners."
1:03.5  [CHART] C7 state payoff (C7-payoff.png) on "the beginners" (63.54): entry relit with glow, senior dims, 'beginners' red
1:04.5  [RECEIPT] R-INDEED IN (64.45 → 67.30): receipts/R-INDEED-seniority.png, the Indeed Hiring Lab article; treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
        (the line paraphrases its caution: settling push, then the wipe) `[VERIFY]`
1:04.6  SAY:  "The researchers don't put it all on AI, but if you're 22 with a brand new degree, the reason doesn't change the
              result."
1:05.8  [HIGHLIGHT] R-INDEED: 'All of these factors may be at least partially at play', wipe lands on "put it all on AI"
        (65.78-66.60)
1:07.3  [VIDEO] BR-4 IN (67.30 → 70.40, 3.1 s): assets/vid/BR-4-graduate-from-behind.mp4, a graduate in cap and gown seen from → hand:fade (broll-fade, 0.50s)
        behind, alone (dissolve)
1:10.4  [VIDEO] BR-5 IN (70.40 → 72.255, 1.85 s): assets/vid/BR-5-closes-laptop-night.mp4, closes the lid; clears before F2 → hand:fade (broll-fade, 0.35s)
        (dissolve)
1:12.3  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick; 72.255)
1:12.3  [FACE] F2 IN → 1:15.0 (72.255-75.022, 2.77 s): its only join (74.9) is within 0.5 s of the edge: no punch, no leak;
        no caption (under 5 s)
1:12.3  SAY:  "Now look at what the government itself expects."
1:15.0  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s) (75.022)
1:15.0  [VIDEO] BR-6 IN (75.022 → 78.20, 3.2 s): assets/vid/BR-6-binder-paperwork-desk.mp4, an office worker with paper files, → hand:fade (broll-fade, 0.38s)
        muted light (dissolve)
1:15.1  SAY:  "The Bureau of Labor Statistics projects that office and administrative support will lose 752,000 jobs by 2035."
1:16.7  [MUSIC] Bed A row 3 (instrumental_4_22.wav, source_in 84.811, jump back 8 bars: plateau C again, bars 24-31), -25.5 dB
        (21.1 under the VO), subtle, level and steady → 1:45.0
1:18.2  [CHART] C6 IN (78.20 → 1:25.9), state start (C6-start.png spec): eyebrow, PROJECTED pill, 'office and administrative → hand:xfade-scale (container-xfade, 0.35s)
        support jobs', number slot empty; source BLS Employment Projections
1:20.0  [CHART] C6 state mid (C6-mid.png) on "lose" (80.00): the counter runs to '−752,100' (tabular, left-anchored), lands
        82.32 on "jobs". The card shows 752,100, NEVER the VO's 752,000
1:24.5  [CHART] C6 state payoff (C6-payoff.png) on "The most of any group" (84.46): the callout slides in, red rule draws
1:24.5  SAY:  "The most of any group."
1:25.9  [RECEIPT] C5 IN (85.90 → 91.90): receipts/C5-bls-ecopro.png, the BLS release paragraph (re-cropped, top line whole); → hand:xfade-scale (container-xfade, 0.35s)
        treatment: highlight (the line quotes it)
1:26.0  SAY:  "And it puts the reason in writing: automation tools, including those powered by AI."
1:27.7  [HIGHLIGHT] C5: 'continued integration of automation tools, including those powered by AI', the wipe starts on
        "automation" (87.66) and sweeps with the read
1:31.9  [CHART] C3 IN (91.90 → 1:39.3), state start (C3-start.png spec): row 1 'Word processors and typists' with a FULL red bar → hand:xfade-scale (container-xfade, 0.35s)
        (2025), no percent; title 'projected, 2025 to 2035', BLS Table 1.5
1:31.9  SAY:  "Typists down 34%, data entry down 25%, telemarketers down 21%."
1:32.8  [CHART] C3 row 1 on "down" (92.76): the fill shrinks to the 2035 count, '−34.4%' at 93.10
1:34.8  [CHART] C3 row 2 rises in on "data" (94.84), shrinks on "down" (95.60); state mid (C3-mid.png) when '−25.5%' lands
        (95.94). Exact decimals on screen, never the VO's rounded figures
1:37.1  [CHART] C3 row 3 in on "telemarketers" (97.14), shrinks 98.18; state payoff (C3-payoff.png) when '−21.4%' lands (98.58)
1:39.3  [RECEIPT] C4 IN (99.30 → 104.50): receipts/C4-bls-declining.png, BLS Table 1.5 as published (title + first rows); → hand:xfade-scale (container-xfade, 0.35s)
        treatment: pan (a government document shown as an OBJECT: "it is from the government"; nothing is read off it) ·
        [MOTION] lib:motion-3d-pan-1-down
1:39.6  SAY:  "That's a forecast, not jobs gone already, but it is from the government."
1:44.5  [VIDEO] BR-7 IN (104.50 → 108.50, 4.0 s): assets/vid/BR-7-freelancer-dark-kitchen.mp4, a freelancer alone at night → hand:fade (broll-fade, 0.50s)
        (dissolve)
1:44.7  SAY:  "Then there's freelance work where nobody announces anything."
1:45.0  [MUSIC] Bed A row 4 (instrumental_4_22.wav, source_in 113.046, sample-continuous with row 3, +2.5 dB seat step over
        0.5 s: the low breakdown, bars 32-35), -23.0 dB (23.3 under the VO), dip → 1:59.1 · HARD HIT (MUSIC-PLAN 104.97, the
        freelance beat): the fall from the plateau into the breakdown, as the file plays it, 0.29 s after "Then there's
        freelance work". No SFX
1:48.5  [IMAGE] IMG-4 IN (108.50 → 110.80, 2.3 s): assets/img/IMG-4-empty-home-desk-dusk.png, a home desk at dusk, laptop
        closed, chair empty; slow push-in; ingress → hand:cross-warp (glitch-still, 0.50s) (soft, per the brief)
1:48.6  SAY:  "The jobs just stopped showing up."
1:50.8  [RECEIPT] R-CSH IN (110.80 → 114.50): receipts/R-CSH-freelance-study.png, the Complexity Science Hub page 'How is → hand:xfade-scale (container-xfade, 0.35s)
        generative AI impacting the freelance job market'; treatment: pan (an article title shown as an OBJECT: the study
        exists) · [MOTION] lib:motion-3d-pan-1-right `[VERIFY]`
1:51.0  SAY:  "A study of more than 3 million freelance job posts found that in the first year after ChatGPT translation work
              in Western languages fell 30% and one of a kind routine writing fell by 50%."
1:54.5  [CHART] C8 IN (114.50 → 2:04.3), state start (C8-start.png spec): zero line ('0 = the market trend') + three column labels → hand:xfade-scale (container-xfade, 0.35s)
        in grey, no bars; 'first year after ChatGPT', Journal of Economic Behavior and Organization, 2025
1:57.2  [CHART] C8 column 1 label brightens on "translation" (117.16)
1:59.1  [MUSIC] Bed A row 5 (instrumental_4_22.wav, source_in 113.046, jump back 4 bars: the breakdown again, bars 32-37 in
        delivered time, CLIP-21's 7.6 s pause included, file 122.6-130.2 under her voice), -23.0 dB, dip → 2:12.7
1:59.2  [CHART] C8 bar 1 drops on "fell" (119.16), '−30%' at 119.54
2:00.2  [CHART] C8 bar 2 drops (120.24, unspoken, follows), 'about −20%'; state mid (C8-mid.png) by 120.74
2:01.9  [CHART] C8 column 3 label brightens on "routine writing" (121.86)
2:02.7  [CHART] C8 bar 3 drops on "fell" (122.70) with the red glow; state payoff (C8-payoff.png) when '−50%' lands (123.36). The
        label stays "About Us" page writing: NEVER 'one of a kind' on screen
2:04.3  [VIDEO] BR-8 IN (124.25 → 126.75, 2.5 s): assets/vid/BR-8-reading-page-typing.mp4, a translator's desk, hands typing → hand:fade (broll-fade, 0.50s)
        (dissolve)
2:04.3  SAY:  "One of the people you heard at the start is a translator."
2:06.8  [RECEIPT] S1 LEAD-IN IN (126.75 → 128.68): receipts/S1-clip21-lead-in.png, CLIP-21's FIRST frame held as a still under
        the set-up line; treatment: push (a slow push, no highlight)
2:06.8  SAY:  "And this is how she said it happened."
2:08.7  [INSERT] CLIP-21 SPLICED CLIP, 7.6 s: the spine PAUSES at 128.68 (snaps into the 128.60-128.88 trough after "happened",
        about 128.715) and assets/clip-inserts/CLIP-21-translator-less-work.mp4 plays FULL-FRAME with the translator's OWN
        voice ("At first it was slow, gradual, some clients I worked with started sending me less work, and then no work."),
        caption 'Translator, UK, on the past 12 to 18 months, YouTube, Feb 2026'; the bed ducks -14 dB automatically ·
        [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert; the out-dissolve runs over the clip's near-silent
        7.0-7.6 s tail onto S2)
2:08.7  [RECEIPT] S2 LEAD-OUT IN (128.68 → 132.40): receipts/S2-clip21-lead-out.png, CLIP-21 at 7.0 s (eyes open, the frame
        visual-qa approved; the 7.6 s frame was mid-blink), held under the resume line, then a slow dissolve; treatment: push
2:08.8  SAY:  "That's what a 30% drop feels like from the inside."   ("feels like" is spoken, no JSON word, about 130.56-131.20)
2:12.4  [CHART] C8-shift IN (132.40 → 2:19.6), state start (C8-shift-start.png spec): the FELL group (C8's three red bars at 55%) → hand:xfade-scale (container-xfade, 0.50s)
        + an empty GREW side; label 'same study, same year'. A new chart, not C8 again (rule #12)
2:12.5  SAY:  "Here's the thing."
2:12.7  [MUSIC] Bed A row 6 (instrumental_4_22.wav, source_in 134.223, the last two breakdown bars 38-39, re-anchored on a bar
        line after the clip), -23.0 dB, dip → 2:19.7, sample-continuous into CH3's heavy verse
2:14.0  [CHART] C8-shift state mid (C8-shift-mid.png) on "Total" (133.98): the TOTAL FREELANCE DEMAND badge rises
2:14.0  SAY:  "Total freelance demand went up over that same year."
2:15.7  [CHART] C8-shift 'UP' triangle pops on "up" (135.72), badge glows green. A direction badge, never a bar (no figure in
        DATA.md)
2:17.5  [CHART] C8-shift state payoff (C8-shift-payoff.png) on "It just moves away" (137.54): the machine-learning bar rises,
        '+24%' lands about 138.2; the FELL bars stay down
2:17.5  SAY:  "It just moves away from them."
2:19.6  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.76s) (face pick; 139.555)
2:19.6  [FACE] F3 IN → 2:24.1 (139.555-144.122, 4.57 s): its only join (143.933) is within 0.5 s of the edge: no punch, no
        leak; no caption (under 5 s)
```

## CH3 - THE ONES NOBODY BELIEVES (2:19.7-6:21.4; Bed A heavy verse bars 40-55, unchanged under the plug; card OFF)
```
2:19.7  [MUSIC] Bed A row 7 (instrumental_4_22.wav, source_in 141.281, the heavy verse bars 40-51, pass 1), -25.5 dB (18.7
        under the VO), aggressive → 3:02.1 · HARD HIT (MUSIC-PLAN 139.72, CH3 opens on F3): bar 40 lands on the first word,
        the file's own 7 dB section change with its first-beat accent. A step heavier, never a hit: no SFX (if it reads as a
        hit in the draft, the fix is a 1.5 s fade-in on this row, MUSIC-PLAN LISTEN FOR 1)
2:19.7  SAY:  "Now we get to the jobs that nobody believes are at risk."
2:24.1  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s) (144.122)
2:24.1  [VIDEO] BR-9 IN (144.122 → 145.42, 1.3 s): assets/vid/BR-9-welder-black-hood.mp4, a welder under the hood, close → hand:fade (broll-fade, 0.38s)
        (dissolve)
2:24.4  SAY:  "Welders, maintenance workers, people tell me that no robot with a human body will ever do the work as well as a
              person."
2:25.4  [VIDEO] BR-10 IN (145.42 → 148.42, 3.0 s): assets/vid/BR-10-maintenance-worker-ceiling.mp4, a maintenance worker at → hand:fade (broll-fade, 0.35s)
        work, shown with respect (dissolve; regraded dark, visual-qa round 2)
2:28.4  [VIDEO] BR-11 IN (148.42 → 151.55, 3.1 s): assets/vid/BR-11-hands-work-gloves.mp4, weathered hands pulling on work → hand:fade (broll-fade, 0.50s)
        gloves, no robot (dissolve)
2:31.6  [CONTAINER] C11-lane1 IN (151.55 → 2:40.4, card-slides/C11-lane1.png): spotlight card of C11, eyebrow 'WHO ACTUALLY → hand:xfade-scale (container-xfade, 0.35s)
        WELDS TODAY', lane 1 'FIXED ARMS AND COBOTS', status at rest
2:31.7  SAY:  "So here's exactly where it stands."
2:33.8  SAY:  "Start with welding."
2:35.2  SAY:  "Robots already weld in production every day."
2:35.2  [CONTAINER] C11-lane1-s1 (card-slides/C11-lane1-s1.png) on "Robots already weld" (155.20): 'IN PRODUCTION' lit green,
        held to 160.40
2:38.4  SAY:  "They just don't look like people."
2:40.4  [VIDEO] BR-12 IN (160.40 → 162.20, 1.8 s): assets/vid/BR-12-robot-arm-welding.mp4, an industrial arm welding steel, → hand:fade (broll-fade, 0.35s)
        real footage (dissolve)
2:40.5  SAY:  "They are arms and smaller collaborative robots called cobots."
2:42.2  [VIDEO] BR-13 IN (162.20 → 165.20, 3.0 s): assets/vid/BR-13-cobot-arm-engineers.mp4, a cobot arm beside people → hand:fade (broll-fade, 0.35s)
        (dissolve; regraded dark, visual-qa round 2)
2:45.2  [RECEIPT] R-HDH IN (165.20 → 168.90): receipts/R-HDH-hyundai-robots.png, the 'Robotization wave hits shipyards' → hand:xfade-scale (container-xfade, 0.35s)
        article; treatment: pan (an article headline shown as an OBJECT) · [MOTION] lib:motion-3d-pan-2-left `[VERIFY]`
2:45.4  SAY:  "One Korean shipbuilder group, HD Hyundai, went from 129 of these robots to 211, mostly for cutting and welding
              steel."
2:48.9  [CHART] C11-count IN (168.90 → 2:54.0), state start (C11-count-start.png spec): 129 grey squares pop in row by row, → hand:xfade-scale (container-xfade, 0.35s)
        lands by 169.34 on "129"; label 'HD Hyundai shipyards, robots, mostly cutting and welding steel'. No period, no 'in a
        year' on screen `[VERIFY]`
2:50.3  [CHART] C11-count state mid (C11-count-mid.png) on "these robots to" (170.28): 82 dashed cyan slots outline in, the
        arrow draws
2:51.1  [CHART] C11-count state payoff (C11-count-payoff.png) on "211" (171.08): the slots fill cyan, the counter lands '211'
        about 171.88
2:52.0  [CHART] C11-count 'mostly for cutting and welding steel' fades in on "mostly" (172.02)
2:54.0  [VIDEO] BR-14 IN (173.95 → 177.95, 4.0 s): assets/vid/BR-14-unused-welding-helmet.mp4, empty booths, helmets hanging → hand:fade (broll-fade, 0.50s)
        unused (dissolve)
2:54.1  SAY:  "Why?"
2:54.8  SAY:  "Because the industry just cannot find the people."
2:58.0  [CHART] C12 IN (177.95 → 3:07.2), state start (C12-start.png spec): header + two faint empty tracks; source → hand:xfade-scale (container-xfade, 0.35s)
        weldingworkforcedata.com. Never on one card with BLS 437,700 `[VERIFY]`
2:58.2  SAY:  "The US is projected to need over 320,000 new welding professionals by 2029 and more than 157,000 are getting
              close to retirement."
2:59.0  [CHART] C12 row 1 label 'new welding professionals needed by 2029 / projected' on "projected" (179.02)
3:00.6  [CHART] C12 gold bar grows on "320" (180.62) with the counter to 320,500, lands 182.02; state mid (C12-mid.png) from
        182.04
3:02.1  [MUSIC] Bed A row 8 (instrumental_4_22.wav, source_in 141.281, jump back 12 bars: bars 40-51, pass 2), -25.5 dB,
        aggressive, the same seat through the shortage numbers and the whole plug → 3:44.4
3:04.7  [CHART] C12 row 2 label on "and" (184.70)
3:05.6  [CHART] C12 red bar grows on "157" (185.58), counter to 157,000, the '+' on landing; state payoff (C12-payoff.png) at
        186.72
3:07.2  [RECEIPT] C13 IN (187.20 → 189.25, 2.05 s): receipts/C13-welding-workforce.png, the headline numbers panel; treatment: push → hand:xfade-scale (container-xfade, 0.35s)
        (a stat panel, a short flash: push to the numbers) `[VERIFY]`
3:09.3  [CONTAINER] plug-intro IN (189.25 → 3:17.8, card-slides/plug-intro.png): Mike's profile logo + 'I'm CodeMonkey Mike', → hand:xfade-scale (container-xfade, 0.35s)
        three rows at rest. THE MID-ROLL PLUG (COVER only, Mike 2026-11-10; about 43.8 to 49.7 percent of the cut): no SFX, no
        bed change, nothing about how the videos are made
3:09.4  SAY:  "By the way, if you're new here, I'm CodeMonkey Mike."
3:13.0  SAY:  "I run a crypto community, build software for my members, create courses and so on."
3:13.6  [CONTAINER] plug-intro-s1 (card-slides/plug-intro-s1.png) on "crypto community" (193.64): Crypto community lit
3:14.6  [CONTAINER] plug-intro-s2 (card-slides/plug-intro-s2.png) on "build software" (194.62): + Software for members lit
3:16.3  [CONTAINER] plug-intro-s3 (card-slides/plug-intro-s3.png) on "create courses" (196.30): + Courses lit, held to 197.80
3:17.8  [CONTAINER] plug-goal IN (197.80 → 3:23.8, card-slides/plug-goal.png): 'THE GOAL' / 'Invested into assets, before the → hand:xfade-scale (container-xfade, 0.35s)
        paychecks run out.' One point, one state
3:17.9  SAY:  "The goal of my channel is to get people invested into assets before the paychecks run out."
3:23.8  [RECEIPT] R-SHOWCASE IN (203.80 → 210.20): receipts/R-SHOWCASE-scroll.mp4, the community's calls page (Top Performing → hand:xfade-scale (container-xfade, 0.35s)
        Assets), the real slow scroll as captured (8.97 s file, first 6.4 s); treatment: push (a screen recording that already
        moves). The page has NO Janction / JCT row: never highlight, zoom to or label a JCT row here `[VERIFY]`
3:23.9  SAY:  "And my calls more than make up for the memberships."
3:27.1  SAY:  "For example, three weeks ago, I called a new AI crypto called Janction, and it shot up 6x a few days ago."
3:30.2  [RECEIPT] R-JCT IN (210.20 → 214.65): receipts/R-JCT-price-chart.png, the page's own 'Janction JCT Price' strip over → hand:xfade-scale (container-xfade, 0.35s)
        the 1M chart (about $0.002 before Oct 20 to a peak about $0.0143 on Nov 8-9, about 7x); treatment: push (push to the
        run, the figure read off the screen). Real chart, never redrawn `[VERIFY the call date + the 6x]`
3:34.7  [CONTAINER] plug-300 IN (214.65 → 3:40.4, card-slides/plug-300.png): '$300 at the call', row at rest. No membership → hand:xfade-scale (container-xfade, 0.35s)
        price, no dollar result (Mike's plan-gate ruling)
3:34.7  SAY:  "Just a simple $300 investment would have more than paid for my community's lifetime membership."
3:37.6  [CONTAINER] plug-300-s1 (card-slides/plug-300-s1.png) on "more than paid" (217.60): 'More than a lifetime membership' lit,
        held to 220.40
3:40.4  [CONTAINER] plug-cta IN (220.40 → 3:45.0, card-slides/plug-cta.png): 'Link in the description' → hand:xfade-scale (container-xfade, 0.35s)
3:40.5  SAY:  "Click the link in the description if you're interested."
3:40.5  [CONTAINER] plug-cta-s1 (card-slides/plug-cta-s1.png) on "Click the link" (220.54): + the cryptorich.vip lower-third
        (the cross-fade IS its fade-in), held to 225.00
3:43.7  SAY:  "Now let's get back to the data."
3:44.4  [MUSIC] Bed A row 9 (instrumental_4_22.wav, source_in 141.281, bars 40-51, pass 3): the bar 40 accent at 224.43, 0.6 s
        before "So next", -25.5 dB, aggressive → 4:26.8
3:45.0  [IMAGE] IMG-5 IN (225.00 → 228.30, 3.3 s): assets/img/IMG-5-idle-humanoid-back.png, a humanoid standing idle on a dim
        factory floor, seen from behind, doing nothing (guard 3); slow push-in; ingress → hand:cross-warp (glitch-still, 0.50s) (soft, per the brief)
3:45.0  SAY:  "So next, the robot with a human body, a Figure humanoid loaded sheet metal at a BMW plant for 11 months and BMW
              called it a pilot."
3:48.3  [RECEIPT] C14 IN (228.30 → 232.40): receipts/C14-figure-bmw.mp4, Figure's own post with its footage playing MUTED → hand:xfade-scale (container-xfade, 0.35s)
        (10.0 s file, first 4.1 s), label 'Figure 02, 2025, ended. Other robots did the welding.'; treatment: push (a
        recording that already moves). Past tense, no robot count
3:52.4  [RECEIPT] C15 IN (232.40 → 234.85): receipts/C15-bmw-pilot.png, the BMW Group newsroom release (cropped clear of any → hand:xfade-scale (container-xfade, 0.35s)
        present-tense Figure 03 claim); treatment: highlight (the line quotes its word) `[VERIFY]`
3:54.4  [HIGHLIGHT] C15: 'pilot', the wipe lands on "pilot." (234.40)
3:54.9  [RECEIPT] C16 IN (234.85 → 240.10): receipts/C16-digit-totes.png, Agility's post 'Digit Moves Over 100,000 Totes in → hand:xfade-scale (container-xfade, 0.35s)
        Commercial Deployment'; treatment: pan (an article title shown as an OBJECT) · [MOTION] lib:motion-3d-offset-1-right-up
3:54.9  SAY:  "Another one called Digit has moved more than 100,000 totes in a working warehouse."
4:00.1  [CONTAINER] C20 IN (240.10 → 4:05.3, card-slides/C20.png): the GXO quote card, 'Humanoids will absolutely feature in our → hand:xfade-scale (container-xfade, 0.35s)
        solutions.' + "Return on humanoids: 'a couple of years away'. Patrick Kelleher, CEO, GXO Logistics, earnings call,
        August 5, 2026" (Mike OK'd the name at the plan gate). About WHEN it pays, never 'not paying off' `[VERIFY the exact
        words against GXO's Q2 2026 transcript]`
4:00.2  SAY:  "And that company's CEO says that humanoids are a couple years away from paying for themselves"
4:05.2  SAY:  "and the humanoid welder."
4:05.3  [CONTAINER] C11-lane3 IN (245.25 → 4:11.3, card-slides/C11-lane3.png): 'HUMANOID WELDER', status 'PROTOTYPE, FIELD → hand:xfade-scale (container-xfade, 0.35s)
        TESTS 2027' lit gold, builder row at rest
4:07.4  SAY:  "It exists."
4:08.5  [CONTAINER] C11-lane3-s1 (card-slides/C11-lane3-s1.png) on "Persona AI" (248.50): 'Persona AI with HD Hyundai' lit,
        held to 251.25
4:08.5  SAY:  "Persona AI is building one with HD Hyundai."
4:11.3  [RECEIPT] C17 IN (251.25 → 257.20): receipts/C17-persona-weld.png, the IEEE Spectrum piece on Persona AI's welding → hand:xfade-scale (container-xfade, 0.35s)
        humanoid; treatment: highlight (the line says its words)
4:11.3  SAY:  "And right now it's learning to weld in straight lines at around one centimeter per second."
4:13.0  [HIGHLIGHT] C17: the 'learning how to weld' wording, the wipe lands on "learning to weld" (253.00)
4:17.2  [RECEIPT] R-KH IN (257.20 → 259.922): receipts/R-KH-korea-herald.png, The Korea Herald article; treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
        (the line reads its 2027 line); clears before F4 `[VERIFY]`
4:17.3  SAY:  "Field tests are planned for 2027."
4:18.9  [HIGHLIGHT] R-KH: the 2027 field-testing line, the wipe starts on "Field" (257.28) and lands on "2027" (258.94)
4:19.9  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.76s) (face pick; 259.922)
4:19.9  [FACE] F4 IN → 4:25.2 (259.922-265.155, 5.23 s): its only join (264.767) is within 0.5 s of the end: no punch, no leak
4:19.9  [CAPTION] ON → 4:25.2 (F4, face hold over 5 s; FACE window only; house style)
4:20.0  SAY:  "So no, a humanoid robot is not welding in a shipyard today,"
4:25.1  SAY:  "but the arms already are, the humanoid is in training and the industry just cannot hire welders fast enough."
4:25.2  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s) (265.155; F4 closes 0.05 s into "but")
4:25.2  [DIAGRAM] C11 IN (265.155 → 4:35.8), THE system-design diagram, full frame, shown ONCE: state start → hand:xfade-scale (container-xfade, 0.35s)
        (diagrams/C11-start.png, all three lanes dim), cross-fade + scale-in
4:25.8  [DIAGRAM] C11 lane 1 (diagrams/C11-lane1.png) on "arms" (265.84): 'FIXED ARMS AND COBOTS / IN PRODUCTION' lights green,
        the rail draws, the marker pops
4:26.8  [MUSIC] Bed A row 10 (instrumental_4_22.wav, source_in 141.281, bars 40-51, pass 4), -25.5 dB, aggressive → 5:09.1
4:27.2  [DIAGRAM] C11 lane 2 (diagrams/C11-lane2.png) on "the humanoid" (267.22): 'HUMANOID, MOVING PARTS AND TOTES / PILOTS'
        lights gold (BMW in the past tense, no robot count)
4:27.6  [DIAGRAM] C11 lane 3 (diagrams/C11-lane3.png) on "humanoid is in training" (267.58): 'HUMANOID WELDER / PROTOTYPE,
        FIELD TESTS 2027' lights cyan; the dashed 'field tests 2027' arrow draws on "training" (268.46)
4:32.3  [DIAGRAM] C11 state payoff (diagrams/C11-payoff.png) on "So it's early" (272.32): the takeaway bar rises, 'has started'
        turns green on "but it has started" (273.60); held to 275.75
4:32.3  SAY:  "So it's early, but it has started."
4:35.8  [CHART] C21 IN (275.75 → 4:41.1), state start (C21-start.png spec): eyebrow + 'general maintenance and repair workers, → hand:xfade-scale (container-xfade, 0.35s)
        US', number slot empty; BLS OOH
4:35.9  SAY:  "Now the maintenance worker in the US, around 1.6 million people do this job"
4:38.2  [CHART] C21 state mid (C21-mid.png) on "around" (278.20): the counter runs 0.0 to 1.6 'MILLION', lands 279.68 on
        "million"; '1,621,800 jobs in 2025' on landing
4:39.9  [CHART] C21 state payoff (C21-payoff.png) on "people do this job" (279.92): the 'about 148,700 openings a year' chip
        slides in (a glance, about 1.2 s on screen)
4:41.1  [RECEIPT] C22 IN (281.10 → 290.60): receipts/C22-bls-maintenance.png, the BLS 'What they do' duty list; treatment: highlight → hand:xfade-scale (container-xfade, 0.35s)
        (each duty highlighted as he says its paraphrase; the page's own words on screen)
4:41.1  SAY:  "and look at how the government itself describes the job: fix or replace faulty switches, outlets or circuit
              breakers, figure out what went wrong, order the parts."   ("parts." is spoken, no JSON word, about 289.86)
4:43.8  [HIGHLIGHT] C22 duty 1: 'Fix or replace faulty electrical switches, outlets, and circuit breakers' on "fix" (283.84)
4:48.2  [HIGHLIGHT] C22 duty 2: 'Inspect and diagnose problems' on "figure out what went wrong" (288.18)
4:49.5  [HIGHLIGHT] C22 duty 3: 'Order parts, supplies, or equipment' on "order the parts" (289.52)
4:50.6  [VIDEO] BR-15 IN (290.60 → 293.25, 2.65 s): assets/vid/BR-15-technician-control-panel.mp4, hands at an open panel → hand:fade (broll-fade, 0.50s)
        (dissolve; regraded dark, visual-qa round 2)
4:50.7  SAY:  "A maintenance worker doesn't do just one task."   ("A" has no JSON word; "maintenance" truly from about 290.84)
4:53.3  [VIDEO] BR-16 IN (293.25 → 295.10, 1.85 s): assets/vid/BR-16-plumber-under-sink.mp4, a worker fixing a pipe under a → hand:fade (broll-fade, 0.35s)
        sink (dissolve; regraded dark, visual-qa round 2)
4:53.3  SAY:  "They do whatever broke that day."
4:55.1  [IMAGE] IMG-6 IN (295.10 → 298.20, 3.1 s): assets/img/IMG-6-robot-hand-tool-wall.png, a humanoid's open hand beside a
        pegboard of tools, nothing in use; slow push-in; ingress → hand:cross-warp (glitch-still, 0.50s) (soft, per the brief)
4:55.2  SAY:  "And a humanoid robot isn't built for one task either."
4:58.2  [CONTAINER] callback-every-job IN (298.20 → 5:10.8, card-slides/callback-every-job.png): the 2026-10-08 thumbnail tile → hand:xfade-scale (container-xfade, 0.35s)
        (R-THUMB1) with 'Literally Every Job Is at Risk' + 'You don't need to call', three rows at rest. A deliberate callback
4:58.3  SAY:  "In my video, Literally Every Job Is at Risk."
5:01.9  SAY:  "I said that one day these robots work inside your house."
5:05.3  SAY:  "You don't need to call a plumber."
5:05.3  [CONTAINER] callback-every-job-s1 (card-slides/callback-every-job-s1.png) on "a plumber" (305.30): 'a plumber' lit
5:07.3  SAY:  "You don't need to call an electrician."
5:07.3  [CONTAINER] callback-every-job-s2 (card-slides/callback-every-job-s2.png) on "an electrician" (307.30): + 'an
        electrician' lit
5:09.1  [MUSIC] Bed A row 11 (instrumental_4_22.wav, source_in 141.281, the FULL 16 bars 40-55 this once: the last beat of bar
        55 is the file's pickup into the chorus, and the chorus is NOT played), -25.5 dB, aggressive, the peak held back
        → 6:05.6
5:09.4  SAY:  "You don't need to call a roofer."
5:09.4  [CONTAINER] callback-every-job-s3 (card-slides/callback-every-job-s3.png) on "a roofer" (309.40): + 'a roofer' lit, held
        to 310.75
5:10.8  [CONTAINER] apprenticeship-vs-download IN (310.75 → 5:14.4, card-slides/apprenticeship-vs-download.png): declared → hand:xfade-scale (container-xfade, 0.35s)
        comparison, 'THE TRADE: an apprenticeship' lit, 'THE ROBOT' at rest (divider and headline fixed, visual-qa round 2).
        No years, never 'humanoid electrician' on screen (Mike cut the word from the spine)
5:10.9  SAY:  "An electrician needs an apprenticeship."
5:12.6  SAY:  "A robot needs a download."
5:12.7  [CONTAINER] apprenticeship-vs-download-s1 (card-slides/apprenticeship-vs-download-s1.png) on "a download" (312.70):
        'THE ROBOT: a download' lit red, held to 314.42
5:14.4  [RECEIPT] C24 IN (314.42 → 322.42): receipts/C24-toyota-atlas.png, the Toyota pressroom release headline, one settling → hand:xfade-scale (container-xfade, 0.35s)
        push; treatment: highlight (the line says the Tedrake quote in its own words)
5:14.5  SAY:  "And that's how these robots are already being taught."
5:17.3  SAY:  "Boston Dynamics and Toyota teach their Atlas humanoid new skills by showing it."
5:21.0  [HIGHLIGHT] C24: Tedrake's 'skills are added quickly via demonstrations from humans', the wipe lands on "new skills by
        showing it" (320.97)
5:22.4  [RECEIPT] C24-footage IN (322.42 → 332.30): receipts/C24-footage-atlas-demo.mp4, the release's own Atlas footage, MUTED → hand:xfade-scale (container-xfade, 0.35s)
        (10.0 s file), labelled 'Lab demo, August 2025'; treatment: push (a recording that already moves). Never 'learns any
        job' `[VERIFY]`
5:22.5  SAY:  "And they say it needs fewer and fewer demonstrations each time."
5:27.2  SAY:  "For now, that's in the lab on tasks like packing and sorting."
5:30.4  [RECEIPT] C24-footage label 'packing, sorting, organizing' appears on "packing and sorting" (330.4)
5:32.3  [RECEIPT] C26 IN (332.30 → 338.10): receipts/C26-amazon-agentic.png, Amazon's sentence; treatment: highlight (the line → hand:xfade-scale (container-xfade, 0.35s)
        restates it). Never OpenAI Instant Checkout (pulled March 2026) `[VERIFY]`
5:32.4  SAY:  "The ordering part already exists too."
5:34.8  SAY:  "Amazon has an AI that completes the purchase for you."
5:36.3  [HIGHLIGHT] C26: 'Amazon's agentic AI handles the entire purchase process on the customer's behalf.', the wipe lands
        on "completes the purchase" (336.25)
5:38.1  [VIDEO] BR-17 IN (338.10 → 339.60, 1.5 s): assets/vid/BR-17-finger-press-screen.mp4, a thumb pressing a phone button → hand:fade (broll-fade, 0.35s)
        (dissolve)
5:38.3  SAY:  "You just press confirm."
5:39.6  [IMAGE] IMG-7 IN (339.60 → 343.00, 3.4 s): assets/img/IMG-7-dark-lamp-outlet.png, a wall outlet in a dim room, the lamp
        dark; slow push-in; ingress → hand:cross-warp (glitch-still, 0.50s) (soft, per the brief)
5:39.7  SAY:  "So picture it."
5:41.0  SAY:  "An outlet in your house stops working."
5:43.0  [DIAGRAM] C23 IN (342.97 → 5:50.0), THE maintenance diagram, one node at a time: state s1 (diagrams/C23-s1-body.png) → hand:xfade-scale (container-xfade, 0.35s)
        BODY 'home robot, on sale, delivery not confirmed' lit, SKILLS and ORDERING dim, the centre an empty dashed outline
        `[VERIFY NEO delivery status at render]`
5:43.1  SAY:  "The robot already in your house loads the skill of an expert electrician, orders the wire and the parts it
              needs and does the repair."
5:44.6  [DIAGRAM] C23 state s2 (diagrams/C23-s2-skills.png) on "loads" (344.55): SKILLS 'learned from demonstrations, lab demo'
        lights
5:46.8  [DIAGRAM] C23 state s3 (diagrams/C23-s3-ordering.png) on "orders" (346.81): ORDERING 'AI completes the purchase, live'
        lights
5:48.9  [DIAGRAM] C23 state s4 (diagrams/C23-s4-arrows.png) on "does the repair" (348.93): the three arrows draw into the centre,
        '?' fades in
5:50.0  [VIDEO] BR-18 IN (350.00 → 354.00, 4.0 s): assets/vid/BR-18-roof-dripping-rain.mp4, water dripping from a roof leak, no → hand:fade (broll-fade, 0.50s)
        robot on a roof (dissolve; a cutaway, C23 returns after it)
5:50.1  SAY:  "A leak in your roof."
5:51.3  SAY:  "Same thing."
5:52.1  SAY:  "It goes up the ladder and fixes it."
5:54.0  [DIAGRAM] C23 RETURNS at state s4 (diagrams/C23-s4-arrows.png, 353.97 → 6:04.4) on "Can it do that today?": the same → hand:xfade-scale (container-xfade, 0.35s)
        diagram continuing, not a second diagram
5:54.0  SAY:  "Can it do that today?"
5:55.4  SAY:  "In 2026?"
5:57.1  [DIAGRAM] C23 state s5 (diagrams/C23-s5-notfound.png) on "No." (357.07): '?' out, 'ALL THREE, IN A HOUSE' + the red 'NOT
        FOUND' stamp, the border solid red. No sound on the stamp (the one accent is kept for C36)
5:57.1  SAY:  "No."
5:57.8  SAY:  "Nobody's put those pieces together inside a house yet."
6:00.6  SAY:  "But my prediction is that by 2029, it will."
6:00.9  [DIAGRAM] C23 comp-level step on "my prediction" (360.85): 'NOT FOUND' shrinks into 'TODAY: NOT FOUND', 'MIKE'S
        PREDICTION' fades in, the border turns gold
6:02.3  [DIAGRAM] C23 state s6 (diagrams/C23-s6-prediction.png) on "2029" (362.27): '2029' rises in, gold glow; labelled as his
        prediction, held to 364.42
6:04.4  [RECEIPT] S3 LEAD-IN IN (364.42 → 369.59): receipts/S3-clip61-lead-in.png, CLIP-61's FIRST frame held as a still under
        the set-up line, slow push; treatment: push. No number of his on screen before he says it
6:04.6  SAY:  "And Elon Musk goes even further than that."
6:04.9  [MUSIC] HARD HIT (MUSIC-PLAN 364.9, "by 2029, it will"): the pickup at the end of bar 55 (file 197.1-197.75) swells on
        spine 364.9-365.6, about 0.6 s after the line, and resolves to the verse, not the chorus. No SFX
6:05.6  [MUSIC] Bed A row 12 (instrumental_4_22.wav, source_in 141.281, bars 40-46 in delivered time with CLIP-61's pause
        inside, ducked under him), -25.5 dB, aggressive, 1.2 s fade-out over 380.07-381.27 → 6:21.3. CLIP-61 is 5.7 s, not
        the planned 6.0: nothing to fix (the row ends in a fade, MUSIC-PLAN if_a_clip_length_changes)
6:06.9  SAY:  "This is what he said at a G20 meeting this September."
6:09.6  [INSERT] CLIP-61 SPLICED CLIP, 5.7 s: the spine PAUSES at 369.59 (snaps into the 369.49-369.71 trough after
        "September", about 369.592, before FACE-5's first frame 369.625) and assets/clip-inserts/CLIP-61-musk-g20.mp4 plays
        FULL-FRAME with Elon Musk's OWN voice ("ten years from now, I would say there are well over a billion humanoid
        robots"), caption 'Elon Musk, G20 Innovation Ministerial, September 2026'; the bed ducks automatically · [TRANSITION]
        insert-in → hand:fade (insert-in, 0.50s) (bucket insert). The C29 fallback card is not needed (captured, visual-qa PASS) `[VERIFY
        the words on the captured audio]`
6:09.6  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.76s) (face pick; 369.625)
        = CLIP-61's insert-out (ONE move: his last frame dissolves to Mike's face)
6:09.6  [FACE] F5 IN → 6:15.3 (369.625-375.325, 5.70 s): no join inside: no punch, no leak
6:09.6  [CAPTION] ON → 6:15.3 (F5, face hold over 5 s; FACE window only; house style)
6:09.8  SAY:  "A robot doesn't need to be a better electrician than you."
6:12.8  SAY:  "It just needs to be already in the house and receive an expert electrician download."   (the window closes
              inside "and"; from "receive" (375.57) it runs on black: the ad-lib is COVER)
6:15.3  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.76s) (375.325)
6:15.3  [IMAGE] IMG-8 IN (375.325 → 377.90, 2.6 s): assets/img/IMG-8-light-stream-robot-head.png, a thin line of light into the → hand:cross-warp (glitch-still, 0.50s)
        back of a humanoid's head ("download"); slow push-in; ingress → hand:film-burn (face-cut, 0.76s) (soft, per the brief)
6:17.9  [RECEIPT] C25 IN (377.90 → 381.32): receipts/C25-1x-order.png, the 1X order page, 'Home Robot' and 'US Deliveries start → hand:xfade-scale (container-xfade, 0.35s)
        2026.' in view; treatment: highlight (the receipt for "not in the house yet") `[VERIFY deliveries at render]`
6:17.9  SAY:  "The problem here is that it's just not in the house yet."
6:20.1  [HIGHLIGHT] C25: 'US Deliveries start 2026.', the wipe lands on "not in the house yet" (380.07)
```

## CH4 - IT WON'T BE ME (6:21.4-7:19.4; Bed A the low breakdown, the thinnest, ducked under every clip; card OFF)
```
6:21.3  [MUSIC] Bed A row 13 (instrumental_4_22.wav, source_in 113.046, the low breakdown bars 32-37, entering hard on its own
        first-beat accent as the heavy verse finishes fading), -23.0 dB (23.3 under the VO), dip → 6:42.4 · HARD HIT
        (MUSIC-PLAN 381.3, CH4 opens on "And yet people ask"): the 1.2 s fade of the heavy verse, then the breakdown's accent,
        where the beat grid re-phases for the second movement. A soft change, no SFX
6:21.3  [VIDEO] BR-19 IN (381.32 → 383.70, 2.4 s): assets/vid/BR-19-commuters-dark-hall.mp4, people walking to work, no face → hand:fade (broll-fade, 0.50s)
        singled out (dissolve)
6:21.4  SAY:  "And yet people ask about their own job and most of them are not even worried."
6:23.7  [VIDEO] BR-20 IN (383.70 → 385.72, 2.0 s): assets/vid/BR-20-escalator-subway-commuters.mp4, commuters on an escalator, → hand:fade (broll-fade, 0.50s)
        calm, wide (dissolve)
6:25.7  [CHART] C32 IN (385.72 → 6:34.5), THE chapter's centrepiece, state start (C32-start.png spec): 0% and 100% lines, two → hand:xfade-scale (container-xfade, 0.35s)
        empty slots; source line 'Quinnipiac University Poll, March 2026'
6:25.8  SAY:  "In one poll in March, 70% of Americans said AI will cut jobs."
6:27.6  [CHART] C32 red bar grows on "70" (387.61), '70%' counts, lands 388.41 = state mid (C32-mid.png); 'say AI will cut jobs /
        US adults' at 388.73
6:30.7  SAY:  "But only 30% of these people with a job were worried about their own."
6:31.2  [CHART] C32 cyan bar grows on "30" (391.19), '30%' lands 391.79 = state payoff (C32-payoff.png); 'worry about their own
        job / adults with a job' at 391.95. 'Worry', never 'think their job is safe'
6:33.3  [CHART] C32 the red glow eases off, cyan takes it on "worried" (393.27)
6:34.5  [CHART] C33 IN (394.47 → 6:42.2), state start (C33-start.png spec): two panels, eight dim figures; a quick cross-fade
        from C32 reads as the poll narrowing to blue-collar
6:34.6  SAY:  "Blue collar workers show it the most."
6:36.7  SAY:  "Around three in four expect AI to cut jobs and three in four are not worried about theirs."
6:37.0  [CHART] C33 left figures 1 to 3 light red on "three in four" (396.95)
6:37.8  [CHART] C33 state mid (C33-mid.png) on "expect" (397.83): 'about 3 in 4' + 'say AI will cut jobs'
6:40.0  [CHART] C33 right figures 1 to 3 light cyan on "three in four" (399.99)
6:40.7  [CHART] C33 state payoff (C33-payoff.png) on "are not worried" (400.69): 'about 3 in 4' + 'are not worried about theirs'.
        Rounded wording only, never a decimal
6:42.2  [RECEIPT] CLIP-42 LEAD-IN IN (402.23 → 403.41): CLIP-42's FIRST frame held as a still (a frame grab of
        assets/clip-inserts/CLIP-42-tradeswoman.mp4 in the comp, name bar already handled) under the set-up line; treatment:
        push (slow)
6:42.2  SAY:  "Here's what it sounds like."
6:42.4  [MUSIC] Bed A row 14 (instrumental_4_22.wav, source_in 105.987, bars 30-37 in delivered time with the 23.8 s run
        inside), -25.5 dB (21.1 under the VO): 0.97 s of plateau C lifts under "what it sounds like", the fall into the
        breakdown plays under the clips, Mike returns on bar 37 → 6:46.9
6:43.4  [INSERT] CLIP-42 SPLICED CLIP, 5.7 s (run slot 1 of 3): the spine PAUSES at 403.41 (snaps into the 403.25-403.51 trough
        after "like"; the JSON shows no gap) and assets/clip-inserts/CLIP-42-tradeswoman.mp4 plays FULL-FRAME with her OWN
        voice ("A robot's never going to be able to do what we do..."), caption band at the TOP 'Tradeswoman, CNBC, Mar
        2026'; the bed ducks automatically · [TRANSITION] insert-in → hand:fade (insert-in, 0.50s) (bucket insert). Spoken to as a belief,
        never mocked
6:43.4  [INSERT] CLIP-40 SPLICED CLIP, 8.4 s (run slot 2, back to back), own voice, caption band at the TOP 'Car technician
        apprentice, CNN, Jun 2026'; CNN's name bar hidden (boxblur timed to the bar, visual-qa round 3) · [TRANSITION] hand:cut
        (clip to clip inside the run)
6:43.4  [INSERT] CLIP-51 SPLICED CLIP, 9.7 s (run slot 3), the interviewer's and the shipbuilder's own voices, caption
        'Shipbuilder, San Diego, May 2024' `[VERIFY re-listen "build"]` · [TRANSITION] hand:cut in, insert-out
        → hand:fade (insert-in, 0.50s) (bucket insert) onto its lead-out still
6:43.4  [RECEIPT] CLIP-51 LEAD-OUT IN (403.41 → 404.00): CLIP-51's LAST frame held as a still (a frame grab in the comp) under
        the resume line's first words; treatment: push (no move, 0.6 s)
6:43.4  SAY:  "I get why people say it."
6:44.0  [VIDEO] BR-21 IN (404.00 → 406.62, 2.6 s): assets/vid/BR-21-hands-fasten-belt.mp4, hands buckling a worn tool belt → hand:fade (broll-fade, 0.50s)
        (dissolve). Speaks to the belief, never to a person
6:45.4  SAY:  "Nobody wants to believe that the thing they spent years getting good at can be done by a machine."
6:46.6  [VIDEO] BR-22 IN (406.62 → 409.82, 3.2 s): assets/vid/BR-22-hands-metalwork-bench.mp4, skilled hands at a bench, slow → hand:fade (broll-fade, 0.50s)
        (dissolve)
6:46.9  [MUSIC] Bed A row 15 (instrumental_4_22.wav, source_in 105.987, bars 30-39 in delivered time with CLIP-44's 23.6 s
        inside), -25.5 dB: two bars of plateau C, the fall into the breakdown at 413.94 between "somebody else" and "Listen",
        the breakdown under her → 6:58.6
6:49.8  [RECEIPT] C34 IN (409.82 → 414.42): receipts/C34-quinnipiac-poll.png, the Quinnipiac release (page 4, the professor's → hand:xfade-scale (container-xfade, 0.35s)
        name as printed); treatment: highlight (the receipt for "the pattern")
6:50.0  SAY:  "And notice the pattern."
6:51.3  SAY:  "Almost everyone expects this to happen to somebody else."
6:51.3  [HIGHLIGHT] C34: 'Americans are more worried about what AI may do to the labor market than about what it may do to
        their own jobs.', the wipe lands on "Almost everyone expects" (411.33)
6:54.4  [RECEIPT] S4 LEAD-IN IN (414.42 → 416.91): receipts/S4-clip44-lead-in.png, CLIP-44's FIRST frame held as a still under
        the set-up line, slow push; treatment: push. Her first name (said by the reporter before the window) stays out
6:54.6  SAY:  "Listen to how this woman in a trade program puts it."
6:56.9  [INSERT] CLIP-44 SPLICED CLIP, 23.6 s: the spine PAUSES at 416.91 (in the measured 416.81-417.01 trough after "it",
        never the JSON's 417.03) and assets/clip-inserts/CLIP-44-construction-trainee.mp4 plays FULL-FRAME with her OWN
        voice, caption band at the TOP 'Construction trainee, Fox Business, Nov 2025'; the bed ducks automatically ·
        [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert)
6:56.9  [RECEIPT] CLIP-44 LEAD-OUT IN (416.91 → 417.41): CLIP-44's LAST frame held as a still (a frame grab in the comp) for
        the first half second of the resume line (COVER-PLAN note); treatment: push (no move)
6:57.2  SAY:  "A study in Germany measured that gap."
6:57.4  [RECEIPT] R-IZA IN (417.41 → 419.50): receipts/R-IZA-dp16687.png, the IZA Discussion Paper 16687 title page; treatment: pan → hand:xfade-scale (container-xfade, 0.35s)
        (a paper shown as an OBJECT: the study exists) · [MOTION] lib:motion-3d-pan-2-up `[VERIFY]`
6:58.6  [MUSIC] Bed A row 16 (instrumental_4_22.wav, source_in 113.046, the breakdown once more, bars 32-39 exact, counted back
        from the ending), -23.0 dB (23.3 under), dip → 7:26.8; the sparse bar 37 falls on 436.22-439.75 under F6
6:59.5  [CHART] C36 IN (419.50 → 7:08.3), state start (C36-start.png spec): the 0-100% track, ticks, axis caption; title → hand:xfade-scale (container-xfade, 0.35s)
        'Workers in the most automatable jobs, Germany, 2022'. Tasks, never job loss
6:59.7  SAY:  "Workers in the jobs most exposed to automation guessed that about 30% of their work could be done by a
              machine."
7:02.2  [CHART] C36 the cyan marker drops onto 30% on "guessed" (422.17)
7:03.0  [CHART] C36 state mid (C36-mid.png) on "30" (423.03): '30%' + 'what they guessed'
7:06.5  [CHART] C36 the gradient segment extends from 30 toward 75 on "The measured figure" (426.51), the red marker on its tip
7:06.5  SAY:  "The measured figure was 75."
7:07.5  [CHART] C36 state payoff (C36-payoff.png) on "75." (427.49): the red marker lands at 75%, '75%' + 'what was measured' +
        '45-point gap'
7:08.1  [ACCENT] accent-timpani-clicker-01-b (accents/accent-timpani-clicker-01-b.wav, mood_class neutral) file start 428.14,
        the ONE sound effect of the video, AFTER the line, never over it: "75" measured on the spine at 427.78-428.12, silence
        428.14-428.40, "And" from 428.42. Instant attack (peak 40 ms in), measured tail 1.61 s to -40 dB, so the ring sits
        low under "And the translator"; the payoff has been on screen since 427.49. Seat it under the VO (video-qa
        short-term check on the chunk)
7:08.3  [RECEIPT] S5 IN (428.30 → 435.092): receipts/S5-clip20-translator.png, a still from CLIP-20 with the caption
        'Translator, 15 years in the job', slow push, held; treatment: push. No name, no handle; a still, never her clip
        muted under Mike; clears before F6
7:08.3  SAY:  "And the translator you heard at the start of this video had more than 15 years in her job."
7:13.0  SAY:  "She says AI took her livelihood."
7:15.1  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.76s) (face pick; 435.092)
7:15.1  [FACE] F6 IN → 7:18.0 (435.092-438.025, 2.93 s): no join inside: no punch, no leak; no caption (under 5 s)
7:15.2  SAY:  "Feeling safe isn't the same thing as being safe,"
7:18.0  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s) (438.025)
7:18.0  [VIDEO] BR-23 IN (438.025 → 441.20, 3.2 s): assets/vid/BR-23-window-silhouette-city.mp4, a person at an office window → hand:fade (broll-fade, 0.38s)
        at dusk, seen from behind (dissolve); covers the ad-lib on black and carries into CH5
7:18.4  SAY:  "unfortunately."
```

## CH5 - WHAT NOW (7:19.4-7:55.3; Bed A one dip bar, then the chorus tail RIGHT-ALIGNED; card OFF)
```
7:19.4  SAY:  "So what does this mean for you?"
7:21.2  [VIDEO] BR-24 IN (441.20 → 443.50, 2.3 s): assets/vid/BR-24-dark-corridor.mp4, an empty office corridor, lights off, → hand:fade (broll-fade, 0.50s)
        slow (dissolve)
7:21.3  SAY:  "The damage so far is quiet."
7:23.5  [CONTAINER] quiet-damage IN (443.47 → 7:30.7, card-slides/quiet-damage.png): three rows at rest (the entrance frame → hand:xfade-scale (container-xfade, 0.35s)
        only, under the cross-fade). Words only, no new numbers; one new container in place of re-showing three charts
7:23.6  [CONTAINER] quiet-damage-s1 (card-slides/quiet-damage-s1.png) on "The entry level" (443.60): row 1 'The entry-level job
        that never gets posted' lit
7:23.6  SAY:  "The entry level job that never gets posted, the freelance work that stops coming, the office job already
              expected to shrink."
7:26.2  [CONTAINER] quiet-damage-s2 (card-slides/quiet-damage-s2.png) on "the freelance work" (446.20): + row 2 lit
7:26.8  [MUSIC] Bed A row 17 (instrumental_4_22.wav, source_in 127.164, jump back 4 bars: bar 36 alone, its accent and decay),
        -23.0 dB, dip, 1.2 s cross-fade into the chorus → 7:30.3: the dip the chorus rises out of
7:28.3  [CONTAINER] quiet-damage-s3 (card-slides/quiet-damage-s3.png) on "the office job" (448.30): + row 3 lit, held to 450.725
7:30.3  [MUSIC] Bed A row 18 (instrumental_4_22.wav, source_in 229.517, the chorus bars 65-71 and the ending stroke of bar 72,
        RIGHT-ALIGNED), -27.0 dB (16.3 under the VO, the most weight in the video), aggressive, 1.2 s fade-in · HARD HIT
        (MUSIC-PLAN 450.34): the chorus swells in and is full on "shrink", half a second before F7. No riser, no SFX
7:30.7  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (face pick; 450.725)
7:30.7  [FACE] F7 IN → 7:34.7 (450.725-454.659, 3.93 s; closes about 0.09 s before the JSON end of "changed."); no caption
        (under 5 s)
7:30.9  SAY:  "Don't wait for a layoff announcement to tell you that your job has changed."
7:33.9  [PUNCH-IN] F7 hard ~15-20% step ON the desilencer join 453.933 (frame 13618, jumpcuts-final.json, the video's ONLY
        punch point) → holds to 7:34.7
7:33.9  [LIGHTLEAK] F7 library light leak peaking ON the same join frame (lib:lightleaks-*, screen blend, under nothing: no
        caption on F7) → lib:lightleaks-soft-short-3 (punch-leak, 0.40s) (punch-leak; one leak, so a set of one this video)
7:34.7  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s) (454.659; the spine is black from here to its last frame)
7:34.7  [CONTAINER] end-tiles IN (454.659 → 7:47.0, card-slides/end-tiles.png): the two thumbnails (R-THUMB1, R-THUMB2) as → hand:xfade-scale (container-xfade, 0.35s)
        end-screen tiles, both at rest. The REAL titles on the tiles, no relative date
7:34.9  SAY:  "I made two videos over the last couple of weeks on which jobs are next and how to protect yourself."
7:39.8  SAY:  "This one right here called Literally Every Job Is at Risk."
7:39.8  [CONTAINER] end-tiles-s1 (card-slides/end-tiles-s1.png) on "This one right here" (459.80): tile 1 lit, 'Literally Every
        Job Is at Risk. Here's How to Protect Yourself'
7:42.8  SAY:  "And then this one, AI will wipe out these jobs next."
7:42.8  [CONTAINER] end-tiles-s2 (card-slides/end-tiles-s2.png) on "And then this one" (462.80): tile 2 lit, the real title 'AI
        Will Wipe These Jobs Out Next' (never the VO's wording)
7:45.8  SAY:  "But watch those next and comment below and tell me what the job market looks like for you."
7:45.8  [CONTAINER] end-tiles-s3 (card-slides/end-tiles-s3.png) on "watch those next" (465.80): both tiles lit
7:47.0  [CONTAINER] end-card-cta IN (466.97 → end + hold, card-slides/end-card-cta.png): tiles small in end-screen positions, → hand:xfade-scale (container-xfade, 0.35s)
        prompts at rest, the community lower-third with the logo bug (Mike's plan-gate ruling: it goes on even with no spoken
        cue)
7:47.4  [CONTAINER] end-card-cta-s1 (card-slides/end-card-cta-s1.png) on "comment" (467.37): 'Comment: what does the job market
        look like for you?' lit
7:50.4  SAY:  "And don't forget to click that like button and subscribe if you like videos like this."
7:51.8  [CONTAINER] end-card-cta-s2 (card-slides/end-card-cta-s2.png) on "like" (471.77): 'Like' lit
7:53.0  [CONTAINER] end-card-cta-s3 (card-slides/end-card-cta-s3.png) on "subscribe" (473.01): 'Subscribe' lit, held past
        "this." through the end-card hold
7:55.1  [MUSIC] HARD HIT (MUSIC-PLAN 475.1, the last word): the ending BANG of the file (254.250) lands on the onset of "this."
        (475.07); it rings out over the held end card. No SFX
7:55.3  [END] "this." ends 475.27; the spine ends 475.30. The end card HOLDS 3.0 s more (MUSIC-PLAN end_card_hold, to spine
        478.27): the comp runs past the spine by the hold, the VO is padded with silence, the BANG rings out, then the mixer's
        end fade. The only held end card of the video. The dropped scripted CTA lines are not shown
```

## SFX layer (the whole palette weighed, mood-matched; longform-edited.md section 7)
- Register: gear 2 sober, serious and slightly scary, SLOW; Mike's brief bars booms, risers and impact stacks ("nothing epic"); MUSIC-PLAN asks for no impact and no riser row. Every bed is `leatherface` (G minor, dark-cinematic).
- PLACED (1): accent `accent-timpani-clicker-01-b` (accents/, mood_class neutral, measured tail 1.61 s) at 7:08.1, after "The measured figure was 75." on the C36 payoff.
- Hard hits (7): all are `[MUSIC]` moves the file makes itself (0:00.1, 1:45.0, 2:19.7, 6:04.9, 6:21.3, 7:30.3, 7:55.1); no kit file is layered on any of them, by ruling. There is no vibe cut and no duck row beyond the montage automation and the automatic clip ducks.
- Effects theme `elegant-promo-2022` (C19 run): SILENT in its source and in the screenplay; no sound paired.
- Library transition sounds (face cuts, insert edges, the F7 leak) ride TRANSITION-PLAN.json, levelled by measured peak in mix_music.py; not rows here.

## Orphan reconciliation (zero orphans; renderable files in assets/, source .html/.py/.json exempt per comp-build §10)
- vid/ (24 of 24 PLACED): BR-1 0:13.5 · BR-2 0:17.1 · BR-3 0:48.7 · BR-4 1:07.3 · BR-5 1:10.4 · BR-6 1:15.0 · BR-7 1:44.5 · BR-8 2:04.3 · BR-9 2:24.1 · BR-10 2:25.4 · BR-11 2:28.4 · BR-12 2:40.4 · BR-13 2:42.2 · BR-14 2:54.0 · BR-15 4:50.6 · BR-16 4:53.3 · BR-17 5:38.1 · BR-18 5:50.0 · BR-19 6:21.3 · BR-20 6:23.7 · BR-21 6:44.0 · BR-22 6:46.6 · BR-23 7:18.0 · BR-24 7:21.2. No clip is used twice (rule #12); every slot is 4.0 s or less.
- img/ (8 of 8 PLACED): IMG-1 / IMG-2 / IMG-3 = the photo plates inside C19-1 / C19-2 / C19-3 (0:26.5 / 0:34.7 / 0:40.1); IMG-4 1:48.5 · IMG-5 3:45.0 · IMG-6 4:55.1 · IMG-7 5:39.6 · IMG-8 6:15.3.
- clip-inserts/ (17 of 17 PLACED): the montage CLIP-29, CLIP-3, CLIP-12, CLIP-20, CLIP-2, CLIP-27, CLIP-9, CLIP-24, CLIP-30, CLIP-6, CLIP-16 at 0:00.1 · CLIP-21 2:08.7 · CLIP-61 6:09.6 · CLIP-42, CLIP-40, CLIP-51 6:43.4 · CLIP-44 6:56.9.
- receipts/ PLACED: C2-challenger-october 0:46.1 · R-INDEED 1:04.5 · C5 1:25.9 · C4 1:39.3 · R-CSH 1:50.8 · S1 2:06.8 · S2 2:08.7 · R-HDH 2:45.2 · C13 3:07.2 · R-SHOWCASE 3:23.8 · R-JCT 3:30.2 · C14 3:48.3 · C15 3:52.4 · C16 3:54.9 · C17 4:11.3 · R-KH 4:17.2 · C22 4:41.1 · C24-toyota-atlas 5:14.4 · C24-footage 5:22.4 · C26 5:32.3 · S3 6:04.4 · C25 6:17.9 · C34 6:49.8 · S4 6:54.4 · S5 7:08.3 · R-THUMB1 inside prior-videos-pair, callback-every-job, end-tiles, end-card-cta · R-THUMB2 inside prior-videos-pair, end-tiles, end-card-cta.
- receipts/C2-headline.png BENCH: the report's headline page ('OCT 26 CHALLENGER REPORT / October Layoffs At Three-Year Low'); the 2.55 s slot airs the AI paragraph instead, because it carries the three numbers the cards just showed. Swap in only if Mike wants the report shown as an object (then a pan).
- charts/ (Type 1 ANIMATED, built in CODE to these states; comp-build §7: a chart PNG held with a wipe is a gate violation, so the PNGs are the design spec each state row above names, not comp inputs): C10 start/mid/payoff 0:06.5-0:09.4 · C7 start/mid/both/hiring/payoff 0:52.3-1:03.5 · C6 start/mid/payoff 1:18.2-1:24.5 · C3 start/mid/payoff 1:31.9-1:37.1 · C8 start/mid/payoff 1:54.5-2:02.7 · C8-shift start/mid/payoff 2:12.4-2:17.5 · C11-count start/mid/payoff 2:48.9-2:51.1 · C12 start/mid/payoff 2:58.0-3:05.6 · C21 start/mid/payoff 4:35.8-4:39.9 · C32 start/mid/payoff 6:25.7-6:31.2 · C33 start/mid/payoff 6:34.5-6:40.7 · C36 start/mid/payoff 6:59.5-7:07.5.
- diagrams/ (Type 2 SYSTEM-DESIGN stills, PLACED as comp inputs, comp-level movement only): C11-start 4:25.2 · C11-lane1 4:25.8 · C11-lane2 4:27.2 · C11-lane3 4:27.6 · C11-payoff 4:32.3 · C23-s1-body 5:43.0 · C23-s2-skills 5:44.6 · C23-s3-ordering 5:46.8 · C23-s4-arrows 5:48.9 and 5:54.0 · C23-s5-notfound 5:57.1 · C23-s6-prediction 6:02.3. (diagrams/C11-lane1.png is the diagram state; card-slides/C11-lane1.png is the CH3 spotlight card: two different files.)
- card-slides/ PLACED: prior-videos-pair 0:20.6 · C19-1-overlay 0:26.5 · C19-2-overlay 0:34.7 · C19-3-overlay 0:40.1 · C11-lane1 2:31.6 · C11-lane1-s1 2:35.2 · plug-intro 3:09.3 · plug-intro-s1 3:13.6 · plug-intro-s2 3:14.6 · plug-intro-s3 3:16.3 · plug-goal 3:17.8 · plug-300 3:34.7 · plug-300-s1 3:37.6 · plug-cta 3:40.4 · plug-cta-s1 3:40.5 · C20 4:00.1 · C11-lane3 4:05.3 · C11-lane3-s1 4:08.5 · callback-every-job 4:58.2 · callback-every-job-s1 5:05.3 · callback-every-job-s2 5:07.3 · callback-every-job-s3 5:09.4 · apprenticeship-vs-download 5:10.8 · apprenticeship-vs-download-s1 5:12.7 · quiet-damage 7:23.5 · quiet-damage-s1 7:23.6 · quiet-damage-s2 7:26.2 · quiet-damage-s3 7:28.3 · end-tiles 7:34.7 · end-tiles-s1 7:39.8 · end-tiles-s2 7:42.8 · end-tiles-s3 7:45.8 · end-card-cta 7:47.0 · end-card-cta-s1 7:47.4 · end-card-cta-s2 7:51.8 · end-card-cta-s3 7:53.0.
- card-slides/C19-1.png, C19-2.png, C19-3.png BENCH: the settled full frames (overlay already over its IMG plate); the comp composites IMG-n + C19-n-overlay to run the device motion and must land on these. They air only as the fallback if the device motion fails.
- Empty folders: title-slides/, whiteboard/ (no whiteboard beat, COVER-PLAN `whiteboards` is empty), transitions/ (library assets copied in at comp time). Not in assets/: no face-swap clips, no img-motion clips this video. `_previews/proposed/CLIP-29-creative-director.mp4` (the full-sentence take) is outside assets/, Mike's call at the draft.
