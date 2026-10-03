# app-users-share: VERTICAL (9:16) animation spec (Type 1 ANIMATED, chart-builder, 2026-10-02)

Portrait twin of `assets/charts/app-users-share-spec.md`. **Content is byte-identical to the 16:9 spec** ('1-2%' under
'ONE ESTIMATE', never '2%' alone; ETHNews source); only the GEOMETRY changes. Design source: `app-users-share.html`
here; `app-users-share-{start,mid,payoff}.png` (1080x1920, scale 1) are the SPEC.
Shared portrait frame: see `cap-vs-volume.vertical.spec.md`. Orbs olive (`#6d8a00` / `#3d4a10`).

## Geometry
- The full-width track becomes a **TALL COLUMN** 300x960 at `left 90, top 560` (bottom edge y 1520), radius 14,
  `#141823`, filling from the bottom. Scale: 960px = all transactions, so **1% = 10px, 2% = 19px** (to scale, as in 16:9).
- Solid lime fill `bottom 0`, height 0 to **10px** (30px glow). Hatched extension on top of it at `bottom 10px`, height 0 to **9px**
  (same 135deg hatch as 16:9).
- Column label "Robinhood Chain transactions" right of the column top: `left 450, top 560, width 540`, DM Sans 700 32px .12em, 2 lines.
- Leader tick: lime 3px horizontal line `(398,1510)` to `(456,1510)`, off the column's right edge level with the sliver.
- Callout `left 470, top 1300, width 520`: the label "from Robinhood app users" (DM Sans 700 34px, 2 lines) sits ABOVE
  the big '1-2%' (JetBrains Mono 600 150px lime), so the number lands level with the sliver it describes.

## Choreography (cues identical to 16:9)
| t (s) | word | what moves |
|---|---|---|
| 401.98 | | `start`: eyebrow, headline, empty column |
| 402.60 | | solid lime sliver grows 0 to 10px = `mid` |
| 403.32 | | hatched extension grows 0 to 9px (1% to 2%), then the tick, '1-2%' and its label fade up = `payoff`; hold to 407.53 |
