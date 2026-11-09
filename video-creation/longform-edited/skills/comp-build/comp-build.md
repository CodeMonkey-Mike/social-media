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
/ `*Captions` files) and is recycled when its batch completes. Companion skills: `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md`
(the EDIT-PLAN/CUE-SHEET that drive the comp), `../charts/charts.md` (animated data charts), `../captions/captions.md`,
`../overlays/overlays.md`, `../broll-and-containers/broll-and-containers.md`, `../longform-edited.md` (house rules + the PRE-RENDER GATE).

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
- A **punch-in** is a hard ~15-20% `scale` step on the spine that lands ON a desilencer join inside a face window (`spine/jumpcuts-final.json`), with a LIBRARY light leak (`lib:lightleaks-*`, engine `LightLeaks`) peaking on the same frame (overlays.md section 1, Mike 2026-10-07). No join in the hold = no punch, no leak.
- **Kinetic-text devices** (`[KT-*]` rows in the EDIT-PLAN; the EFFECTS library `video-creation/assets/effects/library.json` is the catalog of record, each device = motion + sound + graphics, Mike 2026-10-25; overlays.md section 2 holds the longform-edited placement rules): built in the comp to the device row's numbers (panel slide 0.50 s ease-out, text rise 0.23 s later with the 80 -> 110 -> 100 overshoot, the hover; the pop's 0.20 s jiggle; the band, the list card, the icon pop, the subscribe close per their rows), above the cover layer and below the captions, with the video's palette and display font. Engines: the SHARED `src/effects/kinetic-text/` components (import them; `lint_comp_imports.py` whitelists `./effects/*`). A device with no shared engine yet is built in the project's own `<Project>Charts.tsx` to the row's numbers, never copied from another project's comp. On a face line the picture shifts toward the free side (`kt-side-panel`); on a cover the container is reframed into the free 55 percent. Their sounds (`[WHOOSH]` / `[ACCENT]` rows) are NOT in the comp: they ride the ffmpeg post-mix with the impacts (§9).

### 3a. ⛔ FACE REFRAME — STANDARD on every gated-face comp, MEASURED, never eyeballed (Mike, 2026-10-01)
Mike rarely sits dead centre and the camera leaves empty room above his head (golden-kitty: face 59% across, hair
top 29% down, 84 px pillar bars). So the spine never plays at its raw framing. EVERY comp applies ONE global
transform that puts his face on the horizontal centre, his eye line about 40% down the frame, leaves only a small
gap above his hair, and pushes any pillar / letter bars out of frame:
```
python video-creation/longform-edited/scripts/measure_face_reframe.py <media/<project>>
  -> assets/face-reframe.json { scale, x, y, centered, measured, windows } + _previews/qa/face-reframe/F<n>.jpg
```
It face-detects every FACE window of AS-RECORDED.md on the SOURCE spine and solves the smallest scale that
centres him AND still covers the whole frame (capped at 1.6; `centered: false` means the cap was hit: say so).
The comp declares the numbers verbatim and uses them on the spine:
```tsx
export const FACE_REFRAME = { scale: 1.359, x: -575, y: -370 };   // assets/face-reframe.json, never hand-tuned
const FACE_POINT = { x: 960, y: 432 };                            // where his face sits AFTER the reframe (json face_point_out)
<div style={{ position: 'absolute', inset: 0, overflow: 'hidden',
              transformOrigin: `${FACE_POINT.x}px ${FACE_POINT.y}px`, transform: `scale(${punch})` }}>   {/* punch-in, 1 -> ~1.18 */}
  <OffthreadVideo src={staticFile('spine.mp4')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080,
    transformOrigin: '0 0', transform: `translate(${FACE_REFRAME.x}px, ${FACE_REFRAME.y}px) scale(${FACE_REFRAME.scale})` }} />
</div>
```
- **Punch-ins scale about `FACE_POINT`**, on top of the base reframe: his face stays put and the frame stays covered.
- **Everything that shows the spine carries the same transform:** the live layer and every `SpineStill` a transition
  mounts (§6a rule 3).
- **A background-swap clip is PRE-FRAMED and plays full-frame, WITHOUT `FACE_REFRAME`** (§3b): its source was cropped
  to the measured reframe before it went to the model, so it comes back already centred and zoomed. Applying the
  transform again would zoom it twice. A still of a swapped face window pulls the swap clip (§6a rule 4), also untransformed.
- The transform sits on the whole spine layer; COVER spans are black, so it changes nothing there.
- **QA the previews** (`_previews/qa/face-reframe/F<n>.jpg`, one per FACE window). If `face_cx_spread` in the
  JSON is wider than about 8% of the frame he moved between takes: a per-window offset may be needed, flag it.
- **Gate:** `python skills/comp-build/lint_face_reframe.py <comp.tsx> <assets/face-reframe.json>` FAILS when the
  measurement is missing, the comp has no `FACE_REFRAME`, its numbers differ from the measurement, or the constant
  is declared but unused. A deliberate exception: `// FACE_REFRAME_WAIVED: <who, when, why>` in the comp.
- The VERTICAL cut has its own measured crop (`measure_face_crop.py`, vertical-repurpose.md §1b); this is the 16:9 one.

### 3b. FACE BACKGROUND SWAP (optional, Mike asks for it per video) — Higgsfield video-to-video, never a matte
_Self-contained recipe (prompt template, backdrop reference, costs, failure modes, the generate + join scripts): **`face-bg-swap.reference.md`** in this folder. Read it first; the steps below are the summary._
Mike's face footage is NEVER chroma-keyed or AI-matted (it wrecks his eyes). When he wants a new background behind
him on a short hero face scene, the scene is REGENERATED by Seedance from the footage (kaspa 30bps F1 2026-07-24;
golden-kitty F1 + F2 2026-10-02). The method, in order:
1. **Source clip:** `python scripts/build_face_swap_source.py <media/<project>> --window <a-b> --name F<n> --approx-src <s> --whole-seconds`
   -> `assets/face-swap/F<n>-raw-for-higgsfield.mp4` + `.json`. It takes the window's own frames off the FINAL spine (so the
   result lines up frame for frame), adds un-blacked handles from `<scope>.a.defumbled.mp4`, pre-crops to the measured
   reframe, and self-checks (frame count, no black frame). `--approx-src` = where the window starts on the defumbled
   spine (read it off its chunk map).
2. **`--whole-seconds` is mandatory.** Seedance takes an INTEGER `--duration` and STRETCHES a shorter reference to fill
   it: a 4.6 s clip came back about 7% slow and the lips drifted off the voice. The clip must be a whole number of
   seconds and `--duration` must equal it.
3. **Pass the real voice as `--audio-references`** (handle silence + the window's spine audio + tail silence, the same
   length as the clip). WITHOUT it the model invents gibberish speech and animates the lips to THAT; with it, the lips
   follow the real words. Verify: Whisper the returned clip's own audio and compare word times with the reference
   (within about 50 ms); the returned audio is then thrown away.
   **Build it with `python scripts/build_swap_voice_ref.py <media/<project>> F<n> [F<m> ...]`** (reads the source
   clip's JSON, writes `_previews/qa/bg-swap/F<n>-audio.mp3`, and FAILS unless the file is the clip length with silent
   handles; machine line `SWAP-VOICE-REF ok|FAIL`). It CONCATENATES real silence, never `adelay`: `[anullsrc head] +
   [atrim of the window off the final spine] + [anullsrc tail]` through one `concat`, cut to the clip length. An `adelay` build
   wrote a file with NO leading silence (speech at 0.04 s instead of at the head handle, and the file short by the
   handle), so the voice ran ahead of the picture it was sent with; 45 credits of generations were thrown away
   (golden-kitty F3 to F5, 2026-10-02). **Check before generating:** the file is exactly the clip length and the first
   speech sits at `window_starts_at_clip_s`.
   Seedance's shortest clip is 4 s: a window under about 3 s needs a longer handle (`--handle 0.9`) so the clip
   reaches 4 s.
4. **Generate:** `higgsfield generate create seedance_2_0 --prompt <keep the man exactly, replace ONLY the room> --video-references <clip> --image-references <backdrop reference> --audio-references <voice> --resolution 480p --duration <N> --aspect_ratio 16:9 --wait --json`. **480p ONLY** (hard rule). About 3 credits per second at 480p.
   **Say his clothing and the mic position in the prompt** ("keep the rust-red collarless henley, the microphone at the
   lower left") and, once one clip is approved, pass a frame of it as a second image reference so every window gets the
   SAME room. **Keep one generation to about 6 s or less:** an 11 s run redrew his shirt and changed his look (Mike
   rejected it, golden-kitty F1 v3). A longer window is cut into halves AT A DESILENCER JOIN inside it (the seam then
   sits on a jump cut that is already in the footage), each half built with step 1 and generated on its own.
5. **What comes back:** 864x496 at **24 fps**, the length asked for, with the model's OWN re-synthesised speech, paced
   differently from the real take (measured: in sync at first, up to 0.95 s late by the end of a long clip). The lips
   follow THAT audio, so the picture must be **re-timed onto the real voice, never just offset**:
   `python scripts/retime_swap_to_voice.py <returned.mp4> <real-voice.mp3> --out assets/face-swap/F<n>-higgsfield-bg-swap.mp4 --source-json assets/face-swap/F<n>-raw-for-higgsfield.json`
   (dynamic time warping on the loudness envelopes; output is video only at 30 fps). It must print `SWAP-RETIME ok`
   (leftover delay 60 ms or less, 90% or more of the speech windows locked, the window not past the clip end); a FAIL
   clip does not air. Halves are re-timed separately, then joined (first half up to its window end, second half from
   its window start) into ONE clip with a sidecar `F<n>-higgsfield-bg-swap.json` naming `window_starts_at_clip_s`.
   The comp lays the clip over the face window starting at `window_starts_at_clip_s` (the handle is thrown away),
   full-frame, no `FACE_REFRAME`, spine audio kept; the model relights him and bakes a slight push, so keep the comp's
   own punch-in subtle or drop it on a swapped window.
6. **QA before Mike sees it:** eyes and face edges on a frame from every second; HIS SHIRT AND THE MIC against the
   source frame; the retime proof above; and the desilencer joins inside the window (the model may smooth a jump cut).
   If a clip distorts him or changes how he looks, that window airs as recorded. Mike gates the backdrop and every clip.

### 3c. IMAGE MOTION CLIPS (optional, Mike asks for it per image) — a ChatGPT still animated by Seedance
When Mike wants a few of the video's ChatGPT images to move (golden-kitty G5 / G10 / G11, 2026-10-02): Seedance
image-to-video with the image as the first frame, a SLOW, simple move, nothing new in the frame.
- `higgsfield generate create seedance_2_0 --prompt <slow motion, what drifts, what stays still, keep the exact look, no text>
  --start-image assets/img/<IMG>.png --resolution 480p --duration 4 --aspect_ratio 16:9 --wait --json`. **480p ONLY**; 4 s is
  the shortest and covers an image slot (images hold under 4 s); 12 credits a clip.
- **Ask for a locked camera when the subject sits near the frame edge:** "a slow push in" pushed a raised trophy out of
  the top of the frame within 3 s. A push is fine on a centred subject.
- A 503 / 502 from `--wait` does NOT mean the job failed: check `higgsfield generate list --video --json` before
  re-running (the job usually exists and bills).
- Strip the audio (`-an -c:v copy`) -> `assets/img-motion/<IMG>-motion.mp4` (its own folder: `assets/img/` and
  `assets/vid/` are reconciled against the cover plan). 864x496 at 24 fps, 4.04 s. Open a frame sheet (first, two
  middle, last frame) before it is used: the subject intact and inside the frame on every one.
- Record each clip on its beat's `notes` in COVER-PLAN.json and in PROJECT-LOG `Open flags`. The comp plays the clip
  as a muted video cover in the image's slot (from clip 0, cut at the slot end, never stretched, no extra Ken Burns
  push on top); the still stays as the fallback and as the frame a transition still pulls. The clip counts against the
  ChatGPT image budget, not the Envato one.

### 3d. SPLICED CLIP INSERT (a clip with its OWN voice, the spine pauses) — 2026-10-08 every-job R17; standing since 2026-10-09
Rule + pipeline: **`../clip-inserts/clip-inserts.md`** (clip inserts are CONSIDERED on every video; "splice it in" means the
spine pauses, never a muted cover). When COVER-PLAN.json carries `clip_inserts[]`, the clip's picture AND voice become a
PAUSE in the spine, exactly like a title card but longer and with the clip's audio in the gap:
1. The clip carries its own audio: `assets/clip-inserts/CLIP-<n>-<slug>.mp4`, captured by `capture_clip_insert.py` (audio
   KEPT, context caption burned, Whisper-verified); `verify_assets` fails a silent one. Never re-use a muted receipt capture.
2. The graph's `card_pauses` node bakes it: `bake_card_pauses.py` for the cards, then
   `python scripts/bake_clip_insert.py <final spine> --cards-json spine/<scope>.<x>.paused.json --insert "<splice_at>:<clip.mp4>:<CLIP-n>" --out spine/<scope>.<y>.paused.mp4`
   reuses the snapped card pauses, SNAPS the splice point into a silence trough on the SOURCE spine (the lint's method; a
   point with no >= 30 ms trough FAILS: pick another sentence boundary, never cut mid-word; the `coverage` node already
   dry-runs every `splice_at` so this is caught at the PLAN gate) and renders ONE sync-safe concat: freeze + silence for
   each card, freeze + THE CLIP'S AUDIO for the insert. The sidecar lists `pauses[]` with a per-pause `dur` (cards = pause_s,
   the insert = the clip length), `clip` and `label`. The output is copied to `assets/spine.mp4`.
3. Comp: the pauses table IS the time map, `sh(t) = t + sum(dur for pauses with at <= t)`, `DUR` = the paused spine's
   frames; export `CARD_T` for the card rows and `INSERTS = [{at, dur}, ...]` for ALL pauses (`lint-pause-silence.py`).
   Over the insert's paused window play the clip FULL-FRAME, MUTED in the comp (its voice is in the VO), with the plan's
   `insert-in` / `insert-out` transitions (TRANSITIONS.md bucket `insert`, default `hand:fade` 0.5 s); the beat around the
   splice gets the EDIT-PLAN's lead-in / lead-out stills (the clip's FIRST frame held under the set-up line, its LAST frame
   under the resume line). Captions stay gated to Mike's FACE windows. The bg-swap / SpineStill rules of §3a-3b apply
   unchanged to the frozen spine frame under the pause.
4. Mix: `mix_music.py` reads `pauses[].dur` + `clip` and ducks every bed under a clip insert automatically (-14 dB, 0.3 s
   ramp); no manual automation row.
A muted cover is NOT a splice: Mike's "don't put his voice on mine, just splice it in" means the spine pauses (every-job,
the Huang clip, 2026-10-08; the muted draft had to be rebuilt).

## 4. COVER layer — one sequenced track (house rule #13: a container IS b-roll, never an underlay)
```tsx
type Cover = { tIn: number; tOut: number; kind: 'chart'|'still'|'vid'|'deck'|'receipt'|'showcase'; ref: string };
const COVERS: Cover[] = [
  { tIn: 4.9, tOut: 7.2, kind: 'still', ref: 'IMG-YS' },
  { tIn: 7.2, tOut: 11.0, kind: 'chart', ref: 'C-RANK' },
  { tIn: 11.0, tOut: 18.0, kind: 'vid', ref: 'BR-NETWORK-blocks' },
  // ... one row per COVER sub-beat, timed off the transcript (CUE-SHEET). Zero bare COVER beats.
];
// TALL capture: full width, slow top -> ~88% pan over the whole cover window (f is Sequence-relative, 0 at tIn).
const ShowcasePan: React.FC<{ file: string; durFrames: number }> = ({ file, durFrames }) => {
  const f = useCurrentFrame();
  const pos = interpolate(f, [10, durFrames - 10], [0, 88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + file + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${pos}%` }} /></AbsoluteFill>;
};
const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  switch (c.kind) {
    case 'chart':  return <ChartFor ref={c.ref} />;                                  // REAL animated chart (§7)
    case 'still':  return <Img src={staticFile('img/' + c.ref + '.png')} style={fill} />;   // + glitch on ingress (§6)
    case 'vid':    return <OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={fill} />;
    case 'deck':   return <Container id={c.ref} />;                                  // code-rendered, FILL THE FRAME (§5)
    case 'receipt':return <Img src={staticFile('receipts/' + c.ref + '.png')} style={fillTopWide} />; // full WIDTH, top-aligned
    case 'showcase':return <ShowcasePan file={c.ref} durFrames={F(c.tOut) - F(c.tIn)} />;          // tall page, slow vertical pan
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
  with the VO. Pattern: the `ShowcasePan` component in the skeleton above (`interpolate(f, [10, dur-10],
  [0, 88])` on `objectPosition: center N%`). **Standing use: the mid-roll PLUG — pan the CryptoRich
  showcase/results page while Mike talks receipts/multipliers** (worked on carry-trade over the "50x's and
  100x's" line; asset: `R-SHOWCASE-cryptorich`, re-capture fresh per video so the numbers are current). A
  static top-crop of a tall portrait capture is the failure mode this replaces (it zooms decorative
  whitespace and reads as broken b-roll — the carry-trade BIS-PDF lesson).
- `const fill = { width:'100%', height:'100%', objectFit:'cover' } as const;`

### 4b. WHITEBOARD beats (a hand-drawn scene clip as a cover) — 2026-11-01, left-behind first
Contract: **`video-creation/skills/whiteboard-beat/whiteboard-beat.md`**. COVER-PLAN `whiteboards[]` carries each beat
(15 to 30 s, its window on the final spine); the graph's `assets` node has `whiteboard-builder` build the scene comp,
`visual-qa` clear its stills, and `chunked-render` render it SILENT to **`assets/whiteboard/<id>.mp4`** (exactly the
window's frames at 30 fps). The comp never imports the scene component: it plays the rendered clip.
```tsx
// kind 'whiteboard': ref = the WB id, from = seconds into the clip (0 on the beat's first row)
{ tIn: 41.2, tOut: 61.0, kind: 'whiteboard', ref: 'WB1', from: 0 },
// a FACE line INSIDE a beat splits it; the second row continues the SAME clip (its clock runs with the spine):
{ tIn: 210.0, tOut: 218.4, kind: 'whiteboard', ref: 'WB4', from: 0 },
{ tIn: 221.1, tOut: 230.0, kind: 'whiteboard', ref: 'WB4', from: 11.1 },   // from = 221.1 - 210.0
case 'whiteboard': return <PaperSheet durFrames={F(c.tOut) - F(c.tIn)} first={!c.from} last={isLastRowOf(c)}>
  <OffthreadVideo src={staticFile('whiteboard/' + c.ref + '.mp4')} startFrom={Math.round((c.from ?? 0) * 30)} muted style={fill} />
</PaperSheet>;
```
- **The look in a dark video (whiteboard.md "Pen per video", option a, the default until Mike rules on the first
  stills / draft):** the paper scene IS the full frame, a "paper sheet" that comes in like a container: opacity (plus a
  small 0.97 → 1 scale) over the beat's FIRST 11 frames, out over its LAST 0.3 s; nothing inside the beat transitions
  (the drawing does the work). A continuation row after a FACE cut comes back with the face-cut-out move only.
- **Timing:** the clip's frame 0 is the beat's `tIn` on the source spine and `sh()` maps the row like any cover; the
  plan check forbids a title / clip-insert pause inside a beat, so the clip never drifts from the words.
- **Captions:** a whiteboard is a COVER: no captions over it (lint_covers' captions-never-over-cover rule; the drawing's
  labels carry it). **Sound:** silent clip; any draw-on tick / pop is an EDIT-PLAN SFX row hung on the beat's CUES
  (`assets/whiteboard/<id>.cues.md`), mixed in post like every SFX (§9).
- **Gate:** `lint_covers.py <comp> --plan COVER-PLAN.json` (verify_comp runs it): #2's 4 s cap does not apply, #12 holds
  except the FACE-split continuation above (`from:` must equal the row's offset, the beat spans <= 30 s), and every
  planned beat is placed at its planned `tIn`.

### 4c. SCREEN-SHARE face mode: the FACE BODY layer (longform-edited.md house rule #1b) — 2026-11-04, quant first
`run.py --face-mode screenshare` (GRAPH-PROGRESS.json `settings.face_mode`). A FACE window is Mike SHARING HIS SCREEN in the
binance OBS layout (deck area x 0 to 1464, his webcam + CTA box in the right column), played VERBATIM: **no face reframe**
(`export const FACE_REFRAME = { scale: 1, x: 0, y: 0 };` + `// FACE_REFRAME_WAIVED: screen-share face mode (Mike, 2026-11-04)`),
**no punch-ins, no light leaks, no captions**. The comp PAINTS the deck area with COVER-PLAN `face_body[]` (one or more rows per
FACE window, the graph's `_face_body_check` verified them: inside the window, a declared receipts / containers / whiteboards id).
The asset is the SAME 1920x1080 stage a cover would use (card PNG, diagram state, the animated chart component, a receipt, the
whiteboard clip): the layer scales it by 1464/1920 into the deck area, vertically centred on the page colour (no builder renders
a second canvas; Mike may rule on native deck-area cards later).
```tsx
export const DECK_AREA = { x: 0, y: 0, w: 1464, h: 1080 };            // the binance OBS geometry (house rule #1b)
const DECK_SCALE = DECK_AREA.w / 1920;                                 // 0.7625
const PAGE_BG = '#F7F9FC';                                             // the container stylesheet's page colour (theme + accent)
export const FACE_BODY: Cover[] = [                                    // COVER-PLAN face_body[], same kinds as COVERS
  { tIn: 0.0, tOut: 23.4, kind: 'receipt', ref: 'C9' },
  { tIn: 262.1, tOut: 268.0, kind: 'whiteboard', ref: 'WB11', from: 20.1 },   // the clip continues under the face, from = tIn - beat tIn
];
const FaceBodyEl: React.FC<{ c: Cover }> = ({ c }) => {
  const f = useCurrentFrame();                                         // the container entrance: 0.35 s fade + 0.97 -> 1 scale-in
  const a = interpolate(f, [0, 11], [0, 1], { extrapolateRight: 'clamp' });
  const s = interpolate(f, [0, 11], [0.97, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: DECK_AREA.x, top: DECK_AREA.y, width: DECK_AREA.w, height: DECK_AREA.h,
                  overflow: 'hidden', background: PAGE_BG, opacity: a, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
      <div style={{ position: 'absolute', left: 0, top: (DECK_AREA.h - 1080 * DECK_SCALE) / 2, width: 1920, height: 1080,
                    transformOrigin: '0 0', transform: `scale(${DECK_SCALE})` }}>
        <CoverEl c={c} />                                              // §4 / §4b: the same element a COVERS row renders
      </div>
    </div>
  );
};
// render, ABOVE the spine and BELOW the cover track, transitions and overlays:
{FACE_BODY.map((c, i) => (
  <Sequence key={'fb' + i} from={F(c.tIn)} durationInFrames={F(c.tOut) - F(c.tIn)}>
    <FaceBodyEl c={c} />
  </Sequence>
))}
```
- Rows are timed on the SOURCE spine like COVERS and route through `sh()`; a row never leaves its FACE window.
- A row's body change inside one window (card -> chart) is two consecutive rows, each with the entrance; the webcam column
  is never touched (`overflow: hidden` on the deck box is the whole clip).
- `lint_covers.py <comp> --plan COVER-PLAN.json` (verify_comp runs it) FAILS a FACE_BODY row outside a plan FACE window,
  overlapping a COVERS row or another FACE_BODY row, a planned `face_body` row not placed (same ref, same tIn, a whiteboard's
  `from`), and a plan with rows but no array.
- COVER beats are unchanged (black spine, full-frame covers); the cover->face / face->cover transition rows apply as usual.

## 5. Containers / diagrams (deck → code, spotlight one sub-point at a time)
Deck slides (`assets/deck/<deck>.html`) become **code-rendered React containers** that FILL THE FRAME and
**spotlight ONE sub-point at a time** off the CUE-SHEET (never the whole slide held; `../broll-and-containers/broll-and-containers.md`,
house rule #3). Text must be pixel-accurate (Convention 4) — code, not an AI image. Cross-fade + 0.93→1
scale-in on each container/sub-point swap (hand-rolled `interpolate`, NOT `TransitionSeries` on the spine).

**⛔ THE SPOTLIGHT CONTRACT (Mike, 2026-07-06 — recurring violation, now mechanical):**
- **Every container component takes a REQUIRED `state` prop** (which sub-point is lit), and **every `deck`
  COVERS row declares one** — `lint_covers.py` warns on a stateless deck row. The DEFAULT view of any
  multi-card container is **ONE card, enlarged, solo** (the thing being talked about RIGHT NOW).
- **A multi-card "overview" state is an explicit, deliberate choice** — legit only where the narration
  genuinely addresses all cards at once (an intro naming both, a "together they…" beat). Expect ~one
  overview per chapter, not the default. (Origin: carry-trade showed the whole two-lane slide through
  lane-specific narration; Mike: "show the CSS container for the lane being discussed.")
- **Consecutive same-ref rows are STATE SWAPS, not new covers: the ingress transition fires on ENTRY
  only.** The comp must suppress the glitch/transition on a contiguous same-ref row (`noGlitch` /
  prev-ref check) — a mid-slide transition into the same slide is the bug (carry-trade 2:53).
  `lint_covers.py` emits a STATE SWAP reminder at each such row.
- **Mid-face punch-ins / hits snap to desilencer JOINS** (`spine/jumpcuts-final.json`, written by
  `scripts/list_face_joins.py` from the defumbler spans + both desilencer maps, frame-exact): every join is a real
  jump-cut sitting in silence — a punch there lands between sentences, never mid-word. A face hold with NO internal
  join gets NO punch. **Each punch-in carries a LIBRARY light leak on the same frame** (`role: punch-leak`,
  `lib:lightleaks-*`, the video's rotated set of 3-4; overlays.md section 1, Mike 2026-10-07).
- **FACE STYLE `glitch` (per video, `run.py --face-style glitch`, Mike 2026-10-16, first on tao-detailed).** The video's
  `GRAPH-PROGRESS.json` `settings.face_style` swaps the two face moves: every cover→face CUT-IN plays the
  `face-cut` row's random **Split Swinging Offset** (`lib:split-swinging-offset-*`, the `GlassBeveled` engine, A = the outgoing
  cover, B = the spine), and every punch-in carries its `punch-glitch` row's random **Glitch Offset / Glitch Blocks**
  (`lib:glitchoffset-*` = `GlitchOffset`, `lib:blocks-*` = `GlitchBlocks`) centred ON the join, with the continuous spine as
  both A and B (the join is already in it), under the captions, the punch scale stepping on the join frame. No light leak
  on any punch. The face→cover cut-OUTS keep the video's face pick. EDIT-PLAN carries `[GLITCH]` instead of `[LIGHTLEAK]`.

- **FACE STYLE `optics` (per video, `run.py --face-style optics`, Mike 2026-11-03, first on bullish-on-kaspa).** Every cover→face
  CUT-IN plays its `face-cut` row's **ZOOM Optics** move (`lib:zoom-optics-in`, `-in-impact`, `-in-out-1/2/3`, `-out`, the
  `PerspectiveEase` engine, baked sound from the row, A = the outgoing cover, B = the reframed spine, the window centred on the
  face's first frame). Punch-ins keep their light leaks and the cut-OUTS keep the face pick, as in `leak`. A face that opens the
  video has no cut-in.

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
- **MOTION moves on a still cover (receipts first; Mike, 2026-10-17, tao-detailed).** The library's MOTION category
  (`motion-3d-pan-*` / `-offset-*` / `-orbit-*` 5 s camera moves, `motion-shake-3d-*` ~2.1 s baked wiggles; engines
  `Motion3D` / `MotionShake`, no SFX) is NOT a cut: it wraps ONE cover for its whole slot. EDIT-PLAN tag
  `[MOTION] lib:<id>` -> the COVERS row's `mo`. In the comp the engine (from `ENGINES[row.engine]`) gets the live cover
  (receipt + its push + overlays) as `outClip`, and its clock is set with `<Freeze frame={...}>` around it: a pan is
  fitted to the slot (`t * 5 / slot`), a shake PING-PONGS its baked wiggle so it never stops or jumps; rows of one
  capture (`grp`) sharing a `mo` run one continuous move. Worked example: `src/TaoDetailed.tsx` `MotionWrap`. Per-chapter
  theme: a `lights-out` chapter puts `motion-shake-3d-*` on most receipts (longform-edited.md section 7).
- **HIGHLIGHT on a receipt** (`[HIGHLIGHT]`, same day): a `#ffe14d` rect wiping left to right over the quoted words,
  drawn in CAPTURE coordinates inside the camera transform (so it rides the push) with `mixBlendMode: multiply`
  (black text stays black), starting on the word's onset.

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
     **And wrap that Freeze in `<Sequence from={0} layout="none">`.** Remotion 4.0.462's `<Freeze frame={n}>` sets the
     timeline to `n + the PARENT Sequence's from` and CLAMPS a timeline past the composition's last frame, so a
     `<Freeze frame={abs}>` mounted straight under a Sequence that starts after the video's midpoint (a face whip at
     2:00) silently freezes on frame `DUR - 1 - from`: a blacked cover frame (a black whip) or Mike's face from another
     minute. The zero-offset Sequence makes the parent offset 0 in ANY nesting (`TransitionClip` already nests its
     engine that way, which is why the light leaks were fine). growth-scale-up draft v1 (2026-10-28): 4 of 8 face whips
     broken (2 pure black for 0.43 s, 2 on a face from 1:11 / 0:12), every comp gate passed. Its `SpineFrozen` is the
     reference shape.
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
  identical except for the effect. Extract both and compare — that one check catches all four. Run it on EVERY
  face-side window (each face whip, leak, face-out), not a sample: the Freeze clamp above only bites past the midpoint.
- **⛔ A transition PLANNED in `TRANSITIONS.md` is not a transition WIRED in the comp**, and a wired one whose
  plates/tiles/SFX were never copied into the lean project `assets/transitions/` renders as a plain cut. Neither
  errors: the effect is just silently missing (ethereum-rwa shipped v6+v7 with `STILL_FX` declared but never
  referenced, and both badsignal TILE sets absent). **Gate: `python skills/comp-build/lint_transition_assets.py <comp.tsx>
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

## 7. Animated data charts (`../charts/charts.md` — NEVER a PNG with a wipe)
Charts are **code-built React components that draw/grow/count via `useCurrentFrame`** (bars interpolate up,
numbers count). The full method is in `../charts/charts.md` (self-contained; do NOT open an old chart comp). Values are
`[VERIFY]` at render and **never sourced from an image model**. A chart PNG held with a wipe is a GATE VIOLATION
(`longform-edited.md` draft rule).

## 8. Captions (`../captions/captions.md`; **ON by default — every longform ships captioned**)
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
  A video whose caption scope includes `envato` (`../captions/captions.md`, `run.py --caption-scope`) carries the
  Envato beats in CAPTION_WINDOWS: flag exactly those Envato covers `cap: true` (the sidecar's `cover_windows`).

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
- **Library transition SFX are levelled by MEASURED PEAK, not a fixed gain (Mike, 2026-10-17, tao-detailed: "I see the
  split transition, but I don't hear the sound").** The pack's SFX are mastered quietly (peaks -17 to -22 dBFS, means
  near -36), so the old fixed `--lib-sfx-db -9` put every whoosh about 30 dB under the voice: inaudible. `mix_music.py`
  now gains each so its peak lands at `--lib-sfx-peak` (default -13 dBFS); `--lib-sfx-db` stays as a fixed override.
- **A BRAAM sits in a BEAT PAUSE** (longform-edited.md section 7): `card_pauses` bakes `[BRAAM] ... spine pause <dur> s at
  <s>` as freeze + silence (`beat` in the sidecar, so INSERTS carries it and sh() shifts by it like any pause); the comp
  keeps the cover with the figures on screen through it, draws no card; the mixer starts the braam on the pause's first
  frame and does NOT duck the bed there. Through the pause the cover SLOWLY ZOOMS to the figure (Mike 2026-10-17): the
  COVERS row carries `bz: { x, y, s }` (the figure's point on the slide PNG, target scale ~2.4); the view eases
  (inOut sine) over exactly the pause's frames, moving that point to frame centre, and holds after. Worked example:
  `src/TaoDetailed.tsx` SlideView `bz` on K9.

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
  whiteboard/          WHITEBOARD beats: <WBn>.mp4 (the rendered silent clip, the only renderable) + <WBn>.brief.md
                       (the graph's brief) + <WBn>.cues.md (the builder's draw-on cues); the scene comps live in
                       remotion/src/whiteboard/beats/, their QA stills in _previews/qa/whiteboard/<WBn>/ (§4b)
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
  `%TEMP%/remotion-*` bundles (they are never cleaned up — 2.8 GB of them had accumulated). Since 2026-10-27 every render
  is CHUNKED (`video-creation/skills/chunked-render/`: 1-minute resumable chunks, a stall killed + retried, desktop
  notifications), which bounds the damage, checkpoints every minute and retires the ~frame-14436 stitch ceiling.
  When C: is short, point TEMP / TMP / TMPDIR and `--out` at D: (render_comp.py guards the drives it WRITES to).
- **⛔ NEVER cap the OffthreadVideo cache at 400 MB again (tao-detailed 2026-10-17: the FINAL shipped with stuttering
  b-roll).** The cap is split across the compositor's threads (400 MB = ~25 MB a thread = ~3 HD frames). Envato clips
  carry ONE keyframe per clip, so over a long render the cache pruned non-stop (109,692 prunes) and the compositor
  silently served the NEAREST cached frame: ~60% of b-roll frames were repeats (3-5 held, then a jump). A short test
  render never fills the cache and looks clean, so chunk QA cannot catch it. `render_comp.py` now defaults to
  `--ov-cache-mb 3072` (measured on frames 0-1200: 19-24 of 35 frames frozen at 400 MB, 0 at 4096 MB; lowered to 3072 on
  2026-10-20 as a memory trial, Mike: about 1 GB back while renders share the machine; check_broll_motion on the full render
  is the proof, and a FAIL at 3072 means back to 4096).
- **24 / 25 fps clips in a 30 fps comp judder** (one repeated frame every 5-6 frames on every pan): play them
  frame-for-frame (`playbackRate = 30 / clip fps`, 1.2x for 25, 1.25x for 24) when the clip covers slot x rate, or
  conform them at sourcing.
- **⛔ OUTPUT LOCATION IS MECHANICAL: the render mp4, any preflight still, AND the render log ALL go to
  `media/<project>/_previews/` (§10) — NEVER the bare `remotion/out/`.** `remotion/out/` is shared, cleanup-swept
  scratch: anything left there is an orphan with no project home (this is exactly how `_nlg_preflight.png` /
  `_nlg_draft_render.log` / `_qa_*.png` leaked and had to be recycled by hand, 2026-07-06). Always write outputs
  INTO the project's `_previews/` with the project prefix, so they travel with the folder and get recycled with the batch.
- `--video-bitrate=200k` = 0.2 Mbps draft (300k=0.3 was the old default; 200k is fine for a faster look-see).
- **The render's own AUDIO is not the VO you mix under.** A Remotion render's audio track runs 43 ms late against its
  picture from frame 0 (AAC priming) and steps to about 90 ms late by the end of an 8-minute video (measured on
  golden-kitty, 2026-10-02: +43 / +63 / +92 ms at 0 / 200 / 390 s, identical in the 16:9 render and in a vertical part).
  The picture is frame-exact. So `scripts/mix_music.py` takes the VO from `assets/spine.mp4` (the paused spine) by
  default and only falls back to the video's audio when no spine of the same length exists. Before this, every mixed
  final carried that lag (small, under most viewers' threshold, but real on the lip-synced face scenes).
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
1. Spine recorded → defumbled → cover-blackout (face-gate) → desilenced → card pauses (+ clip inserts, §3d) baked = the paused spine.
2. Transcribe the final spine (word-level). Author the FULL pre-build doc set off the transcript (all timecoded
   from it, NOT from the comp): `AS-RECORDED` · `DATA` · `BROLL-PLAN` · `TRANSITIONS` · `EDIT-PLAN-prep` ·
   **`EDIT-PLAN`** (time-ordered event log) · `CUE-SHEET` · `MUSIC-PLAN.json`. These ARE the blueprint the comp is built to.
2b. **⛔ PRE-BUILD GATE — run `python skills/doc-reference/lint_docset.py <track>/media/<project> --stage build` and it MUST exit 0 before ANY
   comp work.** (The graph's `lint_docset` node runs it; Python since 2026-09-28, the `.js` twin is frozen rollback.) It enforces the §13 doc set + the spine/ naming (§13a) + ordering in CODE, so a required doc can't
   be silently skipped (the pre-BUILD sibling of the §6b `lint_covers.py` pre-RENDER gate). Review every WARN.
3. Build the comp: `COVERS`, `CARDS`/`CARD_T`, `PUNCH_SRC`, `CAPTION_SRC`, `CAPTIONS`, wired through `sh()`/`F()`.
   Populate `assets/` (§10 merged layout). Build REAL animated charts + code containers.
4. Reconcile the comp to EDIT-PLAN/CUE-SHEET (zero orphans, every documented element present — the PRE-RENDER GATE).
   **Then run the MECHANICAL gate: `python skills/comp-build/lint_covers.py <comp.tsx>` — it MUST exit 0** (enforces #12 no
   reused b-roll, #2 no clip >4s, captions-never-over-cover, in CODE). Do not render a comp that fails it. To allow
   a deliberate exception, flag the cover entry (`lead: true` for a ≤5s leading dolly, `cap: true` for captions over
   that cover) — the linter respects the flags, so exceptions are explicit, not silent.
5. Draft render (`--video-bitrate=200k`) → QA 10s chunks (motion+audio) per `../video-qa/video-qa.md` → fix → final render.
6. ffmpeg-mix music+SFX. (⛔ The `EDIT-PLAN.md` event log + `CUE-SHEET.md` are authored PRE-build as the
   blueprint the comp is built TO — see `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0 ORDER note — NOT generated from the
   comp. The reconciliation is `lint_edit_plan.py` (2026-09-28); the old JS generator is retired.)

### 12a. ⛔ DEFINITION OF DONE — "complete" is a CLEANUP STEP, not just a thumbs-up (Mike, 2026-08-01)
The moment Mike says a video is complete/approved, the working folders **stop being allowed to exist**. He had
to ask for this on ethereum-rwa (*"Are you going to get rid of the previews folder and put the finalized video in
the root of the project directory?"*) — so run it unprompted, as the last action of the build:
1. **Promote the approved render to the project ROOT as `<slug>-FINAL.mp4`** (sibling convention:
   `kaspa-40bps-FINAL.mp4`; also `-VERTICAL.mp4` / `-SHORT-40s.mp4` for the derived cuts). The root carries the
   FINAL; `_previews/` only ever carries *attempts*. Drop the `-vN` / `-music` suffixes — versioning was for the
   review loop and is dead once one render wins.
2. **Rescue every working file the FINAL still DEPENDS ON, out of `_previews/` and `_tmp/` first.** Under the graph
   (2026-09-28) the mix needs NO rescue: it is code, `scripts/mix_music.py` + the project's `mix-audio.json`, re-run from
   `MUSIC-PLAN.json` on any re-cut. The trap below applies only to a HAND mix made outside the graph:
   the music bed lives as `_tmp/mix/*.flac` and is what a hand-written mix script re-applies on any later re-cut — recycling
   `_tmp` with the bed inside destroys it permanently once the un-mixed + mixed renders it was subtracted from
   are gone too. Bed → `media/<project>/music/bed-final.flac` (NOT `assets/`, which is the per-render
   `--public-dir` and would bundle it into every future render).
3. **Recycle `_previews/` and `_tmp/` in full** (every `-vN`, `-music`, smoke test, chunk, `patch/` splice
   segment, render log, QA frame). The graph's `stage_longform` node does this itself after it confirms the queue copy
   (`_recycle()` in `graph/longform_graph.py`, a PowerShell move to the Recycle Bin, never a hard delete); by hand, re-drive
   that node instead of deleting files yourself.
   On ethereum-rwa that was 2.0 GB + 66 MB for a 208 MB deliverable.
4. **Confirm the queue copy is intact BEFORE recycling** (`schedule-tweets/longform/<slug>/`), so the deliverable
   always exists in two places at the moment of deletion.
5. **Hand Mike the YOUTUBE METADATA BLOCK at every finalize, unprompted, and whenever he asks for "the metadata" of a
   finished project (Mike, 2026-10-20, evals; extended 2026-11-01, lets-get-rich):** the TITLE; a two-sentence
   DESCRIPTION whose FIRST sentence is an OPEN LOOP, then 2-3 HASHTAGS on their own line; the chapters with their
   timestamps on the FINAL cut; the music Content-ID codes on ONE line delimited by `|` with nothing else on it
   (e.g. `5WH8X4RII7CDAU05|BPXNBEIFIYKU8G88|...`); and the YouTube tags field: 10 keyword phrases + their COMMON
   MISSPELLINGS ("warren buffet", "crypto bare market", "bit coin"), inside YouTube's 500-character tag budget.
   `scripts/yt_delivery.py <media/<project>>` computes it (chapter times from the paused-spine sidecar, codes from
   `assets/music/library.json` `yt_license_code`) and writes `YT-DELIVERY.md`; the graph's `definition_of_done` node
   runs it and FAILS without it. The JUDGMENT half is `yt-delivery.json` at the project root, written by the main loop
   before finalize: `{"title", "description": [open loop, second sentence], "hashtags": [2-3], "chapters": {"CH1":
   "...", "CH6": "..."}, "keywords": [exactly 10], "misspellings": [3+]}` (the field rules and the open-loop example
   live in the script's docstring; it FAILS on a missing field, a dash, a day-relative word, a link or an over-budget
   tags field). Name the UNCARDED chapters (the hook and the close) from what Mike actually says there (carded chapters
   take the card label); keywords are search phrases a viewer would type, no hashtags, no em dashes. Paste the printed
   block into the finalize report exactly as printed (title, description + hashtags, chapters, the `|` line, then the
   tags field comma-separated). A project with no MUSIC-PLAN (a longform-presentation format) gives `chapter_stamps`
   and `music_track_ids` in the same file and runs the same script.
Note the repo-wide `cleanup/cleanup.js` (still JavaScript, not part of this track's graph) will NOT do this for you: its
`video-creation` policy is whole-project-folder and keyed to `batches.json`, so a project with no batch (a longform-edited
build is not a shorts batch) is "left alone" forever. The completion sweep is the graph's `stage_longform` node.

## 13. The per-video document set (every longform-edited video carries ALL of these)
A new `media/<project>/` folder should contain this full set — if one is missing, that's a gap to fill, not a
choice to skip. (Mike, 2026-06-30: "so future projects know to have these files." The smartmoney project carried
them all; it is deletable, so the set is recorded HERE.) Formats are canonical in the cited skills, not in any
project.
| File | What it is | Format owner |
|---|---|---|
| `SCREENPLAY.md` | the pre-production script (tagged FACE/COVER/SHOW lines) | `../screenplay.md` |
| `AS-RECORDED.md` | the as-BUILT, timecoded script derived from the FINAL-spine transcript. **Build the edit to THIS, not the screenplay, where they differ.** Carries the FACE windows + the script divergences (ad-libs / dropped / changed lines). Produced once the spine is transcribed. | `../screenplay.md` § "AS-RECORDED.md — the as-BUILT variant" (self-contained skeleton) |
| `DATA.md` | the **research dump** (every number carries a source) + do-not-air numbers + CHART-SOURCE INDEX + market snapshot for every `[VERIFY]` number. This IS the fact source the screenplay is written from. **Put verified research HERE — never in a separate `DOSSIER.md`** (that is an undocumented file; the research dump belongs in DATA.md per `../charts/charts.md` §1). | `skills/charts/charts.md` |
| `BROLL-PLAN.md` | b-roll acquisition worklist (prompts / Envato terms / status) | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0 |
| `EDIT-PLAN-prep.md` | pre-record beat-indexed plan (Layer model, every asset placed/REJECTED) | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0 |
| `CUE-SHEET.md` | layer-grouped watch-along, sub-point timing off the transcript | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §2 |
| **`TRANSITIONS.md`** | **the per-video transition plan — how EVERY cut is bridged** | **§14 below** |
| `EDIT-PLAN.md` | **PRE-BUILD** time-ordered EVENT LOG, authored off the word-level transcript AS SOON AS the spine is transcribed, BEFORE any comp work (§12/2 + the ⛔ ORDER note in `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0; `lint_edit_plan.py` is its code gate (the old JS as-built generator is retired, 2026-09-28) — this row previously said "post-comp generated" and caused the same wrong-order call two videos running, Mike 2026-07-24) | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1 |
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
- CLIP INSERT in / out → hand:fade 0.5 s (bucket `insert`, roles insert-in / insert-out), one pair per COVER-PLAN clip
  insert (a clip with its OWN voice at a spine pause, §3d); none when the video has no inserts.
- Envato VIDEO b-roll → fade (~0.5s).   TEXT-container swap → cross-fade + 0.93→1 scale-in (the quiet default).

## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)
ONE melt look (`lib:melt-rgb-*`) + ONE spin look (`lib:spin-3d-side-ease-*`) for the whole video, deployed ONLY
on the marquee diagram/chart beats (a small deliberate count, never sprayed). MELT = TRANSFORM (before→after /
re-highlighted callback of an earlier diagram). SPIN = NEW FACET (rotate a new contender/board in; echoes cube).
cover→cover full-frame; SFX ducks under the VO. Table: | TC | move | id | TRANSFORM-vs-NEWFACET why |. Everything
else stays §1-3. (Authored by the `transition-strategist` agent.)
```
