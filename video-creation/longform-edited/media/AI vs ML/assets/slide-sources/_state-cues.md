# AI vs ML: slide state cues

Times are on the FINAL spine (`spine/ALL.e.enhanced.mp4`, its medium-words JSON), before any card-pause shift. Each state is a hard swap: shared elements are pixel-identical inside one id, so a swap reads as the word landing. The last state of each run holds to the end of its beat.

Look: the "Energetic" theme (kinetic-text-2023, Mike's 005 look) named by the approved SCREENPLAY VISUAL-PLAN and the COVER-PLAN slot notes, layered on the locked `container-canonical.css` (pasted verbatim; DARK theme, no accent file). Turquoise suede, crumpled paper, Montserrat ExtraBold Italic caps, AI ENGINEER = yellow #FCFE40, ML ENGINEER = green #1EFF06, red #E0151A key words on paper. Every held card floats on `kt-camera-wobble` in the comp (105 percent scale + drift); all text sits inside the wobble-safe box. Source + driver: `build_slides.py` (re-run `python build_slides.py` to rebuild every frame).

| File | Folder | From (s) | Cue word (spine) | Shows |
|---|---|---|---|---|
| roles-split | card-slides | 12.367 | beat start ("So" 12.42) | AI ENGINEER (yellow) VS ML ENGINEER (green), held to 13.97 |
| ai-identity | card-slides | 17.33 | beat start ("On" 17.42) | eyebrow AI ENGINEER, headline SHIPS PRODUCTS ON A MODEL SOMEONE ELSE ALREADY TRAINED, all white |
| ai-identity-s1 | card-slides | 18.22 | "someone" | SOMEONE ELSE turns yellow (held to 19.70) |
| build-train-deploy | card-slides | 23.60 | beat start | eyebrow ML ENGINEER only (0.30 s; the comp may enter straight on -s1 at 23.60) |
| build-train-deploy-s1 | card-slides | 23.90 | "building" (Whisper hears "billing") | + BUILD |
| build-train-deploy-s2 | card-slides | 24.70 | "training" | + TRAIN |
| build-train-deploy-s3 | card-slides | 25.50 | "deploying" | + DEPLOY (held to 26.24) |
| paper-sum-up | card-slides | 58.10 | beat start ("To sum it up" 58.06; "AI" 59.64) | lines 1-2: AI ENGINEERING IS LESS / ABOUT DEVELOPING MODELS + the credit CHIP HUYEN, AI ENGINEERING |
| paper-sum-up-s1 | card-slides | 62.00 | "and (more about)" | + lines 3-4 in black: AND MORE ABOUT ADAPTING / AND EVALUATING THEM |
| paper-sum-up-s2 | card-slides | 62.78 | "adapting" | ADAPTING turns red |
| paper-sum-up-s3 | card-slides | 63.50 | "evaluating" | + EVALUATING turns red (held to 64.39) |
| wave-wall.mp4 | kt-renders (assets/kt-renders/wave-wall.mp4: 2.367 s = 71 frames, 1080p30, no audio; outside the reconciled card folder so it is not an orphan) | 73.05 | beat start ("If" 73.12) | the Scene_22 template RENDERED (TRAIN / SHIP rows), ALREADY OFFSET to the readable range (raw render frames 49-119, see below): play it FROM ITS FRAME 0, no startFrom; the comp spins it in (kt-spin-cut, whoosh-4) and plays it to 75.37 (1 spare frame at the tail) |
| wave-wall.png | card-slides | (QA poster) | | clip frame 28 (spine ~73.98) of wave-wall.mp4 for visual-qa: TRAIN whole in both green rows; NOT for the comp (kt-wave-wall: render the template, never stills) |
| math-not-code | card-slides | 92.02 | beat start ("If" 92.08) | IF YOU HAVE, both rows at rest (muted, readable, empty badges) |
| math-not-code-s1 | card-slides | 92.76 | "math" | MATH black + green tick |
| math-not-code-s2 | card-slides | 93.58 | "production" | + PRODUCTION CODE black + red cross (held to 94.58) |
| end-screen | card-slides | 139.533 | beat start ("And watch" 139.62) | WATCH NEXT + four empty 16:9 slots, no arrow |
| end-screen-s1 | card-slides | 140.86 | "right (here)" | arrow on slot 1 (top left), slot 1 border yellow |
| end-screen-s2 | card-slides | 142.32 | "this (one)" | arrow on slot 2 (top right) |
| end-screen-s3 | card-slides | 143.14 | "(or) this (one)" | arrow on slot 3 (bottom left) |
| end-screen-s4 | card-slides | 144.44 | "(even) this (one)" | arrow on slot 4 (bottom right), held through the last word 145.00 + the 2.0 s END HOLD to 147.00 |

End-screen slot geometry (1920x1080, for placing the YouTube end-screen elements): each slot 560 x 315 px (16:9), top-left corners slot 1 (364, 236), slot 2 (996, 236), slot 3 (364, 607), slot 4 (996, 607).


WAVE WALL, FINISHED BY HAND (2026-11-10, Mike asleep): the Scene_22 render completed in After Effects (_previews/slide-builder/wave-wall-raw.avi), then Mike asked that After Effects NOT be opened again and that the effect never block the run ("the effect is not worth it"). The slide-builder was stopped; the render was encoded with ffmpeg only to assets/kt-renders/wave-wall.mp4 (+ the QA poster card-slides/wave-wall.png). NEVER re-render it or open After Effects for it. If the comp cannot use the clip, drop the wave wall and show the bench (a TRAIN MODELS -> ML ENGINEER card) instead of blocking.

WAVE WALL OFFSET (2026-11-10, visual-qa rebuild, ffmpeg only, no After Effects): visual-qa failed the first poster because the clip's FIRST 2 s read "RAIN . TRA" in both green rows (the curl smears the left T while the right TRAIN is still curling in). A frame scan of the 4.0 s render found a whole TRAIN only in raw frames 0-19 and 64-119. So the comp input is now the clip's TAIL: raw frames 49-119 were trimmed out of `_previews/slide-builder/wave-wall-raw.avi` (x264 crf 16, same as the first encode) to `assets/kt-renders/wave-wall.mp4`. Clip frames 0-4 (73.05-73.18) are under the spin; 6-14 read TRAIN with a curl smear on the N; from clip frame 15 (spine 73.55) to the end, a clean whole TRAIN reads in BOTH green rows (79% of the beat, 81% of the sharp part before the library's blur-out at +1.90 s). The SHIP rows read SHIP whole throughout. The old 4.0 s encode is kept as `_previews/slide-builder/wave-wall-full-4s.mp4`; the window contact sheet (every 2nd frame, spine-timed) is `_previews/slide-builder/wave-wall-window-sheet.png`.

VERTICAL CUT (Mike 2026-11-11, "proceed with the full vertical conversion"): the wave wall is NOT re-rendered for 9:16 and
After Effects is never opened (effects-library.md section 3 item 5). The vertical comp either fills the portrait frame with
the existing `kt-renders/wave-wall.mp4` (scaled to cover, the rows are a repeating pattern, so a crop reads whole; FLAG it as a
crop) or builds the bench card TRAIN MODELS -> ML ENGINEER in code. kt-boxed-words stays Remotion code; the emoji stays dropped.
