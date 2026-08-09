# Playbook: livestream repurpose (the 3 lanes)

**Trigger:** "I have a new livestream to repurpose", "repurpose the stream", or a fresh recording
landing in `video-creation/livestream-repurpose/media/<name>/`.
**What this is:** the umbrella map. One livestream fans out into **three independent lanes** that all
converge in `schedule-tweets/`. This file points; canonical detail lives where cited and **wins on conflict.**

## The branch point — LOW BPS

Everything starts with **Phase 1 Step 1** in `video-creation/SKILL.md`: the high-bitrate source recording
is re-encoded down to a small **`LOW BPS`** working copy (the pipeline master). The `LOW BPS` token is
load-bearing — every downstream artifact is named off it. From that single file, three lanes branch.

> **Canonical since 2026-08-02 (LangGraph Wave 1):** the whole Phase 1 → Phase 2 span (LOW BPS +
> Lane 1 longform + verticalize + transcribe + STT glossary) is ONE graph invocation —
> `python video-creation/livestream-repurpose/graph/run.py --source "<recording>" --min-sil 0.5`
> (author `longform-meta.json` next to the recording first). Lanes 2 (from Phase 3) and 3 then
> continue off the produced transcript exactly as below. Live state shows on the dashboard's
> **LangGraph → Livestream** tab. Detail: `intake-verticalize/SKILL.md` banner.

```
livestream recording
   └─► Phase 1 Step 1: re-encode → "<name> LOW BPS.mp4"  (the master)
          ├─►(1) long-form   — forks straight off LOW BPS (no transcript needed)
          ├─►(2) vertical shorts — verticalize LOW BPS, then transcribe
          └─►(3) repurpose    — runs off lane 2's transcript
                        all three converge ↓
          schedule-tweets/ (data/*.json) → post-*.js → X · IG · FB · TikTok · Rumble · BitChute · YT
```

## Lane 1 — Long-form video
**Branches directly off the LOW BPS file, before any verticalizing.** Runs inside the intake graph:
canonical desilencer (`desilence.py --nvenc`, one pass, ~0.7 Mbps direct — no crf-18 intermediate) →
stage the mp4 + its PNG thumbnail into `schedule-tweets/longform/<slug>/` (no-spaces slug, one folder
per long-form) → append an entry to `schedule-tweets/data/longs.json` (title/description/tags come
from `longform-meta.json`, authored before the run). **Queue-only** — this desilenced derivative does
NOT feed verticalize / clip selection. Shows on the dashboard **Longs** tab.
- **Canonical detail:** `video-creation/livestream-repurpose/skills/intake-verticalize/SKILL.md`
  (Phase 1 Step 1 + the graph banner).

## Lane 2 — Vertical shorts
**Step 1B** verticalizes the LOW BPS master (16:9 → 9:16, face bottom + content top) → transcribe the
vertical (Phase 2) → find topics, 90s chunk-and-group (Phase 3) → clip selection (4) → review dashboard
(4b) → tighten (5) → silence removal (5B) → Whisper captions (6) → Remotion render (7) → publish (8).

> **Canonical (LangGraph Waves 2-5): every mechanical Lane 2 segment is ONE graph invocation**
> (`run.py` = `video-creation/livestream-repurpose/graph/run.py`); each starts after its judgment
> seam lands on disk and ends at the next gate:
> - **cut** (Wave 2, blessed 2026-08-04): `python run.py cut --batch <batch>` — after the
>   clip-strategist's `clip-plan.json` lands; ends at Mike's 4b review.
> - **tighten + 5B** (Wave 3, blessed 2026-08-06): `python run.py tighten --batch <batch>
>   --min-sil N` — after Mike's 4b verdicts + the tighten-strategists' `tighten-plan.json`;
>   min-sil = Mike's per-batch knob; ends at his 2nd review.
> - **finish = 5C + 6 + render-assets** (Wave 4, built 2026-08-07): `python run.py finish
>   --batch <batch>` — ONLY after Mike's 2nd review (the invocation is his approval record);
>   optional `filler-plan.json` = the adjudicated 5C spans (absent = passthrough); ends at the
>   builder frontier with -final spines, whisper-words, and GOP-safe staged render-assets.
> - **Phase 7 stays agent territory**: remotion-builder per clip (BROLL-PLAN, ChatGPT b-roll,
>   comp, SFX, render, gate) — the browser image stack ports LAST.
> - **publish** (Wave 5, built 2026-08-07): `python run.py publish --batch <batch> --date D` —
>   ONLY after Mike gates the renders AND authorizes publish, with `publish-meta.json`
>   (hook/caption/tags) authored first. Stages the queue + md5-verifies + persona-lints;
>   POSTING stays Mike-gated and sequential.
Publish hands off via **`/publish-shorts`**, which writes `schedule-tweets/data/shorts.json`. Shows on the
**Shorts** tab.
- **Canonical detail:** `video-creation/SKILL.md` (Phases 1B–8) + `video-creation/PUBLISH-SHORTS.md`.
- **Playbook:** `playbooks/video.md`.

## Lane 3 — Repurpose (text / image)
Runs off **lane 2's transcript** (`livestream-repurpose/transcripts/<name VERTICAL>/..._plain.txt`,
registered in `batches.json`) → tweets / one-liners+images / threads / X polls / YT polls / YT posts /
IG single-image → `schedule-tweets/data/*.json` (`x-tweets`, `x-threads`, `x-polls`, `yt-posts`,
`yt-text-polls`, `ig-single-image`).

> **Canonical (LangGraph Wave 6, built 2026-08-09): the mechanical half is ONE graph invocation.**
> DRAFTING stays judgment in the Claude session (topics, fact-check, all copy, image prompts —
> per `repurpose/SKILL.md`), and lands on disk as **`repurpose/output/<batch>-lane3-plan.json`**.
> Then: `python run.py repurpose --batch <batch>` — generates every image via the ported Python
> browser stack (`repurpose/gen_images.py` + `chat_pool.py`/`chat_delete.py`, pool-managed chats,
> `chatgpt` stage lock, one item per invocation), verifies them (dims/dup/bytes), appends the six
> queues idempotently (`queue_writer.py`), persona-lints each touched file, and flips
> `batches.json pipelines.repurpose=done`. Visual-QA the images after the run; Mike reviews the
> pending entries on the :8766 Social tab. Hard gates in the plan validator: em dashes, chart
> emojis, image-id uniqueness, IG = Kaspa ONLY, X polls = Kaspa/TAO/Toncoin ONLY, threads 5-8.
> The JS twins (`gen-images.js`/`chat-pool.js`/`chat-delete.js`) are FROZEN rollback.
- **Canonical detail:** `repurpose/SKILL.md`.
- **Playbooks:** `playbooks/repurpose.md` · images `playbooks/image-gen.md`.

## Branch tracking — `batches.json`
The repo-root registry tracks lanes **2 and 3** per batch via the `pipelines` keys
(`shorts`, `repurpose`) — flip each to `"done"` when its lane finishes. **Lane 1 (long-form) is queued
inline during Phase 1 itself**, so it has no `pipelines` key; it's done when the `longs.json` entry exists.

## Watch for
- **Lane 1 forks off the LOW BPS file; lanes 2 and 3 both depend on verticalize + transcribe first** —
  so lane 3 hangs off lane 2's transcript, not off the raw LOW BPS file.
- Keep the long-form **small** (~0.7 Mbps) — never queue the crf-18 desilence intermediate.
- Convergence point is `schedule-tweets/`; **posting** (cadence/order) is a schedule-tweets decision —
  see `playbooks/posting.md`, out of scope for the repurpose lanes themselves.
