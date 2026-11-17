# pieverse — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created 2026-11-11 by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "pieverse"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

**Working title:** What Is Pieverse? (Mike picks the final title and the thumbnail text at GATE 1.)
**Channel / track:** CryptoRich (Mike's main crypto channel), longform-edited (16:9), standard delivery (the FINAL is staged to the longform queue at the deliver stage; the YouTube upload is Mike's own). Project folder `video-creation/longform-edited/media/pieverse`.

**The commission (Mike, 2026-11-11, his words):** "lets do this first, how about you start of a new longform-edit project about a coin called pieverse here ... https://coinmarketcap.com/currencies/pieverse/ get up to making the screen play, and we can see how it works out." Plus his constraints for the video: "No whiteboarding for this video. No ChatGPT or Envato Elements B-roll. No background music. No receipts, no clips. Only two animated charts and one system design chart. The rest would be face scenes and screen share scenes, plus filled with lots of slide decks and slide deck containers." And: "no captions and no sound effects. A very simple video similar to a long-form presentation, but we'll do it inside of the long-form editor."

**This video is also the first live test of the new coin-research standard** (`video-creation/skills/coin-research/coin-research.md`, created 2026-11-11). The researcher follows it in full, including the PRODUCT TELEMETRY SWEEP, and the DATA.md shows its work (a checked-list beside every "NOT FOUND"). Mike will judge from this run whether the research needs further enhancement.

**SPELLING / IDENTITY:** the subject is **Pieverse**. Starting points to VERIFY, not facts: CoinGecko lists id `pieverse`, categories AI, AI Applications, BNB Chain Ecosystem, Ethereum Ecosystem, Binance Alpha Spotlight and TimeFi, homepage `https://www.pieverse.io/`, X account `@pieverse_io`, one contract address shared by its BNB Chain and Ethereum listings. The researcher confirms the exact project, token name, ticker, chains and contracts from the CoinMarketCap page (`https://coinmarketcap.com/currencies/pieverse/`), pieverse.io and its docs before anything else, and says plainly if the CoinMarketCap and CoinGecko pages describe different things.

**Archetype:** a plain, measured EXPLAINER of one coin, in the register of a presentation (Mike's longform-presentation videos), built in the longform-edited track: Mike finds out, on camera, what Pieverse is, what it does, how the token works and where it stands. Curious, experienced investor doing the homework, never a shill and never a skeptic for effect. The product is clarity: a viewer who has never heard of Pieverse leaves knowing what it is, who it is for, how the token works and what to watch. Simple, no hype gear, no production flourishes (no music, no sound effects, no captions).

**Register:** gear 2 (explainer) carries the video; gear 1 (off the cuff) on screen-share beats where Mike reacts to what is on his screen; gear 3 reserved for one or two landing lines (the verdict, the close).

**Pillars (each needs DATA.md facts with primary sources: pieverse.io and its docs / whitepaper, the team's own posts and announcements, the token contract and explorer pages, CoinMarketCap / CoinGecko for market data. The researcher says so if one cannot be sourced):**
1. **What Pieverse is.** Who builds it (named, dated), what the product does in plain words, which chains it runs on, what "TimeFi" and the AI angle mean here, stage of the product (live, testnet, announced), where the project's own descriptions disagree with each other or with the outside coverage.
2. **How it works.** The mechanism, told so a newcomer can follow it. This is the ONE system-design chart's job.
3. **What is real today: the product's own numbers.** Whatever the product publishes about its own usage (the PRODUCT TELEMETRY SWEEP of the coin-research skill: home page, `/stats`-style endpoints, dashboards, explorers, package and GitHub activity). A number found is shown; a number not published is said to be unpublished, with the checked-list in DATA.md.
4. **The token: supply, unlocks, price.** Total and circulating supply, allocation, vesting and the next unlock dates, listing history (the Binance Alpha Spotlight tag and any exchange listings with dates), all-time high and when, price, market cap, FDV, rank, volume (live-drift: 🔍 `[VERIFY]` + a timestamped snapshot). The two ANIMATED charts live here (the strategist picks the two most telling, for example price history and supply released over time, or market cap vs FDV; each from DATA.md numbers).
5. **Who is behind it and who backs it.** Team, investors and funding as sourced, partners only with a primary source (a pilot is a pilot, a member is a member).
6. **Risks and what to watch.** Concentration, unlocks, gap between product and token, anything the do-not-air list flags, as lines inside the chapters, not a fear section. A trigger to watch (a number whose next value changes the story), if the research finds one.
7. **The close.** Mike's read as a conclusion to the homework (not a call), one landing line, then the persona CTA (or a hard-out: Mike picks).

**Chapter map (Mike gave no runtime; the strategist proposes a runtime in OPEN QUESTIONS, default AROUND 5 MINUTES, the strategist may merge chapters, never pad):**
- CH1 THE OPEN. What Pieverse is in one breath and why Mike looked.
- CH2 WHAT IT IS AND HOW IT WORKS. Pillars 1 and 2 (the system-design chart).
- CH3 WHAT IS REAL TODAY. Pillar 3.
- CH4 THE TOKEN. Pillar 4 (the two animated charts).
- CH5 BACKERS, RISKS, WHAT TO WATCH. Pillars 5 and 6.
- CH6 THE CLOSE. Pillar 7.

**Open decisions for Mike at GATE 1:** the title and thumbnail text; the runtime; which beats are `[FACE]` and which are `[SCREENSHARE]` and what each screen share's body shows; whether chapters get title cards (Convention 2 ties a title card to a new music bed, and this video has no music, so the waiver is named in OPEN QUESTIONS if cards are wanted); the container theme (house dark is the default, no accent chosen); CTA close vs hard-out.

## Hard constraints (Mike)

- **Runtime: Mike gave none.** Propose one in OPEN QUESTIONS, default around 5 minutes (about 700 to 800 spoken words at his pace). Runtime is never a reason to cut a RECORDED line; it is a reason to write fewer lines. No redundancy, no padding, no "in this video" preamble.
- **WHAT IS OFF (Mike, 2026-11-11, all of it, every chapter):**
  - **NO whiteboard beats** (no `WB` rows, no `[SHOW]` whiteboard lines, no whiteboard share).
  - **NO ChatGPT images and NO Envato Elements b-roll** (launch flags `--envato-max 0 --chatgpt-max 0`).
  - **NO music, NO background bed.** The screenplay's `## MUSIC-MOOD-PLAN` section is still required by the format gate: write the heading and ONE line under it, "NONE, by Mike's call (2026-11-11): this video has no music", and no table rows. No bed, no carve, no track shortlist, no "Music:" bed lines in the chapter headers beyond "Music: none".
  - **NO sound effects.** No SFX cues anywhere in the script, no impact or riser notes.
  - **NO captions anywhere** (launch flag `--caption-scope none`): not on `[FACE]` beats, not on `[SCREENSHARE]` beats, not on covers.
  - **NO receipts** (no real-site screenshots or recordings: no news, explorer, GitHub, CoinMarketCap or pieverse.io captures) and **NO clip inserts**. Write `## CLIP-INSERTS` as NONE with the reason ("Mike's call, 2026-11-11"). DATA.md `## 6. Clip candidates` is therefore "none, by Mike's call; not searched".
- **VISUAL BUDGET (exact):** **TWO ANIMATED CHARTS** (code-rendered, real `useCurrentFrame` animation, numbers from DATA.md) and **ONE SYSTEM-DESIGN CHART** (code-rendered node-and-arrow diagram, Convention 4). No other chart or diagram. Everything else on screen is a **deck card / slide-deck container** (code-rendered CSS containers, one spotlighted point at a time, filling the frame) or a face scene. **Lots of deck containers**, in the spirit of Mike's longform-presentation videos. DATA.md's CHART-SOURCE INDEX therefore lists only code-built graphics (the 2 animated charts, the 1 system-design chart, and the deck cards); every number a chart shows is a DATA.md number.
- **FACE MODE = MIXED (`--face-mode mixed`, longform-edited.md house rule #1c; screenplay.md Convention 3).** TWO kinds of on-screen beat, tagged apart: 👤 `[FACE]` = the NORMAL gated full-screen face scene; 🖥️ `[SCREENSHARE]` = a screen-share face scene: Mike's webcam bottom-right, the CTA box top-right, the deck area (x 0 to 1464 of 1920) painted with content WE put there (a deck card, the system-design chart or an animated chart; never a whiteboard here). EVERY `[SCREENSHARE]` beat carries a 🎬 `[SHOW]` `BODY: ...` line beside it. Both kinds are ONE sentence (a tight pair allowed), the next spoken line an explicit `[COVER]`. Cap: `--face-max 8` for the two kinds together (propose a split, around 4 and 4, spread through the video). Normal faces for the direct-to-camera lines (the open, the verdict, the close); screen shares where Mike reacts to what is on his screen. **Recording note for Mike (write it in the screenplay header):** switch OBS scenes, the camera scene for `[FACE]` beats, the screen-share layout (webcam bottom-right, CTA top-right) for `[SCREENSHARE]` beats.
- **CONTAINERS:** the locked house stylesheet, dark theme, no accent (Mike chose none). Title cards at chapter starts are an OPEN QUESTION (see the brief); if the strategist proposes them it names the Convention 2 waiver, since there is no music bed to start.
- **RESEARCH = THE NEW STANDARD (`video-creation/skills/coin-research/coin-research.md`).** Cover its 12-row dossier and run its PRODUCT TELEMETRY SWEEP for Pieverse's product. Every "NOT FOUND" in DATA.md carries a checked-list (each URL / endpoint tried and its result, plus what was searched). Any "not public" claim in the screenplay is backed by that list. Save raw probe output (pages, JSON) under `media/pieverse/research/` (project folder, never the repo root). The DATA.md skeleton stays exactly the graph's required shape; put the telemetry findings under section 2 (Pillar facts) and the checked-lists inline in the rows.
- **CRYPTO CHANNEL RULES.** NO AI-pipeline detail of any kind on screen or in the script. Persona CTA wording: "click the link in the description to get involved in the best community ever", comments asked for, "click that like button and click the subscribe button" (never "smash"), the sign-off "I'm gonna catch you guys, later." A hard-out on the last word is the sanctioned alternative: write the CTA close and name the hard-out option in OPEN QUESTIONS.
- **PERSONA GUARDS (`persona/persona.json` wins on conflict).** A plain explainer, not a fear video and not a pump: verified-claims framing ("CAN", never "will"); no price targets; no fake-contrarian hooks; no self-deprecating calls; no whole-video spoiler lines; caveats as a line, never a section; no "honest" lead-ins; "around" never "about" before a number; numbers as digits; no em dashes; no dollar signs (write 1.2B); no day-relative words (every date absolute). Partners named only with a primary source. Never call out another creator.
- **Every number, date, name and quote comes from DATA.md** with a primary source; do-not-air numbers ride as WARNING boxes; live-drift figures (price, market cap, FDV, rank, volume, circulating supply, chart endpoints, product usage counters) carry 🔍 `[VERIFY]` and a timestamped snapshot, re-pulled at record time.
- Mandatory accuracy pass (`video-creation/skills/accuracy-pass/accuracy-pass.md`) on the screenplay before Mike records.
- Fable allowance: a Fable agent that dies on the limit is respawned on Opus automatically; never stall the run on the quota.

## Decisions

- **2026-11-11 — created.** Working title: (TBD). Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).

- **2026-11-14, spine (Mike).** Raw `2026-11-14 08-49-36.mkv` (1719 s) -> defumbled 842 s -> coarse 700 ms pad 0
  (354 s, Mike listened: content good) -> FINAL definition: **600 ms for the whole video, all chapters** plus
  **300 ms residual on COVER scenes only**, face scenes pad 0 and `--keep-face-pauses on`. Run as ONE pass
  (`--coarse-sil 0.6 --sil-pre 0.6 --sil-post 0.6 --pad-tail 0.15 --pad-head 0.15`), so the coarse spine IS the final
  spine (`ALL.c.desilenced.mp4`, 373.2 s, 73 cuts). The first try split the 300 ms as tail 0.3 / head 0 and clipped the
  "S" of "Stake" at source 678.8 s (a 60 ms island folded into silence); the 150/150 split keeps it. Parked runs live in
  `_previews/coarse-v1-700ms-pad0/` and `_previews/coarse-v2-600ms-pad-tail300-head0/`. `--enhance-speech on`: Mike runs
  Adobe Podcast Studio on `spine/pieverse FINAL.wav`. **A fresh thread must pass `--coarse-sil 0.6 --sil-pre 0.6
  --sil-post 0.6` again** (not persisted; otherwise desilence_final runs at 0.25/0.5 on the final spine).
- **2026-11-14, plan gate (rulings made by the orchestrator under Mike's blanket "take it through every gate, I don't
  need to check anything"; each is reversible and listed so Mike can overturn it).**
  1. "170 million": D23 keeps the card fix (prints the sourced ~170 thousand, never "170M"); the audio is untouched and
     the ruling on it (re-record / drop) stays Mike's. 2. D9 prints the re-pulled record-day read, not the spoken rounding.
  3. D16 dropped (no slot). 4. D21 shows the Upbit state only. 5. D25 (text-only plug card) approved. 6. End card runs
     under the CTA (364.56 to 373.24) with the small "Community link in the description" footer. 7. **D14 uses the
     bench: perps total across credible venues vs spot, NO single-venue Binance number (warning box 5)**. 8. The four
     unspoken lines on approved cards stay printed DIM, never spotlit. 9. C1/C2/C3/D9 built once at 1920x1080 and scaled.
     10. Card text follows the SCREENPLAY wording where the take misheard (2-of-3, the guide's words, GOVERNANCE).
     11. Record-day re-pull done by the data-researcher into DATA.md section 5a (backup `_previews/DATA.pre-recordday-2026-11-14.md`).
     12. CH3 face line: the take as kept (no swap, no re-cue).
  Music: `MUSIC-PLAN.json` is a deliberate NO-MUSIC plan (`no_music: true`); `music_plan` in `longform_graph.py` now accepts it
  when this log or CONSTRAINTS.md records the no-music ruling (the graph had no no-music branch; nothing else changed).
- **2026-11-14, delivered.** `pieverse-FINAL.mp4` at the project root (379.27 s, 1080p30, -20.6 LUFS, verify_final no
  problems; draft and final frame-checked by the orchestrator). The run was stopped ON PURPOSE at `definition_of_done`
  (no `yt-delivery.json`): NOT staged, NOT in `longs.json`, usage ledger not recorded. Open: Mike's final title (working
  "What Is Pieverse?") -> `yt-delivery.json` + the metadata block; "queue it" -> re-drive to run `stage_longform`.
- **2026-11-14, thumbnail LOCKED: take E** (`thumbnail/pieverse-thumb.png` + `pieverse-thumb-1920.jpg`). Mike rejected the
  real-webcam-frame takes; take E = his portrait from the only-18-months-left thumbnail (youtu.be/Ccriu5vuxf8) with the
  outfit changed to a navy bomber over a grey tee (Higgsfield nano_banana_pro, face unchanged), words STILL INSANELY /
  EARLY (his: "STILL Insanely Early"), the Pieverse mark and the real price line. Build notes: `thumbnail/README.md`.
- **2026-11-14, YouTube metadata handed to Mike** (his "give me the meta data"): `yt-delivery.json` + `YT-DELIVERY.md`,
  `YT-DELIVERY ok`. The TITLE is my pick, not his lock ("Pieverse Went From 12 Cents to $2: Here's What It Actually Is");
  he can swap it. Chapters come from the EDIT-PLAN headings (`yt_delivery.py` now reads them for a no-music plan); the four
  card stamps were checked on `pieverse-FINAL.mp4`. `yt-delivery.json` now EXISTS, so a graph re-drive would pass
  `definition_of_done` and `stage_longform` would QUEUE the video: do not re-drive until Mike says "queue it" (and carry
  the silence flags, see the spine entry).
- **2026-11-14 21:22, 30 s SHORT launched, full vertical SKIPPED** (Mike: "Skip the full vertical for conversion and go
  into the 30-second short"): `run.py short --project pieverse --seconds 30`, 16:9-sourced mode, queue id f16474 behind
  future-of-software-engineers' final render. My defaults, not his rulings: the short follows the video's NO music / NO
  sound effects ruling (no bed, no seam whoosh; `MUSIC-PLAN.json` `no_sfx: true`), it IS captioned end to end (the lane
  rule), and the brief keeps the strategist off the three lines where the voice says a wrong number (170 million voted,
  27 to 31%, 33 million a month until November 2028) and off the "click the link in the description" line. Two code fixes
  made first so the run could pass: `short_graph._comp_renders_without_captions` (a captions-OFF comp has no caption
  layer to switch off) and the no-music path in `mix_short.py`.
- **2026-11-14 22:51, 30 s SHORT DELIVERED: `pieverse-SHORT-30s.mp4`** (30.30 s, 27 MB, not queued). Four spans, 27.3 s +
  the 3 s outro: the hook face line (final 0.00-9.68), "you rent an agent by the month" over the rebuilt vertical C1
  diagram (62.44-64.20), "how many agents are actually running? Pieverse doesn't publish an agent count, a subscriber
  count, or revenue" on face then the rebuilt vertical D5 card (146.14-154.35), "my read" on face (358.66-366.33). None of
  the three wrong-number lines is in it. Voice + the shared CTA take only, -22.2 LUFS / peak -5.9 dBFS (the lane's last two
  shorts: -21.9 and -21.7). Lane gates PASS (verify_comp, verify_final, visual-qa on 2 cards and on 4 final sheets); I
  also read the frames myself (`_previews/short/_mycheck-*.jpg`).
- **2026-11-14 22:52, YT promo post started** (Mike: "when you are done with the short, go straight into the YT post",
  link https://youtu.be/7x2CVZQG6WQ, live title = `yt-delivery.json` title). `run.py ytpost --project pieverse --url ...
  --face thumbnail/takes/gen/gen-2.png --logo thumbnail/refs/pieverse-logo-coingecko.png`. **The face is MY call, not his
  ruling:** this project has no `*next-frame*` still, Mike rejected the real-frame thumbnails and locked take E, so the
  picture is take E's plate (his image from the only-18-months-left thumbnail with only the clothing changed), the one he
  approved for this video. yt-post.md says a real frame, never generated: swap with `--face thumbnail/fine/f1618.8-13.png
  --redo y_build` if he wants the letter of that rule.
- **2026-11-14 23:10, YT promo post QUEUED:** `yt-post-2026-11-14-pieverse-video` in `schedule-tweets/data/yt-posts.json`,
  `pending`, position 2 of 2, 10 slides (`yt-post/slides/01.png` to `10.png`); nothing posts until Mike's YT post run.
  visual-qa failed slide 7 in round 1 for "27 to 31% circulating" (the voice figure) and the lane revised it to the D19
  card's "27 to 40%"; round 2 PASS. No slide carries the 170 million line or the 33 million a month line.
- **2026-11-15, TITLE RULING (locked by publication):** Mike uploaded the video to YouTube as **"Pieverse Went From 12
  Cents to $2: Here's What It Actually Is"** (live, https://youtu.be/7x2CVZQG6WQ). That is the title everywhere:
  `publish-meta.json` and the longform queue entry carry it word for word (it replaces the working "What Is Pieverse?").
- **2026-11-15, "queue it" given** (Mike: "the project is now complete. you can add the longform video to the longform
  queue in the dashboard"): graph re-driven with the silence flags to run `definition_of_done` + `stage_longform`.
  **STAGED 2026-11-15 07:55:** `schedule-tweets/longform/pieverse/pieverse.mp4` + `pieverse.png` (take E), `longs.json`
  entry `lf-20261115-pieverse` (rumble / bitchute / facebook pending), usage ledger recorded, `_previews/` recycled.
  Nothing was re-rendered. **PROJECT COMPLETE (Mike's words above):** `PROJECT-COMPLETE.json` written; the cache cleanup
  ran and was BLOCKED by future-of-software-engineers (in progress), so nothing was deleted.

## Open flags (load-bearing)

- **Wrong spoken number (final spine 309.06-311.64):** "around 170 million tokens voted", DATA.md T12 says about 170
  thousand, and "under 0.02% of the supply" is only true for thousand. Mike rules: re-record, drop, or fix on the card.
- Record-day numbers as said: $1.78 and FDV $1.7B (script had $1.61 / $1.6B): card D9 and the last point of chart C2
  must match. D21 state 2 has no line (OKX and "no clear reason" lines cut at Mike's word).
- Locked lines changed on the take: CH1 hook adds "and it is one of my plays" and drops "over"; CH6 says "...and is
  priced way ahead of the numbers it publishes"; the close has no "catch you later" and ends on "...something similar."
- Heard differently from the script: "two or three signers" (268.16), "leveraged batched" (277.22), "the guy says"
  (299.38), "government" vs "governance" (108.88). Listen at the transcript review.
- **Record-day refresh (DATA.md section 5a, read 2026-11-14 18:27-19:10 UTC) found more voice-vs-fact mismatches. The cards
  print the sourced read; the audio is untouched; each is Mike's call (re-record or leave):**
  (a) D19, "only around 27 to 31% circulating": CoinGecko 27.5% and CoinMarketCap 30.0% still hold, but the project's own API
  stepped from 309.5M to 395.88M (39.6%) today at the scheduled unlock (no token moved on-chain), so the card reads 27 to 40.
  (b) C3, "around 33 million tokens unlock every month until November of 2028": the tracker's 33.4M a month runs 12 months
  (to 14 Oct 2027), then steps down (27.9M, 19.5M, 14.9M, 6.6M); the chart plots the tracker's own series, not a flat rate.
  (c) D9/C2 price: the take said 1.78 (CoinGecko print 1.7764 at 14:15 UTC, inside the recording), the live read by 18:27 UTC
  was 1.81; the cards print the recording-time 1.78 so picture and voice agree. FDV prints 1.78B (calc) against the spoken
  "1.7 billion". (d) Nothing moved on-chain on the unlock day (15 watched wallets, 0 transfers); never write "released".
  **RULED (Mike, 2026-11-14): "just leave the recording as is."** This covers the "170 million" line and (a) to (c) above and
  the CH3 take / dropped ad-libs: NO re-record, NO cut, NO audio change; the spine stays exactly as approved. The cards keep
  printing the sourced figures (never a number known to be wrong).
- Defumble kept the LAST take of the CH3 face line ("the numbers that matters the most"); the earlier take at
  source 11:24.5 is cleaner. Two plug ad-libs were dropped (source 13:43-14:20 bots sentence, 15:57-16:03 "10x / 30x");
  both restorable from the defumble spans file.
