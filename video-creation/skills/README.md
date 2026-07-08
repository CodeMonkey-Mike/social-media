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
| `cover-blackout/` | `cover-blackout.md` | — | Bake black over the video on COVER (non-FACE) beats, audio untouched (drawbox paint, zero drift). Face-gates the recorded spine so the off-screen-reading face never leaks. Track-agnostic; runs after defumble/desilence. |
| `defumbler/` | `defumbler.md` | `/defumbler` | Remove false starts/retakes WITHOUT clipping words (silence-segmented chunk-map; cut only in silence). Track-agnostic. |
| `desilencer/` | `desilencer.md` | — | Remove silence / tighten pacing (dual-threshold −57/−52 RMS + declick; min-silence duration is the only knob). The ONE silence tool; all tracks use it. |
| `elevenlabs-lipsync/` | `SKILL.md` | — | ElevenLabs lip-sync (UI-only; driven via Playwright). |
| `envato-broll/` | `SKILL.md` | — | Source stock video b-roll from Envato Elements. |
| `gaze/` | `SKILL.md` | — | Camera-look / gaze detection (mandatory refine step). |
| `higgsfield-generate/` | `SKILL.md` | `/higgsfield-generate` | Generate images/videos via Higgsfield CLI (Seedance 2.0, Nano Banana 2/Pro, GPT Image 2, Soul, Marketing Studio, Virality Predictor). |
| `higgsfield-soul-id/` | `SKILL.md` | `/higgsfield-soul-id` | Train a Soul Character (personalized face model) → `reference_id` used by higgsfield-generate via `--soul-id`. |
| `higgsfield-voice/` | `SKILL.md` | — | Drive the Higgsfield Audio/Seed-Speech (voice) tab via Playwright/CDP — the voice feature has no API. Used for persona voice capture (Yuli y Ana). (Single-command `hf-voice.js` wrapper still TODO.) |
| `music-sourcing/` | `SKILL.md` | — | Soundstripe music search + download + license-code minting. |

**External tooling** these wrap (CLI + login, not committed) — install per machine: see
`../SKILLS-SETUP.md` (currently the `higgsfield` CLI for the higgsfield-* skills).

Per-track skills stay in their own track folder, not here. Track *pipelines* (`longform-edited/`,
`longform-presentation/`, `vertical-ai-persona/`, `livestream-repurpose/`) and infrastructure
(`assets/`, `remotion/`, `shorts/`, `style-guide/`) live at the `video-creation/` root, not under `skills/`.
