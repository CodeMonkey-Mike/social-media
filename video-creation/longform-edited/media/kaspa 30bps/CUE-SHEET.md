# kaspa 30bps — WATCH-ALONG CUE SHEET  (reconciled to the spine)
> Watch file: `spine/ALL.e.desilenced.mp4` (M:SS.s, 7:35.2). Timecodes from the spine word-transcript +
> blackdetect FACE/COVER spans. Sibling of EDIT-PLAN.md (event log) + EDIT-PLAN-prep.md. Format:
> skills/edit-plan-and-cue-sheet.md §2.
> FACE/COVER edges EXACT (blackdetect); `≈` = inside a merged transcript chunk (~±1s), frame-locks at comp.
> Ids: C-* container · D-* diagram · chart ids (H1/C1-C4) · R-* receipt · LT-* lower-third · BR-* b-roll ·
> IMG-* image.
> CH1 is first, nothing before it. ⛔ Timeline shifters: CH2/CH3 card pauses (+1s each, baked into
> `spine/ALL.f.paused.mp4`, `sh()` routes). All three previously-pending rulings are CLOSED (Mike
> 2026-07-24): plug KEPT in full · "bags" beat KEPT · ending is an intentional HARD OUT, no CTA pickup.
>
> **AS BUILT (2026-07-25) — comp `video-creation/remotion/src/Kaspa40Bps.tsx`, 61 cover rows.**
> Container spotlights map to the slide-builder state PNGs: toccata-features s1/s2/s3 at 1:19.7 / 1:23.3
> / 1:24.9 · compare-solana-kaspa base at 6:22.4 then s1..s4 lighting the four Kaspa rows across
> 6:27.5-6:32.3 · card-honest-target base at 6:37.4 (overview on the "one thing to be clear" preamble),
> s1 at 6:38.7, s3 at 6:42.8 · d-dag base then highlight at 2:00.0. The C4 system-design still is one
> anchor at 2:29.0 plus five comp-level sub-spotlights (push + vignette toward the title, the hardcoded
> box, the guess tag, the readout, then the re-entry pulse) — Type 2 charts carry no baked motion, so
> every move there is comp-level. Two state PNGs are deliberately unused and marked REJECTED in the
> EDIT-PLAN's orphan reconciliation.

## FACE spans (baked spine shows the face — face appears ONLY here)   8 spans
- 0:00.0 → 0:04.7   CH1.B1 hook — "40 blocks every single second..."  (opens ON face)
- 0:32.4 → 0:38.5   CH1.B2 — "the tech that makes all that possible..."
- 1:47.9 → 1:52.4   CH2.B2 — "really cool name this time, DAGKnight"
- 3:05.0 → 3:11.3   CH3.B1 — "runs as fast as the assumption allows"
- 3:47.8 → 5:05.1   CH3.B2b COMMUNITY PLUG (⛔ trim pending)
- 5:21.5 → 5:26.3   CH3.B3 — "everything above 10 becomes possible"
- 6:32.3 → 6:34.9   CH4.B3 — "Sub-second finality on proof of work"
- 7:32.3 → 7:35.2   CH5.B3 — "This is why Kaspa is my number one"  (runs to EOF; CTA pickup appends)

## TRANSITIONS (chapters + face + b-roll — MANDATORY; full per-cut list = TRANSITIONS.md)
THREE buckets + the reserved §4 marquee family. Picks (strategist, 2026-07-24):
CHAPTER cards → **cube** (a 3D rotateY turn-in; self-contained pause scenes):
- 0:52.81  CH2 "THE UPGRADE LADDER" (+ Bed B change + 1s card pause)
- 2:17.07  CH3 "DAGKNIGHT" (+ Bed C change + 1s card pause) — **MOVED from 2:14.5**, see the EDIT-PLAN
  note: the planned chapter seam has no silence to freeze in, so the card now lands after the question
  it answers. Both pause points pass `lint-pause-silence`.
- BUILD NOTE (2026-07-25): `@remotion/transitions` ships no `cube` presentation (only slide/flip/wipe/
  iris/clock-wipe/zoom-*), so the card is the hand-rolled rotateY cube turn that comp-build.md §6's own
  skeleton prescribes. Tag it `hand:cube-3d` rather than `rmn:cube` when reading TRANSITIONS.md.
FACE cuts → **lib:blocks-max rotating 1/2/3, ALL 14 cuts in AND out** (never a plain cross-fade):
- in: 0:32.4 · 1:47.9 · 3:05.0 · 3:47.8 · 5:21.5 · 6:32.3 · 7:32.3   (0:00.0 = opens ON face, not a cut)
- out: 0:04.7 · 0:38.5 · 1:52.4 (owns the IMG-2 ingress, shared cut) · 3:11.3 · 5:05.1 · 5:26.3 · 6:34.9
Intra-FACE punch-ins (hand:punch ~15-20%; every face hold >2s — **F7 dropped**, no room in 2.6s):
- @0:02.4 F1 · @0:34.9 F2 · @1:50.2 F3 · @3:07.4 F4 · @3:49.8+ F5 (re-frames ~every 12s to ~5:03) ·
  @5:23.7 F6 · @7:33.9 F8 (lands on "number one")
VIDEO b-roll transitions (hand:fade 0.5s; one sanctioned exception):
- 0:42.5 BR-2 · 0:46.1 BR-3 · 1:37.9 BR-11 (fade in/out of the C1 punch-through) · 2:51.9 BR-4 ·
  **2:56.9 BR-5 = hand:cut SMASH (deliberate storm→sunny gag)** · 3:01.7 BR-6 · 6:13.3 BR-12 (was IMG-3's
  badsignal slot, now fade) · 6:53.5 BR-7 · 6:59.9 BR-8 · 7:22.9 BR-9 (⛔ hold) · 7:27.3 BR-10
  (0:38.5 BR-1 = face-owned cut)
AI IMAGE ingresses (lib badsignal; IMG-2 exception = face-owned):
- 0:50.1 IMG-1 badsignal-max-1 · 1:52.4 IMG-2 (blocks-max-2, shared cut) · 6:57.1 IMG-4 badsignal-short-1
CONTAINER / CHART quiet swaps = hand:xfade-scale 0.35s (0.93→1).
MARQUEE (§4 reserved, 2 MELT + 2 SPIN):
- 0:20.9 MELT lib:melt-rgb-1 (stat card → live H1 counter) · **3:14.8 MELT lib:melt-rgb-1 (C4 LEFT→RIGHT,
  THE marquee)** · 5:47.3 SPIN lib:spin-3d-side-ease-short-right (C2→C3 new axis) · 7:03.9 SPIN
  lib:spin-3d-side-ease-up (strawmen→C1 grand assembly, lands with the riser-to-impact)

## CHAPTER cards begin  (ON only at a bed change)
- 0:00.0  CH1 "THE TARGET" — NO card (first chapter) ; 0:52.81 CH2 "THE UPGRADE LADDER" ;
  2:17.07 CH3 "DAGKNIGHT" (moved, see above) ; 5:26.3 CH4 — NO card (Bed C continues) ;
  6:53.5 CH5 — NO card (close default)

## CONTAINER / DIAGRAM / CHART spotlights begin  (one row per sub-point, FILL THE FRAME)
> Asset types (Mike 2026-07-24; build worklists = BROLL-PLAN.md CHARTS + SLIDES sections): **CHART(anim)** =
> code-built WITH motion · **CHART(sysdesign)** = static code-rendered still, comp-level movement only ·
> **SLIDE(title)** = no-box eyebrow+serif-headline+body · **SLIDE(card)** = same anatomy in the rounded card box.
- 0:04.7  SLIDE(title) card-40bps-open — '40 BLOCKS / SECOND' + TARGET sub-line @0:09.5 (motion type at comp)
- 0:15.7  SLIDE(title) card-fastest-pow — 10 bps / 100 ms stat card
- 0:20.9  CHART(anim) H1 hook counter — ticking 10 → SLAM 'UP TO 40' @0:29.8 + 'TARGET: 2026'
- 0:52.8  CHART(anim) C1 ladder BUILD — rung 1 @0:57.7 · rung 2 @1:10.8
- 1:19.7  SLIDE(card) toccata-features — row spotlights @1:19.7 / @1:23.3 / @1:24.9 (SilverScript omitted, not spoken)
- 1:28.4  SLIDE(title) card-negation — 'BLOCK RATE: STILL 10 / SECOND'
- 1:34.7  CHART(anim) C1 rung 3 — 'UP TO 40 BPS, TARGET' · '4x' accent @1:42.5
- 1:56.3  CHART(sysdesign) D-DAG diagram-dag-vs-chain — DAG side highlight @2:00.0 (comp spotlight)
- 2:01.8  CHART(anim) C1 rung 4 tease — '100, 2027' LOCKED
- 2:14.5  SLIDE(title) card-dagknight-intro — 'NEW CONSENSUS PROTOCOL'
- 2:29.0  CHART(sysdesign) C4 LEFT still (GHOSTDAG) — comp sub-spotlights @2:32.8 / @2:39.4 / @2:41.9 / @2:50.3
- 3:11.3  CHART(sysdesign) C4 re-enter LEFT → MELT @3:14.8 → RIGHT still (opens post-shatter)  (UNINTERRUPTED marquee)
- 3:32.6  SLIDE(card) card-security-50 — 'up to half' `[VERIFY exact Byzantine phrasing]` (4.76s floor exception; alt = C4 badge)
- 3:37.4  CHART(anim) FIN chart-finality-drop — collapse @3:43.3, POTENTIAL tag
- 5:05.1  CHART(anim) C1 CALLBACK — rung 3 lights @5:15.9 · rung 4 unlocks @5:19.2
- 5:26.3  CHART(anim) C2 cadence race — bars @5:28.5 / @5:31.6 / @5:34.2 / @5:37.6 · blink annotation @5:45.8 `[VERIFY BTC/ETH/SOL figures]`
- 5:47.3  CHART(anim) C3 TPS capacity — marker @5:57.8 · 20k spotlight @6:03.5 · CAPACITY label @6:09.2
- 6:22.4  SLIDE(card) compare-solana-kaspa — Kaspa rows @6:27.5
- 6:34.9  SLIDE(title) stamp-subsecond — echo stamp (2.46s deliberate exception; motion type at comp)
- 6:37.4  SLIDE(card) card-honest-target — rows light on the lines
- 7:03.9  CHART(anim) C1 GRAND ASSEMBLY — stamps @7:05.4 / @7:07.8 / @7:09.5 / @7:11.2 / @7:14.6

## RECEIPTS / inserts begin   6  (typed per broll-and-containers.md: R(article) = reading/motion treatment · R(other))
- 0:11.7  R2 R(other) explorer LIVE block-feed recording `[VERIFY view]`
- 1:15.3  R1 R(other) rusty-kaspa v2.0.0 release page (=C5, re-capture live)
- 2:22.8  R3 R(article) DAGKNIGHT paper title page `[VERIFY URL]` — slow push-in (or MOTION 3D Pan, single-image)
- 6:16.5  R6 R(article) Alpenglow announcement `[VERIFY — doubles as the public-source check]` — push-in on the finality claim
- 6:45.0  R4 R(other) repo-activity slow-scroll recording `[VERIFY no testnet-ready claims visible]`
- 7:16.3  R5 R(other) CMC supply panel `[VERIFY ~95% live]`
- 4:51.4  R7 R(other) cryptorich.vip/products, OVERLAY on F5 → 5:05.1 end of plug, kept alive with
  single-image MOTION moves (slow zoom + 3D pan mix; Mike 2026-07-24)
- 3:47.8  LT-LINK 'LINK IN THE DESCRIPTION' lower-third (under the F5 plug)

## VIDEO b-roll begins  (Envato)   12 (11 if the "bags" beat is cut; cap raised 10→12 by Mike 2026-07-24)
- 0:38.5 BR-1 warp tunnel · 0:42.5 BR-2 gauge dial · 0:46.1 BR-3 energy core ·
  1:37.9 BR-11 railroad junction (punch-through of C1 hold, + LINE-CAPTION "TWO HARD FORKS IN A SINGLE YEAR") ·
  2:51.9 BR-4 storm dashcam (LEAD) · 2:56.9 BR-5 sunny dashcam (LEAD) · 3:01.7 BR-6 traffic crawl ·
  6:13.3 BR-12 purple crowd celebration (replaces IMG-3) · 6:53.5 BR-7 rusty gears · 6:59.9 BR-8 boardroom ·
  7:22.9 BR-9 cloud ascent (⛔ HOLD) · 7:27.3 BR-10 Earth network arcs (LEAD)

## IMAGE b-roll begins  (ChatGPT stills)   6 placed (3 are F5-plug overlays, Mike 2026-07-24) · IMG-2 ⛔ gated
- 0:50.1 IMG-1 Kaspa coin burst · 1:52.4 IMG-2 armored knight (⛔ confirm allusion) ·
  4:28.8 IMG-5 velvet coin (over F5) · 4:31.6 IMG-6 lab coin (over F5) · 4:35.8 IMG-7 wins cascade (over F5) ·
  6:57.1 IMG-4 Bitcoin museum relic   (IMG-3 released, beat now BR-12)

## LIGHT LEAKS (face holds > 5s — overlays.md, inset ~0.6s off the cut)
- 0:32.4 → 0:38.5  F2 · 3:05.0 → 3:11.3  F4 · 3:47.8 → 5:05.1  F5 PLUG
  (short <5s face beats = glitch/punch only, NO leak)

## IMPACTS + RISERS (audio — mixed on with ffmpeg, NOT in comp)
- 0:29.8  H1 slam impact · 0:52.8 CH2 card impact · 2:14.5 CH3 card impact ·
  3:11.4 RISER → IMPACT @3:14.8 — the C4 SHATTER · 6:34.9 stamp impact ·
  7:00.5 RISER → IMPACT @7:03.9 — C1 grand-assembly landing · every impact/riser UNDER the VO (video-qa)

## MUSIC beds (full carve = MUSIC-PLAN.json; license codes → YT description ONLY)
- 0:00.0 → 0:52.8   Bed A `hold-the-line` — COLD OPEN, no fade-in, -16 dB seat  ✅ LOCKED · `2RSEUREJAJSKKSNX`
- 0:52.8 → 2:14.5   Bed B `accomplishments-subtle` — RECOMMENDED (runner-up `focuser`, measured
  not-actually-subtle caveat); -18 dB; ⚠ NO license code exists (free local track, paste nothing)
- 2:14.5 → 6:53.5   Bed C `going-dark` — RECOMMENDED (one pass, zero loops; runner-up `the-invaders`);
  gain-automated: -20 dB QUIETEST FLOOR under C4 teach (2:29.0–3:32.6) + under the F5 plug; F6 swell
  -15 @5:21.5; rises through CH4; fades out BEFORE its own end-hit (Bed D owns the close) · `CVTNZ6EL3KWH2UXK`
- 6:53.5 → 7:35.2+  Bed D `a-champion-from-the-ashes` — END-ALIGNED by FORMULA (hit@track-148s lands on
  the final sign-off words; survives the CTA/bags edits)  ✅ LOCKED · `PKQHFEVP2E3FN7GW`
- Breaths at every change (0:52.8 · 2:14.5 · 6:53.5, none into CH4). Levels: measure LUFS first, targets
  -16/-18/-20 per MUSIC-PLAN (ear-check: Mike's earlier-kaspa call was ~22 under, shift all -4 if wanted);
  NO bed move on the C4 shatter @3:14.8 (SFX owns it); duck windows via bed-duck-expr.py at comp.

## CAPTIONS  (ON over FACE windows ONLY — never over a cover)
- The 8 FACE spans above; style strictly per skills/captions (captions-builder at comp time).
- SEPARATE device (not this track): LINE-CAPTION overlay on BR-11 @1:37.9 ("TWO HARD FORKS IN A SINGLE
  YEAR") per broll-and-containers.md device 3 — part of the cover asset, video-b-roll only, 1 of 1-2 allowed.

## Open decisions that move these cues
- F5 plug trim (3:47.8–5:05.1): everything after 5:05.1 shifts by the trimmed amount (route via cut map).
- "Bags" beat cut (7:22.9–7:27.3): BR-9 drops, everything after shifts −4.38s.
- CTA pickup: appends after 7:35.2 (end card + subscribe LT; Bed D hit re-aligns to the new sign-off).
- Bed B + C picks (MUSIC-PLAN.json recommendation → Mike) · card-security-50 vs C4-badge · stamp-subsecond
  keep/fold · IMG-2 allusion.
