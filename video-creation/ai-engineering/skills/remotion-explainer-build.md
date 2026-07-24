# ai-engineering · Remotion explainer-video build (SELF-CONTAINED, no sibling-project refs)

_The canonical, durable blueprint for assembling an ai-engineering explainer video: full-frame container
PNGs + MIKE-CLONE VO, no face. Everything needed is here or in this folder's templates — **do NOT reference
another `media/<project>/` as a blueprint** (they get deleted). `need lang-graph` was the first build; this
skill is its method, extracted so it survives._

Inputs assumed done (see the channel `CLAUDE.md`): `SCRIPT.md` (chunked), the 22-ish `deck/containers.html`
rendered to `render-assets/container-NN.png` @2x, and the VO `audio/chunk-NN.mp3` (gated + QA'd, one per chunk).

## The comp (one container per chunk, zoom + cross-dissolve)

The composition is small and fixed. A copyable template is at
`remotion-explainer-build/Comp.template.tsx` — for a new video, copy it into `video-creation/remotion/src/<Name>.tsx`
and replace `__MODULE__` / `__PREFIX__` / `__COMP__`. Anatomy (do not re-architect):
- **One visual `Sequence` per chunk**: `container-NN.png` shown from its chunk's start frame to the next
  chunk's start (last one holds to VO end + TAIL). A `ZoomStill` does a slow scale `1.0 → 1.045` over the
  window and a 10-frame opacity cross-dissolve fade-in at each boundary (first chunk no fade).
- **One VO `Audio` per chunk** at its start frame (`staticFile('audio/chunk-NN.mp3')`).
- **Music is NOT in the comp.** The segmented render is `--muted`; VO + music are assembled in ffmpeg at
  mux time (below). Keeping music out of the comp avoids a missing-file error before the bed is sourced.
- 1920×1080, 30 fps, `background #0a0c10`. Register in `remotion/src/Root.tsx`:
  `<Composition id="<Name>" component={<Comp>} durationInFrames={<PREFIX>_DURATION} fps={<PREFIX>_FPS_EXPORT} width={1920} height={1080} />`

## Timing = two scripts, driven off the REAL mp3 durations

Copy `remotion-explainer-build/stitch-narration.js` and `build-timeline.js` into the project's `scripts/`.
- **`stitch-narration.js`** → `audio/full-narration.mp3`: concatenates `chunk-01..NN.mp3` with a **0.35s gap**
  between chunks (sync-safe `filter_complex` concat). Review/mux track; the gap MUST match build-timeline.
- **`build-timeline.js`** → `remotion/src/<module>.ts`: ffprobes each chunk for its REAL duration, lays out
  per-chunk start times with the same 0.35s gap, and emits `<PREFIX>_CHUNKS/_VO_END/_TAIL/_DURATION_FRAMES/_FPS`.
  Because the gaps are baked into `full-narration.mp3` at exactly the timeline starts, muxing that one file
  gives frame-exact A/V. TAIL (~1.6s) holds the last container after VO ends. Re-run whenever any chunk is
  re-rolled.

## ⛔ Rendering — the SEGMENTED fresh-Chrome method (this is the load-bearing gotcha)

A straight-through Remotion render **reliably dies partway** (headless-Chrome memory accumulation — died
~frame 3800 on `need lang-graph`; also the FFmpeg stitch handle-ceiling ~frame 14436, memory
`reference_remotion_stitch_handle_ceiling`). So render **VIDEO-ONLY in ~3000-frame `--muted` segments**
(fresh Chrome per segment resets memory), concat `-c copy`, then mux audio separately. Copyable driver:
`remotion-explainer-build/render.template.sh` (set COMP_ID / PROJECT_DIR / total frames / bitrate / DRAFT|FINAL).
- **CPU h264 only on Windows** (`--codec=h264`, no GPU), `--concurrency=8` sweet spot
  (memory `reference_remotion_no_gpu_h264_windows`).
- `--public-dir="../ai-engineering/media/<project>"` (relative to `remotion/`) so `staticFile('render-assets/…')`
  and `'audio/…'` resolve (memory `project_longform_edited_asset_location`: per-render `--public-dir`).
- `--frames="A-B"` is inclusive both ends; last range ends at `DURATION_FRAMES-1`. Segment guard: each seg mp4
  must be > ~1 MB or abort.

## Draft → review → final (mandatory gate)

1. **Draft = VO-only @ ~300k** (`--video-bitrate=300k`, mux `full-narration.mp3` only, NO music). Fast, for
   Mike to bless **sync + VO tone** ([[feedback_draft_render_low_bitrate]]). PAUSE here — do not HQ-render
   before approval.
2. Inline draft QA: `blackdetect` none >0.5s; audio mean ~−16 dB / peak no-clip; sample 2-3 frames legible.
3. Then **`video-qa`** agent / `/watch` transcript-sync pass ([[feedback_chunk_qa_then_watch]]).
4. **Final = 2 Mbps WITH music bed**: same segments at `--video-bitrate=2M`; mux VO + a corporate bed at
   **~19 dB under VO** (vol ≈ 0.056), fade-in 1s, fade-out into the tail. Bed source: `assets/music/corporate/`
   ([[project_music_sourcing_skill]]); re-measure LUFS ([[feedback_music_bed_level]]).

## Then
- **Thumbnail:** Higgsfield Nano Banana Pro, style-matched to prior channel thumbs (never gpt_image_2 —
  [[feedback_chatgpt_images_browser_not_cli]]).
- **9:16 vertical (optional, separate deliverable).** For explainer decks the vertical is a REFLOW, not a
  crop (no face to recenter). Rules cross-ref `longform-edited/skills/vertical-repurpose.md` (§1 restack
  containers to fill the 1080-wide frame; §4 reuse the 16:9 mix verbatim; §5 seam/framing/audio-parity QA).
  Explainer-specific steps:
  1. **`deck/containers-vertical.html`** — copy the 16:9 `<style>`, set `.frame` to 1080×1920, and reflow each
     `#cNN` to a single tall column (TEXT byte-identical — no drift): horizontal fan-out `.gwrap` → vertical
     flow (arrows down); `.cmp` 2-ups → stacked; `.rtab`/`.ptab` tables → shrink to fit 1080 wide, nothing
     clipped, PLANNED rows still dashed; bump type ~1.3-1.6x for phone.
  2. **`scripts/render-containers-vertical.js`** (1080×1920 @2x) → `render-assets/vertical/container-NN.png`;
     visual-QA every PNG.
  3. **`remotion/src/<Name>Vertical.tsx`** (1080×1920) — reuse the SAME timeline + VO; only remap the visual
     path (`render-assets/` → `render-assets/vertical/`). Register in Root. Smoke-test one frame.
  4. **`scripts/render-vertical.sh`** — segmented video-only @ the 16:9 bitrate, concat, then MUX THE 16:9
     FINAL's audio stream verbatim (`-map 0:v -map 1:a -c copy`) for guaranteed parity → `<name>-VERTICAL-v1.mp4`.
     (Comp is <14k frames so it's under the FFmpeg stitch ceiling; the fresh-Chrome segments still avoid the
     ~frame-3800 memory crash.)

## Per-video files this build produces
`audio/full-narration.mp3` · `scripts/{stitch-narration,build-timeline}.js` · `remotion/src/<module>.ts` +
`remotion/src/<Name>.tsx` (registered in Root) · draft mp4 → final mp4 → thumbnail. Log state in `PROJECT-LOG.md`.
