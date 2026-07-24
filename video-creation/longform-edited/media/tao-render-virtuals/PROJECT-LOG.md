# tao-render-virtuals — PROJECT-LOG

_Decision trail + resume pointer. Canonical rules live in `screenplay.md` / `longform-edited.md`;
this file records THIS video's locked choices. Companion: `DOSSIER.md` (the verified fact source)._

## AUDIT REBUILD COMPLETE (2026-07-19) — PASS 4 · ALL GATES GREEN · READY FOR THE 0.2 Mbps DRAFT
Everything from the audit below is FIXED and verified by still renders + the full gate suite:
- ✅ **Canonical COVERS inline in the comp** (`gen-covers2.js` emits between markers) → `lint-covers` parses +
  passes (87 covers; BR-8→4.00s, BR-13/14 boundary 828.80, IMG-8 4.0s). Assets restaged to the canonical
  `render-assets/` layout (884 MB, hardlinked; the lean-pubdir fix is now structural).
- ✅ **6 melt/spin marquees LIVE** via the engine registry (`Fx` windows over the cover layer): hero melt
  D6-A→D6-B verified mid-melt (RGB reform), D3-D before→after melt (new `-before` state variant), 3 spins
  (D4-A right / D5-A left / CH6 card-exit up). Engine windows align to each engine's INTERNAL swap point.
- ✅ **12 blocks-max face cut-ins + 7 badsignal still-glitches** — footage plates/masks staged
  (`render-assets/transitions/lib/`), bitmap srcs wired (cover PNGs + extracted `_poster-BR-*.png` tails +
  `_face-<t>.png` spine posters). Verified: badsignal burst on IMG-1, clean swap boundaries on the 48.7 cut-in.
- ✅ **Charts C1/C2 are LIVE components** (`taoRenderVirtualsCharts.tsx`, Playfair/DM Sans/JetBrains Mono via
  @remotion/google-fonts) — C1 step-draw + halving pop, C2 staged reality→Metcalfe→Reed build, permanent
  HEURISTIC tag. `lint-animated-charts` green.
- ✅ **Card pauses BAKED** → `spine/ALL.e.paused.mp4` (914.47s) + sidecar; `PAUSE_ACTIVE=true` (DUR 27433).
  CH6 point = **592.24** (lint-pause-silence caught 592.42 landing on "All"; D6-A boundary moved with it).
  All 3 pause midpoints = digital silence, speech resumes on cue.
- ✅ Cube cards (CH2/CH4/CH6) · 9 punch-ins (word-gap snapped; hard where a real gap exists, 10f push
  otherwise) · 2 light leaks (CTA leak shifted to 880.4-884.4, opener deliberately clean — TRANSITIONS Notes)
  · IMG-8/9 CTA badges (350x LAB / 58x Velvet = the AS-SPOKEN track-record claims, transcript-verified).
- ✅ **SFX-CUES.json** (25 cues, paused-timeline coords) for the post-mix; comp is video+VO only.
- ✅ Gates: lint-covers · animated-charts · slide-balance · deck-containers (**new `OVERVIEW_REFS` exemption**,
  documented in CLAUDE.md 6c) · pause-silence · docset — ALL exit 0.
- ✅ **RECEIPTS 7/7 staged + verified** (`assets/receipts/` + `CAPTURED.md`; restaged into the pubdir):
  R1 CoinGecko Bittensor $197.51/$1.896B · R2 CoinGecko Render $1.48/$767.9M · R3 CoinGecko Virtuals
  $0.6062/$398.6M · R4 taomarketcap "Total Subnets 128" · R5 otoy.com · R6 taomarketcap "Chutes SN 64" #2
  (primary; chutes.ai bonus shot kept) · R7 simplytao Steeves-steps-down **Feb 13 2026**. ⛔ taostats.io =
  ABANDONED (interactive Cloudflare Turnstile defeats bundled Chromium AND real Chrome AND Camoufox — Mike's
  call: don't retry; note in CAPTURED.md). CoinGecko slug gotcha: `virtual-protocol`, singular.
- ✅ **DRAFT v1 DELIVERED (2026-07-19), WITH the full music+SFX mix** (Mike asked for combined QA):
  `_previews/tao-render-virtuals-draft-v1-mixed.mp4` (914.433s / 27433 frames / ~45 MB; clean-VO version
  `-draft-v1.mp4` alongside). Mix = 5 beds (MEASURED gains −20.8..−24.4 dB; VO −16.8 LUFS; seams/dips/
  end-alignment per MUSIC-PLAN) + 25 pack transition SFX + 3 card impacts + name-drop boom + hero-melt and
  verdict riser+impact pairs (end-hit verified at 818.9, +7 dB spike). Mix generator:
  scratchpad `build-mix.js` (+ `.filter.txt` beside the output).
  **Render lessons (also claudeisnaughty #17-18):** background pipelines got externally killed twice →
  rendered as FOREGROUND quarters (~6 min each; the heavy C2/CTA tail at concurrency 4); Remotion temp
  bundles leak ~69 MB/invocation → `rm -rf %TEMP%/remotion-*` between runs (3.7 GB reclaimed); 5-chunk
  concat = video-only + explicit `duration` directives + audio muxed from the paused spine (else AAC
  priming drifts A/V +0.28s).
- ✅ **DRAFT v2 DELIVERED (2026-07-19)** — all 6 of Mike's v1 QA notes fixed and verified in the output:
  (1) jump-cut "weird transition" = the hand-rolled GlitchTear → replaced with **`lib:deviation-shift-4x`**
  (the pack's same-scene accent; TRANSITIONS §3 updated); (2) **BR-16-engagement-counters** Envato clip
  covers the subscribe/like line 192.6-196.4 (BROLL-PLAN logged, punch re-snapped to the 186.4-187.1 gap);
  (3) 9:56 double-card = **stale `CARDS[2].b` 592.42 vs the 592.24 pause** → CARDS now derives from CARD_T
  (the card scene had been landing 1s late OVER the D6-A board); (4) 10:36 odd noise = the Edgy_Riser into
  the hero melt → removed from the mix; (5) 13:43 slam = bed E's env-8 hot entry → fade-in 0.5→2.0s;
  (6) full re-render. Render note: the 0xC0000142 stitch ceiling degraded to ~5.4k frames after the day's
  marathon → rendered as **8 foreground eighths** (~3.4k frames each), duration-directive concat, frame-exact.
  File: `_previews/tao-render-virtuals-draft-v2-mixed.mp4` (914.433s / 27433 frames; clean `-v2.mp4` beside).
- ✅ **DRAFT v3 DELIVERED (2026-07-19)** — v2 QA round 2, ZERO re-render (audio-only):
  (1) **the CH2 pause had split the word "Now"** (1:16) — same bug class as carry-trade's "ago";
  `lint-pause-silence` had PASSED it because it checked dip-PROXIMITY (±150ms) not CONTAINMENT at the cut.
  **Gate upgraded** (containment + trough-snap suggestion; would now fail the old point), CH2 re-baked at
  the real trough **76.655**, spine `ALL.e.paused.mp4` replaced (+sidecar). Since every card sits on
  blacked+covered spine, the fix = remux v2's untouched video + new spine audio + re-mix. claudeisnaughty #19.
  (2) **Bed B −5 dB compression over paused 4:40-5:12** (the Slow Rise bloom Mike flagged; 1s −2.5 dB
  shoulders) — in `build-mix.js` permanently, already audible in v3.
  File: `_previews/tao-render-virtuals-draft-v3-mixed.mp4` (914.433s; clean `-v3.mp4` beside).
- ✅ **FINAL DELIVERED (2026-07-19): `tao-render-virtuals-FINAL.mp4`** (project root; 914.47s, 269 MB,
  **2.0 Mbps** per Mike, full mix incl. every locked decision). Mike approved v3 → final.
  **CAPTIONS ADDED pre-final** — Mike: "we're supposed to have them on"; they'd been silently defaulted OFF
  (comp-build §8 SAID "OFF by default" while every real longform opted in — the prose default was the bug,
  born from generalizing silverscript's per-video "no captions"). Fixed at every layer: §8 flipped to **ON
  by default** (OFF now = explicit per-video Mike decision in the CUE-SHEET), this video's docs corrected,
  memory scoped, claudeisnaughty #20. Build: captions-builder agent (canonical build_captions.py, Montserrat
  900, 124 groups over the 15 FACE windows, tau→TAO ×6; dict gained potenza→bittensor + virtuos→virtuals;
  ONE scoped in-comp override for the unsafe-global "tensor"→"bittensor" cue @577.16). `CAPTION_SRC`
  declared → lint-covers' captions-over-cover check active. Rendered as 8 foreground eighths @2M,
  duration-directive concat, spine-audio mux, `build-mix.js` final mix. QA: caption/melt/card stills from
  the FINAL + pause-silence and end-hit audio probes, all pass.
- 🎬 **NEXT (publishing):** YouTube longform = Mike's MANUAL upload (never queued); the longform queue
  (rumble/bitchute/facebook via `longs.json`) is the automated lane — stage per
  `schedule-tweets/scripts/lib/longform-queue.js` flow when Mike says go. Music license codes (5, in
  MUSIC-PLAN.json) go in the YT description ONLY (stripMusicCredits elsewhere).

## PRE-DRAFT AUDIT (2026-07-19, Mike-requested) — comp NOT render-ready; findings + fixes
Mike caught the CUE-SHEET missing the §4 melt/spin marquees → full sync audit run. Results:
- ✅ **FIXED — doc sync:** the §4 marquee redesign lived ONLY in TRANSITIONS.md. CUE-SHEET, EDIT-PLAN and
  EDIT-PLAN-prep now carry all 6 moves on their rows (incl. D6-B ingress corrected from "longer scale-in"
  to the HERO melt — TRANSITIONS.md wins on conflict).
- ⛔ **RECEIPTS NEVER CAPTURED** (Mike suspected right): no `assets/receipts/` folder exists; R1-R7 are
  comp placeholders. Nothing was QA'd because nothing was captured. Must capture before draft.
- ⛔ **D3-D single-file bug:** CUE-SHEET has D3-D-before (5:01.5) and D3-D-after (5:21.6) as two states,
  but only ONE combined PNG exists (`CH3_D3-D_dtao.png`, both cards on one frame) and gen-covers maps both
  beats to it → the 5:21.6 melt would morph the image into itself. Fix: build before/after state variants
  from `CH3_D3-D_dtao.html` (before = BEFORE card lit / after dim; after = as-is or before dimmed).
- ⛔ **lint-covers.js CANNOT PARSE the comp** (gate 6b dead): the generated `taoRenderVirtualsCovers.ts`
  shape (kinds video/image/container/diagram) diverges from comp-build §4's canonical `COVERS` shape
  (tIn/tOut, kinds chart/still/vid/deck/receipt). Refactor to canonical → also unlocks
  lint-animated-charts / slide-balance. Once parsed, #2 DURATION will flag BR-8 = 4.04s (>4.0) and
  BR-14 = 5.18s lead (>5.0) — trim both.
- ⛔ **Charts C1/C2 render as STATIC PNGs** in the comp; CUE-SHEET + charts.md + lint-animated-charts
  require LIVE `useCurrentFrame` components (even in the draft).
- ⛔ **IMG stills get the QUIET container fade** in CoverEl — §2 says every ChatGPT still ingress =
  `lib:badsignal` glitch.
- Still absent from the comp (already on the pickup list): 6 marquees · cube cards + card pauses ·
  12 face cut-in glitches · 11 intra-face punch-ins · light leaks ×2 · IMG-8/9 CTA overlays.
- lint-docset: PASS (1 known WARN: DOSSIER.md). Disk: 8.6 GB free (still run cleanup before HQ).

## Status / resume pointer (2026-07-19) — ASSETS ACQUIRED · COMP BUILD IN PROGRESS
_Newest on top. The 2026-07-18 block below covers everything up to the pre-build doc set._

**DONE this session (07-18 evening → 07-19):**
- ✅ **B-ROLL COMPLETE.** 15 Envato clips (`assets/video/BR-1..15`; oversized 4K transcoded to 1080p proxies)
  + 9 ChatGPT images (`assets/img/IMG-1..9`). IMG-1..7 passed the visual-QA gate (7/7, no stray text/digits);
  IMG-8/9 = LAB + Velvet token coins from `schedule-tweets/images/reference/{LAB,velvet}.png`, **NO number baked**
  (350x / 58x are comp overlays). `BROLL-PLAN.md` status = sourced/generated.
- ✅ **TRANSITIONS redesigned** — added the 4th layer: **MELT (transform) + SPIN (new-facet) reserved for the 6
  diagram/chart marquees** (`melt-rgb` / `spin-3d-side-ease`, one look each; text containers stay cross-fade).
  New **`transition-strategist`** Fable/max agent authored + registered; spawned it to independently cross-check
  → CONVERGED on all 6 placements; folded in its 3 wiring fixes (635.4 outgoing = D6-A board · 592.4 suppress the
  cube out-rotation · MeltEquidistant is image-only, so melt-rgb is the only render-ready melt). Codified in
  `comp-build.md` §6/§14 + memory [[project_transition_library]].
- ✅ **REMOTION COMP STARTED** — `remotion/src/TaoRenderVirtuals.tsx` (registered in `Root.tsx`, 1920×1080 / 30fps):
  - PASS 2 = full **COVER layer** (all 85 covers from `taoRenderVirtualsCovers.ts`, auto-generated by
    `scratchpad/gen-covers.js`, every file resolved on disk).
  - PASS 3 = cover **fades / scale-ins** + Mike's **FACE JUMP-CUT treatment** (zoom punch-settle + glitch tear at
    the 6 face-visible desilencer cuts → `taoRenderVirtualsFaceJumps.ts`, derived from `spine/ALL.d.desilenced.map.json`).
  - Verified by still renders: D3-A diagram, face-glitch @107, BR-1 fade @402 — all composite correctly.
  - **Studio:** `cd video-creation/remotion && npx remotion studio src/index.ts --public-dir="…/media/tao-render-virtuals"`
    → http://localhost:3000 → composition **TaoRenderVirtuals**. (Studio serves the pubdir directly; the CLI render
    COPIES it to %TEMP% — keep the pubdir lean, the OFFSET_PUBDIR lesson.)

**⏭️ PICK UP TOMORROW (in order):**
1. **React to the FACE JUMP-CUT feel** (Mike). Open Qs: (a) glitch/zoom subtler or stronger? current: zoom peak
   1.06, glitch 5 frames. (b) also add the subtle punch at the ENTRANCE of every face beat (all 12), not just the
   6 jump-cuts, to make the motif more present? Once locked, codify the rule in `comp-build.md` §6.
2. **Build the 6 MELT/SPIN MARQUEES** (`TRANSITIONS.md` §4) via `TransitionClip`: spins at D4-A 371 / D5-A 479 /
   D6-A 592.4; melts at D3-D 321.6 / **D6-B 635.4 (hero)** / C2 749.5. + the **12 face-cut-IN glitches**
   (`blocks-max`) at each face ingress (48.7 · 123 · 181.87 · 294.03 · 353.63 · 456.8 · 575.03 · 654.37 · 730.13 ·
   813.03 · 858.57 · 873.73).
3. **CARD PAUSES** — bake a 1s freeze+silence at CH2 76.8 / CH4 362.42 / CH6 592.42 into the spine, then flip
   `PAUSE_ACTIVE=true` in the comp (`sh()` re-maps every cue) and update DUR.
4. **RECEIPTS R1-R7** (7 pending gold placeholders in the comp) — capture real-site screenshots [VERIFY live]:
   R1 taostats TAO price/mcap (169.7) · R2 CoinGecko Render (362.42) · R3 CoinGecko Virtuals (473.8) · R4 taostats
   subnet count (600.8, optional) · R5 otoy.com (384.2) · R6 taostats Subnet 64 "Chutes" (448.6) · R7 simplytao
   Steeves-steps-down Feb 13 2026 (704.6). Land them in `assets/receipts/` and add a `receipt` case to CoverEl.
5. **IMG-8/9 CTA inserts** (inside 873.73-911.26): composite the **350x (LAB) / 58x (Velvet) CODE overlays** on top
   of the coin images — **HARD [VERIFY] the multipliers are current** before render (track-record rule).
6. **MUSIC + SFX** — ffmpeg-mix onto the finished render per `MUSIC-PLAN.json` (never in the comp).
7. **Draft render** (0.3 Mbps proxy) → `video-qa.md` 10s chunks → HQ final → mechanical gates (`lint-covers.js` etc.).

**KEY RESUME FILES:** comp `remotion/src/TaoRenderVirtuals.tsx` + `taoRenderVirtualsCovers.ts` +
`taoRenderVirtualsFaceJumps.ts`; regen covers `scratchpad/gen-covers.js`; plan `TRANSITIONS.md` (§4 table);
cover source `spine/_cover-plan.json`; jump-cut source `spine/ALL.d.desilenced.map.json`.

**⚠ ENV:** C: was 100% full (3.4 GB free). Freed ~2.9 GB by transcoding the oversized 4K b-roll to 1080p proxies
(video dir 3.6 GB → 707 MB). Still tight (~6 GB) — **run `node cleanup/cleanup.js --target all --dry-run` before
the HQ render.**

---

## Status / resume pointer (2026-07-18)
- ✅ Concept + framing locked (below).
- ✅ Research done → `DOSSIER.md` (deep-research, 25 claims verified 3-0).
- ✅ `screenplay-strategist` Fable agent built (`.claude/agents/longform-edited/screenplay-strategist.md`).
- ✅ Recorded (2 halves) → defumble→blackout→desilence→burst-removal→join→final tighten = `spine/ALL.d.desilenced.mp4` (15:11), Mike-approved.
- ✅ Word-level transcript (`spine/ALL.d.desilenced.medium-words.json`, 2535 words, 13 FACE windows).
- ✅ **PRE-BUILD DOCUMENT SET COMPLETE (2026-07-18):** SCREENPLAY · AS-RECORDED · DATA · BROLL-PLAN ·
  TRANSITIONS · EDIT-PLAN-prep · **EDIT-PLAN** (time-ordered event log, timestamped) · CUE-SHEET ·
  MUSIC-PLAN.json · PROJECT-LOG. Coverage (85 beats, zero orphans, ~89% CSS) + music (5 beds, aggression-picked)
  assigned to transcript timestamps. Raw coverage: `spine/_cover-plan.json`.
- ⏭️ **NEXT:** Mike reviews the docs + the 7 open decisions (defaults applied, listed in EDIT-PLAN-prep) →
  build the Remotion comp TO these blueprints (EDIT-PLAN + CUE-SHEET are the gate) → reconcile (zero-orphans) →
  draft render → QA → final. EDIT-PLAN.md was authored PRE-build (NOT generated from the comp).
- 📄 Docs NOTE: `DOSSIER.md` is superseded by `DATA.md` (its content lives there); do NOT create a DOSSIER for
  future videos (comp-build §13 — research dump goes in DATA.md).

## FINAL SPINE READY (2026-07-18)
**`spine/ALL.d.desilenced.mp4`** (911.4s / 15:11) — Mike APPROVED the 900ms combined draft, then final
two-zone tighten: intro (0-84.2s, CH1 hook+roadmap) @200ms, body @600ms. QA clean. Map:
`spine/ALL.d.desilenced.map.json` (keep-boundaries = downstream jump-cut anchors). Approved
`ALL.c.desilenced.mp4` kept intact. THIS is the spine that feeds coverage/comp next.
- Screenplay note (future videos, NOT this one): Mike flagged retention-killer "this is basically the
  whole video" / "remember, it pays off later" lines. Rule now in persona.json
  spoken_voice.no_premature_whole_video_summary + memory [[feedback_no_premature_whole_video_summary]].

## Spine processing — COMBINED REVIEW DRAFT (superseded by the final tighten above)
**Deliverable:** `spine/ALL.c.desilenced.mp4` (958.2s / 15:58, 1920x1080 @30fps CFR) =
`CH1-CH3.d.cleaned` (defumble→blackout→desilence@900ms→3 bursts removed) + `CH4-CH7.c.desilenced`
(defumble→blackout→desilence@900ms), joined sync-safe (normalized 30fps, filter_complex concat).
Seam at ~6:20 (379.6s), CH3→CH4 handoff, both sides blacked = invisible.
- Bursts removed (CH1-3, on Mike's ear): 39.4s after "virtuals", 62.2s after "architecture", 144.05s after "network".
- Desilence is a LOOSE 900ms FIRST pass (~53-54% removed each half) — tighten later per usual workflow.
- Folder/naming now follow the convention (spine/, .a/.b/.c/.d stages) documented in comp-build.md §13a.

## Spine processing (2026-07-18, Mike recorded in two halves)
Pipeline per half (Mike's spec): **defumble → cover-blackout → desilence @ 900 ms**. Then JOIN the two
halves into one reviewable draft. All via the canonical shared agents. Masters in `raw/` stay untouched.

- **Half 1 = CH1-3** — `raw/2026-07-18 11-45-08.mkv` (1245s)
  - ✅ defumbled → `2026-07-18 11-45-08.defumbled.mp4` (804s, 39 spans cut)
  - ⏳ cover-blackout re-rendering (first render died = invalid moov; plan `...blacked.mp4.cover.json` is good, 6 blackout spans / ~5 FACE windows incl. the kept mid-roll ad-lib as FACE)
  - ⬜ then re-desilence @900ms the blacked spine → CH1-3 FINAL  (a non-blacked desilenced `...desilenced.mp4` (380s) exists but will be superseded)
- **Half 2 = CH4+** — `raw/2026-07-18 12-10-35.mkv` (1675s / ~28min)
  - ⏳ defumbling (agent running)
  - ⬜ then cover-blackout → desilence @900ms → CH4+ FINAL
- **JOIN:** ⬜ concat CH1-3 FINAL + CH4+ FINAL (sync-safe filter_complex, never concat-demuxer) → **combined review draft**.

Content flags already surfaced (Half 1 defumble) for Mike's review: CH1 locked hook take dropped "multi-year";
"…that fact is basically the whole video" clause has no clean take; "Remember that… becomes a weapon" never
recorded (69.5s break); an unscripted mid-roll subscribe ad-lib was KEPT (editorial keep/trim call).

## Locked concept
- **Working title:** "TAO goes toe-to-toe against Virtuals and Render" (TAO decisively beats both).
- **Track:** longform-edited (16:9, heavily edited).
- **Archetype:** **EPIC, informative.** EPIC intro + EPIC outro, dense information/data/charts in between.
  Register arc: gear-3 (epic/declarative) for CH1 + CH7 and conviction beats; gear-2 (explainer) for the
  mechanics middle (CH2-CH6). Per `persona.json` spoken_voice gears.

## The opening (CH1 hook) — authored at max effort
Open on something Mike believes and states as conviction (NOT a market recap): **we are entering a
multi-year, AI-induced economic expansion — on the scale of, or greater than, the dot-com explosion of
the 1990s. A handful of winners will be rideable all the way to the top.** Then narrow: of the AI-crypto
contenders, one already contains what the others each do. Epic, declarative, gear-3. CH1's opening line is
a locked `🔒 [SAY-EXACT]` block (no cold open — the hook IS CH1).

## Thesis (two verified pillars — see DOSSIER.md)
1. **BREADTH (superset).** TAO/Bittensor is a network of 120+ specialized subnets; Render is ONE lane
   (GPU rendering), Virtuals is ONE lane (AI agents). TAO already contains both + more. Airtight.
2. **ARCHITECTURAL DECENTRALIZATION.** Permissionless participation, fair launch (no VC/premine/ICO), no
   central operator (Opentensor stepping back / Steeves stepping down — CORRECT version), vs Render
   (OTOY-anchored) and Virtuals (a Base launchpad). Decentralization = NETWORK/architecture axis, NOT
   holder/stake distribution (Mike, 2026-07-18 — see memory `feedback_decentralization_is_architectural`
   + DOSSIER forbidden-claim #3). Never cite holder Gini as a "not decentralized" argument.

## ⛔ Do-not-air (from DOSSIER.md — become [!WARNING] boxes in the screenplay)
- The "1% / 5% of what TAO does" figures are rhetoric with no basis → reframe as breadth ("one lane vs 120+ lanes").
- The founder story: NOT "Foundry, December" → it's Jacob Steeves / Opentensor Foundation, announced Feb 13 2026.
- Do not claim TAO wealth/stake is evenly distributed (it isn't); decentralization is argued on the architectural axis.

## Chapter map (v2 — approved skeleton)
- **CH1** — Hook + thesis (dot-com-scale AI expansion → the one AI token that contains the rest). gear-3.
- **CH2** — What TAO/Bittensor is (Bitcoin-modeled, fair launch, 21M cap, Dec-2025 halving).
- **CH3** — Subnets + Yuma consensus: the marketplace of 120+ subnets. **Marquee system-design diagram.**
- **CH4** — Render, the one lane (GPU rendering, OTOY, Solana/BME).
- **CH5** — Virtuals, the one lane (AI agents, Base, VIRTUAL/ACP).
- **CH6** — Toe-to-toe: superset diagram + breadth + architectural decentralization + Metcalfe-vs-Reed
  (as a conceptual heuristic, not literal valuation). **Marquee charts.**
- **CH7** — Conviction close (epic outro; ride the winner).

## Music direction (for screenplay-strategist → then music-placement-strategist)
Mood-of-the-chapters bed plan: aggressive/epic beds under CH1 + CH7 (reserve an `epic_hit`-ending track
for the close); subtle explainer beds under CH2-CH6 so they never fight the teaching VO. Title cards fall
out of the bed-change map (Convention 2). Screenplay-strategist PICKS tracks + intent from
`assets/music/library.json`; `music-placement-strategist` carves exact placement on the final spine.
