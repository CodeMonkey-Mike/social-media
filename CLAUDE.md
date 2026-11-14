# social-media — orchestrator routing table

_Auto-loaded every session. This is the **intent → command / where-to-look** map for the whole repo._
_For the human-facing overview see `README.md`; for why this file exists + the build plan see
`ORCHESTRATOR-PLAN.md`. Detail lives in `playbooks/` and each folder's own `SKILL.md`/`CLAUDE.md` —
**this file points, it does not duplicate. Canonical sources win on conflict.**_

## Pipeline (what feeds what)

A livestream re-encodes to a `LOW BPS` master, then fans out into **3 lanes** (full map: `playbooks/livestream-repurpose.md`).

```
INTAKE (ONE invocation): livestream → re-encode "LOW BPS" master → verticalize → transcribe
   ├─►(1) long-form   : desilence LOW BPS → schedule-tweets/longform/ → data/longs.json   (off LOW BPS, before verticalize)
   ├─►(2) vertical shorts: clip select → cut / tighten / caption / render → data/shorts.json
   └─►(3) repurpose   : tweets / threads / IG & YT posts (+ images) → data/*.json
                 all three feed ↓
   schedule-tweets/  (queues: data/*.json) → post-*.js → X · IG · FB · TikTok · Rumble · BitChute · YT
```

**Lanes 2 and 3 are SIBLINGS off the intake transcript, never parent and child — run them in
PARALLEL.** The transcript is produced by INTAKE (segment 1) and is a shared artifact; lane 2's own
work is segments 2-5 and lane 3's is segment 6. Lane 3's only precondition is its own
`repurpose/output/<batch>-lane3-plan.json`. Wording like "lane 3 runs off lane 2's transcript"
describes *which artifact*, NOT an ordering, and must never be read as one. (Mike, 2026-08-15, after
lane 3 was needlessly serialized behind lane 2 and burned wall-clock.)

## Capabilities → where to go

| You want to… | Read first | Playbook |
|---|---|---|
| Repurpose a whole livestream (the 3 lanes, end to end) | `playbooks/livestream-repurpose.md` | `playbooks/livestream-repurpose.md` |
| Turn a transcript into tweet/thread/IG/YT drafts | `repurpose/SKILL.md` | `playbooks/repurpose.md` |
| Generate images for posts | `repurpose/SKILL.md` (image section) | `playbooks/image-gen.md` |
| Post pending queued content to a platform | `schedule-tweets/skills/SKILL.md` | `playbooks/posting.md` |
| Make/render a vertical short or AI-persona video (Mike's likeness) | `video-creation/SKILL.md` · `video-creation/vertical-ai-persona/SKILL.md` | `playbooks/video.md` |
| Make a **Yuli y Ana** video (AI face + AI voice of two people who are NOT Mike; vertical OR longform) | `video-creation/yuli-y-ana/CLAUDE.md` (channel router: persona bible + which track each format inherits; longform runs the longform graph BY PATH, `--project video-creation/yuli-y-ana/media/<project>`) | `playbooks/video.md` |
| Source stock video b-roll (Envato Elements) | `video-creation/skills/envato-broll/SKILL.md` | `playbooks/video.md` |
| Keep music + transitions VARIED across videos (what did the last videos use? what is fresh?) | `video-creation/skills/usage-ledger/usage-ledger.md` (`usage_ledger.py report`; the longform graph gates + records it) | `playbooks/video.md` |
| Use a kinetic-text EFFECT (a motion + sound + graphic device: keyword pop, side panel, lower-third band, list card, icon pop, subscribe close, the signature open, the caption line, the typewriter card, the stacked list, the statement, the text wall, the sparkle, the push slide) or pick an effects THEME for a video / chapter ("Energetic" = `kinetic-text-2023`, "Halloween horror" = `halloween-2022`), or BROWSE every effect with play buttons | `video-creation/skills/effects-library/effects-library.md` (catalog `video-creation/assets/effects/library.json`; sounds stay in the SFX catalog; longform placement rules `video-creation/longform-edited/skills/overlays/overlays.md` §2) · dashboard `video-creation/assets/effects/browse/gallery.html` (rebuild: `python video-creation/skills/effects-library/scripts/effects_gallery.py`) | `playbooks/video.md` |
| Find/pick music for a video (or source new tracks) | `video-creation/skills/music-sourcing/SKILL.md` (§2c: PICK from the analyzed catalog `assets/music/library.json`, no listening; longform bed plans → `music-placement-strategist` agent) | `playbooks/video.md` |
| Make a **livestream thumbnail** (composed in Python, never by an image model) | `video-creation/livestream-repurpose/thumbnail/thumbnail.md` (one `<date>-<slug>/` folder per stream, `build.py` on the shared `thumb_kit.py`) | `playbooks/video.md` |
| See / pause / reorder the VIDEO RUN QUEUE (one video-production run owns the machine at a time; the next starts on its own at a gate / done / failure; "pause the queue" for a meeting; "skip the queue" = `--skip-queue`), or render a longform Remotion comp by hand | `video-creation/skills/run-queue/run-queue.md` · `video-creation/skills/chunked-render/chunked-render.md` (every longform render = 1-minute resumable chunks + watchdog + desktop notifications) | `playbooks/video.md` |
| Give Mike a finished video's YouTube METADATA ("give me the metadata"): title, 2-sentence description (the first an open loop) + 2-3 hashtags, chapters, music code(s), 10 keywords + common misspellings | fill `media/<project>/yt-delivery.json` (fields + rules: the docstring of `video-creation/longform-edited/scripts/yt_delivery.py`), run `python video-creation/longform-edited/scripts/yt_delivery.py <project folder>`, paste the printed block exactly · any track (no MUSIC-PLAN: `chapter_stamps` + `music_track_ids`) · spec `video-creation/longform-edited/skills/comp-build/comp-build.md` §12a.5 | `playbooks/video.md` |
| Make the VERTICAL (9:16) cut of a finished longform video | run **`/vertical-repurpose <project folder>`** · canonical `video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` | `playbooks/video.md` |
| Make a longform 16:9 video (slide presentation OR heavily-edited) | `video-creation/longform-presentation/longform-presentation.md` (FOUR formats, pick first; each has its own `media/<format>/` folder: deck-lecture · desilence-only · vscode-coding · standard: slide-deck lecture = defumble -> preset desilence -> transcribe -> **spotlight** render, `skills/spotlight/spotlight.md`, one deck container at a time cued to the narration, as-filmed head/tail stitched back · crypto-chart screen share = desilence only · **VS Code coding = NO edit, music only** `skills/music-bed/` + series thumbnail `skills/thumbnail/` · **deck screen share + a few full-screen cards** = defumbler agent -> desilencer agent (preset) -> Mike's Enhance Speech -> transcribe -> `skills/card-overlays/`, ONE ffmpeg render, no Remotion) · `video-creation/longform-edited/longform-edited.md` (evolving, edit-driven) | `playbooks/video.md` |
| Make a **code-rendered whiteboard / explainer** video (Shapiro-class: VO only, no camera, no generated images, rough.js SVG kit in Mike's OWN style) or pick / lock the whiteboard STYLE | `video-creation/whiteboard/whiteboard.md` (2026-10-30 six-video research + the style picker: `python video-creation/whiteboard/scripts/render_styles.py` -> `video-creation/whiteboard/style-dashboard.html`; pick for the first demo = hand-drawn-with-hair vocabulary + paper-pastel pen, demos rendered `video-creation/whiteboard/demo/whiteboard-demo-paper-pastel.mp4` + `whiteboard-test2-horse-15to38.mp4` (the Shapiro horse-video beats re-drawn), Remotion kit `remotion/src/whiteboard/` (pen.ts, Sketch.tsx, vocab.tsx, farm.tsx); every other pen/vocabulary stays an option) | `playbooks/video.md` |
| Splice a third-party clip (its OWN voice) into a longform-edited video, or decide whether one belongs (considered on EVERY longform-edited video, NONE written down otherwise) | `video-creation/longform-edited/skills/clip-inserts/clip-inserts.md` (the graph owns the chain: DATA.md candidates -> screenplay `## CLIP-INSERTS` -> COVER-PLAN `clip_inserts` -> capture with audio -> bake -> comp) | `playbooks/video.md` |
| Defumble a recording (remove false starts/retakes, no clipped words) | `video-creation/skills/defumbler/defumbler.md` (canonical, track-agnostic) | `playbooks/video.md` |
| Desilence / tighten pacing (remove silence, rapid-fire) | `video-creation/skills/desilencer/desilencer.md` (canonical, track-agnostic; ALL tracks use it) | `playbooks/video.md` |
| Run the X reply-guy loop | `x-reply-guy/CLAUDE.md` | `playbooks/reply-guy.md` |
| Research things Mike can TALK about on the crypto channel (freeform recording over browser tabs he shares: articles, X posts, charts, downloaded clip sections), or scan an influencer's video into the ongoing "what to point out, and when" dataset | `video-creation/longform-discussion/longform-discussion.md` (Flow A = ingest a video · Flow B = a session; Mike gates the topic list before any download; `python video-creation/longform-discussion/scripts/discussion.py scan` = what is live now) | `playbooks/video.md` |
| Find JOBS that fit Mike (48 h, remote, AI engineer / AI automation / founding / growth / small-company leadership) on LinkedIn + the public boards (RemoteOK, We Work Remotely, HN, Greenhouse / Lever / Ashby watchlist) + the job dashboard | run **`/find-jobs`** · canonical `linkedin-automation/skills/find-jobs/find-jobs.md` (criteria + procedure) · output `linkedin-automation/private/jobs-dashboard.html` | — |

## Quick commands (one-liners)
| SCORE the clip-strategist (did a prompt change make its picks better?), read the record of every clip kept or killed at the 4b / 2nd gates, or REPLAY an old livestream transcript under the current prompt | `video-creation/livestream-repurpose/skills/clip-evals/clip-evals.md` (`clip_evals.py list \| score \| replay --batch <b> \| missed`; the record `video-creation/livestream-repurpose/evals/clip-verdicts.jsonl` is written by the gates, append-only, committed, never recycled) | `playbooks/livestream-repurpose.md` |

Prefix every command with `cd C:\Users\mnede\Documents\Claude\social-media &&` (bash cwd does not persist).

| Task | Command / pointer |
|---|---|
| **Repurpose a livestream (ALL 3 lanes, one command)** | `python video-creation/livestream-repurpose/graph/run.py batch --source "<recording>" [--lane3-brief "..."] [--clip-brief "..."]` · author `longform-meta.json` next to the recording first · exit 2 = Mike's gate, resume `run.py batch --batch <b> --resume --approve 4b\|2nd [--delete N,N] [--missed "MM:SS-MM:SS what it should have found; ..." \| --missed none]` (every verdict lands in the evals record) · `run.py status --batch <b>` any time · slash command **`/repurpose-livestream`** wraps this |
| **Make a longform-edited video (the LangGraph, 2026-09-17)** | `python video-creation/longform-edited/graph/run.py longform --project <name> [--brief-file <md>] [--constraints-file <md>] [--face-max N] [--enhance-speech on]` (the last = Mike's Adobe Podcast Studio pass: the graph drops `spine/<project> FINAL.wav` at GATE spine and remuxes the enhanced track back) · ONE StateGraph per video: pre-production -> spine -> plan -> build -> deliver, 5 HITL gates (screenplay · spine · plan · blueprint · draft); exit 2 = waiting on Mike, resume `--resume --approve <gate>`; steps not automated yet are artifact-aware placeholders (`--done <node>`), so the ORDER is the graph's, never prose · `run.py status --project <name>` any time · first video through it: `kaspa-vprogs` |
| **Vertical (9:16) cut of a DELIVERED longform-edited video** | `python video-creation/longform-edited/graph/run.py vertical --project <name>` · exit 2 = Mike's gate, resume `--resume --approve vertical` · output `<project>-VERTICAL.mp4` at the project root (not queued) · rules `video-creation/longform-edited/skills/vertical-repurpose/vertical-repurpose.md` |
| **Short (~30 s) cut of a delivered VERTICAL** | `python video-creation/longform-edited/graph/run.py short --project <name> [--seconds 30]` · NO gates: plans, builds and delivers in one run, Mike watches the delivered short after (2026-10-29) · output `<project>-SHORT-<N>s.mp4` at the project root (not queued) · the CTA is the shared take `video-creation/assets/vo/cta-watch-full.mp3` · rules `video-creation/longform-edited/skills/longform-to-short/longform-to-short.md` |
| **Video run queue** (what runs / waits; pause for a meeting) | `python video-creation/skills/run-queue/run_queue.py status \| pause \| resume \| cancel <id> \| front <id>` · a run that must overlap: add `--skip-queue` to its `run.py` command · posting, LinkedIn, reply-guy, find-jobs never queue |
| Start dashboard (port 8766) | `python schedule-tweets/scripts/serve_dashboard.py` → http://localhost:8766 · left nav: **Social** (pending posts) · **LangGraph** (live LinkedIn lane state, node-by-node, + profile-view budget) · detail `schedule-tweets/skills/dashboard.md` |
| Count pending across all queues | see `schedule-tweets/skills/pending-social-posts.md` |
| Post next YT Quiz ("post next YT Quiz" = post the single next `pending` entry, no preview, one attempt, then report) | `cd schedule-tweets && python scripts/post_yt_quiz.py` (queue `schedule-tweets/data/yt-quizzes.json`) · **not the JS twin — it cannot post since YouTube's 2026-08-30 composer migration** · full procedure `schedule-tweets/skills/yt-post-quiz.md` |
| Move a finalized render batch into the queue | `python scripts/publish-shorts.py <batch> [--date YYYY-MM-DD] [--dry-run]` · detail `video-creation/PUBLISH-SHORTS.md` |
| Lint queue data (persona/format) | `python scripts/persona-lint.py [--file <path>] [--fix]` |
| **Find new topics** / refresh the Topic Radar dashboard | `node video-creation/topic-radar/build-dashboard.js` → open `video-creation/topic-radar/dashboard.html` · full procedure `video-creation/topic-radar/CLAUDE.md` (topic-finding doctrine: `video-creation/topic-radar/PLAYBOOK.md`) |
| **Find jobs (LinkedIn + other boards)** / refresh the Job Radar dashboard | `python linkedin-automation/skills/find-jobs/find_jobs.py run [--hours 48] [--no-review] [--no-boards]` (other boards only, no LinkedIn: `find_jobs.py boards`; grow the ATS watchlist: `find_jobs.py discover`) (detached, 25-45 min; `status` any time; `classify` + `dashboard` re-tune without LinkedIn) → `linkedin-automation/private/jobs-dashboard.html` · slash command **`/find-jobs`** wraps this · uses the `li-bot-profile` Chrome: never alongside a LinkedIn lane · full procedure + criteria `linkedin-automation/skills/find-jobs/find-jobs.md` |
| **Mike declares a video project complete: clear the video caches** (After Effects + Remotion; deletes NOTHING if another video is in progress) | `/clear-video-caches <project>` · `python video-creation/skills/cache-cleanup/cache_cleanup.py check \| complete <project> --note "..." \| run` · rules `video-creation/skills/cache-cleanup/cache-cleanup.md` |
| Recycle no-longer-needed assets | `node cleanup/cleanup.js --target all --dry-run` (ALWAYS dry-run first; targets: schedule-tweets / video-creation / all) · detail `cleanup/cleanup.md` |
| Defumble a recording (map its takes) | `python video-creation/skills/defumbler/scripts/chunk_map.py "<recording>"` → read `<name>._chunkmap.txt` · full procedure `video-creation/skills/defumbler/defumbler.md` |
| Desilence a recording (tighten pacing) | `python video-creation/skills/desilencer/scripts/desilence.py "<defumbled>" --out "<out>" --split 18 --sil-pre 0.25 --sil-post 0.5` · full procedure `video-creation/skills/desilencer/desilencer.md` |
| Desilence a **longform-presentation** recording (track preset: 800 ms min-silence, 300 ms left between sentences = 200 ms after the sentence + 100 ms before the next, pinned in code; DECK LECTURES (`media/deck-lecture/`) default to 500 ms between sentences = 300 + 200, and 900 ms at each slide change found in the picture, Mike 2026-11-08) | `python video-creation/longform-presentation/skills/desilence/desilence_preset.py "media/<format>/<project>/<master .mkv or DEFUMBLED>" [--dry-run]` → `<project> EDIT.mp4` + `.map.json` (no LOW BPS pass for a no-deck deliverable) · policy `video-creation/longform-presentation/skills/desilence/desilence.md` |
| **Music under a VS Code coding video** (longform-presentation format 3: no edit, intro sting 0 -> -40 dB from 0:00 + random elevator bed after Mike's cue line, -32 dB, remix-looped, end-aligned, picture stream-copied) | `python video-creation/longform-presentation/skills/music-bed/music_bed.py "media/vscode-coding/<p>/raw/<timestamp>.mkv" --cue-phrase "<his cue words>" --out "media/vscode-coding/<p>/<p> FINAL-v1.mp4" [--track <id>] [--dry-run]` · procedure `video-creation/longform-presentation/skills/music-bed/music-bed.md` · thumbnail `video-creation/longform-presentation/skills/thumbnail/thumbnail.md` |
| **Spotlight-render a longform-presentation DECK recording** (one container at a time cued to the words, a `chapter_pause` breath before every chapter card, EDIT head/tail kept) | after the spine is final + transcribed: `python video-creation/longform-presentation/skills/spotlight/cue_scenes.py "media/deck-lecture/<p>/<p>.scenes.json" --words "media/deck-lecture/<p>/<p> EDIT.medium-words.json" --edit "media/deck-lecture/<p>/<p> EDIT.mp4" --emit-ts video-creation/remotion/src/<Comp>Data.ts` → `render_spotlight.py --project ... --comp <Comp>` (parts, detached) → `stitch.py --edit ... --project ... --out "<p> FINAL-v1.mp4"` · a FIX ROUND = `splice.py --prev-resolved <saved resolved.vN.json> --prev-final "<p> FINAL-vN.mp4" --out "<p> FINAL-vN+1.mp4"` (re-renders only the moved windows, never the whole middle) · procedure `video-creation/longform-presentation/skills/spotlight/spotlight.md` |
| **Overlays INSIDE the deck area of a screen-share spine** (longform-presentation format 4 "standard": a few moments, one overlay each = a deck card, a system-design chart still, an animated chart clip or a whiteboard beat clip, only over the deck area; Mike's webcam + the CTA stay visible at full size (2026-10-31); audio stream-copied, no video comp, no draft) | `python video-creation/longform-presentation/skills/card-overlays/card_overlays.py "media/standard/<p>/overlays/cards.json" [--step pages\|shoot\|render\|qa]` · spec + card bodies + agent briefs in `media/standard/<p>/overlays/` · procedure `video-creation/longform-presentation/skills/card-overlays/card-overlays.md` |
| **A whiteboard BEAT inside a video** (15 to 30 s hand-drawn SVG scene, rough.js kit, cued to Mike's words; both longform tracks) | brief -> shared **`whiteboard-builder`** agent (Fable/max; designs, authors kit objects, writes the Remotion scene comp at the canvas size, still-frame QA) -> `visual-qa` -> `chunked_render.py --comp <Comp> --no-audio` -> composite (standard format: `kind: clip` card; longform-edited: a `whiteboard` cover row) · contract `video-creation/skills/whiteboard-beat/whiteboard-beat.md` · the kit + style decisions `video-creation/whiteboard/whiteboard.md` |
| Remove ONE anomalous sound burst (throat-clear/cough/click between two words) | `python video-creation/skills/burst-removal/scripts/burst_profile.py "<file>" <start> <end>` to find the silence troughs, then cut end-of-word-A → start-of-word-B · full procedure `video-creation/skills/burst-removal/burst-removal.md` |

## Global hard rules (authoritative copies live where cited — do not violate)

- **Never write anything to D: (Mike, 2026-11-08).** D: is a removable drive he often has unplugged. No scratch,
  renders, bundles, staging, backups or work dirs there; use C: (the project folder or `%TEMP%`) and free space on C:
  instead. Reading his own source assets from `D:\Dropbox\...` is fine only when he says it's plugged in.
- **Where files go (Mike, 2026-11-09).** (1) A file that belongs to ONE video (search results, picks, previews,
  downloads, QA stills, logs) goes in that video's project folder. (2) Only what several projects share, or a tool's
  own throwaway diagnostics (debug screenshots, recon dumps, session cookies), goes in `video-creation/cache/<tool>/`
  (gitignored; build the path with `video-creation/skills/cache-path.js` / `cache_path.py`). (3) Never the repo root,
  never inside a `skills/` folder (code and docs only), never D:. A temp file that lives only while one command runs
  may use `%TEMP%`. A Chrome profile lives only in `%LOCALAPPDATA%\Google\Chrome\<name>-profile`: a folder named
  `Users...AppData...` in the repo is that path with its backslashes lost in a shell, so quote Windows paths.
  Enforced by `python scripts/check-file-placement.py`, run by a Stop hook (`.claude/settings.json`) at the end of every
  turn and by `.githooks/pre-commit` (enable per clone: `git config core.hooksPath .githooks`). Detail:
  `video-creation/cache/README.md`.
- **Sequential posting only** — never run two posting scripts in parallel, for any reason. (`schedule-tweets/skills/SKILL.md`)
- **One attempt per posting script** — if it seems stuck, READ THE LOG; never relaunch (shared Chrome profiles collide and kill the in-flight post).
- **YouTube Shorts are posted via the API ONLY** (`scripts/post-yt-short-api.js`). There is **NO Playwright/browser fallback** — do NOT use `post-yt-short.js`, do NOT re-encode to dodge an upload-size limit, do NOT improvise. If the API fails (e.g. `invalid_grant` = expired OAuth token, which needs Mike to re-auth), mark it failed and **report it at the end of the run.** A failed step is reported, never worked around. (`schedule-tweets/skills/yt-post-vertical.md`)
- **No em dashes** in anything written to a queue file (titles/hooks/captions) — use comma/period/colon. (persona)
- **Never auto-retry a "failed" reply-guy entry** — it usually already posted; retry = duplicate. (`x-reply-guy/CLAUDE.md`)
- **Every image is unique** — never reuse an image_id/file across posts. (`repurpose/SKILL.md`)
- **Seedance video = 480p ONLY, never higher — HARD RULE, no exceptions.** Every Higgsfield Seedance generation (`seedance_2_0`: image-to-video, talking-head, lip-sync, AND every test/probe/throwaway) MUST pass `--resolution 480p`. Never omit it (the model default is higher) and NEVER use 720p or 1080p. Remotion upscales 480p → 1080×1920 for FREE, so higher res buys nothing and only burns credits: 480p=33cr vs 720p=49cr vs 1080p=99cr. 720p tests already drained most of a balance once (2026-06-15). If a single finished clip genuinely needs more detail, STOP and get Mike's explicit OK first. (`video-creation/vertical-ai-persona/SKILL.md` §3)
- Edit `data/*.json` with **Node, never PowerShell `ConvertFrom/To-Json`** (mangles emoji).
- **Python-first for NEW code (Mike, 2026-07-23).** This is a Python repo: write any new standalone script/tool in Python whenever Python can do the job — browser automation included (Playwright's Python API is fully capable; the existing JS browser scripts are historical convention, not a constraint). JavaScript ONLY where structurally required: (a) Remotion compositions (React/TS, no alternative), and (b) extending an existing battle-tested JS subsystem (`schedule-tweets` posters, `linkedin-automation`, `x-reply-guy`) where reusing its shared session libs matters. Those subsystems are **frozen, then ported**: wrapped as-is for now, ported to Python opportunistically as each lane enters the LangGraph migration (verification-gated on live runs; posting scripts + LinkedIn actions last). Endpoint = **all-Python except Remotion**. (`ORCHESTRATOR-PLAN.md` §"Phase 2 direction chosen", 2026-07-23.)
- **Defumble ONLY via `video-creation/skills/defumbler/defumbler.md`** — never cut fumbles from a whole-file Whisper transcript or word timestamps (it HIDES retakes and DRIFTS → missed fumbles + clipped words; failed silverscript 3x). Always: chunk-map → cut only inside silence → get Mike's text cut-plan approved BEFORE rendering. `detect_fumbles.py`/`audit_coverage.py` are diagnosis only.
- **Desilence ONLY via `video-creation/skills/desilencer/desilencer.md`** (the ONE tool, `desilence.py`, every track) — NEVER write a new silence script or use single-threshold `silencedetect` (it clips words / misses clean pauses). Detection is dual-threshold RMS (silence <−57 dB, audio >−52 dB) + 8 ms declick; those thresholds are the fixed method, the **min-silence duration is the only knob**. Defumble first (separate step), then desilence the master.
- **Every longform Remotion render is CHUNKED + WATCHED, and every video run is QUEUED + SUPERVISED (Mike, 2026-10-27).**
  Renders go through `video-creation/skills/chunked-render/` (1-minute resumable chunks, a watchdog that kills + retries a
  stall, desktop notifications); never a direct `npx remotion render` (`python scripts/check-remotion-render.py` fails on
  one; livestream shorts exempt). Video runs take the machine-wide turn (`video-creation/skills/run-queue/`) and a failed
  render/build node is re-driven ONCE automatically, then Mike is notified: a failure is never left sitting unannounced.
  Never hand-roll a "wait for the other session" launcher: the queue does it.
- **Livestream shorts render ONCE at full quality, no draft (Mike, 2026-10-05).** The low-bitrate draft render is a
  longform-edited review proxy ONLY. A short is rendered via `render_short.py full` (crf 18 pinned in code, no draft
  mode); a QA defect is fixed with `render_short.py splice --frames A-B` (re-render only that window and stitch it in)
  or `render_short.py audio` (audio-only), never a second full render unless the defect is clip-wide.
  (`video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` row 7)

## Persona
All voice / terminology / brand rules: **`persona/persona.json`** (single source of truth). Read before drafting any content.

## Orchestrator status
**Phase 2 BATCH ORCHESTRATOR IS BUILT (2026-09-10)** — `video-creation/livestream-repurpose/graph/batch_graph.py`,
invoked as **`python video-creation/livestream-repurpose/graph/run.py batch --source "<recording>"`**.
ONE invocation owns all three lanes: intake → Lane 3 launched CONCURRENTLY (its own process:
lane3-drafter agent → repurpose graph → visual-qa) → Lane 2 (clip-strategist → cut → **4b HITL
interrupt** → tighten-strategists → tighten → **2nd-review HITL interrupt** → finish → remotion-builders →
publish) → join Lane 3 → verify. Judgment steps spawn HEADLESS agents (`claude -p --agent`) and are
verified from disk. It **refuses DONE while any lane is pending**, and every segment report + `run.py
status --batch <b>` prints the BATCH LANES footer. Exit 2 = waiting on Mike; resume with
`run.py batch --batch <b> --resume --approve 4b|2nd [--delete N,N]`. Per-run overrides ride in as
`--lane3-brief` / `--clip-brief` (persisted on the batches.json entry). `--until 4b|2nd|finish|build|publish`
scopes Lane 2 (Lane 3 still runs to done).
**HARD RULE (Mike, 2026-09-10, after Lane 3 of batch `kaspa` was never started by hand):** a livestream
batch is driven by `run.py batch`, never by hand-invoking segments one at a time. Hand-running a
single segment is for repairs only, and the footer it prints tells you what is still pending.
History + design: `ORCHESTRATOR-PLAN.md` (Phase 2 ledger).

### Advisor/executor model routing (authoritative — self-contained, no memory needed)
The pipeline runs on an **advisor/executor split**, so any fresh checkout behaves the same:
- **Executor / orchestrator = the Opus main loop.** It holds the shared context and the task list,
  runs the mechanical pipeline and Lanes 1 & 3 inline, and executes the plans the subagents return.
  The reusable entry point is the slash command **`.claude/commands/repurpose-livestream.md`**
  (`model: opus`, `effort: medium`) — path is the only arg, trailing text = per-run overrides.
- **Specialist subagents live in `.claude/agents/`**, each a single Mike-reviewed slice, versioned with
  the repo. Two kinds, split by whether the slice is judgment or execution:
  - **Fable/max advisors (read-only, return a JSON plan):**
    - **`clip-strategist.md`** — selects shorts from the transcript, scatter-gathers segments scattered
      across the stream into one short (Lane 2 / Phase 3-4).
    - **`tighten-strategist.md`** — authors the Phase 5 tighten removal spans for a clip.
    - **`longform-edited/transition-strategist.md`** — authors the whole `TRANSITIONS.md` plan from the
      CUE-SHEET/EDIT-PLAN placement + the `assets/transitions/library.json` meta: assigns every scene
      change across the 3 buckets AND strategically reserves the library's MELT (transform/reform) and
      SPIN (new-facet turn) families for the marquee diagram/chart reveals (text containers stay quiet).
  - **Executor agents (build/capture assets or code, self-QA, Mike gates). Tier per Mike's rule
    (2026-07-24): formulaic execution = medium · diligence-heavy mechanical = sonnet/xhigh · design
    judgment = max:**
    - **`remotion-builder.md`** — builds ONE short's Remotion composition + render (Phase 7). opus/xhigh
      because the composition code is bug-sensitive (frame math, overlay collisions).
    - **The longform-edited ASSET FACTORY (`.claude/agents/longform-edited/`, added 2026-07-24):**
      `slide-builder` (opus/medium, title+card slides off the locked stylesheet) · `chart-builder`
      (opus/max, system-design chart stills + animated-chart design states/specs) · `receipt-capturer`
      (sonnet/xhigh, verified real-site captures/recordings) · `envato-sourcer` (opus/medium, b-roll
      clip picking + canonical download tooling) · `image-gen` (sonnet/xhigh, ChatGPT browser-pipeline
      images). All five outputs gate through `visual-qa` before Mike.
- **The full agent registry IS `.claude/agents/`** (`shared/` = track-agnostic spine-prep/QA:
  defumbler, cover-blackout, desilencer, burst-removal, transcriber, captions-builder, visual-qa, plus
  **`whiteboard-builder`** (Fable/max, 2026-10-31: designs + builds ONE whiteboard beat for either longform track);
  `longform-edited/` = the strategists + asset factory). When planning any phase, check the registry
  before doing the work inline — these agents exist so slices are NOT hand-rolled in the main loop.
- **Fable allowance fallback is AUTOMATIC, for EVERY Fable agent (Mike, 2026-09-14; all spawners, Mike 2026-10-10):**
  every headless spawner respawns an agent that dies on the CLI's Fable-limit message ONCE with `--model opus` (the CLI
  flag beats the frontmatter; definitions are never edited): `batch_graph.spawn_agent` (livestream batch, Lane 2 + Lane 3),
  the longform graph's `common.spawn_agent` / `spawn_agents_parallel` (longform, vertical and short lanes, every
  strategist and the asset factory) and `find_jobs.py`'s reviewer, all on ONE identical `FABLE_LIMIT_RE`. A NEW headless
  spawner must carry the same pattern + respawn: **`python scripts/check-fable-fallback.py`** discovers every spawner and
  proves the respawn against a fake CLI (run it after touching any spawner). The main loop does the same for Agent-tool
  dispatches (`model: opus`) without asking. Never stall a run on the Fable quota. A failed batch run is re-driven with
  a fresh `run.py batch --batch <b>` (nodes are redo-safe); `--resume` is for gates.
- These ARE allowed and versioned on purpose; they are NOT the deferred DAG automation (no auto-spawning
  fleet). Rule of thumb: judgment slice -> Fable/max advisor; intricate execution slice -> Opus/high executor.
