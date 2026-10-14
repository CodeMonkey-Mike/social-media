# longform-presentation/skills

**Per-track skills for the 16:9 presentation / screen-share track.** ONE FOLDER PER SKILL (Mike, 2026-09-28,
mirroring `video-creation/skills/` and `longform-edited/skills/`): the folder is named after the skill, the doc is
`<name>/<name>.md`, and every script that belongs to it lives inside. No orphan files at this level.
Track-agnostic skills (defumbler, desilencer, captions, gaze, ...) live in `video-creation/skills/`, not here;
this folder holds the track's POLICY on top of them and any processing customization specific to presentations.

| Skill | Doc | Also in the folder | What it does |
|---|---|---|---|
| `desilence/` | `desilence.md` | `desilence_preset.py` | The track's standing silence definition (800 ms min-silence, 200 ms residual between sentences, one zone) pinned in code, wrapping the canonical desilencer: dry-run preview, cut/keep map, swallowed-speech + A/V drift QA. |

Started 2026-10-13 when the track was revived (first video through it: `media/what-to-buy/`). The track doc
(`../longform-presentation.md`) points here from Phase 3; the repo router (`CLAUDE.md`) has the one-liner.
