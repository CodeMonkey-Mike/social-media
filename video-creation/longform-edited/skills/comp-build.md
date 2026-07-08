# longform-edited · Remotion COMP build (canonical, self-contained)

How a heavily-edited 16:9 longform video is assembled in Remotion. **This skill is the source of truth and is
self-contained** — every load-bearing code pattern is embedded below as a skeleton, so a new video can be built
with NO files from any `media/<project>/` folder (those are deletable by the cleanup job). (Mike, 2026-06-30:
"imagine we delete the smartmoney project — how would we do the next video?")

**Worked references (non-authoritative, may be deleted):** the surviving comps in `video-creation/remotion/src/`
— `SmkFull.tsx` (full longform, the closest exemplar), `SmChartsAnim.tsx` (animated charts), `_kit.tsx`,
`transitions/`. If they are gone, build from the skeletons here. Companion skills: `edit-plan-and-cue-sheet.md`
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
  - **Envato VIDEO b-roll = fade** (opacity ~0.5s). **Container/chart swap = cross-fade + scale-in.**
  ```tsx
  const FilmBurn: React.FC<{frame:number}> = ({frame}) => { /* orange radial gradient, ~11f flash */ };
  ```

## 7. Animated data charts (`charts.md` — NEVER a PNG with a wipe)
Charts are **code-built React components that draw/grow/count via `useCurrentFrame`** (bars interpolate up,
numbers count). Pattern lives in `src/SmChartsAnim.tsx` (survives in src/). Values are `[VERIFY]` at render and
**never sourced from an image model**. A chart PNG held with a wipe is a GATE VIOLATION (`longform-edited.md` draft rule).

## 8. Captions (`captions.md`; OFF by default, opt-in per video)
```tsx
export const CAPTIONS: { t: number; h: string }[] = [ { t: 0.0, h: 'there' }, { t: 0.2, h: 'is' }, /* … */ ];
const CAPS = CAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));   // word-level, re-mapped
const CAPTION_WINDOWS = CAPTION_SRC.map(([a,b]) => [sh(a), sh(b)] as [number,number]);  // the face spans that get captions
const COVER_WINDOWS   = COVERS.map((c) => [sh(c.tIn), sh(c.tOut)] as [number,number]);
const Captions: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (!CAPTION_WINDOWS.some(([a,b]) => t>=a && t<b)) return null;     // ONLY inside the captioned face spans
  if (COVER_WINDOWS.some(([a,b]) => t>=a && t<b)) return null;        // NEVER over a cover / container / receipt
  const w = [...CAPS].reverse().find((c) => c.tf <= t && t < c.tf + 1.1);
  // … render `w.h`: montserrat preset 1 word/line (2 if <=4 chars), pop 0.7→1.12→1 over ~9f. Captions render TOPMOST (above light leak).
};
```
- Build the array with `video-creation/skills/captions/build_captions.py --transcribe <spine> --style <preset>`,
  fix the CORRECTIONS dict (Whisper mangles names/tickers), then gate to the windows per the video's caption policy.

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
2. Transcribe the paused spine (word-level). Build `CUE-SHEET.md` (sub-point timing) + `EDIT-PLAN-prep.md`.
3. Build the comp: `COVERS`, `CARDS`/`CARD_T`, `PUNCH_SRC`, `CAPTION_SRC`, `CAPTIONS`, wired through `sh()`/`F()`.
   Populate `render-assets/`. Build REAL animated charts + code containers.
4. Reconcile the comp to EDIT-PLAN/CUE-SHEET (zero orphans, every documented element present — the PRE-RENDER GATE).
   **Then run the MECHANICAL gate: `node skills/lint-covers.js <comp.tsx>` — it MUST exit 0** (enforces #12 no
   reused b-roll, #2 no clip >4s, captions-never-over-cover, in CODE). Do not render a comp that fails it. To allow
   a deliberate exception, flag the cover entry (`lead: true` for a ≤5s leading dolly, `cap: true` for captions over
   that cover) — the linter respects the flags, so exceptions are explicit, not silent.
5. Draft render (`--video-bitrate=200k`) → QA 10s chunks (motion+audio) per `video-qa.md` → fix → final render.
6. Generate `EDIT-PLAN.md` (event log) from the comp (`_gen_editplan` — see `_gen_editplan.example.js`). ffmpeg-mix music+SFX.

## 13. The per-video document set (every longform-edited video carries ALL of these)
A new `media/<project>/` folder should contain this full set — if one is missing, that's a gap to fill, not a
choice to skip. (Mike, 2026-06-30: "so future projects know to have these files." The smartmoney project carried
them all; it is deletable, so the set is recorded HERE.) Formats are canonical in the cited skills, not in any
project.
| File | What it is | Format owner |
|---|---|---|
| `SCREENPLAY.md` | the script (tagged FACE/COVER/SHOW lines) | `../screenplay.md` |
| `DATA.md` | chart-source index + market snapshot for every `[VERIFY]` number | `skills/charts.md` |
| `BROLL-PLAN.md` | b-roll acquisition worklist (prompts / Envato terms / status) | `edit-plan-and-cue-sheet.md` §0 |
| `EDIT-PLAN-prep.md` | pre-record beat-indexed plan (Layer model, every asset placed/REJECTED) | `edit-plan-and-cue-sheet.md` §0 |
| `CUE-SHEET.md` | layer-grouped watch-along, sub-point timing off the transcript | `edit-plan-and-cue-sheet.md` §2 |
| **`TRANSITIONS.md`** | **the per-video transition plan — how EVERY cut is bridged** | **§14 below** |
| `EDIT-PLAN.md` | post-comp time-ordered EVENT LOG (generated) | `edit-plan-and-cue-sheet.md` §1 |
| `PROJECT-LOG.md` | decision trail + resume pointer | (free-form) |

## 14. TRANSITIONS.md — the per-video transition plan (self-contained skeleton)
A short doc that PINS this video's transition choices so the build (and a picky review) has one place to check.
It applies §6's three-bucket policy to THIS video's cuts. Skeleton (fill the picks + per-cut list):
```
# <project> — TRANSITIONS plan
_Three-bucket policy (canonical: ../../assets/transitions/README.md + longform-edited.md #5). Glitch ids:
assets/transitions/library.json. Do NOT collapse all cuts into the glitch library._

## 1. Chapter / title cards → ONE pick for the whole video
This video = <cube|slide|flip|book-flip|swap>. Cards ON at: <CH#s with a music-bed change>. Self-contained
@remotion/transitions scene — never wrap the locked spine in TransitionSeries.

## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)
ChatGPT stills + the AI clip → random Cinematic Bad Signal (badsignal-short/max-*) on ingress.

## 3. Face + b-roll + containers → hand-rolled overlays on the spine (house rule #5)
- FACE cut in/out → <film burn | Blocks·Max glitch>  (the per-video pick) + ~15-20% punch-in on face beats >2s.
- Envato VIDEO b-roll → fade (~0.5s).   Container/diagram/chart swap → cross-fade + 0.93→1 scale-in.
```
