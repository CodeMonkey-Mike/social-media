# pieverse - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by edit-plan-author 2026-11-14, refined from the graph's seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py) off
> AS-RECORDED.md + `spine/ALL.d.enhanced.medium-words.json` + COVER-PLAN.json (cover_beats, face_body, visible_windows) +
> MUSIC-PLAN.json + `spine/jumpcuts-final.json` + `assets/diagrams/_state-cues.md` + `assets/slide-sources/_state-cues.md` +
> `assets/charts/C2.spec.md` / `C3.spec.md` + PROJECT-LOG.md (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md`
> section 1; the comp is built TO this log, section 0 ORDER).
> Watch file: `spine/ALL.d.enhanced.mp4` (373.24 s / 6:13.2, 1080p30, the enhanced audio). Timecodes = FINAL-spine seconds,
> PRE-card-pause: the 4 silent title-card pauses (CH2 35.20, CH3 115.56, CH4 151.56, CH5 319.98, each >= 1 s) shift the final
> timeline via `sh()` at comp; no chain shift is ever re-applied here.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (reconciled 2026-11-14)
> and `reconcile_docs.py --apply` fans every pick into these rows.
> RULINGS THAT SHAPE THIS LOG (Mike 2026-11-11, PROJECT-LOG "Hard constraints"): NO music (MUSIC-PLAN `no_music: true`, 0 beds,
> 0 hard hits) · NO sound effects (every SFX row is `layer: none`; the 4 cards are silent) · NO captions (`caption_scope none`) ·
> NO receipts, NO clip inserts, NO whiteboard, NO Envato / ChatGPT b-roll. Visual budget held exactly: 1 system-design chart
> (C1), 2 animated charts (C2, C3), 21 deck cards, 4 title slides, 1 end card.
> FACE MODE = MIXED (house rule #1c): F1 / F4 / F7 / F8 = kind face (gated full-screen face, measured reframe); F2 / F3 / F5 / F6
> = SCREEN SHARE (OBS layout verbatim, webcam bottom-right + CTA top-right, the deck area x 0-1464 painted with face_body FB1-FB5,
> the 1920x1080 stage scaled 0.7625). Punch-ins / light leaks: NONE anywhere. `spine/jumpcuts-final.json` finds an interior join
> in no window (punch_points_total 0: every face-window join sits inside the 0.5 s edge margin), and a screen share never takes one.
> ZERO ORPHANS: every renderable file in `assets/` is PLACED below with a timecode or marked REJECTED / BENCH in the
> reconciliation at the end. Kinetic-text devices: none (SCREENPLAY.md names no device id).
> Card text follows the sourced read, never the voice, where they disagree (PROJECT-LOG open flags: D9 FDV, D19 range, C3 rate,
> D23 "170 million"); SAY lines quote the take as heard, Whisper mishears corrected per AS-RECORDED.

## CH1 - THE OPEN (0:00.0-0:35.2, card OFF, no bed)
```
0:00.0  [FACE] F1 opens ON face → 0:09.7 (0.000-9.689)  "Pieverse went from around 12 cents to $2 in under a year. And it is
        one of my plays, and I did the homework on exactly what it is."  [kind: face, the gated full-screen face]
        measured face reframe (assets/face-reframe.json at comp); no cut-in (the video opens here); no punch-in and no light
        leak: the window's only join 9.667 sits 0.02 s inside its out-edge (no punch point); captions OFF (caption_scope none)
0:00.0  SAY:  "Pieverse went from around 12 cents to $2 in under a year."
0:04.7  SAY:  "And it is one of my plays,"
0:06.6  SAY:  "and I did the homework on exactly what it is."
0:09.7  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s) (the face pick, silent)
0:09.7  [CONTAINER] D1 IN full frame, at rest: eyebrow THE SHORT VERSION, the home page line 'Web3 AI Agent for Line & Kakao',
        three pieces at rest ("is." spills to 9.72 under the entrance); one card, 9.5 s, spotlight moves (rules #1, #3)
0:09.8  SAY:  "The short version, Pieverse lets you rent an agent"
0:12.4  [CONTAINER] D1-s1 AI AGENT lit (12.36 "rent an agent")
0:13.2  SAY:  "that has its own crypto wallet,"
0:13.8  [CONTAINER] D1-s2 ITS OWN WALLET lit (13.80 "its own crypto wallet")
0:15.3  SAY:  "and you talk to it inside an app, like Line or Kakao."
0:16.5  [CONTAINER] D1-s3 INSIDE YOUR CHAT APP lit (16.48 "inside an app"), held to 19.189; LINE and Kakao named as chat apps,
        never drawn as partners
0:19.2  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick; a screen share takes the plain face pick, never a
        face-style cut-in, house rule #1c)
0:19.2  [FACE] F2 IN → 0:28.6 (19.189-28.555)  "And look at this. So at the time of this recording, the token is sitting at
        $1.78 with a fully diluted value of $1.7 billion."  [SCREEN SHARE: deck area painted per COVER-PLAN face_body]
        BODY FB1 19.19-24.96 container D9, the record-day snapshot (read 14 Nov 2026), states D9 (five rows at rest) then
        D9-s1 (read date) then D9-s2 (price) · BODY FB2 24.96-28.55 container D9, state D9-s3 (FDV lit). Spine at identity
        transform (no reframe), no punch-in, no light leak, no glitch, no captions inside a screen share
0:19.2  [CONTAINER] D9 IN in the deck area (FB1, x 0-1464, the 1920x1080 stage scaled 0.7625): five rows and the date at rest
0:19.2  SAY:  "And look at this."
0:20.2  SAY:  "So at the time of this recording,"
0:20.7  [CONTAINER] D9-s1 read date 14 NOV 2026 lit (deck area, FB1; 20.66 "at the time of this recording")
0:22.2  SAY:  "the token is sitting at $1.78"
0:22.8  [CONTAINER] D9-s2 price 1.78 lit (deck area, FB1; 22.84 "1.78"), the recording-time print (CoinGecko 1.7764 at
        14:15 UTC), never the later 1.81 `[VERIFY]`
0:25.0  [CONTAINER] D9 deck-area body FB2 begins (same card, no swap until the FDV word)
0:25.1  SAY:  "with a fully diluted value of $1.7 billion."
0:25.5  [CONTAINER] D9-s3 FDV 1.78B (calc, price x 1B) lit, the price row rests (deck area, FB2; 25.48 "fully diluted value");
        the card prints the read, not the spoken "1.7 billion" (PROJECT-LOG flag c) `[VERIFY]`
0:28.6  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s) (face pick; the D9 deck-area body grows to the full stage, one
        continuous appearance across the edge, house rule #1b)
0:28.6  [CONTAINER] D9-s3 continues FULL FRAME as the cover (FDV still lit under "That's a big number")
0:28.7  SAY:  "That's a big number,"
0:29.8  SAY:  "and I wanted to let you know what's all behind it."
0:32.6  [CONTAINER] D9-s4 all five lit together (32.62): price 1.78, market cap 488.1M, FDV 1.78B (calc), rank 99 (its own
        18:27 UTC read time printed), all-time high 2.23 on 9 Nov 2026; held to the CH2 card pause at 35.20 `[VERIFY]`
0:32.6  SAY:  "I'm gonna go through this piece by piece."
```

## CH2 - WHAT IT IS AND HOW IT WORKS (0:35.2-1:55.6, card ON "WHAT IT IS", no bed)
```
0:35.2  [CARD] CH2 "WHAT IT IS" · [TRANSITION] card presentation → rmn:flip (card, 0.40s) · [IMPACT] layer: none (silent card)
        title-CH2, plain house dark, Convention 2 waiver approved at GATE 1; edit-time pause >= 1 s in the 34.76-35.20
        word gap, zero spine time; NO sound effects on the card (Mike 2026-11-11)
0:35.2  [CONTAINER] D2 IN full frame after title-CH2, at rest: eyebrow WHAT PIEVERSE SAYS IT IS, three document slots
        LITEPAPER / WHITEPAPER / HOME PAGE, quotes not lit; one card held 24.4 s in 7 states, never prints '3 framings'
        before 56.96
0:35.2  SAY:  "Now, Pieverse didn't start as an AI agent project."
0:38.5  [CONTAINER] D2-s1 LITEPAPER lit: 'The Compliance & Payment Infrastructure for the Web3 Economy', invoices and receipts
        (38.46 "Its litepaper")
0:38.5  SAY:  "Its litepaper is about compliance and payments,"
0:41.3  SAY:  "invoices and receipts for crypto transactions,"
0:43.7  SAY:  "and that's where the TimeFi label comes from."
0:44.6  [CONTAINER] D2-s2 + the TimeFi tag lit gold (44.64 "TimeFi")
0:46.3  [CONTAINER] D2-s3 WHITEPAPER (10 Nov 2025) lit: 'Agent-Native, Compliant Payment Stack for Web3'; the litepaper rests
        (46.28 "Then the whitepaper")
0:46.3  SAY:  "Then the whitepaper from November of 2025"
0:49.1  SAY:  "calls it a payment stack for AI agents."
0:52.0  [CONTAINER] D2-s4 HOME PAGE lit: 'Web3 AI Agent for Line & Kakao' (51.96 "And the homepage"), the D1 quote echoed
        inside a different card, not a reused asset
0:52.0  SAY:  "And the homepage now leads with AI agents for Line and Kakao."
0:56.0  [CONTAINER] D2-s5 all three slots lit (56.04 "So that's"; a desilence join: may sit up to 0.3 s late)
0:56.0  SAY:  "So that's three framings in around 12 months."
0:57.0  [CONTAINER] D2-s6 + footer '3 framings, around 12 months' (56.96 "three framings"), held to 59.64
0:59.6  [DIAGRAM] C1 IN full frame on C1-overview: the ONE system-design chart, every node at rest (YOU IN A CHAT APP, → hand:xfade-scale (container-xfade, 0.35s)
        PURR-FECT CLAW AGENT, AGENT WALLET IN A TEE, ON-CHAIN ACTION, SKILL STORE above, the dashed AGENT-TO-AGENT PAYMENT
        branch, PIEVERSE TOKEN standing apart); shown whole ONCE for ~1.6 s, never again (THE BALANCE). Never dead still:
        a 1.00 to 1.03 push centred on the lit node over every hold (comp-build 7a). State swaps 0.3 s, shared pixels hold
        `[VERIFY plan prices 10 to 279]`
0:59.6  SAY:  "Here's how the product works."
1:01.1  SAY:  "You rent an agent by the month."
1:01.2  [DIAGRAM] C1-agent PURR-FECT CLAW lit, the rest dims to .30 (61.22 "rent an agent"); push toward (742, 581)
1:03.1  SAY:  "The product's called Purr-Fect Claw,"
1:05.9  SAY:  "and the plans run from $10 to $279 a month."
1:07.1  [DIAGRAM] C1-agent-price the pill '10 to 279 USD a month' goes hot (67.06 "$10")
1:10.3  [DIAGRAM] C1-agent-price HOLDS: the agent keeps its glow under "hosts it for you" (cover beat 70.34, no new state)
1:10.3  SAY:  "Pieverse hosts it for you and gives it its own wallet"
1:12.9  [DIAGRAM] C1-wallet AGENT WALLET lit, the agent steps down to ON, the agent-to-wallet wire lit (72.88 "its own
        wallet"); push toward (1178, 581)
1:13.8  SAY:  "with the keys locked inside secure hardware, called a TEE."
1:16.7  [DIAGRAM] C1-wallet-tee the IN A TEE chip goes hot (76.68 "called a TEE"; on-screen spelling TEE)
1:17.7  [CONTAINER] D17 IN full frame: 'Pieverse handles wallet creation, seed phrase custody, and setup.' (home page, → hand:xfade-scale (container-xfade, 0.35s)
        verbatim); C1 yields its time and returns in a NEW state (rule #13); a caveat as one line, never a section
1:17.7  SAY:  "One caveat, that means the keys sit inside"
1:19.6  [CONTAINER] D17-s1 'seed phrase custody' highlighted gold (79.56 "keys sit inside")
1:20.7  SAY:  "Pieverse's hardware, not with you."
1:22.4  [CONTAINER] D17-s2 + THE KEYS: NOT WITH YOU (82.36 "not with you"), held to 83.22
1:23.2  [DIAGRAM] C1 RETURNS on C1-chat: YOU, IN A CHAT APP lit (LINE, KakaoTalk); never the overview again (83.22 the cover → hand:xfade-scale (container-xfade, 0.35s)
        edge, a tight join: cue on the picture, not before 83.22); push toward (305, 581)
1:23.2  SAY:  "Then you message the agent inside of the chat app,"
1:26.6  SAY:  "something like swap this for that, and it does it on-chain."
1:27.4  [DIAGRAM] C1-chat-swap the bubble 'YOU: swap this for that' appears above the chat node (87.44 "swap")
1:28.5  [DIAGRAM] C1-path revealed over C1-chat-swap by a left-to-right linear mask, x 140 to 1800 over 88.50-89.10, so the
        arrows visibly RUN through agent and wallet and ON-CHAIN ACTION lights last at 89.10 ("it does it on-chain");
        fallback a 0.3 s blend at 89.10
1:30.2  [DIAGRAM] C1-path HOLDS (cover beat 90.20, nothing new until the store is named)
1:30.2  SAY:  "And you add abilities from a Skill Store,"
1:31.9  [DIAGRAM] C1-skills SKILL STORE lit, the path and bubble return to dim (91.88 "Skill Store"); push toward (742, 325)
1:32.9  SAY:  "kind of like installing apps on a phone."
1:33.5  [DIAGRAM] C1-skills-feed the store-to-agent feed wire lit, the agent ON (93.46 "installing"); no skill or merchant
        count on the diagram (guard 1)
1:35.1  [DIAGRAM] C1-skills-feed HOLDS (cover beat 95.14)
1:35.1  SAY:  "The bigger pitch is agents paying each other for services,"
1:36.3  [DIAGRAM] C1-a2a the dashed AGENT-TO-AGENT PAYMENT branch + node lit, its badge DOCUMENTED, DEFERRED gold-hot (96.32
        "agents paying each other"); drawn dashed, never a live path (guard 4); push toward (837, 870)
1:39.0  [CONTAINER] D4 IN full frame: the project's own words 'Live agent payments: deferred.' with the source tag llms.txt → hand:xfade-scale (container-xfade, 0.35s)
        `[VERIFY llms.txt still reads deferred]`
1:39.0  SAY:  "and that part is documented, but Pieverse's own files"
1:42.1  SAY:  "list live agent payments as deferred."
1:43.8  [CONTAINER] D4-s1 'deferred' highlighted gold, the marker cut to the word (103.78 "deferred"), held to 104.522
1:44.5  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.76s) (face pick; plain, a screen share)
1:44.5  [FACE] F3 IN → 1:48.7 (104.522-108.722)  "And look at where this token sits, right? It's off to the side, because the
        product docs never mention it."  [SCREEN SHARE: deck area painted per COVER-PLAN face_body]
        BODY FB3 104.52-108.72 diagram C1, state C1-token (PIEVERSE TOKEN lit, standing apart at the bottom right, no wire
        into it, the rest dim) then C1-token-tag; scaled 0.7625 into x 0-1464, optional push at most 1.02 on the token.
        Spine at identity, no punch-in, no light leak, no glitch, no captions
1:44.5  [DIAGRAM] C1-token in the deck area (FB3; "look" 104.72)
1:44.5  SAY:  "And look at where this token sits, right?"
1:46.2  SAY:  "It's off to the side,"
1:47.1  [DIAGRAM] C1-token-tag the gold tag NOT IN THE PRODUCT DOCS lands on the token node (deck area, FB3; 107.10
        "because"); prints no number `[VERIFY docs mention count still 0]`
1:47.1  SAY:  "because the product docs never mention it."
1:48.7  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s) (face pick)
1:48.7  [CONTAINER] D18 IN full frame, at rest: PIEVERSE TOKEN, per the whitepaper; GOVERNANCE / STAKING / FEE DISCOUNTS at
        rest, ACCESS printed dim (not spoken, never lit); card text is the whitepaper's, not the heard words
1:48.9  SAY:  "The whitepaper says that the tokens were governance,"
1:50.8  [CONTAINER] D18-s1 GOVERNANCE lit (110.80 "governance", heard "government's": confirm by ear)
1:51.6  [CONTAINER] D18-s2 STAKING lit (111.64 "staking")
1:51.6  SAY:  "staking and discount fees,"
1:52.1  [CONTAINER] D18-s3 FEE DISCOUNTS lit (112.08 "discount fees")
1:53.2  [CONTAINER] D18-s4 'Plans priced in USD' lit (113.24 "priced in US dollars"), held to the CH3 card pause at 115.56
1:53.2  SAY:  "and the plans themselves are priced in US dollars."
```

## CH3 - WHAT IS REAL (1:55.6-2:31.6, card ON "WHAT'S REAL", no bed)
```
1:55.6  [CARD] CH3 "WHAT'S REAL" · [TRANSITION] card presentation → rmn:flip (card, 0.40s) · [IMPACT] layer: none (silent card)
        title-CH3, the same card pick as CH2; edit-time pause >= 1 s in the 115.24-115.56 word gap, zero spine time
1:55.6  [CONTAINER] D5 IN full frame after title-CH3, both halves at rest: WHAT IT PUBLISHES (green header) left, NOT
        PUBLISHED (muted header, three rows at rest) right, footer laid out hidden; every D5 state shares D5-s4's card frame
1:55.6  SAY:  "So what does the product publish about its own usage?"
1:59.4  [CONTAINER] D5-s1 ONE COUNTER lit (119.42 "One counter")
1:59.4  SAY:  "One counter, the Skill Store lists around 74,000 skills"
2:02.0  [CONTAINER] D5-s2 74,195 skills lit (121.98 "74,000 skills"), read date printed `[VERIFY Skill Store counters]`
2:03.4  SAY:  "and around 25,000 merchants."
2:03.9  [CONTAINER] D5-s3 25,233 merchants lit (123.90), held to 125.74; no install total anywhere (guard 1)
2:05.7  [CONTAINER] D6 IN full frame, at rest: the Skill Store by source, BUILT IN printed dim (not spoken, never lit) → hand:xfade-scale (container-xfade, 0.35s)
2:05.7  SAY:  "Almost all of those skills are imported"
2:07.3  [CONTAINER] D6-s1 74,133 MIRRORED FROM CLAWHUB lit, a bar almost the whole width (127.32 "imported"); wording
        'mirrored', never 'fake' `[VERIFY]`
2:07.5  SAY:  "from an outside catalog called ClawHub,"
2:10.7  SAY:  "and 30 were published on Pieverse itself."
2:11.0  [CONTAINER] D6-s2 30 NATIVE lit (131.00 "30 were published")
2:13.7  SAY:  "And out of five skills that carry a price,"
2:14.4  [CONTAINER] D6-s3 5 PRICED lit, the rows above rest (134.38 "five skills that carry a price")
2:16.7  SAY:  "I count one paid install."
2:17.3  [CONTAINER] D6-s4 1 PAID INSTALL lit (137.26 "one paid install"), held to 139.222
2:19.2  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.76s) (the face pick; cut on the picture 139.222, "And" starts 0.06 s early)
2:19.2  [FACE] F4 IN → 2:25.2 (139.222-145.155)  "And what I couldn't find was the numbers that matters the most, right?
        How many agents are actually running?"  [kind: face, the gated full-screen face]
        measured face reframe; no punch-in and no light leak: the window's only join 145.0 sits 0.16 s inside its out-edge
        (no punch point); captions OFF (caption_scope none). The take as kept (plan-gate ruling 12)
2:19.2  SAY:  "And what I couldn't find was the numbers"
2:21.1  SAY:  "that matters the most, right?"
2:23.3  SAY:  "How many agents are actually running?"
2:25.2  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s) (face pick)
2:25.2  [CONTAINER] D5-s4 D5 RETURNS at the same size and position: the NOT PUBLISHED header lights gold (the half lands), the
        left half back to rest; a new state of the same card, not a repeat
2:25.5  SAY:  "Pieverse doesn't publish an agent count,"
2:26.7  [CONTAINER] D5-s5 AGENTS RUNNING lit (146.74 "an agent count")
2:27.4  SAY:  "a subscriber count, or revenue,"
2:27.6  [CONTAINER] D5-s6 PAYING SUBSCRIBERS lit (147.62 "a subscriber count")
2:28.7  [CONTAINER] D5-s7 REVENUE lit (148.70 "or revenue")
2:29.8  [CONTAINER] D5-s8 + footer 'At least not anywhere I checked.' (149.82), held to the CH4 card pause at 151.56; said
        narrowly, never 'no usage'
2:29.8  SAY:  "at least not anywhere I checked."
```

## CH4 - THE TOKEN (2:31.6-5:20.0, card ON "THE TOKEN", no bed)
```
2:31.6  [CARD] CH4 "THE TOKEN" · [TRANSITION] card presentation → rmn:flip (card, 0.40s) · [IMPACT] layer: none (silent card)
        title-CH4, the same card pick; edit-time pause >= 1 s in the 151.30-151.56 word gap, zero spine time
2:31.6  [CHART] C2 IN full frame on the C2-axes look: ANIMATED chart 1, header 'The PIEVERSE price', pill READ 14 NOV 2026,
        axes, no line yet; a real useCurrentFrame component built from C2.geometry.json (one static path revealed by a
        date-linear clip, a head dot on the clip edge), never a held or wiped PNG (charts.md section 2) `[VERIFY]`
2:31.6  SAY:  "Now we get to the token."
2:33.1  SAY:  "It started trading on November 14th, 2025,"
2:33.6  [CHART] C2 the head dot appears on the first print (14 Nov 2025) with a 0.5 s pulse ring (153.58 "trading")
2:36.3  SAY:  "and hit its all-time low in the same day, around 12 cents."
2:38.4  [CHART] C2 the line draws to the low and marker 1 lands: ALL-TIME LOW 0.119 · 14 NOV 2025 (158.44 "around 12
        cents") = the C2-start look
2:39.8  [CHART] C2 segment 2 draws, the low to 19 Apr 2026 (0.615) through the winter range, 159.84 to 168.14, eased; no
        venue label on the chart (guard 3: the ad-lib names no exchange)
2:39.8  SAY:  "And then later on,"
2:40.9  SAY:  "it started to get more centralized exchanges."
2:43.4  SAY:  "Around the Upbit listing in Korea,"
2:45.4  SAY:  "on April 20th, 2026, it went from around 62 cents"
2:48.1  [CHART] C2 the jump 19 Apr to 20 Apr draws, 168.14 to 169.16 ("62" to "around 1.18")
2:49.0  SAY:  "to around $1.18 in a day."
2:49.2  [CHART] C2 marker 2 lands: UPBIT LISTING 1.184 · 20 APR 2026, the low marker to rest (169.16) = the C2-mid look,
        held to 171.022 `[VERIFY Upbit date against the exchange notice]`
2:50.9  SAY:  "And then look at this right here, November 9th, 2026,"
2:51.0  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.76s) (face pick; plain, a screen share; "And" starts 0.14 s before the
        picture cut at 171.022)
2:51.0  [FACE] F5 IN → 2:57.8 (171.022-177.755)  "And then look at this right here, November 9th, 2026, new all-time high,
        $2.23."  [SCREEN SHARE: deck area painted per COVER-PLAN face_body]
        BODY FB4 171.02-177.76 animated-chart C2, state: the line draws on to marker 3 and the read price; the SAME component
        continues (no restart, no re-entry of the axes) scaled 0.7625 into x 0-1464. Spine at identity, no punch-in, no
        light leak, no glitch, no captions
2:51.1  [CHART] C2 segment 3 draws in the deck area (FB4), 20 Apr to the all-time high through the September peak, 171.10 to
        175.70
2:54.3  SAY:  "new all-time high, $2.23."
2:55.7  [CHART] C2 marker 3 lands: ALL-TIME HIGH 2.23 · 9 NOV 2026, the Upbit marker to rest (175.70 "$2.23")
        `[VERIFY no newer high before render]`
2:57.2  [CHART] C2 the line ends on the recording-time print: end dot pops, label AT RECORDING / 1.78 / 14 NOV 2026 / 14:15
        UTC (177.24) = the C2-payoff look, held to 177.755
2:57.8  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.76s) (face pick)
2:57.8  [CONTAINER] D21 IN full frame, at rest: UPBIT, KRW, two days; the Upbit state ONLY (the OKX state is not built, its
        line was cut on the take: plan-gate ruling 4); read date printed `[VERIFY Upbit series]`
2:58.0  SAY:  "On Upbit, the Korean exchange, trading in won,"
3:01.3  SAY:  "went from around 3 billion won on November 8th"
3:02.0  [CONTAINER] D21-s1 8 NOV 2026 3.0B lit (181.96 "3 billion won")
3:04.8  SAY:  "to around 54 billion won on November 9th."
3:05.2  [CONTAINER] D21-s2 9 NOV 2026 53.8B lit (185.18 "54 billion won")
3:08.2  SAY:  "That's around 18 times more in a single day."
3:08.6  [CONTAINER] D21-s3 + 17.8x in a single day (188.64 "18 times"; 188.20 is a join, the onset may sit later), held to
        190.80; no cause named
3:10.8  [CONTAINER] D24 IN full frame, at rest: IN THE COMMUNITY, text only (no logo, no screenshot, no gain figure, guard 6; → hand:xfade-scale (container-xfade, 0.35s)
        Mike's own claims, he confirms each from his Discord) `[VERIFY]`
3:10.8  SAY:  "Now here's the part I can speak to firsthand."
3:13.4  SAY:  "Shortly after it launched,"
3:14.8  SAY:  "one of the bots in my community"
3:15.9  SAY:  "called it a 20 million market cap, right?"
3:16.5  [CONTAINER] D24-s1 BOT CALL, AROUND 20M MARKET CAP lit (196.50 "a 20 million market cap")
3:17.8  SAY:  "And I called it afterwards at a 60 million market cap."
3:20.1  [CONTAINER] D24-s2 MY CALL, AROUND 60M MARKET CAP lit (200.12 "a 60 million market cap")
3:21.5  SAY:  "But it has been in my community favorites list"
3:23.3  [CONTAINER] D24-s3 COMMUNITY FAVORITES LIST, DISCORD lit, the calls rest (203.30 "community favorites list")
3:24.7  SAY:  "in my Discord, and we've been swing trading ever since."
3:28.1  SAY:  "With this swing trading software, nonetheless,"
3:28.5  [CONTAINER] D24-s4 SWING TRADING SOFTWARE lit (208.52 "swing trading software")
3:30.1  SAY:  "that's available to my members in my community."
3:30.3  [CONTAINER] D24-s5 + the AVAILABLE TO MEMBERS tag (210.32 "available to my members"), held to 212.58
3:32.6  [CONTAINER] D25 IN full frame, at rest: eyebrow MY COMMUNITY (plan-gate ruling 5); no price, no gain figure, no member → hand:xfade-scale (container-xfade, 0.35s)
        count, no 'a few hundred dollars', no promise (guard 6)
3:32.6  SAY:  "So if you were in my community,"
3:34.3  SAY:  "you'd be up significantly right now."
3:36.6  SAY:  "With just a simple investment of a few hundred dollars,"
3:39.9  SAY:  "you would be able to pay for the lifetime membership."
3:41.1  [CONTAINER] D25-s1 LIFETIME MEMBERSHIP lit (221.08 "lifetime membership")
3:42.1  SAY:  "And that's why you should click the link"
3:43.7  [CONTAINER] D25-s2 LINK IN THE DESCRIPTION with a down arrow lit (223.74 "the link in the description"; the video's
        only link line), held to 225.22
3:44.2  SAY:  "in the description below."
3:45.2  [CONTAINER] D19 IN full frame, at rest: CIRCULATING SUPPLY, of 1,000M (225.22 "Okay", a join: may sit up to 0.3 s → hand:xfade-scale (container-xfade, 0.35s)
        late; settled by 227.80 "Let's talk about the circulation")
3:45.2  SAY:  "Okay, so but get it more into Pieverse."
3:47.8  SAY:  "Let's talk about the circulation."
3:49.3  SAY:  "Only around 27 to 31% of the supply is circulating,"
3:49.9  [CONTAINER] D19-s1 AROUND 27% TO 40% lit (229.86 "27 to 31%"): the record-day reads (CoinGecko 27.5%, CoinMarketCap
        30.0%, the project's own count 39.6% after the scheduled unlock); the card prints the read while the VO says 31
        (PROJECT-LOG flag a, Mike's call) `[VERIFY]`
3:53.3  [CONTAINER] D19-s2 the three counts lit: CoinGecko 274.75M / CoinMarketCap 300.35M / the project 395.88M, read date
        (233.28 "depending on who's counting"), held to 234.78; guard 7, never one exact figure
3:53.3  SAY:  "depending on who's counting."
3:54.8  [CONTAINER] D8 IN full frame, at rest: the allocation, 1B tokens five ways (Community Growth 27.6%, Ecosystem & → hand:xfade-scale (container-xfade, 0.35s)
        Marketing 27.4%, Team & Advisors 20%, Investors 15%, Foundation Reserve 10%), one segmented card, not a table
3:54.8  SAY:  "The whitepaper splits one billion tokens five ways,"
3:57.7  SAY:  "and the team, the investors, and the foundation"
3:58.2  [CONTAINER] D8-s1 Team & Advisors 20% lit (238.18 "the team")
3:58.7  [CONTAINER] D8-s2 + Investors 15% (238.72 "the investors")
3:59.5  [CONTAINER] D8-s3 + Foundation Reserve 10% (239.46 "the foundation"); the two community buckets stay at rest
4:00.1  SAY:  "add up to 45%."
4:00.7  [CONTAINER] D8-s4 + 'Team + investors + foundation = 45%' (240.70 "45%"), held to 241.669
4:01.6  SAY:  "Now look at this day right here, November 14th, 2026."
4:01.7  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.76s) (face pick; plain, a screen share; "Now" starts 0.03 s early)
4:01.7  [FACE] F6 IN → 4:08.7 (241.669-248.669)  "Now look at this day right here, November 14th, 2026. That's when the
        12-month lock on the team and investors ends,"  [SCREEN SHARE: deck area painted per COVER-PLAN face_body]
        BODY FB5 241.67-248.67 animated-chart C3, state: the stack grows from 175.0M at launch and pauses on the 14 Nov 2026
        marker, then the team and investor layers switch on; C3 enters on the C3-start look, scaled 0.7625 into x 0-1464,
        'tracker schedule' pill on screen. No interior join at all. Spine at identity, no punch-in, no light leak, no glitch,
        no captions
4:01.7  [CHART] C3 IN in the deck area (FB5) on the C3-start look: ANIMATED chart 2, the launch step only, AT LAUNCH 175.0M ·
        14 NOV 2025 lit; a real useCurrentFrame step-chart component from C3.geometry.json, never a wiped PNG `[VERIFY]`
4:01.9  [CHART] C3 the stack reveals months 1 to 11, 241.92 to 243.00 ("look" to "November"), eased out
4:03.0  [CHART] C3 the marker line draws; callout 14 NOV 2026 / the 12-month lock on team and investors ends lands lit, the
        launch callout to rest (243.00 "November") = the C3-marker look (331.4M on the tracker's schedule)
4:04.8  SAY:  "That's when the 12-month lock on the team"
4:06.7  [CHART] C3 the 14 Nov 2026 step reveals; the gold (team) and red (investor) slivers glow, their legend rows light,
        the callout's third line 331.4M TO 364.8M UNLOCKED lands (246.66 "team") = the C3-switch look, held to 248.669;
        the verb is UNLOCKED, never 'released' (nothing moved on-chain, PROJECT-LOG flag d)
4:07.1  SAY:  "and investors ends,"
4:08.7  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s) (face pick)
4:08.7  [CONTAINER] D10 IN full frame, at rest: 14 NOV 2026 large with 'the 12-month lock on team and investor tokens ends',
        the release row at rest; sequenced between the two C3 states (rule #13) `[VERIFY what moved on 2026-11-14]`
4:08.9  SAY:  "which is exactly the day that I'm recording this."
4:11.5  SAY:  "Trackers put the first release anywhere"
4:12.3  [CONTAINER] D10-s1 FIRST RELEASE, PER THE TRACKERS lit (252.28 "the first release")
4:13.2  SAY:  "from around 33 million to around 86 million tokens."
4:13.8  [CONTAINER] D10-s2 around 33M lit (253.76 "around 33 million")
4:15.1  [CONTAINER] D10-s3 around 86M lit + 'Two trackers, two sizes.' (255.14 "around 86 million"), held to 256.68; the
        range, never one size, no dollar value (guard 7)
4:16.7  [CHART] C3 RETURNS full frame in the C3-switch look (256.68 "And"): its second state, not a re-show (the FB5 run was the → hand:xfade-scale (container-xfade, 0.35s)
        first); 'tracker schedule' pill stays on screen
4:16.7  SAY:  "And on one tracker's schedule,"
4:16.8  [CHART] C3 months 13 to 36 reveal, 256.84 to 261.50, eased in-out; the marker callout settles to rest at 257.0
4:18.5  SAY:  "around 33 million tokens unlock every month"
4:18.6  [CHART] C3 the 12-month bracket draws left to right (0.4 s) and '+33.4M a month / for 12 months, then less' lands
        (258.56 "33"); the plotted rate steps down after 12 months as the tracker reads (27.9M, 19.5M, 14.9M, 6.6M), never a
        flat 33.4M to 2028, while the VO says "every month until November of 2028" (PROJECT-LOG flag b)
4:20.7  SAY:  "until November of 2028."
4:21.5  [CHART] C3 the reveal reaches 14 Nov 2028; the end dot pops and '1,000M / BY 14 NOV 2028' lands (261.50 "2028", the
        spoken year; COVER-PLAN's 261.26 "of" superseded by the spec) = the C3-payoff look, held to 262.44
4:22.4  [CONTAINER] D11 IN full frame, at rest: WHO HOLDS IT; wallets unlabelled (never team or investors), read date printed → hand:xfade-scale (container-xfade, 0.35s)
        `[VERIFY top wallet balances + Safe thresholds]`
4:22.4  SAY:  "On-chain, four wallets hold around 57% of the supply."
4:23.4  [CONTAINER] D11-s1 4 WALLETS = 56.6% lit (263.44 "four wallets"); not '25 whales' (guard 7)
4:26.8  [CONTAINER] D11-s2 SEVEN 2-OF-3 MULTISIGS = 67.35% lit (266.84 "multisig wallets"); the card prints 2-of-3, never
        '2 or 3' (the VO is heard "two or three": confirm by ear)
4:26.8  SAY:  "They're multisig wallets,"
4:28.2  SAY:  "and that need two or three signers."
4:30.4  SAY:  "So as far as I could read,"
4:32.3  [CONTAINER] D11-s3 KEPT BY SIGNERS, NOT BY A CONTRACT (as far as the reads show) lit (272.34 "kept by people"), held
        to 275.10
4:32.3  SAY:  "that schedule is kept by people, not by a contract."
4:35.1  [CONTAINER] D14 IN full frame, at rest: PERPS VS SPOT, the bench version (plan-gate ruling 7): NO single-venue Binance → hand:xfade-scale (container-xfade, 0.35s)
        number (warning box 5), no multiple printed; on-screen words are the screenplay's ('leveraged bets', 'volume')
4:35.1  SAY:  "And a lot of the trading is futures,"
4:35.4  [CONTAINER] D14-s1 PERP VENUES lit: 33 listed, 3 non-credible excluded = 30 (275.44 "futures")
4:37.2  [CONTAINER] D14-s2 PERPS TOTAL 265.6M across the 30 credible venues lit (277.22 "leveraged bets", heard "batched")
        `[VERIFY perp volume, DATA.md 5a]`
4:37.2  SAY:  "that's leveraged batched on the price,"
4:39.4  SAY:  "running at several times the spot volume."
4:40.4  [CONTAINER] D14-s3 SPOT 21.4M (24h, CoinGecko, read date) lit (280.42 "spot volume"), held to 281.18 `[VERIFY]`
4:41.2  [CONTAINER] D22 IN full frame, at rest: WHAT HOLDING IT EARNS (281.18 "So", a join: may sit up to 0.3 s late); NO → hand:xfade-scale (container-xfade, 0.35s)
        EARLY WITHDRAWAL printed dim (not spoken, never lit); one card held 22.2 s in 8 states `[VERIFY staking page + guide]`
4:41.2  SAY:  "So does holding a token pay you anything?"
4:45.3  [CONTAINER] D22-s1 STAKING IS LIVE lit green (285.28 "Staking is live")
4:45.3  SAY:  "Staking is live."
4:46.0  SAY:  "You can lock your tokens for 90, 180, or 365 days,"
4:47.5  [CONTAINER] D22-s2 LOCK 90 lit (287.48 "90")
4:48.6  [CONTAINER] D22-s3 LOCK 180 lit (288.60 "180")
4:49.4  [CONTAINER] D22-s4 LOCK 365 DAYS lit (289.38 "365 days")
4:51.1  SAY:  "and what you earn is points called XP, not more tokens."
4:52.0  [CONTAINER] D22-s5 EARNS: DAILY XP (POINTS) lit (291.96 "points called XP"); no XP value, no conversion (guard 5)
4:53.9  [CONTAINER] D22-s6 NOT MORE TOKENS lit (293.94 "not more tokens")
4:55.2  SAY:  "Stake 50 tokens or more, and you get a Basic agent"
4:55.5  [CONTAINER] D22-s7 50 OR MORE = A BASIC AGENT FOR THE LENGTH OF THE LOCK lit (295.46 "Stake 50 tokens or more"); never
        'the 29 dollar plan', never 'free agent worth'
4:57.7  SAY:  "for as long as the lock runs,"
4:59.4  SAY:  "and the guy says what XP can be used for will be announced."
4:59.8  [CONTAINER] D22-s8 XP: 'future utility will be announced' (the guide's words) lit (299.80 "will be announced"; heard
        "the guy says"), held to 303.42
5:03.4  [CONTAINER] D23 IN full frame, at rest: PIP-5, closed 8 Oct 2026, the four options (Token Rewards 138,047 / → hand:xfade-scale (container-xfade, 0.35s)
        Governance Voting Power 107,312 / Platform Revenue 101,017 / Platform Perks 97,843) `[VERIFY Snapshot tally]`
5:03.4  SAY:  "In October, holders voted on how staking should be rewarded,"
5:07.2  SAY:  "and Token Rewards came out on top,"
5:07.4  [CONTAINER] D23-s1 Token Rewards lit (307.38 "Token Rewards came out on top"); 'came out on top', never a share of
        voters (approval voting)
5:09.1  SAY:  "but only around 170 million tokens voted."
5:09.4  [CONTAINER] D23-s2 1,130 VOTES, 169,871 TOKENS OF WEIGHT (around 170 thousand) lit (309.42 "tokens voted"); never
        '170M'. FACT FLAG: the VO says "170 million" against DATA.md T12 (PROJECT-LOG open flag, Mike's call: re-record,
        drop or keep this card fix)
5:12.0  SAY:  "That's under 0.02% of the supply."
5:12.3  [CONTAINER] D23-s3 + UNDER 0.02% OF THE SUPPLY (312.26 "under 0.02%"; true for 170 thousand, 0.017% calc)
5:15.4  SAY:  "The staking pages I read still pay points,"
5:15.6  [CONTAINER] D23-s4 + footer SINCE THE VOTE: STAKING PAGES STILL PAY POINTS, NO REWARD ANNOUNCEMENT FOUND, read date
        (315.58 "The staking pages I read"), held to the CH5 card pause at 319.98; description only, never 'the team ignored
        the vote' (guard 5) `[VERIFY no reward announcement since 2026-10-08]`
5:17.5  SAY:  "and I didn't find a reward announcement after the vote."
```

## CH5 - BACKERS AND WHAT TO WATCH (5:20.0-5:52.7, card ON "WHO'S BEHIND IT", no bed)
```
5:20.0  [CARD] CH5 "WHO'S BEHIND IT" · [TRANSITION] card presentation → rmn:flip (card, 0.40s) · [IMPACT] layer: none (silent card)
        title-CH5, the same card pick; edit-time pause >= 1 s in the 319.74-319.98 word gap, zero spine time
5:20.0  [CONTAINER] D20 IN full frame after title-CH5, at rest: eyebrow THE TEAM, text only, no photo; Colin Ho only (guard 7)
5:20.0  SAY:  "So who's behind it all?"
5:21.8  SAY:  "The CEO is Colin Ho, and the whitepaper says"
5:22.1  [CONTAINER] D20-s1 COLIN HO, Co-founder and CEO lit (322.12 "Colin Ho")
5:24.1  [CONTAINER] D20-s2 'Ex-Google/Uber engineer' (the whitepaper) lit (324.08), a project claim, held to 327.54
5:24.9  SAY:  "he's an ex-Google and ex-Uber engineer."
5:27.5  [CONTAINER] D13 IN full frame, at rest: 7M STRATEGIC ROUND, text only, no logos; footnote 'Binance MVB Season 9 (the → hand:xfade-scale (container-xfade, 0.35s)
        project's claim)' printed dim (not spoken, never lit); 7M only, never 'total funding 10M' (guard 7)
5:27.5  SAY:  "In October of 2025, Pieverse announced a $7 million round"
5:28.1  [CONTAINER] D13-s1 24 OCT 2025 lit (328.14 "October of 2025")
5:31.9  SAY:  "led by Animoca Brands and UOB Ventures."
5:32.8  [CONTAINER] D13-s2 LED BY ANIMOCA BRANDS lit (332.82, heard "Cabranz")
5:33.7  [CONTAINER] D13-s3 AND UOB VENTURES lit (333.70), held to 334.902
5:34.9  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (the face pick)
5:34.9  [FACE] F7 IN → 5:39.3 (334.902-339.335)  "That money was raised for payments and compliance, not for a chat app
        agent."  [kind: face, the gated full-screen face]
        measured face reframe; no punch-in and no light leak: the window's only join 338.967 sits 0.37 s inside its
        out-edge (no punch point); captions OFF (caption_scope none)
5:34.9  SAY:  "That money was raised for payments and compliance,"
5:37.7  SAY:  "not for a chat app agent."
5:39.3  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s) (face pick; "agent." spills to 339.40)
5:39.3  [CONTAINER] D15 IN full frame, at rest: WHAT TO WATCH, three rows at rest; no prediction on the card
5:39.5  SAY:  "So I'm watching three numbers."
5:41.4  [CONTAINER] D15-s1 row 1 CIRCULATING SUPPLY AFTER 14 NOV 2026 lit (341.40 "One"; he drops the year, the card prints it)
5:41.4  SAY:  "One, the circulating supply after November 14th."
5:45.1  [CONTAINER] D15-s2 row 2 NATIVE SKILLS AND PAID INSTALLS lit (345.12 "Two")
5:45.1  SAY:  "Two, the skills published on Pieverse itself,"
5:48.4  SAY:  "whether people pay for them,"
5:49.8  [CONTAINER] D15-s3 row 3 A PUBLISHED AGENT COUNT lit (349.76 "and three"), held to 352.669
5:49.8  SAY:  "and three, whether Pieverse publishes an agent count."
```

## CH6 - THE CLOSE (5:52.7-6:13.2, card OFF, no bed)
```
5:52.7  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.76s) (the face pick)
5:52.7  [FACE] F8 IN → 6:00.3 (352.669-360.335)  "So here's my read. Pieverse is a live product with real backers and is
        priced way ahead of the numbers it publishes."  [kind: face, the gated full-screen face]
        measured face reframe; no punch-in and no light leak: the window's only join 359.9 sits 0.44 s inside its out-edge
        (no punch point); captions OFF (caption_scope none); the locked read as said (no card, nothing printed)
5:52.7  SAY:  "So here's my read."
5:54.2  SAY:  "Pieverse is a live product with real backers"
5:57.4  SAY:  "and is priced way ahead of the numbers it publishes."
6:00.3  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.76s) (face pick; "publishes." spills to 360.38)
6:00.3  [CONTAINER] D15-s4 D15 RETURNS once, all three rows lit together, no new text: the screenplay's ONE deliberate
        callback (4.2 s, every row already read)
6:00.5  SAY:  "If those three numbers move, the story can change,"
6:03.2  SAY:  "and I'll be watching."
6:04.6  [CONTAINER] END IN full frame, at rest: the end card under the CTA (plan-gate ruling 6), house dark, YouTube end-screen → hand:xfade-scale (container-xfade, 0.35s)
        geometry: two empty 620x350 slots at x 300-920 and x 1000-1620, y 392-742 (80 px apart), every word outside them;
        LIKE / SUBSCRIBE / COMMENT at rest, the prompt, footer 'Community link in the description'; 8.7 s to the end of the
        spine, over YouTube's 5 s end-screen minimum, zero added time
6:04.6  SAY:  "If you liked this vid, give it a like"
6:06.4  [CONTAINER] END-s1 LIKE lit (366.42 "give it a like")
6:06.4  SAY:  "and hit that subscribe button if you're not subscribed yet,"
6:07.3  [CONTAINER] END-s2 SUBSCRIBE lit (367.26 "subscribe")
6:08.8  SAY:  "and comment below."
6:09.3  [CONTAINER] END-s3 COMMENT lit (369.28 "comment below")
6:10.1  SAY:  "Let me know if you're into Pieverse"
6:10.9  [CONTAINER] END-s4 the prompt 'Into Pieverse, or holding something similar?' lit (370.92 "into Pieverse"), held to
        373.24
6:11.6  SAY:  "or if you're holding something similar."
6:12.9  [END] the last word "similar." ends 372.88; the END card holds the 0.36 s of room tone to 6:13.2 (373.24 = EOF). No
        sign-off, no link line in the close (never said on the take), no music tail, no sound
```

---
## Orphan reconciliation (zero orphans, checked against `assets/` on disk 2026-11-14)
Every renderable file in `assets/` is PLACED with a timecode above or marked REJECTED / BENCH here. Sources (`*.html`,
`*.css`, `*.py`, `*.json`, `_state-cues.md`, `*.spec.md`) are exempt (comp-build.md section 10).

**PLACED:**
- Title slides x4 (silent card pauses): title-CH2 @0:35.2 · title-CH3 @1:55.6 · title-CH4 @2:31.6 · title-CH5 @5:20.0.
- Card slides x21 cards + END, every state as its own row: D1 + D1-s1..s3 · D9 + D9-s1..s4 (FB1, FB2, then full frame) ·
  D2 + D2-s1..s6 · D17 + D17-s1..s2 · D4 + D4-s1 · D18 + D18-s1..s4 · D5 + D5-s1..s3 (CH3 open) and D5-s4..s8 (the return) ·
  D6 + D6-s1..s4 · D21 + D21-s1..s3 · D24 + D24-s1..s5 · D25 + D25-s1..s2 · D19 + D19-s1..s2 · D8 + D8-s1..s4 ·
  D10 + D10-s1..s3 · D11 + D11-s1..s3 · D14 + D14-s1..s3 · D22 + D22-s1..s8 · D23 + D23-s1..s4 · D20 + D20-s1..s2 ·
  D13 + D13-s1..s3 · D15 + D15-s1..s3 and D15-s4 (the callback) · END + END-s1..s4.
- Diagram C1 (Type 2 system-design stills, 13 states, all placed): C1-overview @0:59.6 · C1-agent @1:01.2 ·
  C1-agent-price @1:07.1 · C1-wallet @1:12.9 · C1-wallet-tee @1:16.7 · C1-chat @1:23.2 · C1-chat-swap @1:27.4 ·
  C1-path @1:28.5 · C1-skills @1:31.9 · C1-skills-feed @1:33.5 · C1-a2a @1:36.3 · C1-token @1:44.5 (FB3) ·
  C1-token-tag @1:47.1 (FB3).
- Animated charts C2 (2:31.6-2:57.8, FB4 inside F5) and C3 (4:01.7-4:08.7 FB5 inside F6, then 4:16.7-4:22.4 full frame),
  animated in CODE from `charts/C2.geometry.json` / `C3.geometry.json`.

**REJECTED (renderables deliberately not comp inputs):**
- `charts/C2-axes.png`, `C2-start.png`, `C2-mid.png`, `C2-payoff.png` and `charts/C3-start.png`, `C3-marker.png`,
  `C3-switch.png`, `C3-payoff.png`: the chart-builder DESIGN SPEC for the two Type 1 animated charts. The comp reproduces
  each look with a `useCurrentFrame` component (comp-build section 7 and charts.md section 2 forbid holding or wiping a chart
  PNG; `lint_animated_charts.py`), so each look is placed above as a STATE of the live component, never as a picture.

**BENCH (not built, not on disk; named so nothing is silently missing):** D16 (0.12 to 2.23 card, no slot: the hook is all
inside F1, plan-gate ruling 3) · D3 plan-prices card (bench for 65.92-70.34, C1-agent-price carries it) · D12 listings card
(names Binance venues he did not say) · D21 state 2 OKX (its line was cut on the take) · the standalone NOT PUBLISHED card
(bench for D5's return, not needed).

**EMPTY BY RULING (Mike 2026-11-11):** `assets/vid/`, `assets/img/`, `assets/receipts/`, `assets/clip-inserts/`,
`assets/whiteboard/` hold no files (no b-roll, no images, no receipts, no clip inserts, no whiteboard).
`assets/transitions/` is empty until the transition-strategist's picks are copied in. No face-swap or img-motion clips exist
for this video.

## Layer tallies (authored)
- SAY 144 (every transcript segment, none merged, none dropped) · FACE 8 (4 kind face + 4 screen share, 5 face_body rows) ·
  CARD 4 (silent) · TRANSITION 19 (15 face edges + 4 card presentations; F1 opens on face) · CONTAINER rows 106 ·
  DIAGRAM rows 16 · CHART rows 17 · IMPACT 4 rows, all `layer: none` · PUNCH-IN 0 · LIGHTLEAK 0 · CAPTION 0 · MUSIC 0 ·
  RECEIPT 0 · INSERT 0 · WHITEBOARD 0 · KT 0 · END 1.
