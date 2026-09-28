# kaspa-vprogs: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled 2026-09-17 for the LOCKED brief "Kaspa vProgs: Smart Contracts Without an L2" (3:00, two FACE beats, all else COVER). Spelling per persona: vProgs (capital P), Kaspa, KAS, GhostDAG, DAGKnight. No em dashes._

**Source access notes (read before citing):**
- kasmedia.com now 308-redirects to **kasmagazine.com** (same articles, same authors). Cite the kasmagazine URL; the kasmedia URL still resolves.
- Michael Sutton's Medium posts sit behind a Cloudflare challenge and his X posts return 402 to our fetcher. Where a Sutton or Sompolinsky quote below is marked "via kasmagazine", the wording is taken from Kaspa Magazine's article that quotes the original X post / Medium post, and the original was NOT opened by us. Kaspa Magazine (Ghelardini / Sismil) is the ecosystem's newspaper of record and reproduces quotes verbatim, but for anything that goes on screen as a QUOTE CARD the receipt-capturer should capture the kasmagazine page (the page we opened), not the X post.
- The Kaspa Verifiable Programs yellow paper WAS opened and read in full (12 pages). It is the primary source for everything architectural.
- kaspa.org's "Programmability Mosaic" page 404s (checked twice, 2026-09-17). It is NOT a source here even though search engines still quote it.

---

## 1. The thesis, sourced

Each row: statement · source URL · read date · confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | vProgs are "a verification-oriented programmability layer enshrined in L1" and "not L2" (Yonatan Sompolinsky). Verbatim: "vProgs is not L2, a term which connotes a modular stack and ecosystem architecture (which failed)...I'd say vProgs is a verification-oriented programmability layer enshrined in L1." | Kaspa Magazine, The Weekly Knight, "A DAGKNIGHT Sneak Peak and vProg Development", 2025-12-17, quoting Sompolinsky's X posts: https://kasmagazine.com/article/sneakpeaks-and-developments | 2026-09-17 | HIGH on wording (via kasmagazine); original X post not opened |
| T2 | The L1 VERIFIES; it does not EXECUTE programs. Verbatim (yellow paper 1.2): "the Kaspa L1 acts as a sequencer and data availability layer. It does not execute vProg logic itself, but critically, it guarantees that all necessary witness data for a transaction is available and calculates the full computational dependency, or 'scope', that this on-site execution imposes on each vProg." | Kaspa Verifiable Programs (vProg) Protocol Specification, DRAFT v0.0.1, authors Msutton, FreshAir08, Hashdag (Kaspa Research / KEF): https://github.com/kaspanet/research/blob/main/vProgs/vProgs_yellow_paper.pdf (mirror we read: https://kaspa.co.il/wp-content/uploads/2025/09/vProgs_yellow_paper.pdf) | 2026-09-17 | HIGH (primary) |
| T3 | Programs run off-chain and prove correctness with zero-knowledge proofs that the L1 checks. Verbatim (abstract): "Zero-knowledge proof systems enable verifiable off-chain applications... The result is a synchronously composable, zk-based L1/L2 system, leveraging the high-throughput, low-latency Kaspa network as its shared sequencing layer." Section 1.1: "scale the computational capacity of the Kaspa L1 by enabling off-chain execution through verifiable programs (vProgs), validated via zero-knowledge (ZK) proofs." | Yellow paper (above) | 2026-09-17 | HIGH (primary) |
| T4 | The L1 side of this is real and live: Toccata activated on mainnet 2026-06-30 and added ZK proof verification opcodes (KIP-16), covenants (KIP-17), covenant IDs (KIP-20) and sequencing commitments (KIP-21). Verbatim (docs): "It is active on mainnet as of June 30, 2026, at DAA score 474_165_565." ZK precompiles: "Direct verification of Groth16 and RISC Zero Succinct proofs inside script." | Kaspa Docs, Toccata Dev Guide: https://docs.kaspa.org/toccata · rusty-kaspa v2.0.0 "Mainnet Toccata Release" (published 2026-06-05, activation DAA 474,165,565 projected 2026-06-30 ~16:15 UTC): https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0 · KIP list: https://github.com/kaspanet/kips | 2026-09-17 | HIGH (primary) |
| T5 | vProgs are the destination, not the thing that shipped. Verbatim (Sutton, via kasmagazine 2026-06-11): "This is also a significant milestone on the road to vProgs (Yellowpaper), where the long-term destination is synchronously composable verifiable programs." kaspa.org/build lists vProgs as "In construction" and says "Full vProgs remain a future direction." | https://kasmagazine.com/article/toccata-and-groundbreaking-regulation (quoting Sutton's Medium post "Kaspa Covenants++ Toccata Hard-Fork Outlook") · https://kaspa.org/build | 2026-09-17 | HIGH |
| T6 | Why: avoid the L2 path. Verbatim (Sompolinsky, via kasmagazine 2025-12-17): "Kaspa vProgs' primary motivation was to avoid the obsolete path of L2's...Vprogs is native expressiveness while keeping L1 verification-oriented and keeping attack surface minimal." And (Bitcoin Takeover podcast, published 2026-08-11): "For the record, I'm very bearish on rollups." | https://kasmagazine.com/article/sneakpeaks-and-developments · https://bitcoin-takeover.com/s17-e36-yonatan-sompolinsky-on-kaspa-covenants-dagknight-coordination-markets/ | 2026-09-17 | HIGH on wording |
| T7 | The specific L2 costs the brief names. SEQUENCER TRUST: sourced (the L1 is the sequencer, T2). LIQUIDITY FRAGMENTATION: sourced (yellow paper 1.1 "to prevent economic fragmentation"; Sompolinsky "No more 'where should I deploy my liquidity, where should I deploy my contract' brain fry"). BRIDGE RISK: sourced only as design intent (Sutton's milestone note lists a "Kaspa canonical bridge" verified on L1; Sompolinsky "attack surface minimal"). FEE LEAKAGE / "KAS as gas": NOT sourced, see section 4 and Open questions. | Yellow paper 1.1, 5.2, 6.1 · Sutton gist https://gist.github.com/michaelsutton/5bd9ab358f692ee4f54ce2842a0815d1 · kasmagazine 2025-12-17 | 2026-09-17 | MIXED, see per-item |

---

## 2. Pillar facts

### Pillar 1: the problem vProgs solve (why not an EVM bolt-on or an L2 stack)

**Ethereum's rollup-centric roadmap (the contrast, primary sources):**
- Vitalik Buterin, "A rollup-centric ethereum roadmap", Ethereum Magicians, posted 2020-10-02. Verbatim: "the Ethereum ecosystem is likely to be all-in on rollups (plus some plasma and channels) as a scaling strategy for the near and mid-term future." Also: "We would need to adapt to a world where users have their primary accounts, balances, assets, etc entirely inside an L2." Base layer role: "doing a few things well - namely, consensus and data availability." (https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698, read 2026-09-17)
- ethereum.org roadmap (page last updated 2026-09-17, read 2026-09-17): "layer 2 rollups have developed much faster than expected and have provided a lot of scaling already"; "Danksharding makes L2 rollups much cheaper for users by adding 'blobs' of data to Ethereum blocks." (https://ethereum.org/en/roadmap/)
- Note for the script: both Ethereum and Kaspa put "consensus and data availability" at the base layer. The DIFFERENCE is what sits on top: Ethereum expects users to live inside separate L2s with their own sequencers and bridges; vProgs keep verification (ZK verify opcodes, state index, resource metering) INSIDE Kaspa consensus, with the L1 itself as the shared sequencer (yellow paper section 3 "L1 Consensus Modifications"). That is what "enshrined" means. Do not claim Ethereum "has no L1 verification"; rollups also post proofs to Ethereum L1. The honest contrast is: separate chains + separate sequencers + bridges (rollups) vs one sequencer + one state index + synchronous composability enforced by L1 (vProgs).

**Kaspa's stated reasons (primary voices):**
- Sompolinsky (via kasmagazine 2025-12-17, read 2026-09-17): "Kaspa vProgs' primary motivation was to avoid the obsolete path of L2's"; "vProgs is not L2, a term which connotes a modular stack and ecosystem architecture (which failed)"; on complexity: "Re complexity, agree on the development side... but the gain is ux and devex resembling the simple and coherent interface of Solana-like monolithic systems...No more 'where should I deploy my liquidity, where should I deploy my contract' brain fry."
- Sompolinsky (Bitcoin Takeover S17 E36, published 2026-08-11, read 2026-09-17): "For the record, I'm very bearish on rollups." Same episode on covenants: "ephemeral logic" (one-time logic locked atomically within transactions).
- Sutton (X post introducing the yellow paper, via kasmagazine 2025-09-17, read 2026-09-17): "the base layer should focus on computational minimalism and super-fast ordering"; the article summarizes his framing as bridging Bitcoin conservatism with Ethereum's creative flexibility through zero-knowledge proofs. (https://kasmagazine.com/article/theweeklyknight081725)
- Sutton (Nov 2025, XXIM podcast appearance, PARAPHRASED by kasmagazine 2025-11-20, read 2026-09-17): vProgs are "an infrastructure template rather than a single VM choice: different vProgs can pick different virtual machines and stacks, while still plugging into the same protocol." Treat as paraphrase, not a quote card. (https://kasmagazine.com/article/vprogs-shielding-and-tokenized-energy-markets; podcast https://www.youtube.com/watch?v=xHlOcR1x2tU, not watched)
- Yellow paper 1.1 (primary): "The protocol is designed to resolve the inherent tension between two critical requirements: maintaining the sovereignty of individual vProgs while enabling synchronous, atomic composability between them to prevent economic fragmentation."
- Sutton's milestone note (gist, last active 2026-02-02, read 2026-09-17) states the interim design tension; kasmagazine 2026-01-16 quotes it as: "the interim choice is between losing synchronous composability or losing sovereignty." (https://kasmagazine.com/article/dan-warpcore-and-covenant)
- On "why not an EVM on L1": no primary source says "we rejected an EVM" in those words. Closest primary facts: Silverscript "compiles directly to native Kaspa Script" with no VM (kasmagazine 2026-02-19 quoting Ori Newman: "Kaspa's first high-level smart contract language and compiler"), and Sutton's "computational minimalism" principle. Script must phrase this as design philosophy ("Kaspa kept the base layer minimal"), not as a quoted rejection. See Open questions.

### Pillar 2: what a vProg IS (all from the yellow paper unless noted; read 2026-09-17)

**Definition (section 2.2):** "A verifiable program, or vProg, p, is a sovereign application defined by a state transition function exec_p. Each vProg exclusively owns a set of accounts, A_p, and is solely responsible for authorizing modifications to their state. From an architectural perspective, a vProg functions as an independent, verifiable state machine whose state progression is periodically committed to the Kaspa L1."
- Accounts: "Only the executable exec_p of the owning vProg p has write-access to accounts in A_p, but its value may be read by any vProg." (Write locally, read globally.)

**Who runs what (the roles for the ONE system-design diagram, C1):**
- **Kaspa L1 (miners / full nodes):** sequencer + data availability + verifier. "It does not execute vProg logic itself" (1.2). It orders three operation types, Tx, Stitch, CondBatch, into one global sequence (2.1). It verifies ZK proofs (3.1), meters resources (3.2), and keeps the vProg state index of state commitments (2.4, 3.3).
- **vProg clients (the program's own nodes):** compute the program's state. "A client running a vProg's main purpose is to compute the latest state of all its owned accounts" (2.2.1). Sovereignty means "each program's nodes locally execute the logic of any external vProgs they depend on" (1.2).
- **Provers (section 6):** "Provers are for-profit entities responsible for creating stitching proofs and conditional batch proofs. Provers are expected to specialize in the proofs of a particular vProg or set of vProgs." Compensation (6.1): "Provers' compensation is to be managed by the vProgs themselves. We suggest it be in correspondence to the L2 gas consumed by the transaction."
- **Users:** send transactions that "explicitly declare the set of accounts it intends to read [and] the set of accounts it intends to write to" (2.3), which "allows L1 to pre-compute the dependency graph."

**State and data availability:**
- L1 "guarantees that all necessary witness data for a transaction is available" (1.2). "The witness data supplied by transactions is anchored in zk-proven commitments to the historical states of vProgs" (1.2).
- Proof frequency is the scaling lever: "The more frequent proof submissions become, the more 'shallow' these anchors can become, and in turn the computational and execution externalities imposed by one vProg on the other reduce. This creates a powerful economic incentive for a healthy, active prover ecosystem to keep the system scalable." (1.2)
- Liveness is never hostage to another program (the "sovereign path", 6.2): "this 'sovereign' option crucially ensures the liveness of a vProg is never compromised by the fault of others" (1.2).

**"Enshrined in L1" means consensus itself changes (section 3, "L1 Consensus Modifications"):** ZK verify capabilities (3.1), new resource masses "L2 gas" and "scope gas" regulated per vProg (3.2), a vProg state index and "stitching covenant" (3.3). This is the concrete meaning of Sompolinsky's "enshrined": the verification rules live in Kaspa consensus, not in a separate chain's contract.

**Composability (5.3 and Sutton's gist):** each vProg chooses which foreign vProgs it accepts reads from; "Composability thus remains strictly under the control of each vProg." Sutton's milestone note (gist, read 2026-09-17) defines the long-term goal as synchronous composability "ranging from reading foreign state to full Cross Program Invocation (CPI), without waiting for proofs."

**Gas (5.2, primary):** "Each vProg defines its own internal gas model and fee structure, allowing it to regulate its own resources and create a market for its blockspace." (This is why "KAS is the gas asset" is NOT a verified claim; see section 4.)

**What changes for a user / a dev (Sompolinsky, via kasmagazine 2025-12-17):** "ux and devex resembling the simple and coherent interface of Solana-like monolithic systems." Kasmagazine 2025-11-20 summarizes: L1 provides sequencing, data availability and settlement through validity proof verification, "not program execution or L2 state maintenance"; programs stay independent but communicate via the shared sequencer on Kaspa L1.

**Plain-language summary the yellow paper supports (for the strategist, not a quote):** a vProg is an app that keeps its own state and its own nodes, publishes ZK proofs of its state to Kaspa, reads any other app's state through Kaspa's shared ordering, and is never blocked by another app's failure. Kaspa orders everything, stores the data, checks the proofs and meters the work; it never runs the app.

### Pillar 3: why it matters, what it unlocks (keep CONDITIONAL)

- **Atomic cross-app transactions without a bottleneck at the base layer** (kasmagazine 2025-09-17 summarizing the yellow paper, read 2026-09-17): "Cross-program transactions succeed or fail as atomic units without bottlenecking the base layer"; "Programs pay only for resources consumed." Primary backing: yellow paper 1.2 ("trustless, atomic interactions between sovereign applications without creating computational bottlenecks or sacrificing liveness").
- **Settlement on Kaspa:** Sutton's milestone note lists "Kaspa canonical bridge (exit/settlement mechanism)" and "native asset canonical bridge" as milestones 3 and 4 (gist, read 2026-09-17). So settlement of vProg state to Kaspa L1 is the design; a "canonical bridge" here is L1-verified, not a third-party multisig.
- **Confirmation speed today (not DAGKnight):** Kaspa mainnet runs 10 blocks per second since Crescendo (KIP-14: BPS "from 1 to 10", block target 1000 ms to 100 ms; rusty-kaspa v1.0.0 "Mainnet Crescendo Release", activation DAA 110,165,000 projected 2025-05-05 ~15:00 UTC). Sources: https://github.com/kaspanet/kips/blob/master/kip-0014.md · https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.0.0 (read 2026-09-17).
- **DAGKnight (conditional, not shipped):** KIP-2 "Upgrade consensus to follow the DAGKNIGHT protocol", authors Sompolinsky and Sutton, status **Proposed** (https://github.com/kaspanet/kips/blob/master/kip-0002.md, read 2026-09-17). Verbatim: "In DK there's no a priori hardcoded parameter k, and consequently it can adapt to the 'real' k in the network"; "responsiveness whilst being 50%-byzantine tolerant." Sompolinsky (Bitcoin Takeover, published 2026-08-11): "DAGKnight is not faster per se"; its advantage is being "the only protocol resilient to 49% Byzantine attacks that has no latency parameter", confirming at actual network speed rather than a hardcoded worst-case assumption. Dev status: early Rust prototype shared Dec 2025, "far from testnet or mainnet readiness" (kasmagazine 2025-12-17). As of 2026-09-14 mainnet still runs GhostDAG; an unmerged dagknight branch exists (Kaspa Explained status page, secondary, https://kaspaexplained.com/status, read 2026-09-17). **Script rule:** "DAGKnight-era confirmation speed" must be future-conditional ("when DAGKnight lands"), and per Sompolinsky the honest framing is "confirms at real network speed", not "faster blocks".
- **App classes:** the yellow paper names no apps. Ecosystem framing: kasmagazine 2025-09-17 (Kaspa Experience, Berlin, 2025-09-13) lists talks on "oracles, decentralized applications, stablecoins, and institutional adoption." Silverscript v1.0.0 (covenant path, NOT vProgs) is pitched for "DeFi, vaults, and native asset management directly on Kaspa's L1" (Ori Newman via kasmagazine 2026-02-19). Keep "DeFi, stablecoins, tokens" as "the kinds of apps people expect", never as announced vProgs.
- **What is live for builders today (not vProgs, but the foundation):** Toccata covenants + ZK precompiles + seqcommit lanes (docs.kaspa.org/toccata), Silverscript v1.0.0 released 2026-09-09 16:48 UTC, described in its notes as "a high-level smart contract language for Kaspa... compiling to Kaspa Script" and "the official release" after "extensive review, testing, and standardization" (https://github.com/kaspanet/silverscript/releases/tag/v1.0.0, GitHub API published_at 2026-09-09T16:48:31Z, read 2026-09-17).

### Pillar 4: where it stands (the dated timeline)

| Date | Event | Source (read 2026-09-17) |
|---|---|---|
| 2025-05-05 | Crescendo hard fork activates, 1 to 10 BPS | rusty-kaspa v1.0.0 release; KIP-14 |
| 2025-09-11 | vProgs yellow paper DRAFT v0.0.1 committed to kaspanet/research (single commit, "v0.0.1 Draft of vProgs yellow paper (#4)") | GitHub API commits for the file path; kasmagazine 2025-09-17 ("released the draft v0.0.1... this week") |
| 2025-12-17 | Sompolinsky: "verification-oriented programmability layer enshrined in L1"; expects covenant hard fork in "3 to 6 months"; Sutton: "Talent and expertise are compounding in R&D, and real work is being done. More concrete updates soon." | https://kasmagazine.com/article/sneakpeaks-and-developments |
| 2026-01-16 / 2026-02-02 | Sutton publishes "Notes on Kaspa covenant++ milestones and longer-term vProgs directions" (gist last active 2026-02-02). Milestones: 1 inline zk covenant; 2 based zk covenant with inefficient seqcommit; 3 + Kaspa canonical bridge; 4 + native asset canonical bridge; 5 + optimal seqcommit (O(vprog activity) proving). Mid-long term: "vProgs based rollup (VBR), TBD milestones". Long term: "Full vProgs spec with synchronous composability, TBD milestones". | https://gist.github.com/michaelsutton/5bd9ab358f692ee4f54ce2842a0815d1 · kasmagazine 2026-01-16 |
| 2026-01-19 | kaspanet/vprogs repo created (Rust, ISC license). README: "APIs and architecture may change significantly." | GitHub API created_at 2026-01-19T15:38:04Z; https://github.com/kaspanet/vprogs |
| 2026-02 | Silverscript announced, experimental, Testnet-12 only; Hans Moog lands vprogs PRs #12 #13 #14 (checkpoint/batch metadata, rollback vs pruning coordination, L1 bridge alignment) | https://kasmagazine.com/article/hail-the-silverscript (2026-02-19) |
| 2026-04-11 | Sutton: "I'm careful not to call it vProgs but rather 'standalone based zk apps,' because they are not the complete vProgs. They will not support synchronous composability at this stage yet." Hans Moog: "We are currently working on step 3, which will already enable programmability but interactions between apps have to go through the L1." | https://kasmagazine.com/article/weekly-knight-development-is-wild (quoting Moog's X thread https://x.com/hus_qy/status/2040021010510905613, not opened) |
| 2026-06-05 | rusty-kaspa v2.0.0 "Mainnet Toccata Release" published (KIP-16, 17, 20, 21). "twelve developers" contributed per kasmagazine 2026-06-11. v2.0.1 published 2026-06-15. | GitHub releases API |
| 2026-06-30 | Toccata ACTIVE on mainnet at DAA 474,165,565 | https://docs.kaspa.org/toccata ("active on mainnet as of June 30, 2026") |
| 2026-08-11 | Sompolinsky podcast: "very bearish on rollups"; "DAGKnight is not faster per se" | bitcoin-takeover.com episode page |
| 2026-09-09 | Silverscript v1.0.0 official release | GitHub release, API published_at |
| 2026-09-17 | kaspanet/vprogs last push 2026-09-17T14:24:20Z, 53 stars, 10 forks (active daily development) [VERIFY] | GitHub API |
| 2026-09-17 | kaspa.org/build status: Toccata "Live on mainnet since June 30, 2026"; vProgs "In construction", "Full vProgs remain a future direction"; runtime is "an evolving pattern source, not yet a stable external API"; Silverscript "Tooling is still early; check current release and audit status before production use." | https://kaspa.org/build |

**The "within the next year" line (the brief's [VERIFY]):** Kaspa Magazine 2025-12-17 writes that the YouTube channel "Your Crypto Crew" reported that "Michael Sutton [said] they should be live within the next year", and separately that vProgs are expected in "6 to 8 months" per the same video. We could not locate or open the video, and the article contains NO first-person Sutton quote to that effect. Sutton's only direct quote in that article is "Talent and expertise are compounding in R&D, and real work is being done. More concrete updates soon." Four months later (2026-04-11) Sutton explicitly narrowed the near-term deliverable to "standalone based zk apps... not the complete vProgs." As of 2026-09-17 the official status is "In construction". **Verdict: do not attribute "live within the next year" to Sutton as a quote.** Safe phrasing: "core devs have talked about the first vProg-style apps landing within a year of the yellow paper, and the pieces are shipping in order; full vProgs are still under construction." See section 4.

**Shipped vs planned (one-line ledger for CH3):**
- SHIPPED: 10 BPS (2025-05-05); yellow paper (2025-09-11); ZK verify opcodes, covenants, covenant IDs, seqcommit lanes on mainnet (2026-06-30); Silverscript 1.0 (2026-09-09); an open-source vprogs runtime under daily development.
- IN PROGRESS: "standalone based zk apps" (Sutton's term; milestone path 1 to 5 in his gist).
- PLANNED / RESEARCH: vProgs based rollup; full vProgs with synchronous composability ("TBD milestones"); DAGKnight (KIP-2 Proposed, prototype only).

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Yonatan Sompolinsky** (X: @hashdag) | Kaspa founder and researcher; co-author of GhostDAG and DAGKnight; yellow paper co-author "Hashdag" | Yellow paper author list; KIP-2 author; kasmagazine 2025-12-17 |
| **Michael Sutton** (X: @michaelsuttonil) | Kaspa core developer; yellow paper lead author "Msutton"; author of KIP-14 (Crescendo), KIP-20 (Covenant IDs), KIP-2 co-author; wrote the Toccata outlook and the milestone note | Yellow paper; kips repo; gist |
| **FreshAir08** | Core contributor, yellow paper co-author (affiliations: Kaspa Research and Kaspa Ecosystem Foundation) | Yellow paper author list |
| **Hans Moog** (X: @hus_qy) | Researcher/dev contributing to the vprogs runtime; thanked in the yellow paper "for extensive discussions regarding atomic composability and zero knowledge technologies" | Yellow paper acknowledgments; kasmagazine 2026-02-19 and 2026-04-11 |
| **Ori Newman** | Core dev; KIP-17 (Covenants) author; announced Silverscript | kips repo; kasmagazine 2026-02-19 |
| **Alexander Safstrom** (saefstroem) | KIP-16 (ZK Precompile Opcode) author | kips repo; kasmagazine 2026-01-21 |
| **Kaspa Ecosystem Foundation (KEF)** | Affiliation on the yellow paper | Yellow paper |
| **Kaspa Magazine** (Jennifer Ghelardini, Nicholas Sismil) | Ecosystem newspaper, "The Weekly Knight" column; formerly kasmedia.com | kasmagazine.com |
| **Igra Labs / Igra Network** | EVM-compatible L2 on Kaspa (based ZK rollup positioning); token auction concluded 2026-04-03 (49.36M IGRA sold, 528 bidders, clearing price 0.1652 iKAS per IGRA); "network now live with attestation system active" per kasmagazine 2026-04-11. Igra's own site returned no readable content to our fetcher. | https://kasmagazine.com/article/weekly-knight-development-is-wild (secondary) |
| **Vitalik Buterin** | Author of "A rollup-centric ethereum roadmap", 2020-10-02 | ethereum-magicians.org |
| **Hard forks:** Crescendo (2025-05-05, 10 BPS) · Toccata (2026-06-30, programmability) | | rusty-kaspa releases; docs.kaspa.org |
| **KIPs named on screen:** KIP-2 DAGKnight (Proposed) · KIP-14 Crescendo (Active) · KIP-16 ZK Precompile Opcode (Active) · KIP-17 Covenants and Improved Scripting (Active) · KIP-20 Covenant IDs (Active) · KIP-21 Partitioned Sequencing Commitment with O(activity) Proving | | https://github.com/kaspanet/kips (read 2026-09-17) |

Terminology for captions/graphics: "vProgs" (capital P; singular "vProg"); "GhostDAG" (the docs and KIP-2 write GHOSTDAG in caps, either is allowed by persona, never "fully implemented ghost"); "DAGKnight"; "Kaspa" never "Casper"; "$KAS"; "based ZK apps" (Sutton's term, lowercase "based"); "Toccata" (Whisper renders it "Takata"; correct it); "Silverscript" (one word, capital S, per the GitHub release title).

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "Michael Sutton said vProgs will be live within the next year" | Second-hand: kasmagazine attributes it to a YouTube channel's summary, with no first-person quote; Sutton's April 2026 wording narrows the near-term deliverable to "standalone based zk apps"; official status 2026-09-17 is "In construction". A year from Dec 2025 is Dec 2026, three months from air. | "The first vProg-style apps are the next step on the ladder; full vProgs are under construction" (conditional). |
| "vProgs launched / are live" or "Toccata = vProgs" | Toccata shipped the L1 foundations (ZK verify, covenants, seqcommit); kaspa.org: "Full vProgs remain a future direction." | "Toccata put the verification layer into Kaspa's consensus; vProgs are what gets built on it." |
| "vProgs run at 30,000+ TPS" / "solve the smart contract trilemma" (vprogs.xyz marketing) | vprogs.xyz did not resolve for us (DNS failure) and is not an official Kaspa property as far as we could establish; the yellow paper gives no TPS figure. | No TPS number for vProgs. If throughput is needed, use the L1's 10 BPS (sourced) and keep vProg capacity qualitative. |
| "KAS is the gas token for every vProg" / "no fee leakage" | Yellow paper 5.2: "Each vProg defines its own internal gas model and fee structure." Prover pay is "managed by the vProgs themselves." Nothing says KAS is mandatory gas. L1 fees for sequencing are paid in KAS (that is how Kaspa transactions work), but vProg-internal gas is program-defined. | "Every vProg transaction is sequenced and settled on Kaspa, in KAS" is defensible; "KAS is the gas for the apps" is not. Open question for Mike. |
| "DAGKnight makes blocks faster / sub-second finality is coming with DAGKnight" | Sompolinsky, 2026-08-11: "DAGKnight is not faster per se"; it removes the latency parameter so confirmation tracks real network speed. KIP-2 still Proposed; no testnet. | "When DAGKnight lands, confirmations track the real speed of the network instead of a worst-case assumption." |
| "25 to 40 BPS by end of 2026" (from the sibling kaspa 30bps research) | Secondary-sourced target from mid-2026; no primary schedule; not needed by this brief. | Do not air in this video. |
| "The covenant hard fork is in 3 to 6 months" (Sompolinsky, Dec 2025) | Stale: it happened (2026-06-30). | Use it only as a "he called it" beat: said Dec 2025, delivered June 2026. |
| "Silverscript is experimental / testnet only" (Feb 2026 coverage) | Superseded: v1.0.0 official release 2026-09-09. kaspa.org/build still says "Tooling is still early; check current release and audit status." | "Silverscript hit 1.0 this month" [VERIFY wording relative to air date; no day-relative words]. |
| "Igra L2 is live on Kaspa" as part of the bull case | Persona verified_claims_only: Mike does not name an unproven L2 in the bull case; also, naming an L2 muddies a video whose thesis is "not an L2". Coverage is secondary (kasmagazine). | If the strategist wants the contrast: "the L2 stack" generically. Mike decides at GATE 1. |
| Any bridge-hack dollar figure | Not researched to a primary source in this run; would be stale (2022 era). | Keep bridge risk qualitative ("every bridge is an attack surface") or ask for a sourced figure. |
| "Kaspa rejected the EVM" as a quote | No primary quote says this. | Philosophy framing: "computational minimalism and super-fast ordering" (Sutton) at the base layer. |
| Yellow paper as "final spec" | It is "DRAFT v0.0.1"; several sections say "To be detailed in future revisions" (account creation, cache pruning, prover economics). | "the yellow paper, a first draft". |

---

## 5. Market snapshot

Pulled 2026-09-17 22:26 UTC from CoinGecko API (https://api.coingecko.com/api/v3/coins/kaspa, `last_updated` 2026-09-17T22:24:40Z). All [VERIFY] at render.

| Figure | Value at read | Note |
|---|---|---|
| KAS price (USD) | 0.03331 | [VERIFY] |
| Market cap (USD) | 922.7M | [VERIFY]; CoinGecko rank 77 at read |
| Circulating supply | 27.706B KAS | [VERIFY] |
| Max supply | 28.704B KAS | CoinGecko field |
| ATH | 0.2074 USD on 2024-07-31 | CoinGecko |
| 24h volume | 9.87M USD | [VERIFY] |
| Mainnet block rate | 10 BPS (since 2025-05-05) | primary, not drifting |
| Toccata activation | 2026-06-30, DAA 474,165,565 | primary, not drifting |
| kaspanet/vprogs repo | 53 stars, 10 forks, last push 2026-09-17 14:24 UTC | [VERIFY] GitHub API |
| Silverscript latest release | v1.0.0, 2026-09-09 | [VERIFY] newer tag possible by render |
| "Read date" for every kasmagazine / GitHub / docs page above | 2026-09-17 | |

Sanity flag for Mike: the CoinGecko read shows KAS roughly 84% below its 2024-07-31 ATH. The brief does not need a price beat; if a price chart is used (C12), it is a screencap and the number on it is whatever the site shows at capture time.

---

## CHART-SOURCE INDEX

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design diagram: "Kaspa orders, stores, verifies, meters; the vProg's own nodes execute; provers post ZK proofs" (nodes: Users → Kaspa L1 [sequencer · DA · ZK verify · state index · metering] ↔ vProg A nodes / vProg B nodes ↔ Provers). Labels only from section 2 Pillar 2 (yellow paper 1.2, 2.2, 3, 6). | DATA section 2 Pillar 2 | **code** (system-design container, spotlight one node at a time) |
| C2 | Contrast graphic "L2 stack vs vProgs": left column rollup (own chain, own sequencer, bridge to L1, proof to L1, liquidity split per L2); right column vProgs (one sequencer = Kaspa, one state index, proofs verified in consensus, sovereign apps, synchronous composability). Text-accurate, no numbers. | DATA section 2 Pillar 1 (Vitalik 2020-10-02; yellow paper 1.1, 1.2; Sompolinsky 2025-12-17) | **code** (animated reveal, row by row) |
| C3 | The ladder timeline (animated): 2025-05-05 Crescendo 10 BPS → 2025-09-11 yellow paper → 2026-06-30 Toccata (ZK verify + covenants live) → 2026-09-09 Silverscript 1.0 → NEXT: standalone based ZK apps → full vProgs (under construction) → DAGKnight (proposed). Shipped items solid, planned items dashed. | DATA section 2 Pillar 4 table | **code** (animated-chart, useCurrentFrame) |
| C4 | Receipt: yellow paper title page ("Kaspa Verifiable Programs (vProg) Protocol Specification", DRAFT v0.0.1, authors) | https://github.com/kaspanet/research/blob/main/vProgs/vProgs_yellow_paper.pdf (GitHub PDF viewer) | **screencap** |
| C5 | Receipt: Sompolinsky quote "verification-oriented programmability layer enshrined in L1" / "not L2" as printed in Kaspa Magazine | https://kasmagazine.com/article/sneakpeaks-and-developments (crop to the quote paragraph) | **screencap** |
| C6 | Receipt: "It is active on mainnet as of June 30, 2026, at DAA score 474_165_565" + "ZK Precompiles: Direct verification of Groth16 and RISC Zero Succinct proofs inside script" | https://docs.kaspa.org/toccata | **screencap** |
| C7 | Receipt: kaspa.org build/status card, vProgs "In construction", "Full vProgs remain a future direction" | https://kaspa.org/build (developments section) | **screencap** |
| C8 | Receipt: GitHub kaspanet/vprogs repo header (description, Rust, stars, last commit date) | https://github.com/kaspanet/vprogs | **screencap** [VERIFY counts at capture] |
| C9 | Receipt: Vitalik "A rollup-centric ethereum roadmap" (title + date + the "all-in on rollups" sentence) | https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698 | **screencap** |
| C10 | Sutton's milestone ladder (5 short-mid milestones → VBR → full vProgs), rendered as a vertical stepper with "you are here" at milestone stage per Moog's "step 3" (2026-04-11) | https://gist.github.com/michaelsutton/5bd9ab358f692ee4f54ce2842a0815d1 (data) · kasmagazine 2026-04-11 (position) | **code** (also screencap the gist header as C10r receipt if the strategist wants authenticity) |
| C11 | Receipt: rusty-kaspa v2.0.0 "Mainnet Toccata Release" (KIP-16/17/20/21, DAA 474,165,565) | https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0 | **screencap** |
| C12 | OPTIONAL: KAS price chart if CH3 wants a market beat (brief does not require it) | TradingView KASUSDT or CoinGecko kaspa page at capture time | **screencap** [VERIFY]; never restyle |
| C13 | Receipt: Silverscript v1.0.0 release page (title, date) | https://github.com/kaspanet/silverscript/releases/tag/v1.0.0 | **screencap** |
| C14 | Receipt: Sutton quote "I'm careful not to call it vProgs but rather 'standalone based zk apps'... They will not support synchronous composability at this stage yet." as printed in Kaspa Magazine | https://kasmagazine.com/article/weekly-knight-development-is-wild | **screencap** |
| C15 | OPTIONAL block-cadence ladder (Bitcoin ~600 s, Ethereum ~12 s, Kaspa 100 ms) for a "why speed matters" beat | Kaspa figure: KIP-14 (100 ms). BTC/ETH: common knowledge, cite bitcoin.org / ethereum.org on the card if used [VERIFY] | **code** |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. C1, C2, C3, C10 are text-accurate code containers whose every label traces to section 2; C4 to C9, C11, C13, C14 are real-site captures.

---

## Open questions for Mike

1. **"Within the next year" attribution.** The brief credits Sutton; the only source is a YouTube channel's summary relayed by Kaspa Magazine (2025-12-17), and Sutton's own later wording (2026-04-11) is narrower. Recommendation: drop the quote, keep the ladder (C3) and the "he called the covenant fork, it shipped" beat. Your call at GATE 1.
2. **"KAS as the settlement and gas asset" (Pillar 3).** Settlement on Kaspa: sourced. KAS as the apps' gas: NOT sourced; the yellow paper lets each vProg define its own gas model. Suggested airable line: "every vProg transaction is ordered and settled on Kaspa, paid for in KAS at the base layer." Approve or cut.
3. **"No L2 tax / fee leakage."** No primary source quantifies or names it. The closest primary support is Sompolinsky's "avoid the obsolete path of L2s" and the yellow paper's "prevent economic fragmentation." Suggest framing as liquidity/attention fragmentation rather than fees.
4. **"Why not an EVM" as a quoted position.** No primary quote. Air as design philosophy (Sutton: "computational minimalism and super-fast ordering"), not as "they rejected the EVM."
5. **Name Igra or any team building on vProgs?** No project has shipped a vProg (status: "In construction"). Igra is a live EVM L2 per secondary coverage; persona rule says do not name an unproven L2 in the bull case, and naming an L2 cuts against the "not an L2" thesis. Recommendation: do not name apps or teams; say "the first based ZK apps are the next milestone."
6. **Sompolinsky's and Sutton's X posts could not be opened** (402 / Cloudflare). Every quote card from them captures the Kaspa Magazine page that printed the quote. If you want the original tweet on screen, the receipt-capturer needs to capture it in a logged-in browser and confirm the wording against the kasmagazine text.
7. **Brief contradiction check:** none on the thesis. One soft contradiction on Pillar 3: the brief lists "DAGKnight-era confirmation speed" as an unlock; Sompolinsky (2026-08-11) says "DAGKnight is not faster per se." The angle survives if the line is "confirmations at real network speed," not "faster blocks."
8. **CoinGecko snapshot shows KAS ~0.033 USD, rank ~77.** No price beat is in the brief; confirm you want none (C12 optional).
9. **Runtime note (not research):** the yellow paper's language is dense; the 3:00 window fits C1 + C2 + C3 and at most four receipts. The index lists more so the strategist can choose; drop unused IDs with strikethrough, never silently.
