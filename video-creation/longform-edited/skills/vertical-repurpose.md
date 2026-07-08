# vertical-repurpose — deriving a 9:16 cut from a finished 16:9 longform-edited video

_Canonical skill for turning an APPROVED 16:9 longform-edited video into a vertical (1080×1920)
deliverable. Self-contained so it survives a project folder being deleted; carry-trade is the worked
exemplar, not the source of truth. Read this BEFORE building any vertical cut. Sibling to
`comp-build.md` (comp architecture) and `video-qa.md` (QA gate) — those own their rules; this points._

## When this runs

After the 16:9 FINAL is built + approved. The content/edit/thesis/audio are ALREADY locked — the vertical
is a reframing, not a re-edit. Do NOT re-open the script or re-time beats. The spine audio is identical, so
the mix carries over unchanged (see §5).

## 1. Assets: everything is captured/composed NATIVE VERTICAL, never landscape-cropped

The whole point of a vertical cut is that it's built for a portrait screen. A landscape asset force-cropped
to 9:16 reads as lazy and often clips the important content. For EACH asset type:

- **Article / receipt / webpage screenshots → capture in MOBILE VIEW.** (Mike, 2026-07-07.) Open the page in
  the browser's device/responsive mode at a portrait mobile viewport (e.g. 390×844) and screenshot THAT —
  the page reflows to a single readable column that fills 9:16 natively. NEVER screenshot the desktop
  (landscape) layout and center-crop it — that's what made carry-trade's R-BIS/R-COINDESK/R-FORTUNE read
  badly in the first vertical pass. For a PDF (e.g. BIS bulletin) with no mobile reflow, raster the page and
  frame the title band as a portrait crop, or rebuild it as a code container.
- **ChatGPT / AI stills → recomposed to TRUE 9:16**, not cropped. Regenerate each via `--reference-image`
  against its 16:9 exemplar so it's the same shot recomposed for portrait (carry-trade: 13/13 done at
  941×1672). Anchoring on the versionN exemplar is mandatory (see the carousel/reference-image persona rule).
- **Envato / stock b-roll → source a VERTICAL clip** where inventory exists. If none does, a landscape
  center-crop is the sanctioned fallback but FLAG it (carry-trade: yen-banknotes had no vertical inventory).
  Strip baked audio from any AI b-roll (`ffmpeg -c copy -an`).
- **Code containers / charts → fill the 1080-wide frame**, one spotlighted point at a time (same
  spotlight/altitude rules as 16:9; the vertical comp restacks them, it does not shrink them).

## 2. The vertical comp

Build `remotion/src/<Project>Vertical.tsx` at **1080×1920, same fps + duration as the 16:9** (same
`OffthreadVideo` spine, same `CUTS`/`sh()`). Reframe per beat: faces center-crop tall, containers/charts
restack to fill width, b-roll fills the portrait frame. Same three transition buckets and per-asset glitch
families as the 16:9 (`TRANSITIONS.md`). Smoke-test one frame per beat before the full render.

## 3. Render — MIND THE STITCH CEILING (this is the load-bearing gotcha)

A full-length vertical render (18045 frames at `--concurrency 4`) renders every frame but then **crashes in
the final FFmpeg stitch at ~frame 14436** with `FFmpeg quit with code 3221225794` (0xC0000142) — Windows
handle exhaustion from the Chrome workers, NOT a resource or comp bug, deterministic even with 15GB RAM free.
**Full root cause + the fix are in memory `reference_remotion_stitch_handle_ceiling` and the carry-trade
PROJECT-LOG.** Short version:

```
# render two halves, each well under the ~14000-frame ceiling:
npx remotion render src/index.ts <Comp> _partA.mp4 --frames=0-9021    --video-bitrate=3M --concurrency=4 --public-dir <render-assets>
npx remotion render src/index.ts <Comp> _partB.mp4 --frames=9022-18044 --video-bitrate=3M --concurrency=4 --public-dir <render-assets>
# join with a STANDALONE ffmpeg (no Chrome workers -> no ceiling); sync-safe filter_complex, NEVER concat-demuxer:
ffmpeg -y -i _partA.mp4 -i _partB.mp4 -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -b:v 3M -pix_fmt yuv420p -preset medium -c:a aac -b:a 192k <Comp>-VERTICAL-v1-video.mp4
```

Match `--video-bitrate` to the 16:9 FINAL (carry-trade = 3M ≈ 3.0 Mbps). Process note: the harness may report
a background render task as "killed" while the orphaned Remotion process keeps running to completion — verify
via the log/PID, watch the OUTPUT FILE (persistent Monitor) as the real done-signal, do NOT relaunch.

## 4. Mix — reuse the 16:9 mix verbatim

The spine audio (VO) is identical between 16:9 and vertical, and the bed + SFX timecodes are audio-domain
(framing-independent). So the same `audio/mix_draft.sh` applies with IN/OUT overrides:

```
IN=<...>-VERTICAL-v1-video.mp4 OUT=<...>-VERTICAL-v1.mp4 bash audio/mix_draft.sh
```

## 5. QA (per `video-qa.md`, plus vertical-specific)

- **Concat seam** (if split-rendered): pull frames at the boundary ±0.5s (carry-trade seam = 300.78s) and
  confirm it's seamless — no black, glitch, or jump.
- **Blackdetect** the whole file: only the intentional transition blacks should appear, NONE at the seam.
- **Vertical framing** spot-checks across each content type (face, chart, container, timeline, b-roll) — read
  actual frames, confirm nothing important is cropped out and text is readable at phone size.
- **Audio parity**: peak level and no-clipping should match the 16:9 (carry-trade: −3.2 dB, flat factor 0).

## 6. Deliver

New `-VERTICAL-v1.mp4` filename + absolute path (delivery discipline, `comp-build.md` §11). Keep the unmixed
`-VERTICAL-v1-video.mp4` master. The vertical is a SEPARATE deliverable from the queued 16:9 — only stage it
into the vertical-platform queues when Mike says to.
