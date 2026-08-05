# ethereum-rwa — AS-RECORDED

**⛔ BUILD THE EDIT TO THIS FILE, NOT TO `SCREENPLAY.md`, WHEREVER THEY DIFFER.** The screenplay is the
pre-production intent; this is what Mike actually said, timecoded on the final spine. Every cue, container,
chart and transition is placed off THESE timecodes.

- **Final spine:** `spine/ALL.e.desilenced.mp4` — **417.41s (6:57.41)**, 1080p30. LOCKED.
- **Transcript (cue source):** `spine/ALL.e.desilenced.medium-words.json` (Whisper medium, word-level,
  NOT hand-edited). Human-review breakdown: `spine/ALL.e.desilenced.segments.txt`.
  113 segments · 1265 words · last word ends 417.36.
- **Timecode chain** (every remap file in order, with the shift each stage applied):
  `spine/ALL.c.desilenced.map.json` (b→c, 700ms pass) → `spine/ALL.d.cleaned.cuts.json` (c→d, 4 burst cuts:
  ≥262.78s shifts −0.179s · ≥296.95s −0.419s · ≥318.63s −0.787s) → `spine/ALL.e.desilenced.map.json`
  (d→e, the final 230/500ms two-zone pass).
  **⚠ All timecodes BELOW are already FINAL e-spine coords — cue the comp directly off them, no remapping.**
- Spine-prep chain in `spine/`: `ALL.lowbps` → `ALL.a.defumbled` → `ALL.b.blackout` → `ALL.c.desilenced`
  (700ms) → `ALL.d.cleaned` (4 bursts) → `ALL.e.desilenced` (230ms intro / 500ms body @53.33s split).

## Whisper mishears to FIX in any captions / on-screen text

The word-time JSON is the un-edited cue/timing source, so **this list is what gets re-applied at caption build.**

| TC | Whisper wrote | Correct |
|---|---|---|
| **309.28** | "Ethereum **flipped** Bitcoin" | **"Ethereum FLIPS Bitcoin"** — present tense, with an S. ⚠️ **LOAD-BEARING** (Mike-confirmed 2026-07-31). Whisper medium AND large-v3 both got this wrong. The "and we're around 2030" that follows is CORRECT as transcribed. |
| 264.18 | "keep a current value" | "keep **accruing** value" |
| 287.32 | "not the floor in this story" | "not the **flaw** in this story" |
| 343.66 | "the lab token" | "the **LABS** token" |
| 62.32 | "and a plug straight into DeFi" | "and **it plugs** straight into DeFi" |
| 118.26 | "standard charter" | "**Standard Chartered**" |
| 150.30 | "anchor to your Ethereum underneath" | "**anchored to** Ethereum underneath" |
| 239.10 | "BlackRox Fund" | "**BlackRock's** fund" |
| 257.32 | "Ethereum is cut" | "**Ethereum's cut**," |
| 32.90 | "the one to big money trust" | "the one **the big money trusts**" |
| 65.76 | "startups and a sandbox" | "startups **in** a sandbox" |

Plus casing: **Robinhood Chain** ×3 · **BitMine** · testnet/mainnet · **Layer 2 / Layer 2s** ×4 · 550X/350X/50Xers/30Xers.
Full list with every occurrence: the CORRECTIONS APPLIED block in `spine/ALL.e.desilenced.segments.txt`.

---

## Chapter map (re-derived from the words)

| CH | Start | End | Length | Screenplay target | Delta |
|---|---|---|---|---|---|
| CH1 | 0.00 | 48.92 | 0:49 | ~0:50 | on target |
| CH2 | 48.92 | 129.92 | 1:21 | ~1:05 | +16s |
| CH3 | 129.92 | 200.34 | 1:10 | ~1:10 | on target |
| CH4 | 200.34 | 289.54 | 1:29 | ~1:20 | +9s |
| CH5 | 289.54 | 417.41 | **2:08** | ~0:55 | **+1:13** |

**CH1-CH4 = 4:49.54.** The entire runtime overrun is CH5. **CH5 TRIM RULING IS PENDING (Mike).**

## FACE windows (blackdetect on the cover-blacked picture; non-black = FACE)

| # | Span | Length | Carries |
|---|---|---|---|
| 1 | 0.00 - 8.44 | 8.44s | the locked opener / hook |
| 2 | 29.96 - 30.73 | 0.77s | the one-word reveal: "Ethereum." |
| 3 | 107.54 - 111.88 | 4.34s | CH2 punctuation: "the most conservative money on earth" |
| 4 | 142.74 - 144.78 | 2.04s | CH3 punctuation: "and they built it on Ethereum" |
| 5 | 279.18 - 286.12 | 6.94s | CH4 asymmetry payoff (the tollbooth line) |
| 6 | **306.27 - 391.19** | **84.92s** | the whole CH5 ad-lib block |
| 7 | 409.04 - 417.41 | 8.37s | closing CTA |

COVER (black) spans: `8.44-29.96` · `30.73-107.54` · `111.88-142.74` · `144.78-279.18` · `286.12-306.27` · `391.19-409.04`.
All 7 FACE windows land on a scripted `[FACE]` beat. **No orphans.** Face = 115.8s (27.7%), cover = 301.6s (72.3%).

---

## CH1 — The wave nobody's watching  [0.00 - 48.92]  ✅ as scripted

| TC | As recorded | vs screenplay |
|---|---|---|
| 0.00-15.06 | "While everybody in crypto has been staring at the price, the biggest institutions in the world have been moving their real world assets onto the blockchain, real treasuries, real funds, real stocks, over $30 billion worth and almost nobody's talking about it." | **KEPT** (locked opener, near-verbatim; "in the world" for "on Earth") |
| 15.26-29.94 | "At the start of last year, this whole market was about $5 billion. Today it's over 30 billion, up more than 400% in just a year and a half, and more than 60% of all that value settles on one chain." | KEPT |
| 29.94-32.84 | "Ethereum. Not the fastest chain, not the cheapest," | KEPT — the reveal (FACE 2) |
| 32.90-35.66 | "the one the big money trusts. And one month ago," | KEPT |
| 36.04-44.40 | "one of the biggest brokerages in America plugged a brand new chain of their own straight onto it." | KEPT (brokerage stays unnamed, as planned) |
| 44.50-48.70 | "So let me show you who actually is building on Ethereum, what just launched and why almost everybody is mispricing what it means." | **CHANGED** — the scripted "Let's dive in." was **DROPPED** |

## CH2 — The proof  [48.92 - 129.92]  ✅ as scripted, +BUIDL gloss

| TC | As recorded | vs screenplay |
|---|---|---|
| 48.92-65.70 | "So what's actually happening here? Well, tokenization, plain English, take a real asset, a treasury bill, a fund, a stock, and issue it as a token on a blockchain. Now it settles in minutes. It trades around the clock and it plugs straight into DeFi." | KEPT |
| 65.76-74.58 | "And we're not talking about startups in a sandbox. BlackRock, the biggest asset manager on the planet, just launched a tokenized fund called" | KEPT ("And we're not talking about" for "And this is not") |
| **75.32-80.60** | **"BUIDL, which stands for BlackRock USD, Institutional Digital Liquidity Fund."** | ✅ **the acronym gloss Mike requested — DELIVERED on the take** |
| 80.64-93.20 | "And that happened in March of 2024 on Ethereum specifically. Today that fund holds roughly $3 billion across eight different chains. And the single biggest slice, over a billion, sits on Ethereum." | KEPT — the "single biggest slice" guard phrasing held |
| 93.20-107.50 | "Now, here's the thing, around 80% of this whole market is treasuries and cash type products. That's institutional money. And institutional money doesn't really chase the hottest new chain. It parks on the most battle tested chain there is." | KEPT |
| **107.58-111.84** | "So the most conservative money on earth is actually parking right on Ethereum." | **CHANGED** (paraphrase of "keeps choosing Ethereum") — FACE 3 |
| 111.84-117.48 | "Ethereum's own tokenized market more than tripled in the last year to over $17 billion." | KEPT |
| 118.00-129.80 | "And Standard Chartered projects that this whole space could hit nearly $2 trillion by 2028. And most of that on Ethereum. And that's a forecast, not a promise, but take a look at the direction." | KEPT — ✅ **the forecast guard held verbatim** |

## CH3 — Robinhood Chain  [129.92 - 200.34]  ✅ as scripted

| TC | As recorded | vs screenplay |
|---|---|---|
| 129.92-133.30 | "And now we get to the thing that made everybody really sit up in their chair." | CHANGED (looser than "the launch that made everybody sit up") |
| 133.76-141.68 | "July 1st, one month ago, Robinhood, one of the biggest retail brokers in America, took their own blockchain live." | KEPT |
| 141.68-146.16 | "The Robinhood Chain, and they built it on Ethereum. It's a Layer 2." | KEPT — FACE 4 @142.74-144.78 |
| 146.26-161.26 | "That's a chain that runs on top of Ethereum, fast and cheap up top and anchored to Ethereum underneath for security, built with Arbitrum's tech, new blocks every hundred milliseconds, and the gas, the fuel the chain runs on, that's ETH itself." | KEPT — full L2 gloss delivered |
| 161.34-173.18 | "And what trades on it? All the stocks, like Nvidia, Google, Apple, as tokens, 24 hours a day, seven days a week and over 120 different countries. And that's all through their Robinhood wallet." | KEPT |
| 173.46-185.06 | "Look at this, 4 million transactions in the first week of testnet. Three weeks after mainnet, over $250 million parked on the chain and four and a half billion dollars of trading volume in a single week." | KEPT |
| 185.10-192.60 | "So most tokenized stock trading today actually happens on Solana, like 95% of that volume. So yeah, that lead is real," | KEPT — ✅ **the Solana honesty beat held.** Scripted lead-in "Now, full transparency." was **DROPPED** |
| 192.60-200.34 | "but that's exactly what makes this launch so loud. Robinhood could have built anywhere. With their own name on the door, they anchored to Ethereum." | KEPT — ✅ **no fee-revenue overclaim. WARNING-box 1 respected on the take.** |

## CH4 — The bull case for ETH itself  [200.34 - 289.54]  ✅ as scripted

| TC | As recorded | vs screenplay |
|---|---|---|
| 200.34-202.94 | "So why is all this bullish for Ethereum, the asset?" | CHANGED — says "Ethereum" not the scripted "ETH" (he uses both freely; see FLAG C) |
| 202.96-213.94 | "Let's start with supply. Almost 29% of all ETH is staked. That means locked up, securing the network, earning yield. And the line to get in is about 10 times longer than the line to get out." | KEPT |
| 214.02-231.88 | "On top of that, public companies now hold almost 8 million ETH in their treasuries. Another six and a half percent of supply. One of them, BitMine, holds 5.7 million by itself, and their stated goal is 5% of all ETH in existence." | KEPT |
| 231.88-246.50 | "Then the ETF pipe, that's stock money buying ETH through a ticker, almost $200 million of net inflows in a single week in July with BlackRock's fund leading, and the newest funds can actually stake the ETH they hold. So Wall Street demand feeds the same lockup." | KEPT |
| 246.54-253.12 | "And this is where it gets interesting. All of this activity lives on Layer 2s and almost none of those fees reach Ethereum yet." | CHANGED (dropped "Now, the honest part, because…") |
| **253.40-261.68** | "Robinhood Chain generated about 800 grand in fees in this first week. Ethereum's cut, about 1500 bucks. That's 0.15%." | KEPT — ⚠️ **"in THIS FIRST WEEK" (singular). See FLAG D: the sourced $816K is CUMULATIVE through July 13. The on-screen chart must NOT follow the VO here.** |
| 261.68-277.90 | "Even Vitalik says out loud, ETH has to keep accruing value in a Layer 2 world. And that's what the Fusaka upgrade goes after. It puts fee floors, a minimum toll for using Ethereum security, under the Layer 2s. Those floors start low today and it's a fix in progress, not a finished pipeline." | KEPT |
| 278.20-289.30 | "So you can see here, the biggest asset wave is choosing Ethereum rails before the toll booth is even finished. So that gap is not the flaw in this story. It's more of the setup." | KEPT — FACE 5 @279.18. ✅ **asymmetry framing intact** |

## CH5 — Ride the wave  [289.54 - 417.41]  ⚠️ HEAVY AD-LIB (2:08 vs scripted 0:55)

**Beats 2-8 below are entirely unscripted.** Nothing here is a retake, so the defumbler correctly kept all of it.
**This is the chapter Mike must rule on.**

| # | TC | As recorded | Status |
|---|---|---|---|
| 1 | 289.54-306.28 | "So look at the whole board, the biggest asset manager on earth, building on Ethereum, the biggest retail broker in America, anchored to Ethereum, nearly a third of the supply locked up or held, Wall Street buying through tickers, and the value capture upgrade already in motion." | **SCRIPTED** (CH5 Beat 1, kept). COVER callback montage |
| 2 | 306.28-322.50 | "And you guys want to know what my call is really? I say that Ethereum **flips** Bitcoin, and we're around 2030, 2032, 2035, but I think there's a lot of multipliers left in Ethereum and it's going to actually flip Bitcoin just because of its use case." | **AD-LIB.** Scripted was ONE sentence. FACE 6 opens 306.27. ✅ FLAG A RESOLVED (see below) |
| 3 | 322.62-326.36 | "I could be wrong and this is not financial advice, of course, right?" | **AD-LIB** — disclaimer |
| 4 | 326.40-346.38 | "But I've been known in recent times for calling some really good calls on multiple hundred plus Xers, right? Up to a 550X less than a year ago, and countless 50Xers and 30Xers and so on. Like just recently, we did a 350X on the LABS token. So that's one of them. That was just two months ago," | **AD-LIB** — track record. ⚠️ every multiplier needs `[VERIFY]` at publish (persona `verified_claims_only`) |
| 5 | 346.68-354.28 | "but you want to check back in with me in like, I don't know, five years and maybe seven years, maybe eight years, but we'll see." | **AD-LIB** |
| 6 | 354.52-372.92 | "But mark my words. I think that if Ethereum is going to flip Bitcoin, the market cap is going to be greater than Bitcoin. The amount of multipliers you'll get is definitely going to be a lot more than Bitcoin. So I think that out of all the top 10 cryptos, I think you'll get the most multipliers out of Ethereum. I think so." | **AD-LIB** |
| 7 | 373.02-384.56 | "We'll see. I mean, definitely a few of them here and there, like XRP, right? It's a good project, the large market cap. It'll give you some multipliers, but I think you'll get more multipliers out of it. That's just what I'm thinking." | **AD-LIB** — XRP tangent. ⚠️ see FLAG B (referent) |
| 8 | 384.74-391.66 | "So, but anyways, click the link in the description below. If you want in on some of that hundred X action or 500 X action, but anyway," | **AD-LIB** — mid-block community CTA. ⚠️ **duplicates the closing CTA 18s later** |
| 9 | 391.82-408.98 | "back to Ethereum, this is the kind of structural demand that, that call runs on, right? It's not a meme cycle, real assets, real institutions choosing one chain. And if the banks are even half right, about $2 trillion by 2028, the chain underneath that wave is not priced for it. Not even close." | **SCRIPTED** (CH5 Beats 1-2 tail). COVER resumes 391.19. ✅ conditional framing held |
| 10 | 409.10-417.36 | "So if you liked this video, if you liked the content, give me a like, give me a subscribe, comment below. Of course. Let me know if you think I'm crazy, or you think I'm right on target." | **SCRIPTED-ish** — FACE 7. ✅ **HARD OUT CONFIRMED (Mike, 2026-07-31): the scripted "I'm gonna catch you guys, later." sign-off is intentionally NOT recorded. No pickup. The video ENDS on the last word (417.36).** |

### ✅ CH5 RULING (Mike, 2026-07-31): NOTHING IS CUT. Build the edit to CH5 in full.
Mike: *"There's nothing that I want to cut out."* CH5 stays exactly as recorded, all 10 beats, **2:08**.
The video's final runtime is **6:57**, which is normal house length (Clarity Act shipped at 6:59).

**The ~5:00 figure in `PROJECT-LOG.md` / `SCREENPLAY.md` was a pre-record planning aid and is now SUPERSEDED.**
Do not treat the delta against it as an overrun, and do not propose trims: the CH5 ad-lib beats are deliberate
content (the defumbler already removed every retake, so what survived is what he chose to say). The flippening
call and the track-record run are core conviction beats, not filler.

**Downstream consequence: every timecode in this file is FINAL.** MUSIC-PLAN's BED D end-alignment and all its
mid-track alignments stand as authored; the `CH5 TRIM RULING PENDING` entry in `MUSIC-PLAN.json` →
`open_questions` is now resolved (no re-derivation needed). EDIT-PLAN / CUE-SHEET / coverage / transitions can
be authored against these timecodes directly.

---

## Divergence summary

**Dropped from the screenplay (spoken lines not said):** "Let's dive in." (CH1) · "Now, full transparency." (CH3) · "Now, the honest part, because this is where it gets interesting." (became "And this is where it gets interesting.", CH4) · **"I'm gonna catch you guys, later."** (CH5 sign-off).

**Added (not in the screenplay):** the entire CH5 ad-lib block (beats 2-8, ≈85s).

**Screenplay guards that HELD on the take** (all three `[!WARNING]` boxes respected):
1. ✅ No fee-revenue overclaim. CH3 says only "they anchored to Ethereum" (architecture); the money story stays in CH4 and is framed as asymmetry ("not the flaw in this story, it's more of the setup").
2. ✅ The $2T figure is voiced as a Standard Chartered **forecast**, with "that's a forecast, not a promise" said out loud.
3. ✅ The Solana tokenized-equities lead is acknowledged on the take ("like 95% of that volume, that lead is real") before the pivot.

---

## Flags carried into the edit

- **FLAG A @309.28-314.06 — ✅ RESOLVED by Mike, 2026-07-31.** The correct line is:
  > "I say that Ethereum **flips** Bitcoin, **and we're** around 2030, 2032, 2035"
  **Whisper medium got "flipped" wrong (present tense "flips", with an S) but got "and we're" RIGHT.**
  Whisper large-v3 was wrong on BOTH ("flipped" + "somewhere around") — do not trust the larger model here.
  ⚠️ **"flips" is a MISHEAR CORRECTION that must be applied at caption build** (the word-time JSON still
  carries "flipped" as raw cue data; see the corrections list in `spine/ALL.e.desilenced.segments.txt`).
  Any caption, on-screen quote, title, or description text quoting this line uses **"flips"**, present tense.
- **FLAG B @383.14:** "you'll get more multipliers **out of it**" — referent unstated. From context he means Ethereum (vs the just-named XRP). If a container is built here it must not visually attribute the multipliers to XRP.
- **FLAG C @201.76:** says "Ethereum, the asset" not the scripted "ETH, the asset". He uses ETH/Ethereum interchangeably throughout; on-screen text should pick one and stay consistent.
- **FLAG D @253.40 (fact-framing, NOT a transcription error):** "in this first week" is singular, but the sourced $816K is **cumulative through July 13**. The `[D4-C]` fee-gap chart must label the figure as cumulative, not follow the VO.
- **FLAG E @161.34:** "All the stocks, like Nvidia…" could be "Oh, the stocks" / "So, the stocks". Low stakes, lead-in clause only.
- **CH5 track-record numbers (550X, 350X on LABS, "countless 50Xers and 30Xers")** all need `[VERIFY]` against reality at publish time per persona `verified_claims_only` (a multiplier quoted in a recording drifts by posting date).
