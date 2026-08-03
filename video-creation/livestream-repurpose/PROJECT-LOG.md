# livestream-repurpose — PROJECT LOG

_Running history for the livestream-repurpose pipeline + its LangGraph migration.
Newest entry first. Update after every significant run. (Pattern borrowed from
linkedin-automation/PROJECT-LOG.md.)_

---

## 2026-08-03 (later) — `what-if-1000x` BATCH COMPLETE: all 7 shorts built, gated and queued

All three lanes are now done. **7 shorts built through Phase 7 and queued** (`wi1-20260803-*`, staged to
`schedule-tweets/shorts/what-if-1000x-2026-08-03/`, all 7 platforms `pending`, every staged md5 matching
its render, persona-lint clean). Longform thumbnail staged and `thumbnail_path` patched. `batches.json`
→ `shorts: done`, `repurpose: done`.

| n | short | final | b-roll | SFX |
|---|---|---|---|---|
| 1 | 1000x-math-ten-coins | 73.6s | 32.1% | 21 |
| 2 | whatif-100x-bigger-than-brett | 74.0s | 31.5% | 19 |
| 3 | october-bottom-self-defeating | 59.3s | 29.7% | 12 |
| 4 | lab-called-20x-did-353x | 61.3s | 32.8% | 11 |
| 5 | whatif-next-dogecoin | 64.8s | 31.4% | 16 |
| 6 | 1000x-math-ladder-impact | 24.3s | 33.6% | 11 |
| 7 | whatif-100x-impact | 12.6s | 33.8% | 6 |

### THE INCIDENT — 7 parallel builders all killed at once, and a 200-minute lock wedge

The first fleet of 7 `remotion-builder` agents was killed mid-run by an **API session limit**. No defect
in their work, but two consequences worth institutionalizing:

1. **Dead agents left both stage locks HELD** (`chatgpt` 208 min, `render` 200 min). `stage_lock.py`
   auto-breaks at 90 min, but only on a NEW acquire attempt, and the three blocked builders had already
   entered their poll loop and never re-evaluated. Net effect: clips 1/4/5 spent their entire lives
   queued behind a corpse and generated **zero** b-roll. Locks had to be cleared by hand.
2. **Relaunching in waves of 3 beat relaunching all 7**, purely for blast radius. Builders were handed a
   verified on-disk inventory and told to RESUME (verify + finish), never to regenerate an existing
   image. Zero images were regenerated across the whole recovery.

### Findings the builders surfaced (all now in `progress.json`)

- **`clip-plan.json` `stt_garble_flags` DO NOT all survive into the per-clip Whisper-medium transcripts.**
  They were derived from the original master transcript. Clip 3 found two flagged garbles that did not
  exist at all ("I'm sell", "phone moment"); clip 4 **rejected two orchestrator-authored fixes as wrong
  against the audio** with 3 isolated Whisper passes each ("i had **it** listed", not "had LAB listed";
  "**that's** crazy", not "it's crazy") and corrected them at source in `build_captions.py`. **Every
  builder must verify a flagged garble against its OWN whisper-words.json before applying it.**
- **Desilenced spines ship a 250-frame GOP with B-frames** → Remotion's 8 concurrent `OffthreadVideo`
  seeks fail intermittently with `No frame found at position N` and kill the render mid-way (clip 6, at
  frame 565). Fix: re-encode the **render-assets copy only** to a seek-friendly GOP
  (`-g 25 -keyint_min 25 -bf 0 -sc_threshold 0`); the canonical spine is never touched.
- **A sub-EPS gap does NOT hard-cut two adjacent b-roll beats** (clip 4): `BrollLayer`'s adjacency window
  only suppresses the FADES, `findIndex` still returns -1 across the gap, so the base flashes for a few
  frames. **Butt the windows exactly (`tOut === tIn`).**
- **A closing beat whose `tOut` sits exactly at the comp end ghosts** (clip 2): its fade-out plays over
  the last frames and dissolves the artwork back onto Mike's face. Park `tOut` past the final frame.
- **Whisper-verifying the FINAL MIX earned its keep, twice.** Clip 1: a 0.38-gain whoosh was swallowing
  the payoff word "pop" (swept to 0.20 until it returned; the payoff impact itself was never lowered).
  Clip 5, worse: the two cover-cut whooshes were masking **the token's own name** ("the WHAT IF"
  transcribing as "the 1F"); 0.46/0.32/0.26/0.24 all still failed, 0.22 restored it, and the clip was
  re-rendered. **A cue that masks the VO is a build defect, not a mixing taste call.**
- **Persona inspection is a platform-safety gate too** (clip 5): the generated climax statue came back
  front-facing with explicit anatomical detail, a moderation risk on IG/TikTok/YT. Fixed with a localized
  tone-matched smoothing of a 76x88 px region in place, no regeneration and no beat remap.

### Open for Mike

- Caption judgment calls: clip 2 "in december of 2024, not **2020**" (3 passes agree, plan expected 2025)
  and "i'll be crazy"; clip 4 "**it** was just nuts" (isolated pass still hears "I", but "I was just nuts"
  reads as self-deprecating). All vetoable in one token each.
- **BATCH-WIDE: integrated loudness ~-17 LUFS**, under the -14 social norm, inherited from the spines and
  NOT introduced by the builds. One normalization decision across the batch if he wants it raised.
- Clip 1 carries the two longest no-image stretches (13.1s over the $913.63K Housecoin CMC page, 16.9s
  over the LAB page). Both deliberate receipts, both badge-carried; pacing worth his eye.
- Clip 5's closing caption ships as "lists what if, right?". Every 1x Whisper pass hears "...Robin Hood
  lists WHAT IF, right?"; only time-stretched passes hear "run it". The orchestrator-supplied fix
  ("lists it and it runs") would have REPLACED the "what if" every pass hears, so it was rejected and
  the rule deleted from `build_captions.py`. Override only from the livestream itself.

> **Publish-time note:** clip 5 was queued while its builder was still running, then its report revealed
> a post-QA re-render. The staged copy was re-md5'd against the final render and MATCHED (the re-render
> landed before the publish), so nothing was stale. **All 7 staged copies verified against their FINAL
> renders.** This is the 2026-07-23 hazard and the md5 sweep is what makes publishing-before-every-report
> survivable: nothing posts until Mike runs a poster, so a stale stage is always recoverable.

---

## 2026-08-03 — `what-if-1000x`: Lane 3 carousels DONE + Phase 4b verdict executed (clip 8 deleted, 1-7 tightened + desilenced)

**Lane 3 finished.** The two YT carousels are complete: slide 02 (`b6795e2f`) was recovered from
the yt-posts pool chat (it HAD finished server-side when the 2026-08-02 run was stopped — probed the
chat read-only, downloaded, never re-sent), slides 03-10 generated via `gen-images.js` one item per
invocation (pool chat now 20/25). All 10 spot-QA'd clean. `images[]` wired onto
`yt-post-2026-08-02-whatif-vs-pepe` (Post A) + `yt-post-2026-08-02-1000x-math` (Post B) from
`l3-car-meta.json`; persona-lint clean on both (28 flags in file are all pre-existing posted
entries). `batches.json` → `pipelines.repurpose: "done"`.

**Phase 4b verdict (Mike): delete clip 8, keep 1-7.** `october-90-percent-impact/` folder removed;
survivors keep their frozen numbers.

**Phase 5 + 5B run (per Mike, 2nd review moved after desilence).** 7 tighten-strategist agents
(one per clip, parallel) authored `tighten-plan.json`; new per-batch script
`scripts/tighten_clips_whatif1000x.py` (modeled verbatim on the October-pumps reference: master-
absolute cuts, 8 ms declick, voiced-content ceiling gate vs Whisper words, canonical
`delete_silences.py` on a copy) executed it. All 7 clips passed the 15% voiced ceiling:

| n | clip | raw → final | voiced cut |
|---|---|---|---|
| 1 | 1000x-math-ten-coins | 102.5s → 73.6s (-28.3%) | -14.6% |
| 2 | whatif-100x-bigger-than-brett | 124.2s → 73.9s (-40.5%) | -14.1% |
| 3 | october-bottom-self-defeating | 87.8s → 59.2s (-32.7%) | -12.9% |
| 4 | lab-called-20x-did-353x | 90.3s → 61.2s (-32.2%) | -13.2% |
| 5 | whatif-next-dogecoin | 101.5s → 64.8s (-36.2%) | -10.6% |
| 6 | 1000x-math-ladder-impact | 33.9s → 24.2s (-28.7%) | -10.1% |
| 7 | whatif-100x-impact | 20.4s → 12.6s (-38.4%) | -12.3% |

Dashboard rebuilt IN PLACE with the tightened+desilenced clips → **awaiting Mike's 2nd review**;
only then 5C (optional) → captions → remotion-builder → publish. Extra caption-time STT fixes
surfaced by the strategists are in `tighten-plan.json` notes (clip 4: "had LAB listed", "off of
LAB"; clip 1: ~3171.3 "your plays").

**Still open:** Mike's longform thumbnail PNG (`lf-20260802-what-if-1000x` thumb still null) ·
$WHATIF X handle for `persona.json`.

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
