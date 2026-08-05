# BROLL-PLAN — kaspa-dip-impact (batch october-bottom, clip 7, variant IMPACT)

Title: **OMG: Kaspa Dipped Under 2.6 Cents 😱**

Spine: `kaspa-dip-impact-tightened-desilenced.mp4` — 13.36 s, 1080x1920, **25 fps NATIVE**.
Comp runs at 25 fps (1:1 frame mapping, no 25->30 judder), `durationInFrames = 334`.
Staged into the SHARED batch public dir as `render-assets/kaspa-dip-impact.mp4`, re-encoded with a
1 s GOP (`-g 25 -keyint_min 25 -bf 0 -sc_threshold 0`) so every OffthreadVideo seek lands on a
keyframe. The canonical spine in this folder is untouched.

Measured seam (screen-share / webcam divider) = **854 px** — row-gradient scan of frames 1/60/150/250:
row 853 mean ~242, row 854 mean ~37, step ~205 on every frame. Content-mode b-roll covers 0..854,
captions sit at y=950 (below the seam, above the eyes).

## What the BASE actually shows (why the budget is small)

| span | screen-share | verdict |
|---|---|---|
| 0.00 - 6.76 | CoinMarketCap watchlist, **the KAS row reads $0.02617 and the TAO row $192.56** | ON-MESSAGE receipt — show it |
| 6.76 - 13.36 | X feed about COOPER (the Robinhood dog — clip 5's topic) | off-message — earns cutaways |

6.76 s is the measured splice between the clip's two source segments (ffmpeg scene score 0.383 on the
content zone). It falls in the silence between "more." (6.74) and "Yeah" (7.00), so it is audio-clean;
b-roll beat 2 covers it in the content zone so the screen-share swap never jumps on camera.

## Coverage budget (IMPACT-scaled)

| | |
|---|---|
| Duration | 13.36 s |
| B-roll beats | 3 (3 distinct images, zero reuse) |
| B-roll seconds (in-comp) | 4.39 s |
| **Coverage** | **32.9 %** (target ~30 %, band 25-35 %) |
| Base-showing | 67.1 % |
| Full-screen beats | **1**, at the hook (batch cap for an impact cut) |
| Longest base gap | 4.97 s (6.98 -> 11.95) — carried by the alpha overlay at 7.55 and the face |

## Beats

| # | tIn - tOut | mode | spoken line | visual | file | reference |
|---|---|---|---|---|---|---|
| - | 0.00 - 1.40 | **base** | "kaspa today dip" | CMC watchlist, KAS row on screen | - | - |
| 1 | 1.40 - 2.80 | **full** | "below 2.6 cents" (HOOK) | single Kaspa coin resting on a deep ocean-trench floor, blasting greenish-cyan light up through the dark water, faint sunbeams far above | `broll-kdi-hook.png` | **kaspa-logo.png** (single-coin spotlight) |
| - | 2.80 - 5.40 | **base** | "it was like 2.59 cents" | CMC watchlist again + the `2.59¢` badge | - | - |
| 2 | 5.40 - 6.98 | content | "that's when i bought some more" (CLIMAX) | a tower of blank glowing teal coins growing as more coins drop in and burst into cyan rings | `broll-kdi-buymore.png` | - (blank generic coins) |
| - | 6.98 - 11.95 | **base** | "yeah wow, this gives an opportunity to buy more / i know in the long run you got conviction, right?" | face + X feed; alpha up-arrow overlay floats in at 7.55 | - | - |
| 3 | 11.95 - 13.50 | content | "kaspa is going to be flying, same thing with tao" (CLOSE) | teal Kaspa coin + amber TAO coin climbing side by side on twin light beams above a dawn cloud layer | `broll-kdi-close.png` | **bittensor-tao.png** (real tau mark) |

Beat 3's `tOut` (13.50) runs past the 13.36 s comp end on purpose so the closing image does not fade
out on the last frames; in-comp it contributes 1.41 s.

Content-mode images are center-cropped to 1080x854 (objectFit cover), so beats 2 and 3 are prompted
with the subject dead-centre and generous empty space above/below.

Frame-0 cover background: `thumb-kdi.png` — the same coin PLUNGING through a dark storm on a
greenish-cyan comet trail (the shock half of the story; beat 1 is where it lands). Title + chip stay
CODE-drawn on top, never baked into the art.

## Same-topic de-duplication (clip 2 `kaspa-dip-bought-more` covers the same moment)

Hard rule: no shared b-roll/overlay art between two shorts cut from one topic. Clip 2 already used a
hero-coin nebula, candles-with-a-wick, a hand closing on a coin at a canyon floor, price lanes, a
monolith, a silhouette pouring coins, descending stairs, an open vault door, and two coins streaking
through a **starfield**, plus a coin-at-the-canyon-floor thumb and an alpha **coin** overlay.
Clip 7 therefore uses none of those: an **ocean trench**, a **coin tower**, a **dawn cloud layer**, a
**plunging comet-trail** cover, and an alpha **up-arrow**. Every file is new, nothing is reused
within this clip either.

## Reference-image gate (checked LIVE against `schedule-tweets/images/reference/`, 2026-08-04)

Named projects in this clip: **Kaspa**, **TAO (Bittensor)**.
- `kaspa-logo.png` EXISTS -> the frame-0 cover and beat 1 (the single-coin spotlight) are generated
  WITH it, so the real Kaspa mark carries the short.
- `bittensor-tao.png` EXISTS -> beat 3 (the only TAO beat, the closing words) is generated WITH it so
  the tau letterform is the real mark.
- Beat 2's coins are deliberately BLANK/generic (no invented mark), and Kaspa's glow is greenish-cyan
  teal `#00e5ff` everywhere, never gold.

## Editorial frame

Conviction clip: **the dip is a gift, never pain.** No blood-red crash imagery, no liquidation
carnage. The plunge in the cover resolves into light at the bottom (beat 1), the buy is an
accumulating tower (beat 2), and the close climbs into dawn (beat 3).

## SFX (from `video-creation/assets/sfx/`, copies already staged in the batch render-assets)

| t | cue | file | vol |
|---|---|---|---|
| 0.00 | thumbnail cut -> video | `sfx/Cinematic Whoosh 02.wav` | 0.30 |
| 1.32 | into the hook full-screen | `sfx/transition_rapid_whoosh.mp3` | 0.24 |
| 4.60 | riser building into the buy reveal | `sfx/Riser Sound Effect.mp3` | 0.13 |
| 5.36 | buy-the-dip reveal impact (CLIMAX) | `sfx/Boom - Big Reveal.wav` | 0.18 |
| 6.80 | money hit, in the silence after "more." | `sfx/Cash Register.mp3` | 0.16 |
| 7.42 | opportunity ding + alpha overlay pop | `sfx/TING SOUND EFFECT.mp3` | 0.15 |
| 11.82 | whoosh into the close cutaway | `sfx/Cinematic Whoosh 06.wav` | 0.22 |
| 11.95 | close impact | `sfx/Impacts/Impact_Hit_01-1.wav` | 0.15 |

8 events / 7 distinct files (minimum is 2). Volumes are deliberately low; the FINAL MIX is
whisper-verified and any cue that degrades its line gets swept down (SKILL QA rule).

## Overlay collision map (time AND space)

| overlay | window | band |
|---|---|---|
| frame-0 thumb | 0.000 - 0.040 (ONE frame) | full frame — nothing else may start under it (watermark exempt) |
| kaspa watermark | whole clip | top-left 26,26 - 158,158 |
| badge `2.59¢ / THE DIP` | 3.85 - 5.30 | centred, top 300 |
| badge `BOUGHT MORE / RIGHT AT THE LOW` | 5.70 - 6.90 | centred, top 300 |
| alpha up-arrow overlay | 7.55 - 8.95 | left 320-760, top 200-640 |
| captions | whole clip | centred on y = 950 (below the 854 seam, above the eyes) |

No two graphics share a time window; the only pair that could share the top-300 band (the two badges)
is disjoint in time by 0.40 s. The overlay starts 0.65 s after the last badge ends and sits below the
watermark band. Captions live below the seam, so no content-zone image ever lands on them.

## Caption gates (verified against THIS clip's own `whisper-words.json`)

- `Casper` (x2, 0.00 and 11.34) -> **Kaspa** — `CORRECTIONS` in `skills/captions/build_captions.py`.
- `tau` (13.14, the last word) -> **TAO** — same table, standard gate.
- `this guy's an opportunity` (7.58) -> **`this gives an opportunity`** — this clip's own word pass
  has the identical `guy's` garble; clip 2's builder resolved it across FIVE 1x passes and persisted
  the keyed rule `("this","guys","an") -> ("this","gives","an")` in `build_captions.py`. Applied.
- Numbers arrive split (`2` + `.6`, `2` + `.59`) and are merged by the decimal-continuation rule ->
  `2.6` / `2.59`. No em dashes anywhere on screen.
