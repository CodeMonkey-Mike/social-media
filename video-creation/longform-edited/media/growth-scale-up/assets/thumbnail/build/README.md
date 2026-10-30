# growth-scale-up thumbnail build (2026-10-28)

Mike: title 1 ("How a Growth Engineer Scales Up using AI") with thumbnail A, "in our normal style with the yellow highlight,
as well as my usual background, but I want to change my facial expression ... like his facial expression here
https://youtu.be/2qYll837a_0" (Fun Fun Function, "The growth stages of a programmer": an exuberant open-mouth shout, eyes
wide, eyebrows high, looking up-left).

1. `nano_banana_pro`, 16:9, 2k, prompt `prompt-v1.txt`, images (in this order): `../takes/ref-background-inference-raw-b.png`
   (the inference thumbnail's text-free raw: the usual blue-gradient wall + wooden door layout, Mike's face),
   `../takes/ref-expression-funfunfunction.jpg` (the reference video's thumbnail, the expression), and
   `../takes/ref-current-look-raw-28.0.jpg` (a face frame from this video's raw recording at 28.0 s, the current look).
   Two takes: `../takes/raw-a.png`, `../takes/raw-b.png` (jobs in `../takes/gen-a.json`, `gen-b.json`).
2. `python compose.py ../takes/raw-X.png ../takes/growth-scale-up-thumb-X.png --font "Roboto[wdth,wght].ttf" --wdth 100
   --size 220 --x0 110 --ytop 380 --angles 8.8,5.0,-4.0 --gap 50 --padx 55 --pady 40 --lines "Team of 1|=|Team of 5"`
   (the growth-vs-product three-block fan, the inference regular width; the blocks end at x 1228 of 2752, the wall ends
   at about 1340 beside the face and 1170 at the shoulder).
3. `*-yt-1920.jpg` = the 1920x1080 JPEG under YouTube's 2 MB cap. The pick (take B, closer to the reference: higher
   eyebrows, rounder mouth) is staged one level up as `growth-scale-up-thumb.png` + `growth-scale-up-thumb-yt-1920.jpg`;
   swap to take A by copying `../takes/growth-scale-up-thumb-a*.{png,jpg}` over them.
