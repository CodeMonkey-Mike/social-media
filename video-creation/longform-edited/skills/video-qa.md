# longform-edited · VIDEO-QA (mandatory pre-delivery gate)

**A rendered video is NOT "done" until it passes this QA. Run it on the final `-sfx` file BEFORE telling Mike
it's ready.** (Mike, 2026-06-18, after several rounds of him catching issues I should have caught: loud
impacts burying VO, a CTA covering captions, light leaks not visible / mis-timed, a black dip.) The point:
deliver the finished product with these resolved, not a draft for Mike to debug.

## ⛔ THE GATE THAT KEEPS FAILING — why Mike still catches things (Mike, 2026-06-21)
Repeatedly I "QA" and still hand off broken work, because I **spot-check** instead of **reconciling**, and I
QA the wrong artifact. Two hard rules:
1. **QA the COMPLETE `-sfx` file — never a bare/silent render, never a chunk that's missing layers.** A glitch
   with no SFX, a missing impact, an absent bed are INVISIBLE if you check the layer-incomplete render. If a
   layer isn't in the file you're QA-ing, you cannot catch its absence. Mix everything first, THEN QA.
2. **Reconcile EVERY `EDIT-PLAN.md` event against the render — video AND audio — one by one.** For each event:
   a `[CONTAINER]/[IMAGE]/[VIDEO]/[FACE]/[CAPTION]` is verified by a FRAME at its timecode; a
   `[TRANSITION]/[GLITCH]/[IMPACT]/[RISER]/[MUSIC]` is verified by **measuring the AUDIO at its timecode**
   (a silent glitch/transition/impact = FAIL) AND a frame for its visual. Nothing in the plan may be missing;
   nothing on screen may be unexplained/extra. The render must EQUAL the plan. This is the step that would have
   caught the silent glitch, the bed-A dropout, the SFX burying VO, the small-blocks-instead-of-strips.
3. **Every visual event has its sound. Every glitch/transition/chapter-cut/reveal emits its baked SFX** —
   confirm it is audible at the cue (the `GlitchBlocks` engine does NOT emit its own SFX; the wrapper/mix must add it).
4. **A documented-ON layer that is ABSENT = FAIL. No "deferred / open item" handoff.** If captions are ON for
   this video (screenplay / EDIT-PLAN), a render WITHOUT captions FAILS QA — it is not "done," not even as a
   draft, until they are built and present. Same for music, SFX, face transitions, b-roll: if the plan says it's
   in, the render has it, or QA FAILS. "I deferred it" is the violation, not an acceptable QA result. (Mike,
   2026-06-21: QA should have caught the missing captions itself, before handoff.)

## ⛔ WHERE QA OUTPUTS GO — the project folder, never remotion/out/ (Mike, 2026-07-08)
**Every QA artifact — chunk renders, extracted frames, frame-stacks, preflight stills, signal-check dumps —
writes to `media/<project>/_previews/qa/`, NEVER the shared `remotion/out/` scratch dir.** `remotion/out/` is
cleanup-swept scratch shared by all projects: anything left there is an orphan with no project home (this is
exactly how `_qa_t130.png` / `_qa_stack.png` / `_nlg_preflight.png` leaked and had to be recycled by hand). Set
it once at the top of a QA pass and point every command at it:
```bash
QA="../<track>/media/<project>/_previews/qa"; mkdir -p "$QA"   # <track> = longform-edited | ai-engineering | ...
```
Name files with the project prefix so they travel with the folder and get recycled with the batch.

## STEP 0 — QA CHUNKS *before* the full render (Mike, 2026-06-18; the key fix)
**Do NOT do a 40-min full render to discover problems. Render 10-second CHUNKS at every spot you changed and
QA those first.** Single still frames CANNOT catch motion (a light-leak drift), audio (impact loudness vs VO),
or timing (a black dip / mis-timed overlay) — that's why issues kept slipping. A chunk is a real clip: you see
the motion and can mix/measure the audio.
- Render a slice: `npx remotion render src/index.ts <CompId> "$QA/<project>-ch1-chunk.mp4" --frames=A-B --public-dir <PUB>`
  (A-B = `time*30`; `$QA` from the box above — never a bare `out/…`). ~10s = ~300 frames, renders in well under a minute.
- Extract frames / stacks into `$QA` too: `ffmpeg -i "$QA/<project>-ch1-chunk.mp4" -vf 'select=...' "$QA/<project>-qa-t%03d.png"`.
- For each change, render the chunk that contains it (a light-leak hold, the CTA/caption beat, an impact, a
  cut, the outro), extract frames across it AND/OR mix the SFX onto the chunk to hear/measure the audio.
- Iterate on chunks until each change is right. Only THEN do the single full render. The full render becomes a
  confirmation, never a discovery.
- **Detect MOTION JITTER by sampling MANY frames across a hold, not one (Mike, 2026-06-21).** A single still at
  one timestamp cannot reveal flicker/bounce. For every diagram / SVG / container that holds on screen, extract
  ~4-6 frames spread across its full duration and COMPARE element positions frame-to-frame. If text/labels
  shift between frames, it is jittering (common cause: SVG `<text>` re-measuring web-font metrics per frame —
  fix by rendering labels as positioned HTML, not SVG `<text>`). The kaspa-covenants triangle labels flickered
  the whole time it was up and a single still missed it.

## How: drive `/watch` over the whole video (final pass, after the full render)
Use the **`/watch`** skill on the rendered `-sfx` mp4 (it pulls frames across the whole timeline + the
transcript, so you can actually SEE and HEAR-via-levels what shipped). Watch the ENTIRE video, not a few
frames. Then reconcile what you observe against `EDIT-PLAN.md` and the rules below. Combine `/watch` with the
cheap signal checks (ffmpeg `volumedetect` / `signalstats` at specific timecodes) to quantify what you see.

## The checklist (every item, every render)
1. **Audio balance — SFX must not bury the VO.** At every `[IMPACT]`/`[RISER]` that lands over speech, the
   hit must sit UNDER the spoken words. Check: the impact shouldn't make the VO hard to hear. If it does,
   drop that cue ~6-10 dB in the SFX mix (audio-only, no re-render). (Chapter-transition hits that land in a
   music breath are fine; reveal/over-VO hits are the risk.)
2. **No element overlaps / collisions.** Captions (bottom-center), CTA lower-third (raised, bottom-LEFT),
   charts' "MY CALL" arrow (bottom-left) must not intersect. Sample frames where two of them are on screen
   together (e.g. the CH7 plug) and confirm clear separation.
3. **Light leaks are VISIBLE and centered.** Every >5s face hold should show the warm leak, in the MIDDLE of
   the hold (not at the cut, not at the end), under b-roll, never tinting a chart. If you can't see it in a
   `/watch` frame on the face, it's too subtle — bump opacity.
4. **Captions present + correct + they CLEAR.** Every >5s face hold has captions (cross-check EDIT-PLAN
   `[CAPTION]` count); captions never over b-roll/charts/containers; text correct (brand spellings: TAO not tau,
   KAS not cash, etc.). **A caption must CLEAR after its word — never let the last word linger on screen into a
   pause/silence or carry into the next beat (Mike, 2026-06-25: "you" stuck on screen 5:38-5:47, 5:54, 6:17).**
   Sample frames in the GAPS between spoken words and at each face-hold's end: nothing should be showing.
5. **No black/blank > 0.5s** except where the script earns it. Scan `signalstats` YAVG across cover→face and
   chapter transitions for dark dips.
6. **B-roll all visible**, each on its beat, none frozen/stuck; image/video render on top of containers.
7. **Cuts clean** (desilencer leftovers gone, no clipped words, seamless splices); **outro** plays the last
   word then fades.
8. **Receipts/charts** show the real content (no bot/error/paywall frame); numbers correct.
9. **Containers SPOTLIGHT, never a whole slide held (Mike, 2026-06-21).** Reconcile every container against the
   **CUE-SHEET** (see `longform-edited.md`) and the spotlight rule (`broll-and-containers.md`: ONE sub-point at
   a time, ~5-12s each, swap on the spoken word). FAIL if any container shows its whole deck slide at once
   (title + all sub-cards) or is held > ~12s without a spotlight swap or a ≤4s b-roll cut. A ported deck slide
   dumped whole is the regression — it must reveal/highlight its sub-points as he names them. (kaspa-covenants
   C1 held 18s and C2a showed the full hardfork slide at 0:36.)
10. **No text/diagram jitter** — confirmed via the multi-frame sampling in STEP 0 (labels stable across the hold).
11. **No FACE-LEAK / off-camera glance (Mike, 2026-06-25 — "0:35 I'm looking to the side for a fraction of a
   second").** Walk EVERY face span and sample multiple frames across it (gaze skill `../skills/gaze/`): the face
   must be to-camera the whole span, with no frame of Mike glancing away / reading off-screen, and no leftover at
   a cut/desilence join. Any off-camera glance gets COVERED (b-roll/container) or the face span trimmed; in a
   baked-gating video, blacken/cover that fraction. This is the rule longform-edited.md #6 (face-leak) — QA it,
   don't just trust the spans.
12. **Title-card A-roll pause present (house rule #11).** Confirm each chapter card holds ~1000ms with the A-roll
   paused (silence + frozen frame), card readable; FAIL if narration plays under/through the card.
13. **⛔ EVERY TRANSITION: open a frame INSIDE its window and LOOK (ethereum-rwa, 2026-08-01).** A transition
   layer fails SILENTLY — nothing errors, the render log is clean, the file is the right length. v7 shipped
   with Mike's face rendered **pure BLACK at all 6 face-outs** and every automated signal said it was fine.
   **A pixel-diff/"measure the difference" check is NOT a substitute and has actively lied here** (a filter
   chain reported "0 difference" at all 8 checkpoints on a visibly broken render). For each planned transition
   extract ~3 frames spanning its window plus one just before it, and confirm: the effect is actually visible
   (not a plain cut = its plate/tile assets are missing), the OUTGOING side shows the real outgoing content
   (not black, not the wrong source, not a different zoom level), and the INCOMING side settles clean.
   Cross-check the count against `TRANSITIONS.md` — a planned transition that was never wired looks like
   nothing at all. Gate this with `lint-transition-assets.js` (CLAUDE.md §6c) BEFORE the render.
14. **⛔ DOUBLED / ECHOED VO at transitions (ethereum-rwa, 2026-08-01).** Any node an engine mounts is mounted
   **twice** (outgoing + incoming), so one unmuted video node replays the VO 2 more times ~0.1s late. Mike
   caught it by ear as a word said twice a few ms apart; it is invisible in every frame check. **Test
   numerically:** measure `volumedetect` mean over ~0.7s at a few transition timecodes on the render AND on
   `assets/spine.mp4` at the same timestamp (the spine is the single-copy ground truth). They must match
   within ~0.1 dB; the broken render read 0.4-0.6 dB HOT at exactly the transition anchors while a
   no-transition control matched. Do this on every render that has a transition layer.

## Output
List every issue found WITH its timecode and the fix (audio-mix vs re-render), fix them, re-verify the fixed
spots, and ONLY THEN report the file as ready. If a fix needs a re-render, batch all re-render fixes and run
ONE render. Never declare "done" off a spot-check.
