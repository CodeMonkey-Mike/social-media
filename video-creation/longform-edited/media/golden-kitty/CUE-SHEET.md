# golden-kitty - WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.g.pickup.mp4` (M:SS.s, 470.456 s / 7:50.5, 30 fps). Timecodes from the spine word-transcript
> (`spine/ALL.g.pickup.medium-words.json`) + the blackdetect FACE/COVER spans in AS-RECORDED.md. Sibling of EDIT-PLAN.md
> (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect d=0.3, pix_th=0.10); state cues snap to word onsets.
> Ids: C-* receipts (DATA.md capture ids) · C1/C4/C21/C27/stock-pair/gold-dates = Type 2 SYSTEM-DESIGN diagrams ·
> C2/C3/C19a/C19b/cap-vs-volume/app-users-share = Type 1 ANIMATED charts · H1/ph-card/winners-card/cap-holders/spdr-card/
> contrast-priced/both-tags/end-card = CARD slides · title-card-chN = chapter cards · BR-* Envato b-roll · IMG-* ChatGPT image.
> CH1 is first, nothing before it. Timeline shifters: four title-card pauses, 1.5 s each (CH2 0:51.2 · CH4 2:51.2 · CH5 4:20.0
> · CH6 6:03.5), baked at `card_pauses`, routed by `sh()`; everything below is PRE-pause. Ending = HARD OUT on "chain."
> (Mike 2026-10-01), no CTA pickup, no link line.

## FACE spans (baked spine shows the face, face appears ONLY here)   9 spans
- 0:00.0 → 0:09.7   CH1 hook, "In 2015, Robinhood won a trophy..."  (opens ON face; AIRS AS F1-higgsfield-bg-swap.mp4)
- 0:40.2 → 0:44.0   CH1, "Now I'm very bullish on this token..."  (AIRS AS F2-higgsfield-bg-swap.mp4)
- 1:29.6 → 1:31.8   CH2, "And Robinhood even bragged about it."
- 2:02.1 → 2:11.2   CH3, "About two months after the chain goes live..."
- 2:47.4 → 2:49.5   CH3, "And that's not even the part that got my attention."
- 3:33.9 → 3:36.5   CH4, "So the other side of every trade is gold."
- 5:42.6 → 5:48.0   CH5, "So as you can see, Golden Kitty is well positioned..."
- 6:47.5 → 6:50.8   CH6, "Robinhood's own customers have barely shown up yet."
- 7:33.1 → 7:37.5   CH7, "Robinhood's own trophy on its own chain, priced in gold."  (the vibe cut)
(exact: 0.000-9.667 · 40.233-44.033 · 89.600-91.833 · 122.100-131.233 · 167.433-169.533 · 213.933-216.500 · 342.567-348.000
· 407.533-410.833 · 453.100-457.467; face 42.6 s = 9.1%. ALL NINE air as swap clips: no FACE_REFRAME on them; the spine under them: FACE_REFRAME scale
1.359, x -575, y -370 from assets/face-reframe.json.)

## TRANSITIONS (chapters + face + b-roll, MANDATORY; full per-cut list = TRANSITIONS.md)
RESOLVED 2026-10-02 from TRANSITION-PLAN.json (107 scene changes, every one in TRANSITIONS.md section 5): card move rmn:flip · face pick hand:film-burn · MELT lib:melt-equidistant-1 at 3:23.1 and 5:57.3 · SPIN lib:spin-3d-center-ease-t-cw at 5:10.2 and the C21 case board at 7:07.3 · everything else the quiet house moves (hand:fade, hand:xfade-scale, hand:punch, the AI-still glitch).
Ledger limits (usage_ledger, PROJECT-LOG 2026-10-01): card move NOT cube (flip or slide) · melt look = MELT/Equidistant
(MELT/RGB blocked) · spin look NOT SPIN/3D Side Ease. Face pick (FILM BURN vs Blocks·Max) and AI-still glitch are advisory.
CHAPTER cards (ONE move for all four; card scene LEADS IN over the outgoing cover so it reads >= 1 s through the 1.5 s pause):
- 0:51.2  CH2 "THE GOLDEN KITTY" (+ Bed A→B) · 2:51.2 CH4 "PRICED IN GOLD" (+ B→C) · 4:20.0 CH5 "THE STONK NARRATIVE"
  (+ C→D) · 6:03.5 CH6 "ROBINHOOD CHAIN" (+ D→E)
FACE cuts (the video's ONE face pick, every cut in AND out; on F1/F2 the transition pulls the swap clip, not the spine):
- in: 0:40.2 · 1:29.6 · 2:02.1 · 2:47.4 · 3:33.9 · 5:42.6 · 6:47.5 · 7:33.1   (0:00.0 = opens ON face, not a cut)
- out: 0:09.7 · 0:44.0 · 1:31.8 · 2:11.2 · 2:49.5 · 3:36.5 · 5:48.0 · 6:50.8 · 7:37.5
Intra-FACE punch-ins (hand:punch; every hold > 2 s gets one, NO glitch):
- @0:04.3 F1 (subtle ~6%, ON the F1a/F1b seam) · @0:42.1 F2 (subtle ~6%, swap) · @1:30.7 F3 (subtle ~6%, swap) · @2:07.5 F4 (subtle ~6%, ON the F4a/F4b seam) · @2:48.5 F5 (subtle ~6%, swap) ·
  @3:35.3 F6 (subtle ~6%, swap) · @5:45.4 F7 (subtle ~6%, swap) · @6:49.2 F8 (subtle ~6%, swap) · @7:36.7 F9 = the vibe-cut CRASH ZOOM
  on "priced" (kept at full size on the swap clip)
VIDEO b-roll transitions (Envato = fade): 0:30.0 BR-1 · 0:37.2 BR-2 · 0:47.0 BR-3 · 1:04.3 BR-4 · 1:38.4 BR-5 · 2:49.5 BR-6
(face-owned cut) · 2:51.2 BR-7 (card-owned) · 2:53.9 BR-8 · 3:21.5 BR-9 · 3:36.5 BR-10 (face-owned) · 3:56.5 BR-11 · 4:22.5 BR-12
· 4:36.3 BR-13 · 4:43.1 BR-14 · 4:48.2 BR-15 · 4:56.4 BR-16 · 5:25.1 BR-17 · 5:28.8 BR-18 · 5:31.1 BR-19 · 5:53.9 BR-20 · 6:15.6
BR-21 · 6:33.0 BR-22 · 7:05.7 BR-23 · 7:19.1 BR-24 · 7:22.2 BR-25 · 7:41.0 BR-26
AI IMAGE ingresses (Cinematic Bad Signal glitch; face-owned / card-owned where they share the cut):
- 0:09.7 IMG-1 (face-owned) · 0:21.2 IMG-11 motion · 0:33.5 IMG-2 · 0:51.2 IMG-3 (card-owned) · 1:26.0 IMG-12 · 1:56.0 IMG-13 ·
  3:14.1 IMG-4 · 4:20.0 IMG-5 motion (card-owned) · 4:45.3 IMG-6 · 5:02.0 IMG-7 · 6:03.5 IMG-8 (card-owned) · 6:50.8 IMG-9
  (face-owned) · 7:37.5 IMG-10 motion (face-owned)
CONTAINER / CHART / RECEIPT swaps = hand:xfade-scale (cross-fade + 0.93→1 scale-in); in-container state swaps = 6-10f cross-fades.
MARQUEE moves (MELT + SPIN reserved for four diagram beats; text containers stay quiet):
- 3:23.1 C1 state A → state B, B opens POST-transform: lib:melt-equidistant-1 (MELT, THE marquee; riser→impact lands here)
- 2:42.5 cap-holders → cap-vs-volume: NOT taken, stays on the quiet cross-fade (see TRANSITIONS.md section 4)
- 5:10.2 C24 → C27 overview: lib:spin-3d-center-ease-t-cw (SPIN, new axis, "they didn't stop at stocks")
- 5:57.3 BR-20 → C27 finale callback: lib:melt-equidistant-1 (MELT, the thesis callback)
- 7:07.3 BR-23 → C21: lib:spin-3d-center-ease-t-cw (SPIN, "here's the case")

## CHAPTER cards begin  (ON only at a bed change)
- 0:00.0  CH1 "THE TROPHY", NO card (first chapter) ; 0:51.2 CH2 "THE GOLDEN KITTY" ; 2:02.2 CH3 "THE TOKEN", NO card
  (Bed B continues) ; 2:51.2 CH4 "PRICED IN GOLD" (gold type) ; 4:20.0 CH5 "THE STONK NARRATIVE" ; 6:03.5 CH6
  "ROBINHOOD CHAIN" (lime type) ; 7:05.7 CH7 "THE CASE", NO card (Bed E continues)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   84 state rows
> CHART(anim) = Type 1, real useCurrentFrame animation (PNG states are the design spec) · DIAGRAM = Type 2 system-design
> still, comp-level movement only · SLIDE(card) = card slide states `-sN`. Declare DIAGRAM_REFS (C1, C4, C27),
> COMPARISON_REFS (contrast-priced).
- 0:24.8  SLIDE(card) H1 s1 'JULY 1, 2026' → s2 'ROBINHOOD CHAIN' + 'MAINNET LIVE' lime @0:28.6
- 0:54.7  SLIDE(card) ph-card s1 'New tech products launch here' (@0:56.4) → s2 'The community votes on them' @0:58.6
- 1:18.3  DIAGRAM C4 ladder s1-0-dark → s1-a-2013 @1:18.8 → s1-b-2015 'SEXIEST PRODUCT OF THE YEAR' @1:24.5
- 1:40.9  SLIDE(card) winners-card s1 ChatGPT → s2 Telegram @1:42.8 → s3 TikTok @1:44.5 → s4 Tesla @1:45.4 → s5 Apple
  @1:46.0 → s6 Google @1:46.4 → s7 Coinbase Wallet @1:49.7 `[VERIFY]`
- 1:58.8  DIAGRAM C4 callback s1-b-2015 → s2-a-chain 'JULY 1, 2026' @2:00.5 → s2-b-pool-pulse sine @2:01.0
- 2:36.2  SLIDE(card) cap-holders s1 'MARKET CAP 4.2M' (@2:38.9) → s2 'HOLDERS 2,200+' @2:41.1, dated OCT 1, 2026
- 2:42.5  CHART(anim) cap-vs-volume start → mid 4.2M @2:43.4 → payoff 90B+ @2:45.1 `[VERIFY]`
- 2:55.6  DIAGRAM C1 state A: A1-core → A2-gld-focus @2:58.6 → A3-gld-token @3:00.8 → A4-etf @3:02.6 → A5-gold-bars @3:06.5
- 3:08.4  SLIDE(card) spdr-card s1 → S @3:11.3 → P @3:11.9 → D @3:12.3 → R @3:13.0 ('Standard & Poor's Depositary Receipts')
- 3:23.1  DIAGRAM C1 state B (MARQUEE): B1-pool → B2-golden-side @3:26.8 → B3-both-sides @3:28.1 → B4-buy @3:29.0 → B5-sell @3:31.9
- 3:39.4  CHART(anim) C2 price formula start → mid (terms build 3:39.7-3:43.3) → example-gold +10% @3:47.2 → payoff @3:49.6
  `[VERIFY values]`
- 3:58.7  CHART(anim) C3 fees start → mid 236 GLD @4:01.3 → payoff $90K @4:05.2 `[VERIFY]`
- 4:15.7  SLIDE(card) contrast-priced s1 RIGHT 'GOLDEN KITTY' gold → s2 LEFT 'TYPICAL MEME COIN' @4:17.7
- 4:26.5  DIAGRAM stock-pair 1-eyebrow → 2-long @4:31.1 → 3-meme-pool @4:32.9 → 4-stock @4:34.4 → 5-eth-struck @4:35.3
- 5:10.2  DIAGRAM C27 overview ov-1-stocks → ov-2-gold @5:15.5 → ov-3-crypto @5:18.6 → ov-4-wbtc @5:19.9 → ov-5-sol @5:20.8
  → ov-6-tao @5:21.4
- 5:48.0  DIAGRAM gold-dates 1-sept4 → 2-oct1 @5:49.6 (dates only, never 'over a month')
- 5:57.3  DIAGRAM C27 finale ov-6-tao → fin-1-token-on-gold @5:58.7 (sine to 6:00.2) → fin-2-chain-glow @6:00.2
- 6:26.0  CHART(anim) C19a start → mid 1B+ @6:27.6 → payoff 90B+ @6:30.2 `[VERIFY]`
- 6:34.3  CHART(anim) C19b start → mid 28.4M @6:35.0 → payoff 369B @6:38.1 `[VERIFY Q3]`
- 6:41.7  CHART(anim) app-users-share start @6:42.0 → mid 1% @6:42.6 → payoff '1-2%' ONE ESTIMATE @6:43.3 `[VERIFY]`
- 7:00.9  SLIDE(card) both-tags s1 → s2 'MEME' lime @7:02.9 → s3 'PRICED IN A REAL-WORLD ASSET' gold @7:03.8
- 7:07.3  DIAGRAM C21 1-users → 2-customers-tag @7:10.7 → 3-wallet-chain @7:13.1 → 4-apps-tokens @7:14.9 → 5-flow-pulse @7:17.3
- 7:43.4  SLIDE(card) end-card s1 → s2 like button @7:44.7 → s3 comment prompt @7:46.1 (no link line)

## RECEIPTS / inserts begin   26 slots (28 files)   (R(article) = one push-in reading move · R(other) = per capture)
- 0:13.4  C13 R(other) pair header → C13-gld-token-page-full-name @0:14.8 (no live stats)
- 0:16.4  C5 R(other) Robinhood's 2015-12-23 post, highlight @0:20.4
- 0:44.0  C11a R(other) @matcarpenter trophy photo `[VERIFY]`
- 0:59.6  C8 R(other) Product Hunt 2015 hall of fame `[VERIFY]`
- 1:08.3  C11b R(other) @NivDror trophy video, screen recording (.mp4) `[VERIFY]`
- 1:14.3  C11c R(other) @arthcmr trophy photo, push-in `[VERIFY]`
- 1:31.8  C5b R(other) the 2015 post graphic, 1.5 s flash `[VERIFY]`
- 1:33.3  C6 R(article) #RobinhoodRewind 2015, 'the coveted Golden Kitty Award'
- 1:52.5  C7 R(other) Robinhood's Product Hunt awards, '2018: Robinhood Crypto' ('showed up', never 'won') `[VERIFY]`
- 2:11.2  C10 R(other) goldenkitty.vip hero → C10-goldenkitty-vip-faq-fan-dedication @2:13.5 `[VERIFY]`
- 2:22.2  C12 R(other) REAL DexScreener GOLDEN / GLD chart, comp pan (no '15x' text) `[VERIFY]`
- 3:16.3  C16 R(article) Robinhood Stock Tokens 'backed 1:1' (about GLD, no Golden Kitty art)
- 3:50.9  C15 R(other) REAL TradingView GLD two-year chart `[VERIFY ~+50%]`
- 4:08.1  C10b R(other) goldenkitty.vip disclaimer, 'not backed by ... cannot be redeemed'
- 4:37.8  C23 R(article) The Block, stock-paired quarter `[VERIFY]`
- 4:50.1  C23b R(article) The Block, Artificial Inu 135M (screen never shows 150M) `[VERIFY]`
- 4:58.4  C31 R(other) Datawallet 'StonkFun explained' (attribution Datawallet) `[VERIFY]`
- 5:04.4  C24 R(article) The Block 'STONK surges 250% to 140 million' (screen never shows 240M) `[VERIFY]`
- 5:21.8  C28 R(other) Datawallet holder-rewards line (attribution Datawallet; NO Golden Kitty on screen) `[VERIFY]`
- 5:32.7  C25 R(other) @LaunchOnSF 2026-10-01 post, two-stage zoom (date → text @5:37.8)
- 5:51.0  C26 R(other) Crypto Galaxy 'Tokenized gold narrative incoming' `[VERIFY]`
- 6:06.4  C17 R(article) Robinhood newsroom mainnet, July 1, 2026
- 6:11.0  C32 R(other) Robinhood Chain docs purpose line `[VERIFY]`
- 6:20.5  C18 R(other) REAL DefiLlama daily DEX volume (99B headline cropped out) `[VERIFY]`
- 6:54.2  C20 R(article) Vlad Tenev's own post, source wording, 'it works great for memes, too' @6:58.8
- 7:25.4  C29 R(article) The Crypto Times AMC-paired coin + guard label 'A DIFFERENT TOKEN' `[VERIFY single secondary]`
- Inserts: none (no clip INSERT, no lower-third, no receipt stamp in this video, PROJECT-LOG).

## VIDEO b-roll begins  (Envato)   26 (budget 26/30; 4 carry a LINE-CAPTION)
- 0:30.0 BR-1 crowd on phones + 'MORE THAN 28 MILLION CUSTOMERS' · 0:37.2 BR-2 gold bars · 0:47.0 BR-3 clock vortex (LEAD 4.24 s)
  · 1:04.3 BR-4 applause · 1:38.4 BR-5 golden trophies · 2:49.5 BR-6 molten gold · 2:51.2 BR-7 Ethereum coin · 2:53.9 BR-8
  money counter · 3:21.5 BR-9 vault door · 3:36.5 BR-10 balance scale · 3:56.5 BR-11 gold coins · 4:22.5 BR-12 trading floor ·
  4:36.3 BR-13 rocket · 4:43.1 BR-14 suburb pools + 'ACROSS MORE THAN 400 POOLS' · 4:48.2 BR-15 GPU circuit · 4:56.4 BR-16
  diver splash · 5:25.1 BR-17 hologram lab · 5:28.8 BR-18 festival crowd · 5:31.1 BR-19 gold leaf · 5:53.9 BR-20 bull ·
  6:15.6 BR-21 Earth at night (LEAD 4.9 s) + '24/7 IN MORE THAN 120 COUNTRIES' · 6:33.0 BR-22 jet engine · 7:05.7 BR-23
  gavel · 7:19.1 BR-24 camera flashes · 7:22.2 BR-25 marquee + 'A DIFFERENT MEME COIN' · 7:41.0 BR-26 seedlings
- Face-swap VIDEO LAYERS (not b-roll, the face itself): 0:00.0 F1-higgsfield-bg-swap.mp4 · 0:40.2 F2-higgsfield-bg-swap.mp4

## IMAGE b-roll begins  (ChatGPT stills)   13 placed (3 play as Seedance motion clips) · 0 BENCH
- 0:09.7 IMG-1 Ethereum vs stablecoin · 0:21.2 IMG-11 Vlad trophy overhead (MOTION clip, AI ILLUSTRATION) · 0:33.5 IMG-2 kitty
  rising from chain · 0:51.2 IMG-3 kitty spotlight question · 1:26.0 IMG-12 Vlad desk trophy (AI ILLUSTRATION) · 1:56.0 IMG-13
  Vlad trophy cabinet (AI ILLUSTRATION) · 3:14.1 IMG-4 golden spider · 4:20.0 IMG-5 kitty leads coin crowd (MOTION clip) ·
  4:45.3 IMG-6 Artificial Inu · 5:02.0 IMG-7 STONK launch · 6:03.5 IMG-8 kitty rooftop lime city · 6:50.8 IMG-9 Vlad podium
  (AI ILLUSTRATION, no trophy) · 7:37.5 IMG-10 token on gold bars (MOTION clip)

## LIGHT LEAKS (face holds > 5s, overlays.md: a pulse centred on the hold midpoint, d = min(len-2, 4), UNDER cover)   3
- 0:02.8 → 0:06.8  F1 (over the swap clip) · 2:04.7 → 2:08.7  F4 · 5:43.6 → 5:47.0  F7
  (F2, F3, F5, F6, F8, F9 are < 5 s: transition + punch only, NO leak)

## IMPACTS + RISERS (audio, mixed on with ffmpeg, NOT in comp; every file picked by MEASURED tail to -40 dB)   7 impacts · 1 riser
- 0:51.2 · 2:51.2 · 4:20.0 · 6:03.5  card impacts: Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (tail 1.07 s after
  the peak, rings out inside the 1.5 s pause; peak 0.09 s in, on the card-landing frame)
- 3:21.1 RISER Riser Sound Effect-2s.wav (peak at 2.01 s, ENDS on the hit, +10 dB clip gain) → IMPACT @3:23.1
  Impacts/Impact_Hit_01-2-18.wav (tail 1.64 s, peak 0.13 s in), the C1 marquee
- 7:01.0  both-tags slam: Impacts/Kick_Impact_01-short.wav (tail 0.36 s, peak 0.18 s in) on Bed E's slam-back (420.96)
- 7:36.7  VIBE CUT: Impacts/Impact_Hit_01-1.wav (weight 5, tail 4.84 s, faded out from 7:37.7) + the -4.2 dB bed duck +
  the F9 crash zoom, the biggest hit of the video
- Hard hits carried by the music file, NO kit SFX (fewer, bigger hits): 0:00.0 Bed A cold entry · 0:15.0 breakdown · 0:30.0
  rebuild · 0:40.1 F2 mid section · 0:46.9 the drop · 2:22.3 plateau · 3:36.2 swell crest · 4:08.4 peak falls away · 5:31.2
  band back · 5:45.5 accent · 5:52.5 closing run · 6:02.6 Bed D final chord on "spot" · 6:29.7 groove drop · 6:49.0 groove
  returns · 7:00.8 stop + slam (kick layered at 7:01.0) · 7:24.8 final run · 7:50.2 hard stop on "chain."
- Every impact/riser sits UNDER the VO (video-qa: short-term + peak vs VO on 10 s chunks, never integrated LUFS only).

## MUSIC beds (full carve = MUSIC-PLAN.json; license codes → YT description ONLY, this longform posts to Rumble / BitChute / Facebook)
- 0:00.0 → 0:51.2   Bed A `fearless` (Anthony Catacoli, Fearless), file 0.0, COLD_HOT, no fade-in, -22 dB under VO
  (gain -31.9) · lift +6 (abs -25.9) 0:15.0 → 0:30.0 · `ARAZC70SFALU4F6O`
- 0:51.2 → 2:51.2   Bed B `afterlife` (Bryant Lowry, Afterlife), source_in 41.65, -23 dB (gain -29.9), CH2 + CH3 as ONE
  sample-continuous placement (CH3 row file 112.61), no automation · `VZCIZWWGGT6HE5UC`
- 2:51.2 → 4:20.0   Bed C `slow-rise` (EVOE, Slow Rise), source_in 60.72, -23 dB (gain -27.0) · tamed -5 (abs -32.0)
  3:35.3 → 4:09.2 across the file's peak · `LMNT8RRL5UMI78DW`
- 4:20.0 → 6:03.5   Bed D `hello-and-good-morning` (Liberty, Hello, And Good Morning), source_in 11.48, enters hot, -22 dB;
  the file's own final chord lands on "spot" 6:02.6 · `ODK91F1ARECNTSSU`
- 6:03.5 → 7:50.5   Bed E `emerald-city` (Tiger Gang, Emerald City), source_in 37.45, -22 dB, CH6 + CH7 as ONE placement
  (CH7 row file 99.71) · lifts +6 (abs -24.6) 6:03.5 → 6:26.3 · 6:42.0 → 6:49.0 · 7:20.1 → 7:24.8 · THE vibe-cut duck
  -4.2 dB 7:36.5 → 7:37.6 · hard stop on "chain." 7:50.2, 0.25 s fade to 470.456 · `KSC0EIALPM9TAVCI`
- Bed changes on the four cards: outgoing bed fades 0.4 s from the card start, 0.6 s breath, incoming fades in over the last
  0.5 s of the 1.5 s pause. Levels against a measured -18.0 LUFS VO (Mike's kaspa-vprogs ruling: hype 22 under, explainer
  23 under). Mixer: `scripts/mix_music.py` merges the two cardless continuations (fixed 2026-10-01).

## CAPTIONS  (ON over the 9 FACE windows ONLY, never over a cover)
- The 9 FACE spans above; style strictly per skills/captions (captions-builder at comp time), topmost layer (above leaks).
- Mishear fixes inside FACE windows: 2:09.1 "ticker GOLDEN" (F4) · 5:43.9 + 5:45.4 "Golden Kitty" x2 (F7). Others from the
  AS-RECORDED list only matter if a caption ever lands on cover (it must not).
- SEPARATE device (not this track): 4 LINE-CAPTIONs burned on Envato clips (BR-1, BR-14, BR-21, BR-25) + the 'AI
  ILLUSTRATION' tag on IMG-9/11/12/13 + the 'A DIFFERENT TOKEN' guard label over C29.

## Open decisions that move these cues
- TRANSITIONS.md picks (card move flip vs slide, face pick FILM BURN vs Blocks·Max, the MELT/SPIN marquees): a card lead-in
  longer than the pause moves where each card scene STARTS over the outgoing cover (CH2 over BR-3, CH4 over BR-6, CH5 over
  contrast-priced, CH6 over C27-fin-2); the spine timecodes do not move.
- Card pause length: planned at the standard 1.5 s; any change shifts everything after each card (4 cards).
- 6:58.2 "End quote" vs "And, quote," (open by ear): moves only the caption text and the C20 highlight read; the highlight
  stays on 6:58.8 either way.
- 7:49.1 "the" vs "their" Robinhood chain (open by ear): caption-irrelevant (cover), end-card prompt unaffected.
- Music-carried hard hits with no kit SFX (0:00.0 hook, 6:29.7 groove drop): if Mike wants a kit hit on either, add
  Kick_Impact_01-short.wav (0.36 s tail) at the frame; nothing else moves.
- C30 Product Hunt homepage: if Mike records it himself, it replaces ph-card in 0:54.7 → 0:59.6 (same slot, no shift).
- Live-drift VERIFY items (C12 "15x" reads ~9x on the chart, cap 4.2M vs live 3.4M, 90B+, 1B+, 28.4M / 369B, 1-2%, 400+ pools,
  C29 single source): re-pulls change on-screen values only, never a cue time.
