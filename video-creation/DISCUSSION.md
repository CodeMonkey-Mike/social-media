# Video Creation — Founding Discussion

## Goal

Empower Claude to act as a world-class video editor whose output is indistinguishable from a great human editor. Starting with short-form content (YouTube Shorts / Reels), expanding to long-form later.

---

## Core Philosophy

The standard approach of giving Claude only a transcript misses half the video — the visual half. Great editing decisions (timing, effects, transitions, pacing, b-roll placement) are visible, not spoken. The solution is to feed Claude both:

- **Frames** — screenshots extracted from the video every few seconds
- **Transcript** — word-level timestamped text of what is being said

Together these give Claude the full picture: it can see what's on screen at every moment while knowing exactly what is being said.

---

## Toolchain

### Frame + Transcript Extraction (The "/watch" Pipeline)
Sourced from a YouTube video: *"My Claude Code Can INSTANTLY Watch Any Video (Here's How)"*

- **yt-dlp** — downloads video from YouTube and 1,000+ other sites
- **FFmpeg** — extracts frames as screenshots (every few seconds, scales with video length, caps at 100 frames for 30+ min videos) and pulls audio as a clean file
- **Whisper via Groq** — transcribes audio with word-level timestamps (free tier covers most use cases)
- **YouTube captions** — for YouTube videos, free built-in captions are pulled directly (no Whisper call needed)
- Cost: ~$1 per run for long videos; most YouTube videos cost nothing to transcribe
- A `--start` / `--end` flag lets Claude focus on a specific window without processing the whole video

This skill is available as a free Claude Code slash command (`/watch`) on GitHub (link in video description).

### Video Rendering
- **Remotion** — React-based programmatic video creation framework. Everything is code (TypeScript/React), frame-accurate rendering, full control over every visual element. Claude generates the Remotion code that produces the final video.
- **FFmpeg** — also used for raw crop/composite operations (e.g. layout transformation) where Remotion isn't needed

### Voice Generation
- **ElevenLabs API** — once a voice clone is set up in the ElevenLabs account, a simple API call takes a text string and returns audio in Mike's cloned voice. Enables fully generated shorts from a script alone with no recording required.

### Audio Analysis
- **librosa / essentia** — Python libraries for analyzing audio files. Can extract BPM, beat timestamps, energy level over time, loudness, silence detection. Claude writes and runs these scripts to get data it can use for audio placement decisions since Claude cannot directly listen to audio files.

---

## What Claude Can Do

### Text effects and captions
Fully achievable in Remotion. Claude can reproduce exact caption style (font, size, color, position, animation, word-by-word highlight) once it has studied examples from Mike's existing videos.

### Transitions
Fully achievable. Remotion has a `@remotion/transitions` package plus the ability to implement any transition using CSS, canvas, WebGL, and Remotion's interpolation/spring animation utilities.

**Reproducing transitions from video frames:** Claude can identify a transition's type, duration, easing curve, and visual progression from sequential frames and reimplement it in Remotion code.

**Reproducing from Premiere Pro files:**
- `.prfpset` preset files (XML) — Claude can read these directly
- `.mogrt` Motion Graphics Templates — Claude can read metadata and parameters, not the compiled AE logic
- Plugin transitions (compiled binaries) — Claude cannot read these

In all cases, frames are more useful than files for reproduction — the goal is to match the visual output, not replicate the Premiere implementation.

### Layout transformation (livestream → Short)
Achievable via FFmpeg. Mike's livestream layout: screen share content in the main area, face/upper body in the bottom right corner (PiP).

Target Short layout (1080×1920):
- Top half (1080×960): screen share content, cropped and resized
- Bottom half (1080×960): face/camera, cropped and resized to fill

Process:
1. Feed Claude a few frames from a typical livestream
2. Claude identifies pixel coordinates of screen region and face region
3. Claude writes FFmpeg filter_complex command to crop and composite into Short format
4. Coordinates are consistent throughout a stream so the formula applies to the whole video

### Audio placement
Claude cannot listen to audio directly but can:
- Read waveform visualizations as images (exported from Premiere's timeline)
- Write Python scripts using librosa/essentia to extract energy, BPM, beat positions as data
- Make placement decisions from that data
- Write Remotion code that places audio segments at exact timestamps with volume automation, fades, and crossfades

### Voice generation
Claude can write the code that calls the ElevenLabs API to generate audio in Mike's cloned voice from a text script. Enables two workflows:
1. Polished voiceover over existing footage (cleaner delivery than raw recording)
2. Fully generated shorts — script → voice → Remotion video, no filming required

---

## What Claude Cannot Do

- Directly listen to or process audio files
- Render video itself (Remotion does the rendering, Claude writes the code)
- Choose b-roll automatically without a tagged library of available footage (b-roll sourcing remains a human task for now)

---

## Planned Workflow for Short-Form Videos

### Starting point: non-livestream shorts

1. **Transcript + timestamps** — Whisper or YouTube captions produce word-level timestamped transcript
2. **Clip selection** — same judgment as repurposing content: strong hook, self-contained point, good energy
3. **In/out point definition** — precise cut points from word timestamps
4. **Layout transformation** — if from a livestream: crop/composite into Short format via FFmpeg
5. **Short-form treatment** — captions, text overlays, music bed, effects via Remotion
6. **Voice generation (optional)** — ElevenLabs for AI voiceover if no footage is used

### Relationship to existing repurpose workflow
The repurpose workflow (transcript → tweets / YT posts) and the video workflow share the same first two steps. A clip flagged for a Short is the same content as a tweet or YT post — one source, multiple outputs. The video pipeline is an extension downstream of the existing repurpose pipeline.

---

## Style Guide (To Be Built)

Before writing any Remotion code, Claude needs to study Mike's best-edited videos frame-by-frame to extract a precise, measurable style guide covering:

- Exact caption font, size, color, position, animation style
- Average shot duration before a cut
- How and when zooms are triggered (specific words, energy peaks, etc.)
- B-roll frequency and selection logic relative to what's being said
- Hook structure — what the first 3 seconds always look like
- Music behavior — when it ducks, when it's full, how fades work
- Transition types and durations
- Any recurring text effects or graphic treatments

This style guide becomes the foundation every future edit runs on.

---

## Next Steps

1. ~~Find and install the `/watch` GitHub skill in this workspace~~ ✅ Done
2. ~~Identify 2-3 of Mike's best-edited short-form videos to analyze~~ ✅ Done (4 videos in `watch/`)
3. ~~Run `/watch` on those videos to extract frames + transcript~~ ✅ Done
4. ~~Build the style guide from what Claude observes~~ ✅ In progress — see `style-guide/`
5. Build the Remotion component library encoding that style
6. Run first short-form video experiment

---

## Session State — Paused Here

_Last updated: 2026-05-18_

### What was accomplished (session 1 — style guide + HTML short)
- Built `style-guide/captions.md` — caption1 style fully documented (Montserrat Black 900, 72px, bounce pop-in animation 70→110→100 scale)
- Rebuilt Mike Tyson / Kaspa short (`shorts/mike-tyson-kaspa/index.html`) with caption1 style — word-by-word captions from Whisper, 2–4 word grouping, correct bounce animation
- Analyzed all 4 sample shorts (`watch/`) frame-by-frame; produced full b-roll analysis report in `style-guide/broll-analysis.md` including the corrected 6fps re-analysis of `ai-coins-1000x.mp4`

### What was accomplished (session 2 — short fully produced + Remotion MP4)

#### Mike Tyson / Kaspa short — fully built
The short at `shorts/mike-tyson-kaspa/index.html` is complete and has been rendered to MP4.

**Assets:**
- `assets/tyson-facecam-cut.mp4` — face-cam clip (silence-cut from livestream, 41:28–43:22)
- `assets/broll-tyson.png` — Mike Tyson boxer illustration (ChatGPT)
- `assets/broll-knockout.png` — boxing knockout silhouette (ChatGPT)
- `assets/logo-kaspa.png`, `logo-btc.png`, `logo-eth.png` — coin logos
- `assets/kas-chart.png` — KAS price chart (ChatGPT generated, dark mode, Feb–May 2026)

**Structure (1080×1920):**
- B-roll zone: 0–860px (6 panels with crossfade transitions)
- Divider: glowing green line at 860px
- Caption band: 863–1003px (caption1 style, bounce animation)
- Face-cam: 1003px–bottom (safe zone 240px)
- Kaspa watermark: top-left, always visible

**B-roll panels and timestamps:**
| Panel | Start | End | Content |
|---|---|---|---|
| `br-hook` | 0s | 12.64s | Kaspa coin + "WHY WOULD ANYBODY WANT ETH OVER THIS?" |
| `br-tyson` | 12.64s | 32.04s | Tyson illustration + BTC badge overlay |
| `br-knockout` | 32.04s | 68.72s | Knockout silhouette + ETH badge overlay |
| `br-eth-btc` | 68.72s | 91.04s | Animated ETH beats BTC vs-panel |
| `br-kas-chart` | 91.04s | 99.00s | KAS price chart + "$3 target ↑" overlay |
| `br-kas-eth` | 99.00s | 107s | Animated KAS beats ETH vs-panel |

**Special state events:**
- Full-screen b-roll: t=32.04–33.54 (Buster Douglas dramatic entry)
- Full-screen face: t=46.90–48.90 ("holy crap" emotional peak)
- BTC badge overlay on face zone: t=20.98–23.00 ("that's bitcoin")

**Sound effects wired (SOUND_EVENTS):**
- t=0.00: Riser Sound Effect — hook opener
- t=12.64: TING SOUND EFFECT — boxing bell, Tyson panel
- t=20.98: Cash Register — "that's bitcoin"
- t=32.04: Boom - Big Reveal — Buster Douglas cut
- t=43.48: Punch 1 — "knocked out"
- t=46.90: WAIT WHAT SOUND EFFECT — "holy crap"
- t=68.72: Cinematic Whoosh 02 — ETH vs BTC panel
- t=91.04: Cash Register Kaching HD — KAS chart

#### Remotion setup (video-creation/remotion/)
Remotion project initialized and working. Key files:
- `remotion.config.ts` — sets `publicDir('../assets')` so all assets are served by the bundler
- `src/index.ts` — registers root
- `src/Root.tsx` — registers MikeTysonKaspa composition (3300 frames, 30fps, 1080×1920)
- `src/constants.ts` — all data: BROLL_RANGES, CAPTIONS, SOUND_EVENTS, asset paths via `staticFile()`
- `src/MikeTysonKaspa.tsx` — full composition (all panels, captions, overlays, audio)

**Render output:** `remotion/out/mike-tyson-kaspa.mp4` — 44MB, ~110s, H264

**Render command:**
```bash
cd video-creation/remotion
npx remotion render src/index.ts MikeTysonKaspa out/mike-tyson-kaspa.mp4 --codec=h264
# or: npm run render:tyson
```

#### SFX library built (assets/sfx/)
~90 sound effect files curated from 7 Premiere Pro projects. Rules: no music tracks, delete anything >5MB with a music-style name. Key files documented in the create-short skill.

#### Learnings saved to create-short skill
- Quality benchmarks from 4 sample videos (overlay counts, b-roll change rate, duration targets)
- Special state events pattern (fullbroll / fullface / face overlay CSS + JS)
- Sound effects system (SOUND_EVENTS, preload, fired/reset on seek)
- Chart panel pattern (ChatGPT generation + overlay structure)
- Remotion rendering workflow (publicDir, staticFile, OffthreadVideo, Sequence+Audio)

---

### What was accomplished (session 3 — FYCZ short started, aborted mid-way)

#### B-roll analysis updated
- Re-analyzed Videos 1 & 2 at 6fps (Video 1: 164 frames, Video 2: 344 frames)
- All 4 sample shorts now fully re-analyzed at 6fps; broll-analysis.md updated with complete event logs and corrected averages
- Key finding on Video 2: all original timestamps were 5–15s early; the "white/yellow flash at ~10s" doesn't exist; 12 overlay events found vs 4 originally

#### SKILL.md created (`video-creation/SKILL.md`)
Full topic-finding workflow documented, including:
- Multi-snippet rule: same topic from multiple livestream points = all valid source material
- 80-second hard cap on extracted footage
- Mandatory test-frame verification before any FFmpeg crop extraction
- Known OBS layout coordinates for Mike's current setup

#### Four-Year Cycle Zombies short — started, paused
Remotion composition built (`remotion/src/FourYearCycleZombies.tsx` + `constants-fycz.ts`) using:
- 3 source clips from livestream transcript "Best Long-Term Crypto - Kaspa $3 Easily"
- Clip A: 12:10–14:50 (X/Twitter zombie tweet section)
- Clip B: 15:10–17:00 (TradingView BTC weekly channel)
- Clip C: 47:00–51:30 (ISM PMI + BitBo Power Law)

**Aborted reason:** Cropping the face cam directly from the 1920×1080 livestream is too error-prone. First attempt used wrong x-coordinate (1095 instead of ~1430), capturing screen share content in the face zone. Corrected crop (490×772 from x=1430) fixed the content bleed but then objectFit: cover caused only the top of the head to show (face cam too narrow at 490px for a 1080px wide zone).

**Resolution:** User will export a clean pre-formatted vertical video from Premiere Pro with the face zone and content zone already laid out correctly, then hand it to Claude for Remotion composition. This is the correct workflow for recurring production.

---

### Next steps

1. **Upload** `remotion/out/mike-tyson-kaspa.mp4` — still ready to go
2. **Four-Year Cycle Zombies short** — resume when Mike delivers a Premiere-formatted vertical video. The Remotion composition skeleton is ready at `remotion/src/FourYearCycleZombies.tsx`; just need to swap the video source and verify caption timings with Whisper
3. **ElevenLabs** — set up voice clone for fully generated shorts (no face-cam required)
4. **Remotion component library** — extract reusable components (VsPanel, CaptionBand, BtcBadge) once FYCZ short is complete
