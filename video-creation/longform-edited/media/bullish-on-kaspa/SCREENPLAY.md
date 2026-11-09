# bullish-on-kaspa - SCREENPLAY

_Pre-production script for the longform-edited video `bullish-on-kaspa` (CryptoRich, Mike's main crypto channel). Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py --face-max 10`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; the opening IS Chapter 1. Authored 2026-11-03 from the LOCKED brief + Mike's hard constraints and his three additions in `PROJECT-LOG.md` (runtime earned by the data, the Solana parallel, the community line) and the fact source `DATA.md` (compiled 2026-11-03, market snapshot 22:24 to 22:46 UTC)._

- **Working title:** Bullish on Kaspa (alternates for Mike at GATE 1: "Why I Am More Bullish on Kaspa Than Ever" · "Kaspa Just Came Online. Here Is Everything That Shipped" · "Are We Late on Kaspa? No. Here Is Why."). **Thumbnail text:** Mike's call at GATE 1 ("BULLISH" / "BULLISH ON KASPA" / "ARE WE EARLY?"); photoreal single focus, built at the deliver stage, Mike's eyes stay green, the Kaspa coin greenish cyan with the backwards-K, never gold.
- **Track:** longform-edited (16:9), Mike on camera. **Channel:** CryptoRich. Standard delivery (the FINAL is staged to the longform queue at the deliver stage; the YouTube upload is Mike's own). NO AI-pipeline detail of any kind on this channel.
- **Archetype / register:** a POSITIVE, ENERGETIC conviction video on KAS in the Energetic shape (lets-get-rich, growth-scale-up, inference): one idea per line, every line lands with a device, no preamble, no "in this video", no recap, no fact said twice. Mike's excitement is the product; he speaks as the Kaspa voice whose conviction reads vindicated. Gear map: **CH1 = gear 3** (the excitement, on the face) -> **CH2 = gear 2 rising to 3** (what it is) -> **CH3 = gear 3** (the dated receipts, fast) -> **CH4 = gear 3** (what is coming, with the founder's own voice) -> **CH5 = gear 1 to 2** (the SUBTLE chapter: calm numbers, real charts, almost no pops, then the Solana parallel and the turn back up) -> **CH6 = gear 3** (the close).
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6) with MORE face than the house norm by Mike's instruction: **10 `[FACE]` lines in the whole video (the tenth is the mid-roll plug, CH4 Beat 5), `--face-max 10`** (CH1 the locked hook, CH1 inspiring line 1, CH1 the title pop line; CH2 inspiring line 2; CH3 inspiring line 3; CH4 the resume after the founder's clip; CH5 inspiring line 4, the turn; CH6 inspiring line 5, CH6 the CTA). Every FACE beat carries its kinetic-text device, a sentence or a tight pair, never a bare talking head; everything else is `[COVER]`. The tenth face is offered in OPEN QUESTIONS 10.
- **Effects theme:** `kinetic-text-2023` (label "Energetic"), the FULL set (`video-creation/assets/effects/library.json`; sounds `video-creation/assets/sfx/kinetic-text/`; placement rules `skills/overlays/overlays.md` section 2). Every 🎬 `[SHOW]` line that uses a device names its device id and its sound id. A device is motion + sound together, one sound per event, never silent, never two stacked; `minecraft-damage` at most once (used once, CH2, the orphan block); `punch-1-2023` once (CH3, "FINAL"); `kt-text-wall` once (CH6, the hinge). In CH5 the devices thin out hard: real charts and explorer receipts carry it, push-slides only, one sparkle on the turn line. Icons and stickers are proposed in VISUAL-PLAN for Mike at GATE 1; every Kaspa coin or glow is greenish cyan with the backwards-K logo, never gold.
- **Captions:** house default; OFF for the hold of every keyword pop, every band, the text wall and the chips; `kt-caption-highlight` IS the caption on the FACE lines it covers (never a second caption under it).
- **Music:** ONE track for the whole video, Mike's pick: **`oh-la-la`** (AEROPLANES, "Oh La La", Soundstripe 11249, 3:37, 122 bpm, Bb minor, high-energy EDM, aggression 96, license code in the catalog). One bed from frame 0 to the last frame, ducked under the VO, the pops and the clip insert. The file is shorter than the video and very loud through its peaks (24 to 74, 86 to 150, 164 to 208 s), so it is extended by the ONE-TRACK CARVE method (music.md section ONE TRACK, CARVED): the peaks right-aligned to chapter ends, the mid builds (74 to 86, 150 to 164 s) looped under the dense beats, the subtle CH5 on the track's own quiet material (the 0:23 section cuts, mean around -19 dB against around -8 dB for the 0:31 peak cuts), and the return to energy on CH6 as the drop back into a peak cut whose HARD STOP lands on the last word. Never a second track. Therefore **title cards: NONE** (Convention 2); chapters flow in on `kt-whip-cut`. Usage ledger run 2026-11-03 (`usage_ledger.py report --what music --exclude-project bullish-on-kaspa`): `oh-la-la` is `fresh` (never used); blocked `kitsune` / `lightheart`, avoided `atmos-rise` / `deliverance` / `get-it`.
- **Container theme:** LIGHT (`--container-theme light`): the system-design diagram C1, the vProgs container D1 and the animated charts (C2, C3, C4, C5, C17) use `container-canonical-light.css`; the kinetic-text devices keep their own looks (dark band and dark panel beside the face, crumpled paper beside b-roll and over receipts, black for the text wall).
- **Target runtime (Mike, 2026-11-03: runtime is EARNED BY THE DATA, 5:00 to 8:00, 8:00 ceiling):** chosen length **around 7:20 to 7:35** spoken plus the 10.8 s clip insert. Reason: DATA.md verifies around 45 distinct dated facts across the launched, coming and standing pillars (12 dated receipts, 7 forward items, 14 live numbers, the Solana chain of 4 prices), and this script says each ONCE: around 1,245 spoken words at Mike's desilenced pace of around 170 words a minute (CH5 slower, around 150). No restating, no padding; the length is what the distinct material fills. Per-chapter budgets sit on each chapter header. Runtime is never a reason to cut a RECORDED line.
- **Fact source:** every number, date, name and quote traces to `DATA.md` in this folder; the Solana figures trace to PROJECT-LOG.md's 2026-11-03 addition 1 (CoinGecko `/coins/solana` + Binance SOLUSDT monthly klines; the main loop carries them into DATA.md at GATE 1). Chart / receipt IDs C1 to C21 = DATA.md CHART-SOURCE INDEX; C22 (the Solana chart) and D1 (the vProgs container) are added by this screenplay in VISUAL-PLAN. Live-drift figures (price, cap, volume, hash rate, transactions, addresses, token and holder counts, TVL, the fundraiser bar) are snapshots of 2026-11-03 22:24 to 22:46 UTC, re-pulled at record time and again at render.
- **Accuracy pass:** mandatory before Mike records (`video-creation/skills/accuracy-pass/accuracy-pass.md`). The per-chapter verify boxes are the claim-by-claim map to DATA.md; the live re-pull of the volatile rows is the pass itself and is listed in OPEN QUESTIONS 11.

---

## THE HOOK / THESIS

Mike is more bullish on Kaspa than he has ever been, and the price has nothing to do with it. Kaspa launched in November 2021 as a fair-launched proof-of-work network: no premine, no pre-sale, no insider allocation, every coin mined in the open from genesis (kaspa.org, DATA.md T1). It is a fully implemented GhostDAG running at 10 blocks a second since the Crescendo hard fork of May 5, 2025, on research that starts with GHOST in 2013, credited by name in the Ethereum whitepaper (T2, T7). In 2026 the building came online: the Toccata hard fork of June 30 made Layer 1 programmable, the first smart coins landed July 2, Silverscript 1.0 shipped September 9, KCC-20 tokens checked by Kaspa's own consensus went Final on October 21, around 460 tokens are live on Layer 1, Nacho is migrating, and the L2 stack (Igra, Kasplex, Kaskad lending on Igra) is live (T3, T4, Pillar 2). What is coming is real and said as it is: vProgs under construction with no public date, DAGKnight targeting 25 to 40 blocks a second and 100 for a 2027 hard fork, a community-funded Kaspa Dollar with its fundraiser closing January 1, 2027, and the founder's own on-stage research on conditional transactions (T6, Pillar 3). The subtle chapter looks at the numbers as they are: around 3.1 cents, around 85 percent under the July 2024 high, 96.8 percent mined, a hash rate up 4 months in a row through 3 reward cuts after a 70 percent fall, user transactions flat around 70 to 80 thousand a day, a typical L1 token with 2 holders, TVL under a million dollars (T5, Pillar 4). The tools came first and the crowd has not arrived; Solana shows what a written-off network CAN do (around 172x, then a 97 percent fall, then around 37x), a parallel and never a prediction. The close: sound money mined by anyone, owned by no one, a community as dedicated as the XRP army, and the persona CTA.

> [!WARNING]
> **DO NOT AIR "Kaspa has crossed 2.5 billion transactions" or "addresses approaching 600,000".** api.kaspa.org at 2026-11-03 21:00 UTC: 2,443,645,211 transactions; 567,718 addresses hold at least 1 KAS (806,398 hold any dust). Airable: "closing in on 2.5 billion transactions" and "more than 565,000 addresses holding at least 1 KAS", both re-pulled on record day (2.5 billion may land first; then say it). (DATA.md do-not-air rows 1 and 2.)

> [!WARNING]
> **DO NOT AIR "Kaspa was hacked in September" or "the miners check the tokens".** The September 20, 2026 exploit was in the Kasplex KRC-20 INDEXER, an outside bookkeeping system; "the flaw was in the indexer, not in kaspa"; Kaspa's Layer 1 was never compromised. KCC-20 tokens are covenants validated by Kaspa's own Layer 1 CONSENSUS (every validating node, miners included); TokenPost: Final status "does not change Kaspa's consensus or core-node behavior". Airable: "an outside indexer was exploited, Kaspa's Layer 1 was not" and "token rules enforced by Kaspa's own Layer 1 consensus, the rules every node and miner validates, not an outside indexer". (DATA.md rows 9 and 10.)

> [!WARNING]
> **DO NOT AIR the internal-drama remark ("a lead developer publicly asked the founder for more drive") or "Kaspa delisted from Binance futures".** Both are KOL leads with no primary found on 2026-11-03; the first is internal drama Mike rules on (his rule: WARNING only, never aired unless he asks); the second is unverified. Neither is in this script. (DATA.md rows 11 and 12.)

> [!WARNING]
> **DO NOT AIR a date for vProgs or DAGKnight, "the Kaspa stablecoin" as an official product, or "5,700 TPS".** kaspa.org/build: vProgs "under construction", "a future direction"; kaspa.org/lore gives DAGKnight no date; only the 100 BPS step carries "Targeted for a 2027 hardfork" (never "will"). Kaspa Dollar is a community-funded project led by a core developer, 9.5 percent funded at read, refunds if the goal is missed: say it that way. The persona's 5,700 TPS is in no source opened (Sutton, 2025: capacity "~3k txs per second"): the script says "10 blocks a second" and no TPS figure. (DATA.md rows 13, 14, 16.)

> [!WARNING]
> **Numbers that never air as the popular version (DATA.md rows 3 to 8, 17, 19):** not "440 tokens" (459 at read, drifts: "around 460" with the capture-day figure); not "97 percent mined" (96.82: "around 96.8 percent"); not "hash rate up 6 percent in 4 days" (window-dependent: the four-month trend, "up around 14 percent from the July average to the October average, through 3 reward cuts"); not "55,000 dollars a day against 10 million of volume" (volume was 20.0 million at read: "well under 1 percent of what trades in a day"); not "TVL around 810,000" (DefiLlama chains sum to 770,057; Kaskad's 645,866 includes Robinhood Chain, not a Kaspa L2); not "194 Nacho holders" (355 at read, drifts); not "all-time-high hash rate 1,592 PH/s" (one spike sample); not "a 1,000x from the bottom" (thin early-listing data; "around 50x from the December 2022 low to the 2024 high" if ever used). The November 4, 2026 reward cut will have PASSED by recording: past tense only, no day-relative words.

> [!WARNING]
> **The Solana parallel airs as a PARALLEL, never a prediction (Mike's addition 1).** "Solana did this" and "this is what a written-off network CAN do", never "Kaspa will". One source per on-screen number: the Binance SOLUSDT monthly chain (1.51 open January 2021, 259.90 high November 2021, 8.00 low December 2022, 295.83 high January 2025; computed around 172x, around 97 percent, around 37x). CoinGecko's own all-time high (293.31) and all-time low (0.5008, the 519x) are NOT mixed in. Why it was written off (FTX, the outages) has no DATA.md source yet, so the line stays general ("everybody wrote it off"). Current caps (around 55.1B vs around 863M) are live-drift, re-pulled at record time.

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | THE HOOK | Hook (opens the video, no cold open): the locked excitement line on the face, "nothing to do with the price"; the fair launch as a stacked list over b-roll; inspiring line 1; "2026 is the year it all came online" with the title pop; the rotated handoff | **Bed A starts at frame 0** (`oh-la-la`, the ONLY bed of the video): the master's intro build, its FIRST DROP (file 24 s) pinned to the title pop | OFF | ~36 s / ~101 words |
| CH2 | WHAT IT IS | The blockchain-vs-blockDAG diagram C1 (orphans thrown away vs every block kept, GhostDAG orders them, 10 blocks a second since Crescendo); the smooth monthly emission (C2 state A); the research lineage (2013, 2018, 2022, Harvard); inspiring line 2 | same file: PEAK 1 under the opening, a splice to the 74 to 86 s mid build looped under the diagram, the PEAK 2 DROP on inspiring line 2 | OFF | ~57 s / ~162 words |
| CH3 | WHAT JUST LAUNCHED | The receipts timeline C5, fast: Toccata June 30, smart coins July 2, Silverscript 1.0 September 9, the indexer exploit (the indexer, not Kaspa) and the KCC-20 answer October 21, around 460 L1 tokens, the Nacho migration, the L2 stack (Igra, Kasplex, Kaskad), the network milestones; inspiring line 3 | same file: PEAK 2 (86 to 150 s) right-aligned so its last bar lands on inspiring line 3 | OFF | ~105 s / ~305 words |
| CH4 | WHAT IS COMING | vProgs (D1, under construction, no date), DAGKnight (25 to 40 BPS targeted, 100 for a 2027 hard fork), Kaspa Dollar (community funded, closes January 1, 2027), the founder on stage: CLIP-1 in his own voice; the resume on the face | same file: the 150 to 164 s rise looped, PEAK 3 DROP on "100 blocks a second", the peak thinning into CH5; bed ducked under CLIP-1 | OFF | ~76 s spoken + 10.8 s of clip / ~215 words |
| CH5 | WHERE IT STANDS | The SUBTLE chapter: the real price chart C13, supply and the November cut (C2 state B), the hash rate curve C3, flat user transactions C4, holders per token C17 and TVL C12, said as they are; the Solana parallel on the real chart C22; inspiring line 4 turns it back up | same file's QUIET CUTS (`0_23-4.wav` / `0_23-5.wav`, mean around -19 dB) chained bar-aligned, the last pass ending on a cut's own RESOLVE under the turn line | OFF | ~115 s / ~289 words |
| CH6 | THE CLOSE | The text wall "TOO LATE? / EARLY." as the hinge; the conviction in one line; Mike's long-term theory (Ethereum takes number 1, Bitcoin maxis cascade to Kaspa); inspiring line 5 on the face; the community line (the XRP army as the benchmark); the persona CTA with the subscribe bar; the bed's HARD STOP on "later" (or the hard-out, Mike's call) | same file: the drop back into the PEAK CUT `0_31-1.wav` on the wall's red word, RIGHT-ALIGNED so its hard stop lands on the last word | OFF | ~62 s / ~175 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it. Chapter boundaries are `kt-whip-cut` (`swoosh-8`, the chapter-level whip), never a card.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. More than the house norm on this video (10 of them, max 10), each WITH its kinetic-text device and with `kt-caption-highlight` as its caption: a sentence or a tight pair, never a bare talking head |
| 🗣️ `[COVER]` | spoken, VO over b-roll with headline pops / stacked lists / the LIGHT diagram and animated charts / real-site receipts. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (device id + sound id, b-roll, receipt, chart cue, icon). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken. ONE proposed on this video (CLIP-1 in CH4) |

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed. This video has ONE continuous bed from frame 0 (one track, carved), so the card set that falls out of the MUSIC-MOOD-PLAN is EMPTY: every chapter is OFF and flows in on `kt-whip-cut`.

| CH | Title card | Why |
|---|---|---|
| CH1 | OFF | the hook; frame one is Mike |
| CH2 | OFF | same track, a carve (the mid build under the diagram), not a bed change |
| CH3 | OFF | same track, peak 2 from its drop |
| CH4 | OFF | same track, the rise and peak 3 |
| CH5 | OFF | same track, its own quiet section cuts |
| CH6 | OFF | same track, the peak cut to the last frame |

**FACE/COVER rules (Convention 3, adjusted for this video by Mike):** face is gated OFF by default; a face cut is ONE sentence or a tight pair WITH its device; the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say. Budget 10, scripted 9. On every FACE line the running `kt-caption-highlight` is the caption (one bottom caption per spoken phrase, ALL CAPS italic, white with the key word in the video accent, replaced on the next phrase, silent; the house caption track is OFF for its span).

**Explainer visuals (Convention 4):** ONE system-design diagram, C1 (blockchain vs blockDAG), and ONE system-design container, D1 (vProgs: apps on Layer 1 talking to each other), both code-rendered in the LIGHT theme, one talking point each, spotlight-swapped; the numbers WE control are code-built ANIMATED charts (C2 emission, C3 hash rate, C4 transactions, C5 the receipts timeline, C17 holders), every label pixel-accurate, every figure from DATA.md; real market data and every third-party page is a real-site receipt (C6 to C16, C19 to C21, C22), never restyled. Never an AI image as the source of a number.

**Kinetic-text devices (overlays.md section 2 + the effects library rows):** `kt-caption-highlight` on every face line (phrases silent; the FIRST caption of the video does the `open_stretch` on `swoosh-4` at frame 0; a phrase that is itself the headline uses the two-colour pop on `wooden-rattle-whoosh`; "COMMENT BELOW" pops on `typing`) · `kt-keyword-pop` (sound by meaning: `knock-pop` neutral, `minecraft-damage` ONE negative verdict in the whole video, `twinkle` positive, `punch-1-2023` one emphatic accent-red word, `cash-register` a money / result word started 0.17 s early; the `chip` variant on `cartoon-accent`) · `kt-keyword-sparkle` (`ting` per burst) · `kt-headline-over-broll` (`ea-glitch-21` on a tech b-roll cut, `swoosh-3` on a calm one, then the pop's sound by meaning) · `kt-stacked-list-over-broll` (headline on `wooden-rattle-whoosh`, the sub-line on `whoosh-4` 0.23 s after its slide starts, EACH item on `fast-reverse-5`) · `kt-word-by-word` (phrases silent, `cash-register-2` on the payoff word) · `kt-lower-third-band` (`swoosh-4` 0.34 s before the band, `knock-pop` on the text) · `kt-side-panel` (dark beside the face, `swoosh-1` right / `swoosh-2` left; PAPER beside b-roll or over a receipt, `whoosh-4`) · `kt-icon-pop` (flat SVG icons on `swoosh-1` entering from the left / `swoosh-2` from the right, or riding the cut's `whoosh-4`; a sticker cuts in with its footage, no sound of its own) · `kt-text-wall` (cuts in SILENT, `cash-register` on the red headline word, `swoosh-4` 0.1 s before the cut out; ONCE, CH6) · `kt-subscribe-close` variant `bar` (its own `subscribe-bar-clicks` track) · `kt-push-slide` (`swoosh-4` on a push in, `whoosh-4` on a push that lands on the face, silent between two silent charts) · `kt-whip-cut` on every angle change (`whoosh-4` default, `fast-reverse-1` / `fast-reverse-5` variety, `swoosh-8` chapter-level, `swoosh-4` the opening whip at frame 0). `kt-typewriter-card`, `kt-statement-over-broll`, `kt-list-card` and `kt-scatter-words` are NOT used on this video (nothing here is a typed definition or a scattered list); they stay available. Captions OFF for the hold of every pop, band, chip and the wall.

**Clip inserts (Convention 6):** CONSIDERED on every video; ONE proposed on this one (the founder, Yonatan Sompolinsky, in his own voice, CH4 Beat 4), one held, one rejected, in `## CLIP-INSERTS`. A clip plays FULL-FRAME with its own voice while the spine pauses; the bed ducks -14 dB automatically; never a muted cover.

---

## CH1 - THE HOOK
**Register:** gear 3, peak energetic. Short hammer sentences. No "right?" tags, no hedge, no "in this video", no whole-video preview. The FIRST sentence is the excitement, on the face.
**Title card:** OFF. **Music:** Bed A (`oh-la-la`) enters at frame 0 inside the master's intro build; the file's FIRST DROP (file 24 s) is pinned to the title pop on "2026" (see MUSIC-MOOD-PLAN).
**Budget:** ~36 s, ~101 spoken words.

**Beat 1 - the hook (LOCKED opening)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **I am more bullish on Kaspa right now, than I have ever been.**
🔒 `[SAY-EXACT]` 🗣️ `[COVER]` **And it has nothing to do with the price.**
🎬 `[SHOW]` Frame 0 is Mike. `kt-whip-cut` IN onto the face (the open's 0.73 s whip with the 25 to 0 degree roll, `swoosh-4` file start at frame 0); a slow 5 percent punch-in over the line. `kt-caption-highlight` is the caption: the FIRST phrase "I AM MORE BULLISH ON KASPA" does the `open_stretch` (scale-height 300 to 100 + skew 10 to 0 over 0.48 s, riding that same `swoosh-4`), BULLISH in the accent; then the hard-cut phrase "THAN I HAVE EVER BEEN" (silent), EVER in the accent. House captions OFF. On "And" `kt-whip-cut` OUT (`whoosh-4`) onto b-roll of a KAS price chart on a phone screen (tech b-roll): `kt-headline-over-broll` "NOTHING TO DO WITH THE PRICE" two lines, `ea-glitch-21` ON the cut, `knock-pop` ON the pop 0.8 s later.
💬 `[NOTE]` Locked because the caption phrases and the whips are cued to these words. The excitement line is said as fact, no "I think", no "guys".

**Beat 2 - the fair launch**

🗣️ `[COVER]` This network launched in November of 2021, with no premine, no pre-sale, and no insider allocation.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) onto mining-farm b-roll (rows of ASICs, fans, cables). `kt-stacked-list-over-broll`: headline "FAIR LAUNCH" pops top-frame ON "launched" (`wooden-rattle-whoosh`); items "NO PREMINE" ON "premine", "NO PRE-SALE" ON "pre-sale", "NO INSIDER ALLOCATION" ON "insider" (`fast-reverse-5` each); all three stay.
🗣️ `[COVER]` Every single coin in circulation was mined, in the open, from the first day of mainnet onward.
🎬 `[SHOW]` The stack pushes out RIGHT with its footage (`kt-push-slide`, `whoosh-4`); 2 s flash of C21, the kaspa.org hero "No premine. No hidden allocation. Fair launch.", as a PAPER `kt-side-panel` right (`whoosh-4`), real pixels; the PICKAXE icon (`kt-icon-pop`, flat SVG in the accent) slides in from the left beside it (`swoosh-1`).
🔍 `[VERIFY]` "November of 2021" = mainnet 2021-11-07 (wiki.kaspa.org tokenomics; kaspa.org/lore "November 2021"); "no premine, no pre-sale, no insider allocation" and "mined in the open from genesis" = kaspa.org home + /lore verbatim (DATA.md T1).
👤 `[FACE]` Nobody was handed Kaspa. You earned it with a machine, or you bought it from somebody who did.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-5`) to the face. `kt-caption-highlight` phrases "NOBODY WAS HANDED KASPA" (NOBODY in the accent) / "YOU EARNED IT WITH A MACHINE" (EARNED in the accent) / "OR YOU BOUGHT IT FROM SOMEBODY WHO DID" hard-cut on their first words; `kt-keyword-sparkle` on EARNED's last letter, two bursts 0.4 s apart (`ting` each). House captions OFF.
💬 `[NOTE]` INSPIRING LINE 1 of 5 (the fair launch, in the hook). Mike rules it at GATE 1 (OPEN QUESTIONS 2); spares are there too.

**Beat 3 - the turn (the title pop)**

🗣️ `[COVER]` And for 5 years, through the run up and through the crash, the builders never stopped.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto a code-editor / terminal timelapse (tech b-roll): `kt-headline-over-broll` "5 YEARS OF BUILDING", `ea-glitch-21` ON the cut, `knock-pop` ON the pop.
🔍 `[VERIFY]` "5 years" = November 2021 mainnet to a November 2026 record; if the record slips into December the line still holds (5 years and change).
👤 `[FACE]` 2026, is the year it all came online.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) to the face; the file's FIRST DROP lands here. ON "2026" the title does the two-colour pop variant of `kt-caption-highlight` (the 007 title move): two lines "BULLISH ON" over "KASPA", caps 80 px, centred at 75 to 80 percent of the frame height, KASPA in the accent, `wooden-rattle-whoosh` ON the pop; it holds to the chapter whip. The KASPA COIN sticker (greenish cyan, backwards-K; `kt-icon-pop` image_sticker variant) cuts in beside the head with the whip, no sound of its own. House captions OFF.
💬 `[NOTE]` The hook device (OPEN QUESTIONS 6): scripted = the "BULLISH ON / KASPA" title pop on this line; alternate = the title pop on the locked first line instead, with this line as a plain caption.
🗣️ `[COVER]` So, let's take this from the top.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) into CH2.
💬 `[NOTE]` The handoff is a `proposed` line never used (persona `dive_in_variants`); the last three recorded were "get into it", "see how this will all play out", "dive into all this". Alternates in OPEN QUESTIONS 9.

> [!IMPORTANT]
> CH1 verify list:
> - "no premine, no pre-sale, no insider allocation", "mined in the open from the genesis block" = kaspa.org home + kaspa.org/lore, read 2026-11-03 (DATA.md T1, Pillar 1).
> - "November of 2021" = 2021-11-07 mainnet (DATA.md Pillar 5 table).
> - "5 years" and "2026 is the year it all came online" = the dated receipts of CH3 (Toccata 2026-06-30, smart coins 2026-07-02, Silverscript 2026-09-09, KCC Final 2026-10-21, Igra 2026-03-19); said as a frame here, never as a list (no fact twice).
> - The three face lines above are CH1's face beats (3 of 10). Do not ad-lib another to camera.
> - No number in this chapter is live-drift.

---

## CH2 - WHAT IT IS
**Register:** gear 2 rising to 3. Teaches in plain language for a viewer who has never heard of it; every term glossed in the line. One face line, the lineage payoff.
**Title card:** OFF. **Music:** Bed A, PEAK 1 runs its first bars under the opening; on the bar line before the C1 push-in a splice to the file's MID BUILD (74 to 86 s), extended by a bar-aligned remix loop under the diagram and the emission curve; the PEAK 2 DROP (file 86 s) is pinned to inspiring line 2 (see MUSIC-MOOD-PLAN).
**Budget:** ~57 s, ~162 spoken words.

**Beat 1 - the blockDAG (C1, THE diagram)**

🗣️ `[COVER]` Now, here's what Kaspa actually is. Bitcoin runs one block at a time, and when 2 miners find a block at the same moment, one of them gets thrown away.
🎬 `[SHOW]` C1 pushes in from the left (`kt-push-slide`, `swoosh-4`): the LIGHT system-design diagram, state A, a single chain of blocks with two blocks found together and one greyed out and dropped off the chain. ON "thrown away" `kt-keyword-pop` "THROWN AWAY" over the dropped block (`minecraft-damage`, the ONE negative verdict of the video).
🗣️ `[COVER]` Kaspa keeps every block. They land in parallel, in a graph, and GhostDAG puts them all in order.
🎬 `[SHOW]` C1 state B spotlight-swaps in: the parallel blocks, the DAG edges drawing, the ordering arrow lighting in the accent ON "order". `kt-keyword-pop` "EVERY BLOCK COUNTS" (`twinkle`, positive).
🗣️ `[COVER]` Kaspa is a fully implemented GhostDAG, running proof of work at 10 blocks a second, since the Crescendo hard fork on May 5th, 2025.
🎬 `[SHOW]` C1 state C: the 10-blocks-a-second counter animates along the DAG; `kt-keyword-pop` chip variant "10 BLOCKS / SECOND" rises at the caption height ON "10" (`cartoon-accent`).
🔍 `[VERIFY]` "10 blocks a second" = kaspa.org/lore verbatim; "Crescendo, May 5th, 2025" = rusty-kaspa v1.0.0 notes, DAA 110,165,000, projected 2025-05-05 15:00 UTC; "a fully implemented GhostDAG" = persona wording (the paper: eprint 2018/104). C1's labels trace to DATA.md Pillar 1 only.

**Beat 2 - the emission (C2 state A)**

🗣️ `[COVER]` The block reward does not halve every 4 years. It shrinks a little every single month, a smooth halving, toward a hard cap of around 28.7 billion.
🎬 `[SHOW]` C2 state A pushes in (`kt-push-slide`, `swoosh-4`): the LIGHT animated chart, the smooth monthly curve stepping down beside a flat 4-year-halving staircase; the cap line "28.7B" at the top. No pop; the chart carries it.
🔍 `[VERIFY]` "a little every single month" = the chromatic phase: every month the block reward falls by (1/2)^(1/12), from 440 KAS at 2022-05-08 (wiki.kaspa.org; rusty-kaspa coinbase.rs table, 41530469757 / 44000000000 = 0.9439); "around 28.7 billion" = maxSupply 28,704,035,605 KAS (api.kaspa.org coinsupply, 2026-11-03). The percent-mined figure is CH5's, not here.

**Beat 3 - the lineage**

🗣️ `[COVER]` And the research behind it is older than most of crypto. The GHOST protocol, 2013, Yonatan Sompolinsky and Aviv Zohar, credited by name in the Ethereum whitepaper.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto university / library b-roll (calm): 2 s flash of C19, the Ethereum whitepaper paragraph "an innovation first introduced by Yonatan Sompolinsky and Aviv Zohar in December 2013", as a PAPER `kt-side-panel` right (`whoosh-4`), the sentence highlighted, real pixels. `kt-keyword-pop` "2013" ON "2013" (`knock-pop`).
💬 `[NOTE]` Pronunciation: Sompolinsky = som-po-LIN-skee; Zohar = ZO-har.
🗣️ `[COVER]` GhostDAG, the paper, 2018. DAGKnight, 2022. And the founder is a research associate at Harvard, still publishing in 2026.
🎬 `[SHOW]` `kt-stacked-list-over-broll` over the same b-roll: headline "THE RESEARCH" (`wooden-rattle-whoosh`) then items "GHOST 2013" / "GHOSTDAG 2018" / "DAGKNIGHT 2022" ON their years (`fast-reverse-5` each); 2 s flash of C16, the arXiv title block (Sompolinsky, Newman, Wang, Parkes), as a PAPER `kt-side-panel` right (`whoosh-4`).
🔍 `[VERIFY]` GHOST = eprint 2013/881 (Sompolinsky, Zohar); GHOSTDAG = eprint 2018/104 received 2018-01-30; DAGKnight = eprint 2022/1494 received 2022-10-31, Sompolinsky listed as Harvard University; "research associate at Harvard" = the Oxford Union host intro (2026-04-07) and arXiv 2609.12197 (submitted 2026-09-10, Harvard CS). DATA.md T7 and section 3.
👤 `[FACE]` That is nearly 8 years of published research before the first block on mainnet was ever mined.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-5`) to the face; the PEAK 2 DROP lands here. `kt-caption-highlight` phrases "NEARLY 8 YEARS OF PUBLISHED RESEARCH" (8 YEARS in the accent) / "BEFORE THE FIRST BLOCK ON MAINNET WAS MINED" (MINED in the accent); `kt-keyword-sparkle` on RESEARCH, one burst (`ting`). House captions OFF. `kt-whip-cut` (`swoosh-8`, the chapter whip) into CH3.
💬 `[NOTE]` INSPIRING LINE 2 of 5 (the lineage). "nearly 8 years" = December 2013 (GHOST) to November 2021 (mainnet), 7 years 11 months; "on mainnet" because a testnet genesis dated 2021-10-08 sits in the code (accuracy pass). CLIP-2, the Oxford Union host's credential intro, is HELD as an optional 12.4 s insert right before this line (OPEN QUESTIONS 5); not scripted.

> [!IMPORTANT]
> CH2 verify list:
> - "one of them gets thrown away" / "Kaspa keeps every block ... GhostDAG puts them in order" = the plain-language summary DATA.md Pillar 1 supports (kaspa.org/lore; eprint 2018/104); C1 carries no number that is not "10".
> - "10 blocks a second" (kaspa.org/lore) · "Crescendo, May 5th, 2025" (rusty-kaspa v1.0.0 notes; KIP-14 Active).
> - "shrinks a little every single month" = (1/2)^(1/12) per month (wiki tokenomics + coinbase.rs) · "around 28.7 billion" cap (api.kaspa.org coinsupply).
> - "GHOST 2013 ... credited by name in the Ethereum whitepaper" (ethereum.org/en/whitepaper, Modified GHOST Implementation) · "GhostDAG 2018" · "DAGKnight 2022" · "research associate at Harvard" · "still publishing in 2026" (arXiv 2609.12197, 2026-09-10).
> - "older than most of crypto" is framing (2013 predates Ethereum's 2015 mainnet and nearly every alt), not a count.
> - One face line in this chapter (4 of 10).

---

## CH3 - WHAT JUST LAUNCHED
**Register:** gear 3, a run of dated receipts, fast. One date per line, one device per date. One face line closes it.
**Title card:** OFF. **Music:** Bed A, PEAK 2 (file 86 to 150 s) under the whole chapter, RIGHT-ALIGNED so its last bar lands under inspiring line 3; an 8-bar repeat inside the peak if the take runs past 64 s (see MUSIC-MOOD-PLAN).
**Budget:** ~105 s, ~305 spoken words.

**Beat 1 - Toccata (the hard fork)**

🗣️ `[COVER]` Now we get to what shipped. June 30th, 2026, the Toccata hard fork, and Layer 1 became programmable. Covenants, transaction introspection, and zero-knowledge verification, native, on the base layer.
🎬 `[SHOW]` C5, the LIGHT animated receipts timeline, pushes in from the top (`kt-push-slide`, `swoosh-4`) and is the spine of this chapter: rung "JUN 30 2026 · TOCCATA" lands ON "Toccata". 2 s flash of C6, the rusty-kaspa "Mainnet Toccata Release - v2.0.0" page with the activation sentence, as a PAPER `kt-side-panel` right (`whoosh-4`), real pixels. `kt-keyword-pop` "LAYER 1 IS PROGRAMMABLE" ON "programmable" (`twinkle`).
🔍 `[VERIFY]` "June 30th, 2026" = kaspa.org/lore "Toccata activated on mainnet on June 30, 2026, at DAA score 474,165,565"; "covenants, transaction introspection, ZK verification" = kaspa.org/build verbatim; v2.0.0 released 2026-06-05, KIPs 16, 17, 20, 21 Active (DATA.md T3, Pillar 2). Never "the May hard fork".

**Beat 2 - the tools (smart coins, Silverscript)**

🗣️ `[COVER]` 2 days later, July 2nd, the first smart coins went live on mainnet.
🎬 `[SHOW]` C5 rung "JUL 2 · FIRST SMART COINS" lands ON "July"; `kt-keyword-pop` chip "JULY 2" (`cartoon-accent`).
🗣️ `[COVER]` September 9th, Silverscript version 1.0. A token that took thousands of lines of raw opcodes, now around 60 readable lines.
🎬 `[SHOW]` C5 rung "SEP 9 · SILVERSCRIPT 1.0"; 2 s flash of C8, the Silverscript v1.0.0 GitHub release, as a PAPER `kt-side-panel` right (`whoosh-4`). `kt-word-by-word` at the lower third: "THOUSANDS OF LINES" / "NOW" (silent) then the payoff "60 LINES" big in the accent ON "60" (`cash-register-2`).
🔍 `[VERIFY]` "July 2nd" = kascov.io "mainnet's first smart coins arrived July 2, 2026" (community explorer); "September 9th, Silverscript 1.0" = github.com/kaspanet/silverscript v1.0.0, published 09 Sep (year per Kaspa Commons 2026-09-10); "thousands of lines ... approximately 60 readable lines" = Kaspa Commons post 2026-09-10 (community account, quoted as the claim it is). kaspa.org/build: "Tooling is still early".

**Beat 3 - the indexer, and the answer (KCC-20)**

🗣️ `[COVER]` September 20th, an outside indexer for the old KRC-20 tokens got exploited. Here's the thing. Kaspa's Layer 1 was never touched. The flaw was in the bookkeeping outside the chain.
🎬 `[SHOW]` C5 rung "SEP 20 · AN OUTSIDE INDEXER EXPLOITED" lands; `kt-whip-cut` (`whoosh-4`) onto padlock / server-room b-roll; `kt-lower-third-band` "AN OUTSIDE INDEXER WAS EXPLOITED. KASPA'S LAYER 1 WAS NOT." (`swoosh-4` 0.34 s before the band, `knock-pop` ON the text), held 4 s. House captions OFF under the band.
🔍 `[VERIFY]` "September 20" and "the flaw was in the indexer, not in kaspa" = @KASPAglobal 2026-10-31 (fxtwitter); the Kasplex KRC-20 indexer signature-verification bypass, "Kaspa's base chain was not compromised" (KuCoin / Bitcoin.com coverage). WARNING box 2 wording binds this line: never "Kaspa was hacked".
🗣️ `[COVER]` And the fix was already being built. KCC-20, tokens on Layer 1 itself, was written in August. October 21st, 2026, it was declared Final. Token rules enforced by Kaspa's own consensus, the rules every node and every miner validates, not an outside indexer.
🎬 `[SHOW]` C5 rung "OCT 21 · KCC-20 FINAL" lands ON "Final"; `kt-keyword-pop` "FINAL" in the accent red with the glow ON "Final" (`punch-1-2023`, the ONE emphatic red word of the video). 2 s flash of C7, the @kccforum post "KCC-1, KCC-2 and KCC-20 are now Final", as a PAPER `kt-side-panel` right (`whoosh-4`), real pixels; the SHIELD-CHECK icon (`kt-icon-pop`, flat SVG) slides in from the right beside it (`swoosh-2`).
🔍 `[VERIFY]` "October 21st, 2026 ... Final" = @kccforum 2026-10-21 15:02 UTC + github.com/kaspanet/kccs (KCC-1, KCC-2, KCC-20 Final); "enforced by Kaspa's own consensus ... not an outside indexer" = the do-not-air table's airable wording (TokenPost: Final status "does not change Kaspa's consensus or core-node behavior"; KASPAglobal: "a covenant that L1 consensus checks itself"). Never "the miners check the tokens" alone.

**Beat 4 - the tokens are live (kascov, Nacho)**

🗣️ `[COVER]` As of early November, around 460 tokens are live on Layer 1, with markets and live trades tracked right on the explorer. And Nacho, the biggest meme token on Kaspa, opened its one-way migration to KCC-20 on October 30th, closing January 31st, 2027.
🎬 `[SHOW]` C9, the kascov.io tokens page, as a full-frame receipt pushed in from the left (`kt-push-slide`, `swoosh-4`), a slow scroll down the token column, the NACHO row highlighted, real pixels; C5 rung "OCT 30 · NACHO MIGRATION OPENS" lands ON "October 30th"; 2 s flash of C10, the migration post, as a PAPER `kt-side-panel` right (`whoosh-4`). CAPTURE: highlight the OFFICIAL Nacho row, 41d44970 (355 holders at read), NOT the other token listed as NACHO, 654c18b4 (53 holders); C10 = Nacho's own page nachothekat.xyz ("FINAL DAY Jan 31, 2027").
🔍 `[VERIFY]` "around 460" = 459 KCC-20 tokens, kascov tokens.json 2026-11-03 22:44 UTC [live-drift: the capture-day figure, and the spoken "around 460" moves with it]; "markets and live trades tracked on the explorer" = kascov markets / venues (it shows trades; the trading itself runs on venues) (KaspaRocket AMM + order escrow); "Nacho ... October 30th ... January 31st, 2027" = @KASPAglobal 2026-10-31 quoting @NachotheKat (the January 31st, 2027 deadline is now PRIMARY: nachothekat.xyz "FINAL DAY Jan 31, 2027", one-way, 1:1, read 2026-11-03; the October 30th opening still rests on @KASPAglobal). "The biggest meme token on Kaspa" = DATA.md section 3 ("largest KRC-20 meme token").

**Beat 5 - the L2 stack**

🗣️ `[COVER]` Then the L2 stack. Igra opened its public mainnet on March 19th, 2026, after 6 months of testing and a Sigma Prime audit. And on Igra there is a lending protocol, Kaskad, live since May, double audited, with staking for governance.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) onto data-centre / fibre b-roll (tech): `kt-stacked-list-over-broll` headline "THE L2 STACK" ON "stack" (`wooden-rattle-whoosh`); items "IGRA · MAR 19 2026" ON "Igra", "KASKAD LENDING · MAY 2026" ON "Kaskad" (`fast-reverse-5` each). 2 s flash of C20, the Kaskad "Live on Robinhood Chain & Igra" hero, as a PAPER `kt-side-panel` right (`whoosh-4`), real pixels. C5 rung "MAR 19 · IGRA MAINNET" lands.
🗣️ `[COVER]` The second L2 is Kasplex, a full EVM Layer 2, so Ethereum apps can move over with minimal changes. Kaspa itself orders its transactions, and KAS is its only gas token.
🎬 `[SHOW]` C23, the Kasplex L2 docs page, as a full-frame receipt pushed in from the left (`kt-push-slide`, `swoosh-4`), the lines "Full EVM Equivalence" and "Sequencing and data availability are managed by Kaspa's Layer 1" highlighted, real pixels. `kt-keyword-pop` chip "KAS = THE ONLY GAS" ON "gas" (`cartoon-accent`).
🗣️ `[COVER]` ZealousSwap, KrokoSwap and KaspaCom are all running on it, and since April 2026, Gate lets you move KAS onto it directly from the exchange.
🎬 `[SHOW]` C24, the DefiLlama Kasplex chain page, protocols table, as a full-frame receipt, the three names highlighted ON each name, real pixels. No pop; the receipt carries it.
🔍 `[VERIFY]` Kasplex: docs-kasplex.gitbook.io/l2-network ("EVM-compatible Based Rollup", "Full EVM Equivalence", "Sequencing and data availability are managed by Kaspa's Layer 1"), the project's own description; KAS gas = crypto.news 2026-04-20 ("sole gas and network token"); the Gate bridge = the same article; the 3 DEXs = DefiLlama protocols API 2026-11-03 [live-drift, re-check all 3 at capture]. NO launch date aired: an August 31, 2025 go-live press release, an April 2026 "imminent mainnet" quote, and block 1 of the live RPC at 2025-09-20 do not agree. NO zero-knowledge claim, NO sub-second-finality claim (docs only, and those docs carry another project's leftover anchors).
🔍 `[VERIFY]` Igra: press release dated Zug, March 19, 2026 ("Following six months of testing with zero state divergence"; "A security audit by Sigma Prime completed with no unresolved issues"); Kaskad: kaskad.app/about "Public mainnet · live on Igra (May 2026)", /protocol "Double audited by Sherlock", "Stake KSKD ... to vote". Never Hemi (not on any Kaskad page). Persona: "the L2 stack", naming only what is verified live.

**Beat 6 - the network milestones**

🗣️ `[COVER]` And the network itself is closing in on 2.5 billion transactions, with more than 565,000 addresses holding at least 1 KAS.
🎬 `[SHOW]` C14, the explorer.kaspa.org stats header, as a full-frame receipt pushed in from the top (`kt-push-slide`, `swoosh-4`), real pixels, the transactions counter live; `kt-keyword-pop` "2.4 BILLION TRANSACTIONS" ON "billion" (`cash-register` started 0.17 s early, a scale word).
🔍 `[VERIFY]` 2,443,645,211 total (coinbase 245,621,223 + regular 2,198,023,988) at 2026-11-03 21:00 UTC; 567,718 addresses with at least 1 KAS at 22:24 UTC (api.kaspa.org) [live-drift: re-pull on record day; if 2.5 billion has landed, say "crossed 2.5 billion" and the pop changes with it; WARNING box 1].
👤 `[FACE]` No company owns this network, nobody had to ask permission, and all of it shipped.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-5`) to the face; PEAK 2's last bar sits under this line. `kt-caption-highlight` phrases "NO COMPANY OWNS THIS NETWORK" (OWNS in the accent) / "NOBODY HAD TO ASK PERMISSION" / "AND ALL OF IT SHIPPED" (SHIPPED in the accent); `kt-keyword-sparkle` on SHIPPED, two bursts (`ting` each). House captions OFF. `kt-whip-cut` (`swoosh-8`, the chapter whip) into CH4.
💬 `[NOTE]` INSPIRING LINE 3 of 5 (built in the open, permissionless; decentralization said as architecture). One face line in this chapter (5 of 10).

> [!IMPORTANT]
> CH3 verify list:
> - Toccata 2026-06-30 (kaspa.org/lore; rusty-kaspa v2.0.0) · smart coins 2026-07-02 (kascov) · Silverscript 1.0 2026-09-09 (GitHub release) · indexer exploit 2026-09-20 (KASPAglobal + coverage) · KCC Final 2026-10-21 (@kccforum; kaspanet/kccs) · Nacho migration opened 2026-10-30, closes 2027-01-31 (deadline primary: nachothekat.xyz) · Igra 2026-03-19 (press release) · Kaskad May 2026 (kaskad.app) = DATA.md Pillar 2 + the Pillar 5 table; C5 draws exactly these rungs plus the CH4 / CH5 dates (the November cut, January 1 and January 31, 2027, the 2027 target).
> - "around 460 tokens" · "closing in on 2.5 billion transactions" · "more than 565,000 addresses" are LIVE-DRIFT: snapshot 2026-11-03 22:24 to 22:44 UTC, re-pulled on record day; the do-not-air versions (440, 2.5 billion crossed, 600,000) never air.
> - "around 60 readable lines" = a community post's claim (Kaspa Commons), said as what it is; "thousands of lines of raw opcodes" is its wording.
> - "staking for governance" only (no fee-sharing wording found); never Hemi.
> - One face line in this chapter (5 of 10).

---

## CH4 - WHAT IS COMING
**Register:** gear 3, forward-looking, every forward item said with its real status ("under construction", "targeted", "community funded"), never "will". The founder's own voice once (CLIP-1); one face line resumes.
**Title card:** OFF. **Music:** Bed A, a splice to the file's second MID BUILD (150 to 164 s, the rise) looped under vProgs and DAGKnight; the PEAK 3 DROP (file 164 s) pinned to "100 blocks a second"; PEAK 3 under Kaspa Dollar and the set-up line, ducked -14 dB under CLIP-1 automatically; the peak thins (the file's 208 s outro) under the resume line so the fall into CH5 is the arrangement's own (see MUSIC-MOOD-PLAN).
**Budget:** ~76 s spoken + 10.8 s of clip, ~215 spoken words.

**Beat 1 - vProgs (D1)**

🗣️ `[COVER]` Now, what is coming. vProgs. Apps that live on Kaspa's own Layer 1 and talk to each other directly, no rollup in between. It is under construction, the runtime is still evolving, and there is no public ship date.
🎬 `[SHOW]` D1, a LIGHT system-design container, pushes in from the left (`kt-push-slide`, `swoosh-4`): the Kaspa L1 box with three app nodes inside it, arrows between the apps lighting ON "talk to each other", no rollup box anywhere, a hatched "UNDER CONSTRUCTION" tag on the frame. `kt-keyword-pop` "UNDER CONSTRUCTION" ON "construction" (`knock-pop`).
💬 `[NOTE]` "vProgs" is said "vee-progs".
🔍 `[VERIFY]` kaspa.org/build (vProgs: "The shared-state application path is under construction"; "The vProgs runtime is an evolving source of patterns, not yet a stable external developer API"; "Full vProgs remain a future direction"); "apps that talk to each other" = Sutton's 2025-09-12 essay ("his application talks synchronously with other applications in the vProgs space"). No date airs (WARNING box 4). The community tracker's "a first vProg on testnet since Sep 24, 2026" is corroboration only and is NOT in the line.

**Beat 2 - DAGKnight and the blocks per second**

🗣️ `[COVER]` DAGKnight, the consensus upgrade that follows Toccata. Block times targeted at 25 to 40 milliseconds, that is 25 to 40 blocks a second. And 100 blocks a second is targeted for a 2027 hard fork.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto fast light-trail / particle b-roll (tech): 2 s flash of C15, the kaspa.org/lore paragraphs ("DAGKnight is the consensus protocol upgrade that follows Toccata", "Targeted for a 2027 hardfork"), as a PAPER `kt-side-panel` right (`whoosh-4`), the two sentences highlighted, real pixels. `kt-word-by-word` at the lower third: "10 NOW" / "25 TO 40 NEXT" (silent), then the payoff "100" big in the accent ON "100" (`cash-register-2`); the PEAK 3 DROP lands on it.
🔍 `[VERIFY]` kaspa.org/lore verbatim: "Block times are targeted for the 40-25 millisecond range" (= 25 to 40 BPS, computed) and "10 millisecond block time - 100 blocks per second ... Targeted for a 2027 hardfork"; KIP-2 status Proposed; no DAGKnight mainnet date published anywhere (DATA.md Pillar 3). "Targeted" is the word, never "will".

**Beat 3 - Kaspa Dollar**

🗣️ `[COVER]` A stablecoin, issued against KAS and settled on the base layer. Community funded, led by a core developer, Alexander Safstrom, the author of KIP-16. Goal, 5 million KAS, fundraiser closes January 1st, 2027, refunds if it misses, and if it hits, the roadmap targets mainnet that September. Here's the thing, it was around 9.5 percent funded in early November, so this one is on us.
🎬 `[SHOW]` C11, the kaspadollar.com fundraiser bar (476,511 of 5,000,000 KAS) and the /docs "closes on 1 January 2027" line, as a full-frame receipt pushed in from the top (`kt-push-slide`, `swoosh-4`), real pixels; `kt-keyword-pop` chip "5M KAS GOAL" ON "5 million" (`cartoon-accent`); C5 rung "JAN 1 2027 · KASPA DOLLAR CLOSES" lands as a 2 s PAPER `kt-side-panel` right (`whoosh-4`).
💬 `[NOTE]` Pronunciation: Safstrom = SAF-strum. "On us" is the community-we; drop the 9.5 percent line at GATE 1 if it reads as a downer (OPEN QUESTIONS 13); the persona wants the caveat as one line, and this is it.
🔍 `[VERIFY]` kaspadollar.com: "A stablecoin issued against KAS, settled on the Kaspa base layer, and funded by the people who use the network"; goal 5,000,000 KAS, raised 476,511 (9.5 percent) at 2026-11-03 [live-drift]; /docs: closes 1 January 2027, refunds if the goal is missed, led by Alexander Safstrom "a Kaspa core developer and the author of KIP-16", roadmap "September: Mainnet launch". WARNING box 4: community-funded, never "the Kaspa stablecoin" as official.

**Beat 4 - the founder on stage (CLIP-1, Convention 6)**

🗣️ `[COVER]` And the founder himself, Yonatan Sompolinsky, stood on stage at Mid-Chain 2026 on October 26th, and described where his research goes next.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) onto a lecture-hall / conference b-roll (calm): `kt-headline-over-broll` "THE FOUNDER, ON STAGE", `swoosh-3` ON the cut, `knock-pop` ON the pop. The spine pauses after "next."
🎞️ `[INSERT]` CLIP-1: Yonatan Sompolinsky, 10.8 s with his own voice (the short option, 22:26.3 to 22:37.1, ending on "automatic machine on chain."), the spine pauses after the set-up line; burned caption "Yonatan Sompolinsky, Kaspa founder · Mid-Chain 2026 research talk, October 26, 2026" at the BOTTOM (the lecture video carries no lower-third). Transition in and out (`hand:fade` 0.5 s), bed ducked -14 dB automatically.
👤 `[FACE]` That is research, not a shipped feature. And that is the founder of this network, 13 years after GHOST, still pushing the frontier.
🎬 `[SHOW]` `hand:fade` out of the clip onto the face. `kt-caption-highlight` phrases "THAT IS RESEARCH, NOT A SHIPPED FEATURE" (RESEARCH in the accent) / "THE FOUNDER OF THIS NETWORK" / "13 YEARS AFTER GHOST" (13 YEARS in the accent) / "STILL PUSHING THE FRONTIER" (FRONTIER in the accent). House captions OFF. The face holds straight into Beat 5, no cut.
💬 `[NOTE]` Mike never reads the clip's words ("if this then that engine on chain", "no need for intermediaries"); the set-up names the moment, the clip says it, the resume keeps it conditional (DATA.md CLIP-1 context check: "assume we implemented this" is a research hypothetical). If Mike rules CLIP-1 OUT, the set-up line becomes: "And the founder himself, Yonatan Sompolinsky, is researching an if-this-then-that engine on chain, conditional transactions with no broker and no intermediary." and the resume line stays. "13 years" = December 2013 to October 2026.
🔍 `[VERIFY]` Mid-Chain 2026, Ben-Gurion University of the Negev, 2026-10-26 (video description, youtube.com/watch?v=UOOOwTs5woQ); the paper "Opening the Strategic Pandora Box: Conditional Transaction Mechanisms", arXiv 2609.12197, submitted 2026-09-10 (Sompolinsky, Newman, Wang, Parkes). The capture script's Whisper check re-verifies the words.

**Beat 5 - the plug (mid-roll, Mike 2026-11-03)**

👤 `[FACE]` And before we look at the numbers, I do have a wonderful crypto group of like-minded people, who invest in assets like the ones I'm talking about and more. Click the link in the description to get involved in the best community ever.
🎬 `[SHOW]` The same face hold continues, conversational. `kt-caption-highlight` phrases "A WONDERFUL CRYPTO GROUP" / "LIKE-MINDED PEOPLE". `kt-lower-third-band` "LINK IN THE DESCRIPTION" ON "link" (`swoosh-4` 0.34 s before the band, `knock-pop` on it). No impact, no title card (longform-edited.md: never on a mid-roll plug). House captions OFF. `kt-whip-cut` (`swoosh-8`, the chapter whip) into CH5, landing on the fall into the quiet cut.
💬 `[NOTE]` Wording is Mike's own (the reset video, as recorded) plus the persona's community line. Community = his Discord. If CLIP-1 and its resume are ruled out, this line needs its own face cut-in. Which plug and whether the close keeps the same line: OPEN QUESTIONS 21.

> [!IMPORTANT]
> CH4 verify list:
> - vProgs status wording = kaspa.org/build verbatim; the "talk to each other" gloss = Sutton 2025-09-12. No date.
> - DAGKnight "follows Toccata", "40-25 millisecond range", 100 BPS "Targeted for a 2027 hardfork" = kaspa.org/lore verbatim; KIP-2 Proposed.
> - Kaspa Dollar: goal, raised (9.5 percent, LIVE-DRIFT), close date, lead, roadmap = kaspadollar.com + /docs (2026-11-03).
> - CLIP-1 source, window, caption and the "research, not shipped" framing = DATA.md section 6; the resume line is Mike's own claim about the clip.
> - Two face lines in this chapter (6 and 7 of 10), the second is the plug.

---

## CH5 - WHERE IT STANDS
**Register:** gear 1 to 2, CALM. Slower pace, Mike looking at the numbers with the viewer, every number said as it is. Real charts and explorer receipts carry it; push-slides only, no pops, one sparkle on the turn line. Not a caveat section: it is where it stands, and it ends turned back up.
**Title card:** OFF. **Music:** the bed drops to the track's QUIET material: `AEROPLANES_Oh_La_La_instrumental_0_23-4.wav` enters on the chapter whip, chained bar-aligned with `0_23-5.wav` under the charts and the Solana beat; the last pass ends on a cut's own RESOLVE under the turn line, and its ring-out is the breath before CH6's drop (see MUSIC-MOOD-PLAN).
**Budget:** ~115 s, ~289 spoken words at the slower pace.

**Beat 1 - the price (C13)**

🗣️ `[COVER]` Now, let's look at the numbers, as they are. KAS trades around 3.1 cents, a market cap around 862 million dollars, around 85 percent below the all-time high of July 2024. Around 20 million dollars a day in spot volume.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`) lands on C13, the real KAS/USD chart (CoinGecko max range or TradingView KASUSD), the July 31, 2024 high and the current price both visible, real pixels, never restyled; a slow push-in over the line. No pop.
🔍 `[VERIFY]` CoinGecko `/coins/kaspa` 2026-11-03 22:35:48 UTC: 0.03102 dollars, market cap 862.2 million, ATH 0.207411 on 2024-07-31, -85.04 percent from it, 24 h volume 20.04 million [ALL live-drift: re-pull on record day; the spoken "3.1 cents / 862 million / 85 percent / 20 million" move with it].

**Beat 2 - supply and the November cut (C2 state B)**

🗣️ `[COVER]` Around 96.8 percent of all KAS is already mined, around 912 million left to go. The November cut took the block reward from 2.06 to 1.94 KAS. That is around 1.68 million KAS a day of new supply, and at these prices, well under 1 percent of what trades in a day.
🎬 `[SHOW]` C2 state B pushes in from the top (`kt-push-slide`, `swoosh-4`): the LIGHT animated donut "96.8% MINED" filling, then the reward step "2.06 -> 1.94 KAS / BLOCK" and the bar "1.68M KAS A DAY" beside a "20M A DAY TRADED" bar so the ratio reads. Silent.
🔍 `[VERIFY]` api.kaspa.org coinsupply 2026-11-03 22:36 UTC: 27,791,772,921 of 28,704,035,605 = 96.82 percent, 912,262,684 left [live-drift]; halving: 2.06017223 to 1.94454365 KAS at 2026-11-04 13:55:55 UTC (PAST by recording, hence "took"); computed 1,680,086 KAS a day after the cut (-5.61 percent), around 52,100 dollars at 0.0310 = around 0.28 percent of the 20.0 million 24 h volume ("well under 1 percent"; never "55,000 against 10 million", WARNING box 5). The 4-year-vs-monthly mechanism was CH2's; not repeated.

**Beat 3 - the hash rate (C3)**

🗣️ `[COVER]` Hash rate, around 368 petahash. It fell around 70 percent from May of 2025 to July of 2026, and then it rose, 3 months in a row, through 3 reward cuts, up around 14 percent.
🎬 `[SHOW]` C3 pushes in from the left (`kt-push-slide`, `swoosh-4`): the LIGHT animated monthly-average curve May 2025 to November 2026 (PH/s), the fall drawn first in grey, the July to October rise drawn in the accent with the Aug / Sep / Oct reward-cut ticks; on record day, if November closes higher, say 4 months, 4 cuts and the new percent. Silent. Reference receipt for the capturer: explorer.kaspa.org or 2miners.com/kas-network-hashrate.
🔍 `[VERIFY]` api.kaspa.org/info/hashrate 368,072 TH/s = 368.1 PH/s at 22:36 UTC; monthly averages computed from /info/hashrate/history: 2025-05 1,055 to 2026-07 314 (-70 percent), then 317 / 335 / 357 / 361 (July to October +14 percent) [live-drift]. Never "up 6 percent in 4 days", never the 1,592 PH/s spike (WARNING box 5).

**Beat 4 - user transactions (C4)**

🗣️ `[COVER]` User transactions, flat, around 70,000 to 80,000 a day, since July.
🎬 `[SHOW]` C4 pushes in from the top (`kt-push-slide`, `swoosh-4`): the LIGHT animated daily line July to November 2026, flat in the 70 K to 80 K band, the band shaded. Silent.
🔍 `[VERIFY]` api.kaspa.org/transactions/count/<month>: regular (non-coinbase) October average 77,081 a day (median 75,669), July 76,891, August 86,440, September 108,898 (spike days), 2026-11-02 70,549 [live-drift]. "Flat around 70,000 to 80,000" is the DATA.md honest line.

**Beat 5 - holders per token and TVL (C17, C12)**

🗣️ `[COVER]` Of those 460 tokens, the typical one has 2 holders. 9 of them have more than 100. The new Nacho, 355. And total value locked on the 2 L2s, around 770,000 dollars. Under a million.
🎬 `[SHOW]` C17 pushes in from the left (`kt-push-slide`, `swoosh-4`): the LIGHT animated holder distribution across the 459 tokens (median 2, 276 at 2 or fewer, 9 above 100, top 437, NACHO 355 marked); then C12, the DefiLlama Igra and Kasplex chain pages, as a full-frame receipt pushed in from the top (`kt-push-slide`, `swoosh-4`), real pixels. Silent.
🔍 `[VERIFY]` kascov tokens.json 2026-11-03 22:44 UTC: median holders 2, 9 tokens above 100, NACHO's KCC-20 covenant 355 holders [live-drift; the capture-day figures air, never 194 / "only 8"]; DefiLlama chains 22:39 UTC: Igra 524,197 + Kasplex 245,860 = 770,057 dollars [live-drift]; Kaskad's 645,866 includes Robinhood Chain and is NOT the L2 TVL (WARNING box 5). "Those 460 tokens" refers back to CH3's count without restating a new number.

**Beat 6 - the Solana parallel (C22)**

🗣️ `[COVER]` So, are we late, or are we early? Look at Solana. January of 2021, 1 dollar and 51 cents. November of 2021, 259 dollars and 90 cents. Around 172x, in around 10 months.
🎬 `[SHOW]` C22, the real SOLUSDT monthly chart (TradingView, Binance feed, log scale), as a full-frame receipt pushed in from the top (`kt-push-slide`, `swoosh-4`), real pixels, never restyled; the January 2021 open and the November 2021 high marked by the capturer's cursor hover, nothing drawn over it.
🗣️ `[COVER]` Then it fell around 97 percent, to 8 dollars, by December of 2022, and everybody wrote it off. And from that low, around 37x, to around 295 dollars in January of 2025.
🎬 `[SHOW]` C22 continues: the capturer's hover on the December 2022 low and the January 2025 high. Silent.
🗣️ `[COVER]` Solana sits around a 55 billion dollar market cap as I record this. I am not saying Kaspa does that. I am saying that is what a written-off network CAN do.
🎬 `[SHOW]` 2 s flash of the CoinGecko Solana page header (market cap) as a PAPER `kt-side-panel` right (`whoosh-4`), real pixels; then back to C22.
🔍 `[VERIFY]` PROJECT-LOG addition 1 (2026-11-03 22:51 UTC): Binance SOLUSDT monthly klines 1.51 (January 2021 open), 259.90 (November 2021 high), 8.00 (December 2022 low), 295.83 (January 2025 high); computed around 172x in around 10 months (January 1 to the November 6, 2021 high), around -97 percent, around 37x; market cap around 55.1B [live-drift]. One source per number (WARNING box 6); the CoinGecko ATH / ATL are not mixed in. The main loop carries these rows into DATA.md at GATE 1.
💬 `[NOTE]` The rhetorical "are we late, or are we early?" is the ONE question of the video, on purpose: it is the skeptic's best point, answered head on (brief). Mike picks Solana or the Zcash / Monero parallel at GATE 1 (OPEN QUESTIONS 3; the Zcash line is written there). Never "Kaspa will".
👤 `[FACE]` The tools came first. The crowd has not arrived yet. And that gap, is exactly where I want to be standing.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-5`) to the face; the quiet cut's RESOLVE ending lands under this line. `kt-caption-highlight` phrases "THE TOOLS CAME FIRST" (TOOLS in the accent) / "THE CROWD HAS NOT ARRIVED YET" (YET in the accent) / "AND THAT GAP IS EXACTLY WHERE I WANT TO BE STANDING" (GAP in the accent); `kt-keyword-sparkle` on GAP, one burst (`ting`), the only device sound in this chapter besides the push-slides. House captions OFF. `kt-whip-cut` (`swoosh-8`, the chapter whip) into CH6, landing on the text wall and the DROP.
💬 `[NOTE]` INSPIRING LINE 4 of 5 (the turn; the brief's own framing: the tools came first, the crowd has not arrived, the gap is the opportunity). One face line in this chapter (8 of 10).

> [!IMPORTANT]
> CH5 verify list (EVERY number here is LIVE-DRIFT, snapshot 2026-11-03 22:24 to 22:46 UTC, re-pulled on record day and at render; the spoken figures move with the re-pull):
> - price 0.03102 · cap 862.2M · -85.04 percent from the 2024-07-31 ATH · 24 h volume 20.04M (CoinGecko).
> - 96.82 percent mined · 912.3M left (api.kaspa.org coinsupply) · the cut 2.06 to 1.94 KAS at 2026-11-04 (api.kaspa.org halving; PAST tense) · 1.68M KAS a day · around 0.28 percent of daily volume (computed).
> - 368 PH/s · monthly averages 1,055 (2025-05) to 314 (2026-07) to 357 (2026-10) (api.kaspa.org history, computed).
> - regular transactions around 70 K to 80 K a day (api.kaspa.org counts).
> - median 2 holders · 9 above 100 · NACHO 355 (kascov) · TVL 770,057 dollars (DefiLlama chains).
> - Solana 1.51 / 259.90 / 8.00 / 295.83 (Binance monthly) · cap around 55.1B (PROJECT-LOG addition 1; into DATA.md at GATE 1).
> - One face line in this chapter (8 of 10).

---

## CH6 - THE CLOSE
**Register:** gear 3, conviction. Declarative, no recap of the video, all upside conditional. Two face lines: inspiring line 5 and the CTA.
**Title card:** OFF. **Music:** the DROP back into the PEAK CUT `AEROPLANES_Oh_La_La_instrumental_0_31-1.wav` (31 s, aggression 99, cold_hot opening, HARD STOP ending) lands on the text wall's red word; RIGHT-ALIGNED so its hard stop lands on the last spoken word "later" (on the hard-out: on inspiring line 5's last word) (see MUSIC-MOOD-PLAN).
**Budget:** ~62 s, ~175 spoken words.

**Beat 1 - the hinge (the text wall) and the conviction**

🎬 `[SHOW]` `kt-text-wall`, ONCE in the video, 3.5 s, a COVER beat on the chapter whip: the black full-frame wall of the phrase "TOO LATE?" repeated in receding rows, letters pulsing filled to outlined, the wall tilting; it cuts in SILENT; 1.9 s in, the red headline "EARLY." punches in (`cash-register` ON the pop) and the peak cut DROPS on it; `swoosh-4` 0.1 s before the cut out. House captions OFF.
🗣️ `[COVER]` Here's where I land. Sound money, mined by anyone, owned by no one, and a base layer that just learned how to run apps.
🎬 `[SHOW]` The wall cuts out (`swoosh-4`) onto the KASPA COIN hero b-roll (greenish cyan, backwards-K, slow rotation): `kt-headline-over-broll` "MINED BY ANYONE / OWNED BY NO ONE", `swoosh-3` ON the cut, `twinkle` ON the pop.
🗣️ `[COVER]` And here's my long-term theory. I think Ethereum eventually takes the number 1 spot from Bitcoin, and when it does, a lot of Bitcoin maxis are going to go looking for a proof of work home.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto Bitcoin mining farm b-roll (rows of machines, slow move): `kt-statement-over-broll`, the block "MY THEORY: / ETHEREUM TAKES NUMBER 1 / BITCOIN MAXIS GO LOOKING / FOR A PROOF OF WORK HOME" (MY THEORY and PROOF OF WORK HOME in the accent), `whoosh-4` ON the cut, the hold silent. MY THEORY stays on screen for the whole hold, so it never reads as a stated fact.
🗣️ `[COVER]` I think they find Kaspa. Not all at once. A cascade: some move over, and a year later, more move over. And some of them could already be stacking it quietly.
🎬 `[SHOW]` `kt-push-slide` (silent) onto the KASPA COIN hero b-roll. `kt-keyword-pop` "A CASCADE" ON "cascade" (`twinkle`, positive). Nothing named on screen, no Bitcoin figure's face or logo.
💬 `[NOTE]` From Mike's short "Are Bitcoin Maxis Quietly Stacking Kaspa?" (youtube.com/shorts/VUD-V8GNXQw) and persona's long-term cascade. Mike's stated opinion, said as "I think" and "could"; NO price target, NO date. Naming Saylor or the Winklevoss twins: OPEN QUESTIONS 22, scripted without them.
🔍 `[VERIFY]` A theory, no fact to pull; CONTEXT for Mike: Bitcoin around 1.55T, Ethereum around 277B on 2026-11-03 (CoinGecko), so Ethereum sits at around 18 percent of Bitcoin. That is not aired.
👤 `[FACE]` Kaspa did not need a bull market to become real. It became real in the bear. And whatever comes next, this network is ready for it.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) to the face. `kt-caption-highlight` phrases "KASPA DID NOT NEED A BULL MARKET TO BECOME REAL" (REAL in the accent) / "IT BECAME REAL IN THE BEAR" (BEAR in the accent) / "WHATEVER COMES NEXT" / "THIS NETWORK IS READY FOR IT" (READY in the accent); `kt-keyword-sparkle` on READY, two bursts (`ting` each). House captions OFF.
💬 `[NOTE]` INSPIRING LINE 5 of 5, the strongest, the last content line before the CTA; on the HARD-OUT it is literally the last thing he says. "Sound money, mined by anyone, owned by no one" = the brief's sound-money framing + persona ("neutral layers nobody owns"); "a base layer that just learned how to run apps" = Toccata, said as a frame, no date repeated.

**Beat 2 - the community line (Mike's addition 2)**

🗣️ `[COVER]` And the Kaspa community is as dedicated as the XRP army, and I mean that as the highest compliment in this space. Hardcore, patient, and still here.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto crowd / community b-roll (a packed meetup, hands up, calm cut): `kt-stacked-list-over-broll` headline "THE KASPA COMMUNITY" ON "community" (`wooden-rattle-whoosh`); items "HARDCORE" / "PATIENT" / "STILL HERE" ON their words (`fast-reverse-5` each).
💬 `[NOTE]` Mike's read of the community, an opinion, no holder or follower number (none sourced). Respectful: the XRP army is the benchmark, never a dunk. Wording B is in OPEN QUESTIONS 4: "The XRP army is the benchmark for dedication in this space. The Kaspa community is right there with them. Hardcore, patient, and still here."

**Beat 3 - the CTA**

👤 `[FACE]` So if you want to be around people who stack with real conviction, click the link in the description to get involved in the best community ever. Comment below, how bullish are you on Kaspa. Click that like button and click the subscribe button, and I'm gonna catch you guys, later.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-5`) to the face. `kt-caption-highlight` phrases: "CLICK THE LINK IN THE DESCRIPTION" (LINK in the accent) / "THE BEST COMMUNITY EVER" (COMMUNITY in the accent) / "COMMENT BELOW" as the two-colour pop (`typing`) / "HOW BULLISH ARE YOU ON KASPA" (BULLISH in the accent). The DISCORD LOGO sticker (`kt-icon-pop`, image_sticker) cuts in beside the head on "description", no sound of its own. ON "like button" `kt-subscribe-close` variant `bar` rises onto the chest (its own `subscribe-bar-clicks` track: the like click, then the SUBSCRIBE click on "subscribe button"), drops away before "later". The peak cut's HARD STOP lands ON "later"; the video ends on that word, no held still, no end card, no logo bug; the community link lives in the description.
💬 `[NOTE]` HARD-OUT alternative (Mike's call, OPEN QUESTIONS 7): the take ends on Beat 1's "ready for it", the edit cuts to black on the peak cut's HARD STOP on "it", no CTA, no bar, no community line on camera (Beat 2 stays as cover before it), and the description carries the link. Persona wording is binding: "click the link in the description to get involved in the best community ever", "click that like button and click the subscribe button" (never "smash"), the sign-off exactly "I'm gonna catch you guys, later."

> [!IMPORTANT]
> CH6 verify list:
> - "Sound money, mined by anyone, owned by no one" = the fair-launch sources (DATA.md T1) + "Every single KAS is mined ... in a highly competitive environment" (wiki tokenomics) + persona core thesis (neutral layers nobody owns); no number.
> - "a base layer that just learned how to run apps" = Toccata (DATA.md T3), said as a frame.
> - The community line carries no figure by design (Mike's addition 2).
> - Two face lines in this chapter (9 and 10 of 10). Do not ad-lib another to camera.

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover. Mike rules each row at GATE 1. The three candidates below are DATA.md section 6; the KOL videos in the brief are excluded by rule._

| id | Who / what plays (verbatim words) | Source + timecodes | Length | Lands (chapter / beat, after which set-up line) | Burned caption | Status |
|---|---|---|---|---|---|---|
| CLIP-1 | Yonatan Sompolinsky, Kaspa founder, Mid-Chain 2026 research talk: "So assume we implemented this. We have now an if this then that engine on chain. You no longer need smart brokers. You can delegate your portfolio handling to an automatic machine on chain." (the short option; the full 18.9 s adds "No need for intermediaries or third-party networks." with a small "um ... or or" at 22:39 to 22:43) | https://www.youtube.com/watch?v=UOOOwTs5woQ 22:26.3-22:37.1 | 10.8 s | CH4 Beat 4, after "...and described where his research goes next." | Yonatan Sompolinsky, Kaspa founder · Mid-Chain 2026 research talk, October 26, 2026 | PROPOSED |
| CLIP-2 | The Oxford Union host introducing him: "a computer scientist and blockchain researcher known for his work on scalable cryptocurrency protocols. He's one of the founders and leading researchers at Kaspa as well as a research associate at Harvard University." | https://www.youtube.com/watch?v=VIZGKoIaGR0 0:09.9-0:22.3 | 12.4 s | CH2 Beat 3, optional, before "That is 8 years of published research..." (the set-up would be: "And here is how the Oxford Union introduced him in 2026.") | Oxford Union, April 2026, introducing Yonatan Sompolinsky | HELD (credential colour only, not the founder's own voice; 12 s is a lot of runtime in an energetic cut; Mike's call) |
| CLIP-3 | Yonatan Sompolinsky on the fair launch (a KOL re-cut of a Bitcoin Takeover interview): "around the third quarter of '21 I told the investors that I don't see how Proof of Work is compatible with Fair Launch..." | https://www.youtube.com/watch?v=aZzEr5pAaX8 6:16.4-6:48.3 (primary: the full live interview, window not timed) | 31.9 s | none | none | REJECTED (context-heavy and nuanced; cut short it reads as "the founder wanted to abandon the launch"; over the 4 to 15 s norm; the investor's name is unclear; a KOL re-cut as the source) |

## MUSIC-MOOD-PLAN

_ONE track, carved (Mike): `oh-la-la` (AEROPLANES, "Oh La La", Soundstripe 11249, 122 bpm, bar = 240 / 122 = 1.967 s; license code in the catalog). Master `AEROPLANES_Oh_La_La_instrumental_3_37-7.wav` (218 s): intro BUILD 0 to 24 s (mid) · PEAK 1 24 to 74 · MID BUILD 74 to 86 · PEAK 2 86 to 150 · MID BUILD 150 to 164 · PEAK 3 164 to 208 · OUTRO 208 to 218 (fade). Section cuts: `0_15-3` / `0_15-6` (16 s, peak, hard_stop), `0_23-4` / `0_23-5` (24 s, MID bed, mean -19.6 / -19.1 dB, steady opening, RESOLVE ending), `0_31-1` / `0_31-2` (31 s, peak, aggression 99, cold_hot, HARD STOP). The master's own ending is a FADE, so the ends-big closer is a 0_31 cut's hard stop. One bed from frame 0 to the last frame, ducked under the VO, the pops and CLIP-1. The chapter times below are the script's estimates; the `music-placement-strategist` measures the file per bar and lands every in-point, loop and right-alignment on the FINAL spine._

| Chapter | Mood + gear | Subtle / aggressive | Bed / carve (which section of the file plays, how it is extended or right-aligned) | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 THE HOOK (0:00-0:36) | peak EDM, gear 3 | aggressive, present on word one | **Bed A starts at frame 0** (the ONLY bed of the video): the master enters INSIDE its intro build on a bar line around file 12 to 14 s (env 5 to 7, under the locked line and the fair-launch list) so the FIRST DROP (file 24 s, the start of PEAK 1) is pinned to the title pop "BULLISH ON KASPA" on "2026"; PEAK 1 (24 to 74 s) runs on under the handoff and the chapter whip | `oh-la-la` (Mike's pick, `fresh` in the ledger; no second track) |
| CH2 WHAT IT IS (0:36-1:43) | explainer, gear 2 rising to 3 | subtle under the diagram, aggressive at the close | same file: PEAK 1 runs its first bars under "here's what Kaspa actually is"; on the bar line before the C1 push-in, a splice to the MID BUILD 74 to 86 s (the chorus-thinning plateau, env 6), extended by a bar-aligned remix loop (4 bars, around 7.9 s a pass, as many passes as the diagram and C2 need); the PEAK 2 DROP (file 86 s) pinned to "8 years" of inspiring line 2, so the chapter closes hot | `oh-la-la` master |
| CH3 WHAT JUST LAUNCHED (1:43-3:11) | rapid receipts, gear 3 | aggressive, the pops ride the drums | same file: PEAK 2 (86 to 150 s, 64 s) under the whole chapter, RIGHT-ALIGNED so its LAST bar (file 150 s) sits under inspiring line 3 "all of it shipped" and the thinning at 150 is the breath into CH4; if the recorded chapter runs past 64 s, an 8-bar repeat INSIDE the peak (a jump back on a bar line, never a file restart) | `oh-la-la` master |
| CH4 WHAT IS COMING (3:11-4:24) | forward, gear 3 | aggressive, thinner under the clip | same file: the MID BUILD 150 to 164 s (the rise, env 5 to 6) under vProgs and DAGKnight, looped 4 bars as needed; the PEAK 3 DROP (file 164 s) pinned to "100" of "100 blocks a second"; PEAK 3 (164 to 208 s) under Kaspa Dollar and the set-up line; the automatic -14 dB duck under CLIP-1 (0.3 s ramps); the file's own thinning into the 208 s outro under the resume face line, so the fall into CH5 is the arrangement's | `oh-la-la` master |
| CH5 WHERE IT STANDS (4:24-6:19) | calm, gear 1 to 2 | SUBTLE: the quiet material, no pops | same file's QUIET CUTS: `AEROPLANES_Oh_La_La_instrumental_0_23-4.wav` (24 s, mid bed, steady opening) enters on the chapter whip; extended by a bar-aligned CHAIN alternating `0_23-4` and `0_23-5` (their steady bodies, around 5 passes for the 115 s chapter, each join on a bar line, the cuts' own endings skipped until the last pass); the LAST pass plays a cut's own RESOLVE ending under inspiring line 4 "where I want to be standing", and its ring-out is the breath before CH6's drop (a fresh beat grid starts after it) | `oh-la-la` section cuts `0_23-4` / `0_23-5` |
| CH6 THE CLOSE (6:19-7:05) | peak, gear 3 | aggressive into the close, hard stop on the last word | same file: the DROP back into the PEAK CUT `AEROPLANES_Oh_La_La_instrumental_0_31-1.wav` (31 s, aggression 99, cold_hot) lands on the text wall's red word "EARLY"; the cut is RIGHT-ALIGNED so its HARD STOP lands ON the last spoken word "later" (hard-out: on "it" of inspiring line 5); if the close runs past 31 s, `0_15-3` (16 s, peak, hard_stop) is the lead-in on a bar line and `0_31-1` closes; the video ends on the stop, no ring under black | `oh-la-la` section cuts `0_31-1` (closer), `0_15-3` (lead-in if needed) |

The first column is `CHn TITLE` as in the chapter heading (a time range follows); the `Bed / carve` column says WHICH SECTION of the file plays and how it is extended (a bar-aligned repeat or chain) or right-aligned (a drop on a word, a hard stop on the last word), never a bare "continues" (Mike, 2026-10-28; `lint_screenplay.py` rule 16). A new BED is a new TRACK (and a card, Convention 2); another section of the same track is a carve, not a bed change, so this video has one bed and no cards. Exact carving (bar lines by onset scoring, in-points, loop points, dB under VO, the duck under CLIP-1, breaths) is the `music-placement-strategist`'s job after the spine exists (`skills/music/music.md` section ONE TRACK, CARVED); the listening copy at GATE plan is `mix_music.py --plan-preview`. No `epic_hit`-ending track is reserved: the closer is this file's own 0_31 hard stop.

## VISUAL-PLAN

### Chapter themes (Convention 4b: ONE bed, so ONE look for the whole video)

💬 `[NOTE]` CONTAINER THEME = LIGHT for this video (`--container-theme light`): C1, D1 and the animated charts (C2, C3, C4, C5, C17) use `container-canonical-light.css` (warm off-white, near-black text, the accent darkened for contrast). The kinetic-text devices keep their own looks (dark band and dark panel beside the face, crumpled paper for the paper panels, black for the text wall).

| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 to CH6 | Kaspa greenish cyan (default hex #49EACB, the kaspa.org brand teal; Mike extracted the exact hex on 2026-08-28, OPEN QUESTIONS 8) | clean 3D render, greenish-cyan rim light on deep charcoal; every Kaspa coin shows the backwards-K logo in greenish cyan, never gold; Envato video for the mining farm, the code timelapse, the padlock / server room, the data centre, the lecture hall, the crowd | one track, one look; the chapters differ by DEVICE density (CH3 the busiest, CH5 almost none), not by colour. Red appears exactly twice: "FINAL" (CH3) and "EARLY." (CH6) |

- **The open (CH1 Beat 1):** frame 0 is Mike; the first `kt-caption-highlight` phrase "I AM MORE BULLISH ON KASPA" stretch-squashes into place on `swoosh-4`; no title card anywhere in the video.
- **The title pop (CH1 Beat 3):** "BULLISH ON" over "KASPA" as the caption's two-colour pop (`wooden-rattle-whoosh`), KASPA in the accent, the KASPA COIN sticker beside the head; the thumbnail text is Mike's call (OPEN QUESTIONS 1).
- **C1, THE diagram (CH2 Beat 1, Type 2 system-design, LIGHT, 3 states):** A = a single chain with two blocks found together, one greyed and dropped ("THROWN AWAY", the one `minecraft-damage`); B = Kaspa's parallel blocks in a DAG with GhostDAG's ordering arrow lighting in the accent; C = the 10-blocks-a-second counter. Labels trace to DATA.md Pillar 1 only (kaspa.org/lore, eprint 2018/104).
- **C2, the emission (Type 1 animated, LIGHT, 2 states):** state A in CH2 (the smooth monthly curve beside a 4-year staircase, cap 28.7B); state B in CH5 (the 96.8% donut, the reward step 2.06 -> 1.94, the 1.68M-a-day bar against the 20M-a-day-traded bar). Every figure from api.kaspa.org / wiki tokenomics / coinbase.rs; live-drift rows re-pulled.
- **C5, the receipts timeline (CH3, Type 1 animated, LIGHT):** the spine of CH3, rungs landing one at a time as spoken: Mar 19 Igra · Jun 30 Toccata · Jul 2 smart coins · Sep 9 Silverscript 1.0 · Sep 20 indexer exploit · Oct 21 KCC Final · Oct 30 Nacho opens; the later rungs (Nov 4 reward cut, Jan 1 2027 Kaspa Dollar close, Jan 31 2027 Nacho close, 2027 100 BPS target) sit greyed at the right and light only where CH4 / CH5 name them. Dates = DATA.md Pillar 5 table.
- **D1, the vProgs container (CH4 Beat 1, Type 2 system-design, LIGHT, NEW: not in DATA.md's index, added here):** the Kaspa L1 box with three app nodes inside it and arrows between them, no rollup box, an "UNDER CONSTRUCTION" hatch; wording from kaspa.org/build and Sutton's 2025-09-12 essay; no date, no number.
- **C3 / C4 / C17 (CH5, Type 1 animated, LIGHT):** the hash-rate monthly curve with the fall in grey and the four-month rise in the accent plus the reward-cut ticks; the flat daily user-transactions line with the 70 K to 80 K band shaded; the holder distribution across the 459 tokens (median 2, 276 at 2 or fewer, 9 above 100, top 437, NACHO 355). All live-drift, re-pulled before build.
- **Real-site receipts (never restyled):** C21 kaspa.org hero (CH1) · C19 the Ethereum whitepaper GHOST paragraph and C16 the arXiv title block (CH2) · C6 rusty-kaspa v2.0.0, C8 Silverscript v1.0.0, C7 the @kccforum post, C9 kascov tokens page (full-frame scroll), C10 the Nacho migration post ("reported"; swap to Nacho's own post if it resolves), C20 Kaskad hero, C14 the explorer stats header (CH3) · C15 kaspa.org/lore paragraphs, C11 the kaspadollar.com fundraiser bar + /docs close date (CH4) · C13 the KAS/USD chart from the July 2024 high, C12 DefiLlama Igra + Kasplex, **C22 the SOLUSDT monthly chart (TradingView, Binance feed, log scale; NEW, added here; the four marked points = PROJECT-LOG addition 1, into DATA.md at GATE 1)** and the CoinGecko Solana header (CH5). Real market data is always a real-site receipt; never an AI image as the source of a number.
- **The text wall (CH6 Beat 1, `kt-text-wall`, once):** "TOO LATE?" repeated, the red headline "EARLY." on the drop into the peak cut; it answers the skeptic's question CH5 asked.
- **Icons / stickers (a per-video choice, Mike rules at GATE 1, OPEN QUESTIONS 8):** PICKAXE (CH1, fair launch / mining; flat SVG in the accent, `swoosh-1`) · KASPA COIN sticker (CH1 title pop and CH6 hero b-roll; greenish cyan, backwards-K, never gold; cuts in with its footage) · SHIELD-CHECK (CH3, consensus checks the tokens; flat SVG, `swoosh-2`) · DISCORD LOGO sticker (CH6 CTA; the real mark, cuts in with the face). Four, small; CH5 carries none.
- **The close:** `kt-subscribe-close` variant `bar` on the chest with its own click track, the Discord sticker beside the head, the video ending ON "later" with the peak cut's hard stop; no end card, no logo bug; the community link lives in the description.

## OPEN QUESTIONS / NEXT SESSION

1. **Title and thumbnail text.** Scripted working title "Bullish on Kaspa"; alternates: "Why I Am More Bullish on Kaspa Than Ever" · "Kaspa Just Came Online. Here Is Everything That Shipped" · "Are We Late on Kaspa? No. Here Is Why." Thumbnail text: "BULLISH" / "BULLISH ON KASPA" / "ARE WE EARLY?" (photoreal single focus, green eyes, greenish-cyan backwards-K coin).
2. **The inspiring lines, one by one (a deliverable; 5 scripted, each tagged 💬 INSPIRING LINE n in its beat):** IL-1 CH1 "Nobody was handed Kaspa. You earned it with a machine, or you bought it from somebody who did." · IL-2 CH2 "That is nearly 8 years of published research before the first block on mainnet was ever mined." · IL-3 CH3 "No company owns this network, nobody had to ask permission, and all of it shipped." · IL-4 CH5 "The tools came first. The crowd has not arrived yet. And that gap, is exactly where I want to be standing." · IL-5 CH6 "Kaspa did not need a bull market to become real. It became real in the bear. And whatever comes next, this network is ready for it." **Three spares:** S-1 "Every coin on this network was paid for in electricity, not in promises." · S-2 "Bitcoin proved that sound money can be mined. Kaspa is proving it can be fast." · S-3 "The price went quiet for 2 years. The GitHub never did." (S-3 needs a verified commit-activity receipt before it airs; otherwise it stays a spare.)
3. **The Solana parallel vs the Zcash / Monero parallel (Mike picks; both written).** Scripted: Solana (CH5 Beat 6, Mike's addition 1). The Zcash alternate, verified from Kraken weekly candles (DATA.md Pillar 4): "Look at Zcash. 8 years under its 2018 high, and then, from its 2024 low to its 2026 high, around 100x." with C18 (the TradingView ZECUSD chart, started in 2019 because the early Kraken prints are bad ticks). Monero as a second sentence if wanted: "Monero, around 8x from its 2024 low." Solana can replace both; it is the stronger "written off" story.
4. **The community line (Mike's addition 2), two wordings:** A (scripted, CH6 Beat 2): "And the Kaspa community is as dedicated as the XRP army, and I mean that as the highest compliment in this space. Hardcore, patient, and still here." · B: "The XRP army is the benchmark for dedication in this space. The Kaspa community is right there with them. Hardcore, patient, and still here." Scripted as COVER; it becomes the tenth FACE if Mike wants it on camera (question 10).
5. **Clip inserts.** CLIP-1 (the founder, 10.8 s short option) PROPOSED in CH4 Beat 4: in or out? If out, the written fallback set-up line is in that beat's 💬 note. CLIP-2 (the Oxford Union intro, 12.4 s) HELD: in CH2 before IL-2 only on Mike's say-so. CLIP-3 REJECTED. "NONE" stays a valid outcome for an all-Mike energetic cut.
6. **The hook device.** Scripted: the "BULLISH ON / KASPA" title pop on "2026, is the year it all came online." Alternate: the title pop on the locked first line itself ("I am more bullish on Kaspa..."), with the 2026 line as a plain caption.
7. **CTA close vs HARD-OUT.** Scripted: the persona CTA with the subscribe bar, ending on "later" with the hard stop. Hard-out: the take ends on IL-5's "ready for it", black on the hard stop, the link in the description.
8. **Accent hex and the icon / sticker set.** Default #49EACB (the kaspa.org brand teal) until Mike gives the hex he extracted on 2026-08-28 (persona: "greenish cyan"). Icons: PICKAXE, KASPA COIN sticker, SHIELD-CHECK, DISCORD LOGO. Yes, no, or fewer.
9. **The handoff line (CH1 close).** Scripted: "So, let's take this from the top." (proposed, never used). Alternates: "So, let's walk through all of this." (proposed) · "So, let me show you how we got here." (proposed) · "So, let's go through it, piece by piece." (approved, last used 2026-10-06).
10. **Face count.** 10 of 10 scripted, the plug took the last slot (Mike 2026-11-03). Putting anything else on camera now needs a higher max, for example the community line (CH6 Beat 2) on camera with its "THE KASPA COMMUNITY" stack beside the head instead of over crowd b-roll.
11. **The live 🔍 VERIFY checklist (the accuracy pass; re-pull on record day and again at render; every spoken figure moves with the re-pull):** price · market cap · percent from the ATH · 24 h volume (CoinGecko) · circulating / percent mined / left to mine (api.kaspa.org coinsupply) · the reward after the November 4 cut and the daily emission (api.kaspa.org blockreward; PAST tense) · hash rate and the monthly averages through November (api.kaspa.org hashrate history) · regular transactions a day (api.kaspa.org counts) · total transactions (2.5 billion may land: then "crossed") · addresses with at least 1 KAS · KCC-20 token count, median holders, tokens above 100, NACHO holders (kascov) · TVL Igra + Kasplex (DefiLlama) · the Kaspa Dollar bar (kaspadollar.com) · the Nacho dates on Nacho's own channel (swap C10) · Solana's current market cap and Kaspa's (CoinGecko) · the four Solana prices confirmed into DATA.md (main loop). Not drifting: every date in CH1 to CH4.
12. **The rewatch line (CH2 Beat 1).** RESOLVED, Mike 2026-11-03: dropped. 10 blocks a second is not complex, so the line would wrongly imply it is.
13. **The one caveat line in CH4 ("it was around 9.5 percent funded in early November, so this one is on us").** Keep as scripted, or cut to "and this one is on us."
14. **Runtime.** Around 7:20 to 7:35 spoken plus the clip, earned by around 45 distinct dated facts said once; under the 8:00 ceiling. If Mike wants it nearer 5:00 the trim-first candidates (each a whole distinct fact, never a restatement) are: CH5 Beat 4 (user transactions), CH3 Beat 2's Silverscript line-count sentence, CH4 Beat 3's roadmap sentence.
15. **The Kasplex launch date** is not aired (secondary only); Kasplex now gets its own lines (Mike 2026-11-03), still with no date, because the sources conflict. The 5,700 TPS persona line stays out unless Mike wants his own stated figure in, flagged.
16. **ACCURACY PASS: the transaction story (the biggest judgment call).** 90 percent of the regular transactions came in 6 burst months (1.677B of 2.198B in March to June 2026 alone; cause not established, a secondary source blamed one spam address for September 2025), and "flat ... since July" starts right after that burst (August and September also sit above the band). The numbers as scripted are right, but a viewer who checks will see it. Options for CH3 Beat 6 and CH5 Beat 4: keep as scripted; or CH3 "more than 2.4 billion transactions, most of them in short bursts" and CH5 "around 77,000 a day in October, the same as July, after a burst this spring that ran into the millions a day" (C4 then starts earlier or goes log scale). Recommended: the second.
17. **ACCURACY PASS: say what the exploit touched?** Nothing spoken is false, but the exploited indexer was Kasplex's and NACHO was a drained token (supply 287B to 330B, "causing dilution" in Nacho's own words). Option: "And Nacho, the biggest meme token on Kaspa and one of the tokens hit, opened..." and, now that Kasplex has its own lines, "The second L2 is Kasplex, from the same team whose KRC-20 indexer was hit in September." Scripted without them. Recommended: at least the Nacho wording, because a holder watching will notice.
18. **ACCURACY PASS: "so this one is on us" (with question 13).** It nudges viewers toward a fundraiser whose contributors reportedly accept total loss of their contribution (the risk wording still needs confirming on kaspadollar.com/docs before it airs). Recommended: drop "so this one is on us".
19. **The text wall, 2-phrase variant (Mike's 2023 video 006, 0:33 to 0:37).** That wall alternates TWO phrases on black and white bands ("GROWTH MARKETING" / "GROWTH HACKING"), which fits this video's "TOO LATE?" / "EARLY." hinge in CH6 Beat 1 better than one phrase with a red word. Scripted: the existing `kt-text-wall`. Alternate: the 2-phrase bands (a catalog variant read from 006's MOGRT.aep and project).
20. **Optional: say what a DAG is (CH2 Beat 1, Mike 2026-11-03, undecided, NOT in the script yet).** Draft, after "GhostDAG puts them all in order": "That graph is called a DAG, a directed acyclic graph. Directed means every link points one way, each new block points back at the blocks before it. Acyclic means no loops, follow those links and you only ever reach older blocks. And graph means a web of connections, not a single line." Around 45 words, around 16 s, one extra C1 state. Source to add to DATA.md if kept: eprint 2018/104. The rewatch line stays dropped either way.
21. **The mid-roll plug (CH4 Beat 5, Mike 2026-11-03).** Scripted as the community plug; say if it is a different product. The close (CH6) repeats "click the link in the description to get involved in the best community ever". Options: keep both; or shorten the close to the like, subscribe and comment ask; or take the hard-out ending (OPEN QUESTIONS 7), which no longer costs the plug.
22. **Naming names in the cascade theory (CH6 Beat 1).** Mike's short names "the Michael Saylor types" and "the Winklevoss twins" as possibly stacking quietly, and nothing sourced shows either holds KAS. Scripted without names: "some of them could already be stacking it quietly." Alternate: "some of the biggest names in Bitcoin could already have their eye on it." Recommended: no names.
