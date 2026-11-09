# AI Engineering Simplified: to-do and topic backlog

_Last reviewed 2026-11-06. Repo facts are as of that date, so re-check them before filming. Each concept is meant to be
taught through how this repo really uses it. On-screen rule: present with authority, so a gap is framed as "here's when
you need this", never as a confession (`video-creation/ai-engineering/CLAUDE.md`)._

## Already covered on the channel

Don't pitch these as new topics: **evals, guardrails, inference, LangGraph** (including durable execution and
human-in-the-loop gates).

The evals video also explained that the repo's Python lints are code graders, `visual-qa` is an LLM judge, and the HITL
gates are human graders. It named the eval tools as well (LangSmith, Langfuse, Phoenix, Braintrust, DeepEval, Ragas,
promptfoo).

Possible overlap to check before scripting:
- `video-creation/ai-engineering/media/need lang-graph/`
- `video-creation/ai-engineering/media/Save tokens by using sub agents/` (context engineering)
- The guardrails video: no script was found in the repo, so check whether it covered prompt injection.

## Said on camera: the eval score layer (NOT BUILT)

From the evals video, CH4 Beat 2, about 10:16 to 10:47 on the final spine (a little later in the published cut, because
of the title-card pauses):

> "The next layer is a dataset and the score. Every clip the strategist proposes and I keep or kill gets recorded at the
> gate. Keep those records and that's a labeled dataset. Replay old transcripts. Score the proposals against my verdicts.
> And I get a precision number for every prompt change."
>
> "But here's the thing, it only gives me precision. The gate records what I killed, not what I wish it had found. So
> recall needs one more field in the gate record."
>
> "The pipeline already runs three grader families in production. The score layer is what I'm building next."

The scripted line "Next video, I build the whole harness live" was NOT said, so no build video was promised. Filming the
build is still the natural follow-up.

| Step | State on 2026-11-06 |
|---|---|
| Record verdicts at the gate | **Partly.** `_apply_deletes` in `video-creation/livestream-repurpose/graph/batch_graph.py` writes `deleted_at_gate` to `clip-plan.json`, and the deleted clip numbers also land in the SQLite checkpoint (`delete_4b`, `delete_2nd`) |
| Keep the records | **Only by accident.** Plans live in the batch folder, which `cleanup/cleanup.js` recycles; none are on disk now and 18 survive in git history. The checkpoint DB and `agent-clip-strategist-*.log` in `graph/data/` survive cleanup, but both are gitignored (no backup) and the code calls the DB disposable |
| Keep what was rejected | **Only by accident.** A deleted clip leaves `clips[]`, and only its gate, id, slug and time are kept there. The full proposal is still in the strategist's log |
| Replay old transcripts through `clip-strategist` | **No.** No replay code found. Cleanup recycles transcripts too: 3 of the 17 usable batches still have theirs on disk (`30x-tao`, `best-time`, `kaspa-cocktails`), so the rest need re-transcribing |
| Score proposals against verdicts (precision per prompt change) | **No.** No scoring code found |
| Recall field ("what I wish it had found") | **No.** `_record_gate` stores only `approved_at` and `deleted` |

**Data available today:** joining the strategist logs to the SQLite verdicts gives 83 proposed clips across 17 batches, with
14 killed and 69 kept, so a rough 83% precision. It's one mixed number, not per prompt change, and some runs had a brief that
fixed the clip count. 3 more kills (`perpspad`, `silver`) can't be matched because those logs have no full plan. Matching is
by clip number; the 3 kills that also appear in git history agreed on slug. The logs and DB have no backup, so seed a
permanent file from them soon.

**Where to keep it (proposed, not decided):** an append-only `video-creation/livestream-repurpose/evals/clip-verdicts.jsonl`,
committed to git, with one line per proposed clip: batch, clip, segments, verdict, gate, time and the prompt version. Recall
gets its own "missed" lines. It must stay outside `shorts/<batch>/`.

**What removes what:** saying a video is complete (`/clear-video-caches`) deletes only After Effects and Remotion caches.
`cleanup/cleanup.js` is the separate tool that sends a `completed` batch's folder, media and transcripts to the Recycle Bin.

## Engineering gaps

1. **Prompt injection defense.** Nothing in the repo's code or docs mentions it. `data-researcher` and `lane3-drafter`
   read the open web, have Bash and Write, and are spawned with `--dangerously-skip-permissions`
   (`spawn_agent` in `video-creation/longform-edited/graph/common.py`, and `batch_graph.py`). `reply-opportunity-strategist`
   reads scraped X posts and has Bash and Write; how it gets launched wasn't checked. This comes from reading the config;
   no attack was tested. **Fix before filming.**
2. **Token and cost tracking.** The three headless spawners (`common.py`, `batch_graph.py`, `find_jobs.py`) all use
   `--output-format text`, which throws away usage data. We can't say which agent burns the Fable allowance or what a
   video costs in tokens.
3. **Tracing inside an agent.** No LangSmith, Langfuse or OpenTelemetry. The dashboard shows the current node, but a
   headless agent prints nothing until it finishes.
4. **Native structured outputs.** Agents return text and `persist_agent_json` regexes the JSON out of it.
5. **Cost-based model routing.** No agent uses Haiku. `job-fit-reviewer` runs classification on Opus. An eval could show
   whether a cheaper model holds up.

## Video ideas, in recommended order

1. **Building the eval score layer.** You said it's next, and it's the evals video's sequel. Needs the steps above first.
2. **Prompt injection.** After the fix: show the before and after, without airing the exposure while it's open.
3. **Token and cost tracking.** A small-looking change that gives the video real numbers.
4. **Retrieval without RAG.** No embeddings or vector databases in the code; agents use a routing table, grep and
   precomputed catalogs like `video-creation/assets/music/library.json`. Contrarian angle: "30 agents, zero vector
   databases". It also sets up the RAG build in `video-creation/ai-engineering/ai_channel_plan.md`.
5. **Retries and idempotency.** Nodes check the disk for finished work, so a failed run can be re-driven safely. The best
   story is the opposite case: a "failed" reply-guy post has usually already gone out, so retrying creates a duplicate.
6. **Model routing and fallback.** 30 agents tiered mainly by how much judgment the job needs: 10 Fable, 16 Opus,
   4 Sonnet. An agent that hits the Fable limit respawns once on Opus, and an API overload gets one respawn too.
7. **Prompt caching.** There's no `cache_control` in our code because the CLI handles it, so we benefit but never see the
   hit rate. Pairs with token tracking.
8. **Context engineering.** `CLAUDE.md` points instead of duplicating, skills are read when needed, and each agent gets
   one narrow slice. Check the overlap with the sub-agents video.
9. **Tracing** and **structured outputs:** gaps 3 and 4 above, each best filmed alongside its fix.
