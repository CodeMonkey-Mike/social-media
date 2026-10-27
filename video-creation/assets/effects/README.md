# assets/effects: the EFFECTS library (devices = motion + sound + graphics, grouped into themes)

Skill (the rules, the tool, how to pick and how to add): **`video-creation/skills/effects-library/effects-library.md`**.
Catalog of record: **`library.json`** here (`devices` + `themes`). Tool: `python video-creation/skills/effects-library/scripts/effects_catalog.py check | report | engines`.

```
library.json                         devices (keyed by id) + themes (keyed by id)
themes/<theme>/CUE-SHEET.md          the time-ordered sound -> visual map of the theme's source video
themes/<theme>/textures/             backgrounds the devices sit on (paper, suede, animated texture)
themes/<theme>/graphics/             the graphics devices need (arrow, subscribe button animation, icons/)
```

Sounds are NOT here: they stay in `../sfx/<set>/` with their catalog rows (a device names them by id).
Motion engines are NOT here: they are Remotion code in `video-creation/remotion/src/effects/<theme>/`.
Placement rules per track: longform-edited `video-creation/longform-edited/skills/overlays/overlays.md` section 2.

Themes:
- `kinetic-text-2023`: Mike's 2023 "Growth Marketer vs Growth Hacker" look (GrowthMarketingMike 004). Sounds in
  `../sfx/kinetic-text/`. Remade on growth-vs-product (signature open + side panels, 2026-10-23) and, in full, on
  `longform-edited/media/inference` (2026-10-25).
- `halloween-2022`: Mike's 2022 "Bear Markets" horror look (CodeMonkey 044, studied 0:00-1:50 only). Pick it for a horror /
  Halloween register. Sounds in `../sfx/halloween-2022/` (woosh9; the other devices were silent). `themes/halloween-2022/`
  also holds `BROLL-BENCH.md` (the reusable b-roll of the source; bears excluded, licence flags). Its alpha plates (blood
  splats, the subscribe MOGRT) are FILL + KEY pairs (`*-fill.mp4` premultiplied colour + `*-key.mp4` alpha as luma).

`_demo/`: one demo clip per device (`kt-*.mp4`, `hw-*.mp4`, with sound) + `gallery.html`; `_demo/pub/` is the minimal
public dir the demos render with (it mirrors these theme paths, the sfx folders, the shake track data and the demo photos).
