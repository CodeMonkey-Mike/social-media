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

> **Canonical since 2026-08-04 (LangGraph Wave 2):** the Phase 4 cut exec is ONE graph invocation —
> `python video-creation/livestream-repurpose/graph/run.py cut --batch <batch>` — run AFTER the
> clip-strategist's `clip-plan.json` lands in `video-creation/shorts/<batch>/` (the judgment seam).
> It cuts every planned clip, builds the canonical dashboard, registers the batch, and ENDS at
> Mike's Phase 4b review. Phases 5+ continue manually until Waves 3-6 port them.
Publish hands off via **`/publish-shorts`**, which writes `schedule-tweets/data/shorts.json`. Shows on the
**Shorts** tab.
- **Canonical detail:** `video-creation/SKILL.md` (Phases 1B–8) + `video-creation/PUBLISH-SHORTS.md`.
- **Playbook:** `playbooks/video.md`.

## Lane 3 — Repurpose (text / image)
Runs off **lane 2's transcript** (`livestream-repurpose/transcripts/<name VERTICAL>/..._plain.txt`,
registered in `batches.json`) → tweets / one-liners+images / threads / X polls / YT polls / YT posts /
IG single-image → `schedule-tweets/data/*.json` (`x-tweets`, `x-threads`, `x-polls`, `yt-posts`,
`yt-text-polls`, `ig-single-image`). Images via `repurpose/gen-batch.js` (persistent chat, every image
unique).
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
