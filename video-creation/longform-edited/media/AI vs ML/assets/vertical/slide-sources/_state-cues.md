# AI vs ML: VERTICAL (1080x1920) slide state cues

The vertical slides are the 16:9 slides RE-SHOT at 1080x1920 (vertical-repurpose.md section 1): same ids, same file names,
same states, same cue times, same look (container-canonical.css verbatim + the ENERGETIC kinetic-text-2023 layer + a
PORTRAIT layer that only sets the 1080x1920 frame and the end-screen slot size). **Every cue time, cue word and hold in
`../../slide-sources/_state-cues.md` applies unchanged**; only the geometry below differs.

Source: `containers.html` (this folder, all portrait frames) written by `../../slide-sources/build_slides_vertical.py`
(it imports the 16:9 driver `build_slides.py`, so the CSS and state logic cannot drift). Rebuild:
`python build_slides_vertical.py [id ...]` from `assets/slide-sources/`. PNGs: `../card-slides/<id>.png`.
Every text block sits inside the portrait wobble-safe box (x 54-1026, y 114-1806) and above y 1680 (the phone UI band).

| File | Portrait reflow (vs 16:9) |
|---|---|
| roles-split | AI ENGINEER (yellow) stacked over VS over ML ENGINEER (green); the rules beside VS turn horizontal |
| ai-identity, -s1 | one card (x 56-1024, y 440-1426); headline wraps to SHIPS / PRODUCTS / ON A MODEL / SOMEONE ELSE / ALREADY / TRAINED; SOMEONE ELSE turns yellow in -s1 |
| build-train-deploy, -s1..-s3 | eyebrow ML ENGINEER at y 514; BUILD / TRAIN / DEPLOY keep the down-right staircase, tighter in x (centres y 820 / 1040 / 1260) |
| paper-sum-up, -s1..-s3 | statement wraps to 8 lines: 16:9 lines 1-2 = portrait lines 1-4 (AI ENGINEERING / IS LESS ABOUT / DEVELOPING / MODELS), 16:9 lines 3-4 = lines 5-8 (AND MORE ABOUT / ADAPTING / AND EVALUATING / THEM); hidden lines keep their space; credit CHIP HUYEN, AI ENGINEERING below |
| math-not-code, -s1, -s2 | paper panel (x 56-1024, y 470-1370); PRODUCTION CODE wraps to two lines beside its badge |
| end-screen, -s1..-s4 | WATCH NEXT + the four slots in ONE centred column; the arrow keeps the 16:9 alternation (slots 1 and 3 from the left, 2 and 4 from the right, mirrored) |
| wave-wall.png | QA poster only (clip frame 28 of `../kt-renders/wave-wall.mp4`), NOT for the comp |

End-screen slot geometry (1080x1920): each slot 480 x 270 px (16:9), top-left corners slot 1 (300, 440), slot 2 (300, 754),
slot 3 (300, 1068), slot 4 (300, 1382).

WAVE WALL (vertical): `../kt-renders/wave-wall.mp4` (1080x1920, 71 frames, 30 fps, no audio) is DERIVED by ffmpeg from the
16:9 `assets/kt-renders/wave-wall.mp4` by `../../slide-sources/wave-wall/wave_wall_vertical.py`; After Effects was not opened.
It is a 1:1 crop (source column x 500-1580, band y 37-869, both cut lines black in every frame) stacked to fill the portrait
frame (9 rows, SHIP / TRAIN alternating at the 16:9 pitch). Same frames and timing as the 16:9 clip: play it FROM ITS FRAME 0
at 73.05, no startFrom, spin it in exactly as the 16:9 comp does. A scale-to-cover of the 16:9 clip was rejected: its
607 px window can never hold the whole TRAIN (~620 px wide).
