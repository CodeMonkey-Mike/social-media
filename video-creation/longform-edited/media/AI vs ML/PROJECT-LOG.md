# AI vs ML — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created 2026-11-09 by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "AI vs ML"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

**Working title:** AI Engineer vs ML Engineer (alternates for the screenplay to propose: open-loop titles that carry the money gap, e.g. "The $350K Difference Between AI and ML Engineers", "AI Engineer or ML Engineer? Pick Wrong and It Costs You"). Channel: **AI Engineering Simplified** (@aiEngineeringSimplified), NOT the crypto channel: no crypto disclaimer, no cryptorich.vip, delivery to the project root (never longs.json).
**Track:** longform-edited (16:9). **Archetype:** ENERGETIC head-to-head explainer, straight to the point. **Runtime target: 2:15** (hard window 1:45 to 2:29; Mike: "shorter than 2 and a half minutes").
**Spine architecture:** full-screen GATED face (house rule #6), Mike recording on camera. **Captions ON** on every face beat (the running kinetic caption line, see the effects theme below).
**Register:** gear 3 for the hook and the close; gear 2.5 for the body. Peer-EXPERT authority (ai_channel_plan.md ON-SCREEN AUTHORITY rule: never "I'm learning this too").

**THE MODEL VIDEO: Mike's 2023 "How to choose between Growth Marketing and Growth Hacking" (GrowthMarketingMike 005, 1:09).** Plan this video LIKE that one. Its structure, which this video copies beat for beat at the AI vs ML topic:
1. The open: each role named with its own label pop, then who each role is "commonly associated with" (a one-line identity per role).
2. Why the first role exists (a short reason + a reaction beat), then the turn: "as soon as X, you can and should Y" (CAN / SHOULD boxed words).
3. "To sum it up": ONE paper statement card that holds the answer.
4. The DECISION CRITERIA, each one a band over b-roll: "If <condition>, go for <A>" -> the verdict word pops under the band; "If <other condition>, choose <B>" -> the other verdict pops. Three criteria in 005 (product-market fit / virality and reach / market saturation); this video picks the 3 criteria that actually decide AI vs ML (examples to research: math / stats / PhD background vs a software background; whether you want to train models or ship products; what the market is hiring for right now).
5. A VERSUS example over the face: "<thing A> VS <thing B>" (005: "GAMING SOCIAL APP vs A COMPANY THAT SELLS ELECTRICAL FURNACES"). Here: a concrete AI-engineer task vs an ML-engineer task (e.g. "SHIP A RAG SUPPORT BOT vs TRAIN A FRAUD MODEL FROM SCRATCH"; the research picks real, typical examples).
6. Side panels for the two-part "if you have X but not Y" lines.
7. The verdict line ("Therefore, <A> is the key" style), then the SUBSCRIBE plug: subscribe for steady content about HOW TO BECOME AN AI ENGINEER (Mike's words, his ask), then the playlist / next-video pointer.

**THE MONEY ANGLE (the click, Mike):** the thumbnail will imply the difference between the two roles is about **$350,000 a year**. The thumbnail itself is discussed later, but the VIDEO must pay that promise off honestly: research what real compensation data says (Levels.fyi, BLS, Glassdoor / Indeed, company filings, the published AI-lab offers), find the defensible framing in which a ~$350K/year gap is TRUE (e.g. top-of-market total comp for one role at frontier labs vs the median of the other, or a specific level / company comparison) and the framing in which it is NOT. If no honest framing supports ~$350K, DATA.md says so plainly and proposes the nearest true number. Every salary figure on screen carries its source and level / location / year.

**Content sources (research, then improve on them):**
- Reference video (do NOT name or show its creator on screen; Mike never calls out another creator): https://youtu.be/cqDQV5g7zHo ("Don't Waste 2027 on the Wrong Career (ML vs AI Engineer)", 5:37). Its transcript is in `research/ref-cqDQV5g7zHo.transcript.txt` in the project folder. Its points: AI engineers integrate existing models into applications (RAG / vector DB, LLM over customer reviews), focus is software + data engineering, no training from scratch (maybe a fine-tune); ML engineers train models from scratch, need deep math / statistics / data science, training pipelines, validation and test sets; ML hiring competes with PhDs (steeper climb self-taught); AI engineer = a software engineer with a new superpower (self-teachable); day to day: an ML engineer tests for model bias during validation and training, an AI engineer runs A/B tests in production; AI engineers are future-proof (someone still has to integrate and configure the models). Verify each point before it airs; add anything better (job-posting counts, hiring trends, title growth, real job descriptions).
- Mike's own work is the proof: this repo integrates hosted Claude (agent pipelines, `common.py spawn_agent`) and runs self-hosted Whisper on his own GPU (`whisper_jobs.py`); it has never trained a model. That is the AI-engineer side, lived.

**Pillars (each needs DATA.md facts):**
1. What each role does all day (integrate + ship vs train + validate), with real job-description language.
2. The money: the honest numbers behind the ~$350K gap (and which way it runs).
3. Who should pick which: the 3 decision criteria with verdicts.

**Chapter map (~2:15, no title cards: one continuous music bed, the inference precedent):**
- CH1 (0:00 to 0:25) THE TWO ROLES + THE MONEY HOOK, gear 3: the signature open with the two role labels, the money gap stated as a hook.
- CH2 (0:25 to 1:05) WHAT THEY ACTUALLY DO, gear 2.5: the identities, the daily work, the CAN / SHOULD turn, the paper "to sum it up" card.
- CH3 (1:05 to 1:50) HOW TO CHOOSE, gear 2.5 to 3: the 3 decision criteria as bands with verdict pops, the VERSUS stack, the side panels, the money answer.
- CH4 (1:50 to 2:15) THE VERDICT + SUBSCRIBE, gear 3: the verdict line, the subscribe bar ("steady content about how to become an AI engineer"), the next-video pointer.

**EFFECTS THEME: "Energetic" = `kinetic-text-2023`, the WHOLE theme** (`video-creation/assets/effects/library.json`; skill `video-creation/skills/effects-library/effects-library.md`; run `python video-creation/skills/effects-library/scripts/effects_catalog.py report --theme kinetic-text-2023`). Its THIRD source video is 005 itself, catalogued 2026-11-09: use 005's devices where 005 used them (the versus stack, the spin cut into the wave wall at the turn, the paper statement card, the boxed CAN / SHOULD words, the meme insets, the emoji pop, the camera wobble, the bands with a verdict pop, the subscribe bar), plus the 004 / 007 devices where they fit (signature open, keyword pops, caption line, side panels, text wall for the ONE biggest idea). Every [SHOW] line names the device id + the sound id from the library.
**Look:** 005's aqua: the turquoise suede (`themes/kinetic-text-2023/textures/suede-turquoise.jpg`) is the video's colour world for the cards and panels (never keyed behind Mike's face: house rule, never matte or key his face). Montserrat ExtraBold Italic ALL CAPS, yellow key words, the dark-teal bands and panels.

**Open decisions for Mike at GATE 1:** title; the $350K framing the research supports; the 3 decision criteria; the VERSUS pair; the meme insets (which reaction clips, if any: no copyrighted TV clips); music bed (005's `concrete-mazes` if the usage ledger allows); face count.

## Hard constraints (Mike)

- Runtime UNDER 2:30 (Mike). Target 2:15, accept 1:45 to 2:29. Count the spoken words: at Mike's pace ~165 words a minute, the script is ~360 to 400 spoken words. Straight to the point, energetic.
- AI Engineering Simplified channel: peer-expert authority (never a co-beginner), no crypto disclaimer, no cryptorich.vip, delivery to the project root (never longs.json). Accuracy gate: the screenplay's factual claims pass `video-creation/skills/accuracy-pass/accuracy-pass.md` before Mike records.
- Structure modelled on Mike's 2023 005 video (see the brief): role labels open, CAN / SHOULD turn, ONE paper "to sum it up" card, decision criteria with verdict pops, ONE versus stack, the subscribe plug for "steady content about how to become an AI engineer", the next-video pointer.
- Effects: the WHOLE "Energetic" theme `kinetic-text-2023` incl. its 005 devices; every [SHOW] names device id + sound id from `video-creation/assets/effects/library.json`. One music bed for the whole video, continuous, so NO title cards.
- At most 10 `[FACE]` beats (the inference precedent for this channel's energetic format); every FACE beat carries a kinetic-text device.
- The money: every salary number on screen comes from DATA.md with source, level, location and year; the ~$350K thumbnail gap is paid off honestly or the screenplay flags it in OPEN QUESTIONS.
- Never name or show the reference video's creator. No copyrighted TV / cartoon clips in meme insets (005 used a South Park clip: do not reuse that kind of source).
- No em dashes anywhere.

## Decisions

- **2026-11-09 — created.** Working title: AI Engineer vs ML Engineer. Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).
- **2026-11-09 - GATE 1 rulings (partial; the screenplay is NOT approved yet).** Mike: "keep the money angle" = the ~$340K gap
  as researched, in its true direction (top-10% ML engineer $495K vs median AI engineer $155.5K, Levels.fyi US total comp; the
  big checks go to the people who train models, AI engineering is the open door), framing on screen with every number.
  TITLE: "AI Engineer or ML Engineer? Pick Wrong and It Costs You". Still open: "I have never trained a model" confirmed as
  true, the next-video pointer, and SCREENPLAY.md OPEN QUESTIONS 3 to 12.
- **2026-11-09 - GATE 1 (screenplay) APPROVED** by Mike ("yes the screenplay is approved"). Confirmed: "I have never trained
  a model" is true. Next-video pointer = the inference video (end-screen slot; the spoken line stays "And watch this video next.").
  Every other OPEN QUESTION takes the screenplay default.
- **2026-11-10 - GATE plan APPROVED** by Mike ("Approved. Please proceed to the next gate."), taking the recommended call on
  every open question: (1) CH1 5.25-8.27 headline AT THE TOP: A $340K GAP over the unlabelled cash stacks, with the framing
  line TOP 10% VS TYPICAL · LEVELS.FYI · US · TOTAL COMP · 2026 in the same asset (screenplay rule: never the number without
  its framing line; the line names no role, so the direction stays withheld until 112.02); (2) C6 Levels.fyi AI Engineer page
  stays before the C3 chart; (3) the paper card prints his spoken wording with the Chip Huyen credit; (4) CLIP-2 stays out.
  The music plan is approved as proposed. COVER-PLAN.json edited + BROLL-PLAN / EDIT-PLAN-prep re-rendered (pre-gate copy in
  the session scratchpad).
- **2026-11-10 - After Effects stopped (Mike, ~20:47):** "stop popping open the after effect app ... the effect is not worth
  it". The slide-builder was paused and ended, After Effects closed; its finished Scene_22 render was encoded with ffmpeg only
  to `assets/kt-renders/wave-wall.mp4` (poster `card-slides/wave-wall.png`). Rule now in effects-library.md §3 item 5:
  template devices are optional, never the AE app, bench on any issue. kt-boxed-words = Remotion code, kt-emoji-pop drops
  unless a headless render works.
- **2026-11-10 - GATE blueprint APPROVED by Claude on Mike's delegation** ("can you take this all the way to the draft gate
  so that I see the draft video when I wake up?"). Repairs first: reconcile_docs failed on 6 [TRANSITION] rows with no
  prefixed id (0:00.0, 0:05.2, 0:50.8, 0:58.1, 1:17.6, 1:22.4); each got its TRANSITION-PLAN id written on (two are the
  strategist's swaps to the face pick `hand:kt-whip-cut`), and the CUE-SHEET face-cut summary was rewritten to the resolved
  picks (pre-fix copies in the session scratchpad). RECONCILE PASS, EDIT-PLAN-LINT PASS (225 events). Checked: the $340K
  hook + its framing line (0:07.7), C3 bar 1 = AI ENGINEER, MEDIAN 155.5K, the shake on "My God, dude" (1:50.8), the 339.5K
  bracket TOP 10% ML ENGINEER VS AI ENGINEER MEDIAN, the 4-slot end screen held 2.0 s to 147.00, zero em dashes. The draft
  gate stays Mike's.
- **2026-11-11 ~01:26 - BUILD DONE, waiting at GATE draft (Mike's).** card_pauses (nothing to bake) -> captions -> comp_build
  (AIVsML.tsx) -> verify_comp (8 gates PASS) -> mix_audio: `_previews/AI vs ML-draft-v1-mix.mp4`, 147.00 s, 1920x1080 30 fps,
  -19.2 LUFS, peak -2.1 dBFS. Claude's spot check (12 frames + loudness curve, `_previews/qa/claude-spot/`) matched the
  blueprint. comp-builder deviations: kt-whip-cut lens OFF (render cost), the 0:44.9 emoji DROPPED, CAN / SHOULD boxes built
  in code. Flags for Mike's review (draft notes, not fixed): (1) the end hold is near-silent: the stab + echoes play at the
  -31 dB under-VO seat, about -50 dBFS with no voice over them; a lift on the last bed row after 145.0 is the fix if he wants
  the hold to ring; (2) lib:lightleaks-6 at the F7 punch (2:14.6) whites his face out for about 7 frames (a softer leak is a
  one-id swap); (3) the C12 LinkedIn headline is clipped at the left edge through the 3D pan until about 1:24.7.
  Code fix: `scripts/render_comp.py` now allows the MUSIC-PLAN end_card_hold in its length check (it exited 1 on the
  complete draft, and would have failed `final_render` after the draft approval); verify_comp / verify_final already did.
- **2026-11-11 - GATE draft APPROVED (Mike: "it is excellent! you can proceed with the final render").** The three draft
  flags stay as built (quiet end hold, the F7 leak, the C12 swivel). Levels.fyi re-pulled at render: the ML top 10% moved
  495K -> 500K (gap 339.5K -> 344.5K), medians unchanged. Mike's ruling: keep the 2026-11-09 read on C3 (dated source
  line, matches the spoken numbers); figures in DATA.md section 5. Final render launched on thread `longform-AI vs ML-c`.
- **2026-11-11 ~05:55 - DELIVERED, GRAPH DONE.** final_render (crf 18) -> verify_final (147.00 s, -19.2 LUFS, peak -2.1 dBFS,
  same as the approved draft) -> definition_of_done (first pass failed on an empty yt-delivery.json; Claude wrote it, the
  re-drive passed) -> stage_longform: `AI vs ML-FINAL.mp4` (151 MB, 1920x1080 30 fps) + publish-meta.json + YT-DELIVERY.md
  at the project root, NOT queued (longs.json checked: untouched), usage ledger recorded.
- **2026-11-11 - upload note (Mike, `Screenshot 2026-11-11 072902.png`):** YouTube would not accept the four end-screen video
  elements in the tight slots we drew; Mike spaced them out in Studio, so they cover the WATCH NEXT title and the arrows. Not
  fixed in this video (already uploading). Saved as the END SCREEN rule in `skills/broll-and-containers/broll-and-containers.md`
  for future end cards.
- **2026-11-11 - VERTICAL render complete but v_render FAILED (graph bug, fixed):** the vertical picture rendered in full
  (`_previews/vertical/AI vs ML-VERTICAL-v1-video.mp4`, 4410 frames = 147.0 s, 3 chunks, 10.5 min, same as the 16:9 FINAL),
  but v_render expected 4356 frames (the 145.2 s paused spine) and ignored the 1.8 s end-card hold. Fixed in
  `graph/vertical_graph.py` v_render (expected frames now include `_end_hold_extra`, like verify_comp / verify_final), and
  re-driven at 09:24 (fresh run, same thread): v_render skips on the present file, then mix + verify + GATE vertical.
  The re-drive waits in the run queue behind `vertical AI destroying lives`.
  Mike paused that run instead; the waiting entry was cancelled and re-launched with `--skip-queue` at 09:28.
- **2026-11-11 09:30 - GATE vertical (waiting on Mike):** `_previews/vertical/AI vs ML-VERTICAL-v1.mp4` (147.00 s = the 16:9
  FINAL, 1080x1920 30 fps, 9.0 Mbps, -19.2 LUFS, the same 6 beds + 60 SFX). Face centring on all 7 FACE windows: 51, 50, 50,
  52, 50, 51, 54% (crop 62.2% center). Claude spot check (`_previews/vertical/qa/claude-spot/sheet1-2.jpg`, `detail.jpg`,
  every 4 s + detail around the motion beats): nothing clipped or unreadable; the gray frame at 0:49 is the paper backdrop
  before the CAN / SHOULD boxed words pop, the 1:24-1:26 LinkedIn receipt is mid slide-in (fully legible at 1:26.5).
  FLAGS for Mike: (1) the wave wall at 1:13.5 is the 16:9 render scaled to cover (per `_state-cues.md`), so the SHIP / TRAIN
  rows run off both edges; (2) the end card keeps the four empty WATCH NEXT slots, stacked; Shorts / Reels / TikTok have no
  end-screen elements, so nothing will fill them. Resume: `run.py vertical --project "AI vs ML" --resume --approve vertical`
  (copies it to `AI vs ML-VERTICAL.mp4` at the root). Next: the 30 s short (`run.py short --project "AI vs ML" --seconds 30`),
  in a NEW session (Mike, testing a fresh-session handoff).
- **2026-11-11 ~09:50 - VERTICAL TRIMMED (Mike: "the vertical video should cut off at 2:19. 'watch this next video' should not
  even be said"):** `_previews/vertical/AI vs ML-VERTICAL-v2.mp4` = v1 cut by ffmpeg at 139.567 s (frame 4187), in the 50 ms
  VO trough between "...your AI engineering journey." (ends ~139.52) and "And watch this next video" (starts ~139.59), with a
  120 ms audio fade-out ending at the cut (re-encoded H.264 8.8 Mbps + AAC 192k; tail measured clean, no "And"). The whole
  end-screen section (the four WATCH NEXT slots, flag 2 above) is gone; the end card's zoom-in starts in the last ~2 frames.
  `v2-video.mp4` = its picture (stream copy) so the graph resolves v2 as the latest vertical. Recorded as GRAPH-PROGRESS
  setting `vertical_end_sec: 139.567`, which v_verify_final and the short lane (s_preflight clock check, s_cut_plan span
  bound) now honour (code: `graph/vertical_graph.py`, `graph/short_graph.py`, uncommitted). Mike watched v2: "looks good like
  that". GATE vertical still open: approving it promotes v2 to `AI vs ML-VERTICAL.mp4` at the root.

- **2026-11-11 ~15:39 - SHORT DELIVERED + PROJECT COMPLETE (Mike: "it is approved, let's close out this project").** GATE
  vertical approved 09:59 (v2, 139.6 s, promoted to `AI vs ML-VERTICAL.mp4`). Short: `run.py short --seconds 30`; first pass
  failed at s_render on a full C: (1.2 GB free, the 5 GB floor), re-driven after space came back. 3 spans (hook 0.0-8.25 FACE,
  body 110.72-122.65 COVER, kicker 123.70-130.35 FACE) + the shared CTA; new variants IMG-1, IMG-4, BR-9, BR-1 + BR-10
  auto-waived (longform's own clips). `AI vs ML-SHORT-30s.mp4` (30.00 s, -21.7 LUFS, peak -5.5) at the root, not queued.
  Marked complete (`PROJECT-COMPLETE.json`); cache sweep BLOCKED (AI destroying lives short running, pieverse in progress),
  nothing deleted.

## Open flags (load-bearing)

- **2026-11-10 recording** `raw/2026-11-10 10-05-37.mkv` (13:04). Launched with `--enhance-speech on` (Mike: the WAV for
  Adobe Podcast before the spine is final). Defumble 784.2 s -> 352.7 s; coarse desilence (0.7 s, pad 0, no keep-face-pauses)
  -> `spine/ALL.c.desilenced.mp4` 143.5 s = 2:23.5. Mike's 3 spoken instructions carried out and cut (the 1:54 cough, the
  8:19-8:51 audio interruption, the 12:27 end note).
- **END HOLD (Mike, spoken in the recording AND repeated at spine_review 2026-11-10):** hold 2 s after the last "Or even
  this one!" before the video ends. The defumbler kept a 2.5 s tail, the desilencer cuts it (the spine ends on the last
  word), so the BUILD adds it: the comp runs 2.0 s past the spine's last word (end screen + bed, no cut to black first).
- **2026-11-10 spine_review (Mike):** (1) the ad-lib "which is something that I've been thinking about lately. Hmm, how to
  cut those costs." is a FACE scene (it was blacked: coarse spine ~0:53-0:58); (2) "That's a $340,000 gap, and it goes to the
  people who train the models." was recorded as a COVER read: COVER, not face. Both fixed by hand on `ALL.b.blackout.mp4`
  (blackout_spans.py, frame-QA'd; old file kept in the session scratchpad); FACE windows now 7. No bursts, no other notes
  (then Mike restored "My god, dude.", see above). FINAL silence: intro 0.25 s, body 0.5 s; sentence residual 50 ms each side of a cut on
  COVER scenes only (`--pad-tail 0.05 --pad-head 0.05`, both passes, so the coarse pass was redone). Re-driven on thread
  `longform-AI vs ML-c` after the "My god, dude." restore (spine a/b re-rendered by hand, the stale c/d moved to the session
  scratchpad); resume its gates with `--thread "longform-AI vs ML-c"`.
- **END SCREEN = 4 video slots** (Mike named "this next video / this one / this one / this one" on purpose); the inference
  video is one of them. The music plan's hit on "next" moves with the new wording.
- **"My god, dude." RESTORED (Mike 2026-11-10: "intended to express amazement ... please keep that in").** The defumbler
  had dropped it as an aside (recording 598.03-601.73); the defumble was re-rendered without that cut (remove_spans.py, 16
  cuts, 356.37 s). It is COVER (eyes off camera, between the $495K and $340K cover lines): it plays over the money chart, a
  reaction beat right after the $495K number lands. Captions / as-recorded: an AD-LIB, keep it.
- **Ad-libs kept (count against 2:29):** "which is something that I've been thinking about lately. Hmm, how to cut those
  costs." and "Something to ponder."
- **ACCURACY:** the only take says "the typical engineer in the US makes around $155,000 a year" (no "AI", no "On
  Levels.fyi"): the C3 money chart MUST label it AI ENGINEER median, Levels.fyi US total comp, with the source line.
- **Hook wording:** "At the top, the pay gap between them is huge." (no "340 thousand" in CH1); "the other one gets the
  door open". The $340K lands on "That's a $340,000 gap."
- **Whisper medium mishears** (for the transcriber / captions): rolls -> roles, Billing -> Building, Post -> Host,
  Cloud -> Claude, won -> want.
- **Possible tiny click** (-41 dB) between "Building it," and "training it": about 0:24.5 on the coarse spine.
