# every-job - AS-RECORDED (build the edit to THIS, not the plan)

_Shape copied from `skills/doc-reference/AS-RECORDED.reference.md` (2026-09-27). Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py` (run by the longform graph's `as_recorded` node). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (re-encode -> defumble (101 retake cuts) -> cover-blackout (17 face windows) -> coarse desilence 700 ms (285 cuts) -> NO burst removal (Mike heard no bursts at spine_review, 2026-10-07) -> two-zone desilence 400 ms intro / 600 ms body @66.4s (36 cuts; Mike's silence definition for this video, 2026-10-07) -> freeze fix (+5 frames of recorded tail after the closing line's "freeze", +0.1667 s) -> NO content cut). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.d.desilenced.mp4` - 1121.00 s (18:41.0; audio stream 1121.003 s, video stream 1120.967 s), 1920x1080, 30 fps nominal (r_frame_rate 30/1; see the frame-timing flag at the bottom). LOCKED: GATE spine approved by Mike 2026-10-07 09:19.
- **Transcript (cue source):** `spine/ALL.d.desilenced.medium-words.json` (Whisper medium, word-level, 215 segments, 3,327 words, NOT hand-edited; shifted +0.1667 s after 1075.28 by the freeze fix, noted in its `freeze_fix` key). Human-review breakdown: `spine/ALL.d.desilenced.segments.txt` (transcriber, 2026-10-07: mishear-corrected text, two words restored from a large-v3 pass; its times after 1075.28 read 0.167 s EARLY, the JSON is right).
- **Timecode chain:** `raw/2026-10-06 19-16-15.mkv` -> `ALL.lowbps.mp4` (re-encode, no shift) -> `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 101 retake cuts, 62:54 -> 42:20.8) -> `ALL.b.blackout.mp4.cover.json` (a -> b: picture blacked outside 17 face spans, 89.8 percent blacked, NO time shift) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms, 285 cuts, 1398.91 s removed; its `freeze_fix` extends the keep that ends at b 2461.520 to 2461.687, +0.167 s) -> `ALL.d.desilenced.map.json` (c -> d: two-zone 400 ms / 600 ms split at 66.4 s, 36 cuts, 22.46 s removed; the approved cut list shifted +0.1667 s after c 1095.44) -> `ALL.d.desilenced.freeze-fix.json` (d: everything after d 1075.28 sits 0.1667 s later than the pre-fix d, 1120.836 s -> 1121.003 s). No `.cuts.json` exists (no burst removal, no content cut). **Every timecode below is already a FINAL-spine coordinate (the shifted word JSON); the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.desilenced` (FINAL). The pre-fix c and d, the set-aside 250 / 500 pass and the discarded 35-cut re-detection live in `_previews/spine-bak/` and `spine/` backups; none of them is a cue source.
- **How to read the beat rows:** quotes are the transcript's words with only the listed mishears corrected; punctuation is added for reading only. Money and percentages are written the way he said them ("5,900 dollars", "6 percent"), because Whisper's dollar-sign and percent-sign tokens are notation, not words (and this file carries no dollar signs). `[[word]]` = spoken, restored from the large-v3 pass, NOT in the JSON. KEPT = the scripted line was said (minor wording drift noted); CHANGED = what the line claims, softens or attributes moved; AD-LIB = not in the script; DROPPED = scripted, not said.

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on the FINAL spine (non-black = FACE), plus a `d=0.03` pass on the first 2 s that measured the 5-frame black lead (0.000-0.167) the 0.3 s floor cannot see. Everything else is BLACK VIDEO and must be covered in the comp. Face 112.83 s = 10.1 percent / cover 1008.17 s = 89.9 percent (the 16 punctuation windows total 69.50 s = 6.2 percent; the community-pitch close F17 is 43.33 s). 17 windows carry the screenplay's 18 `[FACE]` lines (F1 holds both locked opening lines as one shot). Zero orphans: every window lands on a scripted `[FACE]` beat, and every scripted `[FACE]` beat has its window (CH6 has none, by Mike's ruling). F1 to F10 are the background-swap set (PROJECT-LOG 2026-10-07: Higgsfield video-to-video, Seedance 480p).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.167-10.400 | "First they told you learn to code, but then AI learned to code. So then they told you scratch that go learn a trade because a chatbot can't fix a toilet" | CH1 Beat 1 `[FACE]` x2 (both LOCKED `[SAY-EXACT]` lines, one shot) |
| 2 | 28.300-31.233 | "And the humanoid robots are showing up" | CH1 Beat 3 `[FACE]` (LOCKED) |
| 3 | 138.333-141.700 | "but what happens when the machines can do the new jobs too?" | CH2 Beat 3 `[FACE]` |
| 4 | 206.700-212.133 | "once the machine is all four. There is no economic reason to keep the human" | CH2 Beat 5 `[FACE]` |
| 5 | 303.467-305.800 | "but they're coming and they're coming fast" | CH3 Beat 4 `[FACE]` |
| 6 | 321.933-325.300 | "it's one robot for every trade in your house" | CH3 Beat 5 `[FACE]` |
| 7 | 452.200-454.400 | "and for most of these the machine is already there" | CH4 Beat 1 `[FACE]` |
| 8 | 550.767-556.533 | "but those data centers are where the robot's brain gets trained. So that one is coming" | CH4 Beat 9 `[FACE]` |
| 9 | 574.033-577.367 | "And believe it or not it climbs all the way up the pay ladder" | CH4 Beat 11 `[FACE]` (the climb) |
| 10 | 592.000-596.767 | "and trust me. I'm a programmer. I know what AI can do" | CH4 Beat 11 `[FACE]` (Mike's line) |
| 11 | 676.067-683.000 | "the day that machine exists no hospital pays eight hundred and thirty thousand dollars a year pay for hands to get tired" | CH4 Beat 13 `[FACE]` |
| 12 | 740.533-743.033 | "if nobody has a paycheck who buys anything" | CH5 Beat 3 `[FACE]` |
| 13 | 785.833-788.600 | "the industry survives the job inside of it doesn't" | CH5 Beat 5 `[FACE]` |
| 14 | 883.967-887.033 | "you stop being a worker and you start being an owner" | CH7 Beat 1 `[FACE]` |
| 15 | 1057.633-1062.267 | "and you can turn that paycheck into ownership while that paycheck still exists." | CH7 Beat 6 `[FACE]` |
| 16 | 1069.400-1075.267 | "The robots are coming for the paycheck, so own something that nobody can print, nobody can freeze" | CH8 Beat 2 `[FACE]` (LOCKED) |
| 17 | 1077.633-1120.967 | "And with that said I do have one of the most successful crypto groups out there ... I'll catch you guys later" (the off-script community pitch) | CH8 Beat 3 `[FACE]` (the close; FACE by Mike's ruling 2026-10-06) |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode (the word's start in the JSON). The word-time JSON stays un-edited; this list is re-applied at caption build. Source: the transcriber's 45 substitutions plus the locked-line ruling at the top.

- 1075.06 "free" -> "freeze" (LOCKED closing line, CH8 Beat 2. Mike's ruling 2026-10-07: the Z is on the recording; the freeze fix restored the word's tail and small.en now hears "freeze". The medium JSON was shifted, not re-transcribed, so it still reads "free". Captions MUST read "freeze".)
- 948.90 "Casper" -> "Kaspa" (persona `kaspa_spelling`).
- 1040.16 "Casper" -> "Kaspa" (persona).
- 960.00 "but tensor" -> "Bittensor" (project name).
- 960.46 "tau" -> "TAO" (persona `tao_spelling`).
- 1041.18 "tau" -> "TAO" (persona).
- 921.64 "x4o2" -> "x402" (the standard's name; must match the C17 / C41 graphics).
- 931.70 "Massacart" -> "Mastercard".
- 525.48 "car printers" -> "Carpenters" (the CH4 job title; must match its C4 card).
- 274.48 "old neo" -> "called NEO" (large-v3 confirms; the product is NEO, all caps).
- 271.80 "1x" -> "1X" (company name).
- 132.60 "freeze up money" -> "frees up money" (homophone; matters because the video says "freeze" about money in CH6 and CH7).
- 208.24 "all for" -> "all four" (the four-part test, FACE F4).
- 396.44 "medium plumber" -> "median plumber" (BLS median pay).
- 243.74 "figure two?" -> "Figure 02" (robot model name).
- 652.60 "in his own in" -> "on his own. In" (large-v3 confirms; "his" stays, it is what he said).
- 654.68 "John Hopkins" -> "Johns Hopkins" (institution spelling; he says it without the s).
- 657.26 "gold-bladder" -> "gallbladder".
- 661.50 "unpicked tissue" -> "on pig tissue" (large-v3 confirms; this is the guard [!WARNING 4] phrase, so it must caption correctly).
- 215.54 "Anthropics" -> "Anthropic" (company name; he adds an s).
- 12.50 "trained to be a plumber" -> "train to be a plumber" (Hinton's words, also burned in on C20).
- 280.04 "deliveries promise" -> "deliveries promised" (large-v3 confirms; the guard [!WARNING 2] phrase).
- 1060.10 "Well that paycheck" -> "while that paycheck" (FACE F15; large-v3 confirms).
- 102.16 DROPPED WORD: "19 behind" -> "19 percent behind" (medium dropped "percent", large-v3 hears it; NOT in the JSON, the caption build must add it).
- 925.06 DROPPED WORD: "software pays software in" -> "software pays software in stablecoins" (NOT in the JSON, inside the long "in" / "In" tokens 925.06-926.36; the caption build must add it).
- 1103.95 "for you to noobs" -> "for you too. Noobs".
- 866.92 "stable coin" -> "stablecoin"; 940.54 "stable coins" -> "stablecoins".
- 953.64 "pre mine" -> "premine".
- 553.16 "robots brain" -> "robot's brain".
- 529.94 "3d printed" -> "3D-printed".
- 8.66 "chat bot" -> "chatbot".
- 1116.77 "crypto rich VIP" -> "Crypto Rich VIP" (community name, domain cryptorich.vip; the persona has no spoken-name spelling).
- Casing: 14.18 "ceo" -> "CEO" · 14.92 "nvidia" -> "Nvidia" · 85.56 and 101.04 "ai" -> "AI" · 94.26 "stanford" -> "Stanford" · 917.02 "coinbase" -> "Coinbase" · 336.98 "the matrix" -> "The Matrix" · 646.26 "Da Vinci" -> "da Vinci".
- Number format: 31.30 "13 000" -> "13,000" · 606.20 "1600 AI enabled" -> "1,600 AI-enabled".
- Spurious question marks: 362.86 ("a human electrician?") · 416.00 ("contractor to do?") · 454.50 ("cashiers?").
- Caption notation only (not mishears, listed because they reach the screen): Whisper writes six money amounts as dollar-sign tokens (5,900 at 264.42, 20,000, 499 twice, 64,000, 6,000, 830,000 at 638.96), written here as "dollars", the way he said them, and spells out three numbers, 600.32 "four hundred and twenty thousand dollars", 679.04 "eight hundred and thirty thousand dollars", 829.28 "fifty two point eight percent". The digit form at caption build is the captions skill's call.
- DO NOT CORRECT (heard the same by medium AND large-v3, said differently from the script; Mike's ruling 2026-10-07: they stay, captions follow the audio): 286.04 "turn on lights" · 891.48 "order" (a quarter of a million acres) · 957.12 "minted" · 1055.92 "payment machines" · 424.22 "doing" (likely "during") · 652.80 "his own".

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE SAFE JOB (0.00-62.94) · card OFF · Bed A sleeper-cell

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "First they told you learn to code, but then AI learned to code." | KEPT (locked `[SAY-EXACT]` `[FACE]` F1; minor wording drift: "but then AI learned" for "Then AI learned") |
| 3.98 | "So then they told you scratch that go learn a trade because a chatbot can't fix a toilet" | KEPT (locked `[SAY-EXACT]` `[FACE]` F1; drift: "So then they told you" for "So they told you"; "learn a trade" as required, never "learn to trade") |
| 10.40 | "The godfather of AI said it, train to be a plumber, and the CEO of Nvidia said we're going to need hundreds of thousands of electricians, plumbers and carpenters" | KEPT (locked `[SAY-EXACT]` `[COVER]`; drift: "said" for "says") |
| 20.40 | "But listen to how the godfather of AI finished that sentence, a good bet would be to be a plumber until the humanoid robots show up" | KEPT |
| 28.36 | "And the humanoid robots are showing up" | KEPT (locked `[SAY-EXACT]` `[FACE]` F2; drift: a leading "And") |
| 31.30 | "about 13,000 of them shipped in 2025 and one of them held a job at a BMW factory for 11 months" | KEPT (locked `[SAY-EXACT]` `[COVER]`, word for word; `[VERIFY]` the Omdia count) |
| 39.20 | "And the day that one of those work inside of your house you don't need to call a plumber. You don't need to call an electrician, you don't need to call a roofer" | KEPT (drift: "you don't need to call" x3 for "you don't call", "work" for "can work") · guard [!WARNING 2] HELD (future "the day", never present tense) |
| 47.98 | "and it just doesn't stop with people who work with their hands, it goes all the way up even to brain surgeons" | KEPT (drift: "even to brain surgeons" for "to the brain surgeon") |
| 53.76 | "now. There's a way to protect yourself from all this, we're going to get to that, but first you need to see how deep this goes" | KEPT (the open loop HELD: no answer named before CH7; drift: "from all this, we're going to get to that" for "and we're gonna get to it") |
| 60.14 | "so let's go through it all piece by piece" | KEPT (Mike's handoff pick; drift: "it all" for "it") |

### CH2 - THE BRAIN WENT FIRST (62.94-232.66) · card ON "THE BRAIN WENT FIRST" · Bed B harvester

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 62.94 | "So before the robot the brain went first, every wave of automation before this one went after muscle, the factory, the assembly line, this one went after knowledge work, the office." | KEPT (drift: "So" for "Now") |
| 74.36 | "It's called labor substitution, the machine doesn't help the worker, it replaces the worker" | KEPT |
| 79.76 | "And it's already showing up, in the first nine months of 2026 companies blamed AI for more than a hundred and twenty thousand announced job cuts, that's about seven times the same stretch a year earlier" | KEPT · guard [!WARNING 5] HELD ("companies blamed AI", "announced job cuts", never "AI killed") |
| 93.80 | "and Stanford looked up real payroll data, workers aged from 22 to 25 and the jobs most exposed to AI are running about 19 [[percent]] behind the people the same age in less exposed jobs" | KEPT (drift: "looked up" for "looked at"; "and the jobs" as heard, see Flags; "percent" restored, see Mishears) |
| 106.48 | "now, but unemployment is still 4.2 percent. So this is not mass unemployment, not yet, at least it's starting at the door with the entry-level job" | KEPT (the honest ceiling is said) · guard [!WARNING 5] HELD |
| 116.10 | "And every time I say this somebody's like, relax, technology always creates new jobs." | KEPT |
| 121.60 | "But what if we try to dissect the meaning of that phrase? Technology creates new jobs. The truth is it isn't like that at all" | KEPT (Mike's own wording; drift: "But what if we try" for "But if we try", "that phrase" for "this phrase") |
| 129.86 | "technology makes things cheaper, cheaper frees up money, that money builds new markets and the new markets need workers" | KEPT |
| 138.14 | "but what happens when the machines can do the new jobs too?" | KEPT (`[FACE]` F3; drift: "machines" for "machine") |
| 141.86 | "Then the chain breaks at the very last link" | KEPT |
| 144.88 | "And we've seen what that looks like, in the early 1900s the telephone operator was one of the most common jobs for American women, then came automatic switching and most of those jobs were gone" | KEPT |
| 155.66 | "the next generation found other work but the women already in that job often ended up in lower paying work or out of work" | KEPT |
| 162.84 | "and then there's the horse, around 1915 America had more than 20 million horses, by 1960 a few million, the car didn't create a new job for the horses" | KEPT · guard [!WARNING 6] HELD ("more than 20 million", never "26 million"; `[VERIFY]` USDA) |
| 174.44 | "now don't get me wrong there, back then the new jobs did show up and it boosted the economy tremendously, somebody had to install those new switchboards, somebody had to assemble the new cars and build all the parts that went along with those cars" | CHANGED (ad-libbed clauses "don't get me wrong there" and "and it boosted the economy tremendously"; "all the parts that went along with those cars" for "all the car parts") |
| 191.20 | "but what if every one of those car parts is built by a machine and nobody needs to hire anybody to make them" | KEPT |
| 198.84 | "So, how do you know when a job is in trouble? It comes down to four words, better, faster, cheaper, safer" | KEPT (no credit, per Mike's no-Shapiro ruling) |
| 206.74 | "once the machine is all four. There is no economic reason to keep the human" | KEPT (`[FACE]` F4; drift: "the machine" for "a machine", "no economic reason to keep" for "no economic reason left to keep") |
| 212.14 | "and people building this are putting dates on it, the CEO of Anthropic says the AI could displace half of all entry-level white-collar jobs in the next one to five years" | KEPT ("could" kept) · guard [!WARNING 1] HELD (Amodei's "one to five years"; "3 years" is said nowhere in the take) |
| 223.68 | "but all of that AI is stuck inside a screen, it's a brain with no body and that's exactly why they told you to go pick up a wrench" | KEPT (drift: "is stuck" for "is still stuck") |

### CH3 - THEN IT GOT A BODY (232.66-445.96) · card ON "THEN IT GOT A BODY" (mid-bed exception, OPEN) · Bed B harvester continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 232.66 | "So where are the robots right now? I'm gonna split it three ways, what's already deployed, what's being claimed and what's coming" | KEPT (CH3 opens here, NOT on the alternate spoken line "And then it got a body.") |
| 240.98 | "Deployed. A humanoid robot called Figure 02 worked at a BMW plant in Spartanburg for 11 months, 10-hour shifts Monday through Friday, and loaded more than 90,000 parts and helped build more than 30,000 cars" | KEPT (drift: "a BMW plant" for "BMW's plant") · guard [!WARNING 2] HELD (the 10-hour shifts said; "helped build") |
| 256.56 | "that's one robot model doing one task, loading sheet metal, but it held a job" | KEPT |
| 262.26 | "and you can buy a humanoid body for 5,900 dollars, the company says that one is remote control. So the body is cheap, worker isn't there yet" | KEPT (drift: "remote control" for "remote-controlled", "worker isn't" for "The worker isn't"; `[VERIFY]` Unitree price) |
| 270.06 | "Claimed. A company called 1X put a home humanoid on sale called NEO, 20,000 dollars or 499 dollars a month with deliveries promised for 2026" | KEPT · guard [!WARNING 2] HELD ("deliveries promised", never "in people's homes"; `[VERIFY]` delivery status) |
| 281.56 | "the company says it shows up able to open doors, fetch things and turn on lights, and for anything it doesn't know a remote human expert guides it through" | CHANGED ("turn on lights" for "turn off the lights"; RESOLVED by Mike 2026-10-07: stays, captions follow the audio) |
| 290.98 | "and it claims that one AI brain runs every behavior across its robots and that skill can be picked up just by talking to it" | CHANGED ("it claims" for "Figure claims": Figure is never named, so right after the NEO lines the claim reads as 1X's; "that skill" for "that a new skill"; see Flags) |
| 299.14 | "Now there's no robot plumber right now. There's no robot electrician," | KEPT · guard [!WARNING 2] HELD (said once, upfront) |
| 303.52 | "but they're coming and they're coming fast" | KEPT (`[FACE]` F5) |
| 305.78 | "I think we're only just a few years away and here's why" | KEPT ("I think" kept; drift: "only just a few" for "only a few") |
| 308.94 | "The house is built for a humanoid body, the doorways, the stairs, the ladder, the crawlspace, every tool in your garage, so a machine with a human body can use all of it" | KEPT (drift: "The house is built for a humanoid body" for "A house is built for a human body") |
| 319.30 | "and that means is not just one robot per trade" | KEPT (drift: "that means is not just" for "that means it's not") |
| 321.92 | "it's one robot for every trade in your house" | KEPT (`[FACE]` F6) |
| 325.32 | "the plumber, the electrician, the roofer, the HVAC tech, the carpenter, that's about 2.8 million jobs in America in just those five trades" | KEPT (`[VERIFY]` the 2,829,100 sum) |
| 335.44 | "And imagine like in The Matrix you're jacked in, you can upload a program to your brain to learn a whole new skill, just like how to be a helicopter pilot or to be a kung fu master or in this case how to be an expert electrician" | KEPT (Mike's Matrix line; drift: a leading "And", "just like" for "Like") |
| 350.12 | "and not only that, you'd have the combined knowledge of every single expert electrician on the entire planet instantly, basically anything that every expert electrician could have ever known, that is going to be the power of a robot in your own house" | CHANGED (ad-libbed insert "basically anything that every expert electrician could have ever known" and "and not only that"; "that is going to be the power of a robot" for "That's gonna be the power of the robot") |
| 366.60 | "a human electrician needs a four or five year apprenticeship, a robot needs a download" | KEPT (drift: "a robot" for "The robot") |
| 371.44 | "and it's not just repairs, that same robot is going to be your security guard, it doesn't sleep and it could be standing in your hallway at 3 in the morning" | KEPT (drift: "it could be standing" for "it's standing", softer, not stronger) · guard [!WARNING 2] HELD (forecast, never a present fact) |
| 379.88 | "so when somebody tries to break into your house and torture you for your crypto private keys, it'll function better than a guard dog" | KEPT (the one passing crypto mention before the last quarter, by Mike's choice) |
| 388.42 | "and you don't even have to feed it, you just plug it in and make sure it's charged, and you don't even have to clean up its poop" | KEPT |
| 394.78 | "And then there's the math, the median plumber in America makes about 64,000 dollars a year, that home robot rents for 499 dollars a month and that's under 6,000 dollars a year" | KEPT · guard [!WARNING 3] HELD (no cost per hour spoken) |
| 406.34 | "so right now that robot can't do a plumber's job, not yet, but the day a machine at that price can, the math is brutal and the machine doesn't need weekends" | KEPT (drift: "the machine doesn't need weekends" for "a machine doesn't need weekends") · guards [!WARNING 2] and [!WARNING 3] HELD (conditional "the day"; weekends as the forecast) |
| 416.00 | "how many times throughout my life I wanted to schedule something with a contractor to do something and they only wanted to do it doing a nine-to-five schedule when it was the most difficult time period for me, I remember there's been points in my life when I asked somebody if they could do it on the weekend and I pay them, I'd even pay them extra, and I didn't, they didn't want to do it, so there could be a little bit of a convenience factor there, okay" | AD-LIB (the contractor and weekends story, not in the script; "doing" is likely "during", left as said) |
| 440.60 | "so that's the house, now let's go job by job and see if yours is on the list" | KEPT |

### CH4 - THE LIST (445.96-704.04) · card ON "THE LIST" · Bed C continuum

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 445.96 | "So here's a list, same pattern every time, the job, how many people do it and why it's at risk" | KEPT (drift: "a list" for "the list") |
| 452.26 | "and for most of these the machine is already there" | KEPT (`[FACE]` F7; drift: "there" for "here") |
| 454.50 | "Cashiers. 3.1 million jobs at risk because of self-checkout and online shopping and the government's own forecast already has this job shrinking at 6 percent" | KEPT (drift: "shrinking at 6 percent" for "shrinking 6 percent") |
| 464.32 | "Taxi drivers, 456,000 jobs at risk because Waymo has driven 271 million miles with nobody behind the wheel and by its own numbers 95 percent fewer serious injury crashes than human drivers" | KEPT ("by its own numbers" kept; `[VERIFY]` 271.3 million) |
| 478.80 | "Warehouse workers, 6.9 million jobs at risk because Amazon has already deployed a million robots" | KEPT · guard [!WARNING 5] HELD (the 600,000 report is not spoken; on screen only, with Amazon's reply) |
| 485.84 | "Customer service reps, 2.7 million jobs at risk because the CEO of Salesforce said he cut his support team from 9,000 people to about 5,000 because in his own words he needs less heads" | KEPT (drift: "in his own words" for "in his words") |
| 500.56 | "Roofers, 167,000 jobs at risk because of a robot called Rufus gets winched across the roof nailing down shingles. This one is still a pilot for now" | KEPT (drift: "because of a robot" for "because a robot"; `[VERIFY]` pilot status) |
| 512.04 | "Truck drivers, 2.2 million jobs at risk because driverless trucks have already logged nearly 440,000 miles and the company reports zero collisions caused by its driver" | KEPT |
| 525.48 | "Carpenters, 890,000 jobs at risk because a company in Texas 3D-printed the walls for about a hundred homes and went from five building crews down to one crew and one printer" | KEPT |
| 538.00 | "Electricians, 821,000 jobs. There's no robot electrician right now, the government even has this job growing 9 percent, and guess why?" | KEPT (ad-libbed tag "and guess why?") · guard [!WARNING 2] HELD |
| 547.20 | "Because somebody has to wire all those AI data center" | KEPT (drift: "data center" for "data centers", as heard) |
| 550.90 | "but those data centers are where the robot's brain gets trained. So that one is coming" | KEPT (`[FACE]` F8) |
| 556.66 | "Plumbers, 511,000 job, the job they told you was safe and right now it is, there's no robot plumber" | KEPT ("job" singular as heard) · guard [!WARNING 2] HELD |
| 565.20 | "but every pipe in your house was built for human hands and a machine with human hands doesn't need a few years of apprenticeship, it needs a download. I give it just a few years" | KEPT (drift: "a few years of apprenticeship" for "years of apprenticeship", "I give it just a few years" for "I give it a few years") |
| 574.14 | "And believe it or not it climbs all the way up the pay ladder" | KEPT (`[FACE]` F9; drift: "believe it or not" added, "all the way up" for "right up") |
| 577.42 | "computer programmers. Remember learn to code, 111,000 jobs at risk because Google says 75 percent of its new code is now generated by AI and the government already projects this job to shrink by 7 percent" | KEPT (pays off the CH1 hook) |
| 592.16 | "and trust me. I'm a programmer. I know what AI can do" | KEPT (`[FACE]` F10; drift: a leading "and") |
| 596.94 | "Radiologists, 29,000 jobs at about four hundred and twenty thousand dollars a year at risk because the FDA has already authorized more than 1,600 AI-enabled medical devices" | KEPT |
| 609.00 | "and you've probably seen the clip of Jensen Huang, the CEO of Nvidia, the first job AI will destroy is radiology, nobody should go into this field" | KEPT · guard (DATA.md section 4, the Huang clip) now carried ONLY by the burned-in context caption, see the next row |
| 618.00 | (not said) | DROPPED: "Now, he was repeating a warning from about 10 years ago. And his point is, it didn't happen, the number of radiologists went up." RESOLVED by Mike 2026-10-07 (the clip goes in as is; the burned-in context caption is the honesty guard) |
| 618.00 | "now. It hasn't happened yet" | CHANGED ("It hasn't happened yet" for "My point is, it hasn't happened yet": with the context gone it follows the quoted prediction directly) |
| 619.54 | "but he also says that every radiology platform today is driven by AI, so right now the AI is a tool in the doctor's hands, right now" | KEPT (drift: "but he also says" for "Because he also says") |
| 629.40 | "and if I was picking a career right now I would not be choosing radiology" | KEPT (Mike's opinion, said as his; drift: "I would not be choosing radiology" for "it would not be radiology") |
| 633.52 | "And at the very top of the ladder, the brain surgeon, the average neurosurgeon in America makes about 830,000 dollars a year, the highest-paid specialty in medicine" | KEPT · guard [!WARNING 4] HELD (830,000, never "900K") |
| 642.72 | "more than 3 million surgeries were done with a da Vinci robot in 2025 but every one of them had a surgeon at their control. It's a tool" | KEPT (drift: "at their control" for "at the controls") · guard [!WARNING 4] HELD (surgeon-controlled said) |
| 651.24 | "so here's what the robot has done on his own. In 2025 at Johns Hopkins a robot did the hardest part of a gallbladder removal, 17 steps in a row, no human hand, on pig tissue this time" | KEPT (drift: "his own" for "its own", "this time" added) · guard [!WARNING 4] HELD ("on pig tissue" said) |
| 662.90 | (not said) | DROPPED: "Never on a human." OPEN (the C9 autonomy ladder's "HUMAN: not yet" rung carries it on screen) |
| 662.90 | "there may be no robot surgeon for sale right now, but the day there is it costs a whole lot less than that surgeon and it never takes a day off, it never goes home and never sleeps" | CHANGED ("there may be no robot surgeon for sale" for "There's no robot surgeon for sale": a hedge on a fact, none is for sale; "a whole lot less" for "less") · guard [!WARNING 4] HELD (the cost hangs on "the day there is"; no "half the cost") |
| 676.08 | "the day that machine exists no hospital pays eight hundred and thirty thousand dollars a year pay for hands to get tired" | KEPT (`[FACE]` F11; drift: "pay for hands to get tired" for "for hands that get tired") |
| 683.08 | "And then it flips, once the machine is safer letting a human hold a knife could start to look unethical, maybe even illegal, the same thing with driving" | KEPT ("could" and "maybe" kept; drift: "a knife" for "the knife") · guard [!WARNING 4] HELD (said as a hypothetical) |
| 692.18 | "if humans cause tens of thousands of accidents per year but a self-driving car doesn't cause any accidents at all. It's really a no-brainer" | AD-LIB (an absolute safety line, not in the script; RESOLVED by Mike 2026-10-07: stays as said, he means the day self-driving is perfected; see Flags) |
| 700.60 | "there's no law like that now, but look at where safer leads" | KEPT (drift: "now" for "right now") |

### CH5 - WHAT IT DOES TO THE ECONOMY (704.04-809.76) · card ON "WHAT IT DOES TO THE ECONOMY" · Bed D tesseract

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 704.04 | "So what does all this do to the economy, two things and they pull in opposite directions" | KEPT |
| 708.60 | "The first one is price collapse and it's already happened to the things the machine makes, the cost of running AI at the same level of quality has dropped more than 280 times in about two years" | KEPT |
| 720.46 | "but your rent didn't, since late 2023 consumer prices have gone up about 9 percent" | KEPT · guard [!WARNING 6] HELD (never "the cost of living is collapsing") |
| 726.16 | "now picture a machine doing most of the work, the optimists say the cost of living could fall by as much as 10 times, I hope they're right, but it's a hope that hasn't shown up yet" | KEPT · guard [!WARNING 6] HELD ("the optimists say", no name) |
| 734.94 | "The second one is a scary one, about two-thirds of the entire US economy is regular people spending money" | KEPT |
| 740.62 | "if nobody has a paycheck who buys anything" | KEPT (`[FACE]` F12) |
| 743.10 | "a business doesn't make things for people with no money and that's one of the biggest risks of all, it hasn't happened yet. Well, this is where I think it's heading" | KEPT (drift: "Well" for "But") |
| 749.76 | "So which industries make it. Here's how I see it, the survivors, raw materials and energy, chips, robotics because in a gold rush you sell the pickaxes, water, farming, solar and nuclear, and experiences, restaurants, travel, vacations" | KEPT (said as Mike's own forecast, no name) |
| 764.50 | "and the ones I'd expect to go extinct or change so much that you won't recognize them, probably health care as we know it, definitely universities, insurance and thin margin finance and of course, Hollywood" | CHANGED (ad-libbed qualifiers "probably", "definitely", "of course"; "I'd expect" for "I expect") |
| 776.72 | "now they don't even need actors," | AD-LIB (not in the script; see Flags) |
| 778.32 | "But look at that survivor list again, we're still gonna need steel and food and power even if every bit of it is made by machines" | KEPT |
| 785.92 | "the industry survives the job inside of it doesn't" | KEPT (`[FACE]` F13; drift: "inside of it" for "inside it") |
| 788.80 | "so if labor gets cheap and services get cheap what holds its value, the things you can't make more of, land, energy, computing power" | KEPT |
| 797.12 | "and that's one fact I'm gonna drop right here, the largest private owner of farmland in America is a software billionaire, Bill Gates, almost 250,000 acres of it" | KEPT (drift: "that's one fact I'm gonna drop right here" for "here's a fact I'm just gonna leave right here") · guard [!WARNING 6] HELD (a bare fact, no motive) |
| 807.76 | "most of us can't buy land like that" | KEPT |

### CH6 - WHO HOLDS THE CARDS (809.76-879.56) · card OFF · Bed D tesseract continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 809.76 | "Now we get to the part that actually worries me, a society runs on a three-way deal, government, business and working people" | KEPT |
| 816.58 | "and the reason working people get a seat at the table is that the other two need our labor" | KEPT |
| 821.34 | "That seat is already shrinking, in the second quarter of 2026 the share of the economy's output that goes to the workers hit fifty two point eight percent, that's the lowest ever recorded in data going back to the year 1947" | KEPT (`[VERIFY]` labor share) |
| 835.88 | "labor was your leverage" | KEPT (`[COVER]` by Mike's ruling) |
| 837.98 | "take away the need for labor and government and businesses are holding all the cards" | KEPT |
| 842.90 | "And the fix everybody reaches for is a check, Elon Musk, the guy building robots, posted himself universal high income via checks issued by federal government" | KEPT (drift: "posted himself" for "posted it himself") |
| 852.96 | "maybe that check comes, I call it what it is, it's an allowance" | KEPT (drift: "I call it what it is" for "But call it what it is") |
| 856.66 | "and whoever sends the allowance sets the rules" | KEPT (`[COVER]` by Mike's ruling) |
| 859.92 | "and this isn't just theory, under a US law signed in July of 2025 every company that issues a stablecoin, that's a private digital dollar, has to be able to seize it, freeze it or burn it when legally required" | KEPT · guard [!WARNING 7] HELD (US law; no CBDC or Carstens line) |
| 875.18 | "so some digital money can be frozen by design and some can't" | KEPT |

### CH7 - HOW TO PROTECT YOURSELF (879.56-1062.48) · card ON "HOW TO PROTECT YOURSELF" · Bed E story-of-my-life

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 879.56 | "So then how do you protect yourself? You stop depending on selling your time" | CHANGED ("depending on selling your time" for "depending only on selling your time": "only" not said, so the line reads absolute) |
| 884.08 | "you stop being a worker and you start being an owner" | CHANGED (`[FACE]` F14; "a worker" for "just a worker", "you start being an owner" for "you become an owner") |
| 887.18 | "own what stays scarce and own what nobody controls, Bill Gates can order a quarter of a million acres of farmland, you and I maybe we can't, but anybody with a phone can own a digital asset that's provably scarce" | CHANGED ("order" for "own", RESOLVED by Mike 2026-10-07: stays; "you and I maybe we can't" for "You and I can't") |
| 899.64 | "there will only ever be 21 million Bitcoin and almost 96 percent of them already exist" | KEPT (`[VERIFY]` BTC supply) |
| 904.90 | "And here is why I think crypto doesn't just survive in an AI world, it flourishes, first, machines need money, an AI agent can't walk into a bank and open an account" | KEPT |
| 916.16 | "the CEO of Coinbase makes that case and his product is already live." | CHANGED (the disclosure "and yes, he sells the product" was not said; "his product is already live" folds it into the next line; see Flags) |
| 920.00 | "There's an open standard called x402 where software pays software in [[stablecoins]]. In one 30-day stretch about 75 million payments averaging 32 cents each and Visa and Mastercard have joined a foundation behind it" | KEPT (drift: "a foundation" for "the foundation") · guard [!WARNING 8] HELD (75 million and 32 cents only) |
| 933.82 | "now I know that sounds tiny, about 24 million dollars a month, but that's really what early looks like" | KEPT |
| 939.12 | "Second, those stablecoins are the ones that can be frozen, so the money I care about is the money with no issuer and no gatekeeper" | KEPT |
| 947.54 | "Bitcoin is that and Kaspa is that, proof of work, fair launched in November of 2021 with no premine and no insider allocation, every coin minted out in the open" | CHANGED ("minted" for "mined", RESOLVED by Mike 2026-10-07: stays; see Flags) · guard [!WARNING 8] HELD (architecture only; no TPS; no holder argument) |
| 958.30 | "and on the AI side there's Bittensor, TAO, an open AI network with a hard cap of 21 million, the same as Bitcoin" | KEPT · guard [!WARNING 8] HELD (no fair-launch claim for TAO) |
| 965.70 | "the more governments and corporations race to control compute, money and AI, the more valuable the open source versions get, that's my thesis" | KEPT (drift: "open source versions" for "open versions") |
| 974.66 | "now there's a catch, if nobody can freeze your money the only way to take it is to come to your house" | KEPT |
| 980.16 | "and that has been happening, in the first six months of 2026 a security firm counted 52 verified attacks on crypto holders, kidnappings, torture and home invasions went from 1 to 20 in a year." | KEPT (drift: "that has been happening" for "that's happening"; the list wording is the script's, see the Flags trap; `[VERIFY]` CertiK) |
| 995.02 | "So remember that robot standing in your hallway at 3 a.m, that's a security guard that you might want to get" | CHANGED ("that's a security guard that you might want to get" for "That's the security guard I want": aimed at the viewer instead of Mike's own want) · guard (DATA.md section 4, the home robot guard as a present fact) HELD (said as a want) |
| 1001.18 | "Third, machines make things cheaper and that's deflation, Jeff Booth wrote a book on this and his line is the natural state of a free market is deflation" | KEPT (drift: "a book" for "the book") |
| 1010.42 | "but the US money supply is already at an all-time high, about 23.3 trillion dollars, and I think when people lose their paychecks the government starts sending out those checks just like Elon said, and to pay for them, it prints money. So that number gets a lot higher" | KEPT · guard [!WARNING 7] HELD (the printing is Mike's expectation, "I think"; `[VERIFY]` M2) |
| 1027.26 | "cheaper goods, more dollars, I believe the scarce assets soak up that difference over the long run. That's my conviction, it's not a promise" | KEPT ("it's not a promise" said) · guard [!WARNING 8] HELD |
| 1036.18 | "and nothing here is financial advice" | AD-LIB (a protective disclaimer, not in the script) |
| 1038.12 | "and as I'm recording this Bitcoin, Kaspa and TAO are trading well below their all-time highs" | KEPT (drift: "are trading" for "are all trading") · guard [!WARNING 8] HELD (no "absorbing the inflation"; `[VERIFY]` distance from the highs) |
| 1044.14 | "which implies a good time to get in, do your own research" | AD-LIB (a timing opinion, not in the script; no price, target or multiplier; RESOLVED by Mike 2026-10-07: stays as said) · guard [!WARNING 8] tested, ruled by Mike |
| 1047.70 | "So why now, because I think that we're in a 1992 of the AI build out. It's early, 13,000 humanoid robots shipped in a year, payment machines measured in cents" | CHANGED ("payment machines" for "machine payments", RESOLVED by Mike 2026-10-07: stays; "we're in a 1992 of the AI build out" for "we're at 1992 in the AI buildout"; "I think" kept) |
| 1057.76 | "and you can turn that paycheck into ownership while that paycheck still exists." | CHANGED (`[FACE]` F15; "you can turn that paycheck" for "you can only turn a paycheck": "only" not said, so the why-now urgency is softer) |

### CH8 - THE CLOSE (1062.48-1121.00) · card OFF · Bed E story-of-my-life continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 1062.48 | "So that's a whole picture, the brain went first, then it got a body and the list of safe jobs keeps getting shorter" | KEPT (drift: "a whole picture" for "the whole picture") |
| 1069.56 | "The robots are coming for the paycheck, so own something that nobody can print, nobody can freeze" | KEPT (locked `[SAY-EXACT]` `[FACE]` F16; drift: "that nobody can print, nobody can freeze" for "nobody can print, and nobody can freeze"; "freeze" per Mike's ruling 2026-10-07, the JSON reads "free") |
| 1075.45 | "and do it while you still have a paycheck to do it with" | KEPT (locked `[SAY-EXACT]` `[COVER]`, word for word; times are post freeze fix) |
| 1077.85 | (not said) | DROPPED: "If you like this vid, click the like button, and comment below, name one job you think a robot can never do. The government expects home health aides to grow 18 percent, so maybe start there." RESOLVED by Mike 2026-10-06 (the off-script pitch is the FACE close; the like ask survives at 1118.51); the comment-prompt lower-third with no spoken ask is OPEN |
| 1077.85 | "And with that said I do have one of the most successful crypto groups out there by many many metrics, whether you're an advanced trader and you're looking for a community with a lot of software to help you, a lot of insider alerts and bots and so on, stuff that normal communities don't typically have, right, like I said I'm a programmer, or if you're a newbie and you want to get into the crypto space my group would be good for you too. Noobs are welcome and we have a lot of courses and you can ask the question to a group of like-minded people and myself will be happy to help" | AD-LIB (the off-script community pitch, `[FACE]` F17 by Mike's ruling 2026-10-06; it replaces the scripted close) |
| 1114.25 | "click the link in the description below, ask for Crypto Rich VIP, and hit the like and subscribe button. I'll catch you guys later" | CHANGED (the scripted "click the link in the description, to get involved in the best community ever. I'm gonna catch you guys, later." said in his own words, plus the like and subscribe ask; `[FACE]` F17; "later" runs to the spine end, clamp at 1121.00) |

## Divergences from SCREENPLAY.md

- **Dropped:**
  1. 618.00 CH4 Beat 12, the Huang context sentence ("Now, he was repeating a warning from about 10 years ago. And his point is, it didn't happen, the number of radiologists went up.") - RESOLVED by Mike 2026-10-07 (it stays out; the clip goes in as is; the burned-in context caption "Jensen Huang, June 2026, repeating a warning made about 10 years earlier" on every frame of the clip is now the only honesty guard).
  2. 662.90 CH4 Beat 13, "Never on a human." - OPEN ("on pig tissue" was said; the C9 ladder's "HUMAN: not yet" rung carries the rest on screen).
  3. 916.16 CH7 Beat 2, "and yes, he sells the product" - OPEN (DATA.md: "He sells the product: say so". R12's on-screen note "Coinbase sells agent wallets" carries the disclosure).
  4. 1077.85 CH8 Beat 3, the comment ask, the home health aides line and "to get involved in the best community ever" - RESOLVED by Mike 2026-10-06 (the off-script community pitch is the FACE close). OPEN: whether the "NAME ONE JOB A ROBOT CAN NEVER DO" lower-third and its BLS home-health-aides line still ride over the face with no spoken ask.
  5. Not a drop, but it bears on an open ruling: the alternate CH3 opener "And then it got a body." was not said (CH3 opens at 232.66 on "So where are the robots right now?"). The CH3 title card (keep it as the mid-bed exception on Harvester's step-up, or drop it) is still OPEN; if the card goes, no spoken line names the chapter (the CH8 recap at 1062.48 still says "then it got a body").
- **Changed (what a line claims, softens or attributes):** 281.56 "turn on lights", 887.18 "order", 947.54 "minted", 1047.70 "payment machines" - all RESOLVED by Mike 2026-10-07 (stay; captions follow the audio). 290.98 "it claims" (Figure never named) - the words are RESOLVED (approved with the spine, 2026-10-07); the attribution is a graphics job, see Flags. OPEN (no ruling seen, the take stands, nothing proposed for cutting): 174.44 the ad-libbed clauses, 350.12 the ad-libbed insert, 618.00 "It hasn't happened yet" right after the quote, 662.90 "there may be no robot surgeon for sale", 764.50 the qualifiers, 879.56 and 884.08 "only" / "just" not said, 916.16 the disclosure, 995.02 "a security guard that you might want to get", 1057.76 "only" not said, 1114.25 the close's own wording.
- **Added (ad-libs):**
  - 416.00-440.08 the contractor and weekends story - RESOLVED (raised in the transcriber's flags; covered by Mike's "Everything else approved" at GATE spine, 2026-10-07).
  - 692.18-700.28 "if humans cause tens of thousands of accidents per year but a self-driving car doesn't cause any accidents at all. It's really a no-brainer" - RESOLVED by Mike 2026-10-07 (stays as said).
  - 1044.14-1047.08 "which implies a good time to get in, do your own research" - RESOLVED by Mike 2026-10-07 (stays as said).
  - 1077.85-1121.00 the community pitch - RESOLVED by Mike 2026-10-06 (FACE close) and 2026-10-07 (spine approved).
  - OPEN (no ruling seen; the take stands): 174.44 "don't get me wrong there" and "and it boosted the economy tremendously" · 350.12 "basically anything that every expert electrician could have ever known" · 546.20 "and guess why?" · 764.50 "probably" / "definitely" / "of course" · 776.72 "now they don't even need actors" · 1036.18 "and nothing here is financial advice".
- **Guards:**
  - [!WARNING 1] "AI gives us 3 years": HELD. "3 years" / "three years" is said nowhere in the take; the only spoken timeline is Amodei's "one to five years" at 212.14. A "3 YEARS" thumbnail has nothing in the video behind it.
  - [!WARNING 2] the household robot as something that exists: HELD at 39.20, 270.06, 299.14, 371.44, 406.34, 538.00, 556.66 (every one future tense, "the day", or "right now there's no").
  - [!WARNING 3] robot numbers (Optimus price or units, cost per hour, the bank forecasts): HELD; none is spoken.
  - [!WARNING 4] surgery, 900K, half the cost, "unethical or illegal": HELD at 633.52, 642.72, 651.24, 662.90, 683.08. "Never on a human." was dropped (see Dropped 2) but "on pig tissue" was said.
  - [!WARNING 5] mass unemployment, Amazon 600,000, Klarna: HELD at 79.76, 106.48, 478.80.
  - [!WARNING 6] cost of living, Gates's motive, the reference's numbers, 26 million horses: HELD at 162.84, 720.46, 726.16, 797.12.
  - [!WARNING 7] the Fed printing in the present tense, Carstens: HELD at 859.92 and 1010.42.
  - [!WARNING 8] the crypto close: HELD at 920.00, 947.54, 958.30, 1027.26, 1038.12. TESTED at 1044.14 ("which implies a good time to get in"): no price target and no promised outcome; RESOLVED by Mike 2026-10-07 (stays).
  - DATA.md section 4, the Huang clip: the spoken context was DROPPED at 618.00; the guard now rests ONLY on the burned-in context caption (RESOLVED by Mike 2026-10-07). The clip must not be trimmed to make the prediction look like his view.
  - DATA.md section 4, the home robot guard as a present fact: HELD at 371.44 ("it could be standing") and 995.02 ("a security guard that you might want to get").

## Flags carried into the edit

- 692.18 fact-framing trap: the VO says "a self-driving car doesn't cause any accidents at all"; no graphic says zero accidents. The only safety receipt is Waymo's own "95% fewer serious injury or worse crashes" (C29, its 2 s recall in Beat 14); Aurora's "zero Aurora Driver-attributed collisions" (company-reported, small) belongs to the truck card at 512.04 only.
- 290.98 fact-framing trap: the VO says "it claims" right after the 1X NEO lines, but the one-brain claim is Figure's (Helix, 2025-02-20). R3 must show the Figure name and date on screen; never put the claim on the 1X card (C26).
- 286.04 fact-framing trap: the VO says "turn on lights"; C26 shows 1X's own wording (turn off the lights) in its real pixels, and the captions follow the audio.
- 891.48 fact-framing trap: the VO says Gates "can order a quarter of a million acres"; C16 / C40 show "almost 250,000 acres of farmland (275,000 total), The Land Report": ownership, not an order.
- 957.12 fact-framing trap: the VO says "every coin minted out in the open"; C39 keeps kaspa.org's real words ("mined in the open"); no graphic says "minted".
- 1055.92 fact-framing trap: the VO says "payment machines measured in cents"; the EARLY card shows x402 machine payments (about 75 million payments in 30 days, average 32 cents, about 24M a month).
- 988.80 fact-framing trap: the VO says "kidnappings, torture and home invasions went from 1 to 20"; only home invasions went 1 -> 20 (CertiK: kidnappings 12 -> 16, torture unchanged at 4). The two-number card reads HOME INVASIONS only.
- 1044.14 fact-framing trap: "which implies a good time to get in" is spoken only; no on-screen text echoes it, and no price chart, target or multiplier goes on screen (C44 stays unused).
- 662.90 fact-framing trap: the VO hedges "there may be no robot surgeon for sale"; the graphics state the fact (none is for sale): C9 "HUMAN: not yet", the FORECAST badge from "the day there is".
- 618.00 fact-framing trap: with the context sentence gone, "It hasn't happened yet" follows the quoted prediction directly; the Huang clip never plays a frame without its context caption.
- 916.16 fact-framing trap: the "he sells the product" disclosure is not spoken; R12's on-screen note "Coinbase sells agent wallets" is required, not optional.
- 776.72 fact-framing trap: "now they don't even need actors" is opinion; no graphic presents an AI film as proof (DATA.md's AI features are found, not opened).
- 638.96 and 679.04: the VO rounds to "830,000" and "eight hundred and thirty thousand"; the card shows 829,161 a year (Doximity 2026). 600.32: "four hundred and twenty thousand" -> the card shows 420,860.
- 565.20: "doesn't need a few years of apprenticeship" is about plumbers; no apprenticeship length goes on the plumber card (DATA.md confirms the 4 or 5 years for electricians only, 366.60).
- 31.30 and 1053.44: "13,000 humanoid robots" is Omdia's 2025 estimate (IDC's about 18,000 was not opened); the card names the source.
- 98.84 ambiguous audio: "and the jobs most exposed" (p 0.23) may be "in the jobs" as scripted; set the caption by ear.
- 268.72 low-confidence word: "worker" (p 0.08) in "the body is cheap, worker isn't there yet"; a swallowed "the" is possible, nothing is added unless heard.
- 662.36 ambiguous phrasing: "on pig tissue this time there may be" (caption punctuation by ear: "this time" ends the gallbladder sentence or opens the next).
- 1114.25 / 1116.11 / 1117.81 low-confidence words: "Click" (p 0.03), "ask" (p 0.02), "VIP" (p 0.23) in the community-link line; check by ear before the lower-third and captions are set.
- Picture edges against word boxes (the comp cuts on the PICTURE edge, never the word box): the spine opens on 0.167 s (5 frames) of black under blackdetect's 0.3 s floor while Whisper clamps "First" to 0.00; 138.14 "But" starts 0.19 s before F3 opens (138.333); 206.18 "safer" runs into F4 (edge 206.700); 302.80 "electrician," runs into F5 (edge 303.467); 1077.71 "with", the last word of the locked COVER line, starts 0.08 s after F17's picture edge (1077.633), so the face is already up for the tail of "to do it with".
- JSON tail: "later" spans 1120.97-1121.19, past the audio end (1121.003) and the last video frame (pts 1120.933, stream end 1120.967). Clamp every cue at 1121.00.
- Frame timing: 30 fps nominal, but the video carries 33,576 frames over 1120.967 s (avg 29.95 fps): 53 one-frame timestamp holes (66.7 ms gaps, at 3.867, 20.333, 28.233 ... 1074.033, 1105.067). Run `check_spine_fps.py` at comp build; this document does not touch the spine.
- Map accounting: `ALL.c.desilenced.map.json` out_total (1141.887 s) is 1.40 s short of the real c file (1143.289 s, the d map's src_total), as PROJECT-LOG notes. Never remap old timecodes through the c map alone; every cue comes from the final word JSON.
- `[VERIFY]` items from DATA.md still open at render: Challenger 120,136 / 17,375 (79.76) · Stanford 19 percent (93.80) · unemployment 4.2 percent (106.48) · labor share 52.8 percent (821.34) · humanoids shipped about 13,000 (31.30, 1053.44) · Unitree 5,900 (262.26) · 1X NEO price and delivery status (270.06; the VO says "deliveries promised for 2026", a confirmed delivery changes the graphic only) · Tesla Optimus status (on screen only) · the five BLS trade counts behind 2.8 million (325.32) · Waymo 271.3 million and 95 percent (464.32) · Aurora 440,000 (512.04) · the Rufus pilot status (500.56) · FDA over 1,600 (596.94) · da Vinci 3.15 million and Intuitive's surgeon-controlled wording (642.72) · horse counts against a USDA table (162.84) · CPI up 9.1 percent since November 2023 (720.46) · Gates acreage (797.12, 887.18) · BTC supply (899.64) · x402 30-day figures (920.00) · CertiK, a newer report (980.16) · M2 23.3 trillion (1010.42) · BTC, KAS and TAO distance from their highs (1038.12; the line depends on it) · exact quote wording before any burn-in: Hinton (10.40, 20.40), Amodei (212.14), Benioff (485.84), Huang (609.00, 619.54), Musk (842.90).
- Runtime measured: 18:41.0 (1121.00 s), against the screenplay's estimate of about 18:40; the brief's 15:00 target and 18:00 maximum were lifted by Mike on 2026-10-06 (measurement only). By chapter: CH1 1:02.9 · CH2 2:49.7 · CH3 3:33.3 · CH4 4:18.1 · CH5 1:45.7 · CH6 1:09.8 · CH7 3:02.9 · CH8 0:58.5. 3,327 words in the JSON plus 2 restored, about 178 words a minute.
