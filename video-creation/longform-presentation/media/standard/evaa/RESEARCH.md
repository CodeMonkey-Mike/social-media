# RESEARCH: EVAA Protocol (EVAA): the TON / Telegram lending protocol whose token went 11x in three weeks

Compiled 2026-11-20 (13:54 to 14:30 UTC), to `video-creation/skills/coin-research/coin-research.md`. Every source was read
on **2026-11-20** unless a row says otherwise. Each fact cites a source key `[Sxx]` (list at the bottom). Raw pulls are saved
in `research/` (market JSON, docs, Telegram, on-chain, telemetry, event-window).
Tags: "project claim" = only EVAA says it. "my calc" = my arithmetic on cited numbers (method shown). "on-chain (verified)"
= read myself from TON (tonapi) or BNB Chain (public RPC / Binplorer). "NOT FOUND" carries its checked-list.
All times UTC. **Live-drift story:** EVAA is up ~5.4x in 7 days and the event-window rule applies (moves > 30% in 24 h
inside the last 7 days, and an unlock on 27 Nov, 7 days out). Re-pull every `[VERIFY]` number before recording.

---

## 1. MARKET SNAPSHOT (2026-11-20 ~13:54 UTC) [VERIFY]

### 1.1 Headline numbers
| Item | CoinGecko (last_updated 13:53:52) [S01] | CoinMarketCap (latestUpdateTime 13:50:48) [S02] |
|---|---|---|
| Price | $5.84 | $5.829 |
| 24h change | +20.0% | +21.6% |
| 7d / 30d change | +436.8% / +941.1% | +427.9% / +949.9% |
| 60d / 200d / 1y | +704.9% / +962.7% / +434.3% | 90d +718.9%, 1y +422.7% |
| Market cap | **$38.65M** | **$104.07M** |
| Fully diluted | $291.99M | $291.45M |
| Circulating supply | **6,617,972** | **17,854,337.9** (self-reported, from the project's own API) |
| Total / max supply | 50M / 50M | 50M / 50M |
| Rank | #474 | #252 |
| 24h volume | $42.96M (spot) | $65.6M (CEX $60.8M + DEX $4.8M) |
| 24h range | $4.83 to $5.96 | $4.85 to $5.96 |
- Peers pull 14:02:52 UTC (CG markets): $5.78, mcap $38.4M, FDV $290.4M, vol $42.1M, 7d +434.0%, 30d +935.6%. [S03]
- **Why the market caps differ (2.7x):** CG counts 6.62M circulating; CMC uses 17.85M, which it takes from EVAA's own endpoint
  `api.evaa.space/query/historical/evaa_coin_totals/circulating_supply` (returned `17854337` at 14:0x UTC) [S02] [S20].
  CMC's own unlock panel (also self-reported) says 29.66M unlocked (59.31%) [S02]. So three "how many are out" numbers:
  6.6M / 17.9M / 29.7M. The deck uses CoinGecko throughout and names the conflict.
- Minted supply, on-chain (verified): TON jetton 19,045,859.79 + BNB Chain 30,000,000 = **49,045,859.79** (my calc), which
  matches the project API's `total_supply` = 49,045,859 [S20] [S21] [S22]. About 0.95M of the 50M max is not minted yet.

### 1.2 All-time high / low
| Item | CoinGecko [S01] | CoinMarketCap [S02] |
|---|---|---|
| ATH | $13.62, 2025-10-26 17:35 | $13.613, 2025-10-27 01:40 |
| From ATH now | -57.1% | -57.0% |
| ATL | $0.2818, 2026-06-05 06:27 | $0.2836, 2026-06-06 04:40 |
| From ATL now | (my calc) about 20.7x | +1962% (about 20.6x) |
- CMC "launchPrice" field: $2 [S02]. ATH came 24 days after the 3 Oct 2025 TGE. ATH -> ATL = about -98% (my calc, 0.2818 / 13.62).

### 1.3 The price arc (CoinGecko daily closes) [S04]
| Date | Price | Note |
|---|---|---|
| 2025-10-03 | TGE (Binance Alpha, Binance Futures, MEXC, Gate, STON.fi) [S10] | |
| 2025-10-26 | $13.62 ATH | listing month |
| 2026-02-09 | $0.49 | |
| 2026-06-05 | $0.28 ATL | |
| 2026-07-09 | $2.77 | July spike, about 10x off the low; no stated cause [S13] |
| 2026-07-19 | $0.81 | -71% in 10 days (my calc) |
| 2026-10-27 | **$0.51** | last quiet day |
| 2026-10-28/29 | $1.11 / $1.45 | first leg, volume $0.47M -> $56.1M (my calc: about 119x day over day on 10-29) |
| 2026-11-13 | **$1.08** | faded back for two weeks |
| 2026-11-14 | 14:00 $1.157 -> 15:00 **$1.949** (hourly) | **+68% in one hour** (my calc) |
| 2026-11-15 to 11-20 | $1.43 -> $2.77 -> $3.27 -> $3.27 -> $4.03 -> $5.84 | a climb every day but one |
- Multiples (my calc): $0.51 -> $5.84 = **11.4x** since 27 Oct; $1.08 -> $5.84 = **5.4x** in a week.
- **Cause: NOT FOUND.** Checked: EVAA's two Telegram channels (no post about price, listings or news 13 to 20 Nov; see 9),
  BingX news (Nov 16: "no dated EVAA announcement Nov 14-16") [S14], CoinEdition (FameEX perp listed Nov 16, *after* the
  rally began) [S15], CoinDCX (Oct 27 "liquidity inflow", no source) [S16], CMC AI updates [S17]. Web search "EVAA surge
  November 2026 reason" returned no primary source. X (@evaaprotocol) NOT read (Chrome extension not loaded this session).

### 1.4 Event window: venue flows, 8 to 20 Nov (saved in `research/event-window/`) [S05] [S06] [S07]
Daily volume in USDT (Gate candles 00:00 UTC; Bitget 1D candles are Bitget-day, so only Gate is used for day multiples):
| Day | Gate perp | Gate spot | Bitget perp | Bitget spot |
|---|---|---|---|---|
| 11-12 | $1.18M | $0.68M | $0.85M | $0.22M |
| 11-13 | $0.81M | $0.46M | $18.91M | $3.27M |
| 11-14 | **$19.56M** | **$14.01M** | $97.46M | $7.65M |
| 11-15 | $37.48M | $27.55M | $68.69M | $7.28M |
| 11-16 | $53.37M | $28.66M | $49.30M | $8.24M |
| 11-19 | $27.99M | $17.06M | $27.91M | $7.01M |
- Gate 13 -> 14 Nov: perp 24x ($0.81M -> $19.56M), spot 30x ($0.46M -> $14.01M) (my calc).
- **Perps right now (14:0x UTC):** Gate $29.99M 24h, OI 1,829,188 EVAA (Gate stats: $9.95M) · Bitget $35.42M 24h, OI
  3,297,698 EVAA (about $19.2M, my calc) · MEXC $30.17M 24h, OI 28,554,993 contracts x 0.1 = 2.855M EVAA (about $16.6M,
  my calc). **Three reachable perp venues: $95.6M volume, about $45.8M open interest** (my calc), vs CG spot volume
  $42.96M and CG market cap $38.65M. **Open interest on three venues alone is larger than the CG market cap.**
- Gate open interest (contract_stats): $2.47M on 13 Nov -> $6.02M on 15 Nov -> $9.96M on 19 Nov (about 4x).
- Gate long/short ACCOUNT ratio: 1.04 on 13 Nov -> 0.58 (15th) -> 0.36 (16th) -> 0.33 (18th) -> 0.36 (20th): about
  **three accounts short for every one long** while the price climbed. Short liquidations on Gate: $139K (15th), $179K
  (16th), $65K (17th) vs long liquidations $27K / $67K / $30K. (Accounts, not size: say "more traders betting against it".)
- Funding stayed positive and modest: Gate 0.01% to 0.063% per 8 h (peak 0.0626% at 15 Nov 00:00); Bitget 0.005% flat;
  MEXC up to 0.092% per period. No extreme funding found on reachable venues.
- Not reachable: Binance futures (HTTP 451), Bybit (HTTP 403), KuCoin (restricted-area error 400302), OKX (no EVAA swap).
  Binance Futures listed EVAA at TGE [S10]; its current volume/OI is unknown from here.

### 1.5 Where it trades (CG tickers, 13:54 UTC) [S01]
- Top spot: Gate $22.1M, Bitget $8.8M, PancakeSwap V3 (BSC) $4.2M, Ourbit $2.2M, Toobit $1.6M, Uniswap V3 (BSC) $1.4M,
  KCEX $1.3M, Kraken $0.30M, DeDust (TON) $0.11M. STON.fi pairs stale (about $20).
- CG flags several BSC DEX pairs as anomalous (a PancakeSwap V3 pair, Uniswap V3/V4 pairs, Aster).
- Listings: Binance Alpha + Binance Futures + MEXC + Gate + STON.fi at TGE 3 Oct 2025 [S10]; Kraken [S18]; **KuCoin spot
  5 Oct 2026, 10:00 UTC** [S19] (KuCoin not in CG tickers today; KuCoin API blocked from here). Bybit perp linked in the
  docs [S23]. **Not on Binance spot, Coinbase, Upbit** (CG tickers show none).
- **Almost all trading is on BSC and CEXs; the token's TON home (DeDust/STON.fi) does about $0.1M a day.**

---

## 2. WHAT EVAA IS

- One line (DefiLlama, project text): "The first decentralized lending protocol on TON." [S08]
- Home page: "DeFi Superlayer On Telegram": deposit, earn, borrow, plus an EVAA Card ("pay in real-world spending"). [S24]
- How it works: over-collateralized lending (supply asset A, borrow asset B; no supply and borrow of the same token), Pyth
  oracles on-chain ("first in TON to support Pyth"), third-party liquidators repay up to 1/3 of a loan when health factor
  hits 0, no supply fee and no origination fee: "the only cost is interest". [S24] [S25]
- Runs as a Telegram Mini App plus a web app. Pools today: Main, Stable (USDT, USDe, tsUSDe), LP pool. [S24] [S26]
- Assets: GRAM (TON's coin: CoinGecko now lists it as "Gram (prev. Toncoin)", $1.016, -23.8% 30d), stablecoins, liquid
  staking tokens, LP tokens. [S03] [S24]
- Started as a prototype at Hack-a-TON x DoraHacks 2023 (Coinranking, secondary) [S27]; CMC "dateLaunched" 2022-12-19 [S02].
- Audits: Quantstamp (July 2024), Trail of Bits (Aug 2025, funded by the TON Foundation; a medium finding, upgrade config
  not written to storage). Bug bounty on HackenProof. **No exploit found** (checked: web search "EVAA exploit hack", DefiLlama
  hacks, Rekt-style coverage: nothing). [S25] [S28]
- Token chains: TON (jetton `EQBKMfjX_a_dsOLm-juxyVZytFP7_KKnzGv6J01kGc72gVBp`) and BNB Chain (BEP-20
  `0xaa036928c9c0df07d525b55ea8ee690bb5a628c1`), two parallel contracts. [S01] [S23]
- Description contradictions: the docs' token page still says "Contract Address: TBA" above the two live contracts; the
  docs say "Chain: TON" while 61% of minted supply is on BNB Chain (30M of 49.05M, my calc). [S23] [S21] [S22]

## 3. TEAM, BACKERS, FUNDING
- CEO **Vlad Kamyshov** (Finance Magnates, BeInCrypto interviews) [S29]; co-founder **Aleksandr Sudeikin** (The Block quotes
  him; spelled Sudeykin elsewhere) [S30]. No team page on the site (checked home page + docs).
- TGE press release datelined Panama City, Panama. [S10]
- Raise: **$2.5M private token sale, Jan 2025** (The Block) [S30]; DefiLlama lists TON Ventures, Polymorphic Capital, Animoca
  Brands, CMT Digital, Mythos Ventures, WAGMI Ventures; seed 2023 led by TONcoin.fund (amount not disclosed). [S08]
- Docs: seed = Animoca Ventures, TON Ventures, Polymorphic, PAKA, Mythos, Frens Syndicate x VC DAO; pre-seed = a "first
  EVAAngelist" angel who "owned a network of Telegram channels with a coverage of more than 20 million subscribers",
  TONStarter, TON Coin Fund, Existential Capital, WAGMI Ventures. Valuations: not disclosed. [S31]

## 4. PRODUCT + TRACTION (the telemetry sweep, saved in `research/telemetry/`)
### 4.1 DefiLlama (independent) [S08]
| | Value |
|---|---|
| TVL now | **$6.62M** (TON) |
| Borrowed now | $3.58M |
| Peak TVL | **$84.30M, 31 Jan 2025** |
| From peak | **-92%** (my calc) |
| 25 Oct 2026 | $7.73M |
| 12 Nov 2026 | $7.58M -> 20 Nov $6.62M (**fell 13% during the rally**, my calc) |
- Path: $38M (Aug 2024) -> $59.8M (Feb 2025) -> $18.7M (Apr 2025) -> $15.8M (Oct 2025, TGE month) -> $10.7M (Jan 2026)
  -> $9.1M (Sep 2026) -> $6.6M now.
- **Fees / revenue: NOT FOUND** (checked: DefiLlama `/summary/fees/evaa-protocol`, `/summary/fees/evaa` both "not found",
  EVAA absent from `/overview/fees` TON list; Token Terminal not checked (paywalled); docs FAQ: no fee rate beyond interest;
  api.evaa.space no revenue endpoint, see 4.3). Upper bound (my calc): $3.58M borrowed x 10% APR = about $360K a year of
  interest paid to LENDERS, before any protocol cut, whose size is not published.
### 4.2 The home page (evaa.finance), hard-coded numbers, not live [S24]
- "**118M+** Total Deposit at the peak" · "**300K+** Unique Wallets" · "**1.4B+** Transaction Volume" · "Join our 300k+
  users community" · "Over $2.5 million invested". All are literal strings in the site's JS bundle (`index-snAf7Kvg.js`),
  not fed by an API: project claim, undated. ($118M "deposits at the peak" vs DefiLlama peak TVL $84.3M: different
  measures, likely deposits incl. borrowed; do not reconcile on air.)
### 4.3 Standard-path probe (result in `research/telemetry/probe-log.txt`)
- evaa.finance and app.evaa.finance: every standard path (`/stats` `/v1/stats` `/api/stats` `/metrics` `/status`
  `/status.json` `/health` `/facts` `/.well-known/` `/llms.txt` `/openapi.json` `/sitemap.xml` `/robots.txt` ...) returns
  the SPA shell (HTTP 200, 1,996 / 974 bytes, no data) = no stats endpoint.
- api.evaa.space (the app's backend, mined from the app bundle): `/query/ping` ok;
  `/query/historical/evaa_coin_totals/circulating_supply` = **17,854,337**; `.../total_supply` = **49,045,859**;
  `/query/historical/price?asset=evaa` = $5.8398 (14:00:59); `/query/distributions/list` (campaign history, 89 KB);
  `/query/leaderboard` (XP leaderboard); `/query/campaigns/coffee/pool` = claimed 130,183,220; `/query/stats`,
  `/query/statistics`, `/query/tvl`, `/query/historical/tvl` = 404. **No public user count, no revenue, no live TVL endpoint.**
- GitHub org `evaafi` exists (activity not counted this pass).
### 4.4 The one-number gap (my calc)
- Product: $6.62M deposited, $3.58M borrowed (DefiLlama). Token: $38.65M market cap (CG) / $104M (CMC) / $292M fully diluted.
- **Market cap is 5.8x the money in the protocol (CG basis) or 15.7x (CMC basis); fully diluted is 44x.**

## 5. TOKEN
### 5.1 Utility (docs, "Utility & Governance & Rewards") [S23]
- Governance: "Token holders **can** participate ... by voting on selected platform-level technical proposals". The list of
  what proposals "**might include, in the future**": buybacks and burns, lending pool admission, collateral listings,
  incentives, updates, risk and fee policy.
- Utility: fee reduction for users who **burn** EVAA "in selected ways"; EVAA "**may** be used for staking or locking within
  security modules"; "**may** be staked ... to activate eligibility" for rewards; boosted APY paid in EVAA.
- The token is not needed to lend or borrow (FAQ: no fees except interest) [S24].
### 5.2 What holding it earns today (row 13)
- **Governance votes: NOT FOUND** (checked: Snapshot GraphQL spaces evaa.eth / evaadao.eth / evaaprotocol.eth / evaa-dao.eth /
  evaafi.eth = none; proposals with "EVAA" in the title = none; docs = no proposal list; Telegram channels = no vote posts).
- **Staking: NOT FOUND as a live, documented product** (checked: docs token page uses "may"; docs index has no staking guide
  for EVAA (only TON liquid-staking strategies); Telegram 17 Sep to 20 Nov = no staking post; one blog quotes "staking yields
  up to 54%" with no source, do-not-air). The support agent post (22 Oct) mentions "staking, or vesting" questions [S26].
- **Buyback / burn: NOT live.** Listed only as a possible future governance topic [S23]. Some aggregators describe a
  "buyback-and-burn funded by protocol revenue" as if live; the docs do not say so.
- True narrow form for air: "the token is not needed to use the app, and the docs list its uses as 'may' and 'in the future'".
### 5.3 Tokenomics (docs "Tokenomics v1.0, 17 March 2025") [S23]
| Bucket | Share |
|---|---|
| Airdrop + liquidity provider rewards | 22% |
| DAO Treasury | 20.08% |
| Founders and Team | 16.5% |
| Seed | 11.11% |
| Future Rounds | 10% |
| MM liquidity (market makers, CEX) | 10% |
| Pre-seed | 6.11% |
| Advisors | 2% |
| DEX liquidity | 1.2% |
| KOLs | 1% |
- Sum 100.0% (my calc). The unlock chart (docs image, saved `research/docs/unlock-table.jpg`) uses different labels
  (Liquidity Mining, MM liquidity, Marketing, Binance Web3Wallet marketing, Reserved Strategic Fund, DAO treasury and future
  rounds, Seed, KOL private, Biggest Farmer Airdrop, evaaXP converted, Advisors, Founders and Team, Pre-seed x3): about 15%
  at month 0, about 50% by month 12, about 77% by month 20, 100% by month 48. **The steepest stretch is months 8 to 20,
  i.e. June 2026 to June 2027: now.** Founders and Team unlock across roughly months 8 to 17.
- TGE float (CMC, at launch): 13.38% initial circulating, 1.71% newly unlocked [S12].
- **Next unlock (CMC panel, self-reported):** **27 Nov 2026 00:00 UTC, 535,056 EVAA (about $3.1M at $5.83)**: DAO Treasury &
  Future Rounds 312,083 + Liquidity provider rewards 222,973, both linear monthly. 1.07% of max supply. [S02] [VERIFY]
- About 20.3M still locked per that panel (40.7%), about $119M at today's price (my calc). [S02]
### 5.4 On-chain control (row 4) [S21] [S22] [S32]
- **BNB Chain:** 30,000,000 supply, contract owner = zero address (no mint on BSC). **26,724 holders**; top 10 = **81.0%** of
  BSC supply. **Four Safe multisigs, each 3-of-4 with the SAME four signers**, hold 5,563,918 + 2,204,810 + 2,055,564 +
  1,949,085 = **11,773,377 EVAA (23.5% of max supply, about $68.7M, my calc)**. Last EVAA moves from them: 20 Apr, 23 May,
  2 Oct 2025, 6 May 2026: **none during the November run** (on-chain, verified, Binplorer history). One plain wallet
  `0x46a9...7c3a` holds 5,000,000 (16.7% of BSC supply, about $29M), received 16 Jun 2026 from `0x6612...`, the same address
  that funded the Safes at TGE (1 Oct 2025). Owner unknown: do not name it.
- **TON:** jetton supply 19,045,859.79, **2,767 holders**, `mintable: true`, admin = a `multisig_v2` contract
  (`0:eeed...5959`). #1 holder is a highload wallet with a stream of small deposits today (looks like an exchange hot wallet,
  unlabelled); #2 and #3 are multisigs (5.25M and 2.38M EVAA) with no EVAA moves since Apr / May 2026.
- **No vesting contract found**: the locked tokens sit in multisigs, so the schedule is a promise, not code (same pattern as
  JCT). Holders total about 29.5K (my calc, 26,724 + 2,767).

## 6. RECENT NEWS + CATALYSTS
| Date | Event | Source |
|---|---|---|
| 2025-01 | $2.5M private token sale | [S30] |
| 2025-08 | Trail of Bits review published | [S25] |
| 2025-10-03 | TGE: Binance Alpha + Binance Futures + MEXC + Gate + STON.fi | [S10] |
| 2025-10-26/27 | ATH $13.62 | [S01] [S02] |
| 2025-10-25 | **Last post on the main Telegram channel @evaaprotocol (234K subscribers)** | [S26] |
| 2025-12 | "Expansion to BNB Chain, DAO on BNB" (BSC News, secondary only) | [S33] |
| 2026-06-05/06 | ATL $0.28 | [S01] |
| 2026-07-08/09 | spike to $2.77, then $0.81 by 19 Jul; no stated cause (Gate blog: "TON DeFi attention") | [S13] |
| 2026-10-05 | KuCoin spot listing, 10:00 UTC | [S19] [S26] |
| 2026-10-22 | AI support agent in chat; Main pool maintenance window | [S26] |
| 2026-10-27/28 | first leg $0.51 -> $1.45, no announcement | [S16] |
| 2026-11-14 15:00 | +68% in one hour, no announcement | [S04] |
| 2026-11-16 | FameEX lists an EVAAUSDT perp (after the move began) | [S15] |
| 2026-11-27 | next unlock, 535K EVAA | [S02] |

## 7. PEERS (CoinGecko markets 14:02:52 UTC + DefiLlama TVL) [S03] [S09]
| Coin | Price | Mcap | FDV | 24h vol | 7d | 30d | TVL | Mcap / TVL (my calc) |
|---|---|---|---|---|---|---|---|---|
| Aave | $101.89 | $1,573M | $1,630M | $195M | -8.9% | -34.5% | $16,204M | 0.10 |
| Morpho | $1.57 | $1,111M | $1,574M | $12.0M | -21.7% | -34.2% | $9,814M | 0.11 |
| Compound | $17.39 | $174M | $174M | $10.0M | -12.7% | -32.8% | $1,111M | 0.16 |
| Kamino | $0.0248 | $149M | $248M | $7.3M | -18.7% | -41.3% | $1,201M | 0.12 |
| Venus | $2.27 | $38.4M | $67.5M | $0.9M | -11.5% | -26.7% | $932M | 0.04 |
| Euler | $0.817 | $19.6M | $22.2M | $0.7M | -8.1% | -31.8% | $235M | 0.08 |
| **EVAA** | $5.78 | **$38.4M** | **$290M** | **$42.1M** | **+434%** | **+936%** | **$6.6M** | **5.8** |
- **EVAA and Venus have the same market cap ($38.4M); Venus holds 141x the deposits** ($932M vs $6.62M, my calc).
- EVAA's fully diluted value is 4.3x Venus's and 13x Euler's (my calc). EVAA's 24h volume ($42.1M) is 47x Venus's.
- Every peer is DOWN 8% to 22% on the week; GRAM (TON) -12.1% 7d. EVAA moved against its own sector and its own chain.

## 8. RISKS / RED FLAGS
1. Price vs product: token 11x in three weeks while TVL fell; TVL -92% from its peak. [S08]
2. A futures-driven market: perp volume about 2.2x spot on three venues alone; OI larger than the CG market cap. [S05-S07]
3. Supply opacity: three circulating numbers (6.6M / 17.9M / 29.7M); a self-reported unlock panel; no vesting contract.
4. Concentration: one controller (four 3-of-4 Safes, same signers) holds 23.5% of max supply on BSC; top 10 BSC wallets 81%.
5. TON jetton is still mintable by a multisig (0.95M of the 50M cap not minted).
6. Unlocks: the steepest part of the schedule is now through mid-2027; next tranche 27 Nov.
7. Communication: the 234K-subscriber main channel has been silent since 25 Oct 2025; no post on the rally.
8. Token utility is "may" / "future"; no vote found, no live staking found, no fee data.
9. History: -98% from the ATH to the June low, and a July spike that gave back 71% in 10 days.

## 9. THE PROJECT'S OWN RECENT POSTS (row 14) [S26]
- **@evaaprotocol (t.me/evaaprotocol), 234K subscribers: last post 25 Oct 2025** (34.2K views). 13 months silent.
- **@evaatg (t.me/evaafi redirects here), 16.8K subscribers**, posts every 2 to 3 days, 17 Sep to 20 Nov: explainers
  (utilization, borrow without selling, swap, repay in 25% steps), KuCoin listing (5 Oct), AI support agent (22 Oct), pool
  promos, Halloween, polls, APY lists (14 Nov: USDT in Stable Pool 17.40%, GRAM in LP Pool 16.55%, GRAM in Main 4.09%).
- During the run: 14 Nov (APY list), **15 Nov "The market's had a rough week. The workbench is still lit."**, 16 Nov "GM, TON.
  The blue frog has the mic", 18 Nov a borrow-screen poll, 20 Nov "what's one app you actually went back to". **Not one post
  mentions the token, the price or a listing.**
- Views per post fell from about 4.5K (29 Sep) to about 2.4K (14 Nov) and 1.85K (16 Nov). (551 on 20 Nov is a few hours old.)
- X @evaaprotocol: NOT read this pass (Chrome extension not loaded). Substack listed on CMC: not read.

## 10. DO-NOT-AIR (or only with the caveat)
- **Any cause for the pump** (no dated primary source). Say "no announcement".
- "Top 100 wallets hold 99.5%" (CoinGabbar): counts exchange and treasury wallets; use the verified BSC top-10 81% with the
  caveat, or the four-Safe 23.5%.
- "Staking yields up to 54%" (one blog, no source).
- "Buyback and burn is live" (docs say "might include, in the future").
- "Security incidents in the past" (KuCoin Square post): no incident found. Do not repeat.
- "BNB Chain expansion / DAO on BNB" (BSC News only): single secondary.
- The 4.5x "OI surge" style percentages from news sites: use our own Gate numbers with the venue named.
- The home page's 300K wallets / $118M / $1.4B as current usage: they are hard-coded, undated, peak or lifetime claims.
- Naming the owner of the 5M wallet or the Safe signers: unknown. Do not call them "insiders" or "the team".
- Price predictions of any kind (Coinbase, CoinDCX, CoinEdition pages).

## 11. CONFLICTS
| Figure | A | B |
|---|---|---|
| Circulating supply | 6.62M (CG) | 17.85M (CMC, project API) / 29.66M unlocked (CMC panel) |
| Market cap | $38.65M (CG) | $104.07M (CMC) |
| Rank | #474 (CG) | #252 (CMC) |
| ATH time | 2025-10-26 17:35 (CG) | 2025-10-27 01:40 (CMC) |
| Peak "deposits" | $84.3M peak TVL (DefiLlama) | "118M+ total deposit at the peak" (home page) |
| Allocation labels | docs table (10 buckets) | docs unlock chart (15 series, incl. Marketing, Binance Web3Wallet) |
| Chain | docs "Chain: TON" | 61% of minted supply on BNB Chain |
| TGE venues | Binance Futures at TGE (BeInCrypto) | Bitget Academy "exchange TBA" |

## 12. TRIGGERS TO WATCH
- 27 Nov unlock (535K EVAA, about $3.1M): do the multisigs move?
- Gate long/short account ratio back above 1, or OI falling while price holds = the squeeze is over.
- TVL: does any of the token's gain show up as deposits? (DefiLlama daily)
- Any post from EVAA about the price, a listing (Binance spot / Upbit) or a live staking / buyback.

---

## SOURCE KEY (read 2026-11-20 unless stated)
- [S01] CoinGecko API `/coins/evaa-protocol` (tickers incl.), `research/cg-coin.json`, last_updated 13:53:52 UTC
- [S02] CoinMarketCap page coinmarketcap.com/currencies/evaa-protocol/ (embedded data), `research/cmc-next-data.json`
- [S03] CoinGecko `/coins/markets` peers, `research/cg-peers.json`, 14:02:52 UTC
- [S04] CoinGecko `/market_chart` daily 365 d + hourly 14 d, `research/cg-daily-365.json`, `cg-hourly-14.json`
- [S05] Gate.io API: futures contract, tickers, contract_stats 1d, funding_rate, candles (perp + spot), `research/event-window/`
- [S06] Bitget API: mix ticker, history-fund-rate, candles (perp + spot)
- [S07] MEXC contract API: ticker, detail (contractSize 0.1), funding history
- [S08] DefiLlama `api.llama.fi/protocol/evaa-protocol`, `research/llama-protocol.json`
- [S09] DefiLlama `api.llama.fi/tvl/<slug>` for peers, `research/llama-peer-tvl.json`
- [S10] Cointelegraph press release "EVAA to launch token on Binance Alpha, MEXC, STON.fi and Gate.io" (1 Oct 2025); BeInCrypto TGE article
- [S12] CoinMarketCap AI "what is" (TGE float 13.38% / 1.71%) via search snippet
- [S13] Gate blog "Why did EVAA surge and then pull back" (Aug 2026); Coinranking history
- [S14] BingX news "Why is EVAA up 82.11% today, November 16, 2026"
- [S15] CoinEdition EVAA price coverage (FameEX perp, 16 Nov 2026)
- [S16] CoinDCX "EVAA surges 150% in a week" (late Oct 2026)
- [S17] CoinMarketCap AI latest updates page (search snippet)
- [S18] Kraken blog "EVAA is available for trading"
- [S19] KuCoin on X, new listing post (5 Oct 2026, 10:00 UTC), via search
- [S20] EVAA API `api.evaa.space/query/historical/evaa_coin_totals/circulating_supply` and `/total_supply`, `/query/historical/price?asset=evaa`
- [S21] tonapi.io `/v2/jettons/<EVAA>` + holders + top-3 histories, `research/onchain/ton-*.json`
- [S22] BNB Chain public RPC (totalSupply, owner, Safe getThreshold / getOwners) + Binplorer token info / top holders / histories, `research/onchain/`
- [S23] EVAA docs evaa.gitbook.io: `$EVAA Token`, `Tokenomics v1.0 (17 Mar 2025)` + unlock chart image, `research/docs/`
- [S24] evaa.finance home page + its JS bundle + `/locales/en/translation.json`, `research/telemetry/`
- [S25] EVAA docs Security Audit page; Trail of Bits publication (2025-08); HackenProof bounty page
- [S26] Telegram public previews t.me/s/evaaprotocol and t.me/s/evaafi (-> evaatg), `research/tg-posts.txt`
- [S27] Coinranking "What is EVAA"
- [S28] Web search "EVAA protocol exploit hack incident TON lending" (no incident found)
- [S29] Finance Magnates author page; BeInCrypto "EVAA CEO Vlad Kamyshov explains token launch"
- [S30] The Block "TON DeFi lender EVAA Protocol raises $2.5 million in private token sale" (Jan 2025)
- [S31] EVAA docs Backers / Ventures page
- [S32] Snapshot GraphQL hub.snapshot.org (no EVAA space)
- [S33] BSC News "What is EVAA? TON's first DeFi lending protocol"
