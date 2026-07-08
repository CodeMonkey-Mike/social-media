# bittensor-for-the-future — PROJECT LOG

**Working title:** BULLISH: The US government backs Bittensor
**Track:** longform-edited · **Phase:** PLANNING / SCRIPTING (no recording yet)
**Spine architecture:** full-screen GATED face (silverscript model, house rule #6) — DECIDED.
**Register:** gear 3 (declarative / epic) for hype beats, eased to gear 2 for explainer/mechanics.
**Canonical doc:** `SCREENPLAY.md` (this folder) holds the locked cold open, chapter map, and the
drafted chapter outlines + verified facts/receipts. This log is the resume/decision trail.

---

## Status at end of 2026-06-16

Topic, title, register, spine architecture, and the chapter map are LOCKED. **All 9 chapters are drafted
as bullet outlines in `SCREENPLAY.md`**, and a full PRODUCTION layer was added on 2026-06-16 (see below).
No footage exists; Phases 1-4 of the pipeline (record -> compress -> transcribe -> defumble/desilence ->
Remotion edit) have NOT started.

**Production layer done 2026-06-16 (the big session):**
- Script formatting conventions invented + captured in a NEW reusable skill `longform-edited/screenplay.md`:
  SAY-vs-direction, per-chapter Title-card flag, sparse [FACE]/[COVER] gated-face tags, system-design
  containers. (The screenplay's "production conventions" block holds the per-video instances.)
- **[FACE]/[COVER]** sparse pass COMPLETE on all 9 chapters (face = rare single-sentence punctuation).
- **Title-card flags** set (CH1/CH7/CH9 OFF; content chapters ON).
- **CH5 system-design diagrams** BUILT (5 HTML/SVG containers in `graphics/` + a spotlight-swap demo
  mp4/html).
- **Music beds** sourced + assigned per chapter (CH1 Retribution, CH2-4 Hold The Line, CH5-6 The Invaders
  right-aligned, CH7 Common High Speeds, CH8-9 Searching For Signs Of Life right-aligned) — in
  `assets/music/` + library.json with Content-ID codes; notated in the screenplay's Music plan.
- **Riser + impact SFX libraries** BUILT (`assets/sfx/risers/library.json`, `assets/sfx/Impacts/library.json`);
  sparse riser/impact cues notated in the screenplay.

**Remaining pre-production:** the say-vs-direction conversion pass (NEXT — talk it through with Mike first);
resolve the parked content decisions; run the live [VERIFY] checks; pick the The-Invaders instrumental-vs-
vocals variant; build BROLL-PLAN.md; THEN record -> Phases 1-4.

### Chapter map (in SCREENPLAY.md) — 9 chapters as of 2026-06-16
- **CH1 — Intro / cold open** — LOCKED (verbatim, incl. Mike's first line + "Better than I ever could.").
- **CH2 — What actually happened with Fable** — DRAFTED (bullet outline + verified facts).
- **CH3 — Why this matters: the AI economic supercycle** — DRAFTED (1992 thesis, productivity boom).
- **CH4 — Enter decentralized AI / Bittensor (the "why")** — DRAFTED. Gear-3 conviction chapter:
  anti-government anaphora riff + decentralization roll-call (added 2026-06-16) -> Bittensor as the
  answer -> fair launch -> CLOSES on the "accidental endorsement" vision beat (added 2026-06-16:
  censorship endorses decentralization -> the stakes for humanity). NO mechanics.
- **CH5 — How it works (the mechanics)** — DRAFTED. Split out of the old CH4 (2026-06-16): subnets,
  miners/validators, Proof of Intelligence / Yuma Consensus, TAO token, dTAO, "machine with no off
  switch" bridge. Gear 2 explainer.
- **CH6 — The market already voted** — DRAFTED 2026-06-16 (TAO ripped the week of the ban; receipt beat,
  live [VERIFY] on all numbers). Now ends by handing into the mid-roll plug instead of straight to govt.
- **CH7 — Mid-roll plug: community + the TAO call** — DRAFTED 2026-06-16. Quick to-camera aside (face ON):
  Mike's TAO-bottom call + community plug + "link in the description" (CryptoRich.vip), then bridges back
  to the govt thread. Warm community voice (drop gear 3). ONLY mid-roll interruption. [VERIFY the call +
  current multiple; no self-undermining framing.]
- **CH8 — How the govt "backs" it** — DRAFTED 2026-06-16 (ban irony + regulatory on-ramp, NOT a
  name-check; honesty guardrail baked in). (Was CH7.)
- **CH9 — Close** — DRAFTED 2026-06-16 (TAO + KAS two neutral layers; recap + Mike's real full CTA voice;
  distinct from the mid-roll plug). (Was CH8.)

---

## Decisions log

- **2026-06-15 — Topic + hook.** Tie the Bittensor/TAO video to the US government's ban of Anthropic's
  Fable 5 / Mythos 5 models. The ban makes the case for decentralized AI by force.
- **2026-06-15 — Title** = "BULLISH: The US government backs Bittensor". Pays off on the ban irony +
  the real regulatory on-ramp.
- **2026-06-15 — Spine architecture** = full-screen GATED face (silverscript / house rule #6).
- **2026-06-15 — Register** = NEW gear 3 (declarative/epic), persisted to `persona.json`
  spoken_voice.register_note + memory `feedback_declarative_epic_register`. No trailing "right?",
  no conviction-then-hedge in hype beats. Cold open at peak epic over an epic music bed.
- **2026-06-15 — Cold open** locked verbatim (first line is Mike's: "The U.S. government just made the
  case for why decentralized AI is the only way to go." + flex button "Better than I ever could.").
- **2026-06-15 — CLARITY Act = VERIFIED FALSE.** The claim that the CLARITY Act "names Bittensor" is a
  crypto-hype conflation, NOT in any bill. Three different "CLARITY" things exist (see SCREENPLAY box).
  CH6 reworked to the ban irony + market-structure CLARITY (H.R.3633) classification + spot-TAO ETF
  filings. DO NOT put a "named in the bill" receipt on screen.
- **2026-06-15 — Chapter reorder.** Inserted CH3 (why it matters); introduced Bittensor (CH4) BEFORE
  the market-reaction beat (CH5) so "TAO ripped" lands after the asset is established.
- **2026-06-15 — Outline format.** Mike wants chapters as BULLET outlines (not prose spoken drafts).
- **2026-06-15 — Proof of Intelligence depth.** Mike asked to expand Yuma Consensus into sub-bullets
  (he + the audience want to understand it). Done in CH4 (now CH5 after the split).
- **2026-06-16 — Decentralization roll-call expanded** in CH4. Added publishing/social (deplatforming),
  storage/permanence (Arweave), identity to Mike's money/web/messaging three; parked compute/DNS/DeFi
  as swap candidates. Pivot line "the final frontier: decentralizing intelligence itself" hands into
  Bittensor. (Also corrected Mike's "centralizing the web via IPFS" slip -> "decentralizing".)
- **2026-06-16 — CH4/CH5 split.** Old CH4 carried both the conviction/why AND the mechanics. Split into
  CH4 (the "why": anaphora riff, roll-call, Bittensor-is-the-answer, fair launch, accidental-endorsement
  vision beat) + new CH5 "How it works" (subnets -> dTAO -> off-switch bridge). Downstream chapters +1.
- **2026-06-16 — "TAO now = Bitcoin at $200" asymmetry beat** added (Mike picked the 7-line gear-3
  version). Lands the AI-supercycle -> total-crypto-MC-surge -> TAO-MC-in-the-trillions vision.
  "Trillions" kept CONDITIONAL (opportunity/asymmetry, not a promised target, verified_claims_only).
  Placed in **CH8** (govt-backs-it / regulatory on-ramp) as the PAYOFF of the on-ramp argument, after the
  ETF beat. (First mis-placed in CH4 off a stale earlier recommendation; Mike was working in CH8, moved
  it.) Formatted in the new SAY (blockquote) vs direction (italic) convention.
- **2026-06-16 — Screenplay SKILL created** (Mike's idea: capture the conventions so we don't re-derive
  them per video). `video-creation/longform-edited/screenplay.md` is now the canonical scripting skill
  (SAY-vs-direction, Title-card flag, sparse FACE/COVER, system-design containers, register, verified-
  claims). Pointed to from `longform-edited.md`. screenplay.md = the SCRIPT; longform-edited.md = the EDIT.
- **2026-06-16 — Music beds LOCKED + sourced** (Mike's picks). Downloaded 4 Soundstripe songs into
  `assets/music/` + registered in `assets/music/library.json` (with Content-ID codes for the YT/FB/IG
  description). Per-chapter bed map (also in the screenplay's Music plan + per-chapter Music lines):
  CH1 = Retribution; CH2-CH4 = Hold The Line; CH5-CH6 = The Invaders (RIGHT-ALIGN end-of-track to end of
  CH6); CH7 plug = Common High Speeds (existing); CH8-CH9 = Searching For Signs Of Life (RIGHT-ALIGN to
  end of CH9). Right-align = anchor the track's climax to the section's end; lock exact timings after
  recording. Also notated SPARSE riser/impact cues (risers from assets/sfx/risers/): cold-open title hit
  (DSGNRise built-in hit), CH4->CH5 handoff (Creepy Orchestral Rise), CH5 Yuma "clip" impact, CH8
  asymmetry impact. Impacts library BUILT 2026-06-16 at `assets/sfx/Impacts/library.json` (9 hits, Mike's
  WHEN-TO-USE-IMPACTS.md guidance); screenplay cues now name real files (Impact_3 reveal boom,
  Kick_Impact_01 punch, Impact_Hit_01-2 heaviest, Soundjay as the consistent chapter-transition hit).
- **2026-06-16 — Sparse [FACE]/[COVER] pass COMPLETE** across all 9 chapters (beat-level tags + a few
  sentence-level in the SAY: beats). Face counts: CH1=3, CH2=2, CH3=2, CH4=3, CH5=1, CH6=2, CH7=all
  (plug), CH8=4, CH9=2; everything else COVER. Single lines, no blocks. All proposed defaults, flip any.
- **2026-06-16 — [FACE] must be SPARSE** (Mike's refinement): face moments are individual sentences here
  and there, PUNCTUATION only, NOT whole blocks and NOT every-other-sentence; the bulk of the runtime is
  COVER. Re-tagged the cold open (3 face cuts) + CH8 asymmetry (2). Earlier blocky tagging was wrong.
  Tags go at the BEAT level on bullets (don't need exact lines), per the silverscript model.
- **2026-06-16 — Two production-script conventions added** (Mike's calls):
  1. **Title-card flag** per chapter (`Title card: ON/OFF`). ON = show the chapter's on-screen title card
     (cube transition); OFF = no card AND not spoken. Canonical at-a-glance table in the chapter-map
     section. Defaults: content chapters CH2-CH6/CH8 ON; framing beats CH1 cold open, CH7 plug, CH9 close
     OFF. (CH7 was the trigger: plug title must NOT be shown or said.)
  2. **[FACE] / [COVER] markers** on spoken lines = gated-face spine (rule #6). `[FACE]` = his face on
     screen for that line; default/untagged = `[COVER]` (full-screen b-roll/container, audio continues).
     Tagged at sentence level inside the SAY: blockquotes. Applied as worked examples to the cold open +
     the CH8 asymmetry beat; plug (CH7) is FACE throughout. Outline-only beats get tags when converted to
     SAY: lines (ties to the pending say-vs-note formatting pass). Convention notes live in the
     production-conventions block after the chapter map.
- **2026-06-16 — Mid-roll plug inserted as CH7** (Mike's call). Quick community + TAO-bottom-call plug
  placed right after the market beat (CH6) so it rides the "TAO ripped" momentum, then hands back to the
  govt thread. CH6's closer changed from a govt-bridge to a "we saw it coming" tease into the plug. Govt
  -> CH8, close -> CH9. Plug = community + the TAO call ONLY (full like/subscribe/sign-off stays at the
  close, so the two CTAs aren't redundant). MUST verify Mike's actual TAO call + current multiple before
  screen; frame as vindicated conviction, never self-undermining (avoid_in_drafts).
- **2026-06-16 — CH5 visual style = per-bullet SYSTEM-DESIGN diagrams.** Mike rejected a card-grid/table
  ("that was a table, not a system design") and confirmed the radial subnet TOPOLOGY as the target look.
  Decision: EACH CH5 bullet gets its own system-design view (topology/flow/engine), spotlight-swapping one
  at a time as he speaks each bullet. Built all 5 as HTML/SVG containers in `graphics/` (subnets-network,
  miners-validators, yuma-consensus, tao-token, dtao) + PNG proofs via headless Chrome. Rationale for
  HTML-not-ChatGPT confirmed with Mike: AI image-gen garbles labels/numbers (silverscript "(text
  accuracy)" lesson); a "container" just means code-rendered, can be as clean/minimal as wanted. AI
  image-gen reserved for the text-free atmosphere layer only. Still to VERIFY before final: subnet count,
  category names, tokenomics dates/numbers vs live taostats.
- **2026-06-16 — Full say-vs-note cleanup pass on ALL chapter outlines (Mike's call: "I never know when
  you are telling me about something I should say").** Made every CH2-CH9 Outline beat follow one uniform
  pattern: short **bold signpost** (just the beat name, not spoken) — then plain spoken talking-point — then
  `_(italic parens)_` for any note/direction. Un-bolded the punch lines that had been bold full sentences
  (gave each a short signpost instead); moved every stray note out of plain text into italic parens
  (`Plain:`, `[VERIFY ...]` inline, "Frame as...", "Tie to...", meta-descriptions); converted the leftover
  `SAY:` / "Suggested spoken lines" labels to `(parens)` directions (the `>` block already means "say it").
  Added a "How to read the Outline beats" legend before CH2. Inline `[VERIFY]` now only lives in facts
  blocks, not spoken beats. Also re-tagged the CH4 accidental-endorsement `>` block per the one-sentence
  rule (face holds the "say it plainly / not a preference / not an ideology" setup, `[COVER]` from "It is
  the only path" on, Mike's call).
- **2026-06-16 — [FACE] = ONE sentence + explicit [COVER] return (Mike's call).** A face cut shows his
  face for a SINGLE sentence only (more than one only if very small/tight, e.g. "Gone. For everyone.").
  After each face sentence the next line gets an explicit `[COVER]` tag so the face can't visually carry
  across the lines that follow. Re-tagged the cold open (3 face sentences, explicit COVER returns) + the
  CH8 asymmetry beat (2). Rule added to Convention 3 in `../../screenplay.md` + this screenplay's FACE/COVER
  block. (Earlier tagging was ambiguous: a [FACE] line with untagged lines after it looked like it might
  hold on the face.)
- **2026-06-16 — SAY-vs-direction convention FLIPPED (Mike's call).** Instead of "bullets are paraphrased
  talking-points, only `>` SAY: blocks are spoken," the new default is: **an Outline bullet IS what Mike
  says** (in his own words, not verbatim); a note/direction to him goes in **`(parens)`**; the rare line
  that must be said word-for-word stays in a **`>` blockquote**. `[FACE]/[COVER]/[VERIFY]` remain structured
  editor brackets, distinct from parens. Kills the planned say-vs-direction conversion pass — the outline
  already reads as the loose script. Hard "do NOT say X on screen" guardrails stay in the facts/verify
  block (not inline parens — too easy to skim past while recording). Rewrote Convention 1 in
  `../../screenplay.md`.
- **2026-06-16 — "Accidental endorsement" vision beat** added to CLOSE CH4 (Mike's idea). Thesis:
  censoring the most powerful centralized AI is itself an endorsement of decentralized AI; decentralization
  is the only path to the next stage of humanity (cures diseases, ends scarcity, abundant wealth). Drafted
  gear-3 epic. NOTE kept the "cures diseases / ends scarcity" as PROMISE/stakes, NOT a factual on-screen
  claim (verified_claims_only). Last line bridges into CH5.

- **2026-06-17 — Transition scheme locked (per-medium b-roll).** Reusing the house default kit
  (longform-edited.md #5): **IMAGE b-roll (ChatGPT stills + deck containers) = Cross warp** (directional
  gradient-mask sweep + skew/blur settle, ~0.5s) — Mike likes the cross warp for this video;
  **VIDEO b-roll (Envato clips) = Dissolve** (plain opacity, ~0.5s each side). Unchanged: book-flip on
  chapter opens, container cross-fade+scale within a chapter, the single consistent impact-hit
  (Soundjay_Impact_Main_01) as chapter-cut punctuation.
  **FACE transitions (Mike, 2026-06-17):** **Film burn on EVERY [FACE] cut, in AND out** — the gated-face
  signature warm flash on the cut to his eyes (repurposes the kit's film-burn; this video has no lip-sync
  avatar, so no conflict). **Light-leak overlay whenever a [FACE] hold runs >5s** — sustained holds (cold
  open, the thesis beats, the ~CH7 plug) get organic drifting warmth so a long talking-head doesn't feel
  static; short punctuation faces (<5s) stay clean, film-burn only. Tuning: keep film-burn intensity dialed
  so frequent face cuts don't strobe; light leak subtle/slow, screen-blend, low opacity. **Glitch effect:
  HELD for now** (Mike). Implement in Phase 4 (hand-rolled `interpolate`, ref BanksOwnChain.tsx).

- **2026-06-17 — Inter-bed music breath (Mike).** At the 4 seams where the music BED CHANGES
  (CH1->CH2, CH4->CH5, CH6->CH7, CH7->CH8 — NOT within a bed group), insert a ~1s musical breath:
  outgoing bed ducks to silence over ~0.5s, the chapter transition + the consistent impact hit
  (Soundjay_Impact_Main_01) land IN the gap (so it's a deliberate beat, not dead air), then the incoming
  bed swells up over ~0.5-1s. Aligns with the title-card moment (no VO there). Compatible with the
  right-align climaxes (The Invaders peaks on "TAO ripped" end-CH6, then resolves into the breath;
  Searching peaks at end-CH9); also cleanly isolates the CH7 plug as an aside. Phase-4 audio mix.

## Open question parked for Mike
- CH4 Proof-of-Intelligence section is meaty (~6 sub-bullets). Decide: keep full depth or prep a 3-bullet
  trim fallback (judges -> can't rig it -> honesty pays).
- CH3: whether to put ONE concrete AI-GDP/productivity stat on screen (would need a verified source).
- CH2: name Amazon (its CEO made the call) or keep "a tech CEO"? + verify the court-paused-ban / DOJ
  appeal status before using it.
- CH4/5/6: [VERIFY] live before screen — spot-TAO ETF filings (Grayscale/Bitwise), subnet revenue
  numbers, any TAO price/mcap.

---

## NEXT SESSION — start here
1. **No say-vs-direction conversion pass needed anymore (RESOLVED 2026-06-16).** Convention flipped: an
   Outline bullet IS what Mike says (loosely, his words); `(parens)` = a note/direction to him; `>` = the
   rare say-it-verbatim line; `[FACE]/[COVER]/[VERIFY]` stay as structured editor tags. So the outline
   already reads as the loose script — just keep beats clean and move any inline notes into parens. Hard
   "do NOT say X" guardrails live in the facts/verify block, not inline. (Convention 1 in `../../screenplay.md`.)
2. Resolve the parked content decisions (see "Open question parked for Mike" above): trim CH4 PoI depth?
   one CH3 on-screen stat? name Amazon/Jassy in CH2? include the court-paused-ban beat?
3. Run the live [VERIFY] checks before anything goes on screen: TAO price/inflow (CH6), spot-TAO ETF
   filing status (CH8), court-paused-ban/DOJ-appeal (CH2), and Mike's ACTUAL TAO bottom call + current
   multiple (CH7 plug). Don't ship stale figures; frame the call as vindicated, not self-undermining.
4. Pick the **The Invaders** variant — the downloaded file is the background-VOCALS version; grab the pure
   instrumental if the vocals clash under VO (CH5-6 bed).
5. Build **BROLL-PLAN.md** — cover every `[COVER]` beat. (CH5 system-design diagrams already built in
   `graphics/`; music + riser/impact cues already notated in the screenplay.)
6. THEN production: record -> Phase 1 `to_low_bps.py` -> Phase 2 `transcribe.py` -> Phase 3 defumble +
   desilence -> Phase 4 Remotion gated-face comp. (Full procedure: `../../longform-edited.md`.)

> DONE already (don't redo): all 9 chapters drafted; [FACE]/[COVER] sparse pass; Title-card flags;
> CH5 diagrams; music beds sourced + assigned + license codes; riser + impact SFX libraries + cues.

## Sources (Fable ban + TAO, gathered 2026-06-15)
NBC, TIME, Al Jazeera, Fortune (Fable/Mythos ban + "Fix this code" vuln); Bitget, Coindoo, Stocktwits
(TAO move + AI-crypto inflows); cryptotimes guide + learnbittensor.org / taostats / discoverbittensor
docs (Bittensor mechanics + Yuma Consensus). Full URLs in conversation history.

---

# 2026-06-17 — Phase 4 production built (CH1–9 gated-face edit) + pick-up notes

## ⛳ FIRST THING NEXT SESSION (Mike does this WITH me when he wakes up)
1. **RUN the full re-render — nothing was rendered tonight** (the comp changes are all committed to the file;
   the render was stopped at Mike's request to wait until he's back). Command:
   `cd video-creation/remotion && npx remotion render src/index.ts BittensorCh1to6 "../longform-edited/media/bittensor-for-the-future/renders/bittensor-FULL-v3.mp4"`
   **Mike's standing instruction (2026-06-17): render the ENTIRE video as ONE render — NEVER concatenate
   slices from previous renders.** Includes the two big fixes (b-roll now visible; ending b-roll CH7–9 added).
   ~14:06 / ~40 min. ⚠️ Disk filled earlier → ENOSPC; Mike cleared the recycle bin + I cleared ~5 GB of
   orphaned temp dirs (~22 GB free). If ENOSPC recurs, delete `%LOCALAPPDATA%\Temp\remotion-*` first.
2. **THEN QA PROPERLY — sample frames across ALL 9 chapters, never spot-check.** Hard lesson this session:
   shipped a hidden-b-roll edit + an unviewed Grayscale bot-error screenshot by declaring "done" off a few
   frames. Verify: image/video b-roll VISIBLE (incl. the new CH7–9 cutaways), no error/paywall/bot frames,
   containers track the spoken words, CH6→CH7 music/face transition clean.

## State of the edit
Whole CH1–9 gated-face edit is BUILT. Comp = `video-creation/remotion/src/BittensorCh1to6.tsx` (the id
`BittensorCh1to6` is a misnomer — it renders the **full CH1–9 video**, dur 845.74s).
Render: `cd video-creation/remotion && npx remotion render src/index.ts BittensorCh1to6 "<out>.mp4"`
(`--frames=A-B` for a slice). Spine = `2026-06-17 11-40-46 GATED-DESILENCED.mp4` (= `assets/projects/bittensor/spine.mp4`).

### Done / fixed (don't redo)
- **B-roll has THREE types** (Mike's model, now in `../../skills/broll-and-containers.md`): image, video,
  **CSS container**. Containers are the dominant cover type (~5–12s); image/video are ≤4s cutaways that
  render **ON TOP** of the containers (containers must NOT cover them — this was the render-order bug).
- **Containers**: deck-styled (Playfair + JetBrains + DM Sans + orbs + palette), **every cue snapped to the
  word-level transcript** (`_tmap.txt`); CH2 sync drift + the CH5 9:02–9:16 gap fixed.
- **CH5 mechanics** = built `graphics/` system-design diagrams swapping per bullet + text sub-containers.
- **Captions** = montserrat **1 word / 2 if very small**, CH1 only (`bittensorCaptions.ts`).
- **Music** = Retribution → Hold The Line → The Invaders → Common High Speeds (CH7 plug) → Searching (CH8–9),
  with inter-bed breaths.
- **Receipts** = `ban-aljazeera.png` + `fix-this-code-fortune.png` (BOTH visually QA'd, real). Grayscale SEC
  receipt was a bot-block error page → DELETED, replaced with a clean ETF container.
- **CH7 plug** = face-on + `CryptoRich.vip` CTA lower-third + (new) market/parabolic cutaways on the gains.
- **Skills dir** = `../../skills/{captions.md, broll-and-containers.md}`: rule-zero sync-to-transcript +
  QA-every-asset gate + render-order rule + three-b-roll-types. `longform-edited.md` opens with a pointer.

### KNOWN PENDING (real to-do)
1. **CH7 LAB / Velvet / TAO-Feb charts — BUILT + WIRED 2026-06-18.** Code-rendered DARK deck-styled charts
   from REAL CoinGecko data (`_build_call_charts.js` + `_chartdata/`), screenshotted via headless Chrome to
   `assets/projects/bittensor/img/chart-{tao,lab,velvet}.png`. Arrows per Mike's spec: LAB & Velvet → gold
   "MY CALL" arrow at the BEGINNING of the chart (his entry); TAO → arrow at the FEB BOTTOM (CG low
   $145.65 on 2026-02-12; Mike's VO says "$160"). Wired into BROLL as held evidence cutaways:
   chart-tao 648.5–658.5, chart-lab 661.0–666.3, chart-velvet 666.6–672.0. **No multiple printed on screen
   on purpose** — VO carries 353x/58x, but CG-tracked range shows LAB ~143x / VELVET ~31x (his entry
   predates CG tracking), so printing a number would contradict either the VO or the visible chart. Tokens
   used: CG ids `bittensor`, `lab` (LAB rank 22), `velvet` (VELVET rank 200) — CONFIRM these are the right
   tokens. First chart-bearing render = `bittensor-FULL-v4.mp4` (chartless `FULL-v3` superseded).
2. **Numbers Mike owes (for VO accuracy / CH6 container only, NOT the CH7 charts):** "$210→$261, +36% wk"
   vs live; "353x LAB / 58x velvet"; CH6 inflow. The CH6 container still shows **"(Verify live figures before
   final.)"** until locked.
3. **Live [VERIFY] before publish:** TAO price/inflow (CH6/CH8), spot-TAO ETF filing status (CH8),
   court-paused-ban / DOJ-appeal (CH2), Mike's actual TAO bottom call + multiple (CH7). Frame as vindicated.
4. **The Invaders** staged file = background-VOCALS variant; swap to pure instrumental if vocals clash.
5. Receipt sidebar-ad cropping = LOW priority (Mike: "no refinements needed").
6. Superseded renders on disk (`CH1-4-v1/v2`, `CH1-6-v3/v4`, `FULL-v1`) — delete to reclaim ~1 GB once
   `FULL-v3` is approved.

### Chapter map (absolute desilenced time; re-time via `_tmap.txt`)
CH1 0–49.78 · CH2 49.78–165 · CH3 165–241.7 · CH4 241.7–440.76 · CH5 440.76–606.46 · CH6 606.46–644.9 ·
CH7 plug 644.9–700.2 (face) · CH8 700.38–794.5 · CH9 794.5–845.74. Face spans in `FACE_SPANS` + `faces-desilenced.json`.

### Lessons (don't repeat)
- Sync every cue to the word-level transcript, never estimate.
- QA every captured asset visually before use; sample frames across EVERY chapter before "done."
- Image/video b-roll renders ON TOP of containers; containers never cover them.

---

# 2026-06-18 — bittensor-FULL-v4 rendered (the "one and for all" pass) + process fixes

**Deliverable:** `renders/bittensor-FULL-v4.mp4` (363 MB, 14:05, 25361 frames). QA'd across all 9 chapters
from the MP4 (contact sheet `_qa_render_all.png`). Supersedes FULL-v1/v3 (chartless) — delete those once v4 approved.

**What changed this session:**
1. **CH7 call charts BUILT + wired** — `_build_call_charts.js` renders dark deck charts from real CoinGecko data
   to `render-assets/img/chart-{tao,lab,velvet}.png`. TAO arrow at Feb bottom; LAB/Velvet arrows at entry ("MY
   CALL"). No multiple printed (VO carries 353x/58x; CG range differs). Placed CH7 648.5/661/666.6.
2. **16 orphaned Envato clips reconciled** — 15 processed into `render-assets/vid/` + placed on cover beats
   (transcript-aligned, none over a FACE span); `war-suffering-archival` REJECTED (Auschwitz, off-tone). Full
   file-level list now in BROLL-PLAN.md.
3. **11:31 fumble CUT** — ~0.38s desilencer leftover between "...not done."(691.00) and "They're..."(691.44).
   Skipped via two-sequence Spine (trimBefore) + central `sh()` shift of all post-cut cues; B_DURATION −11 frames.
4. **Assets RELOCATED** — moved `video-creation/assets/projects/bittensor/` → `render-assets/` in THIS project
   folder (Mike's rule: video-creation/assets = reused-only). Comp `asset()`=staticFile(f); render with
   `--public-dir ../longform-edited/media/bittensor-for-the-future/render-assets`.
5. **GPU finding** — Remotion can't NVENC-encode h264 on Windows (errors on "required"); encode is CPU. Set
   concurrency 8 (cc4 7.5fps→cc8 10.4fps on 20-core). See memory reference_remotion_no_gpu_h264_windows.
6. **Process gate added** — `skills/broll-and-containers.md` now requires a FILE-LEVEL BROLL-PLAN manifest +
   pre-render comp↔folder reconciliation (zero orphans). Root cause of the orphan bug documented.

**Render command (canonical now):**
`cd video-creation/remotion && npx remotion render src/index.ts BittensorCh1to6 "../longform-edited/media/bittensor-for-the-future/renders/<out>.mp4" --public-dir "../longform-edited/media/bittensor-for-the-future/render-assets"`

**Still pending (content accuracy, Mike's call — NOT the edit):** CH6 "(Verify live figures)" container; live
VERIFY (TAO price/inflow, ETF status, court-paused-ban, TAO-bottom multiple); The Invaders vocals→instrumental swap.
