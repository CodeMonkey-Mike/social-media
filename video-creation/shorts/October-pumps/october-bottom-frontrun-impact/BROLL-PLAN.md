# BROLL-PLAN — october-bottom-frontrun-impact (variant: impact)

Batch `October-pumps`, clip #7 (stable numbering, clip 5 deleted). Base =
`october-bottom-frontrun-impact-final.mp4` (1080x1920, 25 fps, **27.96 s**, output of raw cut ->
tighten -> desilence -> filler removal; FINAL, not re-cut). Comp runs at 30 fps / **838 frames**
(27.933 s, just inside the clip so there is no black tail frame).

Title: **"Zombie FOMO Will Need A Psychiatrist"**. This is the IMPACT sibling of clip #2
(`october-bottom-frontrun`) — clip 2's payoff section standing alone. It gets its OWN images in its
OWN `render-assets/`; nothing is shared with clip 2 (repo rule: every image is unique).

**Persona guard (clip-plan.json):** the zombies make October GREEN and MISS the real bottom. Nothing
on screen may say they cause an October bottom. No em dashes on screen. CTA reads "Follow me".

**Measured geometry:** the base is ALREADY composited vertical (screen-share top, webcam bottom).
Row-mean gradient scan at t = 0.5 / 3 / 7 / 11 / 15 / 19 / 23 / 27 s puts the hard screen-share /
webcam divider on the same row on all eight frames: **y = 853**. Content-zone b-roll therefore covers
0..853. Caption centre at **y = 890** (below the seam, above Mike's hairline ~y1050, nowhere near his
eyes ~y1400).

## Screen-share content map (frames decoded across the whole clip)

| span | what is on screen |
|---|---|
| **0.00 - 27.96** | the **`Dream Crypto` (@DreamResearchX) YouTube channel page**, static, never scrolled: video tiles `DO IT NOW / Do NOT wait till October to buy Bitcoin - PLEASE`, `LOWER / Michael Saylor's liquidation will send $BTC to $40k`, `4Y CYCLE DEAD / Waiting to buy BTC in October will be your biggest mistake EVER` |

The content zone is **on-message the whole way**: it is literally the four-year-cycle / "don't wait
till October" material this clip is about, i.e. the receipt. There is **no dead window and no
off-message window** to cover, so the base is the default state and b-roll only takes the four beats
it earns. Because the page never moves, the visual variety comes from the b-roll beats + the three
code-drawn badges + Mike's own performance in the face zone.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget", HALVED 2026-07-14)

| metric | value | target |
|---|---|---|
| b-roll covered | **8.98 s / 27.96 s = 32.1 %** | ~30 % (band 25-35 %) OK |
| base showing | **18.98 s = 67.9 %** | ~70 % (band 65-75 %) OK |
| distinct images | **4** (+1 thumbnail background) | output of the budget, ~1 per 7.0 s, avg 2.25 s per beat |
| full-screen beats | **2** (hook zombies / psychiatrist punchline climax) | 1-2 at this length, cap 1-3 FIRM, OK |
| max base gap | 5.20 s (10.70 - 15.90, carried by a badge + the riser build) | deliberate |
| reuse within clip | none, every beat has its own asset | OK |

## Beats

| # | t_in | t_out | dur | mode | spoken line | visual | asset |
|---|---|---|---|---|---|---|---|
| - | 0.00 | 2.54 | 2.54 | **BASE** | "now, what i say that" | open on Mike + the channel page (frame-0 thumb is ONE frame, base from frame 1) | - |
| 1 | 2.54 | 4.94 | 2.40 | **full** | "all these **four year cycle zombies**" (HOOK, "zombies" at 3.30) | a horde of faceless grey zombie silhouettes shambling out of fog down a ruined street toward the viewer, acid neon green sky behind | `broll-obfi-zombies.png` |
| - | 4.94 | 8.46 | 3.52 | **BASE** | "they're going to come back in october and they're going to start buying up and they're going to" | the channel page IS the receipt (the `4Y CYCLE DEAD` / `don't wait till October` tiles) | - |
| 2 | 8.46 | 10.70 | 2.24 | content | "start pushing those **candles green like crazy**" ("green" at 9.38) | extreme low angle up a rain-slick street between skyscraper-sized green candlestick towers erupting into a black sky, tiny faceless silhouettes below | `broll-obfi-candles.png` |
| - | 10.70 | 15.90 | 5.20 | **BASE** | "they're going to be scared. they're going to be overwhelmed with fomo to the point where we're going to probably" | BADGE `TOO LATE` 12.10-14.60; the riser starts here and BUILDS INTO the punchline | - |
| 3 | 15.90 | 18.30 | 2.40 | **full** | "have to schedule an appointment with a **psychiatrist** or something." (CLIMAX / punchline, "psychiatrist" at ~16.62) | dim night clinic: a faceless grey patient on a couch clutching a green-glowing phone, an enormous jagged green line chart climbing the wall behind, faceless therapist silhouette with a clipboard | `broll-obfi-psychiatrist.png` |
| - | 18.30 | 21.46 | 3.16 | **BASE** | "they're going to be overwhelmed with fomo like, oh my god, it's not bottoming out." | BADGE `OCTOBER GOES GREEN` 19.20-21.30 | - |
| 4 | 21.46 | 23.40 | 1.94 | content | "it keeps going up and they're going to buy back in and **push it up even further**" | a colossal glowing green arrow angled steeply upward being shoved higher by a dense crowd of faceless silhouettes, sparks and embers | `broll-obfi-buyback.png` |
| - | 23.40 | 27.96 | 4.56 | **BASE** | "up even further. so that's my whole idea of what's going to happen in october." | the thesis button lands on Mike's face + the receipt page; BADGE `FOLLOW ME` 25.00-27.30 | - |

**Full-screen adjacency (SKILL production rule 4):** the 2 full-screens are 11.0 s apart, so no
full-to-full base flash exists. No two b-roll beats are butt-joined here (every beat is isolated), and
every b-roll-to-base gap is >= 3.16 s, so there is no sub-1.5 s base flash anywhere.

## Frame-0 thumbnail

`thumbnail-obfi.png` = generated background (a psychiatric waiting room at night, a queue of faceless
grey zombie silhouettes under flickering lights all staring at green-glowing phones, a huge rising
green chart line burning through the window behind them; the UPPER HALF is deliberately near-empty
dark space) with the hook title drawn in CODE on top, never baked into the art:

- title `ZOMBIE FOMO WILL / NEED A / PSYCHIATRIST`, chip `OCTOBER GOES GREEN` (neon green).
- ONE frame only (`LivestreamShort` defaults `thumb.durS` to `1/fps`). Base video from frame 1.
- Nothing else may start under it: the earliest badge `tIn` is 12.10 s, the first b-roll beat is 2.54 s.
- No em dashes anywhere on screen.

## Overlays / badges (never collide in time OR space)

Code-drawn badges, all at `top: 300` (content zone) while captions live at `y 890`. Each states
something the captions do NOT, and each sits over a BASE stretch, never over a b-roll beat.

| tIn | tOut | colour | content | sits over |
|---|---|---|---|---|
| 12.10 | 14.60 | teal `#00e5ff` | `TOO LATE` / `THEY BUY THE GREEN, NOT THE BOTTOM` | BASE 10.70-15.90 |
| 19.20 | 21.30 | green `#39ff14` | `OCTOBER` / `GOES GREEN` / `BECAUSE THEY PANIC BUY` | BASE 18.30-21.46 |
| 25.00 | 27.30 | yellow `#ffe600` | `FOLLOW ME` / `FOR THE OCTOBER PLAYBOOK` | BASE 23.40-27.96 |

Time gaps between consecutive badges: 4.60 s and 3.70 s. No two are ever on screen together, none
overlaps a b-roll beat (nearest edge: badge 1 starts 1.40 s after beat 2 ends), and none starts under
the frame-0 thumb. Persona: `TOO LATE / THEY BUY THE GREEN, NOT THE BOTTOM` says the zombies MISS the
bottom, never that they cause one.

## SFX (from `video-creation/assets/sfx/`, all under the VO)

Cue = the file's own measured PEAK/ATTACK landing on the beat, not the file start. Envelopes measured
during THIS build at 0.2 s RMS: `transition_rapid_whoosh` peaks 0.20 s in, `Cinematic Whoosh 02`
0.80 s, `Cinematic Whoosh 06` 0.40 s, `Impact_3` 0.40 s, `Boom - Big Reveal` 0.00 s,
`Soundjay_Impact_Main_01` 0.20 s, `Edgy_Riser` 5.00 s, `TING` 0.80 s, `Cash Register` 0.20 s,
`ding/sudden-shock` 0.20 s, `ding/dramatic-shocked` 1.00 s. Quiet FILES (`Cinematic Whoosh 06`
-24.7 dB, `Cash Register` -25.5 dB RMS vs the impacts) get a higher vol so they stay audible.

| lands at | fires at | file | vol | why |
|---|---|---|---|---|
| 0.20 | 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.46 | frame-0 thumbnail cut |
| 2.54 | 1.74 | `sfx/Cinematic Whoosh 02.wav` | 0.50 | sweeps INTO the HOOK full-screen |
| 3.30 | 2.90 | `sfx/Impacts/Impact_3.wav` | 0.42 | lands on the word "zombies" |
| 4.94 | 4.74 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | cut out of the hook full-screen |
| 8.46 | 8.26 | `sfx/transition_rapid_whoosh.mp3` | 0.40 | into the green-candles cutaway |
| 9.38 | 9.18 | `sfx/Cash Register.mp3` | 0.72 | kaching on "candles green like crazy" |
| 11.34 | 11.14 | `sfx/ding/sudden-shock.mp3` | 0.40 | lands on "they're going to be scared" |
| 10.90-15.90 | 10.90 | `sfx/risers/Edgy_Riser.wav` | 0.26 | **riser BUILDS INTO the psychiatrist punchline** (crest 15.90) |
| 15.90 | 15.50 | `sfx/Cinematic Whoosh 06.wav` | 0.78 | the cut to the CLIMAX full-screen |
| 16.62 | 16.62 | `sfx/Boom - Big Reveal.wav` | 0.52 | **IMPACT on "psychiatrist"**, the biggest hit of the short |
| 18.30 | 18.10 | `sfx/transition_rapid_whoosh.mp3` | 0.38 | cut out of the climax full-screen |
| 19.60 | 18.60 | `sfx/ding/dramatic-shocked-sfxshocked.mp3` | 0.38 | the mock zombie panic "oh my god" |
| 21.46 | 21.26 | `sfx/transition_rapid_whoosh.mp3` | 0.40 | into the buy-back-in cutaway |
| 24.02 | 23.82 | `sfx/Impacts/Soundjay_Impact_Main_01.wav` | 0.44 | lands on "push it up even further" |
| 25.60 | 24.80 | `sfx/TING SOUND EFFECT.mp3` | 0.48 | the thesis button "so that's my whole idea" |

15 events / 9 distinct files. Whoosh on the thumbnail cut and on every b-roll transition, ONE riser
building into the punchline impact, impacts reserved for the three beats that carry the clip
(zombies / psychiatrist / push it up even further).

## Reference-image gate

Named projects/coins spoken in this clip: **none** (Bitcoin appears only inside the base video's
screen-share thumbnails, it is never named in the audio). Live `ls` of
`schedule-tweets/images/reference/` run during THIS build: DogInMe, ElizaOS-ai16z-2, ElizaOS-ai16z,
LAB, bittensor-tao, bobo, carousels, housecoin, kappy, kaspa-logo, kasy, kroak, linea, michael-saylor,
nacho, slippy, toshi, troll, velvet. **No named project in this clip has (or needs) a reference**, so
generic treatment is correct and NO brand mark, ticker letter or coin glyph may be invented.
Gate result: CLEAN.

## Persona constraints baked into every prompt

No real cryptocurrency logos or marks (no Bitcoin symbol, no Ethereum diamond, no letter glyphs on
coins), no coins at all in these four beats, no real-person faces, every crowd/figure is a faceless
silhouette, and no lettering / words / numbers anywhere in the art (all text is code-drawn). Every
generated image is visually inspected before the render.

## Final-render QA (all run on `remotion/out/October-pumps/7-october-bottom-frontrun-impact.mp4`)

- **Gate:** `finalized_short_gate.py` prints **PASS** (17 distinct staticFile refs, thumbnail
  `thumbnail-obfi.png`, 4 b-roll assets, 12 sfx refs, zero missing, zero orphans).
- **Structure/collision check (code):** 4 b-roll beats, 32.1 % coverage, 2 full-screens, 3 badges,
  15 SFX. No badge/badge time overlap, no badge over a b-roll beat, nothing starts before the frame-0
  thumb, no b-roll overlap, and no sub-1.5 s base flash between two beats. PASS.
- **Frame-0 thumbnail is ONE frame:** mean |f1 - f0| = 90.6 grey levels while |f2 - f1| = 2.0 and
  |f3 - f2| = 2.3, i.e. the cover is replaced immediately at frame 1 and the base plays from there.
- **Overlay frame checks:** frames pulled at every b-roll tIn/mid and every badge tIn/mid on the final
  render and visually inspected. No two graphics ever share a region; badges sit at y150-470, captions
  at y840-945, and the closing badge ends at 27.30 s so the final frame carries the caption alone.
- **SFX audibility (aligned subtraction vs the source audio, per-window fine alignment):** control
  residual floor -62.7 dB; all **15 cues measure +23.5 to +49.5 dB over the floor**, i.e. every one is
  actually present and audible under the VO (quietest by design = the riser bed at +23.5 dB).
- **Levels:** integrated **-16.0 LUFS**, true peak **-2.9 dBFS**, max sample 0.714, **zero clipped
  samples**. `blackdetect` finds **no black segment >= 0.1 s**.
- **Whisper-verify (second independent pass on the shipped render):** 0.940 word similarity vs the
  caption text over 110 caption words. The 6 diffs are all Whisper run-to-run garble on this pass
  ("stay in" for "schedule", "their" for "a", a reordered "they're probably going to", and two
  end-of-segment drops of "even further" / "in october" whose speech energy is measured present at
  -16.3 dB and -21.3 dB). Caption onset drift over 102 anchored words: median -0.22 s, p05 -0.98 s,
  p95 -0.04 s, max +0.26 s, and **0 captions appear more than 0.35 s after their word**.
- **Asset reconciliation:** 17 comp `staticFile()` refs, 0 missing on disk, 17 files in render-assets,
  **0 orphans** in either direction. `md5sum` over all 5 pngs: **0 duplicates**.
- **Persona inspection:** all 5 images inspected. No real cryptocurrency logo or mark, no coins at
  all, every figure faceless, no real-person face, no readable lettering (the clinic sign is the
  psychology letter psi, not a brand mark). No remap was needed.
- **On-screen text:** zero em/en dashes and zero hyphens in any title/chip/badge/caption string; no
  `@mikeneder`; the CTA badge reads "FOLLOW ME". Persona guard holds: nothing on screen says the
  zombies cause an October bottom (the badge says they buy the green, NOT the bottom).

## Distinctness from clip #2 (`october-bottom-frontrun`)

Clip 2 is being built in parallel as its own composition with its own `render-assets/`. This clip
generates its own 5 images with its own `-obfi-` filenames and its own visual treatments (street-level
zombie horde, low-angle candle canyon, night clinic couch, crowd-shoved arrow). Zero files, zero
`staticFile()` refs and zero prompts are shared with clip 2.
