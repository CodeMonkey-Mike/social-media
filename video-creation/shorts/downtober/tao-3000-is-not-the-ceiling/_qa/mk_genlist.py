import json, os
RA = os.path.abspath('video-creation/shorts/downtober/render-assets')
REF = os.path.abspath('schedule-tweets/images/reference/bittensor-tao.png')
NOTXT = "No words, no letters, no numbers, no text anywhere in the image except the logo glyph on the coin."
LOGO = "the Bittensor logo (the stylized lowercase Greek letter tau glyph shown in the attached reference image)"
J = lambda f: os.path.join(RA, f)
items = [
 {"file": J("thumb-dt2-cover.png"), "ref": REF, "prompt":
  "Photorealistic studio photograph, vertical 9:16 portrait. ONE single oversized TAO coin (the Bittensor cryptocurrency coin) "
  f"engraved with {LOGO}, a thick polished dark-silver metal coin, pushed toward the camera with forced perspective so it looks "
  "almost unrealistically huge, tilted slightly toward the viewer, filling the lower two-thirds of the frame, a crisp electric green "
  "rim light along its edge and a faint green glow behind it. Plain dark charcoal-to-black gradient background, nothing else in the "
  "frame. The top third of the image is EMPTY plain dark background (reserved for a title). Photoreal, not cartoon, not Pixar. " + NOTXT},
 {"file": J("broll-dt2-hook-tao-fireworks.png"), "ref": REF, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, vertical 9:16 portrait. A colossal glowing TAO coin with "
  f"{LOGO} rising high above a night city skyline, huge green and white fireworks exploding all around it, tiny faceless silhouetted "
  "people on the rooftops raising their arms and cheering. Deep navy near-black night sky, dramatic rim lighting, electric green glow. "
  + NOTXT},
 {"file": J("broll-dt2-glass-ceiling.png"), "ref": REF, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, WIDE LANDSCAPE 3:2 image. A TAO coin with "
  f"{LOGO} smashing upward through a thick glass ceiling, the glass shattering into hundreds of glittering shards flying outward, "
  "a bright green energy trail beneath the coin showing it rocketing up from below. The coin and the breaking glass are centered in "
  "the middle of the frame with space around them. Deep navy near-black background, dramatic rim lighting. " + NOTXT},
 {"file": J("broll-dt2-climax-expansion.png"), "ref": REF, "prompt":
  "Pixar-style 3D animated CGI, film-quality render, vertical 9:16 portrait. A booming futuristic city at sunrise in the middle of a "
  "huge economic expansion: gleaming skyscrapers growing taller, construction cranes lifting new towers, streets full of light, "
  f"glowing green upward arrows in the sky. On the horizon a giant TAO coin with {LOGO} rises like the sun, casting golden-green "
  "light over the whole city. Warm golden light against a deep navy sky, dramatic rim lighting. No people's faces. " + NOTXT},
 {"file": J("ovl-dt2-green-arrow-src.png"), "prompt":
  "Square 1:1 image. A single bold upward-pointing arrow, bright neon green, brightly glowing and fully opaque, with a soft green glow "
  "halo around it, centered, on a PURE SOLID BLACK (#000000) background and nothing else. No checkerboard, no transparency pattern, "
  "no text, no letters, no numbers, no other objects, no shadows on the background."},
]
p = 'video-creation/shorts/downtober/tao-3000-is-not-the-ceiling/_qa/gen-list.json'
json.dump(items, open(p, 'w', encoding='utf-8'), indent=1)
print(p, len(items), items[0]["file"], items[0]["ref"])
