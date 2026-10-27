# longform-presentation / card-overlays: a few full-screen deck cards over a screen share (format 4)

**What this skill is:** the last step of the track's **format 4** (`../../longform-presentation.md`, "The four
formats"): Mike screen-shares an HTML deck with his webcam PiP and talks freely, and a handful of moments (five on
the first video) get ONE deck card blown up to fill the whole 1920x1080 frame, covering the deck, the webcam and the
Premium Membership box, for exactly as long as he talks about that point. Everything else stays as filmed. Mike,
2026-10-24: "the history of crypto video was nearly the entire video made like that"; here it is a few spots, and the
track stays "a very simple version of the long-form editor, not doing much stuff at all".

**No Remotion.** A card is a still: the deck's own HTML, enlarged, screenshotted. One ffmpeg encode composites every
card over the spine (Mike, 2026-10-24: "great that you did not need to do a remotion build"). No draft render: the
one render is the FINAL. When cards change every few seconds (a whole lecture), that is format 1's
`../spotlight/spotlight.md`, not this.

## Files

| file | role |
|---|---|
| `card_overlays.py` | the tool: `pages` (card HTML from the deck's `<style>`) -> `shoot` (1920x1080 PNGs, Playwright) -> `render` (one libx264 crf 18 pass, audio stream-copied) -> `qa` (contact sheet) |
| `media/<p>/overlays/cards.json` | the per-video spec: deck, spine, out, and per card `id`, `in`, `out` (spine seconds), `say` (the words it covers), `zoom`, `orbs` |
| `media/<p>/overlays/<id>.body.html` | one card's markup, deck classes, the deck's text verbatim (authored) |
| `media/<p>/overlays/<id>.html` / `<id>.png` / `_frames/` | generated (page, still, entrance frames) |

## Procedure

1. **The spine first** (track doc, format 4): defumble -> preset desilence -> Mike's Enhance Speech pass, which he
   drops into `spine/` (it comes back as the same video with a 48 kHz audio track: confirm the video stream copied
   untouched, `-c copy -f md5` of both, and the audio offset at a few points). Then transcribe THAT file
   (`scripts/transcribe.py`, medium): the cue source.
2. **Pick the moments** (how many: Mike says, five on near-vs-tao). From the transcript, a spot qualifies when he is
   on the slide and saying a single card's point out loud, a self-contained sentence or two, 8 to 25 s. Spread them
   across the video. **Skip any span where what he says contradicts the deck** (a misspoken number): a card showing
   1.85M under "1.1 million needed" reads as an error. Grab a frame from each window to confirm the matching slide
   is on screen.
3. **Author the cards**: one `<id>.body.html` per spot, ONE card or snippet from the deck (a single bullet inside
   its column's frame, a quote, one table row, a declared row such as Q1-Q3), the deck's text verbatim, sized to
   fill the frame (`zoom` 1.65 to 2.0 at the 1920 viewport). `cards.json` timing: `in` ~0.3 s before the first word
   (the pause before it), `out` ~0.2 s after the last word, never across into the next point.
4. **Run it**:
   ```
   python video-creation/longform-presentation/skills/card-overlays/card_overlays.py "media/<p>/overlays/cards.json"
   ```
   About 3.5 min for a 14-minute spine. The shoot step prints the loaded fonts per card (all the deck's families,
   no fallback) and flags a card that overflows the frame; the render prints the frame count check (output frames
   == spine frames, or it is not delivered).
5. **QA**: open the contact sheet (`media/<p>/_qa/<out>-cards-sheet.png`): per card, the frame before it (A-roll),
   mid-entrance, the hold, mid-exit, after (A-roll back). Then deliver the absolute path with the card list in
   VIDEO time (Mike watches and checks them by timestamp).
6. **A fix** (a card's text or timing): edit the body or `cards.json`, re-run (`--step pages|shoot|render|qa` for a
   part), new `-vN` in `out`.

## Rules

- **The audio is the spine's, stream-copied** (Mike's Enhance Speech pass is in it): no re-level, no music.
- **Frame timing = the spine's** (`-fps_mode passthrough`). A desilenced spine has small timestamp gaps at its
  joins; forcing `-r 30` duplicated 19 frames on near-vs-tao and put the picture one frame behind the audio by the
  second half. Output frame count must equal the spine's.
- **Look**: entrance 11 frames, 0.93 -> 1 scale with alpha (ease-out cubic, the spotlight entrance), hold, 0.3 s alpha
  fade out back to the A-roll. The card's background is the deck's (bg + two blurred accent orbs).
- **A card holds one point.** Never the whole slide, never two unrelated cards at once.
- No em dashes in anything new written on a card (the deck's own copy is kept verbatim).

## History

- 2026-10-24 **near-vs-tao** (first video): 17:28 master -> 15:40 defumbled (40 cuts) -> 14:08 desilenced (104 cuts) ->
  Enhance Speech v2 (50% / bg 18% / music 10%) -> five cards: the viewer quote 0:42, Illia / "Attention Is All You
  Need" 3:54, voting power 0.4% 7:19, market cap 8:51, Q1-Q3 12:42. Built by hand first, then moved into this tool
  (its output picture verified identical to the delivered FINAL-v1, same stream checksum).
