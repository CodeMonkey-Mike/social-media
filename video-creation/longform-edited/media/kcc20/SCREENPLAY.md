# kcc20 - SCREENPLAY

_Pre-production script for the longform graph (GATE 1). Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py --face-max 6`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; no cold open. Authored 2026-10-18 by the screenplay-strategist from PROJECT-LOG.md (the LOCKED brief + Mike's hard constraints) and DATA.md (compiled 2026-10-18)._

- **Working title:** KCC-20: Real Tokens on Kaspa L1 (alternates for Mike at GATE 1: "KCC-20 vs KRC-20, Explained" · "Kaspa's First Native Token Standard Hits Last Call")
- **Track:** longform-edited (16:9, heavily edited), CryptoRich channel. Captions ON.
- **Archetype / register:** EPIC informative explainer. Gear map: **CH1 = gear 3** (peak epic hook) → **CH2 = gear 2** (polished explainer, the four ideas) → **CH3 = gear 2** (the marquee contrast, declarative edges) → **CH4 = gear 2** (where it stands, status stated plainly) → **CH5 = gear 3** (conviction close, all upside conditional).
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6). **6 `[FACE]` lines in the whole video** (CH1 hook line, CH1 thesis landing, then CH5 from the second conviction line to the end: two conviction lines, what-to-watch, the CTA; Mike 2026-10-21, matching where he looked into the camera). Every other line is `[COVER]`. Graph constraint `--face-max 6`.
- **Target runtime:** 5:00 (hard window 4:45 to 5:15). Spoken-word budget ~780 words (at Mike's read pace of roughly 160 words a minute that is around 4:50 of speech) plus one ~20 s clip insert and three title-card breaths, landing around 5:15 (the top of the window, after Mike's CH5 Beat 4 conviction lines, 2026-10-20). Per-chapter budgets on each chapter header. Runtime is a target, never a reason to cut recorded content; lines flagged 💬 trim-first are the ones to drop BEFORE recording if a chapter reads long.
- **Fact source:** every number, date, name and quote traces to `DATA.md` in this folder (compiled 2026-10-18). Chart IDs C1 to C22 = DATA.md CHART-SOURCE INDEX. The deck and the reference video are not sources; where they disagree with the `kaspanet/kccs` repo, the repo decides.
- **Spelling (for captions, graphics and the transcriber):** KCC-20 (Kaspa Calls for Conventions) and KRC-20 (Kasplex) are DIFFERENT standards and are never swapped. Whisper will write "KCC90", "KCS 20", "KRC 20", "KCC 20", "Casper", "Caspa Flex", "Tokamak": correct to KCC-20 / KRC-20 / Kaspa / Kasplex / Toccata. Spell exactly: KCC-1, KCC-2, KCC-0, Toccata, covenants, UTXO, storage mass, Borrowed Receive, Last Call, Final, Draft, DAGKnight, Igra, Kasplex, KasStacker, Kaspalytics. Kaspa is never "Casper".

---

## THE HOOK / THESIS

On October 7th, 2026, pull request 31 merged into `kaspanet/kccs`, Kaspa's own conventions repo, and KCC-20, the fungible token covenant specification, moved into Last Call, the final review window before a standard goes Final (DATA.md T7). KCC-20 is the first fungible token standard in that repo (T2), made possible by the covenants the Toccata hard fork activated on June 30th, 2026 (Pillar 1). Its token state lives inside covenant UTXOs on the base layer and its transfers are enforced by L1 script rules, not by an off-chain indexer (T4). KRC-20, Kasplex's third-party protocol, proved the demand for tokens on Kaspa: around 2,160 tokens by Kasplex's own indexer count (T5). KCC-20 is the attempt to make tokens first-class citizens of the base layer. It cannot go Final before KCC-1 and KCC-2 do, no Last Call deadline is set in any header, and the number of Final technical standards in the repo today is zero (T8). Real, close, not finished.

> [!WARNING]
> **DO NOT AIR the deck's timeline dates.** "July 15: KCC-20 merged as Draft" is WRONG (July 15 is the repo's creation; the Drafts merged August 20, 2026). "August 22: first implementer flags gaps" is the CLOSE date of issue #11 (opened July 26). "September 22: Last Call proposed, still open" is STALE (merged October 7). Airable: "July 15, the conventions repo opens. August 20, KCC-1, KCC-2 and KCC-20 land as Drafts. September 22, the Last Call pull request opens. October 7, it merges." (DATA.md section 4, rows 1 to 4.)

> [!WARNING]
> **DO NOT AIR any end date for Last Call, and never imply a date for Final.** KCC-0 says an editor sets a `Last-Call-Deadline` "typically 14 days later"; none of the three Last Call headers carries that field (read 2026-10-18). Airable: "Last Call is the final review window, typically around two weeks, but no deadline has been set in the spec header." (DATA.md T8, section 4 row 5.)

> [!WARNING]
> **DO NOT AIR "KCC-20 is named as a nod to ERC-20" or "KCC-20 was the first token on Kaspa L1".** No primary source explains the name; KaspaCom's KCC20V2 was deployed before the spec merged. Airable: "think ERC-20, but enforced by the base layer's own script" as MIKE'S analogy, and "the first fungible token STANDARD in Kaspa's own conventions repo". (DATA.md T2, T3, section 4 rows 6 and 18.)

> [!WARNING]
> **DO NOT AIR "once KCC-20 is Final, apps can issue tokens on Kaspa".** Tokens are ALREADY deployed against the Draft (roughly 150 by one community tracker). Final is convergence, not permission; the README itself says a finalized KCC "does not make the convention protocol ground truth". Airable: "tokens exist today, the shared standard does not yet". (DATA.md section 4 row 16.) Also OUT OF SCOPE for the whole video: price, market cap, open interest, funding, dominance, price targets (brief hard constraint). Supply and usage facts only, framed conditionally.

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | LAST CALL | Hook (opens the video, no cold open): the October 7 news lands on Mike's face; the PR #31 receipt; the thesis lands on his face; handoff | Bed A starts | OFF (pure hook, face is frame one) | ~30 s / ~75 words |
| CH2 | HOW KCC-20 WORKS | The teaching chapter: Toccata gave Kaspa covenants; the four ideas as system-design containers (C1), Borrowed Receive gets its own UTXO diagram (C2) | Bed B starts | **ON: "HOW KCC-20 WORKS"** | ~80 s / ~210 words |
| CH3 | KCC-20 VS KRC-20 | The marquee contrast as ONE system-design diagram (C3), the token-count receipts, Sivan Helfer's own voice (CLIP-1) | Bed B continues | OFF (continues Bed B, flows in on the C3 reveal) | ~70 s / ~135 words + ~20 s clip |
| CH4 | WHERE IT STANDS | The dated timeline (C5) ending on October 7; what Last Call means (C6); the KCC-1 → KCC-2 → KCC-20 dependency; the kccs receipts | Bed C starts | **ON: "WHERE IT STANDS"** | ~60 s / ~160 words |
| CH5 | THE BIGGER PICTURE | Builders back on the main code, DAGKnight no date, the tiny-base usage line, the conditional case, Mike's worth-the-wait conviction, what to watch, CTA (or hard-out, Mike's call) | Bed D starts | **ON: "THE BIGGER PICTURE"** | ~75 s / ~215 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it. No mid-roll plug.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. SPARSE: one sentence as punctuation (tight pairs allowed). This video: 6 in total (two in CH1, four in the CH5 close) |
| 🗣️ `[COVER]` | spoken, VO over container / diagram / receipt / b-roll. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (chart, container, receipt, b-roll cue). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken |

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed; a chapter that continues a bed flows in cardless. The card set falls out of the MUSIC-MOOD-PLAN:

| CH | Card | On-screen text | Why |
|---|---|---|---|
| CH1 | OFF | none | pure hook, Mike is frame one, Bed A starts under him |
| CH2 | **ON** | HOW KCC-20 WORKS | Bed B starts |
| CH3 | OFF | none | continues Bed B; the C3 diagram reveal is the visual break |
| CH4 | **ON** | WHERE IT STANDS | Bed C starts |
| CH5 | **ON** | THE BIGGER PICTURE | Bed D starts |

**FACE/COVER rules (Convention 3):** face is gated OFF by default; a face cut is ONE sentence (tight pairs allowed); the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say. This video carries six face lines (CH1 hook, CH1 thesis landing, and the CH5 close from the second conviction line through the CTA, one continuous run, Mike 2026-10-21).

**Explainer visuals (Convention 4):** system-design containers, code-rendered, one per talking point, spotlight-swapped. Never tables, never AI images for text. The deck's comparison table becomes the C3 diagram, two lanes with nodes and arrows.

**Clip inserts (Convention 6):** CONSIDERED on every video. A third-party clip that plays with its OWN voice while the spine pauses is a 🎞️ `[INSERT]` line between its set-up line (which ENDS the sentence) and the resume line, plus a row in `## CLIP-INSERTS`; when nothing fits that section says NONE with the reason. Never a muted cover.

**Honesty (persona `verified_claims_only`):** caveats are LINES inside the beat they belong to, never a section. All upside conditional. No price talk anywhere. "Around" before a rough number, never "about".

---

## CH1 - LAST CALL
**Register:** gear 3, peak epic. Short hammer sentences. No "right?" tags, no hedge, no whole-video preview, no fake-contrarian framing.
**Title card:** OFF. **Music:** Bed A starts (dark electronic epic, cold_hot opening, aggressive; see MUSIC-MOOD-PLAN).
**Budget:** ~30 s, ~75 spoken words.

**Beat 1 - the hook (LOCKED opening)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Kaspa's core contributors just moved their first token standard, KCC-20, into its final review window.**
🎬 `[SHOW]` Face for the locked line only (frame one of the video is Mike). On "window" cut to H0, a full-frame motion-type card "KCC-20 · LAST CALL" over dark Kaspa-teal atmosphere b-roll. Bed A hits cold on word one.

**Beat 2 - the receipt**

🗣️ `[COVER]` October 7th, 2026. Pull request 31 merges into Kaspa's own conventions repo, and the status on the spec flips to Last Call, the final review window before a standard goes Final.
🎬 `[SHOW]` C9 receipt, a 2 s flash of PR #31 with the merged badge, then C8, the kcc-0020.md header crop with "Last Call" highlighted. Real-site captures, never restyled.
💬 `[NOTE]` Gear 3 here: say the date and the PR number like a headline, no softening.

**Beat 3 - the thesis (LOCKED landing)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Real tokens, on Kaspa's base layer, with every transfer enforced by the chain's own script rules, not by an off-chain indexer.**
🔒 `[SAY-EXACT]` 🗣️ `[COVER]` Real. Close. And not finished.
💬 `[NOTE]` FACE BACKGROUND SWAP on the two CH1 face lines (Mike, 2026-10-21): the hook and the thesis air as Higgsfield video-to-video regenerations with a Kaspa greenish-cyan background (a dark wall, a large soft cyan Kaspa "K" glow, a faint BlockDAG of cyan nodes fading into the dark), per comp-build.md section 3b and skills/comp-build/face-bg-swap.reference.md: 480p, whole seconds, green eyes in the prompt, Mike gates F1 before F2. Never a key or a matte. The CH5 face run keeps the recorded room.
🎬 `[SHOW]` On "indexer" cut to H1, a three-word motion card "REAL · CLOSE · NOT FINISHED", one word landing per spoken word. Hold the dark atmosphere under the locked line.
🔍 `[VERIFY]` KCC-20 status is still "Last Call" in the `kaspanet/kccs` README and the kcc-0020.md header on recording day (DATA.md T7; it can move to Final or back to Review at any time).
🗣️ `[COVER]` So, let's dive into all this.
💬 `[NOTE]` Handoff alternates for Mike are listed in OPEN QUESTIONS (persona `dive_in_variants`: the scripted line is `approved` and is not the most recent in `recent_use`).

> [!IMPORTANT]
> CH1 verify list:
> - "core contributors / first token standard" = KCC-20 authors Sivan Helfer, Michael Sutton, Ori Newman, Romain Billot; the first (and only) fungible token spec in `kaspanet/kccs` (DATA.md T2, section 3, read 2026-10-18). Never "the first token on Kaspa L1" (KaspaCom's KCC20V2 predates the spec).
> - "October 7th, 2026 / pull request 31" = PR #31 "KCC0 Compliance for KCC-20 + Last Call advancement", opened 2026-09-22 by saefstroem, merged 2026-10-07 by michaelsutton, commit `3fbec52` (DATA.md T7); receipt C9.
> - "final review window" = KCC-0 section 4.2 "Last Call: The final review window." (DATA.md T8); never add a date.
> - "enforced by the chain's own script rules" = KCC-1 covenant definition + KIP-17 (Active, activated in Toccata) (DATA.md T4).
> - The two face lines above plus the CH5 close (second conviction line through the CTA) are the video's ONLY face lines (graph `--face-max 6`).

---

## CH2 - HOW KCC-20 WORKS
**Register:** gear 2 explainer, declarative edges. This chapter TEACHES; every line is cover. No unglossed jargon: covenant, fungible, UTXO and storage mass each get their plain-language handle inside the line.
**Kinetic-text EXPERIMENT (Mike, 2026-10-21): this chapter carries the 2023 motion + sound devices** (`assets/sfx/kinetic-text/library.json` -> `devices`; recipe `skills/overlays/overlays.md` section 2): the four idea labels as `kt-side-panel` panels alternating RIGHT / LEFT with the C1 container reframed into the free 55 percent, plus three `kt-keyword-pop` pops whose sound is picked by meaning. Mike's rulings (2026-10-21): four panels, yes; the panel sits beside the DIAGRAM (CH2 has no face on screen), yes; LOOK = the panel is the house dark surface and the text's key words are Kaspa greenish cyan over white, because it has to CONTRAST with the background (yellow only if a background is bright; visual-qa checks the contrast). House display font; 2023 motion and sound exactly. Captions OFF for the hold of each keyword pop. No 2023 device anywhere else except the one `minecraft-damage` oof in CH4 Beat 2.
**Title card:** ON, "HOW KCC-20 WORKS". **Music:** Bed B starts (subtle, mid-energy, loop-safe explainer bed; it carries through CH3).
**Budget:** ~80 s, ~210 spoken words.

**Beat 1 - the fork that made it possible**

🗣️ `[COVER]` Start with where this comes from. On June 30th, 2026, the Toccata hard fork gave Kaspa covenants. A covenant is a rule built into a coin that controls how it can be spent, and where it can go next.
🎬 `[SHOW]` C12 receipt: the rusty-kaspa v2.0.0 release page, the activation line "roughly on June 30, 2026, at 16:15 UTC" and the KIP list highlighted. Then a small system-design container: Toccata → KIP-17 covenants + KIP-20 covenant IDs → KCC-20 sits on top.
🗣️ `[COVER]` KCC-20 is the shared rulebook for a fungible token built from those covenants, fungible meaning every unit is the same as every other. Four ideas.
🎬 `[SHOW]` C1 overview state: the four idea tiles appear as empty slots (01 to 04), each lighting up as its beat arrives. One container at a time after this frame.

**Beat 2 - idea 01, a common interface**

🗣️ `[COVER]` Idea one, a common interface. Every KCC-20 token carries the same state block, the amount, the owner, a few settings, and the same transfer entrypoint. So any wallet, indexer or app reads it the same way.
🎬 `[SHOW]` C1 state 01: one KCC-20 state block (amount, owner, owner scheme, borrow scheme, borrow guard, extension commitment) with arrows from Wallet, Indexer, App into the same `transfer` / `transfer_delegator` entrypoints. Spotlight the entrypoint on "same way".
🎬 `[SHOW]` KINETIC `kt-side-panel` RIGHT on "Idea one": C1 state 01 reframes into the left 55 percent, the cyan panel slides in from the right (0.5 s), the text "IDEA ONE / A COMMON INTERFACE" rises in and hovers for the beat; sound `swoosh-1` starting 0.17 s before the panel moves, the text pop silent.

**Beat 3 - idea 02, extended state**

🗣️ `[COVER]` Idea two, extended state. A token can carry its own data and behavior behind one digest, and transfers pass that digest through untouched.
🎬 `[SHOW]` C1 state 02: the base state plus an opaque `extension_commitment` box; a transfer arrow passes the box through unchanged.
🎬 `[SHOW]` KINETIC `kt-side-panel` LEFT on "Idea two": C1 state 02 reframes into the right 55 percent, the panel slides in from the left, "IDEA TWO / EXTENDED STATE" rises in and hovers; sound `swoosh-2` starting 0.07 s before the panel moves.

**Beat 4 - idea 03, flexible authority through KCC-2**

🗣️ `[COVER]` Idea three, flexible authority, and this comes from KCC-2. The owner of a token can be a public key, a key commitment, a script, or another covenant. So covenants can own tokens, and govern them.
🎬 `[SHOW]` C1 state 03: the owner field fanning to four nodes, 0x00 public key, 0x01 / 0x02 key commitment, 0x03 script (P2SH), 0x04 covenant ID. Light the 0x04 node on "another covenant".
🎬 `[SHOW]` KINETIC `kt-side-panel` RIGHT on "Idea three": "IDEA THREE / FLEXIBLE AUTHORITY / FROM KCC-2" (KCC-2 in the key colour) rises in and hovers; sound `swoosh-1`. Then `kt-keyword-pop` on "covenants can own tokens": "COVENANTS CAN OWN TOKENS" pops over the lower picture (scale 100 to 110, the 2 degree jiggle), held to the end of the line; sound `twinkle` ON the first frame (the positive / discovery sound).

**Beat 5 - idea 04, Borrowed Receive**

🗣️ `[COVER]` Idea four, Borrowed Receive. Here's the thing: every new UTXO, every new unspent coin, has to be funded with KAS, and a rule called "storage mass" makes tiny new outputs expensive on purpose.
🎬 `[SHOW]` C2 state LEFT, the "new UTXO" path: sender creates a fresh token UTXO, must fund it with KAS, storage mass rises for small outputs (KIP-9).
🎬 `[SHOW]` KINETIC `kt-side-panel` LEFT on "Idea four": "IDEA FOUR / BORROWED RECEIVE" rises in and hovers; sound `swoosh-2`. Then `kt-keyword-pop` on the quoted term: "STORAGE MASS" pops, held to the end of the line; sound `knock-pop` ON the first frame (neutral keyword).
🗣️ `[COVER]` So instead of a new UTXO for every incoming token, the sender tops up one you already hold. Same owner, the KAS inside cannot go down, only the token amount grows.
🎬 `[SHOW]` C2 state RIGHT, the "borrowed receive" path: the recipient's existing token UTXO consumed and recreated, owner unchanged, KAS value floor, token amount up, gated by borrow_scheme / borrow_guard.
🎬 `[SHOW]` KINETIC `kt-keyword-pop` on "grows": "ONLY THE TOKEN AMOUNT GROWS" pops over the lower picture, held to the end of the line; sound `cash-register` started 0.17 s early so the bell lands on "grows" (THE money moment of the video, Mike's cash-register ask, 2026-10-21; the only cash register in the video, CH5 stays epic).
💬 `[NOTE]` Optional one-line caveat if Mike wants brutal honesty here (adds ~5 s): "And a fix against front-running that borrow path landed in August, before anyone built on it." (PR #18, merged 2026-08-28, DATA.md Pillar 2.) A line inside the beat, never a section.

> [!IMPORTANT]
> CH2 verify list:
> - "June 30th, 2026 / Toccata" = rusty-kaspa v2.0.0 release, activation DAA 474,165,565 "roughly on June 30, 2026, at 16:15 UTC"; corroborated by Kaspalytics issue 1 (DATA.md Pillar 1); receipt C12.
> - "script that can inspect a transaction and restrict how its outputs get spent" = KCC-1's covenant definition, paraphrased (DATA.md T4).
> - Idea 01 = kcc-0020.md section 1 "State" + section 2 "Transfer Interface" (`transfer`, `transfer_delegator`) (DATA.md Pillar 2 (01)).
> - Idea 02 = section 4 "State Extendability", `extension_commitment`; Sutton 2026-08-29 "The common KCC20 fields remain directly visible onchain" (DATA.md Pillar 2 (02)).
> - Idea 03 = KCC-2 scheme table 0x00 to 0x04; "the owner field is defined by KCC-2" (DATA.md Pillar 2 (03)). Every label on C1 state 03 is copied from kcc-0002.md.
> - Idea 04 = kcc-0020.md section 5 + the companion guide: "the KAS value cannot decrease, and the owner and extended state remain unchanged" (a FLOOR, never "stays put"); storage mass = KIP-9 (DATA.md Pillar 2 (04), section 4 row 17).

---

## CH3 - KCC-20 VS KRC-20
**Register:** gear 2 explainer with declarative edges. All cover. KRC-20 is described, never disparaged: it proved the demand.
**Title card:** OFF (continues Bed B; the chapter opens on the C3 reveal, no card, no spoken title).
**Budget:** ~70 s total: ~135 spoken words plus CLIP-1 (~20 s with its own voice).

**Beat 1 - Kaspa already has tokens**

🗣️ `[COVER]` Now, Kaspa already has tokens. KRC-20, from Kasplex, a third-party protocol, live since September of 2024, around 2,160 tokens by Kasplex's own indexer count. It proved the demand.
🎬 `[SHOW]` C4, the animated token-count bars: KRC-20 2,164 (Kasplex API, dated) counting up first, KCC-20's bar held empty until Beat 4. Source line on the chart. Then a 2 s flash of C19, the Kasplex API JSON with `"tokenTotal":"2164"`.
🔍 `[VERIFY]` Re-pull `tokenTotal` from https://api.kasplex.org/v1/info on render day (2,164 on 2026-10-18); the spoken "around 2,160" stays, the chart carries the exact dated figure.

**Beat 2 - where the token actually lives (the marquee diagram)**

🗣️ `[COVER]` The difference is where the token lives. With KRC-20, token operations are written onto Kaspa as data, and the Kasplex indexer works out who owns what. Your balance is the indexer's answer.
🎬 `[SHOW]` C3, THE marquee system-design diagram, fills the frame, two lanes. KRC-20 lane lights first: Kasplex (third party) → token ops inserted as data on L1 → the Kasplex indexer reads and interprets → "balance = the indexer's answer". Spotlight the indexer node on "indexer's answer".
🗣️ `[COVER]` With KCC-20, the token state sits inside a covenant UTXO on the base layer, and the chain's script enforces every transfer. Your balance is what the chain enforces.
🎬 `[SHOW]` C3 KCC-20 lane lights: `kaspanet/kccs` (core contributors) → token state in covenant UTXOs on L1 → L1 script (KIP-17 covenants, KIP-20 IDs) enforces the transfer → "balance = what the chain enforces". Both lanes hold side by side on "enforces".

**Beat 3 - the author's own words (a clip insert, Convention 6)**

🗣️ `[COVER]` Sivan Helfer, the first-listed author of KCC-20, put it plainly back in June, a week before Toccata went live.
🎞️ `[INSERT]` CLIP-1: Sivan Helfer, ~20 s with his own voice, the spine pauses after the set-up line; burned caption "Sivan Helfer, KCC-20 author, June 2026, a week before Toccata". Transition in and out, Bed B ducked automatically.
🗣️ `[COVER]` That is the whole difference.
💬 `[NOTE]` The set-up line ends on "live" with a breath; that word end is the splice point. Mike never reads the clip's words. If Mike rejects CLIP-1 at GATE 1, the resume line becomes "That is the whole difference, the chain itself knows the token exists." and reads as his own point.

**Beat 4 - very early, and my framing**

🗣️ `[COVER]` On the KCC-20 side it is very early, roughly 150 tokens by one community tracker's count. Think ERC-20, enforced by the base layer itself.
🎬 `[SHOW]` C4 completes: the KCC-20 bar counts up to the dated KasStacker figure next to the KRC-20 bar, launch years 2024 vs 2026 under each. Then a 2 s flash of C18, the KasStacker "KCC-20 tokens" block.
🔍 `[VERIFY]` Re-read https://kasstacker.org/ on render day (146 tokens, 3,604 live states on 2026-10-18; third-party; kcc20.info was down at read). Spoken stays "roughly 150"; chart carries the exact dated figure with "KasStacker, third-party count" on the source line.
💬 `[NOTE]` "Think ERC-20" is Mike's own analogy, never a claim about where the name comes from (DATA.md T3). Do not add "that is why it is called 20".

> [!IMPORTANT]
> CH3 verify list:
> - "Kasplex, a third-party protocol" = Kaspa community wiki "designed by the 3rd party group" + the kasplex GitHub org (DATA.md Pillar 3; wiki is secondary, Kasplex docs unreachable, Open question 2).
> - "live since September of 2024" = cryptonews.fr 2024-09-16 (secondary); never say the exact day on screen (DATA.md Pillar 3).
> - "around 2,160 tokens" = Kasplex API `tokenTotal` 2,164 (2026-10-18) [VERIFY]; never the deck's 2,153.
> - KRC-20 lane = wiki "data insertion protocol, open-source indexer" + `kasplex/go-krc20d` "KRC-20 node written in Go" (DATA.md Pillar 3). KCC-20 lane = kcc-0020.md section 1 + KCC-1 + KIP-17 + KIP-20 (DATA.md T4).
> - "roughly 150 tokens by one community tracker's count" = KasStacker 146 (2026-10-18) [VERIFY]; never a hard "146" in the VO.
> - CLIP-1 words and speaker confirmed by ear before any cut (DATA.md Open question 9); caption dates it before Toccata and before the Draft merge.

---

## CH4 - WHERE IT STANDS
**Register:** gear 2, status stated plainly, with a light, playful tone (Mike, 2026-10-20: "we're getting there slowly but surely, and it can be fun along the way"). Declarative, no implied date for Final, no hedging run-ons. All cover.
**Title card:** ON, "WHERE IT STANDS". **Music:** Bed C starts, MIKE'S PICK: Going Shopping (Again), the 44 s verse section (playful, quirky, childlike, steady; see MUSIC-MOOD-PLAN).
**Budget:** ~60 s, ~160 spoken words.

**Beat 1 - the timeline, from the primary sources**

🗣️ `[COVER]` The timeline, straight from the repo. June 30th, Toccata activates. July 15th, the conventions repo opens. August 20th, KCC-1, KCC-2 and KCC-20 land as Drafts.
🎬 `[SHOW]` C5, the animated timeline (code-built): rungs land one at a time as spoken, Jun 30 · Jul 15 · Aug 20. Styled as the CH4 board-game path: each date a square, a KCC-20 token piece hopping forward square to square, the gold square on the newest beat.
🗣️ `[COVER]` September 22nd, the Last Call pull request for KCC-20 opens. October 1st, KCC-1 and KCC-2 move to Last Call. October 7th, KCC-20 joins them.
🎬 `[SHOW]` C5 continues: Sep 21 (KCC-0 Final, on the chart only, not spoken) · Sep 22 · Oct 1 · Oct 7, the Oct 7 rung lands big. Then a 2 s flash of C10, the commits log with "#32", "#33" on Oct 1 and "#31" on Oct 7.

**Beat 2 - what Last Call means**

🗣️ `[COVER]` Last Call is the final review window. An editor sets a deadline, typically around 14 days out, but none of the three headers carries one today. No official end date.
🎬 `[SHOW]` C6, the Last Call ladder (code-built): Draft → Review → Last Call ("typically 14 days", "deadline: not set") → Final. Then a 2 s flash of C11, the KCC-0 section 4.2 paragraph with "typically 14 days later" highlighted.
🎬 `[SHOW]` KINETIC `kt-keyword-pop` on "No official end date": "NO OFFICIAL END DATE" pops over the lower picture (the two-line verdict variant, "NO" in the key colour), held to the end of the line; sound `minecraft-damage` ON the first frame (the comedic oof, the NEGATIVE-verdict sound; once in the video, and it fits the playful CH4 bed). Captions OFF for the hold. CH5's "DAGKnight still has no date" stays serious, no oof there.
🔍 `[VERIFY]` On render day, re-read the kcc-0001.md, kcc-0002.md and kcc-0020.md headers for a `Last-Call-Deadline` field (none on 2026-10-18). If one appears, the line changes to the dated deadline and "No official end date" is dropped.

**Beat 3 - the dependency, and the number zero**

🗣️ `[COVER]` And KCC-20 cannot go Final on its own. It requires KCC-1, the covenant layout, and KCC-2, the authority schemes, and those go Final first. KCC-1, then KCC-2, then KCC-20.
🎬 `[SHOW]` C5 end state: the dependency arrows KCC-1 → KCC-2 → KCC-20 draw in, then the C6 Final criteria list spotlights "every entry in Requires is itself Final".
🗣️ `[COVER]` It also needs published test vectors and a public implementation that passes them. Today, the number of Final technical standards in that repo is zero.
🎬 `[SHOW]` C7 receipt, the `kaspanet/kccs` README index table: KCC-0 Final, KCC-1 / KCC-2 / KCC-20 Last Call, KCC-23 Draft. Spotlight the Status column on "zero".
🗣️ `[COVER]` By late July, implementers were already reporting their tokens only partly matched the draft.
💬 `[NOTE]` One caveat line inside the beat, not a section. Receipt C20 (KaspaCom's issue #11) shows on this line, Mike approved 2026-10-21; the VO is whatever he recorded; the deck's "August 22" is the close date of that issue, never the flag date. Trim-first if CH4 runs long.

> [!IMPORTANT]
> CH4 verify list:
> - Every timeline date = DATA.md Pillar 4 table: 2026-06-30 Toccata (v2.0.0 release + Kaspalytics), 2026-07-15 repo "Initial commit" (commits log), 2026-08-20 Drafts merged (PRs #2, #3, #5 + Sutton's thread post), 2026-09-21 KCC-0 Final (PR #25, chart only), 2026-09-22 PR #31 opened, 2026-10-01 KCC-1 + KCC-2 Last Call (PRs #32, #33), 2026-10-07 PR #31 merged. NEVER the deck's Jul 15 / Aug 22 / Sep 22-still-open.
> - "typically around 14 days" = KCC-0 section 4.2 "typically 14 days later"; no `Last-Call-Deadline` field in any of the three headers (2026-10-18) [VERIFY]; never air an end date.
> - "KCC-1, the covenant layout, and KCC-2, the authority schemes" = KCC-20 header Requires "KCC-1, KCC-2, KIP-20"; KIP-20 is Active so the KCC chain is what gates it (DATA.md T8, dependency chain).
> - "published test vectors and a public implementation that passes them" = KCC-0 finalization criteria (1) and (2) (DATA.md Pillar 4).
> - "zero" = only KCC-0 (a Meta KCC) is Final (DATA.md T8) [VERIFY] statuses on render day; receipt C7.
> - "By late July, implementers ..." = "Ross" on the thread 2026-07-19 + issue #11 opened 2026-07-26 by KaspaCom (DATA.md section 4 row 2).

---

## CH5 - THE BIGGER PICTURE
**Register:** gear 3, conviction. Declarative, no price, no target, no multiplier. Facts stay conditional; Beat 4 is Mike's own first-person conviction (his words, 2026-10-20), stated as his belief, never as a fact or a number. Cover through "well worth the wait", then FACE to the end (Mike, 2026-10-21: he looked into the camera from the second conviction line through the CTA).
**Title card:** ON, "THE BIGGER PICTURE". **Music:** Bed D starts, LOCKED (Mike, 2026-10-20): underworlds (rising epic, RIGHT-ALIGNED so its epic_hit ending lands on the last spoken word).
**Theme (Mike, 2026-10-20): a TOTAL visual change from CH4's playful board game.** EPIC, and EVERYTHING in Kaspa greenish cyan: the ChatGPT images, the code-built charts and diagrams, the containers, the motion type. Big, cinematic, wide, glowing. Receipts keep their real pixels (never restyled) and sit in a greenish-cyan frame / glow treatment.
**Budget:** ~75 s, ~215 spoken words (the CTA is ~30 of them; Beat 4 added ~30 words, Mike 2026-10-20).

**Beat 1 - the builders are back on the main code**

🗣️ `[COVER]` Zoom out. After the September 22nd release the main node code went quiet for three weeks, then six commits landed in one week, October 13th to the 16th. Maintenance and plumbing, not a new feature.
🎬 `[SHOW]` C13 receipt: the rusty-kaspa master commits page, the six Oct 13 to 16 commits with the gap back to Sep 22 visible. Then a small system-design container off a "rusty-kaspa master" hub with the four groups as nodes: consensus internals · wallet mass and fee math · lowio database preset · paginated UTXO lookup by address (labels on screen, not spoken).
🗣️ `[COVER]` And DAGKnight, the next consensus upgrade, still has no date.
🎬 `[SHOW]` A 2 s flash of C14, the branches page with the `dagknight` row "Sep 8, 2026".
🔍 `[VERIFY]` Re-read https://github.com/kaspanet/rusty-kaspa/commits/master and /branches/all on render day: the commit count and dates in the VO, and the `dagknight` last-update row (2026-09-08 on 2026-10-18).

**Beat 2 - a tiny base**

🗣️ `[COVER]` Usage is a tiny base, around 82,000 standard transactions a day the week of October 12th, up around 22 percent on the week before.
🎬 `[SHOW]` C15, the daily standard-transactions chart from the Kaspalytics series (Standard series only, dated), the September average marked on it. CODE-BUILT from the pulled series (not a screencap) so it renders in the CH5 greenish-cyan epic treatment.
🔍 `[VERIFY]` Re-pull the Kaspalytics accepted-count series on render day (81,767 Mon to Thu avg, +21.5 percent, Sep avg 108,952 on 2026-10-18). Update the spoken rough numbers only if they move by more than the rounding.
💬 `[NOTE]` Mike decides at GATE 1 whether this line stays, or shrinks to "Usage is a tiny base." with C15 as the only figure (DATA.md Open question 6). The TVL figure (around 1.0M across Igra + Kasplex, DefiLlama) is NOT scripted; if Mike wants it, add "Around a million dollars of value locked across the smart-contract layers built on Kaspa." with C16 (Open question 7 on naming Igra). Trim-first if CH5 runs long.

**Beat 3 - the conditional case**

🗣️ `[COVER]` So here is the conditional case. If KCC-1, KCC-2 and then KCC-20 go Final, every wallet, indexer and app on Kaspa builds to one rulebook. Tokens exist today. The shared standard does not, yet.
🎬 `[SHOW]` C3 callback re-rendered in the CH5 greenish-cyan treatment (both lanes in cyan tones, the KCC-20 lane glowing brightest), the KCC-20 lane pulsing on "one rulebook". Then the C6 ladder end state with "Final" lit, also in greenish cyan.
🎬 `[SHOW]` SFX, MIKE'S PICK (2026-10-21): a BRAAM right after "The shared standard does not, yet." (`braam-horn-stinger-02`, take a, the fastest hit), placed per the braams library PLACEMENT RULE (Mike, 2026-10-17): BETWEEN sentences, never over a word, after the intense line with the figures on screen, in a SPINE PAUSE of the braam's audible length (~4 s, inserted after "yet." like a card pause: EDIT-PLAN `[BRAAM] ... spine pause <dur> s at <s>`); the C3 / C6 cyan figures hold on screen through the pause and Bed D ducks under it. This is one of the video's at most two braams.
🗣️ `[COVER]` And supply is fixed. Proof of work, no premine, around 96.7 percent of all KAS already mined. New demand meets very little new supply. Conditional, and that is the asymmetry I am watching.
🎬 `[SHOW]` C17, the supply ring animating to 96.72 percent of 28.7B KAS, dated, a glowing greenish-cyan ring. No price chart, ever.
🔍 `[VERIFY]` Re-pull https://api.kaspa.org/info/coinsupply on render day (96.72 percent on 2026-10-18); the ring carries the exact dated figure, the VO stays "around 96.7 percent".

**Beat 4 - worth the wait (Mike's conviction, added 2026-10-20)**

🗣️ `[COVER]` And I am telling you, this is going to be well worth the wait.
🎬 `[SHOW]` I1, the marquee ChatGPT image of the video (held on this one line, slow push-in; the next two lines are FACE because Mike looked into the camera on the take, 2026-10-21): a lone figure standing on a mountain summit at night, looking down at a vast glowing city below, a HUGE greenish-cyan moon filling the sky behind them with the Kaspa "K" mark on its face. Epic, cinematic, everything lit in Kaspa greenish cyan.
👤 `[FACE]` The high-conviction holders, the ones who stay in it for the long haul, are going to make it big time.
👤 `[FACE]` Because the ones with vision are the ones who end up dominating the world.
💬 `[NOTE]` Mike's own conviction, said as his belief in gear 3 (persona: first-person conviction is the default). No number, no price, no date is attached to it. If any line feels long on the read, say it in Mike's own words; the meaning is what is locked.

**Beat 5 - close**

👤 `[FACE]` What to watch next: KCC-1 and KCC-2 going Final, then KCC-20, then the first implementations that pass its vectors.
👤 `[FACE]` Click the like button, comment which one you are watching, KCC-20 or KRC-20, and click the link in the description to get involved in the best community ever. I'm gonna catch you guys, later.
🎬 `[SHOW]` FACE from "The high-conviction holders" to the end, one continuous face run (Mike, 2026-10-21); the visuals ride on top of the face. On the what-to-watch line, KINETIC `kt-side-panel` beside Mike's FACE, the 2023 face version (Mike, 2026-10-21: "let's do it"): on "KCC-1" the face footage shifts left and scales to 120 percent, a dark panel in the CH5 greenish-cyan glow treatment slides in from the RIGHT with "KCC-1" rising in and hovering (sound `swoosh-1`, 0.17 s early); on "KCC-2" the face shifts right, the LEFT panel slides in with "KCC-2" (sound `swoosh-2`); both hold through "then KCC-20, then the first implementations that pass its vectors." and leave on the cut into the CTA (no lower-third ladder, the panels are the ladder). End card: logo bug + community link lower-third. Bed D epic_hit lands on "later."
💬 `[NOTE]` If Mike calls a HARD-OUT instead of the CTA: the take ends on "then the first implementations that pass its vectors." and the edit cuts to black on the hit, no end card.

> [!IMPORTANT]
> CH5 verify list:
> - "quiet for three weeks after the September 22nd release / six commits October 13th to the 16th" = rusty-kaspa master: "Bump version to v2.1.0 (#1139)" 2026-09-22, nothing until 2026-10-13, then `a92c4f9`, `12db0f3`, `2ea8e9d`, `6768648`, `7cc22fe`, `f7d7877` through 2026-10-16 (DATA.md Pillar 5) [VERIFY]; receipt C13.
> - The four commit groups on the container = PR #1099/#1142 (consensus internals), PR #1074 (wallet mass / fee math), PR #1148 (`lowio` RocksDB preset), PR #991 (paginated UTXO-by-address RPC). On screen and if ever spoken: "paginated UTXO lookup by address", never "balances API" (DATA.md Pillar 5).
> - "DAGKnight ... still has no date" = KIP-2 Status "Proposed"; `dagknight` branch last updated 2026-09-08 (DATA.md Pillar 5) [VERIFY]; receipt C14. Never "abandoned", never a date.
> - "around 82,000 / around 22 percent / around 109,000" = Kaspalytics Standard series: Mon to Thu 2026-10-12 to 10-15 avg 81,767; prior week avg 67,323 (+21.5 percent); September avg 108,952 (DATA.md section 5) [VERIFY]. Never the Coinbase series, never the "down 99 percent" headline.
> - TVL (only if Mike restores the line) = DefiLlama Igra 712,338 + Kasplex 292,584, around 1.0M combined (2026-10-18) [VERIFY]. Never "Kasplex near zero", never "Igra L2".
> - "Proof of work, no premine, around 96.7 percent mined" = kaspa.org "No premine. No hidden allocation. Fair launch.", api.kaspa.org coinsupply 96.72 percent (DATA.md Pillar 5) [VERIFY]. Never "no pre-sale", never "miners staying on despite lower revenue".
> - "Tokens exist today. The shared standard does not, yet." = Kaspalytics 2026-08-14 "tokens have been deployed against it anyway" + KasStacker count (DATA.md section 4 row 16).

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover. Mike rules each row at GATE 1. DATA.md section 6 found three candidates, all from principals (two Sivan Helfer, one Yonatan Sompolinsky); one earns its seconds._

| id | Who / what plays (verbatim words) | Source + timecodes | Length | Lands (chapter / beat, after which set-up line) | Burned caption | Status |
|---|---|---|---|---|---|---|
| CLIP-1 | Sivan Helfer, KCC-20 first-listed author, XXIM "Kaspa Programmability MasterClass: Covenants + SilverScript with @manyfest": "We had we have KRC assets on Kaspa, but it's it's a bit tricky technically, but those assets are not really on Kaspa. It's They are They are just indexed somewhere else and they uh Yeah, so we have now the opportunity to be able to create real assets on Kaspa." (auto-caption text; confirm by ear) | https://www.youtube.com/watch?v=0kN7xYim3Mk 30:05.0-30:25.5 (the DATA.md tight cut; the capturer may start a beat later to drop the "We had we have" stutter if the trough allows) | ~20.5 s (over the typical 4 to 15 s; Mike rules) | CH3 Beat 3, after "...put it plainly back in June, a week before Toccata went live." | Sivan Helfer, KCC-20 author, June 2026, a week before Toccata | APPROVED (Mike, 2026-10-21: keep as proposed) |
| CLIP-2 | Sivan Helfer, same video: "The the KCC 20 protocol, this is uh something that Ori brought up, a proposal, which allows you to create those kind of tokens. Yeah, KRC 20 tokens are uh tokens, which are uh like alongside Kaspa, but not on top of Kaspa. The difference is that Kaspa do not know about them, but now using covenants and the few of the things that Toccata brings into Kaspa we can create assets that really sits on top of on top of Kaspa." | https://www.youtube.com/watch?v=0kN7xYim3Mk 38:00.0-38:29.0 | 29 s | would replace CLIP-1 at the same CH3 Beat 3 splice point (same set-up line) | Sivan Helfer, KCC-20 co-author, June 2026, testnet demo, before Toccata | HELD (same point as CLIP-1 but 29 s, credits "Ori", and the next lines demo testnet-10; alternate only if Mike prefers the "alongside, not on top" wording; must keep the "but now using covenants..." half) |
| CLIP-3 | Yonatan Sompolinsky (KIP-2 co-author), Bitcoin Takeover S17 E36: "so we we spoke about Dag Knight. So Dagnite is a is a work with Michael and when Michael came up with Dagnite a few years ago, five or six years ago with um with the kernel this this was you know big excitement for us but it took years to really build it into a into a secure protocol." | https://www.youtube.com/watch?v=l_v3Mr5vigQ 2:17:43.0-2:18:06.0 | 23 s | none | none | REJECTED (23 s on DAGKnight's origin inside a 60 s CH5 whose DAGKnight content is one clause, "no date"; it gives no status and would read as a timeline hint) |

## MUSIC-MOOD-PLAN

Ledger run 2026-10-18: `usage_ledger.py report --what music --exclude-project "kcc20"`. BLOCKED (previous video, tao-detailed): future-trip, lights-out, searching-for-signs-of-life, wonderworld. Avoided (last three videos): a-pirates-life, continuum, harvester, lightheart, mighty-hand, mission-accomplished, sleeper-cell, story-of-my-life, tesseract, tome-of-fate. No track below is on either list; every primary pick is `fresh` (never used); every pick carries a yt_license_code (Soundstripe) and none has a `mike_note` ruling it out. Mood: dark electronic / cinematic tech, suspenseful-inspiring, never Fun/Happy (this is an engineering story told epically).

| CH | Mood + gear | Subtle / aggressive | New bed? | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 | dark electronic epic, gear 3, Tron/Matrix drive | aggressive, hits cold on word one, drops under the thesis line | **Bed A starts** (card OFF, Mike is frame one) | **born-every-minute** (fresh, aggr 92, cold_hot → epic_hit, 174 bpm D&B, "driving and sinister with a Tron/Matrix energy") · focuser (fresh, aggr 92, cold_hot → fade, 110 bpm electronic, reflective/suspenseful/hopeful) · down-to-the-wire (used 2026-09-28 kaspa-vprogs, aggr 93, cold_hot → epic_hit, "epic, building, intense, dark"; allowed, not fresh) |
| CH2 | steady explainer, gear 2, mid energy, cinematic tension with lift | subtle, loop-safe, ~16 to 18 dB under VO | **Bed B starts** (card ON "HOW KCC-20 WORKS") | **it-comes-to-this** (fresh, aggr 63, build → fade, 150 s, env 5 to 6 steady, suspenseful/inspiring; loop once to cover CH2 + CH3, around 150 s) · deceptive-cadence (fresh, aggr 43, build → epic_hit, 108 s, loop) · slow-rise (used 2026-10-02 golden-kitty, aggr 33, the lowest-energy fallback if Mike wants it softer) |
| CH3 | same bed, the marquee contrast; Bed B ducks -14 dB under CLIP-1 automatically | subtle, continuous | continues Bed B (card OFF) | same as CH2 (no change; the diagram reveal is the break) |
| CH4 | PLAYFUL, gear 2: "we're getting there slowly but surely, and it can be fun along the way" (Mike, 2026-10-20) | subtle, steady, the verse's closing hit lands on the Oct 7 rung or the "zero" line | **Bed C starts** (card ON "WHERE IT STANDS") | **LOCKED, Mike's pick: going-shopping-again** (Dresden, The Flamingo; fresh, never used; Corporate; quirky/fun/happy, childlike, upbeat), the section `assets/music/Going Shopping (Again)/Dresden_The_Flamingo_Going_Shopping_Again_instrumental_verse_0_43-3.wav` (44 s, aggr 48, mid "bed", steady → epic_hit). CH4 runs ~60 s, so the verse is ~16 s short: extend it with a REMIX LOOP (Mike, 2026-10-20): a bar-aligned region inside the verse's steady plateau repeats to fill the span (skills/music/music.md "LOOP", `loop_in_sec` / `loop_out_sec`), then plays on into the verse's real ending hit. NEVER a whole-file restart, and the full track is not used for CH4. The region is the music-placement-strategist's call on the final spine. |
| CH5 | rising EPIC, gear 3, into the close (a total change from CH4's playful bed) | aggressive into the close, peaking under the Beat 4 conviction lines, RIGHT-ALIGNED so the epic_hit lands on "later." (or on the hard-out word) | **Bed D starts** (card ON "THE BIGGER PICTURE") | **LOCKED, Mike 2026-10-20: underworlds** (fresh, aggr 93, build → epic_hit, 129 s, modern orchestral, env 9s through the back half) |

Exact carving (in-points, loop points, dB under VO, the inter-bed breaths at each card, the duck under CLIP-1) is the `music-placement-strategist`'s job after the spine exists. Music covers EVERY chapter (longform-edited.md #10): Bed B is looped to span CH2 + CH3, no silent stretch.

**SFX INTENT (Mike, 2026-10-21, at the spine gate; the edit-plan author places each one by MEASURED attack and tail from `assets/sfx/library.json`, Mike gates at the blueprint):** LOCKED: a braam right after CH5 "The shared standard does not, yet." (Mike's pick). Suggested, one sound per event, never stacked on a kinetic-text device: CH1 an Impacts hit on the H0 "KCC-20 · LAST CALL" card and a short riser (`tension-logo-reveal-3`) under "October 7th, 2026." into the PR #31 receipt, three `accent-timpani-clicker-01` taps on "Real. Close. And not finished." (one per word); CH2 the kinetic-text set only; CH3 `accent-scifi-mystery-02` on the C3 marquee reveal (one take per lane state); CH4 timpani clickers as the C5 rungs land, `sudden-shock-tight` on "zero", the kinetic oof on "No official end date" (already placed); CH5 a `drone-force-field-hum-low-01` under Beats 1 and 2 beneath Bed D, a riser (`tension-logo-reveal-1`) under "And I am telling you, this is going to be well worth the wait." into the I1 moon reveal, optionally the video's second braam on that reveal, `swoosh-1` / `swoosh-2` on the KCC-1 / KCC-2 face panels, and NO extra hit on "later." (Bed D's epic_hit is the ending). Mood gate: nothing `dark` in CH4 (playful); CH5 is `epic` / `tense`.

## VISUAL-PLAN

### Chapter themes (Convention 4b: one accent + one image style per chapter, mirroring the beds)
| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 | Kaspa greenish cyan (persona brand colour, the token's own) | photoreal cinematic, dark server-room / circuit atmosphere, teal rim light, deep charcoal | the hook: the base layer itself, no people, no coins |
| CH2 | cyan (house palette) | house (persona Pixar look) for the few atmosphere frames; everything else is code-rendered C1 / C2 | the teaching chapter is almost all containers |
| CH3 | split: Kaspa teal for the KCC-20 lane, amber for the KRC-20 / Kasplex lane | house | the contrast is the colour: two lanes, two accents, no prose table |
| CH4 | gold | PLAYFUL (Mike, 2026-10-20): bright, toy-like 3D, a board-game path where each timeline date is a square the token hops forward onto | "slowly but surely, fun along the way": the timeline as a game in progress, the gold square on October 7, the Final square still ahead |
| CH5 | Kaspa greenish cyan, EVERYWHERE (Mike, 2026-10-20) | EPIC photoreal cinematic, wide, glowing: summits, skylines, night skies, the greenish-cyan Kaspa moon | a TOTAL change from CH4. Every ChatGPT image, code-built chart, diagram, container and motion card in CH5 renders in greenish-cyan tones and reads as epic; receipts keep their real pixels inside a greenish-cyan frame / glow |

- **C1** the four-idea system-design set (CH2), four containers spotlight-swapped: (01) common interface, the state block with Wallet / Indexer / App arrows into `transfer` / `transfer_delegator`; (02) extended state, the opaque `extension_commitment` carried through; (03) authority via KCC-2, the owner field fanning to 0x00 / 0x01-0x02 / 0x03 / 0x04; (04) hands off to C2. Every label copied from kcc-0020.md and kcc-0002.md. Code-built (Type 2, static states).
- **C2** the Borrowed Receive UTXO diagram (CH2 Beat 5), two states: LEFT the "new UTXO" path paying storage mass; RIGHT the "borrowed receive" path, owner unchanged, KAS floor, token amount up. Code-built (Type 2).
- **C3** THE MARQUEE contrast (CH3 Beat 2, callback CH5 Beat 3): ONE system-design diagram, two lanes (KRC-20: Kasplex → data on L1 → indexer interprets → "balance = the indexer's answer"; KCC-20: `kaspanet/kccs` → covenant UTXOs on L1 → L1 script enforces → "balance = what the chain enforces"). Code-built, highlight states per lane. Replaces the deck's comparison table.
- **C4** the token-count bars (CH3 Beats 1 and 4): KRC-20 2,164 (Kasplex API) vs KCC-20 146 (KasStacker), launch years 2024 vs 2026, source line, counts re-pulled at render. Code-built (Type 1 animated count-up) [VERIFY].
- **C5** THE timeline (CH4 Beats 1 and 3): Jun 30 · Jul 15 · Aug 20 · Sep 21 · Sep 22 · Oct 1 · Oct 7, rungs landing as spoken, then the dependency arrows KCC-1 → KCC-2 → KCC-20 and "Final technical KCCs: 0". Code-built (Type 1 animated).
- **C6** the Last Call ladder (CH4 Beat 2, callback CH5): Draft → Review → Last Call ("typically 14 days", "deadline: not set") → Final with the three criteria. Code-built (Type 1 animated).
- **C15** daily standard transactions from the Kaspalytics series, Sep 1 to latest (CH5 Beat 2). Code-built from the pulled series (Standard only) or a screencap of the real Kaspalytics chart, never restyled [VERIFY].
- **C16** OPTIONAL (only if Mike restores the TVL line in CH5 Beat 2): Igra + Kasplex TVL bars, dated, DefiLlama figures. Code-built from the API [VERIFY].
- **C17** the supply ring, 96.72 percent of 28.7B KAS mined, dated (CH5 Beat 3). Code-built (Type 1 animated fill) [VERIFY].
- **Receipts (real-site captures, never restyled):** C7 kccs README index · C8 kcc-0020.md header · C9 PR #31 merged · C10 commits log Oct 1 / Oct 7 · C11 KCC-0 section 4.2 · C12 rusty-kaspa v2.0.0 activation line · C13 master commits Oct 13 to 16 · C14 branches page `dagknight` row · C18 KasStacker block · C19 Kasplex API JSON · C20 kccs issue #11 by KaspaCom, on CH4 Beat 3's "implementers were already reporting" line (Mike, 2026-10-21: show it; the VO stays as recorded). Optional on Mike's ruling: C21 Sutton's "merged as DRAFT" post, C22 the KCC-2 scheme table.
- **I1** THE marquee ChatGPT image (CH5 Beat 4, Mike 2026-10-20): a lone figure on a mountain summit at night looking down at a vast glowing city, a huge greenish-cyan moon behind them with the Kaspa "K" mark on its face. Epic, photoreal cinematic, greenish cyan. The "K" is the logo mark, the only glyph in the image.
- **ChatGPT image budget (Mike, 2026-10-20): 3 a minute for this video** (~15 for the ~5 min runtime; the graph default is 1 a minute, so pass `--chatgpt-max 15` on the screenplay approval). Every CH5 image is greenish cyan and epic.
- **Kinetic-text devices (EXPERIMENT, Mike 2026-10-21):** the 2023 motion + sound pairs from `assets/sfx/kinetic-text/library.json` -> `devices` (recipe: `skills/overlays/overlays.md` section 2), in CH2 only plus one pop in CH4: four `kt-side-panel` panels (RIGHT, LEFT, RIGHT, LEFT: the four idea labels, `swoosh-1` / `swoosh-2`), three `kt-keyword-pop` pops in CH2 ("COVENANTS CAN OWN TOKENS" `twinkle` · "STORAGE MASS" `knock-pop` · "ONLY THE TOKEN AMOUNT GROWS" `cash-register`) and one in CH4 ("NO OFFICIAL END DATE" `minecraft-damage`), plus the two FACE panels on CH5's what-to-watch line ("KCC-1" right, "KCC-2" left, beside Mike, Mike 2026-10-21). Panels on the house dark surface with the key words in Kaspa greenish cyan over white (Mike, 2026-10-21: the text must contrast with the background; yellow only on a bright background), house display font; four panels and the beside-the-diagram placement confirmed; the motion numbers and the sound offsets exactly as catalogued. The edit-plan author places each one on the word in the AS-RECORDED transcript; a line Mike did not say loses its device.
- **H0 / H1** the hook motion cards (CH1), text only: "KCC-20 · LAST CALL" and "REAL · CLOSE · NOT FINISHED".
- **Charts guardrail:** every number on screen is code-rendered from DATA.md or a real-site receipt; never an AI image as the source of a number; no price chart anywhere.

## OPEN QUESTIONS / NEXT SESSION

1. **Title (GATE 1):** "KCC-20: Real Tokens on Kaspa L1" (scripted) vs "KCC-20 vs KRC-20, Explained" vs "Kaspa's First Native Token Standard Hits Last Call". Note: on screen and in the description "first native token standard" should read "first token standard in Kaspa's own conventions repo" if challenged (DATA.md Open question 1).
2. **CTA close vs hard-out (CH5 Beat 5):** scripted as the standard CTA; the hard-out ends on "then the first implementations that pass its vectors." with the Bed D hit on that word.
3. **Handoff line (CH1 close):** scripted "So, let's dive into all this." (approved, not the most recent in `recent_use`). Alternates for Mike: "So, let's go through it, piece by piece." (approved) · "So, let's take this from the top." (proposed) · "So, here's how it all fits together." (proposed). Record the pick into persona.json `dive_in_variants` the same turn.
4. **CLIP-1 in or out, and its length:** ~20.5 s is over the typical 4 to 15 s. Options: (a) take it as proposed; (b) have the capturer start at the first clean "those assets are not really on Kaspa" if the trough allows (~14 s); (c) swap to CLIP-2 (HELD, 29 s); (d) none, the resume line stands alone. Confirm speaker and words by ear before any cut (DATA.md Open question 9).
5. **Name KaspaCom as the first implementer that flagged gaps (CH4 Beat 3)?** Scripted unnamed ("the first implementers"). If yes, the line becomes "By late July, KaspaCom was already reporting..." and receipt C20 (issue #11) is staged.
6. **CH5 usage line:** scripted as ONE line (daily standard transactions, C15). Options: keep as is; add the TVL sentence ("Around a million dollars of value locked across the smart-contract layers built on Kaspa.", C16); or shrink to "Usage is a tiny base." with C15 as the only figure (DATA.md Open question 6). Every figure drifts daily and is re-pulled at render either way.
7. **Igra wording (only if the TVL line comes back):** the VO says "the smart-contract layers built on Kaspa"; the C16 chart prints DefiLlama's chain names (Igra, Kasplex). Mike decides whether the VO names Igra at all (DATA.md Open question 7; persona cautions against bullish naming).
8. **Bed map:** four beds (A CH1 · B CH2 + CH3 · C CH4 · D CH5), so cards at CH2, CH4, CH5 only. Alternative if Mike wants CH3 carded: give CH3 its own bed (five beds in five minutes, a change every minute; not recommended).
9. **Live 🔍 `[VERIFY]` checklist (re-pull on recording day AND render day, DATA.md section 5):** KCC-0 / KCC-1 / KCC-2 / KCC-20 / KCC-23 statuses + any `Last-Call-Deadline` field (kaspanet/kccs README + raw headers) · Kasplex `tokenTotal` (api.kasplex.org/v1/info; 2,164) · KasStacker KCC-20 token count (146; third-party) · rusty-kaspa master commit list (six commits Oct 13 to 16, none Sep 23 to Oct 12) · `dagknight` branch last update (2026-09-08) · Kaspalytics Standard series (81,767 Mon to Thu avg; +21.5 percent; Sep avg 108,952) · DefiLlama chain TVL Igra + Kasplex (around 1.0M) · api.kaspa.org coinsupply (96.72 percent mined) · hashrate only if ever mentioned (not scripted; around 381.5 PH/s, no revenue claim).
10. **For the transcriber / captions-builder:** Whisper confusions to fix on sight: "KCC90", "KCS 20", "KCC 20" → KCC-20; "KRC 20" → KRC-20 (and NEVER swap KCC-20 / KRC-20 against the screenplay beat); "Casper" → Kaspa; "Caspa Flex" → Kasplex; "Tokamak" → Toccata; "Dag Knight" / "Dagnite" → DAGKnight; "Igra" stays; "UTXO" spelled as letters.
