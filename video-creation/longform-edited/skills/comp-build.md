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
- The paused spine (face baked, COVER beats black, card pauses inserted) lives at the assets/ root (§10).
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
  card is a self-contained scene — **NEVER wrap the sync-locked spine in `TransitionSeries`.**
  ⛔ **A chapter title must be FULLY READABLE for at least 1 SECOND** (Mike, 2026-07-25: the card was
  "shown so fast, in under a second, that some people will hardly notice it"). The baked spine pause is
  only 1s and the turn-in eats ~0.4s of it, so the card scene must START BEFORE the pause, over the
  outgoing cover, and hold through it — `readable = lead + PAUSE - turn >= 1.0s`. Assert it in the comp
  so it cannot regress. Leading the card into the line that sets it up is better still: on kaspa 30bps
  the CH3 card comes up as he asks "so what actually is DAGKnight" and the title answers the question.
  Pair the card with a SHORT-tailed impact (see §9) — measure the audible tail, do not eyeball the
  filename.
  ⛔ **`@remotion/transitions` ships NO `cube` presentation** (only slide · flip · wipe · iris · clock-wipe ·
  zoom-blur · zoom-in-out), so a video that picks cube builds the hand-rolled rotateY turn below and tags it
  **`hand:cube-3d`, not `rmn:cube`** (verified 2026-07-25, kaspa 30bps — the plan said `rmn:cube` and there was
  nothing to import). Rotate the card IN over ~11 frames and HOLD it to the end of the pause; do not cube back
  OUT, or the card turns away to reveal the OUTGOING shot for a beat before the new chapter's visual cuts in.
  ```tsx
  const CubeCard: React.FC<{title:string; frame:number}> = ({title, frame}) => { /* rotateY 90→0 over ~11f, then hold */ };
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

### 6a. Placing a LIBRARY transition over the spine — the traps (kaspa 30bps 2026-07-25; ethereum-rwa 2026-08-01)
- **Give `TransitionClip` a Sequence of EXACTLY the engine window** (`from = F(cut) - win/2`,
  `durationInFrames = win`, `cutFrame = win/2`). It also renders a "clean head" and "clean tail" copy of the
  outgoing/incoming scenes outside that window; if the Sequence is longer, that tail copy paints a STALE
  frame over the live cover layer underneath (it showed up as a black frame right after a spin). Outside the
  window the normal cover track is the single source of truth.
- **Every node handed to an engine must read ONE ABSOLUTE clock, not `useCurrentFrame()`.** The engine
  re-mounts the same node inside several nested Sequences, so a node that times itself off the local frame
  freezes on whatever moment its innermost Sequence started at. Publish the composition frame through a React
  context at the comp root and read it in the cover/spine nodes; for the spine, `startFrom = absFrame -
  useCurrentFrame()` keeps it in sync in ANY nesting.
- **⛔ THE FACE-SIDE NODE: a "still" of the spine must be a FAITHFUL FREEZE of what actually AIRS.**
  Four separate bugs shipped into ethereum-rwa v6/v7/v8 from ONE sloppy `SpineStill`, and each was invisible
  until the previous one was fixed. Whatever you hand an engine for the face side of a cut must satisfy ALL
  four, so write it once and check the list:
  1. **A real `<Freeze frame={n}>` — NEVER `<OffthreadVideo startFrom={n}>`.** `startFrom` sets only the ENTRY
     point; the video then ADVANCES with the frame. On a **face-OUT** it walks straight off the end of the FACE
     window into the cover-blackout region and the outgoing face turns **BLACK one frame into the transition**.
     v7 shipped with Mike's face black at all 6 face-outs and every automated check passed.
  2. **`muted`.** Every `TransitionClip` mounts the node **TWICE** (outgoing + incoming, ~0.1s apart) on top of
     the live spine, so an unmuted copy replays the VO 2 more times slightly late. Mike heard it as a doubled
     word ("right" twice a few ms apart). It is inaudible on a still frame and only shows up on a listen or as
     ~0.5 dB of extra level vs the spine at that timestamp.
  3. **The same TRANSFORM as the live layer** (re-frame zoom / punch-in scale). A still that freezes the frame
     but not the scale snaps the picture back to 1.0 the instant the transition takes over (a visible 15%
     zoom-out), AND it flattens every re-frame snap: both sides of the glitch show the same scale, so the
     glitch fires over a zoom that never happens.
  4. **The same SOURCE as the live layer.** If the face beat airs from a background-swap / v2v clip rather than
     `spine.mp4`, the still must pull that clip (with its head-handle offset) or the backdrop pops to raw green
     screen for the length of the transition.
  Mechanically: the node is correct when a frame just BEFORE the engine window and a frame just INSIDE it are
  identical except for the effect. Extract both and compare — that one check catches all four.
- **⛔ A transition PLANNED in `TRANSITIONS.md` is not a transition WIRED in the comp**, and a wired one whose
  plates/tiles/SFX were never copied into the lean project `assets/transitions/` renders as a plain cut. Neither
  errors: the effect is just silently missing (ethereum-rwa shipped v6+v7 with `STILL_FX` declared but never
  referenced, and both badsignal TILE sets absent). **Gate: `node skills/lint-transition-assets.js <comp.tsx>
  <public-dir> [TRANSITIONS.md]`.** The trap it closes: engines read `plateDir`/`tileDir`/`maskDir` out of
  **`row.params`**, not off the row, so a hand-check of top-level keys passes while the render is broken.
  Deliberately superseding a planned id is fine — declare `// TRANSITIONS_WAIVED: <id> — reason` in the comp.
- **⛔ Cost trap — a library transition whose OUTGOING/INCOMING scene is a VIDEO can kill the render.**
  The footage engines wrap-tile every displaced copy, so a multi-offset move over a live clip fires
  dozens of simultaneous frame fetches for the same video; Remotion's proxy saturates and the render
  dies with `A delayRender() "Fetching …mp4" was called but not cleared after 28000ms`. It killed
  kaspa 30bps twice at the same beat (a SPIN out of an Envato clip). Mitigations, in order: `WrapLayer`
  now renders only the ≤2x2 tiles that can actually intersect the frame (was always 3x3 — pixel
  identical, less than half the requests); pass `--timeout=120000`; and prefer placing the reserved
  MELT/SPIN marquees between a video and a CODE chart/still rather than between two video clips.
  **⛔ The reliable fix, once a beat has failed twice, is to stop feeding the engine a video at all:**
  pre-extract the exact cut frame (`ffmpeg -ss <t_into_clip> -i clip.mp4 -frames:v 1 cut.jpg`) and hand
  the engine that STILL for the transition. Over a 0.44-0.88s turn a frozen source is invisible, and it
  collapses dozens of proxy requests into one. Keep a `CUTFRAME` map (ref -> still) in the comp and swap
  it in inside the transition node only — the cover layer still plays the live clip either side.
  Reduce `--concurrency` as well if it persists (3 was enough here). Add the still to the manifest.
  Lower-grade symptom of the same pressure: `EncodingError: The source image cannot be decoded` warnings.

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

### 7a. A Type 2 (system-design) still must NEVER sit dead still
It bakes no animation, so if the comp gives it no move it is a frozen frame for as long as it holds —
Mike caught a 17.8s one on kaspa 30bps ("was there meant to be any motion in that?"). Every such cover
gets either a gentle push or a spotlight that travels, and a long hold gets SPLIT into rows that move
between named regions (full view → push into the readout). **Watch the crop:** a FULL-diagram view can
only push ~4% before edge titles clip; deep pushes (1.2x+) belong only to rows that are deliberately
spotlighting one region, where losing the rest of the frame is the point.

## 9. Music + SFX = ffmpeg POST-mix, NOT in the comp
The comp renders VIDEO + the spine's VO audio only. Beds, risers, impacts, ducks, fades are mixed onto the
finished render with ffmpeg (`-c:v copy`, ~1 min, no re-render). Land each impact on its REAL reveal frame; a
riser ENDS on the hit (`assets/sfx/.../WHEN-TO-USE-IMPACTS.md`). Beds ~16-18 dB under VO (measure LUFS first).
- **⛔ The bed-gain formula is `gain_db = (VO_LUFS + target) - bed_LUFS`, where `target` is the NEGATIVE
  dB-under-VO** (-16, -18…). Writing it as `(VO - bed) - target` flips the sign and returns a POSITIVE
  gain — on kaspa 30bps that would have put the music ~32 dB too hot, over the voice. Always sanity-check:
  a mastered bed under a VO always needs a NEGATIVE gain. Verify after mixing by subtracting the un-mixed
  render from the mixed one to isolate the bed, then measure it against the VO.
- **Title-card / reveal impacts: pick by MEASURED audible tail, not by filename** (Mike, 2026-07-25: "make
  sure that we don't choose an impact with a long waveform"). File length is mostly trailing silence —
  measure where the envelope falls ~40 dB below peak. In this kit that is `Impacts/DSGNImpt-single_impact
  _sound_-Elevenlabs.mp3` at 1.15s, vs 2.3-3.8s for the rest.

## 10. assets layout + asset loading (MERGED — Mike, 2026-07-24: no separate render-assets/)
All comp assets load via `staticFile('<subdir>/<file>')`; the public dir is set PER-RENDER. Everything
project-local — comp INPUTS **and** the sources that generate them — lives in ONE folder,
`media/<project>/assets/` (NOT `video-creation/assets/`, which is shared/reused only). **The old split
(`render-assets/` inputs vs `assets/` sources) is RETIRED** (Mike: "they all get rendered; separating them
doesn't make much sense") — projects started before 2026-07-24 (zebec, tao, carry-trade, …) still carry the
old layout; do not migrate them retroactively.
```
assets/
  spine.mp4            the paused gated-face VO spine (face baked, COVER black, card pauses inserted)
  img/                 stills + photos        (still kind)
  vid/                 Envato/AI b-roll mp4s  (vid kind; AI clips silent — strip audio)
  title-slides/        TITLE SLIDE pngs (no-box type + state variants)
  card-slides/         CARD SLIDE pngs (boxed type + state variants)   (Mike 2026-07-24: slides split
                       by their two official type names, mirroring charts/ vs diagrams/)
  receipts/            web caps / receipts    (receipt + showcase kinds)
  charts/              Type 1 ANIMATED charts: their design-spec state PNGs + .html sources side by side
                       (the real animation is CODE in src/; the stills here are the spec + any used bitmaps)
  diagrams/            Type 2 SYSTEM-DESIGN charts (static stills, CHART(sysdesign)): state PNGs + .html
                       sources (Mike 2026-07-24: the two chart types live in separate folders)
  slide-sources/       containers.html + the screenshot driver (makes title-slides/ + card-slides/)
  transitions/         glitch library assets for TransitionClip
```
- The whole folder is the render's `--public-dir` and is copied to a temp bundle on EVERY render, so keep it
  lean: sources (.html/.css/.py drivers) are small and allowed to ride along; **outputs/previews (draft
  renders, chart tests) still go in `media/<project>/_previews/`, NEVER in `assets/`** (outputs are the real
  bundle bloat).
- **Zero-orphans reconcile scope:** the placed-or-REJECTED rule applies to RENDERABLE files
  (png/jpg/mp4/wav) in `assets/`; source files (.html/.css/.py/.json) are exempt — they generate the
  renderables, they don't appear in the comp.

## 11. Render command (bitrate is the ONLY draft knob — `longform-edited.md`)
```bash
cd video-creation/remotion
# Outputs go INTO the project's own media folder, NEVER the shared remotion/out/ scratch (§10).
# OUT is a sibling of assets/; mkdir -p it first. <track> = longform-edited | ai-engineering | ...
OUT="../<track>/media/<project>/_previews"; mkdir -p "$OUT"
# DRAFT (fast, light proxy — FULL feature set, low bitrate):
npx remotion render src/index.ts <CompId> "$OUT/<project>-draft-vN.mp4" \
  --video-bitrate=200k \
  --public-dir "../<track>/media/<project>/assets" \
  --log=verbose 2>&1 | tee "$OUT/<project>-draft-render.log"
# FINAL (quality):  swap --video-bitrate=200k for  --crf=18   (the two are mutually exclusive)
# ⛔ BEFORE any FINAL render: REMOVE the comp's build/WIP watermark (the corner tag naming batch+pass).
#    It is a draft-only aid with no auto-removal — it shipped in tao-render-virtuals FINAL v1's first 2s
#    (Mike caught it, 2026-07-19) and cost a first-chunk re-render + splice.
# Slice for QA chunks:  add  --frames=A-B   (the chunk mp4 + its extracted QA frames also land under $OUT — see video-qa.md STEP 0)
```
- **⛔ DISK: a render needs GIGABYTES free, and Windows gives no warning before it fails** (kaspa 30bps,
  2026-07-25: three renders died at `ENOSPC`). Every invocation copies the whole `--public-dir` to a fresh
  temp bundle (~370 MB there) AND Remotion's offthread video cache grows to whatever RAM allows (3.2 GB
  observed), which drags the pagefile with it. Before a long render: check free space, delete stale
  `%TEMP%/remotion-*` bundles (they are never cleaned up — 2.8 GB of them had accumulated), and cap the cache:
  `--concurrency=4 --offthreadvideo-cache-size-in-bytes=419430400`. Rendering in two `--frames=` halves also
  bounds the damage and gives a checkpoint (and is the same workaround as the ~frame-14436 stitch ceiling).
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
   Populate `assets/` (§10 merged layout). Build REAL animated charts + code containers.
4. Reconcile the comp to EDIT-PLAN/CUE-SHEET (zero orphans, every documented element present — the PRE-RENDER GATE).
   **Then run the MECHANICAL gate: `node skills/lint-covers.js <comp.tsx>` — it MUST exit 0** (enforces #12 no
   reused b-roll, #2 no clip >4s, captions-never-over-cover, in CODE). Do not render a comp that fails it. To allow
   a deliberate exception, flag the cover entry (`lead: true` for a ≤5s leading dolly, `cap: true` for captions over
   that cover) — the linter respects the flags, so exceptions are explicit, not silent.
5. Draft render (`--video-bitrate=200k`) → QA 10s chunks (motion+audio) per `video-qa.md` → fix → final render.
6. ffmpeg-mix music+SFX. (⛔ The `EDIT-PLAN.md` event log + `CUE-SHEET.md` are authored PRE-build as the
   blueprint the comp is built TO — see `edit-plan-and-cue-sheet.md` §0 ORDER note — NOT generated from the
   comp. Any `_gen_editplan` run is only an optional as-built reconciliation, never how the plan is authored.)

### 12a. ⛔ DEFINITION OF DONE — "complete" is a CLEANUP STEP, not just a thumbs-up (Mike, 2026-08-01)
The moment Mike says a video is complete/approved, the working folders **stop being allowed to exist**. He had
to ask for this on ethereum-rwa (*"Are you going to get rid of the previews folder and put the finalized video in
the root of the project directory?"*) — so run it unprompted, as the last action of the build:
1. **Promote the approved render to the project ROOT as `<slug>-FINAL.mp4`** (sibling convention:
   `kaspa-40bps-FINAL.mp4`; also `-VERTICAL.mp4` / `-SHORT-40s.mp4` for the derived cuts). The root carries the
   FINAL; `_previews/` only ever carries *attempts*. Drop the `-vN` / `-music` suffixes — versioning was for the
   review loop and is dead once one render wins.
2. **Rescue every working file the FINAL still DEPENDS ON, out of `_previews/` and `_tmp/` first.** The trap:
   the music bed lives as `_tmp/mix/*.flac` and is what `mix-music.sh` re-applies on any later re-cut — recycling
   `_tmp` with the bed inside destroys it permanently once the un-mixed + mixed renders it was subtracted from
   are gone too. Bed → `media/<project>/music/bed-final.flac` (NOT `assets/`, which is the per-render
   `--public-dir` and would bundle it into every future render).
3. **Recycle `_previews/` and `_tmp/` in full** (every `-vN`, `-music`, smoke test, chunk, `patch/` splice
   segment, render log, QA frame). Use `recyclePaths()` from `cleanup/lib.js` — Recycle Bin, never a hard delete.
   On ethereum-rwa that was 2.0 GB + 66 MB for a 208 MB deliverable.
4. **Confirm the queue copy is intact BEFORE recycling** (`schedule-tweets/longform/<slug>/`), so the deliverable
   always exists in two places at the moment of deletion.
Note `cleanup/cleanup.js` will NOT do this for you: its `video-creation` policy is whole-project-folder and
keyed to `batches.json`, so a project with no batch (a longform-edited build is not a shorts batch) is
"left alone" forever. The completion sweep is a manual step by design.

## 13. The per-video document set (every longform-edited video carries ALL of these)
A new `media/<project>/` folder should contain this full set — if one is missing, that's a gap to fill, not a
choice to skip. (Mike, 2026-06-30: "so future projects know to have these files." The smartmoney project carried
them all; it is deletable, so the set is recorded HERE.) Formats are canonical in the cited skills, not in any
project.
| File | What it is | Format owner |
|---|---|---|
| `SCREENPLAY.md` | the pre-production script (tagged FACE/COVER/SHOW lines) | `../screenplay.md` |
| `AS-RECORDED.md` | the as-BUILT, timecoded script derived from the FINAL-spine transcript. **Build the edit to THIS, not the screenplay, where they differ.** Carries the FACE windows + the script divergences (ad-libs / dropped / changed lines). Produced once the spine is transcribed. | `../screenplay.md` § "AS-RECORDED.md — the as-BUILT variant" (self-contained skeleton) |
| `DATA.md` | the **research dump** (every number carries a source) + do-not-air numbers + CHART-SOURCE INDEX + market snapshot for every `[VERIFY]` number. This IS the fact source the screenplay is written from. **Put verified research HERE — never in a separate `DOSSIER.md`** (that is an undocumented file; the research dump belongs in DATA.md per `charts.md` §1). | `skills/charts.md` |
| `BROLL-PLAN.md` | b-roll acquisition worklist (prompts / Envato terms / status) | `edit-plan-and-cue-sheet.md` §0 |
| `EDIT-PLAN-prep.md` | pre-record beat-indexed plan (Layer model, every asset placed/REJECTED) | `edit-plan-and-cue-sheet.md` §0 |
| `CUE-SHEET.md` | layer-grouped watch-along, sub-point timing off the transcript | `edit-plan-and-cue-sheet.md` §2 |
| **`TRANSITIONS.md`** | **the per-video transition plan — how EVERY cut is bridged** | **§14 below** |
| `EDIT-PLAN.md` | **PRE-BUILD** time-ordered EVENT LOG, authored off the word-level transcript AS SOON AS the spine is transcribed, BEFORE any comp work (§12/2 + the ⛔ ORDER note in `edit-plan-and-cue-sheet.md` §0; a `_gen_editplan` run is an optional as-built reconciliation only, never how it's authored — this row previously said "post-comp generated" and caused the same wrong-order call two videos running, Mike 2026-07-24) | `edit-plan-and-cue-sheet.md` §1 |
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
  assets/         comp INPUTS + their sources, MERGED (§10; Mike 2026-07-24, replaces the old render-assets/
                  split). The final paused spine is copied here as assets/spine.mp4.
  _previews/      draft / QA render outputs + logs (§11). NEVER in assets/ or the shared remotion/out/.
```
The naming scheme above IS the spec — it is self-contained, and a sibling project must never be consulted as
the reference (project folders are routinely deleted right after their video publishes, Mike 2026-07-31).

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
