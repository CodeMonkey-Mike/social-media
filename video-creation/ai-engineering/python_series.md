# Python for AI Engineering — Video Series Backlog

The Python topic cluster for **[@aiEngineeringSimplified](https://www.youtube.com/@aiEngineeringSimplified)**.
Parent brief: `ai_channel_plan.md` (same folder). Production approach: the lighter-edit variant of
`longform-edited` described in that plan.

**The angle.** Start from zero — for engineers (especially JavaScript devs like me) who have never
written Python but need it for AI work. The series answers a real question people quietly have: *"Everyone
in AI writes Python. What do I actually need to know, and which libraries do the work?"* We answer it
clearly and with authority, one topic at a time. (On-screen positioning is **peer-EXPERT**, never
co-beginner — see the ON-SCREEN AUTHORITY rule in `ai_channel_plan.md`.)

**Series arc (rough order):** setup and environment → language basics filtered through JS → the libraries
that matter → first real API calls → the AI-engineering-specific building blocks (structured output,
embeddings, FastAPI, async, RAG ingestion, deployment). Each video is standalone-searchable but the spine
takes a total beginner to "I can build and ship a Python AI service."

---

## ⭐ VIDEO 1 (featured) — "The Python Libraries Every AI Engineer Actually Uses (and Why)"

**The promise.** Python's biggest source of overwhelm for a newcomer is the library sprawl — there are
tens of thousands of packages and no map. This video *is* the map. We walk the AI-engineering ecosystem
by the **job you're trying to do**, name the go-to package(s) for each job, and say in one line *why that
one won*. By the end, a viewer can look at any AI tutorial's import block and know what each line is for.

**Framing that makes it click (the two-layer structure):**

1. **Part A — the map by category** (what each type of library does)
2. **Part B — the "starter kits" by role** (if you're doing RAG, here's your stack; building agents, here's
   yours; shipping a Lambda, here's yours). This is the part that answers "what would a LangChain dev vs an
   AWS-Lambda dev vs a local-model tinkerer actually `pip install`?"

> Scripting note: the descriptions below are the current, accurate lay of the land as of mid-2026. Verify
> versions/APIs against docs before demoing any of them on camera (per the "get it right before you teach it"
> rule in the plan). Present with authority (ON-SCREEN AUTHORITY rule) — never as a co-beginner.

### Part A — the ecosystem by category

**1. The LLM provider SDKs (talk to a model)**
- `openai` — OpenAI's official client; also the de-facto "shape" many other tools imitate.
- `anthropic` — Claude's official client (the one we'd reach for most; latest models are the Claude 5 family / Opus 4.8).
- `google-genai` — Gemini's client.
- `litellm` — one unified interface over ~all providers; swap models without rewriting call sites.

**2. Orchestration / agent frameworks (chain calls, give models tools, manage state)**
- `langchain` (+ `langchain-core`, `langchain-community`) — the big general-purpose toolkit for chaining
  LLM calls, retrieval, and tools. Ubiquitous, sometimes accused of over-abstraction.
- `langgraph` — from the LangChain team; builds **stateful, cyclic agent graphs** (loops, branches, memory).
  The current serious choice for real agents.
- `llama-index` — RAG-first framework: strongest at ingest → index → retrieve over your own data.
- `crewai` — opinionated **multi-agent** ("crew of role-playing agents") framework.
- `pydantic-ai` — newer, type-safe agent framework from the Pydantic team; clean if you already live in Pydantic.
- `dspy` — "program, don't prompt": you declare the behavior and it optimizes the prompts for you.

**3. Structured output / validation (make the model return clean, typed data)**
- `pydantic` — the foundational data-validation library. You will import this in nearly every AI project.
  It's the Zod of Python. Learn it early.
- `instructor` — wraps an LLM client so responses come back as validated Pydantic objects.

**4. The data & math foundation (what ML/embeddings are built on)**
- `numpy` — n-dimensional arrays and vector math; embeddings *are* NumPy arrays. Cosine similarity is three lines of it.
- `pandas` — dataframes; loading/cleaning/inspecting tabular data.
- `scikit-learn` — classic ML (clustering, similarity, train/test split, metrics) — still useful around LLM work.

**5. Models, tokenizers, embeddings (Hugging Face world)**
- `transformers` — Hugging Face's model hub client + pipelines; run open models locally.
- `sentence-transformers` — generate embeddings from text with a one-liner (great for local/free RAG).
- `tiktoken` — count tokens the way OpenAI counts them (budgeting, chunk sizing, cost estimates).

**6. Vector databases / stores (store + search embeddings)**
- `chromadb` — dead-simple local vector DB; perfect for learning and prototypes.
- `pgvector` (via `psycopg`) — vector search inside plain Postgres; the "just use your existing database" answer.
- `qdrant-client`, `pinecone`, `weaviate-client` — production vector DBs (self-host vs managed).
- `faiss-cpu` — Facebook's in-memory similarity search; fast, no server, great for medium datasets.

**7. Document ingestion (turn PDFs/HTML/docs into chunks for RAG)**
- `pypdf` / `pymupdf` — extract text from PDFs.
- `unstructured` — one library that parses many messy formats (PDF, HTML, docx, email) into clean chunks.
- `beautifulsoup4` — parse/scrape HTML.
- `docling` — high-quality document → structured-text conversion.

**8. Web / API / serving (expose your AI as a service or app)**
- `fastapi` — *the* modern Python API framework; async-native, Pydantic-typed, auto OpenAPI docs. Default for AI backends.
- `uvicorn` — the ASGI server that actually runs FastAPI.
- `streamlit` / `gradio` / `chainlit` — build a usable UI (dashboard / ML demo / chat) in minutes, no frontend code.
- `httpx` — async-capable HTTP client (the `requests` you'd use in async AI code); `requests` for simple sync scripts.

**9. Async & resilience (talk to slow, flaky model APIs at scale)**
- `asyncio` (stdlib) + `anyio` — run many LLM calls concurrently instead of one-at-a-time.
- `tenacity` — declarative retries/backoff for rate limits and transient 5xx.

**10. Cloud / serverless / infra (ship it)**
- `boto3` — the AWS SDK: S3, Lambda, DynamoDB, Bedrock. Bread-and-butter for AWS deployments.
- `aws-lambda-powertools` — logging/tracing/parsing helpers purpose-built for Lambda handlers.
- `python-dotenv` / `pydantic-settings` — load config and secrets from env cleanly.

**11. Local & self-hosted models (run models on your own machine)**
- `ollama` — Python client for the Ollama runtime; easiest path to a local model.
- `llama-cpp-python` — run quantized GGUF models directly.
- `vllm` — high-throughput serving when you're hosting a model for real traffic.

**12. Observability & evaluation (know if it actually works)**
- `langsmith` / `langfuse` — trace every LLM call, prompt, and token in a chain/agent.
- `ragas` / `deepeval` — score RAG/LLM output quality with real metrics instead of vibes.

**13. Developer tooling (the workflow itself)**
- `uv` — the fast, modern package/venv manager (from Astral); increasingly the default over pip/poetry.
- `ruff` — lightning-fast linter + formatter (one tool replaces several).
- `pytest` — the standard test runner.
- `typer` + `rich` — build a polished CLI with pretty terminal output.
- `tqdm` — progress bars for long loops (ingesting thousands of docs).
- `jupyter` — notebooks for exploration before you write real scripts.

### Part B — "starter kits" by role (the shareable payoff)

*Say each as: "If you're doing X, here's the minimum you'd install."*

- **Just calling an LLM:** `anthropic` (or `openai`) + `python-dotenv` + `pydantic`.
- **Structured output from an LLM:** the SDK + `pydantic` + `instructor`.
- **RAG over your own docs (learning):** `chromadb` + `sentence-transformers` + `pypdf` + an LLM SDK.
- **RAG in production:** `pgvector`/`qdrant-client` + `unstructured` + `langchain`/`llama-index` + `fastapi`.
- **Building an agent:** `langgraph` (or `pydantic-ai`/`crewai`) + an SDK + `tenacity` + `langsmith`.
- **Shipping an AI API:** `fastapi` + `uvicorn` + `pydantic` + `httpx` + `tenacity`.
- **Deploying to AWS Lambda:** `boto3` + `aws-lambda-powertools` + an SDK, packaged as a zip/layer (mind the size limits).
- **A quick demo/UI:** `streamlit` or `gradio` + an SDK.
- **Running models locally:** `ollama` (easy) or `llama-cpp-python`/`vllm` (deeper).

**Closing beat.** You don't learn all of these. You learn `pydantic`, one LLM SDK, and `fastapi` — then add
one library per problem you actually hit. The rest of this series is that path, one video at a time.

---

## The backlog — 30 more Python videos (for AI engineering)

Grouped into sub-clusters. Order within the series is flexible; the first ~8 are the true beginner on-ramp.

### A. Setup & environment (the on-ramp, for total beginners / JS devs)

1. **Installing Python the right way in 2026 (uv, and why not to fight the system Python).** The single most
   common beginner trap; get this right once. For JS devs: `uv` is your `nvm` + `npm` + `package.json`.
2. **Virtual environments explained (venv / uv), the node_modules of Python.** What they are, why every
   project needs one, how to never pollute your global install again.
3. **pip vs uv vs poetry, and lock files for reproducible AI projects.** Why "it works on my machine" happens
   and how lock files fix it.
4. **Reading a Python project: files, modules, packages, and `__init__.py`.** How imports actually resolve —
   the thing that confuses every newcomer.

### B. Language basics filtered through JavaScript

5. **Python syntax crash course for JavaScript developers.** Indentation, no semicolons, `None`/`True`,
   `dict` vs object, `list` vs array — the 20-minute "you can now read Python" video.
6. **List/dict comprehensions vs map/filter/reduce.** The single most "Pythonic" thing JS devs miss.
7. **Type hints in Python for TypeScript developers (and mypy).** Yes, Python has types; here's how they differ.
8. **f-strings and string formatting.** Small but you use it constantly.
9. **Async Python (asyncio) for people who already know async/await.** `async def`, `await`, `asyncio.gather`
   — running many LLM calls at once.
10. **Decorators explained by actually needing one.** Demystified via a retry/timing decorator you'd really write.
11. **Context managers and the `with` statement.** Files, DB connections, and why AI code is full of them.
12. **Reading Python tracebacks and debugging without panicking.** How to actually read the red text.

### C. The data-shape toolkit (used in every AI project)

13. **Pydantic from scratch: the validation library you'll use in every AI project.** Models, validation,
    parsing — the Zod of Python.
14. **dataclass vs Pydantic vs TypedDict vs dict: which to reach for.** Stop guessing which "object" to use.
15. **Working with JSON in Python (and getting clean JSON out of an LLM).** `json`, parsing model output, common gotchas.
16. **NumPy for AI: vectors, embeddings, and cosine similarity from scratch.** Understand what an embedding
    *is* by computing similarity in ten lines — no vector DB needed.
17. **Environment variables and secrets done right (dotenv, pydantic-settings).** Stop hardcoding API keys.

### D. First real AI-engineering building blocks

18. **Your first LLM API call in Python (Anthropic / OpenAI).** Hello-world for the whole channel; messages,
    system prompts, params.
19. **Structured outputs: forcing an LLM to return typed data (Pydantic + instructor).** The technique that
    turns an LLM into a reliable function.
20. **Counting tokens and estimating cost with tiktoken.** Why your bill is what it is, and sizing chunks/context.
21. **Streaming LLM responses in Python.** Token-by-token output for that real-time feel.
22. **Retries, timeouts, and rate-limit handling for flaky model APIs (tenacity).** Production reality: the
    API *will* fail; handle it gracefully.
23. **Running LLM calls in parallel (asyncio + httpx).** Turn a 10-minute batch job into 30 seconds.

### E. RAG and data ingestion (Python side)

24. **Loading and chunking documents in Python (PDF, HTML, docx).** `pypdf`, `unstructured`, and sane chunk sizes.
25. **Generating embeddings locally with sentence-transformers (free, no API).** Great for learning RAG cheaply.
26. **Connecting Python to a vector database (start with Chroma, then pgvector).** Store and query embeddings
    end to end.

### F. Shipping it — apps, APIs, deployment

27. **Build an AI API with FastAPI in 30 minutes.** Endpoints, Pydantic request/response, auto docs; the
    backbone of most AI services.
28. **Build a quick AI app UI with Streamlit (or Gradio).** Put a face on your model with zero frontend code.
29. **Deploy a Python AI function to AWS Lambda (boto3, packaging, the size-limit trap).** Real serverless
    deployment, including the dependency-size gotchas that bite everyone.
30. **Build a Python CLI for your AI tool (Typer + Rich).** Package your script into something you (and others)
    can actually run.

### Bonus / recurring

- **Testing AI code: how do you unit-test something non-deterministic? (pytest + mocking LLM calls).**
- **Jupyter notebooks vs scripts: when to explore vs when to build.**

---

## Notes for production

- **Format per video (from the plan's "explain, then build"):** most of these are short-to-medium explainers;
  the "first API call," FastAPI, RAG, and Lambda ones are natural **explain-then-build** two-parters.
- **The JS-dev bridge is the differentiator** — wherever a Python concept has a JavaScript analog, say it out
  loud (that's an underserved, authentic angle from the plan).
- **Get it right before you teach it** — for any video with code, build it and get it fully working off-camera before scripting, then teach it with authority.
- **Titles above are candidates, not final** — keep final titles em-dash-free per persona rules when they
  land in a queue.
