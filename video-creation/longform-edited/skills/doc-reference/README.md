# doc-reference : the canonical SHAPE of every per-video document (COPY THIS, DO NOT RE-DERIVE)

_Sibling of `container-reference/` (which locked the container LOOK). This folder locks the DOCUMENT
formats. Mike, 2026-09-17, after the first graph screenplay shipped with bare `[FACE]` tags: "we need to
make sure that there are standard rules and styles for how we do everything, this is why we are putting
this into LangGraph." Project folders are deletable (they routinely are, once a video publishes), so a
reference that lives in `media/<project>/` is not durable; this folder is._

Every file here is a **complete, lint-clean exemplar** of one document, trimmed to the minimum that shows
every required section and every rule. An agent or a session authoring that document **reads the reference
first and matches its shape exactly**; the format OWNER (a skill) holds the rules and the reasons; the LINT
(code, run by the longform graph at that document's node) is the gate. All three must agree; on conflict the
owner wins and the reference + lint get fixed the same turn (`feedback_persist_decisions_in_skill`).

| Document | Reference file | Format owner (rules live here) | Code gate (run by the graph node) |
|---|---|---|---|
| `SCREENPLAY.md` | `SCREENPLAY.reference.md` | `../../screenplay.md` (Convention 5 + no cold open) | `lint_screenplay.py` (node `screenplay`) |
| `DATA.md` | `DATA.reference.md` | `../charts/charts.md` §1 (+ the do-not-air / snapshot sections the `data-researcher` agent owns) | `research` node checks (sections + sources); a `lint_data.py` is the Wave-B target |
| `PROJECT-LOG.md` | `PROJECT-LOG.reference.md` | free-form decision trail; the brief + constraints blocks are what `init_project.py` writes | `init_project` node (skeleton) |
| `AS-RECORDED.md` | `AS-RECORDED.reference.md` | `../../screenplay.md` § "AS-RECORDED.md" (the as-BUILT variant) | `lint_as_recorded.py` (node `as_recorded`; sections, beat verdicts, timecodes within the spine, FACE budget) |
| `COVER-PLAN.json` | `COVER-PLAN.reference.json` (harvested 2026-09-28 from kaspa 30bps; `_reference` field = its banner) | the JSON schema in `.claude/agents/longform-edited/coverage-strategist.md` § Output (title cards = zero-length `title` beats; every `chatgpt_list` row carries `reference`) | `coverage` node: schema + consecutive beats + every non-FACE second covered + budget |
| `BROLL-PLAN.md` · `EDIT-PLAN-prep.md` | `BROLL-PLAN.reference.md` · `EDIT-PLAN-prep.reference.md` (harvested 2026-09-28; RENDERED shape + the completed statuses and post-gate notes) | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0; both are RENDERED from COVER-PLAN.json by `../../scripts/render_cover_plan.py` (never hand-authored first), then ticked by the asset factory | `coverage` node render check, then `lint_docset.py --stage plan` |
| `MUSIC-PLAN.json` | `MUSIC-PLAN.reference.json` (harvested 2026-09-28; multi-bed `tracks[]` form) | `../music/music.md` + the schema in `.claude/agents/longform-edited/music-placement-strategist.md` § Output | `music_plan` node: every chapter has a bed, beds cover the spine (max 1 s breath), every file exists, a short bed loops, level -24..-12 dB, then `lint_docset.py --stage plan` |
| `EDIT-PLAN.md` · `CUE-SHEET.md` | `EDIT-PLAN.reference.md` · `CUE-SHEET.reference.md` (harvested 2026-09-28) | `../edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1 (time-ordered event log) / §2 (layer-grouped watch-along, TRANSITIONS + MUSIC beds mandatory) | `lint_docset.py --stage build` (node `lint_docset`; ported 2026-09-28) |
| the PROJECT FOLDER itself | `PROJECT-FOLDER.reference.md` (2026-09-29: every file and folder a delivered video carries, with the node that makes it) | `../comp-build/comp-build.md` §10 + §13/§13a | `init_project.py` creates the skeleton; `lint_docset.py` + `verify_assets` check it |
| `TRANSITION-PLAN.json` · `TRANSITIONS.md` | `TRANSITIONS.reference.md` (harvested 2026-09-28, with the comp-time build notes); the JSON schema is in `.claude/agents/longform-edited/transition-strategist.md` § Output, the .md is RENDERED from it by `../comp-build/render_transitions.py` | `../comp-build/comp-build.md` §14 (rmn: / lib: / hand: prefixes, 4 sections) | `../comp-build/lint_transition_assets.py` (node `verify_comp`; ported 2026-09-28) |

## The rules the references make visible (and the lints enforce)

1. **Tagged lines are emoji + BACKTICKED tag**: 👤 `[FACE]` · 🗣️ `[COVER]` · 🔒 `[SAY-EXACT]` · 🎬 `[SHOW]` ·
   💬 `[NOTE]` · 🔍 `[VERIFY]`. The backticks are the gray chips in the VS Code preview Mike reads by. A locked
   line is 🔒 `[SAY-EXACT]` then its gate. Never a bare `[FACE]`.
2. **One job per line.** Spoken / direction / note / verify never share a line.
3. **Beats carry a bold signpost** (`**Beat N - signpost**`) and live under `## CH<n>` sections.
4. **Load-bearing guardrails live in callout boxes** (`> [!WARNING]` do-not-air, `> [!IMPORTANT]` verify list,
   `> [!NOTE]` intent), never inline.
5. **No em dashes anywhere** (persona). Use a comma, a colon, a period.
6. **Every number carries a source and a read date** (DATA.md); the screenplay only quotes DATA.md.
7. **No cold open**: CH1 is the opening; nothing is named "cold open" / "teaser" before it.

How to add a reference: copy the newest lint-clean real document, keep every required heading and the real rows
(a completed video is the worked example; the 2026-09-28 harvest from kaspa 30bps kept full content, not skeletons),
replace every em dash, run its lint on the reference (for the docset lints: assemble a scratch project from the
references under their real names + a words json and run `lint_docset.py --stage plan` and `--stage build`), and add
the row above. The two JSON references carry their banner as a top-level `_reference` string.
