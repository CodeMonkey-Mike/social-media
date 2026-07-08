---
name: defumbler
description: Remove false starts / stutters / retakes from a spoken recording WITHOUT clipping words — silence-segmented, per-chunk-transcribed, cut-only-in-silence method. Track-agnostic (longform, presentation, shorts, VO). POINTER ONLY — the real skill is video-creation/skills/defumbler/defumbler.md.
---

# /defumbler — POINTER (not the skill)

**This file is a pointer, not the skill.** The canonical Defumbler skill lives at:

- Repo-relative: `video-creation/skills/defumbler/defumbler.md`
- Absolute: `C:\Users\mnede\Documents\Claude\social-media\video-creation\skills\defumbler\defumbler.md`

When `/defumbler` is invoked, **READ that `defumbler.md` in full and follow it top to bottom.**

The non-negotiables (full detail + why in the skill): decouple silence from fumbles; cut ONLY inside a
silence gap, NEVER on a Whisper word timestamp; ≤ −50 dB for cut edges; map takes with
`skills/defumbler/scripts/chunk_map.py`; get Mike's text cut-plan approved before rendering. Do NOT cut from
whole-file `detect_fumbles`/`audit_coverage` output (diagnosis only).

Do NOT copy the real content into this file — edit `defumbler.md`. This pointer exists only so
`/defumbler` works as a command while the canonical doc stays visible in the defumbler folder.
