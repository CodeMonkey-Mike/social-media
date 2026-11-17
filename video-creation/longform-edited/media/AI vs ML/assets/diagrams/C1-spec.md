# C1 · system-design split (Type 2 SYSTEM-DESIGN, static states) · CH2@26.24-33.333

Source: `C1.html` (one template builds every state, so pixels outside the changing node are byte-identical; verified).
Geometry for the comp (node rects, arrow segments, lanes, the clear band for the pop): `C1-geometry.json`.
Spine 30 fps. Theme DARK, locked stylesheet, chapter accent = stylesheet default. Role colours from the VISUAL-PLAN:
AI ENGINEER = gold `#ffd700` (the lit colour), ML ENGINEER = green `#00e68a` (dim lane).

## States (one PNG each, swapped by the comp)

| PNG | On at (spine s) | Cue word | What changes |
|---|---|---|---|
| `C1-s0-base.png` | 26.24 | (cut in) | both lanes drawn, nothing lit, ML lane dim |
| `C1-s1-model.png` | 28.18 | "model" | MODEL SOMEONE ELSE TRAINED lights (gold border + label, glow = current) |
| `C1-s2-api.png` | 28.70 | "Claude" | arrow 1 + API light; MODEL keeps gold, loses the glow |
| `C1-s3-data.png` | 29.64 | "data" | arrow 2 + YOUR DATA |
| `C1-s4-product.png` | 30.46 | "product" | arrow 3 + PRODUCT |
| `C1-s5-evals.png` | 31.40 -> 33.333 | "testing" | arrow 4 + EVALS: the whole AI lane traced. Held to the F3 face cut |

## What moves, in order (comp-level only; the stills never move)
1. **26.24** `kt-push-slide` in onto s0 (sound `whoosh-4`), per the plan.
2. **Each cue above:** swap to the next state with a **4-frame cross-fade**. Shared pixels are identical, so the
   fade reads as the node lighting up, not as a redraw. Optional spotlight: scale the newly lit node rect
   (`C1-geometry.json` nodes.ai[i]) 1.00 -> 1.03 -> 1.00 over 8 frames, anchored on its centre.
3. **32.76** "any good": `kt-keyword-pop` **EVALS** (sound `twinkle`), jiggle variant, at **x 960, y 915**
   (override the 0.79 x 1080 = 853 default, which would clip the ML lane's bottom edge at y 830). The band
   y 846-990 carries no diagram ink. Removed by the 33.333 cut.
4. `kt-camera-wobble` (VISUAL-PLAN: every held card) is fine on this hold; keep it to the house amplitude so the
   node labels do not swim.
5. 33.333 tight join to the F3 face (no breath after "good").

## Wording, traced to DATA.md (nothing invented)
- MODEL SOMEONE ELSE TRAINED / like Claude: Huyen T1 "you use a model someone else has trained"; "a model like Claude" is the spoken line.
- API / glue code: Karpathy T2 + Pillar 1 "there's a lot of glue code/infra around it".
- YOUR DATA / RAG: DATA C1 "your data (RAG)"; LinkedIn skills line (T5).
- PRODUCT / what ships: the CH2 line "commonly associated with shipping products".
- EVALS / are the answers any good?: the spoken words; Huyen "evaluation a much bigger problem in AI engineering".
- ML lane DATA (datasets) · FEATURES (feature engineering) · TRAIN (your own model) · VALIDATE (test sets) · DEPLOY
  (to production): Stripe Radar posting "Design features, datasets ..." / "Build, train, evaluate, and deploy" /
  "in a production environment"; "train your own" per DATA Pillar 1 (no FROM SCRATCH on screen, W3).
- Headline "Wire a model in, or train your own." echoes "wiring" (spoken) and DATA's "train your own".
- Source line: Chip Huyen, AI Engineering, ch. 1 · Andrej Karpathy on X, 2023-06-30 · Stripe ML Engineer, Radar posting · read 2026-11-09.

Declare it in the comp as `// DIAGRAM_REFS: C1` (the one rich overview, shown once, held 7.1 s).
