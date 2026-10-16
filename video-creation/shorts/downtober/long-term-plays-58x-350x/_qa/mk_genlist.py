import json, os
RA = os.path.abspath('video-creation/shorts/downtober/render-assets')
REF_LAB = os.path.abspath('schedule-tweets/images/reference/LAB.png')
REF_VEL = os.path.abspath('schedule-tweets/images/reference/velvet.png')
NOTXT = "No words, no letters, no numbers, no text anywhere in the image except the logo glyph on the coin."
LAB = ("the LAB logo (a round-bottom laboratory flask outline with small bubbles rising from its neck, filled with swirling "
       "lime-green liquid, exactly the flask glyph shown in the attached reference image, WITHOUT the word LAB)")
VEL = ("the Velvet logo (the stylized V monogram made of two overlapping lavender-violet chevron strokes, exactly the glyph "
       "shown in the attached reference image, WITHOUT the word Velvet)")
J = lambda f: os.path.join(RA, f)
items = [
 {"file": J("thumb-dt3-cover.png"), "ref": REF_LAB, "prompt":
  "Photorealistic studio photograph, vertical 9:16 portrait. ONE single oversized LAB coin (the LAB cryptocurrency coin) "
  f"engraved with {LAB} in glowing lime-green enamel, a thick polished dark gunmetal coin, pushed toward the camera with forced "
  "perspective so it looks almost unrealistically huge, tilted slightly toward the viewer, filling the lower two-thirds of the frame, "
  "a crisp lime-green rim light along its edge and a faint lime-green glow behind it. Plain dark charcoal-to-black gradient "
  "background, nothing else in the frame. The top third of the image is EMPTY plain dark background (reserved for a title). "
  "Photoreal, not cartoon, not Pixar. " + NOTXT},
 {"file": J("broll-dt3-hook-velvet-launch.png"), "ref": REF_VEL, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, vertical 9:16 portrait. A glowing violet Velvet coin bearing "
  f"{VEL} blasting straight upward like a rocket through a deep purple night sky, a long bright trail of violet and lavender "
  "light and sparks streaming beneath it, a tiny glittering city far below. Deep purple near-black sky, dramatic rim lighting, "
  "strong upward motion. No people's faces. " + NOTXT},
 {"file": J("broll-dt3-called-lab-october.png"), "ref": REF_LAB, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, WIDE LANDSCAPE 3:2 image. A glowing LAB coin bearing "
  f"{LAB} standing upright on a small pile of orange and red autumn leaves on a dark wooden table, a single dramatic spotlight "
  "from above, a few autumn leaves drifting down through the light, soft lime-green glow from the coin. The coin is centered "
  "in the middle of the frame with space around it. Deep near-black background, dramatic rim lighting. " + NOTXT},
 {"file": J("broll-dt3-climax-lab-eruption.png"), "ref": REF_LAB, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, vertical 9:16 portrait. A colossal LAB coin bearing "
  f"{LAB} launching straight up out of a giant bubbling glass laboratory flask, a massive geyser of glowing lime-green liquid "
  "and sparks erupting beneath it, bright shockwave rings bursting in the air around it, a starry night sky above. "
  "Epic scale, lime-green and white light against deep navy black, dramatic rim lighting. No people's faces. " + NOTXT},
 {"file": J("ovl-dt3-hourglass-src.png"), "prompt":
  "Square 1:1 image. A single ornate hourglass with glowing golden sand pouring through it, brightly glowing and fully opaque, "
  "warm golden light halo around it, centered, on a PURE SOLID BLACK (#000000) background and nothing else. No checkerboard, no "
  "transparency pattern, no text, no letters, no numbers, no other objects, no shadows on the background."},
 {"file": J("ovl-dt3-red-arrow-src.png"), "prompt":
  "Square 1:1 image. A single bold downward-pointing arrow, bright neon red, brightly glowing and fully opaque, with a soft red "
  "glow halo around it, centered, on a PURE SOLID BLACK (#000000) background and nothing else. No checkerboard, no transparency "
  "pattern, no text, no letters, no numbers, no other objects, no shadows on the background."},
]
p = 'video-creation/shorts/downtober/long-term-plays-58x-350x/_qa/gen-list.json'
json.dump(items, open(p, 'w', encoding='utf-8'), indent=1)
print(p, len(items))
