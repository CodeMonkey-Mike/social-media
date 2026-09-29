# longform-edited/skills

**Per-track skills for the heavily-edited 16:9 longform track.** ONE FOLDER PER SKILL (Mike, 2026-09-28,
mirroring `video-creation/skills/`): the folder is named after the skill, the skill doc is `<name>/<name>.md`,
and every script, lint, reference file or asset that belongs to that skill lives INSIDE its folder. No orphan
files at this level. Track-agnostic skills (defumbler, desilencer, captions build, envato, music sourcing ...)
live one level up in `video-creation/skills/`, not here.

| Skill | Doc | Also in the folder | What it does |
|---|---|---|---|
| `broll-and-containers/` | `broll-and-containers.md` | | The b-roll + container rules: budget, no reuse, THE BALANCE (rich slide once, then spotlight containers), Reference column for real things. |
| `captions/` | `captions.md` | | Where captions are ON (FACE beats) and the render-style block the comp copies; the build itself is the shared `video-creation/skills/captions/`. |
| `charts/` | `charts.md` | | Data charts + animated data-graphics: DATA.md CHART-SOURCE INDEX, code / screencap / restyle decision, never AI as the source of a number. |
| `comp-build/` | `comp-build.md` | `lint_covers.py` · `lint-deck-containers.py` · `lint-pause-silence.py` · `bed-duck-expr.py` · `lint_slide_balance.py` · `lint_transition_assets.py` · `lint_animated_charts.py` · `check_spine_fps.py` · `render_transitions.py` + `lint_transitions.py` (the TRANSITIONS.md plan, §14) (+ the frozen `.js`/`.sh` rollback twins) | The self-contained Remotion COMP architecture (§13 doc set, §13a folder layout, §14 TRANSITIONS skeleton) and every mechanical pre-render gate on the comp. |
| `container-reference/` | `README.md` | `container-canonical.css` + reference PNG/JPGs | The locked look of title / card slides and system-design diagrams (slide-builder, chart-builder build to this). |
| `doc-reference/` | `README.md` | `<DOC>.reference.md` / `.reference.json` per per-video document · `lint_docset.py` · `lint_screenplay.py` · `lint_as_recorded.py` (+ frozen `lint-docset.js`) | The canonical SHAPE of every per-video document (harvested from completed videos; project folders are deleted after publish so THESE are the reference) + the document-format gates the graph runs. |
| `edit-plan-and-cue-sheet/` | `edit-plan-and-cue-sheet.md` | `gen_editplan.py` (pre-build SEED of the event log) · `lint_edit_plan.py` (the gate for both files) · `reconcile_docs.py` (fans the transition picks back in + cross-checks the blueprint set) | The ONE format for `EDIT-PLAN.md` (time-ordered event log) and `CUE-SHEET.md` (layer-grouped), plus `BROLL-PLAN.md` / `EDIT-PLAN-prep.md` (§0). |
| `longform-to-short/` | `longform-to-short.md` | `lint-short-spans.py` · `short_extract_spans.py` | Condense an approved vertical cut into a ~40 s short with a spoken CTA outro (`/longform-short`). |
| `music/` | `music.md` | | The music bed rules: per-chapter beds, level under VO, ducking, the MUSIC-PLAN contract. |
| `overlays/` | `overlays.md` | | Overlay layer rules (line captions, stamps, lower thirds). |
| `presentation/` | `presentation.md` | | Dark cinematic HTML slide / explainer styling used for code-rendered containers and charts. |
| `vertical-repurpose/` | `vertical-repurpose.md` | | Build the full-length vertical (1080x1920) cut of an approved 16:9 video (`/vertical-repurpose`). |
| `video-qa/` | `video-qa.md` | | The mandatory render-QA gate: 10 s chunk renders, motion + audio, before any hand-off. |

Every gate prints one machine line (`<NAME>-LINT PASS|FAIL ...`) the longform graph parses; run any of them as
`python video-creation/longform-edited/skills/<skill>/<script> ...`. The graph (`../graph/`) and the track
router (`../CLAUDE.md`) point at these paths; agents in `.claude/agents/longform-edited/` read the doc first.
