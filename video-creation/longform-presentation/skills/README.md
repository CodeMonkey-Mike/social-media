# longform-presentation/skills

**Per-track skills for the 16:9 presentation / screen-share track.** ONE FOLDER PER SKILL (Mike, 2026-09-28,
mirroring `video-creation/skills/` and `longform-edited/skills/`): the folder is named after the skill, the doc is
`<name>/<name>.md`, and every script that belongs to it lives inside. No orphan files at this level.
Track-agnostic skills (defumbler, desilencer, captions, gaze, ...) live in `video-creation/skills/`, not here;
this folder holds the track's POLICY on top of them and any processing customization specific to presentations.

| Skill | Doc | Also in the folder | What it does |
|---|---|---|---|
| `desilence/` | `desilence.md` | `desilence_preset.py` | The track's standing silence definition (800 ms min-silence, 300 ms residual between sentences = 200 ms tail + 100 ms head, one zone) pinned in code, wrapping the canonical desilencer: dry-run preview, cut/keep map, swallowed-speech + A/V drift QA. Phase 2. |
| `spotlight/` | `spotlight.md` | `cue_scenes.py`, `spot_common.py`, `render_spotlight.py`, `stitch.py`, `splice.py` (+ the shared renderer `remotion/src/SpotlightPresentation.tsx`) | Phase 4: the deck re-rendered as one container at a time cued to the narration, head/tail kept as filmed, a breath (`chapter_pause`) before every chapter card. Scene spec -> cue resolution against the EDIT word timings + pause planning -> parts render -> sync-safe stitch (pauses' silence inserted there). Fix rounds re-render only the moved windows and splice them into the previous FINAL. |
| `music-bed/` | `music-bed.md` | `music_bed.py` | Format 3 (VS Code coding videos) — the only processing step: the musical intro from 0:00 (clip gain 0 -> -40 dB), then a random elevator bed from Mike's cue line to the last frame (-32 dB, remix-looped on a bar-aligned region, end-aligned), mixed under the untouched voice, picture stream-copied. |
| `card-overlays/` | `card-overlays.md` | `card_overlays.py` | Format 4 (deck screen share with webcam PiP, free talk): a few full-screen deck cards over the A-roll, one card per moment, cued off the transcript of Mike's enhanced spine. Card pages from the deck's own `<style>` -> 1920x1080 stills -> ONE ffmpeg encode (spotlight entrance, 0.3 s fade out, audio stream-copied, the spine's frame timing) -> contact sheet. No Remotion, no draft. |
| `thumbnail/` | `thumbnail.md` | `export_thumb.py` | Series thumbnails as an EDIT of the previous episode's published thumbnail (Higgsfield nano_banana_2, three takes, Mike picks), exported 1920x1080 JPG under YouTube's 2 MB cap. |

Started 2026-10-13 when the track was revived (first videos through it: `media/what-to-buy/` no-deck, then
`media/history-of-crypto/` with the deck). The track doc (`../longform-presentation.md`) points here from Phases 2
and 4; the repo router (`CLAUDE.md`) has the one-liners.
