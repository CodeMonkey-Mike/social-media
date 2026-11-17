# clip-evals: CARDS-SPEC (the build worklist for every cover card)

_The content of every card `SCRIPT.md` names, written out so a builder never has to decide WHAT a card says. Approved
script: `../SCRIPT.md` (Mike, 2026-11-16). Facts: `../RESEARCH.md` (the only number source). Code and JSON cards:
`code-cards.json` (machine spec, rendered from the real files). Channel: AI Engineering Simplified._

## 0. Rules for every card

- **Frame:** 16:9 cards are exactly 1920x1080 PNG. Vertical cards are exactly 1080x1920 PNG, re-composed for the tall
  frame (never a scaled, cropped or letterboxed 16:9 card), lower third kept light.
- **File names are the script's card names.** A card with no states is `<id>.png`. A card with states is one file per
  state, `<id>-<state>.png` (for example `roadmap-harness.png`), and NO plain `<id>.png`.
- **Folders (project root = `video-creation/longform-presentation/media/standard/clip-evals/`):**
  `assets/cards/` (kind card), `assets/diagrams/` (kind chart-still), and the vertical set under the same names in
  `assets/vertical/cards/` and `assets/vertical/diagrams/`. Sources (HTML, CSS, scripts) in `assets/card-sources/`.
- **Look:** the house DARK theme, `video-creation/longform-edited/skills/container-reference/container-canonical.css`
  pasted, never re-derived (page `#0a0c10`, Playfair Display headline, DM Sans body and eyebrows, JetBrains Mono numbers
  and code). A card FILLS the frame (a cover hides the whole recording): content block left-aligned, large, no webcam
  gutter. One accent meaning for the whole video:
  cyan `#00c2ff` = the part being talked about (a lit row, a lit code line, a lit node) ·
  green `#00e68a` = kept / good · red `#ff4060` = killed / risk · gold `#ffd700` = a human gate or a caveat.
- **States:** the same card, the same layout, pixel-stable between states: only what is lit changes (plus content the
  spec says "appears"). Resting rows stay readable (muted, never invisible).
- **Text is exactly as written here.** Quotes are verbatim with their source line. No em dashes anywhere. No model
  version numbers (the agent files' own words `fable` and `opus` are fine). Never show a brief, a path outside the
  repo, or the body of `_spawn_agent_once` (`RESEARCH.md` section 6).
- **Numbers** come from this file (copied from `RESEARCH.md` on 2026-11-16) and are re-pulled before the render.

## 1. Text cards (kind card), in script order

Format: `id` (states) then EYEBROW / HEADLINE / BODY. `[lit: x]` = what a state lights.

**the-job**
EYEBROW: THE JOB · HEADLINE: A livestream in. Up to 8 clips out.
BODY: a 4-step strip, left to right: LIVESTREAM > CLIP STRATEGIST (an agent reads the transcript) > UP TO 8 CLIPS
(30 s · 60 s · 90 s) > MIKE: KEEP (green) or KILL (red), every clip.

**last-video**
EYEBROW: FROM THE LAST EVALS VIDEO · a quote card, the quote large:
"The next layer is a dataset and the score."
Attribution line: Mike, in the first evals video.

**roadmap** (harness, graph, evals)
EYEBROW: IN THIS VIDEO · HEADLINE: The harness, the graph, the evals
3 numbered rows: 1 THE HARNESS: the code around the agents that holds them to the rules [lit: harness] ·
2 THE WHOLE GRAPH: every step and every agent in it [lit: graph] ·
3 THE EVALS: record a verdict, replay a livestream, score a prompt [lit: evals].

**agent-harness**
EYEBROW: HARNESS, MEANING 1 · HEADLINE: The agent harness
QUOTE: "An agent harness (or scaffold) is the system that enables a model to act as an agent: it processes inputs,
orchestrates tool calls, and returns results."
SOURCE LINE: Anthropic, "Demystifying evals for AI agents", Jan 9, 2026

**eval-harness**
EYEBROW: HARNESS, MEANING 2 · HEADLINE: The evaluation harness
QUOTE: "An evaluation harness is the infrastructure that runs evals end-to-end. It provides instructions and tools,
runs tasks concurrently, records all the steps, grades outputs, and aggregates results."
SOURCE LINE: Anthropic, "Demystifying evals for AI agents", Jan 9, 2026

**harness-plus-model**
A quote card, the quote large: "When we evaluate "an agent," we're evaluating the harness and the model working
together."
SOURCE LINE: Anthropic, "Demystifying evals for AI agents", Jan 9, 2026

**three-layers** (all, runtime, blurry)
EYEBROW: LANGCHAIN'S 3 LAYERS · HEADLINE: Framework, runtime, harness
3 rows: FRAMEWORK: LangChain · RUNTIME: LangGraph · HARNESS: DeepAgents
- all: the 3 rows, all equally bright.
- runtime: the RUNTIME row lit, and under it appears "what a runtime provides": durable execution · human-in-the-loop
  support · thread level persistence · cross-thread persistence · streaming.
- blurry: the runtime detail stays; a quote appears at the bottom: "Now, I will readily admit that the lines are
  blurry."
SOURCE LINE (all states): LangChain (Harrison Chase), "Agent Frameworks, Runtimes, and Harnesses- oh my!", October 25, 2025

**six-agents**
EYEBROW: THE AGENTS · HEADLINE: 6 agents work inside this graph
A table, 3 columns (AGENT · JOB · MODEL TIER), in 2 groups:
JUDGMENT, HANDS BACK A PLAN: `clip-strategist` · picks the clips from the transcript · fable, max effort |
`tighten-strategist` · plans which filler to cut from a clip · fable, max effort |
`lane3-drafter` · drafts the tweets, threads and posts · fable, max effort
BUILDS OR CHECKS: `remotion-builder` · builds each short's video · opus, xhigh effort |
`publish-meta-author` · writes the titles and captions · opus, medium effort |
`visual-qa` · checks the rendered images · opus, high effort
(No footer. Only the agents of this graph: Mike, 2026-11-16.)

**context-engineering**
EYEBROW: CONTEXT ENGINEERING
QUOTE: "Context engineering is the art and science of curating what will go into the limited context window"
SOURCE LINE: Anthropic, "Effective context engineering for AI agents", Sep 29, 2025
UNDER IT, as the card's own line (gold): A rule that only lives in the context is a request.

**rules-in-code** (plan, files, fallback, done)
EYEBROW: WHERE A RULE LIVES · HEADLINE: Every rule that has to hold lives in code
4 rows, each "THE RULE > the code that enforces it":
THE SHAPE OF A CLIP PLAN > the validator, `validate_plan` [lit: plan] ·
WHERE FILES MAY GO > a hook, at the end of every turn and before every commit [lit: files] ·
THE MODEL FALLBACK > the spawner, and a script that proves every spawner has it [lit: fallback] ·
"DONE" > the last step of the graph checks the disk and the queues [lit: done].

**what-survives** (nothing, checkpoints, files, docs)
EYEBROW: WHAT SURVIVES A RUN · HEADLINE: The harness holds the state
4 rows: THE AGENT: nothing. Every run starts fresh. [lit: nothing] ·
CHECKPOINTS: every step saved to SQLite, 1 thread per batch [lit: checkpoints] ·
FILES ON DISK: the clip plan and a progress file, the contract between the steps [lit: files] ·
DOCS: what the agents read at the start of every run [lit: docs].
Under row 1, in every state (small, quote style): "each new session begins with no memory of what came before."
Anthropic, "Effective harnesses for long-running agents", Nov 26, 2025

**three-graders**
EYEBROW: 3 GRADERS, ALREADY RUNNING · HEADLINE: Code, a model, and a human
3 rows: CODE-BASED: the validators · MODEL-BASED: the visual QA agent, a model judging another model's images ·
HUMAN: the 2 gates.
SOURCE LINE: "Agent evaluations typically combine three types of graders: code-based, model-based, and human."
Anthropic, "Demystifying evals for AI agents", Jan 9, 2026
Card's own line at the bottom (gold): Each one judges a single run.

**what-changed** (added, changed)
EYEBROW: THE WHOLE CHANGE · HEADLINE: What was added, what was changed
Two groups, a file per row with its size right-aligned in mono:
ADDED [lit: added]: `clip_evals.py` · 1,023 lines · the record, the replay, the score | `test_clip_evals.py` ·
316 lines · 70 checks | `seed_verdicts.py` · 163 lines · the one-time backfill | `evals/` · the record, the saved
transcripts, the replays | `evals.html` · 518 lines · the dashboard page
CHANGED [lit: changed]: `batch_graph.py` · +86 / -20 · the graph | `run.py` · +16 / -3 · the command that drives it |
`serve_dashboard.py` · +28 · the page's data feed | `cleanup.js` · +20 · never recycle the evals folder

**record-guarantees**
EYEBROW: THE RECORD · HEADLINE: 3 guarantees
3 rows: APPEND-ONLY: nothing in the code ever rewrites a line · IN GIT: the file is committed ·
PROTECTED: the cleanup tool refuses the evals folder.
Small mono line: `video-creation/livestream-repurpose/evals/clip-verdicts.jsonl`

**backfill**
EYEBROW: THE BACKFILL · HEADLINE: The old verdicts were still on disk
A join: STRATEGIST LOGS (every plan) + CHECKPOINT DATABASE (every kill) > A ONE-TIME SCRIPT > 168 LINES · 20 LIVESTREAMS
Note line (muted): 2 livestreams were too old to tie a kill to a clip: on record, left out of every score.

**precision-recall**
EYEBROW: 2 NUMBERS · HEADLINE: Precision and recall
Two formulas, stacked or side by side:
PRECISION = clips I kept / clips it proposed. Under it (green): the gate can see this.
RECALL = good moments it found / (found + missed). Under it (gold): the gate can't. It only sees what was proposed.

**saved-transcripts**
EYEBROW: SAVED FOR A REPLAY · HEADLINE: 3 transcript files per livestream
The 3 files (mono): `chunks_90s.txt` · `plain.txt` · `words.txt`
Then: 5 LIVESTREAMS CAN BE REPLAYED: 30x-tao · best-time · kaspa-cocktails · stock-market · peach
Note line (muted): the batch folder gets cleaned up later. The evals copy stays.

**four-outcomes** (kept, killed, missed, new, formula)
EYEBROW: SCORING A REPLAY · HEADLINE: 4 outcomes for every new pick
4 numbered rows: 1 IT MATCHES A CLIP I KEPT: a hit (green) [lit: kept] ·
2 IT MATCHES A CLIP I KILLED: a repeated kill (red) [lit: killed] ·
3 IT LANDS ON A MOMENT I SAID WAS MISSED: counts in its favor (green) [lit: missed] ·
4 IT'S NEW, NO VERDICT: left out of the score (muted) [lit: new].
- formula: the 4 rows rest, and a formula appears under them:
  PRECISION = good picks / (good picks + repeated kills), with "good picks = outcomes 1 and 3" small under it.

**scorer-tests**
EYEBROW: THE SCORER IS TESTED · HEADLINE: 70 checks on made-up clips
3 example checks, each with a pass mark, in mono, exactly these names from `test_clip_evals.py`:
a long pick matches the long clip, not the impact clip inside it ·
recording a gate twice writes nothing ·
noise: picks pair one to one, so an added impact clip counts as a difference (2 x 1 / 3 = 66.7%)
Card's own line (gold): If the matching math is wrong, every score after it is wrong.

**noise-table** (all, held, moved)
EYEBROW: NOISE · HEADLINE: The same prompt, twice, on 4 livestreams
A table. Columns: LIVESTREAM · PICKS (run 1 / run 2) · SAME PICKS BETWEEN RUNS · PRECISION (run 1 / run 2) · SPREAD
30x-tao · 8 / 8 · 100% · 83.3 / 83.3 · 0
best-time · 3 / 3 · 100% · 100 / 100 · 0
kaspa-cocktails · 7 / 7 · 85.7% · 100 / 83.3 · 16.7 points
stock-market · 6 / 7 · 92.3% · 100 / 83.3 · 16.7 points
- all: the whole table, no row lit. · held: 30x-tao and best-time lit (green). ·
  moved: kaspa-cocktails and stock-market lit (red), their "100 / 83.3" and "16.7 points" cells emphasized.
Footer (muted): same prompt, same transcript, same model.

**noise-floor**
EYEBROW: THE NOISE FLOOR · the big number: around 17 points · under it: on one livestream, with nothing changed
Then a divider and the metric: `pass^k` (mono, cyan) "measures the probability that all k trials succeed."
Example line, exactly: (0.75)³ ≈ 42% · and plainly under it: 75% per run is 42% over 3 runs.
SOURCE LINE: Anthropic, "Demystifying evals for AI agents", Jan 9, 2026
Card's own line (gold): A prompt edit has to beat the noise before it counts.

**record-today**
EYEBROW: THE RECORD TODAY · the big number: 82.7% · under it: selection precision (81 of 98 clips kept)
A row of 5 stats in mono: 184 lines · 21 livestreams · 98 clips judged · 81 kept (green) · 17 killed (red)
Footer (muted): as of 2026-11-16.

**by-model**
EYEBROW: BY MODEL · HEADLINE: The top model against the fallback
A 2-up comparison: THE TOP MODEL: 84.1% · 17 livestreams · 82 clips · 69 kept |
THE FALLBACK MODEL: 75.0% · 2 livestreams · 16 clips · 12 kept
Card's own line (gold): 2 livestreams is a lead, not a result.

**kills** (pairs, rates)
EYEBROW: WHERE THE KILLS ARE
- pairs: the big number 11 of 17 · under it: kills were one half of a pair, a full clip and its impact cut, where the
  other half was kept. A small pair drawing: FULL CLIP (kept, green) beside IMPACT CUT (killed, red). Detail line
  (muted): 8 impact cuts and 3 full clips.
- rates: the "11 of 17" block stays, smaller, and a 2-up appears: FULL CLIPS: 88.3% kept (77 judged, 9 killed) |
  IMPACT CUTS: 61.9% kept (21 judged, 8 killed). The impact number in red.

**recall**
EYEBROW: RECALL, FIRST LIVE RUN · the big number: 87.5% · under it: 7 kept, 1 missed (7 of 8)
Footer (muted): 1 livestream so far. Every stream from here on adds to it.

**not-yet** (not-memory, feed-back, cheaper-model)
EYEBROW: NOT YET · HEADLINE: What the record isn't, and what's next
3 rows: NOT MEMORY: the strategist never sees the record. It's a measurement. [lit: not-memory] ·
FEED EXAMPLES BACK: kept and killed examples into the prompt, then measure if it helps [lit: feed-back] ·
A CHEAPER MODEL: can it pick as well? Now that's a replay. [lit: cheaper-model].

## 2. Code and JSON cards (kind card): `code-cards.json`

17 cards: wiring-code, spawn-code, select-code, validator-code, gate-code, kill-code, record-call-code, record-code,
verdict-line, version-code, stamp-code, missed-option, replay-prompt, replay-code, match-code, scorer-code,
pairing-code. Each is a CODE CARD: an eyebrow, a title (file and function), then the code. `code-cards.json` lists, per
card, the exact source lines to show, the gap markers between them, and the lines each state lights. **The code text is
read from the real file by the build script, never retyped**, so no character of a code line can differ from the repo.
A gap marker is drawn as a muted, non-code line (`· · ·` plus its label when it has one). A lit line gets the cyan
bar and full brightness; the other lines rest readable. A `mark` lights only that substring. Long lines soft-wrap
with a hanging indent (never cut off, never shrunk below a readable size). `stamp-code` also carries a timeline
(in `code-cards.json`, `extra`).

## 3. Chart stills (kind chart-still), for `chart-builder`

System-design charts: nodes, arrows, labeled flows (never a table). One PNG per state, the layout identical between
states, the lit part in cyan at full brightness, the rest resting but readable.

**nested** (claude-code, graph, evals) · HEADLINE: Two harnesses, and a third beside them
- An outer rounded box: THE LANGGRAPH GRAPH, the runtime. Its 4 jobs as small labels on the box: decides the order ·
  checks every output · stops for a human · retries what fails.
- Inside it, a row of 3 agent boxes (agent, agent, agent). Each agent box is itself inside a second, thinner box
  labeled CLAUDE CODE, an agent harness: owns the loop and the tools.
- Beside the outer box, joined by an arrow labeled "verdicts": THE EVALUATION HARNESS: record · replay · score.
- claude-code: the Claude Code boxes lit. · graph: the outer graph box lit. · evals: the evaluation harness lit.

**pipeline** (intake, lane-1, lanes-2-3, queues) · HEADLINE: From a livestream to the queues
Left to right: LIVESTREAM > INTAKE (re-encode · vertical version · transcript) > a fan-out into 3 lanes stacked
vertically: LANE 1 long-form video · LANE 2 vertical shorts, the clips · LANE 3 text and images: tweets, threads,
posts > QUEUES > POSTING SCRIPTS.
- intake: LIVESTREAM and INTAKE lit. · lane-1: the fan-out and LANE 1 lit. · lanes-2-3: LANE 2 and LANE 3 lit. ·
  queues: QUEUES and POSTING SCRIPTS lit, and LANE 2 keeps a gold outline with the tag TODAY.

**batch-graph** (start, lane-3, strategist, gate-1, gate-2, build, verify) · HEADLINE: One graph, 14 steps
The 14 nodes in order, each with its real node name in mono and a plain label under it:
1 `intake` re-encode, vertical, transcribe · 2 `register` register the batch · 3 `launch_lane3` start lane 3 ·
4 `lane2_select` the clip strategist picks [AGENT, VALIDATOR] · 5 `lane2_cut` cut the clips ·
6 `gate_4b` HUMAN GATE 1: keep or kill [GATE, gold] · 7 `lane2_tighten_plan` plan the filler cuts [AGENT, VALIDATOR] ·
8 `lane2_tighten` tighten · 9 `gate_2nd` HUMAN GATE 2 [GATE, gold] · 10 `lane2_finish` finish the clips ·
11 `lane2_build` build each short [AGENT] · 12 `lane2_publish` publish to the queue [AGENT] ·
13 `join_lane3` wait for lane 3 · 14 `verify_batch` verify the whole batch [VALIDATOR].
Lane 3 is a side branch: an arrow leaves `launch_lane3`, runs as its own process along the bottom (label: LANE 3,
its own process: drafts the posts [AGENT]), and comes back in at `join_lane3`.
The 14 nodes wrap into 2 rows of 7 (a snake), numbered, so every label is large enough to read. A small legend:
AGENT · VALIDATOR · HUMAN GATE.
- start: nodes 1 and 2 lit. · lane-3: node 3 and the lane 3 branch lit. · strategist: node 4 lit. ·
  gate-1: nodes 5 and 6 lit. · gate-2: nodes 7, 8 and 9 lit. · build: nodes 10, 11 and 12 lit. ·
  verify: nodes 13 and 14 lit, with the note "refuses done while a lane is pending".

**score-layer** (lost, record, replay, score) · HEADLINE: Record, replay, score
- Left: HUMAN GATE 1 and HUMAN GATE 2 (gold), each with the label "keep / kill".
- Middle: THE RECORD (`clip-verdicts.jsonl`, one line per clip per gate).
- Top right: SAVED TRANSCRIPT > THE CLIP STRATEGIST, today's prompt > NEW PICKS (the replay).
- Bottom right: THE SCORE (precision · recall) > THE DECISION: did the prompt change help?
- Arrows: gates > the record ("verdicts") · new picks > the score · the record > the score.
- lost: only the 2 gates lit, and their "verdicts" arrow ends in a dashed stub labeled "thrown away" (red); the rest
  of the chart rests. · record: gates > the record lit. · replay: the replay row lit. ·
  score: the score, both arrows into it and the decision lit.

**match-rule** (overlap, half, long-short) · HEADLINE: When are 2 clips the same clip?
A timeline of one livestream (a horizontal time axis with minute ticks), with 2 rows of bars above it:
top row JUDGED CLIPS (each bar tagged KEPT in green or KILLED in red), bottom row THE REPLAY'S PICKS (neutral bars).
- overlap: one judged clip (10:00 to 10:45, KEPT) and the pick under it (10:05 to 10:55) lit; the shared stretch
  (10:05 to 10:45) shaded cyan between them and labeled "40 seconds shared".
- half: the same pair, with the test written beside it: 40 s shared / 45 s (the shorter clip) = 89% · at least 50% =
  the same clip.
- long-short: a second group lit further along the axis: on the top row a FULL CLIP (long bar, KEPT) with a short
  IMPACT CUT bar (KILLED) sitting inside its span on a second line; under them one new pick that overlaps both. The
  closer fit (the full clip) lit and labeled "best intersection over union"; the other gets a thin dashed outline.
The 10:00 to 10:55 times are an illustration of the rule, not record data: label the chart "example". (The pick ends at
10:55, not 10:50, so the judged clip is really the shorter one: 45 s against 50 s. Changed 2026-11-16 after the QA.)

## 4. The deck (`../clip-evals.html`), what is on screen in the screen-share scenes

One slide per chapter (17), so slide N is chapter N and Mike presses next at each chapter. Stylesheet and recording
helpers reused verbatim from `../../JCT/JCT.html` (content in `.wrap`, the left 68vw, so the webcam corner stays
clear; F = fullscreen, G = webcam guide box, arrows / Space = next slide). Each slide: the chapter number as the
eyebrow, the chapter title as the headline, and 2 to 4 short points taken from that chapter's lines (no new facts,
no numbers that are not in `RESEARCH.md`). Slides that are seen in the video (the rest are only his place-marker):
- 1 THE OPEN = the title slide: "The harness and the evals behind my clips" with the 3 parts of the video.
- 2, 4, 5, 9, 12 = each has one screen-share line (`../SCRIPT.md`), so the slide must stand on its own on camera.
- 15 = says "Switch to the browser: the Evals dashboard" (the 3 lines are filmed on `http://localhost:8766/evals.html`).
- 17 THE CLOSE = the closing slide: the takeaway ("Find where a human already says yes or no. Record it.") and the
  like / comment / subscribe line.
