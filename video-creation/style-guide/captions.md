# Caption Styles & Effects
_Shared across all video formats: shorts, longform, livestream repurpose_

## caption1 — Base Text Style

The default caption style used across Mike's videos.

- **Font:** Montserrat Black (900)
- **Size:** 250pt in Premiere; **72px in HTML** (Premiere pt does not translate 1:1 to HTML px at the 1080×1920 frame scale)
- **Case:** All lowercase
- **Alignment:** Center
- **Tracking:** 400
- **Fill:** White (#FFFFFF)
- **Stroke:** Black (#000000), 14px, Center
- **Background:** Disabled
- **Layer type:** "Mask with Text" in Premiere
- **Effect:** Transform (separate from built-in Motion — allows independent scale keyframing)
- **Uniform Scale:** On

### caption1 — Bounce Pop-In Animation

Applied on each new word/phrase appearing on screen. Three keyframes on Transform > Scale:

| Keyframe | Scale | Description |
|---|---|---|
| 1 | 70 | Starts undersized |
| 2 | 110 | Overshoots past final size |
| 3 | 100 | Settles at final resting size |

- Duration: ~12 frames (~0.4s at 30fps)
- Feel: snappy anticipation → overshoot → settle
- Easing: unconfirmed — likely ease-out on keyframe 3
