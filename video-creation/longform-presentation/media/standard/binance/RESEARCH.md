# RESEARCH: The Binance hack (Oct 2026) + the North Korea connection

Compiled 2026-10-31 (UTC ~19:00). Every source below was read on **2026-10-31**. Each fact cites a source key `[Sxx]`; the key list (URL + read date) is at the bottom.
Rules: "single-source" = only one non-primary source found. "NOT FOUND" = searched, nothing reliable. Where sources disagree, both are given.
Times are UTC unless marked ET. On 2026-10-29 US Eastern was EDT, so ET = UTC minus 4 h (4:05 pm ET = 20:05 UTC).
This is a fast-moving story: Binance's own root-cause report is NOT published yet, and the FBI has NOT formally attributed it.

---

## TOPIC 1: THE BINANCE HACK (29 Oct 2026)

### 1.1 Headline numbers
| Item | Figure | Source |
|---|---|---|
| Date | Thursday 29 Oct 2026 | [S01] [S03] [S05] |
| Start | ~20:05 UTC (4:05 pm ET), first tx on XRP Ledger | [S01] [S03] [S10] |
| Start (alt.) | "about 4:20 p.m. ET" (= 20:20 UTC, the BTC + ETH legs) | [S02] |
| Binance estimate | ~$6.3B, "may continue to increase" | [S05] [S12] |
| TRM Labs | $6.36B at time of each transfer (~$6.23B at later prices) | [S01] |
| Chainalysis | first $5.912B, later ~$6.4B | [S02] [S04] |
| Elliptic | $6.43B | [S03] |
| Speed | "most of the theft occurred in about 20 minutes starting 20:05 UTC" | [S01] [S06] [S12] |
| Full window | 20:05 to 23:56 UTC (last ETH sweep), plus a second wave ~23:05 on Avalanche + Polygon | [S01] [S03] |
| Chains hit | TRM: 10 (XRPL, ETH, BTC, Tron, Solana, Arbitrum, Optimism, Base, Avalanche, Polygon). Elliptic: 11 (adds NEAR) | [S01] [S03] |
| vs Bybit | "more than four times" Bybit's $1.46B (Feb 2025) | [S03] [S06] |
| vs all thefts | Elliptic: "almost certainly the single largest known theft of any kind"; prior record cited = Saddam Hussein's ~$1B from Iraq's central bank (2003), so 6x larger | [S03] |
| Share of Binance assets | ~4% of ~$144B platform assets (DefiLlama, pre-hack) | [S11] |

### 1.2 What was taken, by chain (TRM, as of 30 Oct 00:30 UTC) [S01], cross-checked [S03] [S20]
- Ethereum: ~$3.79B (Elliptic $3.80B, 186 tokens): 200,630 ETH + 185 other tokens incl. 1.875B USDT, 823M USDC, 88.5M RLUSD.
- Bitcoin: 18,270 BTC (~$1.47B TRM; $1.48B Elliptic).
- Tron: 612.7M USDT + 46.4M TRX (~$628M).
- XRP Ledger: 233.46M XRP (~$296M).
- Solana: 970,500 SOL (~$96M).
- Arbitrum + Optimism + Base: ~$39M (incl. 74.6M ARB).
- Avalanche ~$28M. Polygon ~$10M.
- Elliptic: four assets = 74% of the theft (USDT on ETH, BTC, USDC, USDT on Tron). [S03]
- Elliptic excludes a further $169M that left Binance AFTER withdrawals were suspended (went to long-established addresses not linked to the attacker). [S03]

### 1.3 Timeline (UTC)
- 28 Oct (morning): attacker operator wallet funded by three small Tornado Cash withdrawals (Elliptic: three 0.1 ETH). [S01] [S03]
- Early 29 Oct: attack code deployed and tested on two wallets; final version rehearsed on a third wallet; ~4 h later installed on a Binance hot wallet. [S01] Elliptic: sweeper contract deployed 15:59 UTC. [S03] Wikipedia: preparation "at least 36 hours" ahead (single-source, secondary). [S20]
- 20:05 to 20:09: five Binance XRP wallets send 233.46M XRP to one attacker address. [S01] [S03]
- After 20:10: Solana, Optimism wallets drained. [S01]
- 20:20: Binance BTC hot wallet sends 18,270 BTC to attacker; same moment, ONE Ethereum tx carrying 50 EIP-7702 authorizations (signed with the "Binance 14" hot-wallet key) is submitted. [S01] [S03]
- ~20:22: Tron hot wallet sends 612.7M USDT + 46.4M TRX. [S01]
- ~20:23/20:24: Binance 14 swept: 167,464 ETH + 63 tokens incl. ~1.6B USDT; ~$2.53B (two-thirds of ETH losses) in ONE transaction, 3 min 24 s after the delegation. [S01] [S03]
- Further ETH sweeps: 20:41, 20:59, 21:04, 21:44, 22:39, 23:56. [S01]
- 21:01: Tether freezes 971.1M USDT in main receiving wallet (Elliptic: 37 min after USDT arrived; Tether then froze four more addresses within 17 min). [S01] [S03]
- 21:04: Circle freezes 823M USDC. [S01] [S03]
- ~20:58 to 21:01: attacker deposits 60M USDT on Aave, borrows 19,762 WETH (~$44.6M); Aave freezes markets ~22:32 (Cointelegraph times). [S04]
- 22:01: Ripple freezes the wallet holding 40.5M RLUSD. [S01]
- 22:10 / 22:26: World Liberty Financial freezes 27.8M USD1 in main receiving wallet, then USD1 in the compromised Binance hot wallet. [S01] Cointelegraph: $27M USD1 + $2M WLFI, with BitGo. [S04]
- 22:32 (Cointelegraph): Binance says it will resume withdrawals once the "security issue" is resolved (withdrawals paused). [S04]
- 23:05: second wave on Avalanche + Polygon. [S01]
- 23:35: Binance: $2.54B verified frozen (rejects circulating $1.8B figure). [S01] [S04]
- 30 Oct 00:07: Binance suspends deposits + Binance Alpha trading; pledges to "cover all losses". [S04]
- 30 Oct 00:08: Arbitrum Security Council forces two transfers out of the attacker's Arbitrum wallet (8,426 ETH + 74.6M ARB, ~$30.5M). [S01] [S04]
- 30 Oct 00:52: Binance: frozen now $3B. [S04]
- 30 Oct 02:25: Binance: initial investigation points to a compromised DevOps engineer's laptop -> service container -> unauthorized withdrawals; no evidence of private-key leak. [S04]
- 30 Oct 04:17: withdrawals stay paused; resumption expected within 48 h; deposits operating normally. [S04]
- 30 Oct 05:01: Chainalysis CEO Jonathan Levin: $6.4B, links to TraderTraitor; TRM attributes with "high confidence". [S04]
- 30 Oct 06:36: attacker token sales stop. [S03]
- 30 Oct 07:37: Teng: "a more complex attack process", not a single "one-click" action. [S04]
- 30 Oct 08:37: Binance "Security Incident Update #2": "additional points of breach"; on track to resume withdrawals in 45 h. [S04] [S13]
- 30 Oct 10:09: Binance: set aside >$6.34B of company funds; $5B already held in the same tokens stolen. [S04]
- 30 Oct 11:00: Co-CEO Yi He: buying the stolen altcoins via OTC deals + exchanges. [S04]
- 30 Oct 12:41: Teng: "self-destruct mechanism" destroyed tools + traces; EIP-7702 delegation "did not pass through our normal approval controls". [S04] [S03]
- 30 Oct 14:34: Teng: withdrawals targeted within 40 h, before Sunday; full Proof of Reserves by Monday. [S04]
- 31 Oct 12:03 pm EDT (CNBC): Binance says up to 90% of the ~$6.3B is now covered (backed), remaining 10% = less-liquid tokens outside its top 10; "next milestone" = withdrawals by Sunday 1 Nov, subject to security checks. [S14]
- 31 Oct: Optimism governance moves 44M OP (~$5M) out of attacker reach. [S03]
- STATUS AT WRITING (2026-10-31): withdrawals NOT reopened. Planned phased restart Sun 1 Nov; Proof of Reserves due Mon 2 Nov. [S14] [S15] [S20]

Note: Cointelegraph live-blog times [S04] are as the live blog gives them; they line up with TRM's UTC times where events overlap (e.g. Binance $2.54B at 23:35 TRM vs 11:35 pm CT).

### 1.4 How they got in (what is known vs claimed)
- Binance initial account (30 Oct): compromised DevOps engineer's laptop, access to a service container, unauthorized withdrawals; "no evidence" of wallet private-key leak. [S04] [S06] [S11]
- Binance Update #2 (30 Oct): "the subsequent investigation has uncovered additional points of breach". [S13] [S06]
- Teng: "was not carried out by one person" (as quoted by Elliptic) [S03]; "a more complex attack process", not a "one-click" action [S04]; no individual held responsible [S04]; attackers used "a self-destruct mechanism" to wipe tooling and traces [S03] [S04] [S06]; Korea Times: "malicious software designed to erase traces" and "manipulated a transaction-approval system" [S16].
- THE ETHEREUM FEATURE = **EIP-7702** (shipped in the Pectra upgrade, May 2025). Exactly: [S01] [S03] [S06]
  - EIP-7702 lets a normal wallet (EOA) sign an "authorization" that delegates its code to a smart contract, so the wallet then runs that contract's logic.
  - The attacker obtained **50 pre-signed authorizations**, each signed with the Binance 14 hot-wallet key, each pointing to an attacker-controlled **"sweeper" contract**, covering **50 consecutive nonces** so one would be valid whenever submitted. All 50 rode in ONE transaction at 20:20 UTC.
  - Once delegated, the attacker simply called the wallet and it swept itself. The delegation persisted, so later deposits could be swept with no new signatures (hence the six follow-up sweeps).
  - Binance 14 was also owner/executor of a separate Binance smart account; the attacker used that right to pull 823M USDC.
  - Other chains: ordinary signed transfers, NOT EIP-7702. [S01] [S02]
  - NOT a Safe/multisig exploit and NOT a delegatecall bug in a Binance contract: TRM and Elliptic describe Binance's own signing infrastructure signing on the attacker's behalf ("key misuse", not key theft: Blockaid). [S01] [S03] [S04] TRM: points to compromise of Binance's signing system, "not an Ethereum flaw". [S06] CFTC chair: exploit did not break Ethereum or its smart contracts. [S07]
  - Wikipedia calls EIP-7702 a "multi-signature protocol": that is WRONG; do not repeat. [S20]
- Dissent on "no keys leaked": Mark Karpeles (ex-Mt. Gox CEO) told Reuters attackers probably accessed keys for at least two wallets (single-source via Al Jazeera). [S05]

### 1.5 Frozen / burned / clawed back
- Binance: ~$3B frozen with partners. [S04] [S06] [S11]
- Elliptic verified: $2.85B = 44% of the theft, almost all USDT + USDC; stablecoins were $3.46B of the theft and 94% of frozen funds. [S03]
- Chainalysis: ~$2.8B. [S02] TRM: ~$2.7B (~42%). [S01] [S21]
- Tether: TRM ~1.77B USDT; CEO Paolo Ardoino: "more than $1.567 billion"; CZ cited $971M (first wallet). [S01] [S04] [S11] Also froze tokenized gold (XAUt). [S03]
- Circle: ~823M to 825M USDC; CEO Jeremy Allaire: "more than $800 million". [S01] [S04]
- Ripple (RLUSD): TRM confirms only 40.5M RLUSD on-chain (of 88.5M stolen; 48M sold before freeze). Binance co-CEO said ~$200M was stopped; CoinDesk/Compass Point: "about $200 million". CONFLICT. [S01] [S08]
- World Liberty Financial (USD1): 27.8M USD1 (+ ~$2M WLFI per Cointelegraph). [S01] [S04]
- Also froze: Paxos, First Digital (FDUSD), Binance (WBETH). [S03] [S04]
- Arbitrum Security Council: ~$30.5M (8,425/8,426 ETH + 74.6M ARB). Optimism governance: 44M OP (~$5M). Only Arbitrum + Optimism "fully secured" via governance. [S01] [S03] [S04]
- Nothing frozen on Bitcoin, XRPL, Solana or NEAR (no issuer). [S03]
- Aave froze markets (blocked activity, seized nothing), lifted the freeze 30 Oct ~13:57. [S03] [S04]
- **Beam**: Beam Foundation burned **984.249M BEAM** held by the hacker (~$3.37M); BEAM +45.2% in 24 h. Source = news aggregators summarizing BeInCrypto (single-source, secondary; no Beam Foundation post or on-chain record found). The "within 1 hour" timing: NOT FOUND. [S17]

### 1.6 Where the stolen money is now
- BTC: 18,270 BTC split into **19 addresses, mostly 1,000 BTC each**; none has reached a service yet; worth ~$1.41B. [S03] TRM: peel into 1,000 BTC and 100 BTC outputs in the same block. [S01]
- Attacker still holds >420,000 ETH + 18,270 BTC, ~$2.4B (TRM); Elliptic: ~$3.21B non-freezable incl. 519,104 ETH ($1.16B), 233M XRP, ~475M TRX; XRP/SOL/NEAR worth ~$437M unmoved. Decrypt: "over $3 billion". CONFLICT on size (timing differs). [S01] [S03] [S06]
- Pre-freeze conversion: ~$786M of stablecoins swapped to ETH + TRX. 434M USDT -> 160,451 ETH via Uniswap, 1inch, market makers at implied losses of 12% to 26%. 234M USDT -> 638M TRX on SunSwap. ~150 other tokens dumped for ETH. [S03] TRM: 325M USDT -> ~122,300 ETH at an implied ~$2,650/ETH vs ~$2,300 market (>10% discount); 300M USDT supplied to JustLend. [S01]
- Automation: Chainalysis "thousands of transactions in a short period, which suggests automation"; addresses first receive exactly 1 TRX; "never-seen-before laundering patterns". [S02] [S04] Elliptic: main Tron laundering wallet made 546 TRX transfers since early 30 Oct, median gap 96 s; LINK sold in 89 pieces, PEPE in 94 (~36 s apart); new wallets funded with exactly 0.5 ETH; cannot tell if AI agents are involved. [S03]
- ZachXBT: funds arrived via THORChain and were commingled with Bitget-exploit proceeds at one address. [S04]

### 1.7 Attribution
- TRM Labs: TraderTraitor (North Korea), "high confidence", "robust on and off-chain intelligence"; same playbook as Bybit (Feb 2025) and KelpDAO (Apr 2026): small Tornado Cash funding, long staging, pre-obtained signatures fired in one burst. [S01]
- Chainalysis: TraderTraitor; key link = on-chain commingling with funds from last month's Bitget theft. [S02]
- Elliptic: "likely" TraderTraitor, NOT certain; shared services with TraderTraitor thefts from BigONE, WOO X, AFX; cautions: small Bitget overlap, laundering networks serve many clients, slow stablecoin conversion atypical. [S03]
- ZachXBT: Lazarus "likely attacker". [S11]
- Binance (Teng): investigation "has not attributed responsibility to any individual". [S03] [S05]
- **FBI**: only "aware of the incident" and "engaged with relevant public and private partners". NO PSA and NO formal attribution found as of 2026-10-31 (for Bybit the FBI attributed within 5 days). [S03] [S18] Secret Service also involved (declined comment to Decrypt; Wikipedia says working to track/freeze/recover). [S06] [S20] One outlet (wltreport) claims the FBI named NK: unsupported, do not use. [S18]
- North Korea routinely denies; its missions did not respond. [S16]

### 1.8 Binance's money response
- Reserved **>$6.34B of company funds**; ~$5B already held in the stolen tokens (BTC, ETH, BNB, USDC, USDT); rest bought on market + OTC. [S04] [S06]
- Funding: partial SAFU (Secure Asset Fund for Users), part of the Futures insurance fund, corporate treasury. [S14] SAFU = ~$1B, held entirely in BTC, set up 2018; the theft is >6x SAFU. [S05] [S11]
- 31 Oct: up to 90% covered; BTC, ETH, USDT, BNB, SOL, USDC, XRP, USD1, RLUSD, ZEC "fully backed 100%". CNBC: this does NOT mean 90% was recovered from the attacker. [S14]
- Binance quote: "Binance will absorb the financial impact of these stolen funds, not our users." [S07b] [S20]
- Teng: "We NEVER use any customer funds, so they are not impacted." [S16]
- Context: Binance 335M registered users, ~$162.8B assets under custody (2025 annual report). [S16]

### 1.9 Market + reactions
- DefiLlama Binance CEX assets (API, daily snapshots 00:00 UTC): 28 Oct $143.42B, 29 Oct $144.90B, **30 Oct $133.21B**, 31 Oct $134.61B, live 31 Oct 17:18 UTC **$134.84B**. Drop ~$11.7B (stolen funds + market price fall + any outflows; DefiLlama counts public wallets). [S19]
- BNB (CoinGecko hourly): $744.1 at 29 Oct 20:00 UTC (pre-hack) -> $707.6 at 31 Oct 19:05 UTC = **-4.9%**; low ~$696 on 30 Oct. Market cap **$93.0B** (31 Oct 19:05 UTC). [S22] CoinDesk: BNB fell ~8% to ~$707 on the night; Cointelegraph: -8% to ~$693. [S04] [S11]
- BTC six-week low $76,368; ETH two-month low $2,178. [S05] [S08] >$1.3B leveraged positions liquidated (Decrypt). [S06]
- Coinbase + Strategy shares fell ~12% Friday, Robinhood ~9% (CoinDesk). Al Jazeera: Coinbase -4.8%. CONFLICT (different time windows). [S08] [S05]
- **CFTC Chairman Michael Selig** (CNBC, 30 Oct; Decrypt): hack "proves our exact point"; "these are unregulated offshore exchanges, and they don't have the same sorts of safeguards"; flaw "introduced from someone's laptop"; on-chain tracing "gives regulators a lot of potential to be really cop on the beat here"; pitched a "federal option" for offshore venues to register with the CFTC. [S07]
- **CoinDesk (30 Oct): three Wall Street firms say buy the weakness:** Cantor Fitzgerald (Ramsey El-Assal: "We would be buyers on weakness", "this is painful, but it is not 2022"); TD Cowen (Lance Vitanza: "We do not stop using dollars when a bank is robbed"); Compass Point (Ed Engel, Michael Donovan: "Binance has more than enough liquidity to cover the hole"). [S08]
- **CZ on Mt. Gox** (X post): "$6.3 billion is the biggest in USD terms, but not in BTC terms. MtGox was 650,000 BTC!"; argues % of BTC supply matters for market impact, and that here only the platform is the victim. [S09] US DOJ (June 2023) put Mt. Gox at ~647,000 BTC. [S09b] CZ's ">5% of supply" framing reported by aggregators (single-source). [S09b]
- CZ (as shareholder) expects all user funds fully covered. [S11]
- Trump said 30 Oct he was reviewing the hack (single-source, secondary). [S07b]
- Abu Dhabi regulator (Binance's main licence) "engaging closely". [S16]
- Wintermute exposure "less than 20%" of net equity; GSR "less than 5%". [S04]
- Same day, Polymarket had an unrelated third-party breach (<$3M). [S11]

### 1.10 Scam / phishing warnings
- McAfee (30 Oct): Binance has announced NO claims process, so any "compensation form" or "hack victim airdrop" is likely fraud. [S23]
- Security vendors warn of fake support, fake refund/recovery services, false "withdrawals reopened" messages; any page asking for a wallet signature, fee or seed phrase to "release" a refund is fake. Binance never asks for 2FA codes or recovery phrase; real Binance emails show your anti-phishing code. [S23]

### 1.11 Video claims check ("Binance Hack: Bigger Than Told", Bitcoin Strategy, 2026-10-31)
| Claim in video | Verdict |
|---|---|
| "Thursday evening" | VERIFIED: Thu 29 Oct, 20:05 UTC (4:05 pm ET; evening in Europe/Asia). [S01] |
| ~$6.3B | VERIFIED (Binance). TRM $6.36B, Chainalysis/Elliptic ~$6.4B. |
| "under 3 hours" | NOT MATCHED: sweeps ran 20:05 to 23:56 UTC (~3 h 51 m). Bulk in ~20 min. [S01] [S03] |
| "most in the first 14 minutes" | NOT VERIFIED. Sources say ~20 min; two-thirds of ETH losses left at ~20:24 (19 min in). [S01] [S03] |
| >4x Bybit | VERIFIED. [S03] |
| Halted withdrawals same night, reopen before Sunday, PoR Monday | VERIFIED. Not reopened as of 31 Oct. [S03] [S04] [S14] |
| Laptop -> "more points of breach", complex, not one person/one click | VERIFIED. [S03] [S04] [S13] |
| Self-destruct tool | VERIFIED (Teng). [S03] [S04] |
| Ethereum feature bypassing approval checks | VERIFIED = EIP-7702 delegation, 50 pre-signed authorizations. [S01] [S03] |
| No wallet keys leaked | Binance CLAIM; Karpeles disputes. [S05] |
| BTC + Tron stolen | VERIFIED (also XRP, SOL, etc.). [S01] |
| ~$3B frozen: Tether, Circle, Ripple, WLFI | VERIFIED (independent tallies $2.7B to $2.85B). |
| Beam burned all stolen BEAM within 1 hour | Burn single-source secondary; "1 hour" NOT FOUND. [S17] |
| ~18,000 BTC in 19 wallets, unmoved, ~$1.4B | VERIFIED: 18,270 BTC, 19 addresses, no service reached, $1.41B (Elliptic). [S03] |
| Rest mostly ETH, thousands of automated transfers (Chainalysis) | VERIFIED. [S02] |
| North Korea per tracing firms; FBI involved | VERIFIED: TRM, Chainalysis, Elliptic (likely). FBI involved, no attribution yet. |
| $6.34B reserved, ~$5B in stolen tokens, rest bought market/OTC | VERIFIED. [S04] [S06] |
| DefiLlama ~$134-135B vs ~$145B | VERIFIED: $134.84B now vs $144.90B on 29 Oct. [S19] |
| BNB ~-5%, mcap ~$93B | VERIFIED: -4.9%, $93.0B. [S22] |
| CFTC chair (Decrypt) | VERIFIED: Michael Selig. [S07] |
| CoinDesk: 3 Wall St firms "buying opportunity" | VERIFIED: Cantor, TD Cowen, Compass Point. [S08] |
| CZ Mt. Gox ~650,000 BTC | VERIFIED (his post); DOJ figure ~647,000. [S09] [S09b] |

---

## TOPIC 2: THE NORTH KOREA CONNECTION

### 2.1 Who: names for the same machine
- **Lazarus Group** = umbrella name. US Treasury sanctioned Lazarus in 2019 as controlled by North Korea's primary intelligence bureau (the **Reconnaissance General Bureau, RGB**). [S05]
- **TraderTraitor**: originally a US-government codename (CISA/FBI/Treasury joint advisory AA22-108A, 18 Apr 2022) for a North Korean cluster targeting blockchain firms with trojanized crypto apps (JavaScript/Node.js, Windows + macOS) via social engineering. Same advisory lists Lazarus Group, APT38, BlueNoroff, Stardust Chollima. [S24]
- Vendor aliases: **Jade Sleet** (Microsoft), **UNC4899** (Mandiant/Google), TraderTraitor (CISA/FBI). [S25] [S26]
- Tied to the RGB, specifically its "Third Bureau"; called the regime's most prolific crypto-theft unit (secondary, via Hacker News summary). [S26]
- APT38 / BlueNoroff = the financially motivated Lazarus sub-cluster. [S24] [S27]

### 2.2 The biggest DPRK (or suspected) heists
| Date | Victim | Amount | How | Attribution | Source |
|---|---|---|---|---|---|
| 26 Jan 2018 | Coincheck (Japan) | ~$530M to $533M NEM | malware emailed to staff (Mokes, Netwire) | DISPUTED: S. Korea NIS suspected NK; 2019 reporting pointed to Russian-linked malware. No official attribution found. | [S28] |
| 7 May 2019 | **Binance** | 7,000 BTC (~$40.5M) | phishing, viruses; API keys + 2FA codes stolen; one hot wallet (~2% of BTC holdings); covered by SAFU | Attribution to Lazarus: NOT FOUND | [S29] |
| 23 Mar 2022 (found 29 Mar) | Ronin / Axie Infinity | 173,600 ETH + 25.5M USDC; FBI: $620M (Ronin said $625M; The Block $540M at later prices) | fake LinkedIn job, offer PDF -> spyware -> 4 of 9 validators + Axie DAO allowlist = 5th | FBI 14 Apr 2022: Lazarus + APT38; OFAC listed the exploiter address | [S27] [S30] |
| 23/24 Jun 2022 | Harmony Horizon bridge | ~$100M | key compromise | FBI 23 Jan 2023: Lazarus + APT38; $60M+ laundered via Railgun 13 Jan 2023; FBI: funds support ballistic missile + WMD programs | [S31] |
| 6 Oct 2022 | **BNB Chain (BSC Token Hub bridge)** | 2M BNB minted (~$570M face); ~$100M to $110M actually got off-chain | forged proof (IAVL library bug) | NK: only community speculation; no official/forensic attribution FOUND | [S32] |
| 3 Jun 2023 | Atomic Wallet | $35M -> >$100M (Elliptic) | not disclosed | Elliptic, "high confidence" Lazarus (laundering match, Sinbad mixer, Garantex) | [S33] |
| 4 Sep 2023 | Stake.com | ~$41M | hot wallets (ETH, BSC, Polygon) | FBI ~6/7 Sep 2023: Lazarus; FBI said >$200M stolen by DPRK in 2023 so far | [S34] |
| late May 2024 | DMM Bitcoin (Japan) | 4,502.9 BTC, ~$308M (some say $305M) | fake LinkedIn recruiter -> "pre-employment test" Python script on GitHub -> Ginco (wallet vendor) employee -> session cookies -> manipulated transfer | FBI + DC3 + Japan NPA, 23 Dec 2024: TraderTraitor (Jade Sleet, UNC4899) | [S35] |
| 18 Jul 2024 | WazirX (India) | ~$230M to $235M | Safe 4-of-6 multisig; signers approved a malicious implementation upgrade shown as a normal transfer | Elliptic + ZachXBT: Lazarus hallmarks (no official confirmation found) | [S36] |
| 21 Feb 2025 | **Bybit** | ~$1.46B (Elliptic) / ~$1.5B (FBI), ~499,000 ETH | Safe{Wallet} developer Mac infected ~4 Feb (Docker "stock sim" lure), AWS session tokens hijacked to dodge MFA, malicious JS injected 17 Feb, Bybit signers approved a manipulated tx | FBI PSA 26 Feb 2025: "TraderTraitor"; Mandiant: NK | [S37] [S38] [S03] |
| 1 Apr 2026 | Drift Protocol | $285M | 31 withdrawals in ~12 min; staged from 11 Mar via Tornado Cash | TRM: DPRK | [S39] |
| 18 Apr 2026 | KelpDAO | ~$292M (116,500 rsETH) | single-verifier (1 DVN) LayerZero bridge setup | TRM: DPRK; LayerZero: TraderTraitor; Kelp disputes | [S39] [S40] |
| 24 Sep 2026 | Bitget | $351.6M (later revised ~$390M; outlets $387M-$388M) | backend wallet system breached, spoofed transfer info triggered Bitget's own signing | CEO Gracy Chen: "very likely" NK (IP/VPN overlap); Elliptic: highly likely DPRK | [S41] [S03] |
| 29 Oct 2026 | **Binance** | ~$6.3B to $6.4B | see Topic 1 | TRM/Chainalysis high confidence; Elliptic likely; no government attribution yet | [S01] [S02] [S03] |
Other TraderTraitor thefts named by Elliptic: BigONE, WOO X, AFX (amounts NOT FOUND in sources read). [S03]

### 2.3 Annual + cumulative totals (methodologies differ; do not mix firms in one chart without a label)
- **Chainalysis**: 2023 $660.5M (20 incidents); 2024 $1.34B (47 incidents, 61% of all stolen); 2025 **$2.02B** (+51% YoY, record; DPRK = 76% of all service compromises); cumulative **$6.75B** (lower bound, through 2025). [S42] [S43] 2026: DPRK ~89% of reported hack losses through 29 Oct; average $185.65M per suspected DPRK hack (vs 15% share and $50.65M avg in 2021) (Chainalysis X post via crypto.news, secondary). [S44]
  - Note: a Chainalysis mid-2025 report said >$2.17B stolen in H1 2025, higher than its full-year $2.02B (different methodology/scope). CONFLICT. [S43]
- **Elliptic**: 2025 >$2B by Oct 2025 (record; previous record 2022 $1.35B); cumulative >$6B since 2017 (Oct 2025); >$6.5B and 2026 >$1B BEFORE Binance; Binance "would almost double" the regime's total. [S45] [S03]
- **TRM Labs** (30 Oct 2026): cumulative **~$12.8B across 100 incidents since 2017**; **2026 YTD $7.4B**; DPRK = 85% of 2026 hack value (45% excluding Binance); share 63% in 2025, 39% in 2024, 7% in 2020. Total 2026 hack losses $8.7B (record). [S21] TRM's April 2026 post gave 2025 share as 64%: minor CONFLICT. [S39] TRM 2026 Crypto Crime Report: hackers (all) stole $2.87B in ~150 attacks in 2025. [S05] [S16]
- **MSMT** (11-nation Multilateral Sanctions Monitoring Team, Oct 2025): at least $1.65B stolen Jan to Sep 2025 (incl. Bybit); 2024 figures reported as $1.2B (SCMP) vs $1.9B (Australian gov on 2nd report). CONFLICT. [S46]
- **South Korea NIS** (Dec 2022): ~1.5 trillion won (~$1.1B) over five years. [S05]

### 2.4 Where the money goes
- UN Panel of Experts (report dated 7 Mar 2024): investigating **58** suspected DPRK attacks on crypto firms 2017-2023 worth ~**$3B**; cyber activity generates ~**50%** of North Korea's foreign-currency income; a member state said ~**40%** of WMD programs are funded by illicit cyber means (a government claim, not the panel's own verified number). [S47]
- The Panel no longer exists: the MSMT was created after Russia vetoed renewal of the UN panel's mandate (2024). [S46]
- MSMT: funds go to "unlawful development of its WMD and ballistic missile programs"; officials used stablecoins for military-equipment and raw-material (copper) deals. [S46]
- FBI (Jan 2023, Harmony): stolen funds support ballistic missile + WMD programs. [S31]
- US Treasury (Mar 2025, Tornado Cash delisting): remains "deeply concerned" about DPRK crypto hacks. [S48]

### 2.5 How they get in
- Fake job offers / fake recruiters on LinkedIn: Ronin (offer PDF carrying spyware) [S30]; DMM via Ginco (fake "pre-employment test" on GitHub) [S35]; Chainalysis: operators pose as recruiters for web3 + AI firms, use fake "technical screens" to harvest credentials [S42]; Google/UNC4899: fake freelance work over LinkedIn + Telegram, then cloud (AWS/GCP) abuse [S26].
- Trojanized apps and malicious code: TraderTraitor JS/Node.js apps (AA22-108A) [S24]; Jade Sleet GitHub repo invitations + malicious npm packages (Microsoft/GitHub, Jul 2023) [S25].
- Supply chain: Bybit via Safe{Wallet} developer's machine + AWS tokens [S38]; DMM via wallet vendor Ginco [S35].
- DPRK IT workers inside companies: DOJ (30 Jun 2025): workers got jobs at >100 US companies; 4 NK nationals indicted for stealing + laundering >$900,000 in crypto from an Atlanta blockchain startup and another firm; searches of 29 laptop farms in 16 states. Chainalysis calls IT-worker embedding "one of DPRK's principal attack vectors". [S49] [S42]
- Hijacking the victim's own signing system (2025-2026 pattern): Bybit, Bitget, Binance; TRM: infrastructure attacks (keys, servers, signing systems) = ~76% of DPRK value before Binance, 88% with it; code exploits only ~1% of value. [S21] [S41]
- Anti-forensics: Binance attackers' self-destruct tooling. [S03] [S04]

### 2.6 How they launder
- Mixers: Tornado Cash (OFAC sanctioned 8 Aug 2022, citing >$455M laundered for Lazarus; delisted 21 Mar 2025 after Van Loon v. Treasury) [S48]; Sinbad.io (sanctioned 29 Nov 2023, successor to Blender.io) [S48]; Railgun (Harmony) [S31]; Wasabi (Bybit) [S50].
- Cross-chain swaps / bridges: THORChain. Bybit: ~83% of stolen ETH (~$1B) converted to BTC via THORChain; all ETH laundered in ~10 days [S50]; THORChain did >$1B volume in a day after Bybit [S50]. KelpDAO: ETH -> BTC via THORChain, Umbra privacy tool, Chinese intermediaries [S39].
- Chainalysis 2025 pattern: ~45-day multi-wave cycle (days 0-5 layering, 6-10 integration, 20-45 long-tail); heavy Chinese-language OTC / guarantee services; bridges +97% and mixers +100% vs other actors; >60% of volume in transfers under $500K. [S42]
- Sanctioned exchanges: Garantex (Atomic Wallet). [S33]
- Patience: BTC/ETH left sitting. Drift ETH "dormant since the theft" [S39]; Binance's 18,270 BTC not yet at any service [S03]; FBI separately warned TraderTraitor might cash out ~1,580 BTC (~$41M) from older thefts (date of warning not confirmed in source read) [S35].
- Binance case difference: large DEX swaps + lending (Aave, JustLend) rather than Bybit's bridge-heavy route, so far. [S01]

### 2.7 How much has ever been recovered
- Ronin: ~$30M seized Sept 2022 (Chainalysis + FBI), ~10%, "first time ever" DPRK-stolen crypto was seized; Norway later seized ~$5.8M. [S51] [S27]
- Bybit: ~$48.4M recovered + ~$30.5M frozen = ~5%; CEO Ben Zhou earlier: 69% traceable, 28% "gone dark", 4% frozen. Bybit later sued North Korea, the RGB and Lazarus in US court and won a preliminary injunction (2026). [S50b]
- Atomic Wallet: ~$1M frozen. [S33]
- KelpDAO: ~$75M (30,766 ETH) frozen by Arbitrum Security Council. [S39]
- Binance: ~42% to 44% frozen (unusually high because ~$3.46B was freezable stablecoins). [S01] [S03]
- IT-worker cases: $7.7M DOJ forfeiture action; ~$5.4M blocklisted by Tether. [S21]
- Aggregate % of all DPRK-stolen crypto ever recovered: NOT FOUND.

---

## TOP 25 FACTS FOR THE DECK
1. ~$6.3B (Binance) / $6.36B (TRM) / ~$6.4B (Chainalysis, Elliptic) stolen from Binance hot wallets on Thu 29 Oct 2026. [S01] [S02] [S03]
2. Largest crypto theft ever, more than 4x Bybit's $1.46B (Feb 2025). [S03]
3. Elliptic: "almost certainly the single largest known theft of any kind", 6x Saddam's $1B 2003 central-bank haul. [S03]
4. Most of it left in about 20 minutes from 20:05 UTC, across 10 blockchains. [S01]
5. One Ethereum transaction moved ~$2.53B, two-thirds of the ETH losses. [S03]
6. The key trick: 50 pre-signed EIP-7702 authorizations turned Binance's own hot wallet into the thief's "sweeper". [S01]
7. Teng: that delegation "did not pass through our normal approval controls". [S03] [S04]
8. Attackers used a "self-destruct mechanism" to wipe their tools and traces. [S03] [S04]
9. Story changed: one DevOps laptop on 30 Oct morning, "additional points of breach" hours later. [S04] [S13]
10. 18,270 BTC (~$1.41B) split into 19 addresses, mostly 1,000 BTC each, none cashed out yet. [S03]
11. ~$3B frozen (Binance); Elliptic verified $2.85B = 44%, 94% of it stablecoins. [S03]
12. Tether froze ~1.77B USDT, Circle ~823M USDC within about an hour of the theft. [S01]
13. Nothing on Bitcoin, XRP, Solana or NEAR can be frozen: no issuer. [S03]
14. Laundering is automated: one Tron wallet made 546 transfers, median 96 s apart. [S03]
15. TRM and Chainalysis: North Korea's TraderTraitor, "high confidence"; FBI has not attributed yet. [S01] [S02] [S18]
16. Binance set aside >$6.34B; $5B was already in the same tokens; says 90% covered by 31 Oct. [S04] [S14]
17. Binance assets on DefiLlama: $144.9B (29 Oct) -> $134.8B (31 Oct). [S19]
18. BNB -4.9% since the hack, market cap $93.0B. [S22]
19. CFTC chair Michael Selig: hack "proves our exact point" on offshore exchanges. [S07]
20. Cantor, TD Cowen, Compass Point told clients to buy the dip. [S08]
21. CZ: biggest in dollars, not in BTC: "MtGox was 650,000 BTC!" [S09]
22. TRM: North Korea has now stolen ~$12.8B since 2017, $7.4B of it in 2026 alone. [S21]
23. Chainalysis: DPRK = ~89% of all 2026 crypto hack losses (15% in 2021). [S44]
24. UN panel: cyber theft ~50% of NK foreign-currency income; a member state says ~40% of WMD funding. [S47]
25. Bybit, the previous record: only ~5% ever recovered or frozen. [S50b]

## CONFLICTS / UNCERTAIN
- Total: $6.3B (Binance) vs $6.36B (TRM) vs $5.912B early / $6.4B later (Chainalysis) vs $6.43B (Elliptic). [S01] [S02] [S03]
- Start time: 20:05 UTC / 4:05 pm ET (TRM, Elliptic, Decrypt) vs "about 4:20 pm ET" (Chainalysis; that is the BTC/ETH leg). [S01] [S02] [S06]
- Chains: 10 (TRM) vs 11 incl. NEAR (Elliptic). [S01] [S03]
- Frozen: ~$3B (Binance) vs $2.85B (Elliptic) vs ~$2.8B (Chainalysis) vs ~$2.7B (TRM).
- Ripple RLUSD frozen: 40.5M confirmed on-chain (TRM) vs ~$200M claimed (Binance co-CEO, CoinDesk). [S01] [S08]
- Tether frozen: $971M (first wallet, CZ) vs >$1.567B (Ardoino) vs ~1.77B (TRM tally).
- Attacker's remaining non-freezable holdings: ~$2.4B (TRM) vs ~$3.21B (Elliptic) vs "over $3B" (Decrypt).
- Key leak: Binance says no evidence; Karpeles (via Reuters) thinks keys for 2+ wallets were accessed. [S05]
- Attribution: analytics firms only; Elliptic explicitly "not certain"; FBI silent on attribution; Binance has not attributed. [S03]
- Beam burn: secondary sources only; "within 1 hour" NOT FOUND. [S17]
- Video's "under 3 hours" and "first 14 minutes": NOT supported as stated (3 h 51 m window; ~20 min bulk).
- DPRK annual totals vary by firm (Chainalysis $2.02B for 2025; Elliptic >$2B by Oct 2025; MSMT $1.65B Jan-Sep 2025). Cumulative: Chainalysis $6.75B (through 2025, from 2022 tracking) vs Elliptic >$6.5B pre-Binance vs TRM $12.8B incl. Binance.
- Chainalysis H1 2025 ($2.17B) > full-year 2025 ($2.02B): methodology change.
- Bybit: $1.46B (Elliptic) vs $1.5B (FBI) vs $1.4B (some outlets).
- Ronin: $620M (FBI) vs $625M (Ronin) vs $540M (later prices).
- DMM: $308M vs $305M.
- Coincheck 2018: NK suspected by S. Korea, Russian links reported 2019; no official attribution.
- Binance May 2019 hack: no attribution found. BNB bridge Oct 2022: no attribution found.
- The UN 40% WMD figure is a member-state claim, not the panel's finding.
- Bitget amount: $351.6M (initial) vs ~$390M (revised) vs $387M to $388M (media).
- Wikipedia describes EIP-7702 as "multi-signature": incorrect.

---

## SOURCE KEY (all read 2026-10-31)
- [S01] TRM Labs, "North Korea Steals USD 6.36 Billion From Binance in the Largest Hack in History" (pub 30 Oct 2026, mod 30 Oct 19:41 UTC): https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history
- [S02] Chainalysis, "Binance Hack: Tracing the $6.4 Billion Theft to North Korea" (30 Oct 2026): https://www.chainalysis.com/blog/binance-exploit-latest-findings-and-response/
- [S03] Elliptic, "The largest theft in history: North Korea likely behind the $6.4 billion Binance hack" (30 Oct, upd 31 Oct 05:00 UTC): https://www.elliptic.co/insights/binance-largest-hack-in-history/
- [S04] Cointelegraph live blog, "Binance's Record $6.3B Crypto Hack as It Happened": https://cointelegraph.com/news/live-updates-binance-63b-hack-linked-to-north-koreas-tradertraitor
- [S05] Al Jazeera, "Binance says $6.3bn stolen in biggest crypto heist in history: What we know" (30 Oct 2026; cites Reuters): https://www.aljazeera.com/news/2026/10/30/binance-says-6-3bn-stolen-in-biggest-crypto-heist-in-history-what-we-know
- [S06] Decrypt, "Binance Hack: Everything You Need to Know" (31 Oct 2026): https://decrypt.co/382306/binance-hack-everything-you-need-to-know
- [S07] Decrypt, "Binance Hack Shows Why Offshore Exchanges Need US Oversight, CFTC Chair Says" (30 Oct 2026): https://decrypt.co/382285/binance-hack-why-offshore-exchanges-need-us-oversight-cftc-chair
- [S07b] Crypto Briefing, CFTC Selig / Binance (Trump review; Binance "absorb" quote): https://cryptobriefing.com/cftc-selig-binance-hack-offshore-registration/
- [S08] CoinDesk, "Wall Street analysts urge investors to buy crypto stocks on weakness after $6.3 billion Binance hack" (30 Oct 2026): https://www.coindesk.com/markets/2026/10/30/wall-street-analysts-urge-investors-to-buy-crypto-stocks-on-weakness-after-usd6-3-billion-binance-hack
- [S09] CZ on X (post text via search index; page itself paywalled to fetch): https://x.com/cz_binance/status/2116198836729520420
- [S09b] Tokenpost, CZ Mt. Gox comparison (+ DOJ 647,000 BTC via search summary): https://www.tokenpost.com/news/technology/44972
- [S10] Wikipedia timeline cross-check: see [S20]
- [S11] CoinDesk, "Binance loses over $6 billion in the largest crypto hack to date" (29 Oct, upd 30 Oct 00:16 EDT): https://www.coindesk.com/business/2026/10/29/potential-multi-billion-binance-hack-hitting-crypto-markets
- [S12] Korea Times / Al Jazeera "20 minutes" (see [S16], [S05])
- [S13] Binance on X, "Security Incident Update #2 (2026-10-30)" (text via search index): https://x.com/binance/status/2116258356109496479
- [S14] CNBC, "Binance says 90% of $6.3 billion hack losses are now covered, plans to resume withdrawals Sunday" (31 Oct 2026, 12:03 pm EDT): https://www.cnbc.com/2026/10/31/binance-hack-asset-coverage-withdrawals.html
- [S15] Analytics Insight, phased restart from 1 Nov: https://www.analyticsinsight.net/news/binance-to-resume-withdrawals-sunday-after-usd-63b-hack-as-fbi-investigates
- [S16] Korea Times (Reuters-based), 30 Oct 2026 upd 31 Oct: https://www.koreatimes.co.kr/foreignaffairs/northkorea/20261030/blockchain-analysis-firm-trm-says-north-korea-behind-binance-crypto-theft
- [S17] Beam burn: https://ca.headtopics.com/news/beam-token-rallies-45-2-as-binance-hacker-tokens-burned-89396345 and BeInCrypto/Yahoo summary https://finance.yahoo.com/markets/crypto/articles/did-binance-hack-happen-detailed-120000357.html (Yahoo/BeInCrypto page itself returned 403; content via search index)
- [S18] FBI statement coverage: Cybersecurity Dive https://www.cybersecuritydive.com/news/binance-hack-north-korea-cryptocurrency-theft/873304/ ; Decrypt https://decrypt.co/382268/secret-service-fbi-binance-hack-probe
- [S19] DefiLlama API, Binance CEX assets: https://api.llama.fi/protocol/binance-cex (queried 2026-10-31 ~19:05 UTC)
- [S20] Wikipedia, "2026 Binance hack" (last edited 31 Oct 2026): https://en.wikipedia.org/wiki/2026_Binance_hack
- [S21] TRM Labs, "North Korea Has Stolen USD 12.8 Billion in Crypto, USD 7.4 Billion of It in 2026" (30 Oct 2026): https://www.trmlabs.com/resources/blog/north-korea-has-stolen-usd-128-billion-in-crypto-usd-74-billion-of-it-in-2026
- [S22] CoinGecko API, BNB price/market cap: https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=3 (queried 2026-10-31 ~19:05 UTC)
- [S23] McAfee, "Binance Crypto Heist: How to Protect Your Crypto": https://www.mcafee.com/blogs/security-news/binance-crypto-heist/ ; 2-Spyware: https://www.2-spyware.com/binance-hack-scams-fake-support-compensation
- [S24] CISA/FBI/Treasury AA22-108A (18 Apr 2022): https://www.cisa.gov/ncas/alerts/aa22-108a
- [S25] The Record, GitHub attack attributed to Jade Sleet (Microsoft): https://therecord.media/github-cyberattack-attributed-to-new-north-korean-jade-sleet-group-microsoft
- [S26] The Hacker News, UNC4899 job lures + cloud (Jul 2025): https://thehackernews.com/2025/07/n-korean-hackers-used-job-lures-cloud.html
- [S27] BleepingComputer, FBI links Ronin to NK (Apr 2022): https://www.bleepingcomputer.com/news/security/fbi-links-largest-crypto-hack-ever-to-north-korean-hackers ; Norway seizure: https://www.bankinfosecurity.com/norwegian-authorities-seize-586-million-from-lazarus-group-a-21250
- [S28] Coincheck: Fortune https://fortune.com/2018/01/29/coincheck-japan-nem-hack ; The Block (Russian link) https://www.theblock.co/news/macro/2019-06-17-coincheck-hack-investigation-shows-possible-link-to-russian-cyber-group-report-27577 ; Computing https://www.computing.co.uk/news/3026095/south-korea-investigating-claims-that-north-korea-was-behind-usd533m-coincheck-hack
- [S29] Bloomberg, Binance 7,000 BTC hack (8 May 2019): https://www.bloomberg.com/news/articles/2019-05-08/crypto-exchange-giant-binance-reports-a-hack-of-7-000-bitcoin ; CNBC: https://www.cnbc.com/2019/05/08/binance-bitcoin-hack-over-40-million-of-cryptocurrency-stolen.html
- [S30] The Block, "How a fake job offer took down the world's most popular crypto game" (Jul 2022): https://www.theblock.co/post/156038/how-a-fake-job-offer-took-down-the-worlds-most-popular-crypto-game
- [S31] The Block, FBI confirms Lazarus/APT38 behind Harmony (Jan 2023): https://www.theblock.co/post/204928/fbi-confirms-lazarus-group-and-apt38-were-responsible-for-100-million-bridge-hack
- [S32] BNB bridge: Nansen https://nansen.ai/research/bnb-chains-cross-chain-bridge-exploit-explained ; The Block https://www.theblock.co/post/175437/biance-bnb-chain-is-back-up-after-bridge-exploit
- [S33] Elliptic, Atomic Wallet >$100M: https://hub.elliptic.co/analysis/north-korea-linked-atomic-wallet-heist-tops-100-million ; The Block (Garantex) https://www.theblock.co/post/234465/north-koreas-lazarus-group-remerges-with-new-100-million-crypto-hack
- [S34] The Block, FBI: Lazarus behind $41M Stake theft (7 Sep 2023): https://www.theblock.co/post/249805/fbi-says-north-korea-linked-lazarus-group-was-responsible-for-41-million-theft-on-stake
- [S35] BleepingComputer, FBI links DMM $308M to TraderTraitor (Dec 2024): https://www.bleepingcomputer.com/news/security/fbi-links-north-korean-hackers-to-308-million-crypto-heist
- [S36] WazirX: Wikipedia https://en.wikipedia.org/wiki/2024_WazirX_hack ; Blockworks https://blockworks.com/news/wazirx-says-hack-beyond-our-control ; Rekt https://rekt.news/wazirx-rekt
- [S37] FBI IC3 PSA (26 Feb 2025), Bybit / TraderTraitor (PRIMARY): https://www.ic3.gov/PSA/2025/PSA250226
- [S38] Bybit / Safe post-mortem (Mandiant): Cointelegraph https://cointelegraph.com/news/safe-wallet-releases-bybit-hack-post-mortem ; SecurityWeek https://www.securityweek.com/how-social-engineering-sparked-a-billion-dollar-supply-chain-cryptocurrency-heist/amp/
- [S39] TRM Labs, "North Korea Stole 76% of All Crypto Hack Value in 2026 With Just Two Attacks" (30 Apr 2026): https://www.trmlabs.com/resources/blog/north-korea-stole-76-of-all-crypto-hack-value-in-2026-with-just-two-attacks
- [S40] BeInCrypto, LayerZero ties KelpDAO to TraderTraitor: https://beincrypto.com/layerzero-kelpdao-hack-lazarus-north-korea/
- [S41] CNBC, Bitget $352M (25 Sep 2026): https://www.cnbc.com/2026/09/25/crypto-platform-bitget-suspects-north-korea-in-352-million-hack.html ; Fortune $387M: https://fortune.com/2026/09/25/north-korea-bitget-387-million-crypto-attack/
- [S42] Chainalysis, 2025 crypto hacking report (18 Dec 2025): https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/
- [S43] TechCrunch, Chainalysis 2024 ($1.34B, 47 incidents): https://techcrunch.com/2024/12/19/north-korea-linked-hackers-have-hit-a-new-peak-accounting-for-61of-all-crypto-stolen-in-2024 ; The Block 2025: https://www.theblock.co/post/381841/north-korean-crypto-hacks-escalate-2025
- [S44] crypto.news, Chainalysis 89% (31 Oct 2026), citing https://x.com/chainalysis/status/2116240300486349117 : https://crypto.news/north-korea-crypto-hack-losses-2026-chainalysis/
- [S45] Elliptic, "North Korea's crypto hackers have stolen over $2 billion in 2025" (Oct 2025): https://www.elliptic.co/insights/north-korea-linked-hackers-have-already-stolen-over-2-billion-in-2025/
- [S46] MSMT report coverage: NBC https://www.nbcnews.com/world/asia/north-korea-stolen-billions-cryptocurrency-tech-firm-salaries-rcna239294 ; SCMP https://www.scmp.com/news/asia/east-asia/article/3330294/north-korea-evades-un-sanctions-using-crypto-weapons-raw-materials-report ; Australia UN mission https://unny.embassy.gov.au/unny/260112_MSMT_Second_Report_Launch.html
- [S47] UN Panel of Experts: Korea Times (Feb 2024) https://www.koreatimes.co.kr/foreignaffairs/northkorea/20240210/un-experts-investigating-58-suspected-nk-cyberattacks-valued-at-about-3-bil ; Korea Times (Mar 2024) https://www.koreatimes.co.kr/foreignaffairs/northkorea/20240321/malicious-nk-cyberactivities-account-for-half-of-foreign-currency-income-fund-wmd-programs-un-report ; Bloomberg Law https://news.bloomberglaw.com/crypto/hacks-account-for-half-of-n-korea-foreign-currency-income-un
- [S48] Tornado Cash delisting (Mar 2025): Decrypt https://decrypt.co/311103/us-treasury-lifts-sanctions-tornado-cash ; Venable https://www.venable.com/insights/publications/2025/04/a-legal-whirlwind-settles-treasury-lifts-sanctions ; Sinbad: https://www.sheppard.com/insights/blogs/ofac-sanctions-crypto-mixer-following-allegations-of-laundering-funds-to-north-korea
- [S49] DOJ IT-worker actions (30 Jun 2025): TechCrunch https://techcrunch.com/2025/06/30/us-government-takes-down-major-north-korean-remote-it-workers-operation ; The Record https://therecord.media/doj-raids-laptop-farms-crackdown
- [S50] Bybit laundering: The Block (THORChain, FBI) https://www.theblock.co/post/343855/bybit-hackers-half-the-stolen-eth-bitcoin-fbi-confirms-lazarus ; ITC (all laundered in 10 days) https://itc.ua/en/news/hackers-laundered-all-1-5-billion-stolen-from-bybit-and-helped-thorchain-earn-5-5-million ; The Defiant (THORChain daily record) https://thedefiant.io/news/defi/bybit-hackers-launder-funds-through-thorchain-shattering-daily-volume-record
- [S50b] Bybit recovery + lawsuit: Decrypt https://decrypt.co/375180/bybit-sues-north-korea-over-1-5b-hack-wins-order-freezing-assets ; Decrypt (Zhou traceability) https://decrypt.co/308597/bybit-ceo-critical-week-freeze-funds-hack
- [S51] The Block, Chainalysis + US recover $30M from Ronin (Sep 2022): https://www.theblock.co/post/168663/chainalysis-and-us-law-enforcement-recover-30-million-from-north-korea-linked-ronin-exploit

Sources NOT reachable directly (403/402): Binance and Teng X posts (text taken from search index snippets), DefiLlama web page (used its API instead), BeInCrypto, Cryptotimes. No Binance blog root-cause post exists yet. No FBI PSA on Binance exists yet (searched).
