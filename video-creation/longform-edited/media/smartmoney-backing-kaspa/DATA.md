# smartmoney-backing-kaspa: DATA & CHART-SOURCE INDEX

_The research dump for the video. Every number here carries a source. On-chain figures drift, so
anything quoted on screen gets re-pulled at render time and is tagged `[VERIFY]` in the SCREENPLAY.
Cross-coin (BTC/XRP/ICP) numbers are AI-answer estimates from the source videos, NOT independently
verified, and must stay framed as "approximate / illustrative." Chart-capture URLs are in the index
at the bottom._

## Source videos (research set)

| # | Creator | Title | Date | Explorer used |
|---|---|---|---|---|
| V1 | KatDaddyKrypto | "Someone is Quietly Cornering the KASPA Market! Should We Be Worried?" | 2026-06-16 | kas.fyi rich list + AI comparison slides |
| V2 | KatDaddyKrypto | "Something HUGE Is Happening With KASPA Whales! (Urgent Update)" | 2026-06-13 | kas.fyi (Wallet #17 deep-dive) |
| V3 | Gerhard - Bitcoin Strategy | "Kaspa - Time for a 6x Gain? - KAS Crypto Analysis" | 2026-06-22 | **Kaspalytics** (the charts at ~1:35-2:53) |

**The narrative tension (our spine):** Gerhard (V3) reads "top 0.01% of addresses now hold ~38% of
supply" as a *centralization risk*. KatDaddy (V1/V2) reads the same whale-buying as *bullish
conviction*. Our angle, **smart money backing Kaspa**, takes Gerhard's "bearish" data point and the
KatDaddy buys and reframes them as one story: sophisticated capital is quietly absorbing supply off
the exchanges, and the on-chain ledger proves it.

---

## A. The visible buys: Entity X / rich-list #1 (on-chain fact)

- **VERIFIED on-chain 2026-06-23 via api.kaspa.org** (Entity X = `kaspa:qpz2vgvlxhmyhmt22h538pjzmvvd52nuut80y5zulgpvyerlskvvwm7n4uk5a`):
  - **+27,999,998 KAS from Gate.io** on **2026-06-15 11:39 UTC**, tx `49182fbf8da73d48460e471bbd55d5b06db2c56cd9a56800f02cfc19b3527c75`.
  - **+13,999,995 KAS** on **2026-06-15 11:46 UTC** (7 min later; sender `kaspa:qqywx2wsz...`, the wallet the video tagged Bitget), tx `5efe92638b4bfa8cff53b4137d918d058f92d332f1d29fda4efb68b195b87f58`.
  - So the two buys are the SAME DAY (June 15), ~42M KAS total. (The "+42M in 3 days" V1-vs-V2 delta is essentially these two txs.) Current balance **1,457,646,272 KAS** (#1 holder, 5.295%).
  - Screenshots captured: `assets/captures/CH1_entityx-ledger_kaspastream.png` (address ledger, both buys + labels) and `assets/captures/CH1_richlist_kaspastream.png` (Entity X as #1; + `CH1_richlist_kaslens.png` backup). kas.fyi is dead; kaspa.stream is its successor (same UI).
  - (A ~3,600,095 KAS tx tagged Bybit was also visible in V1, not called out.)
- **Entity X total balance (kas.fyi rich-list #1, labeled "Entity X"):**
  - V2 (2026-06-13): **1,413,779,814 KAS = 5.140%** of supply; 7d change +3,600,097.
  - V1 (2026-06-16): **1,455,779,808 KAS = 5.292%** of supply.
  - Net: **~+42M KAS in 3 days**, corroborates "buying almost daily." `[VERIFY at render]`
- Accumulating "at the 3-cent mark" (~$0.03 KAS price reference, V2).

## B. The hidden buyer: Wallet #17 (the under-the-radar story, V2)

- Rich-list **rank #17**, address `kaspa:qrqlynq54...850jvl`.
- **Total balance: 107,300,360.49 KAS ≈ $3,323,268** (V2 @ ~02:44, kas.fyi address page).
- Address page: **712 transactions, 321 UTXOs, first tx 01/01/25 (527 days), last tx 06/12/26.**
- Rich-list row: Share **0.390%**, Change 1d **+428,001**, 7d **+8,668,515**, 30d **+34,405,253**
  (the 30d +34.4M delta is the proof of relentless accumulation). `[VERIFY at render]`
- Buy cadence: multiple six-figure-KAS txs **every single day going back to mid-April**.
  - Sample tx sizes (KAS): 100k / 200k / 700k / 400k / 500k / 800k … typical 90k-770k each.
  - Daily counts: Jun 8 = 5 tx; Jun 7 = 6-7; Jun 6 = 3; Jun 5 = several.
- Identity unknown: exchange? market maker? a BTC-OG rotating in? (speculation, keep it open).

## C. The supply map: rich list concentration (kas.fyi, V1/V2)

| Metric | V2 (06-13) | V1 (06-16) |
|---|---|---|
| Addresses holding ≥1 KAS | 541,650 | 541,781 |
| Top 10 own | 6.67B (24.27%) | 6.69B (24.30%) |
| Top 100 own | 11.05B (40.17%) | 11.05B (40.18%) |
| Top 1000 own | 16.16B (58.77%) | 16.16B (58.76%) |
| Circulating supply | 27.51B (95.82% mined) | 27.51B (95.85% mined) |
| Contributors | 83 | 84 |

Top-10 addresses (V1, by share): #1 Entity X 5.292% · #2 MEXC 3.262% · #3 Gate.io 3.038% ·
#4 KuCoin 2.401% · #5 Uphold 2.140% · #6 Kraken 1.860% · #7 Bitvavo 1.845% · #8 Bybit 1.747% ·
#9 Kraken 1.624% · #10 Kraken 1.092%. **Note: most of the "top 10" are EXCHANGE custody wallets, not
individuals**, important nuance for the decentralization argument. `[VERIFY at render]`

## D. The whale-concentration chart: top 0.01% (Kaspalytics, V3 @ ~02:32-02:53)

- Chart title: **"Percent of Circulating Supply Held By Top 0.01% of Meaningful Addresses."**
- Blue line = top-0.01% holding %; white line = KAS price (right log axis ~$0.03-$0.50). X-axis Sep'22 → Jun'26.
- **Risen from ~20% (2023) to ~38% (2026).** Tooltip frame: **04/10/2026 = 38.79%** at KAS ~$0.10.
- **EXTRACTED + VERIFIED on-chain 2026-06-23** (Kaspalytics SSR data via `?dtype=cs-percent&percentile=0.01`):
  **1029 daily points, Aug 2023 → Jun 2026; 24.4% (Aug 2023) → 38.4% (now)**, min 20.2%, max 39.1%. KAS
  price FELL $0.037 → $0.029 over the same span (concentration UP while price DOWN = accumulation). Built as C5.
- Gerhard's read: "supply getting more centralized … 38% in the hands of a few mega whales."
- **Our reframe:** that climb IS the smart-money accumulation curve. `[VERIFY at render]`

## E. Supply in profit / loss (Kaspalytics, V3 @ ~02:13-02:30)

- Chart: **"Supply in Profit / Loss."** Tooltip **06/21/2026: In Profit 13.53%, In Loss 86.47%**, KAS ~$0.07.
- Gerhard: "supply in profit is only 13% … 86% in losses, not sure what to think."
- **Our reframe:** max-pain capitulation is exactly when smart money accumulates from weak hands. `[VERIFY]`

## F. Network / market context (Kaspalytics + market, V3)

- Unique active addresses: ~**6,000-7,000/day** recently, fluctuating (Kaspalytics Active Addresses). `[VERIFY]`
- Total fees: a few hundred to few thousand USD/day recently (Kaspalytics Total Fees).
- Market cap **below $1B**; prior historical top **~$5B** → Gerhard's "6x" mean-reversion framing (keep CONDITIONAL).
- 24h volume: **$2M spot (HTX) vs $13M perp**; funding positive; **open interest at historic lows**
  ("not a lot of leverage, price not artificially inflated"). `[VERIFY]`
- Emission (Kaspa "chromatic" smooth halving): ~2.20%/yr 2026 → 1.10% 2027 → 0.55% 2028 → 0.27% 2029 →
  0.14% 2030 → 0.07% 2031. ~95.8% of max supply mined by mid-2026; 28.7B cap ~2057. Undercuts BTC inflation post-2029.
- **No premine, no VC raise, no insider cash-out** (Gerhard's own words), the Bitcoin-like fair-launch point.

## G. Cross-coin concentration comparison (AI-ESTIMATE, illustrative only, V1)

> All numbers below are AI-answer estimates KatDaddy pulled live (Perplexity/Grok-style, citing Arkham,
> Binance, CryptoRank, Trust Wallet). Treat as APPROXIMATE. Do NOT state as hard fact on screen; frame
> as "roughly / by these estimates." The *contrast* is the point, not the decimals.

- **Kaspa:** no single holder > ~5.3% (Entity X); exchanges dominate the rest of the top 10. Fair launch.
- **Bitcoin:** Satoshi ~5.5% (~1.1M BTC); exchanges/ETFs a few % each. >800k wallets hold ≥1 BTC. (Kaspa ≈ this shape.)
- **XRP:** Ripple Labs escrow ~40-45% + treasury ~5-6% ≈ **~50% off the top**, insider-controlled.
- **ICP:** seed/private ~24.7% + Foundation ~23.9% + team ~18% ≈ **~40%+ team/insider**.
- KatDaddy's punchline: Entity X 5.29% vs "Satoshi" 5.5% are "eerily similar." Kaspa looks like Bitcoin, not XRP/ICP.

## H. Top-20 wallet ONE-YEAR accumulation scan (on-chain, api.kaspa.org, 2026-06-23)

Method: scraped the top 20 rich-list addresses (KasLens), then for each summed on-chain net flow
(received minus sent) over the trailing 365 days. Exchange-custody wallets EXCLUDED (flagged by known
label or >50k lifetime tx count: MEXC, Gate.io, KuCoin, Uphold, plus 2 unlabeled high-tx service wallets
incl. the Bitget-tagged `qqywx2wsz...`) because their balance is customer deposits, not accumulation.
KAS price ~$0.0289. Raw: `scratchpad/scan_top20.js` + `scan_top20_result.json`.

**HEADLINE: the 14 individual whale wallets in the top 20 (exchange-custody wallets excluded) grew by a
NET +2,415,234,323 KAS (~$69.7M) over the past year. 11 of the 14 grew (3 distributed). Several did not
exist a year ago.** `[VERIFY at render]` (Avoid the clinical word "non-exchange" in the VO; say
"individual / personal whale wallets.")

THEORY (unproven, raise as THEORY only in CH2, per Mike): some exchanges may also be accumulating for
themselves and keeping it quiet. NOT provable on-chain (custody is commingled with customer funds).

| Wallet | +KAS last yr | ~$ | Now holds | Note |
|---|---|---|---|---|
| Entity X | +661.6M | $19.1M | 1,457.6M | #1 holder |
| qzafftgv.. | +516.6M | $14.9M | 516.6M | did NOT exist 1yr ago (31 tx total) |
| qz4a8yqh.. | +449.3M | $13.0M | 449.3M | did NOT exist 1yr ago (91 tx) |
| qqfxn597.. | +431.8M | $12.5M | 507.6M | |
| qp9n6p3t.. | +215.5M | $6.2M | 215.5M | did NOT exist 1yr ago |
| qrqlynq54.. | +120.4M | $3.5M | 120.6M | THE daily six-figure buyer (CH2 specific; was 107.3M in the videos, still climbing) |
| qzew5mu9.. | +83.4M | $2.4M | 83.4M | appeared in ONE tx this year holding 83M |
| qphfy7yf.. | +5.5M | $0.16M | 308.1M | older wallet, slow add |
| qr8k05f9.. | +4.0M | $0.12M | 208.0M | |

Net distributors (sold) in top 20: qpap72xed.. -45.0M, qz06rpdaap.. -23.0M, ppwn9mz7.. -4.9M.
Caveat: trailing-365d net flow = balance change over the year (wallets younger than 1yr: whole balance
counts). The +2.4B headline is already NET of the 3 sellers.

---

## CHART-SOURCE INDEX (what to screen-capture / build later)

_Each chart used in the video gets an ID the SCREENPLAY references (→ C#). "Build mode" follows the
project chart-handling decision (see PROJECT-LOG): **code** = rebuild as an accurate animated Remotion
chart; **screencap** = capture the real dashboard for authenticity; **restyle** = screencap then ChatGPT
on-style redraw (trend/illustrative only, never when a number is the message)._

| ID | Chart / graphic | Seen in | Live capture source | Build mode |
|---|---|---|---|---|
| **C1** | Entity X two big buys (28M Gate.io + 14M Bitget, same day 2026-06-15), tx ledger | V1 @ ~00:48 | CAPTURED: `assets/captures/CH1_entityx-ledger_kaspastream.png` (kaspa.stream/address/kaspa:qpz2vgv...n4uk5a); txids 49182fbf.. (28M) + 5efe9263.. (14M) | screencap (real ledger, DONE) + code callout |
| **C2** | Wallet #17 address summary (107,300,360 KAS / $3.32M / 712 tx) | V2 @ ~02:44 | kas.fyi → `kaspa:qrqlynq54...` address page | screencap (real ledger) |
| **C3** | The daily-buyer wallet cadence (six-figure buys most days; 358 buys across 84 of the last 90 days) | on-chain | api.kaspa.org wallet qrqlynq..850jvl | **code** DONE: `assets/charts/CH2_C3_daily-buy-cadence.png` (+ .html) |
| **C4** | Rich-list concentration cards (top10 24.3% / top100 40.2% / top1000 58.8%) | V1/V2 @ ~03:00 | kas.fyi rich list **and** kaspalytics.com/app/supply/distribution-table/KAS | **code** (numbers are the message) |
| **C5** | % of circulating supply held by **top 0.01%** of meaningful addresses (24.4% Aug-2023 → 38.4% now), the hero chart | V3 @ ~02:32 | EXTRACTED from `kaspalytics.com/app/address/percentile?dtype=cs-percent&percentile=0.01` (1029 daily pts, c5_series.json) | **code** DONE: `assets/charts/CH3_C5_top001-supply-share.png` (+ .html) |
| **C6** | Supply in Profit / Loss (13.53% / 86.47%) | V3 @ ~02:13 | https://www.kaspalytics.com/app/supply/profit-loss | **code** (recreate clean) + screencap ref |
| **C7** | Unique Active Addresses (~6-7k/day) | V3 @ ~01:37 | Kaspalytics → Transactions → Active Addresses (route TBC on capture) | screencap or code |
| **C8** | Total Fees Paid (in KAS) | V3 @ ~01:50 | https://www.kaspalytics.com/app/transactions/accepted/fees/total | screencap |
| ~~C9~~ | ~~Cross-coin concentration comparison (Kaspa vs BTC vs XRP vs ICP)~~ | n/a | n/a | **DROPPED 2026-06-23**, Mike: no coin comparisons, Kaspa stands alone |
| **C10** | Emission / "chromatic halving" inflation schedule (2.20%→0.07%) | V3 @ ~05:00 | wiki.kaspa.org + kaspalytics circulating supply | **code** (bar chart) |
| **C11** | Market-cap context (<$1B now vs ~$5B prior top) | V3 @ ~06:18 | TradingView / CoinGecko | screencap or code |
| **C12** | Exchange holdings: total KAS on exchanges, VERIFIED collapsing ~4.5B (late 2025) → ~2.0B (Jun 2026), still falling | new | CAPTURED `assets/captures/CH5_exchange-holdings_kaspalytics.png` (kaspalytics.com/app/supply/exchange-holdings) | screencap DONE (data not SSR-embedded; on-brand code rebuild optional) |
| **C13** | Top-20 whale 1-year accumulation bar chart (per-whale +KAS; headline net +2.4B KAS / ~$70M) | new (on-chain scan 2026-06-23) | `scratchpad/scan_top20_result.json` (DATA.md H) | **code** DONE: `assets/charts/CH2_C13_whale-accumulation-1yr.png` (+ .html) |

### Kaspalytics chart routes (confirmed)
- Supply in Profit/Loss: `/app/supply/profit-loss`
- Distribution Table (KAS): `/app/supply/distribution-table/KAS`
- Exchange Holdings: `/app/supply/exchange-holdings`
- HODL Waves: `/app/supply/hodl-waves`
- Circulating Supply: `/app/utxo/circulating-supply`
- Realized Price: `/app/supply/realized-price`
- URPD: `/app/supply/urpd` · Puell Multiple: `/app/supply/puell-multiple` · Inactive Supply: `/app/supply/inactive`
- Daily Total Fees: `/app/transactions/accepted/fees/total` · Largest Fees: `/app/lists/largest-fees`
- Meaningful-balance Address Count: `/app/address/count/meaningful-balance`
- Addresses holding 100K+ KAS: `/app/distribution/kas-threshold/100k+`
- (Top-0.01% concentration chart route not yet captured, confirm on-screen when we screen-capture C5.)

### Other sources
- **kas.fyi**: rich list + per-address tx history + address summary (C1-C4).
- KatDaddy V1 description links: Yonatan ("Yonny") Sompolinsky tweet (x.com/hashdag) + Medium article;
  CoinGlass cycle-top indicators. (Sompolinsky-as-Entity-X is pure speculation, do NOT assert.)
