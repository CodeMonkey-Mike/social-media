# ethereum-rwa — BROLL-PLAN

The **acquisition + build worklist**. Placement contract is `COVER-PLAN.json`; timing is authoritative in
`EDIT-PLAN.md` / `CUE-SHEET.md`. Heavy shot detail lives HERE so the screenplay's `🎬 [SHOW]` lines stay short.

**Spine:** `spine/ALL.e.desilenced.mp4` (417.41s). **Cover layer = 301.59s (72.3%), 44 cues, exact partition
(orchestrator-verified: no gaps, no overlaps, no FACE collisions).**

**⛔ Mike's priority order (2026-07-31):** RECEIPTS first · CHARTS second · containers third · video/image
b-roll LAST as ≤4s punctuation. Budget deliberately underspent: **Envato 9/10, ChatGPT 3/5.**

**Hard rules:** zero orphans · zero reuse (each file appears at most ONCE) · image/video ≤4s (≤5s only
`lead:true`) · card ≥5s · multi-element diagram ≥10s · no black >0.5s · **Robinhood assets use neon green
#CCFF00 / yellow, NEVER teal** (teal reads as Kaspa).

---

## 1. RECEIPTS capture worklist (assigned FIRST — 7 receipts)

Every row is captured, then **OPENED and verified** before it enters the comp (bot walls / cookie banners /
paywalls are the known silent failure). `R(article)` = prose read on air, gets ONE single-image motion move
(push-in), mixed so they don't all move alike. `R(other)` = platform/UI capture, treatment per capture.

| ID | Type | Beat | Claim it proves | Capture | Motion | Status |
|---|---|---|---|---|---|---|
| **R1** | R(other) | CH1 11.32-15.26 | total onchain RWA ~$31B+ ("over $30 billion worth") | `app.rwa.xyz` global overview, cropped to the total-value panel | **`lib:perspective-ease-in-short-up`** | ☐ |
| **R2** | R(other) | CH2 69.58-75.32 | BUIDL is a real BlackRock product | Securitize BUIDL fund page (name + AUM visible) | subtle ken-burns push | ☐ |
| **R3** | R(article) | CH2 111.88-118.00 | Ethereum mainnet RWA tripled to $17B+ | The Block, headline "Ethereum's tokenized RWA market jumps more than 300% YoY as value tops $17 billion" | `zoom-ease-short-in` (reading push) | ☐ |
| **R4** | R(article) | CH3 133.30-142.74 | Robinhood Chain mainnet went live July 1 2026 | Robinhood Newsroom mainnet announcement | **two-stage zoom** (wide → headline/date) | ☐ |
| **R5** | R(other) | CH4 222.88-231.88 | BitMine holds 5.78M ETH, #1 corporate holder | `strategicethreserve.xyz` (or coinpaper/bingx tracker) | **`lib:perspective-pan-3d-down`** (pans down the rows onto BitMine) | ☐ |
| **R6** | R(other) | CH4 234.82-239.94 | ~$200M weekly ETH ETF net inflows, ETHA leading | `farside.co.uk/eth/` flow table — **recapture at 3840 wide with real left/right padding**; ETHA is the LEFTMOST column | **`lib:perspective-ease-in-left`** (toward ETHA) | ☐ RECAPTURE |
| **R7** | R(article) | CH4 261.68-266.60 | Vitalik says ETH must keep accruing value in an L2 world | cryptoslate / Yellow.com piece quoting him (or his own post) | `zoom-simple-short-in` (reading push) | ☐ |

> [!NOTE]
> **Motion is now MIXED, not all-push** (`broll-and-containers.md` §2 requires it). The three R(other) flat data
> panels get **PERSPECTIVE**; the three R(article) prose receipts keep subtle reading zooms so the tilt never
> fights text the viewer is reading. **Capture consequence:** R5 and R6 get a travelling move, so capture them
> with enough vertical (R5) / horizontal (R6) headroom that the pan has somewhere to go and never runs off the
> edge of the table. Full rationale + the direction caveat: `TRANSITIONS.md` §3b.

**Benches:** R4 → `docs.robinhood.com/chain`. R7 → an **attributed quote card** ("Vitalik Buterin" + clearly
marked paraphrase) if no clean quotable page verifies. **Never fabricate a quote screenshot.**

> [!WARNING]
> ⛔ **The Motley Fool article is NEVER captured as a receipt.** Its headline reads "…Here's Why That's
> Bearish for Ethereum." We use its fee DATA inside `[D4-C]` only; the headline never goes on screen.

---

## 2. CHARTS build worklist

**Type 1 = CHART(anim)** — real animated data charts (`useCurrentFrame`, numbers count / bars grow).
**Type 2 = CHART(sysdesign)** — code-rendered HTML/SVG stills, movement only from comp spotlights.
⛔ Never an AI image as the source of a number (`skills/charts.md`).

### Type 1 — ANIMATED (8 slots / 7 charts)

| ID | Beat | What moves | Data source | Status |
|---|---|---|---|---|
| **C1** | CH1 15.26-26.22 | line/count-up ~$5B (start 2025) → ~$31B+; "+400%" tag lands ~23.5s | DATA.md row 1 (The Block / Yellow) `[VERIFY]` | ☐ |
| **C2 #A** | CH1 26.22-29.96 | dominance donut fills to ~61-65%, chain deliberately **UNLABELED** ("one chain") | DATA.md share row `[VERIFY]` | ☐ |
| **C2 #B** | CH1 30.73-36.04 | same donut, now **LABELED** Ethereum + share %; "not fastest / not cheapest" dimmed satellites | same | ☐ |
| **C6** | CH2 85.30-93.20 | 8 chain bars grow, Ethereum tallest (~$1.1B) highlighted, ~$2.9B total counts up. Label **"largest single-chain slice"** (never "most of BUIDL") | DATA.md BUIDL rows `[VERIFY]` | ☐ |
| **C7** | CH2 93.20-100.88 | donut/bar to **80% treasuries + cash-type** vs 20% rest; "institutional money" tag | DATA.md row 4 (Yellow) | ☐ |
| **C3** | CH3 173.46-185.10 | staged triple count-up: 4M testnet tx (~174) · $257.4M TVL + gloss "value parked on the chain" (~178) · $4.5B 7d volume (~183). **Neon green/yellow** | DATA.md momentum row `[VERIFY]` **fastest drift** | ☐ |
| **C8** | CH3 185.10-192.60 | tokenized-**EQUITIES** volume share: Solana ~95% ($3.31B) vs ETH $2M / Base $81M / BNB $59.6M, June 2026. Axis label scoped to *stock-trading volume* so it never reads as overall RWA | DATA.md competitive table `[VERIFY]` | ☐ |
| **C4** | CH4 202.96-222.88 | ONE continuously-building stacked bar, word-synced: STAKED → 28.91% (203-208) · "securing · earning yield" glow (208-210) · ~10:1 entry-vs-exit queue satellite (210-214) · CORPORATE TREASURIES +6.59% stacks (214-219) · total callout (~219.5) | DATA.md CH4 rows `[VERIFY]` | ☐ |

### Type 2 — SYSTEM-DESIGN (6 slots / 3 diagrams)

| ID | Beat | States | Status |
|---|---|---|---|
| **D2-A** tokenization flow | CH2 48.92-65.76 | animated L→R build: REAL ASSET → REGULATED ISSUER → SMART CONTRACT → TRADEABLE TOKEN; satellites "settles in minutes · 24/7 · DeFi-ready" land 61.9-65.7 | ☐ |
| **D3-A** settlement stack ⭐**MARQUEE** | CH3 144.78-161.26 | animated top-down: ROBINHOOD APP/WALLET → ROBINHOOD CHAIN (badges "Ethereum Layer 2" / "built on Arbitrum" / "100ms blocks" / "gas = ETH" landing 152.6 / 155.1 / 157.2) → ETHEREUM L1 ("security + settlement", 148.7-152.4). **#CCFF00 / yellow, NEVER teal** | ☐ |
| **D3-A #L1** break-up | CH3 192.60-200.34 | separate state: ETHEREUM L1 enlarged, the Robinhood block visibly docking onto it, L1 pulses on "they anchored to Ethereum" | ☐ |
| **D4-C #1** tollbooth overview ⭐ | CH4 246.54-253.40 | wide glowing fee stream at L2 level above the ETHEREUM L1 node, visibly almost nothing dropping down. **No numbers yet** | ☐ |
| **D4-C #2** the split ⭐ | CH4 253.40-261.68 | red sliver lands: "~$816K chain fees, **CUMULATIVE through July 13** → ~$1.5K to Ethereum L1 · 0.15%", source line "per chain fee data, July 2026" | ☐ |
| **D4-C #3** Fusaka ⭐ | CH4 266.60-279.18 | FEE FLOOR bar slides in under the stream ("minimum toll for using Ethereum's security"), tagged "floors start low today · a fix in progress" | ☐ |

> [!IMPORTANT]
> **FLAG D — the fact-framing trap.** At 253.40 the VO says fees "in **this first week**". The sourced $816K
> is **CUMULATIVE through July 13**. `D4-C #2` must label it CUMULATIVE and must NOT echo the VO. Re-verify the
> split at build; if it has improved, update the numbers but **KEEP the asymmetry framing** (WARNING box 1).

---

## 3. SLIDES build worklist (locked stylesheet: `skills/container-reference/`)

### TITLE SLIDES (3) — chapter cards, ride the ~1s inserted card-pauses (rule #11)
| ID | t | Text | Note |
|---|---|---|---|
| T-CH2 | 48.92 | **THE PROOF** | bed A→B change |
| T-CH3 | 129.92 | **ROBINHOOD CHAIN** | neon green accent, never teal · bed B→C |
| T-CH4 | 200.34 | **THE BULL CASE** | bed C→D change |

_Card text still an open screenplay question (#2). Min 1s readable — lead the card in BEFORE the baked pause._

### CARD SLIDES (10 slots)
| ID | Beat | Eyebrow / headline / content | Status |
|---|---|---|---|
| **D1-TEASE** | CH1 36.04-48.92 | silhouetted "?" chain block docking onto an Ethereum L1 base (**brokerage UNNAMED**, foreshadows D3-A); at ~44.5 three roadmap chips reveal: WHO IS BUILDING · WHAT JUST LAUNCHED · WHY IT'S MISPRICED. **No Robinhood mark or color here** | ☐ |
| **D2-B** | CH2 75.32-85.30 | BUIDL stat card: acronym gloss "BlackRock USD Institutional Digital Liquidity Fund" · "launched March 2024 · via Securitize · on Ethereum first" · $1.00 NAV / ~3.4% yield small print | ☐ |
| **D2-C** | CH2 118.00-129.92 | "$2T BY 2028" + **big visible FORECAST tag** + "Standard Chartered projection" attribution; direction-arrow animates up on "take a look at the direction" (~127.4) | ☐ |
| **D3-B** | CH3 161.26-170.00 | NVDA / GOOG / AAPL token tickers orbiting a 24/7 clock motif · "120+ countries" counter · "Uniswap + 1inch live day one". Neon green accents | ☐ |
| **D4-B** | CH4 239.94-246.54 | "$196.4M net inflows · July 14-21 · ETHA leading" + "staking ETFs now live (Grayscale · iShares)" + small demand→lockup arrow tying back to C4 | ☐ |
| **D5-CLOSE** | CH5 402.78-409.04 | "$2T BY 2028" (FORECAST tag retained) + Ethereum mark + "NOT PRICED FOR IT" landing on the spoken words. **No em dashes** | ☐ |
| **MONT-1..5** | CH5 289.54-306.27 | the rapid callback montage — **@end-state exported stills** of D2-B · D3-A · C4 · D4-B · D4-C. 2.07-4.26s each | ☐ |

> [!NOTE]
> **MONT-1..5 sit under the 5s card floor by design** — they are a scripted rapid re-recognition of
> already-read assets riding the building bed (screenplay CH5 Beat 1), not new reading. **Pending Mike's
> confirmation of the exemption.** They map 1:1 to the five spoken board items, built to the transcript.

---

## 4. VIDEO b-roll — Envato worklist (9/10, all ≤4s except the one `lead` exception)

| # | ID | Beat | Search query | Sec | Why | Ref | Status |
|---|---|---|---|---|---|---|---|
| 1 | V1 | CH1 8.44 | `financial district skyscrapers aerial dusk` | 2.9 | institutional-scale hook atmosphere | none exists (generic approved) | ☑ |
| 2 | V2 | CH2 65.76 | `glass skyscraper headquarters low angle` | 3.8 | "not startups in a sandbox. BlackRock," | none exists (generic approved) | ☑ |
| 3 | V3 | CH2 104.84 | `bank vault door closing steel` | 2.7 | "parks on the most battle tested chain" | none exists (generic approved) | ☑ |
| 4 | V4 | CH3 129.92 | `surprised trader reaction office monitors` | 3.4 | "made everybody really sit up in their chair" | none exists (generic approved) | ☑ |
| 5 | V5 | CH3 170.00 | `hand smartphone trading app close up` | 3.5 | "through their Robinhood wallet" — **generic app only, never a fake Robinhood UI** | none exists (generic approved) | ☑ |
| 6 | V6 | CH4 200.34 | `ethereum coin close up rotating dark` | 2.6 | "Ethereum, the asset" pivot | ETH mark — real logo, never invent | ☑ |
| 7 | V7 | CH4 231.88 | `stock exchange trading floor ticker board` | 2.9 | "stock money buying ETH through a ticker" | none exists (generic approved) | ☑ |
| 8 | V8 | CH5 391.19 | `giant ocean wave slow motion dark` | 3.8 | the wave motif re-entry after the ad-lib block | none exists (generic approved) | ☑ |
| 9 | V9 | CH5 398.24 | `grand bank lobby marble columns push in` | **4.5** | **`lead:true`** leading-motion exception, "if the banks are even half right" | none exists (generic approved) | ☑ |

**Benches:** V1 trading-floor wide · V2 manhattan towers · V3 fortress gate · V4 crowd looking up · V5 mobile
banking · V6 ethereum 3d dark · V7 wall street sign · V8 tidal wave storm · V9 bank facade dolly.

### 4b. visual-qa results + fixes applied (2026-07-31)
QA opened and frame-sampled all nine across their slot windows. **5 PASS · 4 FAIL.** The sourcer had
self-certified all nine and pre-flagged only the wave, so three defects were missed outright.

| Clip | Defect | Status |
|---|---|---|
| **V5 `br-phone-app`** | **ENTIRE CLIP WAS UPSIDE DOWN** — baked into the pixels, no rotation side-data, so Remotion would have rendered it inverted. Proof that the file was never opened. | ✅ **FIXED** — `hflip,vflip` re-export, verified right-side up (status bar top, Buy/Sell bottom, digits well-formed) |
| **V3 `br-vault`** | The payoff landed AFTER the slot: all 2.7s on screen were an ambiguous brass-pin macro; the vault wheel only resolved at 3.6-4.5s | ✅ **FIXED** — re-trimmed to an in-file start of 1.8s (§4a allows this), so the slot now covers 1.8-4.5 and lands on the wheel. Zero download cost |
| **V2 `br-hq-tower`** | **SECOND banned-teal clip** (mean hue 189-191°, 33-36% of pixels in the teal band — seafoam glass = the Kaspa read) and 2nd brightest in the set | ✅ **FIXED** — graded `hue=h=42:s=0.88, eq=brightness=-0.10:contrast=1.06`; glass now navy/blue-violet and sits with the dark family. **Original preserved as `_br-hq-tower-ORIG.mp4`** |
| **V8 `br-wave`** | **BANNED TEAL, far worse than flagged:** teal coverage 58% → 98% across the slot, brightest clip by 2-8x (near-white sky = a WHITE FLASH in a navy video), and the wave **COLLAPSES** inside the slot (backwards under "structural demand"), plus a land headland enters frame | ⛔ **RE-SOURCE REQUIRED** — a grade cannot fix "collapses" or the headland. **BLOCKED ON DISK** (C: at 100%; the darker first-choice item is a 2.5 GB 4K file that already failed with ENOSPC twice). Want: dark deep-blue swell BUILDING, no sky, no coastline |

**Two content calls for Mike (not defects, judgment):**
- **V5** now legibly shows a **BTC/USDT** pair (a Bitcoin pair) under the line "that's all through their Robinhood
  wallet" in an Ethereum video. Options: accept (Robinhood does trade BTC, and the clip is otherwise ideal),
  re-source, or frame out the pair label.
- **V9 `br-bank-lobby`** licensed item is literally titled "Sophisticated Hotel Entry" — lions, mosaic dome and
  cypress read hotel/palace rather than bank under "if the banks are even half right." QA verified its
  `lead:true` motion is genuine (continuous accelerating push-in, no cuts, no stalls) and recommends keeping it,
  since marble + lions still carries old-money institution and it is the most expensive slot to replace.

**Clean across all nine:** 1920x1080 progressive, no letterbox, no hidden scene cuts, no static plates, no black
lead-ins, no watermarks, **no audio streams**, and `br-ticker-floor` carries numerals only (zero company names,
so no brand risk).

### 4a. SOURCED — Envato licensing record (2026-07-31, all 9 downloaded · audio stripped · 1920x1080)

Files live at `assets/vid/`. Each is trimmed to the slot duration plus handles; the comp uses the file from
`t=0` unless an in-file start is noted.

| # | File | Envato item (licensed) | Item title | In-file notes |
|---|---|---|---|---|
| 1 | `br-skyline.mp4` | https://app.envato.com/search/stock-video/9cff6656-ef5c-4f3c-ad2d-f55fcffa9362 | Aerial view of the Manhattan Financial District at dusk (BlackBoxGuild) | 4.92s |
| 2 | `br-hq-tower.mp4` | https://app.envato.com/search/stock-video/02437cbc-3df4-4c57-9864-cc9d3937f6dd | Glass Office Tower Reflecting Modern Financial District Architecture (QWAKE) | 5.80s |
| 3 | `br-vault.mp4` | https://app.envato.com/search/stock-video/433eea0c-c5e4-45a8-a411-b79bb21a8acf | A solid metal gate used by bank to protect and secure all of the stored deposit (dabarti) | 4.72s |
| 4 | `br-trader-react.mp4` | https://app.envato.com/search/stock-video/ad776a45-39dd-40ce-8c9e-7a911fa67ff0 | Close Up of Young Businessman Get Shocked in Office at Night (Stockland) | 5.40s · trimmed from source 1.6s so the reaction lands inside the 3.4s slot |
| 5 | `br-phone-app.mp4` | https://app.envato.com/search/stock-video/e9201e2b-415f-4e99-9cf3-826995f46cbc | Close Up Smartphone with Stock Exchange Trading Man Hand Scrolling Touch Screen (demopicture) | 5.52s · generic dark app UI, no brand marks · source was native 1080p |
| 6 | `br-eth-coin.mp4` | https://app.envato.com/search/stock-video/738d56c9-3f36-423e-9570-51e2d2f21782 | Ethereum Cryptocurrency Coin Close Up on Black (vagoart) | 4.60s · real ETH mark, physical coin |
| 7 | `br-ticker-floor.mp4` | https://app.envato.com/search/stock-video/36372f97-c644-47ca-ab4a-bb23593e056a | Stock Market Data Board (frender) | 4.90s |
| 8 | `br-wave.mp4` | https://app.envato.com/search/stock-video/dda6f478-5372-4d33-b6d0-1959a8722abf | Powerful Blue Ocean Wave Crashing Down Under A Gray Sky (Xtremelevel) | 5.80s · trimmed from source 2.0s · 2048x1080 source centre-cropped to 1920x1080 |
| 9 | `br-bank-lobby.mp4` | https://app.envato.com/search/stock-video/9af507f8-f549-4e5c-a948-ad2b59141709 | Sophisticated Hotel Entry Showcasing Marble Statues and Elegant Arches (icetray) | 6.52s · **`lead:true` CONFIRMED** — continuous forward push-in through the arch |

## 5. IMAGE b-roll — ChatGPT worklist (3/5)

House style: Pixar-style 3D CGI, deep navy near-black, cinematic rim light, **NO text** (text-free
atmosphere layer only). Browser pipeline, never an API image model. Every image unique.

| # | ID | Beat | Prompt concept | Ref | Status |
|---|---|---|---|---|---|
| 1 | I1 | CH2 100.88 | stampede of small flashy coins racing one way while a massive suited institutional figure calmly walks the other way toward a blue-violet vault | none exists (generic approved) | ☐ |
| 2 | I2 | CH4 286.12 | a highway tollbooth **under construction** at night, lanes of glowing traffic streaming past the unfinished booth, amber light trails on navy | none exists (generic approved) | ☐ |
| 3 | I3 | CH5 395.00 | a skyscraper, a treasury-bond scroll and a stock certificate crystallizing into glowing blue-violet tokens | none exists (generic approved) | ☐ |

**Benches:** I1 → deck contrast card · I2 → deck card "THE GAP IS THE SETUP" · I3 → deck card "REAL ASSETS · REAL INSTITUTIONS".

---

## 6. Dropped / deliberately underspent (no silent truncation)

- **CH1 multi-shot atmosphere montage** (trading floors, server racks) from the screenplay VISUAL-PLAN —
  compressed to V1 + V3 because R1 + C1 + C2 carry those seconds under Mike's receipts-and-charts-first order.
- **CH5 "callback energy" AI stills** — the montage runs on end-state container stills instead.
- **DATA.md [C5]** ETF-inflow chart — demoted to the D4-B card (screenplay's own call), with R6 carrying the proof.
- 1 Envato slot + 2 ChatGPT slots left unspent.

## 7. Open items

1. **C4 overlap check** (screenplay CH4 `[VERIFY]`): if staked corporate ETH double-counts, C4 + MONT-3 show
   the two stats side by side with **no summed "~35%" label**. Mike's call on the callout.
2. **MONT-1..5 sub-5s exemption** — confirm.
3. **R4 URL** — Robinhood Newsroom primary, `docs.robinhood.com/chain` fallback; confirm at capture.
4. **R5 tracker** — strategicethreserve.xyz vs coinpaper/bingx, whichever renders BitMine cleanest.
5. **R7** — if no clean quotable Vitalik page verifies, run the bench attributed-quote card.
6. **Title-card texts** (open screenplay question #2).
7. **Live-drift re-pull before build:** C1 end value · **C3 TVL/volume (fastest)** · R6 current ETF week ·
   C6 BUIDL AUM · D4-C fee split (keep asymmetry framing even if improved) · Fusaka live-status tense.
