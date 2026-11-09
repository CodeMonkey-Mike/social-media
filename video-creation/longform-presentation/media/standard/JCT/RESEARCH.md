# RESEARCH: Janction (JCT): the Jasmy-incubated "AI Layer 2" / GPU marketplace token

Compiled 2026-11-08 (UTC ~15:50). Every source below was read on **2026-11-08**. Each fact cites a source key `[Sxx]`; the key list (URL + read date) is at the bottom.
Rules: "single-source" = only one non-primary source found. "NOT FOUND" = searched, nothing reliable. Where sources disagree, both are given. "project claim" = only Janction / Jasmy Lab / Jasmy says it.
"my calc" = arithmetic I did on cited numbers (method shown). "on-chain (verified)" = I read it myself from Ethereum / BSC via a public API or RPC.
All times UTC. **This is a live-drift story:** JCT went up about 5x intraday TODAY (8 Nov 2026) to a new all-time high, two days before its first post-cliff vesting unlock (10 Nov). Every price number below is a snapshot. Re-pull it before recording.

---

## 1. MARKET SNAPSHOT (2026-11-08, ~15:40 UTC)

### 1.1 Headline numbers
| Item | CoinMarketCap (fetched 15:39-15:41 UTC) [S01] | CoinGecko (last_updated 15:39:53 UTC) [S02] |
|---|---|---|
| Price | $0.009580 | $0.0095517 |
| 24h change | +232.84% | +228.76% |
| 24h volume | $190.25M (+633.2%) | $194.53M |
| Market cap | $99.06M | $109.78M |
| FDV | $479M | $477.58M |
| Rank | #260 | #253 |
| Circulating supply | 10,339,972,459 JCT (20.68% of max) | 11,493,687,500 JCT (22.99%) |
| Total / max supply | 49.99B / 50B | 50B / 50B |
| Vol / market cap | 191.16% | (my calc: 177%) |
| Liquidity / market cap | 1.57% (= ~$1.6M, my calc) | n/a |
| 24h range | $0.002541 to $0.01411 | $0.0025343 to $0.01403244 |
| Holders | 17.33K | n/a |
- Cross-check, Binplorer price feed (15:47 UTC): $0.0091827, +225.47% 24h, +90.15% 7d, mcap $105.5M, 24h volume $187.1M. [S08]
- Third read, CoinGecko markets endpoint 15:47:55 UTC: $0.00937417, mcap $107.50M, FDV $467.63M, volume $190.81M, 7d +112.0%. [S04]
- Why the circulating supplies differ (my reconciliation, not stated by CMC): CG's 11.49B = 50B minus the 38.51B still sitting in the five vesting wallets. CMC's ~10.34B is ~1.14B lower, which matches the ~1.14B of the Ecosystem basket's TGE release that has NOT yet left the Ecosystem wallet (see 3.3). [S07] [S10]

### 1.2 All-time high / low
| Item | CoinMarketCap [S01] | CoinGecko [S02] |
|---|---|---|
| ATH | $0.01411, 8 Nov 2026 | $0.01403244, 8 Nov 2026 12:43 UTC |
| From ATH now | -31.92% | -31.93% |
| ATL | $0.001064, 6 Feb 2026 | $0.00105948, 5 Feb 2026 16:25 UTC |
| From ATL now | +802.87% | +801.55% |
- Previous ATH (before today): ~$0.0106 (Startup Fortune, "set in November 2025") [S12]; $0.01058 (KuCoin blog) [S37]; $0.01057934 (InteractiveCrypto) [S13]. That was the listing-week top.
- Arc (my calc on CG numbers): launch-week top ~$0.0106 -> Feb 2026 low $0.00106 = about -90%; Feb low -> today's high $0.01403 = about 13.2x. [S02] [S12]

### 1.3 Period changes
| Window | Change | Source |
|---|---|---|
| 24h | +228.8% (CG) / +232.8% (CMC) / +369.0% (TokenPost, snapshot 12:43 UTC, near the top) | [S02] [S01] [S16] |
| 7d | +88.56% (CG, 15:39) / +112.0% (CG markets, 15:47) / +90.15% (Binplorer) | [S02] [S04] [S08] |
| 14d | +38.63% | [S02] |
| 30d | +271.96% | [S02] |
| 60d | +447.96% | [S02] |
| 90d | +172% (my calc: CG daily price 11 Aug 2026 $0.003543 -> $0.009641) | [S02] |
| 200d | +281.37% | [S02] |
| 1y | CG field null (token < 1 year old). My calc from first CG daily point (10 Nov 2025 $0.004123): +134% | [S02] |
| CMC 7d/30d/90d/1y | NOT shown on the CMC page | [S01] |

### 1.4 Today's move, hour by hour (CoinGecko hourly price) [S02]
- 8 Nov 04:00 $0.00268 -> 08:00 $0.00317 -> 10:00 $0.00469 -> 11:00 $0.00698 -> 12:00 $0.00965 -> 13:00 $0.01305 -> 15:40 $0.00963.
- CMC AI at 02:21 UTC the same morning: "down 19.08% to $0.00264 in 24h", "down 44% over 7 days", "no positive catalyst". [S18]
- **Cause of today's pump: NOT FOUND.** No official Janction / exchange announcement found for 7-8 Nov. TokenPost (12:43 UTC) reports it ranked #1 global trending, gives no reason. [S16]

### 1.5 Derivatives (CoinGecko derivatives feed, ~15:42 UTC) [S03]
- Binance Futures JCTUSDT: 24h volume **$1.03B**, open interest $44.6M, funding rate field 0.257 (CG field; Binance settles JCT funding every 4 h, cap +/-2% per Coinfomania [S20]).
- Bybit: OI $15.4M, volume $212.7M. KuCoin Futures: OI $26.6M. Bitget: OI $12.0M. Gate: volume $93.3M.
- So Binance perp volume alone is ~5.4x total spot volume (my calc, $1.03B vs $190M).
- OrangeX ($219.6M OI) and Toobit ($164.5M OI) report OI far above the major venues; summing all venues gives $564M, which is NOT credible (see do-not-air).
- History: OI peaked ~$40M in June 2026, ~$10-15M Sep to early Oct, ~$78.4M on 29 Oct (CoinEdition, Coinglass data). [S15]

### 1.6 Where it trades (CoinGecko tickers, 15:39 UTC) [S02]
- Top spot venues by 24h volume: KuCoin $66.4M, PancakeSwap Infinity CLMM (BSC) $63.8M, Bitget $39.4M, Uniswap V3 (BSC) $6.8M, MEXC $5.3M, LBank $4.6M, BYDFi $3.0M.
- CoinGecko flags several tickers as anomalous (incl. the PancakeSwap BSC pair, XT.COM, several Uniswap V4 pairs) and DigiFinex as stale (last trade 4 Nov). [S02]
- NOT on Binance spot (Binance Alpha + Binance Futures only). Coinbase pages say "not tradable on Coinbase" (search snippet). No Upbit / Bithumb listing found. [S20] [S24]

---

## 2. WHAT JANCTION IS

### 2.1 One-line
- Project claim: "the first Layer2 to provide verifiable, synergic and scalable AI service." [S01] [S06]
- CoinGecko description: "a resource sharing platform on the open web, serving your AI products"; rent and lease computing power, storage and images. [S02]
- In practice: a GPU marketplace / GPU-pooling network (DePIN) for AI and 3D rendering, incubated by Jasmy (the Japanese IoT/data company, ex-Sony founders), run by Tokyo company JasmyLab Inc. [S11] [S13] [S30] [S33]
- Phemex notes the docs say "the AI collaborative Layer2 system" while the X bio says "a rendering-focused L1 chain": self-description is inconsistent. [S11]

### 2.2 Architecture (all project claim, from the docs) [S06]
- Three parts: Blockchain Layer (settlement + data availability), Distributed pooling of resources, GPU Marketplace.
- "Janction layer2 is mainly responsible for verifying the transaction process in the system."
- GPUs split into equal vGPUs, containerized, joined into a pool over VxLAN; a scheduler allocates to renters; rentals priced by a "PVCG" (VCG-auction-style) mechanism.
- Consensus: "Proof of Contribution"; GPU side uses Proof of Resource (PoR, the capacity supplied) + Proof of Task (PoT, the AI work done), checked by validators "through cross-validation"; a reputation score gives priority to good miners. Slashing / validator selection: NOT FOUND in docs.
- Data labeling / data feeding is part of the pitch (browser extension that crawls and signs user browsing data). [S06]
- iq.wiki adds: Kademlia + Kubernetes for node/container management, "proof of workload". [S28]
- **L2 stack: conflicting.** OP Stack (iq.wiki, citing the Feb 2025 JasmyLab testnet announcement) [S28]; "Optimistic Rollup on top of Ethereum" (bsc.news, Mar 2025) [S30]; "EVM-compatible Layer-2 ... built using Arbitrum technology" (secondary, search snippet) [S38]; the docs' block-explorer section has IBC, CosmWasm and State Sync pages, which are Cosmos-SDK features [S06]. Settlement chain is not named in the docs. [S06]
- Product maturity (docs FAQ, project's own words): "mainly PoC and is about to enter the MVP stage." [S06]
- Testnet: public testnet launched 14 Feb 2025 with the seed-round announcement. [S27] [S30]
- Mainnet: Jasmy's FY2025 roadmap put "JANCTION mainnet" in Q2 2025 (secondary); a Gate.com piece said Q1 2026 (via iq.wiki). **Mainnet live: NOT FOUND / not confirmed.** [S28] [S38]
- Startup Fortune (25 Oct 2026): the marketplace "isn't live yet", the project has "shipped little beyond a testnet". [S12]

### 2.3 Products that actually exist
- **JANCTION GPU POOL**: launched 25 Mar 2025 as a "decentralized GPU cloud service" (JasmyLab announcement via iq.wiki). [S28]
- **JANCTION Render** (LIVE): a cloud GPU render farm for Blender that AI agents call via MCP server / HTTP API / CLI. Version 0.4.257 released 6 Nov 2026. GPU: NVIDIA RTX PRO 6000 Blackwell (96 GB) in a JANCTION datacenter in Tokyo. "No uptime guarantee." Price **0.1 JPY per GPU-second** (= 360 JPY per GPU-hour, my calc); plans 2,980 JPY and 9,800 JPY a month. [S33]
  - Paid in JPY by card through Stripe; **JCT is not mentioned anywhere** on the product page or repo. [S33] [S34]
  - GitHub repo: 3 stars, 0 forks, 243 commits. [S34]
- **Smart Render by JANCTION** (status conflicting): announced 31 Aug 2026 by Jasmy Lab + Jasmy + Panasonic Advanced Technology. Benchmark: 4K / 1024-sample / 30-frame Blender animation across 12 nodes in ~15 min vs ~4 h 10 min on one GPU = 16.7x faster, 94% less time ("internal benchmark", project claim). Targets Japanese production companies, schools, research institutes; free trials first; KYB-verified GPUs in domestic data centers first. [S31] [S32]
  - Billing in yen prepaid credits, JCT not required (Phemex / CMC, via InteractiveCrypto). [S13] [S11]
  - "Launched mid-September 2026" (InteractiveCrypto) vs "it is in development" (Jasmy Lab's own fact sheet, read today). [S13] [S33]
- GPU rental price at launch: NVIDIA H100 SXM 80 GB at 330 JPY/hour incl. tax (iq.wiki) vs "330 JPY/hour for a standard RTX 4090-class GPU" (Phemex). Conflict. [S28] [S11]

### 2.4 Chains + contracts (verified)
| Chain | Contract | Supply on that chain now | Source |
|---|---|---|---|
| Ethereum (ERC-20) | 0xC477B6dfd26EC2460b3b92de18837Fd476Ea7549 | 39,685,086,848 JCT; 856 holders | [S05] [S07] on-chain |
| BNB Smart Chain (BEP-20) | 0xeA37A8DE1de2d9D10772EEB569e28Bfa5Cb17707 | 10,314,905,388 JCT; 16,501 holders | [S05] [S08] on-chain |
- Two chains sum to exactly 50.000B (my calc on [S07] + [S08]). Planned split was 45B ETH / 5B BSC [S05]; the BSC share grew after the Ecosystem wallet sent ~4B JCT to the bridge pool on 16 May 2026 (on-chain, verified) [S07], bridging via Chainlink CCIP burn-and-mint [S10].
- BSC token contract created 27 Oct 2025 10:43 UTC (on-chain). [S08]
- Token contract owner (Ethereum) = Safe 0x65f8e5583166ff101d9a84265a1103f45c1ca0a6, a 5-of-7 multisig (on-chain eth_call, verified). [S09]
- Holders: ETH 856 + BSC 16,501 = 17,357 (my calc), matches CMC's 17.33K. [S07] [S08] [S01]

---

## 3. TOKEN

### 3.1 Utility (project claim, docs) [S05] [S06]
- GPU providers stake JCT for non-transferable **veJCT** -> marketplace bidding, matching, priority allocation.
- Payments: AI users pay in stablecoins OR JCT; paying in JCT "may" unlock credits / fee cuts (set by governance; no numbers).
- Governance by veJCT holders. Contribution rewards "not guaranteed".
- No burn mechanism, fee %, or staking yield stated. [S06]
- Reality check: the live JANCTION Render product bills in JPY via Stripe, not JCT. [S34]

### 3.2 Tokenomics: official allocation (docs) [S05]
Total supply 50,000,000,000 JCT. TGE circulating 22.99%.
| Basket | Tokens | % | TGE unlock | Cliff | Vesting |
|---|---|---|---|---|---|
| Ecosystem | 17,145,625,000 | 34.29% | 30% | 1 year | 2 years linear |
| Team | 10,670,000,000 | 21.34% | not stated (0%, on-chain) | 18 months | 3 years |
| Foundation | 9,000,000,000 | 18% | not stated (0%, on-chain) | 12 months | 2 years linear |
| Investors | 5,000,000,000 | 10% | 0% | 1 year | 18 months linear |
| Airdrop | 2,850,000,000 | 5.70% | 100% | none | none |
| Liquidity | 2,000,000,000 | 4% | 100% | none | none |
| Advisors | 1,834,375,000 | 3.67% | 0% | 1 year | 2 years linear |
| Community Incentive | 1,500,000,000 | 3% | 100% | none | none |
- Conflicting third-party splits exist: CryptoRank (Foundation 18%, "Team & Shareholders" 22.5%, Treasury 18%, Community Airdrop 12.8%; next unlock "10 May 2030"); iq.wiki "initial circulation ~6.35B (12.7%)". Both contradict the docs and the chain. [S38] [S28]

### 3.3 Vesting wallets on-chain (Ethereum, read 2026-11-08 ~15:45 UTC) [S07] [S09]
| Basket | Safe wallet | Balance now | Funded | Outflows ever |
|---|---|---|---|---|
| Ecosystem | 0xa68f0255c0eeb35e3cf558d58cfbbfa8811b9b84 | 13,145.6M | 17,145.6M on 7 Nov 2025 | ~4,000M to the CCIP bridge pool on 16 May 2026 |
| Team | 0x246d024c6816efaae060235d5695a8af31e3d562 | 10,670.0M | 7 Nov 2025 | none |
| Foundation | 0x250371ff899cbac4ef5156e6a3f4982a6cf10e2e | 9,000.0M | 7 Nov 2025 | none |
| Investors | 0xe906efef04fae94d784eaf702278657ef924a050 | 5,000.0M | 7 Nov 2025 | none |
| Advisors | 0xa13918f90296072fc15409fced346c8a423ddf86 | 1,834.4M | 7 Nov 2025 | none |
- These 5 wallets = 99.91% of the Ethereum supply (top-5 holders). [S07]
- **All five + the token owner are Safe multisigs: threshold 5 of the same 7 signers** (verified on-chain, Ethereum block ~26,371,159). [S09] Phemex reached the same finding and adds: no module or guard. [S10]
- **No vesting smart contract enforces the schedule.** Release is a 5-of-7 multisig decision. [S10] [S17] (and consistent with [S09])
- Still locked: 38.51B JCT = 77.01% of supply (Phemex, mid-Oct; matches my calc: 12.0B Ecosystem remainder + 10.67B + 9B + 5B + 1.834B). [S10]

### 3.4 Unlock schedule (THE key catalyst)
- TGE / first trading: 10 Nov 2025. So the 12-month cliffs end ~10 Nov 2026, i.e. in 2 days. [S20] [S10]
- **27.84B JCT begins vesting in early November 2026** (Ecosystem remainder + Foundation + Advisors + Investors) = 2.42x the circulating supply (Phemex). This is released linearly over 18-24 months, NOT in one drop. [S10] [S13]
- First release: **~1.18B JCT on 10 Nov 2026** (Startup Fortune / Phemex), = ~2.4% of total supply, ~10.7% of circulating supply (Messari via bsc.news). [S12] [S14] [S17]
- Bitcoin Sistemi weekly calendar: JCT unlock Tue 10 Nov, 03:00 UTC+3 (= 00:00 UTC), "~$5.43M" (priced before today's pump). [S19]
- My calc from the docs' schedule: Ecosystem 12.0B/24 = 500M + Foundation 9B/24 = 375M + Advisors 1.834B/24 = 76M + Investors 5B/18 = 278M = **~1.23B JCT per month**; at $0.0095 that is ~$11.7M a month. Phemex: "about 1.2 billion JCT" a month. [S05] [S10]
- **Team cliff: early May 2027**, then ~296M JCT a month (my calc 10.67B/36 = 296.4M, matches Phemex). Last tranche early May 2030. [S10]
- What exactly moves on 10 Nov is at the multisig's discretion (no vesting contract). [S10]

### 3.5 Listing history
| Date (UTC) | Event | Source |
|---|---|---|
| 8 Nov 2025 | Binance announces JCT on Binance Alpha + Binance Futures ("first exchange" for both) | [S20] [S21] |
| 10 Nov 2025 07:00 | KuCoin spot "World Premiere" (search snippet; KuCoin page geo-blocked; times differ between snippets) | [S24] |
| 10 Nov 2025 10:00 | Binance Alpha trading opens | [S20] [S21] |
| 10 Nov 2025 10:10 | MEXC JCT USDT-M futures | [S22] |
| 10 Nov 2025 10:30 | Binance Futures JCTUSDT perp, up to 40x | [S20] [S21] |
| 10 Nov 2025 | Bitget lists JCT in its Innovation Zone; 11 Nov "Bitget x JCT Carnival" 40,443,000 JCT prize pool | [S23] |
| 20 Nov 2025 04:00 | OKX JCT USDT perp, up to 20x (search snippet) | [S24] |
| early Aug 2026 | **Phemex DELISTS its JCTUSDT perpetual** (no spot pair) | [S11] |
| now | Futures on Binance, Bybit, KuCoin, Bitget, Gate, BingX, MEXC and ~15 smaller venues | [S03] |

### 3.6 Airdrops
- Binance Alpha airdrop at listing: 16,000 JCT per claim, 235 Alpha Points threshold, deadline 17 Nov 2025 11:00 UTC (CoinGabbar quoting Binance Wallet's X). Other snippets: claims from 12 Nov, 230+ points, 15 points burned. Conflict on threshold. [S25] [S26]
- Binance Alpha Box (Feb 2026): 242+ Alpha Points -> 20,600 JCT OR 95 ICNT (search snippets). [S26]
- Official airdrop basket: 2.85B JCT (5.7%), 100% unlocked at TGE. [S05]
- Total size of the Binance Alpha airdrop: NOT FOUND.

---

## 4. TEAM, BACKERS, FUNDING

- **Operator:** JasmyLab Inc. (ジャスミーラボ株式会社), Tokyo, 11F 1-2-3 Kita-Aoyama, Minato-ku; founded June 2023; corporate no. 4010401174818. [S27] [S33]
- Janction's terms name **Discovery Domain Ltd** as the company behind them. [S11]
- **Incubator:** Jasmy Corporation (Tokyo, founded 2016 by ex-Sony executives). Janction is described as Jasmy's first major incubated project. [S30] [S13]
- **CEO: Hiroshi Harada**, who is also **CFO of Jasmy** (bsc.news Mar 2025; JANCTION's own 2024 Medium post lists Harada as JasmyLab CEO). Ex-KPMG CPA (11 years) per a Dec 2021 MEXC AMA. Joined Jasmy 2018 vs 2020: sources conflict. [S30] [S29]
  - Coinfomania calls him "Hara", CFO of Jasmy Global; announced a "50 Weeks IR" campaign and cited "slower-than-expected product development". [S20]
- **Seed round, Feb 2025** (press release 14 Feb 2025, with the testnet): Cogitent Ventures, DWF Labs, MH Ventures, YBB, Waterdrip Capital, Web3Labs, individual investors. **Amount: NOT disclosed / NOT FOUND.** [S27]
  - PitchBook (snippet): seed rounds 14 Feb 2025 and 5 May 2024; investors incl. "DWF Options". [S38]
  - Investor side: NOT confirmed. No DWF Labs (or other investor) announcement naming Janction found; CoinGecko's category list for JCT does not include "DWF Labs Portfolio". [S02] [S38]
- **Partnerships**
  - Jasmy + Panasonic Advanced Technology (Smart Render, 31 Aug 2026): reported by VOIX + JANCTION X. Jasmy and Panasonic AT have worked together since Feb 2024 (VOIX). **Panasonic-side announcement: NOT FOUND** (Panasonic AT's newsroom shows only unrelated robotics items). [S31] [S32]
  - V01D (Japanese creative company), MOU May 2026: V01D advises on UI/UX for "GPX.LINK", a decentralized rendering app. JasmyLab release 11-12 May 2026 + a V01D-side release 25-26 May 2026, both seen only via a PR-republishing aggregator (search snippets); V01D's own site did not show it. Partner-side: partially confirmed. [S35]
  - C2E (Korea) strategic-partnership MOU, 2024 (JANCTION Medium, project-side only). [S38]
  - Chainlink CCIP used for ETH<->BSC bridging (Phemex on-chain read; secondary). [S10] [S38]
  - A "PlayStation" tie-up was discussed in community posts; iq.wiki says it was NOT an established partnership. [S28]

---

## 5. TRACTION

| Metric | Value | Source |
|---|---|---|
| GPUs / nodes on network | NOT FOUND (no public dashboard found) | - |
| Revenue / compute sold | NOT FOUND | - |
| TVL | NOT FOUND / n.a. | - |
| Node-license sales | "exceeding 600 million yen in the first four months" of the managed-node (NFT licence) model (Gate.com via iq.wiki; single-source, secondary) | [S28] |
| Node sales start | limited sales late Dec 2024; general sales 14 Feb 2025 | [S30] |
| Live product | JANCTION Render (Tokyo DC, one GPU model listed, JPY billing) | [S33] |
| Code activity | janction-render 243 commits, 3 stars; janction-node (core, C) last updated 7 Jul 2024; docs 8 May 2026; repos show no forks/stars/issues | [S34] [S17] |
| Holders | 17.33K total (BSC 16,501 + ETH 856) | [S01] [S07] [S08] |
| BSC transfers | 11,083,566 token transfers across 266,175 txs (Binplorer) | [S08] |

### 5.1 Holder concentration
- **Ethereum:** top 5 = 99.91% of ETH supply, all five are the project's vesting Safes. [S07]
- **BSC (where nearly all the float lives):** top 10 = **77.58% of BSC supply** (~8.0B JCT); top 1 = 17.58% (1.81B), #2 16.08%, #3 12.11%, #4 12.00%. Three wallets hold exactly 250M each. [S08]
- As a share of CG circulating supply, the BSC top 10 = ~70% (my calc 8.0B / 11.49B). [S08] [S02]
- **Who those wallets are (exchange hot wallets? LP pools? market makers?): NOT FOUND.** BscScan blocked automated reads. Do not label them on a slide.

---

## 6. RECENT NEWS + CATALYSTS (last ~6 months)

| Date | Item | Source |
|---|---|---|
| 11-26 May 2026 | V01D MOU (GPX.LINK) | [S35] |
| 16 May 2026 | Ecosystem Safe moves ~4B JCT to the bridge pool (Ethereum -> BSC) | [S07] on-chain |
| Jun 2026 | Futures OI peaks ~$40M | [S15] |
| early Aug 2026 | Phemex delists JCTUSDT perp | [S11] |
| 31 Aug 2026 | Smart Render announced (Jasmy Lab + Jasmy + Panasonic AT) | [S31] [S32] |
| mid-Sep 2026 | Smart Render "launched" (InteractiveCrypto) vs "in development" (Jasmy Lab fact sheet) | [S13] [S33] |
| 25 Oct 2026 | +129% in a day to ~$0.006, "no product launch, no partnership announcement" | [S12] [S13] |
| 27 Oct 2026 | +~290% in 30 days, +100% in a week | [S14] |
| 29 Oct 2026 | OI ~$78.4M, mcap ~$82.9M | [S15] |
| 6 Nov 2026 | JANCTION Render v0.4.257 | [S33] |
| 7 Nov 2026 | -20.29% on 6 Nov; equity sell-off, $1.26B crypto liquidations | [S18] |
| 8 Nov 2026 02:21 | $0.00264, -44% in 7 days | [S18] |
| **8 Nov 2026** | **New ATH $0.01403 at 12:43 UTC; #1 global trending; cause NOT FOUND** | [S02] [S16] |
| **10 Nov 2026 ~00:00** | **First post-cliff unlock, ~1.18-1.23B JCT** | [S12] [S19] |
| early May 2027 | Team cliff ends, ~296M JCT a month for 3 years | [S10] |
| early May 2030 | Final tranche | [S10] |
- Roadmap: the docs' roadmap page is only an embedded Figma board ("Transparency and feedback milestone"); no dated items readable. CMC AI's summary: 2026-27 grow GPU marketplace + creator tools; 2027-30 long-term build-out (no dates/figures). [S06] [S17]
- CMC AI's feed lists "5 Nov 2026: approval for listing on Binance Alpha and Futures, trading 10 Nov 2026". That is the Nov **2025** event misdated (see do-not-air). [S17]

---

## 7. COMPETITORS / COMPARABLES (CoinGecko, 2026-11-08 15:47:55 UTC) [S04]

| Token | Rank | Price | Market cap | FDV | 24h vol | 7d | 1y |
|---|---|---|---|---|---|---|---|
| Bittensor (TAO) | 38 | $225.23 | $2,636.6M | $2,636.6M* | $41.8M | -4.3% | -39.8% |
| Render (RENDER) | 78 | $1.55 | $829.5M | $873.2M | $16.8M | -2.1% | -33.7% |
| Akash (AKT) | 171 | $0.6307 | $189.0M | $189.0M | $2.8M | +1.2% | -3.4% |
| **JASMY (parent)** | 182 | $0.003576 | $176.8M | $178.8M | $4.5M | -6.3% | -63.7% |
| Theta (THETA) | 210 | $0.1404 | $140.4M | $140.4M | $2.1M | -10.8% | -71.5% |
| **Janction (JCT)** | 256 | $0.009374 | **$107.5M** | **$467.6M** | **$190.8M** | +112.0% | n/a |
| Golem (GLM) | 264 | $0.1048 | $105.0M | $105.0M | $1.4M | -7.5% | -51.2% |
| Aethir (ATH) | 273 | $0.004813 | $96.9M | $202.2M | $5.3M | -4.6% | -81.2% |
| io.net (IO) | 433 | $0.1174 | $50.0M | $93.5M | $5.0M | -11.3% | -62.5% |
| Nosana (NOS) | 467 | $0.4496 | $45.0M | $45.0M | $0.49M | +9.8% | +25.0% |
*CG computes FDV from total supply for some coins (TAO's max supply is 21M), so peer FDVs are approximate.

Valuation vs peers (my calc on the table):
- JCT FDV $468M = **2.6x its own parent JASMY's FDV** ($179M).
- JCT FDV = 2.3x Aethir, 2.5x Akash, 5.0x io.net, 10x Nosana, ~54% of Render.
- JCT market cap ($107.5M) ~= Aethir ($96.9M) and Golem ($105M).
- JCT's 24h volume ($190.8M) is ~2.4x the COMBINED volume of all nine peers above (~$80M).
- FDV / market cap = 4.35x (only ~23% of supply circulating).
- Revenue / usage multiples for the comparison: NOT possible, no JCT network revenue found.

---

## 8. RISKS / RED FLAGS

1. **Unlock overhang starts in 2 days.** 77% of supply still locked; ~1.2B JCT a month from 10 Nov 2026 = ~10.7% of today's float every month (~$11-12M a month at today's price), stepping up again in May 2027 when the team's 10.67B starts (~296M a month). [S10] [S12] [S05]
2. **No vesting contract.** All five vesting baskets + the token owner sit behind the SAME 5-of-7 Safe signers (verified on-chain). The schedule is a promise, not code: the signers could release faster (or slower). [S09] [S10]
3. **Low float / high FDV:** 23% circulating, FDV 4.35x the market cap, FDV 2.6x the parent company's token. [S02] [S04]
4. **Thin real liquidity vs huge volume:** CMC liquidity/mcap 1.57% (~$1.6M) while 24h volume is 191% of mcap; Binance perp volume $1.03B vs $190M spot. Derivatives-led, reflexive moves (InteractiveCrypto cites short covering + liquidations). [S01] [S03] [S13]
5. **Wash-trading signals (not proof):** CoinGecko flags the biggest DEX pair (PancakeSwap BSC) and several others as anomalous; OI reported by OrangeX/Toobit is implausibly large; BSC shows 11M token transfers on 266K txs. [S02] [S03] [S08]
6. **Pumps with no news:** +129% (25 Oct), +~229% (8 Nov), and dozens of 40-100% daily swings logged Mar-May 2026, none tied to an announcement. [S12] [S23] [S16]
7. **Product vs token gap:** the docs call the tech "mainly PoC ... about to enter MVP"; core node repo untouched since Jul 2024; the one live product (JANCTION Render) bills in yen by card and never touches JCT; Smart Render also yen-billed and "in development". [S06] [S17] [S33] [S34]
8. **Mainnet not confirmed;** L2 tech stack described three different ways. [S28] [S30] [S06]
9. **Concentration:** BSC top-10 wallets hold ~78% of BSC supply / ~70% of float; identities unknown. [S08]
10. **Delisting:** Phemex removed its JCT perp (Aug 2026). Not on Binance spot, Coinbase, Upbit or Bithumb. [S11] [S24]
11. **Jasmy entanglement:** CEO is simultaneously Jasmy's CFO; CMC's "Telegram" link for JCT points to t.me/jasmyofficial; JASMY itself is -63.7% over a year. [S30] [S01] [S04]
12. **Opaque funding:** seed amount never disclosed; investors confirmed only by the project's own release. [S27]
13. Social-media pump-and-dump warnings exist (opinion, not a finding); no regulator action, monitoring tag or exchange investigation found. [S17]

---

## 9. DO-NOT-AIR (or air only with the caveat shown)

- **"28 billion tokens unlock next week."** WRONG framing. 27.84B *begins vesting*, paid out over 18-24 months. Say "~1.2B a month starting 10 Nov". [S10]
- **Exact size of the 10 Nov unlock:** 1.18B (Startup Fortune/Phemex) vs 1.23B (my calc from the docs). Say "about 1.2 billion". [S12] [S05]
- **Why JCT pumped today:** NOT FOUND. Do not give a reason as fact.
- **24h % today:** 229% (CG) vs 233% (CMC) vs 369% (TokenPost, measured near the top). Use one, name the source + time. [S02] [S01] [S16]
- **Circulating supply / market cap:** 10.34B / $99M (CMC) vs 11.49B / $110M (CG). Pick one source. [S01] [S02]
- **Total open interest "$564M":** inflated by OrangeX/Toobit; Binance $44.6M is the reliable figure. [S03]
- **"600 million yen in node sales":** single-source, secondary (Gate.com via iq.wiki), no primary disclosure. [S28]
- **Seed round amount / valuation:** NOT FOUND. Investor list = project claim only.
- **"First Layer 2 for verifiable AI":** project claim.
- **16.7x faster / 94% less render time:** project's internal benchmark. Air only as "they claim".
- **Smart Render "launched":** conflicts with Jasmy Lab's own "in development". [S13] [S33]
- **Tech stack (OP Stack / Arbitrum / Cosmos):** conflicting; don't name one. Mainnet "live": NOT confirmed.
- **GPU rental price 330 JPY/h:** H100 (iq.wiki) vs RTX 4090-class (Phemex). [S28] [S11]
- **Who holds the big BSC wallets:** unlabeled; don't call them exchanges or insiders.
- **CMC AI's "Binance listing approved 5 Nov 2026":** misdated (it was Nov 2025). [S17]
- **Airdrop Alpha Points threshold:** 230 vs 235. [S25] [S26]
- **Panasonic as a "partner":** the deal is reported by Jasmy Lab / Jasmy-side outlets; no Panasonic-side release found. Say "announced with Panasonic Advanced Technology". [S31]
- **CryptoRank / iq.wiki allocation splits:** contradict the docs + chain; use the docs table. [S05]
- **CEO name "Hara":** use "Hiroshi Harada" (two sources) and note he is Jasmy's CFO. [S30] [S20]
- **KuCoin listing time:** 07:00 vs 10:00 UTC in different snippets.

---

## TOP 20 FACTS FOR THE DECK
1. JCT ~$0.0096, mcap ~$99-110M, FDV ~$478M, rank ~#253-260 (8 Nov 2026, 15:40 UTC). [S01] [S02]
2. Up ~229-233% in 24h; new all-time high $0.01403 at 12:43 UTC today. [S02] [S01]
3. It was $0.00264 at 02:21 UTC this morning: ~5x intraday. [S18] [S02]
4. 30 days: +272%. 60 days: +448%. [S02]
5. Before this run it fell ~90% from its launch-week top (~$0.0106) to $0.00106 (Feb 2026). [S12] [S02]
6. Spot volume $190M = ~1.9x its market cap; Binance perps did $1.03B in 24h. [S01] [S03]
7. What it is: a Jasmy-incubated GPU marketplace / "AI Layer 2", run by JasmyLab Inc., Tokyo. [S11] [S27]
8. CEO Hiroshi Harada is also Jasmy's CFO. [S30]
9. Docs: tech is "mainly PoC ... about to enter MVP". [S06]
10. The live product (JANCTION Render) charges 0.1 yen per GPU-second, by card: no JCT involved. [S33] [S34]
11. Smart Render with Panasonic Advanced Technology: 16.7x faster claim, internal benchmark, yen billing. [S31] [S13]
12. 50B max supply; only ~23% circulating. [S05] [S02]
13. 77% of supply sits in five multisig wallets controlled by the same 7 signers (5 needed). [S09] [S10]
14. No vesting contract: the schedule is enforced by those signers, not code. [S10]
15. Cliffs end ~10 Nov 2026: ~1.2B JCT a month (~10.7% of float) starts flowing. [S12] [S10]
16. Team's 10.67B unlocks from May 2027, ~296M a month, until May 2030. [S10]
17. JCT's FDV is 2.6x its own parent's (JASMY) and 2.3x Aethir's; ~54% of Render's. [S04]
18. JCT's daily volume is ~2.4x the combined volume of nine bigger/older AI-compute peers. [S04]
19. Listed 10 Nov 2025 on Binance Alpha + Futures (40x), KuCoin, Bitget, MEXC; OKX perp 20 Nov 2025; Phemex delisted its perp Aug 2026. [S20] [S22] [S23] [S24] [S11]
20. Seed backers listed by the project: DWF Labs, Cogitent, MH Ventures, YBB, Waterdrip, Web3Labs; amount never disclosed. [S27]

## CONFLICTS / UNCERTAIN
- Circulating supply 10.34B (CMC) vs 11.49B (CG): explained by ~1.14B Ecosystem TGE tokens still in the Ecosystem wallet (my reconciliation). [S01] [S02] [S07]
- 24h change 228.8% / 232.8% / 369.0% (different windows). [S02] [S01] [S16]
- 7d change 88.6% (CG coin endpoint) vs 112.0% (CG markets endpoint 8 min later) vs 90.2% (Binplorer). [S02] [S04] [S08]
- 10 Nov unlock 1.18B vs ~1.23B; "% of market cap" 10.2% vs "% of circulating" 10.7%. [S12] [S14]
- Phemex's own numbers don't sum cleanly (baskets sum 39.65B vs "38.51B locked"); the 38.51B figure matches the chain once the Ecosystem's unsent TGE share is excluded. [S10] [S07]
- L2 stack: OP Stack vs Optimistic Rollup vs Arbitrum vs Cosmos-style explorer; L2 vs "rendering-focused L1" (X bio). [S28] [S30] [S06] [S11]
- Mainnet date: Q2 2025 (Jasmy roadmap) vs Q1 2026 (Gate); live status unconfirmed. [S28] [S38]
- Smart Render launched (mid-Sep 2026) vs in development. [S13] [S33]
- Harada joined Jasmy 2018 vs 2020. [S29]
- Seed rounds: Feb 2025 (project) vs also May 2024 (PitchBook). [S27] [S38]
- Initial circulating: 22.99% (docs) vs 12.7% / ~6.35B (iq.wiki). [S05] [S28]
- Airdrop threshold 230 vs 235 Alpha Points. [S25] [S26]
- KuCoin listing 07:00 vs 10:00 UTC. [S24]

---

## SOURCE KEY (all read 2026-11-08)
- [S01] CoinMarketCap, Janction (JCT) page (fetched 15:39-15:41 UTC): https://coinmarketcap.com/currencies/janction/
- [S02] CoinGecko API, coin + market_chart (365d daily, 3d hourly) + tickers (last_updated 15:39:53 UTC): https://api.coingecko.com/api/v3/coins/janction ; https://api.coingecko.com/api/v3/coins/janction/market_chart?vs_currency=usd&days=365 ; web page https://www.coingecko.com/en/coins/janction
- [S03] CoinGecko API, derivatives tickers (~15:42 UTC): https://api.coingecko.com/api/v3/derivatives
- [S04] CoinGecko API, markets for JCT + peers (15:47:55 UTC): https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=render-token,akash-network,io-net,aethir,nosana,bittensor,golem,jasmycoin,janction,theta-token,io
- [S05] Janction docs, Tokenomics: https://docs.janction.ai/token/tokenomics
- [S06] Janction docs (Welcome, Architecture, Token Utility, Proof of Resource & Proof of Task, FAQ "current progress", Roadmap, index): https://docs.janction.ai ; https://docs.janction.ai/architecture.md ; https://docs.janction.ai/token/token-utility.md ; https://docs.janction.ai/gpu-marketplace/proof-of-resource-and-proof-of-task.md ; https://docs.janction.ai/help-faq/faq/what-is-the-current-progress-of-janctions-product-technology.md ; https://docs.janction.ai/roadmap.md ; https://docs.janction.ai/llms.txt
- [S07] Ethplorer API, ETH token info, top holders, vesting-wallet histories (~15:45 UTC): https://api.ethplorer.io/getTokenInfo/0xc477b6dfd26ec2460b3b92de18837fd476ea7549 ; https://api.ethplorer.io/getTopTokenHolders/0xc477b6dfd26ec2460b3b92de18837fd476ea7549 ; https://api.ethplorer.io/getAddressHistory/<wallet> ; explorer https://etherscan.io/token/0xc477b6dfd26ec2460b3b92de18837fd476ea7549
- [S08] Binplorer API, BSC token info + top holders (~15:47 UTC): https://api.binplorer.com/getTokenInfo/0xea37a8de1de2d9d10772eeb569e28bfa5cb17707 ; https://api.binplorer.com/getTopTokenHolders/0xea37a8de1de2d9d10772eeb569e28bfa5cb17707 ; explorer https://bscscan.com/token/0xea37a8de1de2d9d10772eeb569e28bfa5cb17707 (403 to automated reads)
- [S09] Ethereum on-chain eth_call (Safe getThreshold / getOwners; token owner()) via public RPC, block ~26,371,159: https://ethereum-rpc.publicnode.com
- [S10] Phemex, "Janction (JCT) Price Prediction 2026-2030: Unlock Schedule" (updated 22 Oct 2026): https://phemex.com/blogs/janction-jct-price-prediction-2026-2030-unlock-schedule
- [S11] Phemex Academy, "What Is Janction (JCT)? The Jasmy-Incubated GPU Network" (updated 22 Oct 2026): https://phemex.com/academy/what-is-junction-jct
- [S12] Startup Fortune, "Janction token JCT doubles in a day with no news behind the surge" (25 Oct 2026): https://startupfortune.com/janction-token-jct-doubles-in-a-day-with-no-news-behind-the-surge/
- [S13] InteractiveCrypto, "Janction (JCT) Rally Built on AI Hype Confronts Billions in Looming Token Unlocks" (25 Oct 2026): https://www.interactivecrypto.com/janction-jct-rally-built-on-ai-hype-confronts-billions-in-looming-token-unlocks
- [S14] bsc.news via cryptonews.net, "Jasmy-Backed Janction Is Suddenly the Hottest AI Token in Crypto" (27 Oct 2026): https://cryptonews.net/news/altcoins/33658709/
- [S15] CoinEdition via cryptonews.net, "JCT Gains Nearly 80% Weekly as Derivatives Activity Accelerates" (29 Oct 2026): https://cryptonews.net/news/analytics/33668832/
- [S16] TokenPost, "[Trending now] JCT leads globally as KOMA tops Korea" (8 Nov 2026, 7:43 AM EST): https://www.tokenpost.com/news/investing/51598
- [S17] CoinMarketCap AI, Janction latest updates (page stamp 7 Nov 2026 17:56 UTC): https://coinmarketcap.com/cmc-ai/janction/latest-updates/
- [S18] CoinMarketCap AI, Janction price analysis (page stamp 8 Nov 2026 02:21 UTC): https://coinmarketcap.com/cmc-ai/janction/price-analysis/
- [S19] Bitcoin Sistemi, weekly token-unlock schedule (8 Nov 2026): https://en.bitcoinsistemi.com/watch-out-there-are-numerous-economic-developments-and-altcoin-events-this-week-here-s-the-day-by-da-6
- [S20] Coinfomania, "Binance Adds Janction's JCT Token, Linked to Jasmy Ecosystem" (8 Nov 2025): https://coinfomania.com/binance-adds-janctions-jct-token-linked-to-jasmy-ecosystem/
- [S21] CoinCarp event, "Janction new listing on Binance Alpha and Binance Futures" (summarizes the Binance notice; search snippet): https://www.coincarp.com/nl/events/janction-new-listing-on-binance-alpha-and-binance-futures/
- [S22] MEXC, "[Initial Futures Listing] Janction (JCT) USDT-M Futures to List on Nov 10, 2025, 10:10 (UTC)" (search result): https://www.mexc.com/announcements/17827791531574
- [S23] Bitget, Janction news page (listing 10 Nov 2025, carnival 11 Nov 2025, Bitget Pulse volatility notes): https://www.bitget.com/price/janction/news
- [S24] KuCoin listing announcement (geo-blocked; search snippet): https://www.kucoin.com/announcement/en-janction-jct-gets-listed-on-kucoin-world-premiere ; OKX perp (search snippet; mirror returned 429): https://okx-api.aperture.finance/help/okx-to-list-perpetual-futures-for-jct-crypto ; Coinbase "not tradable" (search snippet): https://www.coinbase.com/price/janction
- [S25] CoinGabbar, Janction airdrop claim deadline (10 Nov 2025, upd 19 Aug 2026): https://www.coingabbar.com/en/crypto-currency-news/janction-price-surge-prediction-jct-airdrop-claim-deadline-2025
- [S26] Binance Alpha airdrop snippets: CoinGabbar Alpha Box https://www.coingabbar.com/en/crypto-currency-news/jct-icnt-airdrop-binance-alpha-box-rewards ; Hokanews (Feb 2026) https://www.hokanews.com/2026/02/binance-drops-alpha-box-bomb-jct-icnt.html ; MEXC news https://www.mexc.com/news/754480 (search snippets)
- [S27] STARTUP LOG, "Jasmy Lab Inc., developer of 'JANCTION Layer2', completes seed round funding" (17 Feb 2025; press release 14 Feb 2025): https://startuplog.com/n/nabcfe6d61d4a?hl=en&gs=bcb12fcfc049b0b3a864f004296568b8 ; project Medium (403): https://medium.com/janction
- [S28] IQ.wiki, Janction: https://iq.wiki/wiki/janction
- [S29] IQ.wiki, Hiroshi Harada: https://iq.wiki/wiki/hiroshi-harada.md ; MEXC AMA with Mr. Harada (Dec 2021, search snippet): https://medium.com/mexcglobal/mexc-ama-session-with-mr-harada-from-jasmy-4427807f562a
- [S30] bsc.news via cryptonews.net, Jasmy / JANCTION overview (6 Mar 2025): https://cryptonews.net/news/altcoins/30628538/
- [S31] VOIX, Jasmy Lab + Panasonic "Smart Render" (31 Aug 2026): https://voix.jp/?p=123275
- [S32] JANCTION Global on X, "Introducing #SmartRender by JANCTION" (31 Aug 2026; search snippet, X not fetchable): https://x.com/JANCTION_Global/status/2094234554404135293
- [S33] JasmyLab, JANCTION Render facts page: https://render.janction.jp/facts
- [S34] GitHub, JasmyLab-JANCTION/janction-render: https://github.com/JasmyLab-JANCTION/janction-render
- [S35] V01D MOU (aggregator republishing PR releases; search snippets; pages now redirect to an empty profile): https://aeo.washinmura.jp/ai/jasmylab-com/en/news/2026-05-11-jasmy-labs-janction-signs-mou-with-creat ; https://aeo.washinmura.jp/ai/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BEv01d/en/news/2026-05-25-v01d-partners-with-jasmy-lab-to-build-ne
- [S37] KuCoin Blog, "Janction (JCT): Introduction and Potential Analysis" (29 Mar 2026): https://www.kucoin.com/blog/jct-analysis
- [S38] Search-snippet-only secondary items: CryptoRank vesting https://cryptorank.io/price/janction/vesting ; PitchBook https://pitchbook.com/profiles/company/596815-93 ; JANCTION x C2E MOU (2024) https://medium.com/@JANCTION/janction-and-c2e-signed-a-strategic-partnership-mou-to-expand-between-the-japanese-and-korean-a1d5c233769d ; Jasmy roadmap / Arbitrum / CCIP mentions (search summaries); tokenomics.com https://app.tokenomics.com/tokenomics/janction

Sources NOT reachable directly (403/429/geo-block): BscScan, KuCoin announcement, bsc.news, JANCTION Medium, Jasmy Medium, Binance Futures API, X/Twitter. Binance's own listing announcement page was not opened (times come from Coinfomania + CoinCarp). No Panasonic-side or investor-side announcement found. (S36 intentionally unused.)

---

## UPDATE: SNAPSHOT 2026-11-08 ~21:05 UTC (the deck now uses THIS one; read 2026-11-08)

The pump continued after the first snapshot. CoinGecko coin endpoint (last_updated 21:04:55 UTC) [S02] and markets endpoint (21:05:50 UTC) [S04]; derivatives feed ~21:06 UTC [S03].
| Item | Value | Source |
|---|---|---|
| New ATH | $0.0185347 at 20:10 UTC | [S02] |
| 24h low | $0.0025343 (CG 24h low); market_chart low $0.002568 at 04:25 UTC | [S02] |
| Low -> ATH | 7.2x (my calc); price at 21:05 ($0.01442) = ~5.6x the 04:25 low | [S02] [S04] |
| Price | $0.01324 (coin endpoint 21:04:55) / $0.01442 (markets 21:05:50) | [S02] [S04] |
| Market cap / FDV / rank | $165.8M / $721.2M / #186 (markets) | [S04] |
| 24h volume | $320.6M (markets) | [S04] |
| 24h / 7d / 30d (coin endpoint) | +361.2% / +177.6% / +468.6% | [S02] |
| Feb low -> new ATH | $0.00106 -> $0.01853 = 17.5x (my calc) | [S02] |
| Binance JCTUSDT perp | 24h volume $1,578.9M, OI $56.5M | [S03] |
| KuCoin Futures / Bybit OI | $35.7M / $22.7M | [S03] |
| Toobit / OrangeX OI | $248.6M / $244.5M (not credible, see do-not-air) | [S03] |
| Monthly unlock at $0.01442 | ~1.2B x $0.01442 = ~$17M (my calc) | [S04] [S10] |

Peers at 21:05:50 UTC [S04] (market cap / FDV / 24h volume, $M): Bittensor 2,612.9 / 2,612.9 / 42.6 · Render 828.8 / 872.5 / 17.0 · Akash 185.8 / 185.8 / 2.9 · JASMY 177.7 / 179.7 / 5.3 (1y -64.1%) · Theta 139.7 / 139.7 / 2.0 · Golem 103.0 / 103.0 / 1.3 · Aethir 94.4 / 197.0 / 6.1 · io.net (CG id `io`) 49.2 / 92.1 / 4.75 · Nosana 44.3 / 44.3 / 0.33.
- JCT FDV = 4.0x JASMY, ~83% of Render, 3.7x Aethir (my calc). JCT volume $320.6M = 3.9x the nine peers combined ($82.3M) (my calc).
- GitHub repo links on slide 6 (verified via the GitHub API, 2026-11-08 ~21:30 UTC): core node https://github.com/Janction-R-D/janction-node (C, 0 stars, last push 2024-07-07, a separate `Janction-R-D` org) · render https://github.com/JasmyLab-JANCTION/janction-render (3 stars, last push 2026-11-05). The `JasmyLab-JANCTION` org has 7 public repos; `janction-node-binaries` last pushed 2024-06-22.
