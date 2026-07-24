# Clarity Act ensure US Dominance — TRANSITIONS plan

_Three-bucket policy (canonical: ../../assets/transitions/README.md + longform-edited.md #5). Glitch ids:
assets/transitions/library.json. Do NOT collapse all cuts into the glitch library._

**⛔ Transition SOURCE prefix (used here + in EDIT-PLAN-prep / CUE-SHEET / EDIT-PLAN so you can tell at a glance):**
- **`rmn:`** 📦 = out-of-the-box `@remotion/transitions` (slide, fade, iris, cube…).
- **`lib:`** 🧩 = OURS, from the transition **library** (`../../assets/transitions/library.json`), e.g. `lib:badsignal-short-1`.
- **`hand:`** ✋ = our **hand-rolled** overlay code (film-burn, xfade+scale, punch-in, pop — not a package/library).

**Register note:** this video is the SOFT / non-epic explainer (Mike, 2026-07-10). So the picks lean to the
GENTLE end of each bucket — film burn (not the Blocks·Max glitch) for face cuts, fades for b-roll/AI stills,
cross-fade+scale for containers/charts, a clean slide for cards. No aggressive glitch spam. One emphasis
transition is reserved for a single "verdict" receipt.

## 1. Chapter / title cards → ONE pick for the whole video
**Pick = `slide` (from-bottom)** — a clean, understated push, right for the soft register (cube/flip read
flashier). Self-contained `@remotion/transitions/slide` scene; NEVER wrap the locked spine in TransitionSeries.
- Cards **ON** at the two music-bed changes: **CH2 (0:43.2)** and **CH4 (3:30.4)**.
- Cards OFF (flow straight in): CH1 (pure hook, opens on cover-black), CH3 (continues CH2 bed), CH5 (continues
  CH4 bed), CH6 (close). On-screen card text = short viewer titles: CH2 "How the Dollar Won Twice",
  CH4 "The Trojan Horse".
- Each card lands on a 1s baked spine pause (comp `sh()` remaps).

## 2. Glitchy-fast hits → glitch library (Cinematic Bad Signal, SHORT variant)
The 3 ChatGPT AI / atmosphere stills (CG1/CG2/CG3) get a **Cinematic Bad Signal Short** on ingress — the
canonical three-bucket policy (AI stills → the glitch library, `../../assets/transitions/library.json`,
via `TransitionClip`). Kept to the **Short** (mildest) variant so it reads as a brief digital flicker, NOT a
hype glitch — consistent with the soft register. Ids: `badsignal-short-1/2/3`. NO Max/aggressive glitches, and
NO glitch on containers, charts, receipts, or face cuts (those keep their gentle transitions in §1/§3).

## 3. Face + b-roll + containers → hand-rolled overlays on the spine (house rule #5)
- **FACE cut in/out = FILM BURN** (warm radial flash, ~±0.38s; the soft standing default, longform-edited.md #5).
  This is the per-video pick — use it on EVERY black→face and face→black edge (the 8 FACE windows from
  blackdetect). NEVER a plain cross-fade to face.
  - FACE edges (from blackdetect on the final spine): 0:15.9 · 0:21.3 · 1:32.1 · 1:39.9 · 2:42.2 · 3:30.3 ·
    4:09.9 · 4:20.7 · 4:46.8 · 4:54.5 · 5:14.4 · 5:18.6 · 6:18.7 · 6:29.1 · 6:52.9 (film burn on each).
- **Intra-FACE punch-in** (~15-20% zoom) on face holds > ~2s, snapped to `spine/jumpcuts-final.json` joins
  (never mid-word). Main candidates: the long PLUG face hold (2:42→3:30) and the CH3 face (2:42.2 region).
- **Envato VIDEO b-roll = fade** (opacity ~0.5s in/out).
- **Container / diagram / chart swap = cross-fade + 0.93→1 scale-in** (hand-rolled interpolate, never
  TransitionSeries). Consecutive same-container state swaps: NO ingress transition (spotlight state change only).
- **Receipts = fade**, EXCEPT one emphasis: the **CLARITY-stalled receipt** (CH5, the "fight right now" beat)
  gets a single **iris / clockWipe** as the one "verdict" transition in the video (README micro-transitions).
- **Subscribe overlay** (**≤1s**, ~3:13) = quick pop-in / fade (bounce scale 0.8→1), fade out fast. Do NOT linger (Mike).

## 4. Summary picks table
| Bucket | Pick |
|---|---|
| Chapter cards | `rmn:slide` (from-bottom), ON at CH2 + CH4 |
| Face cut in/out | `hand:film-burn` (±0.38s) + `hand:punch-in` on >2s holds |
| Envato video b-roll | `rmn:fade` (~0.5s) |
| Container / chart swap | `hand:xfade+scale` (cross-fade + 0.93→1 scale-in) |
| AI stills (×3) | `lib:badsignal-short-1/2/3` (subtle flicker) |
| Receipts | `rmn:fade`; ONE `rmn:iris` on the CLARITY-stalled "verdict" |
| Subscribe overlay | `hand:pop` (quick pop/fade, ≤1s) |
