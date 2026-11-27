# livestream-aws: RESEARCH

_The only source of facts and numbers for the video "the livestream LangGraph, run as a production system on AWS"
(AI Engineering Simplified, longform-presentation format 4, SCRIPTED). Written 2026-11-23. Every figure a card prints
or Mike says comes from here. Section 2 is read from the repo; section 3 is the AWS research
(`research/aws-sources.md`, every row with its source URL and read date)._

## 1. What the video is

- **A hypothetical, said as one.** The same livestream-repurposing graph as the last two videos (clip-evals,
  langgraph-updates), set up as if it ran in production on AWS. Nothing in it is built. Every spoken line about AWS is
  "would", "I'd", "here's how I'd set it up", never "I run" or "we built".
- **The follow-up to:** clip-evals (live, U26NDilqCDo: the harness and the eval record) and langgraph-updates (one
  agent became four steps; the browser was the bottleneck, 3.9 of the 4 h 38 min build).
- **Channel rules:** present with authority, never as a co-beginner (`video-creation/ai-engineering/ai_channel_plan.md`);
  no em dashes on screen; numbers as digits.

## 2. What runs today (read from the repo 2026-11-23)

| Fact | Value | Where it comes from / how to re-pull |
|---|---|---|
| Where it runs | one Windows PC, every step local | the repo; root `CLAUDE.md` |
| Pipeline | livestream -> intake (low-bitrate re-encode, vertical version, transcript) -> 3 lanes (long-form, vertical shorts, text and images) -> queues -> posting scripts | root `CLAUDE.md`, "Pipeline" |
| The graph | one LangGraph `StateGraph` per batch, 14 nodes | `python video-creation/livestream-repurpose/graph/run.py batch --stub ok` prints the 14 |
| The 14 nodes | intake, register, launch_lane3, lane2_select, lane2_cut, gate_4b, lane2_tighten_plan, lane2_tighten, gate_2nd, lane2_finish, lane2_build, lane2_publish, join_lane3, verify_batch | same |
| Lane 3 | its own process, a 3-node graph: draft, repurpose, visual_qa | `batch_graph.py`, `add_node("draft"...)` |
| Human gates | 2 (gate 4b after the raw cuts, the 2nd gate after tightening), each a LangGraph `interrupt`; the run exits with code 2 and resumes from the CLI | `batch_graph.py` `_gate`, `GATE_EXIT_CODE = 2` |
| State | a `TypedDict`, checkpointed to SQLite (`SqliteSaver`), one thread per batch | `run.py` |
| Agents in this graph | 7: clip-strategist, tighten-strategist, lane3-drafter, remotion-builder, image-gen, visual-qa, publish-meta-author | `longform-presentation/media/standard/langgraph-updates/facts.json` |
| How an agent runs | headless Claude Code (`claude -p --agent <name>`), each a Markdown definition with its own model, effort and tools | `batch_graph.py` `spawn_agent`; `.claude/agents/` |
| Agent runs on one livestream | 44 (the first live run after the split) | langgraph-updates `facts.json`, `runs_total` |
| Transcript | Whisper medium on the local GPU, word-level timestamps | `.claude/agents/shared/transcriber.md` |
| Vertical version | a face-tracked crop of the 16:9 recording | `video-creation/skills/gaze/` |
| Images | one ChatGPT session in one Chrome browser, driven by Playwright; a lock makes the shorts take turns | langgraph-updates RESEARCH.md; `batch_graph.py` `_stage_lock` |
| The bottleneck | the build step took 4 h 38 min; the browser was busy for about 3.9 h of it | langgraph-updates RESEARCH.md, section 1 and 4 |
| Renders | Remotion, 1-minute chunks with a watchdog, CPU h264 | `video-creation/skills/chunked-render/chunked-render.md` |
| One video at a time | a machine-wide run queue: one video run owns the PC, the next waits | `video-creation/skills/run-queue/run-queue.md` |
| Posting | finished posts wait in JSON queue files; Python Playwright scripts and the YouTube Data API post them | `schedule-tweets/`; root `CLAUDE.md` |
| Platforms | 7: X, Instagram, Facebook, TikTok, Rumble, BitChute, YouTube | root `CLAUDE.md`, "Pipeline" |
| Dashboard | a local web page on port 8766 | `schedule-tweets/scripts/serve_dashboard.py` |

| The livestream of the last video's first live run | batch `ripping`, 2026-11-18, 3,766.84 s = 62.8 minutes, "63 minutes" on air | `ffprobe` of `video-creation/livestream-repurpose/media/ripping/ripping LOW BPS VERTICAL.mp4` |
| Shorts built on that run | 7 (the 7 shorts that took turns on the browser) | langgraph-updates `facts.json`, `clips` and `built` |
| Images planned on that run | 41 | langgraph-updates `facts.json`, `images` |
| Longest wait at a human gate on record | 9 hours: batch `peach`, plan validated 2026-11-15 21:20:37, first gate approved 2026-11-16 06:23:03 | clip-evals RESEARCH.md, section 4 |
| Re-runs | every step reads the disk first and skips what is done ("redo-safe") | `batch_graph.py` header; clip-evals RESEARCH.md section 3 |

## 3. AWS (read 2026-11-23; the full table with every URL and verbatim quote is `research/aws-sources.md`)

Prices are US list prices on the read date; a card that prints one says "list price, Nov 2026".

| Fact | Value | aws-sources.md |
|---|---|---|
| AgentCore | "Amazon Bedrock AgentCore is now generally available" (Oct 13, 2025); works "with any open-source framework such as CrewAI, LangGraph, LlamaIndex, and Strands Agents" | 1 |
| AgentCore parts used here | Runtime, Memory, Gateway, Identity, Browser, Observability, Policy, Evaluations | 1 |
| Runtime isolation | "each user session runs in a dedicated microVM with isolated CPU, memory, and filesystem resources" | 1 |
| Runtime session length | "Sessions run for up to 8 hours on microVMs" | 1 |
| Runtime billing | per second; "CPU scales to zero during I/O wait (waiting for LLM responses, tool / API calls, or database queries)" | 1 |
| Checkpointer for LangGraph on AWS | `langgraph-checkpoint-aws` 1.3.0 (Nov 19, 2026): `DynamoDBSaver` ("DynamoDB-based checkpoint storage with S3 offloading"), `AgentCoreMemorySaver`, `ValkeySaver` | 3 |
| interrupt in production | LangGraph "saves the graph state using its persistence layer and waits indefinitely until you resume execution"; resume with a `Command` on the same thread ID | 3 |
| The overnight gate | a 9-hour wait (section 2) does not fit in one 8-hour session: the graph checkpoints at the gate, the session ends, the approval starts a new session on the same thread | 3, Careful 6 (our design, built from the two facts above) |
| Notify the human | SNS: "message delivery from publishers (producers) to subscribers (consumers)", email / SMS / HTTP endpoints | 4 |
| Start on upload | "Amazon S3 can send events to Amazon EventBridge whenever certain events happen in your bucket" | 4 |
| Claude on Bedrock | AWS lists Claude Fable 5.2, Claude Opus 5.5, Claude Sonnet 5.5 (and older); the three model families the agents use are all there | 2 |
| Claude Code / Agent SDK on Bedrock | `CLAUDE_CODE_USE_BEDROCK=1` plus AWS credentials; the Agent SDK is "Claude Code as a library" | 2 |
| Claude Code on Bedrock, one gap | "The WebSearch tool is not available on Amazon Bedrock." (lane3-drafter uses WebSearch to fact-check) | 2 |
| Gateway | "converts APIs, Lambda functions, and existing services into Model Context Protocol (MCP)-compatible tools" | 1 |
| Policy | GA Mar 3, 2026; "intercept every tool call before execution"; Cedar-compatible | 1 |
| Identity | a token vault for "OAuth 2.0 tokens, OAuth client credentials, and API keys"; built-in providers include Google, Facebook, X | 1 |
| Least privilege | "grant only the permissions required to perform a task" (IAM best practices); each agent identity has its own ARN | 10 |
| Browser | "a managed Chrome browser", Playwright over CDP, 1,000 concurrent sessions per account (adjustable), 1 vCPU / 4 GB each; browser profiles "persist and reuse browser data including cookies and local storage across multiple sessions" (Feb 6, 2026) | 1 |
| Image model on Bedrock | Nova Canvas reached end of life Sep 30, 2026 (never show it). Stable Image Core: 4 cents an image, us-west-2 | 7 |
| Images for one livestream | 41 x 4 cents = 1.64 dollars (computed) | 7 + section 2 |
| Transcribe | word start and end times for every word; custom vocabularies for "brand names and acronyms, proper nouns"; 0.006 dollars a minute batch, us-east-1 | 5 |
| Transcript for one livestream | 62.8 min x 0.006 = 0.377 dollars, "38 cents" (computed) | 5 + section 2 |
| MediaConvert | "a file-based video processing service", billed per normalized output minute (HD AVC, 30 fps, Pro tier: 0.024 dollars a minute, us-east-1) | 5 |
| Rekognition Video face detection | per-timestamp face boxes from a video in S3, async; 0.10 dollars a minute | 5 |
| GPU instances | G5 = NVIDIA A10G, G6 = NVIDIA L4, G6e = NVIDIA L40S; Fargate has no GPU | 5, Careful 17 |
| Remotion Lambda | "A lot of Lambda functions are created in parallel which each render a small part of the video"; at least 20 frames per function by default; Remotion's cap 200 functions; each render must fit in 15 minutes (Remotion's limit, not Lambda's 30) | 6, Careful 4 |
| Remotion cost | 10-minute HD video, warm: 0.103 dollars, 56 s (us-east-1, 2048 MB, Lambda compute only); "Most users render multiple minutes of video for a few pennies." | 6 |
| AWS Batch | job queues, compute environments, job definitions; runs on EC2, Fargate or ECS Managed Instances | 6 |
| Spot | "up to a 90% discount compared to On-Demand prices"; a 2-minute interruption notice | 6 |
| DynamoDB on-demand | "billed per read or write request", no capacity planning | 8 |
| EventBridge Scheduler | "A one-time schedule will invoke a target only once at the date and time that you specify" | 8 |
| Observability | OpenTelemetry, stored in CloudWatch: "session count, latency, duration, token usage, and error rates" | 9 |
| Evaluations | GA Mar 31, 2026, "automated quality assessment for AI agents", reads LangGraph traces | 1 |

**Do not air:** "Bedrock Agents" (now "Agents Classic", closed to new customers since Jul 30, 2026; say AgentCore);
Nova Canvas; "Lambda caps at 15 minutes"; the X-Ray SDK (maintenance mode, say OpenTelemetry into CloudWatch); any
Claude per-token price on Bedrock (NOT VERIFIED); "I run this on AWS" (it is hypothetical).
