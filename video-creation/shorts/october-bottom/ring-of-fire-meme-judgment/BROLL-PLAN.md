# BROLL-PLAN — ring-of-fire-meme-judgment (batch october-bottom, clip 4, variant long)

Spine: `ring-of-fire-meme-judgment-tightened-desilenced.mp4` — 48.84 s, 1080x1920, **native 25 fps**.
Comp renders at **25 fps** (1:1 frame mapping with the source, same choice as siblings 2 and 3),
`durationInFrames = 1221`. The render copy in the shared batch `render-assets/` is the same spine
re-encoded with a 1 s GOP (`-g 25 -keyint_min 25 -bf 0 -sc_threshold 0`) so OffthreadVideo seeks land
on a keyframe; the canonical spine was NOT touched.

Measured seam (screen-share / webcam divider) = **854 px** (row-gradient scan of frames 1/12/25/40:
row 853 mean ~220-231, row 854 mean ~27-34). Content-mode b-roll covers 0..854; captions at y=950.

## Editorial gates (batch delegation, 2026-08-04)

1. **No music, no Johnny Cash, ever.** The Ring of Fire singalong was cut out of this spine at Mike's
   order (tighten log: relock seg1 `new_end` 1342.82 removes ~26.9 s of licensed music + singing).
   There is ZERO licensed audio in the clip and **nothing visual may reference it** — no flames, no
   fire rings, no guitars, no Cash imagery. The peak is the LINE: *"500k market cap and it only goes
   down, down, down"*, and the comedy leans on the **falling-chart** bit.
2. **The mocked meme coin is never named and never branded.** Every generated coin in this clip is a
   BLANK, featureless, symbol-free coin. No invented logo, no invented ticker, no name on screen
   (no-project-disparage rule). Observation for the orchestrator, not actioned here: the clip's own
   screen-share (the base video, upper zone) is the live DexScreener page of the coin, so the base
   footage does show its real name/market cap. Covering that is a picture-edit/strategy decision far
   outside a b-roll budget, so it is left exactly as recorded and flagged.
3. **Receipts must be REAL.** `schedule-tweets/images/reference/velvet.png` and `LAB.png` both exist,
   so the "58x on Velvet" and "350x on LAB" beats are generated WITH those references (below).

## Coverage budget

| | |
|---|---|
| Duration | 48.84 s |
| B-roll beats | 7 (7 distinct images, zero reuse) |
| B-roll seconds | 15.74 s |
| **Coverage** | **32.2 %** (target ~30 %, band 25-35 %) |
| Base-showing | 67.8 % |
| Full-screen beats | 3 (hook / down-down-down climax / close) — cap is 3, FIRM |
| Longest base gap | 8.20 s (11.35 -> 19.55) |

The 8.2 s gap is DELIBERATE and is the best footage in the clip: Mike is pointing at the live
DexScreener chart that has bled down and to the right for three months while he says "what the hell
is it doing? it's doing nothing. it's crap." The screen-share IS the joke there, so it stays visible.
It is broken up by two code-drawn graphics that cost no b-roll coverage: the alpha coin overlay
(12.60-14.60) and the `500K MCAP` badge (17.60-19.45).

## Beats

| # | tIn - tOut | mode | spoken line | visual | file | reference |
|---|---|---|---|---|---|---|
| 1 | 0.90 - 2.90 | **full** | "how do you make judgments off of coins these days?" | giant stone gavel over a table strewn with BLANK coins, cold shaft of light | `broll-rof-hook.png` | - |
| 2 | 9.55 - 11.35 | content | "cost like a hundred grand and get on MEXC" | banknote stacks pushed into the slot of a huge featureless listing machine, unreadable ticker board behind | `broll-rof-listing.png` | - (no MEXC mark on disk; never invent one) |
| 3 | 19.55 - 22.60 | **full** | CLIMAX "500k market cap ... it only goes down, down, down" | a BLANK coin tumbling down an endless descending staircase of red candles into black fog | `broll-rof-downdown.png` | - |
| 4 | 29.75 - 31.95 | content | "great coins when it comes to utility coins" | machine room where BLANK coins are the gears/flywheels driving a turbine, cyan energy | `broll-rof-utility.png` | - |
| 5 | 35.90 - 37.80 | content | "the 58x on velvet" | the real Velvet mark on a coin riding a green ascending chart, violet light | `broll-rof-velvet58x.png` | **velvet.png** (MANDATORY) |
| 6 | 37.80 - 39.90 | content | "and then the month before that, 350x on lab" | the real LAB flask mark bursting up a column of green light out of a dark lab floor | `broll-rof-lab350x.png` | **LAB.png** (MANDATORY) |
| 7 | 46.40 - 49.10 | **full** | "this has been out for a couple of months and it looks like crap" | cracked, corroded BLANK coin half-buried in dust and cobwebs, faint flatline glowing on the wall | `broll-rof-close.png` | - |

Beats 5 and 6 are **butted** (37.80 = 37.80) so `BrollLayer` hard-cuts receipt-to-receipt instead of
flashing 0.2 s of base between them. Beat 7's `tOut` runs 0.26 s past the comp end on purpose so the
closing image does not fade out on the last frames. Beat 3 covers the tightener's biggest join (the
27 s singalong excision, 22.06-22.46) so the picture does not jump on the cut.

Frame-0 cover background: `thumb-rof.png` (a giant BLANK coin sinking into a canyon of falling red
candles). Title + chip stay CODE-drawn on top, never baked into the art.

Alpha overlay (the per-clip unique transparent PNG, required alongside code-drawn badges):
`overlay-rof-coin.png` — a glowing BLANK coin with a red down-arrow, generated glow-on-black and
converted to true alpha (`alpha = 0 if lum < 70 else min(255, (lum-70)*2.6)`), floated over the
content zone at **12.60 - 14.60** ("it's doing nothing. it's crap.") at left 300 / top 170 / width
460, `blend: 'normal'`. It sits inside a BASE gap, so it costs no b-roll coverage.

## Reference-image gate (checked LIVE against `schedule-tweets/images/reference/`, 2026-08-04)

Named entities in this clip: **Velvet**, **LAB**, **MEXC** (exchange), and the unnamed meme coin.
- `velvet.png` EXISTS -> beat 5 generated WITH it (violet VV mark + wordmark, reproduced as-is).
- `LAB.png` EXISTS -> beat 6 generated WITH it (neon-green flask mark + wordmark, reproduced as-is).
- MEXC: **no reference on disk** -> beat 2 uses an abstract listing machine with an illegible ticker
  board. No invented exchange logo (SKILL rule 4: never let the model invent a fake mark).
- The mocked meme coin: deliberately NO branding at all, per the delegation.

## SFX (from `video-creation/assets/sfx/`)

| t | cue | file | vol |
|---|---|---|---|
| 0.00 | frame-0 cover cut into the video | `transition_rapid_whoosh.mp3` | 0.26 |
| 0.80 | into the hook full-screen | `Cinematic Whoosh 02.wav` | 0.22 |
| 2.85 | off the hook, back to the screen-share | `Cinematic Whoosh 06.wav` | 0.20 |
| 9.45 | into the listing cutaway | `transition_rapid_whoosh.mp3` | 0.28 |
| 10.00 | "a hundred grand" money hit | `Cash Register.mp3` | 0.22 |
| 13.24 | sting on "it's crap" (alpha coin is up) | `ding/sudden-shock.mp3` | 0.16 |
| 17.55 | riser building into the climax | `risers/Tension_Rise_Logo_Reveal_2.wav` | 0.15 |
| 19.55 | IMPACT on the falling-chart full-screen | `Impacts/Impact_Hit_01-2.wav` | 0.28 |
| 20.74 | descending hit on "down" #1 | `Impacts/Impact_Hit_01-1.wav` | 0.12 |
| 21.32 | descending hit on "down" #2 | `Impacts/Impact_Hit_01-3.wav` | 0.13 |
| 21.66 | descending hit on "down" #3 | `Impacts/Kick_Impact_01.wav` | 0.14 |
| 22.55 | off the climax | `Cinematic Whoosh 02.wav` | 0.20 |
| 29.65 | into the utility-coins cutaway | `transition_rapid_whoosh.mp3` | 0.26 |
| 35.80 | into the Velvet receipt | `Cinematic Whoosh 06.wav` | 0.24 |
| 36.40 | ding on "58x" | `TING SOUND EFFECT.mp3` | 0.24 |
| 38.86 | ding on "350x" | `DING.mp3` | 0.22 |
| 46.30 | into the closing full-screen | `Cinematic Whoosh 02.wav` | 0.24 |
| 48.02 | soft impact on "looks like crap" | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` | 0.16 |

18 events / 10 distinct files. The three "down" hits are deliberately the quietest cues in the clip
because they land ON the payoff words; the final MIX is whisper-verified and any cue that degrades a
line gets swept down (SKILL QA rule), never the payoff line re-cut.

## Overlay collision map (time AND space)

| overlay | window | band |
|---|---|---|
| frame-0 thumb | 0.000 - 0.040 (ONE frame) | full frame (nothing else may start under it) |
| alpha coin overlay | 12.60 - 14.60 | left 300 - 760, top 170 - 630 |
| badge `$100K` | 9.90 - 11.30 | centered, top 300 |
| badge `500K MCAP` | 17.60 - 19.45 | centered, top 300 |
| badge `58X` | 36.10 - 37.70 | centered, top 300 |
| badge `350X` | 38.20 - 39.80 | centered, top 300 |
| captions | whole clip | centered on y = 950 (below the 854 seam, above his eyes ~1150+) |

No two graphics share a time window. All four badges live in the same top-300 band and are strictly
disjoint in time (11.30 < 17.60, 19.45 < 36.10, 37.70 < 38.20, 39.80 < end). The alpha overlay shares
that band spatially but never in time (14.60 < 17.60, and 11.30 < 12.60). Nothing starts under the
frame-0 thumb (earliest graphic = 9.90 s). No watermark on this clip: it names no project of Mike's,
and the sibling long clips in this batch ship without one too.
