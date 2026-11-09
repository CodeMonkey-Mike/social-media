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
change every few seconds (a whole lecture), that is format 1's `../spotlight/spotlight.md`, not this.

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
| `media/standard/<p>/overlays/cards.json` | the per-video spec: `deck`, `spine`, `out`, `region`, and per card `id`, `in`, `out` (spine seconds), `say` (the words it covers), `kind`, `zoom` + `orbs` (deck) or `src` (image / clip) |
| `media/standard/<p>/overlays/<id>.body.html` | one deck card's markup, deck classes, the deck's text verbatim (authored) |
| `media/standard/<p>/overlays/<id>.html` / `<id>.png` / `_frames/` | generated (page, still, entrance frames) |
| `media/standard/<p>/overlays/<id>.brief.md` | a chart's or a whiteboard beat's brief for its agent (the words, the idea, the facts) |
| `media/standard/<p>/assets/diagrams/`, `assets/charts/` | the chart-builder's outputs (its fixed layout) |

## Procedure

1. **The spine first** (track doc, format 4): defumble if the take has retakes (binance: none, Mike's call) ->
   preset desilence (800 ms, `../desilence/`) -> hand Mike the EDIT's audio as a WAV for his Enhance Speech pass
   (`spine/<p> EDIT.wav`; he said 2026-10-31 "you have to give me the audio file"). The enhanced track comes back
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
- No em dashes in anything new written on a card (the deck's own copy is kept verbatim).

## History

- 2026-10-24 **near-vs-tao** (first video): 17:28 master -> 15:40 defumbled (40 cuts) -> 14:08 desilenced (104 cuts) ->
  Enhance Speech v2 (50% / bg 18% / music 10%) -> five FULL-SCREEN cards (the layout before 2026-10-31): the viewer
  quote 0:42, Illia / "Attention Is All You Need" 3:54, voting power 0.4% 7:19, market cap 8:51, Q1-Q3 12:42. Built
  by hand first, then moved into this tool (its output picture verified identical to the delivered FINAL-v1, same
  stream checksum). Its `cards.json` has no `region` (= full frame), so it still reproduces.
- 2026-10-31 **binance**: the deck-area layout, the `kind` field (image / clip), the first system-design chart, the
  first animated chart and the FIRST whiteboard beat in a real video (neon-ink). 11:39 master, no defumble -> 10:21
  desilenced (87 cuts, 800 ms).
