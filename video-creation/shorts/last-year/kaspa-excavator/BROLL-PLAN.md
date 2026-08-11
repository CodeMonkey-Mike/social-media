# BROLL-PLAN - `kaspa-excavator` (batch `last-year`, clip #4, variant `full`)

**Title:** Kaspa's going down  _(Mike's verbatim 4b retitle, `clip-plan.json` -> `four_b_verdicts.retitles["4"]`;
lowercase "going down" is deliberate and is used byte-for-byte.)_
**Spine:** `kaspa-excavator-final.mp4` -> staged GOP-safe as `render-assets/kaspa-excavator.mp4`
(67.060 s, 1080x1920, 25 fps source; the comp runs at 30 fps and `OffthreadVideo` resamples by TIME,
so every cue below is plain clip-relative seconds taken off the clip's OWN Whisper words).
**Measured seam:** row **853** (row-mean gradient scan at t = 1/6/12/18/24/30/36/42/48/54/60/66 s;
**12 of 12** frames put the hard screen-share/webcam divider at the same row, delta 144-216).
Content-mode b-roll covers rows 0..853; the webcam plays below.

## Build directives
`python video-creation/shorts/_tooling/clip_directives.py --batch last-year --clip 4` -> **(none)**
(0 of 0). Standard coverage rules apply; nothing is inherited from any other clip or batch.

## The clip, and why the base earns what it keeps
The conviction story: Hurricane Sally dropped ~100 trees on his property, he bought an excavator
instead of paying a $20,000 crew, and when the cleanup was done he **sold the excavator to buy more
Kaspa**. Then the honest pain (Bitcoin dips, Kaspa dips harder, Bitcoin recovers, Kaspa stays down),
resolving upward ("all this pain is going to be worth it in the long run") and **hard-outing** on
"I'm battle-hardened... I'm ready for some pain".

The base screen-share is NOT uniform on this clip, and the plan is built on which half is on-message
(measured on frames at t = 6/33/36/38/42/54/60/66):

| stretch | screen-share | treatment |
|---|---|---|
| 0.00-36.2 (the story) | DEXScreener **PURR/ETH** chart - off-message for an excavator/Kaspa story | the b-roll story beats live here (B1-B5), plus badge A |
| 36.4-51.3 (the pain) | **live TradingView KASUSD weekly chart**, 0.026172, -1.80% - this IS the receipt for "Kaspa's going down" | **deliberate 9.00 s base stretch**; exactly ONE cutaway (B6) |
| 51.4-58.4 (the thesis) | back to the PURR chart - off-message | badge B + the alpha overlay |
| 58.5-67.06 (the close) | the KASUSD chart again | **nothing at all** - the hard-out is clean |

## Reference-image gate (checked LIVE against `schedule-tweets/images/reference/`, 2026-08-11)
Named projects in this clip: **Kaspa** (headline) and **Bitcoin** (named 5x as the comparison).

| project | reference on disk | how it is honoured |
|---|---|---|
| Kaspa | **`kaspa-logo.png`** (black coin, glowing greenish-cyan **mirrored/backwards K**) | generated WITH the ref on the frame-0 cover, on the CLIMAX full-screen B5, on B6 and on the alpha overlay - 4 DISTINCT compositions, zero reuse. Never gold, never a normal "K". |
| Bitcoin | none | **logo-free**: B6 shows the recovery as a plain ORANGE glowing line vs the teal one. No invented Bitcoin mark. |

## Coverage budget (SKILL: target ~30 % b-roll / ~70 % base, band 25-35 %)
**6 distinct b-roll images, 20.15 s of 67.060 s = 30.0 % b-roll / 70.0 % base showing** (audited off
the shipped `BROLL_KEX` array, not by hand).
**2 full-screens** (the hook and the climax), 29.35 s apart - inside the FIRM 1-3 cap.
Every image is a NEW generation with a `-lykx-` filename of its own; nothing is reused from the Lane 3
excavator image or from any sibling clip in this batch.

| # | t in | t out | dur | mode | spoken line | visual | asset | ref |
|---|---|---|---|---|---|---|---|---|
| - | 0.00 | 0.033 | 1 frame | THUMB | (cover) | excavator lifting a glowing teal Kaspa coin out of a storm-wrecked property; title/chip drawn in CODE on top | `thumb-lykx.png` | kaspa-logo.png |
| B1 | 0.85 | 4.20 | 3.35 | **full** | "so I have my excavator that I sold here. I was here full time in 2020" | HOOK: mud-caked yellow excavator alone in a storm-wrecked wooded property at grey dawn, snapped pines flat around it | `broll-lykx-hook-excavator.png` | - |
| - | 4.20 | 6.85 | 2.65 | base | "and there was a huge hurricane. my town right here" | base: he says "right here" and gestures at himself/his place - do not cover the gesture | - | - |
| B2 | 6.85 | 10.45 | 3.60 | content | "where I am in the Gulf Coast, took a direct hit from Hurricane Sally" | hurricane making landfall on a Gulf Coast town at night, palms bent flat, rain sheeting through a street light | `broll-lykx-hurricane-sally.png` | - |
| - | 10.45 | 12.85 | 2.40 | base | "and then it was like, I got a big property" | base | - | - |
| B3 | 12.85 | 16.45 | 3.60 | content | "and I lost like 100 trees, man. it was just all laying on the floor" | aerial: ~100 snapped pines flattened across the property like matchsticks | `broll-lykx-hundred-trees.png` | - |
| - | 16.45 | 20.00 | 3.55 | base | "it was just devastating. I was like, jeez, why would I pay another crew" | base | - | - |
| B4 | 20.00 | 23.30 | 3.30 | content | "like $20,000 or something to come clean out my property" | faceless silhouetted tree crew with chainsaws in front of a flatbed at dusk, a fat fan of BLANK banknotes glowing in the foreground | `broll-lykx-crew-quote.png` | - |
| - | 23.30 | 33.55 | **10.25** | base | "when I can just buy an excavator and do it myself... every weekend... just have fun doing it. and I got an excavator" | **DELIBERATE base stretch** - carried by code badge A (25.20) and the riser that builds into the climax | - | - |
| B5 | 33.55 | 36.55 | 3.00 | **full** | "I went and sold my excavator so I can buy more kaspa" | **CLIMAX**: the excavator hauled away on a flatbed at sunset, dissolving into a cascade of glowing teal Kaspa coins (mirrored-K, from the ref) | `broll-lykx-sold-for-kaspa.png` | kaspa-logo.png |
| - | 36.55 | 45.55 | **9.00** | base | "kaspa's been really weak... whenever Bitcoin goes down, kaspa goes down... Bitcoin goes back up, kaspa stays down" | **DELIBERATE base stretch**: the live KASUSD weekly chart IS the receipt for the title. Covering it would hide the proof | - | - |
| B6 | 45.55 | 48.85 | 3.30 | content | "and then Bitcoin goes down again, kaspa goes down some more" | abstract dark chart: an ORANGE line climbing back to the top right, a TEAL line pinned flat along the bottom with a weighted Kaspa coin on it | `broll-lykx-kaspa-lag.png` | kaspa-logo.png |
| - | 48.85 | 67.06 | **18.21** | base | "...kaspa stays down there. I think the pain is gonna be relieved soon enough... all this pain is gonna be worth it in the long run." + the whole close | **base to the end.** Carried by badge B (52.80) and the alpha overlay (56.30), then **NOTHING from 58.40**: the hard-out ("I'm battle-hardened... I'm ready for some pain") gets no b-roll, no badge, no overlay, no SFX and no CTA. That abruptness is the watch-time strategy, not an omission | - | - |

Adjacency: every b-roll join leaves **>= 2.40 s of base** (the minimum is 1.5 s), so there is no
sub-1 s base flash anywhere and no beat needs the hard-cut butt. No beat is longer than 3.60 s.

## Transparent alpha overlay (1, the real-alpha PNG the SKILL requires per clip)
| asset | t in | t out | placement | line |
|---|---|---|---|---|
| `broll-lykx-ov-kaspa-rise.png` | 56.30 | 58.40 | top 90, left 200, width 480 (rows 90-570, cols 200-680: the DARK, empty upper-left plot area of the DEXScreener page, clear of the right-hand stats panel at x > 860, of the chat banner at y > 700, of the seam at 853 and of the caption band centred 900) | "all this pain is gonna be worth it in the long run" |

Generated glow-on-black, then converted to TRUE alpha (alpha = boosted luminance) per the SKILL's
"Transparent overlays" method; composited with `blend: 'normal'` (a true-alpha PNG, so it survives
both dark and light backgrounds).

## Code-drawn badges (2, both inside a deliberate base stretch, 24.8 s apart)
| t in | t out | text | band |
|---|---|---|---|
| 25.20 | 28.00 | `$20,000` / `CREW` / sub `OR BUY THE MACHINE` | top 620 |
| 52.80 | 55.40 | `RELIEF` / `COMING` / sub `MAYBE ANOTHER YEAR` | top 620 |

They can never co-occur with each other, with any b-roll beat, or with the alpha overlay (badge B
ends 0.90 s before the overlay starts). Both start long after the 1-frame thumb, and
`LivestreamShort` suppresses badges while the thumb is up anyway.

## SFX (from `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)
Whoosh on the frame-0 cover cut and on the hook full-screen in/out, a boom on "took a direct hit",
a ding on badge A's `$20,000`, a riser that builds INTO the climax full-screen and the impact that
lands on it, a ting on the Kaspa payoff word, a soft impact inside the measured 47.00-47.37 s silence
on "kaspa goes down some more", and a ting on the resolution.
**Nothing fires after 58.40 s** - the hard-out ends clean, and the final word "pain" is untouched.

This clip is DESILENCED, so it has only three >= 0.15 s silences at -57 dB (8.68-8.91, 16.38-16.55,
47.18-47.37) and 14 quiet windows at -45 dB. Every cue is therefore either anchored in one of those
windows or proven by the OFFLINE masking A/B (candidates mixed onto the bare spine and scored against
an encode-matched 48 kHz/AAC control, zero renders). Exact cue times, measured crest offsets and the
full A/B table live in `remotion/src/constants-last-year-kaspa-excavator.ts`.

## Framing check after the DRAFT render (ONE crop, no regeneration)
`BrollLayer`'s content mode renders into a **1080x853** box with `objectFit: cover` plus a 1.00 ->
1.07 Ken Burns zoom, i.e. it keeps only the middle 1.266:1 band. All four content-mode assets were
simulated through that exact transform at BOTH zoom ends before rendering: hurricane / trees /
crew-quote frame correctly at 1.5:1 and were left untouched. Only `broll-lykx-kaspa-lag.png` needed
help (the centre crop cut the orange arrowhead off the top right), so it was **re-cropped in place,
right-aligned, to 1297x1024** = the content-zone aspect; the original is kept as
`_orig-broll-lykx-kaspa-lag.png` in this folder. No image was regenerated, no filename or beat
mapping changed.

## Post-render audits (all mechanical, off the SHIPPED files)
- **Coverage / collision audit** (parsed from the shipped `BROLL_KEX`/`BADGES_KEX`/`OVERLAYS_KEX`):
  6 beats, 6 distinct assets, 20.15 s = **30.0 % b-roll / 70.0 % base**, 2 full-screens, longest beat
  3.60 s, smallest interior base gap 2.40 s, and **zero time overlaps** between any two timed elements
  (b-roll, badges, overlay, frame-0 thumb). Last SFX cue 55.50 s, i.e. before the 58.40 s close.
- **SFX presence, measured on the render**: the render was aligned to the spine by FFT
  cross-correlation (+42.67 ms) and subtracted. The codec-noise floor on SFX-free stretches is
  -61.6 dB; **all 11 cues sit 20-46 dB above it** (present and audible), and the four windows inside
  the hard-out close sit AT the floor (-58 to -66 dB), i.e. the ending is provably clean.
- **Captions vs the render's own audio**: whisper (small, word timestamps) on the FINAL render aligns
  **96.6 %** of caption words. Every difference is a decoder/tokenisation difference against the
  clip's own canonical pass (have/had, jeez/geez, "100" vs "a hundred", "$20,000" vs "$20"+"000"),
  never a missing or invented caption. Notably the render's pass produced **"battle hard and"** for
  the hard-out line, which is exactly the garble the batch flagged and which the new phrase rule maps
  to "battle-hardened" on screen.
- **blackdetect**: no black frames. **Levels**: max -5.4 dB (no clipping), integrated -18.3 LUFS,
  identical to the spine's -18.3 and in line with the siblings (-18.1 / -17.6).

## Zero-orphan reconciliation
7 generated images (6 b-roll + 1 alpha overlay) + 1 thumbnail + the spine + the SFX copies. Every beat
above has an asset, every asset is referenced by the comp, every comp ref exists in
`shorts/last-year/render-assets/`; verified by `finalized_short_gate.py --clip 4`.
