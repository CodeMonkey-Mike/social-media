# inference - EDIT-PLAN-prep (beat-indexed layer plan)
_Rendered 2026-10-26 from `COVER-PLAN.json` by `scripts/render_cover_plan.py`; format owner `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0 (the PREP file: provisional, beat-indexed; the time-ordered `EDIT-PLAN.md` and the layer-grouped `CUE-SHEET.md` are authored post-record off the transcript). Timecodes here ARE final-spine seconds (the plan was authored on the final spine), so they carry straight into the event log. Transitions per `TRANSITIONS.md` (authored after this file)._

**FACE windows (from the spine picture, not covered):** 0:00.00-0:06.47, 0:11.93-0:16.90, 1:01.30-1:06.93, 1:07.73-1:10.27, 1:48.77-1:53.07, 2:21.93-2:27.70, 2:38.03-2:44.63, 2:56.37-3:10.40

## CH1 - WHAT INFERENCE IS (0:06.47-0:27.55)

| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |
|---|---|---|---|---|---|
| B1 | 0:06.47-0:09.68 | "Training is the model learning on its weights from data one time" | ENVATO-VIDEO BR-1: GPU training cluster / data-center aisle, slow dolly; kt-headline-over-broll TRAINED ONCE pops 0.8 s after the cut (knock-pop) | med | per TRANSITIONS.md |
| B2 | 0:09.68-0:11.93 | "and it costs millions." | CONTAINER C2 state 1 (asset c2-training), LIGHT: TRAINING column ONCE / LEARNS THE WEIGHTS / COSTS MILLIONS (no figure) | med | per TRANSITIONS.md |
| B3 | 0:16.90-0:18.60 | "Training makes the headlines." | CHATGPT-IMAGE IMG-1: press camera flashes aimed at a glowing GPU training cluster, no text, no logos | low | per TRANSITIONS.md |
| B4 | 0:18.60-0:22.45 | "Inference is the bill, the latency, and the part you actually operate." | CONTAINER C2 state 2 (asset c2-contrast): TRAINING dimmed vs INFERENCE lit: THE BILL / THE LATENCY / THE PART YOU OPERATE, each row lights on its word (19.64, 20.34, 21.30) | high | per TRANSITIONS.md |
| B5 | 0:22.45-0:25.30 | "By some estimates, up to 90%" | ENVATO-VIDEO BR-2: calm plate, a chat UI streaming an answer on a monitor (or quiet rack LEDs); kt-headline-over-broll UP TO 90% pops ON '90' at 24.36 (knock-pop), code-rendered text | med | per TRANSITIONS.md |
| B6 | 0:25.30-0:27.55 | "of a model's life is inference." | RECEIPT C17: IBM Research paragraph, 'up to 90% of an AI-model's life is spent in inference mode' highlighted, real pixels | high · VERIFY | per TRANSITIONS.md |

## CH2 - ONE REQUEST (0:27.55-1:01.30)

| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |
|---|---|---|---|---|---|
| B1 | 0:27.55-0:30.60 | "Your request never reaches the model as text." | ENVATO-VIDEO BR-3: hands typing a prompt into a chat box, shallow focus | med | per TRANSITIONS.md |
| B2 | 0:30.60-0:33.60 | "A tokenizer turns it into IDs" | CONTAINER tokenizer-split: the sentence 'Your request never reaches the model as text.' splits into coloured token chunks, each dropping its integer ID; kt-side-panel PAPER right TOKEN IDS / BILLED PER TOKEN + TOKEN icon | med · VERIFY | per TRANSITIONS.md |
| B3 | 0:33.60-0:35.38 | "and the tokens are what you get billed for." | RECEIPT C8: Anthropic pricing table header 'Base input tokens' / 'Output tokens' + two $ / MTok rows, real pixels, no price spoken | high · VERIFY | per TRANSITIONS.md |
| B4 | 0:35.38-0:44.45 | "Step 1. Prefill. The GPU reads your whole prompt at once and stores the keys and the value" | DIAGRAM C1 full frame, LIGHT: PROMPT -> TOKENIZER -> TOKEN IDS -> PREFILL -> KV CACHE -> DECODE loop -> NEXT TOKEN -> STOP, TTFT / TPOT brackets. PREFILL lights on 'Prefill' (36.42), prompt tokens enter at once (38.94), KV CACHE fills and lights on 'KV cache' (43.62) | high | per TRANSITIONS.md |
| B5 | 0:44.45-0:46.55 | "The chip is working flat out." | ENVATO-VIDEO BR-4: graphics card fans spinning hard, close-up, no brand | med | per TRANSITIONS.md |
| B6 | 0:46.55-0:48.10 | "Prefill is compute bound." | CONTAINER prefill-compute-bound: PREFILL = COMPUTE-BOUND, compute meter pinned full, source line 'vLLM docs' | med | per TRANSITIONS.md |
| B7 | 0:48.10-0:53.45 | "Step 2. Decode. One token per step and every step reloads that whole cache." | DIAGRAM c1-decode-spotlight: zoomed KV CACHE -> DECODE -> NEXT TOKEN loop, the cache-to-decode arrow pulses each step (the reload), one token appends per loop | high | per TRANSITIONS.md |
| B8 | 0:53.45-0:58.05 | "Within one request, you can['t] skip ahead. Each token depends on the last." | CONTAINER one-token-chain: token chain growing one block at a time, each arrowed from the previous; ONE TOKEN AT A TIME, WITHIN ONE REQUEST | med · VERIFY | per TRANSITIONS.md |
| B9 | 0:58.05-0:59.85 | "The chip is waiting on memory." | ENVATO-VIDEO BR-5: RAM modules macro, slow rack focus, or data pulsing along a trace | med | per TRANSITIONS.md |
| B10 | 0:59.85-1:01.30 | "Decode is memory bound." | RECEIPT C13: vLLM docs, Chunked Prefill, 'compute-bound (prefill) and memory-bound (decode)' highlighted | high · VERIFY | per TRANSITIONS.md |

## CH3 - THE LEVERS (1:06.93-1:48.77)

| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |
|---|---|---|---|---|---|
| B1 | 1:06.93-1:07.73 | "The levers." | CHATGPT-IMAGE IMG-2: an industrial control console with four big chrome levers, dramatic light, no text | low | per TRANSITIONS.md |
| B2 | 1:10.27-1:12.00 | "Continuous batching." | CONTAINER C3 paper list card, shown ONCE as the overview: CONTINUOUS BATCHING / CACHING / QUANTIZATION / SPECULATIVE DECODING, item 1 lit on 'Continuous' (70.56, ting) | high | per TRANSITIONS.md |
| B3 | 1:12.00-1:15.90 | "Requests join and leave mid-flight so the GPU never idles." | CONTAINER batching-lane: animated GPU batch lane, request bars join and leave mid-flight, the lane never empty; label 1 / 4 CONTINUOUS BATCHING | med | per TRANSITIONS.md |
| B4 | 1:15.90-1:20.20 | "Caching. PagedAttention. Cut wasted cache memory to near zero" | RECEIPT C11: arXiv 2309.06180 abstract page, title with PagedAttention visible on the word, then 'near-zero waste in KV cache memory' highlighted | high · VERIFY | per TRANSITIONS.md |
| B5 | 1:20.20-1:23.30 | "and a shared prompt prefix is computed once." | CONTAINER prefix-cache: two requests share one PREFIX block (computed once, lit), each with its own short suffix; label 2 / 4 CACHING, prefix caching | med | per TRANSITIONS.md |
| B6 | 1:23.30-1:28.60 | "Quantization. 8 bit halves the weights, 4 bit quarters them so it fits a smaller card." | ANIMATED-CHART quantization-memory: three bars: 16-bit 29.0 GB, 8-bit 15.2 GB (on '8-bit' 83.98), 4-bit 9.5 GB (on '4-bit' 85.48); a small-card outline the 4-bit bar fits under; source line Hugging Face, bigcode/octocoder example; label 3 / 4 QUANTIZATION | high | per TRANSITIONS.md |
| B7 | 1:28.60-1:34.90 | "Speculative decoding. A small model drafts. The big one verifies in one pass. Same output." | CONTAINER speculative-decoding: a small model writes 4 draft tokens (on 'drafts'), the big model checks all 4 in one pass (on 'verifies'), SAME OUTPUT stamps on 'Same output' (94.16); label 4 / 4 SPECULATIVE DECODING | med | per TRANSITIONS.md |
| B8 | 1:34.90-1:37.90 | "All of that lives in the inference engine." | ENVATO-VIDEO BR-6: GPU server rack push-in; kt-headline-over-broll THE INFERENCE ENGINE pops ON 'engine' (96.68, knock-pop), cut on ea-glitch-21 | med | per TRANSITIONS.md |
| B9 | 1:37.90-1:41.85 | "vLLM, SGLang, TensorRT-LLM," | DIAGRAM engines-datacenter: REQUEST -> INFERENCE ENGINE -> GPU, engine names light in turn: vLLM (98.02), SGLang (98.88), TensorRT-LLM (100.08) | med | per TRANSITIONS.md |
| B10 | 1:41.85-1:45.10 | "on a laptop, Ollama, and llama.cpp." | DIAGRAM engines-laptop: the flow on a LAPTOP outline: Ollama (102.96) on top of llama.cpp (104.00) as its backend, localhost:11434 | med | per TRANSITIONS.md |
| B11 | 1:45.10-1:48.77 | "Hosted. You pay per token and the vendor runs the GPU." | ENVATO-VIDEO BR-7: API request log scrolling on a monitor; C16 kt-side-panel PAPER right HOSTED / PAY PER TOKEN / THEIR GPU (whoosh-4), b-roll translates left | med | per TRANSITIONS.md |

## CH4 - WE DO THIS EVERY DAY (1:53.07-2:21.93)

| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |
|---|---|---|---|---|---|
| B1 | 1:53.07-1:56.90 | "Now with me, I run an AI pipeline and edit videos just like this one." | ENVATO-VIDEO BR-8: video editing timeline on a workstation monitor, playhead moving, no headline | med | per TRANSITIONS.md |
| B2 | 1:56.90-1:59.80 | "So here's what inference looks like in practice." | DIAGRAM my-pipeline: RECORDING -> WHISPER (SELF-HOSTED, MY OWN GPU) -> AI AGENTS (HOSTED, CLAUDE) -> VIDEO; both inference nodes lit, no hardware named | med | per TRANSITIONS.md |
| B3 | 1:59.80-2:06.00 | "Every clip I transcribe runs OpenAI Whisper on my own GPU. Self-hosted inference." | RECEIPT C4: editor view of video-creation/shorts/_tooling/whisper_jobs.py, line 1 (load the model ONCE, run every window) and lines 122 to 133 (device cuda, whisper.load_model); kt-side-panel PAPER SELF-HOSTED / WHISPER MEDIUM / MY OWN GPU + CHIP icon | high · VERIFY | per TRANSITIONS.md |
| B4 | 2:06.00-2:09.30 | "Loading the model costs around 15 to 20 seconds." | RECEIPT C5: real terminal showing '[whisper_jobs] medium.en loaded on cuda in 14.2s (77 job(s))', highlighted | high · VERIFY | per TRANSITIONS.md |
| B5 | 2:09.30-2:12.88 | "So my pipeline loads it once and runs every clip through it." | CONTAINER load-once: ONE model-load block, then clip jobs streaming through it; LOAD ONCE / RUN EVERY CLIP | med | per TRANSITIONS.md |
| B6 | 2:12.88-2:14.75 | "Keep the weights hot, batch the work." | CHATGPT-IMAGE IMG-3: an unbranded GPU glowing orange-hot like metal fresh from a forge, sparks | low | per TRANSITIONS.md |
| B7 | 2:14.75-2:17.20 | "And every agent in my pipeline spawns" | RECEIPT C6: video-creation/longform-edited/graph/common.py lines 446-448 and 484-487 (def spawn_agent, the claude -p --agent command, the spawning print) | high · VERIFY | per TRANSITIONS.md |
| B8 | 2:17.20-2:20.65 | "around 20 per video is a Claude session billed per token." | RECEIPT C7: terminal 'ls video-creation/longform-edited/graph/data/ | grep growth-vs-product' listing the 20 longform-lane agent logs; kt-side-panel PAPER HOSTED / CLAUDE, BILLED PER TOKEN + DOLLAR icon | high · VERIFY | per TRANSITIONS.md |
| B9 | 2:20.65-2:21.93 | "Hosted inference." | CHATGPT-IMAGE IMG-4: a distant cloud data center glowing at night across a dark plain (someone else's GPUs), no text | low | per TRANSITIONS.md |

## CH5 - THE CLOSE (2:27.70-2:56.37)

| Beat | Time | SAY (anchor) | Layer / asset | Priority | Transition |
|---|---|---|---|---|---|
| B1 | 2:27.70-2:30.05 | "Now the 2026 twist." | ENVATO-VIDEO BR-9: abstract neural-network light streams, fast; kt-headline-over-broll 2026 pops ON '2026' (148.56) | med | per TRANSITIONS.md |
| B2 | 2:30.05-2:34.38 | "Reasoning models think before they answer and that thinking is extra tokens." | ANIMATED-CHART thinking-tokens: PROMPT, then a long run of grey THINKING tokens streaming (on 'think'), then a short ANSWER; THINKING TOKENS headline on 'extra tokens' (153.46) | med | per TRANSITIONS.md |
| B3 | 2:34.38-2:36.30 | "Billed as output by OpenAI" | RECEIPT C9: OpenAI reasoning guide paragraph ending 'are billed as output tokens', highlighted | high · VERIFY | per TRANSITIONS.md |
| B4 | 2:36.30-2:38.03 | "and Anthropic alike." | RECEIPT C10: Anthropic extended-thinking page, the usage.output_tokens_details.thinking_tokens sentence (how many of the billed output tokens were internal reasoning) highlighted | high · VERIFY | per TRANSITIONS.md |
| B5 | 2:44.63-2:48.00 | "Jensen Huang, NVIDIA's CEO, stood out on a GTC stage" | CONTAINER huang-id-card: JENSEN HUANG / NVIDIA CEO / GTC KEYNOTE, MARCH 2025 (never 'stood out') | med | per TRANSITIONS.md |
| B6 | 2:48.00-2:51.32 | "in 2025 and named the hard problem." | RECEIPT CLIP-3 lead-in: the clip's FIRST frame (NVIDIA upload, 54:18.9) held as a still, no restyle, caption-free | high · VERIFY | per TRANSITIONS.md |
| B7 | 2:51.32-2:51.32 | "(CLIP-3 plays, 5.1 s, Jensen Huang's own voice: it is the ultimate extreme computing probl" | CLIP-INSERT CLIP-3 full-frame with its own audio, burned caption, bed ducked -14 dB, hand:fade 0.5 s in and out | high · VERIFY | per TRANSITIONS.md |
| B8 | 2:51.32-2:52.40 | "He sells the chips" | RECEIPT CLIP-3 lead-out: the clip's LAST frame (54:24.0) held as a still under the resume line | high · VERIFY | per TRANSITIONS.md |
| B9 | 2:52.40-2:54.50 | "that run it, so keep that in mind." | ENVATO-VIDEO BR-10: silicon wafer / GPU dies under clean-room light, slow rotate, no brand | med | per TRANSITIONS.md |
| B10 | 2:54.50-2:56.37 | "And on the engineering, he's right." | CONTAINER incentive-vs-engineering: HE SELLS THE CHIPS (dimmed) / ON THE ENGINEERING: RIGHT (lit on 'right', 176.14) | med | per TRANSITIONS.md |

