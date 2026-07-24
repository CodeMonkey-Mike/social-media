# Clarity Act ensure US Dominance — BROLL-PLAN

B-roll ACQUISITION worklist (Envato terms / ChatGPT prompts / receipt URLs + status). Placement lives in
CUE-SHEET.md + EDIT-PLAN-prep.md; heavy shot detail stays HERE so the screenplay `[SHOW]` lines stay short.
Data visuals (containers/charts) are tracked as BUILT below for reference but their placement is in the CUE-SHEET.
Timecodes on `spine/clarity.d2.deburst.mp4` (6:59). **No-reuse rule (lint-covers.js): each clip used once.**

## Register: SOFT / normal explainer — b-roll is calm, real, documentary. No frantic hype montages.

---

## A. BUILT code assets (done — code-rendered, in `assets/`)
| id | asset | file | used at |
|---|---|---|---|
| D1 | Bretton Woods timeline | assets/deck/D1_bretton-woods-timeline.png | CH2 (0:43–1:47), spotlight per node |
| D2 | Stablecoin → Treasuries flow | assets/deck/D2_stablecoin-treasury-flow.png | CH3 (1:57–2:42) |
| D3 | Trojan-horse contrast | assets/deck/D3_trojan-horse-contrast.png | CH4 (3:39–4:27) |
| D4 | Coinbase-shaped hole | assets/deck/D4_coinbase-shaped-hole.png | CH5 (4:34–5:18) |
| C1 | Treasury yields (10/20/30yr) | assets/charts/CH6_C1_treasury-yields.png | CH6 (5:54) |
| C2 | Stablecoin → $2-3T Treasury demand | assets/charts/CH6_C2_stablecoin-treasury-demand.png | CH6 (6:09) |
| C3 | Coinbase $1.35B/yr | assets/charts/CH5_C3_coinbase-revenue.png | CH5 (5:00) |
| SUB | Subscribe overlay (1-2s) | assets/overlays/subscribe-overlay.png | PLUG (~3:13) |
| C4 | (OPTIONAL) money-printing / M2 | not built | CH3 (1:55) — build if CH3 wants a data beat |

_Charts C1-C3 animate for real in the comp (bars grow / numbers count-up); these PNGs are the approved proofs._

---

## B. RECEIPTS (×4) — CAPTURED + QA'd, in `assets/receipts/` (source; comp stages to render-assets at build)
Captured 1440-wide via a popup-dismissing Playwright capture. Comp crops each to the headline+lede (or tall-pan).
| id | file | what | used at | QA |
|---|---|---|---|---|
| R-STALL | assets/receipts/R-STALL.png | "CLARITY Act Blocked Before July 4" (Bitcoin Foundation, neon graphic + lede) | CH1 (0:00) | ✅ clean |
| R-GENIUS | assets/receipts/R-GENIUS.png | "Trump Signs GENIUS Act into Law" (White House) | CH3 (2:15) | ✅ crop to TOP (headline + reserve bullets; minor signup lower-left) |
| R-CLARITY | assets/receipts/R-CLARITY.png | "CLARITY Act Stalls in Senate as Three Disputes…" | CH5 (5:18, verdict) | ✅ clean, crop headline+lede |
| R-FORBES | assets/receipts/R-FORBES.png | "The GENIUS Act… Has A Coinbase-Shaped Hole" (sources 3.5% APY / loyalty reward / issuer-vs-affiliate) | CH5 (5:00) | ✅ clean, strongest |

---

## C. ChatGPT b-roll (×3 ONLY — going light per Mike) — atmosphere stills, generate via repurpose ChatGPT pipeline
Text-free atmosphere ONLY (never a number/label — those are containers/charts). Status ⬜.
| id | prompt (cinematic, dark, on-brand) | used at |
|---|---|---|
| CG1 | "A large wooden Trojan horse built out of folded US dollar bills, standing at the gates of a modern financial city at dusk, cinematic, dark moody lighting, teal-and-amber palette, photoreal" | CH1 (0:38, "Trojan horse for the dollar") ⬜ |
| CG2 | "A single glowing green US dollar symbol dissolving into a network of light spreading across a dark globe, held in hands with smartphones worldwide, cinematic, dark, teal/green glow" | CH6 (6:25, "put the dollar in everybody's hand") ⬜ |
| CG3 | "A giant surveillance eye made of glowing data grids hovering over a silent city at night, cold blue light, ominous, cinematic, dark palette" | CH4 (3:30, "every government wants a CBDC / surveillance") ⬜ |

---

## D. Envato stock b-roll (~10–11 clips) — search terms, download via skills/envato-broll (download-envato.js). Status ⬜.
| id | search terms | used at |
|---|---|---|
| BR-CAPITOL | "US Capitol building exterior", "Senate chamber", "Congress" | CH1 (0:05, "stuck in Washington") ⬜ |
| BR-HEADLINES | "newspaper headlines montage", "breaking news scroll" | CH1 (0:09, "the thing jamming it up") ⬜ |
| BR-PRINT | "money printing press", "dollar bills printing cash" | CH2 (0:58, "printed far more dollars") + CH3 (1:55, "printing more than economy") — need TWO distinct clips ⬜ |
| BR-GOLD | "gold bars vault", "Fort Knox gold reserve" | CH2 (0:43, WWII gold) ⬜ |
| BR-OIL | "oil rig pump jack", "oil barrels refinery" | CH2 (1:22, petrodollar) ⬜ |
| BR-TREASURY | "US Treasury building", "treasury bond certificate" | CH3 (2:24, "forced buyer of debt") ⬜ |
| BR-CRYPTO | "blockchain network animation", "digital coins glowing" | CH1 (0:27, "doing it with crypto") ⬜ |
| BR-PHONE | "hand holding smartphone payment app", "mobile banking" | CH3/PLUG (1:57 or app beat) ⬜ |
| BR-WORLD | "spinning globe network", "world map connections" | CH4 (3:30, CBDC map) ⬜ |
| BR-SURVEIL | "CCTV surveillance cameras", "data server room" | CH4 (3:39, "surveillance tool") ⬜ |
| BR-INFLATION | "grocery store prices", "rising cost of living receipt" | CH6 (6:36, "prices higher") ⬜ |
| BR-BITCOIN | "physical bitcoin gold coin", "bitcoin close up" | CH6 close (6:57, "things it can't print") — pair with BR-GOLD-reuse? use a NEW gold clip ⬜ |

_Close (6:57 "holding things it can't print"): brief hard-asset overlay = BR-BITCOIN + a gold shot + (optional) a
Kaspa mark from `assets/` — this OVERLAYS the face for ~2s (deliberate cutaway on the last line)._

## Acquisition status summary (2026-07-10)
- ✅ Containers D1–D4, charts C1–C3, subscribe overlay — BUILT + QA'd (assets/deck, assets/charts, assets/overlays).
- ✅ Receipts ×4 — captured popup-free + QA'd, in **assets/receipts/**.
- ✅ ChatGPT stills ×3 — CG1/CG2/CG3 generated (1672×941 landscape, on-prompt), in **assets/img/**.
- ✅ Envato ×13 — ALL downloaded + QA'd good, in **assets/video/** (fetch-via-URL fix; auto-transcoded per disk
  rule). The 3 re-grabs landed clean: unfolding newspaper, counting US $100s, digital particle earth. A
  green-screen/template title filter was added to the batch driver so overlay-elements aren't grabbed again.
- Note: some 4K .mov sources (CRYPTO 756MB, TREASURY 565MB, INFLATION 340MB) are under the 800MB transcode
  threshold so kept at 4K; the comp uses a 1080p proxy per house rule #4.
