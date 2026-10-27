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

## Steps

1. New folder `thumbnail/<date>-<slug>/`; the photo of Mike to use goes in `assets/` (copy it in:
   project folders are deleted after publish).
2. Copy the latest stream's `build.py` in as the template; change the photo, its `scale`/`dx`, the
   coins, the headline lines.
3. `python build.py`, then OPEN `thumbnail.jpg` and check: every word spelled right, nothing
   overlapping, no ghost of the old text at the feather, icons readable at 640x360.
4. Give Mike the path. He uploads it himself; nothing is queued.
