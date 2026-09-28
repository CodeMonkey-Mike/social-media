# kaspa-vprogs - BROLL-PLAN (acquisition + build worklists)
_Rendered 2026-09-28 from `COVER-PLAN.json` (the coverage-strategist's proposal, gated by Mike at GATE 3) by `scripts/render_cover_plan.py`. Format owner: `skills/edit-plan-and-cue-sheet.md` §0. Every row is PLACED at the beat named, or marked REJECTED / BENCH: zero orphans. Status ticks are updated by the asset factory as it builds._

**Budget:** Envato video 4/10 · ChatGPT images 3/5. Envato 4/10 (E1 4.0s, E2 1.4s, E3 3.2s, E4 2.86s; none over 4s, none reused). ChatGPT 3/5 (G1 2.3s, G2 3.36s, G3 1.9s; text-free, none a source of a number). Deliberately under the caller's cap: house rule #2 budgets ~5 video + 5 image for an ELEVEN-minute video, so 7 punches on a 3:23 spine is already dense; the machine + benefits beats (81.70-137.58) are b-roll-free by design and 3 bench slots are named if Mike wants more. Receipts 8 (R1-R8, separate device, each a distinct file used once; R4/R8 are two different crops of one page). Containers 19 incl. 2 title cards, no container appears twice, C1 / C2 / C3 full diagrams each appear exactly ONCE then break into spotlight containers (THE BALANCE; lint_slide_balance clean). Zero orphans: FACE 0.000-7.333 and 28.167-31.933; cover slots run consecutively 7.333-9.5-14.54-21.22-25.22-28.167 | 31.933-38.82-40.22 | 40.22-52.18-64.6-67.8-72.96-81.7-94.5-100.42-106.9-112.06-118.38-123.34-130.44-137.58 | 137.58-139.84-160.34-163.28-169.78-172.84-178.54-181.4-184.76-188.64-195.1-196.98-202.822, so every non-FACE second of the 202.822s spine is assigned, no gap, no black, every cover tIn snapped to a transcript word boundary (rule zero). Title-card pauses (>=1s each at 40.22 and 137.58) are edit-time inserts; all downstream cues shift via sh().

## HOLDS before licensing (Mike rules at GATE 3)
- [ ] Under-budget by design (4/10 Envato, 3/5 ChatGPT). Say the word and these bench slots go in as sequenced items: Envato 'server rack nodes blinking' at 100.42-102.34 (then c1-vprog-nodes runs 102.34-106.9, 4.56s, just under the 5s card floor), Envato 'receipt printer' at 112.06-115.38, Envato 'crowd cheering' at 188.64-191.22.
- [ ] The screenplay's C1 full-diagram callback on the conviction beat (184.76-188.64) is DROPPED: a full diagram slide shown twice fails lint_slide_balance and 3.9s is under the 10s diagram floor. Replaced by the pow-money-hammer type card. Overrule = a declared waiver in the comp.
- [ ] C2's RIGHT column is never shown as a column; sovereignty-card + composability-card are its break-up. Alternative if you want the A-vs-B payoff on screen: the full C2 contrast (left dimmed, right revealing row by row) at 118.38-130.44, declared // COMPARISON_REFS (the one sanctioned two-cards-at-once case).
- [ ] Three sub-floor type cards: ten-bps-card 2.95s, pow-money-hammer 3.9s, sovereignty-card 4.96s (one-glance hammer type / H0 family). Confirm, or the benches lengthen them.
- [ ] R8 (kasmagazine '3 to 6 months' paragraph) rides on DATA.md's citation of that article; receipt-capturer must confirm the exact wording is on the page. The 'DELIVERED 2026-06-30' stamp landing on the receipt at 177.66 is a proposed on-receipt motion device (not a house-standard treatment); yes/no.
- [ ] R1 capture method: GitHub's PDF viewer may not render page 1 at full width; fallback is page 1 of the mirror PDF rendered to PNG (same document, same title page).
- [ ] Live [VERIFY] at capture (AS-RECORDED): kaspa.org/build still 'In construction' (R7 + c3-next-rungs + the 168.56 line), Silverscript latest tag still v1.0.0 (R6 + c3-ladder rung must match the spoken '1.0'), docs.kaspa.org/toccata activation wording (R5), KIP-2 still Proposed (DAGKnight rung).
- [ ] R2 uses the rusty-kaspa v2.0.0 GitHub release (dropped as C11 in the screenplay) for CH1's 'straight from the core devs' beat, leaving C6 (docs) for CH2 Beat 3. If you prefer the screenplay's C6 flash in CH1, R5 becomes a second, distinct crop of the docs page (ZK Precompiles only).
- [ ] Sompolinsky gets a text-accurate name card, no photo (his X page could not be opened; DATA.md). If you want his face on screen, receipt-capturer needs a logged-in capture of the X profile header.
- [ ] No LINE-CAPTION overlay is proposed (1 of 4 video covers would be 25%, above the 10-20% cap). If Envato goes to 6+, one caption on E4 ('EVERYONE IS RACING TO CONTROL COMPUTE AND MONEY') fits the cap.

## Envato video (4) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)

| id | Beat (final spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | CH1@21.2-25.2 | abstract glowing layers stacking upward dark 3d / translucent glass planes rising dark background teal | 4.00s | any | ☐ pending |
| BR-2 | CH1@38.8-40.2 | glass shattering slow motion black background / cube exploding fragments dark | 1.40s | any | ☐ pending |
| BR-3 | CH2@64.6-67.8 | ice cracking aerial drone frozen lake fracture / cracked ice breaking apart top view | 3.20s | any | ☐ pending |
| BR-4 | CH3@178.5-181.4 | data center server corridor dolly dark blue lights (leading motion) | 2.86s | any | ☐ pending |

## ChatGPT images (3) - house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text (agent: image-gen)

_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `schedule-tweets/images/reference/`, or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._

| id | Beat (final spine) | Prompt concept | Reference | Status |
|---|---|---|---|---|
| IMG-1 | CH3@137.6-139.8 | Tall glowing greenish-cyan ladder rising out of dark fog into a near-black sky of faint interconnected node-lights (BlockDAG mesh), low angle, Pixar-style film-quality 3D, deep navy near-black background, dramatic rim lighting, no text, 16:9 | none exists (generic approved) | ☐ pending |
| IMG-2 | CH3@181.4-184.8 | One translucent greenish-cyan plane (a layer) hovering untouched in a dark void with faint node-lights inside it, giant dark monolithic towers and reaching hands straining up from below and falling short, rim-lit, film-quality 3D, no text, 16:9 | none exists (generic approved) | ☐ pending |
| IMG-3 | CH3@195.1-197.0 | A Kaspa coin showing the backwards-K (mirrored-K) Kaspa logo, glowing greenish-cyan (never gold), rising like a sun over a dark glass-tower skyline at first light, epic rays, film-quality 3D, no text, 16:9 | schedule-tweets/images/reference/kaspa-logo.png | ☐ pending |

## RECEIPTS capture worklist (8) - real-site captures, verified opened (agent: receipt-capturer)

| id | Type | Claim it proves | Capture (URL + exact view) | Beats | Verify at capture | Status |
|---|---|---|---|---|---|---|
| R1 | R(other) | A vProg is defined by the yellow paper (DRAFT v0.0.1, Sutton / FreshAir08 / Hashdag) | https://github.com/kaspanet/research/blob/main/vProgs/vProgs_yellow_paper.pdf page 1 in the GitHub PDF viewer, or page 1 of the mirror PDF rendered to PNG; title page only | CH1@7.3-9.5 | yes | ☐ pending |
| R2 | R(other) | Covenants + ZK verification live on mainnet since June, from the core devs (rusty-kaspa v2.0.0 Mainnet Toccata Release, KIP-16/17/20/21, activation 2026-06-30) | https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0, release header + notes top with the KIP list and DAA 474,165,565 in frame | CH1@14.5-21.2 | no | ☐ pending |
| R3 | R(article) | Vitalik, Oct 2020: Ethereum 'all-in on rollups'; users' 'primary accounts, balances, assets' inside an L2 | https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698, first post; wide + the two highlighted sentences | CH2@40.2-52.2 | no | ☐ pending |
| R4 | R(article) | Sompolinsky, Dec 2025: 'Kaspa vProgs' primary motivation was to avoid the obsolete path of L2's' | https://kasmagazine.com/article/sneakpeaks-and-developments, crop to the quote paragraph (kasmagazine page, not the X post) | CH2@73.0-81.7 | no | ☐ pending |
| R5 | R(other) | Verification lives inside Kaspa consensus: Toccata 'active on mainnet as of June 30, 2026' + 'Direct verification of Groth16 and RISC Zero Succinct proofs inside script' | https://docs.kaspa.org/toccata, crop to the activation line + ZK Precompiles section | CH2@130.4-137.6 | yes | ☐ pending |
| R6 | R(other) | Silverscript 1.0 official release, 2026-09-09 | https://github.com/kaspanet/silverscript/releases/tag/v1.0.0, release header + first paragraph ('official release') | CH3@160.3-163.3 | yes | ☐ pending |
| R7 | R(other) | kaspa.org: vProgs 'In construction', 'Full vProgs remain a future direction' | https://kaspa.org/build, the developments status cards, vProgs card highlighted | CH3@169.8-172.8 | yes | ☐ pending |
| R8 | R(article) | Sompolinsky, Dec 2025: covenant hard fork expected in '3 to 6 months' (delivered 2026-06-30) | https://kasmagazine.com/article/sneakpeaks-and-developments, the hard-fork timing paragraph (a DISTINCT crop from R4) | CH3@172.8-178.5 | yes | ☐ pending |

## CHARTS build worklist (9) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)

| id | Type | What moves / which states | Placement (beats) | Data source | Status |
|---|---|---|---|---|---|
| vprog-loop-mini | Type 2 SYSTEM-DESIGN | 3 nodes: vPROG'S OWN NODES [state] -> ZK PROOF -> KASPA L1 [verifies]; token launches on 'posts' 11.40. DATA.md Pillar 2. | CH1@9.5-14.5 | DATA.md | ☐ pending |
| c2-l2-stack | Type 2 SYSTEM-DESIGN | C2 LEFT column THE L2 STACK: OWN CHAIN 54.04 / OWN SEQUENCER (orders your transactions) 55.38 / OWN BRIDGE to L1 58.96 / OWN SLICE OF LIQUIDITY 60.60; red attack-surface pulse on 'pieces' 62.12. DATA.md Pillar 1. Shown once. | CH2@52.2-64.6 | DATA.md | ☐ pending |
| c1-overview | Type 2 SYSTEM-DESIGN | THE C1 diagram, once: USERS -> KASPA L1 [ORDERS (sequencer) · STORES (DA + state index) · CHECKS PROOFS (ZK verify) · METERS (resource metering)] <-> vPROG A / vPROG B NODES <-> PROVERS; USERS lights 84.74 with reads/writes tags 87.44/88.62; KASPA glows 89.80; ORDERS lights 90.96. DATA.md C1 / Pillar 2. Declare // DIAGRAM_REFS. | CH2@81.7-94.5 | DATA.md | ☐ pending |
| c1-kaspa-four-jobs | Type 2 SYSTEM-DESIGN | KASPA L1 node enlarged: ORDERS lit, STORES 94.66, CHECKS PROOFS 96.22, METERS 97.42, struck EXECUTE drops on 98.54. | CH2@94.5-100.4 | DATA.md | ☐ pending |
| c1-vprog-nodes | Type 2 SYSTEM-DESIGN | vPROG A NODES enlarged: 'runs on its own nodes' 101.70, account set A_p 104.00, lock 'WRITE: vProg A only · READ: anyone' 106.34. | CH2@100.4-106.9 | DATA.md | ☐ pending |
| c1-provers | Type 2 SYSTEM-DESIGN | PROVERS enlarged (amber), 'for-profit operators' 108.30, ZK PROOF token launches 110.02 and lands in KASPA L1 111.66. | CH2@106.9-112.1 | DATA.md | ☐ pending |
| composability-card | Type 2 SYSTEM-DESIGN | 2 of 2 COMPOSABILITY 123.56: read arrows cross 124.72; one transaction bar spans both apps 126.06 -> ONE UNIT 129.02 / OR NOT AT ALL. Yellow paper 2.2, 5.3. | CH2@123.3-130.4 | DATA.md | ☐ pending |
| c3-ladder | Type 1 ANIMATED | Animated ladder (useCurrentFrame): CRESCENDO 2025-05-05 (10 BPS) 140.70/143.64 · YELLOW PAPER 2025-09-11 (DRAFT v0.0.1) 144.92/146.96 · TOCCATA 2026-06-30 (ZK verify + covenants, LIVE ON MAINNET, inside consensus) 147.46/150.54/153.02/154.54 · SILVERSCRIPT 1.0 2026-09-09 156.28; dashed future rungs dim above. DATA.md Pillar 4 table. Shown once. | CH3@139.8-160.3 | DATA.md | ☐ pending |
| c3-next-rungs | Type 2 SYSTEM-DESIGN | Dashed rungs enlarged: NEXT: standalone based ZK apps 164.78 · FULL vPROGS: in construction 167.20 (UNDER CONSTRUCTION tag 169.20) · DAGKNIGHT: proposed (KIP-2) dim, never spoken. | CH3@163.3-169.8 | DATA.md | ☐ pending |

## SLIDES build worklist (10) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)

| id | Slide type | Eyebrow / headline / content | Placement (beats) | Status |
|---|---|---|---|---|
| ten-bps-card | CARD SLIDE | Motion type: 'A CHAIN THAT ALREADY RUNS' / '10 BLOCKS / SEC' / 'since Crescendo, 2025-05-05 (KIP-14)'. No TPS. | CH1@25.2-28.2 | ☐ pending |
| execute-verify-flip | CARD SLIDE | EXECUTE (struck, red) flips to VERIFY (greenish cyan) on 32.58; sub-lines APPS ON THE BASE LAYER / PROOF OF WORK SECURITY / NO L2 IN THE MIDDLE on 33.94 / 35.92 / 37.94. | CH1@31.9-38.8 | ☐ pending |
| title-card-ch2 | CARD SLIDE | Title card 'NOT AN L2' (edit-inserted >=1s pause before 40.22; the video's one chapter transition). | CH2@40.22 | ☐ pending |
| sompolinsky-name-card | CARD SLIDE | KASPA'S FOUNDER / Yonatan Sompolinsky / @hashdag · co-author GhostDAG · DAGKnight (KIP-2) · vProgs yellow paper (Hashdag); 'December 2025' stamp on 72.38. DATA.md section 3. | CH2@67.8-73.0 | ☐ pending |
| zk-math-receipt | CARD SLIDE | Receipt-styled card: ZK PROOF / STATE ROOT ... CORRECT 114.36 / stamp CHECKED BY KASPA CONSENSUS 115.80 / struck RE-EXECUTE THE MATH 118.18. Text only. | CH2@112.1-118.4 | ☐ pending |
| sovereignty-card | CARD SLIDE | 1 of 2 SOVEREIGNTY 120.24: vPROG B cracks red on 121.52, vPROG A stays RUNNING green. Yellow paper 1.2. | CH2@118.4-123.3 | ☐ pending |
| title-card-ch3 | CARD SLIDE | Title card 'WHERE IT STANDS' (edit-inserted >=1s pause before 137.58). | CH3@137.58 | ☐ pending |
| pow-money-hammer | CARD SLIDE | Three-line type stack: PROOF OF WORK MONEY 184.76 / WITH APPS ON IT 186.30 / NO L2 IN THE MIDDLE 187.72; Kaspa K bug fades in. | CH3@184.8-188.6 | ☐ pending |
| cta-engage | CARD SLIDE | BEFORE YOU GO: like glyph 188.64, comment bubble 190.04, 'COMMENT: what gets built on vProgs?' 192.92. No dates. | CH3@188.6-195.1 | ☐ pending |
| end-card-community | CARD SLIDE | End card: Kaspa K logo (screen-blend), lower-third LINK IN THE DESCRIPTION 197.54 / the greatest community ever 199.80; holds to 202.822. | CH3@197.0-202.8 | ☐ pending |

## Bench (swap-ins if a primary fails)

- CH1 0:07.33-0:09.50: Skip the flash and start vprog-loop-mini at 7.333 (7.2s hold).
- CH1 0:09.50-0:14.54: Envato 'abstract network nodes data flow dark teal' 4s + hold the ZK PROOF label as a lower third.
- CH1 0:14.54-0:21.22: C6 docs.kaspa.org/toccata activation crop (then the CH2 130.44 beat takes the ZK Precompiles crop of the same page as a distinct asset).
- CH1 0:21.22-0:25.22: ChatGPT image: stacked glowing greenish-cyan planes rising in a dark void (would make chatgpt_used 4/5) or a 'next-layer-up' stack container (PoW L1 -> covenants LIVE -> vProgs NEXT).
- CH1 0:25.22-0:28.17: Extend E1 to 25.22 only and let the flip card at 31.933 carry the number as a sub-line.
- CH1 0:31.93-0:38.82: vprog-loop-mini state 2 (Kaspa node pulsing 'VERIFIES', not 'EXECUTES').
- CH1 0:38.82-0:40.22: Hold execute-verify-flip to 40.22 (8.3s).
- CH2 0:40.22-0:40.22: n/a
- CH2 0:40.22-0:52.18: ethereum.org/en/roadmap 'layer 2 rollups have developed much faster than expected' crop.
- CH2 0:52.18-1:04.60: Four single-row spotlight cards (chain / sequencer / bridge / liquidity) ~2.5s each.
- CH2 1:04.60-1:07.80: Keep c2-l2-stack to 67.8 with the liquidity row fragmenting on 'split' 67.20.
- CH2 1:07.80-1:12.96: Start R4 at 67.8 with its wide masthead stage (article header, 'The Weekly Knight', 2025-12-17) and push in at 72.96.
- CH2 1:12.96-1:21.70: Same article's 'vProgs is not L2, a term which connotes a modular stack... (which failed)' paragraph.
- CH2 1:21.70-1:34.50: Hold the overview to 100.42 (18.7s) if the four-jobs break-up reads as too many swaps.
- CH2 1:34.50-1:40.42: Stay on c1-overview with the same per-label lighting.
- CH2 1:40.42-1:46.90: BENCH Envato 'server rack nodes blinking close-up' 100.42-102.34 (1.9s) then this container 102.34-106.9 (4.56s, under the floor, which is why it is benched).
- CH2 1:46.90-1:52.06: Merge with zk-math-receipt as one 11.5s container (proof token becomes the receipt).
- CH2 1:52.06-1:58.38: Envato 'receipt printer printing close-up' 112.06-115.38 (3.3s) then a 3s stamp card (sub-floor, so benched).
- CH2 1:58.38-2:03.34: C2 full contrast with the RIGHT column revealing row by row 118.38-130.44 (declared // COMPARISON_REFS; Mike's call, see open_questions).
- CH2 2:03.34-2:10.44: See sovereignty-card bench (C2 right column).
- CH2 2:10.44-2:17.58: kaspa.org/build Toccata card 'Live on mainnet since June 30, 2026' (leaves C7 to CH3 as planned).
- CH3 2:17.58-2:17.58: n/a
- CH3 2:17.58-2:19.84: Envato 'low angle dolly up a staircase dark' 2.3s.
- CH3 2:19.84-2:40.34: Reveal-a-bitmap of the approved PNG if the animation jitters (charts.md section 3).
- CH3 2:40.34-2:43.28: Hold c3-ladder through 163.28 with the Silverscript rung's 'OFFICIAL RELEASE' sub-tag lighting on 162.22.
- CH3 2:43.28-2:49.78: C14 receipt (kasmagazine 'I'm careful not to call it vProgs but rather standalone based zk apps') 163.28-166.38 then this container 166.38-169.78.
- CH3 2:49.78-2:52.84: GitHub kaspanet/vprogs README 'APIs and architecture may change significantly' crop (C8 revived).
- CH3 2:52.84-2:58.54: Container 'toccata-rung-called': the Toccata rung enlarged with stamp 'called Dec 2025 · delivered 2026-06-30' (the screenplay's stamp), 5.7s.
- CH3 2:58.54-3:01.40: Envato 'gold bars vault slow dolly' (the 'money' half) 2.86s.
- CH3 3:01.40-3:04.76: Envato 'hands reaching up toward light silhouette' 3.4s.
- CH3 3:04.76-3:08.64: The screenplay's C1 full-diagram callback (all nodes lit, slow push-in): only if Mike waives the slide-balance lint for it (open_questions).
- CH3 3:08.64-3:15.10: Envato 'crowd cheering concert lights' 188.64-191.22 then this card 191.22-195.1.
- CH3 3:15.10-3:16.98: Envato 'rocket launch night sky' 1.9s.
- CH3 3:16.98-3:22.82: Hold G3 to 202.822 with the lower-third over it (would break the 4s image cap, so bench only if the card fails).

