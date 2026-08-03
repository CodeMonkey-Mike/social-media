# livestream-repurpose — PROJECT LOG

_Running history for the livestream-repurpose pipeline + its LangGraph migration.
Newest entry first. Update after every significant run. (Pattern borrowed from
linkedin-automation/PROJECT-LOG.md.)_

---

## 2026-08-02 — Wave 1 intake graph: built, committed, LIVE-BLESSED (with findings) on `what-if-1000x`

**Migration status:** Wave 1 (intake: Ph1 LOW BPS + Lane 1 longform + 1B verticalize + Ph2
transcribe/glossary/derivatives) is BUILT and committed (`a653faf`). Full plan + wave order:
`ORCHESTRATOR-PLAN.md` §"Livestream-repurpose migration plan (2026-08-02)". Canonical invocation:

```
python video-creation/livestream-repurpose/graph/run.py --source "<recording>" --min-sil 0.5
```
(prereq: `longform-meta.json` next to the recording; `--resume` after a kill; `--stub ok|fail`;
`--test-sandbox` for scratch runs; dashboard tab: LangGraph → Livestream on :8766)

### Live bless results (batch `what-if-1000x`, 65.8-min stream)

- **BLESSED live in the graph:** `encode` + `verify_encode` (66 min → 320 MB @ 0.81 Mbps,
  rename housekeeping fired correctly), and the halt topology (it caught a real failure).
- **THE FINDING — canonical desilencer stalled on hour-long files.** `desilence.py`'s render
  built ONE filtergraph with ~1,756 trim branches for 878 keep-spans → ffmpeg pegged a single
  core, ~17% output in ~110 min (hours to finish). Detection method was NEVER the problem.
  Root cause of the historical `longform_desilence_<batch>.py` forks: earlier sessions hit this
  wall and swapped the whole tool (including the banned single-threshold detection) instead of
  fixing the render transport.
  **FIXED same night in `desilence.py` (method untouched):** above 60 spans the render runs in
  seek-windowed batches (identical spans + 8 ms declick fades, parts stream-copy concatenated;
  `--render-batch N` to force, auto otherwise; small files keep the byte-identical single-pass).
  Validated vs single-pass reference (56.81s vs 56.79s = one AAC frame), then **proved live**:
  the same file that stalled for 2 h rendered in ~10 min (22 parts, 3945s → 2674s, -21.2 min
  of silence at min-sil 0.5). Also fixed: `desilence.py` stdout is now line-buffered (its
  progress used to buffer silently → the graph heartbeat looked stale during long renders).
- **Lane 1 DONE via the fixed renderer** (ran as a supervised driver after the stall recovery):
  staged `schedule-tweets/longform/what-if-1000x/` (44.6 min, 271 MB, 0.81 Mbps) + queued
  `lf-20260802-what-if-1000x` "What If We Could 1000x?" — **thumbnail NULL** (no PNG shipped in
  the media folder; Mike to drop one in, then patch the entry).
- **Ran OUTSIDE the graph** (manual driver, to recover wall-clock after the stall):
  verticalize (1080x1920 SAR 1:1 probe OK) + whisper (9,374 words / 44 chunks) + glossary
  (10 Casper→Kaspa, 2 tau→TAO, zero KRC20 flags) + parse/chunk. So the `longform`→`derive`
  graph nodes are NOT yet live-blessed end-to-end — **next stream runs the whole graph again
  for the full bless.**

### Wave 1 lessons → fold into Wave 2

1. **Lane 1 must be a parallel branch** (or last): the sequential graph put the longform render
   ahead of verticalize/transcribe and blocked the clips path for 2 h when it stalled.
2. Long-running node subprocesses must line-buffer (or be wrapped) so the heartbeat never
   starves; heartbeat staleness ≠ hang, but it must never be ambiguous.
3. Tool-timeout kills mid-generation leave in-flight browser work — detached launches with
   log/heartbeat monitors (the pattern used tonight) are the way to drive anything long.

### Batch `what-if-1000x` state (registered in batches.json, status active)

| Lane | State |
|---|---|
| Lane 1 longform | **QUEUED** (`lf-20260802-what-if-1000x`, thumb null — needs Mike's PNG) |
| Lane 2 shorts | **8 clips CUT, dashboard awaiting Mike's Phase 4b review** → `video-creation/shorts/what-if-1000x/dashboard.html` (5 topics; clips 1-5 long/solo 88-125s, clips 6-8 impact cuts 15-34s; STT caption fixes listed in `clip-plan.json` → `stt_garble_flags`) |
| Lane 3 text/image | **DONE except carousels** (see below); `pipelines.repurpose` deliberately still `pending` |

Lane 3 queued tonight: 6 X tweets (4 multi-line + 2 one-liners, all with QA'd images incl.
the `what-if.jpg` + `bittensor-tao.png` + `housecoin.webp` references) · 1 IG 4:5 companion
(TAO/KAS) · 2 YT text polls (October-bottom, KAS-vs-TAO) · 1 X poll (KAS-vs-TAO only; the
October poll is YT-only per the X topic filter) · 2 YT posts (~2.0k chars: whatif-vs-pepe,
1000x-math) · 2 threads (7 + 6 tweets, CTA-capped). Drafts in `repurpose/output/2026-08-02_*`.

### TOMORROW — pickup checklist (in order)

1. **Finish the carousels** (~15 min): item files at
   `video-creation/shorts/what-if-1000x/_lane3-carousel-items/l3-car-02..10.json`
   (Post A = v1 news-flash slides 01-05, Post B = v4 hook+data slides 06-10; slide 01
   `d948d2f0` already generated + on disk). **Slide 02 (`b6795e2f`) was in flight when the
   run was stopped — check the yt-posts pool chat for an already-finished image BEFORE
   re-sending (never double-generate).** Then per file:
   `node repurpose/gen-images.js --list=<file> --prefix=yt-posts` (one item per invocation —
   references attached).
2. **Wire `images[]`** onto the two yt-posts entries from
   `_lane3-carousel-items/l3-car-meta.json` (image_id/seq/slide_text mapping), spot-QA 2-3
   slides visually.
3. **Flip `pipelines.repurpose` → "done"** on `what-if-1000x` in batches.json.
4. **Mike's Phase 4b review** → delete calls by clip number → then per surviving clip:
   tighten-strategist → tighten → 2nd review → 5B desilence → (5C) → 6 captions →
   7 remotion-builder → 8 publish. (Normal manual flow; Waves 2-6 port these next.)
5. **Next livestream = full intake-graph bless attempt** (all nodes, no manual driver).
6. Follow-ups: Mike's longform thumbnail PNG (then patch `thumbnail_path`); $WHATIF X handle
   unknown → add to `persona.json` `project_handles` when known (Follow-line omitted tonight).

---

## 2026-08-02 (earlier) — Wave 1 built + sandbox-blessed

Ports: `encode_low_bps.py`, `verticalize.py` (skill ffmpeg frozen verbatim),
`longform_stage.py` (canonical desilencer, forks retired per Mike), `longs_append.py`
(replaces `_lane1_*.js`; em-dash + dup-id guards, `--if-absent` resume), 
`fix_transcript_glossary.py` (deterministic tier auto-fix; kaspy/kasy/kappy/kasper FLAG-only).
Graph: `graph/intake_graph.py` + `run.py` (12 nodes, verify-from-disk, halt topology, SQLite
checkpoints, stubs, sandbox). Dashboard: Livestream tab + `/livestream/` feeds (generic
multi-node focus graph added to langgraph.html). Sandbox e2e on 60s real audio: green; the
glossary caught a live Casper→Kaspa mishear on its first run; one bug found+fixed
(longs_append staged-root derivation + thumbnail cross-check in verify_queue).
Commit `a653faf`. Decisions of record (Mike): documented desilencer for Lane 1 · ChatGPT
browser stack ports LAST · one wave per real stream, port-first-then-graph.
