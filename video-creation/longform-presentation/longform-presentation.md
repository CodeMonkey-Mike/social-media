# longform-presentation — the track

Record-and-edit pipeline for a 16:9 presentation video: Mike records himself over a slide deck (or over a live
screen share with no deck: crypto charts, or VS Code while coding), the recording is cleaned into a spine (except
the coding format, which ships as recorded with music under it), and, when there is a deck, the deck is
re-rendered as a **spotlight presentation** (one container at a time, cued to his words) with the as-filmed intro
and close kept. Track-specific policy lives in `skills/` (one folder per skill, index `skills/README.md`), on top of
the shared `video-creation/skills/` (defumbler, desilencer, gaze, captions, ...).

## The three formats (Mike, 2026-10-16: these are the typical ones, anything else is rare)

Identify the format FIRST, from the folder contents and Mike's ask; it decides which phases run at all. The track
exists because these are much less effort than longform-edited, so never run a phase the format does not list.

| Format | Example | Phases | Audio | Goes to |
|---|---|---|---|---|
| **1. Slide-deck lecture** (a deck `.html` in the folder, "Section N · Lecture M" eyebrow) | history-of-crypto 2026-10-13, QE 2026-06-06 | 1 defumble -> 2 desilence -> 3 transcribe -> 4 spotlight | the EDIT's own track; Mike runs his own Enhance Speech pass after acceptance | his Whop course (`whop.com/cryptorich`), uploaded by him |
| **2. Crypto-chart screen share** (TradingView / DexScreener, webcam PiP, no deck) | what-to-buy 2026-10-13 | 1 (only if the take has retakes) -> 2 desilence; the EDIT is the deliverable, crf 18 | the EDIT's own track | his public uploads, by him |
| **3. VS Code coding screen share** (single take, coding live while talking) | print-function 2026-10-16 | **NO edit at all**: no defumble, no desilence, no transcribe. Music only: `skills/music-bed/` + a series thumbnail `skills/thumbnail/` | intro sting + elevator bed mixed under the untouched voice; no Enhance Speech | the **AI Engineering Simplified** YouTube channel ("Learning Python" series), uploaded by him |

Format 3 is expected to be the MOST common (many Python coding videos). Why no edit: it is one deliberate take,
fumbles are fine, and the silences are content: Mike may be typing code without speaking and the viewer must not
miss it. The deliverable is the master with music under it, the picture stream-copied (frame count = master's).

Either way the deliverable is an absolute path and MIKE uploads it himself: nothing on this track is staged to
`longs.json` or `batches.json`, ever.

## Folder convention

```
media/<project>/                   the FOLDER name is the project name (OBS names the master by timestamp)
  <timestamp>.mkv                  master raw (OBS, ~6 Mbps 1080p30) — never edit, never delete
  <deck>.html                      the slide deck used in the recording (deck recordings) + the script (.docx/.txt)
  <project> DEFUMBLED.mp4          Phase 1 (only when the take has retakes), libx264 crf 18
  <project> EDIT.mp4               Phase 2 deliverable spine + <project> EDIT.map.json (its cut/keep map)
  <project> EDIT.medium-words.json Phase 3 word-level transcript of the FINAL spine
  <project>.scenes.json            Phase 4 scene spec (+ .resolved.json, generated)
  render-assets/ _previews/ _qa/   Phase 4 render public-dir, parts + logs, QA frames
  <project> FINAL-vN.mp4           Phase 4 deliverable (format 1), or the music-bed output (format 3)
  raw/<timestamp>.mkv              format 3: Mike drops the master in a raw/ subfolder (either place works)
  thumbnail/                       <project>-thumb.jpg (the winner, alone at this level) + reference-<id>.jpg + takes/
```
There is no LOW BPS working copy on this track any more: every tool here reads the master (chunk map, Whisper,
desilencer) and the one lossy generation is the crf 18 spine, which keeps on-screen text sharp (decided
2026-10-13; the old `to_low_bps.py` was recycled).

## Recording notes (what the next recording should get right)

- **No noise gate and no noise suppression in the mic chain** (OBS mic filters, NVIDIA Broadcast, Krisp, the
  mic's own DSP). The history-of-crypto master was gated: 47% of it exact digital zero, word-final fricatives
  20 dB under the vowels, so quiet endings ("banks", "age") were chopped in the RAW file and no edit pass could
  restore them (`skills/desilence/desilence.md` has the measurements). The desilencer removes the dead air
  anyway and the 300 ms residual needs no gate.
- **Read every slide title aloud, or none.** The chapter card cues on the spoken title (spotlight skill); where
  a title is skipped the card falls back to the first scripted line. Both work; the mixed case (history-of-
  crypto: 6 of 8 titles read) costs a transcript check per chapter.
- **A webcam PiP only when face cutaways are wanted.** A deck-only capture has no face to cut to, and its
  as-filmed head is the title slide.
- 1080p30 OBS at ~6 Mbps; the deck HTML and the script (.docx + .txt) go into `media/<project>/` next to the
  master, the folder name is the project name.

## Phase 1 — defumble (only when the take needs it)

A scripted read has retakes and false starts; a clean on-the-fly recording does not. Defumble ONLY via
`video-creation/skills/defumbler/defumbler.md` (the `defumbler` agent in `.claude/agents/shared/` runs it): chunk
map -> keep the LAST clean take -> cut only inside silence -> render -> QA by re-running the chunk map on the
output. Be aggressive about what counts as a fumble (Mike would rather over-detect than catch misses himself),
but the METHOD is the defumbler's: never cut from a whole-file Whisper transcript or word timestamps.

Render with **`remove_spans.py ... --crf 18`** (libx264; added 2026-10-13): on this track the defumbled file is the
master the spotlight takes its head/tail footage from, so the NVENC proxy default is not enough. Output
`media/<project>/<project> DEFUMBLED.mp4`. A 48-minute 1080p30 deck capture encodes to ~80 MB at crf 18 (static
slides), in 10 to 20 minutes: launch it detached with a log and poll, never as a tracked background task.

## Phase 2 — desilence with the track preset

`skills/desilence/desilence.md`: the standing definition is **800 ms min-silence, 300 ms left between sentences
(200 ms after the sentence so word-final releases survive, 100 ms before the next), one zone**, pinned in code; it
wraps the canonical desilencer (`video-creation/skills/desilencer/`, the -57/-52 dB RMS method, declick,
frame-locked render; nothing re-implemented). When word endings still sound clipped, check the MASTER first: a
noise-gated mic chain chops them at the source (history-of-crypto, 2026-10-14).
```
python skills/desilence/desilence_preset.py "media/<project>/<project> DEFUMBLED.mp4" --dry-run   # plan + QA
python skills/desilence/desilence_preset.py "media/<project>/<project> DEFUMBLED.mp4"             # -> <project> EDIT.mp4 + .map.json
```
Input = the DEFUMBLED file, or the master `.mkv` when Phase 1 was skipped. Defumble and desilence are two
separate sync-safe passes, in this order, never combined. QA (the preset prints the first two): swallowed-speech
scan, A/V drift < 50 ms, a frame either side of the biggest join.

### The cutting method (non-negotiable — the desync fix)
Every cut on this track is **`filter_complex` `trim`+`atrim`+`concat` in a single pass** (what `desilence.py`,
`remove_spans.py` and the spotlight stitcher all do): audio and video lose the identical window, so lip-sync is
preserved by construction. **Never the concat-demuxer** method (it re-stamps the streams independently and drifts:
"mouth moving, no sound", hit and diagnosed 2026-06-06).

## Phase 3 — transcribe the FINAL spine (word-level)

```
python scripts/transcribe.py "media/<project>/<project> EDIT.mp4"     # medium model, GPU auto
```
Medium, not base (base "cleans up" disfluencies). Writes `<project> EDIT.medium-words.json`: the cue source for
Phase 4 (and for any captions). Transcribe the file the comp is cued to, never an earlier derivative.

## Phase 4 — spotlight presentation (deck recordings)

**`skills/spotlight/spotlight.md`** (canonical, read it): author the scene spec from the deck + script, resolve the
cues against the Phase 3 word timings (`cue_scenes.py`), a ~30-line project comp over the shared renderer
`remotion/src/SpotlightPresentation.tsx`, probe, render the middle window in parts (`render_spotlight.py`), stitch
the as-filmed head and tail back with the EDIT's own audio (`stitch.py`). Rules that live there: spotlight not
slideshow; render only the replaced window and stitch with ffmpeg; the deliverable's audio is the EDIT's; keep the
deck's own look; a breath before every chapter (`chapter_pause`, the title alone on screen for ~1 s, silence
inserted at stitch time, the EDIT never re-encoded for it).

Face cutaways during the spotlight (the QE build had three, at Mike's strongest camera glances) need a webcam PiP in
the recording; find the glances with **`video-creation/skills/gaze/SKILL.md`** (run it as a checklist, the refine
step is mandatory, and when the PiP is too low-res to tell reading from looking, get the spans from Mike). A
deck-only capture has no face to cut to.

## Format 3 — music under the untouched master (VS Code coding videos)

**`skills/music-bed/music-bed.md`** (canonical): the channel's musical intro from 0:00 at clip gain 0 dB -> -40 dB
over its 11.9 s, then a random elevator bed from the library starting right after Mike's cue line ("...stick around
because this is a cool course" on print-function, ~0:55), -32 dB clip gain, remix-looped on a bar-aligned region,
end-aligned to the last frame. One command, ~2 min, no video encode:
```
python skills/music-bed/music_bed.py "media/<p>/raw/<timestamp>.mkv" --cue-phrase "<his cue words>" --out "media/<p>/<p> FINAL-v1.mp4"
```
Mike speaks levels as **Premiere clip gain** (keyframe dB on the clip), never absolute dBFS. Ask for the cue line if
he has not named it. Thumbnail: **`skills/thumbnail/thumbnail.md`** (edit the previous episode's published
thumbnail with nano_banana_2, three takes, he picks).

## Supporting scripts

- `scripts/transcribe.py`: Phase 3 word-level Whisper (medium, GPU).
- Cutting: `video-creation/skills/defumbler/scripts/remove_spans.py` (explicit `--cut a-b` spans, `--crf 18` here);
  silence: `skills/desilence/`. The track's own copies (`remove_spans.py`, the three `silencedetect` scripts,
  `to_low_bps.py`) were recycled on 2026-06-14 / 2026-10-13; never recreate them.
- `scripts/generate_narration.py` (the 2026-06 AI-narrated mode's ElevenLabs generator, zcash-only paths) was
  recycled 2026-10-13 with that mode; the clone settings it encoded are kept below.

## Reference: Mike's ElevenLabs voice clone (from the retired AI-narrated mode, 2026-06-08)

Kept because the settings were A/B-tested and are not written anywhere else. Voice = PVC "Clone of Mike"
(`w5hJEzvYpyioFoEAv8tO`), key in env `ELEVENLABS_API_KEY` only. **Model `eleven_multilingual_v2`, NOT `eleven_v3`**
(v3 invents emotion, reads "a bit happy"; v2 reproduces his timbre). Locked settings **stability 0.3, similarity
0.75, style 0.6** (high style + low stability is what gives v2 its emphasis; 0.4/0.35 tested flatter than 0.5/0,
always A/B a short line first). On v2: ellipses/commas = the main emphasis lever (a beat before the stressed
word); `<break time="0.4s"/>` = the only supported tag; CAPS and stretched spellings do nothing or misread;
`[tags]` are v3-only. Spell numbers/dates/symbols as words; no em dashes. PVC training: clean, single-speaker,
same-mic, UNPROCESSED audio (never Adobe Enhance, it bakes in a synthetic artifact); ~30 min consistent source
beats hours of mixed ones. Script in `persona.json` `spoken_voice` (gear 2), phrasing verified against the
transcript corpus, never inferred.

## Delivery, review rounds, and what Mike does after

- Deliver the absolute path of `<project> FINAL-vN.mp4`, a new `-vN` per delivery; keep every previous FINAL
  and copy its `.scenes.resolved.json` to `.resolved.vN.json` at delivery time (A/B, and the splice base for
  the next round). Mike reviews in parts and in rounds (history-of-crypto: v1 half watched -> v2 to slide 5 ->
  v3 accepted), and a round is a fix round (`skills/spotlight/spotlight.md` step 8, `splice.py`), never a full
  re-render for a few moved cues.
- **The pipeline leaves the audio alone**: the deliverable carries the EDIT's own track, no normalization and
  no enhancement, because Mike runs his own pass after acceptance. On history-of-crypto a copy named
  `FINAL-v3-esv2-50p-bg-10p-music-10p.mp4` appeared 1.5 h after the v3 delivery: the video stream copied
  untouched (same 35723 frames, same bitrate), the audio replaced by an enhance-speech v2 pass (50% strength,
  background 10%, music 10%, by its name) at 48 kHz AAC, -22.5 LUFS integrated against the raw -20.6. Do not
  add an audio pass to the pipeline unprompted; deliver the raw track he expects. The one exception is format 3,
  where Mike ASKED for the music bed (`skills/music-bed/`): the voice is still never re-levelled or enhanced, and
  he skips Enhance Speech on it (2026-10-16: it needs an mp4 round trip through Adobe Podcast Studio and the voice
  is fine as recorded), so that FINAL is the upload.
- Not queued and not committed unless asked. Once he has uploaded, the project folder is recycled the usual
  way (`node cleanup/cleanup.js --target video-creation --dry-run` first); the per-project Remotion comp comes
  out by hand (spotlight skill, step 3).

## Hard rules

- Sync-safe `filter_complex` only; never the concat demuxer.
- Never edit or delete the master `.mkv`. Deletions go to the **Recycle Bin**
  (`Microsoft.VisualBasic.FileIO.FileSystem.DeleteFile/Directory ... SendToRecycleBin`), never permanent.
- Locate fumbles in the file you are about to cut; never reuse timestamps across timelines.
- Defumble ONLY via the defumbler skill; desilence ONLY via the track preset over the canonical desilencer.
- A long encode or render (> 10 min) is launched detached with a log and polled; never as a tracked background task.

## History

- **2026-06-06 "QE before bitcoin"** (`media/QE before bitcoin/`, deleted after publish): 10:01 recording with PiP,
  12 fumbles removed over two passes (back when the track had its own `silencedetect` scripts), spotlight render
  of 0:31-5:30 with three face cutaways, approved and queued as `lf-20260606-history-of-qe-before-bitcoin`.
- **2026-06-08 "zcash exploit"**: the AI-narrated, script-first mode (ElevenLabs clone over a scroll deck). Retired
  2026-10-13; settings kept above.
- **2026-10-13 "what-to-buy"**: track revived; no deck, desilenced straight off the master at crf 18 with the new
  preset (9:51.79 from 11:41, 74 cuts), delivered and accepted, not queued by choice.
- **2026-10-13 "history-of-crypto"** (Section 2 · Lecture 3, 48:38, deck-only capture): first video through the
  spotlight skill; defumble (`--crf 18`) -> preset desilence -> transcribe -> 49-scene spec -> parts render -> stitch.
  2026-10-14 v2 after Mike's review: word endings clipped -> desilence tail pad 100 -> 200 ms (and the finding that
  the master itself was noise-gated); a breath at every chapter -> `chapter_pause` 1.0 s in the spotlight skill.
  v3 the same morning: the chapter cards moved onto the spoken titles via `splice.py` (28 s re-rendered).
  ACCEPTED and uploaded to the Whop course 2026-10-14, after Mike's own audio pass. Numbers for planning the
  next lecture: 48:38 master -> 30:18 defumbled (118 cuts) -> 19:43 EDIT (273 cuts, 637 s removed) -> 19:51
  FINAL (8 x 1 s pauses); wall-clock: chunk map 16 min, defumble render 9 min, QA chunk map 8 min, desilence
  5 min, transcribe 5 min, 49-scene spec + cue resolve about an hour, parts render 34 min (4 x 9000 frames),
  stitch 4 min, a splice round 8 min.
- **2026-10-16 "print-function"** (format 3, the first VS Code coding video; AI Engineering Simplified, "Learning
  Python": "10 Uses of the Python print Function", 15:55 single take, OBS 1080p30 ~6 Mbps): no edit. Thumbnail
  first (edit of `lgZNH_F3Iuo`'s thumbnail, take B of three). Music v1 intro -5 -> -40 / bed -27 dB; Mike: intro
  too low, bed slightly loud -> v2 intro 0 -> -40 / bed -32 dB (Lounge Lover, loop 88.000-160.019 s x9, bed from
  54.70 s) APPROVED and uploaded by him. The hand-built recipe became `skills/music-bed/` the same day (its output
  verified sample-identical to the approved v2).
