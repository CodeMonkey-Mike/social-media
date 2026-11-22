# SOL coin research (bullish talking-points session, around 15 min)

Standard followed: `video-creation/skills/coin-research/coin-research.md` (all 14 rows; skipped rows say why).
Research run: 2026-11-17 US evening = 2026-11-18 01:48 to 02:15 UTC. Every live figure is `[VERIFY]` before recording.
Tags: `(source, read YYYY-MM-DD HH:MM UTC)`; "my calc" = my arithmetic (method shown); "on-chain (verified)" = my own
RPC read; "project claim" = Solana Foundation's own statement. No em dashes anywhere; "around" before numbers.

Out of scope here (Mike researches them himself, noted only):
- Zelle / Early Warning x Solana: https://x.com/WatcherGuru/status/2122345039150117363 (not opened by me).
- DTCC Tokenization Service to connect with Solana, H2 2027: https://www.dtcc.com/press-releases/2026/dtcc-tokenization-service-to-connect-with-solana
  (also headlined on https://solana.com/ home page news list, read 2026-11-18 01:58 UTC).

---

## 0. The one-screen version

**Bullish spine:** the price is down around 72-75% from the January 2025 high, but almost every network number is many
times bigger than at the last time SOL was this far down (Dec 2022), and 2026 added real plumbing: Alpenglow live
(Oct 21), 200 ms slots (Oct 9), Solana 1.0 / "beta" label dropped (Nov 16), Schwab spot SOL (Nov 9), Samsung Wallet USDC
on Solana (Nov 2), J.P. Morgan Asset Management and BlackRock funds on Solana, Western Union USDPT (May 4), US spot SOL
ETFs still net +$1.42B since launch.

**Cautions that would make a line false (details in section 11):** ETFs are in net OUTFLOWS for October and November;
SOL is below its 50-week and 200-week averages; stablecoins and TVL on Solana are DOWN from their highs; validator count is
at multi-year lows (666); the doubled disinflation was voted but is not in effect on-chain yet; Visa's $25B run rate is
multi-chain, not Solana-only.

---

## 1. Market snapshot `[VERIFY]`

| Field | Value | Source |
|---|---|---|
| Price | $74.37 (24h +3.81%, 7d -10.47%, 30d -28.65%, 1y -43.26%) | CoinGecko `/coins/solana`, last_updated 2026-11-18 01:47:57 UTC (read 2026-11-18 01:48 UTC) https://api.coingecko.com/api/v3/coins/solana |
| Same, CMC | $74.17 (24h +3.36%, 7d -10.82%, 30d -29.21%) | CMC data-api detail id 5426 (read 2026-11-18 02:00 UTC) https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail?id=5426 |
| 24h range | $71.15 to $75.55 | CoinGecko (same read) |
| Market cap / rank | $44.01B, rank 7 | CoinGecko (same read) |
| FDV | $47.43B (no max supply) | CoinGecko (same read) |
| 24h spot volume | $3.17B | CoinGecko (same read) |
| Circulating / total supply | 591.74M / 637.74M SOL. CoinGecko and CMC AGREE (591,739,487 CMC vs 591,739,494 CG); RPC `getSupply` says circulating 591,739,485 SOL, non-circulating 45,998,249 SOL, total 637,737,735 SOL, slot 470,758,234 | on-chain (verified) `getSupply`, api.mainnet-beta.solana.com (read 2026-11-18 01:52 UTC) |
| ATH | $293.31 on 2025-01-19 03:15 UTC (CoinGecko) vs $294.33 on 2025-01-19 11:16 UTC (CMC). Daily-close ATH: $261.87 on 2025-01-18 (Yahoo SOL-USD) | CoinGecko, CMC, Yahoo (reads above) |
| Drawdown from ATH | -74.6% from CG intraday ATH; -71.6% close-to-close (Yahoo, 261.87 to 74.25) | CoinGecko `ath_change_percentage`; my calc on Yahoo closes |
| ATL | $0.5008 on 2020-05-11 (CG) | CoinGecko |
| 2026 high (close) | $146.75 on 2026-01-14 | my calc, Yahoo daily closes https://query1.finance.yahoo.com/v8/finance/chart/SOL-USD?interval=1d (read 2026-11-18 01:48 UTC) |
| 2026 low | $62.19 close / $60.41 intraday on 2026-06-06 | my calc, Yahoo |
| Now vs 2026 low | +19.4% (74.25 vs 62.19 close) | my calc, Yahoo |
| 2026 bounce high | $122.06 close on 2026-09-27 (then -39% to now) | my calc, Yahoo |
| 50-week SMA | $93.56 (price around 21% below) | my calc: mean of the last 50 ISO-week closes, Yahoo |
| 200-week SMA | $114.16 (price around 35% below) | my calc, same method, 200 weeks |
| 200-day / 50-day SMA | $88.68 / $99.94 | my calc, Yahoo daily closes |
| 200w crosses in 2026 | Below on week of 2026-02-01; back above week of 2026-09-20; below again week of 2026-10-11 | my calc, Yahoo weekly |
| YTD 2026 | SOL -41.4%, ETH -40.0%, BTC -27.6% (from 2026-01-01 closes) | my calc, Yahoo SOL-USD / ETH-USD / BTC-USD |
| SOL/ETH ratio | 0.0413 now; 0.0433 one year ago; 2026 range 0.0358 (May 4) to 0.0481 (Jul 1); record 0.0868 (2025-04-20) | my calc, Yahoo closes |

**Event window rule:** NOT triggered (no ATH in the last 7 days, largest daily close move -10.1% on Nov 14, no large unlock
within 7 days). Snapshot only.

---

## 2. The "we are here" moment (2022-2023 vs now), all from Yahoo daily closes unless noted

| | Then | Now (2026-11-18) |
|---|---|---|
| Prior peak (close) | $258.93 on 2021-11-06 | $261.87 on 2025-01-18 |
| Drawdown at the low | -96.3% to $9.65 close on 2022-12-29 (intraday low $8.14 the same day) | -71.6% close basis (-74.6% from CG intraday ATH) |
| Days from peak | 418 days to the low | 669 days so far |
| Price vs 50-week SMA at that point | around 81% below ($9.98 vs $52.30, week of 2023-01-01) | around 21% below ($74.25 vs $93.56) |
| The crash event | FTX week: $36.77 (Nov 5 2022) to $13.94 (Nov 9 2022), -62% in 4 days | No single blow-up; SOL fell with the whole market (ETH -63% from its ATH close, BTC -49%) |
| SOL/ETH | 0.0080 at the low | 0.0413 (around 5.1x higher) |
| Stablecoins on Solana | $1.82B (2023-01-01, DefiLlama) | $13.89B (around 7.6x) |
| DeFi TVL on Solana | $0.23B (2022-12-29, DefiLlama) | $4.77B (around 21x) |
| DEX volume | $11.7B in all of 2022 (DefiLlama; early coverage may be incomplete) | $963B in the last 365 days (DefiLlama) |
| US spot SOL ETFs | did not exist | $1.03B net assets, +$1.42B cumulative net inflow |
| Tokenized RWA (ex stablecoins) | n/a | $5.12B (rwa.xyz) |

The recovery after that low (my calc, Yahoo closes): 2x by 2023-01-14 (16 days), 5x by 2023-11-10, 10x by 2023-12-22,
20x by 2024-03-17, and a new ATH close on 2025-01-18, 751 days after the low (27x from $9.65).
DefiLlama sources: https://stablecoins.llama.fi/stablecoincharts/Solana , https://api.llama.fi/v2/historicalChainTvl/Solana ,
https://api.llama.fi/overview/dexs/solana (all read 2026-11-18 01:53 UTC).
Line idea (conditional): "Last time SOL was this beaten up, the network was a fraction of today's size. History does not
have to repeat, but the gap between price and usage is wider now than then."

---

## 3. What it is (project's own words)

- Home page headline: "The capital market for every asset on earth." and "the leading high performance network powering
  internet capital markets, payments, and crypto applications" (https://solana.com/ , read 2026-11-18 01:58 UTC).
- Solana 1.0 (2026-11-16): the network "graduation from 'mainnet beta' to 'mainnet'", with a shared protocol version
  across clients (Agave, Firedancer) (https://solana.com/news/solana-1-0-dropping-beta-and-what-comes-next , read
  2026-11-18 02:08 UTC). Project claim.
- Contradiction to note: the RPC still reports `api.mainnet-beta.solana.com` as the public endpoint name; the rename is a
  label change, "the same network, nothing changes" (same page).

## 4. Tokenomics, issuance, unlocks

- No max supply. Inflation params on-chain: initial 8%, taper 15%/yr, terminal 1.5%, foundation 0%; current total rate
  3.552% (epoch 1089). On-chain (verified) `getInflationGovernor` / `getInflationRate` (read 2026-11-18 01:52 UTC).
- Gross issuance at that rate: around 22.65M SOL/yr = around $1.68B/yr or around $140M/month at $74.37 (my calc:
  0.03552 x 637.74M x price). Most goes to the 67% that stakes.
- Disinflation doubling (SGP-002 / SIMD-0550): passed its vote on 2026-08-28 per Blockworks Q3 2026 report (two-thirds of
  participating stake, Kraken's late switch decisive, 901 delegator overrides moved 11.2M SOL at >99% yes), moving the
  1.5% terminal rate from 2032 to 2029 and removing around 18.9M SOL of emissions
  (https://blockworks.com/api/investor-report/solana-token-holder-report-q3-2026/pdf , read 2026-11-18 02:05 UTC).
  BUT the on-chain taper is still 0.15 today (on-chain verified). Say "validators and stakers voted to double the
  disinflation rate; it has not switched on yet as of my read". Conflicting vote figures in section 12.
- SGP-003 (SIMD-0553, resource fee burn) FAILED at 63% vs the two-thirds bar (Blockworks Q3).
- Unlocks: no investor/team vesting cliff found. Tokenomist's SOL page reportedly marks vesting ended in 2026 (search
  snippet only); DefiLlama unlocks API `https://api.llama.fi/emission/solana` returned HTTP 402 (paywalled). Treat SOL's
  supply pressure as issuance, not unlocks. Checked-list: tokenomist.ai/solana (snippet), api.llama.fi/emission/solana
  402, RPC non-circulating 46.0M SOL (no schedule attached).
- New burn: the Validator Admission Ticket (VAT, SIMD-0357) charges each voting validator a flat 0.8 SOL per epoch, burned
  (https://solana.com/upgrades/alpenglow , read 2026-11-18 02:03 UTC). Around 533 SOL per epoch at 666 validators,
  around 180K SOL/yr (my calc; epoch = 432,000 slots x 0.2155 s = around 25.9 h). Small next to issuance; do not oversell.

## 5. On-chain facts (my own RPC reads, api.mainnet-beta.solana.com, 2026-11-18 01:52 UTC)

- Voting validators: 666 vote accounts (661 current + 5 delinquent). Alpenglow page: 654 validators at activation, 446
  signed the genesis certificate.
- Staked: 428.80M SOL = 67.2% of total supply, 72.5% of circulating (my calc). Blockworks: record 441.3M at end Q3 2026,
  so staked SOL is down around 2.8% since (my calc).
- Nakamoto coefficient (fewest validators with more than one-third of stake): 18 (my calc on activated stake). The Block's
  Jan 2026 coverage cited 20.
- Client mix by stake (my calc, joining `getVoteAccounts` to `getClusterNodes` versions): Agave-family 4.4.x around 81%;
  versions 26.10.6 / 26.10.7 / 26.10.8 / 26.11.0 around 17.1% across 95 vote accounts. Those version numbers match
  Firedancer's GitHub releases (v26.10.8 "Firedancer Mainnet Release", 2026-11-11; v26.10.2 "Support for Alpenglow")
  https://api.github.com/repos/firedancer-io/firedancer/releases (read 2026-11-18 02:00 UTC). Mapping is my inference.
- Throughput: 1,654 TPS average over the last hour, all non-vote (votes left blocks with Alpenglow), slot time around
  215 ms (my calc from `getRecentPerformanceSamples`, 60 samples, 3,600 s). Lifetime transaction count 567.19B.
- Core version 4.4.0 (`getVersion`).

## 6. Derivatives + liquidity `[VERIFY]` (snapshot only)

- Perp open interest, all CoinGecko-listed SOL perps: around $3.81B across 125 venues; perp 24h volume around $15.9B vs
  spot $3.17B (around 5x, my calc). Top OI: Binance $626M, Gate $274M, OKX $234M, Toobit $216M (Toobit and CoinUp numbers
  are not credible enough to quote). https://api.coingecko.com/api/v3/derivatives (read 2026-11-18 01:59 UTC).
- Funding is NEGATIVE on most venues (shorts paying longs): OKX 21-period average -0.0022% per 8 h; Gate -0.0137%;
  Binance -0.0009% (CG feed). OKX https://www.okx.com/api/v5/public/funding-rate-history?instId=SOL-USDT-SWAP ; Gate
  https://api.gateio.ws/api/v4/futures/usdt/contracts/SOL_USDT (read 2026-11-18 01:59 UTC). Contrarian line only, and
  conditional ("positioning leans short").
- OKX SOL OI fell from $374M (Nov 8) to $282M (Nov 17), -25% (OKX rubik, my calc): leverage has been flushed.
- Binance/Bybit direct APIs not used (restricted from this location per the standard); their numbers come via CoinGecko.

## 7. Listings / access (row 6, kept short: SOL is listed everywhere)

- Charles Schwab: SOL, AVAX, LINK now tradable in Schwab Crypto accounts, press release dated 11/09/2026, 75 bp per trade
  (https://pressroom.aboutschwab.com/press-releases/press-release/Charles-Schwab-Makes-Solana-Avalanche-and-Chainlink-Available-to-Trade-Through-Schwab-Crypto-Accounts/default.aspx , read 2026-11-18 02:12 UTC).
  Blockworks Q3: Schwab has "nearly 40 million active accounts".
- Morgan Stanley E*Trade SOL trading rolled out in Q3 2026 (Blockworks Q3; not primary-verified).
- Hong Kong: Pando Solana ETF began trading 2026-10-13, code 2831 (Solana roundup, project claim).

## 8. Team / operator

Solana Foundation (publisher of solana.com), Anza (Agave client, Alpenglow), Jump (Firedancer). Not re-researched;
not needed for the talking points.

## 9. PRODUCT'S OWN TELEMETRY (row 8)

**Solana home page "The fastest growing & leading financial platform"** (https://solana.com/ , read 2026-11-18 01:58 UTC;
each stat carries its own source + period in the page data, all "Solana Data"):
- 2.6M average daily active signers (30 days to Nov 16, 2026)
- 3B successful transactions (30 days to Nov 17, 2026)
- $1.5T DEX volume (52 weeks to Nov 17, 2026)
- $1.4B app revenue (52 weeks to Nov 17, 2026)
- Institutions block: Western Union "USDPT, stablecoin launched May 2026"; Visa "Millions, settled in USDC"; PayPal
  "PYUSD, stablecoin issued"; r3 "$17B in regulated onchain assets"; Franklin Templeton "11% monthly onchain asset growth";
  Bullish "$1.4B average daily volume"; Apollo ACRED onchain. Project claims; the $17B and 11% have no period on the page.
- "Total transactions to date" and live TPS counters are client-side rendered (empty in the HTML).

**Solana Data dashboard** https://solana.com/data (providers: Allium, Artemis, Blockworks, DefiLlama, Dune, RWA,
Token Terminal, Top Ledger, ValidatorsApp; "Refreshes twice daily ... Lagging by 1 day"). Its endpoint is
`/api/databricks/data?days=N` (found in the page script). It returned the Vercel Security Checkpoint (HTTP 429) on 4 tries.

**Standard-path probe on solana.com (2026-11-18 02:05-02:10 UTC):** `/stats` 404, `/v1/stats` 404, `/api/stats` 404,
`/status.json` 404, `/llms.txt` 200 (docs index, no metrics); `/metrics` `/status` `/health` `/v1/health` `/facts`
`/facts.json` `/.well-known/` `/version.json` `/changelog` `/changelog.json` `/llms-full.txt` `/openapi.json`
`/sitemap.xml` `/robots.txt` all 429 (Vercel checkpoint) on the first pass, not retried. Status page JSON
https://status.solana.com/api/v2/incidents.json 200 (used below).

**Uptime (status page, read 2026-11-18 01:55 UTC):** last incident listed is "mb-020624", critical, 2024-02-06. Before
that 2023-02-25. Nothing since: 1,015 days (my calc, Feb 6 2024 to Nov 17 2026), including the Alpenglow cutover. Current
status "All Systems Operational". Blockworks Q3 adds: a 2026-08-12 Frankfurt network-provider routing incident "did not
disrupt consensus"; 597 of 699 validators kept voting, recovered within 40 minutes.

**Alpenglow / slots (primary: https://solana.com/upgrades/alpenglow , read 2026-11-18 02:03 UTC):**
- "Alpenglow is live on mainnet. It activated in epoch 1064, which started on Wednesday, October 21, 2026, at
  approximately 13:36 UTC." The TowerBFT to Alpenglow handoff took around 900 ms (same page).
- Finality: around 12.8 s under TowerBFT; Alpenglow "targets roughly 150 milliseconds" ("an expectation, not a constant").
  Say "targets around 150 ms", never "achieved".
- Tolerates 20% malicious + 20% offline stake. Phase 2 "Rotor" (replaces Turbine) "is not yet scheduled".
- Slot times cut from 400 ms to 200 ms in four stages completed October 2026 (Oct 9 final stage per the October roundup).
- Firedancer and Frankendancer "were not supported for the migration", but Firedancer releases since 26.10.2 support
  Alpenglow, and around 17% of stake runs those versions now (section 5). Solana 1.0 page: "The deployment of Firedancer
  ... adds greater diversity to the software running the network."

**Money beside the token (row 8 step 6, my calc):** chain fees $229.8M trailing 365 days (DefiLlama
`/summary/fees/solana`), app revenue $1.31B (DefiLlama) or $1.4B (Solana home page), Blockworks REV $75.7M in Q3 2026,
vs gross issuance around $1.68B/yr at today's price. The network still pays stakers mostly with new SOL (Blockworks:
issuance around 98% of staker revenue in Q3; real staking yield around 1.3%). Do not claim "Solana earns more than it
issues".

**Trigger to watch:** daily US spot SOL ETF flows (5 straight weeks mostly negative, one +$11.7M day on Nov 16), and
whether the disinflation taper flips to 0.30 on-chain.

## 10. The strongest verified bullish facts (use these)

1. **Alpenglow live on mainnet, Oct 21 2026, no outage:** finality target around 150 ms from 12.8 s, with 200 ms slots
   since Oct 9. https://solana.com/upgrades/alpenglow (read 2026-11-18 02:03 UTC).
2. **No status-page incident in 1,015 days** (last: 2024-02-06), through 200 ms slots and the biggest consensus change in
   its history. https://status.solana.com/api/v2/incidents.json (read 2026-11-18 01:55 UTC).
3. **"Mainnet beta" is retired: Solana 1.0 (Nov 16 2026)**, one protocol, two independent clients; Firedancer-version
   validators hold around 17% of stake (my calc, on-chain). https://solana.com/news/solana-1-0-dropping-beta-and-what-comes-next
4. **US spot SOL ETFs: +$1.42B cumulative net inflow** since Oct 28 2025, $1.03B net assets (2026-11-16), record day
   +$86.67M on 2026-09-25; 11 of 14 months net positive. SoSoValue https://sosovalue.com/assets/etf/us-sol-spot ;
   Farside total 1,415 (US$m) https://farside.co.uk/sol/ (both read 2026-11-18 01:56 UTC). Bitwise BSOL alone $726.00M AUM
   (2026-11-16) https://bitwiseinvestments.com/crypto-funds/bsol .
5. **Solana is the #1 chain for DEX volume in the last 24 h (21%) and neck and neck with Ethereum over 30 days (20.3% vs
   20.7%)**; $963B in the last 365 days, $3.27T all-time (DefiLlama https://api.llama.fi/overview/dexs , read 2026-11-18
   01:53 UTC). Blockworks Q3 (spot only): 36% share, ninth straight quarter above 30%.
6. **#3 chain for stablecoins ($13.62B) behind Ethereum and Tron**, USDC on Solana $7.28B (+7% m/m), PYUSD $778.5M (31.6%
   of all PYUSD), SoFiUSD $278.9M (73.6% of its supply). https://stablecoins.llama.fi/stablecoinchains ,
   https://stablecoins.llama.fi/stablecoins (read 2026-11-18 02:02 UTC). 14.08M stablecoin holders on Solana (rwa.xyz).
7. **Tokenized RWA on Solana at a record $5.12B, #3 chain** behind Ethereum and BNB, +5.7% in 30 days, 1.05M RWA holders
   (+12% in 30 days, around 18% of all RWA holders, my calc vs 5.79M). Managers on Solana: BlackRock $861.3M, J.P. Morgan
   Asset Management $742.3M, State Street $314.4M, Janus Henderson $88.4M, Invesco $24.7M. https://app.rwa.xyz/networks/solana ,
   https://app.rwa.xyz/networks (read 2026-11-18 01:57 UTC). October roundup: "RWA value on Solana reached a record $5
   billion" (project claim).
8. **Wall Street access in 2026:** Schwab spot SOL live 2026-11-09 (press release); J.P. Morgan AM brought MONY and JLTXX
   to Solana via Morgan Money; Fiserv's Digital Asset Platform live with Bank of North Dakota, "more than 90 banks and
   credit unions", settling on Solana; Securitize Stocks on Solana (October roundup, project claim:
   https://solana.com/news/solana-ecosystem-roundup-october-2026 , read 2026-11-18 02:07 UTC).
9. **Payments giants on Solana rails:** Western Union USDPT launched on Solana 2026-05-04, issued by Anchorage Digital
   Bank, Philippines and Bolivia first (The Block https://www.theblock.co/news/business/2026-05-04-western-union-launches-usdpt-stablecoin-anchorage-solana-399890 ,
   read 2026-11-18 02:12 UTC); Visa US USDC settlement over Solana with Cross River and Lead Bank (Visa release
   2025-12-16 https://investor.visa.com/news/news-details/2025/Visa-Launches-Stablecoin-Settlement-in-the-United-States-Marking-a-Breakthrough-for-Stablecoin-Integration/default.aspx );
   Samsung Wallet USDC on Solana live 2026-11-02 for around 82 million US Galaxy devices
   (https://solana.com/news/samsung-wallet-solana , read 2026-11-18 02:10 UTC); Open USD (Bridge, founding partners
   Coinbase, Mastercard, Shopify, Stripe, Visa) live on Solana 2026-09-30 (Blockworks Q3; Solana news page seen in search only).
10. **Usage, project's own dashboard:** 2.6M daily active signers, 3B successful transactions in 30 days, $1.4B app revenue
    in 52 weeks (solana.com home, read 2026-11-18 01:58 UTC, project claim).
11. **Q3 2026 rebound in the money lines:** REV +48% to $75.7M, app revenue +48% to $299.1M, spot ETP inflows $492.3M
    (4x Q2), staked SOL record 441.3M, treasury companies 18.8M SOL (Blockworks Q3 2026 PDF, read 2026-11-18 02:05 UTC).
12. **Treasury companies hold 18.42M SOL ($1.37B)** across 7 public companies; Forward Industries 7.55M SOL
    (https://www.theblock.co/treasuries/solana-treasuries , read 2026-11-18 02:04 UTC). With ETFs (around 14.3M SOL, my calc:
    $1,025M / $71.51) that is around 32.8M SOL, around 5.5% of circulating supply (my calc, mixed dates).
13. **Network size vs the 2022 low:** stablecoins 7.6x, TVL 21x, SOL/ETH 5.1x (section 2).

## 11. Risks / cautions and the DO-NOT-AIR list

| Do not say | Why | Safe narrow form |
|---|---|---|
| "ETF money keeps pouring in" | US spot SOL ETFs: -$143.7M in October, -$46.6M Nov MTD; cum inflow peaked $1.62B on 2026-09-29, now $1.42B; net assets $1.96B peak (2026-09-25) to $1.03B (SoSoValue, my calc) | "Net +$1.42B since launch, even through a 70% drawdown" |
| "Record stablecoins on Solana" | DefiLlama $13.9B now vs $16.03B 2026 high (2026-07-25) and $16.28B all-time (2025-12-13); rwa.xyz -5.3% in 30 days | "#3 chain for stablecoins, around $14B" |
| "TVL at a high" | DefiLlama Solana TVL $4.77B vs $13.19B peak (2025-09-14), -64% | Skip TVL, or show it in the 2022 comparison only |
| "1,000+ validators / most decentralized chain" | 666 voting validators now (RPC); The Block 2026-01-28: under 800, from around 2,500 in early 2023; Nakamoto coefficient 18 (my calc) | "Validators fell, but consensus held through every 2026 upgrade" |
| "150 ms finality achieved" | Foundation calls it a target, "an expectation, not a constant" | "targets around 150 ms, down from 12.8 s" |
| "Inflation cut is live" | On-chain taper still 0.15 (RPC read 2026-11-18) | "voted to double the disinflation rate; not switched on yet" |
| "Visa settles $25B on Solana" | crypto.news 2026-10-29: $25B annualized is across 10 blockchains, Solana not named | "Visa settles USDC over Solana with US banks" |
| "SOL is above key averages" | Below 50w ($93.56), 200w ($114.16), 200d ($88.68) SMAs | "Around 19% above its June low" |
| "Solana owns tokenized stocks" | Blockworks Q3: Solana's share of cross-chain tokenized equity volume fell from 95% (Q2) to 14% (Q3); BNB Chain 55%, Robinhood Chain 28% | "Tokenized-stock volume on Solana hit a record $4.4B in September" |
| "Treasury companies will keep buying" | All 7 trade below their SOL holdings (mNAV 0.27x to 0.92x, The Block) | "Public companies hold around 18.4M SOL" |
| "DEX volume is booming" | Monthly DEX volume around $61B in Oct vs $314B peak Jan 2025; 30d -28% vs prior 30d (DefiLlama) | "#1 or #2 chain by DEX volume" |
| "Staking is at a record" | 428.8M now vs 441.3M end Q3 | "around two-thirds of all SOL is staked" |

Top 5 risks for the video: (1) ETF outflow streak, (2) price below the 50w/200w SMAs, (3) stablecoins/TVL/DEX volume off
their highs, (4) validator count at multi-year lows, (5) issuance (around $1.68B/yr) far above network REV.

## 12. Conflicts list

| Figure | Value A | Value B |
|---|---|---|
| ATH | $293.31 (CoinGecko, 2025-01-19 03:15 UTC) | $294.33 (CMC and Yahoo intraday, 2025-01-19) |
| US SOL ETF assets | $1.025B US spot (SoSoValue, 2026-11-16) | $1.88B "Solana ETF assets" (The Block, includes NCIQ index ETF and 2x SOLT) ; $3.7B global spot ETP AUM end Q3 (Blockworks) |
| BSOL AUM | $726.00M (Bitwise, 2026-11-16) | $802.70M (The Block tracker, undated); $1.07B on Oct 28 (Solana roundup) |
| Record ETF day | +$86.67M on 2026-09-25 (SoSoValue; Farside max 86.7) | +$71.5M on 2026-09-25 (Blockworks Q3) |
| Farside "Total" | 1,415 US$m; page lists 449.3 seed separately and does not say if Total includes it | SoSoValue cum net inflow $1,422.0M |
| DEX volume, 1 year | $963B (DefiLlama) | $1.5T (Solana home page, "Solana Data", 52 weeks to Nov 17) |
| App revenue, 1 year | $1.31B (DefiLlama) | $1.4B (Solana home page) |
| Stablecoins on Solana | $13.62B (DefiLlama chains) / $13.89B (DefiLlama chart) / $13.97B (rwa.xyz) | $16.8B end Q3, $17.4B early Oct (Blockworks) vs DefiLlama $15.2B on Oct 1 |
| DEX share | 30d: Ethereum 20.7%, Solana 20.3% (DefiLlama, all DEX incl. off-chain buckets) | Q3 spot only: Solana 36% (Blockworks) |
| SGP-002 margin | "67% approval" (CryptoBriefing) | 176.29M yes / 66.19M no = 72.7% of yes+no (my calc on the same article's figures); Blockworks: validator-cast 165.1M yes + 11.2M override |
| Forward Industries SOL | 7.55M (The Block tracker) | around 7.8M (Blockworks, Aug 3); around 8.16M (Solana Compass, Sep 20, search snippet only) |
| Validator count | 654 at Alpenglow activation (solana.com) | 666 vote accounts (RPC, 2026-11-18) |
| Samsung go-live | Nov 2, 2026 (Solana Foundation) | Nov 5 (The Block headline date, search snippet) |

## 13. What holding SOL earns

- Staking: nominal yield around 4.8% end Q3 2026, inflation around 3.6%, real yield around 1.3%; issuance around 98% of
  staker revenue; Jito tips $10.6M in Q3 (Blockworks Q3). Gross check (my calc): 3.552% / 67.2% staked = around 5.3% before
  commission.
- Governance: Solana Governance Proposals (SGPs) live since 2026-07-01; any validator with 100K SOL delegated can propose;
  binding at one-third quorum and two-thirds approval; delegators can override their validator's vote. SGP-001 (process)
  passed, SGP-002 passed 2026-08-28, SGP-003 failed (63%) (Blockworks Q3). Snapshot-style space: not applicable (votes are
  on Solana's own governance platform); not read directly.
- Pending: SIMD-0123 (in-protocol priority-fee sharing with stakers), "expected to ship alongside Alpenglow" per Blockworks;
  status after Alpenglow NOT verified.
- ETFs: Farside lists staking fees per fund (BSOL 6%, VSOL 25%, FSOL 15%, TSOL 10%+, SOEZ 8%, MSOL 5%, GSOL 7%).

## 14. The project's own recent posts (last ~30 days, from solana.com/news; X not read: Chrome extension not connected)

- 2026-11-16 Solana 1.0: dropping -beta. 2026-11-12 Changelog (Agave, Firedancer, Web3.js, Anchor releases). DTCC
  connection (Mike's topic). 2026-11-06 Ecosystem Roundup: October 2026. 2026-11-05 Samsung Wallet USDC live. 2026-11-05 and
  2026-10-29 changelogs. "CoinGecko ... Backed by Solana Foundation" (undated on the list). Community Awards ceremony Nov 13,
  London. Source: https://solana.com/ news block (read 2026-11-18 01:58 UTC).
- October roundup "by the numbers" (project claim): $5B RWA value (record), $60B DEX volume, 14M stablecoin-holding
  addresses, $1B cumulative stablecoin card spending, 200 ms target slots (Oct 9), around 150 ms target finality.

## 15. Peers `[VERIFY]` (CoinGecko `/coins/markets`, read 2026-11-18 01:48 UTC)

| Coin | Price | Mkt cap | Rank | FDV / MC (my calc) | 24h vol / MC (my calc) | From ATH |
|---|---|---|---|---|---|---|
| BTC | $64,413 | $1,295.5B | 1 | 1.00 | 2.6% | -48.9% |
| ETH | $1,807.09 | $220.9B | 2 | 1.00 | 5.5% | -63.5% |
| BNB | $592.82 | $78.0B | 4 | 1.00 | 0.9% | -56.7% |
| XRP | $0.9747 | $61.9B | 6 | 1.57 | 2.6% | -73.3% |
| **SOL** | **$74.37** | **$44.0B** | **7** | **1.08** | **7.2%** | **-74.6%** |
| TRX | $0.3081 | $29.3B | 8 | 1.00 | 1.1% | -28.6% |
| HYPE | $68.79 | $16.4B | 10 | 4.00 | 5.5% | -29.8% |
| ADA | $0.1533 | $5.8B | 18 | 1.20 | 4.1% | -95.0% |
| AVAX | $7.19 | $3.2B | 27 | 1.06 | 5.8% | -95.0% |
| SUI | $0.7278 | $3.0B | 31 | 2.42 | 9.7% | -86.4% |

- SOL market cap = around 20% of ETH's (my calc, 44.0 / 220.9). SOL's drawdown is in line with XRP and ETH, far better than
  ADA / AVAX / SUI.
- Chain fees, trailing 365 days (DefiLlama): Tron $330.5M, Solana $229.8M, Ethereum $173.5M, BSC $158.7M (last 30 days:
  Tron $23.4M, Ethereum $20.2M, Solana $15.0M). https://api.llama.fi/overview/fees (read 2026-11-18 01:54 UTC).
- App fees by chain, last 30 days (DefiLlama, excluding off-chain): Ethereum $432.5M, Solana $326.5M, Hyperliquid $188.2M.

---

## Tabs to open (all returned HTTP 200 on 2026-11-18 02:13 UTC unless noted)

- Price, weekly (we are here + 50w/200w): https://www.tradingview.com/chart/?symbol=COINBASE%3ASOLUSD&interval=1W
- SOL vs ETH: https://www.tradingview.com/chart/?symbol=BINANCE%3ASOLETH&interval=1W
- Overview: https://www.tradingview.com/symbols/SOLUSD/
- US SOL ETF flows: https://farside.co.uk/sol/ and https://sosovalue.com/assets/etf/us-sol-spot (curl 200; WebFetch 403)
- BSOL: https://bitwiseinvestments.com/crypto-funds/bsol
- DefiLlama: https://defillama.com/chain/solana , https://defillama.com/stablecoins/solana , https://defillama.com/dexs/chains
- RWA: https://app.rwa.xyz/networks/solana and the league table https://app.rwa.xyz/networks
- Solana's own: https://solana.com/ (stats block), https://solana.com/data , https://solana.com/upgrades/alpenglow ,
  https://solana.com/news/solana-ecosystem-roundup-october-2026 , https://solana.com/news/solana-1-0-dropping-beta-and-what-comes-next
  (solana.com rate-limits automated reads; fine in a normal browser)
- Uptime: https://status.solana.com/history
- Treasuries: https://www.theblock.co/treasuries/solana-treasuries
- Schwab release (above), Western Union (The Block, above), Blockworks Q3 PDF:
  https://blockworks.com/api/investor-report/solana-token-holder-report-q3-2026/pdf
- Derivatives: https://www.coinglass.com/currencies/SOL (see the CoinGlass notes in longform-discussion.md)

## Checked-list (what could not be read)

- Chrome extension: not connected (X posts, SoSoValue rendered view, Solana X account not read).
- solana.com `/api/databricks/data?days=30|365`: Vercel Security Checkpoint, 429 x4.
- DefiLlama emissions API: 402. DefiLlama app-revenue per-chain breakdown: empty in the overview response.
- CoinGecko `market_chart/range`: no `prices` key (key required); 2022 low taken from Yahoo instead.
- Grayscale GSOL page: 429. Solana Compass article: Cloudflare 403.
- Not primary-verified (secondary or one report only): E*Trade SOL (Jul 2026), Open USD details, "seven of the 29 G-SIBs"
  (Blockworks), BlackRock BRSRV on Solana (Blockworks), Western Union expansion to 40+ countries.
