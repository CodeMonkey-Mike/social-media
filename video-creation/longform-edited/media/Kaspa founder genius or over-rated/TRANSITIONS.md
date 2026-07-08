# Kaspa Founder: Genius or Over-Rated? — TRANSITIONS plan

_How every cut is bridged. Feeds the EDIT-PLAN / CUE-SHEET. Three-bucket policy (canonical:
`../../assets/transitions/README.md` + `longform-edited.md` #5; skeleton: `skills/comp-build.md` §14). Glitch ids
from `../../assets/transitions/library.json`. Chapter card = a `@remotion/transitions` presentation on its own
self-contained scene; b-roll/face/container transitions are hand-rolled on the spine. **Do NOT collapse all cuts
into the glitch library**, and never run the sync-locked spine through `TransitionSeries`._

Timecodes are SPINE times (`f.final`, 9:35.6); see CUE-SHEET for the full layer detail. The two R-TALK inserts
(~3:56, ~4:17) are hard cut in/out with the clip's own audio (bed ducks) — not a kit transition.

## 1. Chapter / title cards → CUBE (the one pick for this whole video)
`@remotion/transitions/cube` (Safe-default CSS-3D presentation, no special render flag), used for EVERY card.
Cards are ON **only at a music-bed change** (the music-continuity rule), so just two:
- **1:10.7  CH2** "Who Is He, Actually"  (+ bed change Revenant → Press Play + the 1s title-card pause)
- **4:05.2  CH4** "From Chain to BlockDAG"  (+ bed change Press Play → I Will Deliver + the 1s title-card pause)
- CH1 / CH3 / CH5 / CH6 / CH7 / MID = framing or bed-continue beats → NO card, flow straight in.

## 2. Glitchy-fast hits → the GLITCH library (AI / atmosphere stills ONLY)
Random **Cinematic Bad Signal** (1 of 6: `badsignal-short-1/2/3`, `badsignal-max-1/2/3`) on the cut INTO each:
- 0:18.0  **CLIP-DAG** (the Seedance blockDAG AI clip)
- 0:24.2  **BR-SCHOLAR / BR-JOURNALS** · ≈0:34  **BR-AHEAD-OF-CROWD** · ≈1:12.4  **BR-ORIGIN** · 8:15.6  **BR-OTHERDAGS**
- (These ChatGPT/AI stills are the only sanctioned glitch use, EXCEPT the face pick below.)

## 3. Face + b-roll + containers → hand-rolled overlays on the spine (house rule #5)
- **FACE cut in/out → Blocks·Max glitch** (this video's pick, Mike 2026-06-30; `blocks-max-1/2/3` on the cut to
  his face — NOT film burn for this one). On a FACE beat > ~2s add a ~15-20% **punch-in zoom** mid-beat to
  re-engage (short `blocks-short-*`/`blocks-strips-*` optional). NEVER a plain cross-fade to the face.
  Face cut-ins at: 0:33.4 · 0:46.8 · 1:06.6 · 2:15.5 · 2:39.9 · 3:48.6 · 6:17.7 · 6:22.7 · 6:44.4 · 7:32.2 ·
  7:41.3 · 8:35.8 · 9:15.5 · 9:31.3. (0:00.0 opens ON face; 4:05.5 CH4 face arrives ON the cube card.)
  Punch-in holds (>2s face): 1:06.6–1:12.4 · 2:39.9–2:49.8 · 4:05.5–4:10.7 · 6:22.7–6:43.5 (PLUG, several) ·
  7:32.2–7:38.1 · 8:35.8–8:41.2 · 9:15.5–9:23.2.
- **Envato VIDEO b-roll → fade** (plain opacity ~0.5s, hand-rolled `interpolate`): 0:11.0 BR-NETWORK-blocks ·
  6:55.3 BR-NETWORK-blocks (reuse) · 9:23.2 BR-DAWN-sea.
- **Container / diagram / chart swap → cross-fade + 0.93→1 scale-in** (NOT glitch, NOT cube): every C-* / D-* /
  chart spotlight swap (C-RANK, C-SPLIT, C-BIO/C-BIO2, C-TIMELINE, D-GHOST, C-ACRONYM, D-SPECTRE, D-GHOSTDAG,
  C-LAUNCH, C-LINEAGE, C-CITEDGAP, C-COAUTHORS, C-MCAP, C-STACK) — see CUE-SHEET "CONTAINER spotlights" for times.
- **CryptoRich plug screenshots (6:22.7–6:43.5)** swap as receipts over the face → plain fade/cross-fade (no glitch).

## Notes
- Per-video pick recorded: **face = Blocks·Max glitch** (the sanctioned alternative to the film-burn default).
  If a future review prefers film burn, swap the face bucket only; everything else holds.
- Light leaks (face holds >5s) are an OVERLAY (`overlays.md`), not a transition — never share a frame with a cut.
