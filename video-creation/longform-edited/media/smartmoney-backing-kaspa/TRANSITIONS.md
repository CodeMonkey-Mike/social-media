# smartmoney-backing-kaspa — TRANSITIONS plan

_How every cut is bridged. Feeds the EDIT-PLAN / CUE-SHEET. Policy follows the THREE-bucket transition
system (canonical: `video-creation/assets/transitions/README.md` + `longform-edited.md` #5). Glitch ids come
from `video-creation/assets/transitions/library.json`; chapter transition is a `@remotion/transitions`
presentation; b-roll/face overlays are hand-rolled on the spine. Do NOT collapse everything into the glitch
library (the earlier all-Blocks version of this file did — corrected 2026-06-24)._

## Policy (by cut type) — THREE buckets

### 1. Chapter / title cards → CUBE (pick-one-per-video; this video = cube)
Per the README "pick exactly ONE per video" rule: **every chapter title card in this video uses `cube`**
(`@remotion/transitions/cube`, a Safe-default CSS-3D presentation — no special render flag, unlike book-flip/
swap). One consistent move, never intermixed with slide/flip/etc. The title card is its OWN self-contained
scene, so cube is applied there via `@remotion/transitions` — NOT wrapped around the locked face spine
(README HARD RULE: never run the sync-locked talking-head spine through `TransitionSeries`).
(Screenplay originally said "cube" — this matches.)

### 2. Glitchy-fast hits → the GLITCH library (AI / atmosphere stills only)
- **ChatGPT image stills → a RANDOM Cinematic Bad Signal (1 of 6)** on the cut INTO each still (Mike's rule).
  Pool: `badsignal-max-1/2/3`, `badsignal-short-1/2/3`. (TV signal-loss glitch = right texture for AI stills.)
  This is the ONLY sanctioned glitch use in this video unless Mike adds a specific hype beat.

### 3. B-roll + face + containers → hand-rolled overlay transitions on the spine (default kit, house rule #5)
- **Envato VIDEO b-roll in/out → fade** (plain opacity ~0.5s; README default for b-roll). Hand-rolled
  `interpolate`, animated on the overlay, never `TransitionSeries`.
- **FACE cuts → film burn** (warm radial flash ±0.38s; the gated-face signature, house rule #5). On a FACE
  beat longer than ~2s, add a ~20% hard zoom punch-in mid-beat to re-engage (re-frame cut, no glitch).
  NOTE: this REPLACES the earlier experimental Blocks·Max-glitch-on-face choice — Mike's call 2026-06-24 is
  the default kit (film burn) for face, glitch reserved for AI stills. Never a plain cross-fade to the face.
- **Container / chart scene changes → cross-fade + 0.93→1 scale-in** (~0.35s; the spotlight recipe).
- **Charts / captures (code visuals)** reuse the container cross-fade/fade per their beat. They are NOT
  ChatGPT images, so they do NOT use Bad Signal.

## Chapter open → transition (ALL = cube)
| Boundary | Transition |
|---|---|
| Cold open | none (hard cold open, video start) |
| CH1 open | cube (title card) |
| CH2 open | cube |
| CH3 open | cube |
| CH4 open | cube |
| CH5 open | cube |
| PLUG in/out | fade (connective interstitial, NO title card — framing beat) |
| CH6 open | cube |
| CH7 (close) | cube (confirm title-card ON/OFF vs SCREENPLAY) |

## ChatGPT still → Bad Signal assignment (random, recorded for reproducibility)
| Still (assets/broll/chatgpt/) | Transition id (entrance) |
|---|---|
| CH0-whale-hero | `badsignal-max-2` |
| CH2-whale-pod | `badsignal-short-1` |
| CH5-coins-dissolving | `badsignal-max-3` |
| CH7-whale-breach-dawn | `badsignal-short-3` |
| KAS-coin-hero | `badsignal-max-1` |
| KAS-coin-vault | `badsignal-short-2` |
| KAS-blockdag | `badsignal-max-2` |
| KAS-off-exchange | `badsignal-short-1` |

## Envato video b-roll → cut-in (ALL = fade)
| Clip (assets/broll/envato/) | Transition |
|---|---|
| CH0_vault-opening | fade |
| CH1_onchain-network | fade |
| CH2_anon-figure | fade |
| CH3_tide-rising | fade |
| CH4_red-storm | fade |
| CH6_pressure | fade |
| CH7_whale-swim-sunrise | fade |

## FACE cuts
- IN: **film burn** (±0.38s).
- FACE beat > ~2s: add a ~20% zoom punch-in mid-beat (re-frame, no glitch).
- Tag the next line COVER so the cut can't carry across following lines.

## Durations (for timing the comp)
- cube: ~0.4-0.5s (set via `linearTiming`/`springTiming`). Bad Signal: Max ~0.76s, Short ~0.48s (SFX baked,
  lead-in trimmed). Film burn: ±0.38s. Fade: ~0.5s each side. 16:9 / 1920x1080 only (matches this video).

## Open
- Confirm CH7 close has a title card (cube) or flows in card-less; reconcile against SCREENPLAY title-card flags.
- cube needs `@remotion/transitions` installed in `video-creation/remotion/` (README: not yet installed —
  `npm i @remotion/transitions` when the comp is built).
