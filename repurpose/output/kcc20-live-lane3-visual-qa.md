# Visual QA: batch `kcc20-live`, Lane 3 images

_QA'd 2026-10-22 by visual-qa. This is a report only: no file was changed, regenerated or moved._

**Checked against:** each item's `prompt` / `ref` in `repurpose/output/kcc20-live-lane3-plan.json`, the image rules in `repurpose/SKILL.md` (tweet visual style, the YT carousel version library, the V1/V2/V4 exemplar notes), the live exemplars in `schedule-tweets/images/reference/carousels/version2/` and `version4/`, plus `nacho.jpg`, `pieverse.jpg` and `kaspa-logo.png`.

**Method:**
- Opened every image at full size.
- Swept all four corners at 2.5x brightness for watermarks, signatures and initials.
- Zoomed into every prop that could carry stray text: the ledger, the clipboard, signs, posters, books and holo panels.
- Ran a contrast-amplified scan of every white V4 data slide for a faint `@cryptodaily` watermark copied from `slide.png`.
- Measured text extents and margins in pixels.
- Measured the teal and green hues against the exemplars.
- Ran a pixel-similarity check of every file against every other file and every reference, to catch the known mis-capture bug.

**Global checks:**
- All 16 files exist and are 1254x1254 (1:1).
- No file is a mis-captured copy of a reference or of a sibling. The closest pair is still very different (mean pixel diff 36.6 on 64x64 thumbnails).
- No watermark, @handle or signature on any image.
- No em dash on any slide.
- No Instagram images were made, as the brief required.
- V1 was not used in this batch, so the chartreuse and baked-counter hazards do not apply.
- The V2 teal measures hue 179-182 deg against the exemplar range of 174.5-179.1 deg. That is on-family, just slightly brighter and more cyan, and consistent across all 5 slides. Not a defect.
- The V4 hook green measures 128 deg (neon green, close to the house 122.6 deg). Not chartreuse.

```json
{
  "assets": [
    { "path": "schedule-tweets/images/x/x-tweets-efd05594-kcc20-is-final.png", "verdict": "PASS",
      "defects": ["minor: the open ledger on the collapsing scaffold has faint pseudo-handwriting lines; the prompt said 'completely blank'. Illegible and invisible at feed size."],
      "fix": "none required" },
    { "path": "schedule-tweets/images/x/x-tweets-a1779992-the-hike-nobody-priced.png", "verdict": "PASS",
      "defects": [], "fix": "none" },
    { "path": "schedule-tweets/images/x/x-tweets-689f770b-pieverse-agent-payments-retracement.png", "verdict": "PASS",
      "defects": [], "fix": "none" },
    { "path": "schedule-tweets/images/x/x-tweets-a358ba87-bear-trap-2022-replay.png", "verdict": "PASS",
      "defects": ["minor: the support line glows warm gold, not the specified 'soft white'. It still reads as the floor line."],
      "fix": "none required" },
    { "path": "schedule-tweets/images/x/x-tweets-32514513-now-we-just-say-kaspa-tokens.png", "verdict": "PASS",
      "defects": ["minor: an out-of-focus sticker or poster on the background lamp post (about x1030-1080, y660-750) carries illegible pseudo-glyph marks; the prompt said no text anywhere. Only about 50x90 px and bokeh-blurred."],
      "fix": "optional: blur or clone that patch in place (flat background texture, safe to edit). No regen." },
    { "path": "schedule-tweets/images/x/x-tweets-fad33858-genius-act-stablecoin-rules-final.png", "verdict": "PASS",
      "defects": [], "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-7fe43718-01-hook.png", "verdict": "FAIL",
      "defects": ["glyph artifact: a dark notch or blob sits inside the lower-left of the 'K' in 'KASPA' (about x65-85, y1095-1110), so the K looks underscored. Visible at full size.",
                  "secondary: the text runs past the margin the prompt asked for (at least 8%). Line 2 'KASPA TOKENS NOW LIVE ON THE L1' spans x43-1209 (3.4% / 3.6% side margins); line 1 has 4.9% / 4.2%. Nothing is clipped."],
      "fix": "In place: fill the notch inside the K stem with the surrounding letter green (it is a flat region inside a letterform). The margin needs no action unless Mike wants it; if he does, re-typeset the two lines in code over the flat black band at 84% or less of the width. Do not regen (it risks the Nacho likeness, which is good now)." },
    { "path": "schedule-tweets/images/yt/yt-posts-6c411f5d-02-three-standards.png", "verdict": "FAIL",
      "defects": ["chart figure drift, the defect SKILL.md warns about for V4 data slides: the 2024 and 2025 labels sit on their year gridlines, but '2026' sits about half a year right of its own gridline (label x1016, gridline x833). The markers are misplaced on that axis: 'KRC20 LIVE: SEPT 2024' is plotted at early 2024, and 'COVENANTS LIVE: JUNE 30, 2026' at about March 2026.",
                  "three extra unlabelled hollow milestone markers on the timeline; the prompt asked for three green markers only",
                  "unspecified text added: 'FINAL' x3 inside the stat boxes, which the prompt forbids ('no text beyond what is listed here'). The word is accurate, but it breaks the exact-text clause."],
      "fix": "Code-render this slide with repurpose/output/kaspa-lane3-fix/render_v4_slide.py (the canonical V4 path for slides with figures), using the exact prompt text and a proportional timeline with three markers. If it is rendered alone, check that it still sits with slides 3-5 (ChatGPT look); otherwise one ChatGPT regen adding 'markers placed at their true dates on a proportional axis, no other markers, no words beyond those listed'." },
    { "path": "schedule-tweets/images/yt/yt-posts-3e82a11f-03-indexer-vs-l1.png", "verdict": "PASS",
      "defects": ["note: adds the y-axis label 'TOKEN POOL VALUE'; fine, since the prompt asked for labelled axes. 'forged' is bolded for emphasis. The title runs to about 4% from the right edge, tight but not clipped. All text matches the prompt exactly, and the AFTER bars are slivers as specified."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-d7e72efd-04-migration-next.png", "verdict": "PASS",
      "defects": ["minor: random word tinting in the bottom bullets. 'No more KRC20 or', 'you say', 'KAS' and 'and still' render dark green and 'KCC-20 labels:' renders bold, while the rest is black. Looks like a render glitch, since slides 2 and 3 have uniform bullets. Wording is exact.",
                  "note: the bars are drawn to scale (measured: ATH bar top = 20.7, NOW bar top = 3.8-3.9 on the 0-25 cent axis); no figure drift. The Nacho box uses the red 'warning' border for a positive item (styling only)."],
      "fix": "optional: in place, recolor the bullet text to uniform near-black inside the bullet box (flat light-green background, safe to edit). No regen needed." },
    { "path": "schedule-tweets/images/yt/yt-posts-f8a014a6-05-question.png", "verdict": "PASS",
      "defects": ["note: the three empty A/B/C panels leave about a third of the slide blank. This is exactly what the prompt specified ('otherwise empty'), but the composition is weak; drafter's call next time, not a QA defect."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-388dcec9-01-hook.png", "verdict": "PASS",
      "defects": ["note: the title runs to x1214 (3.1% right margin, on the 'HIKE,' comma), tighter than the exemplar, but nothing is clipped. Counter '1 OF 5' appears exactly once, there is no em dash (the exemplar's 800x em-dash hazard did not carry over), and all text is exact."],
      "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-5eae9cc9-02-the-chart.png", "verdict": "PASS",
      "defects": [], "fix": "none" },
    { "path": "schedule-tweets/images/yt/yt-posts-b873e56d-03-the-2022-parallel.png", "verdict": "FAIL",
      "defects": ["typographic collision: the tail of the comma in '$15.5K,' hangs into the next title line and lands on top of 'BO' in 'EVERYBODY', so it reads like an accent mark over the B/O. Visible at full size."],
      "fix": "Regen this one slide (same image_id; move the old file aside first, since gen_images skips existing files). Same prompt plus: 'generous title line spacing; no punctuation may touch or overlap the line below'. Re-QA the counter '3 OF 5'." },
    { "path": "schedule-tweets/images/yt/yt-posts-6c61524c-04-the-plan.png", "verdict": "FAIL",
      "defects": ["typographic collision: the tail of the comma in 'SMA,' drops into the top of the 'Y' in 'EVERYTHING', so the word reads with an accented Y. The overlap is white on white and fused into the letter, so it cannot be trimmed in place. Visible at full size."],
      "fix": "Regen this one slide the same way as 03 (same image_id, old file moved aside, add the line-spacing / no-touching-punctuation clause). Re-QA the counter '4 OF 5'." },
    { "path": "schedule-tweets/images/yt/yt-posts-fedea663-05-question.png", "verdict": "PASS",
      "defects": [], "fix": "none" }
  ],
  "summary": { "checked": 16, "passed": 12, "failed": 4 },
  "must_fix": [
    "schedule-tweets/images/yt/yt-posts-6c61524c-04-the-plan.png",
    "schedule-tweets/images/yt/yt-posts-b873e56d-03-the-2022-parallel.png",
    "schedule-tweets/images/yt/yt-posts-7fe43718-01-hook.png",
    "schedule-tweets/images/yt/yt-posts-6c411f5d-02-three-standards.png"
  ]
}
```

## Per-asset notes

### X tweet images (6/6 PASS)

| Image | What was checked | Result |
|---|---|---|
| `efd05594` kcc20-is-final | Kaspa coin matches `kaspa-logo.png` (mirrored K, greenish cyan); logo only on the hero and the 3 keystones; parade coins plain (the silver coin has only a scratch texture, no glyph); scaffold tipping over; corners clean | PASS. The ledger pages have faint illegible scribble lines instead of 'completely blank' (minor) |
| `a1779992` the-hike-nobody-priced | Plain grey coins asleep in party hats, a cold blue wave, a plain gold coin with a sack on the rock (right edge, inside the frame); no logos or text; corners clean | PASS |
| `689f770b` pieverse | Cat matches `pieverse.jpg` (white plush, black eyes, glowing headband); both holo panels blank; no 2,450 USDT numbers copied; coins plain; book spine blank; corners clean | PASS |
| `a358ba87` bear-trap-2022-replay | Suited bears charging and tumbling into the pit; plain gold coin launching off the support line; no BTC glyph; corners clean | PASS. The line is gold, not white (minor) |
| `32514513` now-we-just-say-kaspa-tokens | Mirrored-K logo on the hero coin and the round signboard only; shelf coins plain; customer coin with bag; corners clean | PASS. Blurred pseudo-glyph sticker on the background lamp post (minor, optional in-place blur) |
| `fad33858` genius-act | Silver coin-shaped vault door; plain pale-green coins on light rails; clipboard verified blank; no $ sign, seal or logo; corners clean | PASS |

### YT post 1: KCC-20 carousel, Version 4 (1 hook + 4 data slides): 3 PASS / 2 FAIL

- **01-hook `7fe43718`, FAIL.**
  - Good: the Nacho likeness binds well. The background monitors are blank, with no 'NACHO NFT' poster carried over. The chart bubble is top-right, with no numbers. The text is exact, and 'SWIPE FOR MORE' appears once. **No pagination dots** (the known `hook.png` dot hazard did not ship) and no watermark.
  - Defect: a dark notch inside the **K of KASPA**. Fix in place.
  - Secondary: side margins are 3.4-4.9%, against the 8% or more the prompt asked for.
- **02 `6c411f5d`, FAIL.** The written figures are all exact, but the **timeline geometry has drifted** ('2026' sits off its gridline, and the markers are misdated against the axis). It also has 3 stray hollow markers and adds unspecified 'FINAL' x3. Best fix: code-render with `render_v4_slide.py`.
- **03 `3e82a11f`, PASS.** Exact text and correct bar slivers. No watermark, confirmed by the amplified scan.
- **04 `d7e72efd`, PASS.** Bars drawn to scale (20.7 / 3.9). Random green/bold word tinting in the bullets (minor, optional in-place recolor).
- **05 `f8a014a6`, PASS.** Exactly what the prompt specified. The empty panels are a weak composition, but they meet the spec.
- **Version consistency:** slides 2-5 share one look (white background, two-tone black/green title, page circle top-right, insight box). Page numbers 2/3/4/5 each appear once.

### YT post 2: the-hike-nobody-priced, Version 2: 3 PASS / 2 FAIL

- All 5 match the V2 exemplar anatomy: teal `N OF 5` top-left, big white all-caps title, teal accent line, dark rounded box with a teal label and white body.
- **Counters appear exactly once and are correct (1-5 OF 5).**
- No exemplar words copied, and no em dash.
- All text matches the prompts word for word.
- **03 `b873e56d` FAIL** and **04 `6c61524c` FAIL**: in both, a title comma's tail collides with the line below and reads as an accent ('EVERYBODY', 'EVERYTHING'). Regen each slide alone, with a line-spacing clause.

## Fix order (most severe first)
1. `yt-posts-6c61524c-04-the-plan.png`: regen (the comma is fused into the Y, so it cannot be repaired in place).
2. `yt-posts-b873e56d-03-the-2022-parallel.png`: regen (same defect).
3. `yt-posts-7fe43718-01-hook.png`: in-place green fill of the K notch (no regen).
4. `yt-posts-6c411f5d-02-three-standards.png`: code-render with `render_v4_slide.py` (or one constrained regen).

Optional cleanups (PASS as-is): the `32514513` lamp-post sticker blur and the `d7e72efd` bullet recolor.

After any regen or patch, send the replaced file back through visual-qa. Run gen_images one item per invocation, since a reference is attached and binding matters.
