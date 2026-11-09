# quant - WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.f.enhanced.mp4` (M:SS.s, 9:23.3, 30 fps). Timecodes from the spine word-transcript + blackdetect FACE/COVER spans (AS-RECORDED.md). Sibling of EDIT-PLAN.md (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect); word cues from `spine/ALL.f.enhanced.medium-words.json`; state cues from assets/diagrams/C1-spec.md, assets/slide-sources/_state-cues.md, assets/charts/C5-spec.md, C6-spec.md, C7-spec.md.
> Ids: C-numbered receipt / card / chart / diagram · K* deck card · T* title card · R-* receipt · WB* whiteboard beat · FB* screen-share body · F1 to F9 face windows · CLIP-1 insert.
> CH1 is first, nothing before it. Timecodes are FINAL-spine seconds, PRE-pause. Timeline shifters, routed through `sh()`: five title cards 1.5 s each (trough snaps dry-run on this spine: T2 53.955, T3 207.315, T4 333.300, T5 394.840, T6 494.340) and CLIP-1 10.8 s (235.870). Delivered runtime around 9:41.6.
> **FACE MODE = SCREEN SHARE (house rule #1b):** a FACE span is Mike's OBS layout played verbatim, its deck area (x 0 to 1464) painted by the comp's FACE_BODY layer. Face reframe WAIVED. No zoom steps, no leaks, no captions.

## FACE spans (baked spine shows the face - face appears ONLY here)   9 spans
- 0:00.0 → 0:31.8   F1 CH1, "So what is Quant? ... not a new blockchain."   (0.000 → 31.767, opens ON face). BODY FB1 receipt C9 0.00-20.60, BODY FB2 card K1 20.60-31.77
- 2:57.6 → 2:59.8   F2 CH2, "Now here's the thing with the real names."   (177.600 → 179.767). BODY FB3 diagram C1 whole
- 3:27.3 → 3:30.1   F3 CH3, "So who's actually using this? Let's start with the founder,"   (207.267 → 210.133). BODY FB4 receipt C20 headshot crop
- 4:42.8 → 4:54.9   F4 CH3, "On September 24th, 2026 ... transaction management layer."   (282.800 → 294.900). BODY FB5 receipt C12, highlight 4:49.7
- 5:52.5 → 6:01.1   F5 CH4, "And at the time of this recording ... rank 34."   (352.533 → 361.100). BODY FB6 card C4 count-up
- 6:40.4 → 6:46.2   F6 CH5, "All right, so now look at this ... going back to 2018."   (400.400 → 406.200). BODY FB7 chart C5 line draw-on
- 7:13.3 → 7:22.3   F7 CH5, "All right, so now the peers ... You got Bitcoin in grey."   (433.267 → 442.300). BODY FB8 chart C6 legend + lines through 2026-08
- 7:41.8 → 7:54.1   F8 CH5, "And then in Bitcoin terms ... around 254,000 sats."   (461.767 → 474.133). BODY FB9 chart C7 s1 draw-on
- 8:58.0 → 9:04.2   F9 CH7, "But every one of those banks is an island ... connects them."   (537.967 → 544.167). BODY FB10 whiteboard WB11 from 19.547

## TRANSITIONS (chapters + face + b-roll - MANDATORY; full per-cut list = TRANSITIONS.md)
RESOLVED 2026-11-05 from TRANSITION-PLAN.json (44 scene changes, every one in TRANSITIONS.md §5): card = `rmn:cube` on both chapter cards · face cut in/out = `hand:film-burn` (hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn, hand:film-burn) · AI stills = none · marquees = lib:spin-3d-center-ease-short-t-cw @3:17.6 (SPIN-newfacet), lib:melt-rgb-soft-1 @3:23.8 (MELT-transform) · Envato video = hand:fade · container / diagram swaps = hand:xfade-scale · punch-ins = hand:punch.
CHAPTER cards (ON only at a bed change; WAIVED on this video, one bed throughout, cards ON per GATE plan; ONE presentation for all five):
- 0:54.0 CH2 T2 · 3:27.4 CH3 T3 · 5:33.5 CH4 T4 · 6:34.9 CH5 T5 · 8:14.6 CH6 T6   (each + a 1.5 s pause; the bed runs through with its 0.4 s out and 1.0 s swell back)
FACE cuts (the video's face pick, every cut in and out):
- in: 2:57.6 · 3:27.3 · 4:42.8 · 5:52.5 · 6:40.4 · 7:13.3 · 7:41.8 · 8:58.0   (0:00.0 = opens ON face, no cut-in)
- out: 0:31.8 · 2:59.8 · 3:30.1 · 4:54.9 · 6:01.1 · 6:46.2 · 7:22.3 · 7:54.1 · 9:04.2
- 3:27.3 F3 cut-in sits 0.05 s before T3's pause: T3's exit is what reveals the screen share (see Open decisions).
Intra-FACE zoom steps + light leaks: NONE. A screen share is never zoomed; `spine/jumpcuts-final.json` lists joins inside F1 to F9 and none of them is a cue here.
FACE BODY change inside a window (comp-build section 4c entrance, silent, not a TRANSITIONS row): 0:20.6 FB1 → FB2. Inside FB1 the hand-offs at 0:04.7 and 0:09.9 are plain container swaps.
WHITEBOARD paper sheet (bucket 3 container move, in over 11 frames, out over 0.3 s; nothing transitions inside a beat):
- own cut: 1:11.3 WB2 · 1:35.6 WB3 · 2:01.8 WB4 · 2:31.8 WB5 · 3:34.5 WB14 · 4:14.1 WB6 · 6:05.5 WB8 · 8:38.4 WB11
- on a face cut or a card (that transition owns the cut): 0:31.8 WB12 · 0:54.0 WB1 · 4:54.9 WB7 · 5:33.5 WB13 · 8:14.6 WB10
RECEIPT / CONTAINER scene changes (quiet, text containers stay quiet):
- 1:59.1 C10 · 3:17.6 C22 · 3:23.8 C1-right · 3:49.7 CLIP-1 lead-in · 4:00.5 C14 · 4:33.6 R-TCH-JUN · 5:09.9 R-ROSALIND · 5:14.7 C13 · 5:22.6 C15 · 5:27.3 C16 · 5:29.7 R-DENTSU · 9:09.5 K4
- on a face cut or a card: 2:59.8 C1 · 3:30.1 C20 · 6:01.1 C21 · 6:34.9 K2 · 6:46.2 C5 · 7:22.3 C6 · 7:54.1 C7 · 9:04.2 K3
- crop cuts INSIDE a receipt (no transition row): C14 4:02.3 and 4:04.3 · R-TCH-JUN 4:40.1.
INSERT: 3:55.9 CLIP-1 insert-in / insert-out (default hand:fade 0.5 s each side), lead-in + lead-out stills around it.
VIDEO b-roll and IMAGE b-roll transitions: none, this video has neither.
MARQUEE candidates (the strategist rules; the only chart-to-chart or receipt-to-diagram cuts that are not owned by a face cut or a card):
- SPIN candidate 3:17.6 C1-fusion turns to its dated proof C22 → CHOSEN `lib:spin-3d-center-ease-short-t-cw`
- MELT candidate 3:23.8 C22 reforms into C1-right → CHOSEN `lib:melt-rgb-soft-1`
- MELT candidate 7:22.3 C6 grows out of the deck area to full frame, only if the strategist lets a marquee override the face pick here → NOT taken (see TRANSITIONS.md §4)

## CHAPTER cards begin  (ON only at a bed change; one-bed waiver, cards ON per GATE plan)
- 0:00.0 CH1 "THE OPEN", NO card ; 0:54.0 CH2 "Islands of Money" T2 ; 3:27.4 CH3 "Who Uses It" T3 ; 5:33.5 CH4 "The Token" T4 ; 6:34.9 CH5 "Quant vs The Market" T5 ; 8:14.6 CH6 "What's Next" T6 ; 8:38.4 CH7 "THE CLOSE", NO card

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   51 states
> Asset types: CHART(anim) = animated for real on useCurrentFrame, the PNGs are its design states · CHART(sysdesign) = Type 2 state stills, comp swap only · SLIDE(card) = deck card state PNGs, hard swaps. In a FACE window the same stage is scaled by 1464/1920 into the deck area on the page colour. **SFX rule: a FACE_BODY row and every state change inside a FACE window are SILENT.** A state swap on a cover is silent too unless it is listed under IMPACTS + RISERS.
- 0:20.6 SLIDE(card) K1 BODY FB2 · 0:23.8 K1-s1 London · 0:25.6 K1-s2 2015 · 0:27.5 K1-s3 Gilbert Verdian · 0:30.2 K1-s4 not a new blockchain
- 2:57.6 CHART(sysdesign) C1-whole BODY FB3, shown ONCE as the whole · 2:59.8 C1-whole full frame · 3:00.2 C1-left-column · 3:02.0 C1-left-core · 3:02.9 C1-left-treasury · 3:03.7 C1-left · 3:04.6 C1-quant · 3:06.1 C1-overledger · 3:08.0 C1-flow · 3:11.7 C1-payscript · 3:12.4 C1-quantnet · 3:15.6 C1-fusion
- 3:23.8 C1-right · 3:25.2 C1-right-labels (C1-spec.md's cue; the plan's 207.16 would flash them)
- 5:52.5 SLIDE(card) C4 BODY FB6 over C4-plate · 5:55.1 C4-s1 $199 · 5:57.7 C4-s2 $2.9 billion · 6:00.7 C4-s3 rank 34 `[VERIFY]`
- 6:34.9 SLIDE(card) K2 · 6:38.5 K2-s1 · 6:39.1 K2-s2 (no word cue, even spacing) · 6:39.8 K2-s3
- 6:40.4 CHART(anim) C5-start BODY FB7 · 6:41.6 line clip to C5-mid · 6:46.2 C5-mid full frame · 6:46.9 peak ring · 6:50.0 C5-peak · 6:53.7 band wipe · 6:56.4 C5-band · 7:03.7 0.028% · 7:06.2 0.092% · 7:08.5 C5-run · 7:11.3 C5-payoff `[VERIFY last point]`
- 7:13.3 CHART(anim) C6-start BODY FB8 · 7:14.7 / 7:15.2 / 7:15.9 / 7:16.5 / 7:16.9 legend chips · 7:18.1 C6-legend · 7:21.5 Bitcoin · 7:22.3 C6-mid full frame · 7:25.9 C6-140 · 7:29.4 C6-82 · 7:33.1 peers hold · 7:35.8 C6-break (y axis 160 to 400) · 7:36.7 draw on · 7:38.4 C6-273 · 7:41.1 C6-payoff `[VERIFY endpoints]`
- 7:41.8 CHART(anim) C7-s1-start BODY FB9 · 7:42.4 line draw · 7:48.0 C7-s1-first · about 7:52.8 peak ring · 7:53.9 C7-s1-end · 7:54.1 full frame · 7:55.3 3.54x · 7:59.3 C7-s1-payoff · 8:01.1 THE ZOOM · 8:03.9 ATH ring · 8:06.5 C7-s2-zoom · 8:11.1 C7-s2-payoff `[VERIFY]`
- 9:04.2 SLIDE(card) K3 · 9:07.0 K3-s1 Like · 9:07.8 K3-s2 Subscribe
- 9:09.5 SLIDE(card) K4 · 9:21.6 K4-s1 Link in the description. No figure on the card.

## RECEIPTS / inserts begin   13 receipts + 1 insert  (typed per broll-and-containers.md: R(article) · R(other); treatment per receipt)
- 0:00.0 C9-quant-home → 0:04.7 → C9-quant-home-scroll → 0:09.9 → C9-quant-home-b → 0:20.6, R(other) BODY FB1, push. The opening screen share
- 1:59.1 C10-quant-flow R(other), highlight 'No new network to join...' @1:59.8
- 3:17.6 C22-fusion R(article), highlight 'June' @3:18.7 and '74 networks' @3:22.3
- 3:27.3 C20-verdian R(other) BODY FB4 headshot crop · 3:30.1 full-frame bio crop, CUT never a scroll (do-not-air ISO sentence), highlight '20 years' @3:33.6
- 3:49.7 CLIP-1 LEAD-IN still → 3:55.9 ⏸ [INSERT] CLIP-1 (10.8 s, Gilbert Verdian's OWN voice, spine paused, bed ducks, insert-in / insert-out) → 3:55.9 CLIP-1 LEAD-OUT still → 4:00.5
- 4:00.5 C14-gbtd-a-title → 4:02.3 C14-gbtd-c-quant → 4:04.3 C14-gbtd-b-body, R(other), highlight: 'developed by Quant' @4:02.3, seven banks @4:06.1 to 4:11.3, first live customer transactions @4:12.4
- 4:33.6 R-TCH-JUN-tch R(article), highlight '25' @4:35.3, RTP and CHIPS @4:38.6, cut @4:40.1, '$2 trillion' @4:41.1
- 4:42.8 C12-tch-quant R(article) BODY FB5, highlight the Quant paragraph @4:49.7 ('Look right here')
- 5:09.9 R-ROSALIND-bis R(other), pan lib:motion-3d-pan-1-down `[VERIFY]`
- 5:14.7 C13-boe-lab R(other), highlight Quant's row @5:15.7 and 'not a regulatory sandbox' @5:20.6 `[VERIFY]`
- 5:22.6 C15-ecb-annex R(other), highlight 'Quant Network Europe Limited (P)' @5:22.8, push to the legend @5:24.7 `[VERIFY]`
- 5:27.3 C16-murex R(article), push on the headline `[VERIFY]`
- 5:29.7 R-DENTSU-dentsu R(article), pan lib:motion-3d-pan-2-right `[VERIFY]`
- 6:01.1 C21-overledger R(article), highlight 'paid in QNT' @6:03.9 `[VERIFY]`

## WHITEBOARD beats (hand-drawn clips, paper-quant pen, full frame)   13 beats · 290.9 s
Clip lengths measured against their windows: all 13 match inside one frame. 50.0% of the 581.6 s delivered runtime (COVER-PLAN whiteboard_check). Paper sheet in 11 f / out 0.3 s. No captions over a beat.
- 0:31.8 → 0:54.0  WB12 the layer on top
- 0:54.0 → 1:11.3  WB1 every bank is an island
- 1:11.3 → 1:35.6  WB2 digital deposits, new fences
- 1:35.6 → 1:59.1  WB3 not another island
- 2:01.8 → 2:31.8  WB4 lock, credit, settle ;  draw-on SFX at 2:10.7 and 2:24.7 (padlock)
- 2:31.8 → 2:57.6  WB5 all legs or none ;  draw-on SFX at 2:45.1 (padlock) and 2:47.9 (checks)
- 3:34.5 → 3:49.7  WB14 the founder's road
- 4:14.1 → 4:33.6  WB6 the remortgage ;  draw-on SFX at 4:26.0 (padlock)
- 4:54.9 → 5:09.9  WB7 the archipelago
- 5:33.5 → 5:52.5  WB13 the jar ;  draw-on SFX at 5:43.5 (padlock)
- 6:05.5 → 6:34.9  WB8 two pipes
- 8:14.6 → 8:38.4  WB10 flags on the horizon
- 8:38.4 → 8:58.0  WB11 the islands, connected, part 1 (from: 0.00) ;  8:58.0 → 9:04.2 part 2 is BODY FB10 in the deck area of F9 (from: 19.547), silent

## VIDEO b-roll begins  (Envato + AI clips)   0
- None. Mike: no Envato on this video (`--envato-max 0`). Approved Seedance motion on C9 + C10 is not on disk: see Open decisions.

## IMAGE b-roll begins  (stills + photos)   0 placed · 0 BENCH
- None. Mike: no ChatGPT images on this video (`--chatgpt-max 0`). Site captures are receipts.

## LIGHT LEAKS
- None. Screen-share face mode carries no zoom steps and no leaks.

## KINETIC TEXT   0 panels + 0 pops
- None. SCREENPLAY.md names no device id.

## IMPACTS + RISERS (audio - mixed on with ffmpeg, NOT in comp; every row UNDER the VO, nothing over the last word of a line)
All mood_class neutral. Tails measured on the files where the envelope falls 40 dB below peak.
- CARD IMPACT, one file for all five: 0:54.0 · 3:27.4 · 5:33.5 · 6:34.9 · 8:14.6  `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` (peak 0.09 s, tail ends 1.17 s), lands at card start + the card turn, MIX GAIN -12 dB, clear of the next word inside the 1.5 s pause
- PADLOCK CLICK, the story motif: 2:10.7 WB4 shut · 2:24.7 WB4 open · 2:45.1 WB5 reserves · 4:26.0 WB6 open · 5:43.5 WB13 lid  `kinetic-text/mouse-click.mp3` (play 1.00-1.25, one click, peak 1.07 s), MIX GAIN -10 dB
- DING: 2:47.9 WB5 three checks at once  `DING-093.wav` (peak 0.21 s, tail ends 0.92 s), MIX GAIN -14 dB
- WHOOSH on the chart axis moves: 7:35.4 C6 rescale · 8:00.8 C7 THE ZOOM  `Cinematic Whoosh 06.wav` (peak 0.59 s, audible 0.30-1.01 s), MIX GAIN -14 dB
- CTA CLICK: 9:07.0 like · 9:07.8 subscribe · 9:21.6 click the link  `kinetic-text/mouse-click.mp3`, same trim and gain
- RISERS: none. BRAAMS: none. DUCKS: none written (MUSIC-PLAN has no automation rows; CLIP-1's -14 dB duck is automatic).
- MUSIC-PLAN hard hits, all four "no hit" by its ruling, each a `[MUSIC]` row with `[IMPACT] layer: none`: 0:00.0 · 4:30.5 · 7:35.1 · 8:58.1
- Screen-share windows are silent of SFX; the library transitions' own sounds land with TRANSITIONS.md.

## MUSIC beds (ONE track, ONE seat -24.3 dB = -17 dB under the +3 dB voice; full carve = MUSIC-PLAN.json; license code → YT description ONLY)
Solstice, DeHartmann, Soundstripe 14703, `assets/music/Solstice/DeHartmann_Solstice_instrumental_4_17.mp3`  `PIMM1ZEYZYLHCITE`
- 0:00.0 → 0:54.0   CH1 file in 0.00, the file's own build-in, full tone by 3.6 s, plateau
- 0:54.0 → 3:27.4   CH2 file in 54.02, continues CH1 with no splice
- 3:27.4 → 5:33.5   CH3 file in 10.00, fullest bars 22-28 under 4:30.7-4:54.0, ducked -14 dB under CLIP-1 automatically
- 5:33.5 → 6:34.9   CH4 file in 120.00, thinnest low end under the tokenomics, the +2.5 dB step at 6:30.7
- 6:34.9 → 8:14.6   CH5 file in 103.33, pinned on the peers chart: step down 7:31.7, bar 50 peak 7:38.2-7:41.6, settles 8:08.2-8:14.6
- 8:14.6 → 8:38.4   CH6 file in 188.23, opens the final movement, sample-continuous into CH7
- 8:38.4 → 9:23.3   CH7 file in 212.09, dip 8:53.0-8:56.3, last bars 8:56.3-9:09.7, the file's own fade from 9:09.7, silent at 9:22.8, last sample on the last frame
- Every jump back sits inside a card pause (0.4 s out, 1.0 s swell back), so no seam is heard. No hit, no stinger.
- If Mike calls the bed hot at the draft: -26.3 dB (19 dB under) is the next notch, still one seat.

## CAPTIONS  (none)
- CAPTIONS: OFF (Mike, 2026-11-04). Not on the screen-share beats, not on covers. The AS-RECORDED mishear list still governs any on-screen text.

## Open decisions that move these cues
- **T3 / F3 pile-up (moves one edge by 0.05 s):** T3's pause dry-runs to 207.315, 0.05 s after F3 opens at 207.267. This blueprint holds C1-right-labels into the pause so F3 never flashes before the card, and lets T3's exit reveal the screen share. The comp-builder needs this edge; lint_covers may need the row's tOut set to the pause.
- **Cover hand-overs around the card snaps (move edges by up to 0.22 s):** the snaps land before the planned cover boundaries, so the outgoing cover would reappear after the card: T2 0.07 s of WB12, T4 0.16 s of R-DENTSU, T5 0.06 s of WB8, T6 0.22 s of C7. The first frame after each card must be the new cover. Whiteboard clips' frame 0 stays on their planned tIn so the drawing stays on its words.
- **Plan cues changed here, on the state specs or for readability:** C1-right-labels 3:25.2 (plan 207.16) · C5 '0.028%' 7:03.7 and '0.092%' 7:06.2 (plan 419.58 and 423.0; the spec lands them on the spoken numbers) · C21 highlight 6:03.9 (plan 364.94 leaves 0.56 s to read).
- **R-DENTSU is a pan here, COVER-PLAN says push:** a 3.8 s headline shown as an object, nothing read off it. No cue moves.
- **Seedance clips approved at GATE plan are NOT on disk:** `assets/img-motion/C9-motion.mp4` and `C10-motion.mp4` do not exist and no graph node makes them. Today the stills + comp pushes air (the plan's named fallback). If they are generated, C9's plays 0:00.0 to 0:04.0 with the still holding to 0:04.7, C10's is cut to its 2.7 s slot.
- **R-ROSALIND-bis (QA flag):** nothing on the frame names Quant, so it does not itself prove 'Technology vendor'. Bench: Quant's own release headline, same slot. **C15-ecb-annex (QA flag):** a plain list with no ECB mark and no 2025, provenance rests on the VO.
- **'picked bank' at 4:47 (F4):** left as recorded per GATE plan, with TCH's printed text naming Quant on screen. A re-record would change F4 and re-time everything after it.
- **CLIP-1 caption month:** 'October 2026' is burned in, its confirmation still open in COVER-PLAN (upload 2026-10-22). No cue moves.
- **Card impact level:** MIX GAIN -12 dB is a judgment against this calm drone (the mixer default is -6). Ear-check at the draft.
