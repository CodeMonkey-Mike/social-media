# langgraph-updates: research record (2026-11-19)

The video: an AI Engineering Simplified recording on the update to the livestream graph. The step that builds each short
went from one agent to four steps and three agents. Mike talks over five slides, one article and five code files.

## 1. Where each number comes from

Every number on the slides is computed by `slides/build_slides.py` at build time and saved to `facts.json` here.

| Number | Value | How it is computed |
|---|---|---|
| Agents in the graph, now | 7 | distinct names in the `spawn_agent(state, node, "<name>"` calls of `batch_graph.py` |
| Agents in the graph, before | 6 | the same count on commit `3e7033a1`, the last one before the change |
| Agent calls in the code | 9 now, 6 before | the number of those calls |
| Model and effort per agent | see `facts.json` | the `model:` and `effort:` lines of each agent definition |
| Agent runs on the live batch | 44 | the `===== <agent> @ <time> =====` headers the graph writes into `graph/data/agent-*-ripping*.log` |
| Runs per agent | 14 / 13 / 12 / 2 / 1 / 1 / 1 | the same headers, by agent |
| Images planned | 41 | the items of the 7 `broll-images.json` lists |
| Image-check outcome | 2 first time, 2 after a retry, 3 still rejected | each short's `broll-visual-qa.md`: its round number and its last `VERDICT:` line |
| Runs the one-agent build would have taken | 13 | every other agent as it ran (1 + 2 + 1 + 1), one builder per short (7), visual-qa once. Computed, never measured |
| Build step duration | 21:56 to 02:34, 4 h 38 min | first builder header to the last builder exit, in the run-queue log of the batch |
| Browser time | 234 min | the 12 `agent image-gen exit 0 after N min` lines of that log, added up |
| Retry durations on clips 1, 6, 7 | 13.6, 29.6, 15.4 min | the second image-gen run of each, same log |

Not in the 44: one builder started by hand after the run to repair clip 7's ending.

What the last video said, from its transcript (`clip-evals`, `spine/FINAL-TIME-words.json`): "Six agents work inside this
graph. Three of them make judgements calls and hand back a plan. And three of them build or check things."

## 2. The outside source

Anthropic, "Building effective agents", https://www.anthropic.com/engineering/building-effective-agents, published
Dec 19, 2024, read 2026-11-19. Loads in full for a logged-out reader. The page says at its top that much of the tooling it
describes has changed since December 2024.

- "Workflows are systems where LLMs and tools are orchestrated through predefined code paths."
- Its five workflows, as headed: Prompt chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer.
- Evaluator-optimizer: "one LLM call generates a response while another provides evaluation and feedback", in a loop.
- Prompt chaining: programmatic checks, which it calls a gate, can sit on the steps in between.

The article describes single LLM calls. Ours are whole agents, so the "Say:" lines say "the same pattern".

## 3. Terminology check

Every term of art in the "Say:" lines and on the slides, sorted by where it comes from
(`video-creation/skills/accuracy-pass/accuracy-pass.md`, "Terminology check").

**Standard terms (an interviewer knows them):**

| Term | Where it is standard |
|---|---|
| workflow, prompt chaining, gate, evaluator-optimizer | Anthropic, section 2 above |
| agent, graph, node | LangGraph's own API names, as in the last video |
| lock, finally block, retry, validate, JSON, bottleneck | general software vocabulary. The formal name of this kind of lock is a mutex, which the document gives in a "Careful:" line |
| handoff | common multi-agent vocabulary for what one agent passes to the next |
| model, effort, Write tool, prompt | the agent definition's own field names and Claude Code's tool name |

**Real, but informal (the line says what it means):**

| Term | How it is handled |
|---|---|
| checker | informal for the evaluating agent. Topic 4 ties it to the standard name once: "One model generates and another one evaluates... They call that evaluator-optimizer" |
| agent run | one start of an agent by the graph. The slide's headline defines it by counting them, and a "Careful:" line separates 44 runs from 7 agents |

**Our own words (names in this system, or plain English):**

| Word | What it is | How it is said |
|---|---|---|
| remotion-builder, image-gen, visual-qa and the other agent names | names of agents | each with its job beside it on the roster slide |
| the builder | short for remotion-builder | used after the name has been on screen |
| image check | step 3 of the build | plain English, shown as a step on the first slide |
| short, clip, batch | words of the clips product | as in the last video |
| build gate | our pass or fail script on a finished short | only in a fact line, never in a "Say:" line |

**Our words kept out of the spoken lines:** "stage lock" is said as "a lock", "worklist" as "a JSON list", "remap" as "built
those without the rejected images", "re-drive" as "run it again", "fix round" as "retry".
