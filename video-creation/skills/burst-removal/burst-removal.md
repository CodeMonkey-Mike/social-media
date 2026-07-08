# burst-removal — excise ONE anomalous sound burst between two words

Reusable, track-agnostic procedure to surgically remove a single **anomalous sound burst** — a
throat-clear, cough, click, lip-smack, mic-bump, swallow, breath-pop — from a finished spoken track,
**without clipping the words on either side**. Point it at any video or audio file. Used by
`longform-edited`, `longform-presentation`, shorts, vertical-AI-persona, and anything with recorded VO.

> **Why this is its own skill (not defumbler, not desilencer).** A burst is *loud*, so the
> **desilencer keeps it** (it's above the audio threshold, not silence) and the **defumbler ignores it**
> (it's not a retake/false-start). It survives every automated pass and reaches the "finished" spine,
> where a human notices it. It needs a **targeted, location-given** cut. This skill is that cut.
> Born from the Kaspa-founder spine, 2026-06-30, where a throat-clear was *claimed* cut but had leaked
> all the way into the locked final because the earlier work trusted a cut-plan instead of the file.

Siblings: `defumbler/defumbler.md` (retakes), `desilencer/desilencer.md` (silence/pacing),
`cover-blackout/cover-blackout.md` (face-gating). Same DNA: **cut only inside silence, both tracks
together, sync-safe `filter_complex`, jump-cut — never the concat demuxer, never blacked-with-audio-kept.**

---

## The method in one line

**Find the millisecond the prior word ENDS → that is the cut start. Find the millisecond the next
word BEGINS → that is the cut end. Remove everything between them (audio + video, one cut).** The
burst lives in that gap; deleting the gap deletes the burst and butts the two words together.

Snap each cut edge into the **silence floor just inside** the word boundary (the `<SIL` trough), so a
few ms of drift can never clip a word. Two boundaries, both in silence, is the whole trick.

## HARD RULES (non-negotiable)

- **Cut start = end of word A. Cut end = start of word B.** Nothing else defines the edges.
- **Both edges sit in silence.** Place them in the `<SIL` trough after word A and before word B,
  bracketing the burst. Never put a cut edge on a non-silent sample (it clips the word or leaves a
  stub of the burst).
- **Cut both tracks together (jump-cut).** One `filter_complex` removing the same span from A and V.
  Never keep audio while blacking video; never split the a/v cut points.
- **Sync-safe `filter_complex` only** (`trim`/`atrim` + `concat`). NEVER the concat demuxer (A/V drift).
- **VERIFY ON THE OUTPUT FILE, not the plan.** After the cut, re-probe the *actual rendered file*:
  the join must read as a silence valley (burst gone) and Whisper across the join must read "wordA
  wordB" with both intact. This step is the reason the skill exists — the prior failure marked it
  "done" off the cut-plan and shipped the burst. **Not verified on the file = not done.**
- **It may live in more than one file.** Because a burst survives desilencing, the same burst exists
  in every downstream derivative (`.d.cleaned` → `.e.desilenced` → `.f.final`) at a *shifted* timecode.
  Remove it from each (re-locate per file), or re-derive the chain from the earliest fixed file.

---

## Procedure

Inputs you need: the **file**, an **approximate timecode**, and ideally **the two words** the burst
sits between (e.g. "...and why. [clear] So where..."). Work on a copy / keep a `*.bak-burst.mp4`.

### 1. Locate the word boundaries (Whisper)
Cut a ~8-10 s clip around the spot and get word timestamps. Whisper word times **drift** (≤~2.5 s,
run-to-run), so use them only to BRACKET — confirm the exact edges with the RMS profile in step 2.
```bash
ffmpeg -hide_banner -y -ss <t-5> -to <t+5> -i "<file>" -vn -ar 16000 -ac 1 seg.wav
"<whisper.exe>" seg.wav --model small.en --word_timestamps True --output_format json --output_dir . --language en
# add the clip's start offset back to each word's start/end
```
(Whisper path on Mike's box: `~/AppData/Local/Programs/Python/Python312/Scripts/whisper`. Local CLI —
never ask for a Groq/OpenAI key.)

### 2. Profile the energy (the silence troughs + the burst)
```bash
python video-creation/skills/burst-removal/scripts/burst_profile.py "<file>" <start> <end>
```
Reads the file's real sample rate, prints per-10 ms RMS. You are looking for:
`...wordA decaying → <SIL trough → a loud << hump (THE BURST, where the transcript says silence) →
<SIL trough → wordB onset`. The burst is the only loud energy that does not correspond to a word.

### 3. (If the burst is a *visible* gesture in a FACE beat) check the frames
A throat-clear is usually a head-dip / look-away. Extract a frame strip across the event and decide:
- If the next word begins while the head is still moving, a clean hard cut leaves a **head-position
  jump**. Default: let the comp's FACE-cut glitch (e.g. Blocks·Max) mask it. Alternative: nudge the
  cut-in a few frames so the pre/post head positions match (down→down), accepting a tiny residual
  glance. State the trade-off; don't silently pick.
```bash
for t in <a> <b> <c> ...; do ffmpeg -hide_banner -ss $t -i "<file>" -frames:v 1 -vf scale=420:-1 -q:v 3 f_$t.jpg -y; done
```

### 4. Set the two cut points
- **cut_start** = a sample in the `<SIL` trough AFTER word A decays, BEFORE the burst rises.
- **cut_end**  = a sample in the `<SIL` trough AFTER the burst decays, BEFORE word B's onset.
Both from step 2's readout. Keeping a few ms of silence inside each word boundary is correct.

### 5. Cut (sync-safe, both tracks)
```bash
ffmpeg -hide_banner -y -i "<file>" -filter_complex \
"[0:v]trim=start=0:end=<cut_start>,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=<cut_start>,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=<cut_end>,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=<cut_end>,asetpts=PTS-STARTPTS[a1];\
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30000/1001 -c:a aac -b:a 128k "<out>"
```
Match `-r` to the source frame rate (probe `avg_frame_rate`). `-crf 18` keeps the join visually lossless
on a proxy. Write to `<file>.fixed.mp4`, verify, then promote over the original.

### 6. VERIFY on the output (mandatory — the whole point)
```bash
# RMS at the join: must be a silence valley, no loud hump where the burst was
python video-creation/skills/burst-removal/scripts/burst_profile.py "<out>" <cut_start-0.3> <cut_start+0.3>
# Whisper across the join: must read "wordA wordB", both words whole, no artifact
ffmpeg -hide_banner -y -ss <t-5> -to <t+3> -i "<out>" -vn -ar 16000 -ac 1 v.wav && "<whisper.exe>" v.wav --model small.en --word_timestamps True --output_format json --output_dir . --language en
```
Only after both pass: promote `<out>` over the original (keep the `*.bak-burst.mp4`), and remove the
same burst from any downstream files (step "It may live in more than one file").

---

## Worked example (Kaspa-founder, 2026-06-30)
Burst: throat-clear between "...and why." and "So where does this guy come from." In `f.final`:
word A "why" ended 70.60 s, burst hump at 70.80-70.93 (peak −17.8 dB) bracketed by `<SIL` at
70.73-70.74 and 70.94-70.96, word B "So" onset 70.97. Cut `70.735 → 70.955`. Verified: Whisper
"...land and why. So where..." both whole; RMS join a −107 dB valley. Same burst re-located and cut
in `.d.cleaned` (78.665→78.865) and `.e.desilenced` (70.735→70.955).
