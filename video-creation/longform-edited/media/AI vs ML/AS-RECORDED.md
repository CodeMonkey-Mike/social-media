# AI vs ML - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble, 16 cuts, "My god, dude." restored by Mike -> cover-blackout, 7 cover spans, hand-repaired at spine_review -> coarse desilence 700 ms, 50 ms sentence residual each side on COVER only -> two-zone final desilence 250 ms intro / 500 ms body, split at the measured hook end, same 50 ms COVER-only residual -> Adobe Podcast Enhance Speech remux, no retime). No burst removal (Mike at spine_review: no bursts), no content cut. Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.e.enhanced.mp4` - 145.200s (2:25.20), 1920x1080, 30 fps (r_frame_rate 30/1), h264 + aac. LOCKED (GATE spine approved 2026-11-10 13:20).
- **Transcript (cue source):** `spine/ALL.e.enhanced.medium-words.json` (Whisper medium, word-level, 422 tokens, NOT hand-edited; byte-identical to `ALL.d.desilenced.medium-words.json`, carried over by the remux node). Human-review breakdown: `spine/ALL.e.enhanced.segments.txt` (its header names `ALL.d.desilenced.mp4` as the source: same timeline, see the chain).
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (`ALL.lowbps.mp4` 784.23 s -> a: 16 retake/aside cuts, 356.37 s kept) -> `ALL.b.blackout.mp4.cover.json` (a -> b: NO retime, 7 cover spans blacked, 236.01 s) -> `ALL.c.desilenced.map.json` (b -> c: 31 silence cuts, -209.55 s, 356.37 -> 146.93 s) -> `ALL.d.desilenced.map.json` (c -> d: 5 cuts, -1.80 s: c >= 4.49 shifts -0.22 s, >= 5.63 shifts -0.42 s, >= 123.45 shifts -0.92 s, >= 142.83 shifts -1.32 s, >= 144.59 shifts -1.80 s; 146.93 -> 145.20 s) -> `ALL.e.enhanced.mp4` (d -> e: NO retime; Mike's Enhance Speech track `AI vs ML FINAL-esv2-27p-bg-10p-music-10p.wav` remuxed onto d's video stream, both files 145.200 s, audio-envelope cross-correlation d vs e = 0 ms lag, measured 2026-11-10). **Every timecode below is already a FINAL-spine coordinate (`ALL.e.enhanced.mp4`); the comp cues directly off them.** Caution: the `face_windows` inside `ALL.d.desilenced.map.json` are on the c timeline (0 to 0.90 s later than this spine, measured window by window); cue faces off the table below, never off that map. The `._chunkmap.*` files (`ALL.lowbps`, `ALL.a.defumbled`) are defumble diagnosis, not remaps.
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.desilenced` -> `e.enhanced`. Source recording `raw/2026-11-10 10-05-37.mkv` (13:04).

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on `ALL.e.enhanced.mp4` (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp: 2.567-8.267 · 12.367-33.333 · 39.967-45.633 · 58.100-77.633 · 82.400-123.700 · 127.533-130.400 · 139.533-145.200 (blackdetect closes the last span on the final frame, 145.167). Face 43.500 s = 30.0% / cover 101.700 s = 70.0%. 7 windows against the cap of 10 (8 scripted; the CH3 money landing was recorded as a COVER read, Mike's spine_review ruling). Zero orphans: every window lands on a scripted `[FACE]` beat.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-2.567 | "AI engineer versus ML engineer." | CH1 Beat 1 `[FACE]` (locked opening) |
| 2 | 8.267-12.367 | "One of these roles gets the big checks, the other one gets the door open." | CH1 Beat 3 `[FACE]` (the open loop) |
| 3 | 33.333-39.967 | "That's my side. I've run Claude agents across whole pipelines and I never actually trained a model." | CH2 Beat 2 `[FACE]` (Mike's side) |
| 4 | 45.633-58.100 | "But as soon as that API bill gets too big, you can and should host and tune your own model, which is something that I've been thinking about lately. Hmm, how to cut those costs." | CH2 Beat 3 `[FACE]` (the CAN / SHOULD turn; the ad-lib tail is face by Mike's ruling) |
| 5 | 77.633-82.400 | "Think of shipping a support chatbot on Claude versus training a fraud model." | CH3 Beat 3 `[FACE]` (the versus stack) |
| 6 | 123.700-127.533 | "Therefore, for most developers, AI engineering is the key." | CH4 Beat 1 `[FACE]` (the verdict) |
| 7 | 130.400-139.533 | "So subscribe for more steady content on how to become an AI engineer. All my content on this channel is geared to help you on your AI engineering journey." | CH4 Beat 2 `[FACE]` (subscribe) |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- 23.90 "billing" -> "building" (p 0.52; the BUILD of BUILD · TRAIN · DEPLOY, PROJECT-LOG "Billing -> Building").
- 50.78 "post" -> "host" (p 0.28; "host and tune your own model", the CAN / SHOULD face beat, PROJECT-LOG "Post -> Host").
- 79.22 "chat" + 79.56 "bot" -> "chatbot" (spelling only: Whisper split the compound; the versus stack label is SHIP A SUPPORT CHATBOT ON CLAUDE).
- 102.38 "$155" + 103.24 ",000" -> "$155,000" (token join for captions: Whisper split the number into two words).
- 104.74 "10" + 105.18 "%" -> "10%" (token join for captions).
- 108.12 "$495" + 109.60 ",000" -> "$495,000" (token join for captions).
- 112.48 "$340" + 113.46 ",000" -> "$340,000" (token join for captions).
- 84.14 "fastest growing" -> "fastest-growing" (on-screen text only; captions may keep the spoken form).
- Standing project mishears checked, 0 occurrences this run (nothing to fix): "rolls" -> "roles" (8.96 heard correctly as "roles"), "Cloud" -> "Claude" (28.70, 35.08, 80.04 all heard as "Claude"), "won" -> "want" (Whisper heard "wanna" at 73.42 and 75.80, see Flags). Persona spelling rules (TAO, Kaspa, MYX ...) do not apply to this video: 0 hits.

## AS-RECORDED beats (timecodes = FINAL spine)

Guard key (SCREENPLAY.md `[!WARNING]` blocks, in order): **W1** never "AI engineers make 350K more than ML engineers" (the gap runs toward the training side) · **W2** never "350K" as a sourced number, never the gap as median vs median · **W3** never "ML engineers need a PhD", "AI engineers never train models", "future-proof", or AI engineer "beats" ML engineer as number 1 · **W4** no Glassdoor figure, no Meta "100 million", no "10x as many ML jobs", no aggregator count, never name or show the reference video's creator.

### CH1 - THE TWO ROLES AND THE MONEY HOOK (0.00-14.06) · card OFF · Bed A (`concrete-mazes`, starts at frame 0)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "AI engineer versus ML engineer." | KEPT (locked `[SAY-EXACT]` `[FACE]`, said as written; F1 0.000-2.567; label pops on "AI engineer" 0.00-1.06 and "ML engineer" 1.60-2.58) |
| 2.90 | "They sound like the same job, they are not." | KEPT (scripted `[COVER]`; the sentence closes on "not", the scripted ", and at the top" continuation became its own sentence) |
| 5.30 | "At the top, the pay gap between them is huge." | CHANGED ("is huge" for "is around 340 thousand dollars a year": NO number is spoken in CH1; the 340,000 first lands at 112.48) · guards W1 + W2 HELD (no direction, no 350K, no median vs median) |
| 8.38 | "One of these roles gets the big checks," | KEPT (scripted `[FACE]`, F2 starts 8.267) |
| 10.68 | "the other one gets the door open." | CHANGED ("gets the door open" for "gets the open door"; the caption highlight follows the take: DOOR ... OPEN at 11.74-12.34, the sparkle on DOOR 11.74-11.98) |
| 12.42 | "So let's break it all down." | KEPT (scripted `[COVER]` handoff, the screenplay default; starts 0.05 s after F2 ends at 12.367) |

### CH2 - WHAT THEY ACTUALLY DO (14.06-64.42) · card OFF · Bed A carved

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 14.06 | "The AI engineer is commonly associated with shipping products." | KEPT |
| 17.42 | "On a model, someone else has already trained." | KEPT (minor drift: "has already trained" for "already trained"; Whisper's full stop after "products" and comma after "model" are punctuation only, it reads "...shipping products, on a model someone else has already trained") |
| 19.80 | "The ML engineer is commonly associated with the model itself, building it, training it and deploying it." | KEPT ("building" corrected from Whisper's "billing"; the scatter-word cues BUILD 23.90, TRAIN 24.70, DEPLOY 25.50) |
| 26.34 | "Day to day, that means wiring a model like Claude into your data and your product and then testing whether the answers are any good." | KEPT (minor drift: "and then testing" for ", then testing"; the EVALS pop cue "any good" 32.76-33.24) |
| 33.30 | "That's my side." | KEPT (scripted `[FACE]`; F3 starts 33.333, about 1 frame after the "That's" onset) |
| 34.62 | "I've run Claude agents across whole pipelines and I never actually trained a model." | CHANGED ("I've run" for "I run"; "and I never actually trained a model" for "and I have never trained a model") · guard W3 HELD (first person, Mike's own work, confirmed true by Mike at GATE 1; not "AI engineers never train models") |
| 40.02 | "So why does an AI engineer even exist?" | KEPT (minor drift: "So why does an AI engineer" for "Why does the AI engineer"; the trim-first line was said) |
| 42.58 | "Because the hard part, the training, is already done for you." | KEPT (the emoji pop cue "done for you" 44.92-45.62) |
| 45.68 | "But as soon as that API bill gets too big, you can and should host and tune your own model," | KEPT (scripted `[FACE]`, F4 starts 45.633; "host" corrected from Whisper's "post"; the CAN / SHOULD card cue "can" 49.04-49.48, "and should" 49.48-50.78; "host and tune your own model" 50.78-52.68) · guard W3 HELD (the line itself says AI engineers can tune models) |
| 53.08 | "which is something that I've been thinking about lately. Hmm, how to cut those costs." | AD-LIB (not in the script; KEPT as FACE by Mike's spine_review ruling 2026-11-10; inside F4, ends 58.06) |
| 58.06 | "To sum it up, AI engineering is less about developing models and more about adapting and evaluating them." | KEPT (the ONE paper card; ADAPTING 62.78-63.18, EVALUATING 63.50-64.04; "To" starts at 58.06, on the last frame of F4, which ends 58.100) |

### CH3 - HOW TO CHOOSE (64.42-123.98) · card OFF · Bed A carved

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 64.42 | "If you have the research background, the stats, the math, the graduate degree, go for ML." | KEPT (verdict pop on "ML." 69.82-70.10) |
| 70.30 | "If you're a software developer, choose AI." | KEPT (verdict pop on "AI." 72.44-72.98) |
| 73.12 | "If you wanna train models, ML." | KEPT (minor drift: "wanna" for "want to", as Whisper heard it, p 0.16; verdict "ML." 74.86-75.30) |
| 75.44 | "If you wanna ship products, AI." | KEPT ("wanna" again; verdict "AI." 77.14-77.54) |
| 77.66 | "Think of shipping a support chatbot on Claude versus training a fraud model." | KEPT (scripted `[FACE]`, F5 77.633-82.400; versus-stack drops: "shipping a support chatbot on Claude" 78.10-80.44, "versus" 80.44-81.04, "training a fraud model" 81.04-82.40; no "from scratch") |
| 82.46 | "And right now, LinkedIn's fastest growing job in the US for 2026 is AI engineer." | KEPT · guard W3 HELD (no head-to-head claim against ML engineer) |
| 88.70 | "If you have the code but not the math, AI is your way in." | KEPT |
| 92.08 | "If you have the math but not the production code, here's the thing, ML teams want shipping experience too." | KEPT (the trim-first line was said) |
| 98.14 | "Now the money, in total pay, the typical engineer in the US makes around $155,000 a year." | CHANGED (no "On Levels.fyi,", and "the typical engineer" with NO "AI": see the fact-framing trap in Flags) · guard W2 HELD (a typical-vs-top-10% framing, not median vs median) |
| 104.08 | "And the top 10% of ML engineers start at around $495,000 a year." | KEPT (minor drift: "And the top" for ", and the top"; the 495K bar cue "$495,000" 108.12-109.96) |
| 110.80 | "My God, dude," | AD-LIB (restored by Mike 2026-11-10, "intended to express amazement ... please keep that in"; COVER over the money chart, the reaction beat after the 495K lands) |
| 112.02 | "that's a $340,000 gap." | CHANGED ("that's a $340,000 gap" for "That's the 340 thousand dollar gap"; scripted `[FACE]`, recorded as a COVER read, COVER by Mike's spine_review ruling; the bracket cue "$340,000" 112.48-114.18) · guards W1 + W2 HELD (340, never 350) |
| 114.54 | "And it goes to the people who train the models." | KEPT (scripted `[FACE]`, COVER by the same ruling; the payoff word TRAIN 116.06-116.26) · guard W1 HELD (the direction is said: toward the people who train) |
| 117.34 | "But those seats are few and you're competing with PhDs for them," | KEPT · guard W3 HELD ("competing with PhDs", never "need a PhD") |
| 122.80 | "something to ponder." | AD-LIB (not in the script; KEPT, PROJECT-LOG "Ad-libs kept"; COVER) |

### CH4 - THE VERDICT AND SUBSCRIBE (123.98-145.20) · card OFF · Bed A carved, the hit ending right-aligned

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 123.98 | "Therefore, for most developers, AI engineering is the key." | KEPT (scripted `[FACE]`, F6 123.700-127.533; "the key" 127.10-127.52) · guard W3 HELD (no "future-proof", no head-to-head) |
| 127.68 | "The door is open, you already have the skills." | KEPT (minor drift: a comma for "and"; the trim-first line was said) |
| 130.48 | "So subscribe for more steady content on how to become an AI engineer." | CHANGED ("for more steady content on how to become" for "for steady content about how to become"; scripted `[FACE]`, F7 starts 130.400; highlight HOW TO BECOME AN AI ENGINEER 133.00-134.80) |
| 135.08 | "All my content on this channel is geared to help you on your AI engineering journey." | CHANGED ("is geared to help you" added to the scripted "All my content on this channel on your AI engineering journey"; F7 ends 139.533) |
| 139.62 | "And watch this next video right here," | CHANGED ("And watch this next video right here" for "And watch this video next."; end-screen slot 1 at "right here" 140.86-141.54) |
| 141.64 | "or maybe even this one, or this one, or even this one." | AD-LIB (three more end-screen slots named on purpose, Mike: END SCREEN = 4 video slots; slot cues "this one" 142.32-142.86, 143.14-143.66, 144.44-145.00; the LAST WORD "one." ends 145.00) |

## Divergences from SCREENPLAY.md

- **Dropped:** no scripted beat was dropped whole. Dropped inside lines: (1) the CH1 number "around 340 thousand dollars a year" (5.30, said "is huge") and (2) "On Levels.fyi" plus the word "AI" in the money line (98.14). Both logged in PROJECT-LOG at spine_review ("Hook wording", "ACCURACY") and the spine was approved with them (GATE spine 2026-11-10): RESOLVED, the build follows the take. What CH1 Beat 2's planned 340K A YEAR headline does now that no spoken number cues it is OPEN for the plan gate (see Flags).
- **Changed to a COVER read:** the scripted CH3 Beat 6 `[FACE]` "That's the 340 thousand dollar gap, and it goes to the people who train the models." recorded as a cover read (112.02-117.02) - RESOLVED by Mike 2026-11-10 at spine_review (COVER, not face). 7 face windows, not 8.
- **Wording changes (the take is canonical, no pickup):** 10.68 "the door open" · 34.62 "I've run" / "I never actually trained a model" · 98.14 the money line · 112.02 "that's a $340,000 gap" · 130.48 + 135.08 the subscribe lines · 139.62 "this next video right here" - RESOLVED (logged at spine_review, GATE spine approved 2026-11-10); captions and highlight words follow the spoken words.
- **Added (ad-libs):** 53.08-58.06 "which is something that I've been thinking about lately. Hmm, how to cut those costs." - RESOLVED by Mike 2026-11-10 (keep, FACE) · 110.80-111.78 "My God, dude," - RESOLVED by Mike 2026-11-10 (restored, keep, COVER) · 122.80-123.66 "something to ponder." - RESOLVED (PROJECT-LOG: ad-libs kept, they count against 2:29) · 141.64-145.00 "or maybe even this one, or this one, or even this one." - RESOLVED by Mike 2026-11-10 (END SCREEN = 4 video slots; the music plan's hit moves off "next").
- **Trim-first lines:** all three were said and stay ("So why does an AI engineer even exist?" 40.02, "If you have the math but not the production code..." 92.08, "The door is open..." 127.68). No trim guidance authored (Mike's rule: recorded content is not cut for runtime).
- **Guards:** W1 HELD (5.30 withholds the direction; 114.54 says it the right way round, toward the people who train) · W2 HELD (every spoken figure is 155,000 / 495,000 / 340,000; 350K never said; the gap is framed typical vs top 10%, never median vs median) · W3 HELD at 34.62, 45.68, 82.46, 117.34, 123.98 (first-person "never actually trained", "competing with PhDs", no head-to-head, no "future-proof") · W4 HELD (no Glassdoor, no Meta 100 million, no 10x line, no aggregator count, no creator named anywhere in the take).
- **Clip inserts (Convention 6):** none scripted: the screenplay carries no `[INSERT]` beat (CLIP-1, CLIP-3, CLIP-4 REJECTED at GATE 1; CLIP-2 HELD, in only if a trim-first line comes out, and Mike's GATE 1 approval took the screenplay default for every other open question). CLIP-2's would-be set-up line WAS said: "If you're a software developer, choose AI." ends 72.98, the trough before "If" at 73.12. Not placed: RESOLVED (default, no insert); it stays Mike's call to re-open.

## Flags carried into the edit

- 98.14-103.92 fact-framing trap: the VO says "the typical engineer in the US makes around $155,000 a year" (no "AI", no source). The C3 bar must read AI ENGINEER, MEDIAN 155.5K with the fixed source line LEVELS.FYI · UNITED STATES · TOTAL COMP · READ 2026-11-09 · THE AI ENGINEER TITLE SKEWS JUNIOR (DATA T3 / T6, section 5). Never "TYPICAL ENGINEER" alone and never 155,000 copied from the VO.
- 104.08-110.62 the VO says "start at around $495,000"; the bar prints 495K labelled ML ENGINEER, TOP 10% (the 90th percentile, n 1,012). "Start at" is the accurate verb for a 90th percentile.
- 112.02-114.54 fact-framing trap: the VO says "that's a $340,000 gap"; the bracket prints 339.5K (DATA T4 framing a: ML p90 495K minus AI median 155.5K), framed TOP 10% ML ENGINEER VS AI ENGINEER MEDIAN, never 350K, never as median vs median (that gap is 132K).
- 5.30-8.14 CH1 has NO spoken number now ("the pay gap between them is huge"). The planned 340K A YEAR headline has no word to land on; if any number shows in CH1 it carries its framing line (screenplay rule), and that framing line names the direction the hook withholds until 112.02 (screenplay CH1 NOTE). OPEN for the coverage plan / plan gate.
- 34.62-39.94 caption highlight: the spoken words are "I never actually trained a model"; the yellow highlight follows the take (NEVER ... TRAINED A MODEL), never the scripted "NEVER TRAINED A MODEL" as a contiguous run.
- 10.68-12.34 caption highlight: "the door open", so BIG CHECKS (9.76-10.42) and DOOR OPEN (11.74-12.34), not OPEN DOOR.
- Tight face joins (Whisper timing, check by ear at the face transitions): 33.30 "That's" onset vs F3 start 33.333 (no breath after "any good." at 33.24) · 58.06 "To sum it up" onset vs F4 end 58.100 (the paper card's first word starts on the face's last frame) · 2.58 "engineer." end vs F1 end 2.567.
- 24.48-24.70 possible tiny click (-41 dB) between "building it," and "training it" (PROJECT-LOG; its ~0:24.5 was read on the earlier coarse spine): listen at the mix.
- Low-confidence words (check at captions): 28.36 "like" (p 0.13, "a model like Claude") · 73.42 "wanna" (p 0.16; Whisper's spelling of a fast "want to", left verbatim, captions may render "want to") · 114.54 "And" (p 0.29) · 143.66 "or" (p 0.30, a 0.54 s token that may carry a breath) · 44.38 "is" (p 0.32) · 55.98 "Hmm," (p 0.35) · 85.06 "in" (p 0.39) · 25.20 "and" (p 0.43) · 40.54 "does" (p 0.48) · 111.10 "God," (p 0.49).
- END HOLD (Mike, spoken in the recording and repeated at spine_review): hold 2.0 s after the last "one." (ends 145.00) before the video ends; a BUILD item (end screen + bed), not in this spine.
- Music: the bed's hit ending was planned on "next"; the take now ends on the last "one." at 145.00 (Mike's 4-slot close), so the right-aligned hit lands there (PROJECT-LOG: the hit moves with the new wording).
- `[VERIFY]` items from DATA.md still open at render: Levels.fyi US AI Engineer median 155.5K (n 330) · Levels.fyi US ML Engineer median 287.5K and 90th percentile 495K (n 1,012; the title page read 285.8K the same day) · the recomputed gap 339.5K · LinkedIn Jobs on the Rise 2026 number 1 entry still live (C12 capture) · Stripe ML Engineer, Radar posting still open (C9 capture) · the Anthropic postings only if C4 is swapped in.
- Runtime measured: spine 145.20 s (2:25.20); with the 2.0 s END HOLD counted from the last word (145.00) the video runs 147.00 s (2:27.00) (the transcriber's 147.20 s adds the hold to the spine end instead); either way inside the 1:45 to 2:29 window, about 12 s over the 2:15 target. 418 spoken words (422 Whisper tokens, four of them number fragments) against the ~370 budget. Per chapter: CH1 14.06 s / 45 words (budget ~18 s / ~50) · CH2 50.36 s / 148 words (~45 s / ~125) · CH3 59.56 s / 159 words (~56 s / ~155) · CH4 21.22 s / 66 words (~14 s / ~38). Measurement only.
