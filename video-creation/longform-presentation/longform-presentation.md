# longform-presentation — skill

Pipeline for turning a raw screen/talking-head recording (slide deck + presenter PiP) into a
finished longform 16:9 presentation video. Mirrors the livestream-repurpose *starting* process
(compress first, work off the lighter file), but tuned for presentations: pacing is more fragile
than a tight short, so the bitrate floor is higher (slide text/code must stay readable) and
silence cutting is gentler and zone-aware.

For the parked production vision (clone PiP intro + voice-first Remotion timeline) see `TODO.md`.
Slide-deck style reference: `kaspa_toccata_hardfork_deck.html`.

**Two production modes:** (a) **record-and-edit**, where Mike records himself over the deck, then
Phases 1-4 below clean it up; (b) **AI-narrated, script-first**, where Mike films only a short
on-camera intro and an ElevenLabs voice clone narrates the rest over the deck (see "AI-narrated
presentation mode" near the bottom). Phases 1-4 are the record-and-edit path.

## Folder convention

Each recording is its own project folder under `media/<project name>/`, holding the master, the
working files, transcripts, and the project's slide-deck HTML. Example: `media/QE before bitcoin/`.
Scripts in `scripts/` all take paths as arguments — point them at the project folder.

```
media/<project>/
  <project>.mkv                  master raw (OBS, ~6 Mbps 1080p30) — never edit, never delete
  <project> LOW BPS.mp4          2 Mbps working master (Phase 1)
  <project> LOW BPS.medium-words.json   canonical transcript (Phase 2)
  <project> EDIT.mp4             deliverable (Phase 3)
  <project>.html                 the slide deck used in the recording
```

---

## Phase 1 — compress to a LOW BPS mp4

Transcode the heavy raw `.mkv` down to a lighter mp4 everything downstream reads. Single-pass
NVENC, **no silence cutting**.

```
python scripts/to_low_bps.py "media/<project>/<project>.mkv"
```

- Default target **2 Mbps** video + AAC 128k (maxrate/bufsize auto-scale off `--bps`). Output is
  written beside the source as `<name> LOW BPS.mp4`. Override with `--bps 2.5M` / `--out <path>`.
- **2 Mbps is the floor** for presentations. Do NOT drop to the livestream flow's 0.7M — too soft
  for on-screen text/code.
- Typical result: a 10-min 1080p30 recording goes ~460MB → ~165MB.

---

## Phase 2 — transcribe (word-level)

```
python scripts/transcribe.py "media/<project>/<project> LOW BPS.mp4"   # --model medium (default), GPU auto
```

- Defaults to the **`medium`** model on GPU. **Use medium, not base:** base "cleans up"
  disfluencies (stammers, false starts) — exactly what we need to SEE when hunting fumbles. On an
  RTX-class GPU a 10-min file is ~1 min.
- Writes `<name>.medium-words.json` (full result with word timestamps) and prints segments with
  `[start-end]` timestamps. This transcript is the source of truth for fumble locations and any
  later caption/slide-sync work.

---

## Phase 3 — edit: defumble, THEN zone-aware desilence (two separate sync-safe passes)

Fumble removal and silence removal are now **separate canonical skills** — do not combine them in one
script (the old combined `build_two_zone.py --cut` is deprecated and redirects).

1. **Defumble** via `video-creation/skills/defumbler/defumbler.md` → `<project> EDIT.mp4`.
2. **Desilence** via the canonical desilencer skill (`video-creation/skills/desilencer/desilencer.md`):
```
python ../skills/desilencer/scripts/desilence.py "media/<project>/<project> EDIT.mp4" \
    --out "media/<project>/<project> EDIT-tight.mp4" \
    --split 90 --sil-pre 0.5 --sil-post 0.5 --map-out "media/<project>/rapid-map.json" --nvenc
```
The min-silence duration is the only knob (pick it BELOW the speaker's pause cluster — see `desilencer.md`);
the −57/−52 dB RMS thresholds are fixed. NEVER single-threshold `silencedetect`.

### The cutting method (non-negotiable — this is the desync fix)

Cut with **`filter_complex` `trim`+`atrim`+`concat` in a single pass** (what the desilencer's `desilence.py`
and `remove_spans.py` both do). This re-times audio and video **together**,
so lip-sync is preserved *by construction* — both streams lose the identical time window.

Do **NOT** use the livestream `longform_desilence_fast.py` concat-**demuxer** approach here: it
re-stamps audio and video independently and they drift, producing the "mouth moving, no sound"
desync bug. (Hit and diagnosed 2026-06-06: a 90s test had audio sliding against video at the
start.) The demuxer is "acceptable at long-form scale" for a livestream, not for a talking head.

### Zone-aware silence (the tuned criteria)

Silence = quieter than **−50 dB** for at least the zone's min-duration; keep **0.06s pad** on each
edge so word onsets/tails aren't clipped. Min-duration is **per zone**:

| Zone | min silence to cut | rationale |
|---|---|---|
| `0 .. split` (intro, default split = **90s**) | **0.5s** (`--sil-pre`) | tighter intro |
| `split .. end` | **1.0s** (`--sil-post`) | removes dead space ≥1s, KEEPS the sub-second beats so delivery isn't rushed |

Lowering min-duration = MORE cuts (more aggressive); raising = fewer. The shorts pipeline uses
250ms/−57dB; this longform flow is deliberately gentler. A ~10-min recording typically carries
~3 min of pauses — at a flat 0.5s everywhere that all gets cut (too aggressive); the zone split
keeps the post-intro breathing room.

### Fumble removal (false starts / restarts)

**Be aggressive.** Mike would rather I over-detect and remove every fumble than leave misses he has
to catch himself while watching. When automating, hunt ALL of these, not just the obvious restarts:
- **Restarts** — starts a sentence, stops, restarts it ("Layer 4… I'm messing up here… Layer 4…").
- **Restatements** — says the same fact twice ("the Bank of Japan goes to zero. Rates drop to zero").
- **Self-corrections** — swaps a word and re-says the clause ("point" → "endpoint"; "playing" → "paying").
- **Hesitation stalls** — a word held for seconds or a long filled pause mid-sentence. These survive
  the silence pass because they're voiced/noisy, not clean silence, so they need explicit cuts.
- **Abandoned false starts** — a dropped fragment before the real line ("We want to make rich, …").

**Systematic detection** (don't eyeball the transcript alone — it misses subtle ones). Script a pass
over the word-level json that flags:
- repeated consecutive 3-grams within ~22 words → restart/restatement candidates;
- words with duration > ~1.3s, or inter-word gaps > ~0.9s → stall/hesitation candidates.
Then review each candidate in context.

Procedure per fumble:
1. Pull **word-level** timestamps around the candidate.
2. Cut span = **[just after the last kept word] .. [just before the restart/resume word]**, ~0.05–0.10s
   margins inside the gaps so kept words aren't clipped. The cut also swallows the dead pause.
3. Pass each as `--cut a-b`.

**Skip only true intentional rhetoric:** parallelism/anaphora ("it was done through… it was done
through…"), deliberate repetition for emphasis, list cadence, and CTA rhythm ("we don't… but if you
DO…"). Awkward phrasing that's a complete thought is NOT a fumble.

**Timeline gotcha (Whisper is non-deterministic):** the master transcript and an edited-file
transcript can disagree on collapsed restarts — one captures the doubled phrase, the other hides it
in a long held word. Fumble timestamps are timeline-specific. **Cut in the timeline where the fumble
is actually visible.** If that's the already-edited file, use `remove_spans.py` on it (accept one
extra encode generation) rather than guessing a master-timeline span you can't see. Always re-QA by
re-transcribing the output and reading every join.

### Mandatory QA before declaring done

1. **Re-transcribe** the output (`transcribe.py --model medium`) and read each cut join — confirm
   every fumble phrase is gone and the seam reads as clean speech.
2. **A/V drift:** script reports `video` vs `audio` stream duration — expect < ~50ms (end-of-file
   sample-vs-frame rounding, not progressive slippage).
3. **Visual splice check:** extract a frame either side of the biggest cut; confirm live footage,
   no black/frozen frame.

---

## Supporting scripts

- **Silence removal → the desilencer skill** (`video-creation/skills/desilencer/desilencer.md`, tool
  `desilence.py`). The ONE canonical tool, all tracks. `desilence_synced.py`, `desilence_audio.py`, and
  `build_two_zone.py` are DEPRECATED (single-threshold `silencedetect`, which clips words) and now redirect
  there. Whole-file uniform criterion = `--min-sil`; zones = `--split/--sil-pre/--sil-post`.
- `scripts/remove_spans.py` — remove arbitrary `--cut a-b` spans only (no silence detection),
  sync-safe. Use for pure section excision (fumble removal proper = `defumbler/defumbler.md`).

## Gaze / camera-look analysis → see `video-creation/skills/gaze/SKILL.md`

Finding when the presenter looks **into the camera** vs **reads the screen** (to drive the face
cutaways) now lives in its own skill: **`video-creation/skills/gaze/SKILL.md`**. Run it as a checklist;
the **refine step is mandatory**.

Two things that bit us and are baked into that skill:
- **Two recording styles.** QE was **deck-reading-dominant** (presenter turns away to a side-screen;
  camera-looks short + infrequent). The Zcash slide-8 recording was **frontal-dominant** (presenter
  reads a script right at the webcam; frontal almost the whole time, eyes only slightly down). The
  per-recording assumption is opposite — don't carry QE's "looks are rare" prior into a frontal recording.
- **When the PiP is too low-res to tell reading-at-script from looking-at-lens, get the spans from
  Mike** (burn a timecode on the final clip, he marks them). Don't guess repeatedly. The skill's
  Step 3 has the exact command. The renderer notes (`startFrom` for sync, visible wings) live there too.

## Phase 4 — dynamic spotlight presentation (Remotion)

The voice-first payoff: re-render the deck as a **dynamic video where one element at a time is
blown up to fill the screen while it's narrated**, then clears for the next — synced to the
narration via the Whisper word-timings. This is the approved look (NOT a slide that builds up /
accumulates — that was rejected; it's spotlight, one container full-screen at a time).

Lives in the repo's Remotion project (`video-creation/remotion/`). Render entry `src/index.ts`,
command `npx remotion render src/index.ts <CompId> out/<file>.mp4 --codec=h264`. `remotion.config.ts`
sets `publicDir` to `../assets`, so `staticFile()` assets (audio, the EDIT mp4) go in
`video-creation/assets/`, NOT a local `public/`.

**Build recipe:**
1. **Reuse the deck's CSS** — port the exact colors/fonts/card styling from the deck HTML into the
   Remotion component (inline styles / a `<style>` block). Load the deck fonts with
   `@remotion/google-fonts` (`loadFont('normal', { weights: [...], subsets: ['latin'] })` — **limit
   weights**, or you trigger hundreds of font requests and the render crawls).
2. **One scene per container.** A scene = a single element (title, intro line, a Layer card, a
   timeline item, the closing statement) rendered **large and centered, dominating the frame**.
   Use the deck's card chrome (top accent bar, eyebrow tag, big mono number, description) scaled up.
3. **Cue each scene to narration.** `tIn` = the EDIT-timeline timestamp of the phrase that
   introduces it (from the medium word-timings). Scene `i` is visible `[tIn_i, tIn_{i+1})`.
   Cross-fade ~0.35s + a slight scale-in (0.92→1) on entrance reads well.
4. **Face cutaways at the strongest camera-glances** (from the gaze analysis): cut to a centered
   **vertical crop of the PiP** with **blurred "wings"** (a scaled, `blur()`-ed copy of the same
   video filling the sides — echo-pillarbox). One Remotion comp does deck + audio + cutaways.
5. Composition is **1920×1080** (deck is landscape; note the repo's shorts comps are 1080×1920).
   Audio track = the EDIT narration; duration = narration length.

### Partial-replacement videos — render ONLY the replaced window, stitch with ffmpeg

When the brief is "keep the original footage at the head/tail, replace only the middle"
(e.g. QE: original face 0:00–0:31, animated presentation 0:31–5:30, original recap/CTA 5:30–end),
**do NOT bundle the original intro/outro into the Remotion comp and re-render the whole file.**
Passing untouched original footage back through `OffthreadVideo` just to re-encode it is wasteful
(re-encodes pristine footage, and balloons the render — QE was 12,270 frames / 15 min instead of
~9,000). Mike's instruction (2026-06-06): *"all you needed to do was piece the original file
together with ffmpeg."*

Correct method:
1. Remotion renders **only the replaced window** (its own audio = that slice of the EDIT narration;
   scene `tIn`s expressed relative to that window's start).
2. `ffmpeg` cuts the original EDIT into the head and tail pieces (`-ss`/`-to`, sync-safe re-encode).
3. Concat the three pieces with **`filter_complex` `concat` (NOT the concat demuxer)** — same
   desync rule as Phase 3. One pass, streams stay locked:
   ```
   ffmpeg -i head.mp4 -i middle.mp4 -i tail.mp4 -filter_complex \
     "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
     -map "[v]" -map "[a]" -c:v h264_nvenc -b:v 2M out.mp4
   ```
   The head/tail keep the original footage; only the middle is the new render.

Validate on **one slide first** (POC) before wiring all ~20+ containers — confirm the sync feel,
size, and transition with Mike, then build the full timeline.

## AI-narrated presentation mode (script-first, voiced by an ElevenLabs clone)

A second production path, distinct from the record-and-edit pipeline above. Mike films only a short
on-camera intro (~30s of his own thoughts, ending on his real handoff line "so let's dive into it"),
and an **ElevenLabs voice clone narrates the rest** over a scroll-deck of slides. Script-first:
finalize the narration BEFORE recording or rendering anything. First built for the "AI Can Now Hack
Blockchains" / Zcash-exploit video (`media/zcash exploit/`, 2026-06-07).

### Write the narration in Mike's SPOKEN voice
- Source of truth = `persona/persona.json` -> **`spoken_voice`** (NOT the typed-tweet `writing_style`).
  Default to gear 2 (polished longform): keep his tics, smooth the stutters.
- A clone reproduces Mike's timbre, NOT his word choice. If the script isn't written the way he
  actually talks, the clone just reads someone else's words in his voice. Phrasing is the whole game.
- **Verify, don't infer.** Before attributing a phrase or tic to Mike, grep the transcript corpus:
  `video-creation/shorts/**/whisper-words.json`, the longform `*.medium-words.json`, the dated
  livestreams in `repurpose/transcripts-ad-hoc/*.txt`, and the `watch` skill for any YouTube URL he
  gives. Mark verified vs inferred; when Mike corrects a phrasing, fix it in `persona.json`
  `spoken_voice` that same turn. (Caught this session: "smash that like button" and "And get this"
  were inferred and WRONG; "catch you guys, later", "Now,", "over and over again", "it's like" 80
  hits, are verified.)

### Two-file workflow (keep them in lockstep)
- `narration-script.md`: the **clean reading copy**, one block per slide. For judging wording/flow.
- `narration-emphasis-v3.md`: the **same text with emphasis markup** for v3, plus a per-slide
  "Marked:" list so Mike can veto fast. Apply Mike's line edits to the clean script FIRST, then
  re-sync the emphasis file to match.

### ElevenLabs: model choice + generation (API path)
Generate via the **API, not the UI** (Mike's preference): `scripts/generate_narration.py` parses the
per-slide blockquotes out of the emphasis file and writes `audio/slide-N.mp3`. Key lives in env
`ELEVENLABS_API_KEY` only (never committed). Voice = Mike's PVC "Clone of Mike"
(`w5hJEzvYpyioFoEAv8tO`).

**MODEL: use `eleven_multilingual_v2`, NOT `eleven_v3`** (decided 2026-06-08 for Mike's clone). v3 is
more expressive and honors `[drawn out]` audio tags, but it invents emotion and reads "weird / a bit
happy", wrong for a serious register. v2 reproduces Mike's real timbre. Locked settings:
**stability 0.3, similarity 0.75, style 0.6** (the high-style + low-stability combo is what gives v2 its
emphasis; note 0.4/0.35 tested FLATTER than 0.5/0, prosody is not linear in these params, so always A/B
on a short line first).

Markdown does NOTHING in ElevenLabs (italics/bold ignored). On **v2**, what actually works:

| Mark | v2 effect |
|---|---|
| `…` ellipsis / commas | Pause beat. **The main emphasis lever on v2.** Set up a stressed word with a beat before it. |
| `<break time="0.4s"/>` | Hard pause. The ONLY angle-bracket tag ElevenLabs supports (self-closing). `<emphasis>`/`<prosody>` are NOT supported. |
| `WORD` (caps) | **No effect on v2** (it ignores capitalization). Harmless as a human annotation, but it will NOT punch the word. |
| `woooord` (stretched) | **Do NOT use on v2**: it misreads ("fouuur" came out rhyming with "sour"). Spell normally; draw out via delivery/pauses. |
| `[drawn out]` / any `[tag]` | v3-only; on v2 read literally, so `generate_narration.py` auto-strips `[...]` for non-v3 models. |

The emphasis file is still authored v3-style (CAPS + the odd tag) for human readability; the script
strips what v2 can't use and v2 ignores the caps. If you ever switch back to v3 the marks come alive,
but expect the over-acted tone.
- Keep emphasis sparse: the peaks only land if the valleys stay calm.
- A single deliberate "Um..." / "Ah..." may be added on request for a natural-reading feel (used on
  the Zcash slide 7). Default is still to strip unintentional uh/um.

### TTS hygiene
Spell out numbers, dates, version numbers, and symbols as words ("Claude Opus four point eight",
"May twenty ninth", "three hundred and fifty three X", "over three billion dollars"). Strip
mid-sentence false starts. No em dashes anywhere (persona `terminology_rules.no_em_dashes`); clean
header labels too.

### Professional Voice Clone (PVC)
Feed **clean / single-speaker / same-mic / no music bed**, and crucially **NATURAL / unprocessed**
audio; ~30 min clean is a solid floor, and **consistency beats raw hours** (one consistent source
clones cleaner than a blend of differently-recorded ones). **Do NOT run the training audio through
Adobe Podcast Enhancer (or any speech-enhancement tool)** — it re-synthesizes the voice, and the clone
inherits a synthetic "AI version of me" artifact (hit 2026-06-08; fixed by retraining on ONLY the
original un-enhanced presentation and dropping the SFX-contaminated livestreams). If a source has
Stream Deck SFX/music, hand-trim those moments rather than enhancing. Timbre (clean originals) comes
first; emphasis is a separate model/settings problem, not a clone-quality one.

### The slide deck (HTML)
Reuse the proven scroll-deck framework from `media/QE before bitcoin/money-printer-1971-v2.html`
(scroll-snap sections, Playfair Display / DM Sans / JetBrains Mono, blurred orbs, nav dots,
IntersectionObserver fade-ins). Keep **slide count == script slide count == number of nav dots**: if
you add a slide to the script, add the matching deck slide AND nav dot. A per-section color strip /
act pill is a cheap way to signal a multi-act emotional arc.

### CTA
Close like the QE video: quick recap, then the track-record plug (use his CURRENT best call + number
at posting time), then "click that like button and click the subscribe button", then "I'm gonna catch
you guys, later." NEVER "smash that like button." Full detail in persona `spoken_voice.cta_style`.

---

## Hard rules

- Sync-safe `filter_complex` only — never the concat-demuxer method (see desync bug above).
- Never edit or delete the master `.mkv`. Deletions go to the **Recycle Bin** (recoverable), not
  permanent (`Microsoft.VisualBasic.FileIO.FileSystem.DeleteFile/Directory ... SendToRecycleBin`).
- Locate fumbles in the file you're about to cut; don't reuse timestamps across timelines.

---

## Worked example — "QE before bitcoin" (2026-06-06)

10:01 OBS recording, "The Money Printer Has Been Running Since 1971" deck with presenter PiP.
Project folder: `media/QE before bitcoin/`.
- **Phase 1:** `.mkv` 460MB → `LOW BPS.mp4` 164MB @ 2.18 Mbps.
- **Phase 2:** medium transcript, 1059 words → `QE before bitcoin LOW BPS.medium-words.json`.
- **Phase 3 — two passes** (Whisper is non-deterministic, so the second batch was cut on the
  already-edited timeline, see the gotcha above):
  - Pass A (`build_two_zone`, split 90, pre 0.5 / post 1.0): 601s → 428s. 5 fumbles:
    `97.5-107.06` ("begins to silent" + 6s pause), `148.9-149.9` (mumbled false start),
    `242.2-265.42` ("Layer 4… I'm messing up here" whole take), `443.4-451.1` (doubled "years
    before Bitcoin"), `460.5-465.1` ("point" → "endpoint" correction).
  - Pass B (`remove_spans.py` on the Pass-A file, after Mike caught more + asked for aggressive
    detection): 7 more fumbles (4:20–4:36 ×2, 4:49, 5:31, 5:46, plus systematic-detector hits).
  - **Deliverable: `QE before bitcoin EDIT2.mp4` — 409.15s (6:49), 12 fumbles removed total.**
    QA passed (re-transcribe + join read + drift < 50ms).

### Phase 4 build state (spotlight presentation) — DONE, rendered, awaiting Mike's review

The animated presentation replaces **only 0:31–5:30**; the head (0:00–0:31, on-camera intro) and
tail (5:30–end, recap + 353X CTA) keep EDIT2's original footage.

- **Composition:** `video-creation/remotion/src/QeMoneyPrinter.tsx` (1920×1080, `QE_FPS=30`,
  `QE_DURATION=12270` frames ≈ 409s). Registered in `src/Root.tsx` alongside the validated POC
  `QeMoneyPrinterPoc`. Spotlight = one container full-screen at a time, 0.35s cross-fade +
  0.93→1 scale-in; cued to narration via `SCENES[]` (`t` = EDIT2-timeline seconds). Card chrome,
  colors (gold/cyan/red/purple/green), fonts (Playfair/DM Sans/JetBrains Mono) ported from the deck.
- **`PRES_IN=31`, `PRES_OUT=330`**: intro.mp4 plays `[0,31]`, SCENES play `[31,330]`, outro.mp4
  plays `[330,end]`, all via `<Sequence>` + `OffthreadVideo`.
- **3 face cutaways** (`CUTAWAYS[]`, the top gaze glances) at t=131.0 / 141.8 / 283.0s — centered
  vertical PiP strip + blurred echo-pillarbox wings (`FaceCutaway`).
- **Assets in `video-creation/assets/`** (NOT `public/` — config `publicDir` is `../assets`):
  `qe-full.m4a` (EDIT2 narration), `intro.mp4` (EDIT2 0–31s), `outro.mp4` (EDIT2 330s–end),
  `face1/2/3.mp4` (glance clips, cut to start on the glance).
- **Render:** `npx remotion render src/index.ts QeMoneyPrinter out/qe-money-printer.mp4 --codec=h264`
  (renders to a loose `out/` file). 52 MB, 409.0s. Boundaries spot-checked: original footage at
  0:15 and 5:40, spotlight in the middle. Correct, **approved by Mike 2026-06-06.**
- **KNOWN INEFFICIENCY in this build:** it embeds intro.mp4/outro.mp4 in the comp and re-renders
  all 12,270 frames. The deliverable is correct, but per Mike the right method is the ffmpeg-concat
  recipe above (render only the [31,330] middle, stitch 3 pieces). Use that for any re-cut.
- **Where the render lives now:** moved to **`video-creation/remotion/out/qe-history/qe-money-printer.mp4`**
  (loose files in `out/` are recycled by cleanup unconditionally; a per-batch subfolder listed in
  `batches.json` is protected). Registered as batch `qe-history` (track `longform-presentation`).
- **Published:** staged to `schedule-tweets/longform/history-of-qe-before-bitcoin.mp4` (+ thumbnail
  `.png`) and queued **pending** in `schedule-tweets/data/longs.json`
  (id `lf-20260606-history-of-qe-before-bitcoin`, title "History of QE before Bitcoin"), ready for
  the rumble/bitchute/facebook longform uploaders.

**Done:** rendered, approved, registered for cleanup-protection, and queued for upload.
