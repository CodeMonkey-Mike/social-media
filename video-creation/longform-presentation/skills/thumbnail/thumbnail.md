# thumbnail: series thumbnails by EDITING the previous episode's

**What it is:** how a longform-presentation upload gets its YouTube thumbnail when it belongs to a series with an
established look (first used: print-function, 2026-10-16, AI Engineering Simplified's "Learning Python" series).
Mike's face, the background, the font and the layout already exist in the previous episode's thumbnail, so the new
one is an EDIT of that image, never a fresh generation: the face stays a likeness and the series stays consistent.
(A no-series thumbnail follows the longform-edited taste instead: photoreal, one subject, see the
`thumbnail-photoreal-single-focus` memory / longform-edited PROJECT-LOGs.)

## Steps

1. **Reference = the previous episode's PUBLISHED thumbnail**, pulled from YouTube (project folders are deleted
   after upload, so the live thumbnail is the only durable copy):
   `curl.exe -fsSL -o media/vscode-coding/<p>/thumbnail/reference-<videoId>.jpg https://i.ytimg.com/vi/<videoId>/maxresdefault.jpg`
   (1280x720). The "Learning Python" chain so far: `lgZNH_F3Iuo` ("Running Python for the first time", play-icon
   tile) -> print-function (printer-icon tile, "10 Uses of the Python print Function").
2. **Three takes in parallel** with Higgsfield `nano_banana_2` (`video-creation/skills/higgsfield-generate/`),
   `--image <reference> --aspect_ratio 16:9 --resolution 2k --wait --json > takes/take-<x>.json`; the full-res PNG is
   the `result_url` in that JSON (`min_result_url` is a webp preview). About 2752x1536 each, ~1 min.
3. **Prompt shape** (the print-function prompt, verbatim, as the template): *"Edit this YouTube thumbnail. Keep
   EVERYTHING else exactly the same: the same man on the right (identical face, curly hair, glasses, green eyes,
   navy shirt, pose), the same royal-blue gradient background, the same heavy rounded bold sans-serif font, the same
   colors (white, golden yellow, sky blue), the same left-side layout and the Python logo -> yellow AI tile glyph row
   at the bottom left. CHANGE 1: replace the black play-triangle icon inside the white rounded-square tile at top
   left with a clean, bold, black flat PRINTER icon (a printer with a sheet of paper coming out), same tile size and
   position. CHANGE 2: replace the headline text with exactly three lines: line 1 '10 Uses of the' in white; line 2
   'Python' in golden yellow followed by 'print' in sky blue; line 3 'Function' in golden yellow. Spell every word
   exactly. No other text."* Name what stays, then numbered CHANGES. Mike's eyes are green: say so.
   Vary the line breaks across takes; the model re-wraps on its own, and Mike's pick (take B) came out as
   "10 Uses of / the Python / print Function" (lines of near-equal length fill the left half best).
4. **Headline wording:** when Mike offers two phrasings, use the one with fewer characters ("10 uses of the Python
   print function", 36, beat "... print function in Python", 39).
5. **QA every take** (open it): every word spelled right, icon reads at 640x360, face unchanged.
6. **Export** each take: `python skills/thumbnail/export_thumb.py <take.png>...` -> centre-crop to exact 16:9,
   1920x1080, JPG q94 4:4:4 (~430 KB; YouTube's cap is 2 MB, the PNG is over it).
7. Mike picks; the winner is copied to `media/vscode-coding/<p>/thumbnail/<p>-thumb.jpg`, the only thumb at that level; takes
   stay in `thumbnail/takes/`. He uploads it himself with the video.

Cost note: 3 takes of nano_banana_2 at 2k, credits per the Higgsfield balance; a 502 still bills, recover the job
from `higgsfield generate list --json` instead of regenerating.
