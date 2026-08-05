# PROJECT-LOG — kaspa 30bps

## ✅ VERTICAL CUT — `kaspa-40bps-VERTICAL.mp4` (2026-07-25)

1080x1920 · 30 fps · **13,720 frames — identical to the 16:9** · 2.0 Mbps · 136 MB · 7:37.4.
Built with the new **`/vertical-repurpose`** command (`.claude/commands/vertical-repurpose.md`), which
runs `skills/vertical-repurpose.md`. Nothing cut, shortened or re-timed.

**How drift was made impossible:** `Kaspa40Vertical.tsx` **IMPORTS** every timing table from
`Kaspa40Bps.tsx` — COVERS, LIBCUTS, CARDS, PUNCH/spineScale, FACE + caption windows, CARD_T and `sh()`.
The two cuts share the same objects, so the contract is enforced by the code, not by discipline.
Audio is the 16:9 mix taken WHOLE (`-c:a copy`): verified **sample-identical, max delta 0.000000**, which
also makes the per-seam AAC drift that bit the 16:9 build structurally impossible here.

**Every asset rebuilt native vertical** (`assets/vertical/`, 16:9 originals untouched):
12 Envato clips · 6 AI stills at 941x1672 · 7 receipts re-captured in MOBILE VIEW (390x844 @3) ·
19 slides + 4 diagrams re-shot at 1080x1920 from the SAME html sources · 5 animated charts re-laid out
in code (beat constants machine-diffed identical to the 16:9).

**Two content defects from the 16:9 fixed for free** (we were regenerating anyway):
- **IMG-6 Lab Token** now carries its real mark (the 16:9 shipped a blank coin — the reference-column bug).
- **R5 CMC** is cropped to the supply block via its DOM bounding box, so the price header and the red
  "Why is KAS's price down today?" prompt are OUT of frame. R2's mobile layout also puts the
  "arriving at 10 blocks per second" banner front and centre, where the 16:9 led with "4.4 bps".

**⚠ The ONE crop fallback: BR-11 (railway switch).** Envato has no vertical inventory for a diverging
turnout (7 portrait queries returned straight track, stations, tunnels, or the level crossing that
already failed QA). Concept outranks orientation, so it is a landscape 4K centre-crop with the diverging
blade held centre-frame. **Also cropped: the F1 opener** — the Higgsfield bg-swap clip is only 864px
wide, so portrait upscales it ~3.9x and it is visibly softer than the rest. Regenerating F1 vertically
via Higgsfield (480p rule) is the fix if Mike wants it sharp.

**⛔ Tool bug found and fixed during sourcing:** `skills/envato-broll/download-envato.js` hardcoded the
LANDSCAPE form `scale=-2:1080` in its >800 MB transcode, which turns a portrait 4K master into
**608x1080** — a silent, permanent downscale for a 1080-wide vertical comp. It now probes orientation.
Two clips had already been degraded and were re-downloaded. This would have hit every future vertical run.

**Gate fixes this run (both permanent):** `lint-covers` / `lint-slide-balance` now FOLLOW an imported
COVERS instead of failing to parse it — the gate was punishing the very design that prevents drift; and
`lint-deck-containers` now ignores soft background orbs, which at 1080 wide cleared its size threshold
and failed two correct slides (orbs measure ~0.6 mean gradient, real card boxes 1.3-1.8).

**QA:** concat seams at frames 4573/9146 verified frame-identical either side · blackdetect clean ·
framing spot-checked across face, chart, container, diagram, receipt, b-roll and both recordings ·
audio peak -1.9 dBFS. **NOT queued** — the vertical is a separate deliverable and stages only on Mike's word.

## ✅ FINAL — APPROVED BY MIKE 2026-07-25

**Deliverable: `kaspa-40bps-FINAL.mp4`** (project root) — 7:37.4 · 1920x1080 · 30 fps · 13,720 frames ·
h264 2.0 Mbps · AAC 320k 48 kHz · 133 MB · music mixed · A/V sync flat at -43 ms.
Superseded drafts and FINAL v1/v2 recycled; `_previews/` emptied.

**Aired content notes for publishing:** the number aired is **40** ("up to 40" outside the locked hook),
the video never references the stream it came from, and the ending is an intentional HARD OUT with no CTA
(memory `hard_out_ending_strategy`).

**QUEUED 2026-07-25** — `longs.json` entry `lf-20260725-kaspa-40bps` (batch `null`, matching the other
standalone longform-edited entries). Files staged to `schedule-tweets/longform/kaspa-40bps/`.
Rumble + BitChute + Facebook all `pending`; **YouTube is Mike's manual upload, never queued**.
Title: "Kaspa Is Going To 40 Blocks Per Second With DAGKnight" (completes the thumbnail's "WITH DAGKNIGHT").
The Soundstripe credits ARE in the base description on purpose: `stripMusicCredits()` removes that
paragraph for Rumble/BitChute/Facebook, so the codes travel with the entry for Mike's YouTube paste
without ever leaking to the other platforms. Verified: allow-list OK, all three uploaders resolve the
entry with video + thumbnail present, codes stripped, CTA link kept, no em dashes.

**YouTube chapters (final-video clock, verified frame by frame; shortened at Mike's request 2026-07-25):**
`0:00` The Target · `0:51` The Upgrade Ladder · `2:15` What Is DAGKnight · `5:28` What 40 Unlocks ·
`6:55` My Number One

**⛔ Before it goes out — still open, none of them blocking playback:**
1. **Music license codes go in the YOUTUBE description ONLY** (`hold-the-line` 2RSEUREJAJSKKSNX ·
   `going-dark` CVTNZ6EL3KWH2UXK · `a-champion-from-the-ashes` PKQHFEVP2E3FN7GW).
   **`accomplishments-subtle` has NO code — paste nothing for Bed B**; if Content-ID ever claims it, flag
   Mike, never clear it with a code.
2. **Beds B and C were never Mike-picked** — they are the strategist's recommendations
   (`accomplishments-subtle`, `going-dark`); runners-up `focuser` / `the-invaders`. A swap is a 1-minute
   re-mix, no re-render.
3. **YouTube title still unpicked.** Longform posts to rumble/bitchute/facebook only; YouTube is Mike's
   manual upload (memory `longform_no_youtube_platform`).
4. **IMG-6 (Lab Token) still ships blank** — identical root cause to the velvet coin, and
   `schedule-tweets/images/reference/LAB.png` exists. ~3s splice whenever wanted.
5. **R5 CMC receipt (7:18)** is a portrait capture showing "$0.02766 down 1.15%" and a red "Why is KAS's
   price down today?" prompt under the most bullish line. Recommend a re-capture cropped to the supply block.
6. No risers/SFX beyond the two chapter-card impacts.


## Concept brief (locked pending Mike's review)

- **Premise:** Influencers on Crypto Archie's 2026-06-25 stream said Kaspa jumps to "25 to 40 blocks per second, call it 30" at the end of the year. That number is real: it is the **DAGKnight consensus hard fork**, the 2nd of Kaspa's two 2026 forks. This video tells the real upgrade story: Crescendo (10 bps, live) → Toccata (programmability, live June 30) → **DAGKnight (~30 bps, targeted end of 2026)** → 100 bps (2027).
- **The cool-advancement angle Mike wanted:** DAGKnight is parameterless consensus. GHOSTDAG runs at the speed of a hardcoded worst-case latency assumption; DAGKnight measures the real network and runs as fast as the actual internet allows, 50%-Byzantine tolerant, sub-second finality potential, on proof of work. That is the marquee diagram beat.
- **Target runtime:** ~5 minutes (Mike: "not too long").
- **Register:** declarative/epic, conviction. No price-prediction thesis. Decentralization framed architecturally.
- **Fact source:** `DATA.md` (this folder) — compiled + source-verified 2026-07-23. Do-not-air guards in DATA.md §5 (biggest one: end-of-year 30 bps is a TARGET, not a locked schedule; DAGKnight prototype was pre-testnet at last public report).

## Decision trail

- 2026-07-23 — Mike asked to research the 53-min claim in https://www.youtube.com/live/7OAoMNNS0p8?t=3186s. Watched 50:00-58:00 via captions: Krux said 10 → 25-40 bps (Mike had misheard as 25 → 40). Researched and confirmed the two-fork 2026 roadmap (Toccata live 2026-06-30; DAGKnight targeted ~Q3/EOY 2026 at 25-40 ms block times). 100 bps confirmed as the SEPARATE 2027 target, unlocked by DAGKnight. All numbers + sources in DATA.md.

- 2026-07-23 — `screenplay-strategist` authored SCREENPLAY.md (5 chapters, ~5:00, 4 music beds, charts C1-C5 placed; marquee beat = C4 GHOSTDAG-vs-DAGKnight diagram in CH3). Saved verbatim; em-dash check clean; all 11 shortlisted music slugs verified present in `assets/music/library.json`.

- 2026-07-24 — **Mike's CH1 gate notes applied: NO reaction framing, and 40 bps instead of 30.** The video never mentions the stream/Krux ("don't want to look like I'm copying another YouTuber"); pure informative standalone. Aired number is 40 (differentiation from Krux's "call it 30"; 40 = TOP of the sourced 25-40 range, so phrasing is "up to 40" outside the locked hook). SCREENPLAY.md revised throughout: CH1 rewritten (hook counter H1 replaces the quote-card receipt), CH4 renamed WHAT 40 UNLOCKS with cadence at 25 ms / 4 blocks per blink, TPS beat now ~20,000 capacity (the sourced 40 bps row, replacing 15k), Solana beat aired unattributed (+ new public-source VERIFY), CH2 "call it 30" removed, open questions 3/4 (quote card, name Krux) dropped as moot. Guards added: SCREENPLAY WARNING box 0 (no stream framing) + DATA.md §5 first bullet. Folder still named `kaspa 30bps` (rename = Mike's call).

- 2026-07-24 — **Mike added a mid-roll community plug: CH3 Beat 2b**, between the sub-second-finality landing and Beat 3. Face direct-address break (~12s, third face moment in CH3, sanctioned) + "Link's in the description" cover line; Bed C stays at its quiet floor. Runtime bumped ~5:00 → ~5:10, word budget ~790-820, CH3 budget ~95s / ~245 words.

- 2026-07-24 — **Spine recorded + spine-prep phases 1-3 run** (Mike pre-authorized running defumble → cover-blackout → desilence without the interactive cut-plan gate; review is after the fact).
  - **Raw:** `raw/2026-07-24 11-35-43.mkv` (23:58, 1.1 GB). Master untouched.
  - **Defumble** (`defumbler` agent): → `spine/ALL.a.defumbled.mp4` (17:34; 29 cut spans, 6:24 removed; clip-check PASS, min 165 ms edge-to-word margin). Chunk maps + spans sidecars alongside.
  - **Cover-blackout** (`cover-blackout` agent): → `spine/ALL.b.blackout.mp4` (+ `.mp4.cover.json`). 8 FACE windows kept, 7 COVER spans blacked (811 s = 77%); frame-QA by pixel PASS both directions; audio byte-identical.
  - **Desilence** (`desilencer` agent): → `spine/ALL.c.desilenced.mp4` (**7:39**, from 17:34; 123 cuts, 595.8 s removed; swallowed-speech QA clean). Cut map: `spine/ALL.c.desilenced.map.json` (source-spine coords; route EVERY downstream timecode through it; joins double as jump-cut anchors → comp-build makes `spine/jumpcuts-final.json` later).
  - **Music picks (Mike, mid-run):** Bed A = `hold-the-line`, Bed D = `a-champion-from-the-ashes` (recorded in SCREENPLAY MUSIC-MOOD-PLAN). Beds B + C still open.
  - **⚠ Flags needing Mike's decisions (from the defumble report):**
    1. **CH5 closing CTA was NEVER recorded** — spine ends at "This is why Kaspa is my number one." Needs a pickup recording of the whole Beat 2 CTA + sign-off.
    2. **CH3 community plug ran ~2 min of ad-lib** (vs ~12 s scripted) incl. unverified multipliers (10X, 550x MYX, 58X Velvr, 350x LAB), a swing-software plug, and membership pricing. Needs a heavy editorial trim (tighten pass) + verified-claims check on whatever survives.
    3. **CH5 ad-lib "deflation comes next and your bags start pumping"** — collides with the no-price-prediction guard; recommend cutting.
    4. **CH1 kept last take adds "...AND I'm going to show you some of the coolest things ever"** (preview clause; screenplay wanted the loop open). Earlier tighter take existed; re-cut if Mike prefers.
    5. **"Toccata" name garbled** in its intro line (clear in the later negation line); verify by ear, may need a one-word pickup. **"in Rust"** lost from CH4 honest-target beat (retake glue). **CH3 marquee finality line** kept take is choppy (3 bursts); confirm delivery by ear.
    6. CH2 ad-lib DAG definition ("directed acyclic graph") replaces "trust me, the name fits" — keep or cut.

- 2026-07-24 — **⛔ Violation caught by Mike + fixed: spine-prep outputs had landed LOOSE in the project root with ad-hoc names** (`kaspa 30bps DEFUMBLED.mp4` etc.) instead of `spine/<segment>.<letter>.<stage>` per comp-build.md §13a. All files moved/renamed to `spine/ALL.a.defumbled.* / ALL.b.blackout.* / ALL.c.desilenced.*` (paths above already corrected). Root cause: §13a lives in the comp-build skill (read at comp time), and neither the spine-prep agent defs nor their track-agnostic skills carried it, so a vague dispatch prompt reproduced the drift. Prevention: an "Output location + naming" section pointing to §13a is now in all three agent defs (`.claude/agents/shared/defumbler.md`, `cover-blackout.md`, `desilencer.md`) so the executors enforce it even when the caller is vague.

## Session notes (2026-07-23, research + screenplay session closed here)

- The stream download (video + captions) lived in the session scratchpad and was DELETED after research. **(OBSOLETE 2026-07-24: the video no longer references the stream at all, so no clip/receipt will ever be needed; re-pull instructions removed.)**
- Nothing else is session-local: DATA.md carries all sources/quotes, SCREENPLAY.md is the gate artifact, and the open decisions are listed at its bottom (title, quote-card vs clip, name Krux aloud, one music track per bed).

## Resume pointer

- 2026-07-24 — **Burst-removal + FINAL desilence (Mike's ear pass on the c spine):**
  - **Burst-removal** (`burst-removal` agent): Mike heard "sounds after 'year' at 1:42" → two bursts (peaks ~-19 dB) in the single gap between "year"→"This" in CH2's "Two hard forks in a single year. This..." Excised in ONE cut, 103.25→104.02 s (c coords, -0.736 s net), both edges in silence troughs; join verified on the rendered output (RMS valley -80/-90 dB, Whisper reads "year. This" clean). → `spine/ALL.d.cleaned.mp4` (+ `.cuts.json`). Join is black→black COVER so no visual jump.
  - **Final desilence** (`desilencer` agent), Mike's per-chapter definition: **CH1 = 250 ms, all other chapters = 600 ms** (`--split 58.4 --sil-pre 0.25 --sil-post 0.6`; CH1/CH2 seam located at 58.40 s via RMS + Whisper). 8 cuts, 3.2 s removed, ALL in CH1; the body had nothing ≥600 ms left (the first pass already tightened it at 500 ms, so the body result still satisfies "<600 ms everywhere"). Swallowed-speech QA clean. → **`spine/ALL.e.desilenced.mp4` (7:35.3)** + `spine/ALL.e.desilenced.map.json`.
  - **Timecode routing now CHAINS three records:** `ALL.c.desilenced.map.json` (raw→c) → `ALL.d.cleaned.cuts.json` (c→d: everything ≥103.25 s shifts -0.77 s) → `ALL.e.desilenced.map.json` (d→e). Comp-build/transcriber cue math must route through all three (or cue directly off the e-spine transcript, which is the plan anyway).

- 2026-07-24 — **Transcription done** (`transcriber` agent, Whisper medium/GPU, word-level) on the FINAL e-spine: `spine/ALL.e.desilenced.medium-words.json` (cue source, true-to-audio; 1357 words) + `spine/ALL.e.desilenced.segments.txt` (breakdown with mishear corrections: Kaspa ×13, DAGKnight ×8, Toccata ×2, GHOSTDAG ×2, Sompolinsky, etc.). **Chapter openers (e-spine coords): CH1 0.00 · CH2 52.84 · CH3 134.52 · CH4 326.32 · CH5 413.46 · end 455.22.** FACE windows (blackdetect): 0.00-4.70 · 32.40-38.53 · 107.93-112.37 · 184.97-191.30 · 227.77-305.07 (community plug, ~77 s) · 321.50-326.27 · 392.30-394.90 · 452.33-455.22. Note: the previously-flagged garbled "Toccata" intro did NOT survive to this spine (both occurrences transcribe clean) — the one-word pickup is likely unnecessary, confirm by ear. Minor verify-by-ear flags in the segments file header notes: "spending rules/vaults" @79.74, "mainnet" @363.44.

- 2026-07-24 — **AS-RECORDED.md authored** (timecoded as-built script off the e-spine transcript; SCREENPLAY.md now carries the RECORDED status banner and is demoted to plan) and **`coverage-strategist` proposal returned + saved as `COVER-PLAN.json`** (PENDING Mike's gate): 41 cover slots partition all 346 s of COVER with zero orphans; 6 receipts (live explorer recording, rusty-kaspa v2.0.0 release, DAGKNIGHT paper, repo-activity recording, CMC supply panel, Alpenglow announcement); committed C1-C5+H1 placed (C1 ×5 slots by design, C4 two-state marquee uninterrupted); Envato 10/10, ChatGPT 4/5; the maybe-cut "bags" beat covered self-contained (E9 drops cleanly if cut). 10 open questions in the JSON tail, incl. two dwell-floor exceptions (stamp-subsecond 2.46s, card-security-50 4.76s) and the C4-badge alternative.

- 2026-07-24 — **PRE-BUILD DOCUMENT SET COMPLETE — `lint-docset.js` PASS.** Mike gated COVER-PLAN.json ("proceed ahead with all the other files"). Authored: **BROLL-PLAN.md** (acquisition worklist + the new CHARTS section) · **EDIT-PLAN-prep.md** (beat-indexed, zero orphans) · **EDIT-PLAN.md** (time-ordered event log, authored PRE-build off the transcript per the §0 ORDER note) · **CUE-SHEET.md** (layer-grouped) · **TRANSITIONS.md** (`transition-strategist`: rmn:cube cards · lib:blocks-max on all 14 face cuts · badsignal on AI stills · 2 MELT `melt-rgb-1` @20.9/@194.8 + 2 SPIN `spin-3d-side-ease` @347.3/@423.9; 6 open questions in its tail) · **MUSIC-PLAN.json** (`music-placement-strategist`: A/D locked; **B rec = `accomplishments-subtle`**, **C rec = `going-dark`** one-pass zero-loop; Bed D end-aligned by FORMULA; gain-automation map; level targets pending first ear-check).
  - **Skill fixes this session (Mike-flagged):** (a) the stale "EDIT-PLAN.md = post-comp generated" wording removed from comp-build.md §13 + edit-plan-and-cue-sheet.md §0/§1/Workflow (it had caused the wrong-order call two videos running); (b) **BROLL-PLAN now always carries a CHARTS build worklist section** split into the two chart types (Type 1 ANIMATED with motion · Type 2 SYSTEM-DESIGN static stills, movement only from comp spotlights/transitions) — recorded in edit-plan-and-cue-sheet.md §0; CUE-SHEET chart rows now tagged CHART(anim)/CHART(sysdesign).
  - Transcript renamed to the lint's convention: `spine/ALL.e.desilenced.medium-words.json` (all doc references updated).
  - **Style study + new cover devices (Mike, 2026-07-24, from the old "Amazon Imploding" video youtu.be/7HbOBpsE4n0):** canonized in `skills/broll-and-containers.md` "Cover STYLE devices": (1) **receipt taxonomy R(article)/R(other)** — article receipts get the mandatory reading/motion treatment; applied to this video's receipts (R3 + R6 = article, rest = other); (2) **single-image MOTION moves** — library camera-move families run A=B on one image (MOTION 3D Pan/Orbit/Offset+Shakes, ZOOM Ease/Simple + punch variants, PERSPECTIVE Ease/Pan 3D, EXPAND Pan, DEVIATION bursts; reveal families excluded), for articles + stills, one move per article, mix-and-match; (3) **LINE-CAPTION overlay** — kinetic uppercase spoken-line caption, VIDEO b-roll ONLY, 10-20% frequency cap, distinct from house word-captions (lint rule unchanged); (4) **literal-noun b-roll** soft rule. Declined: list-still run formalization, corner-keyed talking head, punchline card (covered by title cards).
  - **Container naming formalized (Mike, 2026-07-24):** the three container-reference types now have official names — **TITLE SLIDE** (no box; ex `bittensor-text-dualcitizens-70s.jpg`) · **CARD SLIDE** (rounded box; ex `banks-card-fiat-112s.jpg`) · **SYSTEM-DESIGN CHART** (= CHART(sysdesign)). Canonical: `skills/container-reference/README.md`; pointer added atop `skills/presentation.md`; BROLL-PLAN now ALSO carries a **SLIDES build worklist** section (5 title + 4 card slides classified for this video; rule recorded in edit-plan-and-cue-sheet.md §0); CUE-SHEET rows tagged SLIDE(title)/SLIDE(card).

- 2026-07-24 — **B-roll +2 (Mike approved, Envato cap 10→12):** BR-11 railroad-junction punch-through @97.88-101.5 inside the CH2 C1 hold ("Two hard forks in a single year", carries the first LINE-CAPTION overlay) · BR-12 purple crowd celebration @373.26 replacing IMG-3 (released to ChatGPT reserve, 3/5 used). All docs cascaded (COVER-PLAN, BROLL-PLAN, EDIT-PLAN[-prep], CUE-SHEET, TRANSITIONS).

- 2026-07-24 — **Asset-build phase started; TWO new executor agent defs created** (Mike's tiering: formulaic slides = medium, design-judgment charts = max): `.claude/agents/longform-edited/slide-builder.md` (opus/medium — TITLE + CARD slides off the locked stylesheet) and `chart-builder.md` (opus/max — system-design chart stills + animated-chart design stills/spec notes). Defs register next session; this run dispatched via general-purpose with model overrides. Both builders launched on the kaspa worklists (9 slides · C4+D-DAG sysdesign · H1/C1/C2/C3/FIN design stills); `visual-qa` gates all PNGs after, then Mike.
  - **⛔ LAYOUT DECISION (Mike, 2026-07-24): `render-assets/` RETIRED — everything merges into `media/<project>/assets/`** ("they all get rendered; separating them doesn't make much sense"). Canon updated: comp-build.md §10 (merged layout + renderables-only orphan scope + --public-dir assets/) + §13a + §11/§12, longform-edited/CLAUDE.md, all three builder agent defs, the asset-location memory. Pre-2026-07-24 projects keep the old layout; kaspa 30bps is the first merged project (folders physically moved after the in-flight chart QA finished).
  - **THIRD executor def: `receipt-capturer.md` (sonnet/xhigh — Mike's tiering: mechanical capture, high diligence).** Captures the receipts worklist via Playwright Python, mandatory open-and-verify on every file (the Grayscale bot-block lesson baked in), answers every 🔍 flag, outputs render-assets/receipts/. Launched on the 6 kaspa receipts (R6 Alpenglow capture doubles as the open public-source verify).

- 2026-07-24 — **ASSET BUILD + QA COMPLETE (all three lanes).** Slides: 19 PNGs, visual-qa 19/19 PASS (colon nit fixed + re-shot). Charts: 18 PNGs across 7 charts, visual-qa 18/18 PASS (2 minor observations logged: h1-slam sub-label baseline drift, C1 serif "2027" figures — Mike's call, no rebuild). Receipts: 6/6 verified, both recordings trimmed after QA caught dead loading heads (raws kept as -raw); R6 Alpenglow = the sub-second public-source verify PASSES (~150 ms median, Anza primary); R5 live = 96.16% mined; R4 soft flag: no DAGKnight-named public repo work findable, keep framing generic "engineering you can watch." **Folders physically merged into `assets/`** (render-assets/ leftover deleted once unlocked). **Chart types split by folder (Mike):** `assets/charts/` = Type 1 ANIMATED (h1/c1/c2/c3/fin) · `assets/diagrams/` = Type 2 SYSTEM-DESIGN (c4, d-dag) — recorded in comp-build.md §10 + chart-builder def + BROLL-PLAN. Final assets layout (after Mike's two structure notes): **`slide-sources/`** (containers.html + driver) · **`title-slides/`** (5 PNGs) · **`card-slides/`** (14 PNGs) · **`charts/`** (Type 1 animated) · **`diagrams/`** (Type 2 system-design) · **`receipts/`** — every folder name matches its taxonomy name; deck/ and containers/ retired.
  - **"No cards" bug fixed (Mike, 2026-07-24):** card-slide resting rows were dimmed to near-invisibility (spotlight-off state), making cards read as empty title slides. containers.html resting styles raised to muted-but-readable (titles text-secondary, dsc full-opacity, icons 75%); all 19 slides re-shot into the new type folders; rule recorded in slide-builder def ("spotlight adds emphasis, does not toggle visibility").

- 2026-07-24 — **Acquisition agents created (factory complete, 5 executors):** `.claude/agents/longform-edited/envato-sourcer.md` (opus/medium — clip PICKING is a taste call; wraps the canonical envato-broll tooling, ≤4s/LEAD/no-reuse/HOLD rules + one-attempt browser discipline baked in) and `image-gen.md` (sonnet/xhigh — drives the pooled-chat ChatGPT BROWSER pipeline only, persona image rules + shared-Chrome/sequential/one-attempt discipline + unique-image rule baked in). NOT yet dispatched: Envato gated on the bags-cut ruling (BR-9 HOLD), images gated on the IMG-2 knight-allusion confirmation.

- 2026-07-24 — **Mike decorated the F5 plug (implies the plug is largely KEPT; trim ruling still open, overlays keyed to beats):** IMG-5 velvet coin @268.8 ("58X Velvet Token") · IMG-6 lab coin @271.6 ("350X Lab Token") · IMG-7 wins cascade @275.8 ("keeps coming") — themed coins, NO invented logos — all overlays ON the F5 face; **R7 = cryptorich.vip/products full-page screenshot @291.4→305.07** (membership pricing beat to end of plug) kept alive with the new single-image MOTION moves (slow zoom + 3D pan mix). ChatGPT cap 5→7. All docs cascaded (BROLL-PLAN, EDIT-PLAN, CUE-SHEET, TRANSITIONS). Dispatched: `image-gen` (IMG-1/4/5/6/7; IMG-2 still gated) + `receipt-capturer` (R7).

- 2026-07-24 — **F1 opener background swap (Mike; plan CORRECTED same day).** First proposal (key/RVM-matte all 8 face windows) was WRONG: Mike has tried matting before and rejected it ("messes up my eyes"); keying also re-proven broken here (uneven screen + spill eats face patches). Corrected plan per Mike + new memory `no-matting-mikes-face`: **F2-F8 air as recorded; F1 ONLY goes through Higgsfield VIDEO-TO-VIDEO** background replacement. F1 extracted from the RAW master at full quality (raw 10.11-16.11 via the e→d→c→b/a→raw map chain) → `assets/vid/F1-raw-for-higgsfield.mp4`; Higgsfield agent (login approved by Mike) generating BG-1 backdrop candidates + running the v2v swap at **480p** → `assets/vid/F1-higgsfield-bg-swap.mp4`. Fallback if the face distorts: air F1 as recorded. Mike gates.

- 2026-07-24 — **TWO RULINGS LANDED (Mike):** ① **Plug KEPT in full** — no trim, timeline stable, tighten pass cancelled. ② **The hard out IS the ending** — no CTA pickup, ever, on this video: deliberate watch-time strategy (cut before viewers can click away; new memory `hard-out-ending-strategy` — a missing closing CTA is a question, never an auto-flag). Bed D end-align final at T_end=455.22 (source_in 106.24 per MUSIC-PLAN formula) unless the bags cut (-4.16s) lands. AS-RECORDED divergences 1+2 marked resolved; EDIT-PLAN [END] event replaces the CTA placeholder. **Still open: the bags-line cut** (7:22.9 "deflation comes next and your bags start pumping" vs the no-price-prediction guard; gates BR-9) — re-asked plainly. Higgsfield F1 swap delivered + spot-checked strong; **Mike APPROVED it same day — F1 airs as the bg-swap clip** (spine audio kept, swap aligned via its 0.4s head handle, comp punch kept subtle since the model baked ~5%).

- 2026-07-24 (SESSION CLOSE, Mike calling it a night) — **WHERE THIS PROJECT STANDS:**
  - **DONE this session (production day one, screenplay → nearly render-ready):** spine recorded + full 5-stage spine-prep (final: `spine/ALL.e.desilenced.mp4`, 7:35.2) · transcription + AS-RECORDED · complete pre-build doc set, lint-docset PASS · **5-agent asset factory created** (slide-builder, chart-builder, receipt-capturer, envato-sourcer, image-gen; registered in CLAUDE.md routing) · **assets built + visual-qa'd:** 19 slides (5 title + 14 card, resting-row legibility fixed) · 18 chart stills + 6 diagram stills (7 charts) · 7 receipts (R1-R7, both recordings head-trimmed, Alpenglow verify PASSED at ~150 ms) · 5 ChatGPT images all-PASS + BG-1 backdrop plates · **F1 opener = Higgsfield bg-swap, APPROVED** (`assets/vid/F1-higgsfield-bg-swap.mp4`) · merged `assets/` layout + type-named subfolders (canon updated) · style devices canonized (line-captions 10-20%, single-image motion moves, receipt taxonomy R(article)/R(other), literal-noun) · music beds A/D locked; MUSIC-PLAN + TRANSITIONS.md authored.
  - **Rulings RESOLVED today:** plug KEPT in full · ending = intentional HARD OUT, no CTA (memory saved) · F1 swap approved · Envato cap 10→12 · ChatGPT cap →7 · no-matting-Mike's-face memory saved.
  - **✅ ENVATO COMPLETE before shutdown (2026-07-24 night): 12/12 clips in `assets/vid/`** (BR-1..BR-12 incl. the BR-9 addendum), all 1080p H.264, audio stripped, builder-QA'd (no black leads, motion confirmed, no watermarks; BR-4/BR-5 storm/sunny POV contrast matched; BR-11 has the clean lower-left field for its line-caption; BR-12 = purple stage lights, chosen over watermarked crowd clips — energy over literal). NOT yet visual-qa'd — run `visual-qa` over the 12 clips FIRST THING next session.
  - **🛑 STOPPED at Mike's request (2026-07-24 night, "continue tomorrow"): the IMG-2 knight generation** (image-gen agent killed mid-run). Next session: check whether `assets/img/IMG-2-dark-armored-knight.png` partially landed and whether the pooled ChatGPT chat has an orphaned in-flight request (read the gen script's registry/log BEFORE re-dispatching — never blind-relaunch on the shared profile); then re-dispatch image-gen for IMG-2 per its BROLL-PLAN row ("a really cool knight, not a chess knight", epic armored, NO bat iconography).
  - **⏭ CONTINUING TOMORROW.** Resume order: ① visual-qa the 12 Envato clips · ② regenerate + QA IMG-2 · ③ collect Mike's remaining confirmations batch (Beds B/C, title, security-card vs C4-badge, stamp, F7 punch, hook phrasing, icons — none block the build; several can ride to draft review) · ④ then the mechanical run to draft (card pauses → captions → jumpcuts → reconcile → comp → gates → 200k draft), per the chain below.
  - **⛔ WAITING ON MIKE:** ~~the bags line~~ **RULED KEEP (2026-07-24, late): line stays, timeline FINAL at 455.22, Bed D source_in 106.24 final, BR-9 hold lifted (envato-sourcer messaged to license it), persona guard overridden by Mike for this line.** ~~IMG-2~~ **RULED: "a really cool knight, not a chess knight" — image-gen dispatched for an epic armored knight (no bat iconography).** Remaining confirmations batch: Bed B (`accomplishments-subtle` rec) · Bed C (`going-dark` rec) · YouTube title pick · card-security-50 vs C4-badge · stamp-subsecond keep/fold · F7 punch drop OK · hook-card "PER SECOND" stacked phrasing OK · emoji vs monochrome line icons on card rows.
- 2026-07-25 — **THE MECHANICAL RUN TO DRAFT EXECUTED. Comp built, all 5 gates pass, draft rendering.**
  - **Envato visual-qa: 11/13 PASS, 2 FAIL → both re-sourced.** BR-11 was a level CROSSING (an X), not a
    diverging switch, so "TWO HARD FORKS" would have captioned a shot with no fork in it; BR-12 had no
    crowd at all (an empty CGI arena), so "the whole industry is hyping" had nothing hyping. `envato-sourcer`
    replaced both in place (a real Y-splitting switch point; real crowd footage with teal LEDs). Originals
    kept at `_rejected-broll/`. IMG-2 PASSED: no bat iconography, the allusion is the intended pun.
    Also comp-fixed from that pass: BR-4/BR-5's horizons were 84% vs 48% of frame height, so the smash cut
    jumped the camera height — BR-5 is now scaled 1.16 / shifted up 7% to match.
  - **Card pauses baked → `spine/ALL.f.paused.mp4` (457.33s) → `assets/spine.mp4`.** ⛔ The CH3 card MOVED
    134.52 → **137.0667**: the planned chapter seam has NO silence (the desilencer had already closed that
    breath; deepest dip −39.8 dB fails `lint-pause-silence`), and the next clean trough splits "So what |
    actually is DAGKnight". The card now lands in a real −89 dB hole after the question and ANSWERS it.
    Both joins verified by RMS + Whisper: 1s of true silence, no clipped words. Sidecar `ALL.f.paused.json`.
  - **`spine/jumpcuts-final.json` RE-DERIVED from the finished audio.** The first version chained the three
    cut maps and drifted ~0.15s, putting "anchors" inside speech; it now ground-truth-scans the e-spine for
    sub-−45 dB troughs (230 anchors). Every punch-in is snapped to one. F3 and F7 correctly get NO punch
    (no internal anchor / no room), leaving 12.
  - **`captions-builder`: 143 groups over the 8 FACE windows** (`src/Kaspa40Captions.ts`). It also fixed a
    real bug in the shared `build_captions.py`: a 1-word phrase correction dropped the trailing punctuation,
    welding two sentences into one caption.
  - **Charts built as REAL code animations** (comp-build §7 forbids holding a chart PNG): `Kaspa40ChartC1.tsx`
    (C1 across all 5 placements) + `Kaspa40Charts.tsx` (H1 · C2 · C3 · FIN), ported 1:1 from the locked
    `assets/charts/*.html` and verified frame-by-frame against the design stills.
  - **Comp: `remotion/src/Kaspa40Bps.tsx`** (61 cover rows, 13720 frames). Spine + F1 Higgsfield swap +
    3 light leaks + 12 punch-ins + the full cover track + 23 library transitions (14 blocks-max face cuts,
    5 badsignal AI-still hits, the 2 reserved MELTs and 2 SPINs) + 2 cube chapter cards + captions.
  - **Two shared-infra fixes this run** (both were silent failures, not style choices): (a) the `blocks-max`
    glitch engine had never been wired to displace LIVE video — only static bitmaps — so all 14 face cuts
    would have rendered an invisible transition; patched to match its sibling engines. (b) The library
    transition wrapper left a stale frozen copy of the incoming shot painted over the live layer for 12
    frames after each window (a black frame at 347.7s); the comp now drives every transition node off one
    absolute clock instead of a Sequence-relative one.
  - **Gate fixes:** `lint-slide-balance.js` parsed 0 covers because its regex demanded `ref` be the LAST
    field, while comp-build §5 REQUIRES a `state` on every deck row; `lint-deck-containers.py` assumed the
    retired single `deck/` folder. Both generalized. All five gates now exit 0.
  - **Disk was the real blocker:** C: ran to 0 bytes mid-render (Remotion's offthread video cache grew to
    3.2 GB and each attempt copies a ~370 MB public dir). Cleared 2.8 GB of stale Remotion temp bundles and
    ~5 GB of finished-session scratch, and the render now runs with `--concurrency=4
    --offthreadvideo-cache-size-in-bytes=400MB` in two frame-range halves.
  - **✅ DRAFT v1 DELIVERED: `_previews/kaspa-40bps-draft-v1.mp4`** (7:37.3, 13720 frames, 23 MB, 200k).
    Rendered in three frame-range chunks; disk exhaustion and a proxy-timeout killed two earlier attempts.
  - **Post-render fixes applied after QA-ing the first half (all verified on re-render):**
    ① **The raw master is PILLARBOXED** (camera content at x 82..1837), so every FACE beat had an 82px
    black bar down each side. It is in the RAW, not a spine-prep bug — the comp now scales the spine
    (only the spine, not the F1 swap) by 1.0934. ② **C4 sub-spotlights clipped "GHOSTDAG" and the red
    assumption box** — every spotlight region on that diagram hugs the left edge, so scaling about the
    region centre pushed text off frame; origins are now pinned to x=0 with gentler zooms. ③ **C1's
    un-landed ghost rungs were invisible** (#1e2330 on #0a0c10), leaving the ladder an empty frame for
    ~40s; brightened. ④ **Every library cut landed ~0.15s EARLY** — the engines bury their A→B swap at
    their own peak (~0.32), not the window midpoint, which also dragged a caption onto the incoming
    cover; the placement now offsets by each row's real swap fraction.
  - **⛔ TWO QA REPORTS WERE WRONG, both from reading 200k compression as a comp bug** — worth knowing
    before acting on any future draft QA: a receipt appearing to "ghost under" containers for 14s, and
    C1 reading as an empty frame. Lossless stills of the same frames proved both are encoder smear (the
    slides are opaque RGB and the receipt unmounts 10s earlier). **At 0.2 Mbps this video smears bright
    full-page receipts into the following dark shots and eats low-contrast detail; judge fine detail on
    a still, not the proxy.**
  - **Shared-infra fix #3: `WrapLayer` rendered 9 wrap tiles when at most 4 can intersect the frame.**
    With a LIVE video clip on one side of a transition that meant ~50 simultaneous frame fetches for the
    same mp4; Remotion's proxy saturated and the render died with a `delayRender` timeout — twice, both
    at the SPIN out of BR-8. Now renders only the visible tiles (pixel-identical) + `--timeout=120000`.
  - **⛔ CONCAT DRIFT CAUGHT AND FIXED (do not use the concat demuxer for this):** joining the chunks with
    `-f concat -c copy` added ~57 ms of audio delay PER SEAM (AAC frame padding), cumulative — audio
    lagged video by ~157 ms by the close, past the perceptibility threshold, exactly the failure the
    repo's sync-safe-concat rule warns about. Fixed by decoding each chunk's audio, trimming it to its
    exact frame-count duration, concatenating raw samples and muxing onto a `-c copy` video concat.
    Verified flat: constant ~40 ms across the whole timeline (that residual is Remotion's own render
    baseline — present in `chunk-c1.mp4` before any re-mux — and is within tolerance).
- 2026-07-25 — **✅ FINAL v3 DELIVERED: `_previews/kaspa-40bps-FINAL-v3.mp4`** (supersedes v2, which is
  deleted). Two edits, spliced — only **147 frames (4.9s) of video re-rendered**:
  - **Impact SOUND swapped on Mike's pick.** He heard v2's layered hit as "a punch sfx… seems out of
    place" — correct, the mid-layer I added was literally `Punch 1`. He named `Impact_Hit_01-3.wav`.
    ⚠ That file has a **5.39s audible tail**, which collides with his own earlier "don't choose an impact
    with a long waveform" rule: untrimmed it would ring over the C1 ladder build and over CH3's opening
    line. Used HIS sound, trimmed to a 2.18s decay →
    `assets/sfx/Impacts/card-impact-hit01-3-short.wav`, mixed at -7 dB (isolates at -7.7 dBFS, 2.5-4.6 dB
    under the surrounding speech). The untrimmed file is one flag away if he wants the full ring.
  - **BR-5 sunny highway slowed to 0.40x** (Mike: "we should see the driving happening much slower",
    2:58-3:03). Verified by measurement, not by eye: mean inter-frame motion over the window fell 5.08 -> 1.25.
    It also strengthens the beat — the line is "sunny day, empty road, doesn't matter", so crawling on a
    clear road IS the argument. `playbackRate` added to the BROLL table; 6.8s of source covers the 4.76s slot.
  - Audio was rebuilt from **v1's** track (whose original impacts are the quiet sub-only ones, fully masked
    at 6+ dB down) rather than from v2, so none of the rejected punch character survives.
- 2026-07-25 — **FINAL v2 (superseded by v3, file deleted)** (7:37.4, 13720 frames,
  2.0 Mbps, 137 MB). Mike's second review round, **built by SPLICING — only ~74s of video was re-rendered
  instead of 457s** (his suggestion; ~6x saving, ~12 min instead of ~50):
  - **Impacts were inaudible for TWO reasons, not one.** (1) Level: mixed at -15 dB they sat ~3 dB BELOW
    the speech around them. (2) Character: the chosen file measured 99.5% of its energy below 200 Hz — a
    pure sub-bass boom that barely reproduces on laptop/phone speakers. Fixed by building
    **`assets/sfx/Impacts/card-impact-layered.wav`** (the sub + `Punch 1`'s mid crack, peaks aligned,
    faded to a 1.16s tail per Mike's "no long waveform") and mixing at -8 dB. Now isolates at -9.0 dBFS,
    3-6 dB under the surrounding speech. Method recorded in comp-build.md §9: pick impacts by MEASURED
    tail AND spectral balance; a sub-only hit is inaudible on small speakers.
  - **IMG-5 velvet: ROOT-CAUSED, not just retried.** The row said "themed coin, NO invented logo/text",
    so two runs produced a blank coin while `schedule-tweets/images/reference/velvet.png` sat unused. The
    guard was meant to stop us FABRICATING branding, not to stop us using the real mark. v3 regenerated
    WITH the reference; the real Velvet "V" is now struck into the coin face. **Systemic fix: BROLL-PLAN's
    images worklist now carries a mandatory `Reference` column** (path or explicit `none exists (generic
    approved)`) for any beat naming a real entity, documented in `edit-plan-and-cue-sheet.md` §0 and in the
    `image-gen` agent def, with the wording changed to "use the REAL mark from the reference image; never
    invent one". ⚠ **IMG-6 (Lab Token) has the identical defect and was NOT regenerated** (Mike raised only
    velvet) — `reference/LAB.png` exists; standing offer.
  - **C4 diagram animated** (see the BROLL-PLAN row): promoted Type 2 -> Type 1, packets on the real link
    coordinates, speed tied to the VO. Also let the readout push be eased back to ~1.06, which fixed the
    "MEASURED NETWORK LATENCY" clipping flagged in v1.
  - **R3 (DAGKNIGHT paper) now carries the video's ONE library camera-move**, `motion-3d-pan-1-down`
    (Mike's pick), run as a single-image A=B move. Chosen over R6, which already had a working reading pan.
  - **Captions: NO CHANGE** — Mike confirmed the 2-words / up-to-4-if-all-short rule stays as specified.
  - **Splice discipline that made it safe:** every replacement is the SAME duration; only a piece's START
    must be a keyframe (a tail can be trimmed freely with `-c copy`); and the audio is NOT spliced — the
    v1 track carries over with the impacts layered on, because none of these edits change audio (the
    library camera-move has `sfx: None`). That sidesteps the ~57ms-per-seam AAC padding drift entirely.
    Verified: 13720 frames, every keep-piece boundary pixel-identical to v1, drift flat at -43ms.
    **Gotcha worth keeping:** `-to` with `-ss` measures from the SEEK POINT, not the original timeline
    (first attempt produced 24554 frames), and keyframe frame-indices computed as `pts*30` were 2 frames
    out — use `-frames:v` and discover keyframe indices empirically. One frame (5600, a mid-shot traffic
    aerial) decodes slightly soft at a cut boundary; imperceptible, noted rather than hidden.
- 2026-07-25 — **✅ FINAL v1: `_previews/kaspa-40bps-FINAL-v1.mp4`** (7:37.4, 13720 frames,
  1920x1080/30, 2.0 Mbps, 138 MB, music mixed). Mike's draft-review edits, all applied and verified:
  - **Chapter cards were unreadably fast** ("shown so fast, in under a second, that some people will
    hardly notice it"). Cause: the baked pause is 1s and the cube turn eats ~0.4s of it. The card scene
    now starts BEFORE the pause and holds through it — CH3 leads by 2.55s so it comes up as he asks "so
    what actually is DAGKnight" and the title ANSWERS the question (~3.2s readable); CH2 ~1.6s.
    **NEW RULE, asserted in the comp + written into comp-build.md §6: a chapter title must be fully
    readable for >=1s.** Memory: `feedback_chapter_card_min_1s`.
  - **Short impact on both cards.** Picked by MEASURED audible tail, not filename:
    `DSGNImpt-single_impact` = 1.15s vs 2.3-3.8s for the rest of the kit. Mixed 4.5-9.1 dB under the VO peak.
  - **The C4 DAGKnight diagram was frozen for 17.8s** ("was there meant to be any motion in that?").
    Type 2 stills bake no animation and it had a neutral spotlight. Now: full view with a gentle push,
    then at the 200.9 "readout CLIMBS" beat a spotlight travels down into the NETWORK SPEED bar.
    Recorded as §7a: a system-design still must never sit dead still, and a FULL view can only push ~4%
    before edge titles clip.
  - **Caption fix:** the misspoken "10," dropped at 245.32 (a rebuild will restore it — see the comment).
    The 4-word groups are CORRECT per spec: 2 words, extending to 4 only when every word is <=4 chars.
  - **IMG-5 regenerated** — v1 had the coin fully covered by velvet; the coin is now the hero.
  - **LT-LINK lower-third built** (was missing from the build entirely) at 286.6-294.4, on the spoken line.
  - **Receipts use hand-rolled Ken-Burns, NOT the library camera-move families** — canon sanctions either;
    flagged to Mike as a swap-on-request.
  - **⛔ THE RENDER FAILED THREE TIMES AT THE SAME BEAT** (the SPIN at 423.94 out of BR-8): a library
    transition over a VIDEO makes the engine fetch that clip from dozens of displaced copies at once and
    saturates Remotion's frame proxy. Tile reduction + `--timeout` only mitigated it. **Fix that actually
    worked: pre-extract the cut frame (`vid/BR-8-cutframe.jpg`) and hand the ENGINE the still** — invisible
    over a 0.88s turn, one request instead of dozens. Now in comp-build.md §6a.
  - **A one-line omission cost a 25-minute render:** the new C4 readout row had SPOT/MOTION entries but no
    STATEFILE mapping, so `staticFile(undefined)` threw mid-render. Every linter passed. A module-load
    assertion now fails any cover state that resolves to no file.
  - **STILL OPEN for Mike at final review:** the C4 readout spotlight crops the "MEASURED NETWORK LATENCY"
    label mid-word (deliberate spotlight, 11s, splice if disliked) · the R5 CMC receipt is a portrait
    capture showing a red "price down today" prompt under the most bullish line (recommend re-capture) ·
    Beds B/C are still the strategist's recommendations, not Mike's picks · no risers/impacts beyond the
    two card hits · IMG-2 Batman-vs-knight read.
  - **STILL OPEN for Mike at draft review:** Bed B (`accomplishments-subtle`) · Bed C (`going-dark`) ·
    YouTube title · card-security-50 vs C4-badge · stamp-subsecond keep/fold · the spin marquees' 1-2 frame
    mirrored wrap-copy (keep or swap that beat to a melt) · Bed C's start now moves with the CH3 card to 2:17.07.

  - **THEN THE MECHANICAL RUN TO DRAFT (no further input needed):** visual-qa Envato → apply the bags ruling (if cut: re-cut spine to the next §13a letter + shift docs via the map) → bake the CH2/CH3 card pauses (paused spine, next letter → copy to `assets/spine.mp4`) → `captions-builder` (8 FACE windows, FACE-only) → derive `spine/jumpcuts-final.json` from the desilence joins → zero-orphans reconcile + lint-docset re-run → **comp build to EDIT-PLAN/CUE-SHEET** (F1 swap layer via its 0.4s head handle · transitions per TRANSITIONS.md incl. 2 MELT + 2 SPIN marquees · charts animated exactly to chart-builder's animation specs · line-caption on BR-11 · R7 zoom+pan motion moves · plug overlays IMG-5/6/7) → the 5 mechanical pre-render gates (lint-covers · lint-deck-containers · lint-pause-silence · bed-duck-expr · lint-slide-balance) → **200k draft render** → video-qa on 10s chunks → Mike's draft review → final render (crf 18; frame-range halves + ffmpeg concat if the ~frame-14436 stitch ceiling bites) → ffmpeg music+SFX mix per MUSIC-PLAN.json (measure LUFS first; ~16-18 dB under VO, ear-check for Mike's deeper ~22 preference; Soundstripe codes → YT description ONLY; `accomplishments-subtle` has NO code — paste nothing).

## 2026-07-25 — vertical review: face framing (accepted as-shipped, rule captured)

Mike reviewed `kaspa-40bps-VERTICAL.mp4`: **"almost excellent, I don't want any changes"** — but flagged
that his face reads right-aligned in the face scenes, with half of it cut off at the right edge.

**He is right, and the cause was a bad measurement.** The vertical spine used a plain centre crop
(`objectFit: cover`), justified by a brightness-weighted centroid over the whole 16:9 frame that read
~46-50%. That number was meaningless: the lit green screen fills the left of frame and dragged the
average to the middle. Re-measured with the background masked out (strongly-green pixels = background,
pillarbox columns dropped), the SUBJECT sits at:

| window | subject centre | offset from centre |
|---|---|---|
| F1 (2s) | 1195 px / 62.2% | +235 px |
| F2 (35s) | 1358 px / 70.7% | +398 px |
| F3 (110s) | 1256 px / 65.4% | +296 px |
| F4 (188s) | 1261 px / 65.7% | +301 px |
| F5 plug (260s) | 1208 px / 62.9% | +248 px |
| F6 (324s) | 1239 px / 64.5% | +279 px |
| F8 (455s) | 1278 px / 66.5% | +318 px |

A 9:16 centre crop takes x 656-1264, so he sits at or past its right edge in every window. The fix for a
future cut is `objectPosition: '~65% center'` on the spine (mean 65.4%, spread 62-71%), or a per-window
offset.

**Shipped as-is per Mike.** The rule + the measurement method + a mandatory per-face-window QA check are
now canon in `skills/vertical-repurpose.md` §1b and §5, mirrored into `/vertical-repurpose` Phase 1 + 5,
and in memory as `feedback_vertical_face_crop_measured`.

## 2026-07-25 — 40-second vertical SHORT (new lane: longform-to-short)

Mike asked for a 40s short condensed out of the vertical cut, with a spoken "click below to watch the
full video" outro. Built the reusable lane first, then ran it on this project.

**The lane (new, reusable):**
- `skills/longform-to-short.md` — canonical. Two sources on ONE clock (vertical master for PICTURE,
  paused spine for VO), the hook/body/kicker/CTA shape, span rules, the 3-stage build, the mix.
- `.claude/agents/longform-edited/short-cut-strategist.md` (fable/max) — authors the cut plan.
- `.claude/commands/longform-short.md` — `/longform-short <project> [seconds]`.
- `skills/lint-short-spans.py` — boundary gate + snapper. `skills/short_extract_spans.py` — Stage A.

**The cut** (`SHORT-CUT-PLAN.json`, snapped to `SHORT-CUT-PLAN.snapped.json`): one claim, three spans.
| role | span (final-video s) | frames | on screen |
|---|---|---|---|
| hook | 0.000 - 11.480 | 344 | F1 face + the 40 BLOCKS / SECOND title slide |
| body | 330.410 - 344.790 | 431 | C2 cadence race, BTC / ETH / Kaspa / DAGKnight bars |
| kicker | 427.300 - 438.110 | 324 | C1 ladder grand assembly, DONE stamps landing |
Spans 1099 frames (36.633s) + outro 101 (3.367s) = **1200 frames = 40.000s flat.**

**Three findings worth keeping:**
1. **The delivered masters carry ~42.7 ms of AAC priming lag** (2048 samples) between their own audio
   and picture, constant across the file, normalized correlation 0.974. It comes from the ffmpeg mix
   step not writing an edit list. Inside perceptual tolerance so it is not worth re-cutting a published
   file, but taking VO from the SPINE instead of the master sheds it for free. The short measures
   +0.00 ms.
2. **You cannot cut a desilenced spine "in silence"** — the silence was removed on purpose. What is
   left between words is 100-180 ms of breath with a 5-15 ms trough at -61 to -95 dBFS, and Whisper's
   word boundary is not that trough (a 180 ms "gap" still held 5 ms windows at -18 dBFS). The gate
   snaps to the measured trough; all three spans moved <= 80 ms. Splices get a 12 ms fade, and FADES,
   not crossfades: acrossfade would shorten the track at every join and drift the VO off the
   butt-joined picture.
3. **The burned-caption trap.** The longform captions FACE beats only, so 2 of the 3 spans arrived
   bare. `captions-builder` produced the added track and found a real bug in the canonical builder on
   the way: `apply_phrases` was single-pass, so `dag night` -> `dagknight` consumed the words before
   `area` -> `era` could fire, and "in the dagknight AREA" would have shipped. Fixed to a bounded
   fixpoint in `skills/captions/build_captions.py`; no other project's output changes.

Caption style follows the SKILL (72px / 13px stroke / 0.01em), not the vertical longform comp, which had
drifted to 84px. Placed at bottom 300 rather than the longform's 560 because the longform never had to
clear a chart and two of three spans here are full-frame charts; a feathered scrim carries it where the
C1 ladder fills the frame.

**Mix:** VO -17.3 LUFS, Bed A "Hold The Line" (Mike-locked, code 2RSEUREJAJSKKSNX) at -20.9 dB = 0.0902
linear, one continuous bed across all seams, lifting +4 dB under the outro. Final -17.2 LUFS, peak
-7.3 dBFS, no clipping, no black frames.

**DELIVERED:** `kaspa-40bps-SHORT-40s.mp4` (1080x1920, 1200 frames, 40.000s, 14.6 MB). Not queued.

**✅ CTA VOICE IN (same day, second pass).** The earlier "logged out" reading was transient: on relaunch
the `hfbot-profile` Chrome was signed in (fluidlamp1361, Ultra, 2,559 credits). The Audio tab already had
**MIKE-CLONE** selected but the model was **Eleven v3**, so it was switched to **Seed Speech** per the
skill's proven flow. `_batch-generate.js` passed both pre-credit gates (SCRIPT match + VOICE == MIKE-CLONE)
and produced the take in one roll.

- Whisper QA of the raw take: "Click below to watch the full video." — exact match to `CTA-SCRIPT.md`.
- Take is 2.424s at -15.2 LUFS / -1.7 dBFS peak (hot), so it was pulled **-2.1 dB (linear 0.7852)** to sit
  at the spine VO's -17.3 LUFS rather than jumping out of the mix.
- Placed at **36.85s**, a beat after the kicker's last word and landing as the CTA card finishes fading in
  (card ramps 36.83 -> 37.17s). Ends 39.27s, leaving a 0.73s bed tail.
- Verified IN THE FINAL MIX, not just on the stem: whisper read the last 4s of the muxed file, through the
  music bed, as "next year. / Click below to watch the full video."

**CTA v2 — the `!` was wrong.** Mike on first listen: "it doesn't sound right, it seems like video is
emphasized." He was right, and the cause was the trailing `!` in `Click below to WATCH the full video!`.
Per higgsfield-voice's markup rules `!` means "lift the line", and a lift at the end of a sentence lands
on the FINAL word. Measured on the two takes:

| take | last word held | last-word peak vs line peak |
|---|---|---|
| v1 `...video!` | 0.62s | -0.6 dB (still AT peak = stressed) |
| v2 `...video.` | 0.50s | -3.9 dB (falls away) |

Re-rolled with a period, one credit, whisper-QA exact. Rule now in `higgsfield-voice/SKILL.md`: a
trailing `!` is only for lines whose LAST word should punch; when the payload word is mid-sentence, end
with a period and let the CAPS carry the stress.

Audio-only re-mux, no re-render. Final: 1200 frames, 40.000s, **-17.3 LUFS, peak -6.0 dBFS**, no clipping,
no black frames, A/V lag +0.00 ms. CTA at 36.85s, -0.3 dB to sit at spine VO level, verified through the
bed in the muxed file ("next year. Click below to watch the full video.").
`_short/finish-cta.sh` is kept as the one-command path for next time.
