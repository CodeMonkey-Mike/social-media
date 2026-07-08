# Image-reply style catalog

Reference catalog for the 4th reply type: AI-generated images (alongside text, emoji, GIF).
Each style = a visual format + the rhetorical job it does. The drafting step picks a style by
**what the tweet calls for**, then generates a bespoke image for that tweet using the style's
exemplar as `--reference-image`.

**Exemplars live in `example-images/`.** `example1-7` are the originals this catalog grew from;
new exemplars get generated one per style (file named after the style slug).

> **Canonical machine-readable index: `example-images/library.json`** — that file holds the
> authoritative per-style metadata (category, when-to-use signals, avoid-when, prompt skeleton,
> slots, logo-ref flag, proven exemplar prompts) and is what the drafting step loads to pick a
> style. On any conflict with the tables below, `library.json` wins. Update it first.

---

## Hard rules

- **Generator:** ChatGPT via the browser pipeline (`repurpose/gen-batch-freshchat.js`,
  fresh chat per image, `--reference-image <exemplar>`). NEVER `gpt_image_2` via Higgsfield CLI.
- **No numbers from the image model.** No prices, market caps, dates-with-figures, or labeled
  chart values rendered by AI (it fabricates and garbles them). Symbolic candles/arrows are fine.
  If a real number matters, it goes in the reply text, not the image.
- **In-image text stays short.** One headline + a handful of 2-4 word labels max. Long body text
  garbles. **Proofread every generated word before queueing** — a misspelled image is worse than
  no image.
- **Every image unique** — generated fresh for the specific tweet, never reused (same rule as
  repurpose images).
- Persona rules apply to in-image text and the accompanying reply text: no em dashes,
  TAO not tau, word-choice rules in `persona/persona.json`.
- Like GIF replies, an image reply usually needs little or no text — the image IS the take.
  A short one-liner on top is fine; don't restate the image in words.

---

## A. Hype / bullish amplify — tweet is bullish news, a milestone, a pump

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 1 | **Bull-Ride Hype Poster** | `example4.jpg` (original) | portrait | Neon comic-realism hero riding a charging animal up a rising candle chart, big all-caps caption top. _"Comic-book style poster, {SUBJECT} riding a charging teal bull up a glowing rising chart, neon trading-floor background, bold headline '{CAPTION}'"_ |
| 2 | **Rocket Mission Patch** | generate | square | Embroidered NASA-style mission patch on fabric: coin logo, rocket, stars, motto ring. _"Embroidered space-mission patch, '{TICKER} MISSION' around the rim, rocket and {LOGO} in the center, stitched fabric texture"_ |
| 3 | **Retro Propaganda Poster** | generate | portrait | WPA/constructivist flat-color poster, heroic worker/figure, 2-4 word slogan. _"1940s propaganda poster style, heroic figure holding {OBJECT} aloft, bold flat colors, slogan '{SLOGAN}'"_ |
| 4 | **Blockbuster Movie Poster** | generate | portrait | One-sheet with title treatment, dramatic key art, fake billing block (tiny, illegible-by-design). _"Epic movie poster, {SUBJECT} as the hero, title '{TITLE}', dramatic lighting, coming-soon one-sheet layout"_ |
| 5 | **Championship Celebration** | generate | square | Locker-room / trophy-lift scene, confetti, jersey with logo. _"Sports championship celebration, team lifting a trophy shaped like {OBJECT}, confetti, stadium lights"_ |
| 6 | **Weather Forecast** | generate | landscape | TV weather studio, forecaster pointing at a map covered in green-candle icons. _"TV weather forecast scene, meteorologist pointing at a map covered in green candle icons, caption banner '{FORECAST}'"_ |

## B. Vindication / told-you-so — tweet proves an old call right

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 7 | **Future Storefront Skit** | `example3.jpg` (original) | portrait | 3D-cartoon everyday scene set in the future, speech bubbles, signage doing the talking. _"3D cartoon scene, {EVERYDAY PLACE} in the future where {THING} is normal, characters with speech bubbles '{LINE1}' '{LINE2}'"_ |
| 8 | **Front Page from the Future** | generate | portrait | Aged newsprint front page, masthead, giant headline, photo, subheads. No dates with numbers. _"Vintage newspaper front page, masthead 'THE DAILY LEDGER', giant headline '{HEADLINE}', black-and-white photo of {SCENE}"_ |
| 9 | **Time Traveler** | generate | square | Cartoon time traveler bursting in to warn a present-day person, one urgent speech bubble. _"Comic panel, a time traveler in glowing gear grabbing a man by the shoulders, speech bubble '{WARNING}'"_ |
| 10 | **Museum of Doubters** | generate | landscape | Museum exhibit behind glass with brass plaque: the extinct skeptic/bear. _"Natural-history museum exhibit, {FIGURE} displayed behind glass, brass plaque reading '{PLAQUE}'"_ |

## C. Lineage / succession — tweet compares chains, eras, generations

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 11 | **Three-Panel Torch Pass** | `example1.jpg` (original) | square | Three vertical panels, comic mascot per era passing a torch left to right, short checklist per panel, verdict strip bottom. _"Three-panel comic poster, {A} then {B} then {C} as armored coin-headed heroes passing a torch, 3-4 word feature labels per panel, bottom strip '{VERDICT}'"_ |
| 12 | **Evolution March** | generate | landscape | Ape-to-human style silhouette progression, final figure upright and glowing. _"Evolution-of-man silhouette progression, stages labeled {A} {B} {C}, final upright figure holding {OBJECT}, glowing"_ |
| 13 | **Podium Ceremony** | generate | square | Olympic medal podium, coin mascots on 1/2/3 steps. _"Olympic podium ceremony, {WINNER} on the top step raising arms, {SECOND} and {THIRD} below, stadium crowd"_ |

## D. Explain / teach — tweet raises a concept worth diagramming (the parchment-sage lane)

The house style for smart replies: vintage hand-inked illustration on aged parchment, muted
palette, engraved-caption typography. Distinctive, calm, premium — the opposite of loud CT slop.

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 14 | **Parchment Vault** | `example5.png` (original) | landscape | One central metaphor object (vault/engine/lighthouse), wax-seal badges around it, checkmark scroll below. _"Hand-inked illustration on aged parchment, {CENTRAL METAPHOR} in the middle, wax seal stamps labeled {BADGES}, headline '{TITLE}'"_ |
| 15 | **Quadrant Playbook** | `example6.png` (original) | landscape | 2x2 grid, one mini-illustration + 2-3 word label per cell, headline + subtitle top. _"Aged parchment 2x2 quadrant diagram, four hand-inked vignettes labeled {L1} {L2} {L3} {L4}, headline '{TITLE}'"_ |
| 16 | **Hub-and-Spoke** | `example7.png` (original) | landscape | Central labeled node radiating arrows to satellite nodes, one special corner element (judge panel / seal). _"Parchment diagram, central {HUB} radiating orange arrows to {N} nodes labeled {LABEL}, wax seal in the corner reading '{SEAL}'"_ |
| 17 | **Da Vinci Anatomy** | `example2.jpg` (original) | landscape | Anatomical figure with labeled parts and dashed arrows, torch-lit parchment margins. _"Da Vinci style anatomical study on parchment, '{TITLE}', figure of {ARCHETYPE} with labeled parts: {PART LABELS}"_ |
| 18 | **Iceberg Cutaway** | generate | portrait | Iceberg above/below waterline, small visible tip labeled, huge submerged mass labeled. _"Cross-section illustration of an iceberg, small tip above water labeled '{SURFACE}', massive underwater body labeled '{DEPTH LABELS}'"_ |
| 19 | **Blueprint** | generate | landscape | White technical linework on blueprint blue, measurements, corner title block. _"Engineering blueprint, white line drawing of {SYSTEM}, annotation callouts {LABELS}, title block reading '{TITLE}'"_ |
| 20 | **Metro Map** | generate | landscape | Ecosystem as a transit map: colored lines, station dots, interchange highlighted. _"Minimalist metro map, lines labeled {LINES}, major interchange station highlighted named '{STATION}', legend box"_ |
| 21 | **Bayeux Tapestry** | generate | landscape | Medieval embroidered tapestry panels telling a market saga, faux-Latin captions. _"Bayeux tapestry style embroidery, panels showing {EVENT SEQUENCE}, stitched caption '{CAPTION}'"_ |

## E. Compare / contrast / counter FUD — tweet is a bad take, FUD, or a rivalry

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 22 | **Two Lanes Split** | generate | square | Split-frame contrast: congested/broken side vs open/flowing side, tiny label per side. _"Split image, left side {BAD STATE} gridlocked and grey, right side {GOOD STATE} open and vivid, labels '{L}' and '{R}'"_ |
| 23 | **Balance Scale Etching** | generate | square | Old engraving of a balance scale, one pan heavy with substance, the other floating with hot air. _"Vintage etching, large balance scale, one pan holding {HEAVY}, the other holding {LIGHT} floating upward, labels"_ |
| 24 | **Fight Night Poster** | generate | portrait | Boxing tale-of-the-tape poster: two fighters face off, stat rows between them (words, not numbers). _"Boxing match poster, {A} vs {B} facing off, tale-of-the-tape rows comparing {TRAITS}, headline '{EVENT}'"_ |
| 25 | **Report Card** | generate | portrait | Skeuomorphic school report card, subjects graded A-F, red-pen teacher comment. _"Old-school report card for {SUBJECT}, graded rows {ROWS}, big red teacher note '{COMMENT}'"_ |
| 26 | **Airport X-Ray** | generate | landscape | Security scanner screen revealing what's actually inside a branded suitcase. _"Airport x-ray scanner view, suitcase labeled '{BRAND}' revealing {CONTENTS} inside, security guard looking shocked"_ |

## F. Receipts / prove a point — tweet makes a claim we can dramatize

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 27 | **Detective Evidence Board** | generate | landscape | Corkboard, pinned polaroids/notes connected by red string converging on one conclusion card. _"Detective evidence corkboard, pinned photos of {CLUES} connected by red string to a center card reading '{CONCLUSION}'"_ |
| 28 | **Courtroom Sketch** | generate | landscape | Pastel courtroom-artist sketch: the accused (a narrative/FUD), stern judge, evidence table. _"Courtroom sketch in pastel, {DEFENDANT} on the stand looking nervous, judge holding {EVIDENCE}, caption '{CAPTION}'"_ |

## G. Identity / reaction — community in-jokes, "this is us" moments

| # | Style | Exemplar | Format | Visual spec + prompt skeleton |
|---|-------|----------|--------|-------------------------------|
| 29 | **Tarot Card** | generate | portrait | Ornate arcana card, allegorical figure, roman numeral, name banner. _"Ornate tarot card, allegorical figure of {ARCHETYPE}, decorative border, banner reading '{NAME}'"_ |
| 30 | **Creature Trading Card** | generate | portrait | Collectible creature card: art window, name bar, 2-3 word ability lines (no stat numbers). _"Collectible trading card, creature '{NAME}' illustrated in the art box, ability lines {ABILITIES}, holographic border"_ |
| 31 | **Wanted Poster** | generate | portrait | Weathered western wanted poster, portrait, crime line, torn edges. _"Old west wanted poster on weathered paper, portrait of {FIGURE}, text 'WANTED: {CRIME}'"_ |
| 32 | **Nature Documentary Still** | generate | landscape | Letterboxed documentary frame, majestic animal/figure in habitat, subtitle-style caption. _"Nature documentary still, {CREATURE} in its natural habitat, cinematic lighting, subtitle caption '{NARRATION}'"_ |

---

## Workflow (BUILT 2026-07-07 — canonical procedure lives in `CLAUDE.md` §2 and §4)

1. **Draft** — the drafting step loads `library.json`, matches strong tweets against
   `when_to_use` signals, and adds `image_style` + `image_prompt` (filled skeleton) to the
   opportunity entry. Quota: 1-2 per 20-entry batch, only when the image IS the take.
2. **Review** — the dashboard's Reply Opp tab shows an IMAGE badge, the style exemplar as a
   preview thumbnail, and the prompt. Queuing carries the image fields into
   `replies_to_post.json`.
3. **Generate** — `node generate_reply_images.js` builds the batch (ref = style exemplar; for
   `needs_logo_ref` styles it appends the words-based logo spec: the Kaspa K is a BACKWARDS
   (mirrored) K in teal — never attach the standalone logo file to a scene generation), runs
   `repurpose/gen-batch-freshchat.js`, saves to `data/reply-images/`, and fills `image_path`
   in the queue. **QA every word in every image before posting.**
4. **Post** — `python post_replies.py` (one queue, all four types). Ungenerated image entries
   are skipped and stay queued. `--dry-run` attaches + screenshots to `tmp-image-debug/`.

Open decision: watermark. The viral originals carry `@carlosofkaspa` watermarks; ours could carry
a small `@mikeneder` — free attribution when screenshots travel, but slightly less "clean".
