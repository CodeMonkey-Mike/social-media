# ethereum-rwa — DATA.md

Research dump + chart-source index. Every on-screen number carries a source and is **`[VERIFY]`'d at
render** (these figures move fast — TVL/volume/AUM numbers especially). Gathered via web search 2026-07-31.

---

## ⚡ LIVE RE-VERIFICATION (2026-07-31, read off the real pages during receipt capture)

These are what the sources **actually said** when captured. Where they differ from the research figures below,
**these win** — they were read off the live page, not a summary. Four material drifts:

| # | Figure | Research said | **LIVE (captured)** | Impact |
|---|---|---|---|---|
| 1 | Total onchain RWA | $31-33.5B | **$37.55B** (+3.94% 30d) · rwa.xyz | ✅ **Favorable.** VO's "over 30 billion" still true, and "up more than 400%" is still true (it's now ~650% off the ~$5B base). **Update [C1]'s count-up END VALUE to ~$37.5B.** |
| 2 | BitMine ETH held | 5,777,468 (~5.78M) | **5.54M ETH** ($9.40B, 4.58% of supply), still **#1** by a wide margin · strategicethreserve.xyz | ⚠️ **VO says "5.7 million" — now HIGH vs the live tracker.** The #1-holder and 5%-goal claims are untouched. See ruling below. |
| 3 | ETF weekly net inflow | $196.4M (Jul 14-21) | **$196.4M — EXACT MATCH**, recomputed from the daily rows (58.3+53.9−28.0+36.7+38.0+37.5) · farside.co.uk | ✅ verified. **BUT** the most recent complete week (Jul 24-30) is **−$69.7M, a net OUTFLOW**. See ruling below. |
| 4 | ETHA leading | asserted | **confirmed** — ETHA cumulative 11,446, far ahead of every other fund | ✅ holds regardless of the weekly direction |

**Also confirmed live:** The Block's headline + "$17 billion… up nearly 315% from about $4.1 billion" and its
own "34% of total onchain RWA value" · Robinhood Newsroom release dated **Jul 1, 2026** · Securitize's official
BUIDL page (fund name + BlackRock description; **no AUM shown there** — AUM stays sourced to C6/D2-B) ·
cryptoslate carrying Vitalik's real published line that Ethereum must ensure ETH "continues to accrue value
even in an L2-heavy world" (a real quote on a real page, so R7 needs no fabricated quote card).

### ⚠️ Two rulings needed before VO lock

**A. BitMine 5.7M (VO) vs 5.54M (live tracker).** The receipt R5 will be ON SCREEN showing 5.54M while the VO
says 5.7 million, so a viewer can see the mismatch. Note the tracker's own activity feed lags (latest entry
Jun 7), so 5.54M may itself be stale rather than a real sell-down. Options: (a) leave it, the gap is small and
the claim "#1 holder, goal 5% of supply" is unaffected; (b) cross-check a second tracker and use whichever is
current; (c) crop R5 to the ranking rather than the exact figure. **Persona `verified_claims_only` says update
recorded numbers to current reality wherever they appear — so on-screen text should not restate 5.7M.**

**B. ETF inflows.** The VO says "almost $200 million of net inflows in a single week in July" — that is
**accurate and correctly scoped**, and D4-B carries the explicit "July 14-21" date. But flows have since turned
negative, so an undated "$200M inflows" would read as cherry-picked. **Keep the date visible on every surface**
(VO already scopes it; D4-B and D4-B@end already carry it). No reframe required, but it is Mike's call whether
to acknowledge the turn.

## RWA tokenization market snapshot

| Fact | Value | Source | Note |
|---|---|---|---|
| Total tokenized RWA market (all chains) | ~~$31-33.5B~~ → **$37.55B LIVE** (see the ⚡ block above), up from **~$5B** start of 2025 | rwa.xyz (read live 2026-07-31, the page receipt R1 shows) · research: The Block · Yellow.com · Cryptic | ⚠️ **$37.55B is the shipped figure** — C1, C2-A and C2-B all render "$37B+" to match R1. The old range is superseded, kept only as the research trail |
| Ethereum's tokenized RWA market cap (mainnet only) | **>$17B**, up **~315% YoY** from ~$4.1B | The Block ("Ethereum's tokenized RWA market jumps more than 300% YoY as value tops $17 billion") | mainnet-only figure, smaller than the "Ethereum hosts X% of total" figure below |
| Ethereum's share of total onchain RWA value | **~61-65%** (sources vary: KuCoin says 65%, Yahoo Finance/Cryptic says 61%) | KuCoin · Yahoo Finance · Cryptic | dominant but NOT total — see competitive note below |
| Share of RWA value in Treasury/cash-equivalents | **~80%** of all tokenized RWA value | Yellow.com ("RWA Tokenization Tripled But 80% Of Value Sits In Just One Asset Class") | concentration caveat, worth a line so the "trillions" framing isn't misleading |
| Forecast (NOT a stated fact — voice as a forecast) | Standard Chartered: tokenized RWAs could reach **$2 trillion by 2028**, "vast majority" on Ethereum | search result summary of Standard Chartered estimate | CONDITIONAL language only |

## BlackRock BUIDL (flagship institutional proof point)

| Fact | Value | Source | Note |
|---|---|---|---|
| Launch | March 2024, on Ethereum, via Securitize | multiple | started on Ethereum specifically |
| Chain footprint | Live on **8 chains**: Ethereum, Solana, Polygon, Avalanche, Arbitrum, Optimism, Aptos, BNB Chain | gncrypto.news | shows Ethereum is the base, not the only chain |
| Total AUM (all chains) | **~$2.87-2.93B** as of mid-2026 | Altrady · gncrypto.news | two sources close together |
| AUM on Ethereum specifically | **~$1.1B** | gncrypto.news ("BlackRock Tokenized Funds Total $2.93B, Ethereum Holds $1.1B") | Ethereum is the largest single-chain slice but not the majority of the multi-chain total — use carefully |
| Yield / mechanics | $1.00 NAV, ~3.40% 7-day yield | Altrady | money-market fund mechanics (cash + T-bills + repo) |

## Robinhood Chain (the "9Hood chain" spotlight, CH3)

| Fact | Value | Source | Note |
|---|---|---|---|
| What it is | Ethereum Layer-2, built on **Arbitrum** (Orbit stack), **100ms block times**, ETH as native gas token | cryptobriefing · Cobo · docs.robinhood.com/chain | it settles to Ethereum L1 |
| Testnet | Launched **Feb 10, 2026**; **4M transactions** in first week | Yahoo Finance / TradingView | |
| Mainnet | Launched **July 1, 2026** (announced at a London event) | multiple | recent, ~1 month old at time of writing |
| Use case | **Tokenized stocks** (NVDA, GOOG, AAPL, etc.) tradeable **24/7**, usable as DeFi collateral, available via Robinhood Wallet in **120+ countries** | GNCrypto · DEXTools | |
| Day-one DeFi | Uniswap, Lighter, 1inch, Arcus (dYdX team) live day one | search summary | |
| Momentum (as of ~3 weeks post-mainnet) | **$257.4M TVL**; **$4.5B** DEX volume in the 7-day period ending July 20, 2026 | search summary citing on-chain data | strong early proof point — this is the headline stat for CH3 |
| ⚠️ Fee-capture nuance — DO NOT OVERCLAIM | Of **$816K** cumulative chain fees through July 13, 2026, only **~$1,538 (0.15%)** flowed to Ethereum L1; **~$80K** to Arbitrum; **~90%** kept by Robinhood. Fusaka's new L2 fee floors exist but are "extremely low" at current economics | Motley Fool, "Robinhood's New Blockchain Has Been a Smash Success. Here's Why That's Bearish for Ethereum." (2026-07-25) | **[VERIFY] load-bearing** — screenplay must frame this as the live asymmetry/opportunity (activity is here, value-accrual mechanics still catching up), never as "Ethereum is already capturing this" |

## Ethereum bull-case subnotes (CH4)

| Fact | Value | Source | Note |
|---|---|---|---|
| ETH staked | **35.5M ETH** staked = **28.91%** of circulating supply; net staking inflow (~90-100K entering vs ~8K exiting) | ainvest.com | supply lock-up angle |
| ETH ETF inflows | **$196.4M** net inflows July 14-21, 2026; BlackRock's ETHA leading | ainvest.com | recent weekly figure, will drift |
| Staking ETFs live | Grayscale Ethereum Staking ETF (first US-listed spot-crypto product enabling staking) + BlackRock iShares Staked Ethereum Trust ETF; ETHE ~$3.5B AUM (April 2026) | Everstake · bitcoinfoundation.org | |
| Corporate ETH treasuries (total) | **7,879,816 ETH** held by public companies as of July 22, 2026 (**~6.59%** of circulating supply) | coinpaper.com / bingx.com trackers | |
| Top corporate holder | **BitMine Immersion Technologies (BMNR)** — 5,777,468 ETH, stated goal of 5% of total ETH supply | coinpaper.com | |
| Other holders | SharpLink Gaming (SBET) 886,725 ETH · The Ether Machine (ETHM) 496,712 ETH · Bit Digital (BTBT) 155,444 ETH · Coinbase (COIN) 151,175 ETH | coinpaper.com | |
| Fusaka upgrade | Adds fee floors for L2 activity, aimed at improving ETH's value accrual as usage moves to L2s | Motley Fool · Fidelity Digital Assets ("The Fusaka Upgrade: Scaling Meets Value Accrual") | ties directly back to the CH3 fee-capture flag — this is "the fix in progress" |
| Context (handle conditionally, not a triumphant claim) | Ethereum mainnet daily gas revenue fell sharply post-Dencun (from $30M+/day historically to roughly $300-500K/day range in 2026) as L2s absorbed activity cheaply; Vitalik Buterin has publicly acknowledged ETH must keep accruing value in an "L2-heavy world" | cryptoslate.com · Yellow.com | this is the honest tension underneath the bull case — the asymmetry, not a hidden weakness to omit |

## Competitive context (verified_claims_only — acknowledge briefly, don't omit)

| Fact | Value | Source | Note |
|---|---|---|---|
| Solana tokenized RWA (overall) | **$3.4-5.77B**, growing fast (+114% QoQ in Q2 2026) | Phemex · gncrypto.news | still far behind Ethereum's $17B+ mainnet RWA figure |
| Solana tokenized EQUITIES specifically | **~95-96% market share** of tokenized-equities trading volume (June 2026: $3.31B on Solana vs $2M on Ethereum, $81M Base, $59.6M BNB Chain) | The Coin Republic · gncrypto.news · SpotedCrypto | genuine Solana lead in this ONE narrow sub-segment (retail meme-stock trading), not overall RWA dominance — say this plainly rather than hide it, then pivot to Ethereum's institutional/Treasury base as the larger and stickier prize |
| BNB Chain | ~12-13% of tokenized asset market, ~$3.4B active value | search summary | smaller, retail-driven |

## CHART-SOURCE INDEX (animated data charts — build per `skills/charts.md`)

Build mode: **code** = animated Remotion component (bars grow / numbers count up / line draws), numbers
pixel-exact, never from an image model.

| ID | Chart | Suggested beat | Data | Build |
|---|---|---|---|---|
| **C1** | **RWA market growth** — line draws ~$5B (Jan 2025) → **$37.5B+** (Jul 2026) | CH1 hook | $5B → **$37.55B** (live, rwa.xyz). Axis domain $0-$40B. **"MORE THAN +400%" pill retained** (VO says it, and it holds as a floor; the plotted rise is ~651%) | code ✅ BUILT |
| **C2** | **Ethereum's dominance share** — bar/donut, Ethereum ~61-65% vs the rest | CH1 or CH2 | ~61-65% Ethereum, remainder split BNB/Solana/other | code |
| **C3** | **Robinhood Chain momentum** — count-up TVL $257.4M + $4.5B 7-day DEX volume since July 1 2026 mainnet | CH3 | $257.4M TVL, $4.5B/7d volume | code (use Robinhood brand neon-green/yellow per `feedback_robinhood_coin_color`, never Kaspa teal) |
| **C4** | **ETH locked up** — stacked bar: 28.91% staked + 6.59% corporate treasury = ~35% of supply not liquid | CH4 | 28.91% + 6.59% | code |
| C5 (optional) | **ETH ETF inflows trend** — recent weekly inflow figure as a smaller supporting stat, not a full chart if runtime is tight (5-min video) | CH4 | $196.4M (Jul 14-21 2026) | code, only if room |

_Diagrams (mechanism explainers, not charts, Convention 4): a simple real-world-asset -> issuer ->
smart-contract -> tradeable-token flow for CH2, and a Robinhood -> Robinhood Chain (Arbitrum L2) ->
Ethereum L1 settlement diagram for CH3, both tracked in BROLL-PLAN.md once the screenplay locks._
