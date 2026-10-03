# usage-ledger — variety across videos (music + transitions)

_Mike, 2026-10-01: "I don't want to be in a situation where we're constantly using the same thing over and
over again... make use of basically all our transitions and all of our background music over time."_

**One tool, one data file.** `usage_ledger.py` (this folder) records what every finished video used, tells the
strategists what is fresh before they pick, and gates a plan that repeats the previous video.
The data lives in **`video-creation/assets/usage-ledger.json`**, outside every project folder, because project
folders are deleted after publish. It is the ONLY usage record: the `used_in` fields inside the music and
transition catalogs are frozen legacy notes, nothing writes them any more (the report still counts a legacy
note as "used before").

## Commands
```
python video-creation/skills/usage-ledger/usage_ledger.py report [--what music|transitions|all] [--exclude-project <name>] [--top N] [--json]
python video-creation/skills/usage-ledger/usage_ledger.py check  --project <name|dir> [--what music|transitions|all]
python video-creation/skills/usage-ledger/usage_ledger.py record --project <name|dir> [--date YYYY-MM-DD] [--source graph|backfill]
```
- **report** is what a strategist reads BEFORE picking. Per pool / slot: what the previous video used (BLOCKED),
  what the last three used (avoid), and every candidate ranked `fresh` (never used) first, then least recently used.
- **check** is the gate. `FAIL` = the plan repeats the PREVIOUS video in a rotating pool / slot with no waiver.
  `WARN` = it repeats one of the last three. Machine line: `USAGE-LINT PASS|FAIL what=<w> fails=N warns=N`.
- **record** upserts the video's entry from its `MUSIC-PLAN.json` + `TRANSITION-PLAN.json` (older videos:
  the prefixed ids in `TRANSITIONS.md`). Idempotent; run it again after a plan changes.

## Where it runs in the longform graph (nothing here is by hand)
| Node | What happens |
|---|---|
| `screenplay` | the screenplay-strategist reads `report --what music` before it writes the MUSIC-MOOD-PLAN shortlist |
| `music_plan` | the music-placement-strategist reads the report; the node then runs `check --what music` and FAILS on a repeat |
| `transitions` | the transition-strategist reads the report; the node then runs `check --what transitions` and FAILS on a repeat |
| `stage_longform` | `record` (the video is delivered, so its picks are now "used"), before the previews are recycled |

## The picking rule (every strategist, every video)
1. **Fit comes first.** Never pick a wrong-mood track or a wrong-move transition only because it is unused.
2. Among the options that fit: prefer **`fresh`** (never used), then the **least recently used**.
3. **Never repeat the previous video** in a rotating pool or slot. Avoid what the last three videos used.
4. Variety INSIDE a video stays governed by its own rules (one card move, one melt look, one spin look per
   video; no b-roll asset twice). This ledger is about variety ACROSS videos.

## Music pools (each rotates on its own)
| Pool | What it is | Catalog role it draws from |
|---|---|---|
| `intro_hype` | the track that opens the video (hook) | `intro_hype` |
| `subtle_bed` | gear-2 explainer beds, under teaching VO | `explainer_bed` (the report lists the quietest first) |
| `hype_body` | aggressive mid-video beds | `hype_peak` |
| `epic_close` | the track on the final chapter | `epic_outro` |

A track the previous video used in ANY pool is blocked for the next video ("three different files, then three
other ones"). **The subtle pool is the scarce one** (about 13 tracks under aggression 45, 39 tagged explainer
beds, against 113 hype tracks), so it comes round soonest: when the report shows few `fresh` subtle beds
left, source more (`../music-sourcing/SKILL.md`) instead of loosening the rule.

## Transition slots
| Slot | Rotation | Key that rotates |
|---|---|---|
| `card` (the one title-card move per video) | **GATED** | the move: cube · flip · slide (safe) · book-flip · swap (render-flag risk) |
| `marquee_melt` (diagram reforms) | **GATED** | the look: `MELT/RGB`, `MELT/Equidistant` |
| `marquee_spin` (new facet turns in) | **GATED** | the look: `SPIN/3D Side Ease`, `SPIN/Twirl`, ... (10 looks) |
| `face_cut` (film burn vs the Blocks glitch) | advisory | reported, the per-video pick stays a judgment call |
| `ai_still` (the glitch on AI stills) | advisory | reported |
| `punch_in` · `broll` (dissolve) · `container` (cross-fade + scale-in) · `image_broll` (cross-warp) | **CONSTANT** | house style, Mike's signature, never rotated |

A library look is `CATEGORY/Variant` with the "Short" variants folded in, so `melt-rgb-1`, `melt-rgb-3` and
`melt-rgb-short-2` are all `MELT/RGB`. Rotating looks, not rows, is deliberate: the 853 rows are mostly
direction / length variants of about 130 looks.

**Known limit (Mike's call to change):** with the house-style slots constant, only the GLITCH, MELT, SPIN and
(on receipts) PERSPECTIVE categories are ever drawn from. The report's "library coverage" table shows it. To
use the other categories (OFFSET, SPLIT, ZOOM, MOTION, GLASS, TRANSFORM ...) a slot has to be opened to them.

## Waiver (Mike's explicit call only)
Add a top-level object to the plan and the FAIL becomes a WARN:
```json
"usage_waivers": { "accomplishments-subtle": "Mike 2026-10-01: keep it, it is the series bed" }
```
Keys: a catalog track id (MUSIC-PLAN.json) · a card name or a `CATEGORY/Variant` look (TRANSITION-PLAN.json).
A strategist never writes a waiver on its own; it needs a ruling recorded in the project's PROJECT-LOG.md.

## Backfill
The ledger was seeded on 2026-10-01 from the four projects still on disk (zebec, kaspa 30bps, ethereum-rwa,
kaspa-vprogs). Earlier videos survive only as the catalogs' legacy `used_in` notes. To add an old project that
still has its plans: `record --project <name> --source backfill [--date <delivered>]`.
