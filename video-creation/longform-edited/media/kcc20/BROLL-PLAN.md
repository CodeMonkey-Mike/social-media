# kcc20 - BROLL-PLAN (acquisition + build worklists)
_Rendered 2026-10-21 from `COVER-PLAN.json` (the coverage-strategist's proposal, gated by Mike at GATE 3) by `scripts/render_cover_plan.py`. Format owner: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0. Every row is PLACED at the beat named, or marked REJECTED / BENCH: zero orphans. Status ticks are updated by the asset factory as it builds._

**Budget:** Envato video 12/17 · ChatGPT images 8/15. Envato 12/17 used (BR-1, 2, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15; every clip 1.48 to 3.90 s, all under the 4 s cap; the four leading-motion clips BR-2, BR-11, BR-14, BR-15 are under 4 s anyway). ChatGPT 8/15 used (IMG-1, 2, 3, 4, 7, 8, 9, 10; every still 2.30 to 3.92 s; 5 carry the kaspa-logo.png reference because they show the Kaspa mark, 3 are generic; IMG-1 and IMG-7 play their Seedance motion clips). All 20 b-roll items are REUSED built, QA-passed assets; benched: BR-3, BR-9, BR-10, IMG-5, IMG-6 (their lines were cut). Receipts (11: C9, C10, C12, C13, C14, C18, C20, RX1, RX2 + the new RX3 README-Final and RX4 PR #31 diff) and the code assets (diagram-covenant-stack, card-rulebook, C1 x3 states, C2 x2, C3 x2 lanes, C4 x2, C5 x2 + the new c5-final-square, C15, C17, 3 title cards) are budget-exempt and were placed FIRST on every data / claim beat. ZERO ORPHANS: 53 cover beats tile every non-FACE second of the 328.99 s spine, consecutive with no gap (6.833-19.633, 28.167-252.90; FACE 0-6.833, 19.633-28.167, 252.90-328.992 untouched; nothing past 328.992); the only zero-length beats are the three title cards (30.50, 174.64, 207.44) and the CLIP-1 insert (162.20), all edit-time pauses. No asset appears twice. Every tIn / tOut is a word boundary from ALL.e.desilenced.medium-words.json. Rule #13 honoured: every beat is one sequenced slot, containers yield their time to b-roll (never held underneath). THE BALANCE: the rich diagrams (C3 marquee, C5 timeline, C1 / C2 states) each appear once as animated / state-swapped spotlights, never re-shown as a full slide; CH2 is container-dominant by Mike's ruling, CH5 is image / clip-dominant with receipts and two code charts, CH1 / CH3 / CH4 mix all three. No em dashes anywhere in this file.

## CHAPTER THEMES (the visual differential per chapter, mirroring the music beds; Mike 2026-10-10)

_Each chapter lights its charts, slides, containers and title card with ITS accent (the locked stylesheet is otherwise unchanged; receipts and real marks keep their real pixels), and its ChatGPT images use ITS image style ('house' = the persona look). Envato video is not themed. The builders read the chapter off every row's beat._

| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 | #70c7ba (Kaspa greenish cyan) | photoreal cinematic, dark server-room / circuit atmosphere, teal rim light, deep charcoal | the hook: the base layer itself, no people, no coins (the two CH1 face scenes get the Higgsfield cyan background swap, a separate assets-stage item; the draft airs them as recorded) |
| CH2 | #00c2ff (cyan (house palette)) | house | the teaching chapter is almost all code-rendered C1 / C2 with the kinetic side panels; one house-look image (IMG-2) |
| CH3 | #70c7ba (Kaspa teal (KCC-20 lane), with amber #ffb000 as the KRC-20 / Kasplex lane secondary) | house | the contrast is the colour: two lanes, two accents on C3 and C4, no prose table |
| CH4 | #ffd700 (gold) | PLAYFUL: bright toy-like 3D render, a board-game path where each date is a square the Kaspa-K piece hops onto, soft studio light | Mike, 2026-10-20: slowly but surely, fun along the way; the gold square on October 7 and now the gold FINAL square with the dated stamp |
| CH5 | #70c7ba (Kaspa greenish cyan, everywhere) | EPIC photoreal cinematic, wide, glowing greenish cyan: summits, skylines, night skies, the cyan Kaspa moon | a TOTAL change from CH4: every image, code chart, diagram and container renders in greenish-cyan tones; receipts keep real pixels inside a cyan frame / glow |

## HOLDS before licensing (Mike rules at GATE 3)
- [ ] 1. C8 vs RX4 on 'flips to Last Call' (13.84-16.98). The built C8 (kcc-0020.md header reading Status 'Last Call', captured before the Final merge) is benched because the AS-RECORDED flag forbids any graphic that reads as today's status; RX4 (the Status-line diff inside PR #31, dated Oct 7) is history by construction but is a NEW capture (verify the diff hunk shows the Status change). If Mike prefers the existing C8, swap it back WITH a burned dated chip 'HEADER AS OF OCT 7, 2026'.
- [ ] 2. The FINAL STAMP pause (199.46-202.56 + ~3 s pause at 202.44, inside that slot) and RX3. Planned: c5-final-square holds through the pause, RX3 (README index, three Final rows) takes the head of 'By late July' (202.56-204.80, 2.24 s), C20 the rest (2.64 s). Option B, if the comp can sequence two covers inside one pause (comp-build 3d style): lengthen the stamp pause to ~4.5 s, run the stamp 2.5 s then RX3 2 s inside it, and give C20 the whole 'By late July' line (5.0 s). The strategist prefers Option B for reading time; needs the orchestrator to confirm the pause mechanism (the braam / card-pause baker holds ONE cover).
- [ ] 3. BENCH list for verify_assets zero-orphans (move out of assets/ or mark BENCH): BR-3 teal smoke, BR-9 dominoes, BR-10 test tubes, IMG-5 gold hourglass, IMG-6 K-piece barrier gate (+ its motion clip assets/img-motion/IMG-6-k-piece-barrier-gate-motion.mp4: the piece stopped at a barrier contradicts the Final stamp), c6-last-call-ladder (all states), diagram-dependency (all states), diagram-one-rulebook (all states), card-not-yet (s1, s2), receipts C7 (README reading Last Call, stale) and C8 (see 1). Every one served a line Mike cut on 2026-10-21 or a status that is no longer true.
- [ ] 4. Going to the b-roll max. Four named swap-ins would take the plan toward 17 + 15, each at a cost: (a) C22 receipt flash (kcc-0002.md scheme table, NOT the header) at 80.90-83.00 'And this comes from KCC-2.' splits the idea-03 kinetic hold 2.4 s after the panel lands; (b) a new house-Pixar 'single greenish-cyan Kaspa sprout in dark soil' on 'it is very early' 164.44-167.58 shrinks the C4 state-2 count-up to 3.6 s or drops the C18 flash; (c) a new Envato 'empty dark office, monitors off' on 'went quiet for three weeks' 212.34-214.72 splits the C13 receipt before its gap is visible; (d) a new Envato 'calendar pages flipping' on 'live since September 2024' 123.08-125.46 splits RX1. Recommendation: none of them (each fragments a receipt or a kinetic beat); Mike decides.
- [ ] 5. Crop checks on two REUSED receipts (status leak): C10 (kccs commits log) and C13 (rusty-kaspa master commits) were captured on 2026-10-21 after new commits landed; C10's crop must EXCLUDE the Oct 21 'advance to Final' rows (#39 / #40 / #41), or the stamp at 202 is pre-empted; C13's crop must still show the Sep 22 row and the Oct 13 to 16 block on one screen.
- [ ] 6. The C3 marquee holds 23.4 s unbroken (131.22-154.62) with 8 node highlight states swapping every ~2.5 s. Mike asked for long holds to be broken, but every spoken clause here is one node of the diagram, so any cutaway silences a node; the hold is bracketed by BR-7 (before) and RX2 (after). Confirm or name the clause to cut away on.
- [ ] 7. H0 motion card text: 'KCC-20 / LAST CALL / OCT 7, 2026' (the date chip added so the hook card reads as the Oct 7 headline, not today's status). The cut 'Real, close, not finished' H1 card and its timpani taps are gone with their line.
- [ ] 8. Spine pauses carried as EDIT-PLAN rows (not cover beats): the BRAAM after 'mined.' (trough 240.92-241.06, ~4 s, C17 holds with the slow zoom) and the FINAL STAMP after 'them.' (trough 202.32-202.56, ~3 s, c5-final-square holds). Both troughs must pass lint-pause-silence on ALL.e.desilenced before baking.
- [ ] 9. Live [VERIFY] at render for the code charts and receipts: Kasplex tokenTotal (C4 s1), KasStacker count (C4 s2 + C18), Kaspalytics Standard series (C15), api.kaspa.org coinsupply (C17), rusty-kaspa master + dagknight branch (C13, C14), the kccs README index now reading Final (RX3). The VO's rounded figures stay; the graphics carry the dated exact ones.
- [ ] 10. CLIP-1 'expect' is 'create real assets on' (Whisper writes CASPA for Kaspa, so the phrase stops before the name); the existing capture already passed with those words, the capturer only re-verifies length (20.500 s) and audio.

## Envato video (12) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)

| id | Beat (final spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | CH1@6.833-9.36 | dark abstract teal light rays particles slow motion background | 2.53s | any | ☐ pending |
| BR-2 | CH1@16.98-19.633 | dark server room corridor blue teal lights slow dolly | 2.65s | any | ☐ pending |
| BR-4 | CH2@30.50-32.60 | glowing network nodes connecting lines dark background abstract | 2.10s | any | ☐ pending |
| BR-5 | CH2@65.02-68.92 | person using crypto wallet app smartphone close up dark | 3.90s | any | ☐ pending |
| BR-6 | CH2@75.48-78.50 | sealed envelope passed hand to hand close up | 3.02s | any | ☐ pending |
| BR-7 | CH3@129.74-131.22 | cheering crowd stadium roar slow motion | 1.48s | any | ☐ pending |
| BR-8 | CH4@190.52-193.78 | hand moving game piece on colorful board game close up | 3.26s | any | ☐ pending |
| BR-11 | CH5@207.44-209.90 | aerial pull back night city skyline glowing wide | 2.46s | any | ☐ pending |
| BR-12 | CH5@214.72-218.20 | software developers coding late night dark office screens | 3.48s | any | ☐ pending |
| BR-13 | CH5@218.20-221.14 | industrial pipes steam valves dark close up | 2.94s | any | ☐ pending |
| BR-14 | CH5@233.28-236.78 | cryptocurrency mining farm asic rigs dark aisle blue lights dolly | 3.50s | any | ☐ pending |
| BR-15 | CH5@249.76-252.90 | drone flying up mountain ridge night toward summit | 3.14s | any | ☐ pending |

## ChatGPT images (8) - house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text (agent: image-gen)

_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `schedule-tweets/images/reference/`, or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._

| id | Beat (final spine) | Prompt concept | Reference | Chapter style | Status |
|---|---|---|---|---|---|
| IMG-1 | CH1@28.167-30.50 | Photoreal cinematic extreme macro of a dark silicon circuit board, a greenish-cyan backwards-K Kaspa mark glowing inside the copper traces, teal rim light, deep charcoal, 16:9, no text. REUSE assets/img/IMG-1-circuit-k-macro.png + its motion clip assets/img-motion/IMG-1-circuit-k-macro-motion.mp4 (plays from 0, cut at slot end) | schedule-tweets/images/reference/kaspa-logo.png | photoreal cinematic, dark server-room / circuit atmosphere, teal rim light, deep charcoal | ☐ pending |
| IMG-2 | CH2@50.74-54.24 | Pixar-style 3D CGI: a perfectly regular grid of identical greenish-cyan Kaspa coins (backwards-K logo), every one the same, deep navy near-black background, dramatic rim lighting, 16:9, no text. REUSE assets/img/IMG-2-identical-coin-grid.png | schedule-tweets/images/reference/kaspa-logo.png | house | ☐ pending |
| IMG-3 | CH3@116.22-120.14 | Pixar-style 3D CGI: a lively crowd of colourful generic cartoon token coins (no real marks, no text) streaming out of a glowing amber gateway on a dark field, 16:9. REUSE assets/img/IMG-3-krc20-token-crowd.png | none exists (generic approved) | house | ☐ pending |
| IMG-4 | CH3@171.52-174.64 | Pixar-style 3D CGI: a greenish-cyan Kaspa coin (backwards-K logo) fused into solid glowing bedrock, roots of cyan light anchoring it into the stone, deep navy background, 16:9, no text. REUSE assets/img/IMG-4-coin-fused-bedrock.png | schedule-tweets/images/reference/kaspa-logo.png | house | ☐ pending |
| IMG-7 | CH5@221.14-223.44 | Epic photoreal cinematic: a lone armored knight silhouette on a mountain ridge at night under a greenish-cyan aurora sky, generic plate armor, no heraldry, no text, 16:9. REUSE assets/img/IMG-7-knight-ridge.png + its motion clip assets/img-motion/IMG-7-knight-ridge-motion.mp4 (plays from 0, cut at slot end) | none exists (generic approved) | EPIC photoreal cinematic, wide, glowing greenish cyan: summits, skylines, night skies, the cyan Kaspa moon | ☐ pending |
| IMG-8 | CH5@241.06-243.64 | Epic photoreal cinematic: a vast crowd of tiny glowing figures on a dark night plain pressing toward a narrow mountain pass lit greenish cyan, a single thin stream getting through, 16:9, no text. REUSE assets/img/IMG-8-crowd-narrow-pass.png | none exists (generic approved) | EPIC photoreal cinematic, wide, glowing greenish cyan: summits, skylines, night skies, the cyan Kaspa moon | ☐ pending |
| IMG-9 | CH5@243.64-246.80 | Epic photoreal cinematic: an immense ancient stone balance scale on a night plateau under a star field, one pan low and heavy with glowing greenish-cyan Kaspa coins (backwards-K logo), the other pan high and nearly empty, 16:9, no text. REUSE assets/img/IMG-9-balance-scale-asymmetry.png | schedule-tweets/images/reference/kaspa-logo.png | EPIC photoreal cinematic, wide, glowing greenish cyan: summits, skylines, night skies, the cyan Kaspa moon | ☐ pending |
| IMG-10 | CH5@246.80-249.76 | I1, THE marquee: epic photoreal cinematic, a lone figure standing on a mountain summit at night looking down at a vast glowing city, a HUGE greenish-cyan moon filling the sky behind them with the Kaspa K mark on its face (the only glyph), 16:9, no other text. REUSE assets/img/IMG-10-summit-cyan-moon-k.png | schedule-tweets/images/reference/kaspa-logo.png | EPIC photoreal cinematic, wide, glowing greenish cyan: summits, skylines, night skies, the cyan Kaspa moon | ☐ pending |

## RECEIPTS capture worklist (11) - real-site captures, verified opened (agent: receipt-capturer)

| id | Type | Claim it proves | Capture (URL + exact view) | Beats | Verify at capture | Status |
|---|---|---|---|---|---|---|
| C9 | R(other) | PR #31 'KCC0 Compliance for KCC-20 + Last Call advancement' merged Oct 7, 2026 by michaelsutton (the dated Last Call event) | https://github.com/kaspanet/kccs/pull/31, crop to title + Merged badge + merge line. REUSE assets/receipts/C9-pr31-merged.png. treatment: pan | CH1@9.36-13.84 | no | ☐ pending |
| RX4 | R(other) | The kcc-0020.md Status line flipped to 'Last Call' inside PR #31 (history by construction, dated Oct 7) | https://github.com/kaspanet/kccs/pull/31/files, the kcc-0020.md header hunk with the removed / added Status lines; fallback the commit 3fbec52 diff. NEW capture. treatment: highlight on the added 'Status: Last Call' line | CH1@13.84-16.98 | yes | ☐ pending |
| C12 | R(other) | Toccata activated on mainnet June 30, 2026 (rusty-kaspa v2.0.0: DAA 474,165,565, KIP-16 / 17 / 20 / 21) | https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0, crop to header + activation paragraph + KIP list. REUSE assets/receipts/C12-toccata-release-v2.0.0.png. treatment: highlight on 'June 30, 2026' | CH2@32.60-37.62 | no | ☐ pending |
| RX1 | R(other) | Kasplex is a separate third-party organization that runs the KRC-20 node / indexer (go-krc20d) | https://github.com/kasplex, crop to the org header ('The First Protocol For Kaspa Ecosystem') + the go-krc20d pinned repo. REUSE assets/receipts/RX1-kasplex-org.png. treatment: pan | CH3@120.14-125.46 | no | ☐ pending |
| RX2 | R(other) | Sivan Helfer spoke on the XXIM masterclass uploaded June 22, 2026, a week before Toccata | https://www.youtube.com/watch?v=0kN7xYim3Mk watch page, crop to title + channel + upload date, player paused on the guest, logged out. REUSE assets/receipts/RX2-xxim-masterclass-watch.png. treatment: push | CH3@154.62-158.48 | no | ☐ pending |
| C18 | R(other) | KasStacker (third-party) counts 146 KCC-20 tokens (3,621 live states, 2026-10-21) | https://kasstacker.org/, crop = nav header + hero stats card with the 'KCC-20 146 tokens' breakdown line + the kcc20.info / kascov.io source note. REUSE assets/receipts/C18-kasstacker-covenants.png, re-read on render day. treatment: push | CH3@169.54-171.52 | yes | ☐ pending |
| C10 | R(other) | KCC-1 and KCC-2 moved to Last Call Oct 1, 2026 (#32, #33) and KCC-20 Oct 7 (#31), in the kccs commits log | https://github.com/kaspanet/kccs/commits/main, crop to the Oct 1 and Oct 7 rows ONLY (the Oct 21 'advance to Final' rows above them cropped OUT). REUSE assets/receipts/C10-kccs-commits-log.png after checking the crop. treatment: push | CH4@174.64-177.06 | yes | ☐ pending |
| RX3 | R(other) | KCC-1, KCC-2 and KCC-20 are Final (kaspanet/kccs README index, 2026-10-21; PRs #39 / #40 / #41 merged) | https://github.com/kaspanet/kccs, crop to the README index table with the Status column highlighted, the three rows reading Final. NEW live capture (id RX3-kccs-readme-final per PROJECT-LOG). treatment: highlight | CH4@202.56-204.80 | yes | ☐ pending |
| C20 | R(other) | KaspaCom's issue #11 (opened Jul 26, 2026): its deployed token was 'partially aligned, not fully conforming.' | https://github.com/kaspanet/kccs/issues/11, crop to title + the quoted line + the open date. REUSE assets/receipts/C20-issue11-kaspacom.png. treatment: highlight on the quoted line | CH4@204.80-207.44 | no | ☐ pending |
| C13 | R(other) | rusty-kaspa master: v2.1.0 bump Sep 22, 2026, no commits until Oct 13, then six commits Oct 13 to 16 | https://github.com/kaspanet/rusty-kaspa/commits/master, crop so the Sep 22 row and the Oct 13 to 16 block share one screen. REUSE assets/receipts/C13-rusty-kaspa-master-commits.png after checking the crop still shows both. treatment: push (two-stage) | CH5@209.90-214.72 | yes | ☐ pending |
| C14 | R(other) | The rusty-kaspa 'dagknight' branch was last updated Sep 8, 2026 (DAGKnight has no date) | https://github.com/kaspanet/rusty-kaspa/branches/all, crop to the dagknight row. REUSE assets/receipts/C14-branch-commits.png, re-read on render day. treatment: push | CH5@223.44-225.48 | yes | ☐ pending |

## CLIP INSERTS capture worklist (1) - a third-party clip plays with its OWN voice while the spine pauses; audio KEPT, context caption burned, words verified (agent: receipt-capturer; tool + rule: `skills/clip-inserts/clip-inserts.md`)

| id | Who / what plays | Source (URL + window) | Length | Splice at (final spine, after words) | Burned caption | Expect (Whisper) | Verify | Status |
|---|---|---|---|---|---|---|---|---|
| CLIP-1 | Sivan Helfer, first-listed author of KCC-20 (GitHub @Manyfestation), guest on the XXIM Kaspa Programmability MasterClass: We have KRC assets on Kaspa, but it's a bit tricky technically, but those assets are not really on Kaspa. They're just indexed somewhere else. And they... Yeah, | https://www.youtube.com/watch?v=0kN7xYim3Mk 30:05.0-30:25.5 | 20.5s | 2:42.20 after "put it plainly back in June, a week before Toccata went live." | Sivan Helfer, KCC-20 author, June 2026, a week before Toccata | create real assets on | yes | ☐ pending |

## CHARTS build worklist (11) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)

| id | Type | What moves / which states | Placement (beats) | Data source | Chapter accent | Status |
|---|---|---|---|---|---|---|
| diagram-covenant-stack | Type 2 SYSTEM-DESIGN | A UTXO coin node with a RULE badge welded in; arrows 'how it is spent' and 'where it can go next'; eyebrow 'TOCCATA, JUNE 30 2026: KIP-17 covenants + KIP-20 covenant IDs'; three states coin / spent / next. REUSE assets/diagrams/diagram-covenant-stack-*.png. Source DATA.md T4 + Pillar 1. | CH2@37.62-44.46 | DATA.md | #00c2ff (cyan (house palette)) | ☐ pending |
| c1-state-01 | Type 2 SYSTEM-DESIGN | C1 (01) Common interface: index chip 'IDEA 01 / 04'; the KCC-20 state block (amount, owner, owner scheme, borrow scheme, borrow guard, extension commitment) with Wallet / Indexer / App arrows into 'transfer' / 'transfer_delegator'; field spotlight states amount, owner, settings, entrypoint. Reframes into the LEFT 55 percent for the kt-side-panel RIGHT. REUSE assets/diagrams/c1-state-01-*.png. Labels from kcc-0020.md sections 1 and 2. | CH2@54.24-65.02 | DATA.md | #00c2ff (cyan (house palette)) | ☐ pending |
| c1-state-02 | Type 2 SYSTEM-DESIGN | C1 (02) Extended state: index chip 'IDEA 02 / 04'; the base state plus the opaque 'extension_commitment' digest box (kcc-0020.md section 4); digest spotlight state. Reframes into the RIGHT 55 percent for the kt-side-panel LEFT. REUSE assets/diagrams/c1-state-02-*.png. | CH2@68.92-75.48 | DATA.md | #00c2ff (cyan (house palette)) | ☐ pending |
| c1-state-03 | Type 2 SYSTEM-DESIGN | C1 (03) Flexible authority (KCC-2): index chip 'IDEA 03 / 04'; the owner field fanning to '0x00 public key', '0x01 / 0x02 key commitment', '0x03 script (P2SH)', '0x04 covenant ID' (kcc-0002.md scheme table); node states s00 / s01 / s03 / s04. Reframes into the LEFT 55 percent for the kt-side-panel RIGHT; the 'COVENANTS CAN OWN TOKENS' keyword pop rides the lower picture. REUSE assets/diagrams/c1-state-03-*.png. | CH2@78.50-91.90 | DATA.md | #00c2ff (cyan (house palette)) | ☐ pending |
| c2-borrowed-receive | Type 2 SYSTEM-DESIGN | C2 Borrowed Receive, two states: LEFT 'new UTXO' path (fresh token UTXO funded with KAS, STORAGE MASS meter climbing red for small outputs, KIP-9; states base / kas / mass); RIGHT 'borrowed receive' path (recipient's existing token UTXO consumed and recreated, owner unchanged, KAS value floor, token amount up, gated by borrow_scheme / borrow_guard; states base / owner / floor / amount). Index chip 'IDEA 04 / 04'. REUSE assets/diagrams/c2-borrowed-receive-*.png. Source kcc-0020.md section 5 + the companion guide. | CH2@91.90-104.92, CH2@104.92-116.22 | DATA.md | #00c2ff (cyan (house palette)) | ☐ pending |
| c4-token-count | Type 1 ANIMATED | C4 token-count bars, REAL useCurrentFrame count-up in two states: state 1 the amber KRC-20 bar grows to the dated Kasplex API tokenTotal (2,164 on 2026-10-18) with '2024' under it, KCC-20 bar empty; state 2 the teal KCC-20 bar grows to the dated KasStacker count (146 on 2026-10-21) with '2026'. Source line names both sources + dates + 'third-party count' for KasStacker. REUSE assets/charts/c4-token-count.html + the state PNGs as design states. [VERIFY] both counts at render. | CH3@125.46-129.74, CH3@164.44-169.54 | DATA.md | #70c7ba (Kaspa teal (KCC-20 lane), with amber #ffb000 as the KRC-20 / Kasplex lane secondary) | ☐ pending |
| c3-marquee | Type 2 SYSTEM-DESIGN | C3 THE MARQUEE contrast, one two-lane system-design diagram with per-node highlight states: KRC-20 lane (amber): 'Kasplex (third party)' -> 'token ops inserted as data on L1' -> 'the Kasplex indexer reads and interprets' -> 'balance = the indexer's answer'; KCC-20 lane (Kaspa teal): 'kaspanet/kccs (core contributors)' -> 'token state in covenant UTXOs on L1' -> 'L1 script (KIP-17 covenants, KIP-20 IDs) enforces the transfer' -> 'balance = what the chain enforces'; base, krc-1..4, kcc-1..4, both. No prose table. REUSE assets/diagrams/c3-marquee-*.png. Source DATA.md Pillar 3. | CH3@131.22-143.64, CH3@143.64-154.62 | DATA.md | #70c7ba (Kaspa teal (KCC-20 lane), with amber #ffb000 as the KRC-20 / Kasplex lane secondary) | ☐ pending |
| c5-timeline | Type 2 SYSTEM-DESIGN | C5 THE TIMELINE, animated board-game path (gold accent): squares JUN 30 Toccata activates / JUL 15 conventions repo opens / AUG 20 KCC-1, KCC-2, KCC-20 land as Drafts / SEP 21 KCC-0 Final (chart-only, small) / SEP 22 Last Call PR for KCC-20 opens / OCT 1 KCC-1 + KCC-2 move to Last Call; a greenish-cyan K piece hops square to square as each date is spoken. REUSE assets/diagrams/c5-timeline.html + c5-timeline-01..06 states. Source DATA.md Pillar 4 table. | CH4@177.06-190.52, CH4@193.78-199.46 | DATA.md | #ffd700 (gold) | ☐ pending |
| c5-final-square | Type 2 SYSTEM-DESIGN | NEW: the C5 path END STATE in the CH4 playful look: the OCT 7 square lands ('KCC-20 joins them', the existing c5-timeline-07-oct7 keyframe), then the K piece hops ONE more square onto a gold FINAL square and a dated stamp slams down: 'UPDATE / KCC-20 IS FINAL / OCT 21, 2026' (twinkle on the stamp frame). Holds through a ~3 s spine pause at the trough after 'them.' (202.44). Source: kaspanet/kccs PR #41 merged 2026-10-21 14:50 UTC (PROJECT-LOG); the stamp text is dated and true. | CH4@199.46-202.56 | DATA.md | #ffd700 (gold) | ☐ pending |
| c15-daily-transactions | Type 1 ANIMATED | C15 daily STANDARD (non-coinbase) accepted transactions, Sep 1 to the latest full day, bars DRAWN left to right (real useCurrentFrame); the September average line (108,952); the Oct 12 to 15 week bracketed with its average chip (81,767) and the '+21.5% vs prior week' delta chip; source line 'Kaspalytics accepted transactions, Standard series, <date>'. Greenish cyan, epic. REUSE assets/charts/c15-daily-transactions.html + state PNGs. [VERIFY] re-pull at render. | CH5@225.48-233.28 | DATA.md | #70c7ba (Kaspa greenish cyan, everywhere) | ☐ pending |
| c17-supply-ring | Type 1 ANIMATED | C17 supply ring FILLING to the dated mined share (96.72% on 2026-10-18) with the centre counting up, '27.76B of 28.70B KAS mined', chips 'PROOF OF WORK / NO PREMINE', source line 'api.kaspa.org/info/coinsupply, <date>'. Holds through the ~4 s BRAAM spine pause with a slow push to ~2.4x on the figure. REUSE assets/charts/c17-supply-ring.html + state PNGs. [VERIFY] re-pull at render. | CH5@236.78-241.06 | DATA.md | #70c7ba (Kaspa greenish cyan, everywhere) | ☐ pending |

## SLIDES build worklist (4) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)

| id | Slide type | Eyebrow / headline / content | Placement (beats) | Chapter accent | Status |
|---|---|---|---|---|---|
| card-rulebook | CARD SLIDE | Eyebrow 'KASPANET/KCCS / KCC-20', headline 'The shared RULEBOOK for a fungible token', body 'built from Toccata's covenants', three-layer stack glyph Toccata -> covenants -> KCC-20. REUSE assets/card-slides/card-rulebook.png. Source DATA.md T1. | CH2@44.46-50.74 | #00c2ff (cyan (house palette)) | ☐ pending |
| title-card-ch2 | CARD SLIDE | 'HOW KCC-20 WORKS' chapter title slide, CH2 cyan accent. REUSE assets/title-slides/title-card-ch2.png. | CH2@30.50 | #00c2ff (cyan (house palette)) | ☐ pending |
| title-card-ch4 | CARD SLIDE | 'WHERE IT STANDS' chapter title slide, CH4 gold accent, playful board-game look. REUSE assets/title-slides/title-card-ch4.png. | CH4@174.64 | #ffd700 (gold) | ☐ pending |
| title-card-ch5 | CARD SLIDE | 'THE BIGGER PICTURE' chapter title slide, CH5 greenish-cyan epic look. REUSE assets/title-slides/title-card-ch5.png. | CH5@207.44 | #70c7ba (Kaspa greenish cyan, everywhere) | ☐ pending |

## Bench (swap-ins if a primary fails)

- CH1 0:06.83-0:09.36: BR-3 teal smoke (assets/vid/BR-3-teal-smoke.mp4), the other dark atmosphere clip
- CH1 0:09.36-0:13.84: the C10 commits-log crop focused on the '#31' row of Oct 7
- CH1 0:13.84-0:16.98: the existing C8 capture (assets/receipts/C8-kcc20-header.png, the kcc-0020.md header reading Status 'Last Call', captured 2026-10-21 before the Final merge) WITH a dated chip 'HEADER AS OF OCT 7, 2026' burned on it
- CH1 0:16.98-0:19.63: BR-3 teal smoke
- CH1 0:28.17-0:30.50: BR-3 teal smoke (assets/vid/BR-3-teal-smoke.mp4)
- CH2 0:30.50-0:30.50: none (a card is mandatory where a new bed starts)
- CH2 0:30.50-0:32.60: BR-3 teal smoke
- CH2 0:32.60-0:37.62: Kaspalytics issue 1 ('on June 30 Kaspa activated Toccata') https://buttondown.com/kaspalytics/archive/issue-1-toccata-live-covenant-usage-a-block/
- CH2 0:37.62-0:44.46: card-rulebook held from 37.62 (one card for both lines)
- CH2 0:44.46-0:50.74: C8-style header crop of kcc-0020.md Title line only (no Status line)
- CH2 0:50.74-0:54.24: a C1 overview state (four empty idea slots 01 to 04) as a container, not built
- CH2 0:54.24-1:05.02: none (the kinetic experiment lives on this beat)
- CH2 1:05.02-1:08.92: hold c1-state-01-entrypoint through 68.92
- CH2 1:08.92-1:15.48: none
- CH2 1:15.48-1:18.50: hold c1-state-02-digest through 78.50
- CH2 1:18.50-1:31.90: C22 receipt (kcc-0002.md scheme table, NOT the header) as a 2.1 s flash on 'And this comes from KCC-2.' 80.90-83.00, open_questions 4
- CH2 1:31.90-1:44.92: none
- CH2 1:44.92-1:56.22: none
- CH3 1:56.22-2:00.14: BR-7 stadium roar moved up to this line
- CH3 2:00.14-2:05.46: https://wiki.kaspa.org/en/Kasplex_KRC_20 ('designed by the 3rd party group'), R(article) with a push
- CH3 2:05.46-2:09.74: C19 receipt, the Kasplex API JSON with tokenTotal (raw JSON in a browser), as a flash if Mike wants the real-site number too
- CH3 2:09.74-2:11.22: hold C4 state 1 payoff through 131.22
- CH3 2:11.22-2:23.64: none (this diagram replaces the deck's prose table, Convention 4)
- CH3 2:23.64-2:34.62: none
- CH3 2:34.62-2:38.48: the kcc-0020.md Authors line crop ('Sivan Helfer (@Manyfestation)' first), NOT the header's Status line
- CH3 2:38.48-2:42.20: RX2 held through 162.20
- CH3 2:42.20-2:42.20: CLIP-2 (HELD in the screenplay, 29 s, same splice point) if Mike changes his mind; else no insert and the resume line stands alone
- CH3 2:42.20-2:44.44: c3-marquee-both (the two lanes side by side) as the resume cover
- CH3 2:44.44-2:49.54: C18 receipt held from 164.44 instead of the chart
- CH3 2:49.54-2:51.52: hold C4 state 2 payoff through 171.52
- CH3 2:51.52-2:54.64: c3-marquee-kcc-4 (balance = what the chain enforces) as a callback
- CH4 2:54.64-2:54.64: none
- CH4 2:54.64-2:57.06: C9 PR #31 page re-cropped to its commit list
- CH4 2:57.06-3:10.52: none (the dates are the chapter)
- CH4 3:10.52-3:13.78: BR-9 dominoes (benched: tonal fit to CH4, but its own line was cut and placing it on 'land as Drafts' would flicker the timeline twice)
- CH4 3:13.78-3:19.46: none
- CH4 3:19.46-3:22.56: RX3 held from 199.46 with the stamp text burned on it
- CH4 3:22.56-3:24.80: the PR #41 'KCC-20: advance to Final' merged page https://github.com/kaspanet/kccs/pull/41 (title + Merged badge + Oct 21 date)
- CH4 3:24.80-3:27.44: the kas-smiths thread page 2 ('Ross' 2026-07-19 four unclear areas), R(article)
- CH5 3:27.44-3:27.44: none
- CH5 3:27.44-3:29.90: IMG-7 knight ridge moved up
- CH5 3:29.90-3:34.72: https://github.com/kaspanet/rusty-kaspa/releases (v2.1.0 dated Sep 22) + the commits page as two receipts
- CH5 3:34.72-3:38.20: C13 extended over this line with a second push onto the six commits (the screenplay's single-receipt shape)
- CH5 3:38.20-3:41.14: a system-design container off a 'rusty-kaspa master' hub with the four commit groups as nodes (consensus internals, wallet mass and fee math, lowio preset, paginated UTXO lookup by address); not built, and the line is 2.3 s, under any diagram floor
- CH5 3:41.14-3:43.44: C14 held from 221.14
- CH5 3:43.44-3:45.48: https://raw.githubusercontent.com/kaspanet/kips/master/kip-0002.md header crop, Status 'Proposed'
- CH5 3:45.48-3:53.28: a screencap of the real Kaspalytics chart https://www.kaspalytics.com/app/transactions/accepted/count (never restyled)
- CH5 3:53.28-3:56.78: kaspa.org 'No premine. No hidden allocation. Fair launch.' crop as a receipt
- CH5 3:56.78-4:01.06: https://api.kaspa.org/info/coinsupply raw JSON as a receipt (the two sompi figures)
- CH5 4:01.06-4:03.64: C17 payoff held through 243.64 (after the braam zoom)
- CH5 4:03.64-4:06.80: BR-15 ridge flight moved up to this line
- CH5 4:06.80-4:09.76: none (Mike's marquee pick)
- CH5 4:09.76-4:12.90: a new epic Envato 'night sky stars time-lapse over mountain silhouette' if Mike wants the ridge flight before the moon instead

