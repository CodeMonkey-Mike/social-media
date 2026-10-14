# longform-presentation / desilence: the track's silence definition (preset)

**What this skill is:** the longform-presentation track's STANDING silence definition, pinned in code in
`desilence_preset.py`, plus the procedure for running it. It is NOT a silence tool. Detection, declick and
the frame-locked render are the canonical desilencer's (`video-creation/skills/desilencer/desilencer.md`,
tool `desilence.py`): the wrapper imports that module and adds nothing to the method. Never write silence
logic here, never single-threshold `silencedetect` (banned repo-wide).

## The definition (Mike, 2026-10-13)

| knob | value | meaning |
|---|---|---|
| min-silence | **800 ms** | a pause of 0.8 s or longer is dead air and is cut; anything shorter is cadence and stays whole |
| residual | **200 ms** | every cut pause keeps 100 ms on each side (`--pad 0.1`), so sentences land 0.2 s apart, never back-to-back |
| zones | **one** | no intro/body split for a presentation |

Why 800: a presenter's inter-sentence beats cluster at 0.6 to 0.8 s (what-to-buy, 2026-10-13: 31 / 31 / 27 pauses
in the 0.6 / 0.7 / 0.8 bins out of 416). 800 ms sits just above that cluster, so it removes only the dead air
(74 of 416 pauses, 110 s out of 11:41, 40 s of it one blank) and leaves the delivery alone; 500 ms would have
taken 184 s and read rushed. This is the opposite intent from the shorts lane's 250 ms rapid-fire default and
from longform-edited's ask-at-the-gate values; those tracks keep theirs.

**Authority:** this preset is the track's canonical default. `--min-sil` / `--pad` are Mike's explicit per-video
deviations; the script banners them loudly and the invocation is their record. A deviation never becomes the
new default by being recent (the shorts lane's 0.95 incident of 2026-08-11 is why this lives in code, not prose).

## Procedure

1. **Defumble FIRST** if the take has retakes / false starts / abandoned fragments
   (`video-creation/skills/defumbler/defumbler.md`); skip it for a clean on-the-fly recording. This pass cuts
   silence only; the two are never combined.
2. **Pick the input.** The master `.mkv` directly when nothing downstream needs a LOW BPS working copy (no deck,
   no Remotion): one lossy generation, sharper screen text. Otherwise the DEFUMBLED / LOW BPS file
   (`../../longform-presentation.md` Phases 1 to 3).
3. **Preview** (optional, about a minute, no render):
   ```
   python video-creation/longform-presentation/skills/desilence/desilence_preset.py "media/<project>/<master>.mkv" --dry-run
   ```
4. **Run** the same command without `--dry-run`. Output: `media/<project>/<project> EDIT.mp4` plus
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
- Output naming: `<project> EDIT.mp4` is the Phase 3 deliverable; `<project> EDIT.map.json` its cut/keep map
  (source coordinates; the keep joins are natural sentence boundaries if a comp ever needs jump-cut anchors).

## History

- 2026-06-14: the three per-track silence scripts in `../../scripts/` (`desilence_audio.py`,
  `desilence_synced.py`, `build_two_zone.py`, single-threshold `silencedetect`, which clipped words) were
  deprecated into redirect stubs when the canonical desilencer was factored out.
- 2026-10-13: track revived for record-and-edit screen-share videos with no deck. The stubs were recycled,
  this skill folder was created and the 800 / 200 definition pinned here. First video: `media/what-to-buy/`.
