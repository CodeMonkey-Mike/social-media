# longform-to-short — condensing a finished VERTICAL longform into a ~40s short

_Canonical skill for turning an APPROVED vertical (1080×1920) longform-edited cut into a short-form
vertical video with a spoken CTA outro. Self-contained so it survives a project folder being deleted.
Sibling to `vertical-repurpose.md` (which produced the source) — that skill owns the reframe, this one
owns the condensation. Read this BEFORE building any longform-derived short._

## When this runs

After the vertical longform exists and Mike has approved it. **The short is a CONDENSATION, not a new
edit**: every frame of video and every word of audio already exists in the vertical master. Nothing is
re-shot, re-voiced, or re-covered — the only new material is the outro card and its one TTS line.

## 0. Why this is NOT the livestream clip-selection lane

`clip-strategist` picks clips out of a RAW livestream, where the only content is Mike talking and the
visual is decided later. Here the source is a **tightly edited film**: every second is already covered
by a specific visual, transitions sit between beats, charts animate on their own clock, and captions are
burned in on face beats. So a span choice is simultaneously an AUDIO choice and a VISUAL choice — cut at
3:18 and you get the C4 diagram, not his face. That is why this lane has its own strategist
(`short-cut-strategist`) and its own boundary rules.

## 1. The two sources (they share ONE clock)

| Need | File | Notes |
|---|---|---|
| **Video** (all visuals composited: b-roll, slides, charts, captions, transitions) | `<project>/<name>-VERTICAL.mp4` | the delivered vertical |
| **Audio** (VO ONLY, no music, no SFX) | `<project>/spine/ALL.f.paused.mp4` | the paused spine |

**Both run on FINAL-VIDEO time** (source spine seconds + 1s per baked chapter card, i.e. the comp's
`sh()`), so a span `[a,b]` cuts identically out of both. Confirm the two durations match to ~0.2s before
you cut anything; if they don't, you have the wrong spine letter.

Take the VO from the SPINE, never from the vertical master, for TWO reasons:

1. The master's audio has the music bed and SFX baked in, and a bed cut at 5 arbitrary points jumps
   audibly at every seam.
2. **The master's audio sits ~42.7 ms behind its own video** — 2048 samples of AAC encoder priming from
   the ffmpeg mix step, which the mp4 muxer does not compensate with an edit list. Measured on kaspa
   30bps: constant across the whole file (identical at 33s, 200s and 400s), normalized cross-correlation
   peak 0.974. It is well inside the perceptual tolerance for audio-lags-video so it is not a defect to
   chase in a delivered file, but pairing master VIDEO with SPINE audio removes it for free, so the
   short ends up in tighter sync than its own source. Verify it before you build:

```python
# peak lag between master audio and spine audio; expect ~0 after you understand the priming
c = np.correlate(master - master.mean(), spine - spine.mean(), 'full')
lag = (c.argmax() - (n - 1)) / sr        # >0 = master audio is LATE by that much
```

## 2. Shape of the short (the strategist authors this)

A 40s short is a complete little argument, not a highlight reel:

```
0:00-0:03   HOOK      the single hardest line; usually the longform's own hook, which was engineered for it
0:03-0:33   BODY      2-4 spans that land ONE claim and its proof. Not a summary of the video, ONE idea.
0:33-0:37   KICKER    the payoff line that makes the claim feel earned
0:37-0:40   OUTRO     text card + TTS: "Click below to watch the full video." (§4)
```

Budget the outro INSIDE the target length — a "40 second short" is 40 seconds delivered.

## 3. Span rules (all are hard; the strategist must respect them and the builder must verify)

1. **Cut only at a measured trough in the SPINE, and never on a Whisper word boundary.**
   ⛔ **MECHANICAL GATE — `python skills/lint-short-spans.py <cut-plan.json> <spine/ALL.f.paused.mp4>
   --write-snapped <snapped.json>` must pass (exit 0), and the BUILD USES THE SNAPPED PLAN.**

   Understand what this gate is doing, because the source is unlike a raw recording. **The spine is
   DESILENCED — the silence was deliberately removed** — so there is no quiet band to cut in. What
   remains between two words is 100-180 ms of breath and plosive tail containing a narrow instantaneous
   trough (measured on kaspa 30bps: -61 to -95 dBFS, but only 5-15 ms wide). Whisper's word boundary is
   NOT that trough: a 180 ms "gap" still held 5 ms windows at -18 dBFS. So the gate finds the nearest
   real trough and snaps the boundary to it, typically by 5-35 ms when the plan is close and ~270 ms
   when the plan landed mid-word.

   Because the trough is narrow, **every audio splice gets a ~12 ms crossfade** (the same principle as
   the desilencer's 8 ms declick). Butt-joining two troughs still clicks.
2. **Never cut inside a transition window** (`TRANSITIONS.md`) or mid-animation on a Type 1 chart. You
   will land on a half-melted frame or a bar frozen at 40%.
3. **Self-contained test.** Every span must make sense cold. Reject spans that open on "as I said",
   "that's why", "so it", or any pronoun whose referent is 4 minutes earlier.
4. **Visual variety.** Do not take 3 spans that are all covered by the same b-roll clip or the same
   diagram — the short will read as one static image with a voiceover.
5. **Assembly order is a narrative choice**, not necessarily chronological, but the audio must not
   contradict itself (don't put a conclusion before the fact it depends on).
6. **Nothing is re-timed inside a span.** No speed-ups, no internal trims. A span is a verbatim slice.

## 4. The CTA outro (Higgsfield MIKE-CLONE TTS)

The last ~3s: a full-frame text card reading **"WATCH THE FULL VIDEO"** (house stylesheet, no em dashes)
over the last frame or a held b-roll, with Mike's cloned voice saying the line.

- **Generate the voice via `video-creation/skills/higgsfield-voice/SKILL.md`** — Higgsfield has NO TTS
  API, so this is the Playwright/CDP browser flow against the `hfbot-profile` Chrome on port 9333, Audio
  tab → Seed Speech → voice preset **MIKE-CLONE**. That skill owns every rule; do not hand-roll a driver.
- **Apply its TTS markup rules**: ALL-CAPS only on content words of 5+ letters (short words clip), `...`
  for a beat. The shipped line is `Click below to WATCH the full video.` — not `CLICK BELOW` (caps on a
  4-letter word clips), and ⛔ **not a trailing `!`**: `!` lifts the LAST word, so the first take stressed
  "video" and Mike caught it on first listen. End on a period and let the CAPS carry the stress.
- **QA the take with local whisper** before it goes in the mix. A garbled CTA is the one line every
  viewer hears.
- **The approved take is a SHARED asset: `video-creation/assets/vo/cta-watch-full.mp3`** (Mike, 2026-07-25),
  sitting with the shared music/sfx/transitions, NOT in any project folder. Reuse it for every short off
  every project; see `assets/vo/README.md`. Regenerate only when the line changes or Mike rejects the
  reading, and edit `assets/vo/CTA-SCRIPT.md` first so `verify-tts.js` can gate the chunks. It costs
  credits, so it needs Mike's OK (root `CLAUDE.md` cost rule), and a needless re-roll also DRIFTS the
  delivery, which would leave shorts from different videos ending on different readings.

## 5. Build

Three stages. Do NOT point the comp straight at the 7-minute master: seeking one `OffthreadVideo` to five
scattered points in a 130 MB h264 file is the same frame-proxy saturation that has killed renders in this
track before (`comp-build.md` §6a). Pre-extract instead.

**Stage A (ffmpeg) — cut the spans to small intermediates.** Per span, video-only from the master and
audio-only from the spine, both frame-exact:

```bash
ffmpeg -y -ss <start> -i <master> -frames:v <n> -an -c:v libx264 -crf 16 -preset veryfast _short/span-N.mp4
ffmpeg -y -ss <start> -i <spine>  -t <dur>     -vn -c:a pcm_s16le                        _short/span-N.wav
```
Use `-frames:v`, never `-to` (which measures from the seek point, not the timeline — it has produced
wrong-length output in this repo before). Verify each intermediate's frame count before continuing.

**Stage B (Remotion) — assemble.** 1080×1920 at 30fps, one `OffthreadVideo` per span intermediate laid
end to end in `Sequence`s, plus the caption layer and the outro card. Small linear-played files, so no
seeking cost. Point `--public-dir` at the folder holding the intermediates and the CTA card PNG.

**Stage C (ffmpeg) — audio.** Concat the span wavs, append the CTA take, lay the bed, mux (§6).
- **Seams**: a short hit from the video's own transition family (`TRANSITIONS.md`) between spans. Keep it
  fast (~0.3s) — a short cannot afford a luxurious dissolve.
- **⛔ CAPTIONS — the trap.** The longform burns captions on FACE beats ONLY (`CAPTION_SRC = FACE`), so a
  span cut from a COVER beat arrives with NO captions and a short must be captioned end to end. Add the
  house caption track (`captions-builder`) over the COVER-sourced output frames ONLY. Compute those
  frames from the project's FACE table; never blanket-overlay, or you double up on the face spans.
- **Audio**: concat the VO spans from the paused spine (sync-safe `filter_complex`, never the concat
  demuxer), then mix per §5 below.

## 6. Mix

One continuous bed across the whole short, chosen from the project's `MUSIC-PLAN.json` (usually the
bed that scored the chapter the hook came from), at the house level (~16-18 dB under VO — measure LUFS,
never guess). Optional: a soft whoosh on each seam. The CTA line sits at VO level, not under the bed.

## 7. QA + deliver

- **Listen to every seam** — the #1 defect is a clipped word or a bed jump at a splice.
- **Read frames at every seam** — no half-transition, no frozen chart.
- **Confirm captions are continuous** end to end and never doubled.
- **Confirm the total runtime** matches the target (40.0s ± 0.2s).
- Deliver as `<name>-SHORT-40s.mp4` with the full absolute path. It is a SEPARATE deliverable; only
  stage it into a queue when Mike says so.
