# BROLL-PLAN — `meme-fud-130x` (batch `last-year`, clip #1, variant `full`)

**Title:** They Called These Coins Dead. We're at a 130X.
**Spine:** `meme-fud-130x-final.mp4` -> staged GOP-safe as `render-assets/meme-fud-130x.mp4`
(86.337 s, 1080x1920, 25 fps source; comp runs at 30 fps and OffthreadVideo resamples by TIME, so
every cue below is plain clip-relative seconds off the clip's own Whisper words).
**Measured seam:** row **853** (row-mean gradient scan at t = 1/6/12/18/24/30/38/45/52/60/68/75/82/85 s;
13 of 14 frames land on 853, the 14th - t=45 - is a low-contrast frame with no hard edge).
Content-mode b-roll covers rows 0..853; the webcam plays below.

## Build directives
`python video-creation/shorts/_tooling/clip_directives.py --batch last-year --clip 1` -> **(none)**.
Standard coverage rules apply; nothing is inherited from any other clip or batch.

## Reference-image gate (checked LIVE against `schedule-tweets/images/reference/`, 2026-08-11)
Named projects in this clip: **$TUT / Tutorial**, **Toshi**, **Velvet**, **Peanut**, **Pengu**, **Base**.

| project | reference on disk | how it is honoured |
|---|---|---|
| $TUT (Tutorial) | **`TUT-tutorial.jpg`** (black slanted lightning-T on amber) | frame-0 cover `thumb-mfx.png` generated WITH the ref; plus the real $TUT bubble is on the base screen-share (rain.trade bubbles, "TUT +950%") for ~50 s |
| Toshi | **`toshi.png`** (blue cartoon cat, white muzzle, orange hoodie, peace sign) | B2, B3 and B8 all generated WITH the ref (three DISTINCT compositions, zero reuse) |
| Velvet | **`velvet.png`** (purple/white V chevron + "Velvet" wordmark) | B6 generated WITH the ref |
| Peanut | none | **logo-free** - B4 uses blank, unmarked tokens. No invented mark. |
| Pengu | none | **logo-free** - same. No penguin logo is invented. |
| Base | none (`toshi.png` is the mascot, not the chain mark) | never drawn as a chain logo |

## Coverage budget (SKILL: target ~30 % b-roll / ~70 % base, band 25-35 %)
**8 distinct b-roll images, 25.30 s of 86.337 s = 29.3 % b-roll / 70.7 % base showing** (audited
straight off the SHIPPED `BROLL_MFX` array, not by hand).
**2 full-screens** (hook + the closing pivot/climax) - inside the FIRM 1-3 cap.
Base is the default state: the content zone here is a LIVE receipt (the rain.trade bubble map with a
giant `TUT +950 %` bubble, then the Coinglass TUT liquidation page), and Mike points at it repeatedly,
so the two longest deliberate base stretches sit exactly where he is pointing.

| # | t in | t out | dur | mode | spoken line | visual | asset | ref |
|---|---|---|---|---|---|---|---|---|
| - | 0.00 | 0.033 | 1 frame | THUMB | (cover) | dead-coin graveyard with ONE blazing $TUT coin rocketing out; title/chip drawn in CODE on top | `thumb-mfx.png` | TUT-tutorial.jpg |
| B1 | 0.90 | 4.20 | 3.30 | **full** | "people are talking a lot of smack about some of these coins that came out like 2024, 2025" | HOOK: stormy graveyard of cracked BLANK coins as tombstones, faceless hooded silhouette shouting through a megaphone | `broll-mfx-hook-graveyard.png` | - |
| - | 4.20 | 7.40 | 3.20 | base | "they're not gonna pump" | base: the bubble map (TUT +950 %) reads as the counter-evidence under the FUD line | - | - |
| B2 | 7.40 | 11.20 | 3.80 | content | "toshi and peanut and like you name it and pengu and all this stuff" | the three named coins standing DULL and grey in the graveyard: Toshi's cat on the left coin, the other two completely BLANK (Peanut/Pengu have no reference) | `broll-mfx-named-dead.png` | toshi.png |
| - | 11.20 | 29.70 | **18.50** | base | the 94x -> 130x receipt run, incl. "look at this thing man... freaking 94x, holy crap" | **DELIBERATE base stretch**: he is pointing at the live TUT bubble, which IS the receipt. Carried by 2 code badges (17.60 / 23.90) and an impact on "holy crap" | - | - |
| B3 | 29.70 | 32.10 | 2.40 | content | "what if toshi is gonna pump?" | the same cat, now lit up and blasting off a green rocket flame out of the graveyard | `broll-mfx-toshi-ignite.png` | toshi.png |
| B4 | 32.10 | 35.00 | 2.90 | content | "what if pengu is gonna pump? what if all these others are gonna pump?" | a squadron of a dozen BLANK unmarked tokens lifting off together on green flame | `broll-mfx-swarm-liftoff.png` | - |
| - | 35.00 | 37.40 | 2.40 | base | "no, I know some of them are dead" | base | - | - |
| B5 | 37.40 | 40.90 | 3.50 | content | "some of them died out in the bear market, the devs are like: ah, hell with this... they jump ship" | abandoned dev room, dust on dead monitors, one flickering screen with a falling red line, no people | `broll-mfx-devs-ghost.png` | - |
| - | 40.90 | 45.20 | 4.30 | base | "look at here Velvet, Velvet is pumping too, right?" | **base on purpose**: his cursor is ON the VELVET bubble (measured at t=45) - do not cover his own pointing | - | - |
| B6 | 45.20 | 47.90 | 2.70 | content | "this is my 58x-er from just two months ago" | the Velvet chevron mark on a token climbing a steep green candlestick staircase | `broll-mfx-velvet-58x.png` | velvet.png |
| - | 47.90 | 66.20 | **18.30** | base | open interest / volume / "shorting like crazy and getting liquidated" | **DELIBERATE base stretch**: the Coinglass TUT liquidation page IS the receipt. Carried by the ONE alpha overlay (58.30) and an impact on "liquidated" | - | - |
| B7 | 66.20 | 69.80 | 3.60 | content | "every single influencer spreading FUD about meme coins and some alts" | a rank of faceless silhouetted influencers with phones and megaphones spraying grey toxic fog over a field of blank coins | `broll-mfx-influencer-fud.png` | - |
| - | 69.80 | 73.95 | 4.15 | base | "just from last year, just from last year" | base | - | - |
| B8 | 73.95 | 77.05 | 3.10 | **full** | "what the hell. so if you're spreading FUD about Toshi?" | CLIMAX/PIVOT: the cat standing defiant on a rock as a grey FUD storm and red arrows break around it, green dawn rising behind | `broll-mfx-toshi-vs-fud.png` | toshi.png |
| - | 77.05 | 86.337 | 9.29 | base | "what is going to replace Toshi... what meme coin is gonna replace Toshi now?" | **base to the end, clean**. The question IS the ending: no b-roll, no badge, no SFX on it, no CTA, hard-out. | - | - |

Adjacency: **B3 -> B4 are EXACTLY butted** (32.10, inside the measured 31.78-32.12 s VO silence) so
`BrollLayer` hard-cuts with zero base frames between. Every other join has >= 2.40 s of base, far
above the 1.5 s minimum, so no sub-1 s base flash exists anywhere and the two full-screens are
69.75 s apart. Verified mechanically off the shipped array: 8 beats, 8 distinct assets, 2
full-screens, no beat longer than 3.9 s, ZERO sub-1.5 s base gaps.

## Framing correction applied after the DRAFT render (no regeneration)
The draft chunk-QA showed that `BrollLayer`'s content mode renders into a **1080x853** box with
`objectFit: cover`, i.e. it keeps only the MIDDLE 1.266:1 band of a 941x1672 portrait image - and
that band cut the subject out of four beats (the Toshi cat in B3, the silhouettes in B7, and the
tops of B4/B5). Every content-mode asset was therefore **re-cropped in place to the content-zone
aspect** with a measured per-image offset (originals kept in this folder as `_orig-*.png`), so the
subject is fully inside the zone. No image was regenerated and no filename or beat mapping changed.
B3 additionally got 35 px of headroom so `BrollLayer`'s 1.00 -> 1.07 Ken Burns zoom cannot clip the
cat's ears.

## Transparent alpha overlay (1, the real-alpha PNG the SKILL requires per clip)
| asset | t in | t out | placement | line |
|---|---|---|---|---|
| `broll-mfx-ov-liquidation.png` | 58.45 | 61.00 | top 130, left 220, width 430 (the empty white plot area of the Coinglass page, measured at t=59: mean luminance 249 / std 1; clear of the tooltip at x>650, of the seam at 853 and of the caption band centred 900) | "people are shorting like crazy and people getting liquidated" |

Converted to real alpha by `_ov-liquidation-raw.png` -> `mfx_alpha.py` (alpha = boosted luminance):
**66.8 % of the 1254x1254 PNG is fully transparent**, so it composites with no box.

Generated glow-on-black, then converted to TRUE alpha (alpha = boosted luminance) per the SKILL's
"Transparent overlays" method, and composited with `blend: 'normal'` because the screen-share under it
is a WHITE page (screen-blend would vanish over it).

## Code-drawn badges (2, both inside the first deliberate base stretch)
| t in | t out | text | band |
|---|---|---|---|
| 17.60 | 20.30 | `94X CALL` / `$TUT` / sub `ON BNB, LAST SEPT` | top 660 |
| 23.90 | 26.60 | `NOW AT` / `130X` / sub `FROM THE 94X CALL` | top 660 |

They are 3.60 s apart, so they can never co-occur; both start long after the 1-frame thumb; neither
overlaps the alpha overlay (58.30) or any b-roll beat. Nothing else is ever on screen with them.

## SFX (8 cues, from `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)
Whoosh on the frame-0 cover cut and on the hook full-screen in/out, a ding on the 130X badge reveal,
an impact on the peak ("holy crap"), a receipt ting after the 58x, an impact on the liquidation
overlay, and a riser that builds into the closing full-screen boom.
**Nothing is placed on the final question** - it ends clean and abrupt on purpose.

Five of the eight cues are anchored INSIDE a measured VO silence (21.88-22.48, 27.96-28.24,
47.60-47.80, 73.46-74.02), which is why almost none needed a rescue. Three cues were fixed or
deleted by an OFFLINE masking A/B run before any render (candidates mixed onto the bare spine and
scored against an encode-matched control, zero renders): the liquidation impact was RETIMED +0.15 s
at full gain (2/3 -> 3/3 windows), and two whooshes (the B3->B4 hard cut, the cut back from the
climax) were DELETED because neither trimming nor halving the gain recovered the line under them.
Exact cue times, measured crest offsets and the full A/B table live in
`remotion/src/constants-last-year-meme-fud-130x.ts`.

## Zero-orphan reconciliation
9 generated images (8 b-roll + 1 alpha overlay) + 1 thumbnail + the spine + the SFX copies. Every
beat above has an asset, every asset is referenced by the comp, every comp ref exists in
`shorts/last-year/render-assets/`; verified by `finalized_short_gate.py --clip 1`.
