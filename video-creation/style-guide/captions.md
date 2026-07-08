# Caption Styles & Effects  → MOVED

**The canonical caption skill is now `video-creation/skills/captions/captions.md`** (method + font-named presets +
the `build_captions.py` tool). Captions are used in 4+ places (shorts, Kaspa Wise Man, Yuli y Ana,
crypto-promo, optionally longform-edited); they were consolidated into one skill on 2026-06-17 so the
method and brand-corrections live in ONE place. Read that file, not this one.

The old **"caption1"** style below is now the **`montserrat`** preset in the caption skill (shorts + Yuli).
Kept here only as the source reference for that preset's Premiere/HTML values.

---

## `montserrat` preset (was "caption1") — Premiere/HTML reference

- **Font:** Montserrat Black (900)
- **Size:** 250pt in Premiere; **72px in HTML** (Premiere pt does not translate 1:1 to HTML px at 1080×1920)
- **Case:** All lowercase · **Alignment:** Center · **Tracking:** 400
- **Fill:** White (#FFFFFF) · **Stroke:** Black (#000000), 14px, Center · **Background:** Disabled
- **Layer type:** "Mask with Text" in Premiere · **Effect:** Transform (independent scale keyframing)

### Bounce pop-in (per new chunk) — Transform > Scale
| Keyframe | Scale | Description |
|---|---|---|
| 1 | 70 | Starts undersized |
| 2 | 110 | Overshoots past final size |
| 3 | 100 | Settles at final resting size |

- Duration ~12 frames (~0.4s @30fps); snappy anticipation → overshoot → settle; ease-out on keyframe 3.
