# longform-presentation / desilence: the track's silence definition (preset)

**What this skill is:** the longform-presentation track's STANDING silence definition, pinned in code in
`desilence_preset.py`, plus the procedure for running it. It is NOT a silence tool. Detection, declick and
the frame-locked render are the canonical desilencer's (`video-creation/skills/desilencer/desilencer.md`,
tool `desilence.py`): the wrapper imports that module and adds nothing to the method. Never write silence
logic here, never single-threshold `silencedetect` (banned repo-wide).

## The definition (Mike, 2026-10-13; tail pad widened 2026-10-14)

| knob | value | meaning |
|---|---|---|
| min-silence | **800 ms** | a pause of 0.8 s or longer is dead air and is cut; anything shorter is cadence and stays whole |
| tail pad | **200 ms** | kept AFTER the sentence that ends a cut pause: word-final releases (the k+s of "banks", the j of "age") live here |
| head pad | **100 ms** | kept BEFORE the sentence that starts after it; residual = 300 ms, sentences never back-to-back |
| zones | **one** | no intro/body split for a presentation |
| deck lecture | **300 + 200 ms, 900 ms at a slide** | format 1 only (`media/deck-lecture/`), applied automatically; see below |

Why the tail pad is the wide one (2026-10-14, history-of-crypto): the detector's silence starts where the level
first drops under -57 dB, and a word-final stop or affricate has a closure that gets there BEFORE its release.
The release is a short island the 80 ms blip-absorb folds into the silence, so the cut used to start 100 ms
after the closure and ran 20 to 55 ms into the release on 7 of 273 cuts (measured on the DEFUMBLED audio; the
render itself was faithful to the plan at every join). Mike heard the endings clipped and asked for 50 to 100 ms
more; 200 ms covers every measured case with margin (re-measured after the change: 0 of 273 cuts spill, the
quiet before a cut is now 205 ms median, 60 ms minimum at -45 dB). The head pad stays 100 ms: no onset was
ever clipped (0 of 273).

Know the other cause too: on that recording the MICROPHONE CHAIN WAS NOISE-GATED (47% of the master is exact
digital zero, the floor after every phrase falls to -150 dB, fricatives sit ~20 dB under the vowels). A gate
chops quiet word endings at the source, where no pad can bring them back ("banks" at 2:37 of FINAL-v1 is 5 s
from any cut). When the endings sound clipped, check the master before blaming the cut.

Why 800: a presenter's inter-sentence beats cluster at 0.6 to 0.8 s (what-to-buy, 2026-10-13: 31 / 31 / 27 pauses
in the 0.6 / 0.7 / 0.8 bins out of 416). 800 ms sits just above that cluster, so it removes only the dead air
(74 of 416 pauses, 110 s out of 11:41, 40 s of it one blank) and leaves the delivery alone; 500 ms would have
taken 184 s and read rushed. This is the opposite intent from the shorts lane's 250 ms rapid-fire default and
from longform-edited's ask-at-the-gate values; those tracks keep theirs.

**Authority:** this preset is the track's canonical default. `--min-sil` / `--pad-tail` / `--pad-head` are Mike's
explicit per-video deviations; the script banners them loudly and the invocation is their record. A deviation never becomes the
new default by being recent (the shorts lane's 0.95 incident of 2026-08-11 is why this lives in code, not prose).

**Deck lectures (format 1) have their own DEFAULTS (Mike, 2026-11-08: "Yes, we can default those milliseconds for
the deck lectures"):** min-silence stays 800 ms, the residual is **500 ms (300 ms tail + 200 ms head)** and a cut pause
that holds a slide change keeps **900 ms**. The preset applies them automatically when the input is under
`media/deck-lecture/` (`DECK_PAD_TAIL` / `DECK_PAD_HEAD` / `DECK_SLIDE_PAUSE` in code); formats 2 and 4 keep 200 + 100
and no slide pause. Why: the 300 ms residual read "too fast" on a scripted lecture (Crypto vs. The Traditional Financial
System, a 700 ms / 300 ms first pass at 13:02 -> 13:49 on these values, from a 23:27 defumble).

**Slide-change pause (`--slide-pause`, added 2026-11-08; default on for deck lectures, `--slide-pause 0` = off):** on a deck
capture, Mike asked for more air between slides than between sentences ("in between the beginnings and the endings
of each slide, there should be a greater pause", 900 ms). The preset finds the slide changes in the PICTURE (the
deck fades over ~0.5 to 1 s, so a 0.4 s-apart luma diff on tiny frames, not a scene score) and a cut pause that holds
one keeps `--slide-pause` seconds instead of the pad residual, the extra split evenly between the old slide's last
word and the new slide's first. A change inside speech or inside an uncut pause is reported, never touched. The
changes it found go into the map (`slide_changes`). Mind the spotlight's `chapter_pause`: on a deck lecture every
slide is a chapter, so a chapter pause stacks on top of this air (decide one or the other per video).

## Procedure

1. **Defumble FIRST** if the take has retakes / false starts / abandoned fragments
   (`video-creation/skills/defumbler/defumbler.md`); skip it for a clean on-the-fly recording. This pass cuts
   silence only; the two are never combined.
2. **Pick the input.** The `<project> DEFUMBLED.mp4` from Phase 1 (`../../longform-presentation.md`), or the master
   `.mkv` directly when the take needed no defumble: either way the crf 18 EDIT is the one lossy generation (there is
   no LOW BPS working copy on this track; recycled 2026-10-13), which keeps on-screen text sharp.
3. **Preview** (optional, about a minute, no render):
   ```
   python video-creation/longform-presentation/skills/desilence/desilence_preset.py "media/<format>/<project>/<master>.mkv" --dry-run
   ```
4. **Run** the same command without `--dry-run`. Output: `media/<format>/<project>/<project> EDIT.mp4` plus
   `<project> EDIT.map.json` (the folder name is the project name; `--out` overrides). Default encode is the
   canonical tool's libx264 crf 18 (deliverable quality for on-screen text); `--nvenc` is the 2.5 Mbps proxy
   path, not for a deliverable. An encode longer than 10 min is launched detached (visible console, log file)
   and the log is polled; never as a tracked background task.
5. **QA** (the script prints the first two; read them, then do the third):
   - swallowed-speech scan: no cut may hold 100 ms or more of speech-level audio; a flag peaking at
     -45 to -52 dB is a breath, fine; a flag above -35 dB is inspected;
   - A/V drift under 50 ms;
   - extract a frame either side of the biggest join and confirm live footage, no black or frozen frame.

## Files

- `desilence_preset.py`: the preset + wrapper (this folder). Imports
  `video-creation/skills/desilencer/scripts/desilence.py`; the method constants stay there.
- Output naming: `<project> EDIT.mp4` is the Phase 2 spine; `<project> EDIT.map.json` its cut/keep map
  (source coordinates; the keep joins are natural sentence boundaries if a comp ever needs jump-cut anchors).
  The rendered EDIT runs a few ms longer per join than the map's cumulative keep lengths (the video side of a
  join rounds up to the next frame and the concat pads the audio to match; +1.5 s over 273 joins measured), so
  cue work runs on a transcript OF THE EDIT (Phase 3), never on the map's arithmetic.

## History

- 2026-06-14: the three per-track silence scripts in `../../scripts/` (`desilence_audio.py`,
  `desilence_synced.py`, `build_two_zone.py`, single-threshold `silencedetect`, which clipped words) were
  deprecated into redirect stubs when the canonical desilencer was factored out.
- 2026-10-13: track revived for record-and-edit screen-share videos with no deck. The stubs were recycled,
  this skill folder was created and the 800 / 200 definition pinned here. First video: `media/desilence-only/what-to-buy/`.
- 2026-10-14: history-of-crypto review, Mike heard word endings clipped. Measured: 7 of 273 cuts ran 20 to 55 ms
  into a word-final release; the pad became asymmetric, 200 ms tail + 100 ms head (300 ms residual). The
  canonical `desilence.py` gained the optional `pad_head` / `--pad-head` for it (method unchanged). Validated
  the same day: Mike's v2 and v3 reviews raised no further ending complaint (the endings still soft were the
  gated source), and the video shipped on these values.
