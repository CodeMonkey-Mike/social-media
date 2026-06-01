# social-media — orchestrator routing table

_Auto-loaded every session. This is the **intent → command / where-to-look** map for the whole repo._
_For the human-facing overview see `README.md`; for why this file exists + the build plan see
`ORCHESTRATOR-PLAN.md`. Detail lives in `playbooks/` and each folder's own `SKILL.md`/`CLAUDE.md` —
**this file points, it does not duplicate. Canonical sources win on conflict.**_

## Pipeline (what feeds what)

```
livestream → transcribe → transcripts/<livestream>/
   ├─► repurpose/      → tweets / threads / IG & YT posts (+ images)
   └─► video-creation/ → vertical shorts (topics, captions, Remotion render)
                 both feed ↓
   schedule-tweets/  (queues: data/*.json) → post-*.js → X · IG · FB · TikTok · Rumble · BitChute · YT
```

## Capabilities → where to go

| You want to… | Read first | Playbook |
|---|---|---|
| Turn a transcript into tweet/thread/IG/YT drafts | `repurpose/SKILL.md` | `playbooks/repurpose.md` |
| Generate images for posts | `repurpose/SKILL.md` (image section) | `playbooks/image-gen.md` |
| Post pending queued content to a platform | `schedule-tweets/skills/SKILL.md` | `playbooks/posting.md` |
| Make/render a vertical short or AI-persona video | `video-creation/SKILL.md` · `video-creation/vertical-ai-persona/SKILL.md` | `playbooks/video.md` |
| Run the X reply-guy loop | `x-reply-guy/CLAUDE.md` | `playbooks/reply-guy.md` |

## Quick commands (one-liners)

Prefix every command with `cd C:\Users\mnede\Documents\Claude\social-media &&` (bash cwd does not persist).

| Task | Command / pointer |
|---|---|
| Start dashboard (port 8766) | `python schedule-tweets/scripts/serve_dashboard.py` → http://localhost:8766 · detail `schedule-tweets/skills/dashboard.md` |
| Count pending across all queues | see `schedule-tweets/skills/pending-social-posts.md` |
| Move a finalized render batch into the queue | `python scripts/publish-shorts.py <batch> [--date YYYY-MM-DD] [--dry-run]` · detail `video-creation/PUBLISH-SHORTS.md` |
| Lint queue data (persona/format) | `python scripts/persona-lint.py [--file <path>] [--fix]` |
| Recycle no-longer-needed assets | `node cleanup/cleanup.js --target all --dry-run` (ALWAYS dry-run first; targets: schedule-tweets / video-creation / all) · detail `cleanup/cleanup.md` |

## Global hard rules (authoritative copies live where cited — do not violate)

- **Sequential posting only** — never run two posting scripts in parallel, for any reason. (`schedule-tweets/skills/SKILL.md`)
- **One attempt per posting script** — if it seems stuck, READ THE LOG; never relaunch (shared Chrome profiles collide and kill the in-flight post).
- **No em dashes** in anything written to a queue file (titles/hooks/captions) — use comma/period/colon. (persona)
- **Never auto-retry a "failed" reply-guy entry** — it usually already posted; retry = duplicate. (`x-reply-guy/CLAUDE.md`)
- **Every image is unique** — never reuse an image_id/file across posts. (`repurpose/SKILL.md`)
- Edit `data/*.json` with **Node, never PowerShell `ConvertFrom/To-Json`** (mangles emoji).

## Persona
All voice / terminology / brand rules: **`persona/persona.json`** (single source of truth). Read before drafting any content.

## Orchestrator status
**Phase 1** — this routing table + `playbooks/`, human-driven (Mike says which skill runs next). Spawnable
DAG automation is **deferred to Phase 2**; do not create or edit `.claude/agents/` for this. See `ORCHESTRATOR-PLAN.md`.
