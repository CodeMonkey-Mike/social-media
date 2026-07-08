# longform-edited · B-ROLL + CONTAINERS rule

Specific cover-layer rules for the longform-edited track (extends `longform-edited.md` house rules #1-#3).

## ⛔ CSS CONTAINERS — build them like the reference, do NOT crop a deck (Mike, 2026-06-30)
**See `container-reference/` (screenshots from banks-own-chain + bittensor — the look Mike wants) + its README.**
The recurring failure: building a multi-card *presentation deck* and CROPPING slides out of it. Cropping drags in
the slide headline, the card's off-center slide position, and forces the same slide to repeat — exactly what Mike
flagged ("the title should not be there… it shows repeating slides… it becomes harder every video"). The early
videos were easy because each container was its **own full-frame element**. So:
- **BUILD each container as a standalone full-frame HTML element** (`containers.html`, one `1920x1080` `<div>`
  per beat), then screenshot it. Anatomy: LEFT-aligned, an uppercase **eyebrow** + a serif **headline** with
  accent-colored keywords + the body/structure, on dark bg. The title lives INSIDE the container.
- **NEVER a floating slide-headline over separate cards; NEVER two unrelated cards at once** (a declared A-vs-B
  comparison is the only exception). One self-contained container per talking point, shown contiguously.
- Gated by `lint-deck-containers.py` (a 2+-card PNG FAILs as a whole-slide) — but the gate checks pixels, the
  reference + this rule are how you BUILD them right in the first place.

## The manifest is the contract — file-level, ZERO ORPHANS (hard gate)
(The manifest lives inside `EDIT-PLAN.md` — the per-beat layer table that editing can't start without; see the
HARD GATE in `longform-edited.md`. It replaces the old standalone BROLL-PLAN.)
(Mike, 2026-06-18, after 16 sourced video clips silently never made it into the render — the plan documented
b-roll by *concept* and left "stills vs video" to the build, so nothing checked that every downloaded file
got used.)

- **The EDIT-PLAN manifest is FILE-LEVEL, not a concept map.** Every single piece of b-roll —
  **image, video, AND CSS container** (plus receipts/logo/chapter-cards) — gets its own row listing:
  **(1)** the exact file (`vid/x.mp4`, `img/x.png`) or container id, **(2)** its TYPE (image / video / css-container /
  receipt), **(3)** the chapter + the **spoken line / beat** it covers (the transcript words), **(4)** its
  placement **timecode** `tIn–tOut` once wired into the comp. Concept-only entries ("imposing government
  monolith") are NOT enough — name the file and the line.
- **Every asset that was downloaded or generated is either PLACED or REJECTED.** If a sourced clip/image is
  not used, it gets an explicit `REJECTED: <reason>` row (e.g. "Auschwitz footage — too heavy / off-tone,
  dropped"). There is no third state. A file sitting in `assets/`/`render-assets/` that appears in neither the
  comp nor the manifest-as-rejected is a BUG.
- **Never defer "stills vs video" vaguely to the editor.** The build MAY choose, but the moment it chooses it
  WRITES THE CHOICE BACK into the manifest (file + timecode). The manifest always reflects the actual comp.
- **Pre-render reconciliation (do this BEFORE every full render):** diff the comp's asset references against
  the asset folder. Every file in the folder must be either referenced in the comp or marked `REJECTED` in the
  manifest; every reference in the comp must resolve to a real file. Counts reconcile to zero orphans. Only
  then render. (A full render is a CONFIRMATION step, never a discovery step — don't render to find what's
  missing; reconcile first.)

## Sync is rule zero
- **Every container / b-roll / receipt / logo / chapter-card cue MUST be snapped to the WORD-LEVEL
  transcript of the desilenced spine — never estimated.** (Mike, 2026-06-17, after CH2 containers drifted
  ~10-13s: "fix this code" fired at 1:33 while he was still on citizenship.) Workflow: transcribe the
  spine with word timestamps, then set each `tIn` to the segment where he STARTS saying that point and
  `tOut` to where he moves on. Verify by extracting a frame mid-cue and reading the transcript at that t.

## QA every captured asset BEFORE it goes in the comp (hard gate)
- **Every screenshot / receipt / downloaded image / b-roll clip MUST be opened and looked at before it is
  referenced in the comp.** (Mike, 2026-06-17: shipped a Grayscale SEC "your request came from an automated
  tool" bot-block page as a receipt because it was never viewed.) Captures silently fail into Cloudflare/bot
  walls, paywalls, cookie banners, error pages, wrong-aspect crops, and zero-byte files.
- Workflow: after capture, downscale + Read the image (or a contact sheet of them). Confirm it actually shows
  the intended content. A receipt that isn't the real article/filing gets re-captured (proper User-Agent) or
  replaced with a deck container — it does NOT get used.
- Also QA the FINAL render by sampling frames across every chapter, not just the few you changed.

## Sourcing — disk rule
- **Envato clips larger than 1 GB are capped to ~100 MB on save** (transcode to 1080p H.264, audio stripped,
  bitrate sized by duration; recycle the multi-GB original). B-roll is used ≤4s and muted, so the full weight
  buys nothing. Canonical procedure lives in `video-creation/skills/envato-broll/SKILL.md` (the download tool);
  this is just the pointer so it's visible from the longform-edited b-roll workflow. (Mike, 2026-06-20.)

## Render order (so b-roll is actually visible)
- In the comp, **b-roll renders AFTER (on top of) the containers/diagrams/receipts** — it is a brief cutaway
  that replaces the container for its ≤4s window, then returns. If b-roll is layered UNDER the containers, the
  containers cover it and NONE of it shows. (Mike, 2026-06-17: whole edit looked container-only.)

## The cover layer — THREE kinds of b-roll
The cover layer is built from b-roll, and **b-roll comes in THREE selectable types** (Mike, 2026-06-17):
1. **Image b-roll** — a generated/stock still. ≤4s.
2. **Video b-roll** — a stock/AI clip. ≤4s (first 4s only of a longer clip).
3. **CSS container b-roll** — a deck-styled card / system-design diagram (the dominant type, ~5-12s).

Plan and pick across all three when covering a beat. **The CSS container must NOT cover over image/video
b-roll** — image/video b-roll renders ON TOP and briefly replaces the container, then returns to it (see
"Render order"). So a cover stretch = containers carrying the points, with image/video cutaways punching
through on top.
- **CONTAINERS are the DOMINANT of the three** (deck-styled, see below); **image/video b-roll is ≤4s
  punctuation only** (house rule #2: "1 to 4 seconds on screen, never more" — applies to BOTH images and
  videos; a still that sits 16s or a clip that plays then freezes both violate it).
- **Exception — immersive "leading" motion (Mike, 2026-06-18):** a b-roll clip whose camera moves CONTINUOUSLY
  to LEAD the viewer INTO the scene — a corridor dolly, a fly-through, a slow push-in — is a pattern interrupt
  that HOLDS attention rather than just punctuating, so it MAY run a bit longer, **up to ~5s**, instead of the
  ≤3-4s cap. Use it SPARINGLY (the exception, not license to hold every clip); static or fast-cut clips still
  obey ≤4s. Example: the dark data-center corridor dolly (static reusable copy at
  `assets/broll/video/datacenter-corridor-dark.mp4`; it's bittensor's `server-dark` cold-open clip, currently
  3.8s there — this exception is exactly what would let a leading corridor like it stretch to ~5s).
- **No b-roll asset is REUSED — each still / clip appears at MOST ONCE per video (house rule #12,
  `longform-edited.md`).** Seeing the same image/clip again seconds later reads cheap. Short on distinct b-roll
  for a beat? Use a deck CONTAINER or a chart, or source/generate a NEW asset — never repeat one. **Reconcile the
  cover list before every render: zero assets appear twice, and zero b-roll clips exceed ~4s** (this reconcile
  catches both #2 and #12; it is part of the PRE-RENDER GATE, not an afterthought).
- **No black / blank screen > 0.5s.** A cover beat always shows SOMETHING (a container by default, or a
  ≤4s cut). The ONLY allowed black is when the SCRIPT earns it ("and it went dark", "gone").
- **No gaps and no long holds.** A long cover stretch (10-60s of narration, no face) is carried by
  **multiple containers spotlight-swapping** one point at a time (~5-12s each), with the occasional ≤4s
  b-roll cut between — NEVER one container/diagram held for 30-60s, NEVER a gap between cues.
- Cover beats with no planned b-roll **default to a deck container** (house rule #9).

## Container STYLE — match the slide deck
- Containers must look like the project's **slide deck** (`<project>-deck.html`), NOT a generic card:
  full-bleed deck-bg, **left-aligned**, blurred color **orbs**, **Playfair Display** title (with accent-color
  spans), **JetBrains Mono** uppercase eyebrow, gradient **divider**, **DM Sans** body. Deck palette
  (green #00e68a / cyan #00c2ff / gold #ffd700 / red #ff4060 on #0a0c10).
- CH5-style mechanics use the **built system-design diagrams** (`graphics/*.png`) as full-frame containers,
  but still SWAP per bullet (don't hold one diagram 50s) and interleave the sub-point text containers.

## Music (cross-ref house rule #10)
- The edit MUST ship with the chapter music beds, with the inter-bed breath at each bed change.
