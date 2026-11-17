# linkedin-cut: the LinkedIn version of every AI Engineering Simplified video

**Standard deliverable (Mike, 2026-11-09):** every FINAL render for the **AI Engineering Simplified** channel
(`@aiEngineeringSimplified`, any track: longform-presentation formats incl. the VS Code coding series, longform-edited,
ai-engineering) also ships a LinkedIn version, because LinkedIn caps native video at **10 minutes**. NOT for the crypto
channel. First done by hand on artifacts (2026-11-05); made standard on variables (2026-11-09).

- FINAL **under 10:00** (with a 2 s margin): no LinkedIn version, the FINAL uploads to LinkedIn as is. The script says so.
- FINAL **over**: cut the FINAL in a pause after a sentence that lands as an ending, then **10 s of the end card**, the
  whole file under 9:58. Output `<FINAL stem>-LINKEDIN.mp4` next to the FINAL; Mike uploads it himself (never queued).

## The end card (fixed, built in code)

The artifacts card: the thumbnail's royal-to-teal diagonal blue gradient, **"Watch the full video on YouTube"** in white
Arial Black, and the handle **`@aiEngineeringSimplified`** in black on a yellow (#FFF000) banner, 1920x1080, silent.
Written to `linkedin-end-card.png` in the project folder on every run. (The artifacts upload spelled the handle
`@aiEngineeringSimplied`, a 404; the handle is a constant in the script now. Check it is still right if the channel is
ever renamed.)

## Steps

```
python video-creation/skills/linkedin-cut/linkedin_cut.py "<FINAL.mp4>" --list
python video-creation/skills/linkedin-cut/linkedin_cut.py "<FINAL.mp4>" --cut-after "<the last words before the cut>"
```

1. `--list` transcribes the ~150 s before the latest allowed cut (local Whisper small.en, word timestamps) and prints
   every sentence end that still fits, with the pause after it.
2. **Pick the ending (judgment):** the last sentence that closes a thought, NOT just the latest one that fits. Never stop
   mid-analogy or mid-example, never on a filler "Right." Prefer a line with a real pause after it. Losing the outro /
   subscribe ask is fine: the card replaces it. (variables: "...Python is the preferred language of AI." at 9:34, not
   the 9:45 "I give the analogy of being a lifeguard, right?", which opens a story the cut would never finish.)
3. `--cut-after "<words>"` finds that sentence, then **measures** the real end of the voice on the FINAL mix (10 ms RMS,
   first 200 ms under -35 dB, between the voice ~-22 and a music bed ~-40) because Whisper word ends drift (variables:
   0.25 s early, the first render faded the last syllable of "AI"). Cut = voice end + 0.5 s (never within 0.1 s of the
   next speech); the audio fades out over that tail, the card is silent. `--cut-at <s>` overrides by hand.
4. Re-encode (libx264 crf 20, AAC 192k 48 kHz, 1080p30, `+faststart`; about 2 min for 10 min of screen share). The
   script fails if the result is over the limit.
5. **QA:** a frame just before the cut and one in the card (handle spelled right), plus the RMS around the cut (the
   voice is at full level until it ends, then the fade). Give Mike the path.

Options: `--card-sec` (10), `--handle`, `--out`.

**A vertical FINAL (2026-11-16, clip-evals: "the vertical version is for LinkedIn in this case"):** the card is drawn at
the FINAL's own frame size, so a 1080x1920 FINAL gets a portrait card (`linkedin-end-card-1080x1920.png`, the line
wrapped, the text fit to the width; the 1920x1080 card is unchanged). The vertical and the 16:9 share one timeline, so
pick the ending on the 16:9 with `--list` / `--cut-after` and give the vertical the same second with `--cut-at <s>`.
Which one Mike posts to LinkedIn is his call per video.
