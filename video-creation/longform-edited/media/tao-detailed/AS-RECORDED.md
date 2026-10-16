# tao-detailed - AS-RECORDED (build the edit to THIS, not the plan)

_Authored 2026-10-16 by the as-recorded-author from the FINAL spine. Shape: `skills/doc-reference/AS-RECORDED.reference.md`. Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py`. Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence 700 ms -> burst removal x1 -> two-zone desilence 450 ms CH1 / 600 ms body @81.0 s on the coarse spine (the CH1/CH2 join "break it all down." / "Real quick.") -> pickup splice x2, audio-only, zero shift). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.f.pickup.mp4` - 758.42s (12:38.42), 1080p30 (1920x1080, 30/1 CFR; ffprobe format duration 758.419). LOCKED (gate `spine` approved 2026-10-16 13:41, GRAPH-PROGRESS.json).
- **Transcript (cue source):** `spine/ALL.f.pickup.medium-words.json` (Whisper medium, word-level, 2,204 words, NOT hand-edited). Human-review breakdown: `spine/ALL.f.pickup.segments.txt`.
- **Timecode chain:** raw master `raw/2026-10-16 08-59-32.mkv` (43:56) -> `ALL.lowbps.mp4` (re-encode, 2636.27 s, same clock) -> `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 110 retake spans cut, a = 1508.17 s / 25:08) -> `ALL.b.blackout.mp4.cover.json` (a -> b: paint only, ZERO shift; 10 FACE windows left unblacked, every other second drawn black) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms, 192 cuts, 734.66 s removed; the Dropbox keep extended to src 1004.00 at the spine review) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: one burst 34.744-34.911 removed, everything at or after c 34.911 shifts -0.1667 s, exactly 5 frames; d = 774.467 s CFR) -> `ALL.e.desilenced.map.json` (d -> e: two-zone 450 ms / 600 ms, 26 cuts, 16.12 s removed, e = 758.41 s) -> `ALL.f.pickup.mp4.splice.json` (e -> f: audio-only replacement of 391.50-394.70 and 480.90-483.83, video stream-copied, ZERO shift, verified by cross-correlation at 6 points; f = 758.419 s). **Every timecode below is already a FINAL-spine coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` (backup `c.desilenced.bak-burst`) -> `d.cleaned` -> `e.desilenced` -> `f.pickup`. (The zero-byte file `spine/spine` is not part of the chain.)

## FACE windows

From `blackdetect` on the blacked picture (`ffmpeg -i spine/ALL.f.pickup.mp4 -vf blackdetect=d=0.3:pix_th=0.10`, non-black = FACE), identical to the transcriber's d=0.1 pass. Everything else is BLACK VIDEO and must be covered in the comp. Face 55.53 s of 758.42 s = 7.3% / cover 92.7%. Zero orphans: every window lands on a scripted `[FACE]` beat (11 scripted face beats in 10 windows; CH1's locked question and dive-in share window 3).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-6.900 | "The AI that is coming for your job is owned by somebody and you can own a piece of it." | CH1 Beat 1 `[FACE]` (locked hook) |
| 2 | 49.733-52.133 | "and then the team that built it walked out." | CH1 Beat 3 `[FACE]` (the walkout teaser) |
| 3 | 67.567-76.500 | "So here's the question that I'm answering by the end of this video. Is TAO really a way to own a piece of the AI production or the long haul? So let's break it all down." | CH1 Beat 4 `[FACE]` x2 (locked question + dive-in) |
| 4 | 179.900-183.633 | "And this network has been punched in the face more than once." | CH2 Beat 5 `[FACE]` |
| 5 | 278.867-285.067 | "But you just can't switch off a network that no single company controls. And the market priced that in two days." | CH2 Beat 6 `[FACE]` |
| 6 | 361.467-370.233 | "The founder called it on stage, the most successful GPU incentive network in history and the biggest earner on the network." | CH3 Beat 2 `[FACE]` |
| 7 | 452.333-458.200 | "The company walked away, but the subnet kept going. And that's the whole point of building AI this way." | CH3 Beat 4 `[FACE]` |
| 8 | 634.667-637.833 | "That's the question. And TAO is my answer." | CH4 Beat 3 `[FACE]` (right after CLIP-1) |
| 9 | 654.533-658.267 | "My read? Yes. As long as the customers keep showing up." | CH5 Beat 1 `[FACE]` |
| 10 | 727.167-733.000 | "Again, in my opinion, I think you should own a piece of the AI production while you still have a paycheck," | CH5 Beat 3 `[FACE]` (locked landing) |

Window notes: the last word of window 1 ("it.", 6.54-6.96) runs 0.06 s past the cut to black; the cover takes it. The file's last ~0.05 s (758.367-758.419) is not caught by blackdetect at the stream end; it is not a face beat, and the end card covers through 758.42.

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build. (The transcriber's corrected text in `segments.txt` already applies most of these; this is the authoritative list.)

- Every "Tau" -> "TAO" (persona `tao_spelling`): 29 hits in the JSON, first 38.00, last 702.60 (incl. 70.58, 87.02, 162.88, 170.02, 176.36, 178.20, 195.02, 225.36, 257.98, ...).
- 73.98 "or the long haul" -> "for the long haul" (LIKELY: the locked line, the script and the CH5 callback at 653.20 all say "for"; confirm by ear before the caption ships).
- 78.96, 102.56, 171.08 "Betenzor" -> "Bittensor"; 289.20 "Btenza" -> "Bittensor"; 615.44 and 631.38 "the tensors" -> "Bittensor's".
- 95.14 "Brain Team" -> "Brain team" (case).
- 95.98 and 120.10 "Alaa Shabana" -> "Ala Shaabana".
- 102.56 "Bittensor, a peer-to-peer intelligence market" -> the paper title "Bittensor: A Peer-to-Peer Intelligence Market" (caption styling of a title).
- 114.14 "archive" -> "arXiv" (pronounced "archive"; captions spell it arXiv).
- 138.62 "AlBitcoin" -> "AI Bitcoin".
- 152.72 "error" -> "era".
- 153.96 phantom "February" (p 0.03) -> drop it (the audio and the e pass say only "2023"; a cue that searches the JSON for "February" must skip this one; the real ones are 160.36, 238.92, 391.16, 394.96).
- 162.48 "dynamic TAO" -> "Dynamic TAO" (product name).
- 186.26 "7.06" -> "7:06"; 190.44 "7.41" -> "7:41" (clock times).
- 209.28 "key cutting" -> "key-cutting".
- 247.10 "Silbert, our CEO" -> "Silbert as CEO".
- 254.86 "G-Tau" -> "GTAO".
- 256.66 "U.S. spotty TF" -> "US spot ETF".
- 258.30 "Mended" -> "Amended".
- 263.86 and 432.72 "Anthropix" -> "Anthropic's".
- 291.14, 311.72, 469.62 "founders" -> "founder's" (possessive).
- 320.62 and 424.36 "Internet" -> "internet" (case).
- 321.54, 341.10, 350.18, 586.12, 643.06, 685.56 "Liam" -> "Lium" (subnet 51).
- 322.00, 371.32, 410.06, 460.78, 468.26, 474.10, 477.56 "Subnet N" -> "subnet N" (mid-sentence case).
- 332.60 "$3.15" and 337.04 "$1.3 million": Whisper's normalization of the spoken amounts -> captions write money without a dollar sign ("3.15 dollars", "1.3 million dollars"); confirm the exact spoken form by ear.
- 345.20 "Your Own Mind" -> "ownyourmind" (the analyst site ownyourmind.ai; Whisper may have reordered "own your mind", check by ear; on screen always "ownyourmind.ai").
- 346.68 "3X" -> "3x".
- 349.20 "Admission" -> "Emissions".
- 358.36 "2000" -> "2,000".
- 362.86 "On Stage" -> "on stage".
- 374.44 "John Durbin" -> "Jon Durbin".
- 382.26 "computer's permissionless" -> "compute is permissionless".
- 392.56 "subconnect" -> "SubConnect".
- 418.50 "Covenant 72B" -> "Covenant-72B" (the model's name).
- 427.52 "Lama 2" -> "Llama 2".
- 447.80 "Platonic" -> "Teutonic".
- 467.66 "Afnet" -> "Affine" (subnet 120).
- 477.24 "ridges" -> "Ridges" (subnet 62).
- 483.00 "crack it" -> "Kraken" (inside the pickup audio).
- 484.22 "Hippiest" -> "Hippius".
- 485.72 "Macro Cosmos" -> "Macrocosmos".
- 489.44 "Bitmind" -> "BitMind".
- 490.56 "deep fakes" -> "deepfakes".
- 491.56 "Open Roboto" -> "OpenRoboto".
- 496.80 "Pricewaterhouse, Cooper's" -> "PricewaterhouseCoopers".
- 502.92 and 645.56 "subnets" -> "subnet's" (possessive).
- 520.06 and 541.06 "having" -> "halving".
- 530.76 "stake" -> "staked"; 555.68 "stakes" -> "staked".
- 543.64 "hits that's 15.75" -> "hits at 15.75".
- 566.30 "Now demand outside" -> "Now, demand. Outside" (punctuation).
- 594.50 "DCG is Yuma for public companies" -> "DCG's Yuma, four public companies".
- 605.42 "Metta" -> "Meta".
- 664.24 "The GPU is the models" -> "The GPUs, the models".
- 667.76 "supply cap that 21 million" -> "supply cap of 21 million".
- 694.00 "on state number three, and the network grow" -> "on stage? Number three, can the network grow".
- 702.02 "grayscales" -> "Grayscale's".
- 680.88 "watch list" -> "watchlist" (style, optional).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE HOOK (0.00-76.50) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | [FACE 1] "The AI that is coming for your job is owned by somebody and you can own a piece of it." | KEPT (locked `[SAY-EXACT]` FACE, word for word) |
| 7.02 | "Not a share of a company that rents it to you. A piece of the machine that makes it." | KEPT (locked `[SAY-EXACT]` COVER, word for word, said as two sentences) |
| 11.78 | "I did a whole video on why every single job is at risk and this touches on a piece of that. Not the job, the ownership." | CHANGED ("every single job" for "literally every job"; the script's doubled "this and this" was not said) |
| 19.12 | "Because the story behind this network is wild." | KEPT |
| 21.98 | "A white paper under a name nobody can put a face to and a paper pulled off the internet by one of its own authors." | KEPT (minor wording drift: "can put" for "has put") |
| 27.78 | "A chain halted in its first year and relaunched from Block Zero." | KEPT ("Block Zero" = block 0; the burst after it was removed at d, spine review) · guard [!WARNING 5] HELD (no 546,113, no era names) |
| 32.60 | "A hack in July of 2024 that drained around 32,000 TAO through a poison piece of software and the chain itself was never broken." | KEPT (minor wording drift: "around" for "about", "poison" for "poisoned") |
| 43.40 | "A 72 billion parameter model trained across the open internet on more than 70 independent machines" | KEPT · guard [!WARNING 4] HELD (no "largest in history") |
| 49.68 | [FACE 2] "and then the team that built it walked out." | KEPT (FACE, the walkout teaser Mike picked at GATE 1) |
| 52.10 | "A government that switched off an AI model used by hundreds of millions of people for 18 days and TAO jumped around 23% in two days." | KEPT · guard [!WARNING 3] HELD (no "the government backed Bittensor", no "most capable model on Earth") |
| 62.10 | "And one single subnet billing 1.3 million dollars a month renting out GPUs." | KEPT |
| 67.58 | [FACE 3] "So here's the question that I'm answering by the end of this video. Is TAO really a way to own a piece of the AI production or the long haul?" | CHANGED (locked `[SAY-EXACT]` FACE drifted: "the question that I'm answering" for "the one question I'm answering", "a way" for "the way"; "or the long haul" is most likely Whisper for "for", see Mishears) |
| 75.04 | [FACE 3] "So let's break it all down." | CHANGED (dive-in said as "So let's break it all down." for "So, let's dive into all this."; RESOLVED, PROJECT-LOG 2026-10-16, persona `dive_in_variants.recent_use` updated) |

### CH2 - THE BACKSTORY (76.50-292.02) · card ON "The Backstory" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 76.50 | "Real quick, for anyone new, Bittensor is an open network of AI marketplaces called subnets. Miners do the work, validators score it, everybody is paid in TAO on Bitcoin's 21 million supply model." | KEPT (minor wording drift: "Real quick" for "Quick") |
| 90.08 | "Two founders, Jacob Steeves, a former machine learning engineer on Google's Brain team, and Ala Shaabana, ex-VMware." | KEPT · guard [!WARNING 5] HELD (no Google years, no PhD) |
| 97.80 | "By the foundation's own account, the work began in 2016." | KEPT |
| 101.50 | "The white paper. Bittensor, a peer-to-peer intelligence market, is published under the name Yuma Rao, a byline the community treats as a pseudonym in the Bitcoin tradition." | KEPT · guard [!WARNING 5] HELD ("published under the name Yuma Rao", never "a pseudonym for X") |
| 111.48 | "The detail I love. The academic version went up on arXiv in March 2020 with five authors, and in November 2021, it was withdrawn by Ala Shaabana himself." | KEPT |
| 121.38 | "The motive was never hidden. Steeves told Fox Business in 2023, the whole point was to stop an elite group from controlling AI." | KEPT |
| 128.82 | "January 2021, the launch. The foundation calls it a fair launch, mined from day one." | KEPT · guard [!WARNING 2] HELD (attributed to the foundation, no "no premine") |
| 135.54 | "And their own 2023 deck calls the project AI Bitcoin. No public audit of early distribution that I've seen, so that's their claim." | KEPT · guard [!WARNING 2] HELD |
| 143.96 | "The first chain was halted in 2021 over early consensus issues and relaunched late that year from Block Zero. The founder calls that era the closed garden." | KEPT (minor: "the closed garden" for "a closed garden") · guard [!WARNING 5] HELD (no era names, no 546,113) |
| 153.96 | "2023, the live chain opens up. October 2023, subnets go live." | KEPT (the JSON carries a phantom "February" at 153.96, see Mishears) |
| 160.36 | "February 2025, Dynamic TAO. Every subnet gets its own alpha token, and in the founder's words, it let anyone in the world who has TAO run on Bittensor." | KEPT (minor: "run on Bittensor" for "run Bittensor") |
| 171.74 | "December 2025, their first halving. Once half of the 21 million TAO had been mined, new TAO per day got cut in half." | KEPT (minor: "their first" for "the first") · guard [!WARNING 5] HELD ("December 2025", no exact day) |
| 179.98 | [FACE 4] "And this network has been punched in the face more than once." | KEPT (FACE, word for word) |
| 183.64 | "July 2nd, 2024, 7:06 in the evening, UTC. Wallets start draining. By 7:41, the chain is in safe mode. About 32,000 TAO gone, around eight million dollars." | KEPT |
| 197.86 | "Here's the thing. The chain was never broken. A poison version of the official software library was uploaded to the public download store and whoever installed it had their keys read." | KEPT (minor: "poison" for "poisoned") |
| 208.32 | "A rigged key-cutting kiosk, not a broken vault." | KEPT |
| 211.68 | "Then April 9th, 2026, Covenant AI, the team behind three subnets, including Templar, walked out all in a network quote centralized control with decentralized branding." | KEPT ("all in a" (p 0.09) is most likely a slurred "calling the"; check by ear at captions) |
| 225.36 | "TAO dropped 25 to 30 percent inside a day." | CHANGED (the scripted "as reported" was not said; the C18 receipt and the on-screen caption carry "as reported", see Flags) |
| 228.50 | "The slot didn't die. Subnet three came back as Teutonic and started an 80 billion parameter run in May, and the founder had already stepped down as the foundation CEO in February." | KEPT |
| 239.34 | "Now the money. Digital Currency Group invested in 2021 and in November 2024 launched Yuma, Barry Silbert as CEO for what he called the decentralized ownership of intelligence." | KEPT |
| 251.26 | "December 30th, 2025, Grayscale files for GTAO, the first attempt at a US spot ETF for TAO. Amended in April, not yet live." | KEPT · guard [!WARNING 5] HELD (Grayscale only, no Bitwise) |
| 260.54 | "And June 12th, 2026, Washington switched off Anthropic's Fable 5 and Mythos 5 for the whole world for 18 days." | KEPT · guard [!WARNING 3] HELD |
| 268.82 | "TAO went from around 214 dollars to around 263 dollars in two days. And I made a video about why." | KEPT |
| 276.82 | "So if you're not subscribed, click that subscribe button." | AD-LIB (not in the script; a subscribe ask on COVER, right before face window 5) |
| 278.90 | [FACE 5] "But you just can't switch off a network that no single company controls. And the market priced that in two days." | CHANGED (FACE line said as two sentences; "But you just can't" for "You cannot") · guard [!WARNING 3] HELD |
| 285.12 | "And in September 2026, Montreal, the first native Bittensor conference opened by the founder's keynote." | KEPT |

### CH3 - THE SUBNETS (292.02-511.30) · card ON "The Subnets" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 292.02 | "There are 128 slots. Registering one cost a lot. About 610 TAO when I checked, not refunded. And a subnet that doesn't earn its slot gets pruned." | CHANGED ("128 slots" for "128 subnet slots"; "cost a lot" as heard for "costs a lock", see Flags) |
| 301.26 | "The number that matters. An index called SubConnect counted 24 subnets with real outside revenue. 28 to 35 million dollars a year, as reported by Crypto Briefing, the founder's own count on stage 23." | KEPT |
| 314.20 | "Let me zoom in on three subnets, two making real money from customers and one that's trained the giant AI model across the open internet." | KEPT (minor: "that's trained the giant" for "that trained a giant") |
| 321.54 | "Lium, subnet 51, run by a team called Datura AI, a marketplace where anyone can list a GPU and anyone can rent one by the hour from around 24 cents for an L40 up to [3.15 dollars] for an H100." | KEPT (minor: "around" for "about"; the bracketed amount is Whisper's normalization, see Mishears) |
| 335.40 | "Last full month of billing, [1.3 million dollars] as of October 7th, 2026. Lium's own figure checked against on-chain payouts by an analyst site called Your Own Mind up about 3X year over year." | KEPT ("Your Own Mind" as heard for ownyourmind; on screen "ownyourmind.ai") |
| 348.08 | "Here's the thing. Emissions still pay Lium about twice what customers do. But back in May, it was four to five times. So that gap is closing." | KEPT (minor: "closing" for "closing fast") · guard [!WARNING 4] HELD (emissions still about twice revenue; never "earns more than its emissions") |
| 356.08 | "And in just one month, the owner spent about 2,000 TAO buying back its own token and burning it." | KEPT |
| 361.68 | [FACE 6] "The founder called it on stage, the most successful GPU incentive network in history and the biggest earner on the network." | KEPT (FACE; minor: "and the biggest earner" for "and it is the biggest earner") |
| 370.50 | "Chutes, subnet 64 from Rayon Labs, founded by Jon Durbin. It serves AI models to developers through a standard API, the way big labs do, except models are open source and the compute is permissionless." | KEPT |
| 383.10 | "They report about 160 billion tokens a day and on a public routing marketplace called OpenRouter, they peaked at about 42 billion a day in February." | KEPT · guard [!WARNING 4] HELD (no "10 million ARR", no "number 1 on OpenRouter") |
| 391.70 | "Revenue per SubConnect, four to five million dollars a year." | KEPT (PICKUP audio 391.50-394.70, RESOLVED by Mike 2026-10-16; the original take said "per subnet ... a day") |
| 394.82 | "In February, they killed a free tier because heavy users were pulling around 56 to 324 times the value of their subscription." | KEPT (minor: "a free tier" for "the free tier") |
| 404.76 | "Durbin's words, the world is hungry for tokens and starving for GPUs." | KEPT |
| 409.40 | "Now, subnet 3 back in March 2026, it was called Templar, run by a company called Covenant AI, and it finished training the giant AI model called Covenant-72B. That's 72 billion parameters trained on more than 70 independent machines across the open internet." | KEPT · guard [!WARNING 4] HELD (no "largest in history") |
| 424.74 | "On a standard AI knowledge test, it beat Meta's Llama 2 model of about the same data and they released it open source." | CHANGED ("about the same data" as heard for "about the same size", both Whisper passes; see Flags) |
| 432.56 | "Even Anthropic's co-founder Jack Clark was quoted saying it could help people build more successful models together." | CHANGED ("more successful" for "more powerful" in a paraphrased quote; see Flags) |
| 438.46 | "Then a month later, Covenant AI walked out. The exit I mentioned earlier, Templar's old token fell by more than half, but the subnet kept going under a new name, Teutonic." | KEPT (minor: "old token" as heard for "own token") |
| 448.32 | "And in May, it started training an even bigger model, 80 billion parameters." | KEPT |
| 452.50 | [FACE 7] "The company walked away, but the subnet kept going. And that's the whole point of building AI this way." | KEPT (FACE, said as two sentences) |
| 458.30 | "Real quick, a few more worth knowing. Targon subnet 4 rents out private encrypted computing and it brings in around 5.5 to 6 million dollars a year as reported." | KEPT · guard [!WARNING 4] HELD (SubConnect estimate "as reported", no 10.4M ARR) |
| 467.66 | "Affine subnet 120 is the founder's own subnet where AI models compete to beat the current champion." | KEPT |
| 473.46 | "Vanta subnet 8 scores trading strategies and Ridges subnet 62, builds AI coding agents and both of their tokens got listed on Kraken in July." | KEPT (PICKUP audio 480.90-483.83 "both of their tokens", RESOLVED by Mike 2026-10-16; the original take said "about half of their tokens") · guard [!WARNING 4] HELD (no SWE-Bench claim) |
| 484.22 | "Hippius does storage. Macrocosmos runs three subnets, including a big data scraper." | KEPT |
| 489.44 | "BitMind catches deepfakes and OpenRoboto works on robotics data and across the network, reported clients include PricewaterhouseCoopers France and Dropbox." | CHANGED ("PricewaterhouseCoopers France" for "PwC France"; the "Dropbox" tail was extended 100 ms at the spine review, RESOLVED) |
| 499.78 | "Now, not every subnet is a winner. In August, one subnet's AI model turned out to be a copy of someone else's and the token collapsed." | KEPT (generic as the [VERIFY] required: no name, no percentages) |
| 507.36 | "That's exactly why the network kicks out subnets that don't earn their spot." | KEPT |

### CH4 - THE LONG-TERM CASE (511.30-647.62) · card ON "The Long-Term Case" · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 511.30 | "Now, why I'm holding this for years. Start with the supply. There will only ever be 21 million TAO, just like Bitcoin." | KEPT |
| 519.00 | "And since that December halving, the network creates about 3600 new TAO a day." | KEPT |
| 523.90 | "Around 11.6 million TAO exists so far, and that's 55% of the cap and 64% of those are staked, put to work earning rewards." | KEPT · guard [!WARNING 5] HELD (the Taostats figure, not CoinGecko's stale supply) |
| 533.14 | "And it halves at the same point Bitcoin does, but with one twist. The fees people pay on the network gets subtracted from the count of coins mined. So each halving takes longer to reach." | KEPT (minor: "but with one twist", "gets" for "get") |
| 542.76 | "The next one hits at 15.75 million around three years out at the current pace or probably later." | KEPT |
| 549.36 | "And in July, an upgrade called Root Reborn changed one big thing. The root validators where most of the staked TAO sits now hold subnet tokens they earn instead of selling them by the team's own numbers. That stops over 900 TAO a day from selling on the subnet." | KEPT ("by the team's own numbers" opens the next sentence as spoken; Whisper's break, see Flags) |
| 566.30 | "Now, demand. Outside customers pay the subnets around 28 to 35 million dollars a year, as reported. While the network pays over 300 million dollars a year in new TAO." | KEPT |
| 576.34 | "So customer money only covers about a tenth of it. And the bears have that number right." | KEPT (minor: "have that number right" for "are right about that number") |
| 580.66 | "But look at where it's heading. Of the 24 subnets were paying customers 14 buy back their own tokens." | KEPT ("were" as heard for "with"; check by ear) |
| 586.12 | "Lium's billing has tripled in a year and since July subnets that sit idle stop earning new TAO." | KEPT · guard [!WARNING 4] HELD |
| 591.60 | "And the big money showed up early. DCG's Yuma, four public companies holding TAO and Grayscale's filing for a TAO ETF." | KEPT |
| 599.52 | "And look at the size of the prize in 2026 alone. Microsoft, Alphabet, Amazon, Meta and Oracle plan to spend around 660 to 690 billion dollars on the AI build out." | KEPT |
| 614.48 | "According to Futurum, Bittensor's entire market cap is around three billion dollars, less than half of one percent of what those five plan to spend in a year." | KEPT ("According to Futurum" closes the capex sentence; Whisper put it on this one, see Flags) |
| 622.92 | "And here's how all this ties back the job. When the machine does the work, the wages go away and whoever owns the machine keeps getting paid." | KEPT (minor: "ties back the job" as heard for "ties back to jobs") |
| 631.26 | "Bittensor's co-founder put it as a question on stage in Montreal." | KEPT (the CLIP-1 set-up line; "Montreal." ends 634.66) |
| 634.66 | (clip insert CLIP-1 lands here; the set-up line ends "...put it as a question on stage in Montreal.") | KEPT · INSERT CLIP-1 (13.9 s, the speaker's own voice; the splice is the trough after "Montreal") |
| 634.74 | [FACE 8] "That's the question. And TAO is my answer." | KEPT (FACE, said as two sentences) |
| 637.90 | "Owning it is a claim on the production, not a wage from it. Stake into subnets like Lium or Chutes and you own a piece of that subnet's token priced in TAO." | KEPT (minor: "subnets like" for "a subnet like") |

### CH5 - THE ANSWER AND THE WATCHLIST (647.62-758.42) · card OFF · Bed D

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 647.62 | "So back to my question that I opened with, is TAO really the way to own a piece of the AI production for the long haul?" | KEPT (COVER; minor: "my question" for "the question") |
| 654.72 | [FACE 9] "My read? Yes. As long as the customers keep showing up." | KEPT (FACE, said as three beats) |
| 658.38 | "It's the only network I know of where anyone holding the token can stake it into the actual AI work. The GPUs, the models and the training on a supply cap of 21 million while its biggest earner has tripled its billing in a year." | KEPT |
| 672.66 | "In my opinion, that's a lopsided bet where the upside is bigger than the downside. But even though it's not a guarantee, I'm holding it for years." | KEPT (minor: "But even though it's not a guarantee" for "but it's not a guarantee, and") |
| 680.26 | "So here's my watch list." | KEPT |
| 681.34 | "Number one, is customer money growing faster than the new coins being paid out? And does Lium start earning more from customers than it gets in new TAO?" | KEPT |
| 688.84 | "Number two, does control keep spreading out to more people in 2027? The way the founder laid out on stage?" | KEPT · guard [!WARNING 1] HELD ("in 2027", no "December 2027") |
| 694.14 | "Number three, can the network grow past 128 subnets without the junk outgrowing the real owners." | KEPT ("real owners" as heard for "real earners", see Flags; "past 128", not 256) |
| 700.84 | "Number four, does Grayscale's TAO ETF actually launch?" | KEPT (no "approval expected") |
| 705.14 | "And number five, no repeat of that 2024 hack." | KEPT |
| 708.84 | "If most of those pass, then this price around 65 percent below the all time high was the ground floor for owning a piece of the AI production." | KEPT (the scripted trailing "in my opinion" moved into the next sentence) |
| 717.98 | "In my opinion, never financial advice." | AD-LIB ("never financial advice" added to the scripted "in my opinion") |
| 719.86 | "If most of them fail, then it was a trade, not a long term hold." | KEPT |
| 723.60 | "I'll be the first to admit it, but please do your own research." | AD-LIB (said in place of the scripted "and I'll tell you so right here on this channel") |
| 727.38 | [FACE 10] "Again, in my opinion, I think you should own a piece of the AI production while you still have a paycheck," | CHANGED (locked `[SAY-EXACT]` FACE reworded: "Again, in my opinion, I think you should own a piece of the AI production while you still have a paycheck" for "Own a piece of the production while you still have the paycheck.") |
| 733.10 | "because the paycheck is the part the machine is coming for." | KEPT (locked `[SAY-EXACT]` COVER, word for word; joined to the face line as one sentence) |
| 736.86 | "Literally every job is at risk, as I've explained in previous video." | AD-LIB (a second every-job callback, not in the script) |
| 740.48 | "And if you want to get involved in a crypto community where we get into awesome plays like this as soon as they launch at very, very low prices and have yourself financially set for the long term, click the link in the description." | AD-LIB (Mike's community CTA in place of the scripted CTA wording; see Flags) |
| 751.82 | "And all the software we have, we're hooked into everything and we're typically ahead of the curve." | AD-LIB |
| 755.98 | "Not only that, make sure you click that like button." | CHANGED (the like ask lands LAST; the spine ends on "button." at 758.08-758.40) |
| 758.08 | (not said) | DROPPED: "comment which subnet you'd stake into first" and the sign-off "I'm gonna catch you guys, later." (the Bed D epic_hit was planned to land on "later"; it lands on "button." instead, see Flags) |

## Divergences from SCREENPLAY.md

- **Dropped:** (1) 225.36 "as reported" after the Covenant price drop, not said -> the attribution moves to the on-screen caption (C18), OPEN for the coverage plan to carry. (2) 348.08 "fast" ("that gap is closing fast"), not said; nothing to rebuild. (3) CH5 Beat 2 "and I'll tell you so right here on this channel", replaced by the 723.60 ad-lib. (4) CH5 Beat 3 "comment which subnet you'd stake into first" and "I'm gonna catch you guys, later.", not said; the take ends on "like button." RESOLVED as a take (the spine Mike approved at gate `spine`, 2026-10-16 13:41); the hit re-target is OPEN for the music-placement strategist. (5) The optional disclosure NOTE ("I own TAO, and I'm not selling you anything but the research") was not said; it was Mike's call, nothing to rebuild. Every other scripted line in CH1 to CH5 was said.
- **Added (ad-libs):** 276.82 "So if you're not subscribed, click that subscribe button." · 717.98 "never financial advice" · 723.60 "I'll be the first to admit it, but please do your own research." · 736.86 "Literally every job is at risk, as I've explained in previous video." · 740.48 the community CTA · 751.82 "And all the software we have, we're hooked into everything and we're typically ahead of the curve." All are in the spine Mike approved; kept as content, nothing proposed for cutting.
- **Changed locked lines:** 67.58 the locked question ("the question that I'm answering", "a way") and 727.38 the locked landing ("Again, in my opinion, I think you should own a piece of the AI production while you still have a paycheck,") drifted from the `[SAY-EXACT]` text; both are in the approved spine. Captions and any on-screen text quote the TAKE, not the script.
- **Rulings already made (RESOLVED):** dive-in "So let's break it all down." (PROJECT-LOG 2026-10-16) · burst after "Block Zero" removed (`--bursts 34.6-34.9`, spine review 2026-10-16) · "Dropbox" keep extended 100 ms (spine review 2026-10-16) · FINAL silence 450 ms CH1 / 600 ms body @81.0 s ("The rest is good.", spine review 2026-10-16) · two pickups spliced audio-only at 391.50-394.70 and 480.90-483.83 (Mike confirmed both lines were misspoken, 2026-10-16) · spine LOCKED (gate `spine` 2026-10-16 13:41).
- **Guards:** [!WARNING 1] "December 2027": HELD (688.84 says "in 2027" only; the handover line itself was cut at GATE 1). [!WARNING 2] "no premine, fair launch": HELD (128.82 and 135.54, attributed to the foundation, "so that's their claim"). [!WARNING 3] "the US government backed Bittensor": HELD (52.10, 260.54, 278.90; the shutdown is said as a fact of Washington switching off Anthropic's models, never as backing). [!WARNING 4] Lium/Chutes earning more than emissions, Chutes ARR / OpenRouter rank, Targon ARR, Ridges SWE-Bench, Covenant-72B "in history": HELD (348.08, 383.10, 409.40, 458.30, 473.46). [!WARNING 5] 546,113 / exact halving day / Bitwise / Yuma Rao identity / Latent 11 / CoinGecko supply / Google years / PhD: HELD (90.08, 101.50, 143.96, 171.74, 251.26, 523.90).
- **Clip inserts (Convention 6):** CLIP-1 set-up line said -> KEPT at 634.66 (splice after "Montreal.", 13.9 s, Steeves in his own voice; the screenplay carrying CLIP-1 as PROPOSED passed the `screenplay` gate 2026-10-16 09:54) · CLIP-4 DROPPED at GATE 1 with CH4 Beats 4 and 5 (not in the take) · CLIP-3 HELD, not placed (no set-up line was written for it) · CLIP-2, CLIP-5, CLIP-6, CLIP-7 REJECTED in the screenplay. No other insert.

## Flags carried into the edit

- 634.66 CLIP-1 splice trough is TIGHT: "Montreal." ends 634.66 (JSON), the RMS dip runs 634.62-634.66 and bottoms at -51.8 dB at 634.650 (never below the -57 dB silence floor), "That's" onsets about 634.67 (JSON start 634.74) and face window 8 opens at 634.667 (a desilencer join sits under it). The coverage-strategist's `splice_at` dry-run and `lint-pause-silence.py` must confirm this trough; if the snap fails it fails at the PLAN gate. OPEN.
- 225.36 fact-framing trap: the VO says "TAO dropped 25 to 30 percent inside a day" with no attribution; it is an intraday figure from tao.media ("roughly 30%") and bex.co ("25-27% intraday"). The CoinGecko daily closes (324.90 -> 298.61) are about 8 percent, so the graphic must caption "intraday, as reported (tao.media / bex.co)" and never plot it as a close-to-close move.
- 346.68 the VO says "about 3X year over year"; the C5 graphic shows 2.96x (ownyourmind.ai). 586.12 and 664 "tripled" = the same 2.96x.
- 356.08 the VO says "about 2,000 TAO"; the graphic shows 1,932 TAO bought and burned in 30 days.
- 523.90 the VO says "around 11.6 million ... 55% ... 64%"; the C2 / C7 graphics show 11.62M / 55.3 percent / 64.03 percent (7.441M staked) from the render-day Taostats re-pull, never copied from the VO.
- 542.76 "around three years out" is computed (about 3.1 years at 3,600 a day, later with recycling); the graphic says "about 3 years at today's pace, later with recycling", no date.
- 562.08 the VO says "over 900 TAO a day"; the C21 receipt shows the page's minus 936 TAO a day.
- 614.48 "around three billion dollars" = 3.05B at read [VERIFY]; "less than half of 1 percent" is computed against 660 to 690B (Futurum). Written money with B, no dollar sign.
- 268.82 the VO rounds to "around 214 dollars to around 263"; the receipt shows the CoinGecko closes 213.59 (06-12) and 262.82 (06-14).
- 708.84 "around 65 percent below the all time high" = 64.5 percent at the 2026-10-15 read [VERIFY]; re-pull at render.
- 424.74 the VO says "about the same data"; the C6 card shows the SIZE comparison (72B vs LLaMA-2-70B, MMLU 67.1 vs 65.6), never "same data".
- 432.56 Mike paraphrased Jack Clark as "more successful models"; any on-screen pull quote uses bex.co's wording, attributed, never Mike's paraphrase in quote marks.
- 211.68 the Covenant quote "centralized control with decentralized branding." goes on screen with "as reported, tao.media, May 2026".
- 292.02 "cost a lot" vs the script's "costs a lock" (both Whisper passes heard "a lot"; ambiguous audio). The graphic says "registration lock: about 610 TAO, not refunded" [VERIFY 610.2].
- 694.14 the VO says "the real owners"; the C9 card reads "3. Past 128 slots, churn contained", never "owners".
- 740.48 the community CTA ("awesome plays ... at very, very low prices and have yourself financially set for the long term") is Mike's spoken CTA; no on-screen text repeats it as a promise (persona: no promised outcomes).
- 736.86 a second every-job callback (the script allowed one, at 11.78): if the coverage plan flashes the every-job title card, it can return here.
- 276.82 the subscribe ask sits mid-CH2 on cover; any subscribe graphic is the coverage plan's call.
- 758.08 the Bed D epic_hit lands on "button." (758.08-758.40), not on "later"; the music-placement strategist right-aligns to 758.40. OPEN.
- 73.98 ambiguous audio: "or the long haul" vs "for the long haul" on the locked question (see Mishears).
- 219.70 ambiguous audio: "all in a" (p 0.09), most likely "calling the".
- 345.20 ambiguous audio: "Your Own Mind" for the site ownyourmind.ai.
- 553.48 and 614.48 Whisper's sentence breaks: "by the team's own numbers" belongs to "That stops over 900 TAO a day..." and "According to Futurum" belongs to the capex sentence; split captions at the spoken break, not Whisper's.
- 153.96 the phantom "February" in the JSON (p 0.03) must not drive a cue.
- Timecode chain note: `ALL.c.desilenced.map.json` computes out_total 773.507 s while the rendered c measures 774.596 s (d's cuts.json: VFR source, about 35 missing frames, normalized to CFR at d). Any raw -> final back-map through c is checked against the picture, never the map arithmetic alone. Final-spine timecodes here are measured on f and need no remap.
- `[VERIFY]` items from DATA.md still open at render: TAO price, market cap (3.05B), rank, drawdown (64.5 percent), Taostats issued (11.62M) and staked (7.441M, 64.03 percent), top-10 emission shares and alpha prices (C4), registration cost (610.2 TAO), the OpenRouter Chutes model list, Lium subsidy ratio (2.0x) and last-month billing (1.3M as of 2026-10-07), Yuma "over 200M staked" (on-screen only, secondary), the four public treasury companies (stale CoinGecko table), safe mode end 2024-07-12, dTAO day 2025-02-13, Finney 2023-03-20 and Revolution 2023-10-02 plus the era names on C1, the Quasar line (said generically, keep it unnamed on screen), GTAO status, the lium.io C25 capture, a newer Futurum capex read.
- Runtime measured: 12:38.42 of final spine (758.42 s, 2,204 Whisper words, about 174 words a minute) against the 10:00 target (soft 9:00 to 11:00); CLIP-1 adds 13.9 s and the three chapter-card pauses (CH2, CH3, CH4) add their baked seconds on top (measurement only).
