# tao-render-virtuals — TRANSITIONS plan
_Three-bucket policy + a reserved 4th strategic layer for the diagram/chart marquees (canonical:
`../../assets/transitions/README.md` + `../../assets/transitions/CLAUDE.md` + `longform-edited.md` #5).
Library ids: `assets/transitions/library.json` (853-row Swiftly pack). Do NOT collapse all cuts into
one family. Times are SOURCE coords on `spine/ALL.d.desilenced.mp4`; the comp routes each through `sh()`
once the 3 card pauses (CH2/CH4/CH6) are inserted._

**Transition SOURCE prefix (tag every transition):** `rmn:` 📦 @remotion/transitions · `lib:` 🧩 our library ·
`hand:` ✋ hand-rolled overlay code (film-burn / xfade+scale / punch-in). A bare name = a gap.

**⛔ HARD RULE (README):** never wrap the locked-audio spine in `<TransitionSeries>`. Cards are self-contained
scenes; every FACE/b-roll/container/diagram move animates its own in/out over the continuous `OffthreadVideo`.
Melt/spin here are **cover-to-cover** (both sides are full-frame diagram covers; the VO spine runs underneath,
fully occluded — spin rides mirrored padding, melt warps full-frame, neither peeks the face).

## 1. Chapter / title cards → ONE pick for the whole video
**This video = `rmn:cube`** (3D cube rotate, safe default, no special render flag). Cards ON only at a
music-bed change (3): **CH2 76.80 "WHAT IS BITTENSOR?"**, **CH4 362.42 "THE CHALLENGERS"**,
**CH6 592.42 "TOE TO TOE"**. Each card = a self-contained @remotion/transitions scene + a 1s title-card
pause. CH1/CH3/CH5/CH7 = no card (flow in). _The cube's 3D language is deliberately echoed by the §4 spins._

## 2. Glitchy-fast hits → glitch library (AI / atmosphere stills ONLY)
Each ChatGPT still ingress → `lib:badsignal-*` (Cinematic Bad Signal, rotate short/max variants; SFX rings
from the wrapper). Ingress times: **17.00** (IMG-1) · **265.34** (IMG-2, only if kept) · **411.00** (IMG-3) ·
**514.32** (IMG-4) · **745.84** (IMG-5) · **822.60** (IMG-6) · **833.80** (IMG-7). Envato VIDEO clips do NOT
get a glitch (they fade — §3). No glitch on any container / diagram / chart / receipt.

## 3. Face + b-roll + TEXT-containers → hand-rolled overlays on the spine (house rule #5)
**FACE cut = `lib:blocks-max-*` glitch** (the per-video pick — Blocks·Max fits the AI/tech register) +
a **~15-20% punch-in** on face holds > ~2s. Never a cross-fade to the face.

- **FACE cut-ins** (`lib:blocks-max-*`, at each black→face edge; 0.00 opens ON face = no cut):
  48.70 · 123.00 · 181.87 · 294.03 · 353.63 · 456.80 · 575.03 · 654.37 · 730.13 · 813.03 · 858.57 · 873.73
- **Intra-FACE punch-ins** (`hand:punch` ~18% zoom, NO glitch; holds > ~2.5s):
  0.00→13.17 · 123.00→127.70 · 181.87→198.30 (subscribe ad-lib) · 294.03→297.83 · 353.63→357.97 ·
  456.80→463.60 · 575.03→580.07 · 654.37→657.60 · 730.13→734.33 · 858.57→862.07 · 873.73→911.26 (CTA)
- **Desilencer jump-cuts on-camera (6: 3.52 · 6.88 · 11.36 · 49.62 · 897.88 · 905.54) →
  `lib:deviation-shift-4x`** (the library's same-scene chromatic accent, built for jump cuts) + the subtle
  zoom punch-settle. _(Replaced the hand-rolled band-tear — Mike draft-QA 2026-07-19: "use the glitch and
  deviation transitions from our library.")_
- **Envato VIDEO b-roll ingress → `hand:fade` (~0.5s):**
  13.17 · 20.30 · 100.84 · 176.90 · 192.60 (BR-16 subscribe CTA, added draft-QA) · 297.83 · 334.94 · 357.97 ·
  392.16 · 463.60 · 559.40 · 815.73 · 819.08 · 825.60 · 828.80 · 869.73
  (leading-motion clips 176.90 / 357.97 / 828.80 hold their move, still fade-in)
- **TEXT container scene changes → `hand:` cross-fade + 0.93→1 scale-in.** This is the QUIET default for the
  spotlight sub-point cards (not-an-app, tao-money, the D3-B1..4 role cards, tenant-card, one-thing-gpu,
  subnet-slot, lane-map, agentic-currency, acp-intro, acp-v2-stat, one-lane-operator, agent-subnet,
  permissionless-doors, fair-launch-checklist, which-lane, setup-checklist, etc.). Keep them quiet —
  melt/spin are reserved for the §4 marquees so those stay special.

## 4. DIAGRAM / CHART MARQUEES → reserved MELT (transform) + SPIN (new facet)  ⭐ NEW
The library's **MELT** and **SPIN** families are deployed **only** on the handful of marquee system-diagram /
chart moments, to give the thesis beats a motion-designed feel while everything else stays in §1-3.
**One melt look + one spin look for the whole video** (like the single card pick). Both carry baked SFX that
**must duck under the continuing VO** (`sfx_duck` — the reveal lands on a COVER beat, narration keeps going).

- **MELT look = `lib:melt-rgb-*`** (chromatic channel reform — "one structure liquefies and reforms into a
  related one"). Used for TRANSFORMS: before→after, and the re-highlighted callback. _(Engine note: `MeltRGB`
  is the ONLY melt engine with the live-clip `outClip/inClip` path — `MeltEquidistant` is image-only, "video
  TODO", so it can't take a cover-to-cover with a live animated chart/diagram component. `melt-rgb` is the pick
  on both look AND capability.)_
- **SPIN look = `lib:spin-3d-side-ease-*`** (3D turn over mirrored padding — "rotate the next thing into
  view"; echoes the `rmn:cube` card). Direction varies to mirror the edit's motion. Used for NEW-FACET reveals.

| TC (src) | Move | id | Why (TRANSFORM vs NEW FACET) |
|---|---|---|---|
| **371.0** | D4-A Render system reveal | `lib:spin-3d-side-ease-right` (0.88s) | **NEW FACET** — the first challenger rotates in from the right. |
| **479.0** | D5-A Virtuals launchpad reveal | `lib:spin-3d-side-ease-left` (0.88s) | **NEW FACET** — the second challenger rotates in from the *left* (mirror of Render → "the other contender"). |
| **321.6** | D3-D before → after (dTAO) | `lib:melt-rgb-short-1` (0.44s) | **TRANSFORM** — committee-decides reforms into market-decides; a quick before→after melt. |
| **592.4** | D6-A three-stack board reveal | `lib:spin-3d-side-ease-up` (0.88s) | **NEW FACET** — the verdict board turns up into view, completing the spin triad (right = challenger 1, left = challenger 2, up = the board that judges them). ⚙ WIRING: the spin IS the card's exit — **suppress the cube scene's own -90° out-rotation** and let `TransitionClip` turn card→board, so it reads cube-in → hold → ONE 3D turn, never two stacked rotations. |
| **635.4** | **D6-A board → D6-B THE SUPERSET** | `lib:melt-rgb-1` (0.76s) | **TRANSFORM · HERO** — the single most important transition in the video. On-screen the *outgoing* cover is the D6-A three-stack board (token-row state — D3-A itself last showed ~227s), which liquefies and REFORMS into the superset: three separate stacks becoming two nodes lit inside the third's ring. The constellation-recognition is carried by D6-B *being* the D3-A constellation re-lit; the melt delivers "one token already contains the other two." Wire `TransitionClip` outgoing = D6-A. |
| **749.5** | CHART C2 Metcalfe → Reed ingress | `lib:melt-rgb-1` (0.76s) | **TRANSFORM** — the same network reframed from n² to 2^n value; melt INTO C2 says "reform the network into its value view." (C2's internal Metcalfe→Reed morph stays its own animated build.) |

**Reserved count: 3 spins + 3 melts = 6 deliberate moves.** Not sprayed. Everything else = §1-3.

## Notes
- **Build precision (2026-07-19):** the CH6 card/spin point is **592.24** in the comp (the real silence dip
  between "…is for." and "All right" — `lint-pause-silence` caught the rounded 592.4 landing ON a word). The
  D6-A cover boundary moved with it, so the spin stays the card's exit. Docs' 1-decimal cues stay accurate.
- **D3-D melt is cover-to-cover for real now:** outgoing = `D3-D-before` state variant (committee lit, dTAO
  panel dim — `CH3_D3-D_dtao-before.png`), incoming = the full lit diagram. (Audit fix: both beats previously
  mapped to ONE file, so the melt would have morphed the image into itself.)
- **CH1 opener (0-13.2s) deliberately gets NO light leak** even though it is a >5s hold: the desilencer
  jump-cut motif (3.52/6.88/11.36) owns that stretch, and a leak window there would collide with the hits
  (overlay-never-on-a-transition-frame, `overlays.md`). The CTA leak sits 880.4-884.4 (the cover-free first
  stretch, before the IMG-8/9 inserts which would mask it).
- **The marquee scale-in reveals that stay `hand:` (NOT melt/spin), on purpose:** D3-A subnet constellation
  first appearance (198.30, longer scale-in) and CHART C1 emission (143.48) keep the clean scale-in so the
  LATER melt-reform of the constellation into D6-B (635.4) is the recognizable payoff. D7-A CH7 echo (848.4)
  is a distinct built asset, `hand:` cross-fade (a quiet callback, not a re-spin).
- **Occlusion / sync:** every §4 move is cover→cover, full-frame; the spine VO is continuous underneath and
  never revealed mid-transition. No `TransitionSeries` touches the spine (HARD RULE).
- **SFX under VO:** melt-rgb + spin-3d both ring SFX from the wrapper — the comp ducks each under the
  narration on its cover beat (bed-duck / SFX-under-VO rule). Never a whoosh on top of a word.
- Light leaks (`overlays.md`) on face holds > 5s: the 181.87-198.30 ad-lib and 873.73-911.26 CTA qualify.
- Captions ON (added 2026-07-19 — the "default OFF" line here was the silent-drift bug, see comp-build §8):
  Montserrat house style, FACE windows only, topmost layer; no caption-driven transition timing (captions
  never sit on a cover, so no §1-4 move interacts with them).
- **D7-A echo (848.4) — the one borderline melt call:** it's canonically a re-highlighted callback (melt territory),
  and a `melt-rgb-short-1` from which-lane → superset-echo would read "the question reforms into the answer" and
  bracket the thesis. Held QUIET here on purpose (protect the 635.4 hero; the CH7 close already carries 2 max
  glitches + 4 fades in ~20s). If Mike wants the close hotter, the short melt here is the sanctioned upgrade
  (→ melt_used 4).
- _Authored via the `transition-strategist` agent's method, then **independently cross-checked by spawning the
  agent** (`.claude/agents/longform-edited/transition-strategist.md`): its independent pass CONVERGED on all six
  melt/spin placements, the same look picks, and the same reserve decisions; its wiring corrections (635.4 outgoing
  = D6-A, 592.4 suppress the cube out-rotation, MeltEquidistant image-only) are folded in above._
