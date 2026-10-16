# FACE BACKGROUND SWAP, self-contained reference (comp-build.md section 3b)

_The complete recipe for regenerating the room behind Mike on a face window with Higgsfield Seedance 2.0, video-to-video.
Everything needed lives HERE and in `longform-edited/scripts/`; no project folder is the reference (project folders are
deleted after publish). Proven on kaspa-30bps F1 (2026-07-24), golden-kitty F1 to F5 (2026-10-02) and every-job F1 (2026-10-07)._

## Why this method, and the two things it never does
- Mike's face footage is NEVER chroma-keyed or AI-matted (keying eats face patches on the unevenly lit wall; matting
  "messes up my eyes"). The whole frame is REGENERATED from the footage, so his face comes back as a rendition of the take.
- **480p ONLY, every generation, including tests** (repo hard rule). Remotion upscales for free; 720p and 1080p only burn credits.

## Inputs you need before the first credit is spent
1. **The FINAL spine** (`spine/<scope>.<letter>.desilenced.mp4`) and its defumbled parent (`<scope>.a.defumbled.mp4`, for the handles).
2. **The face windows** on the final spine (AS-RECORDED.md "FACE windows" table, from blackdetect).
3. **The measured face reframe** `assets/face-reframe.json` (`python scripts/measure_face_reframe.py <media/<project>>`): the
   source clip is pre-cropped to it, so the swap clip airs full-frame with NO `FACE_REFRAME` in the comp.
4. **The joins inside long windows.** One generation is kept to about 5 to 8 s (an 11 s run redrew his shirt and changed his
   look; rejected). A longer window is split at a DESILENCER JOIN inside it (a jump cut already in the footage, so the seam
   between two regenerations hides on it). Find joins by mapping the spine maps: `<scope>.c.desilenced.map.json` (cuts in
   b-time) and `<scope>.d.desilenced.map.json` (cuts in c-time); `d = c - removed_before(c)`. Never split mid-take: two
   independent regenerations differ slightly and the seam pops where the footage has no cut.
5. **`--approx-src`** = where the window starts on `a.defumbled` (map back through the same maps; the script only needs it
   as a hint, it frame-matches from there and reports `match_mse` head/tail; the tail must be a close match, the head may be
   loose when the window follows a black lead because the head handle is thrown away anyway).

## The pipeline (all Python, `longform-edited/scripts/`)
```
# 1. source clip per (half) window: the window's own spine frames + un-blacked handles, pre-cropped, WHOLE seconds
python scripts/build_face_swap_source.py <media/<project>> --window <a-b> --name F<n>[a|b] --approx-src <s> --whole-seconds [--handle 0.25]
#    -> assets/face-swap/F<n>-raw-for-higgsfield.mp4 + .json   (machine line FACE-SWAP-SOURCE ...)
#    Seedance's shortest clip is 4 s: a window under about 3 s needs --handle 0.9 to reach it.
# 2. the REAL voice as the audio reference (real silence handles, concatenated, never adelay)
python scripts/build_swap_voice_ref.py <media/<project>> F<n>a F<n>b          # SWAP-VOICE-REF ok|FAIL
# 3. the backdrop reference image (no person in it): see "Backdrop reference" below
# 4. generate (480p, --duration = the clip's whole seconds, the three references)
python scripts/gen_face_swap.py <media/<project>> F<n>a --backdrop assets/face-swap/<backdrop>.png --prompt-file assets/face-swap/swap-prompt.txt
#    -> _previews/qa/bg-swap/F<n>a-returned.mp4 (+ -gen.json, -gen.cmd.txt)   (SWAP-GEN ok|FAIL; about 3 credits per second at 480p)
# 5. re-time the picture onto the real voice (dynamic time warping on loudness envelopes; the model's own speech pacing drifts)
python scripts/retime_swap_to_voice.py _previews/qa/bg-swap/F<n>a-returned.mp4 _previews/qa/bg-swap/F<n>a-audio.mp3 --out assets/face-swap/F<n>a-higgsfield-bg-swap.mp4 --source-json assets/face-swap/F<n>a-raw-for-higgsfield.json
#    must print SWAP-RETIME ok (residual 60 ms or less, 90 percent or more of the speech windows locked); a FAIL clip does not air
# 6. join the halves (the first from its clip start to its window end, the rest from their window start), sidecar written
python scripts/join_face_swap_halves.py <media/<project>> F<n> F<n>a F<n>b    # SWAP-JOIN ok ... window_starts_at_clip_s=
```
Output per window: `assets/face-swap/F<n>-higgsfield-bg-swap.mp4` (864x496, upscaled by the comp, 30 fps, video only) and
`F<n>-higgsfield-bg-swap.json` naming `window_starts_at_clip_s` and `window_s`. The comp lays it over the face window from
`window_starts_at_clip_s`, full-frame, spine audio kept, the comp's own punch-in subtle or off on a swapped window.

## Backdrop reference (the image reference the model copies the room from)
Make it FROM A CROPPED FRAME of the source clip so the framing matches, with Nano Banana Pro, and keep it EMPTY (no person):
```
higgsfield generate create nano_banana_pro --image <frame.png> --aspect_ratio 16:9 --resolution 2k --wait --json --prompt "Edit this photo: remove the man, the microphone and its boom arm, <every object to erase>. Leave ONLY one flat, bare <wall> filling the entire frame edge to edge: no ceiling, no floor, no corners, no fixtures, no objects, no text. Keep the exact same lighting as the photo: <describe the light>. Same camera, lens, exposure and grain as the photo."
```
Say "no ceiling, no floor, no corners" or the model draws a room corner. The generated file is the `hf_*.png` URL in the JSON
(the first sorted URL is the uploaded reference, not the result). Save it as `assets/face-swap/backdrop-reference-<look>.png`.
Once a swap clip is approved, a frame of IT can be passed as a second image reference so every window gets the same room.

## The prompt (template; proven wording, every-job F1 2026-10-07)
Lock the man, his clothing, the mic position and the lip sync; replace ONLY the room; describe the wall and the light:

> Keep the man exactly as he is in the reference video, frame for frame: the same face, the same green eyes, the same dark
> curly hair, the same <clothing, e.g. dark charcoal crew-neck sweatshirt>, the same head movements and the same lip
> movements, in sync with the reference audio. Keep the black microphone with its round foam windscreen at the lower centre
> and its boom arm at the lower right exactly where they are. Replace ONLY the room behind him with the wall from the
> reference image: <the look, e.g. one flat, bare white wall filling the entire background, with the strong diagonal blue
> light beam sweeping up from the lower left and fading to warm white on the right>. No door, no wall plate, no pinned
> card, no light fixture, nothing on the wall, no text. Same camera, same framing, same lens, same lighting on his face, photoreal.

Mike's eyes are GREEN; say so, or the model may hand back brown. Keep the per-video prompt in `assets/face-swap/swap-prompt.txt`.

## QA before Mike sees it
- A contact sheet of the returned clip (a frame every second): his face and eyes, the shirt, the mic and arm, no leftover
  door, fixture or card, the wall and light consistent between halves.
- `SWAP-RETIME ok` on every half, then a preview WITH the real voice, `_previews/qa/bg-swap/F<n>-preview-with-voice.mp4`
  (swap clip from `window_starts_at_clip_s`, spine audio for the window), and a before/after strip for the first look.
- Mike gates the look on the FIRST window before the rest are generated.

## Costs (480p, 2026-10)
About 3 credits per second: a 5 s half is 15, an 8 s half is 24; a 10 s window built as two halves is about 40 credits.
Nano Banana Pro backdrop reference: a few credits. A 502 from the CLI still bills and completes: fetch the job, do not resubmit.

## Known failure modes (each cost real credits once)
- Voice reference built with `adelay` (no leading silence): the voice ran ahead of the picture, 45 credits lost. Use the script.
- Clip not a whole number of seconds: Seedance stretches it to the integer `--duration`, lips drift. `--whole-seconds` always.
- One 11 s generation: shirt redrawn, look changed. Halves at footage joins.
- Returned audio is the model's own speech: throw it away, re-time the picture to the real voice, keep the spine audio.
