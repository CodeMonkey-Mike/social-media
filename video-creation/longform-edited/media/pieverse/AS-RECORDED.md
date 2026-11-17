# pieverse - AS-RECORDED (build the edit to THIS, not the plan)

_Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant"; shape `skills/doc-reference/AS-RECORDED.reference.md`; lint `skills/doc-reference/lint_as_recorded.py` (the longform graph's `as_recorded` node, face mode mixed). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (LOW BPS re-encode -> defumble -> cover-blackout, face mode mixed -> ONE desilence pass: 600 ms min-silence for the whole video, all chapters, 300 ms residual on COVER scenes only as 150 ms tail + 150 ms head, face scenes pad 0 with `--keep-face-pauses on` -> Mike's Adobe Podcast Studio enhance-speech pass remuxed back). No burst removal, no content cut. Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.d.enhanced.mp4` - 373.24s (6:13.24), 1080p30 (1920x1080, 30 fps, 11,198 frames; video 373.213 s from pts 0.022, audio 373.226 s). LOCKED (GATE spine approved 2026-11-14 12:53, GRAPH-PROGRESS.json).
- **Transcript (cue source):** `spine/ALL.d.enhanced.medium-words.json` (word-level, NOT hand-edited; Whisper medium, 144 segments, 1,104 words, first word 0.00, last word ends 372.88; byte-identical to `spine/ALL.c.desilenced.medium-words.json`, because d shares c's clock). Human-review breakdown: `spine/ALL.d.enhanced.segments.txt` (byte-identical to c's copy; its header names `ALL.c.desilenced.mp4`, which is the same picture on the same clock, but the comp loads `ALL.d.enhanced.mp4` for the enhanced audio).
- **Timecode chain:** `spine/ALL.a.defumbled.mp4.spans.json` (LOW BPS -> a: 41 cut spans out of `ALL.lowbps.mp4`, 877.27 s removed, 1719.17 s -> 842.13 s) -> `spine/ALL.b.blackout.mp4.cover.json` (a -> b: NO time shift, 25,258 frames in and out, audio packets identical; it tags the 8 visible windows face / screenshare from the screenplay) -> `spine/ALL.c.desilenced.map.json` (b -> c: 73 cuts, 469.32 s removed, 73 keeps; the map's out_total is 372.81 s against the file's 373.24 s, so a time pushed through the map lands up to around 0.43 s early) -> `ALL.d.enhanced.mp4` (c -> d: NO time shift; the enhanced audio remuxed onto the stream-copied picture: video stream MD5 identical to c, audio-envelope cross-correlation lag 0 at 0 s, 150 s and 300 s). **Every timecode below is already a FINAL-spine coordinate, measured on `ALL.d.enhanced.mp4` and its word JSON; the comp cues directly off them, never through the map.**
- **Spine-prep chain in `spine/`:** `raw/2026-11-14 08-49-36.mkv` (1719.17 s) -> `ALL.lowbps` (chunk map `ALL.lowbps._chunkmap.txt`, raw clock) -> `a.defumbled` (chunk map `ALL.a.defumbled._chunkmap.txt`) -> `b.blackout` -> `c.desilenced` -> `d.enhanced` (FINAL). The enhance-speech exchange files `pieverse FINAL.wav` and `pieverse FINAL-esv2-20p-bg-10p-music-10p.wav` sit beside them.

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on `ALL.d.enhanced.mp4` (non-black = visible). FACE MODE = MIXED (house rule #1c): 4 full-camera FACE windows + 4 screen-share windows (webcam bottom-right, CTA box top-right) = 8, exactly the `--face-max 8` cap. Everything else is BLACK VIDEO and must be covered in the comp. Visible 14.74% (55.02 s of 373.24 s) = face 7.43% (27.72 s) + screen share 7.31% (27.30 s); cover 85.26% (318.22 s). Zero orphans: every window lands on a scripted `[FACE]` or `[SCREENSHARE]` beat, in the screenplay's order, and the kind sequence (face, screenshare, screenshare, face, screenshare, screenshare, face, face) equals the cover-blackout map's.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-9.689 | "Pieverse went from around 12 cents to $2 in under a year. And it is one of my plays, and I did the homework on exactly what it is." | CH1 Beat 1 `[FACE]` (the locked hook) |
| 2 | 19.189-28.555 | "And look at this. So at the time of this recording, the token is sitting at $1.78 with a fully diluted value of $1.7 billion." | CH1 Beat 2 `[SCREENSHARE]` (BODY: card D9, the snapshot) |
| 3 | 104.522-108.722 | "And look at where this token sits, right? It's off to the side, because the product docs never mention it." | CH2 Beat 3 `[SCREENSHARE]` (BODY: chart C1, the token node) |
| 4 | 139.222-145.155 | "And what I couldn't find was the numbers that matters the most, right? How many agents are actually running?" | CH3 Beat 2 `[FACE]` |
| 5 | 171.022-177.755 | "And then look at this right here, November 9th, 2026, new all-time high, $2.23." | CH4 Beat 1 `[SCREENSHARE]` (BODY: chart C2 to marker 3) |
| 6 | 241.669-248.669 | "Now look at this day right here, November 14th, 2026. That's when the 12-month lock on the team and investors ends," | CH4 Beat 3 `[SCREENSHARE]` (BODY: chart C3 to the 14 Nov 2026 marker) |
| 7 | 334.902-339.335 | "That money was raised for payments and compliance, not for a chat app agent." | CH5 Beat 1 `[FACE]` |
| 8 | 352.669-360.335 | "So here's my read. Pieverse is a live product with real backers and is priced way ahead of the numbers it publishes." | CH6 Beat 1 `[FACE]` (the locked read) |

- **Kind checked from the picture, frame by frame:** every frame of every window was classified against the camera layout and the screen-share layout on the right-hand strip (x 1464 to 1920, where the screen share carries the CTA box and the webcam). Each window is ONE kind from its first frame to its last (windows 1, 4, 7, 8 all camera; 2, 3, 5, 6 all screen share). No FACE beat and SCREENSHARE beat run back to back: black separates every pair, so no row is split. The two silent wrong-layout margins the blackout map noted on the defumbled clock (its window 4 opening on the screen-share layout 362.66-368.86, its window 5 opening on the camera 442.83-444.33) were removed by the desilence pass and are NOT on the FINAL spine.
- **Speech at the picture edges (cue faces off the windows above, not off the words):** window 5's "And" starts 170.88, 0.14 s before the picture cut at 171.022; window 4's "And" starts 139.16 (0.06 s early); window 6's "Now" 241.64 (0.03 s early). Last syllables spill up to 0.07 s into black at 9.72 ("is."), 108.76 ("it."), 339.40 ("agent.") and 360.38 ("publishes.").

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the word's timecode. The word-time JSON stays un-edited; this list is re-applied at any text build. Captions are OFF for this video (`caption_scope none`), so the list applies to on-screen card text, the title / description / chapters, and any later vertical or short caption pass.

- 0.00, 11.54, 35.94, 70.34, 132.60, 145.50 "Piverse" -> "Pieverse" (the project name).
- 38.74 "light paper" -> "litepaper" (document name).
- 46.74, 109.14, 235.14, 324.38 "white paper" -> "whitepaper" (document name).
- 64.12 "Perfect Claw" -> "Purr-Fect Claw" (the product name; he says it "perfect claw", as the screenplay notes).
- 77.20 "T." -> "TEE." (the acronym, "secure hardware, called a TEE"; all 3 passes hear "T").
- 80.74, 100.80 "Piverse's" -> "Pieverse's".
- 89.52 "on chain" -> "on-chain"; 262.44 "On chain" -> "On-chain" (spelling).
- 91.88, 120.84 "skill store" -> "Skill Store" (the product's store, capitals).
- 102.10 "lists" -> "list" (medium p 0.24; the chunk-map pass and large-v3-turbo hear "list").
- 110.80 "government's" -> "governance," (the token job, whitepaper 5.2; all 3 passes hear "government", so confirm by ear: Flags).
- 111.64 "making" -> "staking" (medium p 0.06; the chunk-map pass and large-v3 hear "staking").
- 114.24 "pricing yours dollars" -> "priced in US dollars" (the chunk-map pass and large-v3 hear it).
- 129.66 "Claw Hub" -> "ClawHub" (the outside catalog's name).
- 163.70, 178.20 "up-bit" -> "Upbit" (the exchange).
- 180.42 "one" -> "won" (the Korean currency; "won" is heard twice more in the same sentence).
- 227.00, 329.84, 346.94, 350.94, 354.16, 371.08 "Pyverse" -> "Pieverse" (the project name).
- 267.00 "multi-sig" -> "multisig" (spelling).
- 275.90 "the trade in this futures" -> "the trading is futures" (large-v3 hears the screenplay's words; same sounds).
- 280.78 "value" -> "volume" (medium p 0.52; the chunk-map pass and large-v3 hear "volume").
- 297.06 "basic agent" -> "Basic agent" (the staking tier's name).
- 307.38 "token rewards" -> "Token Rewards" (the PIP-5 option's name).
- 332.82 "Cabranz" -> "Animoca Brands" (the lead investor, DATA.md T9; medium p 0.33, the chunk-map pass "Make a brands", large-v3 "Cabrans").
- On-screen formatting, not a mishear: Whisper prints "$2", "$1.78", "$1.7 billion", "$10", "$279", "$1.18", "$2.23", "$7 million"; on screen the persona writes no dollar sign (2.23, 1.78, 1.7B, 7M). Whisper also splits tokens ("all" + "-time", "12" + "-month", "ex" + "-Google", "74" + ",000", "$1" + ".78", "0" + ".02" + "%"): join them at any text build.
- NOT corrected, kept as heard (each is in Flags; confirm by ear before any text uses them): 196.22 "called it a 20 million" · 225.22 "Okay, so but get it more into Pieverse." · 268.68 "two or three signers" · 277.84 "batched" · 299.80 "the guy says" · 309.88 "170 million" (not a mishear: a fact flag) · 338.56 "a chat app agent" · 357.74 "is priced".

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE OPEN (0.00-34.76) · card OFF · Bed: none (no music, Mike 2026-11-11)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "Pieverse went from around 12 cents to $2 in under a year." | CHANGED (locked `[SAY-EXACT]` FACE window 1: "to $2" for "to over 2 dollars", "over" not said) |
| 4.72 | "And it is one of my plays," | AD-LIB (inside the locked hook, FACE window 1: a holding disclosure, not in the script) |
| 6.64 | "and I did the homework on exactly what it is." | CHANGED (locked line: "and I did the homework on exactly what it is" for "so I did the homework on what it actually is") |
| 9.84 | "The short version, Pieverse lets you rent an agent that has its own crypto wallet," | CHANGED ("rent an agent" for "rent an AI agent") |
| 15.32 | "and you talk to it inside an app, like Line or Kakao." | CHANGED ("inside an app" for "inside a chat app") |
| 19.18 | "And look at this." | KEPT (SCREENSHARE window 2 opens, BODY card D9) |
| 20.22 | "So at the time of this recording," | AD-LIB (anchors the price to the record day, 2026-11-14) |
| 22.16 | "the token is sitting at $1.78 with a fully diluted value of $1.7 billion." | CHANGED (record-day numbers 1.78 and 1.7B for the script's 1.61 and "around 1.6 billion"; "around" not said; see Flags) |
| 28.70 | "That's a big number, and I wanted to let you know what's all behind it." | CHANGED ("and I wanted to let you know what's all behind it" for "so I wanted to know what's behind it") |
| 32.62 | "I'm gonna go through this piece by piece." | CHANGED (the handoff; script "So, let's go through it, piece by piece.") |

### CH2 - WHAT IT IS AND HOW IT WORKS (35.20-115.24) · card ON "WHAT IT IS" (Convention 2 waiver, as in the approved SCREENPLAY) · Bed: none

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 35.20 | "Now, Pieverse didn't start as an AI agent project." | KEPT (chapter opener) |
| 38.46 | "Its litepaper is about compliance and payments, invoices and receipts for crypto transactions, and that's where the TimeFi label comes from." | KEPT |
| 46.28 | "Then the whitepaper from November of 2025 calls it a payment stack for AI agents." | KEPT |
| 51.96 | "And the homepage now leads with AI agents for Line and Kakao." | KEPT |
| 56.04 | "So that's three framings in around 12 months." | KEPT (the trim-first line was recorded) |
| 59.64 | "Here's how the product works." | KEPT |
| 61.12 | "You rent an agent by the month. The product's called Purr-Fect Claw, and the plans run from $10 to $279 a month." | KEPT (said "perfect claw", as the screenplay notes) |
| 70.34 | "Pieverse hosts it for you and gives it its own wallet with the keys locked inside secure hardware, called a TEE." | KEPT |
| 77.70 | "One caveat, that means the keys sit inside Pieverse's hardware, not with you." | KEPT (minor wording drift: "sit inside" for "sit in") |
| 83.22 | "Then you message the agent inside of the chat app, something like swap this for that, and it does it on-chain." | KEPT (minor wording drift: "inside of") |
| 90.20 | "And you add abilities from a Skill Store, kind of like installing apps on a phone." | KEPT ("kind of" for "kinda") |
| 95.14 | "The bigger pitch is agents paying each other for services, and that part is documented, but Pieverse's own files list live agent payments as deferred." | KEPT · guard [!WARNING 4] HELD ("documented ... deferred", never "live") |
| 104.52 | "And look at where this token sits, right? It's off to the side, because the product docs never mention it." | KEPT (SCREENSHARE window 3, BODY chart C1 token node; minor wording drift: "this token", "right?" added) |
| 108.88 | "The whitepaper says that the tokens were governance, staking and discount fees," | CHANGED ("the tokens were governance" for "the token's for governance"; "discount fees" for "fee discounts"; "governance" is a correction to confirm by ear, see Flags) |
| 113.24 | "and the plans themselves are priced in US dollars." | KEPT |

### CH3 - WHAT IS REAL (115.56-151.30) · card ON "WHAT'S REAL" (Convention 2 waiver) · Bed: none

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 115.56 | "So what does the product publish about its own usage?" | KEPT (chapter opener) |
| 119.42 | "One counter, the Skill Store lists around 74,000 skills and around 25,000 merchants." | KEPT · guard [!WARNING 1] HELD (a plain description; the import line follows) |
| 125.74 | "Almost all of those skills are imported from an outside catalog called ClawHub, and 30 were published on Pieverse itself." | KEPT · guard [!WARNING 1] HELD ("imported from an outside catalog", no install total) |
| 133.68 | "And out of five skills that carry a price, I count one paid install." | KEPT (the trim-first line was recorded; "out of five" for "out of the 5") |
| 139.16 | "And what I couldn't find was the numbers that matters the most, right? How many agents are actually running?" | CHANGED (FACE window 4: "was the numbers that matters the most, right?" for "is the number that matters most,"; the defumbler kept the LAST take, see Divergences) |
| 145.50 | "Pieverse doesn't publish an agent count, a subscriber count, or revenue, at least not anywhere I checked." | KEPT · guard [!WARNING 2] HELD (the airable line, no outside user or volume figure) |

### CH4 - THE TOKEN (151.56-319.74) · card ON "THE TOKEN" (Convention 2 waiver) · Bed: none

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 151.56 | "Now we get to the token." | KEPT (chapter opener) |
| 153.14 | "It started trading on November 14th, 2025, and hit its all-time low in the same day, around 12 cents." | KEPT (minor wording drift: "in the same day") |
| 159.84 | "And then later on, it started to get more centralized exchanges." | AD-LIB (names no venue) · guard [!WARNING 3] HELD ("listed on Binance" not said) |
| 163.36 | "Around the Upbit listing in Korea, on April 20th, 2026, it went from around 62 cents to around $1.18 in a day." | KEPT |
| 170.88 | "And then look at this right here, November 9th, 2026, new all-time high, $2.23." | KEPT (SCREENSHARE window 5 from 171.022, BODY chart C2 marker 3; minor wording drift: "right here" added, "a" and "at" not said) |
| 177.96 | "On Upbit, the Korean exchange, trading in won, went from around 3 billion won on November 8th to around 54 billion won on November 9th." | KEPT |
| 188.20 | "That's around 18 times more in a single day." | KEPT ("in a single day" for "in a day") |
| 190.54 | (not said) | DROPPED: "And in the 2 hours after the high, the price fell almost 15 percent, on OKX futures." (recorded, then Mike on the take: "Cut that out", raw chunks [137] to [142]) |
| 190.54 | (not said) | DROPPED: "I couldn't find a clear reason for that last move." (recorded, then Mike on the take: "Cut out the previous line") |
| 190.80 | "Now here's the part I can speak to firsthand." | KEPT |
| 193.44 | "Shortly after it launched, one of the bots in my community called it a 20 million market cap, right?" | KEPT (minor wording drift: "called it a" as heard for "called it at a", "right?" added) · guard [!WARNING 6] HELD |
| 197.80 | "And I called it afterwards at a 60 million market cap." | KEPT ("afterwards") · guard [!WARNING 6] HELD |
| 201.48 | "But it has been in my community favorites list in my Discord, and we've been swing trading ever since." | CHANGED (script "It's been a community favorite in my Discord, and we've been swing trading it ever since,") |
| 208.06 | "With this swing trading software, nonetheless, that's available to my members in my community." | CHANGED ("nonetheless" added; "available to my members in my community" for "only available to my members") · guard [!WARNING 6] HELD |
| 212.58 | "So if you were in my community, you'd be up significantly right now." | KEPT (minor wording drift: "right now" added) · guard [!WARNING 6] HELD (no figure) |
| 216.62 | "With just a simple investment of a few hundred dollars, you would be able to pay for the lifetime membership." | KEPT ("you would be able") · guard [!WARNING 6] HELD (no membership price, no return figure) |
| 222.14 | "And that's why you should click the link in the description below." | AD-LIB (a mid-video link CTA; the screenplay put the link in CH6, which did not say it, so this is the video's ONLY link line) |
| 225.22 | "Okay, so but get it more into Pieverse. Let's talk about the circulation." | AD-LIB (the bridge into Beat 3, in place of the scripted "Here's the thing,"; wording unclear on all 3 passes, see Flags) |
| 229.30 | "Only around 27 to 31% of the supply is circulating, depending on who's counting." | KEPT ("Here's the thing," not said) · guard [!WARNING 7] HELD (the range, never one figure) |
| 234.78 | "The whitepaper splits one billion tokens five ways, and the team, the investors, and the foundation add up to 45%." | KEPT |
| 241.64 | "Now look at this day right here, November 14th, 2026. That's when the 12-month lock on the team and investors ends," | KEPT (SCREENSHARE window 6, BODY chart C3 to the 14 Nov 2026 marker; minor wording drift: "this day" for "this date", "on the team and investors" for "on team and investor tokens"; "ends" is the true tense on record day) |
| 248.92 | "which is exactly the day that I'm recording this." | AD-LIB (record day = 2026-11-14 = the unlock day) |
| 251.46 | "Trackers put the first release anywhere from around 33 million to around 86 million tokens." | KEPT · guard [!WARNING 7] HELD (the range, never one size, no dollar value) |
| 256.68 | "And on one tracker's schedule, around 33 million tokens unlock every month until November of 2028." | KEPT ("more" not said) |
| 262.44 | "On-chain, four wallets hold around 57% of the supply." | KEPT · guard [!WARNING 7] HELD ("4 wallets hold around 57 percent", not "25 whales") |
| 266.84 | "They're multisig wallets, and that need two or three signers. So as far as I could read, that schedule is kept by people, not by a contract." | CHANGED ("two or three signers" as heard for "2 of 3 signers", see Flags; "and that need" for "that need") |
| 275.10 | "And a lot of the trading is futures, that's leveraged batched on the price, running at several times the spot volume." | KEPT ("leveraged batched" as heard for "leveraged bets", see Flags) · guard [!WARNING 5] HELD (no Binance derivatives figure) |
| 281.18 | "So does holding a token pay you anything?" | KEPT (minor wording drift: "a token" for "the token") |
| 285.28 | "Staking is live. You can lock your tokens for 90, 180, or 365 days, and what you earn is points called XP, not more tokens." | KEPT ("You can lock") |
| 295.22 | "Stake 50 tokens or more, and you get a Basic agent for as long as the lock runs, and the guy says what XP can be used for will be announced." | KEPT ("also" not said; "the guy says" as heard for "the guide says", see Flags) · guard [!WARNING 5] HELD (no XP value, no "29 dollars a month") |
| 303.42 | "In October, holders voted on how staking should be rewarded, and Token Rewards came out on top, but only around 170 million tokens voted." | CHANGED ("170 million" said for "170 thousand": FACT FLAG, DATA.md T12 = 169,870.5 tokens; OPEN, see Divergences) |
| 311.98 | "That's under 0.02% of the supply." | KEPT (true for 170 thousand, not for the 170 million said one line earlier) |
| 315.38 | "The staking pages I read still pay points, and I didn't find a reward announcement after the vote." | KEPT ("after the vote" for "after that vote") · guard [!WARNING 5] HELD ("the team ignored the vote" not said) |

### CH5 - BACKERS AND WHAT TO WATCH (319.98-352.58) · card ON "WHO'S BEHIND IT" (Convention 2 waiver) · Bed: none

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 319.98 | "So who's behind it all?" | KEPT (chapter opener; minor wording drift: "it all") |
| 321.84 | "The CEO is Colin Ho, and the whitepaper says he's an ex-Google and ex-Uber engineer." | KEPT ("ex-Google and ex-Uber") · guard [!WARNING 7] HELD (Colin Ho only) |
| 327.54 | "In October of 2025, Pieverse announced a $7 million round led by Animoca Brands and UOB Ventures." | KEPT · guard [!WARNING 7] HELD ("a 7 million dollar round", no "total funding 10M") · guard [!WARNING 3] HELD (only the round's named investors) |
| 334.94 | "That money was raised for payments and compliance, not for a chat app agent." | KEPT (FACE window 7; "And" not said; "a chat app agent" for "chat app agents", low confidence, see Flags) |
| 339.54 | "So I'm watching three numbers." | KEPT |
| 341.40 | "One, the circulating supply after November 14th." | KEPT ("2026" not said) |
| 345.12 | "Two, the skills published on Pieverse itself, whether people pay for them," | KEPT ("and" not said) |
| 349.76 | "and three, whether Pieverse publishes an agent count." | KEPT ("ever" not said) |

### CH6 - THE CLOSE (352.72-372.88) · card OFF · Bed: none

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 352.72 | "So here's my read. Pieverse is a live product with real backers and is priced way ahead of the numbers it publishes." | CHANGED (locked `[SAY-EXACT]` FACE window 8: "and is priced" for "and a token that's priced", so as said the subject of "priced" is Pieverse, not the token; "is" p 0.44, may be "it's") |
| 360.50 | "If those three numbers move, the story can change, and I'll be watching." | KEPT · guard [!WARNING 7] HELD ("can", no "will", no target) |
| 364.56 | "If you liked this vid, give it a like and hit that subscribe button if you're not subscribed yet, and comment below." | CHANGED (script "click that like button and click the subscribe button, and comment below") |
| 370.12 | "Let me know if you're into Pieverse or if you're holding something similar." | CHANGED (script "let me know which coin you want me to do the homework on next"); LAST WORD "similar." ends 372.88 |
| 372.88 | (not said) | DROPPED: "And click the link in the description to get involved in the best community ever. I'm gonna catch you guys, later." (never said on the raw take: the take's last line is the one above; the link line was said mid-video at 222.14) |

## Divergences from SCREENPLAY.md

- **Dropped:**
  - CH4 Beat 1, "And in the 2 hours after the high, the price fell almost 15 percent, on OKX futures." and "I couldn't find a clear reason for that last move." (190.54): RESOLVED by Mike on the take ("You know what, now cut that out. ... Cut out the previous line." then "Cut that out.", raw chunks [137] to [142]) and in PROJECT-LOG 2026-11-14 ("OKX and 'no clear reason' lines cut at Mike's word"). Card D21 state 2 (OKX, -14.6%) has no line to cue to.
  - CH6 Beat 2, the link line and the sign-off "I'm gonna catch you guys, later." (372.88): never said on the raw take. The video ends on "or if you're holding something similar." It is neither the scripted CTA nor the hard-out on "and I'll be watching.". OPEN: whether the screenplay's end card (community link line + two end-screen slots) still runs after "similar.", Mike's call.
  - Every other scripted line was recorded, including every trim-first line (56.04, 133.68, the futures line 275.10, the multisig line 266.84, the vote lines 303.42 to 319.74).
- **Added (ad-libs):** 4.72 "And it is one of my plays," (inside the locked hook, FACE window 1) · 20.22 "So at the time of this recording," (SCREENSHARE window 2) · 159.84 "And then later on, it started to get more centralized exchanges." · 222.14 "And that's why you should click the link in the description below." (the video's only link line) · 225.22 "Okay, so but get it more into Pieverse. Let's talk about the circulation." · 248.92 "which is exactly the day that I'm recording this." · small additions "right?" (106.00, 142.78, 197.66), "nonetheless," (209.64), "right now" (215.74). RESOLVED as recorded: they are in the spine Mike approved at GATE spine (2026-11-14 12:53); an ad-lib is content, no trim guidance authored.
- **Locked lines changed on the take:** CH1 hook (0.00 to 9.72: "over" dropped, the "one of my plays" ad-lib, "on exactly what it is") and CH6 read (352.72 to 360.38: "and is priced way ahead" for "and a token that's priced way ahead"). Logged in PROJECT-LOG 2026-11-14; RESOLVED as recorded (house rule #6, the take is canonical; the spine carrying them was approved at GATE spine 2026-11-14 12:53, no re-record asked).
- **Wrong spoken number, 303.42 to 311.64:** "around 170 million tokens voted" against DATA.md T12's around 170 thousand. OPEN: PROJECT-LOG "Mike rules: re-record, drop, or fix on the card." (Card D23 never prints "170M" either way: Flags.)
- **Heard differently from the script (PROJECT-LOG: "Listen at the transcript review"):** 268.68 "two or three signers" · 277.84 "leveraged batched" · 299.80 "the guy says" · 110.80 "government" (corrected here to "governance"). OPEN until Mike listens.
- **Take choice, CH3 face line (FACE window 4, 139.16):** the defumbler kept the LAST take ("And what I couldn't find was the numbers that matters the most, right? How many agents are actually running?"); the earlier take at raw 684.49 to 690.01 ("And what I couldn't find was a number that really matters the most. How many agents are actually running?") is cleaner (PROJECT-LOG). OPEN: swapping it changes FACE window 4 and every later timecode, so the spine, the transcript and this file would be rebuilt.
- **Plug ad-libs dropped at defumble (PROJECT-LOG, restorable from `ALL.a.defumbled.mp4.spans.json`):** raw 823.23 to 860.61 (`ALL.lowbps._chunkmap.txt` [109] to [114], an earlier plug take: "One of my advanced bots in my community identified this around that time period. If I remember correctly, it was around a 20 million market cap. My bots are available in my community to everybody. So even if I don't call it. My members can look at the calls from my bots and make the plays. But I did call this at around a 60 million market cap soon afterwards.") and raw 957.61 to 963.22 ([126] to [128]: "My community up 10x from my call. and 30x from my bots call."). Not on the approved spine. OPEN only if Mike wants one back; the second one breaks guard [!WARNING 6] (a return multiple) and must stay out.
- **Record-day numbers as said (PROJECT-LOG):** 1.78 and FDV 1.7B (script 1.61 / 1.6B). RESOLVED: card D9 and the last point of chart C2 follow the take (record-day read, 2026-11-14); see Flags for the FDV rounding.
- **Guards (the screenplay's 7 `[!WARNING]` boxes, numbered in order):**
  1. "74,000 skills" / "25,000 merchants" as traction, six-figure installs: HELD at 119.42 to 133.42 (a plain description; "imported from an outside catalog ... 30 were published on Pieverse itself" follows; no install total).
  2. "240M+ users", "500,000 transactions", "over 5M in on-chain volume": HELD (none said; 145.50 is the airable line).
  3. Partnerships, "listed on Binance", "Forbes featured": HELD (159.84 "more centralized exchanges" names no venue; 327.54 names only the round's investors).
  4. Agent payments as live, the home page's "first" claims: HELD at 95.14 ("documented ... deferred").
  5. A funding spike, Binance derivatives numbers, "the team ignored the vote", an XP value, "a free agent worth 29 dollars a month", a trading-desk launch: HELD (275.10 "several times the spot volume" only; 295.22 "a Basic agent for as long as the lock runs"; 315.38 the airable vote line).
  6. The plug (a return multiple or % gain, a dollar profit, the membership price, "guaranteed", member or call counts, "called the bottom/top"): HELD on the FINAL spine (190.80 to 221.88: "up significantly right now" with no figure; "a few hundred dollars ... pay for the lifetime membership" as scripted). The raw take's "10x / 30x" line was dropped at defumble; restoring it would BREAK this guard.
  7. One exact unlock size or dollar value, one exact circulating figure, an investor price, "total funding 10M", "25 whales", a cause for the November run, a second co-founder, WhatsApp, a price target or "will": HELD (251.46 the range; 229.30 "around 27 to 31%"; 327.54 "a $7 million round"; 262.44 "four wallets hold around 57%"; 321.84 Colin Ho only; no cause named, the reason line was cut at 190.54; 360.50 "can").
- **Clip inserts (Convention 6):** none scripted (SCREENPLAY `## CLIP-INSERTS` = NONE, Mike's call 2026-11-11, "No receipts, no clips"; DATA.md section 6 not searched), so there is no INSERT row and no `splice_at`.

## Flags carried into the edit

- 22.16 to 28.20 fact-framing trap: the VO says "$1.78" and "a fully diluted value of $1.7 billion" (no "around"). D9 and C2's last point carry the record-day read (2026-11-14), not DATA.md's 2026-11-11 read (1.61 / 1.61B / market cap 443M / rank 112). FDV is price x the 1B total supply, so at 1.78 the read FDV is around 1.78B: the card prints the read value, never "1.7B" copied from the VO unless the read says so. [VERIFY] re-pull price, market cap, FDV, rank, all-time high for 2026-11-14.
- 309.88 fact-framing trap: the VO says "around 170 million tokens voted"; D23 must show DATA.md T12 (1,130 votes, 169,870.5 tokens of weight, around 170 thousand), never "170M". "under 0.02% of the supply" (311.98) is right for thousand (0.017%, my calc in DATA.md). Mike's ruling is OPEN (re-record, drop, or fix on the card).
- 268.68 fact-framing trap: the VO says "two or three signers"; D11 prints "2-of-3" (DATA.md on-chain read: seven 2-of-3 Safes), never "2 or 3".
- 177.96 to 190.54 numbers on D21: VO "around 3 billion won ... around 54 billion won ... around 18 times"; the card prints 3.0B -> 53.8B KRW and 17.8x (DATA.md T13). D21 state 2 (OKX 2.25 -> 1.92, -14.6%) lost its line at 190.54: the strategist decides whether D21 shows the Upbit state only.
- 262.44 VO "around 57%"; D11 prints 56.6% (4 wallets) and 67.35% (seven multisigs), re-read at the unlock.
- 163.36 VO "around 62 cents to around $1.18"; C2 marker 2 prints 1.184 (20 Apr 2026) from the 0.615 print of 19 Apr.
- 170.88 VO "$2.23"; C2 marker 3 "ALL-TIME HIGH 2.23 · 9 Nov 2026" stands unless a newer high was printed before render ([VERIFY]); the record-day price 1.78 is the line's end point.
- 256.68 VO "around 33 million tokens unlock every month until November of 2028"; C3 prints "+33.4M a month" with the "tracker schedule" label.
- 119.42 VO "around 74,000 skills and around 25,000 merchants"; D5 / D6 print the Skill Store counters re-pulled for the record day (74,195 / 25,233 / 74,133 / 32 / 30 / 5 / 1 at the 2026-11-11 read).
- 0.00 VO "from around 12 cents to $2"; D16 prints 0.12 -> 2.23. "Over" was not said; the line is still true.
- 341.40 VO "after November 14th" (no year); D15 prints "14 Nov 2026".
- 212.58 to 221.88 the plug: D24 carries no gain figure, no membership price and no member count (guard 6); "right now" is tied to the record day.
- 352.72 to 360.38 the read as said makes Pieverse (not the token) the thing "priced way ahead of the numbers it publishes"; FACE window, no card, nothing to print. Noted for any text that quotes the read (title, description, a vertical's captions).
- Ambiguous audio / low-confidence words (check before any text uses them): 110.80 "government's" heard by all 3 passes (corrected to "governance"); 196.22 "called it a 20 million" (an "at" may be swallowed); 225.22 "Okay, so but get it more into Pieverse." (unclear on all 3 passes, likely "so, let's get more into Pieverse"); 268.68 "two or three" (all 3 passes hear "or"); 277.84 "batched" p 0.36 (script "bets"); 299.80 "the guy says" (all 3 passes; script "the guide says", a d dropped before "says"; D22 carries "(the guide's words)"); 338.56 "a" p 0.38 (large-v3 hears "agents"); 357.74 "is" p 0.44 (may be "it's").
- Cue timing: at three desilence joins Whisper starts a word on the previous word's end (56.04 "So", 188.20 "That's", 281.18 "So"); cue onsets from the word list, and at those three allow the onset to sit up to a few hundred ms later. The FACE windows above come from the picture: cue the face and screen-share cuts off them, never off `ALL.c.desilenced.map.json` `face_windows` (defumbled clock, lands up to around 0.43 s early).
- The comp loads `spine/ALL.d.enhanced.mp4` (the enhanced audio). `ALL.d.enhanced.segments.txt` still names `ALL.c.desilenced.mp4` in its header: same picture and clock, not the file to load.
- The video's last word "similar." ends 372.88; the spine runs to 373.24 (0.36 s of black and room tone).
- `[VERIFY]` items from DATA.md still open at render: the record-day market read (D9, C2's last point); the circulating counts on CoinGecko, CoinMarketCap and the project's endpoint after the 2026-11-14 unlock (D19); the Skill Store counters (D5, D6); the PIEVERSE mention count in the docs (the 104.52 screen-share line); the top wallet balances and Safe thresholds (D11); what actually moved on 2026-11-14 and any official vesting document (D10, C3); perp and spot volume (D14); the secondary-sourced dates, Binance Alpha 2025-11-14 and Upbit 2026-04-20; plan prices 10 to 279 and the llms.txt "deferred" wording (D4); the staking guide and page (D22); the Snapshot tally and any reward announcement since 2026-10-08 (D23, the 315.38 line); the Upbit and OKX series (D21); Mike's own plug claims from his Discord (D24: the bot call at around 20M, his call at around 60M, the members-only software).
- Runtime measured: 6:13.24 (373.24 s; speech 0.00 to 372.88; 1,104 spoken words against the around 1,080 budget) against the screenplay's around 7:10 target (window 6:40 to 7:40), before the 4 chapter-card holds and any end card are added (measurement only).
