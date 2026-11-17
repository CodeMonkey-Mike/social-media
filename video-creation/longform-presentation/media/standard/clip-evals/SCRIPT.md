# clip-evals: SCRIPT

_Scripted standard video (longform-presentation format 4) for AI Engineering Simplified. The sequel to the first evals
video: the agent harness around the livestream agents, and the evaluation harness built for the clip-strategist, at the
code level. Every number is from `RESEARCH.md` in this folder. Gate:
`python video-creation/longform-presentation/skills/script/lint_script.py "media/standard/clip-evals/SCRIPT.md"`._

| Setting | Value |
|---|---|
| project | clip-evals |
| channel | AI Engineering Simplified |
| silence | 800 ms min-silence, 300 ms left between sentences (the track preset) |
| enhance speech | on |
| vertical | on |

## PRODUCTION CONVENTIONS

The same tags as a long-form edited screenplay. This track uses 4 of them.

| Tag | Means |
|---|---|
| 🖥️ `[SCREENSHARE]` | spoken, on the screen share as filmed: the deck or the browser, with your webcam |
| 🗣️ `[COVER]` | spoken, while a card fills the whole frame. Your webcam is hidden, so you can read the line |
| 🎬 `[SHOW]` | what is on screen for the `[COVER]` lines above it. It starts with the card's name from the CARDS table; a dot and a second word, as in `batch-graph.gate-1`, is the same card with a different part lit. Not spoken |
| 💬 `[NOTE]` | a note to you. Not spoken |

This track has no `[FACE]` scenes, title cards or music yet, so the file has no chapter map and no budgets.

## CARDS

| id | kind | shows | states | numbers |
|---|---|---|---|---|
| the-job | card | THE JOB: a livestream in, up to 8 short clips out, and a keep or a kill on every one |  | 8 |
| last-video | card | FROM THE LAST EVALS VIDEO, in Mike's words: "The next layer is a dataset and the score." |  |  |
| roadmap | card | IN THIS VIDEO: 3 rows, one lit per state: the harness, the whole graph, the evals | harness, graph, evals | 3 |
| agent-harness | card | HARNESS, MEANING 1: the agent harness. Anthropic's definition, verbatim, with source and date |  |  |
| eval-harness | card | HARNESS, MEANING 2: the evaluation harness. Anthropic's definition, verbatim, same source |  |  |
| harness-plus-model | card | The quote, verbatim: when we evaluate an agent, we evaluate the harness and the model working together |  |  |
| three-layers | card | LangChain's 3 layers: framework, runtime, harness. `runtime` lights LangGraph as the runtime with what it provides. `blurry` adds "the lines are blurry" | all, runtime, blurry | 3 |
| nested | chart-still | System-design chart, nested: each agent inside Claude Code (agent harness), all of them inside the LangGraph graph, the evaluation harness beside it. One layer spotlit per state | claude-code, graph, evals |  |
| pipeline | chart-still | System-design chart of the pipeline: livestream, intake, 3 lanes, queues, posting. One stage spotlit per state | intake, lane-1, lanes-2-3, queues | 3 |
| batch-graph | chart-still | System-design chart of the batch graph: 14 steps in order, agents, validators and the 2 human gates marked. Walked in 7 states | start, lane-3, strategist, gate-1, gate-2, build, verify | 14, 2 |
| six-agents | card | THE 6 AGENTS IN THIS GRAPH: name, job, model tier |  | 6, 3 |
| wiring-code | card | CODE, `batch_graph.py`: `build_batch_graph` and `_after`. `nodes` lights the 14 nodes, `router` the failed-status route to END | nodes, router | 14 |
| spawn-code | card | CODE, `batch_graph.py`: `spawn_agent`. `spawn` the spawn, `retry` the overload respawn, `fallback` the quota fallback | spawn, retry, fallback | 60 |
| select-code | card | CODE, `batch_graph.py`: `lane2_select`. `spawn` the spawn, `artifact` `persist_agent_json`, `validate` the validator call | spawn, artifact, validate |  |
| validator-code | card | CODE, `cut_topics.py`: `validate_plan`, the per-clip and per-segment checks |  |  |
| context-engineering | card | CONTEXT ENGINEERING: Anthropic's definition, verbatim. Under it: a rule in the context is a request |  |  |
| rules-in-code | card | WHERE A RULE LIVES: 4 rows (plan shape, file placement, model fallback, "done"), each with the code that enforces it. One row lit per state | plan, files, fallback, done | 4 |
| what-survives | card | WHAT SURVIVES A RUN: 4 rows (the agent: nothing; checkpoints in SQLite; files on disk; docs). `nothing` carries Anthropic's "no memory of what came before" quote | nothing, checkpoints, files, docs | 1 |
| gate-code | card | CODE, `batch_graph.py`: `_gate`. `interrupt` the interrupt, `exit` exit code 2 and the resume command, `approve` the approve path | interrupt, exit, approve | 2, 5 |
| three-graders | card | 3 GRADERS, ALREADY RUNNING: code-based, model-based, human, with this graph's example of each |  | 3, 2 |
| score-layer | chart-still | System-design chart of the score layer: the 2 gates, the record, the replay, the score, the decision. `lost` the verdicts going nowhere, then one part per state | lost, record, replay, score | 3 |
| what-changed | card | WHAT WAS ADDED, WHAT WAS CHANGED: the file list with sizes. `added` lights the added files, `changed` the changed ones | added, changed | 1,023, 316, 70, 163, 518, 86, 20, 16, 3, 28 |
| kill-code | card | CODE, `batch_graph.py`: `_apply_deletes`, the one added key lit |  | 1 |
| record-call-code | card | CODE, `batch_graph.py`: `_record_gate` and `_evals_gate`. `call` the one new call, `guard` the try / except and the repair command | call, guard |  |
| record-code | card | CODE, `clip_evals.py`: `record_gate`. `kept` the kept lines, `killed` the killed lines, `skip` a line already on record | kept, killed, skip |  |
| verdict-line | card | JSON: one real line of `clip-verdicts.jsonl` (batch peach, clip 1, kept at the first gate: a line recorded live, so it carries the prompt version). 4 groups of fields, one lit per state | verdict, segments, version, proposal | 1, 48.67 |
| record-guarantees | card | THE RECORD'S 3 GUARANTEES: append-only, committed to Git, the cleanup tool refuses the folder |  | 3 |
| backfill | card | THE BACKFILL: strategist logs plus the checkpoint database, joined into 168 lines for 20 livestreams; 2 left out of scores |  | 2, 168, 20 |
| version-code | card | CODE, `clip_evals.py`: `PROMPT_FILES` and `prompt_info`. `files` the 3 files, `template` the instruction template, `hash` the 12-character version | files, template, hash | 4, 3, 2, 12 |
| stamp-code | card | CODE, `batch_graph.py`: `_evals_selected`, with the timeline of the last livestream: plan at 21:20, gate at 06:23, 9 hours apart |  | 9 |
| precision-recall | card | PRECISION AND RECALL: the 2 formulas, and what a gate can and can't see |  |  |
| missed-option | card | THE MISSED OPTION: `command` the approval command with `--missed`, `stored` the stored miss with its 4 stretches | command, stored | 4 |
| saved-transcripts | card | SAVED FOR A REPLAY: the 3 transcript files per livestream, and the 5 livestreams that have them |  | 3, 5 |
| replay-prompt | card | CODE: `clip_prompt_text` (one text for live and replay) and the replay note. `shared` the shared function, `note` the note, `answer-key` the line about the evals folder | shared, note, answer-key | 1, 2 |
| replay-code | card | CODE, `clip_evals.py`: `cmd_replay`: the same spawner, the plan check, the saved file name |  | 8, 13 |
| match-rule | chart-still | The match rule on a timeline of one livestream: the judged clips on the top row with their verdicts, the replay's picks on the row under them. `overlap` one pair and their shared seconds, `half` the 50 percent test, `long-short` a full clip, its impact cut and a new pick that overlaps both | overlap, half, long-short | 2, 50 |
| match-code | card | CODE, `clip_evals.py`: `match_score` and `best_match` |  | 2 |
| four-outcomes | card | 4 OUTCOMES for a replay pick, one lit per state, then the precision formula in `formula` | kept, killed, missed, new, formula | 4 |
| scorer-code | card | CODE, `clip_evals.py`: `score_replay`, the 4 branches |  | 4 |
| scorer-tests | card | THE SCORER IS TESTED: 70 checks, with 3 example checks listed |  | 70 |
| noise-table | card | NOISE: the same prompt twice on 4 livestreams, as a table. `held` lights the 2 that held, `moved` the 2 that moved | all, held, moved | 4, 2, 100, 83.3, 16.7, 1 |
| pairing-code | card | CODE, `clip_evals.py`: `pick_agreement`, the one-to-one pairing |  | 2 |
| noise-floor | card | THE NOISE FLOOR: around 17 points on one livestream. Under it the metric by its name, pass^k, with Anthropic's wording verbatim and its example: 75 percent per run, 42 percent over 3 runs |  | 17, 75, 3, 42 |
| record-today | card | THE RECORD TODAY: 184 lines, 21 livestreams, 98 clips judged, 81 kept, 17 killed, 82.7 percent |  | 184, 21, 98, 81, 17, 82.7 |
| by-model | card | BY MODEL: 84.1 percent (17 livestreams, 82 clips) against 75.0 percent (2 livestreams, 16 clips) |  | 84.1, 75.0, 17, 82, 2, 16 |
| kills | card | WHERE THE KILLS ARE: `pairs` 11 of 17 kills are one half of a pair, `rates` full clips 88.3 percent kept, impact cuts 61.9 percent | pairs, rates | 17, 11, 88.3, 61.9 |
| recall | card | RECALL, FIRST LIVE RUN: 7 kept, 1 missed, 87.5 percent |  | 7, 1, 87.5 |
| not-yet | card | NOT YET: 3 rows, one lit per state: the record is not memory, feeding examples back, testing a cheaper model | not-memory, feed-back, cheaper-model |  |

## CH1 - THE OPEN

💬 `[NOTE]` Title slide up. Look at the camera for the first line. One breath before you start.
🖥️ `[SCREENSHARE]` Every time I go live, an AI pipeline turns that livestream into short clips. 30 seconds, 60 seconds, 90 seconds, up to 8 of them per stream.
🗣️ `[COVER]` An agent reads the transcript and picks the moments. Then I watch every clip, and I keep it or I kill it.
🎬 `[SHOW]` the-job: the card THE JOB. A livestream goes in, up to 8 short clips come out, and each one gets a keep or a kill.
🗣️ `[COVER]` In my last video on evals, I said those verdicts were going nowhere. The pipeline had no record of what I rejected, so it couldn't tell if the next run was any better than the last one.
🗣️ `[COVER]` I said the next layer was a dataset and a score. So I built it, and I'm gonna show you all of it.
🎬 `[SHOW]` last-video: a quote card, Mike's own line from the last evals video: "The next layer is a dataset and the score."
🗣️ `[COVER]` We'll start with the harness, which is the code that surrounds the agents and holds them to the rules.
🎬 `[SHOW]` roadmap.harness: the card IN THIS VIDEO, 3 rows: the harness, the whole graph, the evals. The harness row is lit.
🗣️ `[COVER]` Then the whole graph, every step and every agent in it.
🎬 `[SHOW]` roadmap.graph: The whole graph row lights.
🗣️ `[COVER]` Then the evals: how a verdict gets recorded, how an old livestream gets replayed, and how a prompt gets a score.
🎬 `[SHOW]` roadmap.evals: The evals row lights.
🖥️ `[SCREENSHARE]` And we'll do all of it at the code level. The Python, the JSON, what I added and what I changed.
🖥️ `[SCREENSHARE]` And stay for the first thing the scores told me, because it wasn't about the prompt at all.

## CH2 - TWO KINDS OF HARNESS

🗣️ `[COVER]` So let's start with the word harness, because people use it for 2 different things.
🗣️ `[COVER]` The first one is the agent harness. Anthropic defines it as "the system that enables a model to act as an agent."
🗣️ `[COVER]` A model only produces text. The harness runs the loop, hands it tools, carries out the tool calls and returns the result.
🎬 `[SHOW]` agent-harness: the card HARNESS, MEANING 1: the agent harness. Anthropic's definition quoted in full, with the source and date.
🗣️ `[COVER]` The second one is the evaluation harness. Same source: "the infrastructure that runs evals end-to-end."
🗣️ `[COVER]` It hands out the tasks, records every step, grades the output and adds up the results.
🎬 `[SHOW]` eval-harness: the card HARNESS, MEANING 2: the evaluation harness. Anthropic's definition quoted in full, same source.
🗣️ `[COVER]` And here's why both belong in one video. When you evaluate an agent, you're never grading the model alone. You're grading the model and its harness working together.
🎬 `[SHOW]` harness-plus-model: a quote card. Anthropic's line that evaluating an agent means evaluating the harness and the model working together, quoted in full.
🗣️ `[COVER]` LangChain splits this stack 3 ways: a framework, a runtime and a harness.
🎬 `[SHOW]` three-layers.all: the card of LangChain's 3 layers: framework, runtime, harness. All 3 are lit.
🗣️ `[COVER]` By their own labels, LangGraph is the runtime. It gives you durable execution, persistence and human in the loop support.
🎬 `[SHOW]` three-layers.runtime: LangGraph lights up as the runtime, with what it provides: durable execution, persistence, human in the loop support.
🗣️ `[COVER]` And they say outright that the lines are blurry, so don't get stuck on the labels.
🎬 `[SHOW]` three-layers.blurry: LangChain's own line that the lines are blurry appears, quoted.
🗣️ `[COVER]` Here's how those words map onto what I run. Every one of my agents runs inside Claude Code, and Claude Code is an agent harness. It owns the loop and the tools.
🎬 `[SHOW]` nested.claude-code: a system-design chart of 3 nested layers: the agents inside Claude Code, the LangGraph graph around them, the evaluation harness beside the graph. The inner layer is lit: each agent inside Claude Code.
🗣️ `[COVER]` Around the agents sits a LangGraph graph. It decides the order, checks every output, stops for a human and retries what fails.
🎬 `[SHOW]` nested.graph: The LangGraph graph around the agents lights.
🗣️ `[COVER]` And right beside the graph sits the evaluation harness. That's the new part, and it's where we'll end up.
🎬 `[SHOW]` nested.evals: The evaluation harness beside the graph lights.
🖥️ `[SCREENSHARE]` You'll hear people call all of this harness engineering. It's everything you build around the model so the result doesn't depend on the model behaving.

## CH3 - THE PIPELINE AND THE GRAPH

🗣️ `[COVER]` Now the system itself. A livestream comes in, and the first step re-encodes it, makes a vertical version and transcribes it.
🎬 `[SHOW]` pipeline.intake: a system-design chart of the pipeline, left to right: livestream, intake, 3 lanes, queues, posting. The livestream and the intake are lit.
🗣️ `[COVER]` From that transcript the work fans out into 3 lanes. Lane 1 is the long-form video.
🎬 `[SHOW]` pipeline.lane-1: The fan-out into 3 lanes appears, lane 1 lit.
🗣️ `[COVER]` Lane 2 is the vertical shorts, and those are the clips. Lane 3 is text and images: tweets, threads and posts.
🎬 `[SHOW]` pipeline.lanes-2-3: Lane 2 and lane 3 light.
🗣️ `[COVER]` Everything lands in queues, and separate scripts post from those queues. Today we care about lane 2.
🎬 `[SHOW]` pipeline.queues: The queues and the posting scripts light, and lane 2 stays marked.
🗣️ `[COVER]` One LangGraph graph owns all 3 lanes, and it has 14 steps. It starts with the intake, then it registers the batch.
🎬 `[SHOW]` batch-graph.start: a system-design chart of the batch graph: all 14 steps in order, with the agents, the validators and the 2 human gates marked. The intake and register steps are lit.
🗣️ `[COVER]` Lane 3 gets launched right away as its own process, so the posts are being drafted while the clips are being made.
🎬 `[SHOW]` batch-graph.lane-3: The lane 3 launch lights, branching off as its own process.
🗣️ `[COVER]` Then the clip strategist runs. That's the agent that reads the transcript and proposes the clips, and it's the one we're gonna evaluate.
🎬 `[SHOW]` batch-graph.strategist: The clip strategist step lights.
🗣️ `[COVER]` The clips get cut, and the graph stops. That's the first human in the loop gate. I watch the raw cuts and I keep or kill each one.
🎬 `[SHOW]` batch-graph.gate-1: The cut step and the first human gate light.
🗣️ `[COVER]` The survivors get tightened, which means an agent plans which filler to remove, and then there's a second human gate.
🎬 `[SHOW]` batch-graph.gate-2: The tighten steps and the second human gate light.
🗣️ `[COVER]` After that the graph finishes the clips, builds each short and publishes them to the posting queue.
🎬 `[SHOW]` batch-graph.build: Finish, build and publish light.
🗣️ `[COVER]` The last 2 steps wait for lane 3 and verify the whole batch. The graph refuses to report done while any lane is still pending.
🎬 `[SHOW]` batch-graph.verify: The last 2 steps light: wait for lane 3, verify the batch.
🗣️ `[COVER]` 6 agents work inside this graph. 3 of them make judgment calls and hand back a plan, and 3 of them build or check things.
🗣️ `[COVER]` And each one sits on the model tier that matches how much judgment its job needs.
🎬 `[SHOW]` six-agents: the card THE 6 AGENTS IN THIS GRAPH: each agent with its job and its model tier.
🗣️ `[COVER]` In code, the graph is short. 14 nodes, each one a plain Python function, wired in a chain.
🎬 `[SHOW]` wiring-code.nodes: code from batch_graph.py, the function that builds the graph. The 14 node lines are lit.
🗣️ `[COVER]` And every edge between 2 steps is a conditional edge, with the same small routing function behind it. If a step reports failed, the next stop is the end. The run halts where it broke.
🎬 `[SHOW]` wiring-code.router: The routing function lights: a failed step goes to the end.

## CH4 - HOW THE HARNESS HOLDS AN AGENT

🖥️ `[SCREENSHARE]` So how does a step use an agent? It spawns one, headless, the same way you'd run any command line tool.
🗣️ `[COVER]` The agent gets a prompt, does its work, and everything it prints streams into a log file.
🎬 `[SHOW]` spawn-code.spawn: code from batch_graph.py, spawn_agent. The spawn itself is lit.
🗣️ `[COVER]` If the API comes back overloaded, the harness waits 60 seconds and retries it once.
🎬 `[SHOW]` spawn-code.retry: The overload wait of 60 seconds and the one respawn light.
🗣️ `[COVER]` And if the top model is out of quota, it retries the same agent once on the next model down. A run never stalls on a quota.
🎬 `[SHOW]` spawn-code.fallback: The quota fallback to the next model down lights.
🗣️ `[COVER]` Here's the step that picks the clips. It spawns the strategist, and then it doesn't trust a word of the reply.
🎬 `[SHOW]` select-code.spawn: code from batch_graph.py, the step that picks the clips. The strategist spawn is lit.
🗣️ `[COVER]` What it trusts is the artifact. The plan has to exist on disk as a JSON file. And if the agent only answered in chat, the harness pulls the JSON out of the text and writes the file itself.
🎬 `[SHOW]` select-code.artifact: The file check lights: the plan has to exist on disk as JSON.
🗣️ `[COVER]` Then the file goes through a validator. It's the same validator the cutting step uses, so there's one source of truth.
🎬 `[SHOW]` select-code.validate: The validator call lights.
🗣️ `[COVER]` The validator isn't smart, and that's the point. Every clip needs an id, a title and a list of segments. Every segment has to end after it starts, and nothing can run past the end of the recording.
🗣️ `[COVER]` If the plan fails, the run stops right there, before a single frame gets cut.
🎬 `[SHOW]` validator-code: code from cut_topics.py, validate_plan, with the per-clip and per-segment checks lit.

## CH5 - RULES IN CODE, NOT IN THE PROMPT

🗣️ `[COVER]` There's a name for deciding what the model sees: context engineering. Anthropic calls it "the art and science of curating what will go into the limited context window."
🗣️ `[COVER]` That work matters, and it's one part of a harness. But a rule that only lives in the context is a request. The model can miss it.
🎬 `[SHOW]` context-engineering: the card CONTEXT ENGINEERING. Anthropic's definition quoted in full, and under it: a rule in the context is a request.
🗣️ `[COVER]` So every rule that has to hold goes into code. The shape of a clip plan lives in the validator.
🎬 `[SHOW]` rules-in-code.plan: the card WHERE A RULE LIVES, 4 rows, each rule beside the code that enforces it. Row 1 is lit: the plan's shape, in the validator.
🗣️ `[COVER]` Where files are allowed to go lives in a hook. It runs at the end of every turn, and again before every commit.
🎬 `[SHOW]` rules-in-code.files: Row 2 lights: file placement, in a hook.
🗣️ `[COVER]` The model fallback lives in the spawner, and there's a script that proves every spawner has it.
🎬 `[SHOW]` rules-in-code.fallback: Row 3 lights: the model fallback, in the spawner, with the script that checks it.
🗣️ `[COVER]` And done isn't something an agent gets to claim. The last step of the graph checks the disk and the queues for itself.
🎬 `[SHOW]` rules-in-code.done: Row 4 lights: done, checked by the last step of the graph.
🖥️ `[SCREENSHARE]` The prompt explains the job. The code enforces the rules.

## CH6 - STATE AND MEMORY

🗣️ `[COVER]` Next is memory, and this is the part that trips people up. My agents don't remember anything. Every run starts fresh.
🗣️ `[COVER]` Anthropic describes the same problem for long-running agents: "each new session begins with no memory of what came before."
🎬 `[SHOW]` what-survives.nothing: the card WHAT SURVIVES A RUN, 4 rows. Row 1 is lit: the agent keeps nothing, with Anthropic's quote under it.
🗣️ `[COVER]` So the harness holds the state. The graph checkpoints every step into SQLite, 1 thread per batch, so a run can stop and pick up later.
🎬 `[SHOW]` what-survives.checkpoints: Row 2 lights: checkpoints in SQLite, 1 thread per batch.
🗣️ `[COVER]` The work itself lives in files. The clip plan and a progress file are the contract between the steps, and every step checks the disk before it does anything. Re-run a batch and it skips whatever's already done.
🎬 `[SHOW]` what-survives.files: Row 3 lights: files on disk.
🗣️ `[COVER]` And the knowledge lives in docs that the agents read at the start of every run.
🎬 `[SHOW]` what-survives.docs: Row 4 lights: the docs the agents read.
🗣️ `[COVER]` That's what makes a human gate possible. In code, the gate is a LangGraph interrupt.
🎬 `[SHOW]` gate-code.interrupt: code from batch_graph.py, the gate function. The interrupt is lit.
🗣️ `[COVER]` The run exits with code 2, prints the exact command to resume, and hands the machine to the next job. I can come back in 5 minutes or the next morning.
🎬 `[SHOW]` gate-code.exit: Exit code 2 and the printed resume command light.
🗣️ `[COVER]` When I approve, that same step runs again, applies my kills and moves on.
🎬 `[SHOW]` gate-code.approve: The approve path lights.

## CH7 - WHAT WAS MISSING

🗣️ `[COVER]` So this graph was already grading its own work 3 ways. And they're the same 3 grader types Anthropic lists: code-based, model-based and human.
🗣️ `[COVER]` The validators are code. The visual QA agent is a model judging another model's images. And the 2 gates are me.
🗣️ `[COVER]` But every one of them judges a single run. Nothing compared this week's strategist to last week's.
🎬 `[SHOW]` three-graders: the card 3 GRADERS, ALREADY RUNNING: code-based, model-based and human, each with its example from this graph.
🗣️ `[COVER]` And my verdicts were being thrown away. Those are human labels, the best signal in the whole system. A killed clip kept its number and its name, and that was all.
🗣️ `[COVER]` So when I changed the strategist's prompt, I had no way to know if it got better. I was guessing.
🎬 `[SHOW]` score-layer.lost: a system-design chart of the score layer: the 2 gates, the record, the replay, the score, the decision. The 2 gates are lit, their verdicts going nowhere.
🗣️ `[COVER]` The fix has 3 parts. First, a record of every verdict.
🎬 `[SHOW]` score-layer.record: The record lights.
🗣️ `[COVER]` Second, a way to replay an old livestream through the strategist the way it's written today.
🎬 `[SHOW]` score-layer.replay: The replay lights.
🗣️ `[COVER]` And third, a score that compares the new picks to my old verdicts. Put together, that's an evaluation harness.
🎬 `[SHOW]` score-layer.score: The score and the decision light.

## CH8 - WHAT CHANGED IN THE REPO

🗣️ `[COVER]` Here's the whole change on one screen. Most of the work is new code that sits outside the graph: 1 module of around 1,000 lines, its tests, a one-time backfill script and a dashboard page.
🎬 `[SHOW]` what-changed.added: the card WHAT WAS ADDED, WHAT WAS CHANGED: the file list with line counts. The added files are lit.
🗣️ `[COVER]` Inside the graph, the change is small on purpose. 86 lines added to the graph file, and 16 to the command that drives it.
🗣️ `[COVER]` An eval layer should watch production. It shouldn't be woven through it.
🎬 `[SHOW]` what-changed.changed: The changed files light: 86 lines into the graph file, 16 into the command that drives it.

## CH9 - RECORDING A VERDICT

🗣️ `[COVER]` Let's follow one verdict through the code, starting at the gate. This function applies my kills, and it changed by 1 line.
🗣️ `[COVER]` A killed clip used to leave the plan with just its id and its slug. Now the whole proposal goes with it: the segments, the title and the strategist's reasoning.
🎬 `[SHOW]` kill-code: code from batch_graph.py, the function that applies the kills, with the one added key lit.
🗣️ `[COVER]` Then the gate records its approval, the way it always did, and makes one new call into the evals module.
🎬 `[SHOW]` record-call-code.call: code from batch_graph.py, where the gate records itself. The one new call is lit.
🗣️ `[COVER]` Look at how that call is wrapped. If the record can't be written, the batch keeps going, the failure prints loudly, and the repair command prints with it.
🎬 `[SHOW]` record-call-code.guard: The try / except around it and the printed repair command light.
🖥️ `[SCREENSHARE]` An eval layer that can break production is worse than no eval layer.
🗣️ `[COVER]` And this is the function that writes the record. Every clip still in the plan at this gate gets a line that says kept.
🎬 `[SHOW]` record-code.kept: code from clip_evals.py, record_gate. The kept lines are lit.
🗣️ `[COVER]` Every clip I deleted at this gate gets a line that says killed.
🎬 `[SHOW]` record-code.killed: The killed lines light.
🗣️ `[COVER]` And if a line for that clip at that gate is already on record, it's skipped. So I can re-run a batch and nothing gets written twice.
🎬 `[SHOW]` record-code.skip: The skip for a line already on record lights.
🗣️ `[COVER]` Here's one real line. The format is JSON lines, 1 object per line. It starts with the batch, the clip, the gate and the verdict.
🎬 `[SHOW]` verdict-line.verdict: JSON, one real line of the record: clip 1 of the first livestream recorded live, kept at the first gate. The batch, clip, gate and verdict fields are lit.
🗣️ `[COVER]` The segments are the exact seconds of the recording, and they're what makes scoring possible later.
🎬 `[SHOW]` verdict-line.segments: The segments light.
🗣️ `[COVER]` The prompt version and the model say which strategist made the pick.
🎬 `[SHOW]` verdict-line.version: The prompt version and the model light.
🗣️ `[COVER]` And the proposal is the full clip exactly as the agent wrote it, so I can go back and see what kind of clip I reject.
🎬 `[SHOW]` verdict-line.proposal: The proposal lights.
🗣️ `[COVER]` The file is append-only. Nothing in the code ever rewrites a line. It's committed to Git, and the cleanup tool that recycles old batches refuses to touch that folder.
🎬 `[SHOW]` record-guarantees: the card THE RECORD'S 3 GUARANTEES: append-only, committed to Git, and the cleanup tool refuses the folder.
🗣️ `[COVER]` I didn't start from zero, either. The old verdicts were still sitting in 2 places: the strategist's logs had every plan, and the checkpoint database had every kill.
🗣️ `[COVER]` A one-time script joined them into 168 lines covering 20 livestreams. 2 of those were too old to match a kill to a clip, so they're on record but left out of every score.
🎬 `[SHOW]` backfill: the card THE BACKFILL: the strategist logs plus the checkpoint database, joined into 168 lines for 20 livestreams, 2 left out of the scores.

## CH10 - THE PROMPT VERSION

🗣️ `[COVER]` Now, which strategist made the pick. A score per prompt change needs a definition of a prompt change, so the version is a hash of 4 things.
🗣️ `[COVER]` 3 of them are files: the agent's own definition and the 2 skill docs it reads before it picks.
🎬 `[SHOW]` version-code.files: code from clip_evals.py, the prompt version. The 3 files are lit.
🗣️ `[COVER]` The last one is the instruction text the graph sends, with the file paths blanked out.
🎬 `[SHOW]` version-code.template: The instruction template lights.
🗣️ `[COVER]` Change any one of those and you get a new 12 character version.
🎬 `[SHOW]` version-code.hash: The 12 character version lights.
🗣️ `[COVER]` And it gets stamped the moment the plan passes validation, never at the gate. On my last livestream the plan was written at 9:20 at night, and I approved it at 6:23 the next morning. That's 9 hours.
🗣️ `[COVER]` Say I'd edited the prompt during those 9 hours. A stamp at the gate would read the new prompt, and give it the credit for clips the old prompt picked.
🎬 `[SHOW]` stamp-code: code from batch_graph.py, the stamp right after validation, beside a timeline of the last livestream: plan at 21:20, gate at 06:23.

## CH11 - RECALL

🗣️ `[COVER]` That record gives me precision. Of the clips it proposed, how many did I keep?
🗣️ `[COVER]` It can't give me recall, because a gate only sees what was proposed. It never sees the great moment the strategist walked right past.
🎬 `[SHOW]` precision-recall: the card PRECISION AND RECALL: the 2 formulas, and what a gate can and can't see.
🗣️ `[COVER]` So the approval command takes one more option. When I approve the gate, I can name what it missed.
🎬 `[SHOW]` missed-option.command: the card THE MISSED OPTION. The approval command with the missed option.
🗣️ `[COVER]` On the first live run I named one: a topic that kept coming back through the stream. It's stored as one miss with 4 stretches of time, so it counts once.
🗣️ `[COVER]` And when nothing was missed, I say that too. No answer and nothing missed aren't the same data.
🎬 `[SHOW]` missed-option.stored: The stored miss with its 4 stretches of time.

## CH12 - REPLAY

🗣️ `[COVER]` The record alone only scores the past. To score a prompt change, I need the strategist to pick again from a livestream I've already judged.
🗣️ `[COVER]` I call that a replay. It's the same transcript with today's prompt, and all that comes back is a new list of proposed clips. Nothing gets cut and nothing gets posted. In eval terms, that's an offline evaluation.
🗣️ `[COVER]` So when a plan validates, the harness also saves the 3 transcript files the strategist read. The batch folder gets cleaned up later, and the evals copy stays. Right now 5 livestreams can be replayed.
🎬 `[SHOW]` saved-transcripts: the card SAVED FOR A REPLAY: the 3 transcript files kept per livestream, and the 5 livestreams that have them.
🗣️ `[COVER]` A replay sends the exact same instructions a live run sends. I pulled that text into 1 function, so the 2 can't drift apart.
🎬 `[SHOW]` replay-prompt.shared: code, the instruction text shared by live runs and replays, with the replay note under it. The shared function is lit.
🗣️ `[COVER]` Then it adds a note. This isn't production, nothing gets cut, and work only from these transcript files.
🎬 `[SHOW]` replay-prompt.note: The replay note lights.
🗣️ `[COVER]` And don't open the evals folder. The answer key is in this repo, and the agent can read files. If it reads them, that's data leakage.
🎬 `[SHOW]` replay-prompt.answer-key: The line about the evals folder lights.
🖥️ `[SCREENSHARE]` But here's the thing. That last line is a request, and nothing proves the agent obeyed it. So a score that looks too good gets a second look.
🗣️ `[COVER]` The replay goes through the same spawner as a live run, so it gets the same retries and the same fallback. The plan it returns gets checked, stamped with the prompt version and saved. One replay costs one strategist run, around 8 to 13 minutes.
🎬 `[SHOW]` replay-code: code from clip_evals.py, the replay command, with the shared spawner, the plan check and the saved file name lit.

## CH13 - MATCHING AND SCORING

🗣️ `[COVER]` Now the hard part, scoring a replay. A replay hands me a new list of clips, and I already have a verdict on every clip in the old list. So for each new clip, the code has to find the old clip it matches.
🗣️ `[COVER]` And the 2 lists never line up exactly. The new prompt might start a clip 5 seconds later, or let it run a little longer. So I need a rule for when 2 clips are the same clip.
🗣️ `[COVER]` Every clip is stored as start and end times in the recording. So the code counts how many seconds of the recording 2 clips share.
🎬 `[SHOW]` match-rule.overlap: a chart, a timeline of one livestream with 2 rows: the judged clips on top with their verdicts, the replay's picks under them. One pair is lit, with the seconds they share.
🗣️ `[COVER]` If the overlap is at least 50 percent of the shorter clip, that's a match.
🎬 `[SHOW]` match-rule.half: The 50 percent test against the shorter clip.
🗣️ `[COVER]` There's one complication. A topic can have 2 old clips on record: the full clip, and a short impact cut taken from inside it. So a new pick can overlap both.
🗣️ `[COVER]` In that case it gets matched to the closer fit, and the measure is intersection over union: the seconds they share, divided by all the seconds the 2 clips cover together.
🎬 `[SHOW]` match-rule.long-short: A full clip and its impact cut on the top row, and one new pick under them that overlaps both. The closer fit is lit.
🗣️ `[COVER]` In code that's 2 small functions. One returns the shared portion and the intersection over union. The other walks the judged clips and keeps the best candidate above the threshold.
🎬 `[SHOW]` match-code: code from clip_evals.py, the 2 matching functions.
🗣️ `[COVER]` Every new pick then lands in 1 of 4 buckets. It matches a clip I kept, and that's a hit.
🎬 `[SHOW]` four-outcomes.kept: the card 4 OUTCOMES for a replay pick. Outcome 1 is lit: it matches a kept clip.
🗣️ `[COVER]` It matches a clip I killed, so the new prompt repeated a choice I'd already rejected.
🎬 `[SHOW]` four-outcomes.killed: Outcome 2 lights: it repeats a kill.
🗣️ `[COVER]` It lands on a moment I said was missed, and that counts in its favor.
🎬 `[SHOW]` four-outcomes.missed: Outcome 3 lights: it finds a miss.
🗣️ `[COVER]` Or it's new, with no verdict at all. That pick is neither right nor wrong, so it stays out of the score.
🎬 `[SHOW]` four-outcomes.new: Outcome 4 lights: new, no verdict.
🗣️ `[COVER]` Precision is the good picks, over the good picks plus the repeated kills.
🎬 `[SHOW]` four-outcomes.formula: The precision formula appears.
🗣️ `[COVER]` And here's that logic in the scorer. 4 branches, 4 counters, and a detail row per pick, so I can read exactly why a replay scored what it scored.
🎬 `[SHOW]` scorer-code: code from clip_evals.py, the scorer, with its 4 branches lit.
🗣️ `[COVER]` The scorer has its own tests, 70 checks on made-up clips. If the matching math is wrong, every score that follows is wrong, and nothing would tell you.
🎬 `[SHOW]` scorer-tests: the card THE SCORER IS TESTED: 70 checks, with 3 example checks listed.

## CH14 - NOISE

🗣️ `[COVER]` So now I had a score. And before I touched any prompt, I ran the same prompt twice on 4 livestreams. A score means nothing until you know how much it moves all by itself. That's run-to-run variance.
🎬 `[SHOW]` noise-table.all: the card NOISE, a table of the same prompt run twice on 4 livestreams. The whole table.
🗣️ `[COVER]` On 2 of them, both runs scored the same.
🎬 `[SHOW]` noise-table.held: The 2 livestreams that held are lit.
🗣️ `[COVER]` On the other 2, the first run scored 100 percent and the second scored 83.3. Same prompt, same transcript, same model.
🗣️ `[COVER]` And the moments it picked were almost identical. The difference was 1 impact cut, and it happened to be one I'd killed.
🎬 `[SHOW]` noise-table.moved: The 2 that moved light: 100 percent, then 83.3.
🗣️ `[COVER]` Measuring that took a stricter comparison, by the way. Picks get paired one to one between the 2 runs, so an extra short cut can't hide inside the long clip it came from.
🎬 `[SHOW]` pairing-code: code from clip_evals.py, the function that pairs picks one to one between 2 runs.
🗣️ `[COVER]` So on a single livestream, a swing of around 17 points is noise. A prompt edit has to beat that before I believe it.
🗣️ `[COVER]` Anthropic describes a metric for exactly this: the probability that all of your trials succeed. At 75 percent per run, 3 runs in a row come out around 42 percent.
🗣️ `[COVER]` One run of an eval can't tell you much about an agent.
🎬 `[SHOW]` noise-floor: the card THE NOISE FLOOR: around 17 points on one livestream. Under it, the metric by its name, pass^k, with Anthropic's wording quoted and its example: 75 percent per run is 42 percent over 3 runs.

## CH15 - WHAT THE RECORD SHOWS

💬 `[NOTE]` Switch to the browser: the dashboard's Evals page, scrolled to the top. Open the best-time row on the second line.
🖥️ `[SCREENSHARE]` Here's all of it on the dashboard. This page is read-only and it has no scoring logic of its own. One function in the evals module builds its data.
🖥️ `[SCREENSHARE]` Every livestream is a row. When I open one, I get every clip, the verdict at each gate, and the strategist's own reasoning for proposing it.
🖥️ `[SCREENSHARE]` And under that, every replay of that livestream, pick by pick.
🗣️ `[COVER]` So what's in the record? 184 lines covering 21 livestreams. 98 clips judged, 81 kept and 17 killed. That's 82.7 percent precision.
🎬 `[SHOW]` record-today: the card THE RECORD TODAY: 184 lines, 21 livestreams, 98 clips judged, 81 kept, 17 killed, 82.7 percent.
🗣️ `[COVER]` Split by model, the top model is at 84.1 percent. The livestreams where it ran out of quota and fell back are at 75. That's only 2 livestreams, so it's a lead, and now it's one I can test.
🎬 `[SHOW]` by-model: the card BY MODEL: 84.1 percent against 75.0 percent, with the livestreams and clips behind each.
🗣️ `[COVER]` And here's the finding I didn't expect. Of the 17 kills, 11 were one half of a pair, a full clip and its impact cut, where I kept the other half.
🎬 `[SHOW]` kills.pairs: the card WHERE THE KILLS ARE. 11 of 17 kills are one half of a pair.
🗣️ `[COVER]` Full clips get kept 88.3 percent of the time. Impact cuts get kept 61.9 percent of the time.
🗣️ `[COVER]` So most of my kills aren't bad topics. They're a second version of a topic I already said yes to. That's a specific thing to fix in a prompt, and I'd never have seen it without the record.
🗣️ `[COVER]` And from here on I can attach a reason to a kill, in a few words. The pattern tells me where to look, and the reason tells me what to change.
🎬 `[SHOW]` kills.rates: Full clips 88.3 percent kept, impact cuts 61.9 percent.
🗣️ `[COVER]` And recall finally has a number. On the first livestream recorded live, I kept 7 and named 1 miss, so 87.5 percent. It's 1 livestream, and every stream from here on adds to it.
🎬 `[SHOW]` recall: the card RECALL, FIRST LIVE RUN: 7 kept, 1 missed, 87.5 percent.

## CH16 - WHAT IT ISN'T YET

🗣️ `[COVER]` One thing this record isn't: memory. The strategist never sees it. It's a measurement, and it's for me.
🎬 `[SHOW]` not-yet.not-memory: the card NOT YET, 3 rows. Row 1 is lit: the record is not memory.
🗣️ `[COVER]` It turns into memory the day I feed kept and killed examples back into the prompt. And now I can measure if that helps.
🎬 `[SHOW]` not-yet.feed-back: Row 2 lights: feeding examples back.
🗣️ `[COVER]` The same goes for the model. Can a cheaper one pick as well? That used to be an opinion. Now it's a replay.
🎬 `[SHOW]` not-yet.cheaper-model: Row 3 lights: testing a cheaper model.

## CH17 - THE CLOSE

💬 `[NOTE]` Back to the deck's last slide. Look at the camera.
🖥️ `[SCREENSHARE]` So that's the setup. An agent harness that holds the model to the rules, and an evaluation harness that tells you if it's getting any better.
🖥️ `[SCREENSHARE]` If you run agents in production, find the spot where a human already says yes or no. That's a labeled dataset, and most pipelines throw it away. Start recording it.
🖥️ `[SCREENSHARE]` If you like this vid, make sure you give it a like. Comment below and let me know what you'd score in your own pipeline.
🖥️ `[SCREENSHARE]` Hit subscribe, and I'm gonna catch you guys, later.

## NOTES

**Script approved by Mike 2026-11-16** ("I think this whole script is good"), so the assets are being built.

**Start settings (Mike, 2026-11-16):** scripted; the silence definition is the track preset (800 ms min-silence,
300 ms left between sentences); Enhance Speech is on, so the spine's WAV is handed to him and the enhanced track is
remuxed (`skills/card-overlays/card-overlays.md`, procedure step 1).

**Extras:** the vertical cut (Mike, 2026-11-16, named when he approved the script), so its card set is built with the
16:9 one, before he records. No short and no YT post were named.

**Length.** About 3,300 spoken words in 144 lines. At pieverse's pace (around 3 words a second) that is around 19
minutes; at a slower explaining pace, around 23. Nothing was cut for time, and any section can go deeper.

**Screen-share lines need the right thing on screen**, because those scenes ship as filmed:
- CH1 and CH17: the deck's title and closing slides.
- CH2, CH4, CH5, CH9 and CH12, one line each: that chapter's deck slide is up, and you look at the camera.
- CH15, the three dashboard lines: the browser on `http://localhost:8766/evals.html` (start the dashboard first:
  `schedule-tweets/skills/dashboard.md`). Open the `best-time` row during the second line and scroll to its replays
  during the third.

**Reading code names.** The cards show the real function names. The lines say them in plain words ("the function that
applies my kills"), so there is nothing to pronounce.

**Numbers will move.** Every figure in CH9, CH14 and CH15 comes from the record as of 2026-11-16 and changes with each
new livestream. They are re-pulled into `RESEARCH.md` and their cards rebuilt before the render (`script.md` step 7).
If a number has moved by the day of recording, say the new one: the cue step flags any number said differently.

**Do not air** (full list in `RESEARCH.md` section 6): the agent launch flags, anything from the work demo notes, model
version numbers in speech, and any "I'm still learning this" framing.

**Sources for the quoted definitions** are in `RESEARCH.md` section 2, with the date each page was read. One source
could not be read from here (OpenAI's post titled "Harness engineering"), so the script uses the phrase without naming
or dating it.

**Open loop.** The last line of CH1 promises "the first thing the scores told me". The payoff is CH14 (the noise).
Nothing before CH14 gives it away.
