# Visual QA: batch nvidia, Lane 3 images

QA date: 2026-11-24. Checked against: repurpose/output/nvidia-lane3-plan.json (images[] prompts + refs) and the
image rules in repurpose/SKILL.md (no text or stray marks, reference fidelity for logos, plain coin faces, the
"no signature / watermark in any corner" sweep, 1:1 for X and 4:5 for IG, Pixar 3D house style, deep navy night palette).
Report only. No file was changed.

**Carousel checks (version exemplar, no chartreuse drift on V1, counter shown exactly once): N/A.** The brief asked for
0 YT posts and 0 carousel slides, so this batch has no carousel images.

Method: I opened every image at full size, zoomed into each logo and face, cropped every prop the prompt said must be
blank (papers, gauge, hulls, crates, coin faces, sneakers), checked each logo against its reference file
(bittensor-tao.png, doggie-mode.jpg, kaspa-logo.png), and swept all four corners at 2.5x brightness.
Sizes: X = 1254x1254 (1:1) on all five; IG = 1122x1402 (0.800, 4:5) on both. Every corner is clean: no signature,
watermark or initials on any of the 8 images.

| # | Asset | Verdict | Defect in one line |
|---|---|---|---|
| 1 | x-tweets-5e271f0d-nvidia-rockets-bitcoin-lands-back.png | PASS | none |
| 2 | x-tweets-7168ff9f-ai-opens-the-167-year-vault.png | FAIL (low) | fake handwriting on the papers, which were specced fully blank |
| 3 | x-tweets-5fff3a9b-tao-lights-on-when-the-cash-runs-short.png | PASS | none |
| 4 | x-tweets-149e59f1-doggie-mode-still-in-the-game.png | PASS | none |
| 5 | x-tweets-a5403598-kaspa-poll-says-both.png | PASS | none |
| 6 | ig-single-a5403598-kaspa-poll-says-both.png | FAIL (medium) | Nike-style swoosh on both sneakers |
| 7 | x-tweets-6132edeb-kaspa-god-candle-yacht.png | PASS | none (advisory: faint mark on the shoe tongues) |
| 8 | ig-single-6132edeb-kaspa-god-candle-yacht.png | FAIL (medium) | fake lettering on both shoe tongues + a swoosh |

~~~json
{
  "assets": [
    {
      "path": "schedule-tweets/images/x/x-tweets-5e271f0d-nvidia-rockets-bitcoin-lands-back.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Nvidia chip mascot rockets up on a green flame column; the eye-swirl mark on its chest reads as the real Nvidia logo (green swirl crossing onto the green square, the dark chip standing in for the white). The Bitcoin coin is correct (tilted white B, strokes top and bottom), arms crossed, angry glare, falling back onto the trampoline with downward motion streaks. Night launch pad, starry navy sky, green and orange rim lights as specced. Advisory only: the chip left-edge strip carries tiny engraved hardware marks, under 15 px and not readable at any feed size. The launch tower yellow panels are blank. No stray text.",
      "fix": "none"
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-7168ff9f-ai-opens-the-167-year-vault.png",
      "verdict": "FAIL",
      "severity": "low",
      "defects": [
        "The papers carry pseudo-handwriting. The stack the middle professor holds and at least three falling sheets show faint grey scribbled lines of fake writing, but the prompt says the papers must be completely blank: no equations, no numbers, no symbols, no letters, no markings of any kind. This is the hallucinated pseudo-text defect SKILL.md warns about. It cannot be read, but it is visible at 1:1 on a desktop feed.",
        "Everything else is on spec: three tweed professors in round glasses with dropped jaws, a white robot with a blue chest core raising a glowing gold key, a rusted chained vault door with cobwebs, and gold light pouring out. The key, door and robot are unmarked. Corners are clean."
      ],
      "fix": "The paper faces are flat texture, which SKILL.md says can be touched up (only faces cannot): paint out or inpaint the scribble lines on the held stack and the 3-4 loose sheets to plain off-white, keeping the warm shading. Or regenerate with: the papers are completely BLANK white sheets, no lines, no scribbles, no handwriting. Keep the same image_id and filename."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-5fff3a9b-tao-lights-on-when-the-cash-runs-short.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "The TAO emblem matches the reference bittensor-tao.png: a flat-top bar with a slight slant on the right, and a stem that curls right at the foot, in black on a white coin. No other symbol is on the coin. The data-center tower has no sign or logo. The fuel gauge is a plain dial with tick marks only and a red needle on empty, with no numbers or letters. A violet network of lit nodes spreads across the hills, the coin holds a lantern on a rocky hilltop, and the coin has a cool white rim light. Corners are clean.",
      "fix": "none"
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-149e59f1-doggie-mode-still-in-the-game.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "The dog matches doggie-mode.jpg (glossy white balloon body, two tall rounded ears, big round nose, small eye, stubby tail). None of the DOGGIE or TSLA ticker lettering from the reference came through. The crate, megaphone, lamp and houses have no lettering, and the blizzard, dark windows, amber lamp and blue snow light all match the brief. Corners are clean, with no signature carried over from the reference. Small style notes, not defects: the dog holds the megaphone with a cartoon hand that has fingers (the reference has rounded paws), and its open grinning mouth sits beside the megaphone rather than in it. Both read fine.",
      "fix": "none"
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-a5403598-kaspa-poll-says-both.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "The Kaspa mark matches kaspa-logo.png: stem on the right, arms reaching upper-left and lower-left, glowing greenish cyan on a dark coin. The left doorway pours gold light and the right pours white, both with coin streams, and the character stands in the middle with arms wide and a calm grin. Every gold coin I zoomed into, including the corners, has a plain face. The sneakers are plain with no brand mark. No stray text.",
      "fix": "none"
    },
    {
      "path": "schedule-tweets/images/ig/ig-single-a5403598-kaspa-poll-says-both.png",
      "verdict": "FAIL",
      "severity": "medium",
      "defects": [
        "There is a third-party brand logo on the character: both sneakers show a clear Nike-style SWOOSH on the side panel, most visible on the right shoe. That is another company trademark in a public IG post, and it breaks the no-logos-or-marks intent. The X companion of the same post (1:1) has plain sneakers, so the two images also do not match.",
        "Everything else is correct: the Kaspa mark is oriented right (stem on the right, arms to the left), the gold and white doorways and plain gold coins match the spec, and the 4:5 frame is 1122x1402. The tongue tabs are blank dark rectangles."
      ],
      "fix": "Regenerate the 4:5 with the same prompt plus: plain unbranded sneakers, no swoosh, no stripes, no logo, no tongue label. Keep the same image_id and filename (move the old file aside first, since gen_images skips files that already exist). Or, because a shoe side panel is flat texture and not a face, inpaint the two swoosh panels to plain teal leather."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-6132edeb-kaspa-god-candle-yacht.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "The Kaspa mark is oriented right, glowing greenish cyan. The character stands on the bow of a white yacht with both fists up and a big grin. The god-candle pillar rises from the horizon through the clouds as a plain bar (a thin wick on top, with no axes, grid, numbers or labels), with a cyan reflection path across the water. The hull has no name, flag or lettering. Corners are clean. Advisory only: both shoe tongues have a faint pale embossed mark shaped a bit like a swoosh. It is a sub-legible smudge at full resolution and invisible at feed size, so it does not fail this image. If the IG twin is regenerated with the plain-unbranded-sneakers line, this one can be regenerated with it too so the pair matches.",
      "fix": "none (optional: regenerate alongside the IG twin for matching plain shoes)"
    },
    {
      "path": "schedule-tweets/images/ig/ig-single-6132edeb-kaspa-god-candle-yacht.png",
      "verdict": "FAIL",
      "severity": "medium",
      "defects": [
        "Both sneaker tongue labels carry pseudo-text: garbled glyph-like lettering printed on teal tongue tags (left shoe clearly, right shoe too). That breaks the hard rule: no text or words anywhere in the image.",
        "The right sneaker also shows a Nike-style SWOOSH on its side panel, a third-party brand mark.",
        "Everything else is correct: the Kaspa mark is oriented right, the pillar is plain, the hull is unmarked, the 4:5 frame is 1122x1402 and the corners are clean. The sneakers sit large and near the centre of the 4:5 frame, so both defects show in the feed."
      ],
      "fix": "Regenerate the 4:5 with the same prompt plus: plain unbranded sneakers, no swoosh, no stripes, no logo, no tongue label, no lettering on the shoes. Keep the same image_id and filename. Lettering on a tongue tag is small, so inpainting it to a blank tag is an acceptable fallback, but the swoosh has to go too."
    }
  ],
  "summary": { "checked": 8, "passed": 5, "failed": 3 },
  "must_fix": [
    "schedule-tweets/images/ig/ig-single-6132edeb-kaspa-god-candle-yacht.png  (pseudo-text on both shoe tongues + swoosh)",
    "schedule-tweets/images/ig/ig-single-a5403598-kaspa-poll-says-both.png    (Nike-style swoosh on both sneakers; X twin is plain)",
    "schedule-tweets/images/x/x-tweets-7168ff9f-ai-opens-the-167-year-vault.png (pseudo-handwriting on the papers specced fully blank)"
  ]
}
~~~

## Pattern note for the regen

Both IG failures come from the same thing: the 4:5 frame puts the character sneakers big and central, and the model
dresses them as branded high-tops (swoosh, tongue tags with lettering). The 1:1 X versions came out plain or nearly
plain. Any prompt for a coin character with legs and shoes should say: plain unbranded sneakers, no swoosh, no logo,
no tongue label. QA should crop the shoes on every 4:5 companion.
