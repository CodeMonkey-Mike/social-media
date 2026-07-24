# DATA.md — kaspa 30bps (research dump, every number carries a source)

_Compiled 2026-07-23. Video premise: the REAL story behind "Kaspa goes to 30 blocks per second at the end of the year." Target runtime ~5 min._

## 0. The trigger claim (what the influencers said)

Source stream: Crypto Archie, "Bitcoin to $40k Next!? - [Urgent Live]", streamed **2026-06-25**, https://www.youtube.com/live/7OAoMNNS0p8 (segment 53:26-54:33). Speaker: **Krux** (Kaspa-focused YouTuber).

Verbatim claims (from the stream captions):
1. "You got the Takata [= **Toccata**] hard fork that drops on the 30th" (June 30, said 5 days before it activated). "It releases something called Covenant++ and it also adds Silver Script. This adds programmability to the layer."
2. "At the end of this year, we should make a three times faster throughput because currently it's about 10 blocks per second. It'll go to about anywhere between **25 to 40 blocks per second. I just say 30.** And that should increase the throughput to about **15,000 transactions per second** as a proof of work decentralized network."
3. Host (Archie) names the two upgrades: "the Takata and the **Dag Knight**."

Mike's original question: he heard "25 to 40" as an upgrade FROM 25 TO 40 bps. **Mishearing: Krux said 10 bps today, going to a value in the 25-40 range.** Mike also thought the next upgrade was 100 bps and might be called DagKnight. Resolution in §3.

## 1. VERIFIED: the upgrade ladder

| Step | Name | Date / status | What it does | Source |
|---|---|---|---|---|
| 1 → 10 bps | **Crescendo** hard fork | **2025-05-05, live** | 1 bps → **10 bps**, 100 ms block interval | [ourcryptotalk roadmap](https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027), [KASPAglobal on X](https://x.com/KASPAglobal/status/2010025351787716952) |
| programmability | **Toccata** (the "Covenant hardfork") | **ACTIVATED 2026-06-30** on mainnet at DAA score 474,165,565; rusty-kaspa **v2.0.0** | Native assets (KRC-20 on L1), **Covenants++** (programmable spending conditions: escrow, vaults, time-locks), native **ZK proof verification** (Groth16 / OpZkPrecompile), **SilverScript** language, transaction introspection | [rusty-kaspa v2.0.0 release](https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0), [BSCN](https://x.com/BSCNews/status/2062907796589260907), [KuCoin news](https://www.kucoin.com/news/trends/KAS/6a30344395d8140007ae562b), [Gate blog](https://www.gate.com/blog/kaspa-toccata-hard-fork-pow-blockchain-programmable-era-upgrade-analysis) |
| 10 → ~25-40 bps | **DAGKnight** consensus hard fork (2nd 2026 fork) | **TARGET: ~end of Q3 2026** (core-dev conversations); Krux says "end of year". NOT locked, see §4 | Swaps GHOSTDAG → DAGKnight consensus; block times **25-40 ms** = **25-40 blocks per second** (same range inverted: 40 ms = 25 bps, 25 ms = 40 bps) | [ourcryptotalk roadmap](https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027), [Kaspa Commons on X](https://x.com/Kaspa_Commons/status/2024880151545212998) ("Two hard forks incoming in 2026, 'god willing' ~ @hashdag") |
| → 100 bps | proposed 2027 hard fork | **2027 target**, long-stated goal | 100 bps, enabled by DAGKnight's latency-adaptive consensus + infra maturity | [ourcryptotalk roadmap](https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027), [kasmedia](https://kasmedia.com/article/copy-copy-copy) |

## 2. VERIFIED: what DAGKnight actually is (the "cool advancement" for the video)

- Consensus protocol by **Michael Sutton & Yonatan Sompolinsky** (the DAGKNIGHT paper, 2022). Replaces GHOSTDAG.
- **The problem it solves:** GHOSTDAG needs a hardcoded parameter (k) derived from an ASSUMED worst-case network latency. The network must run as slow as the assumption. DAGKnight is **parameterless**: it measures and adapts to REAL network latency in real time.
- Consequences: confirmation times scale with actual internet speed (sub-second finality potential), and it is **50%-Byzantine tolerant** while staying responsive. [Gate DAGKnight guide](https://www.gate.com/post/status/16375253), [ourcryptotalk roadmap](https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027)
- **This is WHY higher bps becomes safe:** the protocol no longer has to leave margin for a pessimistic latency assumption. 100 bps in 2027 depends on DAGKnight shipping first.
- Dev status (kasmedia "Weekly Knight", per core dev @CoderOfStuff_): early Rust prototype has "hierarchical conflict resolution, incremental coloring, and parent selection logic"; honest-cluster detection works; **cascade voting not yet implemented**; prototype "far from testnet or mainnet readiness" at time of writing. [kasmedia sneak peek](https://kasmedia.com/article/sneakpeaks-and-developments)

## 3. Answer to Mike's question (the video's clarifying beat)

- The next throughput upgrade is **10 → ~25-40 bps ("call it 30")**, and it IS the **DAGKnight** fork (Mike was right about the name).
- **100 bps is real but it is the step AFTER**, a 2027 target that DAGKnight unlocks. So both the influencers and Mike were each half-right, and the ladder is: Crescendo (10) → Toccata (programmability, live now) → DAGKnight (~30) → 100 bps.

## 4. TPS numbers (handle with care)

| Block rate | Theoretical TPS | Source |
|---|---|---|
| 10 bps (now) | ~5,000+ | [ourcryptotalk TPS guide](https://ourcryptotalk.com/blog/kaspa-tps-guide) |
| 25 bps | ~12,500+ | same |
| 40 bps | ~20,000+ | same |
| 100 bps | ~50,000+ | same |

- **Demonstrated peak: 5,584 TPS on 2025-10-05** (real, on mainnet). Average daily txs ~386,700. Finality currently <7 s. [ourcryptotalk TPS guide](https://ourcryptotalk.com/blog/kaspa-tps-guide)
- Krux's "15,000 TPS" at ~30 bps is consistent with the theoretical-max interpolation. **Air it as "roughly 15,000 TPS of capacity," never as demonstrated throughput.**

## 5. ⛔ DO-NOT-AIR / phrasing guards

- **"25-40 bps end of 2026" is a core-dev TARGET, not a locked schedule.** DAGKnight prototype was still pre-testnet as of the kasmedia sneak peek. Say "targeted for the end of this year," never "scheduled" / "confirmed." (Also: sources say end of Q3 2026; Krux says end of year. "Before the end of the year" is the safe envelope.)
- **Do NOT say Toccata raised the block rate.** Toccata = programmability only; block rate is still 10 bps today.
- **15,000 TPS = theoretical capacity** (see §4). Demonstrated = 5,584 TPS.
- Ambiguity to keep soft: whether the 25-40 ms block time ships in the same fork as the DAGKnight consensus swap or as a fast follow-up tune; sources tie them together but the split is not locked. Phrase as "the DAGKnight era takes Kaspa to roughly 30 blocks a second."
- Persona: decentralization framed **architecturally** (PoW + permissionless nodes), never holder distribution. No price predictions as the thesis (hype/conviction register).

## 6. Context / color (optional beats)

- ~95% of KAS supply mined by 2026-07-10 (~27.2B of 28.7B). [ourcryptotalk roadmap](https://ourcryptotalk.com/blog/kaspa-roadmap-2026-2027)
- Irony hook from the SAME stream (50:00): Krux praises Solana's Alpenglow pushing finality "down to sub 1 second" from ~13 s. Kaspa with DAGKnight targets sub-second finality **on proof of work**. Great contrast beat.
- Comparative block cadence for a chart: Bitcoin 1 block / ~600 s, Ethereum ~12 s, Kaspa today 10/s (100 ms), DAGKnight era ~30/s (~33 ms). (BTC/ETH figures are common knowledge; re-verify on screen text at build time.)
- vProgs (further future, mention only if needed): "verification-oriented programmability layer enshrined in L1," per Yonatan "not an L2"; Sutton: live "within the next year" (statement date = that article's publish date, re-verify before airing). [kasmedia](https://kasmedia.com/article/sneakpeaks-and-developments)

## CHART-SOURCE INDEX (candidates, IDs for the screenplay)

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | The bps ladder timeline: 1 → 10 (Crescendo, May 2025) → ~30 (DAGKnight, target EOY 2026) → 100 (2027) | §1 table | **code** (animated) |
| C2 | Block-cadence race: BTC 600s vs ETH 12s vs SOL ~0.4s slot vs Kaspa 0.1s → 0.033s | §6 | **code** (animated) |
| C3 | TPS capacity bars: 5k → 12.5k → 20k → 50k (label THEORETICAL) + demonstrated 5,584 marker | §4 | **code** |
| C4 | GHOSTDAG fixed-k vs DAGKnight adaptive: system-design diagram (assumed worst-case latency vs measured latency) | §2 | **code** (system-design container, not AI image) |
| C5 | Toccata activation receipt: rusty-kaspa v2.0.0 release page / DAA score 474,165,565 | GitHub release page | **screencap** |
