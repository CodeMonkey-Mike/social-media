# quant - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence with 150 ms residual -> burst removal x2 -> desilence 600 ms / 600 ms, one definition for the whole video, 150 ms residual -> Adobe Enhance Speech remux). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Quotes are what was SAID, with only Whisper mishears corrected. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.f.enhanced.mp4` - 563.33s (9:23), 1920x1080, 30 fps (ffprobe: video stream 563.333 s, audio stream 563.328 s). LOCKED (GATE spine approved 2026-11-04 18:24).
- **Transcript (cue source):** `spine/ALL.f.enhanced.medium-words.json` (word-level, NOT hand-edited; byte-identical to `ALL.e.desilenced.medium-words.json`: it was transcribed on the pre-enhance audio, which has the same timeline). Human-review breakdown: `spine/ALL.f.enhanced.segments.txt`.
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: the defumble cuts) -> `ALL.b.blackout.mp4.cover.json` (a -> b: picture blacked on cover beats, no time shift) -> `ALL.c.desilenced.map.json` (b -> c: 112 keeps, 1010.97 s to 568.97 s per the map) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: two bursts removed, -0.400 s from output 85.967, -0.567 s from output 368.333) -> `ALL.e.desilenced.map.json` (d -> e: 10 cuts, -5.12 s, 568.454 s to 563.334 s) -> no map file for e -> f (`enhance_remux` swaps the audio only, same picture timeline). **Every timecode below is already a FINAL-spine coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced` -> `f.enhanced`.

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on the FINAL spine's picture (non-black = FACE, here = SCREEN-SHARE: webcam bottom-right, CTA box top-right, the deck area painted by the comp). Everything else is BLACK VIDEO and must be covered in the comp. Face 90.87 s = 16.1% / cover 472.46 s = 83.9%. Zero orphans: every window lands on a scripted `[FACE]` beat. The 10 scripted `[FACE]` lines sit in 9 windows, because CH1 Beats 1 and 2 run as one continuous window. Cap 12, not exceeded.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-31.767 | "So what is Quant? ... just break it all down. Right, so here's the short version. Quant is a London company founded in 2015 by a guy named Gilbert Verdian. And what they sell is not a new blockchain." | CH1 Beat 1 `[FACE]` (locked line) + CH1 Beat 2 `[FACE]` |
| 2 | 177.600-179.767 | "Now here's the thing with the real names." | CH2 Beat 6 `[FACE]` |
| 3 | 207.267-210.133 | "So who's actually using this? Let's start with the founder," | CH3 Beat 1 `[FACE]` |
| 4 | 282.800-294.900 | "On September 24th, 2026, after a competitive process, they picked bank to build over the new tokenized network. Look right here. The interoperability, orchestration and transaction management layer." | CH3 Beat 3 `[FACE]` |
| 5 | 352.533-361.100 | "And at the time of this recording it's trading at $199 for a market cap of $2.9 billion, which puts it at rank 34." | CH4 Beat 1 `[FACE]` |
| 6 | 400.400-406.200 | "All right, so now look at this. This is Quant's market cap as a share of the total crypto market cap going back to 2018." | CH5 Beat 2 `[FACE]` |
| 7 | 433.267-442.300 | "All right, so now the peers. So Chainlink, Hedera, XRP, Stellar, Canton, everything indexed to 100 on November 5th, 2025. You got Bitcoin in grey." | CH5 Beat 3 `[FACE]` |
| 8 | 461.767-474.133 | "And then in Bitcoin terms, on November 5th, 2025, one Quant bought you around 72,000 sats. And on November 4th, 2026, around 254,000 sats." | CH5 Beat 4 `[FACE]` |
| 9 | 537.967-544.167 | "But every one of those banks is an island, and right now, Quant is the one holding the contracts that connects them." | CH7 Beat 1 `[FACE]` |

Window edges against the word times, for the comp: window 3 ends at 210.133 on the tail of "founder," (word end 210.16), and "Gilbert" (210.52) is already on black. Window 6 opens at 400.400, while Whisper starts "All" at 400.26 (word probability 0.38, so the word time is soft). Window 9 ends at 544.167 and "them." ends at 544.28, while "And" starts the CTA at 544.30.

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied wherever the words reach the screen. This video has NO captions (Mike, 2026-11-04), so these matter for on-screen text, the YouTube metadata, the chapter names and any later vertical or short that adds captions. Marked "second read" = Whisper medium re-run on that window of the enhanced audio during this authoring, against the raw JSON. That is a machine re-read, not a human ear.

- Global: lowercase "quant" -> "Quant" at 0.98, 9.68, 55.26, 103.8, 375.92, 397.88, 401.98, 443.68, 457.62, 466.12, 490.42, 519.42, 541.82 (persona spelling).
- 27.94 "Veridian" -> "Verdian" (name; persona spelling).
- 92.08 "rolled gardens" -> "walled gardens" (Quant's own phrase, scripted; low confidence 0.25; the second read also hears "rolled", so this is a correction from the script and the context).
- 96.70 "will be" -> "would be" (0.43 in the JSON; second read: "would be"; segments.txt still reads "will").
- 182.02 "Core Banking, Treasury" -> "core banking, treasury" (common nouns in a list).
- 192.38 "Quant Net" -> "QuantNet" (product name).
- 194.08 "coordinated in the islands" -> "coordinating the islands".
- 197.16 "roll up" -> "rollup" (product term; the script calls it "their rollup", never "their chain").
- 198.02 "Mainnet sends" -> "mainnet since".
- 212.04 "cyber security" -> "cybersecurity".
- 222.62 "MasterCard" -> "Mastercard".
- 237.68 to 238.82 "Great British Tokenized Deposit Platform" -> "Great British Tokenised Deposit platform" (proper name, UK spelling as on the UK Finance receipt).
- 247.94 "Loy's" -> "Lloyds" (bank name).
- 272.32 / 381.96 / 421.36 / 509.82 "the clearing house" -> "The Clearing House" (organisation name).
- 279.74 "chips" -> "CHIPS" (the payment network, beside RTP).
- 306.82 "are trail" -> "a trail".
- 311.16 "Rosaline" -> "Rosalind" ("Project Rosalind", capital P).
- 317.32 "synchronization lab" -> "Synchronisation Lab" (proper name, UK spelling as on the Bank of England page).
- 322.60 "European Central Banks" -> "European Central Bank's".
- 325.06 "digital Euro" -> "digital euro".
- 329.68 "Densu Soken" -> "Dentsu Soken".
- 354.06 "is trading" -> "it's trading" (0.57; the second read also drops the "it").
- 367.54 "main net" -> "mainnet".
- 429.54 "three X" -> "3x".
- 436.48 "Styler" -> "Stellar" (peer name, $XLM).
- 442.06 "Bitcoin and Gray" -> "Bitcoin in grey".
- 466.12 "brought you" -> "bought you" (second read: "bought"; segments.txt still reads "brought").
- 475.90 "3.5 X" -> "3.5x".
- 496.40 "these sources own words" -> "each source's own words" (second read agrees).
- 498.70 "UK finance" -> "UK Finance".
- 512.38 "Verdean" -> "Verdian" (name; persona spelling).
- 523.08 "the bank's new blockchain" -> "the banks' new blockchain" (plural).
- 531.32 "rerate" -> "re-rate".
- 554.62 "We get in like" -> "We get in on like" (second read: "in on").
- 558.30 / 559.70 "114X on Perp's pad" -> "114x on PerpsPad" (persona `perpspad_spelling`).

NOT mishears, and left as spoken after the second read agreed with the JSON: 34.46 "that bank", 51.02 "for the rest of the world", 178.28 "the thing with the real names", 234.38 "we describe", 287.46 "picked bank to build over", 298.54 "Pictures of 25 islands", 336.34 "then supply", 445.80 "pop in 140", 453.62 "fell from 40 to 60%". See the Flags for each one that matters.

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE OPEN (0.00-54.02) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "So what is Quant?" | KEPT (locked `[SAY-EXACT]` `[FACE]`, opening words) |
| 1.82 | "This is something I've been recommended for quite some time, right?" | CHANGED (locked line: "right?" added, "that" dropped; Mike's own words) |
| 4.74 | "People from my community, people in my live streams, dropping comments saying I should buy some Quant." | CHANGED (locked line re-told: "Members of my community have told me about it, people have dropped comments...") |
| 9.94 | "And I always say, you know, it looks pretty good and so on, but there's so many tokens, I can't buy everything, but I wanna get into this and do a deep dive into this and just break it all down." | CHANGED (locked line re-told: "too many tokens to play" became "I can't buy everything"; "today" was not said, so the video carries no day-relative word here) |
| 20.60 | "Right, so here's the short version." | CHANGED ("Right, so" added) · `[FACE]` |
| 23.10 | "Quant is a London company founded in 2015 by a guy named Gilbert Verdian. And what they sell is not a new blockchain." | KEPT · `[FACE]` · guard [!WARNING founded in 2018] HELD |
| 31.82 | "It's a software layer that sits on top of the systems that bank already runs." | CHANGED ("that bank" for "a bank") |
| 35.92 | "And it connects them to the blockchains and the digital money networks that are out there." | KEPT (minor drift: "that are out there" for "out there") |
| 40.68 | "Their customers are banks, financial institutions, and capital markets." | KEPT |
| 44.92 | "And by the end of this, you're gonna know who exactly is using it, what the token does, and where it sits for the rest of the world." | CHANGED ("who exactly is using it" for "who is actually using it"; "for the rest of the world" for "against the rest of the market") |
| 52.24 | "So let's walk through all of this." | KEPT (handoff, the scripted first choice) |

### CH2 - ISLANDS OF MONEY (54.02-207.36) · card ON "Islands of Money" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 54.02 | "Now, to understand why Quant exists, think of every bank as an island." | KEPT · WB1 |
| 58.06 | "Each island has its own vault and its own ledger." | KEPT |
| 61.46 | "And the money on one island just can't walk over to the next one." | KEPT (minor drift: "just can't" for "cannot just") |
| 64.92 | "It goes on a boat, one payment, one leg at a time, and that boat can take days." | KEPT |
| 70.52 | "Now the banks are turning those deposits digital." | KEPT · WB2 |
| 73.16 | "A tokenized deposit is still your deposit at your bank, same protections, same regulator, it's just recorded differently." | KEPT |
| 80.50 | "And it can carry rules, like move when this happens, release when that happens." | KEPT (minor drift: "like" added) |
| 85.46 | "But here's the thing though, right now most of them only move inside the bank that issued them." | KEPT (minor drift: "But" added; the first burst join sits just before "But") |
| 90.00 | "Quant's own words for it, walled gardens." | KEPT |
| 93.14 | "Same islands, brand new fences." | KEPT |
| 95.58 | "So the obvious move would be to build one more island, one big chain, tell every bank, come and settle over here." | KEPT (minor drift: "and" dropped before "tell", "come and settle" for "come settle") · WB3 |
| 102.20 | "And that is exactly what Quant did not do." | KEPT (minor drift: "And" added) |
| 106.00 | "Quant is a layer that sits above the islands." | CHANGED ("a layer" for "the layer") |
| 108.50 | "The bank keeps its core systems, keeps its payment rails, keeps custody of the money." | KEPT |
| 113.24 | "Quant connects all of that through a set of APIs and orchestrates the movement." | CHANGED ("a set" for "one set") |
| 117.52 | "And it never holds the funds." | KEPT |
| 119.38 | "Now what does that look like for one payment?" | KEPT · WB4 |
| 121.76 | "Quant's own example, a manufacturer in London paying a supplier in Singapore." | KEPT |
| 126.98 | "Step one, lock." | KEPT |
| 128.72 | "The London bank locks the manufacturer's money the moment it accepts the instruction." | KEPT |
| 132.78 | "Step two, credit." | KEPT |
| 134.16 | "The Singapore bank credits the supplier right away against that lock." | KEPT |
| 138.70 | "Step three, settle." | KEPT |
| 140.56 | "The two banks settle with each other in the next window and the lock is released." | KEPT |
| 144.78 | "No new asset and the money never left the banking system." | KEPT |
| 148.58 | "It was a deposit at a regulated bank the whole way." | KEPT |
| 152.16 | "And the second trick is a synchronized settlement." | CHANGED ("a" added) · WB5 |
| 154.50 | "The old way settles each leg of the deal on its own." | KEPT (minor drift: "the deal" for "a deal") |
| 157.24 | "So one leg clears, the other one hasn't yet." | KEPT |
| 160.38 | "And for a moment, the whole deal sits in limbo." | KEPT |
| 162.64 | "With this layer, every bank involved reserves its funds first." | KEPT |
| 166.24 | "And then every leg commits together or none of them do." | KEPT |
| 169.44 | "And if that was a bit complex, I feel you bro." | AD-LIB ("I feel you bro" is not in the script) |
| 172.30 | "Feel free to double tap the left side of this video if you're on your phone to go back and watch it all over again." | CHANGED (the rewatch line: "watch it all over again" for "watch that again") |
| 177.62 | "Now here's the thing with the real names." | CHANGED ("the thing" for "the real thing") · `[FACE]` |
| 179.86 | "On the left, what a bank already runs, core banking, treasury, the payment rails." | KEPT · C1 |
| 184.62 | "In the middle, Quant." | KEPT |
| 186.06 | "Overledger is the API connector." | KEPT |
| 188.04 | "Quant Flow is where the bank writes the rules in their own payment language, PayScript." | KEPT (minor drift: "payment" for "payments") |
| 192.38 | "QuantNet is the orchestration layer coordinating the islands." | KEPT |
| 195.62 | "Quant Fusion is their rollup, live on mainnet since June 2nd, 2026, connected to 74 networks." | KEPT |
| 203.78 | "And on the right, the ledgers and the tokenized deposit platforms." | KEPT |

### CH3 - WHO USES IT (207.36-333.46) · card ON "Who Uses It" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 207.36 | "So who's actually using this?" | CHANGED ("So" for "Now,") · `[FACE]` |
| 209.02 | "Let's start with the founder, Gilbert Verdian." | CHANGED ("Let's start" for "Start"; the name now rides on this sentence, and the picture goes black between "founder," and "Gilbert") |
| 211.60 | "He's a cybersecurity guy with more than 20 years of it." | CHANGED ("He's ... with" for "Gilbert Verdian is ... ,") |
| 214.54 | "And he's been a security chief at that level." | KEPT |
| 216.68 | "He's worked inside the UK government at Downing Street and the Treasury and inside big financial names like Mastercard and HSBC." | KEPT (minor drift: "like" for a comma) · guard [!WARNING Mastercard] HELD (former employer only) |
| 224.32 | "Back in 2016, Quant says he helped set up the ISO committee that writes the blockchain standards." | KEPT · guard [!WARNING ISO WG7] HELD (attributed, no convenor claim) |
| 229.74 | "In October of 2026, he sat on a panel in London and this is how we describe what Quant does." | CHANGED ("we describe" for "he described"; heard the same on the second read, see Flags) |
| 235.92 | (clip insert CLIP-1 lands here; the set-up line ends "...and this is how we describe what Quant does.") | KEPT · INSERT CLIP-1 (10.8 s, the speaker's own voice; the splice is the trough after "does"; "does." ends 235.92, "GBTD," starts 236.46) |
| 236.46 | "GBTD, that's the Great British Tokenised Deposit platform." | KEPT (the resume line) |
| 240.46 | "Run by UK Finance and Quant built the infrastructure for it." | KEPT |
| 244.32 | "Seven banks are on it." | KEPT |
| 246.06 | "Barclays, HSBC, Lloyds, Monzo, Nationwide, NatWest and Santander." | KEPT |
| 252.16 | "And in September of 2026, it did its first live customer transactions." | KEPT |
| 256.90 | "Two of them were remortgages." | KEPT |
| 258.48 | "Picture it." | KEPT · WB6 |
| 259.04 | "Your deposit gets locked the day you sign, keeps earning interest the whole time and on completion day, it releases itself to the other side." | KEPT |
| 267.42 | "That's the padlock from the whiteboard on real money." | KEPT |
| 270.46 | "And then the big one, The Clearing House." | KEPT |
| 273.56 | "The US payments company owned by 25 of the largest US banks." | KEPT · guard [!WARNING TCH] HELD (the owners, never "picked by the 25") |
| 277.98 | "It runs RTP and CHIPS and clears more than $2 trillion a day." | KEPT · guard [!WARNING TCH] HELD (the rails, never "on Quant") |
| 282.90 | "On September 24th, 2026, after a competitive process, they picked bank to build over the new tokenized network." | CHANGED ("picked bank to build over the new tokenized network" for "picked Quant to build their new tokenised deposit network"; `[FACE]`; OPEN, see Divergences) · guard [!WARNING TCH] HELD |
| 289.74 | "Look right here." | KEPT · `[FACE]` |
| 291.08 | "The interoperability, orchestration and transaction management layer." | KEPT · `[FACE]` |
| 295.18 | "Expected to open to banks in the first half of 2027." | KEPT (minor drift: "banks" for "the banks") |
| 298.54 | "Pictures of 25 islands, each with its own digital deposits and one shared network between them, connected to the rails that banks already use." | CHANGED ("Pictures of" for "Picture the"; "that banks" for "those banks") · WB7 |
| 306.82 | "And around those two a trail of receipts." | KEPT |
| 309.74 | "Technology vendor on a Project Rosalind with the Bank of England and the BIS in 2023." | KEPT (minor drift: "a" added) |
| 314.66 | "One of 18 operators in the Bank of England Synchronisation Lab in 2026." | KEPT |
| 319.64 | "And that one is a test, no real money moves there." | KEPT |
| 322.60 | "A pioneer on a European Central Bank's digital euro platform in 2025." | KEPT (minor drift: "a" for "the") · guard [!WARNING European Commission] HELD |
| 327.34 | "Murex in March of 2026." | KEPT |
| 329.68 | "Dentsu Soken in Japan in January of 2026." | KEPT (the trim-first line was said) |

### CH4 - THE TOKEN (333.46-394.90) · card ON "The Token" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 333.46 | "Now the token." | KEPT |
| 334.86 | "Quant lives on Ethereum and then supply is fixed." | CHANGED ("Quant" for "QNT"; "then supply" for "the supply", ambiguous) · C3 |
| 337.82 | "Around 14.6 million tokens, almost all of it already circulating." | KEPT · guard [!WARNING supply] HELD (no 14.9 million, no 45.5 million) |
| 342.50 | "That's all there will ever be." | KEPT |
| 345.00 | "It sold to the public in 2018." | KEPT · guard [!WARNING ICO] HELD (no price, no raise) |
| 347.52 | "And the all time high was around $427 in September of 2021." | KEPT |
| 352.62 | "And at the time of this recording it's trading at $199 for a market cap of $2.9 billion, which puts it at rank 34." | CHANGED ("at" for each "around") · `[FACE]` · C4 |
| 361.26 | "So what does the token actually do?" | KEPT · WB8 |
| 363.58 | "The documented use is simple." | KEPT (the spoken "No." after it was removed at the spine review; the second burst join sits before "If") |
| 365.50 | "If you wanna use Overledger on mainnet, you pay a license fee." | KEPT · guard [!WARNING licence lock / staking] HELD |
| 369.56 | "And since December of 2021, that fee is payable in QNT." | KEPT · guard [!WARNING licence lock / staking] HELD |
| 373.34 | "The payment goes through a treasury contract to Quant." | KEPT |
| 376.48 | "No governance rights, a utility token, pure and simple." | KEPT |
| 379.70 | "And here's the thing, the bank deals, The Clearing House, the GBTD, those are software and service contracts." | KEPT (minor drift: "And" and "the GBTD") |
| 386.34 | "And nothing published says how much of that, if any flows through QNT." | KEPT · guard [!WARNING revenue] HELD (no revenue figure anywhere) |
| 390.90 | "So the open question for the token is whether the second pipe ever gets built." | KEPT (minor drift: "the second" for "that second") |

### CH5 - QUANT VS THE MARKET (394.90-494.56) · card ON "Quant vs The Market" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 394.90 | "Now the price alone tells you very little." | KEPT (minor drift: "the price" for "price") · WB9 |
| 396.96 | "So I wanna look at Quant the way the pros do, as ratios." | KEPT |
| 400.26 | (not said) | DROPPED: "First, Quant's slice of the entire crypto pie. Second, Quant against the tokens it usually gets compared with. And third, Quant priced in Bitcoin, because Bitcoin is the ruler everything else gets measured against." (WB9's cue words are gone, see Flags) |
| 400.26 | "All right, so now look at this." | CHANGED ("All right, so now" added) · `[FACE]` · C5 |
| 401.58 | "This is Quant's market cap as a share of the total crypto market cap going back to 2018." | CHANGED ("the total crypto market cap" for "the whole crypto market") · `[FACE]` |
| 406.34 | "The all time peak of that share was October of 2022 at 0.269% right in the middle of a bear market." | KEPT (minor drift: "a" for "the") · guard [!WARNING 0.155 percent] HELD |
| 413.26 | "Then it bled for about three years down to a band around 0.03 to 0.04%." | CHANGED ("about" added, a persona word; as spoken) |
| 419.06 | "And then in September of 2026, The Clearing House news, and the share goes from 0.028 to around 0.09% in 10 weeks, more than a 3x." | KEPT (minor drift: "in" and "a") |
| 430.34 | "And that's still only a third of where it was in 2022." | KEPT |
| 433.46 | "All right, so now the peers." | CHANGED ("All right, so now the peers" for "Now, against the peers") · `[FACE]` · C6 |
| 434.52 | "So Chainlink, Hedera, XRP, Stellar, Canton, everything indexed to 100 on November 5th, 2025." | KEPT (minor drift: "So" added, "and" dropped) · `[FACE]` |
| 441.02 | "You got Bitcoin in grey." | CHANGED ("You got" added) · `[FACE]` |
| 442.42 | "For 10 months, Quant didn't do anything special." | CHANGED ("didn't do anything special" for "did nothing special") |
| 445.14 | "A brief pop in 140 in December of 2025, then a slow drift down to 82 by the end of August, 2026." | CHANGED ("pop in 140" for "pop to 140") |
| 451.72 | "And this is all the while its peers fell from 40 to 60%." | CHANGED ("fell from 40 to 60%" for "fell 40 to 60 percent"; a fact-framing trap, see Flags) |
| 455.12 | "And then one line leaves the group." | KEPT |
| 456.66 | "A year later, Quant sits at 273." | KEPT · guard [!WARNING price target] HELD |
| 459.70 | "And every other line in this chart is below 100." | KEPT (minor drift: "in" for "on") |
| 461.90 | "And then in Bitcoin terms, on November 5th, 2025, one Quant bought you around 72,000 sats." | CHANGED ("one Quant" for "one QNT"; "And then" added) · `[FACE]` · C7 |
| 469.00 | "And on November 4th, 2026, around 254,000 sats." | KEPT · `[FACE]` |
| 474.28 | "That's around a 3.5x against Bitcoin in a year, while Bitcoin itself is down 23% in dollars." | CHANGED ("around" dropped before 23%) · guard [!WARNING ratio without dates] HELD (both dates said at 461.90 and 469.00) |
| 481.08 | "Zoom out though, and the all time high in Bitcoin terms was in October of 2022." | KEPT |
| 486.06 | "At around 1.17 million sats." | KEPT |
| 488.74 | "So even after this run, Quant sits at around 22% of its best level against Bitcoin." | KEPT (minor drift: "best level" for "best ever level") |

### CH6 - WHAT'S NEXT (494.56-518.42) · card ON "What's Next" · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 494.56 | "Now, what's next?" | KEPT · WB10 |
| 495.82 | "And I'll use each source's own words for where it stands." | KEPT |
| 498.70 | "In the UK, UK Finance says more pilots are coming, and the banks plan to issue digital debt instruments, basically bonds, with the coupons paid in tokenized deposits." | KEPT |
| 508.42 | "In the US, The Clearing House is building a network now, and Gilbert Verdian said on that same panel, it goes live in early 2027." | CHANGED ("a network" for "the network"; "in early 2027" for "early 2027") · guard [!WARNING TCH] HELD |
| 516.24 | "His words, his forecast." | KEPT |
| 518.14 | (not said) | DROPPED: "And the rest of their feed in late 2026, Sibos in Miami, the cross-border payments piece, is this same story, told from a stage." (WB10 scene 3 and the C17 news feed lose their words, see Flags) |

### CH7 - THE CLOSE (518.42-563.33) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 518.42 | "So here's my read on Quant after all of that." | KEPT (minor drift: word order) · WB11 |
| 521.16 | "Quant is not a coin trying to become the banks' new blockchain." | KEPT |
| 524.38 | "It's a layer the banks are actually letting into the building, live in the UK, with a date in the US." | KEPT (minor drift: "a layer" for "the layer") |
| 530.54 | "Can the token re-rate again if the US network opens on time?" | KEPT (minor drift: "the US network" for "that US network") · guard [!WARNING price target] HELD (conditional, no number) |
| 535.42 | "It can, but you know, nobody can promise you that." | CHANGED ("and I won't" dropped, "but you know" added) |
| 538.12 | "But every one of those banks is an island, and right now, Quant is the one holding the contracts that connects them." | CHANGED ("still" dropped; "that connects them" for "to connect them") · `[FACE]` (the landing line) |
| 544.30 | "And if you enjoyed this rundown, give this video a like, and hit that subscribe button if you're new here." | CHANGED (scripted CTA re-told: "If this helped, click that like button and click the subscribe button") |
| 549.46 | "And like I said, like I mentioned earlier on, I do have a community, it's a rock star community." | AD-LIB |
| 554.36 | "We get in on like a lot of these awesome gains, like really, really early." | AD-LIB |
| 557.62 | "We just did like 114x on PerpsPad like a month ago." | AD-LIB (a day-relative phrase and a figure not in DATA.md, see Flags) |
| 561.40 | "So click the link in the description below." | CHANGED ("to get involved in the best community ever" not said; this is the last word of the spine, "below." ends 563.16) |
| 563.16 | (not said) | DROPPED: "and comment below, which token should I deep dive next" and the sign-off "I'm gonna catch you guys, later." |

## Divergences from SCREENPLAY.md

The spine gate was approved 2026-11-04 18:24 with every line below on the take. PROJECT-LOG records no line-by-line ruling beyond the two rows marked RESOLVED, so everything else is OPEN for Mike's next gate. Nothing here is a proposal to cut.

- **RESOLVED by Mike 2026-11-04 (spine review):** the fragment after "release when that happens" and the spoken "No." after "The documented use is simple." were both removed as bursts. The silence definition is 600 ms / 600 ms for the whole video with 150 ms residual.
- **Dropped:**
  - 400.26 the three-ratio roadmap ("First, Quant's slice ... measured against."), flagged trim-first in the screenplay - OPEN.
  - 518.14 the Sibos sentence ("And the rest of their feed ... told from a stage.") - OPEN.
  - 535.42 "and I won't" - OPEN.
  - 563.16 the comment ask ("which token should I deep dive next"), "get involved in the best community ever" and the sign-off "I'm gonna catch you guys, later." - OPEN.
- **Changed, meaning-bearing:**
  - 282.90 "they picked bank to build over the new tokenized network" for "they picked Quant to build their new tokenised deposit network". This is the most significant change in the take: the company's name is missing from the sentence that announces the deal. It is a `[FACE]` beat, so it cannot sit under a cover. PROJECT-LOG holds it as Mike's call (leave it, or re-record the line). The spine was approved without a recorded ruling and without a pickup - OPEN.
  - 229.74 "this is how we describe what Quant does" for "he described" - OPEN.
  - 451.72 "fell from 40 to 60%" - OPEN.
  - 44.92 "where it sits for the rest of the world" for "against the rest of the market" - OPEN.
  - 0.00 to 20.42 the locked opening was re-told in Mike's own words, not read verbatim. The meaning is the same, and "deep dive" and the recommendation story are both there. Build to the take - OPEN only if Mike wants the scripted wording back.
- **Added (ad-libs):**
  - 169.44 "I feel you bro." - OPEN.
  - 549.46 to 561.06 the community pitch ("rock star community", "awesome gains", "114x on PerpsPad like a month ago") - OPEN.
  - Per the house rule these are content, recorded with their timecodes, with no trim guidance.
- **CTA vs hard-out (screenplay Open Question 7):** a CTA was recorded, in a different wording from the script, so the take does not end on "later." or on "them." The last word is "below." at 563.16. The hard-out at 544.28 stays possible on the picture and audio - OPEN.
- **Guards:** every `[!WARNING]` do-not-air claim HELD on the take:
  - Supply 14.9 / 45.5 million: HELD at 337.82.
  - ICO figures: HELD at 345.00.
  - Licence lock and staking: HELD at 365.50 to 373.34.
  - TCH "whole US payment system", "$2 trillion on Quant", "$560 trillion", "picked by the 25": HELD at 273.56 to 295.18 and 508.42.
  - Mastercard partnership, European Commission, Oracle, Quant Flow live, 150 use cases, Rosalind figures: HELD at 216.68 and 322.60, and the rest never said.
  - Revenue and price targets: HELD throughout, with 530.54 conditional.
  - The ratio without dates: HELD at 461.90 to 474.28.
  - Founded 2018 and ISO WG7: HELD at 23.10 and 224.32.
  - 0.155 percent: HELD at 406.34.
- **Clip inserts (Convention 6):**
  - CLIP-1 set-up line said (with "we describe" for "he described") -> KEPT at 235.92, the splice in the trough after "does" (235.92 to 236.46). The resume line "GBTD, that's..." was said as scripted. The screenplay gate was approved with the row as PROPOSED; the log carries no separate clip ruling - OPEN only as a confirmation.
  - CLIP-2 was REJECTED in the screenplay, so nothing lands.
  - CLIP-3 was HELD pending an official Oracle recording. Its conditional set-up line ("...here is how Gilbert Verdian describes the problem he saw.") was not said, so it has no landing point on this take -> DROPPED unless Mike re-places it.

## Flags carried into the edit

- 282.90 fact-framing trap: the VO says "they picked bank". C12 on the BODY must show TCH's own printed text naming Quant, and any on-screen line must read "picked Quant" and "tokenised deposit network", never the spoken wording. "they" reads 0.10 in the JSON, but "bank" (0.73) and the whole phrase came back the same on the second read of the enhanced audio.
- 229.74 ambiguous audio: "we describe" (0.55) with the same read twice. CLIP-1's burned caption must carry the attribution to Verdian on its own, because the set-up does not clearly hand off to "he".
- 451.72 fact-framing trap: the VO says "fell from 40 to 60%", which sounds like a rise. The C6 card must never print that wording. DATA.md's reading is "fell 40 to 60 percent", while its own month-end table at 2026-08-31 shows LINK 76, HBAR 43, XRP 61, XLM 65, CC 85, so a printed "40 to 60" would not match that date's lines. Let the lines carry it.
- 445.14 fact-framing trap: the VO says "pop in 140", the script says "to 140". DATA.md's month-end table shows QNT 131 at 2025-11-30 and 97 at 2025-12-31, so the 140 must be confirmed on the daily series before any marker prints it. Check at the C6 build.
- 352.62 fact-framing trap: the VO says "trading at $199", "$2.9 billion", "rank 34", all without "around". The C4 card carries the vendor and the read time: CoinGecko, 2026-11-04 12:08 UTC ($199.08, $2.90B, #34). It must never mix in CoinMarketCap's $2.396B or #37. The recording began 12:53 on the file's clock (`raw/2026-11-04 12-53-46.mkv`), and the log does not show a re-pull at record time.
- 406.34 to 430.34 fact-framing trap: 0.269, 0.028 and "around 0.09%" are CoinMarketCap-basis figures, so the spoken numbers lock C5 to "Source: CoinMarketCap". CoinGecko's 0.110% must not appear on that card. 0.028 is dated 2026-08-28, although the line opens "in September of 2026".
- 434.52 fact-framing trap: "everything indexed to 100 on November 5th, 2025", but Canton is indexed from its first CoinGecko day, 2025-11-10. The C6 card carries that note small.
- 334.86 / 461.90 fact-framing trap: the VO calls the token "Quant" where the script said "QNT". On-screen text for the token stays $QNT. Also 334.86 ambiguous audio: "then supply" (0.48), probably "the supply".
- 479.16 fact-framing trap: "down 23%" is said without "around" and is CoinGecko's -23.0% on the read date. C7 and C6 keep the dated figure.
- 508.42 fact-framing trap: "goes live in early 2027" is Verdian's forecast, attributed on the take. Anything on screen keeps it attributed, or uses TCH's "first half of 2027" (295.18). CLIP-1's window must still stop at 14:32 per DATA.md.
- 34.46 ambiguous audio: "that bank" (0.46), heard the same twice. 298.54 ambiguous audio: "Pictures of 25 islands", heard the same twice, probably aimed at "Picture the 25 islands". Neither needs anything on screen, and WB7's "25 islands" cue word is still there.
- 557.62 flag: "like a month ago" is a day-relative phrase (persona: dates absolute, upload date unknown), and "114x on PerpsPad" is a community-call figure with no DATA.md row (it is listed in persona `perpspad_spelling`). It is recorded as said, and Mike rules it. Not put on screen unless he asks.
- 413.26 flag: "about three years" breaks the persona's "around" rule on the take. As said; on-screen text uses "around".
- `[VERIFY]` items from DATA.md still open at render: the panel's month for CLIP-1's burned caption ("October 2026"; upload 2026-10-22); QNT price, cap, rank and circulating supply on C3 / C4; the C5 last point; C6 endpoints (273 / 76 / 42 / 58 / 60 / 73 / BTC 77); C7 (0.00254 BTC, 3.54x, around 22% of the ATH); BTC -23.0%; the UK Finance GBTD page and the Bank of England Lab page for changes; the /banks/ and /use-cases/ pages for C23 / C24 (the C23 handoff line was said, C24 lost its words with the Sibos sentence, see below).
- Cue-word losses for the coverage plan, measured from the take:
  - WB9 scenes 1 to 3 ("slice of the entire crypto pie", "compared with", "ruler") have no spoken words.
  - WB10 scene 3 ("told from a stage") has no spoken words.
  - C17 and C24, scripted right after WB10, have no line under them.
  - WB11's "connect" cue is now "connects" (543.68), and its scripted "contracts" cue stands at 542.84 to 543.32.
- Whiteboard spans on the take (first word to last word of the VO each beat is scripted on, measurement only):

| Beat | Span (s) | Length | Scripted |
|---|---|---|---|
| WB1 | 54.02-70.26 | 16.2 s | 25 to 30 s |
| WB2 | 70.52-95.30 | 24.8 s | 25 s |
| WB3 | 95.58-119.10 | 23.5 s | 25 to 30 s |
| WB4 | 119.38-151.84 | 32.5 s | 30 s |
| WB5 | 152.16-177.52 (with the rewatch line) | 25.4 s | 25 s |
| WB6 | 258.48-270.40 | 11.9 s | 25 s |
| WB7 | 298.54-306.54 | 8.0 s | 25 s |
| WB8 | 361.26-394.68 | 33.4 s | 25 to 30 s |
| WB9 | 394.90-400.26 | 5.4 s | 20 s |
| WB10 | 494.56-518.14 | 23.6 s | 25 to 30 s |
| WB11 | 518.42-544.28 (with the 6.2 s screen share) | 25.9 s | 20 to 25 s |

  Total 230.6 s = 40.9% of the 563.33 s spine, before CLIP-1 and the title-card pauses, against the 47 to 53 percent the coverage node holds in code and the scripted 290 s. WB6, WB7 and WB9 run under the contract's 15 s floor on their scripted words. This is a measurement for the coverage-strategist, not a proposal.
- Runtime measured: 9:23 (563.33 s) against the around 10:00 target (hard window 9:00 to 11:00), before CLIP-1 (10.8 s) and the card pauses (measurement only). 1,703 Whisper word tokens against the around 1,620 budget. By chapter against the script's budget: CH1 0:54 / ~1:05 · CH2 2:33 / ~2:55 · CH3 2:06 / ~2:00 · CH4 1:01 / ~1:05 · CH5 1:40 / ~1:55 · CH6 0:24 / ~0:40 · CH7 0:45 / ~0:50.
- Music: the MUSIC-MOOD-PLAN right-aligns Solstice's 10 s fade to "later." That word was not said. The last word on the take is "below." (563.16; the spine ends at 563.33). The landing line ends "them." at 544.28 if Mike takes the hard-out.
- Voice: `settings.voice_db = 3.0` still applies at the mix (PROJECT-LOG), and the enhanced track is what ships.
