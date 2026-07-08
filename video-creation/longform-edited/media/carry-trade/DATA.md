# carry-trade: DATA.md (chart-source index)

> Per `../../skills/charts.md`: every number on screen is either CODE-animated from a verified figure, or
> a real screencap, NEVER an AI image standing in for a number. All chart data below comes from press
> coverage gathered this session (see SCREENPLAY.md "Facts + receipts"), re-`[VERIFY]` at render, figures
> drift fast on this topic. Build mode for all charts below: **code** (Remotion, `useCurrentFrame` growth),
> so numbers stay pixel-accurate and restyle-able to the video's palette.

> **BUILD STATUS (2026-07-06):** all 7 charts authored as SELF-CONTAINED CARDS (charts.md §5 standardized
> structure, NOT deck-slide crops — Mike's correction): HTML sources + approved-PNG proofs in
> `assets/charts/CH#_C#_topic.{html,png}`; static proofs staged in `render-assets/charts/image/`;
> animated Remotion renders will land in `render-assets/charts/video/` (one silent mp4 per chart) at the
> animation stage. File map: C1→`CH4_C1_boj-rate-history` · C2→`CH4_C2_usdjpy-interventions` ·
> C3→`CH4_C3_btc-aug2024` · C4→`CH5_C4_treasury-holdings` · C5→`CH5_C5_equity-flow-reversal` ·
> C6→`CH2_C6_gpif-allocation` · C7→`CH7_C7_jp-crypto-volume`.
> ⚠ Current proofs are SCHEMATIC (labels carry the verified numbers; line/bar geometry is approximate and
> each card discloses this in its source line). Before the animation stage, pull real series per charts.md
> §4 where available (BoJ rate dates are exact already; USD/JPY + BTC need real series; C4/C5 bars need
> real quarterly/monthly values or must stay explicitly illustrative).

## C1 — BoJ policy rate history, 2007-2026 (line chart)
**Type:** line, single series, time on X. **Used in:** CH4 Beat 2 (the July 2024 hike), CH5 Beat 3 (the
2026 hikes continuing past it). Same chart reused/extended across both chapters, camera holds then
pushes right as the timeline advances.
**Data points (`[VERIFY]` all before render):**
- ~2008-2016: near-zero, dipping negative (2016 NIRP).
- 2024-07-31: hike to 0.25% ("biggest since 2007").
- 2026-06-16: hike to 1% ("highest since 1995").
**Spotlight moment:** the line stays flat-to-negative for a decade+, then two sharp steps up, 2024 and
2026, labeled directly on the line.

## C2 — USD/JPY exchange rate with intervention markers (line chart, annotated)
**Type:** line, single series, time on X, with callout markers at intervention dates.
**Used in:** CH1 Beat 3 (tease), CH4 Beat 3 (2024 window), CH5 Beat 3 (2026 window, the ~40yr low).
**Data points (`[VERIFY]`):**
- 2024 window: BoJ spent ¥9.8T (Apr-May) + ¥5.5T (July) defending ~¥160.
- 2026: yen breached ~¥162/$ June 30 2026 (~40yr low, 4th consecutive quarterly loss); ~$72.5B FX
  intervention late April-May 2026.
**Note:** reconcile the 2024 figures (¥ trillions) and 2026 figure (US$ billions) to ONE unit before
putting both on the same chart, or show as two clearly-labeled call-outs rather than one continuous unit.

## C3 — Bitcoin price, Aug 2-5 2024 (line/candlestick)
**Type:** line or candlestick, short window (72-96hr), sharp drop highlighted.
**Used in:** CH4 Beat 4 (the receipt).
**Data points (`[VERIFY]`):** ~$64,000 → sub-$50,000 in ~48hrs (BIS Bulletin 90 / CoinDesk). Optional
overlay: yen-denominated BTC price falling MORE than the dollar-denominated line in the same window (the
"fingerprint" detail from CH4 Beat 4), if a clean yen-BTC series can be sourced for render.

## C4 — Japan's US Treasury holdings by quarter, with the Q1 2026 outflow (bar chart)
**Type:** bar, quarterly, one bar flagged red/falling for the drawdown quarter.
**Used in:** CH1 Beat 3, CH5 Beat 2.
**Data points (`[VERIFY]`):** ~$1.239T holdings (Feb 2026, largest foreign holder, of a record $9.49T
total foreign UST holdings). Q1 2026: ~$29.6B sold of US govt/agency/muni securities.
**Note:** label clearly as a FLOW (one quarter's sale) against the STOCK (total holdings) so the chapter
never implies the whole position is leaving, per the honesty box.

## C5 — Japanese equity-fund flows, Jan-May 2026 reversal (bar chart)
**Type:** bar, monthly, Jan through May 2026, sign flip visually obvious (green inflow bars → one or two
red outflow bars).
**Used in:** CH5 Beat 2b (new equities-channel beat).
**Data points (`[VERIFY]`, source not top-tier, corroborate before air):** Jan 2026 still net inflow to
foreign equity funds (no reversal). May 2026: ~$16.98B net outflow from overseas equities.

## C6 — GPIF portfolio allocation (pie / donut chart)
**Type:** pie or donut, 4 slices.
**Used in:** CH2 Beat 2 (the "quarter of the pie is foreign stocks" moment).
**Data points (`[VERIFY]`):** ~25% domestic equities / ~25% international equities / ~25% domestic bonds /
~25% international bonds (target allocation since April 2020; actual foreign-equity slice measured at
25.34% in Q3 FY2026). Good candidate for a clean, simple 4-way donut, the "quarter" framing does the
rhetorical work.

## C7 — Japanese crypto trading volume by coin (pie / bar chart)
**Type:** pie or horizontal bar, small number of slices.
**Used in:** CH7 Beat 1 (the good-news beat: retail crypto tailwind).
**Data points (`[VERIFY]`):** BTC ~45-50% of Japanese crypto trading volume, ETH ~20-25%, remainder split
across other coins (Bitget Academy). Keep it simple, 2-3 labeled slices (BTC / ETH / other) rather than a
long tail.

---

## D-CYCLE — cycle-thesis timeline card (CH6 Beat 7, added 2026-07-06)
**Type:** labels-only thesis roadmap (NOT a data chart — no numeric series; Mike's spoken thesis visualized).
**File:** `assets/charts/CH6_DCYCLE_cycle-thesis.{html,png}`, staged in `render-assets/charts/image/`.
**Content:** NOW (AI expansion) → no-Oct-low (crowd buys back) → 2027 cycle top (could run longer) → multiple
new ATHs?. Hedging language baked into the card ("could", "?", "we shall see"). No `[VERIFY]` numbers.

## Open items
1. All figures above need a live `[VERIFY]` pass close to record day; several (USD/JPY level, Treasury
   holdings, equity-fund flows) move week to week.
2. C2 and C4 both mix units/timeframes (¥ trillions vs US$, stock vs flow), decide the on-screen framing
   before building so the chart can't be misread as overclaiming.
3. Build order recommendation: C1 and C6 are the simplest (a rate line, a 4-way pie) and good candidates
   to build first as a quality check before committing to the rest, per the `Kaspa founder` project's
   precedent (build the hero chart first, judge quality, then batch the remainder).
4. None of these charts are locked into a BROLL-PLAN or comp yet, that's downstream of Mike approving the
   screenplay spine.
