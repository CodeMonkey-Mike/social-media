# elevenlabs-lipsync — skill

Drive the **ElevenLabs "Image & Video" lip-sync playground** (UI-only, no API) via Playwright/real
Chrome to turn a **face image + a speech audio file** into a lip-synced talking-head clip. Built to
generate AI talking-head shots of Mike to drop into the **free-space beats** of a longform edit
(where there's no b-roll or container overlay) instead of plain webcam.

**Status: BUILT + validated end-to-end 2026-06-11** on the `banks-own-chain` experiment (see that
project's PROJECT-LOG.md). Realizes the long-standing "drive the playground UI with Playwright"
decision (global memory `reference_elevenlabs_lipsync_ui_only`).

## One-time login
```
node setup-elevenlabs.js
```
Real Chrome, dedicated `elevenlabs-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\elevenlabs-profile`).
Log in once; session persists. Never use the main Chrome profile; never kill all Chrome.

## Create a lip-sync
```
node lipsync-create.js --image <face.png> --audio <line.wav> [--model "Creatify Aurora"] [--generate]
```
- Default **stages and stops** before Generate; add `--generate` to actually submit.
- Anti-automation built in (house pattern): real Chrome, `webdriver` masked, hover->randomized
  pause->click, randomized action delays, per-character typing for any text.

## Fetch the finished render
```
node fetch-result.js --out <result.mp4> [--minutes 8]
```
Polls **History**, scopes to the most-recent **Creatify Aurora** card, downloads its video by
direct URL, and verifies it's an mp4 (`ftyp`), not an image.

> **`fetch-result.js` scrapes the History inline `<video>` preview, which is MUTED / video-only — the
> downloaded file has NO audio stream (2026-06-21).** That is fine for the edit (lip-sync clips are muted
> in the comp; the spine audio carries). But to get the render **WITH AUDIO** (to review/compare lip-sync
> quality), use **`fetch-download.js --model <name> --out <path>`** instead — it navigates History the same
> way, then clicks the card's `aria-label="Download"` button to capture the real muxed export. Do NOT try to
> mux the input audio back onto the silent preview — the Sync video→lipsync models add a ~0.2-0.3s lead-in,
> so the audio ends up ahead of the lips. (Built 2026-06-21.)
>
> **VIDEO→lipsync models** (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync) take a driving clip via `--video` on
> `lipsync-create.js` (not `--image`); all three accept an uploaded video with no region-block (verified
> 2026-06-21). They output ~480p video-only previews; fetch the audio export with `fetch-download.js`.

## Flow / selectors (validated 2026-06-11 — update here + scripts when EL changes the DOM)
- App: `https://elevenlabs.io/app/image-video`. Left nav item "Image & Video" = `/app/image-video`.
- Composer modality is a radio set: **Image / Video / Lip sync**.
- Model pill (lip-sync default "Veed Fabric") opens a menu; lip-sync models include **Creatify
  Aurora** (highest quality, "guided lip sync from image"), HeyGen Avatar 4, Sync 3, Veed Fabric,
  Sync Lipsync 2 Pro, OmniHuman 1.5, Veed Lipsync.
- Two file inputs, mapped by `accept`: **image input** (`accept*="image"`) = the **Avatar/face**;
  **audio input** (`accept*="audio"`, accepts .wav/.mp3/.m4a/.aac/.ogg) = the **Speech** track.
  `setInputFiles` directly on these (no need to click the drop zones).
- Submit = an **icon button with `aria-label="Generate"`** at the composer's bottom-right (NOT a
  text button).
- First-ever generation shows a one-time **"Prohibited Use Policy"** modal -> click **"Continue
  with Generation"**.
- Result lives in the **History** sub-tab; the finished video src is a public
  `storage.googleapis.com/xi-backend/...` URL (fetch within the page session).

## Model input modality — NOT all lip-sync models take an image (confirmed 2026-06-12)
Some lip-sync models are **image -> lipsync** (feed a face photo); others are **video -> lipsync**
(feed an existing talking-head video to re-sync to new audio). The image file input simply won't
exist for video models — `lipsync-create.js` then times out on the image upload. Verified via
`probe-model.js --model "<name>"` (reports each file input's `accept`):
- **IMAGE -> lipsync:** Creatify Aurora, **HeyGen Avatar 4**, **Veed Fabric** (accept = jpg/png/webp).
- **VIDEO -> lipsync:** **Sync 3** (accept = mp4/mov/mkv/webm...). Needs a driving video, not a still.
- **OmniHuman 1.5 = REGIONALLY BLOCKED for uploaded faces (confirmed 2026-06-19).** It rejects any
  uploaded photo with a toast: *"This model only accepts AI-generated references in your region.
  Replace any uploaded references and try again."* It's an anti-deepfake/likeness rule — it treats an
  uploaded face as a possibly-real person and only accepts a face generated INSIDE ElevenLabs. The
  submit then **silently fails to register a render** (status hints empty), and a follow-up fetch
  grabs a stale clip. For ANY uploaded or AI-persona face, use **Creatify Aurora or HeyGen Avatar 4**.
  (Sync Lipsync 2 Pro, Veed Lipsync still untested — probe first.)
- **HeyGen Avatar 4 = image->lipsync, accepts uploaded faces (validated 2026-06-19)** — the working
  alternative when OmniHuman is blocked; outputs ~9:16 480-ish.
`probe-model.js` is read-only (never generates); use it whenever you try a new model.

## Content moderation — "high-risk financial advice" block (proceed AUTONOMOUSLY)
ElevenLabs **prohibits high-risk financial advice**, and its moderation flags **superlative / promissory
crypto-investment claims**. Confirmed 2026-06-22: the line *"Covenants put Kaspa lightyears ahead of every
other crypto"* was **blocked 3x** while neutral explainer sentences with the SAME face/persona passed.
- **Symptom:** the `--generate` submit prints **empty `status hints: []`** (a healthy submit shows a
  percent, e.g. `["3%"]`), and the History top card reads **"Generation failed — may violate our Terms of
  Service and has been blocked."** A follow-up fetch then silently grabs the PREVIOUS finished clip (looks
  like a duplicate) — always transcript-verify (see the duplicate-render trap below).
- **It's the VIDEO render that's moderated, not the audio.** Higgsfield/TTS will happily speak the claim;
  only the ElevenLabs lip-sync of it is blocked. So the line can stay in the VO track — only its FACE is blocked.
- **How to proceed WITHOUT asking (Mike, 2026-06-22 — don't stall on this):**
  1. Identify the offending sentence (the superlative / price / return / "best" / "lightyears ahead" /
     "X will moon" financial claim).
  2. **Re-cut the face-scene audio to just the benign 1-2 sentences** (extract from the VO, drop the claim
     sentence) and re-submit. (What worked here: shortening the close to only *"This changes what a coin
     can be."*)
  3. **OR drop that face scene entirely** — leave it BLACK + audio (the VO still speaks the full line;
     only the lip-synced face is omitted). Either is fine; pick by what the edit needs and keep moving.
  4. Best prevention: when scripting face beats, keep promissory financial claims OUT of the sentences
     that need a lip-synced face (put them in black / b-roll-covered beats instead).

## HARD RULE — always 480p
The composer **defaults to 720p**. ALWAYS set the Resolution to **480p** before Generate (Creatify
Aurora and every model). Reasons: the project's 480p philosophy (Remotion upscales 480p → 1080 for
FREE — root `CLAUDE.md`), AND it spends less of the limited ElevenLabs video allowance. Mike's rule,
2026-06-19. `lipsync-create.js` now selects 480p automatically (rect-based click on the Resolution
menu, non-fatal so it never blocks Generate). Override with `--resolution`.

## Fetching the RIGHT render — the duplicate-render trap (learned 2026-06-19, the hard way)
Renders land in the **History** sub-tab of Image & Video, newest at the TOP. `fetch-result.js` grabs
the TOPMOST card naming `--model`. This is reliable ONLY when your render has FINISHED.

**The trap:** while your newest render is still cooking it shows **"Almost done…"** with a blurred
placeholder and **no `<video>` element yet**. `fetch-result` then skips it and falls through to an
OLDER finished render of the same model — so you silently download the WRONG (old) clip. This bites
hard when several renders of the same model pile up in History (e.g. multiple Creatify Aurora takes).
On 2026-06-19 this burned ~an hour: it kept grabbing an old Yuli clip, then a duplicate Aurora take.

**Rules:**
- **WAIT for the render to finish before fetching.** A fetch that returns "done" instantly (no
  "rendering… %") almost certainly grabbed an OLD clip — re-fetch once the top card has un-blurred.
- **ALWAYS content-verify the download — never trust it.** Transcribe it (local Whisper), check the
  duration, and diff the md5 vs the previous clip. Wrong transcript/duration = you grabbed a stale render.
- **Don't trust History-tab navigation from ad-hoc scripts** — they often stay on **Explore** and
  scrape the avatar-PRESET preview videos (6–11s) instead of your renders. `fetch-result.js` itself
  DOES reach History; check its `el-history2.png` screenshot to see what it actually saw.

> General technique (not a rule): if a lip-sync clip's pace doesn't match the edit, you can speed the
> finished clip (ffmpeg `setpts=PTS/N` + `atempo=N`, video+audio together) instead of re-generating —
> it keeps lip-sync locked and costs no allowance. WHEN a clip is too slow is voice-source-specific
> (e.g. Ana's ANA-2 take, see ANA-SPEC), NOT a property of ElevenLabs or of TTS in general.

## Compositing a lip-sync clip over a SEPARATE VO track — trim the lead-in (learned 2026-06-19)
If you assemble lip-sync clips into a timeline that plays a **separate continuous VO** (clips muted,
one clean VO bed under everything — the usual way for a multi-scene edit), beware: each lip-sync clip
has a **lead-in** — the speech/lips start ~**0.2–0.35s** AFTER the clip's frame 0 (measured: Seedance
0.34s/0.23s, Aurora 0.31s/0.34s, HeyGen 0.21s — every renderer does it). Placing the clip at the scene
boundary makes the **lips LAG the VO** by that much (very visible on the worst one). The clip looks
fine played alone (its own audio carries the same lead-in), so the bug only shows in the assembly.
**Fix:** measure each clip's speech onset (`ffmpeg -af silencedetect=n=-32dB:d=0.08`), then trim that
many frames off the clip's start (`OffthreadVideo startFrom={frames}` / `trimBefore`) so the lips land
on the VO word. Per-clip trim = onsetFrames − (VO-word-frame − scene-start-frame).

## GAZE comes from the DRIVING clip, not the model (2026-06-21)
For video→lipsync models, the head/eye direction is inherited from the **driving clip** — the model re-syncs
the mouth but preserves pose. So if the talking-head looks **off-camera**, the fix is a **straight-gaze driving
clip**, NOT a text prompt (Sync/Pro/Veed have no usable gaze prompt — text lands in the page search box) and NOT
a different model (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync all preserved an off-gaze source equally). Verified
on the kaspa-covenants ch1 faces: Bittensor cold-open footage = locked-on-camera (good); mid-roll/conversational
footage = glancing down/aside (bad). **Always pull the driving clip from a span where he's dead-on the lens, and
VIEW frames of the output to confirm before accepting.**

## Gotchas / quality notes
- **One-time announcement popovers** (e.g. "GPT Image 2 just launched!", a radix popper) can overlay
  the composer and intercept pointer events -> clicks time out. `lipsync-create.js` now dismisses
  them first (`dismissPopovers`: named close button / Escape / corner click). Added 2026-06-12.
- `fetch-result.js` takes **`--model`** (default Creatify Aurora) to scope the History card to the
  right model — required when generating with HeyGen/Sync/Veed/etc. (generalized 2026-06-12).
- **Output aspect = the input image's aspect** (image models). HeyGen Avatar 4 instead reframed to
  9:16 (480x854) from a 3:4 source; Veed Fabric preserved source aspect (480x628). Both came back
  480p — **upscale before a 1080p timeline.**
- **Output aspect = the input image's aspect.** A portrait face crop -> a portrait clip
  (experiment produced 480x628). For a 16:9 timeline, feed a 16:9 face frame or plan framing.
- Output came back ~**480p**, below Aurora's nominal 720p; **upscale (Topaz) before a 1080p
  timeline.** Higher-res / more frontal face source (e.g. from the master .mkv, not the webcam PiP)
  will help.
- The composer's "N left" counter is a **separate video-generation allowance**, not the account's
  voice/character credit balance.
- One generation = one render; renders run server-side (a few minutes for a ~4s clip).
