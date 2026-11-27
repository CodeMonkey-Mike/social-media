# Visual QA: batch `evaa-pieverse`, Lane 3 images

QA date: 2026-11-23 · 13 assets checked · checked against `repurpose/output/evaa-pieverse-lane3-plan.json` (`images[]` prompts), the `repurpose/SKILL.md` image-generation, YT carousel and Version 4 sections, the exemplars `images/reference/carousels/version4/hook.png` + `slide.png`, and the logo references `kaspa-logo.png`, `pieverse.jpg` and `bittensor-tao.png`.

**Method:** I opened every file at full size. I zoomed 1.3x to 4x into every coin face, logo, glyph, prop, shoe and badge. I swept all four corners of the 8 scene images at 2.2x brightness for signatures and watermarks. I gave the 4 white V4 data slides a contrast-stretched sweep (225 to 255 luma) to expose any faint `@handle` watermark copied from the exemplar. I measured how far the text runs on the hook and on every slide title, plus the green hue of the hook. I also checked dimensions: X and YT files are 1254x1254 (1:1) and IG files are 1122x1402 (4:5). All 13 MD5 hashes are unique, and every file shows its own slug’s subject, so no bindings were swapped.

**Scope note:** this batch has **no Version 1 carousel**. YT post 1 uses V4 only (hook plus 4 data slides, one version, nothing mixed), so the V1 chartreuse-drift check does not apply. The hook’s green measures hue 135.6 (RGB 21,237,77), a neon green, nowhere near the chartreuse band (hue 44 to 97). The V4 exemplar’s green is hue 150.9. **Counters:** each data slide carries its page number (2, 3, 4, 5) exactly once, in the top-right circle, with no stray digits. The hook carries no counter and no page dots: the bottom 44 pixel rows are pure black.

Zoom crops used for this report: `video-creation/cache/visual-qa/evaa-pieverse/` (gitignored, throwaway). No asset was modified.

## Result

| # | Asset | Verdict |
|---|---|---|
| 1 | x/x-tweets-7b96929a-bitcoin-two-bear-markets-one-year.png | PASS (advisory) |
| 2 | x/x-tweets-f8996e29-endless-supply-walk-away.png | PASS |
| 3 | x/x-tweets-08e0c9bb-pieverse-new-high-more-doors-open.png | PASS |
| 4 | x/x-tweets-9b54b2e4-tao-touched-167-and-bounced.png | PASS |
| 5 | x/x-tweets-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png | PASS (advisory) |
| 6 | ig/ig-single-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png | PASS |
| 7 | x/x-tweets-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png | PASS |
| 8 | ig/ig-single-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png | **FAIL** |
| 9 | yt/yt-posts-158a3000-01-hook.png (V4 hook) | **FAIL** |
| 10 | yt/yt-posts-c3d98218-02-usdt-bridge.png (V4) | PASS (advisory) |
| 11 | yt/yt-posts-a8695913-03-usdc-bridge.png (V4) | PASS (advisory) |
| 12 | yt/yt-posts-aeacac5a-04-still-missing.png (V4) | PASS (advisory) |
| 13 | yt/yt-posts-077068e0-05-question.png (V4) | PASS (advisory) |

**13 checked · 11 passed · 2 failed.** "Advisory" means the image is clean enough to ship but differs slightly from its prompt in a way Mike may want to know about. Neither failure needs a regen: both can be patched in place.

## Per-asset findings

### 1. x-tweets-7b96929a-bitcoin-two-bear-markets-one-year.png: PASS (advisory)
- Matches: Pixar 3D, a snowy mountain pass at night in a heavy blizzard. An orange Bitcoin coin character stands with fists clenched and a defiant glare. Behind it, a brown bear sleeps slumped at the mouth of a dark cave, and the coin’s footprints lead out of the cave through the snow. A much bigger bear roars on the right and blocks the path. The coin has a warm orange rim light, and the snow and bears have a cold blue light. I zoomed the logo 2x: it is the white B with two strokes at the top and two at the bottom, which is correct. There is no other text, and all 4 corners are clean.
- Advisory: (a) The B is upright, not tilted like the official mark (the prompt said "tilted B"). It still reads as Bitcoin instantly. (b) The second bear is not rearing on its hind legs: a front paw is planted in the snow at the bottom right, and its shadow does not fall across the coin. The "out of one bear and straight into the next" idea still reads.
- Fix: none needed.

### 2. x-tweets-f8996e29-endless-supply-walk-away.png: PASS
- Matches: a giant industrial minting press at night pours a river of silver coins down a chute into a valley heaped with coin hills. It has one big lever with a red knob, standing up in the on position. The green-eyed man in a black hoodie (dark hair, beard, Mike’s established avatar) walks toward the viewer with his hands in his pockets and a skeptical half smile, glancing back. I zoomed the coins 1.3x: all plain, with no glyphs. I zoomed the machine: no signs, labels, numbers or logos (the small yellow control box has blank buttons only). The sneakers are unbranded. As planned, no ICP logo appears. The corners are clean.

### 3. x-tweets-08e0c9bb-pieverse-new-high-more-doors-open.png: PASS
- Matches: the plush white cat is faithful to `pieverse.jpg`: a round fluffy body, small black button eyes, grey bar whiskers, and a glowing blue band at the temple, as in the reference. It stands on a snowy summit above a sea of clouds at night, one paw raised, the other planting a pole with a plain blue pennant (no markings). Five doorways set into the rock along the winding path swing open and spill warm gold light. I zoomed the doors: all blank, with no signs, letters or numbers. Nothing from the reference’s desk, city or "2,450.00 USDT" panels leaked in. The prompt banned a signature, and none appears in any corner.

### 4. x-tweets-9b54b2e4-tao-touched-167-and-bounced.png: PASS
- Matches: a deep ravine under a crescent moon and a starry sky. A white TAO coin character launches up off a spring board with a violet glow, arms high, with a hungry, determined grin and a white light streak trailing beneath it. I zoomed the emblem 1.6x against `bittensor-tao.png`: it is the correct tau, with the top bar hooked down at its left end and the stem curving right at its foot, dark on white. The coin has no other marks. On the rim, the green-eyed man in a black hoodie crouches holding open a plain burlap sack (no markings) with a calm, focused look. The sneakers are unbranded. There is no text, and the corners are clean.

### 5. x-tweets-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png: PASS (advisory)
- Matches: a canyon floor at night with three wide stone steps. A large dark Kaspa coin glowing greenish cyan sits sunk into the floor where the steps end and lights up the canyon walls. I zoomed the glyph against `kaspa-logo.png`: it is the correct mirrored K, with the bar on the right and the chevron’s point touching it. The green-eyed man in a black hoodie kneels on the top step and sets down one leather sack of gold coins. There is no text, and the corners are clean.
- Advisory: (a) A few gold coins carry faint, unreadable embossed squiggles (in the middle sack and on the top coin of the lowest sack). They show only at 2x to 4x zoom with contrast raised. At feed size the coins read as plain, and none of the marks looks like a project glyph. (b) The two waiting sacks already sit one per lower step instead of "beside him". That arguably tells the $400 / $300 / $300 story better. (c) The coin stands upright and partly sunk rather than "half buried".
- Fix: none needed.

### 6. ig-single-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png: PASS
- 1122x1402 (4:5). The same scene, recomposed for portrait: three steps, three sacks (the top one in his hands), and the glowing Kaspa coin at the end of the canyon. The glyph is the correct mirrored K. I zoomed the coins: plain. The corners are clean; the bottom-left sack’s drawstring knots are rope, not text.
- Note: the avatar here has stubble rather than the full beard of the X version. These are companion posts on different platforms, so this is not a defect.

### 7. x-tweets-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png: PASS
- Matches: an island shore at night with dark water, a bright city on the horizon and no crowds. The Kaspa coin character wears a yellow hard hat, with hands on hips and a calm, satisfied grin. I zoomed the glyph: the correct mirrored K, greenish cyan. On the left is a stone arch bridge with a gatehouse and **exactly 5 guard figures** (counted). On the right is a glowing bridge of light with no guards and no gate. Carts of gold coins roll toward the island on both bridges. I zoomed the coins 3x: plain, with light scratches only. The gatehouse, bridges and carts have no signs. The work boots are unbranded. The corners are clean.

### 8. ig-single-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png: **FAIL**
- The scene matches (4:5, 1122x1402): the stone bridge with its gatehouse and 5 guards (counted), the unguarded bridge of light, carts of gold coins on both, the city skyline, and the hard-hatted Kaspa coin with hands on hips and a grin. The glyph is the correct mirrored K. The corners are clean.
- **Defect: a real brand trademark on the character.** The coin wears high-top sneakers, and the right shoe has a clear **Nike swoosh** on its side panel (zoomed 2x, at about x 360 to 430, y 1070 to 1108). Both tongue tabs also carry a small star emblem (about x 195 to 240, y 1030 to 1060, and x 427 to 450, y 1012 to 1037). A third-party trademark on a Kaspa post is a brand-safety problem, and it is exactly the kind of invented mark the house no-logo rule exists to keep out. The X version of this image has plain brown work boots.
- Minor: a few coins in the nearest cart on the light bridge carry faint, unreadable embossed squiggles (visible at 2x).
- Fix: **paint the swoosh out in place.** It sits on a flat dark-green leather panel, not on a face, so a texture fill sampled from the same panel is allowed and is enough. Paint out both star tabs with the tongue colour at the same time. If the patch shows, regen in a fresh `ig-single` chat with the same prompt plus: "the coin wears plain brown leather work boots with no logos, no swoosh, no brand marks and no emblems; every coin face completely plain".

### 9. yt-posts-158a3000-01-hook.png (V4 hook): **FAIL**
- Matches: the Kaspa coin from `kaspa-logo.png` fills the background, with a faithful mirrored-K glyph, centered in the upper two thirds, in a cyan burst on black. A circular bubble at the top right holds a green line that slopes down and then runs flat, with no numbers or axis labels (zoomed). The text is exact: "USDT AND USDC NOW BRIDGE TO KASPA" in white, "AND NOBODY IS WATCHING" in bright green, and "SWIPE FOR MORE" in small white at the bottom. There are no page dots and no em dashes. The green is hue 135.6, not chartreuse.
- **Defect: the exemplar’s shield badge was reproduced.** A white and green shield badge sits in the middle of the divider line above the headline (zoomed 4x: about x 606 to 645, y 831 to 875; the line breaks around it from x 593 to 656). It is the source account’s brand badge from `version4/hook.png`, and the prompt banned it by name ("no shield badge ... must NOT be reproduced"). It puts another account’s mark on Mike’s first slide, and that slide is also the one reused for the IG carousel.
- Secondary (not blocking): the prompt asked for at least an 8% side margin (100 px). Line 1 runs from x 67 to 1190 (margins of 5.3% left and 5.0% right). Line 2 runs from x 83 to 1171 (6.6% each side). Nothing is clipped.
- Fix: **patch in place; do not regen** (the same approach SKILL.md uses for the V4 page dots). Copy the strip just left of the badge (the same rows, x about 528 to 592, which holds the plain divider line over faint cyan speckle) over the box x 592 to 658, y 826 to 880, so the line runs unbroken. Then check by eye that the line is continuous and no edge of the badge is left. Leave the margins as they are.

### 10. yt-posts-c3d98218-02-usdt-bridge.png (V4 data): PASS (advisory)
- Matches the V4 slide exemplar: white background, a bold dark title, the ornament divider, three outlined rounded stat boxes (red, green, orange), a large centre panel, and a green insight box with a label panel. **The plan asked for a figure-drift check here, and nothing drifted.** The text is exact: "Bridge one: USDT", "LIVE SINCE: NOV 15", "SIGNERS: 5", "NEEDED TO APPROVE: 3", "HOW IT WORKS", and both bullets word for word. The diagram is right: a vault outline, an arrow pointing right, a token outline, and 5 circles with 3 filled green and 2 hollow, with no numbers or labels. Page number 2 appears once. The contrast-stretched sweep shows no `@cryptodaily` watermark and no stray text. There are no logos, faces or em dashes.
- Advisory (all 4 data slides): each title sits only 7 to 12 px below the top edge, much higher than in the exemplar. Nothing is clipped (no ink in rows 0 to 5), so it looks tight rather than cut off.
- Fix: none needed.

### 11. yt-posts-a8695913-03-usdc-bridge.png (V4 data): PASS (advisory)
- No figures drifted. The text is exact: "Bridge two: USDC", "ON MAINNET SINCE: NOV 16", "SIGNERS: NONE", "ADMIN KEY: NONE", "HOW IT WORKS", and both bullets word for word (the hyphen in "zero-knowledge" is correct). The diagram is right: two plain rounded blocks, a two-way arrow, and a small green check-mark shield in the middle, with no labels. Page number 3 appears once. The watermark sweep is clean. The only advisory is the tight top margin noted on slide 2.

### 12. yt-posts-aeacac5a-04-still-missing.png (V4 data): PASS (advisory)
- The text is exact: "What is still missing", "BRIDGE ONE, OUTSIDE AUDIT: NOT YET", "BRIDGE TWO, OUTSIDE AUDIT: NOT YET", "BRIDGE TWO: STILL IN TESTING", "WHY I LIKE THE TIMING", and both bullets word for word. The clipboard outline holds three empty checkboxes and no words. The calendar icon in the label panel has dots only, no digits. Page number 4 appears once. The sweep is clean.
- Advisory: the boxes keep the exemplar’s fixed red, green and orange colours, so the middle "NOT YET" shows in the "good" green. This is minor, because the words are unambiguous. The tight top margin from slide 2 applies too.

### 13. yt-posts-077068e0-05-question.png (V4 data): PASS (advisory)
- The text is exact: "Which bridge would you trust?", "A: THE FIVE SIGNERS", "B: THE ZERO-KNOWLEDGE PROOFS" (the line breaks at the real hyphen, "ZERO-" / "KNOWLEDGE"), and "C: NEITHER UNTIL AUDITED". The three panels are headed A, B and C and are otherwise empty. The label reads "TELL ME IN THE COMMENTS", with the bullet "Pick one and tell me why." Page number 5 appears once. The sweep is clean.
- Advisory: (a) The long title is squeezed horizontally and runs to within 20 px of the page-number circle (the gap is 130 to 191 px on slides 2 to 4). It also starts only 7 px below the top edge. It is legible but cramped. (b) The box colours are A red, B green and C orange. On a poll slide, that can read as steering the viewer toward B. This is the exemplar’s palette, not a generation error.
- Fix: none needed. If Mike wants a neutral, roomier question slide, regen it with "all three option boxes in the same neutral outline colour; the title on one line at a smaller size, with clear space before the page number". This slide has no figures, so a regen carries no risk of figure drift.

## JSON

~~~json
{
  "assets": [
    {"path": "schedule-tweets/images/x/x-tweets-7b96929a-bitcoin-two-bear-markets-one-year.png", "verdict": "PASS",
     "defects": [], "advisory": ["B rendered upright, not tilted", "second bear on all fours, not rearing; its shadow does not fall across the coin"],
     "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-f8996e29-endless-supply-walk-away.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-08e0c9bb-pieverse-new-high-more-doors-open.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-9b54b2e4-tao-touched-167-and-bounced.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png", "verdict": "PASS",
     "defects": [], "advisory": ["faint unreadable embossed squiggles on a few gold coins, visible only at 2x-4x zoom", "waiting sacks sit on the lower steps, not beside him"],
     "fix": "none"},
    {"path": "schedule-tweets/images/ig/ig-single-0ea3ef38-kaspa-dry-powder-for-the-bottoms.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/x/x-tweets-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png", "verdict": "PASS", "defects": [], "fix": "none"},
    {"path": "schedule-tweets/images/ig/ig-single-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png", "verdict": "FAIL",
     "defects": ["Nike swoosh trademark on the coin’s right sneaker (about x 360-430, y 1070-1108)", "star emblem on both sneaker tongue tabs", "minor: faint embossed squiggles on a few near-cart coins"],
     "fix": "paint the swoosh and both star tabs out in place (flat leather panel, not a face); if the patch shows, fresh-chat ig-single regen adding: plain brown leather work boots, no logos, no swoosh, no brand marks; every coin face completely plain"},
    {"path": "schedule-tweets/images/yt/yt-posts-158a3000-01-hook.png", "verdict": "FAIL",
     "defects": ["exemplar shield badge reproduced on the divider line above the headline (about x 606-645, y 831-875); the prompt banned it by name", "secondary: headline side margins 5.0-6.6% against the requested 8% (not clipped)"],
     "fix": "patch in place, no regen: clone the divider strip just left of the badge (x about 528-592, same rows) over x 592-658, y 826-880 so the line runs unbroken; leave the margins"},
    {"path": "schedule-tweets/images/yt/yt-posts-c3d98218-02-usdt-bridge.png", "verdict": "PASS",
     "defects": [], "advisory": ["title 12 px from the top edge (not clipped)"], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-a8695913-03-usdc-bridge.png", "verdict": "PASS",
     "defects": [], "advisory": ["title 10 px from the top edge (not clipped)"], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-aeacac5a-04-still-missing.png", "verdict": "PASS",
     "defects": [], "advisory": ["title 9 px from the top edge (not clipped)", "NOT YET shown in the green box (exemplar palette)"], "fix": "none"},
    {"path": "schedule-tweets/images/yt/yt-posts-077068e0-05-question.png", "verdict": "PASS",
     "defects": [], "advisory": ["condensed title 20 px from the page-number circle and 7 px from the top edge", "A red / B green / C orange can read as steering the poll toward B"],
     "fix": "none (optional regen: neutral box colours, smaller one-line title)"}
  ],
  "summary": {"checked": 13, "passed": 11, "failed": 2},
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-158a3000-01-hook.png",
    "schedule-tweets/images/ig/ig-single-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png"
  ]
}
~~~

## Must fix (most severe first)
1. **`yt/yt-posts-158a3000-01-hook.png`**: the source account’s shield badge sits on Mike’s first carousel slide, which is also the IG carousel cover. Patch it in place by cloning the divider strip over it.
2. **`ig/ig-single-e5f9d9b1-kaspa-two-bridges-at-the-bottom.png`**: a Nike swoosh and star tabs on the coin’s sneakers. Paint them out in place; if the patch shows, do a fresh-chat regen with unbranded boots.

Both fixes are small, local patches. The other 11 assets can ship as they are.
