# longform-edited · CAPTION rule

Specific caption rule for the longform-edited track. The general caption engine + presets live in the
canonical caption skill `video-creation/skills/captions/captions.md`; THIS file is the longform-edited override.

- **OFF by default.** A longform-edited video has NO captions unless Mike explicitly asks
  (`feedback_cover_every_cover_beat`). Never add them on your own.
- **When he asks: `montserrat` preset.** Density (Mike, evolving):
  - **2 words per line, up to 4 words if the words are very small (<=4 chars).** (Mike, 2026-07-12: "we
    should be able to fit more than one word in MOST cases" — the reference reads "it up is a", not one word.
    Reverted the tighter 1/2; 1-word-per-line was wrong.)
  - Build: `python video-creation/skills/captions/build_captions.py --words <spine>.medium-words.json --style
    montserrat --max-words 2 --max-short 4 --out <project>Captions.ts` (or `--transcribe <clip>`).
  - **FONT = Montserrat** (`fontFamily: "Montserrat,'Arial Black','Segoe UI',sans-serif"`, LOAD it via
    `@remotion/google-fonts/Montserrat`; Arial Black is only the fallback), fontWeight 900, lowercase,
    `WebkitTextStroke:'12px #000'`, `paintOrder:'stroke fill'`, pop 0.7->1.12->1. **Run the `captions-builder`
    agent** — never hand-roll or copy an old comp's inline captions (zebec 2026-07-12 regression).
- **Scope = EVERY sustained-face hold > 5s, automatically (Mike, 2026-06-18; corrected — NOT a per-video
  pick).** When a video uses captions, they appear on **every** gated-face hold longer than 5s — (the light leak used to share
  this > 5s trigger; since 2026-10-07 leaks ride the punch-ins on desilencer joins instead, `skills/overlays/overlays.md` section 1). It is not optional per-hold; if the
  face is held > 5s, it gets captions. They are a talking-head device:
  - **NEVER over b-roll, containers, diagrams, or receipts** (the cover layer is the visual there), and
    **never over short (< 5s) face punctuation** (too brief to read).
  - **The cold-open intro is the one special case** (captions run over the hook montage, b-roll included);
    everywhere else captions are strictly gated to the > 5s face holds.
  - Build once by transcribing the spine (`build_captions.py --transcribe`), then GATE rendering to the > 5s
    face spans in the comp (shift caption times by the fumble-cut `sh()` like every other post-cut cue).
  - **EDIT-PLAN reconciliation:** every > 5s face hold must show a `[CAPTION]` row. If one doesn't, captions
    weren't built for it — that's the bug (it's how this got missed: the rule existed, the render didn't match).
  - **Captions render ON TOP of the light-leak overlay (topmost layer).** When a caption and a light leak
    share a > 5s face hold, the leak must sit UNDER the text or its screen-blend warmth distorts the glyphs —
    in the comp, `<Captions />` comes AFTER the overlay in the tree. See `../overlays/overlays.md` "Layer order".
- **Graph (2026-09-28):** the `captions` node runs `scripts/build_project_captions.py`, which wraps `build_captions.py`
  with these rules (windows = FACE holds > 5 s from AS-RECORDED, montserrat 2/4, the project's mishear list applied)
  and writes `remotion/src/<Project>Captions.ts` + `assets/captions.json`. `--caption-windows a-b` on the invocation
  adds the cold-open exception. The comp gates rendering by `CAPTION_WINDOWS` and routes every `t` through `sh()`.
- **NO captions at all, a per-video Mike call (2026-11-04, quant: screen-share face mode, "this time, there will be no
  captions"):** `run.py longform --project <p> --caption-scope none`. The `captions` node then writes an EMPTY
  `remotion/src/<Project>Captions.ts` (ZCAPTIONS = [], CAPTION_WINDOWS = []) + a sidecar `captions_none: true`, the comp mounts
  no caption layer, and the CUE-SHEET carries `CAPTIONS: OFF (Mike, <date>)` as the record (comp-build.md section 8).
- **Wider caption scope, a per-video Mike call (2026-10-19, evals):** `run.py longform --project <p> --caption-scope
  all-faces,envato` (persisted in GRAPH-PROGRESS.json `settings.caption_scope`; `--caption-scope default` clears it).
  `all-faces` captions EVERY face hold, the < 5 s ones too; `envato` also captions every `envato-video` beat of
  COVER-PLAN.json (the sidecar lists them as `cover_windows`, and the comp flags exactly those covers `cap: true` so
  `lint_covers.py` passes). Containers, diagrams, charts, receipts and AI stills stay caption-free either way. Set it
  before the `captions` node runs; changing it after means `--redo captions`.
- **History of this number** (so we don't churn blindly): 3/5 (shorts default) -> 2/4 -> 1/3 -> **1/2**.
  Update the number HERE and re-run the builder; do not hard-code it in the comp.
