# golden-kitty - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED off the graph's seed (`_previews/EDIT-PLAN.seed.md`, from `gen_editplan.py`) + `spine/ALL.g.pickup.medium-words.json`
> + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Open flags) + the built assets' state specs
> (`assets/diagrams/*-spec.md`, `assets/charts/*-spec.md`, the `assets/card-slides/<id>-sN.png` states documented in
> `assets/slide-sources/containers.html`). Format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1; per its
> §0 ORDER note the comp is built TO this log.
> Watch file: `spine/ALL.g.pickup.mp4` (470.456 s / 7:50.5, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause.
> The four title-card pauses (CH2 0:51.2 · CH4 2:51.2 · CH5 4:20.0 · CH6 6:03.5) are the standard 1.5 s each (PROJECT-LOG)
> and shift the final timeline via `sh()` at comp (+1.5 s after each card, +6.0 s by the end). Never re-apply a chain
> shift: every value below is already a `g.pickup` coordinate.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (transition-strategist, next node). Ledger limits for it:
> card move NOT cube (flip or slide) · melt look MELT/Equidistant (not MELT/RGB) · spin look NOT SPIN/3D Side Ease.
> SFX: music + SFX are an ffmpeg POST-mix (comp-build.md §9). Every kit file below was picked by its MEASURED audible tail
> (envelope to -40 dB below peak, 10 ms windows, ffmpeg decode, 2026-10-02); "peak" = where the transient sits in the file,
> so the file starts that much BEFORE the hit frame. Hard hits the music file already carries say "SFX: none (file-carried)"
> on purpose: fewer, bigger hits (WHEN-TO-USE-IMPACTS.md).
> FACE: ALL NINE windows air the Higgsfield background-swap clips (`assets/face-swap/`), full-frame, WITHOUT FACE_REFRAME,
> spine audio kept; the spine under them still carries the measured FACE_REFRAME (`assets/face-reframe.json`: scale 1.359,
> x -575, y -370). Captions ON over FACE windows ONLY (never over a cover), mishear list from AS-RECORDED applied.
> ZERO ORPHANS: every file in assets/vid, img, img-motion, receipts, charts, diagrams, title-slides, card-slides and
> face-swap is PLACED below with a timecode or marked BENCH / REJECTED in the reconciliation at the end.

## CH1 - THE TROPHY (0:00.0-0:51.2, Bed A `fearless`, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:09.7, AIRS AS THE HIGGSFIELD BG-SWAP: [VIDEO-LAYER]
        assets/face-swap/F1-higgsfield-bg-swap.mp4 full-frame over the window (swap t=0.4 s = spine 0.0, sidecar
        F1-higgsfield-bg-swap.json; 864x496 upscaled; pre-centred, NO FACE_REFRAME; video only, SPINE AUDIO KEPT);
        no cut-in (the video opens here)
0:00.0  [CAPTION] ON → 0:09.7 (F1; montserrat house style, captions-builder)
0:00.0  [MUSIC] Bed A `fearless` (Anthony Catacoli, Fearless) from file 0.0, COLD_HOT, no fade-in, seat -22 dB under
        VO (remotion gain -31.9 dB) → 0:51.2 · HARD HIT 0.0: the cold entry IS the hook hit; SFX: none (file-carried,
        a kit transient under "In 2015" would only smear the first word)
0:00.0  SAY:  "In 2015, Robinhood won a trophy called the Golden Kitty and that trophy is now a token"
0:02.8  [LIGHTLEAK] F1 mid-hold pulse → 0:06.8 (overlays.md: centred on the hold midpoint 4.83, d = min(9.67-2, 4) =
        4 s, ~0.3 opacity, renders UNDER cover, captions above)
0:04.3  [PUNCH-IN] subtle ~6% re-frame ON the F1a/F1b generation seam (spine 4.30, an existing desilencer join, the
        punch hides it) → 0:09.7 (swap window: subtle only, PROJECT-LOG)
0:06.2  SAY:  "on Robinhood's own blockchain and it's priced in gold."
0:09.7  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s) (face pick; the transition pulls the swap clip, not the spine)
0:09.7  [IMAGE] IMG-1-eth-vs-stablecoin (G1: real Ethereum mark beside a plain stablecoin) IN → 0:13.4 · ingress =
        AI-still Bad Signal glitch → hand:film-burn (face-cut, 0.76s)
0:09.8  SAY:  "Most meme coins trade against Ethereum or a stablecoin."
0:13.4  [RECEIPT] C13 stage 1: C13-dexscreener-golden-gld-pair-header (R(other), pair identity only, NO live stats in → hand:xfade-scale (container-xfade, 0.35s)
        frame) IN → 0:14.8, slow push
0:13.5  SAY:  "This one trades against gold."
0:14.8  [RECEIPT] C13 stage 2: C13-gld-token-page-full-name, the quote token 'SPDR Gold Trust, Robinhood Token' boxed → hand:xfade-scale (container-xfade, 0.20s)
        in gold, lands on "gold." (14.80) → 0:16.4
0:15.0  [DUCK] Bed A LIFT +6 dB (absolute seat -25.9 dB, 0.3 s ramps) over the file's breakdown → 0:30.0 · HARD HIT
        15.0: the breakdown opens as "gold." ends; SFX: none (file-carried)
0:15.2  SAY:  "This is the real deal."
0:16.4  [RECEIPT] C5-robinhood-2015-golden-kitty-post (R(other), Robinhood's own 2015-12-23 post, date in frame) IN → hand:xfade-scale (container-xfade, 0.35s)
        → 0:21.2, slow push; highlight on 'Robinhood won the Golden Kitty Award' @0:20.4
0:16.5  SAY:  "December 23rd, 2015, Robinhood posted themselves."
0:20.4  SAY:  "Robinhood won the Golden Kitty award for the sexiest product of the year."
0:21.2  [IMAGE] IMG-11 (G11, Vlad Tenev holding the trophy overhead, confetti) PLAYS AS THE MOTION CLIP
        assets/img-motion/IMG-11-vlad-trophy-overhead-confetti-motion.mp4 (muted, from clip 0, cut at 0:24.8, no
        extra Ken Burns; the still IMG-11-vlad-trophy-overhead-confetti.png = fallback + transition frame) →
        0:24.8 · 'AI ILLUSTRATION' tag whole slot · ingress glitch → lib:turbulent-v-4x (glitch-still, 0.40s)
0:24.8  [CONTAINER] H1-s1 IN (motion-type card, eyebrow 'JULY 1, 2026' lands on "July" @0:25.4, headline muted) → → hand:xfade-scale (container-xfade, 0.35s)
        0:30.0 · cross-fade + 0.93→1 scale-in
0:24.8  SAY:  "Then July 1st, 2026, Robinhood launches its own blockchain with more than 28 million customers"
0:28.6  [CONTAINER] H1-s2: headline 'ROBINHOOD CHAIN' + 'MAINNET LIVE' lit Robinhood lime on "launches" (28.56)
0:30.0  [VIDEO] BR-1-crowd-silhouettes (E1, commuters on phones) IN → 0:33.5 (Envato fade) · [LINE-CAPTION] → hand:fade (broll-fade, 0.27s)
        'MORE THAN 28 MILLION CUSTOMERS' (1 of 4)
0:30.0  [MUSIC] HARD HIT 30.0: Bed A rebuild step (level 4 to 6-7) lands on the cut, the +6 dB lift releases on
        this frame; SFX: none (file-carried)
0:32.5  SAY:  "behind the company."
0:33.5  [IMAGE] IMG-2-kitty-rising-from-chain (G2) IN → 0:37.2 · glitch ingress → lib:turbulent-v-5x (glitch-still, 0.44s)
0:33.5  SAY:  "And two months later, that trophy shows up on the chain as a token trading against tokenized"
0:37.2  [VIDEO] BR-2-gold-bars-pan (E2) IN → 0:40.2 (fade) → hand:fade (broll-fade, 0.50s)
0:39.5  SAY:  "gold."
0:40.1  [MUSIC] HARD HIT 40.08: F2 rides the file's level 6-7 mid section (3.6 dB under the hook seat), no
        automation; SFX: none
0:40.1  SAY:  "Now I'm very bullish on this token and I'm very bullish on this chain."
0:40.2  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick) · [FACE] F2 → 0:44.0, AIRS AS THE BG-SWAP:
        [VIDEO-LAYER] assets/face-swap/F2-higgsfield-bg-swap.mp4 (swap t=0.4 s = spine 40.233, sidecar
        F2-higgsfield-bg-swap.json; NO FACE_REFRAME; spine audio kept)
0:40.2  [CAPTION] ON → 0:44.0 (F2)
0:42.1  [PUNCH-IN] subtle ~6% (swap window) → 0:44.0 → hand:punch (punch-in, 0.00s)
0:44.0  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s)
0:44.0  [RECEIPT] C11a-matcarpenter-trophy-post (R(other), a real trophy, handle + date) pop-in on "cat trophy" →
        0:47.0 `[VERIFY]`
0:44.1  SAY:  "And the story of how a cat trophy ended up here starts more than 10 years before the"
0:46.9  [MUSIC] HARD HIT 46.9: the full drop of Bed A (file 46.9, level 8) lands on the time-tunnel cut; SFX: none
        (file-carried; the CH2 card impact follows 4.3 s later)
0:47.0  [VIDEO] BR-3-clock-vortex-flythrough (E3, LEADING-MOTION 4.24 s) IN → 0:51.2 (fade) → hand:fade (broll-fade, 0.27s)
0:48.9  SAY:  "chain even existed."
0:49.9  SAY:  "So let's break it all down."
```

## CH2 - THE GOLDEN KITTY STORY (0:51.2-2:01.9, Bed B `afterlife`, card ON)
```
0:51.2  [CARD] CH2 title-card-ch2 "THE GOLDEN KITTY" · [IMPACT] DSGNImpt (file below): the card scene LEADS IN over the tail of BR-3 and holds through
        the 1.5 s edit-time pause (readable >= 1 s; zero spine time) · [TRANSITION] card move → rmn:flip (card, 0.40s) (flip
        or slide, cube is ledger-blocked) · SFX file: Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (measured
        tail 1.07 s after the peak, peak 0.09 s into the file: peak on the card-landing frame, rings out inside the
        pause)
0:51.2  [MUSIC] Bed A fades 0.4 s from the card start · 0.6 s breath · Bed B `afterlife` (Bryant Lowry, Afterlife)
        source_in 41.65, fades in over the last 0.5 s of the pause, beat enters on "So what", seat -23 dB (gain
        -29.9 dB) → 2:51.2 as ONE placement (CH3 row is sample-continuous)
0:51.2  [IMAGE] IMG-3-kitty-spotlight-question (G3) IN → 0:54.7 · glitch ingress → rmn:flip (card, 0.40s)
0:51.2  SAY:  "So what is Golden Kitty?"
0:52.9  SAY:  "Well, first off, Product Hunt is a site where new tech products launch and the community"
0:54.7  [CONTAINER] ph-card-s1 IN ('WHAT IS PRODUCT HUNT' / 'Product Hunt') → 0:59.6, cross-fade + scale-in; row 1
        'New tech products launch here' spotlight lands on "new" (56.44)
0:58.6  [CONTAINER] ph-card-s2: row 2 'The community votes on them' lit gold on "community" (58.58)
0:58.9  SAY:  "votes on them."
0:59.6  [RECEIPT] C8-producthunt-golden-kitty-2015-hall-of-fame (R(other), 'Golden Kitty Awards' header, 2015 → hand:xfade-scale (container-xfade, 0.35s)
        selected) IN → 1:04.3, push toward the 2015 rows; no retirement banner in frame `[VERIFY]`
0:59.6  SAY:  "And in December of 2015, Product Hunt held its first ever awards, voted on by its own"
1:04.3  [VIDEO] BR-4-audience-applause (E4) IN → 1:08.3 (fade) → hand:fade (broll-fade, 0.50s)
1:05.4  SAY:  "community."
1:06.2  SAY:  "They called it the Golden Kitty Awards."
1:08.3  [RECEIPT] C11b-nivdror-trophy-video-post (.mp4 screen recording, the post's video playing, handle visible) → hand:xfade-scale (container-xfade, 0.35s)
        IN → 1:14.3 `[VERIFY]`
1:08.4  SAY:  "And the trophy is exactly what it sounds like."
1:11.2  SAY:  "A chrome gold cat wearing a visor sitting on a base that says Product Hunt, Golden Kitty."
1:14.3  [RECEIPT] C11c-arthcmr-trophy-post (R(other), trophy photo) IN → 1:18.3, push-in toward the trophy `[VERIFY]` → hand:xfade-scale (container-xfade, 0.35s)
1:17.7  SAY:  "Look at that thing."
1:18.3  [DIAGRAM] C4-s1-0-dark IN (timeline ladder, all rungs dark) → 1:26.0 · cross-fade + scale-in, then 8-10f
        state cross-fades (DIAGRAM_REFS)
1:18.3  SAY:  "Now Robinhood first showed up on Product Hunt in December of 2013."
1:18.8  [DIAGRAM] C4-s1-a-2013: rung 1 'DEC 2013: Robinhood first launches on Product Hunt' lights on "Robinhood" → hand:xfade-scale (container-xfade, 0.35s)
        (78.76)
1:22.3  SAY:  "Two years later, the community votes and Robinhood wins the Golden Kitty for, and I quote, the"
1:24.5  [DIAGRAM] C4-s1-b-2015: rung 2 'DEC 2015' + 'SEXIEST PRODUCT OF THE YEAR' lights on "Robinhood wins" (84.52)
1:26.0  [IMAGE] IMG-12-vlad-desk-trophy-laptop (G12) IN → 1:29.6 · 'AI ILLUSTRATION' tag · glitch ingress
        → lib:turbulent-h-2x (glitch-still, 0.32s)
1:27.6  SAY:  "sexiest product of the year."
1:29.6  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.50s) (face pick) · [FACE] F3 → 1:31.8, AIRS AS THE BG-SWAP: assets/face-swap/F3-higgsfield-bg-swap.mp4 (swap t=0.4 s = spine 89.600; NO FACE_REFRAME; spine audio kept)
1:29.6  [CAPTION] ON → 1:31.8 (F3)
1:29.7  SAY:  "And Robinhood even bragged about it."
1:30.7  [PUNCH-IN] subtle ~6% (swap window) → 1:31.8 → hand:punch (punch-in, 0.00s)
1:31.8  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.50s)
1:31.8  [RECEIPT] C5b-robinhood-2015-post-graphic (the graphic attached to the 2015 post, full frame) 1.5 s flash →
        1:33.3 `[VERIFY]`
1:31.9  SAY:  "They posted it themselves."
1:33.3  [RECEIPT] C6-robinhood-rewind-2015 (R(article), '#RobinhoodRewind 2015') IN → 1:38.4, one push-in to the → hand:xfade-scale (container-xfade, 0.35s)
        sentence, 'the coveted Golden Kitty Award from Product Hunt' highlighted on "coveted"
1:33.3  SAY:  "And in their own year-end recap, they called it the coveted Golden Kitty Award."
1:38.4  [VIDEO] BR-5-golden-trophies (E5) IN → 1:40.9 (fade) → hand:fade (broll-fade, 0.50s)
1:38.4  SAY:  "And this award went on to mean something."
1:40.9  [CONTAINER] winners-card-s1 IN ('GOLDEN KITTY WINNERS') → 1:52.5, cross-fade + scale-in; row 'ChatGPT, AI
        Product of the Year, 2022' lit on "ChatGPT" (100.92) `[VERIFY]`
1:40.9  SAY:  "ChatGPT won the Golden Kitty."
1:42.8  [CONTAINER] winners-card-s2: Telegram row lit (102.76)
1:42.8  SAY:  "Telegram won the Golden Kitty, as well as TikTok, Tesla, Apple, Google, and many others."
1:44.5  [CONTAINER] winners-card-s3: TikTok row lit (104.50)
1:45.4  [CONTAINER] winners-card-s4: Tesla row lit (105.38; row kept, Mike approved at GATE plan)
1:46.0  [CONTAINER] winners-card-s5: Apple row lit (106.00)
1:46.4  [CONTAINER] winners-card-s6: Google row lit (106.38)
1:48.1  SAY:  "And in 2018, Coinbase Wallet won the crypto category."
1:49.7  [CONTAINER] winners-card-s7: Coinbase Wallet, 2018 Crypto row lit on "Coinbase" (109.74)
1:52.5  [RECEIPT] C7-producthunt-robinhood-awards (R(other)) IN → 1:56.0, '2018: Robinhood Crypto, Crypto' highlighted → hand:xfade-scale (container-xfade, 0.35s)
        lime; any label reads 'showed up', never 'won' `[VERIFY]`
1:52.6  SAY:  "The same year Robinhood Crypto showed up in that category too."
1:56.0  [IMAGE] IMG-13-vlad-cabinet-shelf (G13) IN → 1:58.8 · 'AI ILLUSTRATION' tag · glitch ingress → lib:turbulent-h-3x (glitch-still, 0.36s)
1:56.0  SAY:  "So Robinhood has this trophy in its history."
1:58.8  [DIAGRAM] C4 callback opens on C4-s1-b-2015 (rungs 1 + 2 lit) → 2:02.1 → hand:xfade-scale (container-xfade, 0.35s)
1:58.8  SAY:  "And then Robinhood goes on and launches its own blockchain."
2:00.5  [DIAGRAM] C4-s2-a-chain: rung 3 'JULY 1, 2026: Robinhood Chain mainnet' lights on "launches" (120.50)
2:01.0  [DIAGRAM] C4-s2-b-pool-pulse: rung 4 'SEPT 4, 2026' pulses dim (cross-fade s2-a <-> s2-b on a ~1 s sine) →
        2:02.1
2:02.1  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.76s) (face pick) · [FACE] F4 → 2:11.2, AIRS AS THE BG-SWAP: assets/face-swap/F4-higgsfield-bg-swap.mp4 (swap t=0.3 s = spine 122.100; NO FACE_REFRAME; spine audio kept)
2:02.1  [CAPTION] ON → 2:11.2 (F4; caption fix "ticker GOLDEN")
```

## CH3 - THE TOKEN (2:02.2-2:50.9, Bed B continues, card OFF)
```
2:02.2  [MUSIC] Bed B CH3 row (file 112.61 = 41.65 + 70.96, sample-continuous, no breath; the mixer merges it into
        the CH2 placement) → 2:51.2
2:02.2  SAY:  "About two months after the chain goes live on September 4th, 2026, a token launches on"
2:04.7  [LIGHTLEAK] F4 mid-hold pulse → 2:08.7 (midpoint 126.67, d = 4 s)
2:07.5  [PUNCH-IN] subtle ~6% (swap window), ON the F4a/F4b seam (127.467), just before "a token launches" → 2:11.2 → hand:punch (punch-in, 0.00s)
2:09.1  SAY:  "it called Golden Kitty, ticker GOLDEN."
2:11.2  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s)
2:11.2  [RECEIPT] C10 stage 1: C10-goldenkitty-vip-hero (R(other), the site hero) IN → 2:13.5; crop excludes the
        'held up' photo and the 'Gold treasury' panel `[VERIFY]`
2:11.3  SAY:  "And the project says exactly what it is."
2:13.5  [RECEIPT] C10 stage 2: C10-goldenkitty-vip-faq-fan-dedication, the 'fan dedication to Robinhood winning → hand:xfade-scale (container-xfade, 0.35s)
        Product Hunt's 2015 Golden Kitty award' answer highlighted on "A fan dedication" (133.52) → 2:22.2
2:13.5  SAY:  "A fan dedication to Robinhood winning that 2015 Golden Kitty."
2:18.4  SAY:  "It's an independent fan token and it's not an official Robinhood product."
2:22.2  [RECEIPT] C12-dexscreener-golden-gld-chart (REAL chart, never restyled) IN → 2:36.2, wide still the comp → hand:xfade-scale (container-xfade, 0.35s)
        pans: launch-day candle @2:23.5 · the full run @2:24.6 · the mid-September spike + flush @2:26.6 · the
        steady climb @2:32.9. No '15x' text on screen `[VERIFY]`
2:22.3  [MUSIC] HARD HIT 142.3: Bed B rides its only level-8 plateau (spine 129.6-156.6, +2.3 dB); no automation;
        SFX: none (file-carried)
2:22.3  SAY:  "Now look at this chart from its launch day close."
2:24.6  SAY:  "This thing is up roughly 15x."
2:26.6  SAY:  "It had one wild day in the middle of September, a huge spike and a hard flush."
2:31.4  SAY:  "And look at what it did after that."
2:32.9  SAY:  "It built a steady climb day after day, quickly recovering."
2:36.2  [CONTAINER] cap-holders-s1 IN (eyebrow 'AT THE TIME OF RECORDING · OCT 1, 2026') → 2:42.5 → hand:xfade-scale (container-xfade, 0.35s)
2:36.3  SAY:  "At the time I'm recording, that's about a $4.2 million market cap with over 2,200 holders."
2:38.9  [CONTAINER] cap-holders-s1 accent: 'MARKET CAP 4.2M' row glows gold on "4.2 million" (158.88)
2:41.1  [CONTAINER] cap-holders-s2: 'HOLDERS 2,200+' lit gold (161.06)
2:42.5  [CHART] cap-vs-volume-start IN (Type 1, real useCurrentFrame build; the PNGs are the design spec) → 2:47.4 ·
        cross-fade + scale-in 0.96→1 (MELT candidate stat card → contrast chart → hand:xfade-scale (container-xfade, 0.35s))
2:42.5  SAY:  "$4 million on a chain has already done more than $90 billion in trading volume."
2:43.4  [CHART] cap-vs-volume-mid: GOLDEN counts to 4.2M, gold sliver at min visible width
2:45.1  [CHART] cap-vs-volume-payoff: '90B+' counts while the lime bar races full width on "90 billion" (165.12);
        never 98.97B / 99.02B `[VERIFY]`
2:47.4  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.50s) (face pick) · [FACE] F5 → 2:49.5, AIRS AS THE BG-SWAP: assets/face-swap/F5-higgsfield-bg-swap.mp4 (swap t=0.9 s = spine 167.433; NO FACE_REFRAME; spine audio kept)
2:47.4  [CAPTION] ON → 2:49.5 (F5)
2:47.5  SAY:  "And that's not even the part that got my attention."
2:48.5  [PUNCH-IN] subtle ~6% (swap window) → 2:49.5 → hand:punch (punch-in, 0.00s)
2:49.5  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.50s)
2:49.5  [VIDEO] BR-6-molten-gold-pour (E6) IN → 2:51.2 (fade)
2:49.7  SAY:  "Look at what it trades against."
```

## CH4 - PAIRED TO GOLD (2:51.2-4:19.8, Bed C `slow-rise`, card ON)
```
2:51.2  [CARD] CH4 title-card-ch4 "PRICED IN GOLD" · [IMPACT] DSGNImpt (file below), gold type, leads in over the tail of BR-6, holds through the
        1.5 s pause · [TRANSITION] card move → rmn:flip (card, 0.40s) · SFX file:
        Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (measured tail 1.07 s, peak 0.09 s in, on the
        card-landing frame)
2:51.2  [MUSIC] Bed B fades 0.4 s from the card start · breath · Bed C `slow-rise` (EVOE, Slow Rise) source_in
        60.72, pad fades in over the last 0.5 s of the pause, up on "In general", seat -23 dB (gain -27.0 dB) → 4:20.0
2:51.2  [VIDEO] BR-7-ethereum-coin-spin (E7) IN → 2:53.9 (fade)
2:51.2  SAY:  "In general, meme coins trade against Ethereum or against a stablecoin."
2:53.9  [VIDEO] BR-8-money-counter (E8, the dollar stands in for the stablecoin) IN → 2:55.6 (fade) → hand:fade (broll-fade, 0.27s)
2:55.6  [DIAGRAM] C1-A1-core IN (THE centerpiece: GOLDEN <-> Pool (Uniswap v4) <-> GLD) → 3:08.4 → hand:xfade-scale (container-xfade, 0.35s)
        core row lights on "Golden Kitty's" (175.72); 8f state cross-fades (DIAGRAM_REFS)
2:55.7  SAY:  "Golden Kitty's main pool trades against GLD."
2:58.6  [DIAGRAM] C1-A2-gld-focus: the GLD node pulses on "what exactly is GLD" (178.58)
2:58.6  SAY:  "So what exactly is GLD?"
3:00.5  SAY:  "It's Robinhood's tokenized version of SPDR Gold Trust, a fund that trades like a stock"
3:00.8  [DIAGRAM] C1-A3-gld-token: 'Robinhood token' layer lit on "tokenized version" (180.84)
3:02.6  [DIAGRAM] C1-A4-etf: the ETF layer lit on "SPDR Gold Trust" (182.58)
3:05.8  SAY:  "and holds physical gold."
3:06.5  [DIAGRAM] C1-A5-gold-bars: physical gold layer + the takeaway bar on "physical gold" (186.52)
3:08.4  [CONTAINER] spdr-card-s1 IN (eyebrow 'WHAT SPDR STANDS FOR', the four letters resting) → 3:14.1 → hand:xfade-scale (container-xfade, 0.35s)
3:08.4  SAY:  "SPDR is an acronym and it just stands for Standard & Poor's Depositary Receipts."
3:11.3  [CONTAINER] spdr-card-s2: S expands to 'Standard' (191.32)
3:11.9  [CONTAINER] spdr-card-s3: + P 'Poor's' (191.90)
3:12.3  [CONTAINER] spdr-card-s4: + D 'Depositary' (192.32; on-screen spelling 'Depositary', with the ampersand)
3:13.0  [CONTAINER] spdr-card-s5: + R 'Receipts' (192.98), full name lit
3:14.1  [IMAGE] IMG-4-spider-on-gold-bar (G4, the 'spider' gag, approved at GATE plan) IN → 3:16.3 · glitch ingress → lib:turbulent-h-4x (glitch-still, 0.48s)
3:14.1  SAY:  "So, S-P-D-R, or spider."
3:16.3  [RECEIPT] C16-stock-tokens-backed-1to1 (R(article)) IN → 3:21.5, push-in to 'backed 1:1 by the → hand:xfade-scale (container-xfade, 0.35s)
        corresponding underlying equity' highlighted; NO Golden Kitty art or ticker in this slot
3:16.4  SAY:  "And Robinhood says that every one of these tokens is backed one to one by the real share"
3:21.1  [RISER] Riser Sound Effect-2s.wav starts 201.09 so its peak (2.01 s into the file, measured -23.5 dBFS,
        +10 dB clip gain, still UNDER the VO) ENDS ON the 3:23.1 hit
3:21.5  [VIDEO] BR-9-vault-corridor (E9, steel vault door swinging shut) IN → 3:23.1 (fade) → hand:fade (broll-fade, 0.27s)
3:21.5  SAY:  "held by a custodian."
3:23.1  [DIAGRAM] C1-B1-pool IN, header 'WHAT PAIRED MEANS' → 3:33.9 · [TRANSITION] THE MARQUEE → lib:melt-equidistant-1 (MELT-transform, 0.84s)
        (MELT/Equidistant per the ledger): B opens POST-transform, the A core row re-formed as the
        pool vessel, uninterrupted to F6 · [RISER→IMPACT] Impacts/Impact_Hit_01-2-18.wav (measured tail 1.64 s,
        peak 0.13 s in: file starts 202.97, peak ON 203.10, rings out under "Now here's what")
3:23.1  [MUSIC] HARD HIT 203.1: Bed C HOLDS on the quiet pad, the reveal belongs to the transition and its SFX
3:23.1  SAY:  "Now here's what paired means."
3:24.7  SAY:  "The pool holds two things, Golden Kitty and tokenized gold."
3:26.8  [DIAGRAM] C1-B2-golden-side: the GOLDEN side glows (206.82)
3:28.1  [DIAGRAM] C1-B3-both-sides: the GLD side joins (208.06)
3:29.0  [DIAGRAM] C1-B4-buy: BUY arrow (green), gold flows INTO the pool on "somebody buys" (208.96)
3:29.0  SAY:  "When somebody buys, gold goes into the pool."
3:31.9  [DIAGRAM] C1-B5-sell: SELL arrow, gold flows OUT on "somebody sells" (211.88)
3:31.9  SAY:  "When somebody sells, gold comes out."
3:33.9  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.50s) (face pick) · [FACE] F6 → 3:36.5, AIRS AS THE BG-SWAP: assets/face-swap/F6-higgsfield-bg-swap.mp4 (swap t=0.4 s = spine 213.933; NO FACE_REFRAME; spine audio kept)
3:33.9  [CAPTION] ON → 3:36.5 (F6)
3:34.0  SAY:  "So the other side of every trade is gold."
3:35.3  [DUCK] Bed C TAMED -5 dB (absolute seat -32.0 dB, 1 s ramps riding the file's rise and fall) across the
        file's 8-9 peak → 4:09.2
3:35.3  [PUNCH-IN] subtle ~6% (swap window) on "every" (215.30) → 3:36.5 → hand:punch (punch-in, 0.00s)
3:36.2  [MUSIC] HARD HIT 216.18: the swell of Bed C CRESTS on "gold." (file 105.7); SFX: none (file-carried)
3:36.5  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.50s)
3:36.5  [VIDEO] BR-10-scale-dollars-vs-gold (E10, balance scale weighing gold) IN → 3:39.4 (fade)
3:36.5  SAY:  "And that means that Golden Kitty is priced in gold."
3:39.4  [CHART] C2-start IN (Type 1 price formula, term 1 'GOLDEN IN DOLLARS') → 3:50.9, cross-fade + scale-in
3:39.5  SAY:  "Its dollar price is its price in gold times the price of gold."
3:39.7  [CHART] C2 builds term by term (219.70-223.32: '=' + term 2 on "price in gold", 'x' + term 3 on "price of → hand:xfade-scale (container-xfade, 0.35s)
        gold") into C2-mid by 3:43.3 `[VERIFY values, one moment]`
3:43.4  SAY:  "So if that ratio just holds and gold goes up, like let's say 10%, Golden Kitty goes up 10%"
3:47.2  [CHART] C2-example-gold: term 3 border green, '+10%' chip, 'EXAMPLE, NOT A FORECAST' on "gold goes up"
        (227.18)
3:49.6  [CHART] C2-payoff: term 1 '+10%' chip + 'HOLDS' chip under term 2 on "goes up 10% in dollars" (229.64)
3:50.3  SAY:  "in dollars."
3:50.9  [RECEIPT] C15-tradingview-gld-two-year-percent (REAL two-year GLD chart incl. the 2026 pullback) IN → → hand:xfade-scale (container-xfade, 0.35s)
        3:56.5, slow push `[VERIFY ~+50%]`
3:50.9  SAY:  "It moves with gold both directions and gold is up about 50% over the last two years."
3:56.5  [VIDEO] BR-11-gold-coins-falling (E11) IN → 3:58.7 (fade) → hand:fade (broll-fade, 0.50s)
3:56.5  SAY:  "And the trading fees get paid in gold too."
3:58.7  [CHART] C3-start IN (eyebrow 'PER THE PROJECT'S OWN TRACKER', '0 GLD') → 4:08.1 → hand:xfade-scale (container-xfade, 0.35s)
3:58.7  SAY:  "Per the project's own tracker, this pool has earned about 236 GLD in fees since launch."
4:01.3  [CHART] C3-mid: 'FEES EARNED IN GLD' counts to 236 on "236 GLD" (241.30) `[VERIFY]`
4:04.9  SAY:  "That's about $90,000 in tokenized gold."
4:05.2  [CHART] C3-payoff: arrow draws, '$90K' card + oz card slide in on "90,000" (245.22); never 'treasury'
4:08.1  [RECEIPT] C10b-goldenkitty-vip-disclaimer (R(other)) IN → 4:15.7, push-in to 'is not backed by, does not → hand:xfade-scale (container-xfade, 0.35s)
        represent, and cannot be redeemed for gold or GLD' highlighted
4:08.2  SAY:  "Now let me be clear about what this is."
4:08.4  [MUSIC] HARD HIT 248.4: the Bed C peak falls away (file 137.9), the tame row releases by 4:09.2, the bare
        pad sits under the disclaimer; SFX: none (file-carried)
4:10.4  SAY:  "It's a meme coin and the project says so."
4:12.6  SAY:  "It's not backed by gold and you can't redeem it for gold."
4:15.7  [CONTAINER] contrast-priced-s1 IN (declared A-vs-B, COMPARISON_REFS) → 4:20.0: RIGHT 'GOLDEN KITTY: priced → hand:xfade-scale (container-xfade, 0.35s)
        in tokenized gold' lit gold on "What it is" (255.70)
4:15.7  SAY:  "What it is is it's priced in gold and most tokens on this chain can't say that."
4:17.7  [CONTAINER] contrast-priced-s2: LEFT 'TYPICAL MEME COIN: priced in ETH or a stablecoin' lit on "most tokens"
        (257.72)
```

## CH5 - THE STONK NARRATIVE (4:20.0-6:03.4, Bed D `hello-and-good-morning`, card ON)
```
4:20.0  [CARD] CH5 title-card-ch5 "THE STONK NARRATIVE" · [IMPACT] DSGNImpt (file below), leads in over the tail of contrast-priced, holds through the
        1.5 s pause · [TRANSITION] card move → rmn:flip (card, 0.40s) · SFX file:
        Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (measured tail 1.07 s, peak on the card-landing frame)
4:20.0  [MUSIC] Bed C fades 0.4 s from the card start · breath · Bed D `hello-and-good-morning` (Liberty, Hello, And
        Good Morning) source_in 11.48, enters HOT (level 7, cold_hot) with a 0.5 s fade-in, seat -22 dB → 4:47.3
4:20.0  [IMAGE] IMG-5 (G5, Golden Kitty leading a coin crowd) PLAYS AS THE MOTION CLIP
        assets/img-motion/IMG-5-kitty-leads-coin-crowd-motion.mp4 (muted, from clip 0, cut at 4:22.5; still
        IMG-5-kitty-leads-coin-crowd.png = fallback + transition frame) → 4:22.5
4:20.0  SAY:  "So now Golden Kitty isn't out here on its own."
4:22.5  [VIDEO] BR-12-traders-desks (E12, trading floor) IN → 4:26.5 (fade) → hand:fade (broll-fade, 0.50s)
4:22.5  SAY:  "There's a whole narrative forming all around this."
4:25.0  SAY:  "It's called the stonk narrative."
4:26.5  [DIAGRAM] stock-pair-1-eyebrow IN ('IT STARTED WITH STOCKS', same node grammar as C1) → 4:36.3 → hand:xfade-scale (container-xfade, 0.35s)
        8f state cross-fades
4:26.5  SAY:  "It started with stocks."
4:28.0  SAY:  "In the middle of July, a launchpad on the Robinhood chain called Long started letting"
4:31.1  [DIAGRAM] stock-pair-2-long: 'LONG: launchpad on Robinhood Chain, July 14, 2026' lit lime on "called Long"
        (271.08)
4:32.2  SAY:  "people launch meme coins that are paired with tokenized stock instead of Ethereum."
4:32.9  [DIAGRAM] stock-pair-3-meme-pool: the meme coin + pool on "meme coins" (272.88)
4:34.4  [DIAGRAM] stock-pair-4-stock: the tokenized-stock side on "tokenized stock" (274.40)
4:35.3  [DIAGRAM] stock-pair-5-eth-struck: Ethereum struck through on "instead of Ethereum" (275.32), held to 4:36.3
4:36.3  [VIDEO] BR-13-rocket-ignition (E13) IN → 4:37.8 (fade) → hand:fade (broll-fade, 0.27s)
4:36.3  SAY:  "And it took off."
4:37.8  [RECEIPT] C23-theblock-stock-paired-quarter (R(article), The Block 2026-08-31) IN → 4:43.1, push-in to the → hand:xfade-scale (container-xfade, 0.35s)
        'roughly a quarter of all stock-linked' sentence; framing 'stock trading', never 'all trading' `[VERIFY]`
4:37.8  SAY:  "By the end of August, meme coins paired to stocks were about a quarter of all the stock"
4:42.1  SAY:  "trading on the chain."
4:43.1  [VIDEO] BR-14-aerial-suburb-pools (E14, the pools gag, graded down) IN → 4:45.3 (fade) · [LINE-CAPTION] → hand:fade (broll-fade, 0.50s)
        'ACROSS MORE THAN 400 POOLS' (2 of 4) `[VERIFY 400+]`
4:43.1  SAY:  "And that was across more than 400 pools."
4:45.3  [IMAGE] IMG-6-artificial-inu-glow (G6) IN → 4:48.2 · glitch ingress; no number on the image → lib:turbulent-h-5x (glitch-still, 0.44s)
4:45.3  SAY:  "The biggest one is a meme coin called Artificial Inu paired against tokenized Nvidia stock."
4:47.3  [MUSIC] BED CHANGE, no card (Mike, 2026-10-02): Bed D fades out and the `afterlife` reprise (Bryant Lowry, Afterlife,
        source_in 122.42, seat -23 dB) fades in across 4:45.9-4:47.3, on its plateau as he says "Artificial Inu" → 6:03.5
4:48.2  [VIDEO] BR-15-circuit-board-glow (E15, GPU macro, no logo) IN → 4:50.1 (fade) → hand:fade (broll-fade, 0.27s)
4:50.1  [RECEIPT] C23b-theblock-artificial-inu-sentence (R(article)) IN → 4:56.4, the '1.5 million ... to a peak of → hand:xfade-scale (container-xfade, 0.35s)
        135 million' sentence highlighted: the screen shows ONLY the sourced 135M (VO says 150M, Mike's ruling)
        `[VERIFY]`
4:50.2  SAY:  "It went from a $1.5 million market cap to $150 million in one month."
4:56.4  [VIDEO] BR-16-jump-flip-splash (E16, graded down) IN → 4:58.4 (fade) → hand:fade (broll-fade, 0.50s)
4:56.4  SAY:  "Then Solana jumped in, of course."
4:58.4  [RECEIPT] C31-datawallet-stonkfun-explained-BENCH, PLACED (the plan's bench is the slot: Datawallet's → hand:xfade-scale (container-xfade, 0.35s)
        'StonkFun explained' header; any attribution reads Datawallet) IN → 5:02.0 `[VERIFY]`
4:58.4  SAY:  "A launchpad over there called StonkFun does the same thing."
5:02.0  [IMAGE] IMG-7-stonk-token-launch (G7, real STONK mark) IN → 5:04.4 · glitch ingress; no market cap on it → lib:turbulent-v-3x (glitch-still, 0.36s)
5:02.0  SAY:  "And its own token, STONK, ran 250% in a single day to $240 million in market cap."
5:04.4  [RECEIPT] C24-theblock-stonk-surges-headline (R(article), 2026-09-06 'STONK surges 250% to 140 million') → hand:xfade-scale (container-xfade, 0.35s)
        IN → 5:10.2, push-in on the headline: the screen shows ONLY 140M (VO says 240M, Mike's ruling) `[VERIFY]`
5:10.2  [DIAGRAM] C27-ov-1-stocks IN (pairing ladder, three rungs, shown ONCE in full; STOCKS rung lit) → 5:21.8 ·
        SPIN candidate (new axis: from stocks to everything) → lib:spin-3d-center-ease-t-cw (SPIN-newfacet, 0.88s)
5:10.2  SAY:  "And they didn't stop at stocks."
5:13.0  SAY:  "You can pair a coin to other things as well, like commodities as you can see with gold."
5:15.5  [DIAGRAM] C27-ov-2-gold: 'COMMODITIES: GOLD' rung lit on "commodities ... gold" (315.54)
5:17.8  SAY:  "You can pair it to blue chip cryptos like Bitcoin, Solana, and TAO."
5:18.6  [DIAGRAM] C27-ov-3-crypto: 'BLUE CHIP CRYPTO' rung lit (318.62)
5:19.9  [DIAGRAM] C27-ov-4-wbtc: the WBTC chip on "Bitcoin" (319.90)
5:20.8  [DIAGRAM] C27-ov-5-sol: the SOL chip on "Solana" (320.78)
5:21.4  [DIAGRAM] C27-ov-6-tao: the TAO chip on "TAO" (321.44), all lit
5:21.8  [RECEIPT] C28-datawallet-stonkfun-holder-rewards-BENCH, PLACED (Datawallet crop of the 'distributed to → hand:xfade-scale (container-xfade, 0.35s)
        holders in whatever their coin is paired against' line; attribution Datawallet) IN → 5:25.1; guard: NO
        Golden Kitty art, pool or ticker in this slot `[VERIFY]`
5:21.9  SAY:  "And some of these are set up to pay their holders rewards as well."
5:25.1  [VIDEO] BR-17-hologram-lab (E17) IN → 5:28.8 (fade) → hand:fade (broll-fade, 0.50s)
5:25.1  SAY:  "So a lot of new tech and a lot of new ideas are being ushered in."
5:28.8  [VIDEO] BR-18-night-festival-crowd (E18, the plan's bench clip, accepted) IN → 5:31.1 (fade) → hand:fade (broll-fade, 0.50s)
5:28.8  SAY:  "And it's going to be all the craze pretty soon."
5:31.1  [VIDEO] BR-19-gold-leaves-falling (E19) IN → 5:32.7 (fade) → hand:fade (broll-fade, 0.27s)
5:31.2  [MUSIC] HARD HIT 331.2: the full band of the Afterlife reprise carries "And now with gold"; its breakdown
        opens at 332.3, in the pause after the line; SFX: none (file-carried)
5:31.2  SAY:  "And now with gold, on October 1st, 2026, which is the day that I'm recording this right now,"
5:32.7  [RECEIPT] C25 stage 1: C25-stonkfun-gold-pairs-post (R(other), @LaunchOnSF 2026-10-01) IN, zoom on the post → hand:xfade-scale (container-xfade, 0.35s)
        + its date (332.78) → 5:42.6
5:37.8  [RECEIPT] C25 stage 2: zoom to the text 'You can now launch coins paired with...' + graphic on "StonkFun
        announced" (337.84)
5:37.8  SAY:  "StonkFun announced that you can launch coins paired with tokenized gold."
5:41.4  SAY:  "So they can do it too."
5:42.6  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (face pick) · [FACE] F7 → 5:48.0, AIRS AS THE BG-SWAP: assets/face-swap/F7-higgsfield-bg-swap.mp4 (swap t=0.267 s = spine 342.567; NO FACE_REFRAME; spine audio kept)
5:42.6  [CAPTION] ON → 5:48.0 (F7; caption fix "Gold and Kiti" → "Golden Kitty" x2)
5:42.6  SAY:  "So as you can see, Golden Kitty is well positioned."
5:43.6  [LIGHTLEAK] F7 mid-hold pulse → 5:47.0 (midpoint 345.28, d = min(5.43-2, 4) = 3.43 s)
5:45.4  SAY:  "Golden Kitty has been doing this since September 4th."
5:45.4  [PUNCH-IN] subtle ~6% (swap window) on "Golden Kitty has been" (345.44) → 5:48.0 → hand:punch (punch-in, 0.00s)
5:45.5  [MUSIC] HARD HIT 345.5: the face line sits on the breakdown of the Afterlife reprise (lifted +3 dB);
        SFX: none (file-carried)
5:48.0  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s)
5:48.0  [DIAGRAM] gold-dates-1-sept4 IN ('SEPT 4, 2026: GOLDEN / GLD pool opens, Robinhood Chain' in gold) → 5:51.0;
        dates only, never 'over a month' or a day count
5:48.0  SAY:  "So that's over a month before Solana even offered it."
5:49.6  [DIAGRAM] gold-dates-2-oct1: 'OCT 1, 2026: StonkFun adds gold pairs' on "Solana" (349.64), 6f cross-fade
5:51.0  [RECEIPT] C26-cryptogalaxy-gold-narrative-post (R(other), 'Tokenized gold narrative incoming', GOLDEN CA → hand:xfade-scale (container-xfade, 0.35s)
        boxed) IN → 5:53.9 `[VERIFY]`
5:51.1  SAY:  "And people are already connecting the two."
5:52.5  [MUSIC] HARD HIT 352.5: the full band of the Afterlife reprise returns (file 188.0) ON "So here's what I think" (352.88);
        SFX: none (file-carried)
5:52.9  SAY:  "So here's what I think."
5:53.9  [VIDEO] BR-20-bull-charging (E20) IN → 5:57.3 (fade); no text, no price → hand:fade (broll-fade, 0.50s)
5:53.9  SAY:  "The next run is going to be about real world assets and the stonk narrative."
5:57.3  [DIAGRAM] C27 finale callback opens on C27-ov-6-tao (all rungs lit) → 6:03.5 · [TRANSITION] thesis callback → lib:melt-equidistant-1 (MELT-transform, 0.84s)
        (second and last C27 state set, DIAGRAM_REFS; the second and last MELT of the video)
5:58.4  SAY:  "And a gold paired token on Robinhood's own chain is sitting in a prime spot for it."
5:58.7  [DIAGRAM] C27-fin-1-token-on-gold: GOLD rung pulses and the token art (the project's own profile art) lands
        on it (358.72); cross-fade ov-6 <-> fin-1 on a ~0.9 s sine to 6:00.2
6:00.2  [DIAGRAM] C27-fin-2-chain-glow: the Robinhood Chain glow on "Robinhood's own chain" (360.24), held to 6:03.5
6:02.6  [MUSIC] HARD HIT 362.62: the Afterlife reprise is still on its hot return under "spot"; SFX: none (the CH6
        card impact 0.84 s later is the kit hit)
```

## CH6 - THE ROBINHOOD CHAIN (6:03.5-7:05.7, Bed E `emerald-city`, card ON)
```
6:03.5  [CARD] CH6 title-card-ch6 "ROBINHOOD CHAIN" · [IMPACT] DSGNImpt (file below), lime type, leads in over the tail of C27-fin-2-chain-glow,
        holds through the 1.5 s pause · [TRANSITION] card move → rmn:flip (card, 0.40s) · SFX file:
        Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (measured tail 1.07 s, peak on the card-landing frame)
6:03.5  [MUSIC] the Afterlife reprise fades 0.4 s from the card start · breath · Bed E `emerald-city` (Tiger Gang, Emerald City)
        source_in 37.45, fades in 0.5 s on its quiet build, seat -22 dB → 7:50.5 as ONE placement (CH7 row is
        sample-continuous)
6:03.5  [DUCK] Bed E LIFT +6 dB (absolute seat -24.6 dB) on the level 4-5 build → 6:26.3
6:03.5  [IMAGE] IMG-8-kitty-rooftop-lime-city (G8) IN → 6:06.4 · glitch ingress → rmn:flip (card, 0.40s)
6:03.5  SAY:  "So now we get to that chain that Golden Kitty lives on."
6:06.4  [RECEIPT] C17-newsroom-mainnet-launch (R(article), headline + 'July 1, 2026' dateline, 'Robinhood Chain' → hand:xfade-scale (container-xfade, 0.35s)
        highlighted lime) IN → 6:11.0, push-in on the headline
6:06.5  SAY:  "July 1st, 2026, Robinhood launches the Robinhood chain."
6:11.0  [RECEIPT] C32-docs-about-robinhood-chain (R(other), docs landing) IN → 6:15.6, push-in to the 'traditional → hand:xfade-scale (container-xfade, 0.35s)
        markets, crypto, and real-world assets together' line `[VERIFY]`
6:11.1  SAY:  "It's built to bring stocks, crypto and real world assets together on chain."
6:15.6  [VIDEO] BR-21-earth-night-orbit (E21, LEADING-MOTION 4.9 s) IN → 6:20.5 (fade) · [LINE-CAPTION] '24/7 IN → hand:fade (broll-fade, 0.50s)
        MORE THAN 120 COUNTRIES' (3 of 4)
6:15.8  SAY:  "Tokenized stocks trading 24/7 in more than 120 countries."
6:20.5  [RECEIPT] C18-defillama-robinhood-chain-dex-volume-daily (REAL DefiLlama daily DEX-volume bars from launch, → hand:xfade-scale (container-xfade, 0.35s)
        the cumulative ~99B headline cropped OUT) IN → 6:26.0, slow push along the growing bars `[VERIFY]`
6:20.5  SAY:  "And look at those numbers."
6:21.6  SAY:  "On day one, trading volume was just over $200,000."
6:26.0  [CHART] C19a-start IN (Type 1 stat cards, card 1 lit at $0, card 2 dimmed) → 6:33.0 → hand:xfade-scale (container-xfade, 0.35s)
6:26.1  SAY:  "Three months in, over a billion dollars locked in its apps and more than $90 billion in total trading volume."
6:27.6  [CHART] C19a-mid: '1B+ LOCKED IN ITS APPS (TVL)' counts up on "billion dollars locked" (387.62) `[VERIFY]`
6:29.7  [MUSIC] HARD HIT 389.7: Bed E's full groove DROPS on the big numbers (stabs at 386.7 and 388.2 lead in);
        SFX: none (file-carried)
6:30.2  [CHART] C19a-payoff: '90B+ TOTAL DEX VOLUME, 3 MONTHS' lifts and counts on "90 billion" (390.22); never 99B
6:33.0  [VIDEO] BR-22-jet-engine-fan (E22) IN → 6:34.3 (fade) → hand:fade (broll-fade, 0.27s)
6:33.1  SAY:  "So here's the growth engine."
6:34.3  [CHART] C19b-start IN (same layout as C19a) → 6:41.7 → hand:xfade-scale (container-xfade, 0.35s)
6:34.4  SAY:  "Robinhood has 28.4 million funded customers and $369 billion in assets on its platform."
6:35.0  [CHART] C19b-mid: '28.4M FUNDED CUSTOMERS' counts up (395.04) `[VERIFY Q2 vs Q3]`
6:38.1  [CHART] C19b-payoff: '369B IN PLATFORM ASSETS' (398.06), source line 'Robinhood, Q2 2026'
6:41.7  [CHART] app-users-share IN (Type 1 share bar) → 6:47.5 → hand:xfade-scale (container-xfade, 0.35s)
6:41.7  SAY:  "And one estimate says only 2% of the chain's transactions came from Robinhood app users."
6:42.0  [CHART] app-users-share-start: eyebrow 'ONE ESTIMATE', empty full-width track (401.98)
6:42.0  [DUCK] Bed E LIFT +6 dB (absolute -24.6 dB) on the file's 7 s breakdown → 6:49.0
6:42.6  [CHART] app-users-share-mid: solid lime sliver grows to 1% (402.60)
6:43.3  [CHART] app-users-share-payoff: hatched extension to 2%, '1-2%' callout under 'ONE ESTIMATE' (403.32); never
        '2%' alone `[VERIFY]`
6:47.5  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.76s) (face pick) · [FACE] F8 → 6:50.8, AIRS AS THE BG-SWAP: assets/face-swap/F8-higgsfield-bg-swap.mp4 (swap t=0.333 s = spine 407.533; NO FACE_REFRAME; spine audio kept)
6:47.5  [CAPTION] ON → 6:50.8 (F8)
6:47.7  SAY:  "Robinhood's own customers have barely shown up yet."
6:49.0  [MUSIC] HARD HIT 409.0: the groove returns on "have barely shown up yet", the lift releases on the same
        frame; SFX: none (file-carried)
6:49.2  [PUNCH-IN] subtle ~6% (swap window) on "have barely" (409.22) → 6:50.8 → hand:punch (punch-in, 0.00s)
6:50.8  [TRANSITION] face→cover F8 out → hand:film-burn (face-cut, 0.76s)
6:50.8  [IMAGE] IMG-9-vlad-podium-lime-glow (G9, podium, hands empty, NO trophy) IN → 6:54.2 · 'AI ILLUSTRATION' tag
        · glitch ingress → hand:film-burn (face-cut, 0.76s)
6:50.9  SAY:  "And the CEO, Vlad Tenev, said it himself,"
6:54.2  [RECEIPT] C20-tenev-x-post (R(article), Vlad Tenev's own post, handle visible) IN → 7:00.9, push-in; the → hand:xfade-scale (container-xfade, 0.35s)
        source wording only: 'it works great for memes, too' highlighted @6:58.8
6:54.3  SAY:  "they're building the Robinhood chain to be the best chain in real world assets."
6:58.2  SAY:  "And, quote,"
6:58.8  SAY:  "It works great for memes too."
7:00.8  [MUSIC] HARD HIT 420.8: Bed E stops for one second under "for memes too" (419.7-420.7) and slams back in on
        "And Golden Kitty is both"
7:00.9  [CONTAINER] both-tags-s1 IN (the project's own token art over a gold field, tags resting; no quote marks, no → hand:xfade-scale (container-xfade, 0.20s)
        Vlad) → 7:05.7, cross-fade + scale-in · [IMPACT] Impacts/Kick_Impact_01-short.wav (measured tail 0.36 s,
        peak 0.18 s in: file starts 420.78, peak ON the slam at 420.96, tucked under "And")
7:01.0  SAY:  "And Golden Kitty is both."
7:02.6  SAY:  "A meme, priced in a real world asset."
7:02.9  [CONTAINER] both-tags-s2: 'MEME' tag lit lime on "meme" (422.88)
7:03.8  [CONTAINER] both-tags-s3: 'PRICED IN A REAL-WORLD ASSET' tag lit gold on "priced" (423.78)
```

## CH7 - THE CASE (7:05.7-7:50.5, Bed E continues, card OFF)
```
7:05.7  [MUSIC] Bed E CH7 row (file 99.71 = 37.45 + 62.26, sample-continuous, merged into the CH6 placement) →
        7:50.5
7:05.7  [VIDEO] BR-23-gavel-strike (E23) IN → 7:07.3 (fade; the gavel's own strike is picture, no SFX added) → hand:fade (broll-fade, 0.27s)
7:05.7  SAY:  "So here's the case."
7:07.3  [DIAGRAM] C21-1-users IN (Robinhood Chain stack, its ONLY appearance; 'Robinhood app users' node lights on
        "Robinhood" 427.66) → 7:19.1 · SPIN candidate → lib:spin-3d-center-ease-t-cw (SPIN-newfacet, 0.88s)
7:07.4  SAY:  "If Robinhood routes even a small piece of those 28.4 million customers onto its chain,"
7:10.7  [DIAGRAM] C21-2-customers-tag: '28.4M funded customers' tag (430.68)
7:13.1  [DIAGRAM] C21-3-wallet-chain: wallet + chain layer on "onto its chain" (433.14)
7:14.7  SAY:  "the tokens already living there are sitting right in front of that flow."
7:14.9  [DIAGRAM] C21-4-apps-tokens: the apps + tokens layer, GLD chip in gold, on "the tokens already living there"
        (434.90)
7:17.3  [DIAGRAM] C21-5-flow-pulse: the flow arrow pulses on "right in front of that flow" (437.30); cross-fade
        4 <-> 5 on a ~0.8 s sine to 7:19.1; no number on the flow
7:19.1  [VIDEO] BR-24-red-carpet-flashes (E24, press photographers, camera flashes) IN → 7:22.2 (fade) → hand:fade (broll-fade, 0.50s)
7:19.1  SAY:  "And we've already seen what attention does on this chain."
7:20.1  [DUCK] Bed E LIFT +6 dB (absolute -24.6 dB) on the file's 4.7 s breakdown → 7:24.8
7:22.2  [VIDEO] BR-25-marquee-bulbs (E25) IN → 7:25.4 (fade) · [LINE-CAPTION] 'A DIFFERENT MEME COIN' (4 of 4, the → hand:fade (broll-fade, 0.50s)
        guard)
7:22.3  SAY:  "A different meme coin paired to a tokenized AMC stock went from a $40 million to $150 million market cap in an hour after Vlad followed its account."
7:24.8  [MUSIC] HARD HIT 444.8: the last breakdown of Bed E ends, the final level-8 run starts and holds to the end;
        the lift releases; SFX: none (file-carried)
7:25.4  [RECEIPT] C29-cryptotimes-amc-paired-coin-headline (R(article), 2026-09-07) IN → 7:33.1, one push-in; guard → hand:xfade-scale (container-xfade, 0.35s)
        label 'A DIFFERENT TOKEN' up the whole slot, no Golden Kitty art `[VERIFY single secondary]`
7:33.1  [TRANSITION] cover→face cut-in F9 → hand:film-burn (face-cut, 0.76s) (face pick) · [FACE] F9 → 7:37.5, AIRS AS THE BG-SWAP: assets/face-swap/F9-higgsfield-bg-swap.mp4 (swap t=0.4 s = spine 453.100; NO FACE_REFRAME; spine audio kept)
7:33.1  [CAPTION] ON → 7:37.5 (F9)
7:33.4  SAY:  "Robinhood's own trophy on its own chain, priced in gold."
7:36.5  [DUCK] THE one vibe-cut duck: Bed E -4.2 dB (x0.617) across 456.5 → 457.6 under "priced in gold."
7:36.7  [IMPACT] VIBE CUT, the biggest hit of the video: Impacts/Impact_Hit_01-1.wav (weight 5, deep sub; measured
        tail 4.84 s, peak 0.19 s in: file starts 456.47, peak ON "priced" 456.66; 0.5 s fade-out from 457.7 so the
        ring clears "And a $4 million token") · [PUNCH-IN] CRASH ZOOM ~20% on "priced" (456.66) → 7:37.5 → hand:punch (punch-in, 0.13s)
        (the F9 punch IS the crash zoom of the vibe-cut combo)
7:37.5  [TRANSITION] face→cover F9 out → hand:film-burn (face-cut, 0.76s)
7:37.5  [IMAGE] IMG-10 (G10, token on gold bars, lime aurora) PLAYS AS THE MOTION CLIP
        assets/img-motion/IMG-10-kitty-token-on-gold-bars-motion.mp4 (muted, from clip 0, cut at 7:41.0; still
        IMG-10-kitty-token-on-gold-bars.png = fallback + transition frame) → 7:41.0; no price, no multiplier
7:37.7  SAY:  "And a $4 million token could look very different if this chain keeps growing the way it has."
7:41.0  [VIDEO] BR-26-seedlings-timelapse (E26, the plan's bench clip, accepted) IN → 7:43.4 (fade) → hand:fade (broll-fade, 0.50s)
7:43.4  [CONTAINER] end-card-s1 IN (logo bug = assets/slide-sources/mike-profile-logo.jpg, resting) → 7:50.5; NO → hand:xfade-scale (container-xfade, 0.35s)
        link line
7:43.4  SAY:  "If you like this vid, click that like button and comment below to let me know what you think about Golden Kitty."
7:44.7  [CONTAINER] end-card-s2: like button animates on "click" (464.72)
7:46.1  [CONTAINER] end-card-s3: comment prompt 'What do you think about Golden Kitty and the Robinhood Chain?' on
        "comment" (466.10)
7:49.1  SAY:  "And the Robinhood chain."
7:50.2  [MUSIC] HARD HIT 470.16: Bed E's hard stop (file 144.15) lands on the onset of "chain."; the word is said in
        the clear over the reverb tail; 0.25 s fade to the last frame 470.456. HARD OUT, no CTA pickup
```

## Orphan reconciliation (every asset on disk, by folder)
- **vid/ (26/26 PLACED):** BR-1 0:30.0 · BR-2 0:37.2 · BR-3 0:47.0 · BR-4 1:04.3 · BR-5 1:38.4 · BR-6 2:49.5 · BR-7 2:51.2 ·
  BR-8 2:53.9 · BR-9 3:21.5 · BR-10 3:36.5 · BR-11 3:56.5 · BR-12 4:22.5 · BR-13 4:36.3 · BR-14 4:43.1 · BR-15 4:48.2 ·
  BR-16 4:56.4 · BR-17 5:25.1 · BR-18 5:28.8 · BR-19 5:31.1 · BR-20 5:53.9 · BR-21 6:15.6 · BR-22 6:33.0 · BR-23 7:05.7 ·
  BR-24 7:19.1 · BR-25 7:22.2 · BR-26 7:41.0. (BR-n = the COVER-PLAN Envato row En.)
- **img/ (13/13 PLACED):** IMG-1 0:09.7 · IMG-11 0:21.2 (as motion) · IMG-2 0:33.5 · IMG-3 0:51.2 · IMG-12 1:26.0 ·
  IMG-13 1:56.0 · IMG-4 3:14.1 · IMG-5 4:20.0 (as motion) · IMG-6 4:45.3 · IMG-7 5:02.0 · IMG-8 6:03.5 · IMG-9 6:50.8 ·
  IMG-10 7:37.5 (as motion). The three stills behind motion clips stay the fallback + the transition frame.
- **img-motion/ (3/3 PLACED):** IMG-11-vlad-trophy-overhead-confetti-motion 0:21.2 · IMG-5-kitty-leads-coin-crowd-motion
  4:20.0 · IMG-10-kitty-token-on-gold-bars-motion 7:37.5.
- **face-swap/:** F1-higgsfield-bg-swap.mp4 PLACED 0:00.0 · F2-higgsfield-bg-swap.mp4 PLACED 0:40.2 ·
  F3-higgsfield-bg-swap.mp4 PLACED 1:29.6 · F4-higgsfield-bg-swap.mp4 PLACED 2:02.1 · F5-higgsfield-bg-swap.mp4 PLACED 2:47.4 ·
  F6-higgsfield-bg-swap.mp4 PLACED 3:33.9 · F7-higgsfield-bg-swap.mp4 PLACED 5:42.6 · F8-higgsfield-bg-swap.mp4 PLACED 6:47.5 ·
  F9-higgsfield-bg-swap.mp4 PLACED 7:33.1 (the F<n>-higgsfield-bg-swap.json sidecars and the .retime.json files = metadata).
  The model inputs F1, F1a, F1b, F2, F3, F4a, F4b, F5, F6, F7, F8, F9 -raw-for-higgsfield (.mp4 + .json) are
  REJECTED for screen (sources sent to Seedance, never on screen, PROJECT-LOG).
- **receipts/ (28 files, 26 slots, all PLACED):** C13-dexscreener-golden-gld-pair-header 0:13.4 · C13-gld-token-page-full-name
  0:14.8 · C5-robinhood-2015-golden-kitty-post 0:16.4 · C11a-matcarpenter-trophy-post 0:44.0 ·
  C8-producthunt-golden-kitty-2015-hall-of-fame 0:59.6 · C11b-nivdror-trophy-video-post 1:08.3 · C11c-arthcmr-trophy-post
  1:14.3 · C5b-robinhood-2015-post-graphic 1:31.8 · C6-robinhood-rewind-2015 1:33.3 · C7-producthunt-robinhood-awards 1:52.5 ·
  C10-goldenkitty-vip-hero 2:11.2 · C10-goldenkitty-vip-faq-fan-dedication 2:13.5 · C12-dexscreener-golden-gld-chart 2:22.2 ·
  C16-stock-tokens-backed-1to1 3:16.3 · C15-tradingview-gld-two-year-percent 3:50.9 · C10b-goldenkitty-vip-disclaimer 4:08.1 ·
  C23-theblock-stock-paired-quarter 4:37.8 · C23b-theblock-artificial-inu-sentence 4:50.1 ·
  C31-datawallet-stonkfun-explained-BENCH 4:58.4 (placed; the filename's BENCH = the plan's bench source that took the
  slot) · C24-theblock-stonk-surges-headline 5:04.4 · C28-datawallet-stonkfun-holder-rewards-BENCH 5:21.8 (placed, same
  note) · C25-stonkfun-gold-pairs-post 5:32.7 · C26-cryptogalaxy-gold-narrative-post 5:51.0 · C17-newsroom-mainnet-launch
  6:06.4 · C32-docs-about-robinhood-chain 6:11.0 · C18-defillama-robinhood-chain-dex-volume-daily 6:20.5 · C20-tenev-x-post
  6:54.2 · C29-cryptotimes-amc-paired-coin-headline 7:25.4.
- **charts/ (Type 1 ANIMATED, PNG states = design spec, every state placed):** cap-vs-volume-start/-mid/-payoff 2:42.5 /
  2:43.4 / 2:45.1 · C2-start/-mid/-example-gold/-payoff 3:39.4 / 3:43.3 / 3:47.2 / 3:49.6 · C3-start/-mid/-payoff 3:58.7 /
  4:01.3 / 4:05.2 · C19a-start/-mid/-payoff 6:26.0 / 6:27.6 / 6:30.2 · C19b-start/-mid/-payoff 6:34.3 / 6:35.0 / 6:38.1 ·
  app-users-share-start/-mid/-payoff 6:42.0 / 6:42.6 / 6:43.3.
- **diagrams/ (Type 2 SYSTEM-DESIGN, every state placed):** C4-s1-0-dark 1:18.3 · C4-s1-a-2013 1:18.8 · C4-s1-b-2015 1:24.5
  (+ callback 1:58.8) · C4-s2-a-chain 2:00.5 · C4-s2-b-pool-pulse 2:01.0 · C1-A1-core 2:55.6 · C1-A2-gld-focus 2:58.6 ·
  C1-A3-gld-token 3:00.8 · C1-A4-etf 3:02.6 · C1-A5-gold-bars 3:06.5 · C1-B1-pool 3:23.1 · C1-B2-golden-side 3:26.8 ·
  C1-B3-both-sides 3:28.1 · C1-B4-buy 3:29.0 · C1-B5-sell 3:31.9 · stock-pair-1-eyebrow 4:26.5 · stock-pair-2-long 4:31.1 ·
  stock-pair-3-meme-pool 4:32.9 · stock-pair-4-stock 4:34.4 · stock-pair-5-eth-struck 4:35.3 · C27-ov-1-stocks 5:10.2 ·
  C27-ov-2-gold 5:15.5 · C27-ov-3-crypto 5:18.6 · C27-ov-4-wbtc 5:19.9 · C27-ov-5-sol 5:20.8 · C27-ov-6-tao 5:21.4 (+ finale
  5:57.3) · gold-dates-1-sept4 5:48.0 · gold-dates-2-oct1 5:49.6 · C27-fin-1-token-on-gold 5:58.7 · C27-fin-2-chain-glow
  6:00.2 · C21-1-users 7:07.3 · C21-2-customers-tag 7:10.7 · C21-3-wallet-chain 7:13.1 · C21-4-apps-tokens 7:14.9 ·
  C21-5-flow-pulse 7:17.3.
- **card-slides/ (every state placed):** H1-s1/-s2 0:24.8 / 0:28.6 · ph-card-s1/-s2 0:54.7 / 0:58.6 · winners-card-s1..s7
  1:40.9 to 1:49.7 · cap-holders-s1/-s2 2:36.2 / 2:41.1 · spdr-card-s1..s5 3:08.4 to 3:13.0 · contrast-priced-s1/-s2 4:15.7 /
  4:17.7 · both-tags-s1/-s2/-s3 7:00.9 / 7:02.9 / 7:03.8 · end-card-s1/-s2/-s3 7:43.4 / 7:44.7 / 7:46.1.
- **title-slides/ (4/4 PLACED):** title-card-ch2 0:51.2 · title-card-ch4 2:51.2 · title-card-ch5 4:20.0 · title-card-ch6 6:03.5.
- **slide-sources/:** golden-kitty-token-art.png (embedded in C1, C27-fin-1 and both-tags, not a cover of its own) ·
  mike-profile-logo.jpg (end-card logo bug 7:43.4) · containers.html + _shot.py (build sources, not on screen).
- **transitions/:** empty until TRANSITIONS.md picks are copied in (lint_transition_assets gates it at comp).
- **SFX kit used (5 files, 8 hits):** DSGNImpt-single_impact_sound_-Elevenlabs.mp3 x4 (cards) · Riser Sound Effect-2s.wav +
  Impact_Hit_01-2-18.wav (C1 marquee) · Kick_Impact_01-short.wav (both-tags slam) · Impact_Hit_01-1.wav (vibe cut).
  Not used this video: the rest of Impacts/ and risers/ (measured, longer tails).
- **COVER-PLAN benches not taken:** H0 'PRICED IN GOLD' hook card (never built, phrase lands on the CH4 card +
  contrast-priced) · C30 Product Hunt homepage recording (OUT, Cloudflare wall; ph-card holds the slot) · C14 live panel
  (REPLACED by cap-holders) · C22 (blocked guard). No files on disk for any of them.
