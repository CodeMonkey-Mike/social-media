# quant - SCREENPLAY

_Pre-production script for the longform-edited video "What Is Quant?". Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py --face-max 12`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; no cold open. Authored 2026-11-04 from the LOCKED brief in `PROJECT-LOG.md` and the fact source `DATA.md`._

- **Working title:** What Is Quant? (alternates for Mike at GATE 1: "What Is Quant? The Deep Dive My Community Asked For" · "Quant: The Layer The Banks Let In")
- **Track / channel:** longform-edited (16:9), CryptoRich. Standard delivery (FINAL staged to the longform queue; the YouTube upload is Mike's own).
- **Archetype / register:** a measured DEEP DIVE explainer in Quant's own visual identity (white page, warm near-black #43403E, one orange #F15A22), half of it told as a hand-drawn whiteboard STORY ("the islands"), under one continuous drone bed. Gear map: **CH1 = gear 1 into gear 2** (the locked line is Mike off the cuff on his shared screen, the definition is explainer) · **CH2 to CH6 = gear 2** (whiteboard pace: slow, deliberate, one idea per line, room for each drawing to land; the screen-share reactions in CH3 and CH5 drop to gear 1) · **CH7 = gear 3** for the one landing line, then the persona CTA. No "right?" tags on the landing line, no hedge, no whole-video spoiler anywhere.
- **Spine architecture: SCREEN-SHARE face mode** (longform-edited.md house rule #1b; `--face-mode screenshare`, `GRAPH-PROGRESS.json settings.face_mode`). A 👤 `[FACE]` beat is Mike SHARING HIS SCREEN: webcam PiP bottom-right and the CTA box top-right as recorded (the binance OBS layout: deck area x 0 to 1464 of 1920, the right column his), and the BODY of the shared screen shows content WE put there, cued to his words. Every `[FACE]` beat carries a 🎬 `[SHOW]` line starting `BODY:`. **The length of a face beat does not change: ONE sentence (a tight pair allowed), as every face beat (Convention 3), the body content landing on that sentence; the next line is an explicit 🗣️ `[COVER]`, usually the same card or chart full-frame continuing under the read.** The one exception is the locked opening line (Mike's own words). **10 `[FACE]` lines in the whole video, cap 12** (CH1 x2, CH2 x1, CH3 x2, CH4 x1, CH5 x3, CH7 x1). Every other spoken line is 🗣️ `[COVER]`: full-frame visuals, no face. The video OPENS on a screen-share beat (the locked line).
- **Recording note for Mike:** record in the binance OBS layout, the webcam bottom-right, the CTA box top-right, the deck area showing anything neutral (it is painted over in the edit). Read the whiteboard chapters SLOW: one sentence, a breath, the next sentence. Face beats are the screen-share beats; cover beats are read with the camera still rolling (the frame is painted over).
- **Captions: NONE** (`--caption-scope none`; Mike, 2026-11-04). Not on the screen-share beats, not on the covers.
- **Whiteboard = HALF the video** (`--whiteboard-share 0.5`, held in code at 47 to 53 percent of the delivered runtime). Pen **`paper-quant`** (white paper, warm near-black ink, orange as the one accent, pale-orange fills). Eleven beats WB1 to WB11, 20 to 30 s each, around 290 s together, telling ONE story: **the islands of money**. Canvas 1920x1080 for every whiteboard; WB11 runs on under the landing line's screen share, scaled into the deck area (house rule #1b). Contract: `video-creation/skills/whiteboard-beat/whiteboard-beat.md`.
- **Cover layer:** whiteboard beats, deck cards, system-design chart C1, animated charts C3 to C7, real-site receipts (quant.network's own orange diagrams and hero art, The Clearing House, UK Finance, the Bank of England, the ECB, Murex, Etherscan). **No Envato b-roll, no ChatGPT images** (`--envato-max 0 --chatgpt-max 0`). Three to five site captures get a SLOW Seedance image-to-video move (480p ONLY, 16:9, 4 s, the still as fallback; VISUAL-PLAN lists the candidates, Mike picks).
- **Container theme:** light + accent quant (`--container-theme light --container-accent quant`): every card, title card, system-design chart and animated chart on `container-canonical-light.css` + `accents/quant.css`. Title cards in the same look (white card, near-black title, the key word orange).
- **Music:** ONE drone bed for the whole video, `solstice` (DeHartmann, Soundstripe 14703, 72 BPM, Ab major, 4:17; `fresh` in the usage ledger, nothing blocked applies). Frame 0 to the last frame, ducked under the VO, extended by the ONE-TRACK CARVE method. See MUSIC-MOOD-PLAN.
- **Target runtime:** around 10:00 (hard window 9:00 to 11:00). Spoken-word budget around 1,620 words (inside Mike's 1,400 to 1,650); per-chapter budgets on each chapter header. Runtime is never a reason to cut a recorded line; it was the reason to write fewer lines. Lines flagged 💬 trim-first come out first if a read runs long BEFORE recording.
- **Fact source:** every number, date, name and quote traces to `DATA.md` in this folder (compiled 2026-11-04). Chart IDs C1 to C22 = DATA.md CHART-SOURCE INDEX; K1 = a deck card defined here; WB1 to WB11 = the whiteboard beats defined here. Live-drift figures carry 🔍 `[VERIFY]` and are re-pulled at record time.

---

## THE HOOK / THESIS

Quant is a London company (incorporated 2015, founder and CEO Gilbert Verdian) that sells banks a software layer, not a new chain: Overledger connects a bank's existing systems and payment rails to public and permissioned ledgers, Quant Flow lets the bank write rules into the money, QuantNet orchestrates movement across networks "without ever holding funds", and Quant Fusion is a rollup live on mainnet since 2026-06-02. The receipts are real and dated: UK Finance's GBTD platform with seven banks did its first live customer transactions in September 2026, and on 2026-09-24 The Clearing House, owned by 25 of the largest US financial institutions, selected Quant to power its tokenised-deposit network due in the first half of 2027. The token, QNT, has a fixed supply of around 14.6 million; its documented utility is Overledger licence fees payable in QNT; none of the bank contracts names the token. Against the market, Quant's share of the total crypto cap re-rated around 3x in 10 weeks after the TCH news yet sits at a third of its 2022 peak; against a peer basket it is the only line above its level of 2025-11-05; in Bitcoin it is around 3.5x up on the year and around 22 percent of its 2022 best. The video's product is clarity; every upside line stays conditional.

> [!WARNING]
> **DO NOT AIR "QNT supply is 14.9 million" or "max supply 45.5 million".** 14.9M is CoinMarketCap's figure and disagrees with the contract side; 45,467,000 is the contract's hard-wired theoretical maximum, not a supply. CoinGecko (14,612,493 total = max; 14,556,178 circulating) and Etherscan (14,556,178 circulating) agree with each other and with Quant's own figure. Airable: "around 14.6 million QNT, and the supply is fixed".

> [!WARNING]
> **DO NOT AIR any ICO figure** (a 1.10 dollar sale price, 11 million raised, 9.96 million sold, a 9.4 million burn on 2018-09-14): all from aggregator sites, Quant's 2018 sale page is gone. Airable: "sold to the public in 2018; the unplaced tokens were taken out of supply the same year". No price, no raise.

> [!WARNING]
> **DO NOT AIR "licence QNT is locked in the treasury for 12 months" or anything about staking / staking returns.** Neither is in any primary source opened (the 2021 release says the fee "can now be paid in QNT"; Blockworks describes a treasury contract and a 12-month STAFF vesting period). Airable: "licence fees for Overledger are payable in QNT" (Quant, 2021-12-15).

> [!WARNING]
> **DO NOT AIR "Quant runs the whole US payment system", "the 2 trillion dollars a day now runs on Quant", "a 560 trillion dollar network", "picked by the 25 US banks" or "JPMorgan, Citi, Bank of America chose Quant".** TCH clears more than 2 trillion dollars a day on its EXISTING rails; the On-Chain Money Initiative is a NEW tokenised-deposit network due in the first half of 2027; TCH (not the banks individually) selected Quant; "run the whole US payment system" is Verdian's on-camera framing, not TCH's. Airable: "The Clearing House, owned by 25 of the largest US banks and clearing more than 2 trillion dollars a day on its existing rails, picked Quant to build its new tokenised-deposit network, due in the first half of 2027".

> [!WARNING]
> **DO NOT AIR "Quant partnered with Mastercard", "the European Commission works with Quant", "Oracle uses QNT", "Quant Flow is live with corporate clients", "150 use cases", or the Rosalind "33 APIs / 30 use cases".** Mastercard appears only as Verdian's former employer and as a UK RLN participant; the EU receipt is the European Central Bank's digital euro innovation platform (pioneer, 2025); the Oracle 2025 product tie-up is secondary-only and is NOT scripted; the other three have no primary source. Say "European Central Bank", never "Commission".

> [!WARNING]
> **DO NOT AIR a revenue figure** ("11.5M to September 2025, 99.8 percent intra-group, 180x revenue"): the filed accounts are a scanned PDF nobody read. The video is silent on revenue. **DO NOT AIR any price target** ("267 if as big as Canton", "584 if as big as Chainlink"): what-if arithmetic, forbidden by the persona. **DO NOT AIR "up 3.6x against Bitcoin" without both dates**: the ratio drifts daily (3.54x on 2026-11-04 from 2025-11-05).

> [!WARNING]
> **DO NOT AIR "founded in 2018" or "Verdian is the Convenor of ISO's interoperability working group WG7".** Companies House: incorporated 2015-09-28 (as REMITT LTD until 2017-06-02); Overledger and the token arrived in 2018. ISO's own page lists WG 7 as "Use cases" and WG 8 as "Interoperability" with other convenors, and TC 307 dates from 2016. Airable: "Quant says it helped set up the ISO blockchain committee in 2016 and helped publish the 2026 interoperability standard".

> [!WARNING]
> **DO NOT AIR "Quant dominance peaked at 0.155 percent on 2026-09-27".** That is a 4-hour intraday TradingView reading; the CMC month-end series gives 0.064 percent that day, and the all-time peak of share is 2022-10-18 at 0.269 percent. The C5 card names its vendor.

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | THE OPEN | The locked opening on Mike's shared screen (the video opens here, no cold open); what Quant is in one line; the handoff | Bed A (Solstice) starts at frame 0, its 8 s build-in under the first words | OFF (the screen share is frame one) | ~1:05 / ~160 words |
| CH2 | ISLANDS OF MONEY | The story: every bank is an island (WB1), tokenised deposits and walled gardens (WB2), the layer above, not another island (WB3), lock, credit, settle (WB4), all legs or none (WB5); the one rewatch line; the real architecture C1 on the shared screen | Bed A, the steady tone | **ON: "Islands of Money"** (waiver, see OPEN QUESTIONS) | ~2:55 / ~450 words |
| CH3 | WHO USES IT | The founder (set-up for CLIP-1), GBTD live in the UK (WB6 the remortgage), The Clearing House on the shared screen (WB7 the 25 islands), the receipt trail | Bed A, first remix loop; ducked under CLIP-1 | **ON: "Who Uses It"** | ~2:00 / ~310 words |
| CH4 | THE TOKEN | Supply, launch, ATH, live market cap on the shared screen (C3 / C4); what the token does (WB8); the one caveat line | Bed A, plateau | **ON: "The Token"** | ~1:05 / ~170 words |
| CH5 | QUANT VS THE MARKET | Why ratios (WB9); the three animated charts on the shared screen: share of the total market C5, the peer basket C6, priced in Bitcoin C7 | Bed A, the file's two gentle swells under the C5 and C6 reveals | **ON: "Quant vs The Market"** | ~1:55 / ~280 words |
| CH6 | WHAT'S NEXT | What is coming, each stage in its source's own words (WB10); the news feed receipt | Bed A, plateau | **ON: "What's Next"** | ~0:40 / ~95 words |
| CH7 | THE CLOSE | Mike's read on the shared screen over the finished drawing (WB11); the landing line; the CTA (or hard-out, Mike's call) | Bed A ends: the file's own 10 s fade right-aligned to the last word | OFF (connective close) | ~0:50 / ~135 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, a SCREEN-SHARE beat: Mike's webcam bottom-right, the CTA box top-right, the deck area (x 0 to 1464) showing the content named on the beat's `BODY:` line. ONE sentence (a tight pair allowed), the normal face length; 10 lines in this video, cap 12 |
| 🗣️ `[COVER]` | spoken, VO over a full-frame whiteboard / card / chart / receipt. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (whiteboard scene, card, chart, receipt, the `BODY:` of a screen-share beat). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken |

**Title cards (Convention 2, WAIVED for this video):** a card normally lands ONLY at a chapter that STARTS A NEW music bed. This video runs ONE continuous drone bed, so the rule is waived (PROJECT-LOG, Mike 2026-11-04): title cards are allowed at chapter starts in the Quant look (white card, near-black title, the key word orange), the bed runs through their pauses. Scripted: ON at CH2 to CH6, OFF at CH1 (the screen share is frame one) and CH7 (connective close). Mike rules cards on or off in OPEN QUESTIONS.

**FACE/COVER rules (Convention 3, screen-share mode):** face is gated OFF by default; a 👤 `[FACE]` beat is a screen share with a `BODY:` line, ONE sentence (a tight pair allowed) exactly like every face beat, and the next spoken line after it is tagged explicitly `[COVER]` (usually the same card or chart, full-frame, continuing under the read); every 🗣️ `[COVER]` is a full-frame visual with no face; build to the transcript, omit beats he did not say. No captions anywhere.

**Explainer visuals (Convention 4):** system-design containers, code-rendered, one per talking point, spotlight-swapped; the whiteboard beats draw a MECHANISM or a FLOW as he names each part (a thing draws as he names it, never before). Never tables, never AI images; every on-screen number traces to DATA.md; a real-site capture is used as itself, never redrawn.

**Clip inserts (Convention 6):** CONSIDERED on every video. A clip that plays with its OWN voice while the spine pauses is a 🎞️ `[INSERT]` line between its set-up line (which ENDS the sentence) and the resume line, plus a row in `## CLIP-INSERTS`. Never a muted cover.

**Whiteboard story (the islands):** WB1 to WB11 are one story told across the video: the islands (banks), their fences (walled gardens), the layer above them (Quant), the padlock (lock, credit, settle), the legs that land together, the house (the remortgage), the archipelago (The Clearing House), the two lanes of the token, the pie and the ruler (ratios), the flags on the horizon (what is next), and the islands connected (the close). Each `[SHOW]` WB line names its micro-scenes and the spoken words they hang on.

---

## CH1 - THE OPEN
**Register:** gear 1 on the locked line (Mike, off the cuff, on his shared screen), gear 2 for the definition. Plain, warm, no hype.
**Title card:** OFF. **Music:** Bed A starts at frame 0 (Solstice, the file's 8 s build-in under the first words; see MUSIC-MOOD-PLAN).
**Budget:** ~1:05, ~160 spoken words.

**Beat 1 - the locked opening (a screen-share beat)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **So, what is Quant? This is something that I've been recommended for quite some time. Members of my community have told me about it, people have dropped comments in my live streams about it, and I always said, it seems pretty good, but there are just too many tokens to play. I just want to take a deep dive into this, today.**
🎬 `[SHOW]` BODY: C9, the real quant.network homepage as Mike's shared screen: the hero "The Infrastructure of Programmable Money" and the orange diagram under it, IMG-MOTION 1 (a slow push on the captured still, 4 s, the still as fallback), then a slow scroll of the real page under the rest of the line. Webcam bottom-right, CTA box top-right, as recorded.
💬 `[NOTE]` The locked line is Mike's own words from the brief, touched only for read-aloud commas. "today" is his word in the locked line and stays; every other date in the video is absolute.
💬 `[NOTE]` Mike's call at GATE 1: the body here is the real homepage (scripted) or our own white title card "What is Quant?" with the word Quant in orange.

**Beat 2 - what Quant is, in one line (the screen share continues)**

👤 `[FACE]` Here's the short version. Quant is a London company, founded in 2015 by a guy named Gilbert Verdian, and what they sell is not a new blockchain.
🎬 `[SHOW]` BODY: K1, the deck card "Quant, in one line" (white card, near-black text, the one orange phrase) on the shared screen, its first items landing as he says them: London · 2015 · Gilbert Verdian, Founder and CEO · "not a new blockchain".
🗣️ `[COVER]` It's a software layer that sits on top of the systems a bank already runs, and connects them to the blockchains, and the digital-money networks, out there. Their customers are banks, financial institutions, and capital markets. And by the end of this, you're gonna know who is actually using it, what the token does, and where it sits against the rest of the market.
🎬 `[SHOW]` Full-frame: K1 continues at 1920x1080: "a software layer on top of what a bank already runs" (orange) lands on "software layer", "for banks, financial institutions, capital markets" on "customers"; the card holds under the last sentence.
🔍 `[VERIFY]` 2015 = Companies House incorporation 2015-09-28 (REMITT LTD until 2017-06-02) and Quant's own "since our founding in 2015"; never "founded in 2018". "Founder and CEO" = quant.network/about-us.

**Beat 3 - the handoff**

🗣️ `[COVER]` So, let's walk through all of this.
🎬 `[SHOW]` Full-frame: C23, the quant.network /banks/ page hero (IMG-MOTION 2 candidate, the slow move on the captured still), 3 s under the handoff; then the CH2 title card "Islands of Money" (if cards are ON).
💬 `[NOTE]` Handoff alternates for Mike are listed in OPEN QUESTIONS (the line rotates per persona `dive_in_variants`).

> [!IMPORTANT]
> CH1 verify list:
> - "London company, founded in 2015" = Companies House 09798383, incorporated 2015-09-28; Quant: "since our founding in 2015". Overledger and the token are 2018, the company is not.
> - "not a new blockchain ... a software layer on top of the systems a bank already runs" = Overledger page ("universal API connector ... between traditional financial systems and blockchain networks") and Quant Flow page ("No new network to join. No need to replace your existing infrastructure."), read 2026-11-04.
> - "banks, financial institutions, and capital markets" = the quant.network nav, verbatim.
> - The homepage capture C9 is used as itself (real pixels); the Seedance move is a slow push on the still, 480p, 4 s, never a redraw.

---

## CH2 - ISLANDS OF MONEY
**Register:** gear 2, slow whiteboard pace. One idea per sentence, a breath between sentences so each drawing lands. Mike's analogy voice ("think of", "picture it"), no jargon without its plain handle.
**Title card:** ON, "Islands of Money" (Islands in orange). **Music:** Bed A, the steady tone (file 8 s onward), unspliced through the chapter.
**Budget:** ~2:55, ~450 spoken words. Whiteboard: WB1 to WB5, around 135 s.

**Beat 1 - every bank is an island (WB1)**

🗣️ `[COVER]` Now, to understand why Quant exists, think of every bank as an island. Each island has its own vault, and its own ledger. And the money on one island cannot just walk over to the next one. It goes on a boat, one payment, one leg at a time, and that boat can take days.
🎬 `[SHOW]` WB1 (cover, 1920x1080, paper-quant pen, 25 to 30 s): scene 1 on "island": a coastline and four islands, a small bank building on each; scene 2 on "vault" and "ledger": a vault door and an open ledger book drawn on each island; scene 3 on "boat": a coin loaded onto a little boat, a dotted path across the water to the next island, a clock face ticking beside it. Labels (1 to 4 words, the drawing carries the meaning): "own vault", "own ledger", "one leg at a time" (orange, along the boat path).
💬 `[NOTE]` Whiteboard pace: let "island" land before "vault", let the boat draw before "days".

**Beat 2 - the islands go digital, and build fences (WB2)**

🗣️ `[COVER]` Now the banks are turning those deposits digital. A tokenised deposit is still your deposit, at your bank, same protections, same regulator, it's just recorded differently, and it can carry rules. Move when this happens, release when that happens. Here's the thing though. Right now, most of them only move inside the bank that issued them. Quant's own words for it, walled gardens. Same islands, brand new fences.
🎬 `[SHOW]` WB2 (cover, 25 s): scene 1 on "digital": a paper deposit slip on one island turns into a digital twin on that island's ledger, a small shield beside it; scene 2 on "rules": an orange tag hung on the token, "move when...", "release when..."; scene 3 on "fences": a fence drawn around each island, label "walled garden" in orange.
🔍 `[VERIFY]` The tokenised-deposit definition = The Clearing House release 2026-09-24 ("retain the protections and regulatory oversight of a traditional deposit, but are recorded and moved differently ... move automatically within rules institutions set in advance"); "walled gardens" = Quant's TCH post 2026-09-24, verbatim.

**Beat 3 - Quant is not another island (WB3)**

🗣️ `[COVER]` So the obvious move would be to build one more island, one big chain, and tell every bank, come settle over here. That is exactly what Quant did not do. Quant is the layer that sits above the islands. The bank keeps its core systems, keeps its payment rails, keeps custody of the money. Quant connects all of that through one set of APIs, and orchestrates the movement. And it never holds the funds.
🎬 `[SHOW]` WB3 (cover, 25 to 30 s): scene 1 on "one more island": a fifth island sketched, then struck through in orange; scene 2 on "layer that sits above": an orange band drawn in the sky over all four islands, label "Quant"; scene 3 on "keeps": the bank buildings, vaults and rails stay as drawn, orange threads drop from the band to each vault; scene 4 on "never holds": a small coin inside the band crossed out, label "never holds funds".
🎬 `[SHOW]` Then C10, the Quant Flow page capture, the sentence "No new network to join. No need to replace your existing infrastructure." highlighted, 3 s, real pixels (IMG-MOTION 3 candidate on the page's art).
🔍 `[VERIFY]` "orchestrates movement without ever holding funds" and "without replacing a single system they already trust" = the QuantNet launch post 2025-09-29; "No new network to join" = Quant Flow page.

**Beat 4 - lock, credit, settle (WB4)**

🗣️ `[COVER]` Now, what does that look like for one payment. Quant's own example, a manufacturer in London paying a supplier in Singapore. Step one, lock. The London bank locks the manufacturer's money the moment it accepts the instruction. Step two, credit. The Singapore bank credits the supplier right away, against that lock. Step three, settle. The two banks settle with each other in the next window, and the lock is released. No new asset, and the money never left the banking system, it was a deposit at a regulated bank the whole way.
🎬 `[SHOW]` WB4 (cover, 30 s): two islands labelled "London" and "Singapore"; scene 1 on "lock": a padlock clicks shut on a coin stack in the London vault; scene 2 on "credit": an orange arrow across the water, a check mark at the supplier on Singapore; scene 3 on "settle": a clock face, a two-way arrow between the two vaults, the padlock opens; scene 4 on "regulated bank": a small shield on both vaults. Labels "LOCK", "CREDIT", "SETTLE" in orange, one per step, drawn on the word.
🔍 `[VERIFY]` The worked example, verbatim steps = quant.network/perspectives "Programmable cross-border payments" (Alex Chiriac, 2026-10-27): "No new asset is introduced, and nothing leaves the banking system. At every step, the money is a deposit at a regulated bank."

**Beat 5 - all legs, or none (WB5)**

🗣️ `[COVER]` And the second trick is synchronised settlement. The old way settles each leg of a deal on its own, so one leg clears, the other one hasn't yet, and for a moment the whole deal sits in limbo. With this layer, every bank involved reserves its funds first, and then every leg commits together, or none of them do.
🎬 `[SHOW]` WB5 (cover, 25 s): scene 1 on "each leg on its own": three arrows between three islands, the first lands with a check mark, the second hangs mid-water with a dashed tail, label "limbo" in orange; scene 2 on "reserves": a padlock on each of the three vaults; scene 3 on "together": all three arrows land at once, three check marks, label "all or none".
🔍 `[VERIFY]` "one leg clears, the other hasn't, and there's a window where the transaction sits in limbo" and "prepare-and-commit" = quant.network/perspectives, the Synchronisation Lab treasury piece (Alex Chiriac, 2026-07-30); "all legs committed together or not at all" = the Synchronisation Lab release 2026-02-13.
🗣️ `[COVER]` If that was a bit complex, feel free to double tap the left side of the video if you are on your phone to go back and watch that again.
💬 `[NOTE]` The one rewatch line in the video (phone wording; rotate next video). It points back at Beats 4 and 5 (lock, credit, settle and all or none); WB5's finished drawing stays on screen while he says it.

**Beat 6 - the real architecture (a screen-share beat)**

👤 `[FACE]` Now, here's the real thing, with the real names.
🎬 `[SHOW]` BODY: C1, THE system-design diagram (code-built, light theme, orange wires) at 1464x1080 on the shared screen, the whole diagram drawn in, no spotlight yet.
🗣️ `[COVER]` On the left, what a bank already runs, core banking, treasury, the payment rails. In the middle, Quant. Overledger is the API connector. Quant Flow is where the bank writes the rules, in their own payments language, PayScript. QuantNet is the orchestration layer, coordinating the islands. And Quant Fusion is their rollup, live on mainnet since June 2nd, 2026, connected to 74 networks. And on the right, the ledgers, and the tokenised deposit platforms.
🎬 `[SHOW]` Full-frame: C1 at 1920x1080: left column the bank's existing stack (core banking · treasury / ERP · RTGS, Faster Payments, RTP, CHIPS rails); middle the Quant layer (Overledger API connector · Quant Flow + PayScript · QuantNet orchestration · Fusion rollup); right column public and permissioned ledgers + tokenised-deposit platforms. Each node spotlights on its name; the three small labels "No new network to join", "never holds funds", "lock, credit, settle" appear last, after "platforms".
🎬 `[SHOW]` On "Quant Fusion": C11, the Quant Fusion page art ("Layer 2.5"), 2 s inset on the Fusion node, real pixels (IMG-MOTION 4 candidate).
🔍 `[VERIFY]` Fusion "live on mainnet ... connected to 74 networks" = Quant news 2026-06-02; PayScript "a powerful but simple-to-use scripting language for payments" = quant.network/capital-markets; QuantNet "a unified orchestration layer" = the launch post 2025-09-29; Overledger "universal API connector" = the Overledger page.

> [!IMPORTANT]
> CH2 verify list:
> - Every mechanism line is Quant's own description, re-told: walled gardens (TCH post 2026-09-24), lock / credit / settle (Chiriac 2026-10-27), limbo and prepare-and-commit (Chiriac 2026-07-30), all legs or none (Synchronisation Lab release 2026-02-13), never holds funds (QuantNet post 2025-09-29).
> - The QuantNet post's list of rails and venues (Lloyds wallet, JPM Coin, HSBC Orion, Euroclear, RTGS, CREST, T2S) is Quant's ILLUSTRATION of what the layer can connect, never a client list: C1 names RAIL TYPES (RTGS, Faster Payments, RTP, CHIPS), not those venues.
> - "74 networks" and "June 2nd, 2026" = the Fusion mainnet post; the Fusion Rollup IS a chain-like execution environment ("Layer 2.5"), which is why the spoken line calls it "their rollup", never "their chain".
> - The rewatch line is the only one in the video (cap one per 5 minutes, zero to two per video).

---

## CH3 - WHO USES IT
**Register:** gear 2, the receipts chapter; gear 1 on the two screen-share reactions ("look right here"). Pilot stays pilot, partnership stays partnership, a test is called a test.
**Title card:** ON, "Who Uses It" (Uses in orange). **Music:** Bed A, the first bar-aligned remix loop inside the steady tone; ducked to the clip floor under CLIP-1.
**Budget:** ~2:00 (plus 10.8 s of CLIP-1), ~310 spoken words. Whiteboard: WB6, WB7, around 50 s.

**Beat 1 - the founder, in his own words (set-up for CLIP-1; a screen-share beat)**

👤 `[FACE]` Now, who's actually using this. Start with the founder.
🎬 `[SHOW]` BODY: C20, the Gilbert Verdian people page on quant.network on the shared screen, the headshot and the name and title. Real pixels.
🗣️ `[COVER]` Gilbert Verdian is a cybersecurity guy, more than 20 years of it, and he's been a security chief at that level. He's worked inside the UK government, at Downing Street and the Treasury, and inside the big financial names, Mastercard and HSBC. And back in 2016, Quant says, he helped set up the ISO committee that writes the blockchain standards. In October of 2026 he sat on a panel in London, and this is how he described what Quant does.
🎬 `[SHOW]` Full-frame: C20, the bio paragraph, a slow scroll: "more than 20 years of cybersecurity experience" highlighted on "20 years", the government list on "Downing Street", the private-sector list on "Mastercard", the TC307 sentence on "ISO". Real pixels.
🎞️ `[INSERT]` CLIP-1: Gilbert Verdian, 10.8 s with his own voice, the spine pauses after "...described what Quant does."; burned caption "Gilbert Verdian, Founder and CEO of Quant · Innovate Finance panel, London, October 2026". Transition in and out, bed ducked.
🔍 `[VERIFY]` CLIP-1 window = youtube.com/watch?v=fHy9aL1Do3s 14:21.2 to 14:32.0 (Innovate Finance channel, uploaded 2026-10-22); capture `--expect "financial infrastructure that banks use globally"`. NEVER extend past 14:32: the next sentences are his own "whole US payment system" framing (WARNING box). Confirm the panel's month for the burned caption.
💬 `[NOTE]` The ISO line is Quant's claim, attributed ("Quant says"), never "he runs the ISO interoperability group". Mastercard is named ONLY as his former employer here; it is never a partner.

**Beat 2 - the UK, live (the resume line; WB6)**

🗣️ `[COVER]` GBTD. That's the Great British Tokenised Deposit platform, run by UK Finance, and Quant built the infrastructure for it. Seven banks are on it, Barclays, HSBC, Lloyds, Monzo, Nationwide, NatWest and Santander. And in September of 2026 it did its first live customer transactions. Two of them were remortgages.
🎬 `[SHOW]` C14, the UK Finance GBTD page: the seven bank names, then the "first live customer transactions" paragraph highlighted (two remortgage completions, one consumer marketplace payment). Real pixels.
🗣️ `[COVER]` Picture it. Your deposit gets locked the day you sign, keeps earning interest the whole time, and on completion day it releases itself to the other side. That's the padlock from the whiteboard, on real money.
🎬 `[SHOW]` WB6 (cover, 25 s): scene 1 on "locked": a house outline, a coin stack with a padlock, a calendar page; scene 2 on "earning interest": small orange coins dropping into the locked stack, a clock; scene 3 on "completion day": the calendar flips, the padlock opens, an orange arrow carries the stack to a second figure with a check mark. Labels "locked", "still earning", "completion".
🔍 `[VERIFY]` "Two remortgage completions, where deposit funds were locked and released automatically at completion. Customers could also keep earning interest until completion." = UK Finance GBTD page; Monzo joined as the seventh bank in January 2026 (same page). "September of 2026" = Quant's Sibos post ("Days earlier, UK Finance announced...", 2026-10-08) + the GBTD page.

**Beat 3 - the US (a screen-share beat; WB7)**

🗣️ `[COVER]` And then the big one. The Clearing House. The US payments company owned by 25 of the largest US banks, it runs RTP and CHIPS, and clears more than 2 trillion dollars a day.
🎬 `[SHOW]` Full-frame: C12, The Clearing House release, the headline. Real pixels.
👤 `[FACE]` On September 24th, 2026, after a competitive process, they picked Quant to build their new tokenised deposit network, look right here, the interoperability, orchestration and transaction-management layer.
🎬 `[SHOW]` BODY: C12 on the shared screen, the paragraph "Quant's technology will enable the network's interoperability, orchestration, and transaction-management layer ... including the RTP® and CHIPS® networks" highlighted on "look right here". Real pixels.
🗣️ `[COVER]` Expected to open to the banks in the first half of 2027.
🎬 `[SHOW]` Full-frame: C12, "first half of 2027" highlighted.
🔍 `[VERIFY]` "owned by 25 of the nation's largest financial institutions", "more than 2 trillion dollars each day", "expected to become available to participating institutions in the first half of 2027" = TCH releases 2026-09-24 and 2026-06-05; "Following a competitive process" = Quant's TCH post. The 2 trillion runs on TCH's EXISTING rails, never "on Quant".
🗣️ `[COVER]` Picture the 25 islands, each with its own digital deposits, and one shared network between them, connected to the rails those banks already use.
🎬 `[SHOW]` WB7 (cover, 25 s): scene 1 on "25 islands": a dense archipelago of small islands, vault doors on a few; scene 2 on "shared network": the orange band from WB3 drawn over the whole group, label "one network"; scene 3 on "rails those banks already use": two roads on the mainland labelled "RTP" and "CHIPS" feeding into the band; a small flag "H1 2027".

**Beat 4 - the trail of receipts**

🗣️ `[COVER]` And around those two, a trail of receipts. Technology vendor on Project Rosalind, with the Bank of England and the BIS, in 2023. One of 18 operators in the Bank of England's Synchronisation Lab in 2026, and that one is a test, no real money moves there. A pioneer on the European Central Bank's digital euro platform in 2025. Murex in March of 2026, Dentsu Soken in Japan in January of 2026.
🎬 `[SHOW]` Receipts, one per name, 3 to 4 s each, real pixels: the BIS Rosalind page header (Concluded, 2023-06-16); C13 the Bank of England Synchronisation Lab page (the operators table with the Quant row, then the line "The Lab is not a regulatory sandbox and will not support real-money payments"); C15 the ECB annex row "Quant Network Europe Limited (P)"; C16 the Murex release headline; the Dentsu Soken press release headline (quant.network, 2026-01-14).
💬 `[NOTE]` Trim-first if CH3 runs long: the Dentsu Soken sentence.
💬 `[NOTE]` Say "European Central Bank", never "European Commission". No Oracle 2025 line (secondary-only; OPEN QUESTIONS). No Mastercard partnership.

> [!IMPORTANT]
> CH3 verify list:
> - Verdian's career = his quant.network bio, verbatim list (Downing Street, HM Treasury, Cabinet Office, Ministry of Justice, NSW Health; Mastercard, Vocalink, CSC, EY, PwC, BP, HSBC); "more than 20 years of cybersecurity experience". The ISO line = Quant's 2026 wording ("In 2016, we helped establish ... ISO TC307"), attributed.
> - GBTD: UK Finance selected Quant 2025-09-26; seven banks incl. Monzo (2026-01); first live transactions (two remortgages, one marketplace payment) per the GBTD page, announced September 2026.
> - TCH: 2026-09-24 release; 25 owners; RTP and CHIPS; "first half of 2027". A pilot is a pilot; TCH's network is "expected", not live.
> - Rosalind: Quant "as part of the vendor team", BIS lists the project Concluded, report 2023-06-16. Synchronisation Lab: 18 operators, "not a regulatory sandbox and will not support real-money payments", "spring 2026", "around six months". ECB: "Quant Network Europe Limited (P)" in the 2025-05-05 annex. Murex 2026-03-25; Dentsu Soken 2026-01-14.
> - CLIP-1 caption and window per DATA.md section 6; Mike rules the clip in or out at GATE 1.

---

## CH4 - THE TOKEN
**Register:** gear 2, plain; gear 1 on the live numbers ("at the time of this recording"). The caveat is ONE line inside Beat 2, never a section.
**Title card:** ON, "The Token" (Token in orange). **Music:** Bed A, the plateau on the running loop.
**Budget:** ~1:05, ~170 spoken words. Whiteboard: WB8, around 25 to 30 s.

**Beat 1 - the supply and the market (the live numbers on a screen-share sentence)**

🗣️ `[COVER]` Now, the token. QNT lives on Ethereum, and the supply is fixed, around 14.6 million tokens, almost all of it already circulating. That's all there will ever be. It sold to the public in 2018, and the all-time high was around 427 dollars in September of 2021.
🎬 `[SHOW]` Full-frame: C3, the tokenomics card (animated count-up, light theme): total = max 14,612,493 · circulating 14,556,178 · "sold to the public in 2018" · ATH 427.42 on 2021-09-11 · source and read timestamp small.
👤 `[FACE]` And at the time of this recording it's trading around 199 dollars, for a market cap of around 2.9 billion dollars, which puts it around rank 34.
🎬 `[SHOW]` BODY: C4, the market-cap card on the shared screen (1464x1080): price, cap, rank, FDV, 24 h volume, 1-year change, with the read timestamp.
🔍 `[VERIFY]` Live-drift, re-pull at record time and re-say: price (199.08, CoinGecko 2026-11-04 12:08 UTC), cap (2.90B), rank (#34 CoinGecko, #37 CMC), circulating (14,556,178 Etherscan + CoinGecko). Supply = CoinGecko + Etherscan, never CMC's 14.9M, never the contract's 45.5M. ATH 427.42 (CoinGecko) / 428.38 (CMC), 2021-09-11.
💬 `[NOTE]` "sold to the public in 2018" is the airable form; no sale price, no raise figure, no burn date (WARNING box).

**Beat 2 - what the token does (WB8)**

🗣️ `[COVER]` So what does the token actually do. The documented use is simple. If you want to use Overledger on mainnet, you pay a licence fee, and since December of 2021 that fee is payable in QNT. The payment goes through a treasury contract, to Quant. No governance rights, a utility token, pure and simple. Here's the thing. The bank deals, The Clearing House, GBTD, those are software and service contracts, and nothing published says how much of that, if any, flows through QNT. So the open question for the token is whether that second pipe ever gets built.
🎬 `[SHOW]` WB8 (cover, 25 to 30 s): lane 1 on "licence fee": a developer figure at a laptop, a paper "licence" slip, on "payable in QNT" an orange arrow into an orange QNT coin, on "treasury contract" a box labelled "treasury contract", an arrow up into the Quant band; lane 2 on "bank deals": a bank building, a contract document labelled "software + service", an arrow into the Quant band, and on "nothing published" an orange question-mark tag on that arrow, label "QNT share: not disclosed".
🎬 `[SHOW]` Then C21, the Overledger 2.1.5 release crop, "annual licence fee (£100). This can now be paid in QNT, using Metamask.", 3 s, real pixels.
🔍 `[VERIFY]` Licence fee payable in QNT = Quant release 2021-12-15; "QNT carries no governance rights" and "The community treasury smart contract handles QNT payments" = the Blockworks token-transparency filing (compiled from public information, filed 2026-07-28); the "not disclosed" lane is mandatory (T7: the full TCH and UK Finance texts carry no "QNT").
💬 `[NOTE]` Never "licence QNT is locked 12 months", never staking. The distribution figures (9.9M public, 2.6M reserve, 1.3M founders, 0.651M advisors, Quant's business paper as compiled by Blockworks) are Mike's call at GATE 1: on the C3 card with that attribution, or left off; they are not spoken.

> [!IMPORTANT]
> CH4 verify list:
> - Supply: 14,612,493 total = max (CoinGecko; Quant's figure in the Blockworks filing), 14,556,178 circulating (Etherscan + CoinGecko). ERC-20 on Ethereum, contract 0x4a220e6096b25eadb88358cb44068a3248254675.
> - "sold to the public in 2018": CoinGecko genesis 2018-06-25; CMC first price 2018-08-10. No sale price, no raise.
> - ATH 427.42 dollars 2021-09-11 (CoinGecko). Price, cap, rank: live, re-pulled at record time.
> - The licence fee (100 pounds a year, payable in QNT since 2021-12-15) is the only utility with a primary source; the bank contracts do not name QNT.

---

## CH5 - QUANT VS THE MARKET
**Register:** gear 2 for the set-up, gear 1 on the three screen-share reads ("look at this", "right here"). Calm reading of what each line says, no prediction, no target.
**Title card:** ON, "Quant vs The Market" (Market in orange). **Music:** Bed A, the file's two gentle swells carved under the C5 and C6 reveals.
**Budget:** ~1:55, ~280 spoken words. Whiteboard: WB9, around 20 s.

**Beat 1 - why ratios (WB9)**

🗣️ `[COVER]` Now, price alone tells you very little, so I want to look at Quant the way the pros do, as ratios. First, Quant's slice of the entire crypto pie. Second, Quant against the tokens it usually gets compared with. And third, Quant priced in Bitcoin, because Bitcoin is the ruler everything else gets measured against.
🎬 `[SHOW]` WB9 (cover, 20 s): scene 1 on "slice of the entire crypto pie": a large circle labelled "all of crypto", a thin orange slice labelled "Quant"; scene 2 on "compared with": five small coins in a row, one of them orange; scene 3 on "ruler": a Bitcoin coin drawn as a ruler, the orange coin measured against it. Labels "share", "peers", "in BTC".
💬 `[NOTE]` Trim-first if CH5 runs long: this beat (the charts carry the point on their own).

**Beat 2 - the share of the whole market (a screen-share beat, C5)**

👤 `[FACE]` Look at this. This is Quant's market cap as a share of the whole crypto market, going back to 2018.
🎬 `[SHOW]` BODY: C5 (animated line, light theme, orange line, 2018-10-01 to 2026-11-04, "Source: CoinMarketCap" small on the card, axes labelled) at 1464x1080 on the shared screen: the line draws left to right under the sentence.
🗣️ `[COVER]` The all-time peak of that share was October of 2022, 0.269 percent, right in the middle of the bear market. Then it bled for three years, down to a band around 0.03 to 0.04 percent. And then September of 2026, the Clearing House news, and the share goes from 0.028 to around 0.09 percent in 10 weeks, more than 3x. And it's still only a third of where it was in 2022.
🎬 `[SHOW]` Full-frame: C5 at 1920x1080, the drawn line: a marker on 2022-10-18 "0.269%" lands on "peak"; the 2024 to 2026 band shaded faintly on "bled"; the 2026 run and its endpoint label land on "September".
🔍 `[VERIFY]` Endpoints and vendor: CMC series (QNT cap / total cap, pulled 2026-11-04 12:15 UTC): peak 0.269% 2022-10-18; 0.028% (2026-08-28) to 0.092% (2026-11-04). Re-pull the last point at record time. Vendor = Mike's call (DATA.md Open question 1): on CoinGecko's basis the latest point reads 0.110%; the shape is identical. Never the TradingView 0.155% intraday reading.

**Beat 3 - against the peers (a screen-share beat, C6)**

👤 `[FACE]` Now, against the peers. Chainlink, Hedera, XRP, Stellar and Canton, everything indexed to 100 on November 5th, 2025, Bitcoin in grey.
🎬 `[SHOW]` BODY: C6 (animated multi-line, QNT in orange, the five peers in warm greys, BTC dashed grey, indexed to 100 at 2025-11-05, "Source: CoinGecko" small, axes labelled) at 1464x1080 on the shared screen: the legend lands name by name, the lines draw together through August 2026 under the sentence.
🗣️ `[COVER]` For 10 months Quant did nothing special, a brief pop to 140 in December of 2025, then a slow drift down to 82 by the end of August 2026, while the peers fell 40 to 60 percent. And then one line leaves the group. A year later Quant sits at 273, and every other line on this chart is below 100.
🎬 `[SHOW]` Full-frame: C6 at 1920x1080: the orange line breaks away on "leaves the group"; the endpoint labels 273 / LINK 76 / HBAR 42 / XRP 58 / XLM 60 / CC 73 / BTC 77 land on "below 100".
🔍 `[VERIFY]` Basket = Mike's pick at GATE 1 (LINK, HBAR, XRP, XLM, CC; Canton indexed from its first CoinGecko day 2025-11-10); the month-end index table is DATA.md Pillar 5(b); endpoints re-pulled at record time. Market data only, no partnership claim about any peer (Chainlink shares the Bank of England operators table with Quant; that is the only tie and it is not spoken).

**Beat 4 - priced in Bitcoin (a screen-share beat, C7)**

👤 `[FACE]` And in Bitcoin terms. On November 5th, 2025, one QNT bought you around 72,000 sats, and on November 4th, 2026, around 254,000 sats.
🎬 `[SHOW]` BODY: C7 state 1 (animated line, orange) at 1464x1080 on the shared screen: the 1-year daily QNT/BTC, 0.000717 to 0.002542 BTC, drawing under the sentence, the y axis in BTC with the sats value beside each labelled point; "Source: CoinGecko / CoinMarketCap" small.
🗣️ `[COVER]` That's around 3.5x against Bitcoin in a year, while Bitcoin itself is down around 23 percent in dollars. Zoom out though, and the all-time high in Bitcoin terms was October of 2022, at around 1.17 million sats, so even after this run, Quant sits at around 22 percent of its best ever level against Bitcoin.
🎬 `[SHOW]` Full-frame: C7 at 1920x1080: state 1 holds with the 2026-10-01 peak 0.003438 marked under "3.5x"; state 2, the long-run pane 2018 to 2026 (CMC price-in-BTC) with the 2022-10-16 ATH 0.01167 BTC (CoinGecko) marked, lands on "Zoom out".
🔍 `[VERIFY]` All live-drift: 0.00071745 BTC (2025-11-05) = 71,745 sats; 0.00254198 BTC (2026-11-04) = 254,198 sats; ratio 3.54x; ATH 0.01166603 BTC (2022-10-16) = 1,166,603 sats; today around 22% of it; BTC 12-month change -23.0% at read time. Re-pull and re-say with both dates.
💬 `[NOTE]` The sats wording is the read-aloud form of the BTC decimals (1 sat = 0.00000001 BTC); the card shows both units so the viewer sees the decimal the spoken sats stand for.

> [!IMPORTANT]
> CH5 verify list:
> - C5: CMC numerator and denominator (one vendor), 689 points 2018-10-01 to 2026-11-04; the 2026 run 0.028% to 0.092% (around 3.3x in ten weeks); peak share 0.269% on 2022-10-18. The spoken "around 0.09 percent" and "more than 3x" are deliberately rounded.
> - C6: 12-month USD change to 2026-11-04: QNT +172.9%, BTC -23.0%, LINK -24.3%, HBAR -58.0%, XRP -41.9%, XLM -39.6%, Canton -27.3% (from 2025-11-10); index 82 to 99 for QNT from 2025-12 to 2026-08.
> - C7: 1-year QNT/BTC 3.54x (2025-11-05 to 2026-11-04), peak 0.003438 BTC on 2026-10-01; ATH in BTC 0.01166603 on 2022-10-16; today's level around 22% of it.
> - No price target, no "if it were as big as X" arithmetic, anywhere.

---

## CH6 - WHAT'S NEXT
**Register:** gear 2, each stage in its source's own words; a forecast is attributed as a forecast.
**Title card:** ON, "What's Next" (Next in orange). **Music:** Bed A, the plateau, a bar-aligned jump back inside the tone.
**Budget:** ~0:40, ~95 spoken words. Whiteboard: WB10, around 25 to 30 s.

**Beat 1 - the flags on the horizon (WB10)**

🗣️ `[COVER]` Now, what's next, and I'll use each source's own words for where it stands. In the UK, UK Finance says more pilots are coming, and the banks plan to issue digital debt instruments, basically bonds, with the coupons paid in tokenised deposits. In the US, the Clearing House is building the network now, and Gilbert Verdian said on that same panel it goes live early 2027. His words, his forecast. And the rest of their feed in late 2026, Sibos in Miami, the cross-border payments piece, is this same story, told from a stage.
🎬 `[SHOW]` WB10 (cover, 25 to 30 s): three flags on the horizon beyond the islands; scene 1 on "digital debt instruments": a bond certificate with coupon stubs, on "coupons" orange coins drop off the stubs into a vault, label "coupons in tokenised deposits"; scene 2 on "building the network": the harbour gate on the WB7 archipelago, half open, flag "2027"; scene 3 on "told from a stage": a small stage with a lectern and the orange band above it. Labels "UK", "US", "Sibos 2026".
🎬 `[SHOW]` Then C17, the quant.network news feed scroll capture (the dated 2026 posts: 2026-10-27, 2026-10-22, 2026-10-15, 2026-10-08, 2026-09-24), 4 s, real pixels; C24, the /use-cases/ isometric illustration, 2 s (IMG-MOTION 5 candidate).
🔍 `[VERIFY]` "Further pilots are expected" and "plan to issue digital debt instruments ... with coupons paid in tokenised deposits" = UK Finance GBTD page (undated); TCH network "first half of 2027" = TCH; Verdian "going live also early next year" (said 2026-10, so early 2027) = the Innovate Finance panel audio, DATA.md section 6; Sibos Miami = Quant's events post 2026-10-08.
💬 `[NOTE]` No day-relative words: UK Finance's "over the next few months" is paraphrased as "more pilots are coming" because the upload date is unknown. The Bank of England lab is not repeated here (said once in CH3).

> [!IMPORTANT]
> CH6 verify list:
> - UK Finance GBTD page (read 2026-11-04): "Further pilots are expected over the next few months" and the digital debt instruments line; re-read at record time in case a pilot has landed.
> - Verdian's "early next year" is his forecast, attributed; TCH's own words are "first half of 2027" (already said in CH3, not repeated).
> - News feed dates per DATA.md Pillar 6.

---

## CH7 - THE CLOSE
**Register:** gear 3 for the landing line (declarative, no hedge, no "right?"), then the persona CTA warm and loose. All upside conditional ("can", never "will").
**Title card:** OFF. **Music:** Bed A ends: the file's own 10 s fade-out RIGHT-ALIGNED so the tone dies on the last word.
**Budget:** ~0:50, ~135 spoken words. Whiteboard: WB11, around 20 to 25 s (the BODY of the screen share).

**Beat 1 - Mike's read (WB11; the landing line is the screen-share sentence, over the finished drawing)**

🗣️ `[COVER]` So, here's my read, after all of that. Quant is not a coin trying to become the banks' new blockchain. It's the layer the banks are actually letting into the building, live in the UK, with a date in the US. Can the token re-rate again if that US network opens on time? It can. Nobody can promise you that, and I won't.
🎬 `[SHOW]` WB11 (cover, 1920x1080, paper-quant pen, 20 to 25 s): the four islands from WB1 redrawn on "my read"; a fifth island struck through again on "not a coin"; the orange Quant band over the islands on "letting into the building"; two small flags "UK" (a check mark) and "US" ("H1 2027") on "live in the UK, with a date in the US"; nothing new draws under the two conditional sentences.
👤 `[FACE]` But every one of those banks is still an island, and right now, Quant is the one holding the contracts to connect them.
🎬 `[SHOW]` BODY: WB11 continues in the deck area of the shared screen (the same clip, scaled into the deck area, islands and band already drawn): orange threads drop from the band to each vault on "connect", small padlocks and check marks move along the threads on "contracts". The finished drawing holds under the CTA.
💬 `[NOTE]` The landing line is the story's payoff (the islands, connected); it is concrete (the contracts are the TCH and GBTD receipts), not an aphorism. The upside is conditional and stays that way on the take.

**Beat 2 - the CTA**

🗣️ `[COVER]` If this helped, click that like button and click the subscribe button, and comment below, which token should I deep dive next. And click the link in the description to get involved in the best community ever. I'm gonna catch you guys, later.
🎬 `[SHOW]` Full-frame end card in the Quant look: white, the orange word "Quant", the community link lower-third. The Solstice fade-out (the file's last 10 s) right-aligned so the tone dies on "later."
💬 `[NOTE]` HARD-OUT alternative (Mike's call, OPEN QUESTIONS): the take ends on "...to connect them." and the edit cuts to black on that word with the fade landing there; no CTA, no end card.

> [!IMPORTANT]
> CH7 verify list:
> - "live in the UK" = GBTD first live customer transactions (UK Finance, September 2026); "a date in the US" = TCH "first half of 2027".
> - "Can the token re-rate again" is conditional and unquantified; no target, no multiplier, no timing promise.
> - Persona CTA wording: "click that like button and click the subscribe button" (never "smash"), comments asked for, "click the link in the description to get involved in the best community ever", sign-off "I'm gonna catch you guys, later."

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover. Mike rules each row at GATE 1. DATA.md section 6 found three windows of Gilbert Verdian on camera; one earns its seconds, one is held for a cleaner source, one is written off._

| id | Who / what plays (verbatim words) | Source + timecodes | Length | Lands (chapter / beat, after which set-up line) | Burned caption | Status |
|---|---|---|---|---|---|---|
| CLIP-1 | Gilbert Verdian, Founder and CEO of Quant: "So Quant, we build and run the financial infrastructure that banks use globally. Our focus is tokenized deposits. We've been doing it in the UK with GBTD." | https://www.youtube.com/watch?v=fHy9aL1Do3s 14:21.2-14:32.0 (Innovate Finance channel, uploaded 2026-10-22); capture `--expect "financial infrastructure that banks use globally"` | 10.8 s | CH3 Beat 1, after "...and this is how he described what Quant does." The resume line is Mike's "GBTD. That's the Great British Tokenised Deposit platform..." | Gilbert Verdian, Founder and CEO of Quant · Innovate Finance panel, London, October 2026 | PROPOSED |
| CLIP-2 | Gilbert Verdian, same panel: "So the criticality of the system is even more heightened now because we're moving to 24 seven. Tokenized money doesn't sleep. It's always running. It's global. It's no longer within the one jurisdiction." | https://www.youtube.com/watch?v=fHy9aL1Do3s 15:29.6-15:42.5 | 12.9 s | not placed | n/a | REJECTED: in context the line is about operational RISK (he has just said "if something goes wrong, economies stop" and cited Northern Rock); cut to 13 s under a bullish chapter it would read as a hype line and misrepresent him, and carrying the full risk framing would cost 30 s the runtime does not have |
| CLIP-3 | Gilbert Verdian at an Oracle AI World Tour session: "people were building and designing blockchain and DLT without standardization. Everyone was building things in isolation. Everyone was creating another chain that does the same thing as every other chain. And the problem that I saw very early on was around 2013 ... we're building things that can't connect or interoperate with each other." | https://www.youtube.com/watch?v=-YRMB5UeC1Y 0:33.8-0:55.4 (third-party re-upload, channel Fighting_Crypto, 2026-03-20); capture `--expect "another chain that does the same thing as every other chain"` | 21.6 s | would land at CH2 Beat 1, before WB1, if an OFFICIAL Oracle recording of the session is found (the set-up line would end "...here is how Gilbert Verdian describes the problem he saw.") | Gilbert Verdian, Oracle AI World Tour session, 2026 | HELD: the only source is a crypto YouTuber's re-upload with his own voice around it and no on-screen date or venue; the receipt-capturer looks for Oracle's own recording first; without it the origin story stays Mike's whiteboard |

## MUSIC-MOOD-PLAN

_ONE drone track for the whole video (Mike): `solstice`, DeHartmann, Soundstripe 14703, YouTube licence code PIMM1ZEYZYLHCITE, `assets/music/Solstice/DeHartmann_Solstice_instrumental_4_17.mp3`, 4:17, 72 BPM (one bar = 3.33 s), Ab major, aggression 26. Catalog analysis: an 8 s build-in (file 0:00 to 0:08), one flat continuous tone from 0:08 to 4:08 (env a steady 7 with two gentle 8s around 1:58 and 2:08), a 10 s fade-out 4:08 to 4:17 (ending `fade`). Usage ledger 2026-11-04: `fresh`; BLOCKED (kitsune, lightheart) and the last three (atmos-rise, deliverance, get-it) do not apply. Section cuts in the catalog: a 60 s chorus cut (ends `fade`) and a 30 s verse cut (ends `epic_hit`, NOT used: this video never hits). ONE bed, frame 0 to the last frame, ducked under the VO (and to the clip floor under CLIP-1), extended over around 10 minutes by bar-aligned remix loops inside the steady tone (`skills/music/music.md` section ONE TRACK, CARVED). A new BED would be a new TRACK; nothing here is one. Title cards are allowed under the one-bed waiver; the bed runs through their pauses._

| Chapter | Mood + gear | Subtle / aggressive | Bed / carve (which section of the file plays, how it is extended or right-aligned) | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 THE OPEN (0:00-1:05) | calm, reflective, gear 1 into gear 2 | subtle; the bed never leads, it opens the room | **Bed A starts at frame 0 (the only bed in the video)**: Solstice from its first sample, the file's 8 s build-in rising under "So, what is Quant?" and reaching the steady tone (file 0:08 onward) before "deep dive"; the tone runs unspliced under the definition and the handoff | solstice (Mike's pick; fallbacks ONLY if he re-rules: what-we-must, sacral-i-feel-417-hz, constant-741-hz-meditation, all `fresh` drones) |
| CH2 ISLANDS OF MONEY (1:05-4:00) | slow whiteboard explainer, gear 2 | subtle, steady, loop-safe | Bed A, the steady tone continued from the file's own run (file around 1:05 to 4:00, no splice yet); the file's first gentle swell (around 1:58) may fall under WB4's "lock", the placement strategist decides whether to let it or to loop earlier; the first bar-aligned REMIX LOOP (a jump back inside the tone, 8 bars) lands before the file's 4:08 fade would begin, ideally in the breath before the C1 beat | solstice |
| CH3 WHO USES IT (4:00-6:10) | receipts, gear 2 with gear 1 reactions | subtle; DUCKED to the clip-insert floor under CLIP-1 (10.8 s), recovers on the resume line | Bed A, the steady tone on its first remix loop (jump back to a bar line inside the plateau, e.g. the file 1:00 region, so the tone runs on without a seam); the duck window comes from the comp's clip insert (`bed-duck-expr.py`), never hand-typed | solstice |
| CH4 THE TOKEN (6:10-7:15) | plain explainer, gear 2 | subtle | Bed A, the plateau continues on the running loop; a second bar-aligned jump back as needed, placed in the breath before Beat 2 | solstice |
| CH5 QUANT VS THE MARKET (7:15-9:10) | the chapter with the most lift, gear 1 reads | subtle still (this file never gets aggressive), the two gentle swells placed under the reveals | Bed A: carve the file's two slightly brighter windows (around 1:58 and 2:08 in the file, env 8 against the plateau's 7) to sit under "Look at this" (the C5 reveal) and "one line leaves the group" (the C6 breakaway); the strategist measures the windows per bar and pins the first, the second quantizes to the grid | solstice |
| CH6 WHAT'S NEXT (9:10-9:50) | forward-looking, gear 2 | subtle | Bed A, the plateau, a bar-aligned jump back inside the tone; the loop is chosen so the file's last plateau bars (around 3:50 to 4:08, env 6 to 5) arrive at the start of CH7 | solstice |
| CH7 THE CLOSE (9:50-10:40) | the gear 3 landing, calm conviction | subtle; the only ending in the video | Bed A ends with the file's OWN 10 s fade-out (file 4:08 to 4:17, env 3-1-0) RIGHT-ALIGNED so the tone dies on the last word "later." (hard-out: on "them."); the arrangement's own thinning (the last plateau bars) runs under the landing line into the fade; no hit, no stinger | solstice |

The first column is `CHn TITLE` as in the chapter heading (a time range follows); the `Bed / carve` column says WHICH SECTION of the file plays and how it is extended (remix loop) or right-aligned (the fade on the last word), never a bare "continues". A new BED is a new TRACK; this video has one. Exact carving (bar lines, in-points, loop points, dB under VO, the clip duck, breaths) is the `music-placement-strategist`'s job after the spine exists.

## VISUAL-PLAN

### Chapter themes (Convention 4b)
| CH | Accent | Image style | Note |
|---|---|---|---|
| ALL (CH1 to CH7) | #F15A22 (Quant orange) on pure white, text #43403E, orange words #D14A14, second chart series in warm grey | quant.network's own captures only (hero art, orange diagrams, isometric illustrations), used as themselves; no generated images, no Envato | ONE look and ONE bed for the whole video: the chapters are told apart by their title cards (waiver) and by the whiteboard story's progress, not by colour |

### The whiteboard story: "the islands" (WB1 to WB11, paper-quant pen, around 290 s, 47 to 53 percent held in code by the coverage node)
| WB | Chapter / beat | Canvas | Length | Mechanism or flow drawn |
|---|---|---|---|---|
| WB1 | CH2 Beat 1 | cover 1920x1080 | 25 to 30 s | four islands, each a bank with its own vault and ledger; a coin on a boat, one leg at a time, a clock |
| WB2 | CH2 Beat 2 | cover | 25 s | a deposit slip becomes a digital twin on the island's ledger (shield = same protections), an orange rules tag, then a fence around every island (walled garden) |
| WB3 | CH2 Beat 3 | cover | 25 to 30 s | a fifth island struck through; the orange Quant band above the islands; threads to each vault; a crossed-out coin in the band (never holds funds) |
| WB4 | CH2 Beat 4 | cover | 30 s | London and Singapore: padlock (lock), orange arrow + check (credit), clock + two-way arrow + padlock opens (settle), shields on both vaults |
| WB5 | CH2 Beat 5 | cover | 25 s | three legs between three islands: one lands, one hangs in limbo; padlocks on all three vaults; all three land together (all or none) |
| WB6 | CH3 Beat 2 | cover | 25 s | the remortgage: house, locked deposit, interest coins still dropping in, the calendar flips, the lock opens, the funds move |
| WB7 | CH3 Beat 3 | cover | 25 s | the US archipelago of 25 islands, the orange band over them (one network), the RTP and CHIPS roads feeding in, flag "H1 2027" |
| WB8 | CH4 Beat 2 | cover | 25 to 30 s | two lanes: developer -> licence fee -> QNT coin -> treasury contract -> Quant; bank -> software + service contract -> Quant with the orange "QNT share: not disclosed" tag |
| WB9 | CH5 Beat 1 | cover | 20 s | the pie and the slice (share), five coins one orange (peers), the Bitcoin ruler (in BTC) |
| WB10 | CH6 Beat 1 | cover | 25 to 30 s | flags on the horizon: the bond with coupons paid in tokenised deposits (UK), the harbour gate half open with the 2027 flag (US), the stage (Sibos) |
| WB11 | CH7 Beat 1 | cover 1920x1080; continues under the landing line's screen share, scaled into the deck area | 20 to 25 s | the islands from WB1 connected by the orange band, threads to every vault, padlocks and check marks moving along them: the payoff |

### Centerpieces and cards
- **C1** THE system-design diagram (CH2 Beat 6: the BODY of the one-sentence screen share, then full-frame under the walk-through): the bank's existing stack on the left, the Quant layer in the middle (Overledger API connector · Quant Flow + PayScript · QuantNet orchestration · Fusion rollup), ledgers and tokenised-deposit platforms on the right; orange wires; each node spotlights on its name; three small labels last.
- **C3 / C4** the tokenomics card (count-up, full-frame cover) and the market-cap card (the BODY of the live-numbers screen-share sentence, CH4 Beat 1), timestamped, [VERIFY]. The distribution figures on C3 only if Mike rules them in (attributed).
- **C5, C6, C7** the three ratio charts (CH5 Beats 2 to 4: each opens as the BODY of a one-sentence screen-share beat, then runs full-frame under the read), ANIMATED from DATA.md series: share of the total market (CMC, 2018 to 2026, peak marker 2022-10-18), the peer basket indexed to 100 (CoinGecko, QNT orange, peers warm grey, BTC dashed), QNT in BTC (two states: 1-year, long-run with the 2022 ATH). Axes labelled, the vendor small on each card, no em dashes, every endpoint re-pulled at record time. C8 (the September 2026 move) is NOT scripted as a beat; it is available as an optional receipt if Mike wants the shape of the move shown under CH5 Beat 2.
- **K1** the deck card "Quant, in one line" (CH1 Beat 2, BODY of the one-sentence screen share, then full-frame).
- **Title cards** (waiver): "Islands of Money" · "Who Uses It" · "The Token" · "Quant vs The Market" · "What's Next", white card, near-black title, the key word orange.

### Receipts (real pixels, never restyled) and the Seedance motion candidates (Mike picks 3 to 5 at GATE plan; 480p ONLY, 16:9, 4 s, slow move, the still as fallback; `assets/img-motion/<id>-motion.mp4`)
- **IMG-MOTION 1 = C9** quant.network home hero "The Infrastructure of Programmable Money" + the orange diagram (CH1 Beat 1, BODY).
- **IMG-MOTION 2 = C23** the /banks/ page hero (CH1 Beat 3, under the handoff). 🔍 not in DATA.md's index: the receipt-capturer confirms the page and its art before it is placed.
- **IMG-MOTION 3 = C10** the Quant Flow page art with "No new network to join" (CH2 Beat 3).
- **IMG-MOTION 4 = C11** the Quant Fusion page "Layer 2.5" art (CH2 Beat 6, inset on the Fusion node).
- **IMG-MOTION 5 = C24** the /use-cases/ isometric illustration (CH6 Beat 1). 🔍 not in DATA.md's index: confirm the page and its art.
- Static receipts: C12 TCH release (CH3 Beat 3, BODY), C13 Bank of England Synchronisation Lab (two crops), C14 UK Finance GBTD, C15 ECB annex row, C16 Murex headline, the Dentsu Soken release headline, the BIS Rosalind page header, C17 the news feed scroll, C20 the Verdian people page (CH3 Beat 1, BODY), C21 the Overledger 2.1.5 licence-fee crop. C18 (Etherscan / CoinGecko) and C19 (Companies House) are available as optional flashes under CH4 Beat 1 and CH1 Beat 2.
- Guardrail: no number on screen comes from an image model; code-built graphics trace to DATA.md sections 2 and 5; a capture is used as itself.

## OPEN QUESTIONS / NEXT SESSION

1. **Title and thumbnail text.** Working title "What Is Quant?"; alternates in the header. Thumbnail: photoreal single focus, Quant look (white / orange) if it reads, Mike's eyes stay green; the text is Mike's call.
2. **The handoff line (CH1 Beat 3).** Scripted: "So, let's walk through all of this." (proposed, never used). Alternates: "So, let's take this from the top." (proposed) · "So, let me show you how we got here." (proposed) · "So, let's go through it, piece by piece." (approved, last used 2026-10-06). The last three recorded lines are excluded.
3. **Title cards under the one-bed WAIVER.** Convention 2 ties a card to a new bed; this video has one continuous drone. Scripted: cards ON at CH2 to CH6 in the Quant look, OFF at CH1 and CH7, the bed running through their pauses. Mike rules cards on or off (or fewer).
4. **CH1's body.** The real quant.network homepage (scripted, with the Seedance push) or our own white title card "What is Quant?".
5. **The whiteboard story "the islands" (WB1 to WB11).** Approve the analogy and the scenes as written; the coverage node holds the share at 47 to 53 percent and the coverage-strategist tunes lengths within 15 to 30 s each.
6. **Screen-share beats.** 10 `[FACE]` lines (cap 12), each ONE sentence (a tight pair) like every face beat, the only exception the locked opening line in Mike's own words: CH1 the locked line (C9) and the one-line definition (K1), CH2 "the real thing, with the real names" (C1), CH3 "start with the founder" (C20) and the TCH selection sentence (C12), CH4 the live-numbers sentence (C4), CH5 the opening sentence of each chart (C5, C6, C7), CH7 the landing line (WB11's final state). The rest of every beat is cover, the same card or chart full-frame. Mike may add or move one.
7. **CTA close or HARD-OUT.** Scripted: the persona CTA over the end card, the fade dying on "later." Alternative: the take ends on "...to connect them." and cuts to black on the fade.
8. **CLIP-1 in or out** (Verdian, 10.8 s, CH3 Beat 1): the set-up wording "...and this is how he described what Quant does." CLIP-3 is HELD pending an official Oracle recording (it would open CH2). CLIP-2 is REJECTED (its meaning is operational risk). "NONE" is a valid ruling if Mike wants no third voice in a whiteboard-heavy video.
9. **The peer basket for C6:** LINK, HBAR, XRP, XLM, CC (market data only). Drop or keep any; Canton's history only starts 2025-11-10.
10. **The dominance chart's vendor (C5):** CoinMarketCap for both numerator and denominator (scripted, "Source: CoinMarketCap" on the card, 0.092% latest) or CoinGecko's basis (0.110% latest, same shape) or a TradingView `CRYPTOCAP:QNT.D` screencap for the trader's look.
11. **Tokenomics distribution on C3:** air the Blockworks-compiled business-paper figures (9.9M public, 2.6M reserve, 1.3M founders, 0.651M advisors) with the attribution, or keep the card to supply, circulating and ATH. Not spoken either way.
12. **Oracle.** Not scripted (the 2025 Overledger-inside-Oracle claim is secondary-only). If the receipt-capturer opens Oracle's own post in a browser, a one-line "Oracle's 2025 digital-assets product was reported to be built on Overledger" can ride in CH3 Beat 4 with its receipt.
13. **Seedance motion picks:** five candidates listed in VISUAL-PLAN (C9, C23, C10, C11, C24); choose 3 to 5 at GATE plan. 480p only.
14. **The rewatch line** (CH2 after Beat 5, phone wording): keep, or switch to the J-key / TV-remote wording.
15. **Live 🔍 `[VERIFY]` checklist, re-pulled at record time** (DATA.md section 5, snapshot 2026-11-04 12:08 UTC): QNT price (199.08), market cap (2.90B), rank (#34 CoinGecko), circulating supply (14,556,178), total crypto cap (2,647B), BTC price (78,166), 12-month changes (QNT +172.9%, BTC -23.0%), C5 last point (0.092% CMC / 0.110% CoinGecko), C6 endpoints (273 / 76 / 42 / 58 / 60 / 73 / BTC 77), C7 (0.00254 BTC = around 254,000 sats, 3.54x), the UK Finance GBTD page (a new pilot may have landed), the Bank of England Lab page (a report may have been published), the CLIP-1 window and the panel's month, the /banks/ and /use-cases/ pages for C23 / C24.
16. **Accuracy pass** (`video-creation/skills/accuracy-pass/accuracy-pass.md`) on this screenplay before Mike records: mandatory.
