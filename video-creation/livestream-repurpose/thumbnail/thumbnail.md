# thumbnail: livestream thumbnails, composed in code

**What it is:** how a livestream gets its YouTube thumbnail. Mike asks for one after each stream
(first: "Best Time To Buy", 2026-10-23). The thumbnail is COMPOSED IN PYTHON (PIL) from a source
image, never asked of an image model: Higgsfield kept putting the headline over the coin logos no
matter how the prompt was phrased, while code puts every element exactly where it is told and a
change re-runs in seconds.

## Layout

```
thumbnail/
  thumbnail.md              this file
  thumb_kit.py              shared pieces: plates, person cut-out, headline, coin badges, rows layout, export
  blue.png                  Mike's blue style reference (a third-party thumbnail, never shipped as-is)
  plates/blue.png           that reference with its person + text removed: THE background (make_plate)
  <YYYY-MM-DD>-<slug>/      one folder per stream
    source.png              the starting image, if any (logos lifted from it)
    assets/                 Mike's photo + the cutouts and logos this stream needs
    build.py                the stream's composition (imports thumb_kit)
    thumbnail.jpg           the deliverable
```

## The house look (Mike-approved on "Best Time To Buy")

- **Background** `plates/blue.png`, the mottled royal blue of Mike's reference (2026-10-23), with no
  room behind him. A new reference becomes a plate once via `make_plate(example, out)`.
- **Mike** from a SHARP real photo of him (a full-res earlier thumbnail plate is ideal), cut out with
  `cut_person` (isnet-general-use; the human-seg model dragged in a door) and set on the right with
  `place_person(scale, dx)`, measured so his hair clears the headline and the coins (a shoulder going
  off-frame is fine). Never his face from an AI render or a stream frame: they are soft, and
  upscaling them does not fix it.
- **Canvas** 1920x1080. (`clean_left` remains for a one-off that keeps a source's own background.)
- **Headline** top left, ONE idea per line ("Best Time" / "To Buy"), as big as fits (`headline`):
  Impact, smooth gold gradient (top 250,222,120 -> mid 247,205,80 -> bottom 250,180,8, sampled from
  Mike's original), thin near-black outline, soft dark glow and drop shadow. Not Arial Black (too
  wide, Mike rejected it), and the gradient is smooth per line, never a hard two-tone split.
- **Coins** BELOW the headline, never under or behind it, as equal-size round badges
  (`badge`): gradient disc, light ring, white or cut-out icon, drop shadow. Two staggered rows
  (3 + 2, `rows_layout`) when one row leaves empty space; Mike asked for larger coins over a single
  thin row.
- **Arrow** (callout from the headline to one coin, first on "30x" 2026-10-26): `arrow(p0, p1, p2)`,
  a curved white Bezier with a triangular head, dark outline + drop shadow. Put the target coin
  where the curve can reach it clear of the other coins (top row, right end).
- **Export** JPG q94 4:4:4, about 600 KB (YouTube cap 2 MB).

## Icons

- Draw simple marks in code: `icon_text('?')`, `icon_kaspa()` (the flat K: stem right, square-ended
  arms left, as Mike picked from a reference).
- Lift a logo letter off the source with `icon_glyph` (threshold, then upscale; `grow` thickens thin
  strokes).
- Cut a figure out with `cutout` (rembg). It fails when the object matches its background (the
  teal Kaspa coin on a teal backdrop vanished), so draw those instead.
- A logo Mike links from a paid stock site (IconScout etc.) is a reference for the SHAPE only:
  redraw it, never paste the file in.

## Editing an earlier thumbnail (2026-11-04, 11-07, 11-09)

When Mike says "model it after this one" and links a stream's thumbnail, keep that scene and change only what he names.
Fetch it from `https://img.youtube.com/vi/<id>/maxresdefault.jpg` (1280x720) into `<folder>/source.jpg`; there is no
kit layout, the stream's `build.py` does the edit. Reuse `2026-11-09-my-100x-plays/build.py`:

- `make_plate`: takes the white headline out (mask = white pixels + a 47 px halo, smooth low-res fill, the sky's own
  grain added); no ghost of the text at 1:1. LaMa is not installed, and this was enough on a smooth sky.
- Swapping a coin's face: `old_coin` gets the coin's silhouette by colour and fits a rotated ellipse to it; `logo_coin`
  builds the new coin to that exact ellipse (face + side swept along the short axis) and clips it to the old silhouette,
  so the dirt in front, the bowl behind and the tilt stay as they were. Shade it toward the ground so it sits in the dirt.
  A logo that comes as a profile picture is square on black: scale it so its farthest point sits inside the face.
- Headline: white Impact, one line if it is one idea (size it to clear Mike's hair, about x 1215 on this scene); a
  second line here runs into the NFT card.

### Swapping what Mike holds (2026-11-15, `peach/build.py`: cocktail glass -> Minute Maid bottle)

- The new object goes BEHIND his fingers: `hands_matte` (GrabCut on a 2x crop, seeded by hand: finger cores = hand, glass
  interior / wall / shirt = not) puts the source's own fingers back on top. Glass glints caught between two fingers are
  taken out of the matte by colour (`GLINTS` boxes).
- `make_plate` takes out the old object and the old headline words with `_fill` (pull-push, never Telea: Telea dragged the
  dark top of the wall down as a band); fingers and the gold lettering are switched off as fill sources.
- `bottle_rgba` cuts a product shot off white row by row as two smooth edge curves (stair-steps, a shop badge and a
  watermark out), makes the empty neck see-through and lights it like the scene. `TAKES` holds size / position / tilt, one
  `take-<n>.jpg` each; Mike picks.
- A rotated headline word is matched to the source first (font, size, angle, baseline: the values sit at the top of the
  file), then only the text and the fill colour change. Fit it by template match on the de-rotated letters, not by a
  brute-force render search (that ran 10 minutes for nothing).

### Re-editing a thumbnail that was itself built here (2026-11-19, `2026-11-19-token-reveal/build.py`)

- Start from the earlier build's own pieces (its `source.jpg`, `clean-plate.png`, `hands-matte.png`, imported by path),
  never from YouTube's re-compressed copy of the result.
- Recolouring a glowing object (the Kaspa flame): hue-rotate it in HSV, keeping each pixel's S and V, weighted by hue
  (flame cyan in, the wall's royal blue ~212 deg out) and by a soft ellipse around it. Bright cores stay near white.
- A drawn object in his hand (a coin): built at 4x in code (face gradient, raised rim, reeded edge, embossed glyph), put
  behind the same hands matte, with the same finger contact shadows.

### Swapping a coin for a ready-made 3D coin PNG (2026-11-21, `2026-11-21-39x-while-everyone-cries/build.py`)

- When Mike hands over a finished coin render (transparent PNG, e.g. his teal Kaspa coin), paste it as is, never rebuilt:
  fill the old coin out of the plate first (its colour mask + a halo, low-res Telea), then set the PNG a touch larger than
  the old coin so none of it shows, and cut it along the old coin's DIRT LINE (its lowest pixel per column where it was
  buried, held flat where its own round edge takes over), shaded toward the ground.
- A logo coin on a coloured logo (white glyph on violet): the face takes the logo's own ground colour as a gradient, and
  the scene's warm tint stays light (1.03 / 1.0 / .96) so the white glyph does not turn cream.
- A headline line ending just over a scene object (the bull's horn tips): switch that area off in the plate mask.

## Steps

1. New folder `thumbnail/<date>-<slug>/`; the photo of Mike to use goes in `assets/` (copy it in:
   project folders are deleted after publish).
2. Copy the latest stream's `build.py` in as the template; change the photo, its `scale`/`dx`, the
   coins, the headline lines.
3. `python build.py`, then OPEN `thumbnail.jpg` and check: every word spelled right, nothing
   overlapping, no ghost of the old text at the feather, icons readable at 640x360.
4. Give Mike the path. He uploads it himself; nothing is queued.
