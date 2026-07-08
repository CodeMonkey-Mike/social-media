# AI Automation & Engineering YouTube Channel — Planning Handoff

A working brief for a new YouTube channel about AI automation, agent development, and AI engineering. This document summarizes the concept, intention, and topic clusters worked out in an earlier conversation, so it can be picked up and expanded in Cowork while producing videos.

**Channel:** [@aiEngineeringSimplified](https://www.youtube.com/@aiEngineeringSimplified)

---

## The core intention

**Clear, authoritative explanations of AI engineering, for engineers who want to build.**

I'm an experienced JavaScript developer going deep on AI development, and this channel turns that work into sharp, practical explanations. The content is well-researched and accurate, and I present it with authority because the information is solid. My own expanding AI work is the *engine* behind the channel: it keeps the topic pipeline fresh and the explanations current. But that's the engine, not the on-screen persona.

The audience is other engineers on the same path: people who want to actually build AI systems, not just watch hype reactions or dense academic paper walkthroughs. There's a real gap between shallow "10 AI tools" content and inaccessible research content. This channel lives in that gap: practical, architecture-literate explanations for working engineers.

**Tone and relationship with the viewer:** I'm talking *to* people, explaining things clearly to someone who wants the explanation. Conversational, clear, confident, not lecturing. The feeling of "here's how this actually works, let me show you."

> ⛔ **ON-SCREEN AUTHORITY (hard rule, Mike, 2026-07-01).** Never frame myself on camera as a co-beginner
> learning this for the first time. No "I'm learning this alongside you," no "I don't really know this
> either," no "just like you don't know." That diminishes authority and viewers drop off. The information is
> good (it's researched and correct), so present it that way. The JS-dev angle is **peer-EXPERT** (a senior
> dev explaining Python/AI to other devs), NOT "I'm new at this too." Empathy for what's genuinely confusing
> is fine ("this is the part that trips everyone up"); confessing my own confusion is not.

---

## Channel identity: explainer + tutorial

The channel leans **explainer-heavy with hands-on tutorials**, with occasional comparisons when curiosity strikes. The goal is that someone can genuinely *learn something* from each video.

### The winning format: "Explain, then build"

Each video (or pair of videos) does two things:

1. **Explain the mental model first** — clear, visual, demystifying. This is where a cinematic HTML presentation style works well. Earns the search traffic and the "oh, I finally get it" moments.
2. **Then show it working in code** — a real, follow-along build. Earns the saves, the credibility, and the practical value.

The explanation earns attention; the build earns trust.

### One key production rule (get it right before you teach it)

**Build the thing first, off-camera, get it fully working, and only then record the explanation**, once it's genuinely understood. This keeps quality high and means never walking back a mistake on camera. It's also what *earns* the authoritative tone: only teach what you've actually made work.

Knowing which parts are confusing is a teaching superpower, so preempt them ("this is the part that trips people up, here's the clean way to think about it"). That's empathy for the viewer's confusion, delivered from authority, never a confession of your own.

**Mandatory accuracy gate.** This ecosystem moves in months, so every script gets an **accuracy pass**
(`video-creation/skills/accuracy-pass/accuracy-pass.md`) BEFORE VO generation: fact-check every claim against
live sources, fix stale package names / deprecations / over-stated "default" claims. Authority is only earned
if the facts are current. Anthropic/Claude specifics defer to the `claude-api` skill.

---

## Channel backbone: a four-arc progression

The channel has a spine that a viewer can follow from zero. It also happens to mirror my own learning path, which is the whole point.

### Arc 1 — Foundations (mental models)
The "how it actually works" content that demystifies black boxes. Explained vividly and with authority, from freshly-built understanding.
- RAG explained visually
- Embeddings and vector math
- Tokens and tokenization
- Context windows and why they matter
- Chunking strategies
- Prompt engineering as an engineering discipline (not magic words)

### Arc 2 — First real build: "Chat with your own data"
A complete, end-to-end RAG app, built the honest way (my own work). Doubles as closing my own skill gap.
- Setting up a vector database (e.g. pgvector)
- Chunking the data
- Wiring up retrieval
- Adding reranking
- Evaluating whether it actually works

### Arc 3 — Agents (from "answer" to "act")
Moving from retrieve-and-answer to taking actions. Introduces frameworks naturally.
- LangChain from scratch
- LangGraph for stateful agents
- Tool use / function calling
- MCP (Model Context Protocol) — newer, less competition, thin search field
- Multi-agent systems

### Arc 4 — Production layer (the differentiator)
The stuff almost nobody teaches well. By this point I'll have built enough to have real opinions.
- Evaluating LLM outputs / building eval harnesses
- Monitoring agents in production
- Handling hallucinations
- Cost optimization and token budgeting
- Caching, latency, prompt versioning
- Observability tools (LangSmith, Langfuse)

Each arc is several videos. Standalone explainers or comparisons can be dropped in anytime without breaking the spine.

---

## Full topic clusters (the idea bank)

Each cluster can spawn many videos.

### Foundations / mental models
RAG, embeddings, vector math, tokens, tokenization, context windows, attention (conceptual), prompt engineering. These age well and pull steady search traffic.

### Python-for-JavaScript-developers (my differentiated angle)
An underserved audience I'm authentically part of. **Full backlog broken out in `python_series.md`
(same folder) — 1 featured video + 30 more topics.**
- Why AI uses Python instead of JavaScript
- Python crash course filtered through JS concepts (list comprehensions vs map/filter, virtual environments vs node_modules, pip vs npm)
- Reading AI code as a JS dev
- When to reach for Python vs stay in JS

### Agent frameworks, hands-on
LangChain, LangGraph, LlamaIndex, CrewAI, Claude Agent SDK, Vercel AI SDK (for the JS crowd). Comparisons outperform plain tutorials: "I built the same agent in 4 frameworks, here's what I learned" beats "LangChain tutorial part 1."

### RAG, deep (almost a channel on its own)
Chunking strategies compared, vector DB showdown (pgvector vs Pinecone vs Qdrant vs Chroma), reranking, hybrid search, RAG evaluation, debugging RAG failures, building RAG over your own data (YouTube transcripts is a great recurring personal example).

### Building real things end-to-end (project series)
Each video ships something complete: customer support agent, chat-with-your-docs app, research assistant, code review bot, meeting-notes-to-action-items pipeline. Engineers love watching a full build they can replicate.

### Production / ops (genuinely underserved — the moat)
LLM output evaluation, eval harnesses, production monitoring, hallucination handling, cost/token budgeting, caching, latency, prompt versioning, observability. Less competition, more serious audience.

### Model selection & the API layer
Claude vs GPT vs Gemini vs open models per task, small vs large model tradeoffs, multi-model routing (e.g. Haiku for classification → Sonnet for responses), structured outputs, function calling, streaming, batch processing.

### Automation workflows (no/low-code → code)
n8n, Make, Zapier with AI — and crucially *when to graduate* from those to real code. Good top-of-funnel content that bridges clickers into coders.

### Local & self-hosted AI
Ollama, local vs API tradeoffs, privacy-driven deployments, quantization explained, hardware requirements. Appeals to tinkerers and privacy-conscious engineers.

### MCP & tool integration
What MCP is, building an MCP server, connecting agents to real tools, the security model. New enough that good content is scarce and search competition is thin.

### Career & meta
Breaking into AI engineering from a traditional dev background, what these jobs actually look like, building an AI portfolio, the IC-vs-management question. Drives high engagement and comments.

---

## Strategic notes

- **Highest-leverage early content:** Foundations + Python-for-JS. They capture search traffic and establish me as a clear explainer.
- **The moat:** Production/ops content — few people cover it well, and it attracts a serious audience.
- **The hook:** A project-based build series running in parallel turns casual viewers into subscribers ("watch me build").
- **Never run out of ideas:** Because my own AI work keeps expanding, the pipeline of topics never dries up (the content engine, kept off-screen per the ON-SCREEN AUTHORITY rule above).

---

## Assets already made (reusable)

- A pgvector explainer as a dark cinematic HTML presentation (walks through how a single row is stored, embeddings, chunking a longer passage into multiple rows with overlap). Good basis for a "RAG explained" or "how vector databases work" video.
- A "Why AI Speaks Python, Not JavaScript" HTML presentation (9-slide dark cinematic deck: history, library ecosystem, the speed paradox, GPU/CUDA story, where JS competes, side-by-side comparison, the pragmatic path). Ready basis for the Python-for-JS flagship video.
- A reusable `yt-presentation` skill for producing these dark cinematic scroll-based HTML decks for recording.

---

## Suggested next steps in Cowork

1. Pick the first arc (likely Foundations) and turn it into a concrete video list: titles, the explain-vs-build split for each, and thumbnail/hook angles.
2. Decide a publishing cadence and batch the first 3–4 explainer decks.
3. For each foundations topic, do the off-camera build first, then script the explanation from genuine understanding.
4. Set up a simple backlog (kanban or checklist) so learning discoveries feed directly into the content pipeline.

---

## Production approach: longform-edited, but lighter

Reuses the existing `longform-edited` track (`video-creation/longform-edited/longform-edited.md`)
as the base pipeline — same compress → transcribe → defumble → desilence foundation — but skips the
heavy Phase 4 production work that track does for the main channel (system-design containers, dense
b-roll manifests, spotlight cue-sheets). These are talking-heavy explainer/tutorial videos, not
heavily-produced hype pieces, so the edit stays close to the raw cut.

**What carries over from longform-edited as-is:**
- Phase 1 — compress to a LOW BPS working master
- Phase 2 — word-level transcription
- Phase 3 — defumble (canonical `skills/defumbler/`, cut only in silence, never on word timestamps),
  then desilence to tighten pacing (canonical `skills/desilencer/`)
- The general house rules: no captions unless asked, cover every beat that needs covering, snap-to-silence
  cutting discipline

**What's dialed back vs. the main channel's longform-edited track:**
- No mandatory EDIT-PLAN / CUE-SHEET / system-design container build-out for every video — b-roll and
  cutaways (screen recordings, code, diagrams) get added where they genuinely help a point land, not as
  a structural requirement
- Lighter overall edit density — closer to "well-cut talking head with supporting visuals" than the
  heavily-produced main-channel style

**Voice:** mostly still Mike's own recorded voice, same as longform-edited — but this channel leans on a
**Higgsfield voice clone of Mike more than the main channel does**, for sections where a clean off-camera
VO is faster than a full re-record (e.g. patching a line, narrating over a screen recording/build segment).
Uses the existing `skills/higgsfield-voice/` clone-capture pipeline (chunked 2-3 sentences per generation
to avoid hallucination) the same way the Yuli/Ana persona pipeline does, just applied to Mike's own cloned
voice instead of a persona.

**Net effect:** same trustworthy production spine (defumble/desilence/QA) as the main channel, but the
per-video production cost is much lower — appropriate for a higher-cadence, learn-in-public channel where
volume and consistency matter more than every video being a heavily-art-directed set piece.
