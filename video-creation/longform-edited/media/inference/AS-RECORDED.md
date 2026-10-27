# inference - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence 700 ms with a 50 ms cover-only pad -> NO burst removal (Mike: no bursts) -> two-zone desilence 250 ms intro / 450 ms body, 50 ms cover-only pad -> Adobe Enhance Speech v2 audio swap, no retime). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.d.desilenced.mp4` - 190.40s (3:10.40), 1080p30 (ffprobe: r_frame_rate 30/1, format duration 190.400; audio 190.38 s, the 20 ms tail carried since the export). LOCKED (GATE spine APPROVED by Mike 2026-10-26, "i approve it, please continue"). Audio = the Adobe-enhanced track (original kept as `spine/enhance/ALL.d.desilenced.original-audio.*`).
- **Transcript (cue source):** `spine/ALL.d.desilenced.medium-words.json` (Whisper medium, word-level, 541 words, 32 segments, re-run on the enhanced audio, NOT hand-edited). Human-review breakdown: `spine/ALL.d.desilenced.segments.txt`.
- **Timecode chain:** `raw/2026-10-26 12-23-45.mkv` (17:32.5) -> `spine/ALL.lowbps.mp4` (re-encode, no retime) -> `spine/ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 27 cuts / 28 keeps, 17:32.5 -> 553.7 s) -> `spine/ALL.b.blackout.mp4.cover.json` (a -> b: picture blackout only, 73.4 percent blacked, audio md5 identical, no retime) -> `spine/ALL.c.desilenced.map.json` (b -> c: 48 cuts / 49 keeps, 357.59 s removed, 553.7 -> 196.1 s, `pad_cover_only`, 8 face windows) -> `spine/ALL.d.desilenced.map.json` (c -> d: 15 cuts / 16 keeps, 5.95 s removed, 196.33 -> 190.38 s, `pad_cover_only`, 8 face windows) -> Adobe Enhance (`spine/enhance/`, audio replaced at identical length 190.380 s, no retime). **Every timecode below is already a FINAL-spine coordinate (`ALL.d.desilenced.mp4`); the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `ALL.a.defumbled` -> `ALL.b.blackout` -> `ALL.c.desilenced` -> `ALL.d.desilenced` (enhanced audio swapped in place).

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on the FINAL spine picture (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face 50.30 s of 190.40 s = **26.4% / cover 73.6%**. 8 windows against a `--face-max 10` budget and 8 scripted `[FACE]` lines. **Zero orphans:** every window lands on a scripted `[FACE]` beat.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-6.467 | "So every AI model gets trained once and everything anyone does with it afterwards is inference." | CH1 Beat 1 `[FACE]` (`[SAY-EXACT]`) |
| 2 | 11.933-16.900 | "Inference is those frozen weights running against brand new input on every single request." | CH1 Beat 2 `[FACE]` |
| 3 | 61.300-66.933 | "Those are the two numbers you feel. Time to first token is prefill. Time per output token is decode." | CH2 Beat 4 `[FACE]` |
| 4 | 67.733-70.267 | "Here are the four levers that make that fast and cheap." | CH3 Beat 1 `[FACE]` |
| 5 | 108.767-113.067 | "Self-hosted. You pay for the card and that pays off when the card stays busy." | CH3 Beat 3 `[FACE]` |
| 6 | 141.933-147.700 | "I have never trained a model. Everything my pipeline does is AI inference." | CH4 Beat 3 `[FACE]` |
| 7 | 158.033-164.633 | "So the cost of the request now depends on how hard the model thinks and that bill lands on inference." | CH5 Beat 1 `[FACE]` |
| 8 | 176.367-190.400 | "Make sure you click that subscribe button ... So click into this playlist about Python and I'll catch you there." | CH5 Beat 3 `[FACE]` (the subscribe close, ad-libbed longer) |

Note: the picture has a 0.80 s BLACK gap at 66.933-67.733 between windows 3 and 4. The ad-lib "The levers." (67.08-67.66) sits INSIDE it, so it is COVER, not face (the transcriber's F4 starts at 67.08 on the words; the picture starts it at 67.733). The comp covers that 0.8 s (the CH3 chapter whip is the natural home).

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- 7.56 "leaning" -> "learning" (probable mishear; the phrase as said reads "learning on its weights").
- 36.42 "Pre -fill" -> "prefill" (also 46.62 and 64.08; one word, lower case mid-sentence).
- 47.36 "compute bound" -> "compute-bound"; 59.90 "memory bound" -> "memory-bound" (hyphenated, the DATA.md / vLLM wording).
- 54.90 "can" -> "can't" (PROBABLE, VERIFY BY EAR: Whisper is confident on "can" (p 0.98) on both the original and the enhanced audio, the defumbler flagged it as a possible misspeak; the word runs 0.30 s, consistent with an elided "can't" before "skip". If Mike really said "can", it is a misspeak that inverts the guard, see Flags).
- 76.64 "Pay his attention" -> "PagedAttention".
- 83.98 "8 bit" -> "8-bit"; 85.48 "4 bit" -> "4-bit".
- 98.02 "VLLM" -> "vLLM".
- 98.88 "SG -LANG" -> "SGLang".
- 100.08 "TensorRT -LLM" -> "TensorRT-LLM" (one token in the caption).
- 102.96 "LAMA" -> "Ollama".
- 104.00 "LAMA -CPP" -> "llama.cpp".
- 108.90 / 124.64 "Self -hosted" -> "Self-hosted" (one token in the caption).
- 136.30 "spawns" STAYS "spawns" (agent spawns; the persona `spon_not_spawn` rule is for the crypto token only and must NOT fire here).
- 138.88 "clause" -> "Claude".
- 165.10 "Jensen Wong" -> "Jensen Huang".
- 167.26 "out" in "stood out on a GTC stage": left as heard (slip or mishear, see Flags); never write "stood out" on screen.
- 187.90 "playlist by" -> "playlist about" (Mike by ear at the draft gate, 2026-10-27: he said "this playlist about Python"; Whisper heard "by", p 0.33).
- 24.36 "90 %" -> "90%" (caption joins the sign to the number).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - WHAT INFERENCE IS (0.00-27.60) · card OFF · Bed A (`story-of-my-life`, the one bed)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "So every AI model gets trained once and everything anyone does with it afterwards is inference." | KEPT (locked `[SAY-EXACT]` `[FACE]`, FACE 1; wording drift: a leading "So", "afterwards" for "after that") |
| 6.82 | "Training is the model learning on its weights from data one time and it costs millions." | CHANGED ("learning on its weights" for "learning its weights"; "leaning" is the Whisper mishear) |
| 12.14 | "Inference is those frozen weights running against brand new input on every single request." | KEPT (FACE 2) |
| 17.04 | "Training makes the headlines." | KEPT |
| 18.68 | "Inference is the bill, the latency, and the part you actually operate." | KEPT · guard [!WARNING 2] "inference always costs more than training" HELD (not said) |
| 22.50 | "By some estimates, up to 90% of a model's life is inference." | KEPT · guard [!WARNING 1] "90 percent as a hard stat" HELD ("By some estimates, up to") |

### CH2 - ONE REQUEST (27.60-67.08) · card OFF · Bed A continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 27.60 | "Your request never reaches the model as text." | CHANGED ("request" for "prompt"; "model" at 29.48 is low-confidence, p 0.01) |
| 30.70 | "A tokenizer turns it into IDs and the tokens are what you get billed for." | CHANGED ("IDs" for "token IDs", "the tokens" for "tokens") |
| 35.42 | "Step 1. Prefill." | KEPT |
| 37.16 | "The GPU reads your whole prompt at once and stores the keys and the values in every token in memory." | CHANGED ("the keys and the values in every token" for "the keys and values for every token") |
| 43.14 | "That's the KV cache." | CHANGED ("That's the KV cache." as its own sentence for the appended "the KV cache") |
| 44.50 | "The chip is working flat out." | KEPT |
| 46.62 | "Prefill is compute bound." | KEPT · guard [!WARNING 5] pair wording HELD (no NVIDIA attribution spoken) |
| 48.20 | "Step 2. Decode." | KEPT |
| 49.74 | "One token per step and every step reloads that whole cache." | KEPT |
| 53.56 | "Within one request, you can['t] skip ahead." | CHANGED ("can't" for "cannot"; Whisper hears "can", OPEN by ear) · guard [!WARNING 5] "within one request" HELD on the wording, the can / can't is OPEN |
| 56.16 | "Each token depends on the last." | KEPT |
| 58.16 | "The chip is waiting on memory." | KEPT |
| 59.90 | "Decode is memory bound." | KEPT |
| 61.34 | "Those are the two numbers you feel. Time to first token is prefill. Time per output token is decode." | KEPT (FACE 3; delivered as three sentences) |

### CH3 - THE LEVERS (67.08-113.20) · card OFF · Bed A continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 67.08 | "The levers." | AD-LIB (not in the script; sits in the 0.8 s black gap, COVER) |
| 67.82 | "Here are the four levers that make that fast and cheap." | CHANGED ("Here are the four levers that make that fast and cheap." for "Four levers make that fast and cheap.") (FACE 4) |
| 70.56 | "Continuous batching. Requests join and leave mid-flight so the GPU never idles." | KEPT |
| 75.94 | "Caching. PagedAttention. Cut wasted cache memory to near zero and a shared prompt prefix is computed once." | KEPT ("Pay his attention" is the Whisper mishear) |
| 83.34 | "Quantization. 8 bit halves the weights, 4 bit quarters them so it fits a smaller card." | KEPT · guard [!WARNING 4] "quantization 2 to 3x faster" HELD (not said) |
| 88.68 | "Speculative decoding. A small model drafts. The big one verifies in one pass. Same output." | KEPT · guard [!WARNING 4] "speculative decoding 2 to 3x" HELD (not said) |
| 94.96 | "All of that lives in the inference engine." | KEPT (COVER per Mike's 2026-10-26 FACE -> COVER ruling; black on the picture) |
| 98.02 | "vLLM, SGLang, TensorRT-LLM, on a laptop, Ollama, and llama.cpp." | CHANGED ("on a laptop" without the scripted "or") |
| 105.20 | "Hosted. You pay per token and the vendor runs the GPU." | KEPT |
| 108.90 | "Self-hosted. You pay for the card and that pays off when the card stays busy." | KEPT (FACE 5) |

### CH4 - WE DO THIS EVERY DAY (113.20-148.12) · card OFF · Bed A continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 113.20 | "Now with me, I run an AI pipeline and edit videos just like this one." | CHANGED ("Now with me," ad-libbed in front; "and edit videos just like this one" for "that edits videos like this one"; Mike heard it at the spine gate and approved the spine) |
| 117.44 | "So here's what inference looks like in practice." | KEPT (split into its own sentence) |
| 119.88 | "Every clip I transcribe runs OpenAI Whisper on my own GPU." | KEPT (hardware not named, Mike's 2026-10-26 rule HELD) |
| 124.64 | "Self-hosted inference." | KEPT |
| 126.08 | "Loading the model costs around 15 to 20 seconds." | KEPT · guard [!WARNING 3] "20.5 seconds as the current number" HELD ("around 15 to 20 seconds") |
| 129.40 | "So my pipeline loads it once and runs every clip through it." | KEPT |
| 132.90 | "Keep the weights hot, batch the work." | KEPT |
| 134.78 | "And every agent in my pipeline spawns around 20 per video is a Claude session billed per token." | CHANGED ("every agent in my pipeline spawns" for "every AI agent my pipeline spawns") · guard [!WARNING 3] "hundreds of Claude calls" HELD ("around 20 per video") |
| 140.70 | "Hosted inference." | KEPT |
| 142.10 | "I have never trained a model. Everything my pipeline does is AI inference." | CHANGED ("does is AI inference" for "does with AI is inference") (FACE 6) |

### CH5 - THE CLOSE (148.12-190.40) · card OFF · Bed A continues to the last frame

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 148.12 | "Now the 2026 twist." | KEPT |
| 150.14 | "Reasoning models think before they answer and that thinking is extra tokens." | KEPT |
| 154.44 | "Billed as output by OpenAI and Anthropic alike." | KEPT |
| 158.06 | "So the cost of the request now depends on how hard the model thinks and that bill lands on inference." | CHANGED ("the request" for "a request") (FACE 7) |
| 164.84 | "Jensen Huang, NVIDIA's CEO, stood out on a GTC stage in 2025 and named the hard problem." | CHANGED ("stood out on a GTC stage" for "stood on the GTC stage"; "Wong" is the Whisper mishear) |
| 171.32 | (clip insert CLIP-3 lands here; the set-up line ends "...in 2025 and named the hard problem.") | KEPT · INSERT CLIP-3 (5.1 s, the speaker's own voice; the splice is the trough after "problem", 171.32-171.46) · guard [!WARNING 4] "100 times more compute" HELD (CLIP-3 is the 5.1 s "it's called inference" cut, not the 100x) |
| 171.46 | "He sells the chips that run it, so keep that in mind." | KEPT |
| 174.56 | "And on the engineering, he's right." | CHANGED ("And ... he's right" for "On the engineering, he is right") |
| 176.48 | "Make sure you click that subscribe button and click into this playlist right here to learn more about AI engineering." | CHANGED (the subscribe close as spoken for "Click the subscribe button, and the next one in this playlist is right here.") (FACE 8) |
| 182.90 | "And if you want to become an AI engineer, you want to learn Python too." | AD-LIB (a second playlist pitch, not in the script) |
| 186.78 | "So click into this playlist about Python and I'll catch you there." | AD-LIB ("about" by Mike's ear at the draft gate, Whisper heard "by"; the take ends on "there." at 190.26) |

## Divergences from SCREENPLAY.md

- **Dropped:** no scripted line was dropped; every scripted beat in CH1 to CH5 was said. The hard-out alternative was not taken: he recorded the subscribe close. RESOLVED by the take (spine approved by Mike 2026-10-26).
- **Added (ad-libs):** 67.08 "The levers." (in the black gap, COVER) - RESOLVED (defumbler flag 2, heard and kept at GATE spine_review, spine approved 2026-10-26). 113.20 "Now with me," - RESOLVED (same approval). 182.90-190.26 the second playlist pitch "And if you want to become an AI engineer, you want to learn Python too. So click into this playlist about Python and I'll catch you there." - content, kept (spine approved); its end-screen treatment is OPEN (see Flags).
- **Changed wording (no ruling needed, the edit builds to the words above):** 6.82, 27.60, 30.70, 37.16, 43.14, 67.82, 98.02, 113.20, 134.78, 142.10, 158.06, 164.84, 174.56, 176.48. The 53.56 can / can't is OPEN for Mike's ear (defumbler flag 3; the spine approval kept the take, the caption wording still needs his call).
- **Rulings already made (RESOLVED):** CH3 Beat 2 FACE -> COVER (Mike 2026-10-26; the take is black there, matches). CH4 rewrite to first person, hardware unnamed, file name unspoken (Mike 2026-10-26; HELD on the take: no laptop / card / file name spoken in CH4). Container theme LIGHT (Mike 2026-10-25). One continuous bed, no title cards (Mike 2026-10-25). Adobe Enhance audio swapped in (Mike 2026-10-26). GATE spine APPROVED (Mike 2026-10-26).
- **Guards:** every `[!WARNING]` do-not-air claim HELD on the take: (1) 90 percent at 22.50 said with "By some estimates, up to"; (2) "always costs more" not said; (3) the model load at 126.08 is "around 15 to 20 seconds", the agents at 134.78 "around 20 per video"; (4) no 100x, no 2 to 3x spoken; (5) "Within one request" at 53.56 HELD on the wording, with the can / can't OPEN by ear (if he said "can", the sentence inverts the guard's meaning and the caption must not tidy it into a claim he did not make).
- **Clip inserts (Convention 6):** CLIP-3 set-up line said -> KEPT at 171.32 (splice in the trough after "problem", 171.32 to 171.46). Its GATE 1 in/out ruling is not written in PROJECT-LOG (GATE 1 was approved by the recording; the screenplay row still reads PROPOSED) - OPEN for Mike to confirm at GATE plan. CLIP-1 and CLIP-2 REJECTED in the screenplay, not placed.

## Flags carried into the edit

- 22.50 fact-framing trap: the VO says "up to 90% of a model's life is inference"; the on-screen graphic must carry the estimate framing (IBM Research receipt C17, "by some estimates" / "up to"), never "90% of AI cost" or "90% of compute" (DATA.md do-not-air row 1).
- 46.62 / 59.90 fact-framing trap: "compute bound" / "memory bound" is vLLM's pair; any on-screen attribution cites vLLM, never NVIDIA (do-not-air row 15).
- 53.56 ambiguous audio: "you can['t] skip ahead" (Whisper "can", p 0.98). Mike listens at 54.90 before captions; the list card / graphic shows "one token at a time, within one request" either way (do-not-air row 16).
- 83.34 / 88.68 fact-framing trap: the quantization and speculative-decoding graphics show NO speed multiplier (no "2 to 3x"); quantization = memory (Hugging Face 29.0 -> 15.2 -> 9.5 GB example), speculative = "same output" (rows 5, 6).
- 98.02 the CH3 "on a laptop" is the generic Ollama / llama.cpp line (scripted); it is not Mike's hardware, so the CH4 no-hardware rule does not bar it.
- 126.08 fact-framing trap: the VO says "around 15 to 20 seconds"; the receipt shows EITHER the docstring (20.5 s) OR a real log line (13.9 to 17.5 s), never both as one number, and the C4 crop skips the docstring lines that name the card (do-not-air row 8; Mike 2026-10-26).
- 134.78 fact-framing trap: on screen "around 20 agents per video", never "hundreds" (rows 9, 10).
- 154.44 receipt C9: "billed as output tokens" by both vendors; never claim the thinking is hidden for both (visibility differs by vendor, billing does not).
- 164.84 the VO says "stood out on a GTC stage"; the burned caption / graphic reads "GTC keynote, March 2025" (2025-03-18) and CLIP-3's caption names the vendor framing ("projecting demand for his own chips"). Never print "stood out".
- 29.48 low-confidence word: "model" (p 0.01) in "never reaches the model as text"; check at captions.
- 176.48-190.26 the close is ad-libbed and names TWO playlists (AI engineering, then Python). `[VERIFY]`: a Python playlist exists on the AI Engineering Simplified channel for the end screen; the `kt-subscribe-close` arrow plan (one arrow, where he points) may need a second point. OPEN for Mike. 187.90 "by Python" (p 0.33) VERIFY by ear.
- `[VERIFY]` items from DATA.md still open at render: every section 5 market-snapshot price (Anthropic / OpenAI per-MTok rates, caching multipliers, reasoning-effort values, extended-thinking minimum), re-pull only if any number airs on screen; the live `nvidia-smi` read must NOT air (Mike 2026-10-26: hardware never named, C5 drops nvidia-smi).
- Runtime measured: 3:10.40 spoken spine against the 2:00 target and the 3:00 hard ceiling; with CLIP-3 (5.1 s plus its transitions) around 3:16 (measurement only).
