# kcc20 - AS-RECORDED (build the edit to THIS, not the plan)

_Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Shape: `skills/doc-reference/AS-RECORDED.reference.md`. Lint: `skills/doc-reference/lint_as_recorded.py`. Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence 700 ms with the 150 ms cover-only sentence residual -> content cut x4 (Mike's "not final yet" spans, run through burst removal) -> final two-zone desilence, intro 250 ms / body 600 ms). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom. Re-authored 2026-10-21 on the re-cut spine `ALL.e.desilenced`; it SUPERSEDES the earlier version written on `ALL.d.desilenced` (389.68 s), whose timecodes are all stale._

- **Final spine:** `spine/ALL.e.desilenced.mp4` - 328.99s (5:28.99), 1920x1080, 30/1 fps. LOCKED (Mike's cut of the "not final yet" lines, 2026-10-21).
- **Transcript (cue source):** `spine/ALL.e.desilenced.medium-words.json` (word-level, Whisper medium, NOT hand-edited). Human-review breakdown: `spine/ALL.e.desilenced.segments.txt` (101 segments, 889 words).
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: the defumble keep spans) -> `ALL.b.blackout.mp4.cover.json` (a -> b: cover windows blacked, no retime) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms pass, 361.34 s removed, 755.58 s -> ~394.9 s) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: Mike's four spans removed, 61.43 s; subtract 2.666667 after c 32.522982, 37.366667 after 242.732617, 52.633333 after 288.832617, 61.433333 after 326.865951) -> `ALL.e.desilenced.map.json` (d -> e: final 250 / 600 ms pass, 11 cuts, 4.49 s removed, 333.47 s -> 328.98 s). **Every timecode below is already a FINAL-spine coordinate (`ALL.e.desilenced`); the comp cues directly off them.** `ALL.d.desilenced.*` (map, words, segments) is a SUPERSEDED sibling (the fine pass on c before Mike's cuts) and `jumpcuts-final.json` still points at it: neither is in this chain, never cue off either.
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced`.

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on `ALL.e.desilenced.mp4` (non-black = FACE; black runs 6.833-19.633 and 28.167-252.900). Everything else is BLACK VIDEO and must be covered in the comp. Face 91.46 s = 27.8% / cover 237.53 s = 72.2%. Zero orphans: every window lands on a scripted `[FACE]` beat. 3 windows against `--face-max 6` (the scripted what-to-watch face line was cut, so 5 scripted face lines remain, carried in 3 continuous windows).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-6.833 | "Kaspa's core contributors just moved their first token standard KCC-20 into its final review window." | CH1 Beat 1 `[FACE]` (hook, face-bg swap F1) |
| 2 | 19.633-28.167 | "Real tokens on Kaspa's base layer with every transaction enforced by the chain's own script rules not by an off-chain indexer." | CH1 Beat 3 `[FACE]` (thesis, face-bg swap F2) |
| 3 | 252.900-328.992 | "But the high conviction holders, the ones who are in it for the long haul, are going to make it big time." ... "I'm going to catch you guys later." | CH5 Beat 4 + Beat 5 `[FACE]` (the two conviction lines and the CTA, one continuous run; it also carries the unscripted pitch 262.40-323.08 and the masked join at 262.29 where the what-to-watch line was cut) |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build (the transcriber's substitution list, re-checked word by word against the JSON, plus the formatting splits it did not list).

- 0.00, 11.44, 21.18 "Casper's" -> "Kaspa's" (persona `kaspa_spelling`, x3).
- 36.22 "Casper" -> "Kaspa" ("gave Kaspa covenants", persona `kaspa_spelling`).
- 116.74, 136.96, 239.16, 264.82 "CASPA" / "Caspa" -> "Kaspa" (persona `kaspa_spelling`, x4).
- 99.34, 111.82 "CAS" -> "KAS" (ticker, x2).
- 120.44, 139.02 "CASPLEX" -> "Kasplex" (x2) · 127.82 "CASPLEX's" -> "Kasplex's".
- 35.04, 161.16, 178.18 "Tokata" -> "Toccata" (screenplay spelling, x3).
- 221.62 "Dagnyte" -> "DAGKnight" (screenplay spelling).
- 4.92 onward "KCC20" -> "KCC-20" (x9, screenplay spelling; never swapped with KRC-20).
- 81.82, 184.90, 196.64 "KCC2" -> "KCC-2" (x3) · 183.84, 195.68 "KCC1" -> "KCC-1" (x2).
- 118.92, 133.72 "KRC20" -> "KRC-20" (x2) · 171.54 "ERC20" -> "ERC-20".
- 154.62 "Savannah Helfer" -> "Sivan Helfer" (name mishear, p=0.24; the KCC-20 author, on CLIP-1's burned caption too).
- 14.78 "flips the last call" -> "flips to Last Call" (the ALL.d pass of the same take heard "to").
- 190.74, 198.22 "last call" -> "Last Call" (casing, the spec status name).
- 64.04 "transfer or entry point" -> "transfer entrypoint" (phantom "or", p=0.33).
- 75.98 "past" -> "pass" ("transfers pass that digest through").
- 45.94 "rule book" -> "rulebook".
- 93.32 "Borrowed receive" -> "Borrowed Receive" (casing, screenplay spelling; the IDEA FOUR panel says BORROWED RECEIVE).
- 122.06 "third party control" -> "third-party control" (hyphen only; "control" stays AS HEARD, see Flags).
- 125.82 "2160" -> "2,160" · 227.42 "82 ,000" -> "82,000" · 231.40 "22 %" -> "22%" · 237.06 "96 .7 %" -> "96.7%" (number formatting / token splits).
- 170.06 "one community's tracker count" -> "one community tracker's count" (apostrophe placement).
- 188.16 "drabs" -> "Drafts" (confirmed by large-v3 on ALL.d).
- 206.52 "mashed a draft" -> "matched the draft" (p=0.44 / 0.48, confirmed by large-v3 on ALL.d).
- 235.56 "pre -mine" -> "premine" (screenplay spelling) · 27.40 "off -chain" -> "off-chain" (token split).
- 279.58, 295.08 "investor back" -> "investor-backed" (x2, dropped -ed; the ALL.d pass heard "investor-backed").
- 290.22 "NYX" -> "MYX" (token name, Mike confirmed 2026-10-21; never NYX).
- 292.40 "the lab token" -> "the Lab token" (casing, Mike confirmed 2026-10-21).
- 2026-10-22 caption keys (draft v1: the two fixes above never applied: "investor back" is split across two caption groups, and the house cashtag rule turns "lab token" into "$lab token" first): "back insider" -> "backed insider" · "back takes" -> "backed takes" · "the $lab" -> "the lab" (Mike's "the Lab token"; captions render lowercase) · "many, others." -> "many, many others." (the builder dropped the repeated word).
- Caption note: 54.24 / 69.04 / 78.50 / 91.90 Whisper writes "Idea 1." / "Idea 2." / "Idea 3." / "Idea 4."; the kinetic panels read IDEA ONE ... IDEA FOUR, and captions are OFF under each panel's pop anyway.

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - LAST CALL (0.00-30.36) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "Kaspa's core contributors just moved their first token standard KCC-20 into its final review window." | KEPT (locked `[SAY-EXACT]` `[FACE]`, verbatim) · guard [!WARNING 3] HELD ("first token standard", never "first token on L1") |
| 6.90 | "On October 7th, 2026, pull request 31 merges into Kaspa's own conventions repo and the status on the spec flips to Last Call, the final review window before standard goes final." | KEPT (drift: "before standard goes final" for "before a standard goes Final") · guard [!WARNING 1] HELD (Oct 7 merge) · guard [!WARNING 2] HELD (no end date) |
| 19.74 | "Real tokens on Kaspa's base layer with every transaction enforced by the chain's own script rules not by an off-chain indexer." | CHANGED (locked `[SAY-EXACT]` `[FACE]`; "every transaction" for "every transfer") |
| 28.18 | (not in this spine) | DROPPED: locked `[SAY-EXACT]` `[COVER]` "Real. Close. And not finished." (said on the take as "Real, close, not yet finished.", CUT by Mike 2026-10-21, span 1, after KCC-20 went Final; the H1 "REAL · CLOSE · NOT FINISHED" card and its three timpani taps go with it) |
| 28.18 | "So let's get into how this is all playing out." | CHANGED (handoff; scripted "So, let's dive into all this.") |

### CH2 - HOW KCC-20 WORKS (30.36-116.22) · card ON "HOW KCC-20 WORKS" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 30.50 | "Start with where this comes from." | KEPT |
| 32.60 | "On June 30th, 2026, the Toccata hard fork gave Kaspa covenants." | KEPT |
| 37.62 | "A covenant is a rule built into a coin that controls how it is spent and where it can go next." | KEPT (drift: "how it is spent" for "how it can be spent") |
| 44.46 | "KCC-20 is the shared rulebook for a fungible token built from those covenants." | KEPT |
| 49.94 | "Fungible meaning every unit is the same as every other." | KEPT |
| 53.20 | "Four ideas." | KEPT |
| 54.24 | "Idea 1. A common interface." | KEPT (kinetic panel RIGHT lands on "Idea" 54.24) |
| 56.32 | "Every KCC-20 token carries the same state block, the amount, the owner, a few settings, and the same transfer entrypoint." | KEPT |
| 65.02 | "So any wallet, indexer, or app reads it the same way." | KEPT |
| 69.04 | "Idea 2. Extended state." | KEPT (kinetic panel LEFT on "Idea" 69.04) |
| 71.30 | "A token can carry its own data and behavior behind one digest, and transfers pass that digest through untouched." | KEPT |
| 78.50 | "Idea 3. Flexible authority." | KEPT (kinetic panel RIGHT on "Idea" 78.50) |
| 80.90 | "And this comes from KCC-2." | KEPT |
| 83.00 | "The owner of a token can be a public key, a key commitment, a script, or another covenant." | KEPT |
| 89.06 | "So covenants can own tokens and govern them." | KEPT (keyword pop "COVENANTS CAN OWN TOKENS", twinkle, from "covenants" 89.28) |
| 91.90 | "Idea 4. Borrowed Receive." | KEPT (kinetic panel LEFT on "Idea" 91.90) |
| 94.30 | "Here's the thing." | KEPT |
| 95.14 | "Every UTXO, every unspent coin, has to be funded with KAS." | CHANGED ("every UTXO, every unspent coin" for "every new UTXO, every new unspent coin") |
| 99.94 | "And a rule called storage mass makes tiny outputs expensive on purpose." | CHANGED ("tiny outputs" for "tiny new outputs"; the STORAGE MASS pop still lands on "storage" 100.88) |
| 104.92 | "So instead of a UTXO for every incoming token, the sender tops up one you already hold." | KEPT (drift: "a UTXO" for "a new UTXO") |
| 110.66 | "Same owner. The KAS inside cannot go down. Only the token amount grows." | KEPT (cash-register so the bell lands on "grows" 115.04) |
| 115.52 | (not said) | DROPPED: the optional front-running caveat "And a fix against front-running that borrow path landed in August..." (optional, never recorded) |

### CH3 - KCC-20 VS KRC-20 (116.22-174.64) · card OFF · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 116.22 | "Now Kaspa already has tokens, KRC-20, from Kasplex, a third-party control, live since September 2024." | CHANGED ("a third-party control" as heard, scripted "protocol"; "September 2024" for "September of 2024") |
| 125.46 | "Around 2,160 tokens by Kasplex's own indexer count." | KEPT |
| 129.74 | "It proved the demand." | KEPT |
| 131.22 | "The difference is where the token lives." | KEPT |
| 133.48 | "With KRC-20, token operations are written onto Kaspa as data, and the Kasplex indexer works out who owns that." | KEPT (drift: "who owns that" for "who owns what") |
| 141.50 | "Your balance is the indexer's answer." | KEPT |
| 143.64 | "With KCC-20, the token state sits inside a covenant UTXO on the base layer, and the chain script enforces every transfer." | KEPT (drift: "the chain script" for "the chain's script") |
| 152.30 | "Your balance is what the chain enforces." | KEPT |
| 154.62 | "Sivan Helfer, the first listed author of KCC-20, put it plainly back in June, a week before Toccata went live." | KEPT (the CLIP-1 set-up line, said in full) |
| 162.20 | (clip insert CLIP-1 lands here; the set-up line ends "...a week before Toccata went live.") | KEPT · INSERT CLIP-1 (~20.5 s, the speaker's own voice; the splice is the trough after "live", measured 162.22-162.32 below -88 dB, digital silence 162.27-162.31) |
| 162.34 | "That is the whole difference." | KEPT (the resume line) |
| 164.44 | "On the KCC-20 side, it is very early." | KEPT |
| 167.58 | "Roughly 150 tokens by one community tracker's count." | KEPT · guard [!WARNING 4] context HELD (tokens exist today, a third-party count, no hard "146" in the VO) |
| 171.52 | "Think ERC-20, enforced by the base layer itself." | KEPT · guard [!WARNING 3] HELD (Mike's analogy, no naming claim) |

### CH4 - WHERE IT STANDS (174.64-207.44) · card ON "WHERE IT STANDS" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 174.64 | "The timeline, straight from the repo." | KEPT |
| 177.06 | "June 30th, Toccata activates." | KEPT |
| 179.54 | "July 15th, the convention repo opens." | KEPT (drift: "convention repo" for "conventions repo") · guard [!WARNING 1] HELD (the repo opens, not "KCC-20 merged as Draft") |
| 182.52 | "August 20th, KCC-1, KCC-2, and KCC-20 land as Drafts." | KEPT · guard [!WARNING 1] HELD |
| 188.60 | "On September 22nd, the Last Call pull request for KCC-20 opens." | KEPT · guard [!WARNING 1] HELD (not "still open") |
| 193.78 | "October 1st, KCC-1, KCC-2 move to Last Call." | KEPT (drift: no "and") |
| 199.46 | "October 7th, KCC-20 joins them." | KEPT (the FINAL stamp beat follows with no VO: c5-final-square then RX3-kccs-readme-final, "UPDATE · KCC-20 IS FINAL · OCT 21, 2026", Mike 2026-10-21) |
| 202.32 | (not in this spine) | DROPPED: Beat 2 "Last Call is the final review window. An editor sets a deadline, typically around 14 days out ... No official end date." (said, CUT by Mike 2026-10-21, span 2; the NO OFFICIAL END DATE pop + minecraft-damage oof and the C6 ladder line go with it) |
| 202.32 | (not in this spine) | DROPPED: Beat 3 "And KCC-20 cannot go final on its own ... KCC-1, and then KCC-2, then KCC-20. It also needs published test vectors ... the number of final technical standards in that repo is zero." (said, CUT by Mike 2026-10-21, span 2; the dependency arrows, C7 receipt line and sudden-shock on "zero" go with it) |
| 202.56 | "By late July, implementers were already reporting that their tokens only partly matched the draft." | KEPT (drift: "that their"; receipt C20 on this line, Mike 2026-10-21) |

### CH5 - THE BIGGER PICTURE (207.44-328.99) · card ON "THE BIGGER PICTURE" · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 207.44 | "So what's the bigger picture?" | AD-LIB (new CH5 opener, not in the script) |
| 208.98 | "Let's zoom out." | CHANGED ("Let's zoom out." for "Zoom out.") |
| 209.90 | "After the September 22nd release, the main node code went quiet for three weeks." | KEPT |
| 214.72 | "Then six commits landed in one week, October 13th to the 16th." | KEPT |
| 218.84 | "Maintenance and plumbing, not a new feature." | KEPT |
| 221.14 | "And DAGKnight, the next consensus upgrade, still has no date." | KEPT (serious, no oof) |
| 225.48 | "Usage is a tiny base, around 82,000 standard transactions a day the week of October." | CHANGED ("the week of October" with no "12th"; captions must not add it) |
| 230.82 | "Up around 22% on the week before." | KEPT |
| 233.06 | (not in this spine) | DROPPED: Beat 3 "So here's the conditional case. If KCC-1, KCC-2, then KCC-20 go final ... Tokens exist today. That shared standard does not, yet." (said, CUT by Mike 2026-10-21, span 3; the C3 "one rulebook" callback and the C6 Final end state go with it; the BRAAM moves to 240.92) |
| 233.28 | "And the supply is fixed." | KEPT (drift: "And the supply" for "And supply") |
| 234.70 | "Proof of work, no premine." | KEPT |
| 236.78 | "Around 96.7% of all Kaspa is already mined." | CHANGED ("all Kaspa" for "all KAS") · BRAAM in a spine pause after "mined." (word ends 240.92, "New" starts 241.06; Mike 2026-10-21, moved from the cut "yet." line), C17 ring held, slow zoom |
| 241.06 | "New demand meets very little new supply." | KEPT |
| 243.64 | "Conditional, and that's the asymmetry I'm watching." | KEPT |
| 246.80 | "And I'm telling you, this is going to be well worth the wait." | KEPT (`[COVER]`, I1 moon image) |
| 249.76 | "At least for me anyway, nothing here is financial advice." | AD-LIB (`[COVER]`, before the face run) |
| 252.94 | "But the high conviction holders, the ones who are in it for the long haul, are going to make it big time." | KEPT (`[FACE]`, Mike's own words, meaning locked; "But" added) |
| 258.26 | "Because the ones with the vision are the ones that will end up dominating the world." | KEPT (`[FACE]`) |
| 262.32 | (not in this spine) | DROPPED: Beat 5 `[FACE]` "So what to watch next? KCC-1, then KCC-2, go final, then KCC-20. Then the implementations that pass its vectors." (said, CUT by Mike 2026-10-21, span 4; the KCC-1 / KCC-2 face side panels go with it; leaves a head jump at 262.29, see Flags) |
| 262.40 | "But I can tell you, if you're interested in stacking Kaspa, while it's still cheap, the best way to do that is to get in on a bunch of good tokens that really are going to moon 100x, 500x within like six months to a year." | AD-LIB (`[FACE]`, unscripted pitch, KEPT by Mike at the spine gate) |
| 276.48 | "I'm not talking about degen plays. I'm talking about investor-backed insider tokens that me and my group get in on early. We have a whole bunch of plays." | AD-LIB (pitch) |
| 285.76 | "Click the link in the description below. You can see all the receipts, 550x on MYX, 350x on the Lab token, and many, many others." | AD-LIB (pitch; MYX and Lab confirmed by Mike) |
| 294.82 | "All investor-backed takes time. Sometimes it takes six months. Sometimes it takes a year before they pop." | AD-LIB (pitch; "All investor-backed takes time" as heard on this pass, see Flags) |
| 300.70 | "It's not like one of those like, I'm going to put in like 100 bucks on a degen play, and it's going 100x tomorrow. No, there's nothing like that. It's a strategy involved." | AD-LIB (pitch) |
| 309.20 | "Make sure you're surrounded by some like-minded people in a group of people who can share ideas. And everybody is in it for the money to all together, right? So we're all willing to help each other out and grow together. So click the link in the description below." | AD-LIB (pitch; "money to all together" left as heard) |
| 323.24 | "And besides that, click that like button and that subscribe button." | CHANGED (CTA; scripted "comment which one you are watching, KCC-20 or KRC-20, and click the link ... best community ever" not said) |
| 326.60 | "I'm going to catch you guys later." | KEPT (Bed D epic_hit lands on "later." 328.08-328.78) |

## Divergences from SCREENPLAY.md

- **Dropped (cut from the spine):** CH1 locked "Real. Close. And not finished." · CH4 Beat 2 (what Last Call means, no official end date) · CH4 Beat 3 (the dependency, test vectors, "zero") · CH5 Beat 3 (the conditional case through "That shared standard does not, yet.") · CH5 Beat 5 what-to-watch `[FACE]` line - RESOLVED by Mike 2026-10-21 ("make the cuts and add the Final stamp", after KCC-1, KCC-2 and KCC-20 went Final at 14:50 UTC, hours after the 12:34 UTC recording). Knock-on, decided: H1 card + timpani taps, the CH4 oof, the C6 ladder / dependency / C7 lines and the CH5 KCC-1 / KCC-2 face panels are dropped; built assets that only served cut lines are BENCHED.
- **Dropped (never said):** CH2 optional front-running caveat - RESOLVED (optional, Mike built to the take as-is 2026-10-21). CTA "comment which one you are watching, KCC-20 or KRC-20" and "best community ever" - RESOLVED (spine gate approved 2026-10-21, the take airs as said).
- **Added (new, not in the script):** after 202.32 the FINAL stamp beat (c5-final-square + RX3-kccs-readme-final, "UPDATE · KCC-20 IS FINAL · OCT 21, 2026", twinkle on the stamp frame, readable at least 2 s) - RESOLVED (Mike 2026-10-21).
- **Changed:** 19.74 "every transaction" (script "transfer") · 28.18 handoff "So let's get into how this is all playing out." · 95.14 / 99.94 "new" dropped · 116.22 "a third-party control" · 208.98 "Let's zoom out." · 225.48 no "12th" · 236.78 "all Kaspa" · 323.24 CTA wording - RESOLVED (spine gate approved, Mike 2026-10-21: "I think it's great"). The persona `dive_in_variants` record of the 28.18 handoff wording - OPEN.
- **Added (ad-libs):** 207.44 "So what's the bigger picture?" · 249.76 "At least for me anyway, nothing here is financial advice." · 262.40-323.08 the ~61 s unscripted token-group pitch on FACE - RESOLVED, KEPT (Mike, spine gate 2026-10-21; the no-price-talk constraint amended for the spoken take only; no target, multiplier or price chart on screen, ever).
- **Guards:** [!WARNING 1] deck timeline dates: HELD (179.54-199.46 say the repo dates, Sep 22 "opens", never "still open"). [!WARNING 2] no Last Call end date, no implied Final date: HELD (the only "14 days" line was cut; 6.90 carries no date). [!WARNING 3] ERC-20 naming / first token on L1: HELD (171.52 is Mike's analogy; 0.00 "first token standard"). [!WARNING 4] "once Final, apps can issue tokens": HELD (the conditional-case line was cut, nothing in the kept take ties issuance to Final); its price / target scope rule is BROKEN on the take by the 262.40-323.08 pitch ("while it's still cheap", 100x, 500x, 550x, 350x, "100 bucks"), ruling: KEEP, Mike 2026-10-21.
- **Clip inserts (Convention 6):** CLIP-1 set-up line said -> KEPT at 162.20 (Mike approved CLIP-1 at GATE 1). CLIP-2 HELD and CLIP-3 REJECTED in the screenplay, no splice.

## Flags carried into the edit

- 162.20 CLIP-1 splice MOVED: COVER-PLAN.json `clip_inserts.splice_at` = 164.44 is a SUPERSEDED `ALL.d.desilenced` coordinate. On this spine "live." ends 162.20 and "That" starts 162.34; the trough measured 162.22-162.32 (below -88 dB, digital silence 162.27-162.31). Re-snap with lint-pause-silence on THIS file; never cut at 164.44.
- 262.29 FACE head jump: the cut what-to-watch line leaves a hard jump inside FACE window 3 ("world." 262.32 -> "But" 262.40; pre-join head lower and tilted left, post-join higher and tilted right). Mask it with the video's picked FACE-cut treatment (cuts.json note).
- 0.00-19.46 fact-framing: the hook and the PR #31 line say KCC-20 is in its "final review window" / Last Call; true on Oct 7 and kept as history. No graphic may claim it is still in Last Call or "not final" today; the ONLY current-status graphic is the FINAL stamp after 202.32 (kaspanet/kccs PR #41 merged 2026-10-21 14:50 UTC).
- 116.22 "a third-party control": both models hear "control"; the C3 / KRC-20 graphic says "third-party protocol" (DATA.md Pillar 3), captions follow the audio; confirm by ear.
- 125.46 fact-framing trap: VO "around 2,160"; the C4 chart carries the dated Kasplex API figure (2,164 on 2026-10-18), never a copy of the spoken rounding and never the deck's 2,153.
- 167.58 fact-framing trap: VO "roughly 150"; the chart carries KasStacker's dated count (146) with "third-party count" on the source line.
- 225.48 fact-framing trap: VO "around 82,000 ... around 22%" with no date; captions must not add "12th"; the C15 chart carries the dated week (81,767, +21.5%).
- 236.78 fact-framing trap: VO "96.7% of all Kaspa"; the C17 ring shows 96.72% of 28.7B KAS, dated.
- 262.40-323.08 the pitch airs as said on face: NO multiplier, target or price graphic over it; captions as spoken, MYX and Lab per the mishear list.
- 294.82 ambiguous audio: "All investor-backed takes time" (the ALL.d pass split it "All investor-backed. It takes time."); check at captions. 304.74 "it's going 100x" (ALL.d "going to 100x") and 307.58 "It's a strategy involved" (ALL.d "It's just strategy involved"): low stakes, left as heard.
- 315.42 ambiguous audio: "in it for the money to all together" (may be "money too, all together"); check at captions.
- `[VERIFY]` items from DATA.md still open at render: kaspanet/kccs README + headers now read KCC-1 / KCC-2 / KCC-20 Final (for RX3 and the stamp) · Kasplex `tokenTotal` · KasStacker count · rusty-kaspa master commits Oct 13 to 16 + `dagknight` branch row · Kaspalytics Standard series · api.kaspa.org coinsupply.
- Runtime measured: spine 5:28.99, plus ~20.5 s CLIP-1, three card breaths, the BRAAM spine pause (~4 s) and the FINAL stamp beat (at least 2 s), around 5:55 to 6:00 against the 5:00 target (4:45 to 5:15). Measurement only; the ~61 s ad-lib is content, not overrun.
