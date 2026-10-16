# longform-edited · MUSIC placement (canonical)

How music is laid INTO the edit (levels, looping, fades, end-align, ducking). Sourcing/license is a separate
skill: `../../skills/music-sourcing/`; CHOOSING which track/cut is also not this file — query the analyzed
catalog `../../assets/music/library.json` (music-sourcing `SKILL.md` §2c; whole-video plans =
`music-placement-strategist`). The edit MUST ship with music — never render a silent pass
(longform-edited.md #10). (Consolidated 2026-06-21 after the bed-A-ran-out / no-loop violation on kaspa.)

## Variety across videos (2026-10-01)
The beds of one video are not the beds of the next. Track picks rotate through the usage ledger
(`video-creation/skills/usage-ledger/usage-ledger.md`): the previous video's tracks are blocked, and within each pool
(intro hype · subtle bed · hype body · epic close) the pick is never-used first, then least recently used. The graph gates
it at the `music_plan` node and records the delivered video at `stage_longform`.

## Beds
- One bed per chapter-group, from the screenplay Music plan, with an **inter-bed breath** at each change
  (short fade-out → fade-in, ~0.3-0.5s gap). Prefer the **instrumental** alternate (no vocals under VO).

## LEVEL — measure, don't eyeball
- Beds are mastered HOT (~-10 to -14 LUFS). Measure: `ffmpeg -i bed -af ebur128 -f null -`. Measure the VO too.
- Set the bed **~16-22 dB under the VO** (Mike's standing call on kaspa = bed A 0.040 ≈ 22 dB under a −19.2 LUFS VO).
  Linear gain `volume = 10**(dB/20)`. Use an explicit `MUSIC_DB`/constant, not a raw decimal. It's a ratio, so
  YouTube normalization preserves it.

## ⛔ LOOP — a bed shorter than its span MUST loop, and it loops as a REMIX loop
- If a bed file's duration < the chapter span it covers, it loops. A 178s bed over a 206s span leaves ~28s of
  SILENCE otherwise. **This is the rule that was violated on kaspa (bed A).** Always check `bed_duration ≥ span`
  for every bed; loop if not.
- **HOW it loops (Mike, 2026-10-06, every-job): as a seamless, bar-aligned SECTION REPEAT, the way Premiere Pro's
  "Remix" extends a track to a target length. NEVER a whole-file restart** (a restart is audible: the intro comes
  back, the energy drops, the beat skips). The placement plan names the region per bed: `loop_in_sec` and
  `loop_out_sec` on the track's beat grid (one bar = 60 / bpm × 4 seconds), both inside ONE steady section of the
  catalog `analysis.segments` (a verse or chorus plateau, not across a build or a drop), a whole number of bars
  apart, so the audio at `loop_out` matches the audio at `loop_in`. The region repeats as many times as the span
  needs, and the file's REAL ending is kept for any right-aligned hit (play from the loop's exit into the ending,
  not from the top). The older `loop_point_sec` field means `loop_in_sec`; write the pair.
- **Mixer: `scripts/mix_music.py` repeats the region with ffmpeg `aloop` (2026-10-07).** A bed row with `loop_in_sec` + `loop_out_sec` plays from `source_in` to `loop_out`, repeats the region as many extra passes as the span needs, then runs on into the file's real ending. The surplus comes off the TAIL by default; the LAST bed (and any row with `align_end: true` or `align: "end"`) sheds it from the HEAD so the ending lands on the span end, so pick `source_in` and the region so that surplus is small. `--dry-run` prints each loop's extra passes and trims. A `cover: loop` row with no region still falls back to the old whole-file restart with a WARN, and the graph's music_plan verifier now REFUSES such a plan when the file is shorter than its span.

## Fades + end-align
- **Inter-bed breath** at each bed change (fade the outgoing ~0.3s, fade the incoming in).
- **Hot entry → fade-in:** if a bed hits ~0 dBFS in its first seconds, ramp it in (e.g. −50 → nominal over ~15s).
- **End-align the FINAL bed** so the track's last beat lands on the video's last frame: start the `<Audio>` with
  `startFrom = track_duration − final_span_duration` (so the tail, not the head, plays under the close).

## Ducking (vibe cuts)
- On a vibe-cut / biggest conviction beat: duck the bed ~18% across the hit via a per-frame
  `volume={(f)=>...}` dip (NOT a separate edit). Pair with the bigger impact.
- **Clip inserts duck AUTOMATICALLY** (`scripts/mix_music.py` reads the paused-spine sidecar's `pauses[].clip` and drops
  every bed -14 dB with a 0.3 s ramp under a spliced clip's own voice): no manual automation row, and no bed change, hard
  hit or riser inside an insert's window (`../clip-inserts/clip-inserts.md`, 2026-10-09).

## Dynamic leveling (only when asked)
- When Mike asks the bed to "come down when it gets loud, up when subtle," bake it into the track:
  `ffmpeg -i bed -af dynaudnorm=f=200:g=15:p=0.6:m=8 out.wav`, then play that at one constant low gain.

## The mix is CODE now (2026-09-28): `scripts/mix_music.py` = the graph's `mix_audio` node
`python video-creation/longform-edited/scripts/mix_music.py <media/<project>> --video <draft.mp4>` lays the MUSIC-PLAN beds
(sh()-mapped through the card pauses, fade-in so the bed is full on the chapter's first word, 0.4 s fade at each card,
the plan's seats + automation dips, `relative: true` rows = dips), the EDIT-PLAN `[IMPACT]`/`[RISER]` rows (their
`file start` times; card impacts on the card landing) and the library transitions' SFX (engine-window start) onto
the render with ONE sync-safe filter_complex, video copied, and writes `mix-audio.json` (every resolved time and
gain + the rerun command). Re-mix = re-run it. The section below stays as the WHY.
A chapter that CONTINUES the previous chapter's bed with no title card between them (same file, sample-continuous
`source_in`) is merged into ONE placement, so the file never restarts or doubles; only the last bed runs to the end
of the video. `--dry-run` prints where every bed starts and stops without rendering (2026-10-01).

## ⛔ PERSIST THE MIX — the command is a project artifact, not shell history (ethereum-rwa, 2026-08-01)
_Today the persisted artifact is `scripts/mix_music.py` + the project's `mix-audio.json` (section above); do NOT write a new
shell mix script. The paragraph below is the history that led there._
The bed mix gets re-run every time the picture changes, so **write the ffmpeg mix into a script in the project
folder** (historically `media/<project>/mix-music.sh`) the first time you run it, and reference THAT on every re-mix.
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
