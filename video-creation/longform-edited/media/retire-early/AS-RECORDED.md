# retire-early - AS-RECORDED (build the edit to THIS, not the plan)

_Shape: `skills/doc-reference/AS-RECORDED.reference.md`. Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py`. Written 2026-10-10 by the as-recorded author, after GATE SPINE was approved (thread longform-retire-early-b). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble, 69 spans -> cover-blackout, paint only -> coarse desilence 700 ms -> burst removal, 5 frame-exact cuts + the ARB-disclosure face repair -> two-zone desilence 300 ms intro / 600 ms body @36 s). No content cut ran (there is no `f` stage). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.e.desilenced.mp4` - 648.31 s (10:48.3), 1920x1080, 30 fps CFR (video stream 648.27 s, audio 648.31 s). LOCKED (GATE SPINE approved by Mike 2026-10-10 16:16).
- **Transcript (cue source):** `spine/ALL.e.desilenced.medium-words.json` (Whisper medium, 226 segments, 2,008 words, word-level, NOT hand-edited). Human-review breakdown: `spine/ALL.e.desilenced.segments.txt` (the transcriber's text-only corrections, restorations and flags).
- **Timecode chain:** `ALL.lowbps.mp4` (2,788.2 s, the compressed raw) -> `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 69 retake / fumble spans removed, 1,101.77 s; a = 1,686.43 s; `cuts.txt` is the same span list as text) -> `ALL.b.blackout.mp4.cover.json` (a -> b: paint only, 10 blackout spans, nothing cut, time-preserving) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms desilence, 142 silences, 1,021.86 s removed; c = 664.57 s by the map; the face picture at c 267.2-275.4 was restored from `a` at spine review, picture only, no time change) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: 5 cuts, 2.80 s: c >= 0.133 shifts -0.133 s, >= 369.200 shifts -1.567 s, >= 447.300 shifts -2.400 s, >= 536.433 shifts -2.600 s, >= 586.967 shifts -2.800 s; d = 662.53 s) -> `ALL.e.desilenced.map.json` (d -> e: two-zone final desilence, split 36 s, 300 / 600 ms, 23 trims of 0.30 to 0.72 s each, cumulative -14.36 s at the tail; e = 648.31 s). **Every timecode below is already a FINAL-spine (`e`) coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced` (FINAL).

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on the FINAL spine (non-black = FACE), measured by this author. Everything else is BLACK VIDEO and must be covered in the comp. **Face 178.90 s = 27.6 % / cover 469.37 s = 72.4 %** of the 648.27 s picture. Inside that face total, window 11 carries the CH6 screen share AS FILMED (588.27-648.27 = 60.00 s, 9.3 %; the cut from face to screen share measured at 588.267 by scene detection), so Mike's face proper is 118.90 s = 18.3 %. **Zero orphans:** the 15 FACE-tagged screenplay lines land as these 11 windows (the four locked opening lines merge into window 1; the CH2 verdict and the ARB disclosure ad-lib merge into window 5; the CH6 rule and the screen-share CTA merge into window 11), and every window lands on a scripted `[FACE]` beat.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-35.133 | "I want to talk about some of the altcoins that you can hold and stack so you can potentially retire early. ... This could be our last chance to make it rich because it could be very very difficult in the coming years." | CH1 Beat 1 `[FACE] HOLD` x4 (the locked opening) |
| 2 | 76.833-84.967 | "Employment is still 4.2% so paychecks still exist right now. So that's exactly the window you need to turn a paycheck into ownership." | CH1 Beat 2 `[FACE]` (the window line) |
| 3 | 169.867-176.367 | "So that's Arbitrum in one sentence. Rails that other people build on and a treasury that collects rent from them." | CH2 Beat 2 `[FACE]` |
| 4 | 196.633-198.267 | "The exemption has paid nobody yet." | CH2 Beat 4 `[FACE]` |
| 5 | 244.533-267.870 | "My verdict. My opinion. If tokenized stocks actually get these rails ... 92 million new unlocks per month." then "But I can say that I just bought some ARB for the first time. ... Do your own research." | CH2 Beat 5 `[FACE]` + the ARB disclosure ad-lib (FACE by Mike's spine-review ruling, 260.80-267.94) |
| 6 | 315.000-319.267 | "Nobody can print it. Nobody can freeze it. And nobody can change the schedule." | CH3 Beat 2 `[FACE]` |
| 7 | 361.700-371.733 | "My verdict? My opinion? If the world ends up needing more money ... And that is why it's my primary asset." | CH3 Beat 4 `[FACE]` |
| 8 | 415.433-420.533 | "Owning TAO, or staking into a subnet, is a claim on that production, not a wage from it." | CH4 Beat 2 `[FACE]` |
| 9 | 485.400-494.900 | "But my verdict, my opinion? If open networks end up producing a share of the world's AI, then TAO is the most direct way I know to own a share of that production." | CH4 Beat 5 `[FACE]` |
| 10 | 562.033-571.767 | "My verdict? My opinion? Well, if over a billion users end up holding and paying with Gram, it's the obvious distribution play of this list." | CH5 Beat 3 `[FACE]` |
| 11 | 582.900-648.267 | face 582.90-588.27: "Own things that keep producing when your job doesn't and do it now while you still have that paycheck." then the SCREEN SHARE as filmed 588.27-648.27: "And if you want to learn more about these tokens and others ... Code Monkey, Code Monkey, Code Monkey Mike." | CH6 Beat 2 `[FACE]` (the rule) + `[FACE] HOLD` (the CTA, screen share as filmed, Mike 2026-10-10) |

**Captions OFF:** 588.267-648.267 (RULED by Mike at GATE 3, 2026-10-10: the screen share ships as filmed and stays a FACE window for the cover track, but no captions sit over what he is showing; the face part of window 11, 582.900-588.267, keeps its captions). Read by build_project_captions.py.

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode (word start). The word-time JSON stays un-edited; this list is re-applied at caption build. Captions run over the FACE windows only (captions over the window-11 screen share are OFF, RULED by Mike at GATE 3, 2026-10-10: the Captions OFF line under FACE windows); a COVER-line correction still matters for any on-screen text, title or description.

- 57.00 "The entry level door" -> "it should be. The entry level door" (words dropped by the whole-file pass, restored by windowed medium and large-v3-turbo re-reads at 57.02-57.78; the JSON word "The" 57.00-57.98 swallows them).
- 75.26 "1-5 years" -> "1 to 5 years" (number format; the C37 receipt reads "1 to 5 years").
- 88.74 "Vlad Teno" -> "Vlad Tenev" (name; also the CLIP-2 burned caption).
- 97.80 "So for cryptos" -> "So four cryptos".
- 105.54 "Arbitrum First on this channel" -> "Arbitrum. First on this channel" (punctuation; "First" p=0.04, see Flags for a possible swallowed "time").
- 123.98 "off chain labs" -> "Offchain Labs" (company name).
- 137.96 "Why does this help" -> "Now why does this help" (dropped word restored at 137.96-138.30; the JSON word "Why" 137.96-138.48 swallows it).
- 146.80 and 207.04 "Robinhood chain" -> "Robinhood Chain" (product name, x2).
- 167.12 "developer guild" -> "Developer Guild" (proper name).
- 224.04 "the Dow earned" -> "the DAO earned"; 233.54 "the Dow's own income" -> "the DAO's own income".
- 268.26, 277.00, 302.64, 329.00 "Casper" -> "Kaspa"; 367.36 "Casper's" -> "Kaspa's" (persona `kaspa_spelling`: never Casper; 367.36 sits in FACE window 7, so it shows in captions).
- 343.04 "Soccata" -> "Toccata" (Kaspa's programmability layer; screenplay spelling).
- 350.74 "Vprogs" -> "vProgs" (persona spelling).
- 360.20 "TagNight" -> "DAGKnight" (KIP-2).
- 372.12, 397.32, 416.02, 432.08, 466.28, 491.38 "Tau" -> "TAO" (persona `tao_spelling`, x6; 416.02 and 491.38 sit in FACE windows 8 and 9, so they show in captions).
- 372.64 and 379.90 "Bintenzr" -> "Bittensor".
- 401.50 "In a way I'd put it" -> "The way I'd put it" ("In" p=0.32).
- 431.16 ".5 Tau" -> "0.5 TAO".
- 433.76 "$3,600 a day" -> "3,600 a day" (the amount is TAO, no dollars were spoken; the "$" must never reach a caption or a graphic).
- 445.60 "Steve's keynote" -> "Steeves' keynote" (Jacob Steeves).
- 499.62 "the open network" -> "The Open Network"; 502.44, 532.80, 549.80 "Ton" -> "TON" (549.80 p=0.09).
- 524.78 "Doroff's count" -> "Durov's count" (Pavel Durov).
- 551.58 "Scale not to close" -> "Scale not disclosed".
- 77.02 "Employment" -> "Unemployment" (NOT a Whisper mishear: the spoken slip, three reads agree. RULED by Mike at GATE 3, 2026-10-10: the CAPTION reads Unemployment, the BLS figure being the unemployment rate. The only occurrence inside a caption window; the word at 54.52 is on a cover line.)
- 77.58 "still 4" -> "still 4.2%" (caption grouping only: Whisper writes the spoken 4.2% as three tokens, 4 / .2 / %, and the 2-word grouping splits them across two caption groups, so the whole number goes in this group; orchestrator, GATE 3 build prep, 2026-10-10.)
- 78.26 "2% so" -> "so" (the rest of the split 4.2%, now in the group above.)

Check by ear before any caption or on-screen use (likely mishears, NOT yet applied):

- 41.56 "Companies blame AI" (probably "blamed").
- 49.66 "and the jobs most exposed to AI" (probably "in the jobs").
- 94.26 "the AI company." (possibly "companies"; it is the CLIP-2 set-up's last word, and the splice trough does not move either way).
- 280.40 "Mine into existence." (p=0.45, probably "Mined").
- 372.12 "TAO on Bittensor." ("on" vs "and" uncertain; the script had "TAO, Bittensor.").
- 406.04 "So why did this help" (possibly "does").
- 520.98 "Why does it help jobs go away?" (possibly a swallowed "when").
- 607.86 "Lab" -> probably the ticker "LAB" (large-v3-turbo writes LAB; confirm the token; screen share).
- 626.56 "swing training software" -> probably "swing trading software" (three reads say "training"; screen share).
- 643.78 "Code Monkey, Code Monkey, Code Monkey Mike." (the sign-off as heard; "Code" p=0.27 on the first; confirm the spelling).

NOT mishears (three reads agree, the VO stays as said; RULED by Mike at GATE 3, 2026-10-10, see Flags): 77.02 "Employment" (script "Unemployment"; the caption carries Unemployment, the correction line above) · 183.70 "NBC" (script "CNBC") · 200.38 "debt security" (script "debt securities") · 413.66 "nobody owns" (script "somebody owns") · 451.62 "20 to 35 million" (script and DATA.md "28 to 35").

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - WHY YOU NEED TO OWN ASSETS (0.00-105.02) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "I want to talk about some of the altcoins that you can hold and stack so you can potentially retire early." | KEPT (locked `[SAY-EXACT]` `[FACE] HOLD`; drift: "some of the altcoins that you can" for "some of the best altcoins you can", "so you can" for "so that you could") · guard [!WARNING 1] HELD: "retire early" is Mike's own locked GATE 1 wording, hedged with "potentially", not a promise |
| 5.26 | "If you watched my previous video then you'll know that there is an enormous amount of jobs that will very very soon become obsolete." | KEPT (locked; drift: "watched", "then you'll know that there is"). R1 flash cue: "previous video" 5.94-6.54 |
| 12.70 | "It'll be very difficult for anyone to get a paycheck regardless of skill level." | KEPT (locked, verbatim) |
| 17.36 | "But with that said, I do believe that we are about to have an enormous economic explosion and likewise a crypto run up that we have never experienced throughout all of history." | KEPT (locked; drift: "an enormous" for "the most enormous", "never" for "ever", "all of history" for "all of human history"). Bed A landing words: "enormous economic explosion" 20.52-22.70 |
| 27.50 | "But you see where I'm going here." | KEPT (locked, verbatim) |
| 29.00 | "This could be our last chance to make it rich because it could be very very difficult in the coming years." | KEPT (locked; drift: "actually" not said, "could" for "might"). FACE window 1 ends 35.13 |
| 35.38 | "Wages are what the AI takeover takes away." | KEPT (locked `[SAY-EXACT]` `[COVER]`, verbatim; the H0 card cue on "Wages") |
| 37.94 | "Ownership is what's left standing." | KEPT (verbatim) |
| 39.68 | "So this video is about what to own." | KEPT (verbatim) |
| 41.56 | "Companies blame AI for 120,000 announced job cuts in the first 9 months of 2026, which was the number one stated reason." | CHANGED ("about" not said, so the VO number is a flat "120,000"; "which was" added) · guard [!WARNING 2] HELD (employer-cited announced cuts, never "AI killed") |
| 49.66 | "For 22 to 25 year olds and the jobs most exposed to AI, employment is about 19% below where it should be. The entry level door is closing first." | KEPT ("and the jobs" is probably Whisper for "in the jobs"; "it should be." restored) |
| 60.48 | "And the share of what this economy produces that goes to workers as wages is 52.8%, the lowest ever recorded, going back to 1947." | KEPT (verbatim) |
| 70.34 | "The people building the models put half of all entry level white collar jobs 1 to 5 years out." | KEPT (the Amodei line, said; the trim-first note never applied) · guard [!WARNING 2] HELD (the essay line, no "10 to 20 percent") |
| 77.02 | "Employment is still 4.2% so paychecks still exist right now. So that's exactly the window you need to turn a paycheck into ownership." | CHANGED (`[FACE]`; "Employment" heard on three reads, p=1.00, for "Unemployment": a fact-framing trap, see Flags; "mostly" not said; "you need" for "you have"; two sentences). Punch-in cue "exactly the window" 82.02-82.82 · guard [!WARNING 2] HELD |
| 84.94 | "And it's not just a crypto guy saying this." | KEPT (verbatim) |
| 87.54 | "Robinhood CEO Vlad Tenev said on CNBC in August when he was asked why regular people are shut out of the AI company." | CHANGED ("Robinhood CEO" for "Robinhood's CEO,", "said" for "said it", "the AI company" for "the AI companies") · guard [!WARNING 4] HELD (no "coming to America" on his lips) |
| 94.66 | (clip insert CLIP-2 lands here; the set-up line ends "...why regular people are shut out of the AI company.") | KEPT · INSERT CLIP-2 (12.4 s, the speaker's own voice; the splice is the trough after "company", measured at 94.67-94.68, -54 to -63 dB, only 20 ms wide before "That's" at 94.70) |
| 94.74 | "That's a brokerage CEO's opinion and it's mine too." | KEPT (the resume line, verbatim) |
| 97.80 | "So four cryptos and for each one the same question, why does owning this help you when the jobs go away?" | KEPT (the N2 four-slot cue) |
| 103.72 | "So let's get into all of this." | CHANGED ("get into all of this" for "dive into all this"; OPEN QUESTIONS 5 answered by the take) |

### CH2 - ARBITRUM (105.08-267.79) · card ON "ARBITRUM" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 105.08 | "Arbitrum. First on this channel, so let's start from zero." | CHANGED ("First on this channel" for "First time on this channel"; "First" low confidence). Card-pause trough measured at 104.99-105.00 (-84 dB) |
| 108.74 | "Ethereum is the big smart contract blockchain, slow and expensive when it's busy." | KEPT (verbatim) |
| 113.52 | "Arbitrum is the second layer on top of it and it runs the transactions on its own chain, bundles them and posts a compressed result back to Ethereum which settles it." | KEPT (drift: "the second layer", "bundles them", "a compressed result") |
| 123.52 | "Built by Offchain Labs, a team out of Princeton, live since August of 2021." | KEPT (verbatim) |
| 129.10 | "Anybody can take Arbitrum's technology and launch their own chain with it." | KEPT (verbatim) |
| 132.68 | "And the token ARB is a vote. The holders govern a treasury that collects what the ecosystem earns." | KEPT · guard [!WARNING 4] HELD (a treasury the holders govern, nothing distributed) |
| 137.96 | "Now why does this help when jobs go away?" | KEPT (drift: "this" for "that", "jobs" for "the jobs"; "Now" restored) |
| 140.20 | "When stocks get tokenized, they have to trade and settle somewhere and whoever owns the rails charges rent." | KEPT (verbatim) |
| 146.80 | "Robinhood built its own blockchain, Robinhood Chain on Arbitrum's technology." | KEPT · guard [!WARNING 4] HELD ("on Arbitrum's technology", never "settles on Arbitrum") |
| 151.14 | "Live since July 1st, 2026 with tokenized US stocks trading 24-7 in more than 120 countries. Not in the US yet." | KEPT (verbatim) |
| 160.24 | "That chain pays 10% of its net revenue to Arbitrum's ecosystem. 8 points into the treasury ARB holders vote on. 2 to the Developer Guild. Robinhood keeps the other 90." | CHANGED (the lead-in "And the deal:" not said; "Arbitrum's ecosystem" for "the Arbitrum ecosystem") · guard [!WARNING 4] HELD |
| 169.86 | "So that's Arbitrum in one sentence. Rails that other people build on and a treasury that collects rent from them." | KEPT (`[FACE]`; drift "Rails" for "the rails"). Punch-in cue "rent" at 175.74 |
| 176.46 | "Then on September 17th, 2026, the SEC opened a door in the US and the chairman Paul Atkins explained it on NBC." | CHANGED ("a door" for "the door"; "NBC" heard on three reads for "CNBC", see Flags) · guard [!WARNING 4] HELD (no "legalized") |
| 184.12 | (clip insert CLIP-3 lands here; the set-up line ends "...the chairman Paul Atkins explained it on NBC.") | KEPT · INSERT CLIP-3 (9.4 s, the speaker's own voice; the splice is the trough after "NBC", measured at 184.13-184.14, -72 / -58 dB) |
| 184.40 | "A sandbox for 5 years. Tokenized US stocks can trade on a public blockchain. If the token carries a real share's rights, participants are permissioned and the volume is capped." | KEPT (the resume line; the C5 rows reveal on it) |
| 195.20 | "But a few caveats." | KEPT (Mike's GATE 1 wording, verbatim) |
| 196.76 | "The exemption has paid nobody yet." | KEPT (`[FACE]`, verbatim) |
| 198.30 | "Robinhood's current stock tokens are debt security. Their own wording. Not a real share. So as they stand, they don't qualify. And there's no US date." | KEPT (drift: "debt security" singular on three reads, "a real share" for "the real share") · guard [!WARNING 4] HELD ("no US date", never 2027) |
| 207.04 | "Robinhood Chain's fees peaked September 4th at about 6 million dollars a day. And as I'm recording this, they're about 99% below that. And the peak was mostly meme coins." | KEPT · guard [!WARNING 3] HELD (99 percent with "as I'm recording this", never 97) |
| 217.46 | "ARB is still unlocking. About 92 million tokens a month into early 2027." | KEPT · guard [!WARNING 3] HELD (92 million, "into early 2027", no hard last date) |
| 222.02 | "The foundation spends more than the DAO earned. And ARB pays you nothing directly. It's a vote on the treasury." | KEPT (drift: "earned" for "earns", "the treasury" for "a treasury") · guard [!WARNING 3] HELD (no "asked for 230 million") |
| 227.44 | "So the one number. Market cap. As I'm recording this, about 1.2 billion dollars against the DAO's own income. Annualized. That's about 99 times." | KEPT |
| 236.54 | "Counted otherwise, it's 65 to 150 times what the chain and its licenses earn a year. Computed from their own numbers." | KEPT · guard [!WARNING 3] HELD (the computed range, never the reference's 100x) |
| 244.68 | "My verdict. My opinion. If tokenized stocks actually get these rails in the next couple of years and the rent actually lands in the treasury, then these prices are going to look cheap in hindsight. And if they don't, then you're holding a vote and 92 million new unlocks per month." | CHANGED (`[FACE]`; "actually get these rails" for "actually move onto these rails", "then these prices are going to look cheap" for "this could look cheap", "92 million new unlocks per month" for "92 million new tokens a month") · guard [!WARNING 1] HELD (conditional "if ... then", opinion-framed, no number, no target; the modal is firmer than scripted, see Flags) |
| 260.80 | "But I can say that I just bought some ARB for the first time. So you know where I stand. Never financial advice. Do your own research." | AD-LIB (not in the script; FACE by Mike's spine-review ruling 2026-10-10, RESOLVED; it voids the screenplay note "Mike does not say he holds ARB") |

### CH3 - KASPA (267.93-371.80) · card ON "KASPA" (BEFORE the spoken Kaspa: true onset 267.93 by RMS; Whisper starts the word at 268.26, inside it, and the card had snapped into the closure of its p; Mike, draft note 2026-10-11) · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 268.26 | "Kaspa. My primary asset. And you know that if you've been here for a while. So I'm only answering one question. Why does it fit in the world where AI takes the job?" | CHANGED (drift: "for a while", "fit in the world" for "fit a world", "the job" for "the jobs"). Card-pause gap before it 267.94-268.26 |
| 277.00 | "Kaspa is a proof of work money. Like Bitcoin. Mine into existence. No pre-mine. No insider allocation. No pre-sale." | KEPT (drift "a proof of work money"; "Mine" probably "Mined") |
| 284.56 | "It was launched in November of 2021 and the research company behind it dissolved around the token launch. There is no company behind this coin." | KEPT (drift "the token launch" for "the launch") |
| 292.10 | "Here's why it matters now. In an AI world, the companies that run the models can be told what to do. So can the bank. So can any coin that a foundation controls. Every one of them has a gatekeeper." | KEPT (drift: "it" for "that", "the bank" for "the banks") |
| 302.64 | "Kaspa doesn't. The supply comes only from mining on a formula that's been published since 2022. The code is open and the full node runs on a home server." | CHANGED (the Umbrel clause "Umbrel ships it as a one-click app" not said) · guard [!WARNING 5] HELD (no node spec, no Raspberry Pi) |
| 311.22 | "Anybody can run it. Anybody can mine it. And there's nobody to call." | KEPT (verbatim) |
| 315.30 | "Nobody can print it. Nobody can freeze it. And nobody can change the schedule." | KEPT (`[FACE]`, verbatim; OPEN QUESTIONS 4 answered by the take: the landing stayed on the face). Punch-in cue "nobody can change" 318.10-318.78 |
| 319.32 | "That's the architecture argument. Who can run it and who can't stop it. And it's really the only decentralization argument I care about." | KEPT (drift "really") |
| 325.82 | "Then the speed. Since May 5th, 2025, Kaspa runs 10 blocks a second. A block every 100 milliseconds." | KEPT ("runs" for "does") · guard [!WARNING 5] HELD (the block rate only, no TPS) |
| 333.00 | "That's settlement at machine speed, which is what you want when the things that start paying each other are software." | KEPT (drift "that start") |
| 338.84 | "And since June 30th, 2026, the programmability layer, Toccata, is live on mainnet. So the chain can verify zero-knowledge proofs and carry application state." | KEPT (verbatim) |
| 349.42 | "The app layer on top of it, vProgs, is under construction. I've covered that in depth already, so one sentence is all it gets here." | KEPT · guard [!WARNING 5] HELD ("under construction", no "within the next year") |
| 356.00 | "But here's the thing. The apps aren't live yet. The tooling is early. DAGKnight is still a proposed protocol." | AD-LIB (a short version of the caveats beat Mike removed at GATE 1; kept on the approved spine, RESOLVED) · guard [!WARNING 5] HELD (DAGKnight "proposed", no date) |
| 361.90 | "My verdict? My opinion? If the world ends up needing more money that no company or no model can touch, Kaspa's the cleanest version of that I know of. And that is why it's my primary asset." | KEPT (`[FACE]`; drift: "more money", "no company or no model", "And that is why") |

### CH4 - TAO (371.80-495.00) · card ON "TAO" (at 371.80, the one silent instant before the spoken TAO, onset 371.84; Whisper starts the word at 372.12; RULED by Mike at GATE 3, 2026-10-10) · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 372.12 | "TAO on Bittensor. The last one was money nobody controls. This one is owning the piece of the AI production itself instead of being replaced by it." | CHANGED ("TAO on Bittensor" for "TAO, Bittensor", "on" uncertain; "the piece" for "a piece"). Card-pause gap before it 371.88-372.12 |
| 379.90 | "Bittensor is an open network of markets. They call themselves subnets. And each subnet produces one digital commodity. Compute, inference, storage, prediction." | CHANGED ("They call themselves subnets" for "they call them subnets") |
| 389.44 | "Miners produce the thing, validators score the miners, stakers back the validators, and the subnet owner designs the rules. Everybody gets paid in TAO." | CHANGED (the lead-in "Inside a subnet," not said) |
| 397.52 | "The founder, Jacob Steeves, calls the goal a market for intelligence." | KEPT (verbatim; the HELD CLIP-5 would land after it, the line ends 401.32) |
| 401.50 | "The way I'd put it, Bitcoin's incentive model pointed at AI work instead of hashing." | KEPT (verbatim) |
| 406.04 | "So why did this help when jobs go away? The labor that AI replaces was paid in wages." | KEPT (drift: "So why did this help when jobs go away", "The labor that AI replaces") |
| 410.54 | "The AI itself produced by compute, models, and data that nobody owns and gets paid for." | CHANGED ("nobody owns" heard on three reads for "somebody owns", which inverts the argument; "is" not heard). See Flags, RULED: the VO stays as said, the diagram stays neutral |
| 415.66 | "Owning TAO, or staking into a subnet, is a claim on that production, not a wage from it." | KEPT (`[FACE]`; "staking into" for "staking it to"). Punch-in cue "claim" at 418.60 |
| 420.70 | "And the supply is Bitcoin's, a 21 million cap, mined from day one. The foundation calls it a fair launch and the first halving has already happened in December of 2025." | KEPT · guard [!WARNING 6] HELD (attributed to the foundation; "December of 2025", no day) |
| 431.16 | "It's 0.5 TAO a block now, about 3,600 a day, and about 54% of the cap is out." | KEPT (the retake that survived spine review; the abandoned "about fifty-four" was cut there) |
| 437.42 | "Who's actually building there? There's a hard cap of 128 subnets. And when it's full, a new one pushes out the weakest." | KEPT · guard [!WARNING 6] HELD (128 as the cap) |
| 444.68 | "As reported from Steeves' keynote at the end of September, about two dozen subnets are pulling in real outside revenue, roughly 20 to 35 million dollars a year between them." | CHANGED ("20" heard on three reads for "28", see Flags) · guard [!WARNING 6] HELD ("as reported", "roughly", a range) |
| 454.12 | "GPU rental and inference at the top. And a couple of them reportedly earn more from customers than they get in emissions." | KEPT (verbatim) |
| 461.28 | (not said) | DROPPED: the lead-in "Here's the thing." |
| 461.28 | "28 to 35 million of customer money against about 1.3 million new TAO a year, which is about 360 million dollars at the price that I'm recording this. So the network still pays out mostly new coins." | KEPT (drift: "at the price that I'm recording this", "pays out mostly new coins") |
| 473.66 | "Subnet quality is uneven by design. Control still sits with a few people, the founder included. But his handover is targeted at December of 2027." | KEPT (drift: "But his handover is targeted at" for "and his own handover target is") |
| 482.30 | "So there is still some room to grow. And some things to mature." | AD-LIB (not in the script; kept on the approved spine, RESOLVED) |
| 485.50 | (not said) | DROPPED: "And the competition is the centralized labs, which he says himself." |
| 485.90 | "But my verdict, my opinion? If open networks end up producing a share of the world's AI, then TAO is the most direct way I know to own a share of that production." | CHANGED (`[FACE]`; "a share" for "a real share", "own a share of that production" for "own a slice of that production"; the tail "and if they don't, you're holding an expensive experiment" DROPPED) · guard [!WARNING 1] HELD (conditional, no number) |

### CH5 - TON (495.18-571.92) · card ON "TON" (RULED by Mike at GATE 3, 2026-10-10; not "TON (GRAM)", he names Gram in the next breath) · Bed E

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 495.18 | "Toncoin, which in June of 2026 is officially called Gram." | KEPT ("in June" for "since June") · guard [!WARNING 7] HELD (the Gram correction in the same breath). Card-pause gap before it 495.00-495.18 |
| 499.62 | "The chain is still The Open Network, T-O-N, TON, and it's the blockchain that Telegram's crypto runs on." | CHANGED (the spelled-out "T-O-N" ad-libbed) |
| 505.70 | "Quick history. Telegram designed it in 2018. The SEC shut down the sale in 2020. The community rebuilt it as Toncoin." | KEPT (drift "shut down the sale") |
| 513.50 | "And since May of 2026, Telegram itself is back as a driving force and the biggest validator on the network." | KEPT ("a driving force" for "the driving force") |
| 520.98 | "Why does it help jobs go away? Distribution." | KEPT (drift: "when the" not heard) |
| 523.48 | "Telegram has, by Durov's count in March of 2025, significantly over a billion monthly users." | KEPT ("Durov's count" for "Durov's own count", "a billion" for "1 billion") · guard [!WARNING 7] HELD (the dated count, never present tense alone) |
| 530.00 | "Every crypto mini app inside Telegram has to run on TON since January of 2025." | KEPT · guard [!WARNING 7] HELD (January 2025, never September 2024) |
| 534.64 | "A built-in Gram wallet has been rolling out to the user base since the end of August. And USDT settles on it, about 750 million dollars of it." | KEPT ("the user base" for "that user base") |
| 542.82 | "Then Telegram's own AI compute network, Cocoon, live since November of 2025, pays GPU owners in TON for running AI requests." | KEPT (verbatim; the HELD CLIP-4 would land after it, the line ends 551.36) |
| 551.58 | "Scale not disclosed." | CHANGED ("so I'm not making one up" not said) · guard [!WARNING 7] HELD (no Cocoon scale figure) |
| 552.64 | "If AI agents and bots become the way people transact, the chain wired into a platform with over a billion users has a distribution advantage nothing else on this list has." | KEPT (verbatim) |
| 562.24 | "My verdict? My opinion? Well, if over a billion users end up holding and paying with Gram, it's the obvious distribution play of this list." | CHANGED (`[FACE]`; "if over a billion users" for "if even a few percent of Telegram's billion users", "it's the obvious distribution play" for "this is the distribution play"; the tail "and if Telegram stumbles, the coin stumbles with it" DROPPED) · guard [!WARNING 1] HELD (conditional, no number) |

### CH6 - THE CLOSE (571.98-648.31) · card OFF · Bed E continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 571.98 | "So that's the list. Rails that charge rent, money nobody controls, a piece of the AI production and distribution to a billion people. Four different bets on the same idea." | KEPT (verbatim) |
| 583.20 | "Own things that keep producing when your job doesn't and do it now while you still have that paycheck." | CHANGED (`[FACE]`; "do it now while you still have that paycheck" for "do it while the paycheck is still coming in") |
| 588.44 | "And if you want to learn more about these tokens and others, join a community of like-minded people. We get in on a lot of these awesome plays, not only the big caps and some of the more well-known ones, but we do find a lot of them very, very early." | AD-LIB (the SCREEN SHARE as filmed from 588.27, Mike's ruling 2026-10-10, RESOLVED) |
| 603.16 | "Like imagine joining the group and you put 1,000 dollars on a token like Lab, like in December of last year, you wait six months and you turn it to 350,000 dollars." | AD-LIB (screen share; an unsourced return anecdote, see Flags) |
| 614.64 | "These are some of the things we got going on in my group. It's good for good plays. It's good for learning more. It's good for communicating with like-minded people. And taking a few courses, using some software, using some swing training software. So we got it going on pretty good in this group." | AD-LIB (screen share; "swing training" probably "swing trading") |
| 629.42 | "So click the link in the description below. If you want to be a part of the greatest community ever, not only that, click that like button and click that subscribe button." | CHANGED (the scripted CTA reordered and reworded, "the greatest community ever" for "the best community ever"; a subscribe ask added) |
| 636.86 | "Comment below if you have any thoughts about any of the tokens that I've just described in this video, and I'm going to catch you guys later." | CHANGED (the comment ask "any thoughts about any of the tokens" for "which token you'd add to this list and why"; OPEN QUESTIONS 6 answered by the take: the CTA, not a hard-out) |
| 643.78 | "Code Monkey, Code Monkey, Code Monkey Mike." | AD-LIB (the sign-off, ends 647.30; Bed E fades under it, after "later" at 643.56) |

## Divergences from SCREENPLAY.md

- **Dropped:** 160.24 the lead-in "And the deal:" · 302.64 "Umbrel ships it as a one-click app" · 389.44 "Inside a subnet," · 461.28 "Here's the thing." · 485.50 "And the competition is the centralized labs, which he says himself." · 495.00 the CH4 verdict tail "and if they don't, you're holding an expensive experiment" · 551.58 "so I'm not making one up" · 571.92 the CH5 verdict tail "and if Telegram stumbles, the coin stumbles with it" · small words: "about" before 120,000 (41.56), "mostly" in the window line (77.02), "actually" in the last locked opening line (29.00). RESOLVED by Mike 2026-10-10 (his recording note: sentences skipped on purpose because they sounded wrong or like FUD, marked DROPPED, nothing re-scripted; the spine was approved with them out at 16:16).
- **Added (ad-libs):** 260.80 the ARB disclosure "I just bought some ARB for the first time ... Do your own research." RESOLVED (spine review 2026-10-10: a FACE scene, the picture restored) · 356.00 the Kaspa short caveats "The apps aren't live yet. The tooling is early. DAGKnight is still a proposed protocol." RESOLVED (kept: at spine review Mike cut only the abandoned first take of the DAGKnight line, then approved the spine) · 482.30 "So there is still some room to grow. And some things to mature." RESOLVED (kept on the approved spine) · 499.62 the spelled-out "T-O-N" (kept, minor) · 588.44-643.56 the screen-share community pitch and reworded CTA, and 643.78 the "Code Monkey" sign-off. RESOLVED for picture and audio (the screen share ships as filmed, Mike 2026-10-10); captions over it OFF (RULED by Mike at GATE 3, 2026-10-10).
- **Open questions the take answered:** OQ4 (the Kaspa landing stayed a FACE line, recorded at 315.30) · OQ5 (the handoff is "So let's get into all of this.", 103.72; recorded in persona `dive_in_variants`, approved and top of recent_use, 2026-10-10) · OQ6 (the CTA was recorded, not a hard-out; the comment ask as spoken at 636.86). RULED by Mike at GATE 3, 2026-10-10: OQ2 the CH5 card reads "TON" (the spoken opener is "Toncoin, which in June of 2026 is officially called Gram.") · OQ3 R1 NOT added (the opening face hold stays uncovered; Mike can add it at the blueprint gate) · the chapter themes approved as proposed · captions OFF over the screen share.
- **Guards:** all seven `[!WARNING]` do-not-air guards HELD on the take. [!WARNING 1]: "retire early" said once at 4.32 inside Mike's own locked opening, hedged with "potentially"; every verdict conditional, no number, no target (the CH2 verdict's modal firmed to "are going to look cheap", still conditional). [!WARNING 2]: "Companies blame AI for 120,000 announced job cuts" (employer framing), no mass-unemployment claim, no "10 to 20 percent". [!WARNING 3]: "about 99%" with "as I'm recording this", "about 92 million tokens a month into early 2027", no 230M ask, no 100x, no open interest. [!WARNING 4]: no "coming to America", "there's no US date", "a treasury" ARB holders govern, "on Arbitrum's technology", the sandbox conditions said. [!WARNING 5]: no TPS, no node spec, vProgs "under construction", DAGKnight "still a proposed protocol" with no date. [!WARNING 6]: "the foundation calls it a fair launch", "a hard cap of 128 subnets", "as reported ... roughly", "December of 2025". [!WARNING 7]: "Toncoin, which in June of 2026 is officially called Gram", "by Durov's count in March of 2025", "since January of 2025", nothing on Durov's legal case, "Scale not disclosed". The screen-share return anecdote (603.16) is not about the four tokens and no guard covers it as written; it is flagged below.
- **Clip inserts (Convention 6):** CLIP-2 set-up line said -> KEPT at 94.66 (splice trough 94.67-94.68) · CLIP-3 set-up line said -> KEPT at 184.12 (splice trough 184.13-184.14; Mike says the "not a real share, they don't qualify" gap himself at 198.30, so the 9.4 s short cut holds without the long window). RULED by Mike at GATE 3, 2026-10-10: CLIP-2 and CLIP-3 are IN (short cuts, 12.4 s and 9.4 s). CLIP-4 and CLIP-5 stay HELD (no `[INSERT]` line in the script); their would-be set-up lines WERE said, so either can still be placed: CLIP-5 after "...calls the goal a market for intelligence." (ends 401.32), CLIP-4 after "...pays GPU owners in TON for running AI requests." (ends 551.36). CLIP-1 REJECTED.

## Flags carried into the edit

- 77.02 fact-framing trap: the VO says "Employment is still 4.2%" (three reads, p=1.00); the BLS figure is the UNEMPLOYMENT rate, 4.2 percent, September 2026. Any graphic must read "unemployment 4.2 percent". This is FACE window 2, captions ON: the caption carries Unemployment (RULED by Mike at GATE 3, 2026-10-10; a spoken slip, corrected in the caption only, the correction line above).
- 41.56 fact-framing trap: the VO says a flat "120,000" (no "about"); C34 shows the real 120,136 as announced cuts where the EMPLOYER cited AI; never "AI killed".
- 183.70 fact-framing trap: the VO says "explained it on NBC" (three reads); the CLIP-3 burned caption stays "Paul Atkins, SEC Chairman, CNBC, September 2026" (the source is CNBC Television). COVER line, no caption.
- 200.38 the VO says "debt security" (singular); the C8 crop shows Robinhood's own "tokenized debt securities".
- 207.04 the C2 card must carry "about 99 percent below the 2026-09-04 peak" WITH the read date (the spoken figure is the 2026-10-09 read); C14 the real DefiLlama page.
- 244.68 the CH2 verdict says "then these prices are going to look cheap in hindsight" (scripted "this could look cheap"): conditional and opinion-framed, so the guard HELD, but no graphic or copy may restate it as a prediction, and nothing on screen carries a price.
- 255.68 the VO says "92 million new unlocks per month"; C3 shows about 92.6M ARB unlocked a month, into early 2027.
- 260.80 Mike now discloses on camera that he "just bought some ARB for the first time"; any description or queue copy must not contradict it (the screenplay note that he does not hold ARB is void).
- 410.54 RULED by Mike at GATE 3, 2026-10-10 (the VO stays as said; the ai-production diagram stays neutral, no ownership label): "data that nobody owns and gets paid for" (three reads; scripted "somebody owns") inverts the TAO argument that the next FACE line (415.66, "a claim on that production") lands on. COVER line, no caption; the cover visual on this line must not echo "nobody owns".
- 433.76 fact-framing trap: "about 3,600 a day" is TAO, not dollars (Whisper wrote "$3,600"); C22 and every caption show "3,600 TAO a day".
- 451.62 fact-framing trap: the VO says "roughly 20 to 35 million dollars" (three reads); DATA.md and N4 show 28M to 35M, attributed "as reported, Crypto Briefing 2026-09-29"; Mike's own line at 461.28 says "28 to 35 million". The on-screen figure is never "20 to 35".
- 468.28 "about 360 million dollars" is computed from the live TAO price at read; recompute at render.
- 562.24 the CH5 verdict's "if over a billion users end up holding and paying with Gram" is a hypothetical; no graphic restates it as a count of Gram holders.
- 603.16 RULED by Mike at GATE 3, 2026-10-10 (ships as filmed; nothing on screen, in a title or in the description repeats it): the screen-share anecdote "put 1,000 dollars on a token like Lab ... December of last year ... turn it to 350,000 dollars" is unsourced (not in DATA.md), a past-return claim about a token outside this video, and "December of last year" is a relative date (December 2025 as recorded). It ships as filmed per Mike's ruling; no caption, graphic, title or description restates the figure without Mike's say.
- Ambiguous / low-confidence audio (check at captions): 105.54 "First on this channel" (possibly a swallowed "time"), 94.26 "company", 280.40 "Mine", 372.12 "TAO on Bittensor", 406.04 "did", 520.98 "help jobs go away", 607.86 "Lab" / "LAB", 626.56 "swing training", 643.78 "Code Monkey" (full list under Whisper mishears).
- Word-timing traps in the JSON: the word "The" 57.00-57.98 swallows "it should be." (true times 57.02-57.78) and the word "Why" 137.96-138.48 swallows "Now" (137.96-138.30); cue those two lines off the restored times.
- Splice and pause troughs are tight: CLIP-2 after "company" is a 20 ms trough (94.67-94.68) before "That's" at 94.70; CLIP-3 after "NBC" is 184.13-184.14; the CH2 card pause sits at 104.99-105.00 (-84 dB), earlier than Whisper's 105.02 word end. Run `lint-pause-silence.py` on the source spine before baking (CH3 267.94-268.26, CH4 371.88-372.12, CH5 495.00-495.18 have wider gaps).
- Music cues from the take: Bed A's landing words are "enormous economic explosion" 20.52-22.70 (the script's "most enormous" was not said); Bed E fades under the sign-off 643.78-647.30, after "later" at 643.56; the screen share runs 60.00 s at the tail.
- `[VERIFY]` items from DATA.md still open at render: ARB market cap and the 99x / 65x / 150x recompute (C4) · Robinhood Chain daily fees and "about 99 percent below" with its date (C2, C14) · the next and last ARB unlock on a tracker (C3) · Tenev's X post URL and date (C13) · Umbrel's Rusty Kaspad version (C20; the Umbrel clause was not spoken, so C20 can only appear as a silent receipt) · TAO issued percent (54.0 at read) and the 360M recompute (C22) · TON validators 400 / 382 and the 750M USDT float (C26) · Challenger (monthly), BLS unemployment (monthly) and labor share (quarterly) re-pulls (C34, C35) · every C38 scorecard cell.
- Runtime measured: spine 10:48.3 (648.31 s) + CLIP-2 12.4 s + CLIP-3 9.4 s = 11:10.1, before the four title-card pauses, against the 12:00 target (ceiling about 13:00). Per chapter on the spine: CH1 1:45.0 · CH2 2:43.1 · CH3 1:43.9 · CH4 2:03.1 · CH5 1:16.9 · CH6 1:16.4 (60.0 s of it the screen share). Measurement only.
