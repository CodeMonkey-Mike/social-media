# BROLL-PLAN — kaspa-dip-bought-more (batch october-bottom, clip 2, variant long)

Spine: `kaspa-dip-bought-more-tightened-desilenced.mp4` — 54.959 s, 1080x1920, 25 fps source.
Comp renders at 30 fps (house standard), `durationInFrames = 1648`.
Measured seam (screen-share / webcam divider) = **854 px** (row-gradient scan of frames 1/20/40:
row 853 mean ~245, row 854 mean ~31). Content-mode b-roll covers 0..854.

Editorial angle (delegation #5): **this is a conviction clip.** The dip is framed as OPPORTUNITY in
every visual: glowing accumulation zones, light pouring out of the low, a hand closing on the coin at
the bottom. Never pain/blood/red-crash imagery. Kaspa glow is greenish-cyan teal (#00e5ff), never gold.

## Coverage budget

| | |
|---|---|
| Duration | 54.96 s |
| B-roll beats | 9 (9 distinct images, zero reuse) |
| B-roll seconds | 18.36 s |
| **Coverage** | **33.4 %** (target ~30 %, band 25-35 %) |
| Base-showing | 66.6 % |
| Full-screen beats | 3 (hook / dip-buy climax / close) — cap is 3, FIRM |
| Longest base gap | 7.35 s (20.10 -> 27.45, Mike speculating on BTC 40k/50k over the screen-share) |

Beat count is at the upper end for a 55 s clip because the screen-share behind 15-45 s is an X feed
about a different token (off-message for this clip), so the four mid-clip content-zone cutaways earn
their place. Coverage is still inside the halved band and every beat has its OWN asset.

## Beats

| # | tIn - tOut | mode | spoken line | visual | file | reference |
|---|---|---|---|---|---|---|
| 1 | 2.10 - 4.30 | **full** | "holy crap. i tell you, it's weird right now" | Kaspa hero coin spotlight, backwards-K teal emblem, greenish-cyan nebula | `broll-kdbm-hook.png` | **kaspa-logo.png** (single-coin spotlight) |
| 2 | 8.75 - 10.70 | content | "dip below 2.6 / it was like 2.59 cents" | teal candles, one long wick stabbing into a glowing cyan accumulation band | `broll-kdbm-dip259.png` | - |
| 3 | 12.95 - 15.05 | **full** | "and that's when i bought some more" (CLIMAX) | a hand closing on a glowing teal Kaspa coin at the bottom of a candle canyon | `broll-kdbm-buymore.png` | Kaspa named explicitly |
| 4 | 18.15 - 20.10 | content | "bitcoin only at 62k and then kaspa going below 2.6 cents" | two abstract price lanes: orange lane holding high, teal lane dipping into a glowing pool | `broll-kdbm-62k.png` | - (no real BTC mark) |
| 5 | 27.45 - 29.35 | content | "cause bitcoin has itself has been very resilient" | amber-lit stone monolith unmoved in a dark lightning storm | `broll-kdbm-resilient.png` | - |
| 6 | 33.45 - 35.40 | content | "because of michael saylor, and he dumped a hundred million dollars worth" | faceless suited silhouette pouring a torrent of BLANK generic coins onto a dark floor | `broll-kdbm-supply.png` | - (no face, no real mark) |
| 7 | 39.35 - 41.30 | content | "below 2 cents? like 1.1, you know, 1.8 cents" | glowing teal stairs descending into a bright cyan pool of light at the bottom | `broll-kdbm-deeper.png` | - |
| 8 | 44.45 - 46.40 | content | "now i see it's within reach ... well it's an opportunity" | dark vault door standing OPEN at the canyon floor, cyan light and teal coins pouring out | `broll-kdbm-reach.png` | - |
| 9 | 52.55 - 55.10 | **full** | "kaspa is going to be flying. same thing with tao." | teal Kaspa coin + amber TAO (Greek tau) coin streaking up through a starfield | `broll-kdbm-close.png` | **bittensor-tao.png** (TAO mark) |

(Beat 9's `tOut` runs 0.18 s past the comp end on purpose so the closing image does not fade out on
the last frames. Measured on the built comp: 9 beats, 18.32 s / 54.92 s = **33.4 %** coverage,
66.6 % base, longest base gap 7.35 s, 3 full-screens, zero overlapping beats.)

Frame-0 cover background: `thumb-kdbm.png` (giant teal Kaspa coin at the floor of a dark chart
canyon, light exploding upward). Title + chip stay CODE-drawn on top, never baked into the art.

Alpha overlay (required for a same-topic batch: clip 7 `kaspa-dip-impact` covers the same moment, so
this clip gets its own unique overlay art): `overlay-kdbm-coin.png` — glow-on-black Kaspa coin
converted to true alpha. The first pass (`alpha = min(255, lum*1.8)`, threshold 12) left a milky
halo where the soft glow sat over the BRIGHT white screen-share, so the curve was steepened to
`0 if a < 70 else min(255, (a-70)*2.6)` and re-cropped: coin body fully opaque, halo gone. Floated
over the content zone at
**36.00 - 38.00** ("and then what happens to Kaspa? does it go down?"), left 300 / top 170 / width 480,
`blend: 'normal'`. Sits in a base gap, so it adds no b-roll coverage.

## Reference-image gate (checked LIVE against `schedule-tweets/images/reference/`, 2026-08-04)

Named projects in this clip: **Kaspa**, **TAO (Bittensor)**, Bitcoin (mentioned as context).
- `kaspa-logo.png` EXISTS -> beat 1 generated WITH it (single-coin spotlight only, per batch rule);
  beats 3, 9 and the cover name Kaspa explicitly in the prompt (ChatGPT renders the backwards-K teal
  mark correctly when named) and are persona-inspected.
- `bittensor-tao.png` EXISTS -> beat 9 (the only TAO beat) generated WITH it so the tau letterform is
  the real mark.
- Bitcoin: NO reference used and no B mark allowed — beats 4/5 use abstract orange/amber forms only.

## SFX (from `video-creation/assets/sfx/`)

| t | cue | file | vol |
|---|---|---|---|
| 0.00 | thumbnail cut -> video | `sfx/Cinematic Whoosh 02.wav` | 0.30 |
| 2.05 | into hook full-screen | `sfx/transition_rapid_whoosh.mp3` | 0.26 |
| 8.72 | into the 2.59c dip cutaway | `sfx/Cinematic Whoosh 06.wav` | 0.22 |
| 11.95 | riser building into the dip-buy reveal | `sfx/Riser Sound Effect.mp3` | 0.20 |
| 12.95 | dip-buy reveal impact (climax) | `sfx/Boom - Big Reveal.wav` | 0.22 |
| 13.98 | "bought some more" money hit | `sfx/Cash Register.mp3` | 0.16 |
| 18.12 | into the 62k lane cutaway | `sfx/Cinematic Whoosh 02.wav` | 0.20 |
| 33.42 | into the supply-dump cutaway | `sfx/transition_rapid_whoosh.mp3` | 0.20 |
| 39.32 | into the deeper-dip cutaway | `sfx/Cinematic Whoosh 06.wav` | 0.20 |
| 44.42 | opportunity ding | `sfx/TING SOUND EFFECT.mp3` | 0.18 |
| 52.40 | into the close full-screen | `sfx/Cinematic Whoosh 02.wav` | 0.24 |
| 52.55 | close impact | `sfx/Impacts/Impact_Hit_01-1.wav` | 0.16 |

12 events / 8 distinct files. Volumes are deliberately low; the final MIX is whisper-verified and any
cue that degrades a line gets swept down (SKILL QA rule).

## Overlay collision map (time AND space)

| overlay | window | band |
|---|---|---|
| frame-0 thumb | 0.000 - 0.033 (ONE frame) | full frame (nothing else may start under it; watermark exempt) |
| kaspa watermark | whole clip | top-left 26,26 - 236,236 |
| badge "2.59c" | 9.30 - 10.60 | centered, top 300 |
| badge "BOUGHT MORE" | 13.35 - 14.90 | centered, top 300 |
| badge "62K" | 18.30 - 19.90 | centered, top 300 |
| alpha coin overlay | 36.00 - 38.00 | left 300 - 780, top 170 - 650 |
| captions | whole clip | centered on y = 950 (below the 854 seam, above the eyes) |

No two graphics share a window, and the only pair that could share the top band (badges) is fully
disjoint in time. Captions live below the seam so no b-roll image ever sits on them.
