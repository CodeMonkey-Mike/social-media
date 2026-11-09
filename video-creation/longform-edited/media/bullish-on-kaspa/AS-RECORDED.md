# bullish-on-kaspa - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble, opening sound cut + the "misses" pickup -> cover-blackout -> coarse desilence 700 ms, keep-face-pauses, cover pad 50 + 50 ms -> two-zone desilence 300 ms intro / 450 ms body @38.08s -> Adobe Enhance audio swap, video stream-copied, then re-transcribed; no burst removal, no content cut). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.d.desilenced.mp4` - 528.367s (8:48.37), 1080p30 (ffprobe: 30/1 fps, video 528.367 s, audio 528.366 s). LOCKED.
- **Transcript (cue source):** `spine/ALL.d.desilenced.medium-words.json` (word-level, NOT hand-edited). Human-review breakdown: `spine/ALL.d.desilenced.segments.txt`.
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (lowbps master -> a: the kept spans, defumble + opening cut + pickup) -> `ALL.b.blackout.mp4.cover.json` (a -> b: the blackout spans, no time shift) -> `ALL.c.desilenced.map.json` (b -> c: 499.53 s removed, 1039.13 s to 539.60 s) -> `ALL.d.desilenced.map.json` (c -> d: 11.87 s removed, 540.16 s to 528.29 s by the map; the file probes 528.367 s). The Adobe Enhance swap shifted nothing (envelope lag 0 ms, video stream-copied). **Every timecode below is already a FINAL-spine coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.desilenced`.

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on `spine/ALL.d.desilenced.mp4`, measured for this document (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face 17.9% (94.37 s) / cover 82.1% (434.00 s). Zero orphans: every window lands on a scripted `[FACE]` beat. 9 windows for the screenplay's 10 FACE lines, because the resume and the plug are one continuous hold (window 6). Budget `--face-max 10`.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-3.367 | "I am more bullish on Kaspa now than I've ever been" | CH1 Beat 1 `[FACE]` (locked) |
| 2 | 19.433-26.633 | "Nobody was just handed Kaspa. You earned it from a machine or you bought it from somebody who did." | CH1 Beat 2 `[FACE]`, inspiring line 1 |
| 3 | 31.433-35.700 | "2026 is the year it came all online." | CH1 Beat 3 `[FACE]`, the title pop line |
| 4 | 97.300-104.200 | "That's nearly 8 years of published research before the first block on mainnet was ever even mined." | CH2 Beat 3 `[FACE]`, inspiring line 2 |
| 5 | 233.233-237.900 | "Nobody owns a network, and nobody asks for permission, yet it all ships." | CH3 Beat 6 `[FACE]`, inspiring line 3 |
| 6 | 302.133-335.933 | "That's research, not a ship feature. ... Click the link in the description below." | CH4 Beat 4 `[FACE]` (the resume) + CH4 Beat 5 `[FACE]` (the plug), one hold |
| 7 | 447.900-455.667 | "The tools came first, the crowd has not arrived yet. And that's exactly the gap where I want to be standing." | CH5 Beat 6 `[FACE]`, inspiring line 4 |
| 8 | 490.967-500.033 | "Kaspa didn't need a bull market to become real. It became real in the bear. And whatever comes next, this network is waiting for it." | CH6 Beat 1 `[FACE]`, inspiring line 5 |
| 9 | 511.033-528.367 | "So if you want to be around people who stack with real conviction, ... And subscribe!" | CH6 Beat 3 `[FACE]`, the CTA, to the last frame |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build. Keys are word-bounded and case-insensitive at caption build, so each key below is written to match only the misheard words.

- 1.62, 21.20, 38.66, 47.12, 52.98 "Caspa" -> "Kaspa" (persona spelling; 1.62 and 21.20 are on FACE).
- 141.62, 160.06, 241.86 "Casper's" -> "Kaspa's" (persona: never Casper).
- 177.50, 209.34, 441.20, 477.80, 491.28, 500.44, 520.76 "Casper" -> "Kaspa" (persona: never Casper; 491.28 and 520.76 are on FACE).
- 51.36, 55.52, 87.18 "Ghostag" -> "GhostDAG" (persona).
- 59.82 "crescendo" -> "Crescendo" (the hard fork's name).
- 65.70-67.16 "does not have" -> "does not halve" (changes the meaning; keyed on the phrase so no other "have" is touched).
- 73.50 "$28.7 billion" -> "28.7 billion" (KAS, not dollars).
- 79.00 "Ghost Protocol" -> "GHOST protocol".
- 82.20, 294.72 "Sampolinsky" -> "Sompolinsky".
- 86.26 "write paper" -> "whitepaper".
- 90.42, 253.10 "Dagnyte" -> "DAGKnight".
- 108.00 "Takata" -> "Toccata".
- 255.54 "Tokata" -> "Toccata".
- 109.40, 141.96, 151.52, 170.64, 242.68 "layer 1" -> "Layer 1" (casing).
- 205.06 "layer 2" -> "Layer 2" (casing).
- 124.82 "SilverScript" -> "Silverscript" (the project's spelling).
- 188.06 "Yggdras open" -> "Igra opened" (LOW confidence, see Flags).
- 194.80 "In Onigra" -> "And on Igra" (LOW confidence, see Flags).
- 197.18 "CASCAD" -> "Kaskad".
- 203.02 "Casplex" -> "Kasplex".
- 211.88, 221.44, 232.82, 271.20, 282.04, 339.88 "CAS" -> "KAS" (ticker).
- 354.80, 363.84, 366.60 "CASP" -> "KAS" (ticker).
- 215.38 "Procoswap" -> "KrokoSwap".
- 216.40 "CasperCom" -> "KaspaCom".
- 220.74 "GATE" -> "Gate".
- 240.20 "Vprogs" -> "vProgs" (persona spelling).
- 241.26-241.54 "Apps that on" -> "Apps that live on" (the JSON drops "live"; MED confidence).
- 284.28-284.80 "January 1," -> "January 1st,".
- 291.76-293.14 "for that And" -> "for that September. And" (the JSON's "And" at 292.30, probability 0.03, swallowed "September"; HIGH).
- 297.08 "Midchain" -> "Mid-Chain".
- 309.04 "after Ghost" -> "after GHOST" (FACE window 6).
- 318.10 "discord" -> "Discord" (FACE window 6, probability 0.04).
- 321.92 "reaches" -> "reach is" (FACE window 6; keyed on the one word because the caption groups may split it from "hooked"; LOW confidence, see Flags).
- 326.20-326.66 "Perp's pad" -> "PerpsPad" (persona spelling; FACE window 6).
- 341.06 "$0.03" -> "3 cents" (Mike's spoken figure).
- 356.64 "$912 million" -> "912 million" (KAS, not dollars).
- 361.38 "$2.06" -> "2.06" (KAS, not dollars).
- 362.92 "$1.94" -> "1.94" (KAS, not dollars).
- 365.30 "$1.68 million" -> "1.68 million" (KAS, not dollars).
- 495.64-496.42 "last year" -> "bear" (FACE window 8; "last" has probability 0.00; every other decode says "It became real in the bear"; HIGH, and the BEAR accent has no word of its own, so cue it from the audio).
- 518.78 "comments" -> "comment" (the transcriber's correction, FACE window 9; "comments" has probability 0.26 and was not checked by ear; see Flags).
- 9.74-10.02 "pre-mine" -> "premine" (caught here; the script's and the on-screen spelling).
- 114.52-114.84 "zero knowledge" -> "zero-knowledge" (caught here; on-screen text only).
- 445.66-446.16 "written off network" -> "written-off network" (caught here; on-screen text only).

Token splits that only matter if these words are ever captioned or copied (the JSON breaks them, the words are right): "KRC -20" 138.36, "KCC -20" 149.16 and 180.28, "KIP -16" 278.84.

## AS-RECORDED beats (timecodes = FINAL spine)

Quoted text is the transcript with only the mishears above corrected. Elisions such as "what ship" and "run app" stay as decoded. `[FACE]` / `[COVER]` on a row is the gate as measured from the picture.

### CH1 - THE HOOK (0.00-37.84) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "I am more bullish on Kaspa now than I've ever been" | Beat 1 `[FACE]` CHANGED, locked `[SAY-EXACT]` drift ("now" for "right now"; "I've" for "I have") |
| 3.44 | "and it has nothing to do with the price." | Beat 1 `[COVER]` KEPT (locked `[SAY-EXACT]`; one sentence with the line before it, so the whip OUT has no breath, the picture cuts at 3.367 just before "and") |
| 6.00 | "This network launched in November of 2021 with no pre-mine, no pre-sale, no insider allocation." | Beat 2 `[COVER]` KEPT (no "and" before "no insider") |
| 13.36 | "Every single coin in circulation was mined, in the open, from the first day of mainnet onward." | Beat 2 `[COVER]` KEPT |
| 19.68 | "Nobody was just handed Kaspa. You earned it from a machine or you bought it from somebody who did." | Beat 2 `[FACE]` CHANGED, inspiring line 1 ("just handed" for "handed"; "from a machine" for "with a machine") |
| 26.66 | "And for 5 years, through the run up and through the crash, builders never stopped." | Beat 3 `[COVER]` KEPT ("builders" for "the builders") |
| 32.10 | "2026 is the year it came all online." | Beat 3 `[FACE]` CHANGED ("came all online" for "all came online") |
| 35.92 | "So let's take this from the top." | Beat 3 `[COVER]` KEPT |

### CH2 - WHAT IT IS (37.84-104.28) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 37.84 | "Now here's what Kaspa actually is. Bitcoin runs one block at a time and when two miners find a block at the same moment, one of them gets thrown away." | Beat 1 `[COVER]` KEPT |
| 47.12 | "Kaspa keeps every block. They land in parallel, in a graph, and GhostDAG puts them all in order." | Beat 1 `[COVER]` KEPT |
| 52.98 | "Kaspa is a fully implemented GhostDAG, running proof of work at 10 blocks a second, since the Crescendo hard fork on May 5th, 2025." | Beat 1 `[COVER]` KEPT |
| 63.60 | "El Cinco de Mayo!" | Beat 1 `[COVER]` AD-LIB, stays (Mike 2026-11-04); his edit ask: confetti, a Mexican hat, 1 to 2 s of Mexican music |
| 65.54 | "The block reward does not halve every 4 years. It shrinks a little every single month, a smooth halving, toward the hard cap of around 28.7 billion." | Beat 2 `[COVER]` KEPT ("the hard cap" for "a hard cap") |
| 75.10 | "And the research behind it is older than most of crypto. The GHOST protocol, 2013. Yonatan Sompolinsky and Aviv Zohar, credited by name in the Ethereum whitepaper." | Beat 3 `[COVER]` KEPT |
| 87.18 | "GhostDAG, the paper, 2018. DAGKnight, 2022. And the founder is a research associate at Harvard, still publishing in 2026." | Beat 3 `[COVER]` KEPT |
| 97.44 | "That's nearly 8 years of published research before the first block on mainnet was ever even mined." | Beat 3 `[FACE]` CHANGED, inspiring line 2 ("ever even mined" for "ever mined"; "That's" for "That is") |

### CH3 - WHAT JUST LAUNCHED (104.28-238.12) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 104.28 | "Now we get to what ship. June 30th, 2026. The Toccata hard fork." | Beat 1 `[COVER]` CHANGED ("what ship" for "what shipped", possibly an elision; the sentence breaks at the date and the fork). Opens 80 ms after the FACE picture ends |
| 109.00 | "The Layer 1 became programmable. Covenant, transaction introspection, and zero knowledge verification. Native, on the base layer." | Beat 1 `[COVER]` CHANGED ("The Layer 1" for "and Layer 1"; "Covenant" for "Covenants") |
| 118.44 | "2 days later, July 2nd, the first smart coins went live on mainnet." | Beat 2 `[COVER]` KEPT |
| 123.50 | "September 9th, Silverscript version 1.0. A token that took thousands of lines of raw opcodes, now around 60 readable lines." | Beat 2 `[COVER]` KEPT |
| 133.08 | "Bam. Doesn't that make it easy?" | Beat 2 `[COVER]` AD-LIB, stays (Mike 2026-11-04) |
| 135.14 | "September 20th, an outside indexer for the old KRC-20 tokens got exploited." | Beat 3 `[COVER]` KEPT · guard [!WARNING 2] HELD ("Kaspa was hacked" not said) |
| 140.56 | "But here's the thing, Kaspa's Layer 1 was never touched. The flaw was in the bookkeeping outside of the chain." | Beat 3 `[COVER]` KEPT ("But here's the thing," for "Here's the thing."; "outside of the chain") · guard [!WARNING 2] HELD |
| 146.88 | "And the fix was already being built. KCC-20, tokens on the Layer 1 itself. Written in August." | Beat 3 `[COVER]` CHANGED (the sentence is broken into fragments; "on the Layer 1" for "on Layer 1") |
| 154.26 | "October 21st, 2026. It was declared final. Token rules enforced by Kaspa's own consensus. The rules every node and every miner validates, not an outside indexer." | Beat 3 `[COVER]` KEPT · guard [!WARNING 2] HELD ("the miners check the tokens" not said) |
| 166.28 | "As of early November, around 460 tokens are live on the Layer 1, with markets and live trades tracked right on the explorer." | Beat 4 `[COVER]` KEPT · guard [!WARNING 5] HELD (not 440) |
| 175.08 | "And Nacho, the biggest meme token on Kaspa, opened its one-way migration to KCC-20 on October 30th, closing on January 31st, 2027." | Beat 4 `[COVER]` KEPT |
| 186.32 | "Then, the L2 stack. Igra opened its public mainnet on March 19th, 2026, after six months of testing the Sigma Prime audit." | Beat 5 `[COVER]` CHANGED ("testing the Sigma Prime audit" for "testing and a Sigma Prime audit"; see Flags) |
| 194.80 | "And on Igra there's a lending protocol called Kaskad, live since May, double audited, with staking for governance." | Beat 5 `[COVER]` KEPT ("called Kaskad" for ", Kaskad,") |
| 201.88 | "The second L2 is Kasplex, a full EVM Layer 2, so Ethereum apps can move over with minimal changes." | Beat 5 `[COVER]` KEPT |
| 209.34 | "Kaspa itself orders its transactions, and KAS is the only gas token." | Beat 5 `[COVER]` KEPT ("the only" for "its only") |
| 214.78 | "ZealousSwap, KrokoSwap, and KaspaCom are all running on it, and since April 2026, Gate lets you move KAS onto it directly from the exchange." | Beat 5 `[COVER]` KEPT |
| 224.02 | "And the network itself is closing in on 2.5 billion transactions, with more than 565,000 addresses holding at least one KAS." | Beat 6 `[COVER]` KEPT · guard [!WARNING 1] HELD (not "crossed", not "approaching 600,000") |
| 233.44 | "Nobody owns a network, and nobody asks for permission, yet it all ships." | Beat 6 `[FACE]` CHANGED, inspiring line 3 (scripted: "No company owns this network, nobody had to ask permission, and all of it shipped.") |

### CH4 - WHAT IS COMING (238.12-337.30) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 238.12 | "Now, what's coming? vProgs. Apps that live on Kaspa's own Layer 1, and talk to each other directly. No rollup in between." | Beat 1 `[COVER]` KEPT ("what's coming?" for "what is coming.") |
| 246.96 | "It's still under construction, the runtime is still evolving, and there's no public ship date." | Beat 1 `[COVER]` KEPT ("It's still" for "It is") · guard [!WARNING 4] HELD (no date) |
| 251.92 | "And then, DAGKnight. The consensus upgrade that follows Toccata. Block times targeted at 25 to 40 milliseconds. That's 25 to 40 blocks a second." | Beat 2 `[COVER]` KEPT ("And then," added) · guard [!WARNING 4] HELD (no date, "targeted") |
| 263.16 | "And 100 blocks a second is targeted for a 2027 hard fork." | Beat 2 `[COVER]` KEPT · guard [!WARNING 4] HELD ("targeted", never "will") |
| 267.90 | "And then, a stablecoin, issued against KAS and settled on the base layer." | Beat 3 `[COVER]` KEPT ("And then," added; "Kaspa Dollar" is not spoken here or anywhere) · guard [!WARNING 4] HELD (not "the Kaspa stablecoin") |
| 273.60 | "Community funded, led by a core developer, Alexander Safstrom, the author of the KIP-16." | Beat 3 `[COVER]` KEPT ("the KIP-16" for "KIP-16") |
| 280.10 | "The goal is 5 million KAS." | Beat 3 `[COVER]` CHANGED ("The goal is" for "Goal,") |
| 283.08 | "A fundraiser closes January 1st, 2027, refunds if it misses. And if it hits, the roadmap targets mainnet for that September." | Beat 3 `[COVER]` KEPT ("refunds if it misses" is Mike's pickup `raw/2026-11-04 11-28-29.mkv`, spliced at the spine review; "for that September" for "that September"; "September" is swallowed in the JSON) |
| 292.90 | (not said) | Beat 3 DROPPED: "Here's the thing, it was around 9.5 percent funded in early November, so this one is on us." (Mike's spoken instruction on the take, cut; RESOLVED) |
| 293.14 | "And the founder himself, Yonatan Sompolinsky, stood on a stage at Mid-Chain 2026 on October 26, and described where his research goes next." | Beat 4 `[COVER]` KEPT ("on a stage" for "on stage"; "October 26" for "October 26th"). Do not cue on the JSON's "And" at 292.30; "the" at 293.14 is the first reliable word |
| 302.18 | (clip insert CLIP-1 lands here; the set-up line ends "...where his research goes next.") | KEPT · INSERT CLIP-1 (10.8 s, the speaker's own voice; the splice is the trough after "next.") |
| 302.30 | "That's research, not a ship feature." | Beat 4 `[FACE]` CHANGED, the resume ("not a ship feature" for "not a shipped feature", possibly an elision) |
| 305.00 | "And that's the founder of this network, 13 years after GHOST, and he's still pushing the frontiers." | Beat 4 `[FACE]` CHANGED ("and he's still pushing the frontiers" for "still pushing the frontier") |
| 312.22 | "And before we take a look at those numbers, I have a very wonderful group of like-minded investors in my Discord." | Beat 5 `[FACE]` CHANGED, the plug rewritten on the take ("before we look at the numbers, I do have a wonderful crypto group of like-minded people...") |
| 318.72 | "And we have tons of software, and our software and our reach is hooked into everything." | Beat 5 `[FACE]` AD-LIB (not in the script) |
| 323.86 | "Like we just did 114x on PerpsPad. We get in on all these plays early." | Beat 5 `[FACE]` AD-LIB, the 114x stays with the showcase receipt (Mike 2026-11-04) |
| 328.98 | "Plus, we have tons of information and tons of software, swing trading software, you name it." | Beat 5 `[FACE]` AD-LIB (not in the script) |
| 334.48 | "Click the link in the description below." | Beat 5 `[FACE]` CHANGED ("below" added) · DROPPED "to get involved in the best community ever" |
| 336.12 | "But let's get on with this." | Beat 5 `[COVER]` AD-LIB, stays (Mike 2026-11-04); black picture, closes the plug |

### CH5 - WHERE IT STANDS (337.30-455.74) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 337.30 | "Now look at these numbers as they are." | Beat 1 `[COVER]` CHANGED ("Now look at these numbers" for "Now, let's look at the numbers") |
| 339.88 | "KAS trades around 3 cents, a market cap of around $860 million, around 85% below its all-time high of July 2024, and around $20 million a day in spot volume." | Beat 1 `[COVER]` CHANGED ("around 3 cents" for "around 3.1 cents"; "around $860 million" for "around 862 million dollars"); the spoken figures drive the on-screen figures (Mike 2026-11-04) |
| 352.68 | "Around 96.8% of all KAS is already mined, around 912 million left to go." | Beat 2 `[COVER]` KEPT · guard [!WARNING 5] HELD (not 97 percent) |
| 358.96 | "The November cut took the block reward from 2.06 to 1.94 KAS." | Beat 2 `[COVER]` KEPT · guard [!WARNING 5] HELD (past tense, no day-relative word) |
| 364.52 | "That's around 1.68 million KAS a day of new supply, and at these prices, well under 1% of what trades in a day." | Beat 2 `[COVER]` KEPT · guard [!WARNING 5] HELD (not "55,000 against 10 million") |
| 372.50 | "Hash rate around 368 petahash. It fell around 70% from May of 2025 to July of 2026, and then it rose 3 months in a row through 3 reward cuts and up 14%." | Beat 3 `[COVER]` CHANGED ("and up 14%" for "up around 14 percent") · guard [!WARNING 5] HELD (not "6 percent in 4 days", not 1,592 PH/s) |
| 386.74 | "User transactions flat, around 70,000 to 80,000 a day since July." | Beat 4 `[COVER]` KEPT |
| 392.14 | "And of those 460 tokens, the typical one has two holders, 9 of them have more than 100." | Beat 5 `[COVER]` KEPT · guard [!WARNING 5] HELD (not "only 8") |
| 397.92 | "The new Nacho, 355, and total value locked on the 2 L2s, around $770,000, so under a million." | Beat 5 `[COVER]` KEPT · guard [!WARNING 5] HELD (not 194, not 810,000) |
| 407.06 | "Yeah, so are we late or are we early?" | Beat 6 `[COVER]` KEPT ("Yeah," added) |
| 409.80 | "Look at Solana, July of 2021, $1.51. November of 2021, $259.90, around 172x in 10 months." | Beat 6 `[COVER]` CHANGED ("July of 2021" for "January of 2021", every decode agrees it is what he said; "in 10 months" for "in around 10 months"). Stays, RESOLVED by Mike 2026-11-04 |
| 422.00 | "Then it fell around 97% to $8 by December of 2022, and everybody wrote it off." | Beat 6 `[COVER]` KEPT · guard [!WARNING 6] HELD (the reason stays general) |
| 429.16 | "And from that low, around 37x to around $295 in January of 2025." | Beat 6 `[COVER]` KEPT |
| 436.06 | "Solana sits around a $55 billion market cap as I'm recording this." | Beat 6 `[COVER]` KEPT ("as I'm recording this" for "as I record this") |
| 440.26 | "I'm not saying that Kaspa does that, at least not anytime soon anyway." | Beat 6 `[COVER]` AD-LIB on the scripted line ("at least not anytime soon anyway" added) · guard [!WARNING 6] HELD (no "Kaspa will"; see Flags) |
| 444.34 | "I'm just saying what a written off network can do." | Beat 6 `[COVER]` CHANGED (for "I am saying that is what a written-off network CAN do.") |
| 448.00 | "The tools came first, the crowd has not arrived yet." | Beat 6 `[FACE]` KEPT, inspiring line 4 |
| 452.40 | "And that's exactly the gap where I want to be standing." | Beat 6 `[FACE]` CHANGED (for "And that gap, is exactly where I want to be standing.") |

### CH6 - THE CLOSE (455.74-528.37) · card ON "TEXT WALL" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 455.74 | "Here's where I stand, sound money, mined by anyone, owned by no one, and a base layer that just learned how to run app." | Beat 1 `[COVER]` CHANGED ("where I stand" for "where I land"; "run app" for "run apps", possibly an elision) |
| 464.70 | "And my long-term theory is that I think Ethereum eventually takes the number one spot from Bitcoin." | Beat 1 `[COVER]` CHANGED ("my long-term theory is that" for "here's my long-term theory.") |
| 470.98 | "And when it does, a lot of Bitcoin maxis are going to be looking for a proof of work home." | Beat 1 `[COVER]` CHANGED ("be looking" for "go looking") |
| 476.36 | "I think they find Kaspa, not all at once, sort of like a cascade over time. Some move over, and a year later, some more move over, and so on." | Beat 1 `[COVER]` CHANGED ("sort of like a cascade over time" for "A cascade:"; "and so on" added) |
| 486.94 | "And some of them could already be stacking it quietly." | Beat 1 `[COVER]` KEPT (no named people) |
| 490.26 | "You never know." | Beat 1 `[COVER]` AD-LIB, stays (Mike 2026-11-04) |
| 491.28 | "Kaspa didn't need a bull market to become real. It became real in the bear." | Beat 1 `[FACE]` KEPT, inspiring line 5 ("didn't" for "did not") |
| 496.42 | "And whatever comes next, this network is waiting for it." | Beat 1 `[FACE]` CHANGED ("waiting for it" for "ready for it"); stays, captions follow the words (Mike 2026-11-04) |
| 500.28 | "The Kaspa community itself is as dedicated as the XRP army. And I mean that in the highest compliment in this space. Hardcore, patient, and still here." | Beat 2 `[COVER]` CHANGED ("community itself"; "in the highest compliment" for "as the highest compliment") |
| 511.12 | "So if you want to be around people who stack with real conviction, click the link in the description below." | Beat 3 `[FACE]` CHANGED ("below" added) · DROPPED "to get involved in the best community ever" |
| 516.82 | "And not only that, drop a comment in the comment section, tell me what you think about Kaspa, give me your price targets for next year, and so on." | Beat 3 `[FACE]` CHANGED (for "Comment below, how bullish are you on Kaspa.") |
| 523.74 | "Make sure you click that like button." | Beat 3 `[FACE]` CHANGED ("Make sure you click" for "Click") |
| 525.74 | "My God, dude." | Beat 3 `[FACE]` AD-LIB, stays (Mike 2026-11-04) |
| 527.12 | "And subscribe!" | Beat 3 `[FACE]` CHANGED, the last word, ends 527.98 (for "and click the subscribe button") |
| 527.98 | (not said) | Beat 3 DROPPED: "and I'm gonna catch you guys, later." (RESOLVED by Mike 2026-11-04: no sign-off, the bed's hard stop lands on "subscribe") |

## Divergences from SCREENPLAY.md

- **Dropped:**
  - 292.90 the 9.5 percent line, "Here's the thing, it was around 9.5 percent funded in early November, so this one is on us." - RESOLVED (Mike's spoken instruction on the take; this also closes OPEN QUESTIONS 13 and 18).
  - 334.48 and 511.12 "to get involved in the best community ever", both times - RESOLVED by the take and GATE spine approval 2026-11-04.
  - 516.82 "Comment below, how bullish are you on Kaspa." replaced by the price-targets ask - RESOLVED by the take and GATE spine approval 2026-11-04.
  - 527.98 the sign-off "I'm gonna catch you guys, later." - RESOLVED by Mike 2026-11-04 (hard stop on "subscribe"; OPEN QUESTIONS 7 goes to the CTA close without the sign-off).
  - The name "Kaspa Dollar" is never spoken - RESOLVED by Mike 2026-11-04 (on-screen wording never names it either).
- **Added (ad-libs):**
  - 63.60 "El Cinco de Mayo!" - keep, RESOLVED by Mike 2026-11-04.
  - 133.08 "Bam. Doesn't that make it easy?" - keep, RESOLVED by Mike 2026-11-04.
  - 336.12 "But let's get on with this." - keep, RESOLVED by Mike 2026-11-04.
  - 490.26 "You never know." - keep, RESOLVED by Mike 2026-11-04.
  - 525.74 "My God, dude." - keep, RESOLVED by Mike 2026-11-04.
  - 318.72 to 333.68 the plug's software lines and "114x on PerpsPad" - keep, the 114x with the `cryptorich.vip/showcase` receipt, RESOLVED by Mike 2026-11-04.
  - 442.34 "at least not anytime soon anyway" - in the take, GATE spine approved 2026-11-04, no individual ruling in PROJECT-LOG. OPEN only if Mike wants to rule on it (see Flags).
  - 407.06 "Yeah," and the "And then," lead-ins at 251.92 and 267.90 - in the take, GATE spine approved.
- **Changed lines the edit must build to:**
  - 233.44 inspiring line 3 as spoken; 496.42 "waiting for it" - RESOLVED by Mike 2026-11-04 (captions follow the words, READY has no word).
  - 411.08 "July of 2021" - RESOLVED by Mike 2026-11-04 (no pickup, the spoken line stays, on-screen "$1.51" with no month).
  - 341.06 "around 3 cents" and 343.56 "around $860 million" - RESOLVED by Mike 2026-11-04 (the on-screen figures match what is said).
  - 287.00 "refunds if it misses" - RESOLVED, the pickup replaced "refunds if it passes" at the spine review.
- **Screenplay open questions the take decided (PROJECT-LOG 2026-11-04: "the take decides the open questions he did not answer in chat"):** the Solana parallel over Zcash / Monero (Q3); community wording A, reworded (Q4); CLIP-1 in, its set-up and resume both said (Q5); no DAG definition (Q20); no named people in the cascade (Q22); the transaction lines as scripted (Q16); the Nacho and Kasplex lines without the exploit wording (Q17).
- **Guards:** every `[!WARNING]` do-not-air claim HELD on the take. Box 1 (2.5 billion crossed, 600,000 addresses) HELD at 224.02. Box 2 (Kaspa hacked, miners check the tokens) HELD at 135.14 to 161.34. Box 3 (the internal-drama remark, the Binance futures delisting) HELD, neither said. Box 4 (a vProgs or DAGKnight date, the official "Kaspa stablecoin", 5,700 TPS) HELD at 246.96 to 267.18. Box 5 (the popular numbers) HELD at 166.28 and 352.68 to 406.60. Box 6 (Solana as a parallel, never a prediction) HELD at 409.80 to 447.82, with the 442.34 ad-lib flagged below.
- **Clip inserts (Convention 6):** CLIP-1 set-up line said -> KEPT at 302.18, the spine pauses after "next." and the resume is the FACE hold at 302.30 (the PROPOSED row, decided by the take). CLIP-2 HELD, no set-up line said, not inserted. CLIP-3 REJECTED, not inserted.

## Flags carried into the edit

**Fact-framing traps (the VO stays; the graphic must not copy it blindly)**

- 411.08 the VO says "July of 2021" for $1.51; the source is the January 2021 open, and July to November also contradicts "in 10 months" at 421.08. On-screen shows "$1.51" with NO month (Mike). The C22 chart's own date axis and any cursor hover on the $1.51 point will show January, so the capture and framing should keep that date from reading against the VO.
- 72.34 to 74.52 and 356.26 the VO's "28.7 billion" and "912 million" are KAS, never dollars; the JSON prints them with a dollar sign.
- 341.06 and 343.56 on-screen carries the spoken "around 3 cents" and "around $860 million", not the screenplay's 3.1 and 862 (Mike).
- 385.38 the VO says "and up 14%" with no "around"; DATA.md's figure is the July average to the October average, so the graphic labels it that way (C3), with "around" per persona.
- 391.50 "flat ... since July": DATA.md has August at 86,440 and September at 108,898 (spike days) above the spoken band; C4 must not imply every month sits inside 70,000 to 80,000 (OPEN QUESTIONS 16).
- 193.10 to 194.32 the VO says "after six months of testing the Sigma Prime audit"; the source has six months of testing AND a separate Sigma Prime audit. On-screen text keeps them as two things.
- 225.42 the VO says "closing in on 2.5 billion"; the screenplay's pop "2.4 BILLION TRANSACTIONS" and the live explorer counter sit beside it. Keep the pop true to the capture-day count and never "crossed".
- 324.60 "114x on PerpsPad" airs with the `cryptorich.vip/showcase` receipt, 2026 Top Performing Assets, PERPSPAD row highlighted (Mike), over the FACE hold or as a full-frame flash on the words.
- 267.90 on-screen wording never names Kaspa Dollar (Mike). The screenplay's C5 rung "JAN 1 2027 · KASPA DOLLAR CLOSES" and the real-pixel C11 receipt from kaspadollar.com both show the name, and C11's bar shows the funded percent the take no longer says; the cover plan must resolve both.
- 442.34 "at least not anytime soon anyway" sits inside the parallel-not-prediction guard: no "Kaspa will" is said, but it leaves a later date open. No graphic may turn it into a claim.
- 522.08 "give me your price targets for next year" is the viewer's ask, so no target appears on screen; "next year" is relative to the upload date, so no date graphic is added for it.
- 468.92 and 476.36 the cascade theory had no full accuracy pass (Mike's note): no named Bitcoin figures on screen; the "MY THEORY" framing stays on screen with the claim.
- 201.88 to 223.30 the Kasplex lines had no full accuracy pass (Mike's note): re-pull the live figures before they go on screen. Check the Igra bridge status (accuracy pass) before showing Igra as untroubled.

**Scripted on-screen text the take no longer supports (quote the spoken word instead)**

- 19.68 "YOU EARNED IT WITH A MACHINE": he says "from a machine".
- 32.10 scripted "all came online": he says "came all online".
- 233.44 the phrases "NO COMPANY OWNS THIS NETWORK / NOBODY HAD TO ASK PERMISSION / AND ALL OF IT SHIPPED" and the SHIPPED sparkle: he says "Nobody owns a network", "nobody asks for permission", "yet it all ships".
- 311.24 "STILL PUSHING THE FRONTIER": he says "frontiers".
- 312.22 "A WONDERFUL CRYPTO GROUP / LIKE-MINDED PEOPLE": he says "a very wonderful group of like-minded investors in my Discord".
- 499.28 "THIS NETWORK IS READY FOR IT" and the READY sparkle: no such word (Mike: captions never say READY). 495.64 the BEAR accent is cued from the audio.
- 511.12 onward "THE BEST COMMUNITY EVER", "COMMENT BELOW", "HOW BULLISH ARE YOU ON KASPA" are not spoken; the subscribe bar's second click lands on "subscribe" at 527.32, and the hard stop on it, not on "later".
- 455.67 to 455.74 the scripted 3.5 s silent text wall has no room on the spine: 455.62 "standing." runs straight into 455.74 "Here's" (a 120 ms gap by the JSON). As recorded the wall can only sit over the words or on a pause; decided at coverage, not here.

**Ambiguous audio / low-confidence words (no flag here has been checked by ear)**

- 292.30-293.14 JSON "And" (probability 0.03) has swallowed "September": never cue on it.
- 241.26-241.54 "live" is missing from the JSON; cue from the audio.
- 188.06, 194.80, 321.92 only the glossary-prompted decodes give Igra and "reach is"; the unprompted ones say Yggdrasil and "reaches". Confirm by ear (Mike's transcript-defect note).
- 234.08 "Nobody owns a network" (FACE window 5, captioned): the clipped decodes say "a", the whole-file re-decodes say "the". MED.
- 518.78 "comment section": the JSON says "comments" (probability 0.26), the transcriber's text says "comment". LOW; confirm by ear, and if he said "comments" this line's fix comes out.
- LOW, decodes disagree: 144.02 "flaw" (re-decodes "floor"), 296.48 "on a stage" (the pre-Enhance audio has no "a"), 468.92 "the number one spot" (re-decodes "a number one spot"), 327.74 "get in on" (re-decodes have no "on"), 111.70 "Covenant" (pre-Enhance "covenants"), 237.78 "ships" (one decode "shipped"), 108.40 "hard fork" (re-decodes "hot fork"; probability 0.17).
- LOW, kept verbatim, may be elision: 105.34 "what ship", 304.12 "not a ship feature", 464.30 "run app", 193.40 "testing the Sigma Prime audit".
- Other JSON words under probability 0.10, text unchanged: 79.94 "2013." (0.03), 136.38 "an" (0.06), 339.88 "KAS" (0.08), 366.60 "KAS" (0.01), 465.78 "theory" (0.09).

**Picture and cue boundaries, measured here**

- 302.18 CLIP-1 splice: measured on the final audio, the level falls under -50 dB at around 302.12, bottoms out at -72.7 dB at 302.165, and climbs back above -50 dB at around 302.21. So "next." has actually ended before the FACE picture starts at 302.133, and the first face frame sits inside the trough. The JSON's end for "next." (302.18) reads 47 ms past the window start, and its start for "That's" (302.30) reads around 90 ms late. Dry-run the splice against this trough at coverage.
- JSON word ends that overrun a FACE window's end: 3.44 "been" against 3.367, 104.22 "mined." against 104.200, 237.98 "ships." against 237.900, 500.08 "it." against 500.033. The face-to-cover cut-out should be checked against the audio on those four. JSON ends 31.44 "stopped." and 490.98 "know." both touch a window start (31.433, 490.967), the same check on the way in.
- First 3 FACE scenes (0.000-3.367, 19.433-26.633, 31.433-35.700) air as the superhero restyle swap clips (Mike). No F1 take is approved yet (PROJECT-LOG 2026-11-04); F2 and F3 wait on Mike seeing the look.

**Mike's recorded edit asks that ride on these timecodes**

- 63.60-64.38 "El Cinco de Mayo!": confetti, a Mexican hat, 1 to 2 s of Mexican music on the line.
- 448.00-451.60 "The tools came first, the crowd has not arrived yet": a LEFT then a RIGHT side panel, following his hands.
- 527.32-527.98 the close ends on "subscribe": no sign-off, the bed's hard stop lands there.
- FINAL render: voice +3 dB in the mix, spine untouched, peaks checked.

**`[VERIFY]` items from DATA.md still open at render (live-drift, snapshot 2026-11-03)**

- Transactions and addresses (224.02), token count (166.28, 392.14), holders, tokens above 100, and Nacho 355 (392.14 to 399.14).
- Price, market cap, percent from the high, volume (339.88 to 352.08); percent mined, left to mine, daily emission (352.68 to 372.06).
- Hash rate and the monthly averages (372.50 to 386.00), user transactions (386.74), TVL (400.50 to 406.60), Solana market cap (436.06).
- The Kaspa Dollar bar and goal (280.10), the three Kasplex DEXs (214.78).
- The Nacho October 30th opening still rests on @KASPAglobal (the January 31st deadline is primary).

**Runtime measured (measurement only)**

- Spine 8:48.37 (528.37 s, 1,360 words, last word ends 527.98), plus CLIP-1's 10.8 s = around 8:59.2, against the screenplay's 7:20 to 7:35 plan and the 8:00 ceiling.
- Per chapter, spoken against budget: CH1 37.84 s (36) · CH2 66.44 s (57) · CH3 133.84 s (105) · CH4 99.18 s (76 + the clip) · CH5 118.44 s (115) · CH6 72.63 s (62).
