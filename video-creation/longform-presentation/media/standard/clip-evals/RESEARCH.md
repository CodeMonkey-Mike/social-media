# clip-evals: RESEARCH

_The only source of facts and numbers for the video "the agent harness and the eval harness around the clip-strategist"
(AI Engineering Simplified, longform-presentation format 4, SCRIPTED). Written 2026-11-16. Every figure a card prints
or Mike says comes from here. Repo numbers were read from the repo that day and WILL DRIFT: each one names the command
that re-pulls it, and `script.md` step 7 (record-day numbers) re-pulls them before the render._

## 1. What the video is

- **Sequel to the first evals video** (longform-edited project `evals`, recorded by Mike on camera). In it he said, at
  about 10:16 to 10:47 of the final spine (source: `video-creation/todo/aiEngineeringSimplified.md`):
  - "The next layer is a dataset and the score. Every clip the strategist proposes and I keep or kill gets recorded at
    the gate. Keep those records and that's a labeled dataset. Replay old transcripts. Score the proposals against my
    verdicts. And I get a precision number for every prompt change."
  - "But here's the thing, it only gives me precision. The gate records what I killed, not what I wish it had found.
    So recall needs one more field in the gate record."
  - "The pipeline already runs three grader families in production. The score layer is what I'm building next."
- **This video shows it built**, at the code level, and first explains the harness it sits inside.
- **Channel rules that bind the script:** present with authority, never as a co-beginner
  (`video-creation/ai-engineering/ai_channel_plan.md`); the accuracy pass (section 7 below); no em dashes on screen.

## 2. Sources for the terms (read 2026-11-16)

Quotes are verbatim. A card may print a quote exactly as written here, with its source and date.

| # | Source | Date printed on the page | What it gives us |
|---|---|---|---|
| S1 | Anthropic, "Demystifying evals for AI agents", https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | Jan 9, 2026 | Both meanings of "harness", the grader types, trials, pass^k |
| S2 | LangChain (Harrison Chase), "Agent Frameworks, Runtimes, and Harnesses- oh my!", https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my | October 25, 2025 | Framework / runtime / harness, and where LangGraph sits |
| S3 | LangChain docs, "Runtimes, frameworks, and harnesses", https://docs.langchain.com/oss/python/concepts/products | no date on the page | One-line descriptions and examples |
| S4 | Anthropic, "Effective context engineering for AI agents", https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Sep 29, 2025 | The definition of context engineering |
| S5 | Anthropic, "Effective harnesses for long-running agents", https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | Nov 26, 2025 | Agents start each session with no memory |
| S6 | OpenAI, "Harness engineering: leveraging Codex in an agent-first world", https://openai.com/index/harness-engineering/ | NOT READ: the page refused the fetch (403) | Only that a post with this title exists (it shows in search results). Nothing in the script quotes it or states its date |

**S1, verbatim:**
- "An agent harness (or scaffold) is the system that enables a model to act as an agent: it processes inputs,
  orchestrates tool calls, and returns results."
- "When we evaluate "an agent," we're evaluating the harness and the model working together."
- "For example, Claude Code is a flexible agent harness, and we used its core primitives through the Agent SDK to build
  our long-running agent harness."
- "An evaluation harness is the infrastructure that runs evals end-to-end. It provides instructions and tools, runs
  tasks concurrently, records all the steps, grades outputs, and aggregates results."
- "Agent evaluations typically combine three types of graders: code-based, model-based, and human."
- "Each attempt at a task is a trial." "Because model outputs vary between runs, we run multiple trials to produce more
  consistent results."
- pass^k "measures the probability that all k trials succeed." The page's worked example: "(0.75)³ ≈ 42%" for a 75%
  per-trial rate across three trials.
- "20-50 simple tasks drawn from real failures is a great start."

**S2, verbatim:**
- "LangChain is an agent framework, LangGraph is an agent runtime, DeepAgents is an agent harness."
- On what a runtime provides: "The main one that comes to mind is durable execution." Also "support for streaming,
  human-in-the-loop support, thread level persistence and cross-thread persistence."
- "Now, I will readily admit that the lines are blurry."
- "LangGraph is probably best described as both a runtime and a framework, for example."
- "To be fair, Claude Code is also trying to be an agent harness"

**S3, verbatim:** "Agent runtimes provide the tooling for running agents in production." "Agent harnesses are
opinionated, batteries-included frameworks with built-in tools and capabilities" (the sentence continues "for building
sophisticated, long-running agents."). Harness examples it lists: "Claude Agent SDK, Manus, and other coding CLIs."

**S4, verbatim:** "Context engineering is the art and science of curating what will go into the limited context
window". "At Anthropic, we view context engineering as the natural progression of prompt engineering."

**S5, verbatim:** "The core challenge of long-running agents is that they must work in discrete sessions," and "each new
session begins with no memory of what came before." Also: "The Claude Agent SDK is a powerful, general-purpose agent
harness adept at coding,"

**How the script uses the word.** Two meanings, both from S1: the agent harness (what makes a model an agent) and the
evaluation harness (what runs and grades test cases). The nesting is our own description of this repo, not a quote:
each agent runs inside Claude Code (an agent harness per S1), a LangGraph graph (a runtime per S2) sequences and checks
them, and the eval layer is an evaluation harness. "Harness engineering" is used once, as a name people give this
work, with no attribution and no date.

## 3. The system (read from the repo 2026-11-16)

| Fact | Value | Where it comes from / how to re-pull |
|---|---|---|
| Pipeline | livestream -> intake (re-encode, vertical version, transcript) -> 3 lanes (long-form, vertical shorts, text and images) -> queues -> posting scripts | root `CLAUDE.md`, "Pipeline" |
| The graph | one LangGraph `StateGraph` for the whole batch | `video-creation/livestream-repurpose/graph/batch_graph.py`, `build_batch_graph` |
| Steps (nodes) | 14: intake, register, launch_lane3, lane2_select, lane2_cut, gate_4b, lane2_tighten_plan, lane2_tighten, gate_2nd, lane2_finish, lane2_build, lane2_publish, join_lane3, verify_batch | same function; `python video-creation/livestream-repurpose/graph/run.py batch --stub ok` prints all 14 |
| Human gates | 2: gate 4b (raw cuts) and the 2nd gate (after tightening) | `_gate` |
| Agents in this graph | 6: clip-strategist, tighten-strategist, lane3-drafter (model fable, effort max); remotion-builder (opus, xhigh), publish-meta-author (opus, medium), visual-qa (opus, high) | the `spawn_agent` calls in `batch_graph.py`; frontmatter in `.claude/agents/` |
| Agents in the repo | 31: 10 on fable, 17 on opus, 4 on sonnet | `find .claude/agents -name "*.md"`, `grep -l "^model: <m>"` |
| Clip cap | best 5 topics, no more than 8 clips | the instruction text in `clip_prompt_text` |
| Clip lengths on record | 16.4 s shortest, 46.5 s median, 160 s longest; 71 of 98 are under 60 seconds | the record (section 4) |
| Clips proposed per livestream | 3 to 8, median 4; 5 livestreams hit the cap of 8 | the record |
| Agent spawn | headless, output streamed to a log; the caller checks the file on disk, never the chat text | `spawn_agent` docstring |
| Overload retry | waits 60 seconds, respawns once | `API_OVERLOAD_WAIT_S = 60` |
| Quota fallback | respawns once on the next model down; a script proves every spawner does it | `FABLE_FALLBACK_MODEL`, `scripts/check-fable-fallback.py` |
| Plan validator | every clip has an id, a slug, a title, a known topic and segments; each segment ends after it starts and inside the recording; ids are unique | `validate_plan` in `video-creation/livestream-repurpose/scripts/cut_topics.py` |
| Routing | a failed step ends the run | `_after` |
| State | a `TypedDict`; checkpointed to SQLite, one thread per batch (`batch-<name>`) | `BatchState`, `run.py` (`SqliteSaver`) |
| The gate | a LangGraph `interrupt`; the run exits with code 2 and prints the resume command | `_gate`, `GATE_EXIT_CODE = 2` |
| Re-runs | every step reads the disk first and skips what is done | `batch_graph.py` header, "redo-safe" |
| File placement rule | a hook at the end of every agent turn, and a pre-commit hook | `.claude/settings.json`, `.githooks/pre-commit`, `scripts/check-file-placement.py` |
| Done | the last step refuses "done" while a lane is pending | `verify_batch` |

## 4. The eval record (snapshot 2026-11-16 11:00; re-pull before the render)

Re-pull everything in this section with:
`python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py score` and
`python video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py dashboard-data`.

| Fact | Value |
|---|---|
| Lines in `clip-verdicts.jsonl` | 184 (182 verdict lines, 2 miss lines) |
| Livestreams on record | 21, from 2026-09-14 to 2026-11-16 |
| Livestreams scored | 19 (2 older ones are left out: their logs cannot tie a kill to a proposal) |
| Clips judged | 98 |
| Kept at the first gate | 81 |
| Killed at the first gate | 17 |
| Killed at the second gate | 0 in the scored set |
| Selection precision | 82.7 percent (81 of 98) |
| By model, all prompt versions | top model: 17 livestreams, 82 clips, 69 kept = 84.1 percent. Fallback model: 2 livestreams, 16 clips, 12 kept = 75.0 percent |
| First livestream recorded live (batch `peach`) | 7 proposed, 7 kept at both gates, 1 miss named: recall 87.5 percent (7 of 8) |
| Its timestamps | plan validated 2026-11-15 21:20:37, first gate approved 2026-11-16 06:23:03 (9 hours later), second gate 07:33:58 |
| The miss | one topic, stored with 4 stretches of the stream |
| Full clips | 77 judged, 9 killed: kept 88.3 percent |
| Impact clips | 21 judged, 8 killed: kept 61.9 percent |
| Kills that are one half of a full-and-impact pair whose other half was kept | 11 of 17 (8 impact clips, 3 full clips) |
| Backfill | 168 lines from 20 older livestreams, joined from the strategist logs and the checkpoint database |
| Prompt version today | `57ecbf267a8c` (12 characters), a hash of 4 parts |
| Livestreams that can be replayed | 5 (transcript saved) |
| Replays run | 8: the same prompt twice on 4 livestreams |
| Replay totals | 49 picks: 35 match a kept clip, 4 re-pick a killed clip, 10 have no verdict; precision on judged picks 89.7 percent |
| Replay time | 7.9 to 13.3 minutes each |
| Picks that carry 10 seconds or more of a killed clip | 10 of 49 |
| Match rule | at least 50 percent of the shorter clip's seconds in common; ties go to the best intersection over union |
| A miss given as one timestamp | found when a pick lands within 30 seconds of it |

**The noise table (same prompt, same model, two runs each):**

| Livestream | Picks, run 1 / run 2 | Same picks between runs | Precision, run 1 / run 2 | Spread |
|---|---|---|---|---|
| 30x-tao | 8 / 8 | 100 percent | 83.3 / 83.3 | 0 |
| best-time | 3 / 3 | 100 percent | 100 / 100 | 0 |
| kaspa-cocktails | 7 / 7 | 85.7 percent | 100 / 83.3 | 16.7 points |
| stock-market | 6 / 7 | 92.3 percent | 100 / 83.3 | 16.7 points |

In both livestreams that moved, the second run added one short impact cut that matched a clip Mike had killed.

## 5. The code (what was added, what was changed)

Line counts and diffs are against the commit before the work (`c4b1fbec`); re-pull with `wc -l` and
`git diff --numstat c4b1fbec HEAD -- <file>`.

| | File | Size |
|---|---|---|
| ADDED | `video-creation/livestream-repurpose/skills/clip-evals/clip_evals.py` | 1,023 lines: the record, the replay, the score |
| ADDED | `.../skills/clip-evals/test_clip_evals.py` | 316 lines, 70 checks |
| ADDED | `.../skills/clip-evals/seed_verdicts.py` | 163 lines: the one-time backfill |
| ADDED | `video-creation/livestream-repurpose/evals/` | the record, 5 saved transcripts, 8 replays, the score history |
| ADDED | `schedule-tweets/evals.html` | 518 lines: the dashboard page |
| CHANGED | `.../graph/batch_graph.py` | 86 lines added, 20 removed |
| CHANGED | `.../graph/run.py` | 16 lines added, 3 removed |
| CHANGED | `cleanup/cleanup.js` | 20 lines added: never recycle the evals folder |
| CHANGED | `schedule-tweets/scripts/serve_dashboard.py` | 28 lines added: the page's data feed |

**Where each code card's excerpt lives** (the builder reads the file at build time; line numbers are today's):

| Card | File | Function | Lines today | What to highlight |
|---|---|---|---|---|
| G4 | `batch_graph.py` | `_after`, `build_batch_graph` | 1100-1134 | the failed-status return to END; the chain of edges |
| A1 | `batch_graph.py` | `spawn_agent` | 326-353 | the first spawn; the overload respawn; the fallback respawn |
| A2 | `batch_graph.py` | `lane2_select` | 695-721 | the spawn; `persist_agent_json`; `validate_clip_plan` |
| A3 | `cut_topics.py` | `validate_plan` | 69-104 | the per-clip checks and the segment checks |
| M2 | `batch_graph.py` | `_gate` | 521-546 | the interrupt; the approve path |
| C1 | `batch_graph.py` | `_apply_deletes` | 443-468 | the `"clip": c` addition |
| C2 | `batch_graph.py` | `_record_gate`, `_evals_gate` | 471-519 | the one new call; the try / except and the repair command |
| C3 | `clip_evals.py` | `record_gate` | 303-335 | kept; killed; already on record |
| P1 | `clip_evals.py` | `PROMPT_FILES`, `prompt_info` | 56-60, 221-229 | the 3 files; the template; the 12-character version |
| P2 | `batch_graph.py` | `_evals_selected` (called from `lane2_select`) | 492-506 | stamped right after validation |
| K2 | `run.py`, `clip_evals.py` | the `--missed` option, `parse_missed` | run.py 1594-1619, clip_evals.py 374-391 | the command; several stretches before one note |
| RP2 | `batch_graph.py`, `clip_evals.py` | `clip_prompt_text`, `REPLAY_NOTE` | 657-679, 907-914 | one text for live and replay; the added note |
| RP3 | `clip_evals.py` | `cmd_replay` | 929-983 | the spawn through the batch spawner; the plan check |
| S2 | `clip_evals.py` | `match_score`, `best_match` | 180-201 | share of the shorter clip; intersection over union |
| S4 | `clip_evals.py` | `score_replay` | 586-631 | the 4 outcomes |
| N3 | `clip_evals.py` | `pick_agreement` | 660-681 | one-to-one pairing |

**The JSON line on card `verdict-line`** (changed 2026-11-16 at the build): the real first-gate line for batch `peach`, clip 1
(kept, 48.67 seconds, prompt version `57ecbf267a8c`, model `fable/max`, source `gate`). A line recorded live carries the
prompt version, which the script's line about it needs on screen; every killed line on record is a backfilled one and
has `prompt_version: null`. The older example, kept here for reference, was batch `best-time`, clip 1 (killed):
`batch`, `clip_id`, `slug`, `gate`, `verdict`, `at`, `segments` ([[362.25, 385.85], [432.25, 448.65], [454.65, 472.0]]),
`seconds` (57.35), `prompt_version` (null on this backfilled line; a live line carries the 12-character hash),
`model`, `source`, then `title`, `variant`, `brief`, `prompt_parts` and `proposal`.

**Rounded figures the script says** (each is a rounding of a number above, listed so the lint can find it):
- "30 seconds, 60 seconds, 90 seconds" is Mike's description of the clip lengths; the record's range is 16.4 to 160 s.
- "around 1,000 lines" is `clip_evals.py` at 1,023 lines.
- "around 8 to 13 minutes" is the replay time, 7.9 to 13.3 minutes.
- "around 17 points" is the 16.7 point spread.
- "9:20 at night" and "6:23 the next morning" are 21:20:37 and 06:23:03; "9 hours" is the gap between them.
- "5 minutes or the next morning" is an illustration of the gate wait, not a measured figure.

## 6. Do not air

- **The agent launch flags.** `_spawn_agent_once` builds the command line, and one of its flags turns off permission
  prompts for the headless agents. That is an open item in `video-creation/todo/aiEngineeringSimplified.md`
  (engineering gap 1, prompt injection) with the note not to air it while it is open. No card shows that function's
  command line; card A1 shows `spawn_agent`, the wrapper above it.
- **Nothing from the work demo notes** (`video-creation/todo/demos/`), and no mention of the code review agent idea.
- **The clip titles are fine** (they are Mike's own published content), but no screen shows a brief or a path outside
  the repo.
- **No model version numbers in speech.** Cards may print what the agent files say (`fable`, `opus`); the script says
  "the top model" and "the next model down", which stays true when the models change.
- **No "I'm still learning this".** The channel's authority rule.

## 7. Accuracy pass (2026-11-16)

Scope: every checkable claim in `SCRIPT.md`. Repo claims were checked against the code and the record that day; term
claims against the sources in section 2.

| Claim in the script | Verdict | Source |
|---|---|---|
| An agent harness is "the system that enables a model to act as an agent" | confirmed, verbatim | S1 |
| An evaluation harness is "the infrastructure that runs evals end-to-end" | confirmed, verbatim | S1 |
| Evaluating an agent means evaluating the harness and the model together | confirmed | S1 |
| Claude Code is an agent harness | confirmed ("Claude Code is a flexible agent harness") | S1 |
| LangChain calls LangGraph an agent runtime; durable execution, persistence, human in the loop | confirmed | S2 |
| LangChain says the lines are blurry | confirmed, verbatim | S2 |
| Context engineering: "the art and science of curating what will go into the limited context window" | confirmed, verbatim | S4 |
| Each new agent session "begins with no memory of what came before" | confirmed, verbatim | S5 |
| Three grader types: code-based, model-based, human | confirmed, verbatim | S1 |
| A metric for "all k trials succeed"; 75 percent per run is around 42 percent over 3 runs | confirmed ("(0.75)³ ≈ 42%") | S1 |
| "People call this harness engineering" | soft claim, kept soft: a post with that title exists (S6), its text was not read, so nothing is attributed or dated | S6 |
| Every repo number and code behavior | confirmed against the repo, sections 3 to 5 | repo |
| The record is not agent memory: the strategist is never given it | confirmed: the live instruction text does not name it, and the replay note forbids the folder | `clip_prompt_text`, `REPLAY_NOTE` |

Not checked: nothing in the script depends on a claim outside these.

## 8. Open items

- S6 was not readable from here. The script does not need it. If Mike wants to name OpenAI's post on camera, the title
  and date should be read off the page first.
- The first evals video's public title and link are not in the repo. The script says "my last video on evals".
- A real prompt change has not been measured yet (Mike, 2026-11-16: not needed before this video). The script says so
  as the next step, not as a result.

## 9. Terminology check (2026-11-16, Mike: "no terminology here that's unusual to another person who knows about this stuff")

Every term of art in the spoken lines, sorted by where it comes from. Rule applied: a standard term is used where one
exists; a word that is only ours is said as ours and explained in the same line, never passed off as an industry term.

**Standard terms (an interviewer knows them):**

| Term in the script | Where it is standard |
|---|---|
| agent harness, evaluation harness, graders (code-based, model-based, human), trials | Anthropic, S1 (definitions quoted in section 2) |
| context engineering | Anthropic, S3 |
| framework, runtime, harness; durable execution, persistence, human in the loop | LangChain, S2 |
| node, edge, conditional edge, routing function, interrupt, checkpoint, thread | LangGraph's own API names. In the repo: `add_conditional_edges` (13 of them, `batch_graph.py`), `interrupt()` (`batch_graph.py`), `Command(resume=...)`, `SqliteSaver`, `thread_id` (`run.py`) |
| precision, recall, intersection over union, labels / labeled dataset, offline evaluation, data leakage, run-to-run variance | long-standing machine-learning vocabulary |
| headless, hook, validator, artifact, fallback, retry, append-only, JSON lines, backfill, hash | general software vocabulary |

**Real, but new or informal (say what it means when you use it):**

| Term | Status |
|---|---|
| harness engineering | In use since early 2026 and not settled; glossaries still say to define it on first use. The script says "You'll hear people call all of this harness engineering" and defines it in the next sentence. S6 (OpenAI's post) was not readable, so no source is named on camera. |
| noise, noise floor | Practitioner shorthand for how much a score moves when nothing changed. The formal term, run-to-run variance, is said once in CH14. |
| pass^k | The name of the "all k trials succeed" metric (S1 describes it; other sources credit the tau-bench paper for it, not checked against the paper). It is written on the noise-floor card. It is not said aloud: how people pronounce it was not confirmed. |
| human in the loop gate | "Human in the loop" is the standard term and "gate" is the common word for an approval step (approval gate, quality gate). In code it is a LangGraph interrupt, which CH6 says. |

**Our own words (names for things in this system, or plain English; not industry terms):**

| Word | What it is | How the script handles it |
|---|---|---|
| lane | one of the pipeline's 3 parallel branches | "the work fans out into 3 lanes", each one described |
| clip strategist | the name of one agent | introduced as "the agent that reads the transcript and proposes the clips" |
| impact cut, full clip, tightened | names from the clips product | each explained where it first appears |
| batch | one livestream's run through the graph | plain usage |
| verdict, keep, kill | the human decision on a clip | CH7 ties it to the standard word: "Those are human labels" |
| replay | re-running a saved transcript through today's prompt | CH12 ties it to the standard term: "That's an offline evaluation" |
| answer key | the saved verdicts, seen from the agent's side | CH12 ties it to the standard term: "that's data leakage" |
| the record, eval layer, hit, bucket, stamped | plain English | nothing to define |

Words changed in this pass: "router" became "conditional edge" + "routing function"; "respawns" became "retries";
"human gate" became "human in the loop gate" at its first mention; "Anthropic has a metric" became "Anthropic describes
a metric". Nothing in the script is a coined word presented as a standard one.
