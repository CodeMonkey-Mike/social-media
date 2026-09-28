# Orchestrator Plan — a single entry point over every social-media skill

_Status: **PLAN / not built.** Captured 2026-05-31 from a 2026-05-24 design discussion
(Claude Code session `6dc1c3b9`, then under the `C--Users-mnede` project history) so the idea
stops living only in a chat transcript. Nothing here is implemented yet._

---

## The idea (what Mike wants)

**One orchestrator that controls all the skills in this directory** — tweets, repurposing,
posting, video, reply-guy, cleanup: everything. Today, knowledge is scattered across per-folder
`SKILL.md` / `CLAUDE.md` files and a 23-file skill library, so a request like "start the dashboard"
or "post the pending tweets" means Claude re-discovers commands by searching the filesystem every
session. The orchestrator removes that: **intent → command, one lookup, zero searching.**

This is a *master* orchestrator over the whole repo. It is **not** the old `social-video-upload`
upload orchestrator (chrome-uploader / camoufox-uploader) — that was a narrower, upload-only design,
and its Camoufox/TikTok uploader was abandoned. Don't conflate the two.

---

## The original 2026-05-24 proposal (verbatim shape)

A root `CLAUDE.md` as an intent→command **routing table** that Claude auto-loads when working in
this directory, backed by an `agents/` folder of condensed, command-focused capability files:

```
social-media/
├── CLAUDE.md          ← orchestrator: intent → command routing table, one lookup
├── agents/
│   ├── dashboard.md     ← "start: python .../serve_dashboard.py → http://localhost:8766"
│   ├── image-gen.md     ← single vs batch, chat URLs, rate limits
│   ├── posting.md       ← which script for which platform, profile conflicts
│   ├── repurpose.md     ← transcript → tweets/YT/IG workflow (condensed from SKILL.md)
│   └── reply-guy.md     ← queue structure, --limit quirk, never retry
├── repurpose/ · schedule-tweets/ · x-reply-guy/   ← scripts unchanged
```

Key principles from the discussion:
- Root `CLAUDE.md` **imports `agents/*.md` by reference** so it stays short.
- Each `agents/*.md` is the **condensed, command-focused distillation** of what's currently buried
  in the long `SKILL.md` files — not a copy.
- Rationale: _"User says X → command is Y, file is Z. Zero searching."_
- **Tradeoff weighed:** true Agent-tool subagents (isolated context windows) add cold-start overhead
  on every call — reserve those for long autonomous jobs (a full image batch, a posting run), and use
  the lightweight `CLAUDE.md` + `agents/*.md` routing for everyday intent lookup.

> ⚠️ **This list is stale.** It predates the 2026-05-28 restructure (see below) and omits
> video-creation, cleanup, the batch registry, persona tooling, and more. Re-derive it from the
> current capability inventory before building.

---

## How it works (the mechanics)

The chain is an index that points at reference docs that point at the real scripts:

```
ROOT CLAUDE.md   ← auto-loaded into context every session (the "zero searching" win)
     │  "for posting → see agents/posting.md"
     ▼
agents/posting.md   ← a condensed REFERENCE doc (loaded on demand, or @-imported)
     │  "post a tweet → node schedule-tweets/scripts/post-tweet.js ..."
     ▼
the actual script / SKILL.md / data in the subfolder   ← the real work
```

- **Only the root `CLAUDE.md` is special.** Claude Code auto-reads `CLAUDE.md` from the project root
  at session start, so its contents are always in context — no invocation, no searching. Today there
  is no root `CLAUDE.md`, which is exactly why every "start the dashboard"-type request re-discovers
  the command from scratch.
- **The `agents/*.md` files are NOT auto-loaded** (that would bloat context). Two ways to pull one in:
  - **`@import`** — `CLAUDE.md` writes `@agents/posting.md`; Claude Code inlines that file's content
    automatically (always loaded). Simple, but loses the "stay short" benefit if the files are big.
  - **Plain pointer (lazy, preferred)** — `CLAUDE.md` says "for posting, read `agents/posting.md`";
    Claude opens it with the Read tool **only when a posting task comes up**. Base context stays tiny;
    costs one Read when that capability is actually needed. This is the 2026-05-24 "imports by
    reference so it stays short" intent.
- **Each capability file is a reference point, not a doer.** It points at the real command/skill in the
  subfolder (and should point INTO existing files like `schedule-tweets/skills/`, not duplicate them).

### Naming caveat — `agents/` vs `.claude/agents/`
"`agents/`" is a confusing label, because Claude Code has a real **subagents** feature at
**`.claude/agents/*.md`** — spawnable, isolated-context workers invoked via the Task tool (e.g. the
old `chrome-uploader` / `camoufox-uploader`), which cold-start each call. **This plan does not want
those** for everyday routing — it wants plain reference docs:
- Capability files in a normal folder (`agents/`, or clearer: `docs/` / `playbooks/`) referenced from
  `CLAUDE.md` → **reference points** (this design). ✅
- Files in `.claude/agents/` → real isolated subagents (reserve for long autonomous jobs — a full
  image batch, a posting run — per the tradeoff note above).

Decision to make: pick a non-confusing folder name (`playbooks/` reads better than `agents/`).

---

## Current reality (2026-05-31 inventory)

### Top-level capabilities / folders
| Path | Capability |
|---|---|
| `video-creation/` | Video pipeline (Remotion/HTML, b-roll, Whisper captions) + `vertical-ai-persona/` (AI-persona shorts). Has its own `SKILL.md` + `CLAUDE.md`. |
| `repurpose/` | Transcript → tweets / threads / IG & YT posts + image generation. `repurpose/SKILL.md`. |
| `schedule-tweets/` | Publishing layer: queue files (`data/*.json`) + per-platform post scripts + a 23-file `skills/` library + the dashboard. |
| `persona/` | `persona.json` — single source of truth for voice/terminology. |
| `x-reply-guy/` | X auto-reply automation. Has its own `CLAUDE.md`. |
| `cleanup/` | Unified multi-target asset cleaner (`cleanup.js` + `targets/`). |
| `scripts/` | Cross-cutting tooling: `publish-shorts.py`, `persona-lint.py`. |
| `batches.json` | Registry of livestream-repurpose batches (read by cleaner + repurpose). |

### Routing artifacts that ALREADY exist (the partial/organic orchestrator)
- **`README.md`** (root) — human-facing overview: pipeline diagram + layout table. Closest thing to a
  root orchestrator today, but it's prose for humans, not an intent→command table for Claude.
- **`video-creation/CLAUDE.md`**, **`x-reply-guy/CLAUDE.md`** — per-folder routing already in place.
- **`schedule-tweets/skills/SKILL.md`** + 22 capability skills (per-platform post skills, `dashboard.md`,
  `cleanup-images.md`, `collect-engagement.md`, `pending-social-posts.md`, polls, carousels, verticals,
  longform uploads). This is effectively a posting-skill registry already.
- **`~/.claude/agents/`** — `chrome-uploader.md`, `camoufox-uploader.md` (the old upload subagents;
  camoufox/TikTok abandoned). **`~/.claude/skills/`** — `higgsfield-generate`, `higgsfield-soul-id`,
  `watch` (cross-project).
- **Dashboard:** `schedule-tweets/scripts/serve_dashboard.py` → http://localhost:8766.

### What changed since the 2026-05-24 proposal (why the agents/ list is stale)
All landed 2026-05-28:
- `video-creation/` **moved into** this repo (was a separate top-level folder).
- Root `README.md` added; unified `cleanup/` tool added; `batches.json` registry added.
- `scripts/publish-shorts.py` + `persona-lint.py` added; captions made persona-aware.
- `shorts/` restructured into per-batch folders + `_tooling/`; transcripts moved to per-livestream
  folders + `transcripts-ad-hoc/`.

---

## Investigate before building (the open work Mike flagged)

1. **Re-derive the capability list** from the current inventory above. The proposal's 5 agents become
   more like: `video` (+ vertical-ai-persona), `repurpose`/image-gen, `posting` (→ points into
   `schedule-tweets/skills/`), `reply-guy`, `cleanup`, `dashboard`, `pipeline/batches`, `persona`.
2. **Audit the 23 `schedule-tweets/skills/` files** for current-vs-stale (folder moves on 2026-05-28
   may have left stale paths) before the `posting` agent references them.
3. **Decide the relationship between the root `CLAUDE.md` and the existing per-folder
   `CLAUDE.md`/`SKILL.md`.** Import-by-reference (preferred — avoids a third source of truth that
   drifts) vs. condensed copies. The whole value is *not* re-creating drift.
4. **README vs CLAUDE.md roles.** Keep `README.md` human-facing and add `CLAUDE.md` as the machine
   routing table? Or fold them? Avoid two overviews that disagree.
5. **Routing table vs Agent-tool subagents.** Confirm the lightweight `CLAUDE.md` + `agents/*.md`
   approach as the default; reserve real subagents for long autonomous runs.
6. **Reconcile `~/.claude/agents/` uploaders.** The abandoned camoufox/TikTok uploader — keep, fix
   (it references a now-deleted `<repo>/uploaders/` path), or remove.
7. **Confirm live entry-point commands** per capability (exact script + args + ports) so the routing
   table is accurate the day it ships — e.g. dashboard port, `publish-shorts.py <batch>` usage, the
   per-platform `post-*.js` invocations.

---

## Execution model — pipeline DAG & spawning (FUTURE / deferred)

Beyond simple command routing, the skills are **chained by data**: one transcription fans out into
multiple downstream skills.

```
transcribe livestream → transcripts/<livestream>/...
        ├──► repurpose skill        → tweets / threads / IG & YT posts
        └──► video-creation skill   → short topics (90s chunk-and-group) → shorts
```

That's a real **DAG (Directed Acyclic Graph)**: *directed* because the flow goes one way (upstream
artifact → downstream consumer, never back), *acyclic* because nothing loops back on itself. The
transcript is a shared upstream artifact, and `batches.json` already tracks where each livestream sits
in the flow. The eventual automation would let an orchestrator key off that state and **spawn the
downstream skills as parallel subagents** (isolated context each, sharing the transcript path) — the
generalized form of the old `social-video-upload` parallel-dispatch pattern.

**Important modeling rule for later:** peers don't spawn peers — if repurpose spawned video-creation
which spawned repurpose, that's a cycle (A→B→A) and no longer a DAG. An orchestrator *above* the skills
owns the graph and spawns the children; the skills never call each other directly. That's what keeps it
acyclic.

**Deferred on purpose.** This spawnable layer is NOT being built now. Get the manual process tight and
observed first.

---

## Phasing / decision (2026-05-31)

- **Phase 1 (now): lightweight, human-driven routing. ✅ BUILT 2026-05-31.** Root `CLAUDE.md` routing
  table + a `playbooks/` folder (`repurpose`, `image-gen`, `posting`, `video`, `reply-guy`) — each a
  condensed command sheet that points into the existing canonical `SKILL.md`/`CLAUDE.md` docs, not a
  copy. Mike says which skill to run next; Claude uses the table to run it without searching. **No
  `.claude/agents/` changes** — the hidden subagents folder (incl. the old `chrome-uploader`/
  `camoufox-uploader`) stays untouched. **No auto-spawning, no peer-to-peer chaining.** Additive only:
  nothing existing was moved. (Not yet done: a full stale-path audit of all 23 `schedule-tweets/skills/`
  files — the routing was built from the canonical docs and all pointer paths were verified to resolve.)
- **Observation window (~1 week+):** run the manual loop, watch where it's clumsy, let the real command
  set and pipeline stabilize.
- **Phase 2 (later, only if it earns it):** add the spawnable orchestration above (DAG-driven parallel
  fan-out via `.claude/agents/`), per the Execution-model section. Revisit after the observation window.
  → **Direction chosen 2026-07-23: LangGraph (Python)** — see the dated section below.

## Next step

Phase 1 is built (root `CLAUDE.md` + `playbooks/`). Now **use it for ~a week and watch where it's
clumsy** — wrong/stale commands, capabilities that want their own playbook, rules worth promoting into
the always-loaded `CLAUDE.md`. Fold those observations back into the routing table/playbooks. Only after
that, and only if it earns it, move to Phase 2 (the spawnable DAG orchestration). Optional tidy-up:
the full stale-path audit of the 23 `schedule-tweets/skills/` files.

---

## Phase 2 direction chosen — LangGraph, Python (2026-07-23)

_Supersedes the open "only if it earns it" question above: Mike confirmed the pain is real
(daily batches, manual gate-shepherding, crash re-renders) and set the direction. This section
records the decisions so no future session re-litigates them. **Build status: the first graph
exists and is BLESSED** — `linkedin-automation/graph/` (Lane 1 seed, 2026-07-28, see that
folder's `DESIGN.html` + PROJECT-LOG entry); everything else below is still direction, not build._

- **Phase 2 = LangGraph StateGraphs, Python spine.** Supervisor pattern (the "peers never spawn
  peers" rule *is* supervisor topology), SQLite checkpointing, human gates as interrupts surfaced in
  the existing :8766 dashboard, hard rules encoded as topology (single posting node, zero-retry
  policies, idempotency guards: record "attempted" → act → verify → record "complete").
- **Strangler-fig order: LinkedIn first** (smallest, lowest blast radius — see
  `linkedin-automation/PROJECT-LOG.md` 2026-07-23), then repurpose, then longform as a subgraph,
  then the full batch orchestrator; the posting layer, where the hardest rules live, migrates last.
- **Partial-lane migration works by design.** Steps communicate through files on disk +
  `batches.json` stamps, so a lane keeps functioning with only its first N steps graphed — the
  graph's END is a frontier that advances one node at a time. The rule that keeps this true:
  **on-disk artifacts remain the contract**; graph state never exclusively carries anything a
  downstream (still-manual) step needs. `batches.json` stays the human-readable source of truth;
  the checkpoint DB is only LangGraph's private resume mechanism. Optional later pattern: full-span
  graphs where un-migrated steps are interrupt placeholders ("do step 3 by hand, mark done") for
  lane-wide dashboard visibility before lane-wide automation.
- **Language consolidation rides along (freeze-and-port).** Endpoint = **all-Python except Remotion**
  (root `CLAUDE.md` Python-first hard rule, commit `f093be2`). Each JS script is first wrapped as a
  subprocess node at batch granularity, then ported to Python when its lane migrates — JS→Python
  Playwright translation is near-mechanical (mirrored APIs; the platform quirks travel with the
  code), and **live verification is the bottleneck, not translation**: order ports by blast radius,
  read-only tooling first, posting scripts + LinkedIn actions last.
- **Source documents:** `linkedin-automation/langgraph-conversation-transcript.md` (the strategy
  conversation: architecture, checkpointing, idempotency, interrupts, migration),
  `claudeisnaughty.md` (evidence/motivation: the 2026-07-18/19 failure log — what a graph fixes
  structurally vs what still needs exemplars/gates/QA inside nodes), root `CLAUDE.md` Python-first
  rule, Claude Code session `0206c116` (2026-07-18: the LinkedIn one-session build plan — state
  schema, node list, ~4-5h MVP).

---

## Livestream-repurpose migration plan (2026-08-02) — the second automation

_The strangler-fig's next bite per the order above (LinkedIn lanes 1-5 all blessed → repurpose).
Decisions locked with Mike 2026-08-02; do not re-litigate:_

- **Same template as LinkedIn:** PORT FIRST, graph second · wrap blessed scripts as subprocesses ·
  verify from disk · zero retries, halt topology · SQLite checkpoints · stub modes · replaced
  script frozen as rollback · bless on a live run. Two documented extensions for this pipeline:
  **verify nodes can halt** (every downstream node consumes the verified artifact), and
  **HITL gates + agent handoffs (formerly "judgment seams")** — one graph per MECHANICAL SEGMENT; a segment ends where an advisor
  (clip-strategist, tighten-strategist, Lane 3 drafting, publish metadata) or a Mike gate begins,
  the plan lands on disk (`clip-plan.json`, `tighten-plan.json`, `longform-meta.json`), and the
  next invocation consumes it. No interrupts; the ask is the decision.
- **Wave order** (one wave at a time — port to Python, wrap as graph nodes, bless on a real
  stream, then the next wave):
  1. **intake** (Ph 1 + Lane 1 + 1B + 2) — **BUILT 2026-08-02**:
     `video-creation/livestream-repurpose/graph/` (`run.py --source "<recording>" --min-sil N`,
     `--resume` after a kill, `--stub ok|fail`, `--test-sandbox` for scratch runs). New ports:
     `encode_low_bps.py`, `verticalize.py` (skill commands frozen verbatim), `longform_stage.py`,
     `longs_append.py` (replaces `_lane1_longs_rip.js`-style writers, which stay as frozen
     rollback), `fix_transcript_glossary.py` (deterministic tier auto-fixed, KRC20-name lookalikes
     flag-only). Full sandbox e2e green on real audio (the glossary caught a live Casper→Kaspa
     mishear on its first run); **live bless pending the next livestream.** Dashboard: LangGraph →
     Livestream tab (feeds: `graph/data/lane_runs.json` + `lane_progress.json`).
  2. **cut** (Ph 4 exec) — **BUILT + SANDBOX-BLESSED 2026-08-04**: canonical
     `livestream-repurpose/scripts/cut_topics.py` (de-forks the 17 `cut_topics_<batch>.py`,
     which freeze as rollback) reads `clip-plan.json` and cuts/concats per assembly_order;
     graph `graph/shorts_graph.py` = cut → verify_cut → finalize (dashboard + register +
     progress.json) → verify_finalize, invoked as `run.py cut --batch <batch>` (same
     stub/sandbox/thread contract as intake; plan validation fails fast in the runner AND the
     script; finalize refuses to clobber a progress.json past the cut phase). Segment starts
     AFTER the clip-strategist's plan lands (judgment seam) and ends at Mike's 4b review.
     Sandbox e2e green (scratch 2-clip batch incl. non-chronological assembly, prod-isolation
     + halt + clobber-guard cases). **LIVE-BLESSED 2026-08-04 on october-bottom** (7 clips /
     684.5s, one green invocation; same stream also completed Wave 1's full all-nodes bless).
  3. **tighten** (Ph 5 exec + 5B desilence) — **BUILT + SANDBOX-BLESSED 2026-08-05**: canonical
     `livestream-repurpose/scripts/tighten_clips.py` (de-forks the 15 `tighten_clips_<batch>.py`,
     frozen as rollback; the unsuffixed original renamed to `tighten_clips_best350x.py`; blueprint
     was `tighten_clips_october_bottom.py`) reads `tighten-plan.json` + `clip-plan.json` (4b
     retitles included), applies boundary relocks (uncapped) + removals under the voiced-content
     ceiling MEASURED vs Whisper words (15% hard, computed never trusted), renders keep spans off
     the vertical master with 8 ms declicks, then 5B via the canonical desilencer at the CALLER'S
     `--min-sil` (Mike's per-batch knob, never baked — the delete_silences.py 250 ms wrapper stays
     for hand runs). Graph `graph/shorts_graph.py` tighten segment = tighten → verify_tighten
     (durations vs plan-computed keeps ±1s, geometry == master, structural swallow guard: whisper
     spans are a RATIO tool, never an absolute floor — sandbox proved a healthy 23% silence removal
     trips a word-span floor) → finalize (dashboard IN PLACE + progress to the 2nd-review gate,
     past-5B clobber guard + `--force`) → verify_finalize. Invoked
     `run.py tighten --batch <batch> --min-sil N`. Segment starts AFTER Mike's 4b verdicts land in
     clip-plan.json AND the tighten-strategists' plan lands (judgment seam); ends at his 2nd
     review. Stub ok/fail green; sandbox e2e green on real audio (scratch 2-clip batch off a real
     tightened spine incl. non-chronological assembly + relock; over-ceiling halt at a measured
     64.5%, outside-segment halt, clobber-guard + --force cases). **Live bless pending the next
     real tighten run.** Dashboard: lane 3 on LangGraph → Livestream.
  4. **finish** (5C filler + 6 caption source + render-assets; 5B moved INTO Wave 3's tighten) —
     **BUILT + SANDBOX-BLESSED 2026-08-07** (with Wave 5, both in one stream on Mike's explicit
     call — his "all of Lane 2 into LangGraph except ChatGPT image gen" overrode the
     one-wave-per-stream cadence; both waves are wrap-and-verify around already-blessed tools, no
     new render math). Canonical `livestream-repurpose/scripts/finish_batch.py`
     (fillers→transcribe→assets→finalize): 5C spans from an OPTIONAL `filler-plan.json`
     (adjudication stays a judgment seam; no plan = passthrough, every clip still gets
     `-final.mp4`), canonical `cut_fillers.py` per clip (its own 8% ceiling), canonical
     `transcribe_clips.py --force` off the -final spine (its spine resolution now prefers
     `-final.mp4` — pre-fix it would caption a pre-5C spine), canonical NEW
     `setup_render_assets.py` (ports `setup-batch-render-assets.js`, FROZEN as rollback: stages
     the CURRENT final spine + bakes in the mandatory seek-friendly GOP re-encode, verified).
     Graph = 8 nodes in `shorts_graph.py`; `run.py finish --batch <batch>`; runs AFTER Mike's
     2nd review (the invocation IS his approval record); ends at the builder frontier.
  5. **publish** (Ph 8) — **BUILT + SANDBOX-BLESSED 2026-08-07**: `publish-shorts.py` grew
     `--meta publish-meta.json` (hook/caption/tags/title authored BEFORE the run — the
     longform-meta.json seam contract; existing entries never touched, so Mike's hand-retitles
     survive re-runs). Graph = publish → verify_publish (staged md5 vs the CURRENT render — the
     2026-07-23 stale-stage hazard mechanized; complete entries; all 7 platforms pending;
     durations; no em dashes; hashtag-free captions) → persona-lint gate → summary.
     `run.py publish --batch <batch> --date D`; the `--date` re-queue hole is a mechanical
     REFUSAL (a second date for a staged batch halts with guidance). Stages the queue ONLY —
     POSTING stays Mike-gated and sequential.
  6. **render slice** (Ph 7) — DELIBERATELY NOT a graph (2026-08-07): the render is inside the
     remotion-builder's iterative QA loop (draft → chunk QA → render → whisper-verify → SFX
     retimes → re-render); a one-shot graph would fight the loop. The mechanical pieces are
     already gates in code (`finalized_short_gate.py`, `stage_lock.py`, and now the staged +
     GOP-verified spine from Wave 4). ChatGPT b-roll generation stays in the builder — the
     browser stack ports LAST (Mike, 2026-08-02; reaffirmed by his Wave 4/5 ask, 2026-08-07).
  7. **lane 3 (Wave 6)** — **BUILT + SANDBOX-BLESSED 2026-08-09** (Mike's "get through lane
     three, change any JavaScript to Python and put it into langgraph" overrode the browser-
     stack-ports-LAST ordering from 2026-08-02). The ChatGPT browser stack ported to Python:
     `repurpose/chat_pool.py` (registry lib, byte-compatible with the shared
     `chatgpt-image-chats.json` — the still-JS builder b-roll scripts keep working against it) ·
     `chat_delete.py` (title-deletion gate preserved EXACTLY: live title must start
     b-roll/social; every delete API-verified 404) · `gen_images.py` (pool-managed generator:
     reload-capture, ref-upload-before-baseline + post-send re-baseline, estuary preference,
     ref-byte + sibling-dup rejection; in-page fetch bodies kept as literal JS). JS twins
     (`gen-images.js`/`chat-pool.js`/`chat-delete.js`) FROZEN as rollback;
     `generate-broll-reload.js`/`gen-batch-freshchat.js` stay JS with the Phase 7 builders.
     NEW canonical `repurpose/queue_writer.py` (the queue-writer module: per-file schemas,
     image-id uniqueness vs ALL queues+images dirs, em-dash/chart-emoji lint, IG-Kaspa-only +
     X-poll-topic HARD gates, 5-8 thread rule, indent-preserving emoji-safe appends, idempotent
     by id) + `lane3_batch.py` (stage runner; generate holds the `chatgpt` stage lock, one item
     per invocation per the 2026-07-14 binding regression, refs last per chat). Judgment seam:
     drafting lands in `repurpose/output/<batch>-lane3-plan.json`; graph
     `graph/repurpose_graph.py` = generate → verify_images → queues → verify_queues → lint →
     finalize → verify_finalize; `run.py repurpose --batch <b>`. Stub ok/fail green · sandbox
     e2e green (fake-gen; sandbox never drives the real browser) · 7 refusal drills green ·
     idempotent re-run green · emoji round-trip green · read-only live probe green (profile,
     composer, session token, registry). **Live bless = the first real batch run** (staged
     within it: registry read → generation → deletion sweep last).
- **Lane 1 silence method = the canonical desilencer** (Mike, 2026-08-02): `desilence.py --nvenc
  --bps 700k`, dual-threshold, ONE pass, no crf-18 intermediate. The six
  `longform_desilence_<batch>.py` forks (single-threshold `silencedetect` — the banned method)
  are retired reference, not rollback.
- **Cadence:** Mike runs the blessed frontier on each new stream and continues the remaining
  phases manually as today; the next wave ports when the next stream lands. The posting layer
  still migrates last (unchanged).

_Source: session `6dc1c3b9` (2026-05-24). Related but distinct: the old `social-video-upload`
orchestrator is recoverable from git at `86709d6~1` (`uploading/` subtree, removed in the refactor)._


## Lane 2 endgame shape — FINISH + builds + PUBLISH as ONE segment (decided 2026-08-12)

**Mike adopted the merged shape as the committed Phase 2 target for lane 2** (johnny-batch
session, after the build->publish handoff sat unrun for an hour because the trigger lived in
prose):

- ONE StateGraph: fillers -> transcribe -> assets -> per-clip BUILD branches (LangGraph Send
  fan-out; each branch = b-roll gen -> comp -> render under the existing chatgpt/render stage
  locks, preserving the measured clip-N+1-generates-while-clip-N-renders pipelining) ->
  finalized-short gate per branch -> frontier -> verify_frontier -> publish -> lint.
- The ONLY HITL gates inside lane 2: **4b review and 2nd review**. The pipeline TERMINATES at
  the queue (everything staged, pending). Posting is a separate queue-driven, batch-agnostic
  process (segment 7 + the schedule-tweets posters) and is deliberately NOT drawn inside the
  lanes (Mike, 2026-08-12 — matches the playbook: posting is out of scope for the repurpose
  lanes). No human gate exists between finish, the builds, and publish — established and
  doc-fixed 2026-08-12.
- Prereq: a graph node must spawn a headless remotion-builder (`claude -p` with the agent def)
  the way nodes spawn ffmpeg — the deferred Phase 2 capability — plus long-run node hardening
  (~90 min per build, per-branch resume) and the browser image stack (ports last).
- Bridge shipped 2026-08-12 (live-blessed on `johnny`): the finalized-short gate's BATCH
  FRONTIER footer (the completing builder's report hands the orchestrator the publish command)
  + `frontier`/`verify_frontier` entry nodes in the publish graph (renamed from built/verify_built same day at Mike's call: 'built' read like a build step on the flowchart; the progress.json phase string `7-built` is unchanged).
- **Vocabulary (same decision):** the repo-coined "judgment seam" is retired from live docs in
  favor of standard terms — **HITL / approval gate** (human) and **agent handoff**
  (advisor/builder artifacts); "interrupt" / "breakpoint" stays reserved for literal LangGraph
  pause-and-resume, which this pipeline deliberately does not use (decisions ride IN the next
  invocation). Dated ledger entries above keep the old word as historical record.

## Batch orchestrator BUILT (2026-09-10) — the Phase 2 supervisor over all three lanes

_Trigger: batch `kaspa`, 2026-09-09/10. The intake graph printed its LANE FRONTIER banner (the
2026-08-15 guardrail) and the session orchestrator still never invoked Lane 3; Mike found an empty
Social tab hours later. Advisory text cannot keep a lane from being forgotten; only a graph that
OWNS the DAG can. Mike: "we should not be in a situation where you forget to trigger a lane to
start" / "I don't want any problems like this happening again." Built the same day._

- **What:** `video-creation/livestream-repurpose/graph/batch_graph.py` + `run.py batch|lane3|status`.
  Segment 9 (`batch`) is the supervisor; segment 8 (`lane3`) is the Lane 3 wrapper it launches
  concurrently. Topology: `intake -> register -> launch_lane3 (detached process) -> lane2_select ->
  lane2_cut -> gate_4b -> lane2_tighten_plan -> lane2_tighten -> gate_2nd -> lane2_finish ->
  lane2_build -> lane2_publish -> join_lane3 -> verify_batch`. Lane 3 wrapper: `draft ->
  repurpose -> visual_qa`.
- **Rules kept:** wrap the blessed segments as subprocesses (each keeps its own checkpoint/resume),
  verify from disk (the segments' own phase strings: `cut`/`5B-desilenced`/`6-transcribed`/`7-built
  PASS`/shorts.json; `pipelines.repurpose=done`), halt topology, zero retries inside a lane (join
  relaunches a dead Lane 3 process ONCE per invocation), SQLite checkpoints (thread `batch-<b>`,
  stable per batch), `--stub ok|fail`, artifacts on disk are the contract, redo-safe nodes.
- **The deferred capability, now built:** judgment steps spawn HEADLESS CLAUDE AGENTS
  (`claude -p --agent <name> --dangerously-skip-permissions`, `CLAUDECODE` env stripped so a session
  can nest one) exactly like ffmpeg, then verify the agent's ARTIFACT from disk: clip-strategist
  -> clip-plan.json · tighten-strategist (groups of <=4 clips, part files merged + validated with
  `tighten_clips.validate_tighten_plan`) -> tighten-plan.json · NEW `lane3-drafter` (Fable/max) ->
  `<batch>-lane3-plan.json` validated by `queue_writer.validate_lane3_plan` · remotion-builder per
  clip (ThreadPool, `--max-builders`, stage locks inside) -> 7-built PASS · NEW `publish-meta-author`
  -> publish-meta.json · visual-qa -> report (non-fatal).
- **HITL = literal LangGraph interrupts, exactly two:** Mike's 4b review and 2nd review. The run
  ends with exit code 2 and prints the resume command; `--resume --approve 4b|2nd [--delete N,N]`
  applies deletes to clip-plan.json (numbers frozen) and records the approval in progress.json
  `gates` (so a fresh thread honours it). `--approve` on the first invocation pre-approves.
  Posting stays outside (batch-agnostic segment 7), per the 2026-08-12 decision.
- **Never-forget mechanics:** Lane 3 is fire-and-VERIFY (concurrent process, joined + relaunched,
  `verify_batch` refuses DONE without `pipelines.repurpose=done`); `--until <stage>` scopes Lane 2
  but Lane 3 is still awaited; EVERY segment report and `run.py status --batch <b>` print the BATCH
  LANES footer with "STILL PENDING: ..."; per-run briefs (`--lane3-brief`/`--clip-brief`) persist on
  the batches.json entry (`briefs`) so agents and resumes read the same words.
- **Known limitation:** one heartbeat file (`lane_progress.json`); concurrent Lane 3 segments and
  the supervisor overwrite each other's heartbeat. The run logs (`graph/data/batch-<b>.log`,
  `lane3-<b>.log`, `agent-*.log`) are authoritative.
- **Status:** stub ok/fail green for `batch` and `lane3`; `status` green on the live `kaspa` batch.
  **Live bless = batch `kaspa`** (2026-09-10): Lane 3 via the headless drafter + repurpose graph,
  Lane 2 tighten via the supervisor, stopping at the 2nd-review interrupt. Docs: root `CLAUDE.md`
  (Orchestrator status + quick command + hard rule), `playbooks/livestream-repurpose.md` banner,
  `.claude/commands/repurpose-livestream.md` rewritten around the graph.

### Same-day hardening from the kaspa live bless (2026-09-10)

- **Partial-append is now Lane 3's default** (`repurpose/lane3_batch.py` verify/queues/finalize +
  `graph/repurpose_graph.py`): a missing/invalid image holds back ONLY the entries that need it
  (recorded in `repurpose/output/<batch>-lane3-held.json`), everything else is appended, and
  `pipelines.repurpose` lands as `partial` (never `done`) until a re-run fills the gap. Trigger: two
  V4 carousel slides failed `no-capture` twice and 23 finished entries sat unqueued for hours
  (Mike: "this should have been done since the clips were being created").
- **Fresh-chat rotation on a failed capture**: `stage_generate` retires the purpose chat
  (`chat_pool.mark_dead`) and retries that ONE item in a fresh chat before counting a failure.
- **Incremental publish in the supervisor** (`batch_graph.lane2_publish`): stages every 7-built PASS
  clip not yet in shorts.json (never skips because "something is queued"), reuses the batch's
  first `--date`, and has publish-meta-author EXTEND `publish-meta.json` for uncovered clips. Status
  reads "n/N staged" until all are staged. Clip 4 shipped to review alone this way.
- **Build markers + runtime concurrency**: `lane2_build` writes `shorts/<b>/<slug>/.building.pid`
  per spawned builder, waits for (never re-spawns) clips with a live marker, verifies ALL surviving
  clips, and reads `--max-builders` / env `BATCH_MAX_BUILDERS` per run. Used live to raise kaspa
  to 3-wide under two already-running builders.
- **Open follow-ups**: (1) the repurpose generate stage opens/closes the ChatGPT Chrome once per
  SKIPPED item on a re-run (~40 s each; reads as flapping): pre-filter the list to missing images
  before launching the browser. (2) Lane 3 monitors must key on process liveness + the pipeline
  flag, not log text (fixed in-session, not yet codified). (3) One heartbeat file for concurrent
  lanes (known limitation, unchanged).

### kaspa live bless, part 2 (2026-09-10 afternoon): the ChatGPT capture chain, four real bugs

Six identical "no-capture" failures on two V4 carousel slides turned out to be four separate defects,
each found by a probe rather than a retry (retries burned ~3 hours; the probes took minutes):
1. **Enter no longer submits in a FRESH chat with an attachment** (send probe: composer still full,
   0 messages, no dialog, URL unchanged after 60 s). Fix in `gen_images.py`: verify the send
   (composer emptied) and click the send button if Enter did nothing; fail loudly if neither works.
2. **The reload-to-capture could leave the conversation**: `reload_url` fell back to
   `https://chatgpt.com/` when the fresh chat had not published its `/c/<id>` within 20 s, so the
   "reload" opened a NEW chat and orphaned the render. Fix: resolve the conversation id via the
   backend API (newest just-created conversation) and never navigate without a `/c/` URL.
3. **A restored draft + mid-text click spliced prompts**: ChatGPT restores an unsent draft; the click
   landed mid-text; keystrokes could be swallowed by the attachment re-render. Fix: clear the
   composer (Ctrl+A/Delete), settle 5 s after the upload, and VERIFY the composer holds the whole
   prompt before sending (3 attempts).
4. **The reference-byte check only compared against the item's OWN refs**, so a sibling item's
   exemplar (`version4/slide.png`, 1147x1303) was captured as a "render". Fix: reject a capture that
   matches ANY file under `images/reference/`.
Plus the capture path itself: **phase 2a reads the render through the backend API**
(`/backend-api/conversation/<id>` -> `image_asset_pointer` -> `/backend-api/files/<id>/download`)
before any reload; the probe proved renders exist server-side even when the DOM never shows them.
And a rule confirmed the hard way: **ChatGPT overrides authored figures on chart/data slides** (+68%,
+320% on four attempts, fresh chat or not). Per the SKILL's own V4 caveat, figure-bearing data slides
are now CODE-RENDERED (`repurpose/output/kaspa-lane3-fix/render_v4_slide.py`, HTML -> 1254x1254
PNG via Playwright, exact text); ChatGPT keeps the hook slide and the narrative/known-fact slides.
Also: `run.py batch --resume` on a thread killed mid-node hit `InvalidUpdateError` from the
checkpoint's own pending writes; a plain resume now passes no update, and a corrupted thread is
sidestepped with `--thread <new>` (every node re-derives its state from disk, both approved gates
included). Generate no longer halts the lane on partial image failures (verify/HELD decide).

## Longform-edited graph BUILT — Wave A (2026-09-17): the third automation

_Trigger: Mike, 2026-09-17: "I would like to work on getting this process into lang graph now that we
have implemented lang graph for the linkedin automation and for the live stream", with
`claudeisnaughty.md` as the backstory. First video through it: **kaspa-vprogs** (3:00, two FACE beats
in the opening). Python-first reaffirmed the same day: every JS lint the track still carries
(`lint-docset/covers/transition-assets/slide-balance/animated-charts.js`, `check-spine-fps.sh`) is
ported to Python at the moment its node is built, JS frozen as rollback; Remotion stays TS._

- **What:** `video-creation/longform-edited/graph/` — `longform_graph.py` (ONE 32-node StateGraph per
  video: pre-production → spine → plan → build → deliver), `run.py longform|status`, `common.py`
  (this automation's copy of the streaming / heartbeat / headless-agent / gate helpers, feed dir
  `graph/data/`), `scripts/init_project.py` (the §13a skeleton + PROJECT-LOG brief), NEW agent
  `.claude/agents/longform-edited/data-researcher.md` (DATA.md with sources). Dashboard: `longform`
  tab (five stage cards) + feed route in `serve_dashboard.py`.
- **Doctrine kept:** subprocess nodes verified from disk, halt topology, zero retries, SQLite
  checkpoints (thread `longform-<project>`), `--stub ok|fail`, headless agents (`claude -p --agent`,
  Fable-allowance fallback to Opus) with the ARTIFACT verified from disk, HITL gates = literal
  interrupts (exit 2, `--resume --approve <gate>`), approvals recorded in the project's
  `GRAPH-PROGRESS.json` so a fresh thread honours them.
- **Full-span from day one:** every step of the track is a node in the skills' order; un-automated
  steps are artifact-aware PLACEHOLDERS (interrupt with the how-to; pass silently once the §13/§13a
  artifact exists, or `--done <node>`). The frontier advances node by node, blessed on the live video.
- **Wave A built + tested:** init_project · research (data-researcher) · screenplay
  (screenplay-strategist, mechanical FACE-budget gate `--face-max`) · gate_screenplay ·
  await_recording · compress (`to_low_bps.py`) · verify_spine (fps 30/1 + A/V drift + words JSON).
  Stub ok/fail green (32 nodes traverse in order; a failure halts); real-mode mechanics green on a
  scratch project (skip-on-artifact, gate interrupt, approve-on-resume, `--done`, halt at compress
  with no raw take, fresh-thread approval honoured).
- **Next waves, in order of the video:** B = spine agents (defumbler / cover-blackout / desilencer /
  transcriber as headless nodes with the skills' parameters); C = plan (as-recorded + edit-plan
  authors, coverage / music / transition strategists, the asset fan-out with visual-qa, the
  BROLL-PLAN reconcile, `lint_docset.py` port); D = build (card-pause baking script, captions-builder,
  `comp-builder` agent with the six lints ported to Python inside `verify_comp`, render preflight +
  teardown); E = deliver (§12a definition of done, `longform_stage.py` / `longs_append.py` reuse).
- **First live GATE-1 finding (2026-09-17, kaspa-vprogs):** the strategist returned bare `[FACE]` tags
  instead of the backticked Convention-5 form (the gray chips Mike reads by); the node only COUNTED tags.
  Mike: "this is part of why we need to put this into LangGraph, so that we don't have deviations in every
  video we make" / "we need to make sure that there are standard rules and styles for how we do
  everything." Built the same hour: (1) `skills/doc-reference/lint_screenplay.py`, the format gate in code (tag form,
  one job per line, signposts, sections, no cold open, no em dashes, `--face-max`), run inside the
  `screenplay` node (`--fix` for the mechanical class, halt otherwise; validated against the kaspa 30bps +
  ethereum-rwa exemplars, only their genuine em dashes fail); (2) **`skills/doc-reference/`**, the durable
  canonical SHAPE of every per-video document (sibling of `container-reference/`; SCREENPLAY, DATA,
  PROJECT-LOG now, the rest as their nodes land) so no project folder is ever the reference; (3) the rule
  persisted in `screenplay.md` Convention 5 and both agent definitions. **The pattern for every later doc
  node: a reference SHAPE + a format OWNER (skill) + a code GATE at the node.**
- **Wave B BUILT + LIVE-BLESSED on kaspa-vprogs (2026-09-27):** the spine chain as headless agent
  nodes, each verified from disk (13a path + sidecar, duration direction, fps 30/1, A/V drift):
  `compress` (to_low_bps.py) · `defumble` (defumbler: 766 s → 532.8 s, 55/161 chunks dropped, 0 clipped)
  · `cover_blackout` (94% black, exactly the 2 FACE windows) · `desilence_coarse` (one zone 700 ms →
  219.6 s) · **`gate_spine_review`** (Mike listens; burst timestamps ride in as `--bursts a-b`) ·
  `burst_removal` (the hum after "softened on it." cut inside its troughs, join verified by Whisper) ·
  `desilence_final` (two-zone 250/500 ms → 211.1 s) · `transcribe` (transcriber, 79 segments) ·
  `verify_spine` · **`gate_spine`**. The two-pass practice (coarse review pass, then the tight pass) is
  now written into `longform-edited.md` Phase 3b. A content cut at the spine review (the podcast quote was
  recorded as "bullish") landed as `f.cut` per the letter chain; `final_spine()` takes the highest letter
  of any stage. No JS was ported here: the whole spine chain was already Python.
- **Wave C node 1 (2026-09-27): `as_recorded`** = NEW agent `.claude/agents/longform-edited/
  as-recorded-author.md` (opus/high; blackdetect FACE windows, timecode chain, beats quoted as spoken with
  KEPT / CHANGED / AD-LIB / DROPPED verdicts, mishears, divergences, flags) + NEW
  `skills/doc-reference/lint_as_recorded.py` + `skills/doc-reference/AS-RECORDED.reference.md`. Same shape as every doc
  node: reference SHAPE + format OWNER + code GATE.
- **Wave C node 2 + THE JS PORT (2026-09-28, Mike: "if there's any JavaScript to port over to Python, do
  that now"):** every remaining JS/shell gate in the track is now Python, parity-tested against the originals on
  three real comps (same exit codes, same findings), JS frozen as rollback: `lint_docset.py` (+ `--stage plan`),
  `lint_covers.py`, `lint_slide_balance.py`, `lint_transition_assets.py`, `lint_animated_charts.py`,
  `check_spine_fps.py`. The track's routing (`longform-edited/CLAUDE.md` 6b/6c) now names the Python gates.
  `coverage` is a real node: the `coverage-strategist` (Fable/max, Opus fallback) proposes; the node persists
  `COVER-PLAN.json` (agent-returned JSON contract), verifies it FROM DISK (schema · consecutive beats · every
  non-FACE second covered, no gap over 0.5 s · budget) and renders the canonical `BROLL-PLAN.md` worklists
  (Envato / ChatGPT with the mandatory Reference column / RECEIPTS / CHARTS / SLIDES / bench) + `EDIT-PLAN-prep.md`
  with NEW `scripts/render_cover_plan.py`. `lint_docset` is a real node (build stage). Budget knobs
  `--envato-max` / `--chatgpt-max` ride in the invocation.
  Live-blessed on kaspa-vprogs the same day: the strategist (Fable, 9.7 min) returned 34 beats / 8 receipts /
  4 Envato / 3 ChatGPT / 19 containers; the first verify caught two things the contract now states
  explicitly (a chapter title card is a ZERO-LENGTH beat, cover_type `title`; every ChatGPT row carries a
  `reference` key). A failed run is re-driven on a fresh thread (`--resume` only replays the failed checkpoint).
- **Skills folder restructure + reference harvest (2026-09-28, Mike):** `longform-edited/skills/` is now ONE
  FOLDER PER SKILL (`<name>/<name>.md` + its scripts/lints/references; index `skills/README.md`), matching
  `video-creation/skills/`; every path in the graph, the track router, the agents, the commands, the dashboard
  and memory was rewritten and the moved lints re-run from their new homes. `doc-reference/` now carries a
  reference for EVERY §13 document, the seven plan/build ones harvested from the completed `kaspa 30bps`
  (COVER-PLAN, BROLL-PLAN, EDIT-PLAN-prep, MUSIC-PLAN, EDIT-PLAN, CUE-SHEET, TRANSITIONS), so purging old
  project folders can no longer erase the shape of any document.
- **Wave C node 3, `music_plan` (2026-09-28):** the `music-placement-strategist` (Fable/max, Opus fallback)
  carves the beds off AS-RECORDED's chapter headers + the catalog's waveform analysis; the node persists
  `MUSIC-PLAN.json` and verifies it FROM DISK: every chapter has a bed, the beds cover the spine with at most a
  1 s breath (house rule #10), every source file exists, a bed shorter than its span MUST loop (the kaspa bed-A
  violation, now a code gate), level -24..-12 dB under VO, no em dashes; then `lint_docset.py --stage plan`
  proves the whole plan stage before GATE 3.
- **claudeisnaughty mapping:** order / skipped docs (#3, #4) = edges; paths + naming (#1) =
  `init_project` + `lint_docset`; dead gates (#14-16) = `verify_comp` runs every lint on every path;
  disk / temp (#9, #17) = render node preflight + teardown; serial I/O (#11) = the `assets` fan-out;
  "claimed work" (#6) = a node shows `running → artifact` on the dashboard or halts.
