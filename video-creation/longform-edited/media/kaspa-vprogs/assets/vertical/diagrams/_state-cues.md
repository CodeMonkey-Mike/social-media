# kaspa-vprogs VERTICAL: Type 2 SYSTEM-DESIGN state cues (chart-builder, 2026-09-29)

Portrait twins of `assets/diagrams/*` (see that folder's `_state-cues.md` for the full cue table: **every state
id, cue time, cue word, swap rule and push rule is UNCHANGED**; a vertical is a reframe, not a re-edit).
Each chart = `<id>.html` (1080x1920 `.frame` per state, all cloned from one `<template>`, so shared elements
are pixel-identical across states) + `<id>-<state>.png` (2160x3840, device scale 2). Re-render with
`python _render_states.py <id>.html` (base CSS/JS inlined by `_inline_vbase.py` from `vprog-loop-mini.html`).
Same role colours: Kaspa L1 teal · vProg purple · provers/ZK gold · users/tx cyan · ok/live green · risk red.

Only the geometry of the MOVING devices changed. The comp needs these numbers (1080x1920 CSS px):

| chart | device | 16:9 | VERTICAL |
|---|---|---|---|
| vprog-loop-mini | ZK token `proof` -> `landed` (optional slide between 11.40 and 14.02) | x 690 -> 958, y 639 (horizontal) | **x fixed (left 390, width 300), top 968 -> 1196 (VERTICAL drop down the wire x 540)** |
| c1-provers | same token device, 110.02 -> 111.66 | x 1000 -> 1150, y 560 | **x fixed (left 390, width 300), top 1004 -> 1198** |
| c1-kaspa-four-jobs | EXECUTE drop (`execute` -> `dropped`, ~14f ease-in ending on 'app.' 100.26) | translate(30px,144px) rotate(1.5deg) opacity .45 | **translate(28px,176px) rotate(1.5deg) opacity .45** (row width 800; lands 1392..1496, clear of the box bottom 1350 and the source line) |
| c1-overview | ORDERS pulse on 'sequencer' 94.06 | Kaspa node crop | ORDERS row = x 98..848, y 810..896 (scale about its centre) |
| c2-l2-stack | red outline pulse on `pieces` | rows | same rows; now also the long ROLLUP A bridge (x 540, y 970..1536) |

Layout calls (for Mike's eye):
- **c1-overview**: the left-to-right machine now runs top to bottom (USERS -> KASPA L1 -> vPROG A | B ->
  PROVERS). The ZK proof returns up a right-hand channel (x 954) into CHECKS PROOFS, labelled vertically. The
  Kaspa box sits at x 72..874, y 672..1202, the same screen region c1-kaspa-four-jobs' box opens in
  (x 72..1008, y 648..1350), so the **MELT at 94.5 still reads as the node reforming in place**.
- **c2-l2-stack**: ROLLUP A full width on top, ghost B | C side by side, ETHEREUM L1 across the bottom. A's
  bridge runs down the B|C gutter, so all three bridges still land on the L1.
- **c1-vprog-nodes**: vPROG B moves BELOW A; READ (green) lands on A's bottom edge, WRITE (red dashed) stops
  at the X just under it.
- **c3-next-rungs**: ladder on the left (rails x 120 / 340), labels right. The UNDER CONSTRUCTION hazard sits
  under the FULL vPROGS quote (no room left of the rails in portrait). Attribution sources go on their own line.
  The push-in match from `charts/c3-ladder` still works: same rail-left ladder language in both.
- Safe zone: all content sits inside y 130..1650, the source line bottom sits at 1724, clear of the Shorts/Reels UI band.
