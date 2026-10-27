# growth-vs-product - AS-RECORDED (build the edit to THIS, not the plan)

_Shape: `skills/doc-reference/AS-RECORDED.reference.md`. Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py` (run by the longform graph's `as_recorded` node). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (LOW BPS proxy -> defumble (26 retake spans) -> cover-blackout (7 FACE windows) -> coarse desilence 700 ms -> two-zone desilence 250 ms intro (CH1, split in the pause after "So let's dissect this a bit") / 500 ms body, 50 ms sentence residual on COVER scenes only (`--pad-tail 0.05 --pad-head 0 --pad-cover-only`). No burst removal and no content cut: Mike's spine review 2026-10-22, "I think it's great", no bursts, nothing to change). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.d.desilenced.mp4` - 219.66s (3:39.66, ffprobe 219.663), 1920x1080, 30 fps. LOCKED.
- **Transcript (cue source):** `spine/ALL.d.desilenced.medium-words.json` (Whisper medium, word-level, 676 words, NOT hand-edited). Human-review breakdown: `spine/ALL.d.desilenced.segments.txt`.
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 26 retake spans removed, 898 s -> 545.47 s) -> `ALL.b.blackout.mp4.cover.json` (a -> b: paint only, 6 blackout ranges, NO time shift) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms, 54 cuts, -320.80 s, 545.47 s -> 224.99 s) -> `ALL.d.desilenced.map.json` (c -> d: two-zone 250 / 500 ms, 12 cuts, -5.38 s, 224.99 s -> 219.66 s; cumulative shift on c-time past each cut: 18.36 -0.23 · 19.62 -0.62 · 20.50 -0.93 · 28.26 -1.40 · 33.46 -1.85 · 36.82 -2.08 · 39.68 -2.63 · 136.12 -3.18 · 147.46 -3.79 · 170.48 -4.32 · 197.68 -4.91 · 201.30 -5.38). **Every timecode below is already a FINAL-spine (d) coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `raw/2026-10-21 13-24-26.mkv` -> `ALL.lowbps` -> `ALL.a.defumbled` -> `ALL.b.blackout` -> `ALL.c.desilenced` -> `ALL.d.desilenced` (FINAL).

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on the final spine picture (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face 34.60 s = 15.7% / cover 185.07 s = 84.3%. 7 windows against 7 scripted `[FACE]` beats. Zero orphans: every window lands on a scripted `[FACE]` beat, and every scripted `[FACE]` beat has its window.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-4.733 | "So what are the differences between an AI growth engineer and an AI product engineer?" | CH1 Beat 1 `[FACE]` (locked hook, signature open) |
| 2 | 45.133-48.800 | "They're not the same job, same tools, different scoreboard." | CH1 Beat 4 `[FACE]` (locked thesis) |
| 3 | 82.600-87.000 | "One scoreboard counts what the business did and the other one counts what the model did." | CH2 Beat 4 `[FACE]` (side panels) |
| 4 | 122.100-126.100 | "Rapid results on one side and compounding quality on the other side." | CH3 Beat 4 `[FACE]` (side panels) |
| 5 | 168.567-173.067 | "one leans towards distribution and the other lean towards the model and the person using it." | CH4 Beat 4 `[FACE]` (side panels) |
| 6 | 200.767-206.100 | "Either way you're an AI engineer. The title just tells you which number you're accountable for." | CH5 Beat 3 `[FACE]` |
| 7 | 211.700-219.663 | "And if that cleared it up, hit that like button and subscribe. If you're not subscribed already, there's a lot more AI engineering content to come on this channel." | CH6 Beat 2 `[FACE] HOLD` (CTA, runs to the spine end) |

The CH6 recap line (206.22-211.66) sits in black between windows 6 and 7: it is scripted `[COVER]`, as recorded.

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited (the JSON still says "on board / bills / with a / bills / the main" at the true times); this list is re-applied at caption build.

- 11.42 "on board" -> "onboarded" (medium p=0.51; confirmed by a separate large-v3 pass on 11.4-19.3 s).
- 15.78 "bills out" -> "builds out" (p=0.51; large-v3 confirmed).
- 18.12 "with a customer" -> "for the customer." (p=0.51; large-v3 confirmed).
- 18.92 "bills. It does" -> "Builds it, does" (p=0.10; large-v3 confirmed).
- 63.40 "evals short" -> "evals, short" (punctuation).
- 65.30 "features" -> "feature's" (possessive).
- 68.24 "engineers" -> "engineer's" (possessive).
- 72.00 "AI personalized" -> "AI-personalized" (compound modifier; matters for captions and any on-screen card).
- 75.68 "or it doesn't kill it" -> "or it doesn't, kill it" (punctuation; without the comma the caption reads as "doesn't kill it").
- 132.72 "AI or not landing" -> "AI or not. Landing" (punctuation).
- 136.62 "AB" -> "A/B" (also the C1 diagram node label).
- 146.52 "guard rails" -> "guardrails".
- 166.70 "the main software" -> "plain software" ("the" p=0.02, "main" p=0.15 and zero-length; large-v3 hears "when plain software beats AI").
- 184.36 "growth engineer, which one" -> "growth engineer. Which one" (sentence break: the CH5 hire line ends and the become question starts with only 0.18 s between them).
- persona `terminology_rules` (Kaspa, KRC20 glossary, GhostDAG, TAO and the rest): 0 occurrences in this transcript.

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - TWO TITLES, ONE WORD (0.00-50.38) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "So what are the differences between an AI growth engineer and an AI product engineer?" | KEPT (locked `[SAY-EXACT]` `[FACE]`, FACE window 1; minor drift: a leading "So" added. Signature-open cue words: "AI growth engineer" 2.00-3.06, "AI product engineer" 3.64-4.66, so LABEL B lands ~1.6 s after LABEL A, not the scripted ~0.5 s) |
| 4.78 | "Let's first take the AI off both titles for a second." | CHANGED (minor: "Let's first take" for "Take") |
| 8.16 | "A growth engineer pushes the product out to customers, gets them onboarded, or gets them to stay and grow the actual business." | KEPT (minor drift: "to customers" for "to the customers", "or gets them to stay" for "gets them to stay", "grow" for "grows"; LABEL A base-line cue "grow the actual business" 13.32-14.56) |
| 14.78 | "A product engineer builds out the features of the actual product for the customer. Builds it, does not market it." | KEPT (Whisper mishears fixed, see above; LABEL B base-line cue "does not market it." 19.60-20.64) |
| 20.74 | "Now put AI in front of both of those titles." | KEPT (minor: "both of those titles" for "both titles"; the "AI" pops cue on "AI" 21.40-21.94) |
| 23.44 | "The AI growth engineer moves that same number with AI as well as landing pages, onboarding and retention personalized for every user and the experiments to prove it." | CHANGED ("with AI as well as landing pages" for "with AI, landing pages": the spoken list puts landing pages beside AI instead of under it; LABEL A AI-line cue "prove it." 32.82-33.20) |
| 33.34 | "The AI product engineer builds the AI inside of the feature." | KEPT (minor: "inside of the feature") |
| 37.10 | "So the job is the model's answers grounded in real data." | CHANGED (scripted "so the job is the model's answers. Right, grounded in real data, fast, and worth what they cost."; spoken as one clause ending on "real data." 40.10) |
| 40.10 | (not said) | DROPPED: "Right, ... fast, and worth what they cost." (LABEL B AI-line cue word "worth what they cost" does not exist; nearest anchor "real data." 39.58-40.10) |
| 40.32 | "In my experience, these two get used interchangeably even by people who are hiring for them." | KEPT · guard [!WARNING 2] HELD (said as Mike's own experience, no percentage); minor: "these two" for "those two", "people" for "the people" |
| 45.22 | "They're not the same job, same tools, different scoreboard." | KEPT (locked `[SAY-EXACT]` `[FACE]`, FACE window 2; minor drift: "They're" for "They are") · guard [!WARNING 1] HELD (no "split" wording anywhere in CH1) |
| 48.88 | "So let's dissect this a bit." | CHANGED ("So let's dissect this a bit." for "So, let's dive into all this."; RESOLVED, PROJECT-LOG 2026-10-22; `[COVER]`, black from 48.80) |

### CH2 - THE SCOREBOARD (50.50-87.02) · card ON "THE SCOREBOARD" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 50.50 | "Difference number one, the scoreboard, the growth engineer is scored on the business number, the signups, conversion, retention, and revenue." | KEPT (minor: "the signups", "and revenue"; "business number" 54.54-55.24) |
| 58.00 | "The product engineer is scored on the feature itself." | KEPT |
| 60.72 | "The word for that scoreboard is called evals, short for evaluation." | KEPT (minor: "is called evals" for "is evals", "evaluation" for "evaluations"; this is the CLIP-1 set-up line, said in full) |
| 64.84 | (clip insert CLIP-1 lands here; the set-up line ends "...is called evals, short for evaluation.") | KEPT · INSERT CLIP-1 HELD, OPEN for Mike (8.8 s, the speaker's own voice; the splice is the trough after "evaluation", deepest at 64.92-64.98 (-74 to -180 dB), "Their" onset ~65.00 although Whisper puts it at 65.06; the screenplay carries CLIP-1 as a `[NOTE]`, no `[INSERT]` line, so it goes in only on Mike's ruling) |
| 65.06 | "Their feature's pass rate on a test set is the product engineer's conversion rate." | CHANGED ("Their feature's" for "The feature's"; both models hear "Their", p=0.50; Mike kept this take, RESOLVED PROJECT-LOG 2026-10-22) |
| 70.00 | "The growth engineer ships an AI-personalized landing page as a split test. The number moves or it doesn't, kill it or scale it." | KEPT ("KILL IT OR SCALE IT" card cue 76.22-77.44) |
| 77.52 | "The product engineer ships a grounding fix and the number that moves is the pass rate." | KEPT (minor: "and" for ", and") |
| 82.70 | "One scoreboard counts what the business did and the other one counts what the model did." | KEPT (`[FACE]`, FACE window 3; side-panel cues: "One scoreboard" 82.70, "the other one" 85.32) |

### CH3 - THE CLOCK (87.18-126.14) · card OFF · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 87.18 | "Difference number two, the clock." | KEPT |
| 89.04 | "The growth engineer runs many cheap experiments and a failed one still counts because the output is leaning." | CHANGED ("leaning" as heard for scripted "learning"; medium and large-v3 both hear "leaning"; caption text OPEN for Mike; "SHIP TO LEARN" card cue word "leaning." 94.72-94.98) |
| 95.18 | "The product engineer builds a slow loop, a test set known with good answers and a regression gate on every change." | CHANGED ("a slow loop" for "the slow loop"; "a test set known with good answers" for "a test set with known good answers"; RESOLVED, Mike: "We can keep the test set phrase too", PROJECT-LOG 2026-10-22) |
| 101.84 | "Nothing ships on a vibe check." | KEPT (C10 silent flash cue "vibe check." 102.70-103.12) |
| 103.22 | "Give both of them three weeks." | KEPT ("three" spoken; on screen "3", see Flags) |
| 105.28 | "The growth engineer adds an AI step to onboarding that sets up the product differently for every new signup. And within days, you know whether more of them activate." | KEPT (ACTIVATION cue "activate." 113.18-113.62; "WITHIN DAYS" cue 111.18-111.96) |
| 113.90 | "The product engineer spends those three weeks on an eval set and a retrieval fix." | KEPT ("retrieval fix" node cue 117.68-118.22) |
| 118.50 | "Nothing to show on day three. And that eval set outlives this model." | KEPT ("model upgrade" node cue "outlives this model." 121.04-122.06) |
| 122.32 | "Rapid results on one side and compounding quality on the other side." | KEPT (`[FACE]`, FACE window 4; minor: "and" for a comma, "on the other side" for "on the other"; side-panel cues "Rapid results" 122.32, "compounding quality" 124.48) |

### CH4 - THE BIAS (126.34-173.12) · card OFF · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 126.34 | "Difference number three, the bias. What each one reaches first." | CHANGED ("What each one reaches first" for "what each one reaches for first"; "for" not said) |
| 129.64 | "The growth engineer lives in the funnel. AI or not. Landing pages, analytics, market automation, the A/B testing framework, and now AI on top." | CHANGED ("market automation" as heard for "marketing automation", p=0.47, both models hear "market"; caption text OPEN; C1 node cues "landing pages" 132.94, "analytics" 134.14, "market automation" 135.06, "A/B testing framework" 136.48, "AI on top" 138.78) |
| 139.48 | "The product engineer lives in the feature and now the model inside of it, prompting and retrieval, the eval harness, guardrails for when the model should abstain and an interface built for when a model is wrong sometimes." | KEPT (minor drift: "and now the model inside of it" for "and now in the model inside it", "built for when a model is wrong sometimes" for "built for a model that is wrong sometimes"; C1 product node cues "prompting" 143.92, "retrieval" 144.32, "eval harness" 145.28, "guardrails" 146.52, "interface" 148.68) |
| 151.22 | "And the middle is shared. Model APIs, agents, evals, Python plus TypeScript." | KEPT (minor: "Model APIs" for "the model APIs"; shared-middle cues 152.84-157.18) |
| 157.32 | "The growth engineer takes a business problem, a low conversion rate and ships the fix." | KEPT |
| 161.94 | "The product engineer knows a convincing demo from a dependable product and when plain software beats AI," | KEPT (Whisper mishear fixed: "the main software" -> "plain software"; face-cut cue "beats AI," 167.48-168.52) |
| 168.70 | "one leans towards distribution and the other lean towards the model and the person using it." | KEPT (`[FACE]`, FACE window 5; minor: "towards" for "toward"; "the other lean" as heard, p=0.27, a possible dropped s; side-panel cues "one leans" 168.70, "the other" 170.62) |

### CH5 - WHICH ONE (173.14-206.10) · card ON "WHICH ONE?" · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 173.14 | "So which one do you hire first?" | KEPT (runs straight on from the CH4 face line: 0.02 s word gap, no audio dip below -54 dB at 173.08; see Flags for the card pause) |
| 175.16 | "If users already touch your AI feature and it is wrong too often, the product engineer first." | KEPT (minor: "the product engineer first") |
| 180.80 | "If the product works and you have a funnel to feed the growth engineer." | KEPT (minor: "the growth engineer" for "growth engineer"; ambiguous audio: "the" is 0.58 s long at 183.54 and large-v3 hears "the growth engineer would-", a cut-off syllable at the 184.84 boundary) |
| 185.02 | "Which one should you become?" | KEPT (0.18 s after "growth engineer"; no breath between the hire answer and the become question) |
| 186.40 | "If the business number moving lights you up and you're fine throwing away a week's work when the test said it lost, growth engineer." | KEPT (minor: "said" for "says") |
| 193.62 | "If a pass rate climbing lights you up, product engineer." | KEPT |
| 196.90 | "And in my experience, a founding AI engineer ends up being both." | KEPT (both-labels cue "both." 200.42-200.72) |
| 200.80 | "Either way you're an AI engineer. The title just tells you which number you're accountable for." | KEPT (`[FACE]`, FACE window 6; minor: "you're" for "you are" twice, said as two sentences) · guard [!WARNING 3] HELD (no pay figure anywhere in the take) |

### CH6 - THE CLOSE (206.22-219.66) · card OFF · Bed C

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 206.22 | "Three differences, the scoreboard, the clock and the bias. Same tools, different scoreboard." | KEPT (`[COVER]`, black 206.10-211.70) |
| 211.78 | "And if that cleared it up, hit that like button and subscribe." | CHANGED (`[FACE] HOLD`, FACE window 7; "And if that cleared it up, hit that like button and subscribe" for "If this cleared it up, click that like button and click the subscribe button"; CTA recorded, so no hard-out, RESOLVED by the recording, PROJECT-LOG 2026-10-22) |
| 215.06 | "If you're not subscribed already," | AD-LIB (not in the script; kept, Mike's spine review 2026-10-22: nothing to change) |
| 216.58 | "there's a lot more AI engineering content to come on this channel." | CHANGED ("content to come on this channel" for "coming on this channel"; "channel." ends 219.66 = the spine's last frame) |
| 219.66 | (not said) | DROPPED: "Comment below which one you are, growth or product." |
| 219.66 | (not said) | DROPPED: "I'm gonna catch you guys, later." (Bed C's epic_hit and the end-screen cue word "later." are not in the audio; the last spoken word is "channel." 219.38-219.66) |

## Divergences from SCREENPLAY.md

- **Dropped:** (1) CH1 "Right, ... fast, and worth what they cost." (40.10); (2) CH6 "Comment below which one you are, growth or product."; (3) CH6 "I'm gonna catch you guys, later." All three RESOLVED by Mike 2026-10-22: screenplay approved as recorded ("i already recorded. no need to change the screenplay now"), the defumbler reported them, spine review "I think it's great", nothing to change. Minor word drops ("for" in "reaches for first" at 126.34) are recorded on their rows.
- **Changed, RESOLVED:** 48.88 "So let's dissect this a bit." for the "dive into all this" handoff (PROJECT-LOG 2026-10-22) · 95.18 "a test set known with good answers" (Mike: "We can keep the test set phrase too") · 65.06 "Their feature's pass rate" (Mike kept the last take) · 211.78 the CTA wording (CTA over hard-out, settled by the recording).
- **Changed, OPEN for Mike's spine gate (caption text only, the audio stays):** 94.72 "leaning" vs scripted "learning" · 135.06 "market automation" vs "marketing automation" · 170.92 "the other lean" vs "leans" · 23.44 "with AI as well as landing pages" (on-screen LABEL A wording, see Flags).
- **Added (ad-libs):** 215.06 "If you're not subscribed already," - kept (RESOLVED, spine review 2026-10-22). Small connective ad-libs live on their rows ("So" at 0.00, "Let's first" at 4.78, "content to come" at 216.58), all kept as recorded.
- **Guards:** [!WARNING 1] "has split" HELD (never said) · [!WARNING 2] "used interchangeably" HELD at 40.32 (Mike's own experience, no percentage) · [!WARNING 3] salary claims HELD (no pay number spoken anywhere) · [!WARNING 4] "didn't exist 18 months ago" / "by 2027" HELD (never said). DATA.md section 4 small guards: no company name spoken HELD; AARRR / pirate metrics not spoken, so no year HELD; Facebook origin, Elena Verna, Coframe and the CPO evals paraphrase never said HELD.
- **Clip inserts (Convention 6):** CLIP-1 set-up line said in full -> KEPT row at 64.84, the insert itself HELD and OPEN (moved to the plan stage by PROJECT-LOG 2026-10-22; +8.8 s if taken) | CLIP-1b, CLIP-2, CLIP-3 REJECTED in the screenplay, no set-up lines exist for them.

## Flags carried into the edit

- 103.22 / 113.90 / 118.50 fact-framing: the VO says "three weeks" and "day three"; any on-screen text shows digits, "3 weeks" and "day 3" (persona: numbers as digits).
- 23.44 fact-framing: the VO says "with AI as well as landing pages"; LABEL A's AI line keeps the scripted meaning ("paid to move that number with AI: personalized pages, onboarding, retention, experiments"), never a copy of the spoken list that splits landing pages off from AI.
- 37.10 fact-framing: "fast" and "worth what they cost" were not said; LABEL B's AI line ("evals, grounding, latency, cost") is sourced (C5 Citian, DATA.md T6) but its scripted cue word is gone, nearest anchor "real data." 39.58-40.10. Whether the label keeps "latency, cost" unspoken is a plan-stage call.
- 94.72 fact-framing: "the output is leaning" as heard; the "SHIP TO LEARN" card keeps "LEARN" (the scripted, sourced meaning). Caption text OPEN.
- 135.06 fact-framing: "market automation" as heard; the C1 node keeps the posting's "CRM / marketing automation". Caption text OPEN.
- 60.72 "evaluation" (singular, p<0.6) as spoken; any on-screen gloss of evals may read "evaluations".
- 50.38-50.50 card pause (THE SCOREBOARD): the audio trough is 50.31-50.37 (-60 to -98 dB) and "Difference" starts at ~50.40, earlier than Whisper's 50.50; lint-pause-silence must land the pause inside the measured trough.
- 173.12-173.14 card pause (WHICH ONE?): no silence below -57 dB between "it." and "So" (quietest -54 dB at 173.08; "So" onset ~173.15). lint-pause-silence will flag this point; measured, not resolved.
- 64.84 CLIP-1 splice trough is short (64.92-64.98); dry-run it against lint-pause-silence before any bake.
- 183.54 ambiguous audio: "the" is 0.58 s and large-v3 hears "the growth engineer would-" (a clipped syllable at 184.84); check by ear at captions.
- Zero-length words in the JSON (the caption builder needs a minimum duration): "In" 40.32, "And" 111.18, "And" 120.28, "main" 166.90 (replaced by "plain").
- Low-confidence words to eyeball at captions (p<0.6): "gets" 12.10, "even" 43.30, "conversion" 56.02, "short" 63.40, "evaluation" 64.20, "Their" 65.06, "it" 75.50, "rate." 82.38, "number two," 87.42-88.30, "growth" 89.18, "on" 119.04, "landing" 132.94, "market" 135.06, "AB" 136.62, "rails" 146.70, "and" 148.46, "sometimes." 150.64, "lean" 170.92, "the" 183.54, "you're" 201.54, "and" 208.66.
- 219.66 music cue: Bed C's epic_hit was scripted on "later."; that word is not in the audio and "channel." ends on the spine's last frame (219.66).
- `[VERIFY]` items from DATA.md still open at render: C4 CrowdStrike (LinkedIn 4425331668), C5 Citian (LinkedIn 4478695538), C6 Fictiv/MISUMI (Greenhouse 8687740002), C7 GovWell (Ashby), C10 hamel.dev, C12 The Pragmatic Engineer: re-pull each live posting before capture; LinkedIn counters ("72 applicants", "1 day ago", "3 hours ago") never on screen; C1 node labels are the postings' own words as read 2026-10-20.
- Runtime measured: 3:39.66 of spine (676 spoken words against 670 scripted) against the ~4:10 delivered target (Mike 2026-10-21) and the under-5:00 ceiling, before the two card pauses, the label pops, the side panels and CLIP-1 (+8.8 s if taken). Measurement only.
