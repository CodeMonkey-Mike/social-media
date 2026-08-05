# assets/vo — shared voice-over takes (MIKE-CLONE)

Reusable spoken lines in Mike's cloned voice, generated once and used across many videos. Project-agnostic
by design: a line that closes every short should not be re-voiced (and re-billed) per project.

Sibling of `assets/music/`, `assets/sfx/`, `assets/transitions/` — same idea, same place.

## What is here

| File | What it is |
|---|---|
| `cta-watch-full.mp3` | **"Click below to watch the full video."** The CTA that closes every short built by the `longform-to-short` lane. 2.26s, -17.0 LUFS. |
| `CTA-SCRIPT.md` | The canonical text for that line, with the markup reasoning. **Edit this, never the mp3's prompt from memory.** |
| `tts-chunks.json` | The TTS-ready text, derived from `CTA-SCRIPT.md` and gated against it. |
| `_manifest.json` | Generation exhaust: the cloudfront URL of the take that shipped. |

## Rules

- **Reuse the take. Do not regenerate per project** — it costs credits and, more importantly, a re-roll
  drifts the delivery, so shorts from different videos would end on subtly different readings.
- **Regenerate only when the LINE changes**, or when Mike rejects the reading. Then update `CTA-SCRIPT.md`
  first and let `verify-tts.js` prove `tts-chunks.json` still matches before spending a credit.
- **Consumers reference this path, never a project-local copy.** Canonical consumer:
  `longform-edited/skills/longform-to-short.md` §4.

## Regenerating

Full procedure: `video-creation/skills/higgsfield-voice/SKILL.md` (Higgsfield has no TTS API, so it is a
Playwright/CDP browser flow). Short version: launch the `hfbot-profile` Chrome with `--remote-debugging-port=9333`,
open **Audio**, set the model to **Seed Speech** (it does NOT persist between sessions and defaults back to
Eleven v3), confirm the Voice Preset is **MIKE-CLONE**, then:

```bash
cd video-creation/skills/higgsfield-voice
node _batch-generate.js ../../assets/vo/tts-chunks.json ../../assets/vo ../../assets/vo/CTA-SCRIPT.md
# then curl the URL from _manifest.json, and whisper-QA the take before it ships
```

Both gates (SCRIPT match, VOICE == MIKE-CLONE) abort before any credit is spent.
