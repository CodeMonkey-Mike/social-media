# Kaspa Founder: Genius or Over-Rated? SCREENPLAY

**Working title:** Kaspa's Founder: Quiet Genius, or the Most Over-Rated Man in Crypto?
**Track:** longform-edited (heavily-edited 16:9)
**Spine architecture:** a TRIAL. Put Yonatan Sompolinsky on the stand, lay out the receipt trail
(GHOST -> Ethereum -> SPECTRE -> GHOSTDAG -> Kaspa), then hand the skeptic their best shot at the
"over-rated" verdict, then dismantle the weak parts and land on the receipts. The viewer is the jury;
Mike closes the case.
**Register:** gear 3 (EPIC / DECLARATIVE) on CH1 + the verdict; drop to gear 2 (polished explainer) for the
GHOST / SPECTRE / GHOSTDAG mechanics. No "right?" tags, no conviction-then-hedge, no em dashes.

**Base material this expands from:** the reaction video "Kaspa Founder Yonatan Is A Genius, Iota Uses
Kaspa's Old Technology (WARNING)" by Jovin Woodley Finance (2023-11-17). We expand its one idea
("his old tech runs deeper than you think") into a full genius-vs-over-rated trial with real receipts.

---

## The hook / thesis

There is a man whose name is printed in the Ethereum whitepaper, whose 2013 idea quietly shaped the
second-biggest network in crypto, who then went and built his own chain from scratch with no premine and
no ICO. Half of crypto calls him a generational genius. The other half calls him an over-rated academic
the Kaspa cult turned into a messiah. Today we put both cases on the table and let the receipts decide.

**Thesis (where Mike lands):** the "over-rated" case is real enough to take seriously, and it still loses.
The receipts are the receipts. Forward-looking conviction, never a hedge.

### VERIFIED-FALSE / DO-NOT-SAY box (load-bearing: keep these OFF screen)

- **Do NOT say "Ethereum runs on his technology" or "Ethereum is built on GHOST."** It is not. The accurate,
  defensible claim: **Ethereum's whitepaper CITES his 2013 GHOST paper, and early Ethereum adopted a
  SIMPLIFIED variant of the idea (the uncle / ommer reward mechanism).** Full GHOST was never shipped as
  the live fork-choice. Overclaiming here is exactly the "over-rated" ammo we are trying to defeat, so do
  not hand it to the skeptic. [VERIFY at render]
- **Do NOT say "IOTA uses Kaspa's old technology"** (the base video's title is wrong/clickbait). IOTA's
  Tangle is its OWN DAG design; in the 2017 talk Kevin Chen merely EXPLAINS Sompolinsky and Zohar's GHOST
  and SPECTRE as related DAG research. Reference vs. dependency are different things. Say "an IOTA
  Foundation guy was on stage explaining his protocols back in 2017," not "IOTA stole his tech."
- **Do NOT call Sompolinsky the sole inventor of blockDAGs.** DAG-style ledgers were pursued in parallel
  (IOTA Tangle, Nano block-lattice, Hashgraph, etc.). His specific contribution is the ORDERING /
  consensus on a blockDAG (GHOSTDAG / PHANTOM), not "he invented DAGs."

---

## Chapter map (the spine: CH1 carries the hook, there is NO separate cold open)

| # | Chapter | One-line | Title card |
|---|---------|----------|-----------|
| CH1 | The man in the whitepaper | Hook + HYPE REEL (Branson-style feat montage): the name in Ethereum's whitepaper almost nobody can say. Genius or over-rated? Set the trial. | OFF |
| CH2 | Who is Yonatan Sompolinsky | BACKSTORY first (origin, family lineage, school path, student who co-wrote GHOST), then the quiet-academic credentials. | ON |
| CH3 | GHOST (2013): the citation that mattered | What GHOST actually solved + the receipt: the 2017 Brooklyn talk where an IOTA guy explains it on stage. | OFF (continues Press Play) |
| CH4 | SPECTRE -> PHANTOM / GHOSTDAG | From a chain to a blockDAG: stop throwing blocks away, order ALL of them. | ON |
| MID | Mid-roll plug | CryptoRich plug (gear-3 face). | OFF |
| CH5 | He shipped it: Kaspa (2021) | Papers are cheap. He launched a live chain, fair launch, no premine, GHOSTDAG running. DAGKnight next. | OFF (continues I Will Deliver) |
| CH6 | The case for OVER-RATED (steelman) | Hand the skeptic their best shot: citations are not adoption, GHOST got simplified away, it is a team not a messiah, DAGs are not only his. | OFF (continues I Will Deliver) |
| CH7 | The verdict | Concede the fair parts, dismantle the weak parts, land on the receipts -> genius. CTA. | OFF |

---

## Music plan

Three Soundstripe beds, in `video-creation/assets/music/`, registered in `assets/music/library.json`. **Each
`yt_license_code` below goes in the YouTube description ONLY** (Soundstripe clearance is YouTube Content-ID,
not needed on FB/IG). Bed handling (longform-edited rule #10): measure LUFS first and set the bed ~16-18 dB
UNDER the VO; `loop` any bed shorter than its span; put an inter-bed breath at each bed change.

| Chapters | Track (vibe) | File | YT license code |
|---|---|---|---|
| **CH1** (intro / hype reel) | **Revenant** — Michael Briguglio (epic modern-orchestral, 120bpm, soaring/building) | `Revenant/Michael_Briguglio_Revenant_instrumental_full_1_46-7.wav` | `AQFZRPVE95SG0TWF` |
| **CH2 + CH3** (backstory + GHOST) | **Press Play** — Elision (synthwave cruiser, 90bpm, chill/retro) | `Press Play/Elision_Press_Play_instrumental_1_33.mp3` | `KHWFBWAPGB4JAZUM` |
| **CH4 · MID · CH5 · CH6 · CH7** (the back half) | **I Will Deliver** — Strength To Last (electropop / new-wave driver, 130bpm, intense) | `I Will Deliver/Strength_To_Last_I_Will_Deliver_instrumental_4_07.mp3` | `WNVFRQQASZA8SSQQ` |

- **Use the INSTRUMENTAL of Revenant under the VO** (the downloaded master is the background-vocals mix; the
  bundle's `..._instrumental_full_1_46-7.wav` is the one to lay in so vocals do not fight the narration).
- **Bed changes (inter-bed breath):** CH1 -> CH2 (Revenant -> Press Play) and CH3 -> CH4 (Press Play -> I Will
  Deliver). Press Play (1:33) and Revenant (1:46) will need a loop to cover their spans; I Will Deliver (4:07)
  likely covers the back half without one.
- Section cuts (intro/chorus/verse/bridge) for each track are in the same folder if a hit/transition wants one.

---

## Production conventions (this video)

### Line-tag legend (read this first, tags sit at the START of every line)

Each line does ONE job and is labeled. Tag = emoji + bracket, so it reads in raw text AND colors in the VS
Code preview. `[NOTE]` and `[VERIFY]` heavy blocks are pulled out into colored callout boxes.

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike's face is on screen (gated, sparse, one sentence) |
| 🗣️ `[COVER]` | spoken, voice over visuals (face off, the default) |
| 🔒 `[SAY-EXACT]` | spoken, the exact locked words (verbatim) |
| 🎬 `[SHOW]` | on-screen direction: b-roll, container, image, receipt, transition |
| 💬 `[NOTE]` | a note to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |

(Beats keep a **bold signpost label**; the spoken/visual/note/verify lines hang under it. Heavy `[VERIFY]`
gates and `[NOTE]`s become `> [!WARNING]` / `> [!NOTE]` callout boxes. All chapters CH1-CH7 + the MID plug
use this format. Canonical definition: `screenplay.md` Convention 5.)

- **Title-card flags** (Convention 2 + the music-continuity rule): a card is ON **only at a chapter that
  STARTS A NEW music bed**; a chapter that CONTINUES the previous bed is OFF (flow straight in), even if it's a
  teaching chapter. So here only **CH2** (Press Play starts) and **CH4** (I Will Deliver starts) get cards;
  CH3 / CH5 / CH6 continue a bed -> OFF; CH1 (pure hook) / MID / CH7 (close) -> OFF. On-screen card text is a
  SHORT viewer-facing title, not the long production name above.
- **FACE / COVER** (Convention 3): gated face, OFF by default. `[FACE]` = ONE sentence as punctuation, then
  the next line is `[COVER]`. The vast majority of runtime is `[COVER]` over containers / b-roll / receipts.
  Every chapter still gets one face beat (usually its opener and its payoff). The MID plug is `[FACE]`
  throughout. CH3 / CH4 mechanics are almost entirely `[COVER]`.
- **Explainer visuals = system-design containers** (Convention 4): GHOST, SPECTRE, and GHOSTDAG each get a
  code-rendered HTML/SVG topology diagram (blocks as nodes, parent/vote edges as arrows), spotlight-swapped
  one bullet at a time. NOT tables, NOT AI images (numbers and labels must be pixel-accurate). Role colors:
  honest blocks = cyan, orphan/uncle blocks = amber, attacker/red blocks = red, the selected chain = white.
- **Receipt footage:** the 2017 Kevin Chen talk and the Ethereum-whitepaper citation are shown as literal
  on-screen RECEIPTS (screen-recorded scroll of the whitepaper reference; framed clip of the talk). These
  are the spine of the "genius" case; treat them like evidence exhibits, lower-third labeled.

---

## CH1: The man in the whitepaper  (hook)
**Register:** gear 3, peak epic. **Title card:** OFF (pure hook, flow straight in). **Face:** opener FACE, then cover. **Music:** Revenant (instrumental, epic build).

> [!NOTE]
> Model the open on the Branson "Coolest Billionaire" intro: a punchy HYPE REEL of his most iconic feats +
> bold epithets + a "get ready" promise, THEN drop into the trial. Keep every feat TRUE and on the verified
> list; the hype is in the delivery and the editing, not in inflated claims.

**Beat 1 — Open on the question (locked)**
🔒 `[SAY-EXACT]` 👤 `[FACE]` There is a name printed inside the Ethereum whitepaper that almost nobody in crypto can pronounce.
🎬 `[SHOW]` cut to a screen-recorded scroll of the Ethereum whitepaper reference list; highlight the Sompolinsky and Zohar GHOST citation as the line lands.

**Beat 2 — The hype reel** (rapid montage, gear 3 peak, each line a hard cut + impact)
🗣️ `[COVER]` His name is Yonatan Sompolinsky.
🎬 `[SHOW]` his photo / portrait fills the frame as his name lands (source a clear headshot: Harvard SEAS page or the Kaspa contributors page).
🗣️ `[COVER]` This is the man whose math is cited in the Ethereum whitepaper.
🎬 `[SHOW]` **C-RANK chart** (data, hold a beat longer than the montage flashes): a market-cap ranking of the top crypto networks, Ethereum highlighted at #2, with a callout "its whitepaper cites Sompolinsky and Zohar's GHOST". Animated bars per `skills/charts.md` (code-built, grow via `useCurrentFrame`). Reused in CH7's receipt restack.
🔍 `[VERIFY]` Ethereum's rank (#2) and every market-cap value at render day (CoinGecko / TradingView). Build mode = **code** (the numbers are the message); NEVER an image model for the values.
🗣️ `[COVER]` The man who looked at Bitcoin, the most secure network ever built, and said it was too slow. Then proved it on paper.
🗣️ `[COVER]` He turned the blockchain into a blockDAG, where blocks stop fighting and start stacking side by side.
🎬 `[SHOW]` custom ANIMATED block / blockDAG clip on this line: a block (then blocks) stacking side by side into a DAG. Build it as a GENERATED CLIP, not a ChatGPT image: generate the block image in **Higgsfield** (Nano Banana 2 or Soul), then animate it image-to-video with **Higgsfield Seedance 2.0**. RULES: Seedance **480p ONLY** (Remotion upscales free); **strip the baked audio** after download (`ffmpeg -c copy -an`).
💬 `[NOTE]` this is the hype/atmosphere layer, so an AI-generated clip is correct here. It is NOT the CH3/CH4 mechanics diagrams, those stay code-rendered HTML/SVG for text accuracy (Convention 4).
🗣️ `[COVER]` He took an idea off a university chalkboard and launched it into a top crypto network. No company. No investors. No premine. Nothing but code.
🎬 `[SHOW]` montage b-roll, all fast: whitepaper citation flash, the Kaspa chart, a stack of academic papers. (the blockDAG visual is its own dedicated clip above)

**Beat 3 — The epithets**
👤 `[FACE]` He is not a CEO. He is not an influencer.
🗣️ `[COVER]` He is a quiet academic from Israel who rewrote how blockchains agree on reality. And while every other founder was selling you a dream, this man was publishing the papers those founders quote.

**Beat 4 — The split**
👤 `[FACE]` So half of crypto calls him a generational genius.
🗣️ `[COVER]` The other half calls him an over-rated academic that the Kaspa community turned into a messiah.
🎬 `[SHOW]` split-screen container: GENIUS | OVER-RATED, two stacks of headlines.

**Beat 5 — The frame / promise**
🗣️ `[COVER]` Today we are not picking a side and shouting it. We put the receipts on the table: his story, GHOST, Ethereum, SPECTRE, the chain he actually built, and the strongest case against him too. Then you decide.
👤 `[FACE]` And at the end, I will tell you exactly where I land, and why.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Ethereum whitepaper cites GHOST (Sompolinsky and Zohar, 2013), confirm the exact reference text on screen.
> - Any rank claim ("top crypto network") tied to Kaspa's / Ethereum's standing at render day.
> - Every hype-reel feat is already on the verified facts list; no NEW claim enters here. Do NOT escalate to
>   "Ethereum runs on his tech" (see the DO-NOT-SAY box at the top).

---

## CH2: Who is Yonatan Sompolinsky  (backstory, then the quiet academic)
**Register:** gear 2 (story voice), rising to gear 3 on the payoff. **Title card:** ON ("Who Is He, Actually"). **Face:** opener + payoff; the backstory runs mostly COVER over the bio card. **Music:** Press Play (bed change in from Revenant).

> [!NOTE]
> This chapter OPENS with ~20-30s of real BACKSTORY before the credentials, modeled on the Branson video
> (birth/family/school the moment the hype reel ends). The point: the viewer knows the WHOLE guy, not just
> "PhD then Kaspa." Substance, not filler: origin, the family he comes from, the school path, and the detail
> that he was reshaping blockchains while still a student. A clean Branson-style BIO CARD graphic carries the facts.

**Beat 1 — So where does this guy come from?**
👤 `[FACE]` So where does this guy even come from?
🗣️ `[COVER]` Before the whitepapers, before Kaspa, before any of it.

**Beat 2 — Born and raised in Israel**
🗣️ `[COVER]` He was born and raised in Israel.
🎬 `[SHOW]` bio-card graphic, Branson-infobox style: "Yonatan Sompolinsky / born and raised in Israel / computer scientist"; highlight the key line.
🔍 `[VERIFY]` do NOT show a specific birth year/city unless confirmed (sources thin). Keep it to "born and raised in Israel."

**Beat 3 — The family he comes from** (family beat, GREENLIT by Mike, he is sourcing the photos)
🗣️ `[COVER]` And the Sompolinsky name carries a story most people have no idea about.
🗣️ `[COVER]` His grandfather, David, was a World War Two hero who worked with the Danish resistance to smuggle hundreds of Jews out of Nazi-occupied Denmark to safety in Sweden.
🗣️ `[COVER]` His father, Haim, is one of the most respected brain scientists alive, a Hebrew University and Harvard professor who just won the field's biggest prize.
🗣️ `[COVER]` This is not a kid who fell into crypto for the money. He comes from a family that did big, serious things.
🎬 `[SHOW]` period photos: grandfather **David** (`assets/img/IMG-FAM-grandfather-David.jpg`, DONE) + father
**Haim** / the 2024 Brain Prize headline (TO SOURCE); soft, restrained.
💬 `[NOTE]` this three-generation arc is the strongest beat in the chapter, and Mike has greenlit it.

> [!NOTE]
> **FAMILY LINEAGE — GREENLIT (Mike, 2026-06-29). He is sourcing the photos himself.** Background on the
> evidence: David Sompolinsky (1921-2021, Danish-resistance rescuer of ~700 Jews) and Haim Sompolinsky
> (Hebrew University / Harvard neuroscientist, 2024 Brain Prize, explicitly "the son of Rabbi David
> Sompolinsky" per ynet) are both independently rock-solid. The one hop that traces ONLY to the woolypooly
> profile is that **Yonatan** is Haim's son / David's grandson. Mike has decided to use the lineage on that
> basis and is supplying the family images (Yonatan portrait + grandfather David in `assets/img/`).
> Keep the on-screen wording factual ("he comes from this family"); do NOT overclaim beyond what woolypooly
> states. Still need a photo of the father, **Haim**.

**Beat 4 — The school path**
🗣️ `[COVER]` He went to the Hebrew University of Jerusalem to study computer science and math.
🗣️ `[COVER]` And here is the part that matters: he was not some rich founder who bought his way in later. He was still a student in 2013 when he and his advisor Aviv Zohar published GHOST, the exact paper now sitting inside Ethereum's whitepaper.
🗣️ `[COVER]` He was reshaping how blockchains work before he had even finished school.
🎬 `[SHOW]` bio-card updates: Hebrew University, CS + math; flash the 2013 GHOST paper.
🔍 `[VERIFY]` CS + math; the 2013 date.

**Beat 5 — The opposite of a crypto founder**
👤 `[FACE]` And he is the opposite of a crypto founder.
🗣️ `[COVER]` No Lambo posts, no daily threads, no countdown-to-the-moon. He kept going: the PhD finished around 2018, then a postdoc at Harvard, then the research lab that became Kaspa.
🎬 `[SHOW]` timeline strip: Hebrew University -> Harvard -> DAG Labs -> Kaspa.
🔍 `[VERIFY]` each node (PhD ~2018, Harvard postdoc, DAG Labs).

**Beat 6 — Why this matters to the trial**
🗣️ `[COVER]` This is not a marketer who learned to say "blockDAG." This is one of the people who did the underlying consensus research the rest of the space quotes.
🎬 `[SHOW]` receipt tease: paper titles.

**Beat 7 — The payoff line**
👤 `[FACE]` When the guy who is supposedly over-rated is the guy everyone else is citing, that is a strange kind of over-rated.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Born and raised in Israel (no specific date unverified).
> - CS (and math) at Hebrew University; PhD there, advisor Aviv Zohar, finished ~2018; GHOST co-authored 2013 as a student.
> - Harvard postdoc; founding scientist at DAG Labs (the company behind Kaspa's early dev).
> - FAMILY: GREENLIT by Mike (he is sourcing the photos; grandfather David saved, father Haim still needed).
>   Lineage basis is woolypooly; keep on-screen wording factual, do not overclaim.

---

## CH3: GHOST (2013): the citation that mattered
**Register:** gear 2 (explainer). **Title card:** OFF (continues Press Play from CH2, flow straight in; would-be title "GHOST: The 2013 Paper"). **Face:** opener only, rest COVER. **Music:** Press Play (continues).

**Beat 1 — The first receipt**
👤 `[FACE]` Here is the first receipt.
🗣️ `[COVER]` In 2013, Sompolinsky and Zohar published a paper called Secure High-Rate Transaction Processing in Bitcoin. The idea inside it is called GHOST.

**Beat 2 — What GHOST stands for, plainly**
🗣️ `[COVER]` GHOST stands for Greedy Heaviest Observed Sub-Tree. Say it like a human: when you speed Bitcoin up, blocks start getting created faster than the network can agree on, so lots of valid blocks get orphaned and thrown away. And throwing them away weakens security.
🎬 `[SHOW]` container A: a block tree, the main chain in white, the discarded side-blocks in amber.

**Beat 3 — The fix**
🗣️ `[COVER]` GHOST says stop ignoring those orphaned blocks. Count their work too when you decide which branch is the real one. Pick the heaviest observed sub-tree, not just the longest single line.
🎬 `[SHOW]` container A animates: amber side-blocks light up and get "counted" toward the heaviest branch.

**Beat 4 — Why it ended up in Ethereum**
🗣️ `[COVER]` This is the careful part. Ethereum's whitepaper cites this exact paper, and early Ethereum used a simplified version of the idea, the uncle reward, paying miners a little for those orphaned blocks so the network stays secure at fast block times.
🎬 `[SHOW]` receipt: the whitepaper citation on screen.
💬 `[NOTE]` do NOT say Ethereum "runs on GHOST" (see the DO-NOT-SAY box). Say "cited, and a simplified variant shipped as uncles."

**Beat 5 — The 2017 receipt (SET IT UP, then PLAY THE CLIP)**
🗣️ `[COVER]` And this is not me connecting dots after the fact.
👤 `[FACE]` Watch this.
🗣️ `[COVER]` This is a real talk from a 2017 meetup in Brooklyn, a guy from the IOTA Evangelist Network. Listen to who he credits.
🎬 `[SHOW]` **HARD INSERT, the centerpiece receipt: STOP our music bed and play the clip with ITS OWN audio up.**
Clip A (CUT + READY): `assets/captures/clips/R-TALK_clipA_GHOST-credit.mp4` (20s, 13:09-13:29 of the original, includes the FULL acronym) — he says "the GHOST proposal... written by Aviv and Yonatan, both brilliant mathematicians from Israel... so GHOST means the greediest heaviest observed sub-tree." Lower-third: "Kevin Chen, IOTA Evangelist Network, PencilWorks Brooklyn, Nov 2017". Credit "Captain SATs / Gaia Labs" on screen.
🗣️ `[COVER]` (music resumes) GHOST and SPECTRE, by name, as Sompolinsky and Zohar's work. People in the DAG world were studying this man years ago.
💬 `[NOTE]` clip is already cut to disk. Trim to a tighter ~6-8s if pacing needs it (the money line is "written by Aviv and Yonatan, both brilliant mathematicians from Israel"). **Clip B** (SPECTRE: "also created by Aviv and Yonatan who created the GHOST protocol earlier"), `clips/R-TALK_clipB_SPECTRE-credit.mp4` (~28:09), is the CH4 B2 callback insert. Full source: `assets/captures/R-TALK_KevinChen_PencilWorks_2017.mp4`.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Paper: "Secure High-Rate Transaction Processing in Bitcoin," Sompolinsky and Zohar, 2013. GHOST = Greedy
>   Heaviest Observed Sub-Tree. Confirm title + acronym wording on screen.
> - Ethereum whitepaper cites it; uncle/ommer mechanism = the simplified variant that shipped.
> - Receipt clip: "Iota Presentation: Kevin Chen at PencilWorks Brooklyn," channel Gaia Labs, uploaded
>   2017-11-05, recorded 2017-11-02 (desk calendar in frame), ~64 min. youtube.com/watch?v=i67ORkp5o_I. The
>   GHOST/SPECTRE portion is the segment "Captain SATs" later clipped. Clearance: short fair-use excerpt, credited.

---

## CH4: SPECTRE then PHANTOM / GHOSTDAG: from a chain to a blockDAG
**Register:** gear 2 (explainer). **Title card:** ON ("From Chain to BlockDAG"). **Face:** opener + payoff. **Music:** I Will Deliver (bed change in from Press Play; 130bpm driver for the back half).

> [!NOTE]
> CH3 GHOST only TWEAKED Bitcoin. SPECTRE is the bigger, stranger idea, and most viewers have never heard of
> it, so this chapter EARNS it: name it, say what it is in one sentence, then show how it works, BEFORE
> stacking GHOSTDAG on top. Do not assume the viewer knows the word. If this runs long, it is a candidate to
> split into its own chapter (see Open items).

**Beat 1 — The bigger swing**
👤 `[FACE]` GHOST only patched Bitcoin's tree, it still kept one single-file chain.
🗣️ `[COVER]` The next idea threw the single chain out completely.
🎬 `[SHOW]` cross into the new container.

**Beat 2 — Meet SPECTRE (and yes, the names get weird)**
🗣️ `[COVER]` You actually just heard this name. Remember that 2017 talk in the last chapter, the guy on stage walked through GHOST and SPECTRE. This is the SPECTRE half.
🗣️ `[COVER]` Three years after GHOST, in 2016, Sompolinsky teamed up again with Aviv Zohar and a third researcher, Yoad Lewenberg, on this second protocol. And if you have never heard of it, that is kind of the whole point, this is deep academic research that never had a marketing department behind it.
🎬 `[SHOW]` lower-third: "SPECTRE, 2016, Sompolinsky / Lewenberg / Zohar"; brief callback flash to the CH3 talk clip.
🔍 `[VERIFY]` authors / year.

**Beat 3 — What the name means, then forget it**
🗣️ `[COVER]` SPECTRE is an acronym. It stands for Serialization of Proof of work Events, Confirming Transactions via Recursive Elections. You do not need to memorize a single word of that.
🎬 `[SHOW]` show the acronym expanded on screen, then dim the jargon and leave the plain meaning.
🔍 `[VERIFY]` acronym wording.

**Beat 4 — The one-sentence version (this is the part that matters)**
🗣️ `[COVER]` SPECTRE is a from-the-ground-up design for a cryptocurrency that does not use a blockchain at all. It is not a coin you can go buy, it is the research blueprint that the real chain gets built from later.
🎬 `[SHOW]` container B intro: a single Bitcoin chain on the left morphs into a branching web on the right.

**Beat 5 — How it differs from Bitcoin**
🗣️ `[COVER]` Bitcoin lines blocks up one behind another, single file, one every ten minutes. SPECTRE lets blocks be created in parallel, many at the same moment, and each new block points back to several earlier ones. So instead of a chain you get a web. That web is the DAG, the directed acyclic graph.
🗣️ `[COVER]` The point of the web is speed, nobody is stuck waiting in a single-file line.
🎬 `[SHOW]` container B: parallel blocks fanning out with multiple parent arrows.

**Beat 6 — How a web agrees on order (recursive elections)**
🗣️ `[COVER]` The obvious problem with a web is, which block came first? SPECTRE's answer is to let the blocks vote. Each newer block effectively casts a vote on the order of the older ones, you tally the votes, and that settles it. That is the recursive elections part of the name.
🎬 `[SHOW]` container B: a couple of "vote" arrows between blocks.
🔍 `[VERIFY]` plain-language phrasing.

**Beat 7 — The catch SPECTRE left open**
🗣️ `[COVER]` The voting is fast, and it is great for one specific question, did payment A happen before payment B. But it does NOT hand you one single master list of every transaction in order, and you need that master list to run things like smart contracts. SPECTRE nailed the head-to-head, but not the full lineup.
🎬 `[SHOW]` container B: two blocks with no agreed sequence, a "?".

**Beat 8 — PHANTOM / GHOSTDAG (the answer, and the one Kaspa actually runs)**
🗣️ `[COVER]` So Sompolinsky and Zohar took one more step and generalized GHOST onto the web. GHOSTDAG keeps EVERY honestly created block, uses how well connected each block is to pick out the honest cluster, then lays all of them down in one agreed order.
🎬 `[SHOW]` container C: the DAG with a blue honest cluster, a red poorly-connected attacker block left out, then a single white ordered line threaded through the whole thing.
🔍 `[VERIFY]` GHOSTDAG is the live Kaspa consensus.

**Beat 9 — The payoff**
🗣️ `[COVER]` That is the whole leap. Bitcoin keeps one block and burns the rest.
👤 `[FACE]` GHOSTDAG keeps them all and still agrees on the order.
🗣️ `[COVER]` That is the engine under Kaspa.
🎬 `[SHOW]` container C holds.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - SPECTRE (2016): Sompolinsky, Lewenberg, Zohar. Acronym = "Serialization of Proof-of-work Events, Confirming
>   Transactions via Recursive Elections" (eprint 2016/1159). DAG of blocks, parallel creation, recursive voting.
> - SPECTRE gives a PARTIAL / pairwise order (fast A-vs-B), NOT a full total order, that gap sets up GHOSTDAG.
>   Frame it as a research stepping stone, NOT a product to buy.
> - PHANTOM / GHOSTDAG (2018-2020): Sompolinsky with Zohar / Shai Wyborski; total ordering over a blockDAG; the
>   consensus Kaspa runs.
> - Keep it conceptual; no specific TPS/BPS number unless render-day accurate (Kaspa's BPS target moved over time).

---

## MID: Mid-roll plug
**Register:** gear 3, direct. **Title card:** OFF. **Face:** `[FACE]` throughout (this is the one block that is all face). **Music:** I Will Deliver (continues; per house rules keep the plug conversational, no impact/cube).

👤 `[FACE]` Quick break, because this is exactly the kind of edge we go deep on.
💬 `[NOTE]` then deliver the standard CryptoRich community CTA (per persona): "follow me," own link only, no third-party links, no em dashes. Conviction, not desperation. Keep it to ONE tight face beat, do not let the plug bloat. Back to the trial right after.

---

## CH5: He shipped it: Kaspa (2021)
**Register:** gear 2 rising to gear 3. **Title card:** OFF (continues I Will Deliver from CH4, flow straight in; would-be title "He Actually Shipped It"). **Face:** opener + payoff. **Music:** I Will Deliver (continues).

**Beat 1 — Papers are cheap**
👤 `[FACE]` Papers are cheap.
🗣️ `[COVER]` Crypto is full of brilliant whitepapers that never become a living network. The thing that separates Sompolinsky from a pure academic is that he shipped.

**Beat 2 — Kaspa, 2021**
🗣️ `[COVER]` In 2021, GHOSTDAG went from PDF to a live proof-of-work layer-1. And the launch itself is part of the genius case: no premine, no ICO, no presale, no insider allocation.
🎬 `[SHOW]` b-roll: block-explorer / network atmosphere; container: a clean "launch terms" card, each line a check.
🔍 `[VERIFY]` launch terms day-of.

**Beat 3 — Why a fair launch is the flex**
🗣️ `[COVER]` A founder who could have minted himself a fortune chose to launch it the hard, credibly-neutral way. That is a deliberate choice, and it is the opposite of a hype grift.

**Beat 4 — DAGKnight (what is next)**
🗣️ `[COVER]` And he did not stop. With Michael Sutton he co-authored DAGKnight, a parameterless, responsive consensus that adapts to network conditions instead of hard-coding them. The research did not freeze in 2013.
🎬 `[SHOW]` container tease: a small "GHOST -> SPECTRE -> GHOSTDAG -> DAGKnight" lineage strip.
🔍 `[VERIFY]` DAGKnight authorship / term.

**Beat 5 — Payoff**
👤 `[FACE]` A real engine, a live chain, a clean launch, and the next protocol already written.
🗣️ `[COVER]` That is not a man resting on one 2013 citation.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Kaspa mainnet launched Nov 2021; PoW; implements GHOSTDAG; fair launch (no premine / ICO / presale).
> - DAGKnight (2022): Sompolinsky and Michael Sutton; parameterless / responsive consensus.

---

## CH6: The case for OVER-RATED  (steelman: give the skeptic their best shot)
**Register:** gear 2, fair and even-handed (NOT sarcastic: a real steelman lands harder). **Title card:** OFF
(continues I Will Deliver from CH5, flow straight in; would-be title "Now, The Case Against Him"). **Face:** opener FACE, then COVER through the four counts. **Music:** I Will Deliver (continues).

**Beat 1 — Be honest, here is the other side**
👤 `[FACE]` Be honest, here is the other side.
🗣️ `[COVER]` If I only give you the genius case, I am selling you, not informing you. So here is the strongest version of "over-rated," straight.

**Beat 2 — Count 1: citations are not adoption**
🗣️ `[COVER]` Being cited in the Ethereum whitepaper is not the same as Ethereum depending on you. Full GHOST was never the live fork-choice; what shipped was a simplified uncle reward. A footnote in history is not a throne.
🎬 `[SHOW]` container: "CITED" vs "DEPENDED ON," the honest gap shown.

**Beat 3 — Count 2: it is a team, not a messiah**
🗣️ `[COVER]` Zohar, Lewenberg, Wyborski, Sutton, these papers are co-authored. The Kaspa community's "one lone genius" story flattens a body of collaborative academic work into a cult of personality.
🎬 `[SHOW]` container: the co-author list.

**Beat 4 — Count 3: DAGs are not his alone**
🗣️ `[COVER]` IOTA's Tangle, Nano, Hashgraph, others chased DAG-style ledgers in parallel. The idea of "blocks in a graph" was in the water.
💬 `[NOTE]` this is why the base video's "IOTA uses his old tech" title is wrong, say reference, not theft.

**Beat 5 — Count 4: the market is the cold judge**
🗣️ `[COVER]` For all the research pedigree, Kaspa is a fraction of the size of the chains it is compared to. If the tech is this far ahead, a skeptic asks, why is the market not pricing a genius.
🎬 `[SHOW]` **C-MCAP chart** (data): Kaspa's market cap as a SMALL bar next to a few much larger networks, size context only (magnitude, not merit). Animated bars per `skills/charts.md` (code-built, grow via `useCurrentFrame`).
💬 `[NOTE]` keep this CONDITIONAL and forward-looking, never a self-undermining call; this is the steelman, so Kaspa reading small here is intentional. C-MCAP and CH1's C-RANK are the genius/over-rated bookend (giant fingerprint vs small chain).
🔍 `[VERIFY]` Kaspa + comparison market caps at render day (CoinGecko / TradingView); caps drift hard. Build mode = **code**; NEVER an image model for the values.

**Beat 6 — The honest concession**
👤 `[FACE]` Some of that is fair. The messiah framing IS overcooked, and citations alone prove nothing.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Full GHOST not shipped as Ethereum's live fork-choice; uncle reward = the simplified variant.
> - Co-authors across the papers: Zohar, Lewenberg, Wyborski, Sutton (confirm spellings).
> - Parallel DAG projects: IOTA, Nano, Hashgraph (named only as "others also pursued DAGs").

---

## CH7: The verdict
**Register:** gear 3, peak declarative. **Title card:** OFF (flow into the close). **Face:** the verdict sentences + CTA. **Music:** I Will Deliver (continues, through the close).

**Beat 1 — Take the skeptic's wins first**
🗣️ `[COVER]` So the cult framing loses. He is not a messiah, he did not invent DAGs alone, and a citation is not a coronation. Concede it cleanly.

**Beat 2 — Then weigh what is left**
🗣️ `[COVER]` But strip all of that away and look at what is still standing. A 2013 idea cited by the second biggest network in crypto. A line of protocols, GHOST to SPECTRE to GHOSTDAG to DAGKnight, each one solving what the last one left open. And a live chain, fairly launched, running the thing he proved on paper.
🎬 `[SHOW]` container: the receipts stack back up, one by one (incl. the **C-RANK** chart from CH1 as one of the stacked receipts, on "cited by the second biggest network").

**Beat 3 — The verdict line**
🗣️ `[COVER]` Over-rated men have one good year and a loud fan club.
👤 `[FACE]` This man has a decade of work that other people keep building on.
🎬 `[SHOW]` back to the receipts.

**Beat 4 — Where I land**
👤 `[FACE]` That is not over-rated.
🗣️ `[COVER]` That is a quiet genius the timeline is too distracted to notice. And the market noticing late is exactly the asymmetry I look for.
💬 `[NOTE]` keep the upside CONDITIONAL ("if the research keeps converting into a network, the gap could close"), never a promised target.

**Beat 5 — CTA / close**
👤 `[FACE]` Tell me in the comments, genius, or over-rated. I already told you mine.
💬 `[NOTE]` persona close: like / subscribe / community per CTA rules, "follow me," own link only, no third-party links, no em dashes. Tease: next we go deeper on GHOSTDAG itself.

> [!IMPORTANT]
> **🔍 VERIFY before screen:**
> - Re-confirm every receipt re-stacked here matches what was shown earlier (no NEW unverified claim sneaks
>   into the close). "Second biggest network" rank tied to render day.

---

## Facts + receipts (sources)

**Source / base video (what we expand from):**
- "Kaspa Founder Yonatan Is A Genius, Iota Uses Kaspa's Old Technology (WARNING)", Jovin Woodley Finance,
  uploaded 2023-11-17, ~12:21. youtu.be/AC-OsbXC1Q4. (Reaction video; its embedded clip is the receipt below.)

**The found footage (the on-stage talk the base video shows):**
- "Iota Presentation: Kevin Chen at PencilWorks Brooklyn", channel **Gaia Labs**, uploaded **2017-11-05**,
  duration ~64 min (3881 s), ~633 views. **youtube.com/watch?v=i67ORkp5o_I**
- Recorded **2017-11-02** (the "NOV 02 THU" flip-calendar visible on the credenza in frame; Nov 2 2017 = Thu).
- Speaker: **Kevin Chen**, founder of the IOTA Evangelist Network (IEN). The talk covers the IOTA Tangle and
  DAG-vs-blockchain; the segment used in the base video is his walk-through of **GHOST and SPECTRE** as
  Sompolinsky and Zohar's work.
- Chain of custody: Kevin Chen's 2017 talk -> "Captain SATs" clipped the GHOST/SPECTRE portion ->
  Jovin Woodley Finance reacted to that clip. Credit "Captain SATs" + Gaia Labs on screen for the excerpt.

**Yonatan Sompolinsky: biography (verify each before it goes on screen):**
- Israeli computer scientist; PhD, Hebrew University of Jerusalem (advisor Aviv Zohar); postdoc, Harvard;
  founding scientist, DAG Labs; founder of Kaspa.

**Protocol papers (verify titles/authors/years on screen):**
- GHOST: "Secure High-Rate Transaction Processing in Bitcoin," Sompolinsky & Zohar, 2013. Greedy Heaviest
  Observed Sub-Tree. Cited in the Ethereum whitepaper; simplified variant shipped as the uncle/ommer reward.
- SPECTRE: Sompolinsky, Lewenberg, Zohar, 2016. DAG, parallel blocks, fast pairwise ordering.
- PHANTOM / GHOSTDAG: Sompolinsky, Zohar, Wyborski, 2018-2020. Total ordering over a blockDAG.
- DAGKnight: Sompolinsky & Michael Sutton, 2022. Parameterless / responsive consensus.
- Kaspa: mainnet Nov 2021, PoW, GHOSTDAG, fair launch (no premine / ICO / presale).

**Reference sources gathered this session (for fact-checking, NOT for on-screen citation per the
no-third-party-links rule):** IQ.wiki (Yonatan Sompolinsky), kaspa.org/contributors, the PHANTOM/GHOSTDAG
and SPECTRE papers (semanticscholar / IACR eprint), Epicenter #192 (Zohar & Sompolinsky interview).

---

## Open items / next session

1. **Live `[VERIFY]` pass** at render time on every flagged stat: Ethereum rank, Kaspa launch terms, all
   paper titles/authors/years, DAGKnight authorship, relative market size. Numbers drift.
2. **Clip clearance** for the Kevin Chen / Gaia Labs excerpt: keep the on-screen excerpt short, fair-use,
   and credited (Captain SATs + Gaia Labs). Confirm Mike is comfortable with the length used.
3. **Prep manifest is built: `EDIT-PLAN-prep.md`** (beat-indexed, Layer model + per-beat Face/Visual/Transition
   tables + zero-orphans check, per `skills/edit-plan-and-cue-sheet.md` §0). Next: build the 3 core diagrams
   (GHOST tree, SPECTRE web, GHOSTDAG coloring) per Convention 4, then the ~10 containers + receipts + IMG-YS +
   the Higgsfield/Seedance blockDAG clip. Family photos (IMG-FAM) stay GATED. Post-record this graduates into
   the generated event-log `EDIT-PLAN.md` + the layer-grouped `CUE-SHEET.md`.
4. **Confirm the CTA exact wording** (CryptoRich community + "follow me," own link only) against persona CTA
   rules before recording.
5. **Record per `longform-edited.md`** Phase 1-4 once the script is approved.
6. Mike to confirm the final working title (genius-vs-over-rated framing) and whether CH6 stays a full
   steelman chapter or compresses into CH7.
7. **CH4 length / possible split (Mike, 2026-06-29):** CH4 now properly INTRODUCES SPECTRE (most viewers have
   never heard of it). If the chapter runs long on the recorded take, split into two chapters: CH4 = SPECTRE
   (what it is, the web, recursive elections, the catch it left open), CH5 = PHANTOM / GHOSTDAG (the answer
   Kaspa runs). Renumber the downstream chapters if so. Decide after the first read-through.
