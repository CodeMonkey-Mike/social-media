# aliens — Lane 3 visual QA (run by hand 2026-10-09 after the Lane 3 repurpose step was re-run by hand)

Summary: 18 checked, 17 PASS, 1 FAIL.

## FAIL
- schedule-tweets/images/x/x-tweets-2b72506f-everything-looks-like-hell-except-kaspa.png
  The coin's eyes overlap the Kaspa logo, hiding the top of the stem and the upper arm. At feed size it reads as a cursor arrow, not the Kaspa K.
  Fix: regenerate (same image_id and prompt), adding "the full Kaspa logo is completely visible and unobstructed on the coin face; the eyes and mouth sit above or beside the logo and never overlap it". Or crop a 1122x1122 square from the IG companion (y about 280 to 1402) and resize it to 1254.

## Minor notes (all PASS)
- yt-posts-43d6c9a7-01-hook: double space in the box body text ("I pulled up  the meme coin").
- yt-posts-76807bd4-05-question: the "h" in "the" has a cut-off ascender; the accent line is two-tone.
- yt-posts-9cb3d6d4-04-own-assets and yt-posts-bc7a0079-05-question: the counter sits about 25 px from the left edge (slides 1 to 3 sit at about 50 px).
- Global checks clean: no blank or white captures, no duplicates, correct sizes, no chartreuse drift on V1, every counter exactly once, text exact, no em dashes, the Kaspa K faces the right way everywhere.
