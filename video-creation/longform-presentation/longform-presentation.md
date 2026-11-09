# longform-presentation — the track

Record-and-edit pipeline for a 16:9 presentation video: Mike records himself over a slide deck (or over a live
screen share with no deck: crypto charts, or VS Code while coding), the recording is cleaned into a spine (except
the coding format, which ships as recorded with music under it), and, when there is a deck, the deck is
re-rendered as a **spotlight presentation** (one container at a time, cued to his words) with the as-filmed intro
and close kept. Track-specific policy lives in `skills/` (one folder per skill, index `skills/README.md`), on top of
the shared `video-creation/skills/` (defumbler, desilencer, gaze, captions, ...).

## The four formats (Mike, 2026-10-16: these are the typical ones, anything else is rare; format 4 added 2026-10-24)

Identify the format FIRST, from the folder contents and Mike's ask; it decides which phases run at all. The track
exists because these are much less effort than longform-edited, so never run a phase the format does not list.

| Format | Folder | Example | Phases | Audio | Goes to |
|---|---|---|---|---|---|
| **1. Slide-deck lecture** (a deck `.html` in the folder, "Section N · Lecture M" eyebrow) | `media/deck-lecture/` | history-of-crypto 2026-10-13, QE 2026-06-06 | 1 defumble -> 2 desilence -> 3 transcribe -> 4 spotlight | the EDIT's own track; Mike runs his own Enhance Speech pass after acceptance | his Whop course (`whop.com/cryptorich`), uploaded by him |
| **2. Crypto-chart screen share** (TradingView / DexScreener, webcam PiP, no deck) | `media/desilence-only/` | what-to-buy 2026-10-13 | 1 (only if the take has retakes) -> 2 desilence; the EDIT is the deliverable, crf 18 | the EDIT's own track | his public uploads, by him |
| **3. VS Code coding screen share** (single take, coding live while talking) | `media/vscode-coding/` | print-function 2026-10-16 | **NO edit at all**: no defumble, no desilence, no transcribe. Music only: `skills/music-bed/` + a series thumbnail `skills/thumbnail/` | intro sting + elevator bed mixed under the untouched voice; no Enhance Speech | the **AI Engineering Simplified** YouTube channel ("Learning Python" series), uploaded by him |
| **4. Standard presentation** (deck screen share with card overlays; a deck `.html` + a notes doc (never redundant with the slides) in the folder, master in `raw/`, webcam PiP + the Premium Membership box, free talk) | `media/standard/` | near-vs-tao 2026-10-24 | 1 defumble (if retakes) -> 2 desilence -> **Mike's Enhance Speech pass** on the EDIT's audio (remuxed in `spine/`) -> 3 transcribe it -> a few overlays INSIDE the deck area (deck cards, a system-design chart, an animated chart, a whiteboard beat; webcam + CTA never covered, 2026-10-31), ONE render, no draft, no video comp: `skills/card-overlays/` | his enhanced track, stream-copied | YouTube by him + the longform queue (rumble / bitchute / facebook) |

Format 3 is expected to be the MOST common (many Python coding videos). Why no edit: it is one deliberate take,
fumbles are fine, and the silences are content: Mike may be typing code without speaking and the viewer must not
miss it. The deliverable is the master with music under it, the picture stream-copied (frame count = master's).

**Exception, only when Mike asks: desilence the WAITS first (system-design, 2026-11-04: "cut out some of the silence
because I was waiting for some of my commands to process").** A take built around waiting on a tool (Claude Code
thinking) has dead air that is not content. Desilencer agent on the raw master, preset with `--min-sil 1.0` (his value
for this video; pads stay 200 / 100 ms, no defumble), then `music_bed.py` runs on the `<p> EDIT.mp4` instead of the
raw. The preset names its output after the input's parent folder, so a master in `raw/` needs an explicit
`--out "media/vscode-coding/<p>/<p> EDIT.mp4"`.

Either way the deliverable is an absolute path and MIKE uploads it himself: nothing on this track is staged to
`longs.json` or `batches.json` unless he asks. **Format 4 is the exception he asked for (2026-10-24, near-vs-tao):**
he uploads to YouTube by hand, and the FINAL + his thumbnail go into the longform queue for rumble / bitchute /
facebook (never youtube): copy to `schedule-tweets/longform/<p>/<p>.mp4` + `.png`, `publish-meta.json` in the project
(title, description, tags in his voice; no em dashes, no source links), one `longs.json` entry with `batch: null`,
edited with Node, then `python scripts/persona-lint.py --file schedule-tweets/data/longs.json`.

## Folder convention

Every project lives under its FORMAT folder (Mike, 2026-10-31): `media/<format>/<project>/`, `<format>` =
`deck-lecture` (1) · `desilence-only` (2) · `vscode-coding` (3) · `standard` (4), so the format is fixed when
the folder is made. A format folder is never itself a project (cleanup classifies the projects inside it).

```
media/<format>/<project>/          the FOLDER name is the project name (OBS names the master by timestamp)
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
Format 4 keeps its spine in the longform-edited stage-letter layout instead (Mike asked for the spine "just like we
do for the long-form edited videos"): `raw/<timestamp>.mkv` -> `spine/ALL.a.defumbled.mp4` (+ chunk maps, spans)
-> `spine/ALL.c.desilenced.mp4` (+ `.map.json`; no `b`, there is no blackout on a screen share) -> Mike's enhanced
copy beside it under his own name (`ALL.c.desilenced-esv2-...mp4`) + its `.medium-words.json` -> `overlays/`
(`cards.json`, the card bodies, generated pages and PNGs) -> `<project> FINAL-vN.mp4` at the project root, `_qa/`.
There is no LOW BPS working copy on this track any more: every tool here reads the master (chunk map, Whisper,
desilencer) and the one lossy generation is the crf 18 spine, which keeps on-screen text sharp (decided
2026-10-13; the old `to_low_bps.py` was recycled).

## Recording notes (what the next recording should get right)

- **Match the OBS scene to the channel.** The Premium Membership panel (x 1400-1920, y 0-400) is the crypto channel's
  CTA; on an AI Engineering Simplified recording it must be off before recording (artifacts 2026-11-05 shipped with
  a black box over it: `drawbox=x=1400:y=0:w=520:h=400:color=black:t=fill`).
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
- 1080p30 OBS at ~6 Mbps; the deck HTML and the script (.docx + .txt) go into `media/<format>/<project>/` next to the
  master, the folder name is the project name.

## Phase 1 — defumble (only when the take needs it)

A scripted read has retakes and false starts; a clean on-the-fly recording does not. Defumble ONLY via
`video-creation/skills/defumbler/defumbler.md` (the `defumbler` agent in `.claude/agents/shared/` runs it): chunk
map -> keep the LAST clean take -> cut only inside silence -> render -> QA by re-running the chunk map on the
output. Be aggressive about what counts as a fumble (Mike would rather over-detect than catch misses himself),
but the METHOD is the defumbler's: never cut from a whole-file Whisper transcript or word timestamps.

Render with **`remove_spans.py ... --crf 18`** (libx264; added 2026-10-13): on this track the defumbled file is the
master the spotlight takes its head/tail footage from, so the NVENC proxy default is not enough. Output
`media/<format>/<project>/<project> DEFUMBLED.mp4`. A 48-minute 1080p30 deck capture encodes to ~80 MB at crf 18 (static
slides), in 10 to 20 minutes: launch it detached with a log and poll, never as a tracked background task.

## Phase 2 — desilence with the track preset

`skills/desilence/desilence.md`: the standing definition is **800 ms min-silence, 300 ms left between sentences
(200 ms after the sentence so word-final releases survive, 100 ms before the next), one zone**, pinned in code.
**Deck lectures (format 1) get more air (Mike, 2026-11-08): 500 ms between sentences (300 after + 200 before) and 900 ms
at every slide change**, found in the picture; the preset picks these automatically for an input under
`media/deck-lecture/`. With them the spotlight's `chapter_pause` stacks on the slide pause, so decide it per video. It
wraps the canonical desilencer (`video-creation/skills/desilencer/`, the -57/-52 dB RMS method, declick,
frame-locked render; nothing re-implemented). When word endings still sound clipped, check the MASTER first: a
noise-gated mic chain chops them at the source (history-of-crypto, 2026-10-14).
```
python skills/desilence/desilence_preset.py "media/<format>/<project>/<project> DEFUMBLED.mp4" --dry-run   # plan + QA
python skills/desilence/desilence_preset.py "media/<format>/<project>/<project> DEFUMBLED.mp4"             # -> <project> EDIT.mp4 + .map.json
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
python scripts/transcribe.py "media/<format>/<project>/<project> EDIT.mp4"     # medium model, GPU auto
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
over its 11.9 s (a Soundstripe track, Next Door Stomp, YouTube license code `36UJTFFHAT9SVPXZ` goes in the description),
then a random elevator bed from the library starting right after Mike's cue line ("...stick around
because this is a cool course" on print-function, ~0:55), -32 dB clip gain, remix-looped on a bar-aligned region,
end-aligned to the last frame. One command, ~2 min, no video encode:
```
python skills/music-bed/music_bed.py "media/vscode-coding/<p>/raw/<timestamp>.mkv" --cue-phrase "<his cue words>" --out "media/vscode-coding/<p>/<p> FINAL-v1.mp4"
```
Mike speaks levels as **Premiere clip gain** (keyframe dB on the clip), never absolute dBFS. Ask for the cue line if
he has not named it. Thumbnail: **`skills/thumbnail/thumbnail.md`** (edit the previous episode's published
thumbnail with nano_banana_2, three takes, he picks).

## Format 4 (standard) — deck cards, charts and a whiteboard beat INSIDE the deck area

**The layout changed 2026-10-31 (binance):** an overlay covers ONLY the deck area (the left 1466 px of the
recording); Mike's webcam and the Premium Membership box keep the right column at their recorded size, visible the
whole time. Four overlay kinds: a deck card, a system-design chart still (shared `chart-builder` agent), an animated
chart clip, and a whiteboard beat clip (`video-creation/skills/whiteboard-beat/`, shared `whiteboard-builder`
agent). Still one ffmpeg final render, no video comp, no draft. Spec + rules: `skills/card-overlays/card-overlays.md`.

**Pre-production (before Mike records): `RESEARCH.md` -> the deck `<p>.html` -> the notes doc `<p>-notes.docx`.**
`RESEARCH.md` is the only number source (every fact sourced, a timestamped market snapshot, a do-not-air list). The
deck reuses the previous standard deck's stylesheet + recording helpers verbatim (`media/standard/binance/binance.html`:
content in `.wrap`, the left 68vw, so the webcam corner stays clear; F = fullscreen, G = webcam guide box, arrows /
Space = next slide). **The notes doc is NEVER redundant with the slides (Mike, 2026-11-08, for every standard video):**
it holds ONLY what is NOT on a slide: extra facts and context, caveats and sourcing nuance, numbers that did not fit,
likely viewer questions, the do-not-air items, recording logistics. No "on screen" recaps, no restating a slide's
bullets or stats (binance's talking points did both: do not copy that). **And the notes doc stays SHORT (Mike,
2026-11-08, JCT):** any point worth a few sentences on camera (a contradiction, a timeline, a "what isn't public" list)
goes ON a slide as its own container; add slides for it (two or three more than planned is fine) rather than leave it in
the notes. The notes keep only the small stuff: a few bullets per slide at most. Organize it by slide so he can glance at it
while that slide is up; a slide with nothing to add gets no section. Built as a Word doc (he narrows by hand) from one
`CONTENT` list in `build_notes.py` in the project folder, `.txt` beside it.

**`skills/card-overlays/card-overlays.md`** (canonical). Mike screen-shares the deck with his webcam PiP and talks
freely from the slides + notes doc; the spine is made with the shared agents exactly as on longform-edited, minus the
blackout (he is on screen the whole time): the **`defumbler` agent** on the master (`--crf 18`, output
`spine/ALL.a.defumbled.mp4`) when the take has retakes (binance 2026-10-31: skipped, Mike's call), then the
**`desilencer`** with this track's preset (`skills/desilence/`, 800 ms; output `spine/<p> EDIT.mp4`). Mike runs
Adobe Enhance Speech on that spine's AUDIO (hand him `spine/<p> EDIT.wav`) and the enhanced track is remuxed onto the
EDIT's video; verify the length, transcribe, pick the moments, author one overlay per moment (cards from the deck,
briefs for the agents), and render once:
```
python skills/card-overlays/card_overlays.py "media/standard/<p>/overlays/cards.json"
```
Mike's words for this format (2026-10-24): a single card or a single snippet of information for exactly as long as
he talks about it (over the entire screen then; inside the deck area since 2026-10-31); "no need for a draft
render"; "this long-form presentation folder should be just a very simple version of the long-form editor". Where
the time goes on a 17-minute master: defumbler agent ~80 min (most of it the agent's own judgment and re-renders,
not compute), desilence ~6 min, transcribe ~5 min, card render ~3.5 min.

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
- **2026-10-24 "near-vs-tao"** (format 4, the first: NEAR vs TAO over a 4-slide yt-presentation deck, 17:28 master,
  webcam PiP + Premium Membership box): defumbler agent 40 cuts -> 15:40, desilencer agent (preset) 104 cuts -> 14:08,
  Mike's Enhance Speech v2 (50% / bg 18% / music 10%), five full-screen cards (quote 0:42, Illia 3:54, voting power
  7:19, market cap 8:51, Q1-Q3 12:42), one ffmpeg render, FINAL-v1. The hand-built render became
  `skills/card-overlays/` the same day (its picture verified identical to FINAL-v1).
- **2026-11-08 "Crypto vs. The Traditional Financial System"** (format 1, Section 2 · Lecture 4, 32:59 deck-only master):
  defumbler agent 70 drops -> 23:27; first desilence 700 / 300 ms (13:02) was "too fast" -> 800 ms / 500 ms residual +
  900 ms at each slide change (13:49), which became the DECK-LECTURE DEFAULT the same day; Mike's Enhance Speech v2
  (75% / bg 10% / music 10%) on the EDIT's WAV, remuxed; no `chapter_pause` (the slide pause already gives the air);
  45-scene spotlight on the lecture-4 deck kinds (`block`, `flow`, `supply`, accent `statement`), 3 parts in 26.6 min;
  the stitch's VFR fix. FINAL-v1 13:49.
- **2026-11-05 "artifacts"** (standard folder, AI Engineering Simplified, Claude artifacts over an HTML deck, 14:49 master,
  no overlays, no Enhance Speech, Mike's call): defumble scoped to one 80 s window (3 cuts, -19.4 s), canonical
  `desilence.py --split 120 --sil-pre 99999 --sil-post 1.0 --pad 0.1 --pad-head 0` (first 2:00 untouched, 33 cuts,
  -51.9 s), 13:38. Share-dialog email boxblurred on the exact frames from a per-frame template scan (ffmpeg `gblur` burned green
  streaks on the small crop), crypto CTA blacked out. A LinkedIn cut for its 10-minute limit: stop in a pause at 9:50 +
  an 8 s card naming the channel, 9:58. FINAL-v2 uploaded by Mike to YouTube + LinkedIn, not queued.
