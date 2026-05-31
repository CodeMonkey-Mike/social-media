# vertical-ai-persona — reference notes

_Reference only (rules, Higgsfield gotchas, characters, tooling). The build log for the
first project (`crypto-promo/`) was completed and removed; crypto-promo is DONE (see the
`crypto-promo-complete` memory). The live pipeline lives in `SKILL.md`._

## The concept

**Vertical, AI-generated short videos of Mike himself** (his real likeness), crypto-themed,
ranging from funny fiction skits to serious commentary — inspired by AI-influencer accounts
(mother.satori, iceman.healer, Yang Mun) but using Mike's real face/voice. Full-body and
multi-character scenes, not just talking-head. Tone: sex appeal + humor, parody of
testimonial ads + crypto-bro culture. Distributed via this repo's existing uploaders.

---

## Higgsfield setup (see also memory `higgsfield-cli-setup`)

- CLI installed + OAuth-authed (miguelneder@gmail.com, ultra plan).
- **Windows gotcha:** the `higgsfield` command is a `.cmd` shim. Bash can run it, but **Python
  `subprocess` cannot** — call the real binary directly:
  `C:\Users\mnede\AppData\Roaming\npm\node_modules\@higgsfield\cli\vendor\hf.exe`.
- **NO text-to-speech API anywhere** (confirmed via Higgsfield Discord). The Audio-tab voice
  clone is website-UI only.
- `generate cost` validates a request shape for free before `create`. Failed jobs auto-refund.

---

## KEY LEARNINGS / RULES (don't relearn these)

1. **CONSISTENCY = anchor-first, never batch from independent prompts.** Generating every shot
   from its own text prompt makes each invent a different room, lighting, and wardrobe. Instead:
   **lock ONE anchor frame per act** (background + wardrobe + characters), get it approved, then
   generate every other shot in that act **referencing the anchor image** so setting and clothing
   carry through.
2. **Keyframe prompts must be VISUAL-ONLY.** If the spoken line is in the prompt, Nano Banana
   renders it as a comic **speech bubble** baked into the image. `gen_keyframes.py` strips quoted
   dialogue.
3. **Pass Seedance prompts VERBATIM.** Paraphrasing or dropping beats noticeably degrades the
   performance.
4. **Gaze is FRAME-RELATIVE**, not subject-relative. "Looking to my right" made the avatar look
   toward frame-right (= his anatomical left). Phrase gaze by frame side. (Matters for any
   PiP-corner layout.)
5. **Seedance talking-head recipe (proven, validated):**
   - References must use role **`image`** (NOT the `--image` flag, which the CLI remaps to
     `start_image` and the talking-head flow rejects). Submit an explicit `medias` JSON:
     `--medias @file.json` where each entry is
     `{"role":"image","data":{"type":"media_input","id":"<upload_id>"}}` (audio:
     `"role":"audio"`, `"type":"audio_input"`). Validate shape free with `generate cost` first.
   - Audio (voice) must be **≤ clip duration** (~15s cap) — trim long files (`ffmpeg -t`).
   - `generate_audio` defaults true server-side; it speaks the prompt's script in the supplied voice.
6. **Mike = direct references** (his real photos in `identity/`), no Soul. **Soul training failed**
   on 3 same-pose webcam shots (produced a generic young woman). Fictional characters use Nano
   Banana Pro from a locked base image instead (also no Soul).
7. **Two voices in ONE generation works, auto-assigned.** NO per-character binding, NO audio-label
   refs in the prompt (the "[Audio1]" idea was an untested guess and proved unnecessary). Recipe:
   attach the 2 audios in `medias.json` (role `image` for the anchor + role `audio` ×2) + a prompt
   that **names each speaker, quotes each line**, describes the **locked static camera** and a
   **mic-pass baton** (single mic moving mouth-to-mouth = speaker cue + only motion). Validated:
   `crypto-promo/clips/_twovoice-test.mp4`.
8. **PACING — keep each generation to ≤ 2 turns.** Failure edges: 2 turns @15s → dead air during
   the mic transit; 3 turns @15s → audio **hallucinates** the 3rd line (ByteDance flags multi-line
   audio distortion as a known issue). 2 turns @ ~10–12s is the sweet spot. Match length to the
   dialogue and build scenes as multiple short clips chained last-frame → first-frame; don't cram
   turns to fill time. **UI honors the duration value; the API does not.**
9. **Default generation to 480p.** Clips generated at 1080p are ~3× the credits, and Remotion
   upscales 480p to 1080×1920 for free. (See SKILL §3 + `persona-voice.json` `production_defaults`.)

---

## Characters

- **Mike:** real refs `identity/shot1-3.png` (close-ups) + 4 body-angle shots; voice
  `identity/my-avatar-voice-13s.mp3` (13s sample; the voice is a SAMPLE, the spoken line comes from
  the prompt).
- **Woman (fictional):** base face = `crypto-promo/characters/woman/base.png` (Caucasian, ~23,
  brunette, honey-amber eyes). `before-base.png` = obese/clinic (dirty white tee + grey sweats);
  `after-base.png` = slim/resort. Generated via Nano Banana Pro from the base; identity survives the
  before↔after transform. Female voice: `identity/female - nichalia - gentle, kind and sweet.mp3`
  (~10.8s, soft/feminine; likely made via Higgsfield's cheap Voiceover feature).
- **Friend:** ~19, AI-invented, one shot, low consistency need.

---

## Tooling (all under `vertical-ai-persona/scripts/`)

- **`rebuild_storyboard.py`** — reads `<project>/storyboard.json`, scans for each scene's
  keyframe/clip, emits a self-contained `<project>/storyboard.html` dashboard (dark card grid,
  Approve/Regenerate, total runtime, plus a "Generated Clips" group scanning `<project>/clips/*.mp4`).
  Re-run after any change. Usage: `python scripts/rebuild_storyboard.py [project-dir]` (default
  `crypto-promo`).
- **`gen_keyframes.py`** — reads the manifest, picks reference image(s) per scene from the
  `character` field (Mike's photo / woman before/after base / both for two-shots), runs Nano Banana
  Pro, saves to `<project>/keyframes/<scene.keyframe>`. Skips existing keyframes. Strips dialogue +
  bracketed notes (keyframes are visual-only). Uses `--wait-timeout 20m`.
- **`build_captions.py`** — per-clip Whisper transcribe + timeline offset → generates the Remotion
  caption track (e.g. `cryptoPromoCaptions.ts`).

---

## File map

```
vertical-ai-persona/
  SKILL.md                     <- canonical pipeline doc (source of truth)
  TODO.md                      <- this file (reference notes only)
  identity/                    <- Mike refs + voices; woman's voice
  scripts/                     <- rebuild_storyboard / gen_keyframes / build_captions
  crypto-promo/                <- first project (COMPLETE; crypto-promo-EDITED.mp4)
    storyboard.json            <- manifest (script, prompts, characters)
    storyboard.html            <- review dashboard (generated)
    keyframes/                 <- scene keyframes (+ archived variants)
    clips/                     <- generated Seedance clips
    characters/woman/          <- base.png, before-base.png, after-base.png, candidates/
  tests/                       <- earlier Seedance talking-head test clips (proof the recipe works)
```
