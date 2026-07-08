# kaspa-covenants-short — EDIT-PLAN (time-ordered event log)

9:16 vertical TEASER for the longform "Kaspa's Covenants Put It Lightyears Ahead Of Every Other
Crypto". Spine = `spine.mp4` (baked-faces desilenced VO, 24.10s = 723 fr @30fps, 1920x1080, shown
cover-cropped to 1080x1920). Comp = `remotion/src/KaspaCovenantsShort.tsx` (id `KaspaCovenantsShort`).
Render with `--public-dir render-assets`. The render CONFIRMS this plan; it does not discover it.

## Source pipeline (done)
- raw.mkv -> defumbled `raw EDIT.mp4` (55.20s) -> desilenced @200ms `spine-desil.mp4` (24.08s, 13 cuts / 31.2s removed, QA: no swallowed speech)
- 3 faces baked into the desil spine (`bake-faces.py`, xcorr conf 1.00/0.99/1.00, net ~0s) -> `spine.mp4` (24.10s)
- Whisper word-timings on the baked spine -> `_spine.json` -> captions (`render-assets/captions.json`)

## FACE windows (spine shows the lip-synced face; covers MUST clear here)
- 0.00 -> ~2.0   face1 "Kaspa just did something" (clip audio runs to 3.97; only ~2s shown, then cut to tunnel — FACE RULE <=2s)
- 11.48 -> 13.18 face2 "The coin enforces itself" (shown full, 1.70s)
- 22.26 -> 24.10 face3 "Watch the full video for more details" (shown full + end-card logo)

## Time-ordered events (t in final-spine seconds)
| t | layer | event |
|---|---|---|
| 0.00 | spine | FACE1 visible (cover-crop, objectPosition 50%/22%) |
| 0.00 | captions | "KASPA JUST DID SOMETHING" karaoke begins |
| 2.00 | broll vid | **glitch SFX** + cut to `vid-tunnel.mp4` (dissolve) — "Bitcoin has been arguing about for years" |
| 4.14 | broll img | **glitch SFX** + cross-warp to `coin-vert.png` (ken-burns) — "It's called a covenant. A coin that carries its own rules." |
| 7.46 | scene | **glitch SFX** + C3bVert rule list — "Send only here / Locked until later / Royalties you can't skip" |
| 7.46 | C3bVert | reveal rule 1 "Send only here" |
| 8.60 | C3bVert | reveal rule 2 "Locked until later" |
| 9.80 | C3bVert | reveal rule 3 "Royalties you can't skip" |
| 11.48 | spine | **glitch SFX** + FACE2 visible (cover clears) — "The coin enforces itself" |
| 13.18 | scene | **glitch SFX** + C5bVert comparison matrix — "No virtual machine" |
| 13.24 | C5bVert | reveal Ethereum row (Programmable yes / PoW no) |
| 13.70 | C5bVert | reveal Bitcoin row (PoW yes / Programmable no) |
| 14.44 | C5bVert | reveal Kaspa row (both, highlighted) — "Proof of work security and real programmability" |
| 17.52 | C5bVert | Kaspa row pulse — "Nothing else has both" |
| 18.92 | broll img | **glitch SFX** + cross-warp to `ecosystem-vert.png` — "This could put Kaspa light years ahead of every other crypto" |
| 22.26 | spine + endcard | **glitch SFX** + FACE3 visible + Kaspa-logo end card — "Watch the full video for more details" |
| 24.10 | END | hard end (723 fr) |

## Layers / assets (zero orphans — every asset placed above)
- spine.mp4 (baked faces) · vid-tunnel.mp4 · coin-vert.png · ecosystem-vert.png · kaspa-logo.png
- captions.json (arial-black karaoke, KASPA/ROYALTIES corrected) · sfx-glitch.mp3 (7 cuts) · music.mp3 (Race Against Time bed)
- All in `render-assets/`. Containers C3bVert / C5bVert are live React (not images).

## Audio
- VO: from the baked spine (OffthreadVideo plays it). Music bed `music.mp3` (Race Against Time, -13.2 LUFS source) at vol 0.05 (~21 dB under VO), fade in 0.6s / out last 1.1s.
- Glitch SFX `sfx-glitch.mp3` vol 0.55 at the 7 cuts above. QA loudness by ear + short-term vs VO.

## Captions
arial-black UPPERCASE karaoke (AI-persona "Mother-Satori"), yellow active-word box, bottom 470 (9:16 safe band). ON the whole way (script rule for the short).

## Transitions
FACE cut-in / cover changes = **hard cut + glitch SFX** (SCRIPT-sanctioned vertical option; the
Blocks mask engine is authored 16:9). Image b-roll = cross-warp; video b-roll = dissolve.

## OPEN (confirm at QA)
- face1 cover-crop framing (objectPosition 50%/22%) — verify head not clipped on a chunk render.
- glitch SFX density (7 cuts) + music level — tune by ear.
