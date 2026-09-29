# kaspa-vprogs — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created 2026-09-17 by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "kaspa-vprogs"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

PROPOSED concept brief (drafted by the orchestrator 2026-09-17; Mike rules on it at GATE 1 together with DATA.md and the screenplay).

**Working title:** "Kaspa vProgs: Smart Contracts Without an L2" (alternatives for Mike: "The Kaspa Upgrade Nobody Is Pricing In" · "vProgs, Explained in 3 Minutes").
**Track:** longform-edited (16:9). **This is the FIRST video through the longform LangGraph** (the live bless of `video-creation/longform-edited/graph/`).
**Archetype:** EPIC informative explainer. **Runtime target: 3:00** (hard window 2:50 to 3:10).
**Spine architecture:** full-screen GATED face (longform-edited.md house rule #6). **Captions ON.**
**Register:** gear 3 (epic / declarative) for the CH1 hook and the CH3 close; gear 2 (polished explainer) for the CH2 body.

**Opening thesis (every claim to be verified in DATA.md before it airs):** Kaspa is bringing programmability, smart-contract-style apps, to its layer 1 through vProgs: a "verification-oriented programmability layer enshrined in L1" (Yonatan Sompolinsky, "not an L2"). The idea to explain: the L1 VERIFIES program state instead of every node EXECUTING every program, so apps inherit Kaspa's speed and proof-of-work security without an L2's bridge risk, sequencer trust, or fee leakage. Angle: bullish conviction, explainer first; all upside stays conditional (persona verified_claims_only).

**Pillars (each needs DATA.md facts; if one cannot be sourced from primary material, the research says so and the screenplay drops or softens it):**
1. The problem vProgs solve: why Kaspa did not just bolt on an EVM or lean on L2s (throughput, security, liquidity fragmentation, bridges). Contrast with Ethereum's rollup-centric roadmap.
2. What a vProg IS, in plain language: the verification-oriented model (L1 verifies, programs compute), who runs the programs, how state and data availability work, what "enshrined in L1" means, what changes for a user and for a dev. ONE system-design diagram carries this.
3. Why it matters and what it unlocks: composability with KAS as the settlement and gas asset, no L2 tax, DAGKnight-era confirmation speed, the app classes people expect (DeFi, stablecoins, tokens). Conditional language.
4. Where it stands: the timeline (Michael Sutton: live "within the next year", as of the source's date, [VERIFY]), research and dev status (papers, GitHub, KIPs, testnets), shipped vs planned. Anything stale goes to do-not-air.

**Chapter map (3:00):**
- CH1 (0:00 to ~0:35) HOOK, gear 3. Opens on Mike's face for the hook line (FACE beat 1), lands the thesis on his face (FACE beat 2), then COVER for the rest of the video. No cold open: CH1 IS the opening.
- CH2 (~0:35 to ~2:15) WHAT A vPROG IS, AND WHY NOT AN L2, gear 2, all COVER: system-design containers spotlight-swapped one point at a time, one animated chart (for example the "L1 verifies vs L2 executes" contrast, or a confirmation-time ladder), receipts of the primary sources.
- CH3 (~2:15 to 3:00) WHERE IT STANDS + CONVICTION CLOSE, gear 3, COVER. Standard persona CTA close (comment ask + community plug) unless Mike calls a hard-out.
Title cards fall out of the music bed map (screenplay.md Convention 2: a card only where a new bed starts).

**Open decisions for Mike at GATE 1:** the title; CTA close vs hard-out; whether to name specific apps or teams building on vProgs; anything the research flags as unresolved.

## Hard constraints (Mike)

- Runtime 3:00 (accept 2:50 to 3:10). Three chapters, no mid-roll plug.
- EXACTLY TWO [FACE] beats in the whole video, both in CH1's opening: the hook line and the thesis landing. Everything else is [COVER]. Do not add a third face beat anywhere, including the close (the graph counts the tagged [FACE] lines and refuses more than two).
- Every on-screen number, date, name and quote comes from DATA.md; live-drift figures carry [VERIFY]; nothing is invented.
- Spell it "vProgs" (capital P); Kaspa terminology per persona/persona.json (GhostDAG, DAGKnight, KAS); Kaspa is never "Casper".
- No em dashes anywhere. Verified-claims-only framing for any upside. Never frame Mike's past calls as mistakes.
- Follow the canonical skills exactly (screenplay.md Convention 5 tagged lines, one job per line); the graph verifies the file from disk.

## Decisions

- **2026-09-17 — created.** Working title: Kaspa vProgs: Smart Contracts Without an L2. Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).

## Open flags (load-bearing)

- (none yet)

- **2026-09-27 - spine cut at Mike's call (GATE 2b review).** The Sompolinsky podcast line was recorded as "very
  BULLISH on rollups" (the sourced quote is "bearish"); rather than a pickup, the whole sentence "This August, on
  the Bitcoin Takeover podcast ... on rollups." is cut (81.655 to 89.975 on `ALL.e.desilenced.mp4`, both edges in
  silence troughs), so CH2 Beat 1 now ends on "And he hasn't softened on it." and moves to the machine beat.
  Output `spine/ALL.f.cut.mp4` (13a letter chain), re-transcribed by the graph. SCREENPLAY CH2 Beat 1's podcast
  line + quote card are struck accordingly.

## 2026-09-28 GATE 3 music rulings (Mike)
- Title-card pauses: 1.5 s each (>= the 1 s readable minimum), as the music plan assumed.
- Bed A in-point: 0.91 kept (hit on the NO L2 IN THE MIDDLE picture slam at 37.94; 0.5 s swell on frame 0 accepted). Delegated to the orchestrator.
- Vibe-cut duck: ONE only, on "It shipped in June" 177.66. No duck on the 187.72 hammer line. Delegated to the orchestrator.
- Levels: 5 dB deeper than proposed across all three beds (A -22 / B -23 / C -22 dB under the VO), ratios kept. Remotion gains in MUSIC-PLAN.json updated to match.
- Bed B (Accomplishments) kept as the pinned explainer bed, placed deep; revisit only if it pokes through in chunk QA.
- License codes: Bed A XYZW1UVUQWIPXVXF, Bed C X0AVOCNCPEKOUPW8, Bed B free_local (none). YouTube descriptions only, if a YT cut is ever made.

## 2026-09-28 assets round 1: visual-qa 67/84 PASS, 17 FAIL, rebuilt with the defects as feedback
- Recaptured: R3, R4, R5, R7, R8 (crops sliced glyphs at the edges, missing highlights, unrelated content in frame). R8 wording: the page says "three to six months" in words; any stamp/quote must match.
- Re-sourced: BR-3 (flat overcast grade, luma 2-3x every other cover; the crack never happens on screen).
- Regenerated: IMG-2 (hands overlapping the plane contradicted "untouched").
- Rebuilt diagrams: vprog-loop-mini and c1-kaspa-four-jobs (teal headline accent is brand-only, video accent is green; EXECUTE row overflowed the L1 box).
- Round 2 visual-qa: 74/85 PASS. Rebuilt again: IMG-2 (hands still touched the plane), vprog-loop-mini + c1-kaspa-four-jobs (palette and overflow fixed; an 8 px top-accent-bar nub past the rounded corner remained). Highlights are baked into the recaptured receipts; clean plates on request.

## 2026-09-28 chart-builder round 3: accent-bar corner nub fixed across the chart family
- Round-2 must_fix (vprog-loop-mini x4, c1-kaspa-four-jobs x6) was the `.node .top` accent bar sticking out as a straight nub past the card's rounded top-left corner. Fix: the bar now lives in a clip box at the card's OUTER shape (`inset:-2px; border-radius:22px; overflow:hidden`) with the 4 px gradient as `::before`, so it follows the corner. The node stays `overflow:visible` (the EXECUTE drop needs it).
- The SAME latent nub was on the round-2 PASSES c1-overview, c1-provers, c1-vprog-nodes, composability-card (same base CSS; visual-qa did not flag it there). Fixed and re-shot too, so the c1-overview -> four-jobs push-in match does not jump between a nub and a clean corner. These 18 PNGs need re-QA; only the top-left accent corner changed.
- The CSS fix is also in c2-l2-stack, c3-next-rungs and charts/c3-ladder (keeps the base CSS byte-identical), but those have no accent-bar element, so their pixels cannot change and they were not re-shot.
- IMG-2 concept revised (orchestrator, 2026-09-28): the reaching-hands composition failed visual-qa twice (fingers drawn over the plane, horror tone). New concept: the lone layer high above towers whose searchlight beams stop short, no hands. Same beat, same thesis.
- Round 4: IMG-2 (revised concept) PASS. visual-qa re-checked the whole folder unasked and flagged pow-money-hammer (word gap 'Proof ofwork', missing divider, coin over the card corner); rebuilt by slide-builder with the feedback. Node merge now keeps one verdict per file, newest wins.

## 2026-09-28 cover ruling (Mike)
- DELIVERED stamp on the R8 receipt at 177.66: APPROVED. Quote wording on screen matches the page ('three to six months').

## 2026-09-28 blueprint rulings (Mike)
- Hook kick under 'Kaspa' at 0:00.0: keep, drop only if chunk QA shows it masks the word.
- Vibe-cut duck depth: -4.2 dB per the automation row; MUSIC-PLAN prose aligned.
- Bed C closing hit on the ONSET of 'later.' (202.10), as planned.
- Ending: the recorded call to action, as built.

## 2026-09-28 build stage
- Card pauses: 1.5 s baked at the desilencer joins 40.22 and 137.46 (snapped from 137.58; CH3 trough is 137.45-137.48) -> spine/ALL.g.paused.mp4 (205.85 s) = assets/spine.mp4.
- Captions: F1 only (7.33 s hold). F2 (3.77 s) is under the 5 s trigger (captions.md), so the blueprint's F2 caption rows were corrected to OFF.
