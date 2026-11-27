# additional-nodes: RESEARCH

_The only source of facts and numbers for the video "the 4 build steps became real LangGraph nodes" (AI Engineering
Simplified, longform-presentation format 4, SCRIPTED). Written 2026-11-27. Every figure a card prints or Mike says
comes from here. Section 2 is read from the repo and from runs of the new check; section 3 is the LangGraph docs and
source, read 2026-11-27._

## 1. What the video is

- **The follow-up the last LangGraph video promised.** langgraph-updates (live, qYn6c4tOLiw) said, in its own script:
  "The 4 steps are plain Python inside that one node." and, as its teaser, "And after that, those 4 steps become real
  LangGraph nodes." This video shows that change. (Both lines are from its SCRIPT.md, as recorded in the Claude Code
  session that wrote it; its project folder was deleted after publishing.)
- **The series:** clip-evals (U26NDilqCDo), langgraph-updates (qYn6c4tOLiw), livestream-aws (joUlFD5Xe3A), this one.
- **Where the change is:** commit `356701b8` "Make the shorts build steps real LangGraph nodes", branch
  `feat/lane2-build-subgraph`, 2026-11-27. Not merged into master on that date. **Not yet run on a real livestream**
  (Mike had no new livestream to process). Proven only by the check in section 2.
- **Channel rules:** present with authority, never as a co-beginner (`video-creation/ai-engineering/ai_channel_plan.md`);
  no em dashes on screen; numbers as digits. Target: 3 minutes at most (Mike, 2026-11-27).

## 2. The change (read from the repo, 2026-11-27)

| Fact | Value | Where it comes from / how to re-pull |
|---|---|---|
| The node that changed | `lane2_build`, the step that builds each short | `video-creation/livestream-repurpose/graph/batch_graph.py` |
| Before | ONE node. Inside it, plain Python ran every short through 4 steps in thread pools (one pool for steps 1 to 3, one for step 4); the image check's retry was a Python `for` loop | `git show ae71460f:video-creation/livestream-repurpose/graph/batch_graph.py`, `_build_all`, `_clip_images` |
| The 4 steps | plan, images, image check, build | same; `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` |
| Who does each step now | plan: the builder agent (remotion-builder, stage 1). images: plain code (`gen_batch.py` in the ChatGPT browser, under a lock); on a fix round the image-gen agent only rewrites the failed prompts. image check: the visual-qa agent. build: the builder agent (stage 2) | `batch_graph.py`, `clip_plan`, `clip_images`, `clip_image_check`, `clip_build_short` |
| Since the last video | the images are made by plain code, not by an agent (commit `a5e7faf8`, 2026-11-23, after langgraph-updates was recorded that day): the agent's tool calls were cut off at 10 minutes | `git show a5e7faf8` |
| After | a subgraph, `clip_build`, with 4 nodes: `plan`, `images`, `image_check`, `build`. `lane2_build` starts one run of it per short with `Send`; a new node `lane2_build_join` waits for every run and checks every short in `progress.json` | `batch_graph.py`, `build_clip_graph`, `_send_clips`, `lane2_build_join` |
| The retry | a conditional edge after `image_check`: pass -> `build`, fail -> back to `images`, at most 2 rounds (`BROLL_QA_ROUNDS = 2`) | `batch_graph.py`, `_after_image_check` |
| In code | the subgraph is 4 `add_node` calls and 3 `add_conditional_edges` calls (plus the edge from START and the edge from `build` to END) | `batch_graph.py`, `build_clip_graph` |
| Nodes in the batch graph | 14 before, 16 after (`clip_build` and `lane2_build_join` added), plus the 4 nodes inside `clip_build` | `build_batch_graph` |
| The limits (unchanged) | up to 4 shorts in steps 1 to 3 at once (`PREP_WORKERS_DEFAULT = 4`, `--max-prep`), at most 2 builds at once (`--max-builders`, default 2, the render ceiling); a short keeps its slot while it waits for the browser | `batch_graph.py`; `remotion-shorts-build/SKILL.md`, "Two limits" |
| How the limits are kept | 2 semaphores in code (`_slots`: `threading.BoundedSemaphore`), because LangGraph's `max_concurrency` is one number for the whole run | `batch_graph.py`; section 3, claim 8 |
| Also kept in code | the cross-process `chatgpt` lock on the one browser, the turn order (a remake goes before a first round), and resume from disk (each node reads its files first and skips finished work) | `batch_graph.py` comment block "the per-short build SUBGRAPH" |
| A failure | a node never raises: a short's failure is its row in `clip_results` and the other shorts go on | same |
| The check | `scripts/check-lane2-build.py`: runs the REAL batch graph from the end of `lane2_finish` to `lane2_publish` with fake agents, a fake image generator, a fake lock and a fake heartbeat | the file's docstring |
| Checks in it | 69, all PASS | `python scripts/check-lane2-build.py` (count the PASS lines), 2026-11-27 |
| Its run time | 15 s on Mike's PC ("around 15 seconds") | the same run, timed |
| On the old code | ALL PASS (the committed one-node `batch_graph.py` loaded in place of the new one) | 2026-11-27 run, before the refactor and again after the last case was added |
| Deliberate breakages | 6, every one caught: builds cap off by one, image check never loops back, results not cleared on a re-drive, prep slot freed after the plan, prep slot freed during the images step, remakes lose their priority | 2026-11-27 run (`mutants.py`, session scratchpad) |
| The crash case | a run killed in the middle of a short's build, then resumed from its checkpoint with no new input: the finished short is not run again, the killed one resumes at its build | the check, "a crash in the middle of the build step" |
| Checkpointer in the check | the SQLite checkpointer `run.py` uses, for the scheduling and crash cases | the check |

## 3. LangGraph (the docs, docs.langchain.com, and the installed source; read 2026-11-27, langgraph 1.2.10)

| # | Claim the video makes | Verdict | Source and the docs' words |
|---|---|---|---|
| 1 | LangGraph runs a graph in super-steps; nodes that run in parallel share one super-step, and the next super-step runs after all of them | SUPPORTED | https://docs.langchain.com/oss/python/langgraph/graph-api#super-steps "Nodes that run in parallel share one super-step." Control flow page: "node "d" executes after both "b" and "c" are finished." Spelling: "super-step" |
| 2 | `Send` runs the same node once per item, each with its own input; the pattern is map-reduce | SUPPORTED | https://docs.langchain.com/oss/python/langgraph/graph-api-send-command#use-send-for-map-reduce "run the same node once per item, each with its own input"; graph-api#send: "often called map-reduce or orchestrator-worker" |
| 3 | A conditional edge calls a function on the state to pick the next node | SUPPORTED | https://docs.langchain.com/oss/python/langgraph/graph-api#conditional-edges "Call a function to determine the next node(s)"; the docs call it a "routing function" |
| 4 | A subgraph is a graph used as a node in another graph | SUPPORTED | https://docs.langchain.com/oss/python/langgraph/use-subgraphs "A subgraph is a graph that is used as a node in another graph." `output_schema` limits what a graph returns: graph-api-state#define-input-and-output-schemas |
| 5 | The subgraph uses the parent's checkpointer | SUPPORTED (default mode) | use-subgraphs, "Subgraph persistence": "Stateful subgraphs inherit the parent graph's checkpointer" |
| 6 | When a node fails, the writes of the nodes that finished in that super-step are kept, so a resume does not re-run them | SUPPORTED | https://docs.langchain.com/oss/python/langgraph/checkpointers#pending-writes "you don't re-run the successful nodes"; the docs' name: "pending writes" |
| 7 | A reducer merges a node's update into a state key; `Overwrite` replaces the value | SUPPORTED | graph-api#reducers; graph-api-state#bypass-reducers-with-overwrite |
| 8 | `max_concurrency` is one number for the run: the most calls LangGraph makes in parallel | SUPPORTED (source) | `RunnableConfig.max_concurrency`: "Maximum number of parallel calls to make." LangGraph's sync executor makes ONE thread pool of that size per run (`get_executor_for_config`), the async one ONE semaphore. The docs page graph-api-control-flow ("Set max concurrency") passes it as a top-level config key and does not say more |

## 4. Terminology check (`video-creation/skills/accuracy-pass/accuracy-pass.md`)

**Standard (say it as written):**
- LangGraph's own: node, edge, conditional edge, routing function, state, graph, subgraph, `Send`, map-reduce,
  super-step, checkpointer, checkpoint, thread, pending writes, reducer, `max_concurrency` (section 3 for each).
- Long-standing computing terms: thread, thread pool, lock, semaphore (Dijkstra; Python's `threading.Semaphore`),
  `for` loop.
- Testing: a fake (one kind of test double: a working stand-in, Meszaros, xUnit Test Patterns, 2007); a
  characterization test (a test that pins down what code does today before you change it, Michael Feathers, Working
  Effectively with Legacy Code, 2004); mutation testing (break the code on purpose, small changes at a time, and check
  the tests catch each one; the standard name for what the 6 breakages are).
- Agent patterns: evaluator-optimizer (one model makes, another checks and sends it back; Anthropic, "Building
  effective agents", 2024).

**Real but new or informal (define where first said):** none in the script. "Fan out" and "fan in" are used as verbs
in the LangGraph docs, so the script uses Send and map-reduce for the named pattern.

**Our own (each explained in the line that says it):** `lane2_build`, `clip_build`, `lane2_build_join` (node names in
this graph), "a short" (a vertical clip), "the builder" (the remotion-builder agent), "a remake" (generating a failed
image again; the script says "a redo of a failed image" instead), "the ChatGPT browser" (the one Chrome window that
makes every image).

## 5. Careful lines (do not air the wrong version)

- **It has not run on a real livestream.** Never "it ran", "it's live", "it's faster". The scheduling is the same as
  before, so the video claims no speed change at all.
- **Not "4 nodes in the main graph".** The 4 nodes are inside the subgraph; the main graph gained 2 nodes.
- **The images node is code, not an agent** (the last video said an agent made the images; that changed the evening it
  was recorded).
- **Do not say LangGraph cannot limit concurrency.** It can (`max_concurrency`); it is one number for the run, and the
  two limits here are on two different steps.
- **Do not say "LangGraph can't run two shorts at once without a subgraph".** Four nodes with Send would also run
  shorts in parallel; the problem is the super-step: they would move in lockstep.
- **69 checks is the count on 2026-11-27.** If a case is added before the recording, re-count.
