# pieverse - WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.d.enhanced.mp4` (M:SS.s, 6:13.2 = 373.24 s, 1080p30, the enhanced audio). Timecodes from the spine
> word-transcript (`spine/ALL.d.enhanced.medium-words.json`) + the blackdetect FACE / COVER spans (AS-RECORDED.md). Sibling of
> EDIT-PLAN.md (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md section 2.
> FACE / COVER edges EXACT (blackdetect d=0.3 pix_th=0.10, measured on the d spine); state cues are word onsets checked word
> by word in `assets/diagrams/_state-cues.md`, `assets/slide-sources/_state-cues.md`, `assets/charts/C2.spec.md` + `C3.spec.md`.
> All timecodes are PRE-card-pause: the 4 silent title cards (>= 1 s each) shift the final timeline via `sh()` at comp.
> Ids: D* deck card · C1 system-design diagram · C2 / C3 animated charts · title-CH* title slides · END end card ·
> F* visible windows · FB* screen-share bodies (COVER-PLAN face_body).
> CH1 is first, nothing before it. FACE MODE = MIXED (house rule #1c). NO music, NO sound effects, NO captions, NO receipts,
> NO clip inserts, NO whiteboard, NO b-roll (Mike 2026-11-11). Nothing inserted shifts the timeline except the 4 card pauses.

## FACE spans (baked spine shows the face, ONLY here; blackdetect on the baked spine)   8 spans: 4 kind face + 4 kind screenshare
- 0:00.0 → 0:09.7   F1 kind: face, CH1 hook, "Pieverse went from around 12 cents to $2..."  (0.000-9.689; opens ON face)
- 0:19.2 → 0:28.6   F2 kind: screenshare, CH1, "And look at this ... $1.7 billion"  (19.189-28.555; BODY FB1 + FB2 = card D9)
- 1:44.5 → 1:48.7   F3 kind: screenshare, CH2, "where this token sits"  (104.522-108.722; BODY FB3 = diagram C1, token node)
- 2:19.2 → 2:25.2   F4 kind: face, CH3, "How many agents are actually running?"  (139.222-145.155)
- 2:51.0 → 2:57.8   F5 kind: screenshare, CH4, "new all-time high, $2.23"  (171.022-177.755; BODY FB4 = chart C2 to marker 3)
- 4:01.7 → 4:08.7   F6 kind: screenshare, CH4, "the 12-month lock ... ends"  (241.669-248.669; BODY FB5 = chart C3 to the marker)
- 5:34.9 → 5:39.3   F7 kind: face, CH5, "not for a chat app agent"  (334.902-339.335)
- 5:52.7 → 6:00.3   F8 kind: face, CH6 the read, "priced way ahead of the numbers it publishes"  (352.669-360.335)
- Visible 55.02 s (14.74%) = face 27.72 s + screen share 27.30 s; cover 318.22 s, edge to edge, no gap.
- Kind face (F1, F4, F7, F8): gated full-screen face, MEASURED reframe (face-reframe.json). Screen share (F2, F3, F5, F6): OBS
  layout verbatim (webcam bottom-right, CTA top-right), spine at identity, deck area x 0-1464 painted, stage scaled 0.7625.

## TRANSITIONS (chapters + face + container swaps; MANDATORY; the full per-cut list = TRANSITIONS.md)
THREE buckets: chapter cards = ONE card pick for all 4 · FACE cut in / out = the video's ONE face pick (film burn or
Blocks Max glitch, house rule #5) · container / diagram / chart swaps = the quiet scale-in swap (0.35 s, 0.93 to 1).
No AI stills and no Envato video in this video, so those buckets are empty.
SILENT PICKS ONLY (Mike 2026-11-11, no sound effects): `mix_music.py` lays a `lib:` transition's own sfx from
TRANSITION-PLAN.json with no mute switch, so every pick must be a `hand:` move or a library row that carries no sfx.
RESOLVED 2026-11-14 from TRANSITION-PLAN.json (35 scene changes, every one in TRANSITIONS.md §5): card = `rmn:flip` on both chapter cards · face cut in/out = `hand:film-burn` (hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn) · AI stills = none · marquees = none · Envato video = hand:fade · container / diagram swaps = hand:xfade-scale · punch-ins = hand:punch.
CHAPTER cards (ON only by the Convention 2 waiver approved at GATE 1; silent, self-contained pause scenes):
- 0:35.2  CH2 "WHAT IT IS" · 1:55.6  CH3 "WHAT'S REAL" · 2:31.6  CH4 "THE TOKEN" · 5:20.0  CH5 "WHO'S BEHIND IT"
FACE cut-ins (the face pick, at each black to face edge; a screen share takes the PLAIN face pick, never a face-style cut-in):
- in: 0:19.2 (F2 ss) · 1:44.5 (F3 ss) · 2:19.2 (F4) · 2:51.0 (F5 ss) · 4:01.7 (F6 ss) · 5:34.9 (F7) · 5:52.7 (F8)
  (0:00.0 = opens ON face, not a cut)
- out: 0:09.7 (F1) · 0:28.6 (F2 ss, the D9 body grows to full frame) · 1:48.7 (F3 ss) · 2:25.2 (F4) · 2:57.8 (F5 ss) ·
  4:08.7 (F6 ss) · 5:39.3 (F7) · 6:00.3 (F8)
Intra-FACE punch-ins: NONE. `spine/jumpcuts-final.json` has punch_points_total 0 (every face-window join sits inside the
0.5 s edge margin: 9.667, 145.0, 338.967, 359.9) and a screen share never takes one (overlays.md section 1: no join = no punch).
VIDEO b-roll transitions: none (no Envato). AI clip / IMAGE b-roll transitions: none (no ChatGPT).
CONTAINER / CHART scene changes = the quiet scale-in swap (see the CONTAINER section); C1 intra-diagram state swaps 0.3 s with
the shared pixels held; C1-path is a left-to-right linear mask reveal 88.50-89.10.
MARQUEE candidates (optional, transition-strategist's call; Mike's brief is a simple, presentation-style video, so a quiet swap
is the default and any marquee must be silent):
- MELT candidate 0:59.6 D2-s6 to C1-overview (the ONE system-design chart's entry; the C1 stills are pixel-locked for a clean transform) → NOT taken (see TRANSITIONS.md §4)
- SPIN candidate 4:16.7 D10-s3 to C3 return in the C3-switch look (the supply chart's second state, a new axis after the range card) → NOT taken (see TRANSITIONS.md §4)

## CHAPTER cards begin  (ON at CH2 to CH5 by the Convention 2 waiver; no bed to change)
- 0:00.0  CH1 "THE OPEN", NO card (first chapter) ; 0:35.2  CH2 "WHAT IT IS" (title-CH2) ; 1:55.6  CH3 "WHAT'S REAL"
  (title-CH3) ; 2:31.6  CH4 "THE TOKEN" (title-CH4) ; 5:20.0  CH5 "WHO'S BEHIND IT" (title-CH5) ; 5:52.7  CH6 "THE CLOSE",
  NO card (opens on F8). Each card = its own silent pause scene, >= 1 s, baked into the word-gap trough (34.76-35.20,
  115.24-115.56, 151.30-151.56, 319.74-319.98; lint-pause-silence on the source spine).

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   31 placements · 139 cue rows
> Types: **SLIDE(card)** deck card (house dark, no accent, state PNGs, hard swap) · **SLIDE(title)** title slide ·
> **CHART(sysdesign)** C1, Type 2 stills, comp-level push only · **CHART(anim)** C2 / C3, Type 1, real `useCurrentFrame`
> components from the geometry files (never a held PNG). Every hold gets a slow push (comp-build 7a).
- 0:09.7  SLIDE(card) D1 home page line, AI AGENT @0:12.4 · ITS OWN WALLET @0:13.8 · INSIDE YOUR CHAT APP @0:16.5
- 0:19.2  SLIDE(card) D9 snapshot in the F2 deck area (FB1): read date @0:20.7 · price 1.78 @0:22.8 · FB2 @0:25.0 FDV 1.78B
  @0:25.5 · FULL FRAME from 0:28.6 · all five lit @0:32.6 `[VERIFY record-day read: price, market cap, FDV, rank, ATH]`
- 0:35.2  SLIDE(card) D2 three framings: LITEPAPER @0:38.5 · TimeFi tag @0:44.6 · WHITEPAPER @0:46.3 · HOME PAGE @0:52.0 ·
  all three @0:56.0 · footer '3 framings, around 12 months' @0:57.0
- 0:59.6  CHART(sysdesign) C1 overview (the ONE whole view) · agent @1:01.2 · price pill @1:07.1 · hold @1:10.3 · wallet
  @1:12.9 · TEE chip @1:16.7 `[VERIFY plans 10 to 279]`
- 1:17.7  SLIDE(card) D17 custody quote, 'seed phrase custody' @1:19.6 · NOT WITH YOU @1:22.4
- 1:23.2  CHART(sysdesign) C1 RETURN (new state): chat app · swap bubble @1:27.4 · path run 1:28.5 to 1:29.1 · hold @1:30.2 ·
  Skill Store @1:31.9 · feed wire @1:33.5 · hold @1:35.1 · dashed A2A DOCUMENTED, DEFERRED @1:36.3
- 1:39.0  SLIDE(card) D4 'Live agent payments: deferred.' (llms.txt), 'deferred' @1:43.8 `[VERIFY wording]`
- 1:44.5  CHART(sysdesign) C1 in the F3 deck area (FB3): token node · NOT IN THE PRODUCT DOCS tag @1:47.1 `[VERIFY 0 mentions]`
- 1:48.7  SLIDE(card) D18 token jobs per the whitepaper: GOVERNANCE @1:50.8 · STAKING @1:51.6 · FEE DISCOUNTS @1:52.1 ·
  'Plans priced in USD' @1:53.2 (ACCESS dim, never lit)
- 1:55.6  SLIDE(card) D5 left half: ONE COUNTER @1:59.4 · 74,195 skills @2:02.0 · 25,233 merchants @2:03.9 `[VERIFY counters]`
- 2:05.7  SLIDE(card) D6 Skill Store split: 74,133 MIRRORED FROM CLAWHUB @2:07.3 · 30 NATIVE @2:11.0 · 5 PRICED @2:14.4 ·
  1 PAID INSTALL @2:17.3 (32 BUILT IN dim, never lit) `[VERIFY]`
- 2:25.2  SLIDE(card) D5 RETURN, NOT PUBLISHED half lands · AGENTS RUNNING @2:26.7 · PAYING SUBSCRIBERS @2:27.6 · REVENUE
  @2:28.7 · footer 'anywhere I checked' @2:29.8
- 2:31.6  CHART(anim) C2 price chart full frame: axes · head dot @2:33.6 · ALL-TIME LOW 0.119 @2:38.4 · draw on 2:39.8 ·
  jump @2:48.1 · UPBIT LISTING 1.184 @2:49.2 `[VERIFY Upbit date]`
- 2:51.0  CHART(anim) C2 continues in the F5 deck area (FB4), no restart: draw on @2:51.1 · ALL-TIME HIGH 2.23 @2:55.7 · end
  label AT RECORDING 1.78 @2:57.2 `[VERIFY no newer high]`
- 2:57.8  SLIDE(card) D21 Upbit only: 3.0B @3:02.0 · 53.8B @3:05.2 · 17.8x @3:08.6 `[VERIFY Upbit series]`
- 3:10.8  SLIDE(card) D24 IN THE COMMUNITY: BOT CALL @3:16.5 · MY CALL @3:20.1 · FAVORITES LIST @3:23.3 · SWING TRADING
  SOFTWARE @3:28.5 · AVAILABLE TO MEMBERS @3:30.3 `[VERIFY Mike's Discord]`
- 3:32.6  SLIDE(card) D25 MY COMMUNITY: LIFETIME MEMBERSHIP @3:41.1 · LINK IN THE DESCRIPTION @3:43.7
- 3:45.2  SLIDE(card) D19 circulating supply: AROUND 27% TO 40% @3:49.9 · three counts @3:53.3 `[VERIFY after the unlock]`
- 3:54.8  SLIDE(card) D8 allocation: Team & Advisors @3:58.2 · Investors @3:58.7 · Foundation @3:59.5 · = 45% @4:00.7
- 4:01.7  CHART(anim) C3 supply chart in the F6 deck area (FB5): launch step · months 1 to 11 @4:01.9 · 14 NOV 2026 marker
  @4:03.0 · switch-on 331.4M to 364.8M UNLOCKED @4:06.7 `[VERIFY tracker series]`
- 4:08.7  SLIDE(card) D10 14 NOV 2026: FIRST RELEASE @4:12.3 · around 33M @4:13.8 · around 86M @4:15.1 `[VERIFY what moved]`
- 4:16.7  CHART(anim) C3 RETURN full frame (second state): months 13 to 36 @4:16.8 · bracket '+33.4M a month / for 12 months,
  then less' @4:18.6 · 1,000M BY 14 NOV 2028 @4:21.5
- 4:22.4  SLIDE(card) D11 who holds it: 4 WALLETS 56.6% @4:23.4 · SEVEN 2-OF-3 MULTISIGS 67.35% @4:26.8 · KEPT BY SIGNERS
  @4:32.3 `[VERIFY balances + thresholds]`
- 4:35.1  SLIDE(card) D14 perps vs spot (bench version, no Binance number): venues @4:35.4 · perps 265.6M @4:37.2 · spot 21.4M
  @4:40.4 `[VERIFY volumes]`
- 4:41.2  SLIDE(card) D22 what holding it earns: STAKING IS LIVE @4:45.3 · 90 @4:47.5 · 180 @4:48.6 · 365 DAYS @4:49.4 · DAILY XP
  @4:52.0 · NOT MORE TOKENS @4:53.9 · 50 OR MORE = A BASIC AGENT @4:55.5 · XP 'future utility will be announced' @4:59.8
  (NO EARLY WITHDRAWAL dim) `[VERIFY staking page + guide]`
- 5:03.4  SLIDE(card) D23 PIP-5: Token Rewards @5:07.4 · 1,130 VOTES, 169,871 TOKENS @5:09.4 (never 170M) · UNDER 0.02% @5:12.3 ·
  since-the-vote footer @5:15.6 `[VERIFY Snapshot + any reward announcement]`
- 5:20.0  SLIDE(card) D20 THE TEAM: COLIN HO @5:22.1 · Ex-Google/Uber engineer (whitepaper) @5:24.1
- 5:27.5  SLIDE(card) D13 7M STRATEGIC ROUND: 24 OCT 2025 @5:28.1 · ANIMOCA BRANDS @5:32.8 · UOB VENTURES @5:33.7 (MVB footnote dim)
- 5:39.3  SLIDE(card) D15 WHAT TO WATCH: row 1 @5:41.4 · row 2 @5:45.1 · row 3 @5:49.8
- 6:00.3  SLIDE(card) D15 CALLBACK, all three rows lit (D15-s4), the one deliberate return
- 6:04.6  SLIDE(card) END end card under the CTA: LIKE @6:06.4 · SUBSCRIBE @6:07.3 · COMMENT @6:09.3 · prompt @6:10.9, held to
  6:13.2 (two empty 620x350 end-screen slots, x 300-920 / 1000-1620, y 392-742)

## RECEIPTS / inserts begin   0 (NO receipts and NO clip inserts by Mike's call, 2026-11-11)
- None. COVER-PLAN `receipts` and `clip_inserts` are empty (SCREENPLAY `## CLIP-INSERTS` = NONE); every data beat rides on a
  code card or chart that prints its source and read date. No lower-third (the link line has its own card, D25-s2 @3:43.7).

## VIDEO b-roll begins  (Envato + AI clips)   0
- None: `--envato-max 0` (Mike 2026-11-11). `assets/vid/` is empty.

## IMAGE b-roll begins  (stills + photos)   0 placed · 0 BENCH
- None: `--chatgpt-max 0` (Mike 2026-11-11). `assets/img/` is empty; no face-swap or image-motion clips for this video.

## LIGHT LEAKS (library leak ON a desilencer join inside a FACE window, overlays.md section 1)   0
- None: no window carries an interior join (jumpcuts-final.json punch_points_total 0), so no punch-in and no leak anywhere;
  a screen share never takes one.

## KINETIC TEXT (overlays.md section 2)   0 panels + 0 pops
- None: SCREENPLAY.md names no kinetic-text device id (and the no-SFX ruling would leave their paired sounds out anyway).

## IMPACTS + RISERS (audio, mixed on with ffmpeg, NOT in comp)   0 sounds
- NONE by Mike's ruling (2026-11-11, "no captions and no sound effects"). MUSIC-PLAN carries 0 hard hits. The 4 [CARD] rows
  write `[IMPACT] layer: none`, which `mix_music.py` skips by design (SFX-CHECK counts them as layer_none).
- Types weighed and left out, all by the same ruling: impacts, booms, risers, whooshes, braams, tension builders,
  downshifters, accents, drones, textures, dings, stings, kinetic-text sounds. No braam spine pause is planned.
- Transition sounds: see the SILENT PICKS line in TRANSITIONS (a library pick with an sfx would add a sound).

## MUSIC beds (bed · chapters · level · fades; license codes to the YT description ONLY)
- NONE: MUSIC-PLAN.json `no_music: true`, `beds: []` (Mike 2026-11-11, "No background music"). No bed, no carve, no breath at
  the cards, no duck, no license code to paste. The usage ledger records no track for this video.
- The mix_audio node still runs: with zero beds and zero SFX it applies only the voice gain and the peak limiter
  (MUSIC-PLAN open question 3, for Mike to confirm).

## CAPTIONS  (none)
- NONE anywhere (`caption_scope none`, Mike 2026-11-11): not on the 4 kind face windows, not on the 4 screen shares, not on
  covers. The AS-RECORDED mishear list still applies to every on-screen card word and to the title / description / chapters.

## Open decisions that move these cues
- **"170 million" (5:09.1-5:11.6, 309.06-311.64):** re-record, drop, or keep the D23 card fix (the plan-gate default). A drop
  removes about 2.6 s and every cue after 5:09 shifts earlier; a re-record re-cues D23-s2 / s3 / s4 to the new words.
- **CH3 face take (F4, 2:19.2-2:25.2):** swapping to the cleaner earlier take (raw 684.49-690.01) rebuilds the spine and
  transcript and moves every timecode after 2:19.2.
- **Voice vs card, each Mike's call (re-record or leave):** D19 prints 27% TO 40% while the VO says 27 to 31 (3:49.9) · C3
  plots the stepped-down tracker rate while the VO says 33 million every month to 2028 (4:18.6) · D9 prints FDV 1.78B while
  the VO says 1.7 billion (0:25.5). Any re-record re-cues that card's states.
- **Plug ad-libs dropped at defumble:** the bots sentence (raw 823.23-860.61) could return inside D24's span (CH4 from 3:10.8
  would lengthen); the "10x / 30x" line must stay out (guard 6).
- **Close:** the END card under the CTA (6:04.6-6:13.2, the plan-gate default) vs a plain CTA card vs a silent tail after
  6:12.9 (adds time; not recommended with no music).
- **Card pauses:** 4 silent pauses >= 1 s each add at least 4 s to the final runtime via `sh()`; the baker snaps each into its
  word-gap trough; a failed `lint-pause-silence` moves a card into the next clean trough.
- **Desilence joins (cue onsets may sit up to 0.3 s later):** 0:56.0 D2-s5 · 3:08.2 D21-s3 · 3:45.2 D19 · 4:41.2 D22.
- **Marquee:** whether the transition-strategist takes the MELT 0:59.6 / SPIN 4:16.7 candidates (silent only) or keeps quiet swaps.
- **Words heard differently, confirm by ear (no cue moves unless re-recorded):** "governance" 1:50.8 · "two or three signers"
  4:28.2 · "leveraged batched" 4:37.2 · "the guy says" 4:59.4 · "a chat app agent" 5:37.7 · "is priced" 5:57.4.
- **Record-day `[VERIFY]` re-pulls before the cards are built** (DATA.md 5a): D9 and C2's last point, D19, D11, D10 / C3, D5 / D6,
  D14, D22 / D23, the FB3 docs mention count, Mike's Discord claims behind D24. A changed figure is a card rebuild, not a cue move.
