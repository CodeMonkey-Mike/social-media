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

## Files in this skill (Python since 2026-11-23; run each as `python <file>` from this folder)
- `_cdp.py` — shared CDP connect helper + the page snippets the scripts share. Uses the Python `playwright`
  package (no Node). Connects to `http://localhost:9333` (override with `HF_CDP`).
- `_click.py` — navigate to a URL or click a control by text, then dump the on-page controls + screenshot
  (`python _click.py "<url-or-button-text>"`). The probe used to find/operate the Audio UI.
- `_shot.py` — connect, print URL/title, dump nav links, screenshot. Quick "where am I" probe. `_probe.py` = the
  same without the screenshot, plus `esc` (dismiss a popover) and `click "<text>"`.
- **Working step scripts:** `_open_preset.py` (open the voice picker + dump what the page shows),
  `_pick_voice.py "<name>"` (open the picker and click a voice card by its exact text; no name = only list),
  `_fill_prompt.py <textfile>` (clear + type the prompt, reads back the field), `_generate.py` (click the
  `GENERATE\n<cost>` button and print the new take's mp3 URL). Coords are resolved live via
  `getBoundingClientRect` (CSS px), NOT screenshot px (screenshots are ~1.65x on this display).
- Model probes (read-only): `_probe_models.py` (open the Model selector and list it), `_probe_model_pick.py "<model>"`
  (pick a model, list the composer's controls).
- Sign-in helpers: `_login_probe.py` (open the sign-in dialog), `_login_google.py "<account text>"` (Continue with
  Google on the profile's persisted Google session; it only clicks, and stops if a password is asked).
- Drivers + gate: `_batch_generate.py`, `_gen_model.py`, `_grab_history.py`, `verify_tts.py` (sections below).

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
- **`!`** where the line should lift. ⛔ **A trailing `!` lifts the LAST WORD, so only use it when the
  final word is the one that should punch.** (Mike, 2026-07-25.) The kaspa-30bps short's CTA was written
  `Click below to WATCH the full video!` and he caught it on first listen: "it seems like video is
  emphasized." Measured, the `!` take held "video" for 0.62s at 0.6 dB under the line peak (i.e. still at
  peak, stressed); re-rolled with a period it held 0.50s at 3.9 dB under the peak, so the line falls away
  and the CAPS on WATCH becomes the only emphasis. **When the payload word is mid-sentence, end with a
  period and let the CAPS carry the stress.**

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
2. Connect Playwright `connect_over_cdp("http://localhost:9333")` (via `_cdp.py`).
3. Click **Audio** nav → open the **model selector** (was showing "Eleven v3") → pick **Seed Speech**.
4. Open the **Voice Preset** picker → pick the persona voice (e.g. **YULI-1**). ⚠️ Card text is lowercase
   `yuli-1`, CSS-uppercased; the picker is a **modal portal**, so click the in-modal card **by rect**, not
   the first `text=` match (that hits feed items behind the modal).
5. Fill the prompt field with the line to speak, click **GENERATE**, wait ~10s.
6. Grab the newest `…cloudfront…/hf_<ts>_<uuid>.mp3` URL off the page and `curl` it (cleaner than the
   download button). Save into the project's `audio/` folder.

## Output
An `.mp3` voice track in the consuming project (e.g. `yuli-y-ana/video1-crypto/audio/`).
Then lip-sync the Seedance clip to it (`seedance_2_0 --audio <track>` + a MINIMAL prompt — a verbose prompt
makes Seedance ignore `--audio` and invent its own speech; see `YULI-SPEC.md` Production route).

## Batch generation (BUILT — use it, don't hand-roll per-chunk clicking)
`_batch_generate.py <chunks.json> <audioDir> [SCRIPT.md]` drives all chunks for the CURRENTLY-SELECTED voice:
fills the prompt, clicks GENERATE, captures each `hf_*.mp3` cloudfront URL, writes `<audioDir>/_manifest.json`
incrementally. It does NOT download — `curl` the manifest URLs after. Two **pre-credit gates** (both abort
before the browser is even touched):
- **SCRIPT gate (3rd arg / `HF_SCRIPT` env):** runs `verify_tts.py` — every chunk's text must match the
  canonical `SCRIPT.md` (pronunciation/caps normalized). ⛔ **Always pass the SCRIPT.md.** Added 2026-07-16
  after `tts-chunks.json` was hand-authored from a stale draft and 10 chunks were voiced with wrong text
  (and QA falsely passed because it compared audio↔tts-chunks, not audio↔SCRIPT.md). Never author
  `tts-chunks.json` from memory — derive it from `SCRIPT.md`, then let this gate prove it.
- **VOICE gate:** aborts if the selected preset isn't `MIKE-CLONE` (override via `HF_VOICE`).

`verify_tts.py` is also a standalone check: `python verify_tts.py <SCRIPT.md> <tts-chunks.json>` → `ALL N MATCH`
(exit 0) or a per-chunk drift report (exit 1). QA the finished audio against `SCRIPT.md`, not `tts-chunks.json`.

## 2026-10-17 layout change: results are History cards, and the CLI lists them too
- The Audio page no longer mounts an `<audio>` element for a fresh generation. The result appears as a NEW
  **History card** (an `<li>` row, newest on top, with a `button[aria-label="Play"]`); its cloudfront mp3 only
  loads when that Play is clicked. `_batch_generate.py` therefore reported `timeout` for every chunk even though
  every generation succeeded (6/6 and 5/5 on the faithful-crypto-intro run). Capture paths that work:
  1. **`higgsfield generate list`** (the CLI, already authenticated) lists the `Text to Speech V2` jobs WITH their
     mp3 URLs, newest first: the simplest, no browser needed. Map by the `hf_<YYYYMMDD_HHMMSS>` timestamp in the
     filename (generation order = chunk order).
  2. `python _grab_history.py <voice> <N>` clicks Play on the N newest cards of that voice and captures the URLs.
- Voice preset picking: the card reads **"Selected Voice" with a "Change" button** (no "Voice Preset" text), and the
  custom presets are listed as lowercase cards `ana-2` / `yuli-1` / `MIKE-CLONE`: use **`python _pick_voice.py "yuli-1"`**
  (opens the picker either way and clicks the card by exact text).
- The voice GATE in `_batch_generate.py` reads the selected voice from the LEFT composer panel now (x<480);
  the old bottom-right geometry is kept as a fallback. Both compare case-insensitively.
- A logged-out `hfbot-profile` shows "Login | Sign up" in the nav and ONLY stock voices in the picker: the Google
  session had expired too (account chooser said "Signed out" and asked for the password), so this is a Mike action,
  not a script fix. After he logs in once, everything above works again.
- Pronunciation map additions: **Canton -> `Kanton`** (ANA-2 said "Hanten" for "Canton"; "Kanton" came out right,
  verified by two Whisper models). `verify_tts.py` normalizes `kanton` -> `canton` so the gate still passes.

## 2026-10-18: the Audio page has MORE TTS models, and the custom clones work on them
The Model selector lists **Seed Speech** (default), **Seed Audio 1.0**, **ElevenLabs v4 / v4 Turbo / v3**, **Qwen Audio 3.0 TTS**,
**MiniMax Speech 2.8 HD**. The custom clones (`ana-2`, `yuli-1`, `MIKE-CLONE`) stay selectable on all of them.
Driver: **`python _gen_model.py "<model>" <chunks.json> <outDir> ["voice details"]`** (picks the model, fills the Script
contenteditable + the optional Voice-details textarea, clicks Generate, then waits for the NEW completed job in
`higgsfield generate list --json` and curls its mp3). Verdicts from the faithful-crypto-intro Ana lines:
- **ElevenLabs v3 + the clone = the LIFELIKE route (Mike's "she sounds like a robot" fix).** Natural pace with NO atempo
  (Seed Speech + ANA-2 needed 1.3x and still read robotic), takes **inline delivery tags** in the Script:
  `[excited] [cheerfully] And welcome to Faithful Crypto!`, `[warmly] ... [laughs softly] ...`. 0.15 cr. `verify_tts.py`
  strips `[...]` tags so the SCRIPT gate still passes. Whisper-verified every line.
- **Seed Audio 1.0 = NOT for single lines**: it is a multi-speaker scene model (`@handle` script + "Voice details"); on
  Ana's lines it repeated the hello 3x and stretched one line to 28 s with dropped words. Do not use it for VO chunks.
- The Script box on this page is a **contenteditable**, not a textarea (the textarea is Seed Audio's Voice details).

## 2026-11-23: the skill is Python now (no JavaScript left in this folder)
- Every live script was ported one for one (`_batch-generate.js` -> `_batch_generate.py`, and so on) and the JS
  deleted. Same arguments, same output lines, same exit codes; `HF_CDP`, `HF_SCRIPT`, `HF_VOICE` unchanged.
- **Deleted, not ported** (each was already dead): `_select-mike.js` (clicked MIKE-CLONE by a hardcoded card size
  from the layout before 2026-10-17; `_pick_voice.py` does it by name), `_set-voice.js` (opened the picker by the
  "Voice Preset" label that layout change removed; same replacement), `_gen-line.js` (waited for an `<audio>`
  element the page no longer mounts, so it spent a credit and printed "(none found)"; use `_gen_model.py` or
  `_batch_generate.py`), `_gen-toccata-be.sh` (one past video's lines, driving `_gen-line.js`).
- **Behavior changes, all small:** `_generate.py` finds the new take the way the batch driver does (the new
  History card's Play), so it reports the URL again; `_login_probe.py` also accepts the nav button's new label
  "Get started" ("Login" is gone from the site since 2026-11); `_login_google.py` takes the account text as an
  argument (no address in this public repo); `HF_VOICE` is compared upper-cased; `_gen_model.py` writes
  `_manifest.json` after a failed chunk too, and downloads the mp3 itself instead of calling `curl`.
- **Checked on 2026-11-23:** `verify_tts.py` against the JS gate on every `SCRIPT.md` + `tts-chunks` pair in the
  repo, as is, with drift injected, and on single-chunk subsets (same report, same exit code). On the live Audio
  page, Python and JS run side by side printed the same thing for `_shot`, `_probe`, `_click`, `_probe_models`,
  `_probe_model_pick`, `_open_preset`, `_pick_voice`, `_fill_prompt`, `_grab_history`, and for both gates of the
  batch driver (script drift = exit 3, wrong voice = exit 2, no credit spent).
- **NOT checked, because it spends credits and the profile was logged out that day:** the Generate click and the
  take capture in `_generate.py`, `_batch_generate.py` and `_gen_model.py`, and picking a custom clone with
  `_pick_voice.py` (only stock voices show when logged out). The page code on those paths is the JS's, moved over
  unchanged. On the first real run read the output closely: one attempt.
- The profile needs Mike before any of that: Higgsfield shows "Get started", and Google's chooser lists the
  account as "Signed out", so `_login_google.py` cannot finish the sign-in (it never types a password).

## Notes
- Voice clone references Mike provided live in `yuli-y-ana/voice-samples/` (short, ~10%
  music bed).
- Do NOT generate Higgsfield voice without Mike's OK — it spends credits (root `CLAUDE.md` cost rule).
