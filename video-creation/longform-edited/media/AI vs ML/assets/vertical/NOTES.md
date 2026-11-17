# AI vs ML: vertical-only substitutions (read by the vertical comp-builder)

## slide-builder (card slides + wave wall), 2026-11-11
- **wave-wall**: play `kt-renders/wave-wall.mp4` from THIS public dir (1080x1920, 71 frames @ 30 fps, no audio), full-frame,
  from its frame 0 at the 16:9 beat (73.05), same spin-in as the 16:9 comp. Do NOT scale-to-cover the 16:9 clip (a cover
  crop can never show a whole TRAIN). `card-slides/wave-wall.png` is a QA poster only, never a comp input.
  Derivation (ffmpeg only, After Effects not opened): `assets/slide-sources/wave-wall/wave_wall_vertical.py`.
- **card slides**: `card-slides/<id>.png` keep the 16:9 names and states; cue times unchanged. Portrait geometry (incl. the
  end-screen slot positions, now one column of four 480x270 slots) is in `slide-sources/_state-cues.md`.
