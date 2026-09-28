# kaspa-vprogs - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble (24 spans out of the LOW BPS) -> cover-blackout (2 face windows kept) -> coarse desilence 700 ms one zone -> burst removal x1 (0.256 s voiced hum after "softened on it.") -> two-zone desilence 250 ms intro / 500 ms body (split at the CH1 hook end; the exact split second is not recorded in `spine/`) -> content cut x1 (the "very bullish on rollups" podcast sentence, Mike's GATE 2b call). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.f.cut.mp4` - 202.822 s (3:22.8; video 202.800 s, audio 202.822 s), 1920x1080, 30/1 fps. LOCKED (GATE spine approved 2026-09-27 21:16).
- **Transcript (cue source):** `spine/ALL.f.cut.medium-words.json` (Whisper medium, word-level, 69 segments, 593 words, NOT hand-edited). Human-review breakdown: `spine/ALL.f.cut.segments.txt` (supersedes `ALL.e.desilenced.segments.txt`).
- **Timecode chain:** every remap file in `spine/`, in order, with the shift each stage applied:
  1. `ALL.a.defumbled.mp4.spans.json` (LOW BPS -> a): 24 retake/fumble spans removed out of 766.0 s, a = 532.767 s.
  2. `ALL.b.blackout.mp4.cover.json` (a -> b): no time shift; picture blacked on a 18.548-59.659 and a 71.449-532.767 (the two face windows a 0.000-18.548 and a 59.659-71.449 stay live).
  3. `ALL.c.desilenced.map.json` (b -> c): coarse 700 ms one-zone pass, 65 cuts, 313.44 s removed, c = 219.33 s.
  4. `ALL.d.cleaned.mp4.cuts.json` (c -> d): burst removal x1, c 87.113-87.378 cut; c times >= 87.378 shift -0.256 s (measured), c times < 87.113 unchanged. d = 219.40 s.
  5. `ALL.e.desilenced.map.json` (d -> e): two-zone tight pass, 16 cuts, 8.34 s removed, e = 211.13 s.
  6. `ALL.f.cut.mp4.spans.json` (e -> f): content cut x1, e 81.655-89.975 removed; e times >= 89.975 shift -8.320 s, e times < 81.655 unchanged. f = 202.822 s.
  **Every timecode below is already a FINAL-spine (`ALL.f.cut.mp4`) coordinate; the comp cues directly off them. Never re-apply a shift from the chain.**
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` (backup `c.desilenced.bak-burst`) -> `d.cleaned` -> `e.desilenced` -> `f.cut`.

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on `ALL.f.cut.mp4` (non-black = FACE), probed 2026-09-27. Black runs: 7.333-28.167 and 31.933-202.767 (the detector closes the last run on the final frame; 202.767-202.800 is the end-of-stream boundary, not a face window). Everything else is BLACK VIDEO and must be covered in the comp. Face 11.100 s = 5.5% / cover 191.7 s = 94.5%. Zero orphans: both windows land on a scripted `[FACE]` beat, and the video's FACE budget of exactly two is met.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-7.333 | "Kaspa is building vProgs, verifiable programs, real apps on a base layer, on a proof of work, not an L2." (speech 0.00-7.30) | CH1 Beat 1 `[FACE]` `[SAY-EXACT]` |
| 2 | 28.167-31.933 | "Kaspa is never going to run your app, Kaspa is going to verify it." (Whisper puts the first word at 28.10, 2 frames before the picture opens; the face cut stays on the picture edge 28.167) | CH1 Beat 3 `[FACE]` `[SAY-EXACT]` |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- 0.00, 14.02, 14.92, 28.10, 30.62, 89.38, 92.64, 111.66, 115.38 "Casper" -> "Kaspa" (x9; persona: Casper is a different chain, $CSPR).
- 67.98, 133.98, 154.74 "Casper's" -> "Kaspa's" (x3).
- 170.14 "casper .org" -> "kaspa.org" (one token, no space; it is the site the C7 receipt shows).
- 0.98, 21.22, 74.72, 167.52 "Vprogs" -> "vProgs" (x4; persona spelling, capital P).
- 7.62, 82.64, 102.62 "Vprog" -> "vProg" (x3).
- 69.56 "Janitem Sampalinski" -> "Yonatan Sompolinsky" (a named person on a caption; must be exact).
- 174.24 "Sam Polinsky" -> "Sompolinsky" (one word).
- 149.52 "Tukada" -> "Toccata" (the hard fork name; also matches the C3 rung label).
- 175.34 "Covenant fork" -> "covenant fork" (casing only).
- 108.30 "for -profit" -> "for-profit" (token join; no space before the hyphen).
- 110.32, 150.78, 165.64 "zero -knowledge" -> "zero-knowledge" (token join). The CH1 instance at 11.68 is two plain tokens "zero knowledge"; caption it "zero-knowledge" for consistency.
- 159.04 "1 .0" -> "1.0" (token join; "Silverscript 1.0" must match the C3 label).
- 51.56 "2." (p=0.14) -> "2" in "a layer 2" (correct word, low confidence only; caption "layer 2", never "L2" since he said "layer 2").
- Not present in this audio (checked): tau, 50WMA / 200WMA, Caspie / Cassie / Cappy, Kasper-the-Ghost context, ghost / GhostDAG, scion, DAGKnight.

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - STRAIGHT INTO IT (0.00-40.22) · card OFF · Bed A

40.2 s, 126 words (budget ~35 s / ~110 words).

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "Kaspa is building vProgs, verifiable programs, real apps on a base layer, on a proof of work, not an L2." | CHANGED (locked `[SAY-EXACT]` `[FACE]` #1; wording drift: "on a base layer" for "on the base layer", "on a proof of work" for "on proof of work", "not an L2" for "and not on an L2". The H0 cut cues on "not an L2" at 6.48-7.30, face out at 7.333) |
| 7.40 | "A vProg is an app that runs on its own node, keeps its own state and posts zero knowledge proof of that state back to Kaspa." | CHANGED ("own node" for "own nodes", "posts zero knowledge proof" for "posts a zero-knowledge proof") |
| 14.54 | "Now Kaspa already has smart contracts, covenants, live on mainnet since June, straight from the core devs." | KEPT |
| 21.22 | "vProgs are the next layer up, whole applications on a chain that already runs 10 blocks every single second." | KEPT · guard [!WARNING 3] HELD (blocks per second only, no TPS) |
| 28.10 | "Kaspa is never going to run your app, Kaspa is going to verify it." | KEPT (locked `[SAY-EXACT]` `[FACE]` #2, verbatim; face window 28.167-31.933) |
| 31.90 | "And that one flip is how you get apps on the base layer with proof of work security and no L2 in the middle." | KEPT (locked `[SAY-EXACT]` `[COVER]`, verbatim) |
| 38.82 | "So let's break this all down." | CHANGED ("break this all down" for "dive into all this") |

### CH2 - NOT AN L2 (40.22-137.58) · card ON "NOT AN L2" · Bed B

97.4 s, 291 words (budget ~95 s / ~255 words).

**Beat 1 - the road Ethereum took**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 40.22 | "So back in 2020 Vitalik laid out Ethereum's plan and it said in plain English, all in on rollups, your accounts, your businesses, your assets living inside a layer 2." | CHANGED ("it said in plain English" for "it said it in plain English"; "your businesses" for "your balances" (Whisper p=1.00); the closing "right?" not said) |
| 52.18 | "And every rollup is its own chain, its own sequencer, the machine that orders your transaction payments, its own bridge, its own slice of liquidity." | CHANGED ("transaction payments" as Whisper heard it, p=0.29 / 0.00, scripted "transactions", ear check open; "slice of liquidity" for "slice of the liquidity") · guard [!WARNING 5] HELD (bridge named as an L2 cost, no "no bridge" flat, no hack figure) |
| 61.22 | "And every one of those pieces is a place for something to break and a place for your liquidity to get split up." | KEPT |
| 67.80 | "Now Kaspa's founder, Yonatan Sompolinsky looked at all of that and back in December he said the whole point of vProgs was to avoid the obsolete path of L2s." | KEPT |
| 78.72 | "His words, not mine." | KEPT |
| 80.06 | "And he hasn't softened on it." | KEPT (the beat now ends here) |
| 81.70 | (not said on the final spine; cut at the junction 81.655) | DROPPED: the podcast sentence ("This August, on the Bitcoin Takeover podcast ... on rollups."), recorded as "very bullish", CUT at Mike's GATE 2b call 2026-09-27; the quote card goes with it |

**Beat 2 - the machine (C1)**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 81.70 | "So here's how a vProg actually works." | KEPT (tight ~0.08 s breath after the cut junction) |
| 83.96 | "You send a transaction and you declare upfront which account it reads and which one it writes." | CHANGED ("which account it reads and which one it writes" for "which accounts it reads, and which ones it writes"; the trim-first line was recorded and stays) |
| 89.38 | "Kaspa does four jobs." | KEPT |
| 90.84 | "It orders every transaction so Kaspa itself is the sequencer." | KEPT ("the" p=0.38; the pass on e heard "a") |
| 94.50 | "It stores the data, it checks the proofs, it meters the work." | KEPT |
| 98.18 | "What it never does is run the app." | KEPT |
| 100.42 | "The app runs on its own nodes." | KEPT |
| 102.34 | "Every vProg owns its own accounts and it's the only thing allowed to write to them." | KEPT |
| 107.10 | "And provers, for-profit operators, post a zero-knowledge proof back to Kaspa." | KEPT |
| 112.06 | "That's a math receipt that says the state is correct and Kaspa checks the receipt instead of redoing the math." | CHANGED ("the state" for "this state") |

**Beat 3 - what the design buys you**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 118.44 | "And this buys you two things." | KEPT |
| 120.24 | "Sovereignty. If another app breaks, yours keeps running." | KEPT |
| 123.34 | "And composability. Apps can read each other's state." | KEPT · composability honesty guard (CH2 verify list) HELD: "apps can read each other's state", not "any app can read anything" |
| 125.76 | "And a transaction that touches two apps goes through as one unit or not at all." | KEPT |
| 130.44 | "And this just means the rules for checking all of this live inside of Kaspa's consensus itself, not on some other chain." | CHANGED ("And this just means" for "And enshrined just means"; the word "enshrined" is never spoken anywhere in the spine; "inside of" for "inside") |

### CH3 - WHERE IT STANDS (137.58-202.82) · card ON "WHERE IT STANDS" · Bed C

65.2 s, 176 words (budget ~45 s / ~125 words).

**Beat 1 - the ladder (C3)**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 137.58 | "Now where does this all actually stand?" | CHANGED ("this all" for "this") |
| 139.84 | "Look at this ladder." | KEPT |
| 140.70 | "May 2025, Crescendo. 10 blocks a second." | KEPT · guard [!WARNING 3] HELD |
| 144.92 | "September, the yellow paper. First draft." | KEPT · guard [!WARNING 6] HELD ("first draft", never "the spec") |
| 147.46 | "June 30th of this year, Toccata. Zero-knowledge verification and covenants. Live on mainnet. Inside Kaspa's consensus." | KEPT · guard [!WARNING 2] HELD (Toccata = verification + covenants, not vProgs) |
| 156.18 | "And September 2026, Silverscript 1.0. The smart contract language. Official release." | KEPT ([VERIFY] release tag at render) |
| 163.28 | "Next rung. The first standalone zero-knowledge app." | CHANGED ("zero-knowledge app" singular for "ZK apps") |
| 166.38 | "Above that, full vProgs. Still under construction." | KEPT · guards [!WARNING 1] and [!WARNING 2] HELD (no date promise, not called live) |
| 169.78 | "And kaspa.org says so in plain text." | KEPT (the trim-first line was recorded and stays) |

**Beat 2 - he called it**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 172.84 | "And in December, Sompolinsky said the covenant fork was three to six months out." | KEPT |
| 177.58 | "It shipped in June." | KEPT (a delivered call, not a live forecast: DATA.md §4 HELD) |

**Beat 3 - conviction + close**

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 178.54 | "Everyone is racing to control compute and money." | KEPT |
| 181.40 | "The more they race, the more layer nobody owns is worth." | KEPT pending the ear check (Whisper "layer" p=0.46 and no "a"; the e pass heard "the more a layer", as scripted; caption per the ear check) |
| 184.76 | "Proof of work money with apps on it and no L2 in the middle." | KEPT |
| 188.64 | "Click that like button and comment below." | CHANGED ("Click that like button and comment below" for "Click the like button, comment what you'd build on it") |
| 191.22 | "Let me know what you think is going to be built on it in the near future." | AD-LIB (stands in for the scripted "comment what you'd build on it") |
| 195.10 | "Gonna be some exciting times." | AD-LIB |
| 196.48 | "And click the link in the description below for the greatest community ever." | CHANGED ("greatest community ever" for "best community ever"; "below" added) |
| 200.96 | "And I'll catch you guys later." | CHANGED ("And I'll catch you guys later" for "I'm gonna catch you guys, later"; last word "later." ends 202.56) |

## Divergences from SCREENPLAY.md

- **Dropped:**
  1. CH2 Beat 1 podcast sentence "This August, on the Bitcoin Takeover podcast ... on rollups." plus its quote card. RESOLVED by Mike 2026-09-27 at GATE 2b (recorded as "very bullish" against the sourced "bearish"; cut e 81.655-89.975, both edges in silence troughs; SCREENPLAY line struck).
  2. CH2 Beat 3 the word "enshrined" (130.44: said "And this just means"). OPEN (the edit's C6 / container text decides whether the term appears on screen; see Flags).
  3. CH2 Beat 1 the tag "right?" (40.22 line). OPEN (nothing to rebuild; noted so no caption adds it).
- **Changed (wording drift on the take, all OPEN for Mike's spine-gate read, none are mishears):** 0.00 locked hook ("on a base layer, on a proof of work, not an L2") · 7.40 "own node" / "posts zero knowledge proof" · 38.82 "break this all down" · 40.22 "your businesses" for "your balances" · 52.18 "transaction payments" (ear check) · 83.96 "which account ... which one" · 112.06 "the state" · 137.58 "this all" · 163.28 "zero-knowledge app" singular · the CTA wording 188.64-202.56.
- **Added (ad-libs):** 191.22 "Let me know what you think is going to be built on it in the near future." and 195.10 "Gonna be some exciting times." Content, not overrun; OPEN (no cut proposed).
- **Ending:** the take closes on the persona CTA, not the hard-out variant (GATE 1 Open question 2). The recorded CTA is on the spine Mike approved at GATE spine 2026-09-27 21:16; no explicit CTA-vs-hard-out ruling is written in PROJECT-LOG, so the ruling line stays OPEN until logged. Build to the CTA as recorded.
- **Guards:** every `[!WARNING]` box HELD on the take. (1) no Sutton "within the next year", no vProgs date; (2) vProgs never called live, Toccata never called vProgs ("full vProgs, still under construction" at 166.38); (3) no TPS figure, only "10 blocks" at 21.22 and 140.70; (4) no KAS-as-gas / no-fee-leakage line; (5) no flat "no bridge", no bridge-hack figure; (6) DAGKnight never spoken, no "25 to 40 BPS", no app / team / L2 named, no "rejecting the EVM", the yellow paper is "first draft". The only rollup-sentiment line that broke the source (the "very bullish" podcast line) is cut (RESOLVED above); "bullish" appears nowhere on the final spine.

## Flags carried into the edit

- 40.22-51.96 fact-framing trap: the VO says "your accounts, your businesses, your assets"; the C9 receipt and any quote text must show Vitalik's real words ("primary accounts, balances, assets", ethereum-magicians 2020-10-02, DATA.md), never "businesses". "all in on rollups" is verbatim and may be highlighted as scripted.
- 52.18-61.02 ambiguous audio: "orders your transaction payments" ("transaction" p=0.29, "payments" p=0.00). Probably "transactions" plus noise; check by ear before captions. The C2 sequencer row text stays "own sequencer" regardless.
- 181.40-184.68 ambiguous audio: "the more layer nobody owns is worth" ("layer" p=0.46); likely "the more a layer". Check by ear before captions.
- 130.44-137.38 "enshrined" is not spoken: any on-screen "ENSHRINED" label on the C6 beat is on-screen text only (DATA.md yellow paper §3 is its source); the caption follows the VO ("And this just means ...").
- 163.28-166.22 fact-framing trap: the VO says "the first standalone zero-knowledge app" (singular); the C3 rung label keeps Sutton's own term "standalone based ZK apps" (DATA.md, 2026-04-11), never a copy of the VO.
- 147.46 fact-framing trap: the VO says "June 30th of this year"; the C3 rung and C6 receipt carry the full date 2026-06-30 (no day-relative words on screen). 140.70 / 144.92: "May 2025" and "September" carry 2025-05-05 and 2025-09-11 on the rungs. The DAA number 474,165,565 stays on-screen only.
- 172.84-178.26 "he called it" stays a delivered call (stamp "called Dec 2025 · delivered Jun 30 2026"), never a forecast.
- 191.22 the ad-lib "in the near future" is a general CTA, not a vProgs date: no on-screen text may turn it into a timeline (guard 1).
- 0.00-7.333 and 28.167-31.933 are the only two FACE windows; the face cut on #2 follows the picture edge (28.167), not the Whisper word start (28.10).
- Title-card room: the CH2 card (40.22) and the CH3 card (137.58) each have under 0.1 s below -40 dB before the first word (transcriber measurement); the >=1 s readable card lead-in has to be made at the edit (card pause), it is not in the spine.
- 81.655 cut junction: "...softened on it." | "So here's how a vProg..." is a clean trough (-76 dB) but only a ~0.08 s breath; place the C1 container entrance on 81.70.
- Bed C right-alignment target: the last spoken word "later." ends at 202.56 (CTA close, not "middle." at 188.54).
- `[VERIFY]` items still open at render (DATA.md / SCREENPLAY): kaspa.org/build vProgs status still "In construction" / "Full vProgs remain a future direction" (169.78 line, C3 rung, C7 receipt); Silverscript latest tag still v1.0.0 (156.18 VO says "1.0"; the C3 label must match); docs.kaspa.org/toccata activation wording for the C6 crop; DAGKnight rung still "proposed (KIP-2)"; persona spelling sweep on every on-screen label (vProgs, Kaspa, Toccata, Silverscript, Sompolinsky).
- Runtime measured: 3:22.8 (202.822 s, 593 words) against the 3:00 target (window 2:50 to 3:10), 12.8 s over the window top. Per chapter: CH1 40.2 s / 126 words, CH2 97.4 s / 291 words, CH3 65.2 s / 176 words. Measurement only; no cuts proposed.
