# longform-edited · CAPTION rule

Specific caption rule for the longform-edited track. The general caption engine + presets live in the
canonical caption skill `video-creation/skills/captions/captions.md`; THIS file is the longform-edited override.

- **OFF by default.** A longform-edited video has NO captions unless Mike explicitly asks
  (`feedback_cover_every_cover_beat`). Never add them on your own.
- **When he asks: `montserrat` preset, but tighter than shorts.** Density (Mike, evolving):
  - **1 word per line, up to 2 words if the words are very small (<=4 chars).** (2026-06-17.)
  - Build: `python video-creation/skills/captions/build_captions.py --transcribe <clip> --style montserrat
    --max-words 1 --max-short 2 --out <project>/captions-intro.ts`
- **Scope = EVERY sustained-face hold > 5s, automatically (Mike, 2026-06-18; corrected — NOT a per-video
  pick).** When a video uses captions, they appear on **every** gated-face hold longer than 5s — the same
  > 5s face-view trigger as the light-leak overlay (`skills/overlays.md`). It is not optional per-hold; if the
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
    in the comp, `<Captions />` comes AFTER the overlay in the tree. See `overlays.md` "Layer order".
- **History of this number** (so we don't churn blindly): 3/5 (shorts default) -> 2/4 -> 1/3 -> **1/2**.
  Update the number HERE and re-run the builder; do not hard-code it in the comp.
