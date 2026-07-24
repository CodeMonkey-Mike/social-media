# longform-edited — routing (auto-loaded when working in this folder)

_Thin pointer. The canonical skills below own the rules; this file only routes to them and
surfaces the load-bearing ones. **Do not duplicate rules here** (they drift) — canonical sources
win on conflict. See the repo-root `CLAUDE.md` philosophy: "this file points, it does not duplicate."_

This is the **heavily-edited 16:9 longform** track (b-roll, music, motion graphics, punchy cuts).
Separate from `longform-presentation/` (frozen slide-deck track) — do not cross-contaminate.

## ⛔ PRE-RENDER GATE — RUN THIS CHECKLIST BEFORE EVERY REMOTION RENDER (Mike, 2026-06-21)
**Repeated rule-violations have wasted hours and pushed deliverables a full day. The cause: building a
REDUCED draft and deferring documented requirements as "open items," then QA-ing with shortcuts. STOP doing
that.** Build to the FULL spec the first time, and verify each item below against the comp BEFORE you render.
A render is a CONFIRMATION of the plan, never a discovery. If an item isn't met, FIX IT before rendering —
do NOT render-then-explain-it-as-an-open-item.

1. **No deferring.** Every documented requirement is IN this render — not "next pass." (face transitions,
   full-screen containers, music, SFX, captions-if-ON). If you're about to write "deferred/open item" for a
   documented rule, that's the violation — build it now.
2. **Containers FILL THE FRAME** (longform-edited.md #1): enlarge content to the content-body; NEVER small
   deck-sized cards floating in a big dark box. One spotlighted point at a time, large.
3. **FACE cuts use the video's PICKED face transition** (#5 + the video's `TRANSITIONS.md`): a **per-video pick
   between FILM BURN and the Blocks·Max glitch** (decide once, use it on every face cut), plus on faces > ~2s a
   **hard ~15-20% zoom punch-in** mid-beat. NEVER a plain cross-fade to the face. (Both are sanctioned; the pick
   is recorded in `TRANSITIONS.md`. Glitch is reserved for AI stills unless the video picks it for faces too.)
4. **Music covers EVERY chapter** (#10): `loop` any bed shorter than its span; no silent stretch. Verify by
   checking the music floor in a no-VO breath of each bed, not just "loudness is non-zero."
5. **SFX QA = render the chunk and LISTEN** + short-term/peak vs VO (video-qa.md). NEVER integrated-LUFS-only
   (it averages a loud transient in with the voice). Every impact/riser over speech sits UNDER the VO.
6. **EDIT-PLAN (time-ordered event log) + CUE-SHEET exist and the comp is reconciled to them** + house rules
   #1/#5/#10, with ZERO orphans, BEFORE the render.
6b. **MECHANICAL GATE — run `node skills/lint-covers.js <comp.tsx>` and it MUST pass (exit 0) before any render.**
   It enforces the cover-layer rules in CODE (no memory): #12 no reused b-roll, #2 no clip >4s (>5s if `lead:true`),
   captions never over a cover. A non-compliant comp does not get rendered. (Added 2026-06-30 because these rules
   kept being violated when they lived only as prose — the linter is the prevention, not "remember to check".)
   **It ALSO surfaces WARNs you MUST review, not just exit 0** (added 2026-06-30 after the whole-slide / repeated-
   slide / repeated-whitepaper round): **CONTAINER SCATTER** (a deck/receipt ref in >2 separate spots — confirm
   each is a deliberate callback, not a lazy repeat) and **LONG HOLD** (a container held >35s — a system-design
   DIAGRAM may hold while explained, but a TEXT container/slide must spotlight ONE sub-point at a time, never the
   whole slide; sub-spotlight or break it). An unjustified WARN is a violation — clear or justify every one.
6c. **FOUR MORE MECHANICAL GATES (added 2026-06-30 after Mike: "the violations are really, really bad… doubles
   the production time"). The plan-linter (6b) checks the PLAN; these check the PIXELS / AUDIO it could not see:**
   - `python skills/lint-deck-containers.py <comp.tsx> <render-assets/deck>` — **FAILS** if a deck PNG is a WHOLE
     SLIDE (2+ card-boxes) instead of one container (caught the bio slide AND the s9 comparison). Declare real
     diagrams `// DIAGRAM_REFS: …`, deliberate A-vs-B contrasts `// COMPARISON_REFS: …`, and deliberate
     all-cards-at-once overviews (~ONE per chapter, comp-build §5) `// OVERVIEW_REFS: …` in the comp to exempt;
     end the declaration lines with a plain comment (e.g. `// (end declared refs)`) so the last ref parses clean.
   - `python skills/lint-pause-silence.py <comp.tsx> <source-spine.mp4>` — **FAILS** unless every card-pause/clip
     INSERT point sits INSIDE a silence dip (containment at the cut itself, ~30ms guard — upgraded 2026-07-19
     after the tao CH2 pause split the word "Now": the old dip-within-±150ms proximity check passed a cut that
     landed ON a word onset 140ms after the real trough; on failure it prints the trough to snap to). Also
     point is MID-WORD (no silence dip within ±150ms). Run on the SOURCE spine BEFORE baking pauses/clips. (Would
     have caught the CH4 pause splitting "ago".)
   - `DUCK=$(python skills/bed-duck-expr.py <comp.tsx>)` — derives the music-bed duck windows from the comp's clip
     inserts; the bed mix MUST use this expression so the bed always drops under the talk (never hand-type the
     windows). Prevention by construction for "the bed played over the R-TALK clip."
   - `node skills/lint-slide-balance.js <comp.tsx>` — **FAILS** if the slide/container BALANCE breaks: a full
     diagram slide (`kind: 'deck'`) shown more than ONCE (the "over and over" repeat), OR a comp that is ALL
     slides / ALL containers (the swing). Enforces "⛔ THE BALANCE" (broll-and-containers.md): a rich slide once,
     then broken up into spotlight containers. (Added 2026-07-10 after the Clarity Act container swing cost a
     full day of rework.)
7. **video-qa.md passes on 10s CHUNKS (motion + audio), not stills**, before you call it done or hand it off.

## Read FIRST, by what you're doing

| You are… | Read first (canonical) |
|---|---|
| **Writing / outlining a video's script** | **`screenplay.md`** (this folder) — how to write `SCREENPLAY.md` |
| **Editing / building the Phase-4 render** | **`longform-edited.md`** (this folder) + its **`skills/`** rules |
| **Repurposing a finished 16:9 into a vertical (9:16) cut** | **`skills/vertical-repurpose.md`** |
| **Resuming a specific video** | that video's `media/<project>/SCREENPLAY.md` + `PROJECT-LOG.md` |

`screenplay.md` governs the SCRIPT; `longform-edited.md` governs the EDIT. They are siblings.

## Local skills (`skills/`)

- **`skills/comp-build.md`** — the canonical, **self-contained** Remotion COMP architecture (spine `OffthreadVideo`
  + `CUTS`/`sh()`, COVER layer, captions gating, the 3-bucket transitions, animated charts, render-assets layout,
  render command with `--video-bitrate`). Read before building any comp. **§13 lists the full per-video document
  set** (every file a `media/<project>/` folder must carry); **§14 is the `TRANSITIONS.md` skeleton.** Survives
  any project deletion; the `src/` comps are non-authoritative examples.
- **`skills/edit-plan-and-cue-sheet.md`** — the ONE canonical format for **`EDIT-PLAN.md`** (§1 time-ordered
  event log) and **`CUE-SHEET.md`** (§2 layer-grouped watch-along). Read it BEFORE writing either; the format is
  fixed across all videos — do NOT invent a per-video shape. Both formats are embedded as self-contained skeletons
  (no project dependency). CUE-SHEET FACE spans come from `blackdetect` on the baked spine. `_gen_editplan.example.js`
  (here in `skills/`) is the preserved EDIT-PLAN event-log generator.
- **`skills/video-qa.md`** — the mandatory render-QA gate (see PRE-RENDER GATE above).
- **`skills/vertical-repurpose.md`** — turning an APPROVED 16:9 longform-edited video into a vertical
  (1080×1920) cut: native-vertical assets (article/receipt screenshots captured in MOBILE VIEW, not
  landscape-cropped), the vertical comp, the split-and-concat render (works around the ~frame-14436 FFmpeg
  stitch handle-ceiling — memory `reference_remotion_stitch_handle_ceiling`), reuse of the 16:9 mix, and
  vertical-specific QA (concat seam + framing + audio parity). The content is locked; the vertical is a
  reframe, not a re-edit.
- **`skills/charts.md`** — the canonical method for **data charts / animated data-graphics** (DATA.md
  chart-source index · the code/screencap/restyle build-mode decision · the never-AI-as-the-source-of-a-number
  guardrail · animate-for-real vs reveal-a-bitmap). Durable so it survives a project folder being deleted;
  smartmoney-backing-kaspa is the worked exemplar, not the source of truth.
- **`skills/presentation.md`** (yt-presentation, added 2026-06-23) — a tested design system for building
  **dark cinematic, scroll-based HTML** slide decks / explainer visuals (one self-contained `.html`,
  scroll-snap slides, JetBrains-Mono numbers, on-brand accent palette). Use it when building HTML
  deck/explainer graphics or as a **styling reference for code-rendered explainer containers + data
  charts** (Convention 4 / the system-design-container rule). Note: a full slide-DECK *video* belongs to
  the `longform-presentation/` track; in this track the skill is for HTML container/chart styling.

## The conventions that get violated most (full text lives in the canonical files)

- **SAY-vs-direction (screenplay.md, Convention 1):** a plain Outline bullet **IS what Mike says**;
  **`(parentheses)` = a direction/note to Mike, NOT spoken**; **`>` blockquote = say it verbatim**.
  A **bold label** at the front of a bullet is a sanctioned signpost (still spoken). A bare,
  unsayable instruction mixed into a line is the bug — wrap it in parens.
- **FACE / COVER gating (screenplay.md Convention 3 / longform-edited.md #6):** gated face, OFF by
  default. `[FACE]` = ONE sentence as punctuation; tag the next line `[COVER]`. Most runtime is COVER.
- **Explainer visuals = SYSTEM-DESIGN containers (Convention 4):** code-rendered HTML/SVG, one per
  talking point, spotlight-swapped. NOT tables, NOT AI images (text must be pixel-accurate).
- **EDIT-PLAN hard gate (longform-edited.md):** no editing/Remotion work starts until
  `media/<project>/EDIT-PLAN.md` exists — every beat, every layer, every asset placed or REJECTED,
  zero orphans. The render CONFIRMS the plan; it never DISCOVERS what's missing.
- **Build to the TRANSCRIPT, not the screenplay (#6):** the recorded take diverges; cue every beat
  off the Phase-2 word-timings and omit beats he didn't say.
- **`skills/video-qa.md` is the MANDATORY gate** before calling any render done (QA 10s chunks first).
- **Transitions = THREE separate buckets (canonical list: `../assets/transitions/README.md`):**
  (1) **chapter / title cards** → pick ONE per video from the handful (slide · flip · cube · book-flip · swap)
  and use it for EVERY title card (a `@remotion/transitions` presentation on the self-contained title-card
  scene); (2) **glitchy-fast hits** (AI/atmosphere stills, hype beats) → the glitch library
  `../assets/transitions/library.json` (Blocks / Cinematic Bad Signal); (3) **b-roll + container overlays
  over the face spine** → hand-rolled fade / cross-warp / film-burn (`longform-edited.md` #5, never
  `TransitionSeries` on the locked spine). Do NOT collapse all three into the glitch library.

## Per-video folder

Each video is `media/<project>/` and carries the **FULL document set** (if one is missing, that's a gap to fill,
not a choice to skip — the complete list + format owners is in **`skills/comp-build.md` §13**):
`SCREENPLAY.md` · `DATA.md` · `BROLL-PLAN.md` · `EDIT-PLAN-prep.md` · `CUE-SHEET.md` · **`TRANSITIONS.md`**
(the per-video transition plan — skeleton in `comp-build.md` §14) · `EDIT-PLAN.md` (generated event-log) ·
`PROJECT-LOG.md` · plus the master `.mkv` / `LOW BPS` / `EDIT` / `FINAL` mp4s and `render-assets/`.

## Non-negotiables (canonical copies cited above — do not violate)

- **No em dashes** anywhere (titles, captions, on-screen text) — persona rule.
- **Defumble** only via `../skills/defumbler/defumbler.md`; **desilence** only via
  `../skills/desilencer/desilencer.md` (one tool each, every track). Never single-threshold `silencedetect`.
- **Sync-safe `filter_complex` only** for every cut/concat (never the concat-demuxer A/V-drift method).
- **Never edit or delete the master `.mkv`**; deletions go to the Recycle Bin.
