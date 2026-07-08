---
name: higgsfield-voice
description: Generate an accented persona voice track on Higgsfield's Audio / Seed Speech tab by driving the web UI with Playwright over CDP. Higgsfield has NO voice API, so this is browser automation, not a CLI call. Use for Yuli y Ana persona voice capture (the accented clone track that the video is later lip-synced to).
---

# Higgsfield Voice (UI-driven via Playwright/CDP)

**Why this exists:** Higgsfield has **no voice/TTS API** — the Audio tab is UI-only (confirmed via their
Discord; see memory `higgsfield-cli-setup`). So to generate a voice track we drive the live web UI with
Playwright over a CDP-attached Chrome. This is a different mechanism from the CLI skills
`higgsfield-generate` / `higgsfield-soul-id` (which DO use the API), hence its own skill.

**Where it fits in the persona pipeline:** generate the **accented clone voice track FIRST**, then lip-sync
the Seedance video to it via `--audio` (NEVER use Seedance's baked image-to-video audio — no accent control;
memory `project_yuli_ana_voice_pipeline`, and the `ANA-SPEC.md` / `YULI-SPEC.md` production routes). This
skill produces that track.

## Files in this skill
- `_cdp.js` — shared CDP connect helper. Reuses the Playwright install from `schedule-tweets/node_modules/`
  (no separate install). Connects to `http://localhost:9333` (override with `HF_CDP`).
- `_click.js` — navigate to a URL or click a control by text, then dump the on-page controls + screenshot
  (`node _click.js "<url-or-button-text>"`). The probe used to find/operate the Audio UI.
- `_shot.js` — connect, print URL/title, dump nav links, screenshot. Quick "where am I" probe.
- **Working step scripts (built 2026-07-01, verified on MIKE-CLONE):** `_open-preset.js` (open the Voice
  Preset picker + dump voices), `_select-mike.js` (click a voice card by its in-modal rect — adapt the name
  filter for other voices), `_fill-prompt.js <textfile>` (clear + type the prompt, reads back the field),
  `_generate.js` (click the `GENERATE\n<cost>` button, poll network+DOM for the new `…cloudfront…hf_*.mp3`).
  These are the pieces of the TODO driver below; the coords are resolved live via `getBoundingClientRect`
  (CSS px), NOT screenshot px (screenshots are ~1.65x on this display).

## Launching (the profile already exists + is logged in)
The dedicated **`hfbot-profile`** Chrome was created 2026-06-15 and **stays logged in to Higgsfield** —
you do NOT log in again, just launch it with CDP exposed:
```
chrome.exe --user-data-dir="C:\Users\mnede\AppData\Local\Google\Chrome\hfbot-profile" \
           --remote-debugging-port=9333  https://higgsfield.ai/
```
The Google session persists in that profile (same dedicated-profile + CDP pattern as the schedule-tweets
uploaders). **Only on a brand-new machine** is there a one-time step: create the profile and log in once
via Google. If a launch shows you logged out, just re-auth in that profile once and it persists again.

## ⚠️ TTS MARKUP for non-monotone delivery (Mike, 2026-07-01)
Seed Speech reads flat if you hand it plain text. Mike wants energy, so mark up the prompt:
- **ALL CAPS** on the emphasis word (the *content* word carrying the point).
- **`...`** for a deliberate pause/beat.
- **`!`** where the line should lift.

⛔ **CONFIRMED PATTERN (Mike, 2026-07-01, after 5 instances): ALL-CAPS on a SHORT word clips or mangles it.**
Seen on `ISN'T`, `ALL` (twice), `OWN`, `EDGE` — each came out clipped/garbled (whisper heard "it bent" /
"a LL" / "un-machine" / "EDG", and Mike's ear confirmed). **Caps on LONGER content words is fine and stays**
(`SYNTAX`, `LIBRARIES`, `THOUSANDS`, `LOUD`, `FAST`, `TOOLBOX` all read clean). **Rule: use ALL-CAPS emphasis
only on content words of ~5+ letters. For a short word (≤4 letters / function word), lowercase it, or move the
emphasis to a neighboring longer word.**
- **The other main glitch driver is PROMPT LENGTH** (more sentences = more artifacts) — that's the reason for
  the 2-3-sentence chunking below. Keep chunks short first.
- **QA every take with local whisper** (`whisper <mp3> --model small.en`) and diff vs the script — a
  clipped/garbled word shows up as a wrong transcription. Whisper catches word-level clips/drops; **Mike's ear
  is the final judge of tone + pronunciation**. Re-roll a bad take (or fix the spelling — see the map below).

## Pronunciation map — spell these for Seed Speech (growing; shared across all AI scripts)
Seed Speech mangles certain tech tokens; write the **spoken** spelling in the prompt. Build once, reuse
everywhere. The human-readable script keeps the real name; the committed per-video **TTS text file** (e.g.
`media/<project>/tts-chunks.json`) carries these spellings. Add a row whenever Mike's ear flags a new one.

| Real name | Seed Speech spelling | Real name | Seed Speech spelling |
|---|---|---|---|
| numpy | `num pie` | pypdf | `pie P D F` |
| ollama | `Oh Lama` | pytest | `pie test` |
| python-dotenv | `python dot environment` | scikit-learn | `sci kit learn` |
| uvicorn | `you vee corn` | gradio | `grad ee oh` |
| FastAPI | `Fast A P I` | crewai | `crew A I` |
| httpx | `H T T P X` | pydantic-ai | `pydantic A I` |
| pgvector | `P G vector` | dspy | `D S py` |
| boto3 / S3 | `boto three` / `S three` | litellm | `lite L L M` |
| asyncio | `async I O` | langchain / langgraph | `lang chain` / `lang graph` |
| faiss | `face` | langsmith / langfuse | `lang smith` / `lang fuse` |
| vllm | `V L L M` | llama-index | `llama index` |
| chromadb | `chroma D B` | llama-cpp-python | `llama C P P python` |
| qdrant | `Q drant` | deepeval | `deep eval` |
| uv | `U V` | aws-lambda-powertools | `A W S lambda powertools` |

General rule for acronyms: **spell with spaces** — `G P T`, `S D K`, `U I`, `L L M`, `A W S`, `A P I`.

**Two-file convention (Mike asked 2026-07-01):** keep BOTH a human-readable `SCRIPT.md` (real names, editorial)
AND a committed **`tts-chunks.json`** (the exact per-chunk prompt text with these spellings + caps rule
applied). Generation + re-rolls read the committed TTS file, never a scratch copy, so corrected pronunciations
persist.

## ⚠️ CHUNK THE SCRIPT — 2-3 sentences per generation (Mike, 2026-06-22)
Never paste a whole script into one Seed Speech generation. Send **only 2-3 sentences at a time** (use 3
ONLY when the sentences are short; 2 when they are longer). Giving the TTS less to work with per generation
**sharply reduces hallucinations** (the model invents/garbles when handed too much text — same principle as
the ElevenLabs 2-4-sentence recipe). Generate each chunk separately, then concatenate the chunk mp3s in
order (sync-safe). Re-roll only the chunk that hallucinated, not the whole track.

## Proven flow (validated 2026-06-15 on the YULI-1 voice; `text.txt` was that session's line)
1. Launch the CDP Chrome above (profile `hfbot-profile`, port 9333, `https://higgsfield.ai/`).
2. Connect Playwright `connectOverCDP('http://localhost:9333')` (via `_cdp.js`).
3. Click **Audio** nav → open the **model selector** (was showing "Eleven v3") → pick **Seed Speech**.
4. Open the **Voice Preset** picker → pick the persona voice (e.g. **YULI-1**). ⚠️ Card text is lowercase
   `yuli-1`, CSS-uppercased; the picker is a **modal portal**, so click the in-modal card **by rect**, not
   the first `text=` match (that hits feed items behind the modal).
5. Fill the prompt field with the line to speak, click **GENERATE**, wait ~10s.
6. Grab the newest `…cloudfront…/hf_<ts>_<uuid>.mp3` URL off the page and `curl` it (cleaner than the
   download button). Save into the project's `audio/` folder.

## Output
An `.mp3` voice track in the consuming project (e.g. `vertical-ai-persona/Yuli y Ana/video1-crypto/audio/`).
Then lip-sync the Seedance clip to it (`seedance_2_0 --audio <track>` + a MINIMAL prompt — a verbose prompt
makes Seedance ignore `--audio` and invent its own speech; see `YULI-SPEC.md` Production route).

## TODO (not yet built — flow is proven, just not packaged into one command)
Wrap steps 2–6 into a single re-runnable `hf-voice.js --voice <preset> --model "Seed Speech" --text-file
<f> --out <mp3>` driver (building on `_cdp.js`). It needs a live logged-in CDP session to develop/verify
(especially the modal-portal click-by-rect), so build it interactively with Mike's Chrome attached.

## Notes
- Voice clone references Mike provided live in `vertical-ai-persona/Yuli y Ana/voice-samples/` (short, ~10%
  music bed).
- Do NOT generate Higgsfield voice without Mike's OK — it spends credits (root `CLAUDE.md` cost rule).
