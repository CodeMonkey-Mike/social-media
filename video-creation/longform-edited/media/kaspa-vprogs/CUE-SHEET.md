# kaspa-vprogs - WATCH-ALONG CUE SHEET  (reconciled to the spine)

> Watch file: `spine/ALL.f.cut.mp4` (M:SS.s, 202.822 s / 3:22.8). Timecodes from the spine word-transcript
> (`spine/ALL.f.cut.medium-words.json`) + blackdetect FACE/COVER spans (AS-RECORDED). Sibling of EDIT-PLAN.md
> (event log) + EDIT-PLAN-prep.md. Format: skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect); every other cue is a word onset from the word JSON (frame-locks at comp).
> Timecodes are FINAL-spine, PRE-card-pause: the 1.5 s title-card pauses at 0:40.2 and 2:17.6 shift everything
> after them by +1.5 s / +3.0 s via `sh()` (final runtime 3:25.8).
> Ids: card-slide / title-slide ids as on disk · diagram ids (Type 2 stills, `<id>-<state>`) · c3-ladder (Type 1
> animated) · R* receipt · BR-* Envato b-roll · IMG-* ChatGPT still.
> CH1 is first, nothing before it (opens ON face). Zero orphans: see the EDIT-PLAN reconciliation.

## FACE spans (baked spine shows the face, face appears ONLY here)   2 spans
- 0:00.0 → 0:07.3   CH1 hook, "Kaspa is building vProgs ... not an L2."  (opens ON face; 0.000-7.333)
- 0:28.2 → 0:31.9   CH1 thesis, "Kaspa is never going to run your app, Kaspa is going to verify it."
  (28.167-31.933; the cut follows the picture edge, not the 28.10 word start)

## TRANSITIONS (chapters + face + b-roll, MANDATORY; full per-cut list = TRANSITIONS.md)
RESOLVED 2026-09-28 from TRANSITION-PLAN.json (38 scene changes, every one in TRANSITIONS.md §5): card = `hand:cube-3d` on both chapter cards · face cut in/out = `lib:blocks-max` (lib:blocks-max-1, lib:blocks-max-2, lib:blocks-max-3) · AI stills = lib:badsignal-short-1 @2:17.6, lib:badsignal-max-1 @3:01.4, lib:badsignal-short-2 @3:15.1 · marquees = lib:melt-rgb-3 @1:34.5 (MELT-transform), lib:spin-3d-side-ease-up @2:19.8 (SPIN-newfacet) · Envato video = hand:fade · container / diagram swaps = hand:xfade-scale · punch-ins = hand:punch.
CHAPTER cards (ON only at a bed change):
- 0:40.2  CH2 "NOT AN L2" (+ Bed A → B change + 1.5 s card pause)
- 2:17.6  CH3 "WHERE IT STANDS" (+ Bed B → C change + 1.5 s card pause)
FACE cut-ins / outs (3 cuts):
- in: 0:28.2 F2   (0:00.0 = opens ON face, not a cut)
- out: 0:07.3 F1 → R1 · 0:31.9 F2 → execute-verify-flip
Intra-FACE punch-ins (hold > 2 s → ~15-20% zoom, no glitch):
- 0:03.8 F1 on "real apps" · 0:30.6 F2 on the second "Kaspa is going to verify it"
VIDEO b-roll transitions (Envato = dissolve): 0:21.2 BR-1 · 0:38.8 BR-2 (hard OUT into the CH2 card) ·
  1:04.6 BR-3 · 2:58.5 BR-4
AI clip / IMAGE b-roll transitions (badsignal glitch or cross-warp): 2:17.6 IMG-1 (out of the CH3 card) ·
  3:01.4 IMG-2 · 3:15.1 IMG-3
CONTAINER / CHART scene changes = cross-fade + 0.93 → 1 scale-in (see the CONTAINER section). Push-in MATCH
cuts (same node language): 1:34.5 c1-overview → c1-kaspa-four-jobs (Kaspa node) · 2:43.3 c3-ladder → c3-next-rungs.
MARQUEE candidates (§4 reserved family, strategist's call, one MELT look + one SPIN look max):
- MELT candidate 1:34.5 (C1 overview reforms into the Kaspa-node break-up, a TRANSFORM) → CHOSEN `lib:melt-rgb-3`
- SPIN candidate 2:19.8 (IMG-1 → c3-ladder, the new facet; image → code chart, clear of the video cost trap) → CHOSEN `lib:spin-3d-side-ease-up`

## CHAPTER cards begin  (ON only at a bed change)
- 0:00.0  CH1 "STRAIGHT INTO IT", NO card (first chapter) ; 0:40.2 CH2 title-card-ch2 "NOT AN L2" ;
  2:17.6 CH3 title-card-ch3 "WHERE IT STANDS"   (each: 1.5 s edit pause, readable 1.13 s after the ~0.37 s turn)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)   17 containers · 74 state rows
> Types: CHART(anim) = code-built with motion · CHART(sysdesign) = static code-rendered still, comp-level
> movement only (slow 1.00 → 1.03 push, never a dead still) · SLIDE(card) = the rounded-card slides.
- 0:09.5  CHART(sysdesign) vprog-loop-mini, nodes · 0:10.9 state · 0:11.4 proof (token launches) · 0:14.0 landed
- 0:25.2  SLIDE(card) ten-bps-card, '10 BLOCKS / SEC' comp slam @0:25.9 (single state, 2.95 s)
- 0:31.9  SLIDE(card) execute-verify-flip, s1 EXECUTE struck · s2 VERIFY @0:32.6 · s3 APPS ON THE BASE LAYER
  @0:33.9 · s4 PROOF OF WORK SECURITY @0:35.9 · s5 NO L2 IN THE MIDDLE @0:37.9
- 0:52.2  CHART(sysdesign) c2-l2-stack, empty · chain @0:54.0 · sequencer @0:55.4 · bridge @0:59.0 ·
  liquidity @1:00.6 · pieces (red pulse x2) @1:02.1   (C2 shown ONCE)
- 1:07.8  SLIDE(card) sompolinsky-name-card, s1 · s2 'December 2025' stamp @1:12.4
- 1:21.7  CHART(sysdesign) c1-overview, dim · users @1:24.7 · reads @1:27.4 · writes @1:28.6 · kaspa @1:29.8 ·
  orders @1:31.0 · ORDERS pulse @1:34.1   (THE C1, shown ONCE, `// DIAGRAM_REFS`)
- 1:34.5  CHART(sysdesign) c1-kaspa-four-jobs, orders (push-in landing) · stores @1:34.7 · checks @1:36.2 ·
  meters @1:37.4 · execute @1:38.5 · drop starts @1:39.8 · dropped @1:40.3
- 1:40.4  CHART(sysdesign) c1-vprog-nodes, entry · nodes @1:41.7 · accounts @1:44.0 · lock @1:46.3
- 1:46.9  CHART(sysdesign) c1-provers, entry · operators @1:48.3 · launch @1:50.0 · landed @1:51.7
- 1:52.1  SLIDE(card) zk-math-receipt, s1 · s2 STATE ROOT CORRECT @1:54.4 · s3 CHECKED stamp @1:55.8 ·
  s4 RE-EXECUTE struck @1:58.2
- 1:58.4  SLIDE(card) sovereignty-card, s1 · s2 vPROG B BROKEN @2:01.5 · s3 vPROG A RUNNING @2:02.5 (4.96 s)
- 2:03.3  CHART(sysdesign) composability-card, entry · read @2:04.7 · tx @2:06.1 · one-unit @2:09.0
- 2:19.8  CHART(anim) c3-ladder, empty · CRESCENDO @2:20.7 (name @2:22.7, 10 BLOCKS / SEC @2:23.6) ·
  YELLOW PAPER @2:24.9 (DRAFT v0.0.1 @2:27.0) · TOCCATA @2:27.5 (name @2:29.5, ZK verify + covenants @2:30.5,
  LIVE ON MAINNET @2:33.0, inside consensus @2:34.5) · SILVERSCRIPT @2:36.3 (1.0 payoff @2:38.6)
  `[VERIFY Silverscript tag v1.0.0, KIP-2 Proposed]`
- 2:43.3  CHART(sysdesign) c3-next-rungs, entry · next @2:44.8 · full @2:47.2 · construction @2:49.2
  `[VERIFY kaspa.org/build still 'In construction']`
- 3:04.8  SLIDE(card) pow-money-hammer, s1 PROOF OF WORK MONEY · s2 WITH APPS ON IT @3:06.3 ·
  s3 NO L2 IN THE MIDDLE @3:07.7 (3.9 s)
- 3:08.6  SLIDE(card) cta-engage, s1 like · s2 comment @3:10.0 · s3 prompt @3:12.9
- 3:17.0  SLIDE(card) end-card-community, s1 LINK IN THE DESCRIPTION (pulse on "link" @3:17.5) ·
  s2 the greatest community ever @3:19.8, holds to the last frame

## RECEIPTS / inserts begin   9 files · 8 beats  (R(article) = reading/motion treatment · R(other))
- 0:07.3  R1 R(other) yellow paper title page, scale-back pop flash `[VERIFY]`
- 0:14.5  R2 R(other) rusty-kaspa v2.0.0 Toccata release, push to the KIP list @0:17.2, activation line @0:18.4
- 0:40.2  R3 R(article) ethereum-magicians rollup-centric roadmap, two-stage read: push @0:44.6, highlight
  @0:46.5, drift to 'primary accounts, balances, assets' @0:47.5
- 1:13.0  R4 R(article) Kaspa Magazine 2025-12-17 'obsolete path of L2's' quote, push lands @1:16.8
- 2:10.4  R5-a R(other) docs.kaspa.org/toccata activation line `[VERIFY]` ;  2:13.4 R5-b R(other) same page,
  ZK precompiles 'inside script' row, push completes @2:14.5 `[VERIFY]`
- 2:40.3  R6 R(other) silverscript v1.0.0 release, 'official release' @2:42.2 `[VERIFY]`
- 2:49.8  R7 R(other) kaspa.org/build vProgs 'In construction', push lands @2:52.1 `[VERIFY]`
- 2:52.8  R8 R(article) Kaspa Magazine hard-fork timing paragraph, push to 'three to six months' @2:56.3,
  'DELIVERED 2026-06-30' stamp + crash zoom @2:57.7 (Mike APPROVED)
- No clip INSERTS (no R-TALK): bed-duck-expr.py yields no windows, as expected.

## VIDEO b-roll begins  (Envato, all muted)   4
- 0:21.2  BR-1 glass planes rising ("the next layer up"), slot file 1.00-5.00
- 0:38.8  BR-2 glass shatter ("break this all down"), slot file 1.00-2.40, hard out into the CH2 card
- 1:04.6  BR-3 ice glow cracks split (cut on "break", crack spreads on "split up"), slot file 1.00-4.20
- 2:58.5  BR-4 datacenter corridor dolly (LEAD, "Everyone is racing"), slot file 1.00-3.86

## IMAGE b-roll begins  (ChatGPT stills)   3 placed · 0 BENCH
- 2:17.6  IMG-1 ladder into the DAG sky ("where does this all actually stand?")
- 3:01.4  IMG-2 lone layer above towers ("the more layer nobody owns is worth")
- 3:15.1  IMG-3 Kaspa coin sunrise ("Gonna be some exciting times")
- BENCH named, not acquired: ChatGPT slots 4-5 of 5 unused.

## LIGHT LEAKS (face holds > 5s, overlays.md: centered on the hold, min(hold - 2, 4) s)
- 0:01.7 → 0:05.7  F1 (hold 7.33 s)   ·   F2 (3.77 s) = transition + punch-in only, NO leak

## IMPACTS + RISERS (audio, mixed on with ffmpeg, NOT in comp; picked by MEASURED -40 dB tail)
- 0:00.0  Kick_Impact_01-short.wav (tail 0.36 s), hook cold hit under "Kaspa" (MUSIC-PLAN hard hit 0.0)
- 0:37.9  Impact_Hit_01-2-18.wav (tail 1.66 s), NO L2 IN THE MIDDLE slam, layered on Bed A's epic hit
- 0:40.2  DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (tail 1.16 s), CH2 card landing
- 2:17.6  DSGNImpt-single_impact_sound_-Elevenlabs.mp3 (tail 1.16 s), CH3 card landing (same file on purpose)
- 2:55.7  RISER Riser Sound Effect-2s.wav → IMPACT @2:57.7 Impact_Hit_01-1.wav (tail 4.74 s, faded
  178.54-179.3), "It shipped in June" + DELIVERED stamp, the vibe cut (with the Bed C duck)
- 3:04.8 · 3:06.3  Kick_Impact_01-tight.wav (tail 0.14 s), hammer lines 1 and 2
- 3:07.7  Soundjay_Impact_Main_01-short.wav (tail 0.34 s), hammer line 3 'NO L2 IN THE MIDDLE'
- 3:22.1  Impact_Hit_01-2-short.wav (tail 0.42 s), sub layer under Bed C's closing hit on "later."
- Every impact/riser sits UNDER the VO (video-qa short-term/peak check on the 10 s chunks, never integrated LUFS).
- Hard hits carried by MUSIC / DUCK only (no SFX): 0:28.2 FACE #2 dip · 1:21.7 C1 machine-beat duck ·
  2:33.0 Bed C plateau swell · 3:01.0 Bed C 9 → 8 step.

## MUSIC beds (bed · chapters · level · fades; full carve = MUSIC-PLAN.json; license codes → YT description ONLY)
- 0:00.0 → 0:40.2   Bed A `down-to-the-wire` (Rhythm Scott), file in 0.91, COLD, gain -31.1 (-22 under the
  -18.2 LUFS VO); -3 dB dip under FACE #2 0:28.2-0:31.9; its one epic hit (file 38.85) on 0:37.9; ring-out
  carries BR-2 into the card; 0.4 s safety fade in the pause.  `XYZW1UVUQWIPXVXF`
- 0:40.2 → 2:17.6   Bed B `accomplishments-subtle`, file 36.5-133.86 (one pass, no loop), fades in card+1.0
  → +1.5, gain -29.1 (-23 under); extra -2 dB 1:21.7-1:58.4 (C1 machine beat, 1.0 s ramps); 0.4 s fade in the
  CH3 pause.  no license code (free_local)
- 2:17.6 → 3:22.8   Bed C `fortitude` (ltebloomr), file in 52.08, right-aligned (file 117.1 hit = spine 202.10
  "later."), fades in card+1.0 → +1.5 at gain -34.5, ramps to nominal -32.5 (-22 under) by 2:33.0 (9-plateau);
  vibe-cut duck -4.2 dB 2:57.4-2:58.3; 9 → 8 step 3:01.0; 0.25 s fade on the ring-out to 202.822.
  `X0AVOCNCPEKOUPW8`
- Breaths at both changes (card+0.4 → +1.0 inside each 1.5 s pause). This longform posts to Rumble / BitChute /
  FB, so the codes go nowhere unless a YouTube cut is made.

## CAPTIONS  (ON over FACE windows ONLY, never over a cover)
- 0:00.0 → 0:07.3 F1 and 0:28.2 → 0:31.9 F2, `build_captions.py --style montserrat --max-words 2 --max-short 4`
  (captions-builder at comp time), AS-RECORDED mishear list applied (Casper → Kaspa x2 in F2, Vprogs → vProgs).
- The two ear-check lines (0:52.2 "transaction payments", 3:01.4 "the more (a) layer") sit under covers, so they
  never caption.

## Open decisions that move these cues
- TRANSITIONS.md picks (face film-burn vs blocks-max, card presentation, AI-still ingress, MELT @1:34.5 / SPIN
  @2:19.8 candidates): a push-in match vs a MELT at 1:34.5 changes the c1-kaspa-four-jobs entry frames.
- 0:00.0 kick under "Kaspa": keep only if the chunk QA shows it does not mask the first word; drop, and the hook
  hit is Bed A's swell alone.
- Vibe-cut duck depth: MUSIC-PLAN automation row says -4.2 dB (x0.617), its hard_hits prose says x0.82
  (about -1.7 dB). This plan follows the automation row; Mike or the mix pass confirms.
- Bed C alignment: hit on the ONSET of "later." (202.10, as planned) or its END (source_in 52.54, +0.46 s):
  moves the 3:22.1 impact with it.
- Sub-floor type cards (ten-bps-card 2.95 s, pow-money-hammer 3.9 s, sovereignty-card 4.96 s): the COVER-PLAN
  benches would re-time 0:21.2-0:31.9, 3:04.8-3:08.6 and 1:58.4-2:10.4.
- Bench b-roll slots (1:40.4 server racks, 1:52.1 receipt printer, 3:08.6 crowd) would split those containers.
- CTA close vs hard-out: AS-RECORDED leaves the ruling open; this plan builds to the recorded CTA.
- Live `[VERIFY]` at render: R1, R5-a/R5-b, R6 + the c3-ladder Silverscript rung, R7 + c3-next-rungs, R8 wording,
  KIP-2 status. A changed status blocks the capture, not the timing.
