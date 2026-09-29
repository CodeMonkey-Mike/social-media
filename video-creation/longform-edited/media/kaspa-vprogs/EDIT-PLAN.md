# kaspa-vprogs - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED 2026-09-28 by `edit-plan-author`, refining the graph's seed (`_previews/EDIT-PLAN.seed.md`, from
> `skills/edit-plan-and-cue-sheet/gen_editplan.py`) against AS-RECORDED.md + `spine/ALL.f.cut.medium-words.json`
> + COVER-PLAN.json + MUSIC-PLAN.json + `assets/diagrams/_state-cues.md` + `assets/charts/c3-ladder.spec.md` +
> the slide-state map in `assets/slide-sources/_shot.py` (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1;
> per the §0 ORDER note the comp is built TO this log, the render confirms it).
> Watch file: `spine/ALL.f.cut.mp4` (202.822 s / 3:22.8, 30 fps). Timecodes = FINAL-spine seconds, PRE-card-pause.
> Never re-apply a spine-chain shift. The two title-card pauses (1.5 s each, Mike GATE 3 2026-09-28) are
> inserted at the comp at 40.22 (CH2) and 137.58 (CH3); every cue after them routes through `sh()`
> (+1.5 s after 40.22, +3.0 s after 137.58; final runtime 205.822 s / 3:25.8).
> Transition ids are RESOLVED from TRANSITION-PLAN.json (reconciled 2026-09-28)
> writes it next, off this log). Bucket defaults noted inline are the house kit, the strategist picks the ids.
> FACE = exactly 2 windows (blackdetect, AS-RECORDED): 0.000-7.333 and 28.167-31.933. Captions ON over those
> two windows ONLY (never over a cover), `build_captions.py --style montserrat --max-words 2 --max-short 4`,
> AS-RECORDED mishear list re-applied (Casper → Kaspa, Vprogs → vProgs, etc.).
> Every Type 2 system-design still gets a slow 1.00 → 1.03 push across its window (comp-build §7a, never a dead
> still; full-diagram views stay under ~4%). State swaps inside one diagram/slide = 6-8f cross-fade, no scale
> reset (ingress transition fires on ENTRY only).
> SFX + music are an ffmpeg POST-mix (comp-build §9), every SFX UNDER the VO. Impacts were picked by MEASURED
> audible tail (envelope to -40 dB below peak, ffmpeg decode, 2026-09-28; table at the bottom). Each impact's
> file start = reveal frame minus the file's measured peak offset, so the transient lands ON the reveal.
> ZERO ORPHANS: every renderable file in `assets/` (vid, img, receipts, charts, diagrams, title-slides,
> card-slides) is PLACED below with a timecode, or marked BENCH / REJECTED in the reconciliation at the end.

## CH1 - STRAIGHT INTO IT (0:00.0-0:40.2, Bed A `down-to-the-wire`, card OFF)
```
0:00.0  [FACE] F1 opens ON face → 0:07.3 (the video opens here, no cut-in) · [CAPTION] ON → 0:07.3
0:00.0  [MUSIC] Bed A `down-to-the-wire` COLD, file in 0.91, gain -31.1 dB (-22 under VO), full by 0:00.5,
        no fade-in → 0:40.2 · [IMPACT] Kick_Impact_01-short.wav, file start 0:00.0 (peak 0.18 s in, lands
        on "Kas-"; measured audible tail 0.36 s), sub-weighted, set well under the VO: the cold hit of the hook
0:00.0  SAY:  "Kaspa is building vProgs, verifiable programs, real apps on a base layer, on a proof of work,"
0:01.7  [LIGHTLEAK] F1 sustained-face warmth → 0:05.7 (centered on the hold midpoint 3.67, d = min(7.33 - 2, 4)
        = 4 s; screen-blend ~0.3; renders under cover, captions above it)
0:03.8  [PUNCH-IN] F1 ~15-20% zoom on "real apps" (3.78), holds to the face-out → hand:punch (punch-in, 0.00s)
0:06.5  SAY:  "not an L2."
0:07.3  [TRANSITION] face→cover F1 out (face pick: film burn or blocks-max, one per video) → lib:blocks-max-1 (face-cut, 0.96s)
0:07.3  [RECEIPT] R1 IN → 0:09.5, yellow paper title page (DRAFT v0.0.1, authors line), R(other), quick
        scale-back pop, no reading move `[VERIFY]` (quiet cover ingress → lib:blocks-max-1 (face-cut, 0.96s))
0:07.4  SAY:  "A vProg is an app that runs on its own node, keeps its own state and posts zero knowledge"
0:09.5  [DIAGRAM] vprog-loop-mini IN → 0:14.5, state `vprog-loop-mini-nodes` (vPROG'S OWN NODES lit; "node" 9.78)
        (container cross-fade + 0.93 → 1 scale-in → hand:xfade-scale (container-xfade, 0.35s))
0:10.9  [DIAGRAM] vprog-loop-mini-state on "state" (10.86)
0:11.4  [DIAGRAM] vprog-loop-mini-proof on "posts" (11.40): ZK PROOF token launches (optional comp slide of the
        token, left 690 → 958, y 639, across 11.40-14.02)
0:12.4  SAY:  "proof of that state back to Kaspa."
0:14.0  [DIAGRAM] vprog-loop-mini-landed on "Kaspa" (14.02): token lands in KASPA L1
0:14.5  [RECEIPT] R2 IN → 0:21.2, rusty-kaspa v2.0.0 Mainnet Toccata Release header, R(other), slow push-in → hand:xfade-scale (container-xfade, 0.35s)
        toward the KIP list
0:14.5  SAY:  "Now Kaspa already has smart contracts, covenants, live on mainnet since June, straight from"
0:17.2  [RECEIPT] R2 push lands on the KIP list (KIP-16 / 17 / 20 / 21) on "covenants" (17.16)
0:18.4  [RECEIPT] R2 activation line (DAA 474,165,565, June 30) in frame by "mainnet" (18.42)
0:20.1  SAY:  "the core devs."
0:21.2  [VIDEO] BR-1 glass planes rising IN → 0:25.2 (Envato, muted, slot = file 1.00-5.00; dissolve in/out
        → hand:fade (broll-fade, 0.50s))
0:21.2  SAY:  "vProgs are the next layer up, whole applications on a chain that already runs 10 blocks every"
0:25.2  [CONTAINER] ten-bps-card IN → 0:28.2 (single state; eyebrow 'A CHAIN THAT ALREADY RUNS' reads first;
        2.95 s sub-floor one-glance type card, see open decisions)
0:25.9  [CONTAINER] ten-bps-card '10 BLOCKS / SEC' slam on "10" (25.92) = comp punch-in on the whole card, no SFX
0:27.3  SAY:  "single second."
0:28.1  SAY:  "Kaspa is never going to run your app, Kaspa is going to verify it."
0:28.2  [TRANSITION] cover→face cut-in F2 on the picture edge 28.167 (NOT the 28.10 word) → lib:blocks-max-2 (face-cut, 0.96s) ·
        [FACE] F2 → 0:31.9 · [CAPTION] OFF (3.77 s hold, under the 5 s caption trigger, captions.md). No light leak (same rule)
0:28.2  [DUCK] Bed A -3 dB (gain -34.1) 28.167 → 31.933, 0.2 s ramps, so the locked thesis line cuts through
0:30.6  [PUNCH-IN] F2 ~15-20% zoom on the second "Kaspa is going to verify it" (30.62), holds to the face-out → hand:punch (punch-in, 0.00s)
0:31.9  [TRANSITION] face→cover F2 out → lib:blocks-max-3 (face-cut, 0.96s) · [CONTAINER] execute-verify-flip-s1 IN → 0:38.8
        ('EXECUTE' struck red) · [MUSIC] Bed A back to nominal -31.1 (0.2 s ramp)
0:31.9  SAY:  "And that one flip is how you get apps on the base layer with proof of work security and"
0:32.6  [CONTAINER] execute-verify-flip-s2 flips to 'VERIFY' (greenish cyan) on "flip" (32.58); bed swells back
0:33.9  [CONTAINER] execute-verify-flip-s3 'APPS ON THE BASE LAYER' on "apps" (33.94)
0:35.9  [CONTAINER] execute-verify-flip-s4 'PROOF OF WORK SECURITY' on "proof" (35.92)
0:37.8  SAY:  "no L2 in the middle."
0:37.9  [CONTAINER] execute-verify-flip-s5 'NO L2 IN THE MIDDLE' slams on "L2" (37.94) · [IMPACT]
        Impact_Hit_01-2-18.wav, file start 37.82 (peak 0.12 s in → 37.94; measured audible tail 1.66 s, gone
        by 39.6, before the card), layered ON Bed A's own epic hit (file 38.85 = spine 37.94): the hook payoff
0:38.8  [VIDEO] BR-2 glass shatter IN → 0:40.2 (Envato, muted, slot = file 1.00-2.40, burst ~1.07 = 0.07 s after → hand:fade (broll-fade, 0.50s)
        the cut; dissolve in, HARD OUT into the CH2 card; Bed A's ring-out carries it, no extra SFX)
0:38.8  SAY:  "So let's break this all down."
```

## CH2 - NOT AN L2 (0:40.2-2:17.6, Bed B `accomplishments-subtle`, CARD ON)
```
0:40.2  [CARD] CH2 title-card-ch2 'NOT AN L2' · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs.mp3 on the
        card's landing frame (peak 0.02 s in; measured audible tail 1.16 s, fits inside the 1.5 s pause) ·
        [TRANSITION] card presentation (one pick for both cards; cube = hand:cube-3d, rotate in ~11f, hold,
        never cube back out) → hand:cube-3d (card, 0.37s). Edit-time pause 1.5 s, zero spine time: readable = 1.5 - 0.37
        turn = 1.13 s >= 1.0 s (comp asserts it); no silence room in the spine (<0.1 s), the pause is the room
0:40.2  [MUSIC] bed change A → B inside the pause: Bed A safety-fade card+0.0 → +0.4; breath +0.4 → +1.0;
        Bed B (file in 36.5, gain -29.1 dB, -23 under VO) fades in +1.0 → +1.5, fully up on "So back in 2020"
0:40.2  [RECEIPT] R3 IN → 0:52.2, ethereum-magicians 'A rollup-centric ethereum roadmap' (vbuterin, Oct 2020),
        R(article) two-stage read: wide establish (title, author, date) first (ingress → hand:xfade-scale (container-xfade, 0.35s))
0:40.2  SAY:  "So back in 2020 Vitalik laid out Ethereum's plan and it said in plain English, all in"
0:44.6  [RECEIPT] R3 stage 1 push-in to the 'all-in on rollups' sentence on "plain" (44.64)
0:46.0  SAY:  "on rollups, your accounts, your businesses, your assets living inside a layer 2."
0:46.5  [RECEIPT] R3 highlight completes on "rollups" (46.48)
0:47.5  [RECEIPT] R3 stage 2 drifts to 'primary accounts, balances, assets' on "accounts" (47.52), holds
        (the page's words on screen, never the VO's 'businesses')
0:52.2  [DIAGRAM] c2-l2-stack IN → 1:04.6, state `c2-l2-stack-empty` (C2 shown ONCE; quiet ingress → hand:xfade-scale (container-xfade, 0.35s))
0:52.2  SAY:  "And every rollup is its own chain, its own sequencer, the machine that orders your transaction"
0:54.0  [DIAGRAM] c2-l2-stack-chain 'OWN CHAIN' on "chain" (54.04)
0:55.4  [DIAGRAM] c2-l2-stack-sequencer 'OWN SEQUENCER' on "sequencer" (55.38)
0:58.1  SAY:  "payments, its own bridge, its own slice of liquidity."
        (Whisper "transaction payments", p 0.29 / 0.00: ear check open; under a cover, so no caption impact)
0:59.0  [DIAGRAM] c2-l2-stack-bridge 'OWN BRIDGE to L1' on "bridge" (58.96)
1:00.6  [DIAGRAM] c2-l2-stack-liquidity 'OWN SLICE OF LIQUIDITY' on "liquidity" (60.60)
1:01.2  SAY:  "And every one of those pieces is a place for something to break and a place for your liquidity"
1:02.1  [DIAGRAM] c2-l2-stack-pieces on "pieces" (62.12): red attack-surface outlines pulse twice (1 → .6 → 1, 20f)
1:04.6  [VIDEO] BR-3 ice glow cracks split IN → 1:07.8 (Envato, muted, slot = file 1.00-4.20, the cut lands on
        "break" 64.68, new crack branches ~file 3.0-4.2 under "split up" 67.20; dissolve → hand:fade (broll-fade, 0.50s))
1:06.4  SAY:  "to get split up."
1:07.8  [CONTAINER] sompolinsky-name-card-s1 IN → 1:13.0 ('KASPA'S FOUNDER' / 'Yonatan Sompolinsky' / @hashdag
        line; text-accurate name card, no photo)
1:07.8  SAY:  "Now Kaspa's founder, Yonatan Sompolinsky looked at all of that and back in December"
1:12.4  [CONTAINER] sompolinsky-name-card-s2 'December 2025' stamp on "December" (72.38)
1:13.0  [RECEIPT] R4 IN → 1:21.7, Kaspa Magazine 2025-12-17 quote paragraph, R(article), slow push-in toward → hand:xfade-scale (container-xfade, 0.35s)
        'avoid the obsolete path of L2's' (highlight baked into the recapture)
1:13.0  SAY:  "he said the whole point of vProgs was to avoid the obsolete path of L2s."
1:16.8  [RECEIPT] R4 push lands, highlight completes on "obsolete" (76.78); holds (the receipt IS the point)
1:18.7  SAY:  "His words, not mine."
1:20.1  SAY:  "And he hasn't softened on it."
1:21.7  [DIAGRAM] c1-overview IN → 1:34.5, state `c1-overview-dim` (THE C1 diagram, shown ONCE, comp declares → hand:xfade-scale (container-xfade, 0.35s)
        `// DIAGRAM_REFS`; full-view push under 4%; entrance on 81.70, the 0.08 s breath after the cut junction)
1:21.7  [DUCK] Bed B -2 dB (gain -31.1) 81.7 → 118.38, 1.0 s ramps, under the machine beat. No SFX
1:21.7  SAY:  "So here's how a vProg actually works."
1:24.0  SAY:  "You send a transaction and you declare upfront which account it reads and which one it writes."
1:24.7  [DIAGRAM] c1-overview-users USERS lights on "transaction" (84.74)
1:27.4  [DIAGRAM] c1-overview-reads 'reads' tag on the tx on "reads" (87.44)
1:28.6  [DIAGRAM] c1-overview-writes 'writes' tag on "writes" (88.62)
1:29.4  SAY:  "Kaspa does four jobs."
1:29.8  [DIAGRAM] c1-overview-kaspa KASPA L1 glows on "four" (89.80)
1:30.8  SAY:  "It orders every transaction so Kaspa itself is the sequencer."
1:31.0  [DIAGRAM] c1-overview-orders ORDERS (sequencer) lights on "orders" (90.96)
1:34.1  [DIAGRAM] c1-overview-orders ORDERS row pulse on "sequencer" (94.06): comp scale 1 → 1.03 → 1 on the
        Kaspa-node crop, 16f
1:34.5  [DIAGRAM] c1-kaspa-four-jobs IN → 1:40.4, state `c1-kaspa-four-jobs-orders` = the landing frame of the
        push-in match from the overview's Kaspa node (5 frames; MELT marquee candidate, see TRANSITIONS note)
        → lib:melt-rgb-3 (MELT-transform, 0.76s)
1:34.5  SAY:  "It stores the data, it checks the proofs, it meters the work."
1:34.7  [DIAGRAM] c1-kaspa-four-jobs-stores STORES on "stores" (94.66)
1:36.2  [DIAGRAM] c1-kaspa-four-jobs-checks CHECKS PROOFS on "checks" (96.22)
1:37.4  [DIAGRAM] c1-kaspa-four-jobs-meters METERS on "meters" (97.42)
1:38.2  SAY:  "What it never does is run the app."
1:38.5  [DIAGRAM] c1-kaspa-four-jobs-execute struck 'EXECUTE' row appears on "never" (98.54)
1:39.8  [DIAGRAM] EXECUTE drop starts (same `.x-row`: translate 0,0 → 30,144 px, rotate 1.5deg, opacity 1 → .45,
        ease-in ~14f), dashed empty slot fades in behind it
1:40.3  [DIAGRAM] c1-kaspa-four-jobs-dropped lands on "app." (100.26)
1:40.4  [DIAGRAM] c1-vprog-nodes IN → 1:46.9, state `c1-vprog-nodes-entry` (vPROG A NODES enlarged, purple) → hand:xfade-scale (container-xfade, 0.35s)
1:40.4  SAY:  "The app runs on its own nodes."
1:41.7  [DIAGRAM] c1-vprog-nodes-nodes 'runs on its own nodes' badge on "nodes." (101.70)
1:42.3  SAY:  "Every vProg owns its own accounts and it's the only thing allowed to write to them."
1:44.0  [DIAGRAM] c1-vprog-nodes-accounts account set A_p on "accounts" (104.00)
1:46.3  [DIAGRAM] c1-vprog-nodes-lock 'WRITE: vProg A only · READ: anyone' on "write" (106.34)
1:46.9  [DIAGRAM] c1-provers IN → 1:52.1, state `c1-provers-entry` (tIn at the 106.90 word end, keeps the floor) → hand:xfade-scale (container-xfade, 0.35s)
1:47.1  SAY:  "And provers, for-profit operators, post a zero-knowledge proof back to Kaspa."
1:48.3  [DIAGRAM] c1-provers-operators 'for-profit operators' on "-profit" (108.30)
1:50.0  [DIAGRAM] c1-provers-launch ZK PROOF token launches on "zero" (110.02) (optional slide, left 1000 → 1150, y 560)
1:51.7  [DIAGRAM] c1-provers-landed token lands in KASPA L1 on "Kaspa" (111.66)
1:52.1  [CONTAINER] zk-math-receipt-s1 IN → 1:58.4 (paper-slip receipt card, resting) → hand:xfade-scale (container-xfade, 0.35s)
1:52.1  SAY:  "That's a math receipt that says the state is correct and Kaspa checks the receipt instead"
1:54.4  [CONTAINER] zk-math-receipt-s2 'STATE ROOT ... CORRECT' on "state" (114.36)
1:55.8  [CONTAINER] zk-math-receipt-s3 'CHECKED BY KASPA CONSENSUS' stamp on "checks" (115.80) (no SFX: the
        teaching floor stays quiet, fewer bigger hits)
1:57.3  SAY:  "of redoing the math."
1:58.2  [CONTAINER] zk-math-receipt-s4 'RE-EXECUTE THE MATH' struck on "math." (118.18)
1:58.4  [CONTAINER] sovereignty-card-s1 IN → 2:03.3 ('WHAT THE DESIGN BUYS YOU · 1 of 2' / 'SOVEREIGNTY', both → hand:xfade-scale (container-xfade, 0.35s)
        vProgs resting; 4.96 s) · [MUSIC] Bed B ramps back to nominal -29.1 on "And this buys you" (118.44), 1.0 s
1:58.4  SAY:  "And this buys you two things."
2:00.2  SAY:  "Sovereignty."
2:00.8  SAY:  "If another app breaks, yours keeps running."
2:01.5  [CONTAINER] sovereignty-card-s2 vPROG B cracks red 'BROKEN' on "breaks" (121.52)
2:02.5  [CONTAINER] sovereignty-card-s3 vPROG A 'RUNNING' green on "keeps" (122.50)
2:03.3  [DIAGRAM] composability-card IN → 2:10.4, state `composability-card-entry` ('2 of 2' / 'COMPOSABILITY' → hand:xfade-scale (container-xfade, 0.35s)
        lands with "composability" 123.56)
2:03.3  SAY:  "And composability."
2:04.3  SAY:  "Apps can read each other's state."
2:04.7  [DIAGRAM] composability-card-read read arrows cross on "read" (124.72)
2:05.8  SAY:  "And a transaction that touches two apps goes through as one unit or not at all."
2:06.1  [DIAGRAM] composability-card-tx one transaction bar spans both apps on "transaction" (126.06)
2:09.0  [DIAGRAM] composability-card-one-unit 'ONE UNIT' green, dimmed 'OR NOT AT ALL', on "unit" (129.02)
2:10.4  [RECEIPT] R5-a IN → 2:13.4, docs.kaspa.org/toccata 'Toccata Dev Guide' header + highlighted 'active on → hand:xfade-scale (container-xfade, 0.35s)
        mainnet as of June 30, 2026, at DAA score 474_165_565', R(other), subtle push `[VERIFY]`
2:10.4  SAY:  "And this just means the rules for checking all of this live inside of Kaspa's consensus"
2:13.4  [RECEIPT] R5-b IN → 2:17.6 on "inside" (133.44): 'What Toccata adds' table, highlighted 'ZK precompiles: → hand:xfade (container-xfade, 0.27s)
        direct verification of Groth16 and RISC Zero Succinct proofs inside script'; push-in lands on the
        highlight (receipt-to-receipt cross-fade, same page) `[VERIFY]`
2:14.5  [RECEIPT] R5-b push completes on "consensus" (134.52)
2:14.9  SAY:  "itself, not on some other chain."
```

## CH3 - WHERE IT STANDS (2:17.6-3:22.8, Bed C `fortitude`, CARD ON)
```
2:17.6  [CARD] CH3 title-card-ch3 'WHERE IT STANDS' · [IMPACT] DSGNImpt-single_impact_sound_-Elevenlabs.mp3 on
        the card's landing frame (same file as CH2 on purpose: the video's consistent card punctuation; tail
        1.16 s inside the 1.5 s pause) · [TRANSITION] same card pick as CH2 → hand:cube-3d (card, 0.37s). Pause 1.5 s,
        readable 1.13 s
2:17.6  [MUSIC] bed change B → C inside the pause: Bed B fade card+0.0 → +0.4 (file 133.86 → 134.26); breath
        +0.4 → +1.0; Bed C (file in 52.08, right-aligned so file 117.1 = spine 202.10) fades in +1.0 → +1.5 ·
        [DUCK] Bed C enters at gain -34.5 (-24 under), level ramp to nominal -32.5 arrives at 153.0
2:17.6  [IMAGE] IMG-1 ladder into the DAG sky IN → 2:19.8 (AI still ingress, badsignal or cross-warp → lib:badsignal-short-1 (glitch-still, 0.48s))
2:17.6  SAY:  "Now where does this all actually stand?"
2:19.8  [CHART] c3-ladder IN → 2:40.3, Type 1 ANIMATED (code, useCurrentFrame; the spec PNGs are not comp
        inputs), state `c3-ladder-empty`: header, legend, rails, 3 dim dashed future rungs; cross-fade + 0.93 → 1
        scale-in 12f (SPIN marquee candidate: image → chart, the new facet "where it stands") → lib:spin-3d-side-ease-up (SPIN-newfacet, 0.88s)
2:19.8  SAY:  "Look at this ladder."
2:20.7  [CHART] c3-ladder CRESCENDO rung grows (8f), progress rail 985 → 925, date '2025-05-05' on "May" (140.70)
2:20.7  SAY:  "May 2025, Crescendo."
2:22.7  [CHART] c3-ladder name CRESCENDO slides in on "Crescendo" (142.74)
2:23.6  [CHART] c3-ladder '10 BLOCKS / SEC' tag pops on "10" (143.64) → state `c3-ladder-crescendo`
2:23.6  SAY:  "10 blocks a second."
2:24.9  [CHART] c3-ladder YELLOW PAPER rung + rail to 795 + '2025-09-11' + 'vPROGS YELLOW PAPER' on "September" (144.92)
2:24.9  SAY:  "September, the yellow paper."
2:26.7  SAY:  "First draft."
2:27.0  [CHART] c3-ladder 'DRAFT v0.0.1' tag (gold) on "draft" (146.96) → state `c3-ladder-yellow-paper`
2:27.5  [CHART] c3-ladder TOCCATA rung + rail to 650 + '2026-06-30' on "June" (147.46) (no day-relative words)
2:27.5  SAY:  "June 30th of this year, Toccata."
2:29.5  [CHART] c3-ladder name TOCCATA slides in on "Toccata" (149.52)
2:30.5  [CHART] c3-ladder sub 'ZK verify + covenants' on "Zero" (150.54)
2:30.5  SAY:  "Zero-knowledge verification and covenants."
2:33.0  [CHART] c3-ladder 'LIVE ON MAINNET' pill pops + one glow pulse (18f) on "Live" (153.02) · [MUSIC] Bed C's
        9-plateau (file 68) starts as the level ramp reaches nominal -32.5: the swell IS the hit, no SFX ·
        [DUCK] the entry ramp ends here
2:33.0  SAY:  "Live on mainnet."
2:34.5  [CHART] c3-ladder sub '· inside Kaspa consensus' on "Inside" (154.54) → state `c3-ladder-toccata`
2:34.5  SAY:  "Inside Kaspa's consensus."
2:36.2  SAY:  "And September 2026, Silverscript 1.0."
2:36.3  [CHART] c3-ladder SILVERSCRIPT rung + rail to 500 + '2026-09-09' on "September" (156.28)
2:38.6  [CHART] c3-ladder 'SILVERSCRIPT 1.0' + 'smart contract language' on "Silverscript" (158.60) → state
        `c3-ladder-silverscript` (PAYOFF), then whole card drifts 1.00 → 1.03 to 160.34 `[VERIFY tag v1.0.0]`
2:40.3  [RECEIPT] R6 IN → 2:43.3, kaspanet/silverscript release v1.0.0 header (2026-09-09), R(other), subtle push → hand:xfade-scale (container-xfade, 0.35s)
        (chart → receipt cross-fade) `[VERIFY no newer tag]`
2:40.3  SAY:  "The smart contract language."
2:42.2  [RECEIPT] R6 'official release' highlight lands on "Official" (162.22)
2:42.2  SAY:  "Official release."
2:43.3  [DIAGRAM] c3-next-rungs IN → 2:49.8, state `c3-next-rungs-entry`: push-in match from c3-ladder's top
        (dashed rungs only, enlarged) → hand:xfade-scale (container-xfade, 0.35s)
2:43.3  SAY:  "Next rung."
2:44.3  SAY:  "The first standalone zero-knowledge app."
2:44.8  [DIAGRAM] c3-next-rungs-next 'NEXT: standalone based ZK apps' on "standalone" (164.78) (Sutton's term, not the VO's)
2:46.4  SAY:  "Above that, full vProgs."
2:47.2  [DIAGRAM] c3-next-rungs-full 'FULL vPROGS: in construction' on "full" (167.20)
2:48.6  SAY:  "Still under construction."
2:49.2  [DIAGRAM] c3-next-rungs-construction hazard-stripe 'UNDER CONSTRUCTION' tag on "construction" (169.20);
        'DAGKNIGHT: proposed (KIP-2)' stays dim, never spoken `[VERIFY KIP-2 still Proposed]`
2:49.8  [RECEIPT] R7 IN → 2:52.8, kaspa.org/build vProgs card ('In construction' / 'Full vProgs remain a future → hand:xfade-scale (container-xfade, 0.35s)
        direction' highlighted), R(other), push-in `[VERIFY status unchanged]`
2:49.8  SAY:  "And kaspa.org says so in plain text."
2:52.1  [RECEIPT] R7 push lands on "plain" (172.12)
2:52.8  [RECEIPT] R8 IN → 2:58.5, Kaspa Magazine 2025-12-17, the hard-fork timing paragraph (a distinct crop from → hand:xfade-scale (container-xfade, 0.35s)
        R4), R(article) two-stage: wide with the 2025-12-17 date first
2:52.8  SAY:  "And in December, Sompolinsky said the covenant fork was three to six months out."
2:55.7  [RISER] Riser Sound Effect-2s.wav starts at 175.66 (its peak sits at 2.00 s in, so the riser ENDS on the
        177.66 hit; measured tail after the peak 0.12 s), under the VO
2:56.3  [RECEIPT] R8 push-in completes on 'three to six months' on "three" (176.30) (page wording, in words)
2:57.4  [DUCK] Bed C vibe-cut duck 177.4 → 178.3, -4.2 dB relative (volume x0.617, the MUSIC-PLAN automation row)
2:57.6  SAY:  "It shipped in June."
2:57.7  [RISER→IMPACT] 'DELIVERED 2026-06-30' stamp slams onto the R8 corner on "shipped" (177.66, Mike APPROVED)
        + comp crash zoom on the stamp · [IMPACT] Impact_Hit_01-1.wav, file start 177.48 (peak 0.18 s in →
        177.66; weight 5; measured audible tail 4.74 s, so fade it 178.54 → 179.3, gone under "Everyone is
        racing"): the video's ONE vibe cut, the biggest hit of CH3
2:58.5  [VIDEO] BR-4 datacenter corridor dolly IN → 3:01.4 (Envato, muted, LEAD motion, slot = file 1.00-3.86;
        dissolve → hand:fade (broll-fade, 0.50s))
2:58.5  SAY:  "Everyone is racing to control compute and money."
3:01.0  [MUSIC] Bed C's own 9 → 8 step (file 96) eases the bed under the close · [DUCK] natural, no gain move,
        no SFX, so the hammer impacts at 184.76 / 186.30 / 187.72 read
3:01.4  [IMAGE] IMG-2 lone layer above towers IN → 3:04.8 (AI still ingress → lib:badsignal-max-1 (glitch-still, 0.76s))
3:01.4  SAY:  "The more they race, the more layer nobody owns is worth."
        (Whisper "layer" p 0.46, likely "the more a layer": ear check; under a cover, no caption impact)
3:04.8  [CONTAINER] pow-money-hammer-s1 IN → 3:08.6, 'PROOF OF WORK MONEY' on "Proof" (184.76), Kaspa K bug → hand:xfade-scale (container-xfade, 0.35s)
        bottom-right · [IMPACT] Kick_Impact_01-tight.wav, file start 184.58 (peak 0.18 s in; tail 0.14 s)
3:04.8  SAY:  "Proof of work money with apps on it and no L2 in the middle."
3:06.3  [CONTAINER] pow-money-hammer-s2 'WITH APPS ON IT' on "apps" (186.30) · [IMPACT] Kick_Impact_01-tight.wav,
        file start 186.12
3:07.7  [CONTAINER] pow-money-hammer-s3 'NO L2 IN THE MIDDLE' (green) on "L2" (187.72) · [IMPACT]
        Soundjay_Impact_Main_01-short.wav, file start 187.38 (peak 0.34 s in; tail 0.34 s): the heaviest of
        the three, echoing the CH1 slam on the same words
3:08.6  [CONTAINER] cta-engage-s1 IN → 3:15.1, 'BEFORE YOU GO', like glyph lit on "Click" (188.64) → hand:xfade-scale (container-xfade, 0.35s)
3:08.6  SAY:  "Click that like button and comment below."
3:10.0  [CONTAINER] cta-engage-s2 comment bubble lit on "comment" (190.04)
3:11.2  SAY:  "Let me know what you think is going to be built on it in the near future."
3:12.9  [CONTAINER] cta-engage-s3 'COMMENT: what gets built on vProgs?' on "built" (192.92) (no dates, guard 1)
3:15.1  [IMAGE] IMG-3 Kaspa coin sunrise IN → 3:17.0 (backwards-K from the reference mark; AI still ingress
        → lib:badsignal-short-2 (glitch-still, 0.48s))
3:15.1  SAY:  "Gonna be some exciting times."
3:16.5  SAY:  "And click the link in the description below for the greatest community ever."
3:17.0  [CONTAINER] end-card-community-s1 IN → 3:22.8 (Kaspa K logo, 'LINK IN THE DESCRIPTION' lower-third lit) → hand:xfade-scale (container-xfade, 0.35s)
3:17.5  [CONTAINER] end-card-community-s1 lower-third pulse on "link" (197.54), comp-level
3:19.8  [CONTAINER] end-card-community-s2 'the greatest community ever' on "community" (199.80), holds to the last frame
3:21.0  SAY:  "And I'll catch you guys later."
3:22.1  [MUSIC] Bed C epic_hit onset (file 117.1) on "later." (202.10), 0.25 s fade on the ring-out ending 202.822
        · [IMPACT] Impact_Hit_01-2-short.wav, file start 201.98 (peak 0.12 s in → 202.10; tail 0.42 s, done by
        202.52, before the end), a sub layer under the bed's own hit
3:22.8  [END] last frame 202.800 (audio 202.822): the end card covers through it, never black; CTA close as
        recorded (hard-out ruling still open in AS-RECORDED)
```

---
## SFX kit picks (measured 2026-09-28: 22.05 kHz mono decode, 20 ms RMS windows, tail = -40 dB below peak)
| file (video-creation/assets/sfx/...) | peak offset | audible after peak | used at |
|---|---|---|---|
| Impacts/Kick_Impact_01-short.wav | 0.18 s | 0.36 s | 0:00.0 hook |
| Impacts/Impact_Hit_01-2-18.wav | 0.12 s | 1.66 s | 0:37.9 NO L2 slam |
| Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3 | 0.02 s | 1.16 s | 0:40.2 CH2 card · 2:17.6 CH3 card |
| Riser Sound Effect-2s.wav (sfx root) | 2.00 s (end) | 0.12 s | 2:55.7 → 2:57.7 |
| Impacts/Impact_Hit_01-1.wav | 0.18 s | 4.74 s (faded 178.54-179.3) | 2:57.7 vibe cut |
| Impacts/Kick_Impact_01-tight.wav | 0.18 s | 0.14 s | 3:04.8 · 3:06.3 hammer |
| Impacts/Soundjay_Impact_Main_01-short.wav | 0.34 s | 0.34 s | 3:07.7 hammer payoff |
| Impacts/Impact_Hit_01-2-short.wav | 0.12 s | 0.42 s | 3:22.1 close |
Rejected for this video by tail: Impact_1/2/3 (3.1-3.3 s), Impact_Hit_01-2 / -3 full (5.3-6.2 s),
card-impact-hit01-3-short (2.12 s, overruns the 1.5 s pause), Soundjay full (1.96 s). 10 SFX events + 1 riser on
a 3:23 video; nothing on container swaps, b-roll cuts or face cuts (library transitions carry their own baked
SFX, ducked under the VO per comp-build §6).

## Orphan reconciliation (PRE-build, against `assets/` on disk 2026-09-28; all 84 checked files visual-qa PASS)
Source files (.html / .py / .css / .json) are exempt (comp-build §10). Every renderable file:

**PLACED:**
- Receipts x9 files (8 receipt beats): R1 0:07.3 · R2 0:14.5 · R3 0:40.2 · R4 1:13.0 · R5-a 2:10.4 ·
  R5-b 2:13.4 · R6 2:40.3 · R7 2:49.8 · R8 2:52.8.
- Video x4: BR-1 0:21.2 · BR-2 0:38.8 · BR-3 1:04.6 · BR-4 2:58.5.
- Images x3: IMG-1 2:17.6 · IMG-2 3:01.4 · IMG-3 3:15.1.
- Title slides x2: title-card-ch2 0:40.2 · title-card-ch3 2:17.6.
- Card slides x23 states: ten-bps-card 0:25.2 · execute-verify-flip-s1..s5 0:31.9-0:37.9 ·
  sompolinsky-name-card-s1/s2 1:07.8 / 1:12.4 · zk-math-receipt-s1..s4 1:52.1-1:58.2 ·
  sovereignty-card-s1..s3 1:58.4-2:02.5 · pow-money-hammer-s1..s3 3:04.8-3:07.7 · cta-engage-s1..s3
  3:08.6-3:12.9 · end-card-community-s1/s2 3:17.0 / 3:19.8.
- Diagrams (Type 2 stills) x33 states: vprog-loop-mini nodes/state/proof/landed · c2-l2-stack
  empty/chain/sequencer/bridge/liquidity/pieces · c1-overview dim/users/reads/writes/kaspa/orders ·
  c1-kaspa-four-jobs orders/stores/checks/meters/execute/dropped · c1-vprog-nodes entry/nodes/accounts/lock ·
  c1-provers entry/operators/launch/landed · composability-card entry/read/tx/one-unit · c3-next-rungs
  entry/next/full/construction.
- Chart c3-ladder: PLACED as the code-built Type 1 animation 2:19.8-2:40.3, built to `c3-ladder.spec.md`.

**REJECTED as comp inputs (spec only):** charts/c3-ladder-empty.png · c3-ladder-crescendo.png ·
c3-ladder-yellow-paper.png · c3-ladder-toccata.png · c3-ladder-silverscript.png are the chart-builder DESIGN
SPEC; the comp animates them in code (comp-build §7 forbids holding a chart PNG). c3-ladder-silverscript.png
stays BENCH for reveal-a-bitmap only if the component jitters.

**REJECTED (sources, not comp inputs):** vid/_src/BR-1-src.mov · BR-2-src.mp4 · BR-3-ice-glow-cracks-src.mp4 ·
BR-4-src.1080.mp4 (pre-trim sources of the placed clips) · vid/_src/BR-3-src.1080.mp4 (round-1 floes clip,
failed visual-qa, licensed and unused).

**BENCH (not acquired, named in COVER-PLAN):** Envato 'server rack nodes blinking' 1:40.4-1:42.3 · 'receipt
printer' 1:52.1-1:55.4 · 'crowd cheering' 3:08.6-3:11.2; ChatGPT slots 4-5 of 5 unused. No unplaced
acquisition exists in `assets/`.
