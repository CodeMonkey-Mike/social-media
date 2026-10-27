# growth-vs-product: diagram state cues (Type 2 SYSTEM-DESIGN stills)

_Built by chart-builder 2026-10-22. Every state is its own 1920x1080 PNG rendered from ONE render function per family (`<id>.html`, generator `_build_charts.py`, shot driver `_shot.py`), so shared elements are pixel-identical between states: the comp swaps states with a short cross-fade (6 f) and the swap reads as a light coming on, never a redraw. Times are FINAL-spine seconds (AS-RECORDED word timings). Lit colour = the chapter accent, cyan `#00c2ff` (CH3/CH4); the role pair rides on top (GROWTH gold `#ffd700`, PRODUCT green `#22c55e`). Movement only from these swaps plus the comp-level push-in; no node moves between states._

Declare all four families in the comp as `// DIAGRAM_REFS: loop-s1, loop-s2, aarrr-funnel, C1-s1, C1-s2, C1-s3` (each appears once, as its section's overview walk).

## loop-s1 · CH3@95.18-100.54 · "The product engineer builds a slow loop, a test set known with good answers and a regression gate"
Loop clockwise: TEST SET (TL) -> REGRESSION GATE (TR) -> RETRIEVAL FIX (BR) -> MODEL UPGRADE (BL) -> back to TEST SET. Hub label "THE SLOW LOOP".
| t | cue word | state PNG | change |
|---|---|---|---|
| 95.18 | "The product engineer" | `loop-s1-base.png` | all four nodes dim (opacity .38), arrows dim |
| 97.50 | "a test set" | `loop-s1-test-set.png` | TEST SET lit |
| 99.82 | "regression gate" | `loop-s1-gate.png` | REGRESSION GATE lit + the TEST SET -> GATE arrow lit; holds to 100.54 (C10 flash follows) |

## aarrr-funnel · CH3@108.44-113.90 · "that sets up the product differently for every new signup. And within days, you know whether more of them activate."
Dave McClure's five stages with his own wording, NO year anywhere (DATA.md section 4).
| t | cue word | state PNG | change |
|---|---|---|---|
| 108.44 | "that sets up" | `aarrr-funnel-base.png` | full funnel, all stages neutral |
| 111.18 | "within days" | `aarrr-funnel-within-days.png` | takeaway bar WITHIN DAYS / "you know whether more of them activate" fades up |
| 113.18 | "activate." | `aarrr-funnel-activation.png` | ACTIVATION lit (cyan band + glow, + AI STEP chip, its row bright), the other four stages dim to .42; holds to 113.90 |

## loop-s2 · CH3@113.90-122.10 · "The product engineer spends those three weeks on an eval set and a retrieval fix. Nothing to show on day three. And that eval set outlives this model."
Same loop and geometry as loop-s1 (state 2 returns where s1 left off: TEST SET + GATE lit). Hub reads "3 weeks" (digits per AS-RECORDED flag 103.22).
| t | cue word | state PNG | change |
|---|---|---|---|
| 113.90 | "The product engineer" | `loop-s2-base.png` | TEST SET + GATE lit, top arrow lit, hub "3 weeks" |
| 116.44 | "eval set" | `loop-s2-eval-pulse.png` | TEST SET pulse rings (the eval set). Comp: cross-fade in over 4 f, hold ~0.6 s, fade back to base over 8 f (or straight into the next state) |
| 117.68 | "retrieval fix" | `loop-s2-retrieval.png` | RETRIEVAL FIX lit + the GATE -> FIX arrow lit (no pulse ring) |
| 118.50 | "Nothing to show" | `loop-s2-day3.png` | dimmed dashed chip "nothing to show on day 3" under the hub ("3 weeks" does not move) |
| 121.04 | "outlives this model" | `loop-s2-upgrade.png` | MODEL UPGRADE lit + the FIX -> UPGRADE arrow + the RETURN arrow (UPGRADE -> TEST SET) lit; takeaway "That eval set **outlives** this model." fades up; holds to 122.10, cut to FACE |

## C1-s1 · CH4@132.14-139.48 · GROWTH stack lit node by node; PRODUCT and SHARED dimmed (.30)
Column order = lighting order. The two unspoken nodes (CDP, Outbound + content pipelines) light in sequence between the spoken ones. Newest node carries the stronger "hot" glow; earlier lit nodes stay lit.
| t | cue word | state PNG | node lit |
|---|---|---|---|
| 132.14 | "AI or not" | `C1-s1-base.png` | none (growth nodes neutral .72, header bright) |
| 132.94 | "landing pages" | `C1-s1-web.png` | Web + ad platforms |
| 134.14 | "analytics" | `C1-s1-analytics.png` | Analytics + attribution |
| 135.06 | "market(ing) automation" | `C1-s1-crm.png` | CRM / marketing automation (label keeps the postings' "marketing", flag 135.06) |
| 135.84 | (unspoken, end of "automation,") | `C1-s1-cdp.png` | CDP |
| 136.48 | "the A/B testing framework" | `C1-s1-experiment.png` | Experiment framework |
| 137.72 | (unspoken, end of "framework,") | `C1-s1-outbound.png` | Outbound + content pipelines |
| 138.78 | "AI on top" | `C1-s1-agents.png` | Agent workflows into GTM; holds to 139.48 (IMG-4 follows) |

## C1-s2 · CH4@142.32-151.22 · PRODUCT stack lit node by node; GROWTH and SHARED dimmed (.30)
| t | cue word | state PNG | node lit |
|---|---|---|---|
| 142.32 | "inside of it" | `C1-s2-base.png` | none (product nodes neutral .72, header bright) |
| 143.92 | "prompting" | `C1-s2-prompting.png` | Prompting + tool use |
| 144.32 | "retrieval" | `C1-s2-retrieval.png` | Retrieval (RAG, vector DB) |
| 144.80 | (unspoken) | `C1-s2-routing.png` | Model routing |
| 145.28 | "the eval harness" | `C1-s2-evalharness.png` | Eval harness |
| 146.18 | (unspoken, end of "harness,") | `C1-s2-latency.png` | Latency + cost monitoring |
| 146.52 | "guardrails" | `C1-s2-guardrails.png` | Guardrails |
| 148.68 | "an interface" | `C1-s2-featureui.png` | The feature UI; holds to 151.22 |

## C1-s3 · CH4@151.22-157.32 · SHARED middle lit node by node; both stacks half-lit (.62)
Each shared node's two connector wires (to both stacks) light with it.
| t | cue word | state PNG | node lit |
|---|---|---|---|
| 151.22 | "And the middle is shared" | `C1-s3-base.png` | none (shared header bright, both stacks .62) |
| 152.84 | "Model APIs" | `C1-s3-llm.png` | LLM APIs |
| 154.34 | "agents" | `C1-s3-agentsorch.png` | Agents + orchestration |
| 155.16 | "evals" | `C1-s3-evals.png` | Evals |
| 155.90 | "Python plus TypeScript" | `C1-s3-pyts.png` | Python + TypeScript; holds to 157.32 (C4c receipt follows) |
