# longform-presentation / card-overlays: cards, charts and a whiteboard beat INSIDE the deck area (format 4)

**What this skill is:** the last step of the track's **format 4, "standard"** (`../../longform-presentation.md`,
"The four formats"): Mike screen-shares an HTML deck with his webcam PiP and the Premium Membership box, talks
freely, and a handful of moments get ONE overlay in the DECK AREA for exactly as long as he talks about that point:
a deck card blown up, a system-design chart still, an animated chart clip, or a whiteboard beat. Everything else
stays as filmed. The track stays "a very simple version of the long-form editor, not doing much stuff at all"
(Mike, 2026-10-24).

**The layout (Mike, 2026-10-31, binance, replacing the full-screen cards of near-vs-tao):** an overlay covers ONLY
the area he presents the slideshow in. His webcam and the call to action keep the right column, visible the whole
time, at their recorded size ("I don't want to minimize the size of my talking head"). Reference look: a talking head
on the right, diagrams and motion graphics owning the rest of the frame. Measured on the binance recording
(1920x1080): the deck area is **x 0 to 1466, full height**; the Premium Membership box sits at x 1466+, y 0 to 400,
and the webcam at x 1466+, y 400 to 1080. The spec's `region` is `{x:0, y:0, w:1464, h:1080}` (even width for the
clip encoders). Re-measure on a new OBS layout (a column scan on a frame); never assume.

**No Remotion comp for the video, no draft.** One ffmpeg encode composites every overlay over the spine; the one
render is the FINAL. A card is a still (the deck's own HTML, enlarged, screenshotted at the region size). A chart
still is a PNG. An animated chart or a whiteboard beat is a short clip rendered ALONE at the region size and the
card's exact length (through `video-creation/skills/chunked-render/`), then composited like a card. When cards
change every few seconds (a whole lecture), that is format 1's `../spotlight/spotlight.md`, not this; when a standard
video is SCRIPTED and covered for most of its runtime, that is "Cover runs" below (`../script/script.md`).

## The overlay kinds (`cards.json` per-card `kind`)

| kind | what | who makes it | file |
|---|---|---|---|
| `deck` (default) | ONE card or snippet from the deck, the deck's text verbatim, `zoom` to fill the region (1.3 to 1.6 at 1464 wide) | authored here (`<id>.body.html`) | `<id>.png` generated |
| `image` | a SYSTEM-DESIGN chart still (nodes + arrows + labeled flows, never a table), region-sized | the shared **`chart-builder`** agent (`.claude/agents/longform-edited/`, its skill by reference, never copied), cleared by **`visual-qa`**; brief it with the REGION size as its frame and `RESEARCH.md` as its only number source; it writes `media/standard/<p>/assets/diagrams/` | `src` = the PNG |
| `clip` | an ANIMATED chart: `chart-builder` delivers the chart as a TIME-DRIVEN page (`window.setT(t)` sets the whole state as a pure function of t: no CSS transitions / animations / rAF) plus state stills; `html_clip.py` (this folder) screenshots it frame by frame at `setT(f/30)` and encodes the clip. No Remotion port, so the agent's design IS the animation, deterministic (decided 2026-10-31, binance). Or a **whiteboard beat** (`video-creation/skills/whiteboard-beat/whiteboard-beat.md`, built by the shared **`whiteboard-builder`** agent, a Remotion comp rendered through `chunked-render`) | region size, no audio, frames == the card window | `src` = the mp4 |

Still undecided (Mike, 2026-10-31: "don't know"): receipts / real chart screenshots, music bed, Envato or AI-image
b-roll. Not in: transitions, SFX, captions, a whole-video Remotion comp, a draft render.

## Files

| file | role |
|---|---|
| `card_overlays.py` | the tool: `pages` (deck-card HTML from the deck's `<style>`, region-sized) -> `shoot` (PNGs, Playwright at the region viewport) -> `render` (one libx264 crf 18 pass, audio stream-copied) -> `qa` (contact sheet) |
| `remux_enhanced.py` | Mike's Enhance Speech track back onto the EDIT's video: `python remux_enhanced.py "<p> EDIT.mp4" "<enhanced wav/mp4>" --out "spine/<p> EDIT.enhanced.mp4"`; copies the video stream, refuses a length mismatch, verifies the stream md5 |
| `html_clip.py` | an animated chart's clip: `python html_clip.py "<chart>.html" --frames <window frames> --out "overlays/<id>.mp4" [--size 1464x1080]`; refuses a page without `setT` or with a live CSS animation |
| `cover_runs.py` | the SCRIPTED option only ("Cover runs" below): every run of consecutive `[COVER]` lines as ONE clip, `cards.json` written from `overlays/cues.json`, then this folder's unchanged render, a per-card QA sheet and the leak check. `--vertical` = the 1080x1920 cut from the same cues ("The vertical cut" below) |
| `media/standard/<p>/overlays/cards.json` | the per-video spec: `deck`, `spine`, `out`, `region`, and per card `id`, `in`, `out` (spine seconds), `say` (the words it covers), `kind`, `zoom` + `orbs` (deck) or `src` (image / clip). Opt-in keys written by `cover_runs.py` only: `layout` (the vertical cut) and `face_reframe` (`{crop, windows}`: the full-camera FACE scenes of a scripted video, cropped and scaled to centre his face, `../script/script.md` "Face scenes") |
| `media/standard/<p>/overlays/<id>.body.html` | one deck card's markup, deck classes, the deck's text verbatim (authored) |
| `media/standard/<p>/overlays/<id>.html` / `<id>.png` / `_frames/` | generated (page, still, entrance frames) |
| `media/standard/<p>/overlays/<id>.brief.md` | a chart's or a whiteboard beat's brief for its agent (the words, the idea, the facts) |
| `media/standard/<p>/assets/diagrams/`, `assets/charts/` | the chart-builder's outputs (its fixed layout) |

## Procedure

1. **The spine first** (track doc, format 4): defumble if the take has retakes (binance: none, Mike's call) ->
   preset desilence (800 ms, `../desilence/`) -> hand Mike the EDIT's audio as a WAV for his Enhance Speech pass
   (`spine/<p> EDIT.wav`; he said 2026-10-31 "you have to give me the audio file").
   **Extract that WAV honouring the audio timestamps (2026-11-16, clip-evals):** the preset renders a long spine in
   parts and stream-copies them together, and every part boundary leaves about 23 ms of AAC encoder padding that a
   plain decode keeps, so a plain `ffmpeg -i "<p> EDIT.mp4" "<p> EDIT.wav"` runs late by about 23 ms per part (measured
   236 ms by the end of an 8-part 18-minute spine) and the remuxed enhanced track loses lip sync in the late
   screen-share scenes. Use
   `ffmpeg -i "spine/<p> EDIT.mp4" -vn -map 0:a:0 -af "aresample=async=1:min_hard_comp=0.010:first_pts=0" -c:a pcm_s16le "spine/<p> EDIT.wav"`
   (its length then matches the video within about 60 ms; give `remux_enhanced.py` `--tolerance 0.1` if its check
   refuses that). For the same reason, transcribe that WAV rather than the EDIT mp4 while the enhanced track is out
   (Whisper decodes an mp4 the plain way); the remuxed enhanced spine has one clean audio encode and is safe to
   transcribe directly. The root fix belongs in the canonical desilencer's batched concat (not done yet). The enhanced track comes back
   the same length: confirm (duration within a frame), then remux it onto the EDIT's video stream
   (`-c:v copy`) as the final spine in `spine/`. Transcribe (`scripts/transcribe.py`, medium): the cue source. The
   EDIT can be transcribed BEFORE the enhanced track returns (same timeline) so the moments, briefs and agents run
   while Mike enhances; re-check the enhanced spine's duration before the render.
2. **Pick the moments** (how many of each: Mike says; binance = 5 deck cards + 1 system-design chart + 1 animated
   chart + 1 whiteboard beat of 15 to 20 s). From the transcript, a deck card qualifies when he is on the slide and
   saying a single card's point out loud, a self-contained sentence or two, 8 to 25 s. A chart or beat wants a
   MECHANISM or a FLOW he explains for 15 to 30 s. Spread them across the video. **Skip any span where what he says
   contradicts the deck** (a misspoken number). Grab a frame from each window to confirm the matching slide is on
   screen.
3. **Author**: deck cards as `<id>.body.html` (ONE card or snippet, the deck's text verbatim); charts and the beat
   as `<id>.brief.md` -> spawn the agent -> `visual-qa` -> render the clip (region size, window length). `cards.json`
   timing: `in` ~0.3 s before the first word (the pause before it), `out` ~0.2 s after the last word, never across into
   the next point. A clip's `out - in` is its length: fix the window BEFORE briefing the agent.
4. **Run it**:
   ```
   python video-creation/longform-presentation/skills/card-overlays/card_overlays.py "media/standard/<p>/overlays/cards.json"
   ```
   The shoot step prints the loaded fonts per deck card and flags a card that overflows the region; the check step
   refuses an image or clip that is not region-sized and reports a clip whose frame count differs from its window
   (the last frame is held / the clip is trimmed); the render prints the frame count check (output frames == spine
   frames, or it is not delivered).
5. **QA**: open the contact sheet (`media/standard/<p>/_qa/<out>-cards-sheet.png`): per overlay, the frame before it
   (A-roll), mid-entrance, the hold, mid-exit, after (A-roll back); the webcam and the CTA visible in every column.
   Then deliver the absolute path with the overlay list in VIDEO time (Mike watches and checks them by timestamp).
6. **A fix** (text or timing): edit the body / brief / `cards.json`, re-run (`--step pages|shoot|render|qa` for a
   part), new `-vN` in `out`.

## Cover runs (the SCRIPTED option, v1 2026-11-14)

A standard video can be SCRIPTED instead of free talk (`../script/script.md`: the whole option, read it first). Then
most of the runtime is covered by cards that follow each other, which this tool was not built for: every overlay here
fades back to the recording, so two cards in a row would flash Mike reading between them, and a hundred stills would
be two hundred ffmpeg inputs. `cover_runs.py` solves it without changing the render:

```
python video-creation/longform-presentation/skills/card-overlays/cover_runs.py "media/standard/<p>/overlays/cues.json"
      [--step check|build|render|qa]  [--out "../<p> FINAL-v2.mp4"]  [--cards-dir <folder> ...]
```

- **Input:** `overlays/cues.json` from `../script/cue_script.py` (each script line's window; consecutive `[COVER]`
  lines grouped into runs).
- **One clip per run** (`overlays/runs/<run id>.mp4`, the full 1920x1080 frame, exactly `round(out * fps) - round(in * fps)`
  frames): the run's first card is simply up; a new card enters with the still entrance of this skill (11 frames, 0.93
  to 1 scale with alpha) over the PREVIOUS card; a new state of the same card cross-fades over 6 frames; an animated
  chart is rendered for its window through `html_clip.py`, fades in over the previous card and holds its last frame.
  The recording never shows inside a run.
- **`cards.json`** gets one `kind: clip` entry per run (existing cards that are not runs are kept; one that overlaps a
  run is refused), and `card_overlays.py --step render` composites them. The clip's fade in and fade out are then
  exactly the move between a screen-share scene and a cover run.
- **Frame:** a cover run always fills the whole 1920x1080 frame (no `region` in a scripted video's `cards.json`; Mike,
  2026-11-14: scripted = screen-share scenes + full-screen cover scenes, there is no deck-area cover). Card stills live
  in `media/standard/<p>/assets/cards/` (`<id>.png`, `<id>-<state>.png`), chart stills in `assets/diagrams/`,
  animated-chart pages in `assets/charts/<id>.html`, all at 1920x1080 (`check` refuses any other size).
- **QA:** `<project>/_qa/<FINAL>-cover-cards-sheet.png` (one mid-window frame per card window) and the LEAK CHECK:
  frames of the FINAL inside every run (the middle of each card window and the frames around each card change) must
  match the run clip at 30 dB or better. `LEAK-CHECK FAIL` = the recording showed through = do not deliver.
- **Two opt-in keys on a clip card**, written only by `cover_runs.py`: `"fade_in": false` (a run that starts on the
  video's first frame) and `"fade_out": false` (a run that ends on its last frame): there is no recording to fade
  from or to. Without the keys the render's filter graph is byte-identical to before (checked 2026-11-14 on an
  old-style spec), so near-vs-tao, binance and JCT reproduce unchanged.
- Machine lines: `COVER-RUNS PASS|FAIL runs=N cards=N frames=N` and `LEAK-CHECK PASS|FAIL samples=N min_psnr=<dB>`.

### The vertical cut (`--vertical`, 2026-11-15; an extra Mike names, `../script/script.md` "The extras")

```
python video-creation/longform-presentation/skills/card-overlays/cover_runs.py "media/standard/<p>/overlays/cues.json" --vertical
      [--step check|build|render|qa]  [--deck-rect 0,0,1464,1080]  [--cam-rect 1466,400,454,680 | none]  [--bg 0x0a0c10]
      [--out "../<p> VERTICAL-v2.mp4"]
```

The same cues rendered a second time at 1080x1920; the 16:9 files are never touched.

- **Its own files:** the vertical card set in `assets/vertical/cards | diagrams | charts` (the SAME file names, every
  card rebuilt native 1080x1920 by its builder; `check` refuses any other size and lists every missing file), the run
  clips in `overlays/runs-v/`, the spec `overlays/cards-v.json`, the deliverable `<p> VERTICAL-v1.mp4`.
- **A cover run** is built exactly as in 16:9, at the vertical size (an animated chart's vertical page through
  `html_clip.py --size 1080x1920`).
- **A screen-share scene is RE-STACKED** by the render itself: `cards-v.json` carries a `layout` (the frame size, a
  background colour and panes, each a rectangle of the recording and its place on the vertical frame: the slide area
  across the top at full width, the webcam centred under it at up to 1.5x), and `card_overlays.py` applies it before
  the overlays, in the same single encode, on the spine's own frame timestamps. No `layout` key = the render is what
  it always was (the 16:9 fixture re-rendered byte-identical after this change).
- **The rectangles** default to the layout measured at the top of this doc; on another OBS scene pass `--deck-rect` /
  `--cam-rect` (they are saved in `cards-v.json`). The QA step writes the **layout proof**
  (`_qa/<VERTICAL>-layout-proof.png`: both rectangles on a real frame, beside the vertical frame they make) and adds one
  tile per screen-share scene to the sheet. Open the proof before delivering.
- The leak check and the frame-count check run as in 16:9.
- **A FREE-TALK video's vertical** needs no cues: the finished FINAL is re-stacked whole. Write `overlays/cards-v.json`
  with `"spine": "../<p> FINAL-vN.mp4"`, `"out": "../<p> VERTICAL-v1.mp4"`, the `layout` above and `"cards": []`, then
  `card_overlays.py "overlays/cards-v.json" --step render` (tested on 8 s of JCT; its overlays ride inside the slide
  pane because they are already in the FINAL).

## Rules

- **The audio is the spine's, stream-copied** (Mike's Enhance Speech pass is in it): no re-level, no music.
- **Frame timing = the spine's** (`-fps_mode passthrough`). A desilenced spine has small timestamp gaps at its
  joins; forcing `-r 30` duplicated 19 frames on near-vs-tao and put the picture one frame behind the audio by the
  second half. Output frame count must equal the spine's.
- **Look**: stills enter over 11 frames, 0.93 -> 1 scale with alpha (ease-out cubic, the spotlight entrance); clips
  fade in over 11 frames (a drawn-on scene starts blank anyway); hold; 0.3 s alpha fade out back to the A-roll. A deck
  card's background is the deck's (bg + two blurred accent orbs); a chart's is the stylesheet's; a beat's is its pen's.
- **An overlay holds one point.** Never the whole slide, never two unrelated cards at once.
- **Never over the webcam or the CTA** (2026-10-31). The region is the deck area; the right column is his.
  **The one exception (Mike, 2026-11-14): a SCRIPTED video (`../script/script.md`).** There a
  cover fills the whole frame and hides the webcam and the CTA by design, and where a cover goes is decided by the
  script's `[COVER]` lines, not by what is on screen, so the slideshow-only rule below does not apply to it either.
  Free talk keeps both rules.
- **Only over the SLIDESHOW (Mike, 2026-11-08, JCT):** when he switches the screen share to another site
  (CoinMarketCap, CoinGlass, the project's website, GitHub), that stretch is NEVER covered; only spans where the
  HTML deck is on screen are open. Map it before picking moments: the deck's nav dots (fixed column at x ~1422,
  y 476 + 25 x i on a 9-slide deck; active dot green) are present only when the deck is up, and the green one names
  the slide. Sample the column at 4 fps and segment it (JCT: `_qa/screen/segments.json`); keep every window wholly
  inside one deck segment of the matching slide, with ~0.3 s margin. Not every deck span needs an overlay.
- No em dashes in anything new written on a card (the deck's own copy is kept verbatim).

## History

- 2026-10-24 **near-vs-tao** (first video): 17:28 master -> 15:40 defumbled (40 cuts) -> 14:08 desilenced (104 cuts) ->
  Enhance Speech v2 (50% / bg 18% / music 10%) -> five FULL-SCREEN cards (the layout before 2026-10-31): the viewer
  quote 0:42, Illia / "Attention Is All You Need" 3:54, voting power 0.4% 7:19, market cap 8:51, Q1-Q3 12:42. Built
  by hand first, then moved into this tool (its output picture verified identical to the delivered FINAL-v1, same
  stream checksum). Its `cards.json` has no `region` (= full frame), so it still reproduces.
- 2026-11-08 **JCT**: 16:35 master -> 13 defumble cuts -> 13:52 desilenced (121 cuts, 800 ms) -> Enhance Speech
  (esv2 40% / bg 10% / music 10%; remux needed `--tolerance 0.15`: the WAV handed out runs 0.13 s past the VIDEO
  track because of AAC padding, the five-point offset check read 0.00 ms) -> 5 deck cards + a system-design chart +
  an animated chart (unlock curve -> 5-of-7 multisig payoff) + a 13.2 s neon-ink whiteboard beat (`JctSmartRender`),
  all inside slideshow-only spans (the nav-dot map above; first video with other sites shared mid-take).
- 2026-10-31 **binance**: the deck-area layout, the `kind` field (image / clip), the first system-design chart, the
  first animated chart and the FIRST whiteboard beat in a real video (neon-ink). 11:39 master, no defumble -> 10:21
  desilenced (87 cuts, 800 ms).
