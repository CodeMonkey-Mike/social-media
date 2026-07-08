# bittensor-for-the-future — BROLL-PLAN

> **THE AUTHORITATIVE LIST IS THE FILE-LEVEL MANIFEST at the bottom of this file** ("FILE-LEVEL MANIFEST —
> reconciled to the comp"). Every image / video / chart file is there with its TYPE, the spoken line it covers,
> its placement timecode, or an explicit REJECTED/BENCH status. The concept cover-map below is planning context.
> Rule (`skills/broll-and-containers.md`): zero orphans — before any full render, every file in `render-assets/`
> is either placed (with timecode) or marked REJECTED/BENCH here.

Covers every `[COVER]` beat (gated-face rule #6). Three asset classes, gathered separately:

- **CONTAINER** = code-rendered HTML/SVG (text-accurate). CH5 set BUILT (`graphics/` + `presentation.html`).
  Other container needs are NOTED below (NOT built this pass — Mike said don't build anything else).
- **RECEIPT** = a real screenshot Mike captures (headline / blog post / bill / filing). NOT AI-generated.
  Listed so the edit plan is complete; capture at finishing time.
- **ATMOSPHERE** = text-free cinematic b-roll, the only AI-generatable layer (AI garbles text, so atmosphere
  only). Sourced TWO ways this pass: **ChatGPT stills** (`assets/images/`) + **Envato motion b-roll**
  (`assets/video/`). The editor picks stills vs motion per cutaway in Phase 4.

> This pass = GATHER the atmosphere layer (images + video) into `assets/`, plus `presentation.html`.
> Containers (other than CH5) and receipts are captured later. House-rule #2: b-roll is sparse cutaway
> punctuation, then back to face — this gives the editor a deep enough pool to choose from.

---

## Per-chapter cover map

| Chapter / beat | Asset class | What |
|---|---|---|
| CH1 "reached in… shut it down" | RECEIPT + ATMOS | Fable/Mythos ban headline; server-room-going-dark |
| CH1 "Gone. For everyone." | ATMOS | the off-switch / kill-switch |
| CH1 "Trillions pouring into AI" | ATMOS | capital-into-AI streams |
| CH2 the letter / export order | RECEIPT | NBC/TIME/Al Jazeera ban headline; Anthropic blog |
| CH2 the shutdown / dark overnight | ATMOS | data-center going dark |
| CH2 "Fix this code" trigger | RECEIPT + ATMOS | Fortune vuln article; abstract code/cyber screen |
| CH2 experts pushed back | RECEIPT | Moussouris / Stamos open letter |
| CH3 zoom out / supercycle | ATMOS | AI data-center cathedral; humanoid robotics; biotech lab |
| CH3 largest capital build-out | ATMOS | data-center construction |
| CH4 anti-gov anaphora | ATMOS | imposing government monolith / bureaucracy |
| CH4 decentralization roll-call | ATMOS | decentralized mesh network |
| CH4 accidental-endorsement vision | ATMOS | future-abundance city; biotech/medical; abundance |
| CH5 mechanics (subnets→dTAO) | CONTAINER | `presentation.html` (5 built containers) — BUILT |
| CH6 "TAO ripped" 210→261 | CONTAINER(chart) + RECEIPT | TAO 24h/7d chart at the ban window — NOTED, not built |
| CH6 $2.87B inflows | RECEIPT | AI-crypto inflows headline (Bitget/Stocktwits) |
| CH6 "capital repricing" | ATMOS | market / trading-floor / green candles |
| CH7 plug | (FACE throughout) | optional community lower-third container — NOTED |
| CH8 ban irony | ATMOS | reuse server-dark / off-switch |
| CH8 CLARITY Act on-ramp | CONTAINER(bill) + RECEIPT | H.R.3633 page — NOTED; capitol/regulation atmos |
| CH8 spot-TAO ETF | RECEIPT | Grayscale/Bitwise filing headline; Wall-Street atmos |
| CH8 "Bitcoin at $200" asymmetry | CONTAINER(chart) | BTC chart zoomed to ~$200 era — NOTED, not built |
| CH8 "goes parabolic" | ATMOS | parabolic surge |
| CH9 TAO + KAS two layers | CONTAINER(end-card) | "TAO + KAS, two layers nobody owns" — NOTED, not built |

---

## Containers still to build (NOTED — not this pass)
CH6 TAO 24h/7d chart · CH8 H.R.3633 bill receipt-container · CH8 BTC-at-$200 chart · CH9 TAO+KAS end-card ·
(optional) CH7 community lower-third. All are text/number-bearing → must be code-rendered containers, never AI.

## Receipts to capture (NOTED — screenshots, at finishing time)
Ban headline (NBC/TIME/Al Jazeera) · Anthropic blog post · Fortune "fix this code" article ·
Moussouris/Stamos open letter · AI-crypto inflows headline · H.R.3633 bill page · Grayscale/Bitwise ETF filing.

---

## ATMOSPHERE — ChatGPT stills (`assets/images/`, via `items-images.json`)
12 text-free cinematic 16:9 stills (see `items-images.json` for the prompts). Themes: AI data-center,
server-room-dark, capital-into-AI, humanoid robotics, biotech lab, government monolith, decentralized mesh,
abundance city, data-center construction, Wall-Street, parabolic surge, the off-switch.

## ATMOSPHERE — Envato motion b-roll (`assets/video/`, search terms)
| slot | search query | beat |
|---|---|---|
| datacenter | data center server room | CH3 supercycle / infra |
| server-dark | server room dark lights off | CH1/CH2 shutdown |
| robotics | humanoid robot artificial intelligence | CH3 robotics |
| biotech | dna laboratory research | CH3 biotech / CH4 cures |
| govt-building | government building capitol grey | CH4 anti-gov |
| network-nodes | abstract network connections nodes | CH4 decentralization |
| future-city | futuristic city aerial sunrise | CH4 abundance vision |
| construction | data center construction cranes night | CH3 capital build-out |
| wall-street | wall street financial district skyscrapers | CH8 ETF / institutions |
| market-chart | stock market green candles rising | CH6 market move |
| crypto-abstract | cryptocurrency blockchain abstract gold | CH4 fair launch / CH8 |
| code-screen | programming code screen close up | CH2 "fix this code" |

---

# FILE-LEVEL MANIFEST — reconciled to the comp (`remotion/src/BittensorCh1to6.tsx`), 2026-06-18

Authoritative. Times are ORIGINAL transcript time (the comp shifts everything after the 691.02s fumble cut by
−0.38s via `sh()`). Helpers in comp: `V('name',a,b)` = video `render-assets/vid/name.mp4`; `I('name',a,b)` =
image `render-assets/img/name.png`; `J(...)`=`.jpg`. CSS containers + CH5 diagrams are code-defined in the comp
(`CONTAINERS` / `DIAGRAMS` arrays) so they cannot orphan — summarized per chapter, not file-listed.

## VIDEO b-roll (`render-assets/vid/`)
| file | covers (chapter · line) | placement(s) |
|---|---|---|
| server-dark | CH1 "shut it down" · CH4 "no off switch" | 9.0–12.8 · 369.0–372.6 |
| market-chart | CH1 "money moved" · CH6 "watch what the money did" · CH8 "parabolic" | 33.7–37.2 · 612.0–615.6 · 768.0–771.5 |
| code-screen | CH2 "fix this code" | 99.5–103.0 |
| robotics | CH3 "robotics" | 187.0–190.6 |
| biotech | CH3 "biotech" | 200.0–203.6 |
| construction | CH3 "every industry at once" | 209.0–212.6 |
| inflation | CH4 "cost of living go up" | 250.5–254.0 |
| gavel-court | CH2 "the experts pushed back / signed a letter" | 124.9–128.4 |
| ruins-decay | CH3 "the ones who do not just get left behind" | 216.9–219.5 |
| datacenter | CH3 "the largest single capital build-out" | 225.4–229.0 |
| govt-building | CH4 "find yourself a government" (US Capitol) | 244.6–248.0 |
| bureaucracy | CH4 "difficult to provide for your family" | 254.2–257.0 |
| war-archival | CH4 "held back for decades, if not centuries" | 257.2–260.5 |
| padlock-cyber | CH4 "no bank can freeze it or print it" | 277.0–280.5 |
| protest-unrest | CH4 "no platform can deplatform you" | 292.2–295.5 |
| surveillance | CH4 "a company that can ban you" | 315.5–318.2 |
| network-nodes | CH4 "open marketplace for intelligence" | 338.0–341.5 |
| medical-tech | CH4 "cures diseases we've fought for centuries" | 398.4–402.0 |
| future-city | CH4 "doorway to the next stage of civilization" | 408.8–411.9 |
| crypto-abstract | CH6 "TAO ripped" | 616.0–619.5 |
| wall-street | CH8 "the green light banks were waiting for" | 738.8–742.4 |
| bank-vault | CH9 "money nobody can print or freeze" | 806.5–809.2 |
| **war-suffering-archival** | — | **REJECTED 2026-06-18: literal Auschwitz footage, too heavy / off-tone for an optimistic beat; redundant with war-archival. Converted file left in vid/ unused.** |

## IMAGE b-roll (`render-assets/img/`)
| file | covers (chapter · line) | placement(s) |
|---|---|---|
| the-off-switch | CH1 "no off switch" | 12.8–16.4 |
| datacenter-going-dark | CH1/CH2 "dark overnight" · CH8 ban irony · CH9 recap | 16.4–19.6 · 96.0–99.5 · 711.0–714.5 · 826.0–829.0 |
| decentralized-mesh-network | CH1 "network nobody owns" · CH9 recap | 19.6–21.86 · 831.0–834.0 |
| government-monolith | CH1 "being controlled" | 25.18–28.9 |
| mass-surveillance-eye | CH1 "told what to think" | 28.9–30.6 |
| capital-into-ai | CH1 "trillions pouring in" · CH8 "money flows" · CH9 recap | 30.7–33.7 · 749.0–752.5 · 836.0–839.0 |
| parabolic-surge | CH1 "smart money" · CH8 "goes parabolic" | 37.2–40.3 · 780.9–784.5 |
| white-house-night | CH2 "phone call to the White House" · CH8 govt | 143.0–146.8 · 730.0–733.5 |
| war-cemetery-crosses | CH4 "death, dying, and suffering" | 263.0–266.0 |
| suffering-historical (.jpg) | CH4 "suffering" | 266.0–268.42 |
| medical-cure-breakthrough | CH4 "ends scarcity, creates wealth" | 405.0–408.6 |
| future-abundance-city | CH4 "doorway to the next stage" | 412.0–415.0 |
| wall-street-institutions | CH8 "banks and asset managers" | 723.0–726.6 |
| ai-datacenter-cathedral | CH9 "the AI inference layer" | 799.0–802.3 |
| frozen-bank-vault | CH9 "the money nobody can freeze" | 803.5–806.4 |
| chart-tao | CH7 plug "I called TAO at the February bottom" | 648.5–658.5 |
| chart-lab | CH7 plug "353x on the lab token" | 661.0–666.3 |
| chart-velvet | CH7 plug "58x on the velvet token" | 666.6–672.0 |

### BENCH images (in `img/`, intentionally unused — superseded by a video for the same beat; keep as swap-ins)
`biotech-lab` (→ biotech.mp4) · `humanoid-robotics` (→ robotics.mp4) · `datacenter-construction` (→ datacenter.mp4 / construction.mp4) · `civilization-decay-ruins` (→ ruins-decay.mp4) · `inflation-money-burning` (→ inflation.mp4) · `bureaucratic-gears-halt` + `red-tape-bureaucracy` (→ bureaucracy.mp4) · `sealed-government-order` (→ govt-building.mp4 / gavel-court.mp4) · `silenced-speech` (→ surveillance.mp4 / protest-unrest.mp4).

## CHARTS (`render-assets/img/chart-*.png`, code-rendered from CoinGecko via `_build_call_charts.js`)
Listed under IMAGE b-roll (CH7). Arrows: LAB & Velvet at the entry ("MY CALL"), TAO at the Feb bottom. No
multiple printed on screen (VO carries 353x/58x; CG-tracked range differs). Tokens: CG ids `bittensor`,`lab`,`velvet`.

## CSS CONTAINERS + CH5 DIAGRAMS (code-defined in comp — cannot orphan)
Deck-styled `CONTAINERS` carry the dominant cover across CH2–CH9 (per-beat, transcript-synced); CH5 mechanics
use the 5 built `graphics/` diagrams (subnets / miners-validators / yuma-consensus / tao-token / dtao),
spotlight-swapped. RECEIPTS: `ban-aljazeera.png` (50–57), `fix-this-code-fortune.png` (133–143). LOGO reveal:
40.3–43.3 · 333.46–337.4 · 436.0–440.76. Lower-third CTA (CryptoRich.vip): 657–690.
