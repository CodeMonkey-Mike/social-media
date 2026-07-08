# Yuli y Ana — project bible (READ FIRST, every session)

_Auto-loaded whenever you work under this folder. This is the **machine-independent** memory for the
project: anyone who pulls this repo on any computer (no Claude memory) can read this file and the two
SPEC files and know everything. **This file points and records at-a-glance facts; the SPEC files are
the canonical deep detail. Canonical sources win on conflict.**_

## What this is
An AI-persona Instagram channel built around **two AI-generated women** who talk to camera about the
crypto-rich community / crypto projects. Casual, NOT cinematic. They talk AND move (gesture, walk, to
camera). Both are idealized-but-faithful AI renders of two real women (Ana first, Yuli second).

## ⚠️ NO B-ROLL REUSE ACROSS CHANNELS (preference — Mike, 2026-06-22)
Mike runs THREE accounts that often cover the same topic with the SAME editing style: **his own**
(@CodeMonkeyMike / the main shorts+longform), **Ana**, and **Yuli**. To give cross-subscribers something
at least a little different, **do NOT reuse b-roll (images or video clips) across these channels** — even
when a Yuli video covers the exact topic of one of Mike's. Generate FRESH b-roll for each persona's video
(distinct concepts/compositions, not just distinct files). Shared spine/face pipeline + caption/transition
STYLE is fine to repeat; the b-roll visuals are what must differ. (E.g. the Yuli "kaspa-covenants" video
generated all-new ChatGPT b-roll rather than reusing the covenants-short's coin/tunnel/ecosystem assets.)

## The two personas (canonical detail in the SPEC files — READ before generating)
| | **Ana** | **Yuli** |
|---|---|---|
| Spec (CANONICAL) | `ANA-SPEC.md` | `YULI-SPEC.md` |
| Trained Soul id | `eb2566fb-c2ca-4f53-9846-efcab279350e` (`.soul-ana-id.txt`) | `668b13cf-fdcc-4dd0-bac8-fe45506fe0f6` (`.soul-yuli-id.txt`) |
| Look (short) | medium-brown skin, long **straight** dark hair; slim face, defined jaw; **render ~26**; body −12%, **curvy pronounced backside**; 5'7" | fair skin, dark **curly** hair (signature, never straighten); soft slightly-full youthful face; **render ~28**; body −18% but curvy/petite; 4'11" |
| Smile rule | gentle **closed-lip / soft** only, NO wide open-mouth grin | soft **genuine** smiles are fine; avoid only over-wide forced grin |
| Generate | `text2image_soul_v2 --soul-id <id> --quality 2k --aspect_ratio 9:16 --wait` | same |

> Soul `aspect_ratio` enum: `1:1 16:9 9:16 4:3 3:4 3:2 2:3` only — **NO 4:5** (use 3:4 for portrait).
> Always re-state the look guardrails in the prompt even with the Soul (see each SPEC's recipe rules).
> Old/superseded Soul ids (DO NOT use): Ana `328e2c3e-…`; Yuli `f75e48f5-…`.

## The studio (the agreed set)
A cozy magenta/hot-pink-lit crypto content-creator room. Reference images live in `studio/`:
- **Locked agreed look = the PINK-lit set** — `studio/angles/*-pink.png` (e.g. `angle-backwall-pink.png`).
  Deep magenta + hot-pink LED accent glow, dark textured plaster walls.
- Older `studio-hero-v7-redbright.png` is the RED variant (superseded by the pink look for these videos).
- Furniture (must stay consistent): two cat-ear gaming chairs, a curved **purple velvet** channel-tufted
  sofa, a distressed whitewashed light-wood dresser, floating shelves with candles + small plants + a
  hand figurine, a patterned **red** vintage rug, wood floor, a podcast boom mic, two desks — the
  RIGHT-side recording desk has wide dual monitors showing **green crypto candlestick charts**.

### ⚠️ CHAIR ASSIGNMENT + ROOM GEOMETRY (locked — Mike, 2026-06-19)
- **Ana → the PURPLE cat-ear chair**, at the **RIGHT-side** recording desk (green crypto charts + boom mic).
- **Yuli → the PINK cat-ear chair**, at the **LEFT-side** desk (audio/waveform monitor + laptop + studio
  speaker + boom mic + two warm wall sconces).
- The two desks face **opposite walls** (left desk faces left wall, right desk faces right wall); the sofa +
  dresser are on the back wall between them.
- **Never swap chairs/desks.** (Wrong chair once on 2026-06-19 — this rule prevents it.)

### ⚠️ WEBCAM-POV BACKGROUND RULE (locked — Mike, 2026-06-19)
A persona's webcam sits on **their own** monitor and faces them, so **their own desk/monitors are BEHIND the
camera, NOT behind them.** What's behind the person in a webcam talking-head is the **OPPOSITE desk across the
room**:
- **Ana's webcam shot → YULI's desk behind her** (pink chair, audio/waveform monitor, laptop, speaker, sconces).
- **Yuli's webcam shot → ANA's desk behind her** (purple chair, green crypto charts, boom mic).
- Do NOT put the person's own monitors/charts behind them in a webcam shot. (Got this wrong twice on
  2026-06-19 — anchored on the prior still's background instead of reasoning from the webcam POV.)

### How to put a persona IN the studio (Soul can't see the room)
`text2image_soul_v2` is **text-only background** — it invents a room, so it can NOT reproduce this exact
set. To place a persona in the real studio, composite with **Nano Banana Pro** using multiple refs:
```
higgsfield generate create nano_banana_2 \
  --image studio/angles/angle-backwall-pink.png \   # the room (first)
  --image MASTER/ana-master-face-12pct.png \         # identity
  --image MASTER/ana-master-body-12pct.png \
  --aspect_ratio 9:16 --resolution 2k --wait \
  --prompt "Place <persona> seated in the <correct-color> cat-ear chair at the <desk>, keep the studio
            identical, <look guardrails from SPEC>, facing camera, waist-up vertical, no text/watermark."
```
Trade-off: Nano Banana identity is slightly weaker than the Soul but it reproduces the real room/chair;
the Soul gives best identity but a fabricated background. Pick per shot.

### ⚠️ FIX-ONE-THING = EDIT, never re-roll the Soul (locked — Mike, 2026-06-22)
`text2image_soul_v2` redraws the ENTIRE image from a new seed every run, so changing one detail
(prompt tweak) reshuffles EVERYTHING else — hair, chair, background. That is the cascade that wasted a
whole iteration loop on `yuli-pinkchair-webcam.png` (cat-ears fix changed the hair; hair fix moved the
monitors; …). **Once a still is approved, LOCK it.** To change ONE element, do a TARGETED image edit on
that approved PNG with **Nano Banana Pro** (`nano_banana_2 --image <approved.png> --resolution 2k`),
prompted to "change ONLY X, keep absolutely everything else identical and unchanged." Nano Banana is
faithful to the input (it preserves the untouched regions), so the rest stays put. NEVER regenerate the
Soul to fix a small detail. (Worked example + the exact cat-ear edit prompt: that PNG's `*.prompt.txt`.)

## Production route — video (applies to BOTH; full detail in the SPEC files)
- **Video = Seedance 2.0 image-to-video off a Soul/composited still** (`seedance_2_0`, start image,
  9:16, **480p ONLY — HARD RULE, never higher; Remotion upscales free**).
- **Match clip duration to the spoken line** (a too-long clip makes Seedance invent gibberish to fill).
- **One speaking character per generation, NEVER two** (causes hallucinations). For dialogue in one
  scene: one clip per line, **chain each next clip from the previous clip's LAST FRAME**, "static
  locked-off camera," then concatenate. Listener: relaxed natural expression, NOT a frozen smile.
- **Voice:**
  - **Ana** — Seedance-NATIVE: put the exact line in quotes + "speaks English with a distinct, clearly
    noticeable Dominican Spanish accent." Keep the prompt otherwise minimal. (ElevenLabs library
    Dominican voices were tried + dropped — "did not sound like them.")
  - **Yuli** — preferred is **lip-sync to a pre-made clone track** via Seedance `--audio` + a MINIMAL
    prompt (a verbose prompt makes Seedance ignore the audio and invent speech); else Seedance-native
    like Ana. See `YULI-SPEC.md` Production route.
- **Captions:** Whisper hears "Kaspa" as "caspa" → always correct to **Kaspa**. Watch "Toccata" too.
  ($TAO → "TAO" never "tau", per root persona rules.)

## Asset conventions
- **`source-photos/`** = the real source selfies of the two women (`Messenger_creation_*.jpeg`,
  `ana1/ana2.jpeg`) + their `_thumbs/` previews. These are the original anchors the masters/Souls were
  built from; the SPEC "Source photos" sections point here.
- **`media/`** = per-video PROJECTS, one named folder each (e.g. `media/kaspa-toccata/`,
  `media/video1-crypto/`, `media/video-test/`) — mirrors the longform-edited `media/<project>/`
  convention. New video → new folder under `media/`. Bespoke per-video scripts live inside the
  project folder; scripts inside reach the persona root via `../../` (they sit two levels deep).
  Everything else below (the persona library + settings) stays at the ROOT, not in media/.
- **⚠️ render-assets layout (Mike, 2026-06-22 — keep it ORGANIZED, not a flat dump).** A project's
  Remotion public-dir `media/<project>/render-assets/` MUST use typed subfolders so assets are findable
  (mirrors the longform `assets/images` + `assets/video` idea):
  - `render-assets/images/` — all stills (b-roll PNGs, logos)
  - `render-assets/video/` — all b-roll video clips (e.g. Envato)
  - `render-assets/audio/` — music bed + SFX
  - `render-assets/transitions/` — the glitch transition lib (masks + sfx)
  - root keeps only the **spine** (`spine.mp4`) and `captions.json`.
  Because render-assets is the `--public-dir`, the comp's `staticFile()` paths must include the subfolder
  (e.g. `staticFile('images/foo.png')`, `staticFile('video/clip.mp4')`, `staticFile('audio/music.mp3')`).
  Set this up from the start so you don't have to reorganize + re-path later.
- `MASTER/` = the locked anchor stills (face/body/fullbody) — derive generations from these. Stays at
  the top level (live anchor library, referenced by active gen commands). Subfolders group categories
  (`real/`, `real-body/`, `makeup-preview/`, and **`studio-shots/`** = reusable persona-in-setting
  stills = reusable seated webcam talking-head anchors: `studio-shots/yuli-pinkchair-webcam.png` (Yuli,
  pink cat-ear chair; Soul-generated, prompt saved alongside as `*.prompt.txt`) and
  `studio-shots/ana-purplechair-webcam.png` (Ana, purple chair; copy of kaspa-toccata's
  `ana-webcam-final.png`). Reuse as the start frame for any new talking-head video.
- `studio/` = the room refs. `beach/` = an alt setting. Persona settings (studio, beach, bar) are
  **per-video creative choices, a reusable library — not stages that supersede each other.**
- **`_build/`** = finished, archival **persona-creation scaffolding** (one-time, the Souls are already
  trained): `training-set/` (Ana), `training-set-yuli/`, `training-set-yuli-v2/`, `validate-yuli-v2/`,
  `hero-candidates/` (Ana), `compare-options/` (Yuli). Kept out of the root to declutter; the `_gen*.sh`
  scripts inside `cd` up two levels to the project root. You rarely need these unless retraining a Soul.

## Active / recent work
- 2026-06-19: Kaspa **Toccata hardfork** 30s short for Ana — script + studio still in `media/kaspa-toccata/`.
</content>
