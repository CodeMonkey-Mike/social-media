# longform-edited · MUSIC placement (canonical)

How music is laid INTO the edit (levels, looping, fades, end-align, ducking). Sourcing/license is a separate
skill: `../../skills/music-sourcing/`; CHOOSING which track/cut is also not this file — query the analyzed
catalog `../../assets/music/library.json` (music-sourcing `SKILL.md` §2c; whole-video plans =
`music-placement-strategist`). The edit MUST ship with music — never render a silent pass
(longform-edited.md #10). (Consolidated 2026-06-21 after the bed-A-ran-out / no-loop violation on kaspa.)

## Beds
- One bed per chapter-group, from the screenplay Music plan, with an **inter-bed breath** at each change
  (short fade-out → fade-in, ~0.3-0.5s gap). Prefer the **instrumental** alternate (no vocals under VO).

## LEVEL — measure, don't eyeball
- Beds are mastered HOT (~-10 to -14 LUFS). Measure: `ffmpeg -i bed -af ebur128 -f null -`. Measure the VO too.
- Set the bed **~16-22 dB under the VO** (Mike's standing call on kaspa = bed A 0.040 ≈ 22 dB under a −19.2 LUFS VO).
  Linear gain `volume = 10**(dB/20)`. Use an explicit `MUSIC_DB`/constant, not a raw decimal. It's a ratio, so
  YouTube normalization preserves it.

## ⛔ LOOP — a bed shorter than its span MUST loop
- If a bed file's duration < the chapter span it covers, add `loop` to the `<Audio>`. A 178s bed over a 206s
  span leaves ~28s of SILENCE otherwise. **This is the rule that was violated on kaspa (bed A).** Always check
  `bed_duration ≥ span` for every bed; loop if not.

## Fades + end-align
- **Inter-bed breath** at each bed change (fade the outgoing ~0.3s, fade the incoming in).
- **Hot entry → fade-in:** if a bed hits ~0 dBFS in its first seconds, ramp it in (e.g. −50 → nominal over ~15s).
- **End-align the FINAL bed** so the track's last beat lands on the video's last frame: start the `<Audio>` with
  `startFrom = track_duration − final_span_duration` (so the tail, not the head, plays under the close).

## Ducking (vibe cuts)
- On a vibe-cut / biggest conviction beat: duck the bed ~18% across the hit via a per-frame
  `volume={(f)=>...}` dip (NOT a separate edit). Pair with the bigger impact.

## Dynamic leveling (only when asked)
- When Mike asks the bed to "come down when it gets loud, up when subtle," bake it into the track:
  `ffmpeg -i bed -af dynaudnorm=f=200:g=15:p=0.6:m=8 out.wav`, then play that at one constant low gain.

## ⛔ PERSIST THE MIX — the command is a project artifact, not shell history (ethereum-rwa, 2026-08-01)
The bed mix gets re-run every time the picture changes, so **write the ffmpeg mix into a script in the project
folder** (e.g. `media/<project>/mix-music.sh`) the first time you run it, and reference THAT on every re-mix.
On ethereum-rwa the approved 4-bed mix existed only in a dead session's shell; the PROJECT-LOG said "copy the
command from the v5 mix" and there was nothing to copy. Reconstructing it from `MUSIC-PLAN.json` means redoing
every span shift, breath, duck and end-alignment by hand, and getting any one wrong is inaudible-until-Mike.

**Recovery, if it is already lost:** the bed can be extracted by SUBTRACTING the un-mixed render from the mixed
one — `[1:a]volume=-1[i];[0:a][i]amix=inputs=2:normalize=0` — which yields the exact bed as a file you can
re-apply to any later cut with one `amix` and `-c:v copy`. Verify the recovered bed three ways before trusting
it: (1) integrated LUFS lands in the 15-18 dB-under-VO window; (2) its per-chapter levels track the APPROVED
per-bed gains, not the VO envelope (that is what proves it is the bed and not codec residue); (3) the
comp→source time mapping puts the file's last sample on the final frame. Note a bed that measures silent near
the end is usually just the track's own decay scaled down by the bed gain, not a misalignment — check the
source file's tail before "fixing" anything.

## QA (mandatory — the gap the LUFS shortcut missed)
- Verify the **music floor in a no-VO breath of EACH bed** (not just "overall loudness is non-zero" — that can be
  the VO alone while a bed has run out). Confirm no silent stretch, beds transition cleanly, the final bed reaches
  the last frame. **Render a chunk and LISTEN** for level + the duck (video-qa.md), never integrated-LUFS-only.
