# AI destroying lives — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created 2026-11-09 by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "AI destroying lives"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

**Working title:** "AI Is Wiping Out All These Jobs" (alternate: "All These Jobs Are Wiped Out"). **Thumbnail text:** "AI Is Destroying Lives".
**Channel:** CryptoRich (Mike's crypto channel). **Track:** longform-edited (16:9). **Archetype:** a serious, slightly scary human-impact explainer at a SLOW pace (not the house energetic pace): it should feel heavy, never hype.
**Runtime target: 6:00** (hard window 5:30 to 6:30), the opening clip montage included.
**Spine architecture:** full-screen GATED face (house rule #6). **Captions ON.**
**Register:** gear 2 (sober, measured) for most of the video; gear 3 only for the CH1 promise line and the close.

**A follow-up to two published videos** (refer back to them, never re-run them):
- "Literally Every Job Is at Risk. Here's How to Protect Yourself" (youtu.be/dKwFdQMXv-c, 2026-10-08)
- "AI Will Wipe These Jobs Out Next" (youtu.be/Ccriu5vuxf8, 2026-10-27)
Their transcripts: `refs/prior-videos/dKwFdQMXv-c.txt` and `refs/prior-videos/Ccriu5vuxf8.txt` in this project folder. Read both: the jobs they already covered are NOT new material here (a one-line callback at most).

**Opening thesis (every claim verified in DATA.md before it airs):** this is not a future threat. Real people are already out of work and have been searching for months, in fields that felt safe two years ago, and the next wave reaches the physical trades people are sure no robot can do.

**Pillars:**
1. **THE PEOPLE (CH1).** The human cost first, in their own voices: a montage of real people who have been looking for work for a long time (software engineers, graphic designers, and more: copywriters, illustrators, translators, voice actors, customer support, recruiters, junior analysts, whatever the research finds), at least a full minute of it before Mike says a word.
2. **THE JOBS ALREADY LEAVING THE MARKET (the main focus of the video).** Hard figures, occupation by occupation, for work that is already disappearing where AI is a documented driver: job postings by occupation, employment / openings data (BLS, JOLTS, Census), layoffs attributed to AI, entry-level and new-graduate hiring in AI-exposed jobs, freelance-market demand for writing, design and translation. Prefer jobs Mike has not covered before.
3. **THE JOBS NOBODY BELIEVES ARE AT RISK.** Physical trades. Someone told Mike about maintenance workers and welders: people do not believe a robot with a humanoid body can do those tasks as well as a human. Show where it actually stands: humanoid robots (Figure AI first; also the others with real factory / warehouse pilots), robotic and cobot welding already in production, inspection and maintenance robots. Separate real deployments from demos, honestly; the scary part has to be true.
4. **CLOSE.** Serious, not a pitch: what this means for the viewer, then the standard persona CTA, pointing to the two earlier videos.

**Chapter map (6:00):**
- CH1 (0:00 to about 1:20) THE PEOPLE, gear 2. Opens directly on the clip montage (it IS Chapter 1, nothing before it): at least 60 s of real people's own clips, about 2 to 10 s each (vary it: some 2 to 3 s fragments, some 8 to 10 s stories), flipping from one person to the next. Then Mike's first FACE line lands the promise of the video. Music: Leatherface at its subtlest, creeping in.
- CH2 (about 1:20 to 3:30) ALREADY LEAVING, gear 2, mostly COVER: the figures, job by job. The "Elegant Promo" fact-card run (below) lands in this chapter.
- CH3 (about 3:30 to 5:15) THE ONES NOBODY BELIEVES, gear 2 rising: maintenance, welding, humanoid robots, the disbelief and then the evidence.
- CH4 (about 5:15 to 6:00) WHAT NOW, gear 3 close, standard CTA, the two earlier videos named as the next watch.

**THE LOOK (Mike's picks for this video):**
- **Music: ONE song for the whole video:** `leatherface` (Wicked Cinema "Leatherface", already in `video-creation/assets/music/library.json` with its intro / verse / chorus cuts and the full track). It is the bed of Mike's 2022 "European Energy Crisis in 2022 Explained" video. Every chapter is scored from this one song, choosing subtle vs aggressive passages per chapter from the catalog's waveform analysis (`analysis.env`, `segments`, `aggression` per cut); no second track.
- **Effect:** the "Elegant Promo" montage at 1:08 of that same 2022 video (dark iris open on a photo, liquid blob burst, magenta curve, teal label with a typed-on headline and a subtitle, a white circle pop to the next card). Catalogued as effects theme `elegant-promo-2022` in `video-creation/assets/effects/library.json` (pick it there by device id). Use it for a run of 2 to 4 labelled fact cards over photos or footage, the way the 2022 video did ("FEBRUARY 2022" / "G7 GROUP" / "ESSENTIAL REVENUES").
- **Pace: SLOW** everywhere except the CH1 montage's clip-to-clip flipping: soft transitions, sparse SFX (no booms, risers or impact stacks), covers held long, nothing epic.

**Open decisions for Mike at GATE 1:**
- Title and thumbnail pairing (above).
- Mike's note "Figure and sense": read as BOTH Figure AI (and possibly Sanctuary AI) AND "figures and census" (hard numbers). The brief covers both; Mike confirms which he meant.
- Which montage clips make the cut (every candidate is listed with a timestamped link in CLIPS-TO-WATCH.md before anything is downloaded).

## Hard constraints (Mike)

- Runtime 6:00 (accept 5:30 to 6:30), the CH1 clip montage included. **RELAXED 2026-11-10 (Mike: "This might extend the time frame of this video beyond what I thought, but that's fine.")**: the new maintenance beat and the denial chapter set the length; no hard cap.
- CH1 opens on the clip montage: at least 60 s of real people telling their own job-search story in their own voice, before Mike's first line. No cold open: the montage IS Chapter 1.
- Mike's ruling for THIS video (clip-inserts.md rule 5, "longer only on Mike's ruling"): the CH1 montage is a run of about 10 to 20 BACK-TO-BACK clip inserts of about 2 to 10 s each, with no Mike line between them; the spine starts after it. Everywhere else the normal clip-insert rule holds (one clip between a set-up line and a resume line).
- The research must bring MORE montage candidates than needed (aim for 25 to 30) so Mike can pick: varied jobs, ages, genders and countries; each with the URL + exact window + the words VERBATIM from the audio + how long they say they have been searching.
- Montage context caption: role + how long searching (in their own words) + platform + month and year, e.g. "Software engineer, 11 months searching, TikTok, Aug 2026". A private person is never named and their handle is never shown; a public figure is named normally.
- The people are shown with sympathy only: never mocked, corrected or held up as wrong; never call out another creator. **The denial chapter (2026-11-10) is the one exception, scoped:** its clips are ORDINARY people (street interviews, news vox pops, ordinary posters), never a creator or influencer; no names or handles; Mike's notes speak to the DENIAL itself, with empathy ("I get why people want to believe it"), never to the person on screen, never mocking.
- New ground only: the jobs Mike covered in "Literally Every Job Is at Risk" and "AI Will Wipe These Jobs Out Next" (transcripts in refs/prior-videos/) are callbacks at most, never this video's examples.
- Music: `leatherface` ONLY, the whole video, scored chapter by chapter from its own cuts (subtle vs aggressive by chapter). No other track.
- Effect: the `elegant-promo-2022` montage (effects library) used for a run of 2 to 4 fact cards, at least once.
- Pace SLOW (outside the montage's clip flipping): soft transitions, sparse SFX, covers held long, no hype devices.
- Robots: separate real deployments from demos and promises; never say a humanoid does a job in production unless a primary source shows it.
- Crypto channel: never explain how Mike makes his content with AI (no pipeline / process detail).
- Every on-screen number, date, name and quote comes from DATA.md; live-drift figures carry [VERIFY]. No em dashes anywhere.
- MID-ROLL PLUG (Mike, 2026-11-09): somewhere between 40 and 50 percent of the runtime (about 2:25 to 3:00 of a 6:00 video), at a natural seam between two beats, Mike plugs himself and his community, opening in his own words: "By the way, if you're new here, I'm CodeMonkey Mike. I run a successful crypto community..." The screenplay writes it as ONE 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` line (Mike, 2026-11-10: the plug is a COVER scene only, no face; this overrides screenplay.md Convention 3's "a mid-roll plug is FACE throughout" for this video), title card OFF, the bed continues under it (no bed change). Mike's opening words stay verbatim; the rest is drafted from persona/persona.json (identity, cta_style: the community and its VIP / Premium tiers, its biggest verified calls with the multiplier marked [VERIFY] at record time, "click the link in the description"), short, then straight back into the chapter. Mike edits the wording at GATE 1.

## Decisions

- **2026-11-09 — created.** Working title: AI Is Wiping Out All These Jobs. Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).
- **2026-11-09 - mid-roll plug added** (Mike, after the run started, during research): at 40 to 50 percent of
  the runtime, "By the way, if you're new here, I'm CodeMonkey Mike. I run a successful crypto community...",
  written as one locked FACE HOLD line (see Hard constraints). Mike dictated "QuotaMonkey"; read as CodeMonkey
  (persona name), confirm at GATE 1.
- **2026-11-10 - the mid-roll plug is a COVER scene only** (Mike, at the screenplay gate: "Let's make it so that
  the mid-roll plug is only a cover scene."). SCREENPLAY CH2 Beat 4 is now 🔒 `[SAY-EXACT]` 🗣️ `[COVER]`, no face;
  proposed cover = a real-site capture of cryptorich.vip/showcase held under the line. The video now carries 5
  FACE beats (budget 8).
- **2026-11-10 - Mike rewrote the plug** (SCREENPLAY CH2 Beat 4: the community, software and courses; "get people
  invested into assets, before the paychecks run out"; the Janction 6x call vs the lifetime membership) and made its
  shape the DEFAULT for crypto-channel videos that are not about crypto: `screenplay.md` section "The OFF-TOPIC plug".
- **2026-11-10 - Digit line ending** (Mike): the point is WHEN it pays off for GXO, not that it has not; the line now
  ends "humanoids are a couple of years away from paying for themselves" (GXO CEO, Q2 2026 call). Never air
  "humanoids are not paying off". Mike's wording ("totes", "that company's CEO") is otherwise untouched.
- **2026-11-10 - a full MAINTENANCE beat replaces the one-line "no humanoid doing maintenance" blip in CH3** (Mike):
  a humanoid can do pretty much anything; with a robot in the house, software makes it an expert electrician, it
  orders the parts and wire it needs and does the work; same for a roof repair; maybe not today, but by around 2029
  (Mike's own prediction, said as his view). Callback to the earlier robotics video (plumbers, electricians,
  roofers). Plus Elon Musk's humanoid-robot prediction (Mike recalled "about a billion by 2030"): air Musk's EXACT
  verified words and year, whatever they turn out to be, as his prediction; still no claim about what Optimus does today.
- **2026-11-10 - NEW CHAPTER after CH3: the denial** (Mike): clips of people saying their job is safe, plus Mike's
  notes about people being in denial. Runtime cap lifted for it (see Hard constraints). Framing rule: see the
  sympathy constraint's scoped exception.

- **2026-11-10 - the three additions written into SCREENPLAY.md** (lint PASS, 7 faces of 8, 17 inserts; about
  10:05). Research merged into DATA.md section 7 (the addendum file is folded in and removed). CH3 Beat 7 = the
  maintenance beat (BLS duty list, Atlas taught by demonstration, Amazon's AI completing a purchase, Mike's 2029,
  Musk as CLIP-61). Musk's real words: "ten years from now, I would say there are well over a billion humanoid
  robots" (G20 Innovation Ministerial, 2026-09-01); "a billion by 2030" matches nothing he said. OpenAI's Instant
  Checkout was pulled in March 2026, so it is not used. New CH4 IT WON'T BE ME (Quinnipiac 70 vs 30, 4 clip inserts,
  the German study); the close is now CH5. **The plug moved, words unchanged, from CH2 to CH3 Beat 4** (about 41 to
  47 percent of the longer cut, inside Mike's 40 to 50 percent window); the line after it now opens "Next, the robot
  with the human body." Mike's plug and Digit wording verified byte-identical after the move.
- **2026-11-10 - GATE 1 (screenplay) APPROVED by Mike, and the video is recorded:** `raw/2026-11-10 10-37-10.mkv`
  (22:33, 1920x1080 at 30 fps, AAC stereo 44.1 kHz). The graph resumes with `--resume --approve screenplay` into
  spine prep.
- **2026-11-10 - spine_review APPROVED by Mike, no bursts.** Final silence: **700 ms min-silence for the whole video,
  regardless of chapter** (one zone, no hook split), and every removed silence in a **COVER scene is replaced with
  250 ms** (`--pad-tail 0.15 --pad-head 0.1`, cover only: 150 ms kept after the sentence, 100 ms before the next; face
  scenes keep the plain pad-0 cut). The coarse pass he listened to ran at 700 ms with pad 0, so it is re-run with the
  pads (the old one is parked as `_previews/ALL.c.desilenced.pad0.mp4`); that coarse spine IS the final spine, since
  a second 700 ms pass has nothing left to cut.
- **2026-11-10 - GATE spine APPROVED; Mike's Adobe Podcast Studio Enhance Speech track remuxed** as `spine/ALL.d.enhanced.mp4`.
- **2026-11-10 - GATE plan: Mike's rulings** (recorded as RESOLVED in COVER-PLAN / MUSIC-PLAN / AS-RECORDED):
  1. CH1 montage clips KEPT as planned.
  2. The plug card carries no extra numbers (no membership price, no dated call); the JCT chart source is the capturer's pick.
  3. The C20 quote card naming Patrick Kelleher, CEO, GXO Logistics is OK.
  4. **"humanoid" CUT from the spoken line "A humanoid electrician needs an apprenticeship"**: 310.900-311.533 (19
     frames, a cover beat, black picture) removed from `ALL.d.enhanced.mp4` -> **`spine/ALL.e.cut.enhanced.mp4` is the
     FINAL spine (475.30 s)**; Whisper on the cut reads "An electrician needs an apprenticeship." Every FINAL-spine time
     after the cut moved back 0.633 s in the word JSON, the breakdown, COVER-PLAN, MUSIC-PLAN, AS-RECORDED, and
     BROLL-PLAN + EDIT-PLAN-prep re-rendered; the pre-cut docs are in `_previews/pre-humanoid-cut/`. MUSIC-PLAN keeps the
     CH3 loop row 309.132-365.602 whole so the bar grid has no off-beat seam (its pickup now lands about 0.6 s after
     "by 2029, it will"); the landing row's fade-out ends 0.633 s sooner with the CH4 cue.
  5. The community lower-third goes on the end card even with no spoken cue.
  6. The end card HOLDS about 3 s so the closing hit rings out: MUSIC-PLAN `end_card_hold` 3.0 s after the last word
     (hold_until_sec 478.27, no trim).
  7. The new visuals replacing the CH5 callbacks are OK (no reuse waiver).
- **2026-11-10 ~20:30 - GATE blueprint PRE-APPROVED by Mike** ("take this all the way to the draft gate so that I see
  the draft video when I wake up"): recorded in GRAPH-PROGRESS.json so the run passes it; Mike did not review the
  blueprint and reviews the draft instead.
- **2026-11-10 ~22:45 - overnight assets repairs** (run toward the draft gate):
  1. **CLIP-24 window fixed:** the planned 0:16.4-0:25.3 opened on a fragment ("changed everything.") and cut before
     "income", so the capturer withheld it. Its fixed capture, 0:17.5-0:25.9 (8.4 s, passes Whisper, the same sentence),
     moved from `_previews/proposed/` into `assets/clip-inserts/`; COVER-PLAN `clip_inserts` carries the new window. The
     montage is 67.9 s (was 68.4). MUSIC-PLAN row 1 `source_in` 10.267 -> 10.767 by its own rule
     (`if_a_clip_length_changes`: 78.667 - montage seconds), so the bar 21 hand-off and bar 8 inside the montage keep
     their places.
  2. **R-SHOWCASE:** cryptorich.vip/showcase has NO Janction / JCT row (receipt-capturer). The cover row now says the
     real scroll plays under the memberships line and nothing on it is labelled as the JCT call; R-JCT carries the
     call. If you want JCT on the showcase page, that's a site change, then a re-capture.
  3. CLIP-29 ships as planned but ends mid-sentence ("...strange sentence from"); a full-sentence take, 1.0 s
     longer, sits in `_previews/proposed/CLIP-29-creative-director.mp4` for your call at the draft.
  4. The automatic re-drive ran `desilence_final` without the 0.7 s silence setting and wrote `spine/ALL.d.desilenced.*`.
     That file is NOT the final spine (`ALL.e.cut.enhanced.mp4` still wins the letter order) and nothing cues off it.
     Moved out of `spine/` to `_previews/stray-redrive-desilence/`.
  5. **~23:15 visual-qa FAILED 17 files** (149 passed; verdicts in `assets/VISUAL-QA.json`, the failing files in
     `_previews/qa/rejected/`): R-JCT (a gambling ad + a "Janction Drops 22%" sidebar headline on the page; recapture
     the chart alone), CLIP-40 + CLIP-42 (a private person's name bar on screen; cover it), CLIP-12 (the voice does
     not match the face on screen; re-listen and fix the window or the caption), S2 (frozen mid-blink), CLIP-24 (its
     own burned captions under our band; recapture with the band at the TOP, now `caption_pos: top` in COVER-PLAN),
     C5 (top line cut off; re-crop), BR-10 / 13 / 15 / 16 (bright, off the dark grade), callback-every-job (4 states) +
     apprenticeship-vs-download (2 states; the divider missing, and no headline on the second). Re-driven at 23:16
     (`--sil-pre 0.7 --sil-post 0.7`): the graph rebuilds ONLY those, with the verdicts as feedback.
  6. **2026-11-11 ~02:00 round 2:** 14 of the 17 pass. Still failing, retried automatically: CLIP-40 + CLIP-42 (the name
     bars hidden with hard black boxes, mistimed by a frame or two; QA wants a boxblur timed to the bar) and R-JCT (the
     clean chart no longer names the coin; recapture with the JCT name strip on top). **CLIP-12's speaker was mislabelled
     in the plan:** the line "I still do not have a full-time job" is said by an unnamed young man in a car, not the
     communications graduate (lip-checked by the capturer and visual-qa). Caption now "Young job seeker, still no
     full-time job, NBC News, Aug 2026", synced into COVER-PLAN (DATA.md's CLIP-12/13 rows still carry the old label).
     For the comp: CLIP-21 is near-silent after 7.0 s, and its lead-out still S2 is the 7.0 s frame.
  7. **~02:23 round 3:** CLIP-40 + CLIP-42 pass (name bars handled). R-JCT failed once more: the capture's big header
     "$0.007525 +304.1% (1m)" (about 4x, today's price) sat on the beat where Mike says "shot up 6x". Re-cropped from the
     SAME capture (`_previews/qa/rejected/R-JCT-price-chart.try3.png`), nothing redrawn: the page's own "Janction JCT
     Price #279" row as a thin strip on top of the 1M chart panel, 16:9 on the page's white, the price/% line, the stats
     column and the Buy / Long / Earn buttons left out. The chart backs the line: about $0.002 before Oct 20 to a peak
     of about $0.0143 on Nov 8-9 (about 7x). Re-driven 02:24.
  8. **~02:57 assets PASS** (164 files, zero orphans). `edit_plan` then failed: `scripts/list_face_joins.py` wanted a
     final desilence map above c, and this video has none (the 700 ms coarse pass IS final) plus the "humanoid" cut
     after it. Fixed in code (uncommitted): no final map = the coarse pass is final, and a later cut written as
     `spine/<scope>.<x>.cut.*.map.json` is applied after it. Wrote `spine/ALL.e.cut.enhanced.map.json` (the 310.900-311.533
     cut in c-time), so every FACE join after 310.9 lands on the e spine (joins 115, F7 punch point 453.933).
  9. **~03:34 edit_plan + transitions PASS** (128 scene changes); `reconcile_docs` failed on ONE row: the F5 cut-in
     `[TRANSITION]` at 6:09.6 had its id (`hand:film-burn`) on the wrapped second line. Moved it onto the first line like
     every other face cut-in (content unchanged; the pre-fix copy is `_previews/EDIT-PLAN.pre-reconcile-fix.md`);
     `reconcile_docs.py` dry-run PASS. Re-driven 03:35.
  10. **~03:38 edit_plan lint FAILED on 4 receipt rows** (R-INDEED, C13, C22, R-IZA): the 03:3x `reconcile_docs --apply`
      fan-in appended `→ hand:xfade-scale (...)` to the end of each row's FIRST line, which there ended in `treatment:`, so
      the pick split the label from its value (`pan` / `highlight` / `push` sat on the next line). Rejoined each value to
      its label (content unchanged; pre-fix copy `_previews/EDIT-PLAN.pre-treatment-fix.md`). Dry-runs PASS: edit-plan
      lint, reconcile, transitions lint, docset (build). Re-driven 03:39. A code fix for the fan-in (insert the pick at
      the end of the whole event, not its first line) is NOT made; flagged for you.
  11. **2026-11-11 05:38 - WAITING AT GATE draft.** Review `_previews/AI destroying lives-draft-v1-mix.mp4` (606.9 s:
      603.93 + the 2.97 s end-card hold; music + SFX mixed, peak -1.4 dBFS). All 9 comp gates PASS; the VO matches the spine
      (corr 1.0, 0 ms). Comp-builder flags to watch: CLIP-3 opens on 0.2 s of another shot (draft 0:05.5; fix = recapture
      0.2 s later); CLIP-29 opens on about 0.27 s of black; BROLL-MOTION fails BR-23 on the 200k draft only (0/36 frozen at
      crf 18; the final render's gate decides); the F7 light leak flashes one white frame (9:42.5; lib:lightleaks-soft-5 is
      the slower option); the burned caption doubles for 0.5 s on the insert-in dissolves from S1 / S3 / S4 / the CLIP-42
      lead-in; the C17 highlight sits on small photo-caption type (5:27); the C19 elegant-promo cards (1:34-1:54) are
      approximated from flat PNGs. Resume after review: `run.py longform --project "AI destroying lives" --resume --approve draft`.
- **2026-11-11 ~05:52 - GATE draft APPROVED by Mike** ("it is excellent! proceed with the final render"): the draft-v1 flags
  above ship as rendered. Resumed `--approve draft` (queued behind AI vs ML). `yt-delivery.json` written for
  definition_of_done (title = the working title "AI Is Wiping Out All These Jobs", the 2-sentence description, #AI
  #FutureOfWork #Jobs, viewer-facing names for the five uncarded chapters, 10 keywords + 4 misspellings); yt_delivery.py
  PASS: chapters 0:00 / 1:28 / 3:35 / 7:42 / 9:28, music code APWZNQ3HC2L0MB6P.
- **2026-11-11 06:40 - DELIVERED (GRAPH DONE).** `AI destroying lives-FINAL.mp4` at the project root (606.90 s, crf 18,
  1920x1080 30 fps, -20.8 LUFS, peak -1.4 dBFS; verify_final PASS incl. BROLL-MOTION, so BR-23 was the draft encode).
  Staged to `schedule-tweets/longform/AI destroying lives/` + longs.json `lf-20261111-AI destroying lives` (rumble /
  bitchute / facebook pending), title "AI Is Wiping Out All These Jobs"; usage ledger recorded; `_previews/` recycled.
  **No thumbnail exists yet** (no `thumbnail/` or `assets/thumbnail/` folder), so the queue entry has `thumbnail_path:
  null`; the planned thumbnail text is "AI Is Destroying Lives".
- **2026-11-11 ~07:11 - FINAL approved by Mike; vertical lane started** ("I approve the final render ... proceed to the
  full vertical conversion"). `run.py vertical --project "AI destroying lives"` launched; QUEUED #1 (queue id 6fc13e)
  behind the AI vs ML vertical, starts on its own. Log: `video-creation/skills/run-queue/state/logs/20261111-071153-vertical-AI-destroying-lives.log`.
  Resume at the gate: `run.py vertical --project "AI destroying lives" --resume --approve vertical`.
- **2026-11-11 08:45 - vertical run took its turn** (face crop measured 58.7%, spread 54.1-65.3; v_assets dispatched
  envato 24 · image-gen 8 · receipts 45 · charts 14 · slides 16). slide-builder + image-gen finished; **09:31 STOPPED by
  Mike's request** (save resources while AI vs ML ran) mid v_assets: the envato, receipt and chart builders were killed.
  Finished assets stay in `assets/vertical/`; restart with `run.py vertical --project "AI destroying lives"` (a fresh run:
  v_assets rebuilds only the ids still missing). The two "STOPPED / DIED" toasts at 09:31-09:32 are this deliberate stop.
- **2026-11-11 10:00-15:03 - vertical restarted and run to GATE vertical.** QA round 1 failed 10 of 164 (portrait clip
  bands slicing on-screen text on CLIP-9/44/51 + S4, receipts C13/C17/C24/R-JCT missing headline or source or with a blank
  stretch, IMG-7 outlet cut off, C23 a truncated PNG from the 09:31 stop); the automatic re-drive fixed 9, C13 failed again
  (no source on screen) and was re-driven by hand at 11:43 (queued behind the AI vs ML short), PASS at 13:11. comp-builder
  69 min, 7 comp gates PASS (COVERS 28 warns). C: hit 1.1 GB free at ~13:00 (the AI vs ML short's render died on the 5 GB
  check); 17.4 GB free by 14:14, nothing deleted by this session. Render 14:20-15:01: 11 chunks, all first attempt, 18207
  frames. Mix -20.8 LUFS / peak -1.4 (= the 16:9). verify_final: 606.90 s, 1080x1920, faces 48-52% in all 7 windows.
  **WAITING AT GATE vertical:** `_previews/vertical/AI destroying lives-VERTICAL-v1.mp4`; resume
  `run.py vertical --project "AI destroying lives" --resume --approve vertical`.
- **2026-11-11 - thumbnail (Mike):** text "AI is" / "Destroying Lives.", template = his own youtu.be/jiDXX5IyhJA (two glowing
  coin badges, white line + boxed line, his face right). Badges rendered in code (`thumbnail/build_badges.py`, 19 icons x 3
  styles, Phosphor icons, no image model); Mike picked BUILDERS + MY JOB + TRADES (b-glow-slash), blue MY JOB in the
  middle so the two ambers do not touch. `thumbnail/build_thumb.py` rebuilds the template in code: his face + backdrop
  pixel-identical, old coins/words painted out (harmonic fill), and the shoulder the old white box covered is redrawn.
  Two takes in `thumbnail/takes/` (one box vs two stacked boxes). **Mike picked take 2 (two stacked boxes)**: copied to
  `thumbnail/AI destroying lives-thumb.png` (+ `.jpg` for YouTube). The longs.json entry still has `thumbnail_path: null`
  (not attached; Mike's call).
- **2026-11-11 ~15:40 - VERTICAL approved by Mike; delivered.** `--resume --approve vertical` promoted
  `AI destroying lives-VERTICAL.mp4` (430 MB, 606.90 s, 1080x1920) at the project root; not queued. Mike then asked for the
  30-second short: `run.py short --project "AI destroying lives" --seconds 30` (no gates; he watches the delivered short after).
- **2026-11-11 ~16:54 - 30 s SHORT delivered.** `AI destroying lives-SHORT-30s.mp4` at the project root (23 MB, not queued).
  Plan: 3 spans (hook face 450.85-458.95, body C11 card 335.44-351.08, kicker face 563.74-566.58) + 3 s outro, IMG-8 variant.
  First final visual-qa FAILED one defect (caption over the C11 payoff callout, 20.47-23.74 s); fixed in
  `AIDestroyingLivesShort.tsx` by hiding the short's caption in that window (the callout prints the sentence), re-rendered v2.

## Open flags (load-bearing)

- **End card (Mike, plan gate 2026-11-10):** carries the community lower-third, and holds about 3 s past the last word
  ("this.", 475.27) so the closing BANG rings out (MUSIC-PLAN `end_card_hold`). The only held end card on this video.
- **FINAL spine = `spine/ALL.e.cut.enhanced.mp4`** ("humanoid" cut at Mike's ruling); never cue off `ALL.d.enhanced.*`.
- Still open, not blocking: 121.24 "one of a kind routine writing" (AS-RECORDED; the C8 card carries the DATA.md label).
