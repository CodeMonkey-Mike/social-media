# kaspa-vprogs: Type 2 SYSTEM-DESIGN state cues (chart-builder, 2026-09-28)

Each chart = `<id>.html` (one `<template>`, every state cloned from it, so shared elements are
pixel-identical) + `<id>-<state>.png` (3840x2160, device scale 2; the comp scales to 1920x1080).
State swap = consecutive same-ref COVERS rows (a STATE SWAP, ingress transition fires on ENTRY only;
comp-build §5). Swap = 6-8f cross-fade, no scale reset. Times = final-spine word onsets from
`spine/ALL.f.cut.medium-words.json`; route through `sh()` for the 40.22 / 137.58 card pauses.
Never a dead still (comp-build §7a): each cover gets a slow 1.00 to 1.03 push across its window
(full-diagram views: stay under ~4%).

Role colors, fixed for the whole video: Kaspa L1 = teal #49e0c8 (brand greenish cyan) · vProg nodes =
purple #a855f7 · provers + ZK proof token = gold #ffd700 · users / tx / "next" = cyan #00c2ff ·
live / ok / shipped = green #00e68a · risk / struck / attack surface = red #ff4060.

| chart (window) | state @ cue (word) | notes |
|---|---|---|
| vprog-loop-mini (CH1 9.50-14.54; ROUND 2: headline accent teal -> green) | `nodes` @9.50 (entry; "node" 9.78) · `state` @10.86 "state" · `proof` @11.40 "posts" · `landed` @14.02 "Kaspa" | proof->landed: 8f cross-fade reads as the token arriving; optional upgrade = slide the token (launch left 690 -> land left 958, y 639, 1920-space) between 11.40 and 14.02 over the `proof` still |
| c2-l2-stack (CH2 52.18-64.60) | `empty` @52.18 · `chain` @54.04 · `sequencer` @55.38 · `bridge` @58.96 · `liquidity` @60.60 · `pieces` @62.12 "pieces" | C2 shown ONCE. On `pieces`, pulse the red outlines twice (opacity 1 -> .6 -> 1, 20f) |
| c1-overview (CH2 81.70-94.50) | `dim` @81.70 · `users` @84.74 "transaction" · `reads` @87.44 · `writes` @88.62 · `kaspa` @89.80 "four" · `orders` @90.96 "orders" | THE C1 diagram, ONCE: declare `// DIAGRAM_REFS`. Pulse the ORDERS row on "sequencer" 94.06 (scale 1 -> 1.03 -> 1 on a Kaspa-node crop, 16f) |
| c1-kaspa-four-jobs (CH2 94.50-100.42) | `orders` @94.50 · `stores` @94.66 · `checks` @96.22 · `meters` @97.42 · `execute` @98.54 "never" · `dropped` @100.26 "app." | entry = push-in match from the overview's Kaspa node (same node language). `orders` shows only 0.16s; fine to enter straight on `stores`. ROUND 2 (visual-qa fix): the L1 box now holds all 5 rows (EXECUTE row 736-816 inside box 262-842). DROP device = the SAME `.x-row` element: `execute` -> `dropped` is translate(0,0) rotate(0) opacity 1 -> translate(30px,144px) rotate(1.5deg) opacity .45, ease-in (gravity) over ~14f ending on 'app.' 100.26 (so start ~99.8); the dashed empty slot fades in behind it. Landed card = 868-972px, 26px clear of the box, 45px above the source line |
| c1-vprog-nodes (CH2 100.42-106.90) | `entry` @100.42 · `nodes` @101.70 "nodes." · `accounts` @104.00 · `lock` @106.34 "write" | |
| c1-provers (CH2 106.90-112.06) | `entry` @106.90 · `operators` @108.30 "-profit" · `launch` @110.02 "zero" · `landed` @111.66 "Kaspa" | same token device as vprog-loop-mini (launch left 1000 -> land left 1150, y 560) |
| composability-card (CH2 123.34-130.44) | `entry` @123.34 · `read` @124.72 "read" · `tx` @126.06 "transaction" · `one-unit` @129.02 "unit" | pairs with slide-builder's `sovereignty-card` (1 of 2) |
| c3-next-rungs (CH3 163.28-169.78) | `entry` @163.28 "Next" · `next` @164.78 "standalone" · `full` @167.20 "full" · `construction` @169.20 "construction" | the ladder's ONE break-up; entry = push-in match from `charts/c3-ladder` (same rung language) |
