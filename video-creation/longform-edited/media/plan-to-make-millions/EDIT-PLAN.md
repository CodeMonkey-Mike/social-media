# plan-to-make-millions - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author off the graph's seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py) + AS-RECORDED.md +
> `spine/ALL.e.enhanced.medium-words.json` + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Open flags and the
> 2026-11-23/24 rulings) + `spine/jumpcuts-final.json` + `assets/diagrams/_state-cues.md` + `assets/charts/*.spec.md` +
> the slide STATES table in `assets/slide-sources/containers.html` (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md`
> §1; per the §0 ORDER note the Remotion comp is built TO this log, the render confirms it).
> Watch file: `spine/ALL.e.enhanced.mp4` (590.23 s / 9:50.2, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause and
> PRE-montage: the 3 title-card pauses (about 1.5 s each) and the 12.9 s CH1 montage (CLIP-1, 4, 3, 8 at one splice)
> shift the delivered timeline via `sh()` at comp; no chain shift is re-applied here. Delivered runtime about 10:08.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (the transition-strategist authors it next).
> Cards: the CH2 / CH3 / CH5 pauses are written at the trough the baker snaps to (COVER-PLAN dry runs: 79.20, 265.60,
> 471.33; AS-RECORDED plans 79.48 / 265.72 / 471.06). One SAY onset moved to its measured word start: CH5 "So why am I..."
> at 471.46 (COVER-PLAN dry run; Whisper's segment start 471.06 sits in the trough the card pause takes).
> FACE: all 8 windows AIR AS THE CITY-LOOK Higgsfield bg-swap clips `assets/face-swap/F<n>-higgsfield-bg-swap.mp4`
> (Mike approved the look 2026-11-23; SWAP-RETIME ok on each), played from each clip's `window_starts_at_clip_s`, SPINE
> AUDIO KEPT (video-only swap). Captions ON over FACE 1 to 3 ONLY (Mike 2026-11-22, Captions OFF 79.48-590.23), never
> over a cover. Punch-in + library light leak ONLY on the 3 interior joins of `spine/jumpcuts-final.json` (F6 470.567,
> F7 569.867, F8 589.5); F1 to F5 have their only join on a window edge, so no punch and no leak there.
> SFX: every file is named with its `mood_class` and its MEASURED audible tail (ffmpeg, envelope to 40 dB under peak,
> 2026-11-24). Music + SFX are an ffmpeg post-mix (comp-build §9). Fewer, bigger hits: 3 card impacts, nothing else.
> ZERO ORPHANS: every file in `assets/` is PLACED with a timecode below or marked BENCH / REJECTED in the reconciliation
> at the end (no BENCH items remain).

## CH1 - THE HOOK (0:00.0-1:19.2, Bed A `focuser`, card OFF, captions ON over FACE 1-3)
```
0:00.0  [FACE] F1 opens ON face → 0:07.0 (window 0.000-7.022), AIRS AS assets/face-swap/F1-higgsfield-bg-swap.mp4 from
        clip 0.400 s (window_starts_at_clip_s; residual 10 ms; window.json ends at 6.967, the frame at the 7.000 join is
        black), spine audio kept; framing checked against assets/face-reframe.json at verify_comp; no cut-in (the
        video opens here); no punch, no leak (the only join, 7.000, sits on the window edge)
0:00.0  [CAPTION] ON → 0:07.0 (F1; intro FACE scenes only; montserrat house style, AS-RECORDED mishear list applied)
0:00.0  [MUSIC] Bed A `focuser` (Neon Beach, Focuser, 5WH8X4RII7CDAU05) COLD OPEN from its first kick (file 0.04),
        -18.8 dB under VO, no fade-in → 0:09.9 · HARD HIT 0.00: the file's first kick IS the hit, no SFX layered on
        the first word
0:00.0  SAY:  "Crypto has been dumping, stocks have been dumping,"
0:03.2  SAY:  "and this is exactly where I plan to make millions in 2028."
0:07.0  [TRANSITION] face→cover F1 out → hand:film-burn (face-cut, 0.76s) (face pick)
0:07.0  [RECEIPT] R-HL1 IN → 0:07.7 R-HL1-techcrunch-headline.png: TechCrunch, Nov 1, 2026, 'Binance resumes withdrawals
        following 6.3 billion breach', full width, card 1 of the 4-headline stack, HARD cuts between the four
        `[VERIFY]` · treatment: push (a flash under 2 s)
0:07.2  SAY:  "Just listen to the last few weeks of headlines."
0:07.7  [RECEIPT] R-HL2 IN → 0:08.4 R-HL2-aljazeera-headline.png: Al Jazeera, Oct 30, 2026, 'Oil flows are up as Iran war
        turmoil eases. Why do prices keep rising?' (the oil link has no voice in the montage) · treatment: push
0:08.4  [RECEIPT] R-HL3 IN → 0:09.0 R-HL3-foxbusiness-headline.png: Fox Business, Nov 12, 2026, 'Nvidia shares sell off as
        CEO Jensen Huang resigns' (the live headline, read at capture); headline ONLY, body and quote widget out of
        frame (guard 5) · treatment: push
0:09.0  [RECEIPT] R-HL4 IN → 0:09.8 R-HL4-fool-headline.png: The Motley Fool, Nov 20, 2026, 'Stock Market Today: Stocks
        Plunge as AI Trade Unwinds'. It is the montage LEAD-IN: no first-frame still by design (screenplay SHOW: the
        last crop holds the set-up line and cuts HARD into CLIP-1 at the splice); R-HL4 never returns · treatment: push
0:09.7  [MUSIC] the headline montage: no move written: mix_music.py ducks Bed A 14 dB under each clip from the
        paused-spine sidecar (MIXER CHECK: run --dry-run, the four duck windows must TILE 9.66 to 22.53, never stack on
        the shared splice); Bed A plays on bars 4 to 10 under the clips and fades 2.0 s under the end of CLIP-8;
        no hit, riser or whoosh under a clip voice
0:09.7  [INSERT] CLIP-1 SPLICED CLIP, 2.6 s (assets/clip-inserts/CLIP-1-bloomberg-crypto-exchange-hacked.mp4, source 0:12.3
        to 0:14.9): the spine PAUSES in the trough after "headlines." (9.66 to 10.00, the baker snaps to about 9.815)
        and the clip plays FULL-FRAME with the Bloomberg Television anchor's OWN voice, "the world's largest crypto
        exchange was hacked." Caption band at the TOP (the source carries its own lower-third): 'Bloomberg Television,
        October 30, 2026'. Montage cut 1 of 4, hard cuts between clips, plan order = play order (date order) ·
        [TRANSITION] insert-in → hand:cut (insert-in, 0.00s) (bucket insert)
0:09.7  [INSERT] CLIP-4 SPLICED CLIP, 3.2 s (assets/clip-inserts/CLIP-4-abc-democrats-control-congress.mp4, 0:24.3 to
        0:27.5), back to back after CLIP-1, ABC News's OWN voice, "Democrats have taken control of both the House and
        Senate,"; caption 'ABC News, November 4, 2026' (band to the top if a network lower-third shows); a plain
        results line, the political colour stays out of the cut (guard 8). Montage cut 2 of 4
0:09.7  [INSERT] CLIP-3 SPLICED CLIP, 3.5 s (assets/clip-inserts/CLIP-3-cnn-huang-resigned.mp4, 1:32.1 to 1:35.6), the CNN
        anchor's OWN voice, "So we know he is out. He has resigned effective immediately." (the SHORT cut only, guard
        5); caption 'CNN, November 12, 2026, the day Nvidia announced its CEO's resignation'. Montage cut 3 of 4
0:09.7  [INSERT] CLIP-8 SPLICED CLIP, 3.6 s (assets/clip-inserts/CLIP-8-fox-historically-bad-day.mp4, 0:22.7 to 0:26.3 as
        MEASURED on the audio), Bret Baier, Fox News, OWN voice, "We begin with a historically bad day on Wall
        Street."; caption 'Fox News, on the November 20, 2026 session'. The first 0.7 s still shows the prior story's
        lower-third, as broadcast (PROJECT-LOG 2026-11-24, for Mike to see). Montage cut 4 of 4, the closer ·
        [TRANSITION] insert-out → hand:cut (insert-in, 0.00s) (bucket insert)
0:09.8  [RECEIPT] CLIP-8 LEAD-OUT IN → 0:09.9: the LAST frame of CLIP-8 held as a still from the resume point (about
        9.815) to the first frame of FACE 2 (9.889), 0.07 s; Bed A's re-entry swell runs under it · treatment: push
        (a held still)
0:09.9  [TRANSITION] cover→face cut-in F2 → hand:film-burn (face-cut, 0.76s) (face pick)
0:09.9  [FACE] F2 IN → 0:16.3 (window 9.889-16.289) AS assets/face-swap/F2-higgsfield-bg-swap.mp4 from clip 0.400 s
        (residual 20 ms); no punch, no leak (the only join, 16.267, is on the edge)
0:09.9  [CAPTION] ON → 0:16.3 (F2)
0:09.9  [MUSIC] Bed A row 2, FACE 2: HARD HIT 9.94: the groove re-enters on the bar 13 line (file 28.629) with a 0.2 s
        swell, full on "Most", -18.3 dB; bar 15, the fill bar, rises under "I hear that and I start buying"; no SFX
0:09.9  SAY:  "Most people hear that and they start selling."
0:12.9  SAY:  "With me, I hear that and I start buying."
0:16.3  [MUSIC] Bed A row 3, HARD HIT 16.27: the DROP, chorus 1 of the file (file 34.959, +2.5 LU, -16.0 dB under VO) on
        the cut to the size-of-the-dump chart, 0.05 s after "buying"; the music drop is the hit, no impact layered
0:16.3  [TRANSITION] face→cover F2 out → hand:film-burn (face-cut, 0.76s)
0:16.3  [CHART] C3 IN → 0:23.3 (LIGHT, gold), start state C3-start.png: 'TOTAL CRYPTO MARKET CAP' at 2.718T, OCT 29, 2026;
        frame fades + scales in (0.985 → 1, 10 frames). A REAL count-down in code (useCurrentFrame), never a wiped PNG
        `[VERIFY]` live drift, re-pull cmc-global-hist at render
0:16.5  SAY:  "Look at the size of this."
0:16.6  [CHART] C3 the count + draw run (ease-out cubic, 16.60 → 18.60), C3-mid.png = a real mid print (2.505T, NOV 10,
        2026); the date line steps day by day, the gold area reveals with the head
0:18.4  SAY:  "Around $700 billion wiped out of crypto"
0:18.7  [CHART] C3 'AROUND 697B GONE' lands on "700 billion" (18.72) with the 2.021T NOV 21, 2026 end label
0:21.5  SAY:  "in around three weeks."
0:22.1  [CHART] C3 payoff C3-payoff.png: 'MINUS 25.6%' pill lands on "three weeks" (22.12); hold to 23.30
0:23.3  [RECEIPT] C27 IN → 0:26.5 C27-tradingview-btcusd-daily.png REAL chart: Bitcoin daily on TradingView, the October to → hand:xfade-scale (container-xfade, 0.35s)
        November 2026 slide in view, slow push toward the last candles, never restyled, capture date in frame
        `[VERIFY]` · treatment: push (a figure panel read off the screen)
0:23.5  SAY:  "Bitcoin down around 25% in a month."
0:26.3  SAY:  "And stocks just had their worst week since April 2025."
0:26.5  [VIDEO] BR-1 IN → 0:30.4 BR-1-distressed-trader.mp4: a stock exchange floor, traders under red boards, cool daylight,
        no readable ticker (3.9 s) · Envato fade → hand:fade (broll-fade, 0.50s)
0:30.4  [IMAGE] IMG-1 IN → 0:33.9 IMG-1-trader-red-monitors.png: a lone trader from behind, a wall of red monitors out of
        focus, one hand calm on the mouse (3.5 s still) · glitch ingress → lib:badsignal-max-3 (glitch-still, 0.76s)
0:30.6  SAY:  "And a market like this is where my low entries come from."
0:31.5  [MUSIC] HARD HIT 31.54: the second lift inside chorus 1 (bar 23, file 50.23), as the file plays it; no SFX
0:33.9  [CHART] C16 HOOK IN → 0:39.9 (LIGHT, gold), C16-hook-start.png: frame in (opacity, 8 frames), the Pieverse daily → hand:xfade-scale (container-xfade, 0.35s)
        line draws on fast from NOV 14, 2025 to DEC 2, 2025 (33.95 → 36.00)
0:34.0  SAY:  "Pieverse, I called it around a 65 million market cap"
0:36.1  [CHART] C16 hook-mid C16-hook-mid.png: 'MY CALL, AROUND A 65M CAP' + the filled call dot land on "65 million"
        (36.12) and the MARKET CAP badge appears at AROUND 65M (65M, ruling 2026-11-23, never 60M); the line then draws
        on to the read while the badge counts 65M → 1B in step with the head
0:37.7  SAY:  "and it went to over a billion."
0:39.1  [CHART] C16 hook-payoff C16-hook-payoff.png: the badge locks on 'OVER 1B' on "billion" (39.12). Two market caps
        only, NO multiple anywhere in the hook (guard 2) `[VERIFY]`
0:39.9  [CHART] C14 HOOK IN → 0:46.8 (LIGHT, gold), C14-hook-start.png: the EVAA daily line already drawn to OCT 27, 2026; → hand:xfade-scale (container-xfade, 0.35s)
        39.95 → 42.10 it draws on to the read INCLUDING the red NOV 22 drop
0:40.0  SAY:  "EVAA, our lowest entries were around"
0:42.0  SAY:  "a three to $4 million market cap"
0:42.3  [CHART] C14 hook-band C14-hook-band.png: the entry band 'AROUND A 3M TO 4M CAP' lights on "three to 4 million"
        (42.32)
0:44.2  SAY:  "and it ran more than a 35X from there."
0:44.8  [CHART] C14 hook-payoff C14-hook-payoff.png: '6.62, NOV 21, 2026 / THE PEAK' lands (44.78); hold to the F3 edge.
        FLAG 44.48: the VO says 35X, the screen prints NO multiple, never 35 (Mike 2026-11-23 "keep it") `[VERIFY]`
0:46.8  [TRANSITION] cover→face cut-in F3 → hand:film-burn (face-cut, 0.76s) (face pick)
0:46.8  [FACE] F3 IN → 0:53.6 (window 46.789-53.555) AS assets/face-swap/F3-higgsfield-bg-swap.mp4 from clip 0.400 s
        (residual 10 ms); no punch, no leak (the only join, 53.467, is on the edge)
0:46.8  [CAPTION] ON → 0:53.6 (F3, the last captioned face of the video)
0:46.8  [MUSIC] Bed A row 4, HARD HIT 46.815: a step DOWN 2.4 LU to the verse groove (file 98.232, -18.4 dB) for the
        locked thesis; its fill bar rises under "every single token that launches"; no SFX
0:46.8  SAY:  "I didn't find those by guessing."
0:49.2  SAY:  "I built software that scans every single token"
0:52.6  SAY:  "that launches."
0:53.4  [MUSIC] Bed A row 5, HARD HIT 53.361: the second DROP, chorus 2 (file 104.777, -16.1 dB), 0.08 s ahead of "It
        finds them early", held to the CH2 card; no SFX
0:53.4  SAY:  "It finds them early, then I swing trade them."
0:53.6  [TRANSITION] face→cover F3 out → hand:film-burn (face-cut, 0.76s) ("It" starts 0.12 s under F3's last frames: the cover takes the
        frame at the measured picture edge 53.555, never the Whisper word edge)
0:53.6  [VIDEO] BR-2 IN → 0:57.0 BR-2-data-scan.mp4: a monitor of fast scrolling data rows scanned line by line, no
        readable brand (3.4 s) · Envato fade → hand:film-burn (face-cut, 0.76s)
0:57.0  [CONTAINER] H1 IN → 1:02.2 (LIGHT, gold) kinetic-type card, state H1-s1.png: 'BUY THE BOTTOMS' (57.04) → hand:xfade-scale (container-xfade, 0.35s)
0:57.0  SAY:  "Buy the bottoms, sell the pumps,"
0:58.2  [CONTAINER] H1-s2.png: 'SELL THE PUMPS' lands (58.20)
0:59.7  SAY:  "then rotate the profits into the next one."
0:59.9  [CONTAINER] H1-s3.png: 'ROTATE' lands (59.94); hold to 62.25. No numbers
1:02.2  [CONTAINER] C26 IN → 1:14.2 (LIGHT, gold) roadmap: the frame enters with the three cards held back in the comp → hand:xfade-scale (container-xfade, 0.35s)
        (the declared CH1 overview, OVERVIEW_REFS)
1:02.4  SAY:  "So in this video, I'm gonna show you three things."
1:05.3  [CONTAINER] C26-s1.png: 1 'WHY EVERYTHING DUMPED' on (65.30)
1:05.3  SAY:  "What's really behind this dump,"
1:07.4  [CONTAINER] C26-s2.png: 2 'THE TRADES' on, 1 done (67.40)
1:07.4  SAY:  "the two trades with my real entries"
1:09.7  SAY:  "and the software and the plan"
1:10.2  [CONTAINER] C26-s3.png: 3 'THE SOFTWARE AND THE PLAN' on (70.18)
1:11.8  [CONTAINER] C26-s4.png: all three lit together on "all the way to 2028" (the overview), hold to 74.15
1:11.8  SAY:  "that I'm running all the way to 2028."
1:14.2  [IMAGE] IMG-2 IN → 1:17.8 IMG-2-newsroom-dusk.png: a glass-walled newsroom at dusk, screens red and blurred (3.6 s
        still) · glitch ingress → lib:badsignal-max-2 (glitch-still, 0.76s)
1:14.3  SAY:  "Now, none of this makes sense until you understand this dump."
1:17.8  [VIDEO] BR-3 IN → 1:19.2 BR-3-clock-rewind.mp4: clock hands spinning backwards (1.45 s), holds to the CH2 card
        pause · Envato fade → hand:fade (broll-fade, 0.35s)
1:17.9  SAY:  "So let's take it from the top."
```

## CH2 - THE DUMP (1:19.2-4:25.6, Bed B `what-we-must`, card ON)
```
1:19.2  [CARD] CH2 title-CH2.png "WHY EVERYTHING DUMPED" · [IMPACT] card-impact-layered.wav · [TRANSITION] card → hand:cube-3d (card, 0.40s)
        LIGHT title slide, red accent; edit-time pause about 1.5 s, zero spine time, baked at the trough 79.20 (planned
        79.48; dry-run checked); the card move is the video's ONE card move. IMPACT: Impacts/card-impact-layered.wav,
        mood_class epic, weight 5, measured tail 1.14 s at -40 dB, peak at file 0.03 s, ON the card's first frame,
        ~0.55 gain: it rings out inside the pause, nothing under a word
1:19.2  [MUSIC] Bed A fades 0.4 s at the card (no music hit, the card impact owns it) · Bed B `what-we-must` (Falls, What
        We Must, 3PNUTPGKFO9NSTVH) ONE drumless pass, file 0.0 → 187.4, rises from silence under the card, breath
        0.9 s, -19.5 dB under VO, first swell tops on "since October" (80.8) → 4:25.6 · HARD HIT 79.48
1:19.2  [CHART] C1 THE CENTERPIECE IN → 1:29.2 (LIGHT, red), state C1-s0.png: Bitcoin daily close from OCT 1, 2026; the → hand:xfade-scale (container-xfade, 0.35s)
        frame comes in after the card; 79.30 → 82.84 the line draws OCT 1 → OCT 28 (ease-in-out) and holds. One chart
        for the chapter, every return a NEW state, callouts stay once landed (newest lit, earlier dim)
1:19.5  SAY:  "So here's Bitcoin since October."
1:21.9  SAY:  "Watch where it breaks."
1:22.8  SAY:  "October 29th, Binance,"
1:25.7  SAY:  "the biggest crypto exchange in the world gets hacked."
1:27.6  [CHART] C1 the line steps one day to OCT 29 (87.6 → 88.1)
1:28.2  [CHART] C1-s1.png: callout 1 'OCT 29, 2026 / BINANCE HACK' lands on "hacked" (88.22); hold to 89.20
1:28.9  SAY:  "Around $6.3 billion gone,"
1:29.2  [RECEIPT] C7 IN → 1:32.1 C7-binance-incident-update-2.png: the Binance post 'Security Incident Update #2', a settling → hand:xfade-scale (container-xfade, 0.35s)
        push, then [HIGHLIGHT] on 'approximately 6.3B' (the figure he has just said) and 'hot wallets were compromised';
        no attribution on screen (guard 4) · treatment: highlight
1:32.1  [RECEIPT] R-ALJ IN → 1:37.9 two stages: R-ALJ-headline.png (Al Jazeera, Oct 30, 2026, 'Binance says 6.3bn stolen → hand:xfade-scale (container-xfade, 0.35s)
        in biggest crypto heist in history: what we know'; push PAST the dek's 'linked to North Korean hackers', never
        highlight it), then R-ALJ-sentence.png, [HIGHLIGHT] on the body's 'the biggest crypto heist on record' on his
        words (94.38) · treatment: highlight
1:32.2  SAY:  "most of it in around 20 minutes."
1:34.4  SAY:  "It's the biggest crypto heist on record."
1:37.9  [CHART] C1 returns, C1-s1b.png: callout 1 headline gains ', AROUND 6.3B' → hand:xfade-scale (container-xfade, 0.35s)
1:38.1  SAY:  "Binance covered the losses,"
1:38.7  [CHART] C1 tag 'BINANCE COVERED THE LOSSES' (98.74)
1:40.2  SAY:  "but Bitcoin still dropped more than 4% that day."
1:42.0  [CHART] C1 tag 'BITCOIN MINUS 4.3% THAT DAY' lands on "4%" (102.04); hold to 103.50
1:43.5  [RECEIPT] R-BLOCK IN → 1:48.6 R-BLOCK-headline.png (The Block, Oct 29, 2026, the market story on the hack), push to → hand:xfade-scale (container-xfade, 0.35s)
        R-BLOCK-liquidations.png, [HIGHLIGHT] on the liquidations line (1.55B liquidated, CoinGlass) on "$1.5 billion"
        `[VERIFY]` · treatment: highlight
1:43.6  SAY:  "And over $1.5 billion in leveraged trades got wiped out."
1:48.6  [CHART] C1 returns, C1-s2.png: 108.9 → 109.4 the line advances to OCT 30 → hand:xfade-scale (container-xfade, 0.35s)
1:48.7  SAY:  "The next day, oil closes above $117 a barrel."
1:51.6  [CHART] C1 callout 2 'OCT 30, 2026 / OIL 117' on "117" (111.64), callout 1 dims; hold to 113.65
1:53.7  [VIDEO] BR-4 IN → 1:57.2 BR-4-oil-tanker.mp4: an oil tanker under way on grey water, aerial, overcast (3.5 s); nothing
        on screen says the strait is closed (guard 7) · Envato fade → hand:fade (broll-fade, 0.50s)
1:53.8  SAY:  "That's the war with Iran and the supply crunch"
1:56.6  SAY:  "out of the Strait of Hormuz."
1:57.2  [CHART] C5 BRENT CRUDE IN → 2:02.5 (LIGHT, red), C5-start.png: sub-title 'STRAIT OF HORMUZ', the '72.48, FEB 27, → hand:xfade-scale (container-xfade, 0.35s)
        2026 / BEFORE THE WAR' card lit from the start; 117.30 → 119.30 the line draws FEB 27 → OCT 30 (C5-mid.png)
1:58.2  SAY:  "And it's been building since February."
1:59.4  [CHART] C5 the '117.64, OCT 30, 2026' card + filled dot land (119.38), the before-war card dims
2:00.3  SAY:  "It pushed prices up for everyone."
2:00.6  [CHART] C5 payoff C5-payoff.png: the dim fall to 92.57 on NOV 20, 2026 has drawn (119.50 → 120.60), nothing
        cropped, past tense on screen (guard 7); hold to 122.45
2:02.5  [RECEIPT] C10 IN → 2:05.7 C10-header.png (the BLS Consumer Price Index release of Nov 10, 2026), push to → hand:xfade-scale (container-xfade, 0.35s)
        C10-gasoline.png, [HIGHLIGHT] on 'advancing 9.1 percent the previous month' on "9%" (FLAG 122.60: September 2026,
        never 'this month') · treatment: highlight
2:02.6  SAY:  "Gas jumped around 9% in a single month."
2:05.7  [CONTAINER] C6 PRICES card IN → 2:11.1 (LIGHT, red), C6-s1.png: 'GASOLINE PLUS 9.1%, SEPTEMBER 2026' already lit → hand:xfade-scale (container-xfade, 0.35s)
2:05.8  SAY:  "And in September, the Fed raised interest rates"
2:07.2  [CONTAINER] C6-s2.png: 'THE FED RAISES RATES, SEPTEMBER 2026' on "Fed raised" (127.18)
2:08.4  SAY:  "for the first time in three years."
2:08.8  [CONTAINER] C6-s3.png: 'FIRST HIKE IN 3 YEARS' (128.82); the CPI line is NOT printed (not said)
2:11.1  [DIAGRAM] D-RATES IN → 2:23.7 (LIGHT, red) system-design chain, 6 nodes left to right, frame in on D-RATES-s1.png; → hand:xfade-scale (container-xfade, 0.35s)
        one node HOT per phrase, said nodes stay LIT, unsaid nodes ghosted; 6-frame cross-fades between stills
2:11.2  SAY:  "Higher rates means less money flowing in the economy,"
2:11.5  [DIAGRAM] D-RATES-s1.png: 'HIGHER RATES' hot (131.46)
2:12.1  [DIAGRAM] D-RATES-s2.png: 'LESS MONEY IN THE ECONOMY' hot (132.08)
2:14.5  [DIAGRAM] D-RATES-s3.png: 'FEWER BUSINESS LOANS' hot (134.46)
2:14.5  SAY:  "less businesses taking out loans,"
2:16.2  SAY:  "less economic expansion, less job growth,"
2:16.8  [DIAGRAM] D-RATES-s4.png: 'LESS EXPANSION' hot (136.84)
2:18.8  [DIAGRAM] D-RATES-s5.png: 'LESS JOB GROWTH' hot (138.84)
2:20.0  SAY:  "and less people with jobs putting their money into crypto."
2:20.1  [DIAGRAM] D-RATES-s6.png: 'LESS MONEY INTO CRYPTO' hot (140.06); hold to 143.65
2:23.7  [VIDEO] BR-5 IN → 2:26.9 BR-5-capitol.mp4: the US Capitol under an overcast sky, no people, no signs (guard 8) ·
        Envato fade → hand:fade (broll-fade, 0.50s)
2:23.8  SAY:  "Then November 3rd, the midterms."
2:26.9  [CHART] C1 returns, C1-s3.png: 'STRAIT OF HORMUZ' already under callout 2 → hand:xfade-scale (container-xfade, 0.35s)
2:27.0  SAY:  "Democrats take both the House and the Senate."
2:27.4  [CHART] C1 the line passes the 'NOV 3, ELECTION DAY' tick (147.40) and draws on to NOV 5 by 150.0
2:30.0  SAY:  "And two days later,"
2:30.2  [CHART] C1 callout 3 'NOV 5, 2026 / AFTER THE MIDTERMS' on "two days later" (150.20); no party name (guard 8)
2:31.2  [RECEIPT] C11 IN → 2:35.9 C11-foxbusiness-headline.png: Fox Business, Nov 5, 2026, 'Stocks plunge as Dem midterm → hand:xfade-scale (container-xfade, 0.35s)
        sweep fuels AI regulatory concerns', cropped to the headline, settling push, [HIGHLIGHT] on 'AI regulatory
        concerns' on "tougher rules on AI" · treatment: highlight
2:31.3  SAY:  "the market starts pricing in tougher rules on AI"
2:34.3  SAY:  "and on data centers."
2:35.9  [VIDEO] BR-6 IN → 2:39.7 BR-6-trading-floor.mp4: traders watching boards, tense, overcast (a different clip from
        BR-1) · Envato fade → hand:fade (broll-fade, 0.50s)
2:36.0  SAY:  "Stocks have their worst day since April of 2025,"
2:39.7  [CHART] C1 returns, C1-s3b.png → hand:xfade-scale (container-xfade, 0.35s)
2:40.0  SAY:  "and Bitcoin dropped more than 5% with them."
2:41.5  [CHART] C1 tag 'BITCOIN MINUS 5.55% THAT DAY' under callout 3 on "5%" (161.50)
2:42.0  [CHART] C1-s4.png: the line draws to NOV 12 (162.0 → 165.3)
2:42.8  SAY:  "November 12th, the CEO of Nvidia resigns,"
2:45.6  [CHART] C1 callout 4 "NOV 12, 2026 / NVIDIA'S CEO RESIGNS" on "resigns" (165.58), no reason given (guard 5)
2:46.5  SAY:  "effective immediately,"
2:46.5  [RECEIPT] C8 IN → 2:50.1 C8-nvidia-ceo-transition-release.png: the Nvidia press release on sec.gov, headline 'NVIDIA → hand:xfade-scale (container-xfade, 0.35s)
        Announces CEO Transition', dateline 'SANTA CLARA, Calif., November 12, 2026', shown as an OBJECT (the release
        exists, it is dated); no reason shown (guard 5) · treatment: pan [MOTION] lib:motion-3d-pan-1-right fitted to
        the 3.6 s slot
2:47.7  SAY:  "after a week of reports about his conduct."
2:50.1  [VIDEO] BR-7 IN → 2:52.3 BR-7-server-aisle.mp4: a server hall aisle, racks and status lights (2.2 s) · Envato fade
        → hand:fade (broll-fade, 0.35s)
2:50.2  SAY:  "It shook the whole AI trade."
2:52.3  [CHART] C-NVDA IN → 2:56.6 (LIGHT, red), C-NVDA-start.png: Nvidia daily close, line SEP 1 → OCT 6, the '239.24 / → hand:xfade-scale (container-xfade, 0.35s)
        OCT 6, 2026, THE RECORD CLOSE' card lit
2:52.4  SAY:  "Nvidia's stock went down around 47% from its October high."
2:52.4  [CHART] C-NVDA-mid.png: the line falls OCT 6 → NOV 20 (172.40 → 173.90, ease-in)
2:54.0  [CHART] C-NVDA payoff C-NVDA-payoff.png: the dashed record reference, the drop arrow, 'MINUS 47.5%' and '125.53 /
        NOV 20, 2026 CLOSE' land together on "47%" (174.02). Dated, never 'now down' (FLAG 172.40) `[VERIFY]`
2:56.6  [CHART] C1 returns, C1-s5.png: the line draws to NOV 19 (176.6 → 178.5) → hand:xfade-scale (container-xfade, 0.35s)
2:56.7  SAY:  "And November 19th, Anthropic goes public,"
2:58.7  [CHART] C1 callout 5 'NOV 19, 2026 / ANTHROPIC LISTS' on "goes public" (178.66)
2:59.6  [RECEIPT] C9 IN → 3:04.1 C9-aljazeera-anthropic-ipo.png: Al Jazeera, Nov 19, 2026, 'Anthropic starts trading in the → hand:xfade-scale (container-xfade, 0.35s)
        US after blockbuster IPO', settling push, [HIGHLIGHT] on 'the largest initial public offering in US history at
        81bn' on "the largest IPO in history" (FLAG 179.72: the screen quotes the source; no valuation, guard 6) ·
        treatment: highlight
2:59.7  SAY:  "the largest IPO in history, around $81 billion raised."
3:04.1  [CONTAINER] D-THEORY IN → 3:09.4 (LIGHT, red), D-THEORY-s1.png (the arrow ghosted): two blocks 'CRYPTO' and 'THE → hand:xfade-scale (container-xfade, 0.35s)
        ANTHROPIC IPO', footer 'A THEORY. NO FLOW DATA SHOWS IT.'
3:04.2  SAY:  "And the theory is that money had to come from somewhere."
3:04.5  [CONTAINER] D-THEORY eyebrow 'THE THEORY' lands (184.46)
3:07.5  SAY:  "So some of it came out of crypto."
3:08.4  [CONTAINER] D-THEORY-s2.png: the DASHED arrow draws on "came out of crypto" (188.38); never a measured flow (guard 6)
3:09.4  [VIDEO] BR-8 IN → 3:12.9 BR-8-rocket-launch.mp4: a rocket lifting off the pad, wide, no company mark · Envato fade
        → hand:fade (broll-fade, 0.50s)
3:09.4  SAY:  "The last time a giant IPO landed, SpaceX, in June,"
3:12.9  [CHART] C-SPACEX IN → 3:21.4 (LIGHT, red), C-SPACEX-start.png: Bitcoin daily close JUN 1 → SEP 30, 2026, axes, no → hand:xfade-scale (container-xfade, 0.35s)
        line
3:13.0  [CHART] C-SPACEX-listing.png: 'SPACEX LISTS / JUNE 12, 2026' + red guide (193.02; date verified 2026-11-23, NPR)
3:13.6  SAY:  "Bitcoin bottomed 18 days later, and then it ran 48%."
3:14.4  [CHART] C-SPACEX-low.png: '58,558.86, JUNE 30, 2026 / LOWEST DAILY CLOSE OF 2026 / 18 DAYS LATER' (194.38)
3:16.4  [CHART] C-SPACEX-rally.png: the GREEN arrow + 'PLUS 48% / 86,602.91, SEPT 21, 2026' (196.40)
3:17.5  SAY:  "That's one time not a rule,"
3:18.1  [CHART] C-SPACEX payoff C-SPACEX-payoff.png: the dashed tag 'ONE TIME. NOT A RULE.' (198.06); hold to 201.45
3:19.6  SAY:  "but at least it's something worth watching."
3:21.4  [CHART] C1 FINAL, C1-s6.png: 201.5 → 203.2 the line finishes to the read point · IN on the MELT from C-SPACEX (201.45, centred on the breath) → lib:melt-rgb-soft-2 (MELT-transform, 0.84s)
3:21.6  SAY:  "So add it all up,"
3:22.9  SAY:  "and Bitcoin lost around a quarter of its price"
3:23.3  [CHART] C1 the dashed OCT 28 CLOSE reference + the end card '61,173 / MINUS 24.7% FROM THE OCT 28, 2026 CLOSE' land
        (chart-builder design call: the read, not the NOV 20 close's minus 27.6%) `[VERIFY]` re-pull the last point
3:24.4  [CHART] C1 all 5 callouts light together for the first time on "lost around a quarter"; C1 never returns after 206.80
3:25.3  SAY:  "since the day before the hack."
3:26.8  [CHART] C2 INDEX chart IN → 3:36.5 (LIGHT, red), C2-start.png: both indices at 0% with 'OCT 6, 2026, BOTH AT RECORD → hand:xfade-scale (container-xfade, 0.35s)
        CLOSES'; 206.90 → 208.90 both lines draw together
3:26.9  SAY:  "The S&P 500 is down more than 10% from its record,"
3:29.1  [CHART] C2-sp500.png: 'S&P 500 / MINUS 11.6%' lands on "10%" (209.08)
3:30.6  SAY:  "and the Nasdaq-100 is down 20%."
3:32.9  [CHART] C2-ndx.png: 'NASDAQ-100 / MINUS 19.84% / NOV 20, 2026 CLOSE' lands (212.86), the S&P card dims
3:33.9  SAY:  "So that puts the Nasdaq-100 in a bear market."
3:35.9  [CHART] C2 payoff C2-payoff.png: the dashed MINUS 20% line draws left to right + 'INTRADAY LOW 20.2% UNDER THE
        RECORD' on "bear market" (215.92). No CLOSING figure of 20% or more, the words 'bear market' never printed, the
        S&P 500 never called one (Mike 2026-11-23 "keep this") `[VERIFY]`; ends on the F4 edge
3:36.5  [TRANSITION] cover→face cut-in F4 → hand:film-burn (face-cut, 0.76s) (face pick)
3:36.5  [FACE] F4 IN → 3:44.0 (window 216.528-223.961) AS assets/face-swap/F4-higgsfield-bg-swap.mp4 from clip 0.267 s
        (handle 0.25, residual 40 ms); no caption (captions OFF from 79.48); no punch, no leak (the only join, 223.667,
        is 0.29 s from the edge)
3:36.5  [MUSIC] HARD HIT 216.53, FACE 4 "five things stacked": NO move, Bed B is in one of its own dips (1 dB under its
        surroundings), the words carry the landing; no SFX
3:36.6  SAY:  "And it wasn't just one thing."
3:38.5  SAY:  "It was five things stacked on top of each other"
3:42.2  SAY:  "in just three weeks."
3:44.0  [TRANSITION] face→cover F4 out → hand:film-burn (face-cut, 0.76s)
3:44.0  [IMAGE] IMG-3 IN → 3:47.6 IMG-3-storm-harbour-tanker.png: storm fronts converging over a grey harbour, a tanker on one
        side, a glass financial district on the other (the 'five things stacked' line, pictured; 3.64 s still) ·
        glitch ingress → hand:film-burn (face-cut, 0.76s)
3:44.2  SAY:  "This is what I've been saying all along"
3:46.0  SAY:  "over the last six months."
3:47.6  [CONTAINER] D-PRIOR IN → 3:55.0 (LIGHT, red), D-PRIOR-s1.png: eyebrow 'MY VIEW, THE LAST 6 MONTHS', 'A NEW BOTTOM → hand:xfade-scale (container-xfade, 0.35s)
        IN Q4?' (his own prior view, labelled as his; nothing says the bottom is in)
3:47.8  SAY:  "I had been skeptical that that would be a new bottom in Q4,"
3:48.2  [CONTAINER] D-PRIOR-s2.png: 'SKEPTICAL' on (228.22)
3:51.1  SAY:  "but I was open to it."
3:52.4  SAY:  "I said I was 10% open to it."
3:53.7  [CONTAINER] D-PRIOR-s3.png: 'BUT 10% OPEN TO IT' on (233.74); hold to 235.00
3:55.0  [RECEIPT] C12 IN → 3:59.7 two stages: C12-headline.png (CoinDesk, Nov 13, 2026, 'Bitcoin plunges to $68,000 as → hand:xfade-scale (container-xfade, 0.35s)
        Anthropic IPO frenzy adds to market jitters') then C12-causes.png (the paragraph that lists several causes at
        once). Shown as an OBJECT: the line does not read its words, the point is that the coverage itself names a
        whole bunch of things at once; NO highlight, so the source's 'the scandal at Nvidia' is never singled out and
        the inline BTC price chip is never enlarged (guard 5) · treatment: pan [MOTION] lib:motion-3d-orbit-2-right-down
        across the two stages
3:55.1  SAY:  "And the idea would be that there would be"
3:57.0  SAY:  "a whole bunch of things that would happen all at once,"
3:59.7  [VIDEO] BR-9 IN → 4:03.5 BR-9-flip-calendar.mp4: calendar pages flipping fast (3.84 s) · Envato fade → hand:fade (broll-fade, 0.50s)
3:59.7  SAY:  "compacted into a small timeframe."
4:01.9  SAY:  "And there you have it."
4:03.5  [VIDEO] BR-10 IN → 4:07.4 BR-10-control-room.mp4: a TV news control room, a wall of monitors (3.95 s), no
        date-relative text · Envato fade → hand:fade (broll-fade, 0.50s)
4:03.5  SAY:  "Quick side note, at the same time"
4:05.4  SAY:  "that I'm actually recording this video right now,"
4:07.4  [RECEIPT] R-NVDA-NEWS IN → 4:14.7 R-NVDA-NEWS-headline.png: the Nvidia newsroom, Nov 23, 2026, 'NVIDIA Board Reinstates → hand:xfade-scale (container-xfade, 0.35s)
        Jensen Huang as President, CEO and Board Director', two stages (the headline, then the date line), settling
        push, [HIGHLIGHT] on 'Reinstates' on "reinstated"; no reason shown (guard 5) · treatment: highlight
4:07.6  SAY:  "news just broke that Jensen Huang has been reinstated"
4:12.7  SAY:  "as CEO and in Nvidia."
4:14.7  [RECEIPT] R-NVDA-CHART IN → 4:17.9 R-NVDA-CHART-tradingview-nvda-daily.png REAL chart: Nvidia daily, the Nov 23, 2026 → hand:xfade-scale (container-xfade, 0.35s)
        session in view, slow push to the last candle, never restyled, no code label added (the 'more than 30%' stays
        spoken; NVDA closed 165.05 on 2026-11-23, plus 31.48%) `[VERIFY]` · treatment: push
4:14.8  SAY:  "So hey, it looks like that stock is going up."
4:17.9  [IMAGE] IMG-4 IN → 4:21.8 IMG-4-empty-trading-floor.png: a vast empty trading floor, dim red screens out of focus
        (3.9 s still; FLAG 257.98: no on-screen copy says the bottom is in) · glitch ingress → lib:badsignal-short-3 (glitch-still, 0.48s)
4:18.0  SAY:  "But nonetheless, in a market like this,"
4:20.7  SAY:  "when everything is so far down and bottomed out,"
4:21.8  [VIDEO] BR-11 IN → 4:25.6 BR-11-trader-desk.mp4: a man sits down at a desk with several monitors, from behind
        (3.8 s), holds to the CH3 card pause · Envato fade → hand:fade (broll-fade, 0.50s)
4:23.6  SAY:  "let me show you exactly what I do."
```

## CH3 - THE TRADES (4:25.6-6:12.2, Bed C `oh-mega`, card ON)
```
4:25.6  [CARD] CH3 title-CH3.png "THE TRADES" · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs.mp3 · [TRANSITION] card → hand:cube-3d (card, 0.40s)
        LIGHT title slide, green accent; edit-time pause about 1.5 s, baked at the trough 265.60 (planned 265.72); same
        card move as CH2. IMPACT: Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3, mood_class neutral, weight 3,
        measured tail 1.08 s at -40 dB, peak at file 0.09 s, ON the card's first frame, ~0.4 gain: a lighter hit for
        the calm chapter, gone inside the pause
4:25.6  [MUSIC] HARD HIT 265.72: Bed B leaves in its own breath (stopped 1.3 s before its first boom, which never plays) ·
        Bed C `oh-mega` (Suiteniss, Oh, Mega!, 5S5Z7G59FWXCILBA) the calm INTRO cut, breath 1.1 s, fade-in 0.5 s,
        -17.5 dB under VO on its figures; the first three-note figure lands on "Let's start with Pieverse" → 5:16.0
4:25.6  [IMAGE] IMG-5 IN → 4:27.4 IMG-5-pieverse-coin.png: the Pieverse token as one hero coin, the REAL mark from the → lib:badsignal-short-1 (glitch-still, 0.48s)
        reference, soft green rim light (1.85 s pop) · glitch ingress → hand:cube-3d (card, 0.40s)
4:25.7  SAY:  "Let's start with Pieverse."
4:27.4  [RECEIPT] C15 IN → 4:32.1 C15-coingecko-pieverse-max.png REAL chart: Pieverse on CoinGecko, price since launch, slow → hand:xfade-scale (container-xfade, 0.35s)
        push along the line, capture date in frame; never tied to the 5.33 print (its own chart peaks near 3.9)
        `[VERIFY]` · treatment: push
4:27.5  SAY:  "It's an AI agent payments project,"
4:29.6  SAY:  "and it was launched in November of 2025."
4:32.1  [CHART] C16 WALK IN → 4:50.4 (LIGHT, green), frame in with the head at NOV 15, 2025 (log price axis) → hand:xfade-scale (container-xfade, 0.35s)
4:32.3  SAY:  "Right after it launched, one of my bots flagged it"
4:35.2  SAY:  "at around a $20 million market cap,"
4:36.1  [CHART] C16-walk-1-alert.png: 'BOT ALERT, AROUND A 20M CAP' at the 0.119 launch low on "20 million" (276.12)
4:37.9  SAY:  "but it was already running, so I waited."
4:38.4  [CHART] C16-walk-2-run.png: the run draws to 0.518 + 'ALREADY RUNNING' on "already running" (278.36)
4:40.4  SAY:  "It pulled back a little three weeks later,"
4:40.6  [CHART] C16-walk-3-pullback.png: the DATED pullback 0.518 (NOV 25, 2025) → 0.338 (NOV 30, 2025) + 'PULLED BACK' on
        "pulled back" (280.62); never the words '3 weeks later' on screen (FLAG 280.40)
4:42.6  SAY:  "and then I called it at around a $65 million market cap."
4:44.2  [CHART] C16-walk-4-call.png: 'MY CALL, AROUND A 65M CAP' replaces PULLED BACK on the same anchor, on "65 million"
        (284.16)
4:46.0  [CHART] C16 the line draws on through 2026 (286.02 → 288.70)
4:46.0  SAY:  "We've been swing trading it ever since."
4:48.3  SAY:  "On November 18th of 2026, it touched $1 billion,"
4:48.8  [CHART] C16-walk-5-nov18.png: the 'NOV 18, 2026' date tick fades in (288.78); hold to 290.40
4:50.4  [RECEIPT] C18 IN → 4:54.3 C18-x-post-nov-19.png: the channel's dated X post (6:33 AM, Nov 19, 2026), 'Pieverse touched → hand:xfade-scale (container-xfade, 0.35s)
        a 1 billion market cap on November 18'. FRAME THE POST COLUMN ONLY (source x 1140 to 2335 of 3840): X's
        logged-out 'Log in or sign up' panel stays out of frame and the framing ends above the capture-day price card;
        settling push, [HIGHLIGHT] on that sentence on "$1 billion market cap" · treatment: highlight
4:52.3  SAY:  "a $1 billion market cap."
4:54.3  [CHART] C16 returns on walk-5; 294.40 → 295.90 the line draws on to the 5.33 HIGH → hand:xfade-scale (container-xfade, 0.35s)
4:54.4  SAY:  "On price, that was more than a 14X from my call"
4:56.0  [CHART] C16-walk-6-high.png: the '5.33 HIGH, NOV 22, 2026' card with 'MORE THAN 14X FROM THE CALL, ON PRICE' lands
        ON the high (296.00), never on the NOV 18 tick (around 10.5x there; FLAG 294.36)
4:57.3  SAY:  "and around a 30X from where the bot flagged it."
4:58.3  [CHART] C16-walk-7-payoff.png: 'AROUND 30X FROM THE BOT ALERT, ON PRICE' on the read price (298.34); never 17x,
        no market cap multiple (guard 2) `[VERIFY]` re-derive at render; hold to 300.15
5:00.1  [IMAGE] IMG-6 IN → 5:01.5 IMG-6-evaa-coin.png: the EVAA token as one hero coin, the REAL mark from the reference
        (1.35 s pop, the twin of IMG-5) · glitch ingress → lib:badsignal-short-2 (glitch-still, 0.48s)
5:00.3  SAY:  "Now, EVAA, it's a lending protocol on TON"
5:01.5  [RECEIPT] C13 IN → 5:05.3 C13-coingecko-evaa-1y.png REAL chart: EVAA on CoinGecko, 1-year view, slow push along the → hand:xfade-scale (container-xfade, 0.35s)
        line, capture date in frame `[VERIFY]` · treatment: push
5:03.5  SAY:  "that lives inside of Telegram."
5:05.3  [CHART] C14 WALK IN → 5:15.0 (LIGHT, green), C14-walk-1-frame.png: frame + axes, title 'EVAA, DAILY PRICE', no line → hand:xfade-scale (container-xfade, 0.35s)
5:05.4  SAY:  "We've been swing trading it since it launched"
5:07.4  [CHART] C14-walk-2-launch.png: the dashed tag 'LAUNCHED OCT 3, 2025' at the left edge (307.36), then the line draws
        from NOV 23, 2025 through the quiet months to OCT 27, 2026 (307.5 → 312.5); the launch month is a tag, never a
        drawn line (guard 1: no 'at launch it is a 30x')
5:07.4  SAY:  "in October of 2025, and I've been rotating gains"
5:10.8  SAY:  "from my other plays into it."
5:12.3  SAY:  "It's crazy how many rotations I put into this."
5:15.0  [DIAGRAM] D-ROTATE IN → 5:26.1 (LIGHT, green), D-ROTATE-s0.png: the centre node EVAA alone → hand:xfade-scale (container-xfade, 0.35s)
5:15.1  SAY:  "We did the 350X on LAB, I rotated into this."
5:16.0  [MUSIC] Bed C row 2: the REMIX jump back 16 bars on the quiet bar line (file 6.116, -32 dBFS both sides), second
        pass of bars 1 to 16 → 6:07.9
5:17.1  [DIAGRAM] D-ROTATE-s1.png: 'LAB' + its arrow into EVAA (317.08); the arrow draws on (stroke-dashoffset, 10 frames)
5:19.2  SAY:  "We did the 30X on Giggle Fund, rotated into this."
5:20.6  [DIAGRAM] D-ROTATE-s2.png: 'GIGGLE FUND' + arrow (320.60) (spelling still to confirm, see Open decisions)
5:23.0  [DIAGRAM] D-ROTATE-s3.png: 'DCA' + arrow (322.98); names and arrows only, the 350X and the 30X stay SPOKEN, no
        'verified', no research card (FLAG 312.34); hold to 326.05
5:23.0  SAY:  "DCA'd into it."
5:24.2  SAY:  "It's been absolutely amazing."
5:26.1  [CHART] C14 returns on walk-2 (the line drawn to OCT 27, 2026) → 5:48.4 · IN on the MELT from D-ROTATE s3 (326.05, in the breath after "amazing") → lib:melt-rgb-soft-short-2 (MELT-transform, 0.60s)
5:26.2  SAY:  "One of our lowest entry points came in 2026"
5:29.0  SAY:  "at around a $3 million market cap."
5:29.6  [CHART] C14-walk-3-band.png: the band 'AROUND A 3M TO 4M CAP, 0.44 TO 0.60' lights on "3 million" (329.62); it stays
        2.9M to 4.0M as sourced (FLAG 326.16)
5:31.0  SAY:  "On October 27th, it was sitting at 51 cents."
5:33.5  [CHART] C14-walk-4-051.png: '0.51, OCT 27, 2026' (333.48); 333.6 → 336.6 the run draws
5:35.0  SAY:  "By November 21st, it hit $6.60."
5:36.7  [CHART] C14-walk-5-peak.png: '6.62, NOV 21, 2026 / THE PEAK' (336.68)
5:39.4  SAY:  "That's around a 13X in under four weeks."
5:40.6  [CHART] C14-walk-6-13x.png: the dotted bracket draws bottom to top + 'AROUND 13X / IN UNDER 4 WEEKS' (340.56), the
        verified price multiple 0.51 → 6.62
5:43.5  SAY:  "Then on November 22nd, it dropped down"
5:43.6  [MUSIC] HARD HIT 343.56: a figure of Bed C falls on "Then" by the grid alone (343.56 against 343.52); NO added sound
        (no downshifter: the strategist kept this landing to the bed)
5:44.6  [CHART] C14 the bracket + its card dim to half, the RED drop draws at full size (344.6 → 346.4)
5:46.0  SAY:  "by more than 60% in a single day."
5:46.5  [CHART] C14-walk-7-drop.png: 'MINUS 64% / IN ONE DAY, NOV 22, 2026' + the read price card (346.54); no cause on
        screen (guard 3) `[VERIFY]` read price at render; held head-on to the F5 edge
5:48.4  [TRANSITION] cover→face cut-in F5 → hand:film-burn (face-cut, 0.76s) (face pick)
5:48.4  [FACE] F5 IN → 5:59.4 (window 348.395-359.395, 11.0 s) AS assets/face-swap/F5-higgsfield-bg-swap.mp4 from clip
        0.400 s (max_clip 12 s, residual 10 ms; the 12 s generation holds his look, PROJECT-LOG 2026-11-23); no caption;
        no punch, no leak (the only join, 358.967, is 0.43 s from the edge, so the 11 s hold runs as one shot)
5:48.4  SAY:  "But I'm absolutely fine with that."
5:50.6  SAY:  "I took profits on the way up,"
5:52.8  SAY:  "sent out those sell alerts in my Discord"
5:54.7  SAY:  "so we can buy back in when it gets lower"
5:57.4  SAY:  "and build the size of our bank."
5:59.4  [TRANSITION] face→cover F5 out → hand:film-burn (face-cut, 0.76s) (the cover takes 359.395, the picture edge; Whisper's "bank." end
        at 359.46 is padding)
5:59.4  [CONTAINER] C17 MULTIPLES card IN → 6:04.4 (LIGHT, green), C17-s1.png: EVAA, PRICE basis, 'FROM A 0.44 TO 0.60 ENTRY'
        and 'UP TO 15x AT THE PEAK (6.62, NOV 21, 2026)' on, the read line ghosted; source line 'CoinGecko daily prices'
5:59.5  SAY:  "Even after that drop, those low entries"
6:01.8  SAY:  "are still up around a four to five X."
6:03.1  [CONTAINER] C17-s2.png: '3.9x TO 5.3x AT 2.33' with the read date on "four to five X" (363.14); no 35, no market cap
        multiple (guard 1) `[VERIFY]` re-derive the read multiple at render
6:04.2  SAY:  "Now look at what those two trades have in common."
6:04.4  [CONTAINER] D-COMMON IN → 6:09.9 (LIGHT, green), the declared A and B comparison (COMPARISON_REFS), D-COMMON-s1.png: → hand:xfade-scale (container-xfade, 0.35s)
        'PIEVERSE, IN AT AROUND A 65M CAP' beside 'EVAA, IN AT AROUND A 3M TO 4M CAP', both entry markers pulsing,
        headline ghosted
6:06.9  SAY:  "I was in early, way before the pump,"
6:07.1  [CONTAINER] D-COMMON-s2.png: headline 'IN EARLY. BEFORE THE PUMP.' (367.06)
6:07.9  [MUSIC] Bed C row 3: jump back 16 bars for ONE cell (bars 1 and 2, file 6.116 → 12.602), runs 2.05 s into CH4 so
        the grid never re-phases → 6:14.4
6:09.9  [VIDEO] BR-12 IN → 6:12.2 BR-12-dice.mp4: two dice tumbling across a table, slow motion (2.35 s), literal for
        "luck"; holds into the CH4 question (no card) · Envato fade → hand:fade (broll-fade, 0.35s)
6:09.9  SAY:  "and getting in early isn't just luck."
```

## CH4 - HOW I FIND THEM (6:12.2-7:51.2, Bed C continues as a carve, card OFF)
```
6:12.2  [RECEIPT] R-NEWCOINS IN → 6:17.0 R-NEWCOINS-coingecko-new-listings-scroll.mp4: the CoinGecko 'New Cryptocurrencies' → hand:xfade-scale (container-xfade, 0.35s)
        page, a slow scroll down the recently added list, real page, real pace; no count added (guard 9) ·
        treatment: push (a screen recording that already moves)
6:12.3  SAY:  "So how do I find them that early?"
6:14.4  [MUSIC] HARD HIT 374.369, CH4 with no card: the carve change, the VERSE cut of the same track enters on the grid
        (cut time 3.244, bars 27 to 30), a soft pad appears under the figure, -17.5 dB → 6:27.3; no SFX
6:14.6  SAY:  "New tokens launch around the clock"
6:16.6  SAY:  "and no human can read them all, so I don't try, of course."
6:17.0  [VIDEO] BR-13 IN → 6:20.1 BR-13-tired-eyes.mp4: a tired man rubbing his eyes in front of several screens at night
        (3.1 s) · Envato fade → hand:fade (broll-fade, 0.50s)
6:20.1  [RECEIPT] C20a IN → 6:27.7 two stages in one appearance: C20a-about.png, [HIGHLIGHT] on 'investing in Crypto since → hand:xfade-scale (container-xfade, 0.35s)
        2013, and is an accomplished software developer' (382.56), then C20a-new-coin-alert-bot.png, [HIGHLIGHT] on the
        FIRST card only, 'New Coin Alert bot' (385.56). The 'Potential rug-pull alert' card is NOT in the file and never
        in frame (ruling 2026-11-22); no price in frame · treatment: highlight
6:20.2  SAY:  "But I'm a software developer,"
6:22.3  SAY:  "and I've been investing in crypto since 2013."
6:25.0  SAY:  "So I built software to do the reading for me."
6:27.3  [MUSIC] Bed C row: back to the INTRO cut for the whiteboard (file 25.575 → 51.521, bars 7 to 14) → 6:53.3
6:27.7  [WHITEBOARD] WB1 IN → 6:51.9 assets/whiteboard/WB1.mp4 (from: 0.00, 24.14 s, 724 frames) the hand-drawn funnel, full
        frame, paper-pastel pen, one continuous clip, no pause inside; the paper sheet comes in over 11 frames and out
        over 0.3 s (bucket 3 container move → hand:paper-sheet (container-xfade, 0.37s)). Draw-on cues (assets/whiteboard/WB1.cues.md, spine s):
        funnel outline 388.28 · NEW COINS 390.22 · aggregator listings 392.16 · new DEX pairs 394.28 · BOTS FLAG
        ACTIVITY 396.24 to 397.52 · sieves 399.24 · FUNDING & BACKERS 401.08 / 402.16 · EXCHANGE LISTINGS 403.48 ·
        MARKET CAP 404.14 · HOLDERS (a plain tag, never a rug-pull or team-dump check) 405.26 · three et cetera dots
        406.14 / 406.84 / 407.74 · tray + three coins 408.72 · A HANDFUL OF PLAYS 410.14 + its green underline 410.42;
        finished drawing holds from 410.67. NO draw-on SFX (the kit has no pen or paper texture, and this is the
        quietest bed of the video on purpose)
6:27.7  [DUCK] HARD HIT 387.74: Bed C relative -2.0 dB, ramp 1.0 s, window 387.74 → 411.54, the lowest bed of the video
        (19.2 dB under the voice) under the whiteboard (MUSIC-PLAN automation, screenplay MUSIC-MOOD-PLAN CH4); not a
        vibe cut, no impact
6:27.7  SAY:  "Here's the funnel."
6:28.6  SAY:  "At the top, every new coin, the second it gets listed"
6:32.7  SAY:  "or shows up on a decentralized exchange,"
6:36.1  SAY:  "the ones."
6:38.9  SAY:  "Then it scans everything about it."
6:40.8  SAY:  "Who funded it?"
6:41.7  SAY:  "Who's backing it?"
6:42.7  SAY:  "Where is it listed?"
6:43.9  SAY:  "How big is it?"
6:44.8  SAY:  "Who's holding it?"
6:46.1  SAY:  "Et cetera, et cetera, et cetera."
6:48.7  SAY:  "What comes out at the bottom is a handful of plays."
6:51.9  [VIDEO] BR-14 IN → 6:55.8 BR-14-eye-reflection.mp4: an eye in close up with scrolling screen data reflected (3.92 s),
        a breath of picture after 24 s of drawing · Envato fade → hand:fade (broll-fade, 0.30s)
6:51.9  SAY:  "Here's one of the easiest tells"
6:53.3  [MUSIC] Bed C row: VERSE cut bars 31 to 36 (cut time 16.217 → 35.677), the pad returns as the whiteboard leaves
        → 7:12.7
6:53.4  SAY:  "without diving in deeper into the details."
6:55.8  [CONTAINER] D-TELL IN → 7:07.0 (LIGHT, green): the frame enters with eyebrow 'ONE OF THE EASIEST TELLS', the rows → hand:xfade-scale (container-xfade, 0.35s)
        held back in the comp; no project names, no numbers
6:55.9  SAY:  "If a brand new coin is already listed"
6:58.2  SAY:  "on a long list of centralized exchanges,"
6:58.6  [CONTAINER] D-TELL-s1.png: 'A LONG LIST OF EXCHANGES' on (418.58)
7:01.0  [CONTAINER] D-TELL-s2.png: 'FUNDING BEHIND IT' on (421.04)
7:01.0  SAY:  "it probably has to have funding."
7:02.8  SAY:  "It costs money to be listed on them,"
7:02.9  [CONTAINER] D-TELL-s3.png: sub-line 'LISTINGS COST MONEY' (422.94)
7:04.8  SAY:  "so that's the only way it can get there."
7:07.0  [VIDEO] BR-15 IN → 7:10.6 BR-15-roulette.mp4: a roulette wheel spinning (3.6 s), literal for "random"; the 500K stays
        spoken · Envato fade → hand:fade (broll-fade, 0.50s)
7:07.1  SAY:  "These aren't random meme coins at a 500K market cap"
7:10.2  SAY:  "where you have to worry about getting rugged."
7:10.6  [CONTAINER] D-TELL returns (as it left, on D-TELL-s3) → 7:17.6, the spotlight moves on → hand:xfade-scale (container-xfade, 0.35s)
7:12.1  SAY:  "These are funded projects with real backers,"
7:12.7  [CONTAINER] D-TELL-s4.png: 'FUNDED PROJECTS' on, 'real backers' still at rest (432.72)
7:12.8  [MUSIC] Bed C row: REMIX jump back inside the verse, 8 bars (cut time 9.731, bars 29 to 36) → 7:38.7
7:14.2  [CONTAINER] D-TELL-s5.png: 'REAL BACKERS' lights (434.24)
7:15.0  SAY:  "and we get in really, really early."
7:17.0  [CONTAINER] D-TELL-s6.png: 'IN EARLY' on (437.04); hold to 437.55
7:17.6  [CHART] C16-ZOOM IN → 7:24.6 (LIGHT, green), C16-ZOOM-start.png: Pieverse, NOVEMBER 2025 only, linear axis, the run → hand:xfade-scale (container-xfade, 0.35s)
        NOV 14 → NOV 25 already on screen (its own frame, so C16 is not shown a third time)
7:17.7  SAY:  "And even then, I usually don't chase it."
7:20.0  SAY:  "If it's already pumping, I wait for a pullback."
7:20.4  [CHART] C16-ZOOM-pumping.png: '0.518, NOV 25, 2025 / ALREADY PUMPING' (440.42); the line draws on to NOV 30
7:21.5  [CHART] C16-ZOOM-pullback.png: '0.338, NOV 30, 2025 / WAIT FOR THE PULLBACK' + hollow dot (441.48)
7:22.7  SAY:  "That's exactly what I did with Pieverse."
7:24.0  [CHART] C16-ZOOM payoff C16-ZOOM-payoff.png: the dot fills + 'MY CALL, AROUND A 65M CAP' on "Pieverse" (444.00)
7:24.6  [DIAGRAM] C22 THE LOOP IN → 7:39.1 (LIGHT, green), frame in; 5 nodes on a ring, one way, in the recorded order · IN on the SPIN from C16-ZOOM payoff (444.58) → lib:spin-center-swinging-cw (SPIN-newfacet, 0.84s)
7:24.6  SAY:  "Then the swing trading software takes over."
7:25.3  [DIAGRAM] C22-s1.png: title + centre 'THE SWING TRADING SOFTWARE', SCAN and ENTER EARLY dim + their arrow (445.28)
7:27.2  SAY:  "It's a tool that my members use to trade with."
7:29.7  [DIAGRAM] C22-s2.png: 'BUY THE BOTTOM' hot, its arrow in (449.72)
7:29.7  SAY:  "When a play is sitting near its bottom,"
7:31.8  SAY:  "a buy alert goes out."
7:32.0  [DIAGRAM] C22-s2b.png: sub-label 'BUY ALERT' (451.98)
7:33.2  [DIAGRAM] C22-s3.png: 'SELL THE PUMP' hot (453.18)
7:33.2  SAY:  "When it pumps, we take profits on the way up,"
7:35.9  [DIAGRAM] C22-s4.png: 'ROTATE INTO THE NEXT ONE' hot (455.86)
7:35.9  SAY:  "and those profits rotate into plays"
7:37.7  SAY:  "that are still at the bottom."
7:38.2  [DIAGRAM] C22-s5.png: the closing arrow ROTATE → SCAN draws, every node lit (458.20), cued on "still at the bottom"
        (the scripted 'do it again' line was DROPPED: no such text); hold to 459.10
7:38.7  [MUSIC] Bed C row: the INTRO cut bars 13 to 16 (file 45.035 → 57.40), the close of Bed C, ending in its quiet half
        bar where the CH5 card arrives → 7:51.3
7:39.1  [RECEIPT] C20b IN → 7:44.5 two stages: C20b-showcase-full.png (the whole showcase table on cryptorich.vip, recounted → hand:xfade-scale (container-xfade, 0.35s)
        2026-11-24 at 56 rows) then C20b-showcase-top.png pushed to the 'Called by' column, [HIGHLIGHT] on the bot rows;
        small code tally '56 CALLS' (461.22) and '34 CALLED BY A BOT' (462.58). The Price Change and Multipliers columns
        are never highlighted or enlarged (guard 9) `[VERIFY]` · treatment: highlight
7:39.2  SAY:  "On my public showcase, there are 56 calls."
7:42.6  SAY:  "34 of them were called by a bot."
7:44.5  [TRANSITION] cover→face cut-in F6 → hand:film-burn (face-cut, 0.76s) (face pick)
7:44.5  [FACE] F6 IN → 7:51.2 (window 464.528-471.195, repaired 2026-11-23: "can." is under his own picture) AS
        assets/face-swap/F6-higgsfield-bg-swap.mp4 from clip 0.400 s (rebuilt on the repaired spine, window 464.528 to
        471.167, residual 10 ms; the clip's tail frames cover the last frame); no caption
7:44.6  SAY:  "That's my edge."
7:45.6  SAY:  "I can't watch every launch,"
7:47.3  SAY:  "but the software available in my community"
7:49.7  SAY:  "to my members can."
7:50.6  [PUNCH-IN] F6 hard ~15-20% step IN ON the desilencer join 470.567 (frame 14117, jumpcuts-final.json), the jump cut
        already in the footage → holds to the window end 7:51.2
7:50.6  [LIGHTLEAK] F6 library light leak peaking ON the same join frame (lib:lightleaks-*, the video's set of 3-4 from the
        usage ledger slot face_leak, screen blend) → lib:lightleaks-soft-short-1 (punch-leak, 0.40s) (punch-leak)
```

## CH5 - THE PLAN TO 2028 (7:51.2-9:50.2, Bed D `sacral-i-feel-417-hz`, card ON)
```
7:51.2  [TRANSITION] face→cover F6 out → hand:film-burn (face-cut, 0.76s) (at the picture edge 471.195, one frame before the join 471.204)
7:51.2  [CONTAINER] title-CH5-s0.png IN → 7:51.3: the CH5 title page ARRIVES (LIGHT, cyan accent, bare frame) in the breath
        after "can.", the title text lands inside the pause that follows
7:51.3  [CARD] CH5 title-CH5.png "THE PLAN TO 2028" · [IMPACT] Soundjay_Impact_Main_01-short.wav · [TRANSITION] card → hand:cube-3d (card, 0.40s)
        LIGHT title slide, cyan accent; edit-time pause about 1.5 s, baked at the trough 471.33 (trough 471.04 to
        471.46, planned 471.06); same card move. IMPACT: Impacts/Soundjay_Impact_Main_01-short.wav, mood_class neutral,
        weight 3, measured tail 0.34 s at -40 dB, peak at file 0.34 s, so the file starts on the pause's first frame
        (in-pause +0.00 s) and peaks as the title text lands (in-pause +0.34 s), ~0.4 gain: the lightest card hit,
        the drone owns this chapter
7:51.3  [MUSIC] HARD HIT 471.06: Bed C has decayed by itself and fades 0.4 s at the card · Bed D `sacral-i-feel-417-hz`
        (Moments, Sacral - I Feel (417 Hz), ETEORPHXRJHTSO60) the drone, RIGHT-ALIGNED (file 119.62 → 238.79, its LAST
        TONE on the cut to the sign-off face), swells in under the card over 1.2 s, breath 0.7 s, -20.0 dB under VO
        → 9:50.2
7:51.3  [IMAGE] IMG-7 IN → 7:54.6 IMG-7-window-first-light.png: a man from behind at a tall window, a city skyline in the → hand:cross-warp (glitch-still, 0.50s)
        first light after a storm (3.32 s still, never a rendered face) · glitch ingress → hand:cube-3d (card, 0.40s)
7:51.5  SAY:  "So why am I this confident in the middle of a dump?"
7:54.6  [CHART] C23 MIDTERM PRECEDENT IN → 8:09.2 (LIGHT, cyan), the frame comes in after the card → hand:xfade-scale (container-xfade, 0.35s)
7:54.7  [CHART] C23-start.png: eyebrow 'WHAT CAME AFTER' and the axes (474.72)
7:54.7  SAY:  "Because of what came after the last ones."
7:57.2  SAY:  "There've been 19 midterm elections since 1950."
7:57.5  [CHART] C23 the 19 bars GROW from zero one after another, left to right (477.54 → 481.20; C23-mid.png = 10 grown)
8:01.2  SAY:  "In all 19, the S&P was higher 12 months later."
8:01.6  [CHART] C23-all19.png: '19 OF 19 HIGHER, 12 MONTHS LATER' + the dashed median line 'MEDIAN PLUS 14.5%' (481.56)
8:05.2  SAY:  "That's a stock market stat,"
8:05.5  [CHART] C23-tag.png: the dashed tag 'S&P 500, A STOCK MARKET STAT' (485.52)
8:06.8  [CHART] C23-dips.png: the other 16 bars dim to 45%, three RED bars grow DOWN under 1974, 2002, 2018 ('MINUS 13.4%',
        'MINUS 12.5%', 'MINUS 14.7%') + 'THE WORST DIP ON THE WAY' (486.80); never 'always', never applied to crypto
        (guard 8); hold to 489.20
8:06.8  SAY:  "and some of those years dipped hard first."
8:09.2  [CHART] C24 IN → 8:15.6 (LIGHT, cyan): axes + both bar labels (2018 low close 3,237, DEC 15, 2018; 2022 low close → hand:xfade-scale (container-xfade, 0.35s)
        15,787, NOV 21, 2022), the dashed 1x THE LOW line
8:09.3  SAY:  "And Bitcoin?"
8:10.6  SAY:  "The last two times it put in the bear market low,"
8:10.7  [CHART] C24-start.png: the pill 'THE LAST TWO TIMES' lifts in (490.72) and stays on screen throughout
8:11.8  [CHART] C24-mid.png: both bars GROW together from 0 (491.80 → 493.70)
8:13.6  SAY:  "it more than doubled within a year."
8:13.8  [CHART] C24 payoff C24-payoff.png: '2.21x' and '2.27x' + 'AFTER 12 MONTHS' on "more than doubled" (493.84); no
        24-month figure; hold to 495.60
8:15.6  [VIDEO] BR-16 IN → 8:18.6 BR-16-bell-sunset.mp4: a brass bell swinging and ringing (3.0 s) · Envato fade
        → hand:fade (broll-fade, 0.50s)
8:15.7  SAY:  "But in reality, nobody rings a bell at the bottom,"
8:18.6  [CONTAINER] D-ENTRIES statement card IN → 8:25.9 (LIGHT, cyan), the lines held back → hand:xfade-scale (container-xfade, 0.35s)
8:18.6  SAY:  "and I don't know if this is it."
8:18.9  [CONTAINER] D-ENTRIES-s1.png: "I DON'T KNOW IF THIS IS THE BOTTOM." (498.90)
8:20.2  SAY:  "I don't need the exact bottom."
8:20.6  [CONTAINER] D-ENTRIES-s2.png: "I DON'T NEED THE EXACT BOTTOM." (500.60)
8:22.4  [CONTAINER] D-ENTRIES-s3.png: "I NEED LOW ENTRIES." (502.44); nothing says the bottom is in; hold to 505.90
8:22.4  SAY:  "I need low entries, and a dump like this is where they are."
8:25.9  [DIAGRAM] C22B THE COMPOUNDING VIEW IN → 8:38.1 (LIGHT, cyan), frame in; a tree of loops, arrows and labels only → hand:xfade-scale (container-xfade, 0.35s)
8:26.0  SAY:  "So the plan isn't a prediction."
8:27.9  SAY:  "The plan is the loop."
8:28.2  [DIAGRAM] C22B-s1.png: 'THE PLAN IS THE LOOP', the big loop draws on, lit (508.22)
8:29.4  [DIAGRAM] C22B-s2.png: 'ONE PLAY MOVES', the payout arrow up + card (509.44)
8:29.4  SAY:  "One play moves, I take profits on the way up,"
8:30.5  [DIAGRAM] C22B-s3.png: 'TAKE PROFITS ON THE WAY UP' (510.52)
8:32.4  [DIAGRAM] C22B-s4.png: 'SPLIT ACROSS THE NEXT 10 PLAYS', 10 wires fan out, 10 small loops pop top to bottom (512.40)
8:32.4  SAY:  "and I split those profits across the next 10 plays."
8:35.7  [DIAGRAM] C22B-s5.png: 'ONE OF THOSE MOVES', loop 4 lights and fans out again (515.66); no dollar amount, no
        multiple, no outcome number (guard 9); hold to 518.15
8:35.7  SAY:  "One of those moves, and I do it again."
8:38.1  [DIAGRAM] T-2028 timeline IN → 8:47.9 (LIGHT, cyan), T-2028-s0.png: header 'WHY 2028?' + the empty rail; no halving → hand:xfade-scale (container-xfade, 0.35s)
        marker
8:38.3  SAY:  "And why 2028?"
8:40.2  [DIAGRAM] T-2028-s1.png: 'NOVEMBER 2026, LOW ENTRIES' (520.18)
8:40.2  SAY:  "Because I think we're gonna start flying in 2027"
8:42.4  [DIAGRAM] T-2028-s2.png: '2027, RATES COME DOWN (MY VIEW)' (522.40)
8:43.2  SAY:  "once interest rates come back down."
8:45.3  SAY:  "That gives this loop two full years to run."
8:46.3  [DIAGRAM] T-2028-s3.png: '2028, THE GOAL' + the bracket '2 FULL YEARS FOR THE LOOP' (526.34); hold to 527.86
8:47.4  [MUSIC] HARD HIT 527.4: the one swell of the drone tops here (16.9 dB under the voice), as the file plays it; no
        SFX (if it reads too full: one relative dip -2 dB, 522.5 → 530.5, MUSIC-PLAN open question)
8:47.9  [VIDEO] BR-17 IN → 8:51.8 BR-17-twenty-dollar.mp4: a single twenty dollar bill on a table (3.89 s) · Envato fade
        → hand:fade (broll-fade, 0.50s)
8:47.9  SAY:  "Imagine starting out with just simple $20 investments."
8:51.8  [DIAGRAM] D-IMAGINE IN → 8:58.5 (LIGHT, cyan): the eyebrow 'A HYPOTHETICAL. HOW ROTATING WORKS. NOT A RESULT.' held → hand:xfade-scale (container-xfade, 0.35s)
        in EVERY state; only '20 DOLLARS' and '10 PLAYS' are ever printed (FLAG 527.86)
8:52.3  SAY:  "You put $20 down on a play, like LAB, it does a 350X."
8:53.5  [DIAGRAM] D-IMAGINE-s1-stake.png: the 20 DOLLARS chip drops onto ONE PLAY (533.52, 8-frame ease-out drop)
8:56.3  [DIAGRAM] D-IMAGINE-s1b-grow.png: the column GROWS under the chip (536.26); LAB and the 350X stay spoken; hold to
        538.50
8:58.5  [IMAGE] IMG-8 IN → 9:02.4 IMG-8-summit-above-clouds.png: a summit above a sea of clouds at first light, one small
        figure a little below the peak (3.9 s still) · glitch ingress → hand:cross-warp (glitch-still, 0.50s)
8:58.6  SAY:  "Now, you don't sell it all at the top, that's unrealistic."
9:02.4  [DIAGRAM] D-IMAGINE returns on s1b → 9:22.0 → hand:xfade-scale (container-xfade, 0.35s)
9:02.5  SAY:  "But let's say you're selling on the way up,"
9:03.9  [DIAGRAM] D-IMAGINE-s2-hill.png: the hill draws on, 4 sell ticks on the way up, never at the TOP, tag 'SELL ON THE WAY
        UP, NOT THE TOP' (543.92)
9:05.3  SAY:  "and you end up with $2,000."
9:05.5  [DIAGRAM] D-IMAGINE-s2b-pot.png: the sells' dashed wires draw into ONE POT (545.48); no 2,000 printed
9:07.8  SAY:  "Now you have the $2,000, and you can spread out,"
9:11.2  SAY:  "let's say, $200 into 10 different tokens."
9:12.3  [DIAGRAM] D-IMAGINE-s3-split.png: arrow out of the pot, 10 equal stakes pop left to right, '10 PLAYS' (552.28)
9:15.1  SAY:  "And then another one of those tokens does 100X,"
9:17.2  [DIAGRAM] D-IMAGINE-s4a-one.png: stake 3 grows (557.18)
9:18.0  SAY:  "and another one does 50X, and then another one does 300X."
9:18.8  [DIAGRAM] D-IMAGINE-s4b-two.png: stake 7 grows (558.80)
9:20.8  [DIAGRAM] D-IMAGINE-s4c-three.png: stake 9 grows (560.80); heights relative only, no values; hold to 561.95
9:22.0  [VIDEO] BR-18 IN → 9:25.6 BR-18-river-delta.mp4: a river delta branching again and again, aerial (3.65 s), ends on the
        F7 edge · Envato fade → hand:fade (broll-fade, 0.50s)
9:22.0  SAY:  "So you see where I'm going here."
9:23.8  SAY:  "The money just keeps multiplying."
9:25.6  [TRANSITION] cover→face cut-in F7 → hand:film-burn (face-cut, 0.76s) (face pick)
9:25.6  [FACE] F7 IN → 9:30.6 (window 565.601-570.567) AS assets/face-swap/F7-higgsfield-bg-swap.mp4 from clip 0.400 s
        (residual 20 ms); no caption
9:25.8  SAY:  "Millions by 2028, that's my goal, that's my plan."
9:29.4  [MUSIC] HARD HIT 569.44, FACE 7: a small lift of the drone on "that's my plan", as the file plays it; no hit under
        the locked goal line
9:29.9  [PUNCH-IN] F7 hard ~15-20% step IN ON the desilencer join 569.867 (frame 17096, jumpcuts-final.json) → holds to the
        window end 9:30.6
9:29.9  [LIGHTLEAK] F7 library light leak peaking ON the same join frame (lib:lightleaks-*, the next look of the video's
        set) → lib:lightleaks-soft-short-2 (punch-leak, 0.40s) (punch-leak)
9:30.6  [TRANSITION] face→cover F7 out → hand:film-burn (face-cut, 0.76s) (at the picture edge 570.567; Whisper's "plan." end 570.64 is
        padding)
9:30.6  [CONTAINER] H0 IN → 9:36.0 (LIGHT, the gold callback to the hook) full-frame motion-type card, H0-s1.png: 'MILLIONS
        BY 2028' with 'MY PLAN. MY GOAL.' under it, the third line ghosted; first person, never a promise (guard 9) ·
        NO SFX and NO bed dip here (ruled 2026-11-24 at GATE blueprint under Mike's standing approval: the music plan
        asks for "a small lift of the drone on that is my plan; no hit" and Mike ruled subtle music after the intro, so
        the epic impact and the momentary Bed D duck this plan had added at 570.567 are REMOVED; the drone's own lift
        carries the beat)
9:30.8  SAY:  "I'm not predicting the bottom, I'm not predicting the top."
9:34.7  [CONTAINER] H0-s2.png: "I'M RUNNING THE LOOP." lands (574.72)
9:34.7  SAY:  "I'm running the loop."
9:36.0  [CONTAINER] E1 END card IN → 9:45.9 (LIGHT, cyan), the lines held back; no price, no membership tier → hand:xfade-scale (container-xfade, 0.35s)
9:36.2  SAY:  "So click the link in the description below"
9:36.6  [CONTAINER] E1-s1.png: 'LINK IN THE DESCRIPTION' on "click the link" (576.64)
9:38.5  SAY:  "if you wanna get in on this action."
9:41.0  SAY:  "And click that like button, and comment below."
9:41.8  [CONTAINER] E1-s2.png: 'LIKE' (581.84)
9:43.7  [CONTAINER] E1-s3.png: 'COMMENT: WHAT COINS ARE YOU BUYING?' (583.72); hold to 585.85
9:43.7  SAY:  "Let me know what coins you're buying."
9:45.9  [VIDEO] BR-19 IN → 9:48.6 BR-19-city-sunrise.mp4: sunrise over a city skyline, slow aerial (2.79 s), ends on the F8
        edge · Envato fade → hand:fade (broll-fade, 0.50s)
9:45.9  SAY:  "Just remember, buy those bottoms."
9:48.6  [TRANSITION] cover→face cut-in F8 → hand:film-burn (face-cut, 0.76s) (face pick)
9:48.6  [FACE] F8 IN → 9:50.2 EOF (window 588.635-590.213) AS assets/face-swap/F8-higgsfield-bg-swap.mp4 from clip 1.267 s
        (the 1.25 s handle reaches Seedance's 4 s minimum; residual 30 ms); no caption
9:48.6  [MUSIC] HARD HIT 588.64: the LAST TONE of the drone on the cut to the sign-off face, then only its decay, 7 dB down
        on "later", a 0.3 s fade closes it at 590.23; no SFX
9:48.7  SAY:  "And I'm gonna catch you guys later."
9:49.5  [PUNCH-IN] F8 hard ~15-20% step IN ON the desilencer join 589.5 (frame 17685, jumpcuts-final.json) → holds to EOF
9:49.5  [LIGHTLEAK] F8 library light leak peaking ON the same join frame (lib:lightleaks-*, the third look of the set)
        → lib:lightleaks-soft-short-4 (punch-leak, 0.40s) (punch-leak)
9:50.2  [END] HARD OUT on "later." at 590.213: no face-out transition, no held still, no end card after the line
```

## Orphan reconciliation (against `assets/` on disk, 2026-11-24)
Every renderable file is PLACED above with a timecode or REJECTED here. Source files (.html / .py / .md / .json / .txt) are
exempt (comp-build §10). **BENCH: none** (COVER-PLAN bench rows were never acquired; CLIP-2, CLIP-5, CLIP-6, CLIP-11 stay
HELD in the screenplay and were never captured, so they are not in `assets/`).

**PLACED:**
- Clip inserts x4: CLIP-1, CLIP-4, CLIP-3, CLIP-8 (0:09.7, play order 1 → 4 → 3 → 8).
- Receipts x21 (24 files): R-HL1 · R-HL2 · R-HL3 · R-HL4 · C27 · C7 · R-ALJ (headline + sentence) · R-BLOCK (headline +
  liquidations) · C10 (header + gasoline) · C11 · C8 · C9 · C12 (headline + causes) · R-NVDA-NEWS · R-NVDA-CHART · C15 ·
  C18 · C13 · R-NEWCOINS (mp4) · C20a (about + new-coin-alert-bot) · C20b (showcase-full + showcase-top). Treatments:
  pan 2 (C8, C12) · highlight 10 · push 9 (+ the CLIP-8 lead-out still).
- Charts, Type 1 ANIMATED in code (comp-build §7: the comp never holds a chart PNG): C3 · C16 (hook + walk, 2 runs) · C14
  (hook + walk, 3 placements) · C1 (7 placements, 9 states) · C5 · C-NVDA · C-SPACEX · C2 · C16-ZOOM · C23 · C24. Their
  PNGs (C1-s0, C1-s1, C1-s1b, C1-s2, C1-s3, C1-s3b, C1-s4, C1-s5, C1-s6, C3-start/mid/payoff, C5-start/mid/payoff,
  C-NVDA-start/mid/payoff, C-SPACEX-start/listing/low/rally/payoff, C2-start/sp500/ndx/payoff, C14-hook-start/band/payoff,
  C14-walk-1-frame ... C14-walk-7-drop, C16-hook-start/mid/payoff, C16-walk-1-alert ... C16-walk-7-payoff,
  C16-ZOOM-start/pumping/pullback/payoff, C23-start/mid/all19/tag/dips, C24-start/mid/payoff) are each named on the row
  whose state they define: they are the DESIGN SPEC the animation must match frame for frame, never a comp input.
- Diagrams, Type 2 SYSTEM-DESIGN stills (comp swaps them, 6-frame cross-fades): D-RATES s1-s6 · D-ROTATE s0-s3 · C22 s1,
  s2, s2b, s3, s4, s5 · C22B s1-s5 · T-2028 s0-s3 · D-IMAGINE s1-stake, s1b-grow, s2-hill, s2b-pot, s3-split, s4a-one,
  s4b-two, s4c-three.
- Card slides (state PNGs): H1 s1-s3 · C26 s1-s4 · C6 s1-s3 · D-THEORY s1-s2 · D-PRIOR s1-s3 · C17 s1-s2 · D-COMMON s1-s2 ·
  D-TELL s1-s6 · D-ENTRIES s1-s3 · H0 s1-s2 · E1 s1-s3. Title slides: title-CH2 · title-CH3 · title-CH5-s0 · title-CH5.
- Video b-roll x19: BR-1 ... BR-19, each once (rule #12). Images x8: IMG-1 ... IMG-8, each once.
- Whiteboard x1: WB1.mp4 (6:27.7, 24.14 s).
- Face swap x8: assets/face-swap/F1 ... F8-higgsfield-bg-swap.mp4 over the 8 FACE windows (+ their .json / .retime.json
  records, read by the comp for window_starts_at_clip_s).

**REJECTED (renderables deliberately not placed):**
- `card-slides/<id>.png` bases (H1, C26, C6, D-THEORY, D-PRIOR, C17, D-COMMON, D-TELL, D-ENTRIES, H0, E1): `_shot.py`
  writes the LAST state again as the bare id, pixel-identical to the last `-sN`; the state files are the inputs.
- `face-swap/F1 ... F8-raw-for-higgsfield.mp4`, `face-swap/backdrop-reference-city.png` and everything in `face-swap/look/`
  (look-neon, look-vault, look-trading, look-city, look-bright, the frame grabs and sheets): inputs to the city-look swap;
  the swapped clips are what airs.

## Sound design: the palette weighed (longform-edited.md section 7, mood-matched)
- PLACED: 3 card impacts (CH2 card-impact-layered epic · CH3 DSGN ElevenLabs neutral · CH5 Soundjay short neutral, each
  ringing out inside its pause). The vibe cut first written on H0 (Impact_Hit_01-2-short epic + a momentary Bed D duck)
  was REMOVED at GATE blueprint, 2026-11-24 (the music plan says "no hit" there; Mike ruled subtle after the intro).
  Every other MUSIC-PLAN hard hit is a music move with no SFX, as the plan asks.
- Not used, by type: **braam** (epic): a braam needs a spine pause of its audible length (about 4 s), the delivered cut is
  already about 10:08 against Mike's 10:00 ceiling, and every chapter after CH1 is ruled subtle · **riser / tension
  builder**: every reveal worth a build starts on a word or right after the last word of a line, and the risers in the
  kit are tense / dark (wrong for the calm beds) · **downshifter** (tense): the one deflation beat, the EVAA drop at 5:43.6,
  is the strategist's "no added sound" landing on a figure of Bed C · **drone** (tense): Bed D is already a drone; a second
  one would muddy it · **accent** (tense sci-fi / neutral timpani): every quick graphic pop lands ON a spoken word, so an
  accent would sit over the voice · **whoosh** (neutral): the only fast cover change in silence is the montage splice,
  where the insert-in transition owns the cut and a whoosh tail would run under the Bloomberg anchor's first word ·
  **ding / stinger**: the coin pops (IMG-5, IMG-6) land under "Let's start with Pieverse" / "Now, EVAA", over words ·
  **texture**: no pen or paper texture in the kit for WB1 · **kinetic-text** sounds: the screenplay names no kt- device.
