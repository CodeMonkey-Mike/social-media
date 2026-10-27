# kcc20 - EDIT-PLAN (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by the edit-plan-author 2026-10-21 off the graph seed (`_previews/EDIT-PLAN.seed.md`, refined, never re-derived)
> + `spine/ALL.e.desilenced.medium-words.json` + AS-RECORDED.md + COVER-PLAN.json + MUSIC-PLAN.json + PROJECT-LOG.md (Open
> flags + BUILD DIRECTIVES) + `spine/jumpcuts-final.json` + the built assets in `assets/` (format:
> `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` section 1; the comp is built TO this log).
> Watch file: `spine/ALL.e.desilenced.mp4` (328.99 s / 5:29.0, 30 fps). Every timecode = a FINAL-spine second, PRE-card-pause:
> the three title-card pauses (CH2 30.50, CH4 174.64, CH5 207.44), the CLIP-1 insert (20.5 s at 162.20), the FINAL-stamp pause
> (3.0 s at 202.44) and the BRAAM pause (4.7 s at 240.99) shift the final timeline via `sh()` at comp. Never re-apply a shift here.
> `TRANSITIONS.md` = the pick is the transition-strategist's (TRANSITIONS.md, authored next); `reconcile_docs.py` fans it in.
> SFX rows name the kit file in backticks + its `mood_class`; every impact / riser / braam was picked by MEASURED envelope
> (ffmpeg decode, 10 ms RMS, the point 40 dB under the peak), `file start` = where the FILE starts so its measured peak lands on
> the named frame. Music + SFX are the ffmpeg post-mix (`mix_music.py`), never in the comp (comp-build section 9).
> ZERO ORPHANS: every renderable in `assets/` (by id) is PLACED below with a timecode or marked BENCH / REJECTED in the
> reconciliation section at the end. Assets whose lines Mike cut on 2026-10-21 already sit in `_bench/` (PROJECT-LOG).
> Captions: ON over the 3 FACE windows ONLY (0.000-6.833, 19.633-28.167, 252.900-328.992), never over a cover; MYX (never NYX),
> "the Lab token", no "12th" after "the week of October"; the AS-RECORDED mishear list is applied on every SAY line below.
> FACE background swap (F1 + F2, comp-build 3b): NOT built yet (no `assets/face-swap/`); the draft airs both CH1 face windows AS
> RECORDED and the swap clips drop in once Mike approves the F1 look (PROJECT-LOG directive 7).

## CH1 - LAST CALL (0:00.0-0:30.5, Bed A `born-every-minute`, card OFF)
```
0:00.0  [MUSIC] Bed A `born-every-minute` (Neon Beach) COLD OPEN at file 27.68 (bar 20), no fade-in, the drum-and-bass verse
        already pumping under word one; seat -17 under VO (gain -24.4 dB) → 0:30.5. Hard hit 0.00: the music IS the hit,
        no SFX on word one (MUSIC-PLAN hard_hits[0])
0:00.0  [FACE] F1 opens ON face → 0:06.8 (blackdetect 0.000-6.833), hook line; airs AS RECORDED (bg swap pending)
0:00.0  [CAPTION] ON → 0:06.8 (F1, montserrat house style; "Casper's" → "Kaspa's", "KCC20" → "KCC-20")
0:00.0  SAY:  "Kaspa's core contributors just moved their first token standard KCC-20 into its final"
0:03.8  [PUNCH-IN] F1 step IN ~15-20% ON the desilence-final join 3.800 (frame 114; jumpcuts-final.json) → holds to 0:06.8 ·
        [LIGHTLEAK] lib:lightleaks-* peaking ON the same frame → lib:lightleaks-1 (punch-leak, 1.12s) (punch-leak)
        (the 4.967 join sits 1.17 s later, under the 1.5 s min gap: no second punch)
0:05.9  SAY:  "review window."
0:06.8  [TRANSITION] F1 face→cover out → hand:film-burn (face-cut, 0.76s) (face pick; COVER-PLAN reads film burn)
0:06.8  [VIDEO] BR-1-teal-particles IN (dissolve) → 0:09.4 (2.53 s): dark Kaspa-teal light rays + particles, carrying the H0
        motion-type card 'KCC-20 / LAST CALL / OCT 7, 2026' (comp-built text; the date chip makes it the Oct 7 headline,
        never today's status, AS-RECORDED fact-framing flag)
0:06.8  [IMPACT] `Impact_Hit_01-2-short.wav` (impact-hit-01-2-short, mood_class epic; measured peak 0.13 s, -40 dB at 0.55 s =
        0.42 s tail) file start 6.70 so the sub hit lands ON the H0 card frame 6.83, gone before 'October' (MUSIC-PLAN hard hit
        6.83, the CH1 impact of the SFX intent)
0:06.9  SAY:  "On October 7th, 2026, pull request 31 merges into Kaspa's own conventions repo and the"
0:08.6  [RISER] `Tension_Rise_Logo_Reveal_3-1s.wav` (tension-logo-reveal-3-1s, mood_class tense; measured RMS peak 0.73 s)
        file start 8.63, play 0-0.78, so it ENDS on its peak ON the C9 cut 9.36; no hit after it (the H0 impact 2.5 s
        earlier is the CH1 hit), rides Bed A's verse
0:09.4  [RECEIPT] C9-pr31-merged IN → 0:13.8 (4.48 s): kaspanet/kccs PR #31 title + purple Merged badge + the Oct 7 merge → hand:xfade-scale (container-xfade, 0.35s)
        line, full width, top-aligned, landing on 'pull request 31'. treatment: pan
        [MOTION] lib:motion-3d-pan-1-right (fitted to the 4.48 s slot; a merged PR page shown as an OBJECT: it exists, it merged)
0:13.8  [RECEIPT] RX4-pr31-status-diff IN → 0:17.0 (3.14 s): the PR #31 'Files changed' kcc-0020.md header hunk, the red → hand:xfade-scale (container-xfade, 0.35s)
        removed and green added Status lines, dated Oct 7 (history by construction). treatment: highlight
        (settling push, then the wipe) [HIGHLIGHT] on the added 'Status: Last Call' line, onset 'Last' 15.48
0:13.8  SAY:  "status on the spec flips to Last Call, the final review window before standard goes final."
0:17.0  [VIDEO] BR-2-server-corridor IN (dissolve) → 0:19.6 (2.65 s, LEADING forward dolly), ends exactly on the F2 edge → hand:fade (broll-fade, 0.50s)
0:19.6  [MUSIC] Bed A's one breakdown (file 46-48, env 4) straddles the cut into the thesis face 18.3-20.3, then the chorus
        climbs 6-7-8 under the thesis line, by arrangement; no SFX here (MUSIC-PLAN hard hit 19.63)
0:19.6  [TRANSITION] F2 cover→face cut-in → hand:film-burn (face-cut, 0.76s) (face pick, same device as every face cut)
0:19.6  [FACE] F2 IN → 0:28.2 (blackdetect 19.633-28.167), thesis line; airs AS RECORDED (bg swap pending)
0:19.6  [CAPTION] ON → 0:28.2 (F2)
0:19.7  SAY:  "Real tokens on Kaspa's base layer with every transaction enforced by the chain's own script"
0:22.6  [PUNCH-IN] F2 step IN ON the desilence-final join 22.567 (frame 677) · [LIGHTLEAK] lib:lightleaks-* on the same frame
        → lib:lightleaks-4 (punch-leak, 1.12s) (punch-leak)
0:25.9  SAY:  "rules not by an off-chain indexer."
0:26.3  [PUNCH-IN] F2 step back OUT to the base frame ON the desilence-final join 26.267 (frame 788) · [LIGHTLEAK]
        lib:lightleaks-* on the same frame → lib:lightleaks-short-1 (punch-leak, 0.40s) (punch-leak) (joins 28.067 / 28.1 sit inside the 0.5 s edge margin)
0:28.2  [TRANSITION] F2 face→cover out → hand:film-burn (face-cut, 0.76s)
0:28.2  [IMAGE] IMG-1-circuit-k-macro IN → 0:30.5 (2.33 s): PLAYS ITS MOTION CLIP `img-motion/IMG-1-circuit-k-macro-motion.mp4`
        from 0, cut at the slot end, no Ken Burns on top (comp-build 3c); AI-still ingress → hand:film-burn (face-cut, 0.76s) (ai_still)
0:28.2  SAY:  "So let's get into how this is all playing out."
```

## CH2 - HOW KCC-20 WORKS (0:30.5-1:56.2, Bed B `it-comes-to-this`, CARD ON)
```
0:30.5  [CARD] CH2 title-card-ch2 "HOW KCC-20 WORKS" · [IMPACT] `card-impact-layered.wav` (card-impact-layered, mood_class epic;
        measured peak 0.03 s, -40 dB at 1.17 s = 1.14 s tail, inside the 1.0 s pause + turn) · [TRANSITION] card move
        → rmn:slide (card, 0.40s) (ONE card pick for all three cards); edit-time pause 1.0 s in the breath 'out.' 29.92 | 'Start' 30.50,
        card readable >= 1 s (comp-build section 6). Known false alarm: check_card_words hears 'Let's start' here.
0:30.5  [MUSIC] Bed A fades 0.4 s from the card's first frame, 0.6 s breath, Bed B `it-comes-to-this` verse cut fades in 0.5 s → hand:fade (broll-fade, 0.50s)
        from file 0.0 (seat -18, gain -21.5 dB, REMIX loop 15.429-56.571), full on 'Start' (MUSIC-PLAN hard hit 30.50) → 1:56.2
        and on through CH3 (one merged placement)
0:30.5  [VIDEO] BR-4-network-nodes IN (dissolve off the card) → 0:32.6 (2.10 s)
0:30.5  SAY:  "Start with where this comes from."
0:32.6  [RECEIPT] C12-toccata-release-v2.0.0 IN → 0:37.6 (5.02 s): rusty-kaspa 'Mainnet Toccata Release - v2.0.0', header + → hand:xfade-scale (container-xfade, 0.35s)
        activation sentence + KIP list. treatment: highlight
        (settling push) [HIGHLIGHT] on 'June 30, 2026' onset 32.60, then a settled push toward the KIP list on 'covenants' 36.74
0:32.6  SAY:  "On June 30th, 2026, the Toccata hard fork gave Kaspa covenants."
0:37.6  [DIAGRAM] diagram-covenant-stack-coin IN (cross-fade + scale-in) → 0:44.5: the UTXO coin with the RULE badge, on
        'a rule built into a coin' → hand:xfade-scale (container-xfade, 0.35s)
0:37.6  SAY:  "A covenant is a rule built into a coin that controls how it is spent and where it can"
0:40.5  [DIAGRAM] diagram-covenant-stack-spent lights the 'how it is spent' arrow, onset 'controls' 40.50
0:42.7  [DIAGRAM] diagram-covenant-stack-next lights the 'where it can go next' arrow, onset 'where' 42.70
0:43.2  SAY:  "go next."
0:44.5  [CONTAINER] card-rulebook IN (cross-fade + scale-in) → 0:50.7 (6.28 s): 'The shared RULEBOOK for a fungible token',
        stack glyph Toccata → covenants → KCC-20; one spotlight card, slow push (Type 2 still never dead still, 7a) → hand:xfade-scale (container-xfade, 0.35s)
0:44.5  SAY:  "KCC-20 is the shared rulebook for a fungible token built from those covenants."
0:49.9  SAY:  "Fungible meaning every unit is the same as every other."
0:50.7  [IMAGE] IMG-2-identical-coin-grid IN (cross-warp) → 0:54.2 (3.50 s), literal 'every unit is the same' → hand:cross-warp (image-warp, 0.50s)
0:53.2  SAY:  "Four ideas."
0:54.2  [DIAGRAM] c1-state-01-base IN, reframed into the LEFT 55 percent → 1:05.0 (10.78 s, held unbroken on purpose) · → hand:xfade-scale (container-xfade, 0.35s)
        [KT-PANEL] kt-side-panel RIGHT 'IDEA ONE / A COMMON INTERFACE' slides in ON 'Idea' 54.24 (0.50 s ease-out, text rises
        0.23 s later, then hovers; house dark panel, key words Kaspa greenish cyan over white, house display font) ·
        [WHOOSH] `swoosh-1.mp3` (kinetic-text swoosh-1, mood_class neutral) file start 54.07, 0.17 s before the panel moves
0:54.2  SAY:  "Idea 1."
0:55.2  SAY:  "A common interface."
0:56.3  SAY:  "Every KCC-20 token carries the same state block, the amount, the owner, a few settings, and"
1:00.3  [DIAGRAM] c1-state-01-amount spotlight, onset 'amount' 60.28
1:01.2  [DIAGRAM] c1-state-01-owner spotlight, onset 'owner' 61.16
1:02.2  [DIAGRAM] c1-state-01-settings spotlight, onset 'settings' 62.22
1:03.3  SAY:  "the same transfer entrypoint."
1:03.7  [DIAGRAM] c1-state-01-entrypoint spotlight, onset 'transfer' 63.68
1:05.0  [VIDEO] BR-5-phone-hand-cyan IN (dissolve) → 1:08.9 (3.90 s), literal 'any wallet' (the panel leaves with the cut) → hand:fade (broll-fade, 0.50s)
1:05.0  SAY:  "So any wallet, indexer, or app reads it the same way."
1:08.9  [DIAGRAM] c1-state-02-base IN, reframed into the RIGHT 55 percent → 1:15.5 (6.56 s) → hand:xfade-scale (container-xfade, 0.35s)
1:09.0  [KT-PANEL] kt-side-panel LEFT 'IDEA TWO / EXTENDED STATE' ON 'Idea' 69.04 · [WHOOSH] `swoosh-2.wav` (kinetic-text
        swoosh-2, mood_class neutral) file start 68.89, 0.15 s before the panel moves
1:09.0  SAY:  "Idea 2."
1:10.1  SAY:  "Extended state."
1:11.3  SAY:  "A token can carry its own data and behavior behind one digest, and transfers pass that"
1:14.7  [DIAGRAM] c1-state-02-digest spotlight (the opaque extension_commitment box), onset 'digest' 74.66
1:15.5  [VIDEO] BR-6-envelope-handoff IN (dissolve) → 1:18.5 (3.02 s), literal 'pass that digest through untouched' → hand:fade (broll-fade, 0.50s)
1:16.7  SAY:  "digest through untouched."
1:18.5  [DIAGRAM] c1-state-03-base IN, reframed into the LEFT 55 percent → 1:31.9 (13.40 s, held unbroken on purpose) · → hand:xfade-scale (container-xfade, 0.35s)
        [KT-PANEL] kt-side-panel RIGHT 'IDEA THREE / FLEXIBLE AUTHORITY / FROM KCC-2' (KCC-2 in the key colour) ON 'Idea' 78.50 ·
        [WHOOSH] `swoosh-1.mp3` (kinetic-text swoosh-1, mood_class neutral) file start 78.35
1:18.5  SAY:  "Idea 3."
1:19.6  SAY:  "Flexible authority."
1:20.9  SAY:  "And this comes from KCC-2."
1:23.0  SAY:  "The owner of a token can be a public key, a key commitment, a script, or another covenant."
1:24.9  [DIAGRAM] c1-state-03-s00 spotlight '0x00 public key', onset 'public' 84.92
1:26.1  [DIAGRAM] c1-state-03-s01 spotlight '0x01 / 0x02 key commitment', onset 'key' 86.06
1:27.3  [DIAGRAM] c1-state-03-s03 spotlight '0x03 script (P2SH)', onset 'script' 87.30
1:28.2  [DIAGRAM] c1-state-03-s04 spotlight '0x04 covenant ID', onset 'another' 88.16
1:29.1  SAY:  "So covenants can own tokens and govern them."
1:29.3  [KT-POP] kt-keyword-pop 'COVENANTS CAN OWN TOKENS' ON 'covenants' 89.28, lower picture (~79 percent height), holds to the
        1:31.9 cut (2.6 s) · [ACCENT] `twinkle.wav` (kinetic-text twinkle, mood_class neutral, POSITIVE by meaning; measured
        peak 0.66 s) file start 88.62 so the sparkle peaks ON the pop's first frame
1:31.9  [DIAGRAM] c2-borrowed-receive-left-base IN, reframed into the RIGHT 55 percent → 1:44.9 (13.02 s): the 'new UTXO' path · → hand:xfade-scale (container-xfade, 0.35s)
        [KT-PANEL] kt-side-panel LEFT 'IDEA FOUR / BORROWED RECEIVE' ON 'Idea' 91.90 · [WHOOSH] `swoosh-2.wav` (kinetic-text
        swoosh-2, mood_class neutral) file start 91.75
1:31.9  SAY:  "Idea 4."
1:33.3  SAY:  "Borrowed Receive."
1:34.3  SAY:  "Here's the thing."
1:35.1  SAY:  "Every UTXO, every unspent coin, has to be funded with KAS."
1:38.9  [DIAGRAM] c2-borrowed-receive-left-kas spotlight (the KAS funding), onset 'funded' 98.92
1:39.9  SAY:  "And a rule called storage mass makes tiny outputs expensive on purpose."
1:40.9  [DIAGRAM] c2-borrowed-receive-left-mass spotlight (the STORAGE MASS meter climbing red), onset 'storage' 100.88 ·
        [KT-POP] kt-keyword-pop 'STORAGE MASS' ON 'storage' 100.88, holds ~2 s · [ACCENT] `knock-pop.wav` (kinetic-text
        knock-pop, mood_class neutral; peak at 0.00 s) file start 100.88, ON the first frame
1:44.9  [DIAGRAM] c2-borrowed-receive-right-base IN (the declared A-vs-B second state of the same C2 diagram) → 1:56.2 (11.30 s): → hand:xfade-scale (container-xfade, 0.35s)
        the 'borrowed receive' path
1:44.9  SAY:  "So instead of a UTXO for every incoming token, the sender tops up one you already hold."
1:50.7  [DIAGRAM] c2-borrowed-receive-right-owner spotlight, onset 'Same' 110.66
1:50.7  SAY:  "Same owner."
1:51.3  SAY:  "The KAS inside cannot go down."
1:52.7  [DIAGRAM] c2-borrowed-receive-right-floor spotlight ('KAS value cannot decrease'), onset 'cannot' 112.70
1:53.9  SAY:  "Only the token amount grows."
1:55.0  [DIAGRAM] c2-borrowed-receive-right-amount spotlight, onset 'grows' 115.04 · [KT-POP] kt-keyword-pop 'ONLY THE TOKEN
        AMOUNT GROWS' ON 'grows' 115.04, holds to the 1:56.2 cut (1.18 s) · [ACCENT] `cash-register.wav` (kinetic-text
        cash-register, MONEY by meaning, the video's ONE money moment; mood_class neutral) file start 114.87, 0.17 s early so the
        bell lands on the text
```

## CH3 - KCC-20 VS KRC-20 (1:56.2-2:54.6, Bed B continues, card OFF)
```
1:56.2  [MUSIC] Bed B continues sample-continuously (the CH2 placement, no card, no breath; file 45.08 at 116.22) → 2:54.6
1:56.2  [IMAGE] IMG-3-krc20-token-crowd IN (cross-warp; the KRC-20 amber lane colour opens the chapter) → 2:00.1 (3.92 s) → hand:cross-warp (image-warp, 0.50s)
1:56.2  SAY:  "Now Kaspa already has tokens, KRC-20, from Kasplex, a third-party control, live since"
2:00.1  [RECEIPT] RX1-kasplex-org IN → 2:05.5 (5.32 s): the Kasplex GitHub org header 'The First Protocol For Kaspa Ecosystem' + → hand:xfade-scale (container-xfade, 0.35s)
        the pinned go-krc20d repo. treatment: pan
        [MOTION] lib:motion-3d-offset-2-left-up (an org page shown as an OBJECT: a separate third-party organization exists;
        a different move from C9's pan)
2:03.7  SAY:  "September 2024."
2:05.5  [CHART] c4-token-count-start IN (Type 1 animated, real useCurrentFrame) → 2:09.7 (4.28 s): the amber KRC-20 bar starts → hand:xfade-scale (container-xfade, 0.35s)
        growing on 'Around' 125.46, the KCC-20 bar empty, '2026' dim
2:05.5  SAY:  "Around 2,160 tokens by Kasplex's own indexer count."
2:06.3  [CHART] c4-token-count-s1-mid, the count passing four digits as he says '2,160' 125.82
2:07.0  [CHART] c4-token-count-s1-payoff, the bar lands on the DATED Kasplex API tokenTotal (2,164, re-pulled at render; never
        the spoken rounding, never 2,153), '2024' under it, source line, onset 'tokens' 127.02  `[VERIFY]`
2:09.7  [VIDEO] BR-7-stadium-roar IN (dissolve) → 2:11.2 (1.48 s flash), literal 'demand' → hand:fade (broll-fade, 0.50s)
2:09.7  SAY:  "It proved the demand."
2:11.2  [DIAGRAM] c3-marquee-base IN → 2:23.6: THE MARQUEE, one two-lane system-design diagram fills the frame on 'The difference
        is where the token lives' · [TRANSITION] MARQUEE SPIN candidate (BR-7 → C3, a new facet) → lib:spin-center-swinging-cw (SPIN-newfacet, 0.84s) section 4 ·
        [ACCENT] `accent-scifi-mystery-02-c.wav` (accent-scifi-mystery-02 take c, mood_class tense; measured peak 0.48 s,
        -40 dB at 4.63 s) file start 130.74 so the ping peaks ON the reveal frame 131.22 (SFX intent, one take per lane)
2:11.2  [MUSIC] Bed B stays flat on its plateau (unrolled 101.2, file 18.9); the accent is the punctuation, the bed does not
        move (MUSIC-PLAN hard hit 131.22)
2:11.2  SAY:  "The difference is where the token lives."
2:13.5  [DIAGRAM] c3-marquee-krc-1 'Kasplex (third party)' lights, onset 'With' 133.48
2:13.5  SAY:  "With KRC-20, token operations are written onto Kaspa as data, and the Kasplex indexer works"
2:16.5  [DIAGRAM] c3-marquee-krc-2 'token ops inserted as data on L1', onset 'written' 136.48
2:18.8  [DIAGRAM] c3-marquee-krc-3 'the Kasplex indexer reads and interprets', onset 'the' 138.80 (before 'Kasplex indexer')
2:20.3  SAY:  "out who owns that."
2:21.5  [DIAGRAM] c3-marquee-krc-4 'balance = the indexer's answer', onset 'Your' 141.50
2:21.5  SAY:  "Your balance is the indexer's answer."
2:23.6  [DIAGRAM] c3-marquee-kcc-1 'kaspanet/kccs (core contributors)', the Kaspa-teal lane begins, onset 'With' 143.64 →
        2:34.6 (second lane of the SAME diagram, not a re-show) · [ACCENT] `accent-scifi-mystery-02-b.wav`
        (accent-scifi-mystery-02 take b, mood_class tense; measured peak 0.71 s) file start 142.93, peak ON 143.64
2:23.6  SAY:  "With KCC-20, the token state sits inside a covenant UTXO on the base layer, and the chain"
2:27.1  [DIAGRAM] c3-marquee-kcc-2 'token state in covenant UTXOs on L1', onset 'covenant' 147.14
2:30.1  [DIAGRAM] c3-marquee-kcc-3 'L1 script (KIP-17 covenants, KIP-20 IDs) enforces the transfer', onset 'chain' 150.06
2:30.3  SAY:  "script enforces every transfer."
2:32.3  SAY:  "Your balance is what the chain enforces."
2:33.1  [DIAGRAM] c3-marquee-kcc-4 'balance = what the chain enforces', onset 'what' 153.08
2:33.7  [DIAGRAM] c3-marquee-both, both lanes side by side, onset 'enforces.' 153.66 → 2:34.6
2:34.6  [RECEIPT] RX2-xxim-masterclass-watch IN → 2:38.5 (3.86 s): the XXIM watch page, title + channel + 'Jun 22, 2026', player → hand:xfade-scale (container-xfade, 0.35s)
        paused on the guest, logged out. treatment: push (settling push onto the title + date)
2:34.6  SAY:  "Sivan Helfer, the first listed author of KCC-20, put it plainly back in June, a week"
2:38.5  [RECEIPT] CLIP-1 LEAD-IN → 2:42.2 (3.72 s): the clip's FIRST frame (Sivan Helfer on the masterclass, burned caption → hand:xfade-scale (container-xfade, 0.35s)
        'Sivan Helfer, KCC-20 author, June 2026, a week before Toccata') held as a STILL under the set-up line, never a muted
        play of the clip (comp-build 3d). treatment: push (a slow settle onto his face, it stops before the insert-in)
2:40.9  SAY:  "before Toccata went live."
2:42.2  [INSERT] CLIP-1 SPLICED CLIP, 20.5 s: the spine PAUSES at the trough after 'live.' (word ends 162.20, 'That' starts
        162.34; AS-RECORDED measured 162.22-162.32 below -88 dB, bake_clip_insert.py snaps into it; never the dead ALL.d 164.44)
        and assets/clip-inserts/CLIP-1-helfer-real-assets.mp4 plays FULL-FRAME, MUTED in the comp, with Sivan Helfer's OWN voice
        baked into the VO track ('...create real assets on Kaspa'); burned caption on every frame; captions OFF (not a FACE
        window) · [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert, default hand:fade 0.5 s)
2:42.2  [DUCK] Bed B ducks -14 dB under the clip, AUTOMATIC in mix_music.py from the paused sidecar (0.3 s ramp); its third loop
        seam falls 6.66 s into the duck, inaudible; no hit, riser or bed change inside the insert (MUSIC-PLAN hard hit 162.20)
2:42.2  [RECEIPT] CLIP-1 LEAD-OUT → 2:44.4 (2.24 s): the clip's LAST frame held as a STILL under the resume line, out of the
        insert-out fade. treatment: push (held still, a slight drift so it never sits dead)
2:42.3  SAY:  "That is the whole difference."
2:44.4  [CHART] c4-token-count-s2-payoff IN → 2:49.5 (5.10 s): C4 returns, the KRC-20 bar full, the teal KCC-20 bar GROWS and
        COUNTS UP (real useCurrentFrame) from 'Roughly' 167.58 to the dated KasStacker count (146, re-read at render), '2024' vs
        '2026', 'third-party count' on the source line `[VERIFY]` · [TRANSITION] MARQUEE MELT candidate (the C4 callback
        reforming with the second bar) → lib:melt-equidistant-short-2 (MELT-transform, 0.44s) section 4
2:44.4  SAY:  "On the KCC-20 side, it is very early."
2:47.6  SAY:  "Roughly 150 tokens by one community tracker's count."
2:48.3  [CHART] c4-token-count-s2-payoff count still rising as he says '150' 168.30, lands by 'tokens' 169.00 (never a hard 146 in
        the captions or VO)
2:49.5  [RECEIPT] C18-kasstacker-covenants IN → 2:51.5 (1.98 s flash): KasStacker nav + hero stats, the 'KCC-20 146 tokens → hand:xfade-scale (container-xfade, 0.35s)
        (3,621 live states)' line + the kcc20.info / kascov.io source note. treatment: push (onto the KCC-20 breakdown line)
        `[VERIFY]` on render day
2:51.5  [IMAGE] IMG-4-coin-fused-bedrock IN (cross-warp) → 2:54.6 (3.12 s), literal 'enforced by the base layer itself';
        cross-warp out into the CH4 card → hand:cross-warp (image-warp, 0.50s)
2:51.5  SAY:  "Think ERC-20, enforced by the base layer itself."
```

## CH4 - WHERE IT STANDS (2:54.6-3:27.4, Bed C `going-shopping-again`, CARD ON)
```
2:54.6  [CARD] CH4 title-card-ch4 "WHERE IT STANDS" · [IMPACT] `DSGNImpt-single_impact_sound_-Elevenlabs.mp3` (dsgn-impact-elevenlabs,
        mood_class neutral, nothing dark in the playful chapter; measured peak 0.09 s, -40 dB at 1.17 s = 1.08 s tail) ·
        [TRANSITION] card move → rmn:slide (card, 0.40s) (the same card pick); edit-time pause 1.0 s in the breath 'itself.' 174.40 |
        'The' 174.64
2:54.6  [MUSIC] Bed B fades 0.4 s from the card (plateau, file 41.7), 0.6 s breath, Bed C `going-shopping-again` verse cut (Mike's
        LOCKED pick) fades in 0.5 s on its mallet plateau (file 6.97), seat -19 (gain -24.7 dB), end-pinned to the CH5 card
        (MUSIC-PLAN hard hit 174.64) → 3:27.4
2:54.6  [RECEIPT] C10-kccs-commits-log IN → 2:57.1 (2.42 s): the kaspanet/kccs commits log cropped to the Oct 1 (#32, #33) and → hand:xfade-scale (container-xfade, 0.35s)
        Oct 7 (#31) Last Call rows ONLY (the Oct 21 Final rows cropped out: the stamp is the reveal). treatment: pan
        [MOTION] lib:motion-3d-orbit-2-right-down (a repo log shown as an OBJECT on 'straight from the repo'; not the same
        move as RX1's offset)
2:54.6  SAY:  "The timeline, straight from the repo."
2:57.1  [DIAGRAM] c5-timeline-01-jun30 IN (Type 1, code-animated board-game path, CH4 gold, the K piece hops square to square) → hand:xfade-scale (container-xfade, 0.35s)
        → 3:10.5 (13.46 s): the JUN 30 'Toccata activates' square lands, onset 'June' 177.06 · [ACCENT]
        `accent-timpani-clicker-01-a.wav` (accent-timpani-clicker-01 take a, mood_class neutral; measured peak 0.05 s, -40 dB at
        1.83 s) file start 177.01, the hop lands ON the square (the playful 'game piece' tap, SFX intent)
2:57.1  SAY:  "June 30th, Toccata activates."
2:59.5  [DIAGRAM] c5-timeline-02-jul15 'conventions repo opens' (the repo OPENS, guard [!WARNING 1]), onset 'July' 179.54 ·
        [ACCENT] `accent-timpani-clicker-01-b.wav` (take b, mood_class neutral; peak 0.04 s) file start 179.49
2:59.5  SAY:  "July 15th, the convention repo opens."
3:02.5  [DIAGRAM] c5-timeline-03-aug20 'land as Drafts', onset 'August' 182.52 · [ACCENT] `accent-timpani-clicker-01-c.wav`
        (take c, mood_class neutral; peak 0.06 s) file start 182.46
3:02.5  SAY:  "August 20th, KCC-1, KCC-2, and KCC-20 land as Drafts."
3:03.8  [DIAGRAM] c5-timeline-04-aug20-drafts, the three Draft chips hop on one by one, silent: KCC-1 183.84, KCC-2 184.90,
        KCC-20 186.32 (end state = this PNG); the SEP 21 'KCC-0 Final' square is drawn, not spoken
3:08.6  SAY:  "On September 22nd, the Last Call pull request for KCC-20 opens."
3:08.8  [DIAGRAM] c5-timeline-05-sep22 'Last Call PR for KCC-20 opens' (opens, never 'still open'), onset 'September' 188.78 ·
        [ACCENT] `accent-timpani-clicker-01-a.wav` (take a, mood_class neutral) file start 188.73
3:10.5  [VIDEO] BR-8-board-game-hop IN (dissolve) → 3:13.8 (3.26 s), breaks the C5 hold on the clause with no date in it → hand:fade (broll-fade, 0.50s)
3:13.8  [DIAGRAM] c5-timeline-06-oct1 IN (the path returns) → 3:19.5 (5.68 s): the OCT 1 square lands, onset 'October' 193.78; → hand:xfade-scale (container-xfade, 0.35s)
        the KCC-1 / KCC-2 chips hop on at 195.68 / 196.64 · [ACCENT] `accent-timpani-clicker-01-b.wav` (take b, mood_class
        neutral) file start 193.74
3:13.8  SAY:  "October 1st, KCC-1, KCC-2 move to Last Call."
3:19.5  [DIAGRAM] c5-final-square-01-oct7 IN (the C5 path continued on the new end-state asset; same frame as c5-timeline-07-oct7
        with the Oct 21 PRs on the source line) → 3:22.6: the OCT 7 square lands big and gold, onset 'October' 199.46; the
        KCC-20 chip hops on at 'KCC-20' 200.90 · [ACCENT] `accent-timpani-clicker-01-c.wav` (take c, mood_class neutral)
        file start 199.40 → hand:cut (container-cut, 0.00s)
3:19.5  [MUSIC] Bed C plateau under the OCT 7 rung, the stamp and the silent hold (file 32-38.3); its CLOSING STAB (file 38.75)
        lands at 202.92 on 'late July' under RX3, end-pinned 4.52 s before the CH5 card (MUSIC-PLAN hard hit 199.46)
3:19.5  SAY:  "October 7th, KCC-20 joins them."
3:21.6  [DIAGRAM] c5-final-square-02-hop: the K piece hops ONE MORE square toward the gold FINAL square, onset 'joins' 201.64
3:22.0  [DIAGRAM] c5-final-square-03-land: the piece lands on FINAL, onset 'them.' 202.02
3:22.3  [DIAGRAM] c5-final-square-04-stamp: the dated stamp SLAMS 'UPDATE / KCC-20 IS FINAL / OCT 21, 2026' (kt-keyword-pop
        motion: appears at once, 100 → 110 with the jiggle), the ONLY current-status graphic in the video, on the end of
        'them.' 202.32 · [ACCENT] `twinkle.wav` (kinetic-text twinkle, POSITIVE, mood_class neutral; measured peak 0.66 s) file
        start 201.66 so the sparkle peaks ON the stamp frame (Mike, 2026-10-21)
3:22.4  [PAUSE] FINAL-STAMP beat: spine pause 3.0 s at the trough 202.44 ('them.' ends 202.32, 'By' starts 202.56), freeze +
        silence, the stamp held and read in silence (>= 2 s readable, Mike), Bed C plays on (no duck); a slow push onto the stamp
        through the pause. MECHANICAL GAP: card_pauses bakes only cards, clip inserts and braam beat pauses today; this row
        needs the same bake (see Open decisions)
3:22.6  [RECEIPT] RX3-kccs-readme-final IN → 3:24.8 (2.24 s): the kaspanet/kccs README index with KCC-1, KCC-2 and KCC-20 all → hand:xfade-scale (container-xfade, 0.35s)
        'Final' (KCC-0 Final, KCC-23 Draft), real pixels inside the CH4 gold frame. treatment: highlight
        (settling push) [HIGHLIGHT] wipes down the three Final cells from 'By' 202.56 (the Bed C stab lands 202.92 on them)
3:22.6  SAY:  "By late July, implementers were already reporting that their tokens only partly matched the draft."
3:24.8  [RECEIPT] C20-issue11-kaspacom IN → 3:27.4 (2.64 s): kaspanet/kccs issue #11, 'marciano147 opened on Jul 26', the quote → hand:xfade-scale (container-xfade, 0.35s)
        'partially aligned, not fully conforming.' treatment: highlight
        (settling push) [HIGHLIGHT] on 'partially aligned, not fully conforming.' onset 'only' 205.86
```

## CH5 - THE BIGGER PICTURE (3:27.4-5:29.0, Bed D `underworlds`, CARD ON)
```
3:27.4  [CARD] CH5 title-card-ch5 "THE BIGGER PICTURE" · [IMPACT] `Boom - Big Reveal-short.wav` (boom-big-reveal-short,
        mood_class epic, sub-heavy for the TOTAL change to epic greenish cyan; measured peak 0.04 s, -40 dB at 1.04 s = 1.00 s
        tail) · [TRANSITION] card move → rmn:slide (card, 0.40s) (the same card pick); edit-time pause 1.0 s in the breath 'draft.' 207.30
        | 'So' 207.44
3:27.4  [MUSIC] Bed C fades 0.4 s (its ring already 30 dB down), 0.6 s breath, Bed D `underworlds` (Mike's LOCKED pick) fades in → hand:fade (broll-fade, 0.50s)
        0.5 s from file 11.6-12.1 (seat -17, gain -28.6 dB), END-PINNED so the chord lands on 'later.' (MUSIC-PLAN hard hit
        207.44) → 5:29.0 and on through the end hold to 335.78
3:27.4  [VIDEO] BR-11-earth-pullback IN (dissolve off the card) → 3:29.9 (2.46 s, LEADING reverse dolly), literal 'zoom out'
3:27.4  SAY:  "So what's the bigger picture?"
3:29.0  SAY:  "Let's zoom out."
3:29.9  [RECEIPT] C13-rusty-kaspa-master-commits IN → 3:34.7 (4.82 s): rusty-kaspa master commits, 'Bump version to v2.1.0 → hand:xfade-scale (container-xfade, 0.35s)
        (#1139)' Sep 22 AND the Oct 13 to 16 block on one screen, the three-week gap visible; real pixels in the CH5 cyan frame.
        treatment: push (two-stage: settle on the Sep 22 row on 'September' 210.36, then push onto the gap on 'went' 213.10)
        `[VERIFY]` crop on render day
3:29.9  [DRONE] `drone-force-field-hum-low-01-a.wav` (drone-force-field-hum-low-01 take a, mood_class tense, slow-burn, never dark)
        file start 209.90, play 0-15.4, 1.5 s fade-in, 2.0 s fade-out, so it lies under Bed D's quiet build (file 12-30) through
        'quiet for three weeks', the six commits and 'still has no date', and is gone as the first wall arrives at 225.3;
        seated by mix_music.py 8 dB under the music seat
3:29.9  SAY:  "After the September 22nd release, the main node code went quiet for three weeks."
3:34.7  [VIDEO] BR-12-coders-night IN (dissolve) → 3:38.2 (3.48 s), literal 'six commits landed' → hand:fade (broll-fade, 0.50s)
3:34.7  SAY:  "Then six commits landed in one week, October 13th to the 16th."
3:38.2  [VIDEO] BR-13-steam-night-teal IN (dissolve) → 3:41.1 (2.94 s), literal 'plumbing' → hand:fade (broll-fade, 0.50s)
3:38.8  SAY:  "Maintenance and plumbing, not a new feature."
3:41.1  [IMAGE] IMG-7-knight-ridge IN → 3:43.4 (2.30 s): PLAYS ITS MOTION CLIP `img-motion/IMG-7-knight-ridge-motion.mp4` from 0
        (aurora rippling, cape stirring), cut at the slot end, no Ken Burns; AI-still ingress → lib:blocks-short-1 (glitch-still, 0.96s) (ai_still); serious,
        no oof
3:41.1  SAY:  "And DAGKnight, the next consensus upgrade, still has no date."
3:43.4  [RECEIPT] C14-branch-commits IN → 3:45.5 (2.04 s flash): the rusty-kaspa branches page, the 'dagknight' row with its → hand:xfade-scale (container-xfade, 0.35s)
        'Sep 8, 2026' last-update label, real pixels in the cyan frame. treatment: push (onto the date cell)  `[VERIFY]`
3:45.5  [CHART] c15-daily-transactions-start IN (Type 1, code, greenish cyan) → 3:53.3 (7.80 s): daily STANDARD accepted → hand:xfade-scale (container-xfade, 0.35s)
        transactions Sep 1 to the latest full day, bars DRAWN left to right, the September average line (108,952) marked
3:45.5  [MUSIC] Bed D's first wall arrives by arrangement (file 30.0, env 8 at 225.3, env 9 at 227.3 as the chip lands); no riser,
        no hit: the file does it (MUSIC-PLAN hard hit 225.48)
3:45.5  SAY:  "Usage is a tiny base, around 82,000 standard transactions a day the week of October."
3:47.4  [CHART] c15-daily-transactions-mid: the Oct 12 to 15 week bracket + its average chip (81,767, dated) lands ON '82' 227.42
3:50.8  SAY:  "Up around 22% on the week before."
3:51.4  [CHART] c15-daily-transactions-payoff: the '+21.5% vs prior week' delta chip lands ON '22' 231.40  `[VERIFY]` series on
        render day
3:53.3  [VIDEO] BR-14-asic-mining-rigs IN (dissolve) → 3:56.8 (3.50 s, LEADING dolly), literal 'proof of work' → hand:fade (broll-fade, 0.50s)
3:53.3  SAY:  "And the supply is fixed."
3:54.7  SAY:  "Proof of work, no premine."
3:56.8  [CHART] c17-supply-ring-start IN (Type 1, code, greenish cyan) → 4:01.1 (4.28 s + the braam pause): the supply ring → hand:xfade-scale (container-xfade, 0.35s)
        starts FILLING on 'Around' 236.78, chips 'PROOF OF WORK / NO PREMINE'
3:56.8  SAY:  "Around 96.7% of all Kaspa is already mined."
3:57.1  [CHART] c17-supply-ring-mid: the centre counting up from '96' 237.06
4:00.2  [CHART] c17-supply-ring-payoff: the ring reaches the DATED figure 96.72% ('27.76B of 28.70B KAS mined', source line
        api.kaspa.org/info/coinsupply) ON 'mined.' 240.16  `[VERIFY]`
4:01.0  [BRAAM] `braam-horn-stinger-02-a.wav` (braam-horn-stinger-02 take a, mood_class epic; measured: full to 3.3 s, -14 dB at
        4.0 s, -30 dB at 4.7 s, -40 dB at 5.36 s) spine pause 4.7 s at 240.99 (the trough 'mined.' 240.92 | 'New' 241.06),
        the braam starts ON the pause's first frame, the voice silent until it ends (the last 0.66 s from -30 to -40 dB rings
        under Bed D's wall into 'New'); the C17 ring holds through the pause: ZOOM to "96.72%" (eased inOut push over exactly
        the pause frames, the figure drifting to frame centre at ~2.4x, held into the cut; comp `bz`)
4:01.0  [MUSIC] Bed D plays on through the braam pause at its seat on the wall (file 45.65 on), NO duck (a beat pause: the VO is
        silent) (MUSIC-PLAN hard hit 240.99)
4:01.1  [IMAGE] IMG-8-crowd-narrow-pass IN (cross-warp, the first cut after the hit) → 4:03.6 (2.58 s) → hand:cross-warp (image-warp, 0.50s)
4:01.1  SAY:  "New demand meets very little new supply."
4:03.3  (riser REMOVED, Mike 2026-10-22 on draft v1: "an unnecessary impact sound effect at 4:34"; the Tension Rise
        swell to its peak on the I1 reveal was the only loud event there. The I1 reveal keeps its blocks-max-2 glitch SFX.)
4:03.6  [IMAGE] IMG-9-balance-scale-asymmetry IN (cross-warp) → 4:06.8 (3.16 s), literal 'asymmetry' (no number, no target on
        screen) → hand:cross-warp (image-warp, 0.50s)
4:03.6  SAY:  "Conditional, and that's the asymmetry I'm watching."
4:06.8  [IMAGE] IMG-10-summit-cyan-moon-k = I1, THE marquee image, IN → 4:09.8 (2.96 s): the summit figure, the huge greenish-cyan
        moon with the Kaspa K; slow push-in over the slot; AI-still ingress → lib:blocks-max-2 (glitch-still, 0.96s) (ai_still); the riser above lands ON
        this frame, no extra hit
4:06.8  [MUSIC] Bed D's wall (file 55.5-58.5, env 9) under the I1 reveal; the riser lands into it, no music move, no extra hit
        (MUSIC-PLAN hard hit 246.80: the arrangement is already at its peak)
4:06.8  SAY:  "And I'm telling you, this is going to be well worth the wait."
4:09.8  [VIDEO] BR-15-ridge-flight-twilight IN (dissolve) → 4:12.9 (3.14 s, LEADING rising flight), ends exactly on the F3 edge → hand:fade (broll-fade, 0.50s)
4:09.8  SAY:  "At least for me anyway, nothing here is financial advice."
4:12.9  [TRANSITION] F3 cover→face cut-in → hand:film-burn (face-cut, 0.76s) (face pick)
4:12.9  [FACE] F3 IN → 5:29.0 EOF (blackdetect 252.900-328.992), the recorded room (no swap on F3); NO graphic of any kind over the
        pitch (no multiplier, target or price, AS-RECORDED flag), no kinetic panels (the what-to-watch line was cut)
4:12.9  [CAPTION] ON → 5:29.0 (F3; MYX not NYX, 'the Lab token', 'investor-backed')
4:12.9  [MUSIC] Bed D's own SETTLE (file 62-76, 2 to 3 dB under the walls) lands at 253.3 by arithmetic: the face gets the softest
        bed of the chapter without a row (MUSIC-PLAN hard hit 252.94)
4:12.9  SAY:  "But the high conviction holders, the ones who are in it for the long haul,"
4:16.9  SAY:  "are going to make it big time."
4:17.6  [PUNCH-IN] F3 step IN ON the desilence-coarse join 257.600 (frame 7728) · [LIGHTLEAK] lib:lightleaks-* on the same frame
        → lib:lightleaks-1 (punch-leak, 1.12s) (punch-leak)
4:18.3  SAY:  "Because the ones with the vision are the ones that will end up dominating the world."
4:22.3  [PUNCH-IN] F3 step back OUT ON the burst-removal join 262.267 (frame 7868), the cut what-to-watch line's HEAD JUMP
        ('world.' | 'But'; head lower/left → higher/right), masked by the step · [LIGHTLEAK] lib:lightleaks-* on the same frame
        → lib:lightleaks-4 (punch-leak, 1.12s) (punch-leak). MOVED from the seed's 261.700 coarse join 0.57 s earlier (the 1.5 s rule keeps one of the
        two; the AS-RECORDED flag needs the visible jump masked, so this one)
4:22.4  [DUCK] Bed D -3 dB RELATIVE (20 under the VO), 0.5 s ramps, 262.40 → 322.90, under the 61 s unscripted pitch; releases
        before the CTA so 'like and subscribe' and 'later.' get the full wall and the chord (MUSIC-PLAN automation; Mike can zero
        it). Not a vibe cut: no impact rides it (house rule 7, never an impact on the plug)
4:22.4  SAY:  "But I can tell you, if you're interested in stacking Kaspa, while it's still cheap,"
4:27.3  SAY:  "the best way to do that is to get in on a bunch of good tokens that really are going to moon 100x,"
4:33.8  SAY:  "500x within like six months to a year."
4:36.5  SAY:  "I'm not talking about degen plays."
4:38.3  SAY:  "I'm talking about investor-backed insider tokens that me and my group get in on early."
4:44.0  SAY:  "We have a whole bunch of plays."
4:45.7  [PUNCH-IN] F3 step IN ON the desilence-final join 285.667 (frame 8570) · [LIGHTLEAK] lib:lightleaks-* on the same frame
        → lib:lightleaks-1 (punch-leak, 1.12s) (punch-leak)
4:45.8  SAY:  "Click the link in the description below."
4:47.6  SAY:  "You can see all the receipts, 550x on MYX, 350x on the Lab token, and many, many others."
4:54.8  SAY:  "All investor-backed takes time."
4:55.8  [PUNCH-IN] F3 step back OUT ON the desilence-final join 295.767 (frame 8873) · [LIGHTLEAK] lib:lightleaks-* on the same
        frame → lib:lightleaks-short-4 (punch-leak, 0.40s) (punch-leak)
4:56.9  SAY:  "Sometimes it takes six months."
4:58.2  SAY:  "Sometimes it takes a year before they pop."
5:00.7  SAY:  "It's not like one of those like, I'm going to put in like 100 bucks on a degen play,"
5:04.7  SAY:  "and it's going 100x tomorrow."
5:05.9  SAY:  "No, there's nothing like that."
5:07.6  SAY:  "It's a strategy involved."
5:08.6  [PUNCH-IN] F3 step IN ON the desilence-coarse join 308.567 (frame 9257) · [LIGHTLEAK] lib:lightleaks-* on the same frame
        → lib:lightleaks-4 (punch-leak, 1.12s) (punch-leak)
5:09.2  SAY:  "Make sure you're surrounded by some like-minded people in a group of people who can share ideas."
5:15.4  SAY:  "And everybody is in it for the money to all together, right?"
5:18.5  SAY:  "So we're all willing to help each other out and grow together."
5:21.7  SAY:  "So click the link in the description below."
5:23.2  SAY:  "And besides that, click that like button and that subscribe button."
5:26.6  SAY:  "I'm going to catch you guys later."
5:28.1  [MUSIC] the close: Bed D's epic_hit CHORD onset (file 121.75) lands ON 'later.' 328.08-328.78 by the end-pin, 10 dB down
        at 330.4, 35 dB down at 333.4; NO extra hit on 'later.' (SFX intent), the chord IS the ending (MUSIC-PLAN hard hit 328.12)
5:28.4  [PUNCH-IN] F3 step back OUT ON the desilence-coarse join 328.367 (frame 9851), on 'later.' · [LIGHTLEAK] lib:lightleaks-*
        on the same frame → lib:lightleaks-short-1 (punch-leak, 0.40s) (punch-leak)
5:29.0  [END] spine EOF 328.99: hold the LAST FACE FRAME (frozen, base frame, captions off) from sh(328.99) to the end_card_hold
        335.78 (6.79 s) while the chord rings out; render the comp to that length and pad the VO to match (MUSIC-PLAN
        end_card_hold). No end-card asset exists, so the held frame is the plan (see Open decisions)
``` → hand:cut (face-cut, 0.00s)

## Orphan reconciliation (zero orphans, against `assets/` on disk 2026-10-21)

**PLACED (timecode above):**
- vid x12: BR-1-teal-particles 0:06.8 · BR-2-server-corridor 0:17.0 · BR-4-network-nodes 0:30.5 · BR-5-phone-hand-cyan 1:05.0 ·
BR-6-envelope-handoff 1:15.5 · BR-7-stadium-roar 2:09.7 · BR-8-board-game-hop 3:10.5 · BR-11-earth-pullback 3:27.4 ·
BR-12-coders-night 3:34.7 · BR-13-steam-night-teal 3:38.2 · BR-14-asic-mining-rigs 3:53.3 · BR-15-ridge-flight-twilight 4:09.8.
- img x8: IMG-1-circuit-k-macro 0:28.2 (plays IMG-1-circuit-k-macro-motion) · IMG-2-identical-coin-grid 0:50.7 ·
IMG-3-krc20-token-crowd 1:56.2 · IMG-4-coin-fused-bedrock 2:51.5 · IMG-7-knight-ridge 3:41.1 (plays IMG-7-knight-ridge-motion) ·
IMG-8-crowd-narrow-pass 4:01.1 · IMG-9-balance-scale-asymmetry 4:03.6 · IMG-10-summit-cyan-moon-k 4:06.8.
The two stills stay as the fallback frame a transition pulls (comp-build 3c).
- receipts x11: C9-pr31-merged 0:09.4 · RX4-pr31-status-diff 0:13.8 · C12-toccata-release-v2.0.0 0:32.6 · RX1-kasplex-org 2:00.1 ·
RX2-xxim-masterclass-watch 2:34.6 · C18-kasstacker-covenants 2:49.5 · C10-kccs-commits-log 2:54.6 · RX3-kccs-readme-final 3:22.6 ·
C20-issue11-kaspacom 3:24.8 · C13-rusty-kaspa-master-commits 3:29.9 · C14-branch-commits 3:43.4.
- clip-inserts x1: CLIP-1-helfer-real-assets 2:42.2 (INSERT) + its first / last frame as the lead-in 2:38.5 / lead-out 2:42.2.
- title-slides x3: title-card-ch2 0:30.5 · title-card-ch4 2:54.6 · title-card-ch5 3:27.4. card-slides x1: card-rulebook 0:44.5.
- diagrams (Type 2 stills, every state placed on its word): diagram-covenant-stack-coin / -spent / -next ·
c1-state-01-base / -amount / -owner / -settings / -entrypoint · c1-state-02-base / -digest ·
c1-state-03-base / -s00 / -s01 / -s03 / -s04 · c2-borrowed-receive-left-base / -left-kas / -left-mass /
c2-borrowed-receive-right-base / -right-owner / -right-floor / -right-amount · c3-marquee-base / c3-marquee-krc-1 /
c3-marquee-krc-2 / c3-marquee-krc-3 / c3-marquee-krc-4 / c3-marquee-kcc-1 / c3-marquee-kcc-2 / c3-marquee-kcc-3 /
c3-marquee-kcc-4 / c3-marquee-both. Their HTML sources (diagram-covenant-stack, c1-state-01, c1-state-02, c1-state-03,
c2-borrowed-receive, c3-marquee) are build sources, exempt per comp-build section 10.
- animated (Type 1, code; the PNGs are the design states the comp animates to, comp-build section 7): c5-timeline-01-jun30 /
c5-timeline-02-jul15 / c5-timeline-03-aug20 / c5-timeline-04-aug20-drafts / c5-timeline-05-sep22 / c5-timeline-06-oct1 (source
c5-timeline) · c5-final-square-01-oct7 / c5-final-square-02-hop / c5-final-square-03-land / c5-final-square-04-stamp (source
c5-final-square) · c4-token-count-start / c4-token-count-s1-mid / c4-token-count-s1-payoff / c4-token-count-s2-payoff (source
c4-token-count) · c15-daily-transactions-start / c15-daily-transactions-mid / c15-daily-transactions-payoff (source
c15-daily-transactions) · c17-supply-ring-start / c17-supply-ring-mid / c17-supply-ring-payoff (source c17-supply-ring).
- spine layers: the paused spine (assets/spine.mp4 after card_pauses), 9 punch-ins + 9 light leaks on the 3 windows' joins,
4 face cuts (2 in, 2 out), 3 caption windows, 4 kinetic side panels + 3 keyword pops + 1 stamp pop (comp-built), H0 motion card.

**REJECTED (renderable, deliberately not placed):**
- c5-timeline-07-oct7: REJECTED, superseded by c5-final-square-01-oct7 (pixel-identical OCT 7 frame, but the end-state asset adds
the Oct 21 PRs #39-#41 to its source line and continues the path into the FINAL square, so the hop never swaps assets mid-move).

**BENCH (build sources still in `assets/` whose lines Mike cut 2026-10-21; their PNG states already moved to `_bench/`):**
- c6-last-call-ladder (html) BENCH · diagram-dependency (html) BENCH · diagram-one-rulebook (html) BENCH: their lines (what Last
Call means, the dependency, the conditional case) are cut from the spine; never forced back in.
- Already in `_bench/` (out of assets/, listed for the record): BR-3, BR-9, BR-10, IMG-5, IMG-6 (+ its motion clip), card-not-yet
s1/s2, receipts C7 and C8 (C8 replaced by RX4 on 'flips to Last Call', COVER-PLAN open_questions 1).

**SFX (from `video-creation/assets/sfx/`, all placed above):** Impact_Hit_01-2-short.wav · Tension_Rise_Logo_Reveal_3-1s.wav ·
card-impact-layered.wav · swoosh-1.mp3 (x2) · swoosh-2.wav (x2) · twinkle.wav (x2) · knock-pop.wav · cash-register.wav ·
accent-scifi-mystery-02-c.wav · accent-scifi-mystery-02-b.wav · DSGNImpt-single_impact_sound_-Elevenlabs.mp3 ·
accent-timpani-clicker-01-a/-b/-c.wav (x6 taps) · Boom - Big Reveal-short.wav · drone-force-field-hum-low-01-a.wav ·
braam-horn-stinger-02-a.wav (the 4:03.3 Tension_Rise_Logo_Reveal_3 riser removed 2026-10-22).

## Open decisions that would move a cue
1. **FINAL-stamp pause bake (mechanical, blocks the build as written):** `card_pauses` reads beat pauses ONLY from `[BRAAM]` rows
(`_beat_pauses` in graph/longform_graph.py), so the `[PAUSE] ... spine pause 3.0 s at 202.44` row is not baked today. Either
extend the parser to `[PAUSE]` rows (same `t@d:label` spec bake_card_pauses.py already takes) or drop the pause; MUSIC-PLAN's
Bed C and Bed D arithmetic already assumes the 3.0 s.
2. **Stamp pause length / Option B (COVER-PLAN open_questions 2):** 3.0 s as written (RX3 on the head of 'By late July'); Option B
= ~4.5 s with RX3 sequenced INSIDE the pause and C20 on the whole line. Moves RX3 / C20 and the Bed C stab (MUSIC-PLAN oq 2).
3. **Braam pause = 4.7 s** (the -30 dB point of take a; -40 dB is 5.36 s). A 4.0 s pause (Mike's tao rule of thumb) lets the
-14 to -30 dB tail ride under 'New demand'; 5.4 s is fully clean. Shifts everything after 240.99.
4. **F3 punch at 262.267 instead of 261.700** (masks the cut what-to-watch head jump). If Mike prefers the seed's point, the head
jump needs another face-cut device there.
5. **End of video:** frozen last face frame 328.99 → 335.78 under the chord ring (no end-card asset exists); a ~4 s hold would put
the chord on 'subscribe button.' instead of 'later.' (MUSIC-PLAN oq 1).
6. **SFX density for Mike's gate:** six timpani taps on the C5 squares (drop to OCT 1 + OCT 7 if it reads busy); two scifi
accents in CH3 (one per lane); the pitch dip -3 dB (MUSIC-PLAN oq 3).
7. **Receipt treatments:** pans on C9, RX1, C10 (3 of 11 real receipts); C10 at 2.42 s is the shortest pan slot, swap to push if the
orbit reads rushed.
8. **TRANSITIONS.md picks (strategist):** the face device (film burn per the COVER-PLAN notes vs blocks glitch), the card move,
the leak set, the ai_still ingress look, and the two marquee candidates (SPIN at 2:11.2 C3 reveal, MELT at 2:44.4 C4 return).
9. **F1 / F2 background swap:** not built; when the Higgsfield clips land they replace the spine picture in 0.000-6.833 and
19.633-28.167 (spine audio kept), and the punch-ins at 3.8 / 22.567 / 26.267 must be re-checked against the swap's own framing.
