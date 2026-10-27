# growth-vs-product thumbnail build (2026-10-23)

Mike: "same image [evals take B], just change it to AI product engineer vs AI Growth Engineer." then "growth first":
lines = AI Growth Engineer | vs | AI Product Engineer. Original ask: Make 3 separate highlight
blocks with text like this example https://youtu.be/wfMtDGfHWpA" (three left-aligned yellow blocks, each hugging its own
line, tilted up to the right).

1. `plate.py <evals-thumb-v1b.png> plate-clean.png` (env `DIL=131`): detects the old yellow blocks, takes each block's convex
   hull, widens it 65 px (the AI-generated blocks carry a dark drop shadow within 20 px and a faint glow to 60 px: a narrower
   margin anchors the fill to shadow values and the old blocks ghost through), stops 14 px short of the hair per row, then
   fills the hole with a harmonic (Laplace, multigrid Jacobi) fill anchored to the surrounding wall + the wall's own grain.
   A polynomial fit was tried first and ghosted (not tied to the boundary).
2. `compose.py plate-clean.png out.png --font "Roboto[wdth,wght].ttf" --wdth 100 --size 125 --ytop 470` (take A, regular)
   or `--wdth 75 --size 150 --ytop 455` (take B, condensed). `--lines "A|B|C"` changes the words or their order; `--angles 8.8,5,-4`
   = the per-block tilt measured on the example (top rises 8.8 deg, middle 5, bottom falls 4; each block pivots on its own
   left-middle so the left edges stay aligned), the v2 round (Mike: "make the angles of the text similar to the example"); yellow (254,241,3), black text, Roboto weight 900.
3. `*-yt-1920.jpg` = the 1920x1080 JPEG under YouTube's 2 MB thumbnail limit.
