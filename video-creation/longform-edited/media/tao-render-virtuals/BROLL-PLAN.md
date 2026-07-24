# tao-render-virtuals — BROLL-PLAN (acquisition worklist)

_The b-roll ACQUISITION list only (atmospheric shots + AI stills). Format: `edit-plan-and-cue-sheet.md` §0.
Data visuals (diagrams / charts / containers) are NOT here — they live in the coverage plan (`spine/_cover-plan.json`)
+ the cue sheet. Budget (Mike's override): **15 Envato video + 10 ChatGPT image**; used **15 + 7** (3 image slots
in reserve). Every clip 1-4s (≤5s only for a `lead:true` leading-motion push). No asset reused (house rule #12).
House image style: Pixar-style 3D, deep navy, rim light, **no text, no numbers, no real tickers/brands**
(image-gen is the number-free atmosphere layer ONLY — charts.md guardrail)._

## Envato Elements — VIDEO (15/15) · status: ✅ SOURCED 2026-07-18 → `assets/video/BR-*` (all verified valid, 4K originals auto-transcoded to ~90MB proxies)
| # | Beat (src tc) | Search terms | Sec | Lead | Bench |
|---|---|---|---|---|---|
| BR-1 | CH1 13.17 | times square neon billboards night crowd | 3.83 | | multi-screen stock-ticker wall |
| BR-2 | CH1 20.30 | aerial ascend mountain summit sunrise / rising aerial city skyline dawn | 3.94 | | rocket-launch ascent |
| BR-3 | CH2 100.84 | server room GPU racks blinking lights data center | 3.96 | | AI neural-viz loop |
| BR-4 | CH2 176.90 | camera push through dark data center corridor | 4.97 | ✔ | shared datacenter-corridor-dark.mp4 |
| BR-5 | CH3 297.83 | bank vault door lock mechanism macro | 3.71 | | padlock macro |
| BR-6 | CH3 334.94 | aerial river delta branching water flow | 4.00 | | liquid gold pour macro |
| BR-7 | CH3 357.97 | stadium tunnel walkout arena lights boxer entrance | 4.45 | ✔ | boxing-ring spotlight ≤4s |
| BR-8 | CH4 392.16 | VFX studio artists workstations render farm | 4.00 | | motion-graphics workstation |
| BR-9 | CH4 463.60 | athlete sprint single lane running track | 3.90 | | swimmer single lane |
| BR-10 | CH5 559.40 | drone pull back reveal city aerial zoom out | 3.90 | | satellite zoom-out |
| BR-11 | CH6 815.73 | man silhouette crossroads night city decision | 3.35 | | trader silhouette before screens |
| BR-12 | CH7 819.08 | city lights hyperlapse night traffic timelapse | 3.52 | | highway light-trails |
| BR-13 | CH7 825.60 | data center aisle lights power on sequence | 3.02 | | server LED macro |
| BR-14 | CH7 828.62 | slow push in lighthouse night / lone lit window skyscraper push in | 5.18 | ✔ | single lit door static ≤4s |
| BR-15 | CH7 869.73 | man walking alone dawn ahead of crowd / surfer paddling dawn | 4.00 | | empty dawn street |

_3 leading-motion clips (BR-4/7/14) use the ≤5s exception — sparing (3 of 15). Trim BR-14 to 5.0s if the linter is strict._

- BR-16 engagement-counters — subscribe/like CTA cover (192.6-196.4) — sourced 2026-07-19 (Mike QA note) — Envato item: https://app.envato.com/search/stock-video/356f8bfd-37f5-4d04-bf57-62ae2a798df5

## ChatGPT images (9) · status: ✅ GENERATED + QA'd 2026-07-18 → `assets/img/IMG-1..9`. IMG-1..7 via generate-broll-reload.js (visual-qa PASS 7/7, no stray text/digits); IMG-8/9 (LAB.png / velvet.png refs) via generate-image.js — logos correct, NO number baked (350x/58x = comp overlays)
| # | Beat (src tc) | Prompt concept | Sec | Bench |
|---|---|---|---|---|
| IMG-1 | CH1 17.00 | graveyard of dimming, burnt-out abstract neon logos (dot-com deaths); no real brands | 3.30 | Envato 'neon sign flickering off' |
| IMG-2 | CH3 265.34 | robot referee holding a glowing scorecard, grading worker robots | 3.96 | **DROP candidate** (levity in Yuma teach) — skip → start D3-C at 265.34 |
| IMG-3 | CH4 411.00 | tiny glowing token perched on a massive foreign blockchain platform | 3.66 | skip; extend tenant-card |
| IMG-4 | CH5 514.32 | two cute robot AI agents exchanging a glowing token | 3.58 | skip; start agentic-currency card |
| IMG-5 | CH6 745.84 | magnifying lens held over a glowing network constellation | 3.66 | skip; give C2 a title phase |
| IMG-6 | CH7 822.60 | glowing neural-network canopy over a night city | 3.00 | Envato aerial city + data overlay |
| IMG-7 | CH7 833.80 | a hand holding ONE glowing abstract coin steady while blurred chaos swirls past; coin abstract (no ticker) | 4.00 | diamond-in-vice macro |
| IMG-8 | CH7 CTA (~14:4x, inside 873.73-911.26) | a glowing "lab" AI-token coin, Pixar-style 3D, deep navy, rim light — **NO number baked in the image** | ~3 | product/token render |
| IMG-9 | CH7 CTA (~14:5x, inside 873.73-911.26) | a glowing "velvet" token coin, same house style — **NO number baked in the image** | ~3 | product/token render |

_⛔ #6 (Mike, 2026-07-18): the track-record multipliers **350x (lab) / 58x (velvet)** are shown as a **CODE overlay/lower-third** composited on top of IMG-8/IMG-9 in the comp — NEVER baked into the ChatGPT image (charts.md guardrail: an image model must never be the source of a number). These are brief cover inserts within the CH7 FACE CTA block (cut to token+overlay on the claim, back to face). **HARD `[VERIFY]` before render** — the multipliers must be current/accurate before they go on screen (persona track-record rule). ChatGPT budget now 9/10 (2 reserve slots left)._

## Sourcing rules
- Envato via `video-creation/skills/envato-broll/SKILL.md`. AI clips: strip baked audio (`ffmpeg -c copy -an`).
- Generate images via `higgsfield-generate` / the ChatGPT browser pipeline, ONE per invocation, pixel-verify.
- Keep adding/benching here; the cue sheet + EDIT-PLAN-prep place them. Zero orphans: every asset above is PLACED in `_cover-plan.json` (none loose).
