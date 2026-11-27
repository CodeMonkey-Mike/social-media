# plan-to-make-millions - WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.e.enhanced.mp4` (M:SS.s, 9:50.2, 30 fps). Timecodes from the spine word-transcript
> (`spine/ALL.e.enhanced.medium-words.json`) + the blackdetect FACE/COVER spans in AS-RECORDED.md. Sibling of EDIT-PLAN.md
> (the event log, same seconds) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect); word cues to 0.1 s; frame-lock at comp.
> Ids: C-* / D-* / H* / E1 containers and diagrams · chart ids (C1, C2, C3, C5, C14, C16, C16-ZOOM, C23, C24, C-NVDA,
> C-SPACEX) · R-* and C7-C27 receipts · BR-* b-roll · IMG-* images · CLIP-* clip inserts · WB1 whiteboard.
> CH1 is first, nothing before it. Timeline shifters (all PRE-shift here, `sh()` at comp): the CH1 montage at 0:09.7
> (12.9 s, the spine paused) and the 3 card pauses (CH2 1:19.2, CH3 4:25.6, CH5 7:51.3, about 1.5 s each); delivered about
> 10:08. LIGHT mode on every card, chart and diagram (Mike 2026-11-22). Captions ON over FACE 1 to 3 only.

## FACE spans (baked spine shows the face - face appears ONLY here)   8 spans
Every span airs as its city-look Higgsfield bg-swap clip `assets/face-swap/F<n>-higgsfield-bg-swap.mp4` (spine audio kept).
- 0:00.0 → 0:07.0   CH1 F1 hook, "Crypto has been dumping..." (0.000-7.022, opens ON face)
- 0:09.9 → 0:16.3   CH1 F2 the turn, "Most people hear that..." (9.889-16.289)
- 0:46.8 → 0:53.6   CH1 F3 locked thesis, "I didn't find those by guessing..." (46.789-53.555)
- 3:36.5 → 3:44.0   CH2 F4 the landing, "five things stacked..." (216.528-223.961)
- 5:48.4 → 5:59.4   CH3 F5 the EVAA line, "But I'm absolutely fine with that..." (348.395-359.395, 11.0 s)
- 7:44.5 → 7:51.2   CH4 F6 the edge, "That's my edge..." (464.528-471.195, repaired 2026-11-23)
- 9:25.6 → 9:30.6   CH5 F7 locked goal, "Millions by 2028..." (565.601-570.567)
- 9:48.6 → 9:50.2   CH5 F8 sign-off, "And I'm gonna catch you guys later." (588.635-590.213, runs to EOF)

## TRANSITIONS (chapters + face + b-roll - MANDATORY; full per-cut list + picks = TRANSITIONS.md)
Every row below is marked `→TRANSITIONS.md` in the EDIT-PLAN; the transition-strategist assigns the ids (usage ledger gated:
card move, face pick, melt / spin looks, the face_leak set) and reconcile_docs.py fans them back.
CHAPTER cards (the video's ONE card move, picked in TRANSITIONS.md; ON only at a bed change):
- 1:19.2  CH2 "WHY EVERYTHING DUMPED" (+ Bed A out, Bed B in, card pause)
- 4:25.6  CH3 "THE TRADES" (+ Bed B out, Bed C in, card pause)
- 7:51.3  CH5 "THE PLAN TO 2028" (+ Bed C out, Bed D in, card pause; the page arrives bare at 7:51.2, title-CH5-s0)
FACE cut-ins (the video's face pick, at each black → face edge; 0:00.0 = opens ON face, not a cut):
- in: 0:09.9 · 0:46.8 · 3:36.5 · 5:48.4 · 7:44.5 · 9:25.6 · 9:48.6
- out: 0:07.0 · 0:16.3 · 0:53.6 · 3:44.0 · 5:59.4 · 7:51.2 · 9:30.6   (F8 has no out: HARD OUT at 9:50.2)
Intra-FACE punch-ins + light leaks (ONLY on the interior desilencer joins of spine/jumpcuts-final.json; F1-F5 have none):
- 7:50.6 F6 (join 470.567) · 9:29.9 F7 (join 569.867) · 9:49.5 F8 (join 589.5)
CLIP INSERT edges (bucket insert): insert-in 0:09.7 (R-HL4 hard cut into CLIP-1) · hard cuts CLIP-1 → 4 → 3 → 8 ·
insert-out into the CLIP-8 last-frame still (0:09.8) → F2.
VIDEO b-roll transitions (Envato = fade): 0:26.5 BR-1 · 0:53.6 BR-2 · 1:17.8 BR-3 · 1:53.7 BR-4 · 2:23.7 BR-5 · 2:35.9 BR-6 ·
2:50.1 BR-7 · 3:09.4 BR-8 · 3:59.7 BR-9 · 4:03.5 BR-10 · 4:21.8 BR-11 · 6:09.9 BR-12 · 6:17.0 BR-13 · 6:51.9 BR-14 ·
7:07.0 BR-15 · 8:15.6 BR-16 · 8:47.9 BR-17 · 9:22.0 BR-18 · 9:45.9 BR-19
AI IMAGE ingresses (glitch, Bad Signal family): 0:30.4 IMG-1 · 1:14.2 IMG-2 · 3:44.0 IMG-3 (shares the F4 out cut) ·
4:17.9 IMG-4 · 4:25.6 IMG-5 (after the CH3 card) · 5:00.1 IMG-6 · 7:51.3 IMG-7 (after the CH5 card) · 8:58.5 IMG-8
WHITEBOARD: 6:27.7 WB1 paper sheet in over 11 frames, out over 0.3 s at 6:51.9 (bucket 3 container move).
CONTAINER / CHART scene changes = cross-fade + 0.93 → 1 scale-in; state swaps inside one container = 6-frame cross-fade.
MARQUEE candidates for the reserved MELT / SPIN families (strategist's call, TRANSITIONS.md §4):
- 3:21.4 C-SPACEX → C1 FINAL (the centerpiece returns with all five callouts) → CHOSEN `lib:melt-rgb-soft-2` (MELT, 0.84 s)
- 5:26.1 D-ROTATE → C14 walk return (MELT: the rotations become the run) → CHOSEN `lib:melt-rgb-soft-short-2` (MELT, 0.60 s)
- 7:24.6 C16-ZOOM → C22 THE LOOP (SPIN: a new axis, the software) → CHOSEN `lib:spin-center-swinging-cw` (SPIN, 0.84 s)
- 8:25.9 D-ENTRIES → C22B (MELT: one loop becomes a tree of loops) → NOT taken, a quiet swap (TRANSITIONS.md §4)
  Text containers stay quiet.

## CHAPTER cards begin  (ON only at a bed change)   3 cards
- 0:00.0  CH1 "THE HOOK", NO card (first chapter) ; 1:19.2 CH2 "WHY EVERYTHING DUMPED" (title-CH2, red) ;
  4:25.6 CH3 "THE TRADES" (title-CH3, green) ; 6:12.2 CH4 "HOW I FIND THEM", NO card (Bed C continues as a carve) ;
  7:51.3 CH5 "THE PLAN TO 2028" (title-CH5-s0 then title-CH5, cyan)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   28 placements · 113 state rows
> CHART(anim) = code-built with motion (the PNGs are the design states) · CHART(sysdesign) = still swaps, comp-level motion
> only · SLIDE(card) / SLIDE(title) = the locked container stylesheet, LIGHT theme.
- 0:16.3  CHART(anim) C3 count-down, 2.718T → 2.021T @0:16.6 · 'AROUND 697B GONE' @0:18.7 · 'MINUS 25.6%' @0:22.1 `[VERIFY]`
- 0:33.9  CHART(anim) C16 HOOK, call 65M @0:36.1 · badge 'OVER 1B' @0:39.1 (no multiple)
- 0:39.9  CHART(anim) C14 HOOK, band @0:42.3 · '6.62 THE PEAK' @0:44.8 (no multiple, never 35)
- 0:57.0  SLIDE(card) H1 kinetic type, BUY THE BOTTOMS @0:57.0 · SELL THE PUMPS @0:58.2 · ROTATE @0:59.9
- 1:02.2  SLIDE(card) C26 roadmap (the CH1 overview), 1 @1:05.3 · 2 @1:07.4 · 3 @1:10.2 · all three @1:11.8
- 1:19.2  CHART(anim) C1 centerpiece s0, line to OCT 28 · callout 1 BINANCE HACK @1:28.2
- 1:37.9  CHART(anim) C1 s1b, AROUND 6.3B · COVERED THE LOSSES @1:38.7 · MINUS 4.3% @1:42.0
- 1:48.6  CHART(anim) C1 s2, callout 2 OIL 117 @1:51.6
- 1:57.2  CHART(anim) C5 Brent, 117.64 card @1:59.4 · dim fall to 92.57 @2:00.6
- 2:05.7  SLIDE(card) C6 prices, FED RAISES @2:07.2 · FIRST HIKE IN 3 YEARS @2:08.8
- 2:11.1  CHART(sysdesign) D-RATES chain, nodes @2:11.5 / 2:12.1 / 2:14.5 / 2:16.8 / 2:18.8 / 2:20.1
- 2:26.9  CHART(anim) C1 s3, ELECTION DAY tick @2:27.4 · callout 3 AFTER THE MIDTERMS @2:30.2
- 2:39.7  CHART(anim) C1 s3b + s4, MINUS 5.55% @2:41.5 · callout 4 NVIDIA'S CEO RESIGNS @2:45.6
- 2:52.3  CHART(anim) C-NVDA, the fall @2:52.4 · MINUS 47.5% @2:54.0 (dated, never 'now') `[VERIFY]`
- 2:56.6  CHART(anim) C1 s5, callout 5 ANTHROPIC LISTS @2:58.7
- 3:04.1  SLIDE(card) D-THEORY, eyebrow @3:04.5 · DASHED arrow @3:08.4
- 3:12.9  CHART(anim) C-SPACEX, listing @3:13.0 · low @3:14.4 · rally @3:16.4 · ONE TIME. NOT A RULE. @3:18.1
- 3:21.4  CHART(anim) C1 s6 FINAL, end card 61,173 / MINUS 24.7% @3:23.3 · all five lit @3:24.4 `[VERIFY]`
- 3:26.8  CHART(anim) C2 indices, S&P MINUS 11.6% @3:29.1 · NASDAQ-100 MINUS 19.84% CLOSE @3:32.9 · intraday line @3:35.9
- 3:47.6  SLIDE(card) D-PRIOR, SKEPTICAL @3:48.2 · BUT 10% OPEN TO IT @3:53.7
- 4:32.1  CHART(anim) C16 WALK, bot alert @4:36.1 · run @4:38.4 · pullback @4:40.6 · call @4:44.2 · NOV 18 tick @4:48.8
- 4:54.3  CHART(anim) C16 WALK return, 14X on the HIGH @4:56.0 · 30X on the read @4:58.3 `[VERIFY]`
- 5:05.3  CHART(anim) C14 WALK, frame · LAUNCHED OCT 3, 2025 tag @5:07.4
- 5:15.0  CHART(sysdesign) D-ROTATE, LAB @5:17.1 · GIGGLE FUND @5:20.6 · DCA @5:23.0 (names only)
- 5:26.1  CHART(anim) C14 WALK return, band @5:29.6 · 0.51 @5:33.5 · peak @5:36.7 · 13X bracket @5:40.6 · red drop @5:44.6 ·
  MINUS 64% @5:46.5 `[VERIFY]`
- 5:59.4  SLIDE(card) C17 multiples, 3.9x TO 5.3x AT 2.33 @6:03.1 `[VERIFY]`
- 6:04.4  SLIDE(card) D-COMMON (declared comparison), IN EARLY. BEFORE THE PUMP. @6:07.1
- 6:55.8  SLIDE(card) D-TELL, LONG LIST OF EXCHANGES @6:58.6 · FUNDING BEHIND IT @7:01.0 · LISTINGS COST MONEY @7:02.9
- 7:10.6  SLIDE(card) D-TELL return, FUNDED PROJECTS @7:12.7 · REAL BACKERS @7:14.2 · IN EARLY @7:17.0
- 7:17.6  CHART(anim) C16-ZOOM, ALREADY PUMPING @7:20.4 · WAIT FOR THE PULLBACK @7:21.5 · MY CALL @7:24.0
- 7:24.6  CHART(sysdesign) C22 THE LOOP, s1 @7:25.3 · BUY @7:29.7 · BUY ALERT @7:32.0 · SELL @7:33.2 · ROTATE @7:35.9 ·
  the circle closes @7:38.2
- 7:54.6  CHART(anim) C23 midterms, eyebrow @7:54.7 · bars grow @7:57.5 · 19 OF 19 @8:01.6 · stock-market tag @8:05.5 ·
  the three dips @8:06.8
- 8:09.2  CHART(anim) C24, THE LAST TWO TIMES @8:10.7 · bars @8:11.8 · 2.21x / 2.27x @8:13.8
- 8:18.6  SLIDE(card) D-ENTRIES statement, @8:18.9 / 8:20.6 / 8:22.4
- 8:25.9  CHART(sysdesign) C22B compounding, @8:28.2 / 8:29.4 / 8:30.5 / 8:32.4 / 8:35.7
- 8:38.1  CHART(sysdesign) T-2028 timeline, NOV 2026 @8:40.2 · 2027 @8:42.4 · 2028 + 2 FULL YEARS @8:46.3
- 8:51.8  CHART(sysdesign) D-IMAGINE (a labelled hypothetical), stake @8:53.5 · grow @8:56.3
- 9:02.4  CHART(sysdesign) D-IMAGINE return, hill @9:03.9 · pot @9:05.5 · 10 PLAYS @9:12.3 · grows @9:17.2 / 9:18.8 / 9:20.8
- 9:30.6  SLIDE(card) H0 MILLIONS BY 2028 (no SFX), I'M RUNNING THE LOOP. @9:34.7
- 9:36.0  SLIDE(card) E1 end card, LINK @9:36.6 · LIKE @9:41.8 · COMMENT @9:43.7

## RECEIPTS / inserts begin   21 receipts · 4 clip inserts   (treatment: pan 2 · highlight 10 · push 9)
- 0:07.0  R-HL1 · 0:07.7 R-HL2 · 0:08.4 R-HL3 · 0:09.0 R-HL4 (the 4-headline stack, hard cuts, push; R-HL4 = the lead-in)
- 0:09.7  ⏸ [INSERT] CLIP-1 Bloomberg (2.6 s) → CLIP-4 ABC News (3.2 s) → CLIP-3 CNN (3.5 s) → CLIP-8 Fox News (3.6 s), 12.9 s,
  each speaker's OWN voice, the spine paused at the trough after "headlines." (snaps about 9.815), Bed A ducks 14 dB,
  context caption band on each; lead-out = CLIP-8's last frame held 0.07 s into F2
- 0:23.3  C27 BTC TradingView REAL chart (push) `[VERIFY]`
- 1:29.2  C7 Binance incident update #2 (highlight 'approximately 6.3B', 'hot wallets were compromised')
- 1:32.1  R-ALJ Al Jazeera heist (highlight 'the biggest crypto heist on record'; push past the attribution dek)
- 1:43.5  R-BLOCK The Block (highlight the liquidations line) `[VERIFY]`
- 2:02.5  C10 BLS CPI (highlight 'advancing 9.1 percent the previous month')
- 2:31.2  C11 Fox Business midterm sweep (highlight 'AI regulatory concerns')
- 2:46.5  C8 Nvidia release on sec.gov (PAN, lib:motion-3d-pan-1-right)
- 2:59.6  C9 Al Jazeera Anthropic IPO (highlight 'the largest initial public offering in US history at 81bn')
- 3:55.0  C12 CoinDesk headline + causes paragraph (PAN, lib:motion-3d-orbit-2-right-down; no highlight)
- 4:07.4  R-NVDA-NEWS Nvidia newsroom reinstatement (highlight 'Reinstates')
- 4:14.7  R-NVDA-CHART NVDA daily REAL chart (push, no code label) `[VERIFY]`
- 4:27.4  C15 Pieverse CoinGecko REAL chart (push) `[VERIFY]`
- 4:50.4  C18 the channel's X post of Nov 19 (highlight; POST COLUMN ONLY, login panel and price card out of frame)
- 5:01.5  C13 EVAA CoinGecko REAL chart (push) `[VERIFY]`
- 6:12.2  R-NEWCOINS CoinGecko new listings scroll recording (push)
- 6:20.1  C20a cryptorich.vip home (highlight the since-2013 line, then the New Coin Alert bot card; no rug-pull card)
- 7:39.1  C20b showcase table (highlight the bot rows; tally 56 CALLS @7:41.2, 34 CALLED BY A BOT @7:42.6) `[VERIFY]`

## WHITEBOARD beats (hand-drawn clips, full frame)   1 beats · 24.14 s
- 6:27.7 → 6:51.9  WB1 the funnel (assets/whiteboard/WB1.mp4, from 0.00, paper-pastel pen, paper sheet in 11 f / out 0.3 s):
  NEW COINS @6:30.2 · BOTS FLAG ACTIVITY @6:36.2 · sieves @6:39.2 · FUNDING & BACKERS @6:41.1 · EXCHANGE LISTINGS @6:43.5 ·
  MARKET CAP @6:44.1 · HOLDERS @6:45.3 (a plain tag) · dots @6:46.1 / 6:46.8 / 6:47.7 · A HANDFUL OF PLAYS @6:50.1;
  no draw-on SFX; Bed C dips 2 dB under it; 3.97% of the delivered runtime, inside Mike's 30 s cap

## VIDEO b-roll begins  (Envato)   19 of 30 budget
- 0:26.5 BR-1 trading floor red boards · 0:53.6 BR-2 data scan · 1:17.8 BR-3 clock rewind · 1:53.7 BR-4 oil tanker ·
  2:23.7 BR-5 Capitol · 2:35.9 BR-6 tense traders · 2:50.1 BR-7 server aisle · 3:09.4 BR-8 rocket launch ·
  3:59.7 BR-9 flip calendar · 4:03.5 BR-10 control room · 4:21.8 BR-11 trader at desk · 6:09.9 BR-12 dice ·
  6:17.0 BR-13 tired eyes · 6:51.9 BR-14 eye reflection · 7:07.0 BR-15 roulette · 8:15.6 BR-16 bell · 8:47.9 BR-17 twenty
  dollar bill · 9:22.0 BR-18 river delta · 9:45.9 BR-19 city sunrise   (each once, every slot 4.0 s or less)

## IMAGE b-roll begins  (ChatGPT stills)   8 placed · 0 BENCH
- 0:30.4 IMG-1 trader, red monitors · 1:14.2 IMG-2 newsroom at dusk · 3:44.0 IMG-3 storm harbour + tanker ·
  4:17.9 IMG-4 empty trading floor · 4:25.6 IMG-5 Pieverse coin (real mark) · 5:00.1 IMG-6 EVAA coin (real mark) ·
  7:51.3 IMG-7 window, first light · 8:58.5 IMG-8 summit above the clouds

## LIGHT LEAKS (library leaks ON the interior FACE joins only - overlays.md section 1)   3 leaks
- 7:50.6 F6 · 9:29.9 F7 · 9:49.5 F8, each a `lib:lightleaks-*` from the video's set of 3-4 (usage ledger slot face_leak,
  picked in TRANSITIONS.md), peaking on the join frame with the punch-in step; F1-F5 have no interior join: no leak

## KINETIC TEXT (2023 motion + sound pairs; overlays.md section 2)   0 panels + 0 pops
- none: the screenplay names no `kt-` device; H1 and H0 are the video's own motion-type cards (container rows above)

## IMPACTS + RISERS (audio - mixed on with ffmpeg, NOT in comp; tails MEASURED to -40 dB, 2026-11-24)
- 1:19.2  CH2 card: Impacts/card-impact-layered.wav (epic, tail 1.14 s, rings out inside the pause)
- 4:25.6  CH3 card: Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (neutral, tail 1.08 s)
- 7:51.3  CH5 card: Impacts/Soundjay_Impact_Main_01-short.wav (neutral, tail 0.34 s, peak 0.34 s after the file start)
- 9:30.6  H0 'MILLIONS BY 2028': NO impact, NO bed dip (the vibe cut first written here was removed at GATE blueprint,
  2026-11-24: the music plan says "no hit", Mike ruled subtle after the intro)
- No risers, braams, downshifters, accents, whooshes or drones (the palette was weighed: see EDIT-PLAN "Sound design").
  Every MUSIC-PLAN hard hit is a music move or a card (0:00.0 · 0:09.7 · 0:09.9 · 0:16.3 · 0:31.5 · 0:46.8 · 0:53.4 ·
  1:19.2 · 3:36.5 · 4:25.6 · 5:43.6 · 6:14.4 · 6:27.7 duck · 7:51.3 · 8:47.4 · 9:29.4 · 9:48.6). No hit on H0
  (9:30.6): the drone's own lift on "that's my plan" carries it.

## MUSIC beds (bed · chapters · level · fades; license codes → YT description ONLY, in play order)
- 0:00.0 → 1:19.2   Bed A `focuser` (Neon Beach), CH1 only, the energetic bed, COLD OPEN, carved on its bar grid (drop 0:16.3,
  lift 0:31.5, step down 0:46.8, second drop 0:53.4), 16 to 18.8 dB under VO, ducked 14 dB under the montage, fades 0.4 s
  at the CH2 card · `5WH8X4RII7CDAU05`
- 1:19.2 → 4:25.6   Bed B `what-we-must` (Falls), CH2, ONE drumless pass, subtle, 19.5 dB under VO, leaves in its own breath
  before its first boom · `3PNUTPGKFO9NSTVH`
- 4:25.6 → 7:51.3   Bed C `oh-mega` (Suiteniss), CH3 + CH4, the calm intro / verse cuts only (never the chorus), 8 carved rows,
  17.5 dB under VO on its figures, 19.2 under WB1 (the -2 dB dip 6:27.7 → 6:51.5) · `5S5Z7G59FWXCILBA`
- 7:51.3 → 9:50.2   Bed D `sacral-i-feel-417-hz` (Moments), CH5, the drone, RIGHT-ALIGNED to its last tone on F8, 20 dB under
  VO, one swell tops 8:47.4, ends on "later." · `ETEORPHXRJHTSO60`
- Breaths on the three cards; none into CH4. Mixer check: the four montage duck windows must TILE 9.66 → 22.53 (mix_music.py
  --dry-run). QA the bed floor in a no-VO breath of each bed (MUSIC-PLAN notes), never integrated LUFS alone.

## CAPTIONS  (ON over FACE windows of the intro ONLY - never over a cover)
- 0:00.0 → 0:07.0 F1 · 0:09.9 → 0:16.3 F2 · 0:46.8 → 0:53.6 F3. Captions OFF 79.48 → 590.23 (Mike 2026-11-22), so F4-F8
  carry none. Montserrat house style (captions-builder at comp), the AS-RECORDED mishear list applied (Pieverse, EVAA).

## Open decisions that move these cues
- CH1 montage: built as scripted (CLIP-1, 4, 3, 8, 12.9 s). Option (c) CLIP-5 for CLIP-4 adds 4.5 s after 0:09.7; option (d)
  no montage removes 12.9 s (everything after 0:09.7 shifts in the delivered cut, no spine cue moves).
- RULED 2026-11-24 (GATE blueprint, Mike's standing approval): the vibe cut this plan had added on H0 (9:30.6) is dropped
  (MUSIC-PLAN asks for no SFX there; subtle after the intro). Nothing else moved.
- C1 FINAL end label: 61,173 / MINUS 24.7% from the read (chart-builder) vs the NOV 20 close's MINUS 27.6% (COVER-PLAN):
  one label, re-pulled on render day `[VERIFY]`; every live-drift figure (C3, C27, C1, C2, C-NVDA, C16, C14, C17, C20b) is
  re-pulled at render.
- 'GIGGLE FUND' spelling on D-ROTATE (5:20.6), to confirm against the project's own name.
- Card pause lengths (about 1.5 s each) and the baker's trough snaps (79.20 / 265.60 / 471.33, and the montage at about
  9.815) are set by card_pauses; every delivered time after them shifts with them.
- TRANSITIONS.md picks (card move, face pick, the leak set, the marquee MELT / SPIN) are still to come: they change looks,
  not times.
