# Intake + Verticalize (Phase 1) (livestream-repurpose track skill - CANONICAL)

_Moved VERBATIM from `video-creation/SKILL.md` on 2026-07-08 (Mike: per-track skills live in the track folder; this predates that convention). **This file is now canonical**; the master SKILL.md keeps a pointer stub and the phase-map table points here. Paths inside are written relative to `video-creation/` exactly as in the original._

> **Canonical invocation (2026-08-02 — LangGraph migration Wave 1):** Phase 1 (both steps),
> Lane 1, and Phase 2 now run as ONE graph invocation:
> ```
> python video-creation/livestream-repurpose/graph/run.py --source "<recording>" --min-sil 0.5
> ```
> Prereq: author `longform-meta.json` (title / description / tags for the longs.json entry,
> Mike's voice, no em dashes) next to the recording first — the graph validates it before any
> encoding. `--skip-longform` omits Lane 1; `--resume` continues a killed run (completed nodes
> skip); `--stub ok|fail` is the browser-free structural test. The graph wraps
> `scripts/encode_low_bps.py`, `scripts/longform_stage.py`, `scripts/longs_append.py`, and
> `scripts/verticalize.py`, each freezing the commands below VERBATIM, and verifies every
> artifact from disk (duration, bitrate cap, 1080x1920 SAR 1:1, queue entry).
> **Lane 1's silence method is the canonical desilencer** (`desilence.py --nvenc`, dual-threshold,
> one pass, no crf-18 intermediate — Mike's call, 2026-08-02); the per-batch
> `longform_desilence_<batch>.py` forks are retired (single-threshold `silencedetect`, the banned
> method). The prose below remains the SPEC and the manual fallback.

## Phase 1 — Intake + Verticalize the livestream — replaces the Premiere pass

Phase 1 has two steps: **Step 1** reduces the high-bitrate source to a `LOW BPS` working copy (the
pipeline master) and queues a *silence-removed derivative* of it as the long-form, then **Step 1B**
verticalizes that `LOW BPS` master (16:9 → 9:16).

### Step 1 — High-bitrate source → LOW BPS (+ queue the long-form)

Mike records the livestream at a very high bitrate (often multiple GB — e.g. a 75-min 1080p stream
at ~6 Mbps is ~3.5 GB). The first thing Phase 1 does is re-encode that landscape recording down to
a small `LOW BPS` working copy, then queue the long-form for the dashboard. Only after this do we
verticalize. (Historically Mike made the LOW BPS file by hand before handing it over; this step
folds that into the pipeline.)

**Source-file housekeeping (do this BEFORE Step 1, no need to ask):**
- **Container:** the source may be `.mkv` (OBS default), not `.mp4`. That's fine — Step 1 re-encodes
  anyway, so just point ffmpeg at the `.mkv` and write an `.mp4`. As long as the source is h264/aac
  (probe with `ffprobe` if unsure) the container swap is free; no separate convert step.
- **Filename:** OBS names recordings with a timestamp (e.g. `2026-06-04 19-43-53.mkv`), but the
  livestream lives in a descriptively-named folder (e.g. `media/4-year cycle zombie class/`). The
  whole naming chain (`LOW BPS` → `VERTICAL` → `transcripts/<name VERTICAL>/`) keys off the source
  filename, so a timestamp name poisons every downstream artifact. **Immediately rename the source
  to match its folder** (`4-year cycle zombie class.mkv`) before running Step 1 — don't ask, just do
  it and mention it. Then all working copies read cleanly: `4-year cycle zombie class LOW BPS.mp4`,
  `… LOW BPS VERTICAL.mp4`, `transcripts/4-year cycle zombie class LOW BPS VERTICAL/`.

1. **Re-encode to ~0.7 Mbps and append `LOW BPS` (caps) to the filename.** Keep the landscape
   resolution; only the bitrate drops. NVENC single-pass VBR is plenty for a working/transcription
   copy:

   ```
   ffmpeg -y -i "<name>.mp4" \
     -c:v h264_nvenc -b:v 700k -maxrate 1000k -bufsize 1400k -preset p5 \
     -c:a aac -b:a 96k \
     "<name> LOW BPS.mp4"
   ```

   Naming chain: `<name>.mp4` → `<name> LOW BPS.mp4` (this step) → `<name> LOW BPS VERTICAL.mp4`
   (Step 1B). The `LOW BPS` token is load-bearing — every downstream batch artifact is named off it.

2. **Queue a silence-removed derivative as the long-form — SEPARATE from the shorts pipeline.**
   The published long-form gets a tighter cut: copy the LOW BPS file (delete_silences.py overwrites
   in place, so copy first), run `livestream-repurpose/scripts/delete_silences.py <copy>` to drop
   dead air, and queue THAT file. This desilenced derivative is **queue-only** — it does NOT feed
   Step 1B / verticalize / clip selection. Those run on the untouched `LOW BPS` master (natural
   timeline); per-clip silence removal happens later at Phase 5B. The livestream folder ships a PNG
   thumbnail next to the video. Stage the desilenced mp4 + that PNG into a **per-video subfolder**
   `schedule-tweets/longform/<slug>/` (one folder per long-form — NEVER drop loose mp4/png files in
   the `longform/` root; it clutters fast), using **no-spaces slug filenames** (so the dashboard
   video player resolves cleanly), then append
   an entry to `schedule-tweets/data/longs.json` per its `$post_schema`: all platforms `pending`,
   `thumbnail_path` = the staged PNG, `width`/`height` 1920×1080, real (post-cut) `duration_seconds`,
   and a clean `description` (no em dashes in the JSON). This is what makes it show on the **Longs**
   tab. **Important — keep it small.** `delete_silences.py` re-encodes segments at libx264 crf 18,
   which balloons the bitrate. That output is only an intermediate: after the cut, **re-compress
   the result back to ~0.7 Mbps** (the same NVENC settings as Step 1) before staging, then delete
   the crf-18 intermediate. The entire point of the LOW BPS long-form is a small file that uploads
   fast on a poor connection — never queue the crf-18 version. (Because the cut also shortens the
   video, the final low-bps long-form ends up smaller than the LOW BPS master.)

Then continue to Step 1B.

### Step 1B — Verticalize the LOW BPS file (16:9 → 9:16)

The pipeline's input is a **1080×1920 vertical** video of the *whole* livestream with the
screen-share content on top and Mike's face on the bottom. Historically Mike laid this out by
hand in Premiere Pro. **That manual step is now automated** — we reproduce his exact Premiere
framing in code, so no Premiere is needed.

**Flow (do NOT pick clips first):** verticalize the *entire* livestream → drop the resulting
vertical MP4 into `livestream-repurpose/media/` → **then** transcribe it (Phase 2+ run on the
vertical). Clip selection happens late, off the transcript, in the Phase 4b dashboard. We do not
decide clips before verticalizing.

**Naming convention:** the verticalized file keeps the original livestream name with **`VERTICAL`
appended in all caps**, e.g. `best cryptos to make your wife lose weight LOW BPS.mp4` →
`best cryptos to make your wife lose weight LOW BPS VERTICAL.mp4`. The transcript folder
(`transcripts/<name>/`) is then named after this `…VERTICAL` filename, matching existing batches.

### The learned framing (extracted from Mike's Premiere Effect Controls, 2026-05-31)

Premiere sequence **1080×1920**. Both layers are the **same 1920×1080 source**; each clip's
Anchor Point is the source center **(960, 540)**. Premiere "Motion" maps a source pixel to the
sequence as `seq = Position + (Scale/100)·((x,y) − Anchor)`.

| Layer | Premiere Scale | Premiere Position | Role |
|---|---|---|---|
| **Content** (top, drawn in front) | 81% | 696, 416 | screen-share band, top ~44% |
| **Face** (bottom, full-frame, behind) | 258% | −1317, 1005 | webcam, fills the frame behind |

Z-order: face is full-frame and drawn first; content is drawn on top and covers the upper band.
They meet flush (no divider). Reference screenshots + a frame-accurate Premiere-vs-output
comparison live in `livestream-repurpose/media/` (`top element.png`, `bottom element.png`,
`premiere-vs-remotion-compare.png`).

### Port rule — Premiere Motion → CSS/Remotion (anchor = origin = 960,540)

```
scale            = Scale / 100
transform-origin = 960px 540px
transform        = translate(PositionX − 960, PositionY − 540) scale(scale)
```

→ Content: `translate(-264px, -124px) scale(0.81)` · Face: `translate(-2277px, 465px) scale(2.58)`

**Remotion implementation:** `remotion/src/LivestreamRepurpose.tsx` (`CONTENT_FRAMING` /
`FACE_FRAMING`, with the math documented in its header). Face layer is `muted`; the content layer
carries the audio (both layers are the same source — muting one avoids doubled audio).

### Port rule — Premiere Motion → ffmpeg (the fast path for the full-length pass)

The whole-livestream pass is a *static* two-layer composite (no animated graphics/captions —
those come later, per selected clip), so **ffmpeg in one GPU pass is far faster than rendering
54 min frame-by-frame in Remotion.** A scaled layer's top-left in the 1080×1920 canvas is
`Position + (Scale/100)·(−Anchor)` → face (−3794, −388) at 4954×2786, content (−82, −21) at
1555×875:

```
ffmpeg -y -init_hw_device cuda=cu -filter_hw_device cu \
  -hwaccel cuda -hwaccel_output_format cuda -hwaccel_device cu -i "livestream LOW BPS.mp4" \
  -filter_complex \
  "color=c=black:s=1080x1920,format=nv12,hwupload[bg];\
   [0:v]split=2[v0][v1];\
   [v0]scale_cuda=4954:2786[face];[v1]scale_cuda=1555:875[content];\
   [bg][face]overlay_cuda=x=-3794:y=-388:shortest=1[t];\
   [t][content]overlay_cuda=x=-82:y=-21[vg];[vg]setsar=1[vgo]" \
  -map "[vgo]" -map 0:a -c:v h264_nvenc -rc vbr -b:v 600k -maxrate 800k -bufsize 1200k -preset p5 \
  -c:a aac -b:a 96k -progress prog.txt "livestream LOW BPS VERTICAL.mp4"
```

**Bitrate — match the LOW BPS source; keep it UNDER 1 Mbps.** Use `-rc vbr -b:v 600k -maxrate 800k`
(validated 2026-06-04: lands ~0.57 Mbps, like the source). **Set `-rc vbr` explicitly** — with a bare
`-b:v`/`-maxrate` and no `-rc`, nvenc does NOT honor the cap and overshot to ~1.2 Mbps / multi-GB.
NEVER use a quality target like `-cq` — on an already-low-bps source it re-bloats to multiple GB
(~7 Mbps) for detail that isn't there (a 75-min stream ballooned to ~2.6 GB that way). The vertical
is only a transcription / clip-selection master (shorts are re-rendered in Remotion later) and is
viewed on phones, so it must never exceed the source bitrate.

**GPU gotchas (learned 2026-06-04 — keep all three):**
- **`-init_hw_device cuda=cu -filter_hw_device cu` is REQUIRED.** Without it, `hwupload` (for the
  black base) errors `A hardware device reference is required`. Decode + uploaded base must share the
  device (`-hwaccel_device cu`) or `overlay_cuda` can't combine them.
- **Use a real `color=…1080x1920` base, NOT `scale_cuda=1080:1920`.** `scale_cuda` rounds width up to
  a multiple of 16 (→ 1088), which breaks the 1080-wide pipeline. The color base locks exactly 1080;
  the face overlay covers it fully (so it's never seen), and `shortest=1` ends output with the video,
  not the infinite color source.
- **`setsar=1` at the end is mandatory.** `scale_cuda` stamps the source's 16:9 display aspect onto
  the frame as `SAR 256:81`, which renders STRETCHED. `setsar=1` forces square pixels. Always probe
  the output: it must read `1080x1920, SAR 1:1, DAR 9:16` (matches existing batches).

**CPU fallback** (only if CUDA filters are unavailable — much slower, scale/overlay run on the CPU):

```
ffmpeg -i "livestream LOW BPS.mp4" -filter_complex \
 "[0:v]scale=4954:2786,setsar=1[face];[0:v]scale=1555:875,setsar=1[content];\
  color=c=black:s=1080x1920[bg];[bg][face]overlay=-3794:-388[t];[t][content]overlay=-82:-21[v]" \
 -map "[v]" -map 0:a -c:v h264_nvenc -rc vbr -b:v 600k -maxrate 800k -bufsize 1200k -c:a aac -b:a 96k "livestream LOW BPS VERTICAL.mp4"
```

If Mike's OBS webcam/screen-share layout changes, re-extract the two Premiere values from a fresh
pair of Effect-Controls screenshots and re-derive with the port rules above.

---

---

## APPENDIX (legacy reference)

## Measuring livestream crop coordinates

Before writing any FFmpeg crop command, verify the exact pixel boundaries of each zone. Do not estimate from visual inspection of thumbnail frames — the proportions are easy to misjudge.

**Mandatory: always extract and verify a test frame before any full clip extraction.**

This is not optional. Never skip this step, even if coordinates look correct from visual inspection.

Steps:
1. Extract a single full-resolution frame: `ffmpeg -i livestream.mp4 -ss 00:05:00 -vframes 1 full-frame.jpg`
2. Extract a test face crop using your estimated x-start: `ffmpeg -i livestream.mp4 -ss 00:05:00 -vframes 1 -vf "crop=<estimated_w>:<h>:<x>:<y>" face-test.jpg`
3. Read the face-test.jpg. If any screen share content appears on the left edge, the x-start is too far left — increase x and repeat until only face cam content is visible.
4. Only after the test frame shows a clean face crop, proceed with extracting the full clips.

Skipping this check caused a full re-extraction (all 6 clips) after the face crop turned out to include screen share content. The test frame takes 5 seconds; a full re-extraction takes 10+ minutes.

**Known layout for Mike's current OBS setup (verified 2026-05-18):**
- Screen share: `crop=1430:1080:0:0` (left 74% of 1920px frame)
- Premium Membership CTA: x=1430, y=0, w=490, h=308
- Face cam: `crop=490:772:1430:308` (right 26% of frame, below CTA)

If the OBS scene layout ever changes, re-verify before using these coordinates.

**Superseded by Phase 1.** This per-zone crop math is legacy. The face/content zones are now
laid out automatically by the **Phase 1 verticalize step** (one 1080×1920 vertical of the whole
livestream, face bottom + content top), which removes the crop step entirely. Keep this section
only for the OBS zone reference numbers.
