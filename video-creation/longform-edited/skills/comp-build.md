# longform-edited · Remotion COMP build (canonical, self-contained)

How a heavily-edited 16:9 longform video is assembled in Remotion. **This skill is the source of truth and is
self-contained** — every load-bearing code pattern is embedded below as a skeleton, so a new video can be built
with NO files from any `media/<project>/` folder (those are deletable by the cleanup job). (Mike, 2026-06-30:
"imagine we delete the smartmoney project — how would we do the next video?")

**⛔ NEVER open a per-batch comp to copy from.** The skeletons in THIS skill are the ONLY authority for comp
structure, captions, and house style. Do NOT open `SmkFull.tsx`, `ClarityTest.tsx`, or any other
`video-creation/remotion/src/*.tsx` belonging to a finished video to "match the exemplar" — those are
outdated-format hazards (they drift, and the cleanup job DELETES a comp once its batch is completed). If a
pattern you need is not in these skeletons, that is a gap to ADD to this skill, not a comp to go read.

**The ONLY `remotion/src/` files that persist and may be imported are the shared-infra layer:** `_kit.tsx`
(shared comp kit), `transitions/` (engines + registry), and `LivestreamShort.tsx` (the shorts renderer).
Everything else in `src/` is a disposable per-batch comp (plus its private `constants-*` / `data*` / `*Charts`
/ `*Captions` files) and is recycled when its batch completes. Companion skills: `edit-plan-and-cue-sheet.md`
(the EDIT-PLAN/CUE-SHEET that drive the comp), `charts.md` (animated data charts), `captions.md`,
`overlays.md`, `broll-and-containers.md`, `../longform-edited.md` (house rules + the PRE-RENDER GATE).

---

## 0. The model in one paragraph
The recorded VO is **one continuous gated-face spine** (`OffthreadVideo`) — face baked visible on FACE beats,
black on COVER beats (the `cover-blackout` skill bakes that). You NEVER cut the spine; you lay layers OVER it,
each `Sequence`-windowed to the transcript: COVER visuals over the black beats, captions over the FACE beats,
transitions at the cuts, punch-ins on long face holds. Title-card chapter pauses are pre-baked into the spine
(a 1s freeze+silence per card), so every cue time is re-mapped through `sh()` to skip those pauses. **Music +
SFX are NOT in the comp** — they are ffmpeg-mixed onto the finished render, so an audio change never needs a
re-render. The comp outputs VIDEO + the spine's own VO audio.

## 1. Composition registration (`src/Root.tsx`)
```tsx
<Composition id="<CompId>" component={<CompId>} durationInFrames={<DUR>} fps={30} width={1920} height={1080} />
```
- 16:9 longform = **1920×1080, fps 30**. Export `<DUR>` + `FPS` from the comp file.
- `durationInFrames = round((spineSeconds + nCardPauses * 1.0) * 30)` (the paused spine is longer than the raw
  desilenced spine by 1s per chapter card).

## 2. Timing model — the `sh()` re-mapper (load-bearing; `feedback_shift_every_time_value_on_cut`)
Every cue time you write is a **source time** (the desilenced spine before card pauses). `sh()` shifts it to the
PAUSED spine. **EVERY time value routes through `sh()`/`F()` — covers, captions, punch-ins, music cues, hardcoded
constants — or it drifts.**
```tsx
export const FPS = 30;
const PAUSE = 1.0;                                   // 1s freeze+silence baked at each chapter card
const CARD_T = [/* source secs: mid-gap BEFORE each title-card chapter's first word */];
const sh        = (t: number) => t + PAUSE * CARD_T.filter((c) => c <= t).length;   // source → paused-spine secs
const cardStart = (b: number) => b + PAUSE * CARD_T.filter((c) => c <  b).length;   // a card's own start
const F         = (t: number) => Math.round(sh(t) * FPS);                            // source secs → frame
export const DUR = Math.round((SPINE_SECS + CARD_T.length * PAUSE) * FPS);
```
(If a video has cut-OUT windows — desilencer/fumble leftovers removed from the spine — add a `CUTS` array and a
multi-`Sequence` spine that skips each window; `sh()` then also subtracts cut durations. Most videos only need
the card-pause form above.)

## 3. The spine (the backbone)
```tsx
<OffthreadVideo src={staticFile('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
```
- The paused spine (face baked, COVER beats black, card pauses inserted) lives at the render-assets root.
- A **punch-in** zoom is a `scale` interpolation on the spine during `PUNCH` windows (face holds > ~2s): ~15-20%.

## 4. COVER layer — one sequenced track (house rule #13: a container IS b-roll, never an underlay)
```tsx
type Cover = { tIn: number; tOut: number; kind: 'chart'|'still'|'vid'|'deck'|'receipt'|'showcase'; ref: string };
const COVERS: Cover[] = [
  { tIn: 4.9, tOut: 7.2, kind: 'still', ref: 'IMG-YS' },
  { tIn: 7.2, tOut: 11.0, kind: 'chart', ref: 'C-RANK' },
  { tIn: 11.0, tOut: 18.0, kind: 'vid', ref: 'BR-NETWORK-blocks' },
  // ... one row per COVER sub-beat, timed off the transcript (CUE-SHEET). Zero bare COVER beats.
];
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'chart':  return <ChartFor ref={c.ref} />;                                  // REAL animated chart (§7)
    case 'still':  return <Img src={staticFile('img/' + c.ref + '.png')} style={fill} />;   // + glitch on ingress (§6)
    case 'vid':    return <OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={fill} />;
    case 'deck':   return <Container id={c.ref} />;                                  // code-rendered, FILL THE FRAME (§5)
    case 'receipt':return <Img src={staticFile('receipts/' + c.ref + '.png')} style={fillTopWide} />; // full WIDTH, top-aligned
    case 'showcase':return <Img src={staticFile('receipts/' + c.ref + '.png')} style={fill} />;
  }
};
// render:
{COVERS.map((c, i) => (
  <Sequence key={i} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn)}>
    <CoverEl c={c} />
  </Sequence>
))}
```
- **FILL THE FRAME** (house rule #1): containers/charts/receipts are large and content-body sized, never small
  cards in a dark box. Receipts (web caps) = full video WIDTH, top-aligned, readable.
- **TALL captures get a SLOW VERTICAL PAN, not a static crop (Mike, 2026-07-06 — liked it, reuse it).** A
  page capture taller than 16:9 (a site page, long article, results table) renders full-width with
  `objectPosition` animated `top → ~88%` across its whole cover window, so the viewer reads down the page
  with the VO. Pattern: the `ShowcasePan` component in `CarryTradeFull.tsx` (`interpolate(f, [10, dur-10],
  [0, 88])` on `objectPosition: center N%`). **Standing use: the mid-roll PLUG — pan the CryptoRich
  showcase/results page while Mike talks receipts/multipliers** (worked on carry-trade over the "50x's and
  100x's" line; asset: `R-SHOWCASE-cryptorich`, re-capture fresh per video so the numbers are current). A
  static top-crop of a tall portrait capture is the failure mode this replaces (it zooms decorative
  whitespace and reads as broken b-roll — the carry-trade BIS-PDF lesson).
- `const fill = { width:'100%', height:'100%', objectFit:'cover' } as const;`

## 5. Containers / diagrams (deck → code, spotlight one sub-point at a time)
Deck slides (`assets/deck/<deck>.html`) become **code-rendered React containers** that FILL THE FRAME and
**spotlight ONE sub-point at a time** off the CUE-SHEET (never the whole slide held; `broll-and-containers.md`,
house rule #3). Text must be pixel-accurate (Convention 4) — code, not an AI image. Cross-fade + 0.93→1
scale-in on each container/sub-point swap (hand-rolled `interpolate`, NOT `TransitionSeries` on the spine).

**⛔ THE SPOTLIGHT CONTRACT (Mike, 2026-07-06 — recurring violation, now mechanical):**
- **Every container component takes a REQUIRED `state` prop** (which sub-point is lit), and **every `deck`
  COVERS row declares one** — `lint-covers.js` warns on a stateless deck row. The DEFAULT view of any
  multi-card container is **ONE card, enlarged, solo** (the thing being talked about RIGHT NOW).
- **A multi-card "overview" state is an explicit, deliberate choice** — legit only where the narration
  genuinely addresses all cards at once (an intro naming both, a "together they…" beat). Expect ~one
  overview per chapter, not the default. (Origin: carry-trade showed the whole two-lane slide through
  lane-specific narration; Mike: "show the CSS container for the lane being discussed.")
- **Consecutive same-ref rows are STATE SWAPS, not new covers: the ingress transition fires on ENTRY
  only.** The comp must suppress the glitch/transition on a contiguous same-ref row (`noGlitch` /
  prev-ref check) — a mid-slide transition into the same slide is the bug (carry-trade 2:53).
  `lint-covers.js` emits a STATE SWAP reminder at each such row.
- **Mid-face punch-ins / hits snap to desilencer JOINS** (`spine/jumpcuts-final.json`, from the
  desilencer `--map-out` keeps): every join is a real jump-cut sitting in silence — a punch there lands
  between sentences, never mid-word. A face hold with NO internal join gets NO punch.

## 6. Transitions — THREE buckets (canonical: `../../assets/transitions/README.md`)
- **Chapter title cards → pick ONE per video** (this track's set: cube · slide · flip · book-flip · swap). The
  card is a self-contained scene via `@remotion/transitions` — **NEVER wrap the sync-locked spine in
  `TransitionSeries`.** Cube needs no special render flag (book-flip/swap do).
  ```tsx
  const CubeCard: React.FC<{title:string; frame:number}> = ({title, frame}) => { /* rotateY 90→0→-90 over ~42f */ };
  ```
- **Glitchy-fast hits → the glitch library** (`../../assets/transitions/library.json`): AI/atmosphere stills get
  a **random Cinematic Bad Signal** on ingress: `<TransitionClip id="badsignal-short-1" cutFrame={9} />`.
- **Face cuts + b-roll/container over the spine → hand-rolled overlays** (`interpolate`, never `TransitionSeries`):
  - **FACE cut in/out = PER-VIDEO PICK (decide once, use everywhere): film burn OR Blocks·Max glitch.**
    Film burn = warm radial flash ±0.38s (the standing default, `longform-edited.md` #5). Blocks·Max glitch =
    `blocks-max-*` on the cut to face (sanctioned per-video alternative, Mike 2026-06-20/30). On a face beat
    > ~2s add a ~15-20% **punch-in** zoom mid-beat (re-engage), short glitch optional. NEVER a plain cross-fade to face.
  - **Envato VIDEO b-roll = fade** (opacity ~0.5s). **TEXT-container swap = cross-fade + scale-in (the quiet default).**
  ```tsx
  const FilmBurn: React.FC<{frame:number}> = ({frame}) => { /* orange radial gradient, ~11f flash */ };
  ```
- **4th layer — DIAGRAM / CHART MARQUEES → reserved MELT + SPIN** (Mike, 2026-07-18): the library's **MELT**
  (`melt-rgb-*`/`melt-equidistant-*`, chromatic/spherical "reform") and **SPIN** (`spin-3d-side-ease-*` 3D turn ·
  `spin-twirl-*` vortex) families are deployed **only** on the handful of marquee system-diagram/chart beats, so
  those thesis moments read as motion-designed while text containers stay on the quiet cross-fade. Rules: **ONE
  melt look + ONE spin look per video** (like the single card pick); **MELT = TRANSFORM** (before→after, a
  re-highlighted callback of an earlier diagram — e.g. a constellation reforming into its superset variant);
  **SPIN = NEW FACET** (rotate a new contender's system-diagram / a verdict board in; 3D spin echoes a `cube`
  card). Reserve them — a small deliberate count, never sprayed. Placed via `TransitionClip` (cover→cover,
  full-frame so the spine never peeks); both carry SFX that **must duck under the continuing VO**. The
  `transition-strategist` agent (`.claude/agents/longform-edited/`) authors the whole plan incl. this layer.

## 7. Animated data charts (`charts.md` — NEVER a PNG with a wipe)
Charts are **code-built React components that draw/grow/count via `useCurrentFrame`** (bars interpolate up,
numbers count). The full method is in `charts.md` (self-contained; do NOT open an old chart comp). Values are
`[VERIFY]` at render and **never sourced from an image model**. A chart PNG held with a wipe is a GATE VIOLATION
(`longform-edited.md` draft rule).

## 8. Captions (`captions.md`; **ON by default — every longform ships captioned**)
**⛔ Captions are ON unless Mike EXPLICITLY says otherwise for a specific video.** (Corrected 2026-07-19:
this section previously said "OFF by default, opt-in" — prose that contradicted actual practice (zebec,
smk, every recent longform opted in), and tao-render-virtuals' doc set silently inherited the false default,
reaching Mike's draft review uncaptioned. Mike: "we're supposed to have them on. I never said not to have
them." A default is a decision-maker of last resort — it must match practice, and turning captions OFF is a
per-video Mike decision recorded in the CUE-SHEET as `CAPTIONS: OFF (Mike, <date>)`, never a bare default.)
**⛔ CAPTIONS COME FROM ONE PLACE — `skills/captions/build_captions.py`. NEVER hand-roll them, and NEVER copy an
old comp's inline caption block (Mike, 2026-07-12: I did exactly that on zebec — copied `SmkFull`'s inline
Arial-Black single-word captions — and shipped the wrong font + single words. Captions had NEVER broken before).**
- **DATA:** generate with `python video-creation/skills/captions/build_captions.py --words <spine-words.json>
  --style montserrat --max-words 2 --max-short 4` (longform-edited grouping = **2 words/line, up to 4 if every
  word is ≤4 chars** — this is why the reference reads "it up is a", not one word). It applies the brand
  CORRECTIONS + cleanup. Filter the emitted array to the caption windows; do NOT retype words by hand.
- **RENDER STYLE (self-contained below — do NOT open an old comp to copy it):**
  `fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif"` (LOAD Montserrat via `@remotion/google-fonts/Montserrat`),
  `fontWeight: 900`, `textTransform: 'lowercase'`, `WebkitTextStroke: '12px #000'`, `paintOrder: 'stroke fill'`,
  pop `scale 0.7→1.12→1`, bottom-center, TOPMOST. The font is **Montserrat** — Arial Black is only the fallback.
```tsx
// DATA is generated (above) into zebecCaptions.ts as ZCAPTIONS = [{t, h:'real companies.'}, {t, h:'tens of'}, …]
const CAPS = ZCAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));   // phrase-level, re-mapped
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_WINDOWS.some(([a,b]) => t>=a && t<b)) return null;     // only inside the caption windows
  let cur = null; for (const c of CAPS) { if (c.tf <= t) cur = c; else break; }
  const nextT = (CAPS.find((c) => c.tf > cur.tf) || {tf: Infinity}).tf;
  if (!cur || t >= Math.min(nextT, cur.tf + 1.3)) return null;        // hold until next phrase / clear on a gap
  // render cur.h with the Montserrat style above.
};
```
- A hook (0-31s over covers) or other over-cover caption window is a DELIBERATE per-video choice; the default is
  captions ONLY over the face spine (never over a cover). **The `captions-builder` agent runs this end to end.**

## 9. Music + SFX = ffmpeg POST-mix, NOT in the comp
The comp renders VIDEO + the spine's VO audio only. Beds, risers, impacts, ducks, fades are mixed onto the
finished render with ffmpeg (`-c:v copy`, ~1 min, no re-render). Land each impact on its REAL reveal frame; a
riser ENDS on the hit (`assets/sfx/.../WHEN-TO-USE-IMPACTS.md`). Beds ~16-18 dB under VO (measure LUFS first).

## 10. render-assets layout + asset loading
All comp assets load via `staticFile('<subdir>/<file>')`; the public dir is set PER-RENDER. Project render assets
live in `media/<project>/render-assets/` (NOT `video-creation/assets/`, which is shared/reused only):
```
render-assets/
  spine.mp4            the paused gated-face VO spine (face baked, COVER black, card pauses inserted)
  img/                 stills + photos        (still kind)
  vid/                 Envato/AI b-roll mp4s  (vid kind; AI clips silent — strip audio)
  deck/                container source / slide pngs if any
  receipts/            web caps / receipts    (receipt + showcase kinds)
  charts/              (chart data is code in src/; this holds any chart bitmaps if used)
  transitions/         glitch library assets for TransitionClip
```
- **INPUTS only.** `render-assets/` holds what the comp LOADS via `staticFile()` — it is copied to a temp bundle
  on EVERY render, so keep it small. **Animated charts are CODE** (`src/*.tsx`), not files: `charts/` stays empty
  unless a real bitmap is genuinely used. **Outputs/previews (draft renders, chart tests) go in
  `media/<project>/_previews/`, NEVER in `render-assets/`** (putting outputs there bloats every render's copy).

## 11. Render command (bitrate is the ONLY draft knob — `longform-edited.md`)
```bash
cd video-creation/remotion
# Outputs go INTO the project's own media folder, NEVER the shared remotion/out/ scratch (§10).
# OUT is a sibling of render-assets/; mkdir -p it first. <track> = longform-edited | ai-engineering | ...
OUT="../<track>/media/<project>/_previews"; mkdir -p "$OUT"
# DRAFT (fast, light proxy — FULL feature set, low bitrate):
npx remotion render src/index.ts <CompId> "$OUT/<project>-draft-vN.mp4" \
  --video-bitrate=200k \
  --public-dir "../<track>/media/<project>/render-assets" \
  --log=verbose 2>&1 | tee "$OUT/<project>-draft-render.log"
# FINAL (quality):  swap --video-bitrate=200k for  --crf=18   (the two are mutually exclusive)
# ⛔ BEFORE any FINAL render: REMOVE the comp's build/WIP watermark (the corner tag naming batch+pass).
#    It is a draft-only aid with no auto-removal — it shipped in tao-render-virtuals FINAL v1's first 2s
#    (Mike caught it, 2026-07-19) and cost a first-chunk re-render + splice.
# Slice for QA chunks:  add  --frames=A-B   (the chunk mp4 + its extracted QA frames also land under $OUT — see video-qa.md STEP 0)
```
- **⛔ OUTPUT LOCATION IS MECHANICAL: the render mp4, any preflight still, AND the render log ALL go to
  `media/<project>/_previews/` (§10) — NEVER the bare `remotion/out/`.** `remotion/out/` is shared, cleanup-swept
  scratch: anything left there is an orphan with no project home (this is exactly how `_nlg_preflight.png` /
  `_nlg_draft_render.log` / `_qa_*.png` leaked and had to be recycled by hand, 2026-07-06). Always write outputs
  INTO the project's `_previews/` with the project prefix, so they travel with the folder and get recycled with the batch.
- `--video-bitrate=200k` = 0.2 Mbps draft (300k=0.3 was the old default; 200k is fine for a faster look-see).
  `--video-bitrate` and `--crf` are mutually exclusive — pick one.
- Omitting `--public-dir` → assets don't resolve. Concurrency 8 (`remotion.config.ts`); Windows = CPU h264 encode
  (no GPU); bottleneck is spine `OffthreadVideo` decode (~40 min for a 14-min final; a draft/slice is far faster).
- **A "draft" is the FULL build at low bitrate, NEVER a reduced feature set** (`longform-edited.md` HARD RULE).
- **⛔ DELIVERY = a NEW `-vN` filename + the ABSOLUTE Windows path, every time (Mike, 2026-07-06).** Never
  overwrite the file Mike is reviewing — a revision rendered onto the same filename is invisible to him
  (same name in his player/Explorer, no way to tell v1 from v2; this broke the carry-trade v2 handoff).
  Render/mix to `<project>-draft-vN.mp4`, bump N on every delivery, keep prior versions until he approves
  (then recycle the stale ones), and hand him the FULL absolute path (e.g. `C:\Users\...\renders\...-v2.mp4`)
  in the delivery message — never just a repo-relative path (`feedback_state_path_when_opening`).

## 12. Workflow
1. Spine recorded → defumbled → cover-blackout (face-gate) → desilenced → card pauses inserted = the paused spine.
2. Transcribe the final spine (word-level). Author the FULL pre-build doc set off the transcript (all timecoded
   from it, NOT from the comp): `AS-RECORDED` · `DATA` · `BROLL-PLAN` · `TRANSITIONS` · `EDIT-PLAN-prep` ·
   **`EDIT-PLAN`** (time-ordered event log) · `CUE-SHEET` · `MUSIC-PLAN.json`. These ARE the blueprint the comp is built to.
2b. **⛔ PRE-BUILD GATE — run `node skills/lint-docset.js <track>/media/<project>` and it MUST exit 0 before ANY
   comp work.** It enforces the §13 doc set + the spine/ naming (§13a) + ordering in CODE, so a required doc can't
   be silently skipped (the pre-BUILD sibling of the §6b `lint-covers.js` pre-RENDER gate). Review every WARN.
3. Build the comp: `COVERS`, `CARDS`/`CARD_T`, `PUNCH_SRC`, `CAPTION_SRC`, `CAPTIONS`, wired through `sh()`/`F()`.
   Populate `render-assets/`. Build REAL animated charts + code containers.
4. Reconcile the comp to EDIT-PLAN/CUE-SHEET (zero orphans, every documented element present — the PRE-RENDER GATE).
   **Then run the MECHANICAL gate: `node skills/lint-covers.js <comp.tsx>` — it MUST exit 0** (enforces #12 no
   reused b-roll, #2 no clip >4s, captions-never-over-cover, in CODE). Do not render a comp that fails it. To allow
   a deliberate exception, flag the cover entry (`lead: true` for a ≤5s leading dolly, `cap: true` for captions over
   that cover) — the linter respects the flags, so exceptions are explicit, not silent.
5. Draft render (`--video-bitrate=200k`) → QA 10s chunks (motion+audio) per `video-qa.md` → fix → final render.
6. ffmpeg-mix music+SFX. (⛔ The `EDIT-PLAN.md` event log + `CUE-SHEET.md` are authored PRE-build as the
   blueprint the comp is built TO — see `edit-plan-and-cue-sheet.md` §0 ORDER note — NOT generated from the
   comp. Any `_gen_editplan` run is only an optional as-built reconciliation, never how the plan is authored.)

## 13. The per-video document set (every longform-edited video carries ALL of these)
A new `media/<project>/` folder should contain this full set — if one is missing, that's a gap to fill, not a
choice to skip. (Mike, 2026-06-30: "so future projects know to have these files." The smartmoney project carried
them all; it is deletable, so the set is recorded HERE.) Formats are canonical in the cited skills, not in any
project.
| File | What it is | Format owner |
|---|---|---|
| `SCREENPLAY.md` | the pre-production script (tagged FACE/COVER/SHOW lines) | `../screenplay.md` |
| `AS-RECORDED.md` | the as-BUILT, timecoded script derived from the FINAL-spine transcript. **Build the edit to THIS, not the screenplay, where they differ.** Carries the FACE windows + the script divergences (ad-libs / dropped / changed lines). Produced once the spine is transcribed. | `../screenplay.md` (as-built variant); exemplar `media/zebec/AS-RECORDED.md` |
| `DATA.md` | the **research dump** (every number carries a source) + do-not-air numbers + CHART-SOURCE INDEX + market snapshot for every `[VERIFY]` number. This IS the fact source the screenplay is written from. **Put verified research HERE — never in a separate `DOSSIER.md`** (that is an undocumented file; the research dump belongs in DATA.md per `charts.md` §1). | `skills/charts.md` |
| `BROLL-PLAN.md` | b-roll acquisition worklist (prompts / Envato terms / status) | `edit-plan-and-cue-sheet.md` §0 |
| `EDIT-PLAN-prep.md` | pre-record beat-indexed plan (Layer model, every asset placed/REJECTED) | `edit-plan-and-cue-sheet.md` §0 |
| `CUE-SHEET.md` | layer-grouped watch-along, sub-point timing off the transcript | `edit-plan-and-cue-sheet.md` §2 |
| **`TRANSITIONS.md`** | **the per-video transition plan — how EVERY cut is bridged** | **§14 below** |
| `EDIT-PLAN.md` | post-comp time-ordered EVENT LOG (generated) | `edit-plan-and-cue-sheet.md` §1 |
| `PROJECT-LOG.md` | decision trail + resume pointer | (free-form) |

### 13a. The per-video FOLDER layout — where masters, spine-prep, and outputs live (FIXED location + naming)
The docs above sit at the `media/<project>/` root; the media assets live in these SUBFOLDERS. **The spine-prep
intermediates have a FIXED folder AND a FIXED naming scheme — write them here, with these names, so every project
reads the same way and Mike can identify each stage on sight.** (This was undocumented and drifted — outputs landed
loose in the project root with ad-hoc names; recorded HERE now so it can't recur.)
```
media/<project>/
  raw/            camera masters ONLY (the .mkv/.mp4 straight off OBS). NEVER edit/delete — deletions go to the Recycle Bin.
  spine/          ALL spine-prep intermediates (the defumble -> blackout -> desilence -> pause chain), each named:
                      <segment>.<letter>.<stage>.<ext>
                  - segment = the recorded take's chapter range (CH1-CH3, CH4-CH7, ...), or ALL for the joined full spine.
                  - letters run IN PIPELINE ORDER (insert a new letter for any extra cleanup step):
                      a.defumbled    (+ sidecars  ._chunkmap.json/.txt , .mp4.spans.json )   <- defumbler
                      b.blackout     (+ .mp4.cover.json = the FACE/COVER map )                <- cover-blackout
                      c.desilenced   (+ .map.json = the cut/keep map )                        <- desilencer (at the stated min-silence)
                      d.paused       (+ .paused.json )  card-pause spine (+1s per chapter card)
                    (burst-removal / a re-desilence insert their own next letter, e.g. d.cleaned -> e.desilenced -> f.final.)
                  - MULTI-TAKE recordings: name each take by its range, process each through the chain, then JOIN to
                    ALL (sync-safe `filter_complex`, NEVER the concat-demuxer) -> ALL.c.desilenced.mp4.
  render-assets/  comp INPUTS only (§10). The final paused spine is copied here as render-assets/spine.mp4.
  _previews/      draft / QA render outputs + logs (§11). NEVER in render-assets/ or the shared remotion/out/.
```
Exemplar folders to copy the naming from: `media/carry-trade/spine/` and `media/Kaspa founder genius or over-rated/spine/`.

## 14. TRANSITIONS.md — the per-video transition plan (self-contained skeleton)
A short doc that PINS this video's transition choices so the build (and a picky review) has one place to check.
It applies §6's three-bucket policy to THIS video's cuts. Skeleton (fill the picks + per-cut list):
```
# <project> — TRANSITIONS plan
_Three-bucket policy (canonical: ../../assets/transitions/README.md + longform-edited.md #5). Glitch ids:
assets/transitions/library.json. Do NOT collapse all cuts into the glitch library._

**Transition SOURCE prefix (tag EVERY transition in TRANSITIONS.md / EDIT-PLAN-prep / CUE-SHEET / EDIT-PLAN so a
reviewer can tell the source at a glance — Mike, 2026-07-10):**
- `rmn:` 📦 = out-of-the-box `@remotion/transitions` (slide, fade, iris, cube…).
- `lib:` 🧩 = OURS, from the transition library (`../../assets/transitions/library.json`), e.g. `lib:badsignal-short-1`.
- `hand:` ✋ = hand-rolled overlay code (film-burn, xfade+scale, punch-in, pop — not a package/library).
The three prefixes = the three buckets below; a bare transition name (no prefix) is a gap to fix.

## 1. Chapter / title cards → ONE pick for the whole video
This video = <cube|slide|flip|book-flip|swap>. Cards ON at: <CH#s with a music-bed change>. Self-contained
@remotion/transitions scene — never wrap the locked spine in TransitionSeries.

## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)
ChatGPT stills + the AI clip → random Cinematic Bad Signal (badsignal-short/max-*) on ingress.

## 3. Face + b-roll + TEXT-containers → hand-rolled overlays on the spine (house rule #5)
- FACE cut in/out → <film burn | Blocks·Max glitch>  (the per-video pick) + ~15-20% punch-in on face beats >2s.
- Envato VIDEO b-roll → fade (~0.5s).   TEXT-container swap → cross-fade + 0.93→1 scale-in (the quiet default).

## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)
ONE melt look (`lib:melt-rgb-*`) + ONE spin look (`lib:spin-3d-side-ease-*`) for the whole video, deployed ONLY
on the marquee diagram/chart beats (a small deliberate count, never sprayed). MELT = TRANSFORM (before→after /
re-highlighted callback of an earlier diagram). SPIN = NEW FACET (rotate a new contender/board in; echoes cube).
cover→cover full-frame; SFX ducks under the VO. Table: | TC | move | id | TRANSFORM-vs-NEWFACET why |. Everything
else stays §1-3. (Authored by the `transition-strategist` agent.)
```
