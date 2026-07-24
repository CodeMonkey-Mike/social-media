# tao-render-virtuals — DATA.md

_Chart-source index + market snapshot for every on-screen number. Full verified evidence + citations live
in `DOSSIER.md` (deep-research 2026-07-18, 25 claims verified 3-0); this file is the render-time worklist:
what number goes on screen, where it comes from, and how the graphic is built. Every market/live number is
`[VERIFY]` — re-pull immediately before render (crypto drifts). Guardrail (charts.md): **never let an image
model be the source of a number** — data-charts are `code`, market data is a real-site `screencap`._

## Market snapshot (as of the 2026-07-18 dossier pull — RE-VERIFY at render)
| Figure | On-screen use | Source | Status |
|---|---|---|---|
| TAO ~$192–194, mcap ~$2.14B, ~11.13M circ | CH2 Beat 4 receipt; CH6 board | taostats.io · coinmarketcap.com/currencies/bittensor | `[VERIFY]` live |
| RENDER price + market cap | CH6 board | coingecko/cmc "render" | `[VERIFY]` — NOT captured in dossier, fetch live |
| VIRTUAL price + market cap | CH6 board | coingecko/cmc "virtuals-protocol" | `[VERIFY]` — NOT captured, fetch live |
| Subnet count (~120+, "over 128" Jan-2026 src) | CH1/CH3/CH6 spoken + [D3-A] labels | taostats.io/subnets | `[VERIFY]` — confirm exact live count |

## Fixed protocol facts (dossier-verified — safe to state; still fact-check named entities at render)
| Figure | On-screen use | Source |
|---|---|---|
| 21M TAO hard cap; fair launch (no ICO/premine/VC) | CH2 | arXiv 2507.02951 · taostats docs · CryptoTimes |
| First halving **Dec 12, 2025**; reward 1→0.5 TAO; daily ~7,200→~3,600; supply-threshold trigger @10.5M | CH2 Beat 3 → chart **C1** | arXiv 2507.02951 · CryptoTimes · CoinGecko (⚠ some pre-event srcs guessed Nov — use Dec 12) |
| Emission split: owners **18%** / miners **41%** / validators **41%**; delegators stake on validators; Yuma consensus + clipping | CH3 Beats 2-3 → [D3-B*], [D3-C] | learnbittensor.org · arXiv 2507.02951 |
| **dTAO launched Feb 13, 2025**; per-subnet alpha tokens (21M cap each); TAO/alpha AMM pools; fired 64 root validators | CH3 Beat 4 → [D3-D] | OAK Research · tao.media · CoinGecko |
| Subnet 64 "Chutes" = GPU/compute subnet (Render analog) | CH4 Beat 4 | tao.media (Jan 2026) — `[VERIFY]` live on taostats |
| Render: ETH→Solana **Nov 2023** via Wormhole; 1 RNDR = 1 RENDER; **BME** (burn-mint-equilibrium) | CH4 → [D4-B], [D4-C] | Render Medium · Messari |
| Render anchored by **OTOY** | CH4 Beat 1 / CH6 | `[VERIFY]` — NOT independently verified; confirm or soften |
| Virtuals on Base; VIRTUAL reserve asset; bonding curve **graduates @ 42,000 VIRTUAL**; 1B agent tokens → Uniswap, **10-yr lock** | CH5 → [D5-A], [D5-B] | Virtuals whitepaper · Messari |
| ACP: 4 phases (Request/Negotiation/Transaction/Evaluation) + escrow + Proof of Agreement; **v2.0 April 2026**, "18 months / 2,000+ agents" | CH5 Beat 3 → [D5-C] | Virtuals whitepaper — ⚠ 18mo/2,000 is Virtuals' OWN unaudited claim; keep "per Virtuals" on screen |
| Founder: **Jacob Steeves (Opentensor Foundation CEO) announced step-down Feb 13, 2026** | CH6 Beat 3 → [D6-C] | simplytao.ai — ⛔ NOT "Foundry / December" (see DOSSIER forbidden-claim #2) |
| Metcalfe n² overestimates (Odlyzko: ~n·log n); Reed 2ⁿ bigger overestimate (Van Hove: n·2^(n-1)) | CH6 Beat 4 → chart **C2** | Odlyzko & Tilly · Van Hove 2025 (Springer 10.1007/s10660-025-10058-4) |

## ⛔ Do-not-air numbers (DOSSIER forbidden claims — enforced in screenplay [!WARNING] boxes)
- The "**Virtuals 5% / Render 1% of what TAO does**" figures — rhetoric, NO basis. Never on screen. Reframe = breadth ("one lane vs 120+ lanes").
- Do NOT put holder/stake distribution (Gini ~0.98, top-1% ~90%) on screen as a decentralization argument — decentralization is the ARCHITECTURE axis (DOSSIER forbidden-claim #3).

## CHART-SOURCE INDEX (data-charts only; diagrams/containers are tracked in BROLL-PLAN, not here)
| ID | Chart / graphic | Data source | Build mode |
|---|---|---|---|
| **C1** | TAO emission / halving curve — capped issuance stepping down at the 10.5M threshold (Dec 12 2025), 7,200→3,600/day marker | protocol schedule (WE control the math) → animate for real (count-down/step) | **code** (animated, `useCurrentFrame`) |
| **C2** | Metcalfe (n²) vs Reed (2ⁿ) "shape contrast" — one-network vs network-of-networks curves; permanent on-screen label "A HEURISTIC, NOT A VALUATION"; **no price axis, no fabricated data points** | pure math functions (n², n·2^(n-1), n·log n) — conceptual only | **code** (animated, conceptual axes) |

## RECEIPTS (real-site market data — screencap, NEVER our own graphic; charts.md guardrail)
| ID | Proves | Capture (URL + view) | Status |
|---|---|---|---|
| **R1** | TAO price / mcap / circulating | taostats.io (or coinmarketcap.com/currencies/bittensor) | `[VERIFY]` live @ render |
| **R2** | RENDER price / mcap | coingecko.com/en/coins/render (or CMC) | `[VERIFY]` live @ render |
| **R3** | VIRTUAL price / mcap | coingecko/cmc "virtuals-protocol" | `[VERIFY]` live @ render |
| **R4** (opt) | live subnet count for the "120+" line | taostats.io/subnets | `[VERIFY]` live @ render |

_Diagrams (subnet constellation [D3-A], superset [D6-B], BME loop [D4-C], dTAO before/after [D3-D], the CH6
board [D6-A], etc.) are node+arrow SYSTEM-DESIGN containers, not data-charts — spec'd in the coverage plan /
BROLL-PLAN per screenplay.md Convention 4, built as code-rendered HTML/SVG (pixel-accurate labels)._
