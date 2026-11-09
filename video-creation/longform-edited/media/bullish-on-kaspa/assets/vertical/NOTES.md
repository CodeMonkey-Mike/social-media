# Vertical-only substitutions for BullishOnKaspaVertical (the lane's comp-builder reads this)

Same spine, same beat times, same audio as the 16:9 `BullishOnKaspa`. Everything below comes from this lean public dir (`assets/vertical/`).

## Superhero windows F1, F2, F3 (vertical-repurpose.md section 1c)
Windows 0.000-3.367, 19.433-26.633, 31.433-35.700 play `face-swap/F<n>-higgsfield-bg-swap.mp4` full-frame at 1080x1920, cover fit, with NO face crop and no FACE_REFRAME, from `window_starts_at_clip_s` in `face-swap/F<n>-higgsfield-bg-swap.json`. Spine audio stays. They are native 9:16 (496x864, 30 fps), same suit, same rooftop, same two moons. Keep the 16:9 comp's subtle push only.

## Every other face window
Spine with the measured crop from `face-crop.json`. Measure per window if the mean is off; the head must be centred and never clipped.

## Image motion clips
IMG-5-summit-flag and IMG-6-coin-waterfall play `img-motion/<ref>-motion.mp4`, exactly as the 16:9 comp plays its clips (section 3c), with the same still fallback at `img/<ref>.png`.

## The text wall (455.74 card pause, 105 frames)
`overlays/text-wall-motion.mp4` is a native 1080x1920 render from Mike's After Effects template, TOO LATE? repeated across every row. Play it at 1080x1920, no letterbox, no 1.1 scale needed. It must MOVE: never a still. EARLY still pops at dt 1.9 from `card-slides/text-wall-early-alpha.png`, the portrait reflow. The wall stays silent until EARLY.

## Confetti (64.23 to 65.54)
`overlays/confetti-burst-alpha.webm` is 16:9 with real alpha. Play it `transparent`, cover fit over the 1080x1920 frame. A centre crop is correct for confetti.

## Side panels at 448.00 to 452.40 (Mike corrected these on the 16:9, do not reverse them)
"THE TOOLS CAME FIRST" enters from screen RIGHT, t0 448.0, t1 450.1. "THE CROWD HAS NOT ARRIVED YET" enters from screen LEFT, t0 449.86, t1 452.4. Same sides as the 16:9, because they follow his hands. In portrait a panel takes about 55 to 60 percent of the width and its lines re-wrap to fit, nothing clipped, his face still visible beside it. The 114x panel (PANEL_C26, side R) uses `receipts/C26-cryptorich-showcase.png` and `effects-kt/paper-crumpled.mp4` the same way.

## Shared files
`effects-kt/` (animated texture, paper, subscribe bar) and `overlays/kaspa-logo.png` are the same files as the 16:9, reposition them for the portrait frame. Rebuild `cutframes/` from the VERTICAL clips in `vid/`, never copy the 16:9 frames. Copy only the transition plates, tiles and masks the comp references into `transitions/`.

## Checks at the smoke stills
Cinco moment with confetti, both side panels, the wall before and after EARLY, flag and waterfall moving, the subscribe close, F1 to F3 and one frame per other face window.

## From the builders (2026-11-05)
Rebuild the VID_FPS table from the vertical files with ffprobe: the 16:9 table no longer matches (BR-4 is now 30, BR-11 is now 25). The clips' opening frames are trimmed to work on screen, so the comp plays each from its first frame. BR-19 is a sanctioned centre-crop fallback. C22 is a new 29.8 s portrait TradingView recording with hovers at about 3.8, 7.5, 15.7 and 23.8 s, matching the 16:9 times. C26 carries no highlighted row: the comp adds the highlight, as the 16:9 does.
