# kaspa-vprogs - SCREENPLAY

- **Working title:** Kaspa vProgs: Smart Contracts Without an L2 (alternates for Mike at GATE 1: "The Kaspa Upgrade Nobody Is Pricing In" · "vProgs, Explained in 3 Minutes")
- **Track:** longform-edited (16:9, heavily edited). First video through the longform LangGraph.
- **Archetype / register:** EPIC informative explainer. Gear map: **CH1 = gear 3** (peak epic hook, hammer sentences, no "right?" tags, no hedge) → **CH2 = gear 2** (polished explainer, one system-design diagram carries it, declarative edges) → **CH3 = gear 3** (epic ladder + conviction close). This arc drives the voice, the three music beds, and the two title cards below.
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6). **EXACTLY TWO `[FACE]` beats in the whole video, both inside CH1's opening** (the hook line, the thesis landing). Every other line is `[COVER]`, including the close. Captions ON.
- **Target runtime:** 3:00 (hard window 2:50 to 3:10). Spoken-word budget ~500 words total; per-chapter budgets on each chapter header. Lines flagged 💬 trim-first come out first if a take runs long.
- **Fact source:** every number, date, name and quote in this screenplay traces to `DATA.md` in this folder (compiled 2026-09-17). Chart IDs C1 to C15 = DATA.md CHART-SOURCE INDEX. H0 and H1 are hook graphics defined in VISUAL-PLAN (text only, no numbers).

---

## THE HOOK / THESIS

Kaspa already has smart contracts (covenants, live on mainnet since Toccata, 2026-06-30); vProgs are the next layer up, whole verifiable applications on the layer 1, which its founder Yonatan Sompolinsky calls "a verification-oriented programmability layer enshrined in L1" and explicitly "not L2." The one idea the video teaches: **Kaspa does not run the app, Kaspa verifies it.** The app runs on its own nodes, provers post zero-knowledge proofs, and Kaspa itself orders every transaction, stores the data, checks the proofs and meters the work. That is how apps inherit Kaspa's speed and proof-of-work security without a separate chain, a separate sequencer, or a third-party bridge in the middle. Where it stands: the L1 verification layer shipped on mainnet with Toccata (June 30, 2026); full vProgs are officially "In construction." Upside stays conditional throughout.

> [!WARNING]
> **DO NOT AIR "Michael Sutton said vProgs will be live within the next year."** The only source is a YouTube channel's summary relayed by Kaspa Magazine (2025-12-17) with no first-person Sutton quote; Sutton's own April 2026 wording narrows the near-term deliverable to "standalone based zk apps," and the official status on 2026-09-17 is "In construction." No date promise for vProgs anywhere, spoken or on screen. Airable: "the first standalone ZK apps are the next rung; full vProgs are under construction." (DATA.md §4, Open question 1)

> [!WARNING]
> **DO NOT say vProgs are live, or that Toccata IS vProgs.** Toccata shipped the L1 foundations (ZK verify opcodes, covenants, covenant IDs, sequencing commitments). kaspa.org: "Full vProgs remain a future direction." Airable: "Toccata put the verification layer into Kaspa's consensus; vProgs are what gets built on it." (DATA.md §4)

> [!WARNING]
> **NO TPS number for vProgs, ever** (the "30,000+ TPS" / "smart contract trilemma" marketing comes from a non-official site that did not even resolve). The only throughput figure allowed on screen is the L1's 10 blocks per second (KIP-14, primary). vProg capacity stays qualitative. (DATA.md §4)

> [!WARNING]
> **DO NOT say "KAS is the gas token for every vProg" or "no fee leakage / no L2 tax."** Yellow paper 5.2: each vProg defines its own gas model and fee structure. This screenplay does not use a gas or fee line at all; if Mike wants one, the only defensible wording is "every vProg transaction is ordered and settled on Kaspa, paid for in KAS at the base layer." (DATA.md §4, Open question 2)

> [!WARNING]
> **DO NOT say "no bridge" flat, and DO NOT air any bridge-hack dollar figure.** Sutton's own milestone ladder includes a "Kaspa canonical bridge (exit/settlement mechanism)" that is verified on L1. The honest contrast is "no separate chain, no separate sequencer, no third-party bridge in the middle." Bridge risk stays qualitative. (DATA.md §2 Pillar 1, §4)

> [!WARNING]
> **DAGKnight is NOT spoken as "faster blocks," and no "25 to 40 BPS" figure airs in this video.** Sompolinsky (2026-08-11): "DAGKnight is not faster per se." DAGKnight appears ONLY as a dashed "proposed" rung on the C3 ladder graphic, not in the VO. **Do NOT name Igra or any L2 / any team "building on vProgs"** (nothing has shipped a vProg; naming an L2 cuts against the thesis). **Do NOT quote anyone "rejecting the EVM"** (no such quote exists). The yellow paper is always "the first draft," never "the spec." (DATA.md §4)

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | STRAIGHT INTO IT | Hook (opens the video, no cold open): the name vProgs and what one is, in one breath; Kaspa already has covenants, vProgs are the next layer up; the two FACE beats; the "verify, don't run" thesis lands | Bed A starts | OFF (pure hook, face is frame one) | ~35s / ~110 words |
| CH2 | NOT AN L2 | The rollup road Ethereum took (C9, C2, C5) → THE system-design diagram of a vProg (C1) → what sovereignty, composability and "enshrined" mean | Bed B starts | **ON: "NOT AN L2"** | ~95s / ~255 words |
| CH3 | WHERE IT STANDS | The shipped-vs-planned ladder (C3, C7), the "he called it" beat, conviction close + CTA (or hard-out, Mike's call) | Bed C starts | **ON: "WHERE IT STANDS"** | ~45s / ~125 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it.

---

## PRODUCTION CONVENTIONS

**Tag legend (Convention 5: one job per line, tag at the start of the line):**

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. THIS VIDEO: exactly two, both in CH1, each a single sentence or a tight pair |
| 🗣️ `[COVER]` | spoken, VO over container / diagram / receipt / b-roll. The DEFAULT, and everything outside the two face lines |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate tag FIRST (`👤 [FACE] 🔒 [SAY-EXACT]` or `🗣️ [COVER] 🔒 [SAY-EXACT]`) so the gate is written out, never inferred |
| 🎬 `[SHOW]` | on-screen direction (chart, container, receipt, b-roll cue). Not spoken |
| 💬 `[NOTE]` | note to Mike, not in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |

**Title-card table (falls out of the music bed map, Convention 2: a card lands ONLY where a new bed starts):**

| CH | Bed | Card |
|---|---|---|
| CH1 | Bed A STARTS | OFF (opens on the pure hook; the first frame is Mike's face) |
| CH2 | Bed B STARTS | ON, card text: **NOT AN L2** |
| CH3 | Bed C STARTS | ON, card text: **WHERE IT STANDS** |

Cards are short viewer-facing titles, not the production names. Each card holds at least 1s readable, led in BEFORE the baked pause. One card transition for the whole video (picked in TRANSITIONS.md later).

**FACE/COVER rules (Convention 3, tightened by Mike's constraint for this video):** the face is gated OFF by default and stays off. The two face cuts are CH1 Beat 1 line 1 (the hook) and CH1 Beat 3 line 1 (the thesis landing); the line after each is tagged `[COVER]` explicitly inside the locked block. No face beat in CH2, none in CH3, none on the CTA. The graph counts the tagged `[FACE]` lines and refuses more than two.

---

## CH1 - STRAIGHT INTO IT
**Register:** gear 3, peak epic. Short hammer sentences. No "right?" tags, no hedge, no whole-video preview.
**Title card:** OFF. **Music:** Bed A starts (aggressive, dark-epic, hits cold on the first word; see MUSIC-MOOD-PLAN).
**Budget:** ~35s, ~110 spoken words. (Mike, 2026-09-17: no "smart contracts are coming" tease, Kaspa already has covenants; open straight on what vProgs are.)

**Beat 1 - the name (LOCKED opening)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Kaspa is building vProgs. Verifiable programs. Real apps, on the base layer, on proof of work, and not on an L2.**
🎬 `[SHOW]` Face for the locked line only (frame one of the video is Mike). On "not on an L2" cut to H0, a full-frame motion-type card "vPROGS" with the sub-line "verifiable programs" over dark BlockDAG atmosphere b-roll.

**Beat 2 - what a vProg is, in one breath**

🗣️ `[COVER]` A vProg is an app that runs on its own nodes, keeps its own state, and posts a zero-knowledge proof of that state back to Kaspa.
🎬 `[SHOW]` C4 receipt, a 2s flash of the yellow paper title page ("Kaspa Verifiable Programs (vProg) Protocol Specification, DRAFT v0.0.1"), then a three-node mini version of C1 (vProg nodes → ZK proof → Kaspa) that lights on "posts a zero-knowledge proof".
🗣️ `[COVER]` Now, Kaspa already has smart contracts. Covenants, live on mainnet since June, straight from the core devs. vProgs are the next layer up: whole applications, on a chain that already runs ten blocks, every single second.
🎬 `[SHOW]` C6 receipt flash (docs.kaspa.org/toccata, "active on mainnet as of June 30, 2026" highlighted), then a "10 BLOCKS / SECOND" motion card (text only, H0 family).

**Beat 3 - the thesis (LOCKED landing)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Kaspa is never going to run your app, Kaspa is going to verify it.**
🔒 `[SAY-EXACT]` 🗣️ `[COVER]` And that one flip, is how you get apps on the base layer, with proof of work security, and no L2 in the middle.
🎬 `[SHOW]` On "verify it" cut to a single-word motion card "VERIFY" replacing a struck-through "EXECUTE" (H0 family, text only). Hold the dark atmosphere under the locked line.
💬 `[NOTE]` Keep the loop OPEN: who the provers are, how Kaspa checks the proof, and why this beats an L2 are CH2. Do not preview the rest of the video.
🗣️ `[COVER]` So, let's dive into all this.

> [!IMPORTANT]
> CH1 verify list:
> - "Kaspa already has smart contracts. Covenants, live on mainnet since June" = KIP-17 Covenants (Active) + KIP-16 ZK precompiles, Toccata active on mainnet 2026-06-30 at DAA 474,165,565 (docs.kaspa.org/toccata, primary; C6). Silverscript v1.0.0 (2026-09-09) is the smart-contract language on top; it is named on CH3's ladder, not here.
> - "A vProg is an app that runs on its own nodes, keeps its own state, and posts a zero-knowledge proof of that state back to Kaspa" = yellow paper 2.2 (a sovereign application that owns its accounts), 2.2.1 (the vProg's clients compute its state), abstract + 3.1 (ZK proofs verified by the L1). Plain-language gloss, not a quote; the plain words stay in the VO.
> - "Ten blocks, every single second" = 10 BPS since Crescendo (KIP-14, rusty-kaspa v1.0.0, 2025-05-05). Primary, not drifting. Never inflate to a TPS number (WARNING box 3).
> - "Not on an L2" / "no L2 in the middle" is Sompolinsky's framing (C5 receipt: "vProgs is not L2"). 🔍 [VERIFY] awareness only: the yellow paper's own abstract calls the design "a synchronously composable, zk-based L1/L2 system" and uses the term "L2 gas" internally; Mike's line stays "not on an L2" (the founder's own words) and CH2 explains the difference.
> - "Straight from the core devs" = KIP-16/17/20/21 authors (Sutton, Newman, Safstrom) and the yellow paper authors (Sutton, FreshAir08, Sompolinsky). Do not name any other team.
> - Both face lines are the video's ONLY two face beats. Do not ad-lib a third to camera anywhere.

---

## CH2 - NOT AN L2
**Register:** gear 2 explainer, declarative edges. This chapter TEACHES; every line is cover. One "right?" allowed, no more.
**Title card:** ON, "NOT AN L2". **Music:** Bed B starts (subtle explainer bed, steady, loop-safe).
**Budget:** ~95s, ~255 spoken words.

**Beat 1 - the road Ethereum took**

🗣️ `[COVER]` So, back in 2020, Vitalik laid out Ethereum's plan, and it said it in plain English: all-in on rollups. Your accounts, your balances, your assets, living inside a layer 2, right?
🎬 `[SHOW]` C9 receipt: the ethereum-magicians post, title "A rollup-centric ethereum roadmap", date Oct 2020, the "all-in on rollups" sentence highlighted. Real-site capture, never restyled.
🗣️ `[COVER]` And every rollup is its own chain. Its own sequencer, the machine that orders your transactions. Its own bridge. Its own slice of the liquidity.
🎬 `[SHOW]` C2 contrast graphic, LEFT column ("THE L2 STACK") reveals one row per spoken cost: own chain → own sequencer → bridge to L1 → liquidity split per L2. Right column stays dark for now.
🗣️ `[COVER]` And every one of those pieces, is a place for something to break. And a place for your liquidity to get split up.
🎬 `[SHOW]` C2 LEFT column: a thin red "attack surface" outline pulses around the sequencer and bridge rows on "break"; the liquidity row splits into fragments on "split up".
🗣️ `[COVER]` Now, Kaspa's founder, Yonatan Sompolinsky, looked at all of that. And back in December, he said the whole point of vProgs, was to avoid the obsolete path of L2s. His words, not mine.
🎬 `[SHOW]` C5 receipt: the Kaspa Magazine paragraph (2025-12-17), cropped, with "Kaspa vProgs' primary motivation was to avoid the obsolete path of L2's" highlighted. Capture the kasmagazine page, not the X post.
🗣️ `[COVER]` And he hasn't softened on it.
💬 `[NOTE]` STRUCK 2026-09-27 (Mike, spine review): the podcast quote line ("This August, on the Bitcoin Takeover podcast ... very bearish on rollups") was recorded with the wrong word and is CUT from the spine; the beat ends on "softened on it." and moves to the machine.

**Beat 2 - the machine (C1, the centerpiece diagram)**

🗣️ `[COVER]` So here's how a vProg actually works.
🎬 `[SHOW]` C1, THE system-design diagram, fills the frame: nodes USERS → KASPA L1 [orders (sequencer) · stores (data availability + state index) · checks proofs (ZK verify) · meters (resource metering)] ↔ vPROG A NODES / vPROG B NODES ↔ PROVERS. All nodes dim; spotlight ONE node at a time as spoken. Every label traces to DATA.md §2 Pillar 2.
🗣️ `[COVER]` You send a transaction, and you declare up front which accounts it reads, and which ones it writes.
🎬 `[SHOW]` Spotlight USERS; the transaction shows two little tags "reads" / "writes".
💬 `[NOTE]` Trim-first: the "declare up front" line.
🗣️ `[COVER]` Kaspa does four jobs. It orders every transaction, so Kaspa itself is the sequencer. It stores the data. It checks the proofs. It meters the work. What it never does, is run the app.
🎬 `[SHOW]` Spotlight KASPA L1; its four job labels light one by one on each sentence (orders · stores · checks proofs · meters). On "never does, is run the app" a struck-through "EXECUTE" label flashes red and drops.
🗣️ `[COVER]` The app runs on its own nodes. Every vProg owns its own accounts, and it's the only thing allowed to write to them.
🎬 `[SHOW]` Spotlight vPROG A NODES; its account set A_p shows a lock icon "write: vProg A only / read: anyone".
🗣️ `[COVER]` And provers, for-profit operators, post a zero-knowledge proof back to Kaspa. That's a math receipt that says this state is correct, and Kaspa checks the receipt instead of redoing the math.
🎬 `[SHOW]` Spotlight PROVERS; an arrow carries a "ZK PROOF" token into KASPA L1, where "checks proofs" pulses green. Then the whole C1 diagram lights up once, all nodes, for ~3s.

**Beat 3 - what the design buys you**

🗣️ `[COVER]` And this buys you two things. Sovereignty: if another app breaks, yours keeps running. And composability: apps can read each other's state, and a transaction that touches two apps goes through as one unit, or not at all.
🎬 `[SHOW]` C2 RIGHT column ("vPROGS") now reveals row by row: one sequencer = Kaspa · one state index · proofs verified in consensus · sovereign apps · synchronous composability. Left column dims.
🗣️ `[COVER]` And enshrined just means the rules for checking all of this, live inside Kaspa's consensus itself. Not on some other chain.
🎬 `[SHOW]` C6 receipt: docs.kaspa.org/toccata, "It is active on mainnet as of June 30, 2026" + "ZK Precompiles: Direct verification of Groth16 and RISC Zero Succinct proofs inside script" highlighted. Real-site capture.

> [!IMPORTANT]
> CH2 verify list:
> - Vitalik quote is verbatim from ethereum-magicians (2020-10-02): "all-in on rollups"; "users have their primary accounts, balances, assets, etc entirely inside an L2." Do NOT claim Ethereum "has no L1 verification" (rollups post proofs to L1 too); the contrast is separate chains + sequencers + bridges vs one sequencer + one state index (DATA.md Pillar 1 note).
> - "Sequencer" is glossed in-line ("the machine that orders your transactions"). Keep the gloss when recording; no unglossed jargon.
> - "A place for something to break" = Sompolinsky on keeping the "attack surface minimal" (via kasmagazine 2025-12-17); "liquidity to get split up" = yellow paper 1.1 "prevent economic fragmentation" + Sompolinsky "where should I deploy my liquidity". Qualitative only, no bridge-hack figure (WARNING box 5).
> - Sompolinsky quotes: "avoid the obsolete path of L2's" (via kasmagazine 2025-12-17, HIGH on wording, original X post not opened); "For the record, I'm very bearish on rollups" (Bitcoin Takeover S17 E36, published 2026-08-11). 🔍 [VERIFY] the receipt-capturer captures the kasmagazine page for the first; the second is a quote card sourced to the episode page.
> - C1 labels: sequencer / data availability / ZK verify / state index / resource metering are the yellow paper's terms (1.2, 2.4, 3.1, 3.2, 3.3); the plain words (orders / stores / checks proofs / meters) are the spoken glosses and sit beside the terms on the container, never replacing them. "Four jobs" is the spoken count; the state index rides under "stores" on the container.
> - "Provers, for-profit operators" = yellow paper §6 "for-profit entities." "It's the only thing allowed to write to them" = 2.2 "Only the executable exec_p of the owning vProg p has write-access."
> - "If another app breaks, yours keeps running" = 1.2 "the liveness of a vProg is never compromised by the fault of others."
> - Composability honesty: 2.2 says an account "may be read by any vProg," but 5.3 makes reads opt-in per vProg ("strictly under the control of each vProg"), and FULL synchronous composability is the long-term spec ("TBD milestones"). The line says "apps can read each other's state," not "any app can read anything," and CH3 makes clear full vProgs are under construction. Do not upgrade it to "already works" at record time.
> - "Enshrined" = yellow paper §3 "L1 Consensus Modifications" (ZK verify 3.1, L2/scope gas 3.2, state index + stitching covenant 3.3). Toccata activation: 2026-06-30, DAA 474,165,565 (docs.kaspa.org/toccata, primary). The DAA number stays on-screen text only, never spoken.
> - Nothing in this chapter names an app, a team, an L2, a TPS figure, or a gas token (WARNING boxes 3, 4, 6).

---

## CH3 - WHERE IT STANDS
**Register:** gear 3, epic ladder then conviction. Declarative, no hedge, all upside conditional. Still all cover, no face.
**Title card:** ON, "WHERE IT STANDS". **Music:** Bed C starts (epic, rising, RIGHT-ALIGNED so its epic_hit ending lands on the last spoken word).
**Budget:** ~45s, ~125 spoken words.

**Beat 1 - the ladder (C3)**

🗣️ `[COVER]` Now, where does this actually stand. Look at this ladder.
🎬 `[SHOW]` C3, the animated ladder timeline (code-built): rungs land one at a time as spoken. Shipped rungs solid, planned rungs dashed.
🗣️ `[COVER]` May 2025, Crescendo, ten blocks a second. September, the yellow paper, first draft. June 30th of this year, Toccata: zero-knowledge verification and covenants, live on mainnet, inside Kaspa's consensus. And September 2026, Silverscript 1.0, the smart contract language, official release.
🎬 `[SHOW]` C3 rungs: CRESCENDO 2025-05-05 "10 BPS" → YELLOW PAPER 2025-09-11 "DRAFT v0.0.1" → TOCCATA 2026-06-30 "ZK verify + covenants LIVE" → SILVERSCRIPT 1.0 2026-09-09. All solid.
🗣️ `[COVER]` Next rung, the first standalone ZK apps. Above that, full vProgs, still under construction, and kaspa.org says so in plain text.
🎬 `[SHOW]` C3 dashed rungs: NEXT "standalone based ZK apps" → "FULL vPROGS: in construction" → top rung "DAGKNIGHT: proposed (KIP-2)" dashed and dim (on the graphic only, not spoken). Then C7 receipt: kaspa.org/build card with vProgs "In construction" and "Full vProgs remain a future direction" highlighted.
🔍 `[VERIFY]` At render, re-open kaspa.org/build: if the vProgs status has moved past "In construction," rewrite this line and the C3 rung before capture.
🔍 `[VERIFY]` "Silverscript 1.0, official release" = GitHub tag v1.0.0 published 2026-09-09; re-check for a newer tag at render and keep the spoken version number matching the C3 label.
💬 `[NOTE]` Trim-first: "and kaspa.org says so in plain text" (the C7 receipt makes the point on its own).

**Beat 2 - he called it**

🗣️ `[COVER]` And in December, Sompolinsky said the covenant fork was three to six months out. It shipped in June.
🎬 `[SHOW]` C3 pulses the TOCCATA rung; a small stamp "called Dec 2025 · delivered Jun 30 2026" (text only, from DATA.md Pillar 4 table).

**Beat 3 - conviction + close**

🗣️ `[COVER]` Everyone is racing to control compute, and money. The more they race, the more a layer nobody owns is worth. Proof of work money, with apps on it, and no L2 in the middle.
🎬 `[SHOW]` Pull back to the full C1 diagram, all nodes lit, Kaspa L1 glowing greenish cyan; slow push-in. Bed C climbs.
🗣️ `[COVER]` Click the like button, comment what you'd build on it, and click the link in the description to get involved in the best community ever. I'm gonna catch you guys, later.
🎬 `[SHOW]` End card: Kaspa logo bug + community link lower-third over the C1 diagram. Bed C epic_hit lands on "later."
💬 `[NOTE]` If Mike calls a HARD-OUT instead of the CTA: the take ends on "no L2 in the middle." and the edit cuts to black on the epic hit, no end card. Decide at GATE 1 (Open question 2).

> [!IMPORTANT]
> CH3 verify list:
> - Ladder dates (all primary, DATA.md Pillar 4): Crescendo 2025-05-05 (rusty-kaspa v1.0.0, KIP-14) · yellow paper commit 2025-09-11 · Toccata active 2026-06-30 (docs.kaspa.org) · Silverscript v1.0.0 2026-09-09 (GitHub release). "Standalone based zk apps" is Sutton's own term (2026-04-11, via kasmagazine); the rung label keeps his lowercase "based".
> - "He called it": Sompolinsky, 2025-12-17 via kasmagazine, expected the covenant hard fork in "3 to 6 months"; Toccata activated 2026-06-30. Use ONLY as a delivered call, never as a live forecast (DATA.md §4).
> - "Full vProgs, still under construction" = kaspa.org/build "In construction" + "Full vProgs remain a future direction" (read 2026-09-17). 🔍 [VERIFY] live at render (see Beat 1).
> - DAGKnight is on the C3 graphic as "proposed (KIP-2)" only; never spoken, never "faster" (WARNING box 6).
> - The conviction beat contains no price, no target, no multiplier, no named app or team; "the more a layer nobody owns is worth" is Mike's neutral-layer thesis (persona core_theses), stated as a view, not a promise.
> - No day-relative words on screen: the C3 labels carry full dates, not "this month."

---

## MUSIC-MOOD-PLAN

Three beds, one per chapter, so both title cards land on a bed change (Convention 2) and music covers every second of runtime (longform-edited.md #10; loop any bed shorter than its span, no silent stretch). Tracks are PICKED here from `assets/music/library.json` meta only (music-sourcing §2c). **Exact in-points, loop points, right-alignment offsets, the breath at each bed change, dB-under-VO and ducking are carved by `music-placement-strategist` against the FINAL spine's waveform, not here.**

| CH | Bed | Mood / gear | Intent | New bed? | Shortlist (library id, why) |
|---|---|---|---|---|---|
| CH1 | **Bed A** | dark-epic cinematic, gear 3 | **AGGRESSIVE**: hits cold on the first spoken word, big percussion under the hook, sustains through the two face lines and the "two doors" beat | **STARTS** (video open) | **`down-to-the-wire`** (Rhythm Scott, 128 bpm, C minor, aggr 93, opening cold_hot, peak 0 to 46s covers the whole chapter, epic/building/intense/dark, unused so far) · alt `retribution` (cold_hot, dark brooding orchestral, aggr 67; used as the bittensor CH1 open, fine to reuse) · alt `born-every-minute` (cold_hot D&B, Tron/Matrix tech feel, aggr 92) · alt `common-high-speeds` (cold_hot driving tech driver, the silverscript hook bed) |
| CH2 | **Bed B** | steady tech underscore, gear 2 | **SUBTLE**: sits well under the VO, no big transients while the C1 diagram is being explained, loop-safe for ~95s | **STARTS** → card "NOT AN L2" | **`accomplishments-subtle`** (Mike-designated for non-hype explanatory passages; 306s so no loop needed; env steady 7 to 8; free_local, no license code, which is fine because longform does not post to YouTube) · alt `focuser` (Neon Beach, 110 bpm, electronic cinematic underscore, cold_hot so it can start right on the card, steady peak 0 to 140s) · alt `tesseract` (Cody Martin, 82 bpm, dark electronic underscore, aggr 55, loud mean so it needs pulling down further) · alt `lightbeams` (chill atmospheric synthwave, aggr 86, resolve ending) |
| CH3 | **Bed C** | epic rising, gear 3 | **AGGRESSIVE by the end**: starts under the ladder at mid energy, climbs through "he called it," and the track's **epic_hit ending is RIGHT-ALIGNED to the last spoken word** (the bittensor CH8/9 pattern) | **STARTS** → card "WHERE IT STANDS" | **`fortitude`** (ltebloomr, 117 bpm, F# minor, aggr 58, opening steady, ending epic_hit, "epic, soaring," inspiring/suspenseful, 121s, unused) · alt `a-champion-from-the-ashes` (inspiring/hopeful, ending epic_hit, peak 58 to 154s, right-align so the peak covers the 45s) · alt `underworlds` (darker, aggr 93, ending epic_hit) · alt `revenant` (epic_hit, soaring; used on the Kaspa founder video CH1, reuse only if variety does not matter) |

Notes for the placement agent:
- Bed A → Bed B breath sits at the CH2 card; Bed B → Bed C breath at the CH3 card. Both cards need a readable ≥1s hold, so the breath and the card share the same window.
- CH1 has NO b-roll dialogue inserts, so no duck windows there; CH2's C1 spotlight sequence has no SFX-heavy hits planned, keep Bed B flat.
- Right-align Bed C so the hit lands on "later." (CTA close) or on "middle." (hard-out variant); the choice depends on Mike's GATE 1 ruling.
- Measure LUFS first; beds are mastered hot (`down-to-the-wire` mean -12.3 dBFS, `accomplishments-subtle` -13.1, `fortitude` -9.9), target ~16 to 18 dB under the VO.
- Soundstripe license codes matter for YouTube descriptions only; this longform goes to Rumble / BitChute / Facebook, but record the codes in the project log anyway in case a YT cut is made later.

---

## VISUAL-PLAN

Pointers for `coverage-strategist` (full BROLL-PLAN comes later). Charts guardrail: numbers WE control → our own code-rendered containers; real market/site data → real-site receipts; NEVER an AI image as the source of a number or a label. Every label on C1, C2, C3 traces to DATA.md §2.

**Marquee (build these first):**
- **C1, THE system-design diagram (CH2 Beat 2, the centerpiece).** Code-rendered HTML/SVG container, full frame. Nodes: USERS → KASPA L1 [orders (sequencer) · stores (data availability + state index) · checks proofs (ZK verify) · meters (resource metering)] ↔ vPROG A NODES / vPROG B NODES ↔ PROVERS. Design states: (1) all dim, (2) USERS lit, (3) KASPA L1 lit with its four job labels lighting one by one and a struck-through "EXECUTE" dropping out, (4) vPROG A lit with the write-lock on its accounts, (5) PROVERS lit with a "ZK PROOF" token flowing into KASPA L1, (6) all lit. Role colors: Kaspa L1 = greenish cyan, vProg nodes = indigo, provers = amber, the struck "EXECUTE" = red. It returns in CH3 Beat 3 as the closing image (a diagram may hold while explained; this is its one callback).
- **C2, "THE L2 STACK vs vPROGS" contrast (CH2 Beats 1 and 3).** Code-rendered, animated row-by-row reveal. Left: own chain / own sequencer / bridge to L1 / liquidity split per L2. Right: one sequencer = Kaspa / one state index / proofs verified in consensus / sovereign apps / synchronous composability. Text only, no numbers. Left reveals in Beat 1, right in Beat 3 (two separate spots, a deliberate callback, declare it in the comp).
- **C3, the ladder timeline (CH3 Beat 1, animated chart, `useCurrentFrame`).** Solid rungs: CRESCENDO 2025-05-05 "10 BPS" · YELLOW PAPER 2025-09-11 "DRAFT v0.0.1" · TOCCATA 2026-06-30 "ZK verify + covenants LIVE" · SILVERSCRIPT 1.0 2026-09-09. Dashed rungs: "standalone based ZK apps (next)" · "FULL vPROGS: in construction" · "DAGKNIGHT: proposed (KIP-2)". Plus the Beat 2 stamp "called Dec 2025 · delivered Jun 30 2026" on the Toccata rung.

**Hook graphics (CH1, text only, code-rendered motion type):**
- **H0**: "SMART CONTRACTS. NO L2." full-frame type over dark BlockDAG atmosphere, then a live "10 BLOCKS / SEC" readout; later the "EXECUTE" (struck) → "VERIFY" swap under the thesis line.
- **H1**: the two-door container (DOOR 1 "every node runs every app" / DOOR 2 "apps on a separate chain: own sequencer, bridge"), both slam shut on "neither."

**Receipts (real-site captures, `receipt-capturer`, four in the cut plus one flash):**
- **C4** yellow paper title page (CH1, 2s flash) · **C9** Vitalik's rollup-centric roadmap post (CH2 Beat 1) · **C5** Kaspa Magazine paragraph with the "obsolete path of L2's" quote (CH2 Beat 1) · **C6** docs.kaspa.org/toccata activation + ZK precompiles (CH2 Beat 3) · **C7** kaspa.org/build "In construction" card (CH3 Beat 1). Plus one text-accurate quote card for the podcast line (source label on the card).

**Atmosphere / b-roll layer (AI or Envato, text-free only):** dark BlockDAG / node-mesh atmosphere under CH1; a subtle circuit/lattice loop behind C1's dim states; nothing with legible text or numbers.

**Dropped from the CHART-SOURCE INDEX (with reasons, never silent):**
- ~~C8~~ GitHub vprogs repo header: the 3:00 window is full; its star/fork counts are live-drift anyway. Revisit only if Mike wants a "daily commits" beat.
- ~~C10~~ Sutton's milestone stepper: superseded by C3's dashed rungs, which carry the same "you are here."
- ~~C11~~ rusty-kaspa v2.0.0 release page: C6 (docs) already receipts the Toccata activation.
- ~~C12~~ KAS price chart: no price beat in this video (Open question 5).
- ~~C13~~ Silverscript release page: the C3 rung carries it; no runtime for a receipt.
- ~~C14~~ Sutton "standalone based zk apps" quote: it names the C3 rung label; a receipt would push CH3 past budget. Swap in for C7 if Mike prefers the quote to the status card.
- ~~C15~~ block-cadence ladder (BTC / ETH / Kaspa): no "why speed matters" beat in this cut.

---

## OPEN QUESTIONS / NEXT SESSION

**Mike decides at GATE 1:**
1. **Title.** "Kaspa vProgs: Smart Contracts Without an L2" (matches the hook) vs "The Kaspa Upgrade Nobody Is Pricing In" vs "vProgs, Explained in 3 Minutes."
2. **CTA close vs hard-out.** Written as the persona CTA (like + comment + community link, "I'm gonna catch you guys, later"). Hard-out variant ends on "no L2 in the middle." and cuts to black on the epic hit; Bed C right-aligns to whichever last word wins.
3. **Card text.** "NOT AN L2" and "WHERE IT STANDS" as proposed, or "HOW A vPROG WORKS" for CH2.
4. **The two face lines, verbatim.** Both are tight pairs (hook: two short sentences; thesis: one comma-joined sentence). Confirm the wording or hand back edits; they are the only locked lines in the video.
5. **No price beat, no "KAS as gas" line, no named apps, teams or L2s** (DATA.md Open questions 2, 5, 8). This screenplay omits all three; confirm the omissions.
6. **The podcast line** ("For the record, I'm very bearish on rollups") rides as a quote card sourced to the episode page; keep, or trim-first.
7. **Original X posts on screen?** Sompolinsky's and Sutton's X posts could not be opened by the researcher (402 / Cloudflare). This plan captures the Kaspa Magazine pages that printed the quotes. If Mike wants the original tweets, `receipt-capturer` needs a logged-in browser and must match the wording to the kasmagazine text.

**Live 🔍 [VERIFY] checklist (re-pull before record and again at render, from DATA.md):**
- kaspa.org/build vProgs status still "In construction" / "Full vProgs remain a future direction" (CH3 Beat 1 line + C3 rung + C7 receipt).
- Silverscript latest release tag (spoken "1.0" and the C3 label must match; v1.0.0 as of 2026-09-09).
- kaspanet/vprogs repo activity (not on screen unless C8 is revived; last push 2026-09-17).
- The DAGKnight rung stays "proposed (KIP-2)" unless KIP-2's status changes.
- docs.kaspa.org/toccata still shows the June 30, 2026 activation wording for the C6 crop.
- Persona spelling sweep on every on-screen label before build: vProgs (capital P), GhostDAG, DAGKnight, Kaspa, $KAS, Silverscript, Toccata; Whisper mishears to expect on the take: "Takata" → Toccata, "Casper" → Kaspa, "V progs" → vProgs.
- Runtime: ~500 spoken words across the three chapters (~120 / ~255 / ~125). If the take lands over 3:10, the trim-first lines (podcast line, "declare up front," "kaspa.org says so in plain text") come out first and nothing else.

**Next session (after GATE 1 approval):** build C1 / C2 / C3 / H0 / H1 as standalone full-frame containers (`chart-builder`, `slide-builder`), capture C4 / C5 / C6 / C7 / C9 (`receipt-capturer`), then record off this screenplay into `raw/` with exactly two takes to camera and everything else read as cover.
