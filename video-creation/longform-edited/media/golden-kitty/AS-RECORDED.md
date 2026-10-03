# golden-kitty - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble, 52 cuts, 34:17 -> 20:34 -> cover-blackout, 9 face windows -> coarse desilence 700 ms -> burst removal x1 pass, 2 spans: the stray first "now" and the burst after "blockchain", 0.964 s -> two-zone desilence 250 ms intro / 500 ms body @55.3s -> content cut x1, "Nine days later, more than 5 million." -> pickup splice x1, audio only, "And in December of 2015"). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.g.pickup.mp4` - 470.456s (7:50.5), 1920x1080, 30 fps. LOCKED (GATE spine APPROVED by Mike 2026-10-01).
- **Transcript (cue source):** `spine/ALL.g.pickup.medium-words.json` (Whisper medium, word-level, 134 segments, 1,393 words, NOT hand-edited). Human-review breakdown: `spine/ALL.g.pickup.segments.txt` (the transcriber's mishear fixes applied to text only).
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 52 cuts, 53 keeps) -> `ALL.b.blackout.mp4.cover.json` (a -> b: picture only, 9 face windows kept, no time change) -> `ALL.c.desilenced.map.json` (b -> c: 108 cuts, 743.06 s removed, 1233.61 -> 490.55 s) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: c times in [43.824, 130.385) shift -0.268 s; c times >= 131.082 shift -0.964 s; the file notes the c map drifts +0.08 to +0.24 s against the c FILE, so downstream cues were re-derived from the file) -> `ALL.e.desilenced.map.json` (d -> e: 33 cuts, 17.60 s removed, 490.37 -> 472.77 s) -> `ALL.f.cut.mp4.spans.json` (e -> f: one span 385.91-388.38 removed; e times >= 388.38 shift -2.47 s) -> `ALL.g.pickup.mp4.splice.json` (f -> g: audio-only replacement of 59.54-61.60, same 2.06 s length, video stream-copied, ZERO shift). **Every timecode below is already a FINAL-spine (`ALL.g.pickup.mp4`) coordinate; the comp cues directly off them.** The superseded transcripts (`ALL.e.desilenced.*`, `ALL.f.cut.*`) are not cue sources.
- **Spine-prep chain in `spine/`:** `lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced` -> `f.cut` -> `g.pickup`.

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on the FINAL spine picture (non-black = FACE), probed for this document. Everything else is BLACK VIDEO and must be covered in the comp. Face 42.60 s of 470.46 s = **9.1% / cover 90.9%**. Zero orphans: all 9 windows land on the 9 scripted `[FACE]` beats (matches the transcriber's d=0.1 list within 0.07 s and the 9-window blackout in PROJECT-LOG).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-9.667 | "In 2015, Robinhood won a trophy called the Golden Kitty and that trophy is now a token on Robinhood's own blockchain and it's priced in gold." | CH1 Beat 1 `[FACE]` (F1, Higgsfield golden background swap) |
| 2 | 40.233-44.033 | "Now I'm very bullish on this token and I'm very bullish on this chain." | CH1 Beat 4 `[FACE]` (F2, Higgsfield golden background swap) |
| 3 | 89.600-91.833 | "And Robinhood even bragged about it." | CH2 Beat 3 `[FACE]` |
| 4 | 122.100-131.233 | "About two months after the chain goes live on September 4th, 2026, a token launches on it called Golden Kitty, ticker GOLDEN." | CH3 Beat 1 `[FACE]` |
| 5 | 167.433-169.533 | "And that's not even the part that got my attention." | CH3 Beat 4 `[FACE]` |
| 6 | 213.933-216.500 | "So the other side of every trade is gold." | CH4 Beat 2 `[FACE]` |
| 7 | 342.567-348.000 | "So as you can see, Golden Kitty is well positioned. Golden Kitty has been doing this since September 4th." | CH5 Beat 4 `[FACE]` (carries an ad-lib sentence in front of the scripted line, see CH5) |
| 8 | 407.533-410.833 | "Robinhood's own customers have barely shown up yet." | CH6 Beat 3 `[FACE]` |
| 9 | 453.100-457.467 | "Robinhood's own trophy on its own chain, priced in gold." | CH7 Beat 2 `[FACE]` |

Black runs: 9.667-40.233 · 44.033-89.600 · 91.833-122.100 · 131.233-167.433 · 169.533-213.933 · 216.500-342.567 (126.07 s, the longest cover run: all of CH4 after F6 plus all of CH5 up to F7) · 348.000-407.533 · 410.833-453.100 · 457.467-470.456 (the CTA tail is black to the end).

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- 100.92 "ChatjpT" -> "ChatGPT" (brand).
- 112.60 "Robinhood crypto" -> "Robinhood Crypto" (product name, capitalized).
- 130.80 "ticker golden." -> "ticker GOLDEN." (ticker, all caps, no cashtag sign).
- 156.30 "2200 holders" -> "2,200 holders" (number format).
- 180.52 "Spider Gold Trust" -> "SPDR Gold Trust" (fund name, pronounced "spider").
- 188.42 "Standard and Poor's Depository Receipts" -> "Standard & Poor's Depositary Receipts" (the fund family's real name is "Depositary"; spoken sound is the same, the caption must carry the correct spelling).
- 194.12 "So SPDR or Spider." -> "So, S-P-D-R, or spider." (he is spelling the acronym, then saying how it is pronounced; keep "spider" lowercase as the pronunciation, not the fund name).
- 268.04 and 298.44 "launch pad" -> "launchpad".
- 283.12 "pools" stays "pools": Mike's ruling 2026-10-01, he can be heard saying "pool", every caption / on-screen line reads "across more than 400 pools".
- 285.34 "Artificial Enu" -> "Artificial Inu" (token name).
- 298.44 and 337.84 "Stonk Fun" -> "StonkFun" (launchpad name, x2).
- 302.04 "its own token, Stonk," -> "its own token, STONK," (ticker).
- 265.02 and 353.92 "Stonk Narrative" / "Stonk narrative" -> "stonk narrative" (lowercase in running captions; the card reads "THE STONK NARRATIVE").
- 312.96 "You compare a coin" -> "You can pair a coin" (transcriber FLAG: confirm by ear).
- 317.84 "You compare it" -> "You can pair it" (transcriber FLAG: confirm by ear).
- 317.84 "Tau" -> "TAO" (persona `tao_spelling`).
- 343.86, 345.44, 365.06, 421.16, 468.38 "Gold and Kiti" -> "Golden Kitty" (token name, x5; two of these sit in FACE window 7, so the caption over his face must be right).
- 375.80 "24-7" -> "24/7".
- 404.52 "the changed transactions" -> "the chain's transactions" (transcriber FLAG: confirm by ear).
- 410.86 "said to himself" -> "said it himself" (transcriber FLAG: confirm by ear).
- 418.18 "End quote." -> "And, quote," PROBABLE mishear, OPEN, confirm by ear before captions. "And quote" and "End quote" sound alike; the script and the Fortune source both put the quote ON "it works great for memes, too" (418.82). Captioning "End quote." would close the Tenev quote one line early and make the memes line read as Mike's own words.

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE TROPHY (0.00-51.10) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "In 2015, Robinhood won a trophy called the Golden Kitty and that trophy is now a token on Robinhood's own blockchain and it's priced in gold." | KEPT (locked `[SAY-EXACT]` `[FACE]` F1; minor drift: "and it's priced in gold" for "priced in gold"). Guard "Vlad held up the trophy" HELD (not said) |
| 9.82 | "Most meme coins trade against Ethereum or a stablecoin. This one trades against gold." | KEPT (locked `[SAY-EXACT]` `[COVER]`). Guard "only trades against gold" HELD |
| 15.22 | "This is the real deal." | CHANGED ("This is the real deal." for "This is real.") |
| 16.48 | "December 23rd, 2015, Robinhood posted themselves. Robinhood won the Golden Kitty award for the sexiest product of the year." | CHANGED ("Robinhood posted themselves" for "Robinhood posts it themselves:"; see Flags, possible swallowed "it") |
| 24.78 | "Then July 1st, 2026, Robinhood launches its own blockchain with more than 28 million customers behind the company." | KEPT |
| 33.54 | "And two months later, that trophy shows up on the chain as a token trading against tokenized gold." | KEPT (minor drift: "on the chain" for "on that chain") |
| 40.08 | "Now I'm very bullish on this token and I'm very bullish on this chain." | KEPT (locked `[SAY-EXACT]` `[FACE]` F2; minor drift: "Now I'm" for "I am", "I'm" for "I am") |
| 44.08 | "And the story of how a cat trophy ended up here starts more than 10 years before the chain even existed." | KEPT (locked `[SAY-EXACT]` `[COVER]`; minor drift: "the chain" for "this chain") |
| 49.88 | "So let's break it all down." | KEPT (CH1 handoff, the intro / body desilence split sits right after it) |

### CH2 - THE GOLDEN KITTY STORY (51.20-121.94) · card ON "THE GOLDEN KITTY" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 51.20 | "So what is Golden Kitty?" | CHANGED ("Golden Kitty" for "a Golden Kitty") |
| 52.94 | "Well, first off, Product Hunt is a site where new tech products launch and the community votes on them." | KEPT ("Well, first off," is a lead-in ad-lib on a kept line) |
| 59.58 | "And in December of 2015, Product Hunt held its first ever awards, voted on by its own community." | KEPT ("And in December of 2015" 59.54-61.60 is the PICKUP audio from `raw/December.mkv`; the take said "2025") |
| 66.20 | "They called it the Golden Kitty Awards." | KEPT |
| 68.42 | "And the trophy is exactly what it sounds like. A chrome gold cat wearing a visor sitting on a base that says Product Hunt, Golden Kitty. Look at that thing." | KEPT |
| 78.32 | "Now Robinhood first showed up on Product Hunt in December of 2013." | KEPT |
| 82.28 | "Two years later, the community votes and Robinhood wins the Golden Kitty for, and I quote, the sexiest product of the year." | KEPT |
| 89.70 | "And Robinhood even bragged about it." | CHANGED (`[FACE]` F3; "even" added) |
| 91.86 | "They posted it themselves. And in their own year-end recap, they called it the coveted Golden Kitty Award." | KEPT |
| 98.42 | "And this award went on to mean something." | KEPT |
| 100.92 | "ChatGPT won the Golden Kitty." | CHANGED ("the Golden Kitty" for "a Golden Kitty") |
| 102.76 | "Telegram won the Golden Kitty, as well as TikTok, Tesla, Apple, Google, and many others." | CHANGED ("the Golden Kitty" for "a Golden Kitty"; otherwise Mike's own locked winners wording) |
| 108.12 | "And in 2018, Coinbase Wallet won the crypto category." | KEPT |
| 112.60 | "The same year Robinhood crypto showed up in that category too." | KEPT (split into its own sentence). Guard "Robinhood Crypto won 2018" HELD ("showed up") |
| 116.04 | "So Robinhood has this trophy in its history." | KEPT |
| 118.78 | "And then Robinhood goes on and launches its own blockchain." | CHANGED ("goes on and launches" for "goes and launches"; the burst after "blockchain" was removed at the spine pass) |

### CH3 - THE TOKEN (122.16-170.92) · card OFF · Bed B continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 122.16 | "About two months after the chain goes live on September 4th, 2026, a token launches on it called Golden Kitty, ticker GOLDEN." | KEPT (`[FACE]` F4, Mike's "maybe" face, aired as face) |
| 131.26 | "And the project says exactly what it is. A fan dedication to Robinhood winning that 2015 Golden Kitty." | KEPT |
| 138.40 | "It's an independent fan token and it's not an official Robinhood product." | KEPT. Guard "official / endorsed by Robinhood" HELD |
| 142.30 | "Now look at this chart from its launch day close. This thing is up roughly 15x." | CHANGED (re-cut: "this chart from its launch day close" for "this chart. From its launch-day close,") |
| 146.60 | "It had one wild day in the middle of September, a huge spike and a hard flush." | KEPT |
| 151.44 | "And look at what it did after that." | KEPT |
| 152.88 | "It built a steady climb day after day, quickly recovering." | CHANGED (", quickly recovering" added). Guard "spoken all-time-high figure" HELD (none said) |
| 156.30 | "At the time I'm recording, that's about a $4.2 million market cap with over 2200 holders." | KEPT |
| 162.48 | "$4 million on a chain has already done more than $90 billion in trading volume." | CHANGED ("on a chain has already done" for "on a chain that has already done"; see Flags) |
| 167.48 | "And that's not even the part that got my attention." | CHANGED (`[FACE]` F5; "And" for "But") |
| 169.66 | "Look at what it trades against." | KEPT |

### CH4 - PAIRED TO GOLD (171.20-259.84) · card ON "PRICED IN GOLD" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 171.20 | "In general, meme coins trade against Ethereum or against a stablecoin." | CHANGED ("In general, meme coins" for "Most meme coins") |
| 175.72 | "Golden Kitty's main pool trades against GLD." | KEPT |
| 178.58 | "So what exactly is GLD?" | CHANGED ("exactly" added) |
| 180.52 | "It's Robinhood's tokenized version of SPDR Gold Trust, a fund that trades like a stock and holds physical gold." | KEPT (minor drift: "SPDR Gold Trust" for "the SPDR Gold Trust") |
| 188.42 | "SPDR is an acronym and it just stands for Standard and Poor's Depository Receipts." | AD-LIB (the screenplay NOTE said the full name was for Mike, not to read out; he read it out) |
| 194.12 | "So SPDR or Spider." | AD-LIB (spells the acronym, then the pronunciation) |
| 196.38 | "And Robinhood says that every one of these tokens is backed one to one by the real share held by a custodian." | KEPT (minor drift: "held by" for "held with"). The "backed one to one" line is about GLD, never Golden Kitty: HELD |
| 203.10 | "Now here's what paired means. The pool holds two things, Golden Kitty and tokenized gold." | KEPT |
| 208.96 | "When somebody buys, gold goes into the pool. When somebody sells, gold comes out." | KEPT |
| 213.98 | "So the other side of every trade is gold." | KEPT (`[FACE]` F6) |
| 216.46 | "And that means that Golden Kitty is priced in gold. Its dollar price is its price in gold times the price of gold." | KEPT |
| 223.40 | "So if that ratio just holds and gold goes up, like let's say 10%, Golden Kitty goes up 10% in dollars." | KEPT (minor drift: "like let's say" added) |
| 230.94 | "It moves with gold both directions and gold is up about 50% over the last two years." | KEPT. Guard "gold can't bleed / only goes up" HELD (the honest clause was said) |
| 236.54 | "And the trading fees get paid in gold too." | KEPT |
| 238.70 | "Per the project's own tracker, this pool has earned about 236 GLD in fees since launch. That's about $90,000 in tokenized gold." | KEPT ("about" for "around"). Guard "gold treasury under the token" HELD (said as fees earned, per the project's tracker) |
| 248.22 | "Now let me be clear about what this is. It's a meme coin and the project says so." | KEPT |
| 252.64 | "It's not backed by gold and you can't redeem it for gold." | KEPT. Guard "backed by gold / redeemable / peg / floor" HELD (said only as the sanctioned denial) |
| 255.70 | "What it is is it's priced in gold and most tokens on this chain can't say that." | KEPT (minor drift: "What it is is it's" for "What it is, is"). Guard "first / only / biggest gold-paired" HELD |

### CH5 - THE STONK NARRATIVE (260.00-363.44) · card ON "THE STONK NARRATIVE" · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 260.00 | "So now Golden Kitty isn't out here on its own." | KEPT (minor drift: "So now" for "Now,", "isn't" for "is not") |
| 262.48 | "There's a whole narrative forming all around this. It's called the Stonk Narrative." | CHANGED ("all around this. It's called the Stonk Narrative." for "around this, the stonk narrative.") |
| 266.54 | "It started with stocks." | KEPT |
| 268.04 | "In the middle of July, a launch pad on the Robinhood chain called Long started letting people launch meme coins that are paired with tokenized stock instead of Ethereum." | KEPT (minor drift: "paired with tokenized stock" for "paired to a tokenized stock") |
| 276.30 | "And it took off." | KEPT |
| 277.84 | "By the end of August, meme coins paired to stocks were about a quarter of all the stock trading on the chain." | KEPT ("stock trading", not "all trading": DATA.md framing HELD) |
| 283.12 | "And that was across more than 400 pools." | CHANGED (own sentence, "And that was across" for ", across"; heard as "pool", captions read "pools" per Mike's ruling) |
| 285.34 | "The biggest one is a meme coin called Artificial Inu paired against tokenized Nvidia stock." | KEPT ("paired against" for "paired to") |
| 290.18 | "It went from a $1.5 million market cap to $150 million in one month." | CHANGED ("150 million" for "135 million"; RESOLVED by Mike 2026-10-01, stays in the VO, screen shows only the sourced 135M) |
| 296.42 | "Then Solana jumped in, of course." | KEPT (", of course" added) |
| 298.44 | "A launch pad over there called StonkFun does the same thing." | KEPT |
| 302.04 | "And its own token, Stonk, ran 250% in a single day to $240 million in market cap." | CHANGED ("240 million" for "140 million"; RESOLVED by Mike 2026-10-01, stays in the VO, screen shows only the sourced 140M) |
| 310.24 | "And they didn't stop at stocks." | KEPT |
| 312.96 | "You can pair a coin to other things as well, like commodities as you can see with gold." | CHANGED ("other things as well, like commodities as you can see with gold" for "pre-IPO tokens"; the PRE-IPO rung has no spoken cue) |
| 317.84 | "You can pair it to blue chip cryptos like Bitcoin, Solana, and TAO." | KEPT |
| 321.88 | "And some of these are set up to pay their holders rewards as well." | CHANGED (", in whatever asset they're paired to" not said; "as well" added). Guard "Golden Kitty holders earn rewards" HELD (the line is about "some of these", StonkFun coins; see Flags) |
| 325.10 | "So a lot of new tech and a lot of new ideas are being ushered in." | AD-LIB (not in the script) |
| 328.82 | "And it's going to be all the craze pretty soon." | AD-LIB (not in the script; opinion) |
| 331.20 | "And now with gold, on October 1st, 2026, which is the day that I'm recording this right now, StonkFun announced that you can launch coins paired with tokenized gold." | CHANGED ("And now, gold." folded in as "And now with gold,"; "which is the day that I'm recording this right now" added) |
| 341.36 | "So they can do it too." | AD-LIB (not in the script) |
| 342.62 | "So as you can see, Golden Kitty is well positioned." | AD-LIB (inside FACE window 7, before the scripted face line) |
| 345.44 | "Golden Kitty has been doing this since September 4th." | CHANGED (`[FACE]` F7; "has been doing this since" for "has been paired to gold since") |
| 348.04 | "So that's over a month before Solana even offered it." | CHANGED ("over a month" for "almost a month"; fact-framing trap, see Flags) |
| 351.06 | "And people are already connecting the two." | KEPT |
| 352.88 | "So here's what I think. The next run is going to be about real world assets and the Stonk narrative." | KEPT |
| 358.44 | "And a gold paired token on Robinhood's own chain is sitting in a prime spot for it." | KEPT (opinion, worded as one) |

### CH6 - THE ROBINHOOD CHAIN (363.46-425.66) · card ON "ROBINHOOD CHAIN" · Bed E

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 363.46 | "So now we get to that chain that Golden Kitty lives on." | KEPT (minor drift: "So now we get to that chain" for "Now we get to the chain") |
| 366.54 | "July 1st, 2026, Robinhood launches the Robinhood chain." | KEPT |
| 371.10 | "It's built to bring stocks, crypto and real world assets together on chain." | KEPT |
| 375.80 | "Tokenized stocks trading 24-7 in more than 120 countries." | KEPT |
| 380.54 | "And look at those numbers." | KEPT ("those" for "the") |
| 381.58 | "On day one, trading volume was just over $200,000." | KEPT |
| 385.94 | (not said; the take said "Nine days later, more than 5 million.", removed from the spine) | DROPPED: "Nine days later, more than 500 million." (content cut by Mike 2026-10-01, he misspoke; RESOLVED) |
| 386.08 | "Three months in, over a billion dollars locked in its apps and more than $90 billion in total trading volume." | KEPT |
| 393.06 | "So here's the growth engine." | KEPT ("So" for "Now") |
| 394.42 | "Robinhood has 28.4 million funded customers and $369 billion in assets on its platform." | KEPT |
| 401.74 | "And one estimate says only 2% of the chain's transactions came from Robinhood app users." | CHANGED ("only 2%" for "only 1 to 2 percent"; RESOLVED by Mike 2026-10-01, stays as said) |
| 407.72 | "Robinhood's own customers have barely shown up yet." | KEPT (`[FACE]` F8) |
| 410.86 | "And the CEO, Vlad Tenev, said it himself, they're building the Robinhood chain to be the best chain in real world assets." | CHANGED ("best chain in real world assets" for "best chain for real-world assets") |
| 418.18 | "End quote." (Whisper; probably "And, quote,", OPEN, see Mishears) | CHANGED (scripted "and, quote,"; confirm by ear) |
| 418.82 | "It works great for memes too." | KEPT (the Tenev quote) |
| 420.96 | "And Golden Kitty is both. A meme, priced in a real world asset." | KEPT (Mike's own observation, after the quote) |

### CH7 - THE CASE (425.72-470.46) · card OFF · Bed E continues (right-aligned to "chain.")

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 425.72 | "So here's the case." | KEPT |
| 427.40 | "If Robinhood routes even a small piece of those 28.4 million customers onto its chain, the tokens already living there are sitting right in front of that flow." | KEPT (minor drift: "onto its chain" for "onto its own chain") |
| 439.10 | "And we've already seen what attention does on this chain." | KEPT |
| 442.28 | "A different meme coin paired to a tokenized AMC stock went from a $40 million to $150 million market cap in an hour after Vlad followed its account." | KEPT ("a different meme coin" said). Guard "Vlad follows it" HELD |
| 453.44 | "Robinhood's own trophy on its own chain, priced in gold." | CHANGED (locked `[SAY-EXACT]` `[FACE]` F9; "on its own chain" for "on Robinhood's own chain") |
| 457.72 | "And a $4 million token could look very different if this chain keeps growing the way it has." | KEPT (locked `[SAY-EXACT]` `[COVER]`) |
| 463.44 | "If you like this vid, click that like button and comment below to let me know what you think about Golden Kitty. And the Robinhood chain." | KEPT (minor drift: "that like button", "to let me know"; "the" at 469.54 is low confidence, PROJECT-LOG quotes it as "their", confirm by ear) |
| 470.40 | (not said) | DROPPED: "And click the link in the description, to get involved in the best community ever. I'm gonna catch you guys, later." (RESOLVED by Mike 2026-10-01: the video ends on "...the Robinhood chain.") |

## Divergences from SCREENPLAY.md

- **Dropped:**
  - CH6 "Nine days later, more than 500 million." - RESOLVED by Mike 2026-10-01 (said as "5 million", content-cut from the spine).
  - CH7 the link line and the "catch you guys later" sign-off - RESOLVED by Mike 2026-10-01 (ending stays as recorded on "chain.").
  - CH5 "You can pair a coin to pre-IPO tokens." - replaced on the take by "other things as well, like commodities as you can see with gold"; passes as recorded (Mike 2026-10-01: remaining differences pass as recorded). RESOLVED. The C27 ladder's PRE-IPO rung has no spoken cue (PROJECT-LOG open flag).
  - CH5 the clause "in whatever asset they're paired to" - not said. RESOLVED (passes as recorded).
- **Changed figures:** 290.18 Artificial Inu "150 million" (source 135M) - RESOLVED, stays in VO. 302.04 STONK "240 million" (source 140M) - RESOLVED, stays in VO. 401.74 "only 2%" (source "1 to 2 percent") - RESOLVED, stays. 348.04 "over a month" (source 27 days) - airs as recorded under Mike's blanket ruling (RESOLVED for the VO), the on-screen framing is a flag below.
- **Added (ad-libs):** 188.42 "SPDR is an acronym and it just stands for Standard and Poor's Depository Receipts." · 194.12 "So SPDR or Spider." · 325.10 "So a lot of new tech and a lot of new ideas are being ushered in." · 328.82 "And it's going to be all the craze pretty soon." · 331.20 "which is the day that I'm recording this right now" · 341.36 "So they can do it too." · 342.62 "So as you can see, Golden Kitty is well positioned." (on his face, F7) · 52.94 "Well, first off," · 152.88 ", quickly recovering" · 296.42 ", of course". All are content and stay (Mike 2026-10-01, spine gate: remaining differences pass as recorded). RESOLVED.
- **Locked-line drift:** CH1 F1 "and it's priced in gold", CH1 F2 "Now I'm ... I'm", CH7 F9 "on its own chain" (for "on Robinhood's own chain"). Passed at the spine gate. RESOLVED.
- **Open for Mike / captions:** (1) 418.18 "End quote." vs "And, quote," - OPEN, confirm by ear. (2) 469.54 "the" vs "their" Robinhood chain - OPEN, confirm by ear. (3) the four transcriber by-ear flags (312.96, 317.84 "can pair"; 404.52 "chain's"; 410.86 "said it himself") - OPEN, confirm at captions.
- **Guards:** every `[!WARNING]` do-not-air claim HELD on the take: no "Vlad held up the trophy" · no Vlad-with-trophy image cue spoken · "backed by gold" said only as the sanctioned denial (252.64) and "backed one to one" only about GLD (196.38) · no holder-owned "gold treasury" (238.70 says fees per the project's tracker) · no "can't bleed" (230.94 says "both directions") · no "official / endorsed" (138.40 says independent, not official) · "Vlad followed" only about "a different meme coin" (442.28) · no "listed on Coinbase / MEXC / Robinhood" · no "first / only / biggest" · no holder rewards claimed for Golden Kitty (321.88 is about "some of these") · no spoken all-time-high · no "646,000 tokens" · Robinhood Crypto "showed up", did not win (112.60) · no VLAD token, no SEC item, no orientation-snapshot numbers · no "buy GLD" · no "today / yesterday" (331.20 says "the day that I'm recording this right now", which the CH7 date anchors).

## Flags carried into the edit

- 290.18 fact-framing trap: the VO says "$150 million" for Artificial Inu; the screen must show the sourced peak "135M" (The Block, 2026-08-31, C23) or a cover with no number. Never a card repeating "150 million".
- 302.04 fact-framing trap: the VO says "$240 million" for STONK; the screen must show "140M" from the C24 headline ("STONK surges 250% to 140 million market cap") or no number. Never "240 million" on screen.
- 401.74 fact-framing trap: the VO says "only 2%"; any on-screen text reads "1-2%" with "one estimate" (ETHNews, single secondary) or carries no number.
- 348.04 fact-framing trap: the VO says "over a month before Solana even offered it"; the pool opened 2026-09-04 and StonkFun's gold post is 2026-10-01 (27 days). The screen shows the two dates, never "over a month" or "1 month+".
- 162.48 and 386.08 fact-framing trap: the VO says "more than $90 billion"; the card reads "90B+" (DefiLlama daily chart sum 92.14B), never the 98.97B / 99.02B headline total.
- 188.42 on-screen spelling: "Standard & Poor's Depositary Receipts" (not "Depository").
- 410.86 quote framing: the VO says "the best chain in real world assets"; the C20 receipt shows Fortune's verbatim "While we're building Robinhood Chain to be the best chain for RWA... it works great for memes, too." Any quote card uses the source wording, never the spoken paraphrase. "And Golden Kitty is both" (420.96) must not be framed as part of the quote.
- 321.88 guard framing: "some of these are set up to pay their holders rewards" is StonkFun coins on Solana. The comp must not put Golden Kitty art, its pool, or its ticker on screen over this line (C28 StonkFun rewards page only).
- 442.28 guard framing: keep the on-screen label "a different token" over the AMC receipt so the line cannot read as "Vlad follows Golden Kitty".
- 312.96 the PRE-IPO rung of C27 has no spoken cue; the ladder lights STOCKS (266.54), a commodities / GOLD mention (312.96), BLUE CHIP CRYPTO (317.84), GOLD (331.20). The ladder must be rebuilt to what was said.
- 16.48 ambiguous audio: "Robinhood posted themselves" may carry a swallowed "it" ("posted it themselves"); caption what is heard, check by ear.
- 162.48 ambiguous audio: "$4 million on a chain has already done" may carry a swallowed "that"; caption what is heard.
- 418.18 ambiguous audio: "End quote." vs "And, quote," (see Mishears), OPEN.
- 469.54 ambiguous audio: "And the Robinhood chain." vs "their" (PROJECT-LOG quotes "their"); low-confidence words at 469.08-470.16.
- Low-confidence names to check at captions: 52.20 "Golden", 78.76 "Robinhood", 130.80 "GOLDEN", 137.42 "Golden", 206.82 "Golden", 217.54 "Golden", 236.98 "trading", 300.56 / 338.12 "StonkFun".
- F1 (0.000-9.667, 9.67 s) is the Higgsfield background-swap clip: check Seedance's maximum clip length before generating and split if it is over (PROJECT-LOG). F2 = 40.233-44.033. Both are mapped back to the RAW master through the chain above, with 0.4 s handles; 480p only.
- Face reframe: ONE global face transform across all 9 windows (scale about 1.35 to 1.45, face to center), measured across the windows above (PROJECT-LOG 2026-10-01).
- End alignment: the last spoken word "chain." ends at 470.40 on a 470.456 s spine; Bed E right-aligns its epic_hit there. No end-card line promises a link.
- `[VERIFY]` items from DATA.md still open at render: GOLDEN market cap "4.2 million" (156.30) and the locked "4 million dollar token" (457.72) against the render-day cap; holders "over 2200" (2,221 read 2026-10-01); "roughly 15x" (144.60, derived); "more than 90 billion" chain volume (162.48, 386.08); "over a billion dollars locked" TVL (386.08); "28 million" / "28.4 million funded customers" and "369 billion" (24.78, 394.42, 427.40; Q2 2026, update if Q3 is out); "about 50% over the last two years" gold (230.94); "about 236 GLD in fees", "about $90,000" (238.70, self-reported); "more than 400 pools" (283.12, 432 from one secondary source); "only 2%" estimate (401.74, single secondary); the AMC 40M to 150M line (442.28, single secondary).
- Runtime measured: 7:50.5 (470.456 s) against the screenplay's ~8:20 target and the brief's 5:00 to 8:00 window (measurement only).
