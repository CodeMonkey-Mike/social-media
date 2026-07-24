# Remotion Shorts Build — the finalized-short contract (livestream-repurpose shorts)

**Scope: the Phase 7 Remotion build of SHORTS cut from livestreams** (the `shorts/<batch>/` pipeline).
NOT for longform-edited, longform-presentation, or vertical-ai-persona Remotion work — those tracks
have their own production docs. This skill defines what a FINALIZED short is and gates the build.

It exists because on 2026-07-08 a full 7-clip batch shipped as "done" with **no b-roll and no SFX** —
the orchestrator's delegation said "B-roll: NONE" and the builder obeyed the delegation over the
documented standard. Hours were lost. This file makes that impossible to repeat.

## ⛔ PRECEDENCE — read this first, it outranks everything below AND above

1. **This checklist cannot be waived by a delegation.** If the orchestrator's per-run instructions
   omit, forbid, or contradict any MANDATORY item below (e.g. "no b-roll needed", "skip SFX"),
   **the delegation is wrong**. Do NOT silently obey it and do NOT silently ignore it:
   **STOP, report the conflict, and do not ship.** A "finalized" short without these items is a
   failed build, whatever the delegation said.
2. **The mechanical gate is the definition of done.** A build may only be reported "done" if
   `scripts/finalized_short_gate.py` (in this skill folder) PASSES (see §Gate). Include its output
   verbatim in the report.
3. Canonical detail lives where cited (`video-creation/SKILL.md` Phase 7 PRODUCTION REFERENCE,
   `video-creation/style-guide/shorts-style-guide.md`, `style-guide/broll-analysis.md`). **Read them
   in full before building.** This file is the contract and the gate; those are the how.

## Batch builds run IN PARALLEL — use the stage lock, never serialize

**Do NOT build a batch one clip at a time.** Launch every clip's builder at once and serialize only
the two exclusive stages with **`video-creation/shorts/_tooling/stage_lock.py`**:

| stage | exclusive over | wrap it around |
|---|---|---|
| `chatgpt` | the ONE shared `chatgpt-profile` Chrome profile | image generation only |
| `render`  | all CPU cores (CPU-only h264 on this box, no GPU encode) | the Remotion render only |

They are exclusive over **different** resources, so clip N's render overlaps clip N+1's generation.
Acquire late, release early, **never hold both**. Never kill a Chrome process you did not start.

```
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner <slug>   # blocks
... generate ...
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner <slug>
```

> Logged 2026-07-23: the orchestrator wrote "ONE CLIP AT A TIME, parallel builders WILL collide"
> into a batch's `progress.json` and built clip 1 fully serially before Mike caught it. The collide
> instinct is correct about the Chrome profile and wrong about everything else — `stage_lock.py`
> already existed for exactly this. Do not reintroduce a serial rule.

## The FINALIZED-SHORT checklist (every item MANDATORY unless marked optional)

| # | Item | Standard |
|---|---|---|
| 1 | **Layout** | Per `style-guide/shorts-style-guide.md`: face-cam zone + **dynamic b-roll zone**; captions in the middle band, never over eyes or over b-roll text. Prefer the shared `LivestreamShort` composition / an existing `BrollLayer`-bearing composition as the model — do NOT hand-roll a bare full-frame layout when a b-roll-capable component exists (Glob `remotion/src/` and check). |
| 2 | **Frame-0 thumbnail** | Designed hook cover, ONE frame only (never a held card), base video from frame 1. |
| 3 | **Captions** | Word-by-word 2-4 word groups (~0.4-0.8s), brand-color accents, built from the clip's Whisper words via the canonical captions skill. No em dashes on screen. |
| 4 | **B-ROLL COVERAGE BUDGET** (canonical rule: `video-creation/SKILL.md` → "B-roll coverage budget (HALVED 2026-07-14 — was REVISED 2026-05-24)" — this per-track skill MUST NOT contradict it) | ⛔ **Do NOT blanket the base video with b-roll.** The Content Zone (upper-50% screen-share — the chart / tweet / CoinMarketCap / project page Mike is presenting) is valuable footage and **MUST be visible in real stretches.** **HALVED BY MIKE 2026-07-14 (applies to ALL shorts going forward): Target ~30% generated b-roll (band ~25-35%), ~70% base-video showing (band ~65-75%)** - halved from the old ~55-65%/~35-45% after he reviewed `millionaires-are-made-full` (16 images / 17 beats / 66.8%, which MET the old target) and said *"I think it's too much... cut it by half of what we're doing."* Base-showing is now the DEFAULT state of the clip; b-roll is the exception that earns its place on a beat. A ~75s short lands around **6-8 distinct images, not ~16** — leave DELIBERATE gaps with NO b-roll image so the content zone shows, especially when Mike points at something on screen. Covering it ~85-100% is the documented WRONG failure (it recurred 2026-07-09: several shorts ran 0% content-zone-visible, a 1-2 image loop blanketing the whole zone — do not repeat). **Full-screen b-roll ONLY at the hook, major transitions, and the climax (1-3x total; this cap is FIRM - the 74.8s millionaires build ran 5 contiguous full-screens, which is over).** **Content-zone b-roll is SPARING, tied to a specific talking point** — a distinct cutaway for that beat, NOT a continuous loop of 1-2 images filling every second. When a beat has no b-roll, SHOW THE SCREEN-SHARE (that IS the visual — a deliberate base beat, not a "static hold" to be avoided). An off-message / low-value screen-share is NOT a license to blanket — leave base gaps or drop in a brief full-screen; the content zone still shows in real stretches. Density reference: `BROLL_RUG` in `remotion/src/constants-rug.ts` is ~50% base showing, which is now **too b-roll-heavy** - treat it as an upper bound to cut back from, not a target. Author a **BROLL-PLAN** first WITH explicit BASE-SHOWING beats (mode `base`, no image); zero orphans. **Image count is an OUTPUT of this budget** (a handful of purposeful cutaways), not a target — do NOT over-produce, and do NOT reuse 1-2 images on a loop to fill the zone. |
| 5 | **SFX** | From `video-creation/assets/sfx/` (see its `library.json`): whoosh/transition on the thumbnail cut and major b-roll transitions, impacts/dings on reveals, receipts, and punchlines; a riser builds INTO an impact where a payoff lands. A finalized short has **≥2 SFX events**; most have more. Strip baked audio from any AI b-roll video (`ffmpeg -c copy -an`). |
| 6 | Music bed *(optional)* | Only when the batch/Mike directs; measure LUFS, bed 16-18 dB under VO. |
| 7 | **QA** | Draft render ~0.3 Mbps + chunk-QA first; overlay-collision frame checks at every overlay `tIn`/handoff; blackdetect; audio levels; whisper-verify captions on the FINAL render. **An SFX cue that MASKS the VO is a build defect, not a mixing taste call** (2026-07-23): whisper-verify the final MIX, and when a line transcribes worse off the render than off the spine alone, the sting on top of it is too loud. Sweep that ONE cue's volume against Whisper until the line comes back and re-render; do not lower the payoff hit. Real case: a closing punchline read as 'even you are here, my' at sting vol 0.38 and only recovered at 0.10. |
| 7b | **Frame checks land INSIDE a beat** | `BrollLayer` renders opacity 0 exactly at a beat's `tIn`, so a QA frame pulled at the literal `tIn` legitimately shows base video and reads as a missing b-roll beat. Pull the frame one or more frames INSIDE the window. (Logged 2026-07-23.) |
| 8 | **GATE** | Run `python video-creation/livestream-repurpose/skills/remotion-shorts-build/scripts/finalized_short_gate.py --constants <constants-file> --comp <composition.tsx> --public-dir <render-assets dir> --duration <seconds>` → must print `PASS`. |

## B-roll — what it is and where it comes from

**B-roll = generated images (+ chart/news screenshots), NOT stock-footage services.** Canonical
flavors (from `shorts-style-guide.md`): chart/CoinMarketCap grabs, AI art (Pixar 3D / anime /
cinematic), meme images, animated coin/logo graphics, abstract motion, real article/tweet screenshots.

**Process, per clip:**
1. **Author `<clip-folder>/BROLL-PLAN.md`** from the transcript/captions BEFORE generating: one row
   per beat — timestamp, the spoken line, the visual, full-screen vs zone, reference image if any.
2. **Reference-image gate (named projects — MANDATORY, recurring miss):** for every named
   project/coin in the clip, `ls`/Glob **`schedule-tweets/images/reference/`** LIVE (never trust a
   remembered list). If a reference exists, that project's beat MUST be generated WITH the reference;
   a named-project short must carry that project's real branding, never only generic coins.
3. **Generate straight into the clip's `render-assets/`** with `broll-<batch>-<beat>.png` names;
   reference via `staticFile()`.
   - **Primary generator = `repurpose/generate-broll-reload.js` (ChatGPT, pool purpose `broll`).**
     Takes a `[{file, prompt}]` list; `file` is joined onto `video-creation/assets`, so a
     `..\shorts\<batch>\<clip>\render-assets\broll-<beat>.png` prefix lands it in the clip folder.
     Skips existing files (safe to re-run). This is the RELIABLE capture — it beats two failure modes
     of the automated (bot-detected) Chrome session that the older `gen-images.js`/`generate-broll-wlw.js`
     DOM-poll scripts hit:
       - **Live-DOM HANG:** after a prompt is sent the streaming DOM often never surfaces the finished
         image (it just spins), though the image IS done server-side (visible if you open the same chat
         in a clean Edge browser). Fix: poll the live DOM up to **~80s**, and if still nothing, **RELOAD
         the chat** — a fresh load pulls the completed image. NEVER re-send a prompt (a re-send is a
         duplicate generation). Reload threshold is 80s, not 60s: at 60s the reload can land as the
         image is still finishing and catch a partial.
       - **WRONG-IMAGE grab:** "take the last `<img>`" mis-grabs a pre-existing image when the page
         lazy-loads. Fix: key on the STABLE estuary `file_id` (`id=file_...`, survives reloads) and
         track downloaded ids — the new image is the one whose `file_id` is unseen.
     Typing uses the canonical human-like **~45-70ms/char** delay (matches `gen-images.js`; anti-detection).
     Best run against a FRESH chat (retire the active broll chat first) so the seen-set starts clean.
     **After a run, ALWAYS `md5sum` the beat pngs to confirm zero duplicates** (a dup = a mis-capture to
     regenerate). The build agent runs this generator ITSELF as part of building its one clip (Mike:
     a single agent builds each clip end to end, one at a time) — the reload/`file_id`/URL/modal
     handling above makes it reliable enough to run unattended. It gets stuck ONLY if you use the old
     DOM-poll scripts; use `generate-broll-reload.js`.
   - `gen-images.js` / `generate-broll-batch.js` remain for other purposes but use the flaky DOM-poll
     capture; prefer `generate-broll-reload.js` for shorts b-roll.
   - **Sanctioned fallback (Mike, 2026-07-08):** when ChatGPT is fully down, use Higgsfield
     `gpt_image_2` (`--image <ref>` for references, `--wait --json`, download the `hf_`-prefixed OUTPUT
     url, not the reference url).
4. **Reconcile before render:** every BROLL-PLAN beat has an asset, every asset is referenced in the
   comp, every comp ref exists on disk. Zero orphans.
5. **Persona inspect the b-roll (build agent, MANDATORY):** visually inspect EVERY generated b-roll
   image before rendering for a real cryptocurrency logo (Ethereum diamond/octahedron, Bitcoin ₿, any
   real project mark) or a real-person face — the image model sneaks these in. On a violation, **do NOT
   regenerate mid-build — REMAP that beat to a different clean on-disk asset** (a persona-clean one
   already generated; filenames/beat-mapping stay identical) and note the swap in the report. Generated
   coins must be blank/generic; crowds/figures are faceless silhouettes. (Recurred 2026-07-09: clip 3's
   climax + close carried ETH-diamond gems; remapped to clean full-screens, no regen.)

## Report — extend the build JSON with the gate + checklist

In addition to the existing fields (`slug`, `render_mp4`, `qa`, `needs_review`), the report MUST
include:

```json
"finalized": {
  "gate_output": "<verbatim PASS/FAIL output>",
  "layout_broll_zone": true, "frame0_thumbnail": true, "captions": true,
  "broll_beats": 0, "broll_max_gap_s": 0, "fullscreen_at_hook": true,
  "sfx_events": 0, "reference_gate_checked": true, "broll_plan": "<path>"
}
```

Any `false`/failing value = the build is NOT done. Say so plainly instead of shipping.
