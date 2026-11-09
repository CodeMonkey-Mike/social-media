# longform-to-short — condensing a finished VERTICAL longform into a ~40s short

_Canonical skill for turning an APPROVED vertical (1080×1920) longform-edited cut into a short-form
vertical video with a spoken CTA outro. Self-contained so it survives a project folder being deleted.
Sibling to `../vertical-repurpose/vertical-repurpose.md` (which produced the source) — that skill owns the reframe, this one
owns the condensation. Read this BEFORE building any longform-derived short._

## Runner (2026-09-29): `python video-creation/longform-edited/graph/run.py short --project <name> [--seconds 30]`
The lane is a LangGraph (`graph/short_graph.py`, 13 nodes, 2 gates). Standing rules added by Mike: the target length is an
argument (30 s default, outro inside), the opening FACE hook is the natural hook, and for VARIETY any span that carries an
Envato clip or a ChatGPT image gets ONE alternative asset (`assets/short/`) overlaid in the short. The CTA line is the SHARED
take `assets/vo/cta-watch-full.mp3` ("Click below to watch the full video"), mixed by `scripts/mix_short.py`; never re-voiced.

## There is NO plan gate, in code (Mike, 2026-10-29)
Mike: "There's no gate to ask me if I approve of the plan for the short." He has never rejected a short cut from a longform
edit; at most he asks for a second or two of change on the FINISHED short. `gate_short_plan` auto-approves in
`short_graph.py` (it used to be pre-approved by a launch flag, which a session forgot on growth-scale-up, 2026-10-29):
`run.py short --project <name>` plans, builds AND DELIVERS in one run: the `short` gate auto-approves too (Mike, same day:
"you could have already rendered it ... It could have already been done"). A short that passes `s_verify_final` lands at the
project root, the run notifies, and Mike watches it after; a change is a splice off the KEPT `_previews/short/`. In 16:9-sourced mode the span painting is the `s_paint_16x9` graph node.

## 16:9-SOURCED MODE (no full vertical; every-job, Mike 2026-10-08)
**Setup is automatic (2026-10-30, reset):** when `<project>-VERTICAL.mp4` is absent, `s_preflight` writes the flag file, builds the black adapter master off `<project>-FINAL.mp4` (its audio) and runs `measure_face_crop.py`. Nothing to do by hand; just run `run.py short`.
When Mike skips the full vertical ("I only want the short"), the lane still needs its two sources on one clock, so the
VERTICAL master is an ADAPTER: a full-length 1080x1920 canvas (black) on the paused spine's clock, with the short's spans
painted in after the cut plan is approved (the `s_paint_16x9` node runs `scripts/short_spans_from_16x9.py --face-from-render`; skipped when the master is already painted from the same plan). The span pictures come from the 16:9 comp rendered WITHOUT its caption track
(`render_comp.py --frames a-b --props <json with "captions": false, "pops": false>`; the comp exposes `inputProps.captions` and
`inputProps.pops`, the painter passes both since lets-get-rich 2026-11-01), re-framed per
span: FACE spans crop 608x1080 on the measured face centre (`assets/vertical/face-crop.json`, `measure_face_crop.py`),
cover spans centre-crop (the variety rule overlays native-vertical alternates on Envato / AI-still spans anyway). The flag
file `assets/short/from-16x9.json` tells `s_captions` that NOTHING is burned, so every span gets the short's captions.
Brief the strategist to prefer FACE spans and croppable covers and to avoid charts, receipts and text cards.
**Face position per span (growth-vs-product, 2026-10-23):** the painter centre-crops comp renders (every-job's comp reframed the face
to the centre). A comp that does NOT (kinetic signature open / side panels push the face left) halves the face in a centre crop, so
pass `--face-from-render`: FACE spans are measured on the rendered 16:9 span (OpenCV Haar, median of sampled frames) and cropped on
that centre; the measurements land in `assets/short/span-face-crop.json`. If the sampled centres spread more than 8 percent across
the span (the signature open pushes the face while the labels pop), add `--track-face`: that span gets a per-frame TRACKED crop
(Haar every frame, gaps interpolated, path smoothed over 0.7 s, window follows the face). Without it the hook-face check at the
short gate (35-65 percent at 1.0 s) failed at 29 percent on growth-vs-product. Also brief the strategist that whatever sits beside the
face (role labels, side panels) is OUT of the 9:16 frame, and to avoid frames where the face slides (panel push-ins).
**A frame-filling text card inside a span (growth-vs-product span 3, the scoreboard card):** a 608 px centre slice clips its headline
and outer chips, and the variety overlay only covers Envato / AI-still windows, never a card. Give the span `fit_windows`
(`[{"a", "b", "box"}]`, final-video seconds) in SHORT-CUT-PLAN.snapped.json: inside the window the painter shows the card WHOLE,
letterboxed on its own blurred, darkened frame; start it on the card's cross-fade and end it after the next ingress.
**Every non-face asset inside a span is rebuilt NATIVE VERTICAL (Mike, 2026-10-30, reset; overrides fit_windows as the default):**
when the full vertical is skipped, the short gets the SAME per-asset treatment `../vertical-repurpose/vertical-repurpose.md` section 1
gives a vertical, scoped to the short's spans: Envato -> a NEW vertical Envato clip (`s_variants`), ChatGPT stills -> regenerated
9:16 (`s_variants`), title / card slides, diagrams and chart states -> the SAME HTML re-shot at 1080x1920 (reflowed, same locked
stylesheet and state; slide-builder) into `assets/short/vertical-cards/`, overlaid by the short comp over that asset's window in
SHORT time; receipts -> mobile-view captures. Never a 608 px crop, never a letterbox (`fit_windows` is now the last-resort
fallback only, with Mike's OK). FACE spans keep the measured face crop. Every rebuilt asset passes visual-qa. Reset's short did
this by hand (C4 debt ticker payoff + H4 card s1, ResetShort.tsx `NATIVE_CARDS`); the lane does not yet automate the card/chart
rebuild (see the 'not yet in code' note under the edge-text gate).
**The 16:9 comp MUST honor `captions: false` (reset 2026-10-30, Mike rejected the short):** Reset.tsx rendered its own big burned
captions regardless of the prop, so every face span carried 16:9 captions sliced at both edges ("debt gets pa") under the short's own.
Every longform comp declares `captions?: boolean` (and `pops?: boolean` when it has kinetic word pops) and renders
`{captions && <Captions />}`. Check it BEFORE `s_paint_16x9`: one `npx remotion still` of a face frame with `--props {"captions": false}`.
**A screen-share face strip in a short (quant 2026-11-06, final visual-qa; default until Mike rules otherwise):** a screen-share video's face span is the narrow OBS strip, not a 608 px face crop. It stays verbatim and centred over a blurred, darkened copy of itself, never on white bars (they slice the hair) and never scaled to fill (the caption lands on the nose and mouth). `QuantShort.tsx` `FACE_BAR` is the worked recipe. A caption group on screen under 0.3 s merges into the group before it (`s_captions`).
**A caption group holds until its LAST WORD ENDS (lets-get-rich 2026-11-01, final visual-qa):** `s_captions` writes each group's
end as `e` in `ZCAPTIONS` (short seconds, capped at the span end); the short comp hides a group at
`Math.min(next.t, Math.max(cur.t + 1.3, cur.e))`, never on a flat 1.3 s cap (a 2.4 s spoken "353x" went blank mid-word). Word
ENDS map to final time through the pauses strictly BEFORE them (`_sh_end_fn`): a clip insert spliced right after a word plays
after it, and the old `<=` mapping stretched "market." over the insert and dropped its caption.
**Short captions sit in the SAFE ZONE:** bottom pad ~320 px (block at y ~1420-1600), maxWidth <= 860 px so the 1.12 pop and the
12 px stroke stay inside 1080; never on card text; in 16:9-sourced mode they run over EVERY span (nothing is burned).
**Edge-text + coverage gates (in code, `s_verify_final`, 2026-10-30):** (1) in 16:9-sourced mode the 16:9 comp source must
declare `captions?: boolean` and gate `{captions && <...>}`, else FAIL; (2) in 16:9-sourced mode `_uncovered_16x9_covers` maps
every span's non-FACE frames (AS-RECORDED FACE windows) to short time and FAILS on any window of >= 1.5 frames not covered by a
native overlay listed in `assets/short/variants.json` or `assets/short/vertical-cards.json` (`cards` = re-shot 1080x1920 assets,
`holds` = a face frame held over a 2-4 frame chart/card sliver where a face span enters or leaves on a film burn); proven on reset:
without the json it reports 10.63-11.60 (C4), 17.80-18.89 (H4), 18.90-18.96 (H5 sliver), 24.86-24.98 (H2 sliver); (3) on every
short, `scripts/check_short_edge_text.py` checks EVERY frame and FAILS when stroked caption glyphs or dark-on-light text are sliced
by the left/right 2 percent margin (>= 120 text-edge pixels over >= 25 rows in a 22 px strip; the CTA outro skipped); per-frame
scores in `_previews/short/qa/edge-text.json`. Calibrated on reset's rejected short: 302 of 816 frames flagged (every 16:9 caption
remnant). It is weak on a FADED cropped light card (a 7-frame H4 flash under a fading overlay scored 52 px), which is why gate (2)
is the structural one. **Captions:** a group whose first word Whisper stamped up to 0.6 s before the span start (its token absorbed
the pause) is kept and shown from the span's first frame (`s_captions`, reset 'inflation makes' was silently dropped).
**In code (2026-10-30, after reset):** node `s_vertical_cards` (after `s_variants`, 16:9-sourced mode only) lists every COVER-PLAN
container / title / diagram / chart / timeline / receipt beat inside each span (`_span_cover_hits`), spawns slide-builder /
chart-builder / receipt-capturer for 1080x1920 rebuilds into `assets/short/vertical-cards/<id>-<slug>-v.png`, visual-qa's them
(2 rounds, then the node FAILS: a crop never ships), turns every burn sliver (< 0.5 s at a span edge) into a HOLD of the adjacent
face frame off the painted adapter master, and writes `assets/short/vertical-cards.json` (`cards` + `holds`); `s_comp` overlays
them. Verified on reset: it finds exactly the hand-built set (C4, H4 cards; H5, H2 slivers). Node `s_qa_final` (after
`s_verify_final`, EVERY short) tiles the finished short at 2 fps into time-stamped contact sheets and the visual-qa agent judges
every frame (edge-cut text, cropped 16:9 assets, caption remnants, captions on card text, face framing, outro); a FAIL stops
delivery. The cut-plan brief's "avoid charts and text cards" is now optional.
**A kinetic word pop inside a span (only-18-months-left 2026-10-28, Mike caught it at review):** the longform's big pop
(hw-word-pop, 212 px, ~1110 px wide) is cut by the 608 px slice to a fragment ("18 MONTHS" read "ONTH"). Render the span with
the comp's pops OFF (a `pops` prop next to `captions`) and draw the pop NATIVELY in the short comp, sized so its overshoot fits
1080 px (160 px Showcard Gothic for "18 MONTHS"), in the caption slot with captions off under it. Check every span for pops
BEFORE the render; a miss is a splice fix (re-render the span + the pop's frames only), never a full re-render.
**A variant NEVER stops the short (Mike, 2026-10-28, in code: `s_variants`, proven by `graph/test_asset_qa_retry.py`):** a variant is
optional (without one the short shows the longform's own asset), so `s_variants` runs up to `VARIANT_ROUNDS` (2) source + visual-qa
rounds: a FAIL is moved to `_previews/short/qa/rejected/` and that slot alone is re-sourced with EVERY earlier verdict as feedback;
a PASS carries over and is never re-judged (re-judging flip-flopped: a second pass failed four images the first had passed). A slot
still open after the last round is AUTO-WAIVED into `assets/short/variant-waivers.json` (`"AUTO-WAIVED <time> ..."`), the run goes on
to the render, and the `short` gate names the waived slots so Mike can ask for a re-source. Why: only-18-months-left (2026-10-27)
failed one Envato slot three times and sat FAILED overnight instead of delivering the short; growth-vs-product (2026-10-23) hit the
same wall and was waived by hand. **Waiving by hand** is still `{"BR-1": "why"}` in the same file (Mike's call, or the orchestrator's,
logged in PROJECT-LOG); to retry an auto-waived slot, delete its entry and re-drive `s_variants`. Everything downstream (extract,
captions, comp, render, mix, verify, gates) is the normal lane.
**In 16:9-SOURCED mode an AUTO-WAIVED slot cannot ship (lets-get-rich BR-7, 2026-11-01):** the waived beat shows the longform's
16:9 asset CROPPED, so `s_verify_final`'s coverage gate fails the short (correctly). Re-source the slot by hand, briefed on the
longform's ACTUAL asset (open `assets/vid/<id>-*`), not only the BROLL-PLAN wording: BR-7's plan said "dark Discord chat on a
monitor" (no vertical stock exists), the longform had used abstract chat bubbles, and a native-vertical neon bubble loop passed
first time. Then add the PASS to `assets/short/VISUAL-QA.json` under the clip's `<stem>.mid.png`, drop the waiver, add the overlay
to the short comp's COVERS, and re-drive with `--redo s_verify_comp,s_render`.

### Captions never cross a span end (lane rule in code, 2026-10-08)
`s_captions` builds the short's caption groups from the words the short KEEPS only (a word belongs to a span when its
midpoint lies inside the span; Whisper onsets run early). Grouping on the whole transcript welded a span's last word to the
longform's next word ("fast i" on every-job: "coming fast" + "I think we're only a few years away"), a word the short never
says. If a seam caption ever shows a stray word again, check this rule before anything else.

## When this runs

After the vertical longform exists and Mike has approved it. **The short is a CONDENSATION, not a new
edit**: every frame of video and every word of audio already exists in the vertical master. Nothing is
re-shot, re-voiced, or re-covered — the only new material is the outro card and its one TTS line.

## 0. Why this is NOT the livestream clip-selection lane

`clip-strategist` picks clips out of a RAW livestream, where the only content is Mike talking and the
visual is decided later. Here the source is a **tightly edited film**: every second is already covered
by a specific visual, transitions sit between beats, charts animate on their own clock, and captions are
burned in on face beats. So a span choice is simultaneously an AUDIO choice and a VISUAL choice — cut at
3:18 and you get the C4 diagram, not his face. That is why this lane has its own strategist
(`short-cut-strategist`) and its own boundary rules.

## 1. The two sources (they share ONE clock)

| Need | File | Notes |
|---|---|---|
| **Video** (all visuals composited: b-roll, slides, charts, captions, transitions) | `<project>/<name>-VERTICAL.mp4` | the delivered vertical |
| **Audio** (VO ONLY, no music, no SFX) | `<project>/spine/ALL.f.paused.mp4` | the paused spine |

**Both run on FINAL-VIDEO time** (source spine seconds + 1s per baked chapter card, i.e. the comp's
`sh()`), so a span `[a,b]` cuts identically out of both. Confirm the two durations match to ~0.2s before
you cut anything; if they don't, you have the wrong spine letter.

Take the VO from the SPINE, never from the vertical master, for TWO reasons:

1. The master's audio has the music bed and SFX baked in, and a bed cut at 5 arbitrary points jumps
   audibly at every seam.
2. **The master's audio sits ~42.7 ms behind its own video** — 2048 samples of AAC encoder priming from
   the ffmpeg mix step, which the mp4 muxer does not compensate with an edit list. Measured on kaspa
   30bps: constant across the whole file (identical at 33s, 200s and 400s), normalized cross-correlation
   peak 0.974. It is well inside the perceptual tolerance for audio-lags-video so it is not a defect to
   chase in a delivered file, but pairing master VIDEO with SPINE audio removes it for free, so the
   short ends up in tighter sync than its own source. Verify it before you build:

```python
# peak lag between master audio and spine audio; expect ~0 after you understand the priming
c = np.correlate(master - master.mean(), spine - spine.mean(), 'full')
lag = (c.argmax() - (n - 1)) / sr        # >0 = master audio is LATE by that much
```

## 2. Shape of the short (the strategist authors this)

A 40s short is a complete little argument, not a highlight reel:

```
0:00-0:03   HOOK      the single hardest line; usually the longform's own hook, which was engineered for it
0:03-0:33   BODY      2-4 spans that land ONE claim and its proof. Not a summary of the video, ONE idea.
0:33-0:37   KICKER    the payoff line that makes the claim feel earned
0:37-0:40   OUTRO     text card + TTS: "Click below to watch the full video." (§4)
```

Budget the outro INSIDE the target length — a "40 second short" is 40 seconds delivered.

## 3. Span rules (all are hard; the strategist must respect them and the builder must verify)

1. **Cut only at a measured trough in the SPINE, and never on a Whisper word boundary.**
   ⛔ **MECHANICAL GATE — `python skills/longform-to-short/lint-short-spans.py <cut-plan.json> <spine/ALL.f.paused.mp4>
   --write-snapped <snapped.json>` must pass (exit 0), and the BUILD USES THE SNAPPED PLAN.**

   Understand what this gate is doing, because the source is unlike a raw recording. **The spine is
   DESILENCED — the silence was deliberately removed** — so there is no quiet band to cut in. What
   remains between two words is 100-180 ms of breath and plosive tail containing a narrow instantaneous
   trough (measured on kaspa 30bps: -61 to -95 dBFS, but only 5-15 ms wide). Whisper's word boundary is
   NOT that trough: a 180 ms "gap" still held 5 ms windows at -18 dBFS. So the gate finds the nearest
   real trough and snaps the boundary to it, typically by 5-35 ms when the plan is close and ~270 ms
   when the plan landed mid-word.

   Because the trough is narrow, **every audio splice gets a ~12 ms crossfade** (the same principle as
   the desilencer's 8 ms declick). Butt-joining two troughs still clicks.
2. **Never cut inside a transition window** (`TRANSITIONS.md`) or mid-animation on a Type 1 chart. You
   will land on a half-melted frame or a bar frozen at 40%.
3. **Self-contained test.** Every span must make sense cold. Reject spans that open on "as I said",
   "that's why", "so it", or any pronoun whose referent is 4 minutes earlier.
4. **Visual variety.** Do not take 3 spans that are all covered by the same b-roll clip or the same
   diagram — the short will read as one static image with a voiceover.
5. **Assembly order is a narrative choice**, not necessarily chronological, but the audio must not
   contradict itself (don't put a conclusion before the fact it depends on).
6. **Nothing is re-timed inside a span.** No speed-ups, no internal trims. A span is a verbatim slice.
7. **A SILENT span is a held still with no VO (Mike, 2026-10-22, kcc20).** `"silent": true` on a span takes the PICTURE from the
   vertical and generates silence for its VO (the bed and the seam whoosh still play), because the spine under that picture is a
   line the short does not say. Use it for a beat that must be SEEN, not heard: on kcc20 the hook says KCC-20 "just moved into
   its final review window" (Oct 7), so the dated stamp "UPDATE / KCC-20 IS FINAL / OCT 21, 2026" holds ~1.9 s right after it.
   The lint skips it (no word cut), the extractor writes an `anullsrc` wav, the captions step gives it no words and no window,
   and the span still needs `sourced` + a parenthesized `says`. It adds to the runtime: re-size the target on resume
   (`--resume --seconds N`, which updates the thread's target).
8. **NO WHITEBOARD BEAT under any span (Mike, 2026-11-06, quant: "don't do any white boarding in the short").** A hand-drawn
   whiteboard scene is a wide 1920x1080 composition: the 9:16 centre crop slices the drawing and its labels, and there is no
   native-vertical rebuild for it (whiteboard is not a `VCARD_KINDS` kind, and a fit on a paper page is a letterbox). The quant
   short's first plan put three spans over WB3, WB6 and WB11 and failed `s_verify_final` on exactly that. So the strategist picks
   FACE spans, cards, charts and receipts, never a whiteboard window. ⛔ IN CODE: `s_cut_plan` hands the strategist every whiteboard
   window in final time (`_whiteboard_windows_final`, cover beats + screen-share bodies) and FAILS a plan whose span overlaps one by
   more than a frame (`_whiteboard_overlaps`); the fix is `--redo s_cut_plan`.

## 4. The CTA outro (Higgsfield MIKE-CLONE TTS)

The last ~3s: a full-frame text card reading **"WATCH THE FULL VIDEO"** (house stylesheet, no em dashes)
over the last frame or a held b-roll, with Mike's cloned voice saying the line.

- **Generate the voice via `video-creation/skills/higgsfield-voice/SKILL.md`** — Higgsfield has NO TTS
  API, so this is the Playwright/CDP browser flow against the `hfbot-profile` Chrome on port 9333, Audio
  tab → Seed Speech → voice preset **MIKE-CLONE**. That skill owns every rule; do not hand-roll a driver.
- **Apply its TTS markup rules**: ALL-CAPS only on content words of 5+ letters (short words clip), `...`
  for a beat. The shipped line is `Click below to WATCH the full video.` — not `CLICK BELOW` (caps on a
  4-letter word clips), and ⛔ **not a trailing `!`**: `!` lifts the LAST word, so the first take stressed
  "video" and Mike caught it on first listen. End on a period and let the CAPS carry the stress.
- **QA the take with local whisper** before it goes in the mix. A garbled CTA is the one line every
  viewer hears.
- **The approved take is a SHARED asset: `video-creation/assets/vo/cta-watch-full.mp3`** (Mike, 2026-07-25),
  sitting with the shared music/sfx/transitions, NOT in any project folder. Reuse it for every short off
  every project; see `assets/vo/README.md`. Regenerate only when the line changes or Mike rejects the
  reading, and edit `assets/vo/CTA-SCRIPT.md` first so `verify-tts.js` can gate the chunks. It costs
  credits, so it needs Mike's OK (root `CLAUDE.md` cost rule), and a needless re-roll also DRIFTS the
  delivery, which would leave shorts from different videos ending on different readings.

## 5. Build

Three stages. Do NOT point the comp straight at the 7-minute master: seeking one `OffthreadVideo` to five
scattered points in a 130 MB h264 file is the same frame-proxy saturation that has killed renders in this
track before (`../comp-build/comp-build.md` §6a). Pre-extract instead.

**Stage A (ffmpeg) — cut the spans to small intermediates.** Per span, video-only from the master and
audio-only from the spine, both frame-exact:

```bash
ffmpeg -y -ss <start> -i <master> -frames:v <n> -an -c:v libx264 -crf 16 -preset veryfast _short/span-N.mp4
ffmpeg -y -ss <start> -i <spine>  -t <dur>     -vn -c:a pcm_s16le                        _short/span-N.wav
```
Use `-frames:v`, never `-to` (which measures from the seek point, not the timeline — it has produced
wrong-length output in this repo before). Verify each intermediate's frame count before continuing.

**Stage B (Remotion) — assemble.** 1080×1920 at 30fps, one `OffthreadVideo` per span intermediate laid
end to end in `Sequence`s, plus the caption layer and the outro card. Small linear-played files, so no
seeking cost. Point `--public-dir` at the folder holding the intermediates and the CTA card PNG.

**Stage C (ffmpeg) — audio.** Concat the span wavs, append the CTA take, lay the bed, mux (§6).
- **Seams**: a short hit from the video's own transition family (`TRANSITIONS.md`) between spans. Keep it
  fast (~0.3s) — a short cannot afford a luxurious dissolve.
- **⛔ CAPTIONS — the trap.** The longform burns captions on FACE beats ONLY (`CAPTION_SRC = FACE`), so a
  span cut from a COVER beat arrives with NO captions and a short must be captioned end to end. Add the
  house caption track (`captions-builder`) over the COVER-sourced output frames ONLY. Compute those
  frames from the project's FACE table; never blanket-overlay, or you double up on the face spans.
- **Audio**: concat the VO spans from the paused spine (sync-safe `filter_complex`, never the concat
  demuxer), then mix per §5 below.

## 6. Mix

One continuous bed across the whole short, chosen from the project's `MUSIC-PLAN.json` (usually the
bed that scored the chapter the hook came from), at the house level (~16-18 dB under VO — measure LUFS,
never guess). Optional: a soft whoosh on each seam. The CTA line sits at VO level, not under the bed.

## 7. QA + deliver

- **Listen to every seam** — the #1 defect is a clipped word or a bed jump at a splice.
- **Read frames at every seam** — no half-transition, no frozen chart.
- **Confirm captions are continuous** end to end and never doubled.
- **Confirm the total runtime** matches the target (40.0s ± 0.2s).
- Deliver as `<name>-SHORT-40s.mp4` with the full absolute path. It is a SEPARATE deliverable; only
  stage it into a queue when Mike says so.
