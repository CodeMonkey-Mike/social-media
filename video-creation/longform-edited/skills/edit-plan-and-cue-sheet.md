# longform-edited · EDIT-PLAN + CUE-SHEET formats (canonical)

The two planning artifacts every longform-edited video carries, and the EXACT format each must be in.
**THIS SKILL IS THE SOURCE OF TRUTH — and it is self-contained.** The full copy-pasteable skeleton for each
file is embedded below (§1 EDIT-PLAN, §2 CUE-SHEET), so the format survives even if every `media/<project>/`
folder is deleted. (Mike, 2026-06-30: project folders are deletable; an external "copy this file" reference is
not durable — the same rule as `charts.md`, "the worked exemplar is not the source of truth.")
**Worked references (non-authoritative, may be deleted):** `media/bittensor-for-the-future/` and
`media/smartmoney-backing-kaspa/` carry real filled-in versions. If they are gone, build from the skeletons
here — do NOT invent a new shape. (Origin: Mike, 2026-06-21 — kaspa-covenants shipped both in the wrong shape
with the transitions section missing.)

These are SIBLINGS to the screenplay: EDIT-PLAN = the full per-event manifest (the hard gate, every asset
placed or REJECTED); CUE-SHEET = the layer-grouped watch-along. Both are at **FINAL video timecode** (M:SS.s)
on the rendered spine, snapped to the word-level transcript.

---

## ⛔ ORDER (Mike, 2026-07-18) — these are PRE-BUILD blueprints, authored BEFORE the Remotion comp
`CUE-SHEET.md`, `EDIT-PLAN-prep.md`, and `EDIT-PLAN.md` are ALL authored **before** the Remotion build — they
are the pre-build **blueprint / gate the comp is built TO**, timecoded off the **word-level transcript** (which
exists as soon as the spine is desilenced). Their whole purpose is to have every element assigned to a
timestamp and reconciled (zero orphans) BEFORE any comp work — "so we have everything in check before we do
the build" (Mike). **We do NOT generate them from the comp after the fact.** The `_gen_editplan.js` "generate
EDIT-PLAN from the comp" wording below is an OPTIONAL as-built reconciliation only (Mike has never used it) —
treat it as legacy, NOT how the plan is authored. Author the plan from the transcript; build the comp to it.

## 0. Lifecycle — the PREP file vs the FINAL pair (don't skip the rename)
The two files above are **post-record** artifacts (they need the recorded + desilenced spine and its word-timings;
EDIT-PLAN is GENERATED from the comp). But planning starts BEFORE the VO exists, so each video has THREE files
across its life:

1. **`EDIT-PLAN-prep.md`** — the **pre-record planning file**. Beat-indexed (chapter/beat tables are fine here),
   provisional, NO real timecodes. Maps every beat → every layer/asset/transition, zero orphans, so asset prep
   can proceed. This is a PLANNING doc, not the gate. (Name it `-prep` from the start.)
2. **`EDIT-PLAN.md`** — the **post-record final**, the time-ordered EVENT LOG in §1. As soon as the spine is
   recorded + transcribed, AUTHOR this off the transcript + placement plan (pre-build, per the ⛔ ORDER note);
   preserve the old planning detail in `EDIT-PLAN-prep.md` (it is NOT overwritten — it stays as the prep record).
3. **`CUE-SHEET.md`** — the **post-record** layer-grouped watch-along in §2, hand-authored from the same
   transcript + placement plan (pre-build).

**Optional companion: `BROLL-PLAN.md`** (Mike, 2026-06-29) — the b-roll ACQUISITION worklist (atmospheric
shots, the prompts / Envato search terms / sourcing status, a place to keep ADDING b-roll). It feeds the
`EDIT-PLAN-prep` b-roll rows but is not the placement gate: keep heavy shot detail HERE so the screenplay's
`🎬 [SHOW]` lines stay short references and don't bloat. **Every BROLL-PLAN ALSO carries TWO build-worklist
sections (Mike, 2026-07-24: these assets were invisible when they lived only as ids in the cue sheet):**
- **"CHARTS build worklist"** — the TWO chart types: Type 1 = ANIMATED charts (motion, code-built, animate
  for real) and Type 2 = SYSTEM-DESIGN charts (NO motion: code-rendered HTML/SVG stills screenshotted into
  the comp, movement only from comp-level spotlights/transitions). Each row: id · what moves (or which
  states/stills) · placement timecodes · build status.
- **"SLIDES build worklist"** — the CSS containers, in the TWO named slide types: **TITLE SLIDES** (NO box:
  eyebrow + serif headline with accent-colored key words + body on dark bg — container-reference's former
  "text variant") and **CARD SLIDES** (same anatomy INSIDE the rounded card box with top-accent line — the
  former "card variant"). Visual spec + locked stylesheet: `container-reference/README.md` +
  `container-canonical.css`. Each row: id · eyebrow/headline/content · placement · build status.
- The **RECEIPTS capture worklist** (when the plan has receipts) types every row **R(article) or R(other)**
  per `broll-and-containers.md` "Cover STYLE devices" §1 — article receipts carry the mandatory
  reading/motion treatment (push-in / single-image camera-move), other receipts are treatment-per-capture.

### ⛔ The IMAGES worklist carries a REFERENCE column (Mike, 2026-07-25 — root-caused, not a reminder)
**Every image row whose beat names a REAL, identifiable thing — a token, a project, a company, a person,
a product — MUST fill a `Reference` column**, whose value is either a concrete path or the explicit string
`none exists (generic approved)`. The shared library is
**`schedule-tweets/images/reference/`** (kaspa-logo, velvet, LAB, bittensor-tao, linea, michael-saylor, …);
if the mark is not there, source it and add it, or write the explicit no-reference note.

Why this column exists: on kaspa 30bps the row for the "58X on the Velvet Token" beat read *"themed coin,
NO invented logo/text"*. That guard was correct — it stops us fabricating fake branding — but the worklist
had nowhere to point at the REAL mark, and neither the plan nor the image-gen agent def mentioned that the
reference folder exists. So "don't invent a logo" silently became "produce a blank coin", twice, even though
`velvet.png` was sitting in the shared folder the whole time.

**Also fix the wording wherever it appears.** Write **"use the REAL mark from the reference image; never
invent one"** — never a bare "NO logo/text", which bans the symptom AND the cure. The prohibition is on
INVENTING branding, not on depicting a real brand we have a reference for.
(Both `smartmoney-backing-kaspa` and `Kaspa founder genius or over-rated` carry a BROLL-PLAN alongside the
prep file; `kaspa 30bps` is the first with the CHARTS + SLIDES sections.)

**The trap this prevents (kaspa-covenants, 2026-06-20→21):** a pre-record beat-table plan gets written as
`EDIT-PLAN.md` (no `-prep`), then nobody splits it into the event-log EDIT-PLAN + the layer-grouped CUE-SHEET, and
the mandatory TRANSITIONS section goes missing. If your `EDIT-PLAN.md` is still beat-tables, it is really the prep
file: **rename it `EDIT-PLAN-prep.md`**, and produce the event-log `EDIT-PLAN.md` + `CUE-SHEET.md` post-record.

---

## 1. EDIT-PLAN.md — a TIME-ORDERED EVENT LOG (not a beat table)
Every spoken line interleaved with every layer event that lands on it, in time order. **AUTHOR it by hand
from the word-level transcript + the placement plan, PRE-build (the §0 ⛔ ORDER note governs — the comp is
built TO this log).** The old "generate it from the comp with `_gen_editplan.js`" wording is LEGACY: a
generator run is only an optional as-built reconciliation after the comp exists, never how the plan is
authored (that wording caused the wrong "post-comp" call two videos running — Mike, 2026-07-24). The format
below is the source of truth, not any one project's script.

Format (one event per line, time-sorted):
```
0:00.0  [CAPTION] captions ON for this >5s face hold → 0:08.6 (montserrat 1-2 word)
0:00.0  [TRANSITION] face cut in — blocks-max glitch
0:00.0  SAY:  "Kaspa is proof of work done right."
0:02.0  [CONTAINER] C1 trade-off triangle (spotlight: KASPA all-three)
0:05.4  [VIDEO] vid-tunnel (dissolve, 3.8s)
0:30.4  [TRANSITION] CH2 book-flip · [IMPACT] Soundjay
...
```
- **Layers:** `SAY` · `IMAGE` · `VIDEO` · `CONTAINER` · `DIAGRAM` · `CHART` · `RECEIPT` · `LOGO` ·
  `TRANSITION` · `LIGHTLEAK` · `FILMBURN`/`GLITCH` · `RISER` · `IMPACT` · `CTA` · `CAPTION` · `CUT`.
- **Zero orphans:** every IMAGE/VIDEO/IMPACT/RISER asset appears here PLACED (with timecode) or marked
  `REJECTED`/`BENCH`. A file in `render-assets/` that's in neither is a bug.
- Header line names the watch file + that it's generated by `_gen_editplan.js`.

## 2. CUE-SHEET.md — LAYER-GROUPED watch-along
The same data grouped by LAYER, each a list of cue in-points ("begins"). One section per layer; each line is a
final timecode + the asset/sub-point. **FACE spans come from `blackdetect` on the baked spine** (COVER is baked
black, so the non-black gaps ARE the face windows — exact, not eyeballed):
`ffmpeg -i <spine> -vf blackdetect=d=0.15:pix_th=0.10 -an -f null -` → invert the reported black intervals.

**SELF-CONTAINED SKELETON — copy this, fill the rows, keep every section the video uses (the TRANSITIONS
section is MANDATORY; it was the thing missing on kaspa-covenants). Counts go in the header, e.g. "(5)":**
```
# <project> — WATCH-ALONG CUE SHEET  (reconciled to the spine)
> Watch file: `spine/<final>.mp4` (M:SS.s). Timecodes from the spine word-transcript + blackdetect FACE/COVER
> spans. Sibling of EDIT-PLAN.md (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect); `≈` = inside a merged transcript chunk (~±1s), frame-locks at comp.
> Ids: C-* container · D-* diagram · chart ids · R-* receipt · LT-* lower-third · BR-* b-roll · IMG-* photo.
> CH1 is first, nothing before it. [note any captions / inserts that shift final timecode]

## FACE spans (baked spine shows the face — face appears ONLY here)   <N> spans
- 0:00.0 → 0:04.9   CH1.B1 opener — "<anchor words>"   (a → b per span)

## TRANSITIONS (chapters + face + b-roll — MANDATORY)
THREE buckets: chapter cards = cube · AI stills = Bad Signal glitch · FACE cut-ins = Blocks·Max glitch ·
container/chart swaps = cross-fade + scale-in · Envato video = fade/dissolve.
CHAPTER cards (cube; ON only at a music-bed change):
- 1:10.7  CH2 — cube (+ bed change + 1s title-card pause)
FACE cut-ins (glitch id; at each black→face edge):
- 0:33.4 · 0:46.8 · ...     (0:00.0 = opens ON face, not a cut)
Intra-FACE punch-ins (FACE hold > ~2s → ~20% zoom, NO glitch):
- 6:22.7 → 6:43.5  PLUG — several zoom re-frames
VIDEO b-roll transitions (Envato = fade): - 0:11.0 BR-x · ...
AI clip / IMAGE b-roll transitions (Bad Signal glitch): - 0:18.0 CLIP-x · 0:24.2 BR-y · ...
CONTAINER / CHART scene changes = cross-fade + 0.93→1 scale-in (see CONTAINER section).

## CHAPTER cards begin  (ON only at a bed change)
- 0:00.0  CH1 "<title>" — NO card (first chapter) ;  1:10.7  CH2 "<title>" ; ...

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   <N>
- 0:07.2  C-RANK chart — <what it shows> `[VERIFY nums]`

## RECEIPTS / inserts begin
- 0:00.0  R-WP <what> ;  ~3:56 ⏸ R-TALK clip INSERT (audio up, bed ducks) + LT-x lower-third

## VIDEO b-roll begins  (Envato + AI clips)   <N>
- 0:11.0  BR-x (<beat>) — Envato fade

## IMAGE b-roll begins  (stills + photos)   <N> placed · <N> BENCH
- 0:04.9  IMG-YS portrait — "<line>"   ;   BENCH <ids> — place or REJECT

## LIGHT LEAKS (face holds > 5s — overlays.md, inset ~0.6s off the cut)
- 6:22.7 → 6:43.5  PLUG    (a → b per leak; short <5s face beats = glitch/punch only, NO leak)

## IMPACTS + RISERS (audio — mixed on with ffmpeg, NOT in comp)
- 0:04.9 · 0:07.2 ...  hype-reel impacts  ;  3:18.7 RISER → IMPACT — <reveal>

## MUSIC beds (bed · chapters · level · fades; license codes → YT description ONLY)
- 0:00.0 → 1:10.7  <Track> (loop to span) — CH1.  `<yt_license_code>`
- Bed changes (inter-bed breath) on the cards. Levels ~16-18 dB under VO (measure LUFS first).

## CAPTIONS  (none / which window)
## Open decisions that move these cues
```
- The **TRANSITIONS** section lists: every FACE cut-in (glitch id), every intra-FACE punch-in (short/strips +
  zoom), each b-roll transition TYPE (image = glitch, video = fade/dissolve), and chapter cube cards. (Bittensor
  called its face-cut transitions "FILM BURNS"; this track uses the glitch kit — same idea, list them.)

---

## Workflow (order per the §0 ⛔ ORDER note — plans FIRST, comp built TO them)
1. Transcribe the final spine (word-level).
2. Author `EDIT-PLAN.md` (event log) + `CUE-SHEET.md` (layer-grouped) off the transcript + placement plan.
3. Build the comp to the FULL spec, TO those plans (PRE-RENDER GATE in `../CLAUDE.md`).
4. Reconcile the comp against both before the render (zero orphans; a `_gen_editplan` run is an optional
   as-built reconciliation here). The render confirms; it never discovers.
