# inference thumbnail build (2026-10-27)

Mike: his face with the Fun Fun Function expression (youtu.be/ategZqxHkz4), the background of the growth-vs-product thumbnail (youtu.be/C_rV1aWHJfo), two highlighted blocks "What is" / "Inference".

1. `nano_banana_pro`, 16:9, 2k, prompt `prompt-v1.txt`, images: the growth-vs-product thumb (layout + background), the Fun Fun Function thumb (expression + hand pose), spine frame at 2.0 s (current look). Two takes, raw-a / raw-b in `../takes/`.
2. `compose.py ../takes/raw-X.png ../takes/inference-thumb-X.png --font "Roboto[wdth,wght].ttf" --wdth 100 --size 240 --x0 110 --ytop 470 --angles 8.8,5.0 --gap 50 --padx 55 --pady 40 --lines "What is|Inference?"` (v2, Mike 2026-10-27: add the question mark).
3. `*-yt-1920.jpg` = 1920x1080 JPEG under the 2 MB YouTube cap. The winner moves up to `thumbnail/` as the only `*thumb*.png`.
