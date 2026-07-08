# carry-trade: PROJECT-LOG

_Decision trail + resume pointer for this longform-edited video. Newest at top. Canonical track rules live
in `../../screenplay.md` (script) and `../../longform-edited.md` (edit); this log only records THIS video's
decisions._

## Resume pointer — SESSION 2026-07-06 (END OF NIGHT), START HERE NEXT TIME

**STATUS at close:**
- **FINAL: DONE + QUEUED.** `renders/carry-trade-FINAL.mp4` (3.2 Mbps, 601.56s, mixed, QA'd). Queue entry
  `lf-20260706-carry-trade` in `schedule-tweets/data/longs.json` (file + thumbnail staged at
  `schedule-tweets/longform/carry-trade/`); description carries YT chapters + music code
  `X0LSN3AU9JLZKKFG` + CTA links; youtube/rumble/bitchute/facebook all `pending`. Mike approved the
  content (v2 draft review, all 7 notes actioned).
- **VERTICAL: DONE (2026-07-07).** `renders/carry-trade-VERTICAL-v1.mp4` (1080×1920, 30fps, 18045 frames,
  601.6s, 3.2 Mbps, mixed, QA'd). Unmixed master `renders/carry-trade-VERTICAL-v1-video.mp4`. QA frames in
  `renders/_qa_vertical/`. NOT yet queued (16:9 FINAL is the queued deliverable; vertical is a bonus cut —
  queue it if/when Mike wants it on the vertical platforms). **Rendered via a two-pass split-and-concat
  workaround** — see the 2026-07-07 decision entry for the root cause. The single-pass render hit a HARD
  deterministic ceiling: all 18045 frames render fine, but Remotion's final FFmpeg stitch dies at EXACTLY
  frame 14436 with `FFmpeg quit with code 3221225794` (0xC0000142, Windows desktop-heap/handle exhaustion
  from the concurrency-4 chrome workers) — reproduced twice even with 15GB RAM free, so it is NOT a resource
  or comp bug. FIX: render two frame-range halves (`--frames=0-9021` and `--frames=9022-18044`, each under
  the ceiling), then join with a standalone `filter_complex concat` (single ffmpeg, no chrome workers → no
  ceiling), then mix (`IN=…VERTICAL-v1-video.mp4 OUT=…VERTICAL-v1.mp4 bash audio/mix_draft.sh`). QA: concat
  seam at 300.78s is seamless (frames verified), blackdetect shows only intentional transition blacks, audio
  peak −3.21 dB no clipping (matches 16:9). OPEN (pre-existing, affects BOTH cuts): several code-container
  subtitles carry em dashes (e.g. "roadmap — a thesis, not a promise") — a persona-rule miss inherited from
  the approved 16:9 edit; fixing needs a container-text edit + re-render of both, Mike to decide.
- v2 draft (0.2 Mbps review proxy) remains at `renders/carry-trade-draft-v2.mp4`.

Historical: v2 DRAFT DELIVERED (all 7 review notes actioned, frames verified). v1 status
for reference: DRAFT SAMPLE DELIVERED — `renders/carry-trade-draft.mp4` (10:01.5, 0.2 Mbps, mixed with bed +
4 SFX hits), QA'd per video-qa.md (visual frames at all key moments incl. settled-container text check,
motion verified on card flip + chart draw-on, SFX peak −4.7 dB sits under VO true peak −3.6, no clipping
max −3.3 dB, bed presence verified by level-delta arithmetic across 3 windows — a by-ear bed-audibility
check needs Mike's playback since the desilenced spine has no ≥0.5s breaths left to isolate the bed in).
Un-mixed video: `renders/carry-trade-draft-video.mp4`. QA stills in `renders/_qa/`. Mike approved the
full edit with 6 decisions: place benched stills · keep "Bottom line." · FLIP chapter card · recycle
.baks (done, Recycle Bin) · script the CH6 ad-lib into all docs (done) · build the music bed (done).**

Built this leg (all timecodes = FINAL paused-spine coords, transcript `spine/ALL.d.paused.json`):
- `spine/ALL.d.paused.mp4` (601.49s) — 1s FLIP-card pause baked at 79.04 (the CH1/CH2 desilence-map join,
  in-silence by construction; lint-pause-silence n/a, no comp INSERTS). Staged as `render-assets/spine.mp4`.
- Comp: `remotion/src/CarryTradeFull.tsx` (+`carryTradeCharts.tsx` REAL animated charts, +`carryTradeContainers.tsx`
  code containers, +`carryTradeCaptions.ts`). 51 covers, zero orphans (C7 + D-TIMELINE = REJECTED/BENCH,
  documented). Per-type glitch ingress via TransitionClip (Roughly/Offset/TurbDisplace/VHS); Envato=fade;
  FACE cut-ins + punch hits = hand-rolled Invert/Monitor family LOOKS (draft choice — swap to engine clips
  at final if wanted). Captions = montserrat 1-word (track skill overrides the arial-black memory), CH1 FACE
  spans only. Light leaks on the 9 >5s face holds.
- GATES: lint-covers OK (scatter warns justified in comp comments + CUE-SHEET; gap warns = the face spans);
  lint-deck-containers OK (DIAGRAM_REFS exemption; FIXED the linter's exemption-order bug — NOT FOUND used
  to fire before the documented exemption); TransitionClip zero-duration guard added (win ≥ 2·cutFrame crash).
- `render-assets/transitions/lib/` — 166MB of used-family engine assets COPIED from the shared library
  (sfx + roughly masks + vhs plates); the smoke test caught the missing-path crash.
- Music bed `audio/bed_draft.wav` (601.49s): chorus self-crossfade 0→79.0 + 1s breath + full track with
  verse×3 remix-loop, REAL outro right-aligned; −21 dB (VO −15.3 LUFS / track −11.3 → ≈17 dB under).
- Docs regenerated: EDIT-PLAN.md (219-event log), CUE-SHEET.md (real timecodes), EDIT-PLAN-prep zero-orphans
  updated, SCREENPLAY CH6 Beats 5-8 = the AS-RECORDED ad-lib.

**NEXT (if this session died mid-flight):**
1. Render: `renders/carry-trade-draft-video.mp4` (background job; if missing/partial, re-run:
   `cd remotion && npx remotion render src/index.ts CarryTradeFull ../longform-edited/media/carry-trade/renders/carry-trade-draft-video.mp4 --video-bitrate=200k --public-dir ../longform-edited/media/carry-trade/render-assets`)
2. Mix: run `media/carry-trade/audio/mix_draft.sh` (bed + 4 SFX hits → `renders/carry-trade-draft.mp4`).
3. QA per video-qa.md (10s chunks at: 10-20s captions+leak, 76-86s card+bed change, 272-282s riser→BTC reveal,
   430-440s riser→40yr-low, 520-535s ad-lib stills, 560-575s DCYCLE/candles) + swallowed-audio/level checks.

Done this session:
- `SCREENPLAY.md` draft 2, locked spine (capital-flight thesis, two-channel mechanism), with Mike's live
  corrections folded in (see decisions below).
- `DATA.md` — 7 chart specs (C1-C7), all sourced, `[VERIFY]` tagged.
- `BROLL-PLAN.md` — 10 ChatGPT stills + 10 Envato clips, sourced and on disk, beat candidates assigned.
- `TRANSITIONS.md` — per-asset-type glitch family assignment (NOT one pick for everything, see below).
- `EDIT-PLAN-prep.md` — beat-indexed layer/asset/transition map, 3 ChatGPT stills still BENCH.
- `CUE-SHEET.md` — pre-record skeleton, all timecodes TBD pending the full recorded spine.
- `render-assets/deck/carry-trade-deck.html` — all 12 containers/charts built + headless-Chrome verified (every
  slide screenshotted and visually confirmed, not just assumed from the code).
- Music plan locked (chorus intro, full-track remix-loop for CH2-end), not yet buildable (runtime unknown).
- Recording: CH1-CH3 fully processed (defumble → blackout → desilence, `spine/CH1-CH3.c.desilenced.mp4`,
  244.4s). CH4-CH6 + a separate CH7 take recorded, defumbled, blacked, and concatenated into
  `spine/ALL.b.blackout.mp4` (1460.878s) — **CONFIRMED complete, but with a real content gap**: CH6's
  written Beats 2-4 were never recorded (Mike went off-script into an unrelated AI/cycle-top tangent
  instead), and the fresh CH7 take only covers Beat 3 (the honest close), not Beats 1/2/4. This is a
  recording gap, not an editing decision — needs a re-record or a rewrite around what was actually said.
- Desilenced the FULL combined file: `spine/ALL.c.desilenced.mp4`, two-zone split at the CH1/CH2 boundary
  (247.0s) — 250ms threshold through CH1, 600ms from CH2 onward. 1460.88s → 603.81s (134 cuts, 857.7s
  removed). QA swallowed-speech scan: zero flags, no clipped words.
- **Folder cleanup (Mike, 2026-07-06):** a stray project-local `assets/` folder (video + deck) got created
  alongside `render-assets/`, duplicating its purpose and causing real confusion. Per `comp-build.md` §10,
  there is only supposed to be ONE project-local folder, `render-assets/` (subfolders `img/vid/deck/
  receipts/charts/transitions/`), separate from `video-creation/assets/` (the repo-wide SHARED library).
  Consolidated: Envato clips → `render-assets/vid/`, the deck → `render-assets/deck/`. Updated path
  references in BROLL-PLAN.md.

**NEXT, IN ORDER:**
1. ~~Decide on the CH6/CH7 content gap~~ **DECIDED 2026-07-06: do NOT re-record the missing beats.** Mike
   watched the desilenced cut and felt CH6's written back-half and CH7's Beat 1 read as repetitive, that's
   WHY he went off-script. SCREENPLAY.md CH6/CH7 now carry `[!WARNING]` notes marking those beats
   historical-reference-only, not to be re-recorded. Still open: whether to script NEW CH6 back-half beats
   around the ad-lib's actual content (AI-driven economic expansion / 2027 cycle-top / "October low"), or
   just let CH6 end after Beat 1 and CH7 be only the honest close, full stop. Mike to decide.
2. Lock the final CH2-end runtime, then build the actual remix-looped music bed (verse-loop technique, see
   SCREENPLAY.md Music plan) — runtime is now known (`ALL.c.desilenced.mp4` = 603.81s total), but this may
   shift again once the CH6/CH7 gap is resolved.
3. Capture the 3 receipt screenshots (R-BIS, R-COINDESK, R-FORTUNE) as real image files, not yet done.
4. Place or REJECT the 3 benched ChatGPT stills (BR-BOJ-BUILDING, BR-MARKET-STORM-ABSTRACT, BR-TOKYO-SKYLINE).
5. Confirm the chapter-card style pick (default: cube, not yet confirmed by Mike) and re-check whether the
   music-continuity rule still puts cards at CH2-CH6 given one continuous song bed.
6. Build the actual Remotion comp once the spine + charts + containers + CH6/CH7 gap are all final;
   generate the real `EDIT-PLAN.md` (event log) from the comp + transcript, then reconcile `CUE-SHEET.md`
   to real timecodes.

## Decisions (newest first)

- **2026-07-07 — VERTICAL delivered; found + worked around a deterministic Remotion stitch ceiling
  (DURABLE, cross-project).** After the machine-resource crashes were cleared (disk freed + reboot → 15GB
  RAM), the single-pass vertical render STILL failed — but at a new, consistent point: all 18045 frames
  render, then the final FFmpeg stitch dies at EXACTLY frame 14436 with `FFmpeg quit with code 3221225794`
  (= 0xC0000142, STATUS_DLL_INIT_FAILED). Reproduced twice at 15GB free RAM, so NOT resources. A 110-frame
  probe render spanning frame 14436 (`--frames=14380-14490`) stitched fine → the content is fine; the failure
  is CUMULATIVE (Windows desktop-heap / GDI-USER-handle exhaustion accumulated by the concurrency-4 Chrome
  render workers, which makes the ffmpeg sub-process spawn/init fail at a fixed frame count). The 16:9 FINAL
  (same 18045 frames) squeaked under the ceiling; the vertical didn't. **FIX (use for any long Remotion render
  on this machine that dies in the stitch with 0xC0000142): render in frame-range halves each < ~14000
  frames (`--frames=0-9021`, then `--frames=9022-18044`), then join with a STANDALONE `ffmpeg filter_complex
  concat` — a single ffmpeg with no Chrome workers has no handle pressure and encodes all 18045 frames
  cleanly (verified: 2m34s, 3017 kb/s, seam seamless).** Lower `--concurrency` would also raise the ceiling
  but is much slower; the split is deterministic. Also (process): the harness kept reporting background render
  tasks as "killed" while the orphaned Remotion process kept running to completion — verify via the log/PID,
  don't trust the task status, and use a persistent Monitor on the OUTPUT FILE as the real done-signal.

- **2026-07-06 (23:15) — FINAL delivered + queued; VERTICAL blocked on machine resources.** FINAL:
  `renders/carry-trade-FINAL.mp4` (3.2 Mbps, 601.56s) mixed + QA'd + staged as queue entry
  `lf-20260706-carry-trade` (thumbnail = carry-trade.png, YT chapters in description, music code
  X0LSN3AU9JLZKKFG, all 4 platforms pending). VERTICAL: comp built + smoke-passed; 13/13 vertical
  ChatGPT stills (941×1672 true 9:16, reference-image recompositions) + 9/10 vertical Envato clips
  (yen-banknotes = no vertical inventory exists, landscape macro center-crops as fallback; trading-screen
  + bank-vault are agent-flagged proxy shots). **Render attempts: #1 killed by tool timeout → detached
  runs; #2 died disk-full; #3 + #4 died SILENTLY at frames 1165/1339 — both inside the R-FORTUNE VHS
  ingress window (38.8-45.1s) with `Mingw-w64 VirtualProtect 0x5af` = Windows commit/pagefile exhaustion
  (machine: 3.6GB RAM free, 5.3GB commit, disk 11GB — pagefile can't grow). NOT a comp bug.**
  LESSONS (durable): never pipe a render's log through `tail` (destroys the error); check disk AND memory
  before long renders; proxy render-assets vids (bundle copies whole public dir per render — comp-build
  §10); `--concurrency 4` (or 2) under memory pressure; detached `Start-Process` renders survive tool
  timeouts but need log-file polling. NEXT: free RAM (reboot / close apps) then re-run
  `_vertical-render.log`'s command at concurrency 4, or run overnight at concurrency 2.

- **2026-07-06 (late night) — DELIVERY-WORKFLOW breakdown fixed (Mike caught 3 failures).** (1) v2 was
  rendered ONTO v1's filename — Mike couldn't tell he was looking at a new cut. Files renamed to
  `carry-trade-draft-v2.mp4` / `carry-trade-draft-video-v2.mp4`; v1 is GONE (overwritten — nothing to
  restore). (2) delivery messages gave repo-relative paths, not the absolute path he can paste
  (standing preference `feedback_state_path_when_opening`). (3) completion wasn't unmistakable while the
  session UI showed a stale recap. **DURABLE:** comp-build.md §11 delivery rule (new `-vN` filename +
  absolute path every delivery, keep prior versions until approval); `mix_draft.sh` takes `V=vN`.

- **2026-07-06 (night) — v2 after Mike's draft review (7 notes, all actioned + 3 codified as durable rules):**
  (1) 1:35 whole slide during lane-1 talk + (2) 2:02 b-roll during lane-2 talk → **DDualflow gained
  lane1/lane2 SOLO states**; CH2 covers now spotlight the lane being discussed; overview only at the
  "two kinds" intro + the "trillions" both-lanes beat. **DURABLE:** comp-build.md §5 "SPOTLIGHT CONTRACT"
  (required state prop, overview = explicit choice, ~once per chapter) + lint-covers.js STATELESS-CONTAINER
  warn. (3) 2:17 same-slide repetition → 'conditions' state redesigned as a DISTINCT pills layout (no card
  repeat); CH7 close swapped from a 3rd DCYCLE spot to the unused BR-TOKYO-SKYLINE still. (4) 2:53 mid-slide
  re-transition → **contiguous same-ref rows now suppress the ingress glitch** (noGlitch in comp);
  **DURABLE:** lint-covers.js STATE SWAP reminder + §5 rule "ingress fires on ENTRY only". (5) mid-sentence
  punch-ins → **punches snapped to desilencer jump-cut joins**, saved as `spine/jumpcuts-final.json` (133
  anchors); holds with no internal join lost their punch (2 dropped, 1 moved). **DURABLE:** desilencer.md
  "map joins = jump-cut anchors" + §5 rule. (6) 5:33 → CryptoRich showcase (slow-pan, from smartmoney's
  R-SHOWCASE asset) over the 50x/100x line + code-rendered SUBSCRIBE pill overlay during like/subscribe
  talk. (7) 7:32 "messed up b-roll" → the BIS PDF cover was portrait force-cropped to its decorative top;
  **R-BIS re-cropped to its title band** (landscape 16:9, "BIS Bulletin No 90 + carry-trade title" visible).
  PLUS: "pips" jargon → on-screen PipGloss lower-third at 7:34 (1 pip = ¥0.01 → ¥5-10 move); **DURABLE:**
  screenplay.md "no unglossed jargon in spoken bullets" rule. fx-rate-board vid re-slotted CH2→CH5.

- **2026-07-06 (late) — QA pass + fixes.** (1) **"And this isn't theory" bad take (Mike caught at 4:03 in the
  desilenced cut):** a Whisper transcription mismatch ("this is a theory" vs "this is in theory") hid the
  retake-duplicate from the defumbler — the truncated first attempt survived. Cut it from
  `CH4-CH6.a.defumbled` at silence midpoints (3.89-15.33s), re-blacked with shifted spans, re-concatenated
  (filter_complex), re-desilenced: **final `ALL.c.desilenced.mp4` = 600.45s**, swallowed-speech QA zero flags.
  LEARNING: the defumbler QA can miss a retake pair when Whisper transcribes the two takes differently —
  worth an eventual similarity-based (not exact-text) duplicate check. Pre-fix intermediates kept as
  `*.PRE-FIX.*.bak` in `spine/` pending Mike's OK to recycle. (2) **Charts rebuilt as standalone cards**
  (Mike caught deck-slide crops): 7 self-contained 1920×1080 cards in `assets/charts/`, proofs staged in
  `render-assets/charts/image/`, `video/` reserved for the animated renders — structure now STANDARDIZED in
  `skills/charts.md` §5. (3) **Receipts real now:** R-BIS (PDF page-1 raster via pymupdf — headless Chrome
  can't render its PDF viewer, black capture), R-COINDESK, R-FORTUNE in `render-assets/receipts/`.
  (4) **CH6/CH7 gap decision (Mike): do NOT re-record** — written CH6 Beats 2-4 + CH7 Beats 1/2/4 felt
  repetitive (why he ad-libbed); SCREENPLAY.md carries `[!WARNING]` boxes marking them historical-only.

- **2026-07-06 — Envato disk-rule tightened.** Mike caught a file "over a gigabyte" that the old ">1GB"
  rule missed (1,040,074,139 bytes = 1.04GB decimal but 0.97GiB binary, a real units-ambiguity bug). Lowered
  the threshold to >800MB (decimal bytes, explicit) in `skills/envato-broll/SKILL.md`. Re-checked all 10
  clips against the new threshold; 3 needed transcoding total (`market-crash-screen`, `boj-building`,
  `tokyo-skyline`, all now ~91-96MB H.264, originals deleted).
- **2026-07-06 — Per-asset-type transition families, not one pick.** Mike assigned a DIFFERENT glitch family
  per asset type (ChatGPT broll → Roughly, charts → Offset, containers → Turbulent Displace, receipts → VHS,
  FACE cuts → Invert, mid-face punch-ins → Monitor), overriding the old single-pick-per-bucket convention for
  this video. Recorded in `TRANSITIONS.md`.
- **2026-07-06 — Music plan locked.** CH1 = chorus cut of "Wooden" (Wicked Cinema), CH2-through-end = full
  track, remix-looped on the verse (same technique as `Born Every Minute` in smartmoney-backing-kaspa) since
  4:10 won't cover the full runtime. Not buildable yet, exact loop length needs the final locked runtime.
- **2026-07-06 — Word choice: "caught off-guard" not "caught flat-footed."** Mike's actual recorded phrasing
  differed from the draft; fixed in SCREENPLAY.md and added to `persona.json` `word_choice_rules`.
- **2026-07-06 — Comma density rule added to `screenplay.md` Convention 1 (durable, cross-project).** Mike
  reads bullets close to word-for-word; long comma-less sentences force him to guess pacing live. Favor more
  commas than normal prose going forward.
- **2026-07-06 — CH1-CH3 recorded and fully processed.** Defumble (24 fumble groups dropped, 416s) → cover-
  blackout (32.7% FACE / 67.3% COVER, matched to screenplay beats) → desilence (375s more removed, zero
  clipped-word flags). One stray unscripted aside ("Bottom line.") survived, kept since it's not a fumble by
  definition; flagged for Mike to decide whether to trim.
- **2026-07-06 — CH4-CH6 + separate CH7 recorded.** Mike went off-script partway through CH6 (ad-libbed, not
  following the written beats) and abandoned a repetitive first CH7 attempt, re-recording CH7 fresh as its
  own short file. Defumble+blackout+concat handled both nuances explicitly (ad-libbed CH6 back-half tagged
  FACE/COVER by content judgment, not text-match; any abandoned CH7 tail on the CH4-CH6 file identified and
  dropped) — CONFIRM the agent's judgment calls before treating this as final.
- **2026-07-06 — Draft 2 thesis correction (the big one): capital flight, not a rate-hike story.** Mike
  pushed back hard on draft 1 (it reduced to "BoJ hikes → yen squeeze → BTC drops," missing the actual
  mechanism). Research confirmed his instinct: Japan is the largest foreign holder of US Treasuries (~$1.24T)
  AND holds ~25% of GPIF's portfolio in foreign equities (a THIRD channel Mike separately caught, since draft
  2's first pass still under-sold direct stock exposure) — both real, both already showing 2026 outflow
  data. Restructured the whole spine around two mechanisms: slow real-money repatriation (bonds + equities,
  already moving) and fast leveraged-carry unwind (the 2024 mechanism, still coiled). Crypto's own honesty
  box got corrected too: Japanese retail crypto activity is a TAILWIND in 2026 (tax cut + ETF launch), not a
  repatriation risk, added as a deliberate "good news" beat at the top of CH7 per Mike's request.
- **2026-07-06 — Title/thesis locked**: "Crypto Bear Market Alert: The Carry Trade Could Extend It" (primary).
- **2026-07-06 — Reference video watched** ("Japan Carry Trade Explained," The Deep Dive) for structure
  calibration only, not fact-sourcing. Borrowed the squeeze analogy and the value of a worked numeric
  example; explicitly did NOT borrow its clip-art definition visuals or its use of an unverified viral tweet
  as fact.
- **2026-07-06 — Deep-research workflow killed, targeted searches used instead.** Full multi-agent deep-
  research was overkill for "is this still a live risk in mid-2026"; 2-3 targeted WebSearch calls answered it
  in under a minute. Lesson: match the research tool to the actual question size.

## Facts / receipts
See `SCREENPLAY.md` "Facts + receipts" and `DATA.md` for the full sourced citation list (BIS Bulletin 90,
CoinDesk, Fortune, Yahoo Finance, Japan Times, Asia Asset Management, CNBC, StoneX, Bitget Academy).
