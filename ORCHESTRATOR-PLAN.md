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
  **judgment seams** — one graph per MECHANICAL SEGMENT; a segment ends where an advisor
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
