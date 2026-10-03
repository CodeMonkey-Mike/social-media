# vertical-repurpose — deriving a 9:16 cut from a finished 16:9 longform-edited video

_Canonical skill for turning an APPROVED 16:9 longform-edited video into a vertical (1080×1920)
deliverable. Self-contained so it survives a project folder being deleted; carry-trade is the worked
exemplar, not the source of truth. Read this BEFORE building any vertical cut. Sibling to
`../comp-build/comp-build.md` (comp architecture) and `../video-qa/video-qa.md` (QA gate) — those own their rules; this points._

## Runner (2026-09-29): `python video-creation/longform-edited/graph/run.py vertical --project <name>`
The lane is a LangGraph (`graph/vertical_graph.py`): `measure_face_crop.py` (§1b, face detection first, green-mask
second, never a whole-frame centroid), the five builders with vertical briefs + visual-qa (§1), `comp-builder` in
VERTICAL mode (§2), `render_comp.py --comp <Project>Vertical --public-dir assets/vertical` in parts over the stitch
ceiling (§3), `mix_music.py` (§4), the code checks + the mandatory face-centring frames (§5), GATE `vertical`, then
`<project>-VERTICAL.mp4` at the project root, not queued (§6). Vertical assets live in `assets/vertical/<same subfolders>`.

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
- **TITLE / CARD SLIDES and SYSTEM-DESIGN DIAGRAMS → RE-SHOOT THE HTML AT 1080×1920.** These ship as
  PNGs screenshotted from their own sources (`assets/slide-sources/containers.html`,
  `assets/diagrams/*.html`, `assets/charts/*.html`), and a 16:9 PNG force-cropped to portrait loses the
  eyebrow, the headline, or half a node mesh. Re-drive the SAME source at a portrait viewport so the
  layout reflows: headline wraps, card rows stack, a wide node mesh becomes a tall one. Keep the locked
  stylesheet and the state variants (`-s1/-s2/…`) — you are re-rendering the same design at a new
  aspect, not redesigning it. Write them to the vertical project's own asset folders so the 16:9 PNGs
  are never overwritten. (Mike, 2026-07-25: "we also have to make all the slides and diagrams and charts
  adapt to a vertical version as well.")
- **ANIMATED (Type 1) charts → re-lay out for portrait IN CODE.** They are React components, so give
  them a vertical arrangement (bars stack taller, a wide race-lane becomes a column, counters recentre)
  driven off the same `ts` contract and the same beat times. Never letterbox the 16:9 layout.
- **Code containers → fill the 1080-wide frame**, one spotlighted point at a time (same
  spotlight/altitude rules as 16:9; the vertical comp restacks them, it does not shrink them).

## 1b. ⛔ THE FACE CROP IS MEASURED, NEVER ASSUMED (Mike, 2026-07-25)

**A talking head is almost never centred in the 16:9 frame, so a centre crop cuts him in half.** On
kaspa 30bps Mike sat at **62-71% across the frame in every FACE window** (235-398 px right of centre).
The default `objectFit: cover` crop takes the middle 607 px (x 656-1264), which put him at or past its
right edge — he reviewed the vertical and said "half of my face is cut off on the right side".

**Measure the SUBJECT, not the frame.** The mistake that caused this was measuring a brightness-weighted
centroid over the whole frame: the bright green screen fills the left, drags the average to the middle,
and reports a comfortable ~48% while the subject is really at 65%. Mask the BACKGROUND out first:

```python
# green-screen recording: strongly-green pixels are background, the rest is the subject
green = (G > 60) & (G > R*1.25) & (G > B*1.25)
subj  = ~green                      # also drop the master's pillarbox columns before measuring
cx    = (subj.sum(0) * arange(W)).sum() / subj.sum()      # subject centre, in source px
```
(No green screen? Use face detection, or difference the frame against a COVER-beat frame of the same
shot — anything that isolates the person. Never a whole-frame luminance centroid.)

**Then offset the crop to that centre**, e.g. `objectPosition: '<cx/W*100>% center'` on the spine, and
sample MULTIPLE windows — the value drifts between beats (62% to 71% here), so take the mean and check
the extremes still fit. A per-window offset is fine if the spread is large.

**QA gate (mandatory, in §5): pull one frame from EVERY face window of the RENDERED vertical and confirm
the face is horizontally centred and not clipped at either edge.** This is cheap and it is the single
most visible way a vertical cut fails.

## 1c. When the 16:9 airs FACE BACKGROUND-SWAP clips, the vertical needs its OWN portrait swaps (golden-kitty, 2026-10-02)

A 16:9 swap clip (`assets/face-swap/F<n>-higgsfield-bg-swap.mp4`, comp-build.md section 3b) cannot be cropped to portrait:
it is already a tight 16:9 crop, so a 9:16 slice of it is narrower than his head. Generate the face windows again, natively
at 9:16, and tell the lane's comp-builder through `assets/vertical/NOTES.md` (the lane reads it) that every swapped window
plays `face-swap/F<n>-higgsfield-bg-swap.mp4` from the vertical public dir, full-frame, with no face crop.

1. Sources: `python scripts/build_face_swap_source.py <project> --window <a-b> --name F<n> --approx-src 0 --whole-seconds
   --vertical --reuse-json assets/face-swap/F<n>-raw-for-higgsfield.json` (a 608x1080 crop centred on THAT window's measured
   face from `assets/vertical/face-crop.json`; `--reuse-json` skips the slow re-matching; same windows, halves and handles as
   the 16:9). Voice references: `python scripts/build_swap_voice_ref.py <project> --vertical F<n> ...`.
2. **A PORTRAIT look reference and a framing lock are mandatory.** Sent with the 16:9 look reference, the first portrait take
   ZOOMED OUT and invented a torso and a microphone stand. Make the look reference from a real portrait source frame with only
   the room replaced (an image edit, used as a reference only, never on screen), and add to the prompt: "KEEP THE EXACT FRAMING
   of the reference video: a close head-and-shoulders portrait ... do NOT zoom out ... do NOT add a microphone stand".
3. `--aspect_ratio 9:16 --resolution 480p` (returns 496x864 at 24 fps), then `retime_swap_to_voice.py` on every clip. Expect
   a retake or two: two of eleven clips failed the sync proof on their first take (84% and 72% of speech windows locked).
4. The same goes for image MOTION clips (comp-build.md section 3c): animate the lane's portrait stills again at 9:16 into
   `assets/vertical/img-motion/`.

## 2. The vertical comp

Build `remotion/src/<Project>Vertical.tsx` at **1080×1920, same fps + duration as the 16:9** (same
`OffthreadVideo` spine, same `CUTS`/`sh()`). Reframe per beat: faces center-crop tall, containers/charts
restack to fill width, b-roll fills the portrait frame. Same three transition buckets and per-asset glitch
families as the 16:9 (`TRANSITIONS.md`). Keep the COVERS/CARDS arrays byte-identical to the 16:9 and put
the 16:9-ref → vertical-asset mapping in explicit lookup tables, so the two comps diff clean and a
missing vertical asset throws at build time instead of rendering a hole.

Give the vertical render its OWN LEAN `--public-dir` (spine + the vertical container/still/b-roll folders
only). Remotion copies the whole public dir into every bundle, so pointing it at the 16:9 `assets/` drags
along the landscape PNGs and the full-res portrait masters the comp never reads — 4× per split render.

**Smoke-test one frame per beat before the full render — bundle ONCE:**
```
npx remotion bundle src/index.ts --public-dir <lean-dir> --out-dir build-<slug>
npx remotion still build-<slug> <Comp> out.png --frame=N     # repeat per beat, reuses the bundle
```
`remotion still src/index.ts` re-bundles on every invocation; against a prebuilt bundle a still is seconds.
Cover every content type AND every face window here, so §5's mandatory checks confirm rather than discover.

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
# join with a STANDALONE ffmpeg (no Chrome workers -> no ceiling): PICTURE ONLY, frame-exact, and the VO taken WHOLE
# from the paused spine. NEVER concat the parts' audio: each part's AAC track runs ~0.05-0.1 s longer than its picture,
# so an audio+video concat holds the last frame of every part and pushes everything after the seam late (golden-kitty
# 2026-10-02: a 3-frame hold at frame 12000 and the VO +57 ms late for the last 77 s). `vertical_graph._concat` does this:
ffmpeg -y -i _partA.mp4 -i _partB.mp4 -i assets/spine.mp4 -filter_complex "[0:v:0][1:v:0]concat=n=2:v=1:a=0,setpts=N/30/TB[v]" \
  -map "[v]" -map 2:a:0 -r 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -preset medium -c:a aac -b:a 192k <Comp>-VERTICAL-v1-video.mp4
# then PROVE it: the joined file has exactly the comp's frame count, and the VO cross-correlates at 0 ms against
# assets/spine.mp4 before AND after every seam.
```

Match `--video-bitrate` to the 16:9 FINAL (carry-trade = 3M ≈ 3.0 Mbps). Process note: the harness may report
a background render task as "killed" while the orphaned Remotion process keeps running to completion — verify
via the log/PID, watch the OUTPUT FILE (persistent Monitor) as the real done-signal, do NOT relaunch.

## 4. Mix — reuse the 16:9 mix verbatim

The spine audio (VO) is identical between 16:9 and vertical, and the bed + SFX timecodes are audio-domain
(framing-independent). So the SAME mix applies. The VO itself comes from `assets/spine.mp4`, never from a Remotion
render's own audio track: a render's audio runs 43 ms late against its picture from frame 0 (AAC priming) and steps
to about 90 ms late by the end of an 8-minute video (measured on golden-kitty, 2026-10-02); `mix_music.py` takes the
spine's audio by default (`--vo` overrides) and the picture file's audio is only a fallback when no spine matches: `scripts/mix_music.py` resolves the same `MUSIC-PLAN.json` / EDIT-PLAN /
TRANSITION-PLAN onto the vertical picture (this is the vertical graph's mix node; Python since 2026-09-28, the old per-project
`audio/mix_draft.sh` is retired):

```
python video-creation/longform-edited/scripts/mix_music.py <media/<project>> --video <...>-VERTICAL-v1-video.mp4 --out <...>-VERTICAL-v1.mp4
```

## 5. QA (per `../video-qa/video-qa.md`, plus vertical-specific)

- **Concat seam** (if split-rendered): pull frames at the boundary ±0.5s (carry-trade seam = 300.78s) and
  confirm it's seamless — no black, glitch, or jump.
- **Blackdetect** the whole file: only the intentional transition blacks should appear, NONE at the seam.
- **FACE CENTRING — one frame from EVERY face window, no sampling shortcuts** (§1b). Confirm the face is
  horizontally centred and neither edge clips it. This is the check that was missing when kaspa 30bps
  shipped a vertical with the subject jammed against the right edge; spot-checking "a face beat" is not
  enough, because the subject's position drifts between windows.
- **Vertical framing** spot-checks across each OTHER content type (chart, container, receipt, diagram,
  b-roll, recordings) — read actual frames, confirm nothing important is cropped out and text is readable
  at phone size.
- **Audio parity**: peak level and no-clipping should match the 16:9 (carry-trade: −3.2 dB, flat factor 0).

## 6. Deliver

New `-VERTICAL-v1.mp4` filename + absolute path (delivery discipline, `../comp-build/comp-build.md` §11). Keep the unmixed
`-VERTICAL-v1-video.mp4` master. The vertical is a SEPARATE deliverable from the queued 16:9 — only stage it
into the vertical-platform queues when Mike says to.
