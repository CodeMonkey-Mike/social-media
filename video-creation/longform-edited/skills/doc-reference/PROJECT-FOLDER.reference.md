# PROJECT-FOLDER reference: the layout of ONE longform-edited video, from brief to delivery

_REFERENCE SHAPE (skills/doc-reference, 2026-09-29, taken from the first video the graph delivered end to end,
`kaspa-vprogs`). Project folders are recycled after publish, so THIS file is the reference for what a project
folder contains and which graph node produces each file. Never open an old project folder to learn the layout.
Canonical rules: `../comp-build/comp-build.md` §10 (assets) + §13/§13a (documents + spine chain); the graph
`../../graph/longform_graph.py` + `vertical_graph.py` creates everything below in order._

```
video-creation/longform-edited/media/<project>/          <- created by `run.py longform --project <project>` (init_project)
│
│  ── documents (every one has a reference file in this folder + a code gate; see README.md) ──
├─ PROJECT-LOG.md            init_project: the brief + constraints; every Mike ruling appended by the gates
├─ DATA.md                   research (data-researcher agent): every number/date/claim with a source + the CHART-SOURCE INDEX
├─ SCREENPLAY.md             screenplay (screenplay-strategist agent, lint_screenplay.py)   -> GATE 1 screenplay
├─ AS-RECORDED.md            as_recorded (as-recorded-author agent, lint_as_recorded.py): the as-built script, FACE windows, mishears
├─ COVER-PLAN.json           coverage (coverage-strategist agent, verified from disk)
├─ BROLL-PLAN.md             coverage: RENDERED from COVER-PLAN.json by scripts/render_cover_plan.py (the builders' worklists)
├─ EDIT-PLAN-prep.md         coverage: RENDERED (per-chapter beat tables)
├─ MUSIC-PLAN.json           music_plan (music-placement-strategist agent, verified)            -> GATE 3 plan
├─ EDIT-PLAN.md              edit_plan (gen_editplan.py seed -> edit-plan-author agent, lint_edit_plan.py)
├─ CUE-SHEET.md              edit_plan (same agent, same lint)
├─ TRANSITION-PLAN.json      transitions (transition-strategist agent, verified)
├─ TRANSITIONS.md            transitions: RENDERED from TRANSITION-PLAN.json by render_transitions.py, lint_transitions.py
│                            reconcile_docs fans the picks back into EDIT-PLAN/CUE-SHEET; lint_docset.py     -> GATE 4 blueprint
├─ publish-meta.json         stage_longform (longform-meta-author agent): title / description / tags for the queue
├─ mix-audio.json            mix_audio / final_render: every resolved bed, duck and SFX time + the rerun command
├─ GRAPH-PROGRESS.json       the graph: gate approvals + nodes marked done by hand
│
│  ── media ──
├─ raw/                      Mike's camera master(s) ONLY (ALL.mkv); never edited, never deleted
├─ spine/                    the §13a letter chain, every stage + its map/sidecar (all Python skills):
│    ALL.lowbps.mp4            compress (to_low_bps.py)
│    ALL.a.defumbled.mp4       defumble (+ ._chunkmap.json/.txt, .spans.json)
│    ALL.b.blackout.mp4        cover_blackout (+ .cover.json)                       FACE kept, COVER beats black
│    ALL.c.desilenced.mp4      desilence_coarse 700 ms one zone (+ .map.json)      -> GATE 2 spine_review (Mike listens)
│    ALL.d.cleaned.mp4         burst_removal (+ .cuts.json)
│    ALL.e.desilenced.mp4      desilence_final two-zone (+ .map.json)
│    ALL.f.cut.mp4             a content cut on Mike's call (+ .spans.json)        = the SOURCE spine (final_spine())
│    ALL.f.cut.medium-words.json / .segments.txt   transcribe (transcriber agent; the cue source) -> GATE 2b spine
│    ALL.g.paused.mp4 (+ .json) card_pauses: freeze + silence per title card        = the BUILD spine (paused_spine())
├─ assets/                   the render's --public-dir (comp-build §10), built by the assets node's five builders:
│    spine.mp4                 = ALL.g.paused.mp4
│    captions.json             captions node (windows, groups, style)
│    VISUAL-QA.json            the visual-qa verdict for every asset file
│    vid/     BR-n-<slug>.mp4            envato-sourcer (audio stripped)
│    img/     IMG-n-<slug>.png           image-gen (ChatGPT browser pipeline, references honoured)
│    receipts/ R<n>-<slug>.png           receipt-capturer (R5-a / R5-b = one receipt split in two crops)
│    charts/   <id>-<state>.png + <id>.html + <id>.spec.md      chart-builder, Type 1 ANIMATED (the comp animates it for real)
│    diagrams/ <id>-<state>.png + <id>.html + _state-cues.md    chart-builder, Type 2 SYSTEM-DESIGN stills
│    title-slides/ title-card-chN.png                            slide-builder
│    card-slides/  <id>-sN.png                                   slide-builder (one PNG per spotlight state)
│    slide-sources/ containers.html + _shot.py                   slide-builder's source + screenshot driver
│    transitions/ lib/sfx-*.mp3 + plates/tiles/masks             copied per used library id (lint_transition_assets.py)
│    vertical/  <the same subfolders> + spine.mp4 + face-crop.json + VISUAL-QA.json    the optional vertical lane (run.py vertical)
├─ thumbnail/                reference-*.jpg (the YouTube reference) + <project>-thumb-vN.png (Higgsfield) + gen-vN.json
├─ _previews/                DISPOSABLE: draft/final renders + logs, chunk QA, comp-build-report.json, verify-*.json, seeds;
│                            recycled by stage_longform after the queue copy exists (comp-build §12a)
│
│  ── deliverables (project root) ──
├─ <project>-FINAL.mp4       definition_of_done: the mixed final (crf 18 + music/SFX); also copied to schedule-tweets/longform/<project>/
└─ <project>-VERTICAL.mp4    the optional vertical lane (v_deliver); NOT queued unless Mike says so

remotion/src/ (outside the project, recycled with it):
   <Project>.tsx + <Project>Captions.ts + <Project>*Chart*.tsx    comp_build (comp-builder agent)   <- own files only
   <Project>Vertical.tsx                                          v_comp                            (lint_comp_imports.py)
```

Rules the layout encodes:
- Documents live at the project root, media in `raw/` `spine/` `assets/`, outputs in `_previews/`, deliverables at the root.
- `assets/` is the whole public dir and is copied into every render bundle: sources may ride along, outputs never.
- Nothing under `spine/` is ever re-derived by hand; every stage has a sidecar map so timecodes can be traced.
- The vertical lane never overwrites a 16:9 asset: everything it makes lives under `assets/vertical/`.
