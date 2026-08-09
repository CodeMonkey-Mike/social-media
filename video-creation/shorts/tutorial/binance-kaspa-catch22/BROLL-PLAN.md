# BROLL-PLAN — tutorial / clip 3 `binance-kaspa-catch22` (variant: full, 31.96 s)

Title: "Binance Wants Community Driven Coins. Kaspa Isn't Listed."
Spine (build from THIS): `video-creation/shorts/tutorial/render-assets/binance-kaspa-catch22.mp4`
(1080x1920, 25 fps, 31.96 s, GOP re-encoded seek-friendly). Comp runs at 30 fps; every cue below is
plain clip-relative seconds off the clip's OWN `whisper-words.json` (+ the verified patch, see
`_patch_words.py`).

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS WHOLE BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphic overlays, image overlays **with real background
transparency**. BANNED: full-screen b-roll and content-zone b-roll, i.e. **any asset that covers the
frame or fills the content zone**. The test is COVERAGE, not the asset's source.

**Consequence for this plan, stated plainly:** there are **ZERO** `BrollEv` beats. B-roll coverage is
**0 %**, base-showing **100 %**. That is DELIBERATELY outside the SKILL's ~25-35 % b-roll band and
outside its "full-screen at the hook / 1-3x" item, on Mike's own batch-level instruction, and it is
reported as a DEVIATION in the build report rather than silently "fixed". Do not restore b-roll
coverage from this file. Everything visual below is either a **true-alpha PNG overlay** (subject on
transparent background, composited over the base) or a **code-drawn badge**, none of which fills the
content zone (each occupies 12-25 % of it).

## Base layout (MEASURED on this clip)

Row-mean gradient scan at t = 0.5 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 31 s: the screen-share/webcam
seam is on row **853** in all nine frames (delta 181-202). Caption band centre **905** (52 px under
the seam, on his hair; his eyes sit at rows ~1150-1290 in every sampled frame, never covered).

Content-zone contents (this matters, because it is what the overlays must NOT cover):
- **0.00-7.60 s** and **26.50-31.96 s** (master 637.6-645.1 and 659.6-665.0): CoinMarketCap **$TUT**
  page. A live-chat banner is burned into the base at rows ~725-780: *"Kaspa is the biggest enigma.
  We don't know is Kaspa a blam, scam or a gem"* (@Muadib1234) - literally the question he is
  answering. Overlays here stay ABOVE row 700 so that banner stays readable.
- **7.60-26.50 s** (master 2027.3-2074.7): DEXScreener **IF/WETH** chart, i.e. the screen-share is
  OFF-MESSAGE for the Binance/Kaspa argument. Per the SKILL that is still not a licence to blanket -
  and here b-roll is banned anyway - so the argument is carried by overlays + captions.

## Beat table

| # | t (s) | spoken line | element | kind | zone / placement | asset |
|---|---|---|---|---|---|---|
| T | 0.000-0.033 | (frame 0 only) | designed hook cover: generated art + CODE-drawn title "BINANCE WANTS / COMMUNITY COINS. / SO WHERE'S / KASPA?" + chip "A STRANGE CATCH-22" | thumbnail | full frame, ONE frame; base video from frame 1 | `thumb-tutbkc.png` |
| 1 | 2.00-4.80 | "kaspa's a gem. kaspa's the most beautiful thing ever." | glowing teal crystal gem | alpha PNG overlay | content zone, RIGHT of the CMC chart, top 150 / left 610 / w 380 (rows 150-560, clear of the chat banner at 725-780) | `broll-tut-bkc-ov-gem.png` |
| 2 | 8.60-11.40 | "there was a blog article on the binance website talking about how they're looking for community driven coins." | badge: BINANCE'S OWN BLOG / "COMMUNITY DRIVEN" / THEIR PUBLISHED STANDARD | code-drawn | content zone, centred, top 430 | none (no Binance reference image exists on disk, so NO logo is invented - text only) |
| 3 | 15.00-17.80 | "binance gives the argument about neiro, it's a community driven coin, but it's a meme coin." | badge: NEIRO / LISTED / COMMUNITY DRIVEN MEME COIN | code-drawn | content zone, centred, top 430 | none (no Neiro reference image on disk - text only). EDITORIAL: Neiro is the example that PROVES the point, never a target. Purely factual wording. |
| 4 | 19.60-21.50 | "they don't apply the same logic to kaspa" | the REAL Kaspa coin mark, glowing | alpha PNG overlay | content zone, LEFT, top 130 / left 90 / w 400 (rows 130-530) | `broll-tut-bkc-ov-kaspa.png` |
| 5 | 22.30-24.20 | "kaspa would be listed on binance by now." | badge: KASPA / NOT LISTED / ON BINANCE, TO THIS DAY | code-drawn | content zone, centred, top 660 (rows ~535-785) - a DIFFERENT band from beat 4, and 0.80 s after it ends | none |
| 6 | 24.55-26.70 | "so it's kind of a strange catch-22" | glowing padlock on a closed gate | alpha PNG overlay | content zone, centred-right, top 200 / left 520 / w 420 | `broll-tut-bkc-ov-lock.png` |
| 7 | 29.30-32.10 | "you know, like i would expect kaspa to be skyrocketing." | glowing bull silhouette charging up | alpha PNG overlay | content zone, centred, top 200 / left 300 / w 480; tOut past the comp end so the HARD-OUT keeps full opacity (no fade) | `broll-tut-bkc-ov-bull.png` |

**Collision matrix (time AND space, per Phase 7 rule #3).** Windows in order:
0.000-0.033 (thumb) / 2.00-4.80 / 8.60-11.40 / 15.00-17.80 / 19.60-21.50 / 22.30-24.20 /
24.55-26.70 / 29.30-32.10. **No two windows overlap**, minimum separation 0.35 s (beat 6 after
beat 5). Nothing starts before the thumb frame ends, and `LivestreamShort` suppresses badges and
overlays while the thumb is up anyway. No brand watermark plate is used on this clip (it would sit on
the CMC nav bar and, at 26.5 s, over the live chat banner), so the thumb frame carries no other
graphic at all.

## Reference-image gate (run LIVE 2026-08-09 against `schedule-tweets/images/reference/`)

Named projects in this clip: **Kaspa**, **Binance**, **Neiro**.
- **Kaspa -> `kaspa-logo.png` EXISTS.** Beat 4 therefore carries the REAL Kaspa mark: the reference
  PNG is already a glowing teal coin on pure black, so it is converted to TRUE alpha by the
  documented alpha-from-luminance method (`_make_overlays_alpha.py`) and composited - no generation,
  no invented mark, pixel-exact branding.
- **Binance -> no reference on disk.** No logo is invented anywhere (beats 2 and 5 are text-only
  code-drawn badges). The generated art must contain no exchange mark.
- **Neiro -> no reference on disk.** Same: text only, beat 3.
- Generated images must contain **no real crypto logo and no real face** (persona rule); the gem,
  padlock and bull are objects/silhouettes only, and every generated coin-like shape must be blank.

## Generation

`repurpose/generate-broll-reload.js` (ChatGPT pool purpose `broll`), inside the `chatgpt` stage lock,
straight into `video-creation/shorts/tutorial/render-assets/` (the batch's public dir, SHARED with the
other 7 clips - hence the `tut-bkc` / `tutbkc` prefixes on every file this clip owns). Overlay
subjects are prompted **"brightly glowing, fully opaque, centred, on a PURE SOLID BLACK (#000000)
background and nothing else, no checkerboard"** and then converted to real RGBA with
alpha = boosted luminance (SKILL: "Transparent overlays"). `blend: 'normal'` on every overlay, because
both screen-shares are near-white in places and a screen blend cannot darken white.

## SFX (>= 2 required; 7 planned, all from `video-creation/assets/sfx/`)

| t (crest) | cue | file |
|---|---|---|
| 0.00 | frame-0 cover cut into the video | `transition_rapid_whoosh.mp3` |
| 2.00 | gem overlay pop (beat 1) | `DING.mp3` |
| 7.60 | the scatter-gather cut, CMC page -> DEXScreener | `transition_rapid_whoosh.mp3` |
| 13.08 | seg2 -> seg3 join, "binance gives the argument" | `transition_rapid_whoosh.mp3` |
| 20.70-21.95 | riser across the 0.56 s suspense pause, ENDS in the pause | `risers/Tension_Rise_Logo_Reveal_3.wav` |
| 21.95 | impact, crest inside the SILENT pause 21.54-22.10 so it rings under "kaspa would be listed" without masking the word | `Impacts/Kick_Impact_01.wav` |
| 24.55 | padlock overlay reveal, on the low-content "so it's kind of" | `TING SOUND EFFECT.mp3` |
| 29.30 | bull overlay + the closing hype line | `transition_rapid_whoosh.mp3` |

**Nothing is placed on "catch-22" itself** (26.00-26.48). The contract's own cautionary tale is a
sting that masked a closing punchline; the payoff hit is deliberately placed 1.45 s earlier, in
measured silence. Every cue is A/B'd OFFLINE against an encode-matched control before rendering.

## Reconciliation (must be re-checked before the render)

Every beat above has an asset; every asset is referenced in `constants-tut-binance-kaspa-catch22.ts`;
every comp ref exists in `render-assets/`. Zero orphans, both directions - the gate enforces it.
