# growth-scale-up - AS-RECORDED (build the edit to THIS, not the plan)

_Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Shape: `skills/doc-reference/AS-RECORDED.reference.md`. Lint: `skills/doc-reference/lint_as_recorded.py`. Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble -> cover-blackout -> coarse desilence with 50 ms cover-only pads -> burst removal x1 (start click, the 0:35 laugh only, 'All right', the 'that strag' false start, 'Alright') -> two-zone desilence 250 ms intro / 450 ms body -> Adobe Enhance audio swap, picture untouched). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.e.desilenced.mp4` - 229.72s (3:49.7), 1920x1080 30 fps. LOCKED (Mike, 2026-10-28: "the spine is approved").
- **Transcript (cue source):** `spine/ALL.e.desilenced.medium-words.json` (word-level, NOT hand-edited). Human-review breakdown: `spine/ALL.e.desilenced.segments.txt`.
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (raw -> a) -> `ALL.b.blackout.mp4.cover.json` (a -> b, picture only, no time change) -> `ALL.c.desilenced.map.json` (b -> c) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d, the burst spans) -> `ALL.e.desilenced.map.json` (d -> e). **Every timecode below is already a FINAL-spine coordinate (ALL.e); the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.cleaned` -> `e.desilenced`.

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on the FINAL spine picture (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. Face 59.55 s = 25.9% / cover 170.17 s = 74.1%. Zero orphans: all 8 windows land on scripted `[FACE]` beats (10 scripted face lines; windows 1 and 8 each carry two of them).

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-13.000 | "Scaling a growth team used to mean headcount. ... Welcome to the AI world." | CH1 Beat 1 `[FACE]` x2 (hook + welcome) |
| 2 | 23.400-35.367 | "Now the fork. Budget shows up for the first hire ... But that buys you zero leverage, zero." | CH2 Beat 1 `[FACE]` |
| 3 | 68.133-73.833 | "So when do you use AI, and for what? Strategy, execution, analysis." | CH3 Beat 1 `[FACE]` |
| 4 | 99.600-103.267 | "That the agent is doing their thinking? That's not why you hired them." | CH3 Beat 4 `[FACE]` |
| 5 | 120.700-125.567 | "So the whole one-on-one goes to transferring your judgment. So they decide well when you're not in the room." | CH4 Beat 2 `[FACE]` |
| 6 | 138.567-142.633 | "And so do your agents. An agent only knows the trade-offs that you put in writing." | CH4 Beat 5 `[FACE]` |
| 7 | 158.367-161.867 | "Now, scale-up mode, where testing volume used to force headcount." | CH5 Beat 1 `[FACE]` |
| 8 | 216.933-229.715 | "Fewer people, higher velocity. ... click right here." | CH6 Beats 1 + 2 `[FACE]` x2 |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build.

- 1.36 "used to meet" -> "used to mean" (transcriber's fix; the locked hook word; keyed on the ONE caption group "used to meet", the old two-group key "used to meet headcount" was skipped at caption build, draft v1 QA).
- 25.02 "Budges show" -> "Budget shows" (transcriber's fix).
- 92.00 "Chach-IPT" -> "ChatGPT" (transcriber's fix; product spelling).
- 95.98 "and has you a long" -> "and hands you a long" (transcriber's fix).
- 120.86 "transfer in your judgment" -> "transferring your judgment" (transcriber's fix; the band text).
- 169.66 "build the variance and" -> "build the variants and" (transcriber's fix; C3 diagram label).
- 192.86 "their R dashboard" -> "their AAARRR dashboard" (caught here: the scripted words, Whisper heard "their AAARRR" as "their R"; AAARRR in caps per DATA.md section 3).
- 17.02 "your agents are their team" -> likely "your agents are the team" (scripted "the team"; check the audio at captions).
- 53.70 "their weekly funnel readout" -> likely "the weekly funnel readout" (check at captions; C2 card text reads "Weekly funnel readout" either way).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE HOOK (0.00-23.34) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "Scaling a growth team used to mean headcount. Now a team of one can run the same experiment program that used to take a team of five. And a team of five could run the same experiment program that used to take a team of 20." | KEPT (locked `[SAY-EXACT]` `[FACE]`; minor drift: "could run" for "can run" in the second clause) · guard [!WARNING 2] HELD (no stat framing, "can" / "could") |
| 11.06 | "Welcome to the AI world." | CHANGED (locked `[SAY-EXACT]` `[FACE]` "Welcome AI to the growth world." said as "Welcome to the AI world."; the pop follows the spoken words and reads **WELCOME TO / THE AI WORLD** (two lines, `kt-keyword-pop`, `twinkle` on "Welcome"; RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands))) |
| 13.10 | "Team of one, you are a strategist, an executor and a leader, and your agents are their team. Team of five, you are their player coach, and every direct report runs agents on their own." | KEPT (`[COVER]`; drift: "their player coach", "every direct report runs agents on their own") |

### CH2 - THE FORK (23.46-68.02) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 23.46 | "Now the fork. Budget shows up for the first hire, and the classic move is to list the work that you hate so you can pass it on to a junior. But that buys you zero leverage, zero." | KEPT (`[FACE]`; drift: "pass it on to a junior" for "hire a junior to do it", added second "zero" kept by Mike's ruling) · guard [!WARNING 1] HELD (no credit) |
| 35.54 | "The better move. List the most impactful work, the work that moves the business towards its growth goals. Then figure out how someone could spend their time on exactly that." | KEPT (`[COVER]`) |
| 46.10 | "Team of one, that list goes to the agents, or you stop doing it. Variant copy for the landing page, onboarding variants, their weekly funnel readout, session recorder review, churn flags, failed payment retries." | KEPT (`[COVER]`; drift: "session recorder review" for "session recording review", card keeps the scripted label) · guard [!WARNING 4] HELD (no unsourced items said) |
| 59.04 | "Team of five, every report builds that list for their slice of the funnel, and the first human hire goes into the highest impact work, not the leftovers." | KEPT (`[COVER]`) |

### CH3 - WHEN TO USE AI (68.40-111.84) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 68.40 | "So when do you use AI, and for what? Strategy, execution, analysis." | KEPT (`[FACE]`) |
| 74.12 | "Strategy stays human. What matters, what bets, what you stop. AI is the sparring partner, never the author. Execution goes to agents, build the variants, draft, instrument, ship, analysis, the agent drafts the readout. A human calls it scrap or scale." | KEPT (`[COVER]`; drift: "what bets" for "which bets", "the sparring partner") |
| 90.48 | "Here's the anti-pattern. A direct report prompts Claude or ChatGPT for a growth strategy, and hands you a long AI written strategy doc. What do you think?" | KEPT (`[COVER]`; drift: "ChatGPT" for "GPT", "direct report") · guard [!WARNING 1] HELD (no page count) |
| 99.66 | "That the agent is doing their thinking? That's not why you hired them." | CHANGED (`[FACE]`; said as a rhetorical answer to "What do you think?" instead of "That is the agent doing your report's thinking, and it is not why you hired them."; meaning intact) |
| 103.38 | "Team of one, you hold the strategy. Team of five, you write the guardrails, where AI is allowed, where it is not, and a team decides inside them." | KEPT (`[COVER]`) |

### CH4 - ONE-ON-ONES AND DIRECTION (111.96-158.34) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 111.96 | "Now, the one-on-ones. Most managers run them as a status update. That's low leverage. Now an agent writes a status update before you even sit down." | KEPT (`[COVER]`; drift: "a status update" for "the status update"; C6 flash cues on "writes a status update" at 117.24) |
| 120.86 | "So the whole one-on-one goes to transferring your judgment. So they decide well when you're not in the room." | KEPT (`[FACE]`) |
| 125.82 | "Direction, same thing. Say what matters most right now and how each role ladders up to it. Then have them play it back to you," | KEPT (`[COVER]`) |
| 132.46 | "and write the trade-offs down. Speed or rigor, polish or rough first draft, spend or protect the budget." | KEPT (`[COVER]`) · guard [!WARNING 1] HELD (no principle count) |
| 138.62 | "And so do your agents. An agent only knows the trade-offs that you put in writing." | KEPT (`[FACE]`; "because" dropped, two sentences) |
| 142.72 | "Team of one, that strategy doc is the context file every agent reads. My own content operation runs on 29 agent definitions in one folder with five human gates where judgment stays with me. Team of five, that same doc keeps your people and their agents aligned." | KEPT (`[COVER]`; the 'that strag' false start removed at burst removal) |

### CH5 - SCALE-UP MODE, RAPID FIRE (158.68-216.86) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 158.68 | "Now, scale-up mode, where testing volume used to force headcount." | KEPT (`[FACE]`) |
| 162.04 | "Play one, the experiment loop. Agents mine the recordings and the funnel for drop-off. Draft a prioritized backlog, plan the test, build the variants and the flag, and write the readout. You pick the bets and call scrap or scale." | KEPT (`[COVER]`) · guard [!WARNING 4] HELD (no ICE / PIE) |
| 174.90 | "AI drafts more tests. It doesn't change the sample size a test needs." | KEPT (`[COVER]`) · guard [!WARNING 3] HELD (no number spoken) |
| 179.18 | "Play two, the churn agent. It watches usage and tickets. Flags who is likely to leave. Retries failed payments on the best schedule. Draft the save message. You own the template and the offer." | KEPT (`[COVER]`) · guard [!WARNING 4] HELD (no vendor, no recovery percentage) |
| 190.58 | "Play three, the Monday digest. The agent reads their AAARRR dashboard, flags what moved, writes the readout. No status meeting." | KEPT (`[COVER]`; "AAARRR" restored from the mishear) |
| 198.94 | "Play four, programmatic SEO. Agents draft acquisition pages at scale, and Google's test is of value to the user no matter how the page is made up. So a page that adds nothing stays out of the search." | KEPT (`[COVER]`; drift: "is of value", "is made up", "the search") |
| 210.72 | "Team of one, that is your stack. Team of five, every play gets an owner, and the bets land on your desk." | KEPT (`[COVER]`) |

### CH6 - THE CLOSE (217.06-229.72) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 217.06 | "Fewer people, higher velocity. Every human hour on a call, only the human should make." | KEPT (`[FACE]`; drift: "on a call, only the human" for "on the call only a human"; the JUDGMENT word-by-word payoff has no spoken "judgment", cue `cash-register-2` on "make" at ~221.2) |
| 221.64 | "And hey, click that subscribe button. And if you want to know the difference between an AI growth engineer and an AI product engineer, click right here." | CHANGED (`[FACE]`; reworded and longer than "Click the subscribe button, and the growth engineer versus product engineer video is right here."; the arrow lands on "click right here" at 228.94) |

## Divergences from SCREENPLAY.md

- **Dropped:** none. Every scripted line was said.
- **Changed:** 11.06 "Welcome to the AI world." for the locked "Welcome AI to the growth world." - RESOLVED: the pop reads WELCOME TO / THE AI WORLD (RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands)). 99.66 the anti-pattern verdict as a question - RESOLVED: kept as recorded, the overlay "NOT WHY YOU HIRED THEM" unchanged (RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands)). 221.64 the reworded subscribe close - RESOLVED: kept as recorded, the arrow lands on "click right here" (RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands)).
- **Added (ad-libs):** 33.9 the second "zero" after "zero leverage" - RESOLVED by Mike 2026-10-28 (keep it; only the side-glance laugh after it was cut). 221.64 "And hey," - RESOLVED: kept (RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands)).
- **Spine rulings:** start click, the 0:35 laugh, 'All right' (CH4), the 'that strag' false start, 'Alright' (CH6) removed - RESOLVED by Mike 2026-10-28 (spine review + spine approval).
- **Guards:** [!WARNING 1] no credit / no third-party numbers: HELD throughout. [!WARNING 2] team-ratio claim: HELD at 0.00 ("can" / "could", no stat). [!WARNING 3] sample size: HELD at 174.90. [!WARNING 4] vendor overclaims: HELD (no vendor named, no ICE / PIE, no recovery percent). [!WARNING 5] AAARRR frame only: HELD.
- **Clip inserts (Convention 6):** none scripted (Mike's 2026-10-25 ruling: no third-party voice or credit).

## Flags carried into the edit

- 0.00 fact-framing trap: the VO says "a team of five ... a team of 20"; on screen these are pop labels only, never a stat, never a citation (WARNING 2).
- 146.68 fact-framing trap: the VO says "29 agent definitions ... five human gates"; C14 must show the re-counted figures ([VERIFY] DATA.md, counted 2026-10-25), and if the count drifted the receipt shows the real count, not the spoken 29 restyled.
- 174.90 fact-framing trap: C15 shows the calculator's own numbers (1,030 per variation at its on-load defaults; corrected 2026-10-28 from the 2,545 HTML placeholder), never spoken, never restyled.
- 186.40 C12 Stripe receipt: "8 tries within 2 weeks" is on screen only; the VO says "the best schedule".
- 192.86 ambiguous audio: "their R" = "AAARRR" (confirm at captions).
- 17.02 / 53.70 / 205.38 low-confidence words: "their team", "their weekly", "is made up" (check at captions).
- `[VERIFY]` items from DATA.md still open at render: the 29 agent-definition count (C14), the CH2 card vendor traces (C2), the CH5 vendor rows (C6 to C13).
- Runtime measured: 3:49.7 against the ~3:49 sum of the chapter budgets (measurement only).
