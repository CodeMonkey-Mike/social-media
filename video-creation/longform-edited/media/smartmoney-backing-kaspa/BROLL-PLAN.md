# smartmoney-backing-kaspa — BROLL-PLAN

_File-level b-roll manifest (longform-edited rule: every COVER beat is covered by a named asset, or marked
REJECTED / BENCH; zero orphans; the render confirms this plan, never discovers gaps). Charts + dashboard
captures are DONE (see DATA.md chart-source index + assets/). This file plans the ATMOSPHERIC / conceptual
b-roll that fills the cover beats between the data visuals._

## Source rules (per repo conventions)
- **Data visuals = code charts / real captures** (assets/charts, assets/captures). Never an AI image. DONE.
- **Atmospheric stills / concept images = ChatGPT** via the browser pipeline `repurpose/gen-batch-freshchat.js`
  (Mike's subscription, free). Text-free mood imagery only. Never gpt_image via Higgsfield CLI (burns credits).
- **Moving stock b-roll = Envato Elements** via `video-creation/skills/envato-broll/` (`search-envato.js` +
  `download-envato.js`). Silent clips (strip audio with `ffmpeg -c copy -an` after download).
- Style for ALL b-roll: dark, cinematic, Kaspa-teal (#49e0c8) accent, abstract, no readable text, 16:9.
- Place ChatGPT stills in `assets/broll/chatgpt/`, Envato clips in `assets/broll/envato/` (CH-prefixed names).

## Coverage map (beat → asset)

| Chapter | Beat | Asset | Source | Status |
|---|---|---|---|---|
| Cold open | "biggest wallets loading up" | whale-in-deep-water hero + money-into-vault | Envato clip + ChatGPT still | DONE (assets/broll/) |
| Cold open | "28M / 14M ... public ledger" | C1 ledger capture | capture | DONE |
| CH1 | the two buys | C1 (kaspastream-entityx) + code callout | capture | DONE |
| CH1 | "pull it off the market" | exchange→wallet transfer abstract | Envato | DONE (assets/broll/) |
| CH2 | the pack of whales | C13 chart + "pod of whales" still | chart + ChatGPT | DONE (C13 + chatgpt/...CH2-whale-pod.png) |
| CH2 | the daily buyer | C3 chart + C2 capture | chart + capture | DONE |
| CH2 | "we have no idea who" | anonymous hooded silhouette, dark | Envato | DONE (assets/broll/) |
| CH3 | the years trend | C5 chart | chart | DONE |
| CH3 | "claimed early" | rising teal tide / particles | Envato | DONE (assets/broll/) |
| CH4 | 13% / 86% | C6 chart | chart | DONE |
| CH4 | "maximum pain / retail capitulates" | red storm / falling chart mood | Envato | DONE (assets/broll/) |
| CH5 | float vanishing | C12 capture + C10 chart | capture + chart | DONE |
| CH5 | "scarcity / faucet closing" | glowing coins dissolving into dark | ChatGPT still | DONE (chatgpt/...CH5-coins-dissolving.png) |
| PLUG | community plug | Mike FACE + Crypto Rich card | recorded / design | N/A here |
| CH6 | room to run | C11 chart | chart | DONE |
| CH6 | "coiled / pressure" | compressed spring / dawn-before-breakout | Envato | DONE (assets/broll/) |
| CH7 | swim with the whales | whale breaching at sunrise hero | Envato clip + ChatGPT still | Envato DONE: `assets/broll/envato/CH7_whale-swim-sunrise.mp4` (24.5MB, transcoded from 1.56GB) |

## ChatGPT still batch (feed to gen-batch-freshchat.js)
All 16:9, dark cinematic, Kaspa-teal accent, NO text, photographic-but-abstract:
1. `CH0_whale-hero` — A colossal whale silhouette gliding through deep dark ocean, faint teal bioluminescent god-rays from above, moody, cinematic, no text.
2. `CH2_whale-pod` — A pod of several large whale silhouettes moving together through dark teal water, sense of coordinated mass, cinematic, no text.
3. `CH5_coins-dissolving` — Glowing teal Kaspa-like coins slowly dissolving into black smoke and disappearing, scarcity, dark studio, cinematic, no text.
4. `CH7_whale-breach-dawn` — A single massive whale breaching the surface of a calm dark ocean at first light, teal-tinted dawn, epic, hopeful, cinematic, no text.

## Envato clip batch (feed to search-envato.js → download-envato.js)
Pick vertical-friendly... no, 16:9; pick the darkest, most abstract result per term:
1. `CH0_vault-flow` — search: "digital money stream into vault dark cinematic"
2. `CH1_data-transfer` — search: "data transfer network nodes dark teal abstract"
3. `CH2_anon-figure` — search: "anonymous hooded figure silhouette dark moody"
4. `CH3_tide-rising` — search: "ocean tide rising timelapse dark cinematic"
5. `CH4_red-storm` — search: "dark storm sea waves ominous cinematic"
6. `CH6_spring-tension` — search: "energy build up particles dark before explosion"
7. `CH7_whale-breach` — search: "whale breaching ocean sunrise cinematic aerial" — DONE: licensed
   app.envato.com/.../7f58f90f-09f5-4cf6-94f8-475b00b0595a ("Whales Swimming in Ocean at Sunrise", 21aerials, 0:17).

### Download status — COMPLETE (2026-06-23)
ALL b-roll downloaded, transcoded (disk rule applied to >1GB / .zip), and audio-stripped (silent).

**Envato (`assets/broll/envato/`, 7 clips, all 0 audio):**
- CH0_vault-opening.mp4 (vault door opening, wealth locked away)
- CH1_onchain-network.mp4 (crypto blockchain network animation)
- CH2_anon-figure.mov (hooded figure silhouette = the mystery buyer)
- CH3_tide-rising.mp4 (dark Baltic sea aerial)
- CH4_red-storm.mp4 (dramatic ocean/sky)
- CH6_pressure.mp4 (cinematic rising particle columns; extracted from Envato .zip)
- CH7_whale-swim-sunrise.mp4 (whales swimming at sunrise, aerial)

**ChatGPT (`assets/broll/chatgpt/`, 4 stills, on chatgpt-profile):**
- broll-a0b1c2d3-CH0-whale-hero.png (whale in deep teal ocean, god-rays)
- broll-b1c2d3e4-CH2-whale-pod.png (pod of whales)
- broll-c2d3e4f5-CH5-coins-dissolving.png (teal coins dissolving)
- broll-d3e4f5a6-CH7-whale-breach-dawn.png (whale breaching at dawn)

Final clip SELECTION is first-pass (picked the top sensible match per beat); Mike can swap any during the EDIT-PLAN pass.

## Open / next
- Charts + captures DONE (DATA.md), b-roll DOWNLOADED + silent (above). Manifest has zero orphans.
- Next: record the VO off SCREENPLAY.md, then Phase 1-4 per longform-edited.md (EDIT-PLAN gate first).
- Trim/REJECT any b-roll during the EDIT-PLAN pass; swap first-pass clip picks if Mike prefers others.
