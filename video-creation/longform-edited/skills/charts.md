# longform-edited · CHARTS + animated data-graphics (canonical method)

How we build **data charts / motion-graph data visuals** (price/supply/accumulation lines, bar charts,
count-ups). This is the durable method, extracted from `smartmoney-backing-kaspa` (which carried ~13 charts,
C1-C13). **The method lives HERE, not in any media folder** — if a project folder is deleted, this skill still
tells you exactly how we do charts. (For the broader code-rendered explainer/system-design containers, see
`screenplay.md` Convention 4 + `broll-and-containers.md`; for the HTML/CSS styling system, see `presentation.md`.
This file is specifically the DATA-chart pipeline: sourcing, build-mode routing, and animation.)

Charts are a distinct asset class from diagrams: a **DIAGRAM** explains a mechanism (nodes + arrows); a
**CHART** plots real numbers (axes + series). Both are code-rendered and text-accurate; charts add the
data-sourcing + number-fidelity discipline below.

---

## 1. DATA.md + the CHART-SOURCE INDEX (every chart is sourced and routed)

Each chart-heavy video keeps a **`DATA.md`** in its folder: the research dump where **every number carries a
source**, plus a **CHART-SOURCE INDEX** table at the bottom. On-chain/market numbers drift, so anything quoted
on screen is re-pulled at render time and tagged `[VERIFY]` in the screenplay.

The index gives every chart an **ID the screenplay references** (`C1`, `C2`, …) and a **Build mode** column:

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C5 | % supply held by top 0.01% (24%→38%) | Kaspalytics `…?dtype=cs-percent&percentile=0.01` | **code** |
| C2 | Wallet address summary (107.3M KAS) | kas.fyi address page | **screencap** |
| … | … | … | code / screencap / restyle |

The screenplay's `🎬 [SHOW]` lines reference the chart by ID; the index says where its data comes from and how
it gets built. Drop a chart? Strike it in the index (`~~C9~~ DROPPED`), don't silently delete.

---

## 2. ⛔ Chart-handling decision (code / screencap / restyle) — generalized, source-agnostic

The reusable routing for ANY data chart, regardless of source (Kaspalytics, kas.fyi, TradingView, anywhere).
Three build modes + one hard guardrail:

1. **`code` — build it in code (DEFAULT for data).** Rebuild the chart as an accurate, on-brand, **animated
   Remotion component** (D3 scales + SVG / `visx`; animation driven by **`useCurrentFrame()`**, never a chart
   lib's own animation loop). Numbers/axes pixel-exact, matches the video palette, animatable in sync with the
   VO. (Fallback for a discrete cutaway: render an HTML chart via headless Chrome to a PNG/clip.)
2. **`screencap` — capture the real dashboard** when *authenticity* is the point ("here is the ACTUAL on-chain
   ledger, not my drawing"). Also the reference image the `code` rebuild is matched against.
3. **`restyle` — ChatGPT redraw (ILLUSTRATIVE only).** Screen-cap → ChatGPT (browser/Playwright, free on Mike's
   sub) for a prettier on-style redraw, OR as a STYLE SPEC (get the pretty look, then rebuild in `code` with the
   real values). Trend / shape / atmosphere ONLY.

**⛔ HARD GUARDRAIL — never let an image model be the source of a NUMBER.** If a specific number is the message
("107.3M KAS", "86% in loss", "38%"), the data MUST come from `code` (#1) or stay the real `screencap` (#2).
NEVER source that number from an image model (ChatGPT restyle OR Higgsfield): image models reinterpret
text/numbers as pixels and WILL drift bar heights and invent/round axis ticks. This is the same rule as
"diagrams = system-design containers, not AI images." (Per-chart routing lives in the DATA.md Build-mode column.)

_API integrations per source were considered and dropped — Mike wants ONE generalized method, not a per-site
integration._

---

## 3. Build pipeline (HTML proof → Remotion animation)

1. **Author the chart as a self-contained HTML** in `assets/charts/CH#_C#_topic.html` (D3/SVG, on-brand palette
   per `presentation.md`). Render a **PNG proof** beside it (`CH#_C#_topic.png`) via headless Chrome. This PNG is
   the **approved, accurate** reference — Mike signs off on the PNG before it animates.
2. **Animate it in the comp** as a Remotion component (`useCurrentFrame()`), geometry extracted from the chart's
   own SVG so the animated version is pixel-identical to the approved PNG. Stage render copies under
   `render-assets/charts/`.

### Animate-for-real vs reveal-a-bitmap (the key call)
- **Sparse charts → animate for REAL** (bars GROW, values COUNT-UP, a line DRAWS on, a split-bar FILLS), driven
  by `useCurrentFrame()`. This is the default and what the PRE-RENDER GATE means by "REAL Remotion-animated
  charts." A static PNG with a left-to-right wipe slapped over a chart you COULD have animated for real is the
  **#1 substitution failure** (smartmoney draft faked all charts this way → rebuilt).
- **Genuinely DENSE series → reveal the approved PNG** with a left-to-right CLIP. A ~1000-point line animated by
  per-frame SVG re-raster (`dangerouslySetInnerHTML`) BOUNCES/jitters and balloons frame size. For those, reveal
  the **approved accurate bitmap** (pixel-stable). This is NOT the faking failure — the bitmap is the real,
  signed-off chart, and the series is too dense to redraw per frame. **Rule: never animate a dense SVG by
  per-frame re-raster; reveal a bitmap. Animate for real whenever the chart is simple enough to.**
- Transition for charts on the spine: **cross-fade + scale-in** (same as containers), never `TransitionSeries`.

---

## 4. Pulling the data (generalized)

One method per source; parse the real series, don't eyeball the picture.
- **SSR-embedded dashboards (e.g. Kaspalytics, a SvelteKit app):** the full series is embedded in the
  server-rendered HTML. Concentration/percentile charts use QUERY PARAMS not path segments
  (`…/app/address/percentile?dtype=cs-percent&percentile=0.01`). Fetch the URL's HTML and parse the parallel
  numeric arrays (epoch-ms timestamps `1[6-8]\d{11}`, the metric series, the price overlay — same length). No
  API key, no UI clicking.
- **On-chain (e.g. api.kaspa.org):** scan addresses / sum net flow over a window for accumulation charts; keep
  the raw JSON in the project scratchpad and cite it in DATA.md.
- Whatever the source: the extracted series + its provenance go in DATA.md; the on-screen number is `[VERIFY]`'d
  at render.

---

## 5. Naming + locations (STANDARDIZED structure — Mike, 2026-07-06)
- **Authoring:** `media/<project>/assets/charts/CH#_C#_topic.{html,png}` (self-contained HTML source + its PNG
  proof side by side). The PNG proof is what Mike approves before anything animates.
- **Render-stage copies live under `media/<project>/render-assets/charts/` in TWO subfolders by kind:**
  - **`render-assets/charts/image/`** — the approved static PNG proofs (what a comp `staticFile()`s for a
    still spotlight, and the reveal-a-bitmap source for dense series).
  - **`render-assets/charts/video/`** — the **animated chart renders as standalone clips** (motion rendered
    OUT of Remotion BEFORE the main edit, then placed in the edit like any other clip — the
    smartmoney-backing-kaspa workflow, where the animated charts were rendered to their own mp4s first).
    One clip per chart (`CH#_C#_topic.mp4`), silent.
  - A chart PNG/clip sitting loose in `render-assets/charts/` (not in `image/` or `video/`) is a structure
    violation — sort it.
- **Every chart is a SELF-CONTAINED CARD, never a crop/screenshot of a slide deck** (Mike, 2026-07-06, caught
  on carry-trade): full-frame 1920×1080 with its own title, subtitle, chart body, bold takeaway line, and
  source line — no deck chrome (nav dots, eyebrow labels, slide orbs). A presentation deck may EMBED the same
  data for pitching/review, but the render asset is always the standalone card.
- IDs (`C#`) match the DATA.md index and the screenplay `🎬 [SHOW]` refs.
- The Remotion chart components live in `remotion/src/<Project>ChartsAnim.tsx` + a `<project>ChartsAnimData.ts`
  data module.

## 6. Gotchas (learned on smartmoney)
- **Windows filename CASE-COLLISION:** a data file `smCharts.ts` and a component `SmCharts.tsx` collide on the
  case-insensitive FS, so `import './smCharts'` resolves to the `.tsx` → `undefined` component prop. Name the
  data module distinctly (`…ChartsAnimData.ts`).
- **Crop screencaps to the chart** — a full-page dashboard screenshot leaves the chart tiny; crop to it.
- **Chart font vs container font:** charts use the original dashboards' sans (e.g. the deck containers may be
  Playfair/DM Sans while the charts stay sans for fidelity) — keep them visually distinct on purpose.
- **Jitter QA:** sample multiple frames across a chart hold; if labels/ticks shift frame-to-frame it's
  re-measuring per frame (positioned HTML, not SVG `<text>`; or reveal-a-bitmap for dense series).

## Exemplar (an EXAMPLE, not the source of truth)
`media/smartmoney-backing-kaspa/` (DATA.md C1-C13, `assets/charts/`, `remotion/src/SmChartsAnim.tsx`) is the
worked reference. If that folder is gone, this skill is still the method.
