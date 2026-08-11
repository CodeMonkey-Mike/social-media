# BROLL-PLAN: tutorial / clip 4 `freaking-early-not-degen` (variant: FULL, 43.33 s)

Title (Mike's frozen 4b): **"That's the Degen Mindset. I Don't Trade Like That."** Hook type: philosophical.
Spine (build from THIS, never re-encode it): `video-creation/shorts/tutorial/render-assets/freaking-early-not-degen.mp4`
(1080x1920, 25 fps, video 43.28 s / audio 43.328 s, GOP re-encoded seek-friendly). The comp runs at
30 fps; `OffthreadVideo` resamples by TIME, so every cue below is plain clip-relative seconds measured
on this spine's own audio.

Namespace: this clip owns **`broll-tut-fed-*`** and **`thumb-tutfed.png`** and nothing else. The
`render-assets/` public dir is SHARED with 7 sibling clips; never touch `broll-tut94x-*` /
`thumb-tut94x-*` (clip 1), `broll-tut-rhm-*` / `thumb-tutrhm.png` (clip 2), `broll-tut-bkc-ov-*` /
`thumb-tutbkc.png` (clip 3), `broll-tut6-*` / `thumb-tut6.png` (clip 6).

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS WHOLE BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphics, image overlays **with real background transparency**.
BANNED: full-screen b-roll and content-zone b-roll, i.e. **any asset that covers the frame or fills
the content zone**. The test is COVERAGE, not the asset's source.

**Consequence, stated plainly and reported as a DEVIATION rather than silently "fixed":** there are
**ZERO** `BrollEv` beats on this clip. B-roll coverage is **0 %** and base-showing is **100 %**, which
is deliberately outside the finalized-short checklist's item #4 (~25-35 % zone/full coverage) and
outside its "full-screen at the hook, 1-3x" clause. That deviation rides on Mike's own batch-level
instruction; it is NOT a coverage failure being papered over, and it must NOT be "restored" from this
file. The two sibling clips that finished before this one (1 and 3) reported the same deviation.

Everything visual below is either a **true-alpha PNG overlay** (subject on a transparent background,
composited over the live base) or a **code-drawn badge**. None fills the content zone.

## ⛔⛔ THE HARD CONTENT GUARD ON THIS CLIP (clip-plan + tighten-plan, non-negotiable)

1. **"700 million" and "1.8 million" are a FUTURE HYPOTHETICAL** Mike is imagining, framed by "I'm
   going to be like, holy crap...". They are NOT a position he holds and NOT a realised trade. The
   tighten plan states it as a formal caption guard: *"never caption or title it as a realised
   trade."* **AS BUILT: the numbers appear NOWHERE except inside his own sentence in the captions,
   and the 34.90-38.55 s stretch that contains them is the ONE deliberately GRAPHIC-FREE beat of the
   clip.** No badge, no arrow, no multiplier, no "700M vs 1.8M" juxtaposition, no colour highlight on
   the figures (the colorize set is `r=degen,die,dies gr=early` precisely so nothing draws the eye to
   the numbers as if they were a receipt). See "Beat table" row 7 and "Deliberately empty beats".
2. **The token is deliberately UNNAMED** ("this particular token"). No ticker, no logo, no project
   identity is attached anywhere, and nothing is guessed from elsewhere in the stream. The
   reference-image gate below records this as the reason it returns EMPTY.
3. **The contrast is anti-degen, not anti-trading** (Mike swing-trades). No on-screen element frames
   trading itself as wrong; the badges name the two-week-flip *mindset*, never trading.
4. **Never frame his own entries as a timing mistake.** "so freaking early" is a WIN, so its beat gets
   the sunrise overlay and the closing badge reads `THE GOAL / EARLY`, forward-looking.
5. The impact sibling **clip 8** carries Mike's verbatim retitle "My portfolio is filled with 100x
   coins." That claim is NOT in this audio and is **not imported** into any element here.

## Base layout (MEASURED on this clip, not assumed)

Row-mean gradient scan at t = 0.4 / 3 / 6 / 9 / 14 / 18 / 21 / 25 / 28 / 31 / 35 / 39 / 43 s: the hard
screen-share/webcam seam is on row **854** in eleven of thirteen frames and 853 in the other two
(delta 166-200). So:

- `TUT_FED_SEAM = 854` — content zone 0..854, webcam below.
- `TUT_FED_CAP_Y = 905` — caption centre, 51 px under the seam. At font 74 / stroke 13 the glyph box
  spans roughly rows 855-955, i.e. on his hair and the very top of his head. **His eyes sit at rows
  ~1140-1380 on every sampled frame, so captions never cover them.**

**Content-zone contents (this is what the overlays must not bury):** ONE continuous screen-share for
the whole clip, a DEXScreener **YOLO/WETH (Robinhood chain, Uniswap v3)** page:
- rows ~10-430: the price/market-cap candle chart plus its toolbar
- rows ~440-854: the live Transactions table (date / type / USD / YOLO / WETH / price / trader / txn)
- x 860-1080: the right stats rail (price, liquidity, FDV, mkt cap, txns) with a third-party ad panel

**There is NO picture cut anywhere in this clip.** Verified, not assumed: an 8 fps mean-|delta| scan of
the content-zone crop over all 346 sampled frames peaks at **1.12** (the largest deltas are just the
transaction table's ticker rows rolling); clip 3's real picture cuts measured 111.9 by the same method,
i.e. ~100x larger. So there is no cut to hang a whoosh on, and the two whooshes below are hung on
MEASURED AUDIO JOINS instead. This is also why the layout convention is:
- **code-drawn badges (opaque dark plate) sit over the Transactions table** (rows ~520-800), the
  lowest-value part of the screen-share, so the chart is never buried by a solid box;
- **alpha overlays (partly transparent, chart shows through the glow) sit over the chart** (rows
  ~110-660).

**No black-picture defect on this clip** (the batch-wide defect the coordinator flagged): `blackdetect
d=0.02:pix_th=0.10` returns nothing, and a per-frame mean-luma scan of all 1082 frames has a MINIMUM of
97.9/255 (at t 23.96) with the final frame at 111.7 and the segment join at 105.3-107.4. Nothing is
held or repaired. The stream does have four 1-2 frame PTS gaps (1.84->1.92, 10.76->10.88, 13.52->13.60,
20.16->20.24) which are the tighten/desilence joins; they are held frames, not black.

## Timeline anchors (5 ms-hop / 10 ms-window RMS on THIS spine, dual threshold -57/-52 dB)

TEN voiced spans; all NINE internal silences are true DIGITAL ZERO (-240 dBFS, the mic is gated):

| # | silence | s | what it is |
|---|---|---|---|
| 1 | 8.645-9.440 | 0.795 | **PERFORMANCE BEAT** "I don't really. [beat] I don't really trade like that." (tighten plan: preserved device, do not re-cut) |
| 2 | 10.735-11.055 | 0.320 | **THE SCATTER-GATHER JOIN**, segment 0 (master 2164.01-2177.18) -> segment 1 (master 2184.33-2223.03) |
| 3 | 13.545-13.730 | 0.185 | tighten join, master 2187.045-2187.86 (dropped the abandoned first "when") |
| 4 | 19.425-20.285 | 0.860 | tighten join, master 2194.5-2195.28 (dropped the stuttered "I want to") |
| 5 | 22.375-23.055 | 0.680 | tighten join, master 2197.65-2201.40 (dropped the abandoned restatement) |
| 6 | 26.760-27.225 | 0.465 | natural pause, 5B-owned (master 2205.510-2205.975) |
| 7 | 29.485-30.230 | 0.745 | **INSIDE THE PROTECTED PEAK** "holy crap. [beat] I was so freaking early" |
| 8 | 32.365-32.750 | 0.385 | **INSIDE THE PROTECTED PEAK** "like this [beat] particular token" |
| 9 | 33.845-34.765 | 0.920 | **INSIDE THE PROTECTED PEAK** "this particular token [beat] is like 700 million" |

⛔ **THE PROTECTED PEAK = clip-time 28.320-38.575 s** (master 2207.08-2217.20): "I'm going to be like,
holy crap, I was so freaking early, like this particular token is like 700 million and I got in at like
1.8 million." Mike's quoted-thought device and the emotional core. **Nothing may mask it: the SFX table
adds ZERO energy across the whole 10.26 s** (verified, see the SFX section), and its three internal
delivery beats (7/8/9 above) are 100 % SFX-free and 100 % graphic-free.

The clip was desilenced at min-sil 0.95 (Mike's batch call) expressly so these beats survive; the
tighten pass measured 8.94 % (under the ~10 % target) because every remaining fumble was inside a
protected beat or physically unsplittable. **Do not re-cut the spine.**

## Beat table (AS BUILT)

| # | t (s) | spoken line | element | kind | zone / placement | asset |
|---|---|---|---|---|---|---|
| T | 0.000-0.033 | (frame 0 only) | designed hook cover: generated art + CODE-drawn title "TWO WEEK PUMP / THEN DIE. / THAT'S THE / DEGEN MINDSET" + chip "I DON'T TRADE LIKE THAT" | thumbnail | full frame, ONE frame; base video from frame 1 | `thumb-tutfed.png` |
| 1 | 1.95-4.55 | "what's going to pump in the next two weeks, you know, what's going to pump and then die" | red-glowing candle spike that peaks and collapses into dying embers: the two-week pump-and-die shape | alpha PNG overlay | content zone, over the CHART, top 110 / left 420 / w 400 | `broll-tut-fed-ov-spike.png` |
| 2 | 6.83-8.50 | "that's, that's the degen mindset." | badge RED (AS BUILT): THE / DEGEN / MINDSET | code-drawn | content zone, over the TXN TABLE, centred, top 660 | none (no logo: no project is named) |
| 3 | 11.35-13.40 | "listed on all these centralized exchanges, become mainstream" | badge YELLOW (AS BUILT): EXCHANGE / LISTED / THEN MAINSTREAM | code-drawn | content zone, over the TXN TABLE, centred, top 600 | none (he says "all these centralized exchanges" generically; NO exchange is named and none is depicted) |
| 4 | 14.30-16.55 | "when retail starts coming back in, when the bull, when the bull run starts up again" | teal-glowing wave of FACELESS silhouettes surging up and forward: retail returning | alpha PNG overlay | content zone, over the CHART, top 150 / left 170 / w 470 | `broll-tut-fed-ov-crowd.png` |
| 5 | 17.10-18.95 | "and everybody's coming back in" | badge TEAL (AS BUILT): WHEN / RETAIL / COMES BACK IN | code-drawn | content zone, over the TXN TABLE, centred, top 690 | none |
| 6 | 23.60-26.30 | "you know, retail is going to be looking at all these tokens that I've just listed" | badge TEAL (AS BUILT): IN BEFORE / THEY / EVEN LOOK | code-drawn | content zone, over the TXN TABLE, centred, top 620 | none |
| 7 | 30.40-32.30 | "I was so freaking early" | sunrise just cresting a dark horizon, long warm rays: EARLY, with no number and no claim in it | alpha PNG overlay | content zone, over the CHART, top 140 / left 290 / w 470 | `broll-tut-fed-ov-dawn.png` |
| 8 | **34.90-38.55** | "is like 700 million and I got in at like 1.8 million" | **NOTHING. DELIBERATELY GRAPHIC-FREE.** | none | none | none |
| 9 | 38.90-40.10 | "that, that's what I'm looking for." | badge GREEN (AS BUILT): THE GOAL / EARLY / NOT A FLIP | code-drawn | content zone, over the TXN TABLE, centred, top 700 | none |
| 10 | 41.35-43.60 | "I'm not looking for the ones that are going to pump, you know, in two weeks and then die." | badge RED bookend of beat 2 (AS BUILT): NOT THE / 2 WEEK / PUMP AND DIE; `tOut` past the comp end so the HARD-OUT keeps full opacity (no fade, no CTA) | code-drawn | content zone, over the TXN TABLE, centred, top 640 | none |

**Deliberately empty beats (the base carries them, no graphic at all):** 0.00-1.95, 4.55-6.83,
8.50-11.35 (both limbs of the "I don't really" performance beat and the whole scatter-gather join),
13.40-14.30, 16.55-17.10, 18.95-23.60 (a 4.65 s graphic-free stretch), 26.30-30.40 (which covers the
"holy crap" beat and the 0.745 s pause inside the protected peak), **34.90-38.55 (the hypothetical
numbers, see the content guard)**, 40.10-41.35.

### Collision matrix (Phase 7 rule #3: time AND space)

Windows in order: `0.000-0.033` (thumb) / `1.95-4.55` / `6.83-8.50` / `11.35-13.40` / `14.30-16.55` /
`17.10-18.95` / `23.60-26.30` / `30.40-32.30` / `38.90-40.10` / `41.35-43.60`.
**No two windows overlap.** Smallest separation 0.55 s (beat 4 -> beat 5); every other gap is >= 0.85 s.
Nothing starts before the thumb frame ends, and `LivestreamShort` suppresses overlays AND badges while
the thumb is up anyway. No watermark plate and no logo-reveal plate is used on this clip (a corner
plate would sit on the DEXScreener toolbar), so the frame-0 cover carries no other graphic at all.
Vertically the two families never share a band even though they never share a frame: alpha overlays
live at rows ~110-660 over the chart, badge plates at rows ~480-820 over the transaction table.
All three protected-peak delivery beats (29.485-30.230, 32.365-32.750, 33.845-34.765) fall in
graphic-free gaps of this matrix.

## Reference-image gate (run LIVE against `schedule-tweets/images/reference/`)

**Named projects/coins/people in this clip: NONE.** The transcript names no token, no ticker, no
exchange, no person: the subject is "this particular token", deliberately unnamed, and the exchanges
are "all these centralized exchanges". The gate was still run live and the directory does hold plenty
of real marks (kaspa-logo.png, TUT-tutorial.jpg, robinhood, doginme, ...) — **none of them belongs on
this clip and none is used.** Attaching any of them would invent an identity the audio does not claim
and would break content guard #2.

Consequences enforced in the generation prompts: every overlay is an OBJECT or a FACELESS silhouette
mass; no coin, no crypto mark, no wordmark, no ticker, no digits, no lettering, no human face.
(The base video's own screen-share does show a third-party token page, but that is Mike's real
footage, untouched, not an authored element.)

## Generation

`repurpose/generate-broll-reload.js` (ChatGPT pool purpose `broll`), inside the `chatgpt` stage lock,
one item per invocation, straight into `video-creation/shorts/tutorial/render-assets/`. The three
overlay subjects are prompted **"brightly glowing, fully opaque, centred, on a PURE SOLID BLACK
(#000000) background and nothing else, no checkerboard"** and then converted to real RGBA with
alpha = boosted luminance (`_make_alpha_overlays.py`, the SKILL's "Transparent overlays" method —
never prompt ChatGPT for transparency, it bakes a painted checkerboard). `blend: 'normal'` on every
overlay, because the DEXScreener page is near-white in places and a screen blend cannot darken white.
The cover art is generated WITHOUT text; the title and chip are drawn in CODE on top.

md5 all four PNGs after generation to prove zero duplicate captures, and persona-inspect every one
before rendering (no real crypto logo, no real face, no baked text).

## SFX AS BUILT (>= 2 distinct refs required; 6 events, 4 distinct files, all from `video-creation/assets/sfx/`)

Cue points are each file's own MEASURED CREST, not its file start. Envelopes measured on this machine
at 0.1 s RMS / 0.01 s hop, 16 kHz mono:

| file | dur | crest | crest level |
|---|---|---|---|
| `transition_rapid_whoosh.mp3` | 0.97 | 0.15 | -17.4 dB |
| `Cinematic Whoosh 02.wav` | 2.24 | 0.78 | -13.7 dB |
| `DING-093.wav` (0.12 s fade-out variant) | 0.93 | 0.17 | -15.7 dB |
| `Impacts/Impact_Hit_01-2-short.wav` | 0.55 | 0.09 | -11.5 dB |

| t (cue) | crest | cue | file |
|---|---|---|---|
| 0.00 | 0.15 | frame-0 cover cut into the video (crest lands in the 0.145 s head silence) | `transition_rapid_whoosh.mp3` |
| 1.74 | 1.91 | the SPIKE overlay pop (beat 1); crest sits in the measured -61 dB trough at 1.895-1.920 between "term" and "what's" | `DING-093.wav` |
| 6.735 | 6.825 | the DEGEN badge reveal (beat 2) = the clip's title line; crest sits in the measured -57 dB trough at 6.815-6.835 between "you know," and "that's" | `Impacts/Impact_Hit_01-2-short.wav` |
| 10.74 | 10.89 | **THE MAJOR TRANSITION**: the scatter-gather join; crest dead centre of the 0.320 s digital-zero silence 10.735-11.055 | `transition_rapid_whoosh.mp3` |
| 19.07 | 19.85 | the pivot from the market cycle to his own strategy; crest inside the 0.860 s digital-zero silence 19.425-20.285, and its slow -71 dB pre-ramp builds under "coming back in" | `Cinematic Whoosh 02.wav` |
| 38.585 | 38.675 | **THE PAYOFF HIT** on "that, that's what I'm looking for" — starts 0.010 s AFTER the protected peak ends (38.575) so the peak measures exactly zero added energy | `Impacts/Impact_Hit_01-2-short.wav` |

**Not placed, deliberately, with the reason:**
- **No riser anywhere.** The contract asks for a riser building into an impact where a payoff lands.
  On this clip the only payoff worth building into is the protected peak (28.320-38.575), and any
  riser long enough to build would have to run INSIDE it and add energy there. Timing, not volume, is
  the knob, and here no timing exists: so the riser is dropped rather than the guard.
- **No cue inside 28.320-38.575** (the protected peak) and none inside the 0.795 s performance beat
  8.645-9.440. Both measure -240 dB added energy = exactly zero.
- **The hard-out is dry.** Nothing is placed on "in two weeks and then die" (41.82-43.15): the clip
  bookends itself and the last transient in the build is 4.5 s earlier.
- No whoosh on the 13.545 / 22.375 tighten joins: the picture does not cut there (proved above) and a
  transient on every audio join is the "impact on every edit" fatigue the library's own guidance warns
  about.

Every cue was A/B'd **OFFLINE** against an encode-matched control (the bare spine pushed through the
same 48 kHz/AAC chain as the render) on short staggered windows, before any render, so a masking cue
cost zero renders. The sweep and its losing candidates are recorded in
`remotion/src/constants-tut-freaking-early-not-degen.ts`. Where a cue masked, it was RETIMED or
DELETED, never merely turned down (volume is the wrong knob, proven six times now); and no `dur`
window is used as a fade, because `dur` TRUNCATES at full level (clip 1 + clip 6 both measured the
truncation click louder than the speech after it) — every cue's `dur` is at or past its file's own
decay, and the pre-faded library variants (`DING-093.wav`, `Impact_Hit_01-2-short.wav`) are used
rather than hard windows on their parents.

## Captions

Built ONLY by the canonical skill, never hand-authored:

```
python video-creation/skills/captions/build_captions.py \
  --words video-creation/shorts/tutorial/freaking-early-not-degen/whisper-words-verified.json \
  --style montserrat --var CAPTIONS_TUT_FED \
  --colorize 'r=degen,die,dies gr=early' --max-secs 2.00 \
  --out video-creation/remotion/src/captionsTutFed.ts
```

52 captions, median on-screen 0.78 s, mean 0.83 s. The clip-folder copy
(`captions-freaking-early-not-degen.ts`) is byte-identical.

- The three STT fixes live in the tool's `PHRASE_CORRECTIONS` (tutorial clip-4 block): `the dj
  mindset -> the degen mindset` (the TITLE line), `centralized stations -> centralized exchanges`
  (the tighten plan's caption gate names this span), and `like that listed -> like that. listed`
  (a real sentence end that also stops the scatter-gather seam welding two sentences into one
  caption across a 0.320 s gap, which is under the 0.45 s break).
- The two market caps are merged to keep each figure whole (`700 million`, `1.8 million.`), house
  style for a market cap. **No "$" is added and no multiplier is computed.**
- `PROTECTED_DOUBLES` gained `("know","thats","thats","the")`: the canonical stutter-collapse was
  eating the second "that's" of "you know, that's, that's the degen mindset", which the tighten plan
  lists under "PRESERVED DEVICES, do not dedupe in captions".
- `--max-secs 2.00` is a GUARD, verified byte-identical to leaving it OFF. This clip has no
  stretched-word defect (longest held word 0.57 s, "particular"), so nothing binds; 2.00 is chosen
  because it sits ABOVE the longest protected group word-span (1.765 s, "this particular token",
  which straddles the 0.385 s delivery beat inside the protected peak), so the rail can never split a
  protected beat.
- Word JSON audit: **zero words restored** (this clip's shipped pass does NOT drop speech — 165
  tokens against an independent medium.en pass's 165, 1:1, three lexical differences only). What
  `_patch_words.py` does instead is re-anchor **20 misaligned edges** to 5 ms RMS; the one that
  actually changes the screen is `listed`/`and` at 26.760/27.225 (shipped gap 0.000 s vs measured
  0.465 s), which is what makes the caption break fire where he pauses.

## Reconciliation (re-check before every render)

Every beat above has an asset; every asset is referenced in
`remotion/src/constants-tut-freaking-early-not-degen.ts`; every comp ref exists in `render-assets/`.
Zero orphans, both directions — the gate enforces it. The gate's "unreferenced assets (orphans)" WARN
will list the OTHER clips' `broll-*` / `thumb-*` files because the public dir is shared across the
batch; that is expected and benign, not a failure.
