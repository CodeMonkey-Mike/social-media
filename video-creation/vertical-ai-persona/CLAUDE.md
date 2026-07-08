# vertical-ai-persona — routing + lessons (auto-loaded when working in this folder)

**Canonical skill is `SKILL.md` (this folder) — read it for the Seedance/keyframe/edit/distribute
pipeline.** This file routes + records cross-session lessons that aren't obvious from SKILL.md.

## Repurposing a longform into a vertical short (VALIDATED 2026-06-22, kaspa-covenants-short)

When a vertical short is "the same as a longform we just did, shorter and vertical," reuse the
longform's pipeline and assets — do NOT rebuild from scratch. The exact flow that worked:

1. **Spine = defumble -> desilence -> bake faces** (same canonical tools as longform):
   - Desilence the defumbled `raw EDIT.mp4` with the canonical `desilencer` (min-silence per Mike,
     **200 ms** here -> 55.2s to 24.1s, rapid-fire). QA for swallowed speech (none).
   - Bake the lip-synced face clips into the desil spine with the longform's
     `longform-edited/media/<lf>/bake-faces.py` (xcorr locate, no EDIT->desil map needed). It scales
     clips to **1920x1080**, so the baked spine is **16:9** even for a vertical short.
   - The faces are 16:9 webcam clips; in the 9:16 comp the spine is shown **`objectFit: cover` with
     `objectPosition: '50% 22%'`** (bias UP so his head isn't cropped). Cover-cropping a 16:9 face to
     9:16 is the intended path — don't letterbox.
2. **Containers are LIVE React, re-laid for vertical — NOT PNG re-renders.** The longform's
   `KaspaCovenants.tsx` builds C3b/C5b as React components; the short mirrors them as vertical
   variants (bigger type, stacked, content in the **upper 2/3** so the caption band at `bottom:470`
   stays clear). The `kaspa-covenants-containers.html` is only a proof source, not the render path.
3. **Captions = canonical `skills/captions` `arial-black` karaoke** (AI-persona Mother-Satori look),
   transcribed off the **baked spine**. CORRECTIONS already fixes casper->kaspa; verify "royalties"
   etc. Output `captions.json` -> a `src/<name>Captions.ts` module (mirror `cryptoPromoCaptions.ts`).
4. **FACE transitions in vertical = HARD CUT + glitch SFX** (`sfx-blocks-max.mp3` from the longform
   transition lib). The Blocks **mask** engine is authored 16:9; re-authoring masks for 9:16 is not
   worth it for a 24s teaser, and the SCRIPT sanctions hard-cut+SFX. Glitch SFX at ~0.55 vol sits at
   VO peak level (not above) — good.
5. **Audio mix lives IN the comp** for a short (`<Audio>` music + SFX + the spine's own VO via
   `<OffthreadVideo>`). No separate ffmpeg post-mix (that's a longform-only thing for its 29-cue
   mix). Music bed = reuse the longform's approved level: **Race Against Time @ vol 0.04** (~16-18 dB
   under VO; source is -13.2 LUFS).
6. **Render** with `--public-dir <project>/render-assets` (per-project assets, like longform). Draft
   at `--video-bitrate=300k` first, then `--crf=18` final.

### Black-dip gotchas at face<->cover boundaries (both bit me, both fixed)
- **Fade-in over a black spine flashes black.** After a baked FACE window the spine returns to BLACK
  (only that one line got a face). If the next cover *fades in* starting exactly at the face-out, the
  fade exposes ~0.1s of black. **Fix: start the cover ~0.12s BEFORE the face window ends** (cover the
  face's silent mouth-close tail — check the word timings, the speech ends before the window does).
- **The spine has a black tail after the last line.** Bake leaves a short black/silence tail at the
  end. **Trim `durationInFrames` to the last face frame** (use `blackdetect` to find where black
  starts) so the short ends on the face, not a black flash.
- Always run `ffmpeg -vf blackdetect=d=0.08:pic_th=0.98` on the final; target ZERO gaps.

### Lip-sync face clips
- Driving-clip gaze rule from the longform applies: a straight-on driver = straight-on result.
- A 1-2s face "pop" in a short shows the clip's whole speech; FACE RULE here = **<=2s each, exactly
  3 pops**, even mid-sentence (cut to b-roll for the rest of the sentence; the spine VO keeps playing).

Deliverable of that session: `media/kaspa-covenants-short/renders/kaspa-covenants-short-FINAL.mp4`
(1080x1920, 24.0s, 17 MB). EDIT-PLAN + CUE-SHEET + PROJECT trail in that folder.
