# carry-trade — TRANSITIONS plan

_Three-bucket policy (canonical: `../../assets/transitions/README.md` + `longform-edited.md` #5). Glitch ids:
`assets/transitions/library.json`. This video makes full use of the glitch library families added this cycle
(Blocks, Bad Signal, Cinematic Monitor, Invert, Glitch Monitor, Glitch Offset, Glitch VHS, TV Satellite,
Turbulent Displace, Roughly), assigning a DIFFERENT family per asset TYPE rather than one single pick for
everything (Mike, 2026-07-06). Within each assigned family, randomly choose a different variant/intensity
per cut so repeated cuts of the same asset type don't feel identical._

## 1. Chapter / title cards → ONE pick for the whole video

Default pick: **cube** (matches the majority of prior longform-edited videos; `[VERIFY with Mike before
render, not yet explicitly confirmed for this video]`). Cards ON only at CH2-CH6 per the chapter map (CH1
open / PLUG / CH7 close stay OFF), further gated by the music-continuity rule once the music plan's actual
bed-change points are locked (this video is ONE song throughout per the Music plan, chorus → full track, so
re-check whether any card still qualifies as a "new bed" start once that's finalized).

## 2. Per-asset-type glitch family assignment (Mike, 2026-07-06 — supersedes the old single-pick-per-bucket rule for this video)

| Asset type | Family | Pool (randomize per cut) |
|---|---|---|
| **ChatGPT b-roll stills** (10 images, `render-assets/broll/chatgpt/`) | **Glitch · Roughly** | `roughly-1x` … `roughly-7x` (7) |
| **Data charts** (C1-C7, `DATA.md`) | **Glitch · Offset** | `glitchoffset-1x` … `glitchoffset-7x` (7) |
| **CSS presentation containers** (system-design diagrams, deck) | **Glitch · Turbulent Displace** | `turbulent-h-1x`…`5x` + `turbulent-v-1x`…`5x` (10) |
| **Receipts / article screenshots** (BIS Bulletin, CoinDesk, Fortune, etc.) | **Glitch · VHS** | `vhs-max-1/2/3`, `vhs-min-1/2/3`, `vhs-short-1/2/3` (9) |
| **FACE scene cuts** (black→face edges) | **Glitch · Invert** | `invert-max-1/2/3`, `invert-min-1/2/3`, `invert-short-1/2/3` (9) |
| **Mid-face scene punch-ins** (FACE hold >2s, the ~15-20% zoom) | **Glitch · Monitor** | `glitchmonitor-1` … `glitchmonitor-8` (8) |

- **Envato VIDEO b-roll is NOT in this table** — it keeps the standard house rule: plain fade (~0.5s), never a
  glitch cut (glitch is reserved for AI/data/container/receipt/face assets per the three-bucket policy).
- **Randomization rule:** pick pseudo-randomly per cut from the assigned pool so consecutive cuts of the same
  TYPE don't repeat the same variant back to back; log the actual pick per cut in `CUE-SHEET.md`'s TRANSITIONS
  section once real cut timecodes exist.
- **Mid-face punch-ins previously had NO glitch** (just the zoom, per `screenplay.md` Convention 3 / the old
  CUE-SHEET skeleton note "NO glitch"). This video adds **Glitch · Monitor** to that moment too — a deliberate
  change for this video, note it if reusing the old convention elsewhere.

## 3. Reference: what's used where (by chapter, provisional — reconcile once EDIT-PLAN-prep is final)

- CH1: FACE cuts (Invert) · CH1 outflow diagram (Turbulent Displace) · BTC-chart tease (Offset)
- CH2: dual-flow container (Turbulent Displace) · GPIF pie C6 (Offset)
- CH3: two-mechanism container (Turbulent Displace) · FACE cuts (Invert)
- CH4: BoJ-rate chart C1 / BTC chart C3 (Offset) · BIS Bulletin + CoinDesk receipts (VHS) · ChatGPT market-storm/crypto stills (Roughly)
- CH5: USD/JPY C2, Treasury-holdings C4, equity-flow C5 charts (Offset) · Fortune/Japan-Times receipts (VHS) · Tokyo/BOJ ChatGPT stills (Roughly)
- CH6: timeline container (Turbulent Displace) · FACE turn (Invert)
- CH7: crypto-volume pie C7 (Offset) · FACE close + CTA (Invert) · any face hold >2s (Monitor punch-in)

## 4. Face + b-roll + containers → hand-rolled overlays on the spine (house rule #5)

- FACE cut in/out → **Glitch · Invert** (this video's pick, replaces the film-burn/Blocks·Max default) + the
  standard ~15-20% punch-in on face beats >2s, now paired with **Glitch · Monitor** per §2 above.
- Envato VIDEO b-roll → fade (~0.5s). Container/diagram/chart swap → **Glitch · Turbulent Displace** (diagrams)
  or **Glitch · Offset** (charts) replaces the old generic "cross-fade + 0.93→1 scale-in" for this video.
