# social-media — orchestrator routing table

_Auto-loaded every session. This is the **intent → command / where-to-look** map for the whole repo._
_For the human-facing overview see `README.md`; for why this file exists + the build plan see
`ORCHESTRATOR-PLAN.md`. Detail lives in `playbooks/` and each folder's own `SKILL.md`/`CLAUDE.md` —
**this file points, it does not duplicate. Canonical sources win on conflict.**_

## Pipeline (what feeds what)

A livestream re-encodes to a `LOW BPS` master, then fans out into **3 lanes** (full map: `playbooks/livestream-repurpose.md`).

```
livestream → Phase 1: re-encode → "LOW BPS" master  (video-creation/SKILL.md)
   ├─►(1) long-form   : desilence LOW BPS → schedule-tweets/longform/ → data/longs.json   (off LOW BPS)
   ├─►(2) vertical shorts: verticalize → transcribe → clip/caption/render → data/shorts.json
   └─►(3) repurpose   : (lane 2's) transcript → tweets / threads / IG & YT posts (+ images) → data/*.json
                 all three feed ↓
   schedule-tweets/  (queues: data/*.json) → post-*.js → X · IG · FB · TikTok · Rumble · BitChute · YT
```

## Capabilities → where to go

| You want to… | Read first | Playbook |
|---|---|---|
| Repurpose a whole livestream (the 3 lanes, end to end) | `playbooks/livestream-repurpose.md` | `playbooks/livestream-repurpose.md` |
| Turn a transcript into tweet/thread/IG/YT drafts | `repurpose/SKILL.md` | `playbooks/repurpose.md` |
| Generate images for posts | `repurpose/SKILL.md` (image section) | `playbooks/image-gen.md` |
| Post pending queued content to a platform | `schedule-tweets/skills/SKILL.md` | `playbooks/posting.md` |
| Make/render a vertical short or AI-persona video | `video-creation/SKILL.md` · `video-creation/vertical-ai-persona/SKILL.md` | `playbooks/video.md` |
| Source stock video b-roll (Envato Elements) | `video-creation/skills/envato-broll/SKILL.md` | `playbooks/video.md` |
| Make a longform 16:9 video (slide presentation OR heavily-edited) | `video-creation/longform-presentation/longform-presentation.md` (frozen, slide-deck) · `video-creation/longform-edited/longform-edited.md` (evolving, edit-driven) | `playbooks/video.md` |
| Defumble a recording (remove false starts/retakes, no clipped words) | `video-creation/skills/defumbler/defumbler.md` (canonical, track-agnostic) | `playbooks/video.md` |
| Desilence / tighten pacing (remove silence, rapid-fire) | `video-creation/skills/desilencer/desilencer.md` (canonical, track-agnostic; ALL tracks use it) | `playbooks/video.md` |
| Run the X reply-guy loop | `x-reply-guy/CLAUDE.md` | `playbooks/reply-guy.md` |

## Quick commands (one-liners)

Prefix every command with `cd C:\Users\mnede\Documents\Claude\social-media &&` (bash cwd does not persist).

| Task | Command / pointer |
|---|---|
| Start dashboard (port 8766) | `python schedule-tweets/scripts/serve_dashboard.py` → http://localhost:8766 · detail `schedule-tweets/skills/dashboard.md` |
| Count pending across all queues | see `schedule-tweets/skills/pending-social-posts.md` |
| Move a finalized render batch into the queue | `python scripts/publish-shorts.py <batch> [--date YYYY-MM-DD] [--dry-run]` · detail `video-creation/PUBLISH-SHORTS.md` |
| Lint queue data (persona/format) | `python scripts/persona-lint.py [--file <path>] [--fix]` |
| Refresh the Topic Radar dashboard (topic finding) | `node video-creation/topic-radar/build-dashboard.js` → open `video-creation/topic-radar/dashboard.html` · full procedure `video-creation/TOPIC-FINDING-PLAYBOOK.md` §Topic Radar |
| Recycle no-longer-needed assets | `node cleanup/cleanup.js --target all --dry-run` (ALWAYS dry-run first; targets: schedule-tweets / video-creation / all) · detail `cleanup/cleanup.md` |
| Defumble a recording (map its takes) | `python video-creation/skills/defumbler/scripts/chunk_map.py "<recording>"` → read `<name>._chunkmap.txt` · full procedure `video-creation/skills/defumbler/defumbler.md` |
| Desilence a recording (tighten pacing) | `python video-creation/skills/desilencer/scripts/desilence.py "<defumbled>" --out "<out>" --split 18 --sil-pre 0.25 --sil-post 0.5` · full procedure `video-creation/skills/desilencer/desilencer.md` |
| Remove ONE anomalous sound burst (throat-clear/cough/click between two words) | `python video-creation/skills/burst-removal/scripts/burst_profile.py "<file>" <start> <end>` to find the silence troughs, then cut end-of-word-A → start-of-word-B · full procedure `video-creation/skills/burst-removal/burst-removal.md` |

## Global hard rules (authoritative copies live where cited — do not violate)

- **Sequential posting only** — never run two posting scripts in parallel, for any reason. (`schedule-tweets/skills/SKILL.md`)
- **One attempt per posting script** — if it seems stuck, READ THE LOG; never relaunch (shared Chrome profiles collide and kill the in-flight post).
- **YouTube Shorts are posted via the API ONLY** (`scripts/post-yt-short-api.js`). There is **NO Playwright/browser fallback** — do NOT use `post-yt-short.js`, do NOT re-encode to dodge an upload-size limit, do NOT improvise. If the API fails (e.g. `invalid_grant` = expired OAuth token, which needs Mike to re-auth), mark it failed and **report it at the end of the run.** A failed step is reported, never worked around. (`schedule-tweets/skills/yt-post-vertical.md`)
- **No em dashes** in anything written to a queue file (titles/hooks/captions) — use comma/period/colon. (persona)
- **Never auto-retry a "failed" reply-guy entry** — it usually already posted; retry = duplicate. (`x-reply-guy/CLAUDE.md`)
- **Every image is unique** — never reuse an image_id/file across posts. (`repurpose/SKILL.md`)
- **Seedance video = 480p ONLY, never higher — HARD RULE, no exceptions.** Every Higgsfield Seedance generation (`seedance_2_0`: image-to-video, talking-head, lip-sync, AND every test/probe/throwaway) MUST pass `--resolution 480p`. Never omit it (the model default is higher) and NEVER use 720p or 1080p. Remotion upscales 480p → 1080×1920 for FREE, so higher res buys nothing and only burns credits: 480p=33cr vs 720p=49cr vs 1080p=99cr. 720p tests already drained most of a balance once (2026-06-15). If a single finished clip genuinely needs more detail, STOP and get Mike's explicit OK first. (`video-creation/vertical-ai-persona/SKILL.md` §3)
- Edit `data/*.json` with **Node, never PowerShell `ConvertFrom/To-Json`** (mangles emoji).
- **Defumble ONLY via `video-creation/skills/defumbler/defumbler.md`** — never cut fumbles from a whole-file Whisper transcript or word timestamps (it HIDES retakes and DRIFTS → missed fumbles + clipped words; failed silverscript 3x). Always: chunk-map → cut only inside silence → get Mike's text cut-plan approved BEFORE rendering. `detect_fumbles.py`/`audit_coverage.py` are diagnosis only.
- **Desilence ONLY via `video-creation/skills/desilencer/desilencer.md`** (the ONE tool, `desilence.py`, every track) — NEVER write a new silence script or use single-threshold `silencedetect` (it clips words / misses clean pauses). Detection is dual-threshold RMS (silence <−57 dB, audio >−52 dB) + 8 ms declick; those thresholds are the fixed method, the **min-silence duration is the only knob**. Defumble first (separate step), then desilence the master.

## Persona
All voice / terminology / brand rules: **`persona/persona.json`** (single source of truth). Read before drafting any content.

## Orchestrator status
**Phase 1** — this routing table + `playbooks/`, human-driven (Mike says which skill runs next). Spawnable
DAG automation is **deferred to Phase 2**; do not create or edit `.claude/agents/` for this. See `ORCHESTRATOR-PLAN.md`.
