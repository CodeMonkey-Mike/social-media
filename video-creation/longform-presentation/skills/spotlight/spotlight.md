# longform-presentation / spotlight: the one-container-at-a-time presentation render

**What this skill is:** the track's Phase 4. After the as-filmed intro, the deck is re-rendered as a Remotion
video where **ONE deck container at a time is blown up to fill the 1920x1080 frame while Mike narrates it**, then
clears for the next, cued to his words. The as-filmed footage comes back for the close. This is the look Mike
approved on the QE video (2026-06-06, YouTube `N8LNdp2lfBg`: original footage to 0:31, spotlight containers to
5:30, original recap/CTA after) and asked for again on history-of-crypto (2026-10-13: "the entire video, after 30
seconds in, shows only specific cards about what I was talking about"). It is a **spotlight, never an accumulating
slideshow**: no two unrelated containers on screen at once (rejected twice, see `longform-edited.md` house rule 3).

When the whole slide reads at full-frame it may be shown as one unit (a declared row such as the three cycle
cards, a comparison), otherwise show the particular container he is talking about (Mike, 2026-10-13: "in some
cases we cannot show the entire slide like I had on the screen, but you can just show a particular container").

## Files

| file | role |
|---|---|
| `cue_scenes.py` | resolves the spec's cue phrases against the EDIT's word timings, plans the chapter pauses -> `<project>.scenes.resolved.json` + the comp data file |
| `spot_common.py` | the timeline helpers shared by the render + stitch (head/tail, chapter pauses, `middle_frames`, the paused middle-audio graph) |
| `render_spotlight.py` | renders the comp's middle window in frame-range parts (resume-safe, muted), or one audible probe chunk |
| `stitch.py` | EDIT head + parts + EDIT tail in ONE `filter_complex` pass, audio = the EDIT's own track (+ the pauses' silence), seam + pause frames for QA |
| `splice.py` | a FIX ROUND: diffs the previous resolved spec against the current one, re-renders only the windows that moved and splices them into the previous FINAL (video + re-cut audio) in one pass |
| `remotion/src/SpotlightPresentation.tsx` | the SHARED renderer (persisting infra like `LivestreamShort.tsx`; never recycled with a batch): scene kinds, entrance, timing |
| `remotion/src/<Comp>.tsx` + `<Comp>Data.ts` | per project: ~30 lines of theme + fonts, and the GENERATED data file (recycled with the project) |

Project files (all in `media/<project>/`): `<project>.scenes.json` (the spec, authored), `<project>.scenes.resolved.json`
(generated), `render-assets/` (the render `--public-dir`: only `middle-audio.m4a`), `_previews/` (parts, probes,
logs), `_qa/` (seam frames), `<project> FINAL-vN.mp4` (the deliverable).

## Preconditions

The spine is FINAL before any of this: defumble -> desilence (the track preset) -> transcribe the EDIT
(`scripts/transcribe.py`, medium, word-level) = `<project> EDIT.mp4` + `<project> EDIT.medium-words.json`.
The spotlight never touches audio; every `t` is an EDIT-timeline second.

## Procedure

**1. Author the scene spec** `media/<project>/<project>.scenes.json` from the deck HTML (container text + styles) and
the script (what he says). Shape:
```json
{ "project": "<name>", "comp": "<CompId>", "deck": "<deck>.html", "fps": 30, "chapter_pause": 1.0,
  "head_until": { "cue": "first words of the first narrated container" },
  "tail_from":  { "cue": "first words of the close that stays as filmed" },
  "scenes": [ { "id": "ch02", "kind": "chapter", "eyebrow": "...", "title": "...", "cue": "..." }, ... ] }
```
- **`chapter_pause`** (seconds, default none): a breath before EVERY chapter card. That much digital silence is
  inserted into the timeline in the quiet gap right before the chapter's first word, and the card comes up with
  the silence, so the viewer gets the title alone for a beat before the words start (Mike, 2026-10-14: "a nice
  pause, to not make the viewer hit with an endless flow of words ... the title of the new chapter can be on the
  screen during that pause"). 1.0 s on history-of-crypto, on top of the desilencer's 300 ms residual (so ~1.3 s of
  air). Per scene: `"pause": false` skips it, `"pause": 1.5` overrides it, `"pause_at": <EDIT s>` pins the insert
  point. The pauses are NOT baked into the EDIT file: the middle is rendered on the paused timeline and the
  stitcher inserts the matching silence into the audio (`spot_common.py` explains; one lossy generation, one
  transcript). If the first chapter's pause lands before `head_until`, the head shrinks to the pause.
- **One scene per container, in narration order.** A `chapter` card at every slide change (eyebrow + h2), then the
  slide's containers as he reaches them. A container may come back when the narration returns to it (a bullet
  column whose last bullet he saves for the end): that follows the deck's own order, it is not scattering.
- **Kinds** (the lecture deck's container vocabulary; extend `SpotlightPresentation.tsx` for a new deck family):
  `chapter` · `card` (tool-card: optional `icon`, `title`, `sub`) · `bullets` (`label`, `items[{strong, rest, cue?}]`,
  `active`) · `titem` (one timeline item: `date`, `title`) · `accent` (accent-card: `title`) · `cycle` /
  `cyclerow` (`num`, `peak`, `date`, `crash`) · `sma` (`variant` winter|bear, `label`, `title`) · `stat` ·
  `statement` · `nexttag`.
- **`cue` = 5 to 10 words he says when the container should appear**, lifted from the SCRIPT (he reads it, so the
  transcript is close); prefer distinctive words over numbers. A bullet item with its own `cue` becomes the
  highlighted (active) item from that moment; `active: N` pins the highlight for a container shown again.
- **A chapter's cue is the slide TITLE as he reads it aloud, not the script's first sentence.** Mike reads most
  slide titles ("The early days of Bitcoin, 2009 to 2012") before the first scripted line; the card (and its
  pause) must be up for that, otherwise the previous container sits under the title reading (v2 of
  history-of-crypto, 2026-10-14: "you leave the last snippet from the previous slide on the screen while I read
  the title"). Check the transcript just before each chapter's first sentence; where he did not read the title
  (ch02/ch03 there), the first sentence stays the cue. Keep the script line in `cue_first_sentence` for the record.
- A pinned `"t": <seconds>` on a scene or item beats its cue. Keep the deck's text verbatim (em dashes included:
  this is on-screen deck copy, not queue copy).

**2. Resolve the cues (and plan the pauses)**
```
python video-creation/longform-presentation/skills/spotlight/cue_scenes.py "media/<project>/<project>.scenes.json" \
    --words "media/<project>/<project> EDIT.medium-words.json" --edit "media/<project>/<project> EDIT.mp4" \
    --emit-ts video-creation/remotion/src/<Comp>Data.ts
```
Read the review table. Every `??` (score under 0.62) and every `!!` gets checked against the transcript text; fix a
wrong one by pinning `t` in the spec and re-running (never edit the words JSON). The `pause <id>` rows show where
each chapter pause was snapped (the quiet gap before the first word; a `!!` means no gap was found: pin
`pause_at`). The middle window (EDIT span + pauses) and its frame count are printed; `head_until` / `tail_from`
and the pause points are snapped to frame boundaries. The data file's times are on the PAUSED timeline (what the
comp renders); the resolved JSON keeps EDIT times plus a `timeline` block (`pauses`, `middle_frames`,
`tail_from_paused`) that the render and the stitch read.
Whisper medium can start the first word after a pause up to ~0.4 s LATE (ch09's "The crypto" on
history-of-crypto). A chapter card is immune, its pause is snapped into the measured quiet gap rather than onto
the word; a container that must land on a beat exactly gets a pinned `t` read off the waveform (the resolver's
`rms_bins`, or `video-creation/skills/burst-removal/scripts/burst_profile.py`), never a nudged words file.

**3. The project comp** (`remotion/src/<Comp>.tsx`, copy this shape; `history-of-crypto` was the first):
```tsx
import { loadFont as loadSyne } from '@remotion/google-fonts/Syne';      // the deck's fonts, limited weights
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { SpotlightPresentation, SpotTheme } from './SpotlightPresentation';
import { SCENES, HEAD_UNTIL, TAIL_FROM, FPS } from './<Comp>Data';
const syne = loadSyne('normal', { weights: ['700', '800'], subsets: ['latin'] });
const inter = loadInter('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });
export const THEME: SpotTheme = { /* the deck's :root tokens */ bg: '#0d0d0d', card: '#181818', border: '#222222', rule: '#1a1a1a',
  surface: '#141414', text: '#f0f0f0', muted: '#9a9a9a', veryMuted: '#444444', accent: '#F5A623', red: '#ff6b6b', blue: '#6b9fff',
  fontHead: `${syne.fontFamily}, sans-serif`, fontBody: `${inter.fontFamily}, sans-serif` };
export const X_FPS = FPS;  export const X_DUR = Math.round((TAIL_FROM - HEAD_UNTIL) * FPS);
export const <Comp>: React.FC = () => <SpotlightPresentation scenes={SCENES} theme={THEME} headUntil={HEAD_UNTIL} tailFrom={TAIL_FROM} audio="middle-audio.m4a" />;
```
Register it in `Root.tsx` (import + `<Composition id="<Comp>" ... durationInFrames={X_DUR} fps={X_FPS} width={1920}
height={1080} />`; keep the file's LF endings), then `npx tsc --noEmit -p .` (baseline: 11 node_modules errors, 0 in src).
Port the deck's palette and fonts, never the longform-edited container stylesheet: a presentation keeps its deck's look.
The next lecture of the same course (same deck family) copies `HistoryOfCryptoSpotlight.tsx` whole and changes only
the data import; the kinds list above already covers that deck. When a project folder is recycled its comp comes
out BY HAND (`<Comp>.tsx`, `<Comp>Data.ts`, the Root.tsx import + block): `cleanup/remotion_comps.py` recycles only
shorts families and protects everything else, the shared renderer included, so nothing here is ever removed for you.

**4. Probe before the full render.** Two or three cued chunks with sound:
```
python .../render_spotlight.py --project "media/<project>" --comp <Comp> --edit "media/<project>/<project> EDIT.mp4" --prep-audio
python .../render_spotlight.py --project "media/<project>" --comp <Comp> --frames 0-450 --with-audio
```
Contact-sheet the frames and LOOK: fonts loaded (not a fallback serif), emoji icons render, no text cut at the frame
edge or overflowing its box, the container changes on the cue word, the active bullet is the one he is on.
`cue_scenes.py --provisional` (no transcript yet, 6 s per scene) is for a styles-only pass over every container.

**5. Full render, in parts, detached.** `render_spotlight.py --project ... --comp ...` renders `<project>-middle-partNN.mp4`
in 9000-frame parts (the Windows handle ceiling kills a single long render at its final stitch), muted, crf 16,
`--public-dir` = the project's `render-assets/` (never `video-creation/assets`, multi-GB, copied into every bundle).
Launch it detached with a log (`Start-Process python ... -RedirectStandardOutput <log>`), poll the log; a killed run is
re-run and skips every verified part. The middle is the EDIT's span, not the master's: history-of-crypto's
48-minute master was 19:43 of EDIT after defumble + desilence = 34487 middle frames = 4 parts, 34 min at
concurrency 8 (8 to 9 min per 9000-frame part on this static deck).

**6. Stitch.** `python .../stitch.py --edit "<project> EDIT.mp4" --project "media/<project>" --out "media/<project>/<project> FINAL-v1.mp4"`.
It refuses unless the parts' frames sum to `timeline.middle_frames` exactly; then one libx264 crf 18 pass in
which the middle's audio is the EDIT's slices with each chapter pause's silence inserted (sample-exact, 8 ms
fades at the inserted edges). Check the printed duration (== the EDIT's + the pauses), A/V drift (< 50 ms), the
four seam frames and the one frame per pause (the chapter card, alone) in `_qa/`. Then spot-check a few cues
the way Mike's review questions come down to: for each, the frame 0.3 s BEFORE the cue time (the previous
container must still be up, nothing early) and 0.6 s AFTER it (the new one settled), labelled, on one contact
sheet (`ffmpeg -ss <t> -frames:v 1` per frame, `xstack` for the sheet; keep the sheets per version in `_qa/vN/`).

**7. Deliver** the absolute path; a new `-vN` filename every delivery, and at that moment copy the resolved spec
to `<project>.scenes.resolved.vN.json` (the base the next fix round diffs against). Expect review rounds
(history-of-crypto took three) and wait for them; the audio stays the raw EDIT track because Mike runs his own
enhancement pass after acceptance (track doc, "Delivery"). Not queued: the upload is his.

**8. A fix round = `splice.py`, never a full re-render** (the partial-replacement rule, Mike 2026-06-06 / 2026-08-01 /
2026-10-14: "re-render those little sections and put it back into the main video"). Before re-resolving, copy the
resolved spec the delivered FINAL was built from (`<project>.scenes.resolved.vN.json`); fix the spec (a cue, a pinned
`t`, a `pause_at`), run `cue_scenes.py` again (it rewrites the comp data file), then:
```
python .../splice.py --project "media/<project>" --comp <Comp> --edit "<project> EDIT.mp4" \
    --prev-resolved "<project>.scenes.resolved.vN.json" --prev-final "<project> FINAL-vN.mp4" \
    --out "<project> FINAL-vN+1.mp4" [--dry-run]
```
It lists every scene / item / pause whose paused time moved, merges them into windows (earliest start to the
latest start plus the 0.65 s entrance, plus the pause length for a moved pause, 0.25 s margin, frame-snapped),
renders only those comp frames, rebuilds each window's audio from the EDIT with the current pauses, and writes
the new FINAL in ONE `filter_complex` pass (the previous FINAL outside the windows). history-of-crypto v3: six
chapter cards moved 2 to 4.5 s earlier = 28 s re-rendered out of 1150. It refuses when head/tail or the total pause
time changed (the file length changes: that is a full `stitch.py`). QA: the window edge frames in `_qa/`, the
alignment check against the EDIT, and the moved cards on their new cue words.

## Rules

- **Spotlight, not slideshow.** One container at a time; entrance = 0.35 s cross-fade + 0.93 -> 1 scale-in; the
  previous container is gone before the next settles. A declared row (`cyclerow`) is one rhetorical unit.
- **Render only the replaced window; stitch the as-filmed head and tail with ffmpeg** (Mike, 2026-06-06). Never put
  the original footage through Remotion.
- **The deliverable's audio is the EDIT's audio**, untouched: parts render `--muted`, the stitcher slices the EDIT
  (plus exact silence for the chapter pauses, nothing else). A Remotion render's own AAC runs 43 to 90 ms late
  (measured 2026-10-02); it never reaches the deliverable.
- **A chapter gets a breath.** `chapter_pause` silence + the card alone before every chapter's first word (Mike,
  2026-10-14); the card then stays through the chapter's opening line until the next container cues.
- **`filter_complex` trim/concat only, never the concat demuxer** (the track's desync rule). Video is trimmed by
  FRAME NUMBER (`trim=start_frame/end_frame`), audio by sample-exact seconds at full precision: a boundary such as
  260.6667 s written as seconds lands on either side of the frame at 260.66667 depending on rounding, and the concat
  then pads audio to the longer video (the first v3 splice: +2 frames, 67 ms out of sync after the last window).
- **Head = as-filmed intro.** With a webcam PiP (QE) that is Mike on camera; with a deck-only capture
  (history-of-crypto, no PiP anywhere in the frame) it is the deck's title slide as recorded. Face cutaways
  (`video-creation/skills/gaze/`) exist only when there is a PiP to cut to.
- **Keep the deck's look.** Fonts, tokens and card chrome come from the deck HTML the recording used, so the spotlight
  containers read as the same deck, enlarged.

## History

- 2026-06-06 QE ("The Money Printer Has Been Running Since 1971"): first spotlight, `QeMoneyPrinter` comp (deleted after
  publish, the recipe survived only as prose in the track doc). Known inefficiency: it re-rendered the intro/outro too.
- 2026-10-13 history-of-crypto (Section 2 · Lecture 3, 48 min, deck-only capture): the recipe became this skill
  (shared renderer + cue resolver + part renderer + stitcher), the first video through it.
- 2026-10-14 history-of-crypto v2: Mike's review asked for a breath at every chapter change with the title alone on
  screen -> `chapter_pause` (planned by the resolver, rendered by the comp, silence inserted by the stitcher; the
  EDIT is never re-encoded for it). Same round: the desilence preset's tail pad went 100 -> 200 ms (word endings).
- 2026-10-14 history-of-crypto v3: the chapter cards came up after Mike had already read the slide title aloud ->
  chapter cues = the spoken titles, and `splice.py` (six 4 to 6 s windows re-rendered and spliced into v2). Also fixed:
  the pause trough is the LONGEST quiet run before the word, not the last one (a late Whisper word start had put
  ch09's pause inside "The crypto"). v3 ACCEPTED; uploaded to the Whop course 2026-10-14 (Section 2 · Lecture 3),
  the first finished video of this skill.
