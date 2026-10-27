# inference - SCREENPLAY

_Pre-production script for the longform-edited video `inference` (AI Engineering Simplified channel). Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py --face-max 10`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; the opening IS Chapter 1. Authored 2026-10-25 from the LOCKED brief in `PROJECT-LOG.md` and the fact source `DATA.md` (compiled 2026-10-25)._

- **Working title:** AI Inference Explained in 2 Minutes (alternates for Mike at GATE 1: "What AI Inference Actually Is" · "Training Happens Once. Inference Is Everything After.")
- **Track:** longform-edited (16:9), Mike on camera. **Channel:** AI Engineering Simplified, NOT CryptoRich: no crypto CTA, no community link, the FINAL goes to the project root for Mike to upload (never `longs.json`); a vertical cut and a short are Mike's call at the gate.
- **Archetype / register:** a tight, straight-to-the-point explainer in the shape of Mike's 2023 "Growth Marketer vs Growth Hacker" video (2:05): one idea per line, every line lands with a kinetic-text device, no preamble, no recap. Channel voice = peer-EXPERT (ai_channel_plan.md ON-SCREEN AUTHORITY: Mike explains inference, he never frames himself as learning it). Gear map: **CH1 = gear 3** (declarative hook) -> **CH2, CH3 = gear 2** (the mechanics, polished) -> **CH4 = gear 2 rising to 3** (our own code, landing on the face) -> **CH5 = gear 3** (the 2026 line + the close).
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6), with MORE face than the house norm by Mike's instruction (2026-10-25): **8 `[FACE]` lines in the whole video, `--face-max 10`** (CH1 hook, CH1 definition, CH2 the two latency numbers, CH3 four levers, CH3 self-hosted, CH4 never trained anything, CH5 lands on inference, CH5 subscribe close). Every FACE beat carries its kinetic-text device (a pop, a band, a panel, an icon); everything else is `[COVER]`.
- **Effects theme:** `kinetic-text-2023`, the FULL set (`video-creation/assets/effects/library.json`; sounds in `video-creation/assets/sfx/kinetic-text/`; placement rules `skills/overlays/overlays.md` section 2). Every 🎬 `[SHOW]` line that uses a device names its device id and its sound id. A device is motion + sound together, one sound per event, never silent, never two stacked. Colours and font are the HOUSE look (house display font, one accent for the whole video, see VISUAL-PLAN); the motion and the sound pairing are exact. Captions: house default, OFF for the hold of every keyword pop (the pop lands in the caption zone).
- **Music:** ONE track for the whole video, `story-of-my-life` (Bobo Renthlei, Story Of My Life, instrumental 3:02), continuous from frame 0 to the last frame, no bed change, no breath, ducked under the VO and the pops, never stopped for a pop (Mike, 2026-10-25). Therefore **title cards: NONE**; chapters flow in on `kt-whip-cut`.
- **Target runtime:** 2:00 target, hard window 2:00 to 3:00. Spoken budget as written: around 475 words, which is around 2:48 at Mike's desilenced pace of around 170 words a minute WITH the proposed 5 s clip insert, around 2:36 WITHOUT it. Per-chapter budgets on each chapter header. Runtime is never a reason to cut a RECORDED line; the lines below are already the fewest that carry the five pillars (OPEN QUESTIONS 7 names what to drop BEFORE recording if Mike wants 2:00 flat).
- **Fact source:** every number, date, name and quote traces to `DATA.md` in this folder (compiled 2026-10-25). Chart IDs C1 to C18 = DATA.md CHART-SOURCE INDEX. Mechanisms are confirmed against PRIMARY sources (NVIDIA, Hugging Face, vLLM, arXiv, OpenAI, Anthropic), never against the three reference videos. Our own code is cited by file path and its numbers are quoted from the file or a real log line, not remembered.
- **Accuracy pass:** mandatory before Mike records (`video-creation/skills/accuracy-pass/accuracy-pass.md`). The per-chapter verify boxes below are the claim-by-claim map to DATA.md; the LIVE re-pull of the volatile rows (prices, cache multipliers, the effort-knob wording, the agent-log count) is the pass itself and is listed in OPEN QUESTIONS 12.

---

## THE HOOK / THESIS

Every AI model is trained ONCE. Everything anyone ever does with it afterwards, every prompt, every transcription, every generated image, is INFERENCE: the frozen weights applied to new input. Training is the one-time compute investment that makes headlines (IBM Research: "a one-time investment in compute while inferencing is ongoing"); inference is the recurring bill, the latency the user feels and the part an AI engineer actually operates (DATA.md T1, T2, T4). One LLM request is prefill (the whole prompt at once, compute-bound, writes the KV cache) then decode (one token per step, memory-bound, re-reads the cache); the user feels them as time to first token and time per output token (pillar 2). Four levers make it fast and cheap (pillar 3). This repo does inference every day and has never trained anything: Whisper on the laptop GPU is self-hosted inference, every headless Claude agent is hosted inference (pillar 4, T5). In 2026 the reasoning models spend extra tokens thinking, billed as output tokens, so the cost of one request now depends on how hard the model thinks, and that bill lands on inference (pillar 5).

> [!WARNING]
> **DO NOT AIR "90 percent of AI compute / cost is inference" as a hard stat.** Both primaries are ESTIMATES with "up to": IBM Research 2023 "up to 90% of an AI-model's life is spent in inference mode"; AWS 2019, customer-attributed, "up to 90% of the cost". No measured industry figure exists (DATA.md do-not-air row 1, Open question 1). Airable: "By some estimates, up to 90 percent of a model's life is inference" with the IBM receipt C17 on screen.

> [!WARNING]
> **DO NOT AIR "inference always costs more than training".** True only at scale and only as an estimate; a model that is never served costs nothing to infer (do-not-air row 2). Airable: "Over a deployed model's life, inference is where most of the compute goes" / "inference is the recurring bill".

> [!WARNING]
> **DO NOT AIR "the model load costs 20.5 seconds" as the current number, and never "hundreds of Claude calls per video".** 20.5 s is the 2026-08-19 docstring measurement; every log since prints 13.9 to 17.5 s (do-not-air rows 8, 9, 10). Airable: "around 15 to 20 seconds to load the model, measured on this laptop" with the docstring (C4) or a real log line (C5) on screen, never both numbers as one; and "around 20 headless agents per longform video, every one of them a Claude inference session, billed per token" (20 longform-lane spawns on growth-vs-product). "This pipeline runs inference every day and has never trained anything" is the airable thesis line (the weekly count is not measured).

> [!WARNING]
> **DO NOT AIR Jensen Huang's "100 times more compute" as a market fact, and never air "quantization makes inference 2 to 3x faster" or "speculative decoding gives 2 to 3x".** The 100x is a vendor CEO's demand projection at his own keynote; it airs only as a clip with its caption naming that (do-not-air row 11; CLIP-3 below). Hugging Face's own worked example shows quantization shrinks memory (29.0 -> 15.2 -> 9.5 GB) while "inference time is often not reduced"; the speculative-decoding 2x to 3x is one paper's T5-XXL result (rows 5, 6). Airable: quantization "shrinks the weights so the model fits a smaller card"; speculative decoding "drafts several tokens cheaply, the big model verifies them in one pass, identical output".

> [!WARNING]
> **The "compute-bound (prefill) / memory-bound (decode)" pair is vLLM's wording, not NVIDIA's.** NVIDIA 2023 says decode "is a memory-bound operation" and prefill "saturates GPU utilization" (do-not-air row 15). And "decode cannot be parallelized" is true only WITHIN one request; across requests it is batched (row 16). The CH2 lines say "within one request".

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | WHAT INFERENCE IS | Hook (opens the video, no cold open): the `kt-signature-open` names TRAINING and INFERENCE; the one-line definition lands on the face with a punch pop; the stakes line with the "up to 90 percent" estimate | **Bed A starts at frame 0** (`story-of-my-life`, the ONLY bed of the video) | OFF | ~26 s / ~73 words |
| CH2 | ONE REQUEST | The teaching chapter: tokens, prefill, the KV cache, decode, the two latency numbers; the ONE system-design diagram (C1) if Mike rules it in | continues (same file, same region, no breath) | OFF | ~41 s / ~115 words |
| CH3 | THE LEVERS | The paper list card (C3): batching, caching, quantization, speculative decoding; the inference engine named on the face; hosted vs self-hosted as a side-panel pair (C16) | continues | OFF | ~43 s / ~120 words |
| CH4 | WE DO THIS EVERY DAY | Our own code: Whisper on the RTX 4070 Laptop GPU (self-hosted, receipts C4 + C5), the headless Claude agents (hosted, receipts C6 + C7); "we have never trained anything" on the face | continues | OFF | ~30 s / ~83 words |
| CH5 | THE CLOSE | The 2026 line (reasoning tokens billed as output, receipt C9); the proposed 5 s CLIP-3; the `kt-subscribe-close` with the playlist arrow (or Mike's hard-out) | continues to the last frame | OFF | ~32 s + 5 s clip / ~85 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it. Chapter boundaries are `kt-whip-cut` (`swoosh-8`, the chapter-level whip), never a card.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. More than the house norm on this video (9 of them, max 10), each WITH its kinetic-text device: a sentence or a tight pair, never a bare talking head |
| 🗣️ `[COVER]` | spoken, VO over b-roll with headline pops / the paper list card / receipts of OUR OWN files / the one diagram. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (device id + sound id, b-roll, receipt, diagram cue). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken |

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed. This video has ONE continuous bed from frame 0, so the card set that falls out of the MUSIC-MOOD-PLAN is EMPTY: every chapter is OFF and flows in on `kt-whip-cut` (the 2023 video had no chapter cards either).

| CH | Title card | Why |
|---|---|---|
| CH1 | OFF | the hook; frame one is Mike (the signature open) |
| CH2 | OFF | continues Bed A |
| CH3 | OFF | continues Bed A |
| CH4 | OFF | continues Bed A |
| CH5 | OFF | continues Bed A to the last frame |

**FACE/COVER rules (Convention 3, adjusted for this video by Mike):** face is gated OFF by default; a face cut is ONE sentence or a tight pair WITH its device; the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say. Budget 10, scripted 9.

**Explainer visuals (Convention 4, overridden by the brief for this video):** NO deck of containers; this is the 2023 shape. Covers are b-roll with `kt-headline-over-broll` pops, the `kt-list-card` paper card, receipts of OUR OWN FILES (C4 to C7), and at most ONE system-design diagram (C1, prefill -> KV cache -> decode), code-rendered so every label is pixel-accurate. Never an AI image as the source of a number; the two external receipts that back a spoken estimate or a billing fact (C17, C9) are real-site captures, never restyled.

**Kinetic-text devices (overlays.md section 2):** `kt-signature-open` on the hook line only · `kt-keyword-pop` (sound by meaning: `knock-pop` neutral, `punch-1-2023` one accent-red glowing word, `punch-sound-effect` one white word, `twinkle` positive, `cash-register` money) · `kt-lower-third-band` with `text_swap` (`swoosh-4` 0.34 s before the band, `knock-pop` on each text) · `kt-list-card` (`fast-swoosh` in, `ting` per item) · `kt-headline-over-broll` (`ea-glitch-21` on a tech b-roll cut, `swoosh-3` on a calm one, then the pop's sound by meaning) · `kt-side-panel` (dark beside the face, `swoosh-1` right / `swoosh-2` left; PAPER beside b-roll or a receipt, always right, `whoosh-4`) · `kt-icon-pop` (flat SVG icons in the house accent; THIS video uses four: chip, token, clock, dollar, Mike rules at GATE 1; an icon on a cut rides that cut's `whoosh-4`, an icon entering alone takes `swoosh-1` / `swoosh-2`) · `kt-subscribe-close` (`cartoon-accent` on the button, `subscribe-button` under it, `cartoon-accent` on the arrow) · `kt-whip-cut` on every angle change (`whoosh-4` default, `fast-reverse-1` / `fast-reverse-5` variety, `swoosh-8` chapter-level). Captions OFF for the hold of every pop and every band (the band's text is itself the caption; see OPEN QUESTIONS 9).

**Clip inserts (Convention 6):** CONSIDERED on every video. One PROPOSED row below (CLIP-3, 5.1 s), two REJECTED. A clip plays with its OWN voice while the spine pauses, bed ducked; never a muted cover.

---

## CH1 - WHAT INFERENCE IS
**Register:** gear 3, declarative. Short hammer sentences, peer-expert. No "right?" tags, no hedge, no "in this video", no whole-video preview.
**Title card:** OFF. **Music:** Bed A starts at frame 0 (`story-of-my-life`, build for the first 10 s then the high peak; see MUSIC-MOOD-PLAN). The frame-0 whip lands on the first downbeat the placement strategist picks.
**Budget:** ~26 s, ~73 spoken words.

**Beat 1 - the hook (LOCKED opening, the signature open)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Every AI model gets trained once, and everything anyone does with it after that is inference.**
🎬 `[SHOW]` `kt-signature-open`: frame 0 is Mike, `kt-whip-cut` IN onto the face (the open's 0.73 s whip with the 25 to 0 degree roll, `swoosh-4` file start at frame 0), a slow 5 percent punch-in over the line. Label A "TRAINING" pops on the right third ON "trained" (`kt-keyword-pop` motion, `cash-register` starting 0.17 s before it so the bell lands on the word; the one-time cost is the money beat). Label B "INFERENCE" pops stacked below it ON "inference" (`wooden-rattle-whoosh`). Both hold to the end of the line. `kt-whip-cut` OUT (the blur-in variant, `whoosh-4`) into Beat 2. Captions OFF for the hold. House display font, house accent on the two labels, the shared look white.
💬 `[NOTE]` Locked because the two label pops are cued to "trained" and "inference"; say both words clearly, a hair of air before each.

**Beat 2 - the definition, by contrast**

🗣️ `[COVER]` Training is the model learning its weights from data, one time, and it costs millions.
🎬 `[SHOW]` `kt-whip-cut` onto tech b-roll (a data-center aisle or a GPU board under lights; whip-zoom, `ea-glitch-21` ON the cut). `kt-headline-over-broll` "TRAINED ONCE" pops mid-frame 0.8 s after the cut (`knock-pop` ON the text, neutral). C2's TRAINING column is the text source; the words trace to NVIDIA 2016 and IBM Research 2023.
🔍 `[VERIFY]` "costs millions" = IBM Research: training a generative model "can cost millions of dollars in computer processing time" (DATA.md pillar 1). Keep it as "millions", no figure.
👤 `[FACE]` Inference is those frozen weights, running against brand new input, on every single request.
🎬 `[SHOW]` `kt-whip-cut` back to the face (`fast-reverse-1`). `kt-keyword-pop` punch variant: "EVERY REQUEST" in the accent red with the glow, the Zoom Bounce elastic, `punch-1-2023` ON the first frame, ON "every". Held to the next cut. Captions OFF for the hold.

**Beat 3 - the stakes**

🗣️ `[COVER]` Training makes the headlines. Inference is the bill, the latency, and the part you actually operate. By some estimates, up to 90 percent of a model's life is inference.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto calm b-roll (a cloud console or a streaming chat UI mid-answer; `swoosh-3` ON the cut). `kt-headline-over-broll` "UP TO 90%" pops mid-frame ON "90 percent" (`knock-pop`); the number is code-rendered text, never an image. Then C17, a 2 s flash of the IBM Research page with "up to 90% of an AI-model's life is spent in inference mode" highlighted, real pixels, then whip into CH2 (`swoosh-8`).
🔍 `[VERIFY]` The spoken framing MUST keep "by some estimates" and "up to" (do-not-air row 1). C17 is the receipt that makes the number airable.
💬 `[NOTE]` No handoff line here on purpose: the 2023 shape goes straight into the body on the whip (brief: no preamble). If Mike wants one, the rotated options are in OPEN QUESTIONS 8.

> [!IMPORTANT]
> CH1 verify list:
> - "trained once / everything after is inference" = DATA.md T1 (NVIDIA Blog 2016, updated October 2025; IBM Research 2023, Raghu Ganti: "a one-time investment in compute while inferencing is ongoing").
> - "frozen weights ... new input" = T4 (Hugging Face optimization guide: "Once trained, the fundamental LLM architecture is difficult to change"; "always deployed in the same way during inference") and T1.
> - "costs millions" = IBM Research 2023, pillar 1. Never a precise figure.
> - "up to 90 percent, by some estimates" = T2 (IBM Research 2023 "up to 90%" of a model's LIFE; AWS 2019 "up to 90%" of COST, customer-attributed). Spoken as the LIFE version with the IBM receipt C17. Never a hard stat, never "always costs more than training".
> - The two face lines above are CH1's only face beats (2 of 9). Do not ad-lib another to camera.

---

## CH2 - ONE REQUEST
**Register:** gear 2 explainer, declarative edges, every term glossed in the same line. This chapter TEACHES; one face line (the two latency numbers).
**Title card:** OFF. **Music:** Bed A continues (no breath, no change).
**Budget:** ~41 s, ~115 spoken words.

**Beat 1 - tokens**

🗣️ `[COVER]` Your prompt never reaches the model as text. A tokenizer turns it into token IDs, and tokens are what you get billed for.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) onto code b-roll (a sentence being split into coloured token chunks, or an editor showing `tokenizer(prompt)["input_ids"]`). `kt-side-panel` PAPER variant on the right (`whoosh-4` ON the panel entry): "TOKEN IDS" over "BILLED PER TOKEN", with the TOKEN icon (`kt-icon-pop`, slides up from the bottom edge into the panel, rides the panel's `whoosh-4`, no sound of its own). Optional 1.5 s flash of C8 (the Anthropic pricing table, "Base input tokens" / "Output tokens" rows) under "billed for", real pixels.
🔍 `[VERIFY]` C8 is live-drift (prices as of 2026-10-25 19:09 UTC); the flash shows the ROW LABELS, no price is spoken. Re-capture on capture day.

**Beat 2 - prefill and the KV cache**

🗣️ `[COVER]` Step one, prefill. The GPU reads your whole prompt at once and stores the keys and values for every token in memory, the KV cache. The chip is working flat out, prefill is compute-bound.
🎬 `[SHOW]` C1, THE system-design diagram of the video (code-rendered, fills the frame): PROMPT -> TOKENIZER -> TOKEN IDS -> PREFILL -> KV CACHE -> DECODE loop -> NEXT TOKEN -> back to DECODE until STOP; two latency brackets, TTFT spanning prefill, TPOT spanning one decode step. State 1 on "prefill": the PREFILL node lights, all prompt tokens enter it at once, the KV CACHE fills; the label "compute-bound" lights under PREFILL. No pop on the diagram (containers stay quiet); the bed carries it.
💬 `[NOTE]` If Mike rules the diagram OUT at GATE 1 (OPEN QUESTIONS 3), this beat and the next ride the `kt-list-card` instead: PREFILL and DECODE as two items on `ting`, with their one-line glosses.

**Beat 3 - decode**

🗣️ `[COVER]` Step two, decode. One token per step, and every step reloads that whole cache. Within one request you cannot skip ahead, each token depends on the last. The chip is waiting on memory, decode is memory-bound.
🎬 `[SHOW]` C1 state 2 on "decode": the DECODE node lights, one token appends per step, the arrow from KV CACHE into DECODE pulses on each step (the reload), the label "memory-bound" lights under DECODE; the TOKEN IDS row grows by one each loop.
🔍 `[VERIFY]` "within one request" stays in the line (do-not-air row 16: across requests it IS batched, CH3 says so).

**Beat 4 - the two numbers you feel**

👤 `[FACE]` Those are the two numbers you feel, time to first token is prefill, time per output token is decode.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) to the face, lifted 85 px so the head clears the band. `kt-lower-third-band` (`swoosh-4` starting 0.34 s BEFORE the band rises): text 1 "TIME TO FIRST TOKEN = PREFILL" pops ON "first token" (`knock-pop`), then `text_swap` to text 2 "TIME PER OUTPUT TOKEN = DECODE" ON "output token" (`knock-pop` ON text 2, text 1's one-frame drop silent). The CLOCK icon (`kt-icon-pop`) slides UP onto the chest on the whip that lands this shot, riding its `whoosh-4`, no sound of its own, held to the cut. Captions OFF for the band hold. Band and face are cut under the CH3 whip, no slide-out.
💬 `[NOTE]` No "go back and rewatch" line on this video: the device wants a genuinely dense beat AND runtime to spend, and a 2-minute straight-to-the-point explainer has neither (the rule allows zero; OPEN QUESTIONS 10).

> [!IMPORTANT]
> CH2 verify list:
> - "the model only sees token IDs" = Hugging Face guide section 3.2, `tokenizer(prompt)["input_ids"]` fed to the model; "billed per token" = Anthropic pricing ("Base input tokens" / "Output tokens" per MTok) and OpenAI ("Prices per 1M tokens"), T3.
> - "prefill: the whole prompt at once, keys and values into the KV cache" = NVIDIA 2023 (Verma, Vaidya): "In the prefill phase, the LLM processes the input tokens to compute the intermediate states (keys and values)", parallel, "saturates GPU utilization"; cache = "it's possible to cache them in GPU memory".
> - "compute-bound (prefill) / memory-bound (decode)" = vLLM optimization docs, Chunked Prefill (C13). NVIDIA 2023 for decode "is a memory-bound operation". Cite vLLM for the PAIR (do-not-air row 15).
> - "decode: one token per step, reloads the whole cache, each token depends on the last" = Hugging Face 3.2 / 3.2.2 ("large key-value vectors need to be reloaded ... at every step"; "the required memory bandwidth for the constant reloading can become a serious time bottleneck"); NVIDIA 2023 "generates output tokens autoregressively one at a time".
> - "time to first token is prefill, time per output token is decode" = NVIDIA 2025-04-02 benchmarking post (C12): TTFT "the time it takes to process the prompt and generate the first token"; ITL "also known as time per output token (TPOT)", "a characteristic of the decoding part of the request processing only".
> - Diagram labels (C1) are lowercase "prefill" / "decode", "KV cache" with capital K and V, "TTFT" / "TPOT" (DATA.md section 3 terminology). Never "exponentially" anywhere (quadratic, do-not-air row 4).

---

## CH3 - THE LEVERS
**Register:** gear 2, brisk; name each lever and gloss it in the same breath, no deep dive. Three face lines (the four-levers lead-in, the engine, self-hosted).
**Title card:** OFF. **Music:** Bed A continues.
**Budget:** ~43 s, ~120 spoken words.

**Beat 1 - four levers, the list card**

👤 `[FACE]` Four levers make that fast and cheap.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) to the face. `kt-keyword-pop` "4 LEVERS" ON "four" (`knock-pop`). Captions OFF for the hold. Then the `kt-list-card` C3 slides in from the right over everything (`fast-swoosh`, face gone under it).
🗣️ `[COVER]` Continuous batching, requests join and leave mid-flight, so the GPU never idles. Caching, PagedAttention cut wasted cache memory to near zero, and a shared prompt prefix is computed once. Quantization, 8-bit halves the weights, 4-bit quarters them, so it fits a smaller card. Speculative decoding, a small model drafts, the big one verifies in one pass, same output.
🎬 `[SHOW]` C3, the paper list card: four items pop ON their spoken names, each on `ting`, earlier items stay and hover: "CONTINUOUS BATCHING" · "CACHING" (small sub-line: PagedAttention · prefix caching) · "QUANTIZATION" (sub-line: 16-bit -> 8-bit -> 4-bit) · "SPECULATIVE DECODING". Flat fills, no stroke, on the crumpled paper; the 2023 card held two items, so slide-builder lays four out as two rows of two or four stacked rows, caps sized to fit. Every sub-line word traces to DATA.md pillar 3.
🔍 `[VERIFY]` No multiplier is spoken or shown for quantization, speculative decoding or vLLM (do-not-air rows 5, 6, 7). "near zero" = the PagedAttention abstract's "near-zero waste in KV cache memory".
💬 `[NOTE]` Pronunciation: "PagedAttention" as one word, "paged attention".

**Beat 2 - the engine**

🗣️ `[COVER]` All of that lives in the inference engine, vLLM, SGLang, TensorRT-LLM, or on a laptop, Ollama and llama.cpp.
🎬 `[SHOW]` `kt-whip-cut` (`ea-glitch-21`, tech b-roll) off the card onto Envato b-roll of a GPU server rack / data-center aisle. `kt-headline-over-broll`, the two-line sentence form, mid-frame: "THE INFERENCE ENGINE" in the accent over "vLLM · SGLang · TensorRT-LLM · Ollama · llama.cpp" in white, smaller; the pop lands ON "engine" with `knock-pop`, ONE sound (the cut's `ea-glitch-21` is the other event). Captions OFF for the headline hold (the headline sits mid-frame where the names are already written). (Mike, 2026-10-26: this line moved from FACE to COVER.)
💬 `[NOTE]` Say the names as: "vee-L-L-M", "S-G-Lang", "Tensor-R-T L-L-M", "Ollama", "llama dot C-P-P". Spellings on screen per DATA.md section 3: vLLM (lowercase v), SGLang, TensorRT-LLM, Ollama, llama.cpp.

**Beat 3 - hosted vs self-hosted (the side-panel pair, C16)**

🗣️ `[COVER]` Hosted, you pay per token and the vendor runs the GPU.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto b-roll of an API console or a request log scrolling. `kt-side-panel` PAPER variant on the right (`whoosh-4` ON the panel entry): "HOSTED" over "PAY PER TOKEN" over "THEIR GPU". The b-roll translates left, no scale.
👤 `[FACE]` Self-hosted, you pay for the card, and that pays off when the card stays busy.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) to the face, the face shifts RIGHT. `kt-side-panel` DARK variant on the LEFT (`swoosh-2` starting 0.07 s before the panel moves; the text rise 0.23 s later is silent): "SELF-HOSTED" over "PAY FOR THE GPU" over "YOUR MODEL, YOUR ENGINE", hovering. Left on purpose so the two panels read as the pair C16 describes. Held to the CH4 whip.
🔍 `[VERIFY]` No crossover number (requests per day, utilisation percent) is spoken or shown; the line stays conditional (do-not-air row 14, Open question 2).

> [!IMPORTANT]
> CH3 verify list:
> - "continuous batching: requests join and leave mid-flight" = NVIDIA 2023 in-flight batching ("rather than waiting for the whole batch to finish"); origin Orca, OSDI 2022 (iteration-level scheduling); vLLM feature list.
> - "PagedAttention cut wasted cache memory to near zero" = Kwon et al., arXiv:2309.06180 (SOSP 2023): "near-zero waste in KV cache memory". C11 is the receipt if a capture is wanted.
> - "a shared prompt prefix is computed once" = vLLM Automatic Prefix Caching ("skip the computation of the shared part"); Anthropic prompt caching ("resuming from specific prefixes"). The 0.1x cache-read price is NOT spoken (live-drift, section 5).
> - "8-bit halves the weights, 4-bit quarters them, fits a smaller card" = Hugging Face guide section 1: "roughly 2 * X GB of VRAM in bfloat16/float16"; OctoCoder 29.0 -> 15.2 -> 9.5 GB; "4-bit quantization allows the model to be run on GPUs such as RTX3090, V100, and T4". No speed claim (row 5).
> - "a small model drafts, the big one verifies in one pass, same output" = Leviathan, Kalman, Matias, arXiv:2211.17192 ("without any changes to the outputs", "generating several tokens concurrently"); NVIDIA 2023 ("a 'cheaper' process to generate a draft continuation").
> - The five engines and their one-line roles = DATA.md pillar 3 (vLLM docs, SGLang GitHub, TensorRT-LLM GitHub, Ollama GitHub on the llama.cpp backend, llama.cpp GitHub).
> - "hosted: pay per token" = T3; "self-hosted: pay for the card, pays off when it stays busy" = pillar 3, conditional, no number.

---

## CH4 - WE DO THIS EVERY DAY
**Register:** gear 2 rising to gear 3 on the last line. Mike's own pipeline, in the first person ("I", "my", never "we" / "our"; Mike 2026-10-26), opened by ONE bridge line that tells the viewer what the pipeline is. Our own code, cited by file path on screen; the numbers are read off the file and the log on screen. The hardware is NEVER named, spoken or on screen (Mike 2026-10-26: no laptop, no GPU model). One face line (the landing).
**Title card:** OFF. **Music:** Bed A continues.
**Budget:** ~37 s, ~104 spoken words.

**Beat 1 - the bridge + Whisper on my own GPU (self-hosted)**

🗣️ `[COVER]` I run an AI pipeline that edits videos like this one, so here's what inference looks like in practice.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) onto Envato b-roll of a video timeline / editing workstation, no headline (the bridge line carries itself).
🗣️ `[COVER]` Every clip I transcribe runs OpenAI Whisper on my own GPU. Self-hosted inference.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto C4: the editor view of `video-creation/shorts/_tooling/whisper_jobs.py` cropped to line 1 ("load the model ONCE, run every window") and lines 122 to 133 (`device = ... "cuda"`, `whisper.load_model(...)`), the file's own punctuation captured, nothing retyped. NOT lines 3 to 6: the docstring there names the laptop card and carries the old 20.5 s figure. `kt-side-panel` PAPER variant on the right (`whoosh-4` ON the panel entry is the cut's sound, so the panel rides it): "SELF-HOSTED" over "WHISPER MEDIUM" over "MY OWN GPU", with the CHIP / GPU icon (`kt-icon-pop`, slides left in from the right edge into the panel, riding the same `whoosh-4`).
🗣️ `[COVER]` Loading the model costs around 15 to 20 seconds, so my pipeline loads it once and runs every clip through it. Keep the weights hot, batch the work.
🎬 `[SHOW]` On "seconds" cut to C5: a real terminal with the log line `[whisper_jobs] medium.en loaded on cuda in 14.2s (77 job(s))` from `video-creation/shorts/kcc20-live/ai-replaces-engineers-this-year/_qa/sweep.log`, 2 to 3 s (no `nvidia-smi`: it names the card), then back to C4 with the panel text swapped to "LOAD ONCE" over "RUN EVERY CLIP" (the paper panel's card-style text swap, silent; the panel stays). The numbers on screen are the log's, never typed into a graphic.
🔍 `[VERIFY]` Spoken "around 15 to 20 seconds" covers the logs' 13.9 to 17.5 s and the 2026-08-19 docstring measurement of 20.5 s; never say "20.5" as the current number (do-not-air row 8, Open question 5). The C4 crop excludes the docstring lines that carry 20.5 s and the card name.

**Beat 2 - the headless Claude agents (hosted)**

🗣️ `[COVER]` And every AI agent my pipeline spawns, around 20 per video, is a Claude session billed per token. Hosted inference.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto C6: `video-creation/longform-edited/graph/common.py` lines 446 to 448 and 484 to 487 (`def spawn_agent`, the `claude -p --agent ... --output-format text` command, the "spawning headless agent" print). On "around 20" cut to C7: a terminal `ls video-creation/longform-edited/graph/data/ | grep growth-vs-product` listing the 20 longform-lane agent logs. `kt-side-panel` PAPER variant on the right (`whoosh-4` ON the panel entry): "HOSTED" over "CLAUDE, BILLED PER TOKEN", with the DOLLAR icon (`kt-icon-pop`, slides up from the bottom edge into the panel, riding the panel's `whoosh-4`).
🔍 `[VERIFY]` The log count is live: growth-vs-product left 20 longform-lane logs (32 with vertical + short) on 2026-10-25, logs rotate when projects close; re-list on capture day and let the spoken "around 20" stand only if the listing still shows it (do-not-air row 9, Open question 6). Never "hundreds of calls". "per video" here = per longform video (the vertical and short lanes add more).

**Beat 3 - the landing**

👤 `[FACE]` I have never trained a model. Everything my pipeline does with AI is inference.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) to the face, a hard 15 to 20 percent punch-in on "Everything". `kt-keyword-pop` punch variant: "NEVER TRAINED A MODEL" in white with the drop shadow, `punch-sound-effect` ON the first frame, ON "never". Held through the tight pair, cut under the CH5 whip. Captions OFF for the hold.
🔍 `[VERIFY]` "never trained a model" = DATA.md T5 (repo grep for `fine-tun`, `.fit(`, `Trainer(`, `model.train(`, `backward()`, `optimizer.step`: no training loop, three text matches only).
💬 `[NOTE]` Mike, 2026-10-26: CH4 rewritten in the first person with the bridge line, the hardware unnamed; CH1 to CH3 untouched (already reviewed).

> [!IMPORTANT]
> CH4 verify list:
> - Whisper on Mike's own GPU via CUDA (the card is NEVER named, spoken or on screen: Mike 2026-10-26) = `whisper_jobs.py` lines 3 to 6 (docstring), line 122 `device = ... "cuda"`, line 133 `whisper.load_model(...)`; `transcribe.py` lines 16 to 31; `.claude/agents/shared/transcriber.md` ("Whisper medium, GPU"). Live 2026-10-25: `nvidia-smi` "NVIDIA GeForce RTX 4070 Laptop GPU, 8188 MiB", `torch 2.11.0+cu128`, CUDA available.
> - "load the model once, run every window" = the docstring line 1 and `remotion-shorts-build/SKILL.md` row 7a ("ONE model load, never one whisper invocation per window").
> - "around 15 to 20 seconds" = docstring 20.5 s (2026-08-19) + logs 14.2 / 17.5 / 13.9 / 14.9 s (`sweep.log`, `sweep2.log`, `verify3.log`, `stt2.log`).
> - Whisper medium = 769 M parameters, ~5 GB VRAM, MIT license (openai/whisper README, C14).
> - "every headless agent is a Claude session, billed per token" = `common.py` `spawn_agent` (`claude -p --agent`), Claude Code headless docs (`-p`, `total_cost_usd`), T3 pricing per token.
> - "around 20 per longform video" = 20 agent logs on the longform lane of growth-vs-product (2026-10-23); 11 `C.spawn_agent(` call sites + one parallel dispatch of up to 5 builders in `longform_graph.py`.
> - Not spoken (cut for runtime, still true): ChatGPT images (`repurpose/gen_images.py`), Higgsfield MIKE-CLONE voice, ElevenLabs lip-sync are also hosted inference (pillar 4). Available as an ad-lib receipt C18 if Mike adds the line.

---

## CH5 - THE CLOSE
**Register:** gear 3, declarative, conditional upside. Two face lines (the bill lands on inference; the subscribe close).
**Title card:** OFF. **Music:** Bed A continues to the last frame; ducked -14 dB under CLIP-3 automatically (clip-inserts.md), back up on the resume line, no change at the close (the placement strategist decides whether the track's `epic_hit` ending is right-aligned to the last word; see MUSIC-MOOD-PLAN).
**Budget:** ~32 s + 5.1 s clip, ~85 spoken words.

**Beat 1 - the 2026 twist: reasoning is inference-time compute**

🗣️ `[COVER]` Now, the 2026 twist. Reasoning models think before they answer, and that thinking is extra tokens, billed as output by OpenAI and Anthropic alike.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) onto b-roll of a chat UI in its "thinking" state, then streaming (tech b-roll, `ea-glitch-21` ON the cut). `kt-headline-over-broll` "THINKING TOKENS" pops mid-frame 0.8 s after the cut (`knock-pop`). On "billed as output" a 2 s flash of C9: the OpenAI reasoning guide paragraph "While reasoning tokens are not visible via the API, they still occupy space in the model's context window ... are billed as output tokens", cropped, real pixels.
🔍 `[VERIFY]` If the effort knob is named on screen, name `effort` (OpenAI `reasoning.effort`; Anthropic adaptive thinking + `effort`), never `budget_tokens` (deprecated on Claude 4.6, rejected on 4.7 and later; Open question 4). Never "reasoning tokens are hidden" as a universal (row 12): visibility differs by vendor, billing does not.
👤 `[FACE]` So the cost of a request now depends on how hard the model thinks, and that bill lands on inference.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) to the face. `kt-keyword-pop` punch variant: "LANDS ON INFERENCE" in the accent red with the glow, `punch-1-2023` ON "inference". Captions OFF for the hold.

**Beat 2 - the third voice (CLIP-3, Convention 6)**

🗣️ `[COVER]` Jensen Huang, NVIDIA's CEO, stood on the GTC stage in 2025 and named the hard problem.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto the clip's lead-in still (a frame of the GTC 2025 stage from the NVIDIA upload, no restyle). The spine pauses on the last word of this line.
🎞️ `[INSERT]` CLIP-3: Jensen Huang, 5.1 s with his own voice (YouTube `_waPvOwL9Z8`, 54:18.9 to 54:24.0), the spine pauses after the set-up line; burned caption "Jensen Huang, NVIDIA CEO, GTC keynote, March 2025, projecting demand for his own chips". Transition in and out (`hand:fade` 0.5 s default), bed ducked -14 dB for the window.
🗣️ `[COVER]` He sells the chips that run it, so keep that in mind. On the engineering, he is right.
🎬 `[SHOW]` Lead-out still of the stage, then `kt-whip-cut` (`whoosh-4`) to the face for the close.
💬 `[NOTE]` Mike rules CLIP-3 at GATE 1 (OPEN QUESTIONS 6). If REJECTED, the whole of Beat 2 goes and Beat 1's face line whips straight into Beat 3; nothing else changes. Mike never reads the clip's words; the set-up names the moment, the clip says the line.

**Beat 3 - the subscribe close**

👤 `[FACE]` Click the subscribe button, and the next one in this playlist is right here.
🎬 `[SHOW]` `kt-subscribe-close`: the SUBSCRIBE button grows on the chest ON "subscribe" (keyed `subscribe-button.mp4`, `cartoon-accent` 0.011 s before its first frame, `subscribe-button` landing 0.26 s after it reaches full size); the red playlist arrow pops where Mike points ON "right here" (`arrow-red.png`, Zoom Bounce, `cartoon-accent` on the pop), pointing at the end-screen slot. The video ends ON the last word (no held still, house rule) unless Mike asks for a 2 to 3 s arrow hold for the YouTube end-screen element (OPEN QUESTIONS 5).
💬 `[NOTE]` Mike points to the side where the end-screen playlist element will sit; mirror `arrow-red.png` if he points left. If Mike calls a HARD-OUT instead: the take ends on "he is right." (or on "lands on inference." if CLIP-3 is out) and the edit cuts to black on the bed's hit, no button, no arrow.

> [!IMPORTANT]
> CH5 verify list:
> - "reasoning models think before they answer, extra tokens, billed as output" = OpenAI reasoning guide ("internal reasoning tokens", "billed as output tokens", "a few hundred to tens of thousands of reasoning tokens"); Anthropic extended thinking ("Thinking tokens count toward the `max_tokens` limit", `usage.output_tokens_details.thinking_tokens` "reports how many of the billed output tokens were internal reasoning"). Receipts C9, C10.
> - "the cost of a request depends on how hard the model thinks" = both vendors' effort knobs (OpenAI `reasoning.effort`: "Lower effort favors speed and lower token usage"; Anthropic: "at the cost of increased latency", adaptive thinking "might skip thinking entirely on easy inputs").
> - CLIP-3 words, verbatim from the local Whisper transcript of the pulled audio (DATA.md section 6): "it is the ultimate extreme computing problem and it's called inference" (54:18.9 to 54:24.0). Context: inside the Grace Blackwell NVL72 rack pitch; a sales setup. The caption carries that. `capture_clip_insert.py --expect "it's called inference"` re-verifies at capture.
> - "He sells the chips" = DATA.md section 6 context check and do-not-air row 11 (vendor CEO projecting demand for his own product). Said as Mike's own line, in the resume.
> - The close names no crypto community and no CryptoRich link (channel rule).

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover. Mike rules each row at GATE 1. DATA.md section 6 found three real clips, all Jensen Huang at the NVIDIA GTC 2025 keynote (`_waPvOwL9Z8`); in a 2:00-shaped video only the 5.1 s tight cut earns its seconds, and even that is Mike's call._

| id | Who / what plays (verbatim words) | Source + timecodes | Length | Lands (chapter / beat, after which set-up line) | Burned caption | Status |
|---|---|---|---|---|---|---|
| CLIP-1 | Jensen Huang, NVIDIA CEO: "The amount of computation we need at this point as a result of agentic AI, as a result of reasoning, is easily a hundred times more than we thought we needed this time last year." | https://www.youtube.com/watch?v=_waPvOwL9Z8 12:54.4-13:08.1 | 13.7 s | not placed | Jensen Huang, NVIDIA CEO, GTC keynote, March 2025, projecting demand for his own chips | REJECTED: 13.7 s is around 8 percent of a 2:50 video and its "100 times" is a vendor demand projection the do-not-air table bars as a fact; the 2026 point is already carried by the OpenAI / Anthropic billing receipt (C9) in Mike's own words |
| CLIP-2 | Jensen Huang, same keynote: "we now have to compute ten times faster. And so ten times tokens, ten times faster, the amount of computation we have to do is ten, a hundred times more easily. And so you're going to see this in the rest of the presentation, the amount of computation we have to do for inference is dramatically higher than it used to be." | https://www.youtube.com/watch?v=_waPvOwL9Z8 15:59.4-16:18.0 (tight 16:02.7-16:18.0, 15.3 s) | 18.6 s (15.3 s tight) | not placed | same | REJECTED: too long for the shape at either window, and the "ten, a hundred" arithmetic is his own framing, not a benchmark; the 4.1 s mechanism lead-in (15:19.1-15:23.2) says what CH5 Beat 1 already says in Mike's voice |
| CLIP-3 | Jensen Huang, same keynote: "it is the ultimate extreme computing problem and it's called inference" | https://www.youtube.com/watch?v=_waPvOwL9Z8 54:18.9-54:24.0 (the tight cut of 54:13.2-54:40.8) | 5.1 s | CH5 Beat 2, after "...stood on the GTC stage in 2025 and named the hard problem." | Jensen Huang, NVIDIA CEO, GTC keynote, March 2025, projecting demand for his own chips | PROPOSED (around 17 s all in with its set-up and resume lines; Mike rules in or out, OPEN QUESTIONS 6) |

## MUSIC-MOOD-PLAN

_Mike's instruction (2026-10-25) binds this table: ONE track, `story-of-my-life`, for the entire video, from frame 0 to the last frame, no different music per chapter, no breath and no bed change at any chapter boundary, ducked under the VO and the pops, never stopped for a pop (the 2023 pattern). One row per chapter only because the schema wants a row; every row is the same file and the same continuous region. Title cards fall out of this: NONE._

| CH | Mood + gear | Subtle / aggressive | New bed? | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 | hopeful, driving rock, gear 3 hook | medium (aggression 52): the file opens with a 10 s mid-level build then sits on a high peak; the frame-0 whip rides the build | **Bed A starts at frame 0** (the ONLY bed) | `story-of-my-life` (Bobo Renthlei, "Story Of My Life", instrumental, 183 s, 95 bpm, E major, Rock, Hopeful / Inspiring / Happy, Building / Soaring; `assets/music/Story Of My Life/Bobo_Renthlei_Story_Of_My_Life_instrumental_3_02.mp3`; opening `build`, ending `epic_hit`, roles intro_hype / hype_peak / epic_outro; `yt_license_code` JHUOMEAL020BQT7K goes in the YouTube description) |
| CH2 | steady explainer under the diagram, gear 2 | ducked under the VO; the high peak reads as pace, not hype, at bed level | continues (same file, same region, no breath) | `story-of-my-life` |
| CH3 | brisk, the list card and the pops ride the drums, gear 2 | ducked; never stopped for a `ting` or a pop | continues | `story-of-my-life` |
| CH4 | rising, the own-code receipts and the punch landing, gear 2 to 3 | ducked; back up slightly on the FACE landing per the placement strategist | continues | `story-of-my-life` |
| CH5 | the close, gear 3 | ducked -14 dB automatically under CLIP-3 (if approved), up on the resume; the `epic_hit` ending lands on the last word if the in-point is right-aligned | continues to the last frame | `story-of-my-life` |

**Usage ledger (run 2026-10-25, `usage_ledger.py report --what music --exclude-project "inference"`):** previous video growth-vs-product used proton-streams / innovation / up-in-the-atmos (BLOCKED); the last three videos' tracks are avoided. `story-of-my-life` has `used_in: []` (fresh, added to the catalog 2026-07-16, analyzed 2026-10-25), so it is not blocked, not recent, and the ledger cannot object. If the `music_plan` gate asks for per-chapter variety, Mike's one-track instruction above is the waiver (`usage_waivers`).

**Handed to `music-placement-strategist` (after the spine exists):** the exact in-point (0 s so the 10 s build rides CH1's hook, or right-aligned so the `epic_hit` ending lands on the last spoken word; the file is 183 s, longer than any take in the window, so NO loop and ONE continuous region either way), the dB under VO, the duck depth under every pop and the band / card sounds, the CLIP-3 duck window from the sidecar, and the breath-free chapter joins. No carving here.

## VISUAL-PLAN

### Chapter themes (Convention 4b: ONE bed, so ONE look for the whole video)

💬 `[NOTE]` CONTAINER THEME = LIGHT for this video (Mike, 2026-10-25, GRAPH-PROGRESS.json `settings.container_theme`): every CSS container, the C1 diagram, the chart states and the slide-built list-card / panel text use `container-canonical-light.css` (warm off-white, near-black text, darkened accents: the cyan below becomes #006A9E on containers). The kinetic-text devices keep their own looks (dark band and dark panel beside the face, paper beside b-roll).
| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 to CH5 | #00c2ff (cyan, house) for the pops, bands, panels, list-card titles, the diagram's lit nodes and the four icons; the two punch words keep the device's accent red with the glow | Envato tech b-roll only (data-center aisles, GPU boards, code editors, a tokenizer split, a chat UI thinking and streaming, an API console); no ChatGPT images needed; receipts and real marks keep their real pixels | one continuous bed means no visual chapter change either; the chapters are told apart by their covers (b-roll / diagram / paper card / our own files / the clip), not by a palette shift. Mike may swap the cyan for the channel's own accent at GATE 1 |

- **The signature open (CH1 Beat 1):** frame 0 is Mike; "TRAINING" (`cash-register`) and "INFERENCE" (`wooden-rattle-whoosh`) pop on the right third on their words; whip out on `whoosh-4`.
- **C1, THE system-design diagram (CH2 Beats 2 to 3, the only one; only if Mike rules it in):** PROMPT -> TOKENIZER -> TOKEN IDS -> PREFILL -> KV CACHE -> DECODE loop -> NEXT TOKEN -> STOP; TTFT bracket over prefill, TPOT bracket over one decode step; two lit states (prefill + cache filling; decode + cache reload pulse). Code-rendered, labels per DATA.md section 3. Fallback: the `kt-list-card` with PREFILL / DECODE items.
- **C2, TRAINING vs INFERENCE contrast (CH1):** feeds the signature-open labels and the "TRAINED ONCE" headline; not shown as a table.
- **C3, the paper list card (CH3 Beat 1):** four items on `ting`, sub-lines from pillar 3; slide-builder lays out four items (the 2023 card held two).
- **C16, the side-panel pair (CH3 Beat 3):** PAPER right "HOSTED / PAY PER TOKEN / THEIR GPU" beside b-roll; DARK left "SELF-HOSTED / PAY FOR THE GPU / YOUR MODEL, YOUR ENGINE" beside the face.
- **Receipts of OUR OWN FILES (CH4):** C4 `whisper_jobs.py` docstring (editor view, lines 1 to 12), C5 the terminal log line `loaded on cuda in 14.2s (77 job(s))`, C6 `common.py` `spawn_agent` (lines 446 to 448, 484 to 487), C7 the `ls | grep growth-vs-product` listing of the 20 agent logs. Real pixels, nothing retyped; the numbers on screen are the files' own.
- **External receipts, brief flashes, real-site, never restyled:** C17 IBM Research "up to 90%" (CH1 Beat 3, makes the estimate airable), C9 OpenAI "billed as output tokens" (CH5 Beat 1), C8 Anthropic pricing row labels (CH2 Beat 1, optional). C10 to C15 stay as sources in the verify boxes; they are not planned on screen (Mike may add any of them).
- **Headline pops over b-roll:** "TRAINED ONCE" (CH1), "UP TO 90%" (CH1), "THINKING TOKENS" (CH5). Keyword pops on the face: "EVERY REQUEST" (punch red), "4 LEVERS", "THE INFERENCE ENGINE" + the five names, "NEVER TRAINED ANYTHING" (punch white), "LANDS ON INFERENCE" (punch red). Band: "TIME TO FIRST TOKEN = PREFILL" -> "TIME PER OUTPUT TOKEN = DECODE". Panels: TOKEN IDS / BILLED PER TOKEN (paper, CH2), the C16 pair (CH3), SELF-HOSTED + LOAD ONCE / RUN EVERY WINDOW (paper, CH4), HOSTED / CLAUDE, BILLED PER TOKEN (paper, CH4).
- **Icons (`kt-icon-pop`, flat SVG in the accent, Mike rules the set at GATE 1):** TOKEN (CH2 Beat 1 panel), CLOCK (CH2 Beat 4, on the chest), CHIP / GPU (CH4 Beat 1 panel), DOLLAR (CH4 Beat 2 panel).
- **Clip lead-in / lead-out stills (CH5 Beat 2):** a frame of the GTC 2025 stage from the NVIDIA upload, caption-free, if CLIP-3 is approved.
- **The close:** `kt-subscribe-close` button on the chest + the red playlist arrow where Mike points; no end card, no logo bug, no community lower-third (channel rule).

## OPEN QUESTIONS / NEXT SESSION

1. **Title.** Scripted: "AI Inference Explained in 2 Minutes". Alternates: "What AI Inference Actually Is" · "Training Happens Once. Inference Is Everything After." (If the take lands near 2:50, the "2 Minutes" title still reads true enough for YouTube, but Mike decides.)
2. **The signature open with TRAINING / INFERENCE labels:** yes or no. Scripted YES (CH1 Beat 1, `cash-register` on TRAINING, `wooden-rattle-whoosh` on INFERENCE). If NO, the hook line stays locked and the two words become two `kt-keyword-pop` `knock-pop` pops on the face.
3. **C1 diagram or list card for CH2.** Scripted: the ONE diagram (prefill -> KV cache -> decode is a flow with arrows and a loop, which is exactly what a system-design container does well and a list cannot). Fallback written into CH2 Beat 2's note: the `kt-list-card` with PREFILL / DECODE on `ting`.
4. **The icon set:** chip / GPU, token, clock, dollar, placed in CH2 (token, clock) and CH4 (chip, dollar). Yes, no, or fewer.
5. **CTA close vs hard-out, and the ending frame.** Scripted: `kt-subscribe-close` with the playlist arrow, ending ON the last word (house rule, no held still). The 2023 video held the arrow 2.7 s to the last frame; a YouTube end-screen element needs a few seconds of picture, so Mike decides: end on the word, or hold the arrow 2 to 3 s for the end-screen. Hard-out alternative written in CH5 Beat 3's note.
6. **CLIP-3 in or out.** 5.1 s of Jensen Huang ("...it's called inference") after "Jensen Huang, NVIDIA's CEO, stood on the GTC stage in 2025 and named the hard problem." Costs around 17 s all in (set-up + clip + resume) and a spine pause with the bed ducked, which is the one place the 2023 continuous-bed pattern breaks. In: a third voice confirms the thesis with the "he sells the chips" line. Out: the video lands around 2:36 and the bed never dips. CLIP-1 and CLIP-2 REJECTED on length and on the do-not-air "100x" framing.
7. **Runtime.** As written: around 475 words, around 2:48 with CLIP-3, around 2:36 without, against a 2:00 target and a 3:00 ceiling; the brief's own budget was 340 to 480 words. The lines are already the fewest that carry the five pillars; if Mike wants 2:00 flat, the candidates to drop BEFORE recording (never after) are: CH1 Beat 3's stakes line (the 90 percent estimate and C17), CH3 Beat 3's two-line hosted / self-hosted pair, CH5 Beat 2 (CLIP-3). Any one of those saves 10 to 17 s.
8. **Handoff line into the body:** scripted NONE (the 2023 shape whips straight from the hook into the body; brief: no preamble). If Mike wants one at the end of CH1, rotated per persona `dive_in_variants` (never the most recent "So, let's break it all down."): "So, let's dive into all this." (approved) · "So, let's get into it." (proposed) · "So, let's take this from the top." (proposed). Record his pick back into persona.json the same turn.
9. **Captions during the band and panel holds.** The brief turns captions OFF for every keyword pop (the pop lands in the caption zone). The lower-third band in CH2 Beat 4 sits in the same zone, so this screenplay turns captions OFF for the band hold too (the band text is the caption). Side panels sit beside the picture, captions stay ON under them. Mike confirms or overrides.
10. **No "go back and rewatch" line.** The CH2 prefill / decode beat is the one dense mechanism, but a 2-minute straight-to-the-point explainer has no runtime to spend on a 23-word replay invitation; the rule allows zero (screenplay.md Register). If Mike wants it, it goes right after CH2 Beat 4 as its own 🗣️ `[COVER]` line with the J-key wording (an engineer audience watches on a computer).
11. **External receipts under the 2023 cover palette.** The brief lists b-roll, the paper card, our own files and one diagram; this screenplay adds three brief real-site flashes (C17 IBM "up to 90%", C9 OpenAI "billed as output tokens", C8 pricing row labels) because a spoken estimate and a billing claim want their source on screen. Strike any of them at GATE 1 and the spoken line stands on its DATA.md source alone.
12. **The accuracy pass (mandatory before Mike records).** Every claim above maps to a DATA.md row (the chapter verify boxes); the LIVE re-pull on record day covers the volatile rows: Anthropic and OpenAI billing wording ("Base input tokens" / "Output tokens"; "Prices per 1M tokens"), the OpenAI reasoning guide's "billed as output tokens" paragraph (C9), the Anthropic extended-thinking page (name `effort`, never `budget_tokens`), the agent-log listing for "around 20" (C7, logs rotate), the live `nvidia-smi` / torch read for C5, and the IBM Research paragraph for C17. The 🔍 `[VERIFY]` lines in the chapters are the same list, in place.
13. **Live 🔍 `[VERIFY]` checklist carried from DATA.md section 5 (nothing here is spoken as a price):** Claude Sonnet 4.6 / Opus 4.6 / Opus 5.5 / Sonnet 5.5 / Fable 5.1 / Haiku 4.5 per-MTok prices and the prompt-caching multipliers (0.1x read, 0.05x / 0.025x on the newest models, 1.25x write) · OpenAI gpt-6-astra / gpt-5.5-pro prices · OpenAI effort values "none, minimal, low, medium, high, xhigh, and max" · Anthropic minimum thinking budget 1,024 tokens · GPU `NVIDIA GeForce RTX 4070 Laptop GPU, 8188 MiB, driver 596.36` · `torch 2.11.0+cu128` · agent logs 20 / 32 (growth-vs-product), 44 (evals).
14. **Pronunciations for the take (also on the 💬 lines):** "whisper jobs dot pie"; "vee-L-L-M"; "S-G-Lang"; "Tensor-R-T L-L-M"; "llama dot C-P-P"; "paged attention" as one word; "G-T-C".
