# longform-presentation / clip-insert: a montage of OTHER people's clips inside a SCRIPTED standard video

_Born on longest-bear (Mike, 2026-11-25): "show a montage of four or five clips of people saying that we're in a bull market
and the bear market's over ... a whole bunch of influential people". The longform-edited track has had clip inserts since
2026-10-09 (`../../../longform-edited/skills/clip-inserts/clip-inserts.md`); the presentation track had none. This is the
scripted track's version: ONE montage per video, spliced into the spine, no captions, no names._

## What it is
A script line `🎞️ [INSERT] CLIP-<NAME>: what plays` under a spoken line. Mike says the line above (the SET-UP) and ends the
sentence. The recording pauses at the end of its last word, the clips play back to back full frame with their own audio,
the recording resumes. A clip is NOT a muted cover: its voice is the point (longform-edited rule 2).

## The rules (Mike)
1. **No names, no captions** (2026-11-25). Nothing is burned on a clip, no band, no credit. The video never names a speaker
   and never says anyone was wrong (his standing rule, `persona.json` `avoid_in_drafts`): it only shows what was said. Names
   live in the private clips file for his review.
2. **Anyone newsworthy** counts: crypto influencers, news anchors, exchange and company executives, fund managers,
   politicians. Mix the kinds; no two clips from the same person or channel.
3. **The claim is backed by the clips.** The set-up line's claim (longest-bear: "two months ago, everybody was calling for
   the bear market to be over") needs each clip dated inside the window and in context (a real statement, never sarcasm,
   never "it is not over yet", never trimmed to change the meaning). A claim the clips do not back is cut from the script.
4. **Length:** each clip is the quoted seconds only, 3 to 12 s, 4 or 5 clips, so the montage is about 20 to 35 s.
5. **Mike picks before anything is downloaded.** Research writes `research/clips.md` (candidates with timestamped links,
   verbatim words, the in-context check); he rules which to use; then capture.
6. Prefer 16:9 clips with the speaker's own shot. A vertical clip is pillarboxed on the 16:9 frame (black bars): allowed, but
   looks small in a montage.

## Pipeline
| # | Step | Tool | Output |
|---|---|---|---|
| 1 | Find candidates | a research agent (WebSearch, yt-dlp metadata + captions, local Whisper to verify the words) | `research/clips.md` |
| 2 | Mike picks | he watches the timestamped links | the pick list in `research/clips.md` |
| 3 | Capture | `python video-creation/longform-edited/skills/clip-inserts/capture_clip_insert.py --url "<url>" --start MM:SS --end MM:SS --no-caption --expect "<a phrase>" --out "media/standard/<p>/assets/clip-inserts/CLIP-<NAME>-<n>-<slug>.mp4"` (audio kept, 1920x1080 / 30 fps, the words Whisper-verified) | `assets/clip-inserts/` |
| 3b | Hide names (a source's name bar, logo, ticker, plaque, set sign) | `crop_clip.py "<captured clip>" --out "<final clip>" [--rect X:Y:W:H \| --shot T=X:Y:W:H ...] [--key-black X:Y:W:H] [--blur ...] [--start/--end]`: a crop is the clean fix; one crop PER SHOT when the source cuts inside the clip; a big blur or a colour key looks pasted (longest-bear 2026-11-25: a clip whose set sign spelled the speaker's name was dropped) | `assets/clip-inserts/<ID>-<n>-<slug>.mp4` (raw captures in `_raw/`) |
| 4 | QA | `visual-qa` opens first, middle and last frames of each | |
| 5 | Splice (after the spine is final and Enhance Speech remuxed) | `python video-creation/longform-presentation/skills/clip-insert/clip_insert.py bake "<SCRIPT.md>" --spine "<final spine>" --words "<its words.json>"` | `spine/<stem>+clips.mp4`, `<stem>+clips.medium-words.json`, `overlays/inserts.json` |
| 6 | Cue + render | `cue_script.py ... --words <+clips words> --spine <+clips spine>`, then `cover_runs.py` | the covers end at the splice and restart after the clips; a hard cut each side |
| 7 | Music | `../music-bed/drone_bed.py` ducks the bed 14 dB under the clips | |

## How the splice works (`clip_insert.py bake`)
- **Where:** the set-up line is aligned to the transcript the way `cue_script.py` aligns it; the splice is 0.2 s after its last
  word (inside the pause the silence pass left), on a frame boundary, and the audio there must be silent (under -50 dB mean)
  or it FAILS with the level. `--allow-noisy` after Mike listens. Whisper sometimes butts the set-up's last word against the
  next one across a real pause ("not inside the pause"): measure the trough and pass `--at <seconds>` (the silence check still runs).
- **What moves:** every time at or after the splice moves later by the montage's length: the spine, the words JSON (a new file,
  the original untouched). So the cue and the render run on the `+clips` files; a re-bake always starts from the originals.
- **Loudness:** each clip is loudness-matched (loudnorm) to the voice's measured integrated loudness, 15 ms fades at its edges,
  hard cuts between clips. Video re-encoded once (crf 12), audio AAC 320 kbps.
- **Checks:** output frames = spine frames + clip frames, and the machine line says so (`CLIP-INSERT PASS|FAIL`). One
  `[INSERT]` per video; two fail with a clear message (extend when a video needs it).
- **The cue:** the previous line's window ends at the splice, the next line's starts where the clips end; no scene plays over
  them (they are the spine's own picture); a full-camera (face) window is never detected inside them (a pillarboxed clip has
  black side bars too).
- **Not built:** the vertical cut / short for a video with a montage.
