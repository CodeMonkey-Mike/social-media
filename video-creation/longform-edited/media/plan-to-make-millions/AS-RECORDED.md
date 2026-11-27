# plan-to-make-millions - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (two takes joined at the proxy -> defumble (55 joins, 5 spoken notes to the editor removed) -> cover-blackout (8 FACE windows) -> coarse desilence 600 ms min-silence, pad 0.15 / 0.15, face-scene pauses kept (Mike's FINAL silence definition at GATE spine_review, "The way it is now": no second desilence pass) -> burst removal x3 (1.5 s out) -> Mike's Adobe Enhance Speech track remuxed in, no time change). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.e.enhanced.mp4` - 590.23s (9:50.2), 1920x1080, 30 fps (r_frame_rate 30/1; video stream 590.213 s, audio 590.229 s). LOCKED.
- **Transcript (cue source):** `spine/ALL.e.enhanced.medium-words.json` (word-level, Whisper medium, 1,696 words, NOT hand-edited; byte-identical to `ALL.d.cleaned.medium-words.json`, the enhanced remux moved no word). Human-review breakdown: `spine/ALL.e.enhanced.segments.txt`.
- **Timecode chain:** `ALL.lowbps.takes.json` (the two raw takes joined into the proxy, take 2 starts at 257.633 s; proxy 2127.3 s) -> `ALL.a.defumbled.mp4.spans.json` (proxy -> a: the kept spans, 2127.3 s -> 1196.27 s) -> `ALL.b.blackout.mp4.cover.json` (a -> b: blackout spans in a-coordinates, no time change) -> `ALL.c.desilenced.map.json` (b -> c: 605.25 s of silence removed, 1196.27 s -> 591.74 s) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: three burst cuts; t_d = t_c below 7.090, t_c - 0.467 from 7.556, t_c - 0.933 from 445.562, t_c - 1.500 from 463.929; 591.74 s -> 590.26 s) -> `ALL.e.enhanced.mp4` (d -> e: audio remux only, Adobe's `plan-to-make-millions FINAL-esv2-75p-bg-10p-music-10p.wav`, picture and timeline unchanged). **Every timecode below is already a FINAL-spine coordinate (`ALL.e.enhanced.mp4`); the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` (bursts out) -> `e.enhanced` (Enhance Speech remux).

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on `ALL.e.enhanced.mp4` (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face 51.84 s = 8.8% / cover 538.37 s = 91.2%. (FACE 6 was re-measured after the 2026-11-23 repair: 17 black frames under its last word "can." were replaced by the un-blacked footage, video only, no time moved; `spine/ALL.e.enhanced.restore.json`.) Zero orphans: all 8 windows land on the 8 scripted `[FACE]` beats, in order. FACE MODE = full-screen gated face (no screen share in this video).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-7.022 | "Crypto has been dumping, stocks have been dumping, and this is exactly where I plan to make millions in 2028." | CH1 Beat 1 `[FACE]` (locked hook, captions ON) |
| 2 | 9.889-16.289 | "Most people hear that and they start selling. With me, I hear that and I start buying." | CH1 Beat 3 `[FACE]` (the turn, captions ON) |
| 3 | 46.789-53.555 | "I didn't find those by guessing. I built software that scans every single token that launches." | CH1 Beat 5 `[FACE]` (locked thesis, captions ON) |
| 4 | 216.528-223.961 | "And it wasn't just one thing. It was five things stacked on top of each other in just three weeks." | CH2 Beat 6 `[FACE]` (the landing, no caption) |
| 5 | 348.395-359.395 | "But I'm absolutely fine with that. I took profits on the way up, sent out those sell alerts in my Discord so we can buy back in when it gets lower and build the size of our bank." | CH3 Beat 2 `[FACE]` (the EVAA line, 11.0 s, no caption) |
| 6 | 464.528-471.195 | "That's my edge. I can't watch every launch, but the software available in my community to my members can." | CH4 Beat 5 `[FACE]` (the edge, no caption) |
| 7 | 565.601-570.567 | "Millions by 2028, that's my goal, that's my plan." | CH5 Beat 4 `[FACE]` (locked goal line, no caption) |
| 8 | 588.635-590.213 | "And I'm gonna catch you guys later." | CH5 Beat 5 `[FACE]` (sign-off, no caption; the video ends on "later") |

Captions OFF: 79.48-590.23 (Mike 2026-11-22: captions in the intro only; CH1 ends at 79.48, the first word of CH2, so only FACE 1 to 3 carry captions)

Edge notes (measured, for the comp): the locked COVER line's first word "It" (53.44-53.84) starts 0.12 s before FACE 3's picture ends (53.555). Whisper puts the end of "bank." at 359.46 (picture ends 359.395), and "plan." at 570.64 (picture ends 570.567); the blackout cuts sit in silence, so these are Whisper's end padding (checked 2026-11-23 on the sound itself: every FACE window is followed by 0.10 to 0.15 s of silence, then the NEXT line). FACE 6 was the one real miss: its last word "can." (heard 470.81 to 471.05) sat under black; the picture is restored and FACE 6 now runs to 471.195, one frame before the desilencer join at 471.204.

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build. (Captions run only on FACE 1 to 3, so most of these matter for on-screen text, titles and the description, not for burned captions.)

- 34.00 "Pyverse" -> "Pieverse" (persona / project spelling; DATA.md terminology).
- 266.40 "Pyverse" -> "Pieverse".
- 444.00 "Pyverse" -> "Pieverse".
- 40.00 "Ava" -> "EVAA" (all caps; speech-to-text hears "Eva" / "Ava").
- 300.88 "AVA" -> "EVAA".
- 303.24 "TUN" -> "TON" (the chain EVAA lives on).
- 250.90 "Jensen Wong" -> "Jensen Huang" (Nvidia's CEO).
- 317.08 "Lab" -> "LAB" (ticker).
- 535.28 "Lab" -> "LAB" (ticker).
- 320.60 "GiggleFun" -> "Giggle Fund" (two words, as the transcriber corrected it; confirm the project's own spelling before it goes on any card).
- 211.08 "NASDAQ 100" -> "Nasdaq-100" (index style for any on-screen text; the spoken words stay as said).
- 214.78 "NASDAQ 100" -> "Nasdaq-100".
- 44.48 "and I ran more than a 35X" -> "and it ran more than a 35X" (PROBABLE mishear: "I" is 0.20 s; the spine-review quote in PROJECT-LOG 2026-11-23 reads "it ran"; confirm by ear; COVER line, never captioned).
- 397.02 "the bots flag the one with unusual activity" -> "the ones" (PROBABLE mishear, the scripted line has "ones"; confirm by ear; COVER line).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE HOOK (0.00-79.48) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "Crypto has been dumping, stocks have been dumping, and this is exactly where I plan to make millions in 2028." | KEPT (locked `[SAY-EXACT]` `[FACE]`; wording drift: "has been dumping" x2 for "is dumping", "in 2028" for "by 2028") · guard [!WARNING 9] (plan, not a promise) HELD: first person "I plan" |
| 7.22 | "Just listen to the last few weeks of headlines." | KEPT (locked `[SAY-EXACT]` `[COVER]`, verbatim; the burst before "Just" was cut at GATE spine) |
| 9.66 | (clip insert CLIP-1 lands here; the set-up line ends "...the last few weeks of headlines.") | KEPT · INSERT CLIP-1 (2.6 s, the speaker's own voice; the splice is the trough after "headlines", 9.66-9.94; montage cut 1 of 4) |
| 9.66 | (clip insert CLIP-4 lands here, back to back after CLIP-1; the set-up line ends "...the last few weeks of headlines.") | KEPT · INSERT CLIP-4 (3.2 s, the speaker's own voice; the splice is the trough after "headlines"; montage cut 2 of 4) |
| 9.66 | (clip insert CLIP-3 lands here, back to back after CLIP-4; the set-up line ends "...the last few weeks of headlines.") | KEPT · INSERT CLIP-3 (3.5 s, the speaker's own voice; the splice is the trough after "headlines"; montage cut 3 of 4) |
| 9.66 | (clip insert CLIP-8 lands here, back to back after CLIP-3; the set-up line ends "...the last few weeks of headlines.") | KEPT · INSERT CLIP-8 (3.6 s, the speaker's own voice; the splice is the trough after "headlines"; montage cut 4 of 4, the closer; the spine resumes on FACE 2 "Most people...") |
| 9.94 | "Most people hear that and they start selling. With me, I hear that and I start buying." | CHANGED ("they start selling" for "they sell"; "With me, I hear that" for "I hear that") · FACE 2, captions ON |
| 16.48 | "Look at the size of this. Around $700 billion wiped out of crypto in around three weeks." | KEPT · [VERIFY] live-drift (DATA.md T1) |
| 23.46 | "Bitcoin down around 25% in a month." | KEPT · [VERIFY] live-drift |
| 26.34 | "And stocks just had their worst week since April 2025." | KEPT (minor drift: "April 2025" for "April of 2025") |
| 30.64 | "And a market like this is where my low entries come from." | KEPT |
| 34.00 | "Pieverse, I called it around a 65 million market cap and it went to over a billion." | CHANGED ("65 million" for "60 million dollar"; "went to over a billion" for "went over 1 billion") · guard [!WARNING 2] (no 17.5x, no present-tense high) HELD |
| 40.00 | "EVAA, our lowest entries were around a three to $4 million market cap and I ran more than a 35X from there." | CHANGED ("more than a 35X" for "more than 10x") · guard [!WARNING 1] BROKEN on the take ("a 35x call" is on the do-not-air list): RESOLVED by Mike 2026-11-23, "keep it", airs as said; no card prints 35 (see Flags) |
| 46.82 | "I didn't find those by guessing. I built software that scans every single token that launches." | KEPT (locked `[SAY-EXACT]` `[FACE]`; drift: "every single token" for "every token") · FACE 3, captions ON · guard [!WARNING 9] (software not a verified spec) HELD: said as his own claim, no count |
| 53.44 | "It finds them early, then I swing trade them. Buy the bottoms, sell the pumps, then rotate the profits into the next one." | KEPT (locked `[SAY-EXACT]` `[COVER]`; drift: "then rotate" for "and rotate"; "It" starts 0.12 s before FACE 3's picture ends) |
| 62.42 | "So in this video, I'm gonna show you three things. What's really behind this dump, the two trades with my real entries and the software and the plan that I'm running all the way to 2028." | KEPT |
| 74.32 | "Now, none of this makes sense until you understand this dump. So let's take it from the top." | KEPT (drift: "none of this" for "none of it", "take it" for "take this") |

### CH2 - THE DUMP (79.48-265.72) · card ON "WHY EVERYTHING DUMPED" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 79.48 | "So here's Bitcoin since October. Watch where it breaks." | KEPT |
| 82.84 | "October 29th, Binance, the biggest crypto exchange in the world gets hacked. Around $6.3 billion gone, most of it in around 20 minutes. It's the biggest crypto heist on record." | KEPT · guard [!WARNING 4] (Binance lines) HELD: 6.3B, "crypto heist on record", no attribution |
| 98.06 | "Binance covered the losses, but Bitcoin still dropped more than 4% that day. And over $1.5 billion in leveraged trades got wiped out." | KEPT · guard [!WARNING 4] HELD |
| 108.66 | "The next day, oil closes above $117 a barrel. That's the war with Iran and the supply crunch out of the Strait of Hormuz. And it's been building since February." | KEPT (drift: "The next day" for "The very next day") · guard [!WARNING 7] (oil, no present tense) HELD: no "closed", no "oil is going up" |
| 120.32 | "It pushed prices up for everyone. Gas jumped around 9% in a single month. And in September, the Fed raised interest rates for the first time in three years." | KEPT · guard [!WARNING 7] HELD: past tense |
| 131.20 | "Higher rates means less money flowing in the economy, less businesses taking out loans, less economic expansion, less job growth, and less people with jobs putting their money into crypto." | CHANGED (the scripted one-liner "Higher rates mean less money flowing into crypto." grew into an ad-libbed chain: economy, loans, expansion, jobs, crypto) |
| 143.80 | "Then November 3rd, the midterms. Democrats take both the House and the Senate. And two days later, the market starts pricing in tougher rules on AI and on data centers." | KEPT · guard [!WARNING 8] (no "the Democrats crashed the market") HELD |
| 156.02 | "Stocks have their worst day since April of 2025, and Bitcoin dropped more than 5% with them." | KEPT (drift: "dropped" for "drops") |
| 162.78 | "November 12th, the CEO of Nvidia resigns, effective immediately, after a week of reports about his conduct. It shook the whole AI trade." | KEPT · guard [!WARNING 5] (Nvidia allegations, no causal crash) HELD |
| 172.40 | "Nvidia's stock went down around 47% from its October high." | CHANGED ("went down" for "is now down"; the past tense matters, see Flags) · [VERIFY] live-drift |
| 176.68 | "And November 19th, Anthropic goes public, the largest IPO in history, around $81 billion raised." | CHANGED ("the largest IPO in history" for "in US history"): RESOLVED 2026-11-23 (PROJECT-LOG: holds, 81B is far above Saudi Aramco's ~29B) · guard [!WARNING 6] HELD: no "2 trillion" |
| 184.20 | "And the theory is that money had to come from somewhere. So some of it came out of crypto." | KEPT · guard [!WARNING 6] (rotation as a theory) HELD |
| 189.44 | "The last time a giant IPO landed, SpaceX, in June, Bitcoin bottomed 18 days later, and then it ran 48%." | KEPT · [VERIFY] the SpaceX listing date (2026-06-12, search level) |
| 197.52 | "That's one time not a rule, but at least it's something worth watching." | CHANGED ("but at least it's something worth watching" for "But I'm watching it") |
| 201.62 | "So add it all up, and Bitcoin lost around a quarter of its price since the day before the hack. The S&P 500 is down more than 10% from its record, and the NASDAQ 100 is down 20%." | CHANGED ("is down 20%" for "is down almost 20"; "add it all up" for "add it up") · fact-framing trap, see Flags |
| 213.94 | "So that puts the NASDAQ 100 in a bear market." | AD-LIB · guard [!WARNING 8] ("stocks are in a bear market") BROKEN on the take: RESOLVED by Mike 2026-11-23, "keep this", airs as said; no card states a closing figure of 20% or more |
| 216.56 | "And it wasn't just one thing. It was five things stacked on top of each other in just three weeks." | KEPT (drift: "just one thing", "in just three weeks" for "inside of 3 weeks") · FACE 4, no caption |
| 224.16 | "This is what I've been saying all along over the last six months. I had been skeptical that that would be a new bottom in Q4, but I was open to it. I said I was 10% open to it." | AD-LIB (his own prior view, kept; PROJECT-LOG 2026-11-23) |
| 235.14 | "And the idea would be that there would be a whole bunch of things that would happen all at once, compacted into a small timeframe. And there you have it." | AD-LIB (kept) |
| 243.54 | "Quick side note, at the same time that I'm actually recording this video right now, news just broke that Jensen Huang has been reinstated as CEO and in Nvidia. So hey, it looks like that stock is going up." | AD-LIB (kept; the reinstatement CONFIRMED the same day, DATA.md Pillar 4 addendum) · guard [!WARNING 5] HELD: no allegation, no reason given · "as CEO and in Nvidia" is ambiguous audio (see Flags) |
| 257.98 | "But nonetheless, in a market like this, when everything is so far down and bottomed out, let me show you exactly what I do." | CHANGED (reworded handoff; scripted "Now, here's what I actually do, in a market like this.") |

### CH3 - THE TRADES (265.72-372.32) · card ON "THE TRADES" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 265.72 | "Let's start with Pieverse. It's an AI agent payments project, and it was launched in November of 2025." | KEPT (drift: "it was launched" for "it launched") |
| 272.32 | "Right after it launched, one of my bots flagged it at around a $20 million market cap, but it was already running, so I waited." | KEPT · guard [!WARNING 9] HELD: past tense, "one of my bots" |
| 280.40 | "It pulled back a little three weeks later, and then I called it at around a $65 million market cap." | CHANGED ("It pulled back a little three weeks later, and then I called it" for "It pulled back, and that's when I called it"; "65 million" for "60 million dollar") · see Flags (the dates on the chart, not "three weeks") |
| 286.02 | "We've been swing trading it ever since." | KEPT |
| 288.28 | "On November 18th of 2026, it touched $1 billion, a $1 billion market cap." | KEPT (restated: "it touched $1 billion, a $1 billion market cap" for "it touched a 1 billion dollar market cap") |
| 294.36 | "On price, that was more than a 14X from my call and around a 30X from where the bot flagged it." | CHANGED ("more than a 14X" for "more than 10x"): RESOLVED 2026-11-23 (PROJECT-LOG: holds at the 5.33 high of 2026-11-22, 15.2x to 15.8x; the multiple lands on the HIGH marker) · guard [!WARNING 2] HELD: price basis, never 17.5x |
| 300.26 | "Now, EVAA, it's a lending protocol on TON that lives inside of Telegram." | KEPT |
| 305.40 | "We've been swing trading it since it launched in October of 2025, and I've been rotating gains from my other plays into it." | KEPT · guard [!WARNING 1] HELD: no "at launch it's a 30x" |
| 312.34 | "It's crazy how many rotations I put into this. We did the 350X on LAB, I rotated into this. We did the 30X on Giggle Fund, rotated into this. DCA'd into it. It's been absolutely amazing." | AD-LIB (kept; his own track record said as his, never shown as "verified", no research card: PROJECT-LOG 2026-11-23) · guard [!WARNING 9] (showcase multiples as research findings) HELD as spoken |
| 326.16 | "One of our lowest entry points came in 2026 at around a $3 million market cap." | CHANGED ("One of our lowest entry points ... around a $3 million market cap" for "Our lowest entries came in 2026, at around a 3 to 4 million dollar market cap") |
| 331.02 | "On October 27th, it was sitting at 51 cents. By November 21st, it hit $6.60. That's around a 13X in under four weeks." | KEPT |
| 343.52 | "Then on November 22nd, it dropped down by more than 60% in a single day." | KEPT · guard [!WARNING 3] (no cause) HELD |
| 348.44 | "But I'm absolutely fine with that. I took profits on the way up, sent out those sell alerts in my Discord so we can buy back in when it gets lower and build the size of our bank." | CHANGED ("so we can buy back in when it gets lower" for "and now I'm buying it back down here"; AD-LIB inside: "sent out those sell alerts in my Discord", "build the size of our bank") · FACE 5, no caption · the conditional wording settles the DATA.md "now I'm buying it back" flag |
| 359.46 | "Even after that drop, those low entries are still up around a four to five X." | KEPT · [VERIFY] live-drift ("four" is a low-confidence word, p 0.14) |
| 364.24 | "Now look at what those two trades have in common. I was in early, way before the pump, and getting in early isn't just luck." | KEPT (drift: "getting in early isn't just luck" for "getting in that early, isn't luck") |

### CH4 - HOW I FIND THEM (372.32-471.06) · card OFF · Bed C (continues, carved)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 372.32 | "So how do I find them that early? New tokens launch around the clock and no human can read them all, so I don't try, of course." | KEPT (", of course" added) |
| 380.20 | "But I'm a software developer, and I've been investing in crypto since 2013. So I built software to do the reading for me." | KEPT ("But" added) |
| 387.74 | "Here's the funnel. At the top, every new coin, the second it gets listed or shows up on a decentralized exchange," | KEPT · WB1 whiteboard window opens here · guard [!WARNING 9] ("every" as his claim, same ruling as the hook) HELD |
| 396.06 | "the bots flag the one with unusual activity." | KEPT ("the one" as transcribed, probably "the ones": see Mishears) |
| 398.88 | "Then it scans everything about it. Who funded it? Who's backing it? Where is it listed? How big is it? Who's holding it? Et cetera, et cetera, et cetera." | CHANGED ("Then it scans everything about it" for "Then the filters"; "Where is it listed?" for "Which exchanges listed it"; AD-LIB "Who's holding it?" and "Et cetera, et cetera, et cetera") · DATA.md rug-pull do-not-air HELD: "Who's holding it?" is not a team-dump claim |
| 408.72 | "What comes out at the bottom is a handful of plays." | KEPT · WB1 window closes at 411.54 (387.74-411.54 = 23.8 s, inside 20 to 24 s and the 30 s cap) |
| 411.88 | "Here's one of the easiest tells without diving in deeper into the details. If a brand new coin is already listed on a long list of centralized exchanges, it probably has to have funding. It costs money to be listed on them, so that's the only way it can get there." | CHANGED (reworded: "one of the easiest tells" for "one of my favorite tells"; "centralized exchanges" for "big exchanges"; "it probably has to have funding" for "it's got funding behind it"; AD-LIB "without diving in deeper into the details", "It costs money to be listed on them") |
| 427.08 | "These aren't random meme coins at a 500K market cap where you have to worry about getting rugged. These are funded projects with real backers, and we get in really, really early." | KEPT (drift: "we get in" for "we're getting in") |
| 437.66 | "And even then, I usually don't chase it. If it's already pumping, I wait for a pullback. That's exactly what I did with Pieverse." | KEPT ("usually" added; the burst after "Pieverse" was cut at GATE spine) |
| 444.58 | "Then the swing trading software takes over. It's a tool that my members use to trade with." | CHANGED ("It's a tool that my members use to trade with" for "It's the tool my members and I trade with, and it runs one loop") |
| 449.72 | "When a play is sitting near its bottom, a buy alert goes out. When it pumps, we take profits on the way up, and those profits rotate into plays that are still at the bottom." | KEPT |
| 458.86 | (not said) | DROPPED: "Buy the bottom. Sell the pump. Rotate. Then do it again, on the next one." (C22's "do it again" cue has no spoken word) |
| 459.22 | "On my public showcase, there are 56 calls. 34 of them were called by a bot." | KEPT · [VERIFY] recount the showcase (the false start of "34" was cut at GATE spine) |
| 464.58 | "That's my edge. I can't watch every launch, but the software available in my community to my members can." | CHANGED ("but the software available in my community to my members can" for "but my software can") · FACE 6, no caption |

### CH5 - THE PLAN TO 2028 (471.06-590.23) · card ON "THE PLAN TO 2028" · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 471.06 | "So why am I this confident in the middle of a dump? Because of what came after the last ones." | KEPT |
| 477.16 | "There've been 19 midterm elections since 1950. In all 19, the S&P was higher 12 months later. That's a stock market stat, and some of those years dipped hard first." | KEPT ("the S&P" for "the S&P 500") · guard [!WARNING 8] HELD: said as a stock stat, never applied to crypto |
| 489.28 | "And Bitcoin? The last two times it put in the bear market low, it more than doubled within a year." | KEPT ("the bear market low" for "a bear market low") · guard [!WARNING 8] HELD: "the last two times" kept |
| 495.66 | "But in reality, nobody rings a bell at the bottom, and I don't know if this is it. I don't need the exact bottom. I need low entries, and a dump like this is where they are." | KEPT ("But in reality" for "Here's the thing") |
| 505.98 | "So the plan isn't a prediction. The plan is the loop. One play moves, I take profits on the way up, and I split those profits across the next 10 plays. One of those moves, and I do it again." | KEPT |
| 517.96 | (not said) | DROPPED: "These are long-term plays. Nobody's getting a 50x in 2 weeks. This is a few years of buying bottoms, and selling pumps." |
| 518.26 | "And why 2028? Because I think we're gonna start flying in 2027 once interest rates come back down. That gives this loop two full years to run." | KEPT ("we're gonna start flying" for "we start flying"; his view, first person: PROJECT-LOG 2026-11-23) · guard [!WARNING 9] HELD: no halving, no four-year cycle |
| 527.86 | "Imagine starting out with just simple $20 investments. You put $20 down on a play, like LAB, it does a 350X." | AD-LIB (kept; a hypothetical he frames as one) · guard [!WARNING 9] ("20 dollars turns into six or seven figures" as an outcome) HELD: "Imagine", "let's say" |
| 538.58 | "Now, you don't sell it all at the top, that's unrealistic. But let's say you're selling on the way up, and you end up with $2,000." | AD-LIB (kept, same hypothetical) |
| 547.78 | "Now you have the $2,000, and you can spread out, let's say, $200 into 10 different tokens. And then another one of those tokens does 100X, and another one does 50X, and then another one does 300X." | AD-LIB (kept, same hypothetical) |
| 562.04 | "So you see where I'm going here. The money just keeps multiplying." | AD-LIB (kept, same hypothetical) |
| 565.82 | "Millions by 2028, that's my goal, that's my plan." | KEPT (locked `[SAY-EXACT]` `[FACE]`; drift: "that's my plan" for "and that's my plan") · FACE 7, no caption · guard [!WARNING 9] HELD: first person, no promise |
| 570.80 | "I'm not predicting the bottom, I'm not predicting the top. I'm running the loop." | KEPT (locked `[SAY-EXACT]` `[COVER]`, verbatim) |
| 576.16 | "So click the link in the description below if you wanna get in on this action. And click that like button, and comment below. Let me know what coins you're buying." | CHANGED (order swapped: the link first, then like / comment; "if you wanna get in on this action" for "if you want the bots, the buy alerts, and the swing trading software ... the best community ever"; "Let me know what coins you're buying" for "tell me which coins you're buying in this dump") · guard [!WARNING 9] HELD: no price, no tier |
| 585.94 | "Just remember, buy those bottoms." | AD-LIB (kept) |
| 588.72 | "And I'm gonna catch you guys later." | KEPT ("And" added) · FACE 8, no caption; the video ends on "later." |

## Divergences from SCREENPLAY.md

- **Dropped:** (1) 458.86 CH4 Beat 4 "Buy the bottom. Sell the pump. Rotate. Then do it again, on the next one." - OPEN (C22 THE LOOP still builds node by node on the spoken loop at 449.72-458.86; its "do it again" close needs a new cue, e.g. "still at the bottom"). (2) 517.96 CH5 Beat 2 "These are long-term plays. Nobody's getting a 50x in 2 weeks. This is a few years of buying bottoms, and selling pumps." - OPEN (no on-screen "long-term" copy should be built for it). (3) CH4 Beat 4 `[NOTE]`: the one sentence on what the swing trading software's screen shows was not added - OPEN (the C19 screen capture, if Mike supplies it, rides on 444.58-458.86 with no new words). Nothing else scripted was left unsaid; the reworded lines are CHANGED rows above.
- **Added (ad-libs):** 131.20 the rates -> economy -> jobs -> crypto chain · 213.94 "So that puts the NASDAQ 100 in a bear market" · 224.16-243.42 "This is what I've been saying all along ... And there you have it" · 243.54-257.74 the side note (Jensen Huang reinstated, "it looks like that stock is going up") · 312.34-325.78 "It's crazy how many rotations ... LAB ... Giggle Fund ... DCA'd into it" · 352.80 "sent out those sell alerts in my Discord" · 398.88 "Who's holding it? Et cetera" · 411.88 "without diving in deeper into the details", "It costs money to be listed on them" · 527.86-565.50 the $20 compounding walk-through · 585.94 "Just remember, buy those bottoms." - RESOLVED by Mike 2026-11-23 (PROJECT-LOG: the ad-libs are his content and stay; all are COVER).
- **Wording rulings already made (RESOLVED, PROJECT-LOG 2026-11-23):** "65 million" (34.00, 282.60): the on-screen marker reads AROUND A 65M CAP · "more than a 14X from my call" (294.36): holds, the multiple lands on the 5.33 HIGH marker · "the largest IPO in history" (179.72): holds · "we're gonna start flying in 2027" (520.18): his view · EVAA "more than a 35X" (44.48): "keep it" · "puts the NASDAQ 100 in a bear market" (213.94): "keep this" · pacing: coarse 0.6 s for the whole video, "The way it is now" · three bursts cut (7.18, 445.19, 463.51 on the rough spine).
- **Guards:** [!WARNING 1] EVAA numbers: BROKEN at 40.00 ("more than a 35X"), RESOLVED (Mike, "keep it"; spoken only, never on a card); HELD at 305.40, 326.16, 331.02, 343.52, 359.46. [!WARNING 2] Pieverse: HELD (no 17.5x, no present-tense high). [!WARNING 3] no cause for any move: HELD. [!WARNING 4] Binance: HELD. [!WARNING 5] Nvidia: HELD (162.78, 243.54). [!WARNING 6] Anthropic: HELD ("the theory is"). [!WARNING 7] oil and inflation: HELD (past tense). [!WARNING 8] market overstatements: BROKEN at 213.94 (Nasdaq bear market), RESOLVED (Mike, "keep this"); "the NASDAQ 100 is down 20%" at 210.64 is a framing trap (Flags); midterm and Bitcoin precedents HELD. [!WARNING 9] plan / software: HELD (first person; "every single token" said as his own claim; no funnel count; no price; the $20 walk-through framed as a hypothetical). [!WARNING 10] reference video: HELD (nothing from it said). DATA.md rug-pull do-not-air: HELD.
- **Clip inserts (Convention 6):** the montage set-up line "Just listen to the last few weeks of headlines." was said (7.22-9.66) -> CLIP-1, CLIP-4, CLIP-3, CLIP-8 KEPT at 9.66, back to back in date order, 12.9 s in total (measured at capture; CLIP-8 is 3.6 s), the splice in the trough after "headlines" (9.66-9.94; FACE 2's picture starts at 9.889). The CLIP-INSERTS rows still read PROPOSED: the screenplay gate was approved by the recording (PROJECT-LOG 2026-11-23) with no ruling on the montage options (a) to (d), so it is built as scripted - OPEN for Mike only if he wants option (c) (CLIP-5 for CLIP-4, plus 4.5 s) or (d) (drop it, minus 12.9 s). Bench rows CLIP-2, CLIP-5, CLIP-6, CLIP-11 stay HELD (no set-up line was scripted or said for them); CLIP-7, CLIP-9, CLIP-10 stay REJECTED.

## Flags carried into the edit

- 44.48 fact-framing trap: the VO says "more than a 35X"; the EVAA chart stays on the PRICE record (0.44 to 6.62, up to 15x at the 2026-11-21 peak) and no card, badge or caption prints 35 or any multiple the price record does not give (Mike's ruling 2026-11-23; DATA.md section 4).
- 34.00 / 282.60 fact-framing: the VO says "around a 65 million market cap"; the C16 call marker reads AROUND A 65M CAP (CoinGecko 64.21M on 2025-11-21), not the screenplay's 60M.
- 294.36 fact-framing trap: the VO says "that was more than a 14X from my call" right after the November 18 touch; on the November 18 touch it was around 10.5x. The 14X lands on the 5.33 HIGH marker (2026-11-22, 15.2x to 15.8x), never on the November 18 label.
- 280.40 fact-framing: the VO says "pulled back a little three weeks later"; the chart shows the dated pullback (0.518 on 2025-11-25 to 0.338 on 2025-11-30) and the call window (late November 2025), never the words "3 weeks later".
- 210.64 / 213.94 fact-framing trap: the VO says "the NASDAQ 100 is down 20%" and "in a bear market"; on screen the Nasdaq-100 reads minus 19.84% on the 2026-11-20 close (intraday low 20.2% under its record), and no card states a closing figure of 20% or more (Mike's ruling 2026-11-23). The S&P 500 stays "a correction" (minus 11.6%), never "bear market".
- 172.40 fact-framing: the VO says Nvidia "went down around 47% from its October high"; the card is dated (239.24 on 2026-10-06 to 125.53 on 2026-11-20, minus 47.5%) because the stock rose on 2026-11-23 after the reinstatement (243.54). Never "now down".
- 243.54 the reinstatement side note: CONFIRMED by Nvidia's newsroom on 2026-11-23 (DATA.md Pillar 4 addendum); the "more than 30%" rise that day is search level, NOT a closing print: [VERIFY] the close before any number goes on screen; the reasons in the reports stay do-not-air.
- 179.72 fact-framing: the VO says "the largest IPO in history" (ruled: holds); an on-screen label quotes its source ("the largest IPO in US history", Al Jazeera) or the ruled reading, never a bigger claim, and "around 81 billion dollars raised" as said.
- 122.60 fact-framing: "Gas jumped around 9% in a single month" is September 2026 (gasoline index plus 9.1%): the C6 card carries the month, never "this month".
- 326.16 fact-framing: the VO says "around a $3 million market cap"; the C14 entry band stays 2.9M to 4.0M (price 0.44 to 0.60), as sourced.
- 312.34 / 527.86 the LAB 350X and Giggle Fund 30X lines are his own track record and the $20 walk-through is a hypothetical: never a "verified" or research card, never an outcome number on screen; the compounding view is an illustration labelled as one (no "$20 to millions" result).
- 398.88 "Who's holding it?" is a new spoken filter that WB1's three sieves (funding and backers, exchange listings, market cap) do not draw: the plan decides whether WB1 adds a holders label; it is never drawn or captioned as a rug-pull or team-dump check.
- 257.98 "when everything is so far down and bottomed out" is his phrasing; no on-screen copy says the bottom is in (CH5 at 498.64: "I don't know if this is it").
- 44.48 ambiguous audio: "and I ran more than a 35X" (probably "it ran"); 253.42-254.66 "as CEO and in Nvidia" (the "and" is 0.78 s and "Nvidia." is p 0.16, probably "as CEO of Nvidia" or "at Nvidia"); 397.02 "the one" (probably "the ones"); 363.14 "four" (p 0.14). All are COVER lines with no caption; check by ear only if their words go on screen.
- Face-edge timing: Whisper ends "bank." at 359.46 and "plan." at 570.64, after the FACE pictures end (359.395, 570.567); "It" at 53.44 starts under FACE 3's last 0.12 s. Listen at those three joins in the draft (FACE 6's "can." is under its own picture since the 2026-11-23 repair, FACE 6 ends 471.195); the cover takes the frame at the measured picture edge, never at the Whisper word edge.
- WB1 measured: 387.74-411.54 (23.8 s; 22.98 s if it opens on "At the top" at 388.56), inside the 20 to 24 s window and the 30 s whiteboard cap.
- FACE 5 (348.395-359.395) is 11.0 s with no join inside it (face pauses kept): over the 5 to 8 s a single face-restyle generation holds (PROJECT-LOG face-swap note); Mike's call at the test.
- `[VERIFY]` items from DATA.md still open at render: Bitcoin 30-day change (minus 24.99%) and the change since the 2026-10-28 close · total crypto market cap 2.718T to 2.021T, around 697B · S&P 500 minus 11.6% and Nasdaq-100 minus 19.84% from the 2026-10-06 records, the worst week since April 2025 (minus 8.61%) · Nvidia minus 47.5% and its 2026-11-23 close · the SpaceX listing date (2026-06-12, search level) · Pieverse price, market cap and multiples · EVAA price, the 3.9x to 5.3x read and the 2026-11-27 unlock (not aired) · the showcase count (56 calls, 34 by a bot) · Mike's C19 captures (the Pieverse alert, an EVAA buy alert, the swing trading software's screen).
- Runtime measured: spine 590.23 s (9:50.2) + the CH1 montage 15.1 s + 3 card pauses of around 1.5 s = around 609.8 s (10:09.8) delivered, against the 10:00 ceiling (and the 8:45 target). Mike chose this pacing at GATE spine_review knowing the delivered length would be around 10:11 (measurement only).
