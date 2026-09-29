# kaspa-vprogs - TRANSITIONS plan
_Rendered 2026-09-28 from `TRANSITION-PLAN.json` (the transition-strategist's proposal, verified by the graph, gated by Mike at GATE 4) by `skills/comp-build/render_transitions.py`. Three-bucket policy (canonical: `../../assets/transitions/README.md` + longform-edited.md #5). Glitch ids: `assets/transitions/library.json`. Do NOT collapse all cuts into the glitch library._

**Transition SOURCE prefix (every transition here, in EDIT-PLAN and CUE-SHEET carries one):** `rmn:` = @remotion/transitions · `lib:` = our transition library · `hand:` = hand-rolled overlay code. A bare name is a gap.

**Spine:** `video-creation/longform-edited/media/kaspa-vprogs/spine/ALL.f.cut.mp4` · aspect 16:9 · 38 scene changes assigned.

## 1. Chapter / title cards → ONE pick for the whole video
This video = **hand:cube-3d**. ONE card move for both cards: cube, from-right, the hand-rolled rotateY turn (~11f in, hold through the 1.5 s pause, never cube back out). Tagged hand:cube-3d, NOT rmn:cube, because @remotion/transitions ships no cube presentation (comp-build §6, verified on kaspa 30bps). Safe CSS-3D, no canvas render-flag risk. Blocky 3D geometry is on-brand for a BlockDAG video and shares one 3D language with the spin-3d marquee. Each card = self-contained pause scene over the outgoing cover; the locked spine is never wrapped in TransitionSeries. Card impact (DSGNImpt, 1.16 s tail) is the EDIT-PLAN's, not a transition SFX. Timecodes below are FINAL-spine, PRE-card-pause seconds, exactly as the CUE-SHEET; the comp routes them through sh().
Cards ON at: 0:40.2 NOT AN L2 · 2:17.6 WHERE IT STANDS. Self-contained @remotion/transitions scene; never wrap the locked spine in TransitionSeries.

## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)
ChatGPT stills + AI clips get a Cinematic Bad Signal ingress from the library:
- 2:17.6  lib:badsignal-short-1  CH3 card (pause end) -> IMG-1 ladder into the DAG sky (ChatGPT still, 2.26 s)
- 3:01.4  lib:badsignal-max-1  BR-4 out -> IMG-2 lone layer above towers (ChatGPT still, 3.36 s)
- 3:15.1  lib:badsignal-short-2  cta-engage s3 -> IMG-3 Kaspa coin sunrise (ChatGPT still, 1.9 s)

## 3. Face + b-roll + TEXT-containers → hand-rolled overlays on the spine (house rule #5)
- FACE cut in/out → **lib:blocks-max** (the per-video pick; Blocks Max over film burn: a digital block-shatter is the register of a vProgs / BlockDAG explainer (gear-3 hook, cold tech palette), and it stays cold so it never stacks warm-on-warm with the F1 light leak (leak 1.7-5.7, glitch window opens 6.85). Only 3 face cuts exist, so rotate 1/2/3 with no repeat. Both face-side nodes must be a faithful SpineStill (Freeze, muted, same punch-in scale, same source) per comp-build §6a; the face-out at 7.333 carries the F1 ~17% punch scale from 3.78.) + ~15-20% punch-in on face beats > 2 s.
- Envato VIDEO b-roll → fade (~0.5 s).   TEXT-container swap → cross-fade + 0.93→1 scale-in (the quiet default).

## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)
ONE melt look (`lib:melt-rgb-*`, Chromatic channel reform reads as one structure reflowing into its successor, the exact TRANSFORM move for C1's lineage. Variant melt-rgb-3 (R-50 / G+50 / B+75) ghosts cyan-blue, so the spectral burst sits inside Kaspa's greenish-cyan palette instead of flashing red over a teal diagram. Full 0.76 s, energy medium, fits the gear-2 machine beat. kind:shader, full-frame warp, spine never peeks.) + ONE spin look (`lib:spin-3d-side-ease-*`, The 3D side-ease turn over mirrored padding echoes the cube card, keeping one 3D language across cards and marquee. Full 0.88 s, energy high, reserved for the gear-3 'Look at this ladder' reveal. kind:geometric, mirrored padding fills the frame mid-turn, occlusion safe. Known engine trait (kaspa 30bps 2c): a mirrored wrap-copy of the incoming chart can show for 1-2 of 26 frames mid-turn; benign on a rising ladder image.), deployed ONLY on the marquee diagram/chart beats. Budget: melt 1 · spin 1. Reserved to the two marquee diagram/chart beats the CUE-SHEET flagged: MELT 94.5 (C1 overview reforms into its Kaspa-node break-up, TRANSFORM) and SPIN 139.84 (image turns into the animated C3 ladder, NEW FACET). On a 3:23 spine, 1+1 is the deliberate count. Considered and rejected to protect the reserve: 52.18 C2 entrance (gear 2, receipt -> diagram, not flagged), 81.7 C1 entrance (a second shader move 13 s before the melt under the ducked machine beat), 100.42 / 106.9 C1 siblings (melt spray), 163.28 c3-next-rungs (R6 sits between it and the ladder, not a direct transform partner), 184.76 pow-money-hammer (text card). 0.0 opens ON face (no cut) and 202.8 ends on the held end card (no cut).

| TC | move | id | TRANSFORM-vs-NEWFACET why |
|---|---|---|---|
| 94.50 | MELT | lib:melt-rgb-3 | TRANSFORM: same lineage, the whole vProg machine liquefies and reforms as its own Kaspa node blown up with the four job rows; the CUE-SHEET's flagged MELT candidate. The melt REPLACES the 5-frame push-in match (one move, not two): c1-kaspa-four-jobs opens on its -orders state the frame after the melt settles, ORDERS already lit, STORES lands 94.66. Cover -> cover, both nodes are stills, full-frame warp so the blacked spine never peeks. Cyan-blue ghosting stays in the Kaspa palette. SFX must duck under 'It stores the data' (94.5-94.66) with Bed B already at -25 under. |
| 139.84 | SPIN | lib:spin-3d-side-ease-up | NEW FACET: the atmosphere still does not reflow into anything, you TURN to the new instrument, the code-built ladder, exactly on 'Look at this ladder'; the CUE-SHEET's flagged SPIN candidate. Full-length, UP swing matches the rungs landing bottom to top and the rail climbing 985 -> 500. Image -> code chart keeps the engine clear of the video cost trap (§6a); the c3-ladder node must read the comp's absolute frame context, not local useCurrentFrame, so it does not freeze inside the engine's nested Sequences. Mirrored padding fills the frame mid-turn, spine never peeks. Whoosh ducks under 'Look at this ladder' (Bed C on its -19 under entry ramp); no EDIT-PLAN impact here, so no stack. The chart's 0.93->1 scale-in is superseded by the spin at this one entry. |

Everything else stays §1-3. SFX ducks under the VO on every melt/spin.

## 5. Every scene change, time-ordered (the build reconciles the comp to THIS list)

| TC | bucket | role | source | id | dur s | duck | change |
|---|---|---|---|---|---|---|---|
| 0:03.8 | face | punch-in | hand | hand:punch | 0.00 | no | F1 intra-face punch-in on 'real apps' (hold 7.33 s > 2 s), holds to the face-out |
| 0:07.3 | face | face-cut | lib | lib:blocks-max-1 | 0.96 | yes | F1 face OUT (picture edge 7.333) -> R1 yellow paper title page |
| 0:09.5 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | R1 receipt -> vprog-loop-mini (nodes state) |
| 0:14.5 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | vprog-loop-mini (landed) -> R2 rusty-kaspa v2.0.0 Toccata release |
| 0:21.2 | broll | broll-fade | hand | hand:fade | 0.50 | no | R2 receipt -> BR-1 glass planes rising (Envato, muted) |
| 0:25.2 | broll | broll-fade | hand | hand:fade | 0.50 | no | BR-1 out -> ten-bps-card (single state; '10 BLOCKS / SEC' comp slam at 25.92 is internal) |
| 0:28.2 | face | face-cut | lib | lib:blocks-max-2 | 0.96 | yes | ten-bps-card -> F2 face IN (picture edge 28.167, not the 28.10 word start) |
| 0:30.6 | face | punch-in | hand | hand:punch | 0.00 | no | F2 intra-face punch-in on the second 'Kaspa is going to verify it' (hold 3.77 s > 2 s) |
| 0:31.9 | face | face-cut | lib | lib:blocks-max-3 | 0.96 | yes | F2 face OUT -> execute-verify-flip s1 ('EXECUTE' struck) |
| 0:38.8 | broll | broll-fade | hand | hand:fade | 0.50 | no | execute-verify-flip s5 -> BR-2 glass shatter (Envato, muted) |
| 0:40.2 | card | card | hand | hand:cube-3d | 0.37 | no | BR-2 hard OUT -> CH2 title card 'NOT AN L2' (1.5 s pause, Bed A -> B inside it) |
| 0:40.2 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | CH2 card (pause end) -> R3 ethereum-magicians roadmap, wide establish |
| 0:52.2 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | R3 receipt -> c2-l2-stack (empty state) |
| 1:04.6 | broll | broll-fade | hand | hand:fade | 0.50 | no | c2-l2-stack (pieces pulse) -> BR-3 ice glow cracks (Envato, muted) |
| 1:07.8 | broll | broll-fade | hand | hand:fade | 0.50 | no | BR-3 out -> sompolinsky-name-card s1 |
| 1:13.0 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | sompolinsky-name-card s2 -> R4 Kaspa Magazine 'obsolete path of L2s' quote |
| 1:21.7 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | R4 receipt -> c1-overview (dim), THE C1 diagram entrance |
| 1:34.5 | diagram-marquee | MELT-transform | lib | lib:melt-rgb-3 | 0.76 | yes | c1-overview (orders state, ORDERS pulsed 94.06) -> c1-kaspa-four-jobs (orders state, Kaspa node enlarged) |
| 1:40.4 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | c1-kaspa-four-jobs (dropped) -> c1-vprog-nodes (entry) |
| 1:46.9 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | c1-vprog-nodes (lock) -> c1-provers (entry) |
| 1:52.1 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | c1-provers (landed) -> zk-math-receipt s1 |
| 1:58.4 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | zk-math-receipt s4 -> sovereignty-card s1 |
| 2:03.3 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | sovereignty-card s3 -> composability-card (entry) |
| 2:10.4 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | composability-card (one-unit) -> R5-a docs.kaspa.org/toccata activation line |
| 2:13.4 | container | container-xfade | hand | hand:xfade | 0.27 | no | R5-a -> R5-b (same page, ZK precompiles row) |
| 2:17.6 | card | card | hand | hand:cube-3d | 0.37 | no | R5-b -> CH3 title card 'WHERE IT STANDS' (1.5 s pause, Bed B -> C inside it) |
| 2:17.6 | ai-still | glitch-still | lib | lib:badsignal-short-1 | 0.48 | yes | CH3 card (pause end) -> IMG-1 ladder into the DAG sky (ChatGPT still, 2.26 s) |
| 2:19.8 | chart-marquee | SPIN-newfacet | lib | lib:spin-3d-side-ease-up | 0.88 | yes | IMG-1 ladder still -> c3-ladder (Type 1 animated chart, empty state) |
| 2:40.3 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | c3-ladder (silverscript payoff, drifted to 1.03) -> R6 silverscript v1.0.0 release |
| 2:43.3 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | R6 receipt -> c3-next-rungs (entry, dashed rungs enlarged) |
| 2:49.8 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | c3-next-rungs (construction) -> R7 kaspa.org/build 'In construction' |
| 2:52.8 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | R7 -> R8 Kaspa Magazine hard-fork timing paragraph (wide stage) |
| 2:58.5 | broll | broll-fade | hand | hand:fade | 0.50 | no | R8 (DELIVERED stamp) -> BR-4 datacenter corridor dolly (Envato, muted, LEAD) |
| 3:01.4 | ai-still | glitch-still | lib | lib:badsignal-max-1 | 0.76 | yes | BR-4 out -> IMG-2 lone layer above towers (ChatGPT still, 3.36 s) |
| 3:04.8 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | IMG-2 -> pow-money-hammer s1 'PROOF OF WORK MONEY' |
| 3:08.6 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | pow-money-hammer s3 -> cta-engage s1 |
| 3:15.1 | ai-still | glitch-still | lib | lib:badsignal-short-2 | 0.48 | yes | cta-engage s3 -> IMG-3 Kaspa coin sunrise (ChatGPT still, 1.9 s) |
| 3:17.0 | container | container-xfade | hand | hand:xfade-scale | 0.35 | no | IMG-3 -> end-card-community s1, holds to the last frame 202.8 |

**Consistency:** One card move (hand:cube-3d, from-right, both cards, rotate in and hold, never cube out). One face pick (lib:blocks-max, rotating 1/2/3 across the only 3 face cuts, plus hand:punch on both face holds > 2 s; no cross-fade to the face anywhere). One melt look (melt-rgb-3, used once). One spin look (spin-3d-side-ease-up, used once). Every ChatGPT still ingresses on Cinematic Bad Signal (short-1 / max-1 / short-2, no adjacent repeat); no glitch on any Envato clip, container, diagram, chart or receipt. Every Envato clip fades 0.5 s. Every text container, receipt and non-marquee diagram swap is hand:xfade-scale 0.35 s (0.93 -> 1), the one same-page receipt pair is an 8f cross-fade with no scale reset, and every in-container state swap (74 state rows) is component animation (6-8f cross-fade), never a transition. Every transition is expressible on the continuous OffthreadVideo spine: face cuts run TransitionClip over the blacked spine with a faithful SpineStill on the face side, covers animate their own in/out, and the melt/spin are cover -> cover full-frame (melt warps full-frame, spin rides mirrored padding), so the spine never peeks and no TransitionSeries touches the locked audio. Every lib: row carries baked SFX and is flagged sfx_duck for the mix so no whoosh sits on a word; hand: rows carry no SFX. Timecodes are FINAL-spine, PRE-card-pause seconds (CUE-SHEET base); the comp routes them through sh() (+1.5 s after 40.22, +3.0 s after 137.58).

## Open questions (Mike)
- [ ] Face pick: lib:blocks-max (chosen, cold digital register, continuity with kaspa 30bps) vs film burn (the warm standing default). With only 3 face cuts and a warm F1 light leak, film burn is a legitimate alternative; overrule and every face-cut row becomes hand:filmburn with nothing else changing.
- [ ] 94.5 MELT replaces the 5-frame push-in match (one move, not two). Consequences for the builder: c1-kaspa-four-jobs opens on its -orders state the frame after the melt settles, and the c1-overview ORDERS pulse (94.06, 16f, ends 94.59) overlaps the melt window head (94.12), so either trim the pulse to ~12f or accept the outgoing still frozen mid-pulse at 1.03 (comp-build §6a rule 3: the outgoing node must carry the live scale). Recommendation: trim the pulse to end by 94.10. Prefer the plain push-in match instead? Then the melt budget drops to 0 and C1 has no marquee move.
- [ ] Card pick is cube (hand:cube-3d, from-right). Alternatives from the safe set: flip or slide. book-flip / swap need the canvas-draw-element render flag and are NOT proposed.
- [ ] Optional second SPIN at 81.7 (THE C1 entrance, 'So here's how a vProg actually works'). Default NO: it would put two shader moves 13 s apart under the ducked machine beat. Say the word and it becomes lib:spin-3d-side-ease-right (0.88 s) with the melt kept at 94.5.
- [ ] IMG-1 (137.58) takes the SHORT badsignal because the spin lands 2.26 s later. If Mike wants the max hit out of the CH3 card, swap to badsignal-max-2 and accept the denser SFX cluster (card impact, glitch, spin whoosh inside 4 s).
- [ ] 181.4 badsignal fires out of a VIDEO (BR-4). The builder must feed the engine the pre-extracted BR-4 cut-frame still (CUTFRAME map, §6a cost trap); if the render still fights, the fallback is the house image ingress hand:cross-warp for IMG-2 only, declared with // TRANSITIONS_WAIVED.
- [ ] Melt variant melt-rgb-3 (cyan-blue ghosting) was chosen over melt-rgb-1 (red ghosting, the kaspa 30bps pick) to stay inside the Kaspa palette. If Mike wants cross-video continuity instead, melt-rgb-1 is a drop-in, same duration.
- [ ] Known spin engine trait: a mirrored wrap-copy of the incoming ladder may show for 1-2 frames mid-turn at 139.84 (kaspa 30bps 2c). Flagged, not re-planned; if it bothers on the draft, the swap is a melt-rgb-3 at that beat (which would make it 2 melts, 0 spins and lose the 3D echo of the cube).

