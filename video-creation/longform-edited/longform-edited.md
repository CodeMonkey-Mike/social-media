# longform-edited — skill

Pipeline for turning a raw recording into a **heavily-edited** longform 16:9 video — b-roll,
music, motion graphics, punchy cuts, the works. This is the **craft-forward** longform track:
the goal is production value, and the editing section below is **meant to grow over time** as we
develop a house style. (Forked from `longform-presentation/longform-presentation.md` on 2026-06-09.)

**How this differs from `longform-presentation/`** — keep them separate, do not cross-contaminate:
- `longform-presentation/` is **frozen** by design: slide-deck + presenter PiP, readable on-screen
  text/code, gentle pacing, spotlight-Remotion payoff. Don't add new editing techniques there.
- `longform-edited/` (this track) is **footage/edit driven**: no slide-text-readability constraint,
  cuts can be tighter, and the value is in the layered edit (b-roll, sound design, graphics, pacing).
  We iterate and improve the style here.

The *starting* mechanics (compress → transcribe → sync-safe cutting) are shared and proven, so
Phases 1-3 are forked verbatim. Phase 4+ (the actual edit) is **open and evolving** — see below.

> **READ THE `skills/` RULES BEFORE EDITING (do not skip).** Specific, frequently-violated longform-edited
> rules are factored into `longform-edited/skills/` so they stay front-and-center: **`skills/captions.md`**
> (caption density + when captions are allowed) and **`skills/broll-and-containers.md`** (FILE-LEVEL
> BROLL-PLAN manifest with ZERO orphans · SYNC every cue to the word-level transcript · b-roll ≤4s ·
> containers are the dominant, deck-styled cover layer · no black > 0.5s), **`skills/charts.md`** (data charts /
> animated data-graphics: the DATA.md chart-source index, the code/screencap/restyle build-mode decision + the
> NEVER-let-an-image-model-be-the-source-of-a-number guardrail, and animate-for-real vs reveal-a-bitmap), and **`skills/overlays.md`**
> (overlay effects — e.g. the light-leak on >5s face holds — that sit over SUSTAINED footage and must never
> share a frame with a transition), **`skills/music.md`** (bed levels · LOOP a short bed · fades · end-align ·
> duck · no silent pass), and **`skills/edit-plan-and-cue-sheet.md`** (the EXACT format of the two planning
> artifacts — event-log EDIT-PLAN + layer-grouped CUE-SHEET, bittensor exemplar). The house rules below still apply;
> the `skills/` files are the load-bearing specifics. **Before any full render, reconcile the comp's asset
> references against the asset folder — every downloaded/generated file is either placed (with timecode) or
> marked REJECTED in BROLL-PLAN.md. A full render confirms; it never discovers what's missing.**
>
> **`skills/video-qa.md` — MANDATORY gate before declaring ANY render done.** QA 10-second CHUNKS at every
> changed spot FIRST (stills can't show motion/audio/timing), fix, THEN one full render, THEN `/watch` the
> whole video + measure SFX levels vs VO. Never call a render "done" off a spot-check.

**Scripting comes first: see `screenplay.md` (this folder).** That is the canonical skill for writing a
project's `SCREENPLAY.md` — chapter map, the SAY-vs-direction convention, the per-chapter Title-card flag,
the sparse `[FACE]`/`[COVER]` gated-face tags, and the system-design-container rule for explainer
visuals. This file (`longform-edited.md`) governs the EDIT; `screenplay.md` governs the SCRIPT.

## Folder convention

Each video is its own project folder under `media/<project name>/`. Scripts in `scripts/` all take
paths as arguments — point them at the project folder.

```
media/<project>/
  <project>.mkv                  master raw (OBS) — never edit, never delete
  <project> LOW BPS.mp4          working master (Phase 1)
  <project> LOW BPS.medium-words.json   canonical transcript (Phase 2)
  <project> EDIT.mp4             cleaned base cut (Phase 3) — the canvas the edit is built on
  <project> FINAL.mp4            the finished, fully-edited deliverable (Phase 4+)
```

---

## Phase 1 — compress to a LOW BPS mp4

Transcode the heavy raw `.mkv` down to a lighter working mp4. Single-pass NVENC, **no silence cutting**.

```
python scripts/to_low_bps.py "media/<project>/<project>.mkv"
```

- Default target 2 Mbps video + AAC 128k (maxrate/bufsize auto-scale off `--bps`). Output written
  beside the source as `<name> LOW BPS.mp4`. Override with `--bps 2.5M` / `--out <path>`.
- **No hard floor here** (unlike presentation's 2 Mbps slide-text rule) — this track has no
  fine on-screen text to protect, so you can go lighter for a talking-head source if you want a
  smaller working file. Keep the master `.mkv` pristine; the edit's quality comes from re-grabbing
  hero footage from the master where needed, not from the working proxy.

---

## Phase 2 — transcribe (word-level)

```
python scripts/transcribe.py "media/<project>/<project> LOW BPS.mp4"   # --model medium (default), GPU auto
```

- Defaults to **`medium`** on GPU. Use medium, not base: base "cleans up" disfluencies (stammers,
  false starts) — exactly what we need to SEE when hunting fumbles. ~1 min for a 10-min file on an
  RTX-class GPU.
- Writes `<name>.medium-words.json` (word timestamps) and prints `[start-end]` segments. Source of
  truth for fumble locations and any later caption / b-roll-cue / music-sync work.

---

## Phase 3 — base cut: defumble, THEN (optionally) tighten silence

Produce the clean spoken base (`EDIT.mp4`) the edit is built on. **Two SEPARATE passes — never both
at once** (combining them is what clipped words and missed fumbles on silverscript, 3x).

### Phase 3a — defumble (CANONICAL: `video-creation/skills/defumbler/defumbler.md`)

Removing fumbles ("say-it, stop, retake" → keep the last clean take) is its own skill now. **Read and
follow `defumbler.md`** — do not re-derive it here. The one-line summary of why the old approach kept
failing: Whisper HIDES retakes and its word timings DRIFT, so you must cut at SILENCE boundaries off
a silence-segmented, per-chunk transcript (`defumbler/scripts/chunk_map.py`), never on a word
timestamp, and get Mike's text cut-plan approved before rendering. Output is `<project> EDIT.mp4`
(rendered by `defumbler/scripts/remove_spans.py`).

> The old per-track helpers `detect_fumbles.py` / `audit_coverage.py` are **diagnosis/context only**
> — never cut directly from them. They stay in `scripts/` but defer to `defumbler.md`.

### Phase 3b — tighten silence (separate pass, ZONE-based) → use the **desilencer skill**

Silence-only, sync-safe. This is NOT a track-local script — it is the canonical, track-agnostic
**desilencer** (`video-creation/skills/desilencer/desilencer.md`, tool `desilence.py`). Read it before running.
**Mike's standard (2026-06-13): tight INTRO, relaxed BODY** — punchy hook, breathing-room rest:
```
python ../skills/desilencer/scripts/desilence.py "media/<project>/<project> EDIT.mp4" \
    --out "media/<project>/<project> EDIT-tight.mp4" \
    --split <hook-end-sec> --sil-pre 0.25 --sil-post 0.5 --map-out "media/<project>/rapid-map.json" --nvenc
```
- `--sil-pre` = INTRO zone min-silence; `--sil-post` = BODY zone min-silence. **The min-silence DURATION
  is the only knob.** Pick it BELOW the speaker's natural pause cluster (run the histogram/sweep in
  `desilencer.md`) — at the cluster it barely cuts. Silverscript: pauses clustered ~0.6s, so 600ms did
  almost nothing; **250ms intro / 500ms body** gave the rapid-fire pacing Mike approved.
- The −57/−52 dB RMS thresholds are FIXED (never single-threshold `silencedetect`, never hotter — that
  clips words). `--map-out` exports the cut list so the Remotion comp can remap its cue times.
- `--split` = seconds where the hook/cold-open ends (find it in the chunk map).
This pass cuts ONLY silence; defumble first as a separate step (`defumbler.md`). `build_two_zone.py` is
deprecated and now redirects here.

### The cutting method (non-negotiable — the desync fix, applies to BOTH passes)

Cut with **`filter_complex` `trim`+`atrim`+`concat` in a single pass** (`remove_spans.py` and the
desilencer's `desilence.py` both do this). It re-times audio and video together, so lip-sync is preserved by
construction. Do **NOT** use the livestream `longform_desilence_fast.py` concat-**demuxer** approach
— it drifts A/V. Same rule for every later stitch/concat in this track.

### QA the base cut before building the edit on it

1. **Re-run the chunk map** (`defumbler/scripts/chunk_map.py`) on the output — no partial/restart
   chunk survives, no clipped word at a join. (Re-transcribing the whole output is NOT enough —
   Whisper dedupes there too.)
2. **A/V drift:** the cutter reports `video` vs `audio` duration — expect < ~50ms.
3. **Visual splice check:** extract a frame either side of the biggest cut — live footage, no
   black/frozen frame.

---

## Phase 4+ — THE EDIT (open, evolving — this is the whole point of the track)

> This section is intentionally a **living style guide**. It starts thin. Every time we finish a
> video and Mike reacts to it, distill what worked / what he flagged into a concrete, reusable rule
> here — that's how this track "improves over time." Treat it like the per-platform skills: when a
> decision is made, write it down the same turn (see the repo-wide "persist decisions in the skill"
> rule) so it doesn't regress once chat context rolls off.

### ⛔ HARD RULE — a DRAFT is the FULL build at low BITRATE, never a reduced feature set (Mike, 2026-06-25)
"Draft" / "0.3 Mbps" refers ONLY to video **bitrate** (a fast, light proxy for review) — NOT to completeness.
A draft MUST contain every element the video's plan calls for. Omitting elements and calling it a "draft" is a
**GATE VIOLATION**. (This produced the worst longform-edited draft to date — smartmoney-backing-kaspa CH1-7 v1:
no captions, no cube cards, no glitch transitions, charts FAKED as static screenshots with a wipe, no punch-ins,
no CSS containers, mis-placed risers. Rebuilt to spec.) Before ANY draft render, verify EVERY applicable item is
ACTUALLY in the comp — not "deferred to the next pass":
- [ ] **REAL Remotion-animated charts** (drawn/grown/counted via `useCurrentFrame`) — a PNG of a chart with a
      wipe is NOT an animated chart.
- [ ] **Chapter title cards** use the video's picked transition (this project = **cube**, `@remotion/transitions`) — every card.
- [ ] **Glitch** (Bad Signal `TransitionClip`) on the AI/atmosphere stills.
- [ ] **Film-burn** on every FACE cut (in and out).
- [ ] **Punch-in zoom** (~20%) on every FACE beat > ~2s.
- [ ] **Captions** where the video's policy calls for them (this project = intro/hook + every FACE hold > 5s; canonical captions skill).
- [ ] **CSS presentation containers** (ported from the deck) on cover beats — house rule #9, not only b-roll/stills.
- [ ] **Full-screen receipts sized right** (a webpage cap = full video WIDTH, top-aligned, readable — never a tiny contained thumbnail).
- [ ] **Music beds** on every chapter + **risers/impacts landed ON their real reveal frames** (not approximate).
If an element genuinely can't be built, **STOP and tell Mike BEFORE rendering** — never render-then-list-omissions.
QA must check "does it meet every documented requirement," not just "does it play / no black gaps."

### ⛔ HARD GATE — build the EDIT-PLAN before ANY editing (Mike, 2026-06-18)
After the A-roll is recorded, **gated, and desilenced** (the `EDIT.mp4` spine + Phase-2 word-timings exist)
and **BEFORE any editing / Remotion work begins**, build `media/<project>/EDIT-PLAN.md`. **Editing may not
start without it.** The EDIT-PLAN is the edit's companion to the screenplay (read alongside the spoken text):
it lists **every beat / spoken line in order**, and against each, **every layer that lands on it**, each with
its timecode and file:
- **IMAGE** b-roll (file) · **VIDEO** b-roll (file) · **CSS CONTAINER** / diagram (id)
- **TRANSITION** (type: cross-warp / dissolve / book-flip / film-burn …)
- **LIGHT LEAK** / **FILM BURN** (and any other visual effect)
- **IMPACT** + **RISER** — SFX hits / build-ups (file); tag them `[IMPACT]` and `[RISER]`, not a generic SFX.
  **A reveal/transition impact is usually preceded by a riser that builds INTO it** (`assets/sfx/Impacts/WHEN-TO-USE-IMPACTS.md`:
  "build the anticipation"; riser library `ends_in_impact`). Plan + notate the riser and its impact as a PAIR —
  the riser ENDS ON the hit (riser_start = impact_time − riser_duration) — and show the link in the EDIT-PLAN
  (`[RISER] … → resolves into [IMPACT] at M:SS` / `[IMPACT] … (riser-led from M:SS)`). Whenever you place a
  reveal/transition impact, decide whether it wants a riser lead-in (and vice versa). **Land the impact on the
  ACTUAL graphic/logo-reveal frame (the logo pop / title drop), not an adjacent chapter card a few seconds off**
  (Mike, 2026-06-18: the CH5 boom belonged on the Bittensor logo at 7:16, not the "How It Works" card at 7:20.8).

Every sourced or generated asset is either PLACED (with timecode) or marked `REJECTED`/`BENCH` here — **zero
orphans.** This SUPERSEDES the old `BROLL-PLAN.md` (b-roll was only one layer); the file-level manifest is now
part of the EDIT-PLAN. An empty cell = a beat with no cover/effect = a decision to make BEFORE rendering. The
render CONFIRMS the plan; it never DISCOVERS what is missing. (This rule exists because b-roll AND impacts/risers
each silently never made it into a finished render — they had no row to be missing from. See
`skills/broll-and-containers.md` "the manifest is the contract".)

### ⛔ HARD GATE — the CUE-SHEET (spotlight timing, built from the transcript) (Mike, 2026-06-21)
The EDIT-PLAN says WHICH container covers a beat; it is **beat-level**. It does NOT say WHEN each sub-point
inside a container lights up — and without that, the build ports the whole deck **slide** and holds it (the
exact regression: kaspa-covenants C1 held 18s, C2a showed the full hardfork slide at once). So after the spine
+ Phase-2 word-timings exist and BEFORE wiring containers into the comp, build **`media/<project>/CUE-SHEET.md`**:
- **One row per container SUB-POINT** (not per container). For every container, break it into the individual
  points it makes — each mini-card, each pillar, each rule, each diagram node — and give each a `tIn–tOut`
  **snapped to the WORD-LEVEL transcript** (the exact line where he starts saying that point to where he moves
  on). The container's title/chrome can persist; the SPOTLIGHT (the highlighted/revealed sub-point) swaps on
  the spoken word, ~5-12s each.
- This enforces the spotlight rule (`broll-and-containers.md`: ONE point at a time, never the whole slide) and
  house rule #3. The comp reads the cue-sheet; it never shows a container's full slide at once or holds one
  point > ~12s.
- Reconcile the comp against the CUE-SHEET before every render (it's QA checklist item #9 in `skills/video-qa.md`).
  The CUE-SHEET is the bridge between the EDIT-PLAN (beat-level manifest) and the frame-level comp.

### Render + project assets (canonical)
- **Project-specific render assets live in `media/<project>/render-assets/`** (spine, music, deck/, img/, vid/,
  receipts/, charts, logo) — NOT in `video-creation/assets/` (that's for SHARED/reused assets only). The comp's
  `asset()` = `staticFile(f)` and the public dir is set PER-RENDER.
- **Render command** (Bittensor comp; `BittensorCh1to6` renders the full CH1-9 despite the name). The output
  path ALWAYS lands in the project's own media folder, never the shared `remotion/out/` scratch (rule #7 below;
  `comp-build.md` §10-11) — a **draft/QA** slice goes in `_previews/`, a **kept deliverable** pass in `renders/`:
  `cd video-creation/remotion && npx remotion render src/index.ts BittensorCh1to6 "../longform-edited/media/<project>/_previews/<project>-draft-vN.mp4" --public-dir "../longform-edited/media/<project>/render-assets"`
  (omitting `--public-dir` → assets don't resolve). Concurrency 8 (`remotion.config.ts`); ~40 min for a 14-min
  video; Remotion can't GPU-encode h264 on Windows so the encode is CPU (doesn't matter — the bottleneck is the
  spine OffthreadVideo decode). `--frames=A-B` renders a slice (use for the video-qa chunks — those land in
  `_previews/qa/`, `video-qa.md` STEP 0).
- **SFX (impacts/risers) + audio fades are mixed onto the finished render with ffmpeg, NOT in the comp** — so
  any audio change (level, swap, new cue, fade) is a ~1-min re-mix with `-c:v copy`, NO re-render. Only VISUAL
  changes need a Remotion render.
- **Cuts (desilencer leftovers / fumbles)** are a `CUTS` array in the comp + `sh()` (multi-segment Spine skips
  each window); when you add/change a cut, EVERY time value must route through `sh()` (incl. hardcoded constants
  — music beds, CTA windows — and caption times). See memory `feedback_shift_every_time_value_on_cut`.

The base cut (`EDIT.mp4`) is the spoken spine. The edit layers production value on top of it. Tools
already in the repo to draw from — don't reinvent:

- **B-roll:** `video-creation/generate-broll-batch.js` / `generate-broll-batch` flow, Higgsfield
  (`higgsfield-generate` skill, Seedance video) for AI b-roll of Mike's likeness or concept shots.
  **Stock video b-roll:** `video-creation/skills/envato-broll/SKILL.md` (Envato Elements search +
  license + download, Playwright). Full-screen image b-roll: ChatGPT image gen (repurpose
  tooling), saved to the project's own `assets/` folder. Plan every slot in
  `media/<project>/EDIT-PLAN.md` (the HARD GATE above) for Mike's review before capturing assets.
- **Music:** `video-creation/skills/music-sourcing/` — Soundstripe search + download + license-code (see
  `project_music_sourcing_skill`); persist the license code into the queue caption_override once.
- **Motion graphics / overlays / captions / spotlight:** the repo Remotion project
  `video-creation/remotion/` and the canonical **caption skill** (`video-creation/skills/captions/captions.md` —
  captions are OFF by default for longform-edited; only add them when Mike explicitly asks).
  Sync graphics/cuts to narration via the Phase-2 word-timings.
- **Gaze / camera-look** (if you cut to face-to-camera moments): `video-creation/skills/gaze/SKILL.md`,
  refine step mandatory.
- **Partial replacement** (keep original head/tail, replace a middle window): render ONLY the
  replaced window, then `ffmpeg filter_complex concat` the 3 pieces — never re-render pristine
  footage through Remotion (see `feedback_partial_replace_ffmpeg_concat`).

### House-style rules (grow per video)

**1. Mike's face stays on screen; containers live in the CONTENT BODY beside it.**
This is the key divergence from `longform-presentation/` (face only in cutaways there). As BUILT
and approved on `banks-own-chain` (2026-06-11, supersedes the looser 06-09 sketch):
- **Keep the recording's right strip (webcam + CTA graphic) VERBATIM**, cropped from the EDIT
  spine video, full height. The audience watches Mike the whole time; the CTA graphic stays
  up top-right for free. Everything left of the strip (the "content body", where he screen-shared
  the deck) is REBUILT: deck-navy background + the slide's orb glows + the spotlighted container.
- **Measure the strip geometry per recording, with pixel scans, not by eye** (on banks-own-chain
  the strip is x ≥ 1488 of 1920). GOTCHA: OBS graphics can OVERHANG a straight crop line — the
  Premium Membership box ran 31px past the strip edge and its text got clipped until the crop
  became a clip-path with a notch. Scan the actual pixel bounds of every graphic near the edge
  (diff frames / color-mask in PIL) and verify the first render against the source frame.
- Containers are cued to what he's saying via the Phase-2 word-timings. Pull the *content body*
  of each container from the deck HTML, port its CSS/colors/fonts exactly, then ENLARGE (bigger
  type/padding, same chrome) to fill the content-body width — don't render deck-sized cards into
  a bigger box.
- **Cue strictly off the EDIT transcript; omit containers he never spoke.** (banks-own-chain:
  the slide-9 "use your voice" box wasn't in the recording, so it isn't in the video.) Don't
  show content the narration never touches.
- **Receipts (article screenshots) are edit-time cutaway assets, NOT embedded in the deck HTML.**
  Capture them to `media/<project>/screenshots/` ahead of the edit (a throwaway headless-Chrome
  Playwright script works; see `banks-own-chain/_capture-screenshots.js`). They pop in centered
  over the content body (scale-back pop, ~0.4s) and obey rule #4 like everything else.

**2. Full-screen b-roll is sparse punctuation: ~5 video + 5 image per longform, 1-4s each.**
(Mike, 2026-06-11, on `banks-own-chain`.) The dominant visual layer is the container-overlay
presentation (rule #1); full-screen b-roll cutaways only punch the biggest beats.
- Budget ≈ **5 Envato stock clips + 5 generated images** for an ~11-min video. Do NOT carpet
  the timeline (a 30-slot plan got cut to 10).
- **1 to 4 seconds on screen, never more.** Stock clips longer than 4s: use the FIRST 4s only
  (Mike's standing editing convention). This applies to BOTH images and videos — a still that sits
  for 16s, or a clip that plays out then freezes, both violate it.
  - **Exception — immersive "leading" motion:** a clip whose camera continuously LEADS the viewer in
    (corridor dolly / fly-through / slow push-in) is a pattern interrupt that holds attention and MAY run
    **up to ~5s** (Mike, 2026-06-18; canonical detail + example in `skills/broll-and-containers.md`). Sparingly.
- **No black/blank screen > 0.5s (Mike, 2026-06-17).** A cover beat must always show SOMETHING. If
  there's no b-roll for a stretch, fill it with a **deck container** (the default, rule #9) — not black,
  not a held still. The ONLY allowed black is when the SCRIPT earns it (e.g. "and it went dark", "gone").
- **Containers are the DOMINANT cover layer; b-roll is ≤4s punctuation (reinforces #1/#3).** A long cover
  beat (10-20s of narration with no face) is carried by **containers spotlight-swapping** one point at a
  time, with the occasional ≤4s b-roll cut between them — NEVER one long b-roll hold and NEVER a gap.
- Plan slots in `media/<project>/EDIT-PLAN.md` (per-beat layer table + bench of swap-ins) and get
  Mike's sign-off BEFORE capturing assets. Receipts (article screenshots) are a separate
  device and don't count against the 10.
- Captured originals live in the project's own `media/<project>/assets/` (images/ + video/).
  Render-ready copies/proxies go to the project's own `media/<project>/render-assets/` and the comp
  renders with `--public-dir <project>/render-assets` (`asset()` = `staticFile(f)`). **NEVER** under
  `video-creation/assets/` — that's the shared library only (see SKILL.md "Asset folder organization").

**3. Container presentation is a SPOTLIGHT, not a slideshow: ONE container at a time, enlarged
to fill the content body.** (Mike, 2026-06-11, on `banks-own-chain` — the same correction he made
on the presentation track's Phase 4.) While Mike talks about a topic, show ONLY that topic's
container, scaled up so it fills the content-body width (the area left of the webcam strip).
Never accumulate multiple containers on screen like a slide. Chapter titles (= slide titles) are
their own scene at each chapter boundary. Entrances: chapter title = book-flip (rotateY around the
left spine); containers = ~0.35s cross-fade + 0.93→1 scale-in (the QE spotlight recipe, constrained
to the content body instead of full screen).

**4. Presentation content transitions OUT before ANY other visual appears (b-roll, receipts,
overlays, lip-sync — anything), and back IN after it clears.** (Mike, 2026-06-11, on
`banks-own-chain`: a receipt popped over a still-visible spotlight scene.) Never show a
presentation scene and an overlay at the same time, even partially. Implement as occlusion
windows: scene layer fades out ~0.35s before each overlay window opens and fades back ~0.35s
after it closes; merge windows that sit closer than ~0.6s so the scene doesn't flicker between
back-to-back overlays (see `OCCLUSIONS` in `remotion/src/BanksOwnChain.tsx`).

**5. Default transition kit** (chosen by Mike on `banks-own-chain`, 2026-06-11 — reuse unless he
specifies otherwise, and ASK only if a new device type appears):

| Event | Transition |
|---|---|
| New chapter (title card = its OWN self-contained scene) | **Pick ONE per video** from the chapter-transition handful in **`../assets/transitions/README.md`** (slide · flip · cube · book-flip · swap) and use that SAME one for EVERY title card in the video (mixing reads amateur). These are `@remotion/transitions` presentations applied to the self-contained title-card scene — allowed because a title card is NOT the locked face spine (see the README HARD RULE). banks-own-chain hand-rolled a book-flip before the package was wired; new videos use the README pick. |
| VIDEO b-roll in/out | **Dissolve** (plain opacity, ~0.5s each side) |
| IMAGE b-roll in/out | **Cross warp** (directional gradient-mask sweep + skew/blur settle in; opacity + reverse warp out, ~0.5s) |
| Container scene change within a chapter | **Cross-fade + scale-in** (0.35s, 0.93→1) |
| Lip-sync / avatar insert in AND out | **Film burn** (warm radial flash peaking exactly on the cut, ±0.38s) |
| **FACE cut in AND out (gated-face spine, #6)** | **Film burn** on EVERY cut to/from his face — same warm radial flash; this is the gated-face signature (reuses the film-burn slot since the gated spine has no lip-sync avatar). Keep intensity dialed so frequent face cuts don't strobe. (Mike's standing rule, 2026-06-17.) |
| **FACE hold on screen > 5s (gated-face spine, #6)** | **Light leak** overlay — canonical rule in **`skills/overlays.md`** (sustained-interior warmth, inset ~0.6s off the film-burn cut so an overlay never shares a frame with a transition). Short punctuation faces (<5s) stay clean, film-burn only. |
| Vertical insert display (lip-sync clip etc.) | Centered portrait + **blurred wings** (blurred, dimmed copy of the same clip filling the frame) |

**Scope note (reconciled 2026-06-24):** the rows ABOVE that ride the **continuous face spine** —
b-roll in/out, container/scene changes, lip-sync/face film-burns, light leaks — are **hand-rolled with
`interpolate`** (do NOT run the locked-audio spine through `@remotion/transitions`/`TransitionSeries`; it
swallows frames and drifts sync — the README HARD RULE). The **chapter title-card** transition is the ONE
exception: a title card is a self-contained scene, so it uses a `@remotion/transitions` presentation picked
per video from `../assets/transitions/README.md` (the canonical transition reference for all tracks). The
glitch library (`../assets/transitions/library.json`) is a THIRD, separate set for glitchy-fast hits.
Working implementations of the hand-rolled originals live in `remotion/src/BanksOwnChain.tsx`; the
gated-face **film-burn reuses that same film-burn**, and the **light-leak overlay is a new device to
build** (drive its drift/intensity with `@remotion/noise` or `random(seed)` keyed to frame, never `Math.random`).

**Glitch transition library (NEW, 2026-06-20).** Beyond the hand-rolled overlay transitions above, the repo
now has a reusable **GLITCH transition library** at `video-creation/assets/transitions/library.json` (Remotion
re-creations of the Swiftly pack: **Blocks** Max/Medium/Short + Strips 1x-6x, and **Cinematic Bad Signal**
Max/Short; each carries baked SFX). These are the repo's OWN engines — drop one in at a cut via
`remotion/src/transitions/TransitionClip.tsx` with an `id` from the catalog (`<TransitionClip id="blocks-max-1"
cutFrame={f} outgoing={...} incoming={...} />`). This is NOT `@remotion/transitions`, so the don't-add rule
above still holds; it is our internal library. Pick by scanning each row's `meta` (energy / tags / useWhen /
`aspectRatios` — match the comp's 16:9). Catalog rules + how it's built live in `assets/transitions/CLAUDE.md`.
- **EXPERIMENTAL gated-FACE glitch convention (Mike, 2026-06-20; validate in editing):** cut TO Mike's gated
  face with a **Glitch · Blocks · Max** (`blocks-max-1/2/3`) instead of (or alongside) the film-burn. For a
  FACE beat that runs longer than ~2s, add a re-engagement **punch-in** at ~2s: cut into a **~15% zoom** on his
  face with a **short** glitch (`blocks-short-*` or `blocks-strips-*` — the lower "Min/other" tier; there is no
  literal Min intensity). Decide glitch-vs-film-burn per video.

**6. Second valid spine architecture: full-screen GATED face (use when there's no clean webcam
strip to crop).** (Established on `silverscript`, 2026-06-14.) banks-own-chain's strip + content-body
model (#1) assumes a usable right-strip framing. When the recording doesn't have one (Mike sat
off-center, no on-screen CTA graphic, full-screen single cam), use this instead:
- The desilenced spine plays **full-screen as the face layer, reframed at composite time** (zoom +
  x/y offset to center him — silverscript: `scale 1.35`, left −475 / top −90 of a 2592×1458 video),
  but its **opacity is GATED** — visible ONLY during `FACE_SPANS` (the to-camera beats), BLACK
  everywhere else (audio always plays). Every non-face beat is a full-screen COVER (container /
  b-roll / image) on top. Reframe is global (one component) so it's safe to tweak after the back
  half is built.
- **FACE_SPANS are the only windows the face shows.** Set each `[start, end]` off the whisper
  transcript to the EXACT spoken to-camera line.
- **Face-leak rule (Mike caught this at 5:59 on silverscript):** a FACE span must END exactly where
  its spoken face line ends, AND a cover must be on screen for every non-face moment. Failure mode:
  a face span runs slightly long, or the next cover starts late, leaving a gap → his face shows
  *reading the script off his monitor*. QA: walk every face-span boundary against the transcript and
  confirm the next cover's `tIn` ≤ that face-span's end (overlap ~0.2s). Any uncovered gap is a leak.
- **Build to the transcript, NOT the screenplay.** The recorded take diverges from the written plan
  (silverscript: the rising-tide hype block was never said; CH7 collapsed to ~11s). Transcribe the
  actual spine, cue every beat off comp-time segments, and omit planned beats he didn't say.

**7. Impacts / sound design — sparse punctuation, data-driven.** (silverscript, 2026-06-14; first
video on this track with music + SFX.) Follow `assets/sfx/Impacts/WHEN-TO-USE-IMPACTS.md`:
- Fire an impact on **every chapter-transition cut** + **major graphic reveals only** (corrected
  diagram, before/after, timeline strip). NOT on every container/b-roll change, and **NOT on the
  mid-roll plug** (keep that conversational, no cube either).
- Implement as a data-driven `IMPACTS[]` (`{ at, big? }`) → an `Impact` component (a `<Sequence>`
  playing the wav). Stage chosen wavs into the project staticFile dir. Impact files peak at
  full-scale, so attenuate (~0.4 normal, ~0.55 big) and tune by ear.
- **Vibe cut = bigger impact + a momentary MUSIC DUCK** (1-2 biggest conviction beats per video,
  e.g. the close). Do the duck with the body `<Audio volume={(f) => ...}>` function dipping (~18%)
  across the hit window — not a separate edit.

**11. A title card PAUSES the A-roll — hold the spine frame + SILENCE ~1000ms while the card animates in and
holds, THEN resume narration (Mike, 2026-06-25).** Never play a chapter title card OVER continuous narration —
it flashes by unreadable and the chapter feels skipped (Mike: "we jump right into CH2"; "2:50 card goes off so
fast it's hard to read"). **The pause goes in the SILENCE *before* the new chapter's FIRST spoken word — never
at an estimated boundary (that cuts a word in half; Mike, "you cut 'fixated' in half").** Get the EXACT word-start
of each chapter's opening word from the word-level transcript, insert the 1s freeze+silence at that timestamp (the
breath before it), then the chapter's voice begins. Shift ALL downstream cue times (covers, captions, punch-ins,
music, SFX) by the accumulated pause.

**12. No b-roll asset is reused — each ChatGPT still / Envato clip appears at MOST ONCE per video (Mike,
2026-06-25).** Seeing the same image/clip again seconds later reads cheap (Mike caught a repeat within seconds).
If you run short of distinct b-roll for the cover beats, prefer a deck container or a chart over repeating an
asset; or generate/source a new one. Reconcile the cover list before render: zero assets appear twice.

**13. COVER is ONE sequenced layer, and a CONTAINER *is* b-roll (Mike, 2026-06-29).** Do NOT model cover as a
container held UNDERNEATH with b-roll popping on top of it. A cover beat is a **single ordered timeline of cover
items** (containers, diagrams, charts, stills, video b-roll), played one after another, **each with its own
explicit time slot**. The container is just another item on that one track, not a background layer.
- **The failure this prevents:** a container starts, a b-roll clip plays OVER it and consumes the beat's time,
  and when the b-roll ends the container reappears for a sliver and vanishes (it reads as broken). Mike has
  caught exactly this.
- **The fix:** partition the beat's time and SEQUENCE it, container A for its slice -> b-roll for its slice ->
  container B for its slice, all consecutive on the one cover track. When the cover plan reads
  `[container, b-roll, container]`, that is three sequential slots, NOT a container spanning the whole beat with
  b-roll laid over the middle.
- This is the time-allocation half of the occlusion rule (#4): the scene does not merely fade out for the
  overlay, it **yields its TIME** to it. In the comp, build cover as a `<Series>`/sequential cue list with
  non-overlapping `[tIn,tOut]` windows for every cover item (container AND b-roll alike), not two independent
  layers that can fight for the same seconds.

### Phase 4 build recipe (validated on banks-own-chain, 2026-06-11)

1. **Comp architecture** — one Remotion comp (1920×1080@30), registered in `src/Root.tsx`.
   Layers bottom→top: content body (scene engine, rules #1/#3) → spine strip (`OffthreadVideo`
   of the EDIT mp4, clip-path cropped to the strip; THIS layer carries the audio, always
   mounted) → receipts → full-screen b-roll → lip-sync insert → film burns. Duration = EDIT
   duration × fps.
2. **Scene engine** — a flat `SCENES[]` list (one entry per spoken beat: chapter-title scenes +
   one scene per container), each `{ t, chapter, flip?, node }` with `t` = EDIT-timeline seconds
   from the word-json. Active scene = last one whose `t ≤ now`; entrance per the kit above;
   outgoing scene cross-fades under the incoming (skipped across a book flip). Per-chapter orb
   colors come from the deck slides.
3. **Overlay timing tables + occlusions** — `BROLL[]`, `RECEIPTS[]`, lip-sync constants feed
   both the overlay layers and the merged `OCCLUSIONS` windows that drive rule #4. One source
   of truth; never hand-time an overlay in two places.
4. **B-roll proxies** — pre-transcode every stock clip to its slot: first ~4.5s, scale-crop to
   1920×1080, 30fps, `libx264 -crf 18`, audio stripped. NEVER feed 4K ProRes to
   `OffthreadVideo` (V3 was 1.5 GB / 4096×1840 — the proxy is 2 MB). NVENC can be unavailable
   inside a sandboxed ffmpeg session ("No capable devices found") — libx264 is fine at these
   sizes, don't fight it. Images render as-is via `<Img>`; downscale receipt screenshots to
   ~1700px wide.
5. **Sequence-relative time gotcha** — `useCurrentFrame()` inside a `<Sequence>` is RELATIVE to
   the sequence start. Any layer that interpolates against absolute timeline seconds must add
   the sequence offset back (see the `t0` prop pattern in the comp). Symptom if forgotten: the
   transition runs at the wrong time or not at all.
6. **Mute every overlay video** (`muted` on b-roll and lip-sync `OffthreadVideo`s) — the spine
   strip is the single audio source and is never unmounted.
7. **Render OUTPUT goes in the project folder, NOT `remotion/out/` (Mike, 2026-06-17).** Always render
   to a path inside `media/<project>/`, so the deliverable lives with its project and is never an orphan
   in the generic Remotion `out/` dir. Two subfolders, by keep-vs-throwaway:
   - **`renders/`** — KEPT deliverable passes; the finished cut is `media/<project>/<project> FINAL.mp4`.
   - **`_previews/`** — DISPOSABLE outputs: draft renders, preflight stills, chart tests, render logs, and
     QA frame-grabs/stacks (the last in `_previews/qa/`, `video-qa.md` STEP 0). `comp-build.md` §10-11.
   **Nothing renders or screenshots to the bare `remotion/out/` — it is shared, cleanup-swept scratch, so
   anything left there is an orphan** (this is how the `_nlg_preflight.png` / `_qa_*.png` stills leaked and
   had to be recycled by hand, Mike 2026-07-08). Segmented-render intermediates (the `out/seg*/` working
   folders) are the one allowed exception — they are large temporaries the cleanup job sweeps by design.
8. **Preview gate before the full render** — render the first ~60s (`--frames=0-1799`) PLUS a
   short window for each special device not in the first minute (e.g. the lip-sync insert), QA
   frames yourself (scene/overlay edges, strip alignment, transition mids), then give Mike the
   file paths and STOP for his review. Only render the full timeline after he approves; stitch
   approved-head + remainder with sync-safe `filter_complex concat` if re-rendering only part.
9. **Cover beats with NO planned b-roll default to a deck CSS container (Mike, 2026-06-17).** Every
   `[COVER]` beat needs something on screen; where there's no planned b-roll for a beat, use the matching
   **CSS container from the project's slide deck** (`<project>-deck.html` / the presentation) instead of
   leaving an atmosphere still up. A long static image hold is a smell — a deck container almost always
   fits there and carries the actual point (the deck slides exist precisely to BE the on-screen containers).
   Port them into the comp as `CONTAINERS` cards (SilverScript pattern), one focused point at a time.
10. **The edit MUST ship with music — do NOT render a silent pass (Mike, 2026-06-17).** Always lay in the
   chapter music beds (per the screenplay Music plan) as part of the edit, never as an afterthought:
   measure LUFS (beds are mastered hot, ~-11 dB), set the bed ~16-18 dB under the VO, and include the
   inter-bed breath at each bed change. A render with no music is not a reviewable cut.
8. **Log as you build** — keep `media/<project>/PROJECT-LOG.md` current (geometry numbers, cue
   tables, corrections) the same turn they happen.
9. **Whisper word-timestamp truncation (silverscript)** — to get cue times off the spine, transcribe
   in PLAIN segment mode (`whisper <wav> --model small`). `--word_timestamps True` TRUNCATED after one
   segment on the CPU Triton fallback; segment `[start-end]` times are accurate enough to place beats.
10. **Brand/logo overlay (silverscript)** — a glowing-logo-on-black asset (e.g. `assets/logo-kaspa.png`)
    composites cleanly with `mixBlendMode: 'screen'` (the black backdrop drops out) — no transparent PNG
    needed. Used for corner bugs + the end card.
11. **Partial-replace splice boundaries (extends rule in §Phase 4 tools)** — when re-rendering only a
    changed window and `filter_complex concat`-ing it back, choose cut points at timestamps where the
    OLD and NEW renders are pixel-identical (inside an unchanged face/container beat, away from any
    transition), so the seam is invisible. Verify by extracting a frame either side of each cut.

**Music bed level (learned on why-ai-devs-use-python, 2026-06-13).** Mike thinks in Premiere
clip-gain dB (he reaches for **-20 / -30 / -35 dB**, "depends on the track"). Remotion's `<Audio
volume>` is the same thing: a linear gain on the source, so `volume = 10**(dB/20)` (−30 dB ≈ 0.0316).
Set it as an explicit `MUSIC_DB` constant, not a raw decimal. **Always measure first** (`ffmpeg
ebur128`): stock/corporate beds are mastered HOT (this one was −10.5 LUFS vs the −24 LUFS VO, i.e.
13.5 dB louder than the voice), so a "reasonable-looking" linear gain like 0.18 (−15 dB) still sits
~1 dB under the voice = way too loud. **Target the bed ~16-18 dB under the VO** (here −30 dB →
bed ≈ −40 LUFS); it's a ratio so YouTube's normalization preserves it. Banks-own-chain shipped with
NO music by Mike's call; this is the first with a bed.

**Dynamic leveling (silverscript, 2026-06-14).** When Mike asks the bed to "come down when the music
gets aggressive / louder, and come up (or down less) when it's subtle," that is **dynamic
normalization baked into the bed track**, NOT manual keyframing: `ffmpeg -i bed.wav -af
dynaudnorm=f=200:g=15:p=0.6:m=8 <project>-body-leveled.wav`, then play that track at one low constant
gain. **`loop` the body `<Audio>`** if the bed file is shorter than the video. (Momentary ducks for
vibe cuts are a SEPARATE device — the per-frame volume function in rule #7, not dynaudnorm.)

_Still open, fill in as we learn: cut pacing / energy curve, kinetic-caption look, color/grade,
CTA treatment._

---

## Hard rules

- Sync-safe `filter_complex` only — never the concat-demuxer method (A/V desync bug).
- Never edit or delete the master `.mkv`. Deletions go to the **Recycle Bin** (recoverable).
- Locate fumbles in the file you're about to cut; don't reuse timestamps across timelines.
- **No em dashes** in any titles/captions/queue text (persona `terminology_rules.no_em_dashes`).
- This track is separate from `longform-presentation/` — don't port edited-track techniques back
  into the frozen presentation skill, and don't pull slide-deck assumptions into here.

---

## Projects log

### banks-own-chain (2026-06-09 → 2026-06-11) — first video on this track, DONE

"The Banks' Plan to Destroy XRP and Crypto as a Whole by 2027". Project folder:
`media/banks-own-chain/` (full decision history in its `PROJECT-LOG.md`).

- **Phases 1-3:** 26:26 OBS multi-take recording → LOW BPS → EDIT4 11:21 (64 fumble cuts, zone
  desilence 250ms hook / 600ms rest, drift 15 ms). Taught the "Whisper HIDES retakes" audit
  (now mandatory in Phase 3) — Whisper dedupe cut Mike's GOOD retakes 4 times before the
  silencedetect-vs-word-coverage diff caught it.
- **Phase 4:** Remotion comp `remotion/src/BanksOwnChain.tsx` — spine strip crop + spotlight
  scene engine + occlusion windows + the default transition kit, all per house rules #1-#5
  above (this video is where every one of those rules was set). 10 chapters, 33 scenes,
  5 Envato clips + 5 ChatGPT images (BROLL-PLAN.md), 3 receipt pop-ins, 1 AI lip-sync insert
  (Creatify Aurora demo clip, film burn + wings). No music/SFX (Mike's call for this video).
- **Render:** staged previews (60s gate → 5min gate → remainder), assembled from the three
  original pieces in one filter_complex concat pass. **Deliverable:
  `media/banks-own-chain/banks-own-chain FINAL.mp4`, 11:21, 1080p30, drift 37 ms.**
- Corrections that became rules: spotlight not slideshow (#3), scene clears before overlays
  (#4), CTA overhang notch (#1), per-batch assets under `assets/projects/` (#2).

### silverscript (2026-06-13 → 2026-06-14) — second video on this track, DONE

"SilverScript: Kaspa's First Real Smart Contract Language." Project folder:
`media/silverscript/` (full decision history in its `PROJECT-LOG.md`).

- **Established house rules #6 + #7** (above): the full-screen GATED-face architecture (no webcam
  strip to crop) and the impacts/SFX + vibe-cut model. This video is where both were set.
- **Phases 1-3:** 30:35 single-take → defumble (`EDIT.mp4` 8:10, defumbler.md) → desilence
  250ms/500ms (`spine.mp4`, 427.6s). Pauses clustered ~0.6s, so 500ms body gave the rapid pacing.
- **Phase 4:** `remotion/src/SilverScript.tsx` — gated full-screen face spine (zoom 1.35, centered) +
  data-driven `FACE_SPANS` / `BROLL` / `CONTAINERS` (spotlight, full-screen) / `LOWER_THIRDS` /
  `CHAPTERS` (cube transitions) / `IMPACTS` + Kaspa-K logo (screen-blend) + end card. Diagrams/
  code/timelines are CONTAINERS, not AI images (text accuracy). Music = dynamic-leveled bed +
  vibe-cut duck.
- **Corrections that became rules:** machine-code b-roll showed the wrong (Rust) half → crop to the
  intended half rather than regenerate; UTXO term wanted on screen → `LowerThird` component; CH6
  face-leak at 5:59 → face-leak rule (#6); build to the transcript not the screenplay (#6).
- **Deliverable: `media/silverscript/SILVERSCRIPT-full.mp4`, 7:08 (427.75s), 1080p30.** Open: title/
  thumbnail direction (Mike's creative call).
