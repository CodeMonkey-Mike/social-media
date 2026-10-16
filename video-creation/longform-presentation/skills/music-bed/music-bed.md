# music-bed: intro sting + elevator bed for a single-take screen-share

**What it is:** the ONE audio step of the **VS Code coding format** (track doc, "The three formats"). The master is
delivered as recorded: no defumble, no desilence, picture stream-copied, the voice untouched. This skill only lays
music under it:

1. **Intro**: `video-creation/assets/intro-outro/music/musical intro.mp3` (11.9 s, a couple of seconds of guitar
   that dies away) from **0:00**, under the voice, with a clip-gain ramp **0 dB at its first sample -> -40 dB at its
   last**, linear in dB. That is Premiere's two volume keyframes (clip start, clip end); Mike's numbers are always
   Premiere clip gain, never absolute dBFS. Its point is the guitar in the first ~2 s.
2. **Bed**: an elevator track from `video-creation/assets/music/library.json` (rows tagged `elevator`, the seven
   Soundstripe picks Mike made 2026-10-14 for programming videos; random by default, Mike: "just randomly choose")
   starting right after a spoken cue line (print-function: "...stick around because this is a cool course" at
   ~0:55) and running to the last frame, at **-32 dB clip gain** with a 1.5 s fade-in.
3. **Remix loop**: the bed is longer than any song, so ONE bar-aligned region of the song's steady section repeats
   (whole 8-bar phrases, loop_out refined to the best waveform match, 30 ms equal-power crossfade at each join);
   never a whole-song restart. Same rule as `longform-edited/skills/music/music.md` section LOOP (Premiere's
   "Remix"). The bed is END-ALIGNED: the song's real ending lands on the video's last frame and the surplus comes
   off the head (print-function opened 12.7 s into the song).

```
python video-creation/longform-presentation/skills/music-bed/music_bed.py "media/<p>/raw/<timestamp>.mkv" \
    --cue-phrase "this is a cool course" [--track <library id>] --out "media/<p>/<p> FINAL-v1.mp4"
```
- `--cue-phrase` finds the words with local Whisper (small.en, word timestamps) in the first `--cue-window`
  seconds (300) and starts the bed 60 ms after the last word ends; `--bed-start <s>` skips Whisper.
- `--dry-run` prints the track, the cue time, the loop region, its match score and the repeat count. A match under
  0.5 prints a WARN (listen to a join, or pick another `--track`). The finder's picks for every elevator track on a
  15-min video, 2026-10-16: lounge-lover 0.65 (72 s x9), yellow-letter 0.72, duff-and-a-shot 0.69, sidestep 0.62,
  tiki-time 0.82, seaside-samba 0.62, sophistikitty 0.55. The finder needs `bpm` + `analysis.segments`, so the
  unanalysed Envato "Elevator Music" (Gold-Tiger) row is not in the random pool.
- Output: picture stream-copied (frame count printed and checked against the master), audio = voice + music mixed
  with `amix normalize=0` (the voice is never re-levelled), AAC 320k 48 kHz, `+faststart`. A 15-min 1080p30 master
  (~730 MB) takes about 2 min, no video encode.
- Level overrides: `--intro-db`, `--intro-end-db`, `--bed-db`, `--fade-in`. A level round is a re-run to `-v<N+1>`
  (keep the previous FINAL for A/B).

## Why these numbers (print-function review, Mike 2026-10-16)

- v1 had the intro at **-5 -> -40** and the bed at **-27 dB** (the longform-edited rule of thumb, ~18 dB under the
  voice). Mike: the intro "starts off too low", make it "regular at 0"; the bed is "slightly too loud ... -5 dB or
  something". v2 = **0 -> -40** and **-32 dB**: APPROVED and uploaded.
- Measured for reference: voice -19.4 LUFS integrated; the intro file is quiet on its own (-39.7 LUFS, peak
  -26.3 dBFS, it already fades itself ~18 dB); Lounge Lover's full mix is -9.8 LUFS, so -32 dB puts the bed about
  23 dB under the voice (quieter than the longform-edited 16-18 dB target: a coding video is mostly talk over
  code, and the bed also sits alone under the silent typing stretches). The mix peaked at -3.6 dBFS, no limiter.
- Mike skips Adobe Enhance Speech on the coding format (it needs an mp4 round trip through Podcast Studio and the
  voice is fine as recorded), so the music is mixed in here and the FINAL is the upload.
- `musical outtro.mp3` sits next to the intro and is NOT used (print-function had none). Add it only when asked.
