# video-creation/skills

**Shared, general-purpose skills usable across ALL video-creation work** (vertical-ai-persona,
longform-edited, longform-presentation, livestream-repurpose, shorts) — not specific to any one
subfolder. These are the **canonical** copies, committed to the repo so they travel with a checkout.

Skills with a `/command` have a 3-line pointer under `video-creation/.claude/skills/<name>/SKILL.md`
that points back here. Skills without a pointer are read directly (via the root `CLAUDE.md` routing
table or the track docs that reference them).

| Skill | Doc | `/command` | What it does |
|---|---|---|---|
| `accuracy-pass/` | `accuracy-pass.md` | — | Fact-check & currency check for written claims (a pre-VO/pre-render gate): extract checkable claims → verify vs live sources (PyPI/docs/web) → per-claim verdict + citation + fix. Catches stale package names, deprecations, and over-stated "recommended default" claims. Defers Anthropic/Claude facts to `claude-api`. Track-agnostic; highest value on the ai-engineering channel. |
| `burst-removal/` | `burst-removal.md` | — | Excise ONE anomalous sound burst (throat-clear, cough, click, mic-bump) between two words: cut from end-of-word-A to start-of-word-B, both edges in silence, sync-safe, verify on the output. The targeted cut for the loud anomaly desilence keeps and defumble ignores. Track-agnostic. |
| `captions/` | `captions.md` | — | Whisper word-level captions; 2 presets (montserrat lowercase-bounce; arial-black uppercase-karaoke); CORRECTIONS dict is the single source. |
| `chunked-render/` | `chunked-render.md` | — | EVERY longform Remotion render (2026-10-27): 1-minute chunks from one bundle (h264-mkv, pcm audio joined sample-exact), kept as they verify; a watchdog kills + retries a stalled chunk (3 attempts, every failed log kept); a re-run resumes; the run-queue pause + `--deadline`; desktop notifications. `render_comp.py` and `render_spotlight.py` call it; `scripts/check-remotion-render.py` fails any direct `npx remotion render` (livestream shorts exempt). |
| `run-queue/` | `run-queue.md` | — | THE RUN QUEUE (Mike's design, 2026-10-27): ONE video-production run owns the machine at a time, taking its turn at start/resume and releasing it at a gate / done / failure; the next waiting run starts on its own. `run_queue.py status \| pause \| resume \| cancel \| front`; `--skip-queue` overlaps on Mike's ask. The SUPERVISOR re-drives a failed render/build node once, then one desktop notification (`notify.py`, silent under Do Not Disturb). Posting, LinkedIn, reply-guy, find-jobs are never queued. |
| `cover-blackout/` | `cover-blackout.md` | — | Bake black over the video on COVER (non-FACE) beats, audio untouched (drawbox paint, zero drift). Face-gates the recorded spine so the off-screen-reading face never leaks. Track-agnostic; runs after defumble/desilence. |
| `defumbler/` | `defumbler.md` | `/defumbler` | Remove false starts/retakes WITHOUT clipping words (silence-segmented chunk-map; cut only in silence). Track-agnostic. |
| `filler-removal/` | `filler-removal.md` | — | **Phase 5C**: strip `um`/`uh`/`you know`/discourse-`like` from a FINISHED clip. Whisper de-disfluences and whole-clip alignment lies, so detection uses **windowed** decoding (10s/3s) + a per-splice clipped-neighbour gate. Ceiling 8%. |
| `desilencer/` | `desilencer.md` | — | Remove silence / tighten pacing (dual-threshold −57/−52 RMS + declick; min-silence duration is the only knob). The ONE silence tool; all tracks use it. |
| `elevenlabs-lipsync/` | `SKILL.md` | — | ElevenLabs lip-sync (UI-only; driven via Playwright). |
| `envato-broll/` | `SKILL.md` | — | Source stock video b-roll from Envato Elements. |
| `gaze/` | `SKILL.md` | — | Camera-look / gaze detection (mandatory refine step). |
| `higgsfield-generate/` | `SKILL.md` | `/higgsfield-generate` | Generate images/videos via Higgsfield CLI (Seedance 2.0, Nano Banana 2/Pro, GPT Image 2, Soul, Marketing Studio, Virality Predictor). |
| `higgsfield-soul-id/` | `SKILL.md` | `/higgsfield-soul-id` | Train a Soul Character (personalized face model) → `reference_id` used by higgsfield-generate via `--soul-id`. |
| `higgsfield-voice/` | `SKILL.md` | — | Drive the Higgsfield Audio/Seed-Speech (voice) tab via Playwright/CDP — the voice feature has no API. Used for persona voice capture (Yuli y Ana). (Single-command `hf-voice.js` wrapper still TODO.) |
| `cache-cleanup/` | `cache-cleanup.md` | `/clear-video-caches` | When Mike declares a project complete: clear the After Effects + Remotion caches, ONLY if no other video is in progress (queue, processes, unmarked project folders, open livestream batches; paused or gated counts). Blocked = nothing deleted. Never Claude conversations, never the pagefile. |
| `usage-ledger/` | `usage-ledger.md` | — | VARIETY across videos: `usage_ledger.py` records the music + transitions every finished video used (`assets/usage-ledger.json`), reports what is fresh per pool / slot before a strategist picks, and gates a plan that repeats the previous video. Wired into the longform graph (`music_plan`, `transitions`, `stage_longform`). |
| `music-sourcing/` | `SKILL.md` | — | Soundstripe music search + download + license-code minting. |
| `effects-library/` | `effects-library.md` | — | THE EFFECTS LIBRARY (2026-10-25): an effect = a DEVICE = motion recipe + its sound(s) + its graphics, grabbed as a unit, grouped into THEMES a video (or a chapter) picks whole. Catalog `assets/effects/library.json` (`devices` + `themes`), theme files under `assets/effects/themes/<theme>/` (cue sheet, textures, graphics), Remotion engines `remotion/src/effects/<theme>/`. `effects_catalog.py check \| report`; `check` fails on a device whose sound id, graphic or engine is missing. |
| `sfx-library/` | `sfx-library.md` | — | THE SFX CATALOG (2026-10-20): every sound under `assets/sfx/` has a library row (per-type folder `library.json` = the hand-edited source; root `assets/sfx/library.json` `index` = generated, the one file a picker reads: `trigger`, `best_for`, `mood_class`, `attack_sec`, `tail_sec`). `sfx_catalog.py build \| check \| report`; `check` fails on an orphan file. |
| `whiteboard-beat/` | `whiteboard-beat.md` | — | A WHITEBOARD BEAT inside a video (2026-10-31): 15 to 30 s of hand-drawn SVG (the rough.js kit of `../whiteboard/`) drawn on under Mike's voice, cued to his words, in place of b-roll or a deck card. The contract (canvas per track, pen, cues, clip rules) + the caller's checklist; built by the shared `whiteboard-builder` agent, rendered through chunked-render, composited by the track. Both longform tracks. |

**External tooling** these wrap (CLI + login, not committed) — install per machine: see
`../SKILLS-SETUP.md` (currently the `higgsfield` CLI for the higgsfield-* skills).

Per-track skills stay in their own track folder, not here (e.g.
`livestream-repurpose/skills/remotion-shorts-build/` — the finalized-short contract + gate for
shorts cut from livestreams). Track *pipelines* (`longform-edited/`,
`longform-presentation/`, `vertical-ai-persona/`, `livestream-repurpose/`) and infrastructure
(`assets/`, `remotion/`, `shorts/`, `style-guide/`) live at the `video-creation/` root, not under `skills/`.
