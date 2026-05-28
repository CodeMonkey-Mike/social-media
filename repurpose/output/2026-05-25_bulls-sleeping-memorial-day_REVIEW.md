# May 25 Livestream — Bulls Are Sleeping / Memorial Day — Review Doc

Generated: 2026-05-25
Source transcript: `transcripts/2026-05-25_memorial-day-bulls-sleeping-clarity-mascot.txt`

## Topics chosen (10 tweet-tier + 4 long-form)

**Tweet tier (5 three-line + 5 one-liner; shuffled before append):**

- K1 — Kaspa hard fork is already priced in (named opp: "what catalyst?" crowd) — 3L
- K2 — Kasper-the-Ghost is the real Kaspa mascot, not Nacho (named opp: Nacho camp) — 3L
- K3 — The biggest buyers stay quiet (named opp: "Sailor would tweet about it") — 3L
- T1 — $TON ripped 10% mid-day while $BTC sat dead — 3L
- M1 — Iran deal weekly script, kicking the can — 3L (only macro one)
- K4 — 109-day bear flag, 2017 had a 290-day version — 1L
- K5 — Cascade: ETH flips $BTC, $BTC maxis find $KAS — 1L
- K6 — Community member at 3.6M $KAS by end of summer — 1L
- K7 — If $KAS didn't exist, I'd be a $TON then $TAO maxi — 1L
- S1 — Slippy +150% the day after I mentioned it on stream — 1L

**Long YT posts + threads (1:1 pairing):**

- K1: Hard fork priced in
- K2: Kasper-the-Ghost mascot
- K5: Cascade thesis (ETH flips BTC, maxis find KAS)
- T1: TON +10% while BTC slept

**Crypto weight:** 9 of 10 tweets are crypto (only M1 macro). 4 of 4 long YT posts crypto (3 KAS, 1 TON). Kaspa carries the most weight, followed by TON, with TAO/BTC/ETH appearing as supporting references in the cascade thesis.

## What was created

- 10 tweets (5 three-paragraph + 5 one-liner, shuffled together) → `x-tweets.json` (+10)
- 4 YT text polls → `yt-text-polls.json` (+4)
- 3 X polls (KAS bag size, TON real-or-fluke, Kaspa mascot Kasper-vs-Nacho) → `x-polls.json` (+3; Iran poll YT-only per rule)
- 4 long YT community posts (~1870-2010 chars each) → `yt-posts.json` (+4)
- 4 threads (5-8 tweets each, 7 each in this batch) → `x-threads.json` (+4)

## Fact-check results

- **Polymarket 4% BTC-to-$85K-in-May**: trusted per Mike's live observation from stream. Broader Polymarket context (BTC ~$76-78K, $80K resistance band) makes ~4% plausible. (web-verified market exists)
- **Iran deal "95% complete"**: verified — Trump admin says framework is 95% there, still arguing over nuclear stockpile + Strait of Hormuz wording; Trump giving 5-7 days. Matches Mike's framing.
- **Chun Wang / F2Pool / SpaceX Mars mission**: verified — F2Pool co-founder Chun Wang (NOT "Chung" as transcript said) is mission commander for SpaceX's 2-year Mars flyby (not landing). Controls ~11% of $BTC hashrate. Took 2-year leave. NOT used in any tweets this batch since it didn't make the topic cut, but flagged here for future use with correct spelling.
- **$TON +10% mid-day**: trusted per Mike's live screen observation.
- **Slippy +150% after mention**: trusted per Mike's live observation; framed in tweet as "the next day" / "the last time I mentioned" rather than as a market-data claim.
- **TON Strategy treasury figures**: 4.3% of supply / 220M+ $TON — carried forward from May-21 batch verification (Q1 2026 earnings).
- **Kaspa hard fork "market knows" mechanic**: framed as Mike's macro view, with Fed-cut analogy as illustration. No specific date asserted.
- **Nacho dev departure**: framed per Mike's statement ("the pet of one of the lead devs that quit the project"). No specific dev named.
- **Kaspa price $0.033**: verified — KAS trading ~$0.03-0.036 in May 2026 per CoinGape/Changelly.

## Persona rules honored

- No em dashes (semicolons, colons, parens, periods used instead)
- No aphorism / mic-drop closers; closing lines are concrete claims or questions
- No loose status labels (smart money, OGs, whales, diamond hands)
- Named-opposition + counter-claim + question pattern: K1 ("what catalyst?" crowd), K2 (Nacho camp), K3 ("Sailor would tweet" crowd), all three threads with same pattern
- "Four-year cycle zombies" used in K5/T1 threads and YT posts
- First-person conviction: "I think ETH flips $BTC", "I'm a Kaspa maxi", "I'm not telling anyone what to do with their meme bag"
- Fully implemented GhostDAG (correct phrasing, no bare "ghost" issues)
- Kasper-the-Ghost (correct K-prefix, not "Kaspa-the-Ghost")
- Hashtags on tweets are tagged in the JSON entry (for X) but no hashtag clutter in the body itself — they live in the `hashtags` array per existing schema convention
- Cashtags everywhere ($KAS, $TON, $TAO, $BTC, $ETH, $PEPE)
- X polls limited to Kaspa/TAO/TON subjects only (KAS bag, TON bid, Kaspa mascot); Iran poll saved YT-only per Mike's rule
- Tweet line-count: 5 three-paragraph + 5 one-liner per Mike's request
- Engagement-bait techniques in use: K2 mascot poll (correction-bait), K3 "whose silence are you actually pricing in?" (correction-bait closer), K7 "If KAS didn't exist..." (provocative ranking), K5 "the cascade nobody is pricing in" (provocative prediction). Cadence still under the 1-in-10 ceiling.
- No IG cross-posts this batch (per Mike's request — only x-tweets.json for one-liners)

## Queue deltas

| File | Before | After | Delta |
|---|---|---|---|
| x-tweets.json | 135 | 145 | +10 |
| yt-text-polls.json | 44 | 48 | +4 |
| x-polls.json | 37 | 40 | +3 |
| yt-posts.json | 42 | 46 | +4 |
| x-threads.json | 31 | 35 | +4 |

*Note: `x-tweets.json` was repaired before append. It had been left truncated mid-string after a previous session (last entry was a partial Lab-98x one-liner cut off in the middle of `image_path`). Repaired in place by parsing up to the last valid object boundary, then appended. No prior content lost — 135 entries after repair matches the count from Mike's last UI state.*

---

## Section 1 — Tweets (last 10 in x-tweets.json, shuffled order)

### Tweet 1 — `tweet-2026-05-25-k3-big-buyers-stay-quiet` (232/280, 3 paras)

```
The "Sailor would tweet about it if he was buying Kaspa" crowd has it backwards.

The biggest buyers stay quiet on purpose. The second they announce, their entries get expensive overnight.

Whose silence are you actually pricing in?
```

**Hashtags:** #kaspa #KAS #crypto

### Tweet 2 — `tweet-2026-05-25-m1-iran-deal-weekly-script` (248/280, 3 paras)

```
Every week the Iran deal is "95% complete" and a few days from done.

Seven weeks of the same headline, the same "5 to 7 more days." Markets price the deal as if it's closing, then nothing closes.

How many more "few more days" do you think we get?
```

**Hashtags:** #Iran #markets #macro

### Tweet 3 — `tweet-2026-05-25-t1-ton-ripped-while-btc-slept` (244/280, 3 paras)

```
$TON ripped 10% mid-day while $BTC sat in its 109-day bear flag.

That's the boring-tape asymmetry: chains with real product (Telegram payments, TON Strategy treasury) keep bidding while the majors sleep.

What's your $TON cost basis right now?
```

**Hashtags:** #TON #crypto #toncoin

### Tweet 4 — `tweet-2026-05-25-k1-hard-fork-priced-in` (264/280, 3 paras)

```
The "what catalyst?" crowd thinks the Kaspa hard fork is the surprise that finally pumps the chart.

If the market knows it's coming, it's already priced in. A Fed cut everyone expects doesn't move tape on the day either.

What catalyst isn't already in the price?
```

**Hashtags:** #kaspa #KAS #crypto

### Tweet 5 — `tweet-2026-05-25-k4-109-day-bear-flag-2017-comp` (166/280, 1 paras)

```
We're 109 days into this bear flag. The 2017 cycle had a 290-day version of this, and we're not even halfway through. Bulls are sleeping, bears already checked out. 💪
```

**Hashtags:** #bitcoin #BTC #crypto

### Tweet 6 — `tweet-2026-05-25-s1-slippy-150pc-after-mention` (193/280, 1 paras)

```
The last time I mentioned Slippy on stream, it ripped roughly 150% the next day. I'm not pumping it. Just noting nobody is paying attention to KRC20 right now except the people accumulating it.
```

**Hashtags:** #kaspa #KRC20

### Tweet 7 — `tweet-2026-05-25-k5-eth-flips-btc-cascade-to-kas` (110/280, 1 paras)

```
ETH flips $BTC, $BTC maxis hate proof-of-stake, $BTC maxis find $KAS. That's the cascade nobody is pricing in.
```

**Hashtags:** #kaspa #KAS #BTC #ETH

### Tweet 8 — `tweet-2026-05-25-k6-community-3p6m-kas-by-summer` (156/280, 1 paras)

```
A community member said he'll have 3.6M $KAS by end of summer. That's what accumulation in the bear actually looks like; not what you tweet, what you stack.
```

**Hashtags:** #kaspa #KAS

### Tweet 9 — `tweet-2026-05-25-k2-kasper-mascot-not-nacho` (235/280, 3 paras)

```
Nacho is the pet of a dev who left Kaspa. You don't get to keep the mascot if you walked.

Kaspa is the first fully implemented GhostDAG. Kasper-the-Ghost is on-theme and never quit the project.

Who reps Kaspa better, Kasper or Nacho?
```

**Hashtags:** #kaspa #KAS #kasper

### Tweet 10 — `tweet-2026-05-25-k7-if-kas-didnt-exist-ton-tao` (120/280, 1 paras)

```
If $KAS didn't exist, I'd be a $TON maxi. If $TON wasn't there either, I'd be a $TAO maxi. Kaspa exists, so here we are.
```

**Hashtags:** #kaspa #KAS #TON #TAO

---

## Section 2 — YT text polls (4)

### YT Poll 1: `yt-text-poll-2026-05-25-kas-bag-size`

**Question:**

```
How big is your $KAS bag right now?
```

**Options:**

- Under 50K $KAS (`14 chars`)
- 50K to 500K $KAS (`16 chars`)
- 500K to 5M $KAS (`15 chars`)
- 5M+ $KAS (`8 chars`)

### YT Poll 2: `yt-text-poll-2026-05-25-ton-bid-real-or-fluke`

**Question:**

```
$TON ripped 10% while $BTC sat dead. Is the bid real or a one-day fluke?
```

**Options:**

- Real bid building (`17 chars`)
- One-day fluke that fades (`24 chars`)
- Telegram payments pump (`22 chars`)
- TON Strategy treasury buying (`28 chars`)

### YT Poll 3: `yt-text-poll-2026-05-25-iran-deal-this-week`

**Question:**

```
Will the Iran deal actually close this week?
```

**Options:**

- Yes, signed by Friday (`21 chars`)
- Verbal only, no signature (`25 chars`)
- Falls apart again (`17 chars`)
- Punted another 5 to 7 days (`26 chars`)

### YT Poll 4: `yt-text-poll-2026-05-25-kaspa-mascot-kasper-vs-nacho`

**Question:**

```
Real Kaspa mascot: Kasper-the-Ghost or Nacho?
```

**Options:**

- Kasper-the-Ghost (GhostDAG) (`27 chars`)
- Nacho (the dev's pet) (`21 chars`)
- Both have a place (`17 chars`)
- Neither, Kaspa needs none (`25 chars`)

---

## Section 3 — X polls (3; KAS + TON + Kaspa-mascot only; Iran kept YT-only)

### X Poll 1: `poll-2026-05-25-kas-bag-size`

**Tweet text:** How big is your $KAS bag right now?

**Options:**

- Under 50K (`9 chars`)
- 50K to 500K (`11 chars`)
- 500K to 5M (`10 chars`)
- 5M+ (`3 chars`)

**Duration:** 3 days

### X Poll 2: `poll-2026-05-25-ton-bid-real-or-fluke`

**Tweet text:** $TON ripped 10% while $BTC sat dead. Real bid or one-day fluke?

**Options:**

- Real bid building (`17 chars`)
- One-day fluke (`13 chars`)
- Telegram pump (`13 chars`)
- TON Strategy buying (`19 chars`)

**Duration:** 3 days

### X Poll 3: `poll-2026-05-25-kaspa-mascot-kasper-vs-nacho`

**Tweet text:** Real Kaspa mascot: Kasper-the-Ghost or Nacho?

**Options:**

- Kasper-the-Ghost (`16 chars`)
- Nacho (`5 chars`)
- Both have a place (`17 chars`)
- Neither, needs none (`19 chars`)

**Duration:** 3 days

---

## Section 4 — Long YT community posts (4)

### YT Post 1: `yt-post-2026-05-25-k1-hard-fork-priced-in`

**Topic:** The Kaspa hard fork is already priced in

**Body style:** named-opposition + macro-mechanics explainer + first-person close

**Body** (1968 chars):

```
The "what catalyst?" crowd keeps showing up under my Kaspa posts to ask what's supposed to make the price move. They think the hard fork is the surprise that finally pumps the chart. It's not, and the reason why is the most underappreciated idea in trading.

If the market knows something is coming, it's already in the price.

This is the same mechanic that runs every macro event. When the entire market expects a Fed cut, the day of the cut barely moves the tape. The move happens in the weeks leading in, while everyone repositions. By the time the announcement actually drops, the people who were going to buy have already bought, and the people who were going to sell have already sold. The headline is a non-event.

The Kaspa hard fork is the same setup. The dev team has been openly telegraphing this for months. There's no element of surprise. Anyone who wanted to front-run it has had every chance. So when people say "the hard fork should pump the price" and the chart doesn't cooperate, they're missing that the chart already cooperated quietly, on the way down to here. Maybe $KAS would be at 2 cents right now if the hard fork wasn't on the calendar. Instead it's holding 3.3 cents while $BTC is locked in a 109-day bear flag. That difference is the priced-in.

It cuts the other way too. If the market knows the fork is coming and the price action is flat, a "sell the news" dump after the fork is also baked in. The selling happens during the climb, not after the headline. So when nothing dramatic happens on fork day, that doesn't mean the catalyst failed. It means it already did its job.

This is why I don't trade on calendar dates. I accumulate into boredom. The interesting moves on $KAS won't come from the fork; they'll come from the spot demand wave that hits when retail decides crypto is back. By the time the headline is loud enough for retail to feel it, the bag is built.

What catalyst do you think isn't already in the price right now?
```

**Engagement question:** What catalyst do you think isn't already in the price right now?

### YT Post 2: `yt-post-2026-05-25-k2-kasper-mascot-not-nacho`

**Topic:** Real Kaspa mascot is Kasper-the-Ghost, not Nacho

**Body style:** opinionated take + GhostDAG context + community-first close

**Body** (1873 chars):

```
Somebody asked me about Nacho on a recent post, and I want to plant a flag on this.

Nacho is the pet of a Kaspa dev who left the project. I'm not knocking the cat. I'm pointing out that you don't get to keep the mascot if you walked away. A mascot represents the chain. The chain is built and maintained by people who stayed. If the lead human is gone, the pet doesn't get to keep flying the flag.

Kasper-the-Ghost is the mascot that actually fits. Here's why.

Kaspa is the first fully implemented GhostDAG. That's the whole protocol identity. The "ghost" in GhostDAG isn't decorative; it's the architecture. Ghost protocol blocks (the side blocks that don't make the main chain but still get counted) are exactly what lets Kaspa do 1 BPS today and target 10 to 100 BPS as the protocol matures. The ghost is in the code, in the consensus, in the name of the thing. Kasper-the-Ghost (the KRC20 meme token, ghost-themed, K-prefix to honor Kaspa) lines up with that identity perfectly. It's on-theme, on-chain, and didn't quit on the project.

This matters more than people realize. Mascots are how retail attaches to a chain. Pengu carried Solana's spotlight for months. Toshi is the face of Base. Doge was Dogecoin before there was a serious community around it. The right mascot is a free distribution channel. The wrong one (or one tied to a person who left) is a friction point you fight every cycle.

The "Nacho is fine" camp will tell you the community already adopted it. The community can also re-adopt. Kasper-the-Ghost has the K-prefix, the ghost theme, the alignment with the protocol's actual name, and the bonus that the dev behind Kasper is still building. That's the package.

I'm not telling anyone what to do with their meme bag. I'm telling you which one I think represents the chain.

Who do you think represents Kaspa better, Kasper-the-Ghost or Nacho?
```

**Engagement question:** Who do you think represents Kaspa better, Kasper-the-Ghost or Nacho?

### YT Post 3: `yt-post-2026-05-25-k5-eth-flips-btc-cascade-to-kas`

**Topic:** The cascade: ETH flips BTC, BTC maxis find Kaspa

**Body style:** long-horizon thesis + first-person conviction + provocative close

**Body** (2009 chars):

```
Here's the trade nobody is pricing in, because it doesn't happen this cycle.

I think ETH flips $BTC. Not next year, not the year after; somewhere around 2030, maybe a couple of years either side. The case is uncomfortable for Bitcoin maxis but not crazy: ETH is the institutional smart contract layer, the stablecoin settlement layer, the L2 anchor, and the asset most regulated entities are willing to actually touch. Add another five years of compounding adoption and the gap closes.

When the flippening lands, $BTC maxis have to look in the mirror.

This is the part the cycle zombies miss. A $BTC maxi has built a whole identity around proof-of-work being the only legitimate way to secure value, around fair distribution, around no premine, around no foundation deciding the future. Their #2 just became ETH. ETH is proof-of-stake, foundation-led, premined, validator-set politics, all the things they spent ten years calling fake money.

They are not going to migrate to ETH. They're going to look for the next chain that holds the original line.

The chain that holds the line is $KAS. Fair launch (no premine, no insider allocation), proof-of-work (GhostDAG, the most advanced PoW consensus in production), real BPS (1 today, 10 to 100 as the protocol matures), and the same monetary discipline (29B max supply, halving schedule). Everything a $BTC maxi already believes maps onto Kaspa. The only thing Kaspa is missing in the maxi mind right now is brand recognition, and brand recognition is exactly what a flippening event would provide.

This is why I'm a Kaspa maxi this cycle and probably the next two cycles. I'm not waiting for the flippening to start positioning. By the time the headline runs, the cost basis is whatever it is.

The four-year cycle zombies will tell you Kaspa is a top-30 chain that's "missed its window." I think the window is the next decade, and we just entered the lobby.

How many years out do you think the flippening hits, and what are you stacking in the meantime?
```

**Engagement question:** How many years out do you think the flippening hits, and what are you stacking in the meantime?

### YT Post 4: `yt-post-2026-05-25-t1-ton-ripped-while-btc-slept`

**Topic:** TON +10% while BTC sat dead. The asymmetry of the boring tape

**Body style:** live-observation + thesis + ranking close

**Body** (1878 chars):

```
Mid-livestream today I pulled up the dashboard and $TON was up 10 percent on the day. $BTC was sitting in its 109-day bear flag doing absolutely nothing. $PEPE was up less than 2 percent. $TON quietly ripped.

This is the asymmetry the four-year cycle zombies miss. When the tape is boring, the chains with real product keep bidding while the majors sleep.

$TON has two things most chains don't. First, it's plugged into Telegram, which means every Telegram payment, every mini-app integration, every wallet onboarded inside a chat is a distribution channel that doesn't exist anywhere else. Second, TON Strategy (the corporate treasury vehicle) has been quietly stacking. They now hold roughly 4.3 percent of total supply, north of 220 million $TON, and they keep adding. That is exactly the same playbook that turned MicroStrategy into a $BTC absorption machine, applied to a chain most retail still thinks of as the messenger token.

When $BTC is locked in a channel and headlines about Iran and the Fed are dominating, the people who keep buying real product are the ones setting the tape. They don't need a rally to operate; they're operating on the tape that exists.

I'll be clear about where TON sits in my own ranking. If Kaspa never existed, I'd be a $TON maxi. Speed is the single technical reason I rank it that high (TON is one of the fastest chains in production, just not as fast as Kaspa's GhostDAG). Add the Telegram distribution and the treasury bid, and the package is the closest thing to a non-Kaspa contender I'd take seriously.

Kaspa does exist, so I'm a Kaspa maxi. But $TON is a top-3 hold for me, alongside $TAO. The cycle zombies will tell you to wait for "real volume" to come back. I'd rather track the chains that are still getting volume while the majors nap.

What's your $TON cost basis right now, and are you treating it as a trade or a hold?
```

**Engagement question:** What's your $TON cost basis right now, and are you treating it as a trade or a hold?

---

## Section 5 — Threads (4, 7 tweets each)

### Thread 1: `thread-2026-05-25-k1-hard-fork-priced-in`

**Topic:** The Kaspa hard fork is already priced in

**Hook pattern:** Named opposition + macro analogy + first-person

**1/7** (224/280)

```
The "what catalyst?" crowd keeps asking what's supposed to move $KAS.

They think the Kaspa hard fork is the surprise that finally pumps the chart.

It's not, and the reason why is the most underappreciated idea in trading 🧵
```

**2/7** (198/280)

```
If the market knows something is coming, it's already in the price.

This is the same mechanic that runs every macro event. When everyone expects a Fed cut, the day of the cut barely moves the tape.
```

**3/7** (178/280)

```
The Kaspa hard fork is the same setup.

The dev team has openly telegraphed it for months. There's no element of surprise. Anyone who wanted to front-run it has had every chance.
```

**4/7** (262/280)

```
When people say "the fork should pump the price" and the chart doesn't move, they're missing that the chart already moved quietly, on the way down to here.

Maybe $KAS would be 2 cents right now if the fork wasn't on the calendar. Instead it's holding 3.3 cents.
```

**5/7** (192/280)

```
It cuts the other way too.

If the market knows the fork is coming and the price is flat, a "sell the news" dump is also baked in. The selling happens during the climb, not after the headline.
```

**6/7** (235/280)

```
Which is why I don't trade calendar dates.

I accumulate into boredom. The next real move on $KAS won't come from the fork; it'll come from the spot demand wave when retail decides crypto is back. By then your cost basis is what it is.
```

**7/7 (CTA)** (64/280)

```
What catalyst do you think isn't already in the price right now?
```


### Thread 2: `thread-2026-05-25-k2-kasper-mascot-not-nacho`

**Topic:** Real Kaspa mascot is Kasper-the-Ghost, not Nacho

**Hook pattern:** Named opposition + protocol-identity argument + community-first close

**1/7** (174/280)

```
Somebody asked me about Nacho again on a recent post. Planting a flag.

Nacho is the pet of a Kaspa dev who left the project. You don't get to keep the mascot if you walked 🧵
```

**2/7** (207/280)

```
Not knocking the cat. Pointing out that a mascot represents the chain, and the chain is built and maintained by the people who stayed.

If the lead human is gone, the pet doesn't get to keep flying the flag.
```

**3/7** (267/280)

```
Kasper-the-Ghost is the mascot that actually fits.

Kaspa is the first fully implemented GhostDAG. The "ghost" isn't decorative; it's the architecture. Ghost protocol blocks are exactly what lets Kaspa hit 1 BPS today and target 10 to 100 BPS as the protocol matures.
```

**4/7** (182/280)

```
Kasper-the-Ghost (KRC20 meme token, ghost-themed, K-prefix to honor Kaspa) lines up perfectly with that identity.

On-theme, on-chain, didn't quit on the project. That's the package.
```

**5/7** (243/280)

```
Mascots matter more than people realize.

Pengu carried Solana's spotlight for months. Toshi is the face of Base. The right mascot is a free distribution channel. The wrong one (or one tied to a dev who left) is friction you fight every cycle.
```

**6/7** (242/280)

```
The "Nacho is fine" camp will tell you the community already adopted it.

The community can also re-adopt. Kasper has the K-prefix, the ghost theme, the alignment with the protocol name, and the bonus that the dev behind it is still building.
```

**7/7 (CTA)** (181/280)

```
I'm not telling anyone what to do with their meme bag.

I'm telling you which one I think represents the chain.

Who do you think represents Kaspa better, Kasper-the-Ghost or Nacho?
```


### Thread 3: `thread-2026-05-25-k5-eth-flips-btc-cascade-to-kas`

**Topic:** The cascade: ETH flips BTC, BTC maxis find Kaspa

**Hook pattern:** Long-horizon thesis + cycle-zombie call-out + provocative close

**1/7** (142/280)

```
Here's the trade nobody is pricing in, because it doesn't happen this cycle.

I think ETH flips $BTC. The cascade after it is the real story 🧵
```

**2/7** (246/280)

```
Not next year, not the year after. Somewhere around 2030, maybe a couple of years either side.

The case is uncomfortable for $BTC maxis but not crazy: ETH is the institutional smart contract layer, the stablecoin settlement layer, the L2 anchor.
```

**3/7** (213/280)

```
When the flippening lands, $BTC maxis have to look in the mirror.

Their #2 just became proof-of-stake, foundation-led, premined; everything they spent ten years calling fake money.

They are not migrating to ETH.
```

**4/7** (182/280)

```
They're going to look for the chain that holds the original line.

Fair launch. No premine. Real proof-of-work. Monetary discipline. The same identity they built around for a decade.
```

**5/7** (214/280)

```
That chain is $KAS.

Fully implemented GhostDAG. 1 BPS today, 10 to 100 BPS as the protocol matures. 29B max supply, halving schedule, no insider allocation. Everything a $BTC maxi already believes maps onto Kaspa.
```

**6/7** (144/280)

```
The only thing Kaspa is missing in the maxi mind right now is brand recognition.

Brand recognition is exactly what a flippening event provides.
```

**7/7 (CTA)** (248/280)

```
I'm not waiting for the flippening to start positioning.

The four-year cycle zombies will tell you Kaspa missed its window. I think the window is the next decade, and we just entered the lobby.

How many years out do you think the flippening hits?
```


### Thread 4: `thread-2026-05-25-t1-ton-ripped-while-btc-slept`

**Topic:** TON +10% while BTC sat dead

**Hook pattern:** Live observation + thesis + ranking close

**1/7** (173/280)

```
Mid-livestream today I pulled up the dashboard and $TON was up 10% on the day.

$BTC sat in its 109-day bear flag doing nothing. $PEPE up less than 2%. $TON quietly ripped 🧵
```

**2/7** (147/280)

```
This is the asymmetry the four-year cycle zombies miss.

When the tape is boring, the chains with real product keep bidding while the majors sleep.
```

**3/7** (180/280)

```
$TON has two things most chains don't.

First, it's plugged into Telegram (every payment, every mini-app, every wallet onboarded in-chat is a distribution channel nobody else has).
```

**4/7** (217/280)

```
Second, TON Strategy has been quietly stacking. Roughly 4.3% of total supply, north of 220M $TON, still adding.

That's the MicroStrategy playbook applied to a chain most retail still thinks of as the messenger token.
```

**5/7** (196/280)

```
When $BTC is locked in a channel and Iran/Fed headlines dominate, the people still buying real product set the tape.

They don't need a rally to operate. They're operating on the tape that exists.
```

**6/7** (228/280)

```
I'll be clear on where $TON sits in my ranking.

If Kaspa never existed, I'd be a $TON maxi. Speed is the technical reason. Add Telegram distribution and the treasury bid; it's the closest non-Kaspa contender I'd take seriously.
```

**7/7 (CTA)** (162/280)

```
Kaspa exists, so I'm a Kaspa maxi.

But $TON is top-3 for me alongside $TAO.

What's your $TON cost basis right now, and are you treating it as a trade or a hold?
```


---

## Image flags — reference uploads / fallbacks needed

**No IG cross-posts this batch** (per Mike's request — single-line tweets only went to `x-tweets.json`, not to `ig-single-image.json`).

That said, if Mike wants to spin up images later for any of these 10 tweets, here are the visual notes:

| Tweet ID | Reason / visual concept | Recommended action |
|---|---|---|
| `tweet-2026-05-25-k1-hard-fork-priced-in` | Pure text/concept; no logos. | No reference needed. |
| `tweet-2026-05-25-k2-kasper-mascot-not-nacho` | Two mascot characters in one frame (Kasper-the-Ghost + Nacho); generator may not nail either. | Upload Kasper-the-Ghost + Nacho references OR single-spotlight Kasper with $KAS framing. |
| `tweet-2026-05-25-k3-big-buyers-stay-quiet` | Abstract concept (silent accumulation). | No reference needed; suggest "empty room with one quiet bidder" visual. |
| `tweet-2026-05-25-t1-ton-ripped-while-btc-slept` | $TON + $BTC logos in one frame. | $TON logo well-known; $BTC obviously fine. No reference needed. |
| `tweet-2026-05-25-m1-iran-deal-weekly-script` | News/headline concept; no logos. | No reference needed. |
| `tweet-2026-05-25-k4-109-day-bear-flag-2017-comp` | Chart with bear flag pattern + sleeping bull. | No reference needed; flag-shape chart visual works. |
| `tweet-2026-05-25-k5-eth-flips-btc-cascade-to-kas` | $ETH + $BTC + $KAS logos in cascade. | Three well-known logos; generator handles. No reference needed. |
| `tweet-2026-05-25-k6-community-3p6m-kas-by-summer` | $KAS logo + accumulation visual. | No reference needed. |
| `tweet-2026-05-25-k7-if-kas-didnt-exist-ton-tao` | $KAS + $TON + $TAO logos. | All three well-known; no reference needed. |
| `tweet-2026-05-25-s1-slippy-150pc-after-mention` | Slippy frog (KRC20) mascot; generator won't know it. | Upload Slippy reference image OR text-label fallback. |

**Summary:** 2 entries flagged for likely reference upload if images are wanted later (K2 Kasper+Nacho multi-mascot; S1 Slippy mascot). The rest render fine without references.

