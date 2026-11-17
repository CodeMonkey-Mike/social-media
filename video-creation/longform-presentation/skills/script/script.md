# longform-presentation / script: the SCRIPTED option of a standard video (format 4)

**What this skill is:** a standard presentation video (`../../longform-presentation.md`, format 4) can be made two
ways, chosen when the video is started:

- **FREE TALK** (the format as it has always been): Mike talks from the slides and a notes doc, a handful of moments
  get one overlay inside the deck area. Nothing here applies; `../card-overlays/card-overlays.md` is the whole skill.
- **SCRIPTED** (this skill, Mike 2026-11-14): Mike reads a light `SCRIPT.md`. Every spoken line is either a
  **COVER** scene (a deck card, a system-design chart still or an animated chart fills the WHOLE frame and hides the
  recording, his webcam and the membership box included) or a **SCREEN-SHARE** scene (the recording as filmed). Most of the runtime is covered; a handful of
  screen-share scenes play as filmed. Still one ffmpeg final render, no Remotion comp, no draft.

**Status: v1 built 2026-11-14, not yet run on a real recording.** The lint, the cue step and the cover-run render were
tested on pieverse's script, transcript and cards (History, below). The pre-recording half (the script written to
this format, the cards built full frame by the shared builders) has not been exercised yet: the first real
video is the proof, and whatever it teaches goes back into this file.

**Why it exists:** pieverse (2026-11-14) was a simple video (cards, 2 animated charts, 1 system-design chart, no music,
no effects) built in the longform-edited graph, where it took most of a day: planning documents, an asset stage after
the recording, a Remotion comp, a draft and a final render. Here the cards exist BEFORE Mike records, the script
says which card covers which line, and the render is one pass.

## The questions asked AT THE START (never defaulted silently, never asked after the spine is cut)

1. **Free talk or scripted?** (this skill only when scripted)
2. **The silence definition.** The track preset is 800 ms min-silence with 300 ms left between sentences
   (`../desilence/desilence.md`). Any other definition (pieverse: 600 ms, 300 ms left) is Mike's number, given now.
   Keep some of the residual BEFORE the next word, never all of it after the sentence: a tail-only residual clipped
   the "S" of "Stake" on pieverse; the preset's 200 ms after + 100 ms before already does this.
3. **Enhance Speech: on or off?** On = the WAV handoff and the remux of format 4 (`../card-overlays/card-overlays.md`
   procedure step 1).

There is NO question about where a cover goes (Mike, 2026-11-14: "If I say scripted, the implication is that we're
going to have screen-share scenes and we're going to have cover scenes"): a cover always fills the whole frame. A card
beside the webcam is free talk's layout, never a scripted cover. v1 was first built with a `covers: full | deck-area`
header setting; he took it out the same day, so do not bring it back.

The answers go into the `SCRIPT.md` header table, so every later step reads them from the file. In scripted mode the
script REPLACES format 4's notes doc (`<p>-notes.docx`): everything he says is in the script, so no notes doc is built.

## The extras: the vertical cut, the short, the YT post (Mike, 2026-11-15)

Three things Mike may or may not want on top of the 16:9 video, each on its own, exactly as on pieverse and
future-of-software-engineers ("I may or may not ask for the vertical conversion, the short, and/or the YT post"):

| extra | header row | what it is | status on this track |
|---|---|---|---|
| the VERTICAL cut | `vertical` `on` / `off` | the whole video at 1080x1920, same cues, same audio | **built** (`cover_runs.py --vertical`, below) |
| the SHORT | `short` `off` / `on` (= 30) / seconds 15 to 60 | a ~30 s vertical cut with captions and the "watch the full video" outro | **built** (2026-11-17): the longform-edited short lane takes this project by its folder, cut from the delivered vertical (`run.py short --project "<the project folder>" [--seconds 30]`, `video-creation/longform-edited/skills/longform-to-short/longform-to-short.md` "A presentation project"); needs the vertical cut first (the lint warns when `short` is on and `vertical` off) |
| the YT post | `yt post` `on` / `off` | the promo carousel, once the video is LIVE | **built**: the longform-edited lane takes this project by its folder (`run.py ytpost --project "<the project folder>" --url <link>`, `video-creation/longform-edited/skills/yt-post/yt-post.md`) |

- **They are NOT a question.** He names them when he starts the video ("scripted, with a vertical and a YT post"), or
  he names none. A row that is missing is `off`. Never ask about them, never build one he did not name.
- **He can still ask later**, after the video is delivered, for any of them. Naming the vertical UP FRONT only changes
  WHEN its cards are built: together with the 16:9 cards, before he records, so the vertical costs one more render
  and no rebuild. Asked for later, its cards are built then.
- The rows go in the `SCRIPT.md` header under the four settings; `cue_script.py` copies them into `cues.json`, the
  cue report and the last line of `cover_runs.py` name what is still owed, so a named extra is not forgotten.

### The vertical cut

The SAME `cues.json` rendered a second time at 1080x1920. Nothing of the 16:9 is touched.

- **`[COVER]` scenes: the vertical card set.** Every card, every state and every animated-chart page is built a second
  time, NATIVE VERTICAL (1080x1920), by the same builders, from the same CARDS worklist and the same `RESEARCH.md`,
  with the same file names, into `assets/vertical/cards/`, `assets/vertical/diagrams/`, `assets/vertical/charts/`.
  Brief the builder with 1080x1920 as its frame and the 16:9 card as the reference for content, never for layout: the
  card is re-composed for a tall frame (the title wraps, the rows stack, a chart is drawn tall), the lower third kept
  light (a phone's interface sits there). Never a scaled, cropped or letterboxed 16:9 card
  (`video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` section 1 is the standard).
  `visual-qa` clears every file. `cover_runs.py --vertical --step check` lists every file still missing.
- **`[SCREENSHARE]` scenes: re-stacked.** A 16:9 recording cannot ship as filmed in 9:16, so the slide area goes across
  the top at full width and the webcam sits centred under it (never enlarged past 1.5x: it is small in the recording
  and goes soft). The membership box is left out. The two rectangles default to the standard recording layout (slide
  area x 0 to 1464, webcam x 1466+, y 400 to 1080); on any other OBS layout pass `--deck-rect` / `--cam-rect`. **Open
  the layout proof** (`_qa/<VERTICAL>-layout-proof.png`: both rectangles drawn on a real frame, beside the frame they
  make) before delivering: a wrong rectangle shows there as a sliver of the webcam in the slide or a cut-off face.
- **The render:** `python skills/card-overlays/cover_runs.py "media/standard/<p>/overlays/cues.json" --vertical`
  (check, build, render, QA, leak check; `../card-overlays/card-overlays.md`, "Cover runs"). Output
  `<p> VERTICAL-v1.mp4`, the spine's audio stream-copied, the same frame count as the spine. No captions (the 16:9 has
  none either).
- A fix round that changes a card changes BOTH sizes: rebuild the card in both folders, re-run both renders.

## The flow

| # | Step | Who / what | Output (in `media/standard/<p>/`) |
|---|---|---|---|
| 1 | Research | as format 4 (`RESEARCH.md` is the only number source; a coin follows `video-creation/skills/coin-research/coin-research.md`) | `RESEARCH.md` |
| 2 | The script | written to the format below (no dedicated agent yet: the main loop writes it), `lint_script.py` must PASS, **Mike gates it** | `SCRIPT.md` |
| 3 | The deck, the cover cards, the charts | the deck as format 4. Deck cards: one still per card and per state, by the shared `slide-builder` agent (`.claude/agents/longform-edited/`) briefed with the full 1920x1080 frame as its frame, the CARDS table as its worklist, `RESEARCH.md` as its only number source and `assets/cards/` as its output folder (not yet exercised on this track). `chart-builder` for a chart still and for an animated chart's time-driven page, briefed as in `card-overlays.md` but with the full frame as its frame. `visual-qa` clears every file | `<p>.html`, `assets/cards/`, `assets/diagrams/`, `assets/charts/` |
| 4 | Mike records | one screen-share scene, reading the script (Recording notes) | `raw/<timestamp>.mkv` |
| 5 | The spine | exactly format 4's: defumbler agent (a scripted read has retakes), the silence pass with the definition from the header, the Enhance Speech handoff + remux when on, transcribe. **No blackout** (he is on screen in every uncovered frame by design) | `spine/` + `<final spine>.medium-words.json` |
| 6 | Cue | `cue_script.py`: every line's window, the ad-libs, **the number check** | `overlays/cues.json`, `overlays/CUE-REPORT.md` |
| 7 | Record-day numbers | any figure that drifted since the research is re-pulled into `RESEARCH.md` and its card rebuilt BEFORE the render (pieverse: the price, the circulating count and the perp volume had all moved by the recording day) | the cards |
| 8 | Cover runs + the render | `../card-overlays/cover_runs.py`: check, one clip per run, `cards.json`, the unchanged `card_overlays.py` render, the QA sheet and the leak check | `overlays/runs/`, `overlays/cards.json`, `<p> FINAL-vN.mp4`, `_qa/` |
| 9 | Deliver | as format 4 (the absolute path; Mike uploads) | |
| + | The extras he named ("The extras", above) | `vertical`: its card set is built at step 3 beside the 16:9 one, then `cover_runs.py ... --vertical` after step 8. `yt post`: `run.py ytpost` once the video is live. `short`: `run.py short --project "<the project folder>"` after the vertical | `assets/vertical/`, `overlays/cards-v.json`, `overlays/runs-v/`, `<p> VERTICAL-vN.mp4`, `yt-post/` |

Steps 6 to 8 are three commands (paths as the track doc writes them, from `video-creation/longform-presentation/`):

```
python skills/script/lint_script.py "media/standard/<p>/SCRIPT.md"
python skills/script/cue_script.py "media/standard/<p>/SCRIPT.md" --words "media/standard/<p>/spine/<final spine>.medium-words.json" --spine "media/standard/<p>/spine/<final spine>.mp4"
python skills/card-overlays/cover_runs.py "media/standard/<p>/overlays/cues.json"
```

v1 is run by hand, in this order; there is no graph and no run-queue integration yet. The run-clip build and the
render are video work: start them only on an idle run queue (`video-creation/skills/run-queue/run-queue.md`).

## `SCRIPT.md`: the format (a longform-edited screenplay, with less in it; skeleton `SCRIPT.reference.md`, gate `lint_script.py`)

**The header:** a title line, then one settings table with these rows: `project`, `channel`, `silence`
(the definition in words), `enhance speech` (`on` or `off`), and under them only the extras he named: `vertical`,
`short`, `yt post` ("The extras", above; a missing row is off). No `covers` row: the lint fails one.

**`## CARDS`:** one table row per card: `id | kind | shows | states | numbers`.
- `id`: plain words that say what the card is, joined by `-` (`what-it-is`, `supply`, `price-line`; letters, digits,
  `-`, `_`). Never a letter and a number (`D1`, `C1`): Mike reads these names on every `[SHOW]` line. It is the file name:
  `<id>.png`, a state is `<id>-<state>.png`, an animated chart is the page `<id>.html` (the lint fails two names that
  would be the same file).
- `kind`: `card` (a deck card), `chart-still` (a system-design chart: nodes, arrows, labeled flows, never a table),
  `animated-chart` (a time-driven page, `../card-overlays/card-overlays.md` kind `clip`).
- `states`: a comma list when the card changes while he talks (the next row lit, the next node spotlit); empty
  otherwise. A state is named for what is lit (`total, circulating, locked`), never `s1, s2, s3`. An animated chart
  has no states: it is one clip.
- `numbers`: every figure the card prints. Each one must exist in `RESEARCH.md` (the lint warns when it does not).

**It is written like a longform-edited screenplay (Mike, 2026-11-16).** The first real script came to him in a format
of its own (the card named inside the tag, `[COVER H1]`, bare tags, `## SLIDE` headings) and he could not tell what he
was looking at: "I guess I just don't understand why we want to make this file any different." There was no reason, so
there is no second format: the same tags, written the same way (the emoji, then the tag in code ticks, a gray chip in
the Markdown preview), under the same `## CH<n> - <TITLE>` headings. A script only carries LESS than a screenplay.

**`## CH<n> - <TITLE>`:** a chapter of the script: the spoken lines, in order, one line per spoken sentence or two.
(`## SLIDE <n> - <title>`, v1's heading, is still read.)

| The line starts with | It means |
|---|---|
| 🖥️ `[SCREENSHARE]` | Spoken. He says the line over the recording as filmed. Nothing is overlaid. |
| 🗣️ `[COVER]` | Spoken. He says the line while a card fills the whole frame. The tag carries NO card name. |
| 🎬 `[SHOW]` | Not spoken. What is on screen for the `[COVER]` lines ABOVE it, back to the previous `[SHOW]` line, `[SCREENSHARE]` line or heading. It starts with the card, then a colon: `<card-id>: what it shows`, or `<card-id>.<state>: what is lit` (a cross-fade from the state before). |
| 💬 `[NOTE]` | Not spoken. A note or a direction to Mike. |
| `(parentheses)` inside a spoken line | A direction inside the line. Never spoken, never cued. |

- **Every `[COVER]` line has a `[SHOW]` line under it** before the scene changes: the `[SHOW]` line is where the tools
  read which card and which state cover those lines (the cue step is code, so the name has to be exact; it is the one
  thing a screenplay's `[SHOW]` line leaves to the reader). Lines that share a card and a state sit together above ONE
  `[SHOW]` line; a new state gets its own `[SHOW]` line, the way a screenplay writes `C1: spotlight ...` per line.
- **The first `[SHOW]` line of a card says what the card is** (`the card THE SUPPLY, 3 rows`, `a system-design chart
  of ...`, `code from <file>, <function>`, `JSON, one line of ...`) and then what is lit; the later ones say only what
  changes. Mike reviews the script from these lines, without cross-reading the CARDS table.
- **A `## PRODUCTION CONVENTIONS` table of the 4 tags opens the file**, under the settings table (the reference has
  it), as a screenplay's does.
- What a `[SCREENSHARE]` scene should have on screen is a `[NOTE]` (a `[SHOW]` line with no `[COVER]` line above it
  fails).
- **Spread the `[SCREENSHARE]` scenes through the script** (Mike, 2026-11-16: the first draft of clip-evals went from
  CH1 to CH15 without one, "there may be too few", and he had 5 added across CH2 to CH14). Not one per chapter: one
  every few chapters, a single line each (a sentence or two he says to the camera: a chapter's opening question, its
  punch line, a caveat), on that chapter's deck slide. Pick a line whose card state has another line, so no card or
  state loses its only line.

Consecutive `[COVER]` lines under one `[SHOW]` line are one card window; a new card or state starts where its first
line starts. Prose under any other `## ` heading (`## NOTES`, open questions, the do-not-air list) is a note, never
spoken. What the lint enforces: every spoken line tagged, only these four tags (`[FACE]` fails: no face scenes in v1),
every tag written with its emoji and in code ticks, every `[COVER]` line covered by a `[SHOW]` line, every `[SHOW]`
card and state listed in the table and every listed card and state used, no two names that would be the same still
file, no em dash, and Mike's spoken-word rules. The word rules are NOT copied into this track: the lint runs every line
through the longform-edited screenplay gate (`video-creation/longform-edited/skills/doc-reference/lint_screenplay.py`),
so the two tracks cannot drift apart (contractions, "just cannot", "around" before a number, numbers and years as
digits, no "honest" lead-in, no dollar sign). The emoji are that gate's own table too.

Not in a `SCRIPT.md`, because this track does not have them yet: a chapter map, budgets, beat signposts, music plans,
clip inserts, title cards, and the tags `[FACE]`, `[SAY-EXACT]`, `[VERIFY]`, `[INSERT]`. If a script seems to need one
of them, the video belongs in `longform-edited/`.

## Recording notes

- **One OBS scene for the whole take: the screen share with the webcam**, as every standard video. No full-camera
  scene (v1 has no face scenes and nothing would centre or reframe one).
- **Every `[SCREENSHARE]` line is recorded with its slide on screen.** That scene ships as filmed. (On pieverse the
  screen-share scenes were recorded over an empty deck area and painted in afterward; nothing here paints.)
- During `[COVER]` lines the picture does not matter: it is hidden. He can read.
- Read the lines as written, numbers above all. A reworded line still cues; a number said differently from the
  script is caught by the cue step but cannot be fixed without a re-record.
- A spoken instruction ("cut that out", "go again") is followed and removed by the defumbler, as in every track.

## After the cue: reading `CUE-REPORT.md`

- **Section 1, numbers he said differently.** The reason the script exists. A card prints the sourced figure, never
  the spoken one, so each row is a voice-against-card disagreement for Mike to rule on (re-record the line, or leave
  it). Whisper can mishear a number: listen at the timecode before raising it.
- **Section 2, lines he did not say.** A missing `[COVER]` line has no window, so the cue FAILS. If Mike dropped the
  line, re-run with `--allow-missing`. If he said it in other words, pin it: `--pin <script line>=<seconds>`.
- **Section 4, ad-libs.** An ad-lib inherits the scene of the line before it (the card stays up; under a screen-share
  line the recording keeps playing). When an ad-lib should already show the NEXT card (a bridge sentence into the
  next point), pin the next line's start onto it.
- Pins are saved in `overlays/cue-pins.json` and re-applied on every run. The word JSON is never edited.

## Rules

- **In scripted mode a COVER hides the webcam and the CTA by design (Mike, 2026-11-14).** This is the one exception
  to `card-overlays.md`'s "Never over the webcam or the CTA" and "Only over the SLIDESHOW" rules. A free-talk standard
  video keeps both rules.
- **The recording never shows inside a cover run.** A new card is composited over the previous card, never over the
  recording; the leak check in `cover_runs.py --step qa` proves it on the rendered file, and a FAIL is not delivered.
- **A card prints the sourced figure.** Never a number copied from the voice-over, never a number known to be wrong.
- **The audio is the spine's, stream-copied**, exactly as format 4. The scripted option adds no audio step.
- **Animated charts play from t = 0 at the start of their window, at their own speed, and hold their end state.** The
  page must hold still past its last moment. It is built before the recording to an estimated window (the line's
  word count at about 3 words a second: pieverse ran 1,104 words in 373 s); when its moves must land on words,
  re-time the page after the cue
  (`CUE-REPORT.md` section 6 gives the real window) and re-run `cover_runs.py`.
- **A fix round** = edit the script, a pin, a card file or the spine, then re-run the same commands. Unchanged runs
  are kept (each run clip carries a signature of its cards and its window), so only what moved is rebuilt before the
  one render. A new `-vN` in `--out` per delivery.
- No em dashes in anything written for this option.

## Not in v1 (each is a decision for a later version, not an oversight)

- Full-camera FACE scenes, and the measured face centring that goes with them (today that is Remotion code in the
  longform-edited track; here it would be a zoom and crop inside the ffmpeg pass, plus a way for the silence tool to
  know the face scenes without the blackout).
- The cover blackout, transitions between scenes beyond the fade in and out of a run, sound effects, captions,
  Envato or AI b-roll, whiteboard beats, a music bed.
- A cover that leaves the webcam visible (a card inside the deck area): that is free talk's layout. A scripted cover
  always fills the whole frame.
- A dedicated script-writing agent, a LangGraph, the run queue, a draft render.
- **The short WITHOUT the full vertical** ("The extras"; only the cards its spans use rebuilt vertical). The short off a
  delivered vertical is built (2026-11-17, the longform-edited short lane, see "The extras").
- In the vertical cut: captions, a blurred or branded fill beside the webcam, the membership box, and an automatic
  measurement of the two rectangles (they are defaults or flags, confirmed on the layout proof).

## Files

| file | role |
|---|---|
| `script.md` | this doc |
| `SCRIPT.reference.md` | the lint-clean skeleton of a `SCRIPT.md` (a made-up coin, fake numbers) |
| `script_common.py` | the one `SCRIPT.md` parser, shared by the lint and the cue step |
| `lint_script.py` | the format gate: `python lint_script.py "<SCRIPT.md>" [--research "<RESEARCH.md>"]` -> `SCRIPT-LINT PASS\|FAIL lines=N covers=N screenshares=N cards=N fails=N warns=N` |
| `cue_script.py` | the cue step: `python cue_script.py "<SCRIPT.md>" --words "<words.json>" [--spine "<spine.mp4>"] [--out-dir <overlays>] [--allow-missing] [--pin LINE=SECONDS]` -> `SCRIPT-CUE PASS\|FAIL lines=N kept=N changed=N missing=N adlibs=N number_mismatches=N runs=N` |
| `../card-overlays/cover_runs.py` | the cover runs, the render and the QA (documented in `../card-overlays/card-overlays.md`, "Cover runs"); `--vertical` = the vertical cut from the same cues |

## Defaults chosen for v1 (2026-11-14; change them here and in the code together)

- `SCRIPT.md` lives at the project root; spoken lines only under `## CH<n>` headings (2026-11-16: the screenplay's
  heading and tags; v1's `## SLIDE` heading is still read, v1's `[COVER <card>]` tag is not).
- A cover is always the full 1920x1080 frame; card stills and chart pages are built at that size.
- A window starts up to 0.3 s before its first word, never before the previous word ends, and runs to the next
  line's window. A video that opens on a `[COVER]` line is covered from its first frame.
- A line is KEPT at 85% of its words matched, CHANGED down to 34%, MISSING under that. An ad-lib is 4 or more
  transcript words no line covers.
- `number_mismatches` in the machine line counts lines where he said a DIFFERENT number; a number only left out or
  only added is listed below them and not counted.
- A missing `[COVER]` line fails the cue until `--allow-missing` or a pin.
- Card stills are looked up in `assets/cards/`, then `assets/diagrams/`, then `assets/charts/`.
- Inside a run: a new card enters over 11 frames (0.93 to 1 scale with alpha, the look of a `card_overlays.py`
  still) over the previous card; a new state of the same card cross-fades over 6 frames; an animated chart fades in
  over 11 frames. Run clips are near-lossless intermediates (libx264 crf 10, yuv444p, a keyframe every half second)
  in `overlays/runs/`.
- A run that starts on the video's first frame or ends on its last gets no fade there (two opt-in keys on the
  `cards.json` entry; `card_overlays.py` behaves exactly as before when they are absent).
- The leak check fails a frame under 30 dB against its run clip.
- The extras (2026-11-15): a missing header row is off; `short on` means 30 s. The vertical frame is 1080x1920; a
  screen-share scene is the slide area at full width from y 60, a 24 px gap, the webcam centred under it at up to 1.5x,
  on the deck's `#0a0c10`. Standard layout: 1080x796 of slide, then a 668x1000 webcam. The vertical card set lives in
  `assets/vertical/` under the same names; its run clips in `overlays/runs-v/`, its spec in `overlays/cards-v.json`.

## History

- **2026-11-14, built and tested on pieverse data (no real scripted recording yet).**
  - Cue: pieverse's screenplay as scripted (61 spoken lines, 22 cards) against the final spine's transcript (1,104
    words), 0.3 s: 38 lines kept, 20 reworded, 3 missing (the two OKX lines Mike cut on camera and the sign-off he
    did not say), 4 ad-libs, 8 cover runs, and **2 numbers said differently: 1.61 and 1.6 billion read as 1.78 and
    1.7 billion, and "170 thousand" read as "170 million"** (the error nobody caught until the transcript review).
  - Render: 45 s, 1920x1080 (two runs, seven card windows: a state change, a card change, an animated chart, a
    screen-share gap): run clips 40 s in all, most of it the animated chart's 171 browser frames (a 14 s run of stills
    alone builds in 8 s), the `card_overlays.py` render 14 s (3.7x real time), the QA sheet and leak check about 10 s.
    Every interior frame of both
    runs matches its run clip at 49.5 dB or better (the recording against the same clip: 17.7 dB at most), the
    screen-share gap matches the spine at 52.7 dB or better, output frames 1,350 = the spine's 1,350.
- **2026-11-15, the extras and the vertical cut (Mike: "we need to do it ... it has to be optional, and I can say it
  upfront").** Tested on the same 45 s pieverse fixture and on 8 s of JCT, no real scripted recording yet.
  - Vertical render of the fixture: 1080x1920, 1,350 frames = the spine's 1,350, both runs rebuilt at the vertical size
    (the animated chart's page through `html_clip.py` at 1080x1920), leak check PASS on 37 samples (38.7 dB at
    worst), about 50 s for the 45 s. **The vertical cards in that test were PLACEHOLDERS** (the 16:9 card pasted on a
    tall page) to prove the mechanics: a real video's vertical cards are built native by the builders, which this
    track has not exercised (the builders did it for pieverse's short, 2 cards, inside the longform-edited lane).
  - The layout proof caught the fixture's own layout: pieverse was recorded on another OBS scene (webcam from x 1370,
    546 px wide, over an empty slide area), so the default rectangles left a sliver of the webcam in the slide pane.
    That is the proof doing its job; a standard recording uses the defaults.
  - The stacked screen-share frame on a real standard recording (JCT, 8 s through `card_overlays.py` with a `layout`
    and no cards): the slide across the top, the webcam under it, clean edges, 240 frames in and out.
  - The 16:9 path is unchanged: the fixture's FINAL re-rendered with the edited tools has the same picture checksum.
  - The YT post lane (`ytpost_graph.py`) now reads a presentation project (`<p> FINAL-vN.mp4`; `SCRIPT.md`, the cue
    report, the transcript and `RESEARCH.md` in place of AS-RECORDED / DATA). Checked at function level on JCT and
    pieverse; not yet run end to end on a presentation video.
