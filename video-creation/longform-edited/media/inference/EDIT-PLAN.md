# inference - EDIT-PLAN  (time-ordered EVENT LOG, pre-build blueprint)

> AUTHORED by edit-plan-author off the graph's seed `_previews/EDIT-PLAN.seed.md` (gen_editplan.py) + AS-RECORDED.md +
> `spine/ALL.d.desilenced.medium-words.json` + COVER-PLAN.json + MUSIC-PLAN.json + SCREENPLAY.md 🎬 `[SHOW]` device lines +
> `spine/jumpcuts-final.json` + the built assets (format: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §1;
> per the §0 ORDER note the comp is built TO this log, the render confirms it).
> Watch file: `spine/ALL.d.desilenced.mp4` (190.40 s / 3:10.4, 30 fps, Adobe-enhanced audio). Timecodes = FINAL-spine
> seconds, PRE-PAUSE. The only timeline shifter is the CLIP-3 insert (5.1 s spine pause at 2:51.3, baked by
> `bake_clip_insert.py`); everything after it routes through `sh()` at comp. No title cards (one continuous bed, Mike
> 2026-10-25), so no card pauses. Never re-apply a chain shift to these numbers.
> Transition ids are RESOLVED from TRANSITION-PLAN.json (transition-strategist, next node).
> SFX: every sound is named by catalog id + file + mood_class with its FILE START (= event time minus the device offset
> from `assets/effects/library.json` / `assets/sfx/kinetic-text/library.json`). ONE sound per event, never two stacked.
> Music + SFX are an ffmpeg post-mix (`mix_music.py`, comp-build §9), never in the comp.
> Captions: ON over FACE windows ONLY, never over a cover, and OFF for the hold of every keyword pop / band / button that
> sits in the caption zone (overlays.md section 2).
> Sub-point spotlight rows: no `assets/diagrams/_state-cues.md` or `assets/charts/*.spec.md` was written for this video,
> so every state row is cued from the state PNG names (`<id>-<state>.png`, `-s1..s3`) + the COVER-PLAN word cues, at the
> word onsets of the spine word JSON. Charts (quantization-memory, thinking-tokens) ANIMATE IN CODE; their PNG states are
> the design spec the code matches at each cue (comp-build §7).
> ZERO ORPHANS: every file in `assets/` (vid, img, receipts, clip-inserts, charts, diagrams, card-slides) is PLACED below
> with a timecode; nothing is BENCH or REJECTED (see the reconciliation at the end). `title-slides/` is empty by design.
> Container theme LIGHT (Mike 2026-10-25). Accent cyan #00c2ff (containers #006A9E), one look for the whole video.

## CH1 - WHAT INFERENCE IS (0:00.0-0:27.6, Bed A `story-of-my-life`, card OFF)
```
0:00.0  [MUSIC] Bed A `story-of-my-life` (Bobo Renthlei, instrumental 3:02) STARTS, the ONE bed of the video, src_in 2.526
        (bar 1), aggressive, seat -27.7 dB (-17 under VO), no fade-in, loop region 121.26-141.47 x1, end-pinned → 3:10.4
0:00.0  [FACE] F1 opens ON face → 0:06.5  "So every AI model gets trained once and everything anyone does with it afterwards is inference."
0:00.0  [TRANSITION] → hand:kt-whip-cut (face-cut, 0.73s) kt-signature-open WHIP-IN onto the face (kt-whip-cut, the open's 0.73 s whip-zoom with the 25 to 0 degree
        roll; no cut-in, the video opens here) + slow 5 percent push over the line (kt-signature-open)
0:00.0  [WHOOSH] swoosh-4 (assets/sfx/kinetic-text/swoosh-4.mp3, mood_class neutral, attack 0.23 s) file start 0:00.0 ·
        [MUSIC] HARD HIT 1 (MUSIC-PLAN t 0.0): the whip lands on the bed's bar-1 downbeat (file 2.553), mid-level build
0:00.0  [CAPTION] ON → 0:02.0 (F1; OFF from the TRAINING label to the cut, the labels hold)
0:00.0  SAY:  "So every AI model gets trained once and everything anyone does with it afterwards is inference."
0:02.0  [KT-POP] signature label A "TRAINING", right third, house accent, ON "trained" (1.98), kt-keyword-pop motion, holds to 0:06.5 ·
        [ACCENT] cash-register (kinetic-text/cash-register.wav, mood_class neutral) file start 0:01.8 (0.17 s before the label)
0:02.9  [PUNCH-IN] F1 hard ~15-20% step ON the desilencer join 2.867 (jumpcuts-final.json, frame 86) → holds to 0:06.5
0:02.9  [LIGHTLEAK] F1 library light leak ON the same join 2.867 (lib:lightleaks-*, the video's set) → lib:lightleaks-short-6 (punch-leak, 0.40s) (punch-leak)
0:06.1  [KT-POP] signature label B "INFERENCE" stacked under label A, ON "inference" (6.10), holds to 0:06.5 ·
        [WHOOSH] wooden-rattle-whoosh (kinetic-text/wooden-rattle-whoosh.wav, mood_class neutral, attack 0.27 s) file start 0:05.8
0:06.5  [TRANSITION] face→cover F1 out = kt-signature-open WHIP-OUT (kt-whip-cut blur-in variant) onto BR-1 → hand:kt-whip-cut (face-cut, 0.17s)
0:06.5  [VIDEO] BR-1 IN (3.2 s → 0:09.7) GPU training cluster / data-center aisle, slow dolly, whip-zoom in ·
        [WHOOSH] ea-glitch-21 (kinetic-text/ea-glitch-21.mp3, mood_class neutral, attack 0.86 s) file start 0:05.6, peak ON the cut
        (the tech b-roll cut owns this event's one sound; the whip-out takes no second whoosh)
0:06.8  SAY:  "Training is the model learning on its weights from data one time and it costs millions."
0:07.3  [KT-POP] kt-headline-over-broll "TRAINED ONCE" mid-frame, 0.8 s after the cut, holds to 0:09.7 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral, attack 0.0) file start 0:07.3
0:07.5  [MUSIC] HARD HIT 2 (MUSIC-PLAN t 7.45): the bed's build turns into its peak segment (file 10.0) one second after the
        whip, the energy arrives with the first b-roll. The bed IS the hit: no SFX layered (the cut's ea-glitch-21 already sounded)
0:09.7  [CONTAINER] c2-training IN (2.3 s → 0:11.9) C2 state 1, LIGHT: TRAINING column ONCE / LEARNS THE WEIGHTS / COSTS
        MILLIONS (no figure), fills the frame, quiet swap (hand:xfade-scale → hand:xfade-scale (container-xfade, 0.35s))
0:11.9  [TRANSITION] cover→face cut-in F2, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] fast-reverse-1 (kinetic-text/fast-reverse-1.wav, mood_class neutral, attack 0.40 s) file start 0:11.5
0:11.9  [FACE] F2 IN → 0:16.9  "Inference is those frozen weights running against brand new input on every single request."
0:11.9  [CAPTION] ON → 0:15.8 (F2 is 4.97 s; captions run until the EVERY REQUEST pop takes the caption zone)
0:12.1  SAY:  "Inference is those frozen weights running against brand new input on every single request."
0:15.5  [PUNCH-IN] F2 hard ~15-20% step ON the desilencer join 15.5 (frame 465) → holds to 0:16.9
0:15.5  [LIGHTLEAK] F2 library light leak ON the same join 15.5 → lib:lightleaks-soft-short-3 (punch-leak, 0.40s) (punch-leak)
0:15.8  [KT-POP] kt-keyword-pop PUNCH variant "EVERY REQUEST", accent red with glow, Zoom Bounce, ON "every" (15.80), held to the cut ·
        [ACCENT] punch-1-2023 (kinetic-text/punch-1.mp3, mood_class neutral) file start 0:15.6 (onset ON the first frame)
0:16.9  [TRANSITION] face→cover F2 out, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral, attack 0.34 s) file start 0:16.6
0:16.9  [IMAGE] IMG-1 IN (1.7 s → 0:18.6) press camera flashes aimed at a glowing GPU training cluster, no text, no logos
        (AI still ingress = glitch bucket → hand:kt-whip-cut (face-cut, 0.37s))
0:17.0  SAY:  "Training makes the headlines."
0:18.6  [CONTAINER] c2-contrast IN (3.8 s → 0:22.4) C2 state 2 base: TRAINING dimmed vs INFERENCE lit, rows unlit, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
0:18.7  SAY:  "Inference is the bill, the latency, and the part you actually operate."
0:19.6  [CONTAINER] c2-contrast-s1 spotlight: THE BILL lights ON "bill" (19.64)
0:20.3  [CONTAINER] c2-contrast-s2 spotlight: THE LATENCY lights ON "latency" (20.34)
0:21.3  [CONTAINER] c2-contrast-s3 spotlight: THE PART YOU OPERATE lights ON "part" (21.30)
0:22.4  [VIDEO] BR-2 IN (2.9 s → 0:25.3) calm plate, chat UI streaming an answer / quiet rack LEDs, whip-zoom in ·
        [WHOOSH] swoosh-3 (kinetic-text/swoosh-3.wav, mood_class neutral, attack 0.40 s) file start 0:22.1 (calm b-roll cut)
0:22.5  SAY:  "By some estimates, up to 90% of a model's life is inference."
0:24.4  [KT-POP] kt-headline-over-broll "UP TO 90%" mid-frame ON "90" (24.36), code-rendered text, holds to 0:25.3 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 0:24.4
0:25.3  [RECEIPT] C17 IN (2.2 s → 0:27.6) IBM Research AI-inference-explained paragraph, real pixels, the line read out · → hand:xfade-scale (container-xfade, 0.35s)
        treatment: highlight (settling push, no pan)
0:25.4  [HIGHLIGHT] C17 highlighter wipe on "up to 90% of an AI-model's life is spent in inference mode", ON "a model's life" (25.40)
0:27.3  [DUCK] bed relative -2.2 dB (ramp 0.5 s), CH2 seat -29.9 dB = -18 under (file 30.13-69.61 at -10.2 LUFS); the window runs
        past the end on purpose (cumulative with the CH4 / CH5 windows, no ramp back up)
```

## CH2 - ONE REQUEST (0:27.6-1:07.1, Bed A continues, card OFF)
```
0:27.6  [MUSIC] Bed A continues, NO breath, NO bed change (one placement; mix_music.py merges the chapter rows), subtle, -18 under
0:27.6  [TRANSITION] CH2 chapter whip (kt-whip-cut, chapter level) onto BR-3 → hand:kt-whip-cut (chapter-whip, 0.37s) ·
        [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral, attack 0.29 s) file start 0:27.3
0:27.6  [VIDEO] BR-3 IN (3.1 s → 0:30.6) hands typing a prompt into a chat box, shallow focus
0:27.6  SAY:  "Your request never reaches the model as text."
0:30.6  [DIAGRAM] tokenizer-split-text IN (3.0 s → 0:33.6) LIGHT: the whole sentence "Your request never reaches the model as text." → hand:xfade-scale (container-xfade, 0.35s)
        on screen, quiet swap; right half left clear for the paper panel
0:30.7  SAY:  "A tokenizer turns it into IDs and the tokens are what you get billed for."
0:31.5  [DIAGRAM] tokenizer-split-split spotlight: the sentence splits into 9 coloured token chunks ON "turns" (31.46)
0:32.4  [DIAGRAM] tokenizer-split-ids spotlight: each chunk drops its REAL o200k_base ID ON "IDs" (32.38): Your 9719 · request 2616 ·
        never 3779 · reaches 42373 · the 290 · model 2359 · as 472 · text 2201 · . 13 (COVER-PLAN, Mike 2026-10-26)
0:32.4  [KT-PANEL] kt-side-panel PAPER, RIGHT: "TOKEN IDS" / "BILLED PER TOKEN" + [KT-ICON] TOKEN icon slides up from the bottom
        edge into the panel, riding the panel's sound · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral)
        file start 0:32.1 (0.267 s before the panel's first frame)
0:33.6  [RECEIPT] C8 IN (1.8 s → 0:35.4) Anthropic pricing table header "Base input tokens" / "Output tokens" + two $ / MTok rows, → hand:xfade-scale (container-xfade, 0.35s)
        real pixels, no price spoken, flash under 2 s · treatment: push
0:35.4  [DIAGRAM] C1-rest IN (9.1 s → 0:44.5) C1 full frame, LIGHT, THE system-design diagram of the video (shown ONCE):
        PROMPT -> TOKENIZER -> TOKEN IDS -> PREFILL -> KV CACHE -> DECODE loop -> NEXT TOKEN -> STOP, TTFT / TPOT brackets;
        quiet swap, no pop, the bed carries it
0:35.4  [TRANSITION] C8 pricing receipt → C1-rest, the marquee reveal of THE diagram on "Step 1. Prefill." → lib:spin-corner-bounce-rb (SPIN-newfacet, 0.92s)
0:35.4  SAY:  "Step 1. Prefill."
0:36.4  [DIAGRAM] C1-prefill spotlight: PREFILL lights, the prompt tokens enter at once ON "Prefill" (36.42), compute-bound label lit
0:37.2  SAY:  "The GPU reads your whole prompt at once and stores the keys and the values in every token in memory."
0:43.1  SAY:  "That's the KV cache."
0:43.6  [DIAGRAM] C1-kvcache spotlight: KV CACHE fills and lights ON "KV" (43.62)
0:44.5  [VIDEO] BR-4 IN (2.1 s → 0:46.5) graphics card fans spinning hard, close-up, no brand ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 0:44.1
0:44.5  SAY:  "The chip is working flat out."
0:46.5  [CONTAINER] prefill-compute-bound IN (1.6 s → 0:48.1) PREFILL = COMPUTE-BOUND, meter pinned full, source line "vLLM docs" → hand:xfade-scale (container-xfade, 0.35s)
        (never NVIDIA), quiet swap
0:46.6  SAY:  "Prefill is compute-bound."
0:48.1  [DIAGRAM] c1-decode-spotlight-step IN (5.4 s → 0:53.5) zoomed KV CACHE -> DECODE -> NEXT TOKEN loop, one token appends → hand:xfade-scale (container-xfade, 0.35s)
        per loop (its own asset, so C1 is not shown twice), quiet swap
0:48.2  SAY:  "Step 2. Decode."
0:49.7  SAY:  "One token per step and every step reloads that whole cache."
0:51.9  [DIAGRAM] c1-decode-spotlight-reload spotlight: the cache-to-decode arrow pulses (the reload) ON "reloads" (51.88)
0:53.5  [DIAGRAM] one-token-chain-start IN (4.6 s → 0:58.0) the first token block alone, label ONE TOKEN AT A TIME, WITHIN ONE
        REQUEST, quiet swap (label true for can / can't alike)
0:53.5  [TRANSITION] c1-decode-spotlight-reload → one-token-chain-start on "you can't skip ahead" → lib:melt-equidistant-short-3 (MELT-transform, 0.44s)
0:53.6  SAY:  "Within one request, you can't skip ahead."  (Whisper hears "can"; Mike ruled "can't" at GATE plan, captions say "can't")
0:56.2  [DIAGRAM] one-token-chain-mid spotlight: the chain grows one block, each arrowed from the previous, ON "Each" (56.16)
0:56.2  SAY:  "Each token depends on the last."
0:57.5  [DIAGRAM] one-token-chain-payoff spotlight: the full chain, the newest block lit, ON "last" (57.50)
0:58.0  [VIDEO] BR-5 IN (1.8 s → 0:59.9) RAM modules macro, slow rack focus ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 0:57.7
0:58.2  SAY:  "The chip is waiting on memory."
0:59.9  [RECEIPT] C13 IN (1.4 s → 1:01.3) vLLM docs, Chunked Prefill: "compute-bound (prefill) and memory-bound (decode)", the line → hand:xfade-scale (container-xfade, 0.35s)
        read out · treatment: highlight (short settle, then the wipe)
0:59.9  SAY:  "Decode is memory-bound."
1:00.6  [HIGHLIGHT] C13 highlighter wipe on "memory-bound (decode)" ON "memory" (60.56)
1:01.3  [TRANSITION] cover→face cut-in F3, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 1:01.0;
        [KT-ICON] CLOCK icon slides UP onto the chest riding this whoosh-4 (no sound of its own), held to the cut
1:01.3  [FACE] F3 IN → 1:06.9  "Those are the two numbers you feel. Time to first token is prefill. Time per output token is decode."
        face lifted 85 px so the head clears the band
1:01.3  [CAPTION] ON → 1:03.2 (F3; OFF for the band hold from 1:03.2 to the cut)
1:01.3  SAY:  "Those are the two numbers you feel."
1:02.7  [PUNCH-IN] F3 hard ~15-20% step ON the desilencer join 62.733 (frame 1882) → holds to 1:06.9
1:02.7  [LIGHTLEAK] F3 library light leak ON the same join 62.733 → lib:lightleaks-short-7 (punch-leak, 0.40s) (punch-leak)
1:03.0  SAY:  "Time to first token is prefill."
1:03.2  [KT-BAND] kt-lower-third-band rises (0.27 s) at 63.17 · [WHOOSH] swoosh-4 (kinetic-text/swoosh-4.mp3, mood_class neutral)
        file start 1:02.8 (0.34 s before the band moves)
1:03.3  [KT-BAND] band text 1 "TIME TO FIRST TOKEN = PREFILL" pops ON "first" (63.30) ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 1:03.3
1:04.9  SAY:  "Time per output token is decode."
1:05.5  [KT-BAND] text_swap: text 2 "TIME PER OUTPUT TOKEN = DECODE" ON "output" (65.46), text 1's one-frame drop silent ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 1:05.5; band + face cut under the CH3 whip
1:06.9  [TRANSITION] face→cover F3 out = CH3 chapter whip (kt-whip-cut, chapter level) → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral) file start 1:06.6
1:06.9  [IMAGE] IMG-2 IN (0.8 s → 1:07.7) industrial control console with four big chrome levers, no text; covers the 0.8 s black
        gap that holds the ad-lib (AI still ingress = glitch bucket → hand:kt-whip-cut (face-cut, 0.37s))
```

## CH3 - THE LEVERS (1:07.1-1:53.2, Bed A continues, card OFF)
```
1:07.1  [MUSIC] Bed A continues, no breath, no change; File 69.63-115.75 at -10.3 LUFS, the -29.9 dB seat holds (-18 under)
1:07.1  SAY:  "The levers."
1:07.7  [TRANSITION] cover→face cut-in F4, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] fast-reverse-5 (kinetic-text/fast-reverse-5.wav, mood_class neutral, attack 0.51 s) file start 1:07.2
1:07.7  [FACE] F4 IN → 1:10.3  "Here are the four levers that make that fast and cheap."  (2.5 s, no interior join = no punch, no leak)
1:07.8  SAY:  "Here are the four levers that make that fast and cheap."
1:08.3  [KT-POP] kt-keyword-pop "4 LEVERS" ON "four" (68.26), held to the cut (captions OFF, F4 carries none) ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 1:08.3
1:10.3  [TRANSITION] face→cover F4 out: kt-list-card C3 slides in from the RIGHT over everything → hand:kt-list-card (face-cut, 0.30s) (kt-list-card) ·
        [WHOOSH] fast-swoosh (kinetic-text/fast-swoosh.wav, mood_class neutral) file start 1:10.1 (onset 0.014 s before the card moves)
1:10.3  [CONTAINER] C3 IN (1.7 s → 1:12.0) the paper list card, shown ONCE as the overview: CONTINUOUS BATCHING / CACHING /
        QUANTIZATION / SPECULATIVE DECODING, items hover
1:10.6  [KT-CARD] C3 item 1 CONTINUOUS BATCHING pops lit ON "Continuous" (70.56) ·
        [ACCENT] ting (kinetic-text/ting.mp3, mood_class neutral) file start 1:09.8 (0.80 s before the item, clip trimmed ~0.9 s)
1:10.6  SAY:  "Continuous batching."
1:12.0  [DIAGRAM] batching-lane-lane IN (3.9 s → 1:15.9) the GPU batch lane, label 1 / 4 CONTINUOUS BATCHING, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
1:12.0  SAY:  "Requests join and leave mid-flight so the GPU never idles."
1:12.5  [DIAGRAM] batching-lane-swap spotlight: request bars join and leave mid-flight ON "join" (72.48)
1:14.9  [DIAGRAM] batching-lane-full spotlight: the lane never empty, ON "never" (74.86); no multiplier shown
1:15.9  [RECEIPT] C11 IN (4.3 s → 1:20.2) arXiv 2309.06180 abstract page (title with PagedAttention), crop above the 2-4x line; → hand:xfade-scale (container-xfade, 0.35s)
        the line reads "near zero" off it · treatment: highlight (settling push to the title, no pan)
1:15.9  SAY:  "Caching. PagedAttention."
1:17.8  SAY:  "Cut wasted cache memory to near zero and a shared prompt prefix is computed once."
1:19.3  [HIGHLIGHT] C11 highlighter wipe on "near-zero waste in KV cache memory" ON "near" (79.30)
1:20.2  [DIAGRAM] prefix-cache-rest IN (3.1 s → 1:23.3) two requests, one PREFIX block, each with its own short suffix, label 2 / 4 → hand:xfade-scale (container-xfade, 0.35s)
        CACHING, quiet swap
1:21.1  [DIAGRAM] prefix-cache-shared spotlight: the shared PREFIX block lights, COMPUTED ONCE, ON "prefix" (81.10)
1:23.3  [CHART] quantization-memory IN (5.3 s → 1:28.6) animated in code to the -start design state (16-bit bar 29.0 GB), label
        3 / 4 QUANTIZATION, source line Hugging Face octocoder example, memory only, NO speed multiplier
1:23.3  [TRANSITION] prefix-cache-shared → quantization-memory chart on "Quantization." → lib:spin-corner-bounce-short-lb (SPIN-newfacet, 0.44s)
1:23.3  SAY:  "Quantization."
1:24.0  [CHART] quantization-memory-mid state: the 8-bit bar 15.2 GB grows ON "8-bit" (83.98)
1:24.0  SAY:  "8-bit halves the weights, 4-bit quarters them so it fits a smaller card."
1:25.5  [CHART] quantization-memory-payoff state: the 4-bit bar 9.5 GB ON "4-bit" (85.48); the small-card outline the 4-bit bar
        fits under draws ON "smaller" (87.62)
1:28.6  [DIAGRAM] speculative-decoding-rest IN (6.3 s → 1:34.9) small model + big model, label 4 / 4 SPECULATIVE DECODING, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
1:28.7  SAY:  "Speculative decoding."
1:30.0  SAY:  "A small model drafts."
1:30.8  [DIAGRAM] speculative-decoding-draft spotlight: the small model writes 4 draft tokens ON "drafts" (90.76)
1:31.6  SAY:  "The big one verifies in one pass."
1:32.1  [DIAGRAM] speculative-decoding-verify spotlight: the big model checks all 4 in one pass ON "verifies" (92.14)
1:34.2  [DIAGRAM] speculative-decoding-same spotlight: SAME OUTPUT stamps ON "Same" (94.16); no 2-3x
1:34.2  SAY:  "Same output."
1:34.9  [VIDEO] BR-6 IN (3.0 s → 1:37.9) GPU server rack push-in, whip-zoom in ·
        [WHOOSH] ea-glitch-21 (kinetic-text/ea-glitch-21.mp3, mood_class neutral, attack 0.86 s) file start 1:34.0, peak ON the cut
1:35.0  SAY:  "All of that lives in the inference engine."
1:36.7  [KT-POP] kt-headline-over-broll two-line: "THE INFERENCE ENGINE" (accent) over "vLLM · SGLang · TensorRT-LLM · Ollama ·
        llama.cpp" (white, smaller) ON "engine" (96.68), holds to 1:37.9 · [ACCENT] knock-pop (kinetic-text/knock-pop.wav,
        mood_class neutral) file start 1:36.7
1:37.9  [DIAGRAM] engines-datacenter-rest IN (3.9 s → 1:41.8) REQUEST -> INFERENCE ENGINE -> GPU, names dim, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
1:38.0  [DIAGRAM] engines-datacenter-vllm spotlight: vLLM lights ON "vLLM" (98.02)
1:38.0  SAY:  "vLLM, SGLang, TensorRT-LLM, on a laptop, Ollama, and llama.cpp."
1:38.9  [DIAGRAM] engines-datacenter-sglang spotlight: SGLang lights ON "SGLang" (98.88)
1:40.1  [DIAGRAM] engines-datacenter-trtllm spotlight: TensorRT-LLM lights ON "TensorRT-LLM" (100.08)
1:41.8  [DIAGRAM] engines-laptop-rest IN (3.2 s → 1:45.1) the flow on a LAPTOP outline (generic, not Mike's hardware), quiet swap
1:41.8  [TRANSITION] engines-datacenter → engines-laptop-rest on "on a laptop" → lib:melt-equidistant-short-1 (MELT-transform, 0.44s)
1:43.0  [DIAGRAM] engines-laptop-ollama spotlight: Ollama lights ON "Ollama" (102.96), localhost:11434
1:44.0  [DIAGRAM] engines-laptop-llamacpp spotlight: llama.cpp lights as its backend ON "llama.cpp" (104.00)
1:45.1  [VIDEO] BR-7 IN (3.7 s → 1:48.8) API request log scrolling on a monitor, translates left under the panel
1:45.1  [KT-PANEL] kt-side-panel PAPER, RIGHT, entering WITH the cut (C16 state 1): "HOSTED" / "PAY PER TOKEN" / "THEIR GPU" ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 1:44.8 (the cut and the panel share this one sound)
1:45.2  SAY:  "Hosted. You pay per token and the vendor runs the GPU."
1:48.8  [TRANSITION] cover→face cut-in F5, kt-whip-cut, the face shifts RIGHT → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 1:48.4
1:48.8  [FACE] F5 IN → 1:53.1  "Self-hosted. You pay for the card and that pays off when the card stays busy."  (4.3 s, no caption)
1:48.9  [KT-PANEL] kt-side-panel DARK, LEFT (C16 state 2, the pair to HOSTED): "SELF-HOSTED" / "PAY FOR THE GPU" / "YOUR MODEL,
        YOUR ENGINE", hovering, held to the CH4 whip, ON "Self-hosted" (108.90) · [WHOOSH] swoosh-2 (kinetic-text/swoosh-2.wav,
        mood_class neutral) file start 1:48.8 (0.07 s before the panel moves; the text rise 0.23 s later is silent)
1:48.9  SAY:  "Self-hosted. You pay for the card and that pays off when the card stays busy."
1:49.5  [PUNCH-IN] F5 hard ~15-20% step ON the desilencer join 109.533 (frame 3286), face layer only, panel untouched → holds to 1:53.1
1:49.5  [LIGHTLEAK] F5 library light leak ON the same join 109.533 → lib:lightleaks-7 (punch-leak, 1.12s) (punch-leak)
1:53.0  [DUCK] bed relative -1.4 dB (ramp 0.5 s), CH4 seat -31.3 dB = -18 under (file 115.73-141.47 at -8.5 LUFS, second loop pass
        121.26-130.43 at -9.5, about -8.8 combined); window runs past the end on purpose
1:53.1  [TRANSITION] face→cover F5 out = CH4 chapter whip (kt-whip-cut, chapter level) → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral) file start 1:52.8
1:53.1  [VIDEO] BR-8 IN (3.8 s → 1:56.9) video editing timeline on a workstation monitor, playhead moving, no headline
```

## CH4 - WE DO THIS EVERY DAY (1:53.2-2:28.1, Bed A continues, card OFF)
```
1:53.2  [MUSIC] Bed A continues, no breath, no change; first loop seam at 2:18.9 (bar 56 back to bar 48, on a cover)
1:53.2  SAY:  "Now with me, I run an AI pipeline and edit videos just like this one."
1:56.9  [DIAGRAM] my-pipeline-rest IN (2.9 s → 1:59.8) RECORDING -> WHISPER (SELF-HOSTED, MY OWN GPU) -> AI AGENTS (HOSTED, → hand:xfade-scale (container-xfade, 0.35s)
        CLAUDE) -> VIDEO, no hardware named, quiet swap
1:57.4  SAY:  "So here's what inference looks like in practice."
1:58.1  [DIAGRAM] my-pipeline-inference spotlight: both inference nodes light ON "inference" (118.12)
1:59.8  [RECEIPT] C4 IN (6.2 s → 2:06.0) editor view of video-creation/shorts/_tooling/whisper_jobs.py, line 1 + lines 122-133 → hand:xfade-scale (container-xfade, 0.35s)
        only (the docstring lines naming the card are NOT in the crop), shown as the real code file ·
        treatment: pan · [MOTION] lib:motion-3d-pan-1-left (the picture drifts left, clear of the paper panel)
1:59.8  [KT-PANEL] kt-side-panel PAPER, RIGHT, entering WITH the cut: "SELF-HOSTED" / "WHISPER MEDIUM" / "MY OWN GPU" +
        [KT-ICON] CHIP / GPU icon slides LEFT in from the right edge into the panel, riding the same sound ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 1:59.5 (cut + panel + icon, one sound)
1:59.9  SAY:  "Every clip I transcribe runs OpenAI Whisper on my own GPU."
2:04.6  SAY:  "Self-hosted inference."
2:06.0  [RECEIPT] C5 IN (3.3 s → 2:09.3) real terminal, sweep.log line "[whisper_jobs] medium.en loaded on cuda in 14.2s (77 job(s))", → hand:xfade-scale (container-xfade, 0.35s)
        no nvidia-smi, the log's own number; quiet cut · treatment: push (to the "14.2s" figure)
2:06.1  SAY:  "Loading the model costs around 15 to 20 seconds."
2:09.3  [DIAGRAM] load-once-load IN (3.6 s → 2:12.9) ONE model-load block, LOAD ONCE, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
2:09.4  SAY:  "So my pipeline loads it once and runs every clip through it."
2:11.6  [DIAGRAM] load-once-run spotlight: clip jobs stream through the loaded block, RUN EVERY CLIP, ON "runs" (131.58); no job count
2:12.9  [IMAGE] IMG-3 IN (1.9 s → 2:14.8) an unbranded GPU glowing orange-hot like metal fresh from a forge, sparks
        (AI still ingress = glitch bucket → lib:roughly-4x (glitch-still, 0.52s))
2:12.9  SAY:  "Keep the weights hot, batch the work."
2:14.8  [RECEIPT] C6 IN (2.4 s → 2:17.2) video-creation/longform-edited/graph/common.py lines 446-448 + 484-487 (def spawn_agent, the
        claude -p --agent command, the spawning print), shown as the real code file · treatment: pan ·
        [MOTION] lib:motion-3d-pan-2-right (a different move from C4's) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 2:14.4
2:14.8  SAY:  "And every agent in my pipeline spawns around 20 per video is a Claude session billed per token."
2:17.2  [RECEIPT] C7 IN (3.5 s → 2:20.7) terminal `ls video-creation/longform-edited/graph/data/ | grep growth-vs-product`, the 20 → hand:xfade-scale (container-xfade, 0.35s)
        longform-lane agent logs, cut ON "around" (137.24) · treatment: push (to the listing; never "hundreds")
2:17.2  [KT-PANEL] kt-side-panel PAPER, RIGHT, entering WITH the cut: "HOSTED" / "CLAUDE, BILLED PER TOKEN" + [KT-ICON] DOLLAR icon
        slides up from the bottom edge into the panel, riding the same sound · [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3,
        mood_class neutral) file start 2:16.9
2:18.9  [MUSIC] loop seam 1 (8-bar region 121.26-141.47, aloop x1), on a cover, inaudible by design; check at the draft gate
2:20.7  [IMAGE] IMG-4 IN (1.3 s → 2:21.9) a distant cloud data center glowing at night across a dark plain, no text
        (AI still ingress = glitch bucket → lib:roughly-2x (glitch-still, 0.36s))
2:20.7  SAY:  "Hosted inference."
2:21.9  [TRANSITION] cover→face cut-in F6, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] fast-reverse-1 (kinetic-text/fast-reverse-1.wav, mood_class neutral) file start 2:21.5
2:21.9  [FACE] F6 IN → 2:27.7  "I have never trained a model. Everything my pipeline does is AI inference."
        (no punch-in: its only join 147.5 sits inside the 0.5 s edge margin; captions OFF, the pop holds the whole window)
2:21.9  [DUCK] HARD HIT 3 (MUSIC-PLAN t 141.93): bed LIFTS relative +1.5 dB (ramp 0.3 s, -16.5 under) for FACE 6 → 2:27.7, back to
        the seat before the first CH5 word. The conviction beat of the video: the bed lift + the punch pop carry it, no kit impact
        stacked on the pop (one sound per event)
2:22.1  SAY:  "I have never trained a model."
2:22.4  [KT-POP] kt-keyword-pop PUNCH variant "NEVER TRAINED A MODEL", white with drop shadow, ON "never" (142.42), held through the
        pair, cut under the CH5 whip · [ACCENT] punch-sound-effect (kinetic-text/punch-sound-effect.mp3, mood_class neutral,
        attack 0.99 s) file start 2:21.5 (onset 0.02 s before the text)
2:24.2  SAY:  "Everything my pipeline does is AI inference."
2:27.7  [TRANSITION] face→cover F6 out = CH5 chapter whip (kt-whip-cut, chapter level) → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] swoosh-8 (kinetic-text/swoosh-8.wav, mood_class neutral) file start 2:27.4
2:27.7  [VIDEO] BR-9 IN (2.4 s → 2:30.1) abstract neural-network light streams, fast, whip-zoom in
2:28.0  [DUCK] bed relative -0.4 dB (ramp 0.5 s), CH5 seat -31.7 dB = -17 under on the hottest stretch (file 130.43-177.84,
        about -7.45 LUFS); runs past the end on purpose
```

## CH5 - THE CLOSE (2:28.1-3:10.4, Bed A continues to the last frame, card OFF)
```
2:28.1  [MUSIC] Bed A continues, no breath, no change, aggressive, -17 under; carries the end-pinned ending
2:28.1  SAY:  "Now the 2026 twist."
2:28.6  [KT-POP] kt-headline-over-broll "2026" mid-frame ON "2026" (148.56), holds to 2:30.1 ·
        [ACCENT] knock-pop (kinetic-text/knock-pop.wav, mood_class neutral) file start 2:28.6
2:30.1  [CHART] thinking-tokens IN (4.3 s → 2:34.4) animated in code to the -start design state: PROMPT, the stream not yet begun, → hand:xfade-scale (container-xfade, 0.35s)
        quiet swap, no token count printed
2:30.1  SAY:  "Reasoning models think before they answer and that thinking is extra tokens."
2:30.8  [CHART] thinking-tokens-mid state: the long run of grey THINKING tokens streams ON "think" (150.76)
2:33.5  [CHART] thinking-tokens-payoff state: the short ANSWER lands + THINKING TOKENS headline ON "extra" (153.46)
2:34.4  [RECEIPT] C9 IN (1.9 s → 2:36.3) OpenAI reasoning guide paragraph ending "are billed as output tokens", the line reads it · → hand:xfade-scale (container-xfade, 0.35s)
        treatment: highlight
2:34.4  SAY:  "Billed as output by OpenAI and Anthropic alike."
2:35.0  [HIGHLIGHT] C9 highlighter wipe on "billed as output tokens" ON "output" (155.00)
2:36.3  [RECEIPT] C10 IN (1.7 s → 2:38.0) Anthropic extended-thinking page, the usage.output_tokens_details.thinking_tokens sentence → hand:xfade-scale (container-xfade, 0.35s)
        (below the Warning box, no budget_tokens line), flash under 2 s, billing never "hidden" · treatment: push
2:38.0  [TRANSITION] cover→face cut-in F7, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 2:37.7
2:38.0  [FACE] F7 IN → 2:44.6  "So the cost of the request now depends on how hard the model thinks and that bill lands on inference."
2:38.0  [CAPTION] ON → 2:44.0 (F7; OFF for the LANDS ON INFERENCE pop to the cut)
2:38.1  SAY:  "So the cost of the request now depends on how hard the model thinks and that bill lands on inference."
2:39.1  [MUSIC] loop seam 2 (bar 56 back to 48 on the env-8 plateau) inside FACE 7, bar-aligned, inaudible by design; check at draft
2:42.0  [PUNCH-IN] F7 hard ~15-20% step ON the desilencer join 161.967 (frame 4859) → holds to 2:44.6
2:42.0  [LIGHTLEAK] F7 library light leak ON the same join 161.967 → lib:lightleaks-short-6 (punch-leak, 0.40s) (punch-leak)
2:44.0  [KT-POP] kt-keyword-pop PUNCH variant "LANDS ON INFERENCE", accent red with glow, ON "inference" (164.04), held to the cut ·
        [ACCENT] punch-1-2023 (kinetic-text/punch-1.mp3, mood_class neutral) file start 2:43.9
2:44.6  [TRANSITION] face→cover F7 out, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 2:44.3
2:44.6  [CONTAINER] huang-id-card IN (3.4 s → 2:48.0) JENSEN HUANG / NVIDIA CEO / GTC KEYNOTE, MARCH 2025 (never "stood out")
2:44.8  SAY:  "Jensen Huang, NVIDIA's CEO, stood out on a GTC stage in 2025 and named the hard problem."
2:48.0  [RECEIPT] CLIP-3 lead-in IN (3.3 s → 2:51.3) CLIP-3-STILLS-lead-in: the clip's FIRST frame (NVIDIA upload _waPvOwL9Z8,
        54:18.9) held as a still under the set-up line, no restyle, caption-free · treatment: push (slow settle into the stage)
        → insert-in → hand:xfade-scale (container-xfade, 0.35s)
2:51.3  [INSERT] CLIP-3 SPLICED CLIP (assets/clip-inserts/CLIP-3-huang-inference.mp4), 5.1 s: the spine PAUSES in the trough after
        "problem" (171.32-171.46, bake_clip_insert.py snaps it) and the clip plays FULL-FRAME with Jensen Huang's OWN voice ("it is
        the ultimate extreme computing problem and it's called inference"), burned caption "Jensen Huang, NVIDIA CEO, GTC keynote,
        March 2025, projecting demand for his own chips"; [TRANSITION] insert-in / insert-out → hand:fade (insert-in, 0.50s) (bucket insert);
        everything after this row shifts +5.1 s in the final timeline via sh()
2:51.3  [DUCK] HARD HIT 4 (MUSIC-PLAN t 171.32): automatic -14 dB bed duck (0.3 s ramp) by mix_music.py from the paused-spine
        sidecar, bed plays file 153.66-158.76 (env-8 plateau, no seam); no hit inside the insert, no SFX on its edges
2:51.3  [RECEIPT] CLIP-3 lead-out IN (1.1 s → 2:52.4) CLIP-3-STILLS-lead-out: the clip's LAST frame (54:24.0) held under the resume
        line · treatment: push (still settle) → into BR-10
2:51.5  SAY:  "He sells the chips that run it, so keep that in mind."
2:52.4  [VIDEO] BR-10 IN (2.1 s → 2:54.5) silicon wafer / GPU dies under clean-room light, slow rotate, no brand (Envato fade) → hand:fade (broll-fade, 0.50s)
2:54.5  [CONTAINER] incentive-vs-engineering IN (1.9 s → 2:56.4) HE SELLS THE CHIPS (dimmed) / ON THE ENGINEERING: RIGHT, quiet swap → hand:xfade-scale (container-xfade, 0.35s)
2:54.6  SAY:  "And on the engineering, he's right."
2:56.1  [CONTAINER] incentive-vs-engineering spotlight (comp-level): ON THE ENGINEERING: RIGHT lights ON "right" (176.14)
2:56.4  [TRANSITION] cover→face cut-in F8, kt-whip-cut → hand:kt-whip-cut (face-cut, 0.37s) (face pick) ·
        [WHOOSH] whoosh-4 (kinetic-text/whoosh-4.mp3, mood_class neutral) file start 2:56.0
2:56.4  [FACE] F8 IN → 3:10.4 EOF  the subscribe close (ad-libbed, two playlists); no interior join (190.067 is in the edge margin)
        = no punch-in, no leak; the kt-subscribe-close devices carry the hold
2:56.4  [CAPTION] ON → 2:57.5, OFF 2:57.5 → 3:00.2 (the SUBSCRIBE button sits in the caption zone), ON 3:00.2 → 3:10.4
2:56.5  SAY:  "Make sure you click that subscribe button and click into this playlist right here to learn more about AI engineering."
2:57.5  [KT-CLOSE] kt-subscribe-close: SUBSCRIBE button (keyed subscribe-button.mp4) grows on the chest ON "subscribe" (177.46),
        linear grow to full at 2:57.8, held until the arrow pops · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3,
        mood_class neutral) file start 2:57.0 (onset 0.011 s before the button's first frame) ·
        [ACCENT] subscribe-button (kinetic-text/subscribe-button.wav, mood_class neutral) region 5.80-6.77 s placed at 2:57.8,
        the main hit 0.26 s after full size
3:00.2  [KT-CLOSE] playlist arrow 1 (arrow-red.png, Zoom Bounce) pops where Mike points ON "right" (180.24), at end-screen slot 1,
        button cut on the same frame · [ACCENT] cartoon-accent (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 3:00.0
3:02.9  SAY:  "And if you want to become an AI engineer, you want to learn Python too."
3:06.6  [MUSIC] HARD HIT 5 (MUSIC-PLAN t 186.56): the last env-8 bar of the track ends; the epic_hit decay (env 7 then 6) rides the
        final line. The bed IS the hit (end-pinned placement), no SFX layered
3:06.8  SAY:  "So click into this playlist by Python and I'll catch you there."  (as heard, "by" p 0.33, probably "for": VERIFY by ear before captions; last word ends 190.26)
3:07.6  [KT-CLOSE] playlist arrow 2 (arrow-red.png mirrored if he points left) pops ON "playlist" (187.62) at end-screen slot 2 (the
        Python playlist), arrow 1 cut on the same frame, held to the last frame · [ACCENT] cartoon-accent
        (kinetic-text/cartoon-accent.mp3, mood_class neutral) file start 3:07.1  (OPEN: one slot or two, see CUE-SHEET)
3:10.4  [END] the video ends ON the last word (cut 0.14 s after it, mix fade 0.2 s), no held still, no end card (house rule; the
        F8 window runs to EOF, so there is no face→cover cut here)
3:10.4  [TRANSITION] EOF: F8 runs to the last frame, the picture ends ON the last word → hand:cut (face-cut, 0.0s)
```

## Orphan reconciliation (pre-build, against `assets/` on disk 2026-10-26)
Every renderable file in `assets/` is PLACED above. Source files (`*.html`, `slide-sources/`, `VISUAL-QA.json`) are exempt
(comp-build §10). Nothing is BENCH, nothing is REJECTED.

- **vid (10):** BR-1 0:06.5 · BR-2 0:22.4 · BR-3 0:27.6 · BR-4 0:44.5 · BR-5 0:58.0 · BR-6 1:34.9 · BR-7 1:45.1 · BR-8 1:53.1 ·
  BR-9 2:27.7 · BR-10 2:52.4.
- **img (4):** IMG-1 0:16.9 · IMG-2 1:06.9 · IMG-3 2:12.9 · IMG-4 2:20.7.
- **receipts (12):** C17-ibm-inference-90pct 0:25.3 · C8-anthropic-pricing-tokens 0:33.6 · C13-vllm-compute-memory-bound 0:59.9 ·
  C11-arxiv-pagedattention 1:15.9 · C4-whisper-jobs-editor 1:59.8 · C5-sweep-log-model-load 2:06.0 · C6-spawn-agent-editor 2:14.8 ·
  C7-agent-logs-listing 2:17.2 · C9-openai-reasoning-billed 2:34.4 · C10-anthropic-thinking-tokens 2:36.3 ·
  CLIP-3-STILLS-lead-in 2:48.0 · CLIP-3-STILLS-lead-out 2:51.3.
- **clip-inserts (1):** CLIP-3-huang-inference.mp4 2:51.3.
- **card-slides (9):** c2-training 0:09.7 · c2-contrast 0:18.6 + c2-contrast-s1/s2/s3 0:19.6 / 0:20.3 / 0:21.3 ·
  prefill-compute-bound 0:46.5 · C3 1:10.3 · huang-id-card 2:44.6 · incentive-vs-engineering 2:54.5.
- **diagrams (32 state stills):** tokenizer-split-text/split/ids · C1-rest/prefill/kvcache · c1-decode-spotlight-step/reload ·
  one-token-chain-start/mid/payoff · batching-lane-lane/swap/full · prefix-cache-rest/shared · speculative-decoding-rest/draft/
  verify/same · engines-datacenter-rest/vllm/sglang/trtllm · engines-laptop-rest/ollama/llamacpp · my-pipeline-rest/inference ·
  load-once-load/run (times in the log).
- **charts (6 design states, animated in code):** quantization-memory-start/mid/payoff 1:23.3 / 1:24.0 / 1:25.5 ·
  thinking-tokens-start/mid/payoff 2:30.1 / 2:30.8 / 2:33.5.
- **Spine layers (not files in assets/):** 8 FACE windows · 5 punch-ins + 5 light leaks (one per interior join) · 1 signature open ·
  8 keyword / headline pops + 2 signature labels · 1 band (+1 text swap) · 4 side panels · 4 icons · 1 list card · 1 subscribe close (button + 2 arrows).
- **Effects-library graphics the comp pulls from `video-creation/assets/effects/`** (not project assets): the paper + dark panel
  textures, the crumpled-paper card, subscribe-button.mp4 (keyed), arrow-red.png, the four flat SVG icons (TOKEN, CLOCK, CHIP, DOLLAR,
  rendered by the comp in the house accent).

## Divergences from SCREENPLAY.md resolved in this log (COVER-PLAN is the approved placement, GATE plan 2026-10-26)
- C5 cuts in at 2:06.0 on "Loading" (COVER-PLAN), not on "seconds"; the screenplay's "back to C4 with LOAD ONCE / RUN EVERY CLIP
  panel text" is carried by the load-once diagram at 2:09.3 instead (no second showing of C4).
- CH5 opener: the headline over BR-9 is "2026" (COVER-PLAN); "THINKING TOKENS" lands as the thinking-tokens chart headline at 2:33.5.
- C3 is shown ONCE with item 1 lit, then one spotlight container per lever (COVER-PLAN + Mike's GATE plan ruling 1), not the 2023
  24 s card with four tings.
- 0:06.5 whip-out: the screenplay names whoosh-4 for the signature whip-out AND ea-glitch-21 on the BR-1 cut; they are one event,
  so ONE sound: ea-glitch-21 (the tech b-roll cut sound).
- F6 "hard punch-in on Everything" (144.16) is NOT placed: no desilencer join there (overlays.md section 1: no join, no punch).
