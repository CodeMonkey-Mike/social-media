# ov4-wb-split: the WHITEBOARD BEAT, "One render, split across many GPUs" (neon-ink)

Video: `media/standard/JCT/` (longform-presentation, format 4 "standard"). The clip is composited INSIDE the deck
area of the screen share while Mike stays on camera to the right: **canvas 1464 x 1080**, fps 30, **13.0 s = 390
frames**, no audio. **Pen: `neon-ink`** (Mike, 2026-11-08: dark mode, neon ink). Mike asked for a beat of 5 to 15 s:
keep it SIMPLE, one idea, 3 to 4 drawn elements. Fact source: `../RESEARCH.md` section 2.3, the Smart Render bullet
(line ~99): Smart Render by JANCTION (Jasmy Lab + Jasmy + Panasonic Advanced Technology, announced 31 Aug 2026); a
4K / 1024-sample / 30-frame Blender animation across **12 nodes** in **~15 min** vs **~4 h 10 min on one GPU** =
**16.7x faster**, "internal benchmark" (project claim).

## What he says (LOCAL seconds = spine minus 449.3; the clip's t)
```
0.26 splits  0.34 one  0.60 render  0.88 across  1.18 many  1.46 GPUs (2.0)
2.86 Claim  3.32 16.7  5.56 times  6.08 faster (6.6)
6.82 a  7.44 4K  8.02 animation  8.70 in  9.60 15  10.12 minutes  10.42 instead of about  11.06 four  11.32 hours (11.8)
12.04 their own benchmark (12.9)     13.0 END (the caller fades the clip out)
```

## The scene (one canvas)
1. **Split** (0.2 to 2.0): a single film-strip / render frame labeled "ONE RENDER" draws on at 0.3 (left), then at
   ~0.9 to 1.5 arrows fan out from it into a GRID of 12 small GPU chips (right) as he says "across many GPUs".
2. **Faster** (2.8 to 6.6): "16.7X FASTER" writes on at 3.3, complete by ~6.1.
3. **Time** (6.8 to 11.8): two time bars (or clocks) side by side: "12 GPUs: ~15 MIN" (short bar, cyan) drawn at
   ~9.6 ("15 minutes") and "1 GPU: ~4 HOURS" (long bar, red) drawn at ~11.06 ("four hours"). A small "4K ANIMATION"
   label at 7.4.
4. **Caveat** (12.0 to 13.0): a small note "THEIR OWN BENCHMARK" (white or grey ink) at 12.04. The beat ends on the
   finished drawing, nothing clears.

Labels 1 to 4 words, caps (the pen is caps); keep any heading under ~22 characters at 50 px.

## Deliverable (per the agent definition)
- New kit objects (film frame / render, GPU chip, time bar or clock) in the whiteboard kit
  (`video-creation/remotion/src/whiteboard/`, reuse anything that exists, e.g. `crypto.tsx`), fixed seeds, role
  colors, draw-on via Sketch.
- Scene comp `video-creation/remotion/src/whiteboard/beats/JctSmartRender.tsx` exporting `JctSmartRender`, `FPS` =
  30, `DUR` = 390; registered in `Root.tsx` as id **`JctSmartRender`**, width 1464, height 1080, fps 30.
- QA stills at frames ~15, 50, 120, 200, 300, 389 into `media/standard/JCT/overlays/_wb/`, opened and checked by you.
- The CUES table with the word each cue hangs on, in your return message. Do NOT render the final clip (I render it
  through chunked-render).
