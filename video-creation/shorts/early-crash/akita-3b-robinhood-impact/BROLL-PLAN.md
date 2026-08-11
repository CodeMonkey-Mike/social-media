# BROLL-PLAN - early-crash / clip 6 `akita-3b-robinhood-impact` (variant: impact)
### "Watch This: $3 Billion. A Freaking Inu." (Mike's exact 4b title)

Spine: `akita-3b-robinhood-impact-final.mp4` (**30.77 s**, 1080x1920, native 25 fps, FINAL - raw cut
-> Phase 5 tighten (a justified ZERO-REMOVAL plan) -> 5B desilence at min-sil 0.25 -> 5C filler pass).
Never re-encoded in the clip folder; the render loads the GOP-safe copy
`render-assets/akita-3b-robinhood-impact.mp4` (keyframes verified on disk at
0.00 / 1.00 / 2.00 / 3.04 / 4.04 ... ~1.0 s GOP).
Comp: `EcAkitaImpact` (shared `LivestreamShort` renderer) · constants `constants-ec-akita-impact.ts` ·
captions `captionsEcAkitaImpact.ts`.
Public dir: `video-creation/shorts/early-crash/render-assets/` (SHARED with clips 1/3/4/5 - every file
this clip owns is `broll-ec-aki-*` / `thumb-ecaki` prefixed so the parallel builders cannot collide).
Measured content/face seam of THIS clip: **row 853** (row-mean gradient scan at
t = 1/4/8/12/16/20/24/28/30 s; all NINE frames return row 853, delta 181-200).

⛔ **This clip is the IMPACT cut of clip #1 (`akita-3b-robinhood`)** - its master range
1121.16-1164.18 sits INSIDE clip #1's. Every image here is NEW and clip-scoped; **not one of clip #1's
assets (`broll-ec-aka-*`, `thumb-eca.png`) is reused or referenced**, per the repo's every-image-is-
unique rule and the "no duplicate b-roll across same-topic shorts" hard rule. Concepts were also kept
visually distinct from clip #1's (see the beat table).

---

## ⛔ MIKE'S CLIP-SPECIFIC B-ROLL DIRECTIVE (2nd review, 2026-08-07) - overrides the coverage band

> "clips 1+6 are chart-walks - EXTREME-minimum b-roll (clip 1: thumb + first ~5s + last ~15s;
> **clip 6: thumb + first ~1s + last ~5s; middles BARREN, transparent-bg overlays only**), clips
> 3/4/5 normal band."

So this build carries the frame-0 cover, ONE ~1.1 s beat at the head, and ~4.2 s at the tail. The
whole 1.70-26.60 s middle is BARREN: **no full-screen images, no content-zone images**, only
transparent-background elements (one real alpha PNG + two code-drawn badges).

This is a **deliberate, recorded deviation from the ~25-35 % coverage band** in `video-creation/SKILL.md`
("B-roll coverage budget"), not an oversight, and it is the same principle the budget rule states,
taken to its limit: *"leave DELIBERATE gaps with NO b-roll image so the content zone shows, especially
when Mike is pointing at something on screen."* Here he is hunting a single candle on a live chart for
~25 consecutive seconds. **The shortfall is reported, never "fixed" by adding images.**

**What the content zone actually is (measured at 4 fps on the staged spine, mean luminance of the
chart crop x140-860 / y40-430; chart ~33, meme ~104-168):**
- 0.00-6.90 s and 12.00-17.25 s and 19.25-30.77 s -> the live DEXScreener `AKITA/WETH (Market Cap) 1D`
  chart. Candles + volume occupy **rows 40-430**; rows **430-853** are a static, near-white
  "Transactions" table; x 865-1080 is the token stats panel + a Rainbet ad.
- **6.90-11.90 s (5.00 s)** and **17.40-19.10 s (1.70 s)** -> the chart panel is fully replaced by one
  of Mike's own livestream REACTION-MEME clips (a cheering crowd, then a shocked reaction). These are
  BASE footage and on-brand hype punctuation, so the build leaves them alone (the persona no-real-faces
  rule governs GENERATED b-roll, not Mike's own stream). They also explain the two long "silences" in
  the word stream (7.12-12.32 and 17.58-19.62): the memes ARE those beats. ⚠ **Neither hole is
  silent** - he talks over both, and the shipped word pass DROPPED a "look at that." in each (9.76 and
  18.80). They are restored via the clip folder's `_patch_words.py` -> `whisper-words-verified.json`,
  which is what the captions are built from (contract item 3).
- Consequence for placement: **every mid-clip graphic is confined to rows 470-850 (the static table) or
  to the empty left third of the chart (x 130-470), so the candles he is guiding through stay 100 %
  visible.**

## Budget

| metric | canonical target | this clip (AS PLANNED = AS BUILT) | note |
|---|---|---|---|
| generated b-roll coverage | ~30 % (band 25-35 %) | **5.27 s = 17.1 %** | ⚠ BELOW BAND **by Mike's directive above** |
| base video showing | ~70 % (band 65-75 %) | **25.50 s = 82.9 %** | the chart hunt is the visual |
| distinct b-roll images | output of the budget | **3** (+1 frame-0 cover, +1 alpha overlay) | |
| full-screen moments | 1-3 (FIRM) | **3** - hook, punchline, close | B2/B3 exactly butted (hard cut) |
| beat length | 1-3 s | 1.10 / 2.10 / 2.07 s | all inside 1-3 s |
| mid-clip (1.7-26.6 s) images | n/a | **ZERO** - barren by directive | 1 alpha PNG + 2 code badges only |

## Beats

| # | tIn | tOut | mode | spoken line (clip-relative) | visual | Reference |
|---|---|---|---|---|---|---|
| - | 0.03 | 0.60 | **base** | "now i'm going to go over here..." | the frame-0 thumb is ONE frame; the video opens on Mike + the live chart (Phase 7 rule #5) | |
| 1 | 0.60 | 1.70 | **full** | HOOK "now i'm going to go over here to the, to the, to the right" (0.00-2.96) | from behind: one small faceless silhouette facing a wall of dark screens, every screen an abstract green line ripping upward, a blinding lime flare at the centre | none - deliberately NOT clip #1's "wall of blank coins + gold shockwave" hook |
| - | 1.70 | 26.60 | **base** | the whole chart hunt: "now watch this", "oh my god" x2, "hold on" x3, the crowd meme, "look at that", "holy crap" x2, the shocked meme, "3 billion", "let me hover over that candle", "what? where's", "right here? right? yeah", "is this the 3 billion, 3 billion market cap?" | ⛔ BARREN BY DIRECTIVE - the DEXScreener chart and the two meme inserts play untouched. Carried by 2 code badges + 1 alpha PNG (below) | |
| 2 | 26.60 | 28.70 | **full** | PUNCHLINE "a freaking inu without any" (26.62-28.26) | a majestic akita-type dog in a lit hero pose on the summit of a mountain of stacked glowing candle bars, above a sea of cloud, moonlit | Akita Inu: **no reference on disk** (checked LIVE) -> a real ANIMAL, never a coin mark; no collar tag, no invented logo |
| 3 | 28.70 | 31.20* | **full** | CLOSE "centralized exchanges. a freaking inu." (28.26-30.54) | monolithic dark exchange towers, shuttered and chained, dwarfed as a lime trail of light streaks PAST them into the sky with a small dog silhouette running on it | Robinhood/CEXes: no reference on disk -> no wordmarks, no feather, no fake logos |

\* B3's `tOut` is deliberately **beyond the comp end** (comp ends at t 30.733 s) so `BrollLayer`'s
0.12 s fade-out never starts: the clip HARD-OUTS on the punchline with the image at full opacity, no
fade, no tail, no CTA. That abruptness is Mike's watch-time strategy, not an omission.

Full-screen -> full-screen adjacency: only B2 -> B3, **exactly butted** (`tOut === tIn` = 28.70), so
`BrollLayer` hard-cuts with zero base frames between. B1 ends 1.70 and B2 starts 26.60 (a 24.90 s
deliberate base gap), so no sub-1 s base flash exists anywhere in the clip.

## Mid-clip transparent elements (the ONLY thing allowed in 1.70-26.60 s)

**SEQUENTIAL and never co-occurring** (gaps of 3.90 s and 0.70 s), none starts before the frame-0
cover ends (0.033 s), and they sit in two different vertical bands so they could not collide even if
they overlapped in time.

| kind | tIn | tOut | content | placement |
|---|---|---|---|---|
| code badge | 13.60 | 15.80 | "AKITA" / **INU** / "2021 MEME COIN" | top 660 (centre) = rows ~535-785, over the static white table |
| code badge | 19.70 | 21.90 | "PEAKED AT" / **$3B** / "MARKET CAP" | top 660 (centre) |
| alpha PNG `broll-ec-aki-ov-arrow.png` | 22.60 | 24.30 | a glowing lime arrow curving up and to the right, on the "where's... right here?" find; glow-on-black -> REAL alpha (luminance), `blend: 'normal'` | left 150, top 110, over the EMPTY dark left third of the chart (candles live at x 480-800 in this window) |

Both badges state only what this cut itself shows or says: the pair on screen is `AKITA/WETH`, and the
$3B market-cap top is the number he reads off the chart at 19.62 s (axis reads 2.92B/3.00B on the
sampled frames). No claim is imported from clip #1.

## Reference-image gate (run LIVE on `schedule-tweets/images/reference/`, 2026-08-08)

Named entities: the clip speaks **no ticker and no brand name at all** (verified against its own
whisper pass - the only proper noun on screen is the `AKITA/WETH` pair in Mike's own screen-share).
Live listing checked: `DogInMe.png, ElizaOS-ai16z-2.png, ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png,
bobo.png, carousels/, ethereum-eth.png, housecoin.webp, kappy.png, kaspa-logo.png, kasy.png, kroak.png,
linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png, troll.png, velvet.png, what-if.jpg`.

| entity | reference on disk? | ruling |
|---|---|---|
| Akita / Akita Inu | **no** | depicted as a real ANIMAL only; no coin mark, no collar tag, no invented logo |
| centralized exchanges | n/a | generic monolithic towers; no exchange wordmarks |

## Persona rules applied to every prompt

No real cryptocurrency marks (no Bitcoin B, no Ethereum diamond, no Solana bars, no SHIB/DOGE style
token faces), no coins at all in beats 2-3, no real-person faces, crowds/figures are faceless
silhouettes, **no text / letters / numbers baked into any image** (all on-screen text is code-drawn),
no em dashes. ⛔ **No teal anywhere** in the generated art or the accents: teal is Kaspa's colour and
this is not a Kaspa short (same rule clips #1 and #4 recorded).

## SFX (>= 2 required; this build has 8 events / 5 distinct files)

Whoosh on the frame-0 cover cut and on both head b-roll cuts; a DING on badge 1; a riser across the
shocked-meme beat that ENDS exactly on the "3 billion" reveal; a kick ON that reveal (which doubles as
badge 2's reveal hit, so badge 2 gets no separate DING and two hits cannot clutter); a trimmed Boom on
the punchline cut at 26.60; a whoosh on the B2 -> B3 hard cut. Every cue was swept OFFLINE against an
encode-matched control before rendering, on two staggered windows per cue region (see the constants
file). **Nothing is placed on the final "a freaking inu."** - the hard-out ends clean.

## Zero-orphan reconciliation (clip-scoped)

Every asset below is referenced by `constants-ec-akita-impact.ts` via a literal `staticFile()` and
exists in the batch public dir; nothing this clip generated is unreferenced.

```
thumb-ecaki.png                 frame-0 cover art
broll-ec-aki-hook.png           beat 1 (full)
broll-ec-aki-inu-summit.png     beat 2 (full)
broll-ec-aki-nocex.png          beat 3 (full)
broll-ec-aki-ov-arrow.png       alpha overlay (the only one)
```

The public dir is **SHARED with clips 1/3/4/5**, so the mechanical gate's orphan WARN lists their
`broll-ec-aka-*` / `broll-ec-wom-*` / `broll-ec-tfs-*` / `broll-ec-etp-*` / `thumb-*` assets. Those
belong to the sibling builds and are **not this clip's orphans**; ownership is reconciled clip-scoped
(assets this clip OWNS = the five above; assets it REFERENCES = those five + the shared `sfx/` copies).
