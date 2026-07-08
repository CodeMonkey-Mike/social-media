# SKILL — Vertical AI-Persona Videos (WORK IN PROGRESS)

> 🛑 **HARD RULE — Seedance = 480p ONLY, never higher (root CLAUDE.md).** Every `seedance_2_0`
> generation, including throwaway tests/probes, MUST pass `--resolution 480p`. Never omit it (default
> is higher) and never use 720p/1080p. Remotion upscales 480p → 1080×1920 for free. Higher res only
> burns credits (480p=33cr · 720p=49cr · 1080p=99cr). See §3.

> **Status: WIP, 2026-05-30.** This documents the pipeline for Mike's vertical, AI-generated
> short videos as we learn it. It is *not* final — several items are still open (see
> **OPEN QUESTIONS**). Companion files: `TODO.md` (session state), `crypto-promo/storyboard.json`
> (the working manifest / source of truth). Background memory: `higgsfield-cli-setup`,
> `vertical-ai-persona` (project), and the feedback rules in `MEMORY.md`.

---

## 1. Concept

Vertical (9:16), AI-generated short videos of **Mike's real likeness** — crypto-themed, ranging
from funny fiction skits to serious commentary. Inspired by AI-influencer accounts
(mother.satori, iceman.healer, Yang Mun) but using Mike's real face/voice, not a fictional
persona. Full-body and multi-character scenes, not just talking-head. Tone: **sex appeal + humor**,
parody of testimonial ads + crypto-bro culture. Distributed via this repo's existing uploaders.

**First project:** `crypto-promo/` — a weight-loss-testimonial parody promoting Mike's community
**CryptoRich.vip**. Two acts: a grimy **clinic** "before" interview → a lavish **resort** "3 months
later." Supersedes/parks the `../longform-presentation/` plan.

---

## 2. The production model (THE BIG LESSON)

**The framing is the constant, not the variable.** Each act is ONE *locked static tripod framing*
— one camera, no moves, no angle changes — that simply watches the interview. Do **not** generate
each line as a new camera setup; that was the root cause of earlier consistency pain (every separate
shot reinvents the room, lighting, and wardrobe).

Within a locked framing, the conversation is built as a **sequence of generations**, and there are
two ways to do it:

- **(A) Single-generation multi-speaker** — one clip where both people take turns talking. Seedance
  2.0 **can** do this (validated this session, see §4). Best for short 2-turn exchanges. ByteDance
  documents multi-person lip-sync as a *weak* area, so keep it short and simple.
- **(B) One-speaker-per-generation chain** — each generation animates ONE speaker (other listens),
  then chain **last-frame → first-frame** (extract the final frame of clip N, feed it as the start
  frame of clip N+1) so the cut is invisible. The documented "reliable" path for longer back-and-forth.

Default: use **(A)** for tight 2-turn beats; fall back to **(B)** when a scene is long or (A) drifts.

**VALIDATED hybrid (2026-05-30, the clinic act) — this is the production pattern.** Combine A+B:
render each beat as a **2-turn** clip (A), then **chain consecutive clips last-frame → first-frame**
(B) so a long interview is built from short tight clips with invisible cuts. The clinic Q&A (6 turns)
= **3 clips of 2 turns each**, each clip starting from the previous clip's last frame. Every cut is
seamless (the woman's pose + mic position carry across the boundary) and each clip stays in the tight
≤2-turn pacing zone.

**Chaining workflow (every clip after the first):**
```bash
HF="/c/Users/mnede/AppData/Roaming/npm/node_modules/@higgsfield/cli/vendor/hf.exe"
# 1. extract the previous clip's LAST frame as this clip's start frame:
ffmpeg -y -sseof -0.1 -i clips/<prev>.mp4 -update 1 -q:v 2 keyframes/<this>-start.png
# 2. upload it and capture the id PROGRAMMATICALLY (never hand-type an id into medias.json):
ID=$("$HF" upload create keyframes/<this>-start.png --json | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
# 3. write medias.json via heredoc interpolating $ID (role image) + the two voice ids (role audio)
# 4. cost-check -> create --wait --json -> extract result_url programmatically -> curl (see §3/§4)
# 5. verify: ffprobe duration + silencedetect gaps + Whisper transcript (see §4)
# 6. sanity-check the chain: extract THIS clip's first frame, eyeball it == prev clip's last frame
```
**Gotcha (hit this):** inject the **freshly captured** upload id into `medias.json` — a stale or
placeholder id fails the job with `{"error_type":"other","text":"Media input not found"}` (auto-
refunded, but a wasted round-trip). Build the JSON with a heredoc that interpolates `$ID`, don't
edit a literal id by hand.

### Adding a NEW character into an existing scene (composite-keyframe trick, VALIDATED 2026-05-30)
To bring a new person into a locked two-shot **without a jarring camera change**, do NOT just feed a
separate keyframe of that person (it forces Seedance to cut/pan to a different framing). Instead:
1. **Build a composite still first** with Nano Banana: pass the scene's chain frame as ref #1 ("use
   this for scene, framing, lighting, the existing people") + a reference image of the new person as
   ref #2 ("also add this person, same face/wardrobe, standing here"). One image, all characters, in
   the real framing. (Did this for the friend → `keyframes/s3-friend-composite.png`; came out clean.)
2. Then generate the clip with the **chain frame** as the primary anchor + the **composite** as a
   reference, and prompt the new person to **walk in** during the line. The walk-in reads as natural
   motion in the held frame instead of a cut. (Friend entrance worked visually first try.)

### Hallucinated garbage audio can appear even on SHORT, SINGLE-VOICE clips
Multi-line audio distortion isn't limited to 2-voice / 3-turn clips. A 6s **single-voice** clip with
a short line hallucinated a garbled phrase *before* the real line ("The large dang its lawns, if he
keeps this up…"). Suspected cause: too much clip duration for the short line gives the model room to
invent filler audio. Mitigations: keep duration tight to the actual spoken length; always
Whisper-verify; re-roll on garbage (it's stochastic). This is the #1 reason to keep the Whisper check
in the loop even for solo lines.

### DANGER: never trim a clip by silence without confirming it is TRAILING silence
A `silencedetect` "gap" late in a clip is **not** automatically trailing dead air — it can be the
pause *before* a line that lands at the very end. Trimming on that wrongly **deletes the spoken line.**
(Did this: trimmed friend-q1 to 4.1s and cut off her whole "I just want to make him happy.") Before
trimming: cross-check the Whisper word timings — only cut after the LAST spoken word, never into a
silence that still has speech after it. The original render is recoverable from its `result_url` if
you act before it expires.

### Speaker baton: the moving mic
A single handheld mic that **moves from one mouth to the other** is the device that (a) gives the
model an unambiguous visual cue for who is speaking, and (b) supplies the only motion in an
otherwise static frame (so it doesn't look like a frozen photo). Validated — keep using it.

---

## 3. Higgsfield CLI essentials

- **Binary:** `C:\Users\mnede\AppData\Roaming\npm\node_modules\@higgsfield\cli\vendor\hf.exe`
  (the `higgsfield` command is a `.cmd` shim — Bash can run it, but Python `subprocess` cannot; call
  `hf.exe` directly). Auth: miguelneder@gmail.com, ultra plan.
- **Failures auto-refund.** A `failed` job is credited back immediately (verified in
  `account transactions`). So we can iterate on failing generations for free.
- **`generate cost <model> ...`** validates the request shape and returns the credit price **for
  free** — always cost-check before `create`.
- **Balance / spend log:** `hf.exe account status` and `account transactions --size N`.
- **Upload:** `hf.exe upload create <path> --json` → returns `{id, type, url}`. Media flags also
  auto-upload local paths, but for the talking-head `medias` JSON we pass explicit upload ids.
- **Generate:** `hf.exe generate create <model> --medias @file.json --prompt "..." --wait
  --wait-timeout 20m --json`. Add `--aspect_ratio 9:16 --resolution 480p --duration N`.
- **RESOLUTION = the biggest credit lever. Default to the LOWEST that still looks fine; Remotion
  upscales for free.** Cost for the same 11s 2-voice clip (verified 2026-05-30 via free `generate
  cost`): **480p = 33 cr · 720p = 49 cr · 1080p = 99 cr.** 480p is ~3x cheaper than 1080p, 720p ~2x.
  For talking-head footage that gets captioned and watched in-feed on phones, 480p/720p is
  indistinguishable from 1080p. All are 9:16 (480x854 / 720x1280 / 1080x1920), so the clip **upscales
  cleanly to the 1080x1920 Remotion timeline at zero credit cost** (`OffthreadVideo` scales
  automatically — no crop, no reframe, no Premiere step). **Current default: 480p** (low balance).
  Only bump a specific clip if it genuinely needs the detail. (crypto-promo #1 was done at 1080p
  before this was realized — that alone ~doubled the clip spend.)
- **Downloading the result — copy `result_url` VERBATIM; never reconstruct/guess it.** The finished
  clip's URL is in the create/get JSON response's `result_url` field. Its filename embeds the render
  *completion timestamp* and the full job *UUID* (`hf_<YYYYMMDD>_<HHMMSS>_<uuid>.mp4`) — **neither is
  predictable**, so hand-typing or pattern-matching a URL points at a nonexistent object. CloudFront
  then returns a ~111-byte `NoSuchKey` XML stub that saves as a fake `.mp4`, and ffprobe rejects it
  with "moov atom not found". **Extract the field programmatically and feed that exact string to
  curl** — take yourself out of the transcription loop:
  ```bash
  URL=$("$HF" generate create seedance_2_0 ... --wait --json | python -c "import sys,json;print(json.load(sys.stdin)[0]['result_url'])")
  curl -sS -o clips/<name>.mp4 "$URL"
  ```
- **`hf.exe model get <id>`** lists a model's params/defaults. **`model list`** shows all models.
- **Voiceover feature exists** (cheap, ~0.3 credits/clip — seen in transactions; likely website-UI).
  Probably how voice samples like `nichalia` were produced. Nuances the old "no TTS API" note;
  the *Audio-tab voice clone* is still UI-only. Not yet wired into our API flow.

---

## 4. Seedance 2.0 talking-head recipe (validated this session)

Model: **`seedance_2_0`** (the medias-array video model). Params:
`aspect_ratio, duration, genre, medias[], mode, prompt, resolution` (+ server-side
`generate_audio` default **true**, `reference_elements`, `multi_shots`, ...).

**Capacity (documented):** up to **9 images + 3 audio + 3 video** (12 assets total).

**The `medias` JSON** — each entry has a `role` and a `data` block:
```json
[
  { "role": "image", "data": { "type": "media_input", "id": "<upload_id>" } },
  { "role": "audio", "data": { "type": "audio_input", "id": "<voice_upload_id>" } },
  { "role": "audio", "data": { "type": "audio_input", "id": "<voice2_upload_id>" } }
]
```
- Use role **`image`** for reference frames — **NOT** the `--image` flag (the CLI remaps that to
  `start_image`, which the talking-head flow rejects).
- **Two voices in one generation WORKS and needs no per-character binding** — Seedance auto-assigns
  the right voice to the right person. Confirmed both in the UI and over the API.
- The supplied audio is a **voice timbre/sample**; the actual spoken words come from the **prompt**
  (`generate_audio: true` synthesizes them in that voice). Per Mike, keep the full ~13s sample —
  it's what the model uses to synthesize the voice; do **not** trim it just to shorten the clip.

**Prompt craft (matters a lot):**
- **Name each speaker and quote each line.** Dangling audios with no named-speaker attribution in
  the prompt was the likely cause of our first hard `failed` job. Documented best practice:
  *"keep dialogue short, quote spoken lines, and assign every line to a named speaker."*
- **Pass prompts VERBATIM** to Seedance — paraphrasing or dropping beats degrades the performance.
- **TICKERS / ACRONYMS — spell them phonetically in the spoken line or the TTS reads them as a word
  (CREDIT-WASTER, see also `persona-voice.json`).** "MYX" was spoken as "mix"; hyphenating to
  **"M-Y-X"** fixed it (she spells the letters). For an acronym whose letter would be mumbled or
  mis-rendered, write the letter phonetically instead: **"De-Agent AI" → "Dee-Agent AI"** so the "D"
  lands as a clear syllable. Always Whisper-verify the result; note "em"/"en" sound alike so an "M"
  may transcribe as "N" even when correct (confirm by ear, don't auto-re-roll on a maybe).
- Describe the **locked static camera** and the **mic-pass** explicitly.
- **AUDIO MODES (validated 2026-06-05).** Seedance has two talking-head modes, decided by the prompt:
  (1) **Synthesis** — audio media = voice *timbre* only, the spoken WORDS come from the prompt's quoted
  line + `generate_audio`; pronunciation steered only by spelling (caspa, see CONCEPT / persona-voice).
  (2) **External-audio lip-sync** — pass the FULL spoken-line audio (`--audio line.mp3` / medias role
  `audio`, do NOT pass `--generate-audio`); Seedance lip-syncs the face to the audio's actual words.
  **The decider is prompt verbosity: a MINIMAL prompt is required** ("a man speaking to camera, natural
  accurate lip sync to the spoken audio, locked static shot") — an elaborate/themed prompt makes
  Seedance ignore the audio and improvise its own monologue in that timbre.
- **Diegetic SFX (one specific sound):** Seedance CAN generate a named sound effect (e.g. a wet ooze
  squelch for an impossible-visual hook) if you POSITIVELY describe that ONE sound in the `Audio:`
  sentence and ban everything else (no music/voice/drone); use image-only medias (no `audio` role) so
  there is no timbre to synthesize. Can't Whisper-verify SFX (it tags non-speech as "[Music]"); confirm
  audio exists + non-speech via volumedetect, then judge by ear.
- **Kill the background bed with an explicit negative AUDIO directive (VALIDATED).** With
  `generate_audio: true`, Seedance otherwise invents a background *bed* — music / a choir-like
  tone / an ambient drone that runs the whole clip. Mike flagged it as an obvious, unwanted sound.
  Appending this sentence to the prompt removed it cleanly (confirmed by ear + the gap noise floor
  dropping to true near-silence): *"Audio: no background music, no musical score, no choir, no
  singing, no ambient drone, hum, or tone — the only sound is the two spoken voices in a quiet
  room."* Put it at the very end of every talking-head prompt.
- **Keyframe (still) prompts are VISUAL-ONLY** — if a spoken line is in a Nano Banana prompt it gets
  rendered as a baked-in comic **speech bubble**. (Dialogue belongs only in the Seedance video prompt.)

**Pacing & duration (VALIDATED 2026-05-30 — supersedes the old "duration is unresolved" note):**
- **The API DOES honor `--duration`** (8/9/10 all came back at their target length, ±0.06s). The
  earlier "API ignored duration / sized to audio" observation did **not** reproduce; treat duration
  as a reliable lever.
- **Shorter duration → tighter pacing.** The model fills the requested time around a roughly fixed
  ~1–1.5s mic-transit beat between speakers, so longer clips = more dead air. Measured mid-gap:
  12s→~2.6s (too much), 10s→2.5s, **8s→1.5s**, **9s (two longer lines)→1.2s**. Don't pad to fill time.
- **Sweet spots that worked:** a short 2-turn beat (e.g. clip 1's ~5s of speech) → **7s**; a 2-turn
  beat with one long line (clips 2–3) → **9s**. Rule of thumb: clip length ≈ total spoken time + ~1.5s
  for the single mid-transit beat. Pick the shortest duration that doesn't clip the last word.
- **≤ 2 turns per generation, always.** 3 turns @ 15s hallucinated the 3rd line into garble
  (ByteDance documents multi-line audio distortion). Two turns has been clean every time.
- **Verify every render objectively, not by vibes:**
  - `ffprobe ... format=duration` — confirm it hit the target length.
  - `ffmpeg -af silencedetect=noise=-35dB:d=0.4` — measure the actual gaps (catch dead air / a too-long beat).
  - Local Whisper (offline, no API key needed):
    `C:/Users/mnede/AppData/Local/Programs/Python/Python312/Scripts/whisper.exe <wav> --model base
    --language en --output_format txt` — confirm the **spoken words match the script verbatim**
    (this is how we caught a missing "So," — the words come from the prompt, so fix the prompt text).

**Working invocation (from `crypto-promo/`, bash, hf.exe directly):**
```bash
HF="/c/Users/mnede/AppData/Roaming/npm/node_modules/@higgsfield/cli/vendor/hf.exe"
"$HF" generate cost  seedance_2_0 --medias @_twovoice-test/medias.json --prompt "$PROMPT" \
  --aspect_ratio 9:16 --duration 12 --resolution 480p          # free shape+price check
"$HF" generate create seedance_2_0 --medias @_twovoice-test/medias.json --prompt "$PROMPT" \
  --aspect_ratio 9:16 --duration 12 --resolution 480p --wait --wait-timeout 20m --json
# then curl the printed result_url -> clips/<name>.mp4
```

**Single-character Soul-still + REAL-voice lip-sync (VALIDATED 2026-06-14, Yuli y Ana).** The
simplest path when the start frame is a trained Soul still and you have the person's real recorded
voice. Here the `--start-image` flag DOES work (the earlier "talking-head flow rejects start_image"
note was the multi-voice medians.json flow; a single Soul still as start_image is fine):
```bash
# 1. make the talking still from the trained Soul (9:16 waist-up, mouth mid-sentence, mouth visible)
higgsfield generate create text2image_soul_v2 --soul-id <SOUL> --aspect_ratio 9:16 --quality 2k \
  --prompt "Waist-up medium shot of <name> talking to camera, casual setting, lips gently parted mid-sentence ..." --wait
# 2. animate it, lip-synced to her REAL voice file (external-audio mode; do NOT pass --generate-audio)
higgsfield generate create seedance_2_0 --start-image still.png --audio "her-voice.mp3" \
  --aspect_ratio 9:16 --resolution 480p --duration <round(audio_seconds)> \
  --prompt "She talks to the camera naturally and casually, natural lip movement synced to her speech, small head movements, subtle hand gestures, realistic not cinematic. Keep her exact face from the start frame." --wait
```
- **Voice = the person's own recording** (Yuli y Ana decision) → external-audio lip-sync, NOT synthesis.
  Set `--duration` to the rounded audio length (10.8s→11, 13.06s→13). **480p ONLY — hard rule, never higher (root CLAUDE.md); Remotion upscales free.**
- Identity held in motion for both Yuli and Ana straight off their Souls; mid-clip hallucination can
  still appear (known Seedance artifact) — regenerate the shot or keep clips shorter.
- **GOTCHA — Soul-still on-image text leak.** Numeric/percent figure cues in a `text2image_soul_v2`
  prompt (e.g. "12-percent-leaner") leak as garbled BAKED-IN text on the image even with a no-text
  clause. Fix: phrase figure cues with NO digits ("slim healthy figure") and add a strong
  "Absolutely NO text, letters, words, captions or watermark anywhere in the image."
- **GOTCHA — Soul wardrobe/expression defaults.** Souls tend to default to gym-wear/sports-bra and a
  wide open grin. For a talk-to-camera clip, explicitly ask for a "casual-smart top" and "lips gently
  parted, calm expression, not smiling broadly" (also keeps per-persona no-wide-smile rules).

---

## 5. Keyframes (still anchors via Nano Banana Pro)

- **Consistency = anchor-first, never batch from independent prompts.** Lock ONE anchor frame per
  act (background + wardrobe + characters), approve it, then generate everything else in that act
  **referencing the anchor** so setting + clothing carry through.
  - Clinic anchor = `keyframes/s1a.png`. Resort anchor = `keyframes/s2a.png`.
- **Mike = direct references** (real photos in `identity/`), **no Soul** (Soul training failed on
  same-pose webcam shots → produced a generic person). Fictional characters use Nano Banana Pro from
  a locked base image (also no Soul).
- Recipe: `hf.exe generate create nano_banana_2 --image <anchor> --image <face_base> --prompt
  "<visual-only; 'exact same setting + lighting + same shirt as reference'; frame-relative gaze>"
  --aspect_ratio 9:16 --resolution 2k --wait`.

---

## 6. Characters

- **Mike:** real refs `identity/shot1-3.png` (+ body-angle shots); voice
  `identity/my-avatar-voice-13s.mp3` (timbre sample). No Soul.
- **Woman (fictional):** base `crypto-promo/characters/woman/base.png`; `before-base.png`
  (obese/clinic) and `after-base.png` (slim/resort) — identity survives the before↔after transform.
  Voice = `identity/female - nichalia - gentle, kind and sweet.mp3` (~10.8s; soft, feminine, not
  assertive — matches the brief). Wired into `storyboard.json` → `characters.woman.voice_file` and
  the s1-clinic woman turns.
- **Friend:** ~19, single shot (s2i), low consistency need.

---

## 7. Tooling (under `vertical-ai-persona/`)

- **`scripts/rebuild_storyboard.py [project-dir]`** — reads `<project>/storyboard.json`, emits a
  self-contained `<project>/storyboard.html` review dashboard (one card per scene, keyframe-first,
  swaps to video once a clip exists, Approve/Regenerate, total runtime). Re-run after any manifest
  change. Reads only top-level scene fields and **ignores unknown keys** — so nested data like a
  scene's `turns[]` array is safe to add for the clip generator. Renders two groups: the **scene
  storyboard** (keyframe-first plan) and, below it, a **"Generated Clips" gallery** that scans
  `<project>/clips/*.mp4` and shows the actual rendered output (separate from the plan).
- **`scripts/gen_keyframes.py`** — batch keyframe generator (Nano Banana Pro, anchor + face base per
  scene, strips dialogue from prompts, skips existing).

### storyboard.json structure
Top-level: `project, title, aspect_ratio, notes, voice_default, characters{}, scenes[]`. Each scene:
`id, order, character, duration, summary, dialogue, prompt, ref, voice, keyframe, clip, status`.
A **consolidated** scene (one locked framing covering multiple speaker-turns) additionally carries a
`turns[]` array — each turn: `{turn, speaker, summary, line, voice, prompt, start_frame, from_scene}`,
where `start_frame` is either a keyframe path or `"chain:prev-last"` (use previous clip's last frame).

---

## 8. crypto-promo — current state

- **11 scenes** (consolidated from 16 on 2026-05-30), ~1m 24s. Scene 1 (`s1-clinic`) = the whole
  clinic Q&A held in ONE two-shot, with 6 `turns`. Scenes 2–11 (`s2a`–`s2j`) are the resort act,
  still per-line (to be consolidated the same way later).
- **Keyframes:** all present; pre-split single keyframes archived in `keyframes/_archive-presplit/`.
- **Clips:** `clips/_twovoice-test.mp4` = the original 2-voice proof artifact (kept; `_`-prefixed so
  the dashboard gallery excludes it). **Clinic act DONE: 3 chained clips** (the 6-turn Q&A as 3×
  2-turn clips, chained last-frame→first-frame, anti-music directive, script-verified):
  - `clips/s1-clinic-q1.mp4` (7s) — turns 1–2: "So, when did your husband stop touching you?" / "Six months ago. Ever since he got into crypto."
  - `clips/s1-clinic-q2.mp4` (9s) — turns 3–4: "And what happened after that?" / "He stayed up all night staring at charts…"
  - `clips/s1-clinic-q3.mp4` (9s) — turns 5–6: "Aren't you worried other girls will chase him…" / "I've got no motivation… until I see some progress."
  - Chain start frames live in `keyframes/s1-clinic-q{2,3}-start.png`. Next: resort act (consolidate
    + render the same way), then assemble all clips → final vertical.
- Specific promo calls (keep VERBATIM): MYX 550x, De-Agent AI 130x, Pippin, Lab. CTA = CryptoRich.vip.

---

## 9. Editing — Remotion (VALIDATED 2026-05-30)

Rendered clips are raw material; the finished short is built on the Remotion timeline (the repo's
"motion timeline" lives at `video-creation/remotion/`). Validated full edit for crypto-promo:

**Pipeline:**
1. **Concat** the approved clips → `crypto-promo-FINAL.mp4` (the raw pre-edit reference) via the
   ffmpeg `concat` filter with re-encoded audio (all clips are uniform 1080×1920 h264 so they join
   cleanly): `[0:v][0:a]...[N:v][N:a]concat=n=N:v=1:a=1[v][a]` → libx264 crf 18, aac 192k, -r 30.
2. **Captions** — `scripts/build_captions.py` transcribes **each clip on its own clean audio** with
   local Whisper (`--model small --word_timestamps`), offsets each clip's word times by its cumulative
   position in the timeline, groups into ≤4-word groups (break on sentence punctuation), writes
   `_captions/captions.json` → then emit `remotion/src/cryptoPromoCaptions.ts`. **Per-clip+offset beats
   transcribing the concatenated file** — avoids cross-boundary word merging / drift.
3. **Composition** — `remotion/src/CryptoPromo.tsx` (registered in `Root.tsx`, id `CryptoPromo`,
   `durationInFrames` = ceil(totalSeconds × 30), 30fps, 1080×1920). Layers: `<OffthreadVideo>` base +
   karaoke captions + top title + end card.
4. **Render** — `npx remotion render src/index.ts CryptoPromo <out>.mp4 --codec=h264` (GPU per
   `remotion.config.ts`; `setPublicDir("../assets")` resolves staticFile from `video-creation/assets/`,
   so copy the source video to `assets/crypto-promo/`). **Output is always 1080×1920 regardless of the
   source clip resolution** — this is the free upscale that lets us generate Seedance at 480p (see §3).
   Preview a few frames first (`--frames=A-B`) before the full render.

**Caption style — "Mother-Satori karaoke" (the reference Mike wanted, from `watch/satori.mp4`):**
- 3–5 words on screen at a time, ALL CAPS, heavy bold sans, white with a thick black stroke
  (`WebkitTextStroke`, `paintOrder:'stroke'`), centered in the **lower-middle** (~bottom:470px).
- The **currently-spoken word gets a bright yellow highlight box** (rounded, `#ffd400`, dark text on
  top) that advances word-by-word in sync with the Whisper word timings. This karaoke advance is the
  signature look — NOT the one-word-swap style used by the livestream-repurpose shorts.

**Overlays validated:** a top title that fades in at a scene cut and holds ~5s ("SIX MONTHS LATER" at
the resort start), and a yellow end-card box on the CTA ("CryptoRich.vip", exact casing) timed to when
it's spoken. Both are simple time-gated absolute-positioned divs with spring/opacity in.

**Gotcha:** `rebuild_storyboard.py` was extended to show the EDITED cut in a "Final Clip" dashboard
section (prefers `crypto-promo-EDITED.mp4`, falls back to the raw `-FINAL.mp4`).

---

## 10. Distribution (VALIDATED 2026-05-30)

The finished short is queued + posted via the existing **schedule-tweets** shorts pipeline (NOT a
separate uploader dir). One queue entry → up to 7 platforms.

- **Queue file:** `schedule-tweets/data/shorts.json` → `shorts[]`. Copy the edited mp4 to
  `schedule-tweets/shorts/<batch>/<slug>.mp4`; set `video_path` relative to schedule-tweets root.
- **One entry, 7 platforms:** keys `yt_shorts, ig_reels, x, tiktok, facebook, rumble, bitchute`, each
  with independent `status` (pending→posting→posted→failed | skip).
- **Caption routing (the link-split pattern):** base `caption` is what TikTok/IG/X/Facebook use; each
  platform's `caption_override` (if set) replaces it. To put the **CryptoRich.vip link only on
  YouTube/Rumble/BitChute** (long-form-description platforms) and keep TikTok/IG/X/FB clean: set the
  base `caption` to the clean no-link version and put the link+disclaimer in `caption_override` on
  **yt_shorts, rumble, bitchute** only. (Mike's rule — see persona-voice.json `title_caption_split`.)
  ⚠ `post-yt-short.js` originally ignored its override (used `short.caption` directly) — patched
  2026-05-30 to `short.platforms.yt_shorts.caption_override || short.caption`.
- **Posting scripts** (run ONE AT A TIME — sequential-posting is a hard rule, see memory):
  `node scripts/post-rumble-short.js`, `post-bitchute-short.js`, `post-fb-short.js`,
  `post-tiktok-short.js` (kill Chrome first; it's `.js`, CDP-attached), `post-x-short.js`,
  `post-ig-reel.js`, and **YouTube via `post-yt-short-api.js` (API — preferred)** NOT the legacy
  `post-yt-short.js` (50MB Playwright cap; our shorts are 60–80MB so legacy can't attach them).
- **Known stale-URL gotchas (upload succeeds, captured `url` is wrong):** Rumble scrapes the prior
  channel video while the new one processes (treat Submit success as truth, backfill URL manually);
  Facebook grabs a perennial `/videos/<id>` at list position 0 — the real reel is the topmost `/reel/`.
- **Thumbnail note:** BitChute silently rejects `.webp` thumbnails — use PNG/JPG only (see memory).

---

## 11. OPEN QUESTIONS / TODO before this is final

- ~~Duration control is unresolved~~ **RESOLVED:** the API honors `--duration`; shorter = tighter.
  See the "Pacing & duration (VALIDATED)" block in §4.
- ~~Pause directive~~ / ~~pacing root cause~~ **RESOLVED:** dead air is the model padding the
  requested duration around a fixed ~1–1.5s mic-transit beat. The fix is **shorter duration + ≤2
  turns**, not a verbal pause directive. The audio-bed/tone is a separate issue, fixed by the
  negative audio directive (§4).
- ~~Resort act consolidation / clip generator / title card / assembly~~ **ALL DONE** — full pipeline
  ran end-to-end for crypto-promo (generate → edit → distribute). See §9 Editing and §10 Distribution.
- **Open:** keep a separate timbre sample, or use Higgsfield **Voiceover** to pre-generate exact spoken
  lines and supply those as audio (untested).
- **Open:** a `clip_gen.py` wrapper to turn storyboard `turns[]` into clips automatically (done
  semi-manually this time; the §4 chaining steps are mechanical and scriptable).

---

## 12. File map
```
vertical-ai-persona/
  SKILL.md                     <- this file (WIP)
  TODO.md                      <- session state / resume notes
  identity/                    <- Mike refs + voices; woman voice (nichalia)
  scripts/
    rebuild_storyboard.py      <- dashboard generator
    gen_keyframes.py           <- keyframe batch generator
  crypto-promo/
    storyboard.json            <- manifest (scenes + turns) — SOURCE OF TRUTH
    storyboard.html            <- review dashboard (generated)
    keyframes/                 <- s1a, s2a..s2j (+ _archive-presplit/)
    clips/                     <- _twovoice-test.mp4 (validated); finals go here
    characters/woman/          <- base/before-base/after-base + candidates
    _twovoice-test/medias.json <- validated 2-voice medias payload
  tests/                       <- earlier Seedance proof clips
```
