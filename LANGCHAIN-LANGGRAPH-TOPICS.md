# LangChain / LangGraph Discussion Topics for the social-media Project

_A study companion for voice conversations with Claude. Upload this doc to the Claude app,
then work through the topics in any order. Each topic gives Claude the project context it
needs, the concepts to teach, and questions to ask out loud._

---

## Project snapshot (read this first, Claude)

This is a Windows-based social media automation repo run by one person (Mike) with Claude
Code as the operator. It is NOT currently built on LangChain. The core pipeline:

- A livestream is re-encoded to a "LOW BPS" master, then fans out into 3 lanes:
  1. **Long-form lane**: desilence the master, queue to `schedule-tweets/data/longs.json`
  2. **Shorts lane**: verticalize, transcribe, clip, caption, render (Remotion), queue to `shorts.json`
  3. **Repurpose lane**: the transcript becomes tweets, threads, IG/YT posts plus AI-generated images, queued to various `data/*.json` files
- A publishing layer (`schedule-tweets/`) posts queued content to 7+ platforms (X, Instagram,
  Facebook, TikTok, Rumble, BitChute, YouTube) via Playwright browser automation scripts and
  one API integration (YouTube Shorts, API only, no browser fallback allowed).
- `batches.json` is a registry tracking where each livestream sits in the pipeline.
- `persona/persona.json` is the single source of truth for voice/terminology, enforced by a
  lint script (`scripts/persona-lint.py`).
- An `x-reply-guy/` loop finds reply opportunities on X and posts approved replies.
- A root `CLAUDE.md` routing table plus `playbooks/` folder acts as a human-driven
  "Phase 1 orchestrator": Mike says which skill runs next, Claude looks up the command.
- **Phase 2 (deferred, documented in ORCHESTRATOR-PLAN.md)**: automate the pipeline as a
  spawnable DAG, where an orchestrator watches `batches.json` state and fans out downstream
  skills as parallel workers. Key modeling rule already decided: peers never spawn peers,
  only the orchestrator above the skills owns the graph, which keeps it acyclic.

Hard operational constraints that any orchestration framework must respect:

- **Sequential posting only.** Never two posting scripts in parallel (shared Chrome profiles collide).
- **One attempt per posting script.** If it looks stuck, read the log, never relaunch (relaunching kills the in-flight post).
- **Never auto-retry a "failed" reply-guy entry** (it usually already posted; retry = duplicate).
- **Human approval gates**: cut-plans approved before rendering, clip review dashboards, draft review before posting.
- Long-running steps: renders take ~40 minutes, uploads take minutes each, image generation is browser-driven.

The question behind every topic below: **could LangChain and/or LangGraph implement Phase 2,
and what would that actually look like?**

---

## Topic 1: LangChain vs LangGraph, what each one actually is

**Learn:** The ecosystem is confusing because the names overlap. LangChain is the component
library: model wrappers (like `langchain-anthropic` for Claude), prompt templates, output
parsers, tool definitions, retrievers, and LCEL (LangChain Expression Language) for piping
components together. LangGraph is a separate, lower-level library from the same company for
building stateful, multi-step, multi-actor applications as explicit graphs: nodes (functions
or agents), edges (control flow), and a shared typed state object that flows through them.

**Ask Claude:**
- What problems was LangGraph created to solve that plain LangChain chains couldn't?
- Do I need LangChain at all if I use LangGraph, or can LangGraph nodes be plain Python?
- What is LCEL and is it still recommended, or has the ecosystem moved to LangGraph for anything multi-step?
- What does the "state" in a StateGraph look like in code? Walk me through a minimal example verbally.
- What are prebuilt agents like `create_react_agent`, and when would I use those instead of hand-building a graph?

---

## Topic 2: Mapping my livestream pipeline onto a LangGraph StateGraph

**Learn:** My pipeline is already a documented DAG: transcribe fans out into repurpose and
video-creation, which both feed the publishing queues. LangGraph models exactly this: nodes
for each stage, conditional edges for routing, and parallel branches (fan-out/fan-in) via
the `Send` API or plain parallel edges.

**Ask Claude:**
- Sketch (verbally) how the 3-lane pipeline becomes a StateGraph: what are the nodes, what is in the state object, where do the edges branch and rejoin?
- How does fan-out work in LangGraph when one artifact (the transcript) feeds multiple independent downstream branches? What is the `Send` API?
- My `batches.json` already tracks per-livestream pipeline state. Should that file become the graph's state, or stay an external registry the graph reads and writes? Trade-offs?
- How do fan-in joins work: if shorts rendering and tweet drafting run in parallel, how does the graph wait for both before a "publish" phase?
- My rule is "peers don't spawn peers, the orchestrator owns the graph." Is that the same idea as LangGraph's supervisor pattern? How does LangGraph prevent accidental cycles, or does it allow cycles on purpose?

---

## Topic 3: Agent architectures, supervisor vs swarm vs pipeline

**Learn:** LangGraph supports several multi-agent shapes: a single agent with many tools; a
supervisor (orchestrator) that routes work to specialist workers; hierarchical teams
(supervisors of supervisors); and swarm/handoff patterns where agents pass control between
each other. My Phase 2 plan is explicitly a supervisor shape.

**Ask Claude:**
- Compare supervisor, hierarchical, and swarm architectures. For a content pipeline with strict ordering constraints, why is supervisor the right call?
- When is a "worker" better as a dumb deterministic node (just run the render script) vs an actual LLM agent that reasons? Most of my pipeline steps are deterministic scripts; where does an LLM agent genuinely add value?
- What is the difference between an agent choosing the next step (dynamic routing) and me hard-coding the edges? My pipeline order is fixed; do I even want agentic routing?
- How would a supervisor decide "this batch is at stage X, so dispatch step Y" from `batches.json`? Is that a conditional edge, a router node, or an LLM call?
- What are handoffs in LangGraph and why might I want to avoid them given my no-peer-spawning rule?

---

## Topic 4: State, checkpointing, and resumability

**Learn:** LangGraph's killer feature for long pipelines is persistence: a checkpointer
saves graph state after every node, so a crashed or interrupted run resumes where it left
off instead of restarting. My renders take ~40 minutes, uploads fail midway, and one of my
hard rules exists precisely because retrying blindly causes double-posts.

**Ask Claude:**
- Explain checkpointers: what gets saved, where (SQLite? Postgres? memory?), and what "threads" are in LangGraph.
- If a posting node fails after the post actually went through (my reply-guy problem: "failed" usually means posted), how do I model that? Can a node record "attempted" state before acting so a resume never re-runs it?
- What is the idempotency story: how do people design nodes so a resume is safe? Talk me through the "exactly once" vs "at least once" problem for side-effectful steps like posting.
- Time travel and forking state: what are they and would I ever use them, for example to re-run just the shorts lane of an old batch?
- How does durable execution differ between LangGraph open source and the LangGraph Platform / LangSmith deployment options? What can I do purely locally on my Windows machine?

---

## Topic 5: Encoding my hard rules as graph structure

**Learn:** My most important constraints are operational, not intelligence problems:
sequential posting only, one attempt per script, never auto-retry reply-guy. A framework is
only useful if these rules become structurally impossible to violate rather than relying on
a prompt saying "please don't."

**Ask Claude:**
- How do I force strictly sequential execution across posting nodes even when the rest of the graph runs parallel branches? Is that a single lane in the graph, a semaphore/lock in shared state, or a queue node?
- Retry policies in LangGraph: how do I set retries to zero for posting nodes but allow retries for flaky-but-safe steps like a download?
- Can a node's failure route to a "report at end of run" collector instead of raising, matching my "a failed step is reported, never worked around" rule for YouTube Shorts?
- Where should validation gates like my persona-lint script live: as a node between drafting and queueing, as a conditional edge that loops back to redraft, or both?
- Compare enforcing rules in graph structure vs in prompts vs in the tool implementations themselves. My experience is that gate rules must live in code (mechanical pre-render gates), not memory. Does LangGraph agree with that philosophy?

---

## Topic 6: Human-in-the-loop, my approval gates

**Learn:** LangGraph has first-class interrupts: a graph can pause at a node, persist its
state indefinitely, wait for a human decision, then resume. I have several mandatory human
gates: cut-plan approval before rendering, clip review in a dashboard, draft review, and
"stop and get Mike's OK" rules (like anything above 480p generation).

**Ask Claude:**
- Explain `interrupt()` and the resume flow. Where does the graph "live" while it waits days for my approval?
- How would a cut-plan approval work concretely: the graph pauses, I read the plan, I say yes or request changes, the graph either proceeds or loops back to re-plan?
- Can interrupts carry structured choices (approve / edit / reject with notes) rather than free text?
- How do people build the review UI? My clip dashboard is a local HTML file; could it post approvals back into a paused graph?
- Breakpoints vs interrupts vs the `Command` primitive: what is each for?

---

## Topic 7: Tools, wrapping my existing scripts

**Learn:** Almost all my capability lives in existing scripts: `post-fb-short.js`,
`publish-shorts.py`, `desilence.py`, Remotion render commands, Playwright automations.
In LangChain terms these become tools (or plain nodes). The design question is what layer
the LLM sits at, if anywhere.

**Ask Claude:**
- What makes a good tool definition: naming, descriptions, argument schemas? How do descriptions change when the caller is a model vs deterministic code?
- Subprocess tools: patterns for wrapping a long-running CLI (a 40-minute render) as a tool or node, with streaming logs, timeouts, and structured success/failure output.
- Structured outputs: when my drafting agent produces tweets/threads/captions, how do I force valid JSON matching my queue schemas (Pydantic models, `with_structured_output`)?
- Tool errors: my scripts sometimes "fail" ambiguously (the GIF reply always returns uncertain, Rumble URLs get captured wrong). How should a tool report uncertainty so downstream logic doesn't misfire?
- When should something be a tool the agent chooses vs a node the graph always runs? Give heuristics.

---

## Topic 8: The content-generation lane as an LLM chain

**Learn:** The repurpose lane (transcript in, tweets/threads/IG/YT drafts out, all in Mike's
persona) is the most LLM-native part of the pipeline and the most natural LangChain fit:
prompt templates fed by `persona.json`, structured output into queue schemas, a lint/review
loop.

**Ask Claude:**
- Design a drafting subgraph: transcript chunking, per-format drafting nodes (tweet, thread, IG caption, YT post), persona injection from a JSON style guide, structured output, lint gate, human review interrupt.
- Prompt templates vs baking persona into a system prompt: how do I keep ONE source of truth (persona.json) so the graph never drifts from what my other tooling reads?
- Evaluation: how would I use LangSmith (or simple evals) to test that drafts follow persona rules (no em dashes, "TAO" never "tau", no self-deprecating trade calls) before anything reaches a queue?
- A "critic" or reflection node that reviews drafts against the persona before the human sees them: worth it, or does it just double cost? When does reflection measurably help?
- Map-reduce over a long transcript: fan out chunk-level idea extraction, then reduce into a shortlist of clip topics. How does that look in LangGraph?

---

## Topic 9: Claude specifics inside LangChain

**Learn:** The project runs on Claude, so the integration layer matters:
`langchain-anthropic` wraps the Anthropic API (`ChatAnthropic`). Current model landscape:
Claude Opus 4.8 (`claude-opus-4-8`) is the default strong model, Sonnet 5 the
cost-efficient tier, Haiku 4.5 the cheap/fast tier. Newer Claude models use adaptive
thinking (no more `budget_tokens`) and an `effort` parameter.

**Ask Claude:**
- What does `ChatAnthropic` support vs the raw Anthropic SDK: tool calling, streaming, structured output, prompt caching? What gets lost in the abstraction?
- Prompt caching with Claude in a graph: my persona + instructions are a big stable prefix reused across every drafting call. How do I structure calls so caching actually hits (stable prefix first, volatile content last)?
- Model routing per node: Opus-tier for clip selection and scripting judgment, Haiku for mechanical extraction or classification. How do I wire different models to different nodes and what are the cost implications?
- How do Claude's adaptive thinking and effort settings surface through LangChain, and when do they matter for my kind of work?
- Rate limits and long jobs: patterns for a graph that makes dozens of Claude calls per batch without tripping limits.

---

## Topic 10: LangGraph vs what I already have (Claude Code skills)

**Learn:** This is the honest comparison topic. Phase 1 already works: a routing table +
playbooks, with Claude Code as a general agent that reads a skill doc and drives the scripts.
Claude Code also has its own subagent and orchestration features. The Anthropic ecosystem
additionally offers Managed Agents (server-hosted agent sessions) and the Claude Agent SDK.
LangGraph is a fourth option, code-first Python.

**Ask Claude:**
- Compare four approaches for my Phase 2: (a) keep Claude Code human-driven, (b) Claude Code with spawned subagents per lane, (c) a LangGraph app that calls Claude via API, (d) Anthropic Managed Agents. Strengths, costs, failure modes of each for a one-person operation.
- What does LangGraph give me that a well-prompted Claude Code session doesn't: determinism, resumability, testability? And what do I lose: the interactive repair ability when a Playwright script breaks mid-run?
- My scripts break often (platforms change their UI). In a fully automated graph, who fixes them? Is a hybrid sensible: LangGraph for the deterministic spine, escalate to interactive Claude Code when a node fails?
- The Agent Client Protocol / MCP angle: could my graph nodes call MCP servers or reuse the same tools Claude Code uses?
- Honestly: at my scale (one operator, a few batches a week), is LangGraph overkill? What signal would tell me it has become worth it?

---

## Topic 11: Observability, testing, and not flying blind

**Learn:** LangSmith is LangChain's tracing/eval platform: every node run, LLM call, token
count, and error in one trace tree. My current observability is reading log files after
something goes wrong.

**Ask Claude:**
- What does a LangSmith trace of a multi-node graph run look like, and what would it tell me when a batch stalls?
- Can I get useful tracing without the hosted platform: local alternatives, OpenTelemetry, or just structured logging?
- Testing graphs: how do I unit-test a node, fake an LLM, and integration-test a whole lane without actually posting to X?
- Cost tracking per batch: tokens per node, per model. How do people attribute spend?
- Alerting for a one-person shop: the graph ran overnight, what is the morning report pattern (what succeeded, what failed, what awaits my approval)?

---

## Topic 12: Scheduling, triggers, and the reply-guy loop

**Learn:** Two orchestration shapes exist in the repo: the batch pipeline (event-driven:
a new livestream arrives) and the reply-guy loop (recurring: scan X, score opportunities,
draft replies, human approves, post). LangGraph graphs need something to invoke them.

**Ask Claude:**
- What triggers a LangGraph app in practice: cron, a file watcher on my recordings folder, a manual CLI command? What is idiomatic?
- The reply-guy loop as a graph: scan node, scoring node, draft node, human approval interrupt, sequential posting node with the never-retry rule. Walk through it.
- Long-lived vs per-run processes: should the graph be a daemon or a script I (or the scheduler) invoke per batch? Windows-specific considerations?
- Cross-run memory: the reply-guy must remember whom it already replied to. Graph state, or an external store the nodes consult?
- Backpressure: posting is rate-limited by platform tolerance (spread posts across a day). How do I model "publish these 6 shorts over 3 days" in a graph, or is that better left to my existing scheduler?

---

## Topic 13: Migration strategy, if I ever did this

**Learn:** Big-bang rewrites of working automation are how working automation dies. The
sensible path is strangler-fig: pick one lane, wrap it, prove value, expand.

**Ask Claude:**
- Which lane is the best pilot: the repurpose (drafting) lane, since it is most LLM-native, lowest risk (human still reviews before queueing), and touches no posting scripts?
- Design the pilot: inputs (a transcript path), outputs (queue-ready JSON entries), gates (persona lint + my approval), and how it coexists with the current manual flow.
- What must NOT be migrated first: posting scripts (highest blast radius), and why.
- How do I keep `batches.json` as the shared source of truth so the graph-run lane and the manual lanes never disagree about a batch's state?
- Exit criteria: how do I evaluate after 3 or 4 batches whether the graph version earned expansion or should be deleted?

---

## Topic 14: Deeper concepts worth learning regardless

**Ask Claude to teach, one at a time:**
- The ReAct pattern: what it is, why it became the default agent loop, and its failure modes.
- Reducers in LangGraph state: why parallel branches need them and what `add_messages` does.
- Subgraphs: composing a graph of graphs (each of my lanes as a subgraph under one supervisor).
- Streaming modes: token streaming vs node-update streaming vs custom events, and which matter for a pipeline vs a chatbot.
- Memory in agent systems: short-term (thread state) vs long-term (stores), and how that maps to my batches.json + persona.json + engagement data.
- Context engineering: why stuffing everything into the prompt fails, and patterns (retrieval, summarization, scoped context per node) that keep each node's context small.
- The general "workflows vs agents" design question (Anthropic's own framing): most of my pipeline is a workflow; where exactly is the judgment boundary that justifies an agent?

---

## Suggested road-trip order

1. Topic 1 (fundamentals) then Topic 2 (map my pipeline) to build the mental model.
2. Topics 4, 5, 6 (state, rules, human gates) since these decide feasibility for me.
3. Topic 10 (vs Claude Code) for the honest build/no-build judgment.
4. Topics 3, 7, 8, 9 for design depth.
5. Topics 11, 12, 13 for operations and a concrete pilot plan.
6. Topic 14 as filler for the boring highway stretches.
