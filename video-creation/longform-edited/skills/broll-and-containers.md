# longform-edited · B-ROLL + CONTAINERS rule

Specific cover-layer rules for the longform-edited track (extends `longform-edited.md` house rules #1-#3).

## ⛔ RECEIPTS-FIRST placement — assign receipts BEFORE b-roll, always (Mike, 2026-07-11)
When deciding what covers each beat, **place the receipts FIRST, then b-roll, then containers fill the rest.**
Do not scatter b-roll across the timeline and slot receipts into the gaps; it is the reverse. Walk the
transcript, and for **every beat that states a fact, a number, a claim, a market/price/supply figure, a
partnership, or a date**, assign a **real receipt** to that beat before anything else competes for it.
- **A coin-aggregator screenshot IS a receipt** (CoinMarketCap, CoinGecko, TradingView, CryptoRank, DefiLlama,
  DexScreener), not only a news article. A price/market-cap/supply/unlocks/holders panel or a real trading
  chart is the strongest possible cover for a data beat: real site, real data, "verify it yourself." Prefer a
  real aggregator screenshot over redrawing a market chart (charts.md: never an image model as a number source;
  and a real chart beats a re-draw for a MARKET figure — our own animated charts are for numbers WE control).
- **Order of assignment (this is the priority stack):** (1) receipts / real-aggregator screenshots on every
  data/claim beat → (2) our own animated charts + system-design containers/diagrams/timelines on the
  explainer beats → (3) the sparse b-roll budget (house rule #2) on the atmospheric/conceptual beats that a
  receipt does not fit. B-roll gets what is LEFT, not first pick.
- **Know where everything goes before capturing:** reconcile the whole cover list against the transcript and
  lock receipt positions first (zero-orphans), then fill. This is exactly what the `coverage-strategist`
  advisor does; this rule makes it canonical so it holds on every video whether or not it is restated.
- **Type every receipt R(article) or R(other)** — see "Cover STYLE devices" §1 below; article receipts carry
  the mandatory reading/motion treatment.


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

## ⛔ THE BALANCE — a rich slide ONCE, then BREAK IT UP into containers (Mike, 2026-07-10)
This is THE recurring struggle on every video since the first two. The failure is always one of two extremes,
and **both are wrong**:
- **(a) Repeat:** show one info-dense full-screen slide, then show that SAME full slide over and over for each
  sub-point. (What Mike flagged: "you were showing it over and over again.")
- **(b) Over-correct:** delete the good full slide entirely and replace everything with small text containers.
  (The equal-and-opposite error — "you removed them :(").

**The answer is a gentle balance, and it is not optional — the full slide and its break-up containers COEXIST:**
1. A rich **DIAGRAM slide** (a timeline, a flow, a multi-node system view — e.g. the "How the Dollar Won Twice"
   `1944 → 1971 → 1974 → TODAY` timeline) is a GOOD visual. **Show it ONCE, full-screen, held ~10s, as the
   section OVERVIEW.** Never delete it; it is the anchor the viewer gets to digest.
2. **Do NOT re-show that same full slide** for each sub-point. Instead, after the overview, **BREAK IT UP:**
   spotlight each piece of it as its **own smaller container** (~5s each) as the narration walks through that
   piece, contiguously, with ≤4s b-roll cutaways punching through.
3. So a rich section = **one overview diagram slide (once, ~10s) → several break-up spotlight containers (one
   per sub-point, ~5s) + b-roll cutaways + the section's chart.** Balanced, never all-one-type.
4. A chapter that is **100% full-slides (repeated)** OR **100% containers (no anchor diagram)** is the
   violation. Aim for the mix in every rich section. (Dwell floors: see "Minimum dwell time" below. Rich
   diagram slides are declared `// DIAGRAM_REFS:` so they're exempt from the whole-slide lint — they are
   allowed BECAUSE they appear once as the overview, not repeated.)

## Cover STYLE devices (Mike, 2026-07-24 — from the "Amazon Imploding" style study, youtu.be/7HbOBpsE4n0)

### 1. Receipts come in TWO named types (parallel to TITLE/CARD slides — use these names in BROLL-PLAN/CUE-SHEET)
- **R(article) — ARTICLE RECEIPT:** a prose page read on air (news article, blog post, research-paper page).
  Gets the READING treatment: an article is **never a static full-page hold** — give each ONE single-image
  motion move (device 2 below): a slow push-in toward the exact paragraph being read, or a library camera-move;
  a two-stage zoom (wide establish → tighter crop on the key paragraph) is sanctioned for long reads
  (exemplar: the Insider leaked-memo article @3:17→3:26).
- **R(other) — OTHER RECEIPT:** platform/UI captures with no common shape (block explorer, GitHub
  release/commits, aggregator panels, dashboards, screen recordings). No standard treatment — recordings
  already move; a static panel may take a subtle push, or none.

### 2. Single-image MOTION moves — a "transition" run on ONE image (A=B), for articles + stills
The library's camera-move families double as ON-image effects when the SAME asset sits on both sides of the
TransitionClip: nothing is revealed, the frame itself moves. Sanctioned single-image families (per
`assets/transitions/library.json`; browse galleries at `assets/transitions/browse/<CATEGORY>/<family>/gallery.html`):
- **MOTION** — 3D Pan (the one Mike used historically) · 3D Orbit · 3D Offset · Shake 3D / Optics / Simple
- **ZOOM** — Ease / Simple (+Short) = subtle reading moves · Hit / Shake / Optics / Spin / Swinging (+Short) = punch variants
- **PERSPECTIVE** — Ease In / Ease Out (+Short) · Pan 3D (+Short)
- **EXPAND** — Expand Pan
- **DEVIATION** — the 5 shader optics/shift bursts = a single-frame distortion hit
(The reveal-geometry families stay two-image transitions and are NOT for this: OFFSET, SPLIT, GLASS, SPIN,
MELT, TRANSFORM — the last two are the reserved §4 marquee families.)
Usage rules: mix-and-match zoom + pan across a video's articles so they don't all move the same way; **ONE
move per article**; subtle families (Ease / Simple / 3D Pan / hand Ken-Burns push) on reading beats; Hit /
Shake / Deviation variants only on punch moments. These are effects on a cover asset, not cuts — they do NOT
consume the marquee budget and do not appear in TRANSITIONS.md's buckets.

### 3. LINE-CAPTION overlay on video b-roll — 10-20% of the time, MAX (Mike's frequency rule)
A kinetic spoken-line caption burned onto a VIDEO b-roll cover: bold condensed UPPERCASE, high-contrast
(white with a hard black outline/shadow), bottom-left, 1-2 lines, quoting the spoken line INCLUDING its
number when there is one (exemplar: "ITS BRICK AND MORTAR SALES FELL BY 16%"). Hard rules:
- **ONLY over VIDEO b-roll.** Never over stills, containers, charts, receipts, or FACE.
- **Frequency-capped at ~10-20% of the video's video-b-roll covers** — a seasoning, never wall-to-wall.
- MAY persist across consecutive b-roll cuts (text and picture cut on independent rhythms — exemplar: the
  four-states caption holding while three skylines flip behind it @4:14-4:18).
- This overlay is PART OF THE COVER ASSET, not the house word-caption track: the captions-skill captions stay
  FACE-only and lint-covers' "captions never over a cover" is UNCHANGED by this device. No em dashes ever.

### 4. Literal-noun b-roll (soft rule — land it here and there, not everywhere)
When picking b-roll, prefer a shot that literally depicts the just-spoken noun or action even when nothing in
the frame carries text: a gauge needle for "no dial to turn", a shutter pulled down for "closing locations",
a construction aerial for "postponed its headquarters". Not mandatory per beat — deliberately land it here
and there so covers feel authored; also tone-match (moody/desaturated shots under grim beats).

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

## Minimum dwell time — give the viewer time to read (Mike, 2026-07-10)
How long a cover holds is driven by how much there is to DIGEST, with a **floor per type** so nothing flashes
by before it can be read:
- **Single-card container** (one eyebrow + headline + a short body or 3-item list — the spotlight card):
  **≥ 5 seconds on screen.** Long enough to read the card once unhurried; still spotlight-swap to the next
  point after.
- **Full slide / multi-element diagram** (a timeline, a flow, a linear chain, a labelled system view — several
  nodes the eye has to walk across): **≥ 10 seconds on screen.** These carry far more to parse — e.g. the
  "How the Dollar Won Twice" `1944 → 1971 → 1974 → TODAY` timeline — so hold them roughly **double** a single
  card. The viewer needs to trace the whole chain.
- These are **floors, not the ≤4s image/video-b-roll cap** (that punctuation cap is unchanged) and they do not
  override the LONG-HOLD ceiling (a TEXT container still must not sit 30-60s — spotlight-swap; a system-design
  DIAGRAM may hold longer while it is actively being explained). Set the real hold by the narration over that
  beat, but never below these floors.

## Container STYLE — match the slide deck
- Containers must look like the project's **slide deck** (`<project>-deck.html`), NOT a generic card:
  full-bleed deck-bg, **left-aligned**, blurred color **orbs**, **Playfair Display** title (with accent-color
  spans), **JetBrains Mono** uppercase eyebrow, gradient **divider**, **DM Sans** body. Deck palette
  (green #00e68a / cyan #00c2ff / gold #ffd700 / red #ff4060 on #0a0c10).
- CH5-style mechanics use the **built system-design diagrams** (`graphics/*.png`) as full-frame containers,
  but still SWAP per bullet (don't hold one diagram 50s) and interleave the sub-point text containers.

## Music (cross-ref house rule #10)
- The edit MUST ship with the chapter music beds, with the inter-bed breath at each bed change.
